# Tasks 69-76: Experiment Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 01 - AI Infrastructure Setup  
> **Group:** E - A/B Testing Framework  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-77-82_Experiment-Service.md](02_Tasks-77-82_Experiment-Service.md)
- **← Previous Group:** [../Group-D_Model-Serving/](../Group-D_Model-Serving/)

---

## Document Overview

This document covers the creation of Django models for the A/B testing framework. It establishes the core data structures needed to manage experiments and user assignments in a multi-tenant environment. These models enable sophisticated experiment management, traffic splitting, and user variant assignment tracking for AI feature testing and optimization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Experiment Model | Medium | 30 min |
| 70 | Create experiment_name Field | Low | 10 min |
| 71 | Create variants Field | Medium | 20 min |
| 72 | Create traffic_split Field | Low | 15 min |
| 73 | Create status Field | Low | 10 min |
| 74 | Create ExperimentAssignment Model | Medium | 25 min |
| 75 | Create user_id Field | Low | 10 min |
| 76 | Create variant Field | Low | 10 min |

---

## A/B Testing Model Architecture

### Model Relationship Diagram

```
┌─────────────────────────────────────────────────────┐
│              A/B Testing Framework                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────┐      ┌─────────────────────┐ │
│  │    Experiment       │      │ ExperimentAssignment│ │
│  │                     │ 1:N  │                     │ │
│  │ • experiment_name   │◄────►│ • user_id           │ │
│  │ • variants (JSON)   │      │ • variant           │ │
│  │ • traffic_split     │      │ • assigned_at       │ │
│  │ • status            │      │ • tenant            │ │
│  │ • tenant            │      │                     │ │
│  │ • created_at        │      │                     │ │
│  │ • updated_at        │      │                     │ │
│  └─────────────────────┘      └─────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Multi-Tenancy Integration

| Component | Tenant Isolation | Purpose |
|-----------|------------------|---------|
| **Experiment Model** | Schema-based | Experiment definitions per tenant |
| **ExperimentAssignment** | Schema-based | User assignments per tenant |
| **Variant Assignment** | Hash-based | Consistent user experience |
| **Traffic Distribution** | Configurable | Per-experiment split control |

---

## Task 69: Create Experiment Model

### Overview
Create the core Experiment model that serves as the foundation for A/B testing functionality. This model manages experiment configurations, variants, and lifecycle states within the multi-tenant architecture.

### Dependencies
- Django models framework (Phase 03)
- Multi-tenant schema setup (Phase 02)
- Base model mixins (Phase 03, SubPhase 03)
- User authentication system (Phase 03, SubPhase 04)

### Instructions

#### 1. Create Experiment Model Class
- Navigate to the AI application models directory
- Create new model class named `Experiment`
- Inherit from appropriate base model mixins for audit fields
- Ensure model supports multi-tenant schema isolation
- Add proper model metadata and string representation

#### 2. Define Core Model Structure
- Include primary key field (UUID recommended for security)
- Add tenant relationship field for multi-tenancy
- Include audit fields (created_at, updated_at, created_by, etc.)
- Implement proper model permissions and access controls
- Add model-level validation methods

#### 3. Configure Model Options
- Set appropriate database table name with ai_ prefix
- Define default ordering by creation date descending
- Add verbose names for admin interface clarity
- Configure model permissions for different user roles
- Set up proper indexes for query optimization

#### 4. Multi-Tenant Considerations
- Ensure model queries are automatically filtered by tenant
- Implement tenant-aware managers if needed
- Add validation to prevent cross-tenant data access
- Configure proper foreign key constraints
- Test model behavior in multi-tenant environment

---

## Task 70: Create experiment_name Field

### Overview
Add the experiment_name field to uniquely identify experiments within each tenant. This field serves as the human-readable identifier for experiments and must be unique per tenant.

### Dependencies
- Experiment model created (Task 69)
- Django CharField validation
- Multi-tenant uniqueness constraints

### Instructions

#### 1. Add experiment_name Field
- Define CharField with appropriate maximum length (255 characters)
- Set field as required (null=False, blank=False)
- Add help text describing the field purpose
- Configure field validation for allowed characters
- Include database index for query performance

#### 2. Implement Uniqueness Constraints
- Create unique constraint combining tenant and experiment_name
- Ensure uniqueness validation works across schema boundaries
- Add model-level validation for experiment naming rules
- Implement case-insensitive uniqueness if required
- Handle uniqueness error messages appropriately

#### 3. Field Validation Rules
- Allow alphanumeric characters, hyphens, and underscores
- Prevent special characters that might cause URL issues
- Implement minimum length validation (3+ characters)
- Add maximum length validation for database compatibility
- Ensure field values are suitable for API endpoints

#### 4. Admin Interface Integration
- Add field to admin list display for easy identification
- Make field searchable in admin interface
- Include field validation in admin forms
- Add field help text for admin users
- Configure proper field ordering in admin forms

---

## Task 71: Create variants Field

### Overview
Implement the variants field as a JSON field to store experiment variant configurations. This field defines the different versions being tested and their respective configurations.

### Dependencies
- Experiment model with experiment_name field (Tasks 69-70)
- Django JSONField support
- JSON schema validation capabilities

### Instructions

#### 1. Add Variants JSON Field
- Define JSONField for storing variant configurations
- Set appropriate default value (empty list or dict)
- Add field validation for JSON structure requirements
- Include help text explaining expected JSON format
- Configure field serialization for API responses

#### 2. Define Variant Schema Structure
- Create schema validation for variant objects
- Require each variant to have name and configuration
- Support flexible configuration parameters per variant
- Validate variant names are unique within experiment
- Ensure schema supports future extension needs

#### 3. Implement Validation Logic
- Add model method to validate variant structure
- Check that all variants have required fields
- Ensure variant names follow naming conventions
- Validate configuration parameters are appropriate
- Implement custom validation messages for clarity

#### 4. API Integration Considerations
- Design JSON structure for easy API consumption
- Ensure variants serialize properly in responses
- Support partial updates to variant configurations
- Implement proper error handling for invalid JSON
- Consider API versioning for schema changes

### Expected Variant Structure
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **name** | String | Yes | Variant identifier (control, treatment_a) |
| **description** | String | No | Human-readable variant description |
| **config** | Object | Yes | Variant-specific configuration parameters |
| **weight** | Number | No | Variant weight for uneven splits |

---

## Task 72: Create traffic_split Field

### Overview
Add the traffic_split field to control what percentage of traffic participates in the experiment. This field enables gradual experiment rollouts and risk management.

### Dependencies
- Experiment model with variants field (Tasks 69-71)
- Django decimal field validation
- Percentage calculation logic

### Instructions

#### 1. Add Traffic Split Field
- Define DecimalField with appropriate precision (5,2 for 100.00%)
- Set field constraints (0.00 to 100.00 range)
- Add default value (typically 10% or 50%)
- Include validation for percentage values
- Add help text explaining traffic split concept

#### 2. Implement Validation Logic
- Ensure values are between 0 and 100 inclusive
- Add decimal precision validation (maximum 2 decimal places)
- Implement business logic validation rules
- Prevent invalid percentage values
- Add meaningful error messages for validation failures

#### 3. Traffic Distribution Logic
- Document how traffic split affects user assignment
- Ensure compatibility with hash-based assignment
- Consider interaction with variant weights
- Plan for dynamic traffic split updates
- Support gradual experiment ramp-up scenarios

#### 4. Performance Considerations
- Index field if used in frequent queries
- Consider caching implications for traffic changes
- Document impact on user assignment consistency
- Plan for real-time traffic adjustments
- Consider database optimization needs

---

## Task 73: Create status Field

### Overview
Implement the status field to manage experiment lifecycle states. This field controls experiment visibility, user assignment, and data collection phases.

### Dependencies
- Experiment model with traffic_split field (Tasks 69-72)
- Django choices field pattern
- Workflow state management

### Instructions

#### 1. Define Status Choices
- Create enumeration of experiment states
- Include DRAFT, RUNNING, PAUSED, COMPLETED, ARCHIVED states
- Add state-specific validation and business rules
- Consider state transition logic requirements
- Document state meanings and allowed transitions

#### 2. Add Status Field
- Define CharField with choices constraint
- Set appropriate default value (DRAFT)
- Add field indexing for query performance
- Include help text for each status option
- Configure field validation for state transitions

#### 3. Implement State Transition Logic
- Create model methods for state changes
- Add validation for allowed state transitions
- Implement automatic state change triggers
- Log state changes for audit purposes
- Handle edge cases and error conditions

#### 4. Status-Based Business Logic
- Control user assignment based on experiment status
- Filter active experiments for assignment queries
- Implement status-based permission checks
- Add status validation in API endpoints
- Consider status impact on analytics and reporting

### Status Definitions
| Status | Description | User Assignment | Data Collection |
|---------|------------|----------------|----------------|
| **DRAFT** | Experiment being configured | No | No |
| **RUNNING** | Active experiment | Yes | Yes |
| **PAUSED** | Temporarily stopped | No | No |
| **COMPLETED** | Finished experiment | No | Yes (historical) |
| **ARCHIVED** | Historical experiment | No | Yes (readonly) |

---

## Task 74: Create ExperimentAssignment Model

### Overview
Create the ExperimentAssignment model to track which users are assigned to which experiment variants. This model enables consistent user experience and comprehensive assignment tracking.

### Dependencies
- Complete Experiment model (Tasks 69-73)
- User model from authentication system (Phase 03, SubPhase 04)
- Multi-tenant architecture support

### Instructions

#### 1. Create ExperimentAssignment Model
- Define model class inheriting from base mixins
- Add relationship to Experiment model (ForeignKey)
- Include tenant field for multi-tenancy support
- Add audit fields for assignment tracking
- Implement proper model metadata and permissions

#### 2. Configure Model Relationships
- Create foreign key relationship to Experiment
- Consider cascade behavior for experiment deletion
- Add related_name for reverse lookups
- Implement proper constraint validation
- Configure relationship indexing for performance

#### 3. Add Unique Constraints
- Create composite unique constraint (tenant, experiment, user_id)
- Prevent duplicate assignments for same user/experiment
- Handle constraint violation error messages
- Implement proper validation logic
- Consider constraint impact on bulk operations

#### 4. Model Optimization
- Add database indexes for frequent query patterns
- Configure select_related and prefetch_related hints
- Implement efficient querysets for common operations
- Consider partitioning strategies for large datasets
- Plan for assignment history and archival needs

---

## Task 75: Create user_id Field

### Overview
Add the user_id field to the ExperimentAssignment model to identify which user is assigned to a specific experiment variant. This field supports both authenticated users and anonymous session tracking.

### Dependencies
- ExperimentAssignment model created (Task 74)
- User authentication system
- Anonymous user handling strategy

### Instructions

#### 1. Add User ID Field
- Define CharField to support various user identification methods
- Allow for both user UUIDs and anonymous session identifiers
- Set appropriate field length (36+ characters for UUIDs)
- Add field indexing for assignment lookup performance
- Include validation for user ID format

#### 2. User Identification Strategy
- Support authenticated user primary keys
- Handle anonymous users with session identifiers
- Implement user ID generation for anonymous users
- Consider user ID persistence across sessions
- Plan for user ID migration scenarios (anonymous → authenticated)

#### 3. Field Validation and Constraints
- Add validation for user ID format requirements
- Implement business rules for user eligibility
- Handle special cases (admin users, test accounts)
- Add user existence validation if needed
- Consider privacy implications for user tracking

#### 4. Query Optimization
- Index user_id field for fast assignment lookups
- Consider composite indexes with experiment and tenant
- Optimize for user assignment query patterns
- Plan for user-based assignment reporting
- Consider user_id field in sharding strategies

---

## Task 76: Create variant Field

### Overview
Add the variant field to store which specific variant the user is assigned to within the experiment. This field must correspond to variants defined in the Experiment model.

### Dependencies
- ExperimentAssignment model with user_id field (Tasks 74-75)
- Experiment model variants field (Task 71)
- Variant validation logic

### Instructions

#### 1. Add Variant Field
- Define CharField to store variant name
- Set maximum length matching variant name constraints
- Add field validation against experiment variants
- Include help text explaining variant assignment
- Configure field for API serialization

#### 2. Implement Variant Validation
- Create validation method to check variant exists in experiment
- Ensure variant field matches experiment variants configuration
- Add model-level validation for variant consistency
- Handle validation errors with clear messages
- Consider variant validation during bulk operations

#### 3. Assignment Logic Integration
- Design field to support hash-based assignment algorithms
- Ensure variant values are compatible with assignment logic
- Plan for variant consistency across assignment updates
- Consider variant field in assignment service integration
- Support variant override capabilities for testing

#### 4. Reporting and Analytics
- Index variant field for assignment analytics
- Support variant-based query filtering
- Consider variant field in conversion tracking
- Plan for variant performance comparison queries
- Include variant in assignment audit trails

---

## Model Integration Summary

### Database Schema Relationships

```
Experiment Table:
┌─────────────────┬─────────────┬─────────────────┐
│ Field           │ Type        │ Constraints     │
├─────────────────┼─────────────┼─────────────────┤
│ id              │ UUID        │ Primary Key     │
│ tenant_id       │ UUID        │ Foreign Key     │
│ experiment_name │ VARCHAR(255)│ Not Null, Index │
│ variants        │ JSONB       │ Not Null        │
│ traffic_split   │ DECIMAL(5,2)│ 0-100 range     │
│ status          │ VARCHAR(20) │ Enum values     │
│ created_at      │ TIMESTAMP   │ Auto-generated  │
│ updated_at      │ TIMESTAMP   │ Auto-updated    │
└─────────────────┴─────────────┴─────────────────┘

ExperimentAssignment Table:
┌─────────────────┬─────────────┬─────────────────┐
│ Field           │ Type        │ Constraints     │
├─────────────────┼─────────────┼─────────────────┤
│ id              │ UUID        │ Primary Key     │
│ tenant_id       │ UUID        │ Foreign Key     │
│ experiment_id   │ UUID        │ Foreign Key     │
│ user_id         │ VARCHAR(255)│ Not Null, Index │
│ variant         │ VARCHAR(100)│ Not Null        │
│ assigned_at     │ TIMESTAMP   │ Auto-generated  │
└─────────────────┴─────────────┴─────────────────┘
```

### Indexing Strategy

| Index | Columns | Purpose |
|-------|---------|---------|
| **exp_name_tenant** | tenant_id, experiment_name | Experiment lookup |
| **assignment_lookup** | tenant_id, experiment_id, user_id | User assignment |
| **user_assignments** | user_id, tenant_id | User experiment list |
| **variant_analytics** | experiment_id, variant | Performance queries |
| **status_filter** | status, tenant_id | Active experiment queries |

### Multi-Tenant Security

- All models inherit tenant isolation automatically
- Foreign key relationships respect tenant boundaries
- Unique constraints include tenant_id to prevent conflicts
- Query managers automatically filter by current tenant
- Admin interface shows only tenant-specific data

---

## Validation and Testing Checklist

### Model Validation
- [ ] Experiment model creates successfully
- [ ] experiment_name field enforces uniqueness per tenant
- [ ] variants field accepts valid JSON structures
- [ ] traffic_split field validates percentage ranges
- [ ] status field restricts to defined choices
- [ ] ExperimentAssignment model relationships work correctly
- [ ] user_id field accepts various identifier formats
- [ ] variant field validates against experiment variants

### Multi-Tenancy Testing
- [ ] Models automatically filter by tenant
- [ ] Cross-tenant data access is prevented
- [ ] Unique constraints work within tenant boundaries
- [ ] Foreign key relationships respect tenant isolation
- [ ] Admin interface shows tenant-specific data only

### Performance Testing
- [ ] Database queries use appropriate indexes
- [ ] Assignment lookups perform efficiently
- [ ] Bulk operations handle large datasets
- [ ] Query plans are optimized for common patterns
- [ ] Migration scripts execute without issues

### Integration Testing
- [ ] Models work with Django admin interface
- [ ] API serialization functions correctly
- [ ] Field validations provide clear error messages
- [ ] Model relationships support expected operations
- [ ] Audit trails capture model changes appropriately

---

## Next Steps

After completing these tasks:
1. **Implement ExperimentService** - Create service layer for experiment management
2. **Add Assignment Logic** - Implement hash-based user assignment algorithms
3. **Create Analytics Tracking** - Build conversion and performance tracking
4. **Develop Admin Interface** - Create experiment management interface
5. **API Endpoints** - Expose experiment functionality via REST API
6. **Testing Framework** - Comprehensive test suite for A/B testing models

The next document [02_Tasks-77-82_Experiment-Service.md](02_Tasks-77-82_Experiment-Service.md) covers the service layer implementation that will utilize these models for complete A/B testing functionality.

---

*This document is part of the LCC ERP AI Infrastructure Setup. Each task builds upon previous work to create a comprehensive A/B testing framework suitable for enterprise multi-tenant SaaS applications.*