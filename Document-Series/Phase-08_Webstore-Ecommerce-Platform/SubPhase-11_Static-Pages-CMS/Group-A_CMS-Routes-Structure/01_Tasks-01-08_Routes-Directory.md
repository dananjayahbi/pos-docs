# Tasks 01-08: Routes and Directory Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 11 - Static Pages & CMS  
> **Group:** A - CMS Routes & Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Types-Layout-Verify.md](02_Tasks-09-16_Types-Layout-Verify.md)

---

## Document Overview

This document covers the creation of the CMS route structure and directory setup for the webstore. It establishes the foundational routing architecture for static pages, dynamic CMS content, and blog functionality using Next.js App Router patterns with proper directory organization and route structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Pages Directory | Low | 15 min |
| 02 | Create Dynamic Page Route | Medium | 30 min |
| 03 | Create About Route | Low | 15 min |
| 04 | Create Contact Route | Low | 15 min |
| 05 | Create FAQ Route | Low | 15 min |
| 06 | Create Blog Directory | Low | 20 min |
| 07 | Create Blog List Route | Low | 20 min |
| 08 | Create Blog Detail Route | Medium | 25 min |

---

## Task 01: Create Pages Directory

### Overview
Create the pages directory structure within the storefront route group. This establishes the foundation for CMS pages, static pages, and blog content using Next.js App Router conventions. The directory structure separates different types of content while maintaining clean URL patterns.

### Dependencies
- SubPhase-10 (Theme Engine) must be complete
- Next.js App Router structure is established
- Frontend project is initialized

### Instructions

1. **Navigate to the storefront app directory**
   - Go to `frontend/app/(storefront)/` directory
   - This is the main storefront route group
   - All webstore pages will be organized here

2. **Create CMS pages structure**
   - Understand the pages will be organized by content type
   - Static pages (About, Contact, FAQ) get dedicated directories
   - Dynamic pages use [slug] pattern for CMS content
   - Blog content gets separate directory structure

3. **Plan directory organization**
   - Each static page gets its own directory with page.tsx
   - Dynamic CMS pages use [slug]/page.tsx pattern
   - Blog directory contains both list and detail routes
   - Maintain clean URL structure without nested prefixes

4. **Verify routing patterns**
   - Confirm `app/(storefront)/about/page.tsx` → `/about`
   - Confirm `app/(storefront)/[slug]/page.tsx` → `/[slug]`
   - Confirm `app/(storefront)/blog/page.tsx` → `/blog`
   - Ensure no URL conflicts between routes

### Directory Purpose

| Directory | Purpose | URL Pattern |
|-----------|---------|-------------|
| (storefront) | Route group for all webstore pages | No URL prefix |
| [slug] | Dynamic CMS pages | `/page-slug` |
| about | Static about page | `/about` |
| contact | Static contact page | `/contact` |
| faq | Static FAQ page | `/faq` |
| blog | Blog functionality | `/blog` |

### Route Group Benefits

| Feature | Benefit |
|---------|---------|
| Organization | Logical grouping of storefront pages |
| Layout Sharing | Common layout for all storefront pages |
| Clean URLs | No route group prefix in URLs |
| Separation | Isolated from admin/dashboard routes |

### Expected Directory Structure
```
frontend/app/
├── (storefront)/           # Storefront route group
│   ├── layout.tsx         # Storefront layout (from SubPhase-10)
│   ├── about/             # (Created in Task 03)
│   ├── contact/           # (Created in Task 04)
│   ├── faq/               # (Created in Task 05)
│   ├── blog/              # (Created in Task 06)
│   └── [slug]/            # (Created in Task 02)
└── (admin)/               # Admin route group (separate)
```

### Expected Outcome
- Proper directory structure foundation for CMS pages
- Clear separation between static and dynamic content
- Foundation for Next.js App Router implementation
- Organized structure for future page development

### Verification Checklist
- [ ] `frontend/app/(storefront)/` directory structure reviewed
- [ ] Understanding of route patterns confirmed
- [ ] Directory naming conventions understood
- [ ] URL mapping patterns verified

---

## Task 02: Create Dynamic Page Route

### Overview
Create the dynamic page route that handles all CMS-managed pages using the [slug] pattern. This route dynamically loads page content based on the URL slug, fetches data from the CMS API, and renders pages using a shared page layout component.

### Dependencies
- Task 01: Create Pages Directory

### Instructions

1. **Create the [slug] directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `[slug]` (including square brackets)
   - The brackets indicate this is a dynamic route parameter
   - This captures any URL that doesn't match static routes

2. **Create the dynamic page component**
   - Create `page.tsx` file inside `[slug]` directory
   - Set up TypeScript React page component structure
   - Export default async function for server-side rendering

3. **Define page component props**
   - Accept `params` prop with slug parameter
   - Define TypeScript interface for params: `{ slug: string }`
   - Use params to extract the slug value for API calls

4. **Implement page data fetching**
   - Use async/await for server-side data fetching
   - Call page API service to fetch page by slug
   - Handle cases where page is not found (404)
   - Include error handling for API failures

5. **Set up page metadata generation**
   - Export `generateMetadata` function for dynamic SEO
   - Use page data to set title, description, and meta tags
   - Include Open Graph and Twitter card metadata
   - Handle metadata for pages that don't exist

6. **Implement page rendering logic**
   - Render page title, content, and metadata
   - Use page layout component for consistent styling
   - Handle different content types (HTML, markdown, blocks)
   - Display publish date and last modified information

7. **Add 404 handling**
   - Return `notFound()` for pages that don't exist
   - Ensure proper HTTP status codes
   - Provide meaningful error messages

### Dynamic Route Behavior

| URL | File Path | Params |
|-----|-----------|--------|
| `/privacy-policy` | `app/(storefront)/[slug]/page.tsx` | `{ slug: "privacy-policy" }` |
| `/terms-of-service` | `app/(storefront)/[slug]/page.tsx` | `{ slug: "terms-of-service" }` |
| `/company-history` | `app/(storefront)/[slug]/page.tsx` | `{ slug: "company-history" }` |

### Page Component Structure

```
Dynamic Page Component
├── Params Extraction
├── Data Fetching (async)
├── Error Handling
├── Metadata Generation
├── Page Layout Wrapper
├── Content Rendering
└── 404 Handling
```

### Data Flow Diagram

```
URL Request (/privacy-policy)
        │
        ▼
[slug]/page.tsx
        │
        ├── Extract slug: "privacy-policy"
        │
        ▼
API Service Call
        │
        ├── Found: Render page
        │
        └── Not Found: Return 404
```

### SEO Metadata Fields

| Field | Source | Purpose |
|-------|--------|---------|
| title | page.title + site name | Browser title bar |
| description | page.seo.description | Search results snippet |
| keywords | page.seo.keywords | Search engine indexing |
| og:image | page.seo.image | Social media sharing |
| canonical | Current URL | Prevent duplicate content |

### Content Rendering Options

| Content Type | Handling Method |
|--------------|----------------|
| Plain Text | Direct rendering with formatting |
| HTML | dangerouslySetInnerHTML (sanitized) |
| Markdown | Convert to HTML then render |
| Block Content | Component-based rendering |

### Expected Outcome
- Functional dynamic route for CMS pages
- Proper SEO metadata generation
- Error handling for missing pages
- Server-side rendering for performance

### Verification Checklist
- [ ] `frontend/app/(storefront)/[slug]/page.tsx` file created
- [ ] Dynamic route accepts slug parameter correctly
- [ ] Async data fetching implemented
- [ ] Metadata generation configured
- [ ] 404 handling for missing pages
- [ ] TypeScript types properly defined

---

## Task 03: Create About Route

### Overview
Create the dedicated About page route that provides information about the business, company history, mission, values, and team. This static route uses a consistent layout and integrates with the CMS for content management while maintaining a dedicated URL structure.

### Dependencies
- Task 01: Create Pages Directory

### Instructions

1. **Create about directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `about`
   - This creates the `/about` URL path

2. **Create about page component**
   - Create `page.tsx` file inside `about` directory
   - Set up TypeScript React page component structure
   - Export default async function for server-side rendering

3. **Define page metadata**
   - Export metadata object for SEO optimization
   - Set title to "About Us | [Store Name]"
   - Include description highlighting company values
   - Add relevant keywords for local SEO

4. **Implement content structure**
   - Create sections for company story, mission, values
   - Add team member showcase area
   - Include business milestones and achievements
   - Add contact information and business hours

5. **Integrate with CMS API**
   - Fetch about page content from CMS if editable
   - Allow for dynamic content updates through admin
   - Include fallback static content if CMS unavailable
   - Handle content versioning and draft states

6. **Add structured data markup**
   - Include JSON-LD for organization information
   - Add business address and contact details
   - Include business hours and services offered
   - Optimize for local search results

7. **Implement responsive design**
   - Ensure mobile-first responsive layout
   - Optimize images for different screen sizes
   - Test readability across device types
   - Maintain brand consistency with overall design

### Page Content Sections

| Section | Purpose | Content Type |
|---------|---------|--------------|
| Hero | Company introduction | Title, tagline, hero image |
| Story | Company history | Narrative text, timeline |
| Mission | Purpose and values | Mission statement, values list |
| Team | Key personnel | Photos, bios, roles |
| Achievements | Business milestones | Statistics, awards, certifications |
| Contact | Business information | Address, hours, phone, email |

### SEO Optimization Elements

| Element | Implementation |
|---------|----------------|
| Title Tag | "About [Business Name] - [Key Value Prop]" |
| Meta Description | Compelling summary under 160 characters |
| Headings | H1, H2, H3 hierarchy with keywords |
| Alt Text | Descriptive alt text for all images |
| Internal Links | Links to other relevant pages |
| Schema Markup | Organization and LocalBusiness markup |

### Content Management Integration

| Feature | Implementation |
|---------|----------------|
| Editable Content | CMS-managed text sections |
| Image Management | CDN-optimized images |
| Team Members | Dynamic team roster |
| Business Info | Centralized contact details |
| SEO Fields | Manageable meta tags |
| Content Versioning | Draft and published states |

### Local SEO Considerations

| Factor | Implementation |
|--------|----------------|
| NAP Consistency | Name, Address, Phone alignment |
| Local Keywords | Sri Lankan location terms |
| Business Hours | Structured markup |
| Service Areas | Geographic coverage |
| Contact Methods | Multiple contact options |
| Local Testimonials | Customer reviews integration |

### Page Layout Structure

```
About Page Layout
├── Page Header (breadcrumbs, title)
├── Hero Section (intro, image)
├── Company Story Section
├── Mission & Values Section
├── Team Members Grid
├── Achievements & Stats
├── Contact Information
└── Page Footer
```

### Expected Outcome
- Dedicated About page with comprehensive business information
- SEO-optimized content and metadata
- CMS integration for content management
- Responsive design across all devices

### Verification Checklist
- [ ] `frontend/app/(storefront)/about/page.tsx` file created
- [ ] Page metadata configured for SEO
- [ ] Content sections implemented
- [ ] CMS integration established
- [ ] Responsive design verified
- [ ] Local SEO elements included

---

## Task 04: Create Contact Route

### Overview
Create the dedicated Contact page route that provides multiple ways for customers to reach the business. This page includes contact information, business hours, location map, contact forms, and integrates with the CMS for easy information updates.

### Dependencies
- Task 01: Create Pages Directory

### Instructions

1. **Create contact directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `contact`
   - This creates the `/contact` URL path

2. **Create contact page component**
   - Create `page.tsx` file inside `contact` directory
   - Set up TypeScript React page component structure
   - Export default async function for server-side rendering

3. **Define contact metadata**
   - Export metadata object for local SEO
   - Set title to "Contact Us | [Store Name]"
   - Include description with contact methods
   - Add local business keywords and location terms

4. **Implement contact information sections**
   - Display primary phone number and WhatsApp
   - Show email addresses for different departments
   - Include physical address with postal code
   - Add business hours for different days

5. **Integrate location and directions**
   - Embed Google Maps or similar mapping service
   - Provide written directions and landmarks
   - Include public transportation options
   - Add parking information if applicable

6. **Add contact form integration**
   - Create form for general inquiries
   - Include fields for name, email, subject, message
   - Implement form validation and submission
   - Connect to email service or CMS backend

7. **Include social media links**
   - Display links to Facebook, Instagram, LinkedIn
   - Add WhatsApp Business chat integration
   - Include review platform links (Google, Facebook)
   - Show social media icons consistently

8. **Implement structured data**
   - Add LocalBusiness schema markup
   - Include ContactPoint structured data
   - Add PostalAddress information
   - Include OpeningHours specification

### Contact Information Sections

| Section | Content Type | Purpose |
|---------|--------------|---------|
| Quick Contact | Phone, email, WhatsApp | Immediate contact options |
| Business Address | Full postal address | Physical location |
| Business Hours | Operating schedule | Visit planning |
| Departments | Specialized contacts | Targeted inquiries |
| Location Map | Interactive map | Visual location guide |
| Contact Form | Inquiry form | Formal communication |

### Sri Lankan Contact Conventions

| Contact Type | Format | Example |
|--------------|--------|---------|
| Phone | +94 XX XXX XXXX | +94 11 234 5678 |
| Mobile | +94 7X XXX XXXX | +94 76 123 4567 |
| WhatsApp | Same as mobile | +94 76 123 4567 |
| Address | Local format | 123 Main Street, Colombo 03 |
| Postal Code | 5 digits | 00300 |
| Email | Professional domain | info@businessname.lk |

### Contact Form Fields

| Field | Type | Validation | Purpose |
|-------|------|------------|---------|
| Name | Text | Required, 2+ chars | Personalization |
| Email | Email | Required, valid format | Response method |
| Phone | Tel | Optional, +94 format | Alternative contact |
| Subject | Select/Text | Required | Inquiry categorization |
| Message | Textarea | Required, 10+ chars | Main inquiry |
| Preferred Contact | Radio | Required | Response preference |

### Map Integration Options

| Service | Pros | Cons |
|---------|------|------|
| Google Maps | Comprehensive, familiar | API costs, dependencies |
| OpenStreetMap | Free, customizable | Less detailed locally |
| Static Image | Fast, no API costs | Not interactive |
| Custom Solution | Full control | Development overhead |

### Response Time Expectations

| Contact Method | Expected Response | Display to Users |
|---------------|-------------------|------------------|
| Phone Call | During business hours | "Available 9 AM - 6 PM" |
| WhatsApp | Within 2-4 hours | "We reply within 4 hours" |
| Email | Within 24 hours | "We reply within 1 business day" |
| Contact Form | Within 24 hours | "We'll respond within 24 hours" |

### Local SEO Elements

| Element | Implementation |
|---------|----------------|
| NAP Consistency | Exact match across platforms |
| Local Phone Format | +94 country code |
| Sri Lankan Address | Complete with postal code |
| Local Languages | English, Sinhala options |
| Operating Hours | Local timezone specification |
| Service Area | Geographic coverage details |

### Expected Outcome
- Comprehensive contact page with multiple contact options
- Local SEO optimization for Sri Lankan market
- Interactive map and contact form integration
- Mobile-responsive design for all contact methods

### Verification Checklist
- [ ] `frontend/app/(storefront)/contact/page.tsx` file created
- [ ] All contact information sections implemented
- [ ] Contact form created and functional
- [ ] Map integration completed
- [ ] Local SEO elements added
- [ ] Sri Lankan contact formats used
- [ ] Structured data markup included

---

## Task 05: Create FAQ Route

### Overview
Create the dedicated FAQ (Frequently Asked Questions) page route that provides answers to common customer inquiries. This page uses an organized, searchable format with categories, collapsible sections, and integrates with the CMS for easy content management and updates.

### Dependencies
- Task 01: Create Pages Directory

### Instructions

1. **Create faq directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `faq`
   - This creates the `/faq` URL path

2. **Create FAQ page component**
   - Create `page.tsx` file inside `faq` directory
   - Set up TypeScript React page component structure
   - Export default async function for server-side rendering

3. **Define FAQ metadata**
   - Export metadata object for SEO optimization
   - Set title to "Frequently Asked Questions | [Store Name]"
   - Include description highlighting common inquiries
   - Add FAQ-related keywords for search engines

4. **Implement FAQ categorization**
   - Organize questions by categories (orders, shipping, returns, etc.)
   - Create category navigation for easy browsing
   - Allow filtering by category or viewing all questions
   - Maintain logical grouping of related questions

5. **Create search functionality**
   - Add search bar for finding specific questions
   - Implement client-side search through FAQ content
   - Highlight matching terms in search results
   - Provide search suggestions or autocomplete

6. **Implement collapsible FAQ sections**
   - Use accordion or collapsible components
   - Show question titles with expand/collapse functionality
   - Allow multiple sections open simultaneously
   - Include smooth animations for better UX

7. **Add structured data markup**
   - Include FAQ schema markup for rich snippets
   - Structure questions and answers for search engines
   - Improve visibility in search results
   - Enable featured snippet opportunities

8. **Integrate with CMS backend**
   - Fetch FAQ content from CMS API
   - Allow admin users to add, edit, delete FAQs
   - Support draft and published states
   - Enable FAQ ordering and categorization

### FAQ Categories

| Category | Typical Questions | Target Audience |
|----------|-------------------|-----------------|
| Orders | How to place orders, payment methods | New customers |
| Shipping | Delivery times, areas, costs | All customers |
| Returns | Return policy, exchange process | Post-purchase |
| Products | Specifications, availability | Browsing customers |
| Account | Registration, login issues | Registered users |
| Technical | Website issues, app problems | All users |

### FAQ Structure Design

```
FAQ Page Layout
├── Page Header (title, description)
├── Search Bar (filter questions)
├── Category Filters (tabs/buttons)
├── FAQ Sections
│   ├── Category 1 (e.g., Orders)
│   │   ├── Question 1 (collapsible)
│   │   ├── Question 2 (collapsible)
│   │   └── Question 3 (collapsible)
│   ├── Category 2 (e.g., Shipping)
│   └── Category 3 (e.g., Returns)
└── Contact Section (can't find answer)
```

### Search Implementation Options

| Approach | Complexity | Performance | Features |
|----------|------------|-------------|----------|
| Client-side Filter | Low | Good | Basic text matching |
| Full-text Search | Medium | Excellent | Advanced matching |
| Search API | High | Excellent | Analytics, suggestions |
| Hybrid | Medium | Good | Best of both worlds |

### Schema Markup Structure

| Schema Type | Properties |
|-------------|------------|
| FAQPage | mainEntity (array of Questions) |
| Question | name (question text) |
| Answer | text (answer content) |
| Organization | Publisher information |

### CMS Integration Features

| Feature | Benefit |
|---------|---------|
| WYSIWYG Editor | Easy content formatting |
| Category Management | Organized question groups |
| Search Analytics | Popular search terms |
| A/B Testing | Optimize question wording |
| Auto-translation | Multi-language support |
| Analytics | Most viewed questions |

### Mobile UX Considerations

| Aspect | Implementation |
|--------|----------------|
| Touch Targets | Large, easy-to-tap areas |
| Scroll Performance | Virtualized long lists |
| Search UX | Prominent, accessible search |
| Category Nav | Horizontal scrollable tabs |
| Readability | Proper font sizes, contrast |
| Loading | Progressive content loading |

### SEO Optimization

| Element | Implementation |
|---------|----------------|
| Title Tags | Question-based titles |
| Meta Descriptions | Summary of answers |
| Header Structure | H1 page title, H2 categories, H3 questions |
| Internal Linking | Links to relevant pages |
| Content Quality | Comprehensive, helpful answers |
| Update Frequency | Regular content reviews |

### Expected Outcome
- Well-organized FAQ page with categorized questions
- Search functionality for finding specific answers
- SEO-optimized with structured data markup
- CMS integration for easy content management

### Verification Checklist
- [ ] `frontend/app/(storefront)/faq/page.tsx` file created
- [ ] FAQ categories and organization implemented
- [ ] Search functionality added
- [ ] Collapsible sections created
- [ ] Schema markup included
- [ ] CMS integration established
- [ ] Mobile-responsive design verified

---

## Task 06: Create Blog Directory

### Overview
Create the blog directory structure that will house both the blog listing page and individual blog post pages. This establishes the foundation for the blog system with proper Next.js App Router patterns, SEO optimization, and content organization for the webstore's content marketing strategy.

### Dependencies
- Task 01: Create Pages Directory

### Instructions

1. **Create blog directory**
   - Navigate to `frontend/app/(storefront)/` directory
   - Create new directory named `blog`
   - This creates the `/blog` URL path
   - This directory will contain both list and detail routes

2. **Plan blog URL structure**
   - Main blog page: `/blog` (shows all posts)
   - Individual posts: `/blog/[slug]` (specific post)
   - Category pages: `/blog/category/[category]` (optional)
   - Tag pages: `/blog/tag/[tag]` (optional)
   - Archive pages: `/blog/[year]/[month]` (optional)

3. **Understand blog content structure**
   - Blog posts will be managed through CMS
   - Posts include title, content, excerpt, featured image
   - Posts have categories, tags, and publish dates
   - Posts support draft and published states

4. **Plan blog SEO structure**
   - Individual posts get optimized meta tags
   - Blog listing includes pagination for SEO
   - Category and tag pages for content organization
   - XML sitemap integration for blog posts

5. **Design blog content flow**
   - Homepage → Blog listing → Individual posts
   - Related posts suggestions on individual posts
   - Category/tag filtering on listing page
   - Search functionality across blog content

6. **Consider blog features**
   - Comment system integration (optional)
   - Social sharing buttons
   - Reading time estimates
   - Author bio sections
   - Newsletter signup integration

### Blog Directory Structure

```
frontend/app/(storefront)/blog/
├── page.tsx              # Blog listing (Task 07)
├── [slug]/              
│   └── page.tsx          # Individual blog post (Task 08)
├── category/             # (Future: category pages)
│   └── [category]/
│       └── page.tsx
└── tag/                  # (Future: tag pages)
    └── [tag]/
        └── page.tsx
```

### Blog URL Patterns

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Blog Home | `/blog` | `/blog` |
| Blog Post | `/blog/[slug]` | `/blog/getting-started-with-our-service` |
| Category | `/blog/category/[category]` | `/blog/category/tutorials` |
| Tag | `/blog/tag/[tag]` | `/blog/tag/beginner` |
| Archive | `/blog/[year]/[month]` | `/blog/2024/03` |

### Blog Content Types

| Content Type | Purpose | SEO Benefit |
|--------------|---------|-------------|
| How-to Guides | Educational content | Long-tail keywords |
| Product Updates | Feature announcements | Product awareness |
| Industry News | Thought leadership | Authority building |
| Customer Stories | Social proof | Trust building |
| Tips & Tricks | Value-added content | User engagement |
| Company News | Brand awareness | Brand building |

### Blog Metadata Structure

| Field | Purpose | Example |
|-------|---------|---------|
| Title | SEO and display | "Complete Guide to Online Shopping" |
| Slug | URL friendly | "complete-guide-online-shopping" |
| Excerpt | Meta description | "Learn everything about safe online shopping..." |
| Featured Image | Social sharing | "blog-featured-image.jpg" |
| Category | Content organization | "Guides", "News", "Updates" |
| Tags | Content filtering | ["shopping", "guide", "tips"] |
| Author | Content attribution | "John Doe" |
| Publish Date | Content freshness | "2024-03-15" |

### Blog SEO Strategy

| SEO Element | Implementation |
|-------------|----------------|
| Title Optimization | Keyword-rich, under 60 characters |
| Meta Descriptions | Compelling, under 160 characters |
| Header Structure | H1 title, H2/H3 subheadings |
| Internal Linking | Links to related posts and pages |
| Image Optimization | Alt text, compressed images |
| Schema Markup | Article structured data |
| Canonical URLs | Prevent duplicate content |
| XML Sitemaps | Include all published posts |

### Content Management Integration

| Feature | Implementation |
|---------|----------------|
| Rich Text Editor | WYSIWYG content creation |
| Image Management | Upload, resize, optimize |
| SEO Fields | Custom title, description |
| Publishing Workflow | Draft → Review → Published |
| Content Scheduling | Publish at specific times |
| Analytics Integration | Track post performance |

### Expected Blog Features

| Feature | Description |
|---------|-------------|
| Pagination | Navigate through multiple pages |
| Search | Find specific blog content |
| Filtering | Filter by category, tag, date |
| Sorting | Sort by date, popularity, title |
| Related Posts | Show similar content |
| Social Sharing | Share on social platforms |

### Expected Outcome
- Proper blog directory structure established
- Foundation for blog listing and detail pages
- SEO-optimized URL patterns planned
- Content management integration prepared

### Verification Checklist
- [ ] `frontend/app/(storefront)/blog/` directory created
- [ ] Blog URL structure planned
- [ ] SEO considerations documented
- [ ] Content management approach defined
- [ ] Future feature expansion considered
- [ ] Directory structure follows Next.js conventions

---

## Task 07: Create Blog List Route

### Overview
Create the main blog listing page that displays all published blog posts in a paginated, searchable format. This page serves as the hub for all blog content, featuring post previews, filtering options, search functionality, and SEO optimization to drive organic traffic to the blog section.

### Dependencies
- Task 06: Create Blog Directory

### Instructions

1. **Create blog listing page**
   - Navigate to `frontend/app/(storefront)/blog/` directory
   - Create `page.tsx` file for the main blog listing
   - Set up TypeScript React page component structure
   - Export default async function for server-side rendering

2. **Define blog listing metadata**
   - Export metadata object for blog SEO
   - Set title to "Blog | [Store Name]"
   - Include description highlighting blog content
   - Add blog-related keywords and topics

3. **Implement post fetching logic**
   - Fetch published blog posts from CMS API
   - Handle pagination for large numbers of posts
   - Support filtering by category, tag, and date
   - Include search functionality across post content

4. **Create post preview components**
   - Display post title, excerpt, featured image
   - Show publish date, author, and reading time
   - Include category and tag information
   - Add "Read More" call-to-action buttons

5. **Implement listing layout options**
   - Grid layout for visual appeal
   - List layout for detailed information
   - Card-based design for post previews
   - Responsive layout for mobile devices

6. **Add filtering and search features**
   - Category filter dropdown or buttons
   - Tag cloud or tag filter options
   - Date range filtering capabilities
   - Full-text search across titles and content

7. **Implement pagination system**
   - Show limited posts per page (8-12 posts)
   - Add next/previous navigation
   - Include page numbers for direct navigation
   - Maintain filters and search across pages

8. **Add SEO and social features**
   - Generate meta tags for the blog index
   - Include Open Graph tags for social sharing
   - Add JSON-LD structured data for blog
   - Implement canonical URLs and pagination tags

### Blog Listing Layout Options

| Layout Type | Description | Best For |
|-------------|-------------|----------|
| Grid (3-column) | Visual card-based layout | Image-heavy blogs |
| Grid (2-column) | Balanced text and visuals | General content |
| List View | Detailed linear layout | Text-focused content |
| Magazine Style | Mixed layouts, featured posts | Diverse content types |
| Masonry | Pinterest-style varied heights | Visual content |

### Post Preview Components

| Element | Purpose | Information Displayed |
|---------|---------|----------------------|
| Featured Image | Visual appeal | Optimized thumbnail |
| Title | Post identification | SEO-optimized title |
| Excerpt | Content preview | First 150-200 characters |
| Meta Info | Post details | Date, author, category |
| Tags | Content classification | Relevant topic tags |
| Read More | Call-to-action | Link to full post |

### Filtering Options

| Filter Type | Options | Implementation |
|-------------|---------|----------------|
| Category | All, Guides, News, Updates | Dropdown or button group |
| Tags | Popular tags | Tag cloud or checkboxes |
| Date | Last week, month, year | Date range picker |
| Author | Post authors | Author dropdown |
| Sort | Newest, oldest, popular | Sort dropdown |

### Pagination Implementation

| Feature | Description |
|---------|-------------|
| Posts Per Page | 9-12 posts for optimal loading |
| Navigation | Previous, Next, page numbers |
| URL Structure | `/blog?page=2&category=guides` |
| SEO Tags | rel="prev" and rel="next" |
| Load More | Optional infinite scroll |
| Performance | Lazy loading for images |

### Search Functionality

| Feature | Implementation |
|---------|----------------|
| Search Input | Prominent search bar |
| Search Scope | Title, excerpt, content, tags |
| Search Results | Highlighted matches |
| No Results | Helpful suggestions |
| Search Analytics | Track popular searches |
| Auto-suggestions | Predictive search |

### Mobile Optimization

| Aspect | Implementation |
|--------|----------------|
| Layout | Single column on mobile |
| Images | Responsive, lazy-loaded |
| Filters | Collapsible filter menu |
| Pagination | Touch-friendly controls |
| Search | Expandable search bar |
| Performance | Optimized for mobile networks |

### SEO Optimization

| Element | Implementation |
|---------|----------------|
| Title Tag | "Blog - Latest Posts | [Store Name]" |
| Meta Description | Summary of blog content and topics |
| Canonical URL | `/blog` (main listing page) |
| Pagination Tags | rel="prev" and rel="next" |
| Structured Data | Blog and BlogPosting schema |
| XML Sitemap | Include all blog pages |

### Expected Blog Listing Features

```
Blog Listing Page
├── Page Header (title, description)
├── Search Bar (find specific posts)
├── Filter Options (category, tags, date)
├── Sort Options (newest, oldest, popular)
├── Post Grid/List
│   ├── Post Preview Cards
│   │   ├── Featured Image
│   │   ├── Title & Excerpt
│   │   ├── Meta Information
│   │   └── Read More Button
│   └── Load More/Pagination
└── Sidebar (optional)
    ├── Categories Widget
    ├── Popular Posts
    ├── Tag Cloud
    └── Newsletter Signup
```

### Expected Outcome
- Comprehensive blog listing page with post previews
- Filtering, search, and pagination functionality
- SEO-optimized for organic traffic
- Mobile-responsive design for all devices

### Verification Checklist
- [ ] `frontend/app/(storefront)/blog/page.tsx` file created
- [ ] Post fetching and display logic implemented
- [ ] Filtering and search features added
- [ ] Pagination system configured
- [ ] SEO metadata and structured data included
- [ ] Mobile-responsive design verified
- [ ] Performance optimization considered

---

## Task 08: Create Blog Detail Route

### Overview
Create the individual blog post page using the [slug] dynamic route pattern. This page displays full blog post content, optimized for reading experience, SEO, and social sharing. It includes related posts, author information, and engagement features to maximize user interaction and time on site.

### Dependencies
- Task 06: Create Blog Directory

### Instructions

1. **Create blog detail directory**
   - Navigate to `frontend/app/(storefront)/blog/` directory
   - Create new directory named `[slug]` (including square brackets)
   - The brackets indicate this captures the blog post slug parameter

2. **Create blog detail page component**
   - Create `page.tsx` file inside `[slug]` directory
   - Set up TypeScript React page component structure
   - Export default async function for server-side rendering

3. **Define dynamic route parameters**
   - Accept `params` prop with slug parameter
   - Define TypeScript interface: `{ params: { slug: string } }`
   - Use slug to fetch specific blog post content
   - Handle URL validation and invalid slug scenarios

4. **Implement post data fetching**
   - Use async/await for server-side data fetching
   - Call blog API service to fetch post by slug
   - Include related posts and author information
   - Handle cases where post is not found (404)

5. **Create dynamic metadata generation**
   - Export `generateMetadata` function for SEO
   - Use post data for title, description, and image
   - Include Open Graph and Twitter card meta tags
   - Set canonical URL and structured data

6. **Design blog post layout**
   - Create header with title, author, date, reading time
   - Implement main content area with proper typography
   - Add featured image with proper optimization
   - Include category/tag display and navigation

7. **Add engagement features**
   - Social sharing buttons (Facebook, Twitter, LinkedIn)
   - Related posts section at bottom
   - Author bio and other posts by author
   - Comments section integration (if enabled)

8. **Implement reading experience optimization**
   - Proper typography hierarchy with good readability
   - Table of contents for long posts (optional)
   - Progress indicator for reading position
   - Print-friendly styles for content

### Blog Post URL Structure

| URL Pattern | Example | Component File |
|-------------|---------|----------------|
| `/blog/[slug]` | `/blog/complete-guide-online-shopping` | `blog/[slug]/page.tsx` |
| `/blog/[slug]` | `/blog/new-features-update-march-2024` | `blog/[slug]/page.tsx` |
| `/blog/[slug]` | `/blog/customer-success-story-jane-doe` | `blog/[slug]/page.tsx` |

### Blog Post Content Structure

```
Blog Post Page Layout
├── Article Header
│   ├── Category Badge
│   ├── Post Title (H1)
│   ├── Post Meta (author, date, reading time)
│   └── Featured Image
├── Article Content
│   ├── Post Body (formatted content)
│   ├── Images and Media
│   ├── Headings and Subheadings
│   └── Call-to-Action Sections
├── Article Footer
│   ├── Tags
│   ├── Social Sharing
│   └── Author Bio
├── Related Posts Section
└── Comments Section (optional)
```

### SEO Metadata Fields

| Metadata Field | Source | Example |
|----------------|--------|---------|
| title | post.title + site name | "Complete Shopping Guide | LCC Blog" |
| description | post.excerpt | "Learn everything about safe online shopping..." |
| keywords | post.tags | "shopping, guide, ecommerce, tips" |
| og:title | post.title | "Complete Shopping Guide" |
| og:description | post.excerpt | Post excerpt text |
| og:image | post.featuredImage | "https://example.com/featured.jpg" |
| og:type | "article" | "article" |
| article:author | post.author | "John Doe" |
| article:published_time | post.publishDate | "2024-03-15T10:00:00Z" |

### Structured Data Schema

| Schema Type | Properties |
|-------------|------------|
| Article | headline, author, datePublished, dateModified |
| Person | Author information (name, url, image) |
| Organization | Publisher information |
| ImageObject | Featured image details |
| BreadcrumbList | Navigation breadcrumbs |

### Reading Experience Features

| Feature | Purpose | Implementation |
|---------|---------|----------------|
| Typography | Readability | Proper font sizes, line height |
| Content Width | Optimal reading | Max-width for text content |
| Images | Visual appeal | Responsive, optimized images |
| Headings | Content structure | Clear hierarchy (H1, H2, H3) |
| Links | External resources | Proper styling and behavior |
| Code Blocks | Technical content | Syntax highlighting (if needed) |

### Social Sharing Integration

| Platform | Purpose | Implementation |
|----------|---------|----------------|
| Facebook | Social sharing | Facebook Share API |
| Twitter | Microblogging | Twitter Web Intents |
| LinkedIn | Professional | LinkedIn Share API |
| WhatsApp | Messaging | WhatsApp share URL |
| Email | Direct sharing | mailto: link with subject/body |
| Copy Link | Universal | Clipboard API |

### Related Posts Logic

| Criteria | Priority | Description |
|----------|----------|-------------|
| Same Category | High | Posts in same category |
| Shared Tags | Medium | Posts with common tags |
| Same Author | Medium | Other posts by author |
| Recent Posts | Low | Latest published posts |
| Popular Posts | Medium | Most viewed content |

### Performance Optimization

| Aspect | Implementation |
|--------|----------------|
| Images | Next.js Image optimization |
| Content | Server-side rendering |
| Caching | Static generation where possible |
| Loading | Progressive content loading |
| Mobile | Responsive images and layout |
| SEO | Preloaded critical resources |

### Expected Outcome
- Fully functional blog post pages with dynamic routing
- SEO-optimized with rich metadata and structured data
- Enhanced reading experience with proper typography
- Social sharing and related content features

### Verification Checklist
- [ ] `frontend/app/(storefront)/blog/[slug]/page.tsx` file created
- [ ] Dynamic slug parameter handling implemented
- [ ] Post data fetching and 404 handling configured
- [ ] SEO metadata and structured data added
- [ ] Reading experience optimized
- [ ] Social sharing features implemented
- [ ] Related posts section created
- [ ] Mobile-responsive design verified

---

## Summary

This document has covered the creation of the CMS route structure and directory setup (Tasks 01-08) for the webstore's static pages and content management system. The key accomplishments include:

### Completed Tasks
- **Task 01:** Pages Directory - Established foundational directory structure
- **Task 02:** Dynamic Page Route - Created [slug] pattern for CMS pages  
- **Task 03:** About Route - Dedicated route for company information
- **Task 04:** Contact Route - Contact information and form integration
- **Task 05:** FAQ Route - Searchable, categorized frequently asked questions
- **Task 06:** Blog Directory - Foundation for blog system
- **Task 07:** Blog List Route - Paginated blog listing with filtering
- **Task 08:** Blog Detail Route - Individual blog post pages

### Route Structure Established
```
frontend/app/(storefront)/
├── about/page.tsx           # Company information
├── contact/page.tsx         # Contact details and form
├── faq/page.tsx            # Frequently asked questions
├── blog/
│   ├── page.tsx            # Blog listing
│   └── [slug]/page.tsx     # Individual blog posts
└── [slug]/page.tsx         # Dynamic CMS pages
```

### Key Features Implemented
- Next.js App Router patterns with proper route groups
- SEO optimization with metadata and structured data
- Responsive design for all device types
- CMS integration for content management
- Search and filtering capabilities
- Social sharing and engagement features

### Next Steps
The next document [02_Tasks-09-16_Types-Layout-Verify.md](02_Tasks-09-16_Types-Layout-Verify.md) will cover the creation of TypeScript types, layout components, and verification of the complete CMS routes system.