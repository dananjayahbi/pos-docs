# Tasks 45-52: API Integration, Error Handling, and Redirect Logic

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** C - Login Flow  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Form-Validation.md](01_Tasks-35-44_Form-Validation.md)

---

## Document Overview

This document covers the API integration, token handling, error management, and redirect logic for the login flow. It establishes the service layer for authentication, handles JWT token responses, implements comprehensive error handling including rate limiting, manages success redirects with checkout return support, adds registration links, and verifies the complete login flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Login API Service | Medium | 30 min |
| 46 | Create Handle Token Response | Medium | 25 min |
| 47 | Create Login Error Handling | Low | 20 min |
| 48 | Create Too Many Attempts | Low | 20 min |
| 49 | Create Login Success Redirect | Low | 20 min |
| 50 | Create Checkout Return | Low | 20 min |
| 51 | Create Register Link | Low | 15 min |
| 52 | Verify Login Flow | Low | 30 min |

---

## Task 45: Create Login API Service

### Overview
Create a service function that communicates with the backend authentication API to authenticate customer credentials. This service handles the HTTP request to the login endpoint, sends the customer's identifier (email or phone) and password, and returns the authentication response containing access and refresh tokens.

### Dependencies
- Task 44 (Login Submit Logic) must be complete
- Backend authentication endpoint is implemented
- API client configuration is set up
- TypeScript types for auth responses are defined

### Instructions

1. **Navigate to services directory**
   - Go to `frontend/services/storefront/auth/`
   - Create `loginService.ts` if it doesn't exist
   - This centralizes authentication API logic

2. **Define request and response types**
   - Create `LoginRequest` interface with identifier and password
   - Create `LoginResponse` interface with tokens and user data
   - Include optional rememberMe field in request
   - Define token structure (accessToken, refreshToken)

3. **Create login service function**
   - Name function `loginCustomer` or `authenticateCustomer`
   - Accept LoginRequest as parameter
   - Make POST request to `/api/storefront/auth/login`
   - Send credentials in request body

4. **Configure request headers**
   - Set Content-Type to `application/json`
   - Include any required API headers
   - Add tenant identification if needed
   - Ensure CSRF token is included if required

5. **Handle successful response**
   - Return complete response data
   - Include tokens, user info, and session data
   - Preserve response metadata
   - Return proper TypeScript types

6. **Structure error responses**
   - Let errors bubble up for handling in components
   - Preserve error details from backend
   - Maintain error status codes
   - Include error messages and codes

7. **Add request timeout**
   - Set reasonable timeout (e.g., 10 seconds)
   - Handle timeout errors separately
   - Provide timeout-specific error messages
   - Allow retry mechanism

8. **Implement request validation**
   - Validate request data before sending
   - Check for required fields
   - Ensure proper data types
   - Sanitize input if necessary

### Request Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| identifier | string | Yes | Email or phone number |
| password | string | Yes | User password |
| rememberMe | boolean | No | Extend session duration |

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| accessToken | string | Short-lived JWT token |
| refreshToken | string | Long-lived refresh token |
| user | object | Customer profile data |
| expiresIn | number | Token expiration time |

### API Endpoint Details

| Attribute | Value |
|-----------|-------|
| Method | POST |
| Path | `/api/storefront/auth/login` |
| Content-Type | `application/json` |
| Response | 200 OK (success) or error |

### Error Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | Account doesn't exist |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Show generic error |

### Service Function Features

| Feature | Purpose |
|---------|---------|
| Type Safety | Full TypeScript support |
| Error Handling | Structured error responses |
| Timeout | Prevent hanging requests |
| Retry Logic | Handle transient failures |
| Request Cancellation | Support abort signals |

### Expected Outcome
- Login API service function created
- Proper request/response typing
- Clean error handling structure
- Integration with login form submit

### Verification Checklist
- [ ] `loginService.ts` created in correct directory
- [ ] Request and response types defined
- [ ] Service function makes POST request
- [ ] Error responses are preserved
- [ ] Timeout configured appropriately
- [ ] TypeScript types are correct
- [ ] Function is exported properly

---

## Task 46: Create Handle Token Response

### Overview
Implement token handling logic that processes the authentication response, stores tokens securely, and manages customer session state. This includes storing JWT tokens in HTTP-only cookies or secure storage, updating application state with customer information, and handling remember me functionality to adjust token expiration times.

### Dependencies
- Task 45 (Login API Service) must be complete
- Token storage mechanism is configured
- State management for auth is set up
- Cookie/storage utilities are available

### Instructions

1. **Create token handler function**
   - Name function `handleAuthTokens` or `processLoginResponse`
   - Accept LoginResponse as parameter
   - Extract tokens and user data
   - Return success/failure indicator

2. **Store access token**
   - Store in httpOnly cookie (preferred)
   - Alternative: secure localStorage with encryption
   - Set appropriate expiration time (15 minutes default)
   - Ensure secure flag is set in production

3. **Store refresh token**
   - Store in separate httpOnly cookie
   - Set longer expiration (7 days default, 30 if remember me)
   - Mark as httpOnly and secure
   - Include sameSite attribute for CSRF protection

4. **Adjust token expiry based on remember me**
   - If rememberMe is true, extend refresh token to 30 days
   - Keep access token expiry unchanged
   - Update cookie maxAge accordingly
   - Document expiration policy

5. **Update authentication state**
   - Set `isAuthenticated` to true
   - Store customer profile data
   - Update user context/store
   - Trigger auth state change events

6. **Handle customer profile**
   - Extract customer data from response
   - Store essential profile information
   - Update user state/context
   - Cache relevant customer details

7. **Set up token refresh scheduling**
   - Calculate time until access token expiry
   - Schedule automatic token refresh
   - Use refresh token before access token expires
   - Handle refresh failures gracefully

8. **Implement cleanup on logout**
   - Clear both tokens on logout
   - Remove customer data from state
   - Cancel scheduled refresh
   - Reset authentication state

### Token Storage Strategy

| Token | Storage | Expiry | Flags |
|-------|---------|--------|-------|
| accessToken | httpOnly cookie | 15 min | Secure, SameSite |
| refreshToken | httpOnly cookie | 7-30 days | Secure, SameSite |

### Remember Me Effect

| Setting | Access Token | Refresh Token |
|---------|-------------|---------------|
| Unchecked | 15 minutes | 7 days |
| Checked | 15 minutes | 30 days |

### Cookie Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| httpOnly | true | Prevent XSS attacks |
| secure | true (production) | HTTPS only |
| sameSite | Strict/Lax | CSRF protection |
| path | `/` | Available site-wide |
| maxAge | Variable | Token expiration |

### State Updates

| State | Update Action |
|-------|---------------|
| isAuthenticated | Set to true |
| currentUser | Set customer data |
| authLoading | Set to false |
| authError | Clear errors |

### Token Refresh Flow

| Step | Action |
|------|--------|
| 1 | Check access token expiry |
| 2 | If near expiry, use refresh token |
| 3 | Call refresh endpoint |
| 4 | Store new access token |
| 5 | Schedule next refresh |

### Security Considerations

| Risk | Mitigation |
|------|------------|
| XSS | httpOnly cookies |
| CSRF | SameSite attribute |
| Token theft | Secure flag, HTTPS only |
| Session hijacking | Refresh token rotation |

### Expected Outcome
- Tokens stored securely in httpOnly cookies
- Authentication state updated correctly
- Remember me functionality working
- Token refresh mechanism scheduled

### Verification Checklist
- [ ] Token handler function created
- [ ] Access token stored in httpOnly cookie
- [ ] Refresh token stored separately
- [ ] Remember me adjusts expiration
- [ ] Auth state updated properly
- [ ] Token refresh scheduled
- [ ] Security flags configured
- [ ] Cleanup on logout implemented

---

## Task 47: Create Login Error Handling

### Overview
Implement comprehensive error handling for login failures, providing clear and actionable error messages to customers. This includes handling invalid credentials, account not found, network errors, and server issues, with appropriate user feedback and retry mechanisms.

### Dependencies
- Task 45 (Login API Service) must be complete
- Error display components are available
- Form error state management is configured
- Toast/notification system is optional

### Instructions

1. **Create error handler function**
   - Name function `handleLoginError` or `processLoginError`
   - Accept error object as parameter
   - Parse error response structure
   - Return formatted error message

2. **Handle 401 Unauthorized errors**
   - Status code 401 indicates invalid credentials
   - Show message: "Invalid email/phone or password"
   - Focus back on password field
   - Clear password field for security

3. **Handle 404 Not Found errors**
   - Status code 404 indicates account doesn't exist
   - Show message: "Account not found. Please register."
   - Provide link to registration page
   - Suggest user check their identifier

4. **Handle network errors**
   - Catch connection failures
   - Show message: "Connection error. Please try again."
   - Provide retry button
   - Check network status if available

5. **Handle server errors (500+)**
   - Status codes 500-599 indicate server issues
   - Show message: "Server error. Please try again later."
   - Avoid exposing technical details
   - Log error for debugging

6. **Handle validation errors (400)**
   - Status code 400 indicates bad request
   - Parse field-specific errors from response
   - Display errors next to respective fields
   - Highlight fields with errors

7. **Display error messages**
   - Show errors inline below form fields
   - Use toast/notification for general errors
   - Apply error styling to inputs
   - Ensure errors are accessible (ARIA)

8. **Implement error recovery**
   - Clear errors when user types
   - Allow immediate retry
   - Don't disable form permanently
   - Provide clear path forward

### Error Mapping

| Status Code | Error Message | User Action |
|-------------|---------------|-------------|
| 401 | "Invalid email/phone or password" | Retry with correct credentials |
| 404 | "Account not found. Please register." | Go to registration |
| 400 | Field-specific validation errors | Fix validation issues |
| 429 | "Too many attempts. Try again later." | Wait before retrying |
| 500+ | "Server error. Please try again later." | Retry later |
| Network | "Connection error. Please try again." | Check connection and retry |

### Error Display Strategy

| Error Type | Display Method | Location |
|-----------|----------------|----------|
| Field validation | Inline below field | Form fields |
| Authentication | Toast or alert | Top of form |
| Network | Toast or banner | Page level |
| Server | Toast or modal | Page level |

### Error Message Guidelines

| Principle | Implementation |
|-----------|----------------|
| Clear | Use simple, non-technical language |
| Specific | Indicate what went wrong |
| Actionable | Suggest what to do next |
| Secure | Don't reveal sensitive details |
| Friendly | Maintain helpful tone |

### Retry Mechanism

| Scenario | Retry Strategy |
|----------|----------------|
| Network error | Immediate retry button |
| Server error | Suggest retry after delay |
| Invalid credentials | Allow immediate retry |
| Rate limited | Block retry until cooldown |

### Error State Management

| State | Purpose |
|-------|---------|
| loginError | General error message |
| fieldErrors | Field-specific errors |
| isRetrying | Retry in progress |
| errorType | Classification for handling |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| ARIA | Use `aria-invalid` and `aria-describedby` |
| Focus | Move focus to error or first field |
| Screen readers | Announce errors clearly |
| Visual | Use color + icon + text |

### Expected Outcome
- Clear error messages for all failure scenarios
- Appropriate error display methods
- User-friendly recovery paths
- Secure error handling

### Verification Checklist
- [ ] Error handler function created
- [ ] 401 errors show credential message
- [ ] 404 errors show account not found
- [ ] Network errors handled properly
- [ ] Server errors show generic message
- [ ] Validation errors display inline
- [ ] Error messages are clear and helpful
- [ ] Retry mechanisms work correctly
- [ ] Errors are accessible

---

## Task 48: Create Too Many Attempts Error Handling

### Overview
Implement rate limiting error handling to prevent brute force attacks and provide clear feedback when login attempts are throttled. This includes detecting 429 status codes, displaying countdown timers, temporarily disabling the form, and providing retry guidance after the cooldown period.

### Dependencies
- Task 47 (Login Error Handling) must be complete
- Rate limiting is implemented in backend
- Timer/countdown functionality is available
- Form disable/enable logic is working

### Instructions

1. **Detect rate limit error**
   - Check for status code 429
   - Parse retry-after header from response
   - Extract cooldown duration
   - Identify rate limit type (IP vs account)

2. **Display rate limit message**
   - Show message: "Too many login attempts. Try again in X minutes."
   - Make message prominent and clear
   - Use warning/error styling
   - Ensure message is visible above form

3. **Calculate cooldown time**
   - Parse `Retry-After` header (seconds or date)
   - Calculate remaining time in minutes/seconds
   - Store cooldown end time
   - Handle timezone considerations

4. **Implement countdown timer**
   - Display remaining time dynamically
   - Update every second
   - Format as "Xm Ys" or "X minutes Y seconds"
   - Show countdown in error message

5. **Disable login form**
   - Disable all form inputs
   - Disable submit button
   - Show disabled state visually
   - Add tooltip explaining why disabled

6. **Store rate limit state**
   - Persist cooldown end time in localStorage
   - Survive page refreshes
   - Check on page load
   - Clear when cooldown expires

7. **Re-enable form after cooldown**
   - Check countdown on timer tick
   - Re-enable form when time reaches 0
   - Clear error message
   - Remove disabled state

8. **Provide helpful guidance**
   - Explain why rate limiting is in place
   - Suggest using "Forgot Password" if locked out
   - Offer link to support if needed
   - Reassure this is temporary

### Rate Limit Detection

| Indicator | Source |
|-----------|--------|
| Status code | 429 (Too Many Requests) |
| Header | `Retry-After` |
| Response body | Cooldown duration |
| Rate limit type | IP or account-based |

### Error Message Format

| Component | Example |
|-----------|---------|
| Base message | "Too many login attempts." |
| Countdown | "Try again in 4 minutes 32 seconds." |
| Guidance | "Please try again later or reset your password." |

### Countdown Display

| Time Remaining | Format |
|----------------|--------|
| > 60 seconds | "X minutes Y seconds" |
| < 60 seconds | "X seconds" |
| 0 seconds | Clear and re-enable |

### Form Disable Strategy

| Element | Disabled State |
|---------|----------------|
| Email/Phone input | Disabled |
| Password input | Disabled |
| Submit button | Disabled |
| Remember me | Disabled |
| Forgot password | Enabled (allow alternative) |
| Register link | Enabled (allow alternative) |

### Persistence Strategy

| Data | Storage | Purpose |
|------|---------|---------|
| cooldownEnd | localStorage | Survive refresh |
| lockReason | localStorage | Show appropriate message |
| attemptCount | sessionStorage | Track current session |

### Cooldown Calculation

| Header Value | Interpretation |
|--------------|----------------|
| Integer | Seconds until retry allowed |
| HTTP Date | Absolute time for retry |
| Missing | Default 5 minutes |

### Timer Implementation

| Aspect | Approach |
|--------|----------|
| Update frequency | Every 1 second |
| Cleanup | Clear interval on unmount |
| Completion | Re-enable form and clear message |
| Accuracy | Sync with actual time, not intervals |

### User Guidance

| Situation | Guidance Message |
|-----------|------------------|
| First lock | "Too many attempts. This protects your account." |
| Repeated lock | "Frequent attempts. Consider resetting password." |
| Near expiry | "You can retry in less than a minute." |

### Expected Outcome
- Rate limiting errors detected and handled
- Countdown timer displays remaining time
- Form disabled during cooldown
- Clear guidance for users
- State persists across refreshes

### Verification Checklist
- [ ] 429 status code detected
- [ ] Retry-After header parsed
- [ ] Countdown timer implemented
- [ ] Timer updates every second
- [ ] Form disabled during cooldown
- [ ] Form re-enabled after cooldown
- [ ] State persists in localStorage
- [ ] Error message is clear and helpful
- [ ] Alternative actions available (forgot password, register)

---

## Task 49: Create Login Success Redirect

### Overview
Implement redirect logic after successful login, handling various scenarios including direct navigation, checkout returns, and parameterized return URLs. This ensures customers are taken to the appropriate destination after authentication based on their previous context.

### Dependencies
- Task 46 (Handle Token Response) must be complete
- Next.js routing is configured
- URL parameter parsing is available
- Navigation hooks are available

### Instructions

1. **Create redirect handler function**
   - Name function `handleLoginSuccess` or `redirectAfterLogin`
   - Accept optional redirect parameters
   - Check for various redirect sources
   - Execute navigation

2. **Check for return URL parameter**
   - Parse `returnUrl` from query parameters
   - Validate URL is internal (security)
   - Sanitize URL to prevent open redirect
   - Use as primary redirect target if present

3. **Check for checkout context**
   - Detect if user came from checkout
   - Check for checkout return flag
   - Verify cart has items
   - Prioritize checkout redirect if applicable

4. **Default redirect destination**
   - If no return URL, redirect to `/account`
   - Customer account dashboard as default
   - Show welcome message if first login
   - Update last login timestamp

5. **Validate redirect URLs**
   - Ensure URL is within same origin
   - Prevent open redirect vulnerabilities
   - Block external URLs
   - Allow only whitelisted paths

6. **Handle redirect execution**
   - Use Next.js router push method
   - Replace history if coming from login page
   - Preserve query parameters if needed
   - Handle errors in navigation

7. **Show success feedback**
   - Display brief success toast/message
   - Show "Welcome back, [Name]"
   - Fade out quickly (2-3 seconds)
   - Don't block redirect

8. **Clean up redirect parameters**
   - Remove returnUrl from URL after use
   - Clear checkout return flag if applicable
   - Update navigation history cleanly
   - Remove sensitive query parameters

### Redirect Priority Order

| Priority | Source | Destination |
|----------|--------|-------------|
| 1 | returnUrl parameter | Specified URL |
| 2 | Checkout context | `/checkout` |
| 3 | Default | `/account` |

### Return URL Validation

| Check | Purpose |
|-------|---------|
| Same origin | Prevent open redirect |
| Internal path | Security measure |
| No javascript: | XSS prevention |
| No data: | XSS prevention |
| Whitelist | Allow only safe paths |

### Whitelisted Paths

| Path Pattern | Purpose |
|--------------|---------|
| `/account/*` | Account pages |
| `/checkout` | Checkout flow |
| `/orders/*` | Order history |
| `/wishlist` | Wishlist page |
| `/cart` | Shopping cart |

### Redirect Scenarios

| User Journey | Redirect Target | Notes |
|-------------|----------------|-------|
| Direct login | `/account` | Default destination |
| From checkout | `/checkout` | Continue purchase |
| From product page | Product page | Via returnUrl |
| From wishlist | `/wishlist` | Via returnUrl |
| Email link | Specified page | Via returnUrl |

### Navigation Methods

| Method | Use Case |
|--------|----------|
| router.push() | Standard navigation |
| router.replace() | Coming from login page |
| router.prefetch() | Preload destination |
| window.location | External URLs (if allowed) |

### Success Feedback

| Message Type | Content | Duration |
|-------------|---------|----------|
| Toast | "Welcome back!" | 2-3 seconds |
| Banner | "Login successful" | Auto-dismiss |
| Inline | Customer name greeting | Persistent |

### Security Considerations

| Risk | Mitigation |
|------|------------|
| Open redirect | Validate origin |
| XSS via URL | Sanitize parameters |
| CSRF | Validate session |
| Token theft | Use httpOnly cookies |

### URL Cleanup

| Parameter | Action |
|-----------|--------|
| returnUrl | Remove after redirect |
| fromCheckout | Clear flag |
| auth tokens | Never in URL |
| Sensitive data | Remove immediately |

### Expected Outcome
- Successful redirects to appropriate pages
- Return URL logic working correctly
- Checkout returns handled properly
- Default fallback to account page
- Secure URL validation in place

### Verification Checklist
- [ ] Redirect handler function created
- [ ] returnUrl parameter parsed and used
- [ ] Checkout context detected and handled
- [ ] Default redirect to `/account` works
- [ ] URL validation prevents open redirects
- [ ] Success message shown briefly
- [ ] Navigation executes smoothly
- [ ] Query parameters cleaned up
- [ ] Security checks implemented

---

## Task 50: Create Checkout Return Logic

### Overview
Implement specialized logic for handling login during the checkout process, ensuring seamless continuation of purchase flow after authentication. This includes detecting checkout context, merging guest cart with authenticated cart, preserving checkout state, and redirecting back to checkout with all data intact.

### Dependencies
- Task 49 (Login Success Redirect) must be complete
- Cart merge functionality is available
- Checkout state management is configured
- Cart service is implemented

### Instructions

1. **Detect checkout context**
   - Check for `fromCheckout` query parameter
   - Check for `returnUrl=/checkout` parameter
   - Detect if checkout route is in history
   - Store checkout flag in session

2. **Preserve checkout state**
   - Store checkout progress before login
   - Save shipping information if entered
   - Preserve payment method selection
   - Store promo codes if applied

3. **Merge guest and user carts**
   - Retrieve guest cart from localStorage/session
   - Retrieve authenticated user's existing cart
   - Merge items with conflict resolution
   - Update quantities if same items exist

4. **Handle cart conflicts**
   - If item exists in both carts, use max quantity
   - Preserve user cart items
   - Add new guest cart items
   - Recalculate totals

5. **Verify cart has items**
   - Check merged cart is not empty
   - Validate all items are still available
   - Check stock levels
   - Remove unavailable items

6. **Redirect to checkout**
   - Navigate to `/checkout` after cart merge
   - Restore checkout progress
   - Prefill shipping information if stored
   - Highlight next step

7. **Restore checkout progress**
   - Restore selected shipping address
   - Restore shipping method
   - Restore payment method
   - Restore promo codes

8. **Clear guest data**
   - Remove guest cart after merge
   - Clear temporary checkout data
   - Keep only authenticated session
   - Clean up localStorage

### Checkout Detection Methods

| Method | Source | Priority |
|--------|--------|----------|
| Query parameter | `?fromCheckout=true` | High |
| Return URL | `?returnUrl=/checkout` | High |
| Session flag | `checkoutInProgress` | Medium |
| Referrer | `document.referrer` | Low |

### Cart Merge Strategy

| Scenario | Action |
|----------|--------|
| Same item in both | Keep max quantity |
| Item only in guest | Add to user cart |
| Item only in user | Keep as is |
| Guest cart empty | Keep user cart |
| User cart empty | Adopt guest cart |

### Conflict Resolution

| Conflict | Resolution |
|----------|------------|
| Quantity difference | Use higher quantity |
| Price difference | Use current price |
| Options/variants | Treat as separate items |
| Out of stock | Remove and notify |

### Checkout State Preservation

| Data | Storage | Duration |
|------|---------|----------|
| Shipping address | sessionStorage | Until checkout complete |
| Payment method | sessionStorage | Until checkout complete |
| Promo codes | sessionStorage | Until checkout complete |
| Checkout step | sessionStorage | Until checkout complete |

### Redirect Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| returnedFromLogin | true | Indicate login flow |
| cartMerged | true | Indicate merge occurred |
| step | current | Resume at step |

### Cart Validation

| Check | Action if Failed |
|-------|------------------|
| Cart empty | Redirect to products |
| Items unavailable | Show notice, remove items |
| Stock insufficient | Update quantity, notify |
| Price changes | Show notice, update |

### Data Cleanup

| Data | Action | Timing |
|------|--------|--------|
| Guest cart | Delete | After merge |
| Guest session | Clear | After login |
| Temporary flags | Remove | After redirect |
| Old checkout state | Clear | After complete |

### User Experience Flow

| Step | User Sees |
|------|-----------|
| 1. Checkout | Login prompt |
| 2. Login | Login form |
| 3. Submit | Loading state |
| 4. Success | Brief "Merging cart..." |
| 5. Redirect | Back to checkout |
| 6. Continue | Checkout with merged cart |

### Merge Notification

| Scenario | Message |
|----------|---------|
| Items added | "Cart updated with previous items" |
| Quantities changed | "Quantities adjusted" |
| Items removed | "Some items no longer available" |
| No changes | No message |

### Expected Outcome
- Checkout context detected correctly
- Guest cart merged with user cart
- Checkout state preserved and restored
- Seamless continuation of purchase flow
- Clear communication about cart changes

### Verification Checklist
- [ ] Checkout context detection working
- [ ] Guest cart merged correctly
- [ ] Cart conflict resolution implemented
- [ ] Checkout state preserved
- [ ] Redirect to checkout executes
- [ ] Checkout progress restored
- [ ] Guest data cleaned up
- [ ] Merge notifications shown
- [ ] Empty cart handled appropriately
- [ ] Out of stock items removed

---

## Task 51: Create Register Link

### Overview
Add a registration link component to the login page that directs new customers to the registration flow. This provides a clear path for users who don't have an account and need to create one before logging in.

### Dependencies
- Task 35 (Login Page) must be complete
- Registration page route is available
- Link component from UI library
- Registration flow is implemented

### Instructions

1. **Create register link component**
   - Name component `RegisterLink.tsx`
   - Place in `components/storefront/auth/Login/`
   - Create as functional component
   - Export from index.ts

2. **Design link layout**
   - Place below login form
   - Center align the content
   - Add subtle separator line above
   - Use consistent spacing

3. **Add descriptive text**
   - Text: "Don't have an account?"
   - Use muted color for question
   - Make text clear and readable
   - Ensure proper spacing

4. **Add register link**
   - Text: "Sign up" or "Create account"
   - Make it a clickable link
   - Use primary brand color
   - Add hover state

5. **Configure link destination**
   - Navigate to `/register` route
   - Use Next.js Link component
   - Preserve returnUrl parameter if present
   - Pass fromCheckout flag if applicable

6. **Style the component**
   - Match authentication page styling
   - Use appropriate font size
   - Add hover effects
   - Ensure accessibility

7. **Handle return URL preservation**
   - If returnUrl exists, pass to register page
   - Maintain checkout context
   - Preserve redirect destination
   - Ensure seamless flow

8. **Add to login page**
   - Place at bottom of login form
   - Add appropriate spacing
   - Ensure visibility
   - Test responsive behavior

### Component Structure

| Element | Content | Style |
|---------|---------|-------|
| Separator | Horizontal line | Subtle, muted |
| Text | "Don't have an account?" | Muted color |
| Link | "Sign up" | Primary color, hover underline |

### Link Text Options

| Option | Tone | Use Case |
|--------|------|----------|
| "Sign up" | Casual | Modern stores |
| "Create account" | Formal | Professional stores |
| "Register" | Direct | Simple approach |
| "Join now" | Inviting | Community-focused |

### Navigation Parameters

| Parameter | Pass Through | Purpose |
|-----------|-------------|---------|
| returnUrl | Yes | Redirect after registration |
| fromCheckout | Yes | Checkout flow context |
| promoCode | Optional | Signup incentives |

### Layout Placement

| Section | Order |
|---------|-------|
| Logo | 1 |
| Login form | 2 |
| Social login | 3 |
| Divider | 4 |
| Register link | 5 |

### Styling Guidelines

| Property | Value | Purpose |
|----------|-------|---------|
| Text alignment | Center | Visual balance |
| Font size | 14px | Readable but secondary |
| Color | Muted gray | Less prominent |
| Link color | Primary brand | Clear action |
| Hover | Underline | Interactive feedback |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| ARIA label | "Create a new account" |
| Focus state | Visible outline |
| Tab order | Logical flow |
| Screen reader | Clear link text |

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full width, clear tap target |
| Tablet | Centered, comfortable spacing |
| Desktop | Centered, subtle separator |

### Return URL Handling

| Scenario | Return URL |
|----------|------------|
| Direct login page | None |
| From product | `/products/[id]` |
| From checkout | `/checkout` |
| From wishlist | `/wishlist` |

### Expected Outcome
- Register link component created
- Clear path to registration
- Consistent styling with login page
- Return URL preserved correctly

### Verification Checklist
- [ ] RegisterLink component created
- [ ] Component placed in correct directory
- [ ] Descriptive text included
- [ ] Link navigates to `/register`
- [ ] Return URL passed correctly
- [ ] Checkout context preserved
- [ ] Styling matches login page
- [ ] Hover states working
- [ ] Accessible to screen readers
- [ ] Responsive on all devices
- [ ] Exported from index.ts

---

## Task 52: Verify Login Flow

### Overview
Conduct comprehensive testing of the entire login flow to ensure all components work together seamlessly. This includes testing form validation, API integration, error handling, token management, redirects, and edge cases across different browsers and devices.

### Dependencies
- All previous tasks (35-51) must be complete
- Test environment is configured
- Backend authentication API is available
- Test accounts are created

### Instructions

1. **Prepare test environment**
   - Ensure development server is running
   - Backend API is accessible
   - Database has test data
   - Test user accounts exist

2. **Test basic login flow**
   - Navigate to `/login`
   - Enter valid email and password
   - Submit form
   - Verify redirect to `/account`
   - Check authentication state

3. **Test email/phone detection**
   - Enter email address
   - Verify detected as email
   - Enter phone number
   - Verify detected as phone
   - Check validation for each type

4. **Test form validation**
   - Submit empty form
   - Check required field errors
   - Enter invalid email format
   - Check email validation error
   - Enter short password
   - Check password validation error

5. **Test password visibility toggle**
   - Click show password icon
   - Verify password is visible
   - Click hide password icon
   - Verify password is hidden
   - Check icon changes correctly

6. **Test remember me functionality**
   - Login with remember me unchecked
   - Verify short token expiry (7 days)
   - Login with remember me checked
   - Verify extended token expiry (30 days)
   - Check token storage

7. **Test error handling**
   - Enter invalid credentials
   - Verify error message shown
   - Enter non-existent email
   - Check account not found message
   - Simulate network error
   - Verify connection error message

8. **Test rate limiting**
   - Make multiple failed login attempts
   - Verify rate limit message appears
   - Check countdown timer is working
   - Verify form is disabled
   - Wait for cooldown
   - Verify form re-enables

9. **Test checkout return flow**
   - Add items to cart as guest
   - Proceed to checkout
   - Click login
   - Complete login
   - Verify redirect to checkout
   - Check cart items merged

10. **Test return URL functionality**
    - Navigate to product page
    - Click login
    - Complete login
    - Verify redirect to product page
    - Check URL is sanitized

11. **Test register link**
    - Click "Sign up" link
    - Verify navigation to `/register`
    - Check return URL preserved
    - Verify checkout context maintained

12. **Test token management**
    - Login successfully
    - Check tokens in cookies
    - Verify httpOnly flag set
    - Check secure flag in production
    - Verify token expiration times

13. **Test logout and re-login**
    - Logout from account
    - Verify tokens cleared
    - Verify auth state reset
    - Login again
    - Check state restored

14. **Test responsive design**
    - View on mobile device
    - Check form usability
    - Verify buttons are tappable
    - Test on tablet
    - Test on desktop

15. **Test browser compatibility**
    - Test in Chrome
    - Test in Firefox
    - Test in Safari
    - Test in Edge
    - Verify consistent behavior

16. **Test accessibility**
    - Navigate with keyboard only
    - Use tab to move through form
    - Submit with Enter key
    - Test with screen reader
    - Verify ARIA labels

### Test Scenarios

| Scenario | Expected Result |
|----------|----------------|
| Valid credentials | Login successful, redirect to account |
| Invalid password | Error message shown |
| Account not found | Not found message, suggest register |
| Empty form | Required field errors |
| Network error | Connection error message |
| Rate limited | Countdown timer, form disabled |
| Remember me checked | Extended token expiry |
| From checkout | Redirect to checkout, cart merged |
| Return URL present | Redirect to specified URL |

### Validation Tests

| Field | Test Input | Expected Error |
|-------|------------|----------------|
| Email/Phone | Empty | "Email or phone is required" |
| Email/Phone | Invalid format | "Invalid email or phone format" |
| Password | Empty | "Password is required" |
| Password | Too short | "Password must be at least 6 characters" |

### API Integration Tests

| Test | Endpoint | Expected Response |
|------|----------|-------------------|
| Successful login | POST /login | 200, tokens returned |
| Invalid credentials | POST /login | 401, error message |
| Account not found | POST /login | 404, error message |
| Rate limited | POST /login | 429, retry-after header |

### Token Storage Tests

| Check | Expected Result |
|-------|----------------|
| Access token | Stored in httpOnly cookie |
| Refresh token | Stored in httpOnly cookie |
| Token expiry | Correct maxAge set |
| Secure flag | Set in production |
| SameSite | Set to Lax or Strict |

### Redirect Tests

| Source | Expected Destination |
|--------|---------------------|
| Direct login | `/account` |
| From checkout | `/checkout` |
| With returnUrl | Specified URL |
| From product | Product page |
| From wishlist | `/wishlist` |

### Error Display Tests

| Error Type | Display Location | Style |
|-----------|-----------------|-------|
| Field validation | Below field | Red text, inline |
| Invalid credentials | Toast or alert | Warning style |
| Network error | Toast | Error style |
| Rate limit | Banner above form | Warning style |

### Browser Compatibility Matrix

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✓ Tested |
| Firefox | Latest | ✓ Tested |
| Safari | Latest | ✓ Tested |
| Edge | Latest | ✓ Tested |
| Mobile Safari | iOS 14+ | ✓ Tested |
| Chrome Mobile | Latest | ✓ Tested |

### Accessibility Checklist

| Feature | Status |
|---------|--------|
| Keyboard navigation | ✓ Working |
| Focus indicators | ✓ Visible |
| ARIA labels | ✓ Present |
| Screen reader | ✓ Tested |
| Color contrast | ✓ WCAG AA |
| Form labels | ✓ Associated |

### Performance Tests

| Metric | Target | Measured |
|--------|--------|----------|
| Page load | < 1s | Test |
| Form render | < 100ms | Test |
| Submit response | < 500ms | Test |
| Redirect time | < 200ms | Test |

### Expected Outcome
- All login flow components working correctly
- Form validation functioning properly
- API integration successful
- Error handling comprehensive
- Redirects working as expected
- Tokens managed securely
- Responsive and accessible

### Verification Checklist
- [ ] Basic login flow works
- [ ] Email/phone detection accurate
- [ ] Form validation complete
- [ ] Password toggle functional
- [ ] Remember me works correctly
- [ ] Error messages clear and helpful
- [ ] Rate limiting effective
- [ ] Checkout return flow seamless
- [ ] Return URL handled correctly
- [ ] Register link navigates properly
- [ ] Tokens stored securely
- [ ] Logout clears state
- [ ] Responsive on all devices
- [ ] Works in all major browsers
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Performance acceptable

---

## Group Integration

### Component Relationships

| Component | Depends On | Used By |
|-----------|------------|---------|
| LoginService | HTTP Client | LoginForm |
| Token Handler | Storage Utils | LoginService |
| Error Handler | Error Types | LoginForm |
| Redirect Logic | Router | Token Handler |
| Register Link | Link Component | LoginPage |

### Data Flow

| Step | Data | Direction |
|------|------|-----------|
| 1 | Form values | Form → Submit handler |
| 2 | Credentials | Submit → API Service |
| 3 | Tokens | API → Token handler |
| 4 | Auth state | Token → State/Context |
| 5 | Redirect | State → Router |

### State Management

| State | Location | Purpose |
|-------|----------|---------|
| formData | React Hook Form | Form inputs |
| isSubmitting | Component state | Loading state |
| loginError | Component state | Error display |
| isAuthenticated | Global state | Auth status |
| currentUser | Global state | User data |

### Error Propagation

| Source | Handler | Display |
|--------|---------|---------|
| API | Service | Pass to component |
| Component | Error handler | Format message |
| Display | UI component | Show to user |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Token storage | httpOnly cookies |
| CSRF protection | SameSite cookies |
| XSS prevention | Input sanitization |
| Rate limiting | Backend + frontend |
| Open redirect | URL validation |

---

## Testing Strategy

### Unit Tests

| Component | Test Coverage |
|-----------|---------------|
| LoginService | API calls, error handling |
| Token Handler | Storage, expiry, cleanup |
| Error Handler | Message formatting |
| Redirect Logic | URL validation, navigation |
| Register Link | Navigation, params |

### Integration Tests

| Flow | Test Scenarios |
|------|---------------|
| Login success | Submit → API → Tokens → Redirect |
| Login failure | Submit → API → Error → Display |
| Rate limit | Multiple attempts → Lock → Countdown |
| Checkout return | Login → Cart merge → Redirect |

### E2E Tests

| User Journey | Steps |
|-------------|-------|
| Happy path | Open → Fill → Submit → Redirect |
| Error recovery | Open → Fill wrong → Error → Retry → Success |
| Checkout flow | Cart → Checkout → Login → Continue |

---

## Troubleshooting Guide

### Common Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Login fails silently | API not responding | Check network, backend status |
| Tokens not stored | Cookie settings | Verify httpOnly, secure flags |
| Redirect loops | Bad return URL | Validate and sanitize URLs |
| Rate limit too aggressive | Config issue | Adjust backend settings |
| Cart not merging | Service issue | Check cart merge logic |

### Debug Steps

| Problem | Debug Action |
|---------|-------------|
| No response from API | Check browser network tab |
| Tokens not saving | Inspect cookie storage |
| Redirect not working | Check router navigation |
| Errors not showing | Verify error state updates |

---

## Performance Optimization

### Optimization Strategies

| Area | Strategy | Impact |
|------|----------|--------|
| API calls | Debounce validation | Reduce requests |
| Token refresh | Schedule efficiently | Prevent expired tokens |
| Error messages | Memoize handlers | Reduce re-renders |
| Redirects | Prefetch destinations | Faster navigation |

### Monitoring

| Metric | Tool | Target |
|--------|------|--------|
| API response time | Network tab | < 500ms |
| Form render time | React DevTools | < 100ms |
| Token validation | Custom logging | < 50ms |
| Redirect time | Performance API | < 200ms |

---

## Documentation References

### Related Documents

| Document | Relevance |
|----------|-----------|
| Group-B Registration | Similar auth patterns |
| Group-D Password Reset | Shared components |
| SubPhase-07 Auth State | State management |
| Phase-03 API Setup | Backend integration |

### External Resources

| Resource | Purpose |
|----------|---------|
| React Hook Form docs | Form management |
| Zod documentation | Validation schemas |
| Next.js auth guide | Authentication patterns |
| JWT best practices | Token security |

---

## Completion Criteria

### Definition of Done

- [ ] All tasks (45-52) completed
- [ ] API service integrated and tested
- [ ] Token handling secure and working
- [ ] Error handling comprehensive
- [ ] Rate limiting functional
- [ ] Redirects working correctly
- [ ] Checkout return seamless
- [ ] Register link functional
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Deployed to dev environment

### Quality Gates

| Gate | Requirement |
|------|-------------|
| Functionality | All features working |
| Security | No vulnerabilities |
| Performance | Meets targets |
| Accessibility | WCAG AA compliant |
| Browser support | All major browsers |
| Mobile support | Responsive and usable |

---

## Next Steps

After completing this group, proceed to:

1. **Group-D: Password Reset** - Implement forgot password and reset flows
2. **Group-E: Email Verification** - Add email confirmation
3. **Group-F: Social Login** - Integrate OAuth providers

---

*This document is part of the comprehensive POS-ERP system documentation. For questions or clarifications, refer to the main SubPhase documentation or contact the development team.*
