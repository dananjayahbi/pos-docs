# Group F: API & Frontend

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Create REST APIs, TypeScript types, frontend components, and tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Batch-Printing-Archive](../Group-E_Batch-Printing-Archive/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-11_WhatsApp-Business-API](../../SubPhase-11_WhatsApp-Business-API/)

---

## Group Overview

This group creates API and frontend. Creates Waybill API ViewSet with generate endpoint (POST /api/waybills/), batch endpoint (POST /api/waybills/batch/), and download endpoint (GET /api/waybills/{id}/pdf/). Creates TypeScript interfaces for waybill types. Creates frontend API client. Creates WaybillPrintButton component for single waybill printing. Creates BatchPrintDialog for batch printing with selection. Creates WaybillHistory UI showing past waybills. Creates integration tests for E2E waybill flow.

### Key Outcomes

- Waybill API views
- Generate endpoint
- Batch endpoint
- Download endpoint
- Waybill TypeScript types
- Waybill API client
- WaybillPrintButton
- BatchPrintDialog
- WaybillHistory UI
- Integration tests

### Technology Context

- **API:** Django REST Framework
- **Frontend:** Next.js + TypeScript
- **UI:** Shadcn/UI components
- **Tests:** pytest + Jest

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-90_API-Components-Tests.md` | Create APIs, components, tests | 81-90 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Waybill API Views | Medium | Task 80 |
| 82 | Create generate Endpoint | Medium | Task 81 |
| 83 | Create batch Endpoint | Medium | Task 81 |
| 84 | Create download Endpoint | Low | Task 81 |
| 85 | Create Waybill Types | Low | Task 81 |
| 86 | Create Waybill API Client | Medium | Task 85 |
| 87 | Create WaybillPrintButton | Medium | Task 86 |
| 88 | Create BatchPrintDialog | Medium | Task 86 |
| 89 | Create Waybill History UI | Medium | Task 86 |
| 90 | Create Integration Tests | Medium | Task 89 |

---

## Execution Order

```
Task 81: Waybill API Views
    │
    ├─────────────┬─────────────┬─────────────┐
    ▼             ▼             ▼             ▼
T-82          T-83          T-84          T-85
(Gen)        (Batch)      (Download)    (Types)
    │             │             │             │
    │             │             │             ▼
    │             │             │          Task 86: API Client
    │             │             │             │
    │             │             │    ┌────────┼────────┐
    │             │             │    ▼        ▼        ▼
    │             │             │ T-87      T-88     T-89
    │             │             │(Print)  (Batch)  (History)
    │             │             │    │        │        │
    └─────────────┴─────────────┴────┴────────┴────────┘
                                      │
                                      ▼
                               Task 90: Integration Tests
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        └── api/
            ├── waybill_views.py
            ├── serializers.py
            └── urls.py

frontend/
├── lib/
│   └── shipping/
│       └── waybill/
│           ├── types.ts
│           └── client.ts
└── components/
    └── orders/
        ├── WaybillPrintButton.tsx
        ├── BatchPrintDialog.tsx
        └── WaybillHistory.tsx

tests/
└── shipping/
    └── test_waybill_e2e.py
```

---

## Notes for AI Agents

### Waybill API Views (Task 81)
| ViewSet | WaybillViewSet |
|---------|----------------|
| Actions | list, retrieve, create |

### generate Endpoint (Task 82)
| Endpoint | POST /api/waybills/ |
|----------|---------------------|
| Body | { order_id, courier_type, template } |
| Return | Waybill object with PDF URL |

### batch Endpoint (Task 83)
| Endpoint | POST /api/waybills/batch/ |
|----------|---------------------------|
| Body | { order_ids, courier_type } |
| Return | Task ID for progress |

### download Endpoint (Task 84)
| Endpoint | GET /api/waybills/{id}/pdf/ |
|----------|------------------------------|
| Return | PDF file download |
| Content-Type | application/pdf |

### Waybill Types (Task 85)
| Type | Fields |
|------|--------|
| Waybill | id, waybill_number, order_id, status, pdf_url |
| WaybillRequest | order_id, courier_type, template |
| BatchProgress | task_id, progress, completed |

### Waybill API Client (Task 86)
| Method | Endpoint |
|--------|----------|
| generate | POST /api/waybills/ |
| generateBatch | POST /api/waybills/batch/ |
| download | GET /api/waybills/{id}/pdf/ |
| getHistory | GET /api/waybills/?order_id= |

### WaybillPrintButton (Task 87)
| Component | WaybillPrintButton |
|-----------|-------------------|
| Props | orderId, onPrint |
| Action | Generate and download |
| Display | Print icon button |

### BatchPrintDialog (Task 88)
| Component | BatchPrintDialog |
|-----------|------------------|
| Props | orderIds, onComplete |
| Features | Select orders, progress bar |
| Action | Batch generate, download ZIP |

### BatchPrintDialog Steps
| Step | Action |
|------|--------|
| 1 | Select orders |
| 2 | Choose courier |
| 3 | Start batch |
| 4 | Show progress |
| 5 | Download ZIP |

### WaybillHistory UI (Task 89)
| Component | WaybillHistory |
|-----------|----------------|
| Props | orderId (optional) |
| Display | Table of past waybills |
| Actions | Download, reprint |

### WaybillHistory Columns
| Column | Description |
|--------|-------------|
| Waybill # | Waybill number |
| Order | Order reference |
| Courier | Courier type |
| Generated | Date/time |
| Status | Current status |
| Actions | Download, reprint |

### Integration Tests (Task 90)
| Test | Coverage |
|------|----------|
| test_generate_waybill | Single generation |
| test_batch_generation | Batch flow |
| test_download_pdf | PDF download |
| test_barcode_scan | Barcode validity |
| test_template_render | Template rendering |
