# Group D: Responsive Images

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 10 - Advanced Image Optimization  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement responsive image generation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Format-Conversion](../Group-C_Format-Conversion/)
- **→ Next Group:** [Group-E_Frontend-Integration](../Group-E_Frontend-Integration/)

---

## Group Overview

This group implements responsive images. Creates Srcset Generator with Size Breakpoints and Sizes Attribute. Creates Picture Element and Art Direction. Creates DPR Support. Creates Placeholder with Blur Hash and Dominant Color. Creates Pre-generation with Variant Queue and Variant Storage. Creates Variant Cleanup. Creates Image API and Product Images. Verifies Responsive.

### Key Outcomes

- Srcset Generator
- Size Breakpoints
- Sizes Attribute
- Picture Element
- Art Direction
- DPR Support
- Placeholder
- Blur Hash
- Dominant Color
- Pre-generation
- Variant Queue
- Variant Storage
- Variant Cleanup
- Image API
- Product Images
- Responsive verified

### Technology Context

- **Srcset:** Multiple sizes
- **Picture:** Format selection
- **BlurHash:** Compact placeholder
- **LQIP:** Low-quality preview

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-60_Srcset-Placeholder.md` | Create srcset and placeholder | 51-60 |
| 02 | `02_Tasks-61-66_Variants-API.md` | Create variants and API | 61-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Srcset Generator | Medium | Task 50 |
| 52 | Create Size Breakpoints | Low | Task 51 |
| 53 | Create Sizes Attribute | Low | Task 52 |
| 54 | Create Picture Element | Medium | Task 53 |
| 55 | Create Art Direction | Medium | Task 54 |
| 56 | Create DPR Support | Low | Task 55 |
| 57 | Create Placeholder | Medium | Task 56 |
| 58 | Create Blur Hash | Medium | Task 57 |
| 59 | Create Dominant Color | Low | Task 58 |
| 60 | Create Pre-generation | High | Task 59 |
| 61 | Create Variant Queue | Medium | Task 60 |
| 62 | Create Variant Storage | Low | Task 61 |
| 63 | Create Variant Cleanup | Low | Task 62 |
| 64 | Create Image API | Medium | Task 63 |
| 65 | Create Product Images | Medium | Task 64 |
| 66 | Verify Responsive | Low | Task 65 |

---

## Execution Order

```
Task 51: Srcset Generator
    │
    ▼
Task 52: Size Breakpoints
    │
    ▼
Task 53: Sizes Attribute
    │
    ▼
Task 54: Picture Element
    │
    ▼
Task 55: Art Direction
    │
    ▼
Task 56: DPR Support
    │
    ▼
Task 57: Placeholder
    │
    ▼
Task 58: Blur Hash
    │
    ▼
Task 59: Dominant Color
    │
    ▼
Task 60: Pre-generation
    │
    ▼
Task 61: Variant Queue
    │
    ▼
Task 62: Variant Storage
    │
    ▼
Task 63: Variant Cleanup
    │
    ▼
Task 64: Image API
    │
    ▼
Task 65: Product Images
    │
    ▼
Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── media/
        └── responsive/
            ├── __init__.py
            ├── srcset.py
            ├── placeholder.py
            └── variants.py
```

---

## Notes for AI Agents

### Srcset Generator (Task 51)
| Method | generateSrcset(image, breakpoints) |
|--------|-----------------------------------|
| Return | srcset string |

### Srcset Output
| Format | url 320w, url 640w, url 1024w |
|--------|-------------------------------|

### Size Breakpoints (Task 52)
| Breakpoint | Width |
|------------|-------|
| xs | 320 |
| sm | 640 |
| md | 1024 |
| lg | 1920 |
| xl | 2560 |

### Sizes Attribute (Task 53)
| Attribute | sizes="..." |
|-----------|-------------|
| Pattern | (min-width: X) Y |

### Sizes Example
| Value | (max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw |
|-------|----------------------------------------------------------|

### Picture Element (Task 54)
| Element | <picture> |
|---------|-----------|
| Sources | Format-specific |

### Picture Structure
| Order | Format |
|-------|--------|
| 1 | AVIF |
| 2 | WebP |
| 3 | JPEG (fallback) |

### Art Direction (Task 55)
| Purpose | Different crops per breakpoint |
|---------|-------------------------------|
| Mobile | Square crop |
| Desktop | Wide crop |

### DPR Support (Task 56)
| DPR | Suffix |
|-----|--------|
| 1x | base |
| 2x | @2x |
| 3x | @3x |

### Placeholder (Task 57)
| Type | LQIP |
|------|------|
| Size | ~1KB |
| Blur | 20px |

### Blur Hash (Task 58)
| Library | blurhash |
|---------|----------|
| Size | 20-30 chars |
| Decode | On client |

### BlurHash Generation
| Method | encodeBlurHash(image) |
|--------|----------------------|
| Components | 4x3 |
| Return | String |

### Dominant Color (Task 59)
| Method | extractColor(image) |
|--------|---------------------|
| Return | Hex color |
| Use | Placeholder BG |

### Pre-generation (Task 60)
| Trigger | On upload |
|---------|-----------|
| Generate | All variants |

### Variant Generation
| Variant | Generate |
|---------|----------|
| Thumbnails | 150x150 |
| Small | 320w |
| Medium | 640w |
| Large | 1024w |
| BlurHash | String |
| Color | Hex |

### Variant Queue (Task 61)
| Queue | image_variants |
|-------|----------------|
| Worker | Celery |
| Async | Yes |

### Variant Storage (Task 62)
| Location | /processed/{tenant}/{id}/ |
|----------|--------------------------|
| Naming | {id}_{width}.{format} |

### Variant Cleanup (Task 63)
| Trigger | Product delete |
|---------|----------------|
| Action | Delete all variants |

### Image API (Task 64)
| Endpoint | GET /api/images/{id} |
|----------|---------------------|
| Return | Image data with srcset |

### API Response
| Field | Description |
|-------|-------------|
| id | Image ID |
| original | Original URL |
| srcset | Srcset object |
| blurhash | BlurHash string |
| dominant_color | Hex color |
| dimensions | Width x height |

### Product Images (Task 65)
| Endpoint | GET /api/products/{id}/images |
|----------|------------------------------|
| Return | All product images with srcset |
