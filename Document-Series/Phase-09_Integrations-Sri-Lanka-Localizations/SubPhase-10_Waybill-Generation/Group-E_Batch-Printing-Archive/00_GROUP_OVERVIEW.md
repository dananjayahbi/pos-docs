# Group E: Batch Printing & Archive

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement batch waybill generation, print queue, and archive management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Label-Templates](../Group-D_Label-Templates/)
- **→ Next Group:** [Group-F_API-Frontend](../Group-F_API-Frontend/)

---

## Group Overview

This group implements batch and archive. Creates WaybillService as main service with generate_single method for single waybill and generate_batch for multiple waybills. Creates BatchWaybillJob Celery task with progress tracking. Creates batch download as ZIP file. Creates print queue for ordered printing. Creates ArchiveService for old waybill storage with S3 configuration. Creates archive retention policy (90 days). Creates archive cleanup Celery task. Creates reprint service for existing waybills. Verifies batch and archive flow.

### Key Outcomes

- WaybillService
- generate_single method
- generate_batch method
- BatchWaybillJob Celery task
- Batch progress tracking
- Batch download ZIP
- Print queue
- Print order/sequence
- Archive service
- S3 storage
- Archive retention
- Archive cleanup task
- Reprint service
- Batch & archive verified

### Technology Context

- **Celery:** Async batch processing
- **S3:** Cloud storage for archive
- **ZIP:** Multi-file download
- **Retention:** 90-day policy

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-74_Service-Batch-Queue.md` | Create service and batch | 67-74 |
| 02 | `02_Tasks-75-80_Archive-Reprint-Verify.md` | Create archive and reprint | 75-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create WaybillService | High | Task 66 |
| 68 | Create generate_single | Medium | Task 67 |
| 69 | Create generate_batch | Medium | Task 67 |
| 70 | Create BatchWaybillJob | Medium | Task 69 |
| 71 | Create Batch Progress | Low | Task 70 |
| 72 | Create Batch Download | Medium | Task 70 |
| 73 | Create Print Queue | Medium | Task 69 |
| 74 | Create Print Order | Low | Task 73 |
| 75 | Create Archive Service | Medium | Task 67 |
| 76 | Create S3 Storage | Medium | Task 75 |
| 77 | Create Archive Retention | Low | Task 76 |
| 78 | Create Archive Cleanup | Medium | Task 77 |
| 79 | Create Reprint Service | Low | Task 67 |
| 80 | Verify Batch & Archive | Low | Task 79 |

---

## Execution Order

```
Task 67: WaybillService
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Task 68: generate_single                    Task 75: Archive Service
    │                                             │
    ▼                                             ▼
Task 69: generate_batch                     Task 76: S3 Storage
    │                                             │
    ├─────────────────────┐                       ▼
    ▼                     ▼                 Task 77: Retention
Task 70: BatchJob     Task 73: Print Queue        │
    │                     │                       ▼
    ├─────────┐           ▼                 Task 78: Cleanup
    ▼         ▼     Task 74: Order               │
T-71      T-72           │                       │
(Prog)   (Down)          │                       │
    │         │           │                       │
    └─────────┴───────────┴───────────────────────┘
                          │
                          ▼
                  Task 79: Reprint Service
                          │
                          ▼
                  Task 80: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── services/
        │   ├── waybill_service.py
        │   ├── batch_waybill.py
        │   └── archive_service.py
        └── tasks/
            ├── batch_waybill_task.py
            └── archive_cleanup_task.py
```

---

## Notes for AI Agents

### WaybillService (Task 67)
| Class | WaybillService |
|-------|----------------|
| Purpose | Central waybill operations |

### generate_single (Task 68)
| Method | generate_single(order_id) |
|--------|---------------------------|
| Return | Waybill instance |
| Action | Generate one waybill |

### generate_batch (Task 69)
| Method | generate_batch(order_ids) |
|--------|---------------------------|
| Return | List[Waybill] |
| Action | Generate multiple waybills |

### BatchWaybillJob (Task 70)
| Task | batch_waybill_task |
|------|-------------------|
| Type | Celery task |
| Queue | default |

### Batch Progress (Task 71)
| Track | Progress percentage |
|-------|---------------------|
| Storage | Redis |
| Update | Per waybill |

### Batch Download (Task 72)
| Format | ZIP file |
|--------|----------|
| Content | All PDFs |
| Name | waybills_{date}.zip |

### Print Queue (Task 73)
| Model | PrintQueueItem |
|-------|----------------|
| Order | FIFO |
| Status | pending, printed |

### Print Order (Task 74)
| Sequence | Order date |
|----------|------------|
| Priority | Urgent first |

### Archive Service (Task 75)
| Class | ArchiveService |
|-------|----------------|
| Purpose | Move old waybills to archive |

### S3 Storage (Task 76)
| Bucket | waybill-archive |
|--------|-----------------|
| Path | {tenant}/{year}/{month}/ |

### Archive Retention (Task 77)
| Policy | 90 days |
|--------|---------|
| After | Move to archive |
| Archive | Permanent or delete |

### Archive Cleanup (Task 78)
| Task | archive_cleanup_task |
|------|---------------------|
| Schedule | Daily |
| Action | Archive old, delete expired |

### Reprint Service (Task 79)
| Method | reprint(waybill_id) |
|--------|---------------------|
| Action | Regenerate PDF |
| Source | Existing waybill data |
