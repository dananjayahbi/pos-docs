# Tasks 01-08: SEO Setup & Helpers

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 12 - SEO Implementation  
> **Group:** A - Meta Tags Infrastructure  
> **Tasks:** 01-08  
> **Goal:** Initialize SEO directory, define types, configuration, and helpers.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **← Previous:** None
- **→ Next:** [02_Tasks-09-16_Page-Metadata-Verify.md](./02_Tasks-09-16_Page-Metadata-Verify.md)

---

## 1. Task 01: Create SEO Directory

Initialize the folder structure for managing SEO logic, types, and utilities.

### Steps
1. Navigate to the webstore lib directory.
2. Create a new directory named `seo`.
3. Verify the location is accessible to the app directory.

---

## 2. Task 02: Create SEO Types

Define TypeScript interfaces to ensure strict typing for metadata properties.

### Steps
1. Create a `types.ts` file inside the `seo` directory.
2. Define interface `SEOConfig` for global SEO settings (site name, default title, etc.).
3. Define interface `PageSEO` for page-level overrides.
4. Define interface `OpenGraphImage` for image metadata.
5. Export all interfaces for usage in other files.

---

## 3. Task 03: Create Base Metadata

Establish the default metadata object that Next.js will use as a fallback.

### Steps
1. Create a `base.ts` file in the `seo` directory.
2. Import the `Metadata` type from Next.js types.
3. Import the `SEOConfig` type.
4. Define an exported constant `baseMetadata` conforming to the `Metadata` interface.
5. Set default `title` as the site name.
6. Set default `description` from configuration.
7. Set default `icons` (favicon).
8. Set `metadataBase` to the site URL environment variable to resolve relative URLs.

---

## 4. Task 04: Create Metadata Config

Create a configuration file to centralize site-wide SEO strings.

### Steps
1. Create a `config.ts` file in the `seo` directory.
2. Define a constant object `siteConfig`.
3. Add properties for `name`, `description`, `url`, `ogImage`.
4. Add properties for social links (Twitter, Facebook, Instagram handle).
5. Add configuration for `titleTemplate` (e.g., `%s | Site Name`).
6. Export the configuration object.

---

## 5. Task 05: Create generateMetadata Helper

Develop a utility function to streamline metadata generation for pages.

### Steps
1. Create a `utils.ts` file in the `seo` directory.
2. Import `Metadata` from Next.js and configuration types.
3. Create an exported function `constructMetadata`.
4. It should accept parameters: `title`, `description`, `image`, `icons`, `noIndex`.
5. Return a `Metadata` object.
6. Merge input values with `baseMetadata` defaults.
7. Ensure strict type safety for inputs.

---

## 6. Task 06: Create Title Template

Implement logical title formatting to ensure consistent page titles.

### Steps
1. Inside `utils.ts` or a dedicated helper, verify the title handling.
2. If the input title is a string, format it using the site template ("Page Title | Site Name").
3. If the input title is "absolute", bypass the template and use exactly as provided.
4. Handle cases where title is missing by falling back to the default site name.

---

## 7. Task 07: Create Description Helper

Ensure meta descriptions are optimized and properly length-limited.

### Steps
1. Inside `utils.ts`, extend the `constructMetadata` logic for description.
2. Add logic to truncate the description if it exceeds recommended length (e.g., 160 characters).
3. Ensure the description falls back to the default site description if not provided.
4. Strip any potential HTML tags from the description string if dealing with dynamic content.

---

## 8. Task 08: Create Homepage Metadata

Define the specific metadata for the root page (`/`).

### Steps
1. Open the root `layout.tsx` or `page.tsx` of the webstore.
2. Import the `constructMetadata` helper.
3. Export the `metadata` constant (or `generateMetadata` function).
4. Call `constructMetadata` with homepage-specific values:
    - Title: "Home - Slogan" (or just site name).
    - Description: Main site value proposition.
    - Canonical URL: Root domain.
5. Save and ensure no type errors.

---
