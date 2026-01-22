# Group C: Format Conversion

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 10 - Advanced Image Optimization  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement format conversion and on-the-fly processing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Image-Processor](../Group-B_Image-Processor/)
- **→ Next Group:** [Group-D_Responsive-Images](../Group-D_Responsive-Images/)

---

## Group Overview

This group implements format conversion. Creates WebP Converter with WebP Quality. Creates AVIF Converter with AVIF Quality. Creates JPEG Optimizer and PNG Optimizer. Creates Format Detector and Accept Header parser. Creates Format Fallback. Creates On-the-fly API with URL Parameters and Parameter Parser. Creates Validation. Creates Background Remove with BG Remove API. Verifies Conversion.

### Key Outcomes

- WebP Converter
- WebP Quality
- AVIF Converter
- AVIF Quality
- JPEG Optimizer
- PNG Optimizer
- Format Detector
- Accept Header
- Format Fallback
- On-the-fly API
- URL Parameters
- Parameter Parser
- Validation
- Background Remove
- BG Remove API
- Conversion verified

### Technology Context

- **WebP:** Modern format, 96% support
- **AVIF:** Next-gen, 85% support
- **API:** On-the-fly transformation
- **BG Remove:** External service

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Format-API.md` | Create format converters and API | 35-44 |
| 02 | `02_Tasks-45-50_Params-BGRemove.md` | Create params and BG remove | 45-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create WebP Converter | Medium | Task 34 |
| 36 | Create WebP Quality | Low | Task 35 |
| 37 | Create AVIF Converter | Medium | Task 36 |
| 38 | Create AVIF Quality | Low | Task 37 |
| 39 | Create JPEG Optimizer | Low | Task 38 |
| 40 | Create PNG Optimizer | Low | Task 39 |
| 41 | Create Format Detector | Low | Task 40 |
| 42 | Create Accept Header | Low | Task 41 |
| 43 | Create Format Fallback | Low | Task 42 |
| 44 | Create On-the-fly API | High | Task 43 |
| 45 | Create URL Parameters | Medium | Task 44 |
| 46 | Create Parameter Parser | Medium | Task 45 |
| 47 | Create Validation | Low | Task 46 |
| 48 | Create Background Remove | High | Task 47 |
| 49 | Create BG Remove API | Medium | Task 48 |
| 50 | Verify Conversion | Low | Task 49 |

---

## Execution Order

```
Task 35: WebP Converter
    │
    ▼
Task 36: WebP Quality
    │
    ▼
Task 37: AVIF Converter
    │
    ▼
Task 38: AVIF Quality
    │
    ▼
Task 39: JPEG Optimizer
    │
    ▼
Task 40: PNG Optimizer
    │
    ▼
Task 41: Format Detector
    │
    ▼
Task 42: Accept Header
    │
    ▼
Task 43: Format Fallback
    │
    ▼
Task 44: On-the-fly API
    │
    ▼
Task 45: URL Parameters
    │
    ▼
Task 46: Parameter Parser
    │
    ▼
Task 47: Validation
    │
    ▼
Task 48: Background Remove
    │
    ▼
Task 49: BG Remove API
    │
    ▼
Task 50: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── media/
        ├── processor/
        │   └── convert.py
        └── api/
            ├── views.py
            └── params.py
```

---

## Notes for AI Agents

### WebP Converter (Task 35)
| Method | toWebP(quality) |
|--------|-----------------|
| Default | 80% |
| Output | .webp |

### WebP Quality (Task 36)
| Quality | Size Reduction |
|---------|----------------|
| 80% | ~70% smaller |
| 90% | ~50% smaller |

### AVIF Converter (Task 37)
| Method | toAVIF(quality) |
|--------|-----------------|
| Default | 75% |
| Output | .avif |

### AVIF Quality (Task 38)
| Quality | Size Reduction |
|---------|----------------|
| 75% | ~80% smaller |
| Speed | Slower encoding |

### JPEG Optimizer (Task 39)
| Method | optimizeJPEG(quality) |
|--------|----------------------|
| Tool | mozjpeg |
| Progressive | Yes |

### PNG Optimizer (Task 40)
| Method | optimizePNG() |
|--------|---------------|
| Tool | pngquant |
| Palette | 256 colors |

### Format Detector (Task 41)
| Method | detectFormat(buffer) |
|--------|----------------------|
| Check | Magic bytes |

### Magic Bytes
| Format | Bytes |
|--------|-------|
| JPEG | FF D8 FF |
| PNG | 89 50 4E 47 |
| WebP | 52 49 46 46 |
| AVIF | 00 00 00 |

### Accept Header (Task 42)
| Header | Accept: image/... |
|--------|-------------------|
| Parse | Content negotiation |

### Accept Priority
| Browser | Preference |
|---------|------------|
| Chrome | AVIF > WebP > JPEG |
| Safari | WebP > JPEG |
| IE11 | JPEG only |

### Format Fallback (Task 43)
| Check | Browser support |
|-------|-----------------|
| Fallback | JPEG |

### On-the-fly API (Task 44)
| Endpoint | /images/{path}/{params} |
|----------|------------------------|
| Method | GET |

### URL Parameters (Task 45)
| Parameter | Example |
|-----------|---------|
| w | w:800 |
| h | h:600 |
| f | f:webp |
| q | q:80 |
| fit | fit:cover |
| bg | bg:remove |

### URL Example
| Full | /images/products/123/main/w:800/h:600/f:webp |
|------|----------------------------------------------|

### Parameter Parser (Task 46)
| Method | parseParams(pathSegments) |
|--------|--------------------------|
| Return | { width, height, format, ... } |

### Validation (Task 47)
| Check | Rule |
|-------|------|
| Width | 1-4096 |
| Height | 1-4096 |
| Quality | 1-100 |
| Format | webp, avif, jpeg, png |

### Background Remove (Task 48)
| Method | removeBackground(image) |
|--------|------------------------|
| AI | Subject detection |

### BG Remove API (Task 49)
| Provider | remove.bg / rembg |
|----------|-------------------|
| Local | rembg (on-premise) |

### API Options
| Provider | Type | Cost |
|----------|------|------|
| remove.bg | Cloud | $0.01/image |
| rembg | Local | Free |
| Cloudinary | Cloud | Credits |
