# Group C: Location Barcodes & Scanning

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** C of F  
> **Tasks Covered:** 37-50  
> **Group Goal:** Implement barcode generation and scanning support for warehouse operations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Storage-Location-Hierarchy](../Group-B_Storage-Location-Hierarchy/)
- **→ Next Group:** [Group-D_Warehouse-Operations-Routes](../Group-D_Warehouse-Operations-Routes/)

---

## Group Overview

### Key Outcomes
- Barcode format constants (prefix, length, check digit)
- BarcodeGenerator service class
- generate_location_barcode method
- Barcode validation with check digit
- Auto-generate barcode signal (pre_save)
- BarcodeLookup service
- lookup_location method (find by barcode)
- lookup_product_in_location method
- Barcode label generator (printable labels)
- QR code support with encoded data
- Bulk barcode print (PDF generation)
- Barcode scan logging for audit
- BarcodeScan model (location, user, timestamp)
- Scan analytics (frequency tracking)

### Technology Context
- **Barcode Format:** LOC-{TENANT}-{WAREHOUSE}-{LOCATION}-{CHECK}
- **QR Code:** Encoded JSON with location data
- **PDF:** ReportLab or WeasyPrint for label generation
- **Analytics:** Track scan frequency for optimization

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-37-41_Barcode-Generator.md | 37-41 | Constants, BarcodeGenerator, generate, validate, auto-signal |
| 02 | 02_Tasks-42-46_Lookup-Labels-QR.md | 42-46 | BarcodeLookup, lookup methods, label generator, QR code |
| 03 | 03_Tasks-47-50_Bulk-Print-Logging.md | 47-50 | Bulk print PDF, scan logging, BarcodeScan model, analytics |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Define barcode format constants | Low | 10 min |
| 38 | Create BarcodeGenerator service | Medium | 25 min |
| 39 | Implement generate_location_barcode | Low | 20 min |
| 40 | Add barcode validation method | Low | 20 min |
| 41 | Create auto-generate barcode signal | Low | 20 min |
| 42 | Create BarcodeLookup service | Medium | 25 min |
| 43 | Add lookup_location method | Low | 15 min |
| 44 | Add lookup_product_in_location | Low | 20 min |
| 45 | Create barcode label generator | High | 30 min |
| 46 | Add QR code support | Medium | 25 min |
| 47 | Create bulk barcode print | High | 30 min |
| 48 | Add barcode scan logging | Low | 20 min |
| 49 | Create BarcodeScan model | Medium | 25 min |
| 50 | Add scan analytics | Low | 20 min |

---

## Execution Order

```
Tasks 37-41: Barcode Generator
    │ (constants, service, generate, validate, signal)
    ▼
Tasks 42-46: Lookup & Labels
    │ (BarcodeLookup, lookup methods, labels, QR code)
    ▼
Tasks 47-50: Bulk Print & Logging
    │ (bulk print PDF, scan logging, BarcodeScan, analytics)
```

---

## Expected Deliverables

```
backend/apps/inventory/warehouses/
├── constants.py (updated - barcode format)
├── models/
│   ├── __init__.py (updated)
│   └── barcode_scan.py (NEW)
├── services/
│   ├── __init__.py (NEW)
│   ├── barcode_generator.py (NEW)
│   ├── barcode_lookup.py (NEW)
│   └── label_generator.py (NEW)
└── signals.py (NEW or updated)
```

---

## Notes for AI Agents

1. **Barcode Format:**
   ```
   LOC-{TENANT_PREFIX}-{WAREHOUSE_CODE}-{LOCATION_CODE}-{CHECK_DIGIT}
   Example: LOC-ABC-WH01-A0301-7
   ```
2. **Check Digit:** Luhn algorithm for validation
3. **Auto-Generate:** Pre-save signal creates barcode if empty
4. **BarcodeLookup:** Query by exact barcode match
5. **lookup_product_in_location:** Join with StockLevel for product info
6. **Label Generator:** Create printable barcode images
7. **QR Code Data:**
   ```json
   {"loc_id": 123, "code": "A0301", "wh": "WH01"}
   ```
8. **Bulk Print:** PDF with multiple labels per page
9. **BarcodeScan Fields:** location FK, user FK, timestamp, scan_type
10. **scan_type:** PICKING, RECEIVING, INVENTORY_COUNT
11. **Analytics:** Count scans per location for heat mapping
12. **Next Group:** Warehouse Operations & Routes (Group D)
