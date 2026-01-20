# Group C: S3 Production Storage

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Configure AWS S3 storage for production with signed URLs

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Tenant-Isolated-Storage/](../Group-B_Tenant-Isolated-Storage/)
- **→ Next Group:** [../Group-D_Image-Processing-Pipeline/](../Group-D_Image-Processing-Pipeline/)

---

## Group Overview

This group configures AWS S3 as the production file storage backend. It includes setting up AWS credentials, creating tenant-aware S3 storage, and implementing signed URLs for secure private file access.

### Key Outcomes
- boto3 package installed
- AWS credentials configured via environment
- S3 bucket settings configured
- TenantS3Storage class created
- Private and public buckets configured
- Signed URLs for secure access
- Dev/Prod storage switch ready

### Technology Context
- **Package:** boto3
- **Backend:** storages.backends.s3boto3.S3Boto3Storage
- **Region:** ap-south-1 (Mumbai - closest to Sri Lanka)
- **URL Expiry:** 3600 seconds (1 hour) default

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-31-36_boto3-AWS-Setup.md | 31-36 | Install boto3, pin version, create S3 settings, configure access key, secret key, bucket name |
| 02 | 02_Tasks-37-41_S3-Configuration.md | 37-41 | Configure region, custom domain, object parameters, create TenantS3Storage, override S3 path methods |
| 03 | 03_Tasks-42-46_Buckets-SignedURLs.md | 42-46 | Configure private bucket, public bucket, create signed URLs, URL expiry, dev/prod switch |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 31 | Install boto3 | Task 30 | Simple |
| 32 | Pin boto3 Version | Task 31 | Simple |
| 33 | Create S3 Settings | Task 32 | Medium |
| 34 | Configure AWS_ACCESS_KEY_ID | Task 33 | Simple |
| 35 | Configure AWS_SECRET_ACCESS_KEY | Task 34 | Simple |
| 36 | Configure AWS_STORAGE_BUCKET_NAME | Task 35 | Simple |
| 37 | Configure AWS_S3_REGION_NAME | Task 36 | Simple |
| 38 | Configure AWS_S3_CUSTOM_DOMAIN | Task 37 | Medium |
| 39 | Configure AWS_S3_OBJECT_PARAMETERS | Task 38 | Medium |
| 40 | Create TenantS3Storage Class | Task 39 | Complex |
| 41 | Override S3 path Methods | Task 40 | Medium |
| 42 | Configure Private Files Bucket | Task 41 | Medium |
| 43 | Configure Public Files Bucket | Task 42 | Simple |
| 44 | Create S3 Signed URLs | Task 43 | Complex |
| 45 | Configure URL Expiry | Task 44 | Simple |
| 46 | Configure Storage Backend Switch | Task 45 | Medium |

---

## Execution Order

```
01_Tasks-31-36_boto3-AWS-Setup.md
        │
        ▼
02_Tasks-37-41_S3-Configuration.md
        │
        ▼
03_Tasks-42-46_Buckets-SignedURLs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── requirements/
│   └── production.txt        # boto3 added
├── config/
│   └── settings/
│       ├── storage.py        # Updated with S3 settings
│       └── production.py     # S3 backend activated
├── apps/
│   └── core/
│       └── storage/
│           ├── backends.py   # TenantS3Storage added
│           └── s3.py         # S3-specific utilities, signed URLs
└── .env.example              # AWS credentials added
```

---

## Notes for AI Agents

1. **Credentials:** Never commit AWS credentials
2. **Region:** Use ap-south-1 for best Sri Lanka latency
3. **Bucket Policy:** Set proper ACLs for public/private
4. **Signed URLs:** Use for invoices, contracts, private documents
5. **CDN:** Use CloudFront custom domain for production
6. **Cache-Control:** Set max-age=31536000 for static assets
7. **Git Commit:** Commit after completing this group
