# Tasks 10-16: Interaction Model and Migration

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** A - Recommendation Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_Setup-Recommendation-Model.md](01_Tasks-01-09_Setup-Recommendation-Model.md)
- **→ Next Group:** [Group-B_Frequently-Bought-Together](../Group-B_Frequently-Bought-Together/)

---

## Document Overview

This document covers the creation of the UserProductInteraction model for tracking user behavior, its associated fields, database migrations, and model verification. The UserProductInteraction model is essential for capturing user actions (views, cart additions, purchases) that drive personalized recommendations and analytics.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create UserProductInteraction Model | Medium | 30 min |
| 11 | Create interaction_type Field | Low | 15 min |
| 12 | Create customer FK | Low | 15 min |
| 13 | Create product FK | Low | 15 min |
| 14 | Create timestamp Field | Low | 10 min |
| 15 | Create Recommendation Migrations | Low | 20 min |
| 16 | Verify Models | Low | 25 min |

---

## Task 10: Create UserProductInteraction Model

### Overview
Create the UserProductInteraction model to track all user interactions with products across the platform. This model captures behavioral data that powers personalized recommendations, analytics, and customer insights. It records every significant user action—views, cart additions, and purchases—creating a comprehensive history of user-product relationships.

### Dependencies
- Task 03: Create Recommendation Model (completed in previous document)
- Product model exists in inventory app
- Customer model exists in customers app
- Django project structure is established

### Instructions

1. **Navigate to the models directory**
   - Go to `backend/apps/ai/recommendations/models/`
   - Create new file named `user_interaction.py`
   - This file will contain the UserProductInteraction model

2. **Import required dependencies**
   - Import Django model base classes and fields
   - Import Customer model from customers app
   - Import Product model from inventory app
   - Import timezone utilities for timestamp handling
   - Import any multi-tenancy mixins if applicable

3. **Define the UserProductInteraction model class**
   - Create class that inherits from appropriate base model
   - Name it `UserProductInteraction` following Django conventions
   - Add docstring explaining the model's purpose

4. **Plan the model structure**
   - Identify fields needed: interaction_type, customer, product, timestamp
   - Determine which fields are nullable (customer for anonymous users)
   - Consider indexing strategy for query performance
   - Plan unique constraints if needed

5. **Add Meta class configuration**
   - Set `db_table` to appropriate name (e.g., 'ai_user_product_interactions')
   - Configure `ordering` to show most recent interactions first
   - Add `verbose_name` and `verbose_name_plural` for admin interface
   - Define `indexes` for frequently queried fields

6. **Configure database indexes**
   - Create composite index on customer and product fields
   - Index timestamp field for temporal queries
   - Index interaction_type for filtering by action type
   - Consider partial indexes for specific interaction types

7. **Add model methods**
   - Create `__str__` method returning meaningful string representation
   - Add property method to calculate interaction weight based on type
   - Create method to get related interactions for the same product
   - Add method to count interactions by type

8. **Configure manager and querysets**
   - Consider custom manager for common query patterns
   - Add methods for filtering by date range
   - Create methods for aggregating interaction counts
   - Add helper methods for anonymous vs authenticated interactions

9. **Update package imports**
   - Open `backend/apps/ai/recommendations/models/__init__.py`
   - Import UserProductInteraction model
   - Add to `__all__` list for clean imports

### Model Purpose and Context

| Aspect | Details |
|--------|---------|
| Primary Function | Track all user-product interactions |
| Data Captured | Views, cart additions, purchases |
| Anonymous Support | Yes, customer FK is nullable |
| Performance | Indexed for fast queries by customer/product |

### Interaction Tracking Flow

```
User Action on Product
        │
        ├─ Is user authenticated?
        │   ├─ Yes → Link to Customer
        │   └─ No → Store as anonymous (customer = null)
        │
        ├─ Determine interaction type
        │   ├─ Product view → VIEW (weight: 1)
        │   ├─ Add to cart → CART (weight: 3)
        │   └─ Purchase → PURCHASE (weight: 5)
        │
        └─ Create UserProductInteraction record
            ├─ Store timestamp
            ├─ Link to product
            └─ Save to database
                │
                └─ Used by recommendation algorithms
```

### Data Relationships

```
┌─────────────────────────────────────┐
│     UserProductInteraction          │
│─────────────────────────────────────│
│ • interaction_type (Task 11)        │
│ • customer FK (Task 12)             │
│ • product FK (Task 13)              │
│ • timestamp (Task 14)               │
│                                     │
│ Indexes:                            │
│ - (customer, product)               │
│ - timestamp                         │
│ - interaction_type                  │
└─────────────────────────────────────┘
        │               │
        │               └─────────────┐
        ▼                             ▼
┌──────────────┐              ┌──────────────┐
│   Customer   │              │   Product    │
│──────────────│              │──────────────│
│ (nullable)   │              │ (required)   │
└──────────────┘              └──────────────┘
```

### Expected Outcome
- UserProductInteraction model class created
- Model properly inherits from base classes
- Meta configuration includes indexes and ordering
- Model methods provide useful functionality
- Package imports updated

### Verification Checklist
- [ ] `user_interaction.py` file created in models directory
- [ ] UserProductInteraction class defined with docstring
- [ ] Meta class includes db_table, ordering, and verbose names
- [ ] Indexes defined for performance optimization
- [ ] `__str__` method returns meaningful representation
- [ ] Model imported in `__init__.py`

---

## Task 11: Create interaction_type Field

### Overview
Add the interaction_type field to distinguish between different user actions. This field uses a choice-based system with three types: VIEW (weight 1), CART (weight 3), and PURCHASE (weight 5). The weights reflect the strength of user interest, with purchases indicating the strongest intent and views the weakest.

### Dependencies
- Task 10: Create UserProductInteraction Model

### Instructions

1. **Define interaction type choices**
   - Create a choices class or tuple within the model
   - Define three types: VIEW, CART, PURCHASE
   - Use uppercase constants for choice values
   - Provide human-readable labels for each type

2. **Add the interaction_type field**
   - Add CharField to UserProductInteraction model
   - Set max_length to accommodate longest choice value
   - Apply choices parameter with defined options
   - Make field required (no null or blank)

3. **Configure field constraints**
   - Set db_index to True for query performance
   - Add help_text explaining the field purpose
   - Consider default value if appropriate
   - Ensure choice values are database-friendly

4. **Document weight system**
   - Add comments explaining weight values
   - VIEW: weight 1 (low interest signal)
   - CART: weight 3 (moderate interest signal)
   - PURCHASE: weight 5 (high interest signal)
   - Weights used in recommendation scoring

5. **Add validation logic**
   - Consider clean method to validate interaction types
   - Ensure only valid choices are stored
   - Handle edge cases appropriately

6. **Create helper methods**
   - Add method to get interaction weight
   - Create class method to list all interaction types
   - Add method to get human-readable label
   - Consider method for filtering by type

### Interaction Type Details

| Type | Database Value | Weight | User Action | Signal Strength |
|------|---------------|--------|-------------|-----------------|
| VIEW | 'VIEW' | 1 | User viewed product page | Low interest |
| CART | 'CART' | 3 | User added to cart | Moderate interest |
| PURCHASE | 'PURCHASE' | 5 | User completed purchase | High interest |

### Weight System Purpose

```
Recommendation Scoring Algorithm
    │
    ├─ Collect all user interactions
    │   │
    │   ├─ 10 product views (10 × 1 = 10 points)
    │   ├─ 2 cart additions (2 × 3 = 6 points)
    │   └─ 1 purchase (1 × 5 = 5 points)
    │
    └─ Calculate total engagement: 21 points
        │
        └─ Use in personalization algorithms
            ├─ Collaborative filtering
            ├─ Product similarity matching
            └─ Trending calculations
```

### Field Usage Example

| Scenario | Type Selected | Impact |
|----------|--------------|--------|
| Customer browses product | VIEW | Records casual interest |
| Customer adds to cart | CART | Shows purchase consideration |
| Customer completes order | PURCHASE | Confirms strong preference |
| Multiple views same product | VIEW × N | Accumulates interest score |

### Expected Outcome
- interaction_type field added to model
- Three interaction types defined with choices
- Field indexed for performance
- Weight system documented
- Helper methods created

### Verification Checklist
- [ ] interaction_type CharField added to model
- [ ] Choices defined: VIEW, CART, PURCHASE
- [ ] Field is indexed (db_index=True)
- [ ] max_length sufficient for all choices
- [ ] help_text explains field purpose
- [ ] Weight values documented in comments

---

## Task 12: Create customer FK

### Overview
Add the customer foreign key field to link interactions with registered users. This field is nullable to support anonymous user tracking—a crucial feature for capturing behavioral data from visitors who haven't logged in or registered yet. Anonymous interactions can later be merged with customer data after registration or login.

### Dependencies
- Task 10: Create UserProductInteraction Model
- Customer model exists in customers app

### Instructions

1. **Import Customer model**
   - Add import statement for Customer model
   - Import from appropriate customers app location
   - Ensure proper module path for multi-tenancy

2. **Add customer foreign key field**
   - Add ForeignKey field named `customer`
   - Point to Customer model
   - Set null=True to allow anonymous interactions
   - Set blank=True for form validation

3. **Configure on_delete behavior**
   - Set on_delete parameter appropriately
   - Consider CASCADE to remove interactions if customer deleted
   - Alternative: SET_NULL to preserve historical data
   - Choose based on data retention requirements

4. **Set related_name**
   - Configure related_name for reverse lookups
   - Name it `product_interactions` or similar
   - Allows querying interactions from Customer model
   - Ensure name doesn't conflict with existing relations

5. **Add database indexing**
   - Set db_index=True for performance
   - Customer field frequently used in queries
   - Supports filtering by authenticated users
   - Improves query performance significantly

6. **Add validation logic**
   - Consider validators for customer field
   - Handle cases where customer is None (anonymous)
   - Add methods to check if interaction is anonymous
   - Create property for is_authenticated

7. **Document anonymous user handling**
   - Add docstring explaining nullable behavior
   - Explain when customer is None vs populated
   - Document strategy for merging anonymous data
   - Add comments about session tracking

8. **Create helper methods**
   - Add `is_anonymous` property returning boolean
   - Create method to assign customer to anonymous interactions
   - Add method to merge interactions after login
   - Consider batch update methods

### Customer FK Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | ForeignKey | Links to Customer model |
| To | Customer | Target model |
| null | True | Supports anonymous users |
| blank | True | Optional in forms |
| on_delete | CASCADE/SET_NULL | Data retention strategy |
| related_name | product_interactions | Reverse query access |
| db_index | True | Query performance |

### Anonymous vs Authenticated Flow

```
User Interaction
    │
    ├─ Check if user is authenticated
    │
    ├─ AUTHENTICATED USER
    │   │
    │   ├─ Get customer from session/token
    │   ├─ Set customer FK in interaction
    │   └─ Save with customer link
    │       │
    │       └─ Direct personalization possible
    │
    └─ ANONYMOUS USER
        │
        ├─ customer = None
        ├─ Track by session ID (separate mechanism)
        └─ Save without customer link
            │
            └─ After login/registration:
                ├─ Match interactions by session
                ├─ Update customer FK
                └─ Merge into user profile
```

### Query Patterns

| Query Type | Example Use Case | Method |
|------------|------------------|--------|
| Authenticated only | User's purchase history | `filter(customer__isnull=False)` |
| Anonymous only | Visitor behavior analysis | `filter(customer__isnull=True)` |
| Specific customer | Personal recommendations | `filter(customer=customer_obj)` |
| Customer's products | Product engagement | `customer.product_interactions.all()` |

### Expected Outcome
- customer ForeignKey field added to model
- Field allows null values for anonymous tracking
- Proper on_delete behavior configured
- related_name set for reverse queries
- Helper methods for anonymous handling

### Verification Checklist
- [ ] customer ForeignKey field added
- [ ] null=True and blank=True set
- [ ] on_delete behavior configured
- [ ] related_name set to 'product_interactions'
- [ ] db_index=True for performance
- [ ] is_anonymous property or method created

---

## Task 13: Create product FK

### Overview
Add the product foreign key field to link interactions with specific products. Unlike the customer field, this field is required—every interaction must be associated with a product. The on_delete behavior is set to CASCADE, meaning interactions are automatically deleted when the related product is removed from the system.

### Dependencies
- Task 10: Create UserProductInteraction Model
- Product model exists in inventory app

### Instructions

1. **Import Product model**
   - Add import statement for Product model
   - Import from inventory app location
   - Ensure proper module path for multi-tenancy

2. **Add product foreign key field**
   - Add ForeignKey field named `product`
   - Point to Product model
   - Field is required (null=False, blank=False)
   - Every interaction must have associated product

3. **Configure CASCADE deletion**
   - Set on_delete=CASCADE
   - Automatically delete interactions when product deleted
   - Maintains referential integrity
   - Prevents orphaned interaction records

4. **Set related_name**
   - Configure related_name for reverse lookups
   - Name it `user_interactions` or similar
   - Allows querying interactions from Product model
   - Useful for product analytics and trending calculations

5. **Add database indexing**
   - Set db_index=True for performance
   - Product field used in frequent queries
   - Supports filtering by specific products
   - Critical for recommendation generation

6. **Create composite index**
   - Add composite index on (product, timestamp)
   - Supports temporal product analysis
   - Improves trending product queries
   - Enhances date-range filtering performance

7. **Add validation logic**
   - Ensure product exists before saving
   - Validate product is active/available
   - Handle soft-deleted products appropriately
   - Consider tenant isolation in multi-tenancy

8. **Create analytical methods**
   - Add method to count interactions for product
   - Create method to get interaction distribution by type
   - Add method for recent interactions
   - Consider aggregation methods for analytics

### Product FK Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | ForeignKey | Links to Product model |
| To | Product | Target model |
| null | False | Every interaction needs product |
| blank | False | Required in forms |
| on_delete | CASCADE | Clean up on product deletion |
| related_name | user_interactions | Reverse query access |
| db_index | True | Query performance |

### CASCADE Behavior

```
Product Deletion Event
    │
    ├─ Product marked for deletion
    │   │
    │   └─ Trigger: product.delete()
    │
    ├─ Find all UserProductInteraction records
    │   │
    │   └─ Filter: product=deleted_product
    │
    ├─ Delete all related interactions
    │   │
    │   ├─ Interaction 1 (VIEW)
    │   ├─ Interaction 2 (CART)
    │   ├─ Interaction 3 (PURCHASE)
    │   └─ ... (all related records)
    │
    └─ Complete product deletion
        │
        └─ No orphaned interaction records
```

### Composite Index Strategy

| Index | Fields | Purpose |
|-------|--------|---------|
| Single | product | General product queries |
| Single | (customer, product) | User-specific product interactions |
| Composite | (product, timestamp) | Trending analysis |
| Composite | (product, interaction_type) | Conversion funnel analysis |

### Product Analytics Use Cases

```
Product Analytics Dashboard
    │
    ├─ Total Views
    │   └─ Count: filter(product=p, interaction_type='VIEW')
    │
    ├─ Cart Additions
    │   └─ Count: filter(product=p, interaction_type='CART')
    │
    ├─ Purchases
    │   └─ Count: filter(product=p, interaction_type='PURCHASE')
    │
    ├─ Conversion Rate
    │   └─ (Purchases / Views) × 100
    │
    ├─ Trending Score
    │   └─ Recent interactions weighted by time
    │
    └─ Popular Time Ranges
        └─ Group by hour/day/week
```

### Expected Outcome
- product ForeignKey field added to model
- Field is required (not nullable)
- CASCADE on_delete configured
- related_name set for product analytics
- Composite indexes for performance

### Verification Checklist
- [ ] product ForeignKey field added
- [ ] null=False and blank=False (required)
- [ ] on_delete=CASCADE configured
- [ ] related_name set to 'user_interactions'
- [ ] db_index=True for performance
- [ ] Composite index on (product, timestamp) added

---

## Task 14: Create timestamp Field

### Overview
Add the timestamp field to record when each interaction occurred. This field automatically captures the exact date and time of user actions, enabling temporal analysis, trending calculations, and time-series recommendations. The field is crucial for understanding user behavior patterns and calculating recency in recommendation algorithms.

### Dependencies
- Task 10: Create UserProductInteraction Model

### Instructions

1. **Import timezone utilities**
   - Import timezone functions from Django
   - Ensure proper timezone handling
   - Use timezone-aware datetimes
   - Consider project timezone settings

2. **Add timestamp field**
   - Add DateTimeField named `timestamp`
   - Set auto_now_add=True for automatic timestamp
   - Captures creation time automatically
   - Cannot be manually edited after creation

3. **Configure field constraints**
   - Set editable=False to prevent manual changes
   - Add db_index=True for temporal queries
   - Consider verbose_name for admin interface
   - Add help_text explaining auto-capture behavior

4. **Understand auto_now_add behavior**
   - Timestamp set only on creation
   - Value never changes after initial save
   - Different from auto_now (updates on every save)
   - Provides accurate historical record

5. **Add date range query methods**
   - Create method to filter interactions by date range
   - Add method for last N days interactions
   - Create method for specific time periods
   - Consider timezone conversion methods

6. **Create temporal analysis helpers**
   - Add method to group interactions by hour
   - Create method to group by day/week/month
   - Add method to calculate interaction age
   - Consider recency scoring method

7. **Configure Meta ordering**
   - Set default ordering to most recent first
   - Use `-timestamp` in Meta.ordering
   - Ensures newest interactions appear first
   - Improves user experience in admin

8. **Add display formatting**
   - Create method for human-readable timestamp
   - Add property for time since interaction
   - Consider localization for different regions
   - Format for Sri Lankan timezone (Asia/Colombo)

### Timestamp Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DateTimeField | Date and time precision |
| auto_now_add | True | Automatic on creation |
| editable | False | Prevent manual changes |
| db_index | True | Query performance |
| verbose_name | 'Timestamp' | Admin display |

### Temporal Query Patterns

```
Time-Based Analysis
    │
    ├─ Recent Interactions (Last 24 hours)
    │   └─ filter(timestamp__gte=now - timedelta(days=1))
    │
    ├─ Last Week's Activity
    │   └─ filter(timestamp__gte=now - timedelta(days=7))
    │
    ├─ Monthly Trends
    │   └─ filter(timestamp__year=Y, timestamp__month=M)
    │
    ├─ Peak Activity Hours
    │   └─ Group by hour: timestamp.hour
    │
    └─ Recency Score
        └─ 1 / (1 + days_since_interaction)
```

### Trending Calculation Example

| Interaction Age | Recency Weight | Impact on Trending Score |
|-----------------|----------------|--------------------------|
| < 1 hour | 1.0 | Full weight |
| 1-24 hours | 0.8 | High weight |
| 1-7 days | 0.5 | Medium weight |
| 7-30 days | 0.2 | Low weight |
| > 30 days | 0.05 | Minimal weight |

### Time-Series Analysis Flow

```
Recommendation Algorithm
    │
    ├─ Collect user interactions
    │   │
    │   └─ Order by timestamp DESC
    │
    ├─ Apply recency decay
    │   │
    │   ├─ Recent interactions: high weight
    │   ├─ Old interactions: low weight
    │   └─ Formula: weight × e^(-λ × days)
    │
    ├─ Group by time windows
    │   │
    │   ├─ Last 24 hours (real-time trends)
    │   ├─ Last 7 days (weekly patterns)
    │   └─ Last 30 days (monthly trends)
    │
    └─ Calculate trending scores
        │
        ├─ Sum weighted interactions
        ├─ Normalize by product visibility
        └─ Rank products by score
```

### Expected Outcome
- timestamp DateTimeField added to model
- auto_now_add=True for automatic capture
- Field indexed for temporal queries
- Helper methods for date range filtering
- Model ordered by timestamp descending

### Verification Checklist
- [ ] timestamp DateTimeField added
- [ ] auto_now_add=True configured
- [ ] editable=False set
- [ ] db_index=True for performance
- [ ] Meta.ordering includes '-timestamp'
- [ ] Timezone-aware datetime used

---

## Task 15: Create Recommendation Migrations

### Overview
Generate and review database migrations for both the Recommendation model (from previous document) and the UserProductInteraction model. Migrations translate model definitions into database schema changes, creating tables, indexes, and constraints. This task ensures both models are properly registered in the database with optimal performance configurations.

### Dependencies
- Task 14: Create timestamp Field (all UserProductInteraction fields complete)
- Task 09: Create computed_at Field (Recommendation model complete from document 01)

### Instructions

1. **Verify model completeness**
   - Confirm Recommendation model has all fields from Tasks 03-09
   - Verify UserProductInteraction model has all fields from Tasks 10-14
   - Check that both models have Meta configurations
   - Ensure indexes are defined in Meta class

2. **Run migration check command**
   - Navigate to backend project directory
   - Check for pending migrations
   - Review detected model changes
   - Verify Django detects both models

3. **Generate migrations**
   - Run Django makemigrations command
   - Specify the recommendations app
   - Review generated migration file
   - Check migration dependencies

4. **Review migration file structure**
   - Open generated migration file in migrations directory
   - Verify CreateModel operations for both models
   - Check field definitions match model specifications
   - Confirm indexes are included

5. **Inspect Recommendation model migration**
   - Verify recommendation_type field with choices
   - Check source_product FK (nullable)
   - Confirm target_product FK (required)
   - Validate score field (FloatField)
   - Verify rank field (IntegerField)
   - Check computed_at field (DateTimeField)
   - Confirm unique_together constraint

6. **Inspect UserProductInteraction migration**
   - Verify interaction_type field with choices
   - Check customer FK (nullable)
   - Confirm product FK (required with CASCADE)
   - Validate timestamp field (auto_now_add)
   - Check all indexes are present

7. **Review index creation**
   - Verify composite index on (customer, product)
   - Check index on timestamp field
   - Confirm index on interaction_type
   - Validate product field index
   - Ensure Recommendation model indexes included

8. **Check migration dependencies**
   - Verify dependency on Product model migration
   - Check dependency on Customer model migration
   - Ensure proper migration order
   - Validate no circular dependencies

9. **Review SQL generated**
   - Use sqlmigrate command to preview SQL
   - Check CREATE TABLE statements
   - Verify index creation statements
   - Confirm constraint definitions

10. **Validate multi-tenancy compatibility**
    - Ensure migrations work with django-tenants
    - Check schema-based multi-tenancy support
    - Verify tenant isolation is maintained
    - Test migration in public schema if applicable

11. **Add migration documentation**
    - Add comments to migration file if needed
    - Document any custom operations
    - Note manual steps if required
    - Update migration strategy documentation

### Migration File Structure

```
migrations/
    │
    ├─ __init__.py
    ├─ 0001_initial.py (if first migration)
    │   │
    │   ├─ Dependencies: []
    │   └─ Creates: Initial app structure
    │
    └─ 000X_recommendation_user_interaction.py
        │
        ├─ Dependencies:
        │   ├─ Previous migration in app
        │   ├─ Product model migration
        │   └─ Customer model migration
        │
        └─ Operations:
            ├─ CreateModel: Recommendation
            │   ├─ Fields: all from Tasks 03-09
            │   ├─ Indexes: composite and single
            │   └─ Constraints: unique_together
            │
            └─ CreateModel: UserProductInteraction
                ├─ Fields: all from Tasks 10-14
                ├─ Indexes: customer+product, timestamp
                └─ Foreign Keys: customer, product
```

### Migration Operations Checklist

| Model | Fields | Indexes | Constraints | Foreign Keys |
|-------|--------|---------|-------------|--------------|
| Recommendation | 6 fields | 3+ indexes | unique_together | source_product, target_product |
| UserProductInteraction | 4 fields | 4+ indexes | None | customer, product |

### Database Schema Result

```
PostgreSQL Schema (per tenant)
    │
    ├─ Table: ai_recommendations
    │   │
    │   ├─ Columns:
    │   │   ├─ id (PK)
    │   │   ├─ recommendation_type (varchar, indexed)
    │   │   ├─ source_product_id (FK, nullable, indexed)
    │   │   ├─ target_product_id (FK, indexed)
    │   │   ├─ score (float)
    │   │   ├─ rank (integer)
    │   │   └─ computed_at (timestamp)
    │   │
    │   ├─ Indexes:
    │   │   ├─ PRIMARY KEY (id)
    │   │   ├─ INDEX (recommendation_type)
    │   │   ├─ INDEX (source_product_id)
    │   │   ├─ INDEX (target_product_id)
    │   │   └─ UNIQUE (type, source, target)
    │   │
    │   └─ Foreign Keys:
    │       ├─ source → inventory_products (SET_NULL)
    │       └─ target → inventory_products (CASCADE)
    │
    └─ Table: ai_user_product_interactions
        │
        ├─ Columns:
        │   ├─ id (PK)
        │   ├─ interaction_type (varchar, indexed)
        │   ├─ customer_id (FK, nullable, indexed)
        │   ├─ product_id (FK, indexed)
        │   └─ timestamp (timestamp, indexed)
        │
        ├─ Indexes:
        │   ├─ PRIMARY KEY (id)
        │   ├─ INDEX (interaction_type)
        │   ├─ INDEX (customer_id)
        │   ├─ INDEX (product_id)
        │   ├─ INDEX (timestamp)
        │   └─ COMPOSITE (customer_id, product_id)
        │
        └─ Foreign Keys:
            ├─ customer → customers_customer (CASCADE)
            └─ product → inventory_products (CASCADE)
```

### Expected Outcome
- Migration file generated successfully
- Both models included in single migration
- All fields, indexes, and constraints defined
- Dependencies properly configured
- SQL preview shows correct schema changes

### Verification Checklist
- [ ] Migration file created in migrations directory
- [ ] Recommendation model CreateModel operation present
- [ ] UserProductInteraction model CreateModel operation present
- [ ] All fields from both models included
- [ ] Indexes properly defined in migration
- [ ] Foreign key relationships correct
- [ ] unique_together constraint on Recommendation
- [ ] Migration dependencies validated
- [ ] SQL preview reviewed with sqlmigrate

---

## Task 16: Verify Models

### Overview
Thoroughly verify that both the Recommendation and UserProductInteraction models are correctly implemented, migrated, and functional. This task involves running migrations, testing model operations, validating relationships, checking data integrity, and ensuring performance optimization through proper indexing. Verification ensures the models are production-ready and integrated correctly with the existing system.

### Dependencies
- Task 15: Create Recommendation Migrations

### Instructions

1. **Apply database migrations**
   - Run Django migrate command
   - Apply migrations to development database
   - Check for migration errors
   - Verify migration success messages

2. **Test Recommendation model creation**
   - Access Django shell or create test script
   - Import Recommendation model
   - Create sample recommendation record
   - Verify all fields accept correct data types
   - Save and commit to database

3. **Test UserProductInteraction model creation**
   - Import UserProductInteraction model
   - Create sample interaction record
   - Test with authenticated customer
   - Test with anonymous user (customer=None)
   - Verify timestamp auto-populates

4. **Validate field constraints**
   - Test recommendation_type choices (both models)
   - Verify required fields reject null values
   - Test nullable fields accept None
   - Validate max_length constraints
   - Test float field ranges (score field)

5. **Test foreign key relationships**
   - Create interaction with valid product
   - Create interaction with valid customer
   - Test reverse relationship from Product
   - Test reverse relationship from Customer
   - Verify related_name works correctly

6. **Test CASCADE behavior**
   - Create test product with interactions
   - Delete the product
   - Verify interactions are automatically deleted
   - Confirm no orphaned records remain

7. **Test nullable customer field**
   - Create interaction without customer
   - Verify customer=None is accepted
   - Test is_anonymous property
   - Create interaction with customer
   - Test both scenarios work correctly

8. **Verify unique constraints**
   - Create recommendation with type, source, target
   - Attempt to create duplicate
   - Verify unique_together constraint works
   - Confirm appropriate error raised

9. **Test database indexes**
   - Use database inspection tools
   - Verify indexes exist on expected fields
   - Check composite index on (customer, product)
   - Confirm all indexes in Meta class are created
   - Test query performance with indexes

10. **Test model methods**
    - Test __str__ methods return correct strings
    - Verify custom properties work
    - Test helper methods function correctly
    - Validate manager methods if implemented

11. **Test ordering**
    - Query UserProductInteraction without order_by
    - Verify results ordered by timestamp DESC
    - Query Recommendation model
    - Check default ordering applied

12. **Validate data integrity**
    - Create multiple interactions for same product
    - Verify product analytics work
    - Create recommendations with different types
    - Test filtering by recommendation type

13. **Test multi-tenancy isolation**
    - If using django-tenants, test with multiple tenants
    - Verify tenant isolation works
    - Create interactions in different tenants
    - Confirm no cross-tenant data leakage

14. **Test admin interface**
    - Register models in Django admin (if not done)
    - Access admin panel
    - Verify models display correctly
    - Test CRUD operations through admin
    - Check list display and filters

15. **Performance testing**
    - Create bulk interactions (100+ records)
    - Test query performance with indexes
    - Measure query execution time
    - Verify indexes improve performance
    - Test aggregate queries

16. **Integration testing**
    - Test models work with existing Product model
    - Verify Customer model integration
    - Test with actual recommendation algorithms
    - Ensure models support required use cases

17. **Document test results**
    - Record successful verifications
    - Note any issues discovered
    - Document resolution steps
    - Update model documentation if needed

### Verification Test Cases

| Test Case | Expected Result | Verification Method |
|-----------|----------------|---------------------|
| Create Recommendation | Record saved successfully | Shell/test script |
| Create Interaction (authenticated) | Customer linked correctly | Shell/test script |
| Create Interaction (anonymous) | customer=None accepted | Shell/test script |
| Duplicate Recommendation | UniqueConstraint error | Shell/test script |
| Delete Product | CASCADE deletes interactions | Database query |
| Timestamp auto-populate | timestamp set automatically | Record inspection |
| Reverse relationship | product.user_interactions works | Shell query |
| Index existence | All indexes present | Database inspection |
| Query performance | Fast queries with indexes | Performance test |
| Multi-tenant isolation | No cross-tenant access | Tenant switching test |

### Model Integration Flow

```
Verification Process
    │
    ├─ PHASE 1: Migration Application
    │   │
    │   ├─ Run migrate command
    │   ├─ Check for errors
    │   └─ Verify tables created
    │
    ├─ PHASE 2: Model Creation Tests
    │   │
    │   ├─ Test Recommendation creation
    │   ├─ Test UserProductInteraction creation
    │   ├─ Test field validation
    │   └─ Test constraints
    │
    ├─ PHASE 3: Relationship Tests
    │   │
    │   ├─ Test ForeignKey relationships
    │   ├─ Test reverse relationships
    │   ├─ Test CASCADE behavior
    │   └─ Test nullable fields
    │
    ├─ PHASE 4: Performance Tests
    │   │
    │   ├─ Verify indexes exist
    │   ├─ Test query performance
    │   ├─ Test bulk operations
    │   └─ Measure execution time
    │
    └─ PHASE 5: Integration Tests
        │
        ├─ Test with Product model
        ├─ Test with Customer model
        ├─ Test admin interface
        └─ Test multi-tenancy
```

### Sample Test Scenarios

**Scenario 1: Authenticated User Views Product**
```
Step 1: Create UserProductInteraction
    - customer: authenticated_customer
    - product: test_product
    - interaction_type: 'VIEW'
    - timestamp: auto

Step 2: Verify
    - Record created successfully
    - customer FK populated
    - timestamp is recent
    - Accessible via customer.product_interactions.all()
```

**Scenario 2: Anonymous User Adds to Cart**
```
Step 1: Create UserProductInteraction
    - customer: None
    - product: test_product
    - interaction_type: 'CART'
    - timestamp: auto

Step 2: Verify
    - Record created with null customer
    - is_anonymous returns True
    - Product FK required and populated
```

**Scenario 3: Create FBT Recommendation**
```
Step 1: Create Recommendation
    - recommendation_type: 'FBT'
    - source_product: product_A
    - target_product: product_B
    - score: 0.85
    - rank: 1

Step 2: Test Duplicate
    - Attempt same combination
    - Verify unique_together prevents duplicate

Step 3: Verify
    - Record created successfully
    - computed_at auto-populated
    - Accessible via source_product.recommendations.all()
```

### Database Inspection Commands

| Purpose | Method | Expected Output |
|---------|--------|-----------------|
| Check table exists | Database client | Tables listed |
| View table structure | DESCRIBE/\d+ | Columns with types |
| List indexes | SHOW INDEXES | All defined indexes |
| Check constraints | Database client | Constraints listed |
| Count records | SELECT COUNT(*) | Record count |

### Performance Benchmarks

| Operation | With Indexes | Without Indexes | Improvement |
|-----------|-------------|-----------------|-------------|
| Filter by customer | <5ms | >50ms | 10x faster |
| Filter by product | <5ms | >50ms | 10x faster |
| Recent interactions | <10ms | >100ms | 10x faster |
| Aggregations | <20ms | >200ms | 10x faster |

### Common Issues and Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Migration fails | Error during migrate | Check dependencies, fix field definitions |
| Duplicate constraint error | Can't save record | Review unique_together constraint |
| Slow queries | Queries take long time | Verify indexes exist, check query plan |
| Null constraint violation | Can't save null value | Check field definitions, ensure null=True where needed |
| Foreign key error | Can't create relation | Ensure related model exists, check FK configuration |
| Timestamp not auto-populating | Manual timestamp required | Verify auto_now_add=True set |

### Expected Outcome
- Migrations applied successfully to database
- Both models create and save records correctly
- All field constraints work as expected
- Foreign key relationships function properly
- Indexes improve query performance
- Models integrated with existing system
- Admin interface works correctly
- Multi-tenancy isolation verified
- Performance meets requirements

### Verification Checklist
- [ ] Migrations applied without errors
- [ ] Recommendation model creates records successfully
- [ ] UserProductInteraction model creates records
- [ ] All field constraints validated
- [ ] Foreign key relationships work correctly
- [ ] CASCADE deletion behavior confirmed
- [ ] Nullable customer field works for anonymous users
- [ ] unique_together constraint prevents duplicates
- [ ] All indexes present in database
- [ ] Query performance acceptable with indexes
- [ ] Model __str__ methods work
- [ ] Default ordering applied correctly
- [ ] Reverse relationships accessible
- [ ] Admin interface functional
- [ ] Multi-tenancy isolation verified (if applicable)
- [ ] Integration with Product/Customer models confirmed
- [ ] Bulk operations perform well
- [ ] Test data created and verified

---

## Summary

This document covered the creation of the UserProductInteraction model and completion of the recommendation models setup. The seven tasks implemented user behavior tracking, configured all necessary fields, generated database migrations, and verified model functionality.

### What Was Accomplished

**UserProductInteraction Model (Tasks 10-14)**
- Created model class with proper inheritance and Meta configuration
- Added interaction_type field with three choices (VIEW, CART, PURCHASE)
- Configured customer FK with nullable support for anonymous users
- Added product FK with CASCADE deletion
- Implemented timestamp field with automatic capture

**Database and Verification (Tasks 15-16)**
- Generated migrations for both Recommendation and UserProductInteraction models
- Created database schema with proper indexes and constraints
- Verified model functionality through comprehensive testing
- Confirmed performance optimization through indexing

### Models Overview

| Model | Purpose | Key Features |
|-------|---------|--------------|
| Recommendation | Store product recommendations | 4 types, scored, ranked, time-stamped |
| UserProductInteraction | Track user behavior | Weighted types, anonymous support, temporal |

### Data Flow Integration

```
User Actions → UserProductInteraction Records → Recommendation Algorithms
    │                       │                              │
    ├─ Product View         ├─ Weight: 1                   ├─ Collaborative Filtering
    ├─ Add to Cart          ├─ Weight: 3                   ├─ Content-Based
    └─ Purchase             └─ Weight: 5                   └─ Trending Analysis
                                                                │
                                                                ▼
                                                    Recommendation Records
                                                                │
                                                                ▼
                                                    Displayed to Users
```

### Next Steps

With Group A complete, proceed to **Group-B_Frequently-Bought-Together** to implement:
- Association rule mining algorithms
- FBT recommendation generation
- Apriori algorithm implementation
- Transaction analysis
- Rule scoring and ranking

The foundation is now in place for building sophisticated recommendation features that leverage user interaction data and generate actionable product recommendations.
