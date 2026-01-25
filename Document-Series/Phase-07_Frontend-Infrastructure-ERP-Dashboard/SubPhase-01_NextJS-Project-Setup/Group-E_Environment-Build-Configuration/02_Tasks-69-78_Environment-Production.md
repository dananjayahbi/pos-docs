# Tasks 69-78: Environment Variables & Production Build Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** E - Environment & Build Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-68_NextConfig-Security.md](01_Tasks-63-68_NextConfig-Security.md)

---

## Document Overview

This document covers environment variable configuration and production build optimization for the Next.js frontend application. It establishes environment variable templates, API and site URL configuration, feature flags, environment validation, production build settings, bundle analysis, and output tracing for Docker deployment.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create .env.example File | Low | 10 min |
| 70 | Create .env.local Template | Low | 10 min |
| 71 | Configure API URL Variables | Low | 15 min |
| 72 | Configure Site URL Variables | Low | 10 min |
| 73 | Configure Feature Flags | Low | 15 min |
| 74 | Create Environment Validation | Medium | 30 min |
| 75 | Configure Production Build | Medium | 25 min |
| 76 | Configure Bundle Analyzer | Low | 15 min |
| 77 | Configure Output Tracing | Low | 15 min |
| 78 | Verify Build Configuration | Low | 20 min |

---

## Task 69: Create .env.example File

### Overview
Create the `.env.example` file that serves as a template for environment variables required by the Next.js application. This file documents all environment variables, their purpose, example values, and whether they are required or optional. It is committed to version control to guide developers in setting up their local environment.

### Dependencies
- Frontend project initialized (Task 16)
- Project structure established

### Instructions

1. **Create .env.example file**
   - Navigate to frontend root directory
   - Create new file named `.env.example`
   - This file will be committed to git

2. **Add file header documentation**
   - Include comprehensive comment block at top
   - Explain purpose of environment variables
   - Note that this is a template file
   - Instruct developers to copy to .env.local

3. **Add section comments**
   - Organize variables into logical sections
   - Include: API Configuration, Site Configuration, Feature Flags, Build Configuration
   - Add clear section separators

4. **Document variable naming conventions**
   - NEXT_PUBLIC_ prefix for client-side variables
   - No prefix for server-side only variables
   - UPPERCASE_SNAKE_CASE naming style

5. **Add usage instructions**
   - Explain when to use NEXT_PUBLIC_ prefix
   - Note that NEXT_PUBLIC_ variables are embedded in client bundle
   - Warn about sensitive data in public variables

6. **Include example values**
   - Use placeholder URLs (example.com)
   - Use safe default values
   - Never include real credentials
   - Show expected format for each variable

### Environment Variable Sections

```
┌──────────────────────────────────────────────┐
│         .env.example Structure               │
├──────────────────────────────────────────────┤
│ 1. File Header & Instructions                │
│ 2. API Configuration                         │
│    • Backend API URLs                        │
│    • API versioning                          │
│ 3. Site Configuration                        │
│    • Frontend URLs                           │
│    • Domain settings                         │
│ 4. Feature Flags                             │
│    • Development features                    │
│    • Experimental features                   │
│ 5. Build Configuration                       │
│    • Bundle analyzer                         │
│    • Debug settings                          │
│ 6. Optional Variables                        │
│    • Analytics                               │
│    • Third-party integrations                │
└──────────────────────────────────────────────┘
```

### Variable Documentation Format

Each variable should include:
| Element | Purpose | Example |
|---------|---------|---------|
| Variable name | Actual environment variable | `NEXT_PUBLIC_API_URL` |
| Description | What the variable controls | Backend API base URL |
| Required/Optional | Deployment requirement | Required for production |
| Example value | Sample configuration | `https://api.example.com` |
| Notes | Additional context | Do not include /api/v1 suffix |

### Public vs Private Variables

#### NEXT_PUBLIC_ Variables (Client-Side)
```
Embedded in Browser Bundle
══════════════════════════

NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_ENABLE_ANALYTICS
NEXT_PUBLIC_ENABLE_DEBUG

⚠️ Warning: Never include secrets or sensitive data!
These are visible in browser's JavaScript bundle.
```

#### Private Variables (Server-Side Only)
```
Server-Side Only
════════════════

API_SECRET_KEY
DATABASE_URL
INTERNAL_API_TOKEN

✓ Safe: These never reach the browser.
Only accessible in server-side code and API routes.
```

### Expected Outcome
- Comprehensive environment variable template
- Clear documentation for all variables
- Guidance for new developers
- Version-controlled reference

### Verification Checklist
- [ ] .env.example file created in frontend root
- [ ] File header with instructions added
- [ ] Variables organized into sections
- [ ] All required variables documented
- [ ] Example values provided
- [ ] Public vs private distinction clear
- [ ] No real credentials included
- [ ] Comments explain each section

---

## Task 70: Create .env.local Template

### Overview
Create the `.env.local` file for local development environment variables. This file contains actual configuration values used during development and is excluded from version control via .gitignore. It should be created based on the `.env.example` template with real development values.

### Dependencies
- Task 69: Create .env.example file

### Instructions

1. **Create .env.local file**
   - Navigate to frontend root directory
   - Create new file named `.env.local`
   - This file will NOT be committed (git-ignored)

2. **Copy structure from .env.example**
   - Use .env.example as base template
   - Maintain same section organization
   - Keep same variable names

3. **Add local development values**
   - Replace example values with real localhost URLs
   - Set appropriate defaults for local development
   - Configure for local Docker services

4. **Set localhost API URLs**
   - Point to local Django backend (port 8000)
   - Include localhost in allowed origins
   - Configure for development mode

5. **Enable development features**
   - Set debug flags to true
   - Enable development-only features
   - Disable production optimizations

6. **Add developer notes**
   - Include comments for local-specific settings
   - Note which values to change for different setups
   - Document port numbers and service dependencies

7. **Verify .gitignore exclusion**
   - Ensure .env.local is in .gitignore
   - Confirm file will not be committed
   - Protect sensitive local configuration

### .env.local vs .env.example

```
┌────────────────────────────────────────────────────────────┐
│                      File Comparison                       │
├───────────────────────┬────────────────────────────────────┤
│    .env.example       │         .env.local                 │
├───────────────────────┼────────────────────────────────────┤
│ • Committed to git    │ • Git-ignored                      │
│ • Example values only │ • Real configuration               │
│ • Safe placeholders   │ • Actual URLs/tokens               │
│ • Documentation       │ • Working configuration            │
│ • Team reference      │ • Personal setup                   │
└───────────────────────┴────────────────────────────────────┘
```

### Development URL Configuration

| Service | Variable | Local Value |
|---------|----------|-------------|
| Backend API | NEXT_PUBLIC_API_URL | `http://localhost:8000/api/v1` |
| Frontend | NEXT_PUBLIC_SITE_URL | `http://localhost:3000` |
| WebSocket | NEXT_PUBLIC_WS_URL | `ws://localhost:8000/ws` |

### Local Development Settings

#### Debug Mode Enabled
```
Development Configuration
════════════════════════

NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false
ANALYZE=false

Purpose: Maximize development experience
- Show detailed error messages
- Disable external service calls
- Skip production analytics
- Fast builds without bundle analysis
```

#### Feature Flags for Development
```
Feature Flag Configuration
══════════════════════════

NEXT_PUBLIC_ENABLE_NEW_DASHBOARD=true
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=true
NEXT_PUBLIC_MOCK_API=false

Purpose: Test features in development
- Enable work-in-progress features
- Access experimental functionality
- Control API mocking
```

### Port Configuration

Standard development ports:
```
Service Ports
═════════════

Frontend (Next.js):     3000
Backend (Django):       8000
PostgreSQL:             5432
Redis:                  6379
```

### Expected Outcome
- Functional local environment configuration
- Ready-to-use development setup
- Proper localhost URLs configured
- Git-ignored for security

### Verification Checklist
- [ ] .env.local file created
- [ ] Based on .env.example template
- [ ] Localhost URLs configured
- [ ] Development flags enabled
- [ ] File is git-ignored
- [ ] All required variables present
- [ ] Port numbers match Docker configuration
- [ ] Comments added for local settings

---

## Task 71: Configure API URL Variables

### Overview
Configure environment variables for backend API URL endpoints. These variables define how the Next.js frontend communicates with the Django backend API, including base URLs, API versioning, and timeout configuration. Proper API URL configuration ensures consistent communication across all frontend components.

### Dependencies
- Task 69: Create .env.example file
- Task 70: Create .env.local template

### Instructions

1. **Add API Configuration section**
   - Open both .env.example and .env.local
   - Add clear section header for API configuration
   - Include explanatory comments

2. **Define NEXT_PUBLIC_API_URL variable**
   - Primary backend API base URL
   - Used for all API requests from client-side
   - Include /api/v1 path in URL
   - Set to localhost in .env.local
   - Use production domain in documentation

3. **Define API_URL variable (optional)**
   - Server-side only API URL
   - Used in API routes and server components
   - Can be internal Docker network URL
   - Improves performance by avoiding external routing

4. **Add API_VERSION variable**
   - Document current API version
   - Used for API compatibility checks
   - Default to 'v1'
   - Allows version negotiation

5. **Configure API_TIMEOUT variable**
   - Request timeout in milliseconds
   - Prevent hanging requests
   - Default to 30000 (30 seconds)
   - Adjust for slow endpoints

6. **Document API URL format requirements**
   - Must not include trailing slash
   - Must include protocol (http:// or https://)
   - Should include /api/v1 path segment
   - Port number for localhost

7. **Add environment-specific examples**
   - Development: localhost:8000
   - Staging: staging-api.lankacommerce.cloud
   - Production: api.lankacommerce.cloud

### API URL Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  API URL Structure                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Client-Side Requests (Browser)                          │
│  ────────────────────────────────                        │
│  NEXT_PUBLIC_API_URL → External API endpoint             │
│  Used in: useQuery, useMutation, fetch calls             │
│  Value: https://api.lankacommerce.cloud/api/v1           │
│                                                           │
│  Server-Side Requests (Next.js Server)                   │
│  ──────────────────────────────────────                  │
│  API_URL → Internal or external API                      │
│  Used in: API routes, getServerSideProps                 │
│  Value: http://backend:8000/api/v1 (Docker)              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Environment-Specific Configuration

| Environment | NEXT_PUBLIC_API_URL | API_URL (Internal) |
|-------------|---------------------|-------------------|
| Development | `http://localhost:8000/api/v1` | Same as public |
| Docker | `http://localhost:8000/api/v1` | `http://backend:8000/api/v1` |
| Staging | `https://staging-api.lankacommerce.cloud/api/v1` | Same as public |
| Production | `https://api.lankacommerce.cloud/api/v1` | Same as public |

### API Request Flow

```
Frontend Component
       │
       ├─ Client-Side Fetch
       │  └─ Uses NEXT_PUBLIC_API_URL
       │     └─ Goes through browser
       │        └─ External network
       │
       └─ Server-Side API Route
          └─ Uses API_URL
             └─ Direct container-to-container (Docker)
                └─ Internal network (faster)
```

### URL Validation Rules

```
Valid API URLs
══════════════

✓ http://localhost:8000/api/v1
✓ https://api.lankacommerce.cloud/api/v1
✓ http://backend:8000/api/v1

Invalid API URLs
════════════════

✗ http://localhost:8000/api/v1/     (trailing slash)
✗ localhost:8000/api/v1              (missing protocol)
✗ http://localhost:8000              (missing /api/v1)
✗ api.lankacommerce.cloud/api/v1     (missing protocol)
```

### Expected Outcome
- Clear API URL configuration
- Environment-appropriate values
- Optimized request routing
- Proper URL formatting

### Verification Checklist
- [ ] NEXT_PUBLIC_API_URL defined in both files
- [ ] API_URL defined (server-side)
- [ ] API_VERSION variable added
- [ ] API_TIMEOUT configured
- [ ] No trailing slashes in URLs
- [ ] Protocol included in all URLs
- [ ] /api/v1 path segment present
- [ ] Development uses localhost
- [ ] Documentation includes all environments

---

## Task 72: Configure Site URL Variables

### Overview
Configure environment variables for the frontend site URL. These variables define the canonical URL of the Next.js application, used for generating absolute URLs, Open Graph tags, canonical links, redirects, and OAuth callbacks. Proper site URL configuration is critical for SEO, social sharing, and third-party integrations.

### Dependencies
- Task 69: Create .env.example file
- Task 70: Create .env.local template

### Instructions

1. **Add Site Configuration section**
   - Add section header in environment files
   - Include explanatory comments
   - Document use cases

2. **Define NEXT_PUBLIC_SITE_URL variable**
   - Full URL of the frontend application
   - Include protocol (http:// or https://)
   - No trailing slash
   - Used for absolute URL generation

3. **Define NEXT_PUBLIC_APP_NAME variable**
   - Human-readable application name
   - Used in meta tags and page titles
   - Example: "LankaCommerce ERP"

4. **Define NEXT_PUBLIC_APP_DESCRIPTION variable**
   - Short description of application
   - Used in meta description tags
   - SEO-friendly description

5. **Configure NEXT_PUBLIC_SITE_DOMAIN variable**
   - Domain name without protocol
   - Used for cookie domain configuration
   - Example: "lankacommerce.cloud"

6. **Add environment-specific URLs**
   - Development: localhost:3000
   - Staging: staging.lankacommerce.cloud
   - Production: lankacommerce.cloud or www.lankacommerce.cloud

7. **Document URL usage contexts**
   - Absolute URL generation
   - Open Graph meta tags
   - Canonical link tags
   - OAuth redirect URIs
   - Email templates

### Site URL Usage Context

```
┌──────────────────────────────────────────────────────────┐
│              NEXT_PUBLIC_SITE_URL Usage                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. SEO Meta Tags                                         │
│     <meta property="og:url" content="${SITE_URL}/page" /> │
│     <link rel="canonical" href="${SITE_URL}/page" />      │
│                                                           │
│  2. Absolute URLs                                         │
│     Share links: ${SITE_URL}/products/123                 │
│     API callbacks: ${SITE_URL}/auth/callback              │
│                                                           │
│  3. Email Templates                                       │
│     Reset password: ${SITE_URL}/reset-password?token=...  │
│     Verify email: ${SITE_URL}/verify?code=...             │
│                                                           │
│  4. Social Sharing                                        │
│     Twitter Card URL                                      │
│     Facebook Open Graph URL                               │
│                                                           │
│  5. OAuth Redirects                                       │
│     Google OAuth: ${SITE_URL}/auth/google/callback        │
│     GitHub OAuth: ${SITE_URL}/auth/github/callback        │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Environment-Specific Configuration

| Environment | NEXT_PUBLIC_SITE_URL | NEXT_PUBLIC_SITE_DOMAIN |
|-------------|---------------------|------------------------|
| Development | `http://localhost:3000` | `localhost` |
| Staging | `https://staging.lankacommerce.cloud` | `staging.lankacommerce.cloud` |
| Production | `https://lankacommerce.cloud` | `lankacommerce.cloud` |

### URL Format Requirements

```
Site URL Format Rules
════════════════════

Required Elements:
  • Protocol (http:// or https://)
  • Domain name
  • Port (if not 80/443)
  
Prohibited Elements:
  • Trailing slash
  • Path segments
  • Query parameters
  • Fragment identifiers

Valid Examples:
  ✓ http://localhost:3000
  ✓ https://lankacommerce.cloud
  ✓ https://staging.lankacommerce.cloud

Invalid Examples:
  ✗ localhost:3000                    (missing protocol)
  ✗ https://lankacommerce.cloud/      (trailing slash)
  ✗ https://lankacommerce.cloud/app   (path segment)
  ✗ http://localhost:3000?dev=true    (query parameter)
```

### Open Graph Meta Tags Example

```
Meta Tag Configuration
═════════════════════

Using NEXT_PUBLIC_SITE_URL and related variables:

<meta property="og:site_name" content="${NEXT_PUBLIC_APP_NAME}" />
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="${NEXT_PUBLIC_APP_DESCRIPTION}" />
<meta property="og:url" content="${NEXT_PUBLIC_SITE_URL}/current-page" />
<meta property="og:image" content="${NEXT_PUBLIC_SITE_URL}/og-image.jpg" />

Benefits:
  • Social media previews
  • Link sharing optimization
  • Brand consistency
  • SEO improvement
```

### Absolute URL Helper Pattern

```
URL Generation Pattern
═════════════════════

Function: getAbsoluteUrl(path: string)
Purpose: Generate absolute URLs from relative paths

Input:  '/dashboard/products'
Output: 'https://lankacommerce.cloud/dashboard/products'

Input:  '/api/auth/callback'
Output: 'https://lankacommerce.cloud/api/auth/callback'

Usage in Components:
  • Social share buttons
  • Email link generation
  • OAuth redirect configuration
  • Sitemap generation
```

### Expected Outcome
- Complete site URL configuration
- SEO-ready meta tag support
- Absolute URL generation capability
- OAuth redirect compatibility

### Verification Checklist
- [ ] NEXT_PUBLIC_SITE_URL defined
- [ ] NEXT_PUBLIC_APP_NAME defined
- [ ] NEXT_PUBLIC_APP_DESCRIPTION defined
- [ ] NEXT_PUBLIC_SITE_DOMAIN defined
- [ ] URLs include protocol
- [ ] No trailing slashes
- [ ] Environment-specific values set
- [ ] Development uses localhost
- [ ] Production uses https://

---

## Task 73: Configure Feature Flags

### Overview
Configure environment variables for feature flags that control application behavior and feature availability. Feature flags enable progressive rollout of new features, A/B testing, environment-specific functionality, and safe deployment of experimental code. They provide runtime control over features without code changes.

### Dependencies
- Task 69: Create .env.example file
- Task 70: Create .env.local template

### Instructions

1. **Add Feature Flags section**
   - Create dedicated section in environment files
   - Add clear documentation
   - Explain feature flag purpose

2. **Define debug and development flags**
   - NEXT_PUBLIC_ENABLE_DEBUG: Show debug information
   - NEXT_PUBLIC_ENABLE_DEV_TOOLS: Enable development tools
   - NEXT_PUBLIC_ENABLE_MOCK_DATA: Use mock data instead of API

3. **Configure analytics and tracking flags**
   - NEXT_PUBLIC_ENABLE_ANALYTICS: Google Analytics tracking
   - NEXT_PUBLIC_ENABLE_ERROR_REPORTING: Sentry error tracking
   - NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: Performance metrics

4. **Add experimental feature flags**
   - NEXT_PUBLIC_ENABLE_NEW_DASHBOARD: New dashboard UI
   - NEXT_PUBLIC_ENABLE_AI_FEATURES: AI-powered features
   - NEXT_PUBLIC_ENABLE_BETA_FEATURES: Beta functionality

5. **Configure production optimization flags**
   - ANALYZE: Enable bundle analyzer during build
   - NEXT_PUBLIC_ENABLE_PWA: Progressive Web App features
   - NEXT_PUBLIC_ENABLE_SERVICE_WORKER: Service worker registration

6. **Add integration flags**
   - NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN: Social authentication
   - NEXT_PUBLIC_ENABLE_PAYMENT_GATEWAY: Payment processing
   - NEXT_PUBLIC_ENABLE_NOTIFICATIONS: Push notifications

7. **Document flag default values**
   - Development: Debug enabled, analytics disabled
   - Production: Debug disabled, analytics enabled
   - Staging: Mix of debug and production settings

### Feature Flag Categories

```
┌──────────────────────────────────────────────────────────┐
│              Feature Flag Organization                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Debug & Development                                   │
│     • ENABLE_DEBUG                                        │
│     • ENABLE_DEV_TOOLS                                    │
│     • ENABLE_MOCK_DATA                                    │
│                                                           │
│  2. Analytics & Monitoring                                │
│     • ENABLE_ANALYTICS                                    │
│     • ENABLE_ERROR_REPORTING                              │
│     • ENABLE_PERFORMANCE_MONITORING                       │
│                                                           │
│  3. Experimental Features                                 │
│     • ENABLE_NEW_DASHBOARD                                │
│     • ENABLE_AI_FEATURES                                  │
│     • ENABLE_BETA_FEATURES                                │
│                                                           │
│  4. Build Optimization                                    │
│     • ANALYZE                                             │
│     • ENABLE_PWA                                          │
│     • ENABLE_SERVICE_WORKER                               │
│                                                           │
│  5. Third-Party Integrations                              │
│     • ENABLE_SOCIAL_LOGIN                                 │
│     • ENABLE_PAYMENT_GATEWAY                              │
│     • ENABLE_NOTIFICATIONS                                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Environment-Specific Flag Values

| Feature Flag | Development | Staging | Production |
|--------------|-------------|---------|------------|
| ENABLE_DEBUG | true | false | false |
| ENABLE_DEV_TOOLS | true | false | false |
| ENABLE_MOCK_DATA | false | false | false |
| ENABLE_ANALYTICS | false | true | true |
| ENABLE_ERROR_REPORTING | false | true | true |
| ENABLE_NEW_DASHBOARD | true | true | false |
| ENABLE_AI_FEATURES | true | true | false |
| ANALYZE | false | false | false |

### Feature Flag Usage Pattern

```
Feature Flag Implementation
═══════════════════════════

In code (hypothetical usage):
  if (process.env.NEXT_PUBLIC_ENABLE_NEW_DASHBOARD === 'true') {
    return <NewDashboard />
  }
  return <LegacyDashboard />

Benefits:
  • Safe feature rollout
  • A/B testing capability
  • Emergency kill switch
  • Environment-specific behavior
  • No code deployment needed to toggle
```

### Feature Flag Best Practices

```
Best Practices
══════════════

1. Naming Convention
   • Use ENABLE_ prefix for boolean flags
   • Descriptive feature names
   • NEXT_PUBLIC_ for client-side access

2. Default Values
   • Safe defaults (usually false)
   • Development-friendly in .env.local
   • Production-ready in deployment

3. Documentation
   • Comment purpose of each flag
   • Note which components use flag
   • Specify removal timeline for temporary flags

4. Testing
   • Test both enabled and disabled states
   • Verify flag changes work at runtime
   • Check build-time flag evaluation
```

### Progressive Feature Rollout

```
Feature Rollout Strategy
════════════════════════

Phase 1: Development
  ENABLE_NEW_FEATURE=true (dev only)
  • Internal testing
  • Bug fixing
  • Feature refinement

Phase 2: Staging
  ENABLE_NEW_FEATURE=true (staging)
  • QA testing
  • Stakeholder review
  • Performance validation

Phase 3: Production Canary
  ENABLE_NEW_FEATURE=true (10% of users)
  • Limited exposure
  • Monitor metrics
  • Gather feedback

Phase 4: Full Rollout
  ENABLE_NEW_FEATURE=true (100% of users)
  • Complete deployment
  • Remove flag (optional)
  • Clean up old code
```

### Debug Flag Configuration

```
Debug Flags in Development
══════════════════════════

NEXT_PUBLIC_ENABLE_DEBUG=true

Enables:
  • Console logging
  • Redux DevTools
  • React Query DevTools
  • Component boundaries
  • Performance markers
  • API request logging
  • State change tracking

Should be FALSE in production:
  • Reduces bundle size
  • Improves performance
  • Hides internal details
  • Prevents information leakage
```

### Expected Outcome
- Comprehensive feature flag system
- Environment-appropriate configurations
- Safe feature rollout mechanism
- Runtime behavior control

### Verification Checklist
- [ ] Debug flags configured
- [ ] Analytics flags defined
- [ ] Experimental feature flags added
- [ ] Build optimization flags present
- [ ] Integration flags configured
- [ ] Development values appropriate
- [ ] Production values secure
- [ ] All flags documented with comments
- [ ] Boolean values (true/false) used
- [ ] NEXT_PUBLIC_ prefix for client flags

---

## Task 74: Create Environment Validation

### Overview
Create an environment validation utility that validates required environment variables at build time and provides type-safe access to environment variables throughout the application. This utility ensures all required configuration is present before deployment and prevents runtime errors from missing environment variables.

### Dependencies
- Task 69: Create .env.example file
- Task 70: Create .env.local template
- Tasks 71-73: Environment variables configured

### Instructions

1. **Create lib/env.ts file**
   - Navigate to frontend/lib directory
   - Create new file named env.ts
   - This will be the environment validation module

2. **Import validation library**
   - Consider using zod for schema validation
   - Or implement custom validation
   - Type-safe environment variable access

3. **Define required variables schema**
   - List all required environment variables
   - Specify expected types (string, number, boolean)
   - Define validation rules (URL format, non-empty)

4. **Define optional variables schema**
   - List optional environment variables
   - Provide default values
   - Document fallback behavior

5. **Create validation function**
   - Validate all required variables are present
   - Check format and type correctness
   - Throw descriptive errors for missing/invalid variables

6. **Create type-safe exports**
   - Export typed environment object
   - Provide autocomplete for variable names
   - Ensure type safety throughout application

7. **Add validation at build time**
   - Execute validation during build process
   - Fail build if validation fails
   - Prevent deployment with invalid configuration

8. **Create helper functions**
   - isProduction(): boolean
   - isDevelopment(): boolean
   - isStaging(): boolean
   - getApiUrl(): string
   - getSiteUrl(): string

### Environment Validation Architecture

```
┌──────────────────────────────────────────────────────────┐
│            Environment Validation Flow                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Build Time:                                              │
│  ──────────                                               │
│  1. Load .env files                                       │
│  2. Run validation (lib/env.ts)                           │
│  3. Check required variables                              │
│  4. Validate formats                                      │
│  5. Fail build if invalid                                 │
│                                                           │
│  Runtime:                                                 │
│  ────────                                                 │
│  1. Import from lib/env                                   │
│  2. Type-safe access                                      │
│  3. No undefined errors                                   │
│  4. Autocomplete support                                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Validation Schema Structure

| Variable Category | Validation Rules |
|------------------|------------------|
| API URLs | Must start with http:// or https://, no trailing slash |
| Site URLs | Must be valid URL, include protocol |
| Boolean flags | Must be 'true' or 'false' string |
| Optional strings | Allow empty, provide defaults |
| Numeric values | Must parse to number, check range |

### Validation Error Messages

```
Validation Error Examples
═════════════════════════

Missing Variable:
  "Environment variable NEXT_PUBLIC_API_URL is required but not defined.
   Please add it to your .env.local file."

Invalid Format:
  "Environment variable NEXT_PUBLIC_API_URL must be a valid URL.
   Received: 'not-a-url'"

Invalid Type:
  "Environment variable API_TIMEOUT must be a number.
   Received: 'thirty-seconds'"

Helpful Error Messages:
  • Specify which variable is problematic
  • Explain expected format
  • Show received value (if not sensitive)
  • Suggest fix (add to .env.local)
```

### Type-Safe Environment Access

```
Type-Safe Access Pattern
════════════════════════

Before (unsafe):
  const apiUrl = process.env.NEXT_PUBLIC_API_URL // string | undefined
  // Risk: might be undefined, no type checking

After (safe):
  import { env } from '@/lib/env'
  const apiUrl = env.NEXT_PUBLIC_API_URL // string (guaranteed)
  // Benefit: TypeScript knows it exists, autocomplete works

Helper Functions:
  if (env.isProduction()) {
    // Production-specific code
  }

  const url = env.getApiUrl() // Returns typed, validated URL
```

### Validation Timing

```
When Validation Occurs
══════════════════════

1. Development Server Start
   • Validates on 'pnpm dev'
   • Shows errors in console
   • Server won't start if invalid

2. Production Build
   • Validates on 'pnpm build'
   • Fails build if invalid
   • Prevents bad deployment

3. Test Execution
   • Validates before tests
   • Uses test environment variables
   • Ensures test isolation

4. Docker Build
   • Validates during image build
   • Build-time ARG variables
   • Runtime ENV variables
```

### Required vs Optional Variables

```
Variable Classification
═══════════════════════

Required Variables (Build Fails if Missing):
  • NEXT_PUBLIC_API_URL
  • NEXT_PUBLIC_SITE_URL
  • NODE_ENV

Optional Variables (Have Defaults):
  • NEXT_PUBLIC_ENABLE_ANALYTICS (default: false)
  • NEXT_PUBLIC_ENABLE_DEBUG (default: false)
  • API_TIMEOUT (default: 30000)
  • ANALYZE (default: false)

Strategy:
  • Require critical infrastructure variables
  • Make feature flags optional
  • Provide sensible defaults
  • Document all variables
```

### Helper Functions Implementation

```
Environment Helper Functions
════════════════════════════

isProduction()
  Returns: true if NODE_ENV === 'production'
  Use: Production-only features

isDevelopment()
  Returns: true if NODE_ENV === 'development'
  Use: Development tools, debug logging

isStaging()
  Returns: true if custom NEXT_PUBLIC_STAGE === 'staging'
  Use: Staging-specific behavior

getApiUrl()
  Returns: Validated API URL
  Use: API client configuration

getSiteUrl()
  Returns: Validated site URL
  Use: Absolute URL generation

isFeatureEnabled(featureName: string)
  Returns: boolean
  Use: Feature flag checks
```

### Expected Outcome
- Robust environment variable validation
- Type-safe environment access
- Build-time error detection
- Developer-friendly error messages

### Verification Checklist
- [ ] lib/env.ts file created
- [ ] Validation schema defined
- [ ] Required variables checked
- [ ] Optional variables have defaults
- [ ] Type-safe exports created
- [ ] Helper functions implemented
- [ ] Validation runs at build time
- [ ] Descriptive error messages
- [ ] TypeScript types exported
- [ ] Documentation comments added

---

## Task 75: Configure Production Build

### Overview
Configure Next.js production build settings in next.config.js to optimize the application for deployment. This includes output mode configuration, source map settings, compression, and performance optimizations. Proper production build configuration ensures optimal performance, security, and deployment compatibility.

### Dependencies
- Task 63: Create next.config.js
- Task 74: Create environment validation

### Instructions

1. **Open next.config.js file**
   - Navigate to frontend root directory
   - Open existing next.config.js
   - Prepare to add production build settings

2. **Configure output mode**
   - Add `output: 'standalone'` for Docker deployment
   - Generates self-contained output
   - Includes only necessary dependencies
   - Reduces Docker image size

3. **Configure source maps**
   - Set `productionBrowserSourceMap: false` for security
   - Prevents source code exposure
   - Reduces build output size
   - Keep development source maps enabled

4. **Configure compression**
   - Enable built-in compression
   - Configure gzip settings
   - Optimize asset delivery

5. **Configure SWC minification**
   - Ensure SWC minifier is enabled (default)
   - Faster than Terser
   - Better compression ratio

6. **Add React production mode**
   - Ensure React runs in production mode
   - Disables development warnings
   - Improves performance

7. **Configure image optimization**
   - Set image optimization settings
   - Define image sizes and formats
   - Configure caching headers

8. **Add trailing slash configuration**
   - Decide on trailing slash behavior
   - Set `trailingSlash: false` for consistency
   - Affects URL structure

### Production Build Configuration

```
┌──────────────────────────────────────────────────────────┐
│          Production Build Configuration                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Output Configuration                                     │
│  ────────────────────                                     │
│  • output: 'standalone'                                   │
│  • Self-contained deployment                              │
│  • Minimal dependencies                                   │
│  • Docker-optimized                                       │
│                                                           │
│  Optimization                                             │
│  ────────────                                             │
│  • SWC minification (default)                             │
│  • Dead code elimination                                  │
│  • Tree shaking                                           │
│  • Code splitting                                         │
│                                                           │
│  Security                                                 │
│  ────────                                                 │
│  • productionBrowserSourceMap: false                      │
│  • Sanitized error messages                               │
│  • No development warnings                                │
│                                                           │
│  Performance                                              │
│  ───────────                                              │
│  • Compression enabled                                    │
│  • Image optimization                                     │
│  • Font optimization                                      │
│  • Script optimization                                    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Standalone Output Structure

```
Standalone Output Directory
═══════════════════════════

.next/standalone/
├── .next/                     # Built application
│   ├── static/               # Static assets
│   └── server/               # Server code
├── node_modules/             # Production dependencies only
├── package.json              # Minimal package.json
├── public/                   # Public assets
└── server.js                 # Standalone server

Benefits:
  • Self-contained deployment
  • Minimal size (no dev dependencies)
  • Fast Docker builds
  • Easy deployment
  • Consistent production environment
```

### Production vs Development Builds

| Aspect | Development Build | Production Build |
|--------|------------------|------------------|
| Minification | None | Full (SWC) |
| Source Maps | Enabled | Disabled |
| React Mode | Development | Production |
| Warnings | Shown | Hidden |
| Dead Code | Included | Eliminated |
| Bundle Size | Large | Optimized |
| Build Time | Fast | Slower |
| Hot Reload | Enabled | Not applicable |

### Output Mode Comparison

```
Output Mode Options
═══════════════════

1. Default (Not Specified)
   • Standard Next.js output
   • Requires full node_modules
   • Larger deployment size

2. output: 'standalone'
   • Self-contained output
   • Only necessary dependencies
   • Optimized for Docker
   • Recommended for production

3. output: 'export'
   • Static HTML export
   • No server needed
   • Limited features (no SSR, API routes)
   • For static hosting

Recommendation: Use 'standalone' for full-stack ERP
```

### Source Map Configuration

```
Source Map Strategy
═══════════════════

Development:
  • Full source maps enabled
  • Easy debugging
  • Fast rebuild
  • devtool: 'cheap-module-source-map'

Production:
  • Browser source maps disabled
  • Prevents source code exposure
  • Reduces output size
  • Server logs for debugging

Security Consideration:
  Source maps reveal application structure and logic.
  Never expose in production unless behind authentication.
```

### Production Optimizations

```
Automatic Optimizations
═══════════════════════

1. Code Splitting
   • Automatic page-based splitting
   • Dynamic import support
   • Shared chunk optimization

2. Tree Shaking
   • Remove unused code
   • Eliminate dead exports
   • Reduce bundle size

3. Minification
   • JavaScript (SWC)
   • CSS optimization
   • HTML minification

4. Image Optimization
   • WebP conversion
   • Responsive images
   • Lazy loading

5. Font Optimization
   • Font subsetting
   • Preload critical fonts
   • FOUT prevention
```

### Build Performance Tips

```
Improving Build Performance
═══════════════════════════

1. Use SWC (Default)
   • Faster than Babel
   • Native Rust performance
   • Better optimization

2. Minimize Dependencies
   • Audit package.json
   • Remove unused packages
   • Use lighter alternatives

3. Parallel Builds
   • Utilize all CPU cores
   • Faster in CI/CD

4. Cache Optimization
   • Proper .next/cache usage
   • Cache between builds
   • Docker layer caching

5. Reduce Page Count
   • Use dynamic routes
   • Generate pages on-demand
   • ISR for large sites
```

### Expected Outcome
- Optimized production build configuration
- Docker-ready standalone output
- Secure source map handling
- Maximum performance

### Verification Checklist
- [ ] output: 'standalone' configured
- [ ] productionBrowserSourceMap set to false
- [ ] Compression enabled
- [ ] SWC minification active
- [ ] Image optimization configured
- [ ] Trailing slash behavior set
- [ ] Production mode enabled
- [ ] Build completes successfully
- [ ] Standalone output generated

---

## Task 76: Configure Bundle Analyzer

### Overview
Integrate and configure @next/bundle-analyzer to visualize and analyze the production bundle composition. Bundle analyzer helps identify large dependencies, duplicate code, and optimization opportunities by generating interactive treemap visualizations of the compiled bundles.

### Dependencies
- Task 75: Configure production build

### Instructions

1. **Install bundle analyzer package**
   - Run: `pnpm add @next/bundle-analyzer`
   - Install as regular dependency
   - Version compatible with Next.js

2. **Create bundle analyzer configuration**
   - Open next.config.js
   - Import withBundleAnalyzer helper
   - Wrap existing configuration

3. **Configure analyzer settings**
   - Enable only when ANALYZE environment variable is true
   - Set openAnalyzer to true for auto-open
   - Configure output directory if needed

4. **Add analyzer npm script**
   - Add to package.json scripts section
   - Create `analyze` script
   - Sets ANALYZE=true and runs build

5. **Configure analyzer options**
   - Set analyzer mode (static or server)
   - Configure report filename
   - Set report generation path

6. **Document usage instructions**
   - Add comments in next.config.js
   - Document in README.md
   - Explain how to generate reports

7. **Add .gitignore entries**
   - Ignore bundle analyzer output
   - Add .analyze/ directory
   - Exclude report HTML files

### Bundle Analyzer Architecture

```
┌──────────────────────────────────────────────────────────┐
│           Bundle Analyzer Integration                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Normal Build:                                            │
│  ────────────                                             │
│  $ pnpm build                                             │
│  └─ ANALYZE not set → Standard build                     │
│                                                           │
│  Analyzer Build:                                          │
│  ──────────────                                           │
│  $ pnpm analyze (or ANALYZE=true pnpm build)              │
│  ├─ Build application with source maps                   │
│  ├─ Generate bundle statistics                           │
│  ├─ Create visualization HTML                            │
│  └─ Open in browser automatically                        │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Bundle Analyzer Output

```
Bundle Visualization
════════════════════

Interactive Treemap:
┌────────────────────────────────────────┐
│                                        │
│  ┌─────────────┐  ┌──────┐           │
│  │   react     │  │ next │           │
│  │   (120KB)   │  │(90KB)│           │
│  └─────────────┘  └──────┘           │
│                                        │
│  ┌────────┐  ┌───────┐  ┌─────────┐  │
│  │ lodash │  │ axios │  │   ui    │  │
│  │ (50KB) │  │(40KB) │  │ (80KB)  │  │
│  └────────┘  └───────┘  └─────────┘  │
│                                        │
└────────────────────────────────────────┘

Color Coding:
  • Green: Small, optimized
  • Yellow: Medium size
  • Red: Large, consider optimization

Interactive Features:
  • Click to zoom into module
  • Hover for exact size
  • Search for specific package
  • View module hierarchy
```

### Bundle Analysis Insights

| Metric | What It Reveals | Action |
|--------|----------------|--------|
| Large dependencies | Heavy packages | Find lighter alternatives |
| Duplicate modules | Multiple versions | Deduplicate dependencies |
| Unused exports | Dead code | Enable tree shaking |
| Bundle size trend | Growth over time | Monitor and optimize |
| Code splitting | Page-specific bundles | Verify proper splitting |

### Common Optimization Opportunities

```
Bundle Optimization Strategies
══════════════════════════════

1. Large Dependencies
   Problem: react-icons includes entire icon set
   Solution: Import specific icons only
   Before: import * as Icons from 'react-icons'
   After: import { FaUser } from 'react-icons/fa'

2. Duplicate Packages
   Problem: Multiple versions of same package
   Solution: Use pnpm dedupe or update dependencies
   Check: pnpm list [package-name]

3. Unused Code
   Problem: Importing entire library
   Solution: Use named imports
   Before: import _ from 'lodash'
   After: import { debounce } from 'lodash'

4. Large Moment.js
   Problem: Moment.js with all locales
   Solution: Use day.js or date-fns
   Savings: ~200KB reduction

5. Polyfills
   Problem: Unnecessary polyfills for modern browsers
   Solution: Adjust browserslist in package.json
   Benefit: Smaller bundles for modern users
```

### Analyzer Usage Workflow

```
Analysis Workflow
═════════════════

Step 1: Generate Report
  $ pnpm analyze

Step 2: Review Visualization
  • Opens in browser automatically
  • Explore bundle composition
  • Identify large modules

Step 3: Investigate Large Packages
  • Click on large rectangles
  • Check if necessary
  • Research alternatives

Step 4: Implement Optimizations
  • Replace heavy dependencies
  • Enable code splitting
  • Lazy load components

Step 5: Re-Analyze
  • Run pnpm analyze again
  • Compare bundle sizes
  • Verify improvements

Step 6: Monitor Over Time
  • Regular analysis (weekly/monthly)
  • Track bundle size trends
  • Prevent bloat
```

### Bundle Size Targets

```
Bundle Size Guidelines
══════════════════════

Page Type               Target Size    Max Size
─────────────────────   ───────────    ────────
Landing page            < 100 KB       150 KB
Dashboard               < 200 KB       300 KB
Data-heavy page         < 250 KB       400 KB
Admin panel             < 300 KB       500 KB

First Load JS (FCP):    < 130 KB       200 KB
Shared chunks:          < 100 KB       150 KB
Page-specific:          < 50 KB        100 KB

Monitoring:
  • Track in CI/CD
  • Alert on size increases
  • Require approval for large changes
```

### Analyzer NPM Scripts

```
Package.json Scripts
════════════════════

"scripts": {
  "analyze": "ANALYZE=true pnpm build",
  "analyze:browser": "ANALYZE=true pnpm build && open .next/analyze/client.html",
  "analyze:server": "ANALYZE=true pnpm build && open .next/analyze/server.html"
}

Windows Alternative:
  "analyze": "cross-env ANALYZE=true pnpm build"
  (requires cross-env package)

Usage:
  $ pnpm analyze          # Build and analyze
  $ pnpm analyze:browser  # Analyze client bundle
  $ pnpm analyze:server   # Analyze server bundle
```

### Expected Outcome
- Bundle analyzer integrated
- Visualization generation capability
- Bundle optimization insights
- Performance monitoring tool

### Verification Checklist
- [ ] @next/bundle-analyzer installed
- [ ] withBundleAnalyzer configured
- [ ] ANALYZE environment variable checked
- [ ] NPM analyze script added
- [ ] Analyzer opens automatically
- [ ] Client bundle report generated
- [ ] Server bundle report generated
- [ ] .gitignore updated for reports
- [ ] Documentation added

---

## Task 77: Configure Output Tracing

### Overview
Configure Next.js output file tracing to optimize the standalone build output for Docker deployment. Output tracing analyzes import dependencies and includes only the necessary files in the standalone build, significantly reducing Docker image size and improving deployment efficiency.

### Dependencies
- Task 75: Configure production build
- Docker configuration exists

### Instructions

1. **Verify output: 'standalone' is set**
   - Check next.config.js
   - Ensure standalone mode enabled
   - Required for output tracing

2. **Understand output tracing behavior**
   - Automatically enabled with standalone mode
   - Traces imports through application
   - Includes only used node_modules
   - Creates minimal deployment package

3. **Configure experimental features (if needed)**
   - Review experimental.outputFileTracingRoot
   - Set if using monorepo structure
   - Points to workspace root

4. **Add outputFileTracingIgnores**
   - Exclude files not needed in production
   - Ignore test files, dev dependencies
   - Reduce output size

5. **Configure .nftignore file**
   - Create .nftignore in project root
   - List files to exclude from tracing
   - Similar to .gitignore syntax

6. **Verify trace output**
   - Build application
   - Check .next/standalone directory
   - Verify minimal file set included

7. **Document Docker integration**
   - Explain how tracing benefits Docker
   - Document Dockerfile patterns
   - Note deployment requirements

### Output Tracing Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Output File Tracing Process                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Build Phase:                                             │
│  ────────────                                             │
│  1. Analyze entry points (pages, API routes)              │
│  2. Trace all imports recursively                         │
│  3. Identify required node_modules                        │
│  4. Copy only necessary files                             │
│  5. Generate standalone/server.js                         │
│                                                           │
│  Result:                                                  │
│  ───────                                                  │
│  .next/standalone/                                        │
│  ├── Traced application files                            │
│  ├── Minimal node_modules (required only)                │
│  ├── Static assets                                       │
│  └── server.js (standalone server)                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Output Size Comparison

```
Build Output Size Comparison
═════════════════════════════

Without Tracing (Standard Build):
  node_modules/          250 MB    (all dependencies)
  .next/                  80 MB    (build output)
  public/                 10 MB    (static assets)
  Total:                 340 MB

With Output Tracing (Standalone):
  .next/standalone/
  ├── node_modules/       45 MB    (traced only)
  ├── .next/              80 MB    (build output)
  └── public/             10 MB    (static assets)
  Total:                 135 MB    (60% reduction)

Docker Image Impact:
  Standard: ~500 MB
  Standalone: ~200 MB
  Savings: ~300 MB (60% reduction)
```

### Traced Files Structure

| Category | Standard Build | Standalone Build | Reason |
|----------|----------------|------------------|---------|
| Dependencies | All packages | Used packages only | Import tracing |
| Dev Dependencies | Included | Excluded | Not needed in production |
| Test Files | Included | Excluded | .nftignore exclusion |
| Source Maps | Optional | Excluded | Production security |
| Documentation | Included | Excluded | Not runtime required |

### .nftignore Configuration

```
.nftignore File Example
═══════════════════════

# Test files
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
**/__tests__/**
**/__mocks__/**

# Development files
**/*.md
**/README*
**/CHANGELOG*
**/.env.example

# Documentation
**/docs/**
**/examples/**

# Build artifacts
**/.next/cache/**
**/coverage/**

# IDE files
**/.vscode/**
**/.idea/**

Purpose:
  • Exclude unnecessary files from trace
  • Further reduce standalone output
  • Improve deployment efficiency
```

### Monorepo Configuration

```
Monorepo Output Tracing
═══════════════════════

Project Structure:
  workspace/
  ├── packages/
  │   ├── ui-components/
  │   └── shared-utils/
  └── apps/
      └── frontend/
          └── next.config.js

Configuration in next.config.js:
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../')
  }

Purpose:
  • Trace imports from other workspace packages
  • Include necessary files from monorepo
  • Resolve shared dependencies correctly
```

### Docker Integration Pattern

```
Dockerfile with Standalone Output
═══════════════════════════════════

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # Generates .next/standalone

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy standalone output (includes traced node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]

Benefits:
  • Minimal production image
  • Fast build times
  • Efficient layer caching
  • No npm install in production stage
```

### Tracing Verification

```
Verify Output Tracing
═════════════════════

1. Build Application
   $ pnpm build

2. Check Standalone Output
   $ ls -lh .next/standalone/
   $ du -sh .next/standalone/

3. Verify node_modules Size
   $ du -sh .next/standalone/node_modules/
   # Should be much smaller than full node_modules

4. Check for Unnecessary Files
   $ find .next/standalone -name "*.test.*"
   # Should return no results

5. Test Standalone Server
   $ cd .next/standalone
   $ node server.js
   # Should start successfully

6. Compare Sizes
   $ du -sh node_modules/
   $ du -sh .next/standalone/node_modules/
   # Compare difference
```

### Tracing Troubleshooting

```
Common Tracing Issues
═════════════════════

Issue: Module not found in standalone
Cause: Dynamic imports not traced
Solution: Add to outputFileTracingIgnores or use static imports

Issue: Standalone output too large
Cause: Unnecessary dependencies included
Solution: Review dependencies, add to .nftignore

Issue: Native modules missing
Cause: Native bindings not copied
Solution: Manually copy in Dockerfile or use outputFileTracingIncludes

Issue: Monorepo packages not included
Cause: outputFileTracingRoot not set
Solution: Configure experimental.outputFileTracingRoot

Issue: API route fails in standalone
Cause: Server-side dependency not traced
Solution: Verify import paths, check nft.json
```

### Output Tracing Benefits

```
Benefits Summary
════════════════

1. Reduced Image Size
   • 50-70% smaller Docker images
   • Faster image pulls
   • Lower storage costs

2. Faster Deployments
   • Less data to transfer
   • Quicker container starts
   • Efficient CI/CD pipelines

3. Security
   • Fewer packages = smaller attack surface
   • No dev dependencies in production
   • Minimal exposure

4. Performance
   • Faster cold starts
   • Reduced memory footprint
   • Efficient resource usage

5. Simplicity
   • No manual dependency management
   • Automatic tracing
   • Less configuration needed
```

### Expected Outcome
- Optimized standalone output with tracing
- Minimal Docker image size
- Efficient production deployment
- Only necessary files included

### Verification Checklist
- [ ] output: 'standalone' confirmed in next.config.js
- [ ] Output tracing automatically enabled
- [ ] .nftignore file created (if needed)
- [ ] Standalone output generates successfully
- [ ] node_modules size reduced in standalone
- [ ] Test files excluded from output
- [ ] Standalone server runs correctly
- [ ] Docker image size reduced
- [ ] Deployment documentation updated

---

## Task 78: Verify Build Configuration

### Overview
Perform comprehensive verification of all build configuration settings to ensure the Next.js application builds correctly for production, all optimizations are applied, environment variables are validated, and the output is ready for Docker deployment. This final verification step confirms the entire environment and build setup is production-ready.

### Dependencies
- Task 75: Configure production build
- Task 76: Configure bundle analyzer
- Task 77: Configure output tracing
- All environment variables configured (Tasks 69-74)

### Instructions

1. **Run environment validation**
   - Execute environment validation utility
   - Ensure all required variables present
   - Fix any validation errors

2. **Perform clean build**
   - Delete .next directory
   - Clear Next.js cache
   - Run fresh production build
   - Verify no build errors

3. **Verify standalone output**
   - Check .next/standalone directory exists
   - Verify minimal node_modules size
   - Confirm server.js present
   - Test standalone server runs

4. **Run bundle analyzer**
   - Execute analyze script
   - Review bundle composition
   - Check for large dependencies
   - Verify code splitting

5. **Test production server**
   - Start production server
   - Verify application loads
   - Check all routes accessible
   - Test API calls work

6. **Verify environment variables**
   - Confirm NEXT_PUBLIC_ variables in bundle
   - Test environment-specific behavior
   - Verify feature flags work
   - Check API URL configuration

7. **Review security headers**
   - Check CSP headers applied
   - Verify X-Frame-Options set
   - Confirm no source maps exposed
   - Test security policies

8. **Perform build performance check**
   - Measure build time
   - Check bundle sizes
   - Verify page load performance
   - Review Lighthouse scores

9. **Document build process**
   - Update README with build instructions
   - Document environment setup
   - Note any special requirements
   - Add troubleshooting guide

### Verification Checklist Matrix

```
┌──────────────────────────────────────────────────────────┐
│           Build Configuration Verification                │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Environment Variables:                                   │
│  □ .env.example complete                                  │
│  □ .env.local configured                                  │
│  □ All required variables set                             │
│  □ Validation passes                                      │
│                                                           │
│  Build Process:                                           │
│  □ Clean build succeeds                                   │
│  □ No TypeScript errors                                   │
│  □ No linting errors                                      │
│  □ Standalone output generated                            │
│                                                           │
│  Optimization:                                            │
│  □ Minification applied                                   │
│  □ Code splitting working                                 │
│  □ Tree shaking active                                    │
│  □ Source maps disabled (production)                      │
│                                                           │
│  Output Verification:                                     │
│  □ Standalone directory size < 150MB                      │
│  □ server.js executable                                   │
│  □ Static assets copied                                   │
│  □ Public folder included                                 │
│                                                           │
│  Security:                                                │
│  □ Security headers configured                            │
│  □ No secrets in client bundle                            │
│  □ CSP policy active                                      │
│  □ HTTPS enforced (production)                            │
│                                                           │
│  Performance:                                             │
│  □ Bundle size < 300KB (FCP)                             │
│  □ Build time < 5 minutes                                 │
│  □ Page load < 2 seconds                                  │
│  □ Lighthouse score > 90                                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Build Verification Commands

```bash
# 1. Clean Previous Builds
rm -rf .next
pnpm clean  # If script exists

# 2. Validate Environment
pnpm lint  # Check code quality
pnpm type-check  # Verify TypeScript

# 3. Production Build
pnpm build

# 4. Verify Standalone Output
ls -lh .next/standalone
du -sh .next/standalone

# 5. Test Standalone Server
cd .next/standalone
node server.js
# Navigate to http://localhost:3000

# 6. Bundle Analysis
pnpm analyze

# 7. Performance Test
pnpm lighthouse  # If configured
```

### Build Output Validation

| Item | Check | Expected Result |
|------|-------|-----------------|
| Exit code | Build process | 0 (success) |
| .next/standalone | Directory exists | Yes |
| server.js | File exists | Yes, executable |
| node_modules | Size in standalone | < 60MB |
| Static assets | Copied to .next/static | Yes |
| Public folder | Copied to standalone | Yes |
| Build time | Duration | < 5 minutes |
| Warnings | Build warnings | 0 warnings |

### Production Server Tests

```
Server Verification Tests
═════════════════════════

1. Server Starts
   $ node .next/standalone/server.js
   Expected: Server listening on port 3000
   
2. Home Page Loads
   Navigate: http://localhost:3000
   Expected: Page renders without errors

3. Dynamic Routes Work
   Navigate: http://localhost:3000/dashboard
   Expected: Dashboard page loads

4. API Routes Respond
   Fetch: http://localhost:3000/api/health
   Expected: 200 OK response

5. Static Assets Load
   Check: Images, CSS, JS files
   Expected: All assets accessible

6. Environment Variables Work
   Console: window.__ENV__
   Expected: NEXT_PUBLIC_ variables present
```

### Security Verification

```
Security Checklist
══════════════════

1. Response Headers
   $ curl -I http://localhost:3000
   Check for:
   □ X-Frame-Options: SAMEORIGIN
   □ X-Content-Type-Options: nosniff
   □ Content-Security-Policy: ...
   □ Strict-Transport-Security (HTTPS)

2. Source Maps
   View page source
   □ No .map file references
   □ Code is minified
   □ No debug comments

3. Environment Variables
   Check client bundle
   □ No API secrets in NEXT_PUBLIC_ vars
   □ No database credentials
   □ No sensitive tokens

4. Error Messages
   Trigger error (invalid route)
   □ Generic error message
   □ No stack traces exposed
   □ No internal paths revealed
```

### Performance Benchmarks

```
Performance Targets
═══════════════════

First Contentful Paint (FCP):      < 1.8s
Largest Contentful Paint (LCP):    < 2.5s
Time to Interactive (TTI):         < 3.8s
Total Blocking Time (TBT):         < 300ms
Cumulative Layout Shift (CLS):     < 0.1

Bundle Sizes:
  First Load JS:                   < 130KB
  Page-specific JS:                < 50KB
  CSS:                             < 30KB

Lighthouse Scores:
  Performance:                     > 90
  Accessibility:                   > 95
  Best Practices:                  > 90
  SEO:                            > 95
```

### Common Build Issues and Solutions

```
Troubleshooting Guide
═════════════════════

Issue: Build fails with "Module not found"
Solution:
  • Check import paths
  • Verify dependencies installed
  • Run pnpm install

Issue: Environment variable undefined
Solution:
  • Verify variable in .env.local
  • Check NEXT_PUBLIC_ prefix for client-side
  • Restart dev server after changes

Issue: Standalone output missing files
Solution:
  • Check .nftignore doesn't exclude needed files
  • Verify import statements are static
  • Review outputFileTracing configuration

Issue: Large bundle size
Solution:
  • Run bundle analyzer
  • Replace heavy dependencies
  • Enable dynamic imports
  • Review unused code

Issue: Source maps in production
Solution:
  • Set productionBrowserSourceMap: false
  • Rebuild application
  • Check response headers
```

### Build Success Criteria

```
Production Readiness Criteria
══════════════════════════════

□ All environment variables validated
□ Clean build with no errors
□ Standalone output generated
□ Bundle size within targets
□ Security headers configured
□ No source maps exposed
□ Production server starts
□ All routes accessible
□ API integration working
□ Performance benchmarks met
□ Docker deployment tested
□ Documentation complete

When ALL criteria met:
  ✓ Build configuration is production-ready
  ✓ Ready for deployment
  ✓ Proceed to next phase
```

### Documentation Requirements

```
Required Documentation
══════════════════════

1. README.md Updates
   • Build instructions
   • Environment setup
   • Deployment steps
   • Troubleshooting

2. Environment Guide
   • Variable descriptions
   • Example values
   • Required vs optional

3. Deployment Documentation
   • Docker build process
   • Container configuration
   • Environment injection

4. Performance Baselines
   • Current bundle sizes
   • Build times
   • Performance scores
```

### Expected Outcome
- Production build verified and working
- All configurations tested
- Security measures confirmed
- Performance benchmarks met
- Documentation complete
- Ready for deployment

### Final Verification Checklist
- [ ] Environment validation passes
- [ ] Clean production build succeeds
- [ ] Standalone output verified
- [ ] Bundle analyzer reviewed
- [ ] Production server tested
- [ ] Environment variables work correctly
- [ ] Security headers confirmed
- [ ] Performance targets met
- [ ] Build documentation complete
- [ ] No build errors or warnings
- [ ] Docker deployment tested
- [ ] All acceptance criteria met

---

## Summary

This document established comprehensive environment variable management and production build configuration for the Next.js frontend application:

### Completed Configuration
- ✅ .env.example template with all variables documented
- ✅ .env.local for local development configuration
- ✅ API URL variables (NEXT_PUBLIC_API_URL, API_URL)
- ✅ Site URL variables (NEXT_PUBLIC_SITE_URL, domain)
- ✅ Feature flags for development and production
- ✅ Environment validation utility (lib/env.ts)
- ✅ Production build optimization (standalone output)
- ✅ Bundle analyzer integration
- ✅ Output tracing for Docker deployment
- ✅ Complete build verification process

### Key Achievements

1. **Environment Management**
   - Type-safe environment variable access
   - Build-time validation
   - Clear documentation for all variables
   - Development and production configurations

2. **Production Optimization**
   - Standalone output for minimal Docker images
   - SWC minification
   - Code splitting and tree shaking
   - Security-hardened configuration

3. **Development Tools**
   - Bundle analyzer for optimization insights
   - Environment validation with helpful errors
   - Feature flags for progressive rollout
   - Clear error messages

4. **Build Quality**
   - Comprehensive verification process
   - Security headers validated
   - Performance benchmarks established
   - Documentation complete

### Configuration Summary

```
Environment Variables:
  • API Configuration: Backend endpoints
  • Site Configuration: Frontend URLs and meta
  • Feature Flags: Runtime behavior control
  • Build Settings: Optimization and analysis

Build Configuration:
  • Output: Standalone mode for Docker
  • Minification: SWC-powered optimization
  • Source Maps: Disabled in production
  • Bundle Size: Optimized and monitored

Security:
  • No secrets in client bundle
  • Source maps disabled
  • Security headers configured
  • Environment validation enforced

Performance:
  • Bundle size < 300KB FCP
  • Docker image < 200MB
  • Build time < 5 minutes
  • Lighthouse score > 90
```

### Next Steps

Proceed to **Group F: Development Tooling & Documentation** to configure development tools, testing setup, and comprehensive project documentation:
- Storybook integration
- Testing framework setup (Jest, React Testing Library)
- E2E testing configuration
- Development scripts
- API documentation
- Deployment guides

---

**Document Status:** ✅ Complete  
**Total Tasks:** 10  
**Total Lines:** ~990
