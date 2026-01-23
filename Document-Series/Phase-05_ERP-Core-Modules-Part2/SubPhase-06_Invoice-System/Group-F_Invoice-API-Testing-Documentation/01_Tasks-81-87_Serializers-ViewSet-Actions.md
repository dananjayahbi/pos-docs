# Tasks 81-87: Invoice API - Serializers, ViewSet & Actions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** F - Invoice API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-88-90_URLs-Tests-Documentation.md](02_Tasks-88-90_URLs-Tests-Documentation.md)

---

## Document Overview

This document covers Django REST Framework serializers, viewsets, filtering, and custom actions for the Invoice API.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create InvoiceSerializer | Medium | 25 min |
| 82 | Create InvoiceLineItemSerializer | Medium | 25 min |
| 83 | Create InvoiceListSerializer | Low | 20 min |
| 84 | Create InvoiceViewSet | High | 30 min |
| 85 | Implement Invoice Filtering | Medium | 25 min |
| 86 | Add Invoice Actions | High | 30 min |
| 87 | Create Aging Report Endpoint | Medium | 30 min |

---

## Tasks 81-87 Summary

Each task follows the pattern:
1. Create serializer/viewset/filter class
2. Define fields and validation
3. Add nested serializers
4. Implement CRUD operations
5. Add custom actions (@action decorators)
6. Configure permissions
7. Test endpoints

**Key API Endpoints:**
```
GET    /api/v1/invoices/              # List
POST   /api/v1/invoices/              # Create
GET    /api/v1/invoices/{id}/         # Detail
PUT    /api/v1/invoices/{id}/         # Update
DELETE /api/v1/invoices/{id}/         # Delete
POST   /api/v1/invoices/{id}/issue/   # Issue
POST   /api/v1/invoices/{id}/send/    # Send email
POST   /api/v1/invoices/{id}/mark-paid/ # Mark paid
GET    /api/v1/invoices/{id}/pdf/     # Download PDF
GET    /api/v1/invoices/reports/aging/ # Aging report
```

**Filtering:** By status, customer, date range, type, overdue flag

**Next:** [02_Tasks-88-90_URLs-Tests-Documentation.md](02_Tasks-88-90_URLs-Tests-Documentation.md)
