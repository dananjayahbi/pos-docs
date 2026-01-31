# Tasks 16-22: Webhook, Admin Interface, and Verification

> **Phase:** 09 | **SubPhase:** 09 | **Group:** A | **Document:** 03 of 03

## Navigation
- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md) | **← Previous:** [02_Tasks-09-15_Provider-Waybill.md](02_Tasks-09-15_Provider-Waybill.md)

## Document Overview
Final components: webhook handling, status mapping, COD support, pickup scheduling, provider registration, admin interface, and integration verification.

### Tasks Summary
| Task | Name | Time | Task | Name | Time |
|------|------|------|------|------|------|
| 16 | Webhook Handler | 60m | 20 | Provider Registration | 20m |
| 17 | Status Mapping | 30m | 21 | Admin Interface | 50m |
| 18 | COD Support | 45m | 22 | Integration Verification | 60m |
| 19 | Pickup Scheduling | 50m | - | - | - |

---

## Task 16: Create Domex Webhook

**Overview:** Webhook endpoint for real-time status updates from Domex.

**Dependencies:** Task 09 complete

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/webhooks.py`
2. Define URL: `/api/webhooks/domex/` (POST only, publicly accessible, CSRF exempt)
3. Create handler: `domex_webhook_handler(request)` Django view
4. Verify signature: extract X-Domex-Signature header, compute HMAC-SHA256 with webhook_secret, compare (constant-time)
5. Parse payload: extract event_id, event_type, timestamp, data{shipment_id, waybill_number, old_status, new_status, location, notes}
6. Find shipment: lookup by waybill_number or provider_shipment_id
7. Map status: use Task 17 mapping (Domex → Internal)
8. Update shipment: set status, current_location, last_tracked_at, create TrackingEvent
9. Trigger notifications: async Celery task for customer/merchant notifications
10. Return: 200 OK (success), 400 (invalid payload), 401 (invalid signature), 404 (shipment not found → still 200 for idempotency)
11. Implement idempotency: track event_id in cache/DB, skip if already processed
12. Log: all webhooks received, signature results, updates, errors (mask sensitive data)

**Signature Verification:** Get X-Domex-Signature → Get webhook_secret from DomexConfig → Compute HMAC-SHA256(secret, payload_bytes) → Compare

**Event Types:** shipment.created, shipment.picked_up, shipment.in_transit, shipment.out_for_delivery, shipment.delivered, shipment.failed, shipment.cancelled, cod.collected

**Idempotency:** Store event_id in Redis/DB with 7-day TTL → Skip if exists

**Verification:** ✓ webhooks.py created ✓ URL registered ✓ Handler view ✓ Signature verification ✓ Payload parsing ✓ Shipment update ✓ Notifications ✓ Idempotency ✓ Logging

---

## Task 17: Create Status Mapping

**Overview:** Map Domex status codes to internal ShipmentStatus.

**Dependencies:** Task 16 complete

**Instructions:**
1. Review internal ShipmentStatus enum: PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, RETURNED, CANCELLED, ON_HOLD
2. Document Domex statuses: PENDING, BOOKED, PICKED_UP, AT_ORIGIN_HUB, IN_TRANSIT, AT_DESTINATION_HUB, OUT_FOR_DELIVERY, DELIVERED, FAILED_DELIVERY, RETURNED_TO_SENDER, CANCELLED, ON_HOLD, ADDRESS_CORRECTION_NEEDED
3. Create mapping dict in constants.py: DOMEX_STATUS_MAP = {domex_code: internal_status}
4. Implement `map_domex_status(domex_status)` → ShipmentStatus (with default for unknown)
5. Reverse mapping: `map_status_to_domex(internal_status)` → Domex code
6. Define categories: in_progress (PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, ON_HOLD), completed (DELIVERED), failed (FAILED, RETURNED), cancelled (CANCELLED)
7. Add display names: for internationalization (English, Sinhala, Tamil)
8. Handle special cases: multiple Domex statuses → same internal (e.g., AT_ORIGIN_HUB, AT_DESTINATION_HUB → IN_TRANSIT)
9. Document transitions: valid state changes
10. Unit tests: test all mappings, unknown status handling

**Key Mappings:**
- PENDING/BOOKED → PENDING
- PICKED_UP → PICKED_UP
- AT_ORIGIN_HUB/IN_TRANSIT/AT_DESTINATION_HUB → IN_TRANSIT
- OUT_FOR_DELIVERY → OUT_FOR_DELIVERY
- DELIVERED → DELIVERED
- FAILED_DELIVERY → FAILED
- RETURNED_TO_SENDER → RETURNED
- CANCELLED → CANCELLED
- ON_HOLD/ADDRESS_CORRECTION_NEEDED → ON_HOLD

**Unknown Status:** Default to PENDING or IN_TRANSIT, log warning, notify admin

**Verification:** ✓ DOMEX_STATUS_MAP created ✓ All statuses mapped ✓ map_domex_status() ✓ Reverse mapping ✓ Categories ✓ Display names ✓ Special cases ✓ Unit tests

---

## Task 18: Create COD Support

**Overview:** Cash-on-Delivery support with collection and remittance tracking.

**Dependencies:** Task 09, Task 10 complete

**Instructions:**
1. Update create_shipment: accept cod_amount parameter, validate > 0, check enable_cod in config
2. Validate COD: amount >= MIN_COD_AMOUNT (100 LKR), amount <= MAX_COD_AMOUNT (500,000 LKR), service_type supports COD
3. Format for API: set payment.method="COD", payment.amount=cod_amount, payment.currency="LKR"
4. Update get_rates: include COD indicator, rates may be higher for COD, display COD fee separately
5. Add Shipment fields: is_cod, cod_amount, cod_collected, cod_collected_at, cod_collection_receipt, cod_remitted, cod_remitted_at, cod_remittance_ref
6. Handle webhook: detect cod.collected event, update cod_collected=True, cod_collected_at, cod_collection_receipt
7. Track remittance: create CODRemittance model (remittance_ref, merchant, provider, total_amount, shipment_count, remitted_at, shipments ManyToMany)
8. Update shipments on remittance: set cod_remitted=True, cod_remitted_at, cod_remittance_ref
9. Add reporting: total COD shipments, COD collected, COD pending, COD remittances, outstanding amounts
10. Handle returns: if RETURNED, cod_collected should be False
11. Admin interface: display COD fields, filter by is_cod/cod_collected/cod_remitted, actions: Mark COD collected/remitted

**COD Validation:** MIN=100 LKR | MAX=500,000 LKR | enable_cod=True | Service supports COD (standard/express, not same_day)

**COD Rate:** Base rate + COD fee (typically 2% of amount)

**Webhook Event:** event_type: "cod.collected", data: {shipment_id, waybill_number, cod_amount, collected_at, collection_receipt}

**Verification:** ✓ create_shipment COD support ✓ Validation ✓ API format ✓ get_rates COD ✓ Shipment fields ✓ Webhook handling ✓ Remittance tracking ✓ Reporting ✓ Admin fields

---

## Task 19: Create Pickup Scheduling

**Overview:** Schedule courier pickup from merchant location.

**Dependencies:** Task 09 complete

**Instructions:**
1. Create `schedule_pickup(pickup_date, time_slot, shipment_ids, pickup_address=None, special_instructions=None)` → PickupRequest
2. Validate: enable_pickup_scheduling=True, pickup_date in future (1-7 days ahead), time_slot valid (MORNING: 9-12, AFTERNOON: 14-17, EVENING: 17-20)
3. Use default address: config.default_pickup_address/contact_name/contact_phone if not provided
4. Format request: pickup_date, time_slot, pickup_address, shipment_count, shipment_ids, special_instructions
5. Call API: client.post("/pickup", data)
6. Parse response: confirmation_number, scheduled_date, time_slot, status=SCHEDULED, courier{name, phone}
7. Create PickupRequest model: confirmation_number, tenant, provider="domex", scheduled_date, time_slot, pickup_address, contact_name/phone, shipment_count, status, courier info
8. Update shipments: set pickup_scheduled=True, pickup_request (FK), pickup_confirmation
9. Handle webhook: pickup.completed event, update status=COMPLETED, completed_at
10. Implement cancel_pickup(confirmation_number, reason) → bool: check status=SCHEDULED (not IN_PROGRESS/COMPLETED), call API, update status=CANCELLED
11. Time slots: MORNING (9-12), AFTERNOON (14-17), EVENING (17-20 if available)
12. Notifications: pickup scheduled, reminder 2h before, courier en route, pickup completed/failed

**PickupRequest Model:** confirmation_number | tenant | provider | scheduled_date | time_slot | pickup_address (JSON) | contact_name/phone | shipment_count | status (SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED/FAILED) | courier_name/phone | created_at | completed_at

**Validation:** enable_pickup_scheduling=True | date: today < pickup_date ≤ today+7 | time_slot in AVAILABLE_SLOTS | shipment_ids valid

**Cancellation:** SCHEDULED → can cancel | IN_PROGRESS/COMPLETED → cannot cancel

**Verification:** ✓ schedule_pickup() implemented ✓ Validation ✓ Default address ✓ API call ✓ PickupRequest model ✓ Shipment links ✓ Webhook handling ✓ cancel_pickup() ✓ Notifications

---

## Task 20: Create Provider Registration

**Overview:** Register DomexProvider with CourierFactory.

**Dependencies:** Task 09, CourierFactory from SubPhase-08

**Instructions:**
1. In `backend/apps/shipping/providers/domex/__init__.py`, create register() function
2. Import CourierFactory and DomexProvider
3. Call CourierFactory.register(code="domex", provider_class=DomexProvider, metadata={...})
4. Metadata: name="Domex", description="Domex courier service for Sri Lanka", coverage="nationwide", features=["cod", "tracking", "pickup", "waybill"], logo_url, website, support_phone
5. Auto-register: call register() at module import
6. Django app ready: in `apps/shipping/apps.py`, ShippingConfig.ready(), import domex to trigger registration
7. Verify: CourierFactory.get_provider("domex", tenant) returns DomexProvider instance
8. Provider capabilities: supports_cod(), supports_tracking(), supports_pickup() all return True

**Registration Code:**
```python
def register():
    CourierFactory.register(
        code="domex",
        provider_class=DomexProvider,
        metadata={
            "name": "Domex",
            "description": "Domex courier service for Sri Lanka",
            "coverage": "nationwide",
            "features": ["cod", "tracking", "pickup", "waybill"],
            "logo_url": "/static/images/providers/domex.png"
        }
    )
register()  # Auto-register on import
```

**Usage:** `provider = CourierFactory.get_provider("domex", tenant)` → DomexProvider instance

**Verification:** ✓ register() function ✓ CourierFactory.register() called ✓ Metadata complete ✓ Auto-register ✓ Django app ready hook ✓ get_provider() works ✓ Provider in list

---

## Task 21: Create Domex Admin

**Overview:** Django admin interface for DomexConfig management.

**Dependencies:** Task 04 complete

**Instructions:**
1. Create `backend/apps/shipping/providers/domex/admin.py`
2. Define DomexConfigAdmin(admin.ModelAdmin)
3. list_display: ['tenant', 'environment', 'is_active', 'masked_api_key', 'enable_cod', 'enable_pickup_scheduling', 'created_at']
4. list_filter: ['environment', 'is_active', 'enable_cod', 'enable_pickup_scheduling']
5. search_fields: ['tenant__name', 'merchant_id']
6. Fieldsets: Basic Info (tenant, environment, is_active), API Credentials (api_key, merchant_id, collapsed), Service Settings, Pickup Config, Webhook Settings, Metadata (readonly: created_at, updated_at, config_status)
7. Implement masked_api_key(obj): return f"****{obj.api_key[-4:]}" if obj.api_key else "Not set"
8. Custom actions: test_connection (test API for selected configs), enable_configs, disable_configs
9. Widgets: PasswordInput for api_key, webhook_secret
10. Inline: ShipmentInline (recent shipments, readonly)
11. Register: @admin.register(DomexConfig) or admin.site.register(DomexConfig, DomexConfigAdmin)
12. Security: limit access, log admin changes, never display full API key

**Custom Action Example:**
```python
def test_connection(self, request, queryset):
    for config in queryset:
        try:
            provider = DomexProvider(config.tenant)
            if provider.client.test_connection():
                self.message_user(request, f"✓ {config.tenant}", level=messages.SUCCESS)
        except Exception as e:
            self.message_user(request, f"✗ {config.tenant}: {e}", level=messages.ERROR)
```

**Verification:** ✓ admin.py created ✓ DomexConfigAdmin ✓ list_display/filter/search ✓ Fieldsets ✓ masked_api_key ✓ Custom actions ✓ PasswordInput ✓ Shipment inline ✓ Registered

---

## Task 22: Verify Domex Integration

**Overview:** Comprehensive testing of all components in sandbox and production.

**Dependencies:** All tasks 01-21 complete

**Test Cases:**
1. **Configuration:** Create DomexConfig with sandbox credentials, verify is_configured()=True, test API key validity
2. **Shipment Creation:** Create test shipment (Colombo→Kandy, 2.5kg, express), verify response has shipment_id/waybill, check local Shipment saved, status=PENDING
3. **Rate Calculation:** Get rates (Colombo→Kandy, 2kg), verify multiple services returned (standard ~450 LKR, express ~750 LKR), check COD rates higher
4. **Tracking:** Track created shipment, verify status mapping, check tracking events, confirm data accuracy
5. **Cancellation:** Cancel pending shipment, verify accepted, check local status updated, test non-cancellable status
6. **Webhook:** Simulate POST to /api/webhooks/domex/ with valid signature, verify status update, check TrackingEvent created, confirm notification triggered
7. **COD:** Create COD shipment (5000 LKR), verify COD included in request, check COD fee, simulate cod.collected webhook
8. **Pickup:** Schedule pickup (tomorrow, morning, 3 shipments), verify confirmation, check PickupRequest created, test cancellation
9. **Errors:** Test invalid API key (AuthenticationError), invalid data (ValidationError), network timeout (retry logic), meaningful error messages
10. **Admin:** Access DomexConfig admin, edit config, test connection action, verify masked keys
11. **Provider Registry:** Verify "domex" in CourierFactory.list_providers(), instantiate via factory, check methods callable
12. **Performance:** Create multiple shipments, measure response times (<2s for create, <1s for rates/tracking), check error rates
13. **Documentation:** Review all test results, document issues, create tickets, update docs

**Success Criteria:**
- All API calls working (create, rates, track, cancel, waybill, label)
- Webhooks processed correctly
- Status mapping accurate
- COD lifecycle complete
- Pickup scheduling functional
- Error handling robust
- Performance acceptable (<2s create, <1s rates/track)
- Admin interface usable
- Security measures in place
- Logs comprehensive
- Documentation complete

**Production Checklist:**
- ✓ All tests passing
- ✓ Sandbox testing complete
- ✓ Production credentials obtained
- ✓ Environment variables configured
- ✓ Webhook URL configured in Domex portal
- ✓ Error monitoring (Sentry/etc.)
- ✓ Logging configured
- ✓ Rate limiting
- ✓ Backup/recovery tested
- ✓ Documentation updated
- ✓ Team trained
- ✓ Support contact established

**Verification:** ✓ Test environment configured ✓ All test cases passed ✓ Error scenarios handled ✓ Performance benchmarks met ✓ Security validated ✓ Production ready

---

## Summary

**Completed:** 7 tasks finalizing the Domex integration

**Deliverables:**
- Webhook System: Real-time status updates
- Status Mapping: Consistent handling
- COD Management: Complete lifecycle tracking
- Pickup Scheduling: Convenient collection
- Provider Registry: Factory-based access
- Admin Interface: Configuration and monitoring
- Verified Integration: Tested and production-ready

**Integration Complete:** All 22 tasks implemented, tested, and verified. Ready for production use with support for shipment creation, rate calculation, tracking, cancellation, waybills, labels, COD, pickup scheduling, webhooks, and multi-tenant configuration.

**Next Steps:** Implement additional courier providers (PromptX, Pronto, etc.) following the same pattern.

---

**Total Tasks:** 7 | **Est. Time:** 5.5 hours | **Lines:** ~980
