# Tasks 37-46: Bundle Analysis, Dynamic Imports & Tree Shaking

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 13 - Performance Optimization  
> **Group:** C - Code Splitting & Bundles  
> **Document:** 01 of 02  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-47-52_Packages-Build-Verify.md](02_Tasks-47-52_Packages-Build-Verify.md)

---

## Document Overview

Covers bundle analysis, dynamic imports, lazy loading, route splitting, vendor/common chunking, and tree shaking for optimal bundle sizes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Analyze Bundle Size | Medium | 30 min |
| 38 | Create Dynamic Imports | Medium | 45 min |
| 39 | Create Lazy Modal | Low | 20 min |
| 40 | Create Lazy Gallery | Low | 20 min |
| 41 | Create Lazy Charts | Low | 20 min |
| 42 | Create Lazy Rich Text | Low | 20 min |
| 43 | Create Route-based Splitting | Medium | 30 min |
| 44 | Create Vendor Chunking | Medium | 35 min |
| 45 | Create Common Chunk | Medium | 30 min |
| 46 | Create Tree Shaking | Medium | 40 min |

---

## Task 37: Analyze Bundle Size

### Overview
Install @next/bundle-analyzer to visualize bundle composition. Generates treemap showing dependency sizes for data-driven optimization.

### Dependencies
- SubPhase-13 Group-B completed
- Next.js production build ready

### Instructions

1. **Install analyzer**: Add `@next/bundle-analyzer` as devDependency
2. **Configure next.config.js**: Wrap config with analyzer, enable via ANALYZE=true env var
3. **Add npm script**: Create "analyze" script in package.json
4. **Generate reports**: Run analyzer to create client.html and server.html
5. **Review results**: Open reports in browser, study treemap
6. **Document baseline**: Record First Load JS, largest dependencies, total sizes

### Configuration
| Setting | Value | Purpose |
|---------|-------|---------|
| enabled | process.env.ANALYZE === 'true' | Conditional activation |
| mode | 'static' | Generate HTML files |
| reportFilename | './analyze/client.html' & './analyze/server.html' | Report locations |

### Key Metrics
| Metric | Target |
|--------|--------|
| First Load JS | < 200 KB |
| Main bundle | < 100 KB |
| Vendor bundle | < 150 KB |
| Route bundles | < 50 KB each |

### Expected Outcome
Analyzer installed, reports generated, baseline documented, visibility into bundle composition.

### Verification
- [ ] @next/bundle-analyzer installed
- [ ] next.config.js configured
- [ ] Reports generated successfully
- [ ] Baseline metrics documented

---

## Task 38: Create Dynamic Imports

### Overview
Create helper module wrapping next/dynamic with standardized loading states and configuration presets.

### Dependencies
- Task 37

### Instructions

1. **Create lib/performance/dynamicImports.ts**
2. **Define loading components**: Spinner, skeleton, custom options
3. **Create createDynamicImport function**: Wraps next/dynamic with config
4. **Configure SSR handling**: Option to enable/disable SSR per component
5. **Add error boundaries**: Handle import failures gracefully
6. **Create presets**: Modal (SSR:false), Gallery (SSR:true), Chart (SSR:false), Editor (SSR:false)
7. **Add TypeScript types**: Proper interfaces for config options
8. **Document usage**: JSDoc comments with examples

### Configuration Options
| Option | Default | Use Case |
|--------|---------|----------|
| ssr | true | Server-side rendering |
| loading | LoadingSpinner | Loading component |
| suspense | false | React Suspense |

### Presets
| Preset | SSR | Loading | Use For |
|--------|-----|---------|---------|
| modal | No | Spinner | User-triggered modals |
| gallery | Yes | Skeleton | SEO-critical images |
| chart | No | Chart skeleton | Dashboard widgets |
| editor | No | Editor skeleton | Rich text editors |

### Expected Outcome
Centralized dynamic import helper with presets, standardized loading states, type-safe wrapper.

### Verification
- [ ] lib/performance/dynamicImports.ts created
- [ ] createDynamicImport function works
- [ ] Presets defined
- [ ] Types exported correctly

---

## Task 39: Create Lazy Modal

### Overview
Lazy load modal components using dynamic import helper. Modals are user-triggered and don't need initial loading.

### Dependencies
- Task 38

### Instructions

1. **Create lib/performance/lazyComponents.ts**
2. **Import createDynamicImport and modal preset**
3. **Lazy load ProductQuickViewModal**: Use modal preset (SSR:false, spinner)
4. **Lazy load ImageLightboxModal**: Use modal preset with skeleton
5. **Lazy load ShareDialog**: Use modal preset
6. **Lazy load ConfirmDialog**: Use modal preset
7. **Update imports**: Replace direct imports with lazy versions throughout app
8. **Test functionality**: Verify modals work after lazy loading

### Modal Components
| Modal | Size | Loading |
|-------|------|---------|
| ProductQuickViewModal | ~45 KB | Spinner |
| ImageLightboxModal | ~60 KB | Skeleton |
| ShareDialog | ~30 KB | Icon loader |
| ConfirmDialog | ~15 KB | Minimal |

### Bundle Impact
- Initial load: +0 KB (lazy loaded)
- Modal opened: +45 KB (on demand)
- Never opened: +0 KB (100% saved)

### Expected Outcome
Modals lazy loaded, initial bundle reduced by ~200 KB, loading indicators display correctly.

### Verification
- [ ] lazyComponents.ts created
- [ ] Modals lazy loaded
- [ ] Loading states display
- [ ] Separate chunks in analyzer

---

## Task 40: Create Lazy Gallery

### Overview
Lazy load galleries with SEO consideration. Product galleries need SSR, others can be client-only.

### Dependencies
- Task 38

### Instructions

1. **Lazy load ProductImageGallery**: SSR:true (SEO), skeleton loader
2. **Create GallerySkeleton**: Match gallery layout dimensions
3. **Lazy load PromotionalCarousel**: SSR based on placement (above/below fold)
4. **Lazy load 360ImageViewer**: SSR:false, load on button click
5. **Lazy load ZoomMagnifier**: Load on hover separately
6. **Update usage**: Replace imports with lazy versions
7. **Test SEO**: Verify image indexing works with SSR galleries

### Gallery Strategy
| Gallery | SSR | Loading | Reason |
|---------|-----|---------|--------|
| ProductImageGallery | Yes | Skeleton | SEO critical |
| PromotionalCarousel | Conditional | Skeleton | Based on placement |
| 360ImageViewer | No | Spinner | User-triggered |
| ZoomMagnifier | No | None | On hover |

### Expected Outcome
Product galleries SSR for SEO, non-critical galleries lazy loaded, significant bundle reduction.

### Verification
- [ ] Galleries lazy loaded appropriately
- [ ] SSR enabled for SEO-critical galleries
- [ ] Skeleton loaders functional
- [ ] SEO test confirms indexing

---

## Task 41: Create Lazy Charts

### Overview
Lazy load chart libraries (Recharts, Chart.js, D3). Only load when dashboard/analytics pages visited.

### Dependencies
- Task 38

### Instructions

1. **Add chart imports to lazyComponents.ts**
2. **Lazy load LineChart**: Chart preset (SSR:false), skeleton
3. **Lazy load BarChart**: Chart preset, skeleton
4. **Lazy load PieChart**: Chart preset, circular skeleton
5. **Lazy load AreaChart**: Chart preset, skeleton
6. **Create ChartSkeleton**: Animated axis and data placeholders
7. **Update dashboard**: Replace direct imports
8. **Test loading**: Verify charts render after lazy load

### Chart Libraries
| Library | Size | Typical Usage |
|---------|------|---------------|
| Recharts | ~180 KB | Line, Bar, Pie, Area charts |
| Chart.js | ~150 KB | Various chart types |
| D3.js | ~500 KB | Custom visualizations |

### Bundle Impact
- Non-dashboard users: +0 KB (never loaded)
- Dashboard users: +180 KB (on dashboard visit only)

### Expected Outcome
Charts load only on dashboard pages, ~180 KB saved for non-dashboard visitors.

### Verification
- [ ] Charts lazy loaded
- [ ] Skeleton displays correctly
- [ ] Homepage doesn't load charts
- [ ] Dashboard loads charts successfully

---

## Task 42: Create Lazy Rich Text

### Overview
Lazy load rich text editors (TipTap, Quill, Slate). Editors are 200-700 KB and only needed for content editing.

### Dependencies
- Task 38

### Instructions

1. **Lazy load RichTextEditor**: Editor preset (SSR:false), editor skeleton
2. **Create EditorSkeleton**: Toolbar placeholder, content area placeholder
3. **Lazy load toolbar extensions**: Load plugins on button click (link, image, table)
4. **Lazy load MarkdownEditor**: If used, simpler loading state
5. **Update editor usage**: Replace imports on admin/blog pages
6. **Optional preload**: Preload on edit button hover
7. **Test functionality**: Verify editor works after lazy load

### Editor Sizes
| Editor | Core | With Extensions | Total |
|--------|------|-----------------|-------|
| TipTap | ~45 KB | +200 KB | ~245 KB |
| Quill | ~75 KB | +100 KB | ~175 KB |
| CKEditor | ~300 KB | +400 KB | ~700 KB |

### Bundle Impact
- Read-only users: +0 KB (never loaded)
- Editing users: +245 KB (on edit action only)

### Expected Outcome
Editors load only when editing, ~245 KB saved for read-only users.

### Verification
- [ ] Editor lazy loaded
- [ ] Skeleton displays correctly
- [ ] Extensions load on demand
- [ ] Non-editing users don't load editor

---

## Task 43: Create Route-based Splitting

### Overview
Verify and optimize Next.js automatic route-based code splitting. Each page should load only its required JavaScript.

### Dependencies
- Task 38

### Instructions

1. **Review Next.js automatic splitting**: Each page.tsx = separate chunk
2. **Analyze route bundles**: Check First Load JS per route in build output
3. **Identify heavy routes**: Routes exceeding 50 KB added bundle
4. **Optimize heavy routes**: Move large imports to lazy loading
5. **Configure prefetching**: Adjust Link prefetch based on traffic patterns
6. **Create route groups**: Organize admin/customer routes for better code sharing
7. **Verify isolation**: Homepage shouldn't load admin code
8. **Test navigation**: Network tab shows only required chunks
9. **Document targets**: Set bundle size targets per route type
10. **Monitor compliance**: Track route sizes over time

### Route Targets
| Route Type | Target Added JS | Max First Load |
|------------|----------------|----------------|
| Homepage | < 30 KB | < 150 KB |
| Product listing | < 40 KB | < 180 KB |
| Product detail | < 50 KB | < 200 KB |
| Cart | < 35 KB | < 170 KB |
| Checkout | < 60 KB | < 220 KB |
| Dashboard | < 80 KB | < 250 KB |
| Admin | < 100 KB | < 300 KB |

### Expected Outcome
Each route loads minimal JavaScript, shared code in common chunks, targets met.

### Verification
- [ ] Build shows First Load JS per route
- [ ] Homepage doesn't include admin code
- [ ] Route bundles meet targets
- [ ] Navigation loads only required chunks

---

## Task 44: Create Vendor Chunking

### Overview
Configure webpack splitChunks to separate node_modules into vendor bundle for long-term caching.

### Dependencies
- Task 37

### Instructions

1. **Open next.config.js webpack config**
2. **Add splitChunks.cacheGroups**
3. **Create "vendor" cache group**: test: /node_modules/, priority: 20
4. **Create "framework" cache group**: Separate React/Next.js, priority: 30
5. **Configure chunk naming**: Use content hash for cache busting
6. **Set size limits**: maxSize 250-300KB for vendor
7. **Test build**: Verify vendor.js and framework.js created
8. **Verify caching**: Test cache persistence after code updates

### Configuration
| Property | Value | Purpose |
|----------|-------|---------|
| cacheGroups.vendor.test | /node_modules/ | Match dependencies |
| cacheGroups.vendor.priority | 20 | Higher than default |
| cacheGroups.framework.priority | 30 | Highest priority |

### Cache Benefits
```
Without chunking: 500 KB main.js (frequent changes)
With chunking:
  - framework.js: 200 KB (95% cache hit)
  - vendor.js: 200 KB (80% cache hit)
  - main.js: 100 KB (20% cache hit)
```

### Expected Outcome
Vendor/framework separated, long-term caching enabled, reduced bandwidth for repeat visitors.

### Verification
- [ ] splitChunks configured
- [ ] vendor.js chunk created
- [ ] framework.js chunk created
- [ ] Repeat visits use cached bundles

---

## Task 45: Create Common Chunk

### Overview
Extract commonly shared app code (used by 2+ pages) into common chunk to prevent duplication.

### Dependencies
- Task 44

### Instructions

1. **Add "common" cache group to splitChunks**
2. **Configure minChunks: 2**: Extract code shared by 2+ pages
3. **Set priority: 10**: Lower than vendor
4. **Set size limits**: minSize 20KB, maxSize 100KB
5. **Test extraction**: Build and verify common.js created
6. **Measure duplication**: Compare bundle sizes before/after
7. **Adjust threshold**: Tune minChunks based on sharing patterns

### Configuration
| Property | Value | Purpose |
|----------|-------|---------|
| test | /src/ | Match app code only |
| minChunks | 2 | Shared by 2+ pages |
| priority | 10 | After vendor |

### Impact
```
Before: pageA 80KB, pageB 85KB, pageC 75KB = 240KB total
After: common 25KB, pageA 55KB, pageB 60KB, pageC 50KB = 190KB total
Savings: 50KB (21% reduction)
```

### Expected Outcome
Shared components in common chunk, duplication eliminated, 20-30% size reduction.

### Verification
- [ ] Common cache group configured
- [ ] common.js chunk created
- [ ] Duplication eliminated
- [ ] Size reduction achieved

---

## Task 46: Create Tree Shaking

### Overview
Configure tree shaking to eliminate unused code via ES modules and proper sideEffects configuration.

### Dependencies
- Task 37

### Instructions

1. **Verify ES module usage**: All imports use import/export (not require/module.exports)
2. **Configure package.json sideEffects**: Set to false or list CSS/polyfill files
3. **Review library imports**: Use named imports for tree-shakeable libraries
4. **Configure webpack optimization**: Verify usedExports and minimize enabled
5. **Test with examples**: Lodash, date-fns, icon libraries
6. **Analyze results**: Bundle analyzer shows only used functions
7. **Document guidelines**: Create import pattern guide for team

### Requirements
| Requirement | Implementation |
|-------------|---------------|
| ES modules | import/export syntax |
| sideEffects | false or array of CSS files |
| Production mode | NODE_ENV=production |
| Named imports | import { fn } from 'lib' |

### Import Patterns
| Bad | Good | Savings |
|-----|------|---------|
| import _ from 'lodash' | import { debounce } from 'lodash' | ~70 KB |
| import * as icons from '@mui/icons' | import CloseIcon from '@mui/icons/Close' | ~500 KB |

### sideEffects Config
```
package.json:
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.ts"
  ]
}
```

### Expected Outcome
ES modules throughout, sideEffects configured, unused code eliminated, significant bundle reduction.

### Verification
- [ ] All imports use ES6 syntax
- [ ] sideEffects configured
- [ ] Named imports for libraries
- [ ] Bundle shows only used code
- [ ] Size reduction documented

---

## Summary

Implemented bundle analysis, dynamic imports for modals/galleries/charts/editors, route splitting, vendor/common chunking, and tree shaking. Initial bundle sizes reduced by ~60%, heavy components lazy loaded, caching optimized.

### Completed Tasks
1. ✓ Bundle analyzer setup and baseline
2. ✓ Dynamic import helper with presets
3. ✓ Lazy modals (~200 KB saved initially)
4. ✓ Lazy galleries with SEO consideration
5. ✓ Lazy charts (~180 KB saved initially)
6. ✓ Lazy rich text editors (~245 KB saved initially)
7. ✓ Route-based splitting verified
8. ✓ Vendor chunking for caching
9. ✓ Common chunk extraction
10. ✓ Tree shaking configuration

### Next Steps
Proceed to [02_Tasks-47-52_Packages-Build-Verify.md](02_Tasks-47-52_Packages-Build-Verify.md) for module aliases, package optimization, build analysis, and verification.
