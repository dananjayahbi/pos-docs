# Tasks 01-09: Province and District Models

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** A - Location Data Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-18_City-Location-Services.md](02_Tasks-10-18_City-Location-Services.md)

---

## Document Overview

This document covers the creation of Sri Lanka location data models with a hierarchical structure: Province → District → City. It establishes the foundation for shipping zone configuration by implementing the Province and District models with their respective fields, relationships, and multilingual support for Sinhala and English languages.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Province Model | Medium | 45 min |
| 02 | Create Province Name Field | Low | 20 min |
| 03 | Create Province Code Field | Low | 15 min |
| 04 | Create District Model | Medium | 45 min |
| 05 | Create District Province FK | Low | 20 min |
| 06 | Create District Name Field | Low | 20 min |
| 07 | Create District Code Field | Low | 15 min |
| 08 | Create City Model | Medium | 45 min |
| 09 | Create City District FK | Low | 20 min |

---

## Task 01: Create Province Model

### Overview
Create the base Province model that represents the 9 administrative provinces of Sri Lanka. This model serves as the top level in the location hierarchy and includes multilingual support for province names in both Sinhala and English, along with standardized province codes and activation status.

### Dependencies
- SubPhase-01 (Database Configuration) must be complete
- Django models framework is initialized
- Multi-tenancy support is configured

### Instructions

1. **Navigate to the location app**
   - Go to `backend/apps/location/` directory
   - Access the `models.py` file or create `models/province.py`
   - Ensure proper Django model imports

2. **Define Province model class**
   - Create `Province` class inheriting from `models.Model`
   - Add model metadata for table naming
   - Include verbose names for admin interface

3. **Implement model fields structure**
   - Add primary key (auto-generated ID)
   - Include name fields for multilingual support
   - Add province code field for standardization
   - Include activation status field

4. **Configure model metadata**
   - Set database table name as `location_provinces`
   - Define ordering by province code
   - Add verbose names for Django admin
   - Set unique constraints where applicable

5. **Add model methods**
   - Implement `__str__` method returning English name
   - Add property methods for common operations
   - Include validation methods if needed

### Province Model Structure

```
Province Model
├── ID (Auto-generated Primary Key)
├── name_en (English Name)
├── name_si (Sinhala Name)
├── code (Province Code)
├── is_active (Status)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### Sri Lanka Province Reference

| Province | English Name | Sinhala Name | Code |
|----------|-------------|--------------|------|
| Western | Western Province | බස්නාහිර පළාත | WP |
| Central | Central Province | මධ්‍යම පළාත | CP |
| Southern | Southern Province | දකුණු පළාත | SP |
| Northern | Northern Province | උතුරු පළාත | NP |
| Eastern | Eastern Province | නැගෙනහිර පළාත | EP |
| North Western | North Western Province | වයඹ පළාත | NW |
| North Central | North Central Province | උතුරු මධ්‍යම පළාත | NC |
| Uva | Uva Province | ඌව පළාත | UVA |
| Sabaragamuwa | Sabaragamuwa Province | සබරගමුව පළාත | SAB |

### Model Field Specifications

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| name_en | CharField(100) | Required, unique | English province name |
| name_si | CharField(100) | Required, unique | Sinhala province name |
| code | CharField(10) | Required, unique | Standard province code |
| is_active | BooleanField | Default True | Activation status |

### Expected Outcome
- Functional Province model with all required fields
- Proper multilingual support for names
- Standardized province codes for all 9 provinces
- Model ready for Django migrations

### Verification Checklist
- [ ] `Province` model class created in location app
- [ ] All required fields defined with proper types
- [ ] Multilingual name fields (English/Sinhala) implemented
- [ ] Province code field with proper constraints
- [ ] Model metadata configured correctly
- [ ] `__str__` method returns meaningful representation

---

## Task 02: Create Province Name Field

### Overview
Implement the multilingual name fields for the Province model, supporting both English and Sinhala languages. This ensures proper localization for Sri Lankan users while maintaining English as the primary language for system integration and international compatibility.

### Dependencies
- Task 01: Create Province Model

### Instructions

1. **Define English name field**
   - Add `name_en` CharField with 100 character limit
   - Set as required field with `null=False, blank=False`
   - Add unique constraint to prevent duplicates
   - Include help text for admin interface

2. **Define Sinhala name field**
   - Add `name_si` CharField with 100 character limit
   - Set as required field with proper Unicode support
   - Add unique constraint for Sinhala names
   - Include help text explaining Sinhala naming

3. **Configure field validation**
   - Ensure proper character encoding for Sinhala text
   - Add validation for minimum length requirements
   - Prevent empty string values
   - Validate Unicode character sets

4. **Add field indexing**
   - Create database indexes on name fields
   - Optimize for search and lookup operations
   - Consider composite indexes if needed

5. **Implement field properties**
   - Add property method for default name display
   - Create method for localized name selection
   - Include search helper methods

### Name Field Configuration

| Field | Configuration | Purpose |
|-------|--------------|---------|
| name_en | CharField(max_length=100, unique=True) | Primary English name |
| name_si | CharField(max_length=100, unique=True) | Sinhala translation |
| Indexing | db_index=True on both fields | Search optimization |
| Validation | MinLengthValidator(2) | Data quality |

### Unicode Considerations

| Aspect | Implementation |
|--------|----------------|
| Character Set | UTF-8 encoding for Sinhala |
| Font Support | Web-safe Sinhala fonts |
| Display | Proper RTL/LTR text handling |
| Input Validation | Unicode character range validation |

### Localization Strategy

```
Name Display Logic
├── Default: English name (name_en)
├── Localized: Based on user language preference
├── Admin: Show both names
└── API: Return both fields in response
```

### Province Name Examples

| Province Code | English Name | Sinhala Name |
|--------------|-------------|--------------|
| WP | Western Province | බස්නාහිර පළාත |
| CP | Central Province | මධ්‍යම පළාත |
| SP | Southern Province | දකුණු පළාත |

### Expected Outcome
- Properly configured multilingual name fields
- Unicode support for Sinhala characters
- Unique constraints preventing duplicate names
- Optimized database indexes for search performance

### Verification Checklist
- [ ] `name_en` field with proper configuration
- [ ] `name_si` field with Unicode support
- [ ] Unique constraints on both name fields
- [ ] Database indexes created for optimization
- [ ] Field validation prevents empty values
- [ ] Help text added for admin interface

---

## Task 03: Create Province Code Field

### Overview
Implement the standardized province code field using the official Sri Lankan province codes. This field provides a consistent, short identifier for each province that can be used in shipping calculations, administrative processes, and system integrations.

### Dependencies
- Task 01: Create Province Model
- Task 02: Create Province Name Field

### Instructions

1. **Define province code field**
   - Add `code` CharField with 10 character limit
   - Set as required and unique field
   - Use uppercase validation for consistency
   - Add choices constraint with valid province codes

2. **Configure code validation**
   - Implement uppercase transformation
   - Add custom validator for allowed codes
   - Ensure no special characters or spaces
   - Validate against official province codes

3. **Add field constraints**
   - Set unique=True to prevent duplicates
   - Add database index for lookup performance
   - Include help text explaining code format
   - Set default ordering by code

4. **Implement code choices**
   - Define tuple of valid province codes
   - Include code descriptions for admin
   - Ensure all 9 provinces are covered
   - Add validation against choices

### Province Code Specifications

| Code | Full Name | Region | Population Rank |
|------|-----------|---------|----------------|
| WP | Western Province | West | 1 (Highest) |
| CP | Central Province | Central | 4 |
| SP | Southern Province | South | 3 |
| NP | Northern Province | North | 6 |
| EP | Eastern Province | East | 5 |
| NW | North Western Province | Northwest | 2 |
| NC | North Central Province | North Central | 8 |
| UVA | Uva Province | Central South | 7 |
| SAB | Sabaragamuwa Province | Central West | 9 (Lowest) |

### Code Field Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| max_length | 10 | Accommodate longest code |
| unique | True | Prevent duplicates |
| db_index | True | Fast lookups |
| validators | UppercaseValidator | Consistent format |
| choices | PROVINCE_CHOICES | Limit valid values |

### Code Validation Logic

```
Code Validation Rules
├── Length: 2-10 characters
├── Format: Uppercase letters only
├── Values: Must match official codes
├── Uniqueness: No duplicate codes allowed
└── Required: Cannot be null or empty
```

### Administrative Usage

| Use Case | Code Application |
|----------|------------------|
| Shipping Zones | Group districts by province |
| Tax Calculations | Province-specific rates |
| Address Formatting | Standard province identifier |
| API Responses | Consistent province reference |
| Reports | Province-level aggregation |

### Expected Outcome
- Standardized province code field with validation
- All 9 Sri Lankan provinces properly coded
- Uppercase consistency enforcement
- Unique constraints preventing duplicates

### Verification Checklist
- [ ] `code` field with proper length and constraints
- [ ] Uppercase validation implemented
- [ ] Unique constraint prevents duplicates
- [ ] All 9 official province codes included
- [ ] Database index created for performance
- [ ] Choices constraint limits valid values

---

## Task 04: Create District Model

### Overview
Create the District model representing the 25 administrative districts of Sri Lanka. This model serves as the middle level in the location hierarchy (Province → District → City) and includes foreign key relationship to provinces, multilingual naming support, and standardized district codes.

### Dependencies
- Task 01: Create Province Model
- Province model is properly configured and migrated

### Instructions

1. **Define District model class**
   - Create `District` class inheriting from `models.Model`
   - Set up model metadata for table naming
   - Configure verbose names for admin interface
   - Add ordering by district code

2. **Implement base model structure**
   - Add auto-generated primary key
   - Include timestamp fields (created_at, updated_at)
   - Set up model manager if needed
   - Configure abstract base model if applicable

3. **Plan district-province relationship**
   - Prepare foreign key field to Province model
   - Consider PROTECT delete behavior
   - Plan related name for reverse lookups
   - Design efficient database queries

4. **Set up model metadata**
   - Define database table name as `location_districts`
   - Set default ordering by province, then district code
   - Add verbose names for singular/plural forms
   - Configure unique constraints preparation

### District Model Structure

```
District Model
├── ID (Auto-generated Primary Key)
├── province (Foreign Key to Province)
├── name_en (English Name)
├── name_si (Sinhala Name)
├── code (District Code)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### Sri Lanka District Overview

| Province | District Count | Total Population |
|----------|---------------|------------------|
| Western (WP) | 3 districts | ~6.2 million |
| Central (CP) | 3 districts | ~2.6 million |
| Southern (SP) | 3 districts | ~2.5 million |
| Northern (NP) | 5 districts | ~1.1 million |
| Eastern (EP) | 3 districts | ~1.6 million |
| North Western (NW) | 2 districts | ~2.4 million |
| North Central (NC) | 2 districts | ~1.3 million |
| Uva (UVA) | 2 districts | ~1.3 million |
| Sabaragamuwa (SAB) | 2 districts | ~2.0 million |

### District Hierarchy Diagram

```
Sri Lanka Location Hierarchy

Province Level (9 Provinces)
├── Western Province (WP)
│   ├── Colombo District
│   ├── Gampaha District
│   └── Kalutara District
├── Central Province (CP)
│   ├── Kandy District
│   ├── Matale District
│   └── Nuwara Eliya District
└── [7 more provinces...]

District Level (25 Districts)
└── Each district contains multiple cities
```

### Model Relationships

| Relationship | Type | Configuration |
|-------------|------|---------------|
| Province → District | One-to-Many | ForeignKey with PROTECT |
| District → City | One-to-Many | Related name 'cities' |
| Query Optimization | Select Related | province for efficiency |

### Expected Outcome
- Functional District model with proper inheritance
- Prepared structure for province relationship
- Model metadata configured for admin interface
- Foundation ready for field implementation

### Verification Checklist
- [ ] `District` model class created in location app
- [ ] Model inheritance and metadata configured
- [ ] Primary key and timestamp fields planned
- [ ] Table naming and ordering configured
- [ ] Verbose names set for admin interface
- [ ] Model structure ready for field addition

---

## Task 05: Create District Province FK

### Overview
Implement the foreign key relationship between District and Province models, establishing the hierarchical connection in the Sri Lankan administrative structure. This relationship enables proper data organization and efficient queries across the province-district hierarchy.

### Dependencies
- Task 01: Create Province Model
- Task 04: Create District Model

### Instructions

1. **Define foreign key field**
   - Add `province` ForeignKey field to District model
   - Reference the Province model with proper import
   - Set on_delete behavior to PROTECT
   - Configure related_name as 'districts'

2. **Configure relationship constraints**
   - Set the field as required (null=False)
   - Add database index for query optimization
   - Include help text for admin interface
   - Consider blank=False for forms

3. **Implement delete protection**
   - Use PROTECT to prevent accidental deletions
   - Ensure provinces cannot be deleted with existing districts
   - Plan error handling for delete attempts
   - Document the protection behavior

4. **Optimize database queries**
   - Add db_index=True for foreign key lookups
   - Configure select_related in model manager
   - Plan efficient query patterns
   - Consider prefetch_related for reverse queries

5. **Add admin interface support**
   - Configure foreign key display in admin
   - Set up filtering and search capabilities
   - Add related field lookups
   - Include province information in district admin

### Foreign Key Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| to | 'Province' | Target model reference |
| on_delete | models.PROTECT | Prevent accidental deletions |
| related_name | 'districts' | Reverse relationship name |
| db_index | True | Query optimization |
| null | False | Required relationship |
| blank | False | Form validation |

### Relationship Behavior

```
Province-District Relationship
├── One Province → Many Districts
├── District must belong to exactly one Province
├── Province deletion blocked if has districts
├── District queries can include province data
└── Reverse queries: province.districts.all()
```

### District-Province Mapping Examples

| District | Province | Code | Population |
|----------|----------|------|------------|
| Colombo | Western | WP | ~2.3M |
| Gampaha | Western | WP | ~2.4M |
| Kalutara | Western | WP | ~1.2M |
| Kandy | Central | CP | ~1.4M |
| Matale | Central | CP | ~0.5M |

### Query Optimization Strategies

| Query Type | Optimization | Example |
|------------|-------------|---------|
| District with Province | select_related | District.objects.select_related('province') |
| Province Districts | prefetch_related | Province.objects.prefetch_related('districts') |
| Filtering | Index usage | District.objects.filter(province__code='WP') |

### Data Integrity Rules

| Rule | Implementation |
|------|----------------|
| Required Relationship | null=False, blank=False |
| Delete Protection | on_delete=models.PROTECT |
| Valid Province | ForeignKey constraint |
| Unique Districts | Per province uniqueness (later task) |

### Expected Outcome
- Properly configured foreign key relationship
- Protected province deletion when districts exist
- Optimized queries with database indexing
- Efficient reverse relationship access

### Verification Checklist
- [ ] `province` ForeignKey field added to District model
- [ ] PROTECT delete behavior configured
- [ ] Database index created on foreign key
- [ ] Related name 'districts' configured
- [ ] Field set as required (null=False)
- [ ] Admin interface displays province information

---

## Task 06: Create District Name Field

### Overview
Implement multilingual name fields for the District model, providing both English and Sinhala language support for all 25 districts of Sri Lanka. This ensures proper localization while maintaining data consistency and search capabilities across different language preferences.

### Dependencies
- Task 04: Create District Model
- Task 05: Create District Province FK

### Instructions

1. **Define English name field**
   - Add `name_en` CharField with 100 character limit
   - Set as required field with proper constraints
   - Add unique constraint within province scope
   - Include help text for admin users

2. **Define Sinhala name field**
   - Add `name_si` CharField with Unicode support
   - Configure proper Sinhala character encoding
   - Set unique constraint within province context
   - Add validation for Sinhala text format

3. **Implement unique constraints**
   - Create composite uniqueness: province + name_en
   - Create composite uniqueness: province + name_si
   - Prevent duplicate district names within same province
   - Allow same names across different provinces

4. **Configure field indexing**
   - Add database indexes on name fields
   - Create composite index with province
   - Optimize for search and filtering operations
   - Consider full-text search preparation

5. **Add validation methods**
   - Validate minimum name length
   - Check for proper character sets
   - Ensure non-empty values
   - Add custom validation if needed

### District Name Field Configuration

| Field | Type | Constraints | Index |
|-------|------|-------------|-------|
| name_en | CharField(100) | Required, not blank | Single + Composite |
| name_si | CharField(100) | Required, Unicode | Single + Composite |
| Uniqueness | Together with province | Composite constraint | Province + Name |

### Sri Lanka Districts by Province

| Province | English Districts | Sinhala Districts |
|----------|-------------------|------------------|
| **Western** | Colombo, Gampaha, Kalutara | කොළඹ, ගම්පහ, කළුතර |
| **Central** | Kandy, Matale, Nuwara Eliya | මහනුවර, මාතලේ, නුවරඑළිය |
| **Southern** | Galle, Matara, Hambantota | ගාල්ල, මාතර, හම්බන්තොට |
| **Northern** | Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya | යාපනය, කිලිනොච්චි, මන්නාරම, මුලතිව්, වවුනියාව |
| **Eastern** | Ampara, Batticaloa, Trincomalee | අම්පාර, මඩකලපුව, ත්‍රිකුණාමලය |

### Composite Uniqueness Logic

```
District Name Uniqueness Rules
├── Same province: Names must be unique
├── Different provinces: Names can be same
├── English validation: Within province scope
├── Sinhala validation: Within province scope
└── Example: "Colombo" exists only in Western Province
```

### Indexing Strategy

| Index Type | Fields | Purpose |
|------------|--------|---------|
| Single | name_en | Fast English name lookup |
| Single | name_si | Fast Sinhala name lookup |
| Composite | province + name_en | Unique constraint |
| Composite | province + name_si | Unique constraint |

### Unicode Considerations

| Aspect | Implementation |
|--------|----------------|
| Character Set | UTF-8 with Sinhala support |
| Input Validation | Unicode range validation |
| Display | Proper font rendering |
| Sorting | Locale-aware ordering |

### Expected Outcome
- Multilingual district name fields with proper validation
- Composite uniqueness preventing duplicate names per province
- Optimized database indexes for search performance
- Unicode support for Sinhala district names

### Verification Checklist
- [ ] `name_en` field with 100 character limit
- [ ] `name_si` field with Unicode support
- [ ] Composite unique constraints with province
- [ ] Database indexes on name fields
- [ ] Validation prevents empty names
- [ ] Sinhala character encoding working properly

---

## Task 07: Create District Code Field

### Overview
Implement the standardized district code field for all 25 districts of Sri Lanka. These codes provide consistent, short identifiers used in administrative processes, shipping calculations, and system integrations while maintaining compatibility with Sri Lankan postal and administrative systems.

### Dependencies
- Task 04: Create District Model
- Task 05: Create District Province FK
- Task 06: Create District Name Field

### Instructions

1. **Define district code field**
   - Add `code` CharField with 10 character limit
   - Set as required and unique field across all districts
   - Implement uppercase validation and transformation
   - Add database index for efficient lookups

2. **Configure code validation**
   - Ensure uppercase format consistency
   - Validate against special characters
   - Add custom validator for allowed patterns
   - Prevent spaces and special symbols

3. **Implement unique constraints**
   - Set unique=True for global uniqueness
   - Ensure no duplicate codes across provinces
   - Add validation error messages
   - Plan for future code additions

4. **Add field optimization**
   - Create database index for fast lookups
   - Configure admin interface display
   - Add help text explaining code format
   - Set up filtering and search capabilities

### District Code Standards

| Province | District Codes | Pattern |
|----------|---------------|---------|
| Western | COL, GAM, KAL | 3-letter abbreviation |
| Central | KAN, MAT, NUE | 3-letter abbreviation |
| Southern | GAL, MAT2, HAM | 3-letter + number if needed |
| Northern | JAF, KIL, MAN, MUL, VAV | 3-letter abbreviation |
| Eastern | AMP, BAT, TRI | 3-letter abbreviation |

### Complete District Code Reference

| District | English Name | Sinhala Name | Code | Province |
|----------|-------------|--------------|------|----------|
| Colombo | Colombo | කොළඹ | COL | WP |
| Gampaha | Gampaha | ගම්පහ | GAM | WP |
| Kalutara | Kalutara | කළුතර | KAL | WP |
| Kandy | Kandy | මහනුවර | KAN | CP |
| Matale | Matale | මාතලේ | MAT | CP |
| Nuwara Eliya | Nuwara Eliya | නුවරඑළිය | NUE | CP |
| Galle | Galle | ගාල්ල | GAL | SP |
| Matara | Matara | මාතර | MAR | SP |
| Hambantota | Hambantota | හම්බන්තොට | HAM | SP |

### Code Field Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| max_length | 10 | Accommodate future codes |
| unique | True | Global uniqueness |
| db_index | True | Fast lookups |
| null | False | Required field |
| blank | False | Form validation |
| validators | [UppercaseValidator] | Format consistency |

### Code Validation Rules

```
District Code Validation
├── Format: Uppercase letters/numbers only
├── Length: 2-10 characters
├── Pattern: Usually 3-letter abbreviation
├── Uniqueness: No duplicates globally
├── Special cases: Numbers for disambiguation
└── Examples: COL, GAM, KAN, MAT, GAL
```

### Administrative Applications

| Use Case | Code Usage |
|----------|------------|
| Postal Addresses | District identification |
| Shipping Zones | Delivery area grouping |
| Tax Calculations | District-specific rates |
| Statistical Reports | Administrative boundaries |
| API Responses | Consistent identifiers |

### Expected Outcome
- Standardized district code field with validation
- Unique codes for all 25 Sri Lankan districts
- Uppercase format consistency across all codes
- Optimized database performance for lookups

### Verification Checklist
- [ ] `code` field with proper length and constraints
- [ ] Global unique constraint implemented
- [ ] Uppercase validation working correctly
- [ ] Database index created for performance
- [ ] All 25 district codes properly planned
- [ ] Admin interface shows codes clearly

---

## Task 08: Create City Model

### Overview
Create the City model as the lowest level in the Sri Lankan location hierarchy (Province → District → City). This model will store city and town information including postal codes and activation status, providing the foundation for detailed address management and shipping zone configuration.

### Dependencies
- Task 04: Create District Model
- Task 07: Create District Code Field
- District model is properly configured with all fields

### Instructions

1. **Define City model class**
   - Create `City` class inheriting from `models.Model`
   - Set up model metadata and table naming
   - Configure verbose names for admin interface
   - Add ordering by city name

2. **Plan model field structure**
   - Prepare for district foreign key relationship
   - Plan city name field (single language initially)
   - Include postal code field for address system
   - Add activation status field

3. **Configure model metadata**
   - Set database table name as `location_cities`
   - Define default ordering by district, then city name
   - Add verbose names for singular/plural
   - Prepare unique constraints planning

4. **Set up base model structure**
   - Add auto-generated primary key
   - Include created_at and updated_at timestamps
   - Plan model manager for common queries
   - Consider abstract base model usage

### City Model Structure

```
City Model
├── ID (Auto-generated Primary Key)
├── district (Foreign Key to District)
├── name (City/Town Name)
├── postal_code (Postal Code)
├── is_active (Status)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### Sri Lankan City Hierarchy Context

| Level | Count | Examples |
|-------|-------|----------|
| Provinces | 9 | Western, Central, Southern |
| Districts | 25 | Colombo, Kandy, Galle |
| Cities/Towns | 1000+ | Colombo, Kandy, Galle, Negombo |
| Postal Codes | 1500+ | 00100, 10000, 80000 |

### City Categories in Sri Lanka

| Category | Description | Count Range | Examples |
|----------|-------------|-------------|----------|
| Municipal Council | Major cities | ~20 | Colombo, Kandy, Galle |
| Urban Council | Medium towns | ~40 | Negombo, Kurunegala |
| Pradeshiya Sabha | Small towns | ~270 | Panadura, Wattala |
| Villages | Rural areas | 14000+ | Various small villages |

### Location Hierarchy Diagram

```
Sri Lanka Administrative Structure

Province (9)
├── Western Province
│   ├── Colombo District
│   │   ├── Colombo City (00100-00199)
│   │   ├── Dehiwala City (10350)
│   │   └── Moratuwa City (10400)
│   ├── Gampaha District
│   │   ├── Negombo City (11500)
│   │   └── Ja-Ela City (11350)
│   └── Kalutara District
└── [Other provinces...]
```

### Postal Code Integration

| District | City Examples | Postal Range |
|----------|---------------|--------------|
| Colombo | Colombo Fort, Pettah, Bambalapitiya | 00100-00199 |
| Gampaha | Negombo, Ja-Ela, Wattala | 11000-11999 |
| Kandy | Kandy City, Peradeniya | 20000-20999 |
| Galle | Galle Fort, Hikkaduwa | 80000-80999 |

### Model Relationships

| Relationship | Type | Purpose |
|-------------|------|---------|
| District → City | One-to-Many | Administrative hierarchy |
| City → Address | One-to-Many | Address system (future) |
| City → Postal | One-to-One | Postal code mapping |

### Expected Outcome
- Functional City model foundation
- Proper inheritance and metadata configuration
- Model structure ready for field implementation
- Integration prepared with district hierarchy

### Verification Checklist
- [ ] `City` model class created in location app
- [ ] Model metadata configured properly
- [ ] Table naming and ordering planned
- [ ] Timestamp fields and primary key ready
- [ ] Model structure prepared for relationships
- [ ] Verbose names configured for admin

---

## Task 09: Create City District FK

### Overview
Implement the foreign key relationship between City and District models, completing the three-level hierarchical structure of Sri Lankan administrative divisions. This relationship enables efficient queries and maintains data integrity across the Province → District → City hierarchy.

### Dependencies
- Task 04: Create District Model
- Task 08: Create City Model
- District model with all fields properly configured

### Instructions

1. **Define foreign key field**
   - Add `district` ForeignKey field to City model
   - Reference District model with proper import
   - Set on_delete behavior to PROTECT
   - Configure related_name as 'cities'

2. **Configure relationship constraints**
   - Set field as required (null=False, blank=False)
   - Add database index for query optimization
   - Include descriptive help text
   - Ensure proper admin interface display

3. **Implement delete protection**
   - Use PROTECT to prevent accidental district deletions
   - Plan error handling for delete attempts
   - Document protection behavior for admins
   - Consider cascade implications

4. **Optimize hierarchical queries**
   - Configure select_related for district queries
   - Plan prefetch_related for reverse lookups
   - Add composite indexes where beneficial
   - Design efficient query patterns

5. **Complete location hierarchy**
   - Verify Province → District → City chain
   - Test hierarchical data access
   - Ensure proper relationship directions
   - Validate data integrity constraints

### Foreign Key Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| to | 'District' | Target model reference |
| on_delete | models.PROTECT | Prevent data loss |
| related_name | 'cities' | Reverse relationship |
| db_index | True | Query optimization |
| null | False | Required relationship |
| blank | False | Form validation |

### Complete Location Hierarchy

```
Three-Level Administrative Structure

Province Level (9)
├── Western Province (WP)
│   ├── Colombo District (COL)
│   │   ├── Colombo City
│   │   ├── Dehiwala City
│   │   └── Moratuwa City
│   ├── Gampaha District (GAM)
│   │   ├── Negombo City
│   │   └── Ja-Ela City
│   └── Kalutara District (KAL)
└── [Other provinces...]
```

### Hierarchical Query Examples

| Query Purpose | Method | Example |
|---------------|--------|---------|
| City with District | select_related | City.objects.select_related('district') |
| City with Province | select_related | City.objects.select_related('district__province') |
| District Cities | prefetch_related | District.objects.prefetch_related('cities') |
| Province Cities | prefetch_related | Province.objects.prefetch_related('districts__cities') |

### Data Access Patterns

| Access Pattern | Efficiency | Use Case |
|----------------|-----------|----------|
| City → District | Direct FK | Address validation |
| City → Province | Through District | Shipping zones |
| District → Cities | Reverse FK | Administrative reports |
| Province → All Cities | Through Districts | Regional analytics |

### Relationship Protection

```
Data Integrity Protection
├── Province deletion blocked if has districts
├── District deletion blocked if has cities
├── Hierarchical data consistency maintained
└── Accidental data loss prevented
```

### City-District Distribution Examples

| District | Major Cities | Total Cities | Postal Range |
|----------|--------------|-------------|--------------|
| Colombo | Colombo, Dehiwala, Moratuwa | ~50 | 00100-19999 |
| Gampaha | Negombo, Ja-Ela, Wattala | ~30 | 11000-11999 |
| Kandy | Kandy, Peradeniya, Gampola | ~40 | 20000-20999 |
| Galle | Galle, Hikkaduwa, Ambalangoda | ~25 | 80000-80999 |

### Expected Outcome
- Complete three-level location hierarchy
- Protected data relationships preventing orphaned cities
- Optimized queries across all hierarchy levels
- Efficient reverse relationship access

### Verification Checklist
- [ ] `district` ForeignKey field added to City model
- [ ] PROTECT delete behavior configured
- [ ] Related name 'cities' working correctly
- [ ] Database index created on foreign key
- [ ] Required field constraints applied
- [ ] Hierarchical queries working efficiently

---

## Summary

This document established the foundation of Sri Lanka's administrative location hierarchy by implementing the Province and District models with their complete field structure and relationships. The City model foundation was also created with its district relationship, completing the three-level hierarchy structure.

### Completed Tasks
1. ✓ Created Province model with multilingual support
2. ✓ Implemented Province name fields (English/Sinhala)
3. ✓ Added Province code field with validation
4. ✓ Created District model with proper structure
5. ✓ Implemented District-Province foreign key relationship
6. ✓ Added District name fields with uniqueness constraints
7. ✓ Implemented District code field with validation
8. ✓ Created City model foundation
9. ✓ Established City-District foreign key relationship

### Location Hierarchy Achieved
```
Province (9 total)
├── Western, Central, Southern, etc.
├── District (25 total)
│   ├── Colombo, Kandy, Galle, etc.
│   └── City (1000+ total)
│       └── Major cities, towns, villages
```

### Next Steps
Proceed to [02_Tasks-10-18_City-Location-Services.md](02_Tasks-10-18_City-Location-Services.md) to complete the City model fields, implement location services, data fixtures for all provinces and districts, and create admin interfaces for the complete location management system.