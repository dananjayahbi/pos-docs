# Tasks 10-16: SearchConfig Model and Migration

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** A - Search Engine Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_Install-Client.md](01_Tasks-01-09_Install-Client.md)

---

## Document Overview

This document covers the creation of the SearchConfig model for tenant-specific search configuration management. It establishes a database-backed configuration system that allows each tenant to customize their search behavior, including searchable attributes, filterable fields, and ranking rules, with proper Django migrations and MeiliSearch connectivity verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create SearchConfig Model | Medium | 40 min |
| 11 | Create is_enabled Field | Low | 10 min |
| 12 | Create searchable_attrs Field | Low | 15 min |
| 13 | Create filterable_attrs Field | Low | 15 min |
| 14 | Create ranking_rules Field | Low | 20 min |
| 15 | Create Search Migrations | Low | 15 min |
| 16 | Verify MeiliSearch Connection | Low | 25 min |

---

## Task 10: Create SearchConfig Model

### Overview
Create the SearchConfig model to store per-tenant search configuration in the database. This model will establish a OneToOne relationship with the Tenant model, allowing each tenant to have customized search settings that control how MeiliSearch indexes and searches their data, providing flexibility and tenant-specific optimization.

### Dependencies
- Task 09: Create tenant_index_name Method completed
- Tenant model established in multi-tenancy system
- Django models structure in search app

### Instructions

1. **Create models directory structure**
   - Navigate to `backend/apps/search/` directory
   - Create `models/` subdirectory if not exists
   - Add `__init__.py` to make it a Python package

2. **Create SearchConfig model file**
   - Create `search_config.py` in `apps/search/models/`
   - Import necessary Django model components
   - Import Tenant model from appropriate app

3. **Define SearchConfig model class**
   - Create class inheriting from Django Model
   - Add proper model metadata and documentation
   - Plan for tenant relationship and configuration fields

4. **Implement tenant relationship**
   - Add OneToOneField to Tenant model
   - Use `on_delete=models.CASCADE` for proper cleanup
   - Set `related_name='search_config'` for reverse access

5. **Add model metadata**
   - Configure model Meta class with table name
   - Add verbose names for admin interface
   - Set ordering and default permissions

6. **Implement model methods**
   - Add `__str__` method for readable representation
   - Create `save` method for custom validation
   - Plan for configuration validation methods

7. **Add model documentation**
   - Include docstring explaining model purpose
   - Document relationship to tenant and MeiliSearch
   - Explain configuration field purposes

### Model Structure Design

```
SearchConfig Model
├── tenant (OneToOneField)     # Tenant relationship
├── is_enabled (BooleanField)  # Task 11
├── searchable_attrs (JSONField)  # Task 12
├── filterable_attrs (JSONField)  # Task 13
├── ranking_rules (JSONField)     # Task 14
├── created_at (DateTimeField)
├── updated_at (DateTimeField)
└── methods and metadata
```

### Tenant Relationship

| Relationship | Configuration | Purpose |
|--------------|---------------|---------|
| OneToOneField | tenant → search_config | Single config per tenant |
| CASCADE Delete | Cleanup on tenant deletion | Data integrity |
| Related Name | 'search_config' | Easy reverse access |

### Model Metadata Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| db_table | 'search_config' | Database table name |
| verbose_name | 'Search Configuration' | Admin display |
| verbose_name_plural | 'Search Configurations' | Admin display |
| ordering | ['-updated_at'] | Default ordering |

### Default Configuration Values

```
Default Search Configuration:
├── is_enabled: True
├── searchable_attrs: ["name", "sku", "description"]
├── filterable_attrs: ["category_id", "brand", "price"]
└── ranking_rules: MeiliSearch defaults
```

### Model Method Responsibilities

| Method | Purpose | Implementation |
|--------|---------|----------------|
| `__str__` | String representation | f"{tenant.name} Search Config" |
| `save()` | Custom validation | Validate JSON fields |
| `get_index_settings()` | MeiliSearch format | Convert to API format |
| `apply_to_index()` | Update index | Apply settings to MeiliSearch |

### Database Relationship Diagram

```
Tenant Model ←→ SearchConfig Model
     │                   │
     ├── name            ├── is_enabled
     ├── domain          ├── searchable_attrs
     └── created_at      ├── filterable_attrs
                         └── ranking_rules
```

### Expected Outcome
- SearchConfig model created with proper tenant relationship
- Model structure ready for configuration fields
- Database relationship established with appropriate constraints
- Foundation for tenant-specific search customization

### Verification Checklist
- [ ] `apps/search/models/search_config.py` file created
- [ ] SearchConfig class inherits from Django Model
- [ ] OneToOneField to Tenant model implemented
- [ ] Model Meta class configured properly
- [ ] __str__ method provides readable representation
- [ ] Model imports and dependencies resolved
- [ ] Model ready for field additions

---

## Task 11: Create is_enabled Field

### Overview
Add the `is_enabled` boolean field to the SearchConfig model to control whether search functionality is active for each tenant. This field provides a simple toggle mechanism to enable or disable search features per tenant, supporting gradual rollouts, maintenance modes, and tenant-specific feature management.

### Dependencies
- Task 10: Create SearchConfig Model completed
- Understanding of Django BooleanField implementation
- Tenant-specific feature control requirements

### Instructions

1. **Add is_enabled field to SearchConfig model**
   - Open `apps/search/models/search_config.py`
   - Add BooleanField with appropriate configuration
   - Position field logically within model structure

2. **Configure field properties**
   - Set `default=True` to enable search by default
   - Add `help_text` explaining field purpose
   - Use descriptive `verbose_name` for admin interface

3. **Add field validation**
   - Consider any business rules for enabling/disabling
   - Plan for validation in model save method
   - Ensure field behavior is predictable

4. **Implement field-related methods**
   - Add property methods for easier access
   - Create helper methods for status checking
   - Plan integration with SearchClient

5. **Document field behavior**
   - Add inline comments explaining field usage
   - Document impact on search operations
   - Explain default value reasoning

6. **Plan field usage patterns**
   - How field affects search operations
   - Integration with search middleware
   - Admin interface behavior

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | BooleanField | True/False toggle |
| Default Value | True | Search enabled by default |
| Null/Blank | False/False | Required field |
| Help Text | Explanatory text | Admin guidance |

### Field Usage Scenarios

| Scenario | is_enabled Value | Behavior |
|----------|------------------|----------|
| Normal Operation | True | Search fully functional |
| Maintenance Mode | False | Search disabled temporarily |
| New Tenant | True | Search available immediately |
| Feature Rollback | False | Quick search disable |

### Integration with Search Operations

```
Search Operation Check:
1. Get tenant search config
2. Check is_enabled field
3. If True: Proceed with search
4. If False: Return empty results or error
```

### Admin Interface Impact

| Admin Action | Field Display | Behavior |
|-------------|---------------|----------|
| List View | Checkbox icon | Quick status view |
| Edit Form | Checkbox field | Easy toggle |
| Bulk Action | Mass enable/disable | Batch operations |

### Business Logic Integration

```
def perform_search(tenant, query):
    config = tenant.search_config
    if not config.is_enabled:
        return SearchResult.empty()
    # Proceed with search...
```

### Field Validation Rules

| Validation | Check | Purpose |
|------------|-------|---------|
| Type Check | Boolean only | Data integrity |
| Not Null | Value required | Prevent undefined state |
| Business Rules | Custom validation | Tenant-specific rules |

### Expected Outcome
- is_enabled field successfully added to SearchConfig model
- Field properly configured with sensible defaults
- Admin interface integration working
- Foundation for search feature control established

### Verification Checklist
- [ ] is_enabled BooleanField added to SearchConfig
- [ ] Default value set to True
- [ ] Help text and verbose name configured
- [ ] Field positioned logically in model
- [ ] No migration conflicts introduced
- [ ] Admin interface displays field correctly

---

## Task 12: Create searchable_attrs Field

### Overview
Add the `searchable_attrs` JSONField to the SearchConfig model to define which document attributes are searchable for each tenant. This field stores a list of field names that MeiliSearch will use for full-text search operations, allowing tenants to customize which product/document fields are included in search queries.

### Dependencies
- Task 11: Create is_enabled Field completed
- Understanding of MeiliSearch searchable attributes
- Knowledge of common product/document fields

### Instructions

1. **Add searchable_attrs JSONField**
   - Add field to SearchConfig model after is_enabled
   - Use Django JSONField for flexible attribute storage
   - Configure appropriate field properties

2. **Set default searchable attributes**
   - Define sensible defaults for product search
   - Include common fields: name, sku, description
   - Consider category names and brand information

3. **Configure field validation**
   - Ensure field contains list of strings
   - Validate attribute names against available fields
   - Prevent empty or invalid attribute lists

4. **Add field documentation**
   - Include help text explaining attribute selection
   - Document impact on search performance
   - Provide examples of common attributes

5. **Implement attribute validation methods**
   - Create method to validate attribute names
   - Check attributes against model fields
   - Ensure attributes exist in indexed documents

6. **Plan MeiliSearch integration**
   - Format for MeiliSearch API calls
   - Method to apply attributes to index settings
   - Integration with SearchClient functionality

### Default Searchable Attributes

| Attribute | Purpose | Search Priority |
|-----------|---------|----------------|
| name | Product/item name | High |
| sku | Product identifier | High |
| description | Detailed description | Medium |
| brand | Brand/manufacturer | Medium |
| category_name | Category information | Low |

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Flexible list storage |
| Default | ["name", "sku", "description"] | Common search fields |
| Blank/Null | False/False | Required configuration |
| Help Text | Attribute selection guidance | Admin help |

### JSON Structure Example

```json
{
  "searchable_attrs": [
    "name",
    "sku", 
    "description",
    "brand",
    "category_name"
  ]
}
```

### MeiliSearch Integration Format

| Django Format | MeiliSearch API Format | Purpose |
|---------------|------------------------|---------|
| ["name", "sku"] | {"searchableAttributes": ["name", "sku"]} | API call format |
| List of strings | JSON array | Attribute specification |
| Field validation | API validation | Error prevention |

### Common Attribute Combinations

| Use Case | Searchable Attributes | Reasoning |
|----------|----------------------|-----------|
| Basic Product | name, sku, description | Core product info |
| Rich Product | name, sku, description, brand, category | Enhanced search |
| Minimal Search | name, sku | Performance optimized |
| Full Content | All text fields | Maximum discoverability |

### Validation Rules

```
Validation Checks:
├── Field type: List of strings
├── Non-empty list required
├── Valid attribute names only
├── No duplicate attributes
└── Attributes exist in indexed data
```

### Performance Considerations

| Factor | Impact | Recommendation |
|--------|--------|----------------|
| Number of Attributes | More = slower indexing | Use essential fields only |
| Attribute Length | Longer = more storage | Consider field size |
| Update Frequency | Changes require reindexing | Plan updates carefully |

### Expected Outcome
- searchable_attrs field successfully added to SearchConfig
- Default attributes configured for typical product search
- Field validation ensuring data integrity
- Foundation for customizable search scope per tenant

### Verification Checklist
- [ ] searchable_attrs JSONField added to SearchConfig
- [ ] Default value set to ["name", "sku", "description"]
- [ ] Field validation for list format
- [ ] Help text explains attribute selection
- [ ] JSON structure properly formatted
- [ ] Integration planning with MeiliSearch API

---

## Task 13: Create filterable_attrs Field

### Overview
Add the `filterable_attrs` JSONField to the SearchConfig model to define which document attributes can be used for filtering search results. This field enables tenants to specify which fields support filtering operations like category filtering, price ranges, brand selection, and other faceted search capabilities in MeiliSearch.

### Dependencies
- Task 12: Create searchable_attrs Field completed
- Understanding of MeiliSearch filterable attributes
- Knowledge of common filtering requirements

### Instructions

1. **Add filterable_attrs JSONField**
   - Add field to SearchConfig model after searchable_attrs
   - Use JSONField for storing list of filterable attribute names
   - Configure field properties for optimal usage

2. **Set default filterable attributes**
   - Include commonly filtered fields for e-commerce
   - Focus on categorical and numeric fields suitable for filtering
   - Consider price, category, brand, and status fields

3. **Configure filterable field validation**
   - Ensure field contains valid attribute names
   - Validate attributes are appropriate for filtering
   - Check field types support filtering operations

4. **Add comprehensive field documentation**
   - Explain difference between searchable and filterable
   - Document filter operation types supported
   - Provide examples of effective filtering attributes

5. **Implement filter validation methods**
   - Validate attribute names against available data fields
   - Check attribute data types for filter compatibility
   - Ensure filterable attributes have appropriate indexes

6. **Plan filter integration with MeiliSearch**
   - Format attributes for MeiliSearch filterableAttributes setting
   - Integration with search query filter parameters
   - Facet counting and aggregation support

### Default Filterable Attributes

| Attribute | Data Type | Filter Purpose |
|-----------|-----------|----------------|
| category_id | Integer | Category filtering |
| brand | String | Brand selection |
| price | Float | Price range filtering |
| status | String | Availability status |
| in_stock | Boolean | Stock availability |

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Flexible attribute storage |
| Default | ["category_id", "brand", "price"] | Common filter fields |
| Blank/Null | False/False | Required configuration |
| Help Text | Filter attribute guidance | Admin assistance |

### JSON Structure Example

```json
{
  "filterable_attrs": [
    "category_id",
    "brand",
    "price", 
    "status",
    "in_stock",
    "created_at"
  ]
}
```

### Filter Type Compatibility

| Attribute Type | Supported Filters | Examples |
|----------------|------------------|----------|
| String | Exact match, IN list | brand = "Nike" |
| Integer | Range, comparison | price > 100 |
| Boolean | Exact match | in_stock = true |
| Date | Range, comparison | created_at > "2025-01-01" |

### MeiliSearch Filter Operations

| Operation | Syntax | Use Case |
|-----------|--------|----------|
| Equality | attribute = value | Exact matches |
| Range | attribute > value | Numeric ranges |
| List | attribute IN [a,b,c] | Multiple values |
| Boolean | attribute = true/false | Binary states |

### Common Filter Combinations

| Use Case | Filterable Attributes | Query Example |
|----------|----------------------|---------------|
| E-commerce | category_id, brand, price | category_id = 1 AND price > 50 |
| Inventory | in_stock, warehouse_id | in_stock = true AND warehouse_id IN [1,2] |
| CRM | status, created_at | status = "active" AND created_at > "2025-01-01" |

### Performance Impact

| Factor | Impact | Optimization |
|--------|--------|--------------|
| Number of Filters | Slower with more | Use essential fields only |
| Filter Complexity | Complex filters slower | Simplify filter logic |
| Index Size | Larger with more filters | Balance features vs performance |

### Validation Rules

```
Filterable Attribute Validation:
├── Valid field names only
├── Appropriate data types for filtering  
├── No duplicate attributes
├── Compatible with MeiliSearch filters
└── Performance consideration warnings
```

### Expected Outcome
- filterable_attrs field successfully added to SearchConfig
- Default filterable attributes configured for common filtering needs
- Field validation ensuring filter compatibility
- Foundation for faceted search and filtering capabilities

### Verification Checklist
- [ ] filterable_attrs JSONField added to SearchConfig
- [ ] Default value set to ["category_id", "brand", "price"]
- [ ] Field validation for appropriate attribute types
- [ ] Help text explains filterable vs searchable
- [ ] JSON structure validates correctly
- [ ] Filter operation compatibility documented

---

## Task 14: Create ranking_rules Field

### Overview
Add the `ranking_rules` JSONField to the SearchConfig model to define custom search result ranking criteria for each tenant. This field allows tenants to customize how MeiliSearch prioritizes and orders search results, including built-in ranking rules like words, typo tolerance, proximity, and custom sorting rules for business-specific priorities.

### Dependencies
- Task 13: Create filterable_attrs Field completed
- Understanding of MeiliSearch ranking rules system
- Knowledge of search relevance optimization

### Instructions

1. **Add ranking_rules JSONField**
   - Add field to SearchConfig model after filterable_attrs
   - Use JSONField to store ordered list of ranking rules
   - Configure field for MeiliSearch ranking rule format

2. **Set default ranking rules**
   - Use MeiliSearch default ranking rules as baseline
   - Include: words, typo, proximity, attribute, sort, exactness
   - Order rules by typical relevance importance

3. **Configure custom ranking rule support**
   - Support for custom sort attributes (price, popularity, date)
   - Allow ascending and descending sort directions
   - Plan for business-specific ranking criteria

4. **Add ranking rule validation**
   - Validate rule names against MeiliSearch supported rules
   - Check custom sort attributes exist in indexed data
   - Ensure rule order is logical and effective

5. **Document ranking rule behavior**
   - Explain each default ranking rule purpose
   - Document impact of rule order on search results
   - Provide examples of effective custom rules

6. **Implement rule application methods**
   - Method to format rules for MeiliSearch API
   - Validation of custom sort attributes
   - Integration with index configuration updates

### Default Ranking Rules

| Order | Rule | Purpose |
|-------|------|---------|
| 1 | words | Number of matched words |
| 2 | typo | Typo tolerance |  
| 3 | proximity | Word proximity in document |
| 4 | attribute | Searchable attribute priority |
| 5 | sort | Custom sorting criteria |
| 6 | exactness | Exact match preference |

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Ordered rule storage |
| Default | MeiliSearch defaults | Standard ranking |
| Blank/Null | False/False | Required configuration |
| Help Text | Ranking rule guidance | Admin help |

### JSON Structure Example

```json
{
  "ranking_rules": [
    "words",
    "typo", 
    "proximity",
    "attribute",
    "sort",
    "exactness"
  ]
}
```

### Custom Ranking Rules

| Custom Rule | Syntax | Purpose |
|-------------|--------|---------|
| Price Ascending | "price:asc" | Cheapest first |
| Price Descending | "price:desc" | Most expensive first |
| Popularity | "popularity:desc" | Popular items first |
| Date | "created_at:desc" | Newest first |

### Business-Specific Ranking Examples

| Business Type | Custom Rules | Reasoning |
|---------------|--------------|-----------|
| E-commerce | ["words", "typo", "price:asc", "popularity:desc"] | Price and popularity focus |
| Content | ["words", "typo", "created_at:desc", "exactness"] | Recency important |
| Inventory | ["words", "in_stock:desc", "quantity:desc"] | Availability focus |

### Rule Order Impact

```
Rule Priority (1st = Highest Impact):
1. words - Match quality most important
2. typo - Forgiveness for user errors  
3. proximity - Phrase matching relevance
4. custom:desc - Business-specific sorting
5. exactness - Tie-breaker for exact matches
```

### MeiliSearch Rule Types

| Rule Type | Description | Examples |
|-----------|-------------|----------|
| Built-in | MeiliSearch standard rules | words, typo, proximity |
| Attribute | Searchable attribute priority | attribute |
| Sort | Custom sorting by field | price:asc, date:desc |
| Exact | Exact match preference | exactness |

### Validation Rules

```
Ranking Rule Validation:
├── Valid rule names only
├── Proper sort syntax (field:asc/desc)
├── Sort fields exist in indexed data
├── Logical rule ordering
└── Performance impact warnings
```

### Performance Considerations

| Factor | Impact | Recommendation |
|--------|--------|----------------|
| Rule Count | More rules = slower | Use essential rules only |
| Complex Sorts | Custom sorts slower | Balance relevance vs speed |
| Rule Order | Order affects performance | Put fast rules first |

### Expected Outcome
- ranking_rules field successfully added to SearchConfig
- Default MeiliSearch ranking rules configured
- Support for custom business-specific ranking
- Foundation for search result relevance optimization

### Verification Checklist
- [ ] ranking_rules JSONField added to SearchConfig  
- [ ] Default MeiliSearch rules configured
- [ ] Custom sort rule syntax supported
- [ ] Rule validation logic implemented
- [ ] Help text explains rule impact
- [ ] JSON structure follows MeiliSearch format

---

## Task 15: Create Search Migrations

### Overview
Generate and apply Django database migrations for the SearchConfig model and all its fields. This task creates the necessary database schema changes to store tenant-specific search configurations, ensuring the search infrastructure is properly integrated with the Django ORM and database system.

### Dependencies
- Task 14: Create ranking_rules Field completed
- All SearchConfig model fields defined (is_enabled, searchable_attrs, filterable_attrs, ranking_rules)
- Django migration system configured

### Instructions

1. **Prepare for migration generation**
   - Ensure all SearchConfig model changes are saved
   - Verify model imports and dependencies are correct
   - Check that search app is in INSTALLED_APPS

2. **Add search app to Django settings**
   - Open Django settings file (settings/base.py or similar)
   - Add 'apps.search' to INSTALLED_APPS list
   - Ensure app is properly positioned in dependency order

3. **Generate initial search migration**
   - Run `python manage.py makemigrations search`
   - Review generated migration file for accuracy
   - Ensure all fields and relationships are included

4. **Review migration file content**
   - Check SearchConfig model creation
   - Verify OneToOneField to Tenant is correct
   - Confirm all JSON fields have proper defaults

5. **Test migration on development database**
   - Run `python manage.py migrate search`
   - Verify migration applies without errors
   - Check database schema matches model definition

6. **Validate database table creation**
   - Connect to database and verify table exists
   - Check column definitions match field types
   - Confirm indexes and constraints are created

7. **Test model operations**
   - Create test SearchConfig instance in Django shell
   - Verify field values save and retrieve correctly
   - Test OneToOne relationship with Tenant model

### Migration Generation Process

```
Migration Steps:
1. makemigrations search  → Generate migration file
2. Review migration       → Validate generated code  
3. migrate search        → Apply to database
4. Validate schema       → Confirm table structure
5. Test operations       → Verify functionality
```

### Expected Migration Content

| Operation | Details | Purpose |
|-----------|---------|---------|
| CreateModel | SearchConfig model | Main table creation |
| OneToOneField | tenant relationship | Foreign key constraint |
| JSONField | searchable_attrs | Configuration storage |
| JSONField | filterable_attrs | Filter configuration |
| JSONField | ranking_rules | Ranking configuration |
| BooleanField | is_enabled | Feature toggle |

### Database Schema Validation

```sql
-- Expected table structure
CREATE TABLE search_config (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER UNIQUE REFERENCES tenant(id),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    searchable_attrs JSON NOT NULL,
    filterable_attrs JSON NOT NULL, 
    ranking_rules JSON NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Migration File Structure

```python
# Generated migration file structure
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('tenants', '0001_initial'),  # Tenant dependency
    ]
    
    operations = [
        migrations.CreateModel(
            name='SearchConfig',
            fields=[...],
        ),
    ]
```

### Testing Migration Success

| Test | Command/Check | Expected Result |
|------|---------------|-----------------|
| Migration Status | `migrate --plan` | No pending migrations |
| Table Creation | Database query | search_config table exists |
| Model Import | Django shell import | No errors |
| Instance Creation | Create test object | Saves successfully |

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|---------|
| App not found | Missing INSTALLED_APPS | Add search app to settings |
| Dependency error | Missing tenant migration | Run tenant migrations first |
| Field error | Invalid field definition | Fix model field syntax |
| Constraint error | OneToOne conflict | Check relationship definitions |

### Rollback Planning

```
Migration Rollback:
├── Database backup before migration
├── Migration reversal capability  
├── Data preservation strategy
└── Testing rollback procedure
```

### Expected Outcome
- Django migration file created for SearchConfig model
- Migration successfully applied to database
- Database table structure matches model definition
- SearchConfig instances can be created and managed

### Verification Checklist
- [ ] Search app added to INSTALLED_APPS
- [ ] Migration file generated with makemigrations
- [ ] Migration content includes all fields and relationships
- [ ] Migration applies successfully with migrate command
- [ ] Database table created with correct schema
- [ ] SearchConfig model operations work in Django shell
- [ ] No migration warnings or errors

---

## Task 16: Verify MeiliSearch Connection

### Overview
Implement comprehensive verification of the MeiliSearch setup by testing connectivity, authentication, index operations, and integration with the SearchConfig model. This final task ensures all components work together correctly and provides diagnostic tools for troubleshooting search infrastructure issues.

### Dependencies
- Task 15: Create Search Migrations completed
- MeiliSearch container running
- SearchClient class functional
- SearchConfig model migrated to database

### Instructions

1. **Create verification management command**
   - Create `management/` directory in `apps/search/`
   - Add `commands/` subdirectory for Django commands
   - Create `verify_search.py` management command

2. **Implement basic connectivity test**
   - Test connection to MeiliSearch host
   - Verify API key authentication
   - Check MeiliSearch service health and version

3. **Test SearchClient functionality**
   - Initialize SearchClient singleton
   - Test get_index method with sample index
   - Verify tenant_index_name generation

4. **Test SearchConfig model operations**
   - Create test tenant with SearchConfig
   - Verify default configuration values
   - Test configuration field updates and validation

5. **Verify index creation and configuration**
   - Create test index using SearchClient
   - Apply searchable attributes configuration
   - Apply filterable attributes and ranking rules

6. **Test document indexing and search**
   - Index sample documents to test index
   - Perform basic search operations
   - Verify filtering capabilities work

7. **Create comprehensive verification report**
   - Generate detailed status report of all components
   - Include performance metrics and recommendations
   - Provide troubleshooting information for failures

### Management Command Structure

```python
# apps/search/management/commands/verify_search.py
class Command(BaseCommand):
    def handle(self, *args, **options):
        # 1. Test MeiliSearch connectivity
        # 2. Test SearchClient functionality  
        # 3. Test SearchConfig operations
        # 4. Test index creation and configuration
        # 5. Test document operations
        # 6. Generate comprehensive report
```

### Connectivity Test Checklist

| Test | Check | Expected Result |
|------|-------|-----------------|
| Host Reachable | HTTP connection | 200 OK response |
| Authentication | API key validation | Successful auth |
| Service Health | Health endpoint | Service healthy |
| Version Check | MeiliSearch version | Compatible version |

### SearchClient Verification

```python
# Verification tests for SearchClient
def test_search_client():
    client = SearchClient()
    
    # Test singleton pattern
    client2 = SearchClient()
    assert client is client2
    
    # Test index operations
    index = client.get_index("test_index")
    assert index is not None
    
    # Test tenant naming
    name = client.tenant_index_name("tenant1", "products") 
    assert name == "lcc_tenant1_products"
```

### SearchConfig Model Tests

| Test | Operation | Validation |
|------|-----------|------------|
| Creation | Create with defaults | Default values correct |
| Tenant Relationship | OneToOne constraint | Relationship works |
| JSON Validation | Invalid JSON data | Validation errors |
| Field Updates | Modify configurations | Changes persist |

### Index Configuration Test

```
Index Configuration Verification:
├── Create test index
├── Apply searchable attributes  
├── Apply filterable attributes
├── Apply ranking rules
├── Verify settings applied
└── Test configuration retrieval
```

### Document Operation Tests

| Operation | Test Data | Verification |
|-----------|-----------|--------------|
| Index Documents | Sample products | Documents stored |
| Search Query | Text search | Results returned |
| Filter Query | Category filter | Filtering works |
| Sort Results | Price sorting | Order correct |

### Verification Report Format

```
MeiliSearch Verification Report
===============================

✅ MeiliSearch Connectivity
   - Host: http://localhost:7700 (Reachable)
   - Authentication: Valid API Key
   - Version: v1.5.0 (Compatible)

✅ SearchClient Functionality  
   - Singleton Pattern: Working
   - Index Creation: Successful
   - Tenant Naming: Correct Format

✅ SearchConfig Model
   - Migration Applied: Success
   - Default Values: Correct
   - Tenant Relationship: Working

✅ Index Operations
   - Document Indexing: 100 docs/sec
   - Search Performance: <50ms
   - Filter Operations: Working

⚠️  Recommendations:
   - Consider index optimization for large datasets
   - Monitor memory usage under load
```

### Error Handling and Diagnostics

| Error Type | Diagnostic | Resolution |
|------------|------------|------------|
| Connection Failed | Network/port issues | Check Docker container |
| Auth Failed | Invalid API key | Verify environment variables |
| Index Error | Configuration issues | Check model validation |
| Search Slow | Performance issues | Review index settings |

### Performance Benchmarks

```
Performance Test Results:
├── Index Creation: <1s for empty index
├── Document Insertion: >500 docs/sec  
├── Search Latency: <100ms average
├── Filter Performance: <50ms average
└── Memory Usage: <512MB baseline
```

### Expected Outcome
- Complete verification of MeiliSearch infrastructure
- All components tested and working correctly
- Comprehensive diagnostic and troubleshooting information
- Performance baseline established for monitoring

### Verification Checklist
- [ ] Management command created and executable
- [ ] MeiliSearch connectivity verified
- [ ] SearchClient singleton and methods tested
- [ ] SearchConfig model operations validated
- [ ] Index creation and configuration working
- [ ] Document indexing and search operations successful
- [ ] Performance metrics collected
- [ ] Comprehensive verification report generated
- [ ] Error scenarios tested and documented

---

## Summary

This document completed the SearchConfig model implementation and comprehensive verification of the MeiliSearch search infrastructure for the LankaCommerce Cloud ERP system. The tenant-specific configuration system provides flexible search customization while ensuring proper data isolation and performance optimization.

### Completed Tasks
1. ✓ Created SearchConfig model with OneToOne tenant relationship
2. ✓ Added is_enabled field for search feature toggle control
3. ✓ Added searchable_attrs field for customizable search scope
4. ✓ Added filterable_attrs field for faceted search capabilities
5. ✓ Added ranking_rules field for custom search result prioritization
6. ✓ Generated and applied Django migrations for search infrastructure
7. ✓ Implemented comprehensive MeiliSearch connectivity and functionality verification

### Key Configuration Components

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| SearchConfig Model | Per-tenant search settings | OneToOne with Tenant |
| is_enabled Field | Feature toggle | BooleanField with True default |
| searchable_attrs | Search scope control | JSONField with text fields |
| filterable_attrs | Filter capabilities | JSONField with categorical fields |
| ranking_rules | Result prioritization | JSONField with MeiliSearch rules |

### Search Infrastructure Architecture

```
Tenant Model ←→ SearchConfig Model ←→ MeiliSearch Indexes
     │                   │                      │
     ├── Basic info      ├── Search settings    ├── tenant001_products
     └── Domain          ├── Field config       ├── tenant001_customers  
                         └── Ranking rules      └── tenant001_orders
```

### Default Configuration Matrix

| Setting | Default Value | Customizable |
|---------|---------------|--------------|
| Search Enabled | True | Yes, per tenant |
| Searchable Fields | ["name", "sku", "description"] | Yes, JSON array |
| Filterable Fields | ["category_id", "brand", "price"] | Yes, JSON array |
| Ranking Rules | MeiliSearch defaults | Yes, ordered list |

### Next Steps
The search engine infrastructure is now complete and ready for:
- **Group B:** Index Management - Document indexing and synchronization
- **Group C:** Search Operations - Query processing and result formatting  
- **Group D:** Advanced Features - Autocomplete, suggestions, and analytics
- **Group E:** Performance Optimization - Caching and search performance tuning
- **Group F:** Monitoring & Maintenance - Health checks, logging, and administration

The foundation provides robust, tenant-aware search capabilities with comprehensive configuration options and proper integration with the Django ORM system.