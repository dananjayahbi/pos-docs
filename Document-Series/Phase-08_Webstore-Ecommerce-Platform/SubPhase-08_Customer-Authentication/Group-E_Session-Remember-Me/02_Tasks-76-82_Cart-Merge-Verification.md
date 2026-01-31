# Tasks 76-82: Cart Merge and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** E - Session & Remember Me  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-75_Token-Persistence.md](01_Tasks-69-75_Token-Persistence.md)

---

## Document Overview

This document covers the implementation of session hydration, logout flow, cart merge functionality, and complete authentication verification. It establishes auth state restoration on page load, secure logout with token cleanup, session expiry warnings, and intelligent cart merging that combines guest and authenticated user carts. This completes the authentication lifecycle with proper session management, data persistence, and seamless user experience during login/logout transitions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create Remember Me Storage Logic | Medium | 30 min |
| 77 | Create Guest Cart Data Persistence | Medium | 35 min |
| 78 | Create Cart Merge Logic | High | 45 min |
| 79 | Create Post-Login Cart Sync | High | 40 min |
| 80 | Create Session Expiry Handler | Medium | 30 min |
| 81 | Create Session Status UI Indicator | Low | 25 min |
| 82 | Complete Auth Flow Verification | Low | 30 min |

---

## Task 76: Create Remember Me Storage Logic

### Overview
Create persistent storage logic for the "Remember Me" functionality that extends session duration from 7 days to 30 days. This service manages the remember me preference and applies appropriate token expiry times based on user selection. It integrates with the token storage service to set cookie expiry durations and provides methods to check if remember me is active.

### Dependencies
- Task 75 (Silent Token Refresh)
- Task 69 (Access Token Storage)
- Task 41 (Remember Me Checkbox)

### Instructions

1. **Create remember me storage service**
   - Navigate to `frontend/services/storefront/auth/`
   - Create new file `rememberMeService.ts`
   - This manages remember me preference storage

2. **Define storage key constants**
   - Create constant for localStorage key: `remember_me_preference`
   - Define default expiry: 7 days
   - Define extended expiry: 30 days
   - Add timestamp tracking for preference

3. **Implement setRememberMe method**
   - Accept boolean remember me preference
   - Store preference in localStorage
   - Include timestamp of preference setting
   - Return success status

4. **Implement getRememberMe method**
   - Retrieve remember me preference from localStorage
   - Return boolean (default false if not set)
   - Handle localStorage errors gracefully

5. **Implement getTokenExpiry method**
   - Check remember me preference
   - Return 7 days if false (default session)
   - Return 30 days if true (extended session)
   - Calculate milliseconds for cookie maxAge

6. **Implement clearRememberMe method**
   - Remove remember me preference from localStorage
   - Called during logout
   - Ensure complete cleanup

7. **Add preference validation**
   - Check if preference is still valid
   - Validate timestamp hasn't expired
   - Reset if corrupted or invalid

8. **Integrate with token service**
   - Pass remember me duration to setTokens
   - Update refresh token expiry based on preference
   - Ensure consistent expiry across tokens

### Remember Me Configuration

| Preference | Access Token Expiry | Refresh Token Expiry | Storage |
|------------|---------------------|----------------------|---------|
| Unchecked (default) | 15 minutes | 7 days | Session-like |
| Checked | 15 minutes | 30 days | Extended |

### Storage Structure

```typescript
interface RememberMePreference {
  enabled: boolean;
  timestamp: number; // When preference was set
  version: string; // Schema version
}
```

### Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| setRememberMe | enabled | void | Store preference |
| getRememberMe | - | boolean | Retrieve preference |
| getTokenExpiry | - | number | Get expiry duration in ms |
| clearRememberMe | - | void | Remove preference |
| isPreferenceValid | - | boolean | Validate stored preference |

### Code Structure

```typescript
// frontend/services/storefront/auth/rememberMeService.ts
const REMEMBER_ME_KEY = 'remember_me_preference';
const DEFAULT_EXPIRY_DAYS = 7;
const EXTENDED_EXPIRY_DAYS = 30;
const PREFERENCE_VERSION = '1.0';

interface RememberMePreference {
  enabled: boolean;
  timestamp: number;
  version: string;
}

export const rememberMeService = {
  setRememberMe(enabled: boolean): void {
    const preference: RememberMePreference = {
      enabled,
      timestamp: Date.now(),
      version: PREFERENCE_VERSION,
    };
    
    try {
      localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(preference));
    } catch (error) {
      console.error('Failed to store remember me preference:', error);
    }
  },

  getRememberMe(): boolean {
    try {
      const stored = localStorage.getItem(REMEMBER_ME_KEY);
      if (!stored) return false;

      const preference: RememberMePreference = JSON.parse(stored);
      
      // Validate preference
      if (!this.isPreferenceValid(preference)) {
        this.clearRememberMe();
        return false;
      }

      return preference.enabled;
    } catch (error) {
      console.error('Failed to retrieve remember me preference:', error);
      return false;
    }
  },

  getTokenExpiry(): number {
    const rememberMe = this.getRememberMe();
    const days = rememberMe ? EXTENDED_EXPIRY_DAYS : DEFAULT_EXPIRY_DAYS;
    return days * 24 * 60 * 60 * 1000; // Convert to milliseconds
  },

  clearRememberMe(): void {
    try {
      localStorage.removeItem(REMEMBER_ME_KEY);
    } catch (error) {
      console.error('Failed to clear remember me preference:', error);
    }
  },

  isPreferenceValid(preference: RememberMePreference): boolean {
    // Check version
    if (preference.version !== PREFERENCE_VERSION) return false;

    // Check timestamp (not too old - max 90 days)
    const maxAge = 90 * 24 * 60 * 60 * 1000;
    const age = Date.now() - preference.timestamp;
    if (age > maxAge) return false;

    return true;
  },
};
```

### Integration with Login Flow

```typescript
// In login submission handler
const handleLogin = async (credentials: LoginCredentials) => {
  const response = await authService.login(credentials);
  
  // Store remember me preference
  rememberMeService.setRememberMe(credentials.rememberMe);
  
  // Store tokens with appropriate expiry
  const expiryDuration = rememberMeService.getTokenExpiry();
  tokenService.setTokens(response.tokens, expiryDuration);
  
  // Continue with auth flow
};
```

### Expected Outcome
- Remember me preference persisted in localStorage
- Token expiry duration adjusts based on preference
- Preference validated and cleaned up properly
- Integration with login flow complete

### Verification Checklist
- [ ] rememberMeService.ts created
- [ ] All service methods implemented
- [ ] Preference validation logic working
- [ ] Integration with token service complete
- [ ] localStorage errors handled gracefully
- [ ] Remember me affects token expiry correctly
- [ ] Preference cleared on logout

---

## Task 77: Create Guest Cart Data Persistence

### Overview
Create cart persistence service that saves guest cart data to localStorage before login and retrieves it for merging after authentication. This service manages the temporary cart state for unauthenticated users and ensures cart data survives page refreshes and login transitions. It provides methods to save, retrieve, and clear guest cart data with proper data validation and error handling.

### Dependencies
- Cart state management (Phase 08, SubPhase 07)
- localStorage API
- TypeScript types for cart data

### Instructions

1. **Create cart persistence service**
   - Navigate to `frontend/services/storefront/cart/`
   - Create new file `guestCartService.ts`
   - This manages guest cart data persistence

2. **Define cart storage key**
   - Create constant: `guest_cart_data`
   - Add version for schema management
   - Include timestamp for expiry checking

3. **Define guest cart interface**
   - Include cart items array
   - Include item quantities
   - Include product variants
   - Add cart metadata (created, updated)
   - Include cart totals

4. **Implement saveGuestCart method**
   - Accept cart data object
   - Validate cart structure
   - Add timestamp and version
   - Store in localStorage as JSON
   - Handle storage quota errors

5. **Implement getGuestCart method**
   - Retrieve cart from localStorage
   - Parse JSON data
   - Validate data structure and version
   - Check expiry (30 days max)
   - Return null if invalid or expired

6. **Implement clearGuestCart method**
   - Remove guest cart from localStorage
   - Called after successful merge
   - Called on explicit cart clear

7. **Implement hasGuestCart method**
   - Check if valid guest cart exists
   - Return boolean
   - Fast check without full retrieval

8. **Add data migration helper**
   - Handle version upgrades
   - Migrate old cart format to new
   - Preserve data integrity

### Guest Cart Storage Structure

```typescript
interface GuestCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface GuestCartData {
  items: GuestCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: number;
  updatedAt: number;
  version: string;
}
```

### Storage Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Storage Key | guest_cart_data | Unique identifier |
| Max Age | 30 days | Auto-expiry |
| Max Size | 5 MB | Quota limit |
| Version | 1.0 | Schema version |

### Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| saveGuestCart | cartData | void | Store cart in localStorage |
| getGuestCart | - | GuestCartData \| null | Retrieve cart data |
| clearGuestCart | - | void | Remove guest cart |
| hasGuestCart | - | boolean | Check if cart exists |
| isCartExpired | cartData | boolean | Check cart age |
| migrateCartData | oldData | GuestCartData | Upgrade cart schema |

### Code Structure

```typescript
// frontend/services/storefront/cart/guestCartService.ts
const GUEST_CART_KEY = 'guest_cart_data';
const CART_VERSION = '1.0';
const MAX_CART_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface GuestCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface GuestCartData {
  items: GuestCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: number;
  updatedAt: number;
  version: string;
}

export const guestCartService = {
  saveGuestCart(cartData: Omit<GuestCartData, 'createdAt' | 'updatedAt' | 'version'>): void {
    try {
      const existingCart = this.getGuestCart();
      const fullCartData: GuestCartData = {
        ...cartData,
        createdAt: existingCart?.createdAt || Date.now(),
        updatedAt: Date.now(),
        version: CART_VERSION,
      };

      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(fullCartData));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Cannot save cart.');
      } else {
        console.error('Failed to save guest cart:', error);
      }
    }
  },

  getGuestCart(): GuestCartData | null {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (!stored) return null;

      const cartData: GuestCartData = JSON.parse(stored);

      // Validate version
      if (cartData.version !== CART_VERSION) {
        // Attempt migration
        const migrated = this.migrateCartData(cartData);
        if (migrated) {
          this.saveGuestCart(migrated);
          return migrated;
        }
        return null;
      }

      // Check expiry
      if (this.isCartExpired(cartData)) {
        this.clearGuestCart();
        return null;
      }

      return cartData;
    } catch (error) {
      console.error('Failed to retrieve guest cart:', error);
      return null;
    }
  },

  clearGuestCart(): void {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Failed to clear guest cart:', error);
    }
  },

  hasGuestCart(): boolean {
    const cart = this.getGuestCart();
    return cart !== null && cart.items.length > 0;
  },

  isCartExpired(cartData: GuestCartData): boolean {
    const age = Date.now() - cartData.createdAt;
    return age > MAX_CART_AGE_MS;
  },

  migrateCartData(oldData: any): GuestCartData | null {
    // Handle version migrations
    try {
      // Example: Migrate from older version
      if (!oldData.version || oldData.version === '0.9') {
        return {
          items: oldData.items || [],
          subtotal: oldData.subtotal || 0,
          tax: oldData.tax || 0,
          total: oldData.total || 0,
          createdAt: oldData.createdAt || Date.now(),
          updatedAt: Date.now(),
          version: CART_VERSION,
        };
      }
      return null;
    } catch (error) {
      console.error('Cart data migration failed:', error);
      return null;
    }
  },
};
```

### Usage in Cart Context

```typescript
// In cart context/store
const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartState | null>(null);

  // Load guest cart on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const guestCart = guestCartService.getGuestCart();
      if (guestCart) {
        setCart(guestCart);
      }
    }
  }, [isAuthenticated]);

  // Save cart on changes (for guests)
  useEffect(() => {
    if (!isAuthenticated && cart) {
      guestCartService.saveGuestCart(cart);
    }
  }, [cart, isAuthenticated]);

  // ... rest of cart logic
};
```

### Expected Outcome
- Guest cart persisted in localStorage
- Cart survives page refreshes
- Cart expires after 30 days
- Data validation and migration working
- Integration with cart context complete

### Verification Checklist
- [ ] guestCartService.ts created
- [ ] All service methods implemented
- [ ] Cart data validation working
- [ ] Expiry check functioning
- [ ] localStorage errors handled
- [ ] Data migration logic tested
- [ ] Integration with cart state complete

---

## Task 78: Create Cart Merge Logic

### Overview
Create intelligent cart merging logic that combines guest cart items with authenticated user cart items when a user logs in. This service handles different merge scenarios: empty carts, duplicate items, quantity conflicts, and out-of-stock items. It implements merge strategies (combine quantities, overwrite, keep guest preference) and provides conflict resolution. This ensures users don't lose cart items when transitioning from guest to authenticated state.

### Dependencies
- Task 77 (Guest Cart Data Persistence)
- Cart API service
- Product availability checking

### Instructions

1. **Create cart merge service**
   - Navigate to `frontend/services/storefront/cart/`
   - Create new file `cartMergeService.ts`
   - This handles all cart merge operations

2. **Define merge strategy enum**
   - COMBINE_QUANTITIES: Add guest qty to user qty
   - GUEST_WINS: Guest cart item overwrites
   - USER_WINS: Keep user cart item
   - ASK_USER: Prompt for conflict resolution

3. **Define merge result interface**
   - Include merged items array
   - Include conflicts array
   - Include removed items (out of stock)
   - Include success/failure status
   - Add warning messages

4. **Implement mergeCartItems method**
   - Accept guest cart items and user cart items
   - Identify duplicate items (same productId + variantId)
   - Apply merge strategy to duplicates
   - Combine unique items from both carts
   - Return merged cart with conflicts

5. **Implement findDuplicates helper**
   - Compare product IDs and variant IDs
   - Return pairs of matching items
   - Handle items with/without variants
   - Account for case sensitivity

6. **Implement applyMergeStrategy method**
   - Accept two conflicting items
   - Apply chosen merge strategy
   - Calculate combined quantity
   - Check stock availability
   - Return merged item or conflict

7. **Implement validateMergedCart method**
   - Check product availability
   - Validate quantities against stock
   - Remove unavailable items
   - Update prices to current values
   - Flag price changes

8. **Implement calculateCartTotals method**
   - Sum all item subtotals
   - Calculate tax if applicable
   - Calculate final total
   - Apply any discounts
   - Return updated totals

### Merge Scenarios

| Scenario | Guest Cart | User Cart | Result |
|----------|------------|-----------|--------|
| Both empty | Empty | Empty | Empty |
| Only guest | 3 items | Empty | Keep guest 3 |
| Only user | Empty | 5 items | Keep user 5 |
| No duplicates | A, B | C, D | A, B, C, D |
| Duplicates | A(qty:2) | A(qty:3) | A(qty:5) - combined |
| Max qty limit | A(qty:8) | A(qty:5) | A(qty:10) - capped at max |
| Out of stock | A, B | C | Keep only available |

### Merge Strategy Configuration

```typescript
enum MergeStrategy {
  COMBINE_QUANTITIES = 'combine',
  GUEST_WINS = 'guest',
  USER_WINS = 'user',
  ASK_USER = 'ask',
}

interface MergeOptions {
  strategy: MergeStrategy;
  maxQuantityPerItem: number;
  validateStock: boolean;
  updatePrices: boolean;
}
```

### Conflict Resolution

```typescript
interface CartConflict {
  productId: string;
  variantId?: string;
  guestQuantity: number;
  userQuantity: number;
  suggestedQuantity: number;
  availableStock: number;
  conflict: 'quantity_limit' | 'out_of_stock' | 'price_change';
}

interface MergeResult {
  items: CartItem[];
  conflicts: CartConflict[];
  removedItems: CartItem[];
  success: boolean;
  warnings: string[];
}
```

### Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| mergeCartItems | guestItems, userItems, options | MergeResult | Merge two carts |
| findDuplicates | items1, items2 | DuplicatePair[] | Find matching items |
| applyMergeStrategy | item1, item2, strategy | CartItem | Merge single item |
| validateMergedCart | items | ValidationResult | Validate cart state |
| calculateCartTotals | items | CartTotals | Calculate totals |
| resolveConflicts | conflicts, resolution | CartItem[] | Resolve conflicts |

### Code Structure

```typescript
// frontend/services/storefront/cart/cartMergeService.ts
enum MergeStrategy {
  COMBINE_QUANTITIES = 'combine',
  GUEST_WINS = 'guest',
  USER_WINS = 'user',
  ASK_USER = 'ask',
}

interface MergeOptions {
  strategy: MergeStrategy;
  maxQuantityPerItem: number;
  validateStock: boolean;
  updatePrices: boolean;
}

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  stock?: number;
}

interface CartConflict {
  productId: string;
  variantId?: string;
  guestQuantity: number;
  userQuantity: number;
  suggestedQuantity: number;
  availableStock: number;
  conflictType: 'quantity_limit' | 'out_of_stock' | 'price_change';
  message: string;
}

interface MergeResult {
  items: CartItem[];
  conflicts: CartConflict[];
  removedItems: CartItem[];
  success: boolean;
  warnings: string[];
}

const DEFAULT_OPTIONS: MergeOptions = {
  strategy: MergeStrategy.COMBINE_QUANTITIES,
  maxQuantityPerItem: 99,
  validateStock: true,
  updatePrices: true,
};

export const cartMergeService = {
  async mergeCartItems(
    guestItems: CartItem[],
    userItems: CartItem[],
    options: Partial<MergeOptions> = {}
  ): Promise<MergeResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const conflicts: CartConflict[] = [];
    const removedItems: CartItem[] = [];
    const warnings: string[] = [];

    try {
      // Handle empty cart scenarios
      if (guestItems.length === 0 && userItems.length === 0) {
        return {
          items: [],
          conflicts: [],
          removedItems: [],
          success: true,
          warnings: [],
        };
      }

      if (guestItems.length === 0) {
        return {
          items: userItems,
          conflicts: [],
          removedItems: [],
          success: true,
          warnings: ['No guest cart items to merge'],
        };
      }

      if (userItems.length === 0) {
        return {
          items: guestItems,
          conflicts: [],
          removedItems: [],
          success: true,
          warnings: ['No user cart items, using guest cart'],
        };
      }

      // Find duplicates
      const duplicatePairs = this.findDuplicates(guestItems, userItems);
      const mergedItems: CartItem[] = [];
      const processedGuestIds = new Set<string>();
      const processedUserIds = new Set<string>();

      // Merge duplicate items
      for (const { guestItem, userItem } of duplicatePairs) {
        const itemKey = this.getItemKey(guestItem);
        processedGuestIds.add(itemKey);
        processedUserIds.add(itemKey);

        const mergeResult = this.applyMergeStrategy(
          guestItem,
          userItem,
          opts.strategy,
          opts.maxQuantityPerItem
        );

        if (mergeResult.conflict) {
          conflicts.push(mergeResult.conflict);
        }

        if (mergeResult.item) {
          mergedItems.push(mergeResult.item);
        }
      }

      // Add unique guest items
      for (const item of guestItems) {
        const itemKey = this.getItemKey(item);
        if (!processedGuestIds.has(itemKey)) {
          mergedItems.push(item);
        }
      }

      // Add unique user items
      for (const item of userItems) {
        const itemKey = this.getItemKey(item);
        if (!processedUserIds.has(itemKey)) {
          mergedItems.push(item);
        }
      }

      // Validate merged cart
      const validationResult = await this.validateMergedCart(
        mergedItems,
        opts.validateStock,
        opts.updatePrices
      );

      return {
        items: validationResult.validItems,
        conflicts: [...conflicts, ...validationResult.conflicts],
        removedItems: validationResult.removedItems,
        success: validationResult.conflicts.length === 0,
        warnings: validationResult.warnings,
      };
    } catch (error) {
      console.error('Cart merge failed:', error);
      return {
        items: userItems, // Fallback to user cart
        conflicts: [],
        removedItems: [],
        success: false,
        warnings: ['Cart merge failed, using existing cart'],
      };
    }
  },

  findDuplicates(
    guestItems: CartItem[],
    userItems: CartItem[]
  ): Array<{ guestItem: CartItem; userItem: CartItem }> {
    const duplicates: Array<{ guestItem: CartItem; userItem: CartItem }> = [];

    for (const guestItem of guestItems) {
      const matchingUserItem = userItems.find(
        (userItem) =>
          userItem.productId === guestItem.productId &&
          userItem.variantId === guestItem.variantId
      );

      if (matchingUserItem) {
        duplicates.push({ guestItem, userItem: matchingUserItem });
      }
    }

    return duplicates;
  },

  applyMergeStrategy(
    guestItem: CartItem,
    userItem: CartItem,
    strategy: MergeStrategy,
    maxQuantity: number
  ): { item: CartItem | null; conflict: CartConflict | null } {
    let mergedItem: CartItem;
    let conflict: CartConflict | null = null;

    switch (strategy) {
      case MergeStrategy.COMBINE_QUANTITIES: {
        const combinedQty = guestItem.quantity + userItem.quantity;
        const finalQty = Math.min(combinedQty, maxQuantity);

        if (combinedQty > maxQuantity) {
          conflict = {
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            guestQuantity: guestItem.quantity,
            userQuantity: userItem.quantity,
            suggestedQuantity: finalQty,
            availableStock: maxQuantity,
            conflictType: 'quantity_limit',
            message: `Quantity capped at ${maxQuantity} (attempted ${combinedQty})`,
          };
        }

        mergedItem = {
          ...userItem,
          quantity: finalQty,
        };
        break;
      }

      case MergeStrategy.GUEST_WINS:
        mergedItem = guestItem;
        break;

      case MergeStrategy.USER_WINS:
        mergedItem = userItem;
        break;

      case MergeStrategy.ASK_USER:
        // Return conflict for user resolution
        conflict = {
          productId: guestItem.productId,
          variantId: guestItem.variantId,
          guestQuantity: guestItem.quantity,
          userQuantity: userItem.quantity,
          suggestedQuantity: guestItem.quantity + userItem.quantity,
          availableStock: Math.max(guestItem.stock || 0, userItem.stock || 0),
          conflictType: 'quantity_limit',
          message: 'User resolution required',
        };
        mergedItem = userItem; // Temporary fallback
        break;

      default:
        mergedItem = userItem;
    }

    return { item: mergedItem, conflict };
  },

  async validateMergedCart(
    items: CartItem[],
    validateStock: boolean,
    updatePrices: boolean
  ): Promise<{
    validItems: CartItem[];
    removedItems: CartItem[];
    conflicts: CartConflict[];
    warnings: string[];
  }> {
    const validItems: CartItem[] = [];
    const removedItems: CartItem[] = [];
    const conflicts: CartConflict[] = [];
    const warnings: string[] = [];

    for (const item of items) {
      // Stock validation would require API call
      // For now, assume stock is available
      if (validateStock && item.stock !== undefined && item.stock < item.quantity) {
        conflicts.push({
          productId: item.productId,
          variantId: item.variantId,
          guestQuantity: 0,
          userQuantity: item.quantity,
          suggestedQuantity: item.stock,
          availableStock: item.stock,
          conflictType: 'out_of_stock',
          message: `Only ${item.stock} available`,
        });

        if (item.stock === 0) {
          removedItems.push(item);
          warnings.push(`${item.name} removed (out of stock)`);
        } else {
          validItems.push({ ...item, quantity: item.stock });
        }
      } else {
        validItems.push(item);
      }
    }

    return { validItems, removedItems, conflicts, warnings };
  },

  getItemKey(item: CartItem): string {
    return `${item.productId}${item.variantId ? `-${item.variantId}` : ''}`;
  },

  calculateCartTotals(items: CartItem[]): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxRate = 0.1; // 10% tax (configurable)
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  },
};
```

### Expected Outcome
- Cart merge logic implemented with multiple strategies
- Duplicate detection working correctly
- Quantity conflicts resolved appropriately
- Stock validation integrated
- Merge conflicts reported clearly

### Verification Checklist
- [ ] cartMergeService.ts created
- [ ] All merge strategies implemented
- [ ] Duplicate detection working
- [ ] Quantity limits enforced
- [ ] Stock validation functioning
- [ ] Conflict resolution logic complete
- [ ] Edge cases handled (empty carts, etc.)

---

## Task 79: Create Post-Login Cart Sync

### Overview
Create the cart synchronization flow that executes after successful login. This service orchestrates the entire cart merge process: retrieving guest cart from localStorage, fetching user cart from API, merging both carts using merge service, syncing merged cart to backend, clearing guest cart from localStorage, and updating UI cart state. This ensures seamless cart continuity when users transition from guest to authenticated state.

### Dependencies
- Task 78 (Cart Merge Logic)
- Task 77 (Guest Cart Data Persistence)
- Cart API endpoints (/api/cart/merge)
- Auth context/store

### Instructions

1. **Create cart sync service**
   - Navigate to `frontend/services/storefront/cart/`
   - Create new file `cartSyncService.ts`
   - This orchestrates post-login cart operations

2. **Define sync configuration**
   - Enable/disable auto-sync on login
   - Set sync timeout
   - Configure retry attempts
   - Define error handling strategy

3. **Implement syncCartOnLogin method**
   - Accept user authentication token
   - Retrieve guest cart from localStorage
   - Fetch user cart from API
   - Merge carts using cart merge service
   - Send merged cart to API
   - Update local cart state
   - Clear guest cart on success

4. **Implement fetchUserCart method**
   - Call GET /api/storefront/cart/
   - Include auth token in request
   - Parse response to cart format
   - Handle empty cart response
   - Handle API errors

5. **Implement mergeAndSyncCart method**
   - Call cart merge service
   - Handle merge conflicts
   - Prepare API payload
   - Call POST /api/storefront/cart/merge
   - Validate API response

6. **Implement handleMergeConflicts method**
   - Check if conflicts exist
   - Show conflict resolution UI if needed
   - Apply default resolution if configured
   - Retry merge after resolution

7. **Implement clearGuestCartData method**
   - Clear guest cart from localStorage
   - Clear any cached guest cart data
   - Emit cart cleared event

8. **Add sync status tracking**
   - Track sync progress (fetching, merging, syncing)
   - Emit status events
   - Handle sync failures gracefully
   - Provide rollback mechanism

### Cart Sync Flow

```
Login Success
    │
    ▼
Retrieve Guest Cart (localStorage)
    │
    ▼
Fetch User Cart (API)
    │
    ▼
Merge Carts (cartMergeService)
    │
    ├─────► Conflicts? → Show UI / Auto-resolve
    │
    ▼
Sync Merged Cart to API
    │
    ▼
Update Local Cart State
    │
    ▼
Clear Guest Cart (localStorage)
    │
    ▼
Show Success Notification
```

### API Endpoints

| Endpoint | Method | Purpose | Payload |
|----------|--------|---------|---------|
| /api/storefront/cart/ | GET | Fetch user cart | - |
| /api/storefront/cart/merge | POST | Merge carts | { guestItems, mergeStrategy } |
| /api/storefront/cart/ | PUT | Update cart | { items, totals } |

### Sync Configuration

```typescript
interface CartSyncConfig {
  autoSyncOnLogin: boolean;
  syncTimeout: number; // milliseconds
  maxRetries: number;
  showConflictUI: boolean;
  defaultMergeStrategy: MergeStrategy;
  clearGuestCartOnSuccess: boolean;
}

const DEFAULT_CONFIG: CartSyncConfig = {
  autoSyncOnLogin: true,
  syncTimeout: 10000,
  maxRetries: 3,
  showConflictUI: true,
  defaultMergeStrategy: MergeStrategy.COMBINE_QUANTITIES,
  clearGuestCartOnSuccess: true,
};
```

### Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| syncCartOnLogin | authToken | Promise<SyncResult> | Main sync orchestrator |
| fetchUserCart | authToken | Promise<CartData> | Get user cart from API |
| mergeAndSyncCart | guestCart, userCart | Promise<CartData> | Merge and sync |
| handleMergeConflicts | conflicts | Promise<Resolution> | Resolve conflicts |
| clearGuestCartData | - | void | Clear localStorage |
| getSyncStatus | - | SyncStatus | Get current status |

### Code Structure

```typescript
// frontend/services/storefront/cart/cartSyncService.ts
import { guestCartService } from './guestCartService';
import { cartMergeService, MergeStrategy } from './cartMergeService';
import { apiClient } from '@/lib/api/apiClient';

interface CartSyncConfig {
  autoSyncOnLogin: boolean;
  syncTimeout: number;
  maxRetries: number;
  showConflictUI: boolean;
  defaultMergeStrategy: MergeStrategy;
  clearGuestCartOnSuccess: boolean;
}

interface SyncResult {
  success: boolean;
  cart: CartData | null;
  conflicts: CartConflict[];
  warnings: string[];
  error?: string;
}

enum SyncStatus {
  IDLE = 'idle',
  FETCHING_USER_CART = 'fetching',
  MERGING = 'merging',
  SYNCING = 'syncing',
  RESOLVING_CONFLICTS = 'resolving',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

const DEFAULT_CONFIG: CartSyncConfig = {
  autoSyncOnLogin: true,
  syncTimeout: 10000,
  maxRetries: 3,
  showConflictUI: true,
  defaultMergeStrategy: MergeStrategy.COMBINE_QUANTITIES,
  clearGuestCartOnSuccess: true,
};

class CartSyncService {
  private config: CartSyncConfig;
  private currentStatus: SyncStatus = SyncStatus.IDLE;
  private syncListeners: Array<(status: SyncStatus) => void> = [];

  constructor(config: Partial<CartSyncConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async syncCartOnLogin(authToken: string): Promise<SyncResult> {
    try {
      this.setStatus(SyncStatus.FETCHING_USER_CART);

      // Check if guest cart exists
      const guestCart = guestCartService.getGuestCart();
      if (!guestCart || guestCart.items.length === 0) {
        // No guest cart to merge
        const userCart = await this.fetchUserCart(authToken);
        this.setStatus(SyncStatus.COMPLETE);
        return {
          success: true,
          cart: userCart,
          conflicts: [],
          warnings: ['No guest cart to merge'],
        };
      }

      // Fetch user cart from API
      const userCart = await this.fetchUserCart(authToken);

      // Merge carts
      this.setStatus(SyncStatus.MERGING);
      const mergeResult = await cartMergeService.mergeCartItems(
        guestCart.items,
        userCart.items,
        { strategy: this.config.defaultMergeStrategy }
      );

      // Handle conflicts
      if (mergeResult.conflicts.length > 0 && this.config.showConflictUI) {
        this.setStatus(SyncStatus.RESOLVING_CONFLICTS);
        // Conflicts would be shown in UI here
        // For now, proceed with suggested resolution
      }

      // Sync merged cart to API
      this.setStatus(SyncStatus.SYNCING);
      const syncedCart = await this.mergeAndSyncCart(mergeResult.items, authToken);

      // Clear guest cart on success
      if (this.config.clearGuestCartOnSuccess) {
        guestCartService.clearGuestCart();
      }

      this.setStatus(SyncStatus.COMPLETE);
      return {
        success: true,
        cart: syncedCart,
        conflicts: mergeResult.conflicts,
        warnings: mergeResult.warnings,
      };
    } catch (error) {
      this.setStatus(SyncStatus.FAILED);
      console.error('Cart sync failed:', error);
      return {
        success: false,
        cart: null,
        conflicts: [],
        warnings: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async fetchUserCart(authToken: string): Promise<CartData> {
    try {
      const response = await apiClient.get('/storefront/cart/', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        timeout: this.config.syncTimeout,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch user cart:', error);
      // Return empty cart on error
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      };
    }
  }

  async mergeAndSyncCart(mergedItems: CartItem[], authToken: string): Promise<CartData> {
    try {
      const totals = cartMergeService.calculateCartTotals(mergedItems);

      const response = await apiClient.post(
        '/storefront/cart/merge',
        {
          items: mergedItems,
          ...totals,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          timeout: this.config.syncTimeout,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to sync merged cart:', error);
      throw error;
    }
  }

  getSyncStatus(): SyncStatus {
    return this.currentStatus;
  }

  onStatusChange(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== listener);
    };
  }

  private setStatus(status: SyncStatus): void {
    this.currentStatus = status;
    this.syncListeners.forEach((listener) => listener(status));
  }
}

export const cartSyncService = new CartSyncService();
```

### Integration with Login Flow

```typescript
// In login submission handler
const handleLoginSuccess = async (authResponse: AuthResponse) => {
  // Store tokens
  tokenService.setTokens(authResponse.tokens);

  // Update auth state
  setUser(authResponse.user);

  // Sync cart
  const syncResult = await cartSyncService.syncCartOnLogin(authResponse.tokens.accessToken);

  if (syncResult.success) {
    // Update cart in UI
    setCart(syncResult.cart);

    // Show notification
    if (syncResult.conflicts.length > 0) {
      showNotification('Cart merged with some conflicts', 'warning');
    } else {
      showNotification('Cart synced successfully', 'success');
    }
  } else {
    showNotification('Failed to sync cart', 'error');
  }

  // Redirect
  router.push('/shop');
};
```

### Expected Outcome
- Cart sync executes automatically on login
- Guest cart merged with user cart
- Merged cart synced to backend
- Guest cart cleared after successful sync
- Conflicts handled appropriately

### Verification Checklist
- [ ] cartSyncService.ts created
- [ ] syncCartOnLogin method working
- [ ] Guest cart retrieval functioning
- [ ] User cart fetched from API
- [ ] Cart merge executed correctly
- [ ] Merged cart synced to backend
- [ ] Guest cart cleared on success
- [ ] Status tracking implemented
- [ ] Error handling complete

---

## Task 80: Create Session Expiry Handler

### Overview
Create session expiry detection and warning system that monitors token expiration and alerts users before their session expires. This service tracks access token expiry time, shows warning modal/toast 5 minutes before expiration, provides options to extend session or logout, automatically refreshes token if user chooses to stay logged in, and handles automatic logout if token expires. This improves user experience by preventing unexpected session termination.

### Dependencies
- Task 72 (Token Refresh Logic)
- Token service with expiry tracking
- Notification/modal system

### Instructions

1. **Create session expiry service**
   - Navigate to `frontend/services/storefront/auth/`
   - Create new file `sessionExpiryService.ts`
   - This monitors and handles session expiration

2. **Define expiry configuration**
   - Warning threshold: 5 minutes before expiry
   - Check interval: 30 seconds
   - Auto-refresh attempts: 3
   - Grace period after expiry: 1 minute

3. **Implement startExpiryMonitor method**
   - Start interval timer to check expiry
   - Calculate time until expiry
   - Trigger warning at threshold
   - Stop on logout or token refresh

4. **Implement stopExpiryMonitor method**
   - Clear interval timer
   - Reset expiry state
   - Clear any pending warnings

5. **Implement checkTokenExpiry method**
   - Decode access token
   - Extract expiry timestamp (exp claim)
   - Calculate remaining time
   - Return expiry status

6. **Implement shouldShowWarning method**
   - Check remaining time
   - Compare with warning threshold
   - Ensure warning shown only once per session
   - Return boolean

7. **Implement extendSession method**
   - Call token refresh logic
   - Reset warning state
   - Continue monitoring with new expiry
   - Show success notification

8. **Implement handleExpiredSession method**
   - Stop expiry monitor
   - Trigger logout flow
   - Clear all tokens
   - Show session expired message
   - Redirect to login

9. **Add expiry event emitter**
   - Emit warning event
   - Emit expiry event
   - Emit extended event
   - Allow components to subscribe

### Session Expiry Timeline

```
Token Issued (15 min validity)
    │
    │ (10 minutes pass)
    │
    ▼
5 Min Before Expiry → Show Warning
    │
    ├─────► User clicks "Stay Logged In"
    │           │
    │           ▼
    │       Refresh Token → Reset Timer
    │
    ├─────► User clicks "Logout"
    │           │
    │           ▼
    │       Manual Logout
    │
    ├─────► User ignores (5 min pass)
    │           │
    │           ▼
    │       Token Expires
    │           │
    │           ▼
    │       Grace Period (1 min)
    │           │
    │           ▼
    └───────► Auto Logout + Redirect
```

### Expiry Configuration

```typescript
interface ExpiryConfig {
  warningThresholdMinutes: number; // Minutes before expiry to warn
  checkIntervalSeconds: number; // How often to check expiry
  maxRefreshAttempts: number; // Auto-refresh retries
  gracePeriodMinutes: number; // Time after expiry before forced logout
  showWarningModal: boolean; // Show modal vs toast
}

const DEFAULT_EXPIRY_CONFIG: ExpiryConfig = {
  warningThresholdMinutes: 5,
  checkIntervalSeconds: 30,
  maxRefreshAttempts: 3,
  gracePeriodMinutes: 1,
  showWarningModal: true,
};
```

### Expiry Events

```typescript
enum ExpiryEvent {
  WARNING_SHOWN = 'warning_shown',
  SESSION_EXTENDED = 'session_extended',
  SESSION_EXPIRED = 'session_expired',
  AUTO_LOGOUT = 'auto_logout',
}

interface ExpiryEventData {
  event: ExpiryEvent;
  remainingTimeMs: number;
  timestamp: number;
  message: string;
}
```

### Service Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| startExpiryMonitor | - | void | Begin monitoring |
| stopExpiryMonitor | - | void | Stop monitoring |
| checkTokenExpiry | - | ExpiryStatus | Check current status |
| shouldShowWarning | - | boolean | Check if warning needed |
| extendSession | - | Promise<boolean> | Refresh token |
| handleExpiredSession | - | Promise<void> | Handle expiry |
| getRemainingTime | - | number | Get time left in ms |
| onExpiryEvent | callback | () => void | Subscribe to events |

### Code Structure

```typescript
// frontend/services/storefront/auth/sessionExpiryService.ts
import { jwtDecode } from 'jwt-decode';
import { tokenService } from './tokenService';
import { authService } from './authService';

interface ExpiryConfig {
  warningThresholdMinutes: number;
  checkIntervalSeconds: number;
  maxRefreshAttempts: number;
  gracePeriodMinutes: number;
  showWarningModal: boolean;
}

enum ExpiryEvent {
  WARNING_SHOWN = 'warning_shown',
  SESSION_EXTENDED = 'session_extended',
  SESSION_EXPIRED = 'session_expired',
  AUTO_LOGOUT = 'auto_logout',
}

interface ExpiryEventData {
  event: ExpiryEvent;
  remainingTimeMs: number;
  timestamp: number;
  message: string;
}

interface ExpiryStatus {
  isExpired: boolean;
  isExpiringSoon: boolean;
  remainingTimeMs: number;
  expiryTimestamp: number;
}

const DEFAULT_EXPIRY_CONFIG: ExpiryConfig = {
  warningThresholdMinutes: 5,
  checkIntervalSeconds: 30,
  maxRefreshAttempts: 3,
  gracePeriodMinutes: 1,
  showWarningModal: true,
};

class SessionExpiryService {
  private config: ExpiryConfig;
  private monitorInterval: NodeJS.Timeout | null = null;
  private warningShown: boolean = false;
  private eventListeners: Array<(data: ExpiryEventData) => void> = [];

  constructor(config: Partial<ExpiryConfig> = {}) {
    this.config = { ...DEFAULT_EXPIRY_CONFIG, ...config };
  }

  startExpiryMonitor(): void {
    if (this.monitorInterval) {
      return; // Already monitoring
    }

    this.warningShown = false;

    this.monitorInterval = setInterval(() => {
      this.checkAndHandleExpiry();
    }, this.config.checkIntervalSeconds * 1000);

    // Check immediately on start
    this.checkAndHandleExpiry();
  }

  stopExpiryMonitor(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.warningShown = false;
  }

  checkTokenExpiry(): ExpiryStatus {
    const accessToken = tokenService.getAccessToken();

    if (!accessToken) {
      return {
        isExpired: true,
        isExpiringSoon: false,
        remainingTimeMs: 0,
        expiryTimestamp: 0,
      };
    }

    try {
      const decoded = jwtDecode<{ exp: number }>(accessToken);
      const expiryTimestamp = decoded.exp * 1000; // Convert to ms
      const now = Date.now();
      const remainingTimeMs = expiryTimestamp - now;
      const warningThresholdMs = this.config.warningThresholdMinutes * 60 * 1000;

      return {
        isExpired: remainingTimeMs <= 0,
        isExpiringSoon: remainingTimeMs > 0 && remainingTimeMs <= warningThresholdMs,
        remainingTimeMs: Math.max(0, remainingTimeMs),
        expiryTimestamp,
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return {
        isExpired: true,
        isExpiringSoon: false,
        remainingTimeMs: 0,
        expiryTimestamp: 0,
      };
    }
  }

  shouldShowWarning(status: ExpiryStatus): boolean {
    return status.isExpiringSoon && !this.warningShown && !status.isExpired;
  }

  async extendSession(): Promise<boolean> {
    try {
      // Attempt token refresh
      const refreshed = await authService.refreshAccessToken();

      if (refreshed) {
        this.warningShown = false; // Reset warning state
        this.emitEvent({
          event: ExpiryEvent.SESSION_EXTENDED,
          remainingTimeMs: 15 * 60 * 1000, // New token validity
          timestamp: Date.now(),
          message: 'Session extended successfully',
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to extend session:', error);
      return false;
    }
  }

  async handleExpiredSession(): Promise<void> {
    this.stopExpiryMonitor();

    this.emitEvent({
      event: ExpiryEvent.SESSION_EXPIRED,
      remainingTimeMs: 0,
      timestamp: Date.now(),
      message: 'Session has expired',
    });

    // Trigger logout flow
    await authService.logout();
  }

  getRemainingTime(): number {
    const status = this.checkTokenExpiry();
    return status.remainingTimeMs;
  }

  onExpiryEvent(callback: (data: ExpiryEventData) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter((cb) => cb !== callback);
    };
  }

  private async checkAndHandleExpiry(): Promise<void> {
    const status = this.checkTokenExpiry();

    // Check if token is expired
    if (status.isExpired) {
      await this.handleExpiredSession();
      return;
    }

    // Check if warning should be shown
    if (this.shouldShowWarning(status)) {
      this.warningShown = true;
      this.emitEvent({
        event: ExpiryEvent.WARNING_SHOWN,
        remainingTimeMs: status.remainingTimeMs,
        timestamp: Date.now(),
        message: `Session expires in ${Math.ceil(status.remainingTimeMs / 60000)} minutes`,
      });
    }
  }

  private emitEvent(data: ExpiryEventData): void {
    this.eventListeners.forEach((listener) => listener(data));
  }
}

export const sessionExpiryService = new SessionExpiryService();
```

### Hook for React Components

```typescript
// frontend/hooks/storefront/useSessionExpiry.ts
import { useEffect, useState } from 'react';
import { sessionExpiryService, ExpiryEvent, ExpiryEventData } from '@/services/storefront/auth/sessionExpiryService';

export const useSessionExpiry = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Start monitoring on mount
    sessionExpiryService.startExpiryMonitor();

    // Subscribe to expiry events
    const unsubscribe = sessionExpiryService.onExpiryEvent((data: ExpiryEventData) => {
      switch (data.event) {
        case ExpiryEvent.WARNING_SHOWN:
          setShowWarning(true);
          setRemainingTime(data.remainingTimeMs);
          break;

        case ExpiryEvent.SESSION_EXTENDED:
          setShowWarning(false);
          break;

        case ExpiryEvent.SESSION_EXPIRED:
          setShowWarning(false);
          // Logout handled by service
          break;
      }
    });

    return () => {
      sessionExpiryService.stopExpiryMonitor();
      unsubscribe();
    };
  }, []);

  const handleExtendSession = async () => {
    const extended = await sessionExpiryService.extendSession();
    if (extended) {
      setShowWarning(false);
    }
  };

  const handleLogout = async () => {
    await sessionExpiryService.handleExpiredSession();
  };

  return {
    showWarning,
    remainingTime,
    extendSession: handleExtendSession,
    logout: handleLogout,
  };
};
```

### Expected Outcome
- Session expiry monitored continuously
- Warning shown 5 minutes before expiry
- Users can extend session or logout
- Automatic logout on token expiration
- Events emitted for UI components

### Verification Checklist
- [ ] sessionExpiryService.ts created
- [ ] Expiry monitoring implemented
- [ ] Warning threshold detection working
- [ ] Session extension functioning
- [ ] Expired session handling complete
- [ ] Event system implemented
- [ ] React hook created
- [ ] Integration tested

---

## Task 81: Create Session Status UI Indicator

### Overview
Create visual session status indicator component that displays current session state, remaining time until expiry, and session expiry warning modal. This component shows a session timer in the header/footer, displays warning modal 5 minutes before expiry with "Stay Logged In" and "Logout" options, and provides visual feedback during session refresh. This enhances user awareness of their authentication state.

### Dependencies
- Task 80 (Session Expiry Handler)
- UI component library
- Modal/Dialog component

### Instructions

1. **Create session indicator component**
   - Navigate to `frontend/components/storefront/auth/SessionIndicator/`
   - Create `SessionStatusIndicator.tsx`
   - Create `SessionExpiryWarning.tsx`
   - Create `index.ts` for exports

2. **Implement SessionStatusIndicator**
   - Display session icon (logged in/out)
   - Show remaining time (optional)
   - Update every minute
   - Show loading state during refresh

3. **Implement SessionExpiryWarning modal**
   - Show modal on warning event
   - Display countdown timer
   - Provide "Stay Logged In" button
   - Provide "Logout" button
   - Handle button actions

4. **Design warning modal UI**
   - Use warning icon
   - Clear title: "Session Expiring Soon"
   - Message: "Your session will expire in X minutes"
   - Countdown display
   - Action buttons

5. **Add timer countdown**
   - Update countdown every second
   - Format as MM:SS
   - Change color as time decreases (yellow → red)
   - Auto-close on extension

6. **Implement stay logged in action**
   - Call extendSession from hook
   - Show loading state
   - Show success message
   - Close modal
   - Handle errors

7. **Implement logout action**
   - Call logout from hook
   - Show loading state
   - Close modal
   - Redirect handled by service

8. **Add accessibility features**
   - ARIA labels for screen readers
   - Keyboard navigation (Tab, Enter, Esc)
   - Focus management
   - Announcement for timer

### Session Status States

| State | Icon | Text | Color |
|-------|------|------|-------|
| Active | ✓ | Session Active | Green |
| Expiring Soon | ⚠ | Expiring in X min | Yellow |
| Refreshing | ⟳ | Refreshing... | Blue |
| Expired | ✗ | Session Expired | Red |
| Not Logged In | - | Not Logged In | Gray |

### Warning Modal Design

```
┌──────────────────────────────────────────┐
│  ⚠️  Session Expiring Soon                │
│                                           │
│  Your session will expire soon. Would     │
│  you like to stay logged in?              │
│                                           │
│  Time remaining:  [04:32]                 │
│                                           │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ Stay Logged  │  │   Logout     │      │
│  │     In       │  │              │      │
│  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────┘
```

### Component Interface

```typescript
interface SessionStatusIndicatorProps {
  showTimer?: boolean;
  position?: 'header' | 'footer' | 'sidebar';
  variant?: 'minimal' | 'detailed';
}

interface SessionExpiryWarningProps {
  open: boolean;
  remainingTime: number; // milliseconds
  onExtend: () => Promise<void>;
  onLogout: () => Promise<void>;
  onClose?: () => void;
}
```

### Code Structure

```typescript
// frontend/components/storefront/auth/SessionIndicator/SessionStatusIndicator.tsx
'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { sessionExpiryService } from '@/services/storefront/auth/sessionExpiryService';
import { useAuth } from '@/hooks/storefront/useAuth';

interface SessionStatusIndicatorProps {
  showTimer?: boolean;
  position?: 'header' | 'footer' | 'sidebar';
  variant?: 'minimal' | 'detailed';
}

export const SessionStatusIndicator = ({
  showTimer = false,
  position = 'header',
  variant = 'minimal',
}: SessionStatusIndicatorProps) => {
  const { isAuthenticated } = useAuth();
  const [remainingTime, setRemainingTime] = useState(0);
  const [status, setStatus] = useState<'active' | 'expiring' | 'expired'>('active');

  useEffect(() => {
    if (!isAuthenticated) return;

    const updateRemainingTime = () => {
      const time = sessionExpiryService.getRemainingTime();
      setRemainingTime(time);

      // Update status based on remaining time
      if (time <= 0) {
        setStatus('expired');
      } else if (time <= 5 * 60 * 1000) {
        // 5 minutes
        setStatus('expiring');
      } else {
        setStatus('active');
      }
    };

    // Update immediately
    updateRemainingTime();

    // Update every minute
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes} min`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expiring':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'Session Active';
      case 'expiring':
        return `Expires in ${formatTime(remainingTime)}`;
      case 'expired':
        return 'Session Expired';
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {getStatusIcon()}
      <span className={status === 'expiring' ? 'text-yellow-600' : ''}>
        {getStatusText()}
      </span>
      {showTimer && status !== 'expired' && (
        <Clock className="w-4 h-4 ml-1 text-gray-400" />
      )}
    </div>
  );
};
```

```typescript
// frontend/components/storefront/auth/SessionIndicator/SessionExpiryWarning.tsx
'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SessionExpiryWarningProps {
  open: boolean;
  remainingTime: number; // milliseconds
  onExtend: () => Promise<void>;
  onLogout: () => Promise<void>;
  onClose?: () => void;
}

export const SessionExpiryWarning = ({
  open,
  remainingTime: initialRemainingTime,
  onExtend,
  onLogout,
  onClose,
}: SessionExpiryWarningProps) => {
  const [remainingTime, setRemainingTime] = useState(initialRemainingTime);
  const [isExtending, setIsExtending] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setRemainingTime(initialRemainingTime);
  }, [initialRemainingTime]);

  useEffect(() => {
    if (!open) return;

    // Update countdown every second
    const interval = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const formatCountdown = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      await onExtend();
      // Modal will close via parent state update
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getCountdownColor = () => {
    const minutes = Math.floor(remainingTime / 60000);
    if (minutes <= 1) return 'text-red-600';
    if (minutes <= 3) return 'text-orange-600';
    return 'text-yellow-600';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <DialogTitle>Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription className="mt-4">
            Your session will expire soon due to inactivity. Would you like to stay logged in?
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 text-center">
          <div className="text-sm text-gray-600 mb-2">Time remaining</div>
          <div className={`text-4xl font-bold ${getCountdownColor()}`}>
            {formatCountdown(remainingTime)}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExtend}
            disabled={isExtending || isLoggingOut}
            className="flex-1"
            variant="default"
          >
            {isExtending ? 'Extending...' : 'Stay Logged In'}
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isExtending || isLoggingOut}
            className="flex-1"
            variant="outline"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Click "Stay Logged In" to extend your session for another 15 minutes.
        </p>
      </DialogContent>
    </Dialog>
  );
};
```

```typescript
// frontend/components/storefront/auth/SessionIndicator/index.ts
export { SessionStatusIndicator } from './SessionStatusIndicator';
export { SessionExpiryWarning } from './SessionExpiryWarning';
```

### Integration in Layout

```typescript
// In storefront layout
import { SessionStatusIndicator, SessionExpiryWarning } from '@/components/storefront/auth/SessionIndicator';
import { useSessionExpiry } from '@/hooks/storefront/useSessionExpiry';

export default function StorefrontLayout({ children }) {
  const { showWarning, remainingTime, extendSession, logout } = useSessionExpiry();

  return (
    <>
      <header>
        {/* Other header content */}
        <SessionStatusIndicator showTimer variant="detailed" position="header" />
      </header>

      <main>{children}</main>

      <SessionExpiryWarning
        open={showWarning}
        remainingTime={remainingTime}
        onExtend={extendSession}
        onLogout={logout}
      />
    </>
  );
}
```

### Expected Outcome
- Session status indicator visible in UI
- Warning modal appears 5 minutes before expiry
- Countdown timer updates in real-time
- Users can extend session or logout
- Visual feedback for all states

### Verification Checklist
- [ ] SessionStatusIndicator component created
- [ ] SessionExpiryWarning component created
- [ ] Timer displays correctly
- [ ] Countdown updates every second
- [ ] Stay Logged In button works
- [ ] Logout button works
- [ ] Modal closes appropriately
- [ ] Accessibility features implemented
- [ ] Integration in layout complete

---

## Task 82: Complete Auth Flow Verification

### Overview
Perform comprehensive end-to-end verification of the entire authentication flow including registration, login, session management, token refresh, cart merge, and logout. This task ensures all authentication features work together seamlessly, validates integration points, tests edge cases, verifies security measures, and confirms user experience meets requirements. This is the final validation before considering the authentication system complete.

### Dependencies
- All previous tasks (Tasks 1-81)
- Complete authentication system
- Testing environment

### Instructions

1. **Create authentication flow test checklist**
   - Document all test scenarios
   - Define expected outcomes
   - Create test data sets
   - Prepare test accounts

2. **Test registration flow**
   - Complete registration form
   - Verify email validation
   - Check password requirements
   - Verify terms acceptance
   - Confirm account creation
   - Check welcome email sent
   - Verify auto-login after registration

3. **Test login flow**
   - Login with valid credentials
   - Verify token storage
   - Check remember me functionality
   - Verify redirect to intended page
   - Test invalid credentials handling
   - Check error messages

4. **Test session management**
   - Verify session persistence on refresh
   - Check token auto-refresh
   - Test session expiry warning
   - Verify extend session functionality
   - Test automatic logout on expiry

5. **Test cart merge flow**
   - Add items to cart as guest
   - Login with existing account
   - Verify cart merge execution
   - Check merged cart contents
   - Verify quantities combined correctly
   - Test with empty carts

6. **Test logout flow**
   - Click logout button
   - Verify tokens cleared
   - Check redirect to home/login
   - Verify cart cleared (if applicable)
   - Test API calls fail after logout

7. **Test password reset flow**
   - Request password reset
   - Verify email sent
   - Click reset link
   - Create new password
   - Login with new password

8. **Test social login flow**
   - Login with Google (if implemented)
   - Verify account creation/linking
   - Check profile data sync
   - Verify token storage

9. **Test security measures**
   - Verify httpOnly cookies used
   - Check HTTPS requirement
   - Test CSRF protection
   - Verify XSS protection
   - Check input sanitization

10. **Test edge cases**
    - Multiple simultaneous logins
    - Token refresh during API call
    - Expired refresh token
    - Network errors during auth
    - Browser back button behavior
    - Tab synchronization

11. **Test accessibility**
    - Keyboard navigation
    - Screen reader compatibility
    - Focus management
    - ARIA labels
    - Error announcements

12. **Document test results**
    - Create test report
    - Note any issues found
    - Document workarounds
    - List known limitations

### Comprehensive Test Checklist

#### Registration Flow
- [ ] Registration form displays correctly
- [ ] Email validation working
- [ ] Password requirements enforced
- [ ] Terms checkbox required
- [ ] Account created in database
- [ ] Welcome email sent
- [ ] Auto-login after registration
- [ ] Redirect to dashboard/shop

#### Login Flow
- [ ] Login form displays correctly
- [ ] Email/password validation
- [ ] Remember me checkbox functional
- [ ] Valid credentials accepted
- [ ] Tokens stored securely
- [ ] User state updated
- [ ] Redirect to intended page
- [ ] Invalid credentials rejected
- [ ] Error messages clear

#### Session Management
- [ ] Session persists on page refresh
- [ ] Token auto-refresh working
- [ ] Access token refreshed before expiry
- [ ] Refresh token used correctly
- [ ] Session expiry warning shown
- [ ] Extend session button works
- [ ] Automatic logout on token expiry
- [ ] Session status indicator accurate

#### Cart Merge
- [ ] Guest cart saved in localStorage
- [ ] User cart fetched on login
- [ ] Carts merged correctly
- [ ] Quantities combined
- [ ] Duplicate items handled
- [ ] Empty cart scenarios work
- [ ] Merge conflicts resolved
- [ ] Guest cart cleared after merge
- [ ] UI updated with merged cart

#### Logout Flow
- [ ] Logout button accessible
- [ ] Tokens cleared from cookies
- [ ] Auth state reset
- [ ] Cart cleared (if needed)
- [ ] Redirect to login/home
- [ ] API calls fail after logout
- [ ] Session monitor stopped

#### Password Reset
- [ ] Forgot password link works
- [ ] Email sent with reset link
- [ ] Reset link valid
- [ ] New password form displayed
- [ ] Password updated
- [ ] Login with new password works

#### Social Login
- [ ] Google login button works
- [ ] OAuth flow completes
- [ ] Account created/linked
- [ ] Profile data synced
- [ ] Tokens stored
- [ ] Redirect to app

#### Security
- [ ] Tokens in httpOnly cookies
- [ ] HTTPS enforced (prod)
- [ ] CSRF protection active
- [ ] XSS protection working
- [ ] SQL injection prevented
- [ ] Rate limiting applied
- [ ] Input sanitization working

#### Edge Cases
- [ ] Multiple logins handled
- [ ] Token refresh during API call
- [ ] Expired refresh token handled
- [ ] Network errors handled gracefully
- [ ] Back button behavior correct
- [ ] Multiple tabs synchronized
- [ ] Session conflicts resolved

#### Accessibility
- [ ] Keyboard navigation complete
- [ ] Tab order logical
- [ ] Focus visible
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Error announcements work
- [ ] Forms accessible

### Test Scenarios

```typescript
// Test Scenario 1: Complete Registration to Logout
describe('Complete Auth Flow', () => {
  it('should complete full auth lifecycle', async () => {
    // 1. Register new account
    await registerUser({
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User',
    });
    
    // 2. Verify auto-login
    expect(isAuthenticated()).toBe(true);
    
    // 3. Verify tokens stored
    expect(getAccessToken()).toBeDefined();
    expect(getRefreshToken()).toBeDefined();
    
    // 4. Logout
    await logout();
    
    // 5. Verify logout
    expect(isAuthenticated()).toBe(false);
    expect(getAccessToken()).toBeNull();
  });
});

// Test Scenario 2: Guest Cart Merge
describe('Cart Merge on Login', () => {
  it('should merge guest cart with user cart', async () => {
    // 1. Add items as guest
    await addToCart({ productId: 'prod-1', quantity: 2 });
    await addToCart({ productId: 'prod-2', quantity: 1 });
    
    // 2. Verify guest cart
    expect(getGuestCart()).toHaveLength(2);
    
    // 3. Login
    await login({
      email: 'user@example.com',
      password: 'password',
    });
    
    // 4. Wait for cart merge
    await waitFor(() => expect(getCart()).toBeDefined());
    
    // 5. Verify merged cart
    const cart = getCart();
    expect(cart.items).toContain({ productId: 'prod-1' });
    expect(cart.items).toContain({ productId: 'prod-2' });
    
    // 6. Verify guest cart cleared
    expect(getGuestCart()).toBeNull();
  });
});

// Test Scenario 3: Session Expiry Handling
describe('Session Expiry', () => {
  it('should handle session expiry gracefully', async () => {
    // 1. Login
    await login({ email: 'test@example.com', password: 'password' });
    
    // 2. Start session monitor
    sessionExpiryService.startExpiryMonitor();
    
    // 3. Fast-forward time to 5 min before expiry
    jest.advanceTimersByTime(10 * 60 * 1000);
    
    // 4. Verify warning shown
    await waitFor(() => expect(getWarningModal()).toBeVisible());
    
    // 5. Click extend session
    await clickButton('Stay Logged In');
    
    // 6. Verify session extended
    expect(getAccessToken()).toBeDefined();
    expect(getWarningModal()).not.toBeVisible();
  });
});
```

### Verification Report Template

```markdown
# Authentication Flow Verification Report

## Test Environment
- Date: YYYY-MM-DD
- Tester: Name
- Environment: Development/Staging
- Browser: Chrome/Firefox/Safari

## Summary
- Total Tests: X
- Passed: Y
- Failed: Z
- Success Rate: %

## Test Results

### Registration Flow
✅ All tests passed
- Registration form validation: PASS
- Account creation: PASS
- Auto-login: PASS

### Login Flow
✅ All tests passed
- Valid credentials: PASS
- Invalid credentials: PASS
- Remember me: PASS

### Session Management
⚠️ 1 issue found
- Token persistence: PASS
- Auto-refresh: PASS
- Expiry warning: ISSUE (shows 1 second late)
- Logout on expiry: PASS

### Cart Merge
✅ All tests passed
- Guest cart save: PASS
- Merge on login: PASS
- Quantity combination: PASS

## Issues Found
1. Session expiry warning shows 1 second late
   - Severity: Low
   - Fix: Adjust check interval
   - Status: Open

## Recommendations
1. Implement retry logic for cart merge
2. Add more detailed error messages
3. Improve session expiry accuracy

## Conclusion
Authentication system is functional with minor issues. Recommend fixing session expiry timing before production release.
```

### Expected Outcome
- All authentication flows verified
- Test checklist completed
- Issues documented
- System ready for production
- User experience validated

### Verification Checklist
- [ ] Registration flow tested
- [ ] Login flow tested
- [ ] Session management tested
- [ ] Cart merge tested
- [ ] Logout flow tested
- [ ] Password reset tested
- [ ] Security measures verified
- [ ] Edge cases tested
- [ ] Accessibility tested
- [ ] Test report created
- [ ] Issues documented
- [ ] All critical features working

---

## Final Notes

### Authentication System Overview

The authentication system is now complete with:
- **Secure token management** using httpOnly cookies
- **Automatic token refresh** to maintain sessions
- **Session expiry warnings** for better UX
- **Intelligent cart merging** on login
- **Remember me functionality** for extended sessions
- **Complete logout flow** with cleanup
- **Session status indicators** for user awareness

### Integration Points

| Component | Integration | Status |
|-----------|-------------|--------|
| Token Service | Login, Logout, API calls | ✅ Complete |
| Cart Merge | Login flow | ✅ Complete |
| Session Expiry | Background monitoring | ✅ Complete |
| Remember Me | Login form, Token storage | ✅ Complete |
| Session UI | Layout, Header | ✅ Complete |

### Security Checklist

- [x] httpOnly cookies for tokens
- [x] Secure flag in production
- [x] SameSite=Strict policy
- [x] Short access token expiry (15 min)
- [x] Longer refresh token expiry (7-30 days)
- [x] Automatic logout on expiry
- [x] Token refresh before expiry
- [x] CSRF protection via SameSite
- [x] XSS prevention via httpOnly

### Next Steps

After completing this group:
1. Proceed to **Group F: Social Login & Testing**
2. Implement Google OAuth integration
3. Add Facebook login (optional)
4. Write integration tests
5. Perform security audit
6. Prepare for production deployment

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Cart merge fails | Check API endpoint availability |
| Session warning not showing | Verify monitor started on login |
| Token refresh failing | Check refresh token validity |
| Guest cart not saved | Verify localStorage access |
| Logout not clearing tokens | Ensure cookie domain matches |

---

**End of Group E: Session & Remember Me**

This completes the implementation of session management, cart merge, and authentication verification for the webstore customer authentication system.
