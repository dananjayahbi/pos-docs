# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** F of F  
> **Tasks Covered:** 83-92  
> **Group Goal:** Create frontend components, admin UIs, and integration tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Webhooks-Delivery](../Group-E_Webhooks-Delivery/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-12_SMS-Gateway-Integration](../../SubPhase-12_SMS-Gateway-Integration/)

---

## Group Overview

This group creates frontend and testing. Creates TypeScript interfaces for WhatsApp types. Creates frontend API client for WhatsApp endpoints. Creates WhatsApp opt-in checkbox for checkout flow. Creates notification settings page for customer preferences. Creates message history UI for viewing sent messages. Creates template manager UI for admin CRUD operations. Creates WhatsApp config UI for admin configuration. Creates delivery report UI with message analytics. Creates integration tests for E2E WhatsApp flow. Creates documentation.

### Key Outcomes

- WhatsApp TypeScript types
- WhatsApp API client
- Opt-in checkbox
- Opt-in settings page
- Message history UI
- Template manager UI
- WhatsApp config UI
- Delivery report UI
- Integration tests
- Documentation

### Technology Context

- **Frontend:** Next.js + TypeScript
- **UI:** Shadcn/UI components
- **Admin:** Rich admin interfaces
- **Testing:** pytest + Jest

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-92_Types-Components-Tests.md` | Create types, components, tests | 83-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create WhatsApp Types | Low | Task 82 |
| 84 | Create WhatsApp API Client | Medium | Task 83 |
| 85 | Create Opt-In Checkbox | Medium | Task 84 |
| 86 | Create Opt-In Settings | Medium | Task 84 |
| 87 | Create Message History UI | Medium | Task 84 |
| 88 | Create Template Manager UI | Medium | Task 84 |
| 89 | Create WhatsApp Config UI | Medium | Task 84 |
| 90 | Create Delivery Report UI | Medium | Task 84 |
| 91 | Create Integration Tests | Medium | Task 90 |
| 92 | Create Documentation | Medium | Task 91 |

---

## Execution Order

```
Task 83: WhatsApp Types
    │
    ▼
Task 84: WhatsApp API Client
    │
    ├─────────┬─────────┬─────────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼         ▼         ▼
T-85       T-86       T-87       T-88       T-89     T-90
(OptIn)  (Settings)(History)(Template)(Config)(Report)
    │         │         │         │         │         │
    └─────────┴─────────┴─────────┴─────────┴─────────┘
                              │
                              ▼
                       Task 91: Integration Tests
                              │
                              ▼
                       Task 92: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── notifications/
│       └── whatsapp/
│           ├── types.ts
│           └── client.ts
└── components/
    ├── checkout/
    │   └── WhatsAppOptIn.tsx
    ├── account/
    │   └── NotificationSettings.tsx
    └── admin/
        ├── WhatsAppConfig.tsx
        ├── TemplateManager.tsx
        ├── MessageHistory.tsx
        └── DeliveryReport.tsx

tests/
└── notifications/
    └── test_whatsapp_e2e.py

docs/
└── integrations/
    └── whatsapp.md
```

---

## Notes for AI Agents

### WhatsApp Types (Task 83)
| Type | Fields |
|------|--------|
| WhatsAppConfig | phone_number_id, is_enabled, daily_limit |
| MessageTemplate | name, language, type, params |
| MessageLog | id, status, delivered_at, read_at |
| OptInStatus | customer_id, opted_in, opted_in_at |

### WhatsApp API Client (Task 84)
| Method | Endpoint |
|--------|----------|
| getConfig | GET /api/whatsapp/config/ |
| updateConfig | PUT /api/whatsapp/config/ |
| getTemplates | GET /api/whatsapp/templates/ |
| getMessageHistory | GET /api/whatsapp/messages/ |
| getDeliveryStats | GET /api/whatsapp/stats/ |
| updateOptIn | POST /api/whatsapp/opt-in/ |

### Opt-In Checkbox (Task 85)
| Component | WhatsAppOptIn |
|-----------|---------------|
| Location | Checkout page |
| Text | "Receive order updates via WhatsApp" |
| Default | Unchecked |

### Opt-In Settings (Task 86)
| Component | NotificationSettings |
|-----------|---------------------|
| Location | Account settings |
| Features | Toggle opt-in, view history |

### Message History UI (Task 87)
| Component | MessageHistory |
|-----------|----------------|
| Display | Table of sent messages |
| Columns | Date, Type, Status, Recipient |
| Filter | By status, date range |

### MessageHistory Columns
| Column | Description |
|--------|-------------|
| Date | Sent timestamp |
| Type | Template name |
| Recipient | Phone number (masked) |
| Status | sent/delivered/read/failed |
| Actions | View details |

### Template Manager UI (Task 88)
| Component | TemplateManager |
|-----------|-----------------|
| Features | List, create, edit templates |
| Preview | Template preview with sample |

### WhatsApp Config UI (Task 89)
| Component | WhatsAppConfig |
|-----------|----------------|
| Features | Configure per tenant |
| Fields | Phone ID, token, enable/disable |

### Delivery Report UI (Task 90)
| Component | DeliveryReport |
|-----------|----------------|
| Metrics | Sent, delivered, read, failed |
| Charts | Delivery rate over time |
| Filter | By date range, template |

### Delivery Metrics
| Metric | Description |
|--------|-------------|
| Total Sent | Messages sent |
| Delivered | Successfully delivered |
| Read | Read by customer |
| Failed | Failed delivery |
| Delivery Rate | Delivered / Sent % |
| Read Rate | Read / Delivered % |

### Integration Tests (Task 91)
| Test | Coverage |
|------|----------|
| test_send_template | Send template message |
| test_webhook_delivery | Webhook status update |
| test_opt_in_flow | Customer opt-in |
| test_multilang | Sinhala/Tamil templates |

### Documentation (Task 92)
| Section | Content |
|---------|---------|
| Setup | Meta configuration |
| Templates | Creating templates |
| Webhooks | Webhook setup |
| Troubleshooting | Common issues |
