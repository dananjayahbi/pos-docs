# Tasks 19-28: ShippingZone Model and Core Fields

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** B - Shipping Zone Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-29-34_Default-Zones-Verify.md](02_Tasks-29-34_Default-Zones-Verify.md)

---

## Document Overview

This document covers the creation of the ShippingZone model and its core fields. It establishes the foundational data structure for managing shipping zones with district associations, zone types for different delivery services, and zone-specific configurations including COD availability and delivery time estimates. The model supports many-to-many relationships with districts and cities for flexible zone management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create ShippingZone Model | Medium | 45 min |
| 20 | Create Zone Name Field | Low | 15 min |
| 21 | Create Zone Code Field | Low | 15 min |
| 22 | Create Zone Type Choices | Low | 20 min |
| 23 | Create Zone Districts M2M | Medium | 30 min |
| 24 | Create Zone Cities M2M | Medium | 25 min |
| 25 | Create Delivery Days Field | Low | 15 min |
| 26 | Create Is COD Available | Low | 10 min |
| 27 | Create Is Active Field | Low | 10 min |
| 28 | Create Display Order Field | Low | 10 min |

---

## Task 19: Create ShippingZone Model

### Overview
Create the ShippingZone model in the shipping app to manage delivery zones with district and city associations. This model defines shipping zones that can cover multiple districts or cities, with specific delivery characteristics like estimated delivery days and COD availability. Each zone has a type (METRO, PROVINCE, REMOTE) that determines its delivery capabilities and pricing structure.

### Dependencies
- SubPhase-01 (Multi-tenancy setup) must be complete
- Phase-02 (Database Architecture & Multi-Tenancy) must be complete
- Backend shipping app must exist
- District and City models must exist (Group A dependencies)

### Instructions

1. **Navigate to shipping app models directory**
   - Go to `backend/apps/shipping/models/` directory
   - This directory contains all shipping-related models
   - Ensure the directory has an `__init__.py` file

2. **Create shipping_zone.py file**
   - Create new file named `shipping_zone.py`
   - This will contain the ShippingZone model
   - Follow project model naming conventions

3. **Import required dependencies**
   - Import Django models (from django.db import models)
   - Import timezone utilities (from django.utils import timezone)
   - Import validation utilities (from django.core.validators)
   - Import BaseModel from core.models (project base model with common fields)
   - Import Tenant model (from tenants app or django_tenants)
   - Import District and City models from locations app

4. **Define ShippingZone model class**
   - Create class `ShippingZone` inheriting from BaseModel
   - BaseModel provides: id, created_at, updated_at, created_by, updated_by
   - Add model Meta class for database configuration

5. **Add tenant foreign key**
   - Create ForeignKey to Tenant model
   - Set on_delete to models.CASCADE (delete zones when tenant deleted)
   - Set related_name to 'shipping_zones'
   - This links each zone to a specific tenant

6. **Configure model Meta options**
   - Set db_table to 'shipping_zones'
   - Set verbose_name to 'Shipping Zone'
   - Set verbose_name_plural to 'Shipping Zones'
   - Add ordering by ['display_order', 'name']
   - Add indexes for tenant, is_active, and zone_type fields

7. **Add model string representation**
   - Implement `__str__` method
   - Return format: "{name} ({zone_type})"
   - Ensure human-readable representation

8. **Update models __init__.py**
   - Add import for ShippingZone model
   - Add to __all__ list for proper exports
   - Follow project import conventions

### Model Structure Overview

```
ShippingZone
├── BaseModel Fields (inherited)
│   ├── id (UUID, primary key)
│   ├── created_at (DateTime)
│   ├── updated_at (DateTime)
│   ├── created_by (ForeignKey to User)
│   └── updated_by (ForeignKey to User)
├── tenant (ForeignKey to Tenant)
├── name (CharField) - Task 20
├── code (CharField) - Task 21
├── zone_type (CharField with choices) - Task 22
├── districts (ManyToManyField to District) - Task 23
├── cities (ManyToManyField to City) - Task 24
├── delivery_days (IntegerField) - Task 25
├── is_cod_available (BooleanField) - Task 26
├── is_active (BooleanField) - Task 27
└── display_order (IntegerField) - Task 28
```

### Model Relationships

| Relationship | Target Model | Type | Purpose |
|--------------|--------------|------|---------|
| tenant | Tenant | ForeignKey | Multi-tenancy support |
| districts | District | ManyToMany | Zone coverage by districts |
| cities | City | ManyToMany | Optional city-level coverage |
| created_by | User | ForeignKey | Audit trail (from BaseModel) |
| updated_by | User | ForeignKey | Audit trail (from BaseModel) |
| shipping_rates | ShippingRate | Reverse FK | Rate configuration per zone |
| order_items | OrderItem | Reverse FK | Orders delivered to zone |

### Database Table Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| db_table | shipping_zones | Explicit table naming |
| verbose_name | Shipping Zone | Admin display (singular) |
| verbose_name_plural | Shipping Zones | Admin display (plural) |
| ordering | [display_order, name] | Default sort order |

### Database Indexes

```
Index 1: tenant_id
└── Purpose: Fast lookup of zones by tenant

Index 2: tenant_id + is_active
└── Purpose: Fast lookup of active zones per tenant

Index 3: zone_type + tenant_id
└── Purpose: Filter zones by type within tenant

Index 4: display_order
└── Purpose: Efficient ordering in queries
```

### Zone Type Classifications

| Zone Type | Delivery Range | Typical Areas | COD Common |
|-----------|----------------|---------------|------------|
| METRO | Same day/Next day | Colombo, Gampaha | Yes |
| PROVINCE | 2-3 days | Provincial towns | Yes |
| REMOTE | 4-7 days | Rural areas | Limited |

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Isolation | Each tenant has separate zones |
| Queries | Always filter by tenant |
| Uniqueness | Zone codes unique per tenant |
| Deletion | Cascade when tenant deleted |

### Expected Outcome
- ShippingZone model created in shipping app
- Proper inheritance from BaseModel
- Tenant foreign key relationship established
- Database table configuration defined
- Ready to receive field definitions in subsequent tasks

### Verification Checklist
- [ ] `backend/apps/shipping/models/shipping_zone.py` file created
- [ ] ShippingZone class inherits from BaseModel
- [ ] Tenant ForeignKey added with CASCADE delete
- [ ] Model Meta class configured properly
- [ ] `__str__` method implemented
- [ ] Model imported in `__init__.py`
- [ ] No syntax errors in model definition

---

## Task 20: Create Zone Name Field

### Overview
Add the name field to the ShippingZone model to store human-readable zone names. This field allows tenants to create descriptive names for their shipping zones that are displayed to customers during checkout and used in administrative interfaces. Zone names should be clear and indicate the geographical coverage.

### Dependencies
- Task 19: Create ShippingZone Model

### Instructions

1. **Add name field to model**
   - Create CharField with max_length of 100
   - Set verbose_name to 'Zone Name'
   - Set help_text to explain the field purpose
   - Make field required (null=False, blank=False)

2. **Add field validation**
   - Consider MinLengthValidator(3) for minimum name length
   - Ensure meaningful zone names are required
   - Add custom validator if business rules needed

3. **Add uniqueness constraint**
   - Add unique_together constraint in Meta class
   - Combine tenant and name for uniqueness
   - Prevents duplicate zone names per tenant

4. **Update model string representation**
   - Ensure __str__ method uses name field
   - Display human-readable zone name

### Zone Name Examples

| Zone Type | Example Names | Purpose |
|-----------|---------------|---------|
| METRO | "Colombo Metro", "Gampaha Fast" | Urban areas |
| PROVINCE | "Western Province", "Southern Zone" | Provincial coverage |
| REMOTE | "Hill Country", "Northern Remote" | Remote areas |

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store zone name |
| max_length | 100 | Accommodate descriptive names |
| null | False | Field is required |
| blank | False | Must be filled in forms |
| verbose_name | Zone Name | Display in admin |
| help_text | Descriptive name for zone | Guide users |

### Zone Naming Convention

```
Format Guidelines:
├── Geographic + Service Level
│   └── "Colombo Express", "Galle Standard"
├── Regional + Zone Type  
│   └── "Western Metro", "Central Province"
├── Coverage + Delivery Speed
│   └── "Same Day Zone", "2-Day Delivery"
└── Area + Special Features
    └── "COD Available Zone", "Free Shipping Area"
```

### Database Storage

| Aspect | Details |
|--------|---------|
| Database Type | VARCHAR(100) |
| Index | Consider adding for search queries |
| Uniqueness | Combined with tenant_id |
| Validation | Minimum 3 characters |

### Admin Interface Display

```
In Django Admin:
┌────────────────────────────┐
│ Zone Name: [____________] │
│ Help: Descriptive name for │
│       this shipping zone   │
└────────────────────────────┘
```

### Expected Outcome
- name field added to ShippingZone model
- Human-readable zone names supported
- Uniqueness enforced per tenant
- Proper validation for meaningful names

### Verification Checklist
- [ ] name CharField added to model with max_length=100
- [ ] Field is required (null=False, blank=False)
- [ ] verbose_name and help_text configured
- [ ] unique_together constraint added in Meta class
- [ ] MinLengthValidator considered for validation
- [ ] No syntax errors in field definition

---

## Task 21: Create Zone Code Field

### Overview
Add the code field to store unique alphanumeric identifiers for shipping zones. This field provides a short, consistent code for each zone that can be used in APIs, integrations, and internal systems. Zone codes should be unique per tenant and follow a consistent naming pattern.

### Dependencies
- Task 19: Create ShippingZone Model

### Instructions

1. **Add code field to model**
   - Create CharField with max_length of 20
   - Set verbose_name to 'Zone Code'
   - Set help_text to explain code format
   - Make field required (null=False, blank=False)

2. **Add field validation**
   - Add RegexValidator for alphanumeric pattern
   - Pattern: r'^[A-Z0-9_]+$' (uppercase letters, numbers, underscores)
   - Ensure consistent code format across zones

3. **Add uniqueness constraint**
   - Add to unique_together constraint in Meta class
   - Combine tenant and code for uniqueness
   - Prevents duplicate codes per tenant

4. **Add database index**
   - Create database index on (tenant, code) combination
   - Improves lookup performance for API calls
   - Essential for frequent code-based queries

### Zone Code Examples

| Zone Type | Example Codes | Pattern |
|-----------|---------------|---------|
| METRO | "COL_METRO", "GAM_EXPRESS" | AREA_TYPE |
| PROVINCE | "WEST_PROV", "SOUTH_STD" | REGION_SERVICE |
| REMOTE | "HILL_REMOTE", "NORTH_EXT" | AREA_DELIVERY |

### Code Format Guidelines

```
Format Pattern: [AREA]_[TYPE/SERVICE]
├── Area Abbreviations:
│   ├── COL (Colombo)
│   ├── GAM (Gampaha)
│   ├── KAL (Kalutara)
│   ├── WEST (Western Province)
│   └── SOUTH (Southern Province)
├── Type/Service Codes:
│   ├── METRO (Metropolitan)
│   ├── EXPRESS (Fast delivery)
│   ├── STD (Standard)
│   ├── REMOTE (Remote areas)
│   └── EXT (Extended delivery)
```

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store zone code |
| max_length | 20 | Accommodate descriptive codes |
| null | False | Field is required |
| blank | False | Must be filled in forms |
| verbose_name | Zone Code | Display in admin |
| help_text | Unique code (A-Z, 0-9, _) | Guide format |
| validators | RegexValidator | Enforce pattern |

### Validation Pattern

```
Regex Pattern: ^[A-Z0-9_]+$
Valid Examples:
├── COL_METRO ✓
├── WEST_PROVINCE ✓
├── REMOTE_01 ✓
└── HILL_COUNTRY ✓

Invalid Examples:
├── col_metro ✗ (lowercase)
├── West-Province ✗ (hyphen)
├── Remote Zone ✗ (space)
└── zone#01 ✗ (special char)
```

### Database Configuration

| Aspect | Details |
|--------|---------|
| Database Type | VARCHAR(20) |
| Index | (tenant_id, code) composite |
| Uniqueness | Combined with tenant_id |
| Validation | Alphanumeric uppercase pattern |

### API Usage

```
Zone Code Usage in APIs:
├── GET /api/zones/{code}
├── POST /api/orders (zone_code field)
├── Rate calculation lookups
└── Integration system references
```

### Expected Outcome
- code field added to ShippingZone model
- Alphanumeric code validation enforced
- Uniqueness per tenant maintained
- Database index for performance

### Verification Checklist
- [ ] code CharField added with max_length=20
- [ ] RegexValidator added for alphanumeric pattern
- [ ] Field is required (null=False, blank=False)
- [ ] verbose_name and help_text configured
- [ ] unique_together includes code field
- [ ] Database index planned for (tenant, code)

---

## Task 22: Create Zone Type Choices

### Overview
Add the zone_type field with predefined choices for different shipping zone categories. This field determines the delivery characteristics, pricing structure, and service level for each zone. The three zone types (METRO, PROVINCE, REMOTE) represent different delivery speeds and service capabilities.

### Dependencies
- Task 19: Create ShippingZone Model

### Instructions

1. **Define zone type choices constant**
   - Create ZONE_TYPE_CHOICES tuple at module level
   - Include three zone types with display names
   - Order from fastest to slowest delivery
   - Keep codes uppercase for consistency

2. **Add zone_type field to model**
   - Create CharField with max_length of 20
   - Set choices parameter to ZONE_TYPE_CHOICES
   - Set verbose_name to 'Zone Type'
   - Set help_text to explain zone types
   - Make field required (null=False, blank=False)

3. **Add field validation**
   - Django automatically validates against choices
   - Ensure selected value is in ZONE_TYPE_CHOICES
   - Consider custom validator for business rules

4. **Add database index**
   - Create index on (tenant, zone_type) combination
   - Enables fast filtering by zone type
   - Important for rate calculation queries

### Zone Type Classifications

| Zone Type | Code | Delivery Time | Coverage | COD Typical |
|-----------|------|---------------|----------|-------------|
| Metropolitan | METRO | Same day/Next day | Urban centers | Always |
| Province | PROVINCE | 2-3 days | Provincial towns | Usually |
| Remote | REMOTE | 4-7 days | Rural/distant | Limited |

### Zone Type Specifications

```
METRO Zones:
├── Coverage: Major cities and suburbs
├── Delivery: Same day or next day
├── COD: Always available
├── Rates: Premium pricing
└── Examples: Colombo, Gampaha main areas

PROVINCE Zones:
├── Coverage: Provincial towns and cities
├── Delivery: 2-3 business days
├── COD: Usually available
├── Rates: Standard pricing
└── Examples: Kandy, Galle, Kurunegala

REMOTE Zones:
├── Coverage: Rural and distant areas
├── Delivery: 4-7 business days
├── COD: Limited availability
├── Rates: Higher due to distance
└── Examples: Hill country, far rural
```

### Zone Type Choices Implementation

```
ZONE_TYPE_CHOICES = [
    ('METRO', 'Metropolitan Zone'),
    ('PROVINCE', 'Provincial Zone'),
    ('REMOTE', 'Remote Zone'),
]
```

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store zone type code |
| max_length | 20 | Accommodate type codes |
| choices | ZONE_TYPE_CHOICES | Predefined types |
| null | False | Field is required |
| blank | False | Must be filled in forms |
| verbose_name | Zone Type | Display in admin |
| help_text | Delivery service level | Guide users |

### Form Rendering

```
In Django Admin/Forms:
┌────────────────────────────┐
│ Zone Type: [Dropdown ▼]   │
│                            │
│ Options:                   │
│ - Metropolitan Zone        │
│ - Provincial Zone          │
│ - Remote Zone              │
└────────────────────────────┘
```

### Business Logic by Zone Type

| Zone Type | Delivery Days | COD Default | Rate Multiplier |
|-----------|---------------|-------------|-----------------|
| METRO | 1-2 | True | 1.0x |
| PROVINCE | 2-3 | True | 1.2x |
| REMOTE | 4-7 | False | 1.5x |

### Database Storage

| Aspect | Details |
|--------|---------|
| Stored Value | Zone type code (METRO, PROVINCE, REMOTE) |
| Display Value | Zone type name (Metropolitan Zone, etc.) |
| Database Type | VARCHAR(20) |
| Index | (tenant_id, zone_type) composite |

### Query Patterns

```
Common Zone Type Queries:
├── zones.filter(zone_type='METRO')
├── zones.filter(zone_type__in=['METRO', 'PROVINCE'])
├── Rate calculation by zone type
└── Delivery estimation by zone type
```

### Expected Outcome
- zone_type field added to ShippingZone model
- Three zone types available with clear distinctions
- Field validation ensures only valid types
- Database index for efficient queries

### Verification Checklist
- [ ] ZONE_TYPE_CHOICES constant defined with 3 types
- [ ] zone_type CharField added to model
- [ ] Field has choices parameter set
- [ ] Field is required (null=False, blank=False)
- [ ] verbose_name and help_text configured
- [ ] Database index planned for (tenant, zone_type)

---

## Task 23: Create Zone Districts M2M

### Overview
Add the districts field as a ManyToManyField to the District model, enabling zones to cover multiple districts and districts to belong to multiple zones. This relationship is core to the flexible zone management system, allowing tenants to define zones based on district combinations rather than fixed boundaries.

### Dependencies
- Task 19: Create ShippingZone Model
- District model must exist (from Group A - Location Data Models)

### Instructions

1. **Add districts ManyToManyField**
   - Create ManyToManyField to District model
   - Set related_name to 'shipping_zones'
   - Set verbose_name to 'Districts'
   - Set blank=True (zones can exist without districts initially)

2. **Configure field help text**
   - Set help_text to explain district selection
   - Guide users on zone coverage strategy
   - Mention relationship with city-level coverage

3. **Add through table customization**
   - Consider custom through model if metadata needed
   - For now, use default Django through table
   - Plan for future rate variations per district

4. **Configure admin interface**
   - Enable filter_horizontal for better UX
   - Allow multiple district selection
   - Show district hierarchy if applicable

5. **Add validation methods**
   - Create custom validation for district combinations
   - Ensure logical district groupings
   - Check for overlapping zone coverage

### District-Zone Relationship

```
Relationship Pattern:
├── One District → Multiple Zones (overlap allowed)
├── One Zone → Multiple Districts (common pattern)
├── District inheritance (cities inherit zone from district)
└── Override capability (city can have different zone)
```

### Zone Coverage Strategies

| Strategy | Description | Example |
|----------|-------------|---------|
| Single District | Zone covers one district entirely | Colombo Metro Zone |
| Multi-District | Zone spans multiple districts | Western Province Zone |
| Partial District | Zone covers part of district | Colombo Express (urban only) |
| Custom Combination | Mixed coverage patterns | Hill Country Remote |

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | ManyToManyField | Multiple district associations |
| related_model | District | Link to location districts |
| related_name | shipping_zones | Reverse relationship |
| blank | True | Optional during creation |
| verbose_name | Districts | Display in admin |
| help_text | Coverage districts | Guide zone setup |

### Database Through Table

```
Table: shipping_zone_districts
├── id (Primary Key)
├── shippingzone_id (Foreign Key)
├── district_id (Foreign Key)
├── created_at (Auto timestamp)
└── Unique constraint on (zone, district)
```

### Admin Interface Configuration

```
Admin Setup:
├── filter_horizontal = ('districts',)
├── Search districts by name
├── Group districts by province
└── Show district codes for clarity
```

### Zone-District Examples

| Zone Name | Districts Covered | Zone Type |
|-----------|-------------------|-----------|
| Colombo Metro | Colombo | METRO |
| Western Express | Colombo, Gampaha, Kalutara | METRO |
| Central Province | Kandy, Matale, Nuwara Eliya | PROVINCE |
| Hill Country | Badulla, Ratnapura (partial) | REMOTE |

### Validation Logic

```
District Validation Rules:
├── Prevent empty zones (must have districts or cities)
├── Check for logical geographic groupings
├── Validate against conflicting zone overlaps
├── Ensure consistent zone types across districts
└── Handle inheritance from parent zones
```

### Query Performance

```
Optimized Queries:
├── Prefetch districts in zone lists
├── Use select_related for zone lookups
├── Index on through table foreign keys
└── Cache frequent zone-district mappings
```

### Business Logic Considerations

| Aspect | Implementation |
|--------|----------------|
| Inheritance | Cities inherit zone from district |
| Overrides | Cities can have different zones |
| Pricing | District-level rate variations possible |
| Delivery | District-specific delivery rules |

### Expected Outcome
- districts ManyToManyField added to ShippingZone
- Flexible zone coverage by district combinations
- Admin interface supports multi-selection
- Database relationships properly configured

### Verification Checklist
- [ ] districts ManyToManyField added to model
- [ ] related_name set to 'shipping_zones'
- [ ] Field allows blank=True for flexibility
- [ ] verbose_name and help_text configured
- [ ] Admin interface configured for easy selection
- [ ] Through table relationship understood

---

## Task 24: Create Zone Cities M2M

### Overview
Add the cities field as a ManyToManyField to the City model, providing city-level zone associations that can override district-level defaults. This optional relationship allows for granular zone management where specific cities within a district may require different shipping zones or service levels.

### Dependencies
- Task 19: Create ShippingZone Model
- Task 23: Create Zone Districts M2M
- City model must exist (from Group A - Location Data Models)

### Instructions

1. **Add cities ManyToManyField**
   - Create ManyToManyField to City model
   - Set related_name to 'shipping_zones'
   - Set verbose_name to 'Cities'
   - Set blank=True (optional city-level associations)

2. **Configure field help text**
   - Set help_text to explain city override capability
   - Mention precedence over district zones
   - Guide users on when to use city associations

3. **Add validation for city-district consistency**
   - Create custom validation method
   - Ensure cities belong to zone's districts
   - Allow city overrides with warning

4. **Configure admin interface**
   - Enable filter_horizontal for better UX
   - Filter cities by selected districts
   - Show hierarchical city-district relationships

5. **Document precedence rules**
   - City association takes precedence over district
   - Handle cases where city has multiple zones
   - Define fallback to district zone

### City-Zone Relationship Hierarchy

```
Zone Resolution Priority:
1. Direct City Association (highest priority)
2. District Association (fallback)
3. Default Zone (if configured)
4. No Zone (error condition)

Example Flow:
Customer Location: Negombo City, Gampaha District
├── Check: Does Negombo have direct zone? → Yes: "Gampaha Express"
├── Fallback: Check Gampaha District zone → "Western Province"
└── Final: Use "Gampaha Express" (city override wins)
```

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | ManyToManyField | Multiple city associations |
| related_model | City | Link to location cities |
| related_name | shipping_zones | Reverse relationship |
| blank | True | Optional city overrides |
| verbose_name | Cities | Display in admin |
| help_text | Optional city-level zones | Guide usage |

### City Override Scenarios

| Scenario | Description | Example |
|----------|-------------|---------|
| Express Service | City gets faster delivery | Kandy city in Central Province |
| Special Pricing | City has different rates | Tourist cities premium |
| COD Exceptions | City has different COD rules | Some remote cities no COD |
| Custom Delivery | City needs special handling | Hill stations extended time |

### Database Through Table

```
Table: shipping_zone_cities
├── id (Primary Key)
├── shippingzone_id (Foreign Key)
├── city_id (Foreign Key)
├── created_at (Auto timestamp)
└── Unique constraint on (zone, city)
```

### Validation Rules

```
City-Zone Validation:
├── Cities should belong to zone's districts (warning)
├── Allow city overrides with explicit confirmation
├── Prevent orphaned city associations
├── Check for conflicting city zone assignments
└── Validate city-district geographic consistency
```

### Admin Interface Enhancements

```
Admin Configuration:
├── Dependent dropdown (cities filtered by districts)
├── Hierarchical display (District → Cities)
├── Override indicators in list view
├── Bulk city assignment tools
└── Validation warnings for inconsistencies
```

### City Override Examples

| Zone | Districts | City Overrides | Reason |
|------|-----------|----------------|---------|
| Western Metro | Colombo, Gampaha | Negombo → Express Zone | Airport proximity |
| Central Province | Kandy, Matale | Kandy → Metro Zone | Urban center |
| Southern Standard | Galle, Matara | Hikkaduwa → Tourist Zone | Special handling |

### Query Optimization

```
Efficient Zone Resolution:
├── Single query with city and district joins
├── Cache zone mappings for performance
├── Prefetch both cities and districts
└── Use database indexes on foreign keys
```

### Business Logic Implementation

```
Zone Resolution Logic:
def get_shipping_zone(city, district, tenant):
    # 1. Check direct city association
    city_zones = city.shipping_zones.filter(
        tenant=tenant, is_active=True
    )
    if city_zones.exists():
        return city_zones.first()
    
    # 2. Check district association
    district_zones = district.shipping_zones.filter(
        tenant=tenant, is_active=True
    )
    if district_zones.exists():
        return district_zones.first()
    
    # 3. Return default or None
    return get_default_zone(tenant)
```

### Migration Considerations

| Aspect | Consideration |
|--------|---------------|
| Data Migration | Bulk city assignments from districts |
| Performance | Index creation on through tables |
| Validation | Run consistency checks post-migration |
| Rollback | Maintain district associations |

### Expected Outcome
- cities ManyToManyField added to ShippingZone
- City-level zone overrides supported
- Hierarchical zone resolution implemented
- Admin interface handles city-district relationships

### Verification Checklist
- [ ] cities ManyToManyField added to model
- [ ] related_name set to 'shipping_zones'
- [ ] Field allows blank=True for flexibility
- [ ] verbose_name and help_text configured
- [ ] City-district validation logic planned
- [ ] Admin interface configured for hierarchical selection

---

## Task 25: Create Delivery Days Field

### Overview
Add the delivery_days field to store the estimated number of business days for package delivery within the zone. This field helps set customer expectations and enables accurate delivery time calculations during checkout. Different zone types typically have different delivery day ranges.

### Dependencies
- Task 19: Create ShippingZone Model
- Task 22: Create Zone Type Choices

### Instructions

1. **Add delivery_days field to model**
   - Create IntegerField for delivery days
   - Set verbose_name to 'Delivery Days'
   - Set help_text to explain business days calculation
   - Allow null=False, blank=False (required field)

2. **Add field validation**
   - Add MinValueValidator(1) for minimum 1 day
   - Add MaxValueValidator(30) for maximum 30 days
   - Ensure realistic delivery timeframes

3. **Set default values by zone type**
   - Create property method for suggested defaults
   - METRO: 1-2 days, PROVINCE: 2-3 days, REMOTE: 4-7 days
   - Allow manual override of defaults

4. **Add display formatting**
   - Create property for human-readable display
   - Format as "X business days" or "X-Y days"
   - Handle singular/plural properly

### Delivery Days by Zone Type

| Zone Type | Typical Range | Default Value | Description |
|-----------|---------------|---------------|-------------|
| METRO | 1-2 days | 2 | Same day or next business day |
| PROVINCE | 2-3 days | 3 | Standard provincial delivery |
| REMOTE | 4-7 days | 5 | Extended delivery to remote areas |

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Store delivery days count |
| null | False | Field is required |
| blank | False | Must be filled in forms |
| verbose_name | Delivery Days | Display in admin |
| help_text | Business days for delivery | Guide users |
| validators | Min: 1, Max: 30 | Realistic range |

### Delivery Days Logic

```
Business Rules:
├── Count only business days (Monday-Friday)
├── Exclude public holidays (configurable)
├── Zone type provides suggested default
├── Manual override always allowed
└── Display with proper singular/plural
```

### Default Value Calculation

```
Zone Type Defaults:
├── METRO Zones → 2 days (fast urban delivery)
├── PROVINCE Zones → 3 days (standard delivery)
├── REMOTE Zones → 5 days (extended delivery)
└── Custom override → any value 1-30
```

### Display Formatting

```
Human-Readable Display:
├── 1 day → "1 business day"
├── 2 days → "2 business days"  
├── 3-5 days → "3-5 business days" (range)
└── 7+ days → "7+ business days" (extended)
```

### Validation Rules

```
Delivery Days Validation:
├── Minimum: 1 day (same day = 1)
├── Maximum: 30 days (reasonable limit)
├── Integer values only
├── Consider zone type appropriateness
└── Warning for unusual values
```

### Integration with Checkout

```
Checkout Display:
├── "Estimated delivery: 2-3 business days"
├── "Your order will arrive by [calculated date]"
├── Factor in processing time
└── Account for weekends and holidays
```

### Database Configuration

| Aspect | Details |
|--------|---------|
| Database Type | INTEGER |
| Constraints | CHECK (delivery_days >= 1 AND <= 30) |
| Index | Consider for filtering queries |
| Default | Based on zone_type |

### Business Logic Methods

```
Model Methods to Add:
├── get_delivery_days_display() → "2 business days"
├── calculate_delivery_date(order_date) → actual date
├── get_suggested_days_by_type() → default for type
└── is_delivery_days_reasonable() → validation
```

### Admin Interface

```
Admin Display:
├── Show delivery days with zone type
├── Highlight unusual values (warnings)
├── Bulk update by zone type
└── Filter zones by delivery time ranges
```

### Customer Communication

| Context | Display Format |
|---------|----------------|
| Product Page | "Ships in 2-3 business days" |
| Checkout | "Estimated delivery: Oct 15-16" |
| Order Confirmation | "Expected by: October 16" |
| Tracking | "Arriving in 2 days" |

### Expected Outcome
- delivery_days field added to ShippingZone model
- Validation ensures reasonable delivery timeframes
- Zone types have appropriate default values
- Human-readable display methods available

### Verification Checklist
- [ ] delivery_days IntegerField added to model
- [ ] MinValueValidator(1) and MaxValueValidator(30) added
- [ ] Field is required (null=False, blank=False)
- [ ] verbose_name and help_text configured
- [ ] Default value logic planned by zone type
- [ ] Display formatting method planned

---

## Task 26: Create Is COD Available

### Overview
Add the is_cod_available field as a BooleanField to control Cash on Delivery (COD) availability per shipping zone. This field enables tenants to configure which zones support COD payments based on logistics capabilities, risk assessment, or business policies. COD availability varies by zone type and geographic location.

### Dependencies
- Task 19: Create ShippingZone Model
- Task 22: Create Zone Type Choices

### Instructions

1. **Add is_cod_available field to model**
   - Create BooleanField for COD availability
   - Set verbose_name to 'COD Available'
   - Set help_text to explain COD implications
   - Set default=True (most zones support COD)

2. **Configure default values by zone type**
   - METRO zones: default True (reliable COD)
   - PROVINCE zones: default True (standard COD)
   - REMOTE zones: default False (limited COD)
   - Allow manual override of defaults

3. **Add validation logic**
   - Consider business rules for COD eligibility
   - Validate against zone capabilities
   - Check integration with payment systems

4. **Update admin interface**
   - Add boolean filter for COD availability
   - Show COD status in zone list view
   - Enable bulk COD status updates

### COD Availability by Zone Type

| Zone Type | Default COD | Reason | Risk Level |
|-----------|-------------|---------|------------|
| METRO | True | Reliable delivery network | Low |
| PROVINCE | True | Established courier routes | Medium |
| REMOTE | False | Limited courier coverage | High |

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | BooleanField | COD availability flag |
| default | True | Most zones support COD |
| verbose_name | COD Available | Display in admin |
| help_text | Cash on Delivery accepted | Explain feature |

### COD Business Rules

```
COD Availability Logic:
├── Zone capability (courier supports COD)
├── Risk assessment (fraud potential)
├── Delivery reliability (success rate)
├── Business policy (tenant preferences)
└── Geographic accessibility
```

### Default COD Patterns

```
COD Default by Zone:
├── Urban Centers (METRO) → Always COD
├── Provincial Towns (PROVINCE) → Usually COD  
├── Remote Areas (REMOTE) → Limited COD
└── Special Cases → Manual configuration
```

### Admin Interface Configuration

```
Admin Features:
├── Boolean filter: "COD Available"
├── List display shows COD status icon
├── Bulk actions: Enable/Disable COD
├── Zone type filter + COD filter
└── COD summary in zone overview
```

### Integration Points

```
COD Integration:
├── Checkout process (show/hide COD option)
├── Payment methods (filter by zone)
├── Order processing (COD handling)
├── Courier integration (COD capability)
└── Reporting (COD vs other payments)
```

### Customer Experience

```
COD in Checkout:
├── Zone selection → COD availability check
├── Payment options → Show/hide COD
├── COD selected → Additional terms
├── Order confirmation → COD details
└── Delivery → Cash collection process
```

### Database Configuration

| Aspect | Details |
|--------|---------|
| Database Type | BOOLEAN |
| Default | TRUE |
| Index | Consider for payment filtering |
| NOT NULL | Always has value |

### Query Patterns

```
Common COD Queries:
├── zones.filter(is_cod_available=True)
├── get_payment_methods(zone) → check COD
├── cod_zones = Zone.objects.cod_enabled()
└── zone.payment_options() → includes COD check
```

### Business Logic Methods

```
Model Methods to Add:
├── supports_cod() → Boolean check
├── get_payment_methods() → Available methods
├── cod_terms() → COD-specific terms
└── validate_cod_eligibility() → Business rules
```

### COD Risk Management

| Risk Factor | Mitigation | Implementation |
|-------------|------------|----------------|
| Fraud | Zone-based restrictions | is_cod_available=False |
| Returns | Reliable courier network | METRO/PROVINCE only |
| Collection | Established delivery routes | Partner verification |
| Distance | Cost vs benefit analysis | REMOTE zone evaluation |

### Zone COD Examples

| Zone Name | Zone Type | COD Available | Reason |
|-----------|-----------|---------------|---------|
| Colombo Metro | METRO | True | Reliable network |
| Western Province | PROVINCE | True | Good coverage |
| Hill Country | REMOTE | False | Limited couriers |
| Northern Remote | REMOTE | False | Access challenges |

### Expected Outcome
- is_cod_available BooleanField added to ShippingZone
- COD availability configured per zone
- Integration with payment method selection
- Admin interface for COD management

### Verification Checklist
- [ ] is_cod_available BooleanField added to model
- [ ] Default value set to True
- [ ] verbose_name and help_text configured
- [ ] Admin interface shows COD status
- [ ] Integration with payment flow planned
- [ ] Zone type defaults considered

---

## Task 27: Create Is Active Field

### Overview
Add the is_active field as a BooleanField to control whether a shipping zone is currently active and available for selection during checkout. This field enables tenants to temporarily disable zones without deleting them, useful for maintenance, service disruptions, or seasonal availability changes.

### Dependencies
- Task 19: Create ShippingZone Model

### Instructions

1. **Add is_active field to model**
   - Create BooleanField for active status
   - Set verbose_name to 'Is Active'
   - Set help_text to explain active status
   - Set default=True (zones active by default)

2. **Add database index**
   - Create database index on (tenant, is_active)
   - Improves query performance for active zones
   - Essential for checkout zone filtering

3. **Update model manager**
   - Create custom manager with active() method
   - Filter queries to show only active zones
   - Maintain admin access to inactive zones

4. **Add admin interface features**
   - Boolean filter for active status
   - List display shows active status icon
   - Bulk activate/deactivate actions

5. **Implement soft delete pattern**
   - Use is_active=False instead of deletion
   - Preserve historical data and relationships
   - Enable zone reactivation when needed

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | BooleanField | Active status flag |
| default | True | Zones active by default |
| verbose_name | Is Active | Display in admin |
| help_text | Zone available for selection | Explain functionality |

### Active Status Use Cases

```
Zone Deactivation Scenarios:
├── Temporary service disruption
├── Courier partner changes  
├── Seasonal availability (flood season)
├── Rate restructuring period
├── System maintenance
└── Policy changes
```

### Database Configuration

| Aspect | Details |
|--------|---------|
| Database Type | BOOLEAN |
| Default | TRUE |
| Index | (tenant_id, is_active) composite |
| NOT NULL | Always has value |

### Model Manager Enhancement

```
Custom Manager Methods:
├── Zone.objects.active() → is_active=True
├── Zone.objects.inactive() → is_active=False
├── Zone.objects.all() → includes inactive
└── Zone.objects.for_tenant(tenant) → tenant + active
```

### Query Patterns

```
Active Zone Queries:
├── ShippingZone.objects.active()
├── tenant.shipping_zones.active()
├── zones.filter(is_active=True)
└── Zone.objects.active_for_checkout(tenant)
```

### Admin Interface Features

```
Admin Configuration:
├── List filter: "Active Status"
├── List display: Active icon (✓/✗)
├── Bulk actions: "Mark as Active/Inactive"
├── Search includes inactive zones
└── Clear visual indicators
```

### Checkout Integration

```
Zone Selection Logic:
├── Only show active zones to customers
├── Validate zone is active during checkout
├── Handle zone deactivation during order
├── Fallback to alternative zones
└── Clear error messages
```

### Business Logic

```
Active Status Rules:
├── Inactive zones hidden from customers
├── Admin can see all zones
├── Orders retain zone info even if deactivated
├── Reactivation restores full functionality
└── Historical data preserved
```

### Zone Status Management

| Action | Effect | Reversible |
|--------|--------|------------|
| Deactivate | Hidden from checkout | Yes |
| Delete | Permanently removed | No |
| Archive | Soft delete with flag | Yes |
| Suspend | Temporary unavailable | Yes |

### API Behavior

```
API Endpoints:
├── GET /zones → only active zones
├── GET /zones?include_inactive=true → all zones
├── PUT /zones/{id}/activate → set is_active=True
├── PUT /zones/{id}/deactivate → set is_active=False
└── Admin API → access to all zones
```

### Audit Trail

```
Status Change Tracking:
├── Log activation/deactivation events
├── Record user who made change
├── Timestamp of status change
├── Reason for status change (optional)
└── Impact assessment (affected orders)
```

### Migration Strategy

```
Existing Data:
├── Set all existing zones to is_active=True
├── Create database index
├── Update existing queries
├── Test admin interface
└── Verify checkout functionality
```

### Expected Outcome
- is_active BooleanField added to ShippingZone model
- Active zones filtered in customer-facing queries
- Admin can manage zone activation status
- Soft delete pattern implemented

### Verification Checklist
- [ ] is_active BooleanField added to model
- [ ] Default value set to True
- [ ] verbose_name and help_text configured
- [ ] Database index planned for (tenant, is_active)
- [ ] Custom manager methods planned
- [ ] Admin interface activation features planned

---

## Task 28: Create Display Order Field

### Overview
Add the display_order field as an IntegerField to control the sequence in which shipping zones appear in lists, dropdowns, and checkout interfaces. This field enables tenants to prioritize popular or preferred zones while maintaining a consistent ordering across the application.

### Dependencies
- Task 19: Create ShippingZone Model

### Instructions

1. **Add display_order field to model**
   - Create IntegerField for ordering sequence
   - Set verbose_name to 'Display Order'
   - Set help_text to explain ordering purpose
   - Set default=0 (neutral ordering position)

2. **Add field validation**
   - Allow negative values for priority positioning
   - Add reasonable range validation (-999 to 999)
   - Ensure integer values only

3. **Update model Meta ordering**
   - Add display_order to model ordering
   - Order by display_order first, then name
   - Ensure consistent sorting across application

4. **Add admin interface features**
   - Show display_order in list view
   - Enable inline editing of order values
   - Add bulk ordering tools
   - Sort admin list by display_order

5. **Implement ordering utilities**
   - Create methods for reordering zones
   - Handle automatic gap insertion
   - Provide ordering suggestions

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Ordering sequence |
| default | 0 | Neutral position |
| verbose_name | Display Order | Display in admin |
| help_text | Lower numbers appear first | Guide ordering |
| validators | Range: -999 to 999 | Reasonable limits |

### Display Order Logic

```
Ordering Rules:
├── Lower numbers appear first
├── Negative values for priority zones
├── Zero for standard zones
├── Positive values for lower priority
├── Same order → sort by name
└── Admin can reorder easily
```

### Ordering Examples

| Display Order | Zone Name | Zone Type | Usage |
|---------------|-----------|-----------|--------|
| -10 | Express Delivery | METRO | High priority |
| -5 | Colombo Metro | METRO | Popular zone |
| 0 | Western Province | PROVINCE | Standard |
| 5 | Southern Province | PROVINCE | Standard |
| 10 | Remote Areas | REMOTE | Lower priority |

### Database Configuration

| Aspect | Details |
|--------|---------|
| Database Type | INTEGER |
| Default | 0 |
| Constraints | CHECK (display_order BETWEEN -999 AND 999) |
| Index | Consider for sorting queries |

### Model Meta Update

```
Updated Meta Class:
class Meta:
    db_table = 'shipping_zones'
    verbose_name = 'Shipping Zone'
    verbose_name_plural = 'Shipping Zones'
    ordering = ['display_order', 'name']
    indexes = [
        models.Index(fields=['tenant', 'is_active']),
        models.Index(fields=['tenant', 'zone_type']),
        models.Index(fields=['display_order']),
    ]
```

### Admin Interface Enhancements

```
Admin Configuration:
├── List display includes display_order
├── List editable for quick order changes
├── Drag-and-drop ordering (optional)
├── Bulk order update actions
└── Sort by display_order by default
```

### Query Patterns

```
Ordered Zone Queries:
├── zones.order_by('display_order', 'name')
├── zones.active().ordered()  # custom manager
├── get_zones_for_checkout() → ordered list
└── zone_choices() → form choices in order
```

### Ordering Strategies

| Strategy | Display Order Range | Purpose |
|----------|-------------------|---------|
| Priority Zones | -50 to -1 | Express, premium service |
| Standard Zones | 0 to 49 | Regular zones |
| Lower Priority | 50 to 99 | Remote, expensive zones |
| Hidden/Inactive | N/A | Use is_active=False |

### Reordering Utilities

```
Utility Methods:
├── move_up() → decrease display_order
├── move_down() → increase display_order
├── move_to_position(position) → specific order
├── reorder_zones(zone_ids) → bulk reorder
└── auto_assign_orders() → distribute evenly
```

### Checkout Display

```
Zone Selection Order:
1. Express Delivery (-10)
2. Colombo Metro (-5)  
3. Western Province (0)
4. Southern Province (5)
5. Remote Areas (10)
```

### Business Logic

```
Display Order Rules:
├── Priority zones show first (negative values)
├── Popular zones get better positioning
├── Remote zones typically ordered last
├── Seasonal adjustments allowed
└── Consistent across all interfaces
```

### Migration Considerations

```
Data Migration:
├── Set existing zones to display_order=0
├── Assign initial orders by zone type:
│   ├── METRO zones: -10 to -1
│   ├── PROVINCE zones: 0 to 49
│   └── REMOTE zones: 50 to 99
├── Create database index
└── Update existing queries
```

### Performance Impact

```
Query Performance:
├── Index on display_order for sorting
├── Combined index with tenant for filtering
├── Minimal overhead for ordering
└── Cache zone lists for frequent access
```

### Expected Outcome
- display_order IntegerField added to ShippingZone model
- Zones display in configurable order
- Admin interface supports easy reordering
- Consistent sorting across application

### Verification Checklist
- [ ] display_order IntegerField added to model
- [ ] Default value set to 0
- [ ] verbose_name and help_text configured
- [ ] Range validation added (-999 to 999)
- [ ] Model Meta ordering updated to include display_order
- [ ] Admin interface ordering features planned

---

## Document Summary

This document successfully created the ShippingZone model foundation with all core fields necessary for flexible zone management. The model now supports:

### Completed Features
- ✅ **ShippingZone Model**: Base model with multi-tenancy support
- ✅ **Zone Identification**: Name and code fields for zone identification
- ✅ **Zone Classification**: Type choices (METRO, PROVINCE, REMOTE)
- ✅ **Geographic Coverage**: Many-to-many relationships with districts and cities
- ✅ **Service Configuration**: Delivery days and COD availability settings
- ✅ **Management Controls**: Active status and display ordering

### Key Relationships Established
| Relationship | Type | Purpose |
|--------------|------|---------|
| Tenant | ForeignKey | Multi-tenancy isolation |
| Districts | ManyToMany | Zone coverage areas |
| Cities | ManyToMany | City-level overrides |
| User (created_by/updated_by) | ForeignKey | Audit trail |

### Database Structure Ready
The model is prepared with proper indexing, validation, and admin interface configuration to support:
- Efficient zone lookups by tenant and location
- Flexible geographic coverage through M2M relationships  
- Zone type-based service differentiation
- Administrative controls for zone management

### Next Steps
Continue with **Document 02** covering Tasks 29-34 for default zone setup, data verification, and testing procedures to complete the shipping zone foundation.