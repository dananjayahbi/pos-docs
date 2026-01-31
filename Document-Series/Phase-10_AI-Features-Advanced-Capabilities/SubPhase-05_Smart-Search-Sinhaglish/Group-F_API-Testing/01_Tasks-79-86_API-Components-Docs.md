# Tasks 79-86: API, Components, and Documentation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** F - API & Testing  
> **Document:** 01 of 01  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next SubPhase:** [SubPhase-06_AI-Chatbot-Backend](../../SubPhase-06_AI-Chatbot-Backend/)

---

## Document Overview

This document covers the complete implementation of Sinhaglish search functionality, from backend API endpoints to frontend components and comprehensive testing. It establishes the API layer using Django REST Framework, creates TypeScript integration on the frontend, implements multi-script display components, develops end-to-end integration tests, and produces comprehensive documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Sinhaglish API | Medium | 45 min |
| 80 | Create Translate Endpoint | Low | 25 min |
| 81 | Create Dictionary API | Low | 30 min |
| 82 | Create Sinhaglish Types | Low | 20 min |
| 83 | Create Sinhaglish Client | Medium | 40 min |
| 84 | Create Multi-Script Display | Medium | 35 min |
| 85 | Create Integration Tests | Medium | 50 min |
| 86 | Create Documentation | Low | 30 min |

---

## Task 79: Create Sinhaglish API

### Overview
Create a comprehensive Django REST Framework ViewSet for Sinhaglish search functionality. This API provides the backend foundation for translating romanized Sinhala queries into Unicode Sinhala text, enabling intelligent search across products and inventory. The ViewSet handles translation requests, dictionary lookups, and query expansion for enhanced search capabilities.

### Dependencies
- Task 78: Create Learning System (from Group E)
- Django REST Framework installed and configured
- Sinhaglish models and services from previous groups
- Database with SinhaglishMapping table populated

### Instructions

1. **Locate the API views directory**
   - Navigate to `backend/apps/search/sinhaglish/` directory
   - Create new directory named `api` if not exists
   - This will contain all API-related code

2. **Create the ViewSet file**
   - Create `views.py` in the `api/` directory
   - Import Django REST Framework components (ViewSet, Response, status)
   - Import Sinhaglish services and models from previous tasks

3. **Define the SinhaglishViewSet class**
   - Create class inheriting from `viewsets.ViewSet`
   - Configure authentication and permission classes
   - Set up any required middleware or throttling

4. **Plan ViewSet actions**
   - List available endpoints and HTTP methods
   - Define action decorators for custom endpoints
   - Plan response structure for each action

5. **Implement base configuration**
   - Set queryset if needed (for admin interface)
   - Define serializer classes for request/response validation
   - Configure pagination if applicable

6. **Add error handling structure**
   - Define exception handling for common errors
   - Plan validation error responses
   - Configure logging for debugging

7. **Register ViewSet with router**
   - Update API router configuration
   - Define URL prefix (e.g., `/api/sinhaglish/`)
   - Test endpoint availability

### ViewSet Structure

```
SinhaglishViewSet
├── translate (POST)     # Task 80
├── dictionary (GET)     # Task 81
├── suggest (GET)        # Optional: autocomplete
└── validate (POST)      # Optional: query validation
```

### API Architecture

```
┌────────────────────────────────────────┐
│         Client Request                 │
│   (romanized query: "kiri kesel")     │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│      SinhaglishViewSet                 │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Authentication & Permissions    │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Request Validation              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Sinhaglish Service              │ │
│  │  (Translation Logic)             │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  Response Formatting             │ │
│  └──────────────────────────────────┘ │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│         Client Response                │
│  { original, expanded, tokens, ... }   │
└────────────────────────────────────────┘
```

### ViewSet Configuration

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Authentication | Verify user identity | Token or session auth |
| Permissions | Control access | IsAuthenticated or custom |
| Throttling | Rate limiting | User or anonymous rates |
| Pagination | Limit results | PageNumberPagination |
| Filtering | Query filtering | DjangoFilterBackend |

### URL Routing

| Endpoint Pattern | ViewSet Action | HTTP Method |
|------------------|----------------|-------------|
| `/api/sinhaglish/translate/` | translate | POST |
| `/api/sinhaglish/dictionary/` | dictionary | GET |
| `/api/sinhaglish/suggest/` | suggest | GET |

### Expected Outcome
- Functional DRF ViewSet with routing configured
- Proper authentication and permissions setup
- Error handling structure in place
- Ready to implement specific endpoint actions
- URL patterns registered and accessible

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/api/views.py` created
- [ ] SinhaglishViewSet class defined
- [ ] Authentication and permissions configured
- [ ] ViewSet registered with DRF router
- [ ] API endpoints accessible via URLs
- [ ] Import statements for required services
- [ ] Basic error handling implemented

---

## Task 80: Create Translate Endpoint

### Overview
Implement the core translation endpoint that converts romanized Sinhala text into Unicode Sinhala. This POST endpoint receives romanized queries, performs dictionary lookups, applies phonetic matching, expands queries with translations, and returns comprehensive translation results including individual token translations and full Sinhala Unicode text.

### Dependencies
- Task 79: Create Sinhaglish API
- SinhaglishService from Task 73 (Query Expansion)
- Dictionary mappings populated

### Instructions

1. **Define the translate action**
   - Add `@action` decorator with `methods=['POST']`
   - Set URL path to `translate`
   - Specify detail=False for list-level action

2. **Create request serializer**
   - Define serializer class for translate request
   - Include field: `query` (string, required)
   - Add validation rules (max length, required check)

3. **Implement request validation**
   - Check that query parameter is provided
   - Validate query is not empty string
   - Sanitize input (trim whitespace, handle special chars)
   - Return 400 Bad Request if validation fails

4. **Process translation request**
   - Extract query from request data
   - Pass query to SinhaglishService for expansion
   - Retrieve expanded query results
   - Handle service exceptions gracefully

5. **Build translation response**
   - Include original romanized query
   - Include expanded query with Sinhala terms
   - Include token-by-token translation array
   - Include full Sinhala Unicode text

6. **Format token translations**
   - For each token in query, provide:
     - Original romanized token
     - Sinhala Unicode translation
     - English meaning if available
     - Match type (exact, phonetic, variant)
   - Handle unmapped tokens gracefully

7. **Return successful response**
   - Use Response() with status 200
   - Format response according to schema
   - Include all translation components

8. **Add error handling**
   - Catch service exceptions
   - Return appropriate error messages
   - Log errors for debugging

### Translate Request Schema

```
POST /api/sinhaglish/translate/

Request Body:
{
  "query": "kiri kesel"
}
```

### Translate Response Schema

```
Response (200 OK):
{
  "original": "kiri kesel",
  "expanded": "කිරි කෙසෙල් kiri kesel",
  "tokens": [
    {
      "token": "kiri",
      "sinhala": "කිරි",
      "english": "milk",
      "matched": "exact"
    },
    {
      "token": "kesel",
      "sinhala": "කෙසෙල්",
      "english": "banana",
      "matched": "exact"
    }
  ],
  "sinhala": "කිරි කෙසෙල්"
}
```

### Translation Flow

```
1. Client Request
   │
   └─→ "kiri kesel"
        │
        ▼
2. Validation
   │
   ├─→ Query not empty? ✓
   ├─→ Valid characters? ✓
   └─→ Within length limit? ✓
        │
        ▼
3. Tokenization
   │
   └─→ ["kiri", "kesel"]
        │
        ▼
4. Dictionary Lookup
   │
   ├─→ "kiri" → "කිරි" (milk)
   └─→ "kesel" → "කෙසෙල්" (banana)
        │
        ▼
5. Query Expansion
   │
   └─→ "කිරි කෙසෙල් kiri kesel"
        │
        ▼
6. Response Building
   │
   └─→ {original, expanded, tokens, sinhala}
```

### Token Translation Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| token | string | Original romanized token | "kiri" |
| sinhala | string | Sinhala Unicode | "කිරි" |
| english | string | English meaning | "milk" |
| matched | string | Match type | "exact" \| "phonetic" \| "variant" |

### Match Types

| Match Type | Description | Priority |
|------------|-------------|----------|
| exact | Perfect dictionary match | 1 (highest) |
| variant | Alternate spelling match | 2 |
| phonetic | Phonetic similarity match | 3 |
| none | No match found | 4 (lowest) |

### Error Handling

| Error Case | Status Code | Response Message |
|------------|-------------|------------------|
| Missing query | 400 | "Query parameter is required" |
| Empty query | 400 | "Query cannot be empty" |
| Service error | 500 | "Translation service error" |
| Database error | 500 | "Database connection error" |

### Expected Outcome
- Functional translate endpoint accepting POST requests
- Query expansion with Sinhala translations
- Token-by-token translation details
- Full Sinhala Unicode text output
- Proper error handling and validation

### Verification Checklist
- [ ] Translate action defined with @action decorator
- [ ] Request serializer validates input
- [ ] Query parameter extracted and validated
- [ ] SinhaglishService integration working
- [ ] Response includes original, expanded, tokens, sinhala
- [ ] Token translations include all fields
- [ ] Match types correctly identified
- [ ] Error responses return appropriate status codes
- [ ] Endpoint accessible at `/api/sinhaglish/translate/`

---

## Task 81: Create Dictionary API

### Overview
Implement the dictionary lookup endpoint that provides searchable access to the Sinhaglish dictionary. This GET endpoint allows users to search for words, filter by category, browse entries, and retrieve word details including romanized forms, Sinhala Unicode, English meanings, and variant spellings. This endpoint supports the dictionary management interface and provides autocomplete functionality.

### Dependencies
- Task 79: Create Sinhaglish API
- SinhaglishMapping model with populated data

### Instructions

1. **Define the dictionary action**
   - Add `@action` decorator with `methods=['GET']`
   - Set URL path to `dictionary`
   - Specify detail=False for list-level action

2. **Create query parameters**
   - `q` (optional): Search query for filtering
   - `category` (optional): Filter by word category
   - `limit` (optional): Results per page (default 20)
   - `offset` (optional): Pagination offset (default 0)

3. **Implement search functionality**
   - Search across romanized field
   - Search across english_meaning field
   - Use case-insensitive partial matching
   - Combine search terms with OR logic

4. **Add category filtering**
   - Filter by category if provided
   - Support categories: food, product, general, brand
   - Validate category value against allowed options

5. **Apply pagination**
   - Use limit and offset parameters
   - Default to 20 results per page
   - Include total count in response
   - Calculate has_next indicator

6. **Build dictionary response**
   - Return list of dictionary entries
   - Include pagination metadata
   - Format each entry with all fields

7. **Format entry data**
   - Include romanized form
   - Include Sinhala Unicode text
   - Include English meaning
   - Include category
   - Include variant spellings array

8. **Handle empty results**
   - Return empty array with count 0
   - Include appropriate message
   - Return 200 status (not 404)

### Dictionary Endpoint Schema

```
GET /api/sinhaglish/dictionary/

Query Parameters:
- q: Search term (optional)
- category: Filter category (optional)
- limit: Results per page (default: 20)
- offset: Pagination offset (default: 0)

Example:
GET /api/sinhaglish/dictionary/?q=kiri&limit=10
```

### Dictionary Response Schema

```
Response (200 OK):
{
  "entries": [
    {
      "id": 1,
      "romanized": "kiri",
      "sinhala_text": "කිරි",
      "english_meaning": "milk",
      "category": "food",
      "variants": ["keeri", "kiri"],
      "phonetic": "kɪrɪ"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "has_next": false
}
```

### Search Flow

```
1. Client Request
   │
   └─→ GET /api/dictionary/?q=kiri&category=food
        │
        ▼
2. Query Building
   │
   ├─→ Filter by search term "kiri"
   └─→ Filter by category "food"
        │
        ▼
3. Database Query
   │
   ├─→ Search romanized ILIKE '%kiri%'
   ├─→ Search english_meaning ILIKE '%kiri%'
   └─→ Filter category = 'food'
        │
        ▼
4. Pagination
   │
   ├─→ Apply limit (10)
   └─→ Apply offset (0)
        │
        ▼
5. Response Formatting
   │
   └─→ {entries[], total, limit, offset, has_next}
```

### Dictionary Entry Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | integer | Database ID | 1 |
| romanized | string | English spelling | "kiri" |
| sinhala_text | string | Sinhala Unicode | "කිරි" |
| english_meaning | string | Translation | "milk" |
| category | string | Word category | "food" |
| variants | array | Alternate spellings | ["keeri", "kiri"] |
| phonetic | string | IPA pronunciation | "kɪrɪ" |

### Category Values

| Category | Description | Examples |
|----------|-------------|----------|
| food | Food and beverages | kiri, kesel, bath |
| product | Product names | soap, tel, pas |
| general | Common words | loku, podi, alu |
| brand | Brand names | Specific brands |

### Search Behavior

| Search Term | Matches | Logic |
|-------------|---------|-------|
| "kir" | kiri, kiri piti | Partial match (romanized) |
| "milk" | kiri | Partial match (english_meaning) |
| "ke" | kesel, keeri | Prefix match |

### Pagination Example

| Request | Offset | Limit | Returns |
|---------|--------|-------|---------|
| Page 1 | 0 | 20 | Entries 1-20 |
| Page 2 | 20 | 20 | Entries 21-40 |
| Page 3 | 40 | 20 | Entries 41-60 |

### Expected Outcome
- Functional dictionary endpoint with search capability
- Category filtering support
- Pagination with metadata
- Comprehensive entry data in response
- Support for autocomplete and browsing

### Verification Checklist
- [ ] Dictionary action defined with @action decorator
- [ ] Query parameters (q, category, limit, offset) implemented
- [ ] Search functionality across romanized and english fields
- [ ] Category filtering works correctly
- [ ] Pagination applied with limit and offset
- [ ] Response includes entries array and metadata
- [ ] Entry format includes all required fields
- [ ] Empty results return properly formatted response
- [ ] Endpoint accessible at `/api/sinhaglish/dictionary/`

---

## Task 82: Create Sinhaglish Types

### Overview
Define comprehensive TypeScript type definitions for the Sinhaglish API. These types provide strong typing for API requests and responses, ensuring type safety across the frontend application. The types cover translation requests, translation responses, token translations, dictionary entries, and pagination metadata.

### Dependencies
- Task 81: Create Dictionary API (for complete schema understanding)
- TypeScript configuration in frontend project

### Instructions

1. **Locate types directory**
   - Navigate to `frontend/lib/search/sinhaglish/` directory
   - Create file named `types.ts`
   - This file will contain all Sinhaglish-related types

2. **Define TranslateRequest type**
   - Create interface for translate endpoint request
   - Include query field as required string
   - Add JSDoc comments for documentation

3. **Define TokenTranslation type**
   - Create interface for individual token translations
   - Include token, sinhala, english, matched fields
   - Define matched as union of literal types

4. **Define TranslateResponse type**
   - Create interface for translate endpoint response
   - Include original, expanded, tokens array, sinhala fields
   - Use TokenTranslation type for tokens array

5. **Define DictionaryEntry type**
   - Create interface for dictionary entry
   - Include all fields from API response
   - Use appropriate TypeScript types for each field

6. **Define DictionaryResponse type**
   - Create interface for dictionary endpoint response
   - Include entries array, pagination metadata
   - Use DictionaryEntry type for entries array

7. **Define helper types**
   - Create MatchType as union of literal types
   - Create CategoryType for dictionary categories
   - Create any other utility types needed

8. **Export all types**
   - Export all interfaces and types
   - Use named exports for better tree-shaking
   - Add JSDoc comments for each type

### Type Structure

```
types.ts
├── TranslateRequest
├── TokenTranslation
├── TranslateResponse
├── DictionaryEntry
├── DictionaryResponse
├── MatchType
└── CategoryType
```

### TranslateRequest Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| query | string | Yes | Romanized query to translate |

### TokenTranslation Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Original romanized token |
| sinhala | string | Yes | Sinhala Unicode translation |
| english | string | Yes | English meaning |
| matched | MatchType | Yes | How token was matched |

### TranslateResponse Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| original | string | Yes | Original romanized query |
| expanded | string | Yes | Query with Sinhala translations |
| tokens | TokenTranslation[] | Yes | Array of token translations |
| sinhala | string | Yes | Full Sinhala Unicode text |

### DictionaryEntry Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Database ID |
| romanized | string | Yes | English spelling |
| sinhala_text | string | Yes | Sinhala Unicode |
| english_meaning | string | Yes | English translation |
| category | CategoryType | Yes | Word category |
| variants | string[] | Yes | Alternate spellings |
| phonetic | string | No | IPA pronunciation |

### DictionaryResponse Type

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entries | DictionaryEntry[] | Yes | Array of dictionary entries |
| total | number | Yes | Total number of results |
| limit | number | Yes | Results per page |
| offset | number | Yes | Pagination offset |
| has_next | boolean | Yes | More results available |

### Helper Types

| Type | Definition | Usage |
|------|------------|-------|
| MatchType | "exact" \| "phonetic" \| "variant" \| "none" | Token matching |
| CategoryType | "food" \| "product" \| "general" \| "brand" | Dictionary categories |

### Type Usage Example

```
// API client method signature
async translate(request: TranslateRequest): Promise<TranslateResponse>

// Component props
interface SearchResultProps {
  translation: TranslateResponse;
}

// Dictionary search
interface DictionarySearchProps {
  entries: DictionaryEntry[];
  onSelect: (entry: DictionaryEntry) => void;
}
```

### Type Benefits

| Benefit | Description |
|---------|-------------|
| Type Safety | Catch errors at compile time |
| IntelliSense | Better IDE autocomplete |
| Documentation | Self-documenting code |
| Refactoring | Safe code changes |
| Validation | Runtime type checking |

### Expected Outcome
- Complete TypeScript type definitions for Sinhaglish API
- Strong typing for all API interactions
- Reusable types across frontend components
- Improved developer experience with IntelliSense

### Verification Checklist
- [ ] `frontend/lib/search/sinhaglish/types.ts` created
- [ ] TranslateRequest interface defined
- [ ] TokenTranslation interface defined
- [ ] TranslateResponse interface defined
- [ ] DictionaryEntry interface defined
- [ ] DictionaryResponse interface defined
- [ ] MatchType union type defined
- [ ] CategoryType union type defined
- [ ] All types exported properly
- [ ] JSDoc comments added for documentation
- [ ] No TypeScript compilation errors

---

## Task 83: Create Sinhaglish Client

### Overview
Create a TypeScript API client for interacting with the Sinhaglish backend endpoints. This client provides type-safe methods for translation and dictionary lookups, handles HTTP requests and responses, implements error handling, and provides a clean interface for frontend components to consume the Sinhaglish API.

### Dependencies
- Task 82: Create Sinhaglish Types
- Task 80: Create Translate Endpoint
- Task 81: Create Dictionary API
- Fetch API or HTTP client library (axios)

### Instructions

1. **Create client file**
   - Navigate to `frontend/lib/search/sinhaglish/` directory
   - Create file named `client.ts`
   - Import types from types.ts file

2. **Define API configuration**
   - Define base API URL (from environment variable)
   - Set default headers (Content-Type, Authorization if needed)
   - Configure timeout and retry settings

3. **Create SinhaglishClient class**
   - Define class with private properties for config
   - Implement constructor to initialize configuration
   - Add private helper methods for HTTP requests

4. **Implement translate method**
   - Create async method accepting TranslateRequest
   - Make POST request to /api/sinhaglish/translate/
   - Return typed TranslateResponse
   - Handle errors and network failures

5. **Implement lookup method**
   - Create async method for dictionary lookups
   - Accept search query, category, pagination params
   - Make GET request to /api/sinhaglish/dictionary/
   - Return typed DictionaryResponse

6. **Add error handling**
   - Create custom error classes for API errors
   - Handle network errors (timeout, connection)
   - Handle API errors (4xx, 5xx)
   - Provide meaningful error messages

7. **Implement request helpers**
   - Create private method for GET requests
   - Create private method for POST requests
   - Add request/response interceptors if needed
   - Handle authentication tokens

8. **Create client instance**
   - Export singleton instance of SinhaglishClient
   - Configure with environment-based settings
   - Make available for import throughout app

### Client Architecture

```
SinhaglishClient
├── Configuration
│   ├── baseURL
│   ├── headers
│   └── timeout
├── Public Methods
│   ├── translate()
│   └── lookup()
└── Private Helpers
    ├── _get()
    ├── _post()
    └── _handleError()
```

### Client Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| translate | TranslateRequest | Promise<TranslateResponse> | Translate query |
| lookup | query, category, limit, offset | Promise<DictionaryResponse> | Dictionary search |

### Translate Method Signature

```
async translate(request: TranslateRequest): Promise<TranslateResponse>

Usage:
const result = await sinhaglishClient.translate({ 
  query: "kiri kesel" 
});
```

### Lookup Method Signature

```
async lookup(
  query?: string,
  category?: CategoryType,
  limit?: number,
  offset?: number
): Promise<DictionaryResponse>

Usage:
const result = await sinhaglishClient.lookup("kiri", "food", 10, 0);
```

### Error Handling

| Error Type | Class | When Thrown |
|------------|-------|-------------|
| Network Error | NetworkError | Connection failed |
| Validation Error | ValidationError | Invalid request data |
| Server Error | ServerError | 5xx response |
| Not Found | NotFoundError | 404 response |

### Request Flow

```
1. Component Call
   │
   └─→ sinhaglishClient.translate({ query: "kiri" })
        │
        ▼
2. Request Preparation
   │
   ├─→ Build URL
   ├─→ Set headers
   └─→ Serialize body
        │
        ▼
3. HTTP Request
   │
   └─→ POST /api/sinhaglish/translate/
        │
        ▼
4. Response Handling
   │
   ├─→ Check status code
   ├─→ Parse JSON
   └─→ Validate response type
        │
        ▼
5. Return Result
   │
   └─→ TranslateResponse
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| baseURL | string | process.env.API_URL | API base URL |
| timeout | number | 30000 | Request timeout (ms) |
| headers | object | { Content-Type } | Default headers |
| retries | number | 3 | Retry attempts |

### Client Singleton Pattern

```
// client.ts
export const sinhaglishClient = new SinhaglishClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000
});

// Usage in components
import { sinhaglishClient } from '@/lib/search/sinhaglish/client';
```

### Expected Outcome
- Type-safe API client for Sinhaglish endpoints
- Clean method signatures with TypeScript types
- Comprehensive error handling
- Singleton instance ready for use
- Reusable across all frontend components

### Verification Checklist
- [ ] `frontend/lib/search/sinhaglish/client.ts` created
- [ ] SinhaglishClient class defined
- [ ] translate() method implemented
- [ ] lookup() method implemented
- [ ] Error handling implemented
- [ ] Request helpers created
- [ ] Types imported and used correctly
- [ ] Singleton instance exported
- [ ] Configuration uses environment variables
- [ ] No TypeScript compilation errors

---

## Task 84: Create Multi-Script Display

### Overview
Create a React component that displays text in multiple scripts simultaneously (romanized English and Sinhala Unicode). This component is used in search results and product listings to show both the romanized product name and the Sinhala translation, with support for highlighting matching text, toggling script visibility, and responsive layout for different screen sizes.

### Dependencies
- Task 83: Create Sinhaglish Client
- Task 82: Create Sinhaglish Types
- React and Next.js setup
- Tailwind CSS for styling

### Instructions

1. **Create component directory**
   - Navigate to `frontend/components/search/` directory
   - Create new directory named `sinhaglish`
   - Create file named `MultiScriptDisplay.tsx`

2. **Define component props interface**
   - Create MultiScriptDisplayProps interface
   - Include primary text (required)
   - Include secondary text (optional, Sinhala)
   - Include highlight text (optional)
   - Include size variant (small, medium, large)
   - Include show toggle option (boolean)

3. **Implement component structure**
   - Create functional component with props
   - Use React hooks for state (toggle visibility)
   - Return JSX with two-tier text display

4. **Render primary text**
   - Display romanized text as main content
   - Apply appropriate font size based on variant
   - Implement text highlighting if match provided

5. **Render secondary text**
   - Display Sinhala Unicode text below primary
   - Use smaller font size and muted color
   - Show/hide based on toggle state
   - Apply appropriate Sinhala font

6. **Implement highlighting**
   - Split text on highlight term
   - Wrap matched portions in highlight span
   - Apply highlight styling (background color)
   - Handle case-insensitive matching

7. **Add visibility toggle**
   - Create button to show/hide Sinhala text
   - Use icon (eye/eye-off) for toggle button
   - Update state on toggle click
   - Remember preference in localStorage (optional)

8. **Apply responsive styling**
   - Use Tailwind CSS for layout
   - Stack text vertically
   - Adjust spacing for different sizes
   - Ensure readability on mobile devices

9. **Add accessibility features**
   - Use semantic HTML (span with lang attribute)
   - Add ARIA labels for toggle button
   - Ensure keyboard navigation works
   - Maintain sufficient contrast ratios

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| primary | string | Yes | - | Romanized text |
| secondary | string | No | undefined | Sinhala Unicode text |
| highlight | string | No | undefined | Text to highlight |
| size | "sm" \| "md" \| "lg" | No | "md" | Display size |
| showToggle | boolean | No | false | Show visibility toggle |
| className | string | No | "" | Additional CSS classes |

### Component Structure

```
┌─────────────────────────────────────┐
│  Primary Text (Romanized)           │
│  "Kiri Kesel"                       │
│                                     │
│  Secondary Text (Sinhala)           │
│  "කිරි කෙසෙල්"                      │
└─────────────────────────────────────┘
```

### With Highlighting

```
┌─────────────────────────────────────┐
│  Primary Text                       │
│  "[Kiri] Kesel"                     │
│   ↑ highlighted                     │
│                                     │
│  Secondary Text                     │
│  "[කිරි] කෙසෙල්"                    │
└─────────────────────────────────────┘
```

### Size Variants

| Size | Primary Font | Secondary Font | Line Height |
|------|--------------|----------------|-------------|
| Small | text-sm | text-xs | leading-tight |
| Medium | text-base | text-sm | leading-normal |
| Large | text-lg | text-base | leading-relaxed |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex flex-col gap-1` | Vertical layout |
| Primary | `font-medium text-gray-900` | Main text |
| Secondary | `text-sm text-gray-600` | Sinhala text |
| Highlight | `bg-yellow-200 font-semibold` | Matched text |
| Toggle | `text-blue-600 hover:text-blue-800` | Toggle button |

### Highlighting Logic

```
1. Input
   │
   ├─→ primary: "Kiri Kesel"
   └─→ highlight: "Kiri"
        │
        ▼
2. Split Text
   │
   ├─→ Before: ""
   ├─→ Match: "Kiri"
   └─→ After: " Kesel"
        │
        ▼
3. Render
   │
   └─→ <span className="bg-yellow-200">Kiri</span> Kesel
```

### Toggle Functionality

| State | Sinhala Visible | Button Icon | Button Text |
|-------|-----------------|-------------|-------------|
| Shown | Yes | Eye icon | Hide Sinhala |
| Hidden | No | Eye-off icon | Show Sinhala |

### Usage Examples

```
// Basic usage
<MultiScriptDisplay 
  primary="Kiri" 
  secondary="කිරි" 
/>

// With highlighting
<MultiScriptDisplay 
  primary="Kiri Kesel" 
  secondary="කිරි කෙසෙල්"
  highlight="Kiri"
/>

// With toggle
<MultiScriptDisplay 
  primary="Kiri Kesel" 
  secondary="කිරි කෙසෙල්"
  showToggle={true}
  size="lg"
/>
```

### Expected Outcome
- Reusable component for dual-script display
- Support for highlighting matching text
- Optional visibility toggle for Sinhala text
- Responsive design for all screen sizes
- Accessible to screen readers and keyboard users

### Verification Checklist
- [ ] `frontend/components/search/sinhaglish/MultiScriptDisplay.tsx` created
- [ ] Props interface defined with all options
- [ ] Primary text renders correctly
- [ ] Secondary Sinhala text renders when provided
- [ ] Highlighting functionality works
- [ ] Size variants implemented
- [ ] Toggle button shows/hides Sinhala text
- [ ] Tailwind CSS styling applied
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 85: Create Integration Tests

### Overview
Develop comprehensive end-to-end integration tests for the Sinhaglish search system. These tests verify the complete flow from API requests through translation processing to search result retrieval. Tests cover basic translation, multi-token queries, phonetic matching, dictionary lookups, full search integration, and learning system interaction.

### Dependencies
- Task 84: Create Multi-Script Display
- Task 80: Create Translate Endpoint
- Task 81: Create Dictionary API
- pytest and pytest-django installed
- Test database with sample data

### Instructions

1. **Create test file**
   - Navigate to `tests/search/` directory
   - Create file named `test_sinhaglish_e2e.py`
   - Import pytest, Django test client, factories

2. **Set up test fixtures**
   - Create pytest fixture for API client
   - Create fixture for authenticated user
   - Create fixture for test database with sample data
   - Create fixture for Sinhaglish mappings

3. **Implement test_translate_basic**
   - Test single-word translation
   - POST to /api/sinhaglish/translate/ with "kiri"
   - Assert response contains correct Sinhala "කිරි"
   - Verify token translation includes english meaning
   - Check response structure matches schema

4. **Implement test_translate_multi**
   - Test multi-token query
   - POST with "kiri kesel" (milk banana)
   - Assert both tokens translated correctly
   - Verify tokens array has 2 elements
   - Check expanded query includes both Sinhala terms

5. **Implement test_phonetic_match**
   - Test phonetic similarity matching
   - POST with variant spelling like "keeri" for "kiri"
   - Assert translation still returns "කිරි"
   - Verify matched field indicates "phonetic"
   - Test soundex or phonetic algorithm

6. **Implement test_dictionary_lookup**
   - Test dictionary API endpoint
   - GET /api/sinhaglish/dictionary/?q=kiri
   - Assert response includes matching entries
   - Verify pagination metadata present
   - Check entry structure matches schema

7. **Implement test_search_integration**
   - Test full search flow end-to-end
   - Create products with Sinhala names
   - POST translation for romanized query
   - Use expanded query to search products
   - Assert correct products returned

8. **Implement test_learning**
   - Test learning system integration
   - Create user feedback on translation
   - POST translation with user-provided correction
   - Verify feedback recorded in database
   - Test that future queries reflect learning

9. **Add test utilities**
   - Create helper function for creating test mappings
   - Create helper for asserting response structure
   - Create helper for comparing Sinhala strings
   - Add fixtures for common test data

10. **Configure test execution**
    - Set up test database configuration
    - Configure pytest markers for integration tests
    - Add test coverage reporting
    - Document how to run tests

### Test Structure

```
test_sinhaglish_e2e.py
├── Fixtures
│   ├── api_client
│   ├── authenticated_user
│   ├── test_mappings
│   └── test_products
├── Basic Tests
│   ├── test_translate_basic
│   ├── test_translate_multi
│   └── test_phonetic_match
├── API Tests
│   ├── test_dictionary_lookup
│   └── test_pagination
├── Integration Tests
│   ├── test_search_integration
│   └── test_learning
└── Utilities
    └── Helper functions
```

### Test Scenarios

| Test Name | Input | Expected Output | Verification |
|-----------|-------|-----------------|--------------|
| test_translate_basic | "kiri" | කිරි (milk) | Exact match |
| test_translate_multi | "kiri kesel" | කිරි කෙසෙල් | Both tokens |
| test_phonetic_match | "keeri" | කිරි (milk) | Phonetic match |
| test_dictionary_lookup | q=kiri | entries[0].romanized="kiri" | Search works |
| test_search_integration | "kiri" | Product with Sinhala name | End-to-end |
| test_learning | Feedback | Recorded in DB | Learning system |

### Test Data Setup

| Data Type | Records | Purpose |
|-----------|---------|---------|
| SinhaglishMapping | 20+ | Dictionary entries |
| Product | 10+ | Search results |
| User | 1 | Authentication |
| Feedback | 5+ | Learning tests |

### Test Assertions

```
# Basic Translation Test
def test_translate_basic(api_client, test_mappings):
    1. POST /api/sinhaglish/translate/
    2. Body: { "query": "kiri" }
    3. Assert response.status_code == 200
    4. Assert response.data["original"] == "kiri"
    5. Assert response.data["sinhala"] == "කිරි"
    6. Assert len(response.data["tokens"]) == 1
    7. Assert response.data["tokens"][0]["english"] == "milk"
    8. Assert response.data["tokens"][0]["matched"] == "exact"
```

### Integration Test Flow

```
1. Setup
   │
   ├─→ Create test mappings
   ├─→ Create test products
   └─→ Authenticate test user
        │
        ▼
2. Translation
   │
   └─→ POST /api/translate/ with "kiri kesel"
        │
        ├─→ Verify translation
        └─→ Get expanded query
             │
             ▼
3. Search
   │
   └─→ GET /api/products/?search={expanded}
        │
        ├─→ Verify products returned
        └─→ Check Sinhala names matched
             │
             ▼
4. Verification
   │
   └─→ Assert expected products in results
```

### Test Coverage Goals

| Module | Target Coverage | Critical Paths |
|--------|-----------------|----------------|
| API Views | 90%+ | All endpoints |
| Translation Service | 95%+ | Core logic |
| Dictionary Lookup | 90%+ | Search & filter |
| Learning System | 85%+ | Feedback flow |

### Test Execution

| Command | Purpose | When to Run |
|---------|---------|-------------|
| `pytest tests/search/` | Run all search tests | Before commit |
| `pytest -m integration` | Run integration only | Before merge |
| `pytest --cov` | With coverage | CI/CD pipeline |

### Expected Outcome
- Comprehensive test suite covering all Sinhaglish features
- Tests verify API endpoints work correctly
- Tests validate translation accuracy
- Tests confirm search integration functions
- Tests ensure learning system operates properly
- High code coverage with meaningful assertions

### Verification Checklist
- [ ] `tests/search/test_sinhaglish_e2e.py` created
- [ ] Test fixtures defined for test data
- [ ] test_translate_basic implemented and passing
- [ ] test_translate_multi implemented and passing
- [ ] test_phonetic_match implemented and passing
- [ ] test_dictionary_lookup implemented and passing
- [ ] test_search_integration implemented and passing
- [ ] test_learning implemented and passing
- [ ] Test utilities and helpers created
- [ ] All tests pass successfully
- [ ] Test coverage meets goals (>85%)

---

## Task 86: Create Documentation

### Overview
Create comprehensive documentation for the Sinhaglish search system. This documentation covers the Sinhaglish concept, system architecture, dictionary management, API reference, code examples, contributing guidelines, and troubleshooting. The documentation serves developers, administrators, and contributors who work with or extend the Sinhaglish functionality.

### Dependencies
- Task 85: Create Integration Tests (all features completed)
- All previous Sinhaglish tasks for complete understanding

### Instructions

1. **Create documentation directory**
   - Navigate to `docs/` in project root
   - Create directory named `sinhaglish`
   - Create file named `README.md`

2. **Write overview section**
   - Explain what Sinhaglish is
   - Describe the problem it solves
   - Explain romanization concept
   - Provide real-world examples
   - Include benefits for Sri Lankan users

3. **Document system architecture**
   - Create architecture diagram (ASCII art)
   - Explain data flow from query to results
   - Describe component interactions
   - Document database schema
   - Explain translation pipeline

4. **Write dictionary management guide**
   - Explain how to add new words
   - Document word categories
   - Describe variant handling
   - Explain phonetic matching rules
   - Provide examples of good mappings

5. **Create API reference**
   - Document all endpoints (translate, dictionary)
   - Provide request/response schemas
   - Include curl examples
   - Show TypeScript usage examples
   - Document error responses

6. **Add code examples**
   - Backend: Using translation service
   - Frontend: Using Sinhaglish client
   - Component: Using MultiScriptDisplay
   - Search: Integrating with product search
   - Testing: Writing tests

7. **Write contributing guidelines**
   - Explain how to add new words to dictionary
   - Document code contribution process
   - Describe testing requirements
   - Provide PR template
   - List code style guidelines

8. **Create troubleshooting section**
   - Document common issues
   - Provide solutions for translation errors
   - Explain phonetic matching failures
   - Address performance concerns
   - Include FAQ

9. **Add deployment notes**
   - Document environment variables
   - Explain database migration requirements
   - Describe initial data loading
   - Provide performance tuning tips
   - List monitoring recommendations

10. **Review and polish**
    - Check for clarity and completeness
    - Verify all code examples work
    - Ensure links are functional
    - Add table of contents
    - Proofread for errors

### Documentation Structure

```
docs/sinhaglish/
└── README.md
    ├── Overview
    ├── Sinhaglish Concept
    ├── System Architecture
    ├── Dictionary Management
    ├── API Reference
    │   ├── Translate Endpoint
    │   └── Dictionary Endpoint
    ├── Code Examples
    │   ├── Backend Examples
    │   └── Frontend Examples
    ├── Contributing
    ├── Troubleshooting
    └── Deployment
```

### Documentation Sections

| Section | Content | Target Audience |
|---------|---------|-----------------|
| Overview | What is Sinhaglish | All readers |
| Concept | Romanization explained | Business users |
| Architecture | System design | Developers |
| Dictionary | Managing words | Administrators |
| API Reference | Endpoints and usage | Developers |
| Examples | Code samples | Developers |
| Contributing | How to contribute | Contributors |
| Troubleshooting | Common issues | Support team |
| Deployment | Setup and config | DevOps |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│           (Search Input with Sinhaglish)            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│             Sinhaglish Client (Frontend)            │
│          TypeScript API Client + Types              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼ HTTP POST/GET
┌─────────────────────────────────────────────────────┐
│            Sinhaglish API (Backend)                 │
│         DRF ViewSet + Translation Service           │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│   Dictionary     │    │  Phonetic        │
│   Lookup         │    │  Matching        │
│   (Exact Match)  │    │  (Fuzzy Match)   │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
         ┌─────────────────────┐
         │  Query Expansion    │
         │  (Sinhala + Roman)  │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Product Search     │
         │  (ElasticSearch)    │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Search Results     │
         │  (Multi-Script)     │
         └─────────────────────┘
```

### API Reference Format

```markdown
## POST /api/sinhaglish/translate/

Translates a romanized Sinhala query into Unicode Sinhala.

**Request:**
{
  "query": "kiri kesel"
}

**Response:**
{
  "original": "kiri kesel",
  "expanded": "කිරි කෙසෙල් kiri kesel",
  "tokens": [...],
  "sinhala": "කිරි කෙසෙල්"
}

**Curl Example:**
curl -X POST http://api.example.com/api/sinhaglish/translate/ \
  -H "Content-Type: application/json" \
  -d '{"query": "kiri kesel"}'
```

### Code Example Format

```typescript
// Frontend Usage Example
import { sinhaglishClient } from '@/lib/search/sinhaglish/client';

async function searchProducts(query: string) {
  // Translate romanized query
  const translation = await sinhaglishClient.translate({ query });
  
  // Use expanded query for search
  const results = await searchAPI.search(translation.expanded);
  
  return results;
}
```

### Troubleshooting Table

| Issue | Cause | Solution |
|-------|-------|----------|
| Translation returns empty | Word not in dictionary | Add mapping to database |
| Phonetic match fails | Algorithm too strict | Adjust soundex threshold |
| Slow API response | Large dictionary | Add database indexes |
| Wrong Sinhala characters | Encoding issue | Check UTF-8 config |

### Contributing Guidelines

| Area | Guidelines |
|------|------------|
| New Words | Include variants, category, phonetic |
| Code | Follow PEP8/ESLint, add tests |
| Tests | >85% coverage, integration tests |
| PRs | Descriptive title, linked issue |
| Commits | Conventional commits format |

### Expected Outcome
- Complete documentation covering all aspects
- Clear explanations for technical and non-technical readers
- Working code examples for all use cases
- Helpful troubleshooting guide
- Clear contribution pathway
- Ready for production deployment

### Verification Checklist
- [ ] `docs/sinhaglish/README.md` created
- [ ] Overview section written
- [ ] Sinhaglish concept explained
- [ ] Architecture diagram included
- [ ] Dictionary management documented
- [ ] API reference complete with examples
- [ ] Code examples provided (backend + frontend)
- [ ] Contributing guidelines written
- [ ] Troubleshooting section created
- [ ] Deployment notes added
- [ ] All links functional
- [ ] Code examples tested and working
- [ ] Table of contents added
- [ ] Documentation proofread

---

## Summary

This document established the complete API and frontend integration layer for the Sinhaglish search system. It covered backend API implementation with Django REST Framework, frontend TypeScript integration with type-safe clients, multi-script display components, comprehensive integration testing, and complete documentation.

### Completed Tasks
1. ✓ Created Sinhaglish API ViewSet with routing
2. ✓ Implemented translate endpoint for query expansion
3. ✓ Created dictionary API for word lookup
4. ✓ Defined TypeScript types for type safety
5. ✓ Built Sinhaglish API client with error handling
6. ✓ Created MultiScriptDisplay component for dual-script rendering
7. ✓ Developed integration tests covering all scenarios
8. ✓ Produced comprehensive documentation

### Key Deliverables
- Functional API endpoints for translation and dictionary
- Type-safe frontend integration with TypeScript
- Reusable React component for multi-script display
- Complete test suite with high coverage
- Production-ready documentation

### Integration Points
- Search API uses expanded queries from Sinhaglish
- Product display shows both romanized and Sinhala names
- Learning system improves translations over time
- Dictionary management through admin interface

### Next Steps
Proceed to **SubPhase-06: AI Chatbot Backend** to implement conversational AI capabilities for customer support and product recommendations.

