# Tasks 79-81: Model & Barcode Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Serializers-API-Views/](../Group-E_Serializers-API-Views/)
- **→ Next Document:** [02_Tasks-82-84_API-Docs-Guide.md](02_Tasks-82-84_API-Docs-Guide.md)

---

## Document Overview

This document covers pytest test cases for warehouse models and barcode functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Warehouse model tests | High | 35 min |
| 80 | Create StorageLocation model tests | High | 40 min |
| 81 | Create barcode generation tests | Medium | 30 min |

---

## Task 79: Create Warehouse Model Tests

Create comprehensive pytest tests for Warehouse model.

**Instructions:**
1. Create tests/ directory in warehouse app
2. Create test_models.py
3. Add pytest fixtures for tenant and warehouse
4. Test warehouse creation with all fields
5. Test is_default constraint (only one per tenant)
6. Test district validation (25 Sri Lankan districts)
7. Test phone_number validation (+94XXXXXXXXX format)
8. Test postal_code validation (5 digits)
9. Test operating_hours JSON field
10. Test warehouse manager methods
11. Test get_active() queryset method
12. Test get_default_warehouse(tenant) utility
13. Test warehouse deletion (soft delete if applicable)
14. Test Meta class (ordering, verbose_name)
15. Use pytest-django and factory_boy

**Test Cases:**
- `test_warehouse_creation`
- `test_warehouse_is_default_constraint`
- `test_warehouse_district_validation`
- `test_warehouse_phone_validation`
- `test_warehouse_postal_code_validation`
- `test_warehouse_get_active_queryset`
- `test_warehouse_get_default`
- `test_warehouse_string_representation`

---

## Task 80: Create StorageLocation Model Tests

Create pytest tests for StorageLocation model and hierarchy.

**Instructions:**
1. Add test_storage_location.py
2. Add fixtures for warehouse and locations (all 5 types)
3. Test location creation with all fields
4. Test parent FK relationship
5. Test hierarchy validation (ZONE→AISLE→RACK→SHELF→BIN)
6. Test location_path property
7. Test depth property calculation
8. Test get_children method
9. Test get_descendants method with max_depth
10. Test circular reference prevention
11. Test warehouse mismatch validation (parent and child must share warehouse)
12. Test location_type choices validation
13. Test is_pickable and is_receivable flags
14. Test capacity validation (weight, volume, quantity)
15. Test BulkLocationGenerator utility

**Test Cases:**
- `test_location_creation`
- `test_location_hierarchy_validation`
- `test_location_path_property`
- `test_location_depth_calculation`
- `test_get_children_method`
- `test_get_descendants_recursive`
- `test_circular_reference_prevention`
- `test_warehouse_mismatch_validation`
- `test_capacity_fields`
- `test_bulk_location_generation`

---

## Task 81: Create Barcode Generation Tests

Create pytest tests for barcode generation and lookup.

**Instructions:**
1. Add test_barcodes.py
2. Test BarcodeGenerator.generate_barcode method
3. Test barcode format: LOC-{TENANT}-{WAREHOUSE}-{LOCATION}-{CHECK}
4. Test Luhn check digit calculation
5. Test barcode uniqueness
6. Test auto-generation signal on location creation
7. Test BarcodeLookup.find_by_barcode method
8. Test BarcodeLookup.find_by_qr_code method
9. Test barcode label generation (Code 128)
10. Test QR code generation
11. Test bulk PDF printing
12. Test BarcodeScan logging
13. Test scan analytics (scan count, last scanned)
14. Test invalid barcode handling (return None or raise exception)

**Test Cases:**
- `test_generate_barcode_format`
- `test_luhn_check_digit`
- `test_barcode_uniqueness`
- `test_auto_generation_signal`
- `test_find_by_barcode`
- `test_find_by_qr_code`
- `test_generate_barcode_label`
- `test_generate_qr_code`
- `test_bulk_pdf_printing`
- `test_scan_logging`
- `test_invalid_barcode_handling`

---

## Summary

These three tasks created comprehensive model and barcode tests:

1. **Warehouse model tests** - Creation, validation, constraints, manager methods
2. **StorageLocation tests** - Hierarchy validation, path/depth calculation, recursive methods, bulk generation
3. **Barcode tests** - Generation with Luhn check, auto-signals, lookup, labels, QR codes, scan logging

All tests use:
- pytest-django framework
- factory_boy for test data
- Fixtures for reusable test objects
- Sri Lankan context validation (districts, phone format, postal codes)
- Edge case handling (circular refs, warehouse mismatch, invalid barcodes)

**→ Next:** [API Tests, Docs & Guide](02_Tasks-82-84_API-Docs-Guide.md)

Tasks 82-84 will create API tests and user documentation.
