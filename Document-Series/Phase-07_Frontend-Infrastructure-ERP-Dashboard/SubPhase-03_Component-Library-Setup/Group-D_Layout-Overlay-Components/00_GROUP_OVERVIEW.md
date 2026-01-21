# Group D: Layout & Overlay Components

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Install layout containers and overlay components for modals, drawers, and menus

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Form-Components](../Group-C_Form-Components/)
- **→ Next Group:** [Group-E_Data-Display-Feedback-Components](../Group-E_Data-Display-Feedback-Components/)

---

## Group Overview

This group installs layout and overlay components for organizing content and displaying floating UI elements. Adds Card component with StatCard variant for dashboard KPIs. Installs Tabs with underline, pills, and enclosed variants. Adds Accordion for collapsible sections. Installs overlay components: Dialog for modals with ConfirmDialog and FormDialog wrappers, Sheet for side panels, DropdownMenu and ContextMenu for menus, Popover and Tooltip for hints, and Command component for a CommandPalette with keyboard shortcuts.

### Key Outcomes

- Card with header, content, footer
- StatCard for dashboard KPIs
- Tabs with variants (underline, pills, enclosed)
- Accordion for collapsible content
- Dialog (modal) component
- ConfirmDialog for destructive actions
- FormDialog for form modals
- Sheet (drawer) component
- SidePanel for detail views
- DropdownMenu with sub-menus
- ContextMenu for right-click
- Popover for floating content
- Tooltip for hover hints
- Command component installed
- CommandPalette with Cmd+K shortcut

### Technology Context

- **Overlays:** Radix UI Dialog, Sheet
- **Menus:** Radix UI DropdownMenu, ContextMenu
- **Popovers:** Radix UI Popover, Tooltip
- **Command:** cmdk (command palette)
- **Animation:** Tailwind transitions

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-56_Card-Tabs-Dialog.md` | Install Card, Tabs, and Dialog components | 49-56 |
| 02 | `02_Tasks-57-64_Sheet-Menus-Command.md` | Install Sheet, menus, and Command palette | 57-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Install Card Component | Low | Task 14 |
| 50 | Create StatCard Component | Low | Task 49 |
| 51 | Install Tabs Component | Low | Task 14 |
| 52 | Customize Tabs Variants | Low | Task 51 |
| 53 | Install Accordion Component | Low | Task 14 |
| 54 | Install Dialog Component | Low | Task 14 |
| 55 | Create ConfirmDialog Component | Medium | Task 54 |
| 56 | Create FormDialog Component | Medium | Task 54 |
| 57 | Install Sheet Component | Low | Task 14 |
| 58 | Create SidePanel Component | Low | Task 57 |
| 59 | Install Dropdown Menu Component | Low | Task 14 |
| 60 | Install Context Menu Component | Low | Task 14 |
| 61 | Install Popover Component | Low | Task 14 |
| 62 | Install Tooltip Component | Low | Task 14 |
| 63 | Install Command Component | Low | Task 14 |
| 64 | Create CommandPalette Component | Medium | Task 63 |

---

## Execution Order

```
Task 49: Install Card
    │
    ▼
Task 50: StatCard
    │
    ▼
Task 51: Install Tabs
    │
    ▼
Task 52: Tabs Variants
    │
    ▼
Task 53: Install Accordion
    │
    ▼
Task 54: Install Dialog
    │
    ├──────────────────────┐
    ▼                      ▼
Task 55               Task 56
(ConfirmDialog)       (FormDialog)
    │                      │
    └──────────┬───────────┘
               ▼
          Task 57: Install Sheet
               │
               ▼
          Task 58: SidePanel
               │
               ├──────────────────────┬───────────┐
               ▼                      ▼           ▼
          Task 59               Tasks 60-62  Task 63
          (DropdownMenu)        (Context,    (Command)
                                Popover,          │
                                Tooltip)          ▼
                                             Task 64
                                             (CommandPalette)
```

---

## Expected Deliverables

```
frontend/components/ui/
├── accordion.tsx
├── card.tsx
├── command.tsx
├── context-menu.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── popover.tsx
├── sheet.tsx
├── tabs.tsx
└── tooltip.tsx

frontend/components/composite/
├── stat-card.tsx
├── confirm-dialog.tsx
├── form-dialog.tsx
├── side-panel.tsx
└── command-palette.tsx
```

---

## Notes for AI Agents

### StatCard Props
- title: KPI name
- value: Numeric value
- change: Percentage change
- trend: up/down/neutral
- icon: Lucide icon name
- description: Subtitle text

### Tabs Variants (Task 52)
| Variant | Style |
|---------|-------|
| default | Underline indicator |
| pills | Rounded pill buttons |
| enclosed | Bordered container |

### ConfirmDialog Props
- title: Dialog title
- description: Confirmation message
- confirmText: Confirm button label
- cancelText: Cancel button label
- variant: default/destructive
- onConfirm: Confirm handler

### FormDialog Props
- title: Dialog title
- description: Form description
- trigger: Trigger element
- children: Form content
- onSubmit: Submit handler
- isSubmitting: Loading state

### SidePanel Props
- title: Panel title
- children: Panel content
- open: Open state
- onOpenChange: State handler
- side: left/right
- size: sm/md/lg

### CommandPalette Features
- Cmd+K / Ctrl+K keyboard shortcut
- Search filtering
- Grouped commands
- Recent items
- Navigation shortcuts
- Action shortcuts
