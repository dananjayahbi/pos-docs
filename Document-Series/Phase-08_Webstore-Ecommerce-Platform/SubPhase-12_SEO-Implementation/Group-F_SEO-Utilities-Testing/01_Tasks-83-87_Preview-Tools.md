# Tasks 83-87: SEO Preview Tools

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** F - SEO Utilities & Testing  
> **Tasks:** 83-87  
> **Goal:** Build internal tools to visualize and optimize SEO content before publishing.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** None
- **→ Next:** [02_Tasks-88-92_Testing.md](./02_Tasks-88-92_Testing.md)

---

## 1. Task 83: Create SEO Preview Component

Develop a UI sidebar or modal for Content Editors (CMS/Admin) to edit SEO fields.

### Steps
1. In the Admin dashboard or shared components library.
2. Create `SeoEditor`.
3. Inputs: `meta_title` (with fallback to page title), `meta_description`.
4. State: Live update of the inputs.
5. Props: `defaultTitle`, `defaultDescription`, `image`.

---

## 2. Task 84: Create Title Length Check

Add visual feedback for title constraints.

### Steps
1. In `SeoEditor`, calculate `meta_title` length.
2. Visual Indicator:
   - Green: < 60 chars.
   - Yellow: 60-70 chars.
   - Red: > 70 chars (likely truncated in SERPs).
3. Display character count: "55/60".

---

## 3. Task 85: Create Description Length

Add visual feedback for meta description constraints.

### Steps
1. Calculate `meta_description` length.
2. Logic:
   - Too short: < 50 chars (Yellow).
   - Optimal: 50-160 chars (Green).
   - Too long: > 160 chars (Red/Truncated).
3. Display character count: "145/160".

---

## 4. Task 86: Create Google Preview

Simulate the visual appearance of the result in Google Search.

### Steps
1. Create a `SerpPreview` component inside the editor.
2. Style a container to look like a Google result:
   - Permalink: Gray `site.com > path`.
   - Title: Blue, 18px.
   - Description: Dark gray, 14px.
3. Truncate the rendered text via CSS (`text-ellipsis`) or JS logic to mimic real SERP behavior.
4. Update in real-time as user types in the inputs.

---

## 5. Task 87: Create Social Preview

Simulate Facebook/Twitter shared cards.

### Steps
1. Create `SocialPreview` component.
2. **Facebook Style:**
   - Large image (1200x630 aspect ratio container).
   - Title block below image.
   - Domain name in uppercase gray.
3. **Twitter Style:**
   - Similar large card or Summary card.
4. Allow users to upload a specific OG Image if different from the main featured image.
5. This helps editors ensure no faces are cropped awkwardly and text is legible.

---
