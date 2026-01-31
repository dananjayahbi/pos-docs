# Tasks 53-62: Input and Upload Components

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** D - Input & Actions  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-68_Emoji-Handoff.md](02_Tasks-63-68_Emoji-Handoff.md)

---

## Document Overview

This document covers the creation of chat input and file upload components for the AI chatbot interface. It establishes the foundational input system including text area with auto-resize, send button functionality, keyboard handlers, character limit validation, file attachment capabilities, and upload progress indicators.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create ChatInput Component | Medium | 45 min |
| 54 | Create Input Field | Low | 25 min |
| 55 | Create Send Button | Low | 20 min |
| 56 | Create Enter Key Handler | Low | 15 min |
| 57 | Create Shift+Enter | Low | 15 min |
| 58 | Create Character Limit | Low | 20 min |
| 59 | Create AttachButton | Low | 20 min |
| 60 | Create FileUpload | Medium | 35 min |
| 61 | Create ImageUpload | Medium | 35 min |
| 62 | Create UploadProgress | Low | 25 min |

---

## Task 53: Create ChatInput Component

### Overview
Create the main ChatInput component that serves as the container for all chat input functionality. This component manages the overall input state, coordinates between different input elements, and provides the primary interface for users to compose and send messages to the AI chatbot.

### Dependencies
- SubPhase-06 (Chat Layout & Header) must be complete
- React context for chat state management
- TypeScript interfaces for message types

### Instructions

1. **Create chat components directory**
   - Navigate to `frontend/components/` directory
   - Create new directory named `chat` if not exists
   - This will house all chatbot UI components

2. **Create ChatInput component file**
   - Create `ChatInput.tsx` in `components/chat/` directory
   - Set up TypeScript React functional component structure
   - Import necessary React hooks and types

3. **Define component state interface**
   - Create `ChatInputState` interface
   - Include message text, character count, upload files
   - Include loading states and disabled states

4. **Initialize component state**
   - Use `useState` for input value tracking
   - Use `useState` for character count management
   - Use `useState` for file attachment state
   - Use `useState` for send loading state

5. **Create component props interface**
   - Define `ChatInputProps` interface
   - Include `onSendMessage` callback function
   - Include optional `disabled` prop for external control
   - Include `maxCharacters` prop (default: 500)

6. **Implement main container structure**
   - Create wrapper div with proper spacing and borders
   - Use flexbox layout for input field and action buttons
   - Apply responsive padding and margin
   - Add subtle shadow and border styling

7. **Plan child component integration**
   - Input field will be rendered in left section
   - Action buttons (send, attach) in right section
   - Character counter below input field
   - Upload progress indicators below container

### Component State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| inputValue | string | Current message text |
| characterCount | number | Character count tracker |
| attachedFiles | File[] | Uploaded file list |
| isLoading | boolean | Send operation status |
| isDisabled | boolean | Input disabled state |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onSendMessage | (message: string, files?: File[]) => void | Yes | - | Message send callback |
| disabled | boolean | No | false | External disable control |
| maxCharacters | number | No | 500 | Character limit |
| placeholder | string | No | "Type a message..." | Input placeholder text |

### Container Layout Structure

```
┌─────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌─────────┐  │
│  │                      │  │ Actions │  │
│  │    Input Field       │  │ Send    │  │
│  │   (Task 54-58)       │  │ Attach  │  │
│  │                      │  │         │  │
│  └──────────────────────┘  └─────────┘  │
│  Character Count: 45/500                │
│  ┌─────────────────────────────────────┐ │
│  │    Upload Progress (Task 62)        │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `border border-gray-300 rounded-lg bg-white shadow-sm` | Card appearance |
| Layout | `flex flex-col gap-2 p-4` | Internal structure |
| Input Area | `flex gap-3 items-end` | Input and actions |
| Meta Area | `flex justify-between items-center text-sm` | Counter and status |

### Expected Outcome
- Functional container component for chat input
- State management for input and file operations
- Proper TypeScript interfaces and props
- Layout structure ready for child components

### Verification Checklist
- [ ] `frontend/components/chat/ChatInput.tsx` file created
- [ ] Component state properly initialized
- [ ] Props interface defined with required callbacks
- [ ] Container layout structure implemented
- [ ] Styling applied for professional appearance
- [ ] Component exports properly
- [ ] TypeScript types defined correctly

---

## Task 54: Create Input Field

### Overview
Create the text input field component within ChatInput that handles message composition. This component features auto-resizing textarea functionality, proper placeholder text, focus management, and integration with the parent ChatInput state management system.

### Dependencies
- Task 53: Create ChatInput Component

### Instructions

1. **Create input subdirectory**
   - Navigate to `components/chat/` directory
   - Create new directory named `input`
   - This will house input-related components

2. **Create InputField component**
   - Create `InputField.tsx` in `components/chat/input/` directory
   - Set up as a controlled component with props
   - Import necessary React hooks

3. **Define component props interface**
   - Create `InputFieldProps` interface
   - Include `value`, `onChange`, `placeholder` props
   - Include `disabled`, `maxLength`, `onKeyPress` props
   - Include optional `autoFocus` and `className` props

4. **Implement textarea element**
   - Use HTML `textarea` element for multi-line support
   - Set `rows` attribute to 1 for initial height
   - Configure `cols` for width (handled by CSS)
   - Set proper `name` and `id` attributes

5. **Add auto-resize functionality**
   - Use `useRef` to reference textarea element
   - Implement `useEffect` to adjust height on value changes
   - Calculate height based on `scrollHeight` property
   - Set minimum height (1 row) and maximum height (4 rows)

6. **Handle input value changes**
   - Implement `onChange` handler
   - Call parent `onChange` prop with updated value
   - Update character count in parent component
   - Trigger auto-resize calculation

7. **Apply textarea styling**
   - Remove default browser styling (`resize: none`)
   - Add padding for comfortable text entry
   - Set font family and size for readability
   - Configure border and focus states

8. **Implement accessibility features**
   - Add proper `aria-label` attributes
   - Set `aria-describedby` for character counter
   - Ensure proper tab order and focus management

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current input value |
| onChange | (value: string) => void | Yes | - | Value change handler |
| placeholder | string | No | "Type a message..." | Placeholder text |
| disabled | boolean | No | false | Input disabled state |
| maxLength | number | No | 500 | Maximum character limit |
| onKeyPress | (event: KeyboardEvent) => void | No | - | Key press handler |
| autoFocus | boolean | No | false | Auto focus on mount |
| className | string | No | "" | Additional CSS classes |

### Auto-Resize Implementation

| Measurement | Value | Purpose |
|-------------|-------|---------|
| Min Height | 40px (1 row) | Single line minimum |
| Max Height | 160px (4 rows) | Multi-line maximum |
| Line Height | 20px | Consistent spacing |
| Calculation | `Math.min(scrollHeight, maxHeight)` | Dynamic sizing |

### Textarea Styling

```
┌─────────────────────────────────────┐
│ Type a message...                   │ ← Placeholder
│                                     │
│                                     │ ← Auto-resize area
│                                     │   (1-4 rows)
└─────────────────────────────────────┘
```

### Auto-Resize Logic

| Condition | Action | Result |
|-----------|--------|--------|
| Text increases | Calculate scrollHeight | Grow if under max |
| Text decreases | Reset height to auto | Shrink to content |
| Max reached | Stop growing | Show scroll if needed |
| Empty input | Reset to min height | Single row display |

### Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Border | `border-0 outline-none` | Clean appearance |
| Padding | `p-3` | Comfortable typing |
| Font | `text-sm font-normal` | Readable text |
| Background | `bg-transparent` | Inherit from container |
| Resize | `resize-none` | Controlled by auto-resize |

### Expected Outcome
- Functional auto-resizing textarea input
- Proper controlled component behavior
- Accessibility features implemented
- Clean, focused appearance

### Verification Checklist
- [ ] `frontend/components/chat/input/InputField.tsx` file created
- [ ] Auto-resize functionality working correctly
- [ ] Controlled component with proper props
- [ ] Placeholder text displays correctly
- [ ] Focus and blur states handled properly
- [ ] Accessibility attributes added
- [ ] Component integrates with ChatInput parent
- [ ] Styling matches design requirements

---

## Task 55: Create Send Button

### Overview
Create the send button component that triggers message submission in the chat interface. This button features dynamic enable/disable states based on input content, loading indicators during message sending, and proper accessibility features for keyboard navigation.

### Dependencies
- Task 54: Create Input Field

### Instructions

1. **Create SendButton component**
   - Create `SendButton.tsx` in `components/chat/input/` directory
   - Set up as a functional component with props
   - Import Lucide React icons for send icon

2. **Define component props interface**
   - Create `SendButtonProps` interface
   - Include `onClick` callback function
   - Include `disabled` and `loading` state props
   - Include optional `className` prop for styling

3. **Implement button element**
   - Use HTML `button` element with proper type
   - Set `type="button"` to prevent form submission
   - Add `onClick` handler from props
   - Configure `disabled` attribute based on props

4. **Add send icon implementation**
   - Import `Send` icon from Lucide React
   - Position icon inside button element
   - Set appropriate icon size (16px or 20px)
   - Apply proper icon color and hover states

5. **Implement button states**
   - Default state: Enabled with send icon
   - Disabled state: Grayed out, no interaction
   - Loading state: Show spinner instead of icon
   - Hover state: Subtle color change

6. **Add loading spinner**
   - Import or create spinner component
   - Replace send icon when loading prop is true
   - Use `Loader2` icon from Lucide with rotation
   - Maintain same size as send icon

7. **Apply button styling**
   - Primary blue background color
   - White icon color for contrast
   - Rounded corners for modern appearance
   - Proper padding for touch targets (44px min)

8. **Implement accessibility features**
   - Add `aria-label` for screen readers
   - Set proper `aria-disabled` when disabled
   - Ensure focus indicators are visible
   - Add loading state announcements

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClick | () => void | Yes | - | Button click handler |
| disabled | boolean | No | false | Button disabled state |
| loading | boolean | No | false | Loading state display |
| className | string | No | "" | Additional CSS classes |

### Button States

| State | Appearance | Behavior | Icon |
|-------|------------|----------|------|
| Default | Blue background, white icon | Clickable | Send |
| Disabled | Gray background, gray icon | No interaction | Send |
| Loading | Blue background, spinning | No interaction | Spinner |
| Hover | Darker blue background | Clickable | Send |

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Background | `bg-blue-600 hover:bg-blue-700` | Primary action color |
| Text Color | `text-white` | Icon contrast |
| Padding | `p-3` | Touch-friendly size |
| Border Radius | `rounded-lg` | Modern appearance |
| Transition | `transition-colors duration-200` | Smooth state changes |
| Disabled | `disabled:bg-gray-400 disabled:cursor-not-allowed` | Inactive state |

### Button Visual Structure

```
┌─────────┐
│    →    │  ← Send icon (normal state)
└─────────┘

┌─────────┐
│    ⟳    │  ← Spinner icon (loading state)
└─────────┘

┌─────────┐
│    →    │  ← Grayed out (disabled state)
└─────────┘
```

### Icon Implementation

| Icon | Library | Size | Use Case |
|------|---------|------|----------|
| Send | Lucide React | 20px | Default state |
| Loader2 | Lucide React | 20px | Loading state |

### Loading State Logic

| Condition | Icon | Disabled | Cursor |
|-----------|------|----------|--------|
| loading=true | Spinner | Yes | not-allowed |
| disabled=true | Send | Yes | not-allowed |
| Normal | Send | No | pointer |

### Expected Outcome
- Functional send button with multiple states
- Proper visual feedback for user interactions
- Accessibility compliant implementation
- Smooth transitions between states

### Verification Checklist
- [ ] `frontend/components/chat/input/SendButton.tsx` file created
- [ ] Button responds to click events correctly
- [ ] Disabled state prevents interactions
- [ ] Loading state shows spinner animation
- [ ] Hover states provide visual feedback
- [ ] Send icon displays properly
- [ ] Accessibility attributes implemented
- [ ] Component integrates with ChatInput parent

---

## Task 56: Create Enter Key Handler

### Overview
Create the Enter key event handler that enables users to send messages by pressing the Enter key. This handler distinguishes between Enter (send message) and Shift+Enter (new line), provides proper event prevention, and integrates seamlessly with the ChatInput component's message sending functionality.

### Dependencies
- Task 55: Create Send Button

### Instructions

1. **Identify handler implementation location**
   - Modify the InputField component created in Task 54
   - Add key event handling to the textarea element
   - Integrate with existing ChatInput state management

2. **Create key handler function**
   - Implement `handleKeyPress` function inside InputField
   - Accept `KeyboardEvent<HTMLTextAreaElement>` as parameter
   - Check for Enter key press and modifier keys
   - Call parent component's send message function

3. **Implement Enter key detection**
   - Check if `event.key === 'Enter'`
   - Verify no modifier keys are pressed (shift, ctrl, alt)
   - Use `!event.shiftKey` to exclude Shift+Enter
   - Use `!event.ctrlKey` and `!event.altKey` for completeness

4. **Add event prevention logic**
   - Call `event.preventDefault()` when sending
   - Prevent default textarea newline insertion
   - Allow natural behavior for Shift+Enter
   - Maintain proper cursor position

5. **Integrate with send message flow**
   - Check if input value is not empty or whitespace
   - Call parent component's `onSendMessage` callback
   - Pass current input value to callback
   - Clear input field after successful send

6. **Handle edge cases**
   - Trim whitespace before checking empty state
   - Prevent sending empty messages
   - Handle component disabled state
   - Prevent sending during loading state

7. **Update InputField props interface**
   - Add `onSendMessage` prop to InputField
   - Update parent ChatInput to pass callback
   - Ensure proper TypeScript typing

8. **Add accessibility announcements**
   - Consider screen reader announcements
   - Provide keyboard shortcut hints
   - Document keyboard behavior for users

### Key Handler Logic Flow

```
User presses key
        │
        ▼
   Is it Enter?
        │
    No  │  Yes
        ▼    │
   Normal    ▼
   behavior  Is Shift pressed?
             │
         Yes │  No
             ▼    │
        Allow      ▼
        newline    Is input empty?
                   │
               Yes │  No
                   ▼    │
              Block     ▼
              sending   Send message
                        │
                        ▼
                   Clear input
```

### Event Handler Props

| Prop | Type | Required | Purpose |
|------|------|----------|---------|
| onSendMessage | (message: string) => void | Yes | Message send callback |
| disabled | boolean | No | Prevent key handling |
| loading | boolean | No | Block during send operation |

### Key Combination Behaviors

| Key Combination | Action | Prevent Default |
|-----------------|--------|-----------------|
| Enter | Send message | Yes |
| Shift + Enter | Insert newline | No |
| Ctrl + Enter | Send message | Yes (optional) |
| Alt + Enter | Normal behavior | No |

### Input Validation Logic

| Condition | Action | Reason |
|-----------|--------|---------|
| Empty string | Block send | No content |
| Whitespace only | Block send | No meaningful content |
| Has content | Allow send | Valid message |
| Disabled state | Block send | Component disabled |
| Loading state | Block send | Previous send in progress |

### Handler Implementation Structure

```javascript
const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  // Check for Enter key
  if (event.key === 'Enter' && !event.shiftKey) {
    // Prevent default newline
    event.preventDefault();
    
    // Validate input
    if (canSendMessage()) {
      // Send message
      onSendMessage(inputValue.trim());
    }
  }
};
```

### Integration Points

| Component | Integration | Purpose |
|-----------|-------------|---------|
| InputField | Add onKeyPress prop | Handle key events |
| ChatInput | Pass onSendMessage | Connect to send logic |
| SendButton | Share send logic | Consistent behavior |

### Expected Outcome
- Enter key sends messages immediately
- Shift+Enter creates new lines naturally
- Empty/whitespace messages are blocked
- Proper integration with existing components

### Verification Checklist
- [ ] Enter key handler implemented in InputField
- [ ] Enter key sends message and clears input
- [ ] Shift+Enter creates new line without sending
- [ ] Empty messages are properly blocked
- [ ] Whitespace-only messages are blocked
- [ ] Handler respects disabled and loading states
- [ ] Event.preventDefault() called appropriately
- [ ] TypeScript types updated correctly

---

## Task 57: Create Shift+Enter New Line

### Overview
Enhance the Enter key handler to properly support Shift+Enter for creating new lines within the chat input. This functionality allows users to compose multi-line messages while maintaining the Enter-to-send behavior, providing a natural and intuitive text input experience.

### Dependencies
- Task 56: Create Enter Key Handler

### Instructions

1. **Review existing key handler**
   - Examine the `handleKeyPress` function from Task 56
   - Identify the Shift+Enter condition check
   - Ensure Shift+Enter bypasses the send logic

2. **Verify Shift+Enter behavior**
   - Confirm `event.shiftKey` check is working
   - Test that Shift+Enter doesn't prevent default behavior
   - Allow natural textarea newline insertion

3. **Test multi-line input handling**
   - Verify textarea auto-resize works with newlines
   - Check that character counting includes newlines
   - Ensure proper display of multi-line content

4. **Update user experience guidance**
   - Document keyboard shortcuts for users
   - Consider adding tooltip or help text
   - Ensure consistent behavior across browsers

5. **Handle cursor position**
   - Verify cursor position after newline insertion
   - Ensure proper text selection behavior
   - Test with existing text and cursor placement

6. **Validate with auto-resize**
   - Test Shift+Enter with textarea auto-resize
   - Ensure height adjusts properly for new lines
   - Verify maximum height constraints still apply

7. **Test edge cases**
   - Shift+Enter at beginning of input
   - Shift+Enter at end of input
   - Shift+Enter in middle of existing text
   - Multiple consecutive Shift+Enter presses

8. **Cross-browser compatibility**
   - Test behavior in Chrome, Firefox, Safari
   - Verify consistent newline character handling
   - Check for any browser-specific quirks

### Shift+Enter Logic Enhancement

```
User presses Shift+Enter
        │
        ▼
Check event.shiftKey === true
        │
        ▼
Allow default textarea behavior
        │
        ▼
Insert newline character (\n)
        │
        ▼
Trigger auto-resize recalculation
        │
        ▼
Update character count
```

### Key Combination Matrix

| Keys Pressed | Action Taken | Default Prevented |
|--------------|--------------|-------------------|
| Enter | Send message | Yes |
| Shift + Enter | Insert newline | No |
| Ctrl + Enter | Send message (optional) | Yes |
| Alt + Enter | No special action | No |

### Multi-line Text Handling

| Scenario | Behavior | Expected Result |
|----------|----------|----------------|
| First line + Shift+Enter | Add newline | Two lines total |
| Multiple Shift+Enter | Add multiple newlines | Multiple lines |
| Max height reached | Show scrollbar | Maintain height limit |
| Character limit | Count newlines | Include in limit |

### Auto-Resize Integration

| Event | Trigger | Result |
|-------|---------|--------|
| Shift+Enter pressed | Newline added | Height recalculated |
| Content height changes | Auto-resize function | Adjust textarea height |
| Max height exceeded | Scroll behavior | Show vertical scrollbar |

### Character Count Considerations

| Character Type | Count Behavior | Reason |
|----------------|----------------|---------|
| Regular text | Count as 1 | Standard characters |
| Newline (\n) | Count as 1 | Line break character |
| Carriage return | Normalize to \n | Cross-platform consistency |
| Spaces/tabs | Count normally | Whitespace is content |

### User Experience Guidelines

| Feature | Implementation | User Benefit |
|---------|----------------|--------------|
| Visual hint | Subtle text below input | Clear interaction guide |
| Consistent behavior | Same across all browsers | Predictable experience |
| Responsive feedback | Immediate height adjustment | Natural text editing |

### Testing Scenarios

| Test Case | Steps | Expected Outcome |
|-----------|-------|------------------|
| Basic newline | Type text, Shift+Enter, type more | Two lines displayed |
| Height adjustment | Add multiple lines via Shift+Enter | Textarea grows properly |
| Character limit | Reach limit with newlines | Proper counting behavior |
| Send after newline | Multi-line text, then Enter | Message sends with formatting |

### Expected Outcome
- Shift+Enter creates new lines naturally
- Auto-resize adjusts for multi-line content
- Character counting includes newline characters
- Consistent behavior across browsers

### Verification Checklist
- [ ] Shift+Enter creates new line without sending
- [ ] Auto-resize works correctly with newlines
- [ ] Character counter includes newline characters
- [ ] Cursor position maintained correctly
- [ ] Multiple consecutive newlines handled properly
- [ ] Maximum height constraints respected
- [ ] Cross-browser compatibility verified
- [ ] User experience is intuitive and natural

---

## Task 58: Create Character Limit

### Overview
Implement character limit functionality for the chat input field with a maximum of 500 characters. This feature includes real-time character counting, visual feedback when approaching the limit, input blocking at the maximum, and user-friendly notifications about the character restrictions.

### Dependencies
- Task 57: Create Shift+Enter New Line

### Instructions

1. **Create CharacterCounter component**
   - Create `CharacterCounter.tsx` in `components/chat/input/` directory
   - Design as a display-only component
   - Accept current count and maximum limit as props

2. **Define CharacterCounter props**
   - Create `CharacterCounterProps` interface
   - Include `currentCount` number prop
   - Include `maxCount` number prop (default: 500)
   - Include optional `className` for styling

3. **Implement character counting logic**
   - Add character counting to ChatInput component
   - Count all characters including spaces and newlines
   - Use `string.length` property for accurate counting
   - Update count state on every input change

4. **Add visual feedback states**
   - Normal state: Hidden or subtle gray counter
   - Warning state: Show counter when > 400 characters
   - Danger state: Red counter when > 475 characters
   - Max state: Red counter and input blocking at 500

5. **Implement input blocking**
   - Modify InputField to accept maxLength prop
   - Prevent typing when character limit reached
   - Allow deletion when at maximum
   - Handle paste operations that exceed limit

6. **Create warning thresholds**
   - Show counter at 80% of limit (400/500 chars)
   - Yellow/orange color at 90% of limit (450/500 chars)
   - Red color at 95% of limit (475/500 chars)
   - Block input at 100% of limit (500/500 chars)

7. **Handle paste operations**
   - Intercept paste events in InputField
   - Trim pasted content to remaining character limit
   - Show notification when content is trimmed
   - Update character count after paste

8. **Add accessibility features**
   - Use `aria-describedby` to link counter with input
   - Announce character limit warnings to screen readers
   - Provide `aria-live` regions for dynamic updates

### Character Counter Display States

| Characters Used | Display State | Text Color | Visibility |
|----------------|---------------|------------|------------|
| 0-399 | Hidden | - | Hidden |
| 400-449 | Normal | Gray | Visible |
| 450-474 | Warning | Orange | Visible |
| 475-499 | Danger | Red | Visible |
| 500 | Maximum | Red | Visible |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentCount | number | Yes | - | Current character count |
| maxCount | number | No | 500 | Maximum allowed characters |
| className | string | No | "" | Additional CSS classes |

### Character Counting Rules

| Text Element | Count Behavior | Example |
|--------------|----------------|---------|
| Regular characters | Count as 1 each | "Hello" = 5 |
| Spaces | Count as 1 each | "Hi there" = 8 |
| Newlines | Count as 1 each | "Line1\nLine2" = 11 |
| Emojis | Count as 1-2 chars | "😀" = 2 (depends on encoding) |
| Special chars | Count as 1 each | "@#$%" = 4 |

### Counter Visual Design

```
Normal (400-449):     450/500
Warning (450-474):    475/500 (orange)
Danger (475-499):     499/500 (red)
Maximum (500):        500/500 (red, bold)
```

### Input Blocking Logic

| Scenario | Behavior | Allow/Block |
|----------|----------|-------------|
| Under limit | Normal typing | Allow |
| At limit | Block new characters | Block |
| At limit + Delete | Remove characters | Allow |
| At limit + Backspace | Remove characters | Allow |
| Paste under limit | Insert content | Allow |
| Paste over limit | Trim to limit | Allow (trimmed) |

### Paste Handling Flow

```
User pastes content
        │
        ▼
Calculate total chars (current + pasted)
        │
        ▼
Is total > maxCount?
        │
    No  │  Yes
        ▼    │
   Insert     ▼
   normally   Trim pasted content
              │
              ▼
         Insert trimmed content
              │
              ▼
         Show trim notification
```

### Styling Specifications

| State | Tailwind Classes | Visual Effect |
|-------|------------------|---------------|
| Hidden | `hidden` | Not visible |
| Normal | `text-gray-500 text-sm` | Subtle display |
| Warning | `text-orange-500 text-sm font-medium` | Attention getting |
| Danger | `text-red-500 text-sm font-semibold` | Clear warning |
| Maximum | `text-red-600 text-sm font-bold` | Critical state |

### Accessibility Implementation

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| aria-describedby | Link input to counter | Screen reader connection |
| aria-live | "polite" on counter | Announce updates |
| Role | "status" on counter | Status information |
| aria-label | "Character count" | Counter description |

### Expected Outcome
- Real-time character counting with visual feedback
- Input blocking at 500 character maximum
- Progressive warning states as limit approaches
- Proper paste handling with content trimming

### Verification Checklist
- [ ] CharacterCounter component created and styled
- [ ] Character counting works for all text types
- [ ] Counter visibility follows threshold rules
- [ ] Input blocks at 500 character limit
- [ ] Paste operations handle overflow correctly
- [ ] Color coding matches warning states
- [ ] Accessibility features implemented
- [ ] Component integrates with ChatInput properly

---

## Task 59: Create AttachButton

### Overview
Create the attachment button component that allows users to upload files and images to the chat. This button serves as the trigger for file selection dialogs and provides visual feedback for the attachment functionality, integrating seamlessly with the file upload system.

### Dependencies
- Task 58: Create Character Limit

### Instructions

1. **Create AttachButton component**
   - Create `AttachButton.tsx` in `components/chat/input/` directory
   - Set up as a functional component with click handling
   - Import Paperclip icon from Lucide React

2. **Define component props interface**
   - Create `AttachButtonProps` interface
   - Include `onClick` callback function
   - Include `disabled` state prop
   - Include `hasAttachments` prop for visual state
   - Include optional `className` for custom styling

3. **Implement button element**
   - Use HTML `button` element with proper type
   - Set `type="button"` to prevent form submission
   - Add `onClick` handler from props
   - Configure `disabled` attribute based on props

4. **Add paperclip icon**
   - Import `Paperclip` icon from Lucide React
   - Position icon centered in button
   - Set icon size to 20px for consistency
   - Apply proper icon color and hover states

5. **Implement button states**
   - Default state: Gray icon, clickable
   - Hover state: Darker gray, subtle background
   - Active state: Blue tint when files attached
   - Disabled state: Light gray, no interaction

6. **Add visual attachment indicator**
   - Show blue tint when files are attached
   - Display attachment count badge (optional)
   - Use different icon color for attached state
   - Maintain consistent button size

7. **Apply button styling**
   - Neutral gray background (light)
   - Rounded corners for consistency
   - Proper padding for 44px minimum touch target
   - Smooth transitions for state changes

8. **Implement accessibility features**
   - Add descriptive `aria-label`
   - Set `aria-expanded` if managing dropdown
   - Ensure focus indicators are visible
   - Add keyboard navigation support

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClick | () => void | Yes | - | Button click handler |
| disabled | boolean | No | false | Button disabled state |
| hasAttachments | boolean | No | false | Show attached state |
| attachmentCount | number | No | 0 | Number of attachments |
| className | string | No | "" | Additional CSS classes |

### Button States

| State | Background | Icon Color | Border | Behavior |
|-------|------------|------------|---------|-----------|
| Default | Gray-100 | Gray-600 | None | Clickable |
| Hover | Gray-200 | Gray-700 | None | Clickable |
| Active | Blue-100 | Blue-600 | Blue-200 | Clickable |
| Disabled | Gray-50 | Gray-400 | None | No interaction |

### Visual State Indicators

| Condition | Visual Change | Purpose |
|-----------|---------------|---------|
| No attachments | Default gray styling | Neutral state |
| Has attachments | Blue tinted styling | Active state |
| Disabled | Lighter colors | Inactive state |
| Hover | Darker background | Interactive feedback |

### Button Styling Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Size | `w-11 h-11` (44px) | Touch-friendly |
| Background | `bg-gray-100 hover:bg-gray-200` | Subtle appearance |
| Border Radius | `rounded-lg` | Consistent with input |
| Transition | `transition-colors duration-200` | Smooth changes |
| Active | `bg-blue-100 text-blue-600` | Attachment indicator |

### Icon Implementation

| Icon | Library | Size | Usage |
|------|---------|------|-------|
| Paperclip | Lucide React | 20px | File attachment |
| PaperclipIcon | Alternative | 20px | Fallback option |

### Accessibility Features

| Attribute | Value | Purpose |
|-----------|-------|---------|
| aria-label | "Attach files" | Button description |
| role | "button" | Element role |
| tabindex | "0" | Keyboard navigation |
| aria-describedby | Counter ID | Link to attachment count |

### Button Visual Structure

```
Default State:
┌─────────┐
│    📎    │  ← Paperclip icon (gray)
└─────────┘

Active State (with attachments):
┌─────────┐
│    📎    │  ← Paperclip icon (blue)
└─────────┘    ← Blue tinted background

With Count Badge:
┌─────────┐
│    📎  2 │  ← Small count indicator
└─────────┘
```

### Integration with File Upload

| Component | Integration | Purpose |
|-----------|-------------|---------|
| ChatInput | State management | Track attachments |
| FileUpload | Trigger handler | Open file dialog |
| AttachButton | Visual indicator | Show attachment state |

### Expected Outcome
- Clickable attachment button with proper states
- Visual feedback for attached files
- Accessibility compliant implementation
- Consistent styling with other input components

### Verification Checklist
- [ ] `frontend/components/chat/input/AttachButton.tsx` file created
- [ ] Button responds to click events correctly
- [ ] Paperclip icon displays properly
- [ ] Disabled state prevents interactions
- [ ] hasAttachments state changes button appearance
- [ ] Hover states provide visual feedback
- [ ] Button meets minimum touch target size (44px)
- [ ] Accessibility attributes implemented properly

---

## Task 60: Create FileUpload

### Overview
Create the file upload functionality that handles document attachments (PDF, DOC, TXT) with a maximum file size of 5MB. This component manages file selection, validation, preview generation, and integration with the chat input system for seamless file sharing.

### Dependencies
- Task 59: Create AttachButton

### Instructions

1. **Create FileUpload component**
   - Create `FileUpload.tsx` in `components/chat/input/` directory
   - Set up as a hidden file input with trigger mechanism
   - Import necessary React hooks and file handling utilities

2. **Define component props interface**
   - Create `FileUploadProps` interface
   - Include `onFileSelect` callback with File parameter
   - Include `accept` string for file type restrictions
   - Include `maxSize` number prop (default: 5MB)
   - Include `disabled` boolean prop

3. **Implement hidden file input**
   - Use HTML `input` element with `type="file"`
   - Set `accept` attribute for allowed file types
   - Use `useRef` to reference the input element
   - Hide the input with CSS (`display: none`)

4. **Create file selection trigger**
   - Implement `triggerFileSelect` function
   - Call `fileInputRef.current?.click()` to open dialog
   - Connect to AttachButton onClick handler
   - Handle component disabled state

5. **Add file type validation**
   - Define allowed file types: PDF, DOC, DOCX, TXT
   - Set accept attribute: `.pdf,.doc,.docx,.txt`
   - Validate file type on selection
   - Show error message for invalid types

6. **Implement file size validation**
   - Check file size against maximum (5MB = 5 * 1024 * 1024 bytes)
   - Reject files exceeding size limit
   - Show user-friendly error message
   - Allow reselection of valid files

7. **Handle file selection event**
   - Implement `onChange` handler for input
   - Extract selected file from `event.target.files`
   - Run validation checks (type and size)
   - Call parent `onFileSelect` callback if valid

8. **Add error handling and feedback**
   - Create error state for validation failures
   - Display error messages to user
   - Clear previous errors on new selection
   - Provide retry mechanism

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onFileSelect | (file: File \| null) => void | Yes | - | File selection callback |
| accept | string | No | ".pdf,.doc,.docx,.txt" | Allowed file types |
| maxSize | number | No | 5242880 | Maximum file size (5MB) |
| disabled | boolean | No | false | Disable file selection |
| className | string | No | "" | Additional CSS classes |

### File Type Validation

| File Type | Extension | MIME Type | Max Size |
|-----------|-----------|-----------|----------|
| PDF | .pdf | application/pdf | 5MB |
| Word Doc | .doc | application/msword | 5MB |
| Word DocX | .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document | 5MB |
| Text | .txt | text/plain | 5MB |

### File Size Limits

| Size Limit | Bytes | Human Readable |
|------------|-------|----------------|
| Maximum | 5,242,880 | 5 MB |
| Warning Threshold | 4,194,304 | 4 MB |
| Large File | 2,097,152 | 2 MB |

### Validation Logic Flow

```
User selects file
        │
        ▼
Check file exists
        │
    No  │  Yes
        ▼    │
   Return     ▼
   null   Check file type
             │
        Valid │  Invalid
             ▼    │
        Check     ▼
        size   Show type error
             │
        Valid │  Too large
             ▼    │
        Call      ▼
        callback  Show size error
```

### Error Messages

| Error Type | Message | Recovery Action |
|------------|---------|-----------------|
| Invalid Type | "Please select a PDF, DOC, or TXT file" | Choose different file |
| File Too Large | "File must be smaller than 5MB" | Choose smaller file |
| Selection Error | "Unable to process file. Please try again." | Retry selection |
| No File | "No file selected" | Select a file |

### File Selection Implementation

```javascript
const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  
  if (!file) {
    onFileSelect(null);
    return;
  }
  
  // Validate file type
  if (!isValidFileType(file)) {
    setError("Please select a PDF, DOC, or TXT file");
    return;
  }
  
  // Validate file size
  if (file.size > maxSize) {
    setError(`File must be smaller than ${formatFileSize(maxSize)}`);
    return;
  }
  
  // File is valid
  clearError();
  onFileSelect(file);
  
  // Clear input for reselection
  event.target.value = '';
};
```

### File Preview Information

| File Property | Display | Purpose |
|---------------|---------|---------|
| Name | filename.pdf | File identification |
| Size | 2.3 MB | Size information |
| Type | PDF Document | File type description |
| Modified | Date stamp | File timestamp |

### Component Structure

```javascript
<>
  <input
    ref={fileInputRef}
    type="file"
    accept={accept}
    onChange={handleFileSelect}
    style={{ display: 'none' }}
    disabled={disabled}
  />
  {/* Error display component */}
  {error && <ErrorMessage message={error} />}
</>
```

### Expected Outcome
- Hidden file input with programmatic trigger
- File type and size validation
- Error handling with user feedback
- Integration with AttachButton and ChatInput

### Verification Checklist
- [ ] `frontend/components/chat/input/FileUpload.tsx` file created
- [ ] Hidden file input element implemented
- [ ] File type validation for PDF, DOC, TXT
- [ ] File size validation (5MB maximum)
- [ ] Error messages display correctly
- [ ] onFileSelect callback works properly
- [ ] File input resets after selection
- [ ] Component integrates with AttachButton

---

## Task 61: Create ImageUpload

### Overview
Create the image upload functionality that handles image attachments (JPG, PNG, GIF) with a maximum file size of 10MB. This component provides image-specific validation, preview generation, and proper handling of different image formats while maintaining performance and user experience standards.

### Dependencies
- Task 60: Create FileUpload

### Instructions

1. **Create ImageUpload component**
   - Create `ImageUpload.tsx` in `components/chat/input/` directory
   - Extend the FileUpload component pattern
   - Add image-specific validation and preview features

2. **Define component props interface**
   - Create `ImageUploadProps` interface
   - Include `onImageSelect` callback with File parameter
   - Include `maxSize` number prop (default: 10MB)
   - Include `generatePreview` boolean prop
   - Include standard component props (disabled, className)

3. **Implement image-specific file input**
   - Use HTML `input` element with `type="file"`
   - Set `accept` attribute for image types: `.jpg,.jpeg,.png,.gif`
   - Configure `multiple={false}` for single image selection
   - Add image-specific MIME type validation

4. **Add image type validation**
   - Define allowed image types: JPEG, PNG, GIF
   - Validate both file extension and MIME type
   - Check for `image/` prefix in MIME type
   - Reject unsupported image formats

5. **Implement image size validation**
   - Set maximum file size to 10MB (10 * 1024 * 1024 bytes)
   - Check file size before processing
   - Show appropriate error message for oversized images
   - Suggest image compression for large files

6. **Add image preview generation**
   - Use FileReader API to generate preview
   - Create base64 data URL for image display
   - Handle preview generation errors gracefully
   - Provide loading state during preview generation

7. **Implement image dimension detection**
   - Create temporary Image object to get dimensions
   - Read image width and height properties
   - Include dimensions in file selection callback
   - Handle images with unknown dimensions

8. **Add image-specific error handling**
   - Invalid image format errors
   - Corrupted image file errors
   - Preview generation failures
   - Dimension detection failures

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onImageSelect | (file: File \| null, preview?: string, dimensions?: {width: number, height: number}) => void | Yes | - | Image selection callback |
| maxSize | number | No | 10485760 | Maximum file size (10MB) |
| generatePreview | boolean | No | true | Generate preview image |
| disabled | boolean | No | false | Disable image selection |
| className | string | No | "" | Additional CSS classes |

### Image Type Support

| Image Type | Extensions | MIME Types | Max Size |
|------------|------------|------------|----------|
| JPEG | .jpg, .jpeg | image/jpeg | 10MB |
| PNG | .png | image/png | 10MB |
| GIF | .gif | image/gif | 10MB |
| WebP | .webp | image/webp | 10MB (optional) |

### File Size Limits

| Size Category | Size (MB) | Bytes | Use Case |
|---------------|-----------|-------|----------|
| Small | < 1 | < 1,048,576 | Profile images |
| Medium | 1-5 | 1,048,576-5,242,880 | Standard uploads |
| Large | 5-10 | 5,242,880-10,485,760 | High quality images |
| Too Large | > 10 | > 10,485,760 | Rejected |

### Image Validation Flow

```
User selects image
        │
        ▼
Validate file type
        │
    Valid │  Invalid
        ▼    │
   Validate   ▼
   file size  Show format error
        │
    Valid │  Too large
        ▼    │
   Generate   ▼
   preview   Show size error
        │
   Success │  Failed
        ▼    │
   Get dims   ▼
        │   Show preview error
        ▼
   Call callback
```

### Preview Generation Implementation

```javascript
const generateImagePreview = (file: File): Promise<{
  preview: string;
  dimensions: { width: number; height: number };
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      
      img.onload = () => {
        resolve({
          preview,
          dimensions: { width: img.width, height: img.height }
        });
      };
      
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = preview;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
```

### Error Messages

| Error Type | Message | Suggestion |
|------------|---------|------------|
| Invalid Format | "Please select a valid image (JPG, PNG, or GIF)" | Choose image file |
| File Too Large | "Image must be smaller than 10MB" | Compress image |
| Corrupted File | "Unable to process image. File may be corrupted." | Try different file |
| Preview Failed | "Image preview unavailable" | Continue anyway |

### Image Information Display

| Property | Description | Format |
|----------|-------------|---------|
| Filename | Original filename | "photo.jpg" |
| File Size | Human readable size | "2.4 MB" |
| Dimensions | Width × Height | "1920 × 1080" |
| Format | Image type | "JPEG Image" |

### Preview Component Structure

```
┌─────────────────────────────┐
│  ┌─────────┐               │
│  │ [Preview]│ filename.jpg  │
│  │ Image   │ 2.4 MB        │
│  │ Thumb   │ 1920 × 1080   │
│  └─────────┘               │
└─────────────────────────────┘
```

### Integration with Upload Progress

| Stage | Progress | Display |
|-------|----------|---------|
| File Selection | 0% | "Selecting image..." |
| Validation | 25% | "Validating image..." |
| Preview Generation | 50% | "Generating preview..." |
| Dimension Detection | 75% | "Processing image..." |
| Complete | 100% | "Image ready" |

### Expected Outcome
- Image file selection with format validation
- 10MB file size limit enforcement
- Preview generation with dimensions
- Proper error handling and user feedback

### Verification Checklist
- [ ] `frontend/components/chat/input/ImageUpload.tsx` file created
- [ ] Image type validation (JPG, PNG, GIF)
- [ ] File size validation (10MB maximum)
- [ ] Preview generation working correctly
- [ ] Image dimensions detected and reported
- [ ] Error handling for invalid/corrupted files
- [ ] Integration with AttachButton component
- [ ] Component performance optimized

---

## Task 62: Create UploadProgress

### Overview
Create the upload progress component that displays real-time progress indicators during file and image uploads. This component provides visual feedback with progress bars, percentage indicators, file names, and cancellation options to enhance user experience during the upload process.

### Dependencies
- Task 61: Create ImageUpload

### Instructions

1. **Create UploadProgress component**
   - Create `UploadProgress.tsx` in `components/chat/input/` directory
   - Design as a controlled component with progress props
   - Import necessary icons and progress bar elements

2. **Define component props interface**
   - Create `UploadProgressProps` interface
   - Include `fileName` string prop for file identification
   - Include `progress` number prop (0-100)
   - Include `fileSize` and `uploadedBytes` for detailed info
   - Include `onCancel` callback for upload cancellation

3. **Implement progress bar element**
   - Create animated progress bar using CSS/Tailwind
   - Use div with dynamic width based on progress percentage
   - Add smooth transitions for progress updates
   - Include proper ARIA attributes for accessibility

4. **Add file information display**
   - Show file name with proper truncation if too long
   - Display current upload speed (KB/s or MB/s)
   - Show estimated time remaining
   - Include file size and uploaded amount

5. **Create progress states**
   - Uploading state: Active progress bar with animation
   - Completed state: Success indicator with checkmark
   - Error state: Error indicator with retry option
   - Cancelled state: Cancelled indicator with reset option

6. **Implement cancel functionality**
   - Add cancel button (X icon) next to progress
   - Call `onCancel` callback when clicked
   - Disable cancel button when upload completes
   - Show confirmation for cancellation if needed

7. **Add visual progress indicators**
   - Percentage text (e.g., "45%")
   - Progress bar with color coding
   - Upload speed indicator
   - File type icon representation

8. **Handle different file types**
   - Show appropriate icons for different file types
   - Different color schemes for images vs documents
   - Adjust display based on file size categories

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| fileName | string | Yes | - | Name of uploading file |
| progress | number | Yes | - | Upload progress (0-100) |
| fileSize | number | Yes | - | Total file size in bytes |
| uploadedBytes | number | No | 0 | Bytes uploaded so far |
| uploadSpeed | number | No | 0 | Upload speed in bytes/sec |
| onCancel | () => void | No | - | Cancel upload callback |
| status | 'uploading' \| 'completed' \| 'error' \| 'cancelled' | No | 'uploading' | Upload status |

### Progress States

| State | Progress Bar Color | Icon | Actions |
|-------|-------------------|------|---------|
| Uploading | Blue (bg-blue-600) | Spinner | Cancel |
| Completed | Green (bg-green-600) | Checkmark | None |
| Error | Red (bg-red-600) | X Mark | Retry |
| Cancelled | Gray (bg-gray-400) | X Mark | Remove |

### Progress Bar Implementation

```
┌─────────────────────────────┐
│ filename.pdf            45% │ ← File name and percentage
│ ████████████░░░░░░░░░░░░░░░ │ ← Progress bar
│ 2.1 MB / 4.7 MB  •  1.2MB/s│ ← Size info and speed
│                          ✕ │ ← Cancel button
└─────────────────────────────┘
```

### File Type Icons

| File Type | Icon | Library |
|-----------|------|---------|
| PDF | FileText | Lucide React |
| Image | Image | Lucide React |
| Document | File | Lucide React |
| General | Paperclip | Lucide React |

### Progress Calculation

| Calculation | Formula | Display |
|-------------|---------|---------|
| Percentage | (uploadedBytes / fileSize) * 100 | "45%" |
| Speed | bytes/second | "1.2 MB/s" |
| ETA | (remainingBytes / speed) seconds | "2 min left" |
| Size Ratio | uploadedBytes / fileSize | "2.1 MB / 4.7 MB" |

### Upload Speed Formatting

| Speed Range | Display Format | Example |
|-------------|----------------|---------|
| < 1 KB/s | "X bytes/s" | "512 bytes/s" |
| 1 KB/s - 1 MB/s | "X.X KB/s" | "256.4 KB/s" |
| > 1 MB/s | "X.X MB/s" | "2.1 MB/s" |

### Progress Bar Animation

```css
.progress-bar {
  transition: width 0.3s ease-in-out;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.progress-bar-completed {
  background: linear-gradient(90deg, #10b981, #047857);
}
```

### Component Layout Structure

```
┌─────────────────────────────────────┐
│ [Icon] filename.pdf            [%] │
│ ████████████████░░░░░░░░░░░░░░░░░░░ │
│ Size: 2.1/4.7 MB • Speed: 1.2MB/s │
│ ETA: 2 min • [Cancel Button]       │
└─────────────────────────────────────┘
```

### Accessibility Features

| Attribute | Value | Purpose |
|-----------|-------|---------|
| role | "progressbar" | Progress semantics |
| aria-valuenow | progress | Current value |
| aria-valuemin | "0" | Minimum value |
| aria-valuemax | "100" | Maximum value |
| aria-label | "Upload progress: 45%" | Screen reader text |

### Error Handling States

| Error Type | Display | Action Available |
|------------|---------|------------------|
| Network Error | "Upload failed - Network error" | Retry |
| File Size Error | "File too large for upload" | Remove |
| Server Error | "Server error - Please try again" | Retry |
| Timeout | "Upload timed out" | Retry |

### Expected Outcome
- Real-time progress display during uploads
- File information and upload statistics
- Cancellation functionality for active uploads
- Visual feedback for different upload states

### Verification Checklist
- [ ] `frontend/components/chat/input/UploadProgress.tsx` file created
- [ ] Progress bar updates smoothly with progress changes
- [ ] File name and size information displayed correctly
- [ ] Upload speed and ETA calculations working
- [ ] Cancel functionality works properly
- [ ] Different states (uploading, completed, error) display correctly
- [ ] Accessibility attributes implemented
- [ ] Component integrates with file upload components

---

## Summary

This document established the core input and upload functionality for the AI chatbot interface, including comprehensive text input handling, file attachment capabilities, and progress tracking. These components provide users with intuitive ways to compose messages and share files with the AI assistant.

### Completed Tasks
1. ✓ Created ChatInput component with state management and layout
2. ✓ Created auto-resizing input field with proper text handling
3. ✓ Created send button with multiple states and visual feedback
4. ✓ Created Enter key handler for message sending
5. ✓ Created Shift+Enter support for multi-line input
6. ✓ Created character limit with progressive warnings (500 chars)
7. ✓ Created attach button with visual state indicators
8. ✓ Created file upload with validation (PDF, DOC, TXT, 5MB)
9. ✓ Created image upload with preview (JPG, PNG, GIF, 10MB)
10. ✓ Created upload progress with real-time feedback

### Next Steps
Proceed to [02_Tasks-63-68_Emoji-Handoff.md](02_Tasks-63-68_Emoji-Handoff.md) to create emoji picker functionality, disabled states during sending, escalation button for human handoff, and complete the input verification process.