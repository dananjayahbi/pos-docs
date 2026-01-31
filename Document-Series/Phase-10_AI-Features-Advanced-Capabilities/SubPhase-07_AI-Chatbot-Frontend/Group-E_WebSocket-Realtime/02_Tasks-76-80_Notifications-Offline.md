# Tasks 76-80: Notifications and Offline Management

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 07 - AI Chatbot Frontend  
> **Group:** E - WebSocket & Real-time  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-75_WebSocket-Connection.md](01_Tasks-69-75_WebSocket-Connection.md)
- **→ Next Group:** [Group-F_Polish-Testing](../Group-F_Polish-Testing/)

---

## Document Overview

This document covers the implementation of audio notifications, browser notifications, and offline message queueing for the AI chatbot. It includes sound management with toggle functionality, browser notification system with permission handling, and a robust offline queue that syncs messages when connectivity is restored.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create Notification Sound | Low | 15 min |
| 77 | Create Sound Toggle | Low | 20 min |
| 78 | Create Browser Notification | Medium | 30 min |
| 79 | Create Offline Queue | Medium | 45 min |
| 80 | Verify WebSocket | Low | 15 min |

---

## Task 76: Create Notification Sound

### Overview
Implement audio notification system for new messages using Web Audio API. Create a notification sound that plays when new messages arrive, with proper browser support detection and error handling.

### Dependencies
- Task 75: Create Connection Status
- WebSocket connection established
- Audio files prepared (notification.mp3)

### Instructions

1. **Create audio utilities**
   - Navigate to `frontend/lib/chat/` directory
   - Create new file named `audio.ts`
   - Set up Web Audio API context

2. **Load notification sound**
   - Place `notification.mp3` in `public/sounds/` directory
   - Create audio loading function
   - Implement fallback for unsupported formats

3. **Create audio manager class**
   - Define `NotificationAudio` class
   - Initialize audio context and buffer
   - Add methods for play, stop, and volume control

4. **Implement play notification method**
   - Create `playNotification` function
   - Check if sound is enabled in settings
   - Handle audio context state (suspended/running)

5. **Add browser compatibility**
   - Check for Web Audio API support
   - Implement fallback to HTML5 Audio
   - Handle autoplay restrictions

6. **Integrate with WebSocket hook**
   - Call `playNotification` on new message
   - Respect user sound preferences
   - Only play for incoming messages

### Audio File Requirements

| Property | Specification |
|----------|---------------|
| Format | MP3, WAV, OGG |
| Duration | 0.5-2 seconds |
| Volume | Moderate (not jarring) |
| Size | < 50KB |

### Browser Support Strategy

| Browser | Primary Method | Fallback |
|---------|---------------|----------|
| Chrome | Web Audio API | HTML5 Audio |
| Firefox | Web Audio API | HTML5 Audio |
| Safari | Web Audio API | HTML5 Audio |
| Edge | Web Audio API | HTML5 Audio |

### Audio Context States

| State | Description | Action |
|-------|-------------|---------|
| suspended | Context paused | Resume before play |
| running | Context active | Play immediately |
| closed | Context ended | Create new context |

### Notification Trigger Conditions

| Condition | Play Sound |
|-----------|------------|
| New message from AI | ✓ |
| New message from user | ✗ |
| System message | ✗ |
| Sound disabled | ✗ |
| Page focused | ✓ |
| Page not focused | ✓ |

### Expected Outcome
- Functional audio notification system
- Cross-browser compatibility
- Respects user preferences
- Handles autoplay restrictions gracefully

### Verification Checklist
- [ ] `frontend/lib/chat/audio.ts` file created
- [ ] Notification sound file placed in public directory
- [ ] Audio context initialized properly
- [ ] Play notification function works
- [ ] Browser compatibility handled
- [ ] Integrated with WebSocket message handler
- [ ] Sound only plays for appropriate message types

---

## Task 77: Create Sound Toggle

### Overview
Create a sound toggle control that allows users to enable or disable notification sounds. Store the preference in localStorage and provide visual feedback for the current state.

### Dependencies
- Task 76: Create Notification Sound

### Instructions

1. **Create sound settings utilities**
   - Add to `frontend/lib/chat/audio.ts`
   - Create functions to get/set sound preferences
   - Use localStorage for persistence

2. **Define sound settings interface**
   - Create `SoundSettings` interface
   - Include enabled boolean flag
   - Allow for future audio preferences

3. **Create SoundToggle component**
   - Create `SoundToggle.tsx` in `components/chat/`
   - Use toggle switch or button design
   - Show current state visually

4. **Implement toggle functionality**
   - Toggle sound enabled/disabled state
   - Save preference to localStorage
   - Update audio manager configuration

5. **Add visual indicators**
   - Use sound icon for enabled state
   - Use muted icon for disabled state
   - Add tooltip showing current state

6. **Integrate with chat interface**
   - Add SoundToggle to chat header
   - Position near other controls
   - Ensure accessible interaction

7. **Handle default state**
   - Set sound enabled by default
   - Check for existing preference on load
   - Respect browser autoplay policies

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | "" | Additional CSS classes |
| size | "sm" \| "md" \| "lg" | No | "md" | Toggle size variant |

### Sound Settings Interface

```
interface SoundSettings {
  enabled: boolean;
  volume?: number; // Future use
  notificationSound?: string; // Future use
}
```

### LocalStorage Key

| Key | Value | Description |
|-----|-------|-------------|
| `chat-sound-settings` | `SoundSettings` | JSON string |

### Visual States

| State | Icon | Color | Tooltip |
|-------|------|-------|---------|
| Enabled | 🔊 | Primary | "Sound on" |
| Disabled | 🔇 | Gray | "Sound off" |
| Loading | ⏳ | Gray | "Loading..." |

### Toggle Interactions

| Action | Behavior |
|--------|----------|
| Click | Toggle enabled state |
| Keyboard | Space/Enter to toggle |
| Touch | Tap to toggle |

### Default Behavior

```
Initial Load:
├── Check localStorage
├── Default to enabled if no preference
├── Respect autoplay policy
└── Update UI accordingly
```

### Expected Outcome
- Functional sound toggle control
- Persistent user preference
- Clear visual feedback
- Accessible interaction

### Verification Checklist
- [ ] Sound settings utilities created
- [ ] SoundToggle component created
- [ ] Toggle functionality works
- [ ] Preference saved to localStorage
- [ ] Visual indicators show correct state
- [ ] Component integrated in chat interface
- [ ] Keyboard accessibility implemented
- [ ] Default state handled correctly

---

## Task 78: Create Browser Notification

### Overview
Implement browser push notifications for new messages when the chat window is not focused or minimized. Handle permission requests, notification content formatting, and user interaction with notifications.

### Dependencies
- Task 77: Create Sound Toggle
- Document visibility detection

### Instructions

1. **Create notification utilities**
   - Create `notifications.ts` in `frontend/lib/chat/`
   - Set up Notification API wrapper functions
   - Handle permission states

2. **Request notification permission**
   - Create `requestNotificationPermission` function
   - Show permission prompt at appropriate time
   - Handle granted, denied, and default states

3. **Create notification manager**
   - Define `NotificationManager` class
   - Include methods for show, close, and permission check
   - Handle notification click events

4. **Format notification content**
   - Create message preview function
   - Limit text length for notification body
   - Include sender information (AI assistant)

5. **Detect page visibility**
   - Use Page Visibility API
   - Only show notifications when page is hidden
   - Track focus state changes

6. **Handle notification interactions**
   - Focus window when notification clicked
   - Clear notification after interaction
   - Navigate to chat if on different page

7. **Integrate with message system**
   - Call notification on new AI messages
   - Respect user notification preferences
   - Don't show for user's own messages

### Permission States

| State | Description | Action |
|-------|-------------|--------|
| default | Not requested | Show request UI |
| granted | Permission given | Show notifications |
| denied | Permission refused | Disable feature |

### Notification Content Structure

```
┌─────────────────────────────────────┐
│ 🤖 LankaCommerce Assistant         │
│                                     │
│ "Here's what I found about your..." │
│                                     │
│ Click to view full message          │
└─────────────────────────────────────┘
```

### Notification Properties

| Property | Value | Description |
|----------|-------|-------------|
| title | Store name + "Assistant" | Notification title |
| body | Message preview (100 chars) | Message content |
| icon | Bot avatar URL | Notification icon |
| badge | Small icon for mobile | Status bar icon |
| requireInteraction | false | Auto-dismiss |

### Page Visibility Detection

| State | Show Notifications |
|-------|-------------------|
| visible | No |
| hidden | Yes |
| prerender | No |
| unloaded | No |

### Notification Triggers

| Condition | Show Notification |
|-----------|------------------|
| New AI message | ✓ |
| Page not focused | ✓ |
| Notifications enabled | ✓ |
| Permission granted | ✓ |
| User message | ✗ |
| System message | ✗ |

### Click Behavior

```
Notification Click:
├── Focus browser window
├── Switch to chat tab (if applicable)
├── Clear notification
└── Scroll to latest message
```

### Expected Outcome
- Working browser notification system
- Proper permission handling
- Notifications only when page hidden
- Click-to-focus functionality

### Verification Checklist
- [ ] Notification utilities created
- [ ] Permission request implemented
- [ ] Notification content properly formatted
- [ ] Page visibility detection working
- [ ] Click behavior functions correctly
- [ ] Integration with message system
- [ ] Respects user preferences
- [ ] Cross-browser compatibility tested

---

## Task 79: Create Offline Queue

### Overview
Implement offline message queueing system that stores messages locally when WebSocket is disconnected and syncs them when connection is restored. Use IndexedDB for persistent storage and provide visual feedback for message sync status.

### Dependencies
- Task 78: Create Browser Notification
- IndexedDB support

### Instructions

1. **Set up IndexedDB database**
   - Create `offline.ts` in `frontend/lib/chat/`
   - Initialize IndexedDB with chat database
   - Create message queue object store

2. **Create offline queue manager**
   - Define `OfflineQueue` class
   - Add methods for queue, dequeue, and sync
   - Handle database operations

3. **Implement message queueing**
   - Queue messages when WebSocket is disconnected
   - Store message content, timestamp, and retry count
   - Generate temporary IDs for queued messages

4. **Add message status tracking**
   - Create message status types (sending, sent, failed, queued)
   - Update message status in UI
   - Show visual indicators for each state

5. **Implement sync functionality**
   - Sync queued messages when connection restored
   - Send messages in chronological order
   - Handle sync failures with retry logic

6. **Add retry mechanism**
   - Implement exponential backoff for failed messages
   - Limit retry attempts per message
   - Move to failed state after max retries

7. **Integrate with WebSocket system**
   - Detect connection state changes
   - Queue messages when offline
   - Trigger sync on reconnection

### IndexedDB Schema

```
Database: ChatOffline (version 1)
└── ObjectStore: messageQueue
    ├── id: string (primary key)
    ├── content: string
    ├── timestamp: number
    ├── retryCount: number
    ├── status: string
    └── tempId: string
```

### Message Status Types

| Status | Description | UI Indicator |
|--------|-------------|--------------|
| sending | Currently sending | Spinner |
| sent | Successfully sent | Checkmark |
| queued | Waiting offline | Clock |
| failed | Send failed | Error icon |
| syncing | Syncing from queue | Upload icon |

### Queue Operations

| Operation | Description |
|-----------|-------------|
| enqueue | Add message to queue |
| dequeue | Remove message from queue |
| peek | View next message |
| clear | Empty entire queue |
| sync | Send all queued messages |

### Sync Process Flow

```
Connection Restored:
├── Get all queued messages
├── Sort by timestamp
├── For each message:
│   ├── Update status to 'syncing'
│   ├── Send via WebSocket
│   ├── Wait for confirmation
│   ├── Remove from queue if successful
│   └── Increment retry if failed
└── Update UI with sync results
```

### Retry Logic

| Attempt | Delay | Max Attempts |
|---------|-------|--------------|
| 1 | Immediate | 5 |
| 2 | 2 seconds | |
| 3 | 4 seconds | |
| 4 | 8 seconds | |
| 5+ | 16 seconds | |

### Visual Feedback

| State | Message Appearance |
|-------|-------------------|
| Queued | Dimmed with clock icon |
| Syncing | Normal with upload icon |
| Failed | Red border with retry button |
| Sent | Normal appearance |

### Storage Management

| Feature | Implementation |
|---------|----------------|
| Storage Limit | 10MB max |
| Cleanup | Remove old sent messages |
| Quota Check | Monitor storage usage |
| Error Handling | Graceful degradation |

### Expected Outcome
- Robust offline message queueing
- Persistent storage with IndexedDB
- Visual feedback for message status
- Automatic sync when online

### Verification Checklist
- [ ] IndexedDB database created
- [ ] OfflineQueue class implemented
- [ ] Message queueing works when offline
- [ ] Message status tracking functional
- [ ] Sync process works on reconnection
- [ ] Retry mechanism handles failures
- [ ] UI shows appropriate status indicators
- [ ] Storage management implemented

---

## Task 80: Verify WebSocket

### Overview
Perform comprehensive testing and verification of the entire WebSocket system, including connection management, message handling, notifications, and offline functionality. Create test scenarios and validation procedures to ensure robust real-time communication.

### Dependencies
- Task 79: Create Offline Queue
- All previous WebSocket tasks completed

### Instructions

1. **Create verification test suite**
   - Create `websocket.test.ts` in appropriate test directory
   - Set up test environment with mock WebSocket
   - Define comprehensive test scenarios

2. **Test connection management**
   - Verify initial connection establishment
   - Test reconnection after network interruption
   - Validate exponential backoff timing
   - Check connection status indicators

3. **Test message handling**
   - Send and receive various message types
   - Verify message parsing and formatting
   - Test typing indicators
   - Validate read receipts

4. **Test notification system**
   - Verify sound notifications play correctly
   - Test sound toggle functionality
   - Check browser notification permissions
   - Validate notification content and timing

5. **Test offline functionality**
   - Simulate network disconnection
   - Verify message queueing when offline
   - Test sync process on reconnection
   - Validate message status updates

6. **Perform integration testing**
   - Test complete user conversation flow
   - Verify UI updates with WebSocket events
   - Check error handling scenarios
   - Validate performance under load

7. **Create user acceptance criteria**
   - Define expected behavior for each feature
   - Create manual testing checklist
   - Document known limitations
   - Provide troubleshooting guide

### Test Scenarios

| Category | Test Case | Expected Result |
|----------|-----------|-----------------|
| Connection | Initial connect | Status shows connected |
| Connection | Network disconnect | Auto-reconnect attempts |
| Connection | Manual disconnect | Clean connection close |
| Messaging | Send text message | Message appears in chat |
| Messaging | Receive AI response | Response displayed correctly |
| Messaging | Long message | Proper text wrapping |
| Typing | Start typing | Typing indicator shows |
| Typing | Stop typing | Indicator disappears |
| Sound | New message | Notification sound plays |
| Sound | Toggle off | Sound disabled |
| Browser | Page hidden | Browser notification shows |
| Browser | Notification click | Window focuses |
| Offline | Send when offline | Message queued |
| Offline | Reconnect | Queued messages sync |

### Connection Test Cases

```
1. Fresh Connection:
   ├── Open chat interface
   ├── WebSocket connects automatically
   ├── Status shows "Connected"
   └── Ready to send messages

2. Connection Loss:
   ├── Simulate network interruption
   ├── Status shows "Reconnecting"
   ├── Exponential backoff attempts
   └── Eventually reconnects

3. Manual Disconnect:
   ├── Close chat window
   ├── WebSocket closes cleanly
   ├── No error messages
   └── Connection status updates
```

### Message Flow Validation

```
Send Message:
├── User types message
├── Message appears in chat
├── WebSocket sends to server
├── Server processes message
├── AI response received
├── Response appears in chat
└── Notification sound plays
```

### Performance Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Connection Time | < 2 seconds | First WebSocket open |
| Message Send | < 500ms | Click to WebSocket send |
| Message Receive | < 100ms | WebSocket to UI update |
| Reconnect Time | < 5 seconds | Disconnect to reconnect |
| Offline Sync | < 10 seconds | All queued messages |

### Error Scenarios

| Error Type | Test Method | Expected Behavior |
|------------|-------------|-------------------|
| Network timeout | Simulate slow network | Show connection status |
| Server error | Mock 500 response | Display error message |
| Permission denied | Block notifications | Graceful degradation |
| Storage full | Fill IndexedDB | Warning and cleanup |

### User Acceptance Criteria

```
✓ Messages send and receive in real-time
✓ Connection status is always visible
✓ Automatic reconnection works reliably
✓ Sound notifications are audible
✓ Browser notifications appear when away
✓ Offline messages are preserved and synced
✓ UI is responsive and provides feedback
✓ Error conditions are handled gracefully
```

### Known Limitations

| Limitation | Impact | Mitigation |
|------------|---------|------------|
| Browser autoplay | Sound may not play | User gesture required |
| Notification permission | May be denied | Graceful fallback |
| IndexedDB support | Offline queue unavailable | In-memory fallback |
| WebSocket limits | Connection throttling | Retry with backoff |

### Troubleshooting Guide

| Issue | Symptoms | Solution |
|-------|----------|----------|
| No connection | Status shows disconnected | Check network/server |
| No sound | Notifications silent | Check toggle and permissions |
| Messages not sending | Stuck in queue | Check connection status |
| High CPU usage | Browser slows down | Check for memory leaks |

### Expected Outcome
- Fully verified WebSocket system
- All functionality tested and working
- Performance meets requirements
- Error handling is robust

### Verification Checklist
- [ ] Test suite created and passing
- [ ] Connection management verified
- [ ] Message handling tested
- [ ] Notification system working
- [ ] Offline functionality validated
- [ ] Integration tests pass
- [ ] Performance criteria met
- [ ] Error scenarios handled
- [ ] User acceptance criteria satisfied
- [ ] Documentation complete

---

## Summary

This document established the notification and offline management capabilities for the AI chatbot's WebSocket system. The implementation includes audio notifications with user controls, browser push notifications with proper permission handling, and a robust offline queue that ensures no messages are lost during connectivity issues.

### Completed Tasks
1. ✓ Created notification sound system with Web Audio API
2. ✓ Created sound toggle with persistent user preferences
3. ✓ Created browser notification system with permission handling
4. ✓ Created offline queue with IndexedDB and sync functionality
5. ✓ Verified entire WebSocket system with comprehensive testing

### Key Features Delivered
- **Audio Notifications:** Cross-browser compatible sound system
- **User Control:** Toggle for sound preferences with localStorage
- **Push Notifications:** Browser notifications with click-to-focus
- **Offline Support:** Message queueing and sync with visual feedback
- **Robust Testing:** Comprehensive verification of all functionality

### Next Steps
Proceed to [Group-F_Polish-Testing](../Group-F_Polish-Testing/) to implement final polish, performance optimizations, and comprehensive testing of the entire AI chatbot system.