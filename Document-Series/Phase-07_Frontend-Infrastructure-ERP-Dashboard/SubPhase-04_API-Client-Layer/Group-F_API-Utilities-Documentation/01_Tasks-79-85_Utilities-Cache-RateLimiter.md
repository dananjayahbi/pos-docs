# Tasks 79-85: API Utilities, Cache Layer, and Rate Limiter

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** F - API Utilities & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84, 85

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-86-90_Index-Mock-Test-Docs.md](02_Tasks-86-90_Index-Mock-Test-Docs.md)

---

## Document Overview

This document covers the creation of API utility functions, including query string builder, URL path builder, FormData builder, file upload/download helpers, in-memory cache layer, and client-side rate limiter. These utilities enhance the API client with advanced functionality for handling complex request scenarios.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Query String Builder | Low | 20 min |
| 80 | Create URL Path Builder | Low | 20 min |
| 81 | Create FormData Builder | Low | 25 min |
| 82 | Create File Upload Helper | Medium | 40 min |
| 83 | Create Download File Helper | Low | 25 min |
| 84 | Create API Cache Layer | Medium | 45 min |
| 85 | Create API Rate Limiter | Medium | 45 min |

---

## Task 79: Create Query String Builder

### Overview
Create a utility function for building URL query strings from JavaScript objects. Handle nested objects, arrays, null/undefined values, and proper URL encoding. Support flexible serialization strategies for complex data structures.

### Dependencies
- Task 02: API Client Configuration completed
- TypeScript setup available
- URLSearchParams API understanding

### Instructions

1. **Create query string utility file**
   - Navigate to `frontend/lib/` directory
   - Create file named `queryString.ts`
   - This will contain query string building functions

2. **Define QueryStringOptions interface**
   - Create TypeScript interface for configuration options
   - Include option for array serialization strategy
   - Include option for nested object handling
   - Include option for null/undefined handling
   - Include option for custom encoding

3. **Define array serialization strategies**
   - Strategy 1: Repeat key for each value (key=val1&key=val2)
   - Strategy 2: Bracket notation (key[]=val1&key[]=val2)
   - Strategy 3: Comma-separated (key=val1,val2)
   - Strategy 4: Indexed (key[0]=val1&key[1]=val2)
   - Default to repeat key strategy

4. **Define nested object flattening**
   - Convert nested objects to dot notation (user.name=John)
   - Alternative: Convert nested objects to bracket notation (user[name]=John)
   - Handle deep nesting (up to reasonable depth)
   - Prevent circular references

5. **Create buildQueryString function**
   - Accept parameters object as first argument
   - Accept options object as second argument (optional)
   - Return formatted query string without leading '?'

6. **Implement value handling logic**
   - Skip undefined values (do not include in query)
   - Skip null values based on options (default: skip)
   - Convert boolean values to string ('true'/'false')
   - Convert number values to string
   - Convert Date objects to ISO string
   - Handle empty strings (include or skip based on options)

7. **Implement array handling**
   - Detect array values in parameters
   - Apply selected serialization strategy
   - Handle empty arrays (skip by default)
   - Maintain array order

8. **Implement nested object handling**
   - Detect object values in parameters
   - Apply flattening strategy
   - Handle nested arrays within objects
   - Set maximum nesting depth limit

9. **Implement URL encoding**
   - Use encodeURIComponent for all values
   - Handle special characters properly
   - Preserve reserved characters if needed
   - Support custom encoding function

10. **Add utility helper functions**
    - Create `parseQueryString` function for parsing
    - Create `appendQueryString` function for URL building
    - Create `updateQueryString` function for modifications
    - Export all functions

### Query String Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| arrayFormat | 'repeat' \| 'bracket' \| 'comma' \| 'index' | 'repeat' | Array serialization strategy |
| nestingFormat | 'dot' \| 'bracket' | 'dot' | Nested object flattening format |
| skipNull | boolean | true | Skip null values |
| skipEmptyString | boolean | false | Skip empty string values |
| encode | boolean | true | URL encode values |
| encodeValuesOnly | boolean | false | Only encode values, not keys |
| maxDepth | number | 5 | Maximum nesting depth |

### Array Format Examples

| Format | Input | Output |
|--------|-------|--------|
| repeat | { tags: ['a', 'b'] } | tags=a&tags=b |
| bracket | { tags: ['a', 'b'] } | tags[]=a&tags[]=b |
| comma | { tags: ['a', 'b'] } | tags=a,b |
| index | { tags: ['a', 'b'] } | tags[0]=a&tags[1]=b |

### Nested Object Examples

| Format | Input | Output |
|--------|-------|--------|
| dot | { user: { name: 'John' } } | user.name=John |
| bracket | { user: { name: 'John' } } | user[name]=John |

### Usage Patterns

#### Basic Usage
```
Parameters: { search: 'laptop', page: 1, limit: 20 }
Output: search=laptop&page=1&limit=20
```

#### Array Parameters
```
Parameters: { ids: [1, 2, 3], status: 'active' }
Output (repeat): ids=1&ids=2&ids=3&status=active
```

#### Nested Objects
```
Parameters: { filter: { category: 'electronics', price: { min: 100 } } }
Output (dot): filter.category=electronics&filter.price.min=100
```

#### Null/Undefined Handling
```
Parameters: { search: 'laptop', category: null, page: undefined }
Output (skipNull=true): search=laptop
```

### Expected Outcome
- Robust query string builder function
- Support for multiple serialization strategies
- Proper handling of complex data types
- URL-safe encoded output
- Helper functions for common operations

### Verification Checklist
- [ ] `frontend/lib/queryString.ts` file created
- [ ] QueryStringOptions interface defined
- [ ] buildQueryString function implemented
- [ ] Array serialization strategies working
- [ ] Nested object flattening working
- [ ] Null/undefined handling correct
- [ ] URL encoding applied properly
- [ ] Helper functions (parse, append, update) created
- [ ] Edge cases handled (circular refs, deep nesting)
- [ ] TypeScript types properly defined

---

## Task 80: Create URL Path Builder

### Overview
Create a utility for constructing URL paths with dynamic parameter replacement and query string appending. Support path parameter substitution (`:id` style), query parameter addition, and base URL prepending.

### Dependencies
- Task 02: API Client Configuration completed
- Task 79: Query String Builder completed
- URL construction patterns understood

### Instructions

1. **Create URL builder utility file**
   - Navigate to `frontend/lib/` directory
   - Create file named `urlBuilder.ts`
   - Import query string builder from Task 79

2. **Define UrlBuilderOptions interface**
   - Include base URL option
   - Include query parameters option
   - Include path parameters option
   - Include trailing slash handling option
   - Include validation options

3. **Create buildUrl function**
   - Accept path template as first argument
   - Accept options object as second argument
   - Return complete URL string

4. **Implement path parameter replacement**
   - Detect path parameters (`:paramName` or `{paramName}`)
   - Replace with provided values from options
   - Throw error if required parameter missing
   - Support both colon and brace syntax

5. **Implement path segment handling**
   - Split path by '/' segments
   - Process each segment independently
   - Remove empty segments
   - Normalize multiple slashes to single

6. **Implement base URL handling**
   - Prepend base URL if provided
   - Remove duplicate slashes at join point
   - Ensure protocol is preserved (http://, https://)
   - Handle base URLs with or without trailing slash

7. **Implement query string appending**
   - Use query string builder from Task 79
   - Append to path with '?' separator
   - Merge with existing query string if present
   - Preserve existing query parameters

8. **Implement trailing slash handling**
   - Add trailing slash if option enabled
   - Remove trailing slash if option disabled
   - Default behavior: preserve existing

9. **Add validation logic**
   - Validate URL format
   - Check for unresolved path parameters
   - Validate parameter values (no special chars)
   - Throw descriptive errors

10. **Create helper functions**
    - Create `buildApiUrl` function with default base
    - Create `buildResourceUrl` function for REST patterns
    - Create `isAbsoluteUrl` function for URL detection
    - Export all functions

### URL Builder Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| baseUrl | string | undefined | Base URL to prepend |
| pathParams | Record<string, any> | {} | Path parameter values |
| queryParams | Record<string, any> | {} | Query string parameters |
| trailingSlash | boolean \| 'preserve' | 'preserve' | Trailing slash handling |
| validate | boolean | true | Validate URL construction |
| encodePathParams | boolean | true | Encode path parameter values |

### Path Parameter Syntax

| Syntax | Example Template | Example Params | Result |
|--------|------------------|----------------|--------|
| Colon | /users/:id | { id: 123 } | /users/123 |
| Braces | /users/{id} | { id: 123 } | /users/123 |
| Multiple | /users/:userId/posts/:postId | { userId: 1, postId: 2 } | /users/1/posts/2 |

### Usage Patterns

#### Simple Path Building
```
Template: /users/:id
Params: { id: 123 }
Result: /users/123
```

#### Path with Query String
```
Template: /users/:id
PathParams: { id: 123 }
QueryParams: { include: 'profile', format: 'json' }
Result: /users/123?include=profile&format=json
```

#### Full URL Construction
```
Template: /api/v1/users/:id
BaseUrl: https://api.example.com
PathParams: { id: 123 }
Result: https://api.example.com/api/v1/users/123
```

#### Resource Pattern
```
Template: /:resource/:id?
Params: { resource: 'products', id: 456 }
Result: /products/456
```

### URL Builder Workflow

```
┌─────────────────────────────────────────┐
│ Input: Template, BaseUrl, Params        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Parse Template for Path Parameters      │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Replace Path Parameters with Values     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Normalize Path (remove empty segments)  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Prepend Base URL if Provided           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Build Query String from Query Params    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Append Query String to URL             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Apply Trailing Slash Logic             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Validate Final URL                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Output: Complete URL String            │
└─────────────────────────────────────────┘
```

### Expected Outcome
- Flexible URL building utility
- Support for path parameter replacement
- Query string integration
- Base URL handling
- Validation and error reporting

### Verification Checklist
- [ ] `frontend/lib/urlBuilder.ts` file created
- [ ] UrlBuilderOptions interface defined
- [ ] buildUrl function implemented
- [ ] Path parameter replacement working (both syntaxes)
- [ ] Base URL prepending working
- [ ] Query string appending working
- [ ] Trailing slash logic implemented
- [ ] Validation logic working
- [ ] Helper functions created
- [ ] Edge cases handled (missing params, invalid URLs)

---

## Task 81: Create FormData Builder

### Overview
Create a utility for building FormData objects from JavaScript objects for file upload and multipart form submissions. Handle nested objects, arrays, File objects, and Blob objects with proper serialization.

### Dependencies
- Task 02: API Client Configuration completed
- FormData API understanding
- File/Blob handling knowledge

### Instructions

1. **Create FormData builder utility file**
   - Navigate to `frontend/lib/` directory
   - Create file named `formDataBuilder.ts`
   - This handles FormData construction logic

2. **Define FormDataOptions interface**
   - Include array handling strategy option
   - Include nested object handling option
   - Include filename customization option
   - Include indices option for arrays
   - Include dots option for nested objects

3. **Create buildFormData function**
   - Accept data object as first argument
   - Accept options object as second argument (optional)
   - Return FormData instance

4. **Implement primitive value handling**
   - Convert strings directly
   - Convert numbers to strings
   - Convert booleans to strings ('true'/'false')
   - Handle null as empty string or skip
   - Skip undefined values

5. **Implement File object handling**
   - Detect File instances
   - Append with original filename
   - Support custom filename via options
   - Preserve file type metadata

6. **Implement Blob object handling**
   - Detect Blob instances
   - Generate default filename if none provided
   - Set appropriate content type
   - Support custom filename via options

7. **Implement array handling**
   - Strategy 1: Use same key for all items
   - Strategy 2: Use indexed keys (key[0], key[1])
   - Strategy 3: Use bracket notation (key[])
   - Recursively handle array items

8. **Implement nested object handling**
   - Strategy 1: Use dot notation (parent.child)
   - Strategy 2: Use bracket notation (parent[child])
   - Recursively flatten nested structures
   - Maintain key paths correctly

9. **Implement Date handling**
   - Convert Date objects to ISO strings
   - Alternative: Unix timestamp format
   - Support custom date formatter

10. **Add utility helper functions**
    - Create `appendToFormData` for adding to existing FormData
    - Create `formDataToObject` for parsing FormData
    - Create `cloneFormData` for copying FormData
    - Export all functions

### FormData Builder Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| arrayFormat | 'repeat' \| 'indices' \| 'brackets' | 'repeat' | Array key format |
| nestingFormat | 'dots' \| 'brackets' | 'dots' | Nested object format |
| skipNull | boolean | false | Skip null values |
| skipEmptyString | boolean | false | Skip empty strings |
| defaultFilename | string | 'file' | Default filename for Blobs |
| dateFormat | 'iso' \| 'timestamp' | 'iso' | Date serialization format |

### Value Type Handling

| Type | Handling Strategy |
|------|------------------|
| string | Append directly |
| number | Convert to string |
| boolean | Convert to 'true'/'false' |
| null | Empty string or skip |
| undefined | Skip (do not append) |
| File | Append as File |
| Blob | Append as Blob with filename |
| Date | Convert to ISO string |
| Array | Recursive handling |
| Object | Recursive flattening |

### Array Format Examples

| Format | Input | FormData Keys |
|--------|-------|--------------|
| repeat | { tags: ['a', 'b'] } | tags, tags |
| indices | { tags: ['a', 'b'] } | tags[0], tags[1] |
| brackets | { tags: ['a', 'b'] } | tags[], tags[] |

### Nested Object Examples

| Format | Input | FormData Keys |
|--------|-------|--------------|
| dots | { user: { name: 'John' } } | user.name |
| brackets | { user: { name: 'John' } } | user[name] |

### Usage Patterns

#### Simple Data
```
Input: { name: 'John', age: 30 }
FormData: name=John, age=30
```

#### With Files
```
Input: { name: 'John', avatar: File }
FormData: name=John, avatar=<File>
```

#### Nested Objects
```
Input: { user: { name: 'John', email: 'john@example.com' } }
FormData (dots): user.name=John, user.email=john@example.com
```

#### Arrays
```
Input: { tags: ['javascript', 'typescript'] }
FormData (repeat): tags=javascript, tags=typescript
```

#### Mixed Types
```
Input: {
  name: 'Product',
  images: [File1, File2],
  metadata: { category: 'electronics' }
}
FormData:
  name=Product
  images=<File1>
  images=<File2>
  metadata.category=electronics
```

### FormData Building Workflow

```
┌────────────────────────────────────────┐
│ Input: JavaScript Object              │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ Create New FormData Instance          │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ Iterate Over Object Keys              │
└──────────────┬─────────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │  Check Type  │
        └──────┬──────┘
               │
     ┌─────────┼─────────┬─────────┐
     ▼         ▼         ▼         ▼
┌─────────┐ ┌────────┐ ┌───────┐ ┌────────┐
│Primitive│ │  File  │ │ Array │ │ Object │
└────┬────┘ └───┬────┘ └───┬───┘ └───┬────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
   Append    Append    Recurse    Flatten
   Direct    As File   Items      & Append
     │          │          │          │
     └──────────┴──────────┴──────────┘
                    │
                    ▼
       ┌────────────────────────────┐
       │ Return FormData Instance   │
       └────────────────────────────┘
```

### Expected Outcome
- Flexible FormData builder
- Support for all common data types
- File and Blob handling
- Nested structure flattening
- Multiple serialization strategies

### Verification Checklist
- [ ] `frontend/lib/formDataBuilder.ts` file created
- [ ] FormDataOptions interface defined
- [ ] buildFormData function implemented
- [ ] Primitive value handling working
- [ ] File object handling working
- [ ] Blob object handling working
- [ ] Array handling with multiple strategies
- [ ] Nested object flattening working
- [ ] Date handling implemented
- [ ] Helper functions created
- [ ] Edge cases handled

---

## Task 82: Create File Upload Helper

### Overview
Create a helper utility for handling file uploads with progress tracking, validation, and cancellation support. Use XMLHttpRequest for progress events, support multiple files, implement file type and size validation, and provide upload cancellation.

### Dependencies
- Task 02: API Client Configuration completed
- Task 81: FormData Builder completed
- XMLHttpRequest API understanding

### Instructions

1. **Create file upload helper file**
   - Navigate to `frontend/lib/` directory
   - Create file named `fileHelpers.ts`
   - Import FormData builder from Task 81

2. **Define FileUploadOptions interface**
   - Include onProgress callback option
   - Include onSuccess callback option
   - Include onError callback option
   - Include validation rules option
   - Include headers option for authentication
   - Include multiple files support option

3. **Define FileValidationRules interface**
   - Include maxSize option (in bytes)
   - Include allowedTypes option (MIME types array)
   - Include allowedExtensions option (file extensions array)
   - Include maxFiles option (for multiple uploads)
   - Include minSize option (optional)

4. **Create UploadController class**
   - Manage XMLHttpRequest instance
   - Track upload state (pending, uploading, completed, failed, cancelled)
   - Provide abort method for cancellation
   - Emit events for progress, completion, error

5. **Create validateFile function**
   - Check file size against maxSize
   - Check MIME type against allowedTypes
   - Check file extension against allowedExtensions
   - Return validation result with error messages
   - Support custom validation function

6. **Create uploadFile function**
   - Accept file, url, and options as arguments
   - Validate file before upload
   - Create FormData using builder from Task 81
   - Create XMLHttpRequest instance
   - Set up progress event listener
   - Set up load event listener (success)
   - Set up error event listener
   - Set up abort event listener
   - Return UploadController instance

7. **Implement progress tracking**
   - Listen to XMLHttpRequest upload.onprogress event
   - Calculate percentage (loaded / total * 100)
   - Call onProgress callback with progress data
   - Include upload speed calculation (optional)
   - Include estimated time remaining (optional)

8. **Implement multiple file upload**
   - Create uploadFiles function (plural)
   - Accept array of files
   - Validate all files first
   - Upload files sequentially or in parallel
   - Track overall progress across all files
   - Return array of UploadController instances

9. **Implement upload cancellation**
   - Store XMLHttpRequest reference in controller
   - Implement abort method that calls xhr.abort()
   - Update upload state to 'cancelled'
   - Call onError callback with cancellation info
   - Clean up resources

10. **Add utility helper functions**
    - Create `validateFiles` for batch validation
    - Create `getFileExtension` for extension extraction
    - Create `getMimeType` for type detection
    - Create `formatFileSize` for display formatting
    - Export all functions and classes

### File Upload Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| onProgress | (progress: ProgressEvent) => void | undefined | Progress callback |
| onSuccess | (response: any) => void | undefined | Success callback |
| onError | (error: Error) => void | undefined | Error callback |
| validation | FileValidationRules | {} | Validation rules |
| headers | Record<string, string> | {} | Additional headers |
| fieldName | string | 'file' | FormData field name |
| additionalData | Record<string, any> | {} | Extra form data |
| withCredentials | boolean | false | Include credentials |
| timeout | number | 0 | Request timeout (ms) |

### Validation Rules

| Rule | Type | Description |
|------|------|-------------|
| maxSize | number | Maximum file size in bytes |
| minSize | number | Minimum file size in bytes |
| allowedTypes | string[] | Allowed MIME types |
| allowedExtensions | string[] | Allowed file extensions |
| maxFiles | number | Maximum number of files |
| customValidator | (file: File) => boolean | Custom validation function |

### Common MIME Types

| Category | MIME Type | Extension |
|----------|-----------|-----------|
| Images | image/jpeg | .jpg, .jpeg |
| Images | image/png | .png |
| Images | image/gif | .gif |
| Images | image/webp | .webp |
| Documents | application/pdf | .pdf |
| Documents | application/msword | .doc |
| Documents | application/vnd.openxmlformats-officedocument.wordprocessingml.document | .docx |
| Spreadsheets | application/vnd.ms-excel | .xls |
| Spreadsheets | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | .xlsx |
| Text | text/plain | .txt |
| Text | text/csv | .csv |
| Archives | application/zip | .zip |
| Archives | application/x-rar-compressed | .rar |

### Upload Progress Data

| Property | Type | Description |
|----------|------|-------------|
| loaded | number | Bytes uploaded |
| total | number | Total bytes |
| percentage | number | Upload percentage (0-100) |
| speed | number | Upload speed (bytes/sec) |
| timeRemaining | number | Estimated time remaining (seconds) |
| file | File | File being uploaded |

### Upload State Machine

```
┌──────────┐
│  Pending │ (Initial state)
└────┬─────┘
     │
     │ start()
     ▼
┌────────────┐
│ Uploading  │ (In progress)
└─────┬──────┘
      │
      ├────── onProgress ──── Progress Updates
      │
      ├────── onLoad ────────┐
      │                      ▼
      │                ┌───────────┐
      │                │ Completed │ (Success)
      │                └───────────┘
      │
      ├────── onError ───────┐
      │                      ▼
      │                ┌────────┐
      │                │ Failed │ (Error)
      │                └────────┘
      │
      └────── abort() ───────┐
                             ▼
                       ┌───────────┐
                       │ Cancelled │ (Aborted)
                       └───────────┘
```

### Usage Patterns

#### Single File Upload
```
Validation: { maxSize: 5MB, allowedTypes: ['image/jpeg', 'image/png'] }
Progress: Track upload percentage
Success: Handle server response
Error: Display error message
```

#### Multiple File Upload
```
Files: [File1, File2, File3]
Strategy: Sequential or parallel
Overall Progress: Aggregate individual progress
Partial Failure: Handle failed uploads
```

#### Upload with Cancellation
```
Start Upload → Store Controller → User Clicks Cancel → controller.abort()
```

#### Upload with Additional Data
```
File: image.jpg
Additional Data: { title: 'Profile Picture', category: 'avatar' }
FormData: file=<File>, title='Profile Picture', category='avatar'
```

### Upload Flow Diagram

```
┌──────────────────────────────────────┐
│ User Selects File(s)                 │
└────────────┬─────────────────────────┘
             │
             ▼
┌───────────���──────────────────────────┐
│ Validate Each File                   │
│ - Check Size                         │
│ - Check Type                         │
│ - Check Extension                    │
└────────────┬─────────────────────────┘
             │
        ┌────┴────┐
        │ Valid?  │
        └────┬────┘
             │
      No ◄───┘   Yes
      │            │
      ▼            ▼
┌──────────┐  ┌─────────────────────────┐
│  Show    │  │ Create FormData         │
│  Error   │  └──────────┬──────────────┘
└──────────┘             │
                         ▼
              ┌──────────────────────────┐
              │ Create XMLHttpRequest    │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │ Send Request             │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │ Track Progress           │
              │ (onProgress callbacks)   │
              └──────────┬───────────────┘
                         │
                    ┌────┴────┐
                    │ Result? │
                    └────┬────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌──────────┐
    │ Success │    │  Error  │    │ Cancelled│
    └─────────┘    └─────────┘    └──────────┘
```

### Expected Outcome
- Robust file upload utility
- Progress tracking capability
- File validation before upload
- Upload cancellation support
- Multiple file upload handling

### Verification Checklist
- [ ] `frontend/lib/fileHelpers.ts` file created
- [ ] FileUploadOptions interface defined
- [ ] FileValidationRules interface defined
- [ ] UploadController class implemented
- [ ] validateFile function working
- [ ] uploadFile function implemented
- [ ] Progress tracking working
- [ ] uploadFiles function for multiple files
- [ ] Cancellation support implemented
- [ ] Helper functions created
- [ ] Error handling robust

---

## Task 83: Create Download File Helper

### Overview
Create a helper utility for downloading files from the API, handling Blob responses, extracting filenames from headers, and triggering browser downloads. Support various content types and proper filename extraction.

### Dependencies
- Task 02: API Client Configuration completed
- Blob API understanding
- Content-Disposition header knowledge

### Instructions

1. **Add download functions to file helpers**
   - Open existing `frontend/lib/fileHelpers.ts` file
   - Add download-related interfaces and functions
   - Keep upload and download logic in same file

2. **Define DownloadOptions interface**
   - Include filename option (override default)
   - Include onProgress callback option
   - Include headers option
   - Include responseType option
   - Include timeout option

3. **Create downloadFile function**
   - Accept URL as first argument
   - Accept options as second argument (optional)
   - Make request using XMLHttpRequest or fetch
   - Set responseType to 'blob'
   - Return Promise resolving to Blob

4. **Implement filename extraction**
   - Check Content-Disposition header
   - Parse filename from header (filename=...)
   - Handle UTF-8 encoded filenames (filename*=utf-8''...)
   - Fall back to URL path if no header
   - Use provided filename option if available

5. **Implement blob handling**
   - Receive blob response from server
   - Create object URL from blob
   - Store for download triggering
   - Revoke URL after download to free memory

6. **Implement download triggering**
   - Create anchor element dynamically
   - Set href to blob object URL
   - Set download attribute with filename
   - Programmatically click anchor
   - Remove anchor from DOM
   - Revoke object URL after short delay

7. **Implement progress tracking**
   - Use XMLHttpRequest for progress events
   - Listen to onprogress event
   - Calculate download percentage
   - Call onProgress callback with progress data
   - Support AbortController for cancellation

8. **Create downloadFileWithProgress function**
   - Wrapper around downloadFile
   - Always use XMLHttpRequest for progress support
   - Provide more detailed progress information
   - Return controller for cancellation

9. **Implement error handling**
   - Handle network errors
   - Handle server errors (non-2xx status)
   - Handle timeout errors
   - Provide descriptive error messages
   - Clean up resources on error

10. **Add utility helper functions**
    - Create `getFilenameFromUrl` for URL parsing
    - Create `getFilenameFromHeader` for header parsing
    - Create `triggerDownload` for browser download
    - Create `revokeObjectUrl` for cleanup
    - Export all functions

### Download Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| filename | string | undefined | Override filename |
| onProgress | (progress: ProgressEvent) => void | undefined | Progress callback |
| headers | Record<string, string> | {} | Additional headers |
| responseType | 'blob' \| 'arraybuffer' | 'blob' | Response type |
| timeout | number | 0 | Request timeout (ms) |
| withCredentials | boolean | false | Include credentials |

### Content-Disposition Header Formats

| Format | Example | Extracted Filename |
|--------|---------|-------------------|
| Simple | attachment; filename="report.pdf" | report.pdf |
| With quotes | attachment; filename="my document.pdf" | my document.pdf |
| UTF-8 | attachment; filename*=utf-8''%E6%96%87%E6%A1%A3.pdf | 文档.pdf |
| Inline | inline; filename="image.jpg" | image.jpg |

### Filename Extraction Priority

```
1. options.filename (explicitly provided)
   ↓ (if not provided)
2. Content-Disposition header filename
   ↓ (if not present)
3. Content-Disposition header filename* (UTF-8)
   ↓ (if not present)
4. URL path last segment
   ↓ (if not available)
5. Default filename: "download"
```

### Download Flow Diagram

```
┌────────────────────────────────────┐
│ downloadFile(url, options)         │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Create XMLHttpRequest               │
│ - Set responseType to 'blob'       │
│ - Set headers                      │
│ - Set timeout                      │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Send Request to Server             │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Track Download Progress            │
│ (optional onProgress callbacks)    │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Receive Blob Response              │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Extract Filename                   │
│ - From options                     │
│ - From Content-Disposition         │
│ - From URL                         │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Create Object URL from Blob        │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Create Temporary Anchor Element    │
│ - Set href to object URL           │
│ - Set download attribute           │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Trigger Download                   │
│ (programmatic click)               │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Cleanup                            │
│ - Remove anchor                    │
│ - Revoke object URL                │
└────────────────────────────────────┘
```

### Usage Patterns

#### Simple Download
```
URL: /api/reports/123/download
Filename: Auto-detected from header
Trigger: Immediate download
```

#### Download with Custom Filename
```
URL: /api/reports/123/export
Filename: 'monthly-report-jan-2026.pdf'
Override: Use provided filename
```

#### Download with Progress
```
URL: /api/large-file/download
Progress: Track percentage downloaded
Display: Show progress bar to user
```

#### Download with Authentication
```
URL: /api/secure-document/download
Headers: { Authorization: 'Bearer token' }
Credentials: Include with request
```

### Common Content Types

| Type | MIME Type | Typical Use |
|------|-----------|-------------|
| PDF | application/pdf | Reports, documents |
| Excel | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | Data exports |
| CSV | text/csv | Data exports |
| ZIP | application/zip | Archive downloads |
| Image | image/jpeg, image/png | Image downloads |
| Text | text/plain | Log files |

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| Network error | Throw error with network message |
| 404 Not Found | Throw error indicating file not found |
| 403 Forbidden | Throw error indicating access denied |
| Timeout | Throw timeout error, allow retry |
| Invalid blob | Validate blob size > 0 |
| No filename | Use default or URL-based name |

### Expected Outcome
- Functional file download utility
- Automatic filename extraction
- Blob handling capability
- Progress tracking for large files
- Browser download triggering

### Verification Checklist
- [ ] Download functions added to `fileHelpers.ts`
- [ ] DownloadOptions interface defined
- [ ] downloadFile function implemented
- [ ] Filename extraction logic working
- [ ] Blob handling implemented
- [ ] Download triggering working
- [ ] Progress tracking working
- [ ] Error handling implemented
- [ ] Helper functions created
- [ ] Object URL cleanup working

---

## Task 84: Create API Cache Layer

### Overview
Create an in-memory cache layer for GET requests to reduce redundant API calls and improve performance. Implement cache key generation, TTL (time-to-live) management, cache size limits, and cache invalidation strategies.

### Dependencies
- Task 02: API Client Configuration completed
- Caching strategies understanding
- Memory management knowledge

### Instructions

1. **Create API cache utility file**
   - Navigate to `frontend/lib/` directory
   - Create file named `apiCache.ts`
   - This will contain cache implementation

2. **Define CacheOptions interface**
   - Include maxAge option (TTL in milliseconds)
   - Include maxSize option (maximum cached items)
   - Include keyGenerator function option
   - Include storage strategy option (memory, sessionStorage, localStorage)
   - Include exclude patterns option

3. **Define CacheEntry interface**
   - Include data property (cached response)
   - Include timestamp property (cache time)
   - Include expiresAt property (expiration time)
   - Include key property (cache key)
   - Include size property (memory footprint estimate)

4. **Create ApiCache class**
   - Maintain internal Map for cache storage
   - Implement singleton pattern for global cache
   - Track cache statistics (hits, misses, size)
   - Provide public methods for cache operations

5. **Implement cache key generation**
   - Generate key from URL and parameters
   - Include HTTP method in key
   - Sort query parameters for consistency
   - Hash for shorter keys (optional)
   - Support custom key generator function

6. **Implement cache set operation**
   - Accept key, data, and options
   - Create cache entry with timestamp
   - Calculate expiration time from maxAge
   - Check cache size and evict if needed
   - Store entry in cache Map

7. **Implement cache get operation**
   - Accept key as parameter
   - Retrieve entry from cache Map
   - Check if entry has expired
   - Remove expired entries automatically
   - Return data or null if not found/expired
   - Update cache statistics

8. **Implement cache eviction strategies**
   - LRU (Least Recently Used): Remove oldest accessed
   - FIFO (First In First Out): Remove oldest added
   - Size-based: Remove when size limit exceeded
   - TTL-based: Remove expired entries
   - Manual: Clear specific keys or patterns

9. **Implement cache invalidation**
   - Create `invalidate` method for single key
   - Create `invalidatePattern` for pattern matching
   - Create `invalidateAll` for full cache clear
   - Auto-invalidate on POST/PUT/PATCH/DELETE requests
   - Support tag-based invalidation

10. **Add cache management utilities**
    - Create `getCacheStats` for statistics
    - Create `getCacheSize` for memory usage
    - Create `getCacheKeys` for listing cached keys
    - Create `pruneCacheExpired` for cleanup
    - Export ApiCache class and utilities

### Cache Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| maxAge | number | 300000 | TTL in milliseconds (5 min) |
| maxSize | number | 100 | Maximum cached items |
| keyGenerator | (config) => string | default | Custom key generator |
| storage | 'memory' \| 'session' \| 'local' | 'memory' | Storage strategy |
| exclude | RegExp[] | [] | URL patterns to exclude |
| enabled | boolean | true | Enable/disable caching |

### Cache Key Generation

```
Input:
  - Method: GET
  - URL: /api/users
  - Params: { page: 1, limit: 20, sort: 'name' }

Generation Steps:
  1. Normalize URL: /api/users
  2. Sort params: limit=20&page=1&sort=name
  3. Combine: GET:/api/users?limit=20&page=1&sort=name
  4. Optional hash: md5(combined)

Output Key: GET:/api/users?limit=20&page=1&sort=name
```

### Cache Entry Structure

| Field | Type | Description |
|-------|------|-------------|
| key | string | Cache key |
| data | any | Cached response data |
| timestamp | number | Cache creation time (ms) |
| expiresAt | number | Expiration timestamp (ms) |
| accessCount | number | Number of accesses |
| lastAccessed | number | Last access timestamp (ms) |
| size | number | Estimated memory size (bytes) |

### Eviction Strategies

```
LRU (Least Recently Used):
  ┌────────────────────────────────────┐
  │ Track lastAccessed for each entry  │
  │ On cache full, remove least recent │
  │ Update lastAccessed on each get    │
  └────────────────────────────────────┘

FIFO (First In First Out):
  ┌────────────────────────────────────┐
  │ Track insertion order              │
  │ On cache full, remove oldest entry │
  │ Maintain insertion timestamps      │
  └────────────────────────────────────┘

Size-Based:
  ┌────────────────────────────────────┐
  │ Calculate total cache size         │
  │ If exceeds maxSize, evict entries  │
  │ Use LRU or FIFO for selection      │
  └────────────────────────────────────┘

TTL-Based:
  ┌────────────────────────────────────┐
  │ Check expiresAt on every get       │
  │ Remove expired entries immediately │
  │ Periodic cleanup of expired items  │
  └────────────────────────────────────┘
```

### Cache Invalidation Patterns

| Method | Pattern | Example |
|--------|---------|---------|
| Single key | Exact match | invalidate('GET:/api/users') |
| Prefix | Starts with | invalidatePattern('GET:/api/users') |
| Regex | Pattern match | invalidatePattern(/\/api\/users\/\d+/) |
| Tags | Tag-based | invalidateByTag('users') |
| All | Clear all | invalidateAll() |

### Auto-Invalidation Rules

```
POST /api/users → Invalidate /api/users/*
PUT /api/users/123 → Invalidate /api/users/123, /api/users
PATCH /api/users/123 → Invalidate /api/users/123, /api/users
DELETE /api/users/123 → Invalidate /api/users/123, /api/users
```

### Cache Integration Flow

```
┌────────────────────────────────────┐
│ API Request (GET)                  │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Generate Cache Key                 │
└──────────────┬─────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Check Cache  │
        └──────┬───────┘
               │
      ┌────────┴────────┐
      │ Cache Hit?      │
      └────────┬────────┘
               │
        ┌──────┴──────┐
      Yes             No
        │              │
        ▼              ▼
┌─────────────┐  ┌──────────────────┐
│Return Cached│  │Make API Request  │
│   Data      │  └────────┬─────────┘
└─────────────┘           │
                          ▼
                 ┌─────────────────────┐
                 │Store in Cache       │
                 └────────┬────────────┘
                          │
                          ▼
                 ┌─────────────────────┐
                 │Return Fresh Data    │
                 └─────────────────────┘
```

### Cache Statistics

| Metric | Description |
|--------|-------------|
| hits | Number of cache hits |
| misses | Number of cache misses |
| hitRate | Percentage of hits (hits / total) |
| size | Current number of cached items |
| memoryUsage | Estimated memory usage (bytes) |
| oldestEntry | Timestamp of oldest cached item |
| newestEntry | Timestamp of newest cached item |

### Expected Outcome
- Functional in-memory cache layer
- Configurable TTL and size limits
- Automatic expiration and eviction
- Cache invalidation capabilities
- Performance improvement for repeated requests

### Verification Checklist
- [ ] `frontend/lib/apiCache.ts` file created
- [ ] CacheOptions interface defined
- [ ] CacheEntry interface defined
- [ ] ApiCache class implemented
- [ ] Cache key generation working
- [ ] Cache set operation working
- [ ] Cache get operation working
- [ ] Eviction strategies implemented
- [ ] Invalidation methods working
- [ ] Statistics tracking implemented
- [ ] Integration with API client ready

---

## Task 85: Create API Rate Limiter

### Overview
Create a client-side rate limiter to prevent excessive API requests and respect server rate limits. Implement token bucket or sliding window algorithm, request queuing, and automatic retry with backoff.

### Dependencies
- Task 02: API Client Configuration completed
- Rate limiting algorithms understanding
- Promise queue implementation knowledge

### Instructions

1. **Create rate limiter utility file**
   - Navigate to `frontend/lib/` directory
   - Create file named `rateLimiter.ts`
   - This will contain rate limiting logic

2. **Define RateLimiterOptions interface**
   - Include maxRequests option (requests per window)
   - Include windowMs option (time window in milliseconds)
   - Include strategy option (token-bucket, sliding-window, fixed-window)
   - Include queueEnabled option (queue excess requests)
   - Include maxQueueSize option (maximum queued requests)
   - Include retryOptions option (for failed requests)

3. **Define RetryOptions interface**
   - Include maxRetries option (maximum retry attempts)
   - Include retryDelay option (initial delay in ms)
   - Include retryBackoff option (exponential backoff multiplier)
   - Include retryableStatuses option (HTTP statuses to retry)

4. **Create RateLimiter class**
   - Maintain request count and timestamps
   - Implement chosen algorithm (default: token bucket)
   - Provide request execution method
   - Handle request queuing

5. **Implement token bucket algorithm**
   - Initialize bucket with maxRequests tokens
   - Remove token for each request
   - Refill tokens based on time passed
   - Reject requests when bucket empty (or queue)
   - Calculate time until next token available

6. **Implement sliding window algorithm**
   - Track timestamps of recent requests
   - Maintain rolling window of windowMs
   - Remove timestamps outside window
   - Check if request count within limit
   - More accurate than fixed window

7. **Implement fixed window algorithm**
   - Track requests within fixed time windows
   - Reset count at window boundaries
   - Simpler but can allow bursts at boundaries
   - Less memory intensive

8. **Implement request queuing**
   - Create internal request queue (FIFO)
   - Queue requests when rate limit reached
   - Process queue when tokens available
   - Respect maxQueueSize limit
   - Provide queue status methods

9. **Implement retry logic**
   - Catch failed requests (network errors, 429, 500s)
   - Check if status code is retryable
   - Wait for retryDelay before retry
   - Apply exponential backoff on each retry
   - Track retry count, abort after maxRetries
   - Respect Retry-After header (if present)

10. **Add rate limiter management utilities**
    - Create `getRemainingRequests` method
    - Create `getTimeUntilReset` method
    - Create `getQueueLength` method
    - Create `clearQueue` method
    - Create `reset` method for rate limiter reset
    - Export RateLimiter class and utilities

### Rate Limiter Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| maxRequests | number | 10 | Max requests per window |
| windowMs | number | 60000 | Time window (1 minute) |
| strategy | 'token' \| 'sliding' \| 'fixed' | 'token' | Rate limiting algorithm |
| queueEnabled | boolean | true | Queue excess requests |
| maxQueueSize | number | 50 | Maximum queued requests |
| throwOnLimit | boolean | false | Throw error or queue |

### Retry Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| maxRetries | number | 3 | Maximum retry attempts |
| retryDelay | number | 1000 | Initial retry delay (ms) |
| retryBackoff | number | 2 | Backoff multiplier |
| retryableStatuses | number[] | [429, 500, 502, 503, 504] | HTTP statuses to retry |
| retryOnTimeout | boolean | true | Retry on timeout errors |

### Rate Limiting Algorithms

#### Token Bucket
```
Concept:
  - Bucket holds tokens (maxRequests)
  - Each request consumes one token
  - Tokens refill over time
  - Allows short bursts if bucket full

Operation:
  1. Check if token available
  2. If yes, consume token and allow request
  3. If no, queue or reject request
  4. Refill tokens based on elapsed time

Advantages:
  - Allows bursts
  - Smooth rate limiting
  - Simple implementation

Refill Rate: maxRequests / windowMs tokens per ms
```

#### Sliding Window
```
Concept:
  - Track timestamp of each request
  - Maintain rolling window of windowMs
  - Count requests in current window
  - More accurate than fixed window

Operation:
  1. Remove timestamps older than windowMs
  2. Count remaining timestamps
  3. If count < maxRequests, allow request
  4. Otherwise, queue or reject

Advantages:
  - Accurate rate limiting
  - No boundary burst issues
  - Fair distribution

Disadvantages:
  - More memory intensive
  - More complex calculations
```

#### Fixed Window
```
Concept:
  - Fixed time windows (e.g., every minute)
  - Count requests in current window
  - Reset count at window boundary

Operation:
  1. Check current window start time
  2. If new window, reset count
  3. If count < maxRequests, allow request
  4. Otherwise, queue or reject

Advantages:
  - Simple implementation
  - Low memory usage

Disadvantages:
  - Boundary burst issues
  - Less accurate
```

### Request Queuing Flow

```
┌────────────────────────────────────┐
│ API Request Initiated              │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Check Rate Limit                   │
└──────────────┬─────────────────────┘
               │
      ┌────────┴────────┐
      │ Within Limit?   │
      └────────┬────────┘
               │
        ┌──────┴──────┐
      Yes             No
        │              │
        ▼              ▼
┌─────────────┐  ┌──────────────────┐
│Execute      │  │ Queue Enabled?   │
│Request      │  └────────┬─────────┘
└─────────────┘           │
                   ┌──────┴──────┐
                 Yes            No
                   │              │
                   ▼              ▼
        ┌──────────────────┐  ┌─────────┐
        │Add to Queue      │  │ Reject  │
        └────────┬─────────┘  │ Request │
                 │            └─────────┘
                 ▼
        ┌──────────────────┐
        │Wait for Token    │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │Execute from Queue│
        └──────────────────┘
```

### Retry with Exponential Backoff

```
Attempt 1: Wait 1000ms  (retryDelay * backoff^0)
Attempt 2: Wait 2000ms  (retryDelay * backoff^1)
Attempt 3: Wait 4000ms  (retryDelay * backoff^2)
Attempt 4: Wait 8000ms  (retryDelay * backoff^3)
...
Abort after maxRetries exceeded

Handle 429 Retry-After header:
  - If header present, use its value
  - Otherwise, use calculated backoff
```

### Integration with API Client

```typescript
// Pseudo-code example structure (not actual code)

interface ApiClient {
  rateLimiter: RateLimiter;
  
  async request(config) {
    // Wrap request in rate limiter
    return this.rateLimiter.execute(() => {
      return this.makeRequest(config);
    });
  }
}
```

### Rate Limiter Status

| Property | Description |
|----------|-------------|
| remainingRequests | Requests available in current window |
| timeUntilReset | Milliseconds until rate limit resets |
| queueLength | Number of requests in queue |
| isQueueFull | Whether queue has reached maxQueueSize |

### Common Rate Limit Scenarios

| Scenario | Configuration | Behavior |
|----------|--------------|----------|
| API with 100 req/min | maxRequests: 100, windowMs: 60000 | Token bucket with 100 tokens |
| Burst protection | maxRequests: 10, windowMs: 1000 | Max 10 requests per second |
| Queue-based | queueEnabled: true, maxQueueSize: 50 | Queue up to 50 requests |
| Strict limiting | throwOnLimit: true | Throw error immediately |

### Expected Outcome
- Functional client-side rate limiter
- Support for multiple algorithms
- Request queuing capability
- Automatic retry with backoff
- Integration-ready for API client

### Verification Checklist
- [ ] `frontend/lib/rateLimiter.ts` file created
- [ ] RateLimiterOptions interface defined
- [ ] RetryOptions interface defined
- [ ] RateLimiter class implemented
- [ ] Token bucket algorithm working
- [ ] Sliding window algorithm working
- [ ] Fixed window algorithm working
- [ ] Request queuing implemented
- [ ] Retry logic with backoff working
- [ ] Status methods implemented
- [ ] Integration with API client possible

---

## Summary

This document covered Tasks 79-85, creating essential API utilities for the frontend application:

- **Task 79:** Query string builder for URL parameter serialization
- **Task 80:** URL path builder for dynamic URL construction
- **Task 81:** FormData builder for file upload preparation
- **Task 82:** File upload helper with progress tracking and validation
- **Task 83:** Download file helper for blob handling and browser downloads
- **Task 84:** API cache layer for performance optimization
- **Task 85:** API rate limiter for request throttling and retry logic

These utilities enhance the API client with advanced features for handling complex scenarios, improving performance through caching, and ensuring responsible API usage through rate limiting.

### Next Steps
Proceed to [02_Tasks-86-90_Index-Mock-Test-Docs.md](02_Tasks-86-90_Index-Mock-Test-Docs.md) to create the service index, set up mocking with MSW, write tests, create documentation, and perform final verification of the entire API Client Layer.
