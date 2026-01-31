# Tasks 12-16: ProductTranslation Model and Migrations

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** A - Dictionary Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-11_SinhalaWord-Transliteration.md](01_Tasks-01-11_SinhalaWord-Transliteration.md)
- **→ Next Group:** [Group-B_Core-Dictionary](../Group-B_Core-Dictionary/)

---

## Document Overview

This document covers the creation of the ProductTranslation model and generation of database migrations for all dictionary models. The ProductTranslation model bridges the product catalog with Sinhala names, enabling search matching between user queries and actual products. This document also includes migration generation and comprehensive model verification to ensure the dictionary system is ready for data population.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 12 | Create ProductTranslation Model | Medium | 30 min |
| 13 | Create product FK | Low | 15 min |
| 14 | Create sinhala_name Field | Low | 20 min |
| 15 | Create Dictionary Migrations | Low | 20 min |
| 16 | Verify Models | Low | 30 min |

---

## Task 12: Create ProductTranslation Model

### Overview
Create the ProductTranslation model to link ERP products with their Sinhala names. This model serves as the bridge between the dictionary system and the product catalog, enabling the search system to find products when users search in Sinhala or Sinhaglish. Each product can have one Sinhala translation, stored alongside the product's English name.

### Dependencies
- Task 01: Create SinhalaWord Model
- ERP Product model exists
- Multi-tenancy system configured

### Instructions

1. **Navigate to the models directory**
   - Go to `backend/apps/search/sinhaglish/models/` directory
   - Prepare to create new model file

2. **Create product_translation model file**
   - Create new file `product_translation.py` in `models/` directory
   - Import Django model base classes
   - Import necessary field types

3. **Import related models**
   - Import Product model from ERP inventory app
   - Import SinhalaWord model from current module
   - Ensure proper import paths

4. **Define ProductTranslation model class**
   - Create class inheriting from appropriate base model
   - Include tenant-aware model inheritance
   - Add model Meta class for configuration

5. **Configure model metadata**
   - Set `verbose_name` to "Product Translation"
   - Set `verbose_name_plural` to "Product Translations"
   - Define `ordering` to sort by product
   - Set `db_table` name if custom table needed

6. **Plan model relationships**
   - One-to-one relationship with Product (Task 13)
   - Optional FK to SinhalaWord for base term
   - Consider product.translation reverse accessor

7. **Add string representation method**
   - Implement `__str__` method
   - Return product name with Sinhala name
   - Format: "Product Name (සිංහල නම)"

8. **Define model purpose**
   - Link products to Sinhala names
   - Enable Sinhaglish product search
   - Support bilingual product display

9. **Register model in __init__.py**
   - Import ProductTranslation in `models/__init__.py`
   - Export in `__all__` list

### Model Purpose and Use Cases

| Purpose | Description |
|---------|-------------|
| Product Linking | Connect products to Sinhala names |
| Search Matching | Find products via Sinhala queries |
| Bilingual Display | Show products in Sinhala & English |
| Translation Management | Manage product name translations |
| Search Indexing | Index products for Sinhaglish search |

### Model Structure Overview

```
┌────────────────────────────────────┐
│   ProductTranslation Model         │
├────────────────────────────────────┤
│ - product (FK to Product)         │ ← Task 13
│ - sinhala_name (Sinhala text)     │ ← Task 14
│ - word (Optional FK to SinhalaWord)│
├────────────────────────────────────┤
│ Relationships:                     │
│ ← Product (one-to-one)            │
│ ← SinhalaWord (many-to-one, opt)  │
└────────────────────────────────────┘
```

### Relationship Diagram

```
Product (ERP)              ProductTranslation         SinhalaWord (Optional)
┌─────────────────┐        ┌──────────────────┐      ┌──────────────────┐
│ id: 1           │←───────│ product_id: 1   │      │ id: 1            │
│ name: "Milk"    │ 1-to-1 │ sinhala_name:   │  ┌───│ sinhala: කිරි   │
│ sku: "MLK001"   │        │   "අංකර කිරි"   │  │   │ romanized: kiri  │
│ ...             │        │ word_id: 1      │──┘   │ ...              │
└─────────────────┘        └──────────────────┘      └──────────────────┘
```

### ProductTranslation Examples

| Product (English) | Sinhala Name | Base Word | Category |
|-------------------|--------------|-----------|----------|
| Anchor Full Cream Milk | අංකර කිරි | කිරි (kiri) | Grocery |
| Basmati Rice | බාස්මති බත් | බත් (bath) | Grocery |
| Sunlight Soap | සන්ලයිට් සබන් | සබන් (saban) | Household |
| Fresh Fish | නැවුම් මළු | මළු (malu) | Grocery |
| Prima Bread | ප්‍රීමා පාන් | පාන් (paan) | Grocery |

### Search Integration Flow

```
Search Flow:
───────────
1. User searches: "kiri" (Sinhaglish)
       ↓
2. System queries SinhalaWord: romanized='kiri'
       ↓ (matches කිරි)
3. System queries ProductTranslation: sinhala_name CONTAINS 'කිරි'
       ↓
4. Returns Products:
   ├── Anchor Full Cream Milk (අංකර කිරි)
   ├── Highland Fresh Milk (හයිලන්ඩ් කිරි)
   └── Kotmale Milk (කොත්මලේ කිරි)
       ↓
5. Display results to user
```

### Model Options

```
One-to-One vs Foreign Key:
─────────────────────────
OneToOneField (Chosen):
├── Each product has max one translation
├── Reverse accessor: product.translation
└── Prevents duplicate translations per product

ForeignKey (Alternative):
├── Each product could have multiple translations
├── Reverse accessor: product.translations.all()
└── More complex but flexible
```

### Directory Structure

```
backend/apps/search/sinhaglish/models/
├── __init__.py
├── sinhala_word.py           # Task 01
├── transliteration.py        # Task 08
└── product_translation.py    # Created in this task
```

### Base Model Inheritance

| Option | Use When |
|--------|----------|
| TenantModel | Product translations isolated per tenant |
| TenantAwareModel | Shared translations across tenants |
| models.Model | Simple, non-tenant setup |

### Expected Outcome
- ProductTranslation model class created
- Model properly inherits from base classes
- Meta configuration defined
- String representation implemented
- Model registered for import
- Foundation ready for field definitions (Tasks 13-14)

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/models/product_translation.py` file created
- [ ] ProductTranslation class defined with proper inheritance
- [ ] Product and SinhalaWord models imported
- [ ] Model Meta class configured
- [ ] `__str__` method implemented
- [ ] Model imported in `models/__init__.py`
- [ ] Model follows project naming conventions

---

## Task 13: Create product FK

### Overview
Add the `product` foreign key field to establish a one-to-one relationship between ProductTranslation and the ERP Product model. This unique relationship ensures each product has at most one Sinhala translation entry, preventing duplicates while enabling efficient product-to-translation lookups and reverse translation-to-product queries.

### Dependencies
- Task 12: Create ProductTranslation Model
- ERP Product model exists (from Phase-04/05)

### Instructions

1. **Open product_translation.py file**
   - Navigate to `backend/apps/search/sinhaglish/models/product_translation.py`
   - Locate the ProductTranslation class definition

2. **Import Product model**
   - Import Product from inventory app
   - Example: `from apps.inventory.models import Product`
   - Adjust import path based on project structure

3. **Add product foreign key field**
   - Define as OneToOneField to Product
   - Set on_delete=models.CASCADE
   - Add verbose_name="Product"

4. **Configure relationship properties**
   - Set related_name='translation' for reverse lookup
   - This allows: product.translation
   - Add db_index=True for query performance
   - Set unique=True (implicit with OneToOneField)

5. **Set field properties**
   - Set null=False and blank=False (required)
   - Each translation must link to a product
   - Primary key nature prevents duplicates

6. **Plan cascade behavior**
   - When product deleted, translation deleted
   - Maintains referential integrity
   - Consider implications for historical data

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | OneToOneField | 1:1 Relationship |
| Related Model | Product | ERP product |
| On Delete | CASCADE | Delete with product |
| Related Name | translation | Reverse query name |
| Null | False | Required relationship |
| Blank | False | Required relationship |
| DB Index | True | Query optimization |
| Unique | True | One translation per product |

### Relationship Details

```
Relationship Type: One-to-One
────────────────────────────
One Product ↔ One ProductTranslation

Example:
Product: "Anchor Full Cream Milk"
    ↕ (OneToOne)
ProductTranslation: "අංකර කිරි"

Constraints:
├── Each product can have 0 or 1 translation
└── Each translation belongs to exactly 1 product
```

### OneToOne vs ForeignKey

| Aspect | OneToOneField | ForeignKey |
|--------|---------------|------------|
| Duplicates | No duplicates allowed | Multiple allowed |
| Reverse | Single object (.translation) | QuerySet (.translations.all()) |
| Database | Unique constraint | No constraint |
| Use Case | Single translation per product | Multiple translations |

### On Delete Behavior

```
CASCADE Behavior:
────────────────
Product Deleted
    ↓
ProductTranslation Automatically Deleted
    ↓
Database Integrity Maintained

Example:
1. Product "Anchor Milk" (id=1) deleted
2. ProductTranslation(product_id=1) auto-deleted
3. No orphaned translation records
```

### Query Patterns

```
Forward Query (Translation → Product):
─────────────────────────────────────
translation = ProductTranslation.objects.get(
    sinhala_name__contains='කිරි'
)
product = translation.product
print(product.name)  # "Anchor Full Cream Milk"

Reverse Query (Product → Translation):
─────────────────────────────────────
product = Product.objects.get(sku='MLK001')
try:
    translation = product.translation
    print(translation.sinhala_name)  # "අංකර කිරි"
except ProductTranslation.DoesNotExist:
    print("No translation available")

Check Translation Exists:
────────────────────────
has_translation = hasattr(product, 'translation')

Get Products with Translations:
──────────────────────────────
products_with_translations = Product.objects.filter(
    translation__isnull=False
)
```

### Database Schema

```
Table: products (ERP)
┌─────┬────────────────────┬────────────┬──────────┐
│ id  │ name               │ sku        │ ...      │
├─────┼────────────────────┼────────────┼──────────┤
│ 1   │ Anchor Milk        │ MLK001     │ ...      │
│ 2   │ Basmati Rice       │ RIC001     │ ...      │
│ 3   │ Sunlight Soap      │ SOP001     │ ...      │
└─────┴────────────────────┴────────────┴──────────┘
   ↑
   │ (OneToOne)
   │
Table: product_translations
┌─────┬────────────┬────────────────┬──────────┐
│ id  │ product_id │ sinhala_name   │ ...      │
├─────┼────────────┼────────────────┼──────────┤
│ 1   │ 1          │ අංකර කිරි     │ ...      │
│ 2   │ 2          │ බාස්මති බත්   │ ...      │
│ 3   │ 3          │ සන්ලයිට් සබන්  │ ...      │
└─────┴────────────┴────────────────┴──────────┘
         ↑ Unique, indexed
```

### Select Related Optimization

```
Efficient Query (Single DB Hit):
───────────────────────────────
translations = ProductTranslation.objects.select_related(
    'product'
).filter(sinhala_name__contains='කිරි')

for trans in translations:
    # No additional query needed
    print(f"{trans.product.name}: {trans.sinhala_name}")

Without select_related (N+1 Problem):
────────────────────────────────────
translations = ProductTranslation.objects.filter(
    sinhala_name__contains='කිරි'
)

for trans in translations:
    # Each iteration hits database again!
    print(f"{trans.product.name}: {trans.sinhala_name}")
```

### Migration Considerations

```
Migration will create:
─────────────────────
1. Column: product_id (integer)
2. Foreign Key Constraint
3. Unique Constraint (one translation per product)
4. Index on product_id
```

### Expected Outcome
- product foreign key added to ProductTranslation model
- One-to-one relationship with Product established
- Cascade deletion configured
- Reverse relationship named 'translation'
- Indexed for query performance
- Unique constraint prevents duplicate translations

### Verification Checklist
- [ ] product field added to ProductTranslation model
- [ ] Field type is OneToOneField
- [ ] Related model is Product
- [ ] on_delete=models.CASCADE set
- [ ] related_name='translation' set
- [ ] db_index=True for performance
- [ ] Product model imported correctly
- [ ] Import path verified for project structure

---

## Task 14: Create sinhala_name Field

### Overview
Add the `sinhala_name` field to store the full Sinhala name of products. This field holds the complete product name in Sinhala Unicode, which may include brand names, product types, and descriptors. The field is indexed for text search and supports full-text queries to match user searches with actual products.

### Dependencies
- Task 12: Create ProductTranslation Model

### Instructions

1. **Open product_translation.py file**
   - Navigate to the ProductTranslation model definition
   - Prepare to add sinhala_name field

2. **Add sinhala_name field**
   - Define as CharField with max_length=200
   - Longer length for full product names with brands
   - Add verbose_name="Sinhala Name"

3. **Configure search capabilities**
   - Set db_index=True for text search
   - Consider full-text search index (GIN/GiST for PostgreSQL)
   - Plan for ILIKE queries with wildcards

4. **Set field properties**
   - Set null=False and blank=False (required)
   - Add help_text for admin guidance
   - Consider validation for Sinhala characters

5. **Plan text search strategy**
   - Full-text search on sinhala_name
   - Tokenization of product names
   - Matching with SinhalaWord terms

6. **Update admin interface**
   - Add sinhala_name to list_display
   - Enable search by sinhala_name
   - Show in admin forms with proper font

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Text storage |
| Max Length | 200 | Full product names |
| Null | False | Required field |
| Blank | False | Must have value |
| DB Index | True | Text search |
| Verbose Name | "Sinhala Name" | Admin display |

### Product Name Examples

| English Name | Sinhala Name | Base Words |
|--------------|--------------|------------|
| Anchor Full Cream Milk 400g | අංකර සම්පූර්ණ ක්‍රීම් කිරි 400g | කිරි |
| Basmati Rice Premium 5kg | බාස්මති බත් ප්‍රිමියම් 5kg | බත් |
| Sunlight Soap Bar 100g | සන්ලයිට් සබන් කට්ටලය 100g | සබන් |
| Fresh King Fish 1kg | නැවුම් අට මළු 1kg | මළු |
| Prima Bread Large | ප්‍රීමා පාන් විශාල | පාන් |

### Product Name Components

```
Product Name Structure:
──────────────────────
Brand + Type + Size/Weight + Descriptor

Examples:
├── අංකර + කිරි + 400g + සම්පූර්ණ ක්‍රීම්
│   (Anchor + Milk + 400g + Full Cream)
│
├── සන්ලයිට් + සබන් + 100g + කට්ටලය
│   (Sunlight + Soap + 100g + Bar)
│
└── ප්‍රීමා + පාන් + විශාල
    (Prima + Bread + Large)
```

### Search Matching Strategy

```
Search Query Flow:
─────────────────
User types: "kiri"
    ↓
1. Find SinhalaWord: romanized='kiri' → sinhala_text='කිරි'
    ↓
2. Search ProductTranslation:
   WHERE sinhala_name ILIKE '%කිරි%'
    ↓
3. Results:
   ├── අංකර සම්පූර්ණ ක්‍රීම් කිරි 400g
   ├── හයිලන්ඩ් නැවුම් කිරි 1L
   └── කොත්මලේ පවුඩර් කිරි 400g
    ↓
4. Return associated Product objects
```

### Text Search Approaches

| Approach | SQL Example | Performance | Use Case |
|----------|-------------|-------------|----------|
| Exact | `sinhala_name = 'කිරි'` | Fastest | Exact matches only |
| Contains | `sinhala_name ILIKE '%කිරි%'` | Slower | Partial matches |
| Full-Text | `to_tsvector(sinhala_name) @@ to_tsquery('කිරි')` | Fast with index | Complex queries |
| Trigram | `similarity(sinhala_name, 'කිරි') > 0.3` | Good | Fuzzy matching |

### Database Index Options

```
Basic Index (B-tree):
────────────────────
CREATE INDEX idx_sinhala_name ON product_translations(sinhala_name)
Purpose: Exact and prefix searches
Performance: Good for LIKE 'prefix%'

Full-Text Index (GIN - PostgreSQL):
──────────────────────────────────
CREATE INDEX idx_sinhala_name_fts 
ON product_translations 
USING gin(to_tsvector('simple', sinhala_name))
Purpose: Full-text search
Performance: Excellent for complex text queries

Trigram Index (GIN - PostgreSQL):
────────────────────────────────
CREATE INDEX idx_sinhala_name_trgm 
ON product_translations 
USING gin(sinhala_name gin_trgm_ops)
Purpose: Fuzzy matching, typo tolerance
Performance: Good for similarity searches
```

### Query Examples

```
Basic Search (Contains):
───────────────────────
ProductTranslation.objects.filter(
    sinhala_name__icontains='කිරි'
)

Multiple Terms (AND):
────────────────────
ProductTranslation.objects.filter(
    sinhala_name__icontains='කිරි'
).filter(
    sinhala_name__icontains='අංකර'
)

PostgreSQL Full-Text Search:
──────────────────────────
from django.contrib.postgres.search import SearchVector

ProductTranslation.objects.annotate(
    search=SearchVector('sinhala_name')
).filter(search='කිරි')

Trigram Similarity (PostgreSQL):
───────────────────────────────
from django.contrib.postgres.search import TrigramSimilarity

ProductTranslation.objects.annotate(
    similarity=TrigramSimilarity('sinhala_name', 'කිරි')
).filter(similarity__gt=0.3).order_by('-similarity')
```

### Admin Interface Display

```
Admin List View:
───────────────
┌────────────────────────┬─────────────────────────────┬─────────┐
│ Product                │ Sinhala Name                │ Status  │
├────────────────────────┼─────────────────────────────┼─────────┤
│ Anchor Milk            │ අංකර කිරි                  │ Active  │
│ Basmati Rice           │ බාස්මති බත්                │ Active  │
│ Sunlight Soap          │ සන්ලයිට් සබන්               │ Active  │
└────────────────────────┴─────────────────────────────┴─────────┘

Admin Search:
├── Search by English name
├── Search by Sinhala name
└── Filter by category
```

### Validation Considerations

```
Sinhala Character Validation:
────────────────────────────
- Allow Sinhala Unicode (U+0D80-U+0DFF)
- Allow English letters (for brand names)
- Allow numbers (for sizes/weights)
- Allow spaces and punctuation

Example Regex:
^[\u0D80-\u0DFF\u0020-\u007E\u00A0-\u00FF]+$
  ├── \u0D80-\u0DFF: Sinhala characters
  ├── \u0020-\u007E: Basic Latin (English, numbers)
  └── \u00A0-\u00FF: Extended Latin
```

### Expected Outcome
- sinhala_name field added to ProductTranslation model
- Field stores full product names in Sinhala
- Indexed for efficient text search
- Search queries can find products by Sinhala terms
- Admin interface displays Sinhala properly

### Verification Checklist
- [ ] sinhala_name field added to ProductTranslation model
- [ ] Field type is CharField with max_length=200
- [ ] db_index=True for search performance
- [ ] verbose_name set appropriately
- [ ] Field marked as required
- [ ] Unicode validation considered
- [ ] Admin search includes sinhala_name
- [ ] Text search strategy documented

---

## Task 15: Create Dictionary Migrations

### Overview
Generate Django migrations for all three dictionary models (SinhalaWord, Transliteration, ProductTranslation). Migrations create the necessary database tables, columns, indexes, and constraints. This task includes running makemigrations to generate migration files, reviewing the generated SQL, and applying migrations to create the database schema.

### Dependencies
- Task 07: Create frequency Field (SinhalaWord complete)
- Task 11: Create is_common Field (Transliteration complete)
- Task 14: Create sinhala_name Field (ProductTranslation complete)

### Instructions

1. **Verify all models are complete**
   - SinhalaWord model with all 7 fields
   - Transliteration model with all 3 fields
   - ProductTranslation model with all 2 fields
   - All models registered in `__init__.py`

2. **Ensure search app is in INSTALLED_APPS**
   - Check `settings.py` or `settings/base.py`
   - Verify 'apps.search' or full path is listed
   - App must be registered for migrations

3. **Run makemigrations command**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations search`
   - Or: `python manage.py makemigrations sinhaglish` if separate app

4. **Review generated migration file**
   - Navigate to `apps/search/migrations/` directory
   - Open the new migration file (e.g., `0001_initial.py`)
   - Verify all models and fields included

5. **Check migration operations**
   - Verify CreateModel operations for all 3 models
   - Check field definitions match model code
   - Verify indexes, unique constraints, foreign keys
   - Ensure unique_together constraints present

6. **Review SQL (optional)**
   - Run: `python manage.py sqlmigrate search 0001`
   - Review generated SQL statements
   - Verify table names, columns, constraints
   - Check index creation statements

7. **Apply migrations to database**
   - Run: `python manage.py migrate search`
   - Verify successful migration
   - Check for any errors or warnings

8. **Verify database schema**
   - Connect to database
   - List tables to confirm creation
   - Check table structures match models
   - Verify indexes and constraints applied

### Migration File Structure

```
Migration File: 0001_initial.py
──────────────────────────────
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
        ('inventory', '0001_initial'),  # Product model
    ]
    
    operations = [
        migrations.CreateModel(
            name='SinhalaWord',
            fields=[
                ('id', models.BigAutoField(...)),
                ('sinhala_text', models.CharField(...)),
                ('romanized', models.CharField(...)),
                # ... all other fields
            ],
            options={
                'verbose_name': 'Sinhala Word',
                'ordering': ['romanized'],
            },
        ),
        migrations.CreateModel(
            name='Transliteration',
            fields=[...],
        ),
        migrations.CreateModel(
            name='ProductTranslation',
            fields=[...],
        ),
        # Indexes and constraints
    ]
```

### Expected Database Tables

```
Database Schema After Migration:
───────────────────────────────

Table: sinhala_words
┌─────┬──────────────┬────────────┬─────────────────┬──────────────┬──────────┬───────────┐
│ id  │ sinhala_text │ romanized  │ english_meaning │ phonetic_key │ category │ frequency │
├─────┼──────────────┼────────────┼─────────────────┼──────────────┼──────────┼───────────┤
│ PK  │ Char(100)    │ Char(100)  │ Char(200)       │ Char(20)     │ Char(50) │ Integer   │
│     │ Unique       │ Unique     │                 │              │          │ Default=0 │
│     │ Indexed      │ Indexed    │                 │ Indexed      │ Indexed  │ Indexed   │
└─────┴──────────────┴────────────┴─────────────────┴──────────────┴──────────┴───────────┘

Table: transliterations
┌─────┬─────────┬─────────────┬────────────┐
│ id  │ word_id │ variant     │ is_common  │
├─────┼─────────┼─────────────┼────────────┤
│ PK  │ FK      │ Char(100)   │ Boolean    │
│     │ Indexed │ Indexed     │ Default=F  │
│     │         │             │            │
└─────┴─────────┴─────────────┴────────────┘
        ↓ FK to sinhala_words(id) CASCADE
        ↓ Unique together: (word_id, variant)

Table: product_translations
┌─────┬────────────┬────────────────┬──────────┐
│ id  │ product_id │ sinhala_name   │ word_id  │
├─────┼────────────┼────────────────┼──────────┤
│ PK  │ 1-to-1 FK  │ Char(200)      │ FK (opt) │
│     │ Unique     │ Indexed        │          │
│     │ Indexed    │                │          │
└─────┴────────────┴────────────────┴──────────┘
        ↓ FK to products(id) CASCADE
        ↓ One-to-One (unique constraint)
```

### Constraints and Indexes Summary

| Model | Constraint/Index | Purpose |
|-------|------------------|---------|
| SinhalaWord | UNIQUE(sinhala_text) | No duplicate words |
| SinhalaWord | UNIQUE(romanized) | No duplicate romanizations |
| SinhalaWord | INDEX(romanized) | Fast search |
| SinhalaWord | INDEX(phonetic_key) | Phonetic search |
| SinhalaWord | INDEX(category) | Filtered queries |
| SinhalaWord | INDEX(frequency) | Sorting by popularity |
| Transliteration | FK(word_id) | Link to SinhalaWord |
| Transliteration | INDEX(variant) | Fast variant search |
| Transliteration | UNIQUE(word_id, variant) | No duplicate variants |
| ProductTranslation | FK(product_id) | Link to Product |
| ProductTranslation | UNIQUE(product_id) | One translation per product |
| ProductTranslation | INDEX(sinhala_name) | Text search |

### Migration Commands

```
Generate Migrations:
───────────────────
python manage.py makemigrations search

Expected Output:
Migrations for 'search':
  search/migrations/0001_initial.py
    - Create model SinhalaWord
    - Create model Transliteration
    - Create model ProductTranslation

View Generated SQL:
──────────────────
python manage.py sqlmigrate search 0001

Apply Migrations:
────────────────
python manage.py migrate search

Expected Output:
Running migrations:
  Applying search.0001_initial... OK

Check Migration Status:
──────────────────────
python manage.py showmigrations search

Expected Output:
search
 [X] 0001_initial
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| App not found | Not in INSTALLED_APPS | Add app to settings |
| No changes detected | Models not registered | Check `__init__.py` imports |
| Dependency error | Missing related model | Ensure dependency apps migrated first |
| Foreign key error | Target model not found | Check import paths |
| Constraint violation | Invalid default values | Review field defaults |

### Rollback Plan

```
If Migration Fails:
──────────────────
1. Review error message
2. Fix model issues
3. Delete migration file if necessary:
   rm apps/search/migrations/0001_initial.py
4. Regenerate migrations
5. Apply again

Rollback to Previous State:
─────────────────────────
python manage.py migrate search zero
# Undoes all migrations for search app
```

### Expected Outcome
- Migration file generated successfully
- All three models included in migration
- All fields, constraints, and indexes defined
- Migrations applied to database
- Database schema created correctly
- Tables ready for data population

### Verification Checklist
- [ ] Migration file generated (`0001_initial.py`)
- [ ] SinhalaWord model included in migration
- [ ] Transliteration model included in migration
- [ ] ProductTranslation model included in migration
- [ ] All fields defined correctly
- [ ] Foreign keys and constraints present
- [ ] Indexes created for search fields
- [ ] Migrations applied successfully (`migrate` command)
- [ ] Database tables created
- [ ] No migration errors or warnings

---

## Task 16: Verify Models

### Overview
Perform comprehensive verification of all dictionary models to ensure they function correctly, meet requirements, and are ready for data population. This includes Django shell testing, admin interface verification, query performance checks, relationship validation, and constraint testing.

### Dependencies
- Task 15: Create Dictionary Migrations

### Instructions

1. **Open Django shell**
   - Run: `python manage.py shell`
   - Import all models for testing
   - Verify imports work correctly

2. **Test SinhalaWord model creation**
   - Create sample SinhalaWord instance
   - Set all required fields
   - Save to database
   - Verify successful creation

3. **Test Transliteration model**
   - Create Transliteration linked to SinhalaWord
   - Test variant field
   - Test is_common flag
   - Verify foreign key relationship

4. **Test ProductTranslation model**
   - Create ProductTranslation linked to Product
   - Test sinhala_name field
   - Verify one-to-one relationship
   - Test reverse accessor

5. **Verify model relationships**
   - Test forward queries (FK → related model)
   - Test reverse queries (related_name)
   - Verify cascade deletion
   - Test select_related optimization

6. **Test model constraints**
   - Test unique constraints (duplicate detection)
   - Test unique_together (word, variant)
   - Test one-to-one constraint (product)
   - Verify constraint violations raise errors

7. **Verify model methods**
   - Test `__str__` methods return correctly
   - Check phonetic_key calculation (if auto)
   - Test any custom model methods

8. **Test admin interface**
   - Access Django admin
   - Verify all models appear in admin
   - Test create, read, update, delete operations
   - Check list_display, search, filters

9. **Verify indexes (database)**
   - Connect to database
   - List indexes on tables
   - Verify expected indexes created
   - Check index names

10. **Run basic queries**
    - Test search queries on romanized field
    - Test variant lookups
    - Test product translation search
    - Verify query performance

11. **Test data integrity**
    - Verify NULL constraints enforced
    - Test default values applied
    - Check field max_lengths enforced
    - Validate data types

12. **Document verification results**
    - Record successful tests
    - Note any issues found
    - Document workarounds if needed
    - Create verification report

### Django Shell Test Script

```python
# Import models
from apps.search.sinhaglish.models import (
    SinhalaWord, Transliteration, ProductTranslation
)
from apps.inventory.models import Product

# Test 1: Create SinhalaWord
word = SinhalaWord.objects.create(
    sinhala_text='කිරි',
    romanized='kiri',
    english_meaning='Milk',
    phonetic_key='K600',
    category='GROCERY',
    frequency=0
)
print(f"Created: {word}")  # Output: kiri (කිරි)

# Test 2: Create Transliteration
trans1 = Transliteration.objects.create(
    word=word,
    variant='keeri',
    is_common=True
)
trans2 = Transliteration.objects.create(
    word=word,
    variant='kere',
    is_common=False
)
print(f"Variants: {word.transliterations.count()}")  # Output: 2

# Test 3: Query variants
variants = word.transliterations.values_list('variant', flat=True)
print(list(variants))  # Output: ['keeri', 'kere']

# Test 4: Find word by variant
found_trans = Transliteration.objects.get(variant='keeri')
print(f"Found word: {found_trans.word.romanized}")  # Output: kiri

# Test 5: Create ProductTranslation
product = Product.objects.first()  # Get any product
prod_trans = ProductTranslation.objects.create(
    product=product,
    sinhala_name='අංකර කිරි'
)
print(f"Product translation: {prod_trans}")

# Test 6: Reverse accessor
print(f"Product's Sinhala name: {product.translation.sinhala_name}")

# Test 7: Search by Sinhala name
results = ProductTranslation.objects.filter(
    sinhala_name__icontains='කිරි'
)
print(f"Found {results.count()} products with කිරි")

# Test 8: Unique constraint test (should fail)
try:
    duplicate = SinhalaWord.objects.create(
        sinhala_text='කිරි',  # Duplicate!
        romanized='kiri2',
        english_meaning='Milk',
    )
except Exception as e:
    print(f"Unique constraint working: {type(e).__name__}")

# Test 9: Cascade deletion test
word_id = word.id
trans_count = Transliteration.objects.filter(word_id=word_id).count()
print(f"Transliterations before delete: {trans_count}")
word.delete()
trans_count_after = Transliteration.objects.filter(word_id=word_id).count()
print(f"Transliterations after delete: {trans_count_after}")  # Should be 0

# Test 10: Performance test
import time
start = time.time()
words = SinhalaWord.objects.filter(romanized__istartswith='k')[:10]
for w in words:
    variants = w.transliterations.all()  # N+1 query issue!
print(f"Slow query time: {time.time() - start}s")

start = time.time()
words = SinhalaWord.objects.prefetch_related('transliterations').filter(
    romanized__istartswith='k'
)[:10]
for w in words:
    variants = list(w.transliterations.all())  # Optimized!
print(f"Optimized query time: {time.time() - start}s")
```

### Verification Checklist

```
Model Creation:
───────────────
[ ] SinhalaWord instances can be created
[ ] All fields accept valid data
[ ] Unique constraints work
[ ] Default values applied
[ ] __str__ method works

SinhalaWord Fields:
──────────────────
[ ] sinhala_text stores Unicode correctly
[ ] romanized is indexed and searchable
[ ] english_meaning accepts long text
[ ] phonetic_key calculates correctly
[ ] category choices work
[ ] frequency defaults to 0 and increments

Transliteration Model:
─────────────────────
[ ] Transliteration instances can be created
[ ] word FK links to SinhalaWord
[ ] variant field is searchable
[ ] is_common flag works
[ ] unique_together prevents duplicates
[ ] Cascade deletion works

ProductTranslation Model:
────────────────────────
[ ] ProductTranslation instances can be created
[ ] product OneToOne FK works
[ ] sinhala_name stores Unicode correctly
[ ] Reverse accessor (product.translation) works
[ ] One-to-one constraint prevents duplicates
[ ] Cascade deletion works

Relationships:
─────────────
[ ] SinhalaWord → Transliteration (1-to-many)
[ ] Product → ProductTranslation (1-to-1)
[ ] Forward queries work
[ ] Reverse queries work
[ ] select_related optimization works
[ ] prefetch_related optimization works

Queries:
───────
[ ] Search by romanized field
[ ] Search by variant field
[ ] Search by sinhala_name (ILIKE)
[ ] Filter by category
[ ] Order by frequency
[ ] Join queries efficient

Admin Interface:
───────────────
[ ] All models appear in admin
[ ] List views display correctly
[ ] Create forms work
[ ] Edit forms work
[ ] Delete confirmation works
[ ] Search functionality works
[ ] Filters work
[ ] Inline editing (if configured)

Database:
────────
[ ] Tables created correctly
[ ] Indexes present on key fields
[ ] Foreign key constraints exist
[ ] Unique constraints exist
[ ] Cascade rules configured
[ ] Column types correct

Data Integrity:
──────────────
[ ] NULL constraints enforced
[ ] Max length constraints enforced
[ ] Choice field validation works
[ ] Foreign key validation works
[ ] Default values correct
```

### Common Issues and Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Unicode not displaying | � characters shown | Check database charset (UTF-8) |
| Unique constraint error | Cannot save duplicate | Check for existing records |
| Foreign key error | Related object not found | Create related object first |
| N+1 query problem | Slow performance | Use select_related/prefetch_related |
| Admin 500 error | Admin page crashes | Check `__str__` method doesn't error |
| Search not working | No results found | Verify indexes created |

### Performance Benchmarks

```
Expected Query Performance:
──────────────────────────
Search by romanized (indexed):
├── < 10ms for exact match
├── < 50ms for prefix match
└── < 100ms for contains match

Search by variant (indexed):
├── < 10ms for exact match
└── < 50ms for prefix match

Search by sinhala_name (indexed):
├── < 50ms for contains match
└── < 20ms with full-text index

Join queries (with select_related):
├── < 50ms for simple joins
└── < 200ms for complex joins

If queries exceed these benchmarks:
├── Check indexes exist
├── Analyze query execution plan
├── Consider additional indexes
└── Review database configuration
```

### Expected Outcome
- All models function correctly
- Relationships work as designed
- Constraints enforce data integrity
- Admin interface fully operational
- Query performance acceptable
- Models ready for data population
- No critical issues identified

### Verification Report Template

```
Dictionary Models Verification Report
====================================

Date: [Date]
Environment: [Development/Staging/Production]
Database: [PostgreSQL/MySQL/etc.]

Model Status:
├── SinhalaWord: ✓ Verified
├── Transliteration: ✓ Verified
└── ProductTranslation: ✓ Verified

Tests Passed: 25/25
Tests Failed: 0/25

Issues Found:
└── None

Performance:
├── Average query time: 15ms
├── Join query time: 45ms
└── Admin load time: 1.2s

Recommendations:
├── Add full-text index on sinhala_name for better search
├── Consider materialized view for popular words
└── Monitor frequency field updates for optimization

Sign-off:
└── [Developer Name] - [Date]
```

---

## Summary

This document completed the dictionary model implementation by creating the ProductTranslation model to link products with Sinhala names, generating Django migrations for all three models, and performing comprehensive verification to ensure the system is ready for data population and integration with the search functionality.

### Completed Tasks
12. ✓ Created ProductTranslation model foundation
13. ✓ Added product one-to-one foreign key
14. ✓ Added sinhala_name field for product translations
15. ✓ Generated and applied database migrations
16. ✓ Verified all models, relationships, and constraints

### Complete Data Model

```
┌────────────────────────────┐
│      SinhalaWord           │
├────────────────────────────┤
│ - sinhala_text (Unicode)   │
│ - romanized (Sinhaglish)   │
│ - english_meaning          │
│ - phonetic_key             │
│ - category                 │
│ - frequency                │
└────────────────────────────┘
         ↑          ↑
         │          │
         │          │ (one-to-many)
         │          │
         │   ┌──────┴────────────┐
         │   │  Transliteration  │
         │   ├───────────────────┤
         │   │ - word_id (FK)    │
         │   │ - variant         │
         │   │ - is_common       │
         │   └───────────────────┘
         │
         │ (optional FK)
         │
┌────────┴─────────────────┐      ┌──────────────┐
│  ProductTranslation      │      │   Product    │
├──────────────────────────┤      │   (ERP)      │
│ - product_id (1-to-1 FK)│◄─────┤              │
│ - sinhala_name           │      │              │
│ - word_id (FK, optional) │      │              │
└──────────────────────────┘      └──────────────┘
```

### Database Schema Summary

```
Tables Created:
──────────────
1. sinhala_words
   ├── 7 fields
   ├── 5 indexes
   └── 2 unique constraints

2. transliterations
   ├── 3 fields
   ├── 2 indexes
   ├── 1 FK constraint
   └── 1 unique_together constraint

3. product_translations
   ├── 2 fields
   ├── 2 indexes
   ├── 1 OneToOne FK constraint
   └── 1 unique constraint
```

### Next Steps
Proceed to Group-B (Core Dictionary) to:
- Populate SinhalaWord with core vocabulary
- Add common transliterations
- Create initial product translations
- Implement dictionary management tools
- Set up phonetic key generation
- Build search indexing system

### Key Achievements
- ✓ Complete dictionary model architecture
- ✓ Multi-model relationships established
- ✓ Database schema optimized for search
- ✓ Proper indexing for performance
- ✓ Data integrity constraints enforced
- ✓ Unicode support verified
- ✓ Admin interface operational
- ✓ Models ready for production use

### Files Created

```
backend/apps/search/sinhaglish/
├── models/
│   ├── __init__.py
│   ├── sinhala_word.py         # Task 01
│   ├── transliteration.py      # Task 08
│   └── product_translation.py  # Task 12
└── migrations/
    └── 0001_initial.py         # Task 15
```
