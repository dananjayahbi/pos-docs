# Tasks 83-89: Performance Budget, Web Vitals, and Analytics

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** F - Monitoring & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-90-94_Testing-Report.md](02_Tasks-90-94_Testing-Report.md)

---

## Document Overview

This document covers the setup of performance monitoring infrastructure for the webstore. It establishes performance budgets, configures Lighthouse CI for automated testing, implements Web Vitals tracking for Core Web Vitals metrics (LCP, FID/INP, CLS), and integrates analytics to capture and report performance data. These tools provide continuous monitoring and measurement of optimization efforts.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Performance Budget | Medium | 30 min |
| 84 | Create Lighthouse CI | Medium | 45 min |
| 85 | Create Web Vitals Tracking | Medium | 40 min |
| 86 | Create LCP Monitoring | Low | 20 min |
| 87 | Create FID Monitoring | Low | 20 min |
| 88 | Create CLS Monitoring | Low | 20 min |
| 89 | Create Analytics Integration | Medium | 35 min |

---

## Task 83: Create Performance Budget

### Overview
Establish a comprehensive performance budget that defines maximum acceptable values for bundle sizes, load times, and Core Web Vitals metrics. This budget acts as a guardrail to prevent performance regressions during development and ensures the webstore maintains optimal loading speeds and user experience.

### Dependencies
- SubPhase-13 Group E: Caching & CDN (Task 82) must be complete
- Next.js project with build configuration
- Understanding of Core Web Vitals metrics

### Instructions

1. **Create performance configuration file**
   - Create `frontend/config/performance.config.ts`
   - Define TypeScript interfaces for budget constraints
   - Export configuration object for use across tools

2. **Define bundle size budgets**
   - Set main bundle limit: < 100KB gzipped
   - Set first load JS limit: < 200KB total
   - Define per-route bundle limits
   - Account for vendor chunks separately

3. **Set Core Web Vitals targets**
   - LCP (Largest Contentful Paint): < 2.5 seconds
   - FID (First Input Delay): < 100 milliseconds
   - INP (Interaction to Next Paint): < 200 milliseconds
   - CLS (Cumulative Layout Shift): < 0.1
   - FCP (First Contentful Paint): < 1.8 seconds

4. **Define resource budgets**
   - Maximum total page weight: < 1MB initial load
   - Maximum image size per image: < 200KB
   - Maximum font files: < 150KB total
   - Maximum CSS: < 50KB gzipped

5. **Set performance score thresholds**
   - Lighthouse Performance score: ≥ 90 (target)
   - Lighthouse Accessibility score: ≥ 95
   - Lighthouse Best Practices score: ≥ 90
   - Lighthouse SEO score: ≥ 95

6. **Configure build-time enforcement**
   - Set up Next.js bundle analyzer
   - Configure webpack performance hints
   - Define fail conditions for CI builds

7. **Document budget rationale**
   - Explain why each limit was chosen
   - Reference industry benchmarks
   - Account for target device capabilities

### Performance Budget Structure

```
Budget Categories
├── Bundle Sizes
│   ├── Main bundle (gzipped)
│   ├── First load JS
│   ├── Vendor chunks
│   └── Route-specific bundles
├── Core Web Vitals
│   ├── LCP target
│   ├── FID/INP target
│   └── CLS target
├── Resource Limits
│   ├── Total page weight
│   ├── Image limits
│   ├── Font limits
│   └── CSS limits
└── Lighthouse Scores
    ├── Performance
    ├── Accessibility
    ├── Best Practices
    └── SEO
```

### Budget Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5s - 4.0s | > 4.0s |
| FID | < 100ms | 100ms - 300ms | > 300ms |
| INP | < 200ms | 200ms - 500ms | > 500ms |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |
| FCP | < 1.8s | 1.8s - 3.0s | > 3.0s |
| TTI | < 3.8s | 3.8s - 7.3s | > 7.3s |

### Bundle Size Targets

| Bundle Type | Maximum Size | Target Device |
|-------------|--------------|---------------|
| Main bundle (gzip) | 100KB | All devices |
| First load JS | 200KB | All devices |
| Homepage route | 150KB | All devices |
| Product page route | 180KB | All devices |
| Category page route | 160KB | All devices |
| Checkout route | 200KB | All devices |

### Budget Enforcement Strategy

| Phase | Tool | Action |
|-------|------|--------|
| Development | Webpack warnings | Display warnings in console |
| Build | Bundle analyzer | Generate size reports |
| CI/CD | Lighthouse CI | Fail builds exceeding budget |
| Production | Web Vitals | Monitor real user metrics |

### Expected Outcome
- Comprehensive performance budget document
- Clear metrics and thresholds defined
- Build-time enforcement configured
- Foundation for performance monitoring

### Verification Checklist
- [ ] `frontend/config/performance.config.ts` file created
- [ ] Bundle size budgets defined
- [ ] Core Web Vitals targets set
- [ ] Resource limits specified
- [ ] Lighthouse score thresholds configured
- [ ] Budget rationale documented
- [ ] Configuration exported for other tools

---

## Task 84: Create Lighthouse CI

### Overview
Set up Lighthouse CI to automatically run Lighthouse audits on every build or pull request. This continuous integration ensures performance standards are maintained throughout development by catching regressions early. Lighthouse CI provides automated performance scoring, accessibility checks, and best practice validation.

### Dependencies
- Task 83: Create Performance Budget

### Instructions

1. **Install Lighthouse CI dependencies**
   - Install `@lhci/cli` as dev dependency
   - Ensure Node.js version compatibility
   - Verify installation in package.json

2. **Create Lighthouse CI configuration**
   - Create `.lighthouserc.js` in project root
   - Define CI configuration object
   - Export configuration for CLI usage

3. **Configure collection settings**
   - Set number of runs per URL (recommended: 3)
   - Define URLs to test (homepage, product, category)
   - Configure Chrome flags for consistency
   - Set viewport and device emulation

4. **Define assertion rules**
   - Import performance budget from Task 83
   - Set score thresholds for each category
   - Configure metric assertions (LCP, FID, CLS)
   - Define fail conditions

5. **Configure upload and storage**
   - Choose storage option (temporary, filesystem, or server)
   - Set up GitHub Actions integration
   - Configure PR status checks
   - Define report retention policy

6. **Create CI script**
   - Create `frontend/scripts/lighthouse-ci.js`
   - Build production bundle before testing
   - Start local server for testing
   - Run Lighthouse CI command
   - Clean up after execution

7. **Set up GitHub Actions workflow**
   - Create `.github/workflows/lighthouse-ci.yml`
   - Trigger on pull requests to main branch
   - Run Lighthouse CI in workflow
   - Post results as PR comments

8. **Configure local testing**
   - Add npm scripts for local Lighthouse runs
   - Create development testing workflow
   - Document usage in README

### Lighthouse CI Architecture

```
Developer Push
     │
     ▼
GitHub PR Created
     │
     ▼
GitHub Actions Triggered
     │
     ├─→ Build Next.js
     ├─→ Start Local Server
     ├─→ Run Lighthouse CI (3 runs)
     ├─→ Aggregate Results
     ├─→ Assert Budgets
     └─→ Post Results to PR
           │
           ├─→ ✓ Pass: Merge allowed
           └─→ ✗ Fail: Block merge
```

### Configuration Structure

| Section | Purpose | Key Settings |
|---------|---------|--------------|
| ci.collect | Define collection params | urls, numberOfRuns, settings |
| ci.assert | Set pass/fail criteria | assertions on metrics/scores |
| ci.upload | Configure result storage | target, token, serverBaseUrl |

### Assertion Examples

| Metric | Level | Threshold | Operator |
|--------|-------|-----------|----------|
| Performance Score | category | 90 | >= |
| LCP | metric | 2500 | <= |
| CLS | metric | 0.1 | <= |
| FID | metric | 100 | <= |
| First Load JS | resourceSummary | 200000 | <= |

### URLs to Test

| URL | Priority | Frequency |
|-----|----------|-----------|
| Homepage (/) | High | Every PR |
| Product Page | High | Every PR |
| Category Page | Medium | Every PR |
| Cart Page | Medium | Daily |
| Checkout | Low | Weekly |

### CI Integration Points

| Platform | Integration Method | Status Updates |
|----------|-------------------|----------------|
| GitHub Actions | Workflow YAML | PR status check |
| GitLab CI | .gitlab-ci.yml | Merge request widget |
| Vercel | vercel.json hook | Deployment comments |
| Netlify | netlify.toml plugin | Deploy preview |

### Expected Outcome
- Lighthouse CI configured and operational
- Automated performance audits on every PR
- Performance budget enforcement in CI
- Clear pass/fail criteria for builds

### Verification Checklist
- [ ] `@lhci/cli` installed as dev dependency
- [ ] `.lighthouserc.js` configuration file created
- [ ] URLs to test defined
- [ ] Assertions based on performance budget
- [ ] GitHub Actions workflow created
- [ ] Local testing scripts added to package.json
- [ ] CI successfully runs on test PR
- [ ] Results posted to PR comments

---

## Task 85: Create Web Vitals Tracking

### Overview
Implement real user monitoring (RUM) by tracking Core Web Vitals using the official `web-vitals` library. This provides actual performance data from real users' devices and network conditions, complementing the synthetic testing from Lighthouse CI. Web Vitals tracking captures LCP, FID/INP, CLS, FCP, and TTFB for all page loads.

### Dependencies
- Task 83: Create Performance Budget

### Instructions

1. **Install web-vitals library**
   - Install `web-vitals` as production dependency
   - Verify version compatibility with Next.js
   - Check package.json for correct installation

2. **Create Web Vitals module**
   - Create `frontend/lib/performance/webVitals.ts`
   - Import functions from web-vitals library
   - Define TypeScript types for metrics

3. **Import Core Web Vitals functions**
   - Import `onCLS` for Cumulative Layout Shift
   - Import `onFID` for First Input Delay
   - Import `onLCP` for Largest Contentful Paint
   - Import `onFCP` for First Contentful Paint
   - Import `onTTFB` for Time to First Byte
   - Import `onINP` for Interaction to Next Paint (new)

4. **Create metric handler function**
   - Define function to receive metric data
   - Extract metric properties (name, value, id, rating)
   - Log metrics in development mode
   - Queue metrics for analytics in production

5. **Initialize Web Vitals tracking**
   - Call each metric function with handler
   - Set up tracking on page load
   - Ensure tracking doesn't block rendering
   - Handle errors gracefully

6. **Integrate with Next.js App Router**
   - Import Web Vitals in root layout
   - Use `useEffect` for client-side initialization
   - Ensure tracking works with client components
   - Test in both development and production modes

7. **Add development debugging**
   - Console log metrics in development
   - Format output for readability
   - Display metric rating (good/needs improvement/poor)
   - Show element causing LCP

8. **Prepare for analytics integration (Task 89)**
   - Create queue for metric data
   - Define data structure for sending
   - Export function for analytics to consume

### Web Vitals Tracking Flow

```
Page Load
    │
    ├─→ Track TTFB (immediate)
    ├─→ Track FCP (when first paint occurs)
    ├─→ Track LCP (when largest content paints)
    ├─→ Track FID (on first user interaction)
    ├─→ Track INP (during page lifetime)
    └─→ Track CLS (accumulated through session)
          │
          ▼
    Metric Handler
          │
          ├─→ Development: Console log
          └─→ Production: Queue for analytics
```

### Core Web Vitals Functions

| Function | Metric | Measures | When Tracked |
|----------|--------|----------|--------------|
| onLCP | Largest Contentful Paint | Perceived load speed | When largest element renders |
| onFID | First Input Delay | Interactivity | On first user interaction |
| onINP | Interaction to Next Paint | Responsiveness | During all interactions |
| onCLS | Cumulative Layout Shift | Visual stability | Throughout page lifetime |
| onFCP | First Contentful Paint | Initial rendering | When first content renders |
| onTTFB | Time to First Byte | Server response | Immediate on load |

### Metric Data Structure

| Property | Type | Description |
|----------|------|-------------|
| name | string | Metric name (LCP, FID, CLS, etc.) |
| value | number | Metric value in appropriate unit |
| id | string | Unique identifier for this metric |
| delta | number | Change since last report |
| rating | string | 'good', 'needs-improvement', or 'poor' |
| entries | array | Performance entries for debugging |

### Web Vitals Integration Points

| Location | Purpose | Implementation |
|----------|---------|----------------|
| Root Layout | Initialize tracking | Import and call tracking functions |
| Client Components | Track interactions | Ensure hooks work in client context |
| Development | Debug output | Console log with formatted data |
| Production | Analytics | Queue metrics for sending |

### Rating Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | 0-2500ms | 2500-4000ms | > 4000ms |
| FID | 0-100ms | 100-300ms | > 300ms |
| INP | 0-200ms | 200-500ms | > 500ms |
| CLS | 0-0.1 | 0.1-0.25 | > 0.25 |
| FCP | 0-1800ms | 1800-3000ms | > 3000ms |
| TTFB | 0-800ms | 800-1800ms | > 1800ms |

### Expected Outcome
- Web Vitals library integrated into application
- All Core Web Vitals metrics tracked
- Metric data captured for real users
- Foundation for analytics integration

### Verification Checklist
- [ ] `web-vitals` installed as dependency
- [ ] `frontend/lib/performance/webVitals.ts` created
- [ ] All Core Web Vitals functions imported
- [ ] Metric handler function implemented
- [ ] Integration in root layout complete
- [ ] Development debugging logs working
- [ ] Metrics captured on page load
- [ ] TypeScript types defined

---

## Task 86: Create LCP Monitoring

### Overview
Implement specific monitoring for Largest Contentful Paint (LCP), the primary metric for perceived load speed. LCP measures when the largest content element in the viewport becomes visible. This task creates detailed tracking, debugging tools, and optimization guidance for LCP, ensuring the webstore loads quickly for users.

### Dependencies
- Task 85: Create Web Vitals Tracking

### Instructions

1. **Extend LCP tracking function**
   - Enhance the `onLCP` handler from Task 85
   - Capture additional LCP-specific data
   - Identify the element causing LCP

2. **Capture LCP element details**
   - Extract element tag name (img, div, p, etc.)
   - Get element ID or class for identification
   - Record element size (width × height)
   - Note element position in viewport

3. **Track LCP breakdown**
   - Measure TTFB component
   - Measure resource load duration
   - Calculate element render time
   - Identify bottlenecks in LCP timeline

4. **Implement LCP debugging**
   - Create development mode visualization
   - Highlight LCP element with border/overlay
   - Log LCP timeline in console
   - Show optimization suggestions

5. **Add LCP threshold alerts**
   - Check if LCP exceeds 2.5s (poor threshold)
   - Console warn for values 2.5s-4.0s
   - Console error for values > 4.0s
   - Include actionable optimization hints

6. **Create LCP optimization guidance**
   - Document common LCP elements (hero images, headings)
   - Provide recommendations for improvement
   - Link to priority hint techniques
   - Reference image optimization strategies

7. **Track LCP by page type**
   - Differentiate homepage LCP
   - Track product page LCP separately
   - Monitor category page LCP
   - Compare across page types

### LCP Measurement Timeline

```
Navigation Start
      │
      ▼
  TTFB (Server Response)
      │
      ▼
  Resource Load Start (if image/video)
      │
      ├─→ Download Time
      │
      ▼
  Resource Load End
      │
      ▼
  Element Render (LCP)
      │
      ▼
  LCP Metric Reported
```

### LCP Element Types

| Element Type | Common Usage | Optimization Priority |
|--------------|--------------|----------------------|
| Hero Image | Homepage banner | Very High |
| Product Image | Main product photo | Very High |
| Heading | Large text block | Medium |
| Video Poster | Video thumbnail | High |
| Background Image | Section background | Low |

### LCP Optimization Strategies

| Issue | Solution | Implementation |
|-------|----------|----------------|
| Large image | Optimize size and format | Use Next.js Image, WebP |
| Lazy loaded hero | Remove lazy loading | priority prop |
| Slow server | Improve TTFB | CDN, caching, edge functions |
| Render blocking | Optimize critical path | Inline critical CSS |
| Slow resource | Preload LCP resource | Link preload header |

### LCP Debugging Output

| Data Point | Description | Usage |
|------------|-------------|-------|
| Element | Tag and identifier | Find element in code |
| Value | LCP time in ms | Compare to budget |
| Rating | good/needs-improvement/poor | Quick status |
| Size | Element dimensions | Assess optimization needs |
| URL | Resource URL if applicable | Check image source |

### LCP by Page Type Targets

| Page Type | LCP Target | Acceptable Max | Typical LCP Element |
|-----------|------------|----------------|---------------------|
| Homepage | < 2.0s | 2.5s | Hero image |
| Product Page | < 2.2s | 2.5s | Product image |
| Category Page | < 2.3s | 2.5s | First product grid image |
| Cart Page | < 2.0s | 2.5s | Heading or first item image |
| Checkout | < 2.0s | 2.5s | Form container |

### Expected Outcome
- Detailed LCP monitoring and tracking
- LCP element identification and debugging
- Threshold alerts for poor performance
- Optimization guidance for developers

### Verification Checklist
- [ ] Enhanced LCP handler implemented
- [ ] LCP element details captured
- [ ] LCP timeline breakdown tracked
- [ ] Development debugging visualization working
- [ ] Threshold alerts configured
- [ ] Optimization guidance documented
- [ ] Per-page-type tracking implemented
- [ ] Console logs showing LCP data

---

## Task 87: Create FID Monitoring

### Overview
Implement specific monitoring for First Input Delay (FID) and its successor Interaction to Next Paint (INP). These metrics measure interactivity and responsiveness. FID tracks the delay between user's first interaction and browser's response, while INP measures the latency of all interactions throughout the page lifetime. This ensures the webstore is responsive and interactive.

### Dependencies
- Task 85: Create Web Vitals Tracking

### Instructions

1. **Extend FID tracking function**
   - Enhance the `onFID` handler from Task 85
   - Capture interaction type (click, tap, keypress)
   - Record target element information
   - Note timestamp of interaction

2. **Implement INP tracking**
   - Enhance the `onINP` handler
   - Track all interactions, not just first
   - Capture worst interaction delay
   - Monitor throughout page lifetime

3. **Capture interaction details**
   - Identify interaction type
   - Record target element (button, link, input)
   - Note element identifier (ID, class, text)
   - Track interaction duration

4. **Track FID/INP breakdown**
   - Measure input delay (waiting for main thread)
   - Measure processing time (event handler execution)
   - Calculate presentation delay (rendering updates)
   - Identify which phase causes delays

5. **Implement interaction debugging**
   - Log all interactions in development
   - Highlight slow interactions (> 100ms for FID, > 200ms for INP)
   - Show interaction timeline
   - Display optimization suggestions

6. **Add threshold alerts**
   - Warn for FID > 100ms
   - Warn for INP > 200ms
   - Error for severe delays (FID > 300ms, INP > 500ms)
   - Include specific element causing delay

7. **Create optimization guidance**
   - Document common FID/INP issues
   - Provide code splitting recommendations
   - Suggest deferring non-critical JavaScript
   - Reference React hydration optimization

8. **Track interactions by type**
   - Separate click/tap interactions
   - Monitor keyboard interactions
   - Track form input interactions
   - Compare performance across types

### FID vs INP Comparison

```
FID (First Input Delay)
└── Measures only the FIRST user interaction
    └── Good: < 100ms
    
INP (Interaction to Next Paint)
└── Measures ALL interactions during page lifetime
    └── Reports the WORST interaction (98th percentile)
    └── Good: < 200ms
    
Recommendation: Track both, prioritize INP for new projects
```

### Interaction Timeline

```
User Interaction (click/tap/key)
      │
      ▼
  Input Delay (waiting for main thread)
      │
      ▼
  Processing (event handler execution)
      │
      ▼
  Presentation Delay (render updates)
      │
      ▼
  Visual Feedback Shown
      │
      ▼
  FID/INP Metric Reported
```

### Common Interaction Targets

| Element Type | Typical Interaction | Target Delay | Priority |
|--------------|---------------------|--------------|----------|
| Add to Cart Button | Click | < 100ms | Very High |
| Product Link | Click | < 100ms | High |
| Filter Checkbox | Click | < 100ms | High |
| Search Input | Keypress | < 50ms | Very High |
| Quantity Input | Click/keypress | < 100ms | Medium |

### FID/INP Optimization Strategies

| Issue | Solution | Implementation |
|-------|----------|----------------|
| Large JS bundle | Code split by route | Dynamic imports |
| Long task blocking main thread | Break into smaller tasks | setTimeout, scheduler API |
| Heavy event handler | Debounce/throttle | Lodash debounce |
| React hydration blocking | Selective hydration | React.lazy, Suspense |
| Third-party scripts | Defer loading | async/defer attributes |

### Interaction Debugging Output

| Data Point | Description | Usage |
|------------|-------------|-------|
| Type | Interaction type | Identify pattern |
| Value | Delay in ms | Compare to budget |
| Rating | good/needs-improvement/poor | Quick status |
| Target | Element interacted with | Find in code |
| Phase | Which phase caused delay | Focus optimization |

### Threshold Definitions

| Metric | Good | Needs Improvement | Poor | Action |
|--------|------|-------------------|------|--------|
| FID | < 100ms | 100-300ms | > 300ms | Optimize long tasks |
| INP | < 200ms | 200-500ms | > 500ms | Reduce interaction latency |

### Expected Outcome
- Comprehensive FID and INP monitoring
- Interaction details captured and analyzed
- Debugging tools for slow interactions
- Optimization guidance for developers

### Verification Checklist
- [ ] Enhanced FID handler implemented
- [ ] INP tracking configured
- [ ] Interaction details captured
- [ ] Timeline breakdown tracked
- [ ] Development debugging logs working
- [ ] Threshold alerts configured
- [ ] Optimization guidance documented
- [ ] Per-interaction-type tracking implemented

---

## Task 88: Create CLS Monitoring

### Overview
Implement specific monitoring for Cumulative Layout Shift (CLS), which measures visual stability. CLS tracks unexpected layout shifts that occur during the page lifetime, often caused by images without dimensions, dynamic content insertion, or web fonts loading. This ensures users don't experience frustrating content jumps while interacting with the webstore.

### Dependencies
- Task 85: Create Web Vitals Tracking

### Instructions

1. **Extend CLS tracking function**
   - Enhance the `onCLS` handler from Task 85
   - Capture all layout shift entries
   - Track cumulative score over time
   - Record when shifts occur

2. **Capture shift entry details**
   - Extract shifted elements for each entry
   - Record shift distance (impact fraction × distance fraction)
   - Note viewport percentage affected
   - Identify timestamp of each shift

3. **Track CLS sources**
   - Identify images causing shifts (missing dimensions)
   - Detect dynamic content insertion shifts
   - Track font swap causing shifts (FOUT/FOIT)
   - Monitor ad insertion shifts

4. **Implement CLS debugging**
   - Visualize shifted elements in development
   - Highlight elements with red borders/overlays
   - Log shift details in console
   - Show cumulative score in real-time

5. **Add threshold alerts**
   - Warn for CLS > 0.1 (needs improvement)
   - Error for CLS > 0.25 (poor)
   - Alert on individual large shifts (> 0.05)
   - Include element causing shift

6. **Create optimization guidance**
   - Document common CLS causes
   - Provide dimension reservation strategies
   - Suggest font loading optimizations
   - Reference skeleton loading patterns

7. **Track CLS by page lifecycle**
   - Monitor shifts during page load
   - Track shifts after user interaction
   - Measure shifts during dynamic updates
   - Compare phases for optimization focus

8. **Identify shift patterns**
   - Group shifts by cause
   - Find recurring problematic elements
   - Track shifts by page type
   - Prioritize optimization efforts

### CLS Calculation

```
CLS Score = Σ (Impact Fraction × Distance Fraction)

Impact Fraction: Percentage of viewport affected
Distance Fraction: Distance moved relative to viewport

Example:
- Element takes 50% of viewport height
- Shifts down 25% of viewport height
- CLS for this shift = 0.5 × 0.25 = 0.125
```

### Common CLS Causes

| Cause | Description | Frequency | Fix Priority |
|-------|-------------|-----------|--------------|
| Images without dimensions | No width/height specified | Very Common | Very High |
| Dynamic content insertion | Content added above viewport | Common | High |
| Web fonts loading | Font swap causing reflow | Common | High |
| Ads without reserved space | Ad loads after layout | Common | High |
| Animations | CSS/JS animations triggering layout | Less Common | Medium |

### CLS Optimization Strategies

| Issue | Solution | Implementation |
|-------|----------|----------------|
| Image shifts | Set explicit dimensions | width/height attributes |
| Font shifts | Use font-display: optional | CSS font-display |
| Dynamic content | Reserve space upfront | min-height or skeleton |
| Ad shifts | Define ad slot dimensions | Fixed container size |
| Late-loading images | Use aspect ratio boxes | aspect-ratio CSS property |

### CLS Debugging Output

| Data Point | Description | Usage |
|------------|-------------|-------|
| Total Score | Cumulative CLS | Compare to budget (< 0.1) |
| Entry Count | Number of shifts | Identify shift frequency |
| Largest Shift | Single worst shift | Focus optimization here |
| Elements | Shifted elements | Find in code |
| Timestamps | When shifts occurred | Correlate with events |

### CLS Threshold Definitions

| Score | Rating | Visual Impact | Action Required |
|-------|--------|---------------|-----------------|
| < 0.1 | Good | Minimal, acceptable | Maintain |
| 0.1 - 0.25 | Needs Improvement | Noticeable | Optimize soon |
| > 0.25 | Poor | Severe, frustrating | Fix immediately |

### CLS by Page Lifecycle

| Phase | Description | Common Shifts | Optimization Focus |
|-------|-------------|---------------|-------------------|
| Load | Initial page load | Images, fonts | Set dimensions, preload fonts |
| Interaction | After user action | Dynamic content | Reserve space, use transitions |
| Update | Content changes | Filters, cart updates | Animate, maintain layout |

### Expected Outcome
- Comprehensive CLS monitoring and tracking
- Layout shift sources identified
- Visual debugging tools in development
- Optimization guidance for common issues

### Verification Checklist
- [ ] Enhanced CLS handler implemented
- [ ] Layout shift entries captured
- [ ] Shift sources identified
- [ ] Development debugging visualization working
- [ ] Threshold alerts configured
- [ ] Optimization guidance documented
- [ ] Lifecycle phase tracking implemented
- [ ] Console logs showing CLS data

---

## Task 89: Create Analytics Integration

### Overview
Integrate the Web Vitals tracking with an analytics platform to capture, aggregate, and analyze real user performance data. This sends the collected Core Web Vitals metrics (LCP, FID/INP, CLS) along with context (page type, device, connection) to analytics for trend analysis, alerting, and performance reporting. Supports Google Analytics and custom analytics endpoints.

### Dependencies
- Task 85: Create Web Vitals Tracking
- Task 86: Create LCP Monitoring
- Task 87: Create FID Monitoring
- Task 88: Create CLS Monitoring

### Instructions

1. **Choose analytics platform**
   - Option A: Google Analytics 4 (GA4)
   - Option B: Custom analytics endpoint
   - Option C: Both (recommended)
   - Consider data privacy and GDPR compliance

2. **Create analytics sender module**
   - Create `frontend/lib/performance/analytics.ts`
   - Define function to send metrics
   - Handle both GA4 and custom endpoints
   - Implement retry logic for failures

3. **Integrate with Web Vitals handler**
   - Import analytics sender in webVitals.ts
   - Call sender function in metric handler
   - Pass metric data (name, value, id, rating)
   - Include additional context

4. **Add contextual data**
   - Capture page URL and path
   - Record device type (mobile/tablet/desktop)
   - Include connection type (4G, WiFi, etc.)
   - Add timestamp and session ID

5. **Implement Google Analytics integration**
   - Use GA4 Measurement Protocol or gtag.js
   - Send metrics as custom events
   - Structure event parameters correctly
   - Verify events in GA4 DebugView

6. **Create custom endpoint integration**
   - Define API endpoint for receiving metrics
   - Structure payload with all required data
   - Implement POST request with fetch
   - Handle CORS and authentication

7. **Add batching and throttling**
   - Queue metrics to avoid excessive requests
   - Batch multiple metrics into single request
   - Throttle sending to every 5-10 seconds
   - Flush queue on page unload

8. **Implement error handling**
   - Wrap analytics calls in try-catch
   - Log errors in development
   - Prevent analytics failures from breaking app
   - Retry failed requests with exponential backoff

9. **Add sampling for high-traffic sites**
   - Implement sampling rate (e.g., 10% of users)
   - Ensure representative sample
   - Document sampling methodology
   - Balance data volume vs. accuracy

### Analytics Integration Architecture

```
Web Vitals Tracking
      │
      ├─→ Metric Captured (LCP, FID, CLS, etc.)
      │
      ▼
  Metric Handler
      │
      ├─→ Add Context (URL, device, connection)
      │
      ▼
  Analytics Sender
      │
      ├────────────┬─────────────┐
      ▼            ▼             ▼
  Google Analytics  Custom API  Console (dev)
      │            │             │
      ▼            ▼             ▼
  GA4 Dashboard  Database    Local debugging
```

### Metric Data Structure for Analytics

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| event_name | string | Type of event | 'web_vitals' |
| metric_name | string | Which metric | 'LCP', 'FID', 'CLS' |
| metric_value | number | Metric value | 2456 (ms) or 0.08 |
| metric_id | string | Unique metric ID | 'v3-1234567890' |
| metric_rating | string | Performance rating | 'good', 'needs-improvement', 'poor' |
| page_path | string | Current page URL | '/products/laptop' |
| device_type | string | Device category | 'mobile', 'tablet', 'desktop' |
| connection_type | string | Network type | '4g', 'wifi' |
| timestamp | number | When captured | Date.now() |
| session_id | string | User session | Generated UUID |

### Google Analytics 4 Integration

| Method | Implementation | Pros | Cons |
|--------|----------------|------|------|
| gtag.js | Use gtag('event', ...) | Simple, familiar | Requires GA script |
| Measurement Protocol | Direct HTTP POST | No client library | More complex |
| Google Tag Manager | Configure via GTM | Centralized management | Additional setup |

### Custom Analytics Endpoint

| Component | Description | Implementation |
|-----------|-------------|----------------|
| Endpoint | POST /api/analytics/metrics | Next.js API route |
| Authentication | API key or JWT | Header: Authorization |
| Payload | JSON with metric data | Structured object |
| Storage | Database or logging service | PostgreSQL, Elasticsearch |
| Processing | Aggregate and analyze | Background jobs |

### Batching Strategy

```
Metric Captured
      │
      ▼
  Add to Queue (in-memory array)
      │
      ▼
  Wait for batch conditions:
      ├─→ Queue size reaches 10 metrics
      ├─→ 10 seconds elapsed since last send
      └─→ Page unload event
      │
      ▼
  Send Batch
      │
      ├─→ Success: Clear queue
      └─→ Failure: Retry with exponential backoff
```

### Sampling Implementation

| Traffic Level | Sample Rate | Rationale |
|---------------|-------------|-----------|
| < 10k visits/day | 100% | Capture all data |
| 10k-100k visits/day | 50% | Balance volume/accuracy |
| 100k-1M visits/day | 10% | Reduce data volume |
| > 1M visits/day | 1-5% | Statistical significance |

### Expected Outcome
- Web Vitals metrics sent to analytics
- Real user monitoring data collected
- Performance trends visible in analytics dashboard
- Foundation for alerting and reporting

### Verification Checklist
- [ ] Analytics platform chosen and configured
- [ ] `frontend/lib/performance/analytics.ts` created
- [ ] Integration with Web Vitals handler complete
- [ ] Contextual data captured and sent
- [ ] Google Analytics integration working (if chosen)
- [ ] Custom endpoint integration working (if chosen)
- [ ] Batching and throttling implemented
- [ ] Error handling and retry logic in place
- [ ] Sampling configured (if high traffic)
- [ ] Metrics visible in analytics dashboard

---

## Summary

This document established the performance monitoring infrastructure for the webstore. A performance budget was defined with clear thresholds for bundle sizes and Core Web Vitals. Lighthouse CI was configured for automated audits. Web Vitals tracking was implemented to capture real user metrics. Specific monitoring was created for LCP, FID/INP, and CLS with debugging tools and optimization guidance. Finally, analytics integration was implemented to send metrics to GA4 or custom endpoints for analysis and reporting.

### Completed Tasks
1. ✓ Created performance budget with bundle and metric limits
2. ✓ Created Lighthouse CI for automated performance audits
3. ✓ Created Web Vitals tracking for Core Web Vitals
4. ✓ Created LCP monitoring with element identification
5. ✓ Created FID monitoring with interaction tracking
6. ✓ Created CLS monitoring with shift source detection
7. ✓ Created analytics integration for real user monitoring

### Next Steps
Proceed to [02_Tasks-90-94_Testing-Report.md](02_Tasks-90-94_Testing-Report.md) to perform comprehensive Lighthouse testing across different page types and create a final performance report documenting all optimizations.
