# Tasks 01-09: MeiliSearch Installation and Client Setup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** A - Search Engine Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-16_Config-Migration.md](02_Tasks-10-16_Config-Migration.md)

---

## Document Overview

This document covers the installation and setup of MeiliSearch search engine for the LankaCommerce Cloud ERP system. It establishes the foundational search infrastructure including Docker container setup, Python client installation, Django settings configuration, and the SearchClient wrapper class with tenant-aware index management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install MeiliSearch | Medium | 30 min |
| 02 | Install meilisearch Python | Low | 10 min |
| 03 | Create Search Settings | Low | 20 min |
| 04 | Create MEILISEARCH_HOST | Low | 10 min |
| 05 | Create MEILISEARCH_API_KEY | Low | 10 min |
| 06 | Create MEILISEARCH_INDEX_PREFIX | Low | 10 min |
| 07 | Create SearchClient | Medium | 45 min |
| 08 | Create get_index Method | Low | 20 min |
| 09 | Create tenant_index_name Method | Low | 15 min |

---

## Task 01: Install MeiliSearch

### Overview
Set up MeiliSearch search engine as a Docker container service. MeiliSearch is a powerful, fast, and open-source search engine that will handle all search operations for the ERP system. The container will run independently and provide RESTful API endpoints for search functionality with tenant isolation support.

### Dependencies
- Docker and Docker Compose installed
- SubPhase-03 (Demand Forecasting) completed
- Backend infrastructure established

### Instructions

1. **Navigate to Docker configuration directory**
   - Go to the root project directory where `docker-compose.yml` is located
   - Ensure Docker service is running on the development machine

2. **Add MeiliSearch service to docker-compose.yml**
   - Add new service definition under `services:` section
   - Configure MeiliSearch container with proper image version
   - Use `getmeili/meilisearch:latest` as the base image

3. **Configure MeiliSearch container settings**
   - Set container name to `lcc_meilisearch` for easy identification
   - Map port 7700 (MeiliSearch default) to host port 7700
   - Create persistent volume for data storage

4. **Set up environment variables**
   - Configure `MEILI_MASTER_KEY` environment variable
   - Use a secure, random master key for production security
   - Consider using Docker secrets for production deployment

5. **Configure data persistence**
   - Create named volume `meili_data` for index persistence
   - Mount volume to `/meili_data` inside container
   - Ensure data survives container restarts

6. **Set up container networking**
   - Ensure MeiliSearch container is in same Docker network as Django
   - Configure internal DNS resolution for service communication
   - Allow backend services to communicate via container names

7. **Start MeiliSearch container**
   - Run `docker-compose up -d meilisearch` to start service
   - Verify container is running with `docker-compose ps`
   - Check logs with `docker-compose logs meilisearch`

### Container Configuration

| Setting | Value | Purpose |
|---------|--------|---------|
| Image | getmeili/meilisearch:latest | Latest stable MeiliSearch |
| Port | 7700:7700 | Standard MeiliSearch port |
| Volume | meili_data:/meili_data | Data persistence |
| Environment | MEILI_MASTER_KEY | Authentication |

### Network Architecture

```
Django Backend ←→ MeiliSearch Container
       ↕               ↕
   Port 8000        Port 7700
       ↕               ↕
   Host Network ←→ Docker Bridge
```

### Data Volume Structure

```
meili_data/
├── data.ms          # Main database file
├── indexes/         # Search indexes
└── snapshots/       # Backup snapshots
```

### Expected Outcome
- MeiliSearch container running and accessible
- Persistent data storage configured
- Service accessible on localhost:7700
- Container logs showing successful startup

### Verification Checklist
- [ ] Docker Compose service definition added
- [ ] MEILI_MASTER_KEY environment variable set
- [ ] Named volume created and mounted
- [ ] Container starts without errors
- [ ] MeiliSearch API responding on port 7700
- [ ] Health check endpoint accessible

---

## Task 02: Install meilisearch Python Client

### Overview
Install the official MeiliSearch Python client library to enable Django backend communication with the MeiliSearch service. This client provides a Python interface for all MeiliSearch operations including index management, document insertion, searching, and configuration.

### Dependencies
- Task 01: Install MeiliSearch completed
- Python virtual environment activated
- Poetry or pip available for package management

### Instructions

1. **Activate project virtual environment**
   - Navigate to backend project directory
   - Ensure correct Python environment is active
   - Verify environment isolation

2. **Install meilisearch Python package**
   - Add `meilisearch>=0.28.0` to requirements/dependencies
   - Use Poetry: Add to `pyproject.toml` under dependencies
   - Use pip: Add to `requirements.txt` file

3. **Update dependency management**
   - For Poetry: Run `poetry add meilisearch>=0.28.0`
   - For pip: Add line to requirements.txt and run `pip install -r requirements.txt`
   - Ensure version compatibility with MeiliSearch server

4. **Verify installation**
   - Test import in Python shell: `import meilisearch`
   - Check installed version: `meilisearch.__version__`
   - Verify no import errors or conflicts

5. **Update development dependencies**
   - Add to development requirements if using separate files
   - Update Docker requirements files if containerized
   - Ensure consistent versions across environments

### Package Specifications

| Package | Version | Purpose |
|---------|---------|---------|
| meilisearch | >=0.28.0 | Python client library |
| Dependencies | auto-installed | HTTP client, JSON handling |

### Installation Methods

| Method | Command | Use Case |
|--------|---------|----------|
| Poetry | `poetry add meilisearch` | Modern dependency management |
| Pip | `pip install meilisearch` | Traditional package installation |
| Requirements | Add to requirements.txt | Production deployments |

### Version Compatibility

```
MeiliSearch Server v1.x ←→ meilisearch-python ≥0.28.0
         │                           │
         ├── API v1 compatible        ├── Full feature support
         ├── All endpoints           ├── Type hints
         └── Latest features         └── Async support
```

### Expected Outcome
- MeiliSearch Python client successfully installed
- No version conflicts with existing packages
- Package available for import in Django applications
- Dependency tracking updated

### Verification Checklist
- [ ] meilisearch package installed (≥0.28.0)
- [ ] Import successful without errors
- [ ] Version compatibility confirmed
- [ ] Dependency files updated
- [ ] No package conflicts detected

---

## Task 03: Create Search Settings

### Overview
Create a dedicated search configuration section in Django settings to centralize all MeiliSearch-related configurations. This settings module will contain connection details, API keys, index prefixes, and other search-related parameters that can be easily managed across different environments.

### Dependencies
- Task 02: Install meilisearch Python completed
- Django settings structure established
- Environment configuration system in place

### Instructions

1. **Navigate to Django settings directory**
   - Go to `backend/core/settings/` directory
   - Identify appropriate settings file for search configuration
   - Consider environment-specific settings files

2. **Create search settings section**
   - Add new section in settings file: `# Search Engine Settings`
   - Group all MeiliSearch-related configurations together
   - Use clear section headers and comments for documentation

3. **Plan search configuration structure**
   - Define settings for connection (host, port, API key)
   - Configure index naming and prefixes
   - Set up environment-specific defaults
   - Plan for production vs development configurations

4. **Add search configuration template**
   - Create placeholder settings for all required MeiliSearch options
   - Include comments explaining each setting's purpose
   - Set up proper import statements if needed

5. **Configure environment variable support**
   - Use `os.environ.get()` or similar for external configuration
   - Set sensible defaults for development environment
   - Plan for production environment variable injection

6. **Document search settings**
   - Add inline comments explaining each setting
   - Document expected values and formats
   - Include examples for common configurations

7. **Validate settings structure**
   - Ensure settings are properly structured and accessible
   - Test that Django can load settings without errors
   - Verify settings are available in Django shell

### Settings Structure

```
# Search Engine Settings
# =====================
MEILISEARCH_HOST = ""           # Task 04
MEILISEARCH_API_KEY = ""        # Task 05
MEILISEARCH_INDEX_PREFIX = ""   # Task 06
# Additional search settings...
```

### Configuration Categories

| Category | Settings | Purpose |
|----------|----------|---------|
| Connection | HOST, API_KEY | Service connection |
| Indexing | INDEX_PREFIX | Tenant isolation |
| Performance | TIMEOUT, RETRIES | Reliability |
| Features | TYPO_TOLERANCE, SYNONYMS | Search behavior |

### Environment Support

| Environment | Configuration | Source |
|-------------|---------------|--------|
| Development | Hard-coded defaults | settings.py |
| Staging | Environment variables | .env file |
| Production | Environment variables | Container/K8s |

### Expected Outcome
- Dedicated search settings section created
- Clear structure for MeiliSearch configurations
- Environment variable support established
- Settings accessible throughout Django application

### Verification Checklist
- [ ] Search settings section added to Django settings
- [ ] Section properly commented and documented
- [ ] Environment variable structure prepared
- [ ] Settings file loads without errors
- [ ] Configuration accessible in Django shell

---

## Task 04: Create MEILISEARCH_HOST Setting

### Overview
Configure the MEILISEARCH_HOST setting to specify the connection endpoint for the MeiliSearch service. This setting will differ between development (localhost) and production (Docker service) environments, enabling proper service discovery and communication across different deployment scenarios.

### Dependencies
- Task 03: Create Search Settings completed
- MeiliSearch service running and accessible
- Environment configuration system established

### Instructions

1. **Define MEILISEARCH_HOST setting**
   - Add MEILISEARCH_HOST to the search settings section
   - Set appropriate default value for development environment
   - Use environment variable support for production override

2. **Configure development default**
   - Set default value to `http://localhost:7700`
   - This points to MeiliSearch container exposed port
   - Ensure port matches Docker Compose configuration

3. **Plan production configuration**
   - Production value should be `http://meilisearch:7700`
   - Uses Docker internal service name for container-to-container communication
   - Avoids external network traversal in production

4. **Implement environment variable support**
   - Use `os.environ.get('MEILISEARCH_HOST', default_value)`
   - Allow environment-specific override capability
   - Document expected environment variable format

5. **Add setting validation**
   - Ensure URL format is valid (http:// or https://)
   - Include port number in the URL specification
   - Consider adding basic connectivity validation

6. **Document host configuration**
   - Add inline comments explaining development vs production values
   - Document how to override for different environments
   - Include examples for common deployment scenarios

### Host Configuration Matrix

| Environment | MEILISEARCH_HOST | Access Method |
|-------------|------------------|---------------|
| Development | http://localhost:7700 | Direct port mapping |
| Docker Compose | http://meilisearch:7700 | Service name resolution |
| Production | http://meilisearch:7700 | Internal cluster network |
| External Service | https://search.example.com | External MeiliSearch |

### URL Format Specifications

```
Protocol: http:// or https://
Host:     localhost, meilisearch, or FQDN
Port:     7700 (MeiliSearch default)
Path:     / (root, no additional path)
```

### Environment Variable Override

| Variable | Value | Use Case |
|----------|-------|----------|
| MEILISEARCH_HOST | http://localhost:7700 | Local development |
| MEILISEARCH_HOST | http://meilisearch:7700 | Docker deployment |
| MEILISEARCH_HOST | https://search.prod.com | External service |

### Network Connectivity

```
Development:
Django (localhost:8000) → MeiliSearch (localhost:7700)

Production:
Django Container → Docker Network → MeiliSearch Container
```

### Expected Outcome
- MEILISEARCH_HOST setting properly configured
- Environment-appropriate default value set
- Override capability through environment variables
- Clear documentation for different deployment scenarios

### Verification Checklist
- [ ] MEILISEARCH_HOST setting added to Django settings
- [ ] Default value set to http://localhost:7700
- [ ] Environment variable override support implemented
- [ ] URL format validation considered
- [ ] Settings accessible in Django shell
- [ ] Documentation includes deployment scenarios

---

## Task 05: Create MEILISEARCH_API_KEY Setting

### Overview
Configure the MEILISEARCH_API_KEY setting to handle authentication with the MeiliSearch service. This setting manages the master key used for all MeiliSearch operations, ensuring secure communication between Django backend and the search engine with proper access control.

### Dependencies
- Task 04: Create MEILISEARCH_HOST completed
- MeiliSearch master key configured in Docker
- Secure key management practices established

### Instructions

1. **Define MEILISEARCH_API_KEY setting**
   - Add MEILISEARCH_API_KEY to search settings section
   - Position after MEILISEARCH_HOST for logical organization
   - Use environment variable for secure key management

2. **Configure secure key handling**
   - Never hard-code API keys in settings files
   - Use `os.environ.get('MEILI_MASTER_KEY')` for environment retrieval
   - Set empty string as default for safety (forces explicit configuration)

3. **Align with Docker configuration**
   - Ensure setting matches `MEILI_MASTER_KEY` from Docker Compose
   - Use same environment variable name for consistency
   - Verify key format and length requirements

4. **Implement key validation**
   - Add basic validation for key presence
   - Consider key format validation (length, characters)
   - Plan for startup validation of MeiliSearch connectivity

5. **Document security requirements**
   - Add comments about key security and rotation
   - Document environment variable requirements
   - Include warnings about key exposure risks

6. **Plan for different environments**
   - Development: Use simple key for testing
   - Production: Use strong, randomly generated key
   - Staging: Use separate key from production

### API Key Security

| Environment | Key Source | Security Level |
|-------------|------------|----------------|
| Development | .env file | Low (convenience) |
| Staging | Environment variable | Medium |
| Production | Secret management | High (encrypted) |

### Key Management Practices

| Practice | Implementation | Purpose |
|----------|----------------|---------|
| No hard-coding | Environment variables only | Prevent code exposure |
| Key rotation | Regular key updates | Minimize breach impact |
| Access control | Limited key distribution | Reduce attack surface |
| Monitoring | Key usage logging | Detect unauthorized access |

### Environment Variable Structure

```
Development (.env):
MEILI_MASTER_KEY=development_key_123

Production (K8s Secret):
MEILI_MASTER_KEY=prod_secure_random_key_xyz789
```

### Django Settings Implementation

```
# Security: Never commit actual keys to repository
# Use environment variables for all deployments
MEILISEARCH_API_KEY = os.environ.get('MEILI_MASTER_KEY', '')
```

### Key Validation Strategy

| Validation | Check | Action |
|------------|-------|--------|
| Presence | Key not empty | Raise configuration error |
| Length | Minimum 16 characters | Log security warning |
| Format | Alphanumeric + symbols | Accept all valid chars |
| Connectivity | Test MeiliSearch connection | Validate at startup |

### Expected Outcome
- MEILISEARCH_API_KEY setting securely configured
- Environment variable integration established
- No API keys hard-coded in settings files
- Key validation and security practices implemented

### Verification Checklist
- [ ] MEILISEARCH_API_KEY setting added
- [ ] Environment variable integration implemented
- [ ] No hard-coded keys in settings files
- [ ] Key matches Docker MEILI_MASTER_KEY
- [ ] Basic validation logic considered
- [ ] Security documentation included

---

## Task 06: Create MEILISEARCH_INDEX_PREFIX Setting

### Overview
Configure the MEILISEARCH_INDEX_PREFIX setting to enable tenant-scoped index naming in the multi-tenant ERP system. This prefix ensures complete isolation between different tenant data by creating separate search indexes for each tenant, following the pattern `lcc_{tenant_id}_{index_type}`.

### Dependencies
- Task 05: Create MEILISEARCH_API_KEY completed
- Multi-tenant architecture understanding established
- Index naming strategy planned

### Instructions

1. **Define MEILISEARCH_INDEX_PREFIX setting**
   - Add to search settings section after API key configuration
   - Set default prefix value to maintain consistency
   - Plan for environment-specific prefix customization

2. **Configure default prefix value**
   - Use `lcc_` as default prefix (LankaCommerce Cloud)
   - Keep prefix short to minimize index name length
   - Use underscore separator for clarity

3. **Plan tenant isolation strategy**
   - Final index format: `{PREFIX}{tenant_id}_{index_type}`
   - Example: `lcc_tenant123_products`, `lcc_tenant123_customers`
   - Ensure complete separation between tenant data

4. **Implement environment override**
   - Use `os.environ.get('MEILISEARCH_INDEX_PREFIX', 'lcc_')`
   - Allow different prefixes for different environments
   - Consider prefixes like `dev_`, `stage_`, `prod_`

5. **Add prefix validation**
   - Ensure prefix ends with underscore for proper concatenation
   - Validate prefix contains only valid index name characters
   - Check prefix length limits (MeiliSearch index name constraints)

6. **Document index naming convention**
   - Explain complete index naming strategy
   - Provide examples for different tenant scenarios
   - Document relationship to tenant isolation

### Index Naming Strategy

| Component | Example | Purpose |
|-----------|---------|---------|
| Prefix | lcc_ | Application identifier |
| Tenant ID | tenant123_ | Tenant isolation |
| Index Type | products | Data type separation |
| Final Name | lcc_tenant123_products | Complete index name |

### Environment Prefixes

| Environment | Prefix | Purpose |
|-------------|--------|---------|
| Development | dev_lcc_ | Development isolation |
| Staging | stage_lcc_ | Staging environment |
| Production | lcc_ | Clean production names |
| Testing | test_lcc_ | Test isolation |

### Tenant Isolation Examples

```
Tenant 1 Indexes:
├── lcc_tenant001_products
├── lcc_tenant001_customers
├── lcc_tenant001_orders
└── lcc_tenant001_inventory

Tenant 2 Indexes:
├── lcc_tenant002_products
├── lcc_tenant002_customers  
├── lcc_tenant002_orders
└── lcc_tenant002_inventory
```

### Index Name Validation

| Rule | Check | Purpose |
|------|-------|---------|
| Length | ≤ 512 characters | MeiliSearch limit |
| Characters | a-z, 0-9, _, - | Valid characters only |
| Format | prefix_tenant_type | Consistent structure |
| Uniqueness | No duplicate names | Prevent conflicts |

### MeiliSearch Index Naming Rules

```
Valid Characters: a-z, 0-9, - (hyphen), _ (underscore)
Case Sensitivity: Case insensitive
Length Limit: 512 characters maximum
Reserved Names: None specific to avoid
```

### Expected Outcome
- MEILISEARCH_INDEX_PREFIX setting properly configured
- Tenant isolation naming strategy established
- Environment-specific prefix capability
- Index naming validation rules documented

### Verification Checklist
- [ ] MEILISEARCH_INDEX_PREFIX setting added
- [ ] Default prefix set to 'lcc_'
- [ ] Environment variable override implemented
- [ ] Tenant isolation strategy documented
- [ ] Index naming examples provided
- [ ] MeiliSearch naming rules considered

---

## Task 07: Create SearchClient Class

### Overview
Create a SearchClient wrapper class that encapsulates MeiliSearch client functionality and provides a clean interface for the Django application. This singleton class will manage the MeiliSearch connection, handle index operations, and implement tenant-aware search functionality with proper error handling and connection management.

### Dependencies
- Task 06: Create MEILISEARCH_INDEX_PREFIX completed
- meilisearch Python client available
- Django app structure for search module

### Instructions

1. **Create search app structure**
   - Create `backend/apps/search/` directory if not exists
   - Add `__init__.py` to make it a Python package
   - Create `clients/` subdirectory for client classes

2. **Create SearchClient class file**
   - Create `meili_client.py` in `apps/search/clients/`
   - Import necessary dependencies (meilisearch, Django settings)
   - Set up basic class structure with proper imports

3. **Implement singleton pattern**
   - Ensure only one SearchClient instance exists
   - Use class-level instance variable for singleton management
   - Implement proper initialization and reuse logic

4. **Initialize MeiliSearch client connection**
   - Import meilisearch library and create client instance
   - Use Django settings for host and API key configuration
   - Handle connection errors gracefully with proper exceptions

5. **Add client configuration**
   - Configure client timeout settings for reliability
   - Set up retry logic for transient connection failures
   - Implement connection health check functionality

6. **Create base client interface**
   - Define public methods for index management
   - Plan for tenant-aware operations
   - Include error handling and logging capabilities

7. **Implement connection validation**
   - Add method to test MeiliSearch connectivity
   - Validate API key and permissions
   - Provide meaningful error messages for configuration issues

### Class Structure Design

```
SearchClient (Singleton)
├── __init__()          # Initialize MeiliSearch client
├── get_client()        # Return MeiliSearch client instance
├── get_index()         # Get/create index (Task 08)
├── tenant_index_name() # Generate tenant index names (Task 09)
└── health_check()      # Verify connection health
```

### Singleton Implementation Pattern

| Pattern | Implementation | Benefit |
|---------|----------------|---------|
| Class Variable | `_instance = None` | Single instance storage |
| Factory Method | `get_instance()` | Controlled instantiation |
| Thread Safety | Lock mechanism | Multi-thread safety |
| Lazy Loading | Initialize on first use | Performance optimization |

### Error Handling Strategy

| Error Type | Handling | Response |
|------------|----------|----------|
| Connection Failed | Retry with backoff | Log and raise |
| Invalid API Key | No retry | Configuration error |
| Timeout | Retry limited times | Warn and fallback |
| Index Not Found | Create if possible | Transparent creation |

### Client Configuration

```
MeiliSearch Client Settings:
├── Host: From Django settings
├── API Key: From Django settings  
├── Timeout: 10 seconds default
├── Retries: 3 attempts
└── Health Check: On initialization
```

### Connection Management

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Lazy Connection | Connect on first use | Avoid startup delays |
| Connection Pooling | Use client defaults | Performance |
| Health Monitoring | Periodic checks | Detect failures |
| Graceful Degradation | Fallback behavior | Service resilience |

### Expected Outcome
- SearchClient class created with singleton pattern
- MeiliSearch client properly initialized and configured
- Connection validation and error handling implemented
- Foundation for tenant-aware search operations established

### Verification Checklist
- [ ] `apps/search/clients/meili_client.py` file created
- [ ] SearchClient class with singleton pattern
- [ ] MeiliSearch client initialization implemented
- [ ] Django settings integration working
- [ ] Basic error handling and logging added
- [ ] Connection validation functionality
- [ ] Class imports and dependencies resolved

---

## Task 08: Create get_index Method

### Overview
Implement the `get_index` method in the SearchClient class to retrieve or create MeiliSearch indexes on demand. This method will handle index lifecycle management, ensuring indexes exist when needed while providing efficient caching and error handling for index operations.

### Dependencies
- Task 07: Create SearchClient Class completed
- MeiliSearch client initialized and connected
- Understanding of MeiliSearch Index API

### Instructions

1. **Define get_index method signature**
   - Add `get_index(self, index_name: str)` method to SearchClient
   - Include proper type hints for parameters and return value
   - Return MeiliSearch Index object for operations

2. **Implement index retrieval logic**
   - Use MeiliSearch client to get existing index
   - Handle case where index doesn't exist
   - Implement automatic index creation when needed

3. **Add index caching mechanism**
   - Cache retrieved indexes to avoid repeated API calls
   - Use instance-level cache (dictionary) for index storage
   - Implement cache invalidation when needed

4. **Implement index creation logic**
   - Create index automatically if it doesn't exist
   - Set basic index configuration during creation
   - Handle creation errors and conflicts gracefully

5. **Add error handling**
   - Catch MeiliSearch connection errors
   - Handle invalid index names
   - Provide meaningful error messages for debugging

6. **Implement index validation**
   - Validate index name format before operations
   - Check index accessibility and permissions
   - Ensure index is ready for operations

7. **Add logging and monitoring**
   - Log index creation and retrieval operations
   - Monitor index operation performance
   - Track index usage for optimization

### Method Implementation Strategy

```
def get_index(self, index_name: str):
    1. Validate index name
    2. Check local cache
    3. Retrieve from MeiliSearch
    4. Create if doesn't exist
    5. Cache and return index
```

### Index Caching Strategy

| Cache Key | Cache Value | TTL |
|-----------|-------------|-----|
| index_name | Index object | Session |
| creation_status | Boolean | 5 minutes |
| last_access | Timestamp | N/A |

### Index Creation Configuration

| Setting | Default Value | Purpose |
|---------|---------------|---------|
| Primary Key | Auto-detect | Document identification |
| Searchable Attributes | All fields | Search scope |
| Filterable Attributes | Empty | Filter capability |
| Sortable Attributes | Empty | Sort capability |

### Error Scenarios and Handling

| Scenario | Error Type | Handling |
|----------|------------|----------|
| Invalid index name | ValueError | Validate and reject |
| Connection failed | ConnectionError | Retry with backoff |
| Permission denied | AuthError | Log and re-raise |
| Index creation failed | APIError | Log details and retry |

### Index Name Validation Rules

```
Valid Format:
├── Length: 1-512 characters
├── Characters: a-z, 0-9, -, _
├── Case: Case-insensitive
└── Reserved: Avoid system names
```

### Performance Considerations

| Optimization | Implementation | Benefit |
|-------------|----------------|---------|
| Local Caching | In-memory cache | Reduce API calls |
| Lazy Loading | Create on demand | Faster startup |
| Connection Reuse | Persistent client | Lower latency |
| Batch Operations | Group operations | Higher throughput |

### Expected Outcome
- get_index method successfully implemented
- Automatic index creation and retrieval working
- Index caching mechanism for performance
- Proper error handling for all scenarios

### Verification Checklist
- [ ] get_index method added to SearchClient
- [ ] Method accepts index_name parameter
- [ ] Index retrieval from MeiliSearch working
- [ ] Automatic index creation implemented
- [ ] Index caching mechanism working
- [ ] Error handling for common scenarios
- [ ] Index name validation included
- [ ] Logging and monitoring added

---

## Task 09: Create tenant_index_name Method

### Overview
Implement the `tenant_index_name` method to generate tenant-specific index names for the multi-tenant ERP system. This method ensures complete data isolation between tenants by creating unique index names following the established naming convention, supporting various index types for different data categories.

### Dependencies
- Task 08: Create get_index Method completed
- MEILISEARCH_INDEX_PREFIX setting available
- Tenant model and identification system established

### Instructions

1. **Define tenant_index_name method signature**
   - Add `tenant_index_name(self, tenant_id: str, index_type: str)` method
   - Include proper type hints for parameters and return value
   - Return fully qualified index name string

2. **Implement index name generation logic**
   - Combine prefix, tenant ID, and index type
   - Use format: `{PREFIX}{tenant_id}_{index_type}`
   - Ensure consistent naming across all tenant operations

3. **Add input validation**
   - Validate tenant_id format and requirements
   - Validate index_type against allowed types
   - Ensure generated name meets MeiliSearch requirements

4. **Support multiple index types**
   - Define supported index types (products, customers, orders, etc.)
   - Validate index_type parameter against allowed values
   - Plan for future index type additions

5. **Implement name normalization**
   - Convert tenant_id to consistent format (lowercase)
   - Remove or replace invalid characters
   - Ensure names are within MeiliSearch limits

6. **Add tenant isolation validation**
   - Ensure tenant_id is properly isolated
   - Prevent cross-tenant access through naming
   - Validate tenant exists and is active

7. **Include configuration integration**
   - Use MEILISEARCH_INDEX_PREFIX from Django settings
   - Allow environment-specific prefix handling
   - Support configuration changes without code updates

### Index Naming Formula

```
Index Name = PREFIX + tenant_id + "_" + index_type

Examples:
├── lcc_tenant001_products
├── lcc_tenant001_customers
├── lcc_tenant001_orders
└── lcc_tenant001_inventory
```

### Supported Index Types

| Index Type | Purpose | Data Source |
|------------|---------|-------------|
| products | Product catalog search | Product model |
| customers | Customer information | Customer model |
| orders | Order search and filtering | Order model |
| inventory | Stock and inventory | Inventory model |
| invoices | Invoice search | Invoice model |
| suppliers | Supplier information | Supplier model |

### Input Validation Rules

| Parameter | Validation | Error Handling |
|-----------|------------|----------------|
| tenant_id | Non-empty, alphanumeric | ValueError |
| index_type | In allowed types | ValueError |
| Result length | ≤ 512 characters | NameTooLongError |

### Tenant ID Normalization

```
Input Processing:
├── Convert to lowercase
├── Replace spaces with underscores
├── Remove invalid characters
├── Truncate if too long
└── Validate final format
```

### Name Generation Examples

| Tenant ID | Index Type | Generated Name |
|-----------|------------|----------------|
| TENANT001 | products | lcc_tenant001_products |
| Company-ABC | customers | lcc_company-abc_customers |
| test_tenant | orders | lcc_test_tenant_orders |

### Integration with get_index Method

```
Usage Pattern:
1. Call tenant_index_name(tenant_id, index_type)
2. Use result with get_index(generated_name)
3. Perform search operations on tenant-specific index
```

### Expected Outcome
- tenant_index_name method successfully implemented
- Consistent tenant-specific index naming
- Input validation and normalization working
- Integration with existing SearchClient functionality

### Verification Checklist
- [ ] tenant_index_name method added to SearchClient
- [ ] Method accepts tenant_id and index_type parameters
- [ ] Index name generation follows defined format
- [ ] Input validation for both parameters
- [ ] Name normalization for special characters
- [ ] Integration with MEILISEARCH_INDEX_PREFIX
- [ ] Support for all defined index types
- [ ] Method returns valid MeiliSearch index names

---

## Summary

This document established the foundational MeiliSearch infrastructure for the LankaCommerce Cloud ERP system, including Docker container setup, Python client installation, Django settings configuration, and the SearchClient wrapper class with tenant-aware functionality.

### Completed Tasks
1. ✓ Installed MeiliSearch Docker container with persistent storage
2. ✓ Installed meilisearch Python client library (≥0.28.0)
3. ✓ Created dedicated search settings section in Django
4. ✓ Configured MEILISEARCH_HOST with environment support
5. ✓ Configured MEILISEARCH_API_KEY with secure handling
6. ✓ Configured MEILISEARCH_INDEX_PREFIX for tenant isolation
7. ✓ Created SearchClient singleton class with connection management
8. ✓ Implemented get_index method with automatic creation and caching
9. ✓ Implemented tenant_index_name method for multi-tenant isolation

### Key Infrastructure Components

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| MeiliSearch Container | Search engine service | Docker with persistent volume |
| Python Client | API communication | meilisearch library ≥0.28.0 |
| Django Settings | Configuration management | Environment variable support |
| SearchClient | Application interface | Singleton with error handling |
| Index Management | Tenant isolation | Prefix-based naming strategy |

### Next Steps
Proceed to [02_Tasks-10-16_Config-Migration.md](02_Tasks-10-16_Config-Migration.md) to create the SearchConfig model with tenant-specific search configuration, implement database migrations, and verify the complete search infrastructure setup.