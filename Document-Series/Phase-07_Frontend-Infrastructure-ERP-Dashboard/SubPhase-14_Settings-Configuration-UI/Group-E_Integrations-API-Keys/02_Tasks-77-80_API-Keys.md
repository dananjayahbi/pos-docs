# Tasks 77-80: API Keys & Integration Testing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** E - Integrations & API Keys  
> **Document:** 02 of 02  
> **Tasks Covered:** 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-76_Integration-Management.md](01_Tasks-65-76_Integration-Management.md)
- **→ Next Group:** [Group-F_Billing-Testing](../Group-F_Billing-Testing/)

---

## Document Overview

This document covers API key revocation and final integration of the integrations module with backend APIs.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create Revoke API Key Action | Low | 20 min |
| 78 | Connect Integrations to API | Medium | 30 min |

---

## Task 77: Create Revoke API Key Action

### Overview
Create action to revoke (delete) API keys with confirmation dialog to prevent accidental deletion.

### Dependencies
- Task 74: API Key Columns defined

### Instructions

1. **Create component file** at `frontend/components/modules/settings/APIKeys/RevokeKeyAction.tsx`
2. **Accept props**: apiKey object, onRevoke callback
3. **Add revoke button**: In actions column of table
4. **Show confirmation dialog**: AlertDialog with warning
5. **Explain implications**:
   - Applications using this key will lose access
   - This action cannot be undone
6. **Implement revoke**: DELETE `/api/api-keys/{keyId}`
7. **Handle response**:
   - Success: Show toast, remove from table
   - Error: Show error toast
8. **Add loading state**: Disable button during revocation

### Confirmation Dialog
```
Revoke API Key?
─────────────────────────────────────
Are you sure you want to revoke this API key?

⚠️ Warning:
• Applications using this key will immediately
  lose access
• This action cannot be undone
• Consider rotating to a new key first

[Cancel]  [Revoke Key]
```

### API Endpoint
```
DELETE /api/api-keys/{keyId}

Response:
{
  "success": true,
  "message": "API key revoked successfully"
}
```

### Expected Outcome
API keys can be revoked with confirmation and immediate effect.

### Verification Checklist
- [ ] RevokeKeyAction.tsx component created
- [ ] Confirmation dialog shown
- [ ] Warning message clear
- [ ] API integration working
- [ ] Success feedback displayed
- [ ] Key removed from table

---

## Task 78: Connect Integrations to API

### Overview
Integrate all integrations and API keys features with backend API endpoints for complete functionality.

### Dependencies
- All previous tasks in Group E

### Instructions

1. **Create API service file** at `frontend/lib/api/integrations.ts`
2. **Implement integration endpoints**:
   - GET `/api/integrations` - List all integrations
   - GET `/api/integrations/{id}` - Get single integration
   - POST `/api/integrations/{id}/connect` - Connect integration
   - DELETE `/api/integrations/{id}/disconnect` - Disconnect
   - PATCH `/api/integrations/{id}/settings` - Update settings
   - POST `/api/integrations/{id}/test` - Test connection
3. **Implement API keys endpoints**:
   - GET `/api/api-keys` - List all keys
   - POST `/api/api-keys/generate` - Generate new key
   - DELETE `/api/api-keys/{id}` - Revoke key
4. **Add error handling**: Catch and format API errors
5. **Implement caching**: Use SWR or React Query
6. **Add loading states**: Show spinners during operations
7. **Handle OAuth redirects**: Process OAuth callback URLs
8. **Implement retry logic**: For failed requests

### API Endpoints Summary

**Integrations:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/integrations | List integrations |
| GET | /api/integrations/{id} | Get integration |
| POST | /api/integrations/{id}/connect | Connect |
| DELETE | /api/integrations/{id}/disconnect | Disconnect |
| PATCH | /api/integrations/{id}/settings | Update settings |
| POST | /api/integrations/{id}/test | Test connection |

**API Keys:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/api-keys | List keys |
| POST | /api/api-keys/generate | Generate key |
| DELETE | /api/api-keys/{id} | Revoke key |

### Error Handling

| Error Type | HTTP Code | User Message |
|-----------|-----------|--------------|
| Authentication Error | 401 | "Please log in to continue" |
| Forbidden | 403 | "You don't have permission" |
| Not Found | 404 | "Integration not found" |
| Validation Error | 422 | Show field errors |
| Server Error | 500 | "Something went wrong" |

### OAuth Flow

```
OAuth Connection Flow:
─────────────────────────────────────
1. User clicks "Connect"
2. Redirect to provider authorization URL
3. User authorizes on provider site
4. Provider redirects back with code
5. Exchange code for access token
6. Store token securely
7. Update integration status to "Connected"
```

### Caching Strategy

| Data | Cache Duration | Revalidation |
|------|----------------|--------------|
| Integrations List | 5 minutes | On mutation |
| Integration Status | 1 minute | On action |
| API Keys List | 5 minutes | On generation/revoke |

### Loading States

| Action | Loading Indicator |
|--------|------------------|
| List Load | Skeleton cards/rows |
| Connect | Button spinner |
| Disconnect | Button spinner |
| Generate Key | Modal spinner |
| Revoke Key | Button spinner |
| Test Connection | Button spinner |

### Expected Outcome
All integrations and API keys features fully connected to backend with proper error handling and loading states.

### Verification Checklist
- [ ] API service file created
- [ ] All endpoints implemented
- [ ] Error handling comprehensive
- [ ] Caching configured
- [ ] Loading states working
- [ ] OAuth flow functional
- [ ] Retry logic implemented
- [ ] Success/error feedback clear

---

## Summary

This document completed integrations and API keys features:

1. **Revoke API Key Action** - Confirmation and deletion
2. **API Integration** - Complete backend connection

### Complete Integrations Module Structure

```
Integrations & API Keys (Group E Complete)
├── Integrations ✓
│   ├── Integrations Page ✓
│   ├── Integrations Grid ✓
│   ├── Integration Card ✓
│   ├── Integration Status ✓
│   ├── Connect Integration ✓
│   ├── Integration Settings Modal ✓
│   └── Disconnect Integration ✓
│
└── API Keys ✓
    ├── API Keys Page ✓
    ├── API Keys Table ✓
    ├── API Key Columns ✓
    ├── Generate Key Modal ✓
    ├── API Key Display ✓
    ├── Revoke Key Action ✓
    └── API Integration ✓
```

### Available Integrations

| Category | Integrations |
|----------|-------------|
| Payment | Stripe, PayPal, Local Banks |
| Communication | SMS Gateway, Email Service |
| Business | Accounting Software, Shipping Providers |
| Custom | Webhook Integrations |

### API Key Security Features

| Feature | Implementation |
|---------|----------------|
| Key Masking | Show only first 8 and last 4 chars |
| One-Time Display | Full key shown only on generation |
| Secure Storage | Keys encrypted in database |
| Revocation | Immediate effect, no grace period |
| Usage Tracking | Last used timestamp recorded |

### Next Steps

Continue to [Group-F_Billing-Testing](../Group-F_Billing-Testing/) to build:
- Billing and subscription management
- Plan selection and upgrades
- Billing history and invoices
- Audit log
- Final testing and documentation

---

**End of Document 02 of 02 - Group E Complete**
