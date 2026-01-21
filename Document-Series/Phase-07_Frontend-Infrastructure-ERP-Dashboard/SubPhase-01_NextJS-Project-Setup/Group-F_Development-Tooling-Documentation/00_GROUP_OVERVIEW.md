# Group F: Development Tooling & Documentation

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** F of F  
> **Tasks Covered:** 79-88  
> **Group Goal:** Configure VS Code settings, Docker files, and create comprehensive documentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Environment-Build-Configuration](../Group-E_Environment-Build-Configuration/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-02_Tailwind-Design-System](../SubPhase-02_Tailwind-Design-System/)

---

## Group Overview

This group finalizes the Next.js project setup with development tooling and documentation. Creates VS Code workspace settings for consistent editor configuration, recommends extensions, and sets up debug configuration for Next.js. Creates Docker files for both development and production environments, integrating with the docker-compose.yml. Writes comprehensive documentation including development guide, architecture documentation, and API integration guide. Concludes with final verification and cleanup.

### Key Outcomes

- .vscode/settings.json for frontend
- .vscode/extensions.json recommendations
- .vscode/launch.json for debugging
- Dockerfile for development
- Dockerfile.prod for production
- docker-compose.yml frontend service
- Development guide documentation
- Architecture documentation
- API integration guide
- Final verification completed
- Placeholder cleanup done

### Technology Context

- **Editor:** VS Code with recommended extensions
- **Debugging:** Node.js debugger for Next.js
- **Container:** Docker multi-stage builds
- **Documentation:** Markdown format

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-84_VSCode-Docker.md` | Configure VS Code and Docker files | 79-84 |
| 02 | `02_Tasks-85-88_Documentation-Verification.md` | Create documentation and final verification | 85-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create VS Code Settings | Low | Task 16 |
| 80 | Create VS Code Extensions | Low | Task 79 |
| 81 | Create Debug Configuration | Medium | Task 79 |
| 82 | Create Docker Development File | Medium | Task 16 |
| 83 | Create Docker Production File | Medium | Task 82 |
| 84 | Create Docker Compose Entry | Low | Task 82 |
| 85 | Create Development Guide | Medium | Task 15 |
| 86 | Create Architecture Documentation | Medium | Task 85 |
| 87 | Create API Integration Guide | Medium | Task 85 |
| 88 | Final Verification & Cleanup | Low | Task 78 |

---

## Execution Order

```
Task 79: Create VS Code Settings
    │
    ├──────────────────────┐
    ▼                      ▼
Task 80               Task 81
(extensions)          (debug config)
    │                      │
    └──────────┬───────────┘
               │
               ├──────────────────────────────────┐
               ▼                                  ▼
          Task 82                            Task 85
          (Dockerfile dev)                   (dev guide)
               │                                  │
               ├──────────────┐                   ├────────────┐
               ▼              ▼                   ▼            ▼
          Task 83        Task 84             Task 86      Task 87
          (Dockerfile.prod) (compose)        (arch docs)  (API guide)
               │              │                   │            │
               └──────────────┴───────────────────┴────────────┘
                                       │
                                       ▼
                                  Task 88: Final Verification
```

---

## Expected Deliverables

```
frontend/
├── .vscode/
│   ├── extensions.json     # Recommended extensions
│   ├── launch.json         # Debug configuration
│   └── settings.json       # Workspace settings
├── docs/
│   ├── development.md      # Development guide
│   ├── architecture.md     # Architecture docs
│   └── api-integration.md  # API client guide
├── Dockerfile              # Development container
└── Dockerfile.prod         # Production container
```

---

## Notes for AI Agents

### VS Code Settings (Task 79)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

### Recommended Extensions (Task 80)
| Extension | Purpose |
|-----------|---------|
| esbenp.prettier-vscode | Prettier formatting |
| dbaeumer.vscode-eslint | ESLint integration |
| bradlc.vscode-tailwindcss | Tailwind IntelliSense |
| Prisma.prisma | Prisma syntax (optional) |
| csstools.postcss | PostCSS support |

### Debug Configuration (Task 81)
| Configuration | Purpose |
|---------------|---------|
| Next.js: debug server-side | Debug SSR code |
| Next.js: debug client-side | Debug browser code |
| Next.js: debug full stack | Debug both |

### Development Dockerfile (Task 82)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
```

### Production Dockerfile (Task 83)
- Multi-stage build
- Dependencies stage
- Builder stage (next build)
- Runner stage (standalone output)
- Non-root user for security

### Docker Compose Service (Task 84)
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
  volumes:
    - ./frontend:/app
    - /app/node_modules
  environment:
    - NODE_ENV=development
  depends_on:
    - backend
```

### Development Guide Topics (Task 85)
1. Prerequisites (Node.js, pnpm)
2. Project setup
3. Running development server
4. Running tests
5. Building for production
6. Code conventions

### Architecture Documentation Topics (Task 86)
1. Project structure overview
2. App Router explanation
3. Component organization
4. State management approach
5. API integration patterns
6. Error handling strategy

### API Integration Guide Topics (Task 87)
1. API client setup
2. Authentication handling
3. Request/response types
4. Error handling
5. Caching strategies
6. Multi-tenant considerations

### Final Verification Checklist (Task 88)
- [ ] pnpm dev runs without errors
- [ ] pnpm build completes successfully
- [ ] pnpm lint passes
- [ ] pnpm type-check passes
- [ ] All placeholders replaced
- [ ] Documentation complete
- [ ] Docker builds work
