# Group B: Image Processor

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 10 - Advanced Image Optimization  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement image processing with Sharp

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Storage-CDN-Setup](../Group-A_Storage-CDN-Setup/)
- **→ Next Group:** [Group-C_Format-Conversion](../Group-C_Format-Conversion/)

---

## Group Overview

This group implements image processing. Installs Sharp. Creates ImageProcessor Class with Resize Method and Resize Presets. Creates Aspect Ratio, Crop Method, and Smart Crop. Creates Compress Method with Quality Presets. Creates Watermark, Blur Method, Rotate Method, and Flip Method. Creates Metadata Strip. Creates Pipeline for chained operations. Creates Cache Layer and Batch Process. Verifies Processor.

### Key Outcomes

- Install Sharp
- ImageProcessor Class
- Resize Method
- Resize Presets
- Aspect Ratio
- Crop Method
- Smart Crop
- Compress Method
- Quality Presets
- Watermark
- Blur Method
- Rotate Method
- Flip Method
- Metadata Strip
- Pipeline
- Cache Layer
- Batch Process
- Processor verified

### Technology Context

- **Library:** Sharp (Node.js)
- **Alternative:** Pillow (Python)
- **Pipeline:** Chained operations
- **Cache:** Local disk cache

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Resize-Transform.md` | Create resize and transform | 17-26 |
| 02 | `02_Tasks-27-34_Pipeline-Cache.md` | Create pipeline and cache | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Install Sharp | Low | Task 16 |
| 18 | Create ImageProcessor Class | Medium | Task 17 |
| 19 | Create Resize Method | Medium | Task 18 |
| 20 | Create Resize Presets | Low | Task 19 |
| 21 | Create Aspect Ratio | Low | Task 20 |
| 22 | Create Crop Method | Low | Task 21 |
| 23 | Create Smart Crop | Medium | Task 22 |
| 24 | Create Compress Method | Medium | Task 23 |
| 25 | Create Quality Presets | Low | Task 24 |
| 26 | Create Watermark | Medium | Task 25 |
| 27 | Create Blur Method | Low | Task 26 |
| 28 | Create Rotate Method | Low | Task 27 |
| 29 | Create Flip Method | Low | Task 28 |
| 30 | Create Metadata Strip | Low | Task 29 |
| 31 | Create Pipeline | Medium | Task 30 |
| 32 | Create Cache Layer | Medium | Task 31 |
| 33 | Create Batch Process | Medium | Task 32 |
| 34 | Verify Processor | Low | Task 33 |

---

## Execution Order

```
Task 17: Install Sharp
    │
    ▼
Task 18: ImageProcessor Class
    │
    ▼
Task 19: Resize Method
    │
    ▼
Task 20: Resize Presets
    │
    ▼
Task 21: Aspect Ratio
    │
    ▼
Task 22: Crop Method
    │
    ▼
Task 23: Smart Crop
    │
    ▼
Task 24: Compress Method
    │
    ▼
Task 25: Quality Presets
    │
    ▼
Task 26: Watermark
    │
    ▼
Task 27: Blur Method
    │
    ▼
Task 28: Rotate Method
    │
    ▼
Task 29: Flip Method
    │
    ▼
Task 30: Metadata Strip
    │
    ▼
Task 31: Pipeline
    │
    ▼
Task 32: Cache Layer
    │
    ▼
Task 33: Batch Process
    │
    ▼
Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── media/
        └── processor/
            ├── __init__.py
            ├── sharp.py
            ├── resize.py
            ├── transform.py
            └── pipeline.py
```

---

## Notes for AI Agents

### Install Sharp (Task 17)
| Package | sharp |
|---------|-------|
| Version | ^0.33.x |
| Command | npm install sharp |

### ImageProcessor Class (Task 18)
| Class | ImageProcessor |
|-------|----------------|
| Input | Buffer or path |
| Output | Buffer or file |

### Resize Method (Task 19)
| Method | resize(width, height, options) |
|--------|--------------------------------|
| Options | fit, position |

### Resize Presets (Task 20)
| Preset | Width | Height |
|--------|-------|--------|
| thumbnail | 150 | 150 |
| small | 320 | auto |
| medium | 640 | auto |
| large | 1024 | auto |
| full | 1920 | auto |
| og | 1200 | 630 |

### Aspect Ratio (Task 21)
| Option | Behavior |
|--------|----------|
| fit: cover | Crop to fit |
| fit: contain | Pad if needed |
| fit: fill | Stretch |
| fit: inside | Fit within |

### Crop Method (Task 22)
| Method | crop(width, height, position) |
|--------|-------------------------------|
| Position | center, top, bottom, left, right |

### Smart Crop (Task 23)
| Method | smartCrop(width, height) |
|--------|--------------------------|
| Strategy | attention (focus on interest) |

### Compress Method (Task 24)
| Method | compress(quality) |
|--------|-------------------|
| Range | 1-100 |
| Default | 80 |

### Quality Presets (Task 25)
| Preset | Quality | Use |
|--------|---------|-----|
| low | 60 | Thumbnails |
| medium | 80 | Default |
| high | 90 | Detail |
| lossless | 100 | Original |

### Watermark (Task 26)
| Method | watermark(image, position, opacity) |
|--------|-------------------------------------|
| Position | bottom-right |
| Opacity | 0.5 |

### Blur Method (Task 27)
| Method | blur(sigma) |
|--------|-------------|
| Sigma | 1-100 |
| Use | LQIP, backgrounds |

### Rotate Method (Task 28)
| Method | rotate(angle) |
|--------|---------------|
| Angle | 90, 180, 270, auto |

### Flip Method (Task 29)
| Method | flip(direction) |
|--------|-----------------|
| Direction | horizontal, vertical |

### Metadata Strip (Task 30)
| Method | stripMetadata() |
|--------|-----------------|
| Remove | EXIF, ICC, XMP |
| Keep | Orientation |

### Pipeline (Task 31)
| Method | Chain operations |
|--------|------------------|
| Pattern | Fluent API |

### Pipeline Example Flow
| Step | Operation |
|------|-----------|
| 1 | Load image |
| 2 | Resize |
| 3 | Crop |
| 4 | Convert format |
| 5 | Compress |
| 6 | Output |

### Cache Layer (Task 32)
| Storage | Local disk |
|---------|------------|
| Key | Hash of params |
| TTL | 7 days |

### Batch Process (Task 33)
| Method | processBatch(images, operations) |
|--------|----------------------------------|
| Parallel | 4 concurrent |
| Queue | Celery task |
