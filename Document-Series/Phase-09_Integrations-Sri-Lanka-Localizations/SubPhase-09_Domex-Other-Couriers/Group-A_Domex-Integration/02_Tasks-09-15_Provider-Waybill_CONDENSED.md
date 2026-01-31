# Tasks 09-15: Provider Implementation and Waybill

> **Phase:** 09 | **SubPhase:** 09 | **Group:** A | **Document:** 02 of 03

## Navigation
- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md) | **← Previous:** [01_Tasks-01-08_Configuration-Client.md](01_Tasks-01-08_Configuration-Client.md) | **→ Next:** [03_Tasks-16-22_Webhook-Admin-Verify.md](03_Tasks-16-22_Webhook-Admin-Verify.md)

## Document Overview
DomexProvider class implementing ShippingProvider interface: shipment creation, rate calculation, tracking, cancellation, waybill generation, and label download.

### Tasks Summary
| Task | Name | Time | Task | Name | Time |
|------|------|------|------|------|------|
| 09 | Provider Class | 90m | 12 | Track Shipment | 45m |
| 10 | Create Shipment | 60m | 13 | Cancel Shipment | 30m |
| 11 | Get Rates | 50m | 14 | Waybill Generation | 50m |
| - | - | - | 15 | Label Download | 30m |

---

## Task 09: Create DomexProvider Class

**Overview:** Main provider class implementing ShippingProvider interface with data transformation.

**Dependencies:** Task 08, SubPhase-08 ShippingProvider interface

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/provider.py`
2. Import ShippingProvider, DomexClient, DomexConfig, constants, exceptions, models
3. Define DomexProvider inheriting from ShippingProvider ABC
4. Implement __init__(tenant): load DomexConfig, initialize DomexClient, validate config
5. Implement get_provider_name() → "Domex"
6. Implement get_provider_code() → "domex"
7. Implement is_available() → check is_active, is_configured(), test_connection()
8. Create _transform_address_to_domex(Address) → Domex format dict
9. Create _transform_shipment_request(data) → Domex API format
10. Create _transform_domex_shipment(response) → internal Shipment object
11. Create _handle_api_error(exception) → wrap to generic shipping errors
12. Create _validate_shipment_data(data) → check required fields, addresses, weight, dimensions

**Interface Methods:** get_provider_name/code, is_available, create_shipment, get_rates, track_shipment, cancel_shipment (Tasks 10-13)

**Data Transform:** Internal Address/Shipment ↔ Domex API format | Service types: standard/express/same_day ↔ DOMEX_STANDARD/EXPRESS/SAMEDAY

**Validation:** Check from/to addresses complete | weight > 0 | service_type supported

**Verification:** ✓ provider.py created ✓ Inherits ShippingProvider ✓ __init__ ✓ Interface methods ✓ Transform methods ✓ Validation

---

## Task 10: Create create_shipment Method

**Overview:** Create shipment with Domex, return Shipment object with waybill.

**Dependencies:** Task 09 complete

**Instructions:**
1. Define: `create_shipment(from_address, to_address, package_details, service_type="standard", cod_amount=None, reference_number=None)` → Shipment
2. Validate: _validate_shipment_data() - check addresses, package details, service type
3. Transform addresses: _transform_address_to_domex() for sender/recipient
4. Prepare request: build dict with sender, recipient, service_code, package, payment (COD if applicable), description, reference
5. Handle COD: if cod_amount > 0, set payment.method="COD", payment.amount=cod_amount
6. Call API: client.post(CREATE_SHIPMENT_PATH, data)
7. Parse response: extract shipment_id, waybill_number, tracking_url, estimated_delivery
8. Save locally: create Shipment model with provider="domex", provider_shipment_id, waybill_number, status=PENDING
9. Handle errors: catch validation/API errors, wrap appropriately
10. Return: Shipment object

**Domex Request Format:** sender{name, phone, address, city, postal_code}, recipient{...}, service_code, package{weight, dimensions}, payment{method, amount}, description, reference

**COD Handling:** payment.method="COD" | payment.amount=cod_amount | Validate cod_amount > 0

**Verification:** ✓ Method implemented ✓ Signature correct ✓ Validation ✓ Transform ✓ API call ✓ Parse response ✓ Save local ✓ COD support ✓ Error handling

---

## Task 11: Create get_rates Method

**Overview:** Calculate shipping rates for multiple service options.

**Dependencies:** Task 09 complete

**Instructions:**
1. Define: `get_rates(from_address, to_address, package_details, service_types=None)` → List[Rate]
2. Validate: addresses have city/postal_code, package_details has weight
3. Transform: extract origin/destination city+postal, weight, dimensions
4. Prepare request: dict with origin, destination, package
5. Call API: client.post(GET_RATES_PATH, data)
6. Parse response: extract rates array with service_code, service_name, price, currency, estimated_days
7. Filter: if service_types provided, filter to requested types only
8. Transform: create Rate objects with provider="domex", service_type (mapped), service_name, price, currency, estimated_days
9. Sort: by price (lowest first) or by speed (fastest first)
10. Return: List[Rate]

**Domex Request:** origin{city, postal_code}, destination{city, postal_code}, package{weight, dimensions}, declared_value

**Service Mapping:** DOMEX_STANDARD → standard | DOMEX_EXPRESS → express | DOMEX_SAMEDAY → same_day

**Rate Object:** provider, service_type, service_name, price, currency, estimated_days, description

**Verification:** ✓ Method implemented ✓ Validation ✓ API call ✓ Parse response ✓ Service mapping ✓ Filtering ✓ Sorting ✓ Returns List[Rate]

---

## Task 12: Create track_shipment Method

**Overview:** Retrieve current status and tracking history for shipment.

**Dependencies:** Task 09 complete

**Instructions:**
1. Define: `track_shipment(tracking_number, provider_shipment_id=None)` → TrackingInfo
2. Validate: tracking_number not empty
3. Call API: client.get(f"/track/{tracking_number}")
4. Parse response: current_status, current_location, estimated_delivery, events[]
5. Map status: use status mapping (DOMEX_STATUS → Internal ShipmentStatus)
6. Transform events: create TrackingEvent objects with timestamp, status, location, description
7. Build TrackingInfo: tracking_number, provider="domex", current_status, current_location, estimated_delivery, tracking_events[]
8. Update local: if Shipment exists, update status and last_tracked_at
9. Handle errors: 404 → TrackingNotFoundError
10. Return: TrackingInfo object

**Status Mapping:** PENDING→pending, PICKED_UP→picked_up, IN_TRANSIT→in_transit, OUT_FOR_DELIVERY→out_for_delivery, DELIVERED→delivered, FAILED→failed, CANCELLED→cancelled

**TrackingEvent:** timestamp, status, location, description, event_code

**Verification:** ✓ Method implemented ✓ Validation ✓ API call ✓ Status mapping ✓ Events transform ✓ TrackingInfo created ✓ Local update ✓ Error handling

---

## Task 13: Create cancel_shipment Method

**Overview:** Cancel shipment before pickup/delivery.

**Dependencies:** Task 09 complete

**Instructions:**
1. Define: `cancel_shipment(shipment_id=None, tracking_number=None, reason=None)` → bool
2. Validate: shipment identifier provided
3. Load local: find shipment by ID or tracking number
4. Check eligibility: status must be PENDING or PICKED_UP (not OUT_FOR_DELIVERY/DELIVERED/CANCELLED)
5. Call API: client.post(f"/shipments/{shipment_id}/cancel", {"reason": reason})
6. Parse response: check success, extract cancellation_fee if applicable
7. Update local: set status=CANCELLED, cancelled_at=now, cancellation_reason=reason
8. Handle errors: non-cancellable status → ShippingBusinessRuleError, not found → ShipmentNotFoundError
9. Return: True if success, False if failed (non-error)

**Eligibility:** PENDING/PICKED_UP → can cancel | IN_TRANSIT → maybe | OUT_FOR_DELIVERY/DELIVERED/CANCELLED → cannot cancel

**Error Handling:** Not cancellable → ShippingBusinessRuleError | Not found → ShipmentNotFoundError | Already cancelled → return True (idempotent)

**Verification:** ✓ Method implemented ✓ Eligibility check ✓ API call ✓ Parse response ✓ Local update ✓ Error handling ✓ Returns bool ✓ Idempotent

---

## Task 14: Create Waybill Generation

**Overview:** Generate and retrieve waybill with barcode.

**Dependencies:** Task 10 complete

**Instructions:**
1. Waybill auto-generated during create_shipment - extract waybill_number from response
2. Store waybill_number in Shipment.waybill_number field
3. Create `get_waybill(shipment_id)` → Waybill object
4. Call API: client.get(f"/waybill/{shipment_id}")
5. Parse response: waybill_number, barcode_type, barcode_data, barcode_image (base64), label_url, shipment_details
6. Generate barcode locally if not provided: use python-barcode library, Code128 format
7. Create Waybill object: waybill_number, shipment_id, barcode_type, barcode_data, barcode_image, label_url
8. Cache: store barcode in Shipment.waybill_barcode field
9. Handle errors: not ready → retry after delay (2s, 5s), not found → ShipmentNotFoundError
10. Format for printing: include sender/recipient, service, barcode

**Waybill Fields:** waybill_number (unique ID) | barcode_type (CODE128/QR) | barcode_data | barcode_image (base64) | label_url

**Barcode Generation:** If API doesn't provide: use Code128(waybill_number), convert to base64 PNG

**Retry Logic:** Attempt 1: immediate | Attempt 2: wait 2s | Attempt 3: wait 5s | Fail: raise exception

**Verification:** ✓ Waybill extracted in create_shipment ✓ get_waybill() implemented ✓ API call ✓ Parse response ✓ Barcode handling ✓ Caching ✓ Retry logic

---

## Task 15: Create Label Download

**Overview:** Download printable shipping label in PDF/PNG/ZPL format.

**Dependencies:** Task 14 complete

**Instructions:**
1. Define: `download_label(shipment_id=None, waybill_number=None, format="pdf", save_to_storage=True)` → bytes or str (path/URL)
2. Check cache: if label already downloaded and save_to_storage, return cached path/URL
3. Call API: client.get(f"/labels/{shipment_id}", headers={'Accept': format_content_type})
4. Receive binary: validate Content-Type matches, check file size (1KB < size < 10MB)
5. Save to storage: if save_to_storage: generate filename (shipment_id.pdf), save to MEDIA_ROOT/labels/ or S3
6. Update Shipment: set label_url, label_file_path, label_format, label_downloaded_at
7. Handle formats: PDF (application/pdf), PNG (image/png), ZPL (application/vnd.zebra.zpl)
8. Handle errors: not ready → retry, format error → InvalidFormatError
9. Create `get_label_url(shipment_id)` → str: return URL without downloading
10. Return: bytes if not saved, or file path/URL if saved

**Formats:** PDF (standard printers) | PNG (thermal printers) | ZPL (Zebra printers)

**Storage:** Local: /media/labels/{filename} | S3: s3://bucket/labels/{tenant}/{shipment_id}.pdf

**Caching:** Check label_url exists and file age < 24h → return cached | force_download=True → re-download

**Verification:** ✓ download_label() implemented ✓ Binary content ✓ Multiple formats ✓ Save to storage ✓ Caching ✓ get_label_url() ✓ Error handling

---

## Summary

**Completed:** 7 tasks implementing core shipping functionality

**Deliverables:**
- Provider Class: Complete ShippingProvider implementation
- Shipment Creation: Full creation with COD support
- Rate Calculation: Multi-service rates with comparison
- Tracking: Real-time status with event history
- Cancellation: Business rule-aware cancellation
- Waybill: Auto-generation with barcode
- Labels: Multi-format download and caching

**Next:** Proceed to [03_Tasks-16-22_Webhook-Admin-Verify.md](03_Tasks-16-22_Webhook-Admin-Verify.md) for webhook handling, admin interface, and verification

---

**Total Tasks:** 7 | **Est. Time:** 5.5 hours | **Lines:** ~950
