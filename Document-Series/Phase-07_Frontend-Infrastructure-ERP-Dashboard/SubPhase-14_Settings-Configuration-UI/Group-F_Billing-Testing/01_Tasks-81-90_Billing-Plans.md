# Tasks 81-90: Billing & Plans Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** F - Billing & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-91-96_Testing-Verify.md](02_Tasks-91-96_Testing-Verify.md)

---

## Document Overview

This document covers billing and subscription management including current plan display, plan upgrades, billing history, payment methods, and audit log for tracking system activities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Billing Page | Medium | 25 min |
| 82 | Create Current Plan Card | Medium | 30 min |
| 83 | Create Plan Features List | Low | 20 min |
| 84 | Create Upgrade Plan Button | Low | 15 min |
| 85 | Create Plan Selection Modal | Medium | 35 min |
| 86 | Create Billing History Table | Medium | 30 min |
| 87 | Create Download Invoice Action | Low | 20 min |
| 88 | Create Payment Method Section | Medium | 30 min |
| 89 | Create Add Payment Method | Medium | 30 min |
| 90 | Create Audit Log Page | Medium | 30 min |

---

## Task 81: Create Billing Page

### Overview
Create main billing page displaying current subscription plan, billing history, and payment methods.

### Dependencies
- Group A: Billing route created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/BillingPage.tsx`
2. **Include sections**:
   - Current Plan Card (Task 82)
   - Billing History Table (Task 86)
   - Payment Method Section (Task 88)
3. **Fetch billing data**: GET `/api/billing/subscription`
4. **Handle loading**: Show skeleton sections
5. **Organize layout**: Vertical stack with spacing

### Expected Outcome
Comprehensive billing page with plan, history, and payment info.

### Verification Checklist
- [ ] BillingPage.tsx component created
- [ ] All sections included
- [ ] Data fetching working
- [ ] Layout organized

---

## Task 82: Create Current Plan Card

### Overview
Create card displaying current subscription plan details including plan name, price, billing cycle, and next billing date.

### Dependencies
- Task 81: Billing Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/CurrentPlanCard.tsx`
2. **Display plan details**:
   - Plan name (Starter, Business, Pro, Enterprise)
   - Price in LKR (₨)
   - Billing cycle (Monthly/Annual)
   - Next billing date
3. **Include features**: Plan Features List component (Task 83)
4. **Add actions**: Upgrade button, Cancel button
5. **Apply card styling**: Border, padding, sections

### Card Structure
```
Current Plan
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Business Plan                       │
│ ₨ 4,999 / month                     │
│                                     │
│ Next billing: Feb 25, 2026          │
│                                     │
│ Plan Includes:                      │
│ ✓ 5 users                          │
│ ✓ 1,000 products                   │
│ ✓ Unlimited transactions           │
│ ✓ Email support                    │
│                                     │
│ [Upgrade Plan]  [Cancel Plan]       │
└─────────────────────────────────────┘
```

### Expected Outcome
Card displaying current subscription with details and actions.

### Verification Checklist
- [ ] CurrentPlanCard.tsx component created
- [ ] Plan details displayed
- [ ] Price in LKR shown
- [ ] Actions functional

---

## Task 83: Create Plan Features List

### Overview
Create component displaying list of features included in current plan.

### Dependencies
- Task 82: Current Plan Card created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/PlanFeaturesList.tsx`
2. **Accept features prop**: Array of feature strings
3. **Display as list**: With checkmark icons
4. **Apply styling**: Green checkmarks, proper spacing
5. **Handle feature comparison**: Show available vs unavailable features

### Feature Display
```
✓ 5 team members
✓ 1,000 products
✓ Unlimited transactions
✓ 3 locations
✓ Email & chat support
✗ Priority support (Pro plan)
✗ Custom integrations (Enterprise)
```

### Expected Outcome
Formatted list of plan features with checkmarks.

### Verification Checklist
- [ ] PlanFeaturesList.tsx component created
- [ ] Features displayed with icons
- [ ] Styling applied
- [ ] Comparison supported

---

## Task 84: Create Upgrade Plan Button

### Overview
Create button to initiate plan upgrade flow opening plan selection modal.

### Dependencies
- Task 82: Current Plan Card created

### Instructions

1. **Add button to CurrentPlanCard**
2. **Button text**: "Upgrade Plan"
3. **Primary styling**: Blue, prominent
4. **Handle click**: Open plan selection modal (Task 85)
5. **Disable for highest tier**: If already on Enterprise plan
6. **Add tooltip**: Explain upgrade benefits

### Expected Outcome
Button opening plan selection modal for upgrades.

### Verification Checklist
- [ ] Upgrade button added
- [ ] Opens modal correctly
- [ ] Disabled on highest tier
- [ ] Tooltip informative

---

## Task 85: Create Plan Selection Modal

### Overview
Create modal displaying all available plans with features comparison for selection and upgrade.

### Dependencies
- Task 84: Upgrade Plan Button created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/PlanSelectionModal.tsx`
2. **Display all plans**: Starter, Business, Pro, Enterprise
3. **Show pricing**: In LKR with monthly/annual toggle
4. **Feature comparison**: Table comparing features
5. **Highlight differences**: Show what changes with upgrade
6. **Add select buttons**: "Select Plan" for each tier
7. **Implement upgrade**: POST `/api/billing/upgrade` with selected plan
8. **Handle payment**: Redirect to payment if needed

### Modal Structure
```
Choose Your Plan
─────────────────────────────────────
[Monthly] [Annual] (Save 20%)

┌─────────┬─────────┬─────────┬──────────┐
│ Starter │Business │   Pro   │Enterprise│
│  Free   │₨ 4,999  │₨ 9,999  │  Custom  │
├─────────┼─────────┼─────────┼──────────┤
│ 1 user  │ 5 users │10 users │Unlimited │
│ 100 prod│1K prod  │Unlimited│Unlimited │
│ ...     │ ...     │ ...     │ ...      │
├─────────┼─────────┼─────────┼──────────┤
│[Current]│[Select] │[Select] │[Contact] │
└─────────┴─────────┴─────────┴──────────┘
```

### Sri Lankan Plan Pricing
| Plan | Monthly (LKR) | Annual (LKR) |
|------|--------------|--------------|
| Starter | Free | Free |
| Business | 4,999 | 47,990 (20% off) |
| Pro | 9,999 | 95,990 (20% off) |
| Enterprise | Custom | Custom |

### Expected Outcome
Modal for selecting and upgrading to different plans.

### Verification Checklist
- [ ] PlanSelectionModal.tsx component created
- [ ] All plans displayed
- [ ] Pricing in LKR
- [ ] Feature comparison shown
- [ ] Upgrade functionality working

---

## Task 86: Create Billing History Table

### Overview
Create table displaying past invoices and payment history.

### Dependencies
- Task 81: Billing Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/BillingHistoryTable.tsx`
2. **Fetch history**: GET `/api/billing/history`
3. **Define columns**:
   - Invoice Number
   - Date
   - Amount (LKR)
   - Status (Paid, Pending, Failed)
   - Download action
4. **Use TanStack Table**: For sorting and pagination
5. **Handle empty state**: Show message when no history

### Table Structure
```
Billing History
─────────────────────────────────────
┌──────────────────────────────────────────────┐
│ Invoice#  Date       Amount    Status  Action│
├──────────────────────────────────────────────┤
│ INV-001   Jan 2026   ₨4,999   Paid    [↓]   │
│ INV-002   Dec 2025   ₨4,999   Paid    [↓]   │
│ INV-003   Nov 2025   ₨4,999   Paid    [↓]   │
└──────────────────────────────────────────────┘
```

### Invoice Status Colors
| Status | Color | Badge |
|--------|-------|-------|
| Paid | Green | Success |
| Pending | Yellow | Warning |
| Failed | Red | Error |

### Expected Outcome
Table displaying billing history with download options.

### Verification Checklist
- [ ] BillingHistoryTable.tsx component created
- [ ] Data fetching working
- [ ] All columns displayed
- [ ] Status badges colored
- [ ] Download action functional

---

## Task 87: Create Download Invoice Action

### Overview
Create action to download invoices as PDF files.

### Dependencies
- Task 86: Billing History Table created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/DownloadInvoice.tsx`
2. **Add download button**: In actions column
3. **Implement download**: GET `/api/billing/invoices/{id}/download`
4. **Handle PDF**: Trigger browser download
5. **Add loading state**: Show spinner during download
6. **Handle errors**: Show error toast if download fails

### Expected Outcome
Users can download invoice PDFs with one click.

### Verification Checklist
- [ ] DownloadInvoice.tsx component created
- [ ] Download button functional
- [ ] PDF downloads correctly
- [ ] Loading state shown
- [ ] Error handling implemented

---

## Task 88: Create Payment Method Section

### Overview
Create section displaying saved payment methods (credit cards).

### Dependencies
- Task 81: Billing Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/PaymentMethodSection.tsx`
2. **Fetch payment methods**: GET `/api/billing/payment-methods`
3. **Display card info**:
   - Card brand (Visa, Mastercard)
   - Last 4 digits
   - Expiry date
   - Default indicator
4. **Add actions**:
   - Set as default
   - Remove card
5. **Include add button**: Opens AddPaymentMethod modal (Task 89)

### Payment Method Display
```
Payment Methods
─────────────────────────────────────
┌─────────────────────────────────────┐
│ [Visa] •••• 1234                    │
│ Expires 12/2027     [DEFAULT]       │
│ [Set Default] [Remove]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [Mastercard] •••• 5678              │
│ Expires 06/2026                     │
│ [Set Default] [Remove]              │
└─────────────────────────────────────┘

[+ Add Payment Method]
```

### Expected Outcome
Section displaying payment methods with management actions.

### Verification Checklist
- [ ] PaymentMethodSection.tsx component created
- [ ] Payment methods displayed
- [ ] Default indicator shown
- [ ] Actions functional
- [ ] Add button opens modal

---

## Task 89: Create Add Payment Method

### Overview
Create modal for adding new payment method using Stripe or similar payment processor.

### Dependencies
- Task 88: Payment Method Section created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Billing/AddPaymentMethod.tsx`
2. **Integrate payment processor**: Stripe Elements or similar
3. **Include card form**:
   - Card number
   - Expiry date
   - CVC
   - Cardholder name
4. **Validate card**: Real-time validation
5. **Submit to API**: POST `/api/billing/payment-methods`
6. **Handle response**: Show success, update list
7. **Handle errors**: Display payment errors

### Expected Outcome
Modal for securely adding credit card payment methods.

### Verification Checklist
- [ ] AddPaymentMethod.tsx component created
- [ ] Payment form integrated
- [ ] Validation working
- [ ] Submission functional
- [ ] Error handling comprehensive

---

## Task 90: Create Audit Log Page

### Overview
Create audit log page displaying all system activities and user actions for security and compliance.

### Dependencies
- Group A: Audit Log route created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/AuditLog/AuditLogPage.tsx`
2. **Include header**: Title and description
3. **Add filters**: User, action type, date range
4. **Create table**: AuditLogTable component (next doc)
5. **Fetch logs**: GET `/api/audit-log`
6. **Implement pagination**: Load more or page controls
7. **Add search**: Search by description or entity

### Page Structure
```
Audit Log
─────────────────────────────────────
Track all system activities

Filters: [User ▾] [Action ▾] [Date ▾]
         [Search...]

┌──────────────────────────────────────┐
│ Time      User      Action    Details│
├──────────────────────────────────────┤
│ 2m ago    John Doe  Update    Product│
│ 15m ago   Jane S.   Create    User   │
│ 1h ago    Admin     Change    Role   │
└──────────────────────────────────────┘
```

### Audit Entry Types
| Action | Description |
|--------|-------------|
| Create | Entity created |
| Update | Entity modified |
| Delete | Entity deleted |
| Login | User login |
| Logout | User logout |
| Permission | Permission change |
| Settings | Settings modified |

### Expected Outcome
Audit log page with filtering and search capabilities.

### Verification Checklist
- [ ] AuditLogPage.tsx component created
- [ ] Filters functional
- [ ] Search working
- [ ] Table displays entries
- [ ] Pagination implemented

---

## Summary

This document covered billing and audit features:

1. Billing Page
2. Current Plan Card
3. Plan Features List
4. Upgrade Plan Button
5. Plan Selection Modal
6. Billing History Table
7. Download Invoice Action
8. Payment Method Section
9. Add Payment Method
10. Audit Log Page

### Next Steps

Continue to [02_Tasks-91-96_Testing-Verify.md](02_Tasks-91-96_Testing-Verify.md) to complete final testing and documentation.

---

**End of Document 01 of 02**
