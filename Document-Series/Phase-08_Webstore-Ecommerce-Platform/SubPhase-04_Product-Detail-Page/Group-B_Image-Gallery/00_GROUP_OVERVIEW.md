# Group B: Image Gallery

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create product image gallery with zoom, lightbox, thumbnails, and mobile swipe

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Route-Page-Structure](../Group-A_Route-Page-Structure/)
- **→ Next Group:** [Group-C_Product-Information](../Group-C_Product-Information/)

---

## Group Overview

This group creates the product image gallery. Creates main gallery component and main image display. Creates image zoom feature on hover and lightbox modal with navigation and controls. Creates thumbnail strip with individual thumbnails, active state, and navigation. Creates mobile image swipe with dot indicators. Creates variant image switch. Creates image loading and error states. Creates sale badge overlay and out of stock overlay. Verifies all gallery interactions.

### Key Outcomes

- Gallery component
- Main image display
- Image zoom feature (hover)
- Lightbox modal
- Lightbox navigation (prev/next)
- Lightbox controls (close, zoom)
- Thumbnail strip
- Thumbnail item
- Thumbnail active state
- Thumbnail navigation
- Mobile image swipe
- Mobile dot indicators
- Variant image switch
- Image loading state
- Image error state
- Sale badge on gallery
- Out of stock overlay
- Gallery interactions verified

### Technology Context

- **Images:** Next.js Image optimization
- **Zoom:** CSS transform or library
- **Swipe:** Touch events / Swiper
- **Lightbox:** Dialog component

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Gallery-Lightbox-Thumbnails.md` | Create gallery, lightbox, and thumbnails | 17-26 |
| 02 | `02_Tasks-27-34_Mobile-States-Verify.md` | Create mobile swipe, states, and verification | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Gallery Component | Medium | Task 16 |
| 18 | Create Main Image Display | Low | Task 17 |
| 19 | Create Image Zoom Feature | Medium | Task 18 |
| 20 | Create Lightbox Modal | Medium | Task 18 |
| 21 | Create Lightbox Navigation | Low | Task 20 |
| 22 | Create Lightbox Controls | Low | Task 20 |
| 23 | Create Thumbnail Strip | Low | Task 17 |
| 24 | Create Thumbnail Item | Low | Task 23 |
| 25 | Create Thumbnail Active State | Low | Task 24 |
| 26 | Create Thumbnail Navigation | Low | Task 23 |
| 27 | Create Image Swipe Mobile | Medium | Task 18 |
| 28 | Create Image Dots Mobile | Low | Task 27 |
| 29 | Create Variant Image Switch | Medium | Task 17 |
| 30 | Create Image Loading State | Low | Task 18 |
| 31 | Create Image Error State | Low | Task 18 |
| 32 | Create Sale Badge on Gallery | Low | Task 18 |
| 33 | Create Out of Stock Overlay | Low | Task 18 |
| 34 | Verify Gallery Interactions | Low | Task 33 |

---

## Execution Order

```
Task 17: Gallery Component
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          │
Task 18    Task 23    Task 29       │
(Main)    (Thumbs)   (Variant)      │
    │          │          │          │
    ├──────────┤          │          │
    │          │          │          │
    ├────┬────┬┴───┬────┐ │          │
    ▼    ▼    ▼    ▼    ▼ │          │
T-19  T-20  T-27 T-30 T-31│          │
(Zoom)(Light)(Swipe)(Load)(Error)   │
    │    │    │    │    │ │          │
    │    ├────┼────┘    │ │          │
    │    │    │          │ │          │
    │  ┌─┴─┐  ▼          │ │          │
    │  ▼   ▼ T-28       │ │          │
    │T-21 T-22(Dots)    │ │          │
    │(Nav)(Ctrl) │       │ │          │
    │  │   │    │       │ │          │
    │  └───┘    │       │ │          │
    │      │    │       │ │          │
    │      └────┴───────┘ │          │
    │           │         │          │
    │      ┌────┴────┐    │          │
    │      ▼         ▼    │          │
    │   Task 24   Task 26 │          │
    │  (Item)    (Nav)    │          │
    │      │         │    │          │
    │      ▼         │    │          │
    │   Task 25     │    │          │
    │  (Active)     │    │          │
    │      │         │    │          │
    └──────┴─────────┘    │          │
               │          │          │
    ┌──────────┴──────────┘          │
    ▼                                │
Task 32: Sale Badge                  │
    │                                │
    ▼                                │
Task 33: Out of Stock                │
    │                                │
    ▼
Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── product/
│           └── Gallery/
│               ├── Gallery.tsx
│               ├── MainImage.tsx
│               ├── ImageZoom.tsx
│               ├── Lightbox.tsx
│               ├── LightboxNav.tsx
│               ├── LightboxControls.tsx
│               ├── ThumbnailStrip.tsx
│               ├── Thumbnail.tsx
│               ├── ThumbnailNav.tsx
│               ├── MobileSwiper.tsx
│               ├── ImageDots.tsx
│               ├── GalleryBadge.tsx
│               ├── GallerySkeleton.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Gallery Layout (Task 17)
| Desktop | Mobile |
|---------|--------|
| Main + Thumbnails below | Swiper with dots |
| Aspect ratio 1:1 | Full width |
| Click to lightbox | Tap to lightbox |

### Main Image (Task 18)
| Feature | Value |
|---------|-------|
| Size | Full container width |
| Aspect | 1:1 or 3:4 |
| Cursor | zoom-in |
| Click | Open lightbox |

### Image Zoom (Task 19)
| Feature | Description |
|---------|-------------|
| Trigger | Mouse hover |
| Effect | 2x zoom follow cursor |
| Mobile | Pinch to zoom |
| Exit | Mouse leave |

### Lightbox Modal (Task 20)
| Feature | Value |
|---------|-------|
| Background | Black 90% |
| Image | Centered, max size |
| Close | Top-right X |
| Keyboard | Escape to close |

### Lightbox Navigation (Task 21)
| Control | Position | Action |
|---------|----------|--------|
| Previous | Left | Show prev image |
| Next | Right | Show next image |
| Keyboard | ← → arrows | Navigate |
| Swipe | Touch | Navigate |

### Thumbnail Strip (Task 23)
| Feature | Description |
|---------|-------------|
| Layout | Horizontal row |
| Size | 60-80px squares |
| Selected | Border highlight |
| Click | Switch main image |

### Thumbnail Navigation (Task 26)
| Feature | Description |
|---------|-------------|
| Visible | If > 5 thumbnails |
| Arrows | Left/right scroll |
| Scroll | Smooth horizontal |

### Mobile Swiper (Task 27)
| Feature | Description |
|---------|-------------|
| Gesture | Horizontal swipe |
| Animation | Slide transition |
| Loop | Optional |
| Pagination | Dot indicators |

### Variant Image Switch (Task 29)
| Trigger | Action |
|---------|--------|
| Color change | Switch to variant images |
| Size change | May not change image |
| Update | Animate transition |

### Sale Badge (Task 32)
| Feature | Value |
|---------|-------|
| Position | Top-left |
| Text | -20% OFF |
| Color | Red background |
| Visible | If on sale |

### Out of Stock Overlay (Task 33)
| Feature | Value |
|---------|-------|
| Overlay | Semi-transparent |
| Text | "Out of Stock" |
| Style | Diagonal banner |
| Gallery | Still viewable |
