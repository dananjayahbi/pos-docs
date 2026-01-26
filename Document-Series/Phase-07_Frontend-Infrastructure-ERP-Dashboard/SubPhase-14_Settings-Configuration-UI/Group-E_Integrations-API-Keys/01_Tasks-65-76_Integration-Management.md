# Tasks 65-76: Integration Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** E - Integrations & API Keys  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-77-80_API-Keys.md](02_Tasks-77-80_API-Keys.md)

---

## Document Overview

This document covers third-party integrations management including integrations grid, connection status, connect/disconnect actions, and integration settings configuration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create Integrations Page | Low | 20 min |
| 66 | Create Integrations Grid | Medium | 30 min |
| 67 | Create Integration Card | Medium | 30 min |
| 68 | Create Integration Status | Low | 15 min |
| 69 | Create Connect Integration | Medium | 30 min |
| 70 | Create Integration Settings Modal | Medium | 35 min |
| 71 | Create Disconnect Integration | Low | 20 min |
| 72 | Create API Keys Page | Low | 20 min |
| 73 | Create API Keys Table | Medium | 30 min |
| 74 | Define API Key Columns | Medium | 20 min |
| 75 | Create Generate API Key Modal | Medium | 30 min |
| 76 | Create API Key Display | Medium | 25 min |

---

## Task 65: Create Integrations Page

### Overview
Create main integrations page displaying all available third-party integrations.

### Dependencies
- Group A: Integrations route created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Integrations/IntegrationsPage.tsx`
2. **Fetch integrations**: GET `/api/integrations`
3. **Organize by category**: Payment, Communication, Business Tools
4. **Include grid**: IntegrationsGrid component
5. **Handle loading**: Show skeleton cards
6. **Handle errors**: Display error message

### Integration Categories
- Payment Processing (Stripe, PayPal)
- Communication (SMS, Email)
- Business Tools (Accounting, Shipping)

### Expected Outcome
Page displaying categorized integrations in grid layout.

### Verification Checklist
- [ ] IntegrationsPage.tsx component created
- [ ] Data fetching implemented
- [ ] Categories organized
- [ ] Loading states working

---

## Task 66: Create Integrations Grid

### Overview
Create grid layout component for displaying integration cards.

### Dependencies
- Task 65: Integrations Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Integrations/IntegrationsGrid.tsx`
2. **Accept integrations prop**: Array of Integration objects
3. **Implement responsive grid**: 2-3 columns
4. **Map to cards**: Use IntegrationCard component
5. **Add category headers**: Group by category

### Grid Layout
| Breakpoint | Columns |
|------------|---------|
| Mobile | 1 column |
| Tablet | 2 columns |
| Desktop | 3 columns |

### Expected Outcome
Responsive grid of integration cards grouped by category.

### Verification Checklist
- [ ] IntegrationsGrid.tsx component created
- [ ] Grid responsive
- [ ] Cards displayed
- [ ] Categories shown

---

## Task 67: Create Integration Card

### Overview
Create integration card showing logo, name, description, status, and action button.

### Dependencies
- Task 66: Integrations Grid created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Integrations/IntegrationCard.tsx`
2. **Display integration logo**: Image or icon
3. **Show name and description**: Title and brief description
4. **Add status indicator**: IntegrationStatus component
5. **Add action button**: Connect or Settings based on status
6. **Apply card styling**: Hover effects, borders

### Card Structure
```
┌─────────────────────────────────┐
│ [Logo]  Stripe                  │
│         Payment processing      │
│         ● Connected             │
│         [Settings]              │
└─────────────────────────────────┘
```

### Expected Outcome
Card displaying integration details with connect/settings button.

### Verification Checklist
- [ ] IntegrationCard.tsx component created
- [ ] Logo displayed
- [ ] Status shown
- [ ] Action button functional

---

## Task 68: Create Integration Status

### Overview
Create status indicator showing connection status (Connected, Disconnected, Error).

### Dependencies
- Task 67: Integration Card created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Integrations/IntegrationStatus.tsx`
2. **Accept status prop**: "connected" | "disconnected" | "error"
3. **Display with icon and color**:
   - Connected: Green with check icon
   - Disconnected: Gray with circle icon
   - Error: Red with alert icon
4. **Use Badge component**

### Status Colors
| Status | Color | Icon |
|--------|-------|------|
| Connected | Green | CheckCircle |
| Disconnected | Gray | Circle |
| Error | Red | AlertCircle |

### Expected Outcome
Status badge with appropriate color and icon.

### Verification Checklist
- [ ] IntegrationStatus.tsx component created
- [ ] All statuses supported
- [ ] Colors correct
- [ ] Icons displayed

---

## Task 69: Create Connect Integration

### Overview
Create connect action to initiate integration connection flow.

### Dependencies
- Task 67: Integration Card created

### Instructions

1. **Create component** in IntegrationCard
2. **Handle OAuth flow**: Redirect to provider authorization
3. **Handle API keys**: Open settings modal for API key entry
4. **Store connection**: POST `/api/integrations/{id}/connect`
5. **Update status**: Refresh after successful connection
6. **Handle errors**: Show error toast

### Connection Flow
```
1. User clicks Connect
2. Open settings modal (OAuth or API keys)
3. User authorizes/enters credentials
4. Backend validates and stores
5. Update status to Connected
```

### Expected Outcome
Integration connection flow working with proper feedback.

### Verification Checklist
- [ ] Connect action implemented
- [ ] OAuth flow working
- [ ] API key flow working
- [ ] Status updates

---

## Task 70: Create Integration Settings Modal

### Overview
Create modal for configuring integration settings (API keys, options, webhooks).

### Dependencies
- Task 69: Connect Integration created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Integrations/IntegrationSettingsModal.tsx`
2. **Accept integration prop**: Integration object
3. **Display different forms** based on integration type
4. **Include fields**:
   - API Key / Secret inputs
   - Configuration options
   - Webhook URL display
   - Test connection button
5. **Implement save**: POST/PATCH integration settings
6. **Add test button**: Verify connection

### Settings Structure
```
Stripe Settings
─────────────────────────────────────
API Configuration

Publishable Key
[pk_live_...                    ]

Secret Key
[sk_live_...                    ]

Webhook URL (read-only)
[https://api.yourapp.com/webhooks/stripe]

[Test Connection]  [Save]
```

### Expected Outcome
Settings modal for configuring integration credentials and options.

### Verification Checklist
- [ ] IntegrationSettingsModal.tsx component created
- [ ] API key fields shown
- [ ] Webhook URL displayed
- [ ] Test connection working
- [ ] Save functionality implemented

---

## Task 71: Create Disconnect Integration

### Overview
Create disconnect action to remove integration connection.

### Dependencies
- Task 67: Integration Card created

### Instructions

1. **Create disconnect function** in IntegrationCard or actions
2. **Show confirmation dialog**: "Are you sure you want to disconnect?"
3. **Warn about implications**: Data sync will stop
4. **Call API**: DELETE `/api/integrations/{id}/disconnect`
5. **Update status**: Change to Disconnected
6. **Show feedback**: Success toast

### Expected Outcome
Users can disconnect integrations with confirmation.

### Verification Checklist
- [ ] Disconnect action implemented
- [ ] Confirmation dialog shown
- [ ] API integration working
- [ ] Status updates correctly

---

## Task 72: Create API Keys Page

### Overview
Create API keys management page for generating and managing API access keys.

### Dependencies
- Group A: API Keys route created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/APIKeys/APIKeysPage.tsx`
2. **Include header**: Title and "Generate Key" button
3. **Include table**: APIKeysTable component
4. **Fetch API keys**: GET `/api/api-keys`
5. **Handle loading**: Show skeleton rows
6. **Add security notice**: Warning about key security

### Expected Outcome
Page with header, table of API keys, and security notice.

### Verification Checklist
- [ ] APIKeysPage.tsx component created
- [ ] Header with button
- [ ] Table included
- [ ] Security notice displayed

---

## Task 73: Create API Keys Table

### Overview
Create table displaying all API keys with columns for name, key (masked), created, last used, and actions.

### Dependencies
- Task 72: API Keys Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/APIKeys/APIKeysTable.tsx`
2. **Use TanStack Table**: For sorting and pagination
3. **Define columns**: Use APIKeyColumns (Task 74)
4. **Display masked keys**: Show only first 8 and last 4 chars
5. **Add actions column**: Revoke action
6. **Handle empty state**: Show message when no keys

### Expected Outcome
Table displaying API keys with masked values and actions.

### Verification Checklist
- [ ] APIKeysTable.tsx component created
- [ ] TanStack Table integrated
- [ ] Keys masked correctly
- [ ] Actions functional

---

## Task 74: Define API Key Columns

### Overview
Define column configuration for API keys table.

### Dependencies
- Task 73: API Keys Table created

### Instructions

1. **Create columns file** at `frontend/components/modules/settings/APIKeys/APIKeyColumns.tsx`
2. **Define Name column**: Display key name/label
3. **Define Key column**: Show masked key (sk_...xyz)
4. **Define Created column**: Display creation date
5. **Define Last Used column**: Show last usage timestamp or "Never"
6. **Define Actions column**: Revoke button

### Key Masking Format
- Full: `sk_live_abc123def456ghi789`
- Masked: `sk_live_...789`

### Expected Outcome
Column definitions with proper formatting and masking.

### Verification Checklist
- [ ] APIKeyColumns.tsx file created
- [ ] All columns defined
- [ ] Key masking implemented
- [ ] Formatting correct

---

## Task 75: Create Generate API Key Modal

### Overview
Create modal for generating new API keys with name input.

### Dependencies
- Task 72: API Keys Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/APIKeys/GenerateKeyModal.tsx`
2. **Include name input**: For identifying the key
3. **Add description field**: Optional usage description
4. **Generate key**: POST `/api/api-keys/generate`
5. **Show full key once**: Display in APIKeyDisplay component
6. **Warn about one-time view**: Key won't be shown again

### Expected Outcome
Modal for generating API keys with one-time key display.

### Verification Checklist
- [ ] GenerateKeyModal.tsx component created
- [ ] Name input included
- [ ] Key generation working
- [ ] One-time display implemented

---

## Task 76: Create API Key Display

### Overview
Create component to display newly generated API key with copy functionality.

### Dependencies
- Task 75: Generate Key Modal created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/APIKeys/APIKeyDisplay.tsx`
2. **Display full key**: Show complete API key
3. **Add copy button**: Copy key to clipboard
4. **Add warning**: "Save this key now. It won't be shown again."
5. **Style prominently**: Use code block styling
6. **Add visibility toggle**: Show/hide key text

### Display Structure
```
Your New API Key
─────────────────────────────────────
⚠️ Save this key now. You won't be able
to see it again.

sk_live_abc123def456ghi789jkl012mno345

[Copy to Clipboard] [👁 Hide]

[Done]
```

### Expected Outcome
API key displayed with copy button and security warning.

### Verification Checklist
- [ ] APIKeyDisplay.tsx component created
- [ ] Full key displayed
- [ ] Copy functionality working
- [ ] Warning prominent
- [ ] Visibility toggle functional

---

## Summary

This document covered integrations and API keys management:

**Integrations:**
1. Integrations Page
2. Integrations Grid
3. Integration Card
4. Integration Status
5. Connect Integration
6. Integration Settings Modal
7. Disconnect Integration

**API Keys:**
8. API Keys Page
9. API Keys Table
10. API Key Columns
11. Generate Key Modal
12. API Key Display

### Next Steps

Continue to [02_Tasks-77-80_API-Keys.md](02_Tasks-77-80_API-Keys.md) to complete API key management.

---

**End of Document 01 of 02**
