# Tasks 10-13: Manager, Constraints & Validation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 07 - Product Media  
> **Group:** A - Product Image Models  
> **Document:** 03 of 04  
> **Tasks Covered:** 10, 11, 12, 13

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-05-09_ProductImage-Model.md](02_Tasks-05-09_ProductImage-Model.md)
- **→ Next Document:** [04_Tasks-14-16_Filename-Signals-Admin.md](04_Tasks-14-16_Filename-Signals-Admin.md)

---

## Document Overview

This document covers the creation of custom manager methods, database constraints for is_primary uniqueness, a convenience method for setting primary images, and comprehensive image validation logic.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 10 | Add ProductImage manager | Medium |
| 11 | Create is_primary constraint | Medium |
| 12 | Add set_as_primary method | Low |
| 13 | Create image validation | Medium |

---

## Task 10: Add ProductImage Manager

### Overview
Create a custom manager for ProductImage with convenient query methods for getting primary images and gallery images. This provides a clean API for common image retrieval patterns.

### Dependencies
- Task 09: Create ProductImage Meta class

### Instructions

1. **Create manager file**
   - Create `image_manager.py` in `backend/apps/products/media/managers/`
   - Add module docstring explaining purpose

2. **Import required modules**
   - Import `models` from `django.db`
   - Import `Q` from `django.db.models` for complex queries

3. **Define ProductImageManager class**
   - Create class inheriting from `models.Manager`
   - Add class docstring describing available methods

4. **Create get_primary method**
   - Define `get_primary(self, product)` method
   - Accept `product` parameter (Product instance or ID)
   - Query for image where `product=product` and `is_primary=True`
   - Use `.first()` to get single result (None if not found)
   - Return ProductImage instance or None
   - Add docstring with usage example

5. **Create get_gallery method**
   - Define `get_gallery(self, product)` method
   - Accept `product` parameter (Product instance or ID)
   - Query for all images where `product=product`
   - Order by `display_order, id`
   - Return QuerySet of ProductImage instances
   - Add docstring with usage example

6. **Create get_gallery_excluding_primary method**
   - Define `get_gallery_excluding_primary(self, product)` method
   - Query for images where `product=product` and `is_primary=False`
   - Order by `display_order, id`
   - Useful for displaying secondary images separately
   - Return QuerySet

7. **Create set_primary_image method**
   - Define `set_primary_image(self, product, image_id)` method
   - Accept `product` and `image_id` parameters
   - First, set all product images to `is_primary=False`
   - Then set specified image to `is_primary=True`
   - Use transaction to ensure atomicity
   - Return the updated ProductImage instance
   - Raise exception if image not found or doesn't belong to product

8. **Create get_by_position method**
   - Define `get_by_position(self, product, position)` method
   - Accept `product` and `position` (display_order value)
   - Query for image at specific display_order
   - Return ProductImage instance or None

9. **Create count_for_product method**
   - Define `count_for_product(self, product)` method
   - Return count of images for given product
   - Useful for checking gallery limits

10. **Add manager to ProductImage model**
    - Open `product_image.py`
    - Add `objects = ProductImageManager()` to ProductImage class
    - Import ProductImageManager at top of file

### Manager Method Summary

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| get_primary | product | ProductImage or None | Get primary image |
| get_gallery | product | QuerySet | Get all images ordered |
| get_gallery_excluding_primary | product | QuerySet | Get non-primary images |
| set_primary_image | product, image_id | ProductImage | Change primary image |
| get_by_position | product, position | ProductImage or None | Get image at position |
| count_for_product | product | int | Count product images |

### Usage Examples

```
# Get primary image
primary = ProductImage.objects.get_primary(product)
if primary:
    url = primary.image.url

# Get gallery
gallery = ProductImage.objects.get_gallery(product)
for img in gallery:
    print(img.display_order, img.image.url)

# Get secondary images (excluding primary)
secondary = ProductImage.objects.get_gallery_excluding_primary(product)

# Set new primary image
ProductImage.objects.set_primary_image(product, image_id=5)

# Check gallery size
count = ProductImage.objects.count_for_product(product)
if count >= 10:
    raise ValidationError("Maximum 10 images per product")
```

### Transaction Safety

```
set_primary_image must be atomic:

Step 1: Begin transaction
Step 2: UPDATE products_product_images 
        SET is_primary = FALSE 
        WHERE product_id = X

Step 3: UPDATE products_product_images 
        SET is_primary = TRUE 
        WHERE id = Y AND product_id = X

Step 4: Commit transaction

If Step 3 fails, Step 2 is rolled back
→ No product left without primary image
```

### Expected Outcome
```
backend/apps/products/media/
├── managers/
│   ├── __init__.py                 # Import ProductImageManager
│   └── image_manager.py            # NEW (Manager class)
└── models/
    └── product_image.py            # UPDATED (add objects = ProductImageManager())
```

### Verification Checklist
- [ ] `image_manager.py` file created
- [ ] ProductImageManager class defined
- [ ] get_primary method implemented (returns single or None)
- [ ] get_gallery method implemented (returns ordered QuerySet)
- [ ] get_gallery_excluding_primary method implemented
- [ ] set_primary_image method implemented (atomic transaction)
- [ ] get_by_position method implemented
- [ ] count_for_product method implemented
- [ ] Manager assigned to ProductImage.objects
- [ ] All methods have docstrings

---

## Task 11: Create is_primary Constraint

### Overview
Implement a database-level constraint to ensure only one image per product can have is_primary=True. This prevents data integrity issues and ensures consistent primary image designation.

### Dependencies
- Task 10: Add ProductImage manager

### Instructions

1. **Open product_image.py**
   - Open `backend/apps/products/media/models/product_image.py`
   - Locate the Meta class

2. **Import required modules**
   - Ensure `Q` is imported from `django.db.models`
   - Ensure `UniqueConstraint` is imported from `django.db.models`

3. **Add unique constraint to Meta**
   - In Meta class, locate or create `constraints` list
   - Add `UniqueConstraint` instance

4. **Configure constraint**
   - Set `fields=['product', 'is_primary']`
   - Set `condition=Q(is_primary=True)`
   - Set `name='unique_primary_per_product'`
   - This ensures only one row can have is_primary=True per product

5. **Add constraint documentation**
   - Add comment above constraint explaining its purpose
   - Note that multiple False values are allowed (constraint only applies to True)

6. **Handle constraint violations**
   - Document that attempting to set multiple primary images will raise IntegrityError
   - Application code should use set_primary_image manager method to avoid violations

### Constraint Logic

```
Allowed Scenarios:
Product 1:
- Image A: is_primary=True  ✓ (only one True)
- Image B: is_primary=False ✓
- Image C: is_primary=False ✓

Not Allowed:
Product 1:
- Image A: is_primary=True  ❌
- Image B: is_primary=True  ❌ (constraint violation)
- Image C: is_primary=False ✓
```

### Database Constraint SQL

```sql
CREATE UNIQUE INDEX unique_primary_per_product
ON products_product_images (product_id, is_primary)
WHERE is_primary = TRUE;

Explanation:
- Unique index on (product_id, is_primary)
- Only applied WHERE is_primary = TRUE
- Multiple FALSE values allowed (not in index)
- Only one TRUE value per product_id allowed
```

### Constraint vs Application Logic

| Approach | Pros | Cons |
|----------|------|------|
| **Database Constraint** | Guaranteed data integrity, works across all code paths | Harder to test, can't customize error message |
| **Application Logic** | Easy to test, custom validation messages | Can be bypassed, race conditions |
| **Both (Recommended)** | Best of both worlds | More code to maintain |

### Error Handling

```
When constraint is violated:

IntegrityError will be raised:
django.db.utils.IntegrityError: 
duplicate key value violates unique constraint "unique_primary_per_product"

Application should:
1. Catch IntegrityError
2. Convert to ValidationError
3. Return user-friendly message:
   "Another image is already set as primary for this product"
```

### Testing the Constraint

```
Test Case 1: Single primary allowed
1. Create product
2. Create image A with is_primary=True
3. Save successfully ✓

Test Case 2: Second primary rejected
1. Create product
2. Create image A with is_primary=True
3. Create image B with is_primary=True
4. Expect IntegrityError ✓

Test Case 3: Multiple non-primary allowed
1. Create product
2. Create images A, B, C with is_primary=False
3. All save successfully ✓
```

### Expected Outcome
```
ProductImage Meta class (updated):
class Meta:
    db_table = 'products_product_images'
    ordering = ['product', 'display_order', 'id']
    indexes = [...]
    constraints = [
        models.UniqueConstraint(  ← ADDED
            fields=['product', 'is_primary'],
            condition=Q(is_primary=True),
            name='unique_primary_per_product'
        )
    ]
```

### Verification Checklist
- [ ] UniqueConstraint added to Meta.constraints
- [ ] Fields set to ['product', 'is_primary']
- [ ] Condition set to Q(is_primary=True)
- [ ] Name set to 'unique_primary_per_product'
- [ ] Comment explains constraint purpose
- [ ] Documentation notes IntegrityError handling

---

## Task 12: Add set_as_primary Method

### Overview
Add a convenient instance method to ProductImage that sets the current image as primary and automatically unsets the previous primary image. This provides a clean API for primary image management.

### Dependencies
- Task 11: Create is_primary constraint

### Instructions

1. **Open product_image.py**
   - Open `backend/apps/products/media/models/product_image.py`
   - Add method to ProductImage class

2. **Import transaction module**
   - Import `transaction` from `django.db`
   - Needed for atomic database operations

3. **Define set_as_primary method**
   - Create instance method `set_as_primary(self)`
   - No parameters needed (operates on self)
   - Wrap in `@transaction.atomic` decorator
   - Add docstring explaining method purpose

4. **Unset current primary**
   - Query for current primary image: `product=self.product, is_primary=True`
   - Exclude self (in case this image is already primary)
   - Set `is_primary=False` for all results
   - Use `.update(is_primary=False)` for efficiency

5. **Set this image as primary**
   - Set `self.is_primary = True`
   - Call `self.save(update_fields=['is_primary'])`
   - Only update is_primary field to avoid signal recursion

6. **Return self**
   - Return `self` for method chaining
   - Allows: `image.set_as_primary().refresh_from_db()`

7. **Add error handling**
   - If product is None, raise ValueError
   - Message: "Image must be associated with a product"

8. **Add signal consideration**
   - Add comment noting this method can be called without triggering full save signals
   - Uses `update_fields` to minimize signal processing

### Method Flow Diagram

```
image.set_as_primary()
        │
        ▼
┌──────────────────────┐
│ Begin Transaction    │
└──────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ Find current primary for product     │
│ ProductImage.objects.filter(          │
│   product=self.product,               │
│   is_primary=True                     │
│ ).exclude(id=self.id)                │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Set them to False    │
│ .update(is_primary=  │
│   False)             │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Set self to True     │
│ self.is_primary=True │
│ self.save(update_    │
│   fields=['is_       │
│   primary'])         │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Commit Transaction   │
└──────────────────────┘
        │
        ▼
    Return self
```

### Usage Examples

```
# Example 1: Set image as primary
image = ProductImage.objects.get(id=5)
image.set_as_primary()
# Now image is primary, all others for same product are not

# Example 2: Method chaining
image = ProductImage.objects.get(id=5)
image.set_as_primary().refresh_from_db()

# Example 3: In API endpoint
def set_primary_view(request, image_id):
    image = get_object_or_404(ProductImage, id=image_id)
    image.set_as_primary()
    return Response({"message": "Primary image updated"})

# Example 4: Error handling
image = ProductImage(image=uploaded_file)  # No product yet
try:
    image.set_as_primary()
except ValueError as e:
    print(e)  # "Image must be associated with a product"
```

### Comparison with Manager Method

| Approach | Code | When to Use |
|----------|------|-------------|
| **Instance Method** | `image.set_as_primary()` | When you already have the image instance |
| **Manager Method** | `ProductImage.objects.set_primary_image(product, image_id)` | When you have product and image ID |

### Transaction Atomicity

```
Why @transaction.atomic is critical:

Scenario Without Transaction:
1. Unset current primary → SUCCESS
2. Server crashes before setting new primary
3. Result: Product has NO primary image ❌

With @transaction.atomic:
1. Begin transaction
2. Unset current primary (in transaction)
3. Set new primary (in transaction)
4. Commit both changes together
5. If step 3 fails, step 2 is rolled back ✓
6. Result: Product always has exactly one primary image
```

### Expected Outcome
```
ProductImage class (updated):
class ProductImage(TenantAwareModel):
    # ... fields ...
    
    def set_as_primary(self):  ← NEW
        """
        Set this image as the primary image for its product.
        Automatically unsets the previous primary image.
        """
        if not self.product:
            raise ValueError("Image must be associated with a product")
        
        with transaction.atomic():
            # Unset current primary
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(id=self.id).update(is_primary=False)
            
            # Set this as primary
            self.is_primary = True
            self.save(update_fields=['is_primary'])
        
        return self
```

### Verification Checklist
- [ ] set_as_primary method defined in ProductImage class
- [ ] Method decorated with @transaction.atomic
- [ ] Unsets current primary for same product
- [ ] Excludes self from unset query
- [ ] Sets self.is_primary = True
- [ ] Uses save(update_fields=['is_primary'])
- [ ] Raises ValueError if product is None
- [ ] Returns self for method chaining
- [ ] Docstring explains method behavior

---

## Task 13: Create Image Validation

### Overview
Create comprehensive validation logic for uploaded images including file type validation, size limits, dimension requirements, and file corruption checks. This ensures only valid images are accepted.

### Dependencies
- Task 02: Define image size constants
- Task 03: Define allowed image formats

### Instructions

1. **Create validators file**
   - Create `validators.py` in `backend/apps/products/media/`
   - Add module docstring

2. **Import required modules**
   - Import `ValidationError` from `django.core.exceptions`
   - Import `PIL.Image` for image inspection
   - Import constants from `.constants`
   - Import `os` for file operations

3. **Create validate_image_file_extension function**
   - Define function accepting `value` parameter (UploadedFile)
   - Extract file extension using `os.path.splitext()`
   - Convert extension to lowercase
   - Check if extension in ALLOWED_EXTENSIONS
   - Raise ValidationError if not allowed
   - Error message: "Unsupported file type. Allowed: jpg, jpeg, png, webp, gif"

4. **Create validate_image_mime_type function**
   - Define function accepting `value` parameter
   - Access `value.content_type` to get MIME type
   - Check if MIME type in ALLOWED_MIME_TYPES
   - Raise ValidationError if not allowed
   - Error message: "Invalid image MIME type"

5. **Create validate_image_file_size function**
   - Define function accepting `value` parameter
   - Get file size: `value.size`
   - Check if size > MAX_FILE_SIZE (from constants)
   - Raise ValidationError if too large
   - Error message: "File size exceeds 5MB limit"

6. **Create validate_image_dimensions function**
   - Define function accepting `value` parameter
   - Open image using `PIL.Image.open(value)`
   - Get dimensions: `width, height = image.size`
   - Check minimum dimensions (MIN_WIDTH, MIN_HEIGHT)
   - Check maximum dimensions (MAX_ORIGINAL_WIDTH, MAX_ORIGINAL_HEIGHT)
   - Raise ValidationError with dimension details if invalid
   - Close image after inspection

7. **Create validate_image_corruption function**
   - Define function accepting `value` parameter
   - Try to open and verify image using PIL
   - Call `image.verify()` to check for corruption
   - Catch exceptions (IOError, SyntaxError)
   - Raise ValidationError if corrupted
   - Error message: "Uploaded file is not a valid image or is corrupted"

8. **Create validate_animated_gif function**
   - Define function accepting `value` parameter
   - Open image with PIL
   - Check if image format is GIF
   - Check if `image.is_animated` (if attribute exists)
   - If animated and ALLOW_ANIMATED_GIF is False, raise ValidationError
   - Error message: "Animated GIFs are not allowed"

9. **Create composite validate_product_image function**
   - Define function that runs all validators
   - Accept `value` parameter (UploadedFile)
   - Call all validator functions in sequence
   - This is the main validator to use

10. **Add validator to ProductImage model**
    - Open `product_image.py`
    - Import `validate_product_image` from `.validators`
    - Add `validators=[validate_product_image]` to image field

### Validator Chain

```
validate_product_image(uploaded_file)
        │
        ├─► validate_image_file_extension
        │   └─► Check: .jpg, .jpeg, .png, .webp, .gif
        │
        ├─► validate_image_mime_type
        │   └─► Check: image/jpeg, image/png, etc.
        │
        ├─► validate_image_file_size
        │   └─► Check: size <= 5MB
        │
        ├─► validate_image_dimensions
        │   └─► Check: 100x100 <= size <= 4000x4000
        │
        ├─► validate_image_corruption
        │   └─► Check: PIL can open and verify
        │
        └─► validate_animated_gif
            └─► Check: animated GIF if disallowed
```

### Validation Error Messages

| Validation | Error Message | User Action |
|-----------|---------------|-------------|
| Extension | "Unsupported file type. Allowed: jpg, jpeg, png, webp, gif" | Change file format |
| MIME Type | "Invalid image MIME type" | Upload valid image |
| File Size | "File size exceeds 5MB limit" | Compress image |
| Min Dimensions | "Image too small. Minimum: 100×100 pixels" | Upload larger image |
| Max Dimensions | "Image too large. Maximum: 4000×4000 pixels" | Resize image |
| Corruption | "Uploaded file is not a valid image or is corrupted" | Re-upload file |
| Animated GIF | "Animated GIFs are not allowed" | Upload static GIF or use video |

### Performance Considerations

```
Validation Order (fastest to slowest):
1. Extension check      (~0.001ms) - String comparison
2. MIME type check      (~0.001ms) - Attribute access
3. File size check      (~0.001ms) - Attribute access
4. Dimension check      (~50ms)    - Open image header
5. Corruption check     (~100ms)   - Full image verification

Strategy: Fast checks first (fail fast principle)
- If extension is wrong, no need to open image
- If size is too large, no need to verify corruption
```

### Security Considerations

```
Why multiple validation layers:

1. Extension Check:
   - Prevents obvious wrong files (.exe, .pdf)
   - Not secure alone (can be faked)

2. MIME Type Check:
   - Server-side content type validation
   - More reliable than extension
   - Still can be spoofed

3. PIL Verification:
   - Actually opens and validates image
   - Catches malformed files
   - Prevents upload of non-image with fake extension

Combined: Strong defense against malicious uploads
```

### Expected Outcome
```
backend/apps/products/media/
├── validators.py                   # NEW (validation functions)
└── models/
    └── product_image.py            # UPDATED (add validators to image field)

validators.py contains:
├── validate_image_file_extension
├── validate_image_mime_type
├── validate_image_file_size
├── validate_image_dimensions
├── validate_image_corruption
├── validate_animated_gif
└── validate_product_image (composite)
```

### Verification Checklist
- [ ] `validators.py` file created
- [ ] validate_image_file_extension function defined
- [ ] validate_image_mime_type function defined
- [ ] validate_image_file_size function defined (5MB limit)
- [ ] validate_image_dimensions function defined (100-4000 pixels)
- [ ] validate_image_corruption function defined (PIL verify)
- [ ] validate_animated_gif function defined
- [ ] validate_product_image composite function defined
- [ ] Validator added to ProductImage.image field
- [ ] All validators raise ValidationError with clear messages

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 10 | Add ProductImage manager | Custom manager with get_primary, get_gallery methods |
| 11 | Create is_primary constraint | Database constraint ensuring single primary per product |
| 12 | Add set_as_primary method | Instance method for setting primary image atomically |
| 13 | Create image validation | Comprehensive validation for type, size, dimensions, corruption |

### Files Created/Updated

```
backend/apps/products/media/
├── managers/
│   ├── __init__.py                 # Import ProductImageManager
│   └── image_manager.py            # NEW (6 manager methods)
├── models/
│   └── product_image.py            # UPDATED (manager, constraint, method)
└── validators.py                   # NEW (7 validation functions)
```

### Manager Methods Available

| Method | Usage | Returns |
|--------|-------|---------|
| get_primary | `ProductImage.objects.get_primary(product)` | ProductImage or None |
| get_gallery | `ProductImage.objects.get_gallery(product)` | QuerySet (ordered) |
| get_gallery_excluding_primary | `ProductImage.objects.get_gallery_excluding_primary(product)` | QuerySet |
| set_primary_image | `ProductImage.objects.set_primary_image(product, img_id)` | ProductImage |
| get_by_position | `ProductImage.objects.get_by_position(product, pos)` | ProductImage or None |
| count_for_product | `ProductImage.objects.count_for_product(product)` | int |

### Data Integrity Features

✅ **Database Constraint:** Only one primary image per product  
✅ **Atomic Transactions:** set_as_primary uses transaction.atomic  
✅ **Comprehensive Validation:** Type, size, dimensions, corruption checks  
✅ **Manager Methods:** Clean API for common operations  
✅ **Error Handling:** Clear error messages for validation failures  

### Next Steps
Proceed to [04_Tasks-14-16_Filename-Signals-Admin.md](04_Tasks-14-16_Filename-Signals-Admin.md) to add original filename tracking, pre-save signals for metadata extraction, and admin configuration.

---

## Notes for AI Agents

1. **Manager Pattern:** Custom manager provides cleaner API than manual queries
2. **Database Constraint:** Guarantees data integrity at database level
3. **Atomic Transactions:** Critical for maintaining consistency
4. **Validation Chain:** Fast checks first (fail fast principle)
5. **PIL Verification:** Strongest defense against malicious uploads
6. **Error Messages:** User-friendly messages guide corrective action
7. **Performance:** Dimension check ~50ms, corruption check ~100ms
8. **Security:** Multiple validation layers prevent bypassing
9. **Next Document:** Signals and admin (Tasks 14-16)
10. **Group Complete After Next:** Group A finishes with Task 16
