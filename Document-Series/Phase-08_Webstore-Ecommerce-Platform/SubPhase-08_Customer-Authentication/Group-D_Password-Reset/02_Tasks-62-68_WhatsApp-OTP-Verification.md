# Tasks 62-68: WhatsApp OTP Verification & Password Reset

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** D - Password Reset  
> **Document:** 02 of 02  
> **Tasks Covered:** 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-61_Email-Reset-Flow.md](01_Tasks-53-61_Email-Reset-Flow.md)

---

## Document Overview

This document covers the WhatsApp OTP verification process and complete password reset flow. It includes WhatsApp OTP option rendering, sending OTP via WhatsApp API, creating OTP input component with 6 digits, OTP verification API integration, OTP expiry handling with countdowns, resend OTP functionality, and complete password reset flow verification including both email and WhatsApp OTP methods.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 62 | WhatsApp OTP Option | Medium | 35 min |
| 63 | Send OTP Via WhatsApp API | High | 45 min |
| 64 | OTP Input Component | Medium | 40 min |
| 65 | Verify OTP API | High | 45 min |
| 66 | OTP Expiry Handling | Medium | 35 min |
| 67 | Resend OTP | Medium | 30 min |
| 68 | Verify Password Reset Flow | Low | 30 min |

---

## Task 62: WhatsApp OTP Option

### Overview
Create the WhatsApp OTP option component that displays when user requests password reset via phone number. This component shows the WhatsApp verification method option with an icon, explanation text, and confirmation to proceed with WhatsApp OTP instead of email link.

### Dependencies
- Task 61: Email Sent Message created
- Task 57: Reset Request API returns phone number detection
- Phone number format validation from Task 55

### Instructions

1. **Create WhatsAppOTPOption component**
   - Location: `frontend/components/storefront/auth/ForgotPassword/WhatsAppOTPOption.tsx`
   - Displays WhatsApp verification option
   - Shows explanation of OTP process

2. **Import dependencies**
```tsx
'use client';

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
```

3. **Define component props**
```tsx
interface WhatsAppOTPOptionProps {
  phoneNumber: string;
  onSendOTP: () => Promise<void>;
  isLoading?: boolean;
}
```

4. **Create component structure**
```tsx
export function WhatsAppOTPOption({
  phoneNumber,
  onSendOTP,
  isLoading = false,
}: WhatsAppOTPOptionProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    try {
      setError(null);
      await onSendOTP();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  return (
    <div className="space-y-4">
      {/* WhatsApp icon and title */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <FaWhatsapp className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          WhatsApp Verification
        </h2>
      </div>

      {/* Explanation */}
      <Alert>
        <AlertDescription>
          We'll send a 6-digit verification code to your WhatsApp number{' '}
          <span className="font-semibold">{phoneNumber}</span>. Enter the code
          to reset your password.
        </AlertDescription>
      </Alert>

      {/* Instructions */}
      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-medium">How it works:</p>
        <ol className="list-decimal list-inside space-y-1 pl-2">
          <li>Click "Send Code" to receive OTP via WhatsApp</li>
          <li>Check your WhatsApp messages</li>
          <li>Enter the 6-digit code on the next screen</li>
          <li>Create your new password</li>
        </ol>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Send OTP button */}
      <Button
        onClick={handleSendOTP}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Sending Code...
          </>
        ) : (
          <>
            <FaWhatsapp className="mr-2" />
            Send Code via WhatsApp
          </>
        )}
      </Button>
    </div>
  );
}
```

5. **Add styling considerations**
   - Green color scheme matching WhatsApp branding
   - Clear visual hierarchy
   - Responsive design for mobile
   - Loading states for button

6. **Update index.ts**
```tsx
// frontend/components/storefront/auth/ForgotPassword/index.ts
export { ForgotPasswordPage } from './ForgotPasswordPage';
export { ForgotPasswordForm } from './ForgotPasswordForm';
export { EmailSentMessage } from './EmailSentMessage';
export { WhatsAppOTPOption } from './WhatsAppOTPOption';
```

### Component Layout

```
┌─────────────────────────────────┐
│     [WhatsApp Icon - Green]     │
│   WhatsApp Verification         │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ℹ️ Alert: We'll send    │   │
│  │ code to +94 XX XXX XXXX │   │
│  └─────────────────────────┘   │
│                                 │
│  How it works:                  │
│  1. Click "Send Code"...        │
│  2. Check WhatsApp...           │
│  3. Enter 6-digit code...       │
│  4. Create new password...      │
│                                 │
│  ┌─────────────────────────┐   │
│  │  📱 Send Code via       │   │
│  │     WhatsApp            │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `phoneNumber` | `string` | Yes | Formatted phone number to display |
| `onSendOTP` | `() => Promise<void>` | Yes | Callback to send OTP |
| `isLoading` | `boolean` | No | Loading state for button |

### Expected Outcome
- WhatsApp OTP option component created
- Green WhatsApp-themed UI
- Clear instructions for users
- Error handling for OTP send failures

### Verification Checklist
- [ ] Component file created in correct location
- [ ] WhatsApp icon and branding displayed
- [ ] Phone number shown with proper formatting
- [ ] Instructions are clear and numbered
- [ ] Loading state works on button
- [ ] Error messages display correctly
- [ ] Exported in index.ts

---

## Task 63: Send OTP Via WhatsApp API

### Overview
Create the WhatsApp OTP service that sends 6-digit OTP codes via WhatsApp Business API. This includes OTP generation, storage with expiry, WhatsApp message template, and API integration with WhatsApp Business Platform.

### Dependencies
- Task 62: WhatsApp OTP Option component created
- WhatsApp Business API credentials configured
- Backend API endpoint for OTP generation

### Instructions

1. **Create OTP service file**
   - Location: `frontend/services/storefront/auth/otpService.ts`
   - Handles OTP generation, sending, and verification
   - Manages OTP expiry and resend logic

2. **Define OTP types**
```tsx
// frontend/types/auth/otp.ts
export interface OTPRequest {
  phoneNumber: string;
  method: 'whatsapp' | 'sms';
}

export interface OTPResponse {
  success: boolean;
  message: string;
  otpId: string;
  expiresAt: string;
  resendAvailableAt: string;
}

export interface OTPVerification {
  otpId: string;
  code: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface ResendOTPRequest {
  otpId: string;
  phoneNumber: string;
}
```

3. **Create OTP service**
```tsx
// frontend/services/storefront/auth/otpService.ts
import axios from 'axios';
import type {
  OTPRequest,
  OTPResponse,
  OTPVerification,
  OTPVerificationResponse,
  ResendOTPRequest,
} from '@/types/auth/otp';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class OTPService {
  /**
   * Send OTP via WhatsApp
   */
  async sendWhatsAppOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      const response = await axios.post<OTPResponse>(
        `${API_BASE_URL}/api/auth/send-otp`,
        {
          phoneNumber,
          method: 'whatsapp',
        } as OTPRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to send OTP via WhatsApp'
        );
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(
    otpId: string,
    code: string
  ): Promise<OTPVerificationResponse> {
    try {
      const response = await axios.post<OTPVerificationResponse>(
        `${API_BASE_URL}/api/auth/verify-otp`,
        {
          otpId,
          code,
        } as OTPVerification,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Invalid or expired OTP code'
        );
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(otpId: string, phoneNumber: string): Promise<OTPResponse> {
    try {
      const response = await axios.post<OTPResponse>(
        `${API_BASE_URL}/api/auth/resend-otp`,
        {
          otpId,
          phoneNumber,
        } as ResendOTPRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to resend OTP'
        );
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Check if resend is available
   */
  canResendOTP(resendAvailableAt: string): boolean {
    return new Date(resendAvailableAt) <= new Date();
  }

  /**
   * Calculate remaining time until resend is available
   */
  getResendCountdown(resendAvailableAt: string): number {
    const now = new Date().getTime();
    const availableAt = new Date(resendAvailableAt).getTime();
    const diff = availableAt - now;
    return Math.max(0, Math.ceil(diff / 1000)); // Return seconds
  }

  /**
   * Check if OTP is expired
   */
  isOTPExpired(expiresAt: string): boolean {
    return new Date(expiresAt) <= new Date();
  }

  /**
   * Get remaining time until OTP expires
   */
  getOTPExpiryCountdown(expiresAt: string): number {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    return Math.max(0, Math.ceil(diff / 1000)); // Return seconds
  }

  /**
   * Format countdown time as MM:SS
   */
  formatCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export const otpService = new OTPService();
```

4. **Create backend API endpoint structure**
```python
# backend/apps/storefront/auth/views/otp.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import random
import string

# WhatsApp Business API configuration
WHATSAPP_API_URL = settings.WHATSAPP_API_URL
WHATSAPP_ACCESS_TOKEN = settings.WHATSAPP_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID = settings.WHATSAPP_PHONE_NUMBER_ID

@api_view(['POST'])
def send_otp(request):
    """Send OTP via WhatsApp"""
    phone_number = request.data.get('phoneNumber')
    method = request.data.get('method', 'whatsapp')
    
    # Validate phone number
    if not phone_number:
        return Response(
            {'message': 'Phone number is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate 6-digit OTP
    otp_code = ''.join(random.choices(string.digits, k=6))
    
    # Calculate expiry times
    expires_at = timezone.now() + timedelta(minutes=10)
    resend_available_at = timezone.now() + timedelta(seconds=60)
    
    # Store OTP in database
    otp_instance = OTP.objects.create(
        phone_number=phone_number,
        code=otp_code,
        expires_at=expires_at,
        resend_available_at=resend_available_at,
        method=method
    )
    
    # Send via WhatsApp
    if method == 'whatsapp':
        send_whatsapp_message(phone_number, otp_code)
    
    return Response({
        'success': True,
        'message': 'OTP sent successfully',
        'otpId': str(otp_instance.id),
        'expiresAt': expires_at.isoformat(),
        'resendAvailableAt': resend_available_at.isoformat()
    })

@api_view(['POST'])
def verify_otp(request):
    """Verify OTP code"""
    otp_id = request.data.get('otpId')
    code = request.data.get('code')
    
    try:
        otp_instance = OTP.objects.get(id=otp_id)
        
        # Check if expired
        if timezone.now() > otp_instance.expires_at:
            return Response(
                {'message': 'OTP has expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already used
        if otp_instance.is_verified:
            return Response(
                {'message': 'OTP already used'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify code
        if otp_instance.code != code:
            otp_instance.attempts += 1
            otp_instance.save()
            
            if otp_instance.attempts >= 3:
                return Response(
                    {'message': 'Too many failed attempts. Please request a new OTP.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(
                {'message': 'Invalid OTP code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark as verified
        otp_instance.is_verified = True
        otp_instance.verified_at = timezone.now()
        otp_instance.save()
        
        # Generate reset token
        reset_token = generate_password_reset_token(otp_instance.phone_number)
        
        return Response({
            'success': True,
            'message': 'OTP verified successfully',
            'resetToken': reset_token
        })
        
    except OTP.DoesNotExist:
        return Response(
            {'message': 'Invalid OTP ID'},
            status=status.HTTP_404_NOT_FOUND
        )

def send_whatsapp_message(phone_number: str, otp_code: str):
    """Send WhatsApp message using Business API"""
    import requests
    
    headers = {
        'Authorization': f'Bearer {WHATSAPP_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    # Format phone number (remove +, spaces, etc.)
    formatted_number = phone_number.replace('+', '').replace(' ', '')
    
    payload = {
        'messaging_product': 'whatsapp',
        'to': formatted_number,
        'type': 'template',
        'template': {
            'name': 'password_reset_otp',
            'language': {
                'code': 'en'
            },
            'components': [
                {
                    'type': 'body',
                    'parameters': [
                        {
                            'type': 'text',
                            'text': otp_code
                        }
                    ]
                }
            ]
        }
    }
    
    response = requests.post(
        f'{WHATSAPP_API_URL}/{WHATSAPP_PHONE_NUMBER_ID}/messages',
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        raise Exception('Failed to send WhatsApp message')
```

5. **WhatsApp message template example**
```
LankaCommerce Cloud Password Reset

Your verification code is: {{1}}

This code expires in 10 minutes.

Do not share this code with anyone.
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/send-otp` | POST | Send OTP via WhatsApp |
| `/api/auth/verify-otp` | POST | Verify OTP code |
| `/api/auth/resend-otp` | POST | Resend OTP code |

### OTP Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Code Length | 6 digits | Standard OTP length |
| Expiry Time | 10 minutes | OTP validity period |
| Resend Delay | 60 seconds | Wait time before resend |
| Max Attempts | 3 | Failed verification limit |

### Expected Outcome
- OTP service created with all methods
- WhatsApp API integration working
- OTP generation and storage implemented
- Expiry and resend logic configured

### Verification Checklist
- [ ] OTP service file created
- [ ] Type definitions added
- [ ] Send OTP method implemented
- [ ] Verify OTP method implemented
- [ ] Resend OTP method implemented
- [ ] Countdown helpers created
- [ ] Backend API endpoints defined
- [ ] WhatsApp Business API integrated
- [ ] Error handling implemented

---

## Task 64: OTP Input Component

### Overview
Create a 6-digit OTP input component with individual input boxes for each digit. The component includes auto-focus progression, paste support, backspace handling, and visual feedback for valid/invalid codes.

### Dependencies
- Task 63: Send OTP API created
- Task 62: WhatsApp OTP option component created

### Instructions

1. **Create OTP Input component**
   - Location: `frontend/components/storefront/auth/ForgotPassword/OTPInput.tsx`
   - Six individual input boxes
   - Auto-focus and navigation

2. **Import dependencies**
```tsx
'use client';

import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend: () => void;
  isVerifying?: boolean;
  error?: string | null;
  resendCountdown?: number;
  expiryCountdown?: number;
}
```

3. **Create OTP Input component**
```tsx
export function OTPInput({
  length = 6,
  onComplete,
  onResend,
  isVerifying = false,
  error = null,
  resendCountdown = 0,
  expiryCountdown = 600, // 10 minutes default
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    const code = otp.join('');
    if (code.length === length && !isVerifying) {
      onComplete(code);
    }
  }, [otp, length, isVerifying, onComplete]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '');
    
    if (digit.length > 1) {
      // Handle paste of multiple digits
      handlePaste(index, digit);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (startIndex: number, pastedData: string) => {
    const digits = pastedData.replace(/[^0-9]/g, '').split('');
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      const index = startIndex + i;
      if (index < length) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Focus last filled input or next empty input
    const lastFilledIndex = Math.min(startIndex + digits.length - 1, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePaste(0, pastedData);
  };

  const handleResend = () => {
    setOtp(Array(length).fill(''));
    inputRefs.current[0]?.focus();
    onResend();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isExpired = expiryCountdown <= 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Enter Verification Code
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          We sent a 6-digit code to your WhatsApp
        </p>
      </div>

      {/* OTP Input boxes */}
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={onPaste}
            disabled={isVerifying || isExpired}
            className={`
              w-12 h-14 text-center text-2xl font-semibold
              border-2 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-200
              ${
                error
                  ? 'border-red-500 bg-red-50'
                  : digit
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }
              ${isVerifying || isExpired ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Verifying indicator */}
      {isVerifying && (
        <div className="text-center text-sm text-blue-600">
          <span className="animate-pulse">Verifying code...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Expiry warning */}
      {!isExpired && expiryCountdown <= 120 && (
        <Alert>
          <AlertDescription className="text-orange-600">
            Code expires in {formatTime(expiryCountdown)}
          </AlertDescription>
        </Alert>
      )}

      {/* Expired message */}
      {isExpired && (
        <Alert variant="destructive">
          <AlertDescription>
            This code has expired. Please request a new one.
          </AlertDescription>
        </Alert>
      )}

      {/* Resend section */}
      <div className="text-center text-sm">
        {resendCountdown > 0 ? (
          <p className="text-gray-600">
            Resend code in{' '}
            <span className="font-semibold text-blue-600">
              {formatTime(resendCountdown)}
            </span>
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">Didn't receive the code?</p>
            <Button
              onClick={handleResend}
              variant="outline"
              size="sm"
              disabled={isVerifying}
            >
              Resend Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

4. **Update index.ts**
```tsx
// frontend/components/storefront/auth/ForgotPassword/index.ts
export { OTPInput } from './OTPInput';
```

### Component Features

| Feature | Description |
|---------|-------------|
| Auto-focus | Automatically moves to next input |
| Paste Support | Can paste 6-digit code |
| Backspace Nav | Backspace moves to previous input |
| Arrow Keys | Left/right arrow navigation |
| Visual States | Different colors for empty/filled/error |
| Auto-submit | Submits when all 6 digits entered |

### Input States

| State | Border Color | Background |
|-------|-------------|------------|
| Empty | Gray | White |
| Filled | Blue | Light Blue |
| Error | Red | Light Red |
| Disabled | Gray | Gray (50% opacity) |

### Expected Outcome
- OTP input component with 6 boxes created
- Auto-focus and navigation working
- Paste support for full codes
- Visual feedback for states
- Countdown timers displayed

### Verification Checklist
- [ ] Component file created
- [ ] Six input boxes render correctly
- [ ] Auto-focus works on mount
- [ ] Tab/arrow key navigation works
- [ ] Paste functionality works
- [ ] Backspace navigation works
- [ ] Error states display correctly
- [ ] Countdown timers show correctly
- [ ] Disabled state works when expired
- [ ] Auto-submit on completion

---

## Task 65: Verify OTP API

### Overview
Integrate the OTP verification API with the OTP Input component. This includes calling the verify endpoint, handling verification success/failure, managing error states, and redirecting to password reset page on successful verification.

### Dependencies
- Task 64: OTP Input component created
- Task 63: OTP service with verify method

### Instructions

1. **Create OTP verification page**
   - Location: `frontend/app/(storefront)/auth/forgot-password/verify-otp/page.tsx`
   - Integrates OTP Input with verification logic
   - Manages countdown timers and resend

2. **Create verification page component**
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OTPInput } from '@/components/storefront/auth/ForgotPassword/OTPInput';
import { otpService } from '@/services/storefront/auth/otpService';
import { Button } from '@/components/ui/Button';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get params from URL
  const otpId = searchParams.get('otpId');
  const phoneNumber = searchParams.get('phone');
  const expiresAt = searchParams.get('expiresAt');
  const resendAvailableAt = searchParams.get('resendAvailableAt');

  // State
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiryCountdown, setExpiryCountdown] = useState(600);
  const [resendCountdown, setResendCountdown] = useState(60);

  // Redirect if missing params
  useEffect(() => {
    if (!otpId || !phoneNumber || !expiresAt) {
      router.push('/auth/forgot-password');
    }
  }, [otpId, phoneNumber, expiresAt, router]);

  // Expiry countdown
  useEffect(() => {
    if (!expiresAt) return;

    const updateExpiry = () => {
      const remaining = otpService.getOTPExpiryCountdown(expiresAt);
      setExpiryCountdown(remaining);

      if (remaining <= 0) {
        setError('OTP has expired. Please request a new one.');
      }
    };

    updateExpiry();
    const interval = setInterval(updateExpiry, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Resend countdown
  useEffect(() => {
    if (!resendAvailableAt) return;

    const updateResend = () => {
      const remaining = otpService.getResendCountdown(resendAvailableAt);
      setResendCountdown(remaining);
    };

    updateResend();
    const interval = setInterval(updateResend, 1000);
    return () => clearInterval(interval);
  }, [resendAvailableAt]);

  const handleVerifyOTP = async (code: string) => {
    if (!otpId) return;

    setIsVerifying(true);
    setError(null);

    try {
      const response = await otpService.verifyOTP(otpId, code);

      if (response.success && response.resetToken) {
        // Redirect to reset password page with token
        router.push(
          `/auth/reset-password?token=${response.resetToken}&phone=${phoneNumber}`
        );
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!otpId || !phoneNumber) return;

    try {
      const response = await otpService.resendOTP(otpId, phoneNumber);

      if (response.success) {
        // Update URL params with new times
        const params = new URLSearchParams({
          otpId: response.otpId,
          phone: phoneNumber,
          expiresAt: response.expiresAt,
          resendAvailableAt: response.resendAvailableAt,
        });
        router.replace(`/auth/forgot-password/verify-otp?${params.toString()}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back button */}
        <Button
          onClick={() => router.push('/auth/forgot-password')}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </Button>

        {/* WhatsApp indicator */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaWhatsapp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* OTP Input component */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <OTPInput
            onComplete={handleVerifyOTP}
            onResend={handleResendOTP}
            isVerifying={isVerifying}
            error={error}
            resendCountdown={resendCountdown}
            expiryCountdown={expiryCountdown}
          />
        </div>

        {/* Help text */}
        <div className="text-center text-sm text-gray-600">
          <p>Having trouble?</p>
          <Button
            onClick={() => router.push('/auth/forgot-password')}
            variant="link"
            size="sm"
          >
            Try a different method
          </Button>
        </div>
      </div>
    </div>
  );
}
```

3. **Add metadata**
```tsx
// frontend/app/(storefront)/auth/forgot-password/verify-otp/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify OTP | LankaCommerce Cloud',
  description: 'Enter your WhatsApp verification code',
};
```

### Verification Flow

```
User enters OTP
    ↓
handleVerifyOTP called
    ↓
Call otpService.verifyOTP()
    ↓
┌─────────────┬──────────────┐
│   Success   │    Failure   │
└─────────────┴──────────────┘
      ↓              ↓
Get resetToken   Show error
      ↓              ↓
Redirect to     Allow retry
reset password    (3 attempts)
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `otpId` | `string` | OTP instance ID |
| `phone` | `string` | Phone number |
| `expiresAt` | `string` | ISO timestamp |
| `resendAvailableAt` | `string` | ISO timestamp |

### Expected Outcome
- OTP verification page created
- Countdown timers working
- Verification API integrated
- Success redirects to reset password
- Errors display properly

### Verification Checklist
- [ ] Page file created
- [ ] OTP Input component integrated
- [ ] Verify API called on completion
- [ ] Expiry countdown works
- [ ] Resend countdown works
- [ ] Success redirects correctly
- [ ] Error messages display
- [ ] Back button works
- [ ] Missing params redirect

---

## Task 66: OTP Expiry Handling

### Overview
Implement comprehensive OTP expiry handling including countdown display, expiry warnings, auto-disable on expiry, and clear messaging for expired codes. This ensures users are aware of time constraints and can request new codes when needed.

### Dependencies
- Task 65: Verify OTP API integration
- Task 64: OTP Input component with countdown props

### Instructions

1. **Enhance expiry countdown hook**
   - Location: `frontend/hooks/useOTPCountdown.ts`
   - Custom hook for managing countdown state
   - Handles both expiry and resend countdowns

2. **Create countdown hook**
```tsx
// frontend/hooks/useOTPCountdown.ts
import { useState, useEffect, useCallback } from 'react';

interface UseOTPCountdownProps {
  expiresAt: string;
  resendAvailableAt: string;
  onExpiry?: () => void;
}

interface UseOTPCountdownReturn {
  expiryCountdown: number;
  resendCountdown: number;
  isExpired: boolean;
  canResend: boolean;
  formatTime: (seconds: number) => string;
  expiryPercentage: number;
}

export function useOTPCountdown({
  expiresAt,
  resendAvailableAt,
  onExpiry,
}: UseOTPCountdownProps): UseOTPCountdownReturn {
  const [expiryCountdown, setExpiryCountdown] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Calculate total expiry time for percentage
  const totalExpiryTime = 600; // 10 minutes in seconds

  const calculateCountdown = useCallback((targetTime: string): number => {
    const now = new Date().getTime();
    const target = new Date(targetTime).getTime();
    const diff = target - now;
    return Math.max(0, Math.ceil(diff / 1000));
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Update countdowns
  useEffect(() => {
    const updateCountdowns = () => {
      const expiry = calculateCountdown(expiresAt);
      const resend = calculateCountdown(resendAvailableAt);

      setExpiryCountdown(expiry);
      setResendCountdown(resend);

      // Call onExpiry callback when expired
      if (expiry === 0 && onExpiry) {
        onExpiry();
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, resendAvailableAt, calculateCountdown, onExpiry]);

  const expiryPercentage = (expiryCountdown / totalExpiryTime) * 100;

  return {
    expiryCountdown,
    resendCountdown,
    isExpired: expiryCountdown <= 0,
    canResend: resendCountdown <= 0,
    formatTime,
    expiryPercentage,
  };
}
```

3. **Create expiry warning component**
```tsx
// frontend/components/storefront/auth/ForgotPassword/OTPExpiryWarning.tsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

interface OTPExpiryWarningProps {
  countdown: number;
  formatTime: (seconds: number) => string;
  isExpired: boolean;
}

export function OTPExpiryWarning({
  countdown,
  formatTime,
  isExpired,
}: OTPExpiryWarningProps) {
  if (isExpired) {
    return (
      <Alert variant="destructive">
        <FaExclamationTriangle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          <strong>Code Expired</strong>
          <p className="mt-1">
            This verification code has expired. Please request a new one to
            continue.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // Show warning when less than 2 minutes remain
  if (countdown <= 120) {
    return (
      <Alert variant="warning">
        <FaClock className="h-4 w-4" />
        <AlertDescription className="ml-2">
          <strong>Hurry up!</strong> Code expires in{' '}
          <span className="font-semibold">{formatTime(countdown)}</span>
        </AlertDescription>
      </Alert>
    );
  }

  // Show info for remaining time
  return (
    <div className="text-sm text-gray-600 text-center">
      Code expires in {formatTime(countdown)}
    </div>
  );
}
```

4. **Create progress bar component**
```tsx
// frontend/components/storefront/auth/ForgotPassword/OTPProgressBar.tsx
import React from 'react';

interface OTPProgressBarProps {
  percentage: number;
}

export function OTPProgressBar({ percentage }: OTPProgressBarProps) {
  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full transition-all duration-1000 ${getColor()}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
```

5. **Update OTP Input to use countdown hook**
```tsx
// Update in OTPInput.tsx
import { useOTPCountdown } from '@/hooks/useOTPCountdown';
import { OTPExpiryWarning } from './OTPExpiryWarning';
import { OTPProgressBar } from './OTPProgressBar';

// Inside component, replace countdown logic:
const {
  expiryCountdown,
  resendCountdown,
  isExpired,
  canResend,
  formatTime,
  expiryPercentage,
} = useOTPCountdown({
  expiresAt: expiresAtProp,
  resendAvailableAt: resendAvailableAtProp,
  onExpiry: () => {
    setError('Code expired. Please request a new one.');
  },
});

// Add progress bar and warning to JSX:
<div className="space-y-4">
  <OTPProgressBar percentage={expiryPercentage} />
  <OTPExpiryWarning
    countdown={expiryCountdown}
    formatTime={formatTime}
    isExpired={isExpired}
  />
</div>
```

6. **Update index.ts**
```tsx
// frontend/components/storefront/auth/ForgotPassword/index.ts
export { OTPExpiryWarning } from './OTPExpiryWarning';
export { OTPProgressBar } from './OTPProgressBar';
```

### Expiry States

| Time Remaining | State | Color | Action |
|----------------|-------|-------|--------|
| > 2 min | Normal | Green | Show countdown |
| 1-2 min | Warning | Yellow | Show alert |
| < 1 min | Critical | Red | Show urgent warning |
| 0 sec | Expired | Red | Disable input, show error |

### User Experience Flow

```
10:00 - OTP sent
   ↓
Progress bar: Green (100%)
   ↓
8:00 - Normal state
   ↓
2:00 - Warning alert shown
   ↓
Progress bar: Yellow (20%)
   ↓
1:00 - Critical warning
   ↓
Progress bar: Red (10%)
   ↓
0:00 - Expired
   ↓
Inputs disabled
   ↓
Show "Request New Code" button
```

### Expected Outcome
- Countdown hook created and working
- Progress bar shows time remaining
- Warning alerts at 2 minutes
- Inputs disabled when expired
- Clear messaging throughout

### Verification Checklist
- [ ] Countdown hook created
- [ ] Progress bar component created
- [ ] Expiry warning component created
- [ ] Hook integrated in OTP Input
- [ ] Countdown updates every second
- [ ] Progress bar color changes
- [ ] Warnings show at correct times
- [ ] Inputs disable on expiry
- [ ] Expiry callback triggers

---

## Task 67: Resend OTP

### Overview
Implement the resend OTP functionality with countdown timer, rate limiting, and user feedback. Users can request a new code after the resend cooldown period expires, with clear indication of when they can resend.

### Dependencies
- Task 66: OTP expiry handling implemented
- Task 63: Resend OTP API method created

### Instructions

1. **Create resend button component**
   - Location: `frontend/components/storefront/auth/ForgotPassword/ResendOTPButton.tsx`
   - Shows countdown or resend button
   - Handles resend API call

2. **Create ResendOTPButton component**
```tsx
// frontend/components/storefront/auth/ForgotPassword/ResendOTPButton.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FaRedo } from 'react-icons/fa';
import { Alert, AlertDescription } from '@/components/ui/Alert';

interface ResendOTPButtonProps {
  onResend: () => Promise<void>;
  countdown: number;
  formatTime: (seconds: number) => string;
  canResend: boolean;
  disabled?: boolean;
}

export function ResendOTPButton({
  onResend,
  countdown,
  formatTime,
  canResend,
  disabled = false,
}: ResendOTPButtonProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await onResend();
      setResendSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Success message */}
      {resendSuccess && (
        <Alert variant="success">
          <AlertDescription>
            ✅ New code sent! Check your WhatsApp.
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resend section */}
      <div className="text-center">
        {!canResend ? (
          <div className="text-sm text-gray-600">
            <p className="mb-1">Didn't receive the code?</p>
            <p>
              Resend available in{' '}
              <span className="font-semibold text-blue-600 tabular-nums">
                {formatTime(countdown)}
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <Button
              onClick={handleResend}
              disabled={disabled || isResending}
              variant="outline"
              size="sm"
              className="min-w-[140px]"
            >
              {isResending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <FaRedo className="mr-2" />
                  Resend Code
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

3. **Update VerifyOTPPage with resend logic**
```tsx
// Update in verify-otp/page.tsx
const [resendCount, setResendCount] = useState(0);
const [lastResendTime, setLastResendTime] = useState<string | null>(null);

const handleResendOTP = async () => {
  if (!otpId || !phoneNumber) return;

  // Limit resend attempts (max 3)
  if (resendCount >= 3) {
    setError(
      'Maximum resend attempts reached. Please start over from the forgot password page.'
    );
    return;
  }

  try {
    const response = await otpService.resendOTP(otpId, phoneNumber);

    if (response.success) {
      // Update state
      setResendCount((prev) => prev + 1);
      setLastResendTime(new Date().toISOString());
      setError(null);

      // Update URL params with new times
      const params = new URLSearchParams({
        otpId: response.otpId,
        phone: phoneNumber,
        expiresAt: response.expiresAt,
        resendAvailableAt: response.resendAvailableAt,
      });
      router.replace(`/auth/forgot-password/verify-otp?${params.toString()}`);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to resend OTP');
  }
};

// Add resend limit warning
{resendCount >= 2 && (
  <Alert>
    <AlertDescription>
      This is your last resend attempt. After this, you'll need to restart the
      password reset process.
    </AlertDescription>
  </Alert>
)}
```

4. **Integrate ResendOTPButton in OTPInput**
```tsx
// Update OTPInput.tsx to use ResendOTPButton component
import { ResendOTPButton } from './ResendOTPButton';

// Replace the existing resend section with:
<ResendOTPButton
  onResend={onResend}
  countdown={resendCountdown}
  formatTime={formatTime}
  canResend={resendCountdown <= 0}
  disabled={isVerifying || isExpired}
/>
```

5. **Add resend analytics tracking (optional)**
```tsx
// frontend/services/storefront/analytics/otpAnalytics.ts
export function trackOTPResend(data: {
  otpId: string;
  resendCount: number;
  timeFromInitial: number;
}) {
  // Track resend events for monitoring
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'otp_resend', {
      event_category: 'authentication',
      event_label: 'whatsapp_otp',
      value: data.resendCount,
    });
  }
}
```

### Resend Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Cooldown | 60 seconds | Wait time between resends |
| Max Attempts | 3 | Maximum resend attempts |
| Success Display | 3 seconds | Show success message duration |

### Resend States

| State | Button | Message |
|-------|--------|---------|
| Countdown active | Disabled | "Resend available in X:XX" |
| Can resend | Enabled | "Resend Code" |
| Sending | Disabled | "Sending..." with spinner |
| Success | Enabled | "✅ New code sent!" |
| Error | Enabled | Error message displayed |
| Max attempts | Disabled | "Maximum attempts reached" |

### Expected Outcome
- Resend button component created
- Countdown prevents rapid resends
- Success/error messages display
- Max attempts enforced
- New OTP times update URL

### Verification Checklist
- [ ] ResendOTPButton component created
- [ ] Countdown timer works correctly
- [ ] Button disabled during countdown
- [ ] Resend API called successfully
- [ ] Success message displays
- [ ] Error handling works
- [ ] Max attempts limit enforced
- [ ] URL params update with new times
- [ ] Component integrated in OTPInput

---

## Task 68: Verify Password Reset Flow

### Overview
Perform end-to-end verification of the complete password reset flow including both email and WhatsApp OTP methods. This includes testing all user paths, error scenarios, edge cases, and security measures to ensure a robust password reset system.

### Dependencies
- Task 67: Resend OTP functionality complete
- All password reset components and APIs implemented

### Instructions

1. **Create test checklist document**
   - Location: `frontend/tests/storefront/auth/password-reset-checklist.md`
   - Comprehensive test scenarios
   - Manual and automated tests

2. **Password Reset Test Checklist**
```markdown
# Password Reset Flow - Test Checklist

## Email Reset Flow

### Forgot Password Page
- [ ] Page loads at `/auth/forgot-password`
- [ ] Form displays correctly
- [ ] Email input has proper validation
- [ ] Phone input has proper validation
- [ ] Submit button is disabled when invalid
- [ ] Loading state shows during submission
- [ ] Back to login link works

### Email Method
- [ ] Valid email triggers email reset flow
- [ ] Email sent confirmation displays
- [ ] Confirmation shows correct email address
- [ ] "Check spam" tip is visible
- [ ] Email contains valid reset link
- [ ] Reset link has expiry timestamp
- [ ] Reset link has secure token

### Reset Password Page (Email Link)
- [ ] Page loads from email link
- [ ] Token validation occurs
- [ ] Invalid token shows error
- [ ] Expired token shows error
- [ ] New password field validates strength
- [ ] Confirm password matches validation
- [ ] Submit button works
- [ ] Success redirects to login
- [ ] Success message displays

## WhatsApp OTP Flow

### WhatsApp OTP Option
- [ ] Valid phone triggers OTP flow
- [ ] WhatsApp option page displays
- [ ] Phone number shown correctly
- [ ] Instructions are clear
- [ ] Send OTP button works
- [ ] Loading state during send

### OTP Sent
- [ ] OTP sent to WhatsApp
- [ ] OTP is 6 digits
- [ ] WhatsApp message formatted correctly
- [ ] Message includes company name
- [ ] Message includes expiry time

### OTP Input Page
- [ ] Page loads with OTP input
- [ ] 6 input boxes display
- [ ] First box auto-focused
- [ ] Auto-advance on digit entry
- [ ] Backspace navigation works
- [ ] Arrow key navigation works
- [ ] Paste full code works
- [ ] Progress bar shows time
- [ ] Expiry countdown displays
- [ ] Warning at 2 minutes
- [ ] Critical warning at 1 minute

### OTP Verification
- [ ] Auto-submit on 6 digits
- [ ] Valid OTP accepts
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] Max 3 attempts enforced
- [ ] Inputs disable on expiry
- [ ] Success redirects to reset page
- [ ] Reset token passed correctly

### Resend OTP
- [ ] Countdown starts at 60 seconds
- [ ] Button disabled during countdown
- [ ] Countdown updates every second
- [ ] Button enables at 0
- [ ] Resend API called
- [ ] New OTP sent successfully
- [ ] New expiry time set
- [ ] Old code invalidated
- [ ] Max 3 resends enforced
- [ ] Warning shown at attempt 3

### Reset Password Page (OTP Success)
- [ ] Page loads after OTP verify
- [ ] Reset token validated
- [ ] Phone number displayed
- [ ] New password input works
- [ ] Confirm password works
- [ ] Strength meter shows
- [ ] Submit button works
- [ ] Success redirects to login

## Security Tests

### Token Security
- [ ] Tokens are cryptographically secure
- [ ] Tokens expire after 15 minutes (email)
- [ ] OTP expires after 10 minutes
- [ ] Used tokens cannot be reused
- [ ] Tokens are single-use
- [ ] Invalid tokens rejected

### Rate Limiting
- [ ] Max 5 reset requests per hour per email
- [ ] Max 5 OTP requests per hour per phone
- [ ] Max 3 OTP verify attempts
- [ ] Max 3 OTP resends
- [ ] Blocked users cannot request

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled
- [ ] Email format validated
- [ ] Phone format validated
- [ ] Password strength enforced

## Error Scenarios

### Network Errors
- [ ] API timeout handled
- [ ] Network offline handled
- [ ] Server error (500) handled
- [ ] API unavailable handled

### User Errors
- [ ] Non-existent email handled
- [ ] Non-existent phone handled
- [ ] Invalid email format
- [ ] Invalid phone format
- [ ] Wrong OTP code
- [ ] Expired link handled
- [ ] Password mismatch handled
- [ ] Weak password rejected

### Edge Cases
- [ ] Rapid form submissions blocked
- [ ] Multiple tabs handled
- [ ] Browser back button works
- [ ] Page refresh maintains state
- [ ] Expired session handled

## Mobile Testing

### Responsive Design
- [ ] Layout works on mobile
- [ ] Buttons are tappable
- [ ] Form inputs accessible
- [ ] OTP input boxes sized correctly
- [ ] Text readable on small screens

### Mobile-Specific
- [ ] WhatsApp opens on mobile
- [ ] Phone keyboard for OTP
- [ ] Auto-fill works for OTP
- [ ] Copy-paste works
- [ ] Touch gestures work

## Accessibility

### Screen Readers
- [ ] Form labels readable
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] ARIA labels present
- [ ] Focus management correct

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Enter key submits forms
- [ ] Escape key cancels
- [ ] Arrow keys work in OTP input

## Performance

### Load Times
- [ ] Page loads under 2 seconds
- [ ] API responses under 1 second
- [ ] WhatsApp sends under 3 seconds
- [ ] Email sends under 5 seconds

### UX
- [ ] Loading states clear
- [ ] Smooth transitions
- [ ] No layout shifts
- [ ] Progress indicators accurate
```

3. **Create E2E test file**
```tsx
// frontend/tests/e2e/auth/password-reset.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Password Reset Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password');
  });

  test('should complete email reset flow', async ({ page }) => {
    // Enter email
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Check confirmation
    await expect(page.locator('text=Check your email')).toBeVisible();
    await expect(
      page.locator('text=test@example.com')
    ).toBeVisible();
  });

  test('should complete WhatsApp OTP flow', async ({ page }) => {
    // Enter phone number
    await page.fill('input[name="phone"]', '+94771234567');
    await page.click('button[type="submit"]');

    // Check WhatsApp option
    await expect(page.locator('text=WhatsApp Verification')).toBeVisible();
    await page.click('button:has-text("Send Code")');

    // Should redirect to OTP input
    await expect(page).toHaveURL(/verify-otp/);
    await expect(page.locator('input[type="text"]')).toHaveCount(6);
  });

  test('should handle OTP input correctly', async ({ page }) => {
    // Setup: trigger OTP flow
    await page.fill('input[name="phone"]', '+94771234567');
    await page.click('button[type="submit"]');
    await page.click('button:has-text("Send Code")');

    // Enter OTP digits
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill('1');
    await inputs.nth(1).fill('2');
    await inputs.nth(2).fill('3');
    await inputs.nth(3).fill('4');
    await inputs.nth(4).fill('5');
    await inputs.nth(5).fill('6');

    // Should auto-submit
    await expect(page.locator('text=Verifying')).toBeVisible();
  });

  test('should handle invalid OTP', async ({ page }) => {
    // Setup and enter invalid OTP
    // ...

    // Should show error
    await expect(page.locator('text=Invalid OTP')).toBeVisible();
    // Inputs should be cleared
    const inputs = page.locator('input[type="text"]');
    await expect(inputs.nth(0)).toHaveValue('');
  });

  test('should handle OTP resend', async ({ page }) => {
    // Setup: get to OTP page
    // ...

    // Wait for resend to be available
    await page.waitForSelector('button:has-text("Resend Code"):not([disabled])');
    
    // Click resend
    await page.click('button:has-text("Resend Code")');

    // Should show success
    await expect(page.locator('text=New code sent')).toBeVisible();
  });

  test('should complete password reset', async ({ page }) => {
    // Setup: complete OTP verification (mocked)
    await page.goto('/auth/reset-password?token=valid-token');

    // Enter new password
    await page.fill('input[name="password"]', 'NewSecure123!');
    await page.fill('input[name="confirmPassword"]', 'NewSecure123!');
    await page.click('button[type="submit"]');

    // Should redirect to login
    await expect(page).toHaveURL('/auth/login');
    await expect(
      page.locator('text=Password reset successful')
    ).toBeVisible();
  });
});
```

4. **Create verification script**
```bash
# frontend/scripts/verify-password-reset.sh
#!/bin/bash

echo "🔍 Verifying Password Reset Flow..."
echo ""

# Run type checking
echo "1️⃣ Type checking..."
npm run type-check

# Run linting
echo "2️⃣ Linting..."
npm run lint

# Run unit tests
echo "3️⃣ Unit tests..."
npm run test -- password-reset

# Run E2E tests
echo "4️⃣ E2E tests..."
npm run test:e2e -- password-reset

# Check for security issues
echo "5️⃣ Security audit..."
npm audit --audit-level=moderate

echo ""
echo "✅ Verification complete!"
```

### Test Coverage Requirements

| Area | Coverage | Priority |
|------|----------|----------|
| Happy Path | 100% | High |
| Error Handling | 100% | High |
| Security | 100% | Critical |
| Edge Cases | 80% | Medium |
| UI/UX | 90% | High |

### Manual Test Scenarios

1. **Email Reset - Happy Path**
   - Go to forgot password page
   - Enter valid email
   - Receive email
   - Click reset link
   - Enter new password
   - Confirm password matches
   - Submit and login

2. **WhatsApp OTP - Happy Path**
   - Go to forgot password page
   - Enter valid phone number
   - Choose WhatsApp option
   - Send OTP
   - Receive OTP on WhatsApp
   - Enter 6-digit code
   - Create new password
   - Submit and login

3. **OTP Expiry**
   - Trigger OTP
   - Wait 10 minutes
   - Try to verify
   - Should show expired message
   - Request new code
   - Verify with new code

4. **OTP Resend**
   - Trigger OTP
   - Wait 60 seconds
   - Click resend
   - Should receive new code
   - Old code should not work
   - New code should work

5. **Max Attempts**
   - Trigger OTP
   - Enter wrong code 3 times
   - Should be blocked
   - Should show error
   - Should require new OTP request

### Expected Outcome
- Complete test checklist created
- E2E tests passing
- Manual tests documented
- All flows verified
- Security measures confirmed

### Verification Checklist
- [ ] Test checklist document created
- [ ] E2E tests written and passing
- [ ] Manual test scenarios documented
- [ ] Email reset flow verified
- [ ] WhatsApp OTP flow verified
- [ ] OTP expiry handling verified
- [ ] Resend functionality verified
- [ ] Security measures tested
- [ ] Error scenarios handled
- [ ] Mobile responsiveness tested
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] All edge cases covered

---

## Summary

### Tasks Completed

| Task | Component | Status |
|------|-----------|--------|
| 62 | WhatsApp OTP Option | ✅ Complete |
| 63 | Send OTP Via WhatsApp API | ✅ Complete |
| 64 | OTP Input Component | ✅ Complete |
| 65 | Verify OTP API | ✅ Complete |
| 66 | OTP Expiry Handling | ✅ Complete |
| 67 | Resend OTP | ✅ Complete |
| 68 | Verify Password Reset Flow | ✅ Complete |

### Files Created

```
frontend/
├── components/
│   └── storefront/
│       └── auth/
│           └── ForgotPassword/
│               ├── WhatsAppOTPOption.tsx (Task 62)
│               ├── OTPInput.tsx (Task 64)
│               ├── OTPExpiryWarning.tsx (Task 66)
│               ├── OTPProgressBar.tsx (Task 66)
│               ├── ResendOTPButton.tsx (Task 67)
│               └── index.ts (Updated)
├── services/
│   └── storefront/
│       └── auth/
│           └── otpService.ts (Task 63)
├── hooks/
│   └── useOTPCountdown.ts (Task 66)
├── app/
│   └── (storefront)/
│       └── auth/
│           └── forgot-password/
│               └── verify-otp/
│                   └── page.tsx (Task 65)
├── types/
│   └── auth/
│       └── otp.ts (Task 63)
└── tests/
    ├── storefront/
    │   └── auth/
    │       └── password-reset-checklist.md (Task 68)
    └── e2e/
        └── auth/
            └── password-reset.spec.ts (Task 68)
```

### Key Features Implemented

1. **WhatsApp Integration**
   - WhatsApp Business API integration
   - OTP delivery via WhatsApp
   - Message templates
   - Green-themed UI

2. **OTP Input**
   - 6-digit input component
   - Auto-focus progression
   - Paste support
   - Keyboard navigation
   - Visual states

3. **Time Management**
   - 10-minute OTP expiry
   - 60-second resend cooldown
   - Real-time countdown displays
   - Progress bar indicators
   - Expiry warnings

4. **User Experience**
   - Clear instructions
   - Loading states
   - Success/error messages
   - Mobile-friendly design
   - Accessibility support

5. **Security**
   - Single-use codes
   - Expiry enforcement
   - Rate limiting
   - Max attempt limits
   - Secure token generation

### Next Steps

After completing this document:
1. Continue to SubPhase-08 Group-E (Session & Remember Me)
2. Implement session management
3. Add remember me functionality
4. Create logout flow

---

## Notes for AI Agents

### WhatsApp Business API Setup
- Requires Meta Business account
- Phone number verification needed
- Message templates must be approved
- Rate limits apply (varies by tier)
- Webhook configuration for delivery status

### OTP Best Practices
- Always use 6 digits (industry standard)
- 10-minute expiry is recommended
- 60-second resend cooldown prevents abuse
- Max 3 attempts prevents brute force
- Single-use enforcement critical

### Testing Considerations
- Mock WhatsApp API in tests
- Test all countdown timers
- Verify expiry enforcement
- Test rate limiting
- Check mobile responsiveness

### Common Pitfalls
- Timezone handling for expiry times
- Race conditions in countdown timers
- Memory leaks from intervals
- Stale state in resend logic
- Missing cleanup in useEffect

### Performance Tips
- Memoize countdown calculations
- Debounce OTP input
- Optimize re-renders
- Lazy load components
- Cache API responses

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-01-31  
**Next Document:** Continue to Group-E (Session & Remember Me)
