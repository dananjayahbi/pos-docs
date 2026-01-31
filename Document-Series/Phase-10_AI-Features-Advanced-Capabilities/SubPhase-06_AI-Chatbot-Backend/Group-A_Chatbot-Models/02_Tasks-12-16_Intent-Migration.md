# Tasks 12-16: Intent Model and Migrations

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** A - Chatbot Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-11_Conversation-Message.md](01_Tasks-01-11_Conversation-Message.md)
- **→ Next Group:** [Group-B_Intent-Classification](../Group-B_Intent-Classification/)

---

## Document Overview

This document covers the creation of the Intent model for chatbot intent classification, migration generation, and model verification. The Intent model stores predefined intents with their training phrases to support natural language understanding and intent recognition. This document also covers the migration process to apply all model definitions to the database and verification steps to ensure proper model configuration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 12 | Create Intent Model | Medium | 30 min |
| 13 | Create intent_name Field | Low | 10 min |
| 14 | Create training_phrases Field | Low | 20 min |
| 15 | Create Chatbot Migrations | Low | 15 min |
| 16 | Verify Models | Low | 20 min |

---

## Task 12: Create Intent Model

### Overview
Create the Intent model to store intent definitions for the chatbot's natural language understanding system. This model contains predefined intents with associated training phrases that help the chatbot classify user messages into actionable categories like order status inquiries, product information requests, or support escalations.

### Dependencies
- Task 01: Create Conversation Model
- Chatbot models directory structure is established

### Instructions

1. **Navigate to chatbot models directory**
   - Go to `backend/apps/chatbot/models/` directory
   - This directory already contains conversation.py and message.py

2. **Create intent model file**
   - Create new file named `intent.py` in `models/` directory
   - This file will contain the Intent model class

3. **Import required dependencies**
   - Import Django's models module
   - Import JSONField for storing training phrases
   - No need for foreign key imports (standalone model)

4. **Define Intent model class**
   - Create class inheriting from Django's Model
   - Use descriptive class name: `Intent`
   - Add class Meta for database configuration

5. **Configure model metadata**
   - Set table name using `db_table`
   - Define ordering by intent_name alphabetically
   - Add verbose name and plural form
   - Configure unique constraints if needed

6. **Add __str__ method**
   - Return meaningful string representation
   - Use intent_name as the string value
   - Format: "{intent_name}"

7. **Plan field structure**
   - intent_name: Unique identifier for the intent
   - training_phrases: JSON array of example phrases

8. **Update models __init__.py**
   - Import Intent model in `models/__init__.py`
   - Ensure all models are exported properly

### Model Purpose

| Aspect | Description |
|--------|-------------|
| Primary Goal | Store intent definitions and training data |
| Contains | Intent names and associated training phrases |
| Enables | Intent classification and NLU training |
| Supports | Both predefined and dynamic intents |

### Intent Classification Flow

```
User Message
     │
     ▼
┌──────────────────────┐
│ Extract text content │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Load Intent records  │
│ with training phrases│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Calculate similarity │
│ to training phrases  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Return best matching │
│ intent with score    │
└──────────────────────┘
```

### Model Characteristics

| Feature | Implementation Approach |
|---------|------------------------|
| Intent Storage | CharField for name |
| Training Data | JSONField for phrase list |
| Extensibility | Add new intents via admin/API |
| Versioning | Consider adding version field later |

### Directory Structure After Creation
```
backend/apps/chatbot/models/
├── __init__.py
├── conversation.py
├── message.py
└── intent.py           # Created in this task
```

### Database Table Planning

| Column | Type | Purpose |
|--------|------|---------|
| id | AutoField/BigAutoField | Primary key |
| intent_name | CharField(50) | Unique intent identifier |
| training_phrases | JSONField | List of example phrases |
| created_at | DateTimeField | Record creation |
| updated_at | DateTimeField | Last modification |

### Predefined Intents Overview

| Intent | Category | Examples |
|--------|----------|----------|
| ORDER_STATUS | Transactions | "Where is my order?", "Track order" |
| PRODUCT_INFO | Catalog | "Tell me about this product" |
| RETURNS | Support | "How do I return this?" |
| SHIPPING | Logistics | "Shipping cost?", "Delivery time" |
| STORE_INFO | General | "Store hours?", "Location?" |
| GREETING | Social | "Hello", "Hi there" |
| FAREWELL | Social | "Goodbye", "Thanks, bye" |
| ESCALATE | Meta | "Speak to human", "Agent please" |

### Intent Relationship to Conversations

```
Intent Model (Standalone)
     │
     │ Referenced by (not FK)
     │
     ▼
┌──────────────────────┐
│  Message (system)    │
│                      │
│ content: "Intent:    │
│          ORDER_STATUS│
│          Conf: 0.95" │
└──────────────────────┘
```

### Expected Outcome
- Intent model class created and properly structured
- Model file located in chatbot app models directory
- Basic model structure ready for field definitions
- Model metadata configured appropriately
- Ready for training phrase storage

### Verification Checklist
- [ ] `backend/apps/chatbot/models/intent.py` file created
- [ ] Intent class defined with Model inheritance
- [ ] Model Meta class configured
- [ ] `__str__` method implemented
- [ ] Required imports added
- [ ] Ordering set to intent_name
- [ ] Ready for field definitions

---

## Task 13: Create intent_name Field

### Overview
Add the intent_name field to the Intent model as the unique identifier for each intent category. This field stores the standardized name of the intent using uppercase with underscores (e.g., ORDER_STATUS, PRODUCT_INFO) and enforces uniqueness to prevent duplicate intent definitions.

### Dependencies
- Task 12: Create Intent Model

### Instructions

1. **Add intent_name field**
   - Add CharField to Intent model
   - Set field name as `intent_name`
   - Configure for short, unique values

2. **Configure field properties**
   - Set `max_length=50` for intent names
   - Set `unique=True` to prevent duplicates
   - Mark as required (no null/blank)
   - Add database index (automatic with unique)

3. **Add field documentation**
   - Include help_text describing purpose
   - Document naming convention (UPPERCASE_SNAKE_CASE)
   - Example: "Unique intent identifier in UPPERCASE_SNAKE_CASE"

4. **Plan naming conventions**
   - Use uppercase letters
   - Separate words with underscores
   - Keep names descriptive but concise
   - Examples: ORDER_STATUS, PRODUCT_INFO, RETURNS

5. **Consider validation**
   - Add validator for naming pattern (optional)
   - Ensure no spaces in intent names
   - Prevent special characters except underscore

6. **Plan for extensibility**
   - Allow adding new intents dynamically
   - Support custom business-specific intents
   - Consider intent hierarchies later

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | CharField | Short text identifier |
| Max Length | 50 | Adequate for intent names |
| Unique | True | One intent per name |
| Null | False | Intent name always required |
| Blank | False | Cannot be empty |
| DB Index | Yes (via unique) | Fast intent lookups |

### Naming Convention

| Aspect | Rule | Examples |
|--------|------|----------|
| Case | UPPERCASE | ORDER_STATUS, not order_status |
| Word Separator | Underscore | PRODUCT_INFO, not ProductInfo |
| Length | Concise but descriptive | RETURNS, not CUSTOMER_RETURNS_AND_REFUNDS |
| Special Chars | Underscore only | ORDER_STATUS, not ORDER-STATUS |

### Predefined Intent Names

| Intent Name | Category | Description |
|------------|----------|-------------|
| ORDER_STATUS | Transaction | Check order status and tracking |
| PRODUCT_INFO | Catalog | Product details and specifications |
| RETURNS | Support | Return and refund inquiries |
| SHIPPING | Logistics | Shipping costs and delivery times |
| STORE_INFO | General | Store hours, location, contact |
| GREETING | Social | Greetings and conversation starters |
| FAREWELL | Social | Goodbyes and conversation endings |
| ESCALATE | Meta | Request human support |

### Intent Categories

```
Transaction Intents
├── ORDER_STATUS
├── ORDER_CANCEL
├── ORDER_MODIFY
└── PAYMENT_INFO

Product Intents
├── PRODUCT_INFO
├── PRODUCT_SEARCH
├── PRODUCT_COMPARE
└── PRODUCT_AVAILABILITY

Support Intents
├── RETURNS
├── COMPLAINTS
├── TECHNICAL_ISSUE
└── ESCALATE

General Intents
├── GREETING
├── FAREWELL
├── STORE_INFO
└── HELP
```

### Custom Intent Examples

| Business Type | Custom Intents |
|--------------|----------------|
| Restaurant POS | RESERVATION, MENU_INFO, DIETARY_INFO |
| Retail Store | SIZE_GUIDE, STORE_POLICY, LOYALTY_PROGRAM |
| Service Business | APPOINTMENT, SERVICE_PRICING, AVAILABILITY |

### Intent Lookup Performance

| Scenario | Query Method | Performance |
|----------|-------------|-------------|
| By name | `Intent.objects.get(intent_name='ORDER_STATUS')` | O(1) index seek |
| Existence check | `Intent.objects.filter(intent_name=name).exists()` | Fast with index |
| List all | `Intent.objects.all()` | Full scan (small table) |

### Validation Logic (Optional)

```
Intent Name Validation:

1. Check not empty
   └── len(intent_name.strip()) > 0

2. Check uppercase
   └── intent_name == intent_name.upper()

3. Check pattern
   └── Matches: ^[A-Z][A-Z0-9_]*$

4. Check uniqueness
   └── No other intent with same name

5. Check length
   └── len(intent_name) <= 50
```

### API Usage Patterns

| Operation | Endpoint | Method |
|-----------|----------|--------|
| List intents | `/api/chatbot/intents/` | GET |
| Get intent | `/api/chatbot/intents/{intent_name}/` | GET |
| Create intent | `/api/chatbot/intents/` | POST |
| Update phrases | `/api/chatbot/intents/{intent_name}/` | PATCH |

### Expected Outcome
- intent_name field added to Intent model
- Field is unique to prevent duplicate intents
- Maximum length set to 50 characters
- Field is required and cannot be empty
- Naming convention documented (UPPERCASE_SNAKE_CASE)

### Verification Checklist
- [ ] intent_name field added to Intent model
- [ ] Field type is CharField
- [ ] max_length=50 configured
- [ ] unique=True constraint applied
- [ ] null=False and blank=False (required)
- [ ] help_text added with naming convention
- [ ] __str__ method returns intent_name

---

## Task 14: Create training_phrases Field

### Overview
Add the training_phrases field to the Intent model to store a list of example phrases that represent each intent. This field uses Django's JSONField to store an array of strings, enabling flexible training data management for intent classification without requiring a separate table for phrases.

### Dependencies
- Task 12: Create Intent Model

### Instructions

1. **Import JSONField**
   - Ensure Django's JSONField is imported
   - Available in django.db.models from Django 3.1+
   - For older versions, use django.contrib.postgres.fields

2. **Add training_phrases field**
   - Add JSONField to Intent model
   - Set field name as `training_phrases`
   - Configure for array storage

3. **Configure field properties**
   - Set `default=list` to initialize as empty array
   - Mark as required (no null/blank by default)
   - No max_length (JSON has no fixed size)

4. **Add field documentation**
   - Include help_text describing structure
   - Document that it stores array of strings
   - Example: "List of example phrases for this intent"

5. **Plan data structure**
   - Store as JSON array of strings
   - Each string is a training example
   - Format: `["phrase 1", "phrase 2", "phrase 3"]`

6. **Consider phrase management**
   - Add phrases via admin interface
   - Update through API endpoints
   - Validate that array contains only strings

7. **Plan for multilingual support (future)**
   - Current: English phrases only
   - Future: Consider adding language codes
   - Potential structure: `{"en": [...], "si": [...]}`

### Field Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Type | JSONField | Flexible array storage |
| Default | list (empty array) | Initialize with no phrases |
| Null | False | Training phrases always present |
| Blank | False | Cannot be empty array |
| Structure | Array of strings | Simple, efficient format |

### JSON Data Structure

```json
{
  "training_phrases": [
    "Where is my order?",
    "Track my order",
    "Order status",
    "What's the status of order #123",
    "Is my order shipped?"
  ]
}
```

### Training Phrases by Intent

| Intent | Example Phrases |
|--------|----------------|
| ORDER_STATUS | "Where is my order?", "Track order", "Order status" |
| PRODUCT_INFO | "Tell me about this", "Product details", "What is this" |
| RETURNS | "How to return", "Return policy", "I want a refund" |
| SHIPPING | "Shipping cost?", "Delivery time", "Free shipping?" |
| STORE_INFO | "Store hours", "Where are you located", "Contact info" |
| GREETING | "Hello", "Hi", "Hey there", "Good morning" |
| FAREWELL | "Goodbye", "Bye", "Thanks", "See you" |
| ESCALATE | "Talk to human", "Agent please", "I need help" |

### Phrase Quality Guidelines

| Guideline | Description | Example |
|-----------|-------------|---------|
| Variety | Different ways to express same intent | "Track order" vs "Where is my order?" |
| Conciseness | Keep phrases realistic and brief | "Order status" not "I would like to inquire..." |
| Natural | Use conversational language | "How much is shipping?" not "shipping cost query" |
| Coverage | Include common variations | "Hi", "Hello", "Hey" for GREETING |

### Phrase Count Recommendations

| Intent Type | Min Phrases | Ideal Phrases | Max Phrases |
|------------|-------------|---------------|-------------|
| High Priority | 10 | 20-30 | 50 |
| Medium Priority | 5 | 10-15 | 30 |
| Low Priority | 3 | 5-10 | 20 |

### JSONField Querying (PostgreSQL)

| Query Purpose | Approach |
|---------------|----------|
| Contains phrase | `training_phrases__contains=["phrase"]` |
| Array length | `JSONField lookups available` |
| Get all phrases | Direct field access |
| Update phrases | Standard Django update |

### Data Management Operations

```
Add Training Phrase:
├── Load intent record
├── Append to training_phrases array
├── Save model
└── Re-train classifier (if needed)

Update Training Phrases:
├── Load intent record
├── Replace entire array
├── Save model
└── Re-train classifier

Remove Training Phrase:
├── Load intent record
├── Filter out from array
├── Save model
└── Re-train classifier
```

### Sample Training Data Structure

```python
# Example Intent records with training phrases
{
    "intent_name": "ORDER_STATUS",
    "training_phrases": [
        "Where is my order?",
        "Track my order",
        "Order status",
        "What's the status of order #123",
        "Is my order shipped?",
        "Has my order been dispatched?",
        "When will my order arrive?",
        "Check order tracking",
        "Order delivery status",
        "Track shipment"
    ]
}
```

### Multilingual Future Structure (Concept)

```json
{
  "training_phrases": {
    "en": ["Where is my order?", "Track order"],
    "si": ["මගේ ඇණවුම කොහෙද?"],
    "ta": ["எனது ஆர்டர் எங்கே?"]
  }
}
```

### Validation Considerations

| Rule | Check | Error |
|------|-------|-------|
| Type | Must be array | "training_phrases must be a list" |
| Content | All items are strings | "All phrases must be strings" |
| Non-empty | Array has at least one phrase | "At least one phrase required" |
| Duplicates | No duplicate phrases | "Duplicate phrases detected" |

### Expected Outcome
- training_phrases field added to Intent model
- Field stores JSON array of strings
- Default value is empty array
- Field is required and cannot be null
- Ready to store training examples for intent classification

### Verification Checklist
- [ ] training_phrases field added to Intent model
- [ ] Field type is JSONField
- [ ] default=list configured for empty array
- [ ] null=False (required)
- [ ] help_text added describing array structure
- [ ] JSONField imported correctly
- [ ] Field can store array of strings

---

## Task 15: Create Chatbot Migrations

### Overview
Generate and apply Django migrations for all chatbot models created in previous tasks. This process translates the Python model definitions into database schema changes, creating tables, fields, indexes, and constraints for the Conversation, Message, and Intent models.

### Dependencies
- Task 01-14: All model fields must be complete
- PostgreSQL database must be running
- Django project must be configured

### Instructions

1. **Verify model completion**
   - Ensure Conversation model has all fields (01-06)
   - Ensure Message model has all fields (07-11)
   - Ensure Intent model has all fields (12-14)
   - Check all imports are correct

2. **Update models __init__.py**
   - Open `backend/apps/chatbot/models/__init__.py`
   - Import all three models
   - Export in __all__ list

3. **Check chatbot app registration**
   - Verify chatbot app is in INSTALLED_APPS
   - Ensure app config is properly set up
   - Check app is in correct Django project

4. **Run makemigrations command**
   - Open terminal in backend directory
   - Run Django makemigrations command
   - Specify app name: chatbot
   - Review generated migration file

5. **Review migration file**
   - Check all models are included
   - Verify all fields are present
   - Confirm indexes are created
   - Review constraints (unique, foreign keys)

6. **Run migrate command**
   - Execute Django migrate command
   - Apply migrations to database
   - Verify no errors occur
   - Confirm tables are created

7. **Verify database schema**
   - Connect to PostgreSQL database
   - Check tables exist in tenant schema
   - Verify columns and data types
   - Confirm indexes and constraints

### Migration Process Flow

```
Model Definitions
     │
     ▼
┌──────────────────────┐
│  makemigrations      │
│  Generate migration  │
│  files               │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Review Migration    │
│  Check operations    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  migrate             │
│  Apply to database   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Verify Tables       │
│  Confirm schema      │
└──────────────────────┘
```

### Models __init__.py Structure

```python
# backend/apps/chatbot/models/__init__.py
from .conversation import Conversation
from .message import Message
from .intent import Intent

__all__ = ['Conversation', 'Message', 'Intent']
```

### Expected Migration Operations

| Model | Operations | Count |
|-------|-----------|-------|
| Conversation | Create model, add fields, add indexes | 8 ops |
| Message | Create model, add fields, add FK, add indexes | 7 ops |
| Intent | Create model, add fields, add unique | 4 ops |

### Database Tables Created

| Model | Table Name | Columns |
|-------|-----------|---------|
| Conversation | chatbot_conversation | id, session_id, customer_id, status, started_at, ended_at, created_at, updated_at |
| Message | chatbot_message | id, conversation_id, role, content, timestamp, created_at, updated_at |
| Intent | chatbot_intent | id, intent_name, training_phrases, created_at, updated_at |

### Migration File Structure

```
backend/apps/chatbot/migrations/
├── __init__.py
└── 0001_initial.py     # Generated migration
```

### Indexes Created

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| chatbot_conversation | session_id_idx | session_id | Session lookup |
| chatbot_conversation | customer_id_idx | customer_id | Customer queries |
| chatbot_conversation | status_idx | status | Status filtering |
| chatbot_conversation | started_at_idx | started_at | Time queries |
| chatbot_message | conversation_id_idx | conversation_id | Message retrieval |
| chatbot_message | timestamp_idx | timestamp | Message ordering |
| chatbot_intent | intent_name_unique | intent_name | Unique constraint |

### Foreign Key Constraints

| From Table | To Table | On Delete | Constraint Name |
|-----------|----------|-----------|-----------------|
| chatbot_conversation | customers_customer | SET_NULL | conversation_customer_fk |
| chatbot_message | chatbot_conversation | CASCADE | message_conversation_fk |

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Schema Routing | Models respect tenant schema |
| Public Schema | Intents may be in public schema |
| Tenant Schema | Conversations and Messages in tenant |
| Migration Application | Applied to all tenant schemas |

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "No changes detected" | Models not saved | Save model files |
| Import error | Incorrect import path | Check model imports |
| FK constraint error | Referenced model missing | Create dependency models first |
| JSONField error | PostgreSQL not configured | Ensure using PostgreSQL |

### Verification Queries

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'tenant_schema_name'
AND table_name LIKE 'chatbot_%';

-- Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'chatbot_conversation';

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename LIKE 'chatbot_%';

-- Check foreign keys
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name LIKE 'chatbot_%';
```

### Expected Outcome
- Migration file generated successfully
- All three models included in migration
- Database tables created with correct schema
- Indexes and constraints applied
- Multi-tenancy support working

### Verification Checklist
- [ ] All model files saved with complete fields
- [ ] models/__init__.py imports all models
- [ ] makemigrations command executed successfully
- [ ] Migration file reviewed and looks correct
- [ ] migrate command executed without errors
- [ ] Database tables exist (verify with SQL)
- [ ] Indexes created on appropriate fields
- [ ] Foreign keys and constraints working
- [ ] No migration warnings or errors

---

## Task 16: Verify Models

### Overview
Perform comprehensive verification of all chatbot models to ensure they are correctly configured, functional, and ready for use. This includes testing model creation, field validation, relationships, and basic CRUD operations through Django shell or admin interface.

### Dependencies
- Task 15: Create Chatbot Migrations must be complete
- Database migrations must be applied
- All models must be registered in admin (optional but recommended)

### Instructions

1. **Register models in admin**
   - Open or create `admin.py` in chatbot app
   - Import all three models
   - Register each model with ModelAdmin
   - Customize list_display for better visibility

2. **Test Conversation model**
   - Open Django shell
   - Create test Conversation instance
   - Verify session_id auto-generation
   - Check started_at auto-population
   - Test status choices

3. **Test Message model**
   - Create test Message instances
   - Link to test Conversation
   - Verify role choices
   - Check timestamp auto-population
   - Test content storage

4. **Test Intent model**
   - Create test Intent instances
   - Set intent_name and training_phrases
   - Verify uniqueness constraint
   - Check JSONField storage

5. **Test relationships**
   - Access messages from Conversation
   - Test reverse relationship (conversation.messages)
   - Verify CASCADE delete behavior
   - Test customer FK (SET_NULL)

6. **Test queries**
   - Filter conversations by status
   - Order messages by timestamp
   - Query intents by name
   - Test complex queries with joins

7. **Verify admin interface**
   - Access Django admin
   - View model list pages
   - Create records through admin
   - Edit existing records
   - Delete records and check constraints

8. **Document any issues**
   - Note any unexpected behavior
   - Document workarounds if needed
   - Report bugs to be fixed

### Admin Registration

```python
# backend/apps/chatbot/admin.py structure
from django.contrib import admin
from .models import Conversation, Message, Intent

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'customer', 'status', 'started_at']
    list_filter = ['status', 'started_at']
    search_fields = ['session_id', 'customer__email']
    
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'role', 'content_preview', 'timestamp']
    list_filter = ['role', 'timestamp']
    
@admin.register(Intent)
class IntentAdmin(admin.ModelAdmin):
    list_display = ['intent_name', 'phrase_count']
    search_fields = ['intent_name']
```

### Test Conversation Creation

```
Test Steps:
1. Create Conversation without customer (guest)
   └── Verify session_id generated
   └── Check status defaults to 'active'
   └── Confirm started_at populated

2. Create Conversation with customer
   └── Assign customer FK
   └── Verify relationship works

3. Update status to 'resolved'
   └── Set ended_at manually
   └── Verify status change

4. Test status choices
   └── Try each status value
   └── Confirm choices validation
```

### Test Message Creation

```
Test Steps:
1. Create Message with role='user'
   └── Link to Conversation
   └── Set content
   └── Verify timestamp auto-set

2. Create Message with role='assistant'
   └── Verify role choices work

3. Test content length
   └── Create message with various lengths
   └── Test maximum length validation

4. Test message ordering
   └── Create multiple messages
   └── Retrieve and verify chronological order
```

### Test Intent Creation

```
Test Steps:
1. Create Intent with training phrases
   └── Set intent_name
   └── Add array of phrases
   └── Verify JSON storage

2. Test unique constraint
   └── Try creating duplicate intent_name
   └── Confirm uniqueness enforced

3. Update training phrases
   └── Modify phrase array
   └── Save and verify changes

4. Retrieve and query intents
   └── Filter by intent_name
   └── List all intents
```

### Relationship Testing

| Test | Expected Result |
|------|-----------------|
| conversation.messages.all() | Returns all messages for conversation |
| conversation.messages.count() | Returns message count |
| conversation.messages.filter(role='user') | Returns only user messages |
| Delete conversation | Messages cascade deleted |
| Delete customer | conversation.customer set to NULL |

### Query Testing Matrix

| Query Type | Test Case | Expected Result |
|-----------|-----------|-----------------|
| Filter | Get active conversations | Only status='active' |
| Order | Messages by timestamp | Chronological order |
| Join | Conversations with customer name | Proper FK join |
| Aggregate | Count messages per conversation | Correct counts |
| Date Range | Conversations today | Filtered by started_at |

### Admin Interface Verification

| Feature | Test Action | Expected Behavior |
|---------|-------------|-------------------|
| List View | View Conversation list | Shows all fields correctly |
| Search | Search by session_id | Finds matching records |
| Filter | Filter by status | Narrows results |
| Create | Add new Conversation | Saves successfully |
| Edit | Modify existing record | Updates saved |
| Delete | Remove record | Cascade works correctly |

### Common Verification Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing __str__ | Object repr unclear | Add __str__ method |
| No ordering | Random order in queries | Set Meta.ordering |
| Slow queries | Admin page slow | Add db_index to fields |
| Cascade issues | Can't delete | Check on_delete settings |

### Django Shell Test Commands (Conceptual)

```
# Import models
from chatbot.models import Conversation, Message, Intent

# Create conversation
conv = Conversation.objects.create(status='active')

# Check fields
conv.session_id  # Should be UUID
conv.started_at  # Should be timestamp
conv.status      # Should be 'active'

# Create message
msg = Message.objects.create(
    conversation=conv,
    role='user',
    content='Hello!'
)

# Access reverse relationship
conv.messages.all()

# Create intent
intent = Intent.objects.create(
    intent_name='GREETING',
    training_phrases=['Hello', 'Hi', 'Hey']
)
```

### Performance Verification

| Test | Metric | Acceptable Range |
|------|--------|------------------|
| Create Conversation | Time | < 50ms |
| Query Messages | Time | < 100ms (1000 msgs) |
| Filter by Status | Time | < 50ms |
| Admin List View | Load Time | < 2s |

### Data Integrity Checks

| Check | SQL Query Approach |
|-------|-------------------|
| Orphaned Messages | Check messages without conversation |
| Invalid Status | Check status not in choices |
| Invalid Role | Check role not in choices |
| Null Required Fields | Check for unexpected NULLs |

### Expected Outcome
- All models create and save successfully
- Field validation works as expected
- Relationships function correctly
- Admin interface displays models properly
- No errors in basic CRUD operations
- Models ready for API integration

### Verification Checklist
- [ ] Admin registration complete for all models
- [ ] Conversation model tested (create, read, update)
- [ ] Message model tested (create, read, update)
- [ ] Intent model tested (create, read, update)
- [ ] session_id auto-generation verified
- [ ] timestamp auto-population verified
- [ ] Reverse relationships working (conversation.messages)
- [ ] CASCADE delete tested
- [ ] SET_NULL behavior verified
- [ ] Status choices validated
- [ ] Role choices validated
- [ ] Unique constraint on intent_name verified
- [ ] JSONField storing arrays correctly
- [ ] Admin interface functional
- [ ] No errors in model operations
- [ ] Models ready for next group

---

## Summary

This document completed the chatbot model implementation by creating the Intent model for intent classification training data, generating database migrations, and verifying all models are properly configured. The Intent model stores intent names and training phrases in JSON format, enabling flexible natural language understanding without complex database structures.

### Completed Tasks
12. ✓ Created Intent model for intent classification
13. ✓ Added intent_name unique field for intent identification
14. ✓ Added training_phrases JSONField for training data
15. ✓ Generated and applied Django migrations
16. ✓ Verified all models through testing and admin interface

### Models Created
- **Conversation:** Tracks chat sessions with UUID, customer, status, timestamps
- **Message:** Stores individual messages with role, content, timestamp
- **Intent:** Defines intents with names and training phrases

### Database Schema
- Three tables created with proper indexes
- Foreign keys with appropriate on_delete behaviors
- Unique constraints on session_id and intent_name
- JSONField support for training phrases

### Next Steps
Proceed to [Group-B_Intent-Classification](../Group-B_Intent-Classification/) to implement the intent classification service that uses the Intent model training data to classify user messages into intents, extract entities, and determine appropriate bot responses.

---

## Related Documentation

- **Previous Document:** [01_Tasks-01-11_Conversation-Message.md](01_Tasks-01-11_Conversation-Message.md)
- **Group Overview:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **SubPhase Overview:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **Next Group:** [Group-B_Intent-Classification](../Group-B_Intent-Classification/)
