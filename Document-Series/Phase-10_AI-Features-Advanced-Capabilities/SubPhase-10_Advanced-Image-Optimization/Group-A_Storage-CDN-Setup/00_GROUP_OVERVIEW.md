# Group A: Storage & CDN Setup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 10 - Advanced Image Optimization  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up S3 storage and CDN for image delivery

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Realtime-Sync-Engine](../../SubPhase-09_Realtime-Sync-Engine/)
- **→ Next Group:** [Group-B_Image-Processor](../Group-B_Image-Processor/)

---

## Group Overview

This group sets up storage and CDN. Creates S3 Bucket Config with Bucket Policy and CORS Config. Creates Folder Structure for originals/processed. Creates Upload Service with Tenant Isolation. Creates CDN Distribution with Cache Rules and Cache Purge API. Creates Custom Domain with SSL Certificate. Creates Image URL Builder with Signed URLs and Expiry Logic. Creates Storage Metrics. Verifies Storage Setup.

### Key Outcomes

- S3 Bucket Config
- Bucket Policy
- CORS Config
- Folder Structure
- Upload Service
- Tenant Isolation
- CDN Distribution
- Cache Rules
- Cache Purge API
- Custom Domain
- SSL Certificate
- Image URL Builder
- Signed URLs
- Expiry Logic
- Storage Metrics
- Storage verified

### Technology Context

- **Storage:** AWS S3 / GCS
- **CDN:** Cloudflare / CloudFront
- **SSL:** Let's Encrypt
- **Domain:** images.domain.com

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_S3-Storage.md` | Create S3 storage setup | 01-08 |
| 02 | `02_Tasks-09-16_CDN-URLs.md` | Create CDN and URL builder | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create S3 Bucket Config | Low | None |
| 02 | Create Bucket Policy | Low | Task 01 |
| 03 | Create CORS Config | Low | Task 02 |
| 04 | Create Folder Structure | Low | Task 03 |
| 05 | Create Upload Service | Medium | Task 04 |
| 06 | Create Tenant Isolation | Medium | Task 05 |
| 07 | Create CDN Distribution | Medium | Task 06 |
| 08 | Create Cache Rules | Low | Task 07 |
| 09 | Create Cache Purge API | Low | Task 08 |
| 10 | Create Custom Domain | Low | Task 09 |
| 11 | Create SSL Certificate | Low | Task 10 |
| 12 | Create Image URL Builder | Medium | Task 11 |
| 13 | Create Signed URLs | Medium | Task 12 |
| 14 | Create Expiry Logic | Low | Task 13 |
| 15 | Create Storage Metrics | Low | Task 14 |
| 16 | Verify Storage Setup | Low | Task 15 |

---

## Execution Order

```
Task 01: S3 Bucket Config
    │
    ▼
Task 02: Bucket Policy
    │
    ▼
Task 03: CORS Config
    │
    ▼
Task 04: Folder Structure
    │
    ▼
Task 05: Upload Service
    │
    ▼
Task 06: Tenant Isolation
    │
    ▼
Task 07: CDN Distribution
    │
    ▼
Task 08: Cache Rules
    │
    ▼
Task 09: Cache Purge API
    │
    ▼
Task 10: Custom Domain
    │
    ▼
Task 11: SSL Certificate
    │
    ▼
Task 12: Image URL Builder
    │
    ▼
Task 13: Signed URLs
    │
    ▼
Task 14: Expiry Logic
    │
    ▼
Task 15: Storage Metrics
    │
    ▼
Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── media/
        ├── config.py
        ├── storage.py
        └── cdn/
            ├── cloudflare.py
            ├── url_builder.py
            └── cache.py
```

---

## Notes for AI Agents

### S3 Bucket Config (Task 01)
| Setting | Value |
|---------|-------|
| Bucket | lcc-media-{env} |
| Region | ap-south-1 |
| Versioning | Enabled |

### Bucket Policy (Task 02)
| Allow | CDN origin |
|-------|------------|
| Deny | Direct public |
| Principal | CloudFront OAI |

### CORS Config (Task 03)
| Origin | *.lcc.lk |
|--------|----------|
| Methods | GET, PUT |
| Headers | Content-Type |

### Folder Structure (Task 04)
| Folder | Purpose |
|--------|---------|
| /originals | Original uploads |
| /processed | Optimized versions |
| /thumbnails | Thumbnail cache |

### Structure Pattern
| Path | Format |
|------|--------|
| Full | /{tenant_id}/{type}/{id}/{file} |
| Example | /tenant_001/products/123/main.jpg |

### Upload Service (Task 05)
| Class | S3UploadService |
|-------|-----------------|
| Method | upload(file, path) |
| Return | S3 key |

### Tenant Isolation (Task 06)
| Pattern | /{tenant_id}/... |
|---------|-----------------|
| Enforce | All uploads |

### CDN Distribution (Task 07)
| Provider | Cloudflare |
|----------|------------|
| Origin | S3 bucket |
| Protocol | HTTPS only |

### Cache Rules (Task 08)
| Content | TTL |
|---------|-----|
| Images | 1 year |
| Processed | 30 days |
| HTML | No cache |

### Cache Purge API (Task 09)
| Method | purge(urls) |
|--------|-------------|
| API | Cloudflare API |

### Custom Domain (Task 10)
| Domain | images.{tenant}.lcc.lk |
|--------|------------------------|
| CNAME | CDN endpoint |

### SSL Certificate (Task 11)
| Provider | Cloudflare |
|----------|------------|
| Type | Universal |
| Auto | Renew |

### Image URL Builder (Task 12)
| Method | buildUrl(key, options) |
|--------|------------------------|
| Return | CDN URL |

### URL Format
| Pattern | https://images.lcc.lk/{path} |
|---------|------------------------------|
| Example | https://images.lcc.lk/t001/products/123/main.webp |

### Signed URLs (Task 13)
| Purpose | Secure private images |
|---------|----------------------|
| Signature | HMAC-SHA256 |

### Expiry Logic (Task 14)
| Default | 1 hour |
|---------|--------|
| Max | 24 hours |
| Format | Unix timestamp |

### Storage Metrics (Task 15)
| Metric | Description |
|--------|-------------|
| total_size | Total bytes |
| file_count | Total files |
| by_tenant | Per-tenant usage |
