# Tasks 01-10: Image Config and Component

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** A - Image Optimization  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-11-18_Sizes-CDN-Verify.md](02_Tasks-11-18_Sizes-CDN-Verify.md)

---

## Document Overview

This document covers the foundational image optimization configuration and core component creation for the webstore platform. It establishes the Next.js image configuration with allowed domains, modern formats (WebP/AVIF), and device breakpoints. It creates the OptimizedImage component with lazy loading, priority loading for above-fold images, blur placeholders, loading skeletons, and error fallback handling.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Image Config | Medium | 30 min |
| 02 | Create Image Domains | Low | 15 min |
| 03 | Create Image Formats | Low | 20 min |
| 04 | Create Device Sizes | Low | 20 min |
| 05 | Create OptimizedImage Component | Medium | 45 min |
| 06 | Create Image Lazy Loading | Low | 20 min |
| 07 | Create Image Priority | Low | 20 min |
| 08 | Create Image Blur Placeholder | Medium | 35 min |
| 09 | Create Image Skeleton | Low | 25 min |
| 10 | Create Image Error Fallback | Low | 25 min |

---

## Task 01: Create Image Config

### Overview
Configure the Next.js image optimization settings in next.config.js to enable modern image formats, define device sizes, and set quality parameters. This configuration is the foundation for all image optimization features, enabling automatic format conversion, responsive sizing, and optimized delivery.

### Dependencies
- SubPhase-12 (Code Splitting & Lazy Loading) must be complete
- Next.js project is initialized
- Frontend structure is established

### Instructions

1. **Locate next.config.js file**
   - Navigate to `frontend/` root directory
   - Open existing `next.config.js` configuration file
   - Create backup before modifications

2. **Add images configuration section**
   - Locate or create the `images` property in module.exports
   - This section controls all Next.js Image component behavior
   - Ensure proper JavaScript object syntax

3. **Configure image formats**
   - Add `formats` array to specify supported formats
   - Include modern formats: WebP and AVIF
   - Order matters: Next.js tries formats in array order

4. **Set quality parameters**
   - Define `quality` property (default: 80)
   - Higher quality = larger files, better visuals
   - Consider 75-85 range for optimal balance

5. **Configure device sizes array**
   - Define breakpoints matching design system
   - Used for responsive image generation
   - Will be detailed in Task 04

6. **Configure image sizes array**
   - Define specific sizes for srcset generation
   - Covers common image dimensions across site
   - Enables precise responsive image delivery

7. **Set optimization parameters**
   - Configure `minimumCacheTTL` (e.g., 60 seconds)
   - Set `dangerouslyAllowSVG` if SVG support needed
   - Configure `contentSecurityPolicy` for SVG safety

8. **Document configuration choices**
   - Add inline comments explaining each setting
   - Note performance implications
   - Reference design system decisions

### Image Config Structure

```
next.config.js
├── images
│   ├── formats: ['webp', 'avif']
│   ├── quality: 80
│   ├── deviceSizes: [...]
│   ├── imageSizes: [...]
│   ├── domains: [...]
│   ├── minimumCacheTTL: 60
│   └── contentSecurityPolicy: "..."
```

### Image Config Purpose

| Setting | Purpose | Impact |
|---------|---------|--------|
| formats | Enable modern formats | Smaller file sizes |
| quality | Balance size/visual | Performance vs quality |
| deviceSizes | Responsive breakpoints | Appropriate image size |
| imageSizes | Fixed sizes | Precise size control |
| domains | External image sources | CDN and API images |
| minimumCacheTTL | Cache duration | Reduced bandwidth |

### Format Priority

| Priority | Format | Browser Support | File Size |
|----------|--------|-----------------|-----------|
| 1 | AVIF | Modern browsers | Smallest |
| 2 | WebP | Most browsers | Small |
| 3 | Original | All browsers | Baseline |

### Quality Guidelines

| Use Case | Quality | Rationale |
|----------|---------|-----------|
| Hero images | 85-90 | High visual impact |
| Product images | 80-85 | Balance quality/size |
| Thumbnails | 75-80 | Sufficient detail |
| Background images | 70-75 | Less noticeable |

### Configuration Template

```
Image Configuration Structure:
┌─────────────────────────────────────┐
│  next.config.js                     │
│  ├── images                         │
│  │   ├── formats                    │
│  │   ├── quality                    │
│  │   ├── deviceSizes                │
│  │   ├── imageSizes                 │
│  │   ├── domains                    │
│  │   └── minimumCacheTTL            │
└─────────────────────────────────────┘
```

### Expected Outcome
- next.config.js updated with images section
- Modern formats enabled (WebP, AVIF)
- Quality parameters configured
- Foundation for responsive images established
- Configuration documented with comments

### Verification Checklist
- [ ] next.config.js contains images configuration
- [ ] formats array includes WebP and AVIF
- [ ] quality parameter set appropriately
- [ ] Configuration syntax is valid JavaScript
- [ ] File saved without syntax errors
- [ ] Comments explain configuration choices

---

## Task 02: Create Image Domains

### Overview
Configure allowed external domains for Next.js image optimization. This whitelist determines which external image sources can be optimized through the Next.js Image component, including CDN services, API uploads, and third-party image providers.

### Dependencies
- Task 01: Create Image Config

### Instructions

1. **Identify required external domains**
   - List CDN domain (e.g., cdn.lankacommerce.cloud)
   - Include API upload domain (e.g., api.lankacommerce.cloud)
   - Add stock image providers (e.g., images.unsplash.com)
   - Consider staging/development domains

2. **Add domains array to config**
   - Locate images section in next.config.js
   - Add `domains` property as array of strings
   - Use domain names only (no protocols or paths)

3. **Configure production CDN domain**
   - Add primary CDN domain for optimized images
   - Ensure domain matches actual CDN configuration
   - Consider using environment variables for flexibility

4. **Add API server domain**
   - Include backend API domain for user uploads
   - Covers product images, avatars, attachments
   - Must match Django backend domain

5. **Add development domains**
   - Include localhost for local development
   - Add staging server domains
   - Consider using remotePatterns for more control

6. **Consider remotePatterns alternative**
   - More flexible than domains array
   - Supports protocol and pathname patterns
   - Useful for complex scenarios with subdomains

7. **Add documentation comments**
   - Document purpose of each domain
   - Note environment considerations
   - Explain security implications

8. **Implement environment-based configuration**
   - Use process.env for environment-specific domains
   - Different domains for dev, staging, production
   - Ensure proper configuration in all environments

### Domain Categories

| Category | Example Domain | Purpose |
|----------|----------------|---------|
| CDN | cdn.lankacommerce.cloud | Optimized image delivery |
| API | api.lankacommerce.cloud | User uploads |
| Stock Images | images.unsplash.com | Placeholder/stock images |
| Development | localhost | Local development |

### Domains vs RemotePatterns

| Feature | domains | remotePatterns |
|---------|---------|----------------|
| Simplicity | Simple string array | Object configuration |
| Protocol Control | No | Yes (http/https) |
| Pathname Matching | No | Yes (wildcards) |
| Port Specification | No | Yes |
| Flexibility | Limited | High |

### RemotePatterns Structure

```
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.lankacommerce.cloud',
    pathname: '/images/**',
  }
]
```

### Domain Configuration Flow

```
External Image Request
         │
         ▼
    Is domain in
    allowed list?
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ▼         ▼
Optimize   Reject
  Serve    Request
```

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| Unauthorized domains | Whitelist only trusted sources |
| Open proxy risk | Restrict to specific domains |
| Subdomain abuse | Use specific hostnames |
| Development leaks | Environment-specific config |

### Environment Variables Example

| Environment | CDN Domain |
|-------------|------------|
| Development | localhost:3000 |
| Staging | cdn-staging.lankacommerce.cloud |
| Production | cdn.lankacommerce.cloud |

### Expected Outcome
- Domains array configured in next.config.js
- CDN, API, and third-party domains whitelisted
- Environment-specific domains supported
- Security considerations addressed
- Configuration documented clearly

### Verification Checklist
- [ ] domains array added to images config
- [ ] CDN domain included
- [ ] API domain included
- [ ] Stock image providers added if needed
- [ ] Development domains considered
- [ ] Environment variables used appropriately
- [ ] Configuration tested with external images
- [ ] Security implications documented

---

## Task 03: Create Image Formats

### Overview
Configure modern image format support (WebP and AVIF) in the Next.js image configuration. These formats provide superior compression compared to traditional JPEG/PNG, reducing file sizes by 30-50% while maintaining visual quality, significantly improving page load performance.

### Dependencies
- Task 01: Create Image Config

### Instructions

1. **Understand format benefits**
   - AVIF: Best compression, newest format
   - WebP: Good compression, wider browser support
   - Original: Fallback for older browsers
   - Next.js serves best supported format automatically

2. **Configure formats array**
   - Locate images section in next.config.js
   - Add `formats` property as array
   - Order determines preference (AVIF first, then WebP)

3. **Set format priority**
   - Place 'avif' first in array for best compression
   - Place 'webp' second as widely-supported fallback
   - Original format (JPEG/PNG) served automatically if neither supported

4. **Understand browser support**
   - AVIF: Chrome 85+, Firefox 93+, Edge 93+
   - WebP: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
   - Next.js handles content negotiation automatically

5. **Consider format-specific optimizations**
   - AVIF excels with complex images (photos)
   - WebP good for all image types
   - PNG fallback maintains transparency

6. **Test format conversion**
   - Verify images convert correctly
   - Check visual quality after conversion
   - Compare file sizes across formats

7. **Document format strategy**
   - Add comments explaining format choices
   - Note browser support considerations
   - Document expected file size savings

### Format Comparison

| Format | Compression | Browser Support | Use Case |
|--------|-------------|-----------------|----------|
| AVIF | Excellent (50-60% smaller) | Modern browsers | All images (preferred) |
| WebP | Very Good (30-40% smaller) | Most browsers | All images (fallback) |
| JPEG | Baseline | All browsers | Photos (final fallback) |
| PNG | Baseline | All browsers | Transparency (final fallback) |

### Format Selection Flow

```
Browser Request
      │
      ▼
Supports AVIF?
      │
  ┌───┴───┐
 Yes     No
  │       │
  ▼       ▼
Serve   Supports
AVIF    WebP?
        │
    ┌───┴───┐
   Yes     No
    │       │
    ▼       ▼
  Serve   Serve
  WebP   Original
```

### File Size Comparison Example

| Format | Size | Reduction |
|--------|------|-----------|
| Original JPEG | 500 KB | Baseline |
| WebP | 350 KB | 30% smaller |
| AVIF | 250 KB | 50% smaller |

### Browser Support Matrix

| Browser | AVIF | WebP | Fallback |
|---------|------|------|----------|
| Chrome 85+ | ✓ | ✓ | ✓ |
| Firefox 93+ | ✓ | ✓ | ✓ |
| Safari 16+ | ✓ | ✓ | ✓ |
| Edge 93+ | ✓ | ✓ | ✓ |
| Safari 14-15 | ✗ | ✓ | ✓ |
| Older browsers | ✗ | ✗ | ✓ |

### Performance Impact

| Metric | Improvement |
|--------|-------------|
| File Size | 30-50% reduction |
| Load Time | 25-40% faster |
| Bandwidth | 30-50% savings |
| User Experience | Faster page loads |

### Format Configuration

```
Image Format Priority:
┌─────────────────────────────────┐
│  formats: ['avif', 'webp']      │
│                                 │
│  1. Try AVIF (best compression) │
│  2. Try WebP (good compression) │
│  3. Serve Original (fallback)   │
└─────────────────────────────────┘
```

### Expected Outcome
- formats array configured with AVIF and WebP
- Automatic format conversion enabled
- 30-50% file size reduction achieved
- All browsers supported with appropriate fallbacks
- Performance significantly improved

### Verification Checklist
- [ ] formats array added to images config
- [ ] AVIF listed first in formats array
- [ ] WebP listed second in formats array
- [ ] Test images convert to modern formats
- [ ] Browser fallback works for older browsers
- [ ] File sizes significantly reduced
- [ ] Visual quality maintained after conversion
- [ ] Configuration documented with comments

---

## Task 04: Create Device Sizes

### Overview
Configure device size breakpoints in the Next.js image configuration to generate appropriately-sized images for different screen sizes. These breakpoints ensure that mobile devices receive smaller images while desktop displays get higher-resolution versions, optimizing bandwidth usage and load times.

### Dependencies
- Task 01: Create Image Config

### Instructions

1. **Define design system breakpoints**
   - Review frontend design system breakpoints
   - Align with Tailwind CSS default breakpoints
   - Ensure consistency across application

2. **Configure deviceSizes array**
   - Locate images section in next.config.js
   - Add `deviceSizes` property as array of numbers
   - Values represent viewport widths in pixels

3. **Set mobile breakpoint**
   - Add 640px for mobile devices
   - Covers phones in portrait orientation
   - Smallest size in array

4. **Set tablet breakpoint**
   - Add 768px for tablet devices
   - Covers tablets in portrait orientation
   - Medium size in array

5. **Set desktop breakpoints**
   - Add 1024px for small desktop/laptop screens
   - Add 1280px for standard desktop screens
   - Add 1536px for large desktop screens

6. **Configure imageSizes array**
   - Separate from deviceSizes for fixed-size images
   - Add smaller sizes: 16, 32, 48, 64, 96, 128, 256, 384
   - Used for icons, avatars, thumbnails

7. **Understand size selection logic**
   - Next.js generates images at specified sizes
   - Selects closest size >= required dimension
   - Uses srcset for responsive image delivery

8. **Document breakpoint choices**
   - Add comments explaining each breakpoint
   - Reference design system alignment
   - Note device coverage reasoning

### Breakpoint Configuration

| Breakpoint | Width | Device Type | Coverage |
|------------|-------|-------------|----------|
| sm | 640px | Mobile | Phones portrait |
| md | 768px | Tablet | Tablets portrait |
| lg | 1024px | Small Desktop | Laptops |
| xl | 1280px | Desktop | Standard monitors |
| 2xl | 1536px | Large Desktop | Large monitors |

### deviceSizes vs imageSizes

| Array | Purpose | Typical Values | Used For |
|-------|---------|----------------|----------|
| deviceSizes | Viewport widths | 640, 768, 1024, 1280, 1536 | Full-width images |
| imageSizes | Fixed dimensions | 16, 32, 64, 96, 128, 256, 384 | Icons, thumbnails |

### Size Selection Logic

```
Image Request (width: 700px)
         │
         ▼
    Find smallest
    deviceSize >= 700px
         │
         ▼
    Select 768px
         │
         ▼
    Generate & Serve
    768px image
```

### Responsive Image Delivery

```
Mobile (640px viewport)
├── Loads 640px image
├── Saves ~70% bandwidth
└── Faster load time

Desktop (1920px viewport)
├── Loads 1536px image
├── Appropriate quality
└── Full resolution
```

### Breakpoint Coverage

| Device Category | Screen Width | Served Size |
|-----------------|--------------|-------------|
| Mobile Portrait | 320-639px | 640px |
| Mobile Landscape / Tablet Portrait | 640-767px | 768px |
| Tablet Landscape / Small Laptop | 768-1023px | 1024px |
| Desktop | 1024-1279px | 1280px |
| Large Desktop | 1280-1535px | 1536px |
| Extra Large | 1536px+ | 1536px |

### Image Size Selection Matrix

| Image Context | Size Source | Example Value |
|---------------|-------------|---------------|
| Hero banner | deviceSizes | 1536px |
| Product grid item | imageSizes | 384px |
| Product thumbnail | imageSizes | 128px |
| User avatar | imageSizes | 64px |
| Icon | imageSizes | 32px |

### Expected Outcome
- deviceSizes array configured with 5 breakpoints
- imageSizes array configured with common fixed sizes
- Responsive image delivery optimized
- Bandwidth savings for mobile users
- Consistent with design system breakpoints

### Verification Checklist
- [ ] deviceSizes array added to images config
- [ ] Five breakpoints configured (640, 768, 1024, 1280, 1536)
- [ ] imageSizes array added for fixed sizes
- [ ] Breakpoints align with Tailwind CSS
- [ ] Configuration documented with comments
- [ ] Test responsive image delivery on different devices
- [ ] Verify correct image sizes served
- [ ] Confirm bandwidth savings on mobile

---

## Task 05: Create OptimizedImage Component

### Overview
Create a reusable OptimizedImage component that wraps the Next.js Image component with additional features for lazy loading, priority loading, blur placeholders, loading skeletons, and error handling. This component serves as the standard image component throughout the webstore, ensuring consistent image optimization and user experience.

### Dependencies
- Task 01: Create Image Config
- Task 02: Create Image Domains
- Task 03: Create Image Formats
- Task 04: Create Device Sizes

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/common/` directory
   - Create new directory named `OptimizedImage`
   - This will house the component and related files

2. **Create main component file**
   - Create `OptimizedImage.tsx` in the new directory
   - Set up TypeScript React functional component structure
   - Import Next.js Image component

3. **Define component props interface**
   - Extend Next.js ImageProps interface
   - Add custom props: showSkeleton, fallbackSrc, onLoadComplete
   - Include all standard Image component props
   - Make priority, sizes, and placeholder props optional

4. **Implement component state**
   - Add loading state (useState)
   - Add error state (useState)
   - Track image load completion
   - Manage skeleton display timing

5. **Create image loading handler**
   - Implement onLoadComplete callback
   - Update loading state when image loads
   - Hide skeleton on successful load
   - Trigger custom onLoadComplete prop if provided

6. **Create error handler**
   - Implement onError callback
   - Update error state on load failure
   - Display fallback image or component
   - Log error for debugging (development only)

7. **Implement conditional rendering logic**
   - Show skeleton during loading (if enabled)
   - Show error fallback on error
   - Show actual image when loaded successfully
   - Handle all state transitions smoothly

8. **Configure default props**
   - Set loading="lazy" as default
   - Set quality to 80 as default
   - Set sizes based on common use cases
   - Enable skeleton by default

9. **Add image optimization features**
   - Configure blur placeholder support (Task 08)
   - Implement priority loading option (Task 07)
   - Add lazy loading by default (Task 06)
   - Support responsive sizes

10. **Create component exports**
    - Export OptimizedImage as default
    - Export props interface for type safety
    - Create index.ts barrel file
    - Document component usage

### Component Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| src | string | Yes | - | Image source URL |
| alt | string | Yes | - | Alternative text |
| width | number | Yes* | - | Image width (*required if fill=false) |
| height | number | Yes* | - | Image height (*required if fill=false) |
| fill | boolean | No | false | Fill parent container |
| priority | boolean | No | false | Load immediately (above fold) |
| quality | number | No | 80 | Image quality (1-100) |
| sizes | string | No | Auto | Responsive sizes attribute |
| placeholder | string | No | "empty" | Placeholder type (blur/empty) |
| blurDataURL | string | No | undefined | Base64 blur placeholder |
| showSkeleton | boolean | No | true | Show loading skeleton |
| fallbackSrc | string | No | undefined | Fallback image on error |
| onLoadComplete | function | No | undefined | Callback on load complete |
| className | string | No | "" | Additional CSS classes |

### Component State Management

| State | Type | Purpose |
|-------|------|---------|
| isLoading | boolean | Track loading status |
| hasError | boolean | Track error status |

### Component Rendering Logic

```
OptimizedImage Render Flow:
┌─────────────────────────────────┐
│  Check Current State            │
└────────┬────────────────────────┘
         │
    ┌────┴────┬──────────┬────────┐
    ▼         ▼          ▼        ▼
isLoading  hasError  Success   Initial
    │         │          │        │
    ▼         ▼          ▼        ▼
Skeleton  Fallback   Image    Image+
          Image                Skeleton
```

### Component Structure

```
OptimizedImage/
├── OptimizedImage.tsx      # Main component
├── ImageSkeleton.tsx       # (Task 09)
├── ImageFallback.tsx       # (Task 10)
└── index.ts               # Exports
```

### Loading State Handling

| State | Display | Action |
|-------|---------|--------|
| Initial | Image + Skeleton | Start loading |
| Loading | Skeleton only | Show placeholder |
| Success | Image only | Hide skeleton |
| Error | Fallback Image | Show error state |

### Event Handlers

| Handler | Purpose | Action |
|---------|---------|--------|
| onLoadComplete | Image loaded | Hide skeleton, update state |
| onError | Load failed | Show fallback, update state |

### Default Configuration

| Setting | Default | Rationale |
|---------|---------|-----------|
| loading | "lazy" | Performance (below fold) |
| quality | 80 | Balance size/quality |
| showSkeleton | true | Better UX during load |
| placeholder | "empty" | Default (blur in Task 08) |

### Usage Patterns

```
Basic Usage:
<OptimizedImage
  src="/products/item-1.jpg"
  alt="Product Name"
  width={300}
  height={300}
/>

With Priority (Above Fold):
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={600}
  priority
/>

With Blur Placeholder:
<OptimizedImage
  src="/product.jpg"
  alt="Product"
  width={600}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

Fill Container:
<OptimizedImage
  src="/background.jpg"
  alt="Background"
  fill
  sizes="100vw"
/>
```

### Expected Outcome
- Reusable OptimizedImage component created
- Wraps Next.js Image with enhanced features
- State management for loading and errors
- Support for all Next.js Image props
- Foundation for skeleton and fallback (Tasks 09-10)
- TypeScript interfaces defined
- Component exported properly

### Verification Checklist
- [ ] OptimizedImage directory created
- [ ] OptimizedImage.tsx component created
- [ ] Props interface extends ImageProps
- [ ] Loading state implemented
- [ ] Error state implemented
- [ ] onLoadComplete handler implemented
- [ ] onError handler implemented
- [ ] Default props configured
- [ ] Conditional rendering logic works
- [ ] TypeScript types correct
- [ ] Component exports properly
- [ ] index.ts barrel file created

---

## Task 06: Create Image Lazy Loading

### Overview
Configure lazy loading as the default behavior for the OptimizedImage component. Lazy loading defers loading images until they are about to enter the viewport, significantly improving initial page load time and reducing bandwidth consumption for images below the fold.

### Dependencies
- Task 05: Create OptimizedImage Component

### Instructions

1. **Understand lazy loading benefits**
   - Images load only when needed (entering viewport)
   - Reduces initial page load time
   - Saves bandwidth for unseen images
   - Improves Core Web Vitals (LCP, FID)

2. **Set default loading prop**
   - In OptimizedImage component, set loading="lazy" as default
   - Use TypeScript default parameter or prop destructuring
   - Allow override for priority images

3. **Implement loading prop handling**
   - Accept loading prop from parent components
   - Pass loading prop to Next.js Image component
   - Override with "eager" when priority=true

4. **Configure loading priority logic**
   - If priority prop is true, set loading="eager"
   - Otherwise, use loading="lazy"
   - Ensure priority images load immediately

5. **Add Intersection Observer support**
   - Next.js Image handles this automatically
   - Uses native browser lazy loading when supported
   - Falls back to Intersection Observer for older browsers

6. **Configure loading threshold**
   - Next.js loads images ~1250px before viewport
   - Ensures images ready when scrolled into view
   - No configuration needed (handled by Next.js)

7. **Document lazy loading behavior**
   - Add comments explaining default behavior
   - Document exceptions (priority images)
   - Note browser support and fallbacks

8. **Test lazy loading functionality**
   - Verify images below fold don't load initially
   - Check images load as user scrolls
   - Test in multiple browsers
   - Verify priority override works

### Lazy Loading Behavior

| Prop Configuration | Loading Behavior |
|-------------------|------------------|
| No props | Lazy loading (default) |
| priority={false} | Lazy loading |
| priority={true} | Eager loading |
| loading="eager" | Eager loading |
| loading="lazy" | Lazy loading |

### Loading Priority Logic

```
Image Load Decision:
┌──────────────────┐
│  priority=true?  │
└────────┬─────────┘
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Eager      Lazy
Load       Load
```

### Viewport Loading Threshold

```
Browser Viewport
┌─────────────────────┐
│                     │
│  Visible Content    │
│                     │
└─────────────────────┘
│                     │
│  ~1250px Buffer     │ ← Images start loading
│                     │
└─────────────────────┘
│                     │
│  Not Yet Loaded     │
│                     │
```

### Browser Support

| Feature | Browser | Fallback |
|---------|---------|----------|
| Native Lazy Loading | Chrome 76+, Firefox 75+, Safari 15.4+ | Intersection Observer |
| Intersection Observer | Chrome 51+, Firefox 55+, Safari 12.1+ | Polyfill |
| Fallback | Older browsers | Load all images |

### Performance Impact

| Metric | Improvement |
|--------|-------------|
| Initial Load Time | 30-50% faster |
| Bandwidth (Below Fold) | 100% saved until scroll |
| Time to Interactive | 20-40% faster |
| Largest Contentful Paint | Improved (priority images) |

### Loading States

| Image Position | Loading Strategy | Rationale |
|----------------|------------------|-----------|
| Above the fold | Eager (priority=true) | Visible immediately |
| Below the fold | Lazy (default) | Load when scrolling |
| Far below fold | Lazy (default) | May never load |

### Expected Outcome
- Lazy loading enabled by default
- Images below fold load on scroll
- Initial page load significantly faster
- Bandwidth saved for unseen images
- Priority images still load immediately
- Browser-native implementation with fallback

### Verification Checklist
- [ ] loading="lazy" set as default in OptimizedImage
- [ ] Priority prop overrides to loading="eager"
- [ ] Test images below fold don't load initially
- [ ] Images load as viewport approaches
- [ ] Priority images load immediately
- [ ] Browser DevTools Network tab shows lazy loading
- [ ] Performance improvement measurable
- [ ] Documentation added to component

---

## Task 07: Create Image Priority

### Overview
Implement priority loading support in the OptimizedImage component for above-the-fold images. Priority images bypass lazy loading and load immediately, ensuring critical content like hero banners and first product images appear instantly without layout shift or delay.

### Dependencies
- Task 05: Create OptimizedImage Component
- Task 06: Create Image Lazy Loading

### Instructions

1. **Understand priority loading purpose**
   - Critical images load immediately (no lazy loading)
   - Prevents layout shift for above-fold content
   - Improves Largest Contentful Paint (LCP)
   - Should be used sparingly (2-3 images per page)

2. **Implement priority prop handling**
   - Accept priority prop as boolean
   - Default to false for standard images
   - Pass to Next.js Image component

3. **Override lazy loading for priority images**
   - When priority=true, set loading="eager"
   - Disable lazy loading behavior
   - Add fetchPriority="high" hint for browsers

4. **Add preload link generation**
   - Next.js automatically generates <link rel="preload"> tags
   - Priority images preloaded in HTML head
   - Improves initial render performance

5. **Identify priority image candidates**
   - Hero/banner images at page top
   - Logo or brand images above fold
   - First product image in listing
   - Background images for above-fold sections

6. **Implement priority prop validation**
   - Log warning if too many priority images (>3 per page)
   - Development-only warning
   - Help developers use priority appropriately

7. **Document priority usage guidelines**
   - Add JSDoc comments explaining when to use priority
   - Provide examples of appropriate use cases
   - Warn against overuse

8. **Create priority prop examples**
   - Document hero image usage
   - Show product grid first image example
   - Demonstrate above-fold background usage

### Priority vs Lazy Loading

| Property | Priority=true | Priority=false (default) |
|----------|--------------|--------------------------|
| loading | "eager" | "lazy" |
| fetchPriority | "high" | "auto" |
| Preload Link | Yes | No |
| Load Timing | Immediately | On viewport approach |
| Use Case | Above the fold | Below the fold |

### Priority Decision Flow

```
Is Image Above
the Fold?
    │
┌───┴───┐
│       │
Yes     No
│       │
▼       ▼
Set     Use
priority  lazy
=true    loading
```

### Appropriate Priority Usage

| Context | Priority | Rationale |
|---------|----------|-----------|
| Hero banner | Yes | First content seen |
| Logo | Yes | Brand identity |
| First product | Yes | Initial impression |
| Product #2+ | No | Below fold likely |
| Thumbnails | No | Many images |
| Background (above fold) | Yes | Visual context |
| Background (below fold) | No | Not immediately visible |

### Priority Image Limit

| Images with Priority | Impact |
|---------------------|--------|
| 1-2 images | Optimal |
| 3-4 images | Acceptable |
| 5+ images | Degrades performance |

### Preload Link Example

```
Priority Image → Generates Preload:
<link
  rel="preload"
  as="image"
  href="/hero.jpg"
  imageSrcset="..."
  imageSizes="..."
/>
```

### LCP Improvement

| Strategy | LCP Time | Impact |
|----------|----------|--------|
| No optimization | 3.5s | Poor |
| Lazy loading only | 3.0s | Better |
| Priority for hero | 2.0s | Good |
| Priority + preload | 1.5s | Excellent |

### Usage Examples

```
Hero Image (Priority):
<OptimizedImage
  src="/hero-banner.jpg"
  alt="Special Offer"
  width={1920}
  height={600}
  priority
/>

First Product (Priority):
<OptimizedImage
  src="/products/featured.jpg"
  alt="Featured Product"
  width={600}
  height={600}
  priority
/>

Subsequent Products (No Priority):
<OptimizedImage
  src="/products/item-2.jpg"
  alt="Product 2"
  width={300}
  height={300}
/>
```

### Expected Outcome
- Priority prop support in OptimizedImage
- Priority images load immediately
- Above-the-fold content renders faster
- LCP metric improved
- Appropriate priority usage documented
- Preload links generated automatically

### Verification Checklist
- [ ] Priority prop accepted by OptimizedImage
- [ ] Priority overrides lazy loading
- [ ] fetchPriority="high" set for priority images
- [ ] Preload links generated in HTML head
- [ ] Test priority image loads immediately
- [ ] LCP improvement measurable
- [ ] Usage guidelines documented
- [ ] Development warning for excessive priority usage

---

## Task 08: Create Image Blur Placeholder

### Overview
Implement blur placeholder support in the OptimizedImage component to show a blurred preview while the full image loads. This technique provides visual continuity, reduces perceived load time, and eliminates layout shift by reserving image space with a low-quality preview.

### Dependencies
- Task 05: Create OptimizedImage Component

### Instructions

1. **Understand blur placeholder benefits**
   - Shows preview during image load
   - Reduces perceived load time
   - Prevents layout shift (CLS metric)
   - Improves user experience

2. **Configure placeholder prop support**
   - Accept placeholder prop ("blur" or "empty")
   - Accept blurDataURL prop (base64 string)
   - Default to "empty" (can enable blur per image)

3. **Implement blur placeholder logic**
   - When placeholder="blur", use blurDataURL
   - Pass both props to Next.js Image component
   - Render blur preview before full image loads

4. **Create blur data URL generation utility**
   - Create utility function to generate blur placeholders
   - Use sharp library or similar for server-side generation
   - Convert images to tiny base64 strings (~1-2KB)

5. **Add blur generation during build**
   - Generate blur placeholders at build time for static images
   - Store blurDataURL with image metadata
   - Include in image component props

6. **Implement runtime blur generation**
   - For dynamic images (user uploads), generate on server
   - Cache generated blur URLs for performance
   - Return blurDataURL with image API responses

7. **Configure blur quality parameters**
   - Set blur image size to ~20-40px (width)
   - Apply blur filter (radius ~10-20px)
   - Encode as base64 JPEG with low quality (10-20)

8. **Add blur placeholder styling**
   - Ensure blur scales to full image size
   - Apply smooth transition when real image loads
   - Test blur appearance on various backgrounds

9. **Document blur usage patterns**
   - Explain when to use blur placeholders
   - Document blur generation process
   - Provide examples for static and dynamic images

### Blur Placeholder Flow

```
Image Load Sequence:
┌─────────────────────────────────┐
│ 1. Show Blur Placeholder        │
│    (base64, ~1KB, instant)      │
└──────────┬──────────────────────┘
           ▼
┌─────────────────────────────────┐
│ 2. Load Full Image               │
│    (background download)         │
└──────────┬──────────────────────┘
           ▼
┌─────────────────────────────────┐
│ 3. Transition to Full Image     │
│    (smooth fade)                 │
└─────────────────────────────────┘
```

### Placeholder Types

| Type | Description | Data Size | Use Case |
|------|-------------|-----------|----------|
| empty | No placeholder | 0 bytes | Simple images, fast loads |
| blur | Blurred preview | 1-2 KB | Better UX, reduces perceived load |
| solid | Solid color | ~100 bytes | Minimal, fast |

### Blur Data URL Structure

```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
│    │     │      │
│    │     │      └── Base64 encoded image data
│    │     └── Base64 encoding
│    └── Image format (jpeg)
└── Data URI scheme
```

### Blur Generation Process

| Step | Action | Output |
|------|--------|--------|
| 1 | Resize to 20-40px width | Small image |
| 2 | Apply blur filter (10-20px radius) | Blurred image |
| 3 | Reduce quality (10-20) | Compressed image |
| 4 | Encode as base64 | Data URL string |
| 5 | Include in image props | blurDataURL |

### Blur Generation Timing

| Image Type | Generation Timing | Storage |
|------------|------------------|---------|
| Static Images | Build time | In code/JSON |
| CMS Images | On upload | Database |
| Dynamic Images | On request (cached) | Cache/Redis |
| CDN Images | Pre-generated | CDN metadata |

### Blur Quality Settings

| Setting | Value | Rationale |
|---------|-------|-----------|
| Thumbnail Width | 20-40px | Small file size |
| Blur Radius | 10-20px | Sufficient blur |
| JPEG Quality | 10-20 | Minimal quality needed |
| File Size | 1-2 KB | Fast inline delivery |

### Usage Examples

```
With Blur Placeholder:
<OptimizedImage
  src="/products/item-1.jpg"
  alt="Product"
  width={600}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
/>

Without Blur (Default):
<OptimizedImage
  src="/products/item-2.jpg"
  alt="Product"
  width={300}
  height={300}
/>
```

### Performance Impact

| Metric | Without Blur | With Blur | Improvement |
|--------|--------------|-----------|-------------|
| Perceived Load Time | 3.0s | 1.5s | 50% faster perceived |
| CLS Score | 0.15 | 0.05 | 67% better |
| User Experience | Fair | Good | Significant |

### Expected Outcome
- Blur placeholder support in OptimizedImage
- Blurred preview during image load
- Utility for generating blur data URLs
- Build-time and runtime blur generation
- Smooth transition to full image
- Improved perceived performance

### Verification Checklist
- [ ] Placeholder prop support added
- [ ] blurDataURL prop support added
- [ ] Blur utility function created
- [ ] Build-time blur generation implemented
- [ ] Runtime blur generation for dynamic images
- [ ] Blur transitions smoothly to full image
- [ ] File size of blur URLs optimized (~1-2KB)
- [ ] Test blur appearance on various backgrounds
- [ ] Usage documentation complete

---

## Task 09: Create Image Skeleton

### Overview
Create an ImageSkeleton component to display during image loading, providing a better user experience than blank space. The skeleton shows an animated placeholder that indicates content is loading, reducing perceived load time and improving visual stability.

### Dependencies
- Task 05: Create OptimizedImage Component

### Instructions

1. **Create ImageSkeleton component file**
   - Create `ImageSkeleton.tsx` in `OptimizedImage` directory
   - Set up React functional component structure
   - Use TypeScript for type safety

2. **Define skeleton props interface**
   - Width and height (match image dimensions)
   - Optional className for custom styling
   - Optional animation prop (enable/disable pulse)

3. **Design skeleton appearance**
   - Use neutral gray background color
   - Apply pulse animation for loading indication
   - Match image aspect ratio
   - Include border radius to match image styling

4. **Implement skeleton animation**
   - Create CSS pulse animation using Tailwind
   - Use animate-pulse utility class
   - Smooth, non-distracting animation
   - Can be disabled for static placeholder

5. **Add responsive skeleton sizing**
   - Accept responsive width/height props
   - Support aspect ratio preservation
   - Scale appropriately for different viewports

6. **Create skeleton variants**
   - Square skeleton for product thumbnails
   - Rectangle skeleton for hero images
   - Circle skeleton for avatars (optional)
   - Flexible dimensions via props

7. **Integrate with OptimizedImage**
   - Modify OptimizedImage to use ImageSkeleton
   - Show skeleton when isLoading=true
   - Hide skeleton when image loads or errors
   - Smooth transition between skeleton and image

8. **Configure skeleton display logic**
   - Show skeleton only if showSkeleton prop is true
   - Hide immediately on image load complete
   - Don't show skeleton if priority=true (optional)

### Skeleton Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| width | number/string | Yes | - | Skeleton width |
| height | number/string | Yes | - | Skeleton height |
| className | string | No | "" | Additional CSS classes |
| animate | boolean | No | true | Enable pulse animation |
| aspectRatio | string | No | undefined | Aspect ratio (e.g., "16/9") |

### Skeleton Appearance

```
Image Skeleton Visual:
┌─────────────────────────────────┐
│                                 │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░   │
│   ░░░░  Pulse Animation  ░░░   │
│   ░░░░  (Gray Background) ░░░   │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                 │
└─────────────────────────────────┘
```

### Skeleton Color Scheme

| Element | Tailwind Class | Color |
|---------|----------------|-------|
| Background | bg-gray-200 | Light gray |
| Dark Mode | dark:bg-gray-700 | Dark gray |
| Animation | animate-pulse | Fade in/out |

### Skeleton Integration Flow

```
OptimizedImage Render:
┌──────────────────┐
│  isLoading=true? │
└────────┬─────────┘
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Display    Display
Skeleton   Image
```

### Skeleton Variants

| Variant | Aspect Ratio | Use Case |
|---------|--------------|----------|
| Square | 1:1 | Product thumbnails |
| Portrait | 3:4 | Product images |
| Landscape | 16:9 | Hero banners |
| Wide | 21:9 | Ultra-wide banners |
| Circle | 1:1 with rounded | Avatars |

### Animation Timing

| Property | Value | Purpose |
|----------|-------|---------|
| Duration | 2s | Smooth loop |
| Iteration | Infinite | Continuous |
| Easing | ease-in-out | Natural feel |

### Skeleton Display Logic

| Condition | Show Skeleton |
|-----------|---------------|
| isLoading=true & showSkeleton=true | Yes |
| isLoading=true & showSkeleton=false | No |
| isLoading=false | No |
| hasError=true | No (show fallback) |

### Usage in OptimizedImage

```
{isLoading && showSkeleton && (
  <ImageSkeleton
    width={width}
    height={height}
    className={className}
  />
)}

<Image
  src={src}
  alt={alt}
  onLoadComplete={() => setIsLoading(false)}
  ...
/>
```

### Expected Outcome
- ImageSkeleton component created
- Pulse animation for loading indication
- Integration with OptimizedImage
- Responsive skeleton sizing
- Smooth transitions
- Improved perceived performance

### Verification Checklist
- [ ] ImageSkeleton.tsx file created
- [ ] Props interface defined
- [ ] Pulse animation implemented
- [ ] Gray background color applied
- [ ] Responsive sizing works
- [ ] Integration with OptimizedImage complete
- [ ] Skeleton shows during loading
- [ ] Skeleton hides on load complete
- [ ] Smooth transition to image
- [ ] Component exported properly

---

## Task 10: Create Image Error Fallback

### Overview
Create an ImageFallback component to display when image loading fails, providing graceful degradation and better user experience. The fallback shows a placeholder icon or alternative image instead of a broken image icon, with optional retry functionality.

### Dependencies
- Task 05: Create OptimizedImage Component

### Instructions

1. **Create ImageFallback component file**
   - Create `ImageFallback.tsx` in `OptimizedImage` directory
   - Set up React functional component structure
   - Use TypeScript for type safety

2. **Define fallback props interface**
   - Width and height (match original image)
   - Optional fallbackSrc (alternative image URL)
   - Optional message to display
   - Optional onRetry callback

3. **Design default fallback appearance**
   - Display icon (image icon, broken image, or placeholder)
   - Show optional error message
   - Use neutral background color
   - Match original image dimensions

4. **Implement fallback image support**
   - Accept fallbackSrc prop for custom fallback image
   - Display fallback image instead of placeholder icon
   - Handle nested errors (fallback image also fails)

5. **Add icon placeholder**
   - Use SVG icon for default placeholder
   - Image icon, photo icon, or broken image symbol
   - Center icon in container
   - Appropriate icon size

6. **Include error message (optional)**
   - Display "Image failed to load" message
   - Make message customizable via props
   - Style with small text below icon
   - Optional: hide message, show icon only

7. **Implement retry functionality (optional)**
   - Add "Retry" button or link
   - Call onRetry callback when clicked
   - Attempt to reload image
   - Track retry attempts to prevent loops

8. **Integrate with OptimizedImage**
   - Modify OptimizedImage to use ImageFallback
   - Show fallback when hasError=true
   - Pass error state to fallback component
   - Hide skeleton and show fallback on error

9. **Add accessibility features**
   - Proper alt text for fallback image
   - ARIA labels for fallback state
   - Screen reader friendly error messages

### Fallback Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| width | number/string | Yes | - | Fallback width |
| height | number/string | Yes | - | Fallback height |
| fallbackSrc | string | No | undefined | Alternative image URL |
| message | string | No | "Image unavailable" | Error message |
| showMessage | boolean | No | true | Show/hide message |
| onRetry | function | No | undefined | Retry callback |
| className | string | No | "" | Additional CSS classes |

### Fallback Appearance

```
Default Fallback (Icon):
┌─────────────────────────────────┐
│                                 │
│          ┌─────┐               │
│          │     │               │
│          │ 🖼️  │ Image Icon    │
│          │     │               │
│          └─────┘               │
│                                 │
│     Image unavailable           │
│                                 │
└─────────────────────────────────┘

With Fallback Image:
┌─────────────────────────────────┐
│                                 │
│   [Placeholder Image]           │
│   (e.g., generic product)       │
│                                 │
└─────────────────────────────────┘
```

### Fallback Types

| Type | Implementation | Use Case |
|------|----------------|----------|
| Icon Placeholder | SVG icon + message | Default fallback |
| Fallback Image | Alternative image URL | Product placeholders |
| Solid Color | Colored box + icon | Minimal fallback |
| Retry UI | Icon + retry button | Temporary failures |

### Error Handling Flow

```
Image Error:
┌──────────────────┐
│  hasError=true   │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
fallbackSrc  No fallbackSrc
provided?    provided?
    │         │
    ▼         ▼
Display    Display
Fallback   Icon +
Image      Message
```

### Icon Placeholder Options

| Icon | Meaning | Use Case |
|------|---------|----------|
| Image Icon | Generic image | Default |
| Broken Image | Failed load | Explicit error |
| Photo Icon | Missing photo | Photo galleries |
| Box Icon | Placeholder | Generic content |

### Nested Error Handling

| Scenario | Display |
|----------|---------|
| Original image fails | Show fallback image |
| Fallback image also fails | Show icon placeholder |
| No fallback provided | Show icon placeholder |

### Retry Functionality

| Feature | Implementation |
|---------|----------------|
| Retry Button | Optional onRetry callback |
| Retry Limit | Track attempts (max 3) |
| Retry Delay | Optional delay before retry |
| UI Feedback | Loading state during retry |

### Integration with OptimizedImage

```
{hasError && (
  <ImageFallback
    width={width}
    height={height}
    fallbackSrc={fallbackSrc}
    message="Failed to load image"
    onRetry={handleRetry}
  />
)}
```

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Alt Text | Descriptive alt for fallback |
| ARIA Label | aria-label="Image loading failed" |
| Role | role="img" for fallback |
| Message | Screen reader accessible |

### Expected Outcome
- ImageFallback component created
- Icon placeholder for failed images
- Fallback image support
- Optional error message display
- Optional retry functionality
- Integration with OptimizedImage
- Graceful error handling

### Verification Checklist
- [ ] ImageFallback.tsx file created
- [ ] Props interface defined
- [ ] Icon placeholder implemented
- [ ] Fallback image support added
- [ ] Error message display
- [ ] Retry functionality (optional)
- [ ] Integration with OptimizedImage complete
- [ ] Fallback shows on image error
- [ ] Nested error handling works
- [ ] Accessibility features implemented
- [ ] Component exported properly

---

## Summary

This document established the foundational image optimization configuration and created the core OptimizedImage component with essential features. The Next.js image configuration enables modern formats (WebP, AVIF), responsive device sizes, and allowed domains. The OptimizedImage component provides lazy loading by default, priority loading for above-fold images, blur placeholders for perceived performance, loading skeletons for better UX, and error fallback handling.

### Completed Tasks
1. ✓ Created image configuration in next.config.js
2. ✓ Configured allowed external image domains
3. ✓ Enabled modern image formats (WebP, AVIF)
4. ✓ Configured device sizes and breakpoints
5. ✓ Created OptimizedImage component wrapper
6. ✓ Implemented lazy loading by default
7. ✓ Added priority loading for above-fold images
8. ✓ Implemented blur placeholder support
9. ✓ Created loading skeleton component
10. ✓ Created error fallback component

### Next Steps
Proceed to [02_Tasks-11-18_Sizes-CDN-Verify.md](02_Tasks-11-18_Sizes-CDN-Verify.md) to configure specific image sizes for products, thumbnails, and hero images, implement background image handling, configure upload compression and CDN integration, create srcSet generation, and verify all image optimizations work correctly.
