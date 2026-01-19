# Group G: Core Dependencies & Config Files

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** G of G (Final)  
> **Tasks Covered:** 71-82  
> **Group Goal:** Install remaining dependencies and verify complete setup

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_Path-Aliases-Module-Resolution/](../Group-F_Path-Aliases-Module-Resolution/)
- **→ Next SubPhase:** [../../SubPhase-04_Docker-Development-Environment/](../../SubPhase-04_Docker-Development-Environment/)

---

## Group Overview

This final group installs essential utility libraries, creates environment configuration files, sets up Shadcn/UI configuration placeholder, and performs comprehensive verification of the frontend setup.

### Key Outcomes
- Utility libraries installed (clsx, tailwind-merge, cva, lucide-react)
- Theme switching support with next-themes
- Environment variable templates created
- Frontend README documentation
- Development and production builds verified
- Initial git commit completed

### Technology Context
- **Class Utilities:** clsx + tailwind-merge pattern
- **Component Variants:** class-variance-authority (cva)
- **Icons:** Lucide React (consistent icon set)
- **Theming:** next-themes for dark mode persistence

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-71-75_Utility-Libraries.md | 71-75 | Install clsx, tailwind-merge, cva, lucide-react, next-themes |
| 02 | 02_Tasks-76-79_Config-Files.md | 76-79 | Create .env templates, README, components.json |
| 03 | 03_Tasks-80-82_Verification.md | 80-82 | Verify dev server, production build, initial commit |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 71 | Install clsx | Task 05 | Simple |
| 72 | Install tailwind-merge | Task 31 | Simple |
| 73 | Install class-variance-authority | Task 31 | Simple |
| 74 | Install lucide-react | Task 10 | Simple |
| 75 | Install next-themes | Task 10 | Simple |
| 76 | Create .env.local.example | Task 05 | Medium |
| 77 | Create .env.development | Task 76 | Simple |
| 78 | Create README.md (Frontend) | Task 05 | Medium |
| 79 | Create components.json | Task 46 | Simple |
| 80 | Verify Development Server | Tasks 71-79 | Simple |
| 81 | Verify Production Build | Task 80 | Simple |
| 82 | Create Initial Commit | Task 81 | Simple |

---

## Execution Order

```
01_Tasks-71-75_Utility-Libraries.md
        │
        ▼
02_Tasks-76-79_Config-Files.md
        │
        ▼
03_Tasks-80-82_Verification.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── .env.development         # Development environment
├── .env.local.example       # Environment template
├── components.json          # Shadcn/UI config placeholder
├── README.md                # Frontend documentation
└── package.json             # Updated with all dependencies
```

---

## Library Purposes

| Library | Purpose |
|---------|---------|
| clsx | Conditionally join classNames |
| tailwind-merge | Merge Tailwind classes without conflicts |
| class-variance-authority | Build variant-based component APIs |
| lucide-react | Modern icon library |
| next-themes | Theme switching with persistence |

---

## Environment Variables

**.env.local.example template:**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=LankaCommerce Cloud

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## Verification Checklist (Tasks 80-82)

- [ ] `pnpm dev` starts without errors
- [ ] Page loads at http://localhost:3000
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] `pnpm build` completes successfully
- [ ] `pnpm start` serves production build
- [ ] All files committed to git

---

## Notes for AI Agents

1. **Final Group:** This completes SubPhase-03
2. **Library Versions:** Install latest stable versions
3. **components.json:** Placeholder for Shadcn/UI (configured in later phase)
4. **Verification:** All checks must pass before proceeding
5. **Git Commit:** Final commit with message "feat: complete frontend project initialization"
6. **Next Steps:** Proceed to SubPhase-04 for Docker Development Environment
