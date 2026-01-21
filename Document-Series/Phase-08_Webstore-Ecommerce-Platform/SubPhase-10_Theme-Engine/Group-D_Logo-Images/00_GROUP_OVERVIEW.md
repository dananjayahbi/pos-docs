# Group D: Logo & Images

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Create logo upload, banner images, and image optimization with cropping

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Typography-Fonts](../Group-C_Typography-Fonts/)
- **→ Next Group:** [Group-E_Homepage-Sections](../Group-E_Homepage-Sections/)

---

## Group Overview

This group creates logo and image management. Creates logo section with upload functionality and preview. Creates logo size control and alt text input. Creates favicon upload and mobile logo option. Creates banner section with hero image upload. Creates hero text overlay and CTA button configuration. Creates image optimization for uploaded files. Creates image cropper for adjusting uploads. Creates delete image functionality. Creates apply logo to header. Verifies image upload flow works correctly.

### Key Outcomes

- Logo section
- Logo upload
- Logo preview
- Logo size control
- Logo alt text
- Favicon upload
- Mobile logo option
- Banner section
- Hero image upload
- Hero text overlay
- Hero CTA button
- Image optimization
- Image cropper
- Delete image
- Apply logo to header
- Image uploads verified

### Technology Context

- **Upload:** File input + preview
- **Storage:** S3 or local
- **Optimize:** Compression
- **Crop:** Client-side cropping

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-60_Logo-Banner.md` | Create logo and banner uploads | 51-60 |
| 02 | `02_Tasks-61-66_Optimize-Apply-Verify.md` | Create optimization and apply | 61-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Logo Section | Low | Task 50 |
| 52 | Create Logo Upload | Medium | Task 51 |
| 53 | Create Logo Preview | Low | Task 52 |
| 54 | Create Logo Size Control | Low | Task 51 |
| 55 | Create Logo Alt Text | Low | Task 51 |
| 56 | Create Favicon Upload | Medium | Task 51 |
| 57 | Create Mobile Logo | Low | Task 51 |
| 58 | Create Banner Section | Low | Task 50 |
| 59 | Create Hero Image Upload | Medium | Task 58 |
| 60 | Create Hero Text Overlay | Medium | Task 59 |
| 61 | Create Hero CTA Button | Low | Task 60 |
| 62 | Create Image Optimization | High | Task 52 |
| 63 | Create Image Cropper | High | Task 52 |
| 64 | Create Delete Image | Low | Task 52 |
| 65 | Create Logo Apply | Low | Task 53 |
| 66 | Verify Image Uploads | Low | Task 65 |

---

## Execution Order

```
Task 51: Logo Section                Task 58: Banner Section
    │                                     │
    ├────────┬────────┬────────┐          ▼
    ▼        ▼        ▼        │     Task 59: Hero Upload
T-52     T-54     T-55        │          │
(Upload) (Size)  (Alt)        │          ▼
    │        │        │        │     Task 60: Text Overlay
    ├────────┤        │        │          │
    ▼        │        │        │          ▼
T-53        │        │        │     Task 61: CTA Button
(Preview)   │        │        │          │
    │        │        │        │          │
    ├────────┴────────┤        ├──────────┘
    │                 │        │
    ├────────┬────────┤        │
    ▼        ▼        │        │
T-56     T-57        │        │
(Favicon)(Mobile)    │        │
    │        │        │        │
    └────────┴────────┴────────┘
              │
    ┌─────────┴─────────┬─────────┐
    ▼                   ▼         ▼
T-62               T-63       T-64
(Optimize)        (Cropper)  (Delete)
    │                   │         │
    └───────────────────┴─────────┘
                   │
                   ▼
             Task 65: Logo Apply
                   │
                   ▼
             Task 66: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── theme/
│           ├── Logo/
│           │   ├── LogoSettings.tsx
│           │   ├── LogoUpload.tsx
│           │   ├── LogoPreview.tsx
│           │   ├── LogoSizeControl.tsx
│           │   ├── FaviconUpload.tsx
│           │   ├── MobileLogo.tsx
│           │   └── index.ts
│           └── Banner/
│               ├── BannerSettings.tsx
│               ├── HeroUpload.tsx
│               ├── HeroTextOverlay.tsx
│               ├── HeroCTAButton.tsx
│               └── index.ts
├── components/
│   └── shared/
│       ├── ImageUpload.tsx
│       ├── ImageCropper.tsx
│       └── ImageOptimizer.tsx
└── lib/
    └── images/
        └── imageUtils.ts
```

---

## Notes for AI Agents

### Logo Section (Task 51)
| Setting | Description |
|---------|-------------|
| Main Logo | Desktop header |
| Favicon | Browser tab icon |
| Mobile | Optional smaller logo |

### Logo Upload (Task 52)
| Feature | Value |
|---------|-------|
| Accept | PNG, JPG, SVG |
| Max size | 2MB |
| Preview | Show after upload |
| Replace | Clear previous |

### Logo Size Control (Task 54)
| Option | Value |
|--------|-------|
| Height | 40-80px range |
| Auto width | Maintain aspect |
| Preview | Real-time update |

### Favicon Upload (Task 56)
| Feature | Value |
|---------|-------|
| Size | 32x32 or 64x64 |
| Format | ICO, PNG |
| Preview | Show in tab |

### Mobile Logo (Task 57)
| Feature | Description |
|---------|-------------|
| Optional | Can differ from main |
| Size | Smaller than desktop |
| Use | Mobile header |

### Banner Section (Task 58)
| Banner | Purpose |
|--------|---------|
| Hero | Homepage main banner |
| Size | Full width, 400-600px height |

### Hero Image Upload (Task 59)
| Feature | Value |
|---------|-------|
| Size | 1920x600px recommended |
| Format | JPG, PNG |
| Compress | Yes |

### Hero Text Overlay (Task 60)
| Field | Description |
|-------|-------------|
| Title | Large heading text |
| Subtitle | Supporting text |
| Position | Left, center, right |
| Color | Text color |

### Hero CTA Button (Task 61)
| Field | Description |
|-------|-------------|
| Text | Button label |
| Link | Destination URL |
| Style | Primary button |

### Image Optimization (Task 62)
| Step | Action |
|------|--------|
| 1 | Resize to max dimensions |
| 2 | Compress quality |
| 3 | Convert format if needed |
| 4 | Generate WebP |

### Image Cropper (Task 63)
| Feature | Value |
|---------|-------|
| Library | react-image-crop |
| Aspect | Configurable |
| Preview | Real-time |
| Apply | Crop and save |

### Delete Image (Task 64)
| Feature | Description |
|---------|-------------|
| Button | X or trash icon |
| Confirm | Optional confirmation |
| Clear | Remove from storage |

### Logo Apply (Task 65)
| Location | Update |
|----------|--------|
| Header | Main logo |
| Favicon | Browser tab |
| Mobile header | Mobile logo |
