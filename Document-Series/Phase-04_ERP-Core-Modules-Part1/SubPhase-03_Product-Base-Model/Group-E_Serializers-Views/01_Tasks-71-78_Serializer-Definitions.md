# Tasks 71-78: Serializer Definitions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** E - Serializers & Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-79-84_ViewSets-URLs.md](02_Tasks-79-84_ViewSets-URLs.md)

---

## Document Overview

This document covers creating DRF serializers for all product-related models including the Product model with auto-SKU generation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Create serializers.py File | Low |
| 72 | Create BrandSerializer | Low |
| 73 | Create TaxClassSerializer | Low |
| 74 | Create UnitOfMeasureSerializer | Low |
| 75 | Create ProductListSerializer | Medium |
| 76 | Create ProductDetailSerializer | Medium |
| 77 | Create ProductCreateSerializer | High |
| 78 | Add Auto SKU Generation | High |

---

## Task 71: Create serializers.py File

### Overview
Create the serializers module for DRF API serialization.

### Dependencies
- Task 70: Create Migration

### Instructions

1. **Create serializers.py file**
   - Create at: `backend/apps/products/serializers.py`
   - At products app level (not in models/)

2. **Add file docstring**
   - Describe API serializers for products
   - List all serializers
   - Note different serializers for list/detail/create

3. **Import dependencies**
   - Import rest_framework serializers
   - Import all product models
   - Import slugify utility
   - Import transaction for atomic operations

### Expected Outcome
```python
"""
DRF Serializers for products app.

Provides serializers for:
- Brand, TaxClass, UnitOfMeasure (supporting models)
- ProductListSerializer (lightweight for lists)
- ProductDetailSerializer (full details with nested data)
- ProductCreateSerializer (with validation and auto-SKU)
"""

from django.db import transaction
from django.utils.text import slugify
from rest_framework import serializers

from apps.categories.serializers import CategorySerializer
from apps.products.models import Brand, TaxClass, UnitOfMeasure, Product
from apps.products.constants import PRODUCT_TYPES, PRODUCT_STATUS
```

### Verification Checklist
- [ ] serializers.py created
- [ ] Has file docstring
- [ ] All imports present

---

## Tasks 72-74: Supporting Model Serializers

### Overview
Create simple ModelSerializers for Brand, TaxClass, and UnitOfMeasure.

### Instructions

**Task 72: BrandSerializer**
1. Create ModelSerializer for Brand
2. Include all fields
3. slug is read-only (auto-generated)
4. logo returns URL

**Task 73: TaxClassSerializer**
1. Create ModelSerializer for TaxClass
2. Include all fields
3. Simple serialization

**Task 74: UnitOfMeasureSerializer**
1. Create ModelSerializer for UnitOfMeasure
2. Include all fields
3. Simple serialization

### Expected Outcome
```python
class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model."""
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'description', 'website', 'is_active']
        read_only_fields = ['id', 'slug']


class TaxClassSerializer(serializers.ModelSerializer):
    """Serializer for TaxClass model."""
    
    class Meta:
        model = TaxClass
        fields = ['id', 'name', 'rate', 'is_default']
        read_only_fields = ['id']


class UnitOfMeasureSerializer(serializers.ModelSerializer):
    """Serializer for UnitOfMeasure model."""
    
    class Meta:
        model = UnitOfMeasure
        fields = ['id', 'name', 'symbol', 'description', 'is_active']
        read_only_fields = ['id']
```

### Verification Checklist
- [ ] All three serializers created
- [ ] Inherit from ModelSerializer
- [ ] Fields specified
- [ ] Read-only fields configured

---

## Task 75: Create ProductListSerializer

### Overview
Create a lightweight serializer for product list views.

### Dependencies
- Task 74: Create UnitOfMeasureSerializer

### Instructions

1. **Create ProductListSerializer**
   - Lightweight for list performance
   - Include essential fields only
   - Nested category name only
   - Nested brand name only

2. **Define fields**
   - Identity: id, name, slug, sku
   - Classification: category_name, brand_name, status
   - Pricing fields (when added in Phase-05)
   - Image thumbnail (when added)

3. **Add SerializerMethodFields**
   - category_name from category.name
   - brand_name from brand.name if exists
   - Keep queries efficient

4. **Configure Meta**
   - Specify fields explicitly
   - Mark read-only fields

### Expected Outcome
```python
class ProductListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for product lists.
    
    Optimized for performance in list views with minimal nested data.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    product_type_display = serializers.CharField(source='get_product_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'barcode',
            'category', 'category_name',
            'brand', 'brand_name',
            'product_type', 'product_type_display',
            'status', 'status_display',
            'is_webstore_visible', 'is_pos_visible',
            'featured',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
```

### Verification Checklist
- [ ] ProductListSerializer created
- [ ] Lightweight field selection
- [ ] SerializerMethodFields for nested names
- [ ] Optimized for list performance

---

## Task 76: Create ProductDetailSerializer

### Overview
Create a comprehensive serializer for product detail views.

### Dependencies
- Task 75: Create ProductListSerializer

### Instructions

1. **Create ProductDetailSerializer**
   - Include all product fields
   - Nested category details
   - Nested brand details
   - Nested tax_class details
   - Nested unit_of_measure details

2. **Configure nested serializers**
   - Use CategorySerializer for category
   - Use BrandSerializer for brand
   - Use TaxClassSerializer for tax_class
   - Use UnitOfMeasureSerializer for unit_of_measure
   - All nested are read-only

3. **Add all fields**
   - All identity fields
   - All classification fields
   - All physical attributes
   - All SEO fields
   - Timestamps

### Expected Outcome
```python
class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for product detail views.
    
    Includes full nested data for category, brand, tax class, and unit.
    """
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True, allow_null=True)
    tax_class = TaxClassSerializer(read_only=True)
    unit_of_measure = UnitOfMeasureSerializer(read_only=True)
    
    product_type_display = serializers.CharField(source='get_product_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            # Identity
            'id', 'name', 'slug', 'sku', 'barcode',
            'description', 'short_description',
            
            # Classification
            'category', 'brand', 'product_type', 'product_type_display',
            'status', 'status_display',
            
            # Visibility
            'is_webstore_visible', 'is_pos_visible', 'featured',
            
            # Tax & Measurement
            'tax_class', 'unit_of_measure',
            
            # Physical
            'weight', 'length', 'width', 'height',
            
            # SEO
            'seo_title', 'seo_description',
            
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
```

### Verification Checklist
- [ ] ProductDetailSerializer created
- [ ] All fields included
- [ ] Nested serializers configured
- [ ] Read-only fields specified

---

## Task 77: Create ProductCreateSerializer

### Overview
Create a serializer for product creation with validation.

### Dependencies
- Task 76: Create ProductDetailSerializer

### Instructions

1. **Create ProductCreateSerializer**
   - For create and update operations
   - Validation logic
   - Auto-SKU generation preparation
   - Slug auto-generation

2. **Configure writable fields**
   - Accept FK IDs (category_id, brand_id, etc.)
   - SKU optional (auto-generate if blank)
   - Slug optional (auto-generate if blank)
   - All other fields configurable

3. **Add validation methods**
   - validate_sku(): Check uniqueness if provided
   - validate_barcode(): Check format and uniqueness
   - validate(): Cross-field validation

4. **Plan create() method**
   - Will handle auto-SKU in next task
   - Generate slug if blank
   - Create product instance
   - Return created product

### Expected Outcome
```python
class ProductCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating products.
    
    Handles:
    - Auto-generation of SKU if not provided
    - Auto-generation of slug from name
    - Validation of unique fields
    """
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'sku', 'barcode',
            'description', 'short_description',
            'category', 'brand', 'product_type', 'status',
            'is_webstore_visible', 'is_pos_visible', 'featured',
            'tax_class', 'unit_of_measure',
            'weight', 'length', 'width', 'height',
            'seo_title', 'seo_description'
        ]
        extra_kwargs = {
            'sku': {'required': False, 'allow_blank': True},
            'slug': {'required': False, 'allow_blank': True},
            'brand': {'required': False, 'allow_null': True},
            'barcode': {'required': False, 'allow_blank': True},
        }
    
    def validate_sku(self, value):
        """Validate SKU uniqueness per tenant if provided."""
        if value:
            # Check uniqueness (tenant isolation handled by model)
            if Product.objects.filter(sku=value).exists():
                raise serializers.ValidationError("SKU already exists.")
        return value
    
    def validate_barcode(self, value):
        """Validate barcode format and uniqueness if provided."""
        if value:
            # Check uniqueness
            if Product.objects.filter(barcode=value).exists():
                raise serializers.ValidationError("Barcode already exists.")
            # TODO: Add format validation (EAN-13, UPC-A)
        return value
    
    # create() method will be added in next task
```

### Verification Checklist
- [ ] ProductCreateSerializer created
- [ ] Fields configured
- [ ] extra_kwargs for optional fields
- [ ] Validation methods added

---

## Task 78: Add Auto SKU Generation

### Overview
Implement automatic SKU generation in the create method.

### Dependencies
- Task 77: Create ProductCreateSerializer

### Instructions

1. **Implement _generate_sku method**
   - Format: PREFIX-CATEGORY-NUMBER
   - Example: PRD-ELEC-00001
   - Use category code if available
   - Sequential numbering
   - Ensure uniqueness

2. **Implement create method**
   - Generate SKU if not provided
   - Generate slug if not provided
   - Use transaction for atomicity
   - Handle concurrent requests

3. **Generate slug logic**
   - Slugify name
   - Check uniqueness
   - Append number if duplicate
   - Max 5 attempts

### Expected Outcome
```python
    def _generate_sku(self, category):
        """
        Generate unique SKU for product.
        
        Format: PRD-{CATEGORY_CODE}-{NUMBER}
        Example: PRD-ELEC-00001
        
        Args:
            category: Category instance
            
        Returns:
            Unique SKU string
        """
        # Get category code (first 4 letters uppercase)
        category_code = category.name[:4].upper()
        
        # Find last SKU with this pattern
        prefix = f"PRD-{category_code}-"
        last_product = Product.objects.filter(
            sku__startswith=prefix
        ).order_by('-sku').first()
        
        if last_product:
            # Extract number and increment
            try:
                last_number = int(last_product.sku.split('-')[-1])
                new_number = last_number + 1
            except (ValueError, IndexError):
                new_number = 1
        else:
            new_number = 1
        
        # Format: PRD-ELEC-00001
        return f"{prefix}{new_number:05d}"
    
    def create(self, validated_data):
        """Create product with auto-generated SKU and slug."""
        with transaction.atomic():
            # Auto-generate SKU if not provided
            if not validated_data.get('sku'):
                category = validated_data.get('category')
                validated_data['sku'] = self._generate_sku(category)
            
            # Auto-generate slug if not provided
            if not validated_data.get('slug'):
                base_slug = slugify(validated_data['name'])
                slug = base_slug
                counter = 1
                
                # Ensure uniqueness
                while Product.objects.filter(slug=slug).exists() and counter < 100:
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                
                validated_data['slug'] = slug
            
            # Create product
            product = Product.objects.create(**validated_data)
            return product
```

### Verification Checklist
- [ ] _generate_sku() method implemented
- [ ] create() method implemented
- [ ] SKU format: PRD-CATEGORY-NUMBER
- [ ] Slug uniqueness ensured
- [ ] Transaction wraps creation

---

## Summary of Deliverables

After completing Group E Document 1:

### Serializers Created
✓ BrandSerializer - Simple brand serialization  
✓ TaxClassSerializer - Tax class serialization  
✓ UnitOfMeasureSerializer - Unit serialization  
✓ ProductListSerializer - Lightweight for lists  
✓ ProductDetailSerializer - Full nested details  
✓ ProductCreateSerializer - Create/update with validation  
✓ Auto-SKU generation implemented

### Key Features
✓ Auto-generate SKU: PRD-CATEGORY-00001  
✓ Auto-generate slug from name  
✓ Validation for unique fields  
✓ Transaction safety for creation

---

## Notes for Implementation

1. **SKU Generation**
   - Use database locks for concurrent safety
   - Consider Redis for distributed systems
   - Format should be configurable
   - Log SKU generation for auditing

2. **Slug Handling**
   - Check uniqueness in slug generation
   - Limit retry attempts
   - Consider UUID suffix for guaranteed uniqueness
   - Validate slug format

3. **Serializer Usage**
   - ProductListSerializer in list views
   - ProductDetailSerializer in retrieve views
   - ProductCreateSerializer in create/update views
   - Different serializers optimize performance

4. **Validation**
   - Add barcode format validators
   - Validate dimension combinations
   - Check status transitions
   - Validate required fields per product type

---
