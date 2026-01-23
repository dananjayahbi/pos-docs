# Tasks 41-42: Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** C - Swagger UI Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-35-40_UI-Configuration.md](02_Tasks-35-40_UI-Configuration.md)
- **→ Next Group:** [../Group-D_ReDoc-Setup/](../Group-D_ReDoc-Setup/)

---

## Document Overview

This document covers testing the Swagger UI interface and verifying that API calls can be successfully executed through the documentation interface.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 41 | Test Swagger UI | Simple |
| 42 | Test API Calls | Medium |

---

## Task 41: Test Swagger UI

### Overview
Comprehensively test the Swagger UI interface to verify all features are working correctly including navigation, display, and authentication.

### Dependencies
- Task 40: Add Custom CSS

### Instructions

1. **Start development server**
   - Ensure database is migrated
   - Start Django development server
   - Verify server runs without errors

2. **Access Swagger UI**
   - Open browser to http://localhost:8000/api/docs/
   - Verify page loads successfully
   - Check for console errors

3. **Test UI appearance**
   - Verify custom CSS applied
   - Check brand colors visible
   - Confirm layout correct
   - Check responsive design

4. **Test navigation features**
   - Test tag navigation
   - Test endpoint expansion
   - Verify deep linking works
   - Check URL updates

5. **Test search/filter**
   - Use filter box
   - Search for endpoints
   - Verify real-time filtering
   - Test various search terms

6. **Test schema display**
   - Expand endpoint details
   - Check request schemas
   - Check response schemas
   - Verify model definitions

7. **Test authorization button**
   - Click "Authorize" button
   - Check modal opens
   - Verify Bearer input field
   - Test modal close

8. **Test display options**
   - Check operation sorting
   - Verify tag sorting
   - Test expansion/collapse
   - Check request duration display

### Testing Checklist

#### Page Load
- [ ] Swagger UI loads at /api/docs/
- [ ] No 404 or 500 errors
- [ ] No browser console errors
- [ ] Page renders completely

#### Visual Appearance
- [ ] Custom CSS applied
- [ ] Brand colors visible
- [ ] Logo/header styled
- [ ] Buttons styled correctly
- [ ] Typography correct
- [ ] Responsive layout works

#### Navigation
- [ ] All tags visible
- [ ] Tags expand/collapse
- [ ] Endpoints expand/collapse
- [ ] Deep linking works
- [ ] URLs update correctly
- [ ] Browser back/forward works

#### Filter/Search
- [ ] Filter box visible
- [ ] Real-time filtering works
- [ ] Case-insensitive search
- [ ] Filters by endpoint name
- [ ] Filters by path
- [ ] Filters by tag

#### Schema Display
- [ ] Endpoints listed
- [ ] HTTP methods shown
- [ ] Request schemas visible
- [ ] Response schemas visible
- [ ] Model definitions displayed
- [ ] Examples shown

#### Authorization
- [ ] Authorize button visible
- [ ] Modal opens correctly
- [ ] Bearer input field present
- [ ] Can enter token
- [ ] Modal closes
- [ ] Token saved indication

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| **CSS not loading** | Static files not collected | Run collectstatic |
| **404 on /api/docs/** | URLs not included | Check URL configuration |
| **No endpoints shown** | No APIs defined | Define ViewSets/APIs |
| **Schema errors** | Invalid schema | Check API definitions |
| **Auth button missing** | Security not configured | Add security schemes |

### Expected Outcome
```
✅ Swagger UI loads successfully
✅ Custom branding visible
✅ All navigation features work
✅ Filter/search functional
✅ Schema displays correctly
✅ Authorization button present
```

### Verification Checklist
- [ ] UI loads without errors
- [ ] Custom CSS applied
- [ ] Navigation works
- [ ] Filter functional
- [ ] Schemas display correctly
- [ ] Authorization UI present
- [ ] All features accessible

---

## Task 42: Test API Calls

### Overview
Test making actual API calls through the Swagger UI interface to verify the "Try It Out" functionality works correctly with authentication.

### Dependencies
- Task 41: Test Swagger UI

### Instructions

1. **Obtain authentication token**
   - Create test user if needed
   - Use /api/token/ endpoint
   - Obtain JWT access token
   - Copy token for use

2. **Add token to Swagger UI**
   - Click "Authorize" button
   - Paste token in Bearer field
   - Click "Authorize" in modal
   - Close modal
   - Verify lock icon appears

3. **Test GET request**
   - Find a GET endpoint
   - Click "Try it out"
   - Add any required parameters
   - Click "Execute"
   - Verify response received

4. **Test POST request**
   - Find a POST endpoint
   - Click "Try it out"
   - Fill request body
   - Add X-Tenant-ID header if needed
   - Click "Execute"
   - Verify 201 Created response

5. **Test authentication requirement**
   - Try endpoint without token
   - Verify 401 Unauthorized
   - Add token
   - Retry request
   - Verify 200 OK

6. **Test different response codes**
   - Test successful requests (2xx)
   - Test validation errors (400)
   - Test unauthorized (401)
   - Test not found (404)
   - Verify error responses formatted

7. **Test request/response display**
   - Check request headers shown
   - Verify request body displayed
   - Check response headers shown
   - Verify response body formatted
   - Check response time displayed

8. **Test persistence**
   - Make authenticated request
   - Reload page
   - Verify token persisted
   - Make another request
   - Verify still authenticated

### API Testing Flow

```
1. Obtain Token
   POST /api/token/
   {
     "username": "testuser",
     "password": "testpass"
   }
   Response: {"access": "eyJ0...", "refresh": "eyJ0..."}

2. Authorize in UI
   Click "Authorize"
   Paste access token
   Close modal

3. Test Endpoint
   GET /api/users/me/
   Execute
   Verify 200 response with user data

4. Test Creation
   POST /api/products/
   {
     "name": "Test Product",
     "price": "99.99"
   }
   Verify 201 response
```

### Testing Scenarios

#### Scenario 1: Anonymous Request
- [ ] Try endpoint without authentication
- [ ] Verify 401 Unauthorized
- [ ] Check error message clear

#### Scenario 2: Authenticated GET
- [ ] Add authentication token
- [ ] Try GET endpoint
- [ ] Verify 200 OK response
- [ ] Check response data

#### Scenario 3: Authenticated POST
- [ ] Try POST endpoint
- [ ] Fill request body
- [ ] Execute request
- [ ] Verify 201 Created
- [ ] Check created resource

#### Scenario 4: Validation Error
- [ ] POST with invalid data
- [ ] Verify 400 Bad Request
- [ ] Check validation errors displayed
- [ ] Errors are clear and helpful

#### Scenario 5: Multi-Tenant Request
- [ ] Add X-Tenant-ID header
- [ ] Make request
- [ ] Verify tenant isolation
- [ ] Check response scoped to tenant

### Request/Response Validation

| Check | Expected Result |
|-------|----------------|
| **Request Headers** | Authorization header present |
| **Request Body** | JSON formatted correctly |
| **Response Status** | Correct status code |
| **Response Headers** | Content-Type correct |
| **Response Body** | Valid JSON |
| **Response Time** | Displayed in UI |
| **Errors** | Clear error messages |

### Authentication Testing

```
# Without Token
GET /api/users/me/
Response: 401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}

# With Token
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJh...
GET /api/users/me/
Response: 200 OK
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com"
}
```

### Expected Outcome
```
✅ Token authentication works
✅ GET requests successful
✅ POST requests create resources
✅ PUT/PATCH requests update resources
✅ DELETE requests remove resources
✅ Validation errors displayed
✅ Response times shown
✅ Token persists across reloads
```

### Verification Checklist
- [ ] Can obtain JWT token
- [ ] Token adds successfully
- [ ] Lock icon appears when authorized
- [ ] GET requests work
- [ ] POST requests work
- [ ] PUT/PATCH requests work
- [ ] DELETE requests work
- [ ] 401 without authentication
- [ ] 200 with authentication
- [ ] Validation errors displayed
- [ ] Request headers shown
- [ ] Response headers shown
- [ ] Response body formatted
- [ ] Response time displayed
- [ ] Token persists on reload

---

## Summary

After completing these tasks, the Swagger UI will be fully tested and verified as a working interactive API documentation interface.

### What We Accomplished
1. ✅ Tested complete Swagger UI interface
2. ✅ Verified all UI features work
3. ✅ Tested API calls through interface
4. ✅ Verified authentication flow
5. ✅ Confirmed all HTTP methods work
6. ✅ Validated response handling

### Next Steps (Group D)
- Configure ReDoc interface
- Set up ReDoc theme
- Add ReDoc URL
- Configure ReDoc display options
- Compare Swagger and ReDoc

### Testing Summary

#### UI Features Tested
- ✅ Page loading and rendering
- ✅ Custom CSS and branding
- ✅ Navigation and deep linking
- ✅ Filter/search functionality
- ✅ Schema display
- ✅ Authorization UI

#### API Features Tested
- ✅ JWT token authentication
- ✅ GET requests
- ✅ POST requests
- ✅ PUT/PATCH requests
- ✅ DELETE requests
- ✅ Error handling
- ✅ Token persistence

### Access Points
- **Swagger UI:** http://localhost:8000/api/docs/
- **Schema JSON:** http://localhost:8000/api/schema/
- **Token Endpoint:** http://localhost:8000/api/token/

### Common Test Endpoints
```
# Authentication
POST /api/token/              # Get token
POST /api/token/refresh/      # Refresh token

# Users
GET  /api/users/              # List users
GET  /api/users/me/           # Current user
POST /api/users/              # Create user

# Example Module
GET  /api/products/           # List products
POST /api/products/           # Create product
GET  /api/products/{id}/      # Get product
PUT  /api/products/{id}/      # Update product
DELETE /api/products/{id}/    # Delete product
```

### Git Commit Message
```
test(api-docs): verify Swagger UI interface and API calls

- Test Swagger UI loads and renders correctly
- Verify custom CSS and branding applied
- Test navigation, filtering, and deep linking
- Test JWT authentication flow
- Test GET, POST, PUT, PATCH, DELETE requests
- Verify request/response display
- Test token persistence across reloads
- Confirm error handling and validation

Part of SubPhase-11 Group C (Tasks 41-42)
Group C Complete: Swagger UI Setup
```

### Group C Completion Checklist
- [ ] All 14 tasks completed (29-42)
- [ ] drf-spectacular-sidecar installed
- [ ] Swagger UI configured at /api/docs/
- [ ] Theme and custom CSS applied
- [ ] Try It Out enabled
- [ ] Authentication configured
- [ ] All features tested
- [ ] API calls verified
- [ ] Changes committed to git
- [ ] Ready to proceed to Group D
