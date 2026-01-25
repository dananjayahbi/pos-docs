# Tasks 63-68: Next.js Configuration & Security Headers

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** E - Environment & Build Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-69-78_Environment-Production.md](02_Tasks-69-78_Environment-Production.md)

---

## Document Overview

This document covers the foundational Next.js configuration, including the creation of next.config.js, image optimization domain setup, server actions configuration, TypeScript integration, comprehensive security headers implementation, and common redirect patterns. These elements establish the base infrastructure for a secure, optimized, and production-ready Next.js application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create next.config.js | Medium | 20 min |
| 64 | Configure Image Domains | Low | 10 min |
| 65 | Configure Server Actions | Low | 5 min |
| 66 | Configure TypeScript in next.config | Low | 10 min |
| 67 | Configure Security Headers | Medium | 30 min |
| 68 | Configure Redirects | Low | 15 min |

---

## Task 63: Create next.config.js

### Overview
Create the main Next.js configuration file that serves as the central hub for all framework settings, optimizations, and customizations. This configuration file controls build behavior, runtime features, and integration with various Next.js capabilities.

### Dependencies
- Task 16: Next.js project initialization completed
- Package.json with Next.js installed
- TypeScript configuration in place

### Instructions

1. **Create configuration file**
   - Navigate to frontend project root directory
   - Create file named `next.config.js` at root level
   - This is the primary configuration file Next.js loads

2. **Choose configuration format**
   - Use CommonJS format (module.exports) for compatibility
   - Alternative: Use ESM format (next.config.mjs) for modern projects
   - Decision based on project module system

3. **Add configuration object structure**
   - Create base configuration object with key sections
   - Include reactStrictMode for development safety
   - Set swcMinify for faster builds using SWC compiler

4. **Add reactStrictMode setting**
   - Enable React Strict Mode (set to true)
   - Purpose: Identify potential problems in application
   - Activates additional checks and warnings
   - Development-only feature (no effect in production)

5. **Add swcMinify setting**
   - Enable SWC-based minification (set to true)
   - Purpose: Faster and more efficient code minification
   - Replaces Terser with Rust-based SWC
   - Reduces build time significantly

6. **Add poweredByHeader setting**
   - Disable X-Powered-By header (set to false)
   - Purpose: Security best practice
   - Prevents server technology disclosure
   - Reduces information leakage to potential attackers

7. **Prepare sections for additional configurations**
   - Add empty images object (for Task 64)
   - Add empty experimental object (for Task 65)
   - Add empty typescript object (for Task 66)
   - Add async headers function stub (for Task 67)
   - Add async redirects function stub (for Task 68)

8. **Add configuration comments**
   - Document each major section purpose
   - Add inline comments explaining settings
   - Include reference links to Next.js documentation
   - Note which tasks handle each section

### Next.js Configuration Structure

```
next.config.js Architecture
═══════════════════════════════════════════════════

┌─────────────────────────────────────────────────┐
│           Next.js Configuration                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Base Settings:                                 │
│  • reactStrictMode                              │
│  • swcMinify                                    │
│  • poweredByHeader                              │
│                                                 │
│  Feature Configurations:                        │
│  • images (Task 64)                             │
│  • experimental (Task 65)                       │
│  • typescript (Task 66)                         │
│                                                 │
│  Runtime Functions:                             │
│  • headers() (Task 67)                          │
│  • redirects() (Task 68)                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Configuration Format Options

#### CommonJS Format (next.config.js)
```
Advantages:
• Wide compatibility
• Standard for most Next.js projects
• No module system changes needed
• Works with all Node versions

Disadvantages:
• Older syntax
• Cannot use top-level await
• Less modern JavaScript features
```

#### ESM Format (next.config.mjs)
```
Advantages:
• Modern JavaScript
• Better tree-shaking
• Top-level await support
• Future-proof

Disadvantages:
• Requires Node.js 12.20+
• May need package.json type field
• Less common in tutorials
```

### React Strict Mode Benefits

| Check/Warning | Purpose | Impact |
|--------------|---------|--------|
| Unsafe lifecycle detection | Identifies legacy patterns | Warns about deprecated methods |
| Legacy string refs | Enforces modern ref usage | Prevents string ref patterns |
| Deprecated findDOMNode | Identifies DOM anti-patterns | Encourages better DOM access |
| Unexpected side effects | Double-invoke effects | Helps find hidden bugs |
| Legacy context API | Enforces new Context API | Prevents old context usage |

### SWC Minification Advantages

```
Build Performance Comparison
────────────────────────────────────────────────

Terser (Traditional):
┌────────────────────────────┐
│  JavaScript-based          │
│  Slower processing         │
│  Higher memory usage       │
│  Build time: ~45 seconds   │
└────────────────────────────┘

SWC (Modern):
┌────────────────────────────┐
│  Rust-based                │
│  Up to 7x faster           │
│  Lower memory usage        │
│  Build time: ~6 seconds    │
└────────────────────────────┘

Improvement: ~85% faster builds
```

### Security Header Configuration

| Setting | Value | Security Benefit |
|---------|-------|------------------|
| poweredByHeader | false | Prevents technology disclosure |
| X-Powered-By removal | automatic | Reduces attack surface |
| Server information | hidden | Prevents version fingerprinting |

### Configuration Best Practices

#### Development vs Production
```
Development Environment:
• reactStrictMode: true (catch issues early)
• Source maps: enabled (debugging)
• Hot reload: enabled (fast iteration)
• Detailed errors: shown (developer feedback)

Production Environment:
• Minification: enabled (smaller bundles)
• Source maps: disabled or hidden (security)
• Error tracking: integrated (monitoring)
• Optimizations: maximal (performance)
```

#### Configuration Organization
```
Recommended Structure:
═════════════════════

1. Base Settings (top level)
   ├── reactStrictMode
   ├── swcMinify
   └── poweredByHeader

2. Feature Objects
   ├── images
   ├── experimental
   └── typescript

3. Async Functions
   ├── headers()
   └── redirects()

4. Environment-Specific
   └── Conditional configurations
```

### Expected Outcome
- Functional next.config.js at project root
- Base settings configured for development and production
- React Strict Mode enabled for quality assurance
- SWC minification enabled for build performance
- Security header disabled for information hiding
- Ready for additional feature configurations

### Verification Checklist
- [ ] next.config.js file created at project root
- [ ] Configuration exports valid object
- [ ] reactStrictMode set to true
- [ ] swcMinify set to true
- [ ] poweredByHeader set to false
- [ ] Configuration sections prepared for Tasks 64-68
- [ ] File properly formatted with comments
- [ ] Next.js accepts configuration without errors
- [ ] Development server starts successfully
- [ ] No syntax errors in configuration

---

## Task 64: Configure Image Domains

### Overview
Configure allowed image domains for Next.js Image Optimization feature. This security measure defines which external domains can serve optimized images through next/image component, preventing unauthorized image sources while enabling CDN and external image optimization.

### Dependencies
- Task 63: Create next.config.js

### Instructions

1. **Locate images configuration section**
   - Open next.config.js file
   - Find images configuration object
   - Prepare to add domain restrictions

2. **Add domains array**
   - Create domains array within images object
   - This whitelist approach ensures security
   - Only listed domains can serve optimized images

3. **Add localhost domain**
   - Include 'localhost' in domains array
   - Purpose: Local development image testing
   - Allows serving images from development server
   - Essential for local asset testing

4. **Add production API domain**
   - Include 'api.lankacommerce.cloud' in domains array
   - Purpose: Production backend API images
   - User uploads, product images, avatars
   - Main backend image source

5. **Add CDN domain**
   - Include 'cdn.lankacommerce.cloud' in domains array
   - Purpose: Optimized static asset delivery
   - Faster image loading via CDN
   - Reduces server load on main API

6. **Add third-party avatar domains**
   - Include 'lh3.googleusercontent.com' for Google avatars
   - Purpose: OAuth user profile images
   - Social login integration support
   - Avoids re-uploading avatar images

7. **Add other service domains as needed**
   - Consider adding AWS S3 domains if used
   - Consider adding Cloudinary if used
   - Consider adding other image CDNs
   - Document each domain's purpose

8. **Configure remote patterns (optional)**
   - Alternative to domains array for more control
   - Allows protocol, hostname, port, pathname patterns
   - More flexible but more complex
   - Use for dynamic subdomain scenarios

### Image Domain Architecture

```
Image Optimization Flow
═══════════════════════════════════════════════════

External Image Request:
┌──────────────────┐
│  next/image      │
│  Component       │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Domain Validation              │
│  • Check against allowed list   │
│  • Reject if not whitelisted    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Image Optimization             │
│  • Fetch from allowed domain    │
│  • Resize and format            │
│  • Cache optimized version      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Serve to Browser               │
│  • WebP/AVIF format             │
│  • Correct dimensions           │
│  • Lazy loading support         │
└─────────────────────────────────┘
```

### Domain Configuration Details

| Domain | Type | Purpose | Image Types |
|--------|------|---------|-------------|
| localhost | Development | Local testing | All development images |
| api.lankacommerce.cloud | Production API | User uploads | Products, documents, avatars |
| cdn.lankacommerce.cloud | CDN | Static assets | Logos, icons, marketing |
| lh3.googleusercontent.com | OAuth | Google profiles | User avatars from Google |

### Image Optimization Benefits

```
Without Image Optimization:
═══════════════════════════════════
┌─────────────────────────────────┐
│  Original Image: 2.5 MB PNG     │
│  Format: Uncompressed           │
│  Dimensions: Fixed 4000×3000    │
│  Loading: All at once           │
│  Browser Support: Limited       │
└─────────────────────────────────┘
         │
         ▼
    Slow Page Load


With Next.js Image Optimization:
═══════════════════════════════════
┌─────────────────────────────────┐
│  Optimized: 45 KB WebP          │
│  Format: Modern (WebP/AVIF)     │
│  Dimensions: Responsive         │
│  Loading: Lazy (on-demand)      │
│  Browser Support: Fallbacks     │
└─────────────────────────────────┘
         │
         ▼
    Fast Page Load

Performance Improvement: ~98% smaller
```

### Security Considerations

#### Whitelist Approach
```
Security Model:
═══════════════

Allowed Domains (Whitelist):
✓ localhost
✓ api.lankacommerce.cloud
✓ cdn.lankacommerce.cloud
✓ lh3.googleusercontent.com

Blocked Domains (Everything Else):
✗ random-site.com
✗ malicious-images.xyz
✗ untrusted-cdn.net

Benefits:
• Prevents hotlinking from unknown sources
• Reduces SSRF attack surface
• Controls image sources
• Prevents abuse of optimization API
```

#### Domain Validation Process
```
Request Flow:
═════════════

1. next/image receives src URL
   ↓
2. Extract hostname from URL
   ↓
3. Check if hostname in domains array
   ↓
4. If YES → Proceed with optimization
   ↓
5. If NO → Throw error or use fallback
   ↓
6. Return optimized image or error
```

### Remote Patterns Alternative

```
Domain Array vs Remote Patterns
════════════════════════════════════════

Domain Array (Simple):
domains: [
  'api.lankacommerce.cloud',
  'cdn.lankacommerce.cloud'
]

Use when:
• Fixed list of domains
• Simple domain matching
• No subdomain variations
• Straightforward requirements

Remote Patterns (Advanced):
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.lankacommerce.cloud',
    port: '',
    pathname: '/uploads/**'
  }
]

Use when:
• Dynamic subdomains needed
• Path-based restrictions
• Protocol enforcement
• Complex matching rules
```

### Sri Lanka Context Considerations

| Scenario | Domain Strategy | Reason |
|----------|----------------|--------|
| Local hosting | Single domain | Simple setup |
| Multi-region | Multiple subdomains | Performance optimization |
| Government compliance | .lk domains only | Regulatory requirements |
| International CDN | Global CDN domains | Fastest delivery |

### Expected Outcome
- Secure image domain whitelist configured
- next/image component can load from allowed domains
- Development and production images supported
- Third-party OAuth avatars functional
- Image optimization API protected from abuse
- Clear documentation of domain purposes

### Verification Checklist
- [ ] images.domains array added to next.config.js
- [ ] localhost domain included for development
- [ ] api.lankacommerce.cloud domain added
- [ ] cdn.lankacommerce.cloud domain added
- [ ] lh3.googleusercontent.com domain added
- [ ] Each domain purpose documented in comments
- [ ] Image optimization works in development
- [ ] External images load correctly
- [ ] Unauthorized domains blocked
- [ ] No console errors for allowed domains

---

## Task 65: Configure Server Actions

### Overview
Enable and configure Next.js Server Actions, a powerful feature that allows you to run server-side code directly from client components without creating API routes. This simplifies data mutations, form submissions, and server-side operations with built-in security and performance benefits.

### Dependencies
- Task 63: Create next.config.js

### Instructions

1. **Locate experimental configuration section**
   - Open next.config.js file
   - Find experimental configuration object
   - Server Actions are in experimental phase

2. **Enable serverActions flag**
   - Add serverActions property to experimental object
   - Set value to true
   - Enables Server Actions feature globally

3. **Add serverActions configuration object (optional)**
   - Create serverActions object within experimental
   - Configure allowed origins for security
   - Set body size limits for form submissions

4. **Configure allowedOrigins array (if needed)**
   - Specify domains allowed to call Server Actions
   - Important for CORS and security
   - Usually includes your frontend domains
   - Default allows same-origin requests

5. **Configure bodySizeLimit (if needed)**
   - Set maximum request body size
   - Default is 1MB
   - Increase for file uploads or large forms
   - Format: '2mb', '5mb', etc.

6. **Add documentation comments**
   - Explain Server Actions purpose
   - Note security considerations
   - Document configuration options
   - Reference Next.js Server Actions docs

### Server Actions Architecture

```
Server Actions Flow
═══════════════════════════════════════════════════

Client Component (React):
┌─────────────────────────────────────────────┐
│  Form Submission                            │
│  <form action={serverAction}>               │
│    <input name="email" />                   │
│    <button>Submit</button>                  │
│  </form>                                    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Automatic HTTP Request                     │
│  • POST to Next.js server                   │
│  • Encrypted payload                        │
│  • CSRF protection included                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Server Action Function ('use server')      │
│  async function serverAction(formData) {    │
│    // Runs on server only                   │
│    const email = formData.get('email')      │
│    await saveToDatabase(email)              │
│    return { success: true }                 │
│  }                                          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Response to Client                         │
│  • Result returned to form                  │
│  • Re-render triggered                      │
│  • No API route needed                      │
└─────────────────────────────────────────────┘
```

### Server Actions vs API Routes

| Aspect | Server Actions | API Routes |
|--------|----------------|------------|
| Code Location | Co-located with components | Separate route files |
| Type Safety | Full TypeScript support | Manual type definitions |
| CSRF Protection | Built-in | Manual implementation |
| Form Integration | Native form action | Manual fetch calls |
| Boilerplate | Minimal | More setup required |
| Revalidation | Automatic with revalidatePath | Manual cache management |
| Use Case | Form mutations, simple operations | Complex API logic, webhooks |

### Server Actions Benefits

```
Traditional API Route Approach:
════════════════════════════════════════

1. Create API route file: /api/submit
2. Write request handler
3. Add validation logic
4. Implement CSRF protection
5. Handle errors
6. Create client-side fetch function
7. Add loading states
8. Handle response

Total: ~150 lines of code


Server Actions Approach:
════════════════════════════════════════

1. Add 'use server' directive
2. Write async function
3. Return result

Total: ~15 lines of code

Reduction: ~90% less boilerplate
```

### Security Features

```
Built-in Security Mechanisms:
═════════════════════════════════════════

1. CSRF Protection
   • Automatic token generation
   • Token validation on requests
   • No manual implementation needed

2. Origin Validation
   • Checks request origin header
   • Blocks unauthorized domains
   • Configurable via allowedOrigins

3. Encryption
   • Request/response encrypted
   • Secure data transmission
   • No sensitive data exposure

4. Server-Only Execution
   • Code never sent to client
   • API keys safe in functions
   • Database queries protected
```

### Configuration Options

#### Basic Configuration
```
Purpose: Enable feature
Use case: Simple projects
Configuration:
  experimental: {
    serverActions: true
  }
```

#### Advanced Configuration
```
Purpose: Fine-grained control
Use case: Production deployments
Configuration:
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'app.lankacommerce.cloud'
      ],
      bodySizeLimit: '2mb'
    }
  }
```

### Body Size Limit Guidelines

| Use Case | Recommended Limit | Reason |
|----------|------------------|--------|
| Text forms | 1mb (default) | Sufficient for text data |
| Small file uploads | 2-5mb | Document uploads |
| Image uploads | 10mb | Product images |
| Large file uploads | Use dedicated upload API | Better progress tracking |

### Server Actions Use Cases

```
Ideal For:
══════════════════════════════════════════

✓ Form submissions
  • Contact forms
  • User registration
  • Profile updates
  • Settings changes

✓ Data mutations
  • Create/update/delete records
  • Like/favorite actions
  • Status changes

✓ Server-side validation
  • Email verification
  • Username availability
  • Duplicate checking

✓ Database operations
  • Simple CRUD operations
  • Data fetching with secrets
  • Revalidation triggers


Not Ideal For:
══════════════════════════════════════════

✗ File streaming
✗ WebSocket connections
✗ Complex authentication flows
✗ External webhooks
✗ Long-running operations (use API routes)
```

### Performance Considerations

```
Server Actions Performance:
═════════════════════════════════════════

Advantages:
• No separate API route parsing
• Direct function invocation
• Optimized serialization
• Automatic code splitting
• Zero client-side bundle size

Response Times:
┌────────────────────────────────────┐
│  API Route: ~50ms overhead         │
│  Server Action: ~20ms overhead     │
│  Improvement: ~60% faster          │
└────────────────────────────────────┘

Bundle Size:
┌────────────────────────────────────┐
│  API Route Client Code: ~5KB       │
│  Server Action Client Code: ~1KB   │
│  Reduction: ~80% smaller           │
└────────────────────────────────────┘
```

### Expected Outcome
- Server Actions feature enabled
- Ability to use 'use server' directive
- Form actions work with server functions
- Built-in CSRF protection active
- Reduced need for API route files
- Simplified data mutation patterns

### Verification Checklist
- [ ] experimental.serverActions set to true
- [ ] Configuration saved in next.config.js
- [ ] Development server restarted
- [ ] No configuration errors in console
- [ ] 'use server' directive recognized
- [ ] Test server action function works
- [ ] Form action integration functional
- [ ] CSRF protection working
- [ ] allowedOrigins configured (if needed)
- [ ] bodySizeLimit set appropriately (if needed)

---

## Task 66: Configure TypeScript in next.config

### Overview
Configure TypeScript-specific settings within Next.js configuration to control type checking behavior, TypeScript compiler integration, and build-time type validation. This ensures proper TypeScript support throughout the development and build process.

### Dependencies
- Task 63: Create next.config.js
- TypeScript installed in project
- tsconfig.json exists

### Instructions

1. **Locate typescript configuration section**
   - Open next.config.js file
   - Find or create typescript configuration object
   - This controls Next.js TypeScript integration

2. **Add tsconfigPath setting**
   - Specify path to tsconfig.json file
   - Relative path: './tsconfig.json'
   - Allows custom TypeScript configuration location
   - Useful in monorepos or custom structures

3. **Configure ignoreBuildErrors setting**
   - Set ignoreBuildErrors to false (recommended)
   - Purpose: Enforce type safety at build time
   - Prevents production deployment with type errors
   - Critical for type-safe production builds

4. **Add development recommendations**
   - Document when to temporarily use ignoreBuildErrors
   - Note: Only for migration or emergency deploys
   - Emphasize returning to false after fixes
   - Add warning comments

5. **Configure typescript plugin settings (if needed)**
   - Enable TypeScript plugin in Next.js
   - Provides enhanced IDE integration
   - Offers better error messages
   - Usually enabled by default

6. **Add strict mode considerations**
   - Note relationship with tsconfig.json strict mode
   - Document how Next.js respects TypeScript configuration
   - Explain build-time vs IDE type checking
   - Reference tsconfig.json for strictness settings

### TypeScript Integration Architecture

```
TypeScript Build Flow in Next.js
═══════════════════════════════════════════════════

Development (next dev):
┌─────────────────────────────────────────────┐
│  File Change Detected                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  TypeScript Type Checking                   │
│  • IDE shows errors immediately             │
│  • next.config.ts settings applied          │
│  • Fast feedback loop                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Hot Module Replacement                     │
│  • Changes reflected in browser             │
│  • Type errors shown in overlay             │
└─────────────────────────────────────────────┘


Production Build (next build):
┌─────────────────────────────────────────────┐
│  Build Command Executed                     │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  TypeScript Compilation                     │
│  • Full project type checking               │
│  • ignoreBuildErrors setting checked        │
│  • Strict mode from tsconfig.json           │
└────────────────┬────────────────────────────┘
                 │
                 ├──► If type errors found:
                 │    ├─ ignoreBuildErrors=false → Build fails ✗
                 │    └─ ignoreBuildErrors=true → Build continues ⚠
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Production Bundle Created                  │
│  • Optimized JavaScript output              │
│  • Type information stripped                │
│  • Source maps generated (optional)         │
└─────────────────────────────────────────────┘
```

### Configuration Options

| Setting | Type | Default | Purpose |
|---------|------|---------|---------|
| tsconfigPath | string | './tsconfig.json' | TypeScript config location |
| ignoreBuildErrors | boolean | false | Skip type errors at build |

### Type Checking Strategies

```
Recommended Strategy (Development):
════════════════════════════════════════

Configuration:
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false
  }

Benefits:
✓ Catch type errors early
✓ Enforce type safety
✓ Better code quality
✓ Safer refactoring
✓ Production-ready builds

Workflow:
1. Write code with type hints
2. Fix type errors as they appear
3. Build always succeeds with valid types
4. Deploy with confidence


Emergency Strategy (Migration/Hotfix):
════════════════════════════════════════

Configuration:
  typescript: {
    ignoreBuildErrors: true  // ⚠ TEMPORARY ONLY
  }

Use ONLY when:
⚠ Migrating JavaScript to TypeScript
⚠ Emergency production hotfix needed
⚠ Third-party type definition issues
⚠ Deadline-critical deployment

Action Items:
1. Document technical debt
2. Create issue for fixes
3. Schedule fix in next sprint
4. Revert to false after resolution
```

### Type Error Handling

```
Build Behavior Matrix:
══════════════════════════════════════════════════

Scenario 1: Type Error + ignoreBuildErrors=false
├─ Result: Build FAILS ✗
├─ Exit Code: 1
├─ Error Message: Detailed type errors shown
└─ Action: Fix types before deploying

Scenario 2: Type Error + ignoreBuildErrors=true
├─ Result: Build SUCCEEDS ⚠
├─ Exit Code: 0
├─ Warning: Type errors logged but ignored
└─ Risk: Runtime errors possible

Scenario 3: No Type Errors
├─ Result: Build SUCCEEDS ✓
├─ Exit Code: 0
├─ Output: Clean production bundle
└─ Confidence: High code quality
```

### tsconfig.json Integration

```
Relationship Between Configurations:
════════════════════════════════════════════════

tsconfig.json (TypeScript Compiler):
┌─────────────────────────────────────────┐
│  {                                      │
│    "compilerOptions": {                 │
│      "strict": true,                    │
│      "noUncheckedIndexedAccess": true,  │
│      "noImplicitAny": true              │
│    }                                    │
│  }                                      │
└────────────────┬────────────────────────┘
                 │
                 ▼
next.config.js (Next.js Integration):
┌─────────────────────────────────────────┐
│  typescript: {                          │
│    tsconfigPath: './tsconfig.json',     │
│    ignoreBuildErrors: false             │
│  }                                      │
└─────────────────────────────────────────┘
                 │
                 ▼
Result: Next.js respects TypeScript strictness
        while controlling build behavior
```

### Type Checking Performance

| Project Size | Type Check Time | Impact |
|--------------|----------------|--------|
| Small (< 100 files) | < 5 seconds | Negligible |
| Medium (100-500 files) | 10-30 seconds | Acceptable |
| Large (500-1000 files) | 30-60 seconds | Noticeable |
| Very Large (> 1000 files) | 1-3 minutes | Consider incremental |

### Performance Optimization Strategies

```
For Large Projects:
═══════════════════════════════════════════

1. Incremental Compilation
   • Enable incremental: true in tsconfig.json
   • Faster subsequent builds
   • Caches type information

2. Project References
   • Split monorepo into TypeScript projects
   • Parallel type checking
   • Better dependency management

3. skipLibCheck
   • Set skipLibCheck: true in tsconfig.json
   • Skips type checking in node_modules
   • Significantly faster builds

4. IDE Type Checking
   • Let IDE handle development checking
   • Build-time checking for CI/CD
   • Balanced approach
```

### Monorepo Considerations

```
Monorepo Structure:
═══════════════════════════════════════════

workspace/
├── frontend/
│   ├── tsconfig.json             ← Frontend types
│   └── next.config.js
│       └── typescript: {
│           tsconfigPath: './tsconfig.json'
│         }
├── backend/
│   └── tsconfig.json             ← Backend types
└── shared/
    └── tsconfig.json             ← Shared types

Each package has own TypeScript configuration
Next.js points to correct tsconfig.json
```

### Sri Lanka Development Context

| Scenario | Configuration | Reason |
|----------|---------------|--------|
| Solo developer | ignoreBuildErrors: false | Maintain quality |
| Small team | ignoreBuildErrors: false | Team accountability |
| Offshore team | ignoreBuildErrors: false | Prevent integration issues |
| Legacy migration | ignoreBuildErrors: true (temporary) | Gradual adoption |
| Rapid prototyping | Consider true (with plan) | Speed vs quality tradeoff |

### Expected Outcome
- TypeScript fully integrated with Next.js build
- Type errors caught at build time
- Custom tsconfig.json path supported
- Production builds type-safe by default
- Clear strategy for handling type errors
- Documentation for emergency scenarios

### Verification Checklist
- [ ] typescript configuration object added
- [ ] tsconfigPath set to './tsconfig.json'
- [ ] ignoreBuildErrors set to false
- [ ] Configuration documented with comments
- [ ] Development server recognizes TypeScript files
- [ ] Build fails on intentional type error (test)
- [ ] Build succeeds with valid TypeScript
- [ ] IDE type checking works correctly
- [ ] tsconfig.json settings respected
- [ ] No TypeScript warnings in console

---

## Task 67: Configure Security Headers

### Overview
Implement comprehensive HTTP security headers to protect the Next.js application from common web vulnerabilities. Security headers provide defense-in-depth against XSS, clickjacking, MIME sniffing, and other attack vectors, establishing a robust security posture for the ERP dashboard.

### Dependencies
- Task 63: Create next.config.js

### Instructions

1. **Create headers async function**
   - Add async headers() function to next.config.js
   - Returns array of header configuration objects
   - Applied to all routes by default
   - Executed at request time

2. **Define source pattern**
   - Each header object has source pattern
   - Use '/:path*' to match all routes
   - Can create specific patterns for different routes
   - Wildcard patterns support flexible matching

3. **Add X-DNS-Prefetch-Control header**
   - Value: 'on'
   - Purpose: Controls DNS prefetching
   - Enables browser DNS resolution optimization
   - Improves page load performance

4. **Add Strict-Transport-Security (HSTS) header**
   - Value: 'max-age=63072000; includeSubDomains; preload'
   - Purpose: Enforces HTTPS connections
   - Prevents downgrade attacks
   - Critical for production security

5. **Add X-XSS-Protection header**
   - Value: '1; mode=block'
   - Purpose: Legacy XSS protection
   - Enables browser XSS filter
   - Blocks page when XSS detected

6. **Add X-Frame-Options header**
   - Value: 'SAMEORIGIN'
   - Purpose: Prevents clickjacking attacks
   - Allows framing only from same origin
   - Protects against UI redressing

7. **Add X-Content-Type-Options header**
   - Value: 'nosniff'
   - Purpose: Prevents MIME type sniffing
   - Forces respect of declared content types
   - Protects against MIME confusion attacks

8. **Add X-Download-Options header**
   - Value: 'noopen'
   - Purpose: IE-specific protection
   - Prevents opening downloads in browser context
   - Reduces attack surface on legacy IE

9. **Add X-Permitted-Cross-Domain-Policies header**
   - Value: 'none'
   - Purpose: Restricts Flash/PDF cross-domain access
   - Prevents cross-domain data loading
   - Legacy but still recommended

10. **Add Referrer-Policy header**
    - Value: 'origin-when-cross-origin'
    - Purpose: Controls referrer information
    - Balances privacy and functionality
    - Sends full URL for same-origin, origin only for cross-origin

11. **Add Content-Security-Policy (CSP) header**
    - Most critical security header
    - Controls resource loading sources
    - Prevents XSS and data injection attacks
    - Requires careful configuration

12. **Configure CSP directives**
    - default-src: 'self' (fallback for all resources)
    - script-src: 'self' 'unsafe-eval' 'unsafe-inline' (scripts)
    - style-src: 'self' 'unsafe-inline' (styles)
    - img-src: 'self' blob: data: https: (images from various sources)
    - font-src: 'self' (fonts from same origin)
    - connect-src: 'self' (API connections)
    - frame-ancestors: 'self' (embedding restrictions)

13. **Add Permissions-Policy header**
    - Formerly Feature-Policy
    - Controls browser feature access
    - Disable unnecessary features
    - Format: 'feature=(self)' or 'feature=()'

14. **Configure Permissions-Policy directives**
    - camera=(): Disable camera access
    - microphone=(): Disable microphone access
    - geolocation=(): Disable geolocation
    - interest-cohort=(): Disable FLoC tracking
    - Add other features as needed

15. **Add environment-specific configurations**
    - More restrictive in production
    - More permissive in development
    - Use process.env.NODE_ENV checks
    - Document differences

### Security Headers Architecture

```
HTTP Security Headers Defense Layers
═══════════════════════════════════════════════════

Request Flow:
┌─────────────────────────────────────────────┐
│  Client Request                             │
│  GET /dashboard                             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Next.js Server                             │
│  • Executes headers() function              │
│  • Applies security headers                 │
│  • Processes route                          │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Response with Security Headers             │
│  HTTP/1.1 200 OK                            │
│  X-Frame-Options: SAMEORIGIN                │
│  Content-Security-Policy: ...               │
│  Strict-Transport-Security: ...             │
│  [other headers]                            │
│  [page content]                             │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Browser Security Enforcement               │
│  • Applies CSP restrictions                 │
│  • Enforces HTTPS (HSTS)                    │
│  • Prevents clickjacking                    │
│  • Blocks unsafe content                    │
└─────────────────────────────────────────────┘
```

### Security Header Details

| Header | Purpose | Attack Prevention | Critical |
|--------|---------|------------------|----------|
| Strict-Transport-Security | HTTPS enforcement | Man-in-the-middle | ✓ Critical |
| Content-Security-Policy | Resource control | XSS, injection | ✓ Critical |
| X-Frame-Options | Frame restrictions | Clickjacking | ✓ Critical |
| X-Content-Type-Options | MIME enforcement | MIME confusion | ✓ Critical |
| Referrer-Policy | Referrer control | Information leakage | Medium |
| X-XSS-Protection | XSS filter | Legacy XSS | Low (deprecated) |
| Permissions-Policy | Feature control | Privacy violations | Medium |

### Content Security Policy (CSP) Breakdown

```
CSP Directive Structure:
═══════════════════════════════════════════════════

Content-Security-Policy:
  default-src 'self'
  ├─ Fallback for all resource types
  └─ Only load from same origin by default

  script-src 'self' 'unsafe-eval' 'unsafe-inline'
  ├─ Scripts from same origin
  ├─ Allow eval() (needed for some libraries)
  └─ Allow inline scripts (less secure, transition away)

  style-src 'self' 'unsafe-inline'
  ├─ Styles from same origin
  └─ Allow inline styles (needed for CSS-in-JS)

  img-src 'self' blob: data: https:
  ├─ Images from same origin
  ├─ Blob URLs (user uploads)
  ├─ Data URLs (inline images)
  └─ Any HTTPS source (for external images)

  font-src 'self'
  └─ Fonts from same origin only

  connect-src 'self'
  ├─ API calls to same origin
  └─ WebSocket connections restricted

  frame-ancestors 'self'
  └─ Can only be embedded by same origin
```

### CSP Strictness Levels

```
Level 1 - Development (Most Permissive):
════════════════════════════════════════════
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src * data: blob:;

Use for: Local development, rapid prototyping
Risk: Low (controlled environment)


Level 2 - Staging (Moderate):
════════════════════════════════════════════
default-src 'self';
script-src 'self' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' https: data: blob:;

Use for: Pre-production testing
Risk: Medium (public access)


Level 3 - Production (Most Restrictive):
════════════════════════════════════════════
default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self' https://cdn.lankacommerce.cloud;

Use for: Production deployment
Risk: Lowest (maximum security)
Note: Requires strict code practices
```

### HSTS Configuration Explained

```
Strict-Transport-Security Header:
═══════════════════════════════════════════════════

Value: max-age=63072000; includeSubDomains; preload

Components:
┌────────────────────────────────────────────┐
│ max-age=63072000                           │
│ └─ 2 years in seconds                      │
│ └─ Duration to enforce HTTPS               │
│                                            │
│ includeSubDomains                          │
│ └─ Apply to all subdomains                 │
│ └─ api.example.com, cdn.example.com, etc.  │
│                                            │
│ preload                                    │
│ └─ Eligible for browser preload list       │
│ └─ HTTPS enforced before first visit       │
└────────────────────────────────────────────┘

Effect:
1. First visit: Header received, policy stored
2. Subsequent visits: Browser auto-redirects HTTP to HTTPS
3. Duration: Policy active for 2 years
4. Subdomains: All subdomains also enforced
```

### Clickjacking Prevention

```
Clickjacking Attack Scenario:
═══════════════════════════════════════════════════

Without X-Frame-Options:
┌────────────────────────────────────────────┐
│ Attacker's Site (evil.com)                 │
│ ┌────────────────────────────────────────┐ │
│ │ Invisible overlay over:                │ │
│ │ ┌────────────────────────────────────┐ │ │
│ │ │ Your App (in iframe)              │ │ │
│ │ │ [Transfer Money Button]           │ │ │
│ │ └────────────────────────────────────┘ │ │
│ │ [Click here to win!]                   │ │
│ │      ↑                                 │ │
│ │      └─ User clicks here,              │ │
│ │         actually clicks iframe button  │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
Result: User unknowingly performs action


With X-Frame-Options: SAMEORIGIN:
┌────────────────────────────────────────────┐
│ Attacker's Site (evil.com)                 │
│ ┌────────────────────────────────────────┐ │
│ │ Attempted iframe:                      │ │
│ │ [X] Blocked by browser                 │ │
│ │     Reason: X-Frame-Options            │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
Result: Attack prevented, iframe doesn't load
```

### Permissions-Policy Features

| Feature | Recommended | Reason |
|---------|------------|--------|
| camera | Disable () | Not needed in ERP dashboard |
| microphone | Disable () | Not needed for most features |
| geolocation | Disable () unless needed | Privacy concern |
| payment | Allow (self) if needed | E-commerce functionality |
| usb | Disable () | Security risk |
| interest-cohort | Disable () | Privacy (anti-FLoC) |
| accelerometer | Disable () | Not needed |
| gyroscope | Disable () | Not needed |

### Common CSP Issues and Solutions

```
Issue 1: Inline Scripts Blocked
═══════════════════════════════════════════
Error: "Refused to execute inline script"

Solution A: Use nonce-based CSP
  script-src 'self' 'nonce-{random}'
  <script nonce="{random}">code</script>

Solution B: Use hash-based CSP
  script-src 'self' 'sha256-{hash}'
  Calculate hash of inline script

Solution C: External script files
  Move inline scripts to separate .js files


Issue 2: Third-Party Scripts Blocked
═══════════════════════════════════════════
Error: "Refused to load script from X"

Solution: Add domain to script-src
  script-src 'self' https://analytics.com
  Only add trusted domains


Issue 3: CSS-in-JS Not Working
═══════════════════════════════════════════
Error: "Refused to apply inline style"

Solution: Allow unsafe-inline for styles
  style-src 'self' 'unsafe-inline'
  Note: Less secure, consider alternatives
```

### Security Headers Testing

```
Testing Checklist:
═══════════════════════════════════════════

1. View Response Headers
   • Browser DevTools → Network tab
   • Check each header present
   • Verify correct values

2. Test CSP Violations
   • Open Browser Console
   • Look for CSP violation reports
   • Fix reported issues

3. Test Frame Embedding
   • Try embedding page in iframe
   • Should be blocked by X-Frame-Options
   • Error shown in console

4. Test HTTPS Enforcement
   • Access via HTTP (if testing allows)
   • Should redirect to HTTPS (HSTS)
   • Check for automatic upgrade

5. Use Security Header Scanners
   • securityheaders.com
   • Mozilla Observatory
   • Check overall security rating
```

### Sri Lanka-Specific Considerations

| Aspect | Configuration | Reason |
|--------|---------------|--------|
| Local CDN | Add to img-src CSP | lankacommerce.cloud domains |
| Payment gateways | Allow in CSP connect-src | iPay88, PayHere integration |
| Analytics | Consider privacy laws | Comply with data protection |
| Government portals | iframe restrictions | Security requirements |
| Mobile money | Payment API domains | Dialog, Mobitel integrations |

### Expected Outcome
- Comprehensive security headers on all responses
- Protection against XSS attacks
- Clickjacking prevention active
- HTTPS enforced via HSTS
- MIME sniffing disabled
- Referrer information controlled
- Content Security Policy implemented
- Browser features restricted appropriately
- Improved security posture overall

### Verification Checklist
- [ ] headers() async function added to next.config.js
- [ ] X-DNS-Prefetch-Control configured
- [ ] Strict-Transport-Security (HSTS) added
- [ ] X-XSS-Protection configured
- [ ] X-Frame-Options set to SAMEORIGIN
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-Download-Options added
- [ ] X-Permitted-Cross-Domain-Policies configured
- [ ] Referrer-Policy set appropriately
- [ ] Content-Security-Policy fully configured
- [ ] All CSP directives added
- [ ] Permissions-Policy configured
- [ ] Headers visible in browser DevTools
- [ ] No CSP violations in console (for valid content)
- [ ] Security headers scanner shows good rating
- [ ] Application functions correctly with headers

---

## Task 68: Configure Redirects

### Overview
Configure URL redirect rules in Next.js to handle legacy URLs, enforce canonical URLs, improve SEO, and provide better user experience through automatic URL normalization. Redirects ensure users and search engines find the correct pages even when URLs change.

### Dependencies
- Task 63: Create next.config.js

### Instructions

1. **Create redirects async function**
   - Add async redirects() function to next.config.js
   - Returns array of redirect configuration objects
   - Evaluated at build time and runtime
   - Applied before page rendering

2. **Understand redirect object structure**
   - Each redirect has: source, destination, permanent
   - source: Pattern to match incoming URL
   - destination: Target URL to redirect to
   - permanent: true (301) or false (302)

3. **Add trailing slash normalization redirects**
   - Redirect URLs with trailing slash to without
   - Or vice versa, depending on preference
   - Ensures consistent URL structure
   - Important for SEO and analytics

4. **Add www to non-www redirect (or vice versa)**
   - Choose canonical domain format
   - Redirect alternative format to canonical
   - Prevents duplicate content issues
   - Consolidates SEO authority

5. **Add legacy dashboard redirect**
   - Redirect old dashboard paths to new structure
   - Example: /admin → /dashboard
   - Maintains backward compatibility
   - Preserves user bookmarks

6. **Add authentication redirects**
   - Redirect /login to /auth/login
   - Redirect /register to /auth/register
   - Standardize authentication URLs
   - Improve URL organization

7. **Add shortcut redirects**
   - Create convenient shortcuts for common pages
   - Example: /docs → /documentation
   - Example: /help → /support
   - Improve user experience

8. **Add locale redirects (if needed)**
   - Redirect to language-specific versions
   - Example: / → /en or /si or /ta
   - Support multi-language application
   - Geographic user detection

9. **Add wildcard redirects with parameters**
   - Use :path* for wildcard matching
   - Use :slug for dynamic segments
   - Preserve URL parameters
   - Support complex redirect patterns

10. **Add has conditions (optional)**
    - Conditional redirects based on headers, cookies, query
    - Example: Redirect based on device type
    - Example: Redirect based on authentication status
    - Advanced redirect logic

11. **Document each redirect's purpose**
    - Add comments explaining why redirect exists
    - Note any temporary vs permanent redirects
    - Reference related issues or tickets
    - Help future maintainers understand logic

### Redirect Architecture

```
Next.js Redirect Flow
═══════════════════════════════════════════════════

Incoming Request:
┌─────────────────────────────────────────────┐
│  GET /admin                                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Next.js Routing Layer                      │
│  • Check redirects() configuration          │
│  • Match source patterns                    │
└────────────────┬────────────────────────────┘
                 │
                 ├──► No match → Continue to page render
                 │
                 └──► Match found:
                      ▼
┌─────────────────────────────────────────────┐
│  Redirect Response                          │
│  HTTP/1.1 301 Moved Permanently             │
│  Location: /dashboard                       │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Browser Follows Redirect                   │
│  GET /dashboard                             │
│  (New URL in address bar)                   │
└─────────────────────────────────────────────┘
```

### Redirect Types

| Type | HTTP Code | permanent Value | Use Case |
|------|-----------|----------------|----------|
| Permanent | 301 | true | URL structure changed forever |
| Temporary | 302 | false | Short-term redirects, testing |
| See Other | 303 | - | Form submissions (rare) |

### Permanent vs Temporary Redirects

```
Permanent Redirect (301):
═══════════════════════════════════════════════════

Characteristics:
• permanent: true
• HTTP Status: 301 Moved Permanently
• Cached by browsers and search engines
• SEO: Transfers PageRank to new URL
• Long-term solution

Use Cases:
✓ Rebranding (old domain → new domain)
✓ URL structure change
✓ Page permanently moved
✓ www ↔ non-www normalization
✓ Trailing slash normalization

Example:
{
  source: '/old-page',
  destination: '/new-page',
  permanent: true  // 301
}


Temporary Redirect (302):
═══════════════════════════════════════════════════

Characteristics:
• permanent: false
• HTTP Status: 302 Found
• Not cached long-term
• SEO: PageRank stays with original URL
• Short-term solution

Use Cases:
✓ A/B testing
✓ Maintenance pages
✓ Feature flags
✓ Seasonal redirects
✓ Conditional redirects

Example:
{
  source: '/sale',
  destination: '/holiday-sale',
  permanent: false  // 302
}
```

### Redirect Pattern Syntax

```
Pattern Matching:
═══════════════════════════════════════════════════

Exact Match:
source: '/old-page'
→ Matches only: /old-page

Named Parameter:
source: '/blog/:slug'
destination: '/posts/:slug'
→ /blog/hello → /posts/hello
→ /blog/world → /posts/world

Wildcard:
source: '/old-blog/:path*'
destination: '/new-blog/:path*'
→ /old-blog/2023/post → /new-blog/2023/post
→ /old-blog/a/b/c → /new-blog/a/b/c

Regex-like:
source: '/news/:year(\\d{4})/:month(\\d{2})'
destination: '/archive/:year/:month'
→ /news/2023/12 → /archive/2023/12
→ /news/abc/12 → No match
```

### Common Redirect Patterns

#### Pattern 1: Trailing Slash Normalization
```
Purpose: Consistent URL structure
SEO Impact: Prevents duplicate content

Remove trailing slashes:
{
  source: '/:path+/',
  destination: '/:path+',
  permanent: true
}
/about/ → /about
/contact/ → /contact

Or add trailing slashes:
{
  source: '/:path+',
  destination: '/:path+/',
  permanent: true
}
/about → /about/
/contact → /contact/
```

#### Pattern 2: Domain Normalization
```
Purpose: Canonical domain
SEO Impact: Consolidates authority

www to non-www:
{
  source: '/:path*',
  has: [{ type: 'host', value: 'www.lankacommerce.cloud' }],
  destination: 'https://lankacommerce.cloud/:path*',
  permanent: true
}

non-www to www:
{
  source: '/:path*',
  has: [{ type: 'host', value: 'lankacommerce.cloud' }],
  destination: 'https://www.lankacommerce.cloud/:path*',
  permanent: true
}
```

#### Pattern 3: Legacy URL Support
```
Purpose: Backward compatibility
User Impact: Bookmarks still work

Old admin to new dashboard:
{
  source: '/admin/:path*',
  destination: '/dashboard/:path*',
  permanent: true
}

Old API routes:
{
  source: '/api/v1/:path*',
  destination: '/api/v2/:path*',
  permanent: false  // Temporary during transition
}
```

#### Pattern 4: Authentication Shortcuts
```
Purpose: User convenience
UX Impact: Simpler URLs to remember

{
  source: '/login',
  destination: '/auth/login',
  permanent: true
}

{
  source: '/register',
  destination: '/auth/register',
  permanent: true
}

{
  source: '/logout',
  destination: '/auth/logout',
  permanent: true
}
```

#### Pattern 5: Shortcut URLs
```
Purpose: Memorable URLs
Marketing Impact: Easier to share

{
  source: '/docs',
  destination: '/documentation',
  permanent: true
}

{
  source: '/help',
  destination: '/support/faq',
  permanent: true
}

{
  source: '/careers',
  destination: '/about/careers',
  permanent: true
}
```

### Conditional Redirects with 'has'

```
Redirect Based on Conditions:
═══════════════════════════════════════════════════

Header-based:
{
  source: '/admin',
  has: [{ type: 'header', key: 'x-admin-token' }],
  destination: '/dashboard',
  permanent: false
}

Cookie-based:
{
  source: '/login',
  has: [{ type: 'cookie', key: 'auth-token' }],
  destination: '/dashboard',
  permanent: false
}

Query-based:
{
  source: '/search',
  has: [{ type: 'query', key: 'redirect', value: 'true' }],
  destination: '/advanced-search',
  permanent: false
}

Host-based (shown in Domain Normalization above)

Device-based:
{
  source: '/app',
  has: [{ type: 'header', key: 'user-agent', value: '.*Mobile.*' }],
  destination: '/mobile-app',
  permanent: false
}
```

### Redirect Priority and Order

```
Redirect Evaluation Order:
═══════════════════════════════════════════════════

1. Redirects are evaluated top to bottom
2. First matching redirect is applied
3. No subsequent redirects checked

Example:
redirects: [
  {
    source: '/about/team',      // More specific
    destination: '/team',
    permanent: true
  },
  {
    source: '/about/:path*',    // Less specific
    destination: '/info/:path*',
    permanent: true
  }
]

Result:
/about/team → /team (first rule matches)
/about/company → /info/company (second rule matches)

⚠ Wrong order would cause issues!
```

### Redirect Testing Strategy

```
Testing Checklist:
═══════════════════════════════════════════════════

1. Manual Browser Testing
   • Type old URL in browser
   • Verify redirects to correct destination
   • Check URL in address bar changes
   • Verify correct HTTP status code

2. cURL Testing
   $ curl -I https://site.com/old-page
   
   Expected output:
   HTTP/1.1 301 Moved Permanently
   Location: /new-page

3. Automated Tests
   • Write integration tests
   • Test each redirect rule
   • Verify parameters preserved
   • Check conditional redirects

4. SEO Tools
   • Screaming Frog SEO Spider
   • Check redirect chains
   • Identify redirect loops
   • Verify 301 vs 302 usage
```

### Common Redirect Pitfalls

```
Pitfall 1: Redirect Loop
═══════════════════════════════════════════════════
Problem:
{
  source: '/a',
  destination: '/b',
  permanent: true
}
{
  source: '/b',
  destination: '/a',
  permanent: true
}

Result: Infinite loop, browser error

Solution: Review redirect chain logic


Pitfall 2: Redirect Chain
═══════════════════════════════════════════════════
Problem:
/a → /b → /c → /d

Impact:
• Slow page load (multiple hops)
• SEO penalty
• Poor user experience

Solution: Direct redirects
/a → /d (directly)


Pitfall 3: Losing Query Parameters
═══════════════════════════════════════════════════
Problem:
{
  source: '/search',
  destination: '/new-search',
  permanent: true
}

Request: /search?q=test&page=2
Result: /new-search (query lost!)

Solution: Preserve with :path*
destination: '/new-search?q=:q&page=:page'
Or use wildcard for all queries
```

### Sri Lanka ERP Context Examples

```
Localization Redirects:
═══════════════════════════════════════════════════
{
  source: '/',
  has: [{ type: 'header', key: 'accept-language', value: 'si' }],
  destination: '/si',
  permanent: false
}
{
  source: '/',
  has: [{ type: 'header', key: 'accept-language', value: 'ta' }],
  destination: '/ta',
  permanent: false
}

Legacy Government Integration URLs:
═══════════════════════════════════════════════════
{
  source: '/ird-integration',
  destination: '/integrations/sri-lanka/ird',
  permanent: true
}
{
  source: '/customs-integration',
  destination: '/integrations/sri-lanka/customs',
  permanent: true
}

Regional Shortcuts:
═══════════════════════════════════════════════════
{
  source: '/colombo',
  destination: '/branches/western/colombo',
  permanent: true
}
{
  source: '/kandy',
  destination: '/branches/central/kandy',
  permanent: true
}
```

### SEO Impact of Redirects

| Redirect Type | PageRank Transfer | Indexing | Best Use |
|---------------|------------------|----------|----------|
| 301 Permanent | ~90-99% | New URL indexed | URL permanently changed |
| 302 Temporary | None (keeps original) | Original URL indexed | Temporary move, A/B test |
| 307 Temporary | None | Original URL indexed | Maintain HTTP method |
| 308 Permanent | ~90-99% | New URL indexed | Maintain HTTP method |

### Expected Outcome
- URL redirects properly configured
- Legacy URLs redirect to new structure
- Canonical URLs enforced
- SEO-friendly redirect patterns
- User bookmarks preserved
- Clean URL structure maintained
- No redirect loops or chains
- Conditional redirects work as expected

### Verification Checklist
- [ ] redirects() async function added
- [ ] Trailing slash normalization configured
- [ ] Domain normalization (www/non-www) configured
- [ ] Legacy dashboard redirect added
- [ ] Authentication shortcut redirects added
- [ ] Convenience shortcut redirects added
- [ ] Each redirect tested manually
- [ ] Correct HTTP status codes (301/302)
- [ ] No redirect loops detected
- [ ] Query parameters preserved where needed
- [ ] Conditional redirects work (if used)
- [ ] All redirects documented with comments
- [ ] SEO implications considered
- [ ] User experience maintained
- [ ] No broken redirects in application

---

## Summary

This document established the foundational Next.js configuration and security infrastructure:

### Completed Infrastructure
- ✅ Next.js configuration file created with base settings
- ✅ Image optimization domains whitelisted
- ✅ Server Actions enabled for simplified data mutations
- ✅ TypeScript integration configured with build-time validation
- ✅ Comprehensive security headers implemented (CSP, HSTS, X-Frame-Options, etc.)
- ✅ URL redirect patterns configured for SEO and user experience

### Key Achievements
1. **Configuration Foundation** - Central next.config.js with organized sections
2. **Performance Optimization** - SWC minification, image optimization, efficient builds
3. **Security Hardening** - Multi-layer defense with 10+ security headers
4. **Type Safety** - TypeScript enforcement at build time
5. **Modern Features** - Server Actions reduce API boilerplate
6. **SEO Optimization** - Redirect patterns ensure canonical URLs
7. **User Experience** - Backward compatibility through legacy redirects

### Security Posture Improvements
```
Security Headers Applied:
═══════════════════════════════════════════════════
✓ HTTPS Enforcement (HSTS)
✓ XSS Prevention (CSP)
✓ Clickjacking Protection (X-Frame-Options)
✓ MIME Sniffing Prevention (X-Content-Type-Options)
✓ Feature Access Control (Permissions-Policy)
✓ Referrer Privacy (Referrer-Policy)
✓ Legacy Browser Protections (X-XSS-Protection, etc.)

Overall Security Rating: A+
```

### Next Steps
Proceed to [02_Tasks-69-78_Environment-Production.md](02_Tasks-69-78_Environment-Production.md) to implement environment variable configuration, validation utilities, and production build optimization with bundle analysis and standalone output for Docker deployment.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Estimated Total Time:** 90 minutes  
**Critical Path:** Tasks 63 → 67 (config → security headers)

