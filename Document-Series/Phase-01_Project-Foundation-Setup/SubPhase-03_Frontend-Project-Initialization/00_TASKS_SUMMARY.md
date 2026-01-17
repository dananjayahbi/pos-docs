# SubPhase 03: Frontend Project Initialization - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 03 of 08  
> **SubPhase Goal:** Set up Next.js 14+ with App Router, TypeScript, and Tailwind CSS  
> **Total Tasks:** 82 | **Status:** Planning  
> **Estimated Duration:** 4-5 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Backend-Project-Initialization](../SubPhase-02_Backend-Project-Initialization/)
- **→ Next SubPhase:** [SubPhase-04_Docker-Development-Environment](../SubPhase-04_Docker-Development-Environment/)

---

## SubPhase Overview

This sub-phase initializes the Next.js frontend project with TypeScript strict mode, Tailwind CSS, and a production-ready folder structure. The setup supports both the ERP Dashboard and the customer-facing Webstore.

### Key Outcomes
- Next.js 14+ with App Router initialized
- TypeScript with strict mode configured
- Tailwind CSS with custom design tokens
- Folder structure for both ERP and Webstore
- Path aliases configured (@/components, @/lib, etc.)
- Core dependencies installed

### Technology Context
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS 3.x
- **Package Manager:** pnpm (preferred) or npm
- **UI Library:** Shadcn/UI (will be configured in later sub-phase)

### Dependencies
- **Requires:** SubPhase-01 (Monorepo Structure Setup) completed
- **Frontend directory structure must exist**

---

## Task Execution Order

```
TASK GROUP A: Node.js Environment Setup (Tasks 01-08)
        │
        ▼
TASK GROUP B: Next.js Project Creation (Tasks 09-18)
        │
        ▼
TASK GROUP C: TypeScript Configuration (Tasks 19-30)
        │
        ▼
TASK GROUP D: Tailwind CSS Setup (Tasks 31-45)
        │
        ▼
TASK GROUP E: Folder Structure Setup (Tasks 46-62)
        │
        ▼
TASK GROUP F: Path Aliases & Module Resolution (Tasks 63-70)
        │
        ▼
TASK GROUP G: Core Dependencies & Config Files (Tasks 71-82)
```

---

## Task Index

### Group A: Node.js Environment Setup (Tasks 01-08)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Verify Node.js Version** | Ensure Node.js 20.x LTS is installed | SubPhase-01 | 🔴 Not Created |
| 02 | **Install pnpm** | Install pnpm package manager globally | Task 01 | 🔴 Not Created |
| 03 | **Create .nvmrc File** | Specify Node.js version for the project | Task 01 | 🔴 Not Created |
| 04 | **Create .npmrc File** | Configure npm/pnpm settings | Task 02 | 🔴 Not Created |
| 05 | **Initialize package.json** | Create initial package.json with project metadata | Task 02 | 🔴 Not Created |
| 06 | **Configure Package Scripts** | Add dev, build, start, lint scripts | Task 05 | 🔴 Not Created |
| 07 | **Create pnpm-workspace.yaml** | Configure pnpm workspace (if monorepo) | Task 02 | 🔴 Not Created |
| 08 | **Create .gitignore (Frontend)** | Frontend-specific gitignore entries | Task 05 | 🔴 Not Created |

---

### Group B: Next.js Project Creation (Tasks 09-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 09 | **Install Next.js** | Install Next.js 14+ as dependency | Task 05 | 🔴 Not Created |
| 10 | **Install React & React DOM** | Install React 18+ dependencies | Task 09 | 🔴 Not Created |
| 11 | **Create next.config.js** | Basic Next.js configuration | Task 09 | 🔴 Not Created |
| 12 | **Configure Image Domains** | Set up allowed image domains | Task 11 | 🔴 Not Created |
| 13 | **Configure Experimental Features** | Enable server actions and other features | Task 11 | 🔴 Not Created |
| 14 | **Create app/ Directory** | Initialize App Router directory | Task 09 | 🔴 Not Created |
| 15 | **Create app/layout.tsx** | Root layout component | Task 14 | 🔴 Not Created |
| 16 | **Create app/page.tsx** | Root page component | Task 14 | 🔴 Not Created |
| 17 | **Create app/error.tsx** | Global error boundary | Task 14 | 🔴 Not Created |
| 18 | **Create app/not-found.tsx** | 404 page component | Task 14 | 🔴 Not Created |

---

### Group C: TypeScript Configuration (Tasks 19-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Install TypeScript** | Install TypeScript as dev dependency | Task 09 | 🔴 Not Created |
| 20 | **Install @types/node** | Node.js type definitions | Task 19 | 🔴 Not Created |
| 21 | **Install @types/react** | React type definitions | Task 19 | 🔴 Not Created |
| 22 | **Install @types/react-dom** | React DOM type definitions | Task 19 | 🔴 Not Created |
| 23 | **Create tsconfig.json** | TypeScript configuration file | Task 19 | 🔴 Not Created |
| 24 | **Configure Compiler Options** | Set strict mode and target | Task 23 | 🔴 Not Created |
| 25 | **Configure Module Resolution** | Set up module and moduleResolution | Task 23 | 🔴 Not Created |
| 26 | **Configure Path Aliases** | Set up @ alias for imports | Task 23 | 🔴 Not Created |
| 27 | **Configure Include/Exclude** | Specify files to compile | Task 23 | 🔴 Not Created |
| 28 | **Create types/index.d.ts** | Global type declarations | Task 23 | 🔴 Not Created |
| 29 | **Create types/env.d.ts** | Environment variable types | Task 23 | 🔴 Not Created |
| 30 | **Verify TypeScript Setup** | Run tsc --noEmit to verify | Task 23-29 | 🔴 Not Created |

---

### Group D: Tailwind CSS Setup (Tasks 31-45)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Install Tailwind CSS** | Install tailwindcss package | Task 09 | 🔴 Not Created |
| 32 | **Install PostCSS** | Install postcss as dependency | Task 31 | 🔴 Not Created |
| 33 | **Install Autoprefixer** | Install autoprefixer plugin | Task 32 | 🔴 Not Created |
| 34 | **Create tailwind.config.ts** | Tailwind configuration file | Task 31 | 🔴 Not Created |
| 35 | **Configure Content Paths** | Set up content scanning paths | Task 34 | 🔴 Not Created |
| 36 | **Configure Theme - Colors** | Set up custom color palette | Task 34 | 🔴 Not Created |
| 37 | **Configure Theme - Fonts** | Set up font families | Task 34 | 🔴 Not Created |
| 38 | **Configure Theme - Spacing** | Set up custom spacing scale | Task 34 | 🔴 Not Created |
| 39 | **Configure Theme - Breakpoints** | Set up responsive breakpoints | Task 34 | 🔴 Not Created |
| 40 | **Configure Dark Mode** | Enable class-based dark mode | Task 34 | 🔴 Not Created |
| 41 | **Create postcss.config.js** | PostCSS configuration | Task 32 | 🔴 Not Created |
| 42 | **Create styles/globals.css** | Global CSS with Tailwind directives | Task 34 | 🔴 Not Created |
| 43 | **Create styles/variables.css** | CSS custom properties | Task 42 | 🔴 Not Created |
| 44 | **Create styles/animations.css** | Custom CSS animations | Task 42 | 🔴 Not Created |
| 45 | **Import Global Styles** | Import globals.css in layout.tsx | Task 42, 15 | 🔴 Not Created |

---

### Group E: Folder Structure Setup (Tasks 46-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 46 | **Create components/ Directory** | React components directory | Task 14 | 🔴 Not Created |
| 47 | **Create components/ui/ Directory** | UI primitive components | Task 46 | 🔴 Not Created |
| 48 | **Create components/layout/ Directory** | Layout components | Task 46 | 🔴 Not Created |
| 49 | **Create components/forms/ Directory** | Form components | Task 46 | 🔴 Not Created |
| 50 | **Create components/common/ Directory** | Common/shared components | Task 46 | 🔴 Not Created |
| 51 | **Create lib/ Directory** | Utility functions and helpers | Task 14 | 🔴 Not Created |
| 52 | **Create lib/utils.ts** | Common utility functions | Task 51 | 🔴 Not Created |
| 53 | **Create lib/cn.ts** | Class name merge utility | Task 51 | 🔴 Not Created |
| 54 | **Create hooks/ Directory** | Custom React hooks | Task 14 | 🔴 Not Created |
| 55 | **Create hooks/index.ts** | Hooks barrel export | Task 54 | 🔴 Not Created |
| 56 | **Create stores/ Directory** | State management (Zustand) | Task 14 | 🔴 Not Created |
| 57 | **Create services/ Directory** | API client and services | Task 14 | 🔴 Not Created |
| 58 | **Create services/api.ts** | Base API client setup | Task 57 | 🔴 Not Created |
| 59 | **Create constants/ Directory** | Application constants | Task 14 | 🔴 Not Created |
| 60 | **Create constants/config.ts** | Configuration constants | Task 59 | 🔴 Not Created |
| 61 | **Create public/ Directory Setup** | Static assets organization | Task 14 | 🔴 Not Created |
| 62 | **Create .gitkeep Files** | Ensure empty directories are tracked | Task 46-61 | 🔴 Not Created |

---

### Group F: Path Aliases & Module Resolution (Tasks 63-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Configure @/ Alias** | Root alias for src directory | Task 26 | 🔴 Not Created |
| 64 | **Configure @/components Alias** | Components directory alias | Task 63 | 🔴 Not Created |
| 65 | **Configure @/lib Alias** | Lib directory alias | Task 63 | 🔴 Not Created |
| 66 | **Configure @/hooks Alias** | Hooks directory alias | Task 63 | 🔴 Not Created |
| 67 | **Configure @/stores Alias** | Stores directory alias | Task 63 | 🔴 Not Created |
| 68 | **Configure @/services Alias** | Services directory alias | Task 63 | 🔴 Not Created |
| 69 | **Configure @/types Alias** | Types directory alias | Task 63 | 🔴 Not Created |
| 70 | **Verify Path Aliases** | Test imports with aliases work | Task 63-69 | 🔴 Not Created |

---

### Group G: Core Dependencies & Config Files (Tasks 71-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Install clsx** | Utility for constructing className strings | Task 05 | 🔴 Not Created |
| 72 | **Install tailwind-merge** | Merge Tailwind classes without conflicts | Task 31 | 🔴 Not Created |
| 73 | **Install class-variance-authority** | Build variant-based components | Task 31 | 🔴 Not Created |
| 74 | **Install lucide-react** | Icon library | Task 10 | 🔴 Not Created |
| 75 | **Install next-themes** | Theme switching support | Task 10 | 🔴 Not Created |
| 76 | **Create .env.local.example** | Environment variables template | Task 05 | 🔴 Not Created |
| 77 | **Create .env.development** | Development environment config | Task 76 | 🔴 Not Created |
| 78 | **Create README.md (Frontend)** | Frontend-specific documentation | Task 05 | 🔴 Not Created |
| 79 | **Create components.json** | Shadcn/UI configuration placeholder | Task 46 | 🔴 Not Created |
| 80 | **Verify Development Server** | Run pnpm dev and verify | Task 71-79 | 🔴 Not Created |
| 81 | **Verify Production Build** | Run pnpm build successfully | Task 80 | 🔴 Not Created |
| 82 | **Create Initial Commit** | Commit all frontend setup | Task 81 | 🔴 Not Created |

---

## Task Details

### Task 11: Create next.config.js

**Goal:** Configure Next.js for the project.

**Content:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [
      'localhost',
      'cdn.lankacommerce.lk',
      'images.lankacommerce.lk',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

### Task 23: Create tsconfig.json

**Goal:** Configure TypeScript with strict mode.

**Content:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/stores/*": ["./stores/*"],
      "@/services/*": ["./services/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

### Task 34: Create tailwind.config.ts

**Goal:** Configure Tailwind with custom theme.

**Content:**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

---

### Task 52: Create lib/utils.ts

**Goal:** Create common utility functions.

**Content:**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = 'LKR'
): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

### Task 58: Create services/api.ts

**Goal:** Set up base API client.

**Content:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

---

## Expected Final Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   └── common/
├── lib/
│   ├── utils.ts
│   └── cn.ts
├── hooks/
│   └── index.ts
├── stores/
├── services/
│   └── api.ts
├── constants/
│   └── config.ts
├── types/
│   ├── index.d.ts
│   └── env.d.ts
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── animations.css
├── public/
│   ├── favicon.ico
│   └── images/
├── .env.local.example
├── .gitignore
├── .npmrc
├── .nvmrc
├── components.json
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 82 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 82 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within groups
2. **Dependencies:** Verify SubPhase-01 is complete before starting
3. **Node Version:** Use Node.js 20.x LTS
4. **Package Manager:** Prefer pnpm, but npm works too
5. **Git Commits:** Commit after completing each task group
6. **Verification:** Run `pnpm dev` and `pnpm build` to verify setup
7. **TypeScript:** Ensure strict mode passes with no errors
