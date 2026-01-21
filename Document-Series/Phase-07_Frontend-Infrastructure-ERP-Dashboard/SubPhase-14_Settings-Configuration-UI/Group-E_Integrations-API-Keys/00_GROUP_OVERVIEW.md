# Group E: Integrations & API Keys

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Build integrations management and API key management pages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Roles-Permissions](../Group-D_Roles-Permissions/)
- **→ Next Group:** [Group-F_Billing-Testing](../Group-F_Billing-Testing/)

---

## Group Overview

This group creates integrations and API key management interfaces. Creates integrations page with grid layout. Creates integration cards showing service name, status, and actions. Adds integration status indicator (Connected/Disconnected). Creates connect integration action and settings modal. Creates disconnect integration action. Creates API keys page with keys table. Defines table columns for name, key (masked), created, and last used. Creates generate API key modal with key display (show once). Creates revoke API key action. Connects to integrations API.

### Key Outcomes

- Integrations page
- Integrations grid layout
- Integration card component
- Integration status indicator
- Connect integration action
- Integration settings modal
- Disconnect integration action
- API keys page
- API keys table
- API key columns defined
- Generate API key modal
- API key display (one-time)
- Revoke API key action
- Connected to integrations API

### Technology Context

- **Grid:** Card grid layout
- **Status:** Connection status
- **Security:** Key shown once
- **Table:** TanStack Table

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-65-71_Integrations.md` | Create integrations page and cards | 65-71 |
| 02 | `02_Tasks-72-78_API-Keys.md` | Create API keys management | 72-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 65 | Create Integrations Page | Low | Task 14 |
| 66 | Create Integrations Grid | Medium | Task 65 |
| 67 | Create Integration Card | Medium | Task 66 |
| 68 | Create Integration Status | Low | Task 67 |
| 69 | Create Connect Integration | Medium | Task 67 |
| 70 | Create Integration Settings Modal | Medium | Task 69 |
| 71 | Create Disconnect Integration | Low | Task 67 |
| 72 | Create API Keys Page | Low | Task 14 |
| 73 | Create API Keys Table | Medium | Task 72 |
| 74 | Define API Key Columns | Medium | Task 73 |
| 75 | Create Generate API Key Modal | Medium | Task 72 |
| 76 | Create API Key Display | Medium | Task 75 |
| 77 | Create Revoke API Key Action | Low | Task 73 |
| 78 | Connect Integrations to API | Medium | Task 77 |

---

## Execution Order

```
Task 65: Integrations Page
    │
    ▼
Task 66: Integrations Grid
    │
    ▼
Task 67: Integration Card
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          │
Task 68    Task 69    Task 71       │
(Status)   (Connect)  (Disconnect)  │
    │          │          │          │
    │          ▼          │          │
    │     Task 70        │          │
    │     (Settings)     │          │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
               └─────────────────────┘
                          │
                          ▼
                    Task 72: API Keys Page
                          │
                          ▼
                    Task 73: API Keys Table
                          │
                          ▼
                    Task 74: Key Columns
                          │
                          ▼
                    Task 75: Generate Modal
                          │
                          ▼
                    Task 76: Key Display
                          │
                          ▼
                    Task 77: Revoke Action
                          │
                          ▼
                    Task 78: API
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── settings/
│           ├── Integrations/
│           │   ├── IntegrationsPage.tsx
│           │   ├── IntegrationsGrid.tsx
│           │   ├── IntegrationCard.tsx
│           │   ├── IntegrationStatus.tsx
│           │   ├── ConnectIntegration.tsx
│           │   ├── IntegrationSettingsModal.tsx
│           │   ├── DisconnectIntegration.tsx
│           │   └── index.ts
│           ├── APIKeys/
│           │   ├── APIKeysPage.tsx
│           │   ├── APIKeysTable.tsx
│           │   ├── APIKeyColumns.tsx
│           │   ├── GenerateKeyModal.tsx
│           │   ├── APIKeyDisplay.tsx
│           │   ├── RevokeKeyAction.tsx
│           │   └── index.ts
│           └── index.ts
```

---

## Notes for AI Agents

### Available Integrations (Tasks 66-67)
| Integration | Description | Category |
|-------------|-------------|----------|
| Payment Gateway | Payment processing | Payment |
| SMS Gateway | SMS notifications | Communication |
| Email Service | Transactional emails | Communication |
| Accounting | Sync with accounting | Finance |
| Shipping | Shipping providers | Logistics |

### Integration Card (Task 67)
| Element | Content |
|---------|---------|
| Logo | Integration logo |
| Name | Integration name |
| Description | Short description |
| Status | Connected/Disconnected |
| Action | Connect/Settings |

### Integration Status (Task 68)
| Status | Color | Icon |
|--------|-------|------|
| Connected | Green | CheckCircle |
| Disconnected | Gray | Circle |
| Error | Red | AlertCircle |

### Integration Settings Modal (Task 70)
| Section | Content |
|---------|---------|
| Credentials | API keys, secrets |
| Options | Configuration options |
| Webhook | Webhook URL |
| Test | Test connection |

### API Key Columns (Task 74)
| Column | Width | Description |
|--------|-------|-------------|
| Name | 200px | Key name/label |
| Key | 200px | Masked (xxx...xxx) |
| Created | 120px | Creation date |
| Last Used | 120px | Last usage |
| Actions | 80px | Revoke |

### Generate API Key Modal (Task 75)
| Field | Type |
|-------|------|
| Name | Text input |
| Permissions | Checkboxes |
| Expiry | Date picker (optional) |

### API Key Display (Task 76)
| Element | Content |
|---------|---------|
| Warning | "Copy now, shown once" |
| Key | Full API key |
| Copy | Copy button |
| Close | Confirm copied |

### API Key Format
| Format | Example |
|--------|---------|
| Prefix | lcc_ |
| Key | lcc_sk_live_xxxxxxxxxxxxx |
| Length | 40 characters |

### Revoke Confirmation (Task 77)
| Element | Content |
|---------|---------|
| Title | Revoke API Key? |
| Warning | Cannot be undone |
| Key Name | Display name |
| Confirm | Type "REVOKE" |
