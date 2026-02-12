// Document structure data - organized by Phase and SubPhase
const DOCUMENTATION_DATA = {
    phases: [
        {
            id: 'phase-01',
            name: 'Phase-01',
            title: 'Project Foundation & Setup',
            description: 'Repository initialization and project structure',
            order: 1,
            subphases: [
                {
                    id: 'phase-01-sub-01',
                    name: 'SubPhase-01_Monorepo-Structure-Setup',
                    order: 1,
                    groups: [
                        'Group-A_Repository-Initialization',
                        'Group-B_Directory-Structure',
                        'Group-C_Workspace-Configuration',
                        'Group-D_Development-Tools',
                        'Group-E_CI-CD-Pipeline-Setup',
                        'Group-F_Build-Configuration',
                    ]
                },
                {
                    id: 'phase-01-sub-02',
                    name: 'SubPhase-02_Backend-Project-Initialization',
                    order: 2,
                    groups: [
                        'Group-A_Django-Project-Setup',
                        'Group-B_Virtual-Environment',
                        'Group-C_Requirements-Management',
                        'Group-D_Basic-Configuration',
                        'Group-E_Project-Structure',
                        'Group-F_Testing-Setup',
                    ]
                },
                {
                    id: 'phase-01-sub-03',
                    name: 'SubPhase-03_Frontend-Project-Initialization',
                    order: 3,
                    groups: [
                        'Group-A_Next.js-Setup',
                        'Group-B_TypeScript-Configuration',
                        'Group-C_Tailwind-CSS-Setup',
                        'Group-D_Component-Structure',
                        'Group-E_Build-Configuration',
                        'Group-F_Development-Tools',
                    ]
                },
                {
                    id: 'phase-01-sub-04',
                    name: 'SubPhase-04_Docker-Development-Environment',
                    order: 4,
                    groups: [
                        'Group-A_Docker-Configuration',
                        'Group-B_Docker-Compose',
                        'Group-C_Service-Orchestration',
                        'Group-D_Volume-Management',
                        'Group-E_Network-Configuration',
                        'Group-F_Development-Workflow',
                    ]
                },
                {
                    id: 'phase-01-sub-05',
                    name: 'SubPhase-05_Code-Quality-Linting-Setup',
                    order: 5,
                    groups: [
                        'Group-A_Python-Linting',
                        'Group-B_JavaScript-Linting',
                        'Group-C_Code-Formatting',
                        'Group-D_Pre-commit-Hooks',
                        'Group-E_Static-Analysis',
                        'Group-F_Quality-Gates',
                    ]
                },
                {
                    id: 'phase-01-sub-06',
                    name: 'SubPhase-06_Git-Workflow-Standards',
                    order: 6,
                    groups: [
                        'Group-A_Branching-Strategy',
                        'Group-B_Commit-Conventions',
                        'Group-C_Pull-Request-Process',
                        'Group-D_Code-Review',
                        'Group-E_Release-Management',
                        'Group-F_Documentation-Standards',
                    ]
                },
                {
                    id: 'phase-01-sub-07',
                    name: 'SubPhase-07_Environment-Configuration',
                    order: 7,
                    groups: [
                        'Group-A_Development-Environment',
                        'Group-B_Staging-Environment',
                        'Group-C_Production-Environment',
                        'Group-D_Configuration-Management',
                        'Group-E_Secrets-Management',
                        'Group-F_Environment-Variables',
                    ]
                },
                {
                    id: 'phase-01-sub-08',
                    name: 'SubPhase-08_Documentation-Structure',
                    order: 8,
                    groups: [
                        'Group-A_Documentation-Template',
                        'Group-B_API-Documentation',
                        'Group-C_Developer-Guide',
                        'Group-D_Architecture-Docs',
                        'Group-E_Deployment-Guide',
                        'Group-F_Troubleshooting-Guide',
                    ]
                },
            ]
        },
        {
            id: 'phase-02',
            name: 'Phase-02',
            title: 'Database Architecture & Multi-Tenancy',
            description: 'PostgreSQL setup and tenant isolation',
            order: 2,
            subphases: [
                {
                    id: 'phase-02-sub-01',
                    name: 'SubPhase-01_PostgreSQL-Configuration',
                    order: 1,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-02',
                    name: 'SubPhase-02_Django-Tenants-Installation',
                    order: 2,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-03',
                    name: 'SubPhase-03_Public-Schema-Design',
                    order: 3,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-04',
                    name: 'SubPhase-04_Tenant-Model-Domain-Model',
                    order: 4,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-05',
                    name: 'SubPhase-05_Tenant-Schema-Template',
                    order: 5,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-06',
                    name: 'SubPhase-06_Tenant-Middleware-Configuration',
                    order: 6,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-07',
                    name: 'SubPhase-07_Database-Router-Setup',
                    order: 7,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-08',
                    name: 'SubPhase-08_Migration-Strategy',
                    order: 8,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-09',
                    name: 'SubPhase-09_Tenant-Provisioning-Flow',
                    order: 9,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
                {
                    id: 'phase-02-sub-10',
                    name: 'SubPhase-10_Testing-Multi-Tenancy',
                    order: 10,
                    groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
                },
            ]
        },
        {
            id: 'phase-03',
            name: 'Phase-03',
            title: 'Core Backend Infrastructure',
            description: 'DRF, Celery, and middleware setup',
            order: 3,
            subphases: Array(12).fill(null).map((_, i) => ({
                id: `phase-03-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_Core-Component`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-04',
            name: 'Phase-04',
            title: 'ERP Core Modules - Part 1',
            description: 'Product, Inventory, and Warehouse management',
            order: 4,
            subphases: Array(10).fill(null).map((_, i) => ({
                id: `phase-04-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_ERP-Module`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-05',
            name: 'Phase-05',
            title: 'ERP Core Modules - Part 2',
            description: 'POS and Sales management',
            order: 5,
            subphases: Array(12).fill(null).map((_, i) => ({
                id: `phase-05-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_Sales-Module`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-06',
            name: 'Phase-06',
            title: 'ERP Advanced Modules',
            description: 'HR, Finance, and Analytics',
            order: 6,
            subphases: Array(14).fill(null).map((_, i) => ({
                id: `phase-06-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_Advanced-Module`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-07',
            name: 'Phase-07',
            title: 'Frontend Infrastructure - ERP Dashboard',
            description: 'Next.js components and layouts',
            order: 7,
            subphases: Array(14).fill(null).map((_, i) => ({
                id: `phase-07-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_Frontend-Component`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-08',
            name: 'Phase-08',
            title: 'Webstore E-Commerce Platform',
            description: 'Public-facing webstore',
            order: 8,
            subphases: Array(14).fill(null).map((_, i) => ({
                id: `phase-08-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_Webstore-Feature`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-09',
            name: 'Phase-09',
            title: 'Integrations & Sri Lanka Localizations',
            description: 'Payment gateways, shipping, and local features',
            order: 9,
            subphases: Array(12).fill(null).map((_, i) => ({
                id: `phase-09-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_Integration`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
        {
            id: 'phase-10',
            name: 'Phase-10',
            title: 'AI Features & Advanced Capabilities',
            description: 'ML models and AI integration',
            order: 10,
            subphases: Array(12).fill(null).map((_, i) => ({
                id: `phase-10-sub-${String(i+1).padStart(2, '0')}`,
                name: `SubPhase-${String(i+1).padStart(2, '0')}_AI-Feature`,
                order: i+1,
                groups: ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F']
            }))
        },
    ]
};

// Calculate total counts
DOCUMENTATION_DATA.stats = {
    totalPhases: DOCUMENTATION_DATA.phases.length,
    totalSubphases: DOCUMENTATION_DATA.phases.reduce((sum, phase) => sum + phase.subphases.length, 0),
    totalGroups: DOCUMENTATION_DATA.phases.reduce((sum, phase) => 
        sum + phase.subphases.reduce((subSum, sub) => subSum + sub.groups.length, 0), 0
    )
};
