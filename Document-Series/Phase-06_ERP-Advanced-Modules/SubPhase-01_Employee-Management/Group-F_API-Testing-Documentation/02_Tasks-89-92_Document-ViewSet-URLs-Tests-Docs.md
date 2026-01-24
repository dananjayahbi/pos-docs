# Tasks 89-92: DocumentViewSet, URLs, Tests & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-88_Serializers-ViewSet-Actions.md](01_Tasks-81-88_Serializers-ViewSet-Actions.md)

---

## Document Overview

This document covers the creation of the DocumentViewSet for secure document operations, URL routing configuration for all employee API endpoints, comprehensive test suite for the employee module, and complete module documentation including API reference and usage guides.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 89 | Create DocumentViewSet | Medium | 30 min |
| 90 | Register Employee API URLs | Low | 20 min |
| 91 | Create Employee Module Tests | High | 45 min |
| 92 | Create Employee Module Documentation | Medium | 35 min |

---

## Task 89: Create DocumentViewSet

### Overview
Create a specialized DocumentViewSet to handle employee document operations including upload, download, verification, and access control. This ViewSet implements secure file handling with proper permission checks and supports document management workflows.

### Dependencies
- Task 84: Create DocumentSerializer
- EmployeeDocument model exists
- File storage configured
- Document service functions exist

### Instructions

1. **Create document_viewset.py file**
   - Create file at `apps/employees/views/document_viewset.py`
   - Import DRF components
   - Import EmployeeDocument model

2. **Import required modules**
   - Import viewsets, parsers from DRF
   - Import Response, status from DRF
   - Import permissions, authentication
   - Import EmployeeDocument model
   - Import DocumentSerializer
   - Import document service functions
   - Import FileResponse for downloads

3. **Define DocumentViewSet class**
   - Inherit from ModelViewSet
   - Add ViewSet docstring

4. **Configure queryset**
   - Set queryset to EmployeeDocument.objects.all()
   - Include select_related for employee, uploaded_by
   - Order by created_at descending

5. **Configure serializer_class**
   - Set to DocumentSerializer

6. **Configure permission_classes**
   - Use IsAuthenticated
   - Add DocumentAccessPermission (custom)
   - Enforce tenant isolation

7. **Configure parser_classes**
   - Add MultiPartParser for file uploads
   - Add FormParser for form data
   - Add JSONParser for JSON data

8. **Override get_queryset method**
   - Apply tenant filtering
   - Apply employee filtering (if nested route)
   - Apply access control (employees see own docs only)
   - HR/Admin see all documents

9. **Override perform_create method**
   - Validate file upload
   - Set employee from URL parameter
   - Set uploaded_by from request.user
   - Call document_service.upload_document()
   - Generate secure filename
   - Save document

10. **Add download action**
    - Use @action decorator with detail=True, methods=['get']
    - Define download method
    - Check document access permissions
    - Generate secure download URL or stream file
    - Return FileResponse with proper headers

11. **Add verify action**
    - Use @action decorator with detail=True, methods=['post']
    - Define verify method
    - HR/Admin only permission
    - Set is_verified=True
    - Set verified_by and verified_at
    - Return success response

12. **Add unverify action**
    - Use @action decorator with detail=True, methods=['post']
    - Define unverify method
    - HR/Admin only permission
    - Set is_verified=False
    - Clear verified_by and verified_at
    - Return success response

13. **Override destroy method**
    - Check deletion permissions
    - Soft delete document record
    - Optionally keep file or delete from storage
    - Log deletion activity
    - Return success response

14. **Add get_permissions method**
    - Return different permissions based on action
    - download: Authenticated + DocumentAccess
    - verify/unverify: HR or Admin only
    - destroy: HR or Admin only

15. **Update views/__init__.py**
    - Import DocumentViewSet
    - Add to __all__ list

### DocumentViewSet Structure

```
┌─────────────────────────────────────────────────┐
│           DocumentViewSet                       │
├─────────────────────────────────────────────────┤
│ Configuration:                                  │
│  • queryset (with select_related)               │
│  • serializer_class (DocumentSerializer)        │
│  • permission_classes (Auth + Custom)           │
│  • parser_classes (MultiPart, Form, JSON)       │
│                                                 │
│ Standard Actions:                               │
│  • list() - GET /documents/                     │
│  • create() - POST /documents/                  │
│  • retrieve() - GET /documents/{id}/            │
│  • update() - PUT /documents/{id}/              │
│  • destroy() - DELETE /documents/{id}/          │
│                                                 │
│ Custom Actions:                                 │
│  • download() - GET /documents/{id}/download/   │
│  • verify() - POST /documents/{id}/verify/      │
│  • unverify() - POST /documents/{id}/unverify/  │
│                                                 │
│ Overridden Methods:                             │
│  • get_queryset() - Access control              │
│  • perform_create() - Secure upload             │
│  • destroy() - Soft delete                      │
│  • get_permissions() - Action-based perms       │
└─────────────────────────────────────────────────┘
```

### Document Upload Flow

```
Document Upload (POST /employees/{emp_id}/documents/)
══════════════════════════════════════════════════════
1. Client sends multipart/form-data request
2. create() method called
3. Validate file size and type
4. Check user permissions
5. perform_create() called
6. Generate secure filename
7. Upload file to storage (S3/local)
8. Create EmployeeDocument record
9. Set uploaded_by = request.user
10. Save document
11. Return serialized document (201)
```

### Document Download Flow

```
Document Download (GET /documents/{id}/download/)
═════════════════════════════════════════════════
1. Client requests download
2. download() action called
3. Retrieve document via get_queryset()
4. Check access permissions:
   - Employee: own documents only
   - Manager: team documents
   - HR/Admin: all documents
5. If access denied: Return 403
6. If access granted:
   a. Option 1: Redirect to signed S3 URL
   b. Option 2: Stream file via FileResponse
7. Set Content-Disposition header
8. Set Content-Type based on file
9. Return file to client
```

### Document Verification Flow

```
Document Verification (POST /documents/{id}/verify/)
════════════════════════════════════════════════════
1. HR reviews uploaded document
2. Calls verify() action
3. Check HR/Admin permission
4. Update document:
   - is_verified = True
   - verified_by = request.user
   - verified_at = now()
5. Save document
6. Send notification to employee
7. Return success response

Unverify follows similar process
```

### Permission Matrix

| Role | List | Upload | View | Download | Verify | Delete |
|------|------|--------|------|----------|--------|--------|
| Employee | Own | Own | Own | Own | No | Own (draft) |
| Manager | Team | No | Team | Team | No | No |
| HR | All | All | All | All | Yes | Yes |
| Admin | All | All | All | All | Yes | Yes |

### File Security Measures

```
┌──────────────────────────────────────────────┐
│       Document Security Measures              │
├──────────────────────────────────────────────┤
│                                              │
│ 1. File Type Validation                      │
│    - Whitelist: PDF, JPG, PNG only           │
│    - Check MIME type                         │
│    - Verify file extension                   │
│                                              │
│ 2. File Size Limits                          │
│    - Max 10 MB per file                      │
│    - Check before upload                     │
│                                              │
│ 3. Filename Sanitization                     │
│    - Remove special characters               │
│    - Generate UUID-based name                │
│    - Preserve extension                      │
│                                              │
│ 4. Access Control                            │
│    - Tenant isolation                        │
│    - Role-based permissions                  │
│    - Document ownership checks               │
│                                              │
│ 5. Secure Storage                            │
│    - Non-public S3 bucket                    │
│    - Signed URLs for download                │
│    - Short-lived access tokens               │
│                                              │
│ 6. Virus Scanning (Optional)                 │
│    - Scan on upload                          │
│    - Quarantine suspicious files             │
│                                              │
└──────────────────────────────────────────────┘
```

### Document Request/Response Examples

#### Upload Document
```
POST /api/v1/employees/{emp_id}/documents/
Content-Type: multipart/form-data

Form Data:
  document_type: NIC
  document_name: National Identity Card
  document_number: 912345678V
  file: [binary file data]

Response 201:
{
  "id": "doc-uuid",
  "document_type": "NIC",
  "document_name": "National Identity Card",
  "document_number": "912345678V",
  "file": "/media/employee-documents/uuid-nic.pdf",
  "file_url": "https://storage.example.com/signed-url...",
  "file_size": 524288,
  "file_size_display": "512.0 KB",
  "is_verified": false,
  "uploaded_by": {
    "username": "nuwan.fernando"
  },
  "created_at": "2026-01-24T10:30:00+05:30"
}
```

#### Download Document
```
GET /api/v1/documents/{id}/download/

Response 200:
Content-Type: application/pdf
Content-Disposition: attachment; filename="nic-001.pdf"
Content-Length: 524288

[Binary file data]

OR

Response 302:
Location: https://s3.amazonaws.com/bucket/file?signed-params...
```

#### Verify Document
```
POST /api/v1/documents/{id}/verify/
{
  "notes": "Original document verified by HR"
}

Response 200:
{
  "success": true,
  "message": "Document verified successfully",
  "document": {
    "id": "doc-uuid",
    "is_verified": true,
    "verified_by": {
      "username": "hr.admin"
    },
    "verified_at": "2026-01-24T11:00:00+05:30"
  }
}
```

### File Storage Configuration

```python
Storage Options
═══════════════

Option 1: Local File Storage
- MEDIA_ROOT = '/var/www/media/'
- MEDIA_URL = '/media/'
- Simple for development
- Not recommended for production

Option 2: Amazon S3
- AWS_STORAGE_BUCKET_NAME = 'employee-docs-prod'
- AWS_S3_REGION_NAME = 'ap-south-1'
- AWS_DEFAULT_ACL = 'private'
- Generate signed URLs for access
- Recommended for production

Option 3: Azure Blob Storage
- AZURE_ACCOUNT_NAME = 'storageaccount'
- AZURE_CONTAINER = 'employee-documents'
- Use SAS tokens for access
```

### Expected Outcome
- Functional document ViewSet
- Secure file upload/download
- Document verification workflow
- Proper access control
- File storage integration

### Verification Checklist
- [ ] document_viewset.py file created
- [ ] DocumentViewSet class defined
- [ ] queryset configured
- [ ] serializer_class set
- [ ] permission_classes configured
- [ ] parser_classes added
- [ ] get_queryset method overridden
- [ ] perform_create method overridden
- [ ] download action added
- [ ] verify action added
- [ ] unverify action added
- [ ] destroy method overridden
- [ ] get_permissions method added
- [ ] ViewSet imported in __init__.py

---

## Task 90: Register Employee API URLs

### Overview
Configure URL routing for all employee API endpoints using Django REST Framework routers. This includes registering ViewSets and configuring nested routes for related resources like addresses, contacts, documents, and bank accounts.

### Dependencies
- Task 86: Create EmployeeViewSet
- Task 89: Create DocumentViewSet
- All ViewSets completed

### Instructions

1. **Create urls.py file**
   - Create file at `apps/employees/urls.py`
   - Import DRF router components
   - Import all ViewSets

2. **Import required modules**
   - Import routers from rest_framework
   - Import path, include from django.urls
   - Import EmployeeViewSet
   - Import DocumentViewSet
   - Import other ViewSets if any

3. **Create DefaultRouter instance**
   - Instantiate DefaultRouter
   - This provides automatic URL generation

4. **Register EmployeeViewSet**
   - router.register('employees', EmployeeViewSet, basename='employee')
   - This creates all employee CRUD endpoints

5. **Register DocumentViewSet**
   - router.register('documents', DocumentViewSet, basename='document')
   - This creates document management endpoints

6. **Configure nested routes (optional but recommended)**
   - Use drf-nested-routers if installed
   - Create nested router for employee documents
   - Example: /employees/{id}/documents/

7. **Create app_name variable**
   - Set app_name = 'employees'
   - Enables namespaced URL reversing

8. **Create urlpatterns list**
   - Include router.urls
   - Add any custom path patterns if needed

9. **Add custom URL patterns (if any)**
   - Import/export endpoints
   - Bulk operations
   - Reports endpoints

10. **Update main project urls.py**
    - Navigate to project's main urls.py
    - Add include for employees.urls
    - Path: 'api/v1/', include('apps.employees.urls')

11. **Test URL routing**
    - Run Django development server
    - Access /api/v1/employees/ to verify
    - Check DRF browsable API

### URL Configuration Structure

```
┌─────────────────────────────────────────────────┐
│         Employee API URL Structure              │
├─────────────────────────────────────────────────┤
│ Base Path: /api/v1/                             │
│                                                 │
│ Employee Endpoints:                             │
│  • GET    /employees/                           │
│  • POST   /employees/                           │
│  • GET    /employees/{id}/                      │
│  • PUT    /employees/{id}/                      │
│  • PATCH  /employees/{id}/                      │
│  • DELETE /employees/{id}/                      │
│                                                 │
│ Employee Actions:                               │
│  • POST   /employees/{id}/activate/             │
│  • POST   /employees/{id}/deactivate/           │
│  • POST   /employees/{id}/terminate/            │
│  • POST   /employees/{id}/resign/               │
│  • POST   /employees/{id}/link_user/            │
│                                                 │
│ Nested Resources:                               │
│  • GET/POST /employees/{id}/addresses/          │
│  • GET/POST /employees/{id}/emergency_contacts/ │
│  • GET/POST /employees/{id}/family_members/     │
│  • GET/POST /employees/{id}/documents/          │
│  • GET/POST /employees/{id}/bank_accounts/      │
│  • GET     /employees/{id}/history/             │
│                                                 │
│ Document Endpoints:                             │
│  • GET    /documents/                           │
│  • POST   /documents/                           │
│  • GET    /documents/{id}/                      │
│  • PUT    /documents/{id}/                      │
│  • DELETE /documents/{id}/                      │
│  • GET    /documents/{id}/download/             │
│  • POST   /documents/{id}/verify/               │
│  • POST   /documents/{id}/unverify/             │
└─────────────────────────────────────────────────┘
```

### URL Configuration Code Example

```python
# apps/employees/urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EmployeeViewSet, DocumentViewSet

# Create router
router = DefaultRouter()

# Register viewsets
router.register('employees', EmployeeViewSet, basename='employee')
router.register('documents', DocumentViewSet, basename='document')

# App namespace
app_name = 'employees'

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
```

### Nested Routes Configuration (Advanced)

```python
# If using drf-nested-routers

from rest_framework_nested import routers

# Create main router
router = routers.DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')

# Create nested router for employee documents
employees_router = routers.NestedDefaultRouter(
    router, 
    'employees', 
    lookup='employee'
)
employees_router.register(
    'documents', 
    EmployeeDocumentViewSet, 
    basename='employee-documents'
)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(employees_router.urls)),
]

# This creates: /employees/{employee_id}/documents/
```

### Main Project URL Integration

```python
# project/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('', include('apps.employees.urls', namespace='employees')),
        path('', include('apps.departments.urls', namespace='departments')),
        # ... other app URLs
    ])),
]
```

### URL Naming Convention

| Pattern | URL Name | Reverse Example |
|---------|----------|-----------------|
| /employees/ | employee-list | reverse('employees:employee-list') |
| /employees/{id}/ | employee-detail | reverse('employees:employee-detail', args=[id]) |
| /employees/{id}/activate/ | employee-activate | reverse('employees:employee-activate', args=[id]) |
| /documents/ | document-list | reverse('employees:document-list') |
| /documents/{id}/download/ | document-download | reverse('employees:document-download', args=[id]) |

### API Root Endpoint

```
GET /api/v1/

Response 200:
{
  "employees": "http://api.example.com/api/v1/employees/",
  "documents": "http://api.example.com/api/v1/documents/",
  "departments": "http://api.example.com/api/v1/departments/",
  "designations": "http://api.example.com/api/v1/designations/"
}
```

### Testing URLs

```bash
# Test URL generation
python manage.py show_urls

# Should show:
/api/v1/employees/                                GET, POST
/api/v1/employees/{id}/                           GET, PUT, PATCH, DELETE
/api/v1/employees/{id}/activate/                  POST
/api/v1/employees/{id}/deactivate/                POST
/api/v1/employees/{id}/terminate/                 POST
/api/v1/employees/{id}/documents/                 GET, POST
/api/v1/documents/                                GET, POST
/api/v1/documents/{id}/                           GET, PUT, DELETE
/api/v1/documents/{id}/download/                  GET
/api/v1/documents/{id}/verify/                    POST
```

### Expected Outcome
- All employee endpoints accessible
- Nested routes configured
- URL reversing working
- DRF browsable API functional
- Proper URL naming

### Verification Checklist
- [ ] urls.py file created in employees app
- [ ] DefaultRouter instantiated
- [ ] EmployeeViewSet registered
- [ ] DocumentViewSet registered
- [ ] app_name set
- [ ] urlpatterns defined
- [ ] Main project urls.py updated
- [ ] Nested routes configured (if used)
- [ ] URLs accessible in browser
- [ ] DRF browsable API works
- [ ] URL reversing tested

---

## Task 91: Create Employee Module Tests

### Overview
Create comprehensive test suite for the employee module covering models, validators, services, and API endpoints. Tests include unit tests, integration tests, and end-to-end workflow tests ensuring code quality and reliability.

### Dependencies
- All employee models completed
- All services and validators completed
- All API endpoints completed
- pytest and pytest-django installed

### Instructions

1. **Create tests directory structure**
   - Navigate to `apps/employees/` directory
   - Create `tests/` directory if not exists
   - Create `__init__.py` in tests directory

2. **Create conftest.py for fixtures**
   - Create file at `apps/employees/tests/conftest.py`
   - Import pytest
   - Import necessary models
   - Define reusable fixtures

3. **Create test_models.py**
   - Create file at `apps/employees/tests/test_models.py`
   - Import pytest and models
   - Write model tests

4. **Create test_validators.py**
   - Create file at `apps/employees/tests/test_validators.py`
   - Import pytest and validators
   - Write validator tests

5. **Create test_services.py**
   - Create file at `apps/employees/tests/test_services.py`
   - Import pytest and services
   - Write service tests

6. **Create test_api.py**
   - Create file at `apps/employees/tests/test_api.py`
   - Import pytest and APIClient
   - Write API endpoint tests

7. **Write Employee model tests**
   - Test model creation
   - Test field validation
   - Test computed properties (full_name, age)
   - Test model methods
   - Test constraints (unique together)

8. **Write Address model tests**
   - Test address creation
   - Test postal code validation
   - Test multiple addresses per employee
   - Test address type choices

9. **Write EmergencyContact model tests**
   - Test contact creation
   - Test phone number validation
   - Test priority system
   - Test multiple contacts

10. **Write Document model tests**
    - Test document creation
    - Test file upload handling
    - Test verification workflow
    - Test soft delete

11. **Write BankAccount model tests**
    - Test bank account creation
    - Test account number validation
    - Test primary account logic
    - Test verification workflow

12. **Write NIC validator tests**
    - Test valid NIC formats (old and new)
    - Test invalid NIC formats
    - Test NIC parsing
    - Test age extraction from NIC

13. **Write phone validator tests**
    - Test valid Sri Lankan phone numbers
    - Test invalid phone numbers
    - Test phone number formatting
    - Test mobile vs landline detection

14. **Write email validator tests**
    - Test email format validation
    - Test email uniqueness per tenant
    - Test email domain validation

15. **Write employee service tests**
    - Test create_employee service
    - Test update_employee service
    - Test activate_employee service
    - Test deactivate_employee service
    - Test terminate_employee service
    - Test link_user_account service

16. **Write import service tests**
    - Test CSV import
    - Test Excel import
    - Test data validation during import
    - Test error handling

17. **Write export service tests**
    - Test CSV export
    - Test Excel export
    - Test data formatting
    - Test filtering in export

18. **Write API authentication tests**
    - Test unauthenticated access (401)
    - Test authenticated access
    - Test token authentication
    - Test session authentication

19. **Write API list endpoint tests**
    - Test list all employees
    - Test pagination
    - Test filtering
    - Test searching
    - Test ordering

20. **Write API create endpoint tests**
    - Test create employee with valid data
    - Test create with invalid data
    - Test required field validation
    - Test tenant isolation

21. **Write API retrieve endpoint tests**
    - Test get employee detail
    - Test nested serializers
    - Test access control
    - Test 404 for non-existent

22. **Write API update endpoint tests**
    - Test update employee
    - Test partial update (PATCH)
    - Test validation on update
    - Test optimistic locking if implemented

23. **Write API delete endpoint tests**
    - Test soft delete
    - Test hard delete (if allowed)
    - Test access control
    - Test cascading effects

24. **Write custom action tests**
    - Test activate action
    - Test deactivate action
    - Test terminate action
    - Test resign action
    - Test link_user action

25. **Write nested resource tests**
    - Test add address to employee
    - Test add emergency contact
    - Test upload document
    - Test add bank account

26. **Write document upload tests**
    - Test file upload
    - Test file size validation
    - Test file type validation
    - Test download

27. **Write permission tests**
    - Test employee can access own data
    - Test manager can access team data
    - Test HR can access all data
    - Test unauthorized access denied

28. **Write integration tests**
    - Test complete employee onboarding workflow
    - Test employee termination workflow
    - Test employee transfer workflow

29. **Configure pytest settings**
    - Create pytest.ini or update pyproject.toml
    - Configure test database
    - Set test markers

30. **Run tests and verify coverage**
    - Run: pytest apps/employees/tests/
    - Generate coverage report
    - Ensure >80% coverage

### Test Directory Structure

```
apps/employees/tests/
├── __init__.py
├── conftest.py                 # Shared fixtures
├── test_models.py              # Model tests
├── test_validators.py          # Validator tests
├── test_services.py            # Service tests
├── test_api.py                 # API endpoint tests
└── test_integration.py         # Integration tests (optional)
```

### Fixture Examples (conftest.py)

```python
# Sample fixture structure

import pytest
from django.contrib.auth import get_user_model
from apps.employees.models import Employee, Department, Designation
from apps.core.models import Tenant

User = get_user_model()

@pytest.fixture
def tenant():
    """Create test tenant"""
    return Tenant.objects.create(
        name="Test Company",
        domain="test.example.com"
    )

@pytest.fixture
def user(tenant):
    """Create test user"""
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        tenant=tenant
    )

@pytest.fixture
def department(tenant):
    """Create test department"""
    return Department.objects.create(
        tenant=tenant,
        name="Sales & Marketing",
        code="SM"
    )

@pytest.fixture
def designation(tenant):
    """Create test designation"""
    return Designation.objects.create(
        tenant=tenant,
        title="Sales Executive",
        code="SE",
        level=2
    )

@pytest.fixture
def employee(tenant, department, designation):
    """Create test employee"""
    return Employee.objects.create(
        tenant=tenant,
        employee_id="EMP-0001",
        first_name="Nuwan",
        last_name="Fernando",
        email="nuwan@example.com",
        phone_number="+94712345678",
        nic_number="912345678V",
        date_of_birth="1991-05-15",
        department=department,
        designation=designation,
        hire_date="2020-01-15"
    )

@pytest.fixture
def api_client():
    """Create API client"""
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, user):
    """Create authenticated API client"""
    api_client.force_authenticate(user=user)
    return api_client
```

### Model Test Examples

```python
# Sample model test structure

import pytest
from datetime import date
from apps.employees.models import Employee

@pytest.mark.django_db
class TestEmployeeModel:
    
    def test_create_employee(self, tenant, department, designation):
        """Test employee creation"""
        employee = Employee.objects.create(
            tenant=tenant,
            employee_id="EMP-TEST",
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            nic_number="901234567V",
            date_of_birth="1990-06-15",
            department=department,
            designation=designation,
            hire_date="2020-01-01"
        )
        assert employee.employee_id == "EMP-TEST"
        assert employee.full_name == "John Doe"
    
    def test_employee_age_calculation(self, employee):
        """Test age calculation from DOB"""
        assert employee.age == 35  # Adjust based on test date
    
    def test_employee_years_of_service(self, employee):
        """Test years of service calculation"""
        assert employee.years_of_service >= 6.0
    
    def test_employee_str_method(self, employee):
        """Test string representation"""
        assert str(employee) == "EMP-0001 - Nuwan Fernando"
```

### Validator Test Examples

```python
# Sample validator test structure

import pytest
from apps.employees.validators import validate_sri_lankan_nic

class TestNICValidator:
    
    def test_valid_old_nic(self):
        """Test valid old NIC format"""
        validate_sri_lankan_nic("912345678V")  # Should not raise
    
    def test_valid_new_nic(self):
        """Test valid new NIC format"""
        validate_sri_lankan_nic("199123456789")  # Should not raise
    
    def test_invalid_nic_format(self):
        """Test invalid NIC format"""
        with pytest.raises(ValidationError):
            validate_sri_lankan_nic("123")
    
    def test_invalid_nic_checksum(self):
        """Test invalid NIC checksum"""
        with pytest.raises(ValidationError):
            validate_sri_lankan_nic("912345678X")
```

### API Test Examples

```python
# Sample API test structure

import pytest
from django.urls import reverse

@pytest.mark.django_db
class TestEmployeeAPI:
    
    def test_list_employees_unauthenticated(self, api_client):
        """Test list employees without authentication"""
        url = reverse('employees:employee-list')
        response = api_client.get(url)
        assert response.status_code == 401
    
    def test_list_employees_authenticated(self, authenticated_client):
        """Test list employees with authentication"""
        url = reverse('employees:employee-list')
        response = authenticated_client.get(url)
        assert response.status_code == 200
        assert 'results' in response.data
    
    def test_create_employee(self, authenticated_client, department, designation):
        """Test create employee via API"""
        url = reverse('employees:employee-list')
        data = {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test.user@example.com',
            'phone_number': '+94712345678',
            'nic_number': '901234567V',
            'date_of_birth': '1990-06-15',
            'department_id': str(department.id),
            'designation_id': str(designation.id),
            'hire_date': '2020-01-01'
        }
        response = authenticated_client.post(url, data)
        assert response.status_code == 201
        assert response.data['first_name'] == 'Test'
    
    def test_activate_employee(self, authenticated_client, employee):
        """Test activate employee action"""
        url = reverse('employees:employee-activate', args=[employee.id])
        response = authenticated_client.post(url, {
            'effective_date': '2026-01-24'
        })
        assert response.status_code == 200
        assert response.data['employee']['status'] == 'ACTIVE'
```

### Test Coverage Goals

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Models | >90% | High |
| Validators | 100% | High |
| Services | >85% | High |
| Serializers | >80% | Medium |
| ViewSets | >80% | High |
| Utilities | >75% | Medium |
| Overall | >80% | High |

### Running Tests

```bash
# Run all employee tests
pytest apps/employees/tests/ -v

# Run specific test file
pytest apps/employees/tests/test_models.py -v

# Run with coverage
pytest apps/employees/tests/ --cov=apps.employees --cov-report=html

# Run specific test class
pytest apps/employees/tests/test_api.py::TestEmployeeAPI -v

# Run specific test method
pytest apps/employees/tests/test_api.py::TestEmployeeAPI::test_create_employee -v

# Run tests matching pattern
pytest apps/employees/tests/ -k "test_create" -v
```

### Expected Outcome
- Comprehensive test coverage
- All tests passing
- High code quality
- Confidence in code changes
- Documentation of expected behavior

### Verification Checklist
- [ ] tests directory created
- [ ] conftest.py with fixtures created
- [ ] test_models.py completed
- [ ] test_validators.py completed
- [ ] test_services.py completed
- [ ] test_api.py completed
- [ ] All model tests passing
- [ ] All validator tests passing
- [ ] All service tests passing
- [ ] All API tests passing
- [ ] Test coverage >80%
- [ ] No failing tests

---

## Task 92: Create Employee Module Documentation

### Overview
Create comprehensive documentation for the employee management module including module overview, API reference, usage guides, configuration options, and best practices. Documentation should be clear, well-organized, and helpful for developers and system administrators.

### Dependencies
- All employee module features completed
- API endpoints finalized
- Tests completed

### Instructions

1. **Create docs directory**
   - Navigate to `apps/employees/` directory
   - Create `docs/` directory
   - Create README.md as main documentation file

2. **Create README.md structure**
   - Create file at `apps/employees/docs/README.md`
   - Define documentation sections
   - Add table of contents

3. **Write Module Overview section**
   - Purpose of employee module
   - Key features list
   - Technology stack
   - Module dependencies

4. **Write Employee Lifecycle section**
   - Employee status flow diagram
   - Status transitions explained
   - Lifecycle stages documentation

5. **Write Getting Started section**
   - Prerequisites
   - Installation steps
   - Initial configuration
   - Quick start example

6. **Write Creating Employees section**
   - Manual creation via admin
   - API creation guide
   - Bulk import from CSV/Excel
   - Required vs optional fields
   - Validation rules

7. **Write Employee Data Management section**
   - Updating employee information
   - Managing addresses
   - Managing emergency contacts
   - Managing family members
   - Managing documents
   - Managing bank accounts

8. **Write User Account Linking section**
   - When to link user accounts
   - How to link accounts
   - Permissions and roles
   - User account management

9. **Write Document Management section**
   - Document types
   - Upload process
   - Document verification
   - Access control
   - Download procedures
   - Document retention

10. **Write Bank Account Setup section**
    - Adding bank accounts
    - Verification process
    - Primary account designation
    - Sri Lankan banking context
    - Account security

11. **Write API Reference section**
    - Base URL and authentication
    - List all endpoints
    - Request/response examples
    - Error responses
    - Filtering and searching
    - Pagination

12. **Write API Endpoint Details**
    - Document each endpoint
    - HTTP method, URL, parameters
    - Request body schema
    - Response schema
    - Error codes
    - Examples

13. **Write Custom Actions section**
    - Activate employee
    - Deactivate employee
    - Terminate employee
    - Record resignation
    - Link user account
    - Examples for each

14. **Write Filtering and Searching section**
    - Available filters
    - Filter combinations
    - Search capabilities
    - Ordering options
    - Examples

15. **Write Permissions and Access Control section**
    - Permission matrix
    - Role-based access
    - Tenant isolation
    - Data visibility rules

16. **Write Configuration section**
    - Environment variables
    - Settings.py configuration
    - Feature flags
    - Default values

17. **Write Validation Rules section**
    - NIC validation (Sri Lankan)
    - Phone number validation
    - Email validation
    - Age restrictions
    - Custom validations

18. **Write Sri Lankan Context section**
    - NIC formats (old/new)
    - Address format
    - Postal codes
    - Banking system
    - Phone number formats
    - Districts and provinces

19. **Write Import/Export section**
    - CSV import format
    - Excel import format
    - Data validation during import
    - Export options
    - Bulk operations

20. **Write Testing section**
    - Running tests
    - Test coverage
    - Writing new tests
    - Test fixtures

21. **Write Troubleshooting section**
    - Common issues
    - Error messages
    - Solutions
    - FAQ

22. **Write Best Practices section**
    - Data entry guidelines
    - Security recommendations
    - Performance tips
    - Maintenance tasks

23. **Write Examples section**
    - Complete workflow examples
    - Code snippets
    - curl command examples
    - Python API client examples

24. **Write Change Log section**
    - Version history
    - Feature additions
    - Bug fixes
    - Breaking changes

25. **Add diagrams**
    - Entity relationship diagram
    - Status flow diagram
    - Architecture diagram
    - Workflow diagrams

26. **Review and polish**
    - Check grammar and spelling
    - Ensure consistency
    - Verify code examples
    - Test all links

### Documentation Structure

```
apps/employees/docs/
├── README.md                    # Main documentation
├── API_REFERENCE.md            # Detailed API docs (optional)
├── CHANGELOG.md                # Version history (optional)
└── examples/                   # Code examples (optional)
    ├── create_employee.py
    ├── import_employees.py
    └── api_client_example.py
```

### README.md Table of Contents

```markdown
# Employee Management Module Documentation

## Table of Contents

1. [Overview](#overview)
2. [Employee Lifecycle](#employee-lifecycle)
3. [Getting Started](#getting-started)
4. [Creating Employees](#creating-employees)
5. [Employee Data Management](#employee-data-management)
6. [User Account Linking](#user-account-linking)
7. [Document Management](#document-management)
8. [Bank Account Setup](#bank-account-setup)
9. [API Reference](#api-reference)
10. [Custom Actions](#custom-actions)
11. [Filtering and Searching](#filtering-and-searching)
12. [Permissions and Access Control](#permissions-and-access-control)
13. [Configuration](#configuration)
14. [Validation Rules](#validation-rules)
15. [Sri Lankan Context](#sri-lankan-context)
16. [Import/Export](#import-export)
17. [Testing](#testing)
18. [Troubleshooting](#troubleshooting)
19. [Best Practices](#best-practices)
20. [Examples](#examples)
```

### Key Documentation Sections

#### Overview Section Template
```markdown
## Overview

### Purpose
The Employee Management module provides comprehensive functionality for managing employee data, including personal information, employment details, documents, bank accounts, and lifecycle management.

### Key Features
- Complete employee CRUD operations
- Multiple addresses per employee
- Emergency contact management
- Family member records
- Document upload and verification
- Bank account management with security
- User account linking
- Status-based lifecycle management
- Bulk import/export
- Comprehensive API
- Sri Lankan localization

### Technology Stack
- Django 4.2+
- Django REST Framework 3.14+
- PostgreSQL 14+
- Python 3.11+
- django-filter
- django-storages (for file handling)

### Module Dependencies
- Core: Tenant, User models
- Departments: Department, Designation models
- Authentication: Django auth system
```

#### Employee Lifecycle Section Template
```markdown
## Employee Lifecycle

### Status Flow

```
                    ┌─────────────┐
                    │  PROBATION  │
                    └──────┬──────┘
                           │
                  Confirm/Reject
                           │
          ┌────────────────┼────────────────┐
          │                                 │
    ┌─────▼─────┐                  ┌───────▼────────┐
    │   ACTIVE  │                  │   TERMINATED   │
    └─────┬─────┘                  └────────────────┘
          │
    Deactivate / Leave / Resign
          │
    ┌─────▼─────┐
    │ INACTIVE  │
    │ ON_LEAVE  │
    │ RESIGNED  │
    └───────────┘
```

### Status Definitions

**PROBATION**
- Initial status for new hires
- Subject to probation period
- Limited access rights
- Can transition to: ACTIVE, TERMINATED

**ACTIVE**
- Regular employed status
- Full access rights
- Can transition to: INACTIVE, ON_LEAVE, TERMINATED, RESIGNED

**INACTIVE**
- Temporarily inactive
- No access rights
- Can transition to: ACTIVE, TERMINATED

**ON_LEAVE**
- Extended leave status
- Temporary absence
- Returns to previous status

**TERMINATED**
- Employment ended by company
- Final status
- No transitions

**RESIGNED**
- Employment ended by employee
- Final status
- No transitions
```

#### API Reference Section Template
```markdown
## API Reference

### Base URL
```
https://api.example.com/api/v1/
```

### Authentication
All endpoints require authentication via:
- Token authentication (recommended)
- Session authentication (browsable API)

Include token in header:
```
Authorization: Token your-auth-token-here
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /employees/ | List all employees |
| POST | /employees/ | Create new employee |
| GET | /employees/{id}/ | Get employee detail |
| PUT | /employees/{id}/ | Update employee |
| PATCH | /employees/{id}/ | Partial update |
| DELETE | /employees/{id}/ | Delete employee (soft) |

### List Employees

**GET** `/api/v1/employees/`

Query Parameters:
- `status` - Filter by status (ACTIVE, INACTIVE, etc.)
- `department` - Filter by department ID
- `employment_type` - Filter by employment type
- `search` - Search by name, email, NIC
- `page` - Page number for pagination
- `page_size` - Results per page

Example Request:
```bash
curl -X GET "https://api.example.com/api/v1/employees/?status=ACTIVE" \
  -H "Authorization: Token your-auth-token"
```

Example Response:
```json
{
  "count": 150,
  "next": "https://api.example.com/api/v1/employees/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "employee_id": "EMP-0001",
      "full_name": "Nuwan Fernando",
      "email": "nuwan@example.com",
      "status": "ACTIVE",
      "department": {
        "name": "Sales & Marketing"
      },
      ...
    }
  ]
}
```

Error Responses:
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `500 Internal Server Error` - Server error
```

### Expected Outcome
- Complete module documentation
- Clear API reference
- Helpful usage guides
- Code examples
- Troubleshooting help
- Best practices documented

### Verification Checklist
- [ ] docs directory created
- [ ] README.md created
- [ ] Table of contents added
- [ ] Overview section written
- [ ] Employee lifecycle documented
- [ ] Getting started guide written
- [ ] Creating employees documented
- [ ] Data management documented
- [ ] User linking documented
- [ ] Document management documented
- [ ] Bank account setup documented
- [ ] API reference completed
- [ ] Custom actions documented
- [ ] Filtering/searching documented
- [ ] Permissions documented
- [ ] Configuration documented
- [ ] Validation rules documented
- [ ] Sri Lankan context explained
- [ ] Import/export documented
- [ ] Testing section added
- [ ] Troubleshooting section added
- [ ] Best practices added
- [ ] Examples provided
- [ ] Diagrams included
- [ ] Documentation reviewed

---

## Summary

This document completed the employee management module with API, testing, and documentation:

### Completed Components
- ✅ DocumentViewSet with secure file handling
- ✅ URL configuration for all endpoints
- ✅ Comprehensive test suite (>80% coverage)
- ✅ Complete module documentation

### Key Achievements
1. **Secure Document Handling** - Upload, download, verification with access control
2. **Complete API** - All endpoints registered and accessible
3. **High Test Coverage** - Models, validators, services, API all tested
4. **Excellent Documentation** - Clear guides for developers and admins

### Module Completion Status
```
Employee Management Module: 100% Complete
═══════════════════════════════════════════

✅ Models (Group A-B)
✅ Validators (Group B)
✅ Services (Group D-E)
✅ Serializers (Group F)
✅ ViewSets (Group F)
✅ Filtering (Group F)
✅ Custom Actions (Group F)
✅ Document Management (Group F)
✅ URL Configuration (Group F)
✅ Tests (Group F)
✅ Documentation (Group F)

Total Tasks Completed: 92/92
```

### Next Steps in Employee Management
- Deploy to staging environment
- Conduct user acceptance testing
- Train HR staff on system usage
- Import existing employee data
- Monitor API performance
- Collect user feedback
- Plan Phase 2 enhancements

---

**Document Status:** ✅ Complete  
**Total Tasks:** 4  
**Total Lines:** ~1360
