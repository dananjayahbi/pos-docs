# Tasks 76-82: Reviews Tab & Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** E - Tabs & Reviews  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-75_Tabs-Description-Specs.md](01_Tasks-69-75_Tabs-Description-Specs.md)

---

## Document Overview

This document covers the reviews tab with summary, rating breakdown, review list, review cards, pagination, and write review button. These components allow customers to read existing reviews and submit their own product reviews.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create Reviews Tab | Medium | 35 min |
| 77 | Create Reviews Summary | Low | 25 min |
| 78 | Create Rating Breakdown | Low | 30 min |
| 79 | Create Review List | Low | 25 min |
| 80 | Create Review Card | Low | 30 min |
| 81 | Create Review Pagination | Low | 25 min |
| 82 | Create Write Review Button | Low | 20 min |

---

## Task 76: Create Reviews Tab

### Overview
Create the ReviewsTab component that serves as the main container for customer reviews. This component includes the reviews summary, list of review cards, pagination controls, and write review button using TanStack Query.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 71 | Component | TabPanel container must exist |
| TanStack Query | Library | Install @tanstack/react-query |
| Reviews API | Backend | GET /api/products/{id}/reviews endpoint |

### Instructions

1. **Install TanStack Query and create Reviews directory**
   - Run `npm install @tanstack/react-query`
   - Create `Reviews/` directory in `frontend/components/storefront/product/`
   - Set up QueryClient in app root if not already done

2. **Create ReviewsTab component file**
   - Create `ReviewsTab.tsx` in `Reviews/` directory
   - Define `ReviewsTabProps` interface (productId, className)
   - Define `Review` and `ReviewsData` interfaces

3. **Implement reviews data fetching**
   - Use useQuery hook to fetch reviews data
   - API endpoint: `/api/products/{productId}/reviews`
   - Handle loading, error, and success states

4. **Implement tab panel layout**
   - Use TabPanel component with value="reviews"
   - Create two-column layout: summary (left) and list (right)
   - Stack vertically on mobile

5. **Add component placeholders**
   - ReviewsSummary component (Task 77)
   - ReviewList component (Task 79)
   - WriteReviewButton component (Task 82)
   - ReviewPagination component (Task 81)

6. **Add empty state**
   - Show "No reviews yet" message if no reviews
   - Include WriteReviewButton to encourage first review

### Reviews Tab Layout

```
┌──────────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │ Reviews Summary │  │ Write a Review [Button]      │  │
│  │                 │  └──────────────────────────────┘  │
│  │ ★★★★★ 4.5       │                                    │
│  │ Based on 25     │  ┌──────────────────────────────┐  │
│  │                 │  │ Review Card 1                │  │
│  │ 5★ ████████ 15  │  │ ★★★★★ by John D.             │  │
│  │ 4★ ████ 6       │  │ Great product! Highly...     │  │
│  │ 3★ ██ 3         │  └──────────────────────────────┘  │
│  │ 2★ █ 1          │                                    │
│  │ 1★  0           │  ┌──────────────────────────────┐  │
│  │                 │  │ Review Card 2                │  │
│  └─────────────────┘  │ ★★★★☆ by Sarah M.            │  │
│                       │ Good quality but...          │  │
│                       └──────────────────────────────┘  │
│                                                          │
│                       ← 1 2 3 →  [Pagination]           │
└──────────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| productId | string | Yes | - | Product ID for fetching reviews |
| className | string | No | "" | Additional CSS classes |

### Review Data Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Review unique ID |
| author | string | Reviewer name |
| rating | number | Star rating (1-5) |
| title | string | Review title |
| comment | string | Review text content |
| date | string | ISO date string |
| verified | boolean | Verified purchase badge |

### Layout Structure

| Section | Width (Desktop) | Position (Mobile) | Content |
|---------|-----------------|-------------------|---------|
| Summary | 30% | Top | Average rating, breakdown |
| List | 70% | Below summary | Review cards, pagination |

### Query Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| queryKey | ['reviews', productId, page] | Cache key |
| queryFn | fetchReviews | Fetch function |
| staleTime | 5 minutes | Cache duration |
| refetchOnWindowFocus | false | No auto-refetch |

### Expected Outcome
- Reviews tab displays summary and list
- TanStack Query fetches review data
- Two-column layout on desktop
- Stacked layout on mobile
- Loading and error states handled
- Empty state for no reviews
- Pagination working

### Checklist
- [ ] TanStack Query installed
- [ ] Reviews directory created
- [ ] ReviewsTab.tsx component created
- [ ] Props interface defined (productId, className)
- [ ] Review and ReviewsData interfaces defined
- [ ] useQuery hook implemented for data fetching
- [ ] TabPanel wrapper implemented
- [ ] Two-column layout created
- [ ] Placeholder for ReviewsSummary (Task 77)
- [ ] Placeholder for ReviewList (Task 79)
- [ ] Placeholder for WriteReviewButton (Task 82)
- [ ] Empty state added
- [ ] Loading and error states handled
- [ ] Component exported from index.ts

---

## Task 77: Create Reviews Summary

### Overview
Create the ReviewsSummary component that displays overall review statistics including average rating, total review count, and rating distribution. This component provides a quick overview of product ratings.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 76 | Component | ReviewsTab must exist |
| Rating Display | Component | Star rating display component or icon library |
| Task 78 | Component | RatingBreakdown component (next) |

### Instructions

1. **Create ReviewsSummary component file**
   - Create `ReviewsSummary.tsx` in `Reviews/` directory
   - Define `ReviewsSummaryProps` interface (averageRating, totalReviews, ratingDistribution, className)
   - Define `RatingDistribution` interface (star5, star4, star3, star2, star1)

2. **Implement summary container**
   - Create div with white background, border, rounded corners
   - Apply padding and shadow

3. **Create average rating display**
   - Show large numeric rating (e.g., "4.5")
   - Display star icons for visual rating
   - Use text-4xl or text-5xl font size
   - Center align content

4. **Add total reviews count and breakdown**
   - Display "Based on X reviews" text below rating
   - Add placeholder for RatingBreakdown component (Task 78)
   - Apply responsive styling (full width mobile, fixed width desktop)

### Reviews Summary Layout

```
┌──────────────────────┐
│   Reviews Summary    │
├──────────────────────┤
│                      │
│       4.5            │
│     ★★★★★            │
│                      │
│  Based on 25 reviews │
│                      │
├──────────────────────┤
│  5★ ████████ 15      │
│  4★ ████ 6           │
│  3★ ██ 3             │
│  2★ █ 1              │
│  1★  0               │
└──────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| averageRating | number | Yes | - | Average rating (0-5, decimals) |
| totalReviews | number | Yes | - | Total number of reviews |
| ratingDistribution | RatingDistribution | Yes | - | Count per star level |
| className | string | No | "" | Additional CSS classes |

### Rating Display

| Element | Styling | Purpose |
|---------|---------|---------|
| Rating Number | text-5xl font-bold text-gray-900 | Large average |
| Star Icons | text-yellow-400 text-2xl | Visual rating |
| Count Text | text-sm text-gray-600 | Review count |

### Rating Distribution Type

| Property | Type | Example | Description |
|----------|------|---------|-------------|
| star5 | number | 15 | Count of 5-star reviews |
| star4 | number | 6 | Count of 4-star reviews |
| star3 | number | 3 | Count of 3-star reviews |
| star2 | number | 1 | Count of 2-star reviews |
| star1 | number | 0 | Count of 1-star reviews |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white border border-gray-200 rounded-lg p-6 shadow-sm` | Card styling |
| Rating Number | `text-5xl font-bold text-gray-900 text-center` | Large number |
| Stars | `flex justify-center text-2xl text-yellow-400 my-2` | Star display |
| Count | `text-sm text-gray-600 text-center` | Review count |

### Expected Outcome
- Summary card displays average rating
- Large numeric rating with star icons
- Total review count shown
- Placeholder for rating breakdown
- Clean card design with border and shadow
- Responsive width and padding

### Checklist
- [ ] ReviewsSummary.tsx component created
- [ ] Props interface defined (averageRating, totalReviews, ratingDistribution, className)
- [ ] RatingDistribution interface defined
- [ ] Summary container implemented
- [ ] Average rating display created (large number)
- [ ] Star icons displayed
- [ ] Total reviews count shown
- [ ] Placeholder for RatingBreakdown (Task 78)
- [ ] Responsive styling applied
- [ ] Component exported from index.ts

---

## Task 78: Create Rating Breakdown

### Overview
Create the RatingBreakdown component that displays a visual breakdown of how many reviews exist for each star rating level. This component shows horizontal bars with percentages for 5-star through 1-star ratings, giving users insight into the distribution of ratings.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 77 | Component | ReviewsSummary must exist |
| Rating Distribution | Data | Distribution object from props |

### Instructions

1. **Create RatingBreakdown component file**
   - Create `RatingBreakdown.tsx` in `Reviews/` directory
   - Set up TypeScript React functional component
   - Import star icons

2. **Define component props interface**
   - Create `RatingBreakdownProps` interface
   - Include `distribution` prop (RatingDistribution type)
   - Include optional `className` prop for styling

3. **Calculate total reviews**
   - Sum all star counts from distribution
   - Use for percentage calculations
   - Store in local variable
reviews by star rating level. This component shows horizontal progress bars with percentages for 5-star through 1-star ratings.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 77 | Component | ReviewsSummary must exist |
| Rating Distribution | Data | Distribution object from props |

### Instructions

1. **Create RatingBreakdown component file**
   - Create `RatingBreakdown.tsx` in `Reviews/` directory
   - Define `RatingBreakdownProps` interface (distribution, className)

2. **Calculate total reviews**
   - Sum all star counts from distribution
   - Use for percentage calculations

3. **Create breakdown list container**
   - Use div with space-y-2 for vertical spacing
   - Apply full width styling

4. **Implement all star rows (5★ to 1★)**
   - Map over star levels (5 to 1)
   - Display star label, progress bar, and count
   - Calculate percentage width: (starCount / totalReviews) * 100
   - Minimum width of 2% for visibility

5. **Style progress bars**
   - Background: bg-gray-200, Fill: bg-yellow-400
   - Height: h-2.5, Rounded corners
   - Add optional clickable filter on hover-------|---------|
| Label | 40px | "5★" | Star level |
| Bar Container | flex-1 | Progress bar | Visual representation |
| Count | 40px | "15" | Number of reviews |

### Progress Bar Styling

| Property | Value | Description |
|----------|-------|-------------|
| Background | bg-gray-200 | Empty state |
| Fill | bg-yellow-400 | Filled portion |
| Height | h-2.5 | Bar thickness |
| Border Radius | rounded-full | Rounded ends |

### Percentage Calculation

| Star | Count | Total | Percentage | Width |
|------|-------|-------|------------|-------|
| 5★ | 15 | 25 | 60% | `width: 60%` |
| 4★ | 6 | 25 | 24% | `width: 24%` |
| 3★ | 3 | 25 | 12% | `width: 12%` |
| 2★ | 1 | 25 | 4% | `width: 4%` |
| 1★ | 0 | 25 | 0% | `width: 2%` (min) |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-2 mt-4` | Row spacing |
| Row | `flex items-center gap-2` | Horizontal layout |
| Label | `text-sm font-medium text-gray-700 w-10` | Star label |
| Bar Bg | `flex-1 bg-gray-200 rounded-full h-2.5` | Progress track |
| Bar Fill | `bg-yellow-400 h-2.5 rounded-full transition-all` | Progress fill |
| Count | `text-sm text-gray-600 w-8 text-right` | Review count |

### Expected Outcome
- Five rows showing distribution for each star level
- Horizontal progress bars visualizing percentages
- Review counts displayed for each level
- Responsive bar widths based on distribution
- Clean, readable layout
- Optional clickable rows for filtering

### Checklist
- [ ] RatingBreakdown.tsx component created
- [ ] Props interface defined (distribution, className)
- [ ] Total reviews calculated
- [ ] Breakdown list container created
- [ ] All five star rows implemented (5★ to 1★)
- [ ] Percentage calculations working
- [ ] Progress bars styled with bg and fill colors
- [ ] Review counts displayed
- [ ] Minimum width applied for zero-count bars
- [ ] Responsive styling applied
- [ ] Component exported from index.ts

---

## Task 79: Create Review List

### Overview
Create the ReviewList component that displays a list of customer reviews. This component receives an array of review objects and renders a ReviewCard component for each review. It handles empty states, loading states, and provides a clean layout for the review cards.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 76 | Component | ReviewsTab must exist |
| Review Data | Props | Array of review objects |
| Task 80 | Component | ReviewCard component (next) |

### Instructions

1. **Create ReviewList component file**
   - Create `ReviewList.tsx` in `Reviews/` directory
   - Set up TypeScript React functional component
   - Import ReviewCard component placeholder

2. **Define component props interface**
   - Create `ReviewListProps` interface
   - Include `reviews` prop (array of Review objects)
   - Include optional `isLoading` prop (boolean)
   - Include optional `className` prop for styling

3. **Implement loading state**
   - Check if isLoading is true
   - Display skeleton loader cards
   - Show 3-5 skeleton cards

4. **Implement empty state**
   - Check if reviews array is empty
   - Display "No reviews yet" message
   - Include icon or illustration
   - Add encouraging text

5. **Create list container**
   - Use div with space-y-4 for vertical spacing
   - Apply full width styling
   - Add padding if needed

6. **Map over reviews array**
   - Loop through reviews array
   - Render ReviewCard component for each review (Task 80)
   - Pass review data as props

7. **Add dividers between cards (optional)**
   - Add border-bottom to each card
   - Or use gap spacing instead
   - Ensure clean separation

8. **Implement sort controls (optional)**
   - Add dropdown to sort by date, rating, helpfulness
   - Position above review list
   - Update reviews array when sort changes

### Review List Layoutcustomer reviews. This component receives an array of review objects and renders a ReviewCard component for each review, handling empty and loading states.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 76 | Component | ReviewsTab must exist |
| Review Data | Props | Array of review objects |
| Task 80 | Component | ReviewCard component (next) |

### Instructions

1. **Create ReviewList component file**
   - Create `ReviewList.tsx` in `Reviews/` directory
   - Define `ReviewListProps` interface (reviews, isLoading, className)

2. **Implement loading and empty states**
   - Display skeleton loader cards if isLoading
   - Show "No reviews yet" message if reviews array empty

3. **Create list container and map reviews**
   - Use div with space-y-4 for vertical spacing
   - Map over reviews array
   - Render ReviewCard component for each review (Task 80)

4. **Add optional sort controls**
   - Dropdown to sort by date, rating, helpfulness
   - Position above review listnded-lg h-32` | Loading state |

### Sort Options (Optional)

| Option | Label | Description |
|--------|-------|-------------|
| date_desc | Most Recent | Newest reviews first |
| date_asc | Oldest First | Oldest reviews first |
| rating_desc | Highest Rated | 5-star reviews first |
| rating_asc | Lowest Rated | 1-star reviews first |
| helpful | Most Helpful | By helpfulness votes |

### Expected Outcome
- Review list displays all review cards
- Loading state shows skeletons
- Empty state displays helpful message
- Clean spacing between cards
- ReviewCard component renders for each review
- Optional sort controls working

### Checklist
- [ ] ReviewList.tsx component created
- [ ] Props interface defined (reviews, isLoading, className)
- [ ] Loading state implemented with skeletons
- [ ] Empty state implemented with message
- [ ] List container created with spacing
- [ ] Map over reviews array
- [ ] ReviewCard rendered for each review (Task 80)
- [ ] Optional sort controls added
- [ ] Responsive styling applied
- [ ] Component exported from index.ts

---

## Task 80: Create Review Card

### Overview
Create the ReviewCard component that displays a single customer review. This component shows the reviewer's name, rating, review date, verified purchase badge, review title, review text, and helpful votes. It provides a clean and readable format for individual reviews.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 79 | Component | ReviewList must exist |
| Review Data | Props | Single review object |
| Star Rating | Component | Star icons for rating display |

### Instructions

1. **Create ReviewCard component file**
   - Create `ReviewCard.tsx` in `Reviews/` directory
   - Set up TypeScript React functional component
   - Import star icons and date formatting utilities

2. **Define component props interface**
   - Create `ReviewCardProps` interface
   - Include `review` prop (Review type)
   - Include optional `className` prop for styling

3. **Implement card container**
   - Create div with border and padding
   - Apply rounded corners and shadow
   - Add hover effect (optional)

4. **Create header section**
   - Display star rating (1-5 stars)
   - Show review title in bold
   - Position at top of card

5. **Create metadata section**
   - Display reviewer name
   - Show review date (format: "Jan 15, 2026")
   - Add "Verified Purchase" badge if verified
   - Use smaller font and gray color

6. **Create review text section**
   - Display full review comment
   - Apply paragraph styling with proper line height
   - Limit to 3-4 lines with "Read more" link (optional)

7. **Add helpful votes section (optional)**
   - Display "Was this helpful? Yes (5) No (1)"
   - Add clickable buttons
   - Show vote counts

8. **Implement verified badge**
   - Show green checkmark icon
   - Display "Verified Purchase" text
   - Only if review.verified === true

9. **Format review date**
   - Use date-fns or Intl.DateTimeFormat
   - Format as "MMM DD, YYYY" with reviewer's name, rating, date, verified badge, title, text, and helpful votes.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 79 | Component | ReviewList must exist |
| Review Data | Props | Single review object |
| Star Rating | Component | Star icons for rating display |

### Instructions

1. **Create ReviewCard component file**
   - Create `ReviewCard.tsx` in `Reviews/` directory
   - Define `ReviewCardProps` interface (review, className)

2. **Implement card container**
   - Create div with border, padding, rounded corners, shadow

3. **Create header section**
   - Display star rating and review title in bold

4. **Create metadata section**
   - Display reviewer name and review date (format: "Jan 15, 2026")
   - Add "Verified Purchase" badge if review.verified === true

5. **Create review text section**
   - Display review comment with proper line height
   - Optional: Limit to 3-4 lines with "Read more" link

6. **Add optional helpful votes section**
   - Display "Was this helpful? Yes (5) No (1)"
   - Add clickable buttons |
| Title | `font-medium text-lg text-gray-900 mb-2` | Review headline |
| Metadata | `flex items-center gap-2 text-sm text-gray-600 mb-4` | Author info |
| Comment | `text-gray-700 leading-relaxed mb-4` | Review text |
| Badge | `flex items-center gap-1 text-green-600` | Verified badge |

### Verified Badge

| Element | Display | Color |
|---------|---------|-------|
| Icon | ✓ checkmark | green-600 |
| Text | "Verified Purchase" | green-600 |
| Font | text-sm | - |

### Expected Outcome
- Review card displays all review information
- Star rating shown at top
- Reviewer name, date, and verified badge
- Review title in bold
- Review text with proper formatting
- Optional helpful votes section
- Clean card design with border and padding

### Checklist
- [ ] ReviewCard.tsx component created
- [ ] Props interface defined (review, className)
- [ ] Card container implemented
- [ ] Header section with stars and title
- [ ] Metadata section with author, date, badge
- [ ] Review text section created
- [ ] Verified purchase badge implemented
- [ ] Date formatting working
- [ ] Optional helpful votes section added
- [ ] Responsive styling applied
- [ ] Component exported from index.ts

---

## Task 81: Create Review Pagination

### Overview
Create the ReviewPagination component that allows users to navigate through multiple pages of reviews. This component supports both cursor-based and offset-based pagination, displaying page numbers or next/previous buttons with proper state management.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 79 | Component | ReviewList must exist |
| Pagination Data | Props | Total count, current page, page size |
| TanStack Query | Library | For pagination state management |

### Instructions

1. **Create ReviewPagination component file**
   - Create `ReviewPagination.tsx` in `Reviews/` directory
   - Set up TypeScript React functional component
   - Import pagination icons (arrows)

2. **Define component props interface**
   - Create `ReviewPaginationProps` interface
   - Include `currentPage` prop (number)
   - Include `totalPages` prop (number)
   - Include `onPageChange` prop (function) for page navigation
   - Include optional `type` prop ("offset" | "cursor")

3. **Implement pagination container**
   - Create div with flex layout
   - Center align on mobile
   - Add top margin separator

4. **Create Previous button**
   - Show "Previous" or left arrow icon
   - Disable if currentPage === 1
   - Call onPageChange with currentPage - 1

5. **Create page number buttons**
   - Display numbered buttons (1, 2, 3, ...)
   - Highlight current page
   - Show ellipsis (...) for large page counts
   - Make each page clickable

6. **Implement smart page display**
   - Show first page, last page, current page
   - Show 2 pages before and after current
   - Use ellipsis for hidden pages
   - Example: 1 ... 4 5 6 ... 20

7. **Create Next button**
   - Show "Next" or right arrow icon
   - Disable if currentPage === totalPages
   - Call onPageChange with currentPage + 1

8. **Add cursor-based pagination (optional)**
   - If type === "cursor", show only Next/Previous
   - No page numbers displayed
   - Use hasNextPage and hasPreviousPage props

9. **Implement keyboard navigation**
   - Arrow keys to navigate pages
   - Enter to activate button
   - Tab for focus management

### Pagination Layout

```
┌──────────────────────────────────────────────────────────┐
│              ← 1 2 [3] 4 5 →                             │
└──────────────────────────────────────────────────────────┘

Or with ellipsis:
┌──────────────────────────────────────────────────────────┐
│         ← 1 ... 4 [5] 6 ... 20 →                         │
└──────────────────────────────────────────────────────────┘

Cursor-based:
┌──────────────────────────────────────────────────────────┐
│              ← Previous | Next →                         │
└──────────────────────────────────────────────────────────┘
```

### Component Propsfor navigating multiple pages of reviews. Supports both cursor-based and offset-based pagination with page numbers or next/previous buttons.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 79 | Component | ReviewList must exist |
| Pagination Data | Props | Total count, current page, page size |
| TanStack Query | Library | For pagination state management |

### Instructions

1. **Create ReviewPagination component file**
   - Create `ReviewPagination.tsx` in `Reviews/` directory
   - Define `ReviewPaginationProps` interface (currentPage, totalPages, onPageChange, type, className)

2. **Implement pagination container**
   - Create div with flex layout, center align

3. **Create Previous button**
   - Show "Previous" or left arrow icon
   - Disable if currentPage === 1

4. **Create page number buttons**
   - Display numbered buttons (1, 2, 3, ...)
   - Highlight current page
   - Implement smart page display with ellipsis (1 ... 4 5 6 ... 20)

5. **Create Next button**
   - Show "Next" or right arrow icon
   - Disable if currentPage === totalPages

6. **Add cursor-based pagination option**
   - If type === "cursor", show only Next/Previous
   - Use hasNextPage and hasPreviousPage props (currentPage, totalPages, onPageChange, type, className)
- [ ] Pagination container implemented
- [ ] Previous button created with disabled state
- [ ] Page number buttons implemented
- [ ] Current page highlighted
- [ ] Smart page display with ellipsis
- [ ] Next button created with disabled state
- [ ] Cursor-based pagination option added
- [ ] Responsive styling applied
- [ ] Component exported from index.ts

---

## Task 82: Create Write Review Button

### Overview
Create the WriteReviewButton component that allows customers to submit their own product review. This button opens a modal or navigates to a review form where users can enter their rating, title, and review text. It includes authentication checks and purchase verification.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 76 | Component | ReviewsTab must exist |
| Auth State | Context | User authentication state |
| Modal Component | Component | Modal or drawer for review form |

### Instructions

1. **Create WriteReviewButton component file**
   - Create `WriteReviewButton.tsx` in `Reviews/` directory
   - Set up TypeScript React functional component
   - Import button and icon components

2. **Define component props interface**
   - Create `WriteReviewButtonProps` interface
   - Include `productId` prop (string)
   - Include optional `onReviewSubmit` prop (callback)
   - Include optional `className` prop for styling

3. **Implement button component**
   - Create primary button with "Write a Review" text
   - Add icon (pencil or edit icon)
   - Apply prominent styling

4. **Add authentication check**
   - Check if user is logged in
   - If not logged in, show login prompt or redirect
   - Use auth context or state

5. **Add purchase verification (optional)**
   - Check if user purchased the product
   - Allow non-purchasers to review (or restrict)
   - Show appropriate message

6. **Implement button click handler**
   - Open review modal/drawer
   - Or navigate to review form page
   - Pass productId to form

7. **Create review form modal (placeholder)**
   - Modal with review form fields
   - Rating selector (1-5 stars)
   - Title input field
   - Comment textarea
   - Submit and cancel buttons

8. **Add form validation**
   - Rating is required
   - Title minimum length (e.g., 10 chars)
   - Comment minimum length (e.g., 50 chars)
   - Show validation errors

9. **Implement review submission**
   - POST request to `/api/products/{productId}/reviews`
   - Include rating, title, comment in body
   - Handle success and error responses
   - Show success message and close modal
   - Refresh reviews list

### Write Review Button Layout

```
┌──────────────────────────────────────────────────────────┐
│  [✏️ Write a Review]  ← Primary button                   │
└──────────────────────────────────────────────────────────┘

Modal:
┌──────────────────────────────────────────────────────────┐
│  Write a Review                              [X]         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Rating: ★★★★☆  (4 out of 5 stars)                      │Opens a modal with form for rating, title, and review text with authentication checks.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 76 | Component | ReviewsTab must exist |
| Auth State | Context | User authentication state |
| Modal Component | Component | Modal or drawer for review form |

### Instructions

1. **Create WriteReviewButton component file**
   - Create `WriteReviewButton.tsx` in `Reviews/` directory
   - Define `WriteReviewButtonProps` interface (productId, onReviewSubmit, className)

2. **Implement button component**
   - Create primary button with "Write a Review" text and icon
   - Apply prominent styling

3. **Add authentication check**
   - Check if user is logged in
   - If not logged in, show login prompt or redirect

4. **Implement button click handler**
   - Open review modal/drawer with form
   - Pass productId to form

5. **Create review form modal**
   - Rating selector (1-5 stars)
   - Title input field
   - Comment textarea
   - Submit and cancel buttons

6. **Add form validation**
   - Rating required
   - Title min 10 chars, Comment min 50 chars
   - Show validation errors

7. **Implement review submission**
   - POST to `/api/products/{productId}/reviews`
   - Handle success/error, show message, refresh reviews
- Review submission to API
- Success message and modal close
- Reviews list refreshed

### Checklist
- [ ] WriteReviewButton.tsx component created
- [ ] Props interface defined (productId, onReviewSubmit, className)
- [ ] Button component implemented
- [ ] Authentication check added
- [ ] Purchase verification added (optional)
- [ ] Button click handler opening modal
- [ ] Review form modal created
- [ ] Form fields (rating, title, comment) added
- [ ] Form validation implemented
- [ ] Review submission API call working
- [ ] Success/error handling
- [ ] Component exported from index.ts

---

## Summary

This document covered Tasks 76-82, creating the reviews tab with summary, breakdown, list, cards, pagination, and write review functionality. The implementation includes:

- **Task 76:** ReviewsTab container with TanStack Query data fetching
- **Task 77:** ReviewsSummary displaying average rating and total count
- **Task 78:** RatingBreakdown showing distribution with progress bars
- **Task 79:** ReviewList rendering multiple review cards
- **Task 80:** ReviewCard displaying individual review details
- **Task 81:** ReviewPagination for navigating multiple pages
- **Task 82:** WriteReviewButton opening modal for review submission

These components provide customers with comprehensive review functionality including reading existing reviews, viewing rating distributions, and submitting their own reviews with proper authentication and validation.
