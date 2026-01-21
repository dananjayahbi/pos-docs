# Group F: Animations, Utilities & Global Styles

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** F of F  
> **Tasks Covered:** 73-86  
> **Group Goal:** Create animations, accessibility utilities, and finalize global styles

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Responsive-Design-Breakpoints](../Group-E_Responsive-Design-Breakpoints/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-03_Component-Library-Setup](../SubPhase-03_Component-Library-Setup/)

---

## Group Overview

This group completes the design system with animations, accessibility utilities, and global styles. Defines transition duration and timing function scales. Creates keyframe animations for fade, slide, scale, spin, pulse, and shake effects. Implements accessibility utilities for focus rings and disabled states. Customizes scrollbar appearance and text selection colors. Finalizes global body styles and creates comprehensive documentation.

### Key Outcomes

- Transition duration scale (75ms to 500ms)
- Transition timing functions
- Fade animation keyframes
- Slide animations (up, down, left, right)
- Scale animation for modals
- Spin animation for loaders
- Pulse animation for skeletons
- Shake animation for errors
- Focus ring styles (accessibility)
- Disabled state styles
- Custom scrollbar styles
- Text selection highlight
- Global body styles
- Final verification completed
- Style guide documentation

### Technology Context

- **Animations:** CSS keyframes with Tailwind
- **Accessibility:** WCAG 2.1 focus indicators
- **Transitions:** Smooth, performant animations
- **Scrollbar:** WebKit custom styling

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-73-80_Transitions-Animations.md` | Define transitions and animation keyframes | 73-80 |
| 02 | `02_Tasks-81-86_Accessibility-GlobalStyles.md` | Create accessibility utilities and finalize styles | 81-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 73 | Define Transition Duration Scale | Low | Task 02 |
| 74 | Define Transition Timing Functions | Low | Task 02 |
| 75 | Create Fade Animation | Low | Task 73 |
| 76 | Create Slide Animations | Medium | Task 73 |
| 77 | Create Scale Animation | Low | Task 73 |
| 78 | Create Spin Animation | Low | Task 73 |
| 79 | Create Pulse Animation | Low | Task 73 |
| 80 | Create Shake Animation | Low | Task 73 |
| 81 | Configure Focus Ring Styles | Medium | Task 24 |
| 82 | Create Disabled State Styles | Low | Task 02 |
| 83 | Create Scrollbar Styles | Low | Task 05 |
| 84 | Create Selection Styles | Low | Task 05 |
| 85 | Create Global Body Styles | Low | Task 05 |
| 86 | Final Verification & Documentation | Medium | Task 85 |

---

## Execution Order

```
Task 73: Transition Duration Scale
    │
    ▼
Task 74: Timing Functions
    │
    ├──────────────────────────────────────────────────────┐
    ▼                                                      ▼
Tasks 75-80: Animations                               Task 81
(fade, slide, scale, spin, pulse, shake)              (focus rings)
    │                                                      │
    └──────────────────────┬───────────────────────────────┘
                           ▼
                      Task 82: Disabled States
                           │
                           ├──────────────────────┐
                           ▼                      ▼
                      Task 83               Task 84
                      (scrollbar)           (selection)
                           │                      │
                           └──────────┬───────────┘
                                      ▼
                                 Task 85: Body Styles
                                      │
                                      ▼
                                 Task 86: Verification & Docs
```

---

## Expected Deliverables

```
frontend/
├── styles/
│   └── globals.css         # Global styles, animations
├── tailwind.config.js      # Animation configuration
└── docs/
    └── design-system/
        ├── animations.md   # Animation documentation
        └── style-guide.md  # Complete style guide
```

---

## Notes for AI Agents

### Transition Duration Scale (Task 73)
| Name | Value | Usage |
|------|-------|-------|
| 75 | 75ms | Instant feedback |
| 100 | 100ms | Quick transitions |
| 150 | 150ms | Default |
| 200 | 200ms | Standard |
| 300 | 300ms | Deliberate |
| 500 | 500ms | Slow emphasis |

### Timing Functions (Task 74)
| Name | Value | Usage |
|------|-------|-------|
| ease-in | cubic-bezier(0.4, 0, 1, 1) | Exit animations |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | Enter animations |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | Transitions |

### Animation Keyframes (Tasks 75-80)
| Animation | Usage |
|-----------|-------|
| fade-in | Modal/popover appearance |
| fade-out | Modal/popover dismiss |
| slide-in-up | Toast notifications |
| slide-in-down | Dropdown menus |
| slide-in-left | Sidebar appearance |
| slide-in-right | Sheet appearance |
| scale-in | Modal zoom effect |
| spin | Loading spinners |
| pulse | Skeleton loaders |
| shake | Error feedback |

### Focus Ring Configuration (Task 81)
- 2px ring offset
- Primary color ring
- Visible on focus-visible
- High contrast for accessibility

### Disabled State Styles (Task 82)
- Opacity: 0.5
- Cursor: not-allowed
- No pointer events

### Scrollbar Styles (Task 83)
```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: var(--muted);
  border-radius: 4px;
}
```

### Selection Styles (Task 84)
```css
::selection {
  background: hsl(var(--primary) / 0.2);
  color: hsl(var(--primary));
}
```

### Global Body Styles (Task 85)
- Background: var(--background)
- Color: var(--foreground)
- Font-family: Inter, system fonts
- Font-smoothing: antialiased
- Min-height: 100vh

### Verification Checklist (Task 86)
- [ ] All colors render correctly
- [ ] Typography is consistent
- [ ] Animations are smooth
- [ ] Focus states are visible
- [ ] Dark mode works
- [ ] Print styles work
- [ ] No console errors
