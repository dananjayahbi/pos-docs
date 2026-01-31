# Tasks 83-89: Rich Text Renderer and Styles

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 11 - Static Pages & CMS  
> **Group:** F - Rich Text Editor & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-90-94_Testing.md](02_Tasks-90-94_Testing.md)

---

## Document Overview

This document covers the creation of the rich text rendering system for CMS content. It establishes the core renderer component that parses and displays JSON, HTML, or Markdown content, and implements comprehensive styling for all content types including headings, paragraphs, links, code blocks, image captions, and proper content spacing.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Rich Text Renderer | High | 90 min |
| 84 | Create Heading Styles | Low | 30 min |
| 85 | Create Paragraph Styles | Low | 25 min |
| 86 | Create Link Styles | Low | 30 min |
| 87 | Create Code Block | Medium | 45 min |
| 88 | Create Image Caption | Low | 25 min |
| 89 | Create Content Spacing | Low | 20 min |

---

## Task 83: Create Rich Text Renderer

### Overview
Create the core rich text rendering component that can parse and display various content formats including JSON structured content, sanitized HTML, and Markdown. This renderer serves as the foundation for displaying all CMS content throughout the storefront.

### Dependencies
- Task 82 (Blog Detail Page) must be complete
- Existing component structure and theming system
- Content sanitization libraries available

### Instructions

1. **Create RichText components directory**
   - Navigate to `frontend/components/storefront/cms/`
   - Create `RichText/` directory
   - Set up component index file for exports

2. **Install content parsing dependencies**
   - Install DOMPurify for HTML sanitization
   - Install markdown parsing library if needed
   - Configure TypeScript types for content formats

3. **Create RichTextRenderer component**
   - Accept content prop with union type (JSON | HTML | string)
   - Detect content format automatically
   - Parse JSON content into renderable blocks
   - Sanitize HTML content for XSS protection
   - Handle markdown conversion if supported

4. **Implement content type detection**
   - Check if content is valid JSON object
   - Detect HTML tags in string content
   - Fallback to plain text rendering
   - Handle edge cases and malformed content

5. **Create content block rendering**
   - Map JSON blocks to React components
   - Handle paragraph, heading, list, image blocks
   - Support nested content structures
   - Maintain content order and hierarchy

6. **Add error boundary handling**
   - Wrap renderer in error boundary
   - Display fallback for rendering errors
   - Log parsing errors for debugging
   - Graceful degradation to plain text

7. **Implement accessibility features**
   - Ensure proper heading hierarchy
   - Add ARIA labels where needed
   - Support keyboard navigation
   - Screen reader compatibility

8. **Add content caching**
   - Cache parsed content to avoid re-parsing
   - Clear cache when content changes
   - Optimize performance for large content
   - Memory management for cached content

### Success Criteria
- Renderer displays JSON structured content correctly
- HTML content is sanitized and rendered safely
- Markdown content converts and displays properly
- Error handling prevents crashes from malformed content
- Performance is optimized with caching
- Accessibility standards are met
- Component is reusable across all CMS pages

---

## Task 84: Create Heading Styles

### Overview
Create comprehensive heading styles (H1-H6) that provide proper visual hierarchy for CMS content. Implement responsive typography scales that work across all device sizes and maintain consistency with the overall design system.

### Dependencies
- Task 83 (Rich Text Renderer) must be complete
- Theme system and CSS variables established
- Typography scales defined in design system

### Instructions

1. **Create HeadingStyles component**
   - Create `HeadingStyles.tsx` in RichText directory
   - Export styled heading components (H1-H6)
   - Implement responsive typography scaling

2. **Define heading hierarchy**
   - H1: Primary page title (2.5rem/40px)
   - H2: Major section headers (2rem/32px)
   - H3: Subsection headers (1.75rem/28px)
   - H4: Minor section headers (1.5rem/24px)
   - H5: Small section headers (1.25rem/20px)
   - H6: Smallest headers (1rem/16px)

3. **Implement responsive scaling**
   - Scale down heading sizes on mobile devices
   - Maintain proportional relationships
   - Use clamp() for fluid typography
   - Test readability across screen sizes

4. **Add heading styling properties**
   - Font weight: 700 for H1-H2, 600 for H3-H6
   - Line height: 1.2 for better readability
   - Letter spacing: Slight negative for large headings
   - Color: Primary text color from theme

5. **Create spacing and margins**
   - Top margin: 2rem (except first child)
   - Bottom margin: 1rem
   - Consistent spacing between content sections
   - Remove margins from last child

6. **Add semantic HTML support**
   - Use proper heading tags (h1, h2, etc.)
   - Maintain heading hierarchy in DOM
   - Support custom heading levels
   - ARIA attributes for accessibility

7. **Implement theme integration**
   - Use CSS custom properties for colors
   - Support light/dark theme variations
   - Inherit font family from theme settings
   - Responsive to theme changes

8. **Add heading anchor links**
   - Generate unique IDs for headings
   - Add anchor link icons on hover
   - Enable deep linking to sections
   - Smooth scroll behavior

### Success Criteria
- All heading levels display with proper hierarchy
- Typography scales appropriately on all devices
- Headings integrate seamlessly with theme system
- Spacing and margins create good visual rhythm
- Accessibility standards are maintained
- Anchor linking works for deep navigation
- Performance impact is minimal

---

## Task 85: Create Paragraph Styles

### Overview
Create paragraph styling that ensures excellent readability for body text content. Implement proper line height, spacing, and typography choices that work well for extended reading across all device types.

### Dependencies
- Task 83 (Rich Text Renderer) must be complete
- Base typography system established
- Theme color system available

### Instructions

1. **Create ParagraphStyles component**
   - Create `ParagraphStyles.tsx` in RichText directory
   - Export styled paragraph components
   - Support different paragraph variants

2. **Define base paragraph styling**
   - Font size: 1rem (16px) for optimal readability
   - Line height: 1.75 for comfortable reading
   - Color: Gray-800 or theme text color
   - Font family: Body font from theme

3. **Implement responsive typography**
   - Maintain 16px minimum on mobile
   - Slightly larger on desktop (1.125rem)
   - Adjust line height for screen size
   - Optimize for reading distance

4. **Add paragraph spacing**
   - Bottom margin: 1.5rem between paragraphs
   - No top margin to avoid double spacing
   - Remove margin from last paragraph
   - Consistent vertical rhythm

5. **Create paragraph variants**
   - Lead paragraph: Larger, slightly bold
   - Small paragraph: Reduced size for captions
   - Intro paragraph: Enhanced for page openings
   - Default paragraph: Standard body text

6. **Add text formatting support**
   - Strong/bold text styling
   - Emphasized/italic text styling
   - Inline code styling
   - Mark/highlight text styling

7. **Implement accessibility features**
   - Sufficient color contrast ratios
   - Readable font choices
   - Proper paragraph semantics
   - Screen reader optimization

8. **Add text selection styling**
   - Custom selection background color
   - Maintain readability when selected
   - Theme-aware selection colors
   - Consistent across browsers

### Success Criteria
- Body text is highly readable on all devices
- Paragraph spacing creates good visual flow
- Text variants provide appropriate emphasis
- Color contrast meets accessibility standards
- Selection styling enhances user experience
- Integration with theme system is seamless
- Performance impact is negligible

---

## Task 86: Create Link Styles

### Overview
Create comprehensive link styling that provides clear visual indication of interactive elements. Implement hover states, focus states, and visited link styling while maintaining accessibility and design consistency.

### Dependencies
- Task 83 (Rich Text Renderer) must be complete
- Theme color system established
- Accessibility requirements defined

### Instructions

1. **Create LinkStyles component**
   - Create `LinkStyles.tsx` in RichText directory
   - Export styled link components
   - Support internal and external links

2. **Define default link styling**
   - Color: Primary theme color
   - Text decoration: Underline
   - Font weight: Same as parent text
   - Cursor: Pointer

3. **Implement hover interactions**
   - Darken color on hover (use theme utilities)
   - Maintain underline decoration
   - Smooth transition effects
   - Visual feedback timing

4. **Add focus state styling**
   - Visible focus outline ring
   - High contrast focus indicator
   - Keyboard navigation support
   - Skip to content compatibility

5. **Create visited link styling**
   - Slightly different color for visited links
   - Maintain visual consistency
   - Respect user privacy settings
   - Theme-appropriate color choices

6. **Add external link indicators**
   - Icon for external links
   - ARIA labels for screen readers
   - Visual distinction from internal links
   - New tab/window indication

7. **Implement link variants**
   - Button-style links
   - Subtle/muted links
   - Emphasized/prominent links
   - Inline vs. standalone links

8. **Add security features**
   - `rel="noopener noreferrer"` for external links
   - Target blank for external navigation
   - URL validation for safety
   - Protocol-relative link support

### Success Criteria
- Links are clearly identifiable as interactive
- Hover and focus states provide clear feedback
- External links are properly indicated and secured
- Visited link styling aids navigation memory
- Accessibility standards are fully met
- Theme integration is complete
- Performance impact is minimal

---

## Task 87: Create Code Block

### Overview
Create code block component with proper styling for displaying code snippets in CMS content. Implement syntax highlighting, copy functionality, and responsive design for code display across all device types.

### Dependencies
- Task 83 (Rich Text Renderer) must be complete
- Monospace font availability
- Optional: Syntax highlighting library

### Instructions

1. **Create CodeBlock component**
   - Create `CodeBlock.tsx` in RichText directory
   - Support both inline and block code
   - Handle multiple programming languages

2. **Define code block styling**
   - Background: Light gray (Gray-100) or theme equivalent
   - Font family: Monospace font stack
   - Padding: 1rem for comfortable spacing
   - Border radius: 8px for modern appearance

3. **Implement responsive design**
   - Horizontal scrolling on small screens
   - Maintain readability across devices
   - Prevent code from breaking layout
   - Touch-friendly scroll areas

4. **Add syntax highlighting (optional)**
   - Install lightweight highlighting library
   - Support common languages (JS, Python, etc.)
   - Graceful fallback without highlighting
   - Theme-aware color schemes

5. **Create copy functionality**
   - Copy button in top-right corner
   - Copy code to clipboard
   - Visual feedback on successful copy
   - Keyboard shortcut support

6. **Add language detection**
   - Display language label
   - Auto-detect from code fence attributes
   - Support manual language specification
   - Fallback to generic code styling

7. **Implement accessibility**
   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader compatibility
   - High contrast mode support

8. **Add line numbering (optional)**
   - Optional line numbers display
   - Proper alignment with code
   - Copy without line numbers
   - Theme integration

### Success Criteria
- Code blocks display with proper monospace formatting
- Background and padding provide good contrast
- Copy functionality works reliably
- Responsive design maintains usability
- Syntax highlighting enhances readability (if implemented)
- Accessibility standards are met
- Performance impact is acceptable

---

## Task 88: Create Image Caption

### Overview
Create image caption component that displays descriptive text below images in CMS content. Implement proper styling that complements images while maintaining readability and accessibility.

### Dependencies
- Task 27 (Image Component from Product Detail) must be complete
- Task 83 (Rich Text Renderer) must be complete
- Typography system established

### Instructions

1. **Create ImageCaption component**
   - Create `ImageCaption.tsx` in RichText directory
   - Support various image sizes
   - Handle optional/empty captions

2. **Define caption styling**
   - Font size: 0.875rem (14px) for subtle appearance
   - Color: Gray-600 or theme secondary text
   - Text align: Center for image alignment
   - Font style: Italic for distinction

3. **Implement proper spacing**
   - Top margin: 0.5rem from image
   - Bottom margin: 2rem for content separation
   - No left/right margins for center alignment
   - Consistent with other content spacing

4. **Add responsive behavior**
   - Maintain readability on mobile
   - Proper text wrapping
   - Scale with container width
   - Preserve aspect relationships

5. **Create image-caption grouping**
   - Wrap image and caption in figure element
   - Use figcaption for semantic HTML
   - Proper ARIA relationships
   - Screen reader optimization

6. **Add caption variants**
   - Photo credit style
   - Description style
   - Source attribution style
   - Copyright notice style

7. **Implement theme integration**
   - Use theme color variables
   - Support light/dark mode
   - Consistent typography scaling
   - Responsive to theme changes

8. **Add interaction states**
   - Subtle hover effects (optional)
   - Focus states for accessibility
   - Selection styling
   - Print-friendly styling

### Success Criteria
- Captions display properly below images
- Typography provides good contrast and readability
- Semantic HTML structure is correct
- Responsive design works on all devices
- Theme integration is seamless
- Accessibility standards are met
- Visual hierarchy is maintained

---

## Task 89: Create Content Spacing

### Overview
Create consistent spacing system for all content elements in the rich text renderer. Implement vertical rhythm that creates good visual flow between different content types and maintains readability.

### Dependencies
- Task 83 (Rich Text Renderer) must be complete
- All content components (84-88) must be complete
- Design system spacing tokens available

### Instructions

1. **Define spacing scale**
   - Extra small: 0.5rem (8px)
   - Small: 1rem (16px)
   - Medium: 1.5rem (24px)
   - Large: 2rem (32px)
   - Extra large: 3rem (48px)

2. **Implement content element spacing**
   - Headings: 2rem top, 1rem bottom (except first/last)
   - Paragraphs: 1.5rem bottom margin
   - Lists: 1.5rem bottom margin
   - Images: 2rem bottom margin
   - Code blocks: 2rem bottom margin

3. **Create section spacing**
   - Major sections: 3rem vertical separation
   - Minor sections: 2rem vertical separation
   - Inline elements: No vertical margins
   - First/last child: Remove appropriate margins

4. **Add responsive spacing**
   - Scale down spacing on mobile devices
   - Maintain proportional relationships
   - Use clamp() for fluid spacing
   - Optimize for touch interfaces

5. **Implement spacing utilities**
   - CSS custom properties for spacing values
   - Utility classes for manual spacing
   - Consistent application across components
   - Override capabilities when needed

6. **Create vertical rhythm system**
   - Base line height as spacing unit
   - Consistent vertical spacing ratios
   - Proper text baseline alignment
   - Visual balance between elements

7. **Add container spacing**
   - Content container padding
   - Maximum width constraints
   - Horizontal margins for centering
   - Reading width optimization

8. **Implement print spacing**
   - Optimized spacing for print media
   - Reduce excessive white space
   - Maintain readability in print
   - Page break considerations

### Success Criteria
- All content elements have consistent spacing
- Vertical rhythm creates good visual flow
- Responsive spacing works across all devices
- First and last child margins are properly handled
- Print styles maintain good layout
- Spacing system is maintainable and scalable
- Performance impact is minimal

---

## Implementation Notes

### Rich Text Architecture
- Modular component design for easy maintenance
- Type-safe props for content format detection
- Error boundaries for graceful failure handling
- Performance optimization through memoization

### Styling Strategy
- CSS custom properties for theme integration
- Mobile-first responsive design approach
- Semantic HTML for accessibility and SEO
- Print styles for document printing

### Testing Approach
- Unit tests for each component
- Visual regression testing for styling
- Accessibility testing with screen readers
- Cross-browser compatibility verification

### Performance Considerations
- Lazy loading for syntax highlighting
- Efficient re-rendering with React.memo
- Minimal CSS bundle size impact
- Image optimization integration

---

## Quality Assurance

### Component Testing
- All components render without errors
- Props are properly typed and validated
- Error boundaries handle edge cases
- Memory leaks are prevented

### Visual Testing
- Typography scales properly on all devices
- Colors meet accessibility contrast ratios
- Spacing creates good visual rhythm
- Print styles are clean and readable

### Accessibility Testing
- Screen reader navigation works properly
- Keyboard navigation is fully supported
- Color contrast ratios meet WCAG standards
- Semantic HTML structure is correct

### Integration Testing
- Components work together seamlessly
- Theme changes are properly reflected
- Content updates trigger proper re-renders
- Performance remains optimal with large content
