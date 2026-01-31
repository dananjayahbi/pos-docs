# Tasks 01-08: S3 Storage Configuration

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 10 - Advanced Image Optimization  
> **Group:** A - Storage & CDN Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-15_Image-Processing-Pipeline.md](02_Tasks-09-15_Image-Processing-Pipeline.md)

---

## Document Overview

This document covers the complete setup of AWS S3 storage infrastructure for the LankaCommerce Cloud image optimization system. It establishes the foundational cloud storage architecture, including bucket configuration, security policies, CDN integration, and multi-tenant isolation patterns necessary for handling product images, user avatars, and document attachments across different tenant organizations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Configure S3 Storage Buckets | Medium | 45 min |
| 02 | Setup Bucket Security Policies | High | 60 min |
| 03 | Configure CORS Settings | Medium | 30 min |
| 04 | Design Folder Structure Pattern | Medium | 40 min |
| 05 | Create Upload Service Architecture | High | 75 min |
| 06 | Implement Tenant Data Isolation | High | 90 min |
| 07 | Setup CDN Distribution | High | 60 min |
| 08 | Configure Cache Rules | Medium | 45 min |

---

## Task 01: Configure S3 Storage Buckets

### Overview
Create and configure the primary S3 buckets required for the image optimization system. This includes separate buckets for different environments (development, staging, production) and different content types (original images, optimized images, thumbnails). The bucket configuration must align with multi-tenant architecture requirements and support global content delivery.

### Dependencies
- AWS account with appropriate S3 permissions
- Backend infrastructure foundation (Phase-03) completed
- Multi-tenancy architecture (Phase-02) established

### Instructions

1. **Plan bucket naming strategy**
   - Use consistent naming convention: `lcc-{environment}-{purpose}`
   - Create separate buckets for different environments
   - Ensure globally unique bucket names

2. **Create primary image storage buckets**
   - Main images bucket: `lcc-prod-images-original`
   - Optimized images bucket: `lcc-prod-images-optimized`
   - Thumbnails bucket: `lcc-prod-images-thumbnails`
   - Create corresponding dev/staging buckets

3. **Configure bucket regions**
   - Select appropriate AWS region for Sri Lankan users
   - Consider Singapore (ap-southeast-1) for best latency
   - Document region choices for consistency

4. **Set bucket versioning**
   - Enable versioning on original images bucket
   - Disable versioning on optimized/thumbnail buckets
   - Configure lifecycle policies for version management

5. **Configure bucket encryption**
   - Enable server-side encryption with S3-managed keys (SSE-S3)
   - Document encryption settings for compliance
   - Ensure encryption at rest for all sensitive data

6. **Setup bucket logging**
   - Enable access logging for security monitoring
   - Create separate logging bucket if required
   - Configure log retention policies

### Bucket Architecture

```
AWS S3 Storage Structure
├── lcc-prod-images-original/     # Source images, versioned
├── lcc-prod-images-optimized/    # Processed images, no versioning
├── lcc-prod-images-thumbnails/   # Generated thumbnails
├── lcc-prod-documents/           # PDF, documents
├── lcc-staging-images-original/  # Staging environment
├── lcc-staging-images-optimized/
└── lcc-dev-images-original/      # Development environment
```

### Regional Considerations

| Region | Code | Latency to SL | CDN Support |
|--------|------|---------------|-------------|
| Singapore | ap-southeast-1 | ~30ms | Excellent |
| Mumbai | ap-south-1 | ~50ms | Good |
| Sydney | ap-southeast-2 | ~80ms | Good |

### Bucket Configuration Settings

| Setting | Original Bucket | Optimized Bucket | Thumbnail Bucket |
|---------|----------------|------------------|------------------|
| Versioning | Enabled | Disabled | Disabled |
| Encryption | SSE-S3 | SSE-S3 | SSE-S3 |
| Public Access | Blocked | CDN Only | CDN Only |
| Lifecycle | 30 days | 90 days | 365 days |

### Expected Outcome
- All required S3 buckets created with proper naming
- Buckets configured with appropriate security settings
- Versioning and encryption properly configured
- Regional deployment optimized for Sri Lankan users

### Verification Checklist
- [ ] Primary buckets created for all environments
- [ ] Bucket names follow consistent naming convention
- [ ] Encryption enabled on all buckets
- [ ] Versioning configured appropriately per bucket type
- [ ] Access logging enabled and configured
- [ ] Bucket regions selected for optimal performance

---

## Task 02: Setup Bucket Security Policies

### Overview
Implement comprehensive IAM policies and bucket policies to ensure secure access to S3 storage while supporting the multi-tenant architecture. This includes creating service-specific access policies, preventing unauthorized access, and implementing least-privilege principles for different system components.

### Dependencies
- Task 01: Configure S3 Storage Buckets
- AWS IAM understanding and permissions
- Backend service architecture defined

### Instructions

1. **Create service IAM roles**
   - Backend API service role for image operations
   - CDN service role for content delivery
   - Admin role for bucket management
   - Backup service role for data archival

2. **Define bucket policy structure**
   - Block all public access by default
   - Allow CDN origin access identity (OAI)
   - Restrict API access to specific service roles
   - Implement IP-based restrictions if needed

3. **Implement upload permissions**
   - Restrict PUT operations to authenticated API calls
   - Limit upload file sizes and types
   - Validate content-type headers
   - Implement rate limiting through policies

4. **Configure read permissions**
   - Allow CDN to read all optimized content
   - Restrict direct S3 access from browsers
   - Enable temporary signed URLs for sensitive content
   - Implement tenant-based access controls

5. **Setup deletion and modification policies**
   - Restrict DELETE operations to admin roles
   - Prevent accidental bulk deletions
   - Require MFA for sensitive operations
   - Log all modification attempts

6. **Implement cross-bucket policies**
   - Allow image processing service to read from original bucket
   - Allow image processing service to write to optimized buckets
   - Prevent cross-tenant data access
   - Enable backup service access

### Security Policy Architecture

```
Security Layer Structure
├── Bucket Policies (Resource-based)
│   ├── Block public access
│   ├── CDN access permissions
│   └── Service-specific access
├── IAM Policies (Identity-based)
│   ├── API service permissions
│   ├── Processing service permissions
│   └── Admin permissions
└── Access Control Lists (ACLs)
    ├── Object-level permissions
    └── Tenant isolation rules
```

### IAM Role Breakdown

| Role Name | Purpose | Permissions |
|-----------|---------|-------------|
| LCC-API-Service | Backend API operations | Read/Write specific prefixes |
| LCC-Image-Processor | Image optimization | Read original, Write optimized |
| LCC-CDN-Service | Content delivery | Read optimized/thumbnails |
| LCC-Admin | Management operations | Full access with MFA |
| LCC-Backup | Data archival | Read all, Write archive bucket |

### Bucket Policy Components

| Policy Section | Purpose | Example Condition |
|----------------|---------|-------------------|
| Principal | Who can access | Service roles, CDN OAI |
| Action | What operations | s3:GetObject, s3:PutObject |
| Resource | Which objects | Specific prefixes, file types |
| Condition | When it applies | IP ranges, time restrictions |

### Security Best Practices

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| Least Privilege | Minimal required permissions | Reduces attack surface |
| Resource-specific | Bucket/prefix-level policies | Granular access control |
| Regular Auditing | Quarterly policy reviews | Maintains security posture |
| Logging | All access attempts | Security monitoring |

### Expected Outcome
- Comprehensive security policies implemented
- Multi-tenant data isolation enforced
- Service roles configured with minimal permissions
- Security monitoring and logging enabled

### Verification Checklist
- [ ] All IAM roles created with appropriate policies
- [ ] Bucket policies block unauthorized access
- [ ] CDN access properly configured
- [ ] Service-to-service permissions working
- [ ] Tenant isolation verified through testing
- [ ] Security logging enabled and monitored
- [ ] MFA required for administrative operations

---

## Task 03: Configure CORS Settings

### Overview
Configure Cross-Origin Resource Sharing (CORS) settings to enable secure browser-based uploads and image access from the LankaCommerce Cloud frontend applications. This includes setting up proper origins, headers, and methods while maintaining security for multi-tenant environments.

### Dependencies
- Task 02: Setup Bucket Security Policies
- Frontend domain structure defined
- SSL certificates configured for domains

### Instructions

1. **Identify allowed origins**
   - Production domains: `*.lankacommerce.cloud`
   - Staging domains: `*.staging.lankacommerce.cloud`
   - Development domains: `localhost:3000`, `localhost:3001`
   - Admin panel domains if separate

2. **Configure allowed HTTP methods**
   - GET: For image viewing and downloads
   - PUT: For direct browser uploads
   - POST: For multipart uploads
   - DELETE: For authorized content removal
   - HEAD: For metadata queries

3. **Setup allowed headers**
   - Content-Type: For file type specification
   - Authorization: For authenticated requests
   - x-amz-meta-*: For custom metadata
   - Cache-Control: For caching directives

4. **Define exposed headers**
   - ETag: For caching and version control
   - x-amz-request-id: For debugging
   - x-amz-version-id: For versioned objects
   - Content-Length: For file size information

5. **Set preflight cache duration**
   - Configure Max-Age to reduce preflight requests
   - Balance between performance and security
   - Typical value: 3600 seconds (1 hour)

6. **Configure per-bucket CORS rules**
   - Original images bucket: Restrictive, API-only
   - Optimized images bucket: Permissive for display
   - Thumbnails bucket: Public read access
   - Documents bucket: Authenticated access only

### CORS Configuration Structure

```
CORS Rules Architecture
├── Bucket: Original Images
│   ├── Origins: API domains only
│   ├── Methods: PUT, POST, DELETE
│   └── Headers: Authorization required
├── Bucket: Optimized Images
│   ├── Origins: All frontend domains
│   ├── Methods: GET, HEAD
│   └── Headers: Basic headers only
└── Bucket: Thumbnails
    ├── Origins: All frontend domains
    ├── Methods: GET, HEAD
    └── Headers: Public access headers
```

### Origin Patterns by Environment

| Environment | Origin Pattern | Purpose |
|-------------|----------------|---------|
| Production | `https://*.lankacommerce.cloud` | Live customer sites |
| Staging | `https://*.staging.lankacommerce.cloud` | Testing environment |
| Development | `http://localhost:[3000-3010]` | Local development |
| Admin | `https://admin.lankacommerce.cloud` | Management interface |

### Method Configuration by Bucket

| Bucket Type | Allowed Methods | Use Case |
|-------------|----------------|----------|
| Original | PUT, POST, DELETE | Upload and management |
| Optimized | GET, HEAD | Content delivery |
| Thumbnails | GET, HEAD | Fast image loading |
| Documents | GET, PUT, DELETE | Document management |

### Header Configuration

| Header Category | Headers | Purpose |
|-----------------|---------|---------|
| Required | Content-Type, Authorization | Basic functionality |
| Optional | Cache-Control, Expires | Performance optimization |
| Metadata | x-amz-meta-*, x-tenant-id | Custom information |
| Response | ETag, Last-Modified | Caching support |

### Security Considerations

| Aspect | Configuration | Security Benefit |
|--------|---------------|------------------|
| Origin Validation | Exact domain matching | Prevents unauthorized domains |
| Method Restriction | Minimal required methods | Reduces attack vectors |
| Header Filtering | Only necessary headers | Limits data exposure |
| Preflight Caching | Reasonable Max-Age | Balances performance/security |

### Expected Outcome
- CORS properly configured for all bucket types
- Frontend applications can access images securely
- Browser uploads working without CORS errors
- Security maintained through origin restrictions

### Verification Checklist
- [ ] CORS rules defined for each bucket type
- [ ] All frontend domains included in allowed origins
- [ ] HTTP methods configured per bucket requirements
- [ ] Required headers properly specified
- [ ] Preflight cache duration set appropriately
- [ ] Cross-browser compatibility verified
- [ ] Security restrictions maintained

---

## Task 04: Design Folder Structure Pattern

### Overview
Design a comprehensive folder structure pattern within S3 buckets that supports multi-tenancy, content organization, and efficient retrieval. The structure must accommodate different image types, sizes, tenant isolation, and future scalability while maintaining clear organization and fast access patterns.

### Dependencies
- Task 01: Configure S3 Storage Buckets
- Multi-tenancy architecture understanding
- Content type requirements defined

### Instructions

1. **Design tenant isolation pattern**
   - Use tenant UUID as primary folder separator
   - Implement consistent naming across all buckets
   - Ensure tenant data cannot cross-contaminate
   - Plan for tenant migration and backup scenarios

2. **Create content type organization**
   - Separate folders for different content categories
   - Product images, user avatars, document attachments
   - Marketing materials, system assets
   - Temporary uploads and processing folders

3. **Implement size-based organization**
   - Original images in dedicated subfolder
   - Multiple optimized sizes (thumbnail, small, medium, large)
   - WebP and fallback format separation
   - Responsive image variant organization

4. **Design date-based partitioning**
   - Year/Month structure for better organization
   - Improves listing performance for large datasets
   - Supports efficient cleanup and archival
   - Maintains chronological data access

5. **Plan metadata and versioning**
   - Consistent naming conventions
   - Version numbers for updated content
   - Metadata storage patterns
   - Backup and recovery folder structure

6. **Create indexing and search folders**
   - Image processing queue folders
   - Search index generation areas
   - Temporary processing workspaces
   - Error handling and retry folders

### Folder Structure Architecture

```
S3 Bucket Structure (per tenant)
/{bucket}/
├── {tenant-uuid}/
│   ├── products/
│   │   ├── 2026/01/
│   │   │   ├── original/
│   │   │   ├── optimized/
│   │   │   │   ├── thumbnail/    # 150x150
│   │   │   │   ├── small/        # 300x300
│   │   │   │   ├── medium/       # 600x600
│   │   │   │   └── large/        # 1200x1200
│   │   │   └── webp/
│   │   │       ├── thumbnail/
│   │   │       ├── small/
│   │   │       ├── medium/
│   │   │       └── large/
│   ├── users/
│   │   ├── avatars/
│   │   │   ├── original/
│   │   │   └── optimized/
│   ├── documents/
│   │   ├── invoices/
│   │   ├── reports/
│   │   └── attachments/
│   └── temp/
│       ├── uploads/
│       └── processing/
```

### Naming Conventions

| Content Type | Pattern | Example |
|--------------|---------|---------|
| Product Image | `{product-id}_{variant-id}_{timestamp}` | `prod_123_var_456_20260131_001.jpg` |
| User Avatar | `{user-id}_{size}_{timestamp}` | `user_789_avatar_20260131.jpg` |
| Document | `{doc-type}_{doc-id}_{timestamp}` | `invoice_inv_001_20260131.pdf` |
| Temporary | `{session-id}_{sequence}` | `sess_abc123_001.tmp` |

### Size Categories and Dimensions

| Size Category | Dimensions | Use Case |
|---------------|------------|----------|
| Thumbnail | 150x150 | Product listings, search results |
| Small | 300x300 | Product cards, mobile view |
| Medium | 600x600 | Product detail mobile, tablet |
| Large | 1200x1200 | Product detail desktop, zoom |
| Original | Variable | Processing source, full quality |

### Content Type Organization

| Folder | Purpose | Access Pattern |
|--------|---------|----------------|
| products/ | E-commerce product images | High frequency read |
| users/ | User-generated content | Medium frequency read |
| documents/ | Business documents | Low frequency read |
| temp/ | Processing workspace | High frequency write/delete |
| marketing/ | Promotional materials | Medium frequency read |

### Date Partitioning Strategy

| Level | Format | Benefit |
|-------|--------|---------|
| Year | YYYY | Long-term organization |
| Month | MM | Monthly analytics and cleanup |
| Day | DD | Daily processing batches |

### Performance Optimization Patterns

| Pattern | Implementation | Benefit |
|---------|----------------|---------|
| Prefix Distribution | Avoid sequential naming | Better S3 performance |
| Hotspot Prevention | Randomize first characters | Distribute load evenly |
| Batch Processing | Group operations by prefix | Efficient bulk operations |

### Expected Outcome
- Scalable folder structure supporting growth
- Clear tenant isolation and data organization
- Efficient access patterns for common operations
- Future-proof structure for new content types

### Verification Checklist
- [ ] Tenant isolation pattern defined and tested
- [ ] Content type organization implemented
- [ ] Size-based structure supports all image variants
- [ ] Date partitioning strategy documented
- [ ] Naming conventions established and documented
- [ ] Performance considerations addressed
- [ ] Folder structure supports backup/recovery needs

---

## Task 05: Create Upload Service Architecture

### Overview
Design and architect the upload service layer that handles file uploads from the frontend to S3, including validation, processing queuing, and multi-tenant security. This service acts as the intermediary between client applications and S3 storage, ensuring proper file handling, security checks, and integration with the image optimization pipeline.

### Dependencies
- Task 04: Design Folder Structure Pattern
- Task 02: Setup Bucket Security Policies
- Backend API framework established
- Celery task queue configured (Phase-03)

### Instructions

1. **Design upload service endpoints**
   - Single file upload endpoint
   - Multiple file upload endpoint
   - Resumable upload support for large files
   - Upload progress tracking endpoint
   - Upload cancellation and cleanup endpoint

2. **Implement file validation layer**
   - File type validation (MIME type checking)
   - File size limits per content type
   - File name sanitization and validation
   - Malware scanning integration
   - Content inspection for appropriate material

3. **Create tenant-aware upload logic**
   - Extract tenant information from request context
   - Generate tenant-specific upload paths
   - Validate user permissions for upload destination
   - Implement quota checking per tenant
   - Track usage statistics per tenant

4. **Design pre-signed URL generation**
   - Generate temporary upload URLs for direct S3 upload
   - Configure appropriate expiration times
   - Include necessary upload conditions
   - Support different upload methods (PUT, POST)
   - Handle URL refresh for long uploads

5. **Implement upload processing workflow**
   - Queue image optimization jobs after upload
   - Generate thumbnail creation tasks
   - Trigger content indexing processes
   - Update database records with upload metadata
   - Handle upload failure scenarios and cleanup

6. **Create upload monitoring and logging**
   - Track upload metrics and performance
   - Log security events and violations
   - Monitor quota usage and alerts
   - Implement upload analytics and reporting
   - Error tracking and notification system

### Upload Service Architecture

```
Upload Service Flow
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Upload API     │───▶│   S3 Storage    │
│   Application   │    │   Service        │    │   Buckets       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Task Queue     │
                       │   (Celery)       │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Image          │
                       │   Processing     │
                       └──────────────────┘
```

### Upload Endpoint Design

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/upload/single` | POST | Single file upload | Required |
| `/api/upload/multiple` | POST | Multiple file upload | Required |
| `/api/upload/presigned` | GET | Generate upload URL | Required |
| `/api/upload/progress/{id}` | GET | Check upload progress | Required |
| `/api/upload/cancel/{id}` | DELETE | Cancel ongoing upload | Required |

### File Validation Rules

| File Type | Max Size | Allowed Extensions | Additional Checks |
|-----------|----------|-------------------|-------------------|
| Product Images | 10 MB | jpg, png, webp | Aspect ratio validation |
| User Avatars | 2 MB | jpg, png | Square aspect preferred |
| Documents | 5 MB | pdf, doc, docx | Content scanning |
| Marketing | 15 MB | jpg, png, svg, gif | Brand compliance |

### Upload Processing Pipeline

| Stage | Process | Queue | Timeout |
|-------|---------|-------|---------|
| 1 | File validation | Immediate | 30s |
| 2 | Virus scanning | High priority | 60s |
| 3 | Tenant storage | Normal | 120s |
| 4 | Metadata extraction | Normal | 60s |
| 5 | Optimization queuing | Low priority | N/A |

### Pre-signed URL Configuration

| Upload Type | Expiration | Max Size | Conditions |
|-------------|------------|----------|------------|
| Single Image | 15 minutes | 10 MB | Content-Type validation |
| Multiple Images | 30 minutes | 50 MB total | Batch size limits |
| Documents | 60 minutes | 25 MB | Document type only |
| Large Files | 4 hours | 100 MB | Multipart upload |

### Security and Validation

| Security Layer | Implementation | Purpose |
|----------------|----------------|---------|
| Authentication | JWT token validation | User identity |
| Authorization | RBAC permissions | Access control |
| File Validation | MIME type checking | Content safety |
| Quota Checking | Per-tenant limits | Resource management |
| Rate Limiting | Request throttling | DoS prevention |

### Expected Outcome
- Robust upload service handling all file types
- Secure tenant-isolated upload processing
- Efficient integration with S3 and optimization pipeline
- Comprehensive monitoring and error handling

### Verification Checklist
- [ ] Upload endpoints implemented and tested
- [ ] File validation working for all supported types
- [ ] Tenant isolation properly enforced
- [ ] Pre-signed URL generation functional
- [ ] Upload processing pipeline integrated
- [ ] Error handling and cleanup implemented
- [ ] Monitoring and logging configured
- [ ] Security measures validated

---

## Task 06: Implement Tenant Data Isolation

### Overview
Implement comprehensive tenant data isolation mechanisms to ensure complete separation of customer data within the shared S3 infrastructure. This includes path-based isolation, access control enforcement, data migration safeguards, and audit trails to maintain security and compliance for the multi-tenant SaaS architecture.

### Dependencies
- Task 05: Create Upload Service Architecture
- Task 02: Setup Bucket Security Policies
- Multi-tenancy foundation (Phase-02) completed
- User authentication system established

### Instructions

1. **Implement path-based tenant isolation**
   - Extract tenant ID from authenticated user context
   - Enforce tenant-specific path prefixes for all operations
   - Validate tenant ownership for all file access requests
   - Prevent path traversal and cross-tenant access attempts
   - Log all access pattern violations

2. **Create tenant-aware access controls**
   - Implement middleware to inject tenant context
   - Validate user-to-tenant relationships
   - Enforce role-based permissions within tenants
   - Block cross-tenant data access at API level
   - Maintain session-based tenant context

3. **Design data segregation policies**
   - Create logical separation within shared buckets
   - Implement automatic tenant tagging for all objects
   - Establish data retention policies per tenant
   - Plan for tenant data export and deletion
   - Configure backup isolation between tenants

4. **Implement access audit system**
   - Log all file access attempts with tenant context
   - Track cross-tenant access violations
   - Monitor unusual access patterns
   - Generate tenant-specific access reports
   - Alert on potential security breaches

5. **Create tenant data migration tools**
   - Build secure tenant data export functionality
   - Implement tenant data deletion processes
   - Create tenant data migration between environments
   - Validate data integrity during migrations
   - Ensure complete data removal when required

6. **Establish compliance monitoring**
   - Implement automated compliance checking
   - Generate regular tenant isolation reports
   - Monitor data residency requirements
   - Track data access for audit purposes
   - Maintain compliance documentation

### Tenant Isolation Architecture

```
Data Isolation Layers
┌─────────────────────────────────────────┐
│           Application Layer             │
│  ┌─────────────────────────────────┐   │
│  │      Tenant Context            │   │
│  │    (from JWT/Session)          │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│           API Layer                     │
│  ┌─────────────────────────────────┐   │
│  │    Path-based Isolation        │   │
│  │  /tenant-uuid/folder/file       │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│           Storage Layer                 │
│  ┌─────────────────────────────────┐   │
│  │      S3 Bucket Structure       │   │
│  │   tenant-a/    tenant-b/       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Tenant Context Flow

| Step | Component | Action | Validation |
|------|-----------|--------|------------|
| 1 | Authentication | Extract user JWT | Token validity |
| 2 | Authorization | Identify tenant membership | User-tenant relationship |
| 3 | Path Generation | Create tenant-specific path | Path format validation |
| 4 | Storage Access | Execute S3 operation | Permission verification |
| 5 | Audit Logging | Record access attempt | Compliance tracking |

### Isolation Enforcement Points

| Layer | Enforcement Mechanism | Security Level |
|-------|----------------------|----------------|
| Application | Tenant context injection | High |
| API | Path prefix validation | High |
| Middleware | Access control checks | High |
| Database | Tenant-scoped queries | Medium |
| Storage | Bucket policies | High |

### Data Migration Security

| Operation | Security Measure | Validation |
|-----------|------------------|------------|
| Export | Encrypted transfer | Checksum verification |
| Import | Tenant validation | Data integrity check |
| Deletion | Multi-step confirmation | Audit trail |
| Migration | Rollback capability | Progress monitoring |

### Compliance Monitoring

| Metric | Frequency | Alert Threshold |
|--------|-----------|-----------------|
| Cross-tenant access attempts | Real-time | Any occurrence |
| Data export operations | Daily | Volume limits |
| Tenant data growth | Weekly | Quota thresholds |
| Access pattern anomalies | Hourly | Statistical deviation |

### Audit Trail Requirements

| Event Type | Data Captured | Retention Period |
|------------|---------------|------------------|
| File Access | User, tenant, timestamp, path | 7 years |
| Data Export | User, tenant, files, destination | 7 years |
| Permission Changes | User, tenant, old/new permissions | 7 years |
| Violation Attempts | Source IP, user, attempted path | 7 years |

### Expected Outcome
- Complete tenant data isolation enforced at all layers
- Comprehensive audit trail for compliance requirements
- Secure data migration and management capabilities
- Real-time monitoring and alerting for security violations

### Verification Checklist
- [ ] Path-based tenant isolation implemented
- [ ] Cross-tenant access blocked and tested
- [ ] Tenant context properly maintained throughout requests
- [ ] Access audit system functional and logging
- [ ] Data migration tools secure and validated
- [ ] Compliance monitoring active and alerting
- [ ] Security violation detection working
- [ ] Data retention policies implemented

---

## Task 07: Setup CDN Distribution

### Overview
Configure Content Delivery Network (CDN) distribution to serve optimized images globally with high performance and low latency. This includes setting up CloudFront or equivalent CDN service, configuring origin access, implementing geographic distribution, and establishing cache invalidation strategies for the image optimization system.

### Dependencies
- Task 06: Implement Tenant Data Isolation
- Task 03: Configure CORS Settings
- S3 buckets with optimized content ready
- Domain and SSL certificate management

### Instructions

1. **Choose CDN provider and setup**
   - Evaluate CloudFront vs alternatives (Cloudflare, etc.)
   - Consider cost, performance, and geographic coverage
   - Set up CDN account and initial configuration
   - Configure billing alerts and monitoring
   - Document provider choice and rationale

2. **Configure CDN origin settings**
   - Set S3 optimized images bucket as primary origin
   - Configure Origin Access Identity (OAI) for security
   - Set up multiple origins for different content types
   - Configure origin failover and redundancy
   - Implement origin request policies

3. **Design geographic distribution strategy**
   - Identify key geographic markets for Sri Lankan SMEs
   - Configure edge locations for optimal coverage
   - Set up regional origin servers if needed
   - Plan for traffic routing and load balancing
   - Consider data residency requirements

4. **Configure custom domain and SSL**
   - Set up custom subdomain (e.g., cdn.lankacommerce.cloud)
   - Configure SSL certificate for HTTPS delivery
   - Implement HTTP to HTTPS redirects
   - Set up domain validation and renewal
   - Configure DNS settings for CDN

5. **Implement cache behavior rules**
   - Configure different cache policies per content type
   - Set appropriate TTL values for various image types
   - Implement query string and header forwarding rules
   - Configure compression and optimization settings
   - Set up viewer protocol policies

6. **Setup cache invalidation system**
   - Implement programmatic cache invalidation
   - Configure invalidation patterns and wildcards
   - Set up batch invalidation for efficiency
   - Monitor invalidation costs and usage
   - Create emergency cache purge procedures

### CDN Architecture

```
CDN Distribution Architecture
                    ┌─────────────────┐
                    │   DNS Request   │
                    │  (cdn.lcc.cloud)│
                    └─────────┬───────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │   Singapore     │  │    Mumbai       │  │   Sydney     ││
│  │   Edge          │  │    Edge         │  │   Edge       ││
│  │   Location      │  │    Location     │  │   Location   ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   S3 Origin     │
                    │  (Optimized     │
                    │   Images)       │
                    └─────────────────┘
```

### CDN Configuration by Content Type

| Content Type | TTL | Compression | Query Strings |
|-------------|-----|-------------|---------------|
| Product Images | 30 days | Yes | Forward size params |
| Thumbnails | 90 days | Yes | Forward all |
| User Avatars | 7 days | Yes | Forward size params |
| Marketing Images | 7 days | Yes | Forward campaign params |
| Static Assets | 365 days | Yes | None |

### Geographic Performance Optimization

| Region | Edge Locations | Expected Latency | Coverage Priority |
|--------|----------------|------------------|-------------------|
| South Asia | Singapore, Mumbai | <50ms | High |
| Southeast Asia | Singapore, Jakarta | <80ms | Medium |
| Middle East | Dubai, Mumbai | <100ms | Medium |
| Global | All edge locations | <200ms | Low |

### Cache Behavior Configuration

| Behavior Pattern | Origin | Cache Policy | Compression |
|-----------------|--------|--------------|-------------|
| `/images/*` | S3 Optimized | 30 days | Gzip, Brotli |
| `/thumbs/*` | S3 Thumbnails | 90 days | Gzip, Brotli |
| `/avatars/*` | S3 Optimized | 7 days | Gzip, Brotli |
| `/docs/*` | S3 Documents | 1 day | Gzip only |

### Security and Access Control

| Security Feature | Configuration | Purpose |
|------------------|---------------|---------|
| Origin Access Identity | Enabled | Prevent direct S3 access |
| Viewer Protocol Policy | Redirect to HTTPS | Force secure connections |
| Geo Restrictions | None initially | Allow global access |
| WAF Integration | Basic rules | DDoS protection |
| Rate Limiting | 1000 req/min per IP | Abuse prevention |

### Monitoring and Analytics

| Metric | Monitoring Frequency | Alert Threshold |
|--------|---------------------|-----------------|
| Cache Hit Ratio | Real-time | <85% |
| Origin Request Count | Hourly | 20% increase |
| Error Rate | Real-time | >1% |
| Bandwidth Usage | Daily | Budget limits |
| Geographic Distribution | Weekly | Trend analysis |

### Expected Outcome
- CDN distribution serving images globally with low latency
- Optimal cache hit ratios reducing origin server load
- Secure content delivery with proper access controls
- Efficient cache invalidation system for content updates

### Verification Checklist
- [ ] CDN distribution configured and active
- [ ] Origin access identity properly secured
- [ ] Custom domain and SSL certificate working
- [ ] Cache behaviors configured per content type
- [ ] Geographic performance optimized for target markets
- [ ] Cache invalidation system functional
- [ ] Monitoring and alerting configured
- [ ] Security measures implemented and tested

---

## Task 08: Configure Cache Rules

### Overview
Configure comprehensive cache rules and policies for the CDN and application layers to optimize performance, reduce costs, and ensure content freshness. This includes setting up intelligent caching strategies, cache invalidation triggers, and monitoring systems to maintain optimal cache performance for the image optimization system.

### Dependencies
- Task 07: Setup CDN Distribution
- Task 05: Create Upload Service Architecture
- Image optimization pipeline understanding

### Instructions

1. **Design cache hierarchy strategy**
   - Configure multi-layer caching (CDN, application, browser)
   - Set up cache keys and invalidation dependencies
   - Plan cache warming strategies for popular content
   - Design cache miss handling and origin fallback
   - Implement cache versioning for content updates

2. **Configure CDN cache policies**
   - Set up content-type specific cache durations
   - Configure query parameter handling for dynamic sizing
   - Implement cache key customization for tenant isolation
   - Set up conditional caching based on headers
   - Configure cache behaviors for different image formats

3. **Implement application-level caching**
   - Configure Redis cache for frequently accessed metadata
   - Set up database query result caching
   - Implement API response caching with appropriate TTLs
   - Configure session-based caching for user preferences
   - Set up cache warming for tenant-specific content

4. **Setup intelligent cache invalidation**
   - Implement event-driven cache invalidation
   - Configure automatic invalidation on content updates
   - Set up batch invalidation for related content
   - Create manual cache purge tools for emergencies
   - Monitor invalidation patterns and costs

5. **Configure browser caching directives**
   - Set appropriate Cache-Control headers
   - Configure ETags for efficient cache validation
   - Implement Last-Modified headers for conditional requests
   - Set up Vary headers for content negotiation
   - Configure service worker caching strategies

6. **Implement cache performance monitoring**
   - Set up cache hit ratio monitoring
   - Track cache invalidation frequency and patterns
   - Monitor cache storage utilization
   - Implement cache performance alerting
   - Generate cache efficiency reports

### Cache Hierarchy Architecture

```
Multi-Layer Cache Architecture
┌─────────────────────────────────────────────┐
│              Browser Cache                  │
│    ┌─────────────────────────────────┐     │
│    │     Local Storage/Memory        │     │
│    │      TTL: 1 hour               │     │
│    └─────────────────────────────────┘     │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│               CDN Edge Cache                │
│    ┌─────────────────────────────────┐     │
│    │     CloudFront Edges           │     │
│    │      TTL: 1-90 days           │     │
│    └─────────────────────────────────┘     │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            Application Cache                │
│    ┌─────────────────────────────────┐     │
│    │      Redis Cache Layer         │     │
│    │       TTL: 1-24 hours         │     │
│    └─────────────────────────────────┘     │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              Origin Storage                 │
│    ┌─────────────────────────────────┐     │
│    │        S3 Buckets              │     │
│    │     (Authoritative)            │     │
│    └─────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### Cache Rules by Content Type

| Content Type | CDN TTL | Browser TTL | Invalidation Trigger |
|-------------|---------|-------------|---------------------|
| Product Images (Original) | 90 days | 1 week | Product update |
| Product Images (Optimized) | 30 days | 1 day | Re-optimization |
| Thumbnails | 90 days | 1 week | Rare updates |
| User Avatars | 7 days | 1 hour | User profile update |
| Marketing Materials | 1 day | 1 hour | Campaign changes |
| System Assets | 1 year | 1 month | System deployment |

### Query Parameter Handling

| Parameter | Cache Behavior | Purpose |
|-----------|----------------|---------|
| `w` (width) | Include in cache key | Size-specific caching |
| `h` (height) | Include in cache key | Size-specific caching |
| `q` (quality) | Include in cache key | Quality-specific caching |
| `f` (format) | Include in cache key | Format-specific caching |
| `t` (timestamp) | Ignore | Cache busting control |
| `tenant` | Include in cache key | Tenant isolation |

### Cache Invalidation Strategies

| Event Type | Invalidation Scope | Method |
|------------|-------------------|--------|
| Product Update | Single product images | Targeted invalidation |
| Bulk Import | Category/tenant images | Wildcard invalidation |
| Template Change | All thumbnails | Pattern-based invalidation |
| System Deployment | Static assets only | Version-based invalidation |
| Emergency | All content | Global purge |

### Application Cache Configuration

| Cache Layer | Technology | Use Case | TTL |
|-------------|------------|----------|-----|
| API Responses | Redis | Frequent queries | 15 minutes |
| Database Queries | Redis | Complex aggregations | 1 hour |
| User Sessions | Redis | Authentication state | 24 hours |
| File Metadata | Redis | Upload information | 4 hours |
| Processing Status | Redis | Job status tracking | 1 hour |

### Browser Caching Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Cache-Control | `public, max-age=3600` | Browser caching duration |
| ETag | `"content-hash"` | Content change detection |
| Last-Modified | `Thu, 31 Jan 2026 10:00:00 GMT` | Conditional requests |
| Vary | `Accept, Accept-Encoding` | Content negotiation |
| Expires | `Thu, 31 Jan 2026 11:00:00 GMT` | Absolute expiration |

### Cache Performance Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| CDN Hit Ratio | >90% | <85% |
| Application Cache Hit Ratio | >80% | <70% |
| Cache Invalidation Cost | <$50/month | >$100/month |
| Average Response Time | <100ms | >200ms |
| Origin Request Ratio | <10% | >20% |

### Cache Warming Strategy

| Content Type | Warming Trigger | Priority |
|-------------|----------------|----------|
| New Products | Product creation | High |
| Popular Items | View count threshold | Medium |
| Seasonal Content | Calendar-based | Low |
| User Uploads | Upload completion | Medium |

### Expected Outcome
- Optimized cache performance across all layers
- Reduced origin server load and improved response times
- Cost-effective cache invalidation strategies
- Comprehensive cache monitoring and alerting

### Verification Checklist
- [ ] CDN cache policies configured per content type
- [ ] Application-level caching implemented
- [ ] Browser caching headers properly set
- [ ] Cache invalidation system functional
- [ ] Cache performance monitoring active
- [ ] Cache warming strategies implemented
- [ ] Multi-layer cache hierarchy working efficiently
- [ ] Cost monitoring and optimization in place

---

## Summary

This document established the complete S3 storage and CDN infrastructure for the LankaCommerce Cloud image optimization system. The implementation provides a robust, secure, and scalable foundation for handling multi-tenant image storage with global content delivery capabilities.

### Completed Tasks
1. ✓ Configured S3 storage buckets with proper security and regional optimization
2. ✓ Implemented comprehensive security policies and IAM roles
3. ✓ Configured CORS settings for secure browser-based access
4. ✓ Designed scalable folder structure with tenant isolation
5. ✓ Created robust upload service architecture with validation
6. ✓ Implemented complete tenant data isolation mechanisms
7. ✓ Set up global CDN distribution for optimal performance
8. ✓ Configured intelligent cache rules across all layers

### Key Achievements
- **Security:** Multi-layered security with tenant isolation and access controls
- **Performance:** Global CDN with optimized caching strategies
- **Scalability:** Flexible architecture supporting future growth
- **Compliance:** Comprehensive audit trails and data governance
- **Reliability:** Redundant systems with failover capabilities

### Next Steps
Proceed to [02_Tasks-09-15_Image-Processing-Pipeline.md](02_Tasks-09-15_Image-Processing-Pipeline.md) to implement the image processing pipeline that will utilize this storage infrastructure for automated image optimization, format conversion, and thumbnail generation.