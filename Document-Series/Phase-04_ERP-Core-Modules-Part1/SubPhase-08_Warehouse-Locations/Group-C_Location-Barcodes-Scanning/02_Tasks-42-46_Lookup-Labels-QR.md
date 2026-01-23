# Tasks 42-46: Lookup, Labels & QR Code

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** C - Location Barcodes & Scanning  
> **Document:** 02 of 03  
> **Tasks Covered:** 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-37-41_Barcode-Generator.md](01_Tasks-37-41_Barcode-Generator.md)
- **→ Next Document:** [03_Tasks-47-50_Bulk-Print-Logging.md](03_Tasks-47-50_Bulk-Print-Logging.md)

---

## Document Overview

This document covers barcode lookup service for scanning operations, barcode label generation for printing, and QR code support with encoded location data. These features enable physical warehouse operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 42 | Create BarcodeLookup service | Medium | 25 min |
| 43 | Add lookup_location method | Low | 15 min |
| 44 | Add lookup_product_in_location | Low | 20 min |
| 45 | Create barcode label generator | High | 30 min |
| 46 | Add QR code support | Medium | 25 min |

---

## Task 42: Create BarcodeLookup Service

### Overview
Create service class for fast location lookup by barcode. This service is used during scanning operations to quickly identify locations.

### Dependencies
- Task 38: Create BarcodeGenerator service
- StorageLocation model complete

### Instructions

1. **Create barcode_lookup.py file** in services directory with BarcodeLookup class
2. **Add lookup infrastructure** with caching support for frequently accessed locations
3. **Implement tenant-aware queries** ensuring locations returned belong to current tenant
4. **Add validation** to verify barcode format before database lookup
5. **Include related data** using select_related for warehouse and parent
6. **Add cache management** with cache invalidation on location updates
7. **Provide lookup statistics** tracking scan frequency and performance

### Expected Outcome
Fast barcode lookup service with caching and performance optimization.

---

## Task 43: Add lookup_location Method

### Overview
Implement primary method to find storage location by scanned barcode. Returns location object or None if not found.

### Dependencies
- Task 42: Create BarcodeLookup service

### Instructions

1. **Add lookup_location method** accepting barcode string and optional tenant
2. **Validate barcode format** using BarcodeGenerator validation before query
3. **Query database** with index on barcode field for fast lookup
4. **Return location object** with prefetched related data (warehouse, parent)
5. **Handle not found case** returning None or raising LocationNotFound exception
6. **Add logging** for scan operations and failed lookups
7. **Cache results** storing recent lookups in Redis cache

### Usage Example
```python
lookup = BarcodeLookup()
location = lookup.lookup_location("LOC-ABC-WHCMB01-A03R02S01B05-7")
if location:
    print(f"Found: {location.location_path}")
```

---

## Task 44: Add lookup_product_in_location Method

### Overview
Find products stored at a scanned location. This method combines location lookup with stock level queries.

### Dependencies
- Task 43: Add lookup_location method
- StockLevel model (future - Phase 04 SubPhase 09)

### Instructions

1. **Add lookup_product_in_location method** combining location and stock queries
2. **Lookup location first** using lookup_location method
3. **Query stock levels** for products at this location (requires StockLevel model)
4. **Return product list** with quantities and product details
5. **Include empty locations** returning empty list if no stock present
6. **Add filters** for active products only, minimum quantity thresholds
7. **Optimize query** using select_related for product foreign keys

### Note
Implementation depends on StockLevel model from SubPhase-09. Prepare method signature and documentation now.

---

## Task 45: Create Barcode Label Generator

### Overview
Generate printable barcode labels for storage locations. Labels include barcode image, human-readable text, and location details.

### Dependencies
- Task 38: Create BarcodeGenerator service
- Python barcode library (python-barcode)
- Pillow for image generation

### Instructions

1. **Create label_generator.py file** in services directory
2. **Add LabelGenerator class** with methods for different label sizes
3. **Install barcode libraries** (python-barcode, Pillow) for image generation
4. **Implement generate_label method**:
   - Accept location object
   - Generate Code 128 barcode image
   - Add human-readable barcode below image
   - Include location path and warehouse name
   - Support different label sizes (2x1", 4x2", 4x6")
5. **Add text formatting** with warehouse name, zone/aisle/rack info
6. **Return image object** as PIL Image or save to file/buffer
7. **Add PDF export** using ReportLab for professional printing
8. **Support label templates** with customizable layouts

### Label Layout Example
```
┌─────────────────────────┐
│  WH-CMB-01              │
│  Storage Zone A         │
│                         │
│  █ █ █  █ ███ █  █ █    │ ← Code 128 Barcode
│  █  █ ██  █ █ █  █ █    │
│                         │
│  LOC-ABC-WHCMB01-...    │ ← Full barcode
│  A03-R02-S01-B05        │ ← Location code
└─────────────────────────┘
```

---

## Task 46: Add QR Code Support

### Overview
Generate QR codes containing encoded location data. QR codes can store more information than linear barcodes and are easier to scan with mobile devices.

### Dependencies
- Task 45: Create barcode label generator
- Python qrcode library

### Instructions

1. **Install qrcode library** (pip install qrcode[pil])
2. **Add generate_qr_code method** to LabelGenerator class
3. **Define QR code data structure**:
   ```json
   {
     "type": "location",
     "location_id": 12345,
     "code": "A03-R02-S01-B05",
     "warehouse_code": "WH-CMB-01",
     "barcode": "LOC-ABC-WHCMB01-A03R02S01B05-7",
     "path": "Zone A > Aisle 3 > Rack 2 > Shelf 1 > Bin 5"
   }
   ```
4. **Encode data as JSON** in QR code
5. **Generate QR image** with appropriate error correction level (Medium)
6. **Add QR to labels** alongside linear barcode for dual scanning option
7. **Create mobile-friendly labels** optimized for smartphone scanning
8. **Add deep linking** QR codes that open app directly to location

### QR Code Benefits
- **More Data:** Store full location path and metadata
- **Mobile Friendly:** Easy smartphone scanning
- **Error Correction:** Works even if partially damaged
- **App Integration:** Deep link to mobile app views

---

## Summary

These five tasks enable physical barcode scanning operations:

1. **BarcodeLookup service** for fast location lookup with caching
2. **lookup_location method** returns location by barcode scan
3. **lookup_product_in_location** finds products at scanned location
4. **Label generator** creates printable barcode labels (Code 128)
5. **QR code support** with encoded JSON data for mobile apps

### What's Next?

The next document covers bulk label printing, scan logging, and analytics.

**→ Continue to:** [03_Tasks-47-50_Bulk-Print-Logging.md](03_Tasks-47-50_Bulk-Print-Logging.md)
