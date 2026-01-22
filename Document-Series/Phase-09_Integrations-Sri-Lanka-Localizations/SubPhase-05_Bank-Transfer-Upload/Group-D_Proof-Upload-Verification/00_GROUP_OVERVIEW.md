# Group D: Proof Upload & Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** D of F  
> **Tasks Covered:** 45-58  
> **Group Goal:** Implement payment proof upload with file validation and secure storage

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Payment-Reference-Instructions](../Group-C_Payment-Reference-Instructions/)
- **→ Next Group:** [Group-E_Admin-Verification-Workflow](../Group-E_Admin-Verification-Workflow/)

---

## Group Overview

This group implements proof upload and verification. Creates PaymentProof model with file field, upload timestamp, and customer notes. Creates upload validation for file types. Creates image validation for JPG and PNG. Creates PDF validation. Creates file size limit of 5MB. Creates image compression for large images. Creates secure upload URL with signed URLs. Creates S3 storage for proofs. Creates upload API endpoint. Creates multiple uploads support. Verifies upload flow.

### Key Outcomes

- PaymentProof model
- File field
- Upload timestamp
- Customer notes
- Upload validation
- Image validation (JPG, PNG)
- PDF validation
- File size limit (5MB)
- Image compression
- Secure upload URL
- S3 storage
- Upload API
- Multiple uploads
- Upload flow verified

### Technology Context

- **Files:** JPG, PNG, PDF
- **Size:** Max 5MB
- **Storage:** S3 or local
- **Security:** Signed URLs

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-45-51_Model-Validation.md` | Create model and validation | 45-51 |
| 02 | `02_Tasks-52-58_Storage-API-Verify.md` | Create storage and API | 52-58 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 45 | Create PaymentProof Model | Medium | Task 44 |
| 46 | Create File Field | Low | Task 45 |
| 47 | Create Upload Timestamp | Low | Task 45 |
| 48 | Create Customer Notes | Low | Task 45 |
| 49 | Create Upload Validation | Medium | Task 45 |
| 50 | Create Image Validation | Low | Task 49 |
| 51 | Create PDF Validation | Low | Task 49 |
| 52 | Create File Size Limit | Low | Task 49 |
| 53 | Create Image Compression | Medium | Task 49 |
| 54 | Create Secure Upload URL | Medium | Task 45 |
| 55 | Create S3 Storage | Medium | Task 45 |
| 56 | Create Upload API | Medium | Task 45 |
| 57 | Create Multiple Uploads | Low | Task 56 |
| 58 | Verify Upload Flow | Low | Task 57 |

---

## Execution Order

```
Task 45: PaymentProof Model
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-46     T-47     T-48     T-49     T-54     T-55     T-56
(File) (Time)  (Notes)(Valid)(Secure) (S3)   (API)
    │        │        │        │        │        │      │
    │        │        │   ┌────┼────┬───┤        │      │
    │        │        │   ▼    ▼    ▼   │        │      ▼
    │        │        │ T-50  T-51  T-52│        │    T-57
    │        │        │(Img) (PDF)(Size)│        │  (Multi)
    │        │        │   │    │    │   │        │      │
    │        │        │   │    │    ▼   │        │      │
    │        │        │   │    │  T-53  │        │      │
    │        │        │   │    │(Compress)       │      │
    │        │        │   │    │    │   │        │      │
    └────────┴────────┴───┴────┴────┴───┴────────┴──────┘
                              │
                              ▼
                        Task 58: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── models/
        │   └── payment_proof.py
        ├── api/
        │   └── bank_transfer_views.py
        └── utils/
            └── file_validators.py
```

---

## Notes for AI Agents

### PaymentProof Model (Task 45)
| Field | Type |
|-------|------|
| transaction | ForeignKey |
| file | FileField |
| uploaded_at | DateTimeField |
| notes | TextField |

### File Field (Task 46)
| Field | Type |
|-------|------|
| Name | file |
| Upload to | proofs/{tenant}/{order}/ |
| Storage | S3 or local |

### Upload Timestamp (Task 47)
| Field | Type |
|-------|------|
| Name | uploaded_at |
| Auto | auto_now_add=True |

### Customer Notes (Task 48)
| Field | Type |
|-------|------|
| Name | notes |
| Optional | Yes |
| Max length | 500 |

### Upload Validation (Task 49)
| Validate | File type, size |
|----------|-----------------|
| Error | Invalid file message |

### Image Validation (Task 50)
| Types | JPG, JPEG, PNG |
|-------|----------------|
| Magic bytes | Validate header |
| Min size | 10KB |

### PDF Validation (Task 51)
| Type | PDF |
|------|-----|
| Magic bytes | %PDF header |
| Min size | 10KB |

### File Size Limit (Task 52)
| Limit | 5MB |
|-------|-----|
| Error | "File exceeds 5MB limit" |

### Image Compression (Task 53)
| Library | Pillow |
|---------|--------|
| Max dimension | 2000px |
| Quality | 85% |
| Trigger | > 2MB |

### Secure Upload URL (Task 54)
| Type | Pre-signed URL |
|------|----------------|
| Expiry | 15 minutes |
| Use | Direct S3 upload |

### S3 Storage (Task 55)
| Bucket | payment-proofs |
|--------|----------------|
| Path | {tenant}/{year}/{month}/ |
| ACL | Private |

### Upload API (Task 56)
| Endpoint | POST /api/payments/{id}/proof/ |
|----------|--------------------------------|
| Content | multipart/form-data |
| Auth | Customer token |

### Multiple Uploads (Task 57)
| Allow | Multiple proofs |
|-------|-----------------|
| Max | 3 files per transaction |
| Use | Multiple transfer receipts |
