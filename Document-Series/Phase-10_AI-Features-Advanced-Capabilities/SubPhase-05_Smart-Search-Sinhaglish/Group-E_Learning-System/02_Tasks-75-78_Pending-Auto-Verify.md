# Tasks 75-78: Pending Words, Auto-Approval, and Verification

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** E - Learning System  
> **Document:** 02 of 02  
> **Tasks Covered:** 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-74_Log-Learner.md](01_Tasks-67-74_Log-Learner.md)

---

## Document Overview

This document covers the final components of the learning system: the PendingWord model for storing word suggestions, the admin review interface for human oversight, the auto-approval system for high-confidence terms, and comprehensive verification of the entire learning pipeline. These components complete the closed-loop learning system that continuously improves the Sinhaglish search dictionary.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Create PendingWord Model | Medium | 40 min |
| 76 | Create Admin Review UI | Medium | 50 min |
| 77 | Create Auto-Add Popular Terms | Medium | 45 min |
| 78 | Verify Learning System | Low | 30 min |

---

## Task 75: Create PendingWord Model

### Overview
Create the PendingWord Django model to store word suggestions awaiting approval before being added to the Sinhaglish transliteration dictionary. This model acts as a review queue where suggested words from the learning system are held for administrator review and decision. It tracks the suggestion source, frequency, confidence, and approval status.

### Dependencies
- Task 74: Create suggest_words Method
- Django models framework
- Learning system functional

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/search/sinhaglish/models/` directory
   - Create new file named `pending_word.py`
   - Import required Django model utilities

2. **Import required dependencies**
   - Import Django models and field types
   - Import timezone utilities
   - Import JSONField for structured data
   - Import any base model mixins

3. **Define PendingWord model class**
   - Create class inheriting from `models.Model`
   - Add comprehensive docstring
   - Define model meta options

4. **Add primary key field**
   - Use UUID or auto-incrementing ID
   - Set as primary key
   - Add db_index for performance

5. **Add romanized word field**
   - Field name: `romanized`
   - Type: CharField(max_length=100)
   - Required field (blank=False, null=False)
   - Indexed for fast lookup
   - Stores the Sinhaglish romanized form

6. **Add suggested English field**
   - Field name: `suggested_english`
   - Type: CharField(max_length=200)
   - Required field
   - Stores inferred English meaning

7. **Add frequency tracking field**
   - Field name: `frequency`
   - Type: IntegerField with default=1
   - Tracks how many times this term was searched

8. **Add confidence score field**
   - Field name: `confidence`
   - Type: FloatField with default=0.0
   - Range: 0.0 to 1.0
   - Stores pattern confidence from learning

9. **Add source queries field**
   - Field name: `source_queries`
   - Type: JSONField with default=list
   - Stores array of variant queries
   - Example: ["peni kadala", "penikadala", "peni-kadala"]

10. **Add clicked products field**
    - Field name: `clicked_products`
    - Type: JSONField with default=list
    - Stores product references and click counts
    - Structure: [{"id": 123, "name": "...", "clicks": 40}]

11. **Add status field**
    - Field name: `status`
    - Type: CharField with choices
    - Choices: PENDING, APPROVED, REJECTED, AUTO_APPROVED
    - Default: PENDING
    - Indexed for filtering

12. **Add review tracking fields**
    - Field name: `reviewed_by`
    - Type: ForeignKey to User model (null=True)
    - Tracks who made decision
    - Field name: `reviewed_at`
    - Type: DateTimeField (null=True)
    - Tracks when decision made

13. **Add notes field**
    - Field name: `notes`
    - Type: TextField (blank=True)
    - Allows admin to add comments

14. **Add timestamp fields**
    - Field name: `created_at`
    - Type: DateTimeField(auto_now_add=True)
    - Field name: `updated_at`
    - Type: DateTimeField(auto_now=True)

15. **Add distinct users field**
    - Field name: `distinct_users`
    - Type: IntegerField with default=1
    - Tracks diversity of user base

16. **Add recommended action field**
    - Field name: `recommended_action`
    - Type: CharField with choices
    - Choices: AUTO_ADD, REVIEW, REJECT
    - Helps admin make decision

17. **Configure model Meta**
    - Set table name: `search_pending_word`
    - Add ordering: ['-confidence', '-frequency']
    - Add unique_together: ('romanized', 'status') - prevent duplicates
    - Add indexes on status, confidence, frequency
    - Set verbose names

18. **Define __str__ method**
    - Return format: `{romanized} → {suggested_english} [{status}]`

19. **Add custom model methods**
    - Create `approve()` method to change status to APPROVED
    - Create `reject()` method to change status to REJECTED
    - Create `auto_approve()` method for system approvals
    - Create `add_to_dictionary()` method to persist to main dictionary
    - Create `meets_auto_criteria()` property for auto-add eligibility

20. **Add manager with custom querysets**
    - Create `PendingWordManager` with methods:
    - `pending()` - return only PENDING status
    - `approved()` - return only APPROVED
    - `high_confidence()` - return confidence > 0.80
    - `popular()` - return frequency > 50

21. **Register model in __init__.py**
    - Add import to `models/__init__.py`
    - Make accessible from package level

### Model Structure

```
PendingWord
├── id (Primary Key)
├── romanized (CharField, indexed)
├── suggested_english (CharField)
├── frequency (IntegerField)
├── confidence (FloatField)
├── source_queries (JSONField)
├── clicked_products (JSONField)
├── status (CharField with choices)
├── recommended_action (CharField with choices)
├── distinct_users (IntegerField)
├── reviewed_by (FK User, nullable)
├── reviewed_at (DateTimeField, nullable)
├── notes (TextField, blank)
├── created_at (DateTimeField)
└── updated_at (DateTimeField)
```

### Field Specifications

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| romanized | CharField(100) | required, indexed | Romanized Sinhaglish |
| suggested_english | CharField(200) | required | English meaning |
| frequency | IntegerField | default=1 | Search count |
| confidence | FloatField | default=0.0, 0-1 | Confidence score |
| source_queries | JSONField | default=list | Query variants |
| clicked_products | JSONField | default=list | Product data |
| status | CharField(20) | choices, indexed | Approval status |
| recommended_action | CharField(20) | choices | System recommendation |
| distinct_users | IntegerField | default=1 | User diversity |

### Status Choices

| Status | Description | Transition |
|--------|-------------|------------|
| PENDING | Awaiting review | Initial state |
| APPROVED | Manually approved | Admin action |
| REJECTED | Manually rejected | Admin action |
| AUTO_APPROVED | System approved | Auto-add system |

### Recommended Action Choices

| Action | Description | Criteria |
|--------|-------------|----------|
| AUTO_ADD | Strong signal, auto-approve | confidence>0.80, freq>50 |
| REVIEW | Good signal, needs review | confidence>0.50, freq>5 |
| REJECT | Weak signal | confidence<0.50 |

### Database Schema

```sql
CREATE TABLE search_pending_word (
    id SERIAL PRIMARY KEY,
    romanized VARCHAR(100) NOT NULL,
    suggested_english VARCHAR(200) NOT NULL,
    frequency INTEGER DEFAULT 1,
    confidence FLOAT DEFAULT 0.0,
    source_queries JSONB DEFAULT '[]'::jsonb,
    clicked_products JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'PENDING',
    recommended_action VARCHAR(20),
    distinct_users INTEGER DEFAULT 1,
    reviewed_by_id INTEGER REFERENCES auth_user(id),
    reviewed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pending_word_romanized ON search_pending_word(romanized);
CREATE INDEX idx_pending_word_status ON search_pending_word(status);
CREATE INDEX idx_pending_word_confidence ON search_pending_word(confidence);
CREATE UNIQUE INDEX idx_pending_word_unique ON search_pending_word(romanized, status)
    WHERE status = 'PENDING';
```

### Model Meta Configuration

```
Meta Options
├── db_table = 'search_pending_word'
├── ordering = ['-confidence', '-frequency']
├── indexes = [romanized, status, confidence]
├── unique_together = [('romanized', 'status')] (conditional)
├── verbose_name = 'Pending Word'
└── verbose_name_plural = 'Pending Words'
```

### Custom Methods

| Method | Parameters | Return | Purpose |
|--------|------------|--------|---------|
| approve | user, notes="" | bool | Approve word, add to dictionary |
| reject | user, notes="" | bool | Reject word suggestion |
| auto_approve | None | bool | System approval |
| add_to_dictionary | None | bool | Persist to main dictionary |
| meets_auto_criteria | None | bool | Check auto-add eligibility |

### Method Implementation Logic

```
approve(user, notes="")
├── Set status = APPROVED
├── Set reviewed_by = user
├── Set reviewed_at = now
├── Set notes = notes
├── Call add_to_dictionary()
└── Save and return True

reject(user, notes="")
├── Set status = REJECTED
├── Set reviewed_by = user
├── Set reviewed_at = now
├── Set notes = notes
└── Save and return True

auto_approve()
├── Check meets_auto_criteria()
├── If True:
│   ├── Set status = AUTO_APPROVED
│   ├── Set reviewed_at = now
│   ├── Call add_to_dictionary()
│   └── Return True
└── Else: Return False

add_to_dictionary()
├── Get or create SinhaglishMapping
├── Set romanized = self.romanized
├── Set english = self.suggested_english
├── Set source = "LEARNED"
├── Save mapping
└── Return True

meets_auto_criteria()
└── Return (confidence > 0.80 AND frequency > 50 AND distinct_users > 10)
```

### Custom Manager

```
PendingWordManager
├── pending()
│   └── Return queryset.filter(status='PENDING')
├── approved()
│   └── Return queryset.filter(status='APPROVED')
├── high_confidence()
│   └── Return queryset.filter(confidence__gt=0.80)
├── popular()
│   └── Return queryset.filter(frequency__gt=50)
└── auto_add_candidates()
    └── Return queryset with meets_auto_criteria()
```

### Usage Example

```
Create pending word:
PendingWord.objects.create(
    romanized="peni kadala",
    suggested_english="brown chickpeas",
    frequency=47,
    confidence=0.88,
    source_queries=["peni kadala", "penikadala"],
    clicked_products=[{"id": 123, "clicks": 40}],
    recommended_action="AUTO_ADD",
    distinct_users=12
)

Query pending words:
pending = PendingWord.objects.pending()
high_conf = PendingWord.objects.high_confidence()
popular = PendingWord.objects.popular()

Approve word:
word = PendingWord.objects.get(id=1)
word.approve(user=request.user, notes="Verified with team")

Auto-approve:
if word.meets_auto_criteria():
    word.auto_approve()
```

### Expected Outcome
- Functional PendingWord model
- Complete field structure for suggestions
- Status workflow for approval process
- Custom methods for common operations
- Manager with useful querysets
- Ready for admin interface integration

### Verification Checklist
- [ ] `pending_word.py` file created
- [ ] PendingWord model class defined
- [ ] All fields defined with correct types
- [ ] Status and action choices configured
- [ ] Indexes added for performance
- [ ] unique_together constraint set
- [ ] Model Meta configured correctly
- [ ] __str__ method implemented
- [ ] Custom methods (approve, reject, auto_approve) created
- [ ] add_to_dictionary method implemented
- [ ] meets_auto_criteria property defined
- [ ] PendingWordManager created with querysets
- [ ] Model registered in __init__.py
- [ ] Migration created successfully

---

## Task 76: Create Admin Review UI

### Overview
Create a Django admin interface for the PendingWord model that enables administrators to review, approve, or reject word suggestions from the learning system. This UI provides a streamlined workflow for human oversight, displaying key metrics, evidence, and recommendations to help admins make informed decisions quickly.

### Dependencies
- Task 75: Create PendingWord Model
- Django admin framework
- User authentication

### Instructions

1. **Create admin configuration file**
   - Navigate to `backend/apps/search/sinhaglish/admin.py`
   - Import Django admin utilities
   - Import PendingWord model

2. **Import required dependencies**
   - Import admin decorators and classes
   - Import User model for reviewer tracking
   - Import timezone utilities
   - Import any custom admin widgets

3. **Define PendingWordAdmin class**
   - Create class inheriting from `admin.ModelAdmin`
   - Register with `@admin.register(PendingWord)` decorator
   - Add comprehensive docstring

4. **Configure list display**
   - Add `list_display` attribute
   - Include: romanized, suggested_english, status, confidence_badge, frequency, distinct_users, created_at
   - Create custom methods for formatted display

5. **Add custom display methods**
   - Create `confidence_badge` method with color-coding
   - Green (>0.80), Yellow (0.50-0.80), Red (<0.50)
   - Create `frequency_display` with formatting
   - Create `action_badge` showing recommended_action with color

6. **Configure list filters**
   - Add `list_filter` attribute
   - Include: status, recommended_action, confidence (range), frequency (range), created_at
   - Create custom filter for "Auto-Add Candidates"

7. **Configure search fields**
   - Add `search_fields` attribute
   - Include: romanized, suggested_english, notes
   - Enable admin to quickly find words

8. **Configure field ordering**
   - Add `ordering` attribute
   - Default: ['-confidence', '-frequency', '-created_at']
   - Show highest priority items first

9. **Configure readonly fields**
   - Add `readonly_fields` attribute
   - Include: created_at, updated_at, reviewed_at, reviewed_by
   - Include custom fields: evidence_display, source_queries_display

10. **Design fieldsets for form layout**
    - Group fields logically:
    - "Word Information": romanized, suggested_english
    - "Learning Metrics": frequency, confidence, distinct_users, recommended_action
    - "Evidence": source_queries_display, clicked_products_display, evidence_display
    - "Review": status, reviewed_by, reviewed_at, notes
    - "Timestamps": created_at, updated_at

11. **Create evidence display method**
    - Create `evidence_display` method
    - Format source queries as bullet list
    - Show clicked products with click counts
    - Make output HTML-formatted for readability

12. **Create source queries display**
    - Create `source_queries_display` method
    - Format JSONField as readable HTML list
    - Show all query variants

13. **Create clicked products display**
    - Create `clicked_products_display` method
    - Format JSONField as table
    - Show product name, ID, click count
    - Link to product admin if possible

14. **Add custom admin actions**
    - Create `approve_selected` action
    - Bulk approve multiple pending words
    - Create `reject_selected` action
    - Bulk reject multiple words
    - Create `auto_approve_eligible` action
    - Auto-approve words meeting criteria

15. **Implement approve_selected action**
    - Accept queryset of selected items
    - Filter for PENDING status only
    - Call approve() method on each
    - Show success message with count

16. **Implement reject_selected action**
    - Accept queryset of selected items
    - Filter for PENDING status only
    - Call reject() method on each
    - Show success message with count

17. **Implement auto_approve_eligible action**
    - Filter queryset for auto-add candidates
    - Check meets_auto_criteria() for each
    - Call auto_approve() on eligible items
    - Show detailed message with counts

18. **Add inline help text**
    - Add help text to fields in fieldsets
    - Explain confidence scores
    - Explain recommended actions
    - Guide decision making

19. **Configure pagination**
    - Set `list_per_page = 50`
    - Enable efficient browsing of large lists

20. **Add custom queryset filtering**
    - Override `get_queryset` if needed
    - Optimize with select_related/prefetch_related
    - Add custom annotations for display

21. **Configure permissions**
    - Ensure only staff users can access
    - Consider custom permission for approvals
    - Add permission checks in actions

22. **Test admin interface**
    - Create test pending words
    - Verify all display fields work
    - Test all admin actions
    - Check permission enforcement

### Admin List Display Configuration

| Column | Source | Format |
|--------|--------|--------|
| Romanized | romanized | Text |
| Suggested English | suggested_english | Text |
| Status | status | Badge with color |
| Confidence | confidence | Badge with % and color |
| Frequency | frequency | Number with formatting |
| Users | distinct_users | Number |
| Recommended | recommended_action | Badge with color |
| Created | created_at | Date/time |

### Confidence Badge Colors

```
Confidence Badge Display
├── 0.80 - 1.00: 🟢 Green "85%" (High)
├── 0.50 - 0.79: 🟡 Yellow "65%" (Medium)
└── 0.00 - 0.49: 🔴 Red "35%" (Low)
```

### Recommended Action Badges

```
Action Badge Display
├── AUTO_ADD: 🟢 Green "Auto-Add"
├── REVIEW: 🟡 Yellow "Review"
└── REJECT: 🔴 Red "Reject"
```

### Admin Fieldsets Structure

```
Fieldsets
├── Word Information
│   ├── romanized
│   └── suggested_english
│
├── Learning Metrics
│   ├── frequency
│   ├── confidence (with help text)
│   ├── distinct_users
│   └── recommended_action
│
├── Evidence (readonly, formatted)
│   ├── source_queries_display
│   ├── clicked_products_display
│   └── evidence_display
│
├── Review Decision
│   ├── status
│   ├── notes (textarea)
│   ├── reviewed_by (readonly)
│   └── reviewed_at (readonly)
│
└── Timestamps (collapsed, readonly)
    ├── created_at
    └── updated_at
```

### Custom Admin Actions

| Action | Filter | Operation | Message |
|--------|--------|-----------|---------|
| approve_selected | status=PENDING | Call approve() | "Approved {count} words" |
| reject_selected | status=PENDING | Call reject() | "Rejected {count} words" |
| auto_approve_eligible | meets_auto_criteria() | Call auto_approve() | "Auto-approved {count} words" |

### Evidence Display Format

```html
Source Queries:
• peni kadala (original)
• penikadala (variant)
• peni-kadala (variant)

Clicked Products:
┌────────────────────────────────────────┐
│ Product              │ ID  │ Clicks    │
├──────────────────────┼─────┼───────────┤
│ Brown Chickpeas 500g │ 123 │ 40 (85%)  │
│ Chickpea Lentils     │ 456 │ 7 (15%)   │
└──────────────────────┴─────┴───────────┘

Recommendation: AUTO_ADD
Reasoning: High confidence (88%), high frequency (47), consistent clicks (85%)
```

### List Filters Configuration

```
List Filters
├── Status
│   ├── Pending
│   ├── Approved
│   ├── Rejected
│   └── Auto-Approved
│
├── Recommended Action
│   ├── Auto-Add
│   ├── Review
│   └── Reject
│
├── Confidence
│   ├── High (>0.80)
│   ├── Medium (0.50-0.80)
│   └── Low (<0.50)
│
├── Frequency
│   ├── Very Popular (>100)
│   ├── Popular (50-100)
│   ├── Moderate (10-50)
│   └── Low (<10)
│
└── Created Date
    ├── Today
    ├── Past 7 days
    ├── This month
    └── Custom range
```

### Admin Action Workflow

```
Admin views Pending Words list
      │
      ▼
Filters by "High Confidence" or "Auto-Add Candidates"
      │
      ▼
Reviews word entry:
├── Checks romanized and suggested English
├── Reviews evidence (queries, products)
├── Reads recommendation
└── Examines confidence and frequency
      │
      ▼
Makes decision:
├── Option A: Approve individually
│   └── Click "Save" with status=APPROVED
│
├── Option B: Use bulk action
│   ├── Select multiple words
│   └── Choose "Approve selected" action
│
└── Option C: Auto-approve eligible
    └── Action: "Auto-approve eligible words"
      │
      ▼
Word added to dictionary
      │
      ▼
Available in next search
```

### Performance Optimization

| Aspect | Implementation |
|--------|----------------|
| Query Optimization | Use select_related, prefetch_related |
| Pagination | Set reasonable page size (50) |
| Indexing | Ensure status, confidence indexed |
| Caching | Cache formatted displays if needed |

### Expected Outcome
- Fully functional Django admin interface
- Intuitive display of pending words
- Clear evidence and recommendations
- Efficient bulk actions for approval
- Streamlined review workflow
- Color-coded visual indicators

### Verification Checklist
- [ ] PendingWordAdmin class created
- [ ] list_display configured with all fields
- [ ] Custom display methods (confidence_badge, etc.) implemented
- [ ] list_filter configured for efficient filtering
- [ ] search_fields enabled for quick lookup
- [ ] Fieldsets organized logically
- [ ] evidence_display method shows formatted data
- [ ] source_queries_display shows variants
- [ ] clicked_products_display shows table
- [ ] approve_selected action implemented
- [ ] reject_selected action implemented
- [ ] auto_approve_eligible action implemented
- [ ] Help text added to guide admins
- [ ] Pagination configured
- [ ] Permissions properly set
- [ ] Admin interface tested with sample data

---

## Task 77: Create Auto-Add Popular Terms

### Overview
Implement an automated system that identifies and approves high-confidence, popular word suggestions without requiring manual admin review. This auto-approval process uses strict criteria to ensure only the most reliable suggestions are automatically added to the dictionary, reducing admin workload while maintaining quality standards.

### Dependencies
- Task 75: Create PendingWord Model
- Task 74: Create suggest_words Method
- Celery task queue configured

### Instructions

1. **Create auto-approval service file**
   - Navigate to `backend/apps/search/sinhaglish/services/` directory
   - Open `learning.py` (or create `auto_approval.py`)
   - Add AutoApprovalService class

2. **Import required dependencies**
   - Import PendingWord model
   - Import SinhaglishMapping (dictionary model)
   - Import logging utilities
   - Import Django ORM utilities
   - Import timezone utilities

3. **Define AutoApprovalService class**
   - Create class for auto-approval logic
   - Add comprehensive docstring
   - Define as utility class or singleton

4. **Define auto-approval criteria constants**
   - MIN_FREQUENCY: 50 (minimum search count)
   - MIN_CONFIDENCE: 0.80 (80% confidence)
   - MIN_CLICK_RATE: 0.80 (80% clicks on same product)
   - MIN_DISTINCT_USERS: 10 (minimum unique users)
   - Make configurable via settings

5. **Create get_auto_add_candidates method**
   - Method signature: `get_auto_add_candidates()`
   - Query PendingWord for status=PENDING
   - Apply all auto-approval criteria
   - Return queryset of eligible words

6. **Implement criteria filtering**
   - Filter frequency >= MIN_FREQUENCY
   - Filter confidence >= MIN_CONFIDENCE
   - Filter distinct_users >= MIN_DISTINCT_USERS
   - Calculate click rate from clicked_products JSON
   - Filter click_rate >= MIN_CLICK_RATE

7. **Create calculate_click_rate method**
   - Method signature: `calculate_click_rate(pending_word)`
   - Extract clicked_products from JSONField
   - Find product with most clicks
   - Calculate: max_clicks / total_clicks
   - Return float (0.0 to 1.0)

8. **Create auto_approve_word method**
   - Method signature: `auto_approve_word(pending_word)`
   - Call pending_word.auto_approve()
   - Log approval action
   - Return success status

9. **Create process_auto_approvals method**
   - Main method for batch processing
   - Get all candidates via get_auto_add_candidates()
   - Iterate through candidates
   - Auto-approve each eligible word
   - Track success and failure counts
   - Return summary statistics

10. **Add validation checks**
    - Verify word not already in dictionary
    - Check for duplicate romanized forms
    - Validate english translation is meaningful
    - Ensure data integrity

11. **Implement logging and monitoring**
    - Log each auto-approval with details
    - Log summary statistics (count, success rate)
    - Track failures and reasons
    - Alert on anomalies (too many/few approvals)

12. **Add safety limits**
    - Maximum auto-approvals per run (default: 100)
    - Prevents bulk errors
    - Configurable via settings

13. **Create Celery periodic task**
    - Create new file: `backend/apps/search/sinhaglish/tasks.py`
    - Import Celery app and task decorator
    - Import AutoApprovalService

14. **Define auto_approve_popular_words task**
    - Use `@app.task` decorator
    - Call AutoApprovalService.process_auto_approvals()
    - Log task execution
    - Return task result

15. **Configure Celery beat schedule**
    - Open `backend/config/celery.py` (or settings)
    - Add schedule entry for auto-approval task
    - Run daily at 3:00 AM (off-peak)
    - Configure timezone appropriately

16. **Add management command (optional)**
    - Create `management/commands/auto_approve_words.py`
    - Allow manual triggering of auto-approval
    - Useful for testing and emergency runs
    - Accept command-line arguments for criteria override

17. **Create notification system**
    - Send email/notification to admins on completion
    - Include summary: words approved, failures
    - Alert on unusually high/low approval counts
    - Consider Slack/Teams integration

18. **Add analytics tracking**
    - Track auto-approval rate over time
    - Monitor false positive rate (if feedback available)
    - Measure impact on search quality
    - Create dashboard metrics

19. **Implement dry-run mode**
    - Add `dry_run` parameter to methods
    - Log what would be approved without making changes
    - Useful for testing and validation
    - Display candidates that meet criteria

20. **Test auto-approval system**
    - Create test pending words meeting criteria
    - Run auto-approval process
    - Verify words added to dictionary
    - Test edge cases (boundary values)
    - Verify safety limits work

### Auto-Approval Criteria

| Criterion | Threshold | Purpose |
|-----------|-----------|---------|
| Search Frequency | >= 50 | Ensures genuine user interest |
| Confidence Score | >= 0.80 | High pattern reliability |
| Click Rate | >= 0.80 | Consistent user behavior |
| Distinct Users | >= 10 | Diverse user validation |

### Criteria Logic

```
Word is auto-approved IF:
    frequency >= 50
    AND confidence >= 0.80
    AND click_rate >= 0.80
    AND distinct_users >= 10
    AND NOT already_in_dictionary
    AND status = PENDING
```

### Click Rate Calculation

```
Example clicked_products JSON:
[
    {"id": 123, "name": "Brown Chickpeas", "clicks": 42},
    {"id": 456, "name": "Lentils", "clicks": 5},
    {"id": 789, "name": "Chickpea Flour", "clicks": 3}
]

Total clicks = 42 + 5 + 3 = 50
Max clicks = 42
Click rate = 42 / 50 = 0.84 (84%)

Result: PASSES (>= 0.80)
```

### Auto-Approval Flow

```
Scheduled Task Runs (Daily 3:00 AM)
      │
      ▼
AutoApprovalService.process_auto_approvals()
      │
      ▼
get_auto_add_candidates()
      │
      ├─► Query PendingWord (status=PENDING)
      ├─► Filter frequency >= 50
      ├─► Filter confidence >= 0.80
      ├─► Filter distinct_users >= 10
      └─► Calculate and filter click_rate >= 0.80
      │
      ▼
Found: 23 candidates
      │
      ▼
For each candidate:
      │
      ├─► Candidate 1: "peni kadala"
      │        ├─► Validate not in dictionary
      │        ├─► Call auto_approve()
      │        ├─► Add to dictionary
      │        └─► Success
      │
      ├─► Candidate 2: "pol sambol"
      │        ├─► Validate
      │        ├─► Auto-approve
      │        └─► Success
      │
      └─► ... (21 more)
      │
      ▼
Summary:
├── Total candidates: 23
├── Approved: 22
├── Failed: 1 (already in dictionary)
└── Duration: 2.3 seconds
      │
      ▼
Send notification to admins
      │
      ▼
Log completion
```

### AutoApprovalService Class Structure

```
AutoApprovalService
├── get_auto_add_candidates()
│   ├── Query PendingWord
│   ├── Apply criteria filters
│   └── Return queryset
│
├── calculate_click_rate(pending_word)
│   ├── Extract clicked_products
│   ├── Calculate rate
│   └── Return float
│
├── auto_approve_word(pending_word)
│   ├── Validate
│   ├── Call pending_word.auto_approve()
│   ├── Log action
│   └── Return success
│
├── process_auto_approvals(dry_run=False)
│   ├── Get candidates
│   ├── Loop and approve
│   ├── Track statistics
│   └── Return summary
│
└── validate_word(pending_word)
    ├── Check dictionary
    ├── Check duplicates
    └── Return valid
```

### Celery Task Configuration

```python
# In config/celery.py or settings/celery.py

from celery.schedules import crontab

app.conf.beat_schedule = {
    'auto-approve-popular-words': {
        'task': 'apps.search.sinhaglish.tasks.auto_approve_popular_words',
        'schedule': crontab(hour=3, minute=0),  # Daily at 3:00 AM
        'options': {'expires': 3600},  # Task expires after 1 hour
    },
}
```

### Safety Limits

| Limit | Default | Purpose |
|-------|---------|---------|
| Max per run | 100 | Prevent bulk errors |
| Min confidence | 0.80 | Quality threshold |
| Min frequency | 50 | Avoid rare terms |
| Cooldown period | 24 hours | Daily processing |

### Dry-Run Mode

```
Run with dry_run=True:

AutoApprovalService.process_auto_approvals(dry_run=True)
      │
      ▼
Output:
─────────────────────────────────────
DRY RUN - No changes will be made
─────────────────────────────────────

Candidates meeting criteria:
1. "peni kadala" → "brown chickpeas"
   Frequency: 47, Confidence: 0.88, Users: 12, Click Rate: 0.85

2. "pol sambol" → "coconut sambol"
   Frequency: 52, Confidence: 0.82, Users: 11, Click Rate: 0.81

3. "gotukola" → "gotu kola leaves"
   Frequency: 68, Confidence: 0.90, Users: 15, Click Rate: 0.92

Total: 3 words would be auto-approved
─────────────────────────────────────
```

### Management Command

```
# Run manual auto-approval
python manage.py auto_approve_words

# With dry-run
python manage.py auto_approve_words --dry-run

# Override criteria
python manage.py auto_approve_words --min-frequency=30 --min-confidence=0.75

# Limit count
python manage.py auto_approve_words --max-words=50
```

### Notification Template

```
Subject: Auto-Approval Summary - 23 Words Processed

Hello Admin Team,

The automated word approval process has completed:

Summary:
- Total candidates evaluated: 23
- Successfully approved: 22
- Failed/skipped: 1
- Duration: 2.3 seconds

Top approved words:
1. "gotukola" → "gotu kola leaves" (Confidence: 0.90, Frequency: 68)
2. "peni kadala" → "brown chickpeas" (Confidence: 0.88, Frequency: 47)
3. "pol sambol" → "coconut sambol" (Confidence: 0.82, Frequency: 52)

These words are now available in the search dictionary.

View all approved words: [Admin Link]

---
LankaCommerce Cloud Auto-Approval System
```

### Expected Outcome
- Automated approval of high-confidence terms
- Celery task running daily
- Strict criteria ensuring quality
- Logging and monitoring in place
- Admin notifications configured
- Reduced manual review workload

### Verification Checklist
- [ ] AutoApprovalService class created
- [ ] Auto-approval criteria defined
- [ ] get_auto_add_candidates method implemented
- [ ] calculate_click_rate method working
- [ ] auto_approve_word method functional
- [ ] process_auto_approvals method complete
- [ ] Validation checks in place
- [ ] Celery task created (auto_approve_popular_words)
- [ ] Celery beat schedule configured
- [ ] Safety limits implemented
- [ ] Logging comprehensive
- [ ] Notification system working
- [ ] Dry-run mode functional
- [ ] Management command created (optional)
- [ ] Testing completed with sample data
- [ ] Task runs successfully on schedule

---

## Task 78: Verify Learning System

### Overview
Conduct comprehensive verification of the complete learning system to ensure all components work together correctly. This task validates the end-to-end flow from search logging through pattern identification to word approval and dictionary integration, confirming that the system successfully learns from user behavior and improves search quality.

### Dependencies
- Task 67-77: All learning system components complete
- Test data and environment available

### Instructions

1. **Prepare test environment**
   - Set up clean test database or use staging
   - Create test user accounts (customers, admins)
   - Clear existing logs and pending words
   - Ensure all services running (Django, Celery, database)

2. **Create test data fixtures**
   - Create test products with clear names
   - Prepare romanized test queries
   - Plan expected transliterations
   - Document test scenarios

3. **Test 1: Search Logging**
   - Perform test searches with romanized queries
   - Use queries NOT in dictionary
   - Verify TransliterationLog entries created
   - Check all fields populated correctly
   - Verify timestamps accurate

4. **Validate search logging fields**
   - Confirm query field stores romanized input
   - Confirm expanded field (empty for unknown words)
   - Confirm results_count recorded
   - Confirm found_match = False for unknown words
   - Confirm customer FK linked (if authenticated)

5. **Test 2: Click Tracking**
   - Simulate user clicking products from search results
   - Call SearchLearning.log_click() for each click
   - Verify clicked_product FK updated
   - Verify clicked_at timestamp set
   - Test multiple clicks for same query

6. **Validate click tracking**
   - Confirm clicked_product links to correct Product
   - Confirm has_click property returns True
   - Confirm time_to_click calculated correctly
   - Verify logs without clicks remain NULL

7. **Test 3: Pattern Identification**
   - Create sufficient test logs (20+ per pattern)
   - Use multiple users for same query
   - Ensure consistent click patterns (same product)
   - Run PatternLearner.identify_patterns(days=30)
   - Verify patterns returned

8. **Validate pattern identification**
   - Confirm similar queries grouped together
   - Confirm click consistency calculated
   - Confirm confidence scores assigned
   - Confirm frequency counts accurate
   - Confirm distinct user counts correct
   - Verify only qualifying patterns returned

9. **Test 4: Word Suggestion**
   - Take patterns from identify_patterns()
   - Run PatternLearner.suggest_words(patterns)
   - Verify suggestions created
   - Check English inference from product names
   - Validate confidence and frequency propagated

10. **Validate word suggestions**
    - Confirm romanized extracted correctly
    - Confirm suggested_english inferred properly
    - Confirm source_queries includes variants
    - Confirm clicked_products data included
    - Confirm recommended_action assigned
    - Verify suggestions structure correct

11. **Test 5: PendingWord Creation**
    - Run suggest_words with auto_create_pending=True
    - Verify PendingWord entries created in database
    - Check all fields populated
    - Verify status=PENDING
    - Test duplicate handling

12. **Validate PendingWord model**
    - Confirm all fields have correct values
    - Confirm JSONFields properly formatted
    - Confirm unique constraint working
    - Test model methods (approve, reject, etc.)
    - Verify meets_auto_criteria logic

13. **Test 6: Admin Review Interface**
    - Log in as admin user
    - Navigate to PendingWord admin
    - Verify list display shows all columns
    - Test filtering by status, confidence
    - Test search functionality
    - View detail page for pending word

14. **Validate admin interface**
    - Confirm evidence displays correctly
    - Confirm confidence badges color-coded
    - Confirm all fieldsets visible
    - Test approve action (single word)
    - Test reject action
    - Verify approved word added to dictionary

15. **Test 7: Bulk Admin Actions**
    - Select multiple pending words
    - Use "approve_selected" action
    - Verify all selected words approved
    - Use "reject_selected" action
    - Use "auto_approve_eligible" action
    - Check only eligible words approved

16. **Validate bulk actions**
    - Confirm correct words processed
    - Confirm status updated
    - Confirm reviewed_by and reviewed_at set
    - Verify dictionary updated
    - Check admin messages displayed

17. **Test 8: Auto-Approval System**
    - Create pending words meeting auto criteria
    - Run AutoApprovalService.process_auto_approvals()
    - Verify eligible words auto-approved
    - Verify words not meeting criteria skipped
    - Check notifications sent

18. **Validate auto-approval**
    - Confirm only high-confidence words approved
    - Confirm criteria thresholds enforced
    - Confirm status = AUTO_APPROVED
    - Verify words added to dictionary
    - Check logging complete
    - Test safety limits (max per run)

19. **Test 9: Celery Task Execution**
    - Manually trigger auto-approval task
    - Monitor task execution in Celery logs
    - Verify task completes successfully
    - Check task result returned
    - Test task scheduling (check next run time)

20. **Test 10: End-to-End Flow**
    - Simulate complete user journey:
    - User searches unknown Sinhaglish term (50+ times, 10+ users)
    - Users click same product consistently (>80%)
    - Wait for pattern analysis
    - Verify PendingWord created
    - Wait for auto-approval (or manually trigger)
    - Verify word added to dictionary
    - Search same term again
    - Verify now returns results (learned!)

21. **Validate dictionary integration**
    - Confirm new words appear in SinhaglishMapping
    - Verify search now uses new words
    - Test transliteration with learned words
    - Ensure no duplicates created
    - Check source field = "LEARNED"

22. **Test edge cases**
    - Empty search queries
    - Queries with special characters
    - Very long queries (>255 chars)
    - Searches without clicks
    - Multiple clicks same user
    - Concurrent logging

23. **Validate error handling**
    - Test with invalid product IDs
    - Test with missing customer
    - Test database connection failures
    - Verify graceful degradation
    - Check error logging

24. **Performance testing**
    - Log 10,000+ searches
    - Run pattern analysis on large dataset
    - Measure execution time
    - Check database query performance
    - Verify pagination in admin
    - Test with concurrent users

25. **Create verification report**
    - Document all test results
    - Note any failures or issues
    - Confirm all components functional
    - List verified user stories
    - Provide metrics (approval rate, accuracy)

### Verification Test Plan

```
Test Suite: Learning System Verification
────────────────────────────────────────────

Phase 1: Data Collection
├── ✓ Search logging functional
├── ✓ Click tracking working
├── ✓ All fields populated correctly
└── ✓ Multi-user scenarios handled

Phase 2: Pattern Analysis
├── ✓ Similarity grouping accurate
├── ✓ Confidence scoring correct
├── ✓ Frequency counting accurate
└── ✓ Qualifying patterns identified

Phase 3: Word Suggestion
├── ✓ English inference from products
├── ✓ Suggestion structure correct
├── ✓ Recommended actions assigned
└── ✓ PendingWord creation successful

Phase 4: Human Review
├── ✓ Admin interface functional
├── ✓ Evidence displays clearly
├── ✓ Manual approval works
├── ✓ Bulk actions successful
└── ✓ Dictionary integration confirmed

Phase 5: Automation
├── ✓ Auto-approval criteria enforced
├── ✓ Only eligible words approved
├── ✓ Celery task executes
├── ✓ Notifications sent
└── ✓ Safety limits working

Phase 6: End-to-End
├── ✓ Complete user journey works
├── ✓ Learned words improve search
├── ✓ System learns continuously
└── ✓ No regressions detected
```

### End-to-End Test Scenario

```
Day 1: User Searches
├── 15 users search "peni kadala" (unknown word)
├── No transliteration found (expanded = "")
├── 12 users click "Brown Chickpeas 500g"
├── 3 users click "Lentils Mix"
└── All searches logged to TransliterationLog

Day 2: More Searches
├── 20 more users search "peni kadala"
├── 17 click "Brown Chickpeas 500g"
├── 3 click other products
└── Total: 35 searches, 25 distinct users

Day 3: Pattern Analysis (Manual trigger)
├── Run: PatternLearner.identify_patterns(days=7)
├── Pattern found: "peni kadala"
│   ├── Frequency: 35
│   ├── Distinct users: 25
│   ├── Primary product: Brown Chickpeas (82% clicks)
│   └── Confidence: 0.83
├── Run: suggest_words(patterns)
└── PendingWord created:
    ├── romanized: "peni kadala"
    ├── suggested_english: "brown chickpeas"
    ├── status: PENDING
    └── recommended_action: REVIEW

Day 4: More Searches (Word still pending)
├── 20 more users search "peni kadala"
├── 18 click "Brown Chickpeas"
└── Total: 55 searches, 40 distinct users

Day 5: Re-Analysis
├── Pattern updated:
│   ├── Frequency: 55
│   ├── Distinct users: 40
│   ├── Click rate: 85%
│   └── Confidence: 0.88
└── PendingWord updated via suggest_words()

Day 6: Auto-Approval (3:00 AM task)
├── AutoApprovalService runs
├── "peni kadala" meets criteria:
│   ├── Frequency: 55 >= 50 ✓
│   ├── Confidence: 0.88 >= 0.80 ✓
│   ├── Click rate: 0.85 >= 0.80 ✓
│   └── Distinct users: 40 >= 10 ✓
├── Word auto-approved
├── Added to SinhaglishMapping:
│   ├── romanized: "peni kadala"
│   ├── english: "brown chickpeas"
│   └── source: "LEARNED"
└── Notification sent to admins

Day 7: Verification
├── User searches "peni kadala"
├── Transliteration finds match!
├── expanded: "brown chickpeas"
├── Search returns "Brown Chickpeas" products
└── ✅ SYSTEM LEARNED SUCCESSFULLY!
```

### Success Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Search Logging | 100% captured | ___ | ___ |
| Click Tracking | >95% accurate | ___ | ___ |
| Pattern Detection | >90% precision | ___ | ___ |
| English Inference | >85% accurate | ___ | ___ |
| Auto-Approval Rate | 40-60% of pending | ___ | ___ |
| False Positive Rate | <5% | ___ | ___ |
| End-to-End Success | 100% functional | ___ | ___ |

### Verification Checklist

```
Data Collection
├── [ ] TransliterationLog creates entries
├── [ ] All fields populate correctly
├── [ ] Click tracking updates logs
└── [ ] Multi-user logging works

Pattern Analysis
├── [ ] identify_patterns finds patterns
├── [ ] Similarity grouping accurate
├── [ ] Confidence scoring correct
├── [ ] Frequency counting accurate
└── [ ] Filtering thresholds work

Word Suggestion
├── [ ] suggest_words creates suggestions
├── [ ] English inference logical
├── [ ] Recommended actions correct
├── [ ] PendingWord creation works
└── [ ] Duplicate handling functions

Admin Interface
├── [ ] List display shows all data
├── [ ] Filters work correctly
├── [ ] Evidence displays clearly
├── [ ] Manual approve/reject works
├── [ ] Bulk actions functional
└── [ ] Dictionary integration confirmed

Auto-Approval
├── [ ] Criteria enforced correctly
├── [ ] Only eligible words approved
├── [ ] Safety limits prevent errors
├── [ ] Celery task executes
├── [ ] Notifications sent
└── [ ] Logging comprehensive

End-to-End
├── [ ] Complete flow functional
├── [ ] Learned words improve search
├── [ ] No duplicate dictionary entries
├── [ ] Performance acceptable
└── [ ] Error handling robust
```

### Expected Outcome
- Complete verification of learning system
- All components tested and functional
- End-to-end flow confirmed working
- Performance validated
- Edge cases handled
- Documentation of test results

### Verification Report Template

```
Learning System Verification Report
═══════════════════════════════════

Date: _________
Environment: _________
Tested By: _________

Component Status:
├── SearchLearning Service: [PASS/FAIL]
├── TransliterationLog Model: [PASS/FAIL]
├── PatternLearner: [PASS/FAIL]
├── PendingWord Model: [PASS/FAIL]
├── Admin Interface: [PASS/FAIL]
├── Auto-Approval System: [PASS/FAIL]
└── Celery Tasks: [PASS/FAIL]

Test Results:
- Search Logging: ___ / ___ tests passed
- Click Tracking: ___ / ___ tests passed
- Pattern Analysis: ___ / ___ tests passed
- Word Suggestions: ___ / ___ tests passed
- Admin Actions: ___ / ___ tests passed
- Auto-Approval: ___ / ___ tests passed
- End-to-End: ___ / ___ tests passed

Issues Found: ___

Recommendations: ___

Overall Status: [PASS/FAIL]

Sign-off: ___________
```

### Final Verification Checklist
- [ ] All 10 test phases completed
- [ ] End-to-end flow successful
- [ ] Performance acceptable (<5s for analysis)
- [ ] Error handling tested
- [ ] Edge cases covered
- [ ] Documentation complete
- [ ] Verification report created
- [ ] System ready for production

---

## Summary

This document completed the learning system by implementing the review queue, admin interface, auto-approval automation, and comprehensive verification. The system now continuously learns from user behavior and improves search quality automatically.

### Completed Tasks
1. ✓ Created PendingWord model for review queue
2. ✓ Created Django admin interface for human review
3. ✓ Implemented auto-approval for popular terms
4. ✓ Verified complete learning system functionality

### Key Outcomes
- **Review Queue:** Structured storage for word suggestions
- **Human Oversight:** Admin interface for review and approval
- **Automation:** High-confidence terms auto-approved daily
- **Quality Assurance:** Comprehensive verification of all components
- **Continuous Improvement:** System learns and improves automatically

### Learning System Complete

The learning system is now fully functional and ready for production:

```
User Behavior → Logging → Pattern Analysis → Suggestions → Review/Auto-Approve → Dictionary Update → Improved Search
        ↑                                                                                              │
        └──────────────────────────────────────────────────────────────────────────────────────────────┘
                                     Continuous Learning Loop
```

### Next Steps
Proceed to [Group-F_API-Testing](../Group-F_API-Testing/) to implement comprehensive testing for the Sinhaglish search API endpoints and verify the complete search and learning system through automated tests.
