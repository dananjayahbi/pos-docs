# Tasks 07-12: Address, Dates, Financial & Metadata

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** A - Order Model & Status System  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_Users-Currency-Number-Index-Migration.md](03_Tasks-13-18_Users-Currency-Number-Index-Migration.md)

---

## Document Overview

This document covers critical order fields including shipping/billing addresses, date tracking through the order lifecycle, financial calculations, payment status, reference fields for linking to other entities, and metadata for notes and tags.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add Order Address Fields | Medium | 25 min |
| 08 | Add Order Date Fields | Medium | 20 min |
| 09 | Add Order Financial Fields | Medium | 25 min |
| 10 | Add Order Payment Status Fields | Medium | 20 min |
| 11 | Add Order Reference Fields | Medium | 20 min |
| 12 | Add Order Metadata Fields | Medium | 20 min |

---

## Task 07: Add Order Address Fields

### Overview
Add comprehensive address fields to the Order model to store shipping and billing information. Support both structured address storage using JSONField and future foreign key relationships to address models.

### Dependencies
- Task 05: Create Order Model Core Fields
- Task 06: Add Order Customer Fields

### Instructions

1. **Open order.py model file**
   - Navigate to `apps/orders/models/order.py`
   - Locate the Order model class after customer fields

2. **Import JSONField**
   - Add import for models.JSONField
   - This allows flexible address structure storage

3. **Add shipping_address field**
   - Use JSONField with default=dict
   - Make it blank=True
   - Stores complete shipping address as structured data
   - Add help_text explaining JSON structure

4. **Add billing_address field**
   - Use JSONField with default=dict
   - Make it blank=True
   - Stores billing address separately
   - Add help_text noting it defaults to shipping if empty

5. **Add use_shipping_as_billing field**
   - Use BooleanField with default=True
   - Indicates if billing address same as shipping
   - Simplifies address entry

6. **Add shipping_method field**
   - Use CharField with max_length=50
   - Make it blank=True
   - Examples: "Standard", "Express", "Pickup"
   - Add help_text with examples

7. **Add tracking_number field**
   - Use CharField with max_length=100
   - Make it blank=True
   - Stores courier tracking number
   - Add help_text explaining usage

8. **Add tracking_url field**
   - Use URLField
   - Make it blank=True
   - Direct link to tracking page
   - Add help_text for customer convenience

9. **Add delivery_instructions field**
   - Use TextField
   - Make it blank=True
   - Special delivery notes for courier
   - Add help_text with examples

10. **Define address JSON structure**
    - Document expected JSON schema in docstring
    - Include fields: name, line1, line2, city, state, postal_code, country

11. **Add get_shipping_address method**
    - Return formatted shipping address string
    - Handle missing fields gracefully
    - Useful for display purposes

12. **Add get_billing_address method**
    - Return billing address if set
    - Otherwise return shipping address
    - Respects use_shipping_as_billing flag

13. **Add format_address helper method**
    - Take address JSON and format as multi-line string
    - Handle Sri Lankan address format
    - Return empty string if address incomplete

### Address Field Structure Diagram

```
┌──────────────────────────────────────────────────────────┐
│                ORDER ADDRESS STRUCTURE                    │
└──────────────────────────────────────────────────────────┘

    Order Model
    │
    ├── shipping_address (JSONField)
    │   └── {
    │       "name": "John Doe",
    │       "line1": "123 Galle Road",
    │       "line2": "Apartment 4B",
    │       "city": "Colombo",
    │       "state": "Western Province",
    │       "postal_code": "00300",
    │       "country": "LK",
    │       "phone": "+94771234567"
    │   }
    │
    ├── billing_address (JSONField)
    │   └── (Same structure, or empty if same as shipping)
    │
    ├── use_shipping_as_billing (Boolean)
    │   └── True/False
    │
    ├── shipping_method (CharField)
    │   └── "Standard", "Express", "Pickup"
    │
    ├── tracking_number (CharField)
    │   └── "TRACK123456789"
    │
    ├── tracking_url (URLField)
    │   └── "https://courier.com/track/123456789"
    │
    └── delivery_instructions (TextField)
        └── "Leave at reception desk"
```

### Address JSON Schema

```json
{
  "name": "string (required) - Recipient name",
  "line1": "string (required) - Street address",
  "line2": "string (optional) - Apartment, suite, etc.",
  "city": "string (required) - City/Town",
  "state": "string (optional) - Province/State",
  "postal_code": "string (required) - Postal code",
  "country": "string (required) - ISO country code (LK)",
  "phone": "string (optional) - Contact phone",
  "latitude": "float (optional) - GPS latitude",
  "longitude": "float (optional) - GPS longitude"
}
```

### Sri Lankan Address Format

```
Standard Format:
─────────────────
John Doe
123 Galle Road, Apartment 4B
Colombo 03
Western Province
Sri Lanka 00300

Minimal Format:
─────────────────
Jane Smith
456 Kandy Road
Kandy 20000

With Province:
─────────────────
Customer Name
Address Line 1
City, Postal Code
Province, Sri Lanka
```

### Shipping Methods

| Method | Delivery Time | Cost Tier | Use Case |
|--------|---------------|-----------|----------|
| **Standard** | 3-5 days | Low | Regular orders |
| **Express** | 1-2 days | High | Urgent delivery |
| **Same Day** | Same day | Premium | Local rush |
| **Store Pickup** | Immediate | Free | Customer collection |
| **International** | 7-14 days | Variable | Export orders |

### Sri Lankan Cities & Postal Codes

| City | Postal Code | Province |
|------|-------------|----------|
| Colombo | 00100-01500 | Western |
| Kandy | 20000-20999 | Central |
| Galle | 80000-80699 | Southern |
| Jaffna | 40000-40999 | Northern |
| Negombo | 11500-11599 | Western |
| Anuradhapura | 50000-50499 | North Central |
| Kurunegala | 60000-60999 | North Western |
| Batticaloa | 30000-30999 | Eastern |

### Tracking Number Formats

| Courier | Format | Example |
|---------|--------|---------|
| **Pronto** | PRT-XXXXXXX | PRT-1234567 |
| **Domex** | DMX-XXXXXXX | DMX-9876543 |
| **DHL** | XXXXXXXXXX | 1234567890 |
| **FedEx** | XXXXXXXXXXXX | 123456789012 |
| **Local Post** | RPXXXXXXLK | RP123456LK |

### Address Validation Flow

```
ADDRESS INPUT:
    │
    ├─> Parse address string
    │
    ├─> Validate required fields
    │   ├─ name (required)
    │   ├─ line1 (required)
    │   ├─ city (required)
    │   └─ postal_code (required)
    │
    ├─> Validate postal code format
    │   └─> Sri Lanka: XXXXX or XXXXXX
    │
    ├─> Geocode if possible
    │   └─> Add lat/long to JSON
    │
    ├─> Store as JSON
    │
    └─> Success
```

### Address Display Scenarios

| Scenario | Display Logic |
|----------|---------------|
| **Order Summary** | Show shipping address, note if billing different |
| **Invoice** | Show both addresses if different |
| **Packing Slip** | Show shipping address only |
| **Delivery Label** | Format for courier requirements |
| **Customer View** | Highlight delivery instructions |

### Delivery Instructions Examples

| Type | Example |
|------|---------|
| **Access** | "Ring doorbell, building has security" |
| **Timing** | "Deliver after 6 PM, no one home during day" |
| **Location** | "Leave package with security guard" |
| **Contact** | "Call +94771234567 upon arrival" |
| **Special** | "Handle with care - fragile items" |

### Helper Method Behaviors

```python
# get_shipping_address() example:
order.shipping_address = {
    "name": "John Doe",
    "line1": "123 Galle Road",
    "city": "Colombo",
    "postal_code": "00300"
}
order.get_shipping_address()
# Returns:
# "John Doe
#  123 Galle Road
#  Colombo 00300"

# get_billing_address() example with same as shipping:
order.use_shipping_as_billing = True
order.billing_address = {}
order.get_billing_address()
# Returns shipping address

# format_address() example:
order.format_address({
    "name": "Jane Smith",
    "line1": "456 Main St",
    "line2": "Suite 10",
    "city": "Kandy",
    "postal_code": "20000"
})
# Returns:
# "Jane Smith
#  456 Main St, Suite 10
#  Kandy 20000"
```

### Verification Checklist
- [ ] shipping_address JSONField added
- [ ] billing_address JSONField added
- [ ] use_shipping_as_billing field added
- [ ] shipping_method field added
- [ ] tracking_number field added
- [ ] tracking_url field added
- [ ] delivery_instructions field added
- [ ] Address JSON schema documented
- [ ] get_shipping_address() method implemented
- [ ] get_billing_address() method implemented
- [ ] format_address() helper method created
- [ ] Sri Lankan format support included

---

## Task 08: Add Order Date Fields

### Overview
Add comprehensive date tracking fields to monitor the order lifecycle from creation through completion. These timestamps enable analytics, SLA tracking, and status audit trails.

### Dependencies
- Task 05: Create Order Model Core Fields
- Task 03: Define OrderStatus Choices

### Instructions

1. **Open order.py model file**
   - Locate Order model after address fields section

2. **Import timezone utilities**
   - Ensure django.utils.timezone imported
   - Used for timezone-aware datetimes

3. **Add confirmed_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when status changes to CONFIRMED
   - Add db_index=True for queries
   - Add help_text explaining when set

4. **Add processing_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when status changes to PROCESSING
   - Add help_text about fulfillment start

5. **Add picked_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when items picked from warehouse
   - Add help_text about picking completion

6. **Add packed_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when order packed and ready
   - Add help_text about packing completion

7. **Add shipped_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when status changes to SHIPPED
   - Add db_index=True for shipping queries
   - Add help_text about dispatch

8. **Add delivered_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when status changes to DELIVERED
   - Add db_index=True for delivery tracking
   - Add help_text about customer receipt

9. **Add completed_at field**
   - Use DateTimeField
   - Set null=True, blank=True
   - Set when status changes to COMPLETED
   - Add help_text about finalization

10. **Add cancelled_at field**
    - Use DateTimeField
    - Set null=True, blank=True
    - Set when status changes to CANCELLED
    - Add help_text about cancellation

11. **Add returned_at field**
    - Use DateTimeField
    - Set null=True, blank=True
    - Set when status changes to RETURNED
    - Add help_text about return processing

12. **Add expected_delivery_date field**
    - Use DateField
    - Set null=True, blank=True
    - Estimated delivery date shown to customer
    - Add help_text about customer expectation

13. **Add promised_delivery_date field**
    - Use DateField
    - Set null=True, blank=True
    - Guaranteed delivery date (SLA)
    - Add help_text about commitment

14. **Add get_lifecycle_duration method**
    - Calculate duration from order_date to completed_at
    - Return timedelta or None
    - Useful for performance metrics

15. **Add get_processing_duration method**
    - Calculate confirmed_at to shipped_at duration
    - Return timedelta or None
    - Measures fulfillment efficiency

16. **Add get_delivery_duration method**
    - Calculate shipped_at to delivered_at duration
    - Return timedelta or None
    - Tracks shipping performance

17. **Add is_overdue property**
    - Check if past promised_delivery_date
    - Return boolean
    - Useful for exception handling

18. **Add get_current_phase method**
    - Return current lifecycle phase based on dates
    - Values: "ordered", "confirmed", "processing", "shipped", "delivered"
    - More granular than status field

### Order Date Lifecycle Diagram

```
┌──────────────────────────────────────────────────────────┐
│              ORDER DATE LIFECYCLE TRACKING                │
└──────────────────────────────────────────────────────────┘

Timeline:
─────────────────────────────────────────────────────────>

  order_date           confirmed_at       processing_at
      │                     │                   │
      ▼                     ▼                   ▼
   [PENDING]            [CONFIRMED]         [PROCESSING]
      │                     │                   │
      │                     ├─> Stock           ├─> Picking
      │                     │   Reserved        │
      │                     │                   ├─> picked_at
      │                     │                   │
      │                     │                   ├─> Packing
      │                     │                   │
      │                     │                   └─> packed_at
      │                     │                       │
      ▼                     ▼                       ▼

                      shipped_at              delivered_at
                          │                       │
                          ▼                       ▼
                      [SHIPPED]               [DELIVERED]
                          │                       │
                          ├─> Tracking            ├─> Confirmed
                          │   Updated             │   Receipt
                          │                       │
                          ▼                       ▼

                                            completed_at
                                                 │
                                                 ▼
                                             [COMPLETED]


ALTERNATE PATHS:

Any Stage ──> cancelled_at ──> [CANCELLED]

[DELIVERED/COMPLETED] ──> returned_at ──> [RETURNED]
```

### Date Field Mapping to Status

| Status | Primary Date Field | Additional Fields |
|--------|-------------------|-------------------|
| PENDING | order_date | - |
| CONFIRMED | confirmed_at | - |
| PROCESSING | processing_at | picked_at, packed_at |
| SHIPPED | shipped_at | - |
| DELIVERED | delivered_at | - |
| COMPLETED | completed_at | - |
| CANCELLED | cancelled_at | - |
| RETURNED | returned_at | - |

### Date Calculation Methods

```
Lifecycle Duration:
───────────────────
completed_at - order_date
Example: 5 days, 3 hours, 20 minutes

Processing Duration:
───────────────────
shipped_at - confirmed_at
Example: 2 days, 1 hour

Delivery Duration:
───────────────────
delivered_at - shipped_at
Example: 1 day, 4 hours

Picking Time:
───────────────────
picked_at - processing_at
Example: 45 minutes

Packing Time:
───────────────────
packed_at - picked_at
Example: 30 minutes
```

### Expected vs Actual Delivery

| Field | Purpose | Who Sets | When Set |
|-------|---------|----------|----------|
| **expected_delivery_date** | Estimated date | System | Order creation |
| **promised_delivery_date** | Guaranteed date | Sales team | Order confirmation |
| **delivered_at** | Actual delivery | System | Delivery confirmation |

### SLA Tracking

```
SLA CHECK FLOW:

Current DateTime
       │
       ▼
┌─────────────────┐
│ Check Promised  │
│ Delivery Date   │
└─────────────────┘
       │
       ├─ No promised date? ─> Use expected date
       │
       ├─ Past promised date? ─> OVERDUE
       │                         ├─> Alert manager
       │                         ├─> Escalate priority
       │                         └─> Customer notification
       │
       └─ Within SLA? ─> OK
                         └─> Continue normal flow
```

### Performance Metrics

| Metric | Calculation | Target | Use Case |
|--------|-------------|--------|----------|
| **Order Velocity** | confirmed_at - order_date | < 1 hour | Quote to order speed |
| **Pick Time** | picked_at - processing_at | < 30 min | Warehouse efficiency |
| **Pack Time** | packed_at - picked_at | < 20 min | Packing efficiency |
| **Fulfillment Time** | shipped_at - confirmed_at | < 24 hours | Total processing |
| **Delivery Time** | delivered_at - shipped_at | < 48 hours | Shipping performance |
| **Total Cycle** | completed_at - order_date | < 5 days | End-to-end |

### Timezone Considerations

```
TIMEZONE HANDLING:

All dates stored in UTC:
  order_date = timezone.now()  # UTC

Display to user in local time:
  Asia/Colombo timezone (+5:30)
  
Example:
  UTC: 2026-01-23 10:00:00
  LK:  2026-01-23 15:30:00
  
Always use timezone-aware datetimes:
  ✓ timezone.now()
  ✓ timezone.make_aware()
  ✗ datetime.now() (naive)
```

### Date Status Hooks

```
STATUS CHANGE HOOKS:

When status changes, update corresponding date:

def save(self, *args, **kwargs):
    if self.status == OrderStatus.CONFIRMED and not self.confirmed_at:
        self.confirmed_at = timezone.now()
    
    if self.status == OrderStatus.PROCESSING and not self.processing_at:
        self.processing_at = timezone.now()
    
    if self.status == OrderStatus.SHIPPED and not self.shipped_at:
        self.shipped_at = timezone.now()
    
    if self.status == OrderStatus.DELIVERED and not self.delivered_at:
        self.delivered_at = timezone.now()
    
    if self.status == OrderStatus.COMPLETED and not self.completed_at:
        self.completed_at = timezone.now()
    
    if self.status == OrderStatus.CANCELLED and not self.cancelled_at:
        self.cancelled_at = timezone.now()
    
    if self.status == OrderStatus.RETURNED and not self.returned_at:
        self.returned_at = timezone.now()
    
    super().save(*args, **kwargs)
```

### Verification Checklist
- [ ] confirmed_at DateTimeField added
- [ ] processing_at DateTimeField added
- [ ] picked_at DateTimeField added
- [ ] packed_at DateTimeField added
- [ ] shipped_at DateTimeField added
- [ ] delivered_at DateTimeField added
- [ ] completed_at DateTimeField added
- [ ] cancelled_at DateTimeField added
- [ ] returned_at DateTimeField added
- [ ] expected_delivery_date DateField added
- [ ] promised_delivery_date DateField added
- [ ] get_lifecycle_duration() method created
- [ ] get_processing_duration() method created
- [ ] get_delivery_duration() method created
- [ ] is_overdue property created
- [ ] get_current_phase() method created
- [ ] Timezone handling with UTC storage
- [ ] Date indexes on key fields

---

## Task 09: Add Order Financial Fields

### Overview
Add comprehensive financial fields to the Order model for tracking amounts, discounts, taxes, shipping costs, and totals. These fields enable accurate financial reporting and reconciliation.

### Dependencies
- Task 05: Create Order Model Core Fields

### Instructions

1. **Open order.py model file**
   - Locate Order model after date fields section

2. **Import Decimal utilities**
   - Import Decimal from decimal module
   - Used for precise financial calculations

3. **Add subtotal field**
   - Use DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of all line items before discounts
   - Add help_text explaining calculation

4. **Add discount_amount field**
   - Use DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Total discount applied to order
   - Add help_text about order-level discounts

5. **Add discount_percentage field**
   - Use DecimalField with max_digits=5, decimal_places=2
   - Set null=True, blank=True
   - Percentage discount if applicable
   - Add help_text explaining usage

6. **Add tax_amount field**
   - Use DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Total tax applied to order
   - Add help_text about VAT/GST

7. **Add shipping_cost field**
   - Use DecimalField with max_digits=10, decimal_places=2
   - Default to Decimal('0.00')
   - Delivery charges
   - Add help_text about calculation

8. **Add total field**
   - Use DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Final order total
   - Add help_text: subtotal - discount + tax + shipping

9. **Add paid_amount field**
   - Use DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Amount received from customer
   - Add help_text about payments

10. **Add refund_amount field**
    - Use DecimalField with max_digits=12, decimal_places=2
    - Default to Decimal('0.00')
    - Amount refunded to customer
    - Add help_text about returns

11. **Add cost_of_goods field**
    - Use DecimalField with max_digits=12, decimal_places=2
    - Default to Decimal('0.00')
    - Internal cost calculation
    - Add help_text about profit tracking

12. **Add profit_margin field**
    - Use DecimalField with max_digits=5, decimal_places=2
    - Set null=True, blank=True
    - Calculated profit percentage
    - Add help_text about gross margin

13. **Add calculate_totals method**
    - Recalculate all financial fields
    - Sum line items for subtotal
    - Apply discount
    - Calculate tax
    - Add shipping
    - Set total

14. **Add get_balance_due method**
    - Return total - paid_amount
    - Shows remaining payment
    - Return Decimal('0.00') if fully paid

15. **Add get_profit method**
    - Return total - cost_of_goods - refund_amount
    - Calculate actual profit
    - Return Decimal or None

16. **Add is_fully_paid property**
    - Check if paid_amount >= total
    - Return boolean
    - Account for rounding

17. **Add get_effective_discount_percentage method**
    - Calculate actual discount as percentage
    - Return (discount_amount / subtotal) * 100
    - Handle zero subtotal

### Financial Fields Structure Diagram

```
┌──────────────────────────────────────────────────────────┐
│              ORDER FINANCIAL STRUCTURE                    │
└──────────────────────────────────────────────────────────┘

                   ORDER TOTALS CALCULATION

    ┌─────────────────┐
    │    Line Items   │
    │  (Qty × Price)  │
    └─────────────────┘
            │
            ▼
    ┌─────────────────┐
    │    Subtotal     │ = Sum of line items
    └─────────────────┘
            │
            ├─ Minus ─────> ┌─────────────────┐
            │               │ Discount Amount │
            │               └─────────────────┘
            ▼
    ┌─────────────────┐
    │ Discounted Sub  │
    └─────────────────┘
            │
            ├─ Plus ──────> ┌─────────────────┐
            │               │   Tax Amount    │
            │               └─────────────────┘
            │
            ├─ Plus ──────> ┌─────────────────┐
            │               │ Shipping Cost   │
            │               └─────────────────┘
            ▼
    ┌─────────────────┐
    │   Order Total   │ = Final amount
    └─────────────────┘
            │
            ├─ Minus ─────> ┌─────────────────┐
            │               │  Paid Amount    │
            │               └─────────────────┘
            ▼
    ┌─────────────────┐
    │  Balance Due    │ = Amount owed
    └─────────────────┘


    PROFIT CALCULATION:

    Total - Cost of Goods - Refund = Profit
```

### Financial Calculation Formula

```
SUBTOTAL CALCULATION:
─────────────────────
subtotal = Σ (line_item.quantity × line_item.unit_price)

DISCOUNTED AMOUNT:
─────────────────────
if discount_percentage:
    discount_amount = subtotal × (discount_percentage / 100)
else:
    discount_amount = (manual entry)

TAXABLE AMOUNT:
─────────────────────
taxable_amount = subtotal - discount_amount

TAX CALCULATION (Sri Lanka VAT 15%):
─────────────────────
tax_amount = taxable_amount × 0.15

TOTAL CALCULATION:
─────────────────────
total = subtotal - discount_amount + tax_amount + shipping_cost

BALANCE DUE:
─────────────────────
balance_due = total - paid_amount

PROFIT:
─────────────────────
profit = total - cost_of_goods - refund_amount

PROFIT MARGIN:
─────────────────────
profit_margin = (profit / total) × 100
```

### Sri Lankan Tax Context

| Tax Type | Rate | Application |
|----------|------|-------------|
| **VAT** | 15% | Most goods and services |
| **NBT** | 2% | Business transactions |
| **Exempt** | 0% | Essential items (food, medicine) |
| **Zero-rated** | 0% | Exports |

### Decimal Precision Standards

| Field Type | Digits | Decimals | Max Value | Example |
|------------|--------|----------|-----------|---------|
| **Amounts** | 12 | 2 | 9,999,999,999.99 | 125,450.75 |
| **Percentages** | 5 | 2 | 999.99% | 15.00% |
| **Margin** | 5 | 2 | 999.99% | 35.50% |

### Currency Formatting (LKR)

```
Display Formats:

Standard:
  Rs. 1,250.00
  LKR 1,250.00

With Symbol:
  රු. 1,250.00

Unicode Symbol:
  ₨ 1,250.00

No Decimals:
  Rs. 1,250

Accounting:
  (1,250.00)  # negative
  1,250.00    # positive
```

### Discount Scenarios

| Scenario | Subtotal | Discount Type | Discount Amount | Final Subtotal |
|----------|----------|---------------|-----------------|----------------|
| **Percentage** | Rs. 10,000 | 10% | Rs. 1,000 | Rs. 9,000 |
| **Fixed Amount** | Rs. 10,000 | Rs. 500 | Rs. 500 | Rs. 9,500 |
| **Coupon** | Rs. 10,000 | Rs. 1,500 | Rs. 1,500 | Rs. 8,500 |
| **Loyalty** | Rs. 10,000 | 5% | Rs. 500 | Rs. 9,500 |

### Example Calculation Walkthrough

```
ORDER EXAMPLE:

Line Items:
  Product A: 2 × Rs. 5,000 = Rs. 10,000
  Product B: 1 × Rs. 3,000 = Rs. 3,000
  ──────────────────────────────────────
  Subtotal:                   Rs. 13,000

Discount (10%):
  13,000 × 0.10 = Rs. 1,300
  ──────────────────────────────────────
  Discounted Subtotal:        Rs. 11,700

Tax (15% VAT):
  11,700 × 0.15 = Rs. 1,755
  ──────────────────────────────────────
  Subtotal with Tax:          Rs. 13,455

Shipping:
  Standard Delivery:          Rs. 500
  ──────────────────────────────────────
  ORDER TOTAL:                Rs. 13,955

Payment:
  Paid Amount:                Rs. 13,955
  ──────────────────────────────────────
  BALANCE DUE:                Rs. 0.00

Cost of Goods:
  Product A: 2 × Rs. 3,500 = Rs. 7,000
  Product B: 1 × Rs. 2,000 = Rs. 2,000
  ──────────────────────────────────────
  Total COGS:                 Rs. 9,000

Profit:
  Total - COGS = 13,955 - 9,000 = Rs. 4,955
  Margin: (4,955 / 13,955) × 100 = 35.51%
```

### Payment Status Integration

The financial fields work together with payment_status:

| Balance Due | Paid Amount | Status | Description |
|-------------|-------------|--------|-------------|
| = total | Rs. 0 | UNPAID | No payment received |
| < total | > 0, < total | PARTIAL | Partial payment |
| = 0 | = total | PAID | Fully paid |
| < 0 | > total | REFUNDED | Over-payment or refund |

### Rounding Rules

```
ROUNDING STRATEGY:

All financial calculations use ROUND_HALF_UP:
  12.345 → 12.35
  12.344 → 12.34
  12.355 → 12.36

Decimal precision: 2 places
Storage: Decimal type (no floating point errors)

Tax rounding:
  Round to nearest cent (0.01)

Total rounding:
  Round to nearest cent (0.01)
```

### Financial Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| **Positive amounts** | All amounts >= 0 | "Amount cannot be negative" |
| **Discount limit** | discount_amount <= subtotal | "Discount exceeds subtotal" |
| **Payment limit** | paid_amount <= total + tolerance | "Payment exceeds total" |
| **Refund limit** | refund_amount <= paid_amount | "Refund exceeds payment" |
| **Total accuracy** | total = subtotal - discount + tax + shipping | "Total calculation mismatch" |

### Verification Checklist
- [ ] subtotal DecimalField added (12,2)
- [ ] discount_amount DecimalField added (12,2)
- [ ] discount_percentage DecimalField added (5,2)
- [ ] tax_amount DecimalField added (12,2)
- [ ] shipping_cost DecimalField added (10,2)
- [ ] total DecimalField added (12,2)
- [ ] paid_amount DecimalField added (12,2)
- [ ] refund_amount DecimalField added (12,2)
- [ ] cost_of_goods DecimalField added (12,2)
- [ ] profit_margin DecimalField added (5,2)
- [ ] calculate_totals() method implemented
- [ ] get_balance_due() method implemented
- [ ] get_profit() method implemented
- [ ] is_fully_paid property implemented
- [ ] get_effective_discount_percentage() method implemented
- [ ] All decimals default to Decimal('0.00')
- [ ] Decimal import included

---

## Task 10: Add Order Payment Status Fields

### Overview
Add payment status tracking to the Order model to monitor payment state independently from order status. This enables flexible payment workflows including partial payments and refunds.

### Dependencies
- Task 09: Add Order Financial Fields

### Instructions

1. **Open constants.py file**
   - Add PaymentStatus choices class

2. **Define PaymentStatus class**
   - Create class inheriting from models.TextChoices
   - Add four payment states

3. **Define UNPAID status**
   - Value: `'unpaid'`
   - Label: `'Unpaid'`
   - No payment received

4. **Define PARTIAL status**
   - Value: `'partial'`
   - Label: `'Partially Paid'`
   - Partial payment received

5. **Define PAID status**
   - Value: `'paid'`
   - Label: `'Paid'`
   - Full payment received

6. **Define REFUNDED status**
   - Value: `'refunded'`
   - Label: `'Refunded'`
   - Payment refunded

7. **Open order.py model file**
   - Import PaymentStatus from constants

8. **Add payment_status field**
   - Use CharField with choices=PaymentStatus.choices
   - Set default=PaymentStatus.UNPAID
   - Set max_length=20
   - Add db_index=True for filtering
   - Add help_text explaining states

9. **Add payment_method field**
   - Use CharField with max_length=50
   - Make it blank=True
   - Examples: "Cash", "Card", "Bank Transfer"
   - Add help_text with examples

10. **Add payment_reference field**
    - Use CharField with max_length=100
    - Make it blank=True
    - Transaction ID or reference number
    - Add help_text about transaction tracking

11. **Add update_payment_status method**
    - Automatically set payment_status based on amounts
    - Check paid_amount vs total
    - Check refund_amount
    - Update status accordingly

12. **Add can_cancel property**
    - Return True if order can be cancelled
    - Consider payment_status and order status
    - Prevent cancellation of paid orders without approval

13. **Add requires_payment property**
    - Return True if payment pending
    - Check if balance_due > 0
    - Useful for reminders

### Payment Status Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│              PAYMENT STATUS LIFECYCLE                     │
└──────────────────────────────────────────────────────────┘

    [ORDER CREATED]
           │
           ▼
    ┌────────────┐
    │   UNPAID   │ ◄─────────┐
    └────────────┘           │
           │                 │
           │ partial         │ add payment
           │ payment         │
           ▼                 │
    ┌────────────┐           │
    │  PARTIAL   │───────────┘
    └────────────┘
           │
           │ complete
           │ payment
           ▼
    ┌────────────┐
    │    PAID    │
    └────────────┘
           │
           │ process
           │ refund
           ▼
    ┌────────────┐
    │  REFUNDED  │ (terminal)
    └────────────┘


    PAYMENT STATE TRANSITIONS:

    UNPAID ──> PARTIAL ──> PAID ──> REFUNDED
      │                      │
      └──────────────────────┘
           (direct payment)
```

### Payment Status Determination Logic

```python
def update_payment_status(self):
    """
    Auto-update payment status based on amounts
    """
    # Check refund scenario
    if self.refund_amount > 0:
        self.payment_status = PaymentStatus.REFUNDED
    
    # Check full payment
    elif self.paid_amount >= self.total:
        self.payment_status = PaymentStatus.PAID
    
    # Check partial payment
    elif self.paid_amount > 0:
        self.payment_status = PaymentStatus.PARTIAL
    
    # No payment received
    else:
        self.payment_status = PaymentStatus.UNPAID
```

### Payment Status vs Order Status Matrix

| Payment Status | Order Status | Allowed Actions | Notes |
|----------------|--------------|-----------------|-------|
| UNPAID | PENDING | Edit, Cancel, Pay | Awaiting payment |
| UNPAID | CONFIRMED | Pay, Cancel | Hold stock, needs payment |
| PARTIAL | CONFIRMED | Pay remainder, Cancel | Partial advance |
| PAID | CONFIRMED | Process, Refund | Can proceed |
| PAID | PROCESSING | Fulfill | Normal flow |
| PAID | SHIPPED | Track | In transit |
| PAID | DELIVERED | Complete | Success |
| PAID | COMPLETED | - | Finalized |
| REFUNDED | RETURNED | - | Refund processed |

### Payment Methods (Sri Lanka Context)

| Method | Code | Processing Time | Fees | Notes |
|--------|------|-----------------|------|-------|
| **Cash** | CASH | Immediate | 0% | In-store only |
| **Card** | CARD | 1-2 min | 2-3% | Visa, Mastercard |
| **Bank Transfer** | BANK | 1-2 days | 0-1% | Manual verification |
| **PayHere** | PAYHERE | Immediate | 2.5% | Online gateway |
| **Koko** | KOKO | Immediate | 2% | Digital wallet |
| **FriMi** | FRIMI | Immediate | 2% | Dialog service |
| **eZ Cash** | EZCASH | Immediate | 2% | Mobile payment |
| **mCash** | MCASH | Immediate | 2% | Mobitel service |

### Payment Reference Formats

| Method | Format | Example |
|--------|--------|---------|
| **Card** | CARD-XXXXXX | CARD-123456 |
| **Bank** | BANK-XXXXXX | BANK-789012 |
| **PayHere** | PH-XXXXXXXXXX | PH-1234567890 |
| **Koko** | KOKO-XXXXXX | KOKO-456789 |

### Payment Status Business Rules

| Rule | Description |
|------|-------------|
| **Unpaid Cancel** | Can cancel unpaid orders freely |
| **Partial Cancel** | Requires manager approval |
| **Paid Cancel** | Requires refund processing |
| **Refunded Cancel** | Cannot cancel, already refunded |
| **Partial Shipment** | Can ship if payment >= shipping cost |
| **COD Orders** | Mark paid on delivery confirmation |

### Payment Status Properties

```python
# can_cancel property logic:
@property
def can_cancel(self):
    """Check if order can be cancelled"""
    # Delivered/Completed orders need return flow
    if self.status in [OrderStatus.DELIVERED, OrderStatus.COMPLETED]:
        return False
    
    # Unpaid orders can be cancelled freely
    if self.payment_status == PaymentStatus.UNPAID:
        return True
    
    # Partial/Paid need approval
    return False

# requires_payment property logic:
@property
def requires_payment(self):
    """Check if payment is pending"""
    return self.get_balance_due() > 0
```

### Payment Workflow Examples

```
SCENARIO 1: Full Payment on Order
──────────────────────────────────
1. Customer places order: total = Rs. 10,000
2. Payment received: paid_amount = Rs. 10,000
3. Auto-update: payment_status = PAID
4. Confirm order: status = CONFIRMED
5. Process normally


SCENARIO 2: Partial Payment
──────────────────────────────────
1. Customer places order: total = Rs. 10,000
2. Advance payment: paid_amount = Rs. 5,000
3. Auto-update: payment_status = PARTIAL
4. Hold order until full payment
5. Balance payment: paid_amount = Rs. 10,000
6. Auto-update: payment_status = PAID
7. Confirm and process


SCENARIO 3: Cash on Delivery
──────────────────────────────────
1. Customer places order: total = Rs. 10,000
2. No payment: payment_status = UNPAID
3. Confirm and ship order
4. On delivery: paid_amount = Rs. 10,000
5. Auto-update: payment_status = PAID
6. Complete order


SCENARIO 4: Refund on Return
──────────────────────────────────
1. Customer returns order
2. Process refund: refund_amount = Rs. 10,000
3. Auto-update: payment_status = REFUNDED
4. Update status: status = RETURNED
```

### Payment Status Notifications

| Status Change | Trigger | Recipient | Message |
|---------------|---------|-----------|---------|
| UNPAID → PARTIAL | Partial payment received | Customer | "Payment received. Balance: Rs. X" |
| PARTIAL → PAID | Balance paid | Customer | "Payment complete. Order confirmed." |
| PAID → REFUNDED | Refund processed | Customer | "Refund of Rs. X processed" |
| UNPAID (3 days) | Reminder | Customer | "Payment pending for order #X" |

### Verification Checklist
- [ ] PaymentStatus class created in constants.py
- [ ] Four payment status values defined
- [ ] payment_status field added to Order model
- [ ] payment_method field added
- [ ] payment_reference field added
- [ ] update_payment_status() method implemented
- [ ] can_cancel property implemented
- [ ] requires_payment property implemented
- [ ] Payment status indexed
- [ ] Payment workflow documented

---

## Task 11: Add Order Reference Fields

### Overview
Add reference fields to link orders to related entities such as quotes, POS sessions, parent orders, and external systems. This enables traceability and workflow integration.

### Dependencies
- Task 05: Create Order Model Core Fields

### Instructions

1. **Open order.py model file**
   - Locate Order model after payment fields

2. **Add quote foreign key field**
   - Use ForeignKey to Quote model (if exists)
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='converted_orders'
   - Add help_text about quote conversion

3. **Add pos_session foreign key field**
   - Use ForeignKey to POSSession model (if exists)
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='orders'
   - Add help_text about POS origin

4. **Add parent_order field**
   - Use ForeignKey to self (Order model)
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='child_orders'
   - Add help_text about split/replacement orders

5. **Add external_id field**
   - Use CharField with max_length=100
   - Make it blank=True
   - Add db_index=True
   - Add help_text about integration IDs

6. **Add external_system field**
   - Use CharField with max_length=50
   - Make it blank=True
   - Examples: "WooCommerce", "Shopify", "Odoo"
   - Add help_text about source system

7. **Add external_url field**
   - Use URLField
   - Make it blank=True
   - Link to order in external system
   - Add help_text about integration

8. **Add campaign_code field**
   - Use CharField with max_length=50
   - Make it blank=True
   - Add db_index=True for analytics
   - Add help_text about marketing campaigns

9. **Add affiliate_code field**
   - Use CharField with max_length=50
   - Make it blank=True
   - Add db_index=True
   - Add help_text about affiliate tracking

10. **Add coupon_code field**
    - Use CharField with max_length=50
    - Make it blank=True
    - Applied coupon/promo code
    - Add help_text about discounts

11. **Add is_replacement_order field**
    - Use BooleanField with default=False
    - Indicates if replacing another order
    - Add help_text about replacements

12. **Add is_split_order field**
    - Use BooleanField with default=False
    - Indicates if split from parent
    - Add help_text about partial shipments

### Order Reference Relationships Diagram

```
┌──────────────────────────────────────────────────────────┐
│            ORDER REFERENCE RELATIONSHIPS                  │
└──────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │    Quote    │
    │   (Sales)   │
    └─────────────┘
          │
          │ convert
          ▼
    ┌─────────────┐
    │    Order    │◄─────────┐
    └─────────────┘          │
          │                  │
          ├──────────────────┘
          │     parent       
          │     order        
          │                  
          ├──> Child Order 1 (partial shipment)
          │
          └──> Child Order 2 (replacement)


    ┌─────────────┐          ┌─────────────┐
    │ POS Session │─────────>│    Order    │
    └─────────────┘          └─────────────┘
                                    │
                                    │ external
                                    │ reference
                                    ▼
                             ┌─────────────┐
                             │  External   │
                             │   System    │
                             │ (Shopify)   │
                             └─────────────┘
```

### Reference Field Use Cases

| Field | Use Case | Example |
|-------|----------|---------|
| **quote** | B2B sales flow | Quote #Q-001 → Order #ORD-2026-00001 |
| **pos_session** | Track POS sales | Session #PS-123 contains orders |
| **parent_order** | Split shipments | Order split into 2 child orders |
| **external_id** | Import tracking | Shopify order #5678 |
| **campaign_code** | Marketing ROI | Campaign "NEWYEAR2026" |
| **affiliate_code** | Commission tracking | Affiliate "AFF-123" |
| **coupon_code** | Discount tracking | Coupon "SAVE20" |

### Quote to Order Conversion Flow

```
QUOTE CONVERSION WORKFLOW:

1. Quote Created:
   ┌─────────────┐
   │ Quote #Q001 │
   │ Customer: X │
   │ Total: 10K  │
   └─────────────┘
         │
         │ customer accepts
         ▼
2. Convert to Order:
   ┌─────────────┐
   │ Order #001  │
   │ quote_id: 1 │
   │ source:QUOTE│
   └─────────────┘
         │
         │ copy items
         ▼
3. Link Maintained:
   Order.quote → Quote
   Quote.converted_orders → [Order]
```

### Parent-Child Order Scenarios

```
SCENARIO 1: Split Shipment
──────────────────────────

Parent Order: ORD-2026-00100 (5 items)
   │
   ├─> Child Order 1: ORD-2026-00101 (3 items, Ship now)
   │   └─ parent_order_id: 00100
   │   └─ is_split_order: True
   │
   └─> Child Order 2: ORD-2026-00102 (2 items, Backorder)
       └─ parent_order_id: 00100
       └─ is_split_order: True


SCENARIO 2: Replacement Order
──────────────────────────────

Original Order: ORD-2026-00200 (Damaged)
   │
   └─> Replacement: ORD-2026-00201
       └─ parent_order_id: 00200
       └─ is_replacement_order: True
       └─ shipping_cost: 0 (no charge)
```

### External System Integration

| System | External ID Format | Sync Direction | Notes |
|--------|-------------------|----------------|-------|
| **Shopify** | shopify_12345 | Bi-directional | Real-time sync |
| **WooCommerce** | woo_67890 | Bi-directional | Webhook-based |
| **Odoo** | odoo_SO0123 | Import only | Nightly batch |
| **QuickBooks** | qb_INV-456 | Export only | Accounting sync |
| **Custom API** | custom_XYZ123 | Configurable | Client-specific |

### Campaign & Affiliate Tracking

```
MARKETING ATTRIBUTION:

Campaign Code: "NEWYEAR2026"
   ├─> Track orders from campaign
   ├─> Calculate conversion rate
   ├─> Measure revenue per campaign
   └─> ROI analysis

Affiliate Code: "AFF-PARTNER123"
   ├─> Track referral orders
   ├─> Calculate commission (5% of total)
   ├─> Generate payout reports
   └─> Partner performance metrics

Coupon Code: "SAVE20"
   ├─> Track usage count
   ├─> Measure discount impact
   ├─> Validate coupon rules
   └─> Customer acquisition cost
```

### Reference Field Queries

```python
# Find orders from quote
quote.converted_orders.all()

# Find orders in POS session
pos_session.orders.filter(status=OrderStatus.COMPLETED)

# Find child orders
parent_order.child_orders.all()

# Find split orders
Order.objects.filter(is_split_order=True, parent_order__isnull=False)

# Find replacement orders
Order.objects.filter(is_replacement_order=True)

# Find orders from external system
Order.objects.filter(external_system='Shopify')

# Find orders from campaign
Order.objects.filter(campaign_code='NEWYEAR2026')

# Find orders from affiliate
Order.objects.filter(affiliate_code='AFF-123')

# Find orders with coupon
Order.objects.filter(coupon_code='SAVE20')
```

### Integration Patterns

```
PATTERN 1: Import from External
────────────────────────────────
1. Receive webhook from Shopify
2. Extract order data
3. Create Order with:
   - external_id = shopify order ID
   - external_system = "Shopify"
   - external_url = Shopify order URL
   - source = OrderSource.IMPORT
4. Map line items
5. Save order


PATTERN 2: Quote Conversion
────────────────────────────────
1. User accepts quote
2. Create Order with:
   - quote = Quote instance
   - source = OrderSource.QUOTE
   - Copy customer, items, pricing
3. Mark quote as converted
4. Link bidirectionally


PATTERN 3: Order Splitting
────────────────────────────────
1. Original order has mixed stock
2. Create child order for available items:
   - parent_order = Original
   - is_split_order = True
   - Copy available items
3. Create child order for backorder:
   - parent_order = Original
   - is_split_order = True
   - Copy backordered items
4. Link all orders
```

### Verification Checklist
- [ ] quote ForeignKey added (if Quote model exists)
- [ ] pos_session ForeignKey added (if POSSession exists)
- [ ] parent_order self-FK added
- [ ] external_id CharField added with index
- [ ] external_system CharField added
- [ ] external_url URLField added
- [ ] campaign_code CharField added with index
- [ ] affiliate_code CharField added with index
- [ ] coupon_code CharField added
- [ ] is_replacement_order BooleanField added
- [ ] is_split_order BooleanField added
- [ ] Related names properly set
- [ ] Indexes on external_id, campaign_code, affiliate_code

---

## Task 12: Add Order Metadata Fields

### Overview
Add flexible metadata fields for notes, tags, priority handling, and custom data storage. These fields provide extensibility and support various business workflows.

### Dependencies
- Task 05: Create Order Model Core Fields

### Instructions

1. **Open order.py model file**
   - Locate Order model after reference fields

2. **Add notes field**
   - Use TextField
   - Make it blank=True
   - Customer-visible notes
   - Add help_text about visibility

3. **Add internal_notes field**
   - Use TextField
   - Make it blank=True
   - Staff-only notes
   - Add help_text about internal use

4. **Add admin_notes field**
   - Use TextField
   - Make it blank=True
   - Admin/manager notes
   - Add help_text about management notes

5. **Add tags field**
   - Use JSONField with default=list
   - Store array of tags
   - Add help_text about tagging

6. **Add custom_fields field**
   - Use JSONField with default=dict
   - Store arbitrary key-value data
   - Add help_text about extensibility

7. **Add fulfillment_notes field**
   - Use TextField
   - Make it blank=True
   - Warehouse picking/packing notes
   - Add help_text about fulfillment

8. **Add gift_message field**
   - Use TextField with max_length=500
   - Make it blank=True
   - Gift message for recipient
   - Add help_text about gift orders

9. **Add is_gift field**
   - Use BooleanField with default=False
   - Indicates gift order
   - Add help_text about gift handling

10. **Add requires_insurance field**
    - Use BooleanField with default=False
    - High-value orders need insurance
    - Add help_text about coverage

11. **Add is_urgent field**
    - Use BooleanField with default=False
    - Marks urgent/rush orders
    - Add help_text about priority

12. **Add special_instructions field**
    - Use TextField
    - Make it blank=True
    - Any special handling requirements
    - Add help_text with examples

13. **Add metadata field**
    - Use JSONField with default=dict
    - General-purpose metadata storage
    - Add help_text about usage

14. **Add add_tag method**
    - Add tag to tags array
    - Prevent duplicates
    - Return success boolean

15. **Add remove_tag method**
    - Remove tag from tags array
    - Handle non-existent tags gracefully
    - Return success boolean

16. **Add has_tag method**
    - Check if tag exists
    - Case-insensitive comparison
    - Return boolean

17. **Add get_custom_field method**
    - Retrieve value from custom_fields
    - Return default if not found
    - Type-safe retrieval

18. **Add set_custom_field method**
    - Set value in custom_fields
    - Support nested keys
    - Auto-save option

### Metadata Fields Structure Diagram

```
┌──────────────────────────────────────────────────────────┐
│              ORDER METADATA STRUCTURE                     │
└──────────────────────────────────────────────────────────┘

    Order Model
    │
    ├── NOTES SECTION
    │   ├── notes (TextField)
    │   │   └── "Customer visible notes"
    │   │
    │   ├── internal_notes (TextField)
    │   │   └── "Staff coordination notes"
    │   │
    │   ├── admin_notes (TextField)
    │   │   └── "Management decisions"
    │   │
    │   ├── fulfillment_notes (TextField)
    │   │   └── "Warehouse instructions"
    │   │
    │   └── special_instructions (TextField)
    │       └── "Special handling"
    │
    ├── TAGGING SYSTEM
    │   └── tags (JSONField)
    │       └── ["urgent", "vip", "fragile", "gift"]
    │
    ├── FLAGS
    │   ├── is_gift (Boolean)
    │   ├── requires_insurance (Boolean)
    │   └── is_urgent (Boolean)
    │
    ├── GIFT HANDLING
    │   └── gift_message (TextField)
    │       └── "Happy Birthday! Love, Mom"
    │
    └── FLEXIBLE DATA
        ├── custom_fields (JSONField)
        │   └── {
        │       "preferred_delivery_time": "2-4 PM",
        │       "gift_wrap": true,
        │       "signature_required": true
        │   }
        │
        └── metadata (JSONField)
            └── {
                "source_campaign": "email_blast_001",
                "customer_tier": "gold",
                "referral_source": "google"
            }
```

### Notes Field Hierarchy

| Field | Visibility | Purpose | Who Edits |
|-------|------------|---------|-----------|
| **notes** | Customer | Order details, requests | Customer, Staff |
| **internal_notes** | Staff only | Coordination, issues | Staff |
| **admin_notes** | Managers | Decisions, approvals | Managers |
| **fulfillment_notes** | Warehouse | Pick/pack instructions | Warehouse staff |
| **special_instructions** | All staff | Special handling | Any staff |

### Tagging System

```
COMMON TAGS:

Priority:
- urgent
- rush
- standard
- low-priority

Customer Type:
- vip
- wholesale
- retail
- first-time

Special Handling:
- fragile
- perishable
- hazmat
- oversized

Order Type:
- gift
- replacement
- return
- sample

Status:
- on-hold
- requires-approval
- backordered
- pre-order
```

### Tag Methods Usage

```python
# Add tags
order.add_tag("urgent")
order.add_tag("vip")
order.add_tag("gift")

# Check tags
if order.has_tag("urgent"):
    # Priority handling
    pass

# Remove tags
order.remove_tag("urgent")

# Get all tags
tags = order.tags  # ["vip", "gift"]

# Filter orders by tag
Order.objects.filter(tags__contains=["urgent"])
```

### Custom Fields Examples

```json
EXAMPLE 1: Gift Wrapping
{
  "gift_wrap": true,
  "gift_wrap_style": "premium",
  "gift_card_message": "Happy Birthday!",
  "hide_prices": true
}

EXAMPLE 2: Delivery Preferences
{
  "preferred_delivery_time": "2-4 PM",
  "delivery_window": "weekdays",
  "signature_required": true,
  "leave_at_door": false
}

EXAMPLE 3: Business Rules
{
  "tax_exempt": false,
  "credit_limit_override": true,
  "approval_required": false,
  "auto_invoice": true
}

EXAMPLE 4: Integration Data
{
  "crm_contact_id": "CRM-12345",
  "loyalty_points_used": 500,
  "membership_discount": 10.0,
  "warehouse_location": "A-12-03"
}
```

### Metadata vs Custom Fields

| Field | Purpose | When to Use |
|-------|---------|-------------|
| **custom_fields** | Business logic data | Affects order processing |
| **metadata** | Analytics/tracking | Reporting and analysis |

### Gift Order Workflow

```
GIFT ORDER PROCESSING:

1. Customer selects "This is a gift"
   └─> is_gift = True

2. Customer enters gift message
   └─> gift_message = "Happy Birthday!"

3. System adds tag
   └─> tags.append("gift")

4. Custom fields for preferences
   └─> custom_fields["hide_prices"] = True
   └─> custom_fields["gift_wrap"] = True

5. Packing instructions
   └─> fulfillment_notes = "Gift wrap, no invoice"

6. Delivery note
   └─> Include gift message with package
```

### Urgent Order Handling

```
URGENT ORDER FLAGS:

If is_urgent = True:
  ├─> Set priority = 1 (highest)
  ├─> Add "urgent" tag
  ├─> Notify warehouse immediately
  ├─> Assign to express shipping
  └─> Manager notification

If requires_insurance = True:
  ├─> Add insurance to shipping_cost
  ├─> Require signature on delivery
  ├─> Photo verification
  └─> SMS tracking updates
```

### Special Instructions Examples

| Scenario | Instruction |
|----------|-------------|
| **Access** | "Gate code: 1234, press #2 for apartment" |
| **Timing** | "Deliver only between 9 AM - 12 PM" |
| **Location** | "Leave with building manager, Unit 3A" |
| **Contact** | "Call 077-123-4567 before delivery" |
| **Packaging** | "Double box, mark as fragile" |
| **Assembly** | "Assembly required, customer will arrange" |

### Metadata Schema Examples

```json
ANALYTICS METADATA:
{
  "attribution": {
    "source": "google",
    "medium": "cpc",
    "campaign": "summer_sale",
    "keyword": "pos system"
  },
  "customer": {
    "tier": "gold",
    "lifetime_value": 50000.00,
    "order_count": 15
  },
  "fraud_check": {
    "score": 95,
    "status": "passed",
    "checked_at": "2026-01-23T10:30:00Z"
  }
}

INTEGRATION METADATA:
{
  "external_systems": {
    "shopify_order_id": "12345",
    "quickbooks_invoice_id": "INV-001",
    "crm_deal_id": "DEAL-789"
  },
  "sync_status": {
    "accounting_synced": true,
    "inventory_synced": true,
    "crm_synced": false
  }
}
```

### Query Patterns

```python
# Find urgent orders
Order.objects.filter(is_urgent=True)

# Find gift orders
Order.objects.filter(is_gift=True)

# Find orders with tag
Order.objects.filter(tags__contains=["vip"])

# Find orders needing insurance
Order.objects.filter(requires_insurance=True)

# Find orders with custom field
Order.objects.filter(
    custom_fields__gift_wrap=True
)

# Complex metadata query
Order.objects.filter(
    metadata__customer__tier="gold"
)
```

### Verification Checklist
- [ ] notes TextField added
- [ ] internal_notes TextField added
- [ ] admin_notes TextField added
- [ ] tags JSONField added (list)
- [ ] custom_fields JSONField added (dict)
- [ ] fulfillment_notes TextField added
- [ ] gift_message TextField added
- [ ] is_gift BooleanField added
- [ ] requires_insurance BooleanField added
- [ ] is_urgent BooleanField added
- [ ] special_instructions TextField added
- [ ] metadata JSONField added (dict)
- [ ] add_tag() method implemented
- [ ] remove_tag() method implemented
- [ ] has_tag() method implemented
- [ ] get_custom_field() method implemented
- [ ] set_custom_field() method implemented

---

## End of Document

**Progress:** Tasks 07-12 completed. Order model now includes comprehensive address handling, date tracking, financial calculations, payment status, reference linking, and flexible metadata storage.

**Next Steps:** Continue to [03_Tasks-13-18_Users-Currency-Number-Index-Migration.md](03_Tasks-13-18_Users-Currency-Number-Index-Migration.md) to add user references, currency handling, order number generation, database optimization, and migrations.

---

## Summary of Deliverables

| Task | Deliverable | Key Features |
|------|-------------|--------------|
| 07 | Address fields | Shipping/billing, tracking, JSON storage |
| 08 | Date tracking | Lifecycle timestamps, SLA monitoring |
| 09 | Financial fields | Subtotal, discount, tax, profit tracking |
| 10 | Payment status | UNPAID/PARTIAL/PAID/REFUNDED states |
| 11 | Reference fields | Quote, POS, parent order, external links |
| 12 | Metadata fields | Notes, tags, custom data, gift handling |

### Key Concepts Established

1. **Address flexibility** - JSON storage with Sri Lankan format support
2. **Complete date tracking** - Full lifecycle with SLA monitoring
3. **Precise financials** - Decimal precision for accurate calculations
4. **Payment states** - Independent payment tracking from order status
5. **Traceability** - Links to quotes, POS, external systems
6. **Extensibility** - Tags, custom fields, metadata for flexibility
7. **Gift orders** - Special handling for gift scenarios
8. **Priority flags** - Urgent and insurance flagging

---
