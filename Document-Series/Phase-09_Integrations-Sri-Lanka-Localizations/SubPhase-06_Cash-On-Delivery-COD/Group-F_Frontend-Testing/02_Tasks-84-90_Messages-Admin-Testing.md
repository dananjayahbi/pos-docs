# Tasks 84-90: Messages, Admin, and Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** F - Frontend & Testing  
> **Document:** 02 of 02  
> **Tasks Covered:** 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-77-83_Types-Hooks-OTP.md](01_Tasks-77-83_Types-Hooks-OTP.md)
- **→ Next Document:** None (Last Document) | **Next SubPhase:** [SubPhase-07_Shipping-Zone-Configuration](../../SubPhase-07_Shipping-Zone-Configuration/)

---

## Document Overview

This document covers the creation of OTP timer and resend functionality, user feedback messages for COD unavailability and limit scenarios, admin reconciliation interface, comprehensive integration tests, and COD documentation. These components complete the COD frontend implementation and ensure proper testing and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 84 | Create OTP Timer | Low | 20 min |
| 85 | Create OTP Resend | Low | 25 min |
| 86 | Create Not Available Message | Low | 20 min |
| 87 | Create Limit Message | Low | 20 min |
| 88 | Create Admin Reconciliation | Medium | 45 min |
| 89 | Create Integration Tests | Medium | 50 min |
| 90 | Create Documentation | Medium | 40 min |

---

## Task 84: Create OTP Timer

### Overview
Create an OTPTimer component that displays a countdown showing how long until the customer can resend the OTP. This component starts at 60 seconds, counts down to 0, and enables the resend button when the timer expires. It provides clear visual feedback about OTP validity period.

### Dependencies
- Task 83: Create OTP Input
- React hooks (useState, useEffect)

### Instructions

1. **Create component file**
   - Create `OTPTimer.tsx` in `components/checkout/` directory
   - Import React hooks (useState, useEffect)
   - Set up component structure

2. **Define component props**
   - Create `OTPTimerProps` interface
   - Include: initialSeconds (default 60), onExpire (callback when timer reaches 0)

3. **Implement countdown state**
   - Use useState for remaining seconds
   - Initialize with initialSeconds prop
   - Update every second via useEffect

4. **Create countdown interval**
   - Use useEffect with setInterval
   - Decrement seconds every 1000ms
   - Clear interval when component unmounts
   - Stop countdown at 0

5. **Handle timer expiration**
   - Call onExpire callback when reaching 0
   - Enable resend button (Task 85)
   - Show "Resend available" message

6. **Format time display**
   - Display as "XXs" for seconds under 60
   - Display as "Xm XXs" for over 60 seconds
   - Use readable format (e.g., "45s", "1m 30s")

7. **Implement reset function**
   - Export resetTimer method
   - Allow parent to restart timer
   - Reset to initialSeconds value

8. **Add visual styling**
   - Show timer in muted color
   - Change color when nearing expiration (< 10s)
   - Use icon for visual indicator

### Component Structure

```
OTPTimer
├── Props
│   ├── initialSeconds (number, default 60)
│   ├── onExpire (() => void)
│   └── autoStart (boolean, default true)
├── State
│   └── remainingSeconds (number)
├── Effects
│   └── Countdown interval
├── Methods
│   └── resetTimer()
└── Render
    └── Formatted time display
```

### Timer Display Formats

```
60 seconds: "Resend code in 60s"
45 seconds: "Resend code in 45s"
10 seconds: "Resend code in 10s" (warning color)
5 seconds: "Resend code in 5s" (warning color)
0 seconds: "Resend code now" (link color)
```

### Timer Component Layout

```
┌─────────────────────────────┐
│ Resend code in 45s          │ ← Active countdown
└─────────────────────────────┘

┌─────────────────────────────┐
│ Resend code in 8s           │ ← Warning (< 10s)
└─────────────────────────────┘

┌─────────────────────────────┐
│ Resend code now             │ ← Expired (clickable)
└─────────────────────────────┘
```

### Countdown Logic Flow

```
Component Mounts
       │
       ▼
Initialize remainingSeconds = 60
       │
       ▼
Start interval (1000ms)
       │
       ▼
Every second:
├── Decrement remainingSeconds
├── Update display
└── Check if reached 0
       │
   ┌───┴────┐
   ▼        ▼
  > 0      = 0
   │        │
   │        ▼
   │   Stop interval
   │        │
   │        ▼
   │   Call onExpire()
   │        │
   │        ▼
   │   Enable resend button
   │
   ▼
Continue countdown

Component Unmounts
       │
       ▼
Clear interval
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| initialSeconds | number | No | 60 | Starting countdown value |
| onExpire | () => void | Yes | - | Callback when timer reaches 0 |
| autoStart | boolean | No | true | Start countdown immediately |

### Timer State Transitions

| Seconds Remaining | Display Color | Icon | Action Available |
|-------------------|---------------|------|------------------|
| 60 - 11 | text-gray-600 | Clock | No resend |
| 10 - 1 | text-orange-600 | Clock | No resend |
| 0 | text-blue-600 | - | Resend enabled |

### Format Time Function

```
formatTime(seconds):
├── If seconds >= 60
│   ├── minutes = Math.floor(seconds / 60)
│   ├── remainingSeconds = seconds % 60
│   └── Return `${minutes}m ${remainingSeconds}s`
└── Else
    └── Return `${seconds}s`

Examples:
├── 75 seconds → "1m 15s"
├── 60 seconds → "1m 0s"
├── 45 seconds → "45s"
└── 5 seconds → "5s"
```

### Interval Management

```
useEffect(() => {
  Setup:
  ├── Create interval
  ├── Decrement seconds every 1000ms
  └── Store interval ID
  
  Cleanup:
  ├── Clear interval on unmount
  └── Clear interval on dependency change
  
  Dependencies:
  └── [remainingSeconds, onExpire]
}, [dependencies]);
```

### Integration with OTP Input

```
OTPInput Component
       │
       ├──► OTPTimer
       │       │
       │       │ (Timer expires)
       │       ▼
       │    onExpire() callback
       │       │
       │       ▼
       │    Enable OTPResend button
       │
       └──► OTPResend (Task 85)
              │
              │ (User clicks resend)
              ▼
           Reset timer to 60s
```

### Reset Timer Functionality

```
resetTimer() method:
├── Set remainingSeconds = initialSeconds
├── Restart interval
└── Used by OTPResend component

Usage:
const timerRef = useRef<{ resetTimer: () => void }>(null);

<OTPTimer ref={timerRef} onExpire={handleExpire} />

// When OTP resent:
timerRef.current?.resetTimer();
```

### Expected Outcome
- Countdown timer for OTP resend eligibility
- Clear visual feedback of remaining time
- Automatic callback when expired
- Reset functionality for resend flow

### Verification Checklist
- [ ] `frontend/components/checkout/OTPTimer.tsx` created
- [ ] Countdown starts at 60 seconds
- [ ] Timer decrements every second
- [ ] onExpire callback triggered at 0
- [ ] Time formatted correctly (XXs or Xm XXs)
- [ ] Warning color shown under 10 seconds
- [ ] Interval cleared on unmount
- [ ] resetTimer method working
- [ ] Component exports properly

---

## Task 85: Create OTP Resend

### Overview
Create an OTPResend component that allows customers to request a new OTP if they didn't receive the previous one or if it expired. This component manages resend attempts, enforces a maximum of 3 resends, integrates with the timer, and provides clear feedback about resend status.

### Dependencies
- Task 84: Create OTP Timer
- Task 83: Create OTP Input
- Task 80: Create Payment Hook

### Instructions

1. **Create component file**
   - Create `OTPResend.tsx` in `components/checkout/` directory
   - Import React hooks
   - Import Button from Shadcn/UI

2. **Define component props**
   - Create `OTPResendProps` interface
   - Include: onResend (callback), maxAttempts (default 3), isLoading, disabled

3. **Implement resend state**
   - Use useState for attempts count
   - Track remaining attempts
   - Store last resend timestamp

4. **Create resend button**
   - Display "Resend Code" text
   - Disable when timer active
   - Disable when max attempts reached
   - Show loading spinner during resend

5. **Handle resend click**
   - Increment attempts count
   - Call onResend callback
   - Reset OTP timer (Task 84)
   - Show success toast/message

6. **Implement rate limiting**
   - Prevent multiple rapid clicks
   - Show cooldown message if needed
   - Track last resend time

7. **Display attempts information**
   - Show remaining attempts
   - Warn when nearing limit
   - Show limit reached message

8. **Add success feedback**
   - Show "Code sent" message
   - Display success animation
   - Update timer display

### Component Structure

```
OTPResend
├── Props
│   ├── onResend (() => Promise<void>)
│   ├── maxAttempts (number, default 3)
│   ├── isLoading (boolean)
│   ├── disabled (boolean)
│   └── timerExpired (boolean)
├── State
│   ├── attemptsUsed (number)
│   └── lastResendTime (Date | null)
├── Computed
│   ├── remainingAttempts
│   └── canResend
└── Handlers
    └── handleResend()
```

### Resend Button States

```
Waiting for Timer (disabled):
┌─────────────────────────────┐
│  Resend Code (in 45s)       │ ← Grayed out
└─────────────────────────────┘

Ready to Resend (enabled):
┌─────────────────────────────┐
│  Resend Code                │ ← Blue, clickable
└─────────────────────────────┘

Sending (loading):
┌─────────────────────────────┐
│  [Spinner] Sending...       │ ← Disabled with spinner
└─────────────────────────────┘

Limit Reached (disabled):
┌─────────────────────────────┐
│  Maximum attempts reached   │ ← Grayed out, not clickable
└─────────────────────────────┘
```

### Resend Flow Diagram

```
User clicks "Resend Code"
       │
       ▼
Check if canResend
       │
   ┌───┴────┐
   ▼        ▼
  Yes       No
   │        │
   │        └──► Show error (timer active or limit reached)
   │
   ▼
Increment attemptsUsed
       │
       ▼
Set isLoading = true
       │
       ▼
Call onResend() callback
       │
       ▼
Parent calls API to resend OTP
       │
   ┌───┴────┐
   ▼        ▼
Success  Error
   │        │
   │        ▼
   │   Show error message
   │   isLoading = false
   │        │
   ▼        ▼
Show success message   Return
"Code sent"
   │
   ▼
Reset timer to 60s
   │
   ▼
isLoading = false
   │
   ▼
Disable button again (wait for timer)
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onResend | () => Promise<void> | Yes | - | Callback to resend OTP |
| maxAttempts | number | No | 3 | Maximum resend attempts allowed |
| isLoading | boolean | No | false | Resend in progress |
| disabled | boolean | No | false | External disable control |
| timerExpired | boolean | Yes | - | Timer countdown finished |

### Attempts Tracking

```
Initial State:
├── attemptsUsed = 0
├── remainingAttempts = 3
└── Status: Can resend after timer

After 1st Resend:
├── attemptsUsed = 1
├── remainingAttempts = 2
└── Status: Can resend after timer

After 2nd Resend:
├── attemptsUsed = 2
├── remainingAttempts = 1
└── Status: Last attempt available, show warning

After 3rd Resend:
├── attemptsUsed = 3
├── remainingAttempts = 0
└── Status: Limit reached, button permanently disabled
```

### Resend Eligibility Logic

```
canResend():
├── Check timerExpired === true
│   └── If false, return false
├── Check attemptsUsed < maxAttempts
│   └── If false, return false
├── Check isLoading === false
│   └── If false, return false
└── Return true

Button disabled when:
├── Timer not expired
├── Max attempts reached
├── Currently sending
└── External disabled prop
```

### Attempts Display

```
Attempt 1 of 3:
"You can resend the code 2 more times"

Attempt 2 of 3:
"You can resend the code 1 more time"

Attempt 3 of 3 (last):
"⚠️ This is your last resend attempt"

All attempts used:
"Maximum resend attempts reached. Please contact support."
```

### Integration with Timer and OTP

```
OTP Flow Components:
       │
       ├──► OTPInput (Task 83)
       │       │
       │       └──► Displays OTP entry boxes
       │
       ├──► OTPTimer (Task 84)
       │       │
       │       ├──► Counts down from 60s
       │       │
       │       └──► onExpire() → enables OTPResend
       │
       └──► OTPResend (This Task)
               │
               ├──► Disabled until timer expires
               │
               │ (User clicks resend)
               ▼
           handleResend()
               │
               ├──► Increment attempts
               ├──► Call onResend() callback
               │       │
               │       └──► Parent calls API sendOTP()
               │
               ├──► Show success message
               │
               └──► Reset timer
                       │
                       └──► Timer starts 60s countdown again
```

### Resend Click Handler

```
handleResend() async:
├── Check if canResend()
│   └── If false, show error and return
├── Prevent multiple clicks
├── Increment attemptsUsed
├── Set isLoading = true
├── Try:
│   ├── Call await onResend()
│   ├── Show success message: "Verification code sent"
│   ├── Reset timer to 60s
│   └── Log success
├── Catch error:
│   ├── Show error message
│   ├── Decrement attemptsUsed (rollback)
│   └── Log error
└── Finally:
    └── Set isLoading = false
```

### Success and Error Messages

| Scenario | Message Type | Message Text |
|----------|--------------|--------------|
| Resend Success | Success Toast | "Verification code sent to your phone" |
| Rate Limited | Error Toast | "Please wait before requesting another code" |
| Max Attempts | Warning | "Maximum resend attempts reached" |
| Network Error | Error Toast | "Failed to send code. Please try again" |

### Component Layout with Context

```
┌──────────────────────────────────────────┐
│  Enter verification code                 │
│  Sent to +94 77 XXX XX45                │
│                                          │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │  │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘  │
│                                          │
│  Resend code in 45s ← OTPTimer (T-84)   │
│                                          │
│  ┌──────────────┐                       │
│  │ Resend Code  │ ← OTPResend (T-85)    │
│  └──────────────┘   (disabled)          │
│                                          │
│  You can resend 2 more times            │
└──────────────────────────────────────────┘

After timer expires:
┌──────────────────────────────────────────┐
│  Resend code now                         │
│                                          │
│  ┌──────────────┐                       │
│  │ Resend Code  │ ← Now enabled          │
│  └──────────────┘                       │
│                                          │
│  You can resend 2 more times            │
└──────────────────────────────────────────┘
```

### Expected Outcome
- Functional resend button with attempt limits
- Integration with timer for cooldown
- Clear feedback on resend status
- Prevention of abuse via rate limiting

### Verification Checklist
- [ ] `frontend/components/checkout/OTPResend.tsx` created
- [ ] Button disabled until timer expires
- [ ] Attempts counter working (max 3)
- [ ] onResend callback triggered on click
- [ ] Loading state during resend
- [ ] Success message shown after resend
- [ ] Timer reset after successful resend
- [ ] Max attempts prevents further resends
- [ ] Remaining attempts displayed
- [ ] Component exports properly

---

## Task 86: Create Not Available Message

### Overview
Create a CODNotAvailable component that displays when COD is not available for a customer's delivery address or order. This component shows a clear, friendly message explaining why COD isn't available and suggests alternative payment methods.

### Dependencies
- Task 79: Create Eligibility Hook
- Shadcn/UI Alert component

### Instructions

1. **Create component file**
   - Create `CODNotAvailable.tsx` in `components/checkout/` directory
   - Import Alert components from Shadcn/UI
   - Import icons (AlertCircle, Info)

2. **Define component props**
   - Create `CODNotAvailableProps` interface
   - Include: reason (LimitReason enum), maxAmount (optional), alternativePayments

3. **Implement message variants**
   - Area not covered message
   - Service unavailable message
   - General unavailability message

4. **Create reason-specific content**
   - Different message for each reason
   - Explain why COD unavailable
   - Provide helpful context

5. **Add alternative payment suggestions**
   - Show available payment methods
   - Link to payment options
   - Encourage completion via other methods

6. **Implement visual design**
   - Use info/warning alert styling
   - Include icon for visual recognition
   - Maintain brand consistency

7. **Add support information**
   - Provide contact link if needed
   - Show FAQ link for COD availability
   - Offer help resources

### Component Structure

```
CODNotAvailable
├── Props
│   ├── reason (LimitReason)
│   ├── maxAmount (number | null)
│   ├── alternativePayments (string[])
│   └── showAlternatives (boolean)
├── Message Content
│   ├── Title
│   ├── Description
│   └── Reason Details
└── Render
    ├── Alert Container
    ├── Icon
    ├── Message
    └── Alternative Suggestions
```

### Message Variants by Reason

```
Reason: AREA_NOT_COVERED
┌────────────────────────────────────────────┐
│ [i] COD Not Available                      │
│                                            │
│ Cash on Delivery is not available for     │
│ your delivery area at this time.          │
│                                            │
│ Please use one of these payment methods:  │
│ • Credit/Debit Card                       │
│ • Bank Transfer                           │
│ • Digital Wallet                          │
└────────────────────────────────────────────┘

Reason: SERVICE_UNAVAILABLE
┌────────────────────────────────────────────┐
│ [!] COD Service Unavailable                │
│                                            │
│ Our Cash on Delivery service is           │
│ temporarily unavailable. Please try       │
│ another payment method.                   │
└────────────────────────────────────────────┘

Reason: GENERAL
┌────────────────────────────────────────────┐
│ [i] COD Not Available                      │
│                                            │
│ Cash on Delivery is not available for     │
│ this order. Please select another         │
│ payment method to continue.               │
└────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| reason | LimitReason | Yes | - | Why COD unavailable |
| maxAmount | number \| null | No | null | Area COD limit |
| alternativePayments | string[] | No | [...] | Available payment methods |
| showAlternatives | boolean | No | true | Show alternative suggestions |
| onLearnMore | () => void | No | - | Callback for "Learn more" link |

### Reason Types and Messages

| Reason | Title | Message | Icon |
|--------|-------|---------|------|
| AREA_NOT_COVERED | COD Not Available | COD is not available for your delivery area | Info |
| SERVICE_UNAVAILABLE | Service Unavailable | COD service temporarily unavailable | Alert |
| POSTAL_CODE_INVALID | Invalid Location | Unable to verify COD for this location | Alert |
| GENERAL | COD Not Available | COD not available for this order | Info |

### Message Content Structure

```
Alert Component:
├── Icon Section
│   └── AlertCircle or Info icon
├── Title Section
│   └── "COD Not Available" (bold)
├── Message Section
│   └── Reason-specific explanation
└── Action Section
    ├── Alternative payment list
    └── "Learn more" link (optional)
```

### Alternative Payments Display

```
When showAlternatives = true:

"Please use one of these payment methods:"

• Credit/Debit Card
• Bank Transfer  
• Digital Wallet (iPay, FriMi)

[Learn more about payment options →]
```

### Integration with Eligibility Hook

```
Checkout Component:
       │
       ▼
useCODEligibility({ address, amount })
       │
       ▼
{ eligible: false, reason: "AREA_NOT_COVERED" }
       │
       ▼
Render CODNotAvailable component
       │
       ▼
<CODNotAvailable 
  reason="AREA_NOT_COVERED"
  alternativePayments={["card", "bank", "wallet"]}
/>
       │
       ▼
Show message to customer
```

### Usage in Payment Selection

```
Payment Method Selector:
       │
       ├──► Card Payment (enabled)
       │
       ├──► Bank Transfer (enabled)
       │
       ├──► Cash on Delivery
       │       │
       │       └──► Check eligibility
       │               │
       │           ┌───┴────┐
       │           ▼        ▼
       │       Eligible  Not Eligible
       │           │        │
       │           │        ▼
       │           │   Show CODNotAvailable
       │           │   (This Component)
       │           │
       │           ▼
       │       Show CODButton
       │
       └──► Digital Wallet (enabled)
```

### Component Layout Examples

```
Minimal (no alternatives):
┌─────────────────────────────────────┐
│ [i] COD Not Available               │
│ COD is not available for your area. │
└─────────────────────────────────────┘

With alternatives:
┌──────────────────────────────────────────┐
│ [i] COD Not Available                    │
│ COD is not available for your area.      │
│                                          │
│ Alternative payment methods:             │
│ • Credit/Debit Card                     │
│ • Bank Transfer                         │
│                                          │
│ [Learn more →]                          │
└──────────────────────────────────────────┘

With learn more action:
┌──────────────────────────────────────────┐
│ [!] Service Temporarily Unavailable      │
│ Our COD service is being updated.        │
│                                          │
│ Expected availability: Tomorrow          │
│                                          │
│ [View other payment options →]          │
└──────────────────────────────────────────┘
```

### Alert Styling

| Variant | Background | Border | Icon Color | Use Case |
|---------|------------|--------|------------|----------|
| Info | bg-blue-50 | border-blue-200 | text-blue-600 | Area not covered |
| Warning | bg-yellow-50 | border-yellow-200 | text-yellow-600 | Service issue |
| Default | bg-gray-50 | border-gray-200 | text-gray-600 | General |

### Expected Outcome
- Clear message explaining COD unavailability
- Reason-specific content
- Alternative payment suggestions
- Helpful and user-friendly tone

### Verification Checklist
- [ ] `frontend/components/checkout/CODNotAvailable.tsx` created
- [ ] Component accepts reason prop
- [ ] Different messages for different reasons
- [ ] Alternative payments displayed
- [ ] Alert styling applied
- [ ] Icon shown correctly
- [ ] Learn more link functional (if provided)
- [ ] Component exports properly

---

## Task 87: Create Limit Message

### Overview
Create a CODLimitMessage component that informs customers when their order amount exceeds the COD limit for their area. This component shows the maximum allowed amount, explains the limitation, and suggests ways to proceed (reduce order or use alternative payment).

### Dependencies
- Task 79: Create Eligibility Hook
- Shadcn/UI Alert component

### Instructions

1. **Create component file**
   - Create `CODLimitMessage.tsx` in `components/checkout/` directory
   - Import Alert components from Shadcn/UI
   - Import icons and formatting utilities

2. **Define component props**
   - Create `CODLimitMessageProps` interface
   - Include: orderAmount, maxAmount, difference, currency

3. **Calculate amount difference**
   - Compute excess amount (orderAmount - maxAmount)
   - Show how much over the limit
   - Suggest reduction amount

4. **Implement message content**
   - Show current order amount
   - Show COD limit for area
   - Calculate and display difference
   - Explain limitation clearly

5. **Add action suggestions**
   - Suggest reducing order to meet limit
   - Suggest alternative payment methods
   - Show "Continue with other payment" button

6. **Implement visual design**
   - Use warning alert styling
   - Include informative icon
   - Highlight amounts for clarity

7. **Add currency formatting**
   - Format all amounts in LKR (₨)
   - Use proper thousand separators
   - Ensure consistent display

### Component Structure

```
CODLimitMessage
├── Props
│   ├── orderAmount (number)
│   ├── maxAmount (number)
│   ├── currency (string, default "LKR")
│   └── onViewAlternatives (() => void)
├── Calculations
│   └── difference (orderAmount - maxAmount)
├── Formatting
│   └── formatCurrency()
└── Render
    ├── Alert Container
    ├── Title & Icon
    ├── Amount Breakdown
    └── Action Suggestions
```

### Message Layout

```
┌──────────────────────────────────────────────┐
│ [!] Order Exceeds COD Limit                  │
│                                              │
│ Your order total:    ₨75,000                │
│ COD limit:           ₨50,000                │
│ Over limit by:       ₨25,000                │
│                                              │
│ To use COD:                                  │
│ • Reduce order by at least ₨25,000          │
│   OR                                         │
│ • Use an alternative payment method         │
│                                              │
│ [View Payment Options]                       │
└──────────────────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orderAmount | number | Yes | - | Current order total |
| maxAmount | number | Yes | - | COD limit for area |
| currency | string | No | "LKR" | Currency code |
| onViewAlternatives | () => void | No | - | Show alternative payments |
| showReductionSuggestion | boolean | No | true | Show reduce order suggestion |

### Amount Breakdown Display

```
Amount Information Table:

┌────────────────────────────────────┐
│ Order Amount       ₨75,000        │
│ COD Limit          ₨50,000        │
│ ─────────────────────────────────  │
│ Exceeds Limit By   ₨25,000        │
└────────────────────────────────────┘

Alternative minimal display:

"Your order of ₨75,000 exceeds the 
COD limit of ₨50,000 by ₨25,000"
```

### Calculation Logic

```
calculateExcess():
├── Input: orderAmount = 75000, maxAmount = 50000
├── difference = orderAmount - maxAmount
├── difference = 25000
└── Return formatted: "₨25,000"

formatCurrency(amount):
├── Convert to LKR format
├── Add thousand separators
├── Prepend ₨ symbol
└── Return formatted string

Example:
├── 75000 → "₨75,000"
├── 50000 → "₨50,000"
└── 100000 → "₨1,00,000" (Sri Lankan format)
```

### Action Suggestions

```
Two Options Presented:

Option 1: Reduce Order
┌────────────────────────────────────┐
│ 1. Reduce Your Order               │
│                                    │
│ Remove ₨25,000 worth of items     │
│ to meet the COD limit of ₨50,000  │
│                                    │
│ [Review Cart]                     │
└────────────────────────────────────┘

Option 2: Alternative Payment
┌────────────────────────────────────┐
│ 2. Use Another Payment Method      │
│                                    │
│ • Credit/Debit Card               │
│ • Bank Transfer                   │
│ • Digital Wallet                  │
│                                    │
│ [View Options]                    │
└────────────────────────────────────┘
```

### Integration with Checkout Flow

```
User at Checkout
       │
       ▼
Selects COD payment
       │
       ▼
useCODEligibility({ address, amount: 75000 })
       │
       ▼
Backend checks: maxAmount = 50000
       │
       ▼
Response: { eligible: false, reason: "AMOUNT_EXCEEDED", max_amount: 50000 }
       │
       ▼
Render CODLimitMessage
       │
       ▼
<CODLimitMessage 
  orderAmount={75000}
  maxAmount={50000}
  onViewAlternatives={showPaymentOptions}
/>
       │
       ▼
Customer sees message and options
       │
   ┌───┴────┐
   ▼        ▼
Reduce   Choose
Cart     Alternative
   │        │
   ▼        ▼
Meet COD  Complete with
Limit     other payment
```

### Message Variants

```
Standard Excess (> ₨10,000 over):
"Order significantly exceeds COD limit"
- Show both reduction and alternative options

Small Excess (< ₨5,000 over):
"Order slightly exceeds COD limit"
- Emphasize reduction option
- "Remove just ₨3,000 worth of items"

Large Excess (> ₨50,000 over):
"Order greatly exceeds COD limit"
- Emphasize alternative payment
- Reduction may not be practical
```

### Component States

| Scenario | Order | Limit | Message Focus |
|----------|-------|-------|---------------|
| Small Excess | ₨52,000 | ₨50,000 | Encourage reduction |
| Medium Excess | ₨70,000 | ₨50,000 | Both options equal |
| Large Excess | ₨150,000 | ₨50,000 | Encourage alternative |

### Expected Outcome
- Clear explanation of COD limit issue
- Precise amount calculations displayed
- Actionable suggestions for customer
- User-friendly formatting and messaging

### Verification Checklist
- [ ] `frontend/components/checkout/CODLimitMessage.tsx` created
- [ ] Component calculates excess amount correctly
- [ ] All amounts formatted in LKR (₨)
- [ ] Order amount, limit, and difference displayed
- [ ] Reduction suggestion shown
- [ ] Alternative payment suggestion shown
- [ ] onViewAlternatives callback working
- [ ] Alert styling applied
- [ ] Component exports properly

---

## Task 88: Create Admin Reconciliation

### Overview
Create an admin interface for COD reconciliation that allows staff to view all COD orders, mark them as collected, reconcile payments with courier services, filter by date range and courier, export reconciliation reports, and manage COD payment records efficiently.

### Dependencies
- Task 76: Test All COD Endpoints (Backend reconciliation API available)
- Admin layout and navigation configured
- Data table components available

### Instructions

1. **Create reconciliation page**
   - Navigate to `frontend/app/(admin)/payments/cod/` directory
   - Create `reconciliation/page.tsx` file
   - Set up admin page layout

2. **Import required components**
   - Import data table components
   - Import filter components (date picker, select)
   - Import export button
   - Import status badge components

3. **Define page structure**
   - Header with title and export button
   - Filter section (date range, courier, status)
   - Data table with COD records
   - Pagination controls
   - Summary statistics

4. **Implement filters**
   - Date range filter (from/to dates)
   - Courier filter (dropdown with courier list)
   - Status filter (pending, collected, reconciled, failed)
   - Search by order ID or customer name

5. **Create data table columns**
   - Order ID (linkable)
   - Customer Name and Phone
   - Order Amount and COD Fee
   - Courier Name
   - Collection Status
   - Collection Date
   - Actions (Mark Collected, View Details)

6. **Implement actions**
   - Mark as Collected button
   - View order details link
   - Update courier information
   - Add collection notes

7. **Add summary statistics**
   - Total COD orders
   - Total amount pending collection
   - Total amount collected
   - Collection rate percentage

8. **Implement export functionality**
   - Export to CSV
   - Export to Excel
   - Include filtered data only
   - Format dates and amounts properly

9. **Add real-time updates**
   - Refresh button
   - Auto-refresh option (every 30s)
   - Show last update timestamp

10. **Create reconciliation workflow**
    - Bulk mark as collected
    - Reconcile with courier report
    - Handle discrepancies

### Page Structure

```
COD Reconciliation Page
├── Header
│   ├── Title: "COD Reconciliation"
│   └── Export Button
├── Summary Cards
│   ├── Total Orders
│   ├── Pending Collection
│   ├── Collected Amount
│   └── Collection Rate
├── Filters Section
│   ├── Date Range Picker
│   ├── Courier Dropdown
│   ├── Status Filter
│   └── Search Input
├── Data Table
│   ├── Columns (defined below)
│   └── Row Actions
├── Pagination
│   └── Page controls
└── Bulk Actions
    └── Select multiple, mark collected
```

### Data Table Columns

| Column | Width | Description | Sortable |
|--------|-------|-------------|----------|
| Order ID | 100px | Order reference, clickable | Yes |
| Customer | 150px | Name and phone | No |
| Amount | 100px | Order total + COD fee | Yes |
| Courier | 120px | Courier service name | Yes |
| Status | 100px | Collection status badge | Yes |
| Collection Date | 120px | Date collected | Yes |
| Actions | 80px | Action buttons | No |

### Table Layout Example

```
┌────────────────────────────────────────────────────────────────────────────┐
│ COD Reconciliation                              [Export CSV] [Export Excel] │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Total   │  │ Pending  │  │Collected │  │   Rate   │                 │
│  │   156    │  │  ₨2.1M   │  │ ₨8.9M    │  │   82%    │                 │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                 │
│                                                                            │
│  Filters: [Date Range ▼] [Courier ▼] [Status ▼] [Search...]              │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Order ID │ Customer      │ Amount  │ Courier │ Status    │ Date       │ ··│
├────────────────────────────────────────────────────────────────────────────┤
│ #12345   │ John Doe      │ ₨5,200  │ DHL     │ Collected │ 2026-01-25 │ ··│
│          │ +94771234567  │         │         │           │            │   │
├────────────────────────────────────────────────────────────────────────────┤
│ #12346   │ Jane Smith    │ ₨3,850  │ Aramex  │ Pending   │ -          │ ··│
│          │ +94712345678  │         │         │           │            │   │
├────────────────────────────────────────────────────────────────────────────┤
│                                             [◄] Page 1 of 8 [►]           │
└────────────────────────────────────────────────────────────────────────────┘
```

### Status Badges

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| PENDING | yellow | Clock | Awaiting courier pickup |
| OUT_FOR_DELIVERY | blue | Truck | Courier has order |
| COLLECTED | green | Check | Payment collected from customer |
| RECONCILED | gray | FileCheck | Reconciled with courier |
| FAILED | red | X | Collection failed |

### Filters Implementation

```
Date Range Filter:
├── From Date: Date picker
├── To Date: Date picker
├── Quick options:
│   ├── Today
│   ├── Last 7 days
│   ├── Last 30 days
│   └── Custom range

Courier Filter:
├── All Couriers (default)
├── DHL Express
├── Aramex
├── Pronto
└── Other

Status Filter:
├── All Statuses (default)
├── Pending
├── Collected
├── Reconciled
└── Failed
```

### Action Buttons

```
Per Row Actions:
├── [✓] Mark Collected
├── [👁] View Details
└── [✎] Add Note

Bulk Actions (when rows selected):
├── [✓] Mark All Collected
├── [📄] Export Selected
└── [✉] Send to Courier
```

### Mark Collected Flow

```
Admin clicks "Mark Collected"
       │
       ▼
Show confirmation modal
├── Order ID: #12345
├── Customer: John Doe
├── Amount: ₨5,200
└── Confirm collection?
       │
       │ (Admin confirms)
       ▼
Call API: PATCH /api/payments/cod/collection/
       │
       ▼
Request body:
├── order_id: "12345"
├── status: "COLLECTED"
├── collection_date: "2026-01-31"
└── notes: "Collected by admin"
       │
   ┌───┴────┐
   ▼        ▼
Success  Error
   │        │
   │        ▼
   │   Show error message
   │   Keep status unchanged
   │
   ▼
Update table row
├── Status: COLLECTED (green badge)
├── Date: 2026-01-31
└── Show success toast
       │
       ▼
Update summary statistics
```

### Export Functionality

```
Export Button Click:
       │
       ▼
Show export options modal
├── Format: [CSV] [Excel]
├── Range: [Filtered Data] [All Data]
└── Fields: [Select columns]
       │
       │ (Admin confirms)
       ▼
Generate export file
       │
       ▼
Include columns:
├── Order ID
├── Customer Name
├── Phone
├── Order Amount
├── COD Fee
├── Courier
├── Status
├── Collection Date
└── Notes
       │
       ▼
Download file:
"COD_Reconciliation_2026-01-31.csv"
```

### API Integration

```
Endpoints Used:

GET /api/payments/cod/collection/
├── Query params:
│   ├── date_from
│   ├── date_to
│   ├── courier
│   ├── status
│   └── search
└── Returns: List of COD records

PATCH /api/payments/cod/collection/{id}/
├── Body:
│   ├── status
│   ├── collection_date
│   └── notes
└── Returns: Updated record

GET /api/payments/cod/reconciliation/stats/
├── Query params: date_from, date_to
└── Returns: Summary statistics

POST /api/payments/cod/reconciliation/export/
├── Body: filters, format
└── Returns: Export file
```

### Expected Outcome
- Comprehensive admin interface for COD management
- Efficient filtering and searching
- Easy reconciliation workflow
- Export capabilities for reporting

### Verification Checklist
- [ ] Reconciliation page created in admin section
- [ ] Data table displays COD records
- [ ] Date range filter working
- [ ] Courier filter working
- [ ] Status filter working
- [ ] Search functionality working
- [ ] Mark as Collected action working
- [ ] Summary statistics displayed
- [ ] Export to CSV working
- [ ] Export to Excel working
- [ ] Pagination implemented
- [ ] Bulk actions functional
- [ ] Real-time updates working
- [ ] Page styled consistently with admin theme

---

## Task 89: Create Integration Tests

### Overview
Create comprehensive integration tests for the COD payment flow covering eligibility checking, payment initiation, OTP sending and verification, order placement, and collection reconciliation. These tests ensure all components work together correctly and validate the entire user journey.

### Dependencies
- Task 90 prerequisites: All COD components created
- Jest testing framework configured
- React Testing Library setup
- MSW (Mock Service Worker) for API mocking

### Instructions

1. **Create test file**
   - Navigate to `frontend/__tests__/payments/` directory
   - Create `cod.integration.test.ts` file
   - Set up test environment and imports

2. **Configure test setup**
   - Import testing utilities
   - Import COD components and hooks
   - Set up MSW handlers for API mocking
   - Create test fixtures and mock data

3. **Create eligibility check tests**
   - Test eligible address scenario
   - Test ineligible area scenario
   - Test amount exceeded scenario
   - Test API error handling

4. **Create payment initiation tests**
   - Test successful payment initiation
   - Test OTP sending after initiation
   - Test invalid order ID
   - Test network errors

5. **Create OTP flow tests**
   - Test OTP input and verification
   - Test invalid OTP handling
   - Test OTP expiration
   - Test resend functionality

6. **Create complete flow tests**
   - Test full COD order placement
   - Test from eligibility to order confirmation
   - Test error recovery scenarios

7. **Create component integration tests**
   - Test CODButton with eligibility hook
   - Test OTPInput with payment hook
   - Test CODNotAvailable with eligibility
   - Test CODLimitMessage display

8. **Create admin reconciliation tests**
   - Test marking orders as collected
   - Test filtering and searching
   - Test export functionality

9. **Add performance tests**
   - Test API response times
   - Test UI rendering performance
   - Test large dataset handling

10. **Create accessibility tests**
    - Test keyboard navigation
    - Test screen reader announcements
    - Test ARIA labels

### Test File Structure

```
cod.integration.test.ts
├── Setup
│   ├── Imports
│   ├── MSW Handlers
│   ├── Test Fixtures
│   └── Helper Functions
├── Eligibility Tests
│   ├── Eligible area
│   ├── Ineligible area
│   ├── Amount exceeded
│   └── Error handling
├── Payment Flow Tests
│   ├── Initiate payment
│   ├── Send OTP
│   ├── Verify OTP
│   └── Complete order
├── Component Tests
│   ├── CODButton integration
│   ├── OTPInput integration
│   ├── CODNotAvailable display
│   └── CODLimitMessage display
├── Admin Tests
│   ├── Reconciliation UI
│   ├── Mark collected
│   └── Export data
└── E2E Scenario Tests
    └── Full customer journey
```

### Eligibility Check Tests

```typescript
Test: "Eligible address returns success"
├── Mock API response: eligible = true, max_amount = 50000
├── Render component with useCODEligibility hook
├── Assert eligible = true
├── Assert maxAmount = 50000
└── Assert CODButton enabled

Test: "Ineligible area returns reason"
├── Mock API response: eligible = false, reason = "AREA_NOT_COVERED"
├── Render component with useCODEligibility hook
├── Assert eligible = false
├── Assert reason displayed
└── Assert CODNotAvailable component shown

Test: "Amount exceeded shows limit message"
├── Mock API response: eligible = false, reason = "AMOUNT_EXCEEDED"
├── Render component with amount = 75000
├── Assert CODLimitMessage shown
├── Assert excess amount calculated
└── Assert alternative payment suggested
```

### Payment Flow Tests

```typescript
Test: "Complete COD payment flow"
├── Step 1: Check eligibility
│   ├── Mock eligible response
│   └── Assert CODButton enabled
├── Step 2: Initiate payment
│   ├── User clicks CODButton
│   ├── Mock payment initiation success
│   └── Assert payment ID stored
├── Step 3: Send OTP
│   ├── Mock OTP send success
│   ├── Assert OTP sent message
│   └── Assert OTPInput shown
├── Step 4: Enter OTP
│   ├── User enters 6-digit code
│   ├── Mock OTP verification success
│   └── Assert payment verified
└── Step 5: Complete order
    ├── Assert onSuccess callback triggered
    └── Assert order confirmation shown

Test: "Invalid OTP shows error"
├── User enters wrong OTP
├── Mock API response: invalid OTP error
├── Assert error message shown
├── Assert OTP inputs cleared
└── Assert focus returns to first input

Test: "OTP resend flow"
├── Wait for timer to expire (mock timers)
├── User clicks resend button
├── Mock OTP resend success
├── Assert new OTP sent message
└── Assert timer reset to 60s
```

### MSW API Mocks

```typescript
Mock Handlers:

// Eligibility Check
rest.post('/api/payments/cod/eligibility/', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      eligible: true,
      max_amount: 50000,
      reason: null
    })
  );
});

// Initiate Payment
rest.post('/api/payments/cod/initiate/', (req, res, ctx) => {
  return res(
    ctx.status(201),
    ctx.json({
      payment_id: 'cod_test_12345',
      status: 'PENDING',
      otp_required: true
    })
  );
});

// Send OTP
rest.post('/api/payments/cod/otp/send/', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      success: true,
      message: 'OTP sent to phone'
    })
  );
});

// Verify OTP
rest.post('/api/payments/cod/otp/verify/', (req, res, ctx) => {
  const { otp_code } = req.body;
  if (otp_code === '123456') {
    return res(
      ctx.status(200),
      ctx.json({ success: true, verified: true })
    );
  } else {
    return res(
      ctx.status(400),
      ctx.json({ success: false, error: 'Invalid OTP' })
    );
  }
});
```

### Component Integration Test Example

```typescript
Test: "CODButton with eligibility hook"

it('enables button when eligible and disables when not', async () => {
  // Mock eligible response
  server.use(
    rest.post('/api/payments/cod/eligibility/', (req, res, ctx) => {
      return res(ctx.json({ eligible: true, max_amount: 50000 }));
    })
  );
  
  // Render component
  render(
    <CODButton 
      orderId="12345"
      amount={5000}
      shippingAddress={mockAddress}
      onPaymentSuccess={mockCallback}
    />
  );
  
  // Wait for eligibility check
  await waitFor(() => {
    expect(screen.getByText(/cash on delivery/i)).toBeEnabled();
  });
  
  // Click button
  fireEvent.click(screen.getByText(/cash on delivery/i));
  
  // Assert payment initiated
  await waitFor(() => {
    expect(screen.getByText(/enter verification code/i)).toBeInTheDocument();
  });
});
```

### E2E Scenario Test

```typescript
Test: "Full customer COD order flow"

describe('Complete COD order journey', () => {
  it('customer can place order with COD from start to finish', async () => {
    // 1. Customer at checkout
    render(<CheckoutPage cart={mockCart} />);
    
    // 2. Select COD payment method
    const codButton = screen.getByRole('button', { name: /cash on delivery/i });
    await waitFor(() => expect(codButton).toBeEnabled());
    
    // 3. Click COD button
    fireEvent.click(codButton);
    
    // 4. OTP input appears
    await waitFor(() => {
      expect(screen.getByText(/enter verification code/i)).toBeInTheDocument();
    });
    
    // 5. Enter OTP digits
    const otpInputs = screen.getAllByRole('textbox');
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });
    
    // 6. Auto-submit on 6th digit
    await waitFor(() => {
      expect(mockPaymentSuccess).toHaveBeenCalled();
    });
    
    // 7. Order confirmation shown
    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/payment method: cash on delivery/i)).toBeInTheDocument();
  });
});
```

### Admin Tests

```typescript
Test: "Admin can mark COD order as collected"

it('updates order status when marked collected', async () => {
  // Render admin reconciliation page
  render(<CODReconciliationPage />);
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText(/#12345/)).toBeInTheDocument();
  });
  
  // Click "Mark Collected" button
  const markButton = screen.getByRole('button', { name: /mark collected/i });
  fireEvent.click(markButton);
  
  // Confirm in modal
  const confirmButton = await screen.findByRole('button', { name: /confirm/i });
  fireEvent.click(confirmButton);
  
  // Assert status updated
  await waitFor(() => {
    expect(screen.getByText(/collected/i)).toBeInTheDocument();
    expect(screen.getByText(/collected/i)).toHaveClass('badge-success');
  });
});
```

### Test Coverage Goals

| Area | Target Coverage |
|------|----------------|
| COD Types | 100% |
| API Client | 95% |
| Hooks | 90% |
| Components | 85% |
| Integration Flows | 80% |
| Overall | 85%+ |

### Expected Outcome
- Comprehensive test suite for COD functionality
- High test coverage (85%+)
- All user flows validated
- API integration tested with mocks

### Verification Checklist
- [ ] Test file created in __tests__/payments/
- [ ] MSW handlers configured for all COD endpoints
- [ ] Eligibility check tests passing
- [ ] Payment initiation tests passing
- [ ] OTP flow tests passing
- [ ] Complete flow E2E test passing
- [ ] Component integration tests passing
- [ ] Admin reconciliation tests passing
- [ ] Test coverage ≥ 85%
- [ ] All tests pass in CI/CD pipeline

---

## Task 90: Create Documentation

### Overview
Create comprehensive user and developer documentation for the COD payment system covering setup instructions, customer flow, admin reconciliation procedures, API reference, risk management, troubleshooting, and integration guidelines. This documentation ensures proper understanding and usage of the COD feature.

### Dependencies
- Task 89: Create Integration Tests (Validation complete)
- All COD components implemented and tested

### Instructions

1. **Create documentation directory**
   - Navigate to `docs/` directory in project root
   - Create `payments/cod/` subdirectory
   - Organize by audience (user, admin, developer)

2. **Create setup guide**
   - Document COD configuration
   - Environment variables needed
   - Backend settings required
   - Frontend configuration

3. **Create customer flow documentation**
   - Step-by-step customer journey
   - Screenshots of each step
   - OTP verification process
   - Error scenarios and messages

4. **Create admin documentation**
   - Reconciliation procedures
   - How to mark orders collected
   - Export and reporting
   - Handling disputes

5. **Create API reference**
   - Document all COD endpoints
   - Request/response formats
   - Authentication requirements
   - Error codes and meanings

6. **Create developer integration guide**
   - How to integrate COD in checkout
   - Using COD hooks and components
   - Customization options
   - Testing guidelines

7. **Create risk management guide**
   - Fraud prevention measures
   - Limit configuration
   - Area restriction setup
   - Monitoring and alerts

8. **Create troubleshooting guide**
   - Common issues and solutions
   - Error message explanations
   - Debug procedures
   - FAQ section

### Documentation Structure

```
docs/payments/cod/
├── README.md (Overview)
├── setup/
│   ├── backend-configuration.md
│   ├── frontend-configuration.md
│   └── environment-variables.md
├── user-guides/
│   ├── customer-flow.md
│   ├── otp-verification.md
│   └── troubleshooting-customer.md
├── admin-guides/
│   ├── reconciliation.md
│   ├── reporting.md
│   └── dispute-handling.md
├── developer/
│   ├── api-reference.md
│   ├── integration-guide.md
│   ├── component-reference.md
│   └── testing.md
├── operations/
│   ├── risk-management.md
│   ├── monitoring.md
│   └── fraud-prevention.md
└── troubleshooting/
    ├── common-issues.md
    ├── error-codes.md
    └── faq.md
```

### Setup Documentation Content

```markdown
# COD Backend Configuration

## Prerequisites
- Django backend running
- PostgreSQL database configured
- Celery for async tasks
- Redis for caching

## Installation

1. Add COD app to INSTALLED_APPS
2. Run migrations
3. Configure settings
4. Set up courier integrations
5. Configure OTP service

## Settings

### COD Configuration
- COD_ENABLED: Enable/disable COD
- COD_DEFAULT_FEE: Default flat fee (₨100)
- COD_MAX_LIMIT: Global max limit (₨50,000)
- COD_OTP_EXPIRY: OTP validity (10 minutes)
- COD_MAX_RESENDS: Max OTP resends (3)

### Area Configuration
- Configure postal code limits
- Set courier availability by area
- Define high-risk areas

## Courier Integration
- DHL Express setup
- Aramex setup
- Pronto setup
```

### Customer Flow Documentation

```markdown
# Customer COD Flow

## Overview
Cash on Delivery allows customers to pay when they receive their order.

## Step-by-Step Process

### 1. Add Items to Cart
- Browse products
- Add items to cart
- Proceed to checkout

### 2. Enter Shipping Address
- Provide complete delivery address
- Include correct postal code
- Add phone number for OTP

### 3. Select Payment Method
- Choose "Cash on Delivery"
- System checks eligibility
- Shows COD fee if applicable

### 4. Verify Phone with OTP
- OTP sent to registered phone
- Enter 6-digit code
- Verify within 10 minutes

### 5. Confirm Order
- Review order summary
- Confirm COD payment
- Receive order confirmation

## What to Expect

### Delivery
- Courier will contact you
- Prepare exact amount + COD fee
- Inspect order before paying

### Payment
- Cash payment to courier
- Receive receipt
- Order marked as completed

## If You Have Issues
- OTP not received → Check phone number, request resend
- Area not covered → Try alternative payment
- Limit exceeded → Reduce order or use card
```

### API Reference Documentation

```markdown
# COD API Reference

## Base URL
`/api/payments/cod/`

## Authentication
All endpoints require authentication via Bearer token.

## Endpoints

### Check Eligibility
POST /api/payments/cod/eligibility/

**Request:**
{
  "address": "string",
  "postal_code": "string",
  "amount": number
}

**Response:**
{
  "eligible": boolean,
  "reason": string | null,
  "max_amount": number | null,
  "fee_type": "FLAT" | "PERCENTAGE",
  "fee_amount": number
}

**Error Codes:**
- 400: Invalid request data
- 401: Unauthorized
- 500: Server error

### Initiate Payment
POST /api/payments/cod/initiate/

**Request:**
{
  "order_id": "string",
  "amount": number,
  "customer_phone": "string",
  "shipping_address": object
}

**Response:**
{
  "payment_id": "string",
  "status": "PENDING",
  "otp_required": true
}

### Send OTP
POST /api/payments/cod/otp/send/

**Request:**
{
  "phone": "string",
  "order_id": "string"
}

**Response:**
{
  "success": true,
  "message": "OTP sent",
  "expires_at": "datetime"
}

### Verify OTP
POST /api/payments/cod/otp/verify/

**Request:**
{
  "otp_code": "string",
  "phone": "string",
  "order_id": "string"
}

**Response:**
{
  "success": true,
  "verified": true,
  "payment_id": "string"
}
```

### Developer Integration Guide

```markdown
# COD Developer Integration

## Installation

1. Install dependencies
2. Import COD components
3. Add to checkout flow

## Basic Usage

### Check Eligibility

import { useCODEligibility } from '@/lib/payments/cod/hooks';

const { eligible, reason, maxAmount } = useCODEligibility({
  address: shippingAddress,
  postalCode: postalCode,
  amount: orderTotal
});

if (eligible) {
  // Show COD button
} else {
  // Show not available message with reason
}

### Handle Payment

import { useCODPayment } from '@/lib/payments/cod/hooks';

const { initiatePayment, verifyOTP, status } = useCODPayment({
  onSuccess: (paymentId) => {
    // Complete order
  },
  onError: (error) => {
    // Handle error
  }
});

// Initiate COD payment
await initiatePayment(orderId, amount, customerDetails);

// Verify OTP
await verifyOTP(otpCode);

## Components

### CODButton
Displays COD payment option with eligibility check.

### OTPInput
6-digit OTP input with auto-focus and paste support.

### CODNotAvailable
Message when COD unavailable for area.

### CODLimitMessage
Message when order exceeds COD limit.

## Testing

Run COD integration tests:
npm test -- cod.integration.test.ts

See test coverage:
npm run test:coverage
```

### Risk Management Documentation

```markdown
# COD Risk Management

## Overview
COD carries higher risk than prepaid payments. Implement these measures.

## Fraud Prevention

### Customer Verification
- Phone verification via OTP
- Address validation
- Order history check
- Velocity checks (max 3 COD orders per day)

### Amount Limits
- Set per-area limits
- Configure per-customer limits
- Monitor high-value orders
- Flag suspicious patterns

### Geographic Restrictions
- Limit to verified postal codes
- Exclude high-risk areas
- Partner with reliable couriers only

## Monitoring

### Key Metrics
- COD conversion rate
- Collection success rate
- Failed delivery rate
- Fraud incident rate

### Alerts
- Alert on limit breaches
- Alert on high failure rates
- Alert on unusual patterns

## Dispute Handling
- Customer claims non-receipt
- Courier claims non-payment
- Order quality disputes
- Resolution procedures
```

### Troubleshooting Documentation

```markdown
# COD Troubleshooting

## Common Issues

### Issue: OTP Not Received

**Symptoms:** Customer doesn't receive OTP SMS

**Causes:**
- Phone number incorrect
- SMS service delay
- Network issues

**Solutions:**
1. Verify phone number format (+94 XX XXX XXXX)
2. Wait 30 seconds and try resend
3. Check SMS service status
4. Use alternative phone if available

### Issue: COD Not Available for Area

**Symptoms:** Eligibility check returns not available

**Causes:**
- Postal code not in coverage list
- Area marked as high-risk
- Courier doesn't serve area

**Solutions:**
1. Verify postal code correct
2. Check COD area configuration
3. Suggest alternative payment
4. Contact support if needed

### Issue: Order Exceeds Limit

**Symptoms:** Amount exceeded message shown

**Causes:**
- Order total > area max limit
- Customer limit reached

**Solutions:**
1. Reduce order value
2. Remove items from cart
3. Use alternative payment
4. Split into multiple orders (if allowed)

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| COD_001 | Area not covered | Suggest alternative |
| COD_002 | Amount exceeded | Show limit message |
| COD_003 | Invalid OTP | Allow retry |
| COD_004 | OTP expired | Resend OTP |
| COD_005 | Max resends reached | Contact support |
| COD_006 | Daily limit reached | Try tomorrow |

## FAQ

**Q: How long is OTP valid?**
A: 10 minutes from sending

**Q: How many times can I resend OTP?**
A: Maximum 3 times per order

**Q: What is the COD fee?**
A: ₨100 flat fee (may vary by area)

**Q: What if courier doesn't collect payment?**
A: Contact support with order ID
```

### Expected Outcome
- Complete documentation for all audiences
- Clear setup and integration guides
- Comprehensive API reference
- Troubleshooting resources

### Verification Checklist
- [ ] Documentation directory created
- [ ] Setup guide written
- [ ] Customer flow documented with steps
- [ ] Admin reconciliation guide complete
- [ ] API reference comprehensive
- [ ] Developer integration guide clear
- [ ] Risk management guide detailed
- [ ] Troubleshooting guide covers common issues
- [ ] Error codes documented
- [ ] FAQ section added
- [ ] All diagrams and screenshots included
- [ ] Documentation reviewed and proofread

---

## Summary

This document completed the COD frontend implementation with OTP timer and resend components, user-friendly messages for unavailability and limits, comprehensive admin reconciliation interface, thorough integration tests, and complete documentation. The COD feature is now fully functional, tested, and documented.

### Completed Tasks
1. ✓ Created OTP timer with countdown and expiration handling
2. ✓ Created OTP resend component with attempt limits
3. ✓ Created not available message for ineligible areas
4. ✓ Created limit exceeded message with suggestions
5. ✓ Created admin reconciliation interface with filters and export
6. ✓ Created comprehensive integration tests with high coverage
7. ✓ Created complete documentation for all stakeholders

### COD Feature Complete
The Cash on Delivery payment system is now fully implemented across backend and frontend, with:
- Eligibility checking based on area and amount
- Phone verification via OTP
- Payment flow management
- Admin reconciliation tools
- Risk management measures
- Comprehensive testing
- Complete documentation

### Next Steps
Proceed to **SubPhase-07: Shipping Zone Configuration** to configure shipping zones, rates, and delivery options that integrate with the COD system.
