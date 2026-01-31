# Tasks 43-50: Offline Sale, Receipt, and Shift Management

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** C - Offline Manager  
> **Document:** 02 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-42_Manager-Prefetch.md](01_Tasks-33-42_Manager-Prefetch.md)
- **→ Next Group:** [Group-D_Sync-Queue](../Group-D_Sync-Queue/)

---

## Document Overview

This document covers the implementation of offline sale processing, receipt generation, and shift management capabilities for the POS system. It enables cashiers to complete full sales transactions without network connectivity, including temporary receipt ID generation, local stock updates, receipt printing with offline indicators, cash management, and shift operations. The system ensures all offline transactions are queued for synchronization when connectivity is restored.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Create Offline Sale | High | 90 min |
| 44 | Create Temp Receipt ID | Low | 20 min |
| 45 | Create Local Stock Update | Medium | 45 min |
| 46 | Create Offline Receipt | Medium | 50 min |
| 47 | Create Cash Management | Medium | 45 min |
| 48 | Create Shift Offline | Medium | 45 min |
| 49 | Create Error Boundary | Low | 30 min |
| 50 | Verify Offline Manager | Low | 30 min |

---

## Task 43: Create Offline Sale

### Overview
Implement the complete offline sale processing system that allows cashiers to create sales transactions without network connectivity. This includes validating cart items against local inventory, calculating totals, generating temporary sale records, storing transactions in IndexedDB, queuing for synchronization, and triggering receipt printing. The offline sale process mirrors the online flow while adding appropriate offline indicators and temporary identifiers.

### Dependencies
- Task 42: Create Prefetch Progress

### Instructions

1. **Create offline sale service file**
   - Navigate to `frontend/lib/offline/` directory
   - Create new file named `offline-sale.ts`
   - Export sale processing functions
   - Import IndexedDB and sync queue utilities

2. **Define offline sale data structure**
   - Create interface for offline sale object
   - Include all standard sale fields
   - Add offline-specific fields (temp_id, offline_flag)
   - Include sync status fields
   - Add timestamp and device information

3. **Implement processOfflineSale method**
   - Create `processOfflineSale(items, payment, customer)` async function
   - Accept cart items, payment details, customer ID
   - Return complete sale object with temp ID
   - Handle all sale processing steps
   - Emit sale events for UI updates

4. **Implement sale validation**
   - Validate cart items are not empty
   - Check product exists in local database
   - Verify stock availability for each item
   - Validate payment amount covers total
   - Check customer credit limits if applicable

5. **Calculate sale totals**
   - Calculate subtotal from item prices × quantities
   - Calculate tax amounts per item and total
   - Apply customer discounts and promotions
   - Calculate loyalty points earned
   - Compute final total amount

6. **Generate temporary sale record**
   - Create sale object with all details
   - Assign temporary receipt ID (Task 44)
   - Set offline flag to true
   - Add creation timestamp
   - Include device/terminal ID

7. **Store sale in IndexedDB**
   - Open IndexedDB `sales` object store
   - Use temp_id as primary key
   - Store complete sale object
   - Create index on timestamp
   - Create index on sync_status

8. **Update local inventory**
   - Decrement stock for each item sold
   - Update IndexedDB inventory records
   - Track pending offline stock changes
   - Reserve stock until synced
   - Emit stock update events

9. **Add to sync queue**
   - Create sync queue entry for sale
   - Set priority to high
   - Include retry count (0)
   - Add timestamp
   - Store queue entry in IndexedDB

10. **Trigger receipt printing**
    - Generate receipt data from sale
    - Include offline indicators
    - Call receipt print function (Task 46)
    - Handle print errors gracefully
    - Store printed flag in sale record

11. **Update cash drawer**
    - Add cash payment to local cash tracking
    - Update cash drawer balance
    - Record transaction in cash log
    - Emit cash update event
    - Queue cash movement for sync

### Offline Sale Processing Flow

```
Start Sale Process
       │
       ▼
Validate Cart Items
       │
    ┌──┴───┐
    ▼      ▼
 Valid   Invalid
    │      │
    │      ▼
    │  Show Error
    │  Return
    │
    ▼
Check Stock Availability
       │
    ┌──┴───┐
    ▼      ▼
Available  Out of Stock
    │      │
    │      ▼
    │  Show Error
    │  Return
    │
    ▼
Calculate Totals
       │
       ▼
Generate Temp Receipt ID
       │
       ▼
Create Sale Object
       │
       ▼
Store in IndexedDB
       │
       ▼
Update Local Stock
       │
       ▼
Add to Sync Queue
       │
       ▼
Update Cash Drawer
       │
       ▼
Print Receipt
       │
       ▼
Show Success Message
       │
       ▼
Return Sale Object
```

### Sale Validation Steps

| Step | Validation | Error Message |
|------|------------|---------------|
| 1 | Cart not empty | "Cart is empty" |
| 2 | All products exist locally | "Product data not available offline" |
| 3 | Stock available for all items | "Insufficient stock for [product]" |
| 4 | Payment amount ≥ total | "Insufficient payment" |
| 5 | Customer credit within limit | "Credit limit exceeded" |

### Offline Sale Object Structure

| Field | Type | Description |
|-------|------|-------------|
| `temp_id` | string | Temporary receipt ID |
| `items` | array | Cart items with details |
| `subtotal` | number | Items total before tax |
| `tax` | number | Total tax amount |
| `discount` | number | Total discount applied |
| `total` | number | Final amount |
| `payment_method` | string | Payment type |
| `payment_amount` | number | Amount paid |
| `change` | number | Change given |
| `customer_id` | string | Customer reference |
| `cashier_id` | string | Cashier reference |
| `terminal_id` | string | POS terminal ID |
| `offline` | boolean | Always true |
| `created_at` | timestamp | Sale creation time |
| `sync_status` | string | pending/synced/failed |
| `sync_attempts` | number | Retry count |

### Total Calculation Logic

```
Cart Items:
  Item 1: $10.00 × 2 = $20.00
  Item 2: $15.00 × 1 = $15.00
  
Subtotal: $35.00

Tax Calculation (10%):
  Item 1 tax: $20.00 × 0.10 = $2.00
  Item 2 tax: $15.00 × 0.10 = $1.50
  Total tax: $3.50

Discount (Member 5%):
  Discount: $35.00 × 0.05 = $1.75

Final Total:
  Subtotal: $35.00
  + Tax: $3.50
  - Discount: $1.75
  = Total: $36.75
```

### Stock Update Pattern

```
For Each Item in Sale:
       │
       ▼
Get Current Inventory
       │
       ▼
Check Available Stock
       │
    ┌──┴───┐
    ▼      ▼
 >= Qty  < Qty
    │      │
    │      ▼
    │  Throw Error
    │
    ▼
Decrement Quantity
       │
       ▼
Update IndexedDB
       │
       ▼
Add to Pending Updates
       │
       ▼
Emit stock:updated Event
```

### Sync Queue Entry

| Field | Value | Purpose |
|-------|-------|---------|
| `id` | uuid | Queue entry ID |
| `type` | 'sale' | Entry type |
| `data` | sale object | Complete sale data |
| `priority` | 'high' | Sync priority |
| `attempts` | 0 | Retry count |
| `status` | 'pending' | Sync status |
| `created_at` | timestamp | Queue time |

### IndexedDB Storage

```
ObjectStore: sales
├── Key: sale.temp_id
├── Value: Sale object
└── Indexes:
    ├── created_at
    ├── sync_status
    ├── customer_id
    └── cashier_id

ObjectStore: sync_queue
├── Key: queue_entry.id
├── Value: Queue entry
└── Indexes:
    ├── type
    ├── priority
    ├── status
    └── created_at
```

### Error Handling

| Error Type | Handling |
|------------|----------|
| Validation failed | Show error, don't save sale |
| Stock unavailable | Show error, suggest alternatives |
| IndexedDB error | Retry save, log error |
| Print failed | Save sale, mark print failed |
| Queue failed | Save sale, retry queue later |

### Expected Outcome
- Complete offline sale processing working
- Sales validated and stored locally
- Stock levels updated correctly
- Sync queue entries created
- Receipts printed with offline flag
- Cash drawer updated

### Verification Checklist
- [ ] offline-sale.ts file created
- [ ] processOfflineSale() function implemented
- [ ] Sale validation working
- [ ] Total calculations correct
- [ ] Temp ID generated
- [ ] Sale stored in IndexedDB
- [ ] Local stock updated
- [ ] Sync queue entry added
- [ ] Receipt printing triggered
- [ ] Cash drawer updated
- [ ] Events emitted correctly
- [ ] Error handling implemented

---

## Task 44: Create Temp Receipt ID

### Overview
Implement temporary receipt ID generation for offline sales using a consistent format that distinguishes offline receipts from online ones. The temporary ID uses the format OFF-{uuid} and serves as a placeholder until the sale is synchronized with the server and assigned a permanent receipt number. This system ensures unique identification of offline transactions and enables tracking through the sync process.

### Dependencies
- Task 43: Create Offline Sale

### Instructions

1. **Define temp ID format specification**
   - Create constant for ID prefix: `OFFLINE_RECEIPT_PREFIX = 'OFF-'`
   - Document format: `OFF-{uuid}`
   - Use UUID v4 for uniqueness
   - Total length: 40 characters (OFF- + 36 char UUID)

2. **Create generateTempReceiptId function**
   - Define `generateTempReceiptId()` function
   - Generate UUID v4
   - Prepend `OFF-` prefix
   - Return formatted string
   - Ensure uniqueness

3. **Implement UUID generation**
   - Use crypto.randomUUID() if available
   - Fallback to custom UUID implementation
   - Ensure proper format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   - Validate generated UUIDs
   - Handle generation errors

4. **Add ID validation function**
   - Create `isOfflineReceiptId(id)` function
   - Check if ID starts with `OFF-`
   - Validate UUID format
   - Return boolean result
   - Use in sync and receipt lookup

5. **Implement ID extraction**
   - Create `extractUuidFromTempId(id)` function
   - Remove `OFF-` prefix
   - Return UUID portion
   - Validate format before extraction
   - Handle invalid IDs gracefully

6. **Store ID mappings**
   - Create IndexedDB `receipt_id_mappings` store
   - Store temp_id → server_id mapping after sync
   - Enable lookups in both directions
   - Persist mappings permanently
   - Use for reprint functionality

7. **Display temp IDs appropriately**
   - Show full temp ID on receipts
   - Add "(Offline)" indicator
   - Use in UI sales lists
   - Highlight unsynchronized sales
   - Replace with server ID after sync

8. **Handle ID replacement on sync**
   - When sale syncs successfully
   - Receive server-assigned receipt ID
   - Store temp_id → server_id mapping
   - Update sale record with server ID
   - Update UI to show server ID

### Temp Receipt ID Flow

```
Sale Creation
       │
       ▼
Generate UUID v4
  (e.g., a1b2c3d4-e5f6-4789-b012-3456789abcde)
       │
       ▼
Prepend "OFF-"
       │
       ▼
Temp Receipt ID
  OFF-a1b2c3d4-e5f6-4789-b012-3456789abcde
       │
       ▼
Store in Sale Record
       │
       ▼
Print on Receipt
       │
       ▼
(Later) Sync with Server
       │
       ▼
Server Assigns Real ID
  (e.g., REC-2024-001234)
       │
       ▼
Store Mapping:
  OFF-xxx... → REC-2024-001234
       │
       ▼
Update Sale Record
       │
       ▼
Display Server ID in UI
```

### ID Format Specification

| Component | Value | Length |
|-----------|-------|--------|
| Prefix | OFF- | 4 chars |
| UUID v4 | xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx | 36 chars |
| Total | OFF-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx | 40 chars |

### ID Examples

| Type | Format | Example |
|------|--------|---------|
| Temp ID | OFF-{uuid} | OFF-a1b2c3d4-e5f6-4789-b012-3456789abcde |
| Server ID | REC-{year}-{number} | REC-2024-001234 |

### UUID Generation Methods

| Method | Browser Support | Fallback |
|--------|----------------|----------|
| crypto.randomUUID() | Modern browsers | Custom implementation |
| Math.random() | All browsers | Less secure, development only |

### ID Validation Logic

```
Function: isOfflineReceiptId(id)

Input: "OFF-a1b2c3d4-e5f6-4789-b012-3456789abcde"
       │
       ▼
Check if starts with "OFF-"
       │
    ┌──┴───┐
    ▼      ▼
  Yes     No → Return false
    │
    ▼
Extract UUID part
       │
       ▼
Validate UUID format
  (8-4-4-4-12 pattern)
       │
    ┌──┴───┐
    ▼      ▼
 Valid  Invalid
    │      │
    ▼      ▼
  true   false
```

### ID Mapping Storage

```
ObjectStore: receipt_id_mappings
├── Key: temp_id (string)
├── Value: {
│     temp_id: string,
│     server_id: string,
│     synced_at: timestamp,
│     sale_data: object
│   }
└── Indexes:
    ├── temp_id (unique)
    ├── server_id (unique)
    └── synced_at
```

### Receipt Display Pattern

| Stage | Receipt ID Display |
|-------|-------------------|
| Offline sale | OFF-xxx... (Offline) |
| Pending sync | OFF-xxx... (Pending Sync) |
| Syncing | OFF-xxx... (Syncing...) |
| Synced | REC-2024-001234 |

### UI List Display

```
Recent Sales:
┌─────────────────────────────────────┐
│ OFF-a1b2c3d4-... (Offline) $36.75  │
│ REC-2024-001233          $42.50  │
│ OFF-f9e8d7c6-... (Pending) $28.00  │
│ REC-2024-001232          $55.20  │
└─────────────────────────────────────┘
```

### Sync Replacement Process

```
Offline Sale Syncs
       │
       ▼
Server Response:
  { server_receipt_id: "REC-2024-001234" }
       │
       ▼
Create ID Mapping
  temp_id → server_id
       │
       ▼
Store in IndexedDB
       │
       ▼
Update Sale Record
  receipt_id = server_id
       │
       ▼
Emit sale:updated Event
       │
       ▼
UI Refreshes
  Shows server_id
```

### Expected Outcome
- Unique temp receipt IDs generated
- Consistent OFF- prefix format
- UUID v4 ensures uniqueness
- ID mappings stored after sync
- UI displays appropriate ID format
- Receipts show temp ID with offline flag

### Verification Checklist
- [ ] generateTempReceiptId() function created
- [ ] UUID v4 generation implemented
- [ ] OFF- prefix applied correctly
- [ ] ID format validated
- [ ] isOfflineReceiptId() function works
- [ ] ID mappings stored correctly
- [ ] Temp IDs shown on receipts
- [ ] Server IDs replace temp IDs after sync
- [ ] UI displays correct ID format
- [ ] Lookup functions working

---

## Task 45: Create Local Stock Update

### Overview
Implement local inventory stock update functionality that decrements product quantities in IndexedDB when offline sales are processed. This system maintains accurate local stock levels during offline operation, prevents overselling, tracks pending stock changes for synchronization, and provides real-time stock availability information to cashiers. Local updates are queued for server synchronization when connectivity is restored.

### Dependencies
- Task 44: Create Temp Receipt ID

### Instructions

1. **Create stock update service**
   - Add `updateLocalStock(items)` function to offline-sale.ts
   - Accept array of sale items
   - Return success/failure status
   - Handle errors without throwing
   - Log all stock changes

2. **Implement stock retrieval**
   - Create `getProductStock(product_id)` function
   - Query IndexedDB inventory store
   - Return current quantity and available stock
   - Handle product not found
   - Cache frequently accessed products

3. **Implement stock validation**
   - Before updating, verify stock availability
   - Check available quantity ≥ sale quantity
   - Consider reserved stock
   - Account for pending offline sales
   - Return detailed validation errors

4. **Create stock decrement logic**
   - For each item in sale:
     - Get current inventory record
     - Calculate new quantity (current - sold)
     - Update inventory record in IndexedDB
     - Emit stock:updated event
     - Log the change

5. **Track pending offline updates**
   - Create `pending_stock_updates` object store
   - Record each offline stock change
   - Include product_id, quantity_change, sale_id
   - Track timestamp and device_id
   - Use for sync reconciliation

6. **Implement atomic updates**
   - Use IndexedDB transactions
   - Ensure all items update together
   - Rollback on any failure
   - Prevent partial stock updates
   - Maintain data consistency

7. **Handle out-of-stock scenarios**
   - Check stock before processing sale
   - Show clear error messages
   - Suggest alternatives if available
   - Offer stock check at other locations
   - Prevent negative stock levels

8. **Create stock update events**
   - Define `stock:updated` event type
   - Include product_id and new quantity
   - Dispatch after successful update
   - Listeners update UI stock displays
   - Show low stock warnings

9. **Implement stock reservation**
   - When sale initiated, reserve stock
   - Release reservation if sale cancelled
   - Expire reservations after timeout
   - Track reserved quantities separately
   - Include in availability calculations

10. **Add sync queue entries**
    - Create queue entry for each stock change
    - Include product_id, old_qty, new_qty
    - Link to sale transaction
    - Set sync priority
    - Store in sync_queue

### Local Stock Update Flow

```
Process Offline Sale
       │
       ▼
For Each Item in Sale
       │
       ▼
Get Current Stock
       │
       ▼
Validate Availability
       │
    ┌──┴────┐
    ▼       ▼
Available  Out of Stock
    │       │
    │       ▼
    │   Throw Error
    │   Cancel Sale
    │
    ▼
Begin Transaction
       │
       ▼
Calculate New Quantity
  (current - sale_qty)
       │
       ▼
Update IndexedDB
  inventory record
       │
       ▼
Create Pending Update
  record
       │
       ▼
Add to Sync Queue
       │
       ▼
Commit Transaction
       │
       ▼
Emit stock:updated
       │
       ▼
Next Item / Complete
```

### Stock Calculation Logic

```
Product: Widget X
Current Stock: 100
Reserved: 20
Pending Offline Sales: 5

Available = Current - Reserved - PendingOffline
Available = 100 - 20 - 5
Available = 75

Sale Quantity: 10

Can Sell? 
  10 <= 75 → Yes

After Sale:
  Current = 100 - 10 = 90
  Reserved = 20 (unchanged)
  PendingOffline = 5 + 10 = 15
  Available = 90 - 20 - 15 = 55
```

### Stock Validation Rules

| Rule | Check | Action |
|------|-------|--------|
| Product exists | Query inventory | Error if not found |
| Sufficient stock | available ≥ quantity | Error if insufficient |
| No negative stock | new_quantity ≥ 0 | Error if would go negative |
| Valid quantity | quantity > 0 | Error if invalid |

### IndexedDB Transaction Pattern

```
Begin Transaction
       │
   ┌───┴────┐
   │  Read  │
   │  Stock │
   └───┬────┘
       │
   ┌───┴────┐
   │Validate│
   │  Qty   │
   └───┬────┘
       │
   ┌───┴────┐
   │ Update │
   │ Record │
   └───┬────┘
       │
   ┌───┴────┐
   │  Add   │
   │Pending │
   └───┬────┘
       │
    Success?
    ┌──┴───┐
    ▼      ▼
  Yes     No
    │      │
    ▼      ▼
 Commit  Rollback
```

### Pending Stock Update Record

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Update record ID |
| `product_id` | string | Product reference |
| `quantity_change` | number | Amount changed (negative) |
| `previous_quantity` | number | Stock before change |
| `new_quantity` | number | Stock after change |
| `sale_id` | string | Associated sale |
| `terminal_id` | string | POS terminal |
| `created_at` | timestamp | Update time |
| `synced` | boolean | Sync status |

### Stock Update Event Payload

| Field | Value | Purpose |
|-------|-------|---------|
| `product_id` | string | Which product updated |
| `old_quantity` | number | Previous stock level |
| `new_quantity` | number | Current stock level |
| `change` | number | Amount changed |
| `available` | number | Available to sell |

### UI Stock Display Update

```
Product Card Before Sale:
┌──────────────────────┐
│ Widget X             │
│ Price: $10.00        │
│ Stock: 75 available  │
└──────────────────────┘

After Sale (10 units):
┌──────────────────────┐
│ Widget X             │
│ Price: $10.00        │
│ Stock: 65 available  │
│ ⚠️ Low Stock         │
└──────────────────────┘
```

### Sync Queue Entry for Stock

| Field | Value |
|-------|-------|
| `type` | 'stock_update' |
| `product_id` | 'prod_123' |
| `quantity_change` | -10 |
| `sale_id` | 'OFF-xxx...' |
| `priority` | 'medium' |
| `created_at` | timestamp |

### Expected Outcome
- Local stock decrements on offline sales
- Stock levels accurate in real-time
- Out-of-stock prevented
- Pending updates tracked
- Sync queue entries created
- UI reflects current stock

### Verification Checklist
- [ ] updateLocalStock() function created
- [ ] Stock retrieval working
- [ ] Stock validation implemented
- [ ] Decrement logic correct
- [ ] Pending updates tracked
- [ ] Atomic transactions used
- [ ] Out-of-stock handled
- [ ] Events emitted correctly
- [ ] Stock reservation working
- [ ] Sync queue entries added
- [ ] UI updates on stock change
- [ ] Negative stock prevented

---

## Task 46: Create Offline Receipt

### Overview
Implement offline receipt generation and printing functionality that produces receipts for offline sales with clear indicators that the transaction occurred without network connectivity. Offline receipts include all standard receipt information plus special markers like "OFFLINE SALE" header, temporary receipt ID, and "Pending Sync" footer. The system supports both physical printer output and digital receipt storage.

### Dependencies
- Task 45: Create Local Stock Update

### Instructions

1. **Define offline receipt data structure**
   - Create interface for receipt data
   - Include all sale information
   - Add offline-specific fields
   - Include merchant and terminal details
   - Add print metadata

2. **Create generateOfflineReceipt function**
   - Define `generateOfflineReceipt(sale)` function
   - Accept sale object as parameter
   - Return formatted receipt data
   - Include all required sections
   - Add offline indicators

3. **Format receipt header**
   - Add "OFFLINE SALE" marker at top
   - Include merchant name and logo
   - Add terminal ID and location
   - Show date and time
   - Display temp receipt ID prominently

4. **Format receipt body**
   - List all items with names, quantities, prices
   - Show subtotal, tax breakdown
   - Display discounts applied
   - Show loyalty points earned
   - Calculate and show total

5. **Format receipt footer**
   - Add "PENDING SYNCHRONIZATION" message
   - Include customer copy indicator
   - Show reprint instructions
   - Add return policy notice
   - Include support contact

6. **Add visual indicators**
   - Use asterisks or borders for "OFFLINE" marker
   - Make temp receipt ID bold/large
   - Add warning icon if supported
   - Use different formatting than online receipts
   - Ensure clear visual distinction

7. **Implement print functionality**
   - Create `printOfflineReceipt(receipt)` function
   - Support ESC/POS printer commands
   - Handle browser print API
   - Support thermal printer formatting
   - Handle print errors gracefully

8. **Store receipt for reprints**
   - Save receipt data in IndexedDB
   - Link to sale record
   - Include original print timestamp
   - Track reprint count
   - Enable reprint from sale history

9. **Implement digital receipt option**
   - Generate HTML version
   - Support email (queue for sending)
   - Generate PDF version
   - Support SMS (queue for sending)
   - Store digital copy locally

10. **Handle receipt updates after sync**
    - When sale syncs, update receipt
    - Replace temp ID with server ID
    - Remove offline indicators
    - Keep original offline receipt
    - Mark as synchronized

11. **Add receipt reprint function**
    - Create `reprintReceipt(receipt_id)` function
    - Fetch from IndexedDB
    - Add "REPRINT" indicator
    - Show original print date
    - Print or display

### Offline Receipt Structure

```
┌─────────────────────────────────────┐
│        *** OFFLINE SALE ***         │
│                                     │
│         LankaCommerce Cloud         │
│          123 Main Street            │
│        Colombo, Sri Lanka           │
│          Tel: 011-234-5678          │
│                                     │
│ Terminal: POS-01    Branch: Main   │
│ Date: 2024-01-31    Time: 14:30    │
│                                     │
│ Receipt: OFF-a1b2c3d4-e5f6-4789-...│
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Widget X              2 × $10.00   │
│                           $20.00   │
│                                     │
│ Widget Y              1 × $15.00   │
│                           $15.00   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Subtotal:                  $35.00  │
│ Tax (10%):                  $3.50  │
│ Discount (Member 5%):      -$1.75  │
│                                     │
│ TOTAL:                     $36.75  │
│                                     │
│ Payment: Cash              $40.00  │
│ Change:                     $3.25  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Customer: John Smith               │
│ Loyalty Points Earned: 36          │
│ Total Points: 536                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      PENDING SYNCHRONIZATION        │
│                                     │
│ This sale will be synchronized     │
│ when internet connection is         │
│ restored. Your receipt number       │
│ may change after sync.              │
│                                     │
│ For support: support@example.com   │
│                                     │
│         CUSTOMER COPY               │
│                                     │
└─────────────────────────────────────┘
```

### Receipt Generation Flow

```
Sale Completed
       │
       ▼
Get Sale Data
       │
       ▼
Generate Receipt Object
       │
   ┌───┴────┐
   │ Header │
   │ - Store Info
   │ - Date/Time
   │ - Temp ID
   │ - Offline Flag
   └───┬────┘
       │
   ┌───┴────┐
   │  Body  │
   │ - Items
   │ - Totals
   │ - Payment
   └───┬────┘
       │
   ┌───┴────┐
   │ Footer │
   │ - Sync Notice
   │ - Support
   └───┬────┘
       │
       ▼
Format for Printer
       │
       ▼
Print Receipt
       │
       ▼
Store in IndexedDB
       │
       ▼
Return Success
```

### Receipt Sections

| Section | Content |
|---------|---------|
| Header | Offline flag, store info, temp ID |
| Items | Product list with prices |
| Subtotal | Before tax and discounts |
| Tax | Tax amount and rate |
| Discounts | Applied discounts |
| Total | Final amount |
| Payment | Method and amounts |
| Customer | Name and loyalty info |
| Footer | Sync notice, support |

### Offline Indicators

| Indicator | Location | Format |
|-----------|----------|--------|
| OFFLINE SALE | Top header | *** OFFLINE SALE *** |
| Temp receipt ID | Below date | OFF-xxxxxxxx-... |
| Pending sync | Footer | PENDING SYNCHRONIZATION |
| May change | Footer | Receipt number may change |

### Printer Formatting

| Format | ESC/POS Command | Purpose |
|--------|-----------------|---------|
| Bold text | ESC E 1 | Offline marker |
| Large text | ESC ! 0x30 | Receipt ID |
| Centered | ESC a 1 | Headers |
| Left align | ESC a 0 | Items |
| Right align | ESC a 2 | Prices |
| Line feed | LF | Spacing |

### Digital Receipt Options

| Format | Use Case | Storage |
|--------|----------|---------|
| HTML | Browser view | IndexedDB |
| PDF | Download/email | Generate on demand |
| Plain text | SMS/simple email | Store with sale |
| JSON | System integration | Already stored |

### Reprint Handling

```
Reprint Request
       │
       ▼
Get Receipt ID
       │
       ▼
Query IndexedDB
       │
    ┌──┴───┐
    ▼      ▼
 Found  Not Found
    │      │
    │      ▼
    │  Show Error
    │
    ▼
Check Sync Status
    │
┌───┴───┐
▼       ▼
Synced  Pending
│       │
│       ▼
│   Show Original
│   Offline Receipt
│
▼
Show Updated
Receipt (Server ID)
    │
    └─────┬─────┘
          │
          ▼
    Add REPRINT Marker
          │
          ▼
    Show Original Date
          │
          ▼
       Print
```

### Expected Outcome
- Offline receipts generated correctly
- Clear offline indicators displayed
- Temp receipt IDs shown prominently
- Receipts printable on physical printers
- Digital receipt options available
- Reprints working from history

### Verification Checklist
- [ ] generateOfflineReceipt() function created
- [ ] Receipt data structure defined
- [ ] Header includes offline indicator
- [ ] Temp receipt ID displayed
- [ ] All sale details included
- [ ] Footer includes sync notice
- [ ] Print functionality working
- [ ] Receipts stored in IndexedDB
- [ ] Digital receipt formats supported
- [ ] Reprint functionality working
- [ ] Visual distinction from online receipts
- [ ] Receipt updates after sync

---

## Task 47: Create Cash Management

### Overview
Implement offline cash management functionality that tracks cash drawer operations without network connectivity. This includes recording cash payments from sales, tracking cash in/out operations, maintaining accurate cash drawer balance, recording expected vs actual counts, and queuing all cash movements for synchronization. The system ensures accountability and accuracy in cash handling during offline periods.

### Dependencies
- Task 46: Create Offline Receipt

### Instructions

1. **Create cash management service**
   - Create new file `frontend/lib/offline/cash-management.ts`
   - Export cash tracking functions
   - Import IndexedDB utilities
   - Define cash operation types

2. **Define cash operation data structure**
   - Create interface for cash operations
   - Include: type (sale, in, out, count)
   - Add amount, reason, timestamp
   - Include cashier ID and terminal ID
   - Add sync status fields

3. **Implement cash drawer tracking**
   - Create `cash_drawer` object in localStorage
   - Track current balance
   - Store opening balance
   - Track total sales, in, out
   - Update on each operation

4. **Create recordCashSale function**
   - Define `recordCashSale(amount, sale_id)` function
   - Add amount to drawer balance
   - Create cash operation record
   - Store in IndexedDB cash_operations store
   - Add to sync queue
   - Return updated balance

5. **Implement cash in/out operations**
   - Create `recordCashIn(amount, reason)` function
   - Create `recordCashOut(amount, reason)` function
   - Update drawer balance accordingly
   - Record operation details
   - Require reason/note
   - Add to sync queue

6. **Create cash count functionality**
   - Create `recordCashCount(counted, expected)` function
   - Calculate variance (counted - expected)
   - Record count operation
   - Update drawer balance to counted
   - Flag large variances
   - Store count details

7. **Implement drawer open/close**
   - Create `openDrawer(starting_balance)` function
   - Create `closeDrawer(ending_count)` function
   - Calculate shift totals
   - Generate cash report
   - Record operation
   - Clear drawer state

8. **Track cash operations history**
   - Store all operations in IndexedDB
   - Create index on timestamp
   - Create index on type
   - Create index on cashier_id
   - Enable operation lookup and reporting

9. **Implement cash reconciliation**
   - Calculate expected balance at any time
   - Compare with recorded balance
   - Track variances
   - Generate discrepancy reports
   - Alert on significant differences

10. **Add to sync queue**
    - Queue each cash operation
    - Set high priority for cash movements
    - Include complete operation details
    - Track sync status
    - Retry failed syncs

### Cash Management Flow

```
Cash Operation Occurs
       │
       ▼
  Determine Type
       │
   ┌───┴───┬───────┬────────┐
   ▼       ▼       ▼        ▼
 Sale   Cash In Cash Out  Count
   │       │       │        │
   └───┬───┴───┬───┴────┬───┘
       │       │        │
       ▼       ▼        ▼
Create Operation Record
       │
       ▼
Update Drawer Balance
       │
       ▼
Store in IndexedDB
       │
       ▼
Add to Sync Queue
       │
       ▼
Emit cash:updated Event
       │
       ▼
Return Updated Balance
```

### Cash Operation Types

| Type | Description | Balance Change |
|------|-------------|----------------|
| `sale` | Cash payment received | + amount |
| `cash_in` | Cash added to drawer | + amount |
| `cash_out` | Cash removed from drawer | - amount |
| `count` | Cash count/reconciliation | = counted amount |
| `open` | Drawer opened | = starting amount |
| `close` | Drawer closed | Final balance |

### Cash Operation Record Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Operation ID |
| `type` | string | Operation type |
| `amount` | number | Amount in operation |
| `balance_before` | number | Balance before op |
| `balance_after` | number | Balance after op |
| `reason` | string | Operation reason |
| `sale_id` | string | Related sale (if applicable) |
| `cashier_id` | string | Cashier performing op |
| `terminal_id` | string | POS terminal |
| `timestamp` | timestamp | Operation time |
| `synced` | boolean | Sync status |

### Cash Drawer State

```
localStorage: cash_drawer
{
  opening_balance: 100.00,
  current_balance: 236.75,
  total_sales: 150.00,
  total_cash_in: 0.00,
  total_cash_out: 13.25,
  opened_at: "2024-01-31T08:00:00Z",
  opened_by: "cashier_123",
  terminal_id: "POS-01",
  last_updated: "2024-01-31T14:30:00Z"
}
```

### Balance Calculation

```
Opening Balance: $100.00
+ Cash Sales: $150.00
+ Cash In: $0.00
- Cash Out: $13.25
= Expected Balance: $236.75

Actual Count: $235.00
Variance: -$1.75 (short)
```

### Cash Count Workflow

```
Perform Cash Count
       │
       ▼
Enter Counted Amount
       │
       ▼
Get Expected Balance
  (from current_balance)
       │
       ▼
Calculate Variance
  (counted - expected)
       │
       ▼
 Variance > Threshold?
    ┌──┴───┐
    ▼      ▼
  Yes     No
    │      │
    ▼      │
Flag for   │
Review     │
    │      │
    └──┬───┘
       │
       ▼
Record Count Operation
       │
       ▼
Update Drawer Balance
  = counted amount
       │
       ▼
Generate Count Report
```

### Drawer Open/Close Flow

```
Opening Drawer:
       │
       ▼
Count Starting Cash
       │
       ▼
Enter Amount
       │
       ▼
Create "open" Operation
       │
       ▼
Set opening_balance
Set current_balance
       │
       ▼
Ready for Sales

Closing Drawer:
       │
       ▼
Count Ending Cash
       │
       ▼
Calculate Expected
       │
       ▼
Enter Counted Amount
       │
       ▼
Calculate Variance
       │
       ▼
Generate Close Report
       │
       ▼
Create "close" Operation
       │
       ▼
Clear Drawer State
```

### Sync Queue Entry for Cash

| Field | Value |
|-------|-------|
| `type` | 'cash_operation' |
| `operation_type` | 'sale' / 'in' / 'out' / 'count' |
| `amount` | 36.75 |
| `data` | Complete operation record |
| `priority` | 'high' |
| `created_at` | timestamp |

### Cash Report Format

```
┌─────────────────────────────────────┐
│          CASH REPORT                │
│       Terminal: POS-01              │
│       Date: 2024-01-31              │
├─────────────────────────────────────┤
│                                     │
│ Opening Balance:        $100.00    │
│                                     │
│ Cash Sales:             $150.00    │
│ Cash In:                  $0.00    │
│ Cash Out:                -$13.25   │
│                                     │
│ Expected Balance:       $236.75    │
│                                     │
│ Actual Count:           $235.00    │
│                                     │
│ Variance:                -$1.75    │
│                                     │
│ Status: ⚠️ Short $1.75              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Total Transactions: 5               │
│                                     │
│ Cashier: Jane Doe                  │
│ Shift: 08:00 - 16:00               │
│                                     │
│        PENDING SYNC                 │
│                                     │
└─────────────────────────────────────┘
```

### Expected Outcome
- Cash operations tracked offline
- Drawer balance maintained accurately
- Cash counts recorded with variances
- Operations queued for sync
- Cash reports generated
- Accountability maintained

### Verification Checklist
- [ ] cash-management.ts file created
- [ ] Cash operation structure defined
- [ ] recordCashSale() function working
- [ ] Cash in/out functions created
- [ ] Cash count functionality implemented
- [ ] Drawer open/close working
- [ ] Operations stored in IndexedDB
- [ ] Balance calculations correct
- [ ] Sync queue entries added
- [ ] Cash reports generated
- [ ] Variance tracking working
- [ ] Events emitted correctly

---

## Task 48: Create Shift Offline

### Overview
Implement offline shift management functionality that allows cashiers to start, manage, and close shifts without network connectivity. This includes recording shift start/end times, tracking shift activities, maintaining shift state locally, generating shift reports, and queuing shift data for synchronization. The system ensures shift accountability and proper handoff procedures even during offline operation.

### Dependencies
- Task 47: Create Cash Management

### Instructions

1. **Create shift management service**
   - Add shift functions to offline manager
   - Or create `frontend/lib/offline/shift-management.ts`
   - Export shift tracking functions
   - Define shift data structures

2. **Define shift data structure**
   - Create interface for shift object
   - Include: shift_id, cashier_id, terminal_id
   - Add start_time, end_time
   - Include opening/closing cash amounts
   - Add shift status and offline flag

3. **Implement shift start function**
   - Create `startShift(cashier_id, opening_cash)` function
   - Generate unique temp shift ID
   - Record start timestamp
   - Store opening cash amount
   - Save shift object to IndexedDB
   - Store in localStorage as current_shift
   - Add to sync queue

4. **Track shift activities**
   - Record all sales in shift
   - Track cash operations
   - Count transactions
   - Calculate total sales
   - Track payment method breakdown
   - Store activity summary

5. **Implement shift close function**
   - Create `closeShift(closing_cash)` function
   - Record end timestamp
   - Calculate shift duration
   - Get activity summary
   - Calculate cash variance
   - Generate shift report
   - Update shift record
   - Clear current_shift
   - Add to sync queue

6. **Generate shift reports**
   - Create shift summary with all activities
   - Include sales totals by payment method
   - Show cash operations (in/out)
   - Calculate expected vs actual cash
   - List all sales in shift
   - Show shift duration
   - Format for printing

7. **Handle shift handoff**
   - Require closing previous shift
   - Transfer cash count to next shift
   - Record handoff details
   - Generate handoff report
   - Store handoff record
   - Notify manager of handoff

8. **Implement shift state persistence**
   - Store current shift in localStorage
   - Restore on page reload
   - Handle browser close/crash
   - Warn if shift not closed
   - Auto-save shift state periodically

9. **Track offline shift indicators**
   - Add offline flag to shift record
   - Show offline indicator in reports
   - Track sync status
   - Update after sync
   - Maintain audit trail

10. **Queue shift for sync**
    - Add shift start to queue
    - Add shift activities
    - Add shift close to queue
    - Set high priority
    - Include complete shift data
    - Track sync success

### Shift Management Flow

```
Start Shift
       │
       ▼
Enter Opening Cash
       │
       ▼
Generate Temp Shift ID
  (OFF-SHIFT-{uuid})
       │
       ▼
Create Shift Record
  { id, cashier_id,
    start_time,
    opening_cash,
    status: 'open',
    offline: true }
       │
       ▼
Store in IndexedDB
       │
       ▼
Store in localStorage
  (current_shift)
       │
       ▼
Add to Sync Queue
       │
       ▼
Show Shift Active
       │
       ▼
(Process Sales...)
       │
       ▼
Close Shift
       │
       ▼
Enter Closing Cash
       │
       ▼
Calculate Totals
       │
       ▼
Generate Report
       │
       ▼
Update Shift Record
  { end_time,
    closing_cash,
    status: 'closed' }
       │
       ▼
Store Updated Record
       │
       ▼
Clear current_shift
       │
       ▼
Add to Sync Queue
       │
       ▼
Print Report
```

### Shift Object Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Temp shift ID |
| `cashier_id` | string | Cashier reference |
| `cashier_name` | string | Cashier name |
| `terminal_id` | string | POS terminal |
| `start_time` | timestamp | Shift start |
| `end_time` | timestamp | Shift end (null if open) |
| `opening_cash` | number | Starting cash amount |
| `closing_cash` | number | Ending cash amount |
| `status` | string | 'open' / 'closed' |
| `offline` | boolean | Offline shift flag |
| `synced` | boolean | Sync status |
| `total_sales` | number | Total sales in shift |
| `transaction_count` | number | Number of sales |
| `cash_variance` | number | Closing variance |

### Shift Activity Tracking

```
During Shift:
       │
       ▼
Each Sale Completed
       │
       ▼
Add to Shift Sales Array
  shift.sales.push(sale_id)
       │
       ▼
Increment transaction_count
       │
       ▼
Add to total_sales
       │
       ▼
Update Payment Method Breakdown
  { cash: $X, card: $Y, ... }
       │
       ▼
Auto-save Shift State
       │
       ▼
Continue Processing...
```

### Shift Report Format

```
┌─────────────────────────────────────┐
│         SHIFT REPORT                │
│          (OFFLINE)                  │
│                                     │
│ Shift ID: OFF-SHIFT-a1b2c3d4...    │
│ Terminal: POS-01                    │
│ Branch: Main Store                  │
├─────────────────────────────────────┤
│                                     │
│ Cashier: Jane Doe                  │
│ ID: CASH-001                       │
│                                     │
│ Start: 2024-01-31  08:00:00        │
│ End:   2024-01-31  16:00:00        │
│ Duration: 8 hours 0 minutes        │
│                                     │
├─────────────────────────────────────┤
│         CASH SUMMARY                │
├─────────────────────────────────────┤
│                                     │
│ Opening Cash:           $100.00    │
│ Sales Cash:             $450.00    │
│ Cash In:                  $0.00    │
│ Cash Out:                -$50.00   │
│ Expected Closing:       $500.00    │
│                                     │
│ Actual Closing:         $498.25    │
│ Variance:                -$1.75    │
│                                     │
├─────────────────────────────────────┤
│        SALES SUMMARY                │
├─────────────────────────────────────┤
│                                     │
│ Total Transactions: 25              │
│ Total Sales: $750.00               │
│                                     │
│ By Payment Method:                 │
│   Cash:      $450.00  (60%)        │
│   Card:      $250.00  (33%)        │
│   Credit:     $50.00  (7%)         │
│                                     │
│ Average Sale: $30.00               │
│ Largest Sale: $125.00              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ⚠️  PENDING SYNCHRONIZATION        │
│                                     │
│ This shift will be synced when     │
│ connection is restored.             │
│                                     │
│ Cashier Signature: _____________   │
│                                     │
│ Manager Signature: _____________   │
│                                     │
└─────────────────────────────────────┘
```

### Shift State in LocalStorage

```json
{
  "current_shift": {
    "id": "OFF-SHIFT-a1b2c3d4...",
    "cashier_id": "CASH-001",
    "terminal_id": "POS-01",
    "start_time": "2024-01-31T08:00:00Z",
    "opening_cash": 100.00,
    "status": "open",
    "offline": true,
    "sales": ["OFF-abc...", "OFF-def..."],
    "transaction_count": 5,
    "total_sales": 150.00,
    "last_updated": "2024-01-31T10:30:00Z"
  }
}
```

### Shift Close Validation

| Check | Validation | Action |
|-------|------------|--------|
| Shift exists | current_shift not null | Error if no shift |
| Closing cash entered | amount > 0 | Require input |
| All sales synced | Check sync queue | Warn if pending |
| Cash counted | variance calculated | Require manager if large |

### Shift Handoff Process

```
Close Current Shift
       │
       ▼
Generate Close Report
       │
       ▼
Record Closing Cash: $500
       │
       ▼
Next Cashier Starts Shift
       │
       ▼
Record Opening Cash: $500
       │
       ▼
Verify Match
    ┌──┴───┐
    ▼      ▼
  Match  Mismatch
    │      │
    │      ▼
    │  Flag Variance
    │  Require Manager
    │      │
    └──┬───┘
       │
       ▼
Create Handoff Record
       │
       ▼
Store in IndexedDB
       │
       ▼
Continue Operations
```

### Sync Queue Entry for Shift

| Field | Value |
|-------|-------|
| `type` | 'shift_open' or 'shift_close' |
| `shift_id` | 'OFF-SHIFT-xxx...' |
| `data` | Complete shift object |
| `priority` | 'high' |
| `created_at` | timestamp |

### Expected Outcome
- Shifts managed completely offline
- Shift start/close recorded accurately
- Activities tracked throughout shift
- Shift reports generated
- Cash accountability maintained
- Data queued for sync

### Verification Checklist
- [ ] Shift management functions created
- [ ] Shift data structure defined
- [ ] startShift() function working
- [ ] Shift activities tracked
- [ ] closeShift() function working
- [ ] Shift reports generated
- [ ] Shift state persists
- [ ] Handoff process implemented
- [ ] Offline indicators added
- [ ] Sync queue entries created
- [ ] Reports printable
- [ ] Validation checks working

---

## Task 49: Create Error Boundary

### Overview
Implement error boundary and error handling mechanisms for the offline manager to gracefully handle failures, prevent data loss, and maintain system stability during offline operations. This includes React error boundaries, try-catch wrappers, error logging, user notifications, and recovery strategies. The error boundary ensures the POS remains operational even when individual components fail.

### Dependencies
- Task 48: Create Shift Offline

### Instructions

1. **Create React Error Boundary component**
   - Create `frontend/components/ErrorBoundary.tsx`
   - Implement React error boundary class
   - Catch rendering errors
   - Display fallback UI
   - Log errors to IndexedDB
   - Provide retry mechanism

2. **Define error types**
   - Create error type enum
   - Include: NetworkError, StorageError, ValidationError
   - Add SyncError, PrintError, CalculationError
   - Define error severity levels
   - Create error code system

3. **Implement error logging**
   - Create `logError(error, context)` function
   - Store errors in IndexedDB errors table
   - Include error details, stack trace
   - Add context (user, action, state)
   - Timestamp all errors
   - Limit stored error count (1000)

4. **Create error notification system**
   - Show user-friendly error messages
   - Use toast notifications for minor errors
   - Show modal for critical errors
   - Provide actionable error messages
   - Include error recovery suggestions

5. **Implement critical error handlers**
   - Wrap all IndexedDB operations in try-catch
   - Handle quota exceeded errors
   - Catch network timeout errors
   - Handle calculation errors
   - Manage print failures gracefully

6. **Create error recovery strategies**
   - For StorageError: Clear old data
   - For NetworkError: Queue for retry
   - For ValidationError: Show form errors
   - For SyncError: Re-queue with backoff
   - For PrintError: Save for manual print

7. **Implement fallback mechanisms**
   - If IndexedDB fails, use localStorage
   - If print fails, save receipt data
   - If sync fails, extend queue
   - If validation fails, save draft
   - Maintain core functionality always

8. **Add error recovery UI**
   - Show "Retry" button for recoverable errors
   - Provide "Report Issue" option
   - Display error details in expandable section
   - Show recent errors in settings
   - Allow error log export

9. **Implement offline-specific error handling**
   - Handle "already offline" scenarios
   - Manage "sync queue full" errors
   - Deal with "storage quota exceeded"
   - Handle "shift already open" conflicts
   - Manage "duplicate sale" scenarios

10. **Create error reporting**
    - Generate error reports
    - Include error frequency analysis
    - Show most common errors
    - Track error resolution
    - Queue error reports for sync

### Error Boundary Component Structure

```
OfflineManagerErrorBoundary
       │
       ▼
Wraps Offline Components
       │
    ┌──┴───┐
    ▼      ▼
Normal  Error Occurs
Flow       │
    │      ▼
    │  componentDidCatch()
    │      │
    │      ▼
    │  Log Error
    │      │
    │      ▼
    │  Show Fallback UI
    │      │
    │      ▼
    │  Provide Retry
    │      │
    └──────┘
```

### Error Types and Severity

| Error Type | Severity | Example |
|------------|----------|---------|
| NetworkError | Low | Fetch timeout |
| StorageError | High | IndexedDB quota |
| ValidationError | Medium | Invalid cart |
| SyncError | Medium | Sync failed |
| PrintError | Low | Printer offline |
| CalculationError | High | Tax calculation |
| SystemError | Critical | Uncaught exception |

### Error Logging Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Error ID |
| `type` | string | Error type |
| `severity` | string | Severity level |
| `message` | string | Error message |
| `stack` | string | Stack trace |
| `context` | object | Additional context |
| `user_id` | string | User reference |
| `action` | string | Action attempted |
| `timestamp` | timestamp | When occurred |
| `resolved` | boolean | Resolution status |

### Error Notification Examples

```
Low Severity (Toast):
┌────────────────────────────┐
│ ⚠️ Print job queued        │
│ Printer offline. Receipt   │
│ will print when available. │
│ [View Queue]               │
└────────────────────────────┘

High Severity (Modal):
┌─────────────────────────────────────┐
│           ⛔ Storage Error          │
├─────────────────────────────────────┤
│                                     │
│ Storage quota exceeded.             │
│                                     │
│ Please sync offline data or clear   │
│ old transactions to free space.     │
│                                     │
│ [Sync Now] [Clear Old] [Cancel]    │
│                                     │
└─────────────────────────────────────┘

Critical Error (Full Screen):
┌─────────────────────────────────────┐
│                                     │
│           🔧 System Error           │
│                                     │
│ The offline manager encountered     │
│ an unexpected error.                │
│                                     │
│ Your data is safe. You can:        │
│                                     │
│  • Retry the last action           │
│  • Restart the application         │
│  • Report this issue               │
│                                     │
│ [Retry] [Restart] [Report]         │
│                                     │
│ [Show Error Details]               │
│                                     │
└─────────────────────────────────────┘
```

### Error Recovery Flow

```
Error Occurs
       │
       ▼
Determine Error Type
       │
   ┌───┴────┬───────┬────────┐
   ▼        ▼       ▼        ▼
Network Storage Validation System
   │        │       │        │
   ▼        ▼       ▼        ▼
Queue    Clear   Show    Show
Retry    Space   Form    Error
         Free    Errors  Boundary
   │        │       │        │
   └────┬───┴───┬───┴────┬───┘
        │       │        │
        ▼       ▼        ▼
     Log Error
        │
        ▼
   Notify User
        │
        ▼
  Attempt Recovery
        │
     ┌──┴───┐
     ▼      ▼
 Success  Failed
     │      │
     ▼      ▼
  Resume  Fallback
  Normal  Mode
```

### Critical Operation Protection

```
try {
  // Critical operation
  await processOfflineSale(items)
} catch (error) {
  if (error instanceof StorageError) {
    // Attempt recovery
    await clearOldData()
    await processOfflineSale(items)
  } else if (error instanceof ValidationError) {
    // Show validation errors
    showValidationErrors(error.details)
  } else {
    // Log and notify
    await logError(error, { action: 'process_sale' })
    showErrorNotification(error)
    // Maintain state
    saveSaleDraft(items)
  }
}
```

### Error Recovery Strategies

| Error | Recovery Strategy |
|-------|------------------|
| Storage quota exceeded | Clear synced data, compress, notify user |
| Network timeout | Queue for retry with backoff |
| Validation failed | Show errors, allow correction |
| Sync failed | Re-queue with increased priority |
| Print failed | Save receipt, queue for reprint |
| Calculation error | Use fallback calculation, log error |
| Duplicate sale | Check if already processed, skip |

### Fallback Mechanisms

| Primary | Fallback | Last Resort |
|---------|----------|-------------|
| IndexedDB | localStorage | Memory only |
| Network sync | Queue locally | Manual export |
| Receipt print | Digital receipt | Manual reprint |
| Online payment | Cash only | Manual record |

### Expected Outcome
- Error boundary catches React errors
- All critical operations protected
- Errors logged systematically
- User notifications appropriate
- Recovery strategies working
- System remains stable

### Verification Checklist
- [ ] ErrorBoundary component created
- [ ] Error types defined
- [ ] Error logging implemented
- [ ] Notification system working
- [ ] Critical operations protected
- [ ] Recovery strategies implemented
- [ ] Fallback mechanisms working
- [ ] Recovery UI created
- [ ] Offline-specific errors handled
- [ ] Error reports generated
- [ ] Storage quota handling
- [ ] Network error handling

---

## Task 50: Verify Offline Manager

### Overview
Implement comprehensive testing and verification procedures for the offline manager system to ensure all components work correctly in isolation and together. This includes unit testing, integration testing, offline scenario testing, data integrity verification, and end-to-end testing of complete offline workflows. Verification ensures the POS system reliably operates without network connectivity.

### Dependencies
- Task 49: Create Error Boundary

### Instructions

1. **Create test plan document**
   - List all offline manager features
   - Define test scenarios for each
   - Specify expected outcomes
   - Document test data requirements
   - Create test checklists

2. **Setup testing environment**
   - Configure test IndexedDB database
   - Create test fixtures for products, customers
   - Setup mock network conditions
   - Configure browser DevTools
   - Prepare test POS terminal

3. **Test online detection**
   - Verify navigator.onLine detection
   - Test online event firing
   - Test offline event firing
   - Verify forced offline mode
   - Test health check pings
   - Validate debouncing

4. **Test data prefetch**
   - Verify product prefetch (10,000 limit)
   - Test customer prefetch (5,000 limit)
   - Verify inventory prefetch (10,000 limit)
   - Test progress tracking accuracy
   - Verify incremental updates
   - Test batch error handling

5. **Test offline sales**
   - Create complete offline sale
   - Verify temp receipt ID generation
   - Test stock validation
   - Verify total calculations
   - Test IndexedDB storage
   - Verify sync queue entry

6. **Test local stock updates**
   - Verify stock decrements
   - Test out-of-stock prevention
   - Verify pending updates tracking
   - Test atomic transactions
   - Verify event emissions

7. **Test offline receipts**
   - Generate offline receipt
   - Verify offline indicators
   - Test receipt printing
   - Verify receipt storage
   - Test receipt reprints
   - Verify digital formats

8. **Test cash management**
   - Record cash sales
   - Test cash in/out operations
   - Verify cash counts
   - Test drawer open/close
   - Verify variance tracking
   - Test cash reports

9. **Test shift management**
   - Start offline shift
   - Process multiple sales in shift
   - Test activity tracking
   - Close shift
   - Verify shift reports
   - Test shift handoff

10. **Test synchronization**
    - Verify queue creation
    - Test sync trigger on online
    - Verify data upload
    - Test ID mapping
    - Verify data reconciliation
    - Test sync error handling

11. **Test error handling**
    - Trigger various error types
    - Verify error logging
    - Test error notifications
    - Verify recovery mechanisms
    - Test fallback strategies
    - Verify system stability

12. **Perform end-to-end scenarios**
    - Complete offline day simulation
    - Test network toggling during operations
    - Verify data integrity throughout
    - Test recovery from crashes
    - Verify multi-terminal scenarios

### Test Scenarios Checklist

**Online Detection:**
- [ ] Initial state detection correct
- [ ] Online event triggers correctly
- [ ] Offline event triggers correctly
- [ ] Forced offline mode works
- [ ] Health check verifies connection
- [ ] State persists on refresh

**Data Prefetch:**
- [ ] Products prefetch completely
- [ ] Customers prefetch completely
- [ ] Inventory prefetch completely
- [ ] Progress tracking accurate
- [ ] Limits respected
- [ ] Errors handled gracefully
- [ ] Incremental updates work

**Offline Sales:**
- [ ] Can create sale offline
- [ ] Temp ID generated correctly
- [ ] Stock validation works
- [ ] Totals calculated correctly
- [ ] Sale stored in IndexedDB
- [ ] Sync queue entry created
- [ ] Out-of-stock prevented

**Local Stock:**
- [ ] Stock decrements correctly
- [ ] Negative stock prevented
- [ ] Pending updates tracked
- [ ] Events emitted
- [ ] UI updates correctly

**Offline Receipts:**
- [ ] Receipt generated with offline flag
- [ ] Temp ID displayed
- [ ] Receipt prints correctly
- [ ] Receipt stored for reprint
- [ ] Digital formats work

**Cash Management:**
- [ ] Cash sales recorded
- [ ] Balance updates correctly
- [ ] Cash in/out working
- [ ] Cash counts tracked
- [ ] Variances calculated
- [ ] Reports generated

**Shift Management:**
- [ ] Shift starts correctly
- [ ] Activities tracked
- [ ] Shift closes correctly
- [ ] Reports generated
- [ ] Handoff works
- [ ] State persists

**Synchronization:**
- [ ] Queue created correctly
- [ ] Sync triggers on online
- [ ] Sales sync successfully
- [ ] Stock updates sync
- [ ] Cash operations sync
- [ ] ID mappings created
- [ ] Receipts updated

**Error Handling:**
- [ ] Errors logged
- [ ] Notifications shown
- [ ] Recovery works
- [ ] Fallbacks functional
- [ ] System stable

### End-to-End Test Scenario

```
Complete Offline Day Test:

1. Start with online connection
   - Verify data prefetch
   - Check all data loaded

2. Switch to offline mode
   - Verify offline event fires
   - UI shows offline indicator

3. Start cashier shift
   - Open drawer with $100
   - Verify shift starts

4. Process 10 sales
   - Mix of cash and card
   - Verify receipts print
   - Check stock updates
   - Verify totals correct

5. Perform cash count
   - Count drawer
   - Verify variance tracking

6. Add cash in/out operations
   - Cash drop
   - Verify tracking

7. Close shift
   - Count closing cash
   - Generate report
   - Verify all data stored

8. Simulate browser refresh
   - Verify data persists
   - Verify shift continues if not closed
   - Check queue intact

9. Return online
   - Verify online event fires
   - Check sync triggers
   - Verify all sales sync
   - Check ID replacements

10. Verify data integrity
    - Compare local vs server
    - Verify stock levels
    - Check cash totals
    - Validate receipts

Result: All operations successful ✓
```

### Performance Benchmarks

| Operation | Target Time | Notes |
|-----------|-------------|-------|
| Prefetch 10,000 products | < 30 seconds | Network dependent |
| Process offline sale | < 2 seconds | Local only |
| Update local stock | < 500ms | Per sale |
| Generate receipt | < 1 second | Format dependent |
| Sync 100 sales | < 60 seconds | Network dependent |
| Error recovery | < 3 seconds | Automatic |

### Data Integrity Checks

```
Verify:
  ✓ All sales have receipts
  ✓ Stock levels match transaction history
  ✓ Cash totals balance
  ✓ No duplicate sales
  ✓ All temp IDs mapped to server IDs
  ✓ Shift totals accurate
  ✓ Queue fully processed
  ✓ No orphaned records
```

### Test Tools & Commands

| Tool | Purpose | Usage |
|------|---------|-------|
| Chrome DevTools | Network throttling | Toggle offline in Network tab |
| IndexedDB Inspector | View local data | Application → Storage → IndexedDB |
| Console | View logs | Check offline manager logs |
| React DevTools | Component state | Inspect OfflineManager state |

### Success Criteria

**All tests must pass:**
- [ ] All online detection tests pass
- [ ] All prefetch tests pass
- [ ] All offline sale tests pass
- [ ] All stock update tests pass
- [ ] All receipt tests pass
- [ ] All cash management tests pass
- [ ] All shift management tests pass
- [ ] All sync tests pass
- [ ] All error handling tests pass
- [ ] End-to-end scenarios successful
- [ ] Performance benchmarks met
- [ ] Data integrity verified

### Expected Outcome
- Complete test coverage of offline manager
- All features verified working
- Performance meets targets
- Data integrity maintained
- System stable and reliable
- Ready for production use

### Verification Checklist
- [ ] Test plan created
- [ ] Testing environment setup
- [ ] Online detection verified
- [ ] Prefetch tested and working
- [ ] Offline sales verified
- [ ] Stock updates tested
- [ ] Receipts verified
- [ ] Cash management tested
- [ ] Shift management verified
- [ ] Sync tested end-to-end
- [ ] Error handling verified
- [ ] E2E scenarios passed
- [ ] Performance benchmarks met
- [ ] Data integrity confirmed
- [ ] Documentation updated

---

## Summary

This document covered the implementation of offline sale processing, receipt generation, and shift management (Tasks 43-50):

**Completed Components:**
- Complete offline sale processing system
- Temporary receipt ID generation (OFF-{uuid})
- Local stock update and tracking
- Offline receipt generation and printing
- Cash management and drawer tracking
- Shift management with reports
- Comprehensive error boundary and handling
- Complete verification and testing procedures

**Key Features Implemented:**
- Full offline sale workflow
- Temp ID with server ID replacement after sync
- Real-time local stock management
- Receipts with clear offline indicators
- Complete cash accountability
- Shift tracking and reporting
- Robust error handling and recovery
- Comprehensive testing coverage

**Integration Points:**
- All sales queued for synchronization
- Stock updates tracked for server reconciliation
- Cash operations synced with accounting
- Shift data uploaded to management system
- Receipts updated post-sync
- Error logs sent to monitoring

**System Capabilities:**
The offline manager now provides complete POS functionality without network connectivity:
- Accept and process sales
- Generate and print receipts
- Manage cash drawer
- Track shifts and handoffs
- Maintain accurate stock levels
- Queue all changes for sync
- Handle errors gracefully
- Recover from failures

**Next Steps:**
- Proceed to Group D: Sync Queue
- Implement sync queue management
- Create sync prioritization
- Add conflict resolution
- Implement retry strategies
- Create sync monitoring

The offline manager enables continuous POS operations regardless of network availability, ensuring business continuity and data integrity.

---

**Document Navigation:**
- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-42_Manager-Prefetch.md](01_Tasks-33-42_Manager-Prefetch.md)
- **→ Next Group:** [Group-D_Sync-Queue](../Group-D_Sync-Queue/)
