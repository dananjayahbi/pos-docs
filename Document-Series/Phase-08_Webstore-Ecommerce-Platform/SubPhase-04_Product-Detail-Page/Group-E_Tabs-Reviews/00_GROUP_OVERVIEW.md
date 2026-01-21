# Group E: Tabs & Reviews

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Create product tabs for description, specifications, and customer reviews

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Variant-Cart-Actions](../Group-D_Variant-Cart-Actions/)
- **→ Next Group:** [Group-F_Related-Products-Testing](../Group-F_Related-Products-Testing/)

---

## Group Overview

This group creates product tabs and reviews. Creates product tabs container with tab navigation and panel container. Creates description tab with rich text display. Creates specifications tab with spec table rows. Creates reviews tab with reviews summary showing average rating and breakdown distribution. Creates review list with review cards. Creates review pagination. Creates write review button.

### Key Outcomes

- Product tabs container
- Tab navigation (Description, Specs, Reviews)
- Tab panel container
- Description tab
- Rich text display
- Specifications tab
- Spec table row
- Reviews tab
- Reviews summary
- Rating breakdown (5-star distribution)
- Review list
- Review card
- Review pagination
- Write review button

### Technology Context

- **Tabs:** Radix UI or custom
- **Rich Text:** HTML sanitization
- **Reviews:** TanStack Query
- **Pagination:** Cursor or offset

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-75_Tabs-Description-Specs.md` | Create tabs, description, and specifications | 69-75 |
| 02 | `02_Tasks-76-82_Reviews.md` | Create reviews tab with summary and list | 76-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Product Tabs Container | Medium | Task 68 |
| 70 | Create Tab Navigation | Low | Task 69 |
| 71 | Create Tab Panel Container | Low | Task 69 |
| 72 | Create Description Tab | Low | Task 71 |
| 73 | Create Rich Text Display | Medium | Task 72 |
| 74 | Create Specifications Tab | Low | Task 71 |
| 75 | Create Spec Table Row | Low | Task 74 |
| 76 | Create Reviews Tab | Medium | Task 71 |
| 77 | Create Reviews Summary | Low | Task 76 |
| 78 | Create Rating Breakdown | Low | Task 77 |
| 79 | Create Review List | Low | Task 76 |
| 80 | Create Review Card | Low | Task 79 |
| 81 | Create Review Pagination | Low | Task 79 |
| 82 | Create Write Review Button | Low | Task 76 |

---

## Execution Order

```
Task 69: Product Tabs Container
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 70    Task 71       │
(Nav)      (Panel)       │
    │          │          │
    └──────────┘          │
         │                │
    ┌────┴────┬──────────┐│
    ▼         ▼          ▼│
Task 72   Task 74    Task 76
(Desc)    (Specs)   (Reviews)
    │         │          │
    ▼         ▼          ├──────────┬──────────┐
Task 73   Task 75        ▼          ▼          │
(Rich)    (Row)       Task 77   Task 79    Task 82
    │         │       (Summary) (List)    (Write)
    │         │          │          │          │
    │         │          ▼          ▼          │
    │         │       Task 78   Task 80       │
    │         │      (Breakdown)(Card)        │
    │         │          │          │          │
    │         │          │          ▼          │
    │         │          │     Task 81        │
    │         │          │    (Pagination)    │
    │         │          │          │          │
    └─────────┴──────────┴──────────┴──────────┘
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── product/
│           ├── ProductTabs/
│           │   ├── ProductTabs.tsx
│           │   ├── TabNavigation.tsx
│           │   ├── TabPanel.tsx
│           │   ├── DescriptionTab.tsx
│           │   ├── RichTextDisplay.tsx
│           │   ├── SpecificationsTab.tsx
│           │   ├── SpecTableRow.tsx
│           │   └── index.ts
│           └── Reviews/
│               ├── ReviewsTab.tsx
│               ├── ReviewsSummary.tsx
│               ├── RatingBreakdown.tsx
│               ├── ReviewList.tsx
│               ├── ReviewCard.tsx
│               ├── ReviewPagination.tsx
│               ├── WriteReviewButton.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Tabs Container (Task 69)
| Feature | Description |
|---------|-------------|
| Layout | Full width |
| Border | Top border |
| Sticky | Optional sticky nav |

### Tab Navigation (Task 70)
| Tab | Badge |
|-----|-------|
| Description | - |
| Specifications | - |
| Reviews | (25) count |

### Tab States
| State | Style |
|-------|-------|
| Active | Border bottom, bold |
| Inactive | Normal text |
| Hover | Underline |

### Description Tab (Task 72)
| Content | Description |
|---------|-------------|
| HTML | Full product description |
| Images | Inline images |
| Lists | Bullet/numbered lists |
| Headings | H2, H3 sections |

### Rich Text Display (Task 73)
| Feature | Description |
|---------|-------------|
| Sanitize | DOMPurify or similar |
| Styles | Prose typography |
| Images | Responsive images |
| Links | External open new tab |

### Specifications Tab (Task 74)
| Layout | Description |
|--------|-------------|
| Table | Two-column table |
| Rows | Key-value pairs |
| Style | Alternating bg colors |

### Spec Table Row (Task 75)
| Column | Content |
|--------|---------|
| Label | Spec name (bold) |
| Value | Spec value |
| Width | 30% / 70% |

### Reviews Tab (Task 76)
| Section | Content |
|---------|---------|
| Summary | Average + breakdown |
| Actions | Write review button |
| List | Customer reviews |
| Pagination | Load more |

### Reviews Summary (Task 77)
| Element | Content |
|---------|---------|
| Average | 4.5 out of 5 |
| Stars | 5-star display |
| Total | "Based on 25 reviews" |
| Breakdown | Star distribution |

### Rating Breakdown (Task 78)
| Star | Display |
|------|---------|
| 5 stars | Progress bar + count |
| 4 stars | Progress bar + count |
| 3 stars | Progress bar + count |
| 2 stars | Progress bar + count |
| 1 star | Progress bar + count |

### Review Card (Task 80)
| Element | Content |
|---------|---------|
| Avatar | Reviewer initials |
| Name | Reviewer name |
| Date | Review date |
| Rating | 5-star rating |
| Title | Review title |
| Text | Review content |
| Helpful | Helpful button + count |

### Review Pagination (Task 81)
| Feature | Description |
|---------|-------------|
| Type | Load more button |
| Initial | 5 reviews |
| Load | 5 more per click |
| End | "No more reviews" |

### Write Review Button (Task 82)
| State | Action |
|-------|--------|
| Logged In | Open review modal |
| Guest | Prompt login |
| Purchased | Show "Verified Buyer" |
