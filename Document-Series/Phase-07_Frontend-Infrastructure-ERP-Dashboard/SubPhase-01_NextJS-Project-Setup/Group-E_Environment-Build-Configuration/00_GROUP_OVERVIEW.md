# Group E: Environment & Build Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** E of F  
> **Tasks Covered:** 63-78  
> **Group Goal:** Configure Next.js, environment variables, security headers, and production build settings

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_ESLint-Prettier-Setup](../Group-D_ESLint-Prettier-Setup/)
- **→ Next Group:** [Group-F_Development-Tooling-Documentation](../Group-F_Development-Tooling-Documentation/)

---

## Group Overview

This group configures Next.js settings and environment variables for development and production. Creates next.config.js with image optimization, server actions, security headers, and redirects. Establishes environment variables structure with .env.example template, API URL and site URL configuration, and feature flags. Implements environment validation with env.ts. Configures production build with bundle analyzer and standalone output for Docker deployment.

### Key Outcomes

- next.config.js created
- Image domains configured
- Server Actions enabled
- TypeScript strict mode in Next.js
- Security headers (CSP, X-Frame-Options)
- Common redirects configured
- .env.example with all variables
- .env.local template created
- NEXT_PUBLIC_API_URL configured
- NEXT_PUBLIC_SITE_URL configured
- Feature flag variables
- env.ts validation utility
- Production build configuration
- Bundle analyzer integration
- Standalone output for Docker
- Build configuration verified

### Technology Context

- **Next.js Config:** ESM format (next.config.mjs)
- **Image Optimization:** next/image domains
- **Security:** CSP, HSTS, X-Frame-Options
- **Bundle Analysis:** @next/bundle-analyzer

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-63-68_NextConfig-Security.md` | Create next.config.js with security headers | 63-68 |
| 02 | `02_Tasks-69-78_Environment-Production.md` | Configure environment variables and production build | 69-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 63 | Create next.config.js | Medium | Task 16 |
| 64 | Configure Image Domains | Low | Task 63 |
| 65 | Configure Server Actions | Low | Task 63 |
| 66 | Configure TypeScript in next.config | Low | Task 63 |
| 67 | Configure Security Headers | Medium | Task 63 |
| 68 | Configure Redirects | Low | Task 63 |
| 69 | Create .env.example File | Low | Task 16 |
| 70 | Create .env.local Template | Low | Task 69 |
| 71 | Configure API URL Variables | Low | Task 69 |
| 72 | Configure Site URL Variables | Low | Task 69 |
| 73 | Configure Feature Flags | Low | Task 69 |
| 74 | Create Environment Validation | Medium | Task 69 |
| 75 | Configure Production Build | Medium | Task 63 |
| 76 | Configure Bundle Analyzer | Low | Task 75 |
| 77 | Configure Output Tracing | Low | Task 75 |
| 78 | Verify Build Configuration | Low | Task 77 |

---

## Execution Order

```
Task 63: Create next.config.js
    │
    ├────────────────────────────────────────────────────┐
    ▼                                                    ▼
Tasks 64-66                                         Task 67
(images, server actions, TS)                        (security headers)
    │                                                    │
    └──────────────────────┬─────────────────────────────┘
                           ▼
                      Task 68: Configure Redirects
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
   Task 69: .env.example               Task 75: Production Build
        │                                     │
        ├────────────────┐                    ├─────────────┐
        ▼                ▼                    ▼             ▼
   Tasks 70-73      Task 74              Task 76       Task 77
   (URLs, flags)    (validation)         (analyzer)    (output)
        │                │                    │             │
        └────────────────┴────────────────────┴─────────────┘
                                   │
                                   ▼
                              Task 78: Verify Build
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── env.ts              # Environment validation
├── .env.example            # Environment template
├── .env.local              # Local config (git-ignored)
├── next.config.js          # Next.js configuration
└── next.config.mjs         # Alternative ESM format
```

---

## Notes for AI Agents

### next.config.js Structure
```
module.exports = {
  images: { domains: [...] },
  experimental: { serverActions: true },
  typescript: { tsconfigPath: './tsconfig.json' },
  headers: async () => [...],
  redirects: async () => [...],
  output: 'standalone'
}
```

### Image Domains (Task 64)
| Domain | Purpose |
|--------|---------|
| localhost | Development |
| api.lankacommerce.cloud | Production API |
| cdn.lankacommerce.cloud | CDN assets |
| lh3.googleusercontent.com | Google avatars |

### Security Headers (Task 67)
| Header | Value | Purpose |
|--------|-------|---------|
| X-DNS-Prefetch-Control | on | DNS prefetch |
| X-XSS-Protection | 1; mode=block | XSS protection |
| X-Frame-Options | SAMEORIGIN | Clickjacking prevention |
| X-Content-Type-Options | nosniff | MIME type security |
| Referrer-Policy | origin-when-cross-origin | Referrer control |
| Content-Security-Policy | ... | Resource loading control |

### Environment Variables Structure
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# Build Configuration
ANALYZE=false
```

### Environment Validation (Task 74)
- Validate required variables at build time
- Throw helpful errors for missing variables
- Type-safe environment access

### Bundle Analyzer Usage
```bash
ANALYZE=true pnpm build
```

### Standalone Output (Task 77)
- Required for Docker deployment
- Creates self-contained output
- Includes only necessary dependencies

### Production Verification (Task 78)
```bash
pnpm build
pnpm start
```
