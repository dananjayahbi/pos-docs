# Tasks 89-94: Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 89, 90, 91, 92, 93, 94

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-88_API-Endpoints-Serializers.md](01_Tasks-81-88_API-Endpoints-Serializers.md)
- **→ Next SubPhase:** [SubPhase-10_Account-Reconciliation](../../SubPhase-10_Account-Reconciliation/)

---

## Document Overview

This document completes the journal entry module with additional workflow endpoints (void and approve), comprehensive testing coverage, and complete API documentation. The testing suite ensures data integrity and business rule compliance, while documentation provides clear guidance for API consumers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 89 | Add Void Entry Endpoint | Medium | 30 min |
| 90 | Add Approve Entry Endpoint | Medium | 30 min |
| 91 | Add Entry URL Routes | Low | 15 min |
| 92 | Write JournalEntry Model Tests | Medium | 45 min |
| 93 | Write Double-Entry Tests | High | 60 min |
| 94 | Create Journal Entry API Docs | Medium | 40 min |

---

## Task 89: Add Void Entry Endpoint

### Overview
Add the void custom action to JournalEntryViewSet that allows voiding a posted entry by creating a reversing entry. This action marks the original entry as VOID, creates an opposite entry to cancel out the financial impact, and returns both entries to the client.

### Dependencies
- Task 88: Add Post Entry Endpoint

### Instructions

1. **Open journal_entry.py view file**
   - Continue in `apps/accounting/views/journal_entry.py`
   - Locate JournalEntryViewSet class

2. **Import ReversingEntryService**
   - Import from apps.accounting.services
   - Used to create reversal entry

3. **Add void action method**
   - Use @action decorator
   - Set detail=True (operates on single entry)
   - Set methods=['post']
   - Set url_path='void'

4. **Define method signature**
   - Accept self, request, pk=None
   - Get entry instance with self.get_object()

5. **Validate entry can be voided**
   - Check status is POSTED
   - Verify entry not already voided
   - Check no existing reversal
   - Raise ValidationError if not valid

6. **Create reversing entry**
   - Initialize ReversingEntryService
   - Call create_reversal() with entry
   - Set reversal_date to today or provided date
   - Auto-post reversal

7. **Update original entry status**
   - Set status to VOID
   - Set voided_at timestamp
   - Set voided_by user
   - Save entry

8. **Return success response**
   - Serialize original entry
   - Serialize reversal entry
   - Return both in response
   - Include success message

9. **Add error handling**
   - Catch ValidationError
   - Return 400 Bad Request
   - Include error message

10. **Add docstring**
    - Document endpoint purpose
    - List request method (POST)
    - Describe response format
    - Note reversal creation

### Void Action Implementation

```python
from apps.accounting.services import ReversingEntryService


@action(detail=True, methods=['post'], url_path='void')
def void(self, request, pk=None):
    """
    Void a posted journal entry by creating a reversal.
    
    URL: POST /api/v1/accounting/entries/{id}/void/
    
    Creates a reversing entry dated today to cancel out the
    original entry. Updates original status to VOID.
    
    Request Body (optional):
        {
            "reversal_date": "2025-12-31",  # Defaults to today
            "reason": "Correction needed"
        }
    
    Returns:
        200: Entry voided, reversal created
        400: Entry cannot be voided
        404: Entry not found
    """
    entry = self.get_object()
    
    # Validate entry can be voided
    if entry.status != 'POSTED':
        return Response(
            {
                'error': f'Cannot void entry with status {entry.status}'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check for existing reversal
    existing_reversal = JournalEntry.objects.filter(
        reversal_of=entry
    ).first()
    
    if existing_reversal:
        return Response(
            {
                'error': 'Entry already has a reversal'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get optional parameters
    reversal_date = request.data.get('reversal_date', None)
    reason = request.data.get('reason', 'Entry voided')
    
    # Create reversing entry
    try:
        service = ReversingEntryService(
            tenant=entry.tenant,
            created_by=request.user
        )
        
        reversal = service.create_reversal(
            original_entry=entry,
            reversal_date=reversal_date,
            description_override=f"Reversal - {reason}",
            auto_post=True
        )
        
        # Update original entry
        entry.status = 'VOID'
        entry.voided_at = timezone.now()
        entry.voided_by = request.user
        entry.save()
        
    except ValidationError as e:
        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Return both entries
    original_serializer = self.get_serializer(entry)
    reversal_serializer = self.get_serializer(reversal)
    
    return Response(
        {
            'message': 'Entry voided successfully',
            'original_entry': original_serializer.data,
            'reversal_entry': reversal_serializer.data
        },
        status=status.HTTP_200_OK
    )
```

### Void Action Flow

```
POST /api/v1/accounting/entries/1234/void/
══════════════════════════════════════════

1. Retrieve Entry
   └─> Get entry with ID 1234

2. Validate Status
   ├─> Check status is POSTED
   └─> Return 400 if not

3. Check Existing Reversal
   ├─> Query for reversal_of = entry
   └─> Return 400 if exists

4. Create Reversing Entry
   ├─> Initialize ReversingEntryService
   ├─> Call create_reversal()
   ├─> Swap all debit/credit amounts
   ├─> Auto-post reversal
   └─> Link reversal_of to original

5. Update Original Entry
   ├─> Set status = VOID
   ├─> Set voided_at = now()
   ├─> Set voided_by = user
   └─> Save

6. Return Response
   └─> 200 OK with both entries
```

### Request Examples

**Basic Void (Today's Date):**
```
POST /api/v1/accounting/entries/1234/void/
Authorization: Bearer <token>
Content-Type: application/json
```

**Void with Custom Date:**
```
POST /api/v1/accounting/entries/1234/void/
Authorization: Bearer <token>
Content-Type: application/json

{
  "reversal_date": "2026-01-01",
  "reason": "Correction required"
}
```

### Success Response (200 OK)

```json
{
  "message": "Entry voided successfully",
  "original_entry": {
    "id": 1234,
    "entry_number": "JE-2025-1250",
    "status": "VOID",
    "voided_at": "2025-12-31T16:00:00Z",
    "voided_by": 1,
    "entry_date": "2025-12-31",
    "entry_type": "ADJUSTING",
    "total_debit": "150000.00",
    "total_credit": "150000.00",
    "lines": [
      {
        "account": 12,
        "account_name": "Salary Expense",
        "debit": "150000.00",
        "credit": "0.00"
      },
      {
        "account": 45,
        "account_name": "Salaries Payable",
        "debit": "0.00",
        "credit": "150000.00"
      }
    ]
  },
  "reversal_entry": {
    "id": 1235,
    "entry_number": "JE-2025-1251",
    "status": "POSTED",
    "entry_date": "2025-12-31",
    "entry_type": "REVERSING",
    "reversal_of": 1234,
    "description": "Reversal - Correction required",
    "total_debit": "150000.00",
    "total_credit": "150000.00",
    "lines": [
      {
        "account": 45,
        "account_name": "Salaries Payable",
        "debit": "150000.00",
        "credit": "0.00"
      },
      {
        "account": 12,
        "account_name": "Salary Expense",
        "debit": "0.00",
        "credit": "150000.00"
      }
    ]
  }
}
```

### Error Responses

**400 Bad Request - Wrong Status:**
```json
{
  "error": "Cannot void entry with status DRAFT"
}
```

**400 Bad Request - Already Reversed:**
```json
{
  "error": "Entry already has a reversal"
}
```

### Void Effect Example

```
Original Entry (Posted):
DR Salary Expense (5010)         150,000.00
    CR Salaries Payable (2110)              150,000.00

After Void:
Original Status: VOID (no longer affects ledger)

Reversal Entry (Auto-Created):
DR Salaries Payable (2110)       150,000.00
    CR Salary Expense (5010)                150,000.00

Net Effect: Both entries cancel out = Zero impact
```

### Expected Outcome
- Functional void endpoint
- Automatic reversal creation
- Original entry marked as VOID
- Clear audit trail
- Both entries returned

### Verification Checklist
- [ ] ReversingEntryService imported
- [ ] @action decorator added
- [ ] detail=True, methods=['post']
- [ ] url_path='void' set
- [ ] Status validation implemented
- [ ] Existing reversal check added
- [ ] ReversingEntryService initialized
- [ ] create_reversal() called
- [ ] Original entry updated
- [ ] Success response with both entries
- [ ] Error handling added
- [ ] Docstring complete

---

## Task 90: Add Approve Entry Endpoint

### Overview
Add the approve custom action to JournalEntryViewSet that allows approving a pending entry through the approval workflow. This action validates approval permissions, checks threshold requirements, updates the entry status to APPROVED, and prepares it for posting.

### Dependencies
- Task 89: Add Void Entry Endpoint

### Instructions

1. **Open journal_entry.py view file**
   - Continue in `apps/accounting/views/journal_entry.py`
   - Locate JournalEntryViewSet class

2. **Import approval service if exists**
   - Import ApprovalService or approval logic
   - May use entry's approve() method

3. **Add approve action method**
   - Use @action decorator
   - Set detail=True (operates on single entry)
   - Set methods=['post']
   - Set url_path='approve'

4. **Define method signature**
   - Accept self, request, pk=None
   - Get entry instance with self.get_object()

5. **Validate entry can be approved**
   - Check status is PENDING_APPROVAL
   - Verify entry is balanced
   - Check user has approval permission
   - Validate approval threshold if configured

6. **Check approval permissions**
   - Verify user has approve permission
   - May check user role (manager, supervisor)
   - May check approval authority limits

7. **Call entry.approve() method**
   - Pass approved_by=request.user
   - Update status to APPROVED
   - Set approved_at timestamp
   - Save entry

8. **Optional: Auto-post if configured**
   - Check tenant settings for auto-post
   - If enabled, call entry.post()
   - Streamlines workflow

9. **Return success response**
   - Serialize updated entry
   - Return with 200 OK status
   - Include approval details

10. **Add error handling**
    - Catch ValidationError
    - Catch PermissionError
    - Return appropriate status codes
    - Include error messages

11. **Add docstring**
    - Document endpoint purpose
    - List request method (POST)
    - Describe response format
    - Note permission requirements

### Approve Action Implementation

```python
from django.core.exceptions import PermissionDenied


@action(detail=True, methods=['post'], url_path='approve')
def approve(self, request, pk=None):
    """
    Approve a pending journal entry.
    
    URL: POST /api/v1/accounting/entries/{id}/approve/
    
    Updates entry status to APPROVED. Entry can then be posted.
    Requires approval permission and may check threshold limits.
    
    Request Body (optional):
        {
            "comments": "Approved - correct",
            "auto_post": false  # Auto-post after approval
        }
    
    Returns:
        200: Entry approved
        400: Entry cannot be approved (wrong status)
        403: User lacks approval permission
        404: Entry not found
    """
    entry = self.get_object()
    
    # Validate entry can be approved
    if entry.status != 'PENDING_APPROVAL':
        return Response(
            {
                'error': f'Cannot approve entry with status {entry.status}'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if entry.total_debit != entry.total_credit:
        return Response(
            {
                'error': 'Entry is not balanced'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check approval permission
    if not request.user.has_perm('accounting.approve_journalentry'):
        return Response(
            {
                'error': 'User does not have approval permission'
            },
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Optional: Check approval threshold
    # If user's authority limit < entry amount, deny
    # This logic depends on your approval workflow design
    
    # Get optional parameters
    comments = request.data.get('comments', '')
    auto_post = request.data.get('auto_post', False)
    
    # Approve the entry
    try:
        entry.approve(
            approved_by=request.user,
            comments=comments
        )
        
        # Optional: Auto-post if requested
        if auto_post:
            entry.post(posted_by=request.user)
        
    except ValidationError as e:
        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    except PermissionDenied as e:
        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Return updated entry
    serializer = self.get_serializer(entry)
    return Response(
        {
            'message': 'Entry approved successfully',
            'entry': serializer.data,
            'auto_posted': auto_post
        },
        status=status.HTTP_200_OK
    )
```

### Approve Action Flow

```
POST /api/v1/accounting/entries/1234/approve/
═════════════════════════════════════════════

1. Retrieve Entry
   └─> Get entry with ID 1234

2. Validate Status
   ├─> Check status is PENDING_APPROVAL
   └─> Return 400 if not

3. Validate Balance
   ├─> Check total_debit == total_credit
   └─> Return 400 if not balanced

4. Check Permission
   ├─> Verify user has approve permission
   └─> Return 403 if not authorized

5. Check Threshold (Optional)
   ├─> Compare entry amount to user limit
   └─> Return 403 if exceeds authority

6. Call entry.approve()
   ├─> Update status to APPROVED
   ├─> Set approved_at = now()
   ├─> Set approved_by = user
   └─> Save entry

7. Auto-Post (If Requested)
   └─> Call entry.post() if auto_post=true

8. Return Response
   └─> 200 OK with updated entry
```

### Request Examples

**Basic Approval:**
```
POST /api/v1/accounting/entries/1234/approve/
Authorization: Bearer <token>
Content-Type: application/json
```

**Approval with Comments:**
```
POST /api/v1/accounting/entries/1234/approve/
Authorization: Bearer <token>
Content-Type: application/json

{
  "comments": "Verified and approved",
  "auto_post": false
}
```

**Approve and Auto-Post:**
```
POST /api/v1/accounting/entries/1234/approve/
Authorization: Bearer <token>
Content-Type: application/json

{
  "comments": "Approved for immediate posting",
  "auto_post": true
}
```

### Success Response (200 OK)

```json
{
  "message": "Entry approved successfully",
  "auto_posted": false,
  "entry": {
    "id": 1234,
    "entry_number": "JE-2025-1250",
    "status": "APPROVED",
    "approved_by": 2,
    "approved_by_username": "manager",
    "approved_at": "2025-12-31T15:30:00Z",
    "entry_date": "2025-12-31",
    "entry_type": "MANUAL",
    "total_debit": "150000.00",
    "total_credit": "150000.00",
    "can_post": true,
    "can_void": false
  }
}
```

### Error Responses

**400 Bad Request - Wrong Status:**
```json
{
  "error": "Cannot approve entry with status DRAFT"
}
```

**403 Forbidden - No Permission:**
```json
{
  "error": "User does not have approval permission"
}
```

**403 Forbidden - Exceeds Limit:**
```json
{
  "error": "Entry amount exceeds your approval authority limit"
}
```

### Approval Workflow States

```
Entry Creation
      │
      ▼
   DRAFT ──────────┐
      │            │
      │ (small     │ (large
      │  amount)   │  amount)
      │            │
      ▼            ▼
   POSTED    PENDING_APPROVAL
                   │
                   │ approve()
                   ▼
               APPROVED
                   │
                   │ post()
                   ▼
               POSTED
```

### Approval Threshold Example

```
Approval Settings:
═════════════════
auto_approve_threshold: LKR 10,000.00
User approval limit: LKR 100,000.00

Entry Amount: LKR 150,000.00
Result: Requires higher authority approval

Entry Amount: LKR 75,000.00
Result: Manager can approve

Entry Amount: LKR 5,000.00
Result: Auto-approved (below threshold)
```

### Permission Checks

| Permission | Required | Purpose |
|-----------|----------|---------|
| accounting.approve_journalentry | Yes | Base approval right |
| accounting.approve_unlimited | Optional | No threshold limit |
| approval_authority_limit | Optional | Per-user amount limit |

### Expected Outcome
- Functional approve endpoint
- Permission validation
- Threshold checking (if configured)
- Status update to APPROVED
- Optional auto-posting
- Clear approval audit trail

### Verification Checklist
- [ ] @action decorator added
- [ ] detail=True, methods=['post']
- [ ] url_path='approve' set
- [ ] Status validation implemented
- [ ] Balance validation added
- [ ] Permission check implemented
- [ ] entry.approve() called
- [ ] Optional auto_post logic added
- [ ] Success response with updated entry
- [ ] Error handling for validation
- [ ] Error handling for permissions
- [ ] Docstring complete

---

## Task 91: Add Entry URL Routes

### Overview
Configure URL routing for the accounting app to expose the JournalEntryViewSet endpoints through the REST API. This task registers the ViewSet with a router and includes it in the app's URL configuration.

### Dependencies
- Task 90: Add Approve Entry Endpoint

### Instructions

1. **Create or update urls.py in accounting app**
   - Navigate to `apps/accounting/`
   - Create `urls.py` if doesn't exist

2. **Import required modules**
   - Import path, include from django.urls
   - Import DefaultRouter from rest_framework.routers
   - Import JournalEntryViewSet

3. **Create router instance**
   - Initialize DefaultRouter()
   - Router handles ViewSet registration

4. **Register JournalEntryViewSet**
   - Use router.register()
   - Set prefix to 'entries'
   - Set basename to 'journalentry'

5. **Define app_name**
   - Set app_name = 'accounting'
   - Used for namespacing URLs

6. **Define urlpatterns**
   - Include router.urls
   - Add any additional URL patterns

7. **Update project urls.py**
   - Navigate to project's main urls.py
   - Include accounting app URLs
   - Set API version prefix (v1)

8. **Test URL routing**
   - Use Django's show_urls command if available
   - Verify all endpoints accessible

### URL Configuration Implementation

**apps/accounting/urls.py:**
```python
"""
URL configuration for accounting app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.accounting.views import JournalEntryViewSet

# Create router
router = DefaultRouter()

# Register ViewSets
router.register(r'entries', JournalEntryViewSet, basename='journalentry')

# App namespace
app_name = 'accounting'

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]
```

**Project main urls.py (example):**
```python
"""
Main URL configuration.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/accounting/', include('apps.accounting.urls')),
    
    # Other app URLs...
]
```

### Generated URL Routes

```
API Endpoints for JournalEntry:
════════════════════════════════

Standard CRUD:
├─ GET    /api/v1/accounting/entries/
├─ POST   /api/v1/accounting/entries/
├─ GET    /api/v1/accounting/entries/{id}/
├─ PUT    /api/v1/accounting/entries/{id}/
├─ PATCH  /api/v1/accounting/entries/{id}/
└─ DELETE /api/v1/accounting/entries/{id}/

Custom Actions:
├─ POST   /api/v1/accounting/entries/{id}/post/
├─ POST   /api/v1/accounting/entries/{id}/void/
└─ POST   /api/v1/accounting/entries/{id}/approve/
```

### URL Structure Breakdown

```
Base URL: /api/v1/accounting/
          └─> API version 1
              └─> accounting app

entries/
└─> JournalEntry resource

entries/{id}/
└─> Specific entry by ID

entries/{id}/post/
entries/{id}/void/
entries/{id}/approve/
└─> Custom workflow actions
```

### Router Benefits

| Feature | Benefit |
|---------|---------|
| Auto URL generation | No manual URL patterns needed |
| Consistent naming | Standard REST conventions |
| Browsable API | DRF's web interface works |
| Reverse URL lookup | Use reverse('accounting:journalentry-list') |

### URL Reverse Examples

```python
from django.urls import reverse

# List entries
list_url = reverse('accounting:journalentry-list')
# Result: '/api/v1/accounting/entries/'

# Entry detail
detail_url = reverse('accounting:journalentry-detail', args=[1234])
# Result: '/api/v1/accounting/entries/1234/'

# Custom action
post_url = reverse('accounting:journalentry-post', args=[1234])
# Result: '/api/v1/accounting/entries/1234/post/'
```

### Verifying Routes

**Using Django Extensions:**
```bash
python manage.py show_urls | grep entries

# Output:
# /api/v1/accounting/entries/                      accounting:journalentry-list
# /api/v1/accounting/entries/{pk}/                 accounting:journalentry-detail
# /api/v1/accounting/entries/{pk}/post/            accounting:journalentry-post
# /api/v1/accounting/entries/{pk}/void/            accounting:journalentry-void
# /api/v1/accounting/entries/{pk}/approve/         accounting:journalentry-approve
```

**Manual Testing:**
```bash
# Test list endpoint
curl http://localhost:8000/api/v1/accounting/entries/

# Test browsable API
# Navigate to: http://localhost:8000/api/v1/accounting/entries/
```

### Expected Outcome
- Working URL configuration
- All ViewSet endpoints accessible
- Custom actions routed correctly
- RESTful URL structure
- Browsable API functional

### Verification Checklist
- [ ] urls.py created in accounting app
- [ ] Required modules imported
- [ ] DefaultRouter instantiated
- [ ] JournalEntryViewSet registered
- [ ] app_name defined
- [ ] urlpatterns configured
- [ ] Project urls.py updated
- [ ] URLs tested and accessible

---

## Task 92: Write JournalEntry Model Tests

### Overview
Write comprehensive unit tests for the JournalEntry model covering creation, validation, status transitions, and method operations. These tests ensure model integrity and business rule compliance using pytest framework.

### Dependencies
- Task 91: Add Entry URL Routes
- pytest and pytest-django installed

### Instructions

1. **Create tests directory structure**
   - Navigate to `apps/accounting/`
   - Create `tests/` subdirectory if not exists
   - Create `__init__.py` in tests/

2. **Create test_journal_entry.py file**
   - Create file at `apps/accounting/tests/test_journal_entry.py`
   - Import pytest and necessary modules

3. **Import required modules**
   - Import pytest
   - Import Django test utilities
   - Import JournalEntry, JournalEntryLine models
   - Import factories if using factory_boy

4. **Create fixtures**
   - @pytest.fixture for tenant
   - @pytest.fixture for user
   - @pytest.fixture for accounts
   - @pytest.fixture for sample entry

5. **Write test_create_journal_entry**
   - Test entry creation with valid data
   - Verify fields saved correctly
   - Check auto-generated entry_number

6. **Write test_entry_number_generation**
   - Test unique entry number generation
   - Verify sequential numbering
   - Check year/sequence format

7. **Write test_calculate_totals**
   - Create entry with lines
   - Verify total_debit calculated
   - Verify total_credit calculated
   - Check balance

8. **Write test_post_entry**
   - Create draft entry
   - Call post() method
   - Verify status changed to POSTED
   - Check posted_at and posted_by set

9. **Write test_cannot_post_unbalanced**
   - Create unbalanced entry
   - Attempt to post
   - Verify ValidationError raised

10. **Write test_void_entry**
    - Create and post entry
    - Call void() method
    - Verify status changed to VOID
    - Check reversal created

11. **Write test_approve_entry**
    - Create entry requesting approval
    - Call approve() method
    - Verify status changed to APPROVED

12. **Write test_status_transitions**
    - Test valid transitions (DRAFT->POSTED)
    - Test invalid transitions
    - Verify constraints enforced

13. **Write test_entry_str_method**
    - Test __str__ representation
    - Verify format matches expected

14. **Run tests**
    - Execute pytest
    - Verify all tests pass
    - Check coverage

### Test File Structure

```python
"""
Unit tests for JournalEntry model.
"""
import pytest
from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError

from apps.accounting.models import JournalEntry, JournalEntryLine
from apps.core.models import Tenant, User
from apps.accounting.models import ChartOfAccounts


@pytest.fixture
def tenant(db):
    """Create test tenant."""
    return Tenant.objects.create(
        name='Test Company',
        domain='test.example.com'
    )


@pytest.fixture
def user(db, tenant):
    """Create test user."""
    return User.objects.create(
        username='testuser',
        email='test@example.com',
        tenant=tenant
    )


@pytest.fixture
def accounts(db, tenant):
    """Create test accounts."""
    expense_account = ChartOfAccounts.objects.create(
        tenant=tenant,
        code='5010',
        name='Salary Expense',
        account_type='EXPENSE',
        is_active=True
    )
    
    liability_account = ChartOfAccounts.objects.create(
        tenant=tenant,
        code='2110',
        name='Salaries Payable',
        account_type='LIABILITY',
        is_active=True
    )
    
    return {
        'expense': expense_account,
        'liability': liability_account
    }


@pytest.mark.django_db
class TestJournalEntry:
    """Test cases for JournalEntry model."""
    
    def test_create_journal_entry(self, tenant, user):
        """Test creating a journal entry."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        assert entry.id is not None
        assert entry.entry_number is not None
        assert entry.status == 'DRAFT'
        assert entry.tenant == tenant
        assert entry.created_by == user
    
    
    def test_entry_number_generation(self, tenant, user):
        """Test automatic entry number generation."""
        entry1 = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Entry 1',
            created_by=user
        )
        
        entry2 = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Entry 2',
            created_by=user
        )
        
        # Check format: JE-YYYY-####
        assert entry1.entry_number.startswith('JE-2025-')
        assert entry2.entry_number.startswith('JE-2025-')
        
        # Check sequential
        num1 = int(entry1.entry_number.split('-')[-1])
        num2 = int(entry2.entry_number.split('-')[-1])
        assert num2 == num1 + 1
    
    
    def test_calculate_totals(self, tenant, user, accounts):
        """Test automatic total calculation."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # Add lines
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            description='Salary',
            debit=Decimal('150000.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            description='Salary',
            debit=Decimal('0.00'),
            credit=Decimal('150000.00')
        )
        
        # Recalculate totals
        entry.calculate_totals()
        
        assert entry.total_debit == Decimal('150000.00')
        assert entry.total_credit == Decimal('150000.00')
    
    
    def test_post_entry(self, tenant, user, accounts):
        """Test posting a draft entry."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # Add balanced lines
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('100.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('100.00')
        )
        
        entry.calculate_totals()
        
        # Post entry
        entry.post(posted_by=user)
        
        assert entry.status == 'POSTED'
        assert entry.posted_at is not None
        assert entry.posted_by == user
    
    
    def test_cannot_post_unbalanced(self, tenant, user, accounts):
        """Test that unbalanced entries cannot be posted."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Unbalanced entry',
            created_by=user
        )
        
        # Add unbalanced lines
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('150.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('100.00')
        )
        
        entry.calculate_totals()
        
        # Attempt to post
        with pytest.raises(ValidationError):
            entry.post(posted_by=user)
    
    
    def test_void_entry(self, tenant, user, accounts):
        """Test voiding a posted entry."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # Add lines and post
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('100.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('100.00')
        )
        
        entry.calculate_totals()
        entry.post(posted_by=user)
        
        # Void entry
        entry.void(voided_by=user)
        
        assert entry.status == 'VOID'
        assert entry.voided_at is not None
        assert entry.voided_by == user
    
    
    def test_entry_str_method(self, tenant, user):
        """Test string representation."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        expected = f"{entry.entry_number} - {entry.entry_date}"
        assert str(entry) == expected
```

### Test Coverage Areas

| Test | Coverage | Purpose |
|------|----------|---------|
| test_create_journal_entry | Creation | Basic model instantiation |
| test_entry_number_generation | Auto-numbering | Unique identifier generation |
| test_calculate_totals | Calculation | Debit/credit totals |
| test_post_entry | Workflow | Status transition to POSTED |
| test_cannot_post_unbalanced | Validation | Balance enforcement |
| test_void_entry | Workflow | Voiding posted entries |
| test_entry_str_method | Representation | String formatting |

### Running Tests

```bash
# Run all tests
pytest apps/accounting/tests/

# Run specific test file
pytest apps/accounting/tests/test_journal_entry.py

# Run with coverage
pytest --cov=apps.accounting apps/accounting/tests/

# Run specific test
pytest apps/accounting/tests/test_journal_entry.py::TestJournalEntry::test_post_entry

# Run with verbose output
pytest -v apps/accounting/tests/
```

### Expected Outcome
- Comprehensive model test coverage
- All tests passing
- Validation rules verified
- Workflow methods tested
- Foundation for integration tests

### Verification Checklist
- [ ] tests/ directory created
- [ ] test_journal_entry.py file created
- [ ] Required modules imported
- [ ] Fixtures defined (tenant, user, accounts)
- [ ] test_create_journal_entry written
- [ ] test_entry_number_generation written
- [ ] test_calculate_totals written
- [ ] test_post_entry written
- [ ] test_cannot_post_unbalanced written
- [ ] test_void_entry written
- [ ] test_entry_str_method written
- [ ] All tests pass

---

## Task 93: Write Double-Entry Tests

### Overview
Write comprehensive validation tests for double-entry bookkeeping rules including balance validation, minimum line requirements, zero amount prevention, and accounting period constraints. These tests ensure the integrity of the accounting system's core principles.

### Dependencies
- Task 92: Write JournalEntry Model Tests

### Instructions

1. **Create test_double_entry.py file**
   - Create file at `apps/accounting/tests/test_double_entry.py`
   - Import pytest and necessary modules

2. **Import required modules**
   - Import pytest
   - Import Decimal for precise amounts
   - Import JournalEntry, JournalEntryLine
   - Import ValidationError

3. **Reuse fixtures from previous test**
   - Import or recreate tenant, user, accounts fixtures

4. **Write test_balanced_entry_validates**
   - Create balanced entry (DR = CR)
   - Call validate method
   - Verify passes without error

5. **Write test_unbalanced_entry_fails**
   - Create unbalanced entry (DR ≠ CR)
   - Call validate method
   - Verify ValidationError raised
   - Check error message mentions imbalance

6. **Write test_minimum_two_lines**
   - Create entry with 0 lines
   - Verify validation fails
   - Create entry with 1 line
   - Verify validation fails
   - Create entry with 2 lines
   - Verify validation passes

7. **Write test_no_zero_amounts**
   - Create line with debit=0, credit=0
   - Verify validation fails
   - Check error message

8. **Write test_no_negative_amounts**
   - Create line with negative debit
   - Verify validation fails
   - Create line with negative credit
   - Verify validation fails

9. **Write test_debit_credit_mutual_exclusivity**
   - Create line with both debit and credit > 0
   - Verify validation fails
   - Create line with only debit
   - Verify passes
   - Create line with only credit
   - Verify passes

10. **Write test_inactive_account_rejection**
    - Create entry with inactive account
    - Verify validation fails

11. **Write test_closed_period_rejection**
    - Create entry dated in closed period
    - Verify validation fails

12. **Write test_complex_balanced_entry**
    - Create entry with multiple lines (4+)
    - Verify balance check works
    - Test various debit/credit combinations

13. **Write test_precision_handling**
    - Test decimal precision edge cases
    - Verify rounding doesn't cause imbalance
    - Test very small amounts

14. **Run all double-entry tests**
    - Execute pytest
    - Verify all pass
    - Check coverage

### Double-Entry Test Implementation

```python
"""
Tests for double-entry bookkeeping validation rules.
"""
import pytest
from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError

from apps.accounting.models import JournalEntry, JournalEntryLine


@pytest.mark.django_db
class TestDoubleEntryRules:
    """Test double-entry bookkeeping validation."""
    
    def test_balanced_entry_validates(self, tenant, user, accounts):
        """Test that balanced entries pass validation."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Balanced entry',
            created_by=user
        )
        
        # Add balanced lines
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('1000.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('1000.00')
        )
        
        entry.calculate_totals()
        
        # Should not raise
        entry.validate_balance()
    
    
    def test_unbalanced_entry_fails(self, tenant, user, accounts):
        """Test that unbalanced entries fail validation."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Unbalanced entry',
            created_by=user
        )
        
        # Add unbalanced lines
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('1500.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('1000.00')
        )
        
        entry.calculate_totals()
        
        with pytest.raises(ValidationError) as exc_info:
            entry.validate_balance()
        
        assert 'not balanced' in str(exc_info.value).lower()
    
    
    def test_minimum_two_lines(self, tenant, user, accounts):
        """Test that entries must have at least 2 lines."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # No lines
        with pytest.raises(ValidationError) as exc_info:
            entry.validate_lines()
        assert 'at least 2 lines' in str(exc_info.value).lower()
        
        # One line
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('100.00'),
            credit=Decimal('0.00')
        )
        
        with pytest.raises(ValidationError) as exc_info:
            entry.validate_lines()
        assert 'at least 2 lines' in str(exc_info.value).lower()
        
        # Two lines - should pass
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('100.00')
        )
        
        entry.validate_lines()  # Should not raise
    
    
    def test_no_zero_amounts(self, tenant, user, accounts):
        """Test that lines cannot have zero for both debit and credit."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # Create line with both zero
        line = JournalEntryLine(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('0.00'),
            credit=Decimal('0.00')
        )
        
        with pytest.raises(ValidationError) as exc_info:
            line.full_clean()
        
        assert 'must have either debit or credit' in str(exc_info.value).lower()
    
    
    def test_no_negative_amounts(self, tenant, user, accounts):
        """Test that negative amounts are rejected."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # Negative debit
        line1 = JournalEntryLine(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('-100.00'),
            credit=Decimal('0.00')
        )
        
        with pytest.raises(ValidationError):
            line1.full_clean()
        
        # Negative credit
        line2 = JournalEntryLine(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('-100.00')
        )
        
        with pytest.raises(ValidationError):
            line2.full_clean()
    
    
    def test_debit_credit_mutual_exclusivity(self, tenant, user, accounts):
        """Test that a line cannot have both debit and credit."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Test entry',
            created_by=user
        )
        
        # Both debit and credit
        line = JournalEntryLine(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('100.00'),
            credit=Decimal('100.00')
        )
        
        with pytest.raises(ValidationError) as exc_info:
            line.clean()
        
        assert 'cannot have both' in str(exc_info.value).lower()
    
    
    def test_complex_balanced_entry(self, tenant, user, accounts):
        """Test complex entry with multiple lines."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Complex entry',
            created_by=user
        )
        
        # Create 4-line entry
        # DR: Expense 1000, Expense 500
        # CR: Liability 1200, Liability 300
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('1000.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('500.00'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('1200.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('300.00')
        )
        
        entry.calculate_totals()
        
        assert entry.total_debit == Decimal('1500.00')
        assert entry.total_credit == Decimal('1500.00')
        entry.validate_balance()  # Should not raise
    
    
    def test_precision_handling(self, tenant, user, accounts):
        """Test decimal precision doesn't cause false imbalance."""
        entry = JournalEntry.objects.create(
            tenant=tenant,
            entry_date=timezone.now().date(),
            entry_type='MANUAL',
            description='Precision test',
            created_by=user
        )
        
        # Use amounts with many decimal places
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['expense'],
            debit=Decimal('123.456789'),
            credit=Decimal('0.00')
        )
        
        JournalEntryLine.objects.create(
            entry=entry,
            account=accounts['liability'],
            debit=Decimal('0.00'),
            credit=Decimal('123.456789')
        )
        
        entry.calculate_totals()
        entry.validate_balance()  # Should not raise
```

### Double-Entry Rules Tested

| Rule | Test | Expected Outcome |
|------|------|------------------|
| Balance | Debit = Credit | Entry valid |
| Imbalance | Debit ≠ Credit | ValidationError |
| Minimum lines | < 2 lines | ValidationError |
| Zero amounts | DR=0, CR=0 | ValidationError |
| Negative amounts | DR<0 or CR<0 | ValidationError |
| Mutual exclusivity | DR>0 and CR>0 | ValidationError |
| Complex balance | Multi-line | Balanced correctly |
| Precision | Many decimals | No false imbalance |

### Expected Outcome
- Comprehensive double-entry validation
- All accounting rules enforced
- Edge cases covered
- High test coverage
- Confidence in system integrity

### Verification Checklist
- [ ] test_double_entry.py file created
- [ ] Required modules imported
- [ ] test_balanced_entry_validates written
- [ ] test_unbalanced_entry_fails written
- [ ] test_minimum_two_lines written
- [ ] test_no_zero_amounts written
- [ ] test_no_negative_amounts written
- [ ] test_debit_credit_mutual_exclusivity written
- [ ] test_complex_balanced_entry written
- [ ] test_precision_handling written
- [ ] All tests pass

---

## Task 94: Create Journal Entry API Docs

### Overview
Create comprehensive API documentation for journal entry endpoints including request/response formats, authentication requirements, error codes, and usage examples. This documentation serves as the definitive reference for API consumers.

### Dependencies
- Task 93: Write Double-Entry Tests

### Instructions

1. **Create docs directory**
   - Navigate to `apps/accounting/`
   - Create `docs/` subdirectory
   - Create `api/` subdirectory within docs

2. **Create journal_entry_api.md file**
   - Create file at `apps/accounting/docs/api/journal_entry_api.md`
   - Structure with clear sections

3. **Add document header**
   - Title: Journal Entry API Documentation
   - Version information
   - Last updated date

4. **Document authentication**
   - Authentication method (Bearer token)
   - Required permissions
   - Example authorization header

5. **Document base URL**
   - API base path
   - Versioning strategy

6. **Document list endpoint**
   - Method: GET
   - Path: /entries/
   - Query parameters (filters)
   - Response format
   - Example request/response

7. **Document create endpoint**
   - Method: POST
   - Path: /entries/
   - Request body format
   - Required fields
   - Response format
   - Example request/response

8. **Document retrieve endpoint**
   - Method: GET
   - Path: /entries/{id}/
   - Path parameters
   - Response format
   - Example response

9. **Document update endpoint**
   - Method: PUT/PATCH
   - Path: /entries/{id}/
   - Request body format
   - Response format
   - Example request/response

10. **Document delete endpoint**
    - Method: DELETE
    - Path: /entries/{id}/
    - Response format
    - Restrictions (DRAFT only)

11. **Document post action**
    - Method: POST
    - Path: /entries/{id}/post/
    - Request/response format
    - Business rules

12. **Document void action**
    - Method: POST
    - Path: /entries/{id}/void/
    - Request/response format
    - Reversal creation

13. **Document approve action**
    - Method: POST
    - Path: /entries/{id}/approve/
    - Request/response format
    - Permission requirements

14. **Document error responses**
    - HTTP status codes
    - Error format
    - Common error scenarios

15. **Add usage examples**
    - cURL examples
    - JavaScript/Python examples
    - Common workflows

### API Documentation Template

```markdown
# Journal Entry API Documentation

> **Version:** 1.0  
> **Last Updated:** December 31, 2025  
> **Base URL:** `/api/v1/accounting`

---

## Authentication

All API requests require authentication using Bearer tokens.

### Authorization Header
```
Authorization: Bearer <your_access_token>
```

### Required Permissions
- `accounting.view_journalentry` - View entries
- `accounting.add_journalentry` - Create entries
- `accounting.change_journalentry` - Update entries
- `accounting.delete_journalentry` - Delete entries
- `accounting.post_journalentry` - Post entries
- `accounting.void_journalentry` - Void entries
- `accounting.approve_journalentry` - Approve entries

---

## Endpoints

### List Journal Entries

**Endpoint:** `GET /entries/`

**Description:** Retrieve a paginated list of journal entries.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| page_size | integer | No | Items per page (default: 20) |
| status | string | No | Filter by status (DRAFT, POSTED, etc.) |
| entry_type | string | No | Filter by type (MANUAL, ADJUSTING, etc.) |
| source | string | No | Filter by source |
| search | string | No | Search in entry number, description |
| ordering | string | No | Sort field (entry_date, -entry_number) |

**Example Request:**
```bash
GET /api/v1/accounting/entries/?status=POSTED&ordering=-entry_date
Authorization: Bearer <token>
```

**Success Response:** `200 OK`
```json
{
  "count": 245,
  "next": "http://api.example.com/entries/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1234,
      "entry_number": "JE-2025-1250",
      "entry_date": "2025-12-31",
      "entry_type": "ADJUSTING",
      "status": "POSTED",
      "source": "adjusting_entries",
      "reference": null,
      "description": "December salary accrual",
      "total_debit": "150000.00",
      "total_credit": "150000.00",
      "lines": [
        {
          "id": 5678,
          "account": 12,
          "account_code": "5010",
          "account_name": "Salary Expense",
          "description": "December salary",
          "debit": "150000.00",
          "credit": "0.00"
        },
        {
          "id": 5679,
          "account": 45,
          "account_code": "2110",
          "account_name": "Salaries Payable",
          "description": "December salary",
          "debit": "0.00",
          "credit": "150000.00"
        }
      ],
      "created_by": 1,
      "created_by_username": "admin",
      "created_at": "2025-12-31T14:30:00Z",
      "posted_by": 1,
      "posted_by_username": "admin",
      "posted_at": "2025-12-31T15:00:00Z",
      "is_balanced": true,
      "can_post": false,
      "can_void": true
    }
  ]
}
```

---

### Create Journal Entry

**Endpoint:** `POST /entries/`

**Description:** Create a new journal entry with line items.

**Request Body:**
```json
{
  "entry_date": "2025-12-31",
  "entry_type": "MANUAL",
  "source": "manual_entry",
  "reference": "REF-2025-001",
  "description": "Manual adjustment entry",
  "lines": [
    {
      "account": 12,
      "description": "Adjustment",
      "debit": "5000.00",
      "credit": "0.00"
    },
    {
      "account": 45,
      "description": "Adjustment",
      "debit": "0.00",
      "credit": "5000.00"
    }
  ]
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1235,
  "entry_number": "JE-2025-1251",
  "status": "DRAFT",
  "entry_date": "2025-12-31",
  "entry_type": "MANUAL",
  "source": "manual_entry",
  "reference": "REF-2025-001",
  "description": "Manual adjustment entry",
  "total_debit": "5000.00",
  "total_credit": "5000.00",
  "lines": [...],
  "created_by": 1,
  "created_by_username": "admin",
  "created_at": "2025-12-31T16:00:00Z",
  "is_balanced": true,
  "can_post": true
}
```

**Error Response:** `400 Bad Request`
```json
{
  "lines": [
    "Entry must be balanced. Debit: 5000.00, Credit: 4000.00"
  ]
}
```

---

### Post Entry

**Endpoint:** `POST /entries/{id}/post/`

**Description:** Post a draft or approved entry.

**Example Request:**
```bash
POST /api/v1/accounting/entries/1235/post/
Authorization: Bearer <token>
```

**Success Response:** `200 OK`
```json
{
  "message": "Entry posted successfully",
  "entry": {
    "id": 1235,
    "status": "POSTED",
    "posted_by": 1,
    "posted_at": "2025-12-31T16:05:00Z",
    ...
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Cannot post entry with status POSTED"
}
```

---

### Void Entry

**Endpoint:** `POST /entries/{id}/void/`

**Description:** Void a posted entry by creating a reversal.

**Request Body (Optional):**
```json
{
  "reversal_date": "2025-12-31",
  "reason": "Correction needed"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Entry voided successfully",
  "original_entry": {
    "id": 1235,
    "status": "VOID",
    "voided_at": "2025-12-31T16:10:00Z",
    ...
  },
  "reversal_entry": {
    "id": 1236,
    "status": "POSTED",
    "entry_type": "REVERSING",
    "reversal_of": 1235,
    ...
  }
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 OK | Request successful |
| 201 Created | Resource created |
| 400 Bad Request | Invalid request data |
| 401 Unauthorized | Missing/invalid authentication |
| 403 Forbidden | Insufficient permissions |
| 404 Not Found | Resource not found |
| 500 Internal Server Error | Server error |

---

## Usage Examples

### cURL

**Create Entry:**
```bash
curl -X POST https://api.example.com/api/v1/accounting/entries/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_date": "2025-12-31",
    "entry_type": "MANUAL",
    "description": "Test entry",
    "lines": [
      {"account": 12, "debit": "100.00", "credit": "0.00"},
      {"account": 45, "debit": "0.00", "credit": "100.00"}
    ]
  }'
```

### Python (requests)

```python
import requests

url = "https://api.example.com/api/v1/accounting/entries/"
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}
data = {
    "entry_date": "2025-12-31",
    "entry_type": "MANUAL",
    "description": "Test entry",
    "lines": [
        {"account": 12, "debit": "100.00", "credit": "0.00"},
        {"account": 45, "debit": "0.00", "credit": "100.00"}
    ]
}

response = requests.post(url, headers=headers, json=data)
entry = response.json()
print(f"Created entry: {entry['entry_number']}")
```

### JavaScript (fetch)

```javascript
const createEntry = async () => {
  const response = await fetch(
    'https://api.example.com/api/v1/accounting/entries/',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer <token>',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entry_date: '2025-12-31',
        entry_type: 'MANUAL',
        description: 'Test entry',
        lines: [
          {account: 12, debit: '100.00', credit: '0.00'},
          {account: 45, debit: '0.00', credit: '100.00'}
        ]
      })
    }
  );
  
  const entry = await response.json();
  console.log(`Created entry: ${entry.entry_number}`);
};
```

---

## Common Workflows

### Workflow 1: Create and Post Entry

1. Create draft entry: `POST /entries/`
2. Review entry: `GET /entries/{id}/`
3. Post entry: `POST /entries/{id}/post/`

### Workflow 2: Void Incorrect Entry

1. Identify entry: `GET /entries/{id}/`
2. Void entry: `POST /entries/{id}/void/`
3. Create corrected entry: `POST /entries/`

### Workflow 3: Approval Workflow

1. Create entry: `POST /entries/`
2. Request approval: (auto if above threshold)
3. Approve entry: `POST /entries/{id}/approve/`
4. Post entry: `POST /entries/{id}/post/`

---

**Documentation End**
```

### Expected Outcome
- Comprehensive API documentation
- Clear request/response formats
- Usage examples in multiple languages
- Error handling guidance
- Common workflow patterns
- Ready for API consumers

### Verification Checklist
- [ ] docs/api/ directory created
- [ ] journal_entry_api.md file created
- [ ] Authentication documented
- [ ] All endpoints documented
- [ ] Request formats specified
- [ ] Response formats specified
- [ ] Error codes listed
- [ ] cURL examples included
- [ ] Python examples included
- [ ] JavaScript examples included
- [ ] Common workflows described
- [ ] Documentation complete and accurate

---

## Summary

This document completed the journal entry module with workflow actions, comprehensive testing, and API documentation:

### Completed Components
- ✅ Void entry endpoint with reversal creation
- ✅ Approve entry endpoint with permission checks
- ✅ URL routing configuration
- ✅ JournalEntry model unit tests
- ✅ Double-entry bookkeeping validation tests
- ✅ Complete API documentation

### Key Achievements
1. **Workflow Actions** - Full entry lifecycle via API
2. **URL Configuration** - RESTful routing with DRF router
3. **Model Tests** - Comprehensive model validation
4. **Double-Entry Tests** - Accounting rule enforcement
5. **API Documentation** - Clear consumer guidance

### Testing Summary

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| Model Tests | 7+ tests | Creation, workflow, validation |
| Double-Entry Tests | 8+ tests | Balance, rules, edge cases |
| Total | 15+ tests | Comprehensive coverage |

### API Endpoints Complete

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | /entries/ | ✅ |
| POST | /entries/ | ✅ |
| GET | /entries/{id}/ | ✅ |
| PUT | /entries/{id}/ | ✅ |
| DELETE | /entries/{id}/ | ✅ |
| POST | /entries/{id}/post/ | ✅ |
| POST | /entries/{id}/void/ | ✅ |
| POST | /entries/{id}/approve/ | ✅ |

### Next Steps
Proceed to [SubPhase-10_Account-Reconciliation](../../SubPhase-10_Account-Reconciliation/) to implement bank reconciliation features, or continue enhancing the journal entry module with additional features such as recurring entries, entry templates, or advanced reporting.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~955
