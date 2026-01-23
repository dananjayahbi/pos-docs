# Tasks 32-38: Cart Service & Operations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** B - Cart & Line Item Management  
> **Document:** 03 of 03  
> **Tasks Covered:** 32, 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-26-31_Cart-Items-Model.md](02_Tasks-26-31_Cart-Items-Model.md)
- **→ Next Group:** [../Group-C_Product-Search-Barcode/](../Group-C_Product-Search-Barcode/)

---

## Document Overview

This document covers the creation of the CartService and implementation of all cart operations. The service layer encapsulates business logic for managing carts, adding/updating/removing items, applying discounts, and calculating totals.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 32 | Create CartService | Medium | 25 min |
| 33 | Implement add_to_cart | Medium | 25 min |
| 34 | Implement update_quantity | Medium | 25 min |
| 35 | Implement remove_from_cart | Medium | 20 min |
| 36 | Implement apply_line_discount | Medium | 25 min |
| 37 | Implement apply_cart_discount | Medium | 25 min |
| 38 | Implement calculate_totals | High | 30 min |

**Total Estimated Time:** 2 hours 55 minutes

---

## Task 32: Create CartService

### Overview
Create the CartService class to encapsulate all cart-related business logic. This service provides a clean interface for cart operations, enforcing business rules and maintaining data integrity.

### Dependencies
- Task 31: POSCartItem model with all fields completed
- POSCart model completed
- POSSession model exists

### Purpose
CartService provides:
- Centralized cart business logic
- Consistent cart operations
- Transaction management
- Validation and error handling
- Clean separation of concerns

### Instructions

1. **Create cart_service.py file**
   - Navigate to `apps/pos/cart/services/`
   - Create `cart_service.py` file
   - This will contain the CartService class

2. **Import required dependencies**
   - Import Django transaction management
   - Import Decimal for currency calculations
   - Import POSCart and POSCartItem models
   - Import Product and ProductVariant models
   - Import cart and discount constants
   - Import custom exceptions if needed

3. **Define CartService class**
   - Create class `CartService`
   - Singleton pattern or stateless service
   - All methods should be class methods or static
   - No instance state required

4. **Add get_or_create_cart method**
   - Method: `get_or_create_cart(session, customer=None)`
   - Get active cart for session
   - Create new cart if none exists
   - Return cart instance
   - Handle single active cart per session

5. **Add get_cart_by_id method**
   - Method: `get_cart_by_id(cart_id, tenant=None)`
   - Retrieve cart by ID
   - Apply tenant filtering
   - Return cart or None
   - Raise error if not found

6. **Add get_active_cart method**
   - Method: `get_active_cart(session)`
   - Get session's active cart
   - Filter by status = ACTIVE
   - Return cart or None

7. **Add hold_cart method**
   - Method: `hold_cart(cart)`
   - Change cart status to HELD
   - Set held_at timestamp
   - Save cart
   - Return success boolean

8. **Add resume_cart method**
   - Method: `resume_cart(cart)`
   - Change cart status from HELD to ACTIVE
   - Validate cart can be resumed
   - Save cart
   - Return success boolean

9. **Add void_cart method**
   - Method: `void_cart(cart, reason=None)`
   - Change cart status to VOIDED
   - Set voided_at timestamp
   - Log reason if provided
   - Save cart

10. **Add validate_cart method**
    - Method: `validate_cart(cart)`
    - Check cart is modifiable
    - Validate all items
    - Check stock availability
    - Return validation result

11. **Update services __init__.py**
    - Import CartService
    - Add to __all__ list
    - Makes CartService easily importable

### Service Architecture

```
┌────────────────────────────────────────────────┐
│           CartService Architecture              │
└────────────────────────────────────────────────┘

                    ┌───────────────┐
                    │  CartService  │
                    └───────────────┘
                           │
        ┏━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━┓
        ┃                 ┃                  ┃
        ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Cart Lifecycle│  │ Item Ops     │  │ Calculations │
└──────────────┘  └──────────────┘  └──────────────┘
│                 │                  │
├─ Create        ├─ Add Item       ├─ Line Totals
├─ Hold          ├─ Update Qty     ├─ Cart Totals
├─ Resume        ├─ Remove Item    ├─ Discounts
└─ Void          └─ Apply Discount └─ Tax
```

### CartService Methods Overview

| Method | Purpose | Returns |
|--------|---------|---------|
| **get_or_create_cart** | Get/create cart for session | POSCart |
| **get_cart_by_id** | Retrieve cart by ID | POSCart or None |
| **get_active_cart** | Get session's active cart | POSCart or None |
| **hold_cart** | Put cart on hold | Boolean |
| **resume_cart** | Resume held cart | Boolean |
| **void_cart** | Cancel cart | Boolean |
| **validate_cart** | Validate cart state | Dict |

### Implementation Pattern

```python
from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal

from apps.pos.cart.models import POSCart, POSCartItem
from apps.products.models import Product, ProductVariant
from apps.pos.constants import (
    CART_STATUS_ACTIVE,
    CART_STATUS_HELD,
    CART_STATUS_VOIDED,
    CART_STATUS_COMPLETED
)


class CartService:
    """Service for managing POS cart operations"""
    
    @staticmethod
    def get_or_create_cart(session, customer=None):
        """
        Get or create active cart for session
        
        Args:
            session: POSSession instance
            customer: Optional User instance
            
        Returns:
            POSCart instance
        """
        # Try to get existing active cart
        cart = POSCart.objects.filter(
            session=session,
            status=CART_STATUS_ACTIVE
        ).first()
        
        # Create new cart if none exists
        if not cart:
            cart = POSCart.objects.create(
                session=session,
                customer=customer,
                tenant=session.tenant,
                status=CART_STATUS_ACTIVE
            )
        
        return cart
    
    @staticmethod
    def get_cart_by_id(cart_id, tenant=None):
        """
        Retrieve cart by ID with optional tenant filtering
        
        Args:
            cart_id: Cart ID
            tenant: Optional Tenant instance for filtering
            
        Returns:
            POSCart instance or None
        """
        queryset = POSCart.objects.filter(id=cart_id)
        
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        
        return queryset.first()
    
    @staticmethod
    def get_active_cart(session):
        """
        Get session's active cart
        
        Args:
            session: POSSession instance
            
        Returns:
            POSCart instance or None
        """
        return POSCart.objects.filter(
            session=session,
            status=CART_STATUS_ACTIVE
        ).first()
    
    @staticmethod
    @transaction.atomic
    def hold_cart(cart):
        """
        Put cart on hold
        
        Args:
            cart: POSCart instance
            
        Returns:
            Boolean success
        """
        if cart.status != CART_STATUS_ACTIVE:
            return False
        
        cart.update_status(CART_STATUS_HELD)
        return True
    
    @staticmethod
    @transaction.atomic
    def resume_cart(cart):
        """
        Resume held cart
        
        Args:
            cart: POSCart instance
            
        Returns:
            Boolean success
        """
        if cart.status != CART_STATUS_HELD:
            return False
        
        cart.update_status(CART_STATUS_ACTIVE)
        return True
    
    @staticmethod
    @transaction.atomic
    def void_cart(cart, reason=None):
        """
        Void/cancel cart
        
        Args:
            cart: POSCart instance
            reason: Optional reason for voiding
            
        Returns:
            Boolean success
        """
        if cart.status in [CART_STATUS_COMPLETED, CART_STATUS_VOIDED]:
            return False
        
        if reason:
            cart.notes = f"VOIDED: {reason}\n{cart.notes}"
        
        cart.update_status(CART_STATUS_VOIDED)
        return True
    
    @staticmethod
    def validate_cart(cart):
        """
        Validate cart and its items
        
        Args:
            cart: POSCart instance
            
        Returns:
            Dict with validation results
        """
        errors = []
        
        # Check cart is modifiable
        if not cart.is_modifiable:
            errors.append("Cart cannot be modified in current status")
        
        # Check cart has items
        if cart.items.count() == 0:
            errors.append("Cart has no items")
        
        # Validate each item
        for item in cart.items.all():
            # Check stock availability
            if not item.validate_stock_availability():
                errors.append(
                    f"Insufficient stock for {item.product.name}"
                )
            
            # Check price validity
            if item.unit_price <= 0:
                errors.append(
                    f"Invalid price for {item.product.name}"
                )
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
```

### Service Usage Examples

```python
# Example 1: Get or create cart
from apps.pos.cart.services import CartService

# Get/create cart for session
cart = CartService.get_or_create_cart(
    session=pos_session,
    customer=user
)

# Example 2: Hold cart
success = CartService.hold_cart(cart)
if success:
    print("Cart put on hold")

# Example 3: Resume cart
success = CartService.resume_cart(cart)
if success:
    print("Cart resumed")

# Example 4: Void cart
success = CartService.void_cart(
    cart=cart,
    reason="Customer changed mind"
)

# Example 5: Validate cart
result = CartService.validate_cart(cart)
if result['valid']:
    print("Cart is valid")
else:
    print("Errors:", result['errors'])
```

### Business Rules

1. **Single Active Cart**
   - One active cart per session
   - Multiple held carts allowed
   - Get or create ensures single active

2. **Cart Lifecycle**
   - ACTIVE: Can be modified
   - HELD: Can be resumed
   - COMPLETED: Read-only
   - VOIDED: Cannot be modified

3. **Transaction Safety**
   - Use @transaction.atomic for state changes
   - Rollback on errors
   - Ensure data consistency

4. **Validation**
   - Check cart status before operations
   - Validate stock availability
   - Verify pricing integrity
   - Return clear error messages

5. **Tenant Isolation**
   - Always filter by tenant
   - Inherit tenant from session
   - Enforce multi-tenancy

### Expected Outcome
```python
# apps/pos/cart/services/cart_service.py
class CartService:
    """Service for managing POS cart operations"""
    
    @staticmethod
    def get_or_create_cart(session, customer=None):
        # Implementation
        pass
    
    @staticmethod
    def get_cart_by_id(cart_id, tenant=None):
        # Implementation
        pass
    
    @staticmethod
    def get_active_cart(session):
        # Implementation
        pass
    
    @staticmethod
    def hold_cart(cart):
        # Implementation
        pass
    
    @staticmethod
    def resume_cart(cart):
        # Implementation
        pass
    
    @staticmethod
    def void_cart(cart, reason=None):
        # Implementation
        pass
    
    @staticmethod
    def validate_cart(cart):
        # Implementation
        pass
```

### Verification Checklist
- [ ] `cart_service.py` file created
- [ ] CartService class defined
- [ ] get_or_create_cart method implemented
- [ ] get_cart_by_id method implemented
- [ ] get_active_cart method implemented
- [ ] hold_cart method implemented with @transaction.atomic
- [ ] resume_cart method implemented
- [ ] void_cart method implemented
- [ ] validate_cart method implemented
- [ ] Methods use static/class methods
- [ ] Tenant filtering applied
- [ ] CartService imported in `services/__init__.py`

---

## Task 33: Implement add_to_cart

### Overview
Implement the `add_to_cart` method in CartService to add products to the cart. This method handles product/variant selection, quantity, pricing, tax initialization, and creates or updates cart items.

### Dependencies
- Task 32: CartService created
- POSCartItem model complete

### Purpose
add_to_cart method:
- Adds products to cart
- Handles variants
- Sets initial pricing
- Validates stock
- Creates or updates items
- Recalculates totals

### Instructions

1. **Open cart_service.py**
   - Navigate to `apps/pos/cart/services/cart_service.py`
   - Locate CartService class

2. **Add add_to_cart method**
   - Method: `add_to_cart(cart, product, quantity=1, variant=None)`
   - Static method with @transaction.atomic
   - Parameters: cart, product, quantity, optional variant
   - Returns: POSCartItem instance

3. **Validate cart status**
   - Check cart.is_modifiable
   - Raise error if cart cannot be modified
   - Only ACTIVE or HELD carts allowed

4. **Validate product**
   - Check product exists and is active
   - Verify product belongs to same tenant
   - Raise error if invalid

5. **Validate variant if provided**
   - Check variant belongs to product
   - Verify variant is active
   - Raise error if invalid

6. **Validate quantity**
   - Convert to Decimal
   - Check quantity > 0
   - Validate against maximum
   - Raise error if invalid

7. **Check stock availability**
   - Get stock from variant or product
   - Compare with requested quantity
   - Raise error if insufficient

8. **Check for existing item**
   - Look for existing cart item with same product/variant
   - If exists: update quantity (call update_quantity)
   - If not: create new item

9. **Create new cart item**
   - Create POSCartItem instance
   - Set cart, product, variant, quantity
   - Call set_prices_from_product()
   - Call set_tax_from_product()
   - Assign line_number (max + 1)
   - Save item

10. **Recalculate cart totals**
    - Call cart.recalculate_totals()
    - Ensure cart totals updated
    - Return created/updated item

11. **Add error handling**
    - Catch and handle exceptions
    - Provide clear error messages
    - Rollback on errors (automatic with @transaction.atomic)

### Add to Cart Flow

```
┌────────────────────────────────────────────────┐
│           Add to Cart Flow                      │
└────────────────────────────────────────────────┘

[add_to_cart called]
         │
         ▼
[Validate cart is modifiable?]
         │
         ├── No ──► [Error: Cart not modifiable]
         │
         └── Yes
              │
              ▼
[Validate product and variant]
         │
         ├── Invalid ──► [Error: Invalid product]
         │
         └── Valid
              │
              ▼
[Validate quantity and stock]
         │
         ├── Insufficient ──► [Error: Low stock]
         │
         └── Available
              │
              ▼
[Check existing item?]
         │
    ┌────┴────┐
    │         │
 [Exists]  [New]
    │         │
    ▼         ▼
[Update   [Create
 quantity]  item]
    │         │
    │         ├─ Set prices
    │         ├─ Set tax
    │         └─ Set line_number
    │         │
    └────┬────┘
         │
         ▼
[Recalculate Cart Totals]
         │
         ▼
[Return CartItem]
```

### Implementation Pattern

```python
@staticmethod
@transaction.atomic
def add_to_cart(cart, product, quantity=1, variant=None):
    """
    Add product to cart
    
    Args:
        cart: POSCart instance
        product: Product instance
        quantity: Quantity to add (default: 1)
        variant: Optional ProductVariant instance
        
    Returns:
        POSCartItem instance
        
    Raises:
        ValidationError: If validation fails
    """
    from django.core.exceptions import ValidationError
    
    # Validate cart status
    if not cart.is_modifiable:
        raise ValidationError(
            "Cart cannot be modified in current status"
        )
    
    # Validate product
    if not product.is_active:
        raise ValidationError(
            f"Product {product.name} is not active"
        )
    
    if product.tenant != cart.tenant:
        raise ValidationError(
            "Product does not belong to cart tenant"
        )
    
    # Validate variant if provided
    if variant:
        if variant.product != product:
            raise ValidationError(
                "Variant does not belong to product"
            )
        if not variant.is_active:
            raise ValidationError(
                f"Variant {variant.name} is not active"
            )
    
    # Validate quantity
    try:
        quantity = Decimal(str(quantity))
    except (ValueError, TypeError):
        raise ValidationError("Invalid quantity")
    
    if quantity <= 0:
        raise ValidationError("Quantity must be greater than zero")
    
    if quantity > Decimal('9999.999'):
        raise ValidationError("Quantity exceeds maximum")
    
    # Check stock availability
    stock_level = variant.stock_quantity if variant else product.stock_quantity
    if stock_level < quantity:
        raise ValidationError(
            f"Insufficient stock. Available: {stock_level}"
        )
    
    # Check for existing item
    existing_item = cart.items.filter(
        product=product,
        variant=variant
    ).first()
    
    if existing_item:
        # Update existing item quantity
        new_quantity = existing_item.quantity + quantity
        return CartService.update_quantity(
            cart_item=existing_item,
            quantity=new_quantity
        )
    
    # Create new cart item
    # Get next line number
    max_line = cart.items.aggregate(
        max_line=models.Max('line_number')
    )['max_line'] or 0
    
    cart_item = POSCartItem.objects.create(
        cart=cart,
        product=product,
        variant=variant,
        quantity=quantity,
        line_number=max_line + 1,
        tenant=cart.tenant
    )
    
    # Set prices from product/variant
    cart_item.set_prices_from_product()
    
    # Set tax from product/variant
    cart_item.set_tax_from_product()
    
    # Save with calculated values
    cart_item.save()
    
    # Recalculate cart totals
    cart.recalculate_totals()
    
    return cart_item
```

### Add to Cart Examples

```python
# Example 1: Add simple product
item = CartService.add_to_cart(
    cart=cart,
    product=rice_product,
    quantity=2
)
# Creates: 2x Rice @ ₨500/each = ₨1,000

# Example 2: Add product with variant
item = CartService.add_to_cart(
    cart=cart,
    product=tshirt_product,
    quantity=1,
    variant=large_blue_variant
)
# Creates: 1x T-Shirt (Large, Blue) @ ₨1,500

# Example 3: Add fractional quantity
item = CartService.add_to_cart(
    cart=cart,
    product=fabric_product,
    quantity=Decimal('2.5')
)
# Creates: 2.5 meters of Fabric @ ₨800/meter

# Example 4: Add to existing item
# First add:
item1 = CartService.add_to_cart(cart, product, 2)
# item1.quantity = 2

# Add again:
item2 = CartService.add_to_cart(cart, product, 3)
# item2 is same as item1
# item2.quantity = 5 (2 + 3)

# Example 5: Error handling
try:
    item = CartService.add_to_cart(
        cart=cart,
        product=out_of_stock_product,
        quantity=10
    )
except ValidationError as e:
    print(e.message)
    # "Insufficient stock. Available: 3"
```

### Validation Checks

| Validation | Check | Error Message |
|------------|-------|---------------|
| **Cart Status** | is_modifiable | "Cart not modifiable" |
| **Product Active** | is_active | "Product not active" |
| **Tenant Match** | Same tenant | "Product wrong tenant" |
| **Variant Match** | Belongs to product | "Variant mismatch" |
| **Quantity Valid** | > 0 and <= max | "Invalid quantity" |
| **Stock Available** | quantity <= stock | "Insufficient stock" |

### Business Rules

1. **Stock Validation**
   - Always check before adding
   - Use variant stock if variant provided
   - Otherwise use product stock
   - Prevent overselling

2. **Existing Items**
   - Same product + variant = update quantity
   - Different variant = new line item
   - Accumulate quantities
   - Maintain separate lines

3. **Pricing**
   - Set from product/variant at add time
   - Freeze prices (not affected by future changes)
   - Initialize tax settings
   - Calculate line total

4. **Line Numbers**
   - Auto-assign sequential numbers
   - Used for display order
   - Max + 1 for new items
   - Maintained on updates

5. **Transaction Safety**
   - Use @transaction.atomic
   - Rollback on any error
   - Ensure consistency
   - Recalculate totals after add

### Expected Outcome
```python
# CartService now includes:
@staticmethod
@transaction.atomic
def add_to_cart(cart, product, quantity=1, variant=None):
    """Add product to cart"""
    
    # Validate cart, product, variant, quantity
    # Check stock availability
    # Check for existing item (update or create new)
    # Set prices and tax
    # Assign line number
    # Recalculate cart totals
    # Return cart item
    
    pass
```

### Verification Checklist
- [ ] add_to_cart method added to CartService
- [ ] Method decorated with @transaction.atomic
- [ ] Cart status validation implemented
- [ ] Product validation implemented
- [ ] Variant validation implemented (if provided)
- [ ] Quantity validation implemented
- [ ] Stock availability check implemented
- [ ] Existing item check implemented
- [ ] New item creation implemented
- [ ] Prices set from product/variant
- [ ] Tax set from product/variant
- [ ] Line number assigned
- [ ] Cart totals recalculated
- [ ] Clear error messages for all validations
- [ ] Returns POSCartItem instance

---

## Task 34: Implement update_quantity

### Overview
Implement the `update_quantity` method in CartService to update the quantity of an existing cart item. This method validates the new quantity, checks stock availability, and recalculates all relevant totals.

### Dependencies
- Task 33: add_to_cart implemented

### Purpose
update_quantity method:
- Updates item quantity
- Validates new quantity
- Checks stock availability
- Recalculates line total
- Recalculates cart totals
- Handles removal if quantity is 0

### Instructions

1. **Add update_quantity method**
   - Method: `update_quantity(cart_item, quantity)`
   - Static method with @transaction.atomic
   - Parameters: cart_item, new quantity
   - Returns: Updated POSCartItem or None

2. **Validate cart item**
   - Check cart_item exists
   - Check cart is modifiable
   - Raise error if invalid

3. **Handle zero quantity**
   - If quantity is 0: call remove_from_cart
   - Return None to indicate removal
   - Special case for deletion

4. **Validate new quantity**
   - Convert to Decimal
   - Check quantity > 0
   - Check quantity <= maximum
   - Raise error if invalid

5. **Check stock availability**
   - Get stock from variant or product
   - Compare with new quantity
   - Allow decrease without stock check
   - Check stock only for increases

6. **Update cart item quantity**
   - Set new quantity
   - Recalculate line total (automatic in save)
   - Recalculate tax (automatic in save)
   - Save cart item

7. **Recalculate cart totals**
   - Call cart.recalculate_totals()
   - Update cart-level totals
   - Return updated cart item

8. **Add error handling**
   - Catch validation errors
   - Provide clear messages
   - Rollback on errors

### Update Quantity Flow

```
┌────────────────────────────────────────────────┐
│          Update Quantity Flow                   │
└────────────────────────────────────────────────┘

[update_quantity called]
         │
         ▼
[Validate cart item and cart]
         │
         ├── Invalid ──► [Error: Invalid cart item]
         │
         └── Valid
              │
              ▼
[Check new quantity]
         │
    ┌────┴────┐
    │         │
  [= 0]    [> 0]
    │         │
    ▼         ▼
[Remove   [Validate quantity]
 item]         │
    │          ├── Invalid ──► [Error: Invalid qty]
    │          │
    │          └── Valid
    │               │
    │               ▼
    │         [Quantity increasing?]
    │               │
    │          ┌────┴────┐
    │          │         │
    │        [Yes]      [No]
    │          │         │
    │          ▼         │
    │    [Check stock]  │
    │          │         │
    │          ├── Low ──► [Error: Low stock]
    │          │         │
    │          └─────────┘
    │                    │
    └────────┬───────────┘
             │
             ▼
    [Update quantity field]
             │
             ▼
    [Recalculate line total & tax]
             │
             ▼
    [Recalculate cart totals]
             │
             ▼
    [Return updated item or None]
```

### Implementation Pattern

```python
@staticmethod
@transaction.atomic
def update_quantity(cart_item, quantity):
    """
    Update cart item quantity
    
    Args:
        cart_item: POSCartItem instance
        quantity: New quantity
        
    Returns:
        Updated POSCartItem instance or None if removed
        
    Raises:
        ValidationError: If validation fails
    """
    from django.core.exceptions import ValidationError
    
    # Validate cart item
    if not cart_item:
        raise ValidationError("Cart item not found")
    
    # Validate cart is modifiable
    if not cart_item.cart.is_modifiable:
        raise ValidationError(
            "Cart cannot be modified in current status"
        )
    
    # Handle zero quantity (remove item)
    if quantity == 0 or quantity is None:
        return CartService.remove_from_cart(cart_item)
    
    # Validate quantity
    try:
        new_quantity = Decimal(str(quantity))
    except (ValueError, TypeError):
        raise ValidationError("Invalid quantity")
    
    if new_quantity <= 0:
        raise ValidationError(
            "Quantity must be greater than zero"
        )
    
    if new_quantity > Decimal('9999.999'):
        raise ValidationError(
            "Quantity exceeds maximum allowed"
        )
    
    # Check stock availability if increasing quantity
    if new_quantity > cart_item.quantity:
        # Get available stock
        if cart_item.variant:
            stock_level = cart_item.variant.stock_quantity
        else:
            stock_level = cart_item.product.stock_quantity
        
        # Check availability
        if stock_level < new_quantity:
            raise ValidationError(
                f"Insufficient stock. Available: {stock_level}, "
                f"Requested: {new_quantity}"
            )
    
    # Update quantity
    old_quantity = cart_item.quantity
    cart_item.quantity = new_quantity
    
    # Save (triggers line total and tax recalculation)
    cart_item.save()
    
    # Recalculate cart totals
    cart_item.cart.recalculate_totals()
    
    return cart_item
```

### Update Quantity Examples

```python
# Example 1: Increase quantity
item = cart.items.first()
# Current: quantity = 2, line_total = ₨1,000

updated = CartService.update_quantity(
    cart_item=item,
    quantity=5
)
# Result: quantity = 5, line_total = ₨2,500

# Example 2: Decrease quantity
updated = CartService.update_quantity(
    cart_item=item,
    quantity=1
)
# Result: quantity = 1, line_total = ₨500

# Example 3: Zero quantity (removes item)
result = CartService.update_quantity(
    cart_item=item,
    quantity=0
)
# Result: None (item removed from cart)

# Example 4: Insufficient stock
try:
    updated = CartService.update_quantity(
        cart_item=item,
        quantity=100
    )
except ValidationError as e:
    print(e.message)
    # "Insufficient stock. Available: 10, Requested: 100"

# Example 5: Fractional quantity
updated = CartService.update_quantity(
    cart_item=fabric_item,
    quantity=Decimal('3.75')
)
# Result: quantity = 3.75 meters
```

### Quantity Change Scenarios

```
Scenario 1: Increase Within Stock
Current: 2 units
New: 5 units
Stock: 10 units
Actions:
  - Validate new quantity
  - Check stock: 10 >= 5 ✓
  - Update quantity: 2 → 5
  - Recalculate line total
  - Recalculate cart totals
Result: ✅ Success

Scenario 2: Decrease Quantity
Current: 5 units
New: 2 units
Actions:
  - Validate new quantity
  - No stock check (decreasing)
  - Update quantity: 5 → 2
  - Recalculate line total
  - Recalculate cart totals
Result: ✅ Success

Scenario 3: Zero Quantity
Current: 2 units
New: 0 units
Actions:
  - Detect zero quantity
  - Call remove_from_cart
  - Delete cart item
  - Recalculate cart totals
Result: ✅ Item Removed

Scenario 4: Insufficient Stock
Current: 2 units
New: 20 units
Stock: 10 units
Actions:
  - Validate new quantity
  - Check stock: 10 < 20 ✗
  - Raise ValidationError
Result: ❌ Error: Insufficient stock

Scenario 5: Invalid Quantity
Current: 2 units
New: -5 units
Actions:
  - Validate new quantity
  - Check > 0: -5 ✗
  - Raise ValidationError
Result: ❌ Error: Invalid quantity
```

### Validation Checks

| Validation | Check | Action |
|------------|-------|--------|
| **Cart Modifiable** | is_modifiable | Error if not |
| **Quantity Zero** | quantity == 0 | Remove item |
| **Quantity Positive** | quantity > 0 | Error if not |
| **Quantity Maximum** | quantity <= max | Error if exceeds |
| **Stock (Increase)** | stock >= new_qty | Error if insufficient |
| **Stock (Decrease)** | N/A | No check needed |

### Business Rules

1. **Stock Validation**
   - Check only when increasing quantity
   - Decreases don't need stock check
   - Use variant stock if applicable
   - Otherwise use product stock

2. **Zero Quantity**
   - Treated as removal request
   - Automatically calls remove_from_cart
   - Returns None to indicate removal
   - Cleaner than separate delete call

3. **Quantity Updates**
   - Any positive value allowed
   - Maximum: 9999.999
   - Supports fractional quantities
   - Updates trigger recalculation

4. **Calculations**
   - Line total recalculated automatically (in save)
   - Tax recalculated automatically (in save)
   - Cart totals recalculated explicitly
   - Maintains data consistency

5. **Transaction Safety**
   - Use @transaction.atomic
   - Rollback on any error
   - No partial updates
   - Ensure cart integrity

### Expected Outcome
```python
# CartService now includes:
@staticmethod
@transaction.atomic
def update_quantity(cart_item, quantity):
    """Update cart item quantity"""
    
    # Validate cart item and cart
    # Handle zero quantity (remove item)
    # Validate new quantity
    # Check stock if increasing
    # Update quantity field
    # Save (triggers recalculations)
    # Recalculate cart totals
    # Return updated item or None
    
    pass
```

### Verification Checklist
- [ ] update_quantity method added to CartService
- [ ] Method decorated with @transaction.atomic
- [ ] Cart item validation implemented
- [ ] Cart modifiable check implemented
- [ ] Zero quantity handled (calls remove_from_cart)
- [ ] Quantity validation implemented
- [ ] Stock check for increases implemented
- [ ] No stock check for decreases
- [ ] Quantity field updated
- [ ] Line total recalculated (via save)
- [ ] Tax recalculated (via save)
- [ ] Cart totals recalculated
- [ ] Returns updated item or None
- [ ] Clear error messages for validations

---

## Task 35: Implement remove_from_cart

### Overview
Implement the `remove_from_cart` method in CartService to remove items from the cart. This method handles item deletion and updates cart totals accordingly.

### Dependencies
- Task 34: update_quantity implemented

### Purpose
remove_from_cart method:
- Removes items from cart
- Validates removal permissions
- Updates cart totals
- Maintains cart integrity
- Handles empty cart state

### Instructions

1. **Add remove_from_cart method**
   - Method: `remove_from_cart(cart_item)`
   - Static method with @transaction.atomic
   - Parameter: cart_item to remove
   - Returns: Boolean success

2. **Validate cart item**
   - Check cart_item exists
   - Check cart is modifiable
   - Raise error if invalid

3. **Store cart reference**
   - Get cart before deletion
   - Needed for recalculation after delete

4. **Delete cart item**
   - Call cart_item.delete()
   - Django handles cascade
   - Remove from database

5. **Recalculate cart totals**
   - Call cart.recalculate_totals()
   - Update cart-level totals
   - Handle empty cart case

6. **Return success**
   - Return True if successful
   - Return False if error (shouldn't happen with validation)

7. **Add error handling**
   - Catch delete errors
   - Provide clear messages
   - Rollback on errors

### Remove from Cart Flow

```
┌────────────────────────────────────────────────┐
│         Remove from Cart Flow                   │
└────────────────────────────────────────────────┘

[remove_from_cart called]
         │
         ▼
[Validate cart item exists]
         │
         ├── No ──► [Error: Item not found]
         │
         └── Yes
              │
              ▼
[Validate cart is modifiable]
         │
         ├── No ──► [Error: Cart not modifiable]
         │
         └── Yes
              │
              ▼
[Store cart reference]
         │
         ▼
[Delete cart item]
         │
         ▼
[Recalculate cart totals]
         │
         ▼
[Check if cart is empty?]
         │
    ┌────┴────┐
    │         │
  [Yes]      [No]
    │         │
    ▼         ▼
[Totals   [Normal
 = 0]      totals]
    │         │
    └────┬────┘
         │
         ▼
[Return True]
```

### Implementation Pattern

```python
@staticmethod
@transaction.atomic
def remove_from_cart(cart_item):
    """
    Remove item from cart
    
    Args:
        cart_item: POSCartItem instance to remove
        
    Returns:
        Boolean success (True if removed)
        
    Raises:
        ValidationError: If validation fails
    """
    from django.core.exceptions import ValidationError
    
    # Validate cart item
    if not cart_item:
        raise ValidationError("Cart item not found")
    
    # Validate cart is modifiable
    if not cart_item.cart.is_modifiable:
        raise ValidationError(
            "Cart cannot be modified in current status"
        )
    
    # Store cart reference before deletion
    cart = cart_item.cart
    
    # Delete cart item
    cart_item.delete()
    
    # Recalculate cart totals
    cart.recalculate_totals()
    
    return True
```

### Remove from Cart Examples

```python
# Example 1: Remove single item
item = cart.items.first()
success = CartService.remove_from_cart(item)
# Result: True, item removed

# Example 2: Remove from completed cart (error)
completed_cart = POSCart.objects.get(
    status='COMPLETED'
)
item = completed_cart.items.first()

try:
    CartService.remove_from_cart(item)
except ValidationError as e:
    print(e.message)
    # "Cart cannot be modified in current status"

# Example 3: Remove all items
for item in cart.items.all():
    CartService.remove_from_cart(item)
# Result: Empty cart with all totals = 0

# Example 4: Alternative via update_quantity
success = CartService.update_quantity(
    cart_item=item,
    quantity=0
)
# Result: None (item removed)
# Internally calls remove_from_cart

# Example 5: Clear cart helper
def clear_cart(cart):
    """Remove all items from cart"""
    for item in cart.items.all():
        CartService.remove_from_cart(item)
    return cart.items.count() == 0
```

### Remove Item Scenarios

```
Scenario 1: Remove Single Item
Cart:
  - Item 1: ₨1,000
  - Item 2: ₨500
  - Subtotal: ₨1,500

Action: Remove Item 1
Result:
  - Item 2: ₨500
  - Subtotal: ₨500
  ✅ Success

Scenario 2: Remove Last Item
Cart:
  - Item 1: ₨1,000
  - Subtotal: ₨1,000

Action: Remove Item 1
Result:
  - Items: 0
  - Subtotal: ₨0.00
  - Tax: ₨0.00
  - Grand Total: ₨0.00
  ✅ Success (Empty cart)

Scenario 3: Remove from Completed Cart
Cart Status: COMPLETED
Action: Remove Item 1
Result:
  ❌ Error: "Cart not modifiable"

Scenario 4: Remove Invalid Item
Cart Item: Doesn't exist
Action: Remove
Result:
  ❌ Error: "Cart item not found"
```

### Empty Cart Handling

```python
# After removing last item:
cart.items.count()  # 0
cart.subtotal       # Decimal('0.00')
cart.discount_total # Decimal('0.00')
cart.tax_total      # Decimal('0.00')
cart.grand_total    # Decimal('0.00')
cart.status         # Still 'ACTIVE'

# Cart remains active but empty
# Can add new items
# Can be held or voided
```

### Business Rules

1. **Modifiable Check**
   - Only ACTIVE or HELD carts
   - Cannot remove from COMPLETED
   - Cannot remove from VOIDED
   - Clear validation error

2. **Deletion**
   - Hard delete (not soft delete)
   - Immediate removal
   - No undo available
   - Transaction-safe

3. **Empty Cart**
   - Cart remains after all items removed
   - All totals reset to 0
   - Status unchanged
   - Can add new items

4. **Recalculation**
   - Always recalculate after remove
   - Update all cart totals
   - Handle empty cart case
   - Maintain consistency

5. **Transaction Safety**
   - Use @transaction.atomic
   - Rollback on error
   - No orphaned items
   - Ensure integrity

### Alternative Removal Methods

```python
# Method 1: Direct remove_from_cart
CartService.remove_from_cart(cart_item)

# Method 2: Via update_quantity
CartService.update_quantity(cart_item, 0)

# Method 3: Direct delete (not recommended)
cart_item.delete()
cart.recalculate_totals()  # Must call manually!

# Method 4: Clear entire cart
for item in cart.items.all():
    CartService.remove_from_cart(item)

# Recommendation: Use Method 1 or 2
# Method 1: Explicit and clear
# Method 2: Consistent with quantity updates
```

### Expected Outcome
```python
# CartService now includes:
@staticmethod
@transaction.atomic
def remove_from_cart(cart_item):
    """Remove item from cart"""
    
    # Validate cart item exists
    # Validate cart is modifiable
    # Store cart reference
    # Delete cart item
    # Recalculate cart totals
    # Return True
    
    pass
```

### Verification Checklist
- [ ] remove_from_cart method added to CartService
- [ ] Method decorated with @transaction.atomic
- [ ] Cart item validation implemented
- [ ] Cart modifiable check implemented
- [ ] Cart reference stored before delete
- [ ] Cart item deleted
- [ ] Cart totals recalculated after delete
- [ ] Returns Boolean success
- [ ] Handles empty cart case correctly
- [ ] Clear error messages for validations

---

## Task 36: Implement apply_line_discount

### Overview
Implement the `apply_line_discount` method in CartService to apply discounts to individual cart items. This method handles percentage and fixed discounts at the line level.

### Dependencies
- Task 35: remove_from_cart implemented
- POSCartItem discount fields complete

### Purpose
apply_line_discount method:
- Applies discounts to line items
- Supports PERCENT and FIXED types
- Validates discount values
- Recalculates pricing
- Updates cart totals

### Instructions

1. **Add apply_line_discount method**
   - Method: `apply_line_discount(cart_item, discount_type, discount_value, reason=None)`
   - Static method with @transaction.atomic
   - Parameters: cart_item, type, value, optional reason
   - Returns: Updated POSCartItem

2. **Validate cart item**
   - Check cart_item exists
   - Check cart is modifiable
   - Raise error if invalid

3. **Validate discount type**
   - Must be PERCENT or FIXED
   - Check against DISCOUNT_TYPE_CHOICES
   - Raise error if invalid

4. **Validate discount value**
   - For PERCENT: 0-100 range
   - For FIXED: <= original_price
   - Convert to Decimal
   - Raise error if invalid

5. **Apply discount to cart item**
   - Call cart_item.apply_discount(...)
   - This updates discount fields
   - Recalculates unit_price
   - Recalculates line_total

6. **Recalculate cart totals**
   - Call cart.recalculate_totals()
   - Update cart-level discount_total
   - Return updated cart_item

7. **Add error handling**
   - Catch validation errors
   - Provide clear messages
   - Rollback on errors

### Apply Line Discount Flow

```
┌────────────────────────────────────────────────┐
│        Apply Line Discount Flow                 │
└────────────────────────────────────────────────┘

[apply_line_discount called]
         │
         ▼
[Validate cart item and cart]
         │
         ├── Invalid ──► [Error: Invalid item/cart]
         │
         └── Valid
              │
              ▼
[Validate discount type]
         │
    ┌────┴────┐
    │         │
[PERCENT]  [FIXED]
    │         │
    │         ▼
    │    [Validate 0-100]
    │         │
    │         ├── Invalid ──► [Error: Invalid percentage]
    │         │
    ▼         ▼
[Validate <= original_price]
         │
         ├── Invalid ──► [Error: Exceeds price]
         │
         └── Valid
              │
              ▼
[Call cart_item.apply_discount()]
         │
         ├─ Set discount fields
         ├─ Calculate discount_amount
         ├─ Update unit_price
         └─ Recalculate line_total
              │
              ▼
[Recalculate cart totals]
         │
         ▼
[Return updated cart_item]
```

### Implementation Pattern

```python
@staticmethod
@transaction.atomic
def apply_line_discount(cart_item, discount_type, discount_value, reason=None):
    """
    Apply discount to cart item
    
    Args:
        cart_item: POSCartItem instance
        discount_type: 'PERCENT' or 'FIXED'
        discount_value: Discount value (percentage or amount)
        reason: Optional discount reason
        
    Returns:
        Updated POSCartItem instance
        
    Raises:
        ValidationError: If validation fails
    """
    from django.core.exceptions import ValidationError
    from apps.pos.constants import (
        DISCOUNT_TYPE_PERCENT,
        DISCOUNT_TYPE_FIXED
    )
    
    # Validate cart item
    if not cart_item:
        raise ValidationError("Cart item not found")
    
    # Validate cart is modifiable
    if not cart_item.cart.is_modifiable:
        raise ValidationError(
            "Cart cannot be modified in current status"
        )
    
    # Validate discount type
    if discount_type not in [DISCOUNT_TYPE_PERCENT, DISCOUNT_TYPE_FIXED]:
        raise ValidationError(
            f"Invalid discount type: {discount_type}"
        )
    
    # Validate discount value
    try:
        discount_value = Decimal(str(discount_value))
    except (ValueError, TypeError):
        raise ValidationError("Invalid discount value")
    
    if discount_value < 0:
        raise ValidationError(
            "Discount value cannot be negative"
        )
    
    if discount_type == DISCOUNT_TYPE_PERCENT:
        if not (0 <= discount_value <= 100):
            raise ValidationError(
                "Percentage must be between 0 and 100"
            )
    else:  # FIXED
        if discount_value > cart_item.original_price:
            raise ValidationError(
                "Discount cannot exceed original price"
            )
    
    # Apply discount to cart item
    cart_item.apply_discount(
        discount_type=discount_type,
        discount_value=discount_value,
        reason=reason
    )
    
    # Recalculate cart totals
    cart_item.cart.recalculate_totals()
    
    return cart_item
```

### Apply Line Discount Examples

```python
# Example 1: Apply percentage discount
item = cart.items.first()
# Original: ₨1,000

updated = CartService.apply_line_discount(
    cart_item=item,
    discount_type='PERCENT',
    discount_value=10,
    reason='Loyalty discount'
)
# Result:
# - original_price: ₨1,000
# - discount_amount: ₨100
# - unit_price: ₨900
# - discount_reason: 'Loyalty discount'

# Example 2: Apply fixed discount
updated = CartService.apply_line_discount(
    cart_item=item,
    discount_type='FIXED',
    discount_value=150,
    reason='Damaged item'
)
# Result:
# - original_price: ₨1,000
# - discount_amount: ₨150
# - unit_price: ₨850

# Example 3: Remove discount
updated = CartService.apply_line_discount(
    cart_item=item,
    discount_type='PERCENT',
    discount_value=0
)
# Result: No discount (restored to original price)

# Example 4: Error handling
try:
    CartService.apply_line_discount(
        cart_item=item,
        discount_type='PERCENT',
        discount_value=150  # Invalid: > 100
    )
except ValidationError as e:
    print(e.message)
    # "Percentage must be between 0 and 100"

# Example 5: Multiple items with different discounts
for item in cart.items.all():
    if item.product.category == 'Clearance':
        CartService.apply_line_discount(
            item, 'PERCENT', 50, 'Clearance sale'
        )
```

### Line Discount Scenarios

```
Scenario 1: Percentage Discount
Product: Laptop
Original Price: ₨75,000
Quantity: 1
Discount: 10%
Result:
  - discount_amount: ₨7,500
  - unit_price: ₨67,500
  - line_total: ₨67,500
  ✅ Success

Scenario 2: Fixed Discount
Product: T-Shirt
Original Price: ₨1,500
Quantity: 2
Discount: ₨200 per unit
Result:
  - discount_amount: ₨200
  - unit_price: ₨1,300
  - line_total: ₨2,600 (2 × ₨1,300)
  ✅ Success

Scenario 3: Invalid Percentage
Discount: 150%
Result:
  ❌ Error: "Percentage must be between 0 and 100"

Scenario 4: Discount Exceeds Price
Original Price: ₨1,000
Discount: ₨1,500 (fixed)
Result:
  ❌ Error: "Discount cannot exceed original price"

Scenario 5: Multiple Discounts
Item 1: 10% off (Loyalty)
Item 2: ₨500 off (Manager override)
Item 3: No discount
Result: Each item has individual discount
  ✅ Success
```

### Discount Priority

```
Line Discount vs Cart Discount:

1. Apply line discounts first
   - Item 1: ₨1,000 → 10% off → ₨900
   - Item 2: ₨500 → ₨50 off → ₨450
   - Subtotal: ₨1,350

2. Then apply cart discount
   - Cart discount: 5%
   - Apply to subtotal: ₨1,350 × 5% = ₨67.50
   - After cart discount: ₨1,282.50

3. Calculate tax
   - Tax on ₨1,282.50
   - Grand total with tax

Total Discounts:
- Line discounts: ₨150
- Cart discount: ₨67.50
- Total saved: ₨217.50
```

### Business Rules

1. **Discount Types**
   - PERCENT: Percentage of original price
   - FIXED: Absolute amount per unit
   - Only one discount per line
   - Can be updated or removed

2. **Validation**
   - Percentage: 0-100 range
   - Fixed: Cannot exceed original price
   - Value must be non-negative
   - Type must be valid constant

3. **Price Calculation**
   - discount_amount = calculated discount
   - unit_price = original_price - discount_amount
   - line_total = unit_price × quantity
   - Tax calculated on discounted price

4. **Reason Tracking**
   - Optional but recommended
   - Audit trail for discounts
   - Displayed on receipts
   - Required for manager overrides

5. **Transaction Safety**
   - Use @transaction.atomic
   - Rollback on validation error
   - Recalculate cart totals
   - Maintain consistency

### Expected Outcome
```python
# CartService now includes:
@staticmethod
@transaction.atomic
def apply_line_discount(cart_item, discount_type, discount_value, reason=None):
    """Apply discount to cart item"""
    
    # Validate cart item and cart
    # Validate discount type
    # Validate discount value based on type
    # Apply discount to cart item
    # Recalculate cart totals
    # Return updated cart item
    
    pass
```

### Verification Checklist
- [ ] apply_line_discount method added to CartService
- [ ] Method decorated with @transaction.atomic
- [ ] Cart item validation implemented
- [ ] Cart modifiable check implemented
- [ ] Discount type validation implemented
- [ ] Discount value validation for PERCENT type
- [ ] Discount value validation for FIXED type
- [ ] Calls cart_item.apply_discount method
- [ ] Cart totals recalculated
- [ ] Returns updated cart item
- [ ] Clear error messages for all validations

---

## Task 37: Implement apply_cart_discount

### Overview
Implement the `apply_cart_discount` method in CartService to apply discounts at the cart level. This discount applies to the entire cart after all line item discounts.

### Dependencies
- Task 36: apply_line_discount implemented

### Purpose
apply_cart_discount method:
- Applies cart-level discounts
- Supports PERCENT and FIXED types
- Applied after line discounts
- Recalculates cart totals
- Tracks coupon codes

### Instructions

1. **Add apply_cart_discount method**
   - Method: `apply_cart_discount(cart, discount_type, discount_value, reason=None, coupon_code=None)`
   - Static method with @transaction.atomic
   - Parameters: cart, type, value, reason, coupon
   - Returns: Updated POSCart

2. **Validate cart**
   - Check cart exists
   - Check cart is modifiable
   - Raise error if invalid

3. **Validate discount type**
   - Must be PERCENT or FIXED
   - Check against constants
   - Raise error if invalid

4. **Validate discount value**
   - For PERCENT: 0-100 range
   - For FIXED: reasonable amount
   - Convert to Decimal
   - Raise error if invalid

5. **Set cart discount fields**
   - cart.cart_discount_type
   - cart.cart_discount_value
   - cart.cart_discount_reason
   - cart.coupon_code (if provided)

6. **Calculate cart discount amount**
   - Call cart.calculate_cart_discount()
   - Updates cart_discount_amount
   - Based on current subtotal

7. **Recalculate cart totals**
   - Call cart.recalculate_totals()
   - Applies discount to grand_total
   - Save cart

8. **Return updated cart**
   - Return cart instance
   - With updated discount fields

### Apply Cart Discount Flow

```
┌────────────────────────────────────────────────┐
│       Apply Cart Discount Flow                  │
└────────────────────────────────────────────────┘

[apply_cart_discount called]
         │
         ▼
[Validate cart is modifiable]
         │
         ├── Invalid ──► [Error: Cart not modifiable]
         │
         └── Valid
              │
              ▼
[Validate discount type]
         │
    ┌────┴────┐
    │         │
[PERCENT]  [FIXED]
    │         │
    │         ▼
    │    [Validate 0-100]
    │         │
    ▼         ▼
[Validate value]
         │
         └── Valid
              │
              ▼
[Set cart discount fields]
  - cart_discount_type
  - cart_discount_value
  - cart_discount_reason
  - coupon_code
         │
         ▼
[Calculate cart_discount_amount]
  (subtotal × percentage OR fixed amount)
         │
         ▼
[Recalculate cart totals]
  - Apply discount to subtotal
  - Recalculate tax
  - Update grand_total
         │
         ▼
[Save and return cart]
```

### Implementation Pattern

```python
@staticmethod
@transaction.atomic
def apply_cart_discount(cart, discount_type, discount_value, 
                       reason=None, coupon_code=None):
    """
    Apply discount to entire cart
    
    Args:
        cart: POSCart instance
        discount_type: 'PERCENT' or 'FIXED'
        discount_value: Discount value
        reason: Optional discount reason
        coupon_code: Optional coupon code
        
    Returns:
        Updated POSCart instance
        
    Raises:
        ValidationError: If validation fails
    """
    from django.core.exceptions import ValidationError
    from apps.pos.constants import (
        DISCOUNT_TYPE_PERCENT,
        DISCOUNT_TYPE_FIXED
    )
    
    # Validate cart
    if not cart:
        raise ValidationError("Cart not found")
    
    # Validate cart is modifiable
    if not cart.is_modifiable:
        raise ValidationError(
            "Cart cannot be modified in current status"
        )
    
    # Validate discount type
    if discount_type not in [DISCOUNT_TYPE_PERCENT, DISCOUNT_TYPE_FIXED]:
        raise ValidationError(
            f"Invalid discount type: {discount_type}"
        )
    
    # Validate discount value
    try:
        discount_value = Decimal(str(discount_value))
    except (ValueError, TypeError):
        raise ValidationError("Invalid discount value")
    
    if discount_value < 0:
        raise ValidationError(
            "Discount value cannot be negative"
        )
    
    if discount_type == DISCOUNT_TYPE_PERCENT:
        if not (0 <= discount_value <= 100):
            raise ValidationError(
                "Percentage must be between 0 and 100"
            )
    else:  # FIXED
        # Calculate current subtotal for validation
        cart.recalculate_totals()
        if discount_value > cart.subtotal:
            raise ValidationError(
                f"Discount (₨{discount_value}) exceeds "
                f"cart subtotal (₨{cart.subtotal})"
            )
    
    # Set cart discount fields
    cart.cart_discount_type = discount_type
    cart.cart_discount_value = discount_value
    cart.cart_discount_reason = reason
    cart.coupon_code = coupon_code
    
    # Calculate discount amount
    cart.calculate_cart_discount()
    
    # Recalculate cart totals
    cart.recalculate_totals()
    
    # Save cart
    cart.save()
    
    return cart
```

### Apply Cart Discount Examples

```python
# Example 1: Apply percentage discount
cart = CartService.get_active_cart(session)
# Subtotal: ₨2,500

updated = CartService.apply_cart_discount(
    cart=cart,
    discount_type='PERCENT',
    discount_value=10,
    reason='New customer discount'
)
# Result:
# - cart_discount_amount: ₨250
# - After discount: ₨2,250

# Example 2: Apply fixed discount
updated = CartService.apply_cart_discount(
    cart=cart,
    discount_type='FIXED',
    discount_value=500,
    reason='Loyalty reward'
)
# Result:
# - cart_discount_amount: ₨500
# - After discount: ₨2,000

# Example 3: Apply with coupon code
updated = CartService.apply_cart_discount(
    cart=cart,
    discount_type='PERCENT',
    discount_value=15,
    reason='Promotional discount',
    coupon_code='SAVE15'
)
# Result:
# - cart_discount_amount: ₨375
# - coupon_code: 'SAVE15'
# - After discount: ₨2,125

# Example 4: Remove cart discount
updated = CartService.apply_cart_discount(
    cart=cart,
    discount_type='PERCENT',
    discount_value=0
)
# Result: No cart discount

# Example 5: Error handling
try:
    CartService.apply_cart_discount(
        cart=cart,
        discount_type='FIXED',
        discount_value=5000  # Exceeds subtotal
    )
except ValidationError as e:
    print(e.message)
    # "Discount exceeds cart subtotal"
```

### Cart Discount Scenarios

```
Scenario 1: Percentage Discount
Cart:
  - Item 1: ₨1,000 (after line discount)
  - Item 2: ₨1,500 (after line discount)
  - Subtotal: ₨2,500
Cart Discount: 10%
Result:
  - cart_discount_amount: ₨250
  - After discount: ₨2,250
  - Tax (18%): ₨405
  - Grand Total: ₨2,655
  ✅ Success

Scenario 2: Fixed Discount with Coupon
Subtotal: ₨3,000
Cart Discount: ₨500 (Coupon: SAVE500)
Result:
  - cart_discount_amount: ₨500
  - coupon_code: 'SAVE500'
  - After discount: ₨2,500
  - Tax: ₨450
  - Grand Total: ₨2,950
  ✅ Success

Scenario 3: Line + Cart Discounts
Item 1: ₨1,000 → 10% line discount → ₨900
Item 2: ₨500 → No discount → ₨500
Subtotal: ₨1,400
Cart Discount: 5%
Result:
  - Line discounts: ₨100
  - Cart discount: ₨70 (5% of ₨1,400)
  - Total discounts: ₨170
  - After all discounts: ₨1,330
  ✅ Success

Scenario 4: Discount Exceeds Subtotal
Subtotal: ₨1,000
Cart Discount: ₨1,500 (fixed)
Result:
  ❌ Error: "Discount exceeds cart subtotal"

Scenario 5: Update Existing Discount
Current: 10% discount
Update: 15% discount
Result:
  - Previous discount replaced
  - New discount: 15%
  - Recalculated totals
  ✅ Success
```

### Discount Calculation Order

```
┌────────────────────────────────────────────────┐
│        Complete Discount Calculation            │
└────────────────────────────────────────────────┘

Step 1: Calculate Line Totals
  Item 1: Qty 2 × ₨500 = ₨1,000
  Item 2: Qty 1 × ₨750 = ₨750
  
Step 2: Apply Line Discounts
  Item 1: 10% off → ₨900
  Item 2: ₨50 off → ₨700
  
Step 3: Calculate Subtotal
  Subtotal = ₨900 + ₨700 = ₨1,600
  
Step 4: Apply Cart Discount
  Cart Discount: 5%
  Discount Amount: ₨1,600 × 5% = ₨80
  
Step 5: Calculate Discounted Subtotal
  After Discount: ₨1,600 - ₨80 = ₨1,520
  
Step 6: Calculate Tax
  Tax (18%): ₨1,520 × 18% = ₨273.60
  
Step 7: Calculate Grand Total
  Grand Total: ₨1,520 + ₨273.60 = ₨1,793.60

Summary:
  Original Total: ₨1,750
  Line Discounts: ₨150
  Cart Discount: ₨80
  Total Saved: ₨230
  Tax: ₨273.60
  Final: ₨1,793.60
```

### Business Rules

1. **Discount Application**
   - Applied after line discounts
   - Applied to subtotal
   - Before tax calculation
   - Can coexist with line discounts

2. **Discount Types**
   - PERCENT: Percentage of subtotal
   - FIXED: Absolute amount
   - Only one cart discount at a time
   - Can be updated or removed

3. **Validation**
   - Percentage: 0-100 range
   - Fixed: Cannot exceed subtotal
   - Value must be non-negative
   - Recalculate before applying

4. **Coupon Codes**
   - Optional but recommended
   - Links to promotions system
   - Tracked for reporting
   - Validated externally

5. **Transaction Safety**
   - Use @transaction.atomic
   - Recalculate before validation
   - Update all totals
   - Save cart with new values

### Expected Outcome
```python
# CartService now includes:
@staticmethod
@transaction.atomic
def apply_cart_discount(cart, discount_type, discount_value, 
                       reason=None, coupon_code=None):
    """Apply discount to entire cart"""
    
    # Validate cart
    # Validate discount type and value
    # Set cart discount fields
    # Calculate cart discount amount
    # Recalculate cart totals
    # Save and return cart
    
    pass
```

### Verification Checklist
- [ ] apply_cart_discount method added to CartService
- [ ] Method decorated with @transaction.atomic
- [ ] Cart validation implemented
- [ ] Cart modifiable check implemented
- [ ] Discount type validation implemented
- [ ] Discount value validation for PERCENT type
- [ ] Discount value validation for FIXED type
- [ ] Cart discount fields updated
- [ ] calculate_cart_discount called
- [ ] Cart totals recalculated
- [ ] Cart saved
- [ ] Returns updated cart
- [ ] Clear error messages for validations

---

## Task 38: Implement calculate_totals

### Overview
Implement the `calculate_totals` method to recalculate all cart totals. This method orchestrates the complete calculation of subtotal, discounts, taxes, and grand total, ensuring cart financial accuracy.

### Dependencies
- Task 37: apply_cart_discount implemented
- All POSCart and POSCartItem fields complete

### Purpose
calculate_totals method:
- Recalculates all cart totals
- Aggregates line item totals
- Applies cart discount
- Sums taxes
- Calculates grand total
- Ensures data consistency

### Instructions

1. **Add calculate_totals method**
   - Method: `calculate_totals(cart)`
   - Static method with @transaction.atomic
   - Parameter: cart instance
   - Returns: Updated POSCart

2. **Calculate line totals**
   - Iterate all cart items
   - Ensure each item's line_total is current
   - Call item.calculate_line_total() if needed
   - Store results for aggregation

3. **Calculate subtotal**
   - Sum all item line_totals
   - cart.subtotal = sum(item.line_total for item in items)
   - This is before cart discount

4. **Calculate line discount total**
   - Sum all item discount amounts
   - Sum item.discount_amount × item.quantity for each item
   - Store as part of discount_total

5. **Apply cart discount**
   - Call cart.calculate_cart_discount()
   - Calculate based on subtotal
   - Add to total discount_total

6. **Calculate total discount**
   - discount_total = line_discounts + cart_discount
   - Store in cart.discount_total

7. **Calculate tax total**
   - Sum all item tax_amount
   - cart.tax_total = sum(item.tax_amount for item in items)
   - Tax already calculated on discounted prices

8. **Calculate grand total**
   - grand_total = subtotal - discount_total + tax_total
   - Alternative: subtotal - cart_discount + tax_total
   - Ensure non-negative

9. **Save cart**
   - Save all calculated fields
   - Return updated cart

10. **Add to POSCart model**
    - Implement `recalculate_totals()` on POSCart
    - Calls CartService.calculate_totals(self)
    - Convenient instance method

### Total Calculation Flow

```
┌────────────────────────────────────────────────┐
│          Total Calculation Flow                 │
└────────────────────────────────────────────────┘

[calculate_totals called]
         │
         ▼
[For each cart item:]
  ├─ Ensure line_total current
  ├─ Ensure tax_amount current
  └─ Collect for aggregation
         │
         ▼
[Calculate Subtotal]
  Sum of all line_totals
         │
         ▼
[Calculate Line Discounts Total]
  Sum of (item.discount_amount × item.quantity)
         │
         ▼
[Calculate Cart Discount]
  Based on subtotal
  - PERCENT: subtotal × (value / 100)
  - FIXED: value
         │
         ▼
[Calculate Total Discount]
  line_discounts + cart_discount
         │
         ▼
[Calculate Tax Total]
  Sum of all item.tax_amount
         │
         ▼
[Calculate Grand Total]
  subtotal - discount_total + tax_total
         │
         ▼
[Save cart with updated totals]
         │
         ▼
[Return updated cart]
```

### Implementation Pattern

```python
@staticmethod
@transaction.atomic
def calculate_totals(cart):
    """
    Recalculate all cart totals
    
    Args:
        cart: POSCart instance
        
    Returns:
        Updated POSCart instance with recalculated totals
    """
    from django.db.models import Sum
    from decimal import Decimal, ROUND_HALF_UP
    
    # Get all cart items
    items = cart.items.all()
    
    # Ensure all item totals are current
    for item in items:
        item.calculate_line_total()
        item.calculate_tax()
        item.save()
    
    # Calculate subtotal (sum of line totals)
    subtotal = items.aggregate(
        total=Sum('line_total')
    )['total'] or Decimal('0.00')
    
    cart.subtotal = subtotal.quantize(
        Decimal('0.01'),
        rounding=ROUND_HALF_UP
    )
    
    # Calculate line discount total
    line_discount_total = Decimal('0.00')
    for item in items:
        item_discount = item.discount_amount * item.quantity
        line_discount_total += item_discount
    
    # Calculate cart discount
    cart.calculate_cart_discount()
    cart_discount = cart.cart_discount_amount
    
    # Total discount
    cart.discount_total = (line_discount_total + cart_discount).quantize(
        Decimal('0.01'),
        rounding=ROUND_HALF_UP
    )
    
    # Calculate tax total (sum of item taxes)
    tax_total = items.aggregate(
        total=Sum('tax_amount')
    )['total'] or Decimal('0.00')
    
    cart.tax_total = tax_total.quantize(
        Decimal('0.01'),
        rounding=ROUND_HALF_UP
    )
    
    # Calculate grand total
    # Formula: subtotal - cart_discount + tax_total
    # (Line discounts already applied to line_totals)
    grand_total = cart.subtotal - cart_discount + cart.tax_total
    
    cart.grand_total = grand_total.quantize(
        Decimal('0.01'),
        rounding=ROUND_HALF_UP
    )
    
    # Ensure grand total is non-negative
    if cart.grand_total < Decimal('0.00'):
        cart.grand_total = Decimal('0.00')
    
    # Save cart
    cart.save()
    
    return cart


# Add to POSCart model:
class POSCart(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    def recalculate_totals(self):
        """Recalculate all cart totals"""
        from apps.pos.cart.services import CartService
        return CartService.calculate_totals(self)
```

### Calculation Examples

```
Example 1: Simple Cart
Item 1: Qty 2 × ₨500 = ₨1,000
Item 2: Qty 1 × ₨750 = ₨750
Subtotal: ₨1,750
No discounts
Tax (18%): ₨315
Grand Total: ₨2,065

Calculation:
  subtotal = ₨1,750
  discount_total = ₨0
  tax_total = ₨315
  grand_total = ₨1,750 + ₨315 = ₨2,065

Example 2: With Line Discounts
Item 1: ₨1,000 - 10% = ₨900
Item 2: ₨750 - ₨50 = ₨700
Subtotal: ₨1,600
Line Discounts: ₨150
Tax (18%): ₨288
Grand Total: ₨1,888

Calculation:
  subtotal = ₨1,600 (already discounted)
  discount_total = ₨150 (line discounts)
  tax_total = ₨288 (on discounted amounts)
  grand_total = ₨1,600 + ₨288 = ₨1,888

Example 3: With Cart Discount
Subtotal: ₨2,500
Cart Discount: 10% (₨250)
Tax (18%): ₨405
Grand Total: ₨2,655

Calculation:
  subtotal = ₨2,500
  cart_discount = ₨250
  discount_total = ₨250
  tax_total = ₨405 (on ₨2,250)
  grand_total = ₨2,500 - ₨250 + ₨405 = ₨2,655

Example 4: Both Discounts
Item 1: ₨1,000 - 10% = ₨900
Item 2: ₨750 - ₨50 = ₨700
Subtotal: ₨1,600 (after line discounts)
Cart Discount: 5% (₨80)
Tax (18%): ₨273.60
Grand Total: ₨1,793.60

Calculation:
  subtotal = ₨1,600
  line_discount = ₨150
  cart_discount = ₨80
  discount_total = ₨230
  tax_total = ₨273.60 (on ₨1,520)
  grand_total = ₨1,600 - ₨80 + ₨273.60 = ₨1,793.60
```

### Calculation Formula

```
Given:
- Each item has: quantity, unit_price, discount_amount, tax_amount
- Cart has: cart_discount_type, cart_discount_value

Calculate:

1. Subtotal = Σ(item.line_total)
   where line_total = quantity × unit_price

2. Line Discount Total = Σ(item.discount_amount × item.quantity)

3. Cart Discount:
   if cart_discount_type == 'PERCENT':
     cart_discount = subtotal × (cart_discount_value / 100)
   else:
     cart_discount = cart_discount_value

4. Total Discount = Line Discount Total + Cart Discount

5. Tax Total = Σ(item.tax_amount)
   (Tax already calculated on discounted prices)

6. Grand Total = Subtotal - Cart Discount + Tax Total
   Alternative: Subtotal + Tax Total - Total Discount
```

### Business Rules

1. **Calculation Order**
   - Line totals first (quantity × unit_price)
   - Aggregate subtotal
   - Calculate discounts
   - Calculate tax (on discounted prices)
   - Calculate grand total

2. **Discount Handling**
   - Line discounts: Already in unit_price
   - Cart discount: Applied to subtotal
   - Both tracked separately
   - Sum for total discount_total

3. **Tax Calculation**
   - Applied after all discounts
   - Tax on discounted prices
   - Sum all item taxes
   - No cart-level tax rate

4. **Precision**
   - Use Decimal throughout
   - Round to 2 decimal places
   - Use ROUND_HALF_UP
   - Ensure non-negative grand total

5. **Transaction Safety**
   - Use @transaction.atomic
   - Recalculate all items first
   - Update cart fields
   - Save once at end

### Recalculation Triggers

```python
# When to call recalculate_totals():

1. After adding item:
   CartService.add_to_cart(...) → recalculate_totals()

2. After updating quantity:
   CartService.update_quantity(...) → recalculate_totals()

3. After removing item:
   CartService.remove_from_cart(...) → recalculate_totals()

4. After applying line discount:
   CartService.apply_line_discount(...) → recalculate_totals()

5. After applying cart discount:
   CartService.apply_cart_discount(...) → recalculate_totals()

6. Manual recalculation:
   cart.recalculate_totals()
```

### Expected Outcome
```python
# CartService now includes:
@staticmethod
@transaction.atomic
def calculate_totals(cart):
    """Recalculate all cart totals"""
    
    # Recalculate all item totals
    # Calculate subtotal (sum of line_totals)
    # Calculate line discount total
    # Calculate cart discount
    # Calculate total discount
    # Calculate tax total (sum of item taxes)
    # Calculate grand total
    # Save cart
    # Return cart
    
    pass

# POSCart model now includes:
def recalculate_totals(self):
    """Convenience method to recalculate totals"""
    from apps.pos.cart.services import CartService
    return CartService.calculate_totals(self)
```

### Verification Checklist
- [ ] calculate_totals method added to CartService
- [ ] Method decorated with @transaction.atomic
- [ ] All item totals recalculated first
- [ ] Subtotal calculated (sum of line_totals)
- [ ] Line discount total calculated
- [ ] Cart discount calculated
- [ ] Total discount calculated (line + cart)
- [ ] Tax total calculated (sum of item taxes)
- [ ] Grand total calculated correctly
- [ ] All values rounded to 2 decimal places
- [ ] Grand total validated as non-negative
- [ ] Cart saved with updated values
- [ ] recalculate_totals added to POSCart model
- [ ] Returns updated cart

---

## Summary

This document covered the CartService implementation and all cart operations:

### Completed Tasks
1. ✅ Task 32: CartService created with lifecycle methods
2. ✅ Task 33: add_to_cart implemented with validation
3. ✅ Task 34: update_quantity implemented with stock checks
4. ✅ Task 35: remove_from_cart implemented
5. ✅ Task 36: apply_line_discount implemented
6. ✅ Task 37: apply_cart_discount implemented
7. ✅ Task 38: calculate_totals implemented

### Key Deliverables
```
apps/pos/cart/services/
├── __init__.py
└── cart_service.py         # Complete CartService with all methods
```

### CartService Complete Methods
- **Lifecycle**: get_or_create_cart, hold_cart, resume_cart, void_cart
- **Item Operations**: add_to_cart, update_quantity, remove_from_cart
- **Discounts**: apply_line_discount, apply_cart_discount
- **Calculations**: calculate_totals
- **Validation**: validate_cart

### Total Calculation Flow
```
Line Items → Line Totals → Subtotal
                ↓
         Line Discounts Applied
                ↓
         Cart Discount Applied
                ↓
         Tax Calculated
                ↓
         Grand Total
```

### Group B Complete!

All tasks for Group B (Cart & Line Item Management) are now complete:
- ✅ Cart submodule structure
- ✅ POSCart model with all fields
- ✅ POSCartItem model with all fields
- ✅ CartService with all operations
- ✅ Complete discount system
- ✅ Comprehensive total calculation

### Next Steps
Proceed to [Group C: Product Search & Barcode](../Group-C_Product-Search-Barcode/) to implement:
- Product search functionality
- Barcode scanning
- Quick product lookup
- Search optimization

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Group:** [../Group-C_Product-Search-Barcode/](../Group-C_Product-Search-Barcode/)
