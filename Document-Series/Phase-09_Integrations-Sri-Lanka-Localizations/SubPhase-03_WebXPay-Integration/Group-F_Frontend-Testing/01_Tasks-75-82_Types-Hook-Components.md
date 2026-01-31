# WebXPay Frontend Testing - Types, Hooks & Components

**Document:** 01 of 02 - Group F: Frontend Testing  
**Tasks:** 75-82 (Types, Hooks, and Components)  
**Phase:** 09 - Integrations Sri Lanka Localizations  
**SubPhase:** 03 - WebXPay Integration  

## Navigation

**Previous Group:** [← Group-E Verification & Refunds](../Group-E_Verification-Refunds/02_Tasks-67-74_Testing-Cancel-Store.md)  
**Next Document:** [→ Tasks 83-88: Testing & Documentation](02_Tasks-83-88_Testing-Switch-Documentation.md)  
**SubPhase Index:** [↑ WebXPay Integration](../00_SUBPHASES_SUMMARY.md)  
**Phase Index:** [↑ Sri Lanka Localizations](../../00_SUBPHASES_SUMMARY.md)

## Document Overview

This document covers the frontend implementation of WebXPay integration for the POS system's webstore. It focuses on creating TypeScript types, React hooks, and UI components that provide a seamless payment experience for customers using WebXPay's QR code and redirect-based payment methods.

### Task Distribution
- **Tasks 75-82:** Frontend types, hooks, and components (This Document)
- **Tasks 83-88:** Testing, payment method switching, and documentation (Next Document)

### Technology Stack
- **Frontend:** Next.js 14+ App Router, React 18+
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS, Shadcn/UI
- **State Management:** TanStack Query (React Query)
- **QR Codes:** qrcode library
- **Payment Flow:** Server Actions, Webhooks

---

## Task 75: Create WebXPay TypeScript Types

### Objective
Create comprehensive TypeScript type definitions for WebXPay API requests, responses, and frontend state management.

### Implementation Requirements

#### Core API Types
1. **Payment Request Types**
   - Payment initialization request structure
   - Merchant authentication parameters
   - Order details and line items
   - Customer information structure
   - Callback URL configurations

2. **Payment Response Types**
   - Payment session response format
   - QR code data structure
   - Redirect URL information
   - Transaction reference details
   - Payment status enumeration

3. **Webhook Types**
   - Payment completion notification
   - Payment failure notification
   - Refund notification structure
   - Status change events

#### Frontend State Types
1. **Payment Flow States**
   - Payment initialization states
   - QR code display states
   - Payment pending states
   - Success/failure states
   - Loading and error states

2. **Component Props Types**
   - Payment button component props
   - QR display component props
   - Payment form component props
   - Payment status component props

3. **Hook Return Types**
   - useWebXPayPayment hook return type
   - Payment mutation result types
   - Payment status query types

### File Structure
```
frontend/types/payments/
├── webxpay/
│   ├── index.ts
│   ├── api.ts
│   ├── components.ts
│   └── hooks.ts
```

### Type Safety Considerations
- Strict null checking compliance
- Discriminated unions for payment states
- Generic types for reusable patterns
- Branded types for sensitive data
- Runtime type validation integration

---

## Task 76: Create WebXPay API Client

### Objective
Implement a frontend API client that interfaces with the backend WebXPay endpoints using modern React patterns and error handling.

### Implementation Requirements

#### Client Configuration
1. **Base Configuration**
   - API endpoint configuration
   - Request/response interceptors
   - Authentication header handling
   - Error transformation middleware
   - Retry logic for network failures

2. **Environment Management**
   - Development vs production endpoints
   - API key configuration
   - Webhook URL configuration
   - Debug mode settings

#### API Methods
1. **Payment Operations**
   - Initialize payment session
   - Get payment status
   - Cancel active payment
   - Retrieve payment history
   - Handle payment callbacks

2. **QR Code Operations**
   - Generate QR code for payment
   - Refresh QR code data
   - Validate QR code status
   - Handle QR code expiration

3. **Redirect Operations**
   - Generate redirect URLs
   - Handle redirect callbacks
   - Process return parameters
   - Validate redirect signatures

### Client Architecture
```
frontend/lib/api/webxpay/
├── client.ts (main client class)
├── endpoints.ts (API endpoints)
├── types.ts (client-specific types)
└── utils.ts (helper functions)
```

### Integration Features
- TanStack Query integration
- Automatic request deduplication
- Response caching strategies
- Real-time payment status updates
- Error boundary integration

---

## Task 77: Create useWebXPayPayment Hook

### Objective
Create a comprehensive React hook that manages WebXPay payment flow state, API calls, and side effects.

### Implementation Requirements

#### Hook Interface
1. **Input Parameters**
   - Payment amount and currency
   - Order details and line items
   - Customer information
   - Callback configuration
   - Payment method preferences

2. **Return Object**
   - Payment state (idle, loading, success, error)
   - Payment session data
   - QR code information
   - Payment actions (initiate, cancel, retry)
   - Error handling functions

#### State Management
1. **Payment Lifecycle**
   - Payment initialization
   - QR code generation
   - Payment monitoring
   - Success/failure handling
   - Cleanup on unmount

2. **Real-time Updates**
   - WebSocket connection for status updates
   - Polling for payment status
   - Automatic refresh handling
   - Connection recovery logic

3. **Error Management**
   - Network error handling
   - Payment failure scenarios
   - Timeout management
   - User-friendly error messages

### Hook Implementation Structure
```typescript
interface UseWebXPayPaymentProps {
  amount: number;
  currency: string;
  orderDetails: OrderDetails;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: PaymentError) => void;
}

interface UseWebXPayPaymentReturn {
  // State
  paymentState: PaymentState;
  paymentSession: PaymentSession | null;
  qrCodeData: QRCodeData | null;
  isLoading: boolean;
  error: PaymentError | null;
  
  // Actions
  initiatePayment: () => Promise<void>;
  cancelPayment: () => Promise<void>;
  retryPayment: () => Promise<void>;
  clearError: () => void;
}
```

### Integration Points
- Server Actions for backend communication
- TanStack Query for caching and synchronization
- React Router for navigation
- Context API for global payment state

---

## Task 78: Create QR Display Component

### Objective
Build a responsive QR code display component that shows WebXPay payment QR codes with proper styling and user experience enhancements.

### Implementation Requirements

#### Component Features
1. **QR Code Display**
   - High-resolution QR code rendering
   - Responsive sizing for mobile/desktop
   - Dark/light mode support
   - Print-friendly styling
   - Accessibility compliance

2. **User Experience**
   - Loading skeleton while generating
   - Auto-refresh on expiration
   - Copy QR code data functionality
   - Download QR code as image
   - Mobile-optimized display

3. **Status Indicators**
   - QR code validity timer
   - Payment pending indicator
   - Success/failure status overlay
   - Network connection status
   - Refresh button availability

#### Technical Implementation
1. **QR Code Generation**
   - Use qrcode library for generation
   - Configurable error correction
   - Custom styling options
   - SVG output for scalability
   - Base64 fallback support

2. **Component Architecture**
   - Compound component pattern
   - Customizable styling props
   - Event handling callbacks
   - Animation support
   - Theme integration

### Component Structure
```
components/payments/webxpay/
├── QRDisplay/
│   ├── index.tsx
│   ├── QRCode.tsx
│   ├── StatusIndicator.tsx
│   ├── RefreshButton.tsx
│   └── styles.module.css
```

### Accessibility Features
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus management
- Alternative text descriptions

---

## Task 79: Create Payment Redirect Handler

### Objective
Implement components and utilities to handle WebXPay payment redirects, including success and failure scenarios.

### Implementation Requirements

#### Redirect Flow Management
1. **URL Parameter Processing**
   - Extract payment reference from URL
   - Parse status parameters
   - Validate redirect signatures
   - Handle malformed URLs
   - Security parameter verification

2. **State Synchronization**
   - Update payment status in store
   - Sync with backend verification
   - Handle race conditions
   - Manage concurrent requests
   - Cache invalidation strategies

3. **Navigation Logic**
   - Redirect to appropriate pages
   - Handle browser back button
   - Prevent duplicate processing
   - Manage loading states
   - Error page routing

#### Component Implementation
1. **RedirectHandler Component**
   - URL parameter extraction
   - Payment status verification
   - Loading state management
   - Error boundary integration
   - Navigation coordination

2. **PaymentVerification Component**
   - Backend verification calls
   - Status polling logic
   - Timeout handling
   - Retry mechanisms
   - User feedback display

### Implementation Structure
```
components/payments/webxpay/redirect/
├── RedirectHandler.tsx
├── PaymentVerification.tsx
├── RedirectLoading.tsx
└── RedirectError.tsx
```

### Security Considerations
- Signature validation for all redirects
- CSRF protection for status updates
- Rate limiting for verification calls
- Input sanitization
- Secure parameter handling

---

## Task 80: Create WebXPay Button Components

### Objective
Develop a set of payment button components for WebXPay integration with consistent styling, loading states, and accessibility features.

### Implementation Requirements

#### Button Component Variants
1. **Primary Payment Button**
   - Prominent call-to-action styling
   - WebXPay branding integration
   - Loading spinner animation
   - Disabled state handling
   - Success/error state feedback

2. **QR Code Payment Button**
   - Mobile-optimized design
   - QR code icon integration
   - Quick payment flow trigger
   - Responsive sizing
   - Touch-friendly interactions

3. **Redirect Payment Button**
   - External link indication
   - Security badge display
   - Processing state management
   - Return flow preparation
   - User confirmation dialog

#### Shared Button Features
1. **Visual Design**
   - Consistent with WebXPay branding
   - Shadcn/UI component integration
   - Tailwind CSS styling
   - Dark/light theme support
   - Custom variant support

2. **Interaction States**
   - Hover and focus animations
   - Pressed state feedback
   - Loading state with spinner
   - Success confirmation
   - Error state indication

3. **Accessibility**
   - WCAG 2.1 AA compliance
   - Screen reader optimization
   - Keyboard navigation
   - Focus trap management
   - ARIA state announcements

### Component Architecture
```
components/ui/payment-buttons/
├── WebXPayButton/
│   ├── index.tsx
│   ├── PrimaryButton.tsx
│   ├── QRButton.tsx
│   ├── RedirectButton.tsx
│   └── ButtonBase.tsx
```

### Integration Features
- Form integration support
- Validation state handling
- Analytics event tracking
- A/B testing compatibility
- Performance monitoring

---

## Task 81: Create Payment Success Page

### Objective
Build a comprehensive payment success page that provides clear confirmation, receipt details, and next steps for completed WebXPay transactions.

### Implementation Requirements

#### Page Structure
1. **Success Confirmation**
   - Clear success messaging
   - WebXPay transaction reference
   - Payment amount confirmation
   - Timestamp display
   - Visual success indicators

2. **Transaction Details**
   - Order summary display
   - Payment method confirmation
   - Customer information
   - Merchant reference
   - Receipt download option

3. **Next Steps Section**
   - Order tracking information
   - Account dashboard links
   - Continue shopping options
   - Support contact information
   - Feedback collection form

#### Technical Implementation
1. **Page Components**
   - SuccessHero component
   - TransactionSummary component
   - ReceiptDisplay component
   - NextSteps component
   - SupportLinks component

2. **Data Management**
   - Transaction data retrieval
   - Customer information display
   - Order status integration
   - Receipt generation
   - Print functionality

### Page Layout Structure
```
app/payments/webxpay/success/
├── page.tsx
├── components/
│   ├── SuccessHero.tsx
│   ├── TransactionSummary.tsx
│   ├── ReceiptDisplay.tsx
│   ├── NextSteps.tsx
│   └── SupportLinks.tsx
└── loading.tsx
```

### User Experience Features
- Automatic receipt email sending
- Social sharing capabilities
- Print-optimized layout
- Mobile-responsive design
- SEO optimization for success pages

---

## Task 82: Create Payment Cancel Page

### Objective
Implement a payment cancellation page that handles cancelled WebXPay transactions with clear messaging and recovery options.

### Implementation Requirements

#### Page Components
1. **Cancellation Confirmation**
   - Clear cancellation messaging
   - Reason for cancellation (if available)
   - Original payment attempt details
   - Cancellation timestamp
   - Reference number display

2. **Recovery Options**
   - Retry payment button
   - Alternative payment methods
   - Cart preservation notice
   - Support contact options
   - FAQ links for payment issues

3. **User Guidance**
   - Next steps recommendations
   - Payment troubleshooting tips
   - Alternative checkout options
   - Customer service integration
   - Feedback collection

#### Technical Implementation
1. **Page Structure**
   - CancelHero component
   - CancellationDetails component
   - RecoveryOptions component
   - TroubleshootingHelp component
   - AlternativePayments component

2. **State Management**
   - Cart state preservation
   - Payment attempt tracking
   - User session management
   - Analytics event logging
   - Error reporting integration

### Page Architecture
```
app/payments/webxpay/cancel/
├── page.tsx
├── components/
│   ├── CancelHero.tsx
│   ├── CancellationDetails.tsx
│   ├── RecoveryOptions.tsx
│   ├── TroubleshootingHelp.tsx
│   └── AlternativePayments.tsx
└── loading.tsx
```

### User Experience Considerations
- Empathetic messaging tone
- Clear action buttons
- Minimal friction for retry
- Comprehensive help resources
- Seamless navigation back to checkout

---

## Implementation Workflow

### Development Phases

#### Phase 1: Foundation (Tasks 75-76)
1. Set up TypeScript types structure
2. Implement base API client
3. Configure development environment
4. Establish testing framework
5. Create documentation templates

#### Phase 2: Core Components (Tasks 77-78)
1. Develop payment hook
2. Implement QR display component
3. Add real-time status updates
4. Integrate with backend APIs
5. Test payment flow scenarios

#### Phase 3: User Interface (Tasks 79-82)
1. Build redirect handlers
2. Create payment buttons
3. Develop success/cancel pages
4. Implement user feedback
5. Optimize mobile experience

### Testing Strategy
- Unit tests for all components
- Integration tests for payment flows
- E2E tests for complete user journeys
- Accessibility testing compliance
- Performance testing for QR generation

### Quality Assurance
- TypeScript strict mode compliance
- ESLint and Prettier configuration
- Component documentation
- Storybook integration
- Visual regression testing

---

## Dependencies and Prerequisites

### Required Dependencies
- Next.js 14+ with App Router
- React 18+ with TypeScript
- TanStack Query for state management
- qrcode library for QR generation
- Shadcn/UI component library
- Tailwind CSS for styling

### Backend Dependencies
- WebXPay API integration completed
- Payment webhook handlers active
- Database models for payment tracking
- Authentication system integration
- Order management system ready

### Development Tools
- VS Code with TypeScript support
- React Developer Tools
- TanStack Query DevTools
- Tailwind CSS IntelliSense
- ESLint and Prettier integration

---

## Configuration Requirements

### Environment Variables
```env
NEXT_PUBLIC_WEBXPAY_API_URL=
NEXT_PUBLIC_WEBXPAY_MERCHANT_ID=
WEBXPAY_API_KEY=
WEBXPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=
```

### Next.js Configuration
- App Router configuration
- TypeScript strict mode
- Tailwind CSS setup
- API route configuration
- Middleware for redirects

### Build Configuration
- Bundle optimization for QR code library
- Code splitting for payment components
- Static asset optimization
- Server Action configuration
- Edge runtime compatibility

---

## Next Steps

This document establishes the foundation for WebXPay frontend integration. The implementation creates a comprehensive payment experience with:

- **Type-safe development** with comprehensive TypeScript types
- **Robust API integration** with error handling and retries
- **Intuitive user interface** with responsive QR codes and buttons
- **Seamless payment flow** from initiation to completion
- **Comprehensive error handling** with recovery options

**Next Document:** [Tasks 83-88: Testing & Documentation](02_Tasks-83-88_Testing-Switch-Documentation.md) will cover comprehensive testing strategies, payment method switching capabilities, and complete documentation.

The frontend implementation provides customers with a smooth, secure, and intuitive WebXPay payment experience while maintaining consistency with the overall POS system design and user experience standards.