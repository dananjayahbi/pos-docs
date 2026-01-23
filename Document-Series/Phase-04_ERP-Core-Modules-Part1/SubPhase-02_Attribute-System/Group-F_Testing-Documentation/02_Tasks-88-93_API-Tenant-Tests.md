# Tasks 88-93: API & Tenant Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 88, 89, 90, 91, 92, 93

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-87_Model-Unit-Tests.md](01_Tasks-81-87_Model-Unit-Tests.md)
- **→ Next Document:** [03_Tasks-94-96_Documentation-Integration.md](03_Tasks-94-96_Documentation-Integration.md)

---

## Document Overview

This document covers creating API tests for all attribute endpoints, custom actions, and multi-tenant isolation verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 88 | Create test_api.py | Low |
| 89 | Test Group Endpoints | Medium |
| 90 | Test Attribute Endpoints | Medium |
| 91 | Test Option Endpoints | Medium |
| 92 | Test by_category Filter | High |
| 93 | Test Tenant Isolation | High |

---

## Task 88: Create test_api.py

### Overview
Create the test file for API endpoint tests with necessary imports, fixtures, and API client setup.

### Dependencies
- Task 87: Test Category Assignment

### Instructions

1. **Create test_api.py file**
   - Create: `backend/apps/attributes/tests/test_api.py`

2. **Import required modules**
   - pytest and pytest-django
   - Django REST Framework test client
   - Models and serializers
   - User model for authentication

3. **Create authentication fixture**
   - authenticated_client: Client with logged-in user

4. **Create data fixtures**
   - attribute_group_data: Data for creating groups
   - attribute_data: Data for creating attributes
   - category_data: Data for testing relationships

### Test File Structure

```python
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.attributes.models import AttributeGroup, Attribute, AttributeOption
from apps.categories.models import Category

User = get_user_model()


@pytest.fixture
def api_client():
    """Create API client"""
    return APIClient()


@pytest.fixture
def authenticated_client(db, api_client):
    """Create authenticated API client"""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def attribute_group(db):
    """Create test attribute group"""
    return AttributeGroup.objects.create(
        name='Specifications',
        slug='specifications',
        display_order=1
    )


@pytest.fixture
def category(db):
    """Create test category"""
    return Category.objects.create(
        name='Electronics',
        slug='electronics'
    )


# Test classes will be added in next tasks
```

### Verification Checklist
- [ ] test_api.py created
- [ ] Required imports added
- [ ] API client fixtures created
- [ ] Authentication fixture added
- [ ] Data fixtures defined

---

## Task 89: Test Group Endpoints

### Overview
Create tests for all AttributeGroup API endpoints (list, create, retrieve, update, delete).

### Dependencies
- Task 88: Create test_api.py

### Instructions

1. **Create TestAttributeGroupAPI class**
   - Test all CRUD operations

2. **Test list endpoint**
   - test_list_groups()
   - GET /api/attributes/groups/
   - Verify pagination and filtering

3. **Test create endpoint**
   - test_create_group()
   - POST /api/attributes/groups/
   - Verify group created correctly

4. **Test retrieve endpoint**
   - test_retrieve_group()
   - GET /api/attributes/groups/{slug}/
   - Verify group details returned

5. **Test update endpoint**
   - test_update_group()
   - PUT /api/attributes/groups/{slug}/
   - Verify group updated

6. **Test delete endpoint**
   - test_delete_group()
   - DELETE /api/attributes/groups/{slug}/
   - Verify group deleted

7. **Test authentication**
   - test_unauthenticated_access()
   - Verify 401 without auth

### Test Class Structure

```python
@pytest.mark.django_db
class TestAttributeGroupAPI:
    """Tests for AttributeGroup API endpoints"""
    
    def test_list_groups(self, authenticated_client, attribute_group):
        """Test listing attribute groups"""
        url = '/api/attributes/groups/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        assert response.data[0]['name'] == attribute_group.name
    
    def test_create_group(self, authenticated_client):
        """Test creating an attribute group"""
        url = '/api/attributes/groups/'
        data = {
            'name': 'New Group',
            'slug': 'new-group',
            'description': 'Test description',
            'display_order': 1,
            'is_active': True
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'New Group'
        assert AttributeGroup.objects.filter(slug='new-group').exists()
    
    def test_retrieve_group(self, authenticated_client, attribute_group):
        """Test retrieving a single group"""
        url = f'/api/attributes/groups/{attribute_group.slug}/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == attribute_group.name
        assert response.data['slug'] == attribute_group.slug
    
    def test_update_group(self, authenticated_client, attribute_group):
        """Test updating a group"""
        url = f'/api/attributes/groups/{attribute_group.slug}/'
        data = {
            'name': 'Updated Name',
            'slug': attribute_group.slug,
            'display_order': 2,
            'is_active': True
        }
        response = authenticated_client.put(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Updated Name'
        
        # Verify database updated
        attribute_group.refresh_from_db()
        assert attribute_group.name == 'Updated Name'
    
    def test_delete_group(self, authenticated_client, attribute_group):
        """Test deleting a group"""
        url = f'/api/attributes/groups/{attribute_group.slug}/'
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not AttributeGroup.objects.filter(id=attribute_group.id).exists()
    
    def test_unauthenticated_access(self, api_client):
        """Test unauthenticated access is denied"""
        url = '/api/attributes/groups/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

### Verification Checklist
- [ ] TestAttributeGroupAPI class created
- [ ] List endpoint test added
- [ ] Create endpoint test added
- [ ] Retrieve endpoint test added
- [ ] Update endpoint test added
- [ ] Delete endpoint test added
- [ ] Authentication test added

---

## Task 90: Test Attribute Endpoints

### Overview
Create tests for all Attribute API endpoints including filtering and serializer selection.

### Dependencies
- Task 89: Test Group Endpoints

### Instructions

1. **Create TestAttributeAPI class**
   - Test all CRUD operations

2. **Test list endpoint**
   - test_list_attributes()
   - Verify uses AttributeListSerializer

3. **Test create endpoint**
   - test_create_attribute()
   - Create attribute with all fields

4. **Test retrieve endpoint**
   - test_retrieve_attribute()
   - Verify uses AttributeDetailSerializer with nested options

5. **Test filtering**
   - test_filter_by_type()
   - Filter by attribute_type
   - test_filter_by_group()
   - Filter by group

6. **Test search**
   - test_search_attributes()
   - Search by name

7. **Test with options**
   - test_attribute_with_options()
   - Create SELECT attribute with options
   - Verify options in detail response

### Test Class Structure

```python
@pytest.mark.django_db
class TestAttributeAPI:
    """Tests for Attribute API endpoints"""
    
    def test_list_attributes(self, authenticated_client, attribute_group):
        """Test listing attributes"""
        # Create test attribute
        Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select',
            is_filterable=True
        )
        
        url = '/api/attributes/attributes/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
    
    def test_create_attribute(self, authenticated_client, attribute_group):
        """Test creating an attribute"""
        url = '/api/attributes/attributes/'
        data = {
            'name': 'Size',
            'slug': 'size',
            'group': attribute_group.id,
            'attribute_type': 'select',
            'is_required': False,
            'is_filterable': True,
            'is_visible_on_product': True,
            'display_order': 1
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Size'
        assert Attribute.objects.filter(slug='size').exists()
    
    def test_retrieve_attribute(self, authenticated_client, attribute_group):
        """Test retrieving attribute with nested options"""
        # Create attribute with options
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        AttributeOption.objects.create(
            attribute=attribute,
            value='red',
            label='Red',
            color_code='#FF0000'
        )
        
        url = f'/api/attributes/attributes/{attribute.slug}/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Color'
        assert 'options' in response.data
        assert len(response.data['options']) == 1
        assert response.data['options'][0]['value'] == 'red'
    
    def test_filter_by_type(self, authenticated_client, attribute_group):
        """Test filtering attributes by type"""
        # Create different types
        Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        Attribute.objects.create(
            name='Weight',
            slug='weight',
            group=attribute_group,
            attribute_type='number'
        )
        
        url = '/api/attributes/attributes/?attribute_type=select'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert all(attr['attribute_type'] == 'select' for attr in response.data)
    
    def test_filter_by_group(self, authenticated_client, attribute_group):
        """Test filtering attributes by group"""
        Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        
        url = f'/api/attributes/attributes/?group={attribute_group.id}'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert all(attr['group'] == attribute_group.id for attr in response.data)
    
    def test_search_attributes(self, authenticated_client, attribute_group):
        """Test searching attributes by name"""
        Attribute.objects.create(
            name='Product Color',
            slug='product-color',
            group=attribute_group,
            attribute_type='select'
        )
        
        url = '/api/attributes/attributes/?search=Color'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        assert 'Color' in response.data[0]['name']
```

### Verification Checklist
- [ ] TestAttributeAPI class created
- [ ] List endpoint test added
- [ ] Create endpoint test added
- [ ] Retrieve endpoint test added
- [ ] Filter by type test added
- [ ] Filter by group test added
- [ ] Search test added

---

## Task 91: Test Option Endpoints

### Overview
Create tests for AttributeOption API endpoints.

### Dependencies
- Task 90: Test Attribute Endpoints

### Instructions

1. **Create TestAttributeOptionAPI class**
   - Test CRUD operations for options

2. **Test list endpoint**
   - test_list_options()
   - Filter by attribute

3. **Test create endpoint**
   - test_create_option()
   - Create option with all fields

4. **Test filtering by attribute**
   - test_filter_by_attribute()
   - Get options for specific attribute

5. **Test color code validation**
   - test_color_code_format()
   - Verify hex color format

### Test Class Structure

```python
@pytest.mark.django_db
class TestAttributeOptionAPI:
    """Tests for AttributeOption API endpoints"""
    
    def test_list_options(self, authenticated_client, attribute_group):
        """Test listing attribute options"""
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        AttributeOption.objects.create(
            attribute=attribute,
            value='red',
            label='Red'
        )
        
        url = '/api/attributes/options/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
    
    def test_create_option(self, authenticated_client, attribute_group):
        """Test creating an attribute option"""
        attribute = Attribute.objects.create(
            name='Size',
            slug='size',
            group=attribute_group,
            attribute_type='select'
        )
        
        url = '/api/attributes/options/'
        data = {
            'attribute': attribute.id,
            'value': 'm',
            'label': 'Medium',
            'display_order': 2,
            'is_default': False
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['value'] == 'm'
        assert AttributeOption.objects.filter(value='m').exists()
    
    def test_filter_by_attribute(self, authenticated_client, attribute_group):
        """Test filtering options by attribute"""
        attr1 = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        attr2 = Attribute.objects.create(
            name='Size',
            slug='size',
            group=attribute_group,
            attribute_type='select'
        )
        
        # Create options for both
        option1 = AttributeOption.objects.create(
            attribute=attr1,
            value='red',
            label='Red'
        )
        option2 = AttributeOption.objects.create(
            attribute=attr2,
            value='m',
            label='Medium'
        )
        
        # Filter by attr1
        url = f'/api/attributes/options/?attribute={attr1.id}'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['value'] == 'red'
    
    def test_color_code_format(self, authenticated_client, attribute_group):
        """Test color code hex format"""
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        
        option = AttributeOption.objects.create(
            attribute=attribute,
            value='red',
            label='Red',
            color_code='#FF0000'
        )
        
        url = f'/api/attributes/options/{option.id}/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['color_code'] == '#FF0000'
```

### Verification Checklist
- [ ] TestAttributeOptionAPI class created
- [ ] List endpoint test added
- [ ] Create endpoint test added
- [ ] Filter by attribute test added
- [ ] Color code test added

---

## Task 92: Test by_category Filter

### Overview
Create comprehensive tests for the by_category custom action including category inheritance.

### Dependencies
- Task 91: Test Option Endpoints

### Instructions

1. **Create TestByCategoryFilter class**
   - Test custom action endpoint

2. **Test basic filtering**
   - test_get_attributes_by_category()
   - Get attributes for a category

3. **Test category inheritance**
   - test_category_inheritance()
   - Create parent and child categories
   - Assign attribute to parent
   - Request child category
   - Verify parent's attributes included

4. **Test error handling**
   - test_missing_category_id()
   - Verify 400 error when category_id missing
   - test_invalid_category_id()
   - Verify 404 when category doesn't exist

5. **Test with multiple categories**
   - test_multiple_category_levels()
   - Test 3-level hierarchy

### Test Class Structure

```python
@pytest.mark.django_db
class TestByCategoryFilter:
    """Tests for by_category custom action"""
    
    def test_get_attributes_by_category(
        self, authenticated_client, attribute_group, category
    ):
        """Test getting attributes for a category"""
        # Create attribute and assign to category
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        attribute.categories.add(category)
        
        url = f'/api/attributes/attributes/by-category/?category_id={category.id}'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == 'Color'
    
    def test_category_inheritance(self, authenticated_client, attribute_group):
        """Test attribute inheritance through category hierarchy"""
        # Create category hierarchy
        parent = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )
        child = Category.objects.create(
            name='Smartphones',
            slug='smartphones',
            parent=parent
        )
        
        # Create attribute assigned to parent
        attribute = Attribute.objects.create(
            name='Brand',
            slug='brand',
            group=attribute_group,
            attribute_type='text'
        )
        attribute.categories.add(parent)
        
        # Request child category - should include parent's attributes
        url = f'/api/attributes/attributes/by-category/?category_id={child.id}'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        assert any(attr['name'] == 'Brand' for attr in response.data)
    
    def test_missing_category_id(self, authenticated_client):
        """Test error when category_id is missing"""
        url = '/api/attributes/attributes/by-category/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data
    
    def test_invalid_category_id(self, authenticated_client):
        """Test error when category doesn't exist"""
        url = '/api/attributes/attributes/by-category/?category_id=99999'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_multiple_category_levels(self, authenticated_client, attribute_group):
        """Test 3-level category hierarchy"""
        # Create 3-level hierarchy
        grandparent = Category.objects.create(
            name='Products',
            slug='products'
        )
        parent = Category.objects.create(
            name='Electronics',
            slug='electronics',
            parent=grandparent
        )
        child = Category.objects.create(
            name='Smartphones',
            slug='smartphones',
            parent=parent
        )
        
        # Create attributes at different levels
        attr1 = Attribute.objects.create(
            name='Brand',
            slug='brand',
            group=attribute_group,
            attribute_type='text'
        )
        attr1.categories.add(grandparent)
        
        attr2 = Attribute.objects.create(
            name='Warranty',
            slug='warranty',
            group=attribute_group,
            attribute_type='text'
        )
        attr2.categories.add(parent)
        
        # Request child - should get all ancestor attributes
        url = f'/api/attributes/attributes/by-category/?category_id={child.id}'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        attribute_names = [attr['name'] for attr in response.data]
        assert 'Brand' in attribute_names
        assert 'Warranty' in attribute_names
```

### Verification Checklist
- [ ] TestByCategoryFilter class created
- [ ] Basic filtering test added
- [ ] Category inheritance test added
- [ ] Missing category_id test added
- [ ] Invalid category_id test added
- [ ] Multiple levels test added

---

## Task 93: Test Tenant Isolation

### Overview
Create tests to verify multi-tenant isolation for attribute data.

### Dependencies
- Task 92: Test by_category Filter

### Instructions

1. **Create TestTenantIsolation class**
   - Test tenant data separation

2. **Create tenant fixtures**
   - tenant1_schema: First tenant
   - tenant2_schema: Second tenant

3. **Test data isolation**
   - test_attributes_isolated_by_tenant()
   - Create attributes in each tenant
   - Verify tenant1 can't see tenant2's data

4. **Test group isolation**
   - test_groups_isolated_by_tenant()
   - Create groups in each tenant
   - Verify isolation

5. **Test option isolation**
   - test_options_isolated_by_tenant()
   - Create options in each tenant
   - Verify isolation

### Test Class Structure

```python
from django_tenants.test.cases import TenantTestCase
from django_tenants.utils import schema_context


@pytest.mark.django_db
class TestTenantIsolation:
    """Tests for multi-tenant data isolation"""
    
    def test_attributes_isolated_by_tenant(self, db):
        """Test attributes are isolated by tenant"""
        # This test requires django-tenants setup
        # Conceptual test structure shown
        
        # Create attribute in tenant1
        with schema_context('tenant1'):
            group1 = AttributeGroup.objects.create(
                name='Tenant1 Group',
                slug='tenant1-group'
            )
            attr1 = Attribute.objects.create(
                name='Tenant1 Attribute',
                slug='tenant1-attr',
                group=group1,
                attribute_type='text'
            )
            
            # Verify exists in tenant1
            assert Attribute.objects.filter(id=attr1.id).exists()
        
        # Switch to tenant2
        with schema_context('tenant2'):
            # Verify tenant1's attribute not accessible
            assert not Attribute.objects.filter(name='Tenant1 Attribute').exists()
            
            # Create tenant2 attribute
            group2 = AttributeGroup.objects.create(
                name='Tenant2 Group',
                slug='tenant2-group'
            )
            attr2 = Attribute.objects.create(
                name='Tenant2 Attribute',
                slug='tenant2-attr',
                group=group2,
                attribute_type='text'
            )
            
            # Verify only tenant2's attribute visible
            assert Attribute.objects.count() == 1
    
    def test_groups_isolated_by_tenant(self, db):
        """Test attribute groups are isolated by tenant"""
        with schema_context('tenant1'):
            group1 = AttributeGroup.objects.create(
                name='Tenant1 Group',
                slug='tenant1-group'
            )
            assert AttributeGroup.objects.filter(id=group1.id).exists()
        
        with schema_context('tenant2'):
            assert not AttributeGroup.objects.filter(name='Tenant1 Group').exists()
    
    def test_options_isolated_by_tenant(self, db):
        """Test attribute options are isolated by tenant"""
        with schema_context('tenant1'):
            group = AttributeGroup.objects.create(
                name='Group',
                slug='group'
            )
            attribute = Attribute.objects.create(
                name='Color',
                slug='color',
                group=group,
                attribute_type='select'
            )
            option1 = AttributeOption.objects.create(
                attribute=attribute,
                value='red',
                label='Red'
            )
            assert AttributeOption.objects.filter(id=option1.id).exists()
        
        with schema_context('tenant2'):
            assert not AttributeOption.objects.filter(value='red').exists()
```

### Business Context

**Why Tenant Isolation Matters:**

1. **Data Security:** Each business's attributes are private
2. **Customization:** Each tenant defines their own attribute schema
3. **Compliance:** Meet data privacy regulations

**Sri Lankan Context:**
- Retailer A defines attributes in Sinhala
- Retailer B defines attributes in English
- Neither sees the other's data

**Example Scenarios:**

**Tenant 1 (Electronics Store):**
- Attributes: Brand, Warranty Period, Power Consumption
- Units: Watts (W), Volts (V)
- Language: English

**Tenant 2 (Clothing Store - සිංහල):**
- Attributes: රෙදි වර්ගය (Fabric Type), ප්‍රමාණය (Size), පාට (Color)
- Units: cm, inches
- Language: Sinhala

### Verification Checklist
- [ ] TestTenantIsolation class created
- [ ] Attribute isolation test added
- [ ] Group isolation test added
- [ ] Option isolation test added
- [ ] schema_context used correctly

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 88 | Create test_api.py | API test file with fixtures |
| 89 | Test Group Endpoints | Group CRUD tests |
| 90 | Test Attribute Endpoints | Attribute CRUD and filter tests |
| 91 | Test Option Endpoints | Option CRUD tests |
| 92 | Test by_category Filter | Category filter and inheritance tests |
| 93 | Test Tenant Isolation | Multi-tenant isolation tests |

### API Test Coverage Summary

**AttributeGroup API:**
- List, create, retrieve, update, delete
- Authentication required

**Attribute API:**
- List with pagination
- Create with all fields
- Retrieve with nested options
- Filter by type and group
- Search by name

**AttributeOption API:**
- List and create
- Filter by attribute
- Color code validation

**Custom Actions:**
- by_category with category_id parameter
- Category inheritance (parent → child)
- Error handling (missing/invalid category_id)

**Tenant Isolation:**
- Attributes isolated per tenant
- Groups isolated per tenant
- Options isolated per tenant
- schema_context verification

### Next Steps
1. Proceed to [03_Tasks-94-96_Documentation-Integration.md](03_Tasks-94-96_Documentation-Integration.md)
2. Create README documentation
3. Document API endpoints
4. Verify full integration

---

## Notes for AI Agents

1. **API Client:** Use authenticated_client for all tests
2. **Status Codes:** Verify correct HTTP status codes
3. **Data Verification:** Check both response and database
4. **Tenant Tests:** Require django-tenants fixtures
5. **Category Inheritance:** Walk up parent chain
6. **No Code:** Instructions only
