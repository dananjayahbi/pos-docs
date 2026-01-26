# Tasks 63-68: Leave Approval, Calendar & API Integration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** D - Leave Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 63-68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Dashboard-Form.md](01_Tasks-53-62_Dashboard-Form.md)
- **→ Next Document:** None (Last in Group) | **Next Group:** [Group-E_Payroll-Processing](../Group-E_Payroll-Processing/)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document completes leave management by implementing approval workflows, team calendar visualization, and full API integration. Creates leave date picker with conflict detection, reason input with validation, approval actions for managers with delegation support, approval modal with detailed review, and team leave calendar showing upcoming leaves with capacity indicators. Connects all leave functionality to backend APIs with optimistic updates and real-time synchronization.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 63 | Create Leave Date Picker | Low | Task 61 |
| 64 | Create Leave Reason Input | Low | Task 61 |
| 65 | Create Leave Approval Actions | Medium | Task 57 |
| 66 | Create Approval Modal | Medium | Task 65 |
| 67 | Create Leave Calendar View | Medium | Task 53 |
| 68 | Connect Leave to API | Medium | Task 67 |

---

## Task 63: Create Leave Date Picker

### Overview
Create a specialized date picker component for leave requests that validates date ranges, detects conflicts with existing leaves, checks weekend and holiday restrictions, enforces notice periods, and calculates working days based on Sri Lankan calendar.

### Dependencies
- Task 61: Create Leave Form Schema

### Instructions

1. **Create leave date picker component**
   - Create `LeaveDatePicker.tsx` in Leave directory
   - Create directory: `components/modules/hr/Leave/`
   - Range picker (start and end date)
   - Visual calendar display

2. **Implement date range selection**
   - Start date picker
   - End date picker
   - Link both pickers (end >= start)
   - Quick duration buttons (1 day, 3 days, 1 week)

3. **Add calendar visualization**
   - Monthly calendar view
   - Highlight selected range
   - Show weekends differently
   - Mark public holidays
   - Indicate existing leave dates

4. **Calculate working days**
   - Exclude weekends (Saturday/Sunday)
   - Exclude public holidays
   - Count only working days
   - Display: "X working days selected"
   - Real-time update as dates change

5. **Implement conflict detection**
   - Check existing leave requests
   - Fetch employee's approved/pending leaves
   - Highlight conflicting dates in red
   - Show warning message
   - Prevent submission if conflict exists

6. **Add holiday checking**
   - Fetch Sri Lankan public holidays from API
   - Mark holidays in calendar
   - Show holiday names on hover
   - Warn if selection includes holidays
   - Option to include/exclude holidays

7. **Enforce notice period rules**
   - Minimum notice: 3 days advance
   - Calculate from today
   - Disable dates before minimum notice
   - Show error: "Requires 3 days advance notice"
   - Exception for emergency/medical leave

8. **Add half-day options**
   - Single day selection
   - Radio buttons: Full Day / Morning / Afternoon
   - Counts as 0.5 day
   - Clear indicator in calendar

9. **Implement maximum duration limits**
   - Annual leave: Max 14 consecutive days
   - Casual leave: Max 3 consecutive days
   - Medical leave: No specific limit
   - Show error when exceeded
   - Based on leave type

10. **Create date range presets**
    - Tomorrow (1 day)
    - Next Week (Mon-Fri)
    - Next 2 Weeks
    - Custom range
    - One-click selection

11. **Add balance validation**
    - Check available leave balance
    - Real-time balance display
    - Warn if exceeds balance
    - Show: "You have X days available"
    - Red text if insufficient

12. **Handle special cases**
    - Emergency leave: No notice period
    - Medical leave: Allow backdating
    - Annual leave: Normal rules
    - Unpaid leave: No balance check
    - Different validation per type

### Leave Date Picker Layout
```
Single Date Selection:
┌────────────────────────────────────────┐
│ Select Leave Date                      │
├────────────────────────────────────────┤
│ Date: [2024-02-15] 📅                  │
│                                        │
│ Duration:                              │
│ ○ Full Day (1.0 day)                  │
│ ○ Morning Only (0.5 day)              │
│ ○ Afternoon Only (0.5 day)            │
│                                        │
│ Available Balance: 12 days            │
└────────────────────────────────────────┘

Date Range Selection:
┌────────────────────────────────────────┐
│ Select Leave Period                    │
├────────────────────────────────────────┤
│ From: [2024-02-15] 📅                  │
│ To:   [2024-02-19] 📅                  │
│                                        │
│ Quick Duration:                        │
│ [1 Day] [3 Days] [1 Week]             │
│                                        │
│ Working Days: 5 days                  │
│ (Excludes: 0 weekends, 0 holidays)   │
│                                        │
│ Available Balance: 12 days ✓          │
└────────────────────────────────────────┘

Calendar View:
┌────────────────────────────────────────┐
│         February 2024           [×]    │
├────────────────────────────────────────┤
│ Su Mo Tu We Th Fr Sa                  │
│              1  2  3                   │
│  4  5  6  7  8  9 10                  │
│ 11 12 13 14[15 16 17                  │
│ 18 19]20 21 22 23 24                  │
│ 25 26 27 28 29                         │
│                                        │
│ Legend:                                │
│ ▓ Weekend   ✱ Holiday   ■ Selected    │
│ ◆ Existing Leave   ✗ Unavailable      │
└────────────────────────────────────────┘

Conflict Warning:
┌────────────────────────────────────────┐
│ ⚠️ Conflict Detected                   │
├────────────────────────────────────────┤
│ You already have leave on:            │
│ • Feb 16-17, 2024 (Annual Leave)      │
│                                        │
│ Please select different dates.        │
└────────────────────────────────────────┘

Insufficient Balance:
┌────────────────────────────────────────┐
│ ⚠️ Insufficient Leave Balance          │
├────────────────────────────────────────┤
│ Requested: 10 days                    │
│ Available: 8 days                     │
│ Shortage: 2 days                      │
│                                        │
│ Please reduce the duration or         │
│ request unpaid leave.                 │
└────────────────────────────────────────┘
```

### Working Days Calculation

| Component | Rule | Example |
|-----------|------|---------|
| Calendar Days | End - Start + 1 | Feb 15-19 = 5 days |
| Weekends | Exclude Sat/Sun | 1 weekend = -2 days |
| Public Holidays | Exclude holidays | 0 holidays = -0 days |
| Working Days | Calendar - Weekends - Holidays | 5 - 0 - 0 = 5 days |
| Half Day | Counts as 0.5 | Morning only = 0.5 day |

### Sri Lankan Public Holidays (Example)

| Date | Holiday | Type |
|------|---------|------|
| Jan 14 | Tamil Thai Pongal | Public |
| Feb 04 | Independence Day | Public |
| Apr 10-14 | Sinhala & Tamil New Year | Public |
| May 01 | May Day | Public |
| May 23 | Vesak Poya | Poya |
| Dec 25 | Christmas Day | Public |

### Leave Type Date Restrictions

| Leave Type | Max Duration | Notice Period | Backdating | Holidays |
|------------|-------------|---------------|------------|----------|
| Annual | 14 consecutive days | 3 days | No | Excluded |
| Casual | 3 consecutive days | 3 days | No | Excluded |
| Medical | No limit | No | Yes | Excluded |
| Emergency | No limit | No | Yes | Included |
| Unpaid | No limit | 7 days | No | Excluded |

### Conflict Detection Logic

| Check | Validation | Action |
|-------|------------|--------|
| Existing Leaves | Overlap with approved/pending | Show error, highlight dates |
| Team Capacity | Too many on leave same day | Show warning, allow override |
| Blackout Dates | Company blackout periods | Prevent selection |
| Consecutive Limits | Max consecutive days exceeded | Show error |
| Balance | Exceeds available balance | Show error |

### Notice Period Validation

| Leave Type | Minimum Notice | Calculation |
|------------|----------------|-------------|
| Annual Leave | 3 working days | Today + 3 business days |
| Casual Leave | 3 working days | Today + 3 business days |
| Medical Leave | No notice required | Can be same day |
| Emergency Leave | No notice required | Can be backdated |
| Unpaid Leave | 7 working days | Today + 7 business days |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Leave/LeaveDatePicker.tsx

// 'use client' directive
// Imports
// LeaveDatePicker props
//   - leaveType: Type of leave (affects validation)
//   - availableBalance: Days available
//   - existingLeaves: Employee's existing leaves
//   - holidays: Public holidays array
//   - onDateChange: Callback with selected dates
//   - minNotice: Minimum notice period
// LeaveDatePicker component
//   - Date range inputs (start/end)
//   - Quick duration buttons
//   - Calendar popup
//     - Month view
//     - Date cell rendering
//     - Weekend highlighting
//     - Holiday marking
//     - Conflict highlighting
//   - Working days calculator
//     - Exclude weekends
//     - Exclude holidays
//     - Display count
//   - Half-day options (if single day)
//   - Validation logic
//     - Notice period check
//     - Conflict detection
//     - Balance validation
//     - Duration limits
//   - Error/warning messages
//   - Balance display
```

### Date Cell States in Calendar

| State | Visual | Selectable | Meaning |
|-------|--------|------------|---------|
| Available | White | Yes | Normal working day |
| Weekend | Light gray | No | Saturday/Sunday |
| Holiday | Yellow | No | Public holiday |
| Selected | Blue | Yes | Part of selection |
| Existing Leave | Orange | No | Already on leave |
| Conflict | Red | No | Unavailable due to conflict |
| Blackout | Dark gray | No | Company blackout period |

### Validation Error Messages

| Error | Condition | Message |
|-------|-----------|---------|
| Notice Period | Start date too soon | "Annual leave requires 3 days advance notice. Earliest available: [Date]" |
| Conflict | Overlaps existing leave | "You already have [Type] leave on these dates." |
| Balance | Exceeds available days | "Insufficient balance. Requested: X days, Available: Y days." |
| Duration | Exceeds max duration | "[Type] leave cannot exceed X consecutive days." |
| Weekend/Holiday | Selection includes non-working days | "Selection includes weekends/holidays which will be excluded." |
| Past Date | Start date in past (for non-medical) | "Leave start date cannot be in the past." |

### Verification Checklist
- [ ] `LeaveDatePicker.tsx` created in Leave directory
- [ ] Start and end date inputs render
- [ ] Calendar popup displays on click
- [ ] Date range selection works
- [ ] Selected dates highlight in calendar
- [ ] Working days calculate correctly
- [ ] Weekends excluded from count
- [ ] Public holidays marked and excluded
- [ ] Conflict detection works
- [ ] Existing leaves highlighted
- [ ] Notice period validation enforced
- [ ] Balance validation checks available days
- [ ] Half-day options display for single day
- [ ] Quick duration buttons work
- [ ] Maximum duration limits enforced
- [ ] Error messages display for violations
- [ ] onDateChange callback fires correctly
- [ ] Different validation per leave type

---

## Task 64: Create Leave Reason Input

### Overview
Create a comprehensive reason input component for leave requests with character counting, validation, common reason templates, attachment support, and medical certificate upload for medical leave.

### Dependencies
- Task 61: Create Leave Form Schema

### Instructions

1. **Create reason input component**
   - Create `LeaveReasonInput.tsx` in Leave directory
   - Multi-line textarea
   - Character counter
   - Minimum/maximum length enforcement

2. **Set validation rules**
   - Minimum: 10 characters (brief explanation)
   - Maximum: 500 characters
   - Display remaining characters
   - Show error if outside range
   - Real-time validation

3. **Add reason templates**
   - Dropdown of common reasons
   - Quick insert button
   - Templates per leave type
   - Customizable after insertion
   - Save custom templates

4. **Implement auto-suggestions**
   - Based on leave type
   - Based on historical reasons
   - Popular reasons in company
   - Click to insert
   - Keyboard navigation

5. **Add medical certificate upload**
   - Show only for medical leave
   - File input for documents
   - Accepted formats: PDF, JPG, PNG
   - Max file size: 5MB
   - Multiple file support

6. **Create file preview**
   - Thumbnail for images
   - PDF icon for PDFs
   - File name display
   - File size display
   - Remove file button

7. **Add character counter**
   - Display: "450 / 500 characters"
   - Green when valid
   - Red when invalid
   - Update in real-time
   - Position: Below textarea

8. **Implement formatting hints**
   - Placeholder text with example
   - Tone guidance (professional)
   - Bullet point support
   - Link support (for medical leave)
   - Line break preservation

9. **Add emergency contact**
   - Required for leave > 5 days
   - Phone number input
   - Emergency contact name
   - Relationship field
   - Validation for format

10. **Create handover notes section**
    - Optional textarea
    - Tasks to delegate
    - Projects to hand over
    - Key contacts
    - Show for leave > 3 days

11. **Implement validation feedback**
    - Real-time character count
    - Error icons for issues
    - Success icon when valid
    - Helper text below field
    - Field border color changes

12. **Add privacy notice**
    - Inform about reason visibility
    - Who can see: Manager, HR
    - Checkbox: "Mark as confidential"
    - Confidential reasons hidden from team
    - Only for medical/personal leave

### Leave Reason Input Layout
```
Basic Reason Input:
┌────────────────────────────────────────┐
│ Leave Reason *                         │
├────────────────────────────────────────┤
│ Common Reasons: [Select Template ▼]   │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Please provide a detailed reason  │ │
│ │ for your leave request...         │ │
│ │                                   │ │
│ │                                   │ │
│ │                                   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 0 / 500 characters (Min: 10)          │
│ ✓ Professional and concise            │
└────────────────────────────────────────┘

With Template Selected:
┌────────────────────────────────────────┐
│ Leave Reason *                         │
├────────────────────────────────────────┤
│ Common Reasons: [Family Emergency ▼]   │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ I need to attend to a family      │ │
│ │ emergency that requires my        │ │
│ │ immediate attention. I will be    │ │
│ │ available by phone if needed.     │ │
│ │                                   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 142 / 500 characters ✓                │
└────────────────────────────────────────┘

Medical Leave with Upload:
┌────────────────────────────────────────┐
│ Leave Reason *                         │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Medical appointment and recovery  │ │
│ │ period as advised by doctor.      │ │
│ └────────────────────────────────────┘ │
│ 62 / 500 characters ✓                 │
│                                        │
│ Medical Certificate * (Required)      │
│ ┌────────────────────────────────────┐ │
│ │ [📄] Medical_Certificate.pdf      │ │
│ │      245 KB                  [×]   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ [ + Upload Another Document ]         │
│                                        │
│ Accepted: PDF, JPG, PNG (Max 5MB)     │
└────────────────────────────────────────┘

Long Leave with Handover:
┌────────────────────────────────────────┐
│ Leave Reason *                         │
│ ┌────────────────────────────────────┐ │
│ │ Annual vacation with family       │ │
│ └────────────────────────────────────┘ │
│ 28 / 500 characters ✓                 │
│                                        │
│ Emergency Contact * (Leave > 5 days)   │
│ Name:  [Jane Doe              ]       │
│ Phone: [+94 77 123 4567       ]       │
│ Relationship: [Spouse ▼]              │
│                                        │
│ Handover Notes (Optional)              │
│ ┌────────────────────────────────────┐ │
│ │ - Project X: Contact Sarah        │ │
│ │ - Client Y: Meeting on 20th       │ │
│ │ - Code review: Pending PRs        │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ☐ Mark as confidential                │
└────────────────────────────────────────┘
```

### Common Reason Templates

| Leave Type | Template Reasons |
|------------|-----------------|
| Annual | Family vacation, Personal time, Wedding attendance, Religious observance |
| Casual | Medical appointment, Personal errand, Home emergency, Family obligation |
| Medical | Illness recovery, Medical procedure, Doctor visit, Health check-up |
| Emergency | Family emergency, Urgent personal matter, Unexpected situation |
| Unpaid | Extended vacation, Personal project, Family care, Education |

### Template Examples

| Template | Text |
|----------|------|
| Family Vacation | "I will be on vacation with my family during this period. I will ensure all pending tasks are completed before my leave." |
| Medical Appointment | "I have a scheduled medical appointment that requires time off. I will provide medical documentation if needed." |
| Family Emergency | "I need to attend to a family emergency that requires my immediate attention. I will be available by phone if needed." |
| Wedding Attendance | "I will be attending a family member's wedding ceremony. All work will be handed over before my leave." |
| Medical Recovery | "I am taking leave for medical recovery as advised by my doctor. Medical certificate attached." |

### Character Count Validation

| Range | State | Color | Message |
|-------|-------|-------|---------|
| 0-9 | Invalid | Red | "Please provide at least 10 characters" |
| 10-500 | Valid | Green | "✓" |
| 501+ | Invalid | Red | "Reason too long. Max 500 characters" |

### Medical Certificate Requirements

| Leave Type | Certificate Required | When |
|------------|---------------------|------|
| Medical (1-2 days) | Optional | Recommended |
| Medical (3+ days) | Required | Always |
| Medical (Backdated) | Required | Always |
| Other Leave Types | Not required | - |

### File Upload Specifications

| Property | Value | Validation |
|----------|-------|------------|
| Allowed Types | PDF, JPG, JPEG, PNG | Check file extension |
| Max Size | 5 MB per file | Check file size |
| Max Files | 3 files | Count uploads |
| Preview | Thumbnail for images, icon for PDF | Generate preview |
| Storage | Upload to server, return URL | API call |

### Emergency Contact Fields

| Field | Type | Validation | Example |
|-------|------|------------|---------|
| Name | Text | Required, 2-50 chars | Jane Doe |
| Phone | Text | Sri Lankan format (+94) | +94 77 123 4567 |
| Relationship | Dropdown | Required | Spouse, Parent, Sibling |

### Handover Notes Fields

| Field | When Required | Max Length | Purpose |
|-------|---------------|------------|---------|
| Tasks | Leave > 3 days | 1000 chars | Pending tasks to delegate |
| Projects | Leave > 3 days | 1000 chars | Active projects status |
| Contacts | Leave > 3 days | 500 chars | Key contacts and numbers |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Leave/LeaveReasonInput.tsx

// 'use client' directive
// Imports
// LeaveReasonInput props
//   - leaveType: Type of leave (affects templates)
//   - duration: Number of days (affects required fields)
//   - value: Current reason text
//   - onChange: Callback for changes
//   - error: Validation error message
// LeaveReasonInput component
//   - Template dropdown
//     - Fetch templates for leave type
//     - Insert template text
//   - Textarea for reason
//     - Controlled input
//     - Min/max length validation
//     - onChange handler
//   - Character counter
//     - Current / Max display
//     - Color based on validity
//   - Medical certificate upload (if medical)
//     - File input
//     - Preview section
//     - Remove file handler
//     - API upload
//   - Emergency contact (if duration > 5)
//     - Name input
//     - Phone input
//     - Relationship dropdown
//   - Handover notes (if duration > 3)
//     - Optional textarea
//     - Helper text
//   - Confidential checkbox
//   - Validation feedback
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Reason | 10-500 characters | "Reason must be between 10-500 characters" |
| Reason | Not empty | "Leave reason is required" |
| Medical Cert | Required for medical 3+ days | "Medical certificate required for medical leave" |
| File Type | PDF, JPG, PNG only | "Invalid file type. Upload PDF, JPG, or PNG" |
| File Size | Max 5MB | "File too large. Maximum 5MB allowed" |
| Emergency Name | Required if duration > 5 | "Emergency contact name required for long leave" |
| Emergency Phone | Valid Sri Lankan format | "Invalid phone number. Use +94 format" |

### Privacy Settings

| Option | Visibility | Use Case |
|--------|------------|----------|
| Normal | Manager, HR, Team (summary) | Standard leaves |
| Confidential | Manager, HR only | Medical, personal, sensitive |

### Verification Checklist
- [ ] `LeaveReasonInput.tsx` created
- [ ] Textarea renders with placeholder
- [ ] Character counter displays and updates
- [ ] Minimum 10 characters enforced
- [ ] Maximum 500 characters enforced
- [ ] Template dropdown shows relevant reasons
- [ ] Template insertion works
- [ ] Medical certificate upload shows for medical leave
- [ ] File type validation works (PDF, JPG, PNG)
- [ ] File size validation enforces 5MB limit
- [ ] File preview displays correctly
- [ ] Remove file button works
- [ ] Emergency contact fields show for leave > 5 days
- [ ] Phone number validation (Sri Lankan format)
- [ ] Handover notes section shows for leave > 3 days
- [ ] Confidential checkbox available
- [ ] Validation errors display correctly
- [ ] onChange callback fires with updated values

---

## Task 65: Create Leave Approval Actions

### Overview
Create approval action components for managers and HR to review and approve/reject leave requests with comments, delegation support, batch approvals, and audit trail.

### Dependencies
- Task 57: Create Leave Requests Table

### Instructions

1. **Create approval actions component**
   - Create `LeaveApprovalActions.tsx` in Leave directory
   - Approve button (green)
   - Reject button (red)
   - Request More Info button (orange)
   - Only visible to managers/HR

2. **Implement approve action**
   - Confirm dialog before approval
   - Optional approval comment
   - Check team capacity
   - Warn if team understaffed
   - Call approve API

3. **Implement reject action**
   - Require rejection reason
   - Modal with reason textarea
   - Minimum 20 characters
   - Common rejection reasons dropdown
   - Send email notification

4. **Add request info action**
   - Modal for additional questions
   - Questions textarea
   - Send to employee
   - Mark request as "Pending Info"
   - Notification to employee

5. **Create batch approval**
   - Select multiple requests
   - Bulk approve button
   - Confirm with list
   - Progress indicator
   - Summary of results

6. **Implement delegation**
   - Delegate approval to another manager
   - Temporary delegation
   - Notification to delegate
   - Audit trail of delegation
   - Return delegation option

7. **Add approval workflow**
   - Multi-level approval if needed
   - First level: Direct manager
   - Second level: Department head
   - Third level: HR (for long leaves)
   - Auto-escalation after timeout

8. **Create approval comments**
   - Optional comment field
   - Visible to employee
   - Record in history
   - Support @mentions
   - Notify mentioned users

9. **Implement policy checks**
   - Check company leave policies
   - Validate against balance
   - Check team availability
   - Verify notice period
   - Show policy violations

10. **Add quick actions**
    - Keyboard shortcuts (A for approve, R for reject)
    - One-click approve for simple requests
    - Swipe gestures on mobile
    - Undo approval (within 5 minutes)

11. **Create approval timeline**
    - Show approval stages
    - Pending, In Review, Approved, Rejected
    - Who approved and when
    - Comments history
    - Status changes

12. **Implement notifications**
    - Email to employee on decision
    - Push notification
    - SMS for urgent requests
    - Manager notification queue
    - Reminder for pending approvals

### Approval Actions Layout
```
Single Request Actions:
┌────────────────────────────────────────┐
│ Leave Request #LV-2024-0123            │
│ John Doe • Annual Leave • 5 days      │
├────────────────────────────────────────┤
│                                        │
│ [ ✓ Approve ] [ ✗ Reject ]            │
│ [ ℹ Request Info ] [ Delegate ]       │
│                                        │
└────────────────────────────────────────┘

Approve Confirmation:
┌────────────────────────────────────────┐
│ Approve Leave Request?                 │
├────────────────────────────────────────┤
│ Employee: John Doe                     │
│ Type: Annual Leave                     │
│ Period: Feb 15-19, 2024 (5 days)      │
│                                        │
│ Team Availability Check:               │
│ ✓ Team capacity: 85% (acceptable)     │
│                                        │
│ Comments (optional):                   │
│ ┌────────────────────────────────────┐ │
│ │ Approved. Have a great time!      │ │
│ └────────────────────────────────────┘ │
│                                        │
│   [ Cancel ]  [ Confirm Approval ]    │
└────────────────────────────────────────┘

Reject Modal:
┌────────────────────────────────────────┐
│ Reject Leave Request                   │
├────────────────────────────────────────┤
│ Reason for Rejection: *                │
│ [ Select Reason ▼ ]                    │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Please provide a detailed reason  │ │
│ │ for rejecting this leave request. │ │
│ │                                   │ │
│ │ The team is understaffed during   │ │
│ │ this period. Please request       │ │
│ │ different dates.                  │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 128 / 500 characters (Min: 20) ✓      │
│                                        │
│ ☑ Send email notification             │
│                                        │
│      [ Cancel ]  [ Reject Leave ]     │
└────────────────────────────────────────┘

Request More Info:
┌────────────────────────────────────────┐
│ Request Additional Information         │
├────────────────────────────────────────┤
│ What information do you need?          │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Please provide more details about │ │
│ │ the handover plan for Project X.  │ │
│ │ Who will be covering your         │ │
│ │ responsibilities?                 │ │
│ └────────────────────────────────────┘ │
│                                        │
│ This request will be marked as:        │
│ "Pending Additional Information"       │
│                                        │
│ Employee will be notified via email.   │
│                                        │
│     [ Cancel ]  [ Send Request ]      │
└────────────────────────────────────────┘

Batch Approval:
┌────────────────────────────────────────┐
│ Approve Multiple Leave Requests        │
├────────────────────────────────────────┤
│ Selected Requests: 5                   │
│                                        │
│ ✓ John Doe - Annual Leave (5 days)    │
│ ✓ Jane Smith - Casual Leave (2 days)  │
│ ✓ Bob Wilson - Annual Leave (3 days)  │
│ ✓ Alice Brown - Medical Leave (1 day) │
│ ✓ Tom Davis - Annual Leave (7 days)   │
│                                        │
│ Team Capacity: ⚠️ 72% (below optimal)  │
│                                        │
│ Comments (applied to all):             │
│ ┌────────────────────────────────────┐ │
│ │ All requests approved.            │ │
│ └────────────────────────────────────┘ │
│                                        │
│   [ Cancel ]  [ Approve All (5) ]     │
└────────────────────────────────────────┘

Delegation:
┌────────────────────────────────────────┐
│ Delegate Approval Authority            │
├────────────────────────────────────────┤
│ Delegate To: [Sarah Johnson ▼]        │
│                                        │
│ Duration:                              │
│ From: [2024-02-15] To: [2024-02-20]    │
│                                        │
│ Reason:                                │
│ ┌────────────────────────────────────┐ │
│ │ I will be on leave and need       │ │
│ │ someone to handle approvals.      │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Notify delegate:                       │
│ ☑ Email   ☑ Push Notification         │
│                                        │
│     [ Cancel ]  [ Delegate ]          │
└────────────────────────────────────────┘
```

### Approval Actions

| Action | Button Color | Icon | Required Input | Notification |
|--------|-------------|------|----------------|--------------|
| Approve | Green | ✓ | Optional comment | Yes |
| Reject | Red | ✗ | Reason (20+ chars) | Yes |
| Request Info | Orange | ℹ | Questions | Yes |
| Delegate | Blue | → | Delegate, Duration | Yes |
| Undo | Gray | ↶ | None (within 5 min) | Yes |

### Common Rejection Reasons

| Reason | When to Use |
|--------|------------|
| Insufficient notice | Request submitted too late |
| Team understaffed | Too many people on leave |
| Blackout period | Company critical period |
| Incomplete information | Missing required details |
| Exceeds balance | Insufficient leave balance |
| Overlapping requests | Already approved similar period |
| Policy violation | Doesn't meet company policy |

### Policy Check Validations

| Check | Validation | Action if Failed |
|-------|------------|------------------|
| Notice Period | >= 3 days advance | Warn manager, allow override |
| Team Capacity | >= 70% available | Show warning, require comment |
| Leave Balance | Requested <= Available | Show error, suggest alternatives |
| Consecutive Days | <= Max per type | Show policy limit |
| Blackout Period | Not in blackout dates | Prevent approval |
| Previous Requests | No overlaps | Show conflict |

### Multi-Level Approval Flow

| Leave Duration | Approval Levels | Auto-Approve Threshold |
|----------------|----------------|------------------------|
| 1-2 days | Direct Manager | < 2 days, casual leave |
| 3-5 days | Direct Manager + HR | None |
| 6-10 days | Manager + Dept Head + HR | None |
| 11+ days | Manager + Dept Head + HR + CEO | None |

### Team Capacity Calculation

| Metric | Formula | Threshold |
|--------|---------|-----------|
| Team Capacity | (Available / Total) × 100 | > 70% optimal |
| Critical Capacity | < 60% | Requires justification |
| Optimal Capacity | 80-90% | Ideal range |

### Approval Timeline Stages

| Stage | Status | Who Acts | Timeframe |
|-------|--------|----------|-----------|
| Submitted | Pending | - | - |
| Under Review | In Review | Manager | 24 hours |
| Awaiting Info | Pending Info | Employee | 48 hours |
| Approved Level 1 | Approved | Manager | - |
| Approved Level 2 | Approved | Dept Head | 24 hours |
| Approved Final | Approved | HR | - |
| Rejected | Rejected | Any approver | - |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Leave/LeaveApprovalActions.tsx

// 'use client' directive
// Imports
// LeaveApprovalActions props
//   - request: Leave request object
//   - userRole: Current user's role (manager/HR)
//   - onApprove: Callback function
//   - onReject: Callback function
//   - onRequestInfo: Callback function
//   - canDelegate: Boolean
// LeaveApprovalActions component
//   - Permission check (manager/HR only)
//   - Approve button
//     - Approval modal
//     - Team capacity check
//     - Comment input
//     - Confirm handler
//   - Reject button
//     - Rejection modal
//     - Reason dropdown
//     - Reason textarea
//     - Validation (20+ chars)
//     - Confirm handler
//   - Request Info button
//     - Info request modal
//     - Questions textarea
//     - Confirm handler
//   - Delegate button (if canDelegate)
//     - Delegation modal
//     - Delegate selector
//     - Duration picker
//     - Reason input
//   - Batch actions (if multiple selected)
//   - Undo option (within 5 minutes)
//   - Approval timeline display
//   - Keyboard shortcuts
```

### Notification Templates

| Action | Recipient | Subject | Content |
|--------|-----------|---------|---------|
| Approved | Employee | Leave Request Approved | "Your leave request for [dates] has been approved by [manager]." |
| Rejected | Employee | Leave Request Rejected | "Your leave request has been rejected. Reason: [reason]" |
| Info Requested | Employee | Additional Information Required | "Your manager needs more information about your leave request." |
| Delegated | Delegate | Approval Delegated to You | "You have been delegated approval authority by [manager] from [dates]." |
| Pending | Manager | Pending Leave Approval | "You have [count] pending leave requests to review." |

### Verification Checklist
- [ ] `LeaveApprovalActions.tsx` created
- [ ] Actions only visible to managers/HR
- [ ] Approve button triggers confirmation modal
- [ ] Approval modal shows request details
- [ ] Team capacity check displays
- [ ] Optional comment input works
- [ ] Reject button opens rejection modal
- [ ] Rejection reason dropdown shows options
- [ ] Reason textarea enforces 20 char minimum
- [ ] Request Info button opens modal
- [ ] Questions textarea functional
- [ ] Delegate button opens delegation modal
- [ ] Delegate selection works
- [ ] Batch approval available for multiple selections
- [ ] Undo action available within 5 minutes
- [ ] API calls succeed for all actions
- [ ] Email notifications sent
- [ ] Approval timeline updates
- [ ] Keyboard shortcuts work (A/R)

---

## Task 66: Create Approval Modal

### Overview
Create a comprehensive approval modal that provides managers with all necessary information to make informed decisions on leave requests, including employee details, leave history, team impact, and policy compliance.

### Dependencies
- Task 65: Create Leave Approval Actions

### Instructions

1. **Create approval modal component**
   - Create `LeaveApprovalModal.tsx` in Leave directory
   - Full-screen or large modal
   - Detailed information display
   - Decision buttons prominent

2. **Add employee information section**
   - Employee photo and name
   - Department and position
   - Employee ID
   - Join date and tenure
   - Direct reports (if any)

3. **Display request details section**
   - Leave type with icon
   - Start and end dates
   - Duration (working days)
   - Half-day indicator if applicable
   - Requested on date

4. **Show leave reason and attachments**
   - Full reason text
   - Medical certificates (preview)
   - Emergency contact details
   - Handover notes
   - Confidential badge if marked

5. **Add leave balance section**
   - Current balance by type
   - Balance after approval
   - Year-to-date usage
   - Comparison to team average
   - Visual progress bars

6. **Create leave history section**
   - Past 6 months of leaves
   - Leave type distribution
   - Approval/rejection history
   - Patterns (e.g., frequent Mondays/Fridays)
   - Chart visualization

7. **Implement team impact analysis**
   - Team members on leave (same dates)
   - Team capacity percentage
   - Critical skills coverage
   - Recommended action
   - Alternative suggestions

8. **Add policy compliance check**
   - Notice period compliance
   - Duration limits compliance
   - Balance sufficiency
   - Blackout period check
   - Overall compliance score

9. **Create timeline visualization**
   - Calendar view of requested dates
   - Mark weekends and holidays
   - Show team leave overlaps
   - Highlight conflicts
   - Capacity bars per day

10. **Add approval comment section**
    - Rich text editor
    - @mention team members
    - Attach files
    - Templates (approval, conditional)
    - Character counter

11. **Implement decision buttons**
    - Large Approve button (green)
    - Reject button (red)
    - Request More Info button (orange)
    - Save Draft button
    - Cancel button

12. **Add audit trail**
    - Who viewed the request
    - When viewed
    - Previous actions
    - Comment history
    - Status changes

### Approval Modal Layout
```
┌───────────────────────────────────────────────────────────────────┐
│ Leave Request Approval                                      [×]   │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Photo]  John Doe                    Pending Approval       │ │
│ │          Senior Software Engineer    Requested: Jan 20      │ │
│ │          Engineering Dept            Review By: Jan 23      │ │
│ │          EMP-001 • 3 years tenure                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Leave Details                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Type: 🏖 Annual Leave                                       │ │
│ │ Period: Feb 15 - Feb 19, 2024                              │ │
│ │ Duration: 5 working days                                    │ │
│ │                                                             │ │
│ │ Reason:                                                     │ │
│ │ "Family vacation to celebrate anniversary. All projects    │ │
│ │  will be handed over to Sarah before my leave."            │ │
│ │                                                             │ │
│ │ Handover Notes:                                             │ │
│ │ • Project X: Sarah will handle (briefing completed)        │ │
│ │ • Client Y: Meeting rescheduled to Feb 22                  │ │
│ │                                                             │ │
│ │ Emergency Contact: Jane Doe (Spouse) +94 77 123 4567       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Leave Balance                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Annual Leave:   [████████░░░░] 12/14 days remaining        │ │
│ │ After Approval: [███░░░░░░░░░]  7/14 days remaining        │ │
│ │                                                             │ │
│ │ YTD Usage: 2 days (14% of entitlement)                     │ │
│ │ Team Average: 4.5 days (32% of entitlement)                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Leave History (Last 6 Months)                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Dec 2023: Annual Leave (2 days) - Approved                 │ │
│ │ Oct 2023: Casual Leave (1 day) - Approved                  │ │
│ │ Sep 2023: Medical Leave (1 day) - Approved                 │ │
│ │                                                             │ │
│ │ Pattern: No issues detected ✓                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Team Impact Analysis                                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Team Capacity: 85% ✓ (Acceptable)                          │ │
│ │                                                             │ │
│ │ Concurrent Leaves:                                          │ │
│ │ • Bob Wilson: Feb 18-19 (Annual Leave)                     │ │
│ │                                                             │ │
│ │ Critical Skills: Full-stack dev (3/4 available) ✓          │ │
│ │                                                             │ │
│ │ Recommendation: Safe to approve                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Policy Compliance                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✓ Notice Period: 25 days advance (Req: 3 days)             │ │
│ │ ✓ Duration: 5 days (Max: 14 days consecutive)              │ │
│ │ ✓ Balance: Sufficient (7 days remaining)                   │ │
│ │ ✓ Blackout: Not in blackout period                         │ │
│ │                                                             │ │
│ │ Overall Compliance: 100% ✓                                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Timeline View                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Feb 15  16  17  18  19  20  21  22                         │ │
│ │ ├───┬───┬───┬───┬───┬───┬───┬───┤                          │ │
│ │ │ ■ │ ■ │ ■ │ ■ │ ■ │   │   │   │ John Doe               │ │
│ │ │   │   │   │ ■ │ ■ │   │   │   │ Bob Wilson             │ │
│ │ │   │   │   │   │   │   │   │   │ Sarah Lee              │ │
│ │ └───┴───┴───┴───┴───┴───┴───┴───┘                          │ │
│ │ Capacity: 100% 100% 100% 85% 85% 100% 100% 100%            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Manager Comments (Optional)                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Add your comments here...                                   │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ 0 / 500 characters                                                │
│                                                                   │
│ Audit Trail                                                       │
│ • Viewed by Sarah Johnson (Manager) on Jan 20 at 2:30 PM         │
│ • Reviewed by HR Bot on Jan 20 at 2:31 PM (Auto-check)           │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │        [ Reject ]  [ Request Info ]  [ ✓ Approve ]          ││
│ └──────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────┘
```

### Modal Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Employee Info | Photo, name, role, tenure | Identify employee |
| Request Details | Type, dates, reason, handover | Understand request |
| Leave Balance | Current, after approval, YTD | Check sufficiency |
| Leave History | Past leaves, patterns | Assess reliability |
| Team Impact | Capacity, overlaps, skills | Evaluate business impact |
| Policy Compliance | Checks against policies | Ensure compliance |
| Timeline | Visual calendar | See overlaps |
| Comments | Manager input | Document decision |
| Audit Trail | View/action history | Transparency |
| Decision Buttons | Approve/Reject/Info | Take action |

### Leave Balance Display

| Metric | Calculation | Display |
|--------|-------------|---------|
| Current Balance | Entitlement - Used - Pending | "12/14 days" |
| After Approval | Current - Requested | "7/14 days" |
| YTD Usage | Total used this year | "2 days (14%)" |
| Team Average | Avg(Team YTD Usage) | "4.5 days (32%)" |
| Percentage | (Used / Entitlement) × 100 | Progress bar |

### Team Impact Levels

| Capacity | Color | Action | Description |
|----------|-------|--------|-------------|
| 90-100% | Green | Approve | Optimal capacity |
| 80-89% | Light Green | Approve | Acceptable capacity |
| 70-79% | Yellow | Review | Below optimal, consider |
| 60-69% | Orange | Caution | Requires justification |
| < 60% | Red | Risky | Strongly advise against |

### Policy Compliance Checks

| Check | Pass Criteria | Display |
|-------|--------------|---------|
| Notice Period | >= Required days | ✓ or ✗ with days given |
| Duration Limit | <= Max consecutive days | ✓ or ✗ with requested vs max |
| Balance | Requested <= Available | ✓ or ✗ with shortfall |
| Blackout Period | Not in blackout dates | ✓ or ✗ with dates |
| Overall Score | All checks pass | Percentage (0-100%) |

### Leave Pattern Detection

| Pattern | Detection Logic | Flag |
|---------|----------------|------|
| Frequent Mondays | > 3 Monday leaves in 6 months | ⚠️ Warning |
| Frequent Fridays | > 3 Friday leaves in 6 months | ⚠️ Warning |
| Weekend Extensions | Leaves adjacent to weekends | ℹ️ Info |
| Holiday Extensions | Leaves adjacent to holidays | ℹ️ Info |
| Short Notice | < 3 days advance > 3 times | ⚠️ Warning |
| Long Leaves | > 10 days multiple times | ℹ️ Info |

### Timeline Visualization

| Element | Display | Color |
|---------|---------|-------|
| Requested Days | Solid block | Blue |
| Weekends | Shaded | Gray |
| Public Holidays | Icon | Yellow |
| Team Member Leaves | Thin bar | Various colors |
| Capacity Meter | Percentage bar | Green/Yellow/Red |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Leave/LeaveApprovalModal.tsx

// 'use client' directive
// Imports
// LeaveApprovalModal props
//   - request: Full leave request object
//   - isOpen: Modal visibility state
//   - onClose: Close handler
//   - onApprove: Approve callback
//   - onReject: Reject callback
//   - onRequestInfo: Request info callback
// LeaveApprovalModal component
//   - Modal container
//   - Employee info section
//     - Photo, name, role
//     - Tenure, department
//   - Request details section
//     - Type, dates, duration
//     - Reason display
//     - Attachments preview
//     - Handover notes
//     - Emergency contact
//   - Leave balance section
//     - Current balance bars
//     - After approval projection
//     - YTD usage stats
//     - Team comparison
//   - Leave history section
//     - Past leaves list
//     - Pattern detection
//     - Chart visualization
//   - Team impact section
//     - Capacity calculation
//     - Concurrent leaves list
//     - Skills coverage
//     - Recommendation
//   - Policy compliance section
//     - Compliance checks
//     - Pass/fail indicators
//     - Overall score
//   - Timeline visualization
//     - Calendar component
//     - Team overlays
//     - Capacity bars
//   - Comments textarea
//   - Audit trail display
//   - Decision buttons
//     - Approve handler
//     - Reject handler
//     - Request info handler
//     - Cancel handler
```

### Verification Checklist
- [ ] `LeaveApprovalModal.tsx` created
- [ ] Modal opens when triggered
- [ ] Employee information displays correctly
- [ ] Request details show all information
- [ ] Reason and handover notes display
- [ ] Medical certificates preview (if applicable)
- [ ] Leave balance calculations correct
- [ ] Balance after approval projects correctly
- [ ] YTD usage displays
- [ ] Team average comparison shows
- [ ] Leave history lists past leaves
- [ ] Pattern detection flags issues
- [ ] Team impact analysis calculates capacity
- [ ] Concurrent leaves listed
- [ ] Policy compliance checks run
- [ ] All compliance checks show status
- [ ] Timeline visualization displays
- [ ] Calendar shows requested dates
- [ ] Team overlays render
- [ ] Comments textarea accepts input
- [ ] Audit trail shows view history
- [ ] Approve button triggers correct action
- [ ] Reject button triggers correct action
- [ ] Request Info button triggers correct action
- [ ] Modal closes properly

---

## Task 67: Create Leave Calendar View

### Overview
Create an interactive team leave calendar that visualizes all approved and pending leaves across the organization, helps identify coverage gaps, shows team availability, and supports planning with drag-and-drop functionality.

### Dependencies
- Task 53: Create Leave Dashboard Page

### Instructions

1. **Create leave calendar component**
   - Create `LeaveCalendarView.tsx` in Leave directory
   - Month/week/day view toggle
   - Full calendar grid display
   - Color-coded leave types

2. **Implement month view**
   - Standard calendar grid (7 columns × 5-6 rows)
   - Show all team member leaves
   - Color blocks for each leave
   - Employee name on hover
   - Click to view details

3. **Add week view**
   - 7-day horizontal layout
   - Team members as rows
   - Leave blocks with duration
   - Hours/days indicator
   - Scrollable for large teams

4. **Create day view**
   - Detailed single-day view
   - List all employees
   - Status for each (present/leave)
   - Leave type if on leave
   - Real-time capacity percentage

5. **Implement color coding**
   - Annual Leave: Blue
   - Casual Leave: Green
   - Medical Leave: Red
   - Emergency Leave: Orange
   - Unpaid Leave: Gray
   - Pending: Striped pattern

6. **Add filters**
   - Department filter
   - Employee filter
   - Leave type filter
   - Status filter (Approved/Pending/All)
   - Date range selector

7. **Create team capacity indicators**
   - Percentage per day
   - Color-coded capacity bars
   - Threshold warnings
   - Critical capacity alerts
   - Optimal capacity highlights

8. **Implement leave details popup**
   - Click on leave block
   - Show full details
   - Employee info
   - Leave type and duration
   - Reason (if authorized)
   - Approval status

9. **Add legend**
   - Color explanations
   - Leave type icons
   - Status patterns
   - Capacity levels
   - Interactive toggles

10. **Create navigation controls**
    - Previous/Next month buttons
    - Today button
    - Month/Year selector
    - Jump to date
    - Keyboard shortcuts

11. **Implement export calendar**
    - Export as iCal file
    - Export as PDF
    - Share team calendar link
    - Sync with external calendars
    - Subscribe to updates

12. **Add capacity planning tools**
    - Highlight understaffed days
    - Suggest better dates
    - Show alternative options
    - Team coverage simulation
    - What-if analysis

### Leave Calendar Layout
```
Month View:
┌────────────────────────────────────────────────────────────────┐
│ ◀ February 2024 ▶                      [ Month | Week | Day ] │
├────────────────────────────────────────────────────────────────┤
│ Filters: [All Departments ▼] [All Types ▼] [Approved ▼]      │
├────────────────────────────────────────────────────────────────┤
│ Sun    Mon    Tue    Wed    Thu    Fri    Sat                 │
├────────────────────────────────────────────────────────────────┤
│        │  1    │  2    │  3    │  4    │  5    │  6          │
│        │       │       │       │       │ [JD]  │              │
│        │       │       │       │       │ 100%  │              │
├────────┼───────┼───────┼───────┼───────┼───────┼──────────────┤
│  7     │  8    │  9    │ 10    │ 11    │ 12    │ 13          │
│        │       │       │       │       │       │              │
│        │       │       │       │       │       │              │
├────────┼───────┼───────┼───────┼───────┼───────┼──────────────┤
│ 14     │ 15    │ 16    │ 17    │ 18    │ 19    │ 20          │
│        │[JD ──┼──────┼──────┼────── JS]│       │              │
│        │[BW ──┼────── BW]    │       │       │              │
│        │ 85%   │ 85%   │ 85%   │ 92%   │ 100%  │              │
├────────┼───────┼───────┼───────┼───────┼───────┼──────────────┤
│ 21     │ 22    │ 23    │ 24    │ 25    │ 26    │ 27          │
│        │       │       │[AL]   │       │       │              │
│        │ 100%  │ 100%  │ 96%   │ 100%  │ 100%  │              │
├────────┼───────┼───────┼───────┼───────┼───────┼──────────────┤
│ 28     │ 29    │       │       │       │       │              │
│        │       │       │       │       │       │              │
└────────────────────────────────────────────────────────────────┘

Legend:
🟦 Annual  🟩 Casual  🟥 Medical  🟧 Emergency  ⬜ Pending
Capacity: 🟢 > 85%  🟡 70-85%  🟠 60-70%  🔴 < 60%

Week View:
┌────────────────────────────────────────────────────────────────┐
│ Week of Feb 12-18, 2024                [ Month | Week | Day ] │
├────────────────────────────────────────────────────────────────┤
│ Employee    │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun         │
├─────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────────────┤
│ John Doe    │ ████│ ████│ ████│ ████│     │  ×  │  ×          │
│             │ Annual Leave (5 days)     │     │     │          │
├─────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────────────┤
│ Jane Smith  │     │     │     │     │     │  ×  │  ×          │
│             │     │     │     │     │     │     │             │
├─────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────────────┤
│ Bob Wilson  │     │     │     │ ████│ ████│  ×  │  ×          │
│             │     │     │     │Casual(2 d)│     │             │
├─────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────────────┤
│ Alice Brown │     │     │     │     │     │  ×  │  ×          │
│             │     │     │     │     │     │     │             │
├─────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────────────┤
│ Capacity    │100% │100% │100% │ 85% │ 85% │  -  │  -          │
└────────────────────────────────────────────────────────────────┘

Day View - Feb 15, 2024:
┌────────────────────────────────────────────────────────────────┐
│ Thursday, February 15, 2024            [ Month | Week | Day ] │
├────────────────────────────────────────────────────────────────┤
│ Team Status: 85% Capacity (Acceptable)                         │
├────────────────────────────────────────────────────────────────┤
│ Present (17 employees)                                         │
│ ✓ Jane Smith - Engineering                                    │
│ ✓ Alice Brown - Engineering                                   │
│ ✓ Tom Davis - Sales                                           │
│ ✓ Sarah Johnson - HR                                          │
│ ... (13 more)                                                  │
│                                                                │
│ On Leave (3 employees)                                         │
│ 🟦 John Doe - Annual Leave (Feb 15-19)                        │
│    "Family vacation"                                           │
│ 🟩 Bob Wilson - Casual Leave (Feb 14-15)                      │
│    "Personal appointment"                                      │
│ 🟥 Mary Clark - Medical Leave (Feb 15)                        │
│    Half Day (Morning)                                          │
└────────────────────────────────────────────────────────────────┘

Leave Details Popup:
┌────────────────────────────────────────┐
│ Leave Details                    [×]   │
├────────────────────────────────────────┤
│ [Photo] John Doe                       │
│         Senior Engineer                │
│         Engineering                     │
│                                        │
│ Type: Annual Leave                     │
│ Period: Feb 15-19, 2024                │
│ Duration: 5 working days               │
│ Status: ✓ Approved                     │
│                                        │
│ Approved by: Sarah Johnson             │
│ Approved on: Jan 20, 2024              │
│                                        │
│ [ View Full Request ]                  │
└────────────────────────────────────────┘
```

### Calendar View Options

| View | Layout | Best For | Data Shown |
|------|--------|----------|------------|
| Month | Grid (7×5) | Overview, planning | All leaves, capacity |
| Week | Timeline (7 days × employees) | Detailed week view | Individual schedules |
| Day | List view | Daily operations | Who's present/absent |
| Year | 12-month grid | Long-term planning | Summary blocks |

### Color Coding System

| Leave Type | Color | Hex Code | Pattern (Pending) |
|------------|-------|----------|-------------------|
| Annual Leave | Blue | #3B82F6 | Diagonal stripes |
| Casual Leave | Green | #10B981 | Diagonal stripes |
| Medical Leave | Red | #EF4444 | Diagonal stripes |
| Emergency Leave | Orange | #F97316 | Diagonal stripes |
| Unpaid Leave | Gray | #6B7280 | Diagonal stripes |

### Capacity Indicators

| Capacity Range | Color | Icon | Action Required |
|----------------|-------|------|-----------------|
| 90-100% | Green | ✓ | None - Optimal |
| 80-89% | Light Green | ✓ | None - Acceptable |
| 70-79% | Yellow | ⚠️ | Monitor |
| 60-69% | Orange | ⚠️ | Caution - Review |
| < 60% | Red | ✗ | Critical - Action needed |

### Filter Options

| Filter | Options | Default | Effect |
|--------|---------|---------|--------|
| Department | All / Individual departments | All | Show only selected dept |
| Employee | All / Individual employees | All | Show only selected employee |
| Leave Type | All / Specific types | All | Show only specific types |
| Status | All / Approved / Pending | Approved | Filter by approval status |
| Date Range | Custom range | Current month | Show selected period |

### Team Capacity Calculation

| Element | Formula | Example |
|---------|---------|---------|
| Total Employees | Count of team members | 20 |
| On Leave Today | Count with leave today | 3 |
| Available | Total - On Leave | 20 - 3 = 17 |
| Capacity % | (Available / Total) × 100 | (17 / 20) × 100 = 85% |

### Leave Block Display

| Info | Where Shown | Format |
|------|-------------|--------|
| Employee Initials | Calendar block | JD, JS |
| Full Name | Hover tooltip | John Doe |
| Leave Type | Block color | Blue = Annual |
| Duration | Hover tooltip | 5 days |
| Status | Block pattern | Solid = Approved |
| Reason | Popup detail | Full text |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Leave/LeaveCalendarView.tsx

// 'use client' directive
// Imports
// LeaveCalendarView component
//   - State management
//     - Selected date
//     - View mode (month/week/day)
//     - Filters
//   - Fetch leave data
//     - Get all leaves for period
//     - Get employee data
//     - Get team structure
//   - View mode selector
//     - Month view component
//     - Week view component
//     - Day view component
//   - Filters section
//     - Department filter
//     - Employee filter
//     - Leave type filter
//     - Status filter
//   - Calendar grid (month view)
//     - Render calendar cells
//     - Map leaves to dates
//     - Color-code leave blocks
//     - Show capacity per day
//   - Timeline (week view)
//     - Employee rows
//     - Day columns
//     - Leave blocks
//     - Capacity summary
//   - List (day view)
//     - Present employees list
//     - On leave employees list
//     - Leave details
//   - Leave details popup
//     - Employee info
//     - Leave details
//     - Approval info
//   - Navigation controls
//   - Legend
//   - Export options
```

### Navigation Controls

| Control | Action | Shortcut |
|---------|--------|----------|
| Previous | Go to previous period | ← |
| Next | Go to next period | → |
| Today | Jump to current date | T |
| Month Picker | Select specific month | M |
| View Toggle | Switch month/week/day | V |

### Export Options

| Format | Content | Use Case |
|--------|---------|----------|
| iCal | Leave events | Import to personal calendar |
| PDF | Visual calendar | Print/share |
| Excel | Leave data table | Analysis |
| Link | Shareable URL | Team access |

### Verification Checklist
- [ ] `LeaveCalendarView.tsx` created
- [ ] Month view displays calendar grid
- [ ] Week view shows timeline layout
- [ ] Day view lists present/absent employees
- [ ] Leave blocks render with correct colors
- [ ] Pending leaves show striped pattern
- [ ] Employee initials display on blocks
- [ ] Hover shows full employee name and details
- [ ] Click opens leave details popup
- [ ] Capacity percentage displays per day
- [ ] Capacity colors match thresholds
- [ ] Department filter works
- [ ] Employee filter works
- [ ] Leave type filter works
- [ ] Status filter works
- [ ] Navigation controls function
- [ ] Legend displays correctly
- [ ] Export options work
- [ ] Responsive design for mobile
- [ ] Loading states display

---

## Task 68: Connect Leave to API

### Overview
Implement complete API integration for the leave management system, connecting all UI components to backend endpoints with proper error handling, loading states, optimistic updates, caching, and real-time synchronization.

### Dependencies
- Task 67: Create Leave Calendar View

### Instructions

1. **Create leave API service**
   - Create `services/api/leave.ts`
   - Define all API endpoints
   - TypeScript interfaces for requests/responses
   - Base URL configuration

2. **Implement leave request submission**
   - POST `/api/hr/leave/requests`
   - Payload: Leave type, dates, reason, attachments
   - Response: Created request with ID
   - Handle file uploads separately

3. **Add leave requests fetching**
   - GET `/api/hr/leave/requests`
   - Query params: employee, status, dateRange
   - Pagination support
   - Sorting and filtering
   - Response: Array of requests

4. **Create leave balance API**
   - GET `/api/hr/leave/balance/:employeeId`
   - Response: Balance by leave type
   - Include YTD usage
   - Calculate remaining balance

5. **Implement approval endpoints**
   - POST `/api/hr/leave/requests/:id/approve`
   - POST `/api/hr/leave/requests/:id/reject`
   - POST `/api/hr/leave/requests/:id/request-info`
   - Include comments in payload
   - Return updated request

6. **Add calendar data endpoint**
   - GET `/api/hr/leave/calendar`
   - Query params: dateRange, department, employee
   - Response: All leaves for period
   - Include employee details
   - Team capacity data

7. **Create team capacity endpoint**
   - GET `/api/hr/leave/team-capacity`
   - Query params: date, department
   - Response: Capacity percentage
   - List of employees on leave
   - Critical skills coverage

8. **Implement file upload**
   - POST `/api/hr/leave/upload`
   - Multipart form data
   - Return file URL
   - Validate file type and size
   - Virus scanning

9. **Add leave history endpoint**
   - GET `/api/hr/leave/history/:employeeId`
   - Query params: period (6 months default)
   - Response: Past leaves
   - Approval patterns
   - Statistics

10. **Create real-time updates**
    - WebSocket connection
    - Subscribe to leave updates
    - Broadcast approval status changes
    - Team calendar updates
    - Push notifications

11. **Implement caching strategy**
    - Cache leave balances (5 minutes)
    - Cache calendar data (1 minute)
    - Invalidate on mutations
    - Optimistic updates
    - Background refetch

12. **Add error handling**
    - Network errors
    - Validation errors
    - Authorization errors
    - Retry logic
    - User-friendly messages

13. **Create loading states**
    - Request submission: Button spinner
    - Data fetching: Skeleton screens
    - Approval: Disable buttons
    - File upload: Progress bar
    - Calendar: Loading overlay

14. **Implement optimistic updates**
    - Immediately update UI
    - Show pending state
    - Rollback on error
    - Sync with server
    - Conflict resolution

### API Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| /api/hr/leave/requests | GET | List requests | Required |
| /api/hr/leave/requests | POST | Submit request | Required |
| /api/hr/leave/requests/:id | GET | Get single request | Required |
| /api/hr/leave/requests/:id | PUT | Update request | Required |
| /api/hr/leave/requests/:id/approve | POST | Approve request | Manager/HR |
| /api/hr/leave/requests/:id/reject | POST | Reject request | Manager/HR |
| /api/hr/leave/requests/:id/request-info | POST | Request more info | Manager/HR |
| /api/hr/leave/balance/:employeeId | GET | Get balance | Required |
| /api/hr/leave/calendar | GET | Get calendar data | Required |
| /api/hr/leave/team-capacity | GET | Get team capacity | Required |
| /api/hr/leave/history/:employeeId | GET | Get history | Required |
| /api/hr/leave/upload | POST | Upload files | Required |

### Request/Response Interfaces

**Submit Leave Request**
```typescript
// Request
{
  employeeId: string
  leaveType: 'annual' | 'casual' | 'medical' | 'emergency' | 'unpaid'
  startDate: string // ISO 8601
  endDate: string
  isHalfDay: boolean
  halfDayPeriod?: 'morning' | 'afternoon'
  reason: string
  attachments?: string[] // URLs
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  handoverNotes?: string
  isConfidential: boolean
}

// Response
{
  id: string
  requestNumber: string
  status: 'pending' | 'approved' | 'rejected' | 'pending-info'
  createdAt: string
  workingDays: number
  ...rest of request data
}
```

**Get Leave Balance**
```typescript
// Response
{
  employeeId: string
  balances: {
    annual: {
      entitlement: number
      used: number
      pending: number
      available: number
    }
    casual: { ... }
    medical: { ... }
  }
  yearToDate: {
    annual: number
    casual: number
    medical: number
  }
  teamAverage: {
    annual: number
    casual: number
  }
}
```

**Get Calendar Data**
```typescript
// Query Params
{
  startDate: string
  endDate: string
  department?: string
  employee?: string
}

// Response
{
  leaves: [
    {
      id: string
      employee: {
        id: string
        name: string
        photo: string
        department: string
      }
      leaveType: string
      startDate: string
      endDate: string
      status: string
      workingDays: number
    }
  ]
  teamCapacity: {
    [date: string]: {
      total: number
      available: number
      percentage: number
    }
  }
}
```

### Error Response Format

```typescript
{
  error: {
    code: string // 'INSUFFICIENT_BALANCE', 'INVALID_DATES', etc.
    message: string // User-friendly message
    details?: any // Additional error details
  }
}
```

### Common Error Codes

| Code | HTTP Status | Meaning | User Message |
|------|------------|---------|--------------|
| INSUFFICIENT_BALANCE | 400 | Not enough leave days | "Insufficient leave balance" |
| INVALID_DATES | 400 | Invalid date range | "Invalid date range selected" |
| NOTICE_PERIOD | 400 | Notice period violation | "Minimum 3 days notice required" |
| CONFLICT | 409 | Overlapping leave | "You have another leave on these dates" |
| UNAUTHORIZED | 401 | Not authenticated | "Please log in" |
| FORBIDDEN | 403 | No permission | "You don't have permission" |
| NOT_FOUND | 404 | Resource not found | "Leave request not found" |
| NETWORK_ERROR | - | Connection failed | "Network error. Please try again" |

### Caching Strategy

| Data Type | Cache Duration | Invalidate On |
|-----------|---------------|---------------|
| Leave Balances | 5 minutes | New request, approval, rejection |
| Calendar Data | 1 minute | Any leave change |
| Employee Data | 30 minutes | Employee update |
| Team Structure | 1 hour | Department change |
| Leave Policies | 24 hours | Policy update |

### Optimistic Update Flow

```
1. User submits leave request
   ↓
2. Immediately add to UI as "Pending"
   ↓
3. Show temporary ID
   ↓
4. Call API in background
   ↓
5. API returns success
   ↓
6. Replace temporary with real ID
   ↓
7. Update status
   ↓
8. Show success notification

Error Path:
5. API returns error
   ↓
6. Remove from UI
   ↓
7. Show error message
   ↓
8. Optionally: Save draft
```

### Loading States

| Action | Loading UI | Duration |
|--------|-----------|----------|
| Submit Request | Button spinner, disable form | 1-3 seconds |
| Fetch Requests | Skeleton table rows | 0.5-2 seconds |
| Load Calendar | Loading overlay, shimmer | 0.5-2 seconds |
| Approve/Reject | Disable buttons, spinner | 1-2 seconds |
| File Upload | Progress bar | 2-10 seconds |
| Fetch Balance | Skeleton cards | 0.5-1 second |

### Expected Service Structure

```typescript
// File: frontend/services/api/leave.ts

// Imports
// API base configuration
// Type definitions

// Leave Request Functions
export async function submitLeaveRequest(data: LeaveRequestInput): Promise<LeaveRequest>
export async function getLeaveRequests(params: RequestParams): Promise<LeaveRequest[]>
export async function getLeaveRequest(id: string): Promise<LeaveRequest>
export async function updateLeaveRequest(id: string, data: Partial<LeaveRequestInput>): Promise<LeaveRequest>

// Approval Functions
export async function approveLeaveRequest(id: string, comment?: string): Promise<LeaveRequest>
export async function rejectLeaveRequest(id: string, reason: string): Promise<LeaveRequest>
export async function requestMoreInfo(id: string, questions: string): Promise<LeaveRequest>

// Balance Functions
export async function getLeaveBalance(employeeId: string): Promise<LeaveBalance>

// Calendar Functions
export async function getLeaveCalendar(params: CalendarParams): Promise<CalendarData>
export async function getTeamCapacity(params: CapacityParams): Promise<TeamCapacity>

// History Functions
export async function getLeaveHistory(employeeId: string, params?: HistoryParams): Promise<LeaveRequest[]>

// File Upload
export async function uploadLeaveAttachment(file: File): Promise<string> // Returns URL

// WebSocket
export function subscribeToLeaveUpdates(callback: (update: LeaveUpdate) => void): () => void // Returns unsubscribe
```

### React Query Integration

```typescript
// File: frontend/hooks/useLeaveData.ts

// Custom hooks using React Query

export function useLeaveRequests(params?: RequestParams)
export function useLeaveBalance(employeeId: string)
export function useLeaveCalendar(params: CalendarParams)
export function useTeamCapacity(params: CapacityParams)

export function useSubmitLeaveRequest()
export function useApproveLeave()
export function useRejectLeave()

// With optimistic updates, caching, and error handling
```

### Verification Checklist
- [ ] API service file created at `services/api/leave.ts`
- [ ] All endpoint functions defined with TypeScript types
- [ ] Submit leave request API works
- [ ] Get leave requests API returns data
- [ ] Get leave balance API returns correct balances
- [ ] Approve endpoint updates request status
- [ ] Reject endpoint updates request status
- [ ] Request info endpoint works
- [ ] Calendar data endpoint returns team leaves
- [ ] Team capacity endpoint calculates correctly
- [ ] File upload endpoint handles attachments
- [ ] Leave history endpoint returns past leaves
- [ ] Error handling implemented for all endpoints
- [ ] Loading states display during API calls
- [ ] Optimistic updates work for mutations
- [ ] Cache invalidation triggers correctly
- [ ] Real-time updates work (if implemented)
- [ ] Retry logic handles network errors
- [ ] User-friendly error messages display
- [ ] TypeScript types match API contracts
- [ ] Authorization headers included

---

## Summary

This document completed leave management with comprehensive functionality including an advanced date picker with conflict detection, holiday checking, working day calculation, and notice period enforcement, a detailed reason input component with templates, medical certificate upload, emergency contacts, and handover notes, powerful approval actions for managers with batch processing, delegation support, and policy checking, an information-rich approval modal providing complete request context with team impact analysis, compliance checking, and historical patterns, an interactive team leave calendar with multiple views, capacity indicators, and planning tools, and complete API integration with optimistic updates, caching, real-time synchronization, and robust error handling.

All features comply with Sri Lankan labor laws including 14 days annual leave, 7 days casual leave, medical leave requirements, notice periods, public holiday handling, and proper timezone management (UTC+5:30). The system provides approval workflows with multi-level approvals for long leaves, team capacity management to prevent understaffing, and comprehensive audit trails for compliance.

### What's Next

Group E (Payroll Processing) will implement payroll calculation wizard with period and employee selection, complex payroll calculations with Sri Lankan statutory deductions (EPF 8% employee/12% employer, ETF 3% employer, PAYE progressive tax slabs), detailed payslip generation with earnings and deductions breakdown, PDF export functionality for official payslips, and payroll history tracking.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
