# Tasks 01-09: Setup Recommendation Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** A - Recommendation Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-16_Interaction-Model-Migration.md](02_Tasks-10-16_Interaction-Model-Migration.md)

---

## Document Overview

This document covers the initial setup of the product recommendation infrastructure, including the installation of machine learning libraries, creation of the recommendation type enumeration, and the complete Recommendation model with all its fields. This foundational work enables the storage and retrieval of AI-generated product recommendations across multiple recommendation strategies (Frequently Bought Together, Similar Products, Personalized Recommendations, and Trending Products).

The Recommendation model serves as the central storage mechanism for pre-computed recommendation scores, allowing the system to deliver fast recommendation results without real-time computation overhead.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install mlxtend | Low | 10 min |
| 02 | Create RecommendationType Enum | Low | 15 min |
| 03 | Create Recommendation Model | Medium | 30 min |
| 04 | Create recommendation_type Field | Low | 10 min |
| 05 | Create source_product FK | Low | 15 min |
| 06 | Create target_product FK | Low | 15 min |
| 07 | Create score Field | Low | 10 min |
| 08 | Create rank Field | Low | 10 min |
| 09 | Create computed_at Field | Low | 10 min |

---

## Task 01: Install mlxtend

### Overview
Install the mlxtend (Machine Learning Extensions) Python library, which provides implementations of association rule learning algorithms such as Apriori and FP-Growth. These algorithms are essential for generating Frequently Bought Together (FBT) recommendations by analyzing transaction patterns and identifying product associations in order history data.

The mlxtend library is specifically chosen for its efficient implementation of market basket analysis algorithms and its compatibility with pandas DataFrames, making it ideal for processing large-scale transaction data in the multi-tenant environment.

### Dependencies
- **SubPhase-01 (AI Infrastructure Setup):** Must be complete
- Python environment is configured
- Backend dependencies management is established

### Instructions

1. **Locate the backend requirements file**
   - Navigate to the backend directory
   - Open the main requirements file or AI-specific requirements file
   - This file manages Python package dependencies

2. **Add mlxtend to requirements**
   - Add mlxtend package specification
   - Specify minimum version 0.22.0 or higher
   - Use version pinning format: `mlxtend>=0.22.0`
   - Place in the AI/ML dependencies section

3. **Understand mlxtend capabilities**
   - Provides Apriori algorithm for frequent itemset mining
   - Includes FP-Growth for faster association rule discovery
   - Supports lift, confidence, and support metrics
   - Compatible with pandas DataFrame operations

4. **Install the package**
   - Use pip to install in the active Python environment
   - Ensure installation in the correct virtual environment
   - Verify compatibility with existing packages

5. **Verify installation**
   - Test import of mlxtend modules
   - Confirm version meets minimum requirement
   - Check for dependency conflicts

### mlxtend Key Features

| Feature | Purpose |
|---------|---------|
| Apriori Algorithm | Discover frequent itemsets in transactions |
| FP-Growth | Efficient alternative to Apriori for large datasets |
| Association Rules | Generate rules with support, confidence, lift |
| pandas Integration | Seamless DataFrame operations |
| One-Hot Encoding | Built-in transaction encoding utilities |

### Library Purpose in Recommendation System

```
Transaction Data → mlxtend Processing → Association Rules → FBT Recommendations
                                      
Order History     → Apriori/FP-Growth → Product Pairs    → Stored in 
(Product Sets)                          (with metrics)      Recommendation Model
```

### Installation Context

| Environment | Installation Method |
|-------------|---------------------|
| Development | Direct pip install in virtualenv |
| Docker | Added to requirements, rebuilt image |
| Production | Deployed via requirements in container |

### Expected Outcome
- mlxtend library installed in Python environment
- Package version meets minimum requirement (>=0.22.0)
- No dependency conflicts with existing packages
- Library ready for association rule generation

### Verification Checklist
- [ ] mlxtend added to requirements file
- [ ] Version specification is correct (>=0.22.0)
- [ ] Package installed in Python environment
- [ ] Import test successful
- [ ] No dependency conflicts reported

---

## Task 02: Create RecommendationType Enum

### Overview
Create a Python enumeration class that defines the four distinct types of product recommendations supported by the system. This enum standardizes recommendation type identifiers across the codebase, ensuring consistency in database storage, API responses, and business logic. The four types cover different recommendation strategies: association-based (FBT), similarity-based (SIMILAR), user-preference-based (PERSONALIZED), and popularity-based (TRENDING).

Using an enum provides type safety, prevents invalid values, and creates a single source of truth for recommendation type identifiers.

### Dependencies
- **Task 01 (Install mlxtend):** Must be complete
- AI module structure exists
- Python enum support is available (Python 3.4+)

### Instructions

1. **Locate or create enums module**
   - Navigate to the AI or recommendations app
   - Find or create an enums.py or constants.py file
   - This file contains shared enumeration definitions

2. **Import required dependencies**
   - Import Enum from Python's enum module
   - Import TextChoices from Django models if using Django integration
   - Use TextChoices for better Django model integration

3. **Define RecommendationType enum**
   - Create a class that inherits from TextChoices
   - Define four enumeration members
   - Use clear, uppercase naming convention

4. **Define FBT (Frequently Bought Together)**
   - Value: "FBT"
   - Label: "Frequently Bought Together"
   - Purpose: Products often purchased together in same order

5. **Define SIMILAR (Similar Products)**
   - Value: "SIMILAR"
   - Label: "Similar Products"
   - Purpose: Products with similar attributes or categories

6. **Define PERSONALIZED (Personalized Recommendations)**
   - Value: "PERSONALIZED"
   - Label: "Personalized Recommendations"
   - Purpose: User-specific recommendations based on behavior

7. **Define TRENDING (Trending Products)**
   - Value: "TRENDING"
   - Label: "Trending Products"
   - Purpose: Popular products based on recent sales velocity

8. **Add docstring documentation**
   - Document the purpose of each enum value
   - Explain when each type is used
   - Include usage examples

### Recommendation Type Strategy Matrix

| Type | Algorithm | Data Source | Source Product | Use Case |
|------|-----------|-------------|----------------|----------|
| FBT | Apriori/FP-Growth | Order history | Required | "Customers also bought" |
| SIMILAR | Content-based | Product attributes | Required | "Similar items" |
| PERSONALIZED | Collaborative filtering | User interactions | Not required | "Recommended for you" |
| TRENDING | Popularity metrics | Sales analytics | Not required | "Trending now" |

### Enum Value Selection Logic

```
Product Detail Page → FBT + SIMILAR (source_product = current product)
User Homepage       → PERSONALIZED + TRENDING (source_product = null)
Cart Page           → FBT for each cart item
Category Page       → TRENDING within category
```

### Recommendation Type Characteristics

| Characteristic | FBT | SIMILAR | PERSONALIZED | TRENDING |
|----------------|-----|---------|--------------|----------|
| Requires Source Product | Yes | Yes | No | No |
| User-Specific | No | No | Yes | No |
| Time-Sensitive | Medium | Low | High | Very High |
| Computation Frequency | Daily | Daily | Hourly | Real-time |
| Cache Duration | 24 hours | 24 hours | 1 hour | 5 minutes |

### Expected Outcome
- RecommendationType enum defined with four values
- Enum integrated with Django TextChoices for model compatibility
- Clear documentation for each recommendation type
- Consistent string values for database storage

### Verification Checklist
- [ ] Enum class created in appropriate module
- [ ] All four types defined (FBT, SIMILAR, PERSONALIZED, TRENDING)
- [ ] Values use consistent uppercase naming
- [ ] Labels are human-readable descriptions
- [ ] Docstring documentation added
- [ ] Import works correctly in other modules

---

## Task 03: Create Recommendation Model

### Overview
Create the core Recommendation Django model that stores pre-computed product recommendation relationships. This model acts as a cache for AI-generated recommendations, storing the recommendation type, source product (if applicable), target product, relevance score, display rank, and computation timestamp. The model uses multi-tenancy support and includes a unique constraint to prevent duplicate recommendations for the same source-target-type combination.

This model is tenant-aware and extends the base model structure with soft delete capabilities and common timestamp fields.

### Dependencies
- **Task 02 (Create RecommendationType Enum):** Must be complete
- Product model exists (from ERP Core Modules)
- Base model mixins are available
- Multi-tenancy infrastructure is established

### Instructions

1. **Locate the recommendations app**
   - Navigate to the AI features section
   - Find or create the recommendations Django app
   - Locate the models.py file

2. **Import required dependencies**
   - Import Django model fields and base Model class
   - Import tenant model base classes
   - Import base mixins (timestamps, soft delete, tenant-aware)
   - Import Product model from inventory or products app
   - Import RecommendationType enum from Task 02

3. **Define the Recommendation model class**
   - Create a class named Recommendation
   - Inherit from appropriate base classes (TenantModel or similar)
   - Include soft delete mixin for logical deletion
   - Include timestamp mixin for created/updated tracking

4. **Plan the model structure**
   - Five primary fields plus inherited fields
   - Two foreign keys (source_product, target_product)
   - One enum field (recommendation_type)
   - Two numeric fields (score, rank)
   - One timestamp field (computed_at)

5. **Add Meta class configuration**
   - Set database table name
   - Define ordering (by rank ascending)
   - Set verbose names (singular and plural)
   - Add unique_together constraint

6. **Define unique constraint**
   - Combine recommendation_type, source_product, target_product
   - Prevents duplicate recommendations
   - Ensures data integrity across tenant schemas

7. **Add string representation method**
   - Return formatted string showing type and products
   - Handle null source_product case
   - Include score for debugging

8. **Consider indexes**
   - Index on tenant_id (inherited from base model)
   - Index on recommendation_type for filtering
   - Index on source_product for lookups
   - Composite index on (source_product, recommendation_type)

### Model Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Recommendation Model                      │
├─────────────────────────────────────────────────────────────┤
│ - id (PK, UUID/BigInt)                                      │
│ - tenant_id (FK to Tenant) [Inherited]                      │
│ - recommendation_type (CharField, Enum)                     │
│ - source_product_id (FK to Product, nullable)               │
│ - target_product_id (FK to Product)                         │
│ - score (FloatField, 0.0-1.0)                              │
│ - rank (IntegerField, positive)                            │
│ - computed_at (DateTimeField)                              │
│ - created_at (DateTimeField) [Inherited]                   │
│ - updated_at (DateTimeField) [Inherited]                   │
│ - is_deleted (BooleanField) [Inherited]                    │
├─────────────────────────────────────────────────────────────┤
│ Unique: (recommendation_type, source_product, target_product)│
└─────────────────────────────────────────────────────────────┘
         │                              │
         │ source_product (nullable)    │ target_product (required)
         ▼                              ▼
    ┌─────────┐                    ┌─────────┐
    │ Product │                    │ Product │
    └─────────┘                    └─────────┘
```

### Model Field Categories

| Category | Fields | Purpose |
|----------|--------|---------|
| Identity | id, tenant_id | Primary key and tenant isolation |
| Recommendation | recommendation_type, source_product, target_product | Core recommendation data |
| Scoring | score, rank | Relevance and display order |
| Metadata | computed_at, created_at, updated_at | Temporal tracking |
| Soft Delete | is_deleted | Logical deletion support |

### Inheritance Structure

```
TenantAwareModel (Base)
    ↓
TimeStampedModel (Mixin)
    ↓
SoftDeleteModel (Mixin)
    ↓
Recommendation (Concrete Model)
```

### Use Case Examples

| Scenario | Type | Source Product | Target Product | Score | Rank |
|----------|------|----------------|----------------|-------|------|
| "Often bought with X" | FBT | Product X | Product Y | 0.85 | 1 |
| "Similar to X" | SIMILAR | Product X | Product Z | 0.92 | 1 |
| "Recommended for user" | PERSONALIZED | null | Product A | 0.78 | 1 |
| "Trending now" | TRENDING | null | Product B | 0.95 | 1 |

### Expected Outcome
- Recommendation model created with proper inheritance
- Model includes all five required fields (to be defined in subsequent tasks)
- Unique constraint configured correctly
- Model follows Django and project conventions
- Multi-tenancy support enabled

### Verification Checklist
- [ ] Model class defined with correct name
- [ ] Inherits from appropriate base classes
- [ ] Meta class includes unique_together constraint
- [ ] String representation method implemented
- [ ] Imports are correct and complete
- [ ] Model follows project naming conventions

---

## Task 04: Create recommendation_type Field

### Overview
Add the recommendation_type field to the Recommendation model, which stores the type of recommendation using the RecommendationType enum. This CharField uses Django's choices parameter to restrict values to the four defined types, ensuring data integrity and enabling efficient filtering by recommendation type. The field is required (not nullable) as every recommendation must have a defined type.

### Dependencies
- **Task 03 (Create Recommendation Model):** Must be complete
- **Task 02 (Create RecommendationType Enum):** Must be complete

### Instructions

1. **Locate the Recommendation model**
   - Open the models.py file in recommendations app
   - Find the Recommendation class definition
   - Position for adding fields

2. **Add recommendation_type field**
   - Use CharField as the field type
   - Set max_length to accommodate longest enum value
   - Typically 20 characters is sufficient

3. **Configure enum choices**
   - Set choices parameter to RecommendationType.choices
   - This restricts values to enum members only
   - Django automatically validates against these choices

4. **Set field as required**
   - Do not set null=True (field is required)
   - Do not set blank=True (must have a value)
   - Every recommendation must have a type

5. **Add help text**
   - Describe the purpose of the field
   - Mention the four available types
   - Provide usage context

6. **Add database index**
   - Set db_index=True for query performance
   - Enables fast filtering by recommendation type
   - Essential for API queries

7. **Consider verbose name**
   - Set verbose_name for admin interface
   - Use "Recommendation Type" as display label
   - Improves readability in Django admin

### Field Configuration

| Parameter | Value | Reason |
|-----------|-------|--------|
| Field Type | CharField | Stores enum string value |
| max_length | 20 | Longest value is "PERSONALIZED" (13 chars) |
| choices | RecommendationType.choices | Enforces enum validation |
| null | False (default) | Field is required |
| blank | False (default) | Must have value in forms |
| db_index | True | Query performance optimization |

### Query Patterns Enabled

```
Filter by Type:
Recommendation.objects.filter(recommendation_type=RecommendationType.FBT)

Multiple Types:
Recommendation.objects.filter(
    recommendation_type__in=[RecommendationType.FBT, RecommendationType.SIMILAR]
)

Exclude Type:
Recommendation.objects.exclude(recommendation_type=RecommendationType.TRENDING)

Count by Type:
Recommendation.objects.filter(tenant=tenant).values('recommendation_type').annotate(count=Count('id'))
```

### Enum Integration Benefits

| Benefit | Description |
|---------|-------------|
| Type Safety | IDE autocomplete and type checking |
| Validation | Django validates against allowed choices |
| Consistency | Single source of truth for type values |
| Readability | Enum names more clear than string literals |
| Refactoring | Changing enum value updates everywhere |

### Database Storage

| Enum Member | Stored Value | Display Label |
|-------------|--------------|---------------|
| RecommendationType.FBT | "FBT" | "Frequently Bought Together" |
| RecommendationType.SIMILAR | "SIMILAR" | "Similar Products" |
| RecommendationType.PERSONALIZED | "PERSONALIZED" | "Personalized Recommendations" |
| RecommendationType.TRENDING | "TRENDING" | "Trending Products" |

### Expected Outcome
- recommendation_type field added to model
- Field uses enum for value restriction
- Database index created for performance
- Field properly integrated with Django validation

### Verification Checklist
- [ ] CharField added with appropriate max_length
- [ ] choices parameter set to RecommendationType.choices
- [ ] Field is required (not nullable)
- [ ] db_index=True for query optimization
- [ ] help_text and verbose_name added
- [ ] Field ordering logical within model

---

## Task 05: Create source_product FK

### Overview
Add the source_product foreign key field to the Recommendation model, which references the product that serves as the source or context for the recommendation. This field is nullable because certain recommendation types (TRENDING, PERSONALIZED) do not require a source product context. For FBT and SIMILAR recommendations, the source product represents the item the customer is currently viewing or considering.

The field uses CASCADE deletion to remove recommendations when the source product is deleted, maintaining referential integrity.

### Dependencies
- **Task 03 (Create Recommendation Model):** Must be complete
- Product model exists and is accessible

### Instructions

1. **Locate the Recommendation model**
   - Open the models.py file
   - Find the Recommendation class
   - Position after recommendation_type field

2. **Add source_product foreign key**
   - Use ForeignKey field type
   - Reference the Product model
   - Import Product model if not already imported

3. **Configure nullability**
   - Set null=True (database allows NULL)
   - Set blank=True (forms allow empty)
   - Field is optional for certain recommendation types

4. **Set deletion behavior**
   - Use on_delete=models.CASCADE
   - When source product deleted, remove recommendations
   - Maintains data integrity

5. **Define related name**
   - Set related_name='recommendations_as_source'
   - Enables reverse lookup from Product model
   - Distinguishes from target_product relationship

6. **Add help text**
   - Explain when field is used vs when it's null
   - Mention FBT and SIMILAR require source
   - Note TRENDING and PERSONALIZED use null

7. **Consider database indexing**
   - Set db_index=True for query performance
   - Most queries filter by source product
   - Essential for product detail page lookups

### Source Product Usage Matrix

| Recommendation Type | source_product Required? | Usage Context |
|---------------------|--------------------------|---------------|
| FBT | Yes | Product currently being viewed |
| SIMILAR | Yes | Product to find similarities for |
| PERSONALIZED | No | User-specific, no product context |
| TRENDING | No | System-wide popularity, no context |

### Foreign Key Relationship

```
┌────────────────┐         ┌──────────────────────┐         ┌────────────────┐
│    Product     │         │   Recommendation     │         │    Product     │
│   (Source)     │◄────────│                      │────────►│   (Target)     │
└────────────────┘         └──────────────────────┘         └────────────────┘
     1                                                            1
                              *                  *
     
     source_product_id                          target_product_id
     (nullable)                                 (required)
     
Example:
Product A ─[source]─► Recommendation ─[target]─► Product B
  "Laptop"              (FBT, 0.85)              "Mouse"
```

### Deletion Cascade Behavior

```
Event: Product A is deleted

Before:
Recommendation 1: source=A, target=B, type=FBT
Recommendation 2: source=A, target=C, type=SIMILAR
Recommendation 3: source=B, target=A, type=FBT
Recommendation 4: source=null, target=A, type=TRENDING

After:
Recommendation 1: DELETED (source=A)
Recommendation 2: DELETED (source=A)
Recommendation 3: DELETED (target=A)
Recommendation 4: DELETED (target=A)

All recommendations involving Product A are removed.
```

### Query Patterns

| Query Type | Example | Use Case |
|------------|---------|----------|
| Get recommendations for product | `Recommendation.objects.filter(source_product=product, recommendation_type=FBT)` | Product detail page |
| Get all source products | `Product.objects.filter(recommendations_as_source__isnull=False).distinct()` | Products with recommendations |
| Null source recommendations | `Recommendation.objects.filter(source_product__isnull=True)` | Global recommendations |

### Expected Outcome
- source_product foreign key added to model
- Field correctly configured as nullable
- CASCADE deletion behavior set
- Related name properly defined for reverse lookups
- Database index created for performance

### Verification Checklist
- [ ] ForeignKey field added referencing Product model
- [ ] null=True and blank=True set
- [ ] on_delete=models.CASCADE configured
- [ ] related_name='recommendations_as_source' defined
- [ ] db_index=True for query optimization
- [ ] help_text explains nullable behavior
- [ ] Product model import present

---

## Task 06: Create target_product FK

### Overview
Add the target_product foreign key field to the Recommendation model, which references the product being recommended. Unlike source_product, this field is required for all recommendations as every recommendation must suggest a specific product. The target_product represents the item the system is suggesting to the customer based on the recommendation algorithm and context.

This field uses CASCADE deletion and has a distinct related name to differentiate it from the source_product relationship.

### Dependencies
- **Task 03 (Create Recommendation Model):** Must be complete
- **Task 05 (Create source_product FK):** Must be complete
- Product model exists and is accessible

### Instructions

1. **Locate the Recommendation model**
   - Open the models.py file
   - Find the Recommendation class
   - Position after source_product field

2. **Add target_product foreign key**
   - Use ForeignKey field type
   - Reference the Product model
   - Same model as source_product but different purpose

3. **Set as required field**
   - Do not set null=True (field is required)
   - Do not set blank=True (must have value)
   - Every recommendation must have a target product

4. **Configure deletion behavior**
   - Use on_delete=models.CASCADE
   - When target product deleted, remove recommendations
   - Maintains referential integrity

5. **Define related name**
   - Set related_name='recommended_for'
   - Enables reverse lookup from Product model
   - Semantic name: "products this is recommended for"
   - Distinguishes from source_product relationship

6. **Add help text**
   - Explain this is the product being recommended
   - Note this field is always required
   - Mention it represents the recommendation output

7. **Add database index**
   - Set db_index=True for query performance
   - Supports lookups for recommendation display
   - Essential for API responses

### Source vs Target Product

| Aspect | source_product | target_product |
|--------|----------------|----------------|
| Required | No (nullable) | Yes (required) |
| Purpose | Context/input | Output/recommendation |
| Use Case | "When viewing X" | "Recommend Y" |
| Related Name | recommendations_as_source | recommended_for |
| Example | Product being viewed | Product to suggest |

### Product Relationship Patterns

```
Pattern 1: FBT Recommendation
Source: Product "Laptop" → Target: Product "Mouse"
Meaning: When customer views Laptop, recommend Mouse

Pattern 2: Similar Recommendation
Source: Product "Red Shirt" → Target: Product "Blue Shirt"
Meaning: Blue Shirt is similar to Red Shirt

Pattern 3: Trending Recommendation
Source: null → Target: Product "Popular Item"
Meaning: Recommend Popular Item system-wide

Pattern 4: Self-Loop Prevention
Source: Product A → Target: Product A
This should be prevented in business logic (don't recommend product to itself)
```

### Dual Foreign Key Queries

```
Get all products recommended when viewing Product X:
Recommendation.objects.filter(
    source_product=product_x,
    recommendation_type=RecommendationType.FBT
).select_related('target_product')

Get all products that recommend Product Y:
Recommendation.objects.filter(
    target_product=product_y,
    recommendation_type=RecommendationType.SIMILAR
).select_related('source_product')

Get products frequently bought together (bidirectional):
Combined queries on both source and target
```

### Database Integrity Considerations

| Scenario | Behavior |
|----------|----------|
| Source product deleted | Cascade delete recommendations |
| Target product deleted | Cascade delete recommendations |
| Product deleted from inventory | All related recommendations removed |
| Product marked inactive | Recommendations remain (filter in queries) |

### Expected Outcome
- target_product foreign key added to model
- Field correctly configured as required (not nullable)
- CASCADE deletion behavior set
- Related name properly defined as 'recommended_for'
- Database index created for performance
- Clear distinction from source_product maintained

### Verification Checklist
- [ ] ForeignKey field added referencing Product model
- [ ] Field is required (null=False, blank=False)
- [ ] on_delete=models.CASCADE configured
- [ ] related_name='recommended_for' defined
- [ ] db_index=True for query optimization
- [ ] help_text explains field purpose
- [ ] Distinct from source_product in naming and purpose

---

## Task 07: Create score Field

### Overview
Add the score field to the Recommendation model, which stores the confidence or relevance score for the recommendation. This FloatField ranges from 0.0 to 1.0, where higher values indicate stronger recommendation confidence. The score is generated by the recommendation algorithms (Apriori lift for FBT, cosine similarity for SIMILAR, collaborative filtering scores for PERSONALIZED, etc.) and is used for sorting and filtering recommendations.

Scores help prioritize recommendations when multiple options are available and provide transparency into recommendation strength.

### Dependencies
- **Task 03 (Create Recommendation Model):** Must be complete

### Instructions

1. **Locate the Recommendation model**
   - Open the models.py file
   - Find the Recommendation class
   - Position after target_product field

2. **Add score field**
   - Use FloatField as the field type
   - Stores decimal values for recommendation confidence
   - Supports precise numerical comparisons

3. **Set default value**
   - Set default=0.0
   - Ensures field always has a value
   - Prevents null values in database

4. **Add field validators**
   - Import MinValueValidator and MaxValueValidator from Django
   - Add MinValueValidator(0.0) to ensure non-negative scores
   - Add MaxValueValidator(1.0) to cap scores at maximum
   - Enforces range constraint at application level

5. **Add help text**
   - Explain score represents recommendation confidence
   - Document range (0.0 to 1.0)
   - Note higher is better
   - Mention algorithm-specific meanings

6. **Add verbose name**
   - Set verbose_name='Recommendation Score'
   - Improves Django admin readability
   - Used in forms and API documentation

7. **Consider database constraints**
   - Database-level check constraint can be added in migration
   - Ensures data integrity at all levels
   - Redundant with validators but adds safety

### Score Range and Interpretation

| Score Range | Interpretation | Action |
|-------------|----------------|--------|
| 0.90 - 1.00 | Very High Confidence | Display prominently, top priority |
| 0.70 - 0.89 | High Confidence | Strongly recommend |
| 0.50 - 0.69 | Medium Confidence | Standard recommendation |
| 0.30 - 0.49 | Low Confidence | Consider showing |
| 0.00 - 0.29 | Very Low Confidence | Typically filtered out |

### Score Calculation by Type

| Recommendation Type | Score Calculation Method | Score Meaning |
|---------------------|--------------------------|---------------|
| FBT | Apriori lift metric | How much more likely products are bought together |
| SIMILAR | Cosine similarity | Attribute similarity between products |
| PERSONALIZED | Collaborative filtering | Predicted user preference |
| TRENDING | Sales velocity score | Normalized popularity metric |

### Score-Based Filtering

```
Query Examples:

High confidence only:
Recommendation.objects.filter(score__gte=0.7)

Top N recommendations:
Recommendation.objects.filter(source_product=product).order_by('-score')[:5]

Score range:
Recommendation.objects.filter(score__range=(0.5, 0.8))

Above threshold by type:
Recommendation.objects.filter(
    recommendation_type=RecommendationType.FBT,
    score__gte=0.6
).order_by('-score')
```

### Validation Flow

```
Algorithm Output → Normalize to 0.0-1.0 → Django Validators → Database
                                                             
Example:
Apriori lift=3.5 → Normalized=0.85 → MinValueValidator ✓ → Storage
                                    → MaxValueValidator ✓
```

### Score vs Rank Relationship

| Field | Type | Purpose | Usage |
|-------|------|---------|-------|
| score | Float | Confidence level | Algorithm-generated, filtering |
| rank | Integer | Display order | User-facing, presentation |

Note: Multiple recommendations may have same score but different ranks

### Expected Outcome
- score field added to model
- Field validated to range 0.0 to 1.0
- Default value set to 0.0
- Validators configured for range enforcement
- Field ready for sorting and filtering operations

### Verification Checklist
- [ ] FloatField added to model
- [ ] default=0.0 configured
- [ ] MinValueValidator(0.0) added
- [ ] MaxValueValidator(1.0) added
- [ ] help_text explains score meaning and range
- [ ] verbose_name set for admin interface
- [ ] Validators imported from django.core.validators

---

## Task 08: Create rank Field

### Overview
Add the rank field to the Recommendation model, which stores the display order for recommendations of the same type and source product. Unlike the score field (which is algorithm-generated), the rank field provides explicit control over the presentation order. This IntegerField uses positive integers where lower values indicate higher priority (rank=1 is first, rank=2 is second, etc.).

The rank field allows business logic to override algorithm scores for merchandising purposes, promotional priorities, or manual curation.

### Dependencies
- **Task 03 (Create Recommendation Model):** Must be complete
- **Task 07 (Create score Field):** Must be complete (for understanding distinction)

### Instructions

1. **Locate the Recommendation model**
   - Open the models.py file
   - Find the Recommendation class
   - Position after score field

2. **Add rank field**
   - Use IntegerField (or PositiveIntegerField) as field type
   - Stores whole numbers for ordering
   - No decimal precision needed

3. **Set default value**
   - Set default=1
   - Provides reasonable starting value
   - Indicates no explicit ranking when not set

4. **Add field validator**
   - Import MinValueValidator from Django
   - Add MinValueValidator(1) to ensure positive values
   - Rank starts at 1 (not 0) for intuitive ordering

5. **Add help text**
   - Explain rank controls display order
   - Note lower values display first
   - Mention relationship with score field
   - Indicate rank can override score ordering

6. **Add verbose name**
   - Set verbose_name='Display Rank'
   - Clarifies purpose in admin interface
   - Distinguishes from score

7. **Consider database index**
   - Set db_index=True for ordering performance
   - Frequently used in ORDER BY clauses
   - Essential for recommendation list queries

8. **Update model Meta ordering**
   - Add rank to Meta.ordering list
   - Ensures consistent default sort order
   - Typically ['source_product', 'recommendation_type', 'rank']

### Rank vs Score Comparison

| Aspect | Score | Rank |
|--------|-------|------|
| Type | Float (0.0-1.0) | Integer (1+) |
| Source | Algorithm-generated | Business logic |
| Mutability | Usually static after computation | Can be adjusted |
| Purpose | Confidence metric | Display order |
| Sorting | Descending (higher better) | Ascending (lower first) |

### Ranking Strategy

```
Initial Ranking (Automatic):
1. Compute scores via algorithm
2. Sort by score descending
3. Assign ranks: 1, 2, 3, ...

Manual Adjustment (Optional):
1. Business promotes specific product
2. Change rank=5 to rank=1
3. Shift other ranks accordingly

Display Order:
ORDER BY rank ASC, score DESC
(rank takes precedence, score as tiebreaker)
```

### Rank Assignment Examples

| Scenario | Score | Automatic Rank | Manual Rank | Display Order |
|----------|-------|----------------|-------------|---------------|
| Product A | 0.95 | 1 | 1 | 1st |
| Product B | 0.87 | 2 | 2 | 2nd |
| Product C | 0.82 | 3 | 5 | 5th (demoted) |
| Product D | 0.76 | 4 | 3 | 3rd (promoted) |
| Product E | 0.71 | 5 | 4 | 4th |

### Query Patterns with Rank

```
Get recommendations in display order:
Recommendation.objects.filter(
    source_product=product,
    recommendation_type=RecommendationType.FBT
).order_by('rank', '-score')

Top 5 recommendations:
Recommendation.objects.filter(
    source_product=product
).order_by('rank')[:5]

Bulk rank update (shift down):
Recommendation.objects.filter(
    source_product=product,
    rank__gte=1
).update(rank=F('rank') + 1)
```

### Rank Management Workflow

```
Step 1: Algorithm Execution
└─► Generates recommendations with scores

Step 2: Initial Ranking
└─► Assign ranks based on score order

Step 3: Business Review
└─► Identify products to promote/demote

Step 4: Rank Adjustment
└─► Update rank values manually

Step 5: Frontend Display
└─► Show recommendations ordered by rank
```

### Expected Outcome
- rank field added to model
- Field validated to ensure positive integers
- Default value set to 1
- Database index created for ordering performance
- Model Meta ordering includes rank field
- Clear distinction from score field maintained

### Verification Checklist
- [ ] IntegerField or PositiveIntegerField added
- [ ] default=1 configured
- [ ] MinValueValidator(1) added to validators
- [ ] db_index=True for query optimization
- [ ] help_text explains ranking purpose
- [ ] verbose_name set to 'Display Rank'
- [ ] Meta.ordering includes rank field
- [ ] Distinction from score field is clear

---

## Task 09: Create computed_at Field

### Overview
Add the computed_at field to the Recommendation model, which stores the timestamp when the recommendation was generated by the AI algorithm. This DateTimeField automatically captures the moment recommendations are computed, enabling time-based filtering, cache invalidation strategies, and tracking of recommendation freshness. Unlike the created_at field (which tracks record creation), computed_at specifically indicates when the recommendation score was calculated.

This field is essential for implementing time-decay strategies and determining when recommendations need recomputation.

### Dependencies
- **Task 03 (Create Recommendation Model):** Must be complete

### Instructions

1. **Locate the Recommendation model**
   - Open the models.py file
   - Find the Recommendation class
   - Position after rank field

2. **Add computed_at field**
   - Use DateTimeField as field type
   - Stores date and time with timezone awareness
   - Precision to seconds or microseconds

3. **Configure automatic timestamp**
   - Set auto_now_add=True
   - Automatically sets timestamp on record creation
   - Captures moment of first save

4. **Understand auto_now_add behavior**
   - Sets timestamp only on creation (not updates)
   - Value is fixed after initial save
   - Different from auto_now (which updates on every save)

5. **Add help text**
   - Explain field tracks computation time
   - Note difference from created_at
   - Mention use for cache invalidation

6. **Add verbose name**
   - Set verbose_name='Computed At'
   - Clear labeling in admin interface
   - Distinguishes from created_at

7. **Add database index**
   - Set db_index=True for time-based queries
   - Supports filtering by computation date
   - Essential for cache invalidation queries

8. **Consider timezone awareness**
   - Ensure Django USE_TZ=True setting
   - Store in UTC for consistency
   - Convert to tenant timezone for display

### Timestamp Field Comparison

| Field | Purpose | Auto-Update | Use Case |
|-------|---------|-------------|----------|
| computed_at | Algorithm execution time | No | Cache invalidation, freshness |
| created_at | Record creation time | No | Audit trail, history |
| updated_at | Last modification time | Yes | Change tracking |

### Computation Timing Examples

```
Timeline Example:

T0: Product data changes (new sales, attributes updated)
T1: Recommendation computation job runs → computed_at = T1
T2: Recommendation records created → created_at = T2
T3: Business updates rank field → updated_at = T3

Relationships:
- computed_at may precede created_at (batch job then bulk insert)
- updated_at always >= created_at
- computed_at indicates data freshness
```

### Cache Invalidation Strategy

| Strategy | Logic | Query |
|----------|-------|-------|
| Age-based | Invalidate after 24 hours | `computed_at < now() - timedelta(hours=24)` |
| Event-based | Invalidate on product changes | Track product.updated_at > recommendation.computed_at |
| Hybrid | Combine age + events | Age check OR product change |

### Time-Based Queries

```
Get stale recommendations (older than 1 day):
from django.utils import timezone
from datetime import timedelta

stale_cutoff = timezone.now() - timedelta(days=1)
Recommendation.objects.filter(computed_at__lt=stale_cutoff)

Get recent recommendations:
recent_cutoff = timezone.now() - timedelta(hours=1)
Recommendation.objects.filter(computed_at__gte=recent_cutoff)

Recomputation needed:
Recommendation.objects.filter(
    source_product__updated_at__gt=F('computed_at')
)
```

### Recommendation Lifecycle

```
Stage 1: Computation
└─► Algorithm runs, generates scores
    └─► computed_at = current timestamp

Stage 2: Storage
└─► Records saved to database
    └─► created_at = save timestamp

Stage 3: Usage
└─► API serves recommendations
    └─► Check computed_at age

Stage 4: Invalidation
└─► computed_at exceeds threshold
    └─► Flag for recomputation

Stage 5: Update
└─► New computation triggered
    └─► Delete old, insert new records
```

### Freshness Indicators

| Age | Status | Action |
|-----|--------|--------|
| < 1 hour | Very Fresh | Serve directly |
| 1-6 hours | Fresh | Serve, schedule refresh |
| 6-24 hours | Aging | Serve, prioritize refresh |
| > 24 hours | Stale | Refresh immediately or use fallback |

### Expected Outcome
- computed_at field added to model
- Field automatically captures timestamp on creation
- Database index created for time-based queries
- Clear distinction from created_at and updated_at fields
- Field ready for cache invalidation logic

### Verification Checklist
- [ ] DateTimeField added to model
- [ ] auto_now_add=True configured
- [ ] db_index=True for query optimization
- [ ] help_text explains computation timestamp
- [ ] verbose_name set to 'Computed At'
- [ ] Distinction from created_at is clear
- [ ] Timezone awareness considered (USE_TZ=True)

---

## Complete Model Structure Summary

### All Fields Overview

| Field | Type | Nullable | Indexed | Auto | Purpose |
|-------|------|----------|---------|------|---------|
| id | UUID/BigInt | No | PK | Yes | Primary key |
| tenant_id | FK | No | Yes | No | Multi-tenancy isolation |
| recommendation_type | CharField | No | Yes | No | Type of recommendation |
| source_product | FK | Yes | Yes | No | Context product (nullable) |
| target_product | FK | No | Yes | No | Recommended product |
| score | Float | No | No | No | Confidence (0.0-1.0) |
| rank | Integer | No | Yes | No | Display order (1+) |
| computed_at | DateTime | No | Yes | Yes | Computation timestamp |
| created_at | DateTime | No | Yes | Yes | Record creation |
| updated_at | DateTime | No | Yes | Yes | Last modification |
| is_deleted | Boolean | No | No | No | Soft delete flag |

### Constraints and Indexes

```
Primary Key: id
Foreign Keys: tenant_id, source_product_id, target_product_id
Unique Constraint: (recommendation_type, source_product_id, target_product_id)

Indexes:
- tenant_id (inherited)
- recommendation_type
- source_product_id
- target_product_id
- rank
- computed_at

Composite Indexes (consider adding):
- (tenant_id, recommendation_type, source_product_id)
- (tenant_id, source_product_id, rank)
```

### Complete Model Interaction Flow

```
1. Algorithm Execution
   ↓
2. Score Calculation (score = 0.0-1.0)
   ↓
3. Rank Assignment (rank = 1, 2, 3...)
   ↓
4. Record Creation
   ├─► recommendation_type set
   ├─► source_product set (or null)
   ├─► target_product set
   ├─► score set
   ├─► rank set
   └─► computed_at auto-set
   ↓
5. Database Storage
   ├─► Unique constraint checked
   ├─► Validators applied
   └─► Indexes updated
   ↓
6. API Query
   ├─► Filter by type & source
   ├─► Order by rank
   └─► Return top N
```

### Final Verification

After completing all nine tasks, verify:

- [ ] All imports are present and correct
- [ ] Model inherits from appropriate base classes
- [ ] All five custom fields are defined
- [ ] RecommendationType enum is used correctly
- [ ] Both foreign keys point to Product model
- [ ] Unique constraint includes all three identifying fields
- [ ] Meta class defines ordering by rank
- [ ] String representation method is implemented
- [ ] All help_text and verbose_name attributes added
- [ ] Database indexes are strategically placed
- [ ] Model follows Django and project conventions

---

## Next Steps

After completing the Recommendation model setup:

1. **Proceed to Next Document:**
   - [02_Tasks-10-16_Interaction-Model-Migration.md](02_Tasks-10-16_Interaction-Model-Migration.md)
   - Create UserProductInteraction model for tracking user behavior
   - Define interaction types (view, click, cart_add, purchase)
   - Generate and apply database migrations

2. **Future Integration:**
   - Implement recommendation computation algorithms
   - Create Celery tasks for batch processing
   - Build API endpoints for fetching recommendations
   - Integrate with product detail pages and cart

3. **Testing Considerations:**
   - Write unit tests for model validation
   - Test unique constraint enforcement
   - Verify CASCADE deletion behavior
   - Test ranking and scoring logic

---

**Document Complete: All 9 tasks documented for Recommendation Model setup.**
