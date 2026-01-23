# Tasks 51-55: Fulfillment Models & Database Schema

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** D - Fulfillment Workflow  
> **Document:** 01 of 03  
> **Tasks Covered:** 51, 52, 53, 54, 55

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Order-Creation-Sources/](../Group-C_Order-Creation-Sources/)
- **→ Next Document:** [02_Tasks-56-61_Fulfillment-Service-Workflow.md](02_Tasks-56-61_Fulfillment-Service-Workflow.md)
- **→ Next Group:** [../Group-E_Returns-Cancellations/](../Group-E_Returns-Cancellations/)

---

## Document Overview

This document covers the creation of Fulfillment and FulfillmentLineItem models that track shipments and deliveries. These models link order line items to physical shipments with tracking information, package details, and delivery confirmations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Fulfillment Model | Medium | 25 min |
| 52 | Add Fulfillment Tracking Fields | Medium | 20 min |
| 53 | Add Fulfillment Package Fields | Medium | 20 min |
| 54 | Create FulfillmentLineItem Model | Medium | 25 min |
| 55 | Run Fulfillment Migrations | Low | 15 min |

---

## Task 51: Create Fulfillment Model

### Overview
Create the Fulfillment model to represent shipments of orders. Each order can have one or multiple fulfillments (for partial shipments). The Fulfillment model tracks the shipment from warehouse to customer.

### Dependencies
- Task 18: Order Model

### Instructions

1. **Create fulfillment model file**
   - Navigate to `apps/orders/models/` directory
   - Create `fulfillment.py` file
   - This file will contain Fulfillment and related models

2. **Import required dependencies**
   - Import Django model classes
   - Import UUID for primary key
   - Import DecimalField, JSONField
   - Import timezone utilities
   - Import Order model
   - Import User model

3. **Define Fulfillment model class**
   - Create class `Fulfillment` inheriting from `models.Model`
   - Add comprehensive docstring explaining shipment tracking

4. **Add identification fields**
   - id: UUIDField, primary key, default=uuid.uuid4
   - order: ForeignKey to Order, related_name='fulfillments', on_delete=CASCADE
   - fulfillment_number: CharField, max 50 chars, unique, indexed
   - status: CharField with choices (see below)

5. **Add timestamp fields**
   - created_at: DateTimeField, auto_now_add=True
   - updated_at: DateTimeField, auto_now=True
   - created_by: ForeignKey to User, null=True, SET_NULL
   - updated_by: ForeignKey to User, null=True, SET_NULL

6. **Add location fields**
   - warehouse: ForeignKey to Location (if Location model exists)
   - shipping_address: JSONField for full address
   - delivery_location: TextField for specific delivery point

7. **Add notes field**
   - notes: TextField, blank=True
   - internal_notes: TextField, blank=True (not shown to customer)
   - customer_notes: TextField, blank=True (visible to customer)

8. **Define status choices**
   - PENDING: Awaiting fulfillment
   - PICKING: Items being picked
   - PICKED: All items picked
   - PACKING: Items being packed
   - PACKED: Ready to ship
   - SHIPPED: In transit
   - OUT_FOR_DELIVERY: Out for delivery
   - DELIVERED: Successfully delivered
   - FAILED: Delivery failed
   - CANCELLED: Fulfillment cancelled

9. **Add fulfillment number generation method**
   - Create method `generate_fulfillment_number()`
   - Format: `FUL-{ORDER_NUMBER}-{SEQUENCE}`
   - Example: FUL-ORD-2026-00123-01
   - Called on save if fulfillment_number is empty

10. **Add model methods**
    - `__str__()`: Return fulfillment_number
    - `get_total_quantity()`: Sum of all line item quantities
    - `get_fulfillment_percentage()`: Percentage of order fulfilled
    - `can_cancel()`: Check if fulfillment can be cancelled

11. **Add Meta class**
    - ordering: ['-created_at']
    - indexes: order, fulfillment_number, status
    - verbose_name: 'Fulfillment'
    - verbose_name_plural: 'Fulfillments'
    - unique_together: None needed (fulfillment_number is unique)

### Fulfillment Model Structure

```
Fulfillment Model:
─────────────────────────────────────────────────────
Identification:
- id: UUID (PK)
- order: FK to Order
- fulfillment_number: CharField (unique)
- status: Choice field

Timestamps:
- created_at: DateTimeField (auto)
- updated_at: DateTimeField (auto)
- created_by: FK to User
- updated_by: FK to User

Location:
- warehouse: FK to Location
- shipping_address: JSONField
- delivery_location: TextField

Notes:
- notes: TextField
- internal_notes: TextField
- customer_notes: TextField

[Tracking fields added in Task 52]
[Package fields added in Task 53]
```

### Status Flow Diagram

```
PENDING (Created, awaiting action)
    │
    ▼
PICKING (Warehouse picking items)
    │
    ▼
PICKED (All items picked from shelves)
    │
    ▼
PACKING (Items being packed)
    │
    ▼
PACKED (Ready to ship, labeled)
    │
    ▼
SHIPPED (Carrier picked up, in transit)
    │
    ├─→ OUT_FOR_DELIVERY (Near destination)
    │       │
    │       ├─→ DELIVERED (Successfully delivered)
    │       │
    │       └─→ FAILED (Delivery failed, retry needed)
    │
    └─→ CANCELLED (Fulfillment cancelled)
```

### Fulfillment Number Format

```
Format: FUL-{ORDER_NUMBER}-{SEQUENCE}

Examples:
- FUL-ORD-2026-00123-01  (First fulfillment)
- FUL-ORD-2026-00123-02  (Second fulfillment, partial)
- FUL-ORD-2026-00456-01

Generation Logic:
1. Extract order number from order
2. Query fulfillments for same order
3. Count existing fulfillments
4. Sequence = count + 1
5. Format string
```

### Shipping Address Structure

```json
{
  "recipient_name": "John Doe",
  "company_name": "ABC Company",
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Colombo",
  "province": "Western Province",
  "postal_code": "00100",
  "country": "LK",
  "phone": "+94771234567",
  "email": "john@example.com",
  "delivery_instructions": "Ring doorbell twice"
}
```

### Model Method Examples

```python
class Fulfillment(models.Model):
    # ... fields ...
    
    def generate_fulfillment_number(self):
        """Generate unique fulfillment number."""
        order_number = self.order.order_number
        
        # Count existing fulfillments for this order
        existing_count = Fulfillment.objects.filter(
            order=self.order
        ).count()
        
        sequence = existing_count + 1
        return f"FUL-{order_number}-{sequence:02d}"
    
    def save(self, *args, **kwargs):
        """Generate fulfillment number on first save."""
        if not self.fulfillment_number:
            self.fulfillment_number = self.generate_fulfillment_number()
        super().save(*args, **kwargs)
    
    def get_total_quantity(self):
        """Get total quantity of items in this fulfillment."""
        return self.line_items.aggregate(
            total=Sum('quantity')
        )['total'] or 0
    
    def get_fulfillment_percentage(self):
        """Calculate what percentage of order this fulfills."""
        order_total = self.order.line_items.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        if order_total == 0:
            return 0
        
        fulfillment_total = self.get_total_quantity()
        return (fulfillment_total / order_total) * 100
    
    def can_cancel(self):
        """Check if fulfillment can be cancelled."""
        # Can cancel if not yet shipped
        return self.status in ['PENDING', 'PICKING', 'PICKED', 'PACKING', 'PACKED']
    
    def __str__(self):
        return self.fulfillment_number
```

### Use Cases

**Single Fulfillment (Complete Order):**
```
Order: 10 items total
Fulfillment 1:
  - FUL-ORD-2026-00123-01
  - All 10 items
  - Status: SHIPPED
  - Percentage: 100%
```

**Multiple Fulfillments (Partial Shipments):**
```
Order: 10 items total

Fulfillment 1:
  - FUL-ORD-2026-00123-01
  - 6 items
  - Status: DELIVERED
  - Percentage: 60%

Fulfillment 2:
  - FUL-ORD-2026-00123-02
  - 4 items
  - Status: PENDING
  - Percentage: 40%

Total fulfilled: 100% (when both delivered)
```

### Expected Outcomes
- Fulfillment model created
- Status choices defined
- Fulfillment number generation implemented
- Relationship with Order established
- Model methods functional

---

## Task 52: Add Fulfillment Tracking Fields

### Overview
Add shipping carrier and tracking information fields to the Fulfillment model. These fields enable customers to track their shipments in real-time.

### Dependencies
- Task 51: Fulfillment Model

### Instructions

1. **Open fulfillment model file**
   - Navigate to `apps/orders/models/fulfillment.py`
   - Locate Fulfillment model class

2. **Add carrier information field**
   - carrier: CharField, max 100 chars, blank=True
   - Examples: "DHL", "Sri Lanka Post", "FedEx", "Aramex"
   - carrier_service: CharField, max 100 chars, blank=True
   - Examples: "Express", "Standard", "Overnight"

3. **Add tracking fields**
   - tracking_number: CharField, max 100 chars, blank=True, indexed
   - tracking_url: URLField, blank=True
   - tracking_url auto-generated based on carrier

4. **Add shipment timing fields**
   - shipped_at: DateTimeField, null=True, blank=True
   - estimated_delivery_date: DateField, null=True, blank=True
   - delivered_at: DateTimeField, null=True, blank=True
   - delivery_attempts: IntegerField, default=0

5. **Add delivery confirmation fields**
   - delivered_by: CharField, max 100 chars, blank=True (courier name)
   - received_by: CharField, max 100 chars, blank=True (recipient name)
   - delivery_signature: ImageField or URLField, blank=True
   - delivery_photo: ImageField or URLField, blank=True

6. **Add delivery status fields**
   - delivery_status: CharField with choices (see below)
   - delivery_failure_reason: TextField, blank=True
   - last_tracking_update: DateTimeField, null=True

7. **Define delivery status choices**
   - PENDING: Not yet dispatched
   - IN_TRANSIT: On the way
   - OUT_FOR_DELIVERY: Out for delivery today
   - DELIVERED: Successfully delivered
   - FAILED: Delivery attempt failed
   - RETURNED: Returned to sender
   - HELD: Held at facility for pickup

8. **Add tracking URL generation method**
   - Create method `get_tracking_url()`
   - Based on carrier, generate tracking URL
   - Support major carriers with URL patterns

9. **Add delivery time calculation**
   - Create method `get_transit_time()`
   - Calculate hours/days between shipped and delivered
   - Return timedelta or None

10. **Add tracking update method**
    - Create method `update_tracking_status(status, location, timestamp)`
    - Updates last_tracking_update
    - Can be called by webhook or API integration

### Tracking Fields Structure

```
Fulfillment Model (continued):
─────────────────────────────────────────────────────
Carrier Information:
- carrier: CharField (DHL, FedEx, etc.)
- carrier_service: CharField (Express, Standard)

Tracking:
- tracking_number: CharField (indexed)
- tracking_url: URLField
- last_tracking_update: DateTimeField

Timing:
- shipped_at: DateTimeField
- estimated_delivery_date: DateField
- delivered_at: DateTimeField
- delivery_attempts: IntegerField

Delivery Confirmation:
- delivered_by: CharField (courier name)
- received_by: CharField (recipient)
- delivery_signature: ImageField/URLField
- delivery_photo: ImageField/URLField

Status:
- delivery_status: Choice field
- delivery_failure_reason: TextField
```

### Carrier Tracking URL Patterns

```python
CARRIER_TRACKING_URLS = {
    'DHL': 'https://www.dhl.com/en/express/tracking.html?AWB={tracking}&brand=DHL',
    'FedEx': 'https://www.fedex.com/fedextrack/?trknbr={tracking}',
    'UPS': 'https://www.ups.com/track?tracknum={tracking}',
    'USPS': 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking}',
    'Aramex': 'https://www.aramex.com/us/en/track/shipments?ShipmentNumber={tracking}',
    'Sri Lanka Post': 'https://www.slpost.gov.lk/track-trace?tracking={tracking}',
}

def get_tracking_url(self):
    """Generate tracking URL based on carrier."""
    if not self.tracking_number or not self.carrier:
        return ''
    
    carrier_pattern = CARRIER_TRACKING_URLS.get(self.carrier)
    if carrier_pattern:
        return carrier_pattern.format(tracking=self.tracking_number)
    
    return self.tracking_url or ''
```

### Delivery Status Flow

```
PENDING (Created, not shipped)
    │
    ▼
IN_TRANSIT (Shipped, on the way)
    │
    ├─→ OUT_FOR_DELIVERY (Local delivery)
    │       │
    │       ├─→ DELIVERED (Success)
    │       │
    │       └─→ FAILED (Delivery attempt failed)
    │               │
    │               ├─→ OUT_FOR_DELIVERY (Retry)
    │               │
    │               └─→ HELD (Facility pickup)
    │
    └─→ RETURNED (RTS - Return to sender)
```

### Tracking Update Structure

```python
def update_tracking_status(self, status, location=None, timestamp=None):
    """Update tracking status from carrier webhook/API."""
    self.delivery_status = status
    self.last_tracking_update = timestamp or timezone.now()
    
    if status == 'DELIVERED':
        self.delivered_at = timestamp or timezone.now()
        self.status = 'DELIVERED'
    
    elif status == 'OUT_FOR_DELIVERY':
        self.status = 'OUT_FOR_DELIVERY'
    
    elif status == 'FAILED':
        self.delivery_attempts += 1
    
    self.save()
    
    # Create tracking history entry
    TrackingHistory.objects.create(
        fulfillment=self,
        status=status,
        location=location,
        timestamp=timestamp or timezone.now()
    )
```

### Transit Time Calculation

```python
def get_transit_time(self):
    """Calculate time between shipped and delivered."""
    if not self.shipped_at or not self.delivered_at:
        return None
    
    delta = self.delivered_at - self.shipped_at
    return delta

def get_transit_time_display(self):
    """Human-readable transit time."""
    transit = self.get_transit_time()
    if not transit:
        return "N/A"
    
    days = transit.days
    hours = transit.seconds // 3600
    
    if days > 0:
        return f"{days} day{'s' if days > 1 else ''}"
    else:
        return f"{hours} hour{'s' if hours > 1 else ''}"
```

### Example Usage

```python
# Create fulfillment with tracking
fulfillment = Fulfillment.objects.create(
    order=order,
    carrier='DHL',
    carrier_service='Express',
    tracking_number='1234567890',
    shipped_at=timezone.now(),
    estimated_delivery_date=timezone.now().date() + timedelta(days=2)
)

# Auto-generate tracking URL
tracking_url = fulfillment.get_tracking_url()
# Returns: https://www.dhl.com/en/express/tracking.html?AWB=1234567890&brand=DHL

# Update via webhook
fulfillment.update_tracking_status(
    status='OUT_FOR_DELIVERY',
    location='Colombo Central Sorting Facility',
    timestamp=timezone.now()
)

# Confirm delivery
fulfillment.update_tracking_status(
    status='DELIVERED',
    location='Customer Address'
)
fulfillment.received_by = 'John Doe'
fulfillment.delivered_by = 'Courier #123'
fulfillment.save()

# Calculate transit time
transit = fulfillment.get_transit_time_display()
# Returns: "2 days"
```

### Expected Outcomes
- Tracking fields added to model
- Carrier information stored
- Tracking URL generation working
- Delivery status tracking implemented
- Transit time calculation functional

---

## Task 53: Add Fulfillment Package Fields

### Overview
Add physical package information fields to track package dimensions, weight, and other shipping details. This information is essential for carrier integration and shipping cost calculation.

### Dependencies
- Task 52: Fulfillment Tracking Fields

### Instructions

1. **Open fulfillment model file**
   - Locate Fulfillment model class
   - Add package-related fields

2. **Add package count field**
   - number_of_packages: PositiveIntegerField, default=1
   - Tracks how many boxes/packages in this shipment

3. **Add weight fields**
   - package_weight: DecimalField, max_digits=10, decimal_places=2, null=True
   - weight_unit: CharField with choices ('KG', 'LB', 'G'), default='KG'
   - Total weight of all packages

4. **Add dimension fields**
   - package_dimensions: JSONField, default=dict
   - Structure: {"length": 30, "width": 20, "height": 15, "unit": "CM"}
   - If multiple packages, array of dimension objects

5. **Add package type field**
   - package_type: CharField with choices (see below)
   - Examples: BOX, ENVELOPE, PALLET, TUBE

6. **Add shipping cost fields**
   - shipping_cost: DecimalField, max_digits=10, decimal_places=2, default=0
   - insurance_cost: DecimalField, max_digits=10, decimal_places=2, default=0
   - total_shipping_cost: Calculated field (shipping + insurance)

7. **Add special handling fields**
   - requires_signature: BooleanField, default=False
   - is_fragile: BooleanField, default=False
   - is_hazardous: BooleanField, default=False
   - special_instructions: TextField, blank=True

8. **Add customs fields (for international)**
   - is_international: BooleanField, default=False
   - customs_value: DecimalField, null=True
   - customs_description: TextField, blank=True
   - customs_documents: JSONField, default=list

9. **Define package type choices**
   - BOX: Cardboard box
   - ENVELOPE: Document envelope
   - PALLET: Pallet shipment
   - TUBE: Tube/cylinder
   - CUSTOM: Custom packaging

10. **Add validation methods**
    - `validate_dimensions()`: Ensure dimensions are reasonable
    - `calculate_volumetric_weight()`: For carriers using volumetric weight
    - `get_total_shipping_cost()`: Sum of shipping + insurance

### Package Fields Structure

```
Fulfillment Model (continued):
─────────────────────────────────────────────────────
Package Count:
- number_of_packages: PositiveIntegerField

Weight:
- package_weight: DecimalField
- weight_unit: Choice (KG, LB, G)

Dimensions:
- package_dimensions: JSONField
  {
    "length": 30,
    "width": 20,
    "height": 15,
    "unit": "CM"
  }

Package Type:
- package_type: Choice (BOX, ENVELOPE, etc.)

Shipping Cost:
- shipping_cost: DecimalField
- insurance_cost: DecimalField

Special Handling:
- requires_signature: BooleanField
- is_fragile: BooleanField
- is_hazardous: BooleanField
- special_instructions: TextField

Customs (International):
- is_international: BooleanField
- customs_value: DecimalField
- customs_description: TextField
- customs_documents: JSONField
```

### Dimension JSON Structures

**Single Package:**
```json
{
  "length": 30,
  "width": 20,
  "height": 15,
  "unit": "CM"
}
```

**Multiple Packages:**
```json
[
  {
    "package_number": 1,
    "length": 30,
    "width": 20,
    "height": 15,
    "unit": "CM",
    "weight": 2.5
  },
  {
    "package_number": 2,
    "length": 40,
    "width": 30,
    "height": 20,
    "unit": "CM",
    "weight": 5.0
  }
]
```

### Volumetric Weight Calculation

```python
def calculate_volumetric_weight(self, divisor=5000):
    """
    Calculate volumetric weight for carriers.
    
    Formula: (Length × Width × Height) / Divisor
    Common divisors:
    - Domestic: 5000 (cm³/kg)
    - International: 6000 (cm³/kg)
    """
    if not self.package_dimensions:
        return None
    
    dims = self.package_dimensions
    
    # Single package
    if isinstance(dims, dict):
        length = dims.get('length', 0)
        width = dims.get('width', 0)
        height = dims.get('height', 0)
        unit = dims.get('unit', 'CM')
        
        # Convert to CM if needed
        if unit == 'M':
            length *= 100
            width *= 100
            height *= 100
        
        volumetric_weight = (length * width * height) / divisor
        return round(volumetric_weight, 2)
    
    # Multiple packages
    elif isinstance(dims, list):
        total_volumetric = 0
        for package in dims:
            length = package.get('length', 0)
            width = package.get('width', 0)
            height = package.get('height', 0)
            total_volumetric += (length * width * height) / divisor
        return round(total_volumetric, 2)
    
    return None

def get_chargeable_weight(self):
    """Get the higher of actual or volumetric weight."""
    actual_weight = self.package_weight or 0
    volumetric_weight = self.calculate_volumetric_weight() or 0
    return max(actual_weight, volumetric_weight)
```

### Shipping Cost Calculation

```python
def get_total_shipping_cost(self):
    """Calculate total shipping cost including insurance."""
    return (self.shipping_cost or 0) + (self.insurance_cost or 0)

def calculate_shipping_cost(self):
    """
    Calculate shipping cost based on weight, dimensions, carrier.
    This would integrate with carrier APIs in production.
    """
    chargeable_weight = self.get_chargeable_weight()
    
    # Base rate by carrier
    base_rates = {
        'DHL': Decimal('500.00'),
        'FedEx': Decimal('450.00'),
        'Sri Lanka Post': Decimal('200.00'),
    }
    
    base_rate = base_rates.get(self.carrier, Decimal('400.00'))
    
    # Per kg rate
    per_kg_rate = Decimal('50.00')
    
    # Calculate
    cost = base_rate + (Decimal(str(chargeable_weight)) * per_kg_rate)
    
    # Add surcharges
    if self.is_fragile:
        cost += Decimal('100.00')
    
    if self.requires_signature:
        cost += Decimal('50.00')
    
    if self.is_international:
        cost *= Decimal('1.5')  # 50% surcharge
    
    return cost
```

### Customs Information

```json
{
  "is_international": true,
  "customs_value": "25000.00",
  "customs_description": "Electronic components",
  "customs_documents": [
    {
      "type": "COMMERCIAL_INVOICE",
      "document_number": "INV-2026-001",
      "url": "https://storage.example.com/customs/inv-001.pdf"
    },
    {
      "type": "PACKING_LIST",
      "document_number": "PKG-2026-001",
      "url": "https://storage.example.com/customs/pkg-001.pdf"
    }
  ]
}
```

### Validation Examples

```python
def validate_dimensions(self):
    """Validate package dimensions are reasonable."""
    if not self.package_dimensions:
        return True
    
    dims = self.package_dimensions
    
    if isinstance(dims, dict):
        length = dims.get('length', 0)
        width = dims.get('width', 0)
        height = dims.get('height', 0)
        
        # Check max dimensions (e.g., 200cm max per side)
        if any(d > 200 for d in [length, width, height]):
            raise ValidationError("Package dimension exceeds maximum (200cm)")
        
        # Check min dimensions
        if any(d <= 0 for d in [length, width, height]):
            raise ValidationError("Package dimensions must be positive")
    
    return True

def clean(self):
    """Model-level validation."""
    super().clean()
    self.validate_dimensions()
    
    # Validate weight
    if self.package_weight and self.package_weight <= 0:
        raise ValidationError("Package weight must be positive")
    
    # Validate customs for international
    if self.is_international and not self.customs_value:
        raise ValidationError("Customs value required for international shipments")
```

### Package Label Data

```python
def get_label_data(self):
    """Get data for printing shipping label."""
    return {
        'fulfillment_number': self.fulfillment_number,
        'tracking_number': self.tracking_number,
        'carrier': self.carrier,
        'carrier_service': self.carrier_service,
        'from_address': self.warehouse.address if self.warehouse else {},
        'to_address': self.shipping_address,
        'weight': f"{self.package_weight} {self.weight_unit}",
        'dimensions': self.package_dimensions,
        'requires_signature': self.requires_signature,
        'is_fragile': self.is_fragile,
        'special_instructions': self.special_instructions,
        'order_number': self.order.order_number,
    }
```

### Expected Outcomes
- Package fields added to model
- Weight and dimension tracking implemented
- Volumetric weight calculation working
- Shipping cost calculation functional
- Customs support for international shipments
- Validation methods implemented

---

## Task 54: Create FulfillmentLineItem Model

### Overview
Create the FulfillmentLineItem model to link specific order line items to fulfillments. This enables partial fulfillments where different items are shipped at different times.

### Dependencies
- Task 51: Fulfillment Model
- Task 25: OrderLineItem Model

### Instructions

1. **Add to fulfillment model file**
   - Open `apps/orders/models/fulfillment.py`
   - Add FulfillmentLineItem class below Fulfillment class

2. **Import additional dependencies**
   - Import OrderLineItem model
   - Import Sum aggregate for quantity calculations

3. **Define FulfillmentLineItem model class**
   - Create class `FulfillmentLineItem` inheriting from `models.Model`
   - Add docstring explaining line item tracking

4. **Add relationship fields**
   - id: UUIDField, primary key, default=uuid.uuid4
   - fulfillment: ForeignKey to Fulfillment, related_name='line_items', on_delete=CASCADE
   - order_line_item: ForeignKey to OrderLineItem, related_name='fulfillments', on_delete=CASCADE
   - quantity: DecimalField, max_digits=10, decimal_places=2
   - Must be <= order_line_item.quantity

5. **Add warehouse fields**
   - picked_from_location: ForeignKey to Location, null=True
   - bin_location: CharField, max 50 chars (e.g., "A-12-03")
   - serial_numbers: JSONField for serialized items, default=list
   - batch_numbers: JSONField for batched items, default=list

6. **Add workflow timestamp fields**
   - picked_at: DateTimeField, null=True, blank=True
   - picked_by: ForeignKey to User, null=True, related_name='picked_items'
   - packed_at: DateTimeField, null=True, blank=True
   - packed_by: ForeignKey to User, null=True, related_name='packed_items'

7. **Add quality control fields**
   - inspected: BooleanField, default=False
   - inspected_at: DateTimeField, null=True
   - inspected_by: ForeignKey to User, null=True
   - inspection_notes: TextField, blank=True

8. **Add item condition field**
   - condition: CharField with choices (NEW, REFURBISHED, DAMAGED)
   - damage_notes: TextField, blank=True

9. **Add constraints**
   - Create unique_together constraint: (fulfillment, order_line_item)
   - One fulfillment line item per order line item per fulfillment
   - Same order line item can appear in multiple fulfillments (partial)

10. **Add model methods**
    - `__str__()`: Return descriptive string
    - `get_product()`: Shortcut to order_line_item.product
    - `is_fully_fulfilled()`: Check if line item completely fulfilled
    - `get_remaining_quantity()`: Calculate unfulfilled quantity

11. **Add validation methods**
    - `clean()`: Validate quantity <= order line item quantity
    - Check that total fulfilled across all fulfillments <= order quantity

12. **Add Meta class**
    - ordering: ['order_line_item']
    - verbose_name: 'Fulfillment Line Item'
    - verbose_name_plural: 'Fulfillment Line Items'

### FulfillmentLineItem Model Structure

```
FulfillmentLineItem Model:
─────────────────────────────────────────────────────
Relationships:
- id: UUID (PK)
- fulfillment: FK to Fulfillment
- order_line_item: FK to OrderLineItem
- quantity: DecimalField (must be <= order quantity)

Warehouse:
- picked_from_location: FK to Location
- bin_location: CharField
- serial_numbers: JSONField (for serialized items)
- batch_numbers: JSONField (for batched items)

Workflow Timestamps:
- picked_at: DateTimeField
- picked_by: FK to User
- packed_at: DateTimeField
- packed_by: FK to User

Quality Control:
- inspected: BooleanField
- inspected_at: DateTimeField
- inspected_by: FK to User
- inspection_notes: TextField

Condition:
- condition: Choice (NEW, REFURBISHED, DAMAGED)
- damage_notes: TextField

Constraints:
- unique_together: (fulfillment, order_line_item)
```

### Fulfillment Relationships Diagram

```
Order
  │
  ├─ OrderLineItem 1 (10 units)
  │    │
  │    ├─ FulfillmentLineItem 1 (6 units) → Fulfillment 1
  │    │
  │    └─ FulfillmentLineItem 2 (4 units) → Fulfillment 2
  │
  └─ OrderLineItem 2 (5 units)
       │
       └─ FulfillmentLineItem 3 (5 units) → Fulfillment 1

Result:
- Fulfillment 1: 6 units (Item 1) + 5 units (Item 2) = 11 units
- Fulfillment 2: 4 units (Item 1) = 4 units
```

### Serial/Batch Number Structure

```json
{
  "serial_numbers": ["SN-12345", "SN-12346", "SN-12347"],
  "batch_numbers": ["BATCH-2026-001", "BATCH-2026-002"],
  "batch_details": [
    {
      "batch_number": "BATCH-2026-001",
      "quantity": 50,
      "manufacture_date": "2026-01-01",
      "expiry_date": "2027-01-01"
    }
  ]
}
```

### Quantity Validation

```python
class FulfillmentLineItem(models.Model):
    # ... fields ...
    
    def clean(self):
        """Validate fulfillment quantity."""
        super().clean()
        
        # Check quantity is positive
        if self.quantity <= 0:
            raise ValidationError("Fulfillment quantity must be positive")
        
        # Check quantity doesn't exceed order line item quantity
        if self.quantity > self.order_line_item.quantity:
            raise ValidationError(
                f"Fulfillment quantity ({self.quantity}) exceeds "
                f"order quantity ({self.order_line_item.quantity})"
            )
        
        # Check total fulfilled doesn't exceed order quantity
        if self.pk:
            # Updating existing
            existing_total = FulfillmentLineItem.objects.filter(
                order_line_item=self.order_line_item
            ).exclude(pk=self.pk).aggregate(
                total=Sum('quantity')
            )['total'] or 0
        else:
            # Creating new
            existing_total = FulfillmentLineItem.objects.filter(
                order_line_item=self.order_line_item
            ).aggregate(
                total=Sum('quantity')
            )['total'] or 0
        
        total_after = existing_total + self.quantity
        
        if total_after > self.order_line_item.quantity:
            raise ValidationError(
                f"Total fulfilled quantity ({total_after}) would exceed "
                f"order quantity ({self.order_line_item.quantity})"
            )
    
    def get_product(self):
        """Shortcut to get product."""
        return self.order_line_item.product
    
    def is_fully_fulfilled(self):
        """Check if this line item is completely fulfilled."""
        total_fulfilled = FulfillmentLineItem.objects.filter(
            order_line_item=self.order_line_item
        ).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        return total_fulfilled >= self.order_line_item.quantity
    
    def get_remaining_quantity(self):
        """Get unfulfilled quantity for this line item."""
        total_fulfilled = FulfillmentLineItem.objects.filter(
            order_line_item=self.order_line_item
        ).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        return self.order_line_item.quantity - total_fulfilled
    
    def __str__(self):
        return (
            f"{self.fulfillment.fulfillment_number} - "
            f"{self.get_product().name} - "
            f"{self.quantity} units"
        )
```

### Picking and Packing Workflow

```python
def mark_as_picked(self, user, location=None):
    """Mark line item as picked."""
    self.picked_at = timezone.now()
    self.picked_by = user
    if location:
        self.picked_from_location = location
    self.save()
    
    # Check if all items in fulfillment are picked
    all_picked = not self.fulfillment.line_items.filter(
        picked_at__isnull=True
    ).exists()
    
    if all_picked:
        self.fulfillment.status = 'PICKED'
        self.fulfillment.save()

def mark_as_packed(self, user):
    """Mark line item as packed."""
    self.packed_at = timezone.now()
    self.packed_by = user
    self.save()
    
    # Check if all items in fulfillment are packed
    all_packed = not self.fulfillment.line_items.filter(
        packed_at__isnull=True
    ).exists()
    
    if all_packed:
        self.fulfillment.status = 'PACKED'
        self.fulfillment.save()

def mark_as_inspected(self, user, notes=''):
    """Mark line item as quality inspected."""
    self.inspected = True
    self.inspected_at = timezone.now()
    self.inspected_by = user
    self.inspection_notes = notes
    self.save()
```

### Query Examples

```python
# Get all fulfillments for an order line item
fulfillments = FulfillmentLineItem.objects.filter(
    order_line_item=line_item
).select_related('fulfillment')

# Get all line items for a fulfillment
line_items = FulfillmentLineItem.objects.filter(
    fulfillment=fulfillment
).select_related('order_line_item__product')

# Check if line item is fully fulfilled
total = FulfillmentLineItem.objects.filter(
    order_line_item=line_item
).aggregate(Sum('quantity'))['quantity__sum'] or 0
is_complete = total >= line_item.quantity

# Get unfulfilled line items for an order
unfulfilled = OrderLineItem.objects.filter(
    order=order
).annotate(
    fulfilled_qty=Sum('fulfillments__quantity')
).filter(
    Q(fulfilled_qty__lt=F('quantity')) | Q(fulfilled_qty__isnull=True)
)
```

### Expected Outcomes
- FulfillmentLineItem model created
- Relationship with Fulfillment and OrderLineItem established
- Quantity validation implemented
- Picking and packing tracking functional
- Serial/batch number support added
- Partial fulfillment logic working

---

## Task 55: Run Fulfillment Migrations

### Overview
Create and run Django migrations to apply all fulfillment-related database changes. This includes Fulfillment and FulfillmentLineItem models with all their fields.

### Dependencies
- Task 51: Fulfillment Model
- Task 52: Tracking Fields
- Task 53: Package Fields
- Task 54: FulfillmentLineItem Model

### Instructions

1. **Review all model changes**
   - Fulfillment model (new)
   - FulfillmentLineItem model (new)
   - All fields from Tasks 51-54

2. **Create migration file**
   - Run command: `python manage.py makemigrations orders`
   - This creates migration file 0004_fulfillment.py
   - Review generated migration

3. **Verify migration contents**
   - Check Fulfillment table creation
   - Check FulfillmentLineItem table creation
   - Check all fields are included
   - Check foreign keys are correct
   - Check indexes are created
   - Check constraints (unique_together)

4. **Add custom indexes for performance**
   - Index on fulfillment_number
   - Index on tracking_number
   - Index on (order, status)
   - Index on (fulfillment, order_line_item)

5. **Test migration plan**
   - Run: `python manage.py migrate orders --plan`
   - Review planned operations
   - Ensure no conflicts

6. **Apply migration**
   - Run: `python manage.py migrate orders`
   - Monitor for errors
   - Verify completion

7. **Verify database schema**
   - Check tables: orders_fulfillment, orders_fulfillmentlineitem
   - Verify all fields exist
   - Check indexes created
   - Test foreign key relationships

8. **Export models**
   - Update `apps/orders/models/__init__.py`
   - Import Fulfillment and FulfillmentLineItem
   - Add to __all__ list

9. **Test model imports**
   - Django shell: import models
   - Create test instances
   - Verify relationships work

10. **Document migration**
    - Update CHANGELOG
    - Note any manual steps
    - Document new indexes

### Migration File Preview

```python
# migrations/0004_fulfillment.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_history_settings'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Create Fulfillment model
        migrations.CreateModel(
            name='Fulfillment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('fulfillment_number', models.CharField(max_length=50, unique=True)),
                ('status', models.CharField(choices=[...], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                # ... all fields from Tasks 51-53
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fulfillments', to='orders.order')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Fulfillment',
                'verbose_name_plural': 'Fulfillments',
                'ordering': ['-created_at'],
            },
        ),
        
        # Create FulfillmentLineItem model
        migrations.CreateModel(
            name='FulfillmentLineItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('picked_at', models.DateTimeField(blank=True, null=True)),
                ('packed_at', models.DateTimeField(blank=True, null=True)),
                # ... all fields from Task 54
                ('fulfillment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='line_items', to='orders.fulfillment')),
                ('order_line_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fulfillments', to='orders.orderlineitem')),
            ],
            options={
                'verbose_name': 'Fulfillment Line Item',
                'verbose_name_plural': 'Fulfillment Line Items',
                'unique_together': {('fulfillment', 'order_line_item')},
            },
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='fulfillment',
            index=models.Index(fields=['fulfillment_number'], name='fulfillment_number_idx'),
        ),
        migrations.AddIndex(
            model_name='fulfillment',
            index=models.Index(fields=['tracking_number'], name='tracking_number_idx'),
        ),
        migrations.AddIndex(
            model_name='fulfillment',
            index=models.Index(fields=['order', 'status'], name='fulfillment_order_status_idx'),
        ),
    ]
```

### Verification Commands

```bash
# 1. Create migration
python manage.py makemigrations orders

# 2. Show migration SQL (optional)
python manage.py sqlmigrate orders 0004

# 3. Check migration plan
python manage.py migrate orders --plan

# 4. Apply migration
python manage.py migrate orders

# 5. Verify in Django shell
python manage.py shell

>>> from apps.orders.models import Fulfillment, FulfillmentLineItem
>>> Fulfillment.objects.count()
0
>>> FulfillmentLineItem.objects.count()
0

# 6. Create test instance
>>> from apps.orders.models import Order
>>> order = Order.objects.first()
>>> fulfillment = Fulfillment.objects.create(
...     order=order,
...     carrier='DHL',
...     status='PENDING'
... )
>>> fulfillment.fulfillment_number
'FUL-ORD-2026-00123-01'

# 7. Check database schema
python manage.py dbshell

\d orders_fulfillment
\d orders_fulfillmentlineitem
```

### Post-Migration Testing

```python
# Test complete fulfillment workflow
from apps.orders.models import Order, Fulfillment, FulfillmentLineItem

# Get test order
order = Order.objects.first()

# Create fulfillment
fulfillment = Fulfillment.objects.create(
    order=order,
    carrier='DHL',
    carrier_service='Express',
    tracking_number='TEST123',
    status='PENDING',
    shipping_address=order.shipping_address,
    package_weight=5.5,
    package_dimensions={'length': 30, 'width': 20, 'height': 15, 'unit': 'CM'}
)

print(f"Created: {fulfillment.fulfillment_number}")

# Create line items
for line_item in order.line_items.all():
    FulfillmentLineItem.objects.create(
        fulfillment=fulfillment,
        order_line_item=line_item,
        quantity=line_item.quantity
    )

# Test tracking URL
tracking_url = fulfillment.get_tracking_url()
print(f"Tracking: {tracking_url}")

# Test volumetric weight
vol_weight = fulfillment.calculate_volumetric_weight()
print(f"Volumetric weight: {vol_weight} kg")
```

### Expected Outcomes
- Migration file created (0004_fulfillment.py)
- Migration applied successfully
- Fulfillment table created
- FulfillmentLineItem table created
- All indexes created
- Models importable and functional
- Test instances can be created

---

## Summary

This document established the database foundation for order fulfillment:

**Completed:**
- ✅ Fulfillment model with status tracking
- ✅ Carrier and tracking information fields
- ✅ Package dimensions and weight fields
- ✅ FulfillmentLineItem model for partial fulfillments
- ✅ Database migrations applied

**Key Achievements:**
- Complete shipment tracking capability
- Support for partial fulfillments
- Integration with carriers via tracking URLs
- Package information for shipping cost calculation
- Serial/batch number tracking

**Next Steps:**
- Proceed to [02_Tasks-56-61_Fulfillment-Service-Workflow.md](02_Tasks-56-61_Fulfillment-Service-Workflow.md) to implement fulfillment workflow
- Create FulfillmentService class
- Implement order confirmation and processing
- Add picking, packing, and shipping operations
