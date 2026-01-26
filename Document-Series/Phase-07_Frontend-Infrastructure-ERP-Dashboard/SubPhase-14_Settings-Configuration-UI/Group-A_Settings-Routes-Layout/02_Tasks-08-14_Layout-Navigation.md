# Tasks 08-14: Advanced Routes & Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** A - Settings Routes & Layout  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Settings-Routes.md](01_Tasks-01-07_Settings-Routes.md)
- **→ Next Group:** [Group-B_General-Company-Settings](../Group-B_General-Company-Settings/)

---

## Document Overview

This document covers the creation of advanced settings routes (integrations, API keys, billing, audit log), configuration of page metadata, implementation of loading states, and final verification of the complete settings route structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Integrations Page Route | Low | 15 min |
| 09 | Create API Keys Page Route | Low | 15 min |
| 10 | Create Billing Page Route | Low | 15 min |
| 11 | Create Audit Log Page Route | Low | 15 min |
| 12 | Configure Page Metadata | Low | 20 min |
| 13 | Create Settings Loading States | Low | 20 min |
| 14 | Verify Route Structure | Low | 15 min |

---

## Task 08: Create Integrations Page Route

### Overview
Create the integrations management page route where administrators can connect and configure third-party integrations such as payment gateways, SMS services, email providers, accounting software, and shipping providers. Accessible at `/settings/integrations`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create integrations directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `integrations`
   - This creates the `/settings/integrations` route

2. **Create page file**
   - Inside `integrations/` directory
   - Create new file named `page.tsx`
   - This is the integrations management page

3. **Import dependencies**
   - Import Metadata type from Next.js
   - Import IntegrationsPage component (to be created in Group E)
   - Import utilities as needed

4. **Define page metadata**
   - Export metadata object
   - Set title: "Integrations - LankaCommerce Cloud"
   - Add description about third-party integrations

5. **Create page component**
   - Define default export function `IntegrationsManagementPage`
   - Fetch integrations data if needed
   - Return IntegrationsPage component

6. **Plan data structure**
   - List of available integrations
   - Connection status for each
   - Configuration settings

### Page Structure

```
Integrations Page
─────────────────────────────────────
┌─────────────────────────────────────────┐
│ Integrations                            │
│ Connect third-party services            │
├─────────────────────────────────────────┤
│                                         │
│  Payment Processing                     │
│  ┌────────────┐  ┌────────────┐       │
│  │  Stripe    │  │  PayPal    │       │
│  │  ●Connected│  │  ○Not Conn │       │
│  │  [Settings]│  │  [Connect] │       │
│  └────────────┘  └────────────┘       │
│                                         │
│  Communication                          │
│  ┌────────────┐  ┌────────────┐       │
│  │  SMS Gate  │  │  Email Svc │       │
│  │  ●Connected│  │  ●Connected│       │
│  │  [Settings]│  │  [Settings]│       │
│  └────────────┘  └────────────┘       │
│                                         │
│  Business Tools                         │
│  ┌────────────┐  ┌────────────┐       │
│  │  Accounting│  │  Shipping  │       │
│  │  ○Not Conn │  │  ○Not Conn │       │
│  │  [Connect] │  │  [Connect] │       │
│  └────────────┘  └────────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx
├── company/
├── users/
├── roles/
└── integrations/
    └── page.tsx      # ← Integrations page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "Integrations - LankaCommerce Cloud" |
| Description | "Connect and manage third-party integrations" |
| URL | `/settings/integrations` |

### Integration Categories

| Category | Integrations |
|----------|-------------|
| Payment | Stripe, PayPal, Local Banks |
| Communication | SMS Gateway, Email Service |
| Business | Accounting Software, Shipping |
| Other | Custom webhooks, API connections |

### Expected Outcome
- Integrations page route created
- Page accessible at `/settings/integrations`
- Metadata properly configured
- Ready to display integration cards

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/integrations/` directory created
- [ ] `integrations/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Task 09: Create API Keys Page Route

### Overview
Create the API keys management page route where administrators can generate, view, and revoke API keys for programmatic access to the system. API keys enable third-party applications and custom integrations to access the ERP system securely. Accessible at `/settings/api-keys`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create api-keys directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `api-keys`
   - This creates the `/settings/api-keys` route

2. **Create page file**
   - Inside `api-keys/` directory
   - Create new file named `page.tsx`
   - This is the API keys management page

3. **Import dependencies**
   - Import Metadata type
   - Import APIKeysPage component (to be created in Group E)
   - Import utilities as needed

4. **Define page metadata**
   - Export metadata object
   - Set title: "API Keys - LankaCommerce Cloud"
   - Add description about API key management

5. **Create page component**
   - Define default export function `APIKeysManagementPage`
   - Fetch API keys data if needed
   - Return APIKeysPage component

6. **Consider security requirements**
   - API keys should be masked in display
   - Show full key only once upon creation
   - Track key usage and last used date

### Page Structure

```
API Keys Page
─────────────────────────────────────
┌─────────────────────────────────────────────┐
│ API Keys              [Generate New Key]    │
│ Manage API access keys                      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Name       Key          Last Used   │   │
│  ├─────────────────────────────────────┤   │
│  │ Mobile App sk_...xyz    2 hours ago │ ⋮ │
│  │ POS System sk_...abc    5 mins ago  │ ⋮ │
│  │ Webhook    sk_...def    Never       │ ⋮ │
│  └─────────────────────────────────────┘   │
│                                             │
│  Security Notice:                           │
│  API keys provide full access to your      │
│  account. Keep them secure and never       │
│  share them publicly.                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx
├── company/
├── users/
├── roles/
├── integrations/
└── api-keys/
    └── page.tsx      # ← API Keys page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "API Keys - LankaCommerce Cloud" |
| Description | "Generate and manage API access keys" |
| URL | `/settings/api-keys` |

### API Key Display Format

| Element | Format | Example |
|---------|--------|---------|
| Key Prefix | sk_live_ or sk_test_ | sk_live_ |
| Masked Display | First 8, last 4 chars | sk_live_...xyz |
| Full Display | One-time on creation | sk_live_abc123...xyz789 |

### Security Considerations

| Feature | Implementation |
|---------|----------------|
| Key Masking | Show only partial key |
| One-time Display | Full key shown once |
| Revocation | Immediate effect |
| Usage Tracking | Last used timestamp |
| Permissions | Role-based key creation |

### Expected Outcome
- API keys page route created
- Page accessible at `/settings/api-keys`
- Metadata properly configured
- Ready to display API keys table

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/api-keys/` directory created
- [ ] `api-keys/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Task 10: Create Billing Page Route

### Overview
Create the billing and subscription management page route where administrators can view current plan, upgrade/downgrade, view billing history, manage payment methods, and download invoices. Displays pricing in Sri Lankan Rupees (LKR). Accessible at `/settings/billing`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create billing directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `billing`
   - This creates the `/settings/billing` route

2. **Create page file**
   - Inside `billing/` directory
   - Create new file named `page.tsx`
   - This is the billing management page

3. **Import dependencies**
   - Import Metadata type
   - Import BillingPage component (to be created in Group F)
   - Import utilities as needed

4. **Define page metadata**
   - Export metadata object
   - Set title: "Billing & Plans - LankaCommerce Cloud"
   - Add description about subscription management

5. **Create page component**
   - Define default export function `BillingManagementPage`
   - Fetch billing data if needed
   - Return BillingPage component

6. **Plan data requirements**
   - Current subscription plan
   - Billing history
   - Payment methods on file
   - Next billing date

### Page Structure

```
Billing & Plans Page
─────────────────────────────────────
┌─────────────────────────────────────────────┐
│ Billing & Plans                             │
│ Manage your subscription and billing        │
├─────────────────────────────────────────────┤
│                                             │
│  Current Plan                               │
│  ┌─────────────────────────────────────┐   │
│  │ Business Plan                       │   │
│  │ ₨ 4,999 / month                     │   │
│  │ Next billing: Feb 25, 2026          │   │
│  │ [Upgrade Plan] [Cancel Plan]        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Billing History                            │
│  ┌─────────────────────────────────────┐   │
│  │ Date      Amount    Status  Invoice │   │
│  ├─────────────────────────────────────┤   │
│  │ Jan 2026  ₨4,999   Paid    [↓]     │   │
│  │ Dec 2025  ₨4,999   Paid    [↓]     │   │
│  │ Nov 2025  ₨4,999   Paid    [↓]     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Payment Methods                            │
│  ┌─────────────────────────────────────┐   │
│  │ Visa ending in 1234                 │   │
│  │ [Remove] [Set as Default]           │   │
│  └─────────────────────────────────────┘   │
│  [Add Payment Method]                       │
│                                             │
└─────────────────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx
├── company/
├── users/
├── roles/
├── integrations/
├── api-keys/
└── billing/
    └── page.tsx      # ← Billing page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "Billing & Plans - LankaCommerce Cloud" |
| Description | "Manage subscription and billing information" |
| URL | `/settings/billing` |

### Subscription Plans (Sri Lanka)

| Plan | Price (LKR) | Features |
|------|-------------|----------|
| Starter | Free | 1 user, 100 products |
| Business | 4,999/month | 5 users, 1,000 products |
| Pro | 9,999/month | 10 users, unlimited products |
| Enterprise | Custom | Unlimited, priority support |

### Billing Features

| Feature | Description |
|---------|-------------|
| Current Plan | Display active subscription |
| Plan Upgrade | Change to higher tier |
| Billing History | Past invoices list |
| Invoice Download | PDF generation |
| Payment Methods | Credit card management |
| Next Billing | Upcoming charge date |

### Expected Outcome
- Billing page route created
- Page accessible at `/settings/billing`
- Metadata properly configured
- Ready to display billing information

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/billing/` directory created
- [ ] `billing/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Task 11: Create Audit Log Page Route

### Overview
Create the audit log page route where administrators can view a comprehensive log of all system activities, user actions, and security events. The audit log helps track changes, troubleshoot issues, and maintain security compliance. Accessible at `/settings/audit-log`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create audit-log directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `audit-log`
   - This creates the `/settings/audit-log` route

2. **Create page file**
   - Inside `audit-log/` directory
   - Create new file named `page.tsx`
   - This is the audit log page

3. **Import dependencies**
   - Import Metadata type
   - Import AuditLogPage component (to be created in Group F)
   - Import utilities as needed

4. **Define page metadata**
   - Export metadata object
   - Set title: "Audit Log - LankaCommerce Cloud"
   - Add description about activity tracking

5. **Create page component**
   - Define default export function `AuditLogManagementPage`
   - Fetch audit log data with pagination
   - Return AuditLogPage component

6. **Plan filtering and search**
   - Filter by user, action type, date range
   - Search by description or entity
   - Sort by timestamp

### Page Structure

```
Audit Log Page
─────────────────────────────────────
┌───────────────────────────────────────────────┐
│ Audit Log                                     │
│ Track all system activities and changes       │
├───────────────────────────────────────────────┤
│                                               │
│  Filters: [User ▾] [Action ▾] [Date Range]   │
│           [Search...]                         │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │ Time         User      Action        │    │
│  ├──────────────────────────────────────┤    │
│  │ 2m ago      John Doe  Updated Prod   │ ▸  │
│  │ 15m ago     Jane S.   Created User   │ ▸  │
│  │ 1h ago      Admin     Changed Role   │ ▸  │
│  │ 2h ago      System    Backup Done    │ ▸  │
│  │ 3h ago      Bob M.    Login          │ ▸  │
│  └──────────────────────────────────────┘    │
│                                               │
│  [Load More]                                  │
│                                               │
└───────────────────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx
├── company/
├── users/
├── roles/
├── integrations/
├── api-keys/
├── billing/
└── audit-log/
    └── page.tsx      # ← Audit Log page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "Audit Log - LankaCommerce Cloud" |
| Description | "View system activity and audit trail" |
| URL | `/settings/audit-log` |

### Audit Log Entry Types

| Action Type | Description | Icon |
|-------------|-------------|------|
| Create | Entity created | Plus |
| Update | Entity modified | Edit |
| Delete | Entity deleted | Trash |
| Login | User login | LogIn |
| Logout | User logout | LogOut |
| Permission | Permission change | Shield |
| Settings | Settings modified | Settings |
| System | System event | Server |

### Audit Log Columns

| Column | Width | Description |
|--------|-------|-------------|
| Timestamp | 120px | When action occurred |
| User | 150px | Who performed action |
| Action | 100px | Type of action |
| Entity | 120px | Affected resource |
| Details | Flex | Action details |
| IP Address | 120px | Source IP |

### Filter Options

| Filter | Options |
|--------|---------|
| User | All users, specific user |
| Action | All actions, specific type |
| Date | Today, week, month, custom |
| Entity | Products, users, orders, etc. |

### Expected Outcome
- Audit log page route created
- Page accessible at `/settings/audit-log`
- Metadata properly configured
- Ready to display audit entries

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/audit-log/` directory created
- [ ] `audit-log/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Task 12: Configure Page Metadata

### Overview
Configure proper metadata for all settings pages to ensure good SEO, proper browser tab titles, and accurate page descriptions. This task involves reviewing and standardizing metadata across all created page routes.

### Dependencies
- Tasks 04-11: All page routes created

### Instructions

1. **Review existing metadata**
   - Check each page route's metadata object
   - Ensure consistency in format and structure
   - Verify titles follow naming convention

2. **Standardize title format**
   - Use format: "[Page Name] - LankaCommerce Cloud"
   - Keep titles concise and descriptive
   - Include "LCC" or full name consistently

3. **Add comprehensive descriptions**
   - Write clear, concise descriptions (50-160 chars)
   - Include primary keywords
   - Describe page purpose accurately

4. **Configure OpenGraph metadata (optional)**
   - Add og:title, og:description
   - Include og:image if applicable
   - Set og:type to "website"

5. **Add Twitter Card metadata (optional)**
   - Configure twitter:card type
   - Add twitter:title and description
   - Include twitter:image

6. **Set canonical URLs**
   - Define canonical URL for each page
   - Prevent duplicate content issues
   - Use absolute URLs

### Metadata Structure Template

```typescript
export const metadata: Metadata = {
  title: "[Page Name] - LankaCommerce Cloud",
  description: "[Clear description of page purpose]",
  keywords: "[Relevant keywords]",
  openGraph: {
    title: "[Page Name]",
    description: "[Description]",
    type: "website",
    url: "[Canonical URL]",
  },
  twitter: {
    card: "summary",
    title: "[Page Name]",
    description: "[Description]",
  },
};
```

### Metadata Configuration Table

| Page | Title | Description |
|------|-------|-------------|
| General Settings | "General Settings - LCC" | "Configure application preferences and localization" |
| Company | "Company Settings - LCC" | "Manage company profile and business information" |
| Users | "User Management - LCC" | "Manage users, invitations, and access control" |
| Roles | "Roles & Permissions - LCC" | "Configure user roles and permission settings" |
| Integrations | "Integrations - LCC" | "Connect and manage third-party integrations" |
| API Keys | "API Keys - LCC" | "Generate and manage API access keys" |
| Billing | "Billing & Plans - LCC" | "Manage subscription and billing information" |
| Audit Log | "Audit Log - LCC" | "View system activity and audit trail" |

### SEO Keywords by Page

| Page | Keywords |
|------|----------|
| General Settings | settings, preferences, localization, timezone |
| Company | company profile, business info, tax ID |
| Users | user management, invitations, team |
| Roles | roles, permissions, access control |
| Integrations | integrations, third-party, connectors |
| API Keys | API keys, developer access, webhooks |
| Billing | billing, subscription, plans, payment |
| Audit Log | audit log, activity log, security |

### Expected Outcome
- All pages have consistent metadata
- Titles follow standard format
- Descriptions are clear and SEO-friendly
- Optional: OpenGraph and Twitter Card configured

### Verification Checklist
- [ ] All pages have metadata object
- [ ] Titles use consistent format
- [ ] Descriptions are 50-160 characters
- [ ] Keywords included where appropriate
- [ ] No duplicate titles across pages

---

## Task 13: Create Settings Loading States

### Overview
Create loading state components for all settings pages to provide visual feedback during data fetching. Loading states improve perceived performance and user experience by showing skeletons or spinners while content loads.

### Dependencies
- Tasks 04-11: All page routes created

### Instructions

1. **Create loading.tsx files**
   - Add `loading.tsx` to main settings directory
   - Add loading files to subdirectories as needed
   - Use React Suspense boundaries

2. **Design loading skeletons**
   - Match layout of actual content
   - Use skeleton components for text/cards
   - Maintain proper spacing and structure

3. **Implement for general settings**
   - Create `frontend/app/(dashboard)/settings/loading.tsx`
   - Show skeleton for settings sections
   - Include header and form field skeletons

4. **Implement for tables (Users, Audit Log)**
   - Create table skeleton with rows
   - Show header and body skeletons
   - Match column structure

5. **Implement for cards (Integrations, Roles)**
   - Create card grid skeleton
   - Show placeholder cards
   - Maintain grid layout

6. **Test loading behavior**
   - Verify loading shows during data fetch
   - Ensure smooth transition to content
   - Check responsive behavior

### Loading State Structure

```
Settings Loading (General)
─────────────────────────────────────
┌─────────────────────────────────┐
│ ▮▮▮▮▮▮▮▮▮▮                      │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮                │
├─────────────────────────────────┤
│                                 │
│  ▮▮▮▮▮▮▮▮▮▮▮▮                  │
│  ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮              │
│                                 │
│  ▮▮▮▮▮▮▮▮▮▮                     │
│  ▮▮▮▮▮▮▮▮▮▮▮▮▮▮                │
│                                 │
└─────────────────────────────────┘
```

### Loading Files to Create

| File Path | Purpose |
|-----------|---------|
| `settings/loading.tsx` | General settings loading |
| `settings/company/loading.tsx` | Company form skeleton |
| `settings/users/loading.tsx` | Users table skeleton |
| `settings/roles/loading.tsx` | Roles cards skeleton |
| `settings/integrations/loading.tsx` | Integration cards skeleton |
| `settings/api-keys/loading.tsx` | API keys table skeleton |
| `settings/billing/loading.tsx` | Billing sections skeleton |
| `settings/audit-log/loading.tsx` | Audit table skeleton |

### Loading Component Types

| Page Type | Loading Pattern |
|-----------|----------------|
| Form Pages | Form field skeletons |
| Table Pages | Table row skeletons |
| Card Grids | Card skeletons in grid |
| Mixed Content | Combined skeletons |

### Skeleton Component Usage

| Component | Use Case |
|-----------|----------|
| Skeleton (Text) | Text placeholders |
| Skeleton (Card) | Card placeholders |
| Skeleton (Table) | Table row placeholders |
| Skeleton (Avatar) | User avatar placeholders |

### Loading State Best Practices

| Practice | Implementation |
|----------|----------------|
| Match Layout | Mirror actual content structure |
| Smooth Transitions | Fade in real content |
| Consistent Timing | Similar duration across pages |
| Responsive | Work on all screen sizes |

### Expected Outcome
- Loading files created for all pages
- Skeletons match actual content layout
- Smooth loading experience
- Proper use of Suspense boundaries

### Verification Checklist
- [ ] Main settings loading.tsx created
- [ ] Loading files for subdirectories created
- [ ] Skeletons match page layouts
- [ ] Loading states show during data fetch
- [ ] Smooth transition to loaded content

---

## Task 14: Verify Route Structure

### Overview
Perform comprehensive verification of the complete settings route structure. Test all routes, verify navigation works correctly, check metadata is applied, and ensure loading states function properly. This final task validates the entire settings module foundation.

### Dependencies
- All previous tasks (01-13) completed

### Instructions

1. **Verify directory structure**
   - Check all directories created correctly
   - Ensure proper nesting and naming
   - Confirm no missing directories

2. **Test all routes**
   - Navigate to `/settings` - General settings
   - Navigate to `/settings/company` - Company settings
   - Navigate to `/settings/users` - User management
   - Navigate to `/settings/roles` - Roles & permissions
   - Navigate to `/settings/integrations` - Integrations
   - Navigate to `/settings/api-keys` - API keys
   - Navigate to `/settings/billing` - Billing
   - Navigate to `/settings/audit-log` - Audit log

3. **Verify sidebar navigation**
   - Check all sidebar links present
   - Verify active state highlighting
   - Test link functionality
   - Check icons display correctly

4. **Verify layout consistency**
   - Ensure sidebar appears on all pages
   - Check content area layout
   - Verify responsive behavior
   - Test mobile sidebar behavior

5. **Check metadata**
   - Verify browser tab titles
   - Check page titles in browser
   - Inspect meta tags using DevTools
   - Confirm descriptions are correct

6. **Test loading states**
   - Refresh each page to see loading state
   - Verify skeletons display correctly
   - Check transition to loaded content
   - Test on slow network (throttling)

7. **Verify navigation flow**
   - Click through all sidebar links
   - Use browser back/forward buttons
   - Check breadcrumbs if implemented
   - Test direct URL access

8. **Check console for errors**
   - Open browser DevTools
   - Check for any errors or warnings
   - Verify no 404 errors
   - Check for hydration errors

### Complete Route Structure

```
frontend/app/(dashboard)/settings/
├── layout.tsx                    # Settings layout
├── loading.tsx                   # General loading
├── page.tsx                      # General settings
├── company/
│   ├── loading.tsx              # Company loading
│   └── page.tsx                 # Company settings
├── users/
│   ├── loading.tsx              # Users loading
│   └── page.tsx                 # User management
├── roles/
│   ├── loading.tsx              # Roles loading
│   └── page.tsx                 # Roles management
├── integrations/
│   ├── loading.tsx              # Integrations loading
│   └── page.tsx                 # Integrations
├── api-keys/
│   ├── loading.tsx              # API keys loading
│   └── page.tsx                 # API keys
├── billing/
│   ├── loading.tsx              # Billing loading
│   └── page.tsx                 # Billing
└── audit-log/
    ├── loading.tsx              # Audit loading
    └── page.tsx                 # Audit log
```

### Route Verification Checklist

| Route | Accessible | Metadata | Loading | Sidebar Active |
|-------|------------|----------|---------|----------------|
| /settings | ✓ | ✓ | ✓ | ✓ |
| /settings/company | ✓ | ✓ | ✓ | ✓ |
| /settings/users | ✓ | ✓ | ✓ | ✓ |
| /settings/roles | ✓ | ✓ | ✓ | ✓ |
| /settings/integrations | ✓ | ✓ | ✓ | ✓ |
| /settings/api-keys | ✓ | ✓ | ✓ | ✓ |
| /settings/billing | ✓ | ✓ | ✓ | ✓ |
| /settings/audit-log | ✓ | ✓ | ✓ | ✓ |

### Verification Tests

| Test | Expected Result |
|------|----------------|
| Direct URL access | Page loads correctly |
| Sidebar navigation | Navigates to correct page |
| Active state | Correct link highlighted |
| Browser back/forward | Navigation works |
| Page refresh | Page loads without error |
| Mobile view | Sidebar becomes drawer |
| Loading state | Shows before content |
| Metadata | Correct title in browser tab |

### Common Issues to Check

| Issue | How to Verify | Solution |
|-------|--------------|----------|
| 404 errors | Check browser console | Verify file names and paths |
| Broken links | Click all sidebar links | Check href values |
| Missing metadata | Check browser tab title | Add metadata export |
| No loading state | Refresh page | Add loading.tsx file |
| Layout not applied | Check page appearance | Verify layout.tsx exists |
| Hydration errors | Check console | Match server/client rendering |

### Browser Testing

| Browser | Test Status | Notes |
|---------|-------------|-------|
| Chrome | ✓ | Primary testing |
| Firefox | ✓ | Check compatibility |
| Safari | ✓ | Check iOS Safari too |
| Edge | ✓ | Chromium-based |

### Expected Outcome
- All routes accessible and functional
- Navigation working correctly
- Metadata applied properly
- Loading states functioning
- No console errors
- Complete route structure verified

### Final Verification Checklist
- [ ] All 8 routes accessible via URL
- [ ] All sidebar navigation links work
- [ ] Active sidebar item highlights correctly
- [ ] Layout appears on all pages
- [ ] Loading states show appropriately
- [ ] Browser tab titles correct
- [ ] No 404 or console errors
- [ ] Responsive design works
- [ ] Mobile sidebar functions
- [ ] Documentation is complete

---

## Summary

This document covered the completion of settings route structure including:

1. **Integrations Route** - Third-party service connections
2. **API Keys Route** - API access management
3. **Billing Route** - Subscription and payment management
4. **Audit Log Route** - Activity tracking and logs
5. **Page Metadata** - SEO and browser metadata
6. **Loading States** - Loading skeletons for all pages
7. **Route Verification** - Complete testing and validation

### Complete Settings Structure

```
Settings Module (Group A Complete)
├── Route Directory Structure ✓
├── Settings Layout ✓
├── Settings Sidebar ✓
├── 8 Page Routes ✓
├── Page Metadata ✓
├── Loading States ✓
└── Verification Complete ✓
```

### All Settings Routes

1. `/settings` - General Settings
2. `/settings/company` - Company Profile
3. `/settings/users` - User Management
4. `/settings/roles` - Roles & Permissions
5. `/settings/integrations` - Integrations
6. `/settings/api-keys` - API Keys
7. `/settings/billing` - Billing & Plans
8. `/settings/audit-log` - Audit Log

### Next Steps

Continue to [Group-B_General-Company-Settings](../Group-B_General-Company-Settings/) to:
- Build general settings page with localization
- Create company profile configuration
- Implement settings forms and components

---

**End of Document 02 of 02 - Group A Complete**
