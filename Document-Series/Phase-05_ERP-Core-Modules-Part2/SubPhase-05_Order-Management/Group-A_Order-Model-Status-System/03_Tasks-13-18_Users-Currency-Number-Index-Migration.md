# Tasks 13-18: Users, Currency, Number Generation, Indexes & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** A - Order Model & Status System  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Address-Dates-Financial-Metadata.md](02_Tasks-07-12_Address-Dates-Financial-Metadata.md)
- **→ Next Group:** [../Group-B_Order-Line-Items-Pricing/](../Group-B_Order-Line-Items-Pricing/)

---

## Document Overview

This document completes the Order model implementation by adding user reference tracking, currency support, automated order number generation, database optimization through indexes and constraints, and finally generating and applying migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add Order User Reference Fields | Medium | 20 min |
| 14 | Add Order Currency Field | Low | 15 min |
| 15 | Create Order Number Generator | Medium | 25 min |
| 16 | Create Order Model Indexes | Medium | 20 min |
| 17 | Create Order Model Constraints | Medium | 25 min |
| 18 | Run Initial Order Migrations | Low | 15 min |

---

## Task 13: Add Order User Reference Fields

### Overview
Add user reference fields to track which users created, confirmed, assigned to, and processed the order. This provides audit trails and accountability throughout the order lifecycle.

### Dependencies
- Task 05: Create Order Model Core Fields
- User model exists (from Phase 03)

### Instructions

1. **Open order.py model file**
   - Locate Order model after metadata fields

2. **Import User model**
   - Add import for User model
   - Use: `from django.contrib.auth import get_user_model`
   - Call: `User = get_user_model()`

3. **Add created_by field**
   - Use ForeignKey to User model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='created_orders'
   - Add help_text explaining creator tracking

4. **Add assigned_to field**
   - Use ForeignKey to User model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='assigned_orders'
   - Add help_text about order ownership

5. **Add confirmed_by field**
   - Use ForeignKey to User model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='confirmed_orders'
   - Add help_text about confirmation approval

6. **Add shipped_by field**
   - Use ForeignKey to User model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='shipped_orders'
   - Add help_text about shipping handler

7. **Add cancelled_by field**
   - Use ForeignKey to User model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='cancelled_orders'
   - Add help_text about cancellation approver

8. **Add get_assigned_user_name method**
   - Return assigned user's full name if exists
   - Otherwise return "Unassigned"
   - Useful for display

9. **Add get_creator_name method**
   - Return creator's full name if exists
   - Otherwise return "System"
   - Useful for audit logs

10. **Add assign_to method**
    - Assign order to specific user
    - Set assigned_to field
    - Optionally trigger notification
    - Log assignment action

11. **Add unassign method**
    - Remove order assignment
    - Set assigned_to to None
    - Log unassignment action

12. **Update save method**
    - Auto-set user fields based on status changes
    - Example: Set confirmed_by when status becomes CONFIRMED
    - Preserve existing values if already set

### User Reference Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│           ORDER USER REFERENCE TRACKING                   │
└──────────────────────────────────────────────────────────┘

    ORDER LIFECYCLE WITH USER TRACKING:

    [Order Created]
         │
         ├─> created_by: User A (Sales Rep)
         │
         ▼
    [PENDING Status]
         │
         ├─> assigned_to: User B (Sales Manager)
         │
         ▼
    [Order Confirmed]
         │
         ├─> confirmed_by: User B (Sales Manager)
         ├─> confirmed_at: 2026-01-23 10:30:00
         │
         ▼
    [CONFIRMED Status]
         │
         ├─> assigned_to: User C (Warehouse Manager)
         │
         ▼
    [Order Shipped]
         │
         ├─> shipped_by: User D (Warehouse Staff)
         ├─> shipped_at: 2026-01-24 14:15:00
         │
         ▼
    [SHIPPED Status]


    CANCELLATION PATH:
    
    [Any Status]
         │
         ├─> cancelled_by: User B (Manager)
         ├─> cancelled_at: 2026-01-23 16:00:00
         │
         ▼
    [CANCELLED Status]
```

### User Role Responsibility Matrix

| Role | Can Create | Can Confirm | Can Assign | Can Ship | Can Cancel |
|------|------------|-------------|------------|----------|------------|
| **Sales Rep** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **Sales Manager** | ✓ | ✓ | ✓ | ✗ | ✓ |
| **Warehouse Staff** | ✗ | ✗ | ✗ | ✓ | ✗ |
| **Warehouse Manager** | ✗ | ✗ | ✓ | ✓ | ✓ |
| **Admin** | ✓ | ✓ | ✓ | ✓ | ✓ |

### User Field Auto-Population Logic

```python
def save(self, *args, **kwargs):
    """Auto-populate user fields based on status changes"""
    
    # Get current user from thread local or context
    current_user = get_current_user()
    
    # Set confirmed_by when status changes to CONFIRMED
    if self.status == OrderStatus.CONFIRMED and not self.confirmed_by:
        self.confirmed_by = current_user
    
    # Set shipped_by when status changes to SHIPPED
    if self.status == OrderStatus.SHIPPED and not self.shipped_by:
        self.shipped_by = current_user
    
    # Set cancelled_by when status changes to CANCELLED
    if self.status == OrderStatus.CANCELLED and not self.cancelled_by:
        self.cancelled_by = current_user
    
    super().save(*args, **kwargs)
```

### Assignment Workflow

```
MANUAL ASSIGNMENT:

1. Manager views pending orders
2. Selects order #ORD-2026-00001
3. Clicks "Assign to..."
4. Selects User C (Warehouse)
5. System:
   - Sets assigned_to = User C
   - Sends notification to User C
   - Logs assignment action
   - Updates order history


AUTO-ASSIGNMENT:

1. Order status changes to CONFIRMED
2. System checks assignment rules:
   - If POS order → Assign to cashier
   - If Webstore → Assign to online team
   - If high value → Assign to manager
3. System assigns accordingly
4. User receives notification


REASSIGNMENT:

1. Current assignee can't fulfill
2. Manager reassigns:
   - order.assign_to(new_user)
   - Old assignee notified
   - New assignee notified
   - Assignment history logged
```

### Audit Trail Usage

| Event | User Field | Additional Log |
|-------|------------|----------------|
| **Order creation** | created_by | Source, timestamp |
| **Order confirmation** | confirmed_by | Confirmation time |
| **Order assignment** | assigned_to | Previous assignee |
| **Order shipment** | shipped_by | Tracking info |
| **Order cancellation** | cancelled_by | Cancellation reason |

### User Query Patterns

```python
# Find orders created by user
user.created_orders.all()

# Find orders assigned to user
user.assigned_orders.filter(status__in=[
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED
])

# Find orders confirmed by user
user.confirmed_orders.filter(
    confirmed_at__gte=date.today()
)

# Find orders shipped by user today
user.shipped_orders.filter(
    shipped_at__date=date.today()
)

# Find unassigned orders
Order.objects.filter(
    assigned_to__isnull=True,
    status=OrderStatus.CONFIRMED
)

# User performance metrics
user_stats = {
    'created': user.created_orders.count(),
    'confirmed': user.confirmed_orders.count(),
    'shipped': user.shipped_orders.count(),
}
```

### Notification Triggers

| Event | Recipient | Message |
|-------|-----------|---------|
| **Order assigned** | assigned_to | "You have been assigned order #X" |
| **Order confirmed** | created_by | "Your order #X has been confirmed" |
| **Order shipped** | created_by, customer | "Order #X has been shipped" |
| **Order cancelled** | created_by, assigned_to | "Order #X has been cancelled" |

### Permission Checks

```python
def can_user_confirm(user, order):
    """Check if user can confirm order"""
    return user.has_perm('orders.confirm_order') or \
           user.groups.filter(name='Sales Managers').exists()

def can_user_cancel(user, order):
    """Check if user can cancel order"""
    # Manager can cancel any order
    if user.has_perm('orders.cancel_order'):
        return True
    
    # User can cancel own pending orders
    if order.created_by == user and \
       order.status == OrderStatus.PENDING:
        return True
    
    return False

def can_user_ship(user, order):
    """Check if user can mark as shipped"""
    return user.has_perm('orders.ship_order') or \
           user == order.assigned_to
```

### Verification Checklist
- [ ] User model imported using get_user_model()
- [ ] created_by ForeignKey added
- [ ] assigned_to ForeignKey added
- [ ] confirmed_by ForeignKey added
- [ ] shipped_by ForeignKey added
- [ ] cancelled_by ForeignKey added
- [ ] All user FKs use SET_NULL on delete
- [ ] Related names properly set
- [ ] get_assigned_user_name() method created
- [ ] get_creator_name() method created
- [ ] assign_to() method implemented
- [ ] unassign() method implemented
- [ ] save() method updated with user auto-population

---

## Task 14: Add Order Currency Field

### Overview
Add currency field to the Order model with support for multi-currency operations, exchange rates, and LKR as the default currency. This enables international sales and proper financial tracking.

### Dependencies
- Task 09: Add Order Financial Fields

### Instructions

1. **Open order.py model file**
   - Locate Order model after user reference fields

2. **Add currency field**
   - Use CharField with max_length=3
   - Set default='LKR'
   - Use ISO 4217 currency codes
   - Add db_index=True for reporting
   - Add help_text explaining currency code

3. **Add currency_symbol field**
   - Use CharField with max_length=10
   - Set default='Rs.'
   - Display symbol for formatting
   - Add help_text about display usage

4. **Add exchange_rate field**
   - Use DecimalField with max_digits=12, decimal_places=6
   - Set default=Decimal('1.000000')
   - Rate to base currency (LKR)
   - Add help_text about conversion

5. **Add base_currency field**
   - Use CharField with max_length=3
   - Set default='LKR'
   - System base currency
   - Add help_text about accounting

6. **Add base_total field**
   - Use DecimalField with max_digits=12, decimal_places=2
   - Store total in base currency
   - Auto-calculated from total * exchange_rate
   - Add help_text about reporting

7. **Add get_currency_symbol method**
   - Return currency symbol for display
   - Handle common currencies
   - Default to currency code if no symbol

8. **Add format_amount method**
   - Format amount with currency symbol
   - Handle decimal places by currency
   - Support different formatting styles

9. **Add convert_to_base_currency method**
   - Convert order amounts to base currency
   - Update base_total field
   - Use current exchange_rate

10. **Add get_exchange_rate_source method**
    - Return source of exchange rate
    - Examples: "Manual", "Central Bank", "API"
    - Useful for audit

11. **Update calculate_totals method**
    - Include base_total calculation
    - Apply exchange rate conversion
    - Ensure consistency

### Currency Field Structure Diagram

```
┌──────────────────────────────────────────────────────────┐
│              ORDER CURRENCY STRUCTURE                     │
└──────────────────────────────────────────────────────────┘

    Order Model
    │
    ├── currency: "USD"
    ├── currency_symbol: "$"
    ├── exchange_rate: 330.00
    │
    ├── FOREIGN CURRENCY AMOUNTS:
    │   ├── subtotal: $100.00 USD
    │   ├── discount_amount: $10.00 USD
    │   ├── tax_amount: $13.50 USD
    │   ├── shipping_cost: $5.00 USD
    │   └── total: $108.50 USD
    │
    └── BASE CURRENCY (LKR):
        ├── base_currency: "LKR"
        └── base_total: Rs. 35,805.00
            └── (108.50 × 330.00)


    CONVERSION FLOW:
    
    Foreign Amount ──> × Exchange Rate ──> Base Amount
                          (330.00)
    
    $108.50 USD ────────────────────────> Rs. 35,805.00 LKR
```

### Supported Currencies

| Currency | Code | Symbol | Decimal Places | Notes |
|----------|------|--------|----------------|-------|
| **Sri Lankan Rupee** | LKR | Rs. | 2 | Default |
| **US Dollar** | USD | $ | 2 | Common |
| **Euro** | EUR | € | 2 | Common |
| **British Pound** | GBP | £ | 2 | Common |
| **Indian Rupee** | INR | ₹ | 2 | Regional |
| **Australian Dollar** | AUD | A$ | 2 | Common |
| **Japanese Yen** | JPY | ¥ | 0 | No decimals |
| **Singapore Dollar** | SGD | S$ | 2 | Regional |
| **UAE Dirham** | AED | د.إ | 2 | Middle East |

### Exchange Rate Sources (Sri Lanka)

| Source | Description | Update Frequency | URL |
|--------|-------------|------------------|-----|
| **Central Bank** | Official CBSL rates | Daily | https://www.cbsl.gov.lk |
| **Commercial Banks** | Bank rates | Daily | Various |
| **Manual Entry** | Admin-set rates | As needed | N/A |
| **Exchange API** | Third-party API | Real-time | API endpoints |

### Currency Formatting Examples

```
LKR (Sri Lankan Rupee):
  Standard: Rs. 125,450.75
  Formal: LKR 125,450.75
  Unicode: රු. 125,450.75

USD (US Dollar):
  Standard: $1,254.50
  Formal: USD 1,254.50
  Accounting: $1,254.50

EUR (Euro):
  Standard: €1.254,50
  Formal: EUR 1.254,50
  Regional: 1.254,50 €

GBP (British Pound):
  Standard: £1,254.50
  Formal: GBP 1,254.50

JPY (Japanese Yen):
  Standard: ¥125,450
  Formal: JPY 125,450
  Note: No decimal places
```

### Exchange Rate Calculation

```
BASE CALCULATION:

Foreign Amount × Exchange Rate = Base Amount

Example 1: USD to LKR
  $100.00 × 330.00 = Rs. 33,000.00

Example 2: EUR to LKR
  €85.00 × 370.00 = Rs. 31,450.00

Example 3: GBP to LKR
  £75.00 × 420.00 = Rs. 31,500.00


REVERSE CALCULATION:

Base Amount ÷ Exchange Rate = Foreign Amount

Example: LKR to USD
  Rs. 33,000.00 ÷ 330.00 = $100.00
```

### Multi-Currency Order Scenarios

```
SCENARIO 1: USD Order
──────────────────────
Customer: International
Currency: USD
Exchange Rate: 330.00 (USD to LKR)

Order Details:
  Subtotal: $100.00
  Discount: $10.00
  Tax: $13.50
  Shipping: $5.00
  Total: $108.50 USD

Base Currency (for reporting):
  Total: Rs. 35,805.00 LKR
  Calculation: 108.50 × 330.00


SCENARIO 2: LKR Order
──────────────────────
Customer: Local
Currency: LKR
Exchange Rate: 1.00 (no conversion)

Order Details:
  Subtotal: Rs. 10,000.00
  Discount: Rs. 1,000.00
  Tax: Rs. 1,350.00
  Shipping: Rs. 500.00
  Total: Rs. 10,850.00

Base Currency:
  Total: Rs. 10,850.00 LKR
  (Same as order total)
```

### Exchange Rate Management

```python
class ExchangeRate(models.Model):
    """Store historical exchange rates"""
    from_currency = models.CharField(max_length=3)
    to_currency = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=12, decimal_places=6)
    date = models.DateField()
    source = models.CharField(max_length=50)
    
    class Meta:
        unique_together = ['from_currency', 'to_currency', 'date']


def get_exchange_rate(from_currency, to_currency, date=None):
    """Retrieve exchange rate for date"""
    if date is None:
        date = timezone.now().date()
    
    # Check if same currency
    if from_currency == to_currency:
        return Decimal('1.000000')
    
    # Lookup rate
    try:
        rate = ExchangeRate.objects.get(
            from_currency=from_currency,
            to_currency=to_currency,
            date=date
        )
        return rate.rate
    except ExchangeRate.DoesNotExist:
        # Fallback to latest rate
        rate = ExchangeRate.objects.filter(
            from_currency=from_currency,
            to_currency=to_currency
        ).order_by('-date').first()
        
        if rate:
            return rate.rate
        
        raise ValueError(f"No exchange rate found for {from_currency} to {to_currency}")
```

### Currency Display Methods

```python
def format_amount(self, amount):
    """Format amount with currency"""
    symbol = self.get_currency_symbol()
    
    # Handle currencies with no decimals (JPY, KRW)
    if self.currency in ['JPY', 'KRW']:
        return f"{symbol}{amount:,.0f}"
    
    # Standard formatting
    return f"{symbol}{amount:,.2f}"


def get_currency_symbol(self):
    """Get currency symbol for display"""
    symbols = {
        'LKR': 'Rs.',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'INR': '₹',
        'JPY': '¥',
        'AUD': 'A$',
        'SGD': 'S$',
        'AED': 'د.إ',
    }
    return symbols.get(self.currency, self.currency)


def convert_to_base_currency(self):
    """Convert all amounts to base currency"""
    if self.currency == self.base_currency:
        self.base_total = self.total
    else:
        self.base_total = self.total * self.exchange_rate
```

### Financial Reporting with Multi-Currency

| Report | Currency Shown | Conversion |
|--------|----------------|------------|
| **Invoice** | Order currency | As ordered |
| **Daily Sales** | Base currency (LKR) | All converted |
| **Tax Report** | Base currency (LKR) | All converted |
| **Profit/Loss** | Base currency (LKR) | All converted |
| **Customer Statement** | Order currency | Original |

### Verification Checklist
- [ ] currency CharField added (max 3)
- [ ] currency_symbol CharField added
- [ ] exchange_rate DecimalField added (12,6)
- [ ] base_currency CharField added
- [ ] base_total DecimalField added (12,2)
- [ ] Default currency set to 'LKR'
- [ ] get_currency_symbol() method implemented
- [ ] format_amount() method implemented
- [ ] convert_to_base_currency() method implemented
- [ ] get_exchange_rate_source() method implemented
- [ ] calculate_totals() updated for base_total
- [ ] Currency field indexed

---

## Task 15: Create Order Number Generator

### Overview
Create an automated order number generation service that produces unique, sequential order numbers with yearly reset. Format: ORD-YYYY-NNNNN.

### Dependencies
- Task 05: Create Order Model Core Fields

### Instructions

1. **Create number_generator.py in services**
   - Navigate to `apps/orders/services/`
   - Create file named `number_generator.py`

2. **Import required modules**
   - Import Django models and transaction
   - Import timezone utilities
   - Import Order model

3. **Create OrderNumberGenerator class**
   - Service class for number generation
   - Handle sequence and prefix logic

4. **Add prefix constant**
   - Set ORDER_NUMBER_PREFIX = "ORD"
   - Configurable for different tenants

5. **Add get_next_sequence method**
   - Get next sequence number for current year
   - Query highest existing number for year
   - Increment and return
   - Handle edge cases (first order of year)

6. **Add generate method**
   - Main method to generate order number
   - Format: {PREFIX}-{YEAR}-{SEQUENCE}
   - Ensure uniqueness
   - Use database transaction

7. **Add format_sequence method**
   - Zero-pad sequence to 5 digits
   - Examples: 1 → "00001", 234 → "00234"

8. **Add get_current_year method**
   - Return current year as string
   - Consider timezone

9. **Add validate_uniqueness method**
   - Check if generated number exists
   - Retry if duplicate found
   - Prevent race conditions

10. **Add parse_order_number method**
    - Extract prefix, year, sequence from order number
    - Return as dictionary
    - Useful for analytics

11. **Add get_year_stats method**
    - Return statistics for a year
    - Count of orders, highest sequence
    - Useful for reporting

12. **Implement transaction safety**
    - Use select_for_update for sequence generation
    - Prevent duplicate numbers in concurrent requests
    - Handle database locks properly

13. **Add sequence model (optional)**
    - Create OrderSequence model to store counters
    - Fields: year, last_sequence
    - Alternative to querying max order number

14. **Update Order save method**
    - Auto-generate order_number if blank
    - Call generator service
    - Only for new orders

### Order Number Generation Flow

```
┌──────────────────────────────────────────────────────────┐
│            ORDER NUMBER GENERATION FLOW                   │
└──────────────────────────────────────────────────────────┘

    [New Order Created]
           │
           ├─> order_number is blank?
           │   └─> Yes
           │
           ▼
    [Call OrderNumberGenerator]
           │
           ├─> Get current year: 2026
           │
           ├─> Query database:
           │   SELECT MAX(order_number)
           │   WHERE order_number LIKE 'ORD-2026-%'
           │
           ├─> Extract highest sequence:
           │   Result: "ORD-2026-00123"
           │   Sequence: 123
           │
           ├─> Increment: 123 + 1 = 124
           │
           ├─> Format sequence: "00124"
           │
           ├─> Build number:
           │   Prefix: "ORD"
           │   Year: "2026"
           │   Sequence: "00124"
           │   Result: "ORD-2026-00124"
           │
           ├─> Validate uniqueness:
           │   Check if "ORD-2026-00124" exists
           │   └─> Not exists (OK)
           │
           ├─> Assign to order:
           │   order.order_number = "ORD-2026-00124"
           │
           └─> Save order


    YEARLY RESET:
    
    Last order of 2025: ORD-2025-09876
    First order of 2026: ORD-2026-00001
```

### Order Number Format

```
FORMAT: ORD-YYYY-NNNNN

Components:
  ORD    = Prefix (configurable)
  YYYY   = 4-digit year
  NNNNN  = 5-digit sequence (zero-padded)

Examples:
  ORD-2026-00001  (First order of 2026)
  ORD-2026-00234  (234th order of 2026)
  ORD-2026-12500  (12,500th order of 2026)
  ORD-2027-00001  (First order of 2027, reset)

Maximum Orders per Year:
  99,999 orders (00001 to 99999)
```

### Generator Service Implementation

```python
# apps/orders/services/number_generator.py

from django.db import transaction
from django.utils import timezone
from apps.orders.models import Order


class OrderNumberGenerator:
    """Service for generating unique order numbers"""
    
    ORDER_NUMBER_PREFIX = "ORD"
    SEQUENCE_LENGTH = 5
    
    @classmethod
    def generate(cls):
        """Generate next order number"""
        with transaction.atomic():
            year = cls.get_current_year()
            sequence = cls.get_next_sequence(year)
            formatted_sequence = cls.format_sequence(sequence)
            order_number = f"{cls.ORDER_NUMBER_PREFIX}-{year}-{formatted_sequence}"
            
            # Validate uniqueness
            if not cls.validate_uniqueness(order_number):
                # Retry with incremented sequence
                sequence += 1
                formatted_sequence = cls.format_sequence(sequence)
                order_number = f"{cls.ORDER_NUMBER_PREFIX}-{year}-{formatted_sequence}"
            
            return order_number
    
    @classmethod
    def get_next_sequence(cls, year):
        """Get next sequence number for year"""
        # Query highest order number for year
        prefix_pattern = f"{cls.ORDER_NUMBER_PREFIX}-{year}-"
        
        last_order = Order.objects.filter(
            order_number__startswith=prefix_pattern
        ).order_by('-order_number').first()
        
        if last_order:
            # Extract sequence from last order
            parts = last_order.order_number.split('-')
            last_sequence = int(parts[2])
            return last_sequence + 1
        else:
            # First order of the year
            return 1
    
    @classmethod
    def format_sequence(cls, sequence):
        """Format sequence with zero padding"""
        return str(sequence).zfill(cls.SEQUENCE_LENGTH)
    
    @classmethod
    def get_current_year(cls):
        """Get current year as string"""
        return str(timezone.now().year)
    
    @classmethod
    def validate_uniqueness(cls, order_number):
        """Check if order number is unique"""
        return not Order.objects.filter(
            order_number=order_number
        ).exists()
    
    @classmethod
    def parse_order_number(cls, order_number):
        """Parse order number into components"""
        try:
            parts = order_number.split('-')
            return {
                'prefix': parts[0],
                'year': parts[1],
                'sequence': int(parts[2]),
            }
        except (IndexError, ValueError):
            return None
    
    @classmethod
    def get_year_stats(cls, year):
        """Get statistics for a year"""
        prefix_pattern = f"{cls.ORDER_NUMBER_PREFIX}-{year}-"
        
        orders = Order.objects.filter(
            order_number__startswith=prefix_pattern
        )
        
        count = orders.count()
        
        if count > 0:
            last_order = orders.order_by('-order_number').first()
            parsed = cls.parse_order_number(last_order.order_number)
            highest_sequence = parsed['sequence'] if parsed else 0
        else:
            highest_sequence = 0
        
        return {
            'year': year,
            'total_orders': count,
            'highest_sequence': highest_sequence,
            'remaining_capacity': 99999 - highest_sequence,
        }
```

### Order Model Integration

```python
# In Order model save method

def save(self, *args, **kwargs):
    """Override save to auto-generate order number"""
    
    # Generate order number if blank
    if not self.order_number:
        from apps.orders.services.number_generator import OrderNumberGenerator
        self.order_number = OrderNumberGenerator.generate()
    
    # Other save logic...
    super().save(*args, **kwargs)
```

### Concurrency Handling

```
CONCURRENT REQUEST SCENARIO:

Time: T1
  Request A: Generate order number
  Request B: Generate order number (simultaneous)

Without Lock:
  ├─> Both query: last order = ORD-2026-00100
  ├─> Both calculate: next = 00101
  └─> CONFLICT: Both try to use ORD-2026-00101

With Transaction + select_for_update:
  ├─> Request A: Locks sequence query
  │   └─> Gets ORD-2026-00101
  │
  └─> Request B: Waits for lock
      └─> Gets ORD-2026-00102
```

### Alternative: Sequence Table Approach

```python
# Optional: Dedicated sequence model

class OrderSequence(models.Model):
    """Store order number sequences per year"""
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    year = models.IntegerField()
    last_sequence = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ['tenant', 'year']
    
    @classmethod
    def get_next_sequence(cls, tenant, year):
        """Get and increment sequence atomically"""
        with transaction.atomic():
            sequence, created = cls.objects.select_for_update().get_or_create(
                tenant=tenant,
                year=year,
                defaults={'last_sequence': 0}
            )
            
            sequence.last_sequence += 1
            sequence.save()
            
            return sequence.last_sequence
```

### Testing Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| **First order** | ORD-2026-00001 |
| **Sequential** | ORD-2026-00001, 00002, 00003... |
| **Year change** | ORD-2025-99999 → ORD-2026-00001 |
| **Concurrent requests** | No duplicates, sequential |
| **Failed save** | Number not wasted, reusable |
| **Manual number** | Respect manual entry, don't override |

### Verification Checklist
- [ ] number_generator.py created in services
- [ ] OrderNumberGenerator class implemented
- [ ] generate() method working
- [ ] get_next_sequence() method implemented
- [ ] format_sequence() zero-padding working
- [ ] Yearly reset functionality
- [ ] Uniqueness validation
- [ ] Transaction safety implemented
- [ ] parse_order_number() utility method
- [ ] get_year_stats() reporting method
- [ ] Order save() method integrated
- [ ] Concurrency handling tested

---

## Task 16: Create Order Model Indexes

### Overview
Add database indexes to the Order model to optimize query performance for common access patterns. Indexes improve lookup speed for status, dates, customers, and search operations.

### Dependencies
- All previous Order model fields added

### Instructions

1. **Open order.py model file**
   - Locate Order model Meta class

2. **Add indexes list in Meta**
   - Create indexes attribute
   - Define list of models.Index objects

3. **Add order_number index**
   - Already indexed via unique=True and db_index=True
   - Verify in field definition

4. **Add status index**
   - Already indexed via db_index=True
   - Verify in field definition

5. **Add composite index: status + order_date**
   - Optimize queries filtering by status and date range
   - Use models.Index with fields=['status', 'order_date']
   - Name: 'order_status_date_idx'

6. **Add composite index: customer + status**
   - Optimize customer order history queries
   - Use models.Index with fields=['customer', 'status']
   - Name: 'order_customer_status_idx'

7. **Add composite index: status + created_at**
   - Optimize recent orders by status queries
   - Use models.Index with fields=['status', '-created_at']
   - Name: 'order_status_created_idx'

8. **Add order_date index**
   - Already indexed via db_index=True
   - Verify in field definition

9. **Add created_at index**
   - Covered by TimestampMixin
   - Verify inheritance

10. **Add composite index: source + order_date**
    - Optimize analytics by source
    - Use models.Index with fields=['source', 'order_date']
    - Name: 'order_source_date_idx'

11. **Add payment_status index**
    - Already indexed via db_index=True
    - Verify in field definition

12. **Add composite index: payment_status + status**
    - Optimize payment tracking queries
    - Use models.Index with fields=['payment_status', 'status']
    - Name: 'order_payment_status_idx'

13. **Add shipped_at index**
    - Already indexed via db_index=True
    - Verify in field definition

14. **Add delivered_at index**
    - Already indexed via db_index=True
    - Verify in field definition

15. **Add external_id index**
    - Already indexed via db_index=True
    - Verify in field definition

16. **Document index rationale**
    - Add comment explaining each index purpose
    - Note query patterns optimized

### Database Index Strategy Diagram

```
┌──────────────────────────────────────────────────────────┐
│              ORDER MODEL INDEX STRATEGY                   │
└──────────────────────────────────────────────────────────┘

    SINGLE COLUMN INDEXES:
    
    order_number        [UNIQUE INDEX]
        └─> Lookup by order number (primary access)
    
    status              [INDEX]
        └─> Filter by status
    
    customer_id         [INDEX]
        └─> Customer order history
    
    order_date          [INDEX]
        └─> Date range queries
    
    payment_status      [INDEX]
        └─> Payment tracking
    
    source              [INDEX]
        └─> Analytics by source
    
    external_id         [INDEX]
        └─> Integration lookups


    COMPOSITE INDEXES:
    
    (status, order_date)
        └─> Recent orders by status
        └─> Query: Get confirmed orders from last 7 days
    
    (customer, status)
        └─> Customer active orders
        └─> Query: Get customer's pending/confirmed orders
    
    (status, created_at DESC)
        └─> Latest orders by status
        └─> Query: Get newest processing orders
    
    (source, order_date)
        └─> Source analytics over time
        └─> Query: POS orders this month
    
    (payment_status, status)
        └─> Payment tracking by order status
        └─> Query: Unpaid confirmed orders
```

### Index Usage Patterns

| Query Pattern | Index Used | Benefit |
|---------------|------------|---------|
| `WHERE order_number = 'ORD-2026-00001'` | order_number (unique) | O(1) lookup |
| `WHERE status = 'confirmed'` | status | Fast filtering |
| `WHERE customer_id = 123` | customer_id | Customer orders |
| `WHERE status = 'pending' AND order_date >= '2026-01-01'` | (status, order_date) | Range query |
| `WHERE customer_id = 123 AND status = 'confirmed'` | (customer, status) | Combined filter |
| `WHERE source = 'POS' AND order_date BETWEEN ...` | (source, order_date) | Source analytics |
| `WHERE payment_status = 'unpaid' AND status = 'confirmed'` | (payment_status, status) | Payment tracking |

### Common Query Optimizations

```sql
-- Query 1: Recent orders by status
SELECT * FROM orders_order
WHERE status = 'confirmed'
  AND order_date >= NOW() - INTERVAL '7 days'
ORDER BY order_date DESC;
-- Uses: (status, order_date) index


-- Query 2: Customer active orders
SELECT * FROM orders_order
WHERE customer_id = 123
  AND status IN ('pending', 'confirmed', 'processing')
ORDER BY created_at DESC;
-- Uses: (customer, status) index


-- Query 3: Unpaid orders
SELECT * FROM orders_order
WHERE payment_status = 'unpaid'
  AND status = 'confirmed'
ORDER BY created_at DESC;
-- Uses: (payment_status, status) index


-- Query 4: POS orders this month
SELECT COUNT(*), SUM(total)
FROM orders_order
WHERE source = 'POS'
  AND order_date >= DATE_TRUNC('month', NOW());
-- Uses: (source, order_date) index
```

### Index Size Considerations

| Index Type | Estimated Size | Impact |
|------------|----------------|--------|
| Single column | ~1-2 MB per 10K records | Minimal |
| Composite (2 cols) | ~2-3 MB per 10K records | Low |
| Composite (3 cols) | ~3-4 MB per 10K records | Moderate |

### Index Maintenance

```python
# Check index usage (PostgreSQL)
"""
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'orders_order'
ORDER BY idx_scan DESC;
"""

# Find unused indexes
"""
SELECT
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE tablename = 'orders_order'
  AND idx_scan = 0
  AND indexname NOT LIKE '%_pkey';
"""
```

### Meta Class Configuration

```python
class Order(models.Model):
    # ... all fields ...
    
    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        db_table = "orders_order"
        ordering = ['-created_at']
        
        indexes = [
            # Composite indexes for common query patterns
            models.Index(
                fields=['status', 'order_date'],
                name='order_status_date_idx'
            ),
            models.Index(
                fields=['customer', 'status'],
                name='order_customer_status_idx'
            ),
            models.Index(
                fields=['status', '-created_at'],
                name='order_status_created_idx'
            ),
            models.Index(
                fields=['source', 'order_date'],
                name='order_source_date_idx'
            ),
            models.Index(
                fields=['payment_status', 'status'],
                name='order_payment_status_idx'
            ),
        ]
```

### Performance Impact

| Records | Without Indexes | With Indexes | Improvement |
|---------|-----------------|--------------|-------------|
| 1,000 | 50ms | 5ms | 10x faster |
| 10,000 | 500ms | 10ms | 50x faster |
| 100,000 | 5000ms | 20ms | 250x faster |
| 1,000,000 | 50000ms | 30ms | 1666x faster |

### Verification Checklist
- [ ] indexes list added to Meta class
- [ ] (status, order_date) composite index
- [ ] (customer, status) composite index
- [ ] (status, created_at) composite index
- [ ] (source, order_date) composite index
- [ ] (payment_status, status) composite index
- [ ] All index names follow convention
- [ ] Single-field indexes verified (db_index=True)
- [ ] Index rationale documented
- [ ] No redundant indexes

---

## Task 17: Create Order Model Constraints

### Overview
Add database-level constraints to enforce business rules and data integrity. Constraints prevent invalid data at the database level, providing an additional layer of validation.

### Dependencies
- All Order model fields and indexes completed

### Instructions

1. **Open order.py model file**
   - Locate Order model Meta class

2. **Add constraints list in Meta**
   - Create constraints attribute
   - Define list of models.CheckConstraint objects

3. **Add positive amounts constraint**
   - Ensure subtotal, total, paid_amount >= 0
   - Name: 'positive_amounts'
   - Condition: Q(subtotal__gte=0) & Q(total__gte=0) & Q(paid_amount__gte=0)

4. **Add discount validation constraint**
   - Ensure discount_amount <= subtotal
   - Name: 'discount_not_exceeds_subtotal'
   - Condition: Q(discount_amount__lte=models.F('subtotal'))

5. **Add payment validation constraint**
   - Ensure paid_amount <= total + small tolerance
   - Name: 'payment_not_exceeds_total'
   - Condition: Q(paid_amount__lte=models.F('total') + 100)

6. **Add refund validation constraint**
   - Ensure refund_amount <= paid_amount
   - Name: 'refund_not_exceeds_payment'
   - Condition: Q(refund_amount__lte=models.F('paid_amount'))

7. **Add date sequence constraint**
   - Ensure confirmed_at >= order_date (if set)
   - Name: 'confirmed_after_order'
   - Condition: Q(confirmed_at__isnull=True) | Q(confirmed_at__gte=models.F('order_date'))

8. **Add shipping date constraint**
   - Ensure shipped_at >= confirmed_at (if both set)
   - Name: 'shipped_after_confirmed'
   - Condition: Q(shipped_at__isnull=True) | Q(confirmed_at__isnull=True) | Q(shipped_at__gte=models.F('confirmed_at'))

9. **Add delivery date constraint**
   - Ensure delivered_at >= shipped_at (if both set)
   - Name: 'delivered_after_shipped'
   - Condition: Q(delivered_at__isnull=True) | Q(shipped_at__isnull=True) | Q(delivered_at__gte=models.F('shipped_at'))

10. **Add priority range constraint**
    - Ensure priority between 1 and 10
    - Name: 'priority_range'
    - Condition: Q(priority__gte=1) & Q(priority__lte=10)

11. **Add exchange rate constraint**
    - Ensure exchange_rate > 0
    - Name: 'positive_exchange_rate'
    - Condition: Q(exchange_rate__gt=0)

12. **Add guest order validation constraint**
    - If customer is null, customer_name and customer_email required
    - Name: 'guest_order_requires_details'
    - Condition: Q(customer__isnull=False) | (Q(customer_name__isnull=False) & Q(customer_email__isnull=False))

13. **Add status-date consistency constraints**
    - CONFIRMED status requires confirmed_at
    - SHIPPED status requires shipped_at
    - DELIVERED status requires delivered_at

14. **Document constraint rationale**
    - Add comments explaining each constraint
    - Note business rules enforced

### Database Constraints Architecture

```
┌──────────────────────────────────────────────────────────┐
│          ORDER MODEL CONSTRAINT ARCHITECTURE              │
└──────────────────────────────────────────────────────────┘

    FINANCIAL CONSTRAINTS:
    
    ┌─────────────────────────────────────────────┐
    │ Positive Amounts                            │
    │ • subtotal >= 0                             │
    │ • total >= 0                                │
    │ • paid_amount >= 0                          │
    │ • shipping_cost >= 0                        │
    └─────────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────────────────────────────┐
    │ Discount Validation                         │
    │ • discount_amount <= subtotal               │
    └─────────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────────────────────────────┐
    │ Payment Validation                          │
    │ • paid_amount <= total + tolerance          │
    └─────────────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────────────────────────────┐
    │ Refund Validation                           │
    │ • refund_amount <= paid_amount              │
    └─────────────────────────────────────────────┘


    DATE SEQUENCE CONSTRAINTS:
    
    order_date <= confirmed_at <= shipped_at <= delivered_at
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                  Chronological Order


    BUSINESS RULES CONSTRAINTS:
    
    ├─> Priority: 1 <= priority <= 10
    ├─> Exchange Rate: exchange_rate > 0
    └─> Guest Orders: customer=NULL requires name+email
```

### Constraint Definitions

```python
class Meta:
    # ... other Meta attributes ...
    
    constraints = [
        # Financial constraints
        models.CheckConstraint(
            check=models.Q(subtotal__gte=0) & 
                  models.Q(total__gte=0) & 
                  models.Q(paid_amount__gte=0) &
                  models.Q(shipping_cost__gte=0),
            name='positive_amounts'
        ),
        models.CheckConstraint(
            check=models.Q(discount_amount__lte=models.F('subtotal')),
            name='discount_not_exceeds_subtotal'
        ),
        models.CheckConstraint(
            check=models.Q(paid_amount__lte=models.F('total') + 100),
            name='payment_not_exceeds_total'
        ),
        models.CheckConstraint(
            check=models.Q(refund_amount__lte=models.F('paid_amount')),
            name='refund_not_exceeds_payment'
        ),
        
        # Date sequence constraints
        models.CheckConstraint(
            check=models.Q(confirmed_at__isnull=True) | 
                  models.Q(confirmed_at__gte=models.F('order_date')),
            name='confirmed_after_order'
        ),
        models.CheckConstraint(
            check=models.Q(shipped_at__isnull=True) | 
                  models.Q(confirmed_at__isnull=True) | 
                  models.Q(shipped_at__gte=models.F('confirmed_at')),
            name='shipped_after_confirmed'
        ),
        models.CheckConstraint(
            check=models.Q(delivered_at__isnull=True) | 
                  models.Q(shipped_at__isnull=True) | 
                  models.Q(delivered_at__gte=models.F('shipped_at')),
            name='delivered_after_shipped'
        ),
        
        # Range constraints
        models.CheckConstraint(
            check=models.Q(priority__gte=1) & models.Q(priority__lte=10),
            name='priority_range'
        ),
        models.CheckConstraint(
            check=models.Q(exchange_rate__gt=0),
            name='positive_exchange_rate'
        ),
        
        # Guest order constraint
        models.CheckConstraint(
            check=models.Q(customer__isnull=False) | 
                  (models.Q(customer_name__gt='') & 
                   models.Q(customer_email__gt='')),
            name='guest_order_requires_details'
        ),
    ]
```

### Constraint Validation Scenarios

| Scenario | Constraint | Expected Result |
|----------|------------|-----------------|
| **Negative total** | positive_amounts | ❌ IntegrityError |
| **Discount > subtotal** | discount_not_exceeds_subtotal | ❌ IntegrityError |
| **Payment > total + Rs. 100** | payment_not_exceeds_total | ❌ IntegrityError |
| **Refund > paid** | refund_not_exceeds_payment | ❌ IntegrityError |
| **Confirmed before order** | confirmed_after_order | ❌ IntegrityError |
| **Shipped before confirmed** | shipped_after_confirmed | ❌ IntegrityError |
| **Priority = 0** | priority_range | ❌ IntegrityError |
| **Exchange rate = 0** | positive_exchange_rate | ❌ IntegrityError |
| **Guest without email** | guest_order_requires_details | ❌ IntegrityError |
| **Valid order** | All constraints | ✅ Success |

### Error Handling

```python
from django.db import IntegrityError

try:
    order.discount_amount = Decimal('15000.00')
    order.subtotal = Decimal('10000.00')
    order.save()
except IntegrityError as e:
    if 'discount_not_exceeds_subtotal' in str(e):
        raise ValidationError(
            "Discount amount cannot exceed subtotal"
        )
    raise


try:
    order.priority = 15  # Invalid: > 10
    order.save()
except IntegrityError as e:
    if 'priority_range' in str(e):
        raise ValidationError(
            "Priority must be between 1 and 10"
        )
    raise
```

### Validation Layer Strategy

```
MULTI-LAYER VALIDATION:

Layer 1: Model Field Validation
  ├─> Field types (CharField, IntegerField)
  ├─> Field constraints (max_length, choices)
  └─> Basic validators

Layer 2: Model clean() Method
  ├─> Business logic validation
  ├─> Cross-field validation
  └─> Complex rules

Layer 3: Database Constraints
  ├─> Final enforcement
  ├─> Multi-user safety
  └─> Data integrity guarantee

All layers work together for robust validation
```

### Constraint Benefits

| Benefit | Description |
|---------|-------------|
| **Data Integrity** | Prevents invalid data at DB level |
| **Concurrent Safety** | Protects against race conditions |
| **Performance** | Database-level checks are fast |
| **Fail-Safe** | Last line of defense |
| **Documentation** | Self-documenting business rules |

### Testing Constraints

```python
# Test constraint violations

def test_negative_total_constraint():
    """Test that negative total is rejected"""
    order = Order(
        total=Decimal('-100.00')  # Invalid
    )
    with pytest.raises(IntegrityError):
        order.save()


def test_discount_exceeds_subtotal():
    """Test that discount > subtotal is rejected"""
    order = Order(
        subtotal=Decimal('1000.00'),
        discount_amount=Decimal('1500.00')  # Invalid
    )
    with pytest.raises(IntegrityError):
        order.save()


def test_date_sequence_constraint():
    """Test that dates must be in sequence"""
    order = Order(
        order_date=timezone.now(),
        confirmed_at=timezone.now() - timedelta(days=1)  # Invalid: before order_date
    )
    with pytest.raises(IntegrityError):
        order.save()
```

### Verification Checklist
- [ ] constraints list added to Meta class
- [ ] positive_amounts constraint defined
- [ ] discount_not_exceeds_subtotal constraint
- [ ] payment_not_exceeds_total constraint
- [ ] refund_not_exceeds_payment constraint
- [ ] confirmed_after_order constraint
- [ ] shipped_after_confirmed constraint
- [ ] delivered_after_shipped constraint
- [ ] priority_range constraint
- [ ] positive_exchange_rate constraint
- [ ] guest_order_requires_details constraint
- [ ] All constraint names follow convention
- [ ] Constraint rationale documented

---

## Task 18: Run Initial Order Migrations

### Overview
Generate and apply Django migrations for the Order model and all related changes. This creates the database schema with all fields, indexes, and constraints.

### Dependencies
- All previous Order model tasks completed (01-17)

### Instructions

1. **Verify model completeness**
   - Review Order model in `apps/orders/models/order.py`
   - Check all fields are defined
   - Verify Meta class configuration
   - Ensure imports are correct

2. **Check for syntax errors**
   - Run Python syntax check
   - Command: `python manage.py check`
   - Fix any reported issues

3. **Generate migration**
   - Run makemigrations command
   - Command: `python manage.py makemigrations orders`
   - Review generated migration file

4. **Review migration file**
   - Open migration file in `apps/orders/migrations/`
   - Verify all fields included
   - Check indexes are present
   - Confirm constraints are included

5. **Check migration dependencies**
   - Verify dependencies on other apps (customers, etc.)
   - Ensure proper migration order
   - Add dependencies if needed

6. **Run migration in development**
   - Apply migration to development database
   - Command: `python manage.py migrate orders`
   - Verify no errors

7. **Verify database schema**
   - Connect to database
   - Check orders_order table exists
   - Verify all columns created
   - Confirm indexes created

8. **Test model operations**
   - Create test order via Django shell
   - Verify order number generation
   - Test constraints
   - Check cascading relationships

9. **Document migration**
   - Add docstring to migration file
   - Note any special considerations
   - Document rollback procedure

10. **Commit migration files**
    - Add migration file to git
    - Commit with descriptive message
    - Tag as initial orders migration

11. **Update documentation**
    - Document database schema
    - Note migration instructions
    - Add to deployment guide

### Migration Generation Process

```
┌──────────────────────────────────────────────────────────┐
│              MIGRATION GENERATION FLOW                    │
└──────────────────────────────────────────────────────────┘

    [Model Changes Complete]
           │
           ▼
    [Run: python manage.py check]
           │
           ├─> Check for errors
           │   └─> Fix if any
           │
           ▼
    [Run: python manage.py makemigrations orders]
           │
           ├─> Django analyzes models
           ├─> Compares with last migration
           ├─> Generates migration file
           │
           ▼
    [Review Migration File]
           │
           ├─> 0001_initial.py created
           ├─> Check operations:
           │   ├─> CreateModel(Order)
           │   ├─> AddIndex(...)
           │   └─> AddConstraint(...)
           │
           ▼
    [Run: python manage.py migrate orders]
           │
           ├─> Apply to database
           ├─> Create orders_order table
           ├─> Create indexes
           └─> Create constraints
           │
           ▼
    [Verify Schema]
           │
           └─> Success! ✓
```

### Migration Commands

```bash
# 1. Check for issues
python manage.py check

# 2. Generate migration
python manage.py makemigrations orders

# 3. View SQL (optional, for review)
python manage.py sqlmigrate orders 0001

# 4. Apply migration
python manage.py migrate orders

# 5. Verify migration status
python manage.py showmigrations orders
```

### Expected Migration File Structure

```python
# apps/orders/migrations/0001_initial.py

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    """
    Initial migration for Order model
    
    Creates:
    - Order model with all fields
    - Database indexes for performance
    - Constraints for data integrity
    """
    
    initial = True
    
    dependencies = [
        ('customers', '0001_initial'),
        ('tenants', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('order_number', models.CharField(max_length=50, unique=True)),
                ('status', models.CharField(max_length=20, choices=[...])),
                ('source', models.CharField(max_length=20, choices=[...])),
                # ... all other fields ...
                ('customer', models.ForeignKey(...)),
                ('tenant', models.ForeignKey(...)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
                'db_table': 'orders_order',
                'ordering': ['-created_at'],
            },
        ),
        # Indexes
        migrations.AddIndex(
            model_name='order',
            index=models.Index(fields=['status', 'order_date'], name='order_status_date_idx'),
        ),
        # ... more indexes ...
        
        # Constraints
        migrations.AddConstraint(
            model_name='order',
            constraint=models.CheckConstraint(check=models.Q(...), name='positive_amounts'),
        ),
        # ... more constraints ...
    ]
```

### Database Schema Verification

```sql
-- Check table created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'orders_order';

-- Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders_order'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'orders_order';

-- Check constraints
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'orders_order'::regclass;
```

### Testing After Migration

```python
# Django shell testing

from apps.orders.models import Order
from apps.customers.models import Customer
from decimal import Decimal

# Test order creation
order = Order.objects.create(
    customer=customer,
    status='pending',
    source='pos',
    subtotal=Decimal('10000.00'),
    total=Decimal('11500.00')
)

# Verify order number generated
print(order.order_number)  # Should be ORD-2026-00001

# Test constraints (should fail)
try:
    order.discount_amount = Decimal('20000.00')  # > subtotal
    order.save()
except IntegrityError:
    print("Constraint working!")  # Expected

# Test methods
print(order.get_customer_name())
print(order.format_amount(order.total))
```

### Rollback Procedure

```bash
# Rollback last migration
python manage.py migrate orders zero

# Or rollback to specific migration
python manage.py migrate orders 0000

# Re-apply if needed
python manage.py migrate orders
```

### Migration Checklist

```
PRE-MIGRATION:
├─ [ ] All model fields defined
├─ [ ] All methods implemented
├─ [ ] Indexes configured
├─ [ ] Constraints configured
├─ [ ] Dependencies identified
└─ [ ] Syntax check passed

MIGRATION:
├─ [ ] Migration file generated
├─ [ ] Migration file reviewed
├─ [ ] SQL preview checked (optional)
├─ [ ] Migration applied successfully
└─ [ ] No errors or warnings

POST-MIGRATION:
├─ [ ] Database table exists
├─ [ ] All columns created
├─ [ ] Indexes created
├─ [ ] Constraints active
├─ [ ] Foreign keys working
├─ [ ] Test operations successful
└─ [ ] Migration committed to git
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Dependency error** | Missing app migration | Add dependency |
| **Constraint violation** | Existing data invalid | Clean data or remove constraint temporarily |
| **Index name conflict** | Duplicate index name | Rename index |
| **Field type mismatch** | Incorrect field type | Fix model definition |
| **Missing default** | Required field, no default | Add default or allow null |

### Multi-Tenant Migration Considerations

```
TENANT SCHEMA MIGRATION:

1. Shared Schema (public):
   - Contains shared apps
   - Migrates once

2. Tenant Schemas:
   - Each tenant has own schema
   - Migration runs per tenant
   - Orders app in tenant schema

Command applies to all tenant schemas:
  python manage.py migrate_schemas
  
Or specific tenant:
  python manage.py tenant_command migrate --schema=tenant1
```

### Verification Checklist
- [ ] Model syntax check passed
- [ ] makemigrations completed successfully
- [ ] Migration file generated in migrations/
- [ ] Migration file reviewed and validated
- [ ] All fields present in migration
- [ ] All indexes present in migration
- [ ] All constraints present in migration
- [ ] Dependencies properly set
- [ ] Migration applied without errors
- [ ] Database table created
- [ ] All columns exist in database
- [ ] Indexes created in database
- [ ] Constraints active in database
- [ ] Test order created successfully
- [ ] Order number generation working
- [ ] Constraints preventing invalid data
- [ ] Migration file committed to git

---

## End of Document

**Progress:** Tasks 13-18 completed. Order model fully implemented with user tracking, currency support, automated order numbering, database optimization, and migrations applied.

**Group A Complete!** The Order model foundation is now ready for Group B (Order Line Items & Pricing).

---

## Summary of Deliverables

| Task | Deliverable | Key Features |
|------|-------------|--------------|
| 13 | User references | created_by, assigned_to, confirmed_by, shipped_by, cancelled_by |
| 14 | Currency support | Multi-currency with LKR default, exchange rates |
| 15 | Number generator | Automated ORD-YYYY-NNNNN format with yearly reset |
| 16 | Database indexes | Composite indexes for query optimization |
| 17 | Data constraints | Financial, date sequence, and business rule constraints |
| 18 | Migrations | Complete database schema created |

### Complete Order Model Overview

```
Order Model Final Structure:
├── Core Fields (Task 05)
│   ├── id, order_number, status, source
│   ├── order_date, priority, is_draft
│
├── Customer Fields (Task 06)
│   ├── customer FK, customer_name/email/phone
│   ├── is_guest_order, customer_notes
│
├── Address Fields (Task 07)
│   ├── shipping_address, billing_address
│   ├── tracking_number, delivery_instructions
│
├── Date Tracking (Task 08)
│   ├── confirmed_at, processing_at, picked_at, packed_at
│   ├── shipped_at, delivered_at, completed_at
│   ├── cancelled_at, returned_at
│
├── Financial Fields (Task 09)
│   ├── subtotal, discount, tax, shipping, total
│   ├── paid_amount, refund_amount
│   ├── cost_of_goods, profit_margin
│
├── Payment Status (Task 10)
│   ├── payment_status, payment_method
│   ├── payment_reference
│
├── References (Task 11)
│   ├── quote, pos_session, parent_order
│   ├── external_id, campaign_code, coupon_code
│
├── Metadata (Task 12)
│   ├── notes, internal_notes, fulfillment_notes
│   ├── tags, custom_fields, metadata
│   ├── is_gift, is_urgent, requires_insurance
│
├── User Tracking (Task 13)
│   ├── created_by, assigned_to, confirmed_by
│   ├── shipped_by, cancelled_by
│
├── Currency (Task 14)
│   ├── currency, exchange_rate
│   ├── base_currency, base_total
│
└── Infrastructure (Tasks 15-18)
    ├── Automated order number generation
    ├── Database indexes
    ├── Data integrity constraints
    └── Migrations applied
```

### Next Steps

**Continue to Group B:** [../Group-B_Order-Line-Items-Pricing/](../Group-B_Order-Line-Items-Pricing/)

Group B will cover:
- OrderLineItem model
- Product and variant relationships
- Pricing and discounts per line
- Quantity and unit of measure
- Line item totals and calculations

---
