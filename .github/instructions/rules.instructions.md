---
applyTo: '**'
---
Provide project context and documentation rules for the LankaCommerce Cloud (LCC) documentation series. Follow these guidelines when generating or updating any documentation content.

# Project Overview
- LankaCommerce Cloud (LCC) is a multi-tenant SaaS ERP for Sri Lankan SMEs.
- Backend: Django 5.x, Python 3.12+, django-tenants, DRF, Celery, Redis.
- Database: PostgreSQL 15+ with schema-based multi-tenancy.
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI.
- Platforms: POS system, tenant webstore, ERP admin dashboard.
- AI features: recommendations, demand forecasting, smart search, chatbot.

# Documentation Rules (Critical)
- No code snippets. Provide instructions only (what to do, not how to code it).
- One-directional execution flow only; tasks must follow strict sequence order.
- Every task must list dependencies, and dependencies must point to earlier tasks.
- Each SubPhase has exactly six task groups: Group A → F.
- Each group has 10–18 tasks and 4–8 documents.
- Flexible grouping: group simple/related tasks together; keep complex tasks separate.
- Every task listed in summaries must appear in a document (no orphan tasks).
- All documents must include correct navigation links (parent, previous, next).
- Maintain mapping between summaries, group overviews, and task documents.

# Sri Lanka-Specific Requirements
- Currency: LKR (₨)
- Phone format: +94 XX XXX XXXX
- Timezone: Asia/Colombo
- Language: English + Sinhala + Sinhaglish support

# Final Documentation Structure
The project documentation must follow this hierarchy and naming convention:

- Document-Series/
	- Phase-XX_Name/
		- 00_SUBPHASES_SUMMARY.md
		- SubPhase-XX_Name/
			- 00_TASKS_SUMMARY.md
			- Group-A_Name/
				- 00_GROUP_OVERVIEW.md
				- 01_Tasks-01-04_Name.md
				- 02_Task-05_Name.md
				- 03_Tasks-06-10_Name.md
			- Group-B_Name/
			- Group-C_Name/
			- Group-D_Name/
			- Group-E_Name/
			- Group-F_Name/

# Task Summary Document Requirements (00_TASKS_SUMMARY.md)
Each subphase task summary must include:
1. Navigation links (parent, previous, next)
2. SubPhase overview with key outcomes
3. Technology context
4. Task execution order (flow diagram)
5. Task index (6 groups with tables)
6. Expected final structure
7. Progress tracking
8. Notes for AI agents

# Group Overview Document Requirements (00_GROUP_OVERVIEW.md)
Each group overview must include:
- Group metadata (phase, subphase, group, tasks range, goal)
- Navigation links (parent, previous group, next group)
- Group overview and key outcomes
- Technology context
- Documents table with tasks covered
- Task summary table with dependencies
- Execution order
- Expected deliverables
- Notes for AI agents

# Task Document Requirements
- Use grouped task documents to cover 2–5 simple tasks or 2–3 medium tasks.
- Complex tasks (9+ steps) must be in their own document.
- Every document must include navigation to previous and next documents.
- Maintain consistent naming: 01_Tasks-XX-XX_Name.md or 02_Task-XX_Name.md.