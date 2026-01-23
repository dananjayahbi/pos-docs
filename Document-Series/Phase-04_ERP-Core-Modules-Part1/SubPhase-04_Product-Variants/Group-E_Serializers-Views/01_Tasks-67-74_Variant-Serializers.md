# Tasks 67-74: Variant Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** E - Serializers & Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Variant-Managers-QuerySets/](../Group-D_Variant-Managers-QuerySets/)
- **→ Next Document:** [02_Tasks-75-78_Variant-Views-ViewSets.md](02_Tasks-75-78_Variant-Views-ViewSets.md)

---

## Document Overview

This document covers creating DRF serializers for all variant models and establishing API representations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create VariantOptionTypeSerializer | Low |
| 68 | Create VariantOptionValueSerializer | Medium |
| 69 | Create ProductVariantOptionSerializer | Medium |
| 70 | Create ProductVariantSerializer | High |
| 71 | Add Nested Representations | High |
| 72 | Add Write Operations | High |
| 73 | Add Validation Logic | Medium |
| 74 | Test Serializers | Medium |

---

## Task 67: Create VariantOptionTypeSerializer

### Overview
Create serializer for VariantOptionType model.

### Dependencies
- VariantOptionType model (Group A)
- Django REST Framework installed

### Instructions

1. **Create variant_serializers.py**
   - Location: `backend/apps/products/serializers/variant_serializers.py`

2. **Define VariantOptionTypeSerializer**
   - Inherit from TenantModelSerializer
   - Include all fields
   - Add read-only computed fields

### Implementation

```python
from rest_framework import serializers
from apps.core.serializers import TenantModelSerializer
from ..models import VariantOptionType, VariantOptionValue, ProductVariant

class VariantOptionTypeSerializer(TenantModelSerializer):
    """Serializer for VariantOptionType."""
    
    value_count = serializers.IntegerField(
        source='values.count',
        read_only=True
    )
    
    class Meta:
        model = VariantOptionType
        fields = [
            'id', 'name', 'display_name', 'display_order',
            'is_active', 'value_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'value_count']
```

### Verification Checklist
- [ ] VariantOptionTypeSerializer created
- [ ] All fields included
- [ ] value_count computed field
- [ ] Proper inheritance

---

## Task 68: Create VariantOptionValueSerializer

### Overview
Create serializer for VariantOptionValue with swatch handling.

### Dependencies
- Task 67: VariantOptionTypeSerializer

### Instructions

1. **Define VariantOptionValueSerializer**
   - Include option type details
   - Handle color and image swatches
   - Add validation for swatches

### Implementation

```python
class VariantOptionValueSerializer(TenantModelSerializer):
    """Serializer for VariantOptionValue."""
    
    option_type_name = serializers.CharField(
        source='option_type.name',
        read_only=True
    )
    swatch_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = VariantOptionValue
        fields = [
            'id', 'option_type', 'option_type_name', 'value',
            'display_value', 'color_swatch', 'image_swatch',
            'swatch_preview', 'display_order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_swatch_preview(self, obj):
        """Get appropriate swatch representation."""
        if obj.image_swatch:
            return {
                'type': 'image',
                'url': obj.image_swatch.url
            }
        elif obj.color_swatch:
            return {
                'type': 'color',
                'value': obj.color_swatch
            }
        return None
```

### Verification Checklist
- [ ] VariantOptionValueSerializer created
- [ ] Swatch handling logic
- [ ] Nested option type info
- [ ] Proper field selection

---

## Task 69: Create ProductVariantOptionSerializer

### Overview
Create serializer for the ProductVariantOption through model.

### Dependencies
- Tasks 67-68: Option serializers

### Instructions

1. **Define ProductVariantOptionSerializer**
   - Include full option value details
   - Nest VariantOptionValueSerializer

### Implementation

```python
class ProductVariantOptionSerializer(TenantModelSerializer):
    """Serializer for ProductVariantOption (through model)."""
    
    option_value = VariantOptionValueSerializer(read_only=True)
    option_value_id = serializers.PrimaryKeyRelatedField(
        queryset=VariantOptionValue.objects.all(),
        source='option_value',
        write_only=True
    )
    
    class Meta:
        model = ProductVariantOption
        fields = [
            'id', 'variant', 'option_value', 'option_value_id',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
```

### Verification Checklist
- [ ] ProductVariantOptionSerializer created
- [ ] Nested serializer for read
- [ ] Primary key for write
- [ ] Through model handled

---

## Task 70: Create ProductVariantSerializer

### Overview
Create main ProductVariant serializer with all relationships.

### Dependencies
- Tasks 67-69: Related serializers

### Instructions

1. **Define ProductVariantSerializer**
   - Include all fields
   - Nest options serializer
   - Add computed fields (price, stock)

### Implementation

```python
class ProductVariantSerializer(TenantModelSerializer):
    """Serializer for ProductVariant."""
    
    options = ProductVariantOptionSerializer(
        source='variant_options',
        many=True,
        read_only=True
    )
    
    current_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True,
        source='get_effective_price'
    )
    
    stock_quantity = serializers.IntegerField(
        read_only=True,
        source='get_total_stock'
    )
    
    option_summary = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'product', 'sku', 'barcode', 'options',
            'option_summary', 'override_price', 'current_price',
            'override_weight', 'override_dimensions',
            'stock_quantity', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_option_summary(self, obj):
        """Get human-readable option summary."""
        return obj.get_option_display()
```

### Verification Checklist
- [ ] ProductVariantSerializer created
- [ ] All fields included
- [ ] Nested options
- [ ] Computed fields
- [ ] option_summary method

---

## Task 71: Add Nested Representations

### Overview
Add detailed nested representations for list and detail views.

### Dependencies
- Task 70: Base serializer

### Instructions

1. **Create ProductVariantDetailSerializer**
   - Extend ProductVariantSerializer
   - Add more nested data
   - Include related prices, stock

2. **Create ProductVariantListSerializer**
   - Lighter version for lists
   - Essential fields only

### Implementation

```python
class ProductVariantListSerializer(TenantModelSerializer):
    """Lightweight serializer for variant lists."""
    
    option_display = serializers.CharField(
        source='get_option_display',
        read_only=True
    )
    
    price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        source='get_effective_price',
        read_only=True
    )
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'sku', 'option_display', 'price',
            'is_active', 'created_at'
        ]


class ProductVariantDetailSerializer(ProductVariantSerializer):
    """Detailed serializer with all relationships."""
    
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    
    price_history = serializers.SerializerMethodField()
    stock_locations = serializers.SerializerMethodField()
    
    class Meta(ProductVariantSerializer.Meta):
        fields = ProductVariantSerializer.Meta.fields + [
            'product_name', 'price_history', 'stock_locations'
        ]
    
    def get_price_history(self, obj):
        """Get recent price changes."""
        # Implementation
        return []
    
    def get_stock_locations(self, obj):
        """Get stock by location."""
        # Implementation
        return []
```

### Verification Checklist
- [ ] List serializer created
- [ ] Detail serializer created
- [ ] Appropriate field selection
- [ ] Performance optimized

---

## Task 72: Add Write Operations

### Overview
Add create/update logic with option handling.

### Dependencies
- Tasks 70-71: Serializers defined

### Instructions

1. **Add create method**
   - Handle options in create
   - Validate option combination

2. **Add update method**
   - Allow updating override fields
   - Prevent changing options (would change SKU)

### Implementation

```python
class ProductVariantSerializer(TenantModelSerializer):
    # ... existing code ...
    
    option_value_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    def create(self, validated_data):
        """Create variant with options."""
        option_value_ids = validated_data.pop('option_value_ids', [])
        
        variant = ProductVariant.objects.create(**validated_data)
        
        # Create ProductVariantOption entries
        for option_value_id in option_value_ids:
            ProductVariantOption.objects.create(
                variant=variant,
                option_value_id=option_value_id
            )
        
        return variant
    
    def update(self, instance, validated_data):
        """Update variant (options cannot be changed)."""
        # Remove options if provided
        validated_data.pop('option_value_ids', None)
        
        # Update allowed fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
```

### Verification Checklist
- [ ] create method implemented
- [ ] Options handled in create
- [ ] update method implemented
- [ ] Options prevented in update
- [ ] Validation added

---

## Task 73: Add Validation Logic

### Overview
Add comprehensive validation for variants and options.

### Dependencies
- Task 72: Write operations

### Instructions

1. **Add validate method**
   - Check SKU uniqueness
   - Validate option combination
   - Check override values

2. **Add field-level validation**
   - Validate barcode format
   - Validate price/weight ranges

### Implementation

```python
class ProductVariantSerializer(TenantModelSerializer):
    # ... existing code ...
    
    def validate_sku(self, value):
        """Validate SKU uniqueness."""
        if self.instance:
            # Update case
            if ProductVariant.objects.exclude(
                pk=self.instance.pk
            ).filter(sku=value).exists():
                raise serializers.ValidationError(
                    "A variant with this SKU already exists."
                )
        else:
            # Create case
            if ProductVariant.objects.filter(sku=value).exists():
                raise serializers.ValidationError(
                    "A variant with this SKU already exists."
                )
        return value
    
    def validate_override_price(self, value):
        """Validate override price."""
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "Override price cannot be negative."
            )
        return value
    
    def validate(self, data):
        """Validate complete variant data."""
        # Check option combination uniqueness
        if 'option_value_ids' in data and 'product' in data:
            existing = ProductVariant.objects.filter(
                product=data['product']
            )
            for variant in existing:
                variant_option_ids = set(
                    variant.option_values.values_list('id', flat=True)
                )
                if variant_option_ids == set(data['option_value_ids']):
                    raise serializers.ValidationError(
                        "A variant with this option combination already exists."
                    )
        
        return data
```

### Verification Checklist
- [ ] SKU validation added
- [ ] Price validation added
- [ ] Option combination check
- [ ] Custom validators
- [ ] Error messages clear

---

## Task 74: Test Serializers

### Overview
Create comprehensive tests for all serializers.

### Dependencies
- Tasks 67-73: All serializers complete

### Instructions

1. **Create test_variant_serializers.py**
   - Location: `backend/apps/products/tests/test_variant_serializers.py`

2. **Test each serializer**
   - Test serialization
   - Test deserialization
   - Test validation
   - Test nested representations

### Test Implementation

```python
from django.test import TestCase
from apps.products.serializers.variant_serializers import (
    VariantOptionTypeSerializer,
    VariantOptionValueSerializer,
    ProductVariantSerializer,
)
from apps.products.models import (
    VariantOptionType, VariantOptionValue,
    Product, ProductVariant
)

class VariantSerializerTests(TestCase):
    
    def setUp(self):
        """Set up test data."""
        self.option_type = VariantOptionType.objects.create(
            name='size',
            display_name='Size'
        )
        self.option_value = VariantOptionValue.objects.create(
            option_type=self.option_type,
            value='m',
            display_value='Medium'
        )
        self.product = Product.objects.create(
            name='T-Shirt',
            sku='TSHIRT'
        )
    
    def test_option_type_serializer(self):
        """Test VariantOptionTypeSerializer."""
        serializer = VariantOptionTypeSerializer(self.option_type)
        data = serializer.data
        
        assert data['name'] == 'size'
        assert 'value_count' in data
    
    def test_option_value_serializer(self):
        """Test VariantOptionValueSerializer."""
        serializer = VariantOptionValueSerializer(self.option_value)
        data = serializer.data
        
        assert data['value'] == 'm'
        assert data['option_type_name'] == 'size'
    
    def test_variant_serializer_read(self):
        """Test ProductVariantSerializer read."""
        variant = ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M'
        )
        
        serializer = ProductVariantSerializer(variant)
        data = serializer.data
        
        assert data['sku'] == 'TSHIRT-M'
        assert 'options' in data
        assert 'current_price' in data
    
    def test_variant_create_with_options(self):
        """Test creating variant with options."""
        data = {
            'product': self.product.id,
            'sku': 'TSHIRT-M',
            'option_value_ids': [self.option_value.id]
        }
        
        serializer = ProductVariantSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        
        variant = serializer.save()
        assert variant.option_values.count() == 1
    
    def test_duplicate_sku_validation(self):
        """Test SKU uniqueness validation."""
        ProductVariant.objects.create(
            product=self.product,
            sku='TSHIRT-M'
        )
        
        data = {
            'product': self.product.id,
            'sku': 'TSHIRT-M'
        }
        
        serializer = ProductVariantSerializer(data=data)
        assert not serializer.is_valid()
        assert 'sku' in serializer.errors
```

### Verification Checklist
- [ ] Test file created
- [ ] All serializers tested
- [ ] Read operations tested
- [ ] Write operations tested
- [ ] Validation tested
- [ ] Edge cases covered
- [ ] All tests passing

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | VariantOptionTypeSerializer | Option type API |
| 68 | VariantOptionValueSerializer | Option value API |
| 69 | ProductVariantOptionSerializer | Through model API |
| 70 | ProductVariantSerializer | Main variant API |
| 71 | Nested Representations | List/Detail serializers |
| 72 | Write Operations | Create/Update logic |
| 73 | Validation Logic | Validators |
| 74 | Test Serializers | Test suite |

### API Endpoints Ready

With these serializers, the API can:
- ✅ List/create/update variant option types
- ✅ List/create/update option values
- ✅ List/create/update product variants
- ✅ Get variant details with options
- ✅ Validate variant data

### Next Steps
1. Proceed to [02_Tasks-75-78_Variant-Views-ViewSets.md](02_Tasks-75-78_Variant-Views-ViewSets.md) for ViewSets

---

## Notes for AI Agents

1. **Serializer Types:** List (lightweight), Detail (full data), Write (create/update)
2. **Nested Serializers:** Use nested for read, PK for write
3. **Validation:** SKU uniqueness critical, option combination uniqueness required
4. **Performance:** Use select_related/prefetch_related in viewsets
5. **Multi-tenant:** All serializers inherit TenantModelSerializer
6. **Swatches:** Handle both color (hex) and image swatches
7. **Computed Fields:** Price and stock from methods, not direct fields
8. **Write Protection:** Options cannot be changed after creation (would invalidate SKU)
