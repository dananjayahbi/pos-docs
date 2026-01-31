# Tasks 83-88: Social Login UI Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** F - Social Login Prep & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-94_Testing-Verification.md](02_Tasks-89-94_Testing-Verification.md)

---

## Document Overview

This document covers the creation of social login UI components for the customer authentication system. It establishes the visual structure for social authentication options, including the "Or continue with" divider, Google and Facebook login buttons, placeholder handlers for future OAuth implementation, and social auth redirect handling. These components prepare the UI foundation for social authentication features that will be fully implemented in Phase-09.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Social Login Divider | Low | 15 min |
| 84 | Create Google Login Button | Low | 20 min |
| 85 | Create Facebook Login Button | Low | 20 min |
| 86 | Create Apple Login Button | Low | 20 min |
| 87 | Create Social Login Handler | Medium | 30 min |
| 88 | Create Social Auth Redirect | Medium | 25 min |

---

## Task 83: Create Social Login Divider

### Overview
Create a visual divider component that separates the traditional email/password authentication form from social login options. The divider features a horizontal line with centered text "Or continue with", providing a clear visual break and indicating alternative authentication methods.

### Dependencies
- Task 82: Create session persistence logic
- Frontend project component structure established
- Tailwind CSS configured

### Instructions

1. **Create component file structure**
   - Navigate to `frontend/components/storefront/auth/`
   - Create directory `SocialLogin/`
   - Create file `SocialDivider.tsx`

2. **Import required dependencies**
   - Import React
   - Import any required Tailwind utilities
   - No external component dependencies needed

3. **Create divider component**
   - Define `SocialDivider` functional component
   - Return JSX with horizontal line and text
   - Use relative positioning for text overlay

4. **Implement horizontal line**
   - Use border-top or hr element
   - Apply gray color (`border-gray-300`)
   - Full width with proper spacing

5. **Add centered text**
   - Position text in center of line
   - Text: "Or continue with"
   - White background behind text to break line
   - Gray text color for subtle appearance

6. **Apply responsive styling**
   - Ensure proper spacing on mobile devices
   - Maintain readability across screen sizes
   - Add vertical margins for separation

7. **Export component**
   - Default export the component
   - Update `index.ts` for clean imports

### Component Structure

```
┌─────────────────────────────────────┐
│                                     │
│  ─────── Or continue with ───────  │
│                                     │
└─────────────────────────────────────┘
```

### Styling Specifications

| Element | Styles | Purpose |
|---------|--------|---------|
| Container | `relative flex items-center my-6` | Positioning and spacing |
| Line | `flex-grow border-t border-gray-300` | Horizontal divider line |
| Text | `px-4 text-sm text-gray-500 bg-white` | Centered label |

### Component Code Template

```typescript
// frontend/components/storefront/auth/SocialLogin/SocialDivider.tsx

interface SocialDividerProps {
  text?: string;
}

export default function SocialDivider({ 
  text = "Or continue with" 
}: SocialDividerProps) {
  return (
    <div className="relative flex items-center my-6">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-4 text-sm text-gray-500 bg-white flex-shrink-0">
        {text}
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
```

### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | "Or continue with" | Divider text to display |

### Accessibility Considerations

| Aspect | Implementation |
|--------|----------------|
| Semantic HTML | Use proper div structure |
| Color Contrast | Gray text meets 4.5:1 ratio |
| Screen Readers | Text is readable |
| Visual Clarity | Clear separation visible |

### Integration Example

```typescript
// In LoginPage.tsx or RegisterPage.tsx

import SocialDivider from '@/components/storefront/auth/SocialLogin/SocialDivider';
import SocialLoginButtons from '@/components/storefront/auth/SocialLogin/SocialLoginButtons';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      {/* Email/Password Form */}
      <LoginForm />
      
      {/* Divider */}
      <SocialDivider />
      
      {/* Social Login Buttons */}
      <SocialLoginButtons />
    </div>
  );
}
```

### Expected Outcome
- Clean visual divider separating form from social login options
- Centered text with horizontal lines on both sides
- Responsive design maintaining appearance on all devices
- Reusable component with customizable text

### Verification Checklist
- [ ] Component file created at correct path
- [ ] Divider displays horizontal line correctly
- [ ] Text is centered and visible against background
- [ ] Proper spacing above and below divider
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Component exported and importable

---

## Task 84: Create Google Login Button

### Overview
Create a Google login button component with official Google branding, including the Google "G" logo and proper styling according to Google's brand guidelines. The button will display "Continue with Google" and handle click events for future OAuth integration.

### Dependencies
- Task 83: Create Social Login Divider

### Instructions

1. **Download Google brand assets**
   - Download official Google "G" logo (SVG or PNG)
   - Save to `frontend/public/icons/social/google.svg`
   - Ensure proper licensing and attribution

2. **Create button component file**
   - Navigate to `frontend/components/storefront/auth/SocialLogin/`
   - Create file `GoogleLoginButton.tsx`

3. **Import required dependencies**
   - Import React and React hooks
   - Import Next.js Image component
   - Import button utility classes

4. **Create button component**
   - Define `GoogleLoginButton` functional component
   - Accept onClick handler prop
   - Accept optional loading and disabled states

5. **Implement button structure**
   - Use button element with proper type
   - Add Google logo image
   - Add "Continue with Google" text
   - Apply proper spacing and alignment

6. **Apply Google brand styling**
   - White background (`bg-white`)
   - Dark text (`text-gray-700`)
   - Border with gray color (`border-gray-300`)
   - Hover effect with subtle gray background

7. **Add interaction states**
   - Hover: Slight background color change
   - Focus: Visible focus ring
   - Disabled: Reduced opacity, no interaction
   - Loading: Show spinner, disable button

8. **Ensure accessibility**
   - Add proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain focus indicators
   - Screen reader friendly text

### Button Design Specifications

| Element | Styles | Purpose |
|---------|--------|---------|
| Button | `w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors` | Main button styling |
| Logo | `w-5 h-5` | Google logo sizing |
| Text | `text-sm font-medium text-gray-700` | Button label |

### Google Brand Guidelines

| Aspect | Guideline |
|--------|-----------|
| Logo | Use official Google "G" logo |
| Colors | White background, dark text |
| Text | "Continue with Google" or "Sign in with Google" |
| Button Height | Minimum 40px for touch targets |
| Logo Position | Left side with text centered |

### Component Code Template

```typescript
// frontend/components/storefront/auth/SocialLogin/GoogleLoginButton.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GoogleLoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function GoogleLoginButton({
  onClick,
  disabled = false,
  loading = false
}: GoogleLoginButtonProps) {
  const handleClick = () => {
    if (disabled || loading) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3
        px-4 py-3 border border-gray-300 rounded-lg
        bg-white hover:bg-gray-50 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'cursor-wait' : ''}
      `}
      aria-label="Continue with Google"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      ) : (
        <Image
          src="/icons/social/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      )}
      <span className="text-sm font-medium text-gray-700">
        {loading ? 'Connecting...' : 'Continue with Google'}
      </span>
    </button>
  );
}
```

### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onClick | () => void | undefined | Click handler function |
| disabled | boolean | false | Disable button interaction |
| loading | boolean | false | Show loading state |

### Button States

| State | Visual Effect | Behavior |
|-------|---------------|----------|
| Default | White bg, gray border | Clickable |
| Hover | Light gray bg | Shows interactivity |
| Focus | Blue focus ring | Keyboard accessible |
| Disabled | 50% opacity | Not clickable |
| Loading | Spinner icon | Not clickable |

### Logo Asset Requirements

| Property | Value | Notes |
|----------|-------|-------|
| Format | SVG (preferred) or PNG | Vector for scalability |
| Size | 20x20px display | Actual can be larger |
| Colors | Official Google colors | RGB: (66, 133, 244) for blue |
| Background | Transparent | For flexibility |
| License | Public or licensed | Check Google brand guidelines |

### Integration Example

```typescript
// In LoginPage.tsx

import GoogleLoginButton from '@/components/storefront/auth/SocialLogin/GoogleLoginButton';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Placeholder for Phase-09 OAuth implementation
    console.log('Google login clicked');
    // Will implement: Redirect to Google OAuth
  };

  return (
    <div className="space-y-3">
      <GoogleLoginButton onClick={handleGoogleLogin} />
    </div>
  );
}
```

### Expected Outcome
- Professional Google-branded login button
- Proper styling according to brand guidelines
- Interactive states (hover, focus, disabled, loading)
- Ready for OAuth integration in Phase-09
- Accessible and keyboard-navigable

### Verification Checklist
- [ ] Component file created with proper structure
- [ ] Google logo displays correctly
- [ ] Button text reads "Continue with Google"
- [ ] White background with gray border
- [ ] Hover effect shows gray background
- [ ] Focus ring visible when focused
- [ ] Loading state shows spinner
- [ ] Disabled state reduces opacity
- [ ] Accessible with keyboard navigation
- [ ] ARIA labels present

---

## Task 85: Create Facebook Login Button

### Overview
Create a Facebook login button component with official Facebook branding, including the Facebook "f" logo and proper styling according to Facebook's brand guidelines. The button will display "Continue with Facebook" and handle click events for future OAuth integration.

### Dependencies
- Task 83: Create Social Login Divider
- Task 84: Create Google Login Button (for consistency)

### Instructions

1. **Download Facebook brand assets**
   - Download official Facebook "f" logo (white on transparent)
   - Save to `frontend/public/icons/social/facebook.svg`
   - Ensure proper licensing and attribution

2. **Create button component file**
   - Navigate to `frontend/components/storefront/auth/SocialLogin/`
   - Create file `FacebookLoginButton.tsx`

3. **Import required dependencies**
   - Import React and React hooks
   - Import Next.js Image component
   - Import button utility classes

4. **Create button component**
   - Define `FacebookLoginButton` functional component
   - Accept onClick handler prop
   - Accept optional loading and disabled states
   - Use similar structure to GoogleLoginButton

5. **Implement button structure**
   - Use button element with proper type
   - Add Facebook logo image
   - Add "Continue with Facebook" text
   - Apply proper spacing and alignment

6. **Apply Facebook brand styling**
   - Facebook blue background (`#1877F2`)
   - White text and icon
   - Hover effect with darker blue
   - Maintain brand consistency

7. **Add interaction states**
   - Hover: Darker blue background
   - Focus: Visible focus ring
   - Disabled: Reduced opacity, no interaction
   - Loading: Show spinner, disable button

8. **Ensure accessibility**
   - Add proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain focus indicators
   - Screen reader friendly text

### Button Design Specifications

| Element | Styles | Purpose |
|---------|--------|---------|
| Button | `w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#1877F2] hover:bg-[#1664D9] transition-colors` | Main button styling |
| Logo | `w-5 h-5` | Facebook logo sizing |
| Text | `text-sm font-medium text-white` | Button label |

### Facebook Brand Guidelines

| Aspect | Guideline |
|--------|-----------|
| Logo | Use official Facebook "f" logo (white) |
| Colors | Facebook Blue (#1877F2) background |
| Text | "Continue with Facebook" or "Sign in with Facebook" |
| Text Color | White text on blue background |
| Button Height | Minimum 40px for touch targets |
| Logo Position | Left side with text centered |

### Component Code Template

```typescript
// frontend/components/storefront/auth/SocialLogin/FacebookLoginButton.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FacebookLoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function FacebookLoginButton({
  onClick,
  disabled = false,
  loading = false
}: FacebookLoginButtonProps) {
  const handleClick = () => {
    if (disabled || loading) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3
        px-4 py-3 rounded-lg
        bg-[#1877F2] hover:bg-[#1664D9]
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'cursor-wait' : ''}
      `}
      aria-label="Continue with Facebook"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Image
          src="/icons/social/facebook.svg"
          alt="Facebook"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      )}
      <span className="text-sm font-medium text-white">
        {loading ? 'Connecting...' : 'Continue with Facebook'}
      </span>
    </button>
  );
}
```

### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onClick | () => void | undefined | Click handler function |
| disabled | boolean | false | Disable button interaction |
| loading | boolean | false | Show loading state |

### Button States

| State | Visual Effect | Behavior |
|-------|---------------|----------|
| Default | Facebook blue bg | Clickable |
| Hover | Darker blue bg | Shows interactivity |
| Focus | Blue focus ring | Keyboard accessible |
| Disabled | 50% opacity | Not clickable |
| Loading | White spinner | Not clickable |

### Facebook Brand Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Facebook Blue | #1877F2 | Primary button background |
| Hover Blue | #1664D9 | Hover state background |
| White | #FFFFFF | Text and icon color |

### Logo Asset Requirements

| Property | Value | Notes |
|----------|-------|-------|
| Format | SVG (preferred) or PNG | Vector for scalability |
| Size | 20x20px display | Actual can be larger |
| Color | White | For visibility on blue |
| Background | Transparent | For flexibility |
| License | Public or licensed | Check Facebook brand guidelines |

### Integration Example

```typescript
// In LoginPage.tsx

import FacebookLoginButton from '@/components/storefront/auth/SocialLogin/FacebookLoginButton';

export default function LoginPage() {
  const handleFacebookLogin = () => {
    // Placeholder for Phase-09 OAuth implementation
    console.log('Facebook login clicked');
    // Will implement: Redirect to Facebook OAuth
  };

  return (
    <div className="space-y-3">
      <FacebookLoginButton onClick={handleFacebookLogin} />
    </div>
  );
}
```

### Button Layout with Google

```
┌─────────────────────────────────────┐
│  [G] Continue with Google           │  ← White background
│                                     │
│  [f] Continue with Facebook         │  ← Blue background
└─────────────────────────────────────┘
```

### Expected Outcome
- Professional Facebook-branded login button
- Proper styling according to brand guidelines
- Interactive states (hover, focus, disabled, loading)
- Ready for OAuth integration in Phase-09
- Accessible and keyboard-navigable
- Visual consistency with Google button

### Verification Checklist
- [ ] Component file created with proper structure
- [ ] Facebook logo displays correctly (white on blue)
- [ ] Button text reads "Continue with Facebook"
- [ ] Facebook blue background (#1877F2)
- [ ] White text visible on blue background
- [ ] Hover effect shows darker blue
- [ ] Focus ring visible when focused
- [ ] Loading state shows white spinner
- [ ] Disabled state reduces opacity
- [ ] Accessible with keyboard navigation
- [ ] ARIA labels present
- [ ] Consistent spacing with Google button

---

## Task 86: Create Apple Login Button

### Overview
Create an Apple login button component with official Apple branding, including the Apple logo and proper styling according to Apple's Human Interface Guidelines. The button will display "Continue with Apple" and handle click events for future OAuth integration.

### Dependencies
- Task 84: Create Google Login Button
- Task 85: Create Facebook Login Button

### Instructions

1. **Download Apple brand assets**
   - Download official Apple logo (SVG)
   - Save to `frontend/public/icons/social/apple.svg`
   - Ensure proper licensing and attribution

2. **Create button component file**
   - Navigate to `frontend/components/storefront/auth/SocialLogin/`
   - Create file `AppleLoginButton.tsx`

3. **Import required dependencies**
   - Import React and React hooks
   - Import Next.js Image component
   - Import button utility classes

4. **Create button component**
   - Define `AppleLoginButton` functional component
   - Accept onClick handler prop
   - Accept optional loading and disabled states
   - Use similar structure to Google/Facebook buttons

5. **Implement button structure**
   - Use button element with proper type
   - Add Apple logo image
   - Add "Continue with Apple" text
   - Apply proper spacing and alignment

6. **Apply Apple brand styling**
   - Black background (`bg-black`)
   - White text and icon
   - Hover effect with slight opacity change
   - Clean, minimal design

7. **Add interaction states**
   - Hover: Slight opacity change
   - Focus: Visible white focus ring
   - Disabled: Reduced opacity, no interaction
   - Loading: Show spinner, disable button

8. **Ensure accessibility**
   - Add proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain focus indicators
   - Screen reader friendly text

### Button Design Specifications

| Element | Styles | Purpose |
|---------|--------|---------|
| Button | `w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-black hover:bg-gray-900 transition-colors` | Main button styling |
| Logo | `w-5 h-5` | Apple logo sizing |
| Text | `text-sm font-medium text-white` | Button label |

### Apple Brand Guidelines

| Aspect | Guideline |
|--------|-----------|
| Logo | Use official Apple logo (white on black) |
| Colors | Black background, white text |
| Text | "Continue with Apple" or "Sign in with Apple" |
| Text Color | White text on black background |
| Button Height | Minimum 44px for iOS touch targets |
| Logo Position | Left side with text centered |
| Border Radius | Rounded corners (8px) |

### Component Code Template

```typescript
// frontend/components/storefront/auth/SocialLogin/AppleLoginButton.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AppleLoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function AppleLoginButton({
  onClick,
  disabled = false,
  loading = false
}: AppleLoginButtonProps) {
  const handleClick = () => {
    if (disabled || loading) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3
        px-4 py-3 rounded-lg
        bg-black hover:bg-gray-900
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'cursor-wait' : ''}
      `}
      aria-label="Continue with Apple"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Image
          src="/icons/social/apple.svg"
          alt="Apple"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      )}
      <span className="text-sm font-medium text-white">
        {loading ? 'Connecting...' : 'Continue with Apple'}
      </span>
    </button>
  );
}
```

### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onClick | () => void | undefined | Click handler function |
| disabled | boolean | false | Disable button interaction |
| loading | boolean | false | Show loading state |

### Button States

| State | Visual Effect | Behavior |
|-------|---------------|----------|
| Default | Black background | Clickable |
| Hover | Dark gray bg | Shows interactivity |
| Focus | White focus ring | Keyboard accessible |
| Disabled | 50% opacity | Not clickable |
| Loading | White spinner | Not clickable |

### Apple Brand Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Black | #000000 | Primary button background |
| Dark Gray | #1A1A1A | Hover state background |
| White | #FFFFFF | Text and icon color |

### Logo Asset Requirements

| Property | Value | Notes |
|----------|-------|-------|
| Format | SVG (preferred) | Vector for scalability |
| Size | 20x20px display | Actual can be larger |
| Color | White | For visibility on black |
| Background | Transparent | For flexibility |
| License | Public or licensed | Check Apple guidelines |

### Integration Example

```typescript
// In LoginPage.tsx

import AppleLoginButton from '@/components/storefront/auth/SocialLogin/AppleLoginButton';

export default function LoginPage() {
  const handleAppleLogin = () => {
    // Placeholder for Phase-09 OAuth implementation
    console.log('Apple login clicked');
    // Will implement: Redirect to Apple OAuth
  };

  return (
    <div className="space-y-3">
      <AppleLoginButton onClick={handleAppleLogin} />
    </div>
  );
}
```

### All Social Buttons Layout

```
┌─────────────────────────────────────┐
│  [G] Continue with Google           │  ← White with border
│                                     │
│  [f] Continue with Facebook         │  ← Facebook blue
│                                     │
│  [] Continue with Apple            │  ← Black
└─────────────────────────────────────┘
```

### Expected Outcome
- Professional Apple-branded login button
- Proper styling according to Apple HIG
- Interactive states (hover, focus, disabled, loading)
- Ready for OAuth integration in Phase-09
- Accessible and keyboard-navigable
- Visual consistency with other social buttons

### Verification Checklist
- [ ] Component file created with proper structure
- [ ] Apple logo displays correctly (white on black)
- [ ] Button text reads "Continue with Apple"
- [ ] Black background with white text
- [ ] Hover effect shows darker background
- [ ] Focus ring visible when focused (white)
- [ ] Loading state shows white spinner
- [ ] Disabled state reduces opacity
- [ ] Accessible with keyboard navigation
- [ ] ARIA labels present
- [ ] Consistent spacing with other social buttons
- [ ] Minimum 44px height for iOS guidelines

---

## Task 87: Create Social Login Handler

### Overview
Create a centralized handler for social login button clicks that manages the placeholder functionality for Phase-08 and prepares the architecture for full OAuth implementation in Phase-09. This handler will show toast notifications indicating that social login is "coming soon" while establishing the proper structure for future integration.

### Dependencies
- Task 84: Create Google Login Button
- Task 85: Create Facebook Login Button
- Task 86: Create Apple Login Button

### Instructions

1. **Create handler utility file**
   - Navigate to `frontend/lib/storefront/auth/`
   - Create file `socialAuth.ts`
   - This file will contain social auth utilities

2. **Define social provider types**
   - Create TypeScript type for providers
   - Include: 'google', 'facebook', 'apple'
   - Allow for future provider additions

3. **Create placeholder handler function**
   - Define `handleSocialLogin` function
   - Accept provider parameter
   - Show "coming soon" notification
   - Log provider for debugging

4. **Add OAuth URL generation (stub)**
   - Create `generateOAuthUrl` function stub
   - Accept provider and redirect URL
   - Return placeholder URL
   - Add TODO comments for Phase-09

5. **Create OAuth callback handler (stub)**
   - Define `handleOAuthCallback` function stub
   - Accept authorization code parameter
   - Return placeholder success response
   - Add TODO comments for Phase-09

6. **Add error handling structure**
   - Create error types for social auth
   - Handle various error scenarios
   - Prepare for production error handling

7. **Document future implementation**
   - Add comprehensive TODO comments
   - Document OAuth flow requirements
   - List Phase-09 implementation steps

8. **Create container component**
   - Create `SocialLoginButtons.tsx`
   - Combine all three social buttons
   - Wire up click handlers
   - Export for easy integration

### Social Provider Types

```typescript
type SocialProvider = 'google' | 'facebook' | 'apple';

interface SocialAuthConfig {
  provider: SocialProvider;
  clientId: string;
  redirectUri: string;
  scope: string[];
}

interface SocialAuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  error?: string;
}
```

### Handler Code Template

```typescript
// frontend/lib/storefront/auth/socialAuth.ts

'use client';

import { toast } from 'react-hot-toast';

export type SocialProvider = 'google' | 'facebook' | 'apple';

/**
 * Handle social login button click
 * Phase-08: Shows "coming soon" notification
 * Phase-09: Will initiate OAuth flow
 */
export function handleSocialLogin(provider: SocialProvider) {
  console.log(`Social login clicked: ${provider}`);
  
  // Phase-08: Placeholder notification
  toast.info(
    `${getProviderDisplayName(provider)} login coming soon! Full OAuth integration will be added in Phase-09.`,
    { duration: 4000 }
  );
  
  // TODO Phase-09: Implement OAuth flow
  // 1. Generate OAuth URL with state parameter
  // 2. Store state in session/localStorage
  // 3. Redirect to provider OAuth page
  // 4. Handle callback in dedicated route
  // 5. Exchange code for tokens
  // 6. Create/link user account
  // 7. Establish session
  
  // Placeholder for future implementation
  // const oauthUrl = generateOAuthUrl(provider, window.location.origin + '/auth/callback');
  // window.location.href = oauthUrl;
}

/**
 * Generate OAuth URL (stub for Phase-09)
 */
export function generateOAuthUrl(
  provider: SocialProvider,
  redirectUri: string
): string {
  // TODO Phase-09: Implement actual OAuth URL generation
  const configs = {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'openid email profile'
    },
    facebook: {
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      scope: 'email public_profile'
    },
    apple: {
      authUrl: 'https://appleid.apple.com/auth/authorize',
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      scope: 'name email'
    }
  };
  
  const config = configs[provider];
  const state = generateSecureState();
  
  const params = new URLSearchParams({
    client_id: config.clientId || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: state
  });
  
  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Handle OAuth callback (stub for Phase-09)
 */
export async function handleOAuthCallback(
  provider: SocialProvider,
  code: string,
  state: string
): Promise<SocialAuthResponse> {
  // TODO Phase-09: Implement OAuth callback handling
  // 1. Verify state parameter
  // 2. Exchange code for access token
  // 3. Fetch user profile from provider
  // 4. Create or link user account in backend
  // 5. Establish session
  // 6. Redirect to intended destination
  
  console.log('OAuth callback:', { provider, code, state });
  
  return {
    success: false,
    error: 'Social authentication not yet implemented'
  };
}

/**
 * Generate secure state parameter for OAuth
 */
function generateSecureState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get display name for provider
 */
function getProviderDisplayName(provider: SocialProvider): string {
  const names = {
    google: 'Google',
    facebook: 'Facebook',
    apple: 'Apple'
  };
  return names[provider];
}

/**
 * Store OAuth state in session storage
 */
export function storeOAuthState(state: string, provider: SocialProvider) {
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', provider);
  sessionStorage.setItem('oauth_timestamp', Date.now().toString());
}

/**
 * Verify OAuth state from session storage
 */
export function verifyOAuthState(state: string): boolean {
  const storedState = sessionStorage.getItem('oauth_state');
  const timestamp = sessionStorage.getItem('oauth_timestamp');
  
  // Clear stored values
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_provider');
  sessionStorage.removeItem('oauth_timestamp');
  
  // Verify state matches and hasn't expired (5 min timeout)
  if (!storedState || storedState !== state) {
    return false;
  }
  
  if (timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age > 5 * 60 * 1000) {
      return false;
    }
  }
  
  return true;
}
```

### Social Login Buttons Container

```typescript
// frontend/components/storefront/auth/SocialLogin/SocialLoginButtons.tsx

'use client';

import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import AppleLoginButton from './AppleLoginButton';
import { handleSocialLogin } from '@/lib/storefront/auth/socialAuth';

export default function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <GoogleLoginButton 
        onClick={() => handleSocialLogin('google')} 
      />
      <FacebookLoginButton 
        onClick={() => handleSocialLogin('facebook')} 
      />
      <AppleLoginButton 
        onClick={() => handleSocialLogin('apple')} 
      />
    </div>
  );
}
```

### OAuth Flow Architecture (Phase-09)

```
User Action
    │
    ▼
Click Social Button
    │
    ▼
Generate OAuth URL
    │
    ├── State parameter
    ├── Client ID
    ├── Redirect URI
    └── Scopes
    │
    ▼
Redirect to Provider
    │
    ▼
User Authorizes
    │
    ▼
Provider Redirects Back
    │
    ├── Authorization code
    └── State parameter
    │
    ▼
Verify State
    │
    ▼
Exchange Code for Token
    │
    ▼
Fetch User Profile
    │
    ▼
Create/Link Account
    │
    ▼
Establish Session
    │
    ▼
Redirect to App
```

### Error Handling Types

```typescript
export enum SocialAuthError {
  INVALID_STATE = 'INVALID_STATE',
  TOKEN_EXCHANGE_FAILED = 'TOKEN_EXCHANGE_FAILED',
  PROFILE_FETCH_FAILED = 'PROFILE_FETCH_FAILED',
  ACCOUNT_CREATION_FAILED = 'ACCOUNT_CREATION_FAILED',
  SESSION_CREATION_FAILED = 'SESSION_CREATION_FAILED',
  PROVIDER_ERROR = 'PROVIDER_ERROR'
}

export class SocialAuthException extends Error {
  constructor(
    public code: SocialAuthError,
    message: string,
    public provider: SocialProvider
  ) {
    super(message);
    this.name = 'SocialAuthException';
  }
}
```

### Environment Variables (Phase-09)

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Google OAuth client ID | Phase-09 |
| GOOGLE_CLIENT_SECRET | Google OAuth secret (server) | Phase-09 |
| NEXT_PUBLIC_FACEBOOK_APP_ID | Facebook app ID | Phase-09 |
| FACEBOOK_APP_SECRET | Facebook app secret (server) | Phase-09 |
| NEXT_PUBLIC_APPLE_CLIENT_ID | Apple service ID | Phase-09 |
| APPLE_TEAM_ID | Apple team ID (server) | Phase-09 |
| APPLE_KEY_ID | Apple key ID (server) | Phase-09 |
| APPLE_PRIVATE_KEY | Apple private key (server) | Phase-09 |

### Integration in Auth Pages

```typescript
// In LoginPage.tsx or RegisterPage.tsx

import SocialDivider from '@/components/storefront/auth/SocialLogin/SocialDivider';
import SocialLoginButtons from '@/components/storefront/auth/SocialLogin/SocialLoginButtons';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      {/* Traditional login form */}
      <LoginForm />
      
      {/* Social login section */}
      <SocialDivider />
      <SocialLoginButtons />
    </div>
  );
}
```

### Expected Outcome
- Centralized social login handler with placeholder functionality
- Clear separation between Phase-08 placeholder and Phase-09 implementation
- Proper error handling structure
- OAuth flow architecture documented
- Container component for easy integration
- Toast notifications for user feedback

### Verification Checklist
- [ ] socialAuth.ts utility file created
- [ ] handleSocialLogin function implemented
- [ ] Toast notification shows "coming soon" message
- [ ] SocialLoginButtons container created
- [ ] All three buttons wired to handler
- [ ] Console logs provider name on click
- [ ] OAuth stub functions created
- [ ] Comprehensive TODO comments added
- [ ] Error types defined
- [ ] TypeScript types properly defined

---

## Task 88: Create Social Auth Redirect

### Overview
Create a dedicated callback route and handler for OAuth redirects from social login providers. This establishes the infrastructure for handling OAuth callbacks in Phase-09, including state verification, error handling, and proper user redirection after authentication.

### Dependencies
- Task 87: Create Social Login Handler

### Instructions

1. **Create OAuth callback route**
   - Navigate to `frontend/app/(auth)/`
   - Create directory `auth-callback/`
   - Create file `page.tsx`

2. **Import required dependencies**
   - Import React and hooks
   - Import Next.js router utilities
   - Import social auth utilities
   - Import loading components

3. **Create callback page component**
   - Define `AuthCallbackPage` component
   - Extract query parameters (code, state, error)
   - Handle OAuth callback processing
   - Show loading state during processing

4. **Implement URL parameter extraction**
   - Use Next.js searchParams
   - Extract authorization code
   - Extract state parameter
   - Extract error information if present

5. **Add state verification**
   - Verify state parameter matches stored value
   - Check state hasn't expired
   - Handle state mismatch errors
   - Clear stored state after verification

6. **Create loading UI**
   - Show spinner during processing
   - Display appropriate message
   - Match auth layout styling
   - Prevent user interaction during processing

7. **Handle OAuth errors**
   - Detect provider-returned errors
   - Show error messages to user
   - Provide option to retry
   - Redirect back to login page

8. **Add redirect logic**
   - Redirect to intended destination after success
   - Fall back to dashboard/home if no destination
   - Handle checkout flow returns
   - Store redirect URL before OAuth flow

### Callback Route Structure

```
Frontend Routes:
├── /login                    # Login page
├── /register                 # Register page
├── /auth-callback            # OAuth callback handler (THIS TASK)
│   ├── ?code=xxx&state=yyy   # Success callback
│   └── ?error=access_denied  # Error callback
└── /dashboard                # Post-login destination
```

### OAuth Callback Flow

```
Provider Redirects
    │
    ▼
/auth-callback?code=xxx&state=yyy
    │
    ▼
Extract Parameters
    │
    ├── code
    ├── state
    └── error (if any)
    │
    ▼
Verify State
    │
    ├── Match stored state
    └── Check timestamp
    │
    ▼
Phase-08: Show "Coming Soon"
Phase-09: Exchange Code
    │
    ▼
Create/Link Account
    │
    ▼
Establish Session
    │
    ▼
Redirect to Destination
```

### Callback Page Component

```typescript
// frontend/app/(auth)/auth-callback/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOAuthState, handleOAuthCallback } from '@/lib/storefront/auth/socialAuth';
import type { SocialProvider } from '@/lib/storefront/auth/socialAuth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleCallback();
  }, [searchParams]);

  async function handleCallback() {
    try {
      // Extract parameters from URL
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check for provider errors
      if (error) {
        setStatus('error');
        setMessage(
          errorDescription || 
          getErrorMessage(error)
        );
        
        // Redirect to login after showing error
        setTimeout(() => {
          router.push('/login?error=social_auth_failed');
        }, 3000);
        return;
      }

      // Verify required parameters
      if (!code || !state) {
        setStatus('error');
        setMessage('Invalid callback parameters');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      // Verify state parameter
      const isValidState = verifyOAuthState(state);
      if (!isValidState) {
        setStatus('error');
        setMessage('Invalid or expired authentication request');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      // Get provider from session storage
      const provider = sessionStorage.getItem('oauth_provider') as SocialProvider;
      if (!provider) {
        setStatus('error');
        setMessage('Authentication provider not found');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      // Phase-08: Show placeholder message
      setStatus('success');
      setMessage(
        'Social authentication callback received! ' +
        'Full OAuth implementation will be completed in Phase-09.'
      );
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

      // TODO Phase-09: Exchange code for tokens
      // const result = await handleOAuthCallback(provider, code, state);
      // 
      // if (result.success) {
      //   setStatus('success');
      //   setMessage('Authentication successful!');
      //   
      //   // Get intended destination or default to dashboard
      //   const redirectTo = sessionStorage.getItem('auth_redirect') || '/customer/dashboard';
      //   sessionStorage.removeItem('auth_redirect');
      //   
      //   setTimeout(() => {
      //     router.push(redirectTo);
      //   }, 1500);
      // } else {
      //   throw new Error(result.error || 'Authentication failed');
      // }

    } catch (err) {
      console.error('Auth callback error:', err);
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      
      setTimeout(() => {
        router.push('/login?error=auth_callback_failed');
      }, 3000);
    }
  }

  function getErrorMessage(error: string): string {
    const messages: Record<string, string> = {
      'access_denied': 'You denied access to your account',
      'unauthorized_client': 'Application not authorized',
      'invalid_scope': 'Invalid permissions requested',
      'server_error': 'Provider server error occurred'
    };
    
    return messages[error] || 'Authentication failed';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Loading Spinner */}
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-medium">{message}</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-medium">Authentication Failed</p>
            <p className="text-sm text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### URL Parameters Handling

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| code | string | Authorization code from provider | Yes (success) |
| state | string | CSRF protection token | Yes |
| error | string | Error code from provider | No (on error) |
| error_description | string | Human-readable error | No |

### State Verification Process

| Step | Action | Purpose |
|------|--------|---------|
| 1. Retrieve | Get state from sessionStorage | Match callback state |
| 2. Compare | Check state parameter matches | CSRF protection |
| 3. Timestamp | Verify request is recent | Prevent replay attacks |
| 4. Clear | Remove stored state | Single use only |

### Error Codes from Providers

| Error Code | Description | User Action |
|------------|-------------|-------------|
| access_denied | User denied permission | Try again or use email |
| unauthorized_client | App not authorized | Contact support |
| invalid_scope | Invalid permissions | Contact support |
| server_error | Provider server issue | Try again later |
| temporarily_unavailable | Provider down | Try again later |

### Redirect URL Storage

```typescript
// Before initiating OAuth flow (in login/register page)

// Store intended destination
const redirectTo = searchParams.get('redirect') || '/customer/dashboard';
sessionStorage.setItem('auth_redirect', redirectTo);

// Store for checkout flow
if (isCheckoutFlow) {
  sessionStorage.setItem('auth_redirect', '/checkout');
}

// Initiate OAuth flow
handleSocialLogin('google');
```

### Loading States UI

```
┌────────────────────────────────────┐
│                                    │
│          [Spinner Animation]        │
│                                    │
│    Processing authentication...     │
│                                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│                                    │
│          [Checkmark Icon]          │
│                                    │
│    Authentication successful!       │
│         Redirecting...             │
│                                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│                                    │
│            [X Icon]                │
│                                    │
│      Authentication Failed         │
│      You denied access             │
│    Redirecting to login...         │
│                                    │
└────────────────────────────────────┘
```

### Metadata Configuration

```typescript
// frontend/app/(auth)/auth-callback/page.tsx

export const metadata = {
  title: 'Authenticating | LankaCommerce Cloud',
  description: 'Processing your authentication request',
  robots: 'noindex, nofollow' // Don't index callback page
};
```

### Integration with OAuth Flow

```typescript
// Update handleSocialLogin in socialAuth.ts (Phase-09)

export function handleSocialLogin(provider: SocialProvider) {
  // Generate state
  const state = generateSecureState();
  
  // Store state and provider
  storeOAuthState(state, provider);
  
  // Generate OAuth URL with callback
  const callbackUrl = `${window.location.origin}/auth-callback`;
  const oauthUrl = generateOAuthUrl(provider, callbackUrl);
  
  // Redirect to provider
  window.location.href = oauthUrl;
}
```

### Expected Outcome
- Dedicated OAuth callback route at `/auth-callback`
- Proper parameter extraction and validation
- State verification for security
- Loading, success, and error states
- Automatic redirection after processing
- Foundation for Phase-09 OAuth implementation

### Verification Checklist
- [ ] Callback route created at `/auth-callback`
- [ ] URL parameters extracted correctly
- [ ] State verification implemented
- [ ] Error handling for all scenarios
- [ ] Loading spinner displays during processing
- [ ] Success state shows checkmark
- [ ] Error state shows X icon
- [ ] Redirects work properly
- [ ] Console logs show callback details
- [ ] Phase-09 TODO comments added
- [ ] Metadata configured correctly
- [ ] No indexing by search engines

---

## Summary

### Completed Components

| Component | File | Purpose |
|-----------|------|---------|
| SocialDivider | `SocialDivider.tsx` | "Or continue with" separator |
| GoogleLoginButton | `GoogleLoginButton.tsx` | Google OAuth button |
| FacebookLoginButton | `FacebookLoginButton.tsx` | Facebook OAuth button |
| AppleLoginButton | `AppleLoginButton.tsx` | Apple OAuth button |
| Social Auth Utils | `socialAuth.ts` | Handler logic and OAuth stubs |
| Callback Page | `auth-callback/page.tsx` | OAuth redirect handler |

### File Structure

```
frontend/
├── app/
│   └── (auth)/
│       └── auth-callback/
│           └── page.tsx                    # Task 88
├── components/
│   └── storefront/
│       └── auth/
│           └── SocialLogin/
│               ├── SocialDivider.tsx        # Task 83
│               ├── GoogleLoginButton.tsx    # Task 84
│               ├── FacebookLoginButton.tsx  # Task 85
│               ├── AppleLoginButton.tsx     # Task 86
│               ├── SocialLoginButtons.tsx   # Task 87
│               └── index.ts
├── lib/
│   └── storefront/
│       └── auth/
│           └── socialAuth.ts                # Task 87
└── public/
    └── icons/
        └── social/
            ├── google.svg
            ├── facebook.svg
            └── apple.svg
```

### Integration Points

| Page | Integration | Components Used |
|------|-------------|-----------------|
| Login | Social login section | SocialDivider, SocialLoginButtons |
| Register | Social registration | SocialDivider, SocialLoginButtons |
| Callback | OAuth handling | AuthCallbackPage |

### Phase-09 Implementation Checklist

- [ ] Set up OAuth apps with Google, Facebook, Apple
- [ ] Configure environment variables with client IDs and secrets
- [ ] Implement server-side token exchange
- [ ] Create backend API endpoints for social auth
- [ ] Implement user account creation/linking logic
- [ ] Add session establishment after OAuth
- [ ] Test complete OAuth flow end-to-end
- [ ] Handle edge cases (existing accounts, email conflicts)
- [ ] Add proper error handling and logging
- [ ] Update documentation with OAuth setup instructions

### Testing Recommendations

| Test Case | Expected Behavior |
|-----------|-------------------|
| Click Google button | Shows "coming soon" toast |
| Click Facebook button | Shows "coming soon" toast |
| Click Apple button | Shows "coming soon" toast |
| Visit callback with params | Shows processing message |
| Callback with error | Shows error message |
| Invalid state parameter | Shows security error |
| Mobile responsive | All buttons display correctly |
| Keyboard navigation | All buttons accessible via Tab |
| Screen reader | Buttons announced correctly |

### Next Steps

1. **Complete This SubPhase**
   - Create auth error toast component (Task 89)
   - Perform comprehensive testing (Tasks 90-94)

2. **Prepare for Phase-09**
   - Set up developer accounts with OAuth providers
   - Review OAuth documentation for each provider
   - Plan backend API structure for social auth

3. **Production Considerations**
   - Secure storage of OAuth secrets
   - Rate limiting for OAuth endpoints
   - Monitoring and analytics for social login usage
   - User privacy and data handling compliance

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-94_Testing-Verification.md](02_Tasks-89-94_Testing-Verification.md)

---

*End of Document*
