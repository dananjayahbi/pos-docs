# Tasks 73-80: Transitions and Animations

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** F - Animations, Utilities & Global Styles  
> **Document:** 01 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-81-86_Accessibility-GlobalStyles.md](02_Tasks-81-86_Accessibility-GlobalStyles.md)

---

## Document Overview

This document covers the creation of transition durations, timing functions, and keyframe animations for the design system. These animations provide smooth, performant feedback for user interactions including modal appearances, toast notifications, loading states, and error feedback. All animations follow performance best practices and maintain consistency across the application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Define Transition Duration Scale | Low | 15 min |
| 74 | Define Transition Timing Functions | Low | 15 min |
| 75 | Create Fade Animation | Low | 15 min |
| 76 | Create Slide Animations | Medium | 25 min |
| 77 | Create Scale Animation | Low | 15 min |
| 78 | Create Spin Animation | Low | 10 min |
| 79 | Create Pulse Animation | Low | 15 min |
| 80 | Create Shake Animation | Low | 15 min |

---

## Task 73: Define Transition Duration Scale

### Overview
Create a transition duration scale that provides consistent timing values across all animations and transitions. This scale ranges from instant feedback (75ms) to slow emphasis (500ms), covering all common animation needs in the application.

### Dependencies
- Task 02: Tailwind CSS configuration initialized
- `tailwind.config.js` file exists

### Instructions

1. **Open Tailwind configuration file**
   - Navigate to `frontend/tailwind.config.js`
   - Locate the `extend` section within `theme`

2. **Create transitionDuration extension**
   - Add `transitionDuration` object to theme.extend
   - This will add to default Tailwind duration values

3. **Define instant feedback duration (75ms)**
   - Add duration value '75': '75ms'
   - Purpose: Immediate visual feedback
   - Use for button hover states, checkbox toggles

4. **Define quick transition duration (100ms)**
   - Add duration value '100': '100ms'
   - Purpose: Fast state changes
   - Use for dropdown toggles, switch animations

5. **Define default duration (150ms)**
   - Add duration value '150': '150ms'
   - Purpose: Standard transition speed
   - Most common duration for general interactions

6. **Define standard duration (200ms)**
   - Add duration value '200': '200ms'
   - Purpose: Comfortable pace for transitions
   - Use for tab switches, accordion expansions

7. **Define deliberate duration (300ms)**
   - Add duration value '300': '300ms'
   - Purpose: Noticeable, smooth transitions
   - Use for modal entrances, sidebar slides

8. **Define slow emphasis duration (500ms)**
   - Add duration value '500': '500ms'
   - Purpose: Emphasized, slow animations
   - Use for important state changes, splash screens

9. **Add configuration comments**
   - Document purpose of each duration
   - Include usage recommendations
   - Note performance considerations

### Transition Duration Scale

| Name | Value | Usage Scenario | Example Use Cases |
|------|-------|----------------|-------------------|
| 75 | 75ms | Instant feedback | Button hover, checkbox toggle, radio selection |
| 100 | 100ms | Quick transitions | Dropdown open/close, switch toggle, chip animation |
| 150 | 150ms | Default speed | General hover effects, focus rings, link underlines |
| 200 | 200ms | Standard pace | Tab switching, accordion toggle, tooltip appearance |
| 300 | 300ms | Deliberate motion | Modal entrance, sidebar slide, toast appearance |
| 500 | 500ms | Slow emphasis | Loading overlays, success confirmations, splash screens |

### Duration Selection Guidelines

```
Interaction Response Time Chart
═══════════════════════════════════════════════════════

                    User Perception
75ms   ►►►         Instant (feels immediate)
100ms  ►►►         Very fast (barely noticeable)
150ms  ►►►►        Fast (comfortable)
200ms  ►►►►►       Moderate (clear transition)
300ms  ►►►►►►      Deliberate (noticeable motion)
500ms  ►►►►►►►►►   Slow (emphasized animation)

Performance Guidelines:
• Use shorter durations for frequent interactions
• Use longer durations for important state changes
• Never exceed 500ms for UI transitions
• Consider user with motion sensitivity
```

### Duration Usage by Component Type

| Component Type | Recommended Duration | Rationale |
|---------------|---------------------|-----------|
| Buttons | 75ms - 100ms | Immediate feedback needed |
| Form fields | 100ms - 150ms | Quick, responsive feel |
| Dropdowns | 150ms - 200ms | Clear open/close motion |
| Modals | 200ms - 300ms | Noticeable entrance/exit |
| Sidebars | 300ms | Smooth slide motion |
| Toast notifications | 200ms - 300ms | Attention-grabbing appearance |
| Loading overlays | 300ms - 500ms | Indicates processing state |

### Timing Perception Psychology

```
Human Perception Thresholds
════════════════════════════════════════════════

< 100ms:  Perceived as instantaneous
          User feels system is responding directly to input
          Ideal for hover states and toggle switches

100-300ms: Perceived as smooth transition
           User notices the motion but not the time
           Ideal for most UI animations

300-500ms: Perceived as deliberate animation
           User clearly sees the transition
           Use for important state changes only

> 500ms:   Perceived as slow
           May frustrate users if overused
           Reserve for loading states or splash screens
```

### Expected Outcome
- Six transition duration values available
- Consistent timing across application
- Performance-optimized duration choices
- Clear usage guidelines for developers

### Verification Checklist
- [ ] transitionDuration object added to theme.extend
- [ ] Duration 75ms defined
- [ ] Duration 100ms defined
- [ ] Duration 150ms defined
- [ ] Duration 200ms defined
- [ ] Duration 300ms defined
- [ ] Duration 500ms defined
- [ ] Configuration includes comments
- [ ] Values follow millisecond format

---

## Task 74: Define Transition Timing Functions

### Overview
Define transition timing functions (easing curves) that control the acceleration and deceleration of animations. These functions create natural-feeling motion by varying the animation speed throughout its duration, making animations feel more organic and less mechanical.

### Dependencies
- Task 73: Transition duration scale defined

### Instructions

1. **Open Tailwind configuration file**
   - Continue in `frontend/tailwind.config.js`
   - Locate theme.extend section

2. **Create transitionTimingFunction extension**
   - Add `transitionTimingFunction` object to theme.extend
   - These will supplement Tailwind's default timing functions

3. **Define ease-in timing function**
   - Add 'ease-in': 'cubic-bezier(0.4, 0, 1, 1)'
   - Purpose: Starts slow, ends fast
   - Use for exit animations, elements leaving screen

4. **Define ease-out timing function**
   - Add 'ease-out': 'cubic-bezier(0, 0, 0.2, 1)'
   - Purpose: Starts fast, ends slow
   - Use for enter animations, elements appearing

5. **Define ease-in-out timing function**
   - Add 'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
   - Purpose: Slow start, fast middle, slow end
   - Use for transitions between states

6. **Add sharp timing function**
   - Add 'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)'
   - Purpose: Quick, snappy animations
   - Use for immediate responses, toggle switches

7. **Add smooth timing function**
   - Add 'smooth': 'cubic-bezier(0.4, 0, 0.1, 1)'
   - Purpose: Very smooth, gradual transitions
   - Use for drawer slides, smooth scrolls

8. **Add bounce-in timing function**
   - Add 'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
   - Purpose: Overshoots then settles
   - Use for playful animations, success indicators

9. **Add configuration comments**
   - Document the purpose of each timing function
   - Include visual curve representations in comments
   - Note appropriate use cases

### Timing Function Curves

```
Cubic Bezier Visualization
═══════════════════════════════════════════════════

ease-in (Exit Animations)
cubic-bezier(0.4, 0, 1, 1)
    Progress
    1.0 │                    ╱─────
        │                 ╱──
        │              ╱──
    0.5 │           ╱──
        │        ╱──
        │     ╱──
    0.0 │──╱──
        └─────────────────────────► Time
        Start               End

ease-out (Enter Animations)
cubic-bezier(0, 0, 0.2, 1)
    Progress
    1.0 │─────╲
        │      ──╲
        │         ──╲
    0.5 │            ──╲
        │               ──╲
        │                  ──╲
    0.0 │                     ──╲
        └─────────────────────────► Time
        Start               End

ease-in-out (State Transitions)
cubic-bezier(0.4, 0, 0.2, 1)
    Progress
    1.0 │          ╱─────────
        │       ╱──
        │     ╱──
    0.5 │    ╱
        │   ╱──
        │ ╱──
    0.0 │──
        └─────────────────────────► Time
        Start               End
```

### Timing Function Specifications

| Name | Bezier Values | Acceleration Pattern | Best Use Case |
|------|---------------|---------------------|---------------|
| ease-in | (0.4, 0, 1, 1) | Slow → Fast | Elements exiting viewport |
| ease-out | (0, 0, 0.2, 1) | Fast → Slow | Elements entering viewport |
| ease-in-out | (0.4, 0, 0.2, 1) | Slow → Fast → Slow | State changes, swaps |
| sharp | (0.4, 0, 0.6, 1) | Quick start, quick end | Toggle switches, checkboxes |
| smooth | (0.4, 0, 0.1, 1) | Very gradual | Large surface movements |
| bounce-in | (0.68, -0.55, 0.265, 1.55) | Overshoot → Settle | Playful interactions |

### Animation Type Recommendations

```
Animation Type → Timing Function Mapping
════════════════════════════════════════════════

Modal/Dialog Appearance:
├─ Entry: ease-out (appears smoothly)
└─ Exit: ease-in (disappears quickly)

Dropdown Menu:
├─ Open: ease-out (drops smoothly)
└─ Close: ease-in (retracts quickly)

Sidebar/Drawer:
├─ Slide In: smooth (large surface movement)
└─ Slide Out: ease-in (quick exit)

Toast Notification:
├─ Appear: ease-out (enters smoothly)
└─ Disappear: ease-in (leaves quickly)

Button Hover:
└─ All states: ease-in-out (symmetrical)

Checkbox/Toggle:
└─ All states: sharp (immediate feedback)

Success Confirmation:
└─ Appearance: bounce-in (celebratory)
```

### Material Design Motion Principles

```
Natural Motion Guidelines
═════════════════════════════════════════════════

Enter Animations (Incoming Elements):
• Use ease-out timing
• Element decelerates as it arrives
• Gives impression of "settling into place"
• Duration: 200-300ms

Exit Animations (Outgoing Elements):
• Use ease-in timing
• Element accelerates as it leaves
• Quick departure feels natural
• Duration: 150-200ms

Transitional Animations (State Changes):
• Use ease-in-out timing
• Symmetrical acceleration
• Smooth throughout
• Duration: 200-300ms
```

### Timing Function Selection Decision Tree

```
                    Animation Type?
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    Entering?         Exiting?         Changing?
        │                 │                 │
        ▼                 ▼                 ▼
    ease-out          ease-in         ease-in-out
    (Fast→Slow)       (Slow→Fast)     (Slow→Fast→Slow)
        │                 │                 │
        │                 │                 │
    Modal open        Modal close      Tab switch
    Toast appear      Toast dismiss    Theme toggle
    Dropdown open     Dropdown close   Accordion
```

### Performance Considerations

| Timing Function | Performance | CPU Usage | Use Case Limitation |
|----------------|-------------|-----------|---------------------|
| ease-in | Excellent | Low | None |
| ease-out | Excellent | Low | None |
| ease-in-out | Excellent | Low | None |
| sharp | Excellent | Low | Avoid for large surfaces |
| smooth | Good | Medium | Limit to drawer/sidebar |
| bounce-in | Good | Medium | Avoid overuse, sparingly |

### Expected Outcome
- Six timing functions defined
- Natural-feeling animations
- Appropriate curves for each use case
- Clear guidance for developers

### Verification Checklist
- [ ] transitionTimingFunction object added
- [ ] ease-in timing function defined
- [ ] ease-out timing function defined
- [ ] ease-in-out timing function defined
- [ ] sharp timing function defined
- [ ] smooth timing function defined
- [ ] bounce-in timing function defined
- [ ] Configuration includes comments
- [ ] Cubic bezier values are valid

---

## Task 75: Create Fade Animation

### Overview
Create fade-in and fade-out keyframe animations for smooth opacity transitions. These animations are fundamental for modal appearances, overlay displays, tooltip visibility, and any component that needs to gracefully appear or disappear.

### Dependencies
- Task 73: Transition duration scale defined
- Task 74: Transition timing functions defined

### Instructions

1. **Open global styles file**
   - Navigate to `frontend/styles/globals.css`
   - Locate or create animations section

2. **Add animations section comment**
   - Add clear comment: "/* Keyframe Animations */"
   - Organize animations by type

3. **Define fadeIn keyframes**
   - Create @keyframes fadeIn
   - Start: opacity 0 (fully transparent)
   - End: opacity 1 (fully opaque)
   - No transform properties (opacity only)

4. **Define fadeOut keyframes**
   - Create @keyframes fadeOut
   - Start: opacity 1 (fully opaque)
   - End: opacity 0 (fully transparent)
   - Mirror of fadeIn

5. **Configure fadeIn in Tailwind**
   - Open `tailwind.config.js`
   - Add to theme.extend.keyframes
   - Name: fadeIn

6. **Configure fadeOut in Tailwind**
   - Continue in theme.extend.keyframes
   - Name: fadeOut

7. **Add fadeIn animation utility**
   - In theme.extend.animation object
   - Create 'fade-in' entry
   - Format: 'fadeIn 200ms ease-out'
   - Uses 200ms duration and ease-out timing

8. **Add fadeOut animation utility**
   - Continue in theme.extend.animation
   - Create 'fade-out' entry
   - Format: 'fadeOut 150ms ease-in'
   - Faster exit than entrance

9. **Add multiple fade variants**
   - Create 'fade-in-fast': 'fadeIn 100ms ease-out'
   - Create 'fade-in-slow': 'fadeIn 300ms ease-out'
   - Provides flexibility for different contexts

### Fade Animation Progression

```
Fade In Animation
═══════════════════════════════════════════════════

Opacity Scale
1.0 │                              ██████████████
    │                        ██████
    │                  ██████
0.5 │            ██████
    │      ██████
    │██████
0.0 │█
    └─────────────────────────────────────────────► Time
    0%        25%       50%       75%      100%

Visual Representation:
0%:   [ ]              Invisible
25%:  [░]              Barely visible
50%:  [▒]              Half visible
75%:  [▓]              Mostly visible
100%: [█]              Fully visible
```

### Fade Animation Use Cases

| Use Case | Animation | Duration | Timing Function | Rationale |
|----------|-----------|----------|-----------------|-----------|
| Modal backdrop | fade-in | 200ms | ease-out | Smooth overlay appearance |
| Modal content | fade-in | 200ms | ease-out | Content appears after backdrop |
| Tooltip | fade-in-fast | 100ms | ease-out | Quick feedback on hover |
| Toast notification | fade-in | 200ms | ease-out | Noticeable but not jarring |
| Loading overlay | fade-in | 300ms | ease-out | Gradual blocking of content |
| Modal close | fade-out | 150ms | ease-in | Quick dismissal |
| Tooltip hide | fade-out | 100ms | ease-in | Instant removal |
| Toast dismiss | fade-out | 150ms | ease-in | Smooth exit |

### Fade Animation Component Examples

```
Modal Implementation Pattern
════════════════════════════════════════════════

Backdrop:
  Class: animate-fade-in
  Purpose: Dim background content
  Duration: 200ms
  z-index: 40

Modal Content:
  Class: animate-fade-in
  Delay: 50ms (starts after backdrop)
  Purpose: Main modal content
  Duration: 200ms
  z-index: 50

Close Transition:
  Class: animate-fade-out
  Purpose: Quick dismissal
  Duration: 150ms
```

### Fade Animation Accessibility

```
Motion Sensitivity Considerations
═════════════════════════════════════════════════

Default Behavior:
  • Fade animations enabled
  • Smooth transitions
  • Enhanced UX for most users

Reduced Motion Preference:
  @media (prefers-reduced-motion: reduce) {
    • Fade animations disabled
    • Instant appearance/disappearance
    • Opacity: 0 → 1 without transition
  }

Implementation Note:
  • Always respect user preferences
  • Test with reduced motion enabled
  • Ensure functionality without animations
```

### Fade Timing Comparison

| Duration | Visual Effect | User Perception | Best For |
|----------|---------------|-----------------|----------|
| 100ms (fast) | Quick blink | Almost instant | Tooltips, hover effects |
| 150ms (quick) | Brief flash | Very fast | Dismissals, removals |
| 200ms (default) | Smooth transition | Comfortable | Modals, dropdowns |
| 300ms (slow) | Gradual appearance | Deliberate | Loading states, overlays |

### Fade Animation Layering

```
Stacked Fade Strategy (Modal Example)
════════════════════════════════════════════════

Timeline:
    0ms                    200ms                400ms
    │─────────────────────│─────────────────────│
    │                     │                     │
    ▼                     ▼                     ▼
Backdrop ████████████████████ (200ms fade-in)
    Content   ████████████████████ (200ms fade-in, 50ms delay)
                Icon   ████████████ (150ms fade-in, 100ms delay)

Effect: Layered appearance, backdrop first, then content
```

### Expected Outcome
- Smooth fade-in animation
- Quick fade-out animation
- Multiple duration variants
- Consistent opacity transitions

### Verification Checklist
- [ ] fadeIn keyframes defined in globals.css
- [ ] fadeOut keyframes defined in globals.css
- [ ] fadeIn added to Tailwind keyframes config
- [ ] fadeOut added to Tailwind keyframes config
- [ ] fade-in animation utility created
- [ ] fade-out animation utility created
- [ ] fade-in-fast variant created
- [ ] fade-in-slow variant created
- [ ] Opacity values are correct (0 to 1)

---

## Task 76: Create Slide Animations

### Overview
Create directional slide animations for elements entering from all four directions (up, down, left, right). These animations are essential for drawer navigation, dropdown menus, toast notifications, and sheet components that slide into view from viewport edges.

### Dependencies
- Task 73: Transition duration scale defined
- Task 74: Transition timing functions defined

### Instructions

1. **Open global styles file**
   - Continue in `frontend/styles/globals.css`
   - Add to animations section

2. **Define slideInUp keyframes**
   - Create @keyframes slideInUp
   - Start: transform translateY(100%), opacity 0
   - End: transform translateY(0), opacity 1
   - Element enters from bottom

3. **Define slideInDown keyframes**
   - Create @keyframes slideInDown
   - Start: transform translateY(-100%), opacity 0
   - End: transform translateY(0), opacity 1
   - Element enters from top

4. **Define slideInLeft keyframes**
   - Create @keyframes slideInLeft
   - Start: transform translateX(-100%), opacity 0
   - End: transform translateX(0), opacity 1
   - Element enters from left edge

5. **Define slideInRight keyframes**
   - Create @keyframes slideInRight
   - Start: transform translateX(100%), opacity 0
   - End: transform translateX(0), opacity 1
   - Element enters from right edge

6. **Add all slide keyframes to Tailwind config**
   - Open `tailwind.config.js`
   - Add slideInUp, slideInDown, slideInLeft, slideInRight to theme.extend.keyframes

7. **Create slideInUp animation utility**
   - In theme.extend.animation
   - Create 'slide-in-up': 'slideInUp 300ms ease-out'
   - Smooth upward slide

8. **Create slideInDown animation utility**
   - Create 'slide-in-down': 'slideInDown 200ms ease-out'
   - Faster for dropdowns

9. **Create slideInLeft animation utility**
   - Create 'slide-in-left': 'slideInLeft 300ms smooth'
   - Uses smooth timing for drawer

10. **Create slideInRight animation utility**
    - Create 'slide-in-right': 'slideInRight 300ms smooth'
    - Mirror of left slide

11. **Add fast slide variants**
    - Create 'slide-in-up-fast': 'slideInUp 200ms ease-out'
    - Create 'slide-in-down-fast': 'slideInDown 150ms ease-out'
    - Quicker versions for subtle effects

### Slide Direction Visualization

```
Slide Animation Directions
═══════════════════════════════════════════════════

                    slideInDown
                    ▼▼▼▼▼▼▼▼▼▼▼
                ┌──────────────┐
                │   Dropdown   │
                │    Menu      │
                └──────────────┘

    slideInLeft     ┌──────┐     slideInRight
    ►►►►►►►         │Modal │         ◄◄◄◄◄◄◄
                    │Dialog│
                    └──────┘

                ┌──────────────┐
                │    Toast     │
                │ Notification │
                └──────────────┘
                    ▲▲▲▲▲▲▲▲▲▲▲
                    slideInUp
```

### Slide Animation Transform Progression

```
slideInUp Transform Progression
═══════════════════════════════════════════════════

Start Position (translateY 100%)
┌─────────────────────────────────────┐
│                                     │
│                                     │
│       Viewport Visible Area         │
│                                     │
│                                     │
└─────────────────────────────────────┘
  [Toast Message] ← Below viewport

Mid Position (translateY 50%)
┌─────────────────────────────────────┐
│                                     │
│                                     │
│       Viewport Visible Area         │
│                                     │
└─────────────────────────────────────┘
  [Toast Message] ← Halfway visible

End Position (translateY 0%)
┌─────────────────────────────────────┐
│                                     │
│       Viewport Visible Area         │
│                                     │
│  [Toast Message] ← Fully visible    │
└─────────────────────────────────────┘
```

### Slide Animation Use Cases

| Direction | Animation | Duration | Component Examples |
|-----------|-----------|----------|-------------------|
| Up | slide-in-up | 300ms | Toast notifications, bottom sheets, snackbars |
| Down | slide-in-down | 200ms | Dropdown menus, select options, command palette |
| Left | slide-in-left | 300ms | Navigation drawers, filter panels, settings sidebar |
| Right | slide-in-right | 300ms | Detail panels, property inspectors, chat panels |

### Component-Specific Slide Patterns

```
Toast Notification (Bottom-Up)
═══════════════════════════════════════════════════
Animation: slide-in-up
Duration: 300ms
Timing: ease-out
Origin: bottom-right corner

Usage:
<div class="animate-slide-in-up">
  Success! Item added to cart.
</div>


Dropdown Menu (Top-Down)
═══════════════════════════════════════════════════
Animation: slide-in-down
Duration: 200ms
Timing: ease-out
Origin: below trigger button

Usage:
<div class="animate-slide-in-down">
  <ul>Menu items...</ul>
</div>


Navigation Drawer (Left-to-Right)
═══════════════════════════════════════════════════
Animation: slide-in-left
Duration: 300ms
Timing: smooth
Origin: left viewport edge

Usage:
<aside class="animate-slide-in-left">
  Navigation content
</aside>


Detail Sheet (Right-to-Left)
═══════════════════════════════════════════════════
Animation: slide-in-right
Duration: 300ms
Timing: smooth
Origin: right viewport edge

Usage:
<div class="animate-slide-in-right">
  Product details
</div>
```

### Slide Animation Combined Effects

```
Transform + Opacity Timeline
═══════════════════════════════════════════════════

Time:      0%        25%       50%       75%      100%
           │         │         │         │         │
Transform: 100%      75%       50%       25%       0%
           │────────►│────────►│────────►│────────►│
Opacity:   0         0.25      0.5       0.75      1
           │────────►│────────►│────────►│────────►│

Combined Effect:
• Element slides into position
• Simultaneously fades in
• Creates smooth, professional appearance
```

### Slide Distance Variations

| Slide Distance | Use Case | Visual Impact |
|----------------|----------|---------------|
| 100% (full) | Drawers, sheets | Complete off-screen to on-screen |
| 50% (half) | Subtle slides | Partial shift, less dramatic |
| 25% (small) | Micro-interactions | Barely noticeable motion |

### Slide Animation Performance

```
Hardware Acceleration
═══════════════════════════════════════════════════

Transform Properties (GPU-Accelerated):
✓ translateX()
✓ translateY()
✓ opacity

These properties trigger GPU acceleration:
• Smooth 60fps animations
• Low CPU usage
• Efficient battery consumption

Avoid (CPU-intensive):
✗ top/bottom/left/right positioning
✗ width/height animations
✗ margin/padding changes
```

### Multi-Directional Slide Scenarios

| Scenario | Direction | Component | Rationale |
|----------|-----------|-----------|-----------|
| Mobile menu open | Left | Hamburger menu | Natural left-to-right reading |
| Notification | Up | Toast | Bottom position non-intrusive |
| Contextual help | Right | Help panel | Slides over content from side |
| Command search | Down | Command palette | Descends from top like spotlight |

### Slide Animation Exit Strategy

```
Entry vs Exit Timing
═══════════════════════════════════════════════════

Entry (slide-in):
├─ Duration: 300ms
├─ Timing: ease-out (decelerates)
└─ Effect: Smooth arrival

Exit (slide-out, future):
├─ Duration: 200ms
├─ Timing: ease-in (accelerates)
└─ Effect: Quick departure

Asymmetry Benefits:
• Entry is welcoming (slower)
• Exit is efficient (faster)
• Matches user expectations
```

### Expected Outcome
- Four directional slide animations
- Smooth slide-in effects with opacity
- Multiple duration variants
- Performance-optimized transforms

### Verification Checklist
- [ ] slideInUp keyframes defined
- [ ] slideInDown keyframes defined
- [ ] slideInLeft keyframes defined
- [ ] slideInRight keyframes defined
- [ ] All slide keyframes in Tailwind config
- [ ] slide-in-up animation utility created
- [ ] slide-in-down animation utility created
- [ ] slide-in-left animation utility created
- [ ] slide-in-right animation utility created
- [ ] Fast slide variants created
- [ ] Transform values are correct (100% to 0)
- [ ] Opacity transitions included

---

## Task 77: Create Scale Animation

### Overview
Create scale animation for modal and dialog entrances. The scale animation zooms elements from a smaller size to full size, creating an attention-grabbing effect perfect for important UI elements like modals, alerts, and confirmation dialogs.

### Dependencies
- Task 73: Transition duration scale defined
- Task 74: Transition timing functions defined

### Instructions

1. **Open global styles file**
   - Continue in `frontend/styles/globals.css`
   - Add to animations section

2. **Define scaleIn keyframes**
   - Create @keyframes scaleIn
   - Start: transform scale(0.95), opacity 0
   - End: transform scale(1), opacity 1
   - Slight scale prevents harsh appearance

3. **Define scaleInCenter keyframes**
   - Create @keyframes scaleInCenter
   - Start: transform scale(0.8), opacity 0
   - Middle: transform scale(1.02), opacity 1 (at 80%)
   - End: transform scale(1), opacity 1
   - Adds slight overshoot for bounce effect

4. **Add scale keyframes to Tailwind config**
   - Open `tailwind.config.js`
   - Add scaleIn and scaleInCenter to theme.extend.keyframes

5. **Create scaleIn animation utility**
   - In theme.extend.animation
   - Create 'scale-in': 'scaleIn 200ms ease-out'
   - Standard modal entrance

6. **Create scaleInCenter animation utility**
   - Create 'scale-in-center': 'scaleInCenter 300ms ease-out'
   - With subtle bounce effect

7. **Add transform-origin utilities**
   - Note: Use Tailwind's built-in origin classes
   - origin-center for modals
   - origin-top for dropdowns starting from top
   - origin-bottom for tooltips starting from bottom

8. **Add scale animation variants**
   - Create 'scale-in-fast': 'scaleIn 150ms ease-out'
   - Create 'scale-in-slow': 'scaleIn 300ms ease-out'

### Scale Animation Progression

```
Scale-In Animation Timeline
═══════════════════════════════════════════════════

Time:     0%        25%       50%       75%      100%
          │         │         │         │         │
Scale:    0.95      0.96      0.98      0.99      1.0
          ▪         ▫         ▬         ▭         ▮
Opacity:  0         0.25      0.5       0.75      1.0

Visual Representation:
0%:   [▪]     95% size, invisible
25%:  [▫]     96% size, barely visible
50%:  [▬]     98% size, half visible
75%:  [▭]     99% size, mostly visible
100%: [▮]     100% size, fully visible
```

### Scale Animation with Bounce

```
ScaleInCenter with Overshoot
═══════════════════════════════════════════════════

Scale Factor
1.02│         ╱╲      ← Slight overshoot
    │        ╱  ╲
1.00│───────╱    ╲─────  ← Final resting
    │      ╱      ╲
0.95│     ╱        ╲
    │    ╱
0.80│───╱
    └─────────────────────────────► Time
    0%    40%   80%  90%  100%

Effect: Zooms in, slightly overshoots, settles
Perception: Elastic, bouncy, playful
```

### Scale Animation Use Cases

| Component | Animation | Scale Range | Duration | Effect Description |
|-----------|-----------|-------------|----------|-------------------|
| Modal dialog | scale-in | 0.95 → 1.0 | 200ms | Subtle zoom, professional |
| Alert dialog | scale-in-center | 0.8 → 1.02 → 1.0 | 300ms | Attention-grabbing bounce |
| Confirmation | scale-in | 0.95 → 1.0 | 200ms | Focused appearance |
| Image lightbox | scale-in-slow | 0.95 → 1.0 | 300ms | Dramatic reveal |
| Dropdown menu | scale-in-fast | 0.95 → 1.0 | 150ms | Quick expansion |

### Transform Origin Impact

```
Transform Origin Variations
═══════════════════════════════════════════════════

origin-center (Default for Modals)
     ╔═════╗
     ║  ↑  ║  Expands from center
     ║←─●─→║  All directions equal
     ║  ↓  ║
     ╚═════╝

origin-top (Dropdowns)
     ╔═══╗
     ║ ● ║  Expands downward
     ║ ↓ ║  From top attachment point
     ╚═══╝

origin-bottom (Tooltips)
     ╔═══╗
     ║ ↑ ║  Expands upward
     ║ ● ║  From bottom attachment
     ╚═══╝

origin-top-left (Contextual menus)
   ╔═════╗
   ║●    ║  Expands from top-left corner
   ║  ↘  ║  Natural for menu context
   ╚═════╝
```

### Scale Animation Component Patterns

```
Modal Dialog Implementation
═══════════════════════════════════════════════════
Backdrop: animate-fade-in (200ms)
Modal Container: animate-scale-in origin-center (200ms)

<div class="animate-fade-in">  <!-- Backdrop -->
  <div class="animate-scale-in origin-center">
    <!-- Modal content -->
  </div>
</div>


Alert Dialog Implementation
═══════════════════════════════════════════════════
Backdrop: animate-fade-in (200ms)
Alert: animate-scale-in-center origin-center (300ms)

<div class="animate-fade-in">  <!-- Backdrop -->
  <div class="animate-scale-in-center origin-center">
    <!-- Alert content with bounce -->
  </div>
</div>


Context Menu Implementation
═══════════════════════════════════════════════════
Menu: animate-scale-in-fast origin-top-left (150ms)

<div class="animate-scale-in-fast origin-top-left">
  <!-- Menu items -->
</div>
```

### Scale Animation Psychology

```
User Perception by Scale Range
═══════════════════════════════════════════════════

0.95 → 1.0 (Subtle 5% scale)
├─ Perception: Professional, refined
├─ Use: Standard modals, forms
└─ Effect: Barely noticeable zoom

0.8 → 1.0 (Moderate 20% scale)
├─ Perception: Noticeable, important
├─ Use: Alert dialogs, confirmations
└─ Effect: Clear zooming motion

0.5 → 1.0 (Dramatic 50% scale)
├─ Perception: Very dramatic, showy
├─ Use: Splash screens, celebrations
└─ Effect: Strong attention grab
└─ Warning: Can be jarring, use sparingly
```

### Scale Animation Performance

```
GPU Acceleration Best Practices
═══════════════════════════════════════════════════

Optimal Properties:
✓ transform: scale()    ← GPU accelerated
✓ opacity              ← GPU accelerated
✓ transform-origin     ← No performance impact

Performance Benefits:
• 60fps smooth animation
• Low battery consumption
• No layout recalculation
• No paint operations

Avoid:
✗ width/height changes
✗ font-size animation
✗ Nested scale animations
```

### Combined Scale and Fade

| Animation Name | Scale Start | Scale End | Opacity Start | Opacity End | Total Duration |
|----------------|-------------|-----------|---------------|-------------|----------------|
| scale-in | 0.95 | 1.0 | 0 | 1 | 200ms |
| scale-in-center | 0.8 | 1.0 | 0 | 1 | 300ms |
| scale-in-fast | 0.95 | 1.0 | 0 | 1 | 150ms |
| scale-in-slow | 0.95 | 1.0 | 0 | 1 | 300ms |

### Expected Outcome
- Smooth scale-in animations
- Subtle zoom effect for modals
- Optional bounce effect
- Multiple duration variants

### Verification Checklist
- [ ] scaleIn keyframes defined
- [ ] scaleInCenter keyframes defined
- [ ] Scale keyframes added to Tailwind config
- [ ] scale-in animation utility created
- [ ] scale-in-center animation utility created
- [ ] scale-in-fast variant created
- [ ] scale-in-slow variant created
- [ ] Transform-origin utilities documented
- [ ] Scale values are subtle (0.95-1.0)

---

## Task 78: Create Spin Animation

### Overview
Create continuous spin animation for loading indicators and spinners. This animation rotates elements 360 degrees in a smooth, infinite loop, providing clear visual feedback that the system is processing a request.

### Dependencies
- Task 73: Transition duration scale defined

### Instructions

1. **Open global styles file**
   - Continue in `frontend/styles/globals.css`
   - Add to animations section

2. **Define spin keyframes**
   - Create @keyframes spin
   - Start: transform rotate(0deg)
   - End: transform rotate(360deg)
   - Full rotation

3. **Add spin keyframes to Tailwind config**
   - Open `tailwind.config.js`
   - Note: Tailwind has default 'spin' but we'll enhance it
   - Add to theme.extend.keyframes if customizing

4. **Create spin animation utility**
   - In theme.extend.animation
   - Create 'spin': 'spin 1s linear infinite'
   - Standard loading spinner speed

5. **Create fast spin variant**
   - Create 'spin-fast': 'spin 0.5s linear infinite'
   - Faster rotation for urgent processing

6. **Create slow spin variant**
   - Create 'spin-slow': 'spin 2s linear infinite'
   - Slower, more relaxed rotation

7. **Create reverse spin variant**
   - Define spinReverse keyframes (360deg to 0deg)
   - Create 'spin-reverse': 'spinReverse 1s linear infinite'
   - Counter-clockwise rotation

8. **Add timing note**
   - Document that spin always uses 'linear' timing
   - Constant speed throughout rotation
   - No acceleration/deceleration

### Spin Animation Rotation Stages

```
360-Degree Rotation Timeline
═══════════════════════════════════════════════════

         0° / 360°
             │
             ▲
             │
   270° ◄────┼────► 90°
             │
             ▼
             │
           180°

Time Progression (1s duration):
0.0s: 0°     (Starting position)
0.25s: 90°   (Quarter turn)
0.5s: 180°   (Half turn)
0.75s: 270°  (Three-quarter turn)
1.0s: 360°   (Full rotation, loops back)
```

### Spin Speed Comparison

```
Visual Speed Comparison
═══════════════════════════════════════════════════

Spin Fast (0.5s per rotation)
    ⟲⟲⟲⟲⟲    Very rapid, urgent feel

Spin Normal (1s per rotation)
    ⟲⟲⟲       Standard loading speed

Spin Slow (2s per rotation)
    ⟲⟲        Relaxed, background processing
```

### Spin Animation Use Cases

| Spinner Type | Animation | Duration | Use Case |
|-------------|-----------|----------|----------|
| Button loading | spin | 1s | Form submission, save button |
| Page loading | spin | 1s | Initial page load, route change |
| Background task | spin-slow | 2s | Non-urgent processing |
| Urgent operation | spin-fast | 0.5s | Critical action processing |
| Refresh icon | spin-reverse | 1s | Data refresh, reload |

### Spinner Icon Examples

```
Common Spinner Patterns
═══════════════════════════════════════════════════

Circle Spinner (Most Common)
    ◠
  ◜   ◝
  ◟   ◞
    ◡
Uses: General loading, standard spinner

Partial Arc Spinner
    ╭─╮
    │ │
    ╰─╯  ← Arc rotates
Uses: Determinate progress when combined

Dots Spinner (Orbital)
    •   •
      ⊕    ← Dots rotate around center
    •   •
Uses: Subtle loading states

Gear Icon
    ⚙
Uses: Settings processing, system operations
```

### Loading Spinner Component Patterns

```
Button with Loading Spinner
═══════════════════════════════════════════════════

<button>
  <svg class="animate-spin h-5 w-5">
    <!-- Spinner icon -->
  </svg>
  <span>Loading...</span>
</button>


Centered Page Loader
═══════════════════════════════════════════════════

<div class="flex items-center justify-center">
  <div class="animate-spin rounded-full 
              h-12 w-12 border-4 border-primary 
              border-t-transparent">
  </div>
</div>


Small Inline Spinner
═══════════════════════════════════════════════════

<span class="inline-flex items-center">
  Processing
  <svg class="animate-spin h-4 w-4 ml-2">
    <!-- Small spinner -->
  </svg>
</span>
```

### Spin Animation Timing Function

```
Linear Timing (Required for Spin)
═══════════════════════════════════════════════════

    Rotation
360°│─────────────────────────────────────
    │                              ╱
    │                         ╱
    │                    ╱
180°│               ╱
    │          ╱
    │     ╱
  0°│╱
    └─────────────────────────────────► Time
    0s      0.5s      1.0s

Why Linear?
• Constant rotation speed
• No acceleration/deceleration
• Smooth, predictable motion
• Matches user expectation for loading
```

### Reverse Spin Applications

| Use Case | Direction | Rationale |
|----------|-----------|-----------|
| Standard loading | Clockwise | Default, universal |
| Refresh/Reload | Counter-clockwise | Visual distinction |
| Undo operation | Counter-clockwise | Reverse metaphor |
| Download | Clockwise | Pulling in |
| Upload | Counter-clockwise | Pushing out |

### Accessibility Considerations

```
Screen Reader Announcements
═══════════════════════════════════════════════════

<div role="status" aria-live="polite">
  <svg class="animate-spin" aria-hidden="true">
    <!-- Spinner icon -->
  </svg>
  <span class="sr-only">Loading, please wait...</span>
</div>

Key Attributes:
• role="status" - Announces loading state
• aria-live="polite" - Non-intrusive announcement
• aria-hidden="true" - Hides spinner from screen readers
• sr-only text - Provides context for assistive tech
```

### Spinner Size Guidelines

| Size | Dimensions | Use Context |
|------|-----------|-------------|
| Small | 16px (1rem) | Inline text, small buttons |
| Medium | 24px (1.5rem) | Standard buttons, cards |
| Large | 32px (2rem) | Page sections, large buttons |
| Extra Large | 48px (3rem) | Full-page loading, splash screens |

### Performance Optimization

```
Spin Animation Performance
═══════════════════════════════════════════════════

GPU-Accelerated Properties:
✓ transform: rotate()  ← Smooth 60fps

Performance Characteristics:
• Infinite loop, continuous rendering
• Low CPU usage (GPU handles rotation)
• Battery-efficient
• No layout recalculation

Best Practices:
• Remove spinner when loading completes
• Don't render multiple spinners simultaneously
• Use CSS animation (not JavaScript)
```

### Expected Outcome
- Smooth 360-degree rotation
- Multiple speed variants
- Infinite loop animation
- Reverse spin option

### Verification Checklist
- [ ] spin keyframes defined
- [ ] spinReverse keyframes defined
- [ ] Spin keyframes added to Tailwind config
- [ ] spin animation utility created (1s)
- [ ] spin-fast variant created (0.5s)
- [ ] spin-slow variant created (2s)
- [ ] spin-reverse variant created
- [ ] Linear timing function used
- [ ] Infinite iteration configured
- [ ] Rotation values correct (0deg to 360deg)

---

## Task 79: Create Pulse Animation

### Overview
Create pulse animation for skeleton loaders and loading placeholders. The pulse animation creates a subtle breathing effect by smoothly transitioning opacity between two states, indicating that content is loading without being distracting.

### Dependencies
- Task 73: Transition duration scale defined

### Instructions

1. **Open global styles file**
   - Continue in `frontend/styles/globals.css`
   - Add to animations section

2. **Define pulse keyframes**
   - Create @keyframes pulse
   - Start (0%): opacity 1
   - Middle (50%): opacity 0.5
   - End (100%): opacity 1
   - Smooth breathing effect

3. **Define pulseGlow keyframes**
   - Create @keyframes pulseGlow
   - Start: opacity 0.6, scale 1
   - Middle: opacity 1, scale 1.05
   - End: opacity 0.6, scale 1
   - Combines opacity and subtle scale

4. **Add pulse keyframes to Tailwind config**
   - Open `tailwind.config.js`
   - Note: Tailwind has default 'pulse' but we'll enhance
   - Add pulse and pulseGlow to theme.extend.keyframes

5. **Create pulse animation utility**
   - In theme.extend.animation
   - Create 'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
   - Slow, smooth breathing

6. **Create pulse-fast variant**
   - Create 'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
   - Quicker pulsing for urgent loading

7. **Create pulse-slow variant**
   - Create 'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
   - Very subtle, background loading

8. **Create glow animation utility**
   - Create 'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
   - For notification badges, live indicators

### Pulse Animation Wave Pattern

```
Pulse Opacity Timeline (2s duration)
═══════════════════════════════════════════════════

Opacity
1.0 │█       █       █       █       Fully visible
    │ █     █ █     █ █     █ █
0.5 │  █   █   █   █   █   █   █     Half visible
    │   █ █     █ █     █ █     █
0.0 │    █       █       █       █   Invisible
    └─────────────────────────────────────────► Time
    0s      1s      2s      3s      4s

Effect: Smooth breathing, non-intrusive
Frequency: 0.5 cycles per second (every 2s)
```

### Pulse Speed Comparison

```
Visual Pulsing Speed
═══════════════════════════════════════════════════

Pulse Fast (1s cycle)
    ▓▒░▓▒░▓▒░▓▒░    Rapid breathing

Pulse Normal (2s cycle)
    ▓▒░  ▓▒░  ▓▒░  Standard skeleton loader

Pulse Slow (3s cycle)
    ▓▒░     ▓▒░     Subtle, background
```

### Pulse Animation Use Cases

| Component | Animation | Duration | Use Case |
|-----------|-----------|----------|----------|
| Skeleton text | pulse | 2s | Loading text placeholders |
| Skeleton card | pulse | 2s | Loading card content |
| Skeleton avatar | pulse | 2s | Loading user images |
| Live indicator | pulse-glow | 2s | Online status, live updates |
| Processing badge | pulse-fast | 1s | Urgent processing state |
| Background sync | pulse-slow | 3s | Non-intrusive sync status |

### Skeleton Loader Patterns

```
Text Skeleton Lines
═══════════════════════════════════════════════════

<div class="space-y-3">
  <div class="h-4 bg-muted animate-pulse rounded"></div>
  <div class="h-4 bg-muted animate-pulse rounded w-5/6"></div>
  <div class="h-4 bg-muted animate-pulse rounded w-4/6"></div>
</div>

Visual Effect:
████████████████████████  ← Full width, pulsing
████████████████████      ← 5/6 width, pulsing
████████████████          ← 4/6 width, pulsing


Card Skeleton
═══════════════════════════════════════════════════

<div class="border rounded-lg p-4 space-y-3">
  <!-- Avatar -->
  <div class="h-12 w-12 bg-muted animate-pulse rounded-full"></div>
  
  <!-- Text lines -->
  <div class="h-4 bg-muted animate-pulse rounded"></div>
  <div class="h-4 bg-muted animate-pulse rounded w-5/6"></div>
</div>

Visual Effect:
╔════════════════════════════════════╗
║ ◯ ← Avatar (pulsing)              ║
║                                    ║
║ ████████████████████ ← Text pulse ║
║ ████████████████ ← Text pulse     ║
╚════════════════════════════════════╝
```

### Pulse Glow Effect

```
PulseGlow Combined Animation
═══════════════════════════════════════════════════

Opacity + Scale Timeline
Opacity Scale
1.0  1.05│    ╱╲      ╱╲      ╱╲
         │   ╱  ╲    ╱  ╲    ╱  ╲
0.6  1.0 │──╱    ╲──╱    ╲──╱    ╲──
         └───────────────────────────► Time
         0s     1s     2s     3s

Effect: Gentle breathing with slight size change
Use: Notification badges, live indicators
```

### Live Indicator Examples

```
Online Status Badge
═══════════════════════════════════════════════════

<div class="relative">
  <img src="avatar.jpg" alt="User" />
  <div class="absolute bottom-0 right-0 
              h-3 w-3 bg-green-500 
              rounded-full animate-pulse-glow">
  </div>
</div>

Visual Effect:
    ╭───────╮
    │ Image │
    │       │
    ╰───────╯
          ◉  ← Green dot pulsing


Notification Badge
═══════════════════════════════════════════════════

<div class="relative">
  <BellIcon />
  <span class="absolute -top-1 -right-1 
               h-5 w-5 bg-red-500 
               text-white text-xs 
               rounded-full animate-pulse-glow">
    3
  </span>
</div>

Visual Effect:
     ③  ← Badge pulsing
    ╔═╗
    ║ ║ Bell icon
    ╚═╝
```

### Pulse Animation Timing Rationale

| Duration | Perception | Use Case |
|----------|------------|----------|
| 1s (fast) | Urgent, attention | Processing, urgent loading |
| 2s (normal) | Calm, standard | Skeleton loaders, placeholders |
| 3s (slow) | Subtle, ambient | Background sync, non-critical |

### Skeleton vs Spinner Decision

```
When to Use Pulse (Skeleton) vs Spin (Spinner)
═══════════════════════════════════════════════════

Use Pulse (Skeleton Loader):
✓ Loading content with known layout
✓ Initial page load
✓ Progressive content loading
✓ Multiple sections loading simultaneously
✓ Less intrusive, maintains layout

Use Spin (Spinner):
✓ Unknown load time
✓ Single operation (save, submit)
✓ Full-page blocking operation
✓ More attention-grabbing
✓ Clear "processing" feedback
```

### Multiple Skeleton Elements

```
Staggered Pulse Pattern
═══════════════════════════════════════════════════

Line 1: ████████ (pulse, no delay)
Line 2: ████████ (pulse, 100ms delay)
Line 3: ████████ (pulse, 200ms delay)

Effect: Wave-like cascading pulse
Implementation: Add animation-delay utility
```

### Accessibility Considerations

```
Screen Reader Support
═══════════════════════════════════════════════════

<div role="status" aria-label="Loading content">
  <div class="animate-pulse">
    <!-- Skeleton elements -->
  </div>
  <span class="sr-only">Loading, please wait...</span>
</div>

Motion Sensitivity:
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
    opacity: 0.5; /* Static muted appearance */
  }
}
```

### Expected Outcome
- Smooth opacity pulse animation
- Breathing effect for skeletons
- Glow variant with scale
- Multiple speed options

### Verification Checklist
- [ ] pulse keyframes defined
- [ ] pulseGlow keyframes defined
- [ ] Pulse keyframes added to Tailwind config
- [ ] pulse animation utility created (2s)
- [ ] pulse-fast variant created (1s)
- [ ] pulse-slow variant created (3s)
- [ ] pulse-glow animation utility created
- [ ] Opacity values correct (1 to 0.5 to 1)
- [ ] Infinite iteration configured
- [ ] Cubic bezier timing for smooth pulse

---

## Task 80: Create Shake Animation

### Overview
Create shake animation for error feedback and validation failures. The shake animation creates a horizontal wiggle effect that draws attention to errors, mimicking the real-world gesture of shaking one's head "no" to indicate rejection or incorrectness.

### Dependencies
- Task 73: Transition duration scale defined

### Instructions

1. **Open global styles file**
   - Continue in `frontend/styles/globals.css`
   - Add to animations section

2. **Define shake keyframes**
   - Create @keyframes shake
   - Use multiple steps for realistic shake
   - Translate X: 0 → -10px → 10px → -10px → 10px → 0
   - Diminishing intensity towards end

3. **Define detailed shake sequence**
   - 0%: translateX(0)
   - 10%: translateX(-10px)
   - 20%: translateX(10px)
   - 30%: translateX(-10px)
   - 40%: translateX(10px)
   - 50%: translateX(-5px)
   - 60%: translateX(5px)
   - 70%: translateX(-5px)
   - 80%: translateX(5px)
   - 90%: translateX(0)
   - 100%: translateX(0)

4. **Define shakeY keyframes**
   - Create @keyframes shakeY (vertical shake)
   - Same pattern but translateY
   - Alternative for different contexts

5. **Add shake keyframes to Tailwind config**
   - Open `tailwind.config.js`
   - Add shake and shakeY to theme.extend.keyframes

6. **Create shake animation utility**
   - In theme.extend.animation
   - Create 'shake': 'shake 0.5s ease-in-out'
   - Quick, attention-grabbing

7. **Create shake-slow variant**
   - Create 'shake-slow': 'shake 0.8s ease-in-out'
   - More noticeable, deliberate

8. **Create shake-y utility**
   - Create 'shake-y': 'shakeY 0.5s ease-in-out'
   - Vertical shake alternative

9. **Add usage notes**
   - Document trigger scenarios
   - Note: Not infinite, plays once on trigger
   - Requires JavaScript to add/remove class

### Shake Animation Motion Pattern

```
Horizontal Shake Movement
═══════════════════════════════════════════════════

Position (pixels)
+10 │   ╱╲    ╱╲     Rightward
    │  ╱  ╲  ╱  ╲
  0 │─╱    ╲╱    ╲─  Center
    │╱            ╲╲
-10 │              ╲─ Leftward
    └─────────────────────────────► Time
    0%   25%   50%   75%   100%

Movement Pattern:
Center → Left → Right → Left → Right → 
  Smaller left → Smaller right → Center

Total Duration: 500ms
```

### Shake Intensity Progression

```
Diminishing Shake Intensity
═══════════════════════════════════════════════════

Amplitude
10px │█ █                High intensity
     │ █ █
 5px │   █ █             Reduced intensity
     │     █ █
 0px │       █           Rest position
     └───────────────────────────────► Time
     0%  25%  50%  75%  100%

Effect: Starts strong, gradually settles
Perception: Natural, physical shake
```

### Shake Animation Use Cases

| Error Type | Animation | Trigger Event | User Feedback |
|-----------|-----------|---------------|---------------|
| Form validation | shake | Submit with errors | Invalid input indication |
| Wrong password | shake | Login failure | Incorrect credentials |
| Payment failure | shake | Transaction error | Payment rejected |
| Required field | shake | Blur empty field | Missing required info |
| Invalid format | shake | Real-time validation | Format mismatch |
| Duplicate entry | shake | Duplicate detected | Already exists |

### Error Feedback Patterns

```
Form Input Error Shake
═══════════════════════════════════════════════════

<input 
  class="border-red-500 focus:ring-red-500"
  classList:shake={hasError}
/>

Visual Effect:
╔═══════════════════════════════════╗
║  ⚠ Email is required              ║ ← Error message
║  ╔═══════════════════════════╗    ║
║  ║ [shaking input field]     ║    ║ ← Shakes horizontally
║  ╚═══════════════════════════╝    ║
╚═══════════════════════════════════╝


Login Form Error
═══════════════════════════════════════════════════

<form onSubmit={handleSubmit}>
  <input type="password" />
  <button>Login</button>
</form>

On Error:
╔═══════════════════════════════════╗
║  Username: ___________________    ║
║  Password: [shaking field]        ║ ← Shakes on wrong password
║  ⚠ Invalid credentials            ║ ← Error appears
║  [ Login ]                        ║
╚═══════════════════════════════════╝
```

### JavaScript Integration Pattern

```
Adding Shake Animation Dynamically
═══════════════════════════════════════════════════

// React/Next.js Pattern
const [isShaking, setIsShaking] = useState(false);

const triggerShake = () => {
  setIsShaking(true);
  setTimeout(() => setIsShaking(false), 500);
};

<input 
  className={isShaking ? 'animate-shake' : ''}
  onInvalid={triggerShake}
/>


// Vanilla JavaScript Pattern
const input = document.getElementById('email');

function showError() {
  input.classList.add('animate-shake');
  setTimeout(() => {
    input.classList.remove('animate-shake');
  }, 500);
}

input.addEventListener('invalid', showError);
```

### Shake Direction Comparison

```
Horizontal vs Vertical Shake
═══════════════════════════════════════════════════

Horizontal (shake):
  ◄──[ Element ]──►  Side-to-side motion
  Use: Most common, "no" gesture

Vertical (shake-y):
  [ Element ]
      ▲
      │
      ▼
  Use: Uncommon, alternative feedback
```

### Multi-Element Shake Scenarios

```
Cascading Error Shake
═══════════════════════════════════════════════════

Form with multiple errors:
  Field 1: Shake (0ms delay)
  Field 2: Shake (100ms delay)
  Field 3: Shake (200ms delay)

Effect: Wave of shakes down the form
Implementation: Staggered animation-delay


Grouped Field Shake
═══════════════════════════════════════════════════

All required fields shake simultaneously:
  ┌─ Name:     [shake]
  ├─ Email:    [shake]  ← All shake together
  └─ Phone:    [shake]

Effect: Immediate attention to all errors
```

### Shake Amplitude Guidelines

| Amplitude | Visual Effect | Use Case |
|-----------|---------------|----------|
| ±10px | Strong shake | Critical errors, payment failures |
| ±5px | Moderate shake | Standard validation errors |
| ±2px | Subtle shake | Minor issues, warnings |

### Shake Animation Psychology

```
User Perception
═══════════════════════════════════════════════════

Shake Motion:
• Mimics head shaking "no"
• Universal rejection gesture
• Clear error indication
• Attention-grabbing without modal

Effectiveness:
• Highly noticeable (99% recognition)
• Non-intrusive (no blocking)
• Quick feedback (500ms)
• Intuitive meaning (no explanation needed)
```

### Accessibility and Reduced Motion

```
Motion Sensitivity Handling
═══════════════════════════════════════════════════

Default: Shake animation enabled

Reduced Motion Preference:
@media (prefers-reduced-motion: reduce) {
  .animate-shake {
    animation: none;
    /* Use alternative feedback */
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
    /* Red glow instead of shake */
  }
}

Alternative Visual Cues:
• Red border flash
• Error icon appearance
• Color change
• Static error message
```

### Shake Timing Analysis

| Duration | Perception | Use Case |
|----------|------------|----------|
| 300ms | Very quick | Subtle feedback |
| 500ms (default) | Noticeable | Standard errors |
| 800ms (slow) | Deliberate | Critical errors |

### Expected Outcome
- Horizontal shake animation
- Diminishing intensity
- Vertical shake variant
- Error feedback mechanism

### Verification Checklist
- [ ] shake keyframes defined with multiple steps
- [ ] shakeY keyframes defined
- [ ] Shake keyframes added to Tailwind config
- [ ] shake animation utility created (0.5s)
- [ ] shake-slow variant created (0.8s)
- [ ] shake-y animation utility created
- [ ] TranslateX values correct (0, ±10px, ±5px)
- [ ] Diminishing intensity pattern correct
- [ ] Non-infinite (plays once)
- [ ] Ease-in-out timing applied

---

## Summary

This document established the complete animation system for the design system:

### Completed Animations
- ✅ Transition duration scale (75ms to 500ms)
- ✅ Transition timing functions (ease-in, ease-out, ease-in-out, sharp, smooth, bounce-in)
- ✅ Fade animations (fade-in, fade-out with variants)
- ✅ Slide animations (all four directions: up, down, left, right)
- ✅ Scale animations (scale-in with bounce variant)
- ✅ Spin animations (loading spinners with speed variants)
- ✅ Pulse animations (skeleton loaders with glow variant)
- ✅ Shake animations (error feedback with vertical variant)

### Key Achievements
1. **Performance-Optimized** - All animations use GPU-accelerated properties
2. **Comprehensive Coverage** - Animations for all common UI patterns
3. **Flexible Variants** - Multiple speed and intensity options
4. **Accessibility-Aware** - Considers reduced motion preferences
5. **Consistent Timing** - Unified duration scale across all animations

### Animation Usage Summary

| Animation Type | Primary Use | Duration | Timing Function |
|---------------|-------------|----------|-----------------|
| Fade | Modals, overlays | 200ms | ease-out |
| Slide | Drawers, toasts | 300ms | smooth/ease-out |
| Scale | Dialog entrance | 200ms | ease-out |
| Spin | Loading states | 1s | linear |
| Pulse | Skeletons | 2s | cubic-bezier |
| Shake | Error feedback | 500ms | ease-in-out |

### Next Steps
Proceed to [02_Tasks-81-86_Accessibility-GlobalStyles.md](02_Tasks-81-86_Accessibility-GlobalStyles.md) to implement accessibility utilities (focus rings, disabled states), custom scrollbar styles, text selection styling, global body styles, and final verification.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~980
