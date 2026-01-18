# SubPhase-01: POS Terminal Core - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 of 12  
> **SubPhase Goal:** Build core Point of Sale functionality with cart, checkout, and payment processing  
> **Total Tasks:** 94 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-05 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-04: ERP Core Modules Part 1](../../Phase-04_ERP-Core-Modules-Part1/)
- **→ Next SubPhase:** [SubPhase-02: POS Offline Mode](../SubPhase-02_POS-Offline-Mode/)

---

## SubPhase Overview

This sub-phase implements the core Point of Sale (POS) terminal functionality for LankaCommerce Cloud. The POS system enables in-store sales with product search (barcode, SKU, name), shopping cart management, discount application, multiple payment methods, cash drawer operations, and shift management. This foundation supports both online and offline (SubPhase-02) operations.

### Key Outcomes
- POSTerminal model for terminal configuration
- POSSession model for shift management
- POSCart and CartItem models for transaction building
- Product search with barcode scanning support
- Multiple payment method processing
- Cash drawer open/close operations
- Quick product buttons for fast checkout

### Dependencies
- Phase-04: Products, Variants, Pricing, Inventory
- Phase-03: User authentication, tenant isolation

---

## Execution Flow Diagram

```
[Group A: POS Terminal & Session Models]
         │
         ▼
[Group B: Cart & Line Item Management]
         │
         ▼
[Group C: Product Search & Barcode]
         │
         ▼
[Group D: Payment Processing]
         │
         ▼
[Group E: POS API & Frontend Integration]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: POS Terminal & Session Models (Tasks 01-18)

Terminal configuration and shift management models.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create POS app structure | Initialize `apps/pos/` module with __init__, apps.py configuration | 15 min |
| 02 | Create terminal submodule | Create `apps/pos/terminal/` package with __init__.py | 10 min |
| 03 | Define terminal status constants | Create constants: ACTIVE, INACTIVE, MAINTENANCE, OFFLINE | 10 min |
| 04 | Define session status constants | Create constants: OPEN, CLOSED, SUSPENDED, FORCE_CLOSED | 10 min |
| 05 | Create POSTerminal model | Define model with name, code, warehouse FK fields | 30 min |
| 06 | Add terminal hardware fields | Add printer_type, receipt_printer_ip, cash_drawer_enabled | 20 min |
| 07 | Add terminal location fields | Add location description, branch reference | 15 min |
| 08 | Add terminal settings | Add default_tax, allow_price_override, require_customer flags | 20 min |
| 09 | Add receipt template FK | Link to configurable receipt template | 15 min |
| 10 | Create POSTerminal Meta class | Define db_table, indexes on code, unique_together constraints | 15 min |
| 11 | Create POSSession model | Define model with terminal FK, user FK, status fields | 30 min |
| 12 | Add session timing fields | Add opened_at, closed_at, duration_minutes | 15 min |
| 13 | Add opening cash field | Add opening_cash_amount for shift start | 15 min |
| 14 | Add closing cash fields | Add expected_cash, actual_cash, cash_variance | 20 min |
| 15 | Add session totals | Add total_sales, total_refunds, transaction_count | 20 min |
| 16 | Create open_session method | Method to start new shift with validations | 25 min |
| 17 | Create close_session method | Method to end shift with cash reconciliation | 30 min |
| 18 | Create POS admin | Register admin for Terminal and Session with filters | 25 min |

---

### Group B: Cart & Line Item Management (Tasks 19-38)

Shopping cart and transaction building.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 19 | Create cart submodule | Create `apps/pos/cart/` package with __init__.py | 10 min |
| 20 | Define cart status constants | Create constants: ACTIVE, HELD, COMPLETED, VOIDED, ABANDONED | 10 min |
| 21 | Create POSCart model | Define model with session FK, customer FK (optional), status | 30 min |
| 22 | Add cart reference number | Auto-generate cart reference (e.g., POS-2024-001234) | 20 min |
| 23 | Add cart timestamps | Add created_at, updated_at, completed_at fields | 15 min |
| 24 | Add cart totals fields | Add subtotal, discount_total, tax_total, grand_total | 20 min |
| 25 | Add cart discount fields | Add cart_discount_type (PERCENT/FIXED), cart_discount_value | 15 min |
| 26 | Add notes field | Add notes TextField for special instructions | 10 min |
| 27 | Create POSCartItem model | Define model with cart FK, product FK, variant FK | 30 min |
| 28 | Add item quantity field | Add quantity with validation (min: 1) | 15 min |
| 29 | Add item price fields | Add unit_price, original_price, line_total | 20 min |
| 30 | Add item discount fields | Add discount_type, discount_value, discount_reason | 20 min |
| 31 | Add item tax fields | Add tax_rate, tax_amount fields | 15 min |
| 32 | Create CartService | Service class for cart operations | 25 min |
| 33 | Implement add_to_cart | Add product to cart with quantity | 25 min |
| 34 | Implement update_quantity | Update item quantity with stock validation | 25 min |
| 35 | Implement remove_from_cart | Remove item from cart | 20 min |
| 36 | Implement apply_line_discount | Apply discount to specific line item | 25 min |
| 37 | Implement apply_cart_discount | Apply discount to entire cart | 25 min |
| 38 | Implement calculate_totals | Recalculate all cart totals | 30 min |

---

### Group C: Product Search & Barcode (Tasks 39-54)

Product lookup and barcode scanning.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 39 | Create search submodule | Create `apps/pos/search/` package with __init__.py | 10 min |
| 40 | Create ProductSearchService | Service for POS product search | 25 min |
| 41 | Implement barcode_search | Search by exact barcode match | 20 min |
| 42 | Implement sku_search | Search by SKU (exact and partial) | 20 min |
| 43 | Implement name_search | Search by product name (fuzzy matching) | 25 min |
| 44 | Implement combined_search | Single search across barcode, SKU, name | 30 min |
| 45 | Add variant resolution | Return variant if barcode matches variant | 20 min |
| 46 | Add stock availability check | Filter out-of-stock products (configurable) | 20 min |
| 47 | Add price inclusion | Include effective price in search results | 20 min |
| 48 | Create QuickButtonGroup model | Define groups for quick access buttons | 25 min |
| 49 | Create QuickButton model | Product shortcuts with position, color, image | 25 min |
| 50 | Add button position management | Manage button grid positions (e.g., 4x5 grid) | 20 min |
| 51 | Create barcode format validators | Validate EAN-13, UPC-A, Code-128 formats | 25 min |
| 52 | Add weight-based barcode parsing | Parse price/weight embedded barcodes | 30 min |
| 53 | Create search history tracking | Track recent searches for quick access | 20 min |
| 54 | Add category quick filter | Filter products by category in search | 20 min |

---

### Group D: Payment Processing (Tasks 55-74)

Payment method handling and transaction completion.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 55 | Create payment submodule | Create `apps/pos/payment/` package with __init__.py | 10 min |
| 56 | Define payment method constants | Create constants: CASH, CARD, BANK_TRANSFER, MOBILE, STORE_CREDIT | 10 min |
| 57 | Define payment status constants | Create constants: PENDING, COMPLETED, FAILED, REFUNDED | 10 min |
| 58 | Create POSPayment model | Define model with cart FK, method, amount, status | 30 min |
| 59 | Add payment reference fields | Add reference_number, authorization_code for card payments | 15 min |
| 60 | Add cash payment fields | Add amount_tendered, change_due for cash payments | 15 min |
| 61 | Add payment timestamp | Add paid_at timestamp | 10 min |
| 62 | Create PaymentService | Service class for payment operations | 25 min |
| 63 | Implement process_cash_payment | Handle cash payment with change calculation | 25 min |
| 64 | Implement process_card_payment | Handle card payment (placeholder for gateway) | 25 min |
| 65 | Implement process_mobile_payment | Handle mobile payments (FriMi, etc.) | 25 min |
| 66 | Implement process_store_credit | Apply store credit to payment | 25 min |
| 67 | Implement split_payment | Handle multiple payment methods for one cart | 35 min |
| 68 | Create payment validation | Ensure total payments >= cart total | 20 min |
| 69 | Create complete_transaction | Finalize cart, update stock, create receipt | 35 min |
| 70 | Implement void_transaction | Void incomplete transaction | 25 min |
| 71 | Add cash drawer trigger | Trigger cash drawer open on cash payment | 20 min |
| 72 | Create payment receipt data | Generate receipt data after payment | 25 min |
| 73 | Add payment audit logging | Log all payment attempts and results | 20 min |
| 74 | Create held cart functionality | Park cart for later completion | 25 min |

---

### Group E: POS API & Frontend Integration (Tasks 75-86)

Serializers, views, and frontend endpoints.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 75 | Create POSTerminalSerializer | Serializer with settings and current session info | 25 min |
| 76 | Create POSSessionSerializer | Serializer with totals and transaction count | 25 min |
| 77 | Create POSCartSerializer | Serializer with nested items and totals | 30 min |
| 78 | Create CartItemSerializer | Item serializer with product details | 25 min |
| 79 | Create ProductSearchSerializer | Search result serializer with price, stock | 25 min |
| 80 | Create POSPaymentSerializer | Payment request/response serializer | 20 min |
| 81 | Create POSTerminalViewSet | ViewSet for terminal management | 25 min |
| 82 | Create POSSessionViewSet | ViewSet with open/close shift actions | 30 min |
| 83 | Create POSCartViewSet | ViewSet with add, update, remove, discount actions | 35 min |
| 84 | Create ProductSearchView | Search endpoint with combined search | 25 min |
| 85 | Create PaymentView | Payment processing endpoint | 30 min |
| 86 | Add POS WebSocket events | WebSocket events for real-time cart updates | 35 min |

---

### Group F: Testing & Documentation (Tasks 87-94)

Comprehensive testing and documentation.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 87 | Create terminal/session tests | Test model creation, open/close shift | 30 min |
| 88 | Create cart operation tests | Test add, update, remove, discounts | 35 min |
| 89 | Create product search tests | Test barcode, SKU, name search | 30 min |
| 90 | Create payment processing tests | Test all payment methods, split payment | 40 min |
| 91 | Create transaction flow tests | End-to-end transaction completion tests | 40 min |
| 92 | Create API endpoint tests | Test all ViewSet actions | 35 min |
| 93 | Write POS module documentation | Document all models, services, API endpoints | 45 min |
| 94 | Create POS user guide | User guide for cashier operations | 35 min |

---

## Expected File Structure

```
apps/pos/
├── __init__.py
├── apps.py
├── terminal/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── pos_terminal.py       # Tasks 05-10
│   │   └── pos_session.py        # Tasks 11-17
│   ├── serializers.py            # Tasks 75-76
│   └── views.py                  # Tasks 81-82
├── cart/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── pos_cart.py           # Tasks 21-26
│   │   └── cart_item.py          # Tasks 27-31
│   ├── services/
│   │   ├── __init__.py
│   │   └── cart_service.py       # Tasks 32-38
│   ├── serializers.py            # Tasks 77-78
│   └── views.py                  # Task 83
├── search/
│   ├── __init__.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── product_search.py     # Tasks 40-47, 53-54
│   ├── models/
│   │   ├── __init__.py
│   │   ├── quick_button_group.py # Task 48
│   │   └── quick_button.py       # Tasks 49-50
│   ├── serializers.py            # Task 79
│   └── views.py                  # Task 84
├── payment/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── pos_payment.py        # Tasks 58-61
│   ├── services/
│   │   ├── __init__.py
│   │   └── payment_service.py    # Tasks 62-74
│   ├── serializers.py            # Task 80
│   └── views.py                  # Task 85
├── admin.py                      # Task 18
├── urls.py
├── constants.py                  # Tasks 03, 04, 20, 56, 57
└── consumers.py                  # Task 86 (WebSocket)
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | POS Terminal & Session Models | 18 | 0 | 🔴 Not Started |
| B | Cart & Line Item Management | 20 | 0 | 🔴 Not Started |
| C | Product Search & Barcode | 16 | 0 | 🔴 Not Started |
| D | Payment Processing | 20 | 0 | 🔴 Not Started |
| E | POS API & Frontend Integration | 12 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 8 | 0 | 🔴 Not Started |
| **Total** | | **94** | **0** | 🔴 |

---

## Notes for AI Agents

### POS Transaction Workflow
```
┌─────────────────────────────────────────────────────────────┐
│                    SHIFT MANAGEMENT                          │
├─────────────────────────────────────────────────────────────┤
│  1. Cashier opens shift (POSSession created)                │
│  2. Enter opening cash amount                                │
├─────────────────────────────────────────────────────────────┤
│                    TRANSACTION FLOW                          │
├─────────────────────────────────────────────────────────────┤
│  3. Create new cart (POSCart)                                │
│  4. Search products (barcode/SKU/name)                       │
│  5. Add items to cart (POSCartItem)                          │
│  6. Apply discounts (line or cart level)                     │
│  7. Select customer (optional)                               │
│  8. Process payment(s) (POSPayment)                          │
│  9. Complete transaction                                     │
│     - Update stock levels                                    │
│     - Generate receipt                                       │
│     - Open cash drawer (if cash)                             │
├─────────────────────────────────────────────────────────────┤
│                    SHIFT CLOSE                               │
├─────────────────────────────────────────────────────────────┤
│  10. Count cash drawer                                       │
│  11. Enter actual cash amount                                │
│  12. System calculates variance                              │
│  13. Close shift                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cart Reference Number Format
```
POS-{YEAR}-{TERMINAL_CODE}-{SEQUENCE}
Example: POS-2024-T01-000123

Where:
- YEAR: 4-digit year
- TERMINAL_CODE: 3-char terminal code
- SEQUENCE: 6-digit sequential number (per terminal per year)
```

### Payment Methods (Sri Lanka)
| Method | Code | Fields Required |
|--------|------|-----------------|
| Cash | CASH | amount_tendered |
| Visa/Mastercard | CARD | authorization_code |
| Bank Transfer | BANK_TRANSFER | reference_number |
| FriMi | MOBILE_FRIMI | reference_number |
| Dialog Genie | MOBILE_GENIE | reference_number |
| Store Credit | STORE_CREDIT | customer required |

### Split Payment Example
```python
# Cart total: LKR 5,000

payments = [
    {'method': 'CASH', 'amount': 2000, 'tendered': 2000},
    {'method': 'CARD', 'amount': 3000, 'auth_code': 'AUTH123'}
]

# Total payments = 5,000 ✓
```

### Cart Discount Types
```python
DISCOUNT_TYPES = [
    ('PERCENT', 'Percentage Off'),      # e.g., 10% off
    ('FIXED', 'Fixed Amount Off'),      # e.g., LKR 500 off
    ('PRICE_OVERRIDE', 'Price Override') # e.g., Set to LKR 4,500
]

# Line-level discount reasons (for audit)
DISCOUNT_REASONS = [
    ('MANAGER_APPROVAL', 'Manager Approved'),
    ('DAMAGED', 'Damaged Item'),
    ('PROMOTION', 'Promotional'),
    ('LOYALTY', 'Loyalty Customer'),
    ('NEGOTIATED', 'Negotiated Price'),
]
```

### Cash Drawer Variance Calculation
```python
expected_cash = (
    session.opening_cash_amount +
    session.cash_sales_total -
    session.cash_refunds_total
)

variance = session.actual_cash_amount - expected_cash

# Variance thresholds (configurable)
ACCEPTABLE_VARIANCE = 100  # LKR
if abs(variance) > ACCEPTABLE_VARIANCE:
    flag_for_review()
```

### Quick Button Grid
```
┌─────┬─────┬─────┬─────┐
│ Btn │ Btn │ Btn │ Btn │  Row 1
├─────┼─────┼─────┼─────┤
│ Btn │ Btn │ Btn │ Btn │  Row 2
├─────┼─────┼─────┼─────┤
│ Btn │ Btn │ Btn │ Btn │  Row 3
├─────┼─────┼─────┼─────┤
│ Btn │ Btn │ Btn │ Btn │  Row 4
├─────┼─────┼─────┼─────┤
│ Btn │ Btn │ Btn │ Btn │  Row 5
└─────┴─────┴─────┴─────┘

Position stored as: row (1-5), column (1-4)
Color options: predefined palette or custom hex
```

### Barcode Format Detection
```python
def detect_barcode_format(barcode):
    if len(barcode) == 13 and barcode.isdigit():
        return 'EAN-13'
    elif len(barcode) == 12 and barcode.isdigit():
        return 'UPC-A'
    elif len(barcode) == 8 and barcode.isdigit():
        return 'EAN-8'
    else:
        return 'CODE-128'  # Fallback
```

### Weight-Embedded Barcode Parsing
```python
# Format: 2PPPPPWWWWWC (EAN-13 with embedded weight)
# 2 = Prefix indicating weighted item
# PPPPP = Product code (5 digits)
# WWWWW = Weight in grams (5 digits)
# C = Check digit

def parse_weighted_barcode(barcode):
    if barcode.startswith('2') and len(barcode) == 13:
        product_code = barcode[1:6]
        weight_grams = int(barcode[6:11])
        return {
            'type': 'WEIGHTED',
            'product_lookup': product_code,
            'weight_kg': weight_grams / 1000
        }
    return None
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
