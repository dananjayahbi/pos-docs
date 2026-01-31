# Tasks 26-32: Media, Phone, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** B - API Client & Auth  
> **Document:** 02 of 02  
> **Tasks Covered:** 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-25_Client-Send-Methods.md](01_Tasks-17-25_Client-Send-Methods.md)
- **→ Next Document:** [Group-C: 01_Tasks-33-37_Template-Management.md](../Group-C_Template-Messages/01_Tasks-33-37_Template-Management.md)

---

## Document Overview

This document covers media message sending (images, documents), interactive messages with buttons and lists, phone number utilities specific to Sri Lanka, message logging infrastructure, and final API client verification. These components complete the WhatsApp API client implementation, enabling rich media communication and ensuring data integrity through proper validation and logging.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 26 | Create send_image Method | Low | 25 min |
| 27 | Create send_document Method | Low | 25 min |
| 28 | Create send_interactive Method | Medium | 40 min |
| 29 | Create Phone Validation | Low | 30 min |
| 30 | Create Phone Formatting | Low | 20 min |
| 31 | Create Message Logging | Medium | 35 min |
| 32 | Verify API Client | Low | 30 min |

---

## Task 26: Create send_image Method

### Overview
Implement method for sending image messages with optional captions. Images are powerful for product showcases, receipts, promotional content, and visual updates. Create the send_image method that handles image URLs or media IDs, validates image format and size, adds captions, and provides a simple interface for image messaging.

### Dependencies
- Task 23: Create send_message Method

### Instructions

1. **Create the send_image method**
   - Add async method `send_image` to WhatsAppClient class
   - Wrapper around send_message for image type
   - Accept recipient, image reference, and optional caption
   - Return same format as send_message

2. **Define method signature**
   - Parameter: to (str) - Recipient phone number
   - Parameter: image (str) - Image URL or media ID
   - Parameter: caption (str, optional) - Image caption (max 1024 chars)
   - Parameter: is_media_id (bool, optional) - True if image is media ID
   - Return: send_message return value

3. **Validate image reference**
   - Check image parameter is provided and non-empty
   - Validate URL format if using URL
   - Validate media ID format if using ID
   - Raise validation error for invalid references

4. **Validate image URL requirements**
   - Must be publicly accessible HTTPS URL
   - Check URL is valid and accessible
   - Verify domain is whitelisted (if restrictions exist)
   - Maximum file size: 5 MB
   - Supported formats: JPEG, PNG

5. **Validate caption**
   - Check caption length (max 1024 characters)
   - Trim whitespace
   - Caption is optional (can be None or empty)
   - Raise error if caption exceeds limit

6. **Construct image payload**
   - Set type to "image"
   - Create image object
   - If URL: set "link" field
   - If media ID: set "id" field
   - Add caption if provided

7. **Handle media ID vs URL**
   - Media ID: Previously uploaded via Media API
   - URL: Direct link to hosted image
   - Media ID is preferred (faster, more reliable)
   - URL must remain accessible during delivery

8. **Call send_message**
   - Pass recipient and image payload
   - Let send_message handle formatting and sending
   - Return response directly

9. **Add usage logging**
   - Log image sends with URL/ID
   - Track image message volume
   - Monitor delivery rates for images

10. **Handle image-specific errors**
    - Image not found at URL
    - Image too large (>5MB)
    - Unsupported format
    - URL not accessible
    - Provide clear error messages

### send_image Flow

```
┌──────────────────────────────┐
│ send_image(to, image, cap)   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Validate Image Reference     │
│ - URL or Media ID            │
│ - Format check               │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Validate Caption             │
│ - Length ≤1024               │
│ - Trim whitespace            │
└──────────┬───────────────────┘
           │
           ▼
     ┌─────────┴──────────┐
     │                    │
     ▼                    ▼
┌──────────┐      ┌──────────────┐
│ Using    │      │ Using        │
│ URL      │      │ Media ID     │
└────┬─────┘      └──────┬───────┘
     │                   │
     ▼                   ▼
┌──────────┐      ┌──────────────┐
│ {        │      │ {            │
│  "link": │      │  "id":       │
│  "url"   │      │  "media_id"  │
│ }        │      │ }            │
└────┬─────┘      └──────┬───────┘
     │                   │
     └─────────┬─────────┘
               │
               ▼
┌──────────────────────────────┐
│ Construct Payload            │
│ {                            │
│   "type": "image",           │
│   "image": {...},            │
│   "caption": "..." (opt)     │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Call send_message(to,        │
│   payload)                   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Return message_id            │
└──────────────────────────────┘
```

### Image Message Payload (URL)

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "image",
  "image": {
    "link": "https://cdn.lcc.lk/products/product-123.jpg",
    "caption": "Check out this amazing product!"
  }
}
```

### Image Message Payload (Media ID)

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "image",
  "image": {
    "id": "1234567890123456",
    "caption": "Your order receipt"
  }
}
```

### Image Specifications

| Specification | Value | Notes |
|---------------|-------|-------|
| Max file size | 5 MB | WhatsApp enforced |
| Supported formats | JPEG, PNG | Most common formats |
| Max caption length | 1024 characters | Include spaces |
| URL requirement | HTTPS only | HTTP not supported |
| Recommended size | 1024x1024 px | Best quality/size balance |
| Minimum size | 192x192 px | Avoid pixelation |

### Media ID vs URL Comparison

| Aspect | Media ID | URL |
|--------|----------|-----|
| Performance | Faster (already on WhatsApp servers) | Slower (must fetch) |
| Reliability | More reliable | Depends on host uptime |
| Lifespan | 30 days from upload | Must remain accessible |
| Privacy | More private | Publicly accessible |
| Setup | Requires upload first | Direct use |
| Recommended | Yes, for frequent use | For one-time sends |

### Example Use Cases

| Use Case | Image Type | Caption Example |
|----------|------------|-----------------|
| Product showcase | Product photo | "New arrivals! 20% off this week" |
| Order receipt | Receipt image | "Your order #1234 receipt" |
| QR code | QR code image | "Scan to track your order" |
| Promotional | Marketing banner | "Flash Sale! Today only!" |
| Proof of delivery | Photo | "Delivered at 2:30 PM" |
| Invoice | Invoice image | "Invoice #INV-1234 for Rs. 5,000" |

### Caption Formatting

```
With caption:
┌────────────────────────────┐
│ [Image displays here]      │
│                            │
│ Check out this amazing     │
│ product! *New arrivals*    │
│ _Limited stock_            │
└────────────────────────────┘

Without caption:
┌────────────────────────────┐
│ [Image displays here]      │
│                            │
└────────────────────────────┘
```

### Image Upload Process (for Media ID)

```
Step 1: Upload image to WhatsApp
POST /{phone_id}/media
Content-Type: multipart/form-data
file: [image binary]

Response:
{
  "id": "1234567890123456"
}

Step 2: Use media ID in message
send_image(
  to="+94771234567",
  image="1234567890123456",
  is_media_id=True,
  caption="Your product"
)
```

### Image-Specific Errors

| Error | Description | Resolution |
|-------|-------------|------------|
| Image too large | File exceeds 5MB | Compress or resize image |
| Invalid format | Not JPEG/PNG | Convert to supported format |
| URL not accessible | Cannot fetch from URL | Check URL accessibility |
| Invalid media ID | Media ID not found or expired | Re-upload image |
| Caption too long | Exceeds 1024 characters | Shorten caption |

### URL Requirements

| Requirement | Details |
|-------------|---------|
| Protocol | HTTPS only (not HTTP) |
| Authentication | No basic auth or cookies required |
| Accessibility | Publicly accessible from WhatsApp servers |
| Headers | Must allow HEAD and GET requests |
| Content-Type | Should return image/jpeg or image/png |
| Expiry | URL must remain valid until delivery |

### Image Hosting Best Practices

| Practice | Recommendation |
|----------|----------------|
| CDN | Use CDN for faster loading (e.g., CloudFront, Cloudflare) |
| HTTPS | Always use HTTPS URLs |
| Expiry | URLs should be valid for at least 24 hours |
| Compression | Optimize images to reduce file size |
| Domain | Use consistent, whitelisted domain |
| Caching | Enable caching headers for efficiency |

### Expected Outcome
- send_image method implemented
- Support for both URL and media ID
- Image validation (size, format, accessibility)
- Caption support with length validation
- Clear error messages for image issues
- Usage logging for analytics

### Verification Checklist
- [ ] send_image method created with correct signature
- [ ] Image reference validation (URL/media ID)
- [ ] URL format and accessibility validation
- [ ] Caption length validation (≤1024)
- [ ] Payload constructed for both URL and media ID
- [ ] Calls send_message with image payload
- [ ] Image-specific errors handled
- [ ] Documentation includes use cases
- [ ] Tested with both URL and media ID
- [ ] Works with and without caption

---

## Task 27: Create send_document Method

### Overview
Implement method for sending document files such as PDFs, Word documents, Excel spreadsheets, and other file types. Documents are essential for sharing invoices, catalogs, reports, and official documents with customers. Create the send_document method that handles document URLs or media IDs, validates file formats and sizes, adds filenames and captions, and provides a robust interface for document messaging.

### Dependencies
- Task 23: Create send_message Method

### Instructions

1. **Create the send_document method**
   - Add async method `send_document` to WhatsAppClient class
   - Wrapper around send_message for document type
   - Accept recipient, document reference, filename, and caption
   - Return same format as send_message

2. **Define method signature**
   - Parameter: to (str) - Recipient phone number
   - Parameter: document (str) - Document URL or media ID
   - Parameter: filename (str, optional) - Display filename
   - Parameter: caption (str, optional) - Document caption (max 1024 chars)
   - Parameter: is_media_id (bool, optional) - True if document is media ID
   - Return: send_message return value

3. **Validate document reference**
   - Check document parameter is provided and non-empty
   - Validate URL format if using URL
   - Validate media ID format if using ID
   - Raise validation error for invalid references

4. **Validate document requirements**
   - Must be publicly accessible HTTPS URL
   - Maximum file size: 100 MB
   - Check supported file formats
   - Verify domain is whitelisted if applicable

5. **Validate filename**
   - Filename is optional but recommended
   - If not provided, extract from URL
   - Include file extension in filename
   - Max length typically 255 characters

6. **Validate caption**
   - Check caption length (max 1024 characters)
   - Caption is optional
   - Trim whitespace
   - Raise error if caption exceeds limit

7. **Construct document payload**
   - Set type to "document"
   - Create document object
   - If URL: set "link" field
   - If media ID: set "id" field
   - Add filename if provided
   - Add caption if provided

8. **Handle supported file types**
   - PDF documents (.pdf)
   - Microsoft Word (.doc, .docx)
   - Microsoft Excel (.xls, .xlsx)
   - Microsoft PowerPoint (.ppt, .pptx)
   - Text files (.txt)
   - Other formats as supported by WhatsApp

9. **Call send_message**
   - Pass recipient and document payload
   - Let send_message handle formatting and sending
   - Return response directly

10. **Add usage logging**
    - Log document sends with type and size
    - Track document message volume
    - Monitor delivery rates for documents

11. **Handle document-specific errors**
    - Document not found at URL
    - Document too large (>100MB)
    - Unsupported format
    - URL not accessible
    - Provide clear error messages

### send_document Flow

```
┌────────────────────────────────────┐
│ send_document(to, doc, filename)   │
└──────────┬─────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Validate Document Reference      │
│ - URL or Media ID                │
│ - Format check                   │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Validate Filename                │
│ - Extract from URL if not given  │
│ - Include extension              │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Validate Caption                 │
│ - Length ≤1024                   │
│ - Optional                       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Construct Payload                │
│ {                                │
│   "type": "document",            │
│   "document": {                  │
│     "link"/"id": "...",          │
│     "filename": "...",           │
│     "caption": "..." (opt)       │
│   }                              │
│ }                                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Call send_message(to, payload)   │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Return message_id                │
└──────────────────────────────────┘
```

### Document Message Payload (URL)

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "document",
  "document": {
    "link": "https://cdn.lcc.lk/invoices/INV-1234.pdf",
    "filename": "Invoice-1234.pdf",
    "caption": "Your invoice for order #1234"
  }
}
```

### Document Message Payload (Media ID)

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "document",
  "document": {
    "id": "9876543210987654",
    "filename": "Product-Catalog-2026.pdf",
    "caption": "Our latest product catalog"
  }
}
```

### Document Specifications

| Specification | Value | Notes |
|---------------|-------|-------|
| Max file size | 100 MB | WhatsApp enforced |
| URL requirement | HTTPS only | HTTP not supported |
| Max caption length | 1024 characters | Include spaces |
| Filename max length | 255 characters | Typical limit |
| Media ID lifespan | 30 days | From upload |

### Supported Document Formats

| Category | Formats | Extensions | Common Use |
|----------|---------|------------|------------|
| PDF | Portable Document Format | .pdf | Invoices, receipts, reports |
| Word | Microsoft Word | .doc, .docx | Contracts, letters |
| Excel | Microsoft Excel | .xls, .xlsx | Price lists, inventory |
| PowerPoint | Microsoft PowerPoint | .ppt, .pptx | Presentations, catalogs |
| Text | Plain text | .txt | Simple documents |
| OpenDocument | OpenOffice | .odt, .ods, .odp | Alternative formats |
| CSV | Comma-separated | .csv | Data exports |

### Example Use Cases

| Use Case | Document Type | Filename Example | Caption Example |
|----------|---------------|------------------|-----------------|
| Invoice | PDF | Invoice-ORD-1234.pdf | Your invoice for order #1234 |
| Receipt | PDF | Receipt-1234.pdf | Payment receipt |
| Catalog | PDF | Product-Catalog-Feb-2026.pdf | Our latest products |
| Price list | Excel | Price-List-2026.xlsx | Updated price list |
| Report | Word | Monthly-Report-Jan-2026.docx | January sales report |
| Terms | PDF | Terms-and-Conditions.pdf | Please review and accept |
| Contract | PDF | Service-Agreement.pdf | Your service agreement |

### Document Display in WhatsApp

```
┌──────────────────────────────────┐
│ 📄 Invoice-1234.pdf              │
│ 234 KB                           │
│                                  │
│ Your invoice for order #1234     │
│                                  │
│ [Download] [Open]                │
└──────────────────────────────────┘
```

### Filename Best Practices

| Practice | Recommendation | Example |
|----------|----------------|---------|
| Descriptive | Use clear, descriptive names | Invoice-ORD-1234.pdf |
| No spaces | Use hyphens or underscores | Product_Catalog_2026.pdf |
| Include date | Add date for time-sensitive docs | Report-2026-01-31.pdf |
| Include ID | Reference order/invoice number | Receipt-INV-1234.pdf |
| Extension | Always include file extension | Catalog.pdf (not Catalog) |
| Avoid special chars | No special characters | Use A-Z, 0-9, -, _ only |

### Document Size Guidelines

| Size Range | Description | Recommendation |
|------------|-------------|----------------|
| < 1 MB | Small | Ideal for quick download |
| 1-10 MB | Medium | Good for most documents |
| 10-50 MB | Large | Compress if possible |
| 50-100 MB | Very large | Only if necessary, may be slow |
| > 100 MB | Too large | Split into multiple files |

### Document Compression Tips

| Document Type | Compression Method | Tool Suggestions |
|---------------|-------------------|------------------|
| PDF | Reduce quality, optimize | Adobe Acrobat, Smallpdf |
| Images in PDF | Lower resolution | 150 DPI sufficient for most |
| Excel | Remove unused sheets | Clean up data |
| Word | Compress embedded images | Word built-in compression |
| Zip | Archive multiple files | WinRAR, 7-Zip |

### Document-Specific Errors

| Error | Description | Resolution |
|-------|-------------|------------|
| Document too large | File exceeds 100MB | Compress or split file |
| Invalid format | Unsupported file type | Convert to supported format |
| URL not accessible | Cannot fetch from URL | Check URL accessibility |
| Invalid media ID | Media ID not found/expired | Re-upload document |
| Missing filename | No filename provided | Add filename parameter |
| Caption too long | Exceeds 1024 characters | Shorten caption |

### LCC-Specific Document Templates

| Template | Type | When to Send | Filename Pattern |
|----------|------|--------------|------------------|
| Invoice | PDF | After order/payment | Invoice-{order_id}.pdf |
| Receipt | PDF | After payment | Receipt-{payment_id}.pdf |
| Quotation | PDF | Before order | Quote-{quote_id}.pdf |
| Delivery note | PDF | On delivery | Delivery-{order_id}.pdf |
| Product catalog | PDF | Marketing | Catalog-{month}-{year}.pdf |
| Terms of service | PDF | On signup | TOS-LCC.pdf |
| Return form | PDF | For returns | Return-Form-{order_id}.pdf |

### Security Considerations

| Consideration | Implementation |
|---------------|----------------|
| Sensitive data | Encrypt PDFs with passwords when needed |
| Access control | Use signed URLs with expiration |
| Audit trail | Log all document sends |
| Compliance | Follow data protection regulations |
| Virus scanning | Scan uploads before sending |
| Watermarking | Add watermarks to sensitive documents |

### Expected Outcome
- send_document method implemented
- Support for both URL and media ID
- Document validation (size, format, accessibility)
- Filename and caption support
- Clear error messages for document issues
- Wide range of supported formats

### Verification Checklist
- [ ] send_document method created with correct signature
- [ ] Document reference validation (URL/media ID)
- [ ] URL format and accessibility validation
- [ ] Filename validation and extraction
- [ ] Caption length validation (≤1024)
- [ ] Payload constructed for both URL and media ID
- [ ] Calls send_message with document payload
- [ ] All supported formats documented
- [ ] Document-specific errors handled
- [ ] Tested with various file types
- [ ] Works with and without filename/caption

---

## Task 28: Create send_interactive Method

### Overview
Implement method for sending interactive messages with buttons or lists. Interactive messages enable user actions directly within WhatsApp, improving engagement and simplifying workflows. Create the send_interactive method that supports reply buttons, call-to-action buttons, list messages, and provides a powerful interface for creating interactive experiences.

### Dependencies
- Task 23: Create send_message Method

### Instructions

1. **Create the send_interactive method**
   - Add async method `send_interactive` to WhatsAppClient class
   - Wrapper around send_message for interactive type
   - Accept recipient, interactive type, and content
   - Return same format as send_message

2. **Define method signature**
   - Parameter: to (str) - Recipient phone number
   - Parameter: interactive_type (str) - "button" or "list"
   - Parameter: body_text (str) - Main message text
   - Parameter: action (dict) - Buttons or list sections
   - Parameter: header (dict, optional) - Optional header
   - Parameter: footer (str, optional) - Optional footer text
   - Return: send_message return value

3. **Understand interactive message types**
   - Button messages: Up to 3 reply buttons
   - List messages: Menu with multiple options (up to 10 sections, 10 items each)
   - Each type has different structure and use cases
   - Cannot mix buttons and lists in one message

4. **Implement button message creation**
   - Support up to 3 reply buttons
   - Each button has ID and title
   - Button ID used to identify which button was clicked
   - Button title displayed to user (max 20 chars)

5. **Implement list message creation**
   - Support multiple sections (up to 10)
   - Each section has title and rows
   - Each row has ID, title, and optional description
   - List displays as menu with button to open

6. **Validate interactive parameters**
   - Check interactive_type is "button" or "list"
   - Validate body_text is provided and non-empty
   - Validate action structure based on type
   - Validate button/row counts within limits

7. **Validate button structure**
   - Each button must have "id" and "title"
   - Button ID max 256 characters (used in webhook)
   - Button title max 20 characters (displayed)
   - Maximum 3 buttons per message

8. **Validate list structure**
   - List must have button text (menu trigger)
   - Each section has title (optional) and rows
   - Each row has id, title, description (optional)
   - Max 10 sections, max 10 rows per section
   - Row title max 24 chars, description max 72 chars

9. **Construct interactive payload**
   - Set type to "interactive"
   - Create interactive object with type
   - Add header if provided (text, image, document, video)
   - Add body with body_text
   - Add footer if provided
   - Add action with buttons or list sections

10. **Handle header options**
    - text: Simple text header
    - image: Image with media ID
    - document: Document with media ID
    - video: Video with media ID
    - Header is optional

11. **Call send_message**
    - Pass recipient and interactive payload
    - Let send_message handle formatting and sending
    - Return response directly

12. **Add usage logging**
    - Log interactive message type
    - Track button clicks (from webhooks in Group-E)
    - Monitor interaction rates

13. **Handle interactive-specific errors**
    - Too many buttons (>3)
    - Too many list sections/rows
    - Invalid button/row structure
    - Text too long for title/description
    - Provide clear error messages

### send_interactive Flow

```
┌────────────────────────────────────┐
│ send_interactive(to, type, ...)    │
└──────────┬─────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Validate Type                    │
│ - "button" or "list"             │
└──────────┬───────────────────────┘
           │
           ▼
     ┌─────────┴──────────┐
     │                    │
     ▼                    ▼
┌──────────┐      ┌──────────────┐
│ Button   │      │ List         │
│ Message  │      │ Message      │
└────┬─────┘      └──────┬───────┘
     │                   │
     ▼                   ▼
┌──────────────┐ ┌────────────────┐
│ Validate     │ │ Validate       │
│ - ≤3 buttons │ │ - ≤10 sections │
│ - ID & title │ │ - ≤10 rows/sec │
└────┬─────────┘ └──────┬─────────┘
     │                   │
     └─────────┬─────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Construct Payload                │
│ {                                │
│   "type": "interactive",         │
│   "interactive": {               │
│     "type": "button"/"list",     │
│     "body": {...},               │
│     "action": {...}              │
│   }                              │
│ }                                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Call send_message(to, payload)   │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Return message_id                │
└──────────────────────────────────┘
```

### Button Message Payload

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "header": {
      "type": "text",
      "text": "Order Confirmation"
    },
    "body": {
      "text": "Your order #1234 is ready! What would you like to do?"
    },
    "footer": {
      "text": "LankaCommerce Cloud"
    },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": {
            "id": "track_order",
            "title": "Track Order"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "cancel_order",
            "title": "Cancel Order"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "contact_support",
            "title": "Contact Support"
          }
        }
      ]
    }
  }
}
```

### List Message Payload

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": {
      "type": "text",
      "text": "Product Categories"
    },
    "body": {
      "text": "Browse our product catalog. Select a category to view products."
    },
    "footer": {
      "text": "Free delivery on orders over Rs. 2,000"
    },
    "action": {
      "button": "View Categories",
      "sections": [
        {
          "title": "Electronics",
          "rows": [
            {
              "id": "cat_mobiles",
              "title": "Mobile Phones",
              "description": "Latest smartphones and accessories"
            },
            {
              "id": "cat_laptops",
              "title": "Laptops & Computers",
              "description": "Laptops, desktops, and peripherals"
            }
          ]
        },
        {
          "title": "Fashion",
          "rows": [
            {
              "id": "cat_mens",
              "title": "Men's Wear",
              "description": "Shirts, trousers, shoes"
            },
            {
              "id": "cat_womens",
              "title": "Women's Wear",
              "description": "Dresses, tops, accessories"
            }
          ]
        }
      ]
    }
  }
}
```

### Interactive Message Types

| Type | Max Items | Item Limits | Best For |
|------|-----------|-------------|----------|
| Button | 3 buttons | Title: 20 chars | Simple choices, confirmations |
| List | 10 sections × 10 rows | Title: 24 chars, Desc: 72 chars | Menus, catalogs, options |

### Button Message Specifications

| Component | Requirement | Limit |
|-----------|-------------|-------|
| Buttons | Required | 1-3 buttons |
| Button ID | Required | Max 256 characters |
| Button Title | Required | Max 20 characters |
| Body Text | Required | Max 1024 characters |
| Header | Optional | Text, image, document, video |
| Footer | Optional | Max 60 characters |

### List Message Specifications

| Component | Requirement | Limit |
|-----------|-------------|-------|
| Sections | Required | 1-10 sections |
| Rows per section | Required | 1-10 rows |
| Button text | Required | Max 20 characters (menu trigger) |
| Section title | Optional | Max 24 characters |
| Row ID | Required | Max 200 characters |
| Row title | Required | Max 24 characters |
| Row description | Optional | Max 72 characters |
| Body text | Required | Max 1024 characters |
| Header | Optional | Text only |
| Footer | Optional | Max 60 characters |

### Button Message Display

```
┌──────────────────────────────────┐
│ Order Confirmation               │
├──────────────────────────────────┤
│ Your order #1234 is ready!       │
│ What would you like to do?       │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │     Track Order              │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │     Cancel Order             │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │     Contact Support          │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ LankaCommerce Cloud              │
└──────────────────────────────────┘
```

### List Message Display

```
┌──────────────────────────────────┐
│ Product Categories               │
├──────────────────────────────────┤
│ Browse our product catalog.      │
│ Select a category to view        │
│ products.                        │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │   View Categories        ▼   │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ Free delivery on orders over     │
│ Rs. 2,000                        │
└──────────────────────────────────┘

When user taps "View Categories":
┌──────────────────────────────────┐
│ Electronics                      │
│ ┌──────────────────────────────┐ │
│ │ Mobile Phones                │ │
│ │ Latest smartphones and       │ │
│ │ accessories                  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Laptops & Computers          │ │
│ │ Laptops, desktops, and       │ │
│ │ peripherals                  │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ Fashion                          │
│ ┌──────────────────────────────┐ │
│ │ Men's Wear                   │ │
│ │ Shirts, trousers, shoes      │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ Women's Wear                 │ │
│ │ Dresses, tops, accessories   │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### Example Use Cases

| Use Case | Type | Button/Row IDs | Scenario |
|----------|------|----------------|----------|
| Order actions | Button | track, cancel, support | After order placed |
| Payment options | Button | online, cod, bank | Choose payment method |
| Confirmation | Button | yes, no, later | Confirm appointment |
| Product categories | List | cat_electronics, cat_fashion | Browse catalog |
| Shipping options | List | ship_standard, ship_express | Choose delivery speed |
| Support topics | List | issue_order, issue_payment | Select issue type |
| Language selection | Button | lang_en, lang_si, lang_ta | Choose language |

### LCC-Specific Interactive Templates

| Template | Type | Purpose | Actions |
|----------|------|---------|---------|
| Order confirmation | Button | After order | Track / Cancel / Support |
| Payment method | Button | Checkout | Online / COD / Bank |
| Delivery slot | List | Scheduling | Morning / Afternoon / Evening slots |
| Product selection | List | Browsing | Category → Product selection |
| Feedback | Button | After delivery | Rate 1-5 / Leave review |
| Return request | Button | Post-delivery | Initiate / Reason / Support |

### Button vs List Decision Matrix

| Scenario | Recommended Type | Reason |
|----------|------------------|--------|
| 2-3 simple options | Button | Quick, visible choices |
| >3 options | List | Cleaner, organized |
| Nested categories | List | Supports hierarchy |
| Yes/No/Cancel | Button | Clear, simple |
| Product catalog | List | Many items, descriptions |
| Quick actions | Button | Immediate visibility |

### Interactive Message Limitations

| Limitation | Details |
|------------|---------|
| No images in buttons | Buttons text-only |
| No custom styling | WhatsApp controls appearance |
| No nested lists | Single level only |
| No dynamic content | Must define at send time |
| 24-hour window | Interactive messages subject to session rules |

### Handling Button/List Responses

```
When user clicks button "track_order":
Webhook receives:
{
  "type": "interactive",
  "interactive": {
    "type": "button_reply",
    "button_reply": {
      "id": "track_order",
      "title": "Track Order"
    }
  }
}

Application action:
1. Identify button ID: "track_order"
2. Look up order from context
3. Generate tracking response
4. Send tracking info to user
```

### Expected Outcome
- send_interactive method implemented
- Support for both button and list types
- Proper validation for structure and limits
- Header and footer support
- Clear error messages for violations
- Foundation for interactive user experiences

### Verification Checklist
- [ ] send_interactive method created
- [ ] Supports both "button" and "list" types
- [ ] Button validation (≤3, ID, title length)
- [ ] List validation (sections, rows, limits)
- [ ] Header support (text, media)
- [ ] Footer support
- [ ] Payload constructed correctly for both types
- [ ] Calls send_message with interactive payload
- [ ] Interactive-specific errors handled
- [ ] Documentation includes use cases
- [ ] Tested with buttons and lists
- [ ] Webhook response handling documented

---

## Task 29: Create Phone Validation

### Overview
Implement phone number validation specifically for Sri Lankan phone numbers. Ensure phone numbers follow the correct format before sending messages to avoid errors and improve delivery rates. Create validation utilities that check Sri Lanka country code, validate mobile prefixes, validate number length, and provide clear error messages for invalid formats.

### Dependencies
- Task 17: Create WhatsAppClient Class

### Instructions

1. **Create validation module**
   - Create file `phone_utils.py` in same directory as whatsapp_client
   - This module contains phone validation and formatting functions
   - Can be used independently of WhatsAppClient
   - Import in whatsapp_client for use in send methods

2. **Understand Sri Lankan phone number format**
   - Country code: +94
   - Local format: 0XX XXX XXXX (with leading 0)
   - International: +94 XX XXX XXXX (without 0)
   - WhatsApp format: 94XXXXXXXXX (no + or 0)
   - Total digits (after country code): 9 digits

3. **Identify valid mobile prefixes**
   - Dialog: 77, 76
   - Mobitel: 71, 70
   - Hutch: 78
   - Airtel: 75, 72
   - Other operators may have additional prefixes
   - Landlines start with area codes (not mobile)

4. **Create validation function**
   - Function name: `validate_sri_lankan_phone`
   - Accept phone number string as parameter
   - Return tuple: (is_valid: bool, error_message: str or None)
   - Perform comprehensive validation checks

5. **Implement validation steps**
   - Step 1: Check if phone is non-empty
   - Step 2: Remove common separators (spaces, hyphens, parentheses)
   - Step 3: Check for country code (+94 or 94 or 0 prefix)
   - Step 4: Extract digits only
   - Step 5: Validate total digit count
   - Step 6: Validate mobile prefix
   - Step 7: Return result

6. **Handle different input formats**
   - +94771234567 (international with +)
   - 94771234567 (international without +)
   - 0771234567 (local format)
   - 077 123 4567 (with spaces)
   - 077-123-4567 (with hyphens)
   - (077) 123-4567 (with parentheses)

7. **Validate mobile vs landline**
   - Mobile numbers: Start with 7 (after 94)
   - Landlines: Start with area code (e.g., 11, 21, 31)
   - For WhatsApp: Only mobile numbers are valid
   - Reject landline numbers with clear error

8. **Create error messages**
   - Empty phone number: "Phone number is required"
   - Invalid format: "Invalid phone number format"
   - Wrong country code: "Only Sri Lankan (+94) numbers supported"
   - Invalid prefix: "Invalid mobile prefix for Sri Lanka"
   - Wrong length: "Phone number must have 9 digits after country code"
   - Landline detected: "WhatsApp only supports mobile numbers"

9. **Add validation for special cases**
   - Check for all zeros (0000000000)
   - Check for sequential numbers (1234567890)
   - Check for repeated digits (1111111111)
   - These are likely invalid or test numbers

10. **Create batch validation helper**
    - Function to validate list of phone numbers
    - Return list of valid numbers and list of invalid numbers with reasons
    - Useful for bulk message campaigns

11. **Add validation logging**
    - Log validation failures for monitoring
    - Track common validation errors
    - Help identify data quality issues

### Phone Validation Flow

```
┌────────────────────────────┐
│ validate_sri_lankan_phone  │
│ (phone_str)                │
└──────────┬─────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Check Non-Empty              │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Remove Separators            │
│ - Spaces                     │
│ - Hyphens                    │
│ - Parentheses                │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Normalize Format             │
│ - Remove + if present        │
│ - Detect 94 or 0 prefix      │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Extract Digits Only          │
│ (remove all non-digits)      │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Check Length                 │
│ - Should be 11 or 10 digits  │
│   (with 94 or 0)             │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Validate Country Code        │
│ - Must be 94 or start with 0 │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Extract Local Number         │
│ - Remove 94 or 0 prefix      │
│ - Should have 9 digits       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Validate Mobile Prefix       │
│ - Must start with 7          │
│ - Check specific prefix      │
│   (77, 76, 71, 70, 78, etc.) │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Check Special Cases          │
│ - All zeros                  │
│ - Sequential                 │
│ - Repeated                   │
└──────────┬───────────────────┘
           │
           ▼
     ┌─────────┴──────────┐
     │                    │
     ▼                    ▼
┌──────────┐      ┌───────────────┐
│ Valid    │      │ Invalid       │
│ Return   │      │ Return        │
│ (True,   │      │ (False,       │
│  None)   │      │  error_msg)   │
└──────────┘      └───────────────┘
```

### Sri Lankan Mobile Number Format

| Component | Format | Example | Description |
|-----------|--------|---------|-------------|
| Country Code | +94 | +94 | International prefix |
| Mobile Prefix | 7X | 77 | Operator-specific |
| Subscriber | XXXXXXX | 1234567 | 7-digit number |
| **Full Format** | +94 7X XXX XXXX | +94 77 123 4567 | Complete number |

### Valid Sri Lankan Mobile Prefixes

| Operator | Prefixes | Example | Notes |
|----------|----------|---------|-------|
| Dialog | 77, 76 | 771234567 | Largest operator |
| Mobitel | 71, 70 | 712345678 | State-owned |
| Hutch | 78 | 781234567 | Hutchison brand |
| Airtel | 75, 72 | 751234567 | Airtel brand |

### Landline Prefixes (Not Valid for WhatsApp)

| Area | Prefix | Example | City |
|------|--------|---------|------|
| Colombo | 11 | 112345678 | Capital district |
| Kandy | 81 | 812345678 | Central |
| Galle | 91 | 912345678 | Southern |
| Jaffna | 21 | 212345678 | Northern |

### Input Format Examples

| Input | Normalized | Valid | Note |
|-------|------------|-------|------|
| +94771234567 | 94771234567 | ✓ | Standard international |
| 94771234567 | 94771234567 | ✓ | International without + |
| 0771234567 | 94771234567 | ✓ | Local format |
| 077 123 4567 | 94771234567 | ✓ | With spaces |
| 077-123-4567 | 94771234567 | ✓ | With hyphens |
| (077) 123-4567 | 94771234567 | ✓ | With parentheses |
| 771234567 | 94771234567 | ✓ | Missing prefix (assume 94) |
| +1234567890 | - | ✗ | Wrong country code |
| 0112345678 | - | ✗ | Landline (Colombo) |
| 0771234 | - | ✗ | Too short |

### Validation Result Examples

| Phone Number | Result | Error Message |
|--------------|--------|---------------|
| +94771234567 | Valid | None |
| 0771234567 | Valid | None |
| 0112345678 | Invalid | WhatsApp only supports mobile numbers |
| 771234 | Invalid | Phone number must have 9 digits after country code |
| +1234567890 | Invalid | Only Sri Lankan (+94) numbers supported |
| 0791234567 | Invalid | Invalid mobile prefix for Sri Lanka |
| (empty) | Invalid | Phone number is required |
| 0000000000 | Invalid | Invalid phone number format |

### Special Case Detection

| Pattern | Type | Valid | Action |
|---------|------|-------|--------|
| 0000000000 | All zeros | No | Reject with error |
| 1234567890 | Sequential | No | Reject with error |
| 1111111111 | Repeated | No | Reject with error |
| 94771234567 | Standard | Yes | Accept |

### Batch Validation Function

```
Function: validate_phone_list(phone_numbers: list) → dict

Input: ["+94771234567", "0112345678", "0781234567", "invalid"]

Output:
{
  "valid": [
    {"phone": "+94771234567", "formatted": "94771234567"},
    {"phone": "0781234567", "formatted": "94781234567"}
  ],
  "invalid": [
    {
      "phone": "0112345678",
      "error": "WhatsApp only supports mobile numbers"
    },
    {
      "phone": "invalid",
      "error": "Invalid phone number format"
    }
  ],
  "stats": {
    "total": 4,
    "valid_count": 2,
    "invalid_count": 2
  }
}
```

### Validation Function Signature

```
Function: validate_sri_lankan_phone(phone: str) → tuple[bool, str | None]

Returns:
  - (True, None) if valid
  - (False, "Error message") if invalid

Example:
  is_valid, error = validate_sri_lankan_phone("+94771234567")
  if is_valid:
      # Proceed with sending message
  else:
      # Handle error: error contains the error message
```

### Integration with WhatsAppClient

```
In send_message method:
1. Call validate_sri_lankan_phone(to)
2. If invalid: raise WhatsAppValidationError(error_message)
3. If valid: proceed with formatting (Task 30)
4. Send message
```

### Expected Outcome
- Phone validation function implemented
- Sri Lankan mobile number formats supported
- All input formats handled correctly
- Clear error messages for invalid numbers
- Landline numbers rejected
- Special cases detected and rejected
- Batch validation helper available

### Verification Checklist
- [ ] `phone_utils.py` file created
- [ ] `validate_sri_lankan_phone` function implemented
- [ ] All valid mobile prefixes supported (77, 76, 71, 70, 78, 75, 72)
- [ ] All input formats handled (+94, 94, 0, with separators)
- [ ] Landline numbers rejected with clear error
- [ ] Length validation (9 digits after country code)
- [ ] Special cases detected (all zeros, sequential, repeated)
- [ ] Clear error messages for each validation failure
- [ ] Batch validation function implemented
- [ ] Tested with various valid and invalid numbers
- [ ] Integrated with WhatsAppClient send methods

---

## Task 30: Create Phone Formatting

### Overview
Implement phone number formatting to convert validated Sri Lankan phone numbers into WhatsApp-compatible format. WhatsApp requires phone numbers in a specific format (without + prefix) for API calls. Create formatting utilities that convert various input formats to WhatsApp format, ensure consistency, and integrate seamlessly with validation and sending methods.

### Dependencies
- Task 29: Create Phone Validation

### Instructions

1. **Add formatting function to phone_utils.py**
   - Function name: `format_for_whatsapp`
   - Accept phone number string as parameter
   - Assume phone is already validated (use after Task 29)
   - Return formatted phone number string

2. **Understand WhatsApp phone format**
   - No + prefix (unlike international format)
   - Start with country code (94 for Sri Lanka)
   - Followed by mobile number without leading 0
   - Example: 94771234567 (11 digits total)
   - This format is used in API requests

3. **Implement formatting logic**
   - Remove all non-digit characters
   - Remove + prefix if present
   - Handle 0 prefix (local format)
   - Handle 94 prefix (already formatted)
   - Ensure result is 94XXXXXXXXX format

4. **Handle input format variations**
   - +94771234567 → 94771234567
   - 94771234567 → 94771234567 (no change)
   - 0771234567 → 94771234567
   - 077 123 4567 → 94771234567
   - 771234567 → 94771234567 (add 94)

5. **Create reverse formatting function**
   - Function name: `format_for_display`
   - Convert WhatsApp format to user-friendly format
   - 94771234567 → +94 77 123 4567
   - Useful for displaying in UI and logs

6. **Implement formatting steps**
   - Step 1: Remove all non-digits
   - Step 2: Check if starts with 94
   - Step 3: If starts with 0, replace with 94
   - Step 4: If no prefix, add 94
   - Step 5: Validate result has 11 digits
   - Step 6: Return formatted number

7. **Add safety checks**
   - Verify formatted number starts with 94
   - Verify total length is 11 digits
   - Raise error if formatting fails
   - Log formatting issues

8. **Create batch formatting helper**
   - Function to format list of validated numbers
   - Useful for bulk message operations
   - Return list of formatted numbers

9. **Integrate with validation**
   - Validation (Task 29) checks if valid
   - Formatting (Task 30) converts to WhatsApp format
   - Always validate before formatting
   - Formatting assumes valid input

10. **Integrate with send methods**
    - All send methods call formatting
    - Format phone before constructing payload
    - Ensures consistency across all message types
    - Reduces errors from incorrect formats

### Phone Formatting Flow

```
┌────────────────────────────┐
│ format_for_whatsapp        │
│ (validated_phone)          │
└──────────┬─────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Remove All Non-Digits        │
│ - Spaces                     │
│ - Hyphens                    │
│ - Parentheses                │
│ - Plus sign                  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Check Prefix                 │
└──────────┬───────────────────┘
           │
     ┌─────┴──────┬─────────┐
     │            │         │
     ▼            ▼         ▼
┌──────────┐ ┌──────┐ ┌──────────┐
│ Starts   │ │Starts│ │ No       │
│ with 94  │ │ with │ │ Prefix   │
│          │ │  0   │ │          │
└────┬─────┘ └──┬───┘ └────┬─────┘
     │          │          │
     │          ▼          │
     │    ┌─────────────┐ │
     │    │ Replace 0   │ │
     │    │ with 94     │ │
     │    └──────┬──────┘ │
     │           │        │
     │           ▼        ▼
     │    ┌─────────────────┐
     │    │ Add 94 Prefix   │
     │    └──────┬──────────┘
     │           │
     └─────┬─────┘
           │
           ▼
┌──────────────────────────────┐
│ Verify Result                │
│ - Starts with 94             │
│ - Has 11 digits              │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Return Formatted Number      │
│ (94XXXXXXXXX)                │
└──────────────────────────────┘
```

### Formatting Examples

| Input | Steps | Output |
|-------|-------|--------|
| +94771234567 | Remove + → Already 94 prefix | 94771234567 |
| 94771234567 | Already correct format | 94771234567 |
| 0771234567 | Remove 0 → Add 94 | 94771234567 |
| 077 123 4567 | Remove spaces → Remove 0 → Add 94 | 94771234567 |
| 077-123-4567 | Remove hyphens → Remove 0 → Add 94 | 94771234567 |
| 771234567 | Add 94 prefix | 94771234567 |

### Display Format Examples

| WhatsApp Format | Display Format | Use Case |
|-----------------|----------------|----------|
| 94771234567 | +94 77 123 4567 | User interfaces |
| 94771234567 | +94771234567 | Logs (compact) |
| 94771234567 | 077 123 4567 | Local format |
| 94771234567 | (077) 123-4567 | Formatted local |

### Format Conversion Matrix

| From Format | To Format | Function | Example |
|-------------|-----------|----------|---------|
| Any Sri Lankan | WhatsApp API | format_for_whatsapp | 0771234567 → 94771234567 |
| WhatsApp API | Display | format_for_display | 94771234567 → +94 77 123 4567 |
| WhatsApp API | Local | format_to_local | 94771234567 → 0771234567 |
| Local | International | format_to_international | 0771234567 → +94771234567 |

### Formatting Function Signatures

```
Function: format_for_whatsapp(phone: str) → str
Purpose: Convert any valid Sri Lankan number to WhatsApp format
Input: "+94771234567", "0771234567", etc.
Output: "94771234567"

Function: format_for_display(whatsapp_phone: str) → str
Purpose: Convert WhatsApp format to user-friendly display
Input: "94771234567"
Output: "+94 77 123 4567"

Function: format_to_local(whatsapp_phone: str) → str
Purpose: Convert WhatsApp format to local format
Input: "94771234567"
Output: "0771234567"

Function: format_to_international(whatsapp_phone: str) → str
Purpose: Convert WhatsApp format to international format
Input: "94771234567"
Output: "+94771234567"
```

### Batch Formatting

```
Function: format_phones_for_whatsapp(phones: list[str]) → list[str]

Input: ["+94771234567", "0781234567", "077 123 4567"]
Output: ["94771234567", "94781234567", "94771234567"]

Purpose: Format multiple phones at once for bulk operations
```

### Integration with WhatsAppClient

```
In send_message method:

1. Validate phone (Task 29)
   is_valid, error = validate_sri_lankan_phone(to)
   if not is_valid:
       raise WhatsAppValidationError(error)

2. Format phone (Task 30)
   formatted_phone = format_for_whatsapp(to)

3. Use formatted phone in API payload
   payload = {
       "to": formatted_phone,  # 94771234567
       ...
   }

4. Log with display format
   logger.info(f"Sending to {format_for_display(formatted_phone)}")
```

### Formatting Safety Checks

| Check | Purpose | Action if Failed |
|-------|---------|------------------|
| Starts with 94 | Verify country code | Raise error |
| Length is 11 | Verify complete number | Raise error |
| Only digits | Verify clean format | Raise error |
| Mobile prefix (7) | Verify mobile number | Raise error |

### Error Handling

| Error Scenario | Error Message | Cause |
|----------------|---------------|-------|
| Formatting failed | "Failed to format phone number" | Unexpected input |
| Wrong length after format | "Invalid phone format after conversion" | Logic error |
| Missing country code | "Country code missing after formatting" | Logic error |
| Non-digit characters | "Formatted number contains non-digits" | Incomplete cleanup |

### Performance Considerations

| Aspect | Recommendation |
|--------|----------------|
| Caching | Cache formatted numbers for repeated use |
| Bulk operations | Use batch formatting for lists |
| Validation first | Always validate before formatting |
| Logging | Log only for errors, not every format |

### Expected Outcome
- Formatting function implemented
- All input formats converted to WhatsApp format
- Display formatting for user-friendly output
- Batch formatting for bulk operations
- Safety checks prevent malformed numbers
- Seamless integration with validation and sending

### Verification Checklist
- [ ] `format_for_whatsapp` function implemented in phone_utils.py
- [ ] All input formats handled correctly
- [ ] Output always in format 94XXXXXXXXX
- [ ] `format_for_display` function for user-friendly format
- [ ] `format_to_local` function for local format
- [ ] Batch formatting function implemented
- [ ] Safety checks verify correct output
- [ ] Error handling for formatting failures
- [ ] Integrated with WhatsAppClient send methods
- [ ] Tested with all input format variations
- [ ] Performance optimized for bulk operations

---

## Task 31: Create Message Logging

### Overview
Implement comprehensive message logging infrastructure to track all WhatsApp messages sent through the system. Logging is critical for debugging, analytics, compliance, and customer support. Create logging mechanisms that capture message details, track delivery status, support audit trails, enable analytics, and provide insights into messaging patterns.

### Dependencies
- Task 23: Create send_message Method

### Instructions

1. **Create message log model**
   - Navigate to `backend/apps/notifications/models.py`
   - Create `WhatsAppMessageLog` model
   - Store all sent messages with full details
   - Enable querying and reporting

2. **Define log model fields**
   - tenant: Foreign key to tenant (multi-tenancy)
   - recipient: Phone number in WhatsApp format
   - message_type: Type of message (text, template, image, etc.)
   - message_id: WhatsApp message ID (wamid...)
   - status: Send status (sent, delivered, read, failed)
   - content: Message content (sanitized, no sensitive data)
   - error_code: Error code if failed
   - error_message: Error message if failed
   - created_at: Timestamp when sent
   - updated_at: Last status update timestamp
   - metadata: JSON field for additional data

3. **Add message content storage**
   - For text: Store message text (up to 4096 chars)
   - For template: Store template name and parameters
   - For media: Store media URL or ID and caption
   - For interactive: Store button/list structure
   - Sanitize content (remove sensitive data like tokens)

4. **Implement logging in send_message**
   - Create log entry before sending
   - Set status to "pending"
   - Update with message_id after successful send
   - Set status to "sent"
   - Update with error details if failed

5. **Add status tracking**
   - Initial status: "pending" (before send)
   - Success status: "sent" (message sent to WhatsApp)
   - Webhook updates: "delivered", "read", "failed"
   - Track status transitions and timestamps
   - Enable status history tracking

6. **Create logging helper methods**
   - Method: `log_message_sent` - Log successful send
   - Method: `log_message_failed` - Log send failure
   - Method: `update_message_status` - Update from webhook
   - Method: `get_message_log` - Retrieve log by message_id

7. **Implement error logging**
   - Capture error code and message
   - Store full exception details (sanitized)
   - Link to tenant and recipient
   - Enable error analysis and debugging

8. **Add metadata tracking**
   - Order ID or invoice ID (if applicable)
   - Campaign ID (for marketing messages)
   - User ID who triggered send
   - Application context (POS, ERP, Webstore)
   - Custom tags for filtering

9. **Create privacy and compliance measures**
   - Do not store sensitive information
   - Mask phone numbers in logs (show last 4 digits)
   - Sanitize message content
   - Support data retention policies
   - Enable GDPR-compliant deletion

10. **Implement log querying methods**
    - Query by tenant
    - Query by recipient
    - Query by date range
    - Query by status
    - Query by message type
    - Support pagination

11. **Add analytics helpers**
    - Count messages by type
    - Calculate delivery rates
    - Track error patterns
    - Monitor usage by tenant
    - Generate reports

12. **Create logging middleware**
    - Automatically log all send attempts
    - Catch exceptions and log errors
    - Add timing information
    - Track retry attempts

### Message Log Model Structure

```
Model: WhatsAppMessageLog
Table: notifications_whatsapp_message_log

Fields:
- id: BigAutoField (primary key)
- tenant: ForeignKey(Tenant)
- recipient: CharField(20)  # WhatsApp format: 94XXXXXXXXX
- recipient_display: CharField(20)  # Display format: +94 XX XXX XXXX
- message_type: CharField(20)  # text, template, image, document, interactive
- message_id: CharField(255)  # WhatsApp wamid (null until sent)
- status: CharField(20)  # pending, sent, delivered, read, failed
- content: TextField  # Sanitized message content
- template_name: CharField(100, null=True)  # For templates
- error_code: CharField(10, null=True)
- error_message: TextField(null=True)
- metadata: JSONField(default=dict)
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)
- sent_at: DateTimeField(null=True)  # When WhatsApp confirmed send
- delivered_at: DateTimeField(null=True)  # When delivered to recipient
- read_at: DateTimeField(null=True)  # When read by recipient

Indexes:
- tenant + created_at (for tenant queries)
- message_id (unique, for webhook lookups)
- recipient + created_at (for recipient history)
- status + created_at (for status reports)
```

### Message Status Flow

```
┌──────────┐
│ pending  │ ← Initial status before API call
└────┬─────┘
     │
     ▼
┌──────────┐
│  sent    │ ← After successful API response
└────┬─────┘
     │
     ├─────────────────┬────────────────┐
     ▼                 ▼                ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│delivered │    │  failed  │    │(timeout) │
└────┬─────┘    └──────────┘    └──────────┘
     │
     ▼
┌──────────┐
│  read    │ ← When user reads message
└──────────┘
```

### Message Status Definitions

| Status | Description | Triggered By | Timestamp Field |
|--------|-------------|--------------|-----------------|
| pending | Message being sent | Initial creation | created_at |
| sent | Sent to WhatsApp | API success response | sent_at |
| delivered | Delivered to recipient | Webhook notification | delivered_at |
| read | Read by recipient | Webhook notification | read_at |
| failed | Send or delivery failed | API error or webhook | updated_at |

### Logging Integration Points

| Method | Logging Action |
|--------|---------------|
| send_message | Create log entry, update with message_id |
| send_template | Log template name and parameters |
| send_text | Log text content (sanitized) |
| send_image | Log image URL/ID and caption |
| send_document | Log document URL/ID and filename |
| send_interactive | Log button/list structure |
| _handle_error | Log error code and message |

### Content Sanitization

| Content Type | What to Store | What to Exclude |
|--------------|---------------|-----------------|
| Text | Message body | API tokens, passwords |
| Template | Template name, parameter values | Sensitive parameter data |
| Image | Image URL (sanitized), caption | Full CDN paths with tokens |
| Document | Document name, type | Document content |
| Interactive | Button/list structure | Sensitive button data |

### Metadata Examples

```
For order confirmation:
{
  "order_id": "ORD-1234",
  "source": "webstore",
  "user_id": 567,
  "campaign": null,
  "tags": ["order", "confirmation"]
}

For marketing campaign:
{
  "order_id": null,
  "source": "erp",
  "user_id": 123,
  "campaign": "flash-sale-2026",
  "tags": ["marketing", "promotion"]
}

For OTP:
{
  "order_id": null,
  "source": "auth",
  "user_id": null,
  "campaign": null,
  "tags": ["otp", "security"],
  "otp_expires_at": "2026-01-31T10:15:00Z"
}
```

### Log Query Examples

```
Query 1: Messages sent to recipient
WhatsAppMessageLog.objects.filter(
    tenant=tenant,
    recipient="94771234567"
).order_by('-created_at')

Query 2: Failed messages in last 24 hours
WhatsAppMessageLog.objects.filter(
    tenant=tenant,
    status='failed',
    created_at__gte=now() - timedelta(days=1)
)

Query 3: Messages by type and date range
WhatsAppMessageLog.objects.filter(
    tenant=tenant,
    message_type='template',
    created_at__date=date(2026, 1, 31)
).count()

Query 4: Delivery rate calculation
total = WhatsAppMessageLog.objects.filter(tenant=tenant).count()
delivered = WhatsAppMessageLog.objects.filter(
    tenant=tenant,
    status__in=['delivered', 'read']
).count()
delivery_rate = (delivered / total) * 100
```

### Analytics Metrics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Total messages | Count all logs | Usage tracking |
| Delivery rate | (delivered + read) / sent | Quality monitoring |
| Read rate | read / delivered | Engagement tracking |
| Failure rate | failed / total | Error monitoring |
| By message type | Count by type | Usage patterns |
| By hour/day | Group by time | Peak usage times |
| By template | Count by template_name | Template effectiveness |

### Log Retention Policy

| Log Age | Action | Reason |
|---------|--------|--------|
| 0-30 days | Keep all details | Active debugging and support |
| 31-90 days | Keep aggregated data | Recent analytics |
| 91-365 days | Archive to cold storage | Compliance |
| >365 days | Delete (with consent) | Data minimization |

### Privacy and Compliance

| Aspect | Implementation |
|--------|----------------|
| Phone masking | Display only last 4 digits in most views |
| Content redaction | Remove sensitive data before storage |
| Access control | Restrict log access to authorized users |
| Audit trail | Log who accessed message logs |
| Data deletion | Support right to erasure (GDPR) |
| Retention limits | Auto-delete old logs per policy |

### Error Analysis Queries

```
Top 5 error codes:
SELECT error_code, COUNT(*) as count
FROM notifications_whatsapp_message_log
WHERE status = 'failed'
GROUP BY error_code
ORDER BY count DESC
LIMIT 5

Failures by hour:
SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*)
FROM notifications_whatsapp_message_log
WHERE status = 'failed' AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour
```

### Expected Outcome
- Message log model created
- All messages logged with full details
- Status tracking from send to read
- Error logging for failed messages
- Metadata support for context
- Query helpers for analytics
- Privacy and compliance measures
- Useful for debugging and reporting

### Verification Checklist
- [ ] WhatsAppMessageLog model created
- [ ] All required fields defined
- [ ] Logging integrated in send_message
- [ ] Status tracking implemented (pending, sent, delivered, read, failed)
- [ ] Error logging captures code and message
- [ ] Metadata field for additional context
- [ ] Content sanitization removes sensitive data
- [ ] Phone number masking for privacy
- [ ] Query methods for common analytics
- [ ] Indexes for performance
- [ ] Tested with all message types
- [ ] Log retention policy documented

---

## Task 32: Verify API Client

### Overview
Perform comprehensive verification of the WhatsApp API client implementation. Test all components, validate integration, ensure error handling works correctly, verify rate limiting, test message sending for all types, and confirm logging functionality. This task ensures the API client is production-ready and all components work together seamlessly.

### Dependencies
- Task 31: Create Message Logging

### Instructions

1. **Create verification test file**
   - Create file `tests/test_whatsapp_client.py`
   - Use pytest or Django's test framework
   - Organize tests by component
   - Include integration tests

2. **Verify client initialization**
   - Test client creates successfully with valid config
   - Test client raises error with missing credentials
   - Verify HTTP client initialized correctly
   - Test context manager (async with)

3. **Verify authentication**
   - Test auth headers generated correctly
   - Verify Bearer token format
   - Test token validation
   - Verify all required headers present

4. **Verify request handler**
   - Test URL construction with all components
   - Test different HTTP methods (GET, POST, DELETE)
   - Verify request data serialization
   - Test response parsing

5. **Verify error handling**
   - Test all custom exception classes
   - Verify error code to exception mapping
   - Test retryable vs non-retryable errors
   - Verify error messages are clear
   - Test error context includes request details

6. **Verify rate limiter**
   - Test rate limit check before send
   - Verify token consumption after send
   - Test different tier limits
   - Verify wait time calculation
   - Test rate limit status query

7. **Verify retry logic**
   - Test exponential backoff calculation
   - Verify retry on transient errors
   - Test no retry on permanent errors
   - Verify maximum retry attempts
   - Test Retry-After header handling

8. **Verify send_message method**
   - Test phone number validation and formatting
   - Verify payload construction
   - Test API call execution
   - Verify response parsing
   - Test message_id extraction

9. **Verify send_template method**
   - Test template payload construction
   - Verify parameter formatting
   - Test header, body, button parameters
   - Verify integration with send_message

10. **Verify send_text method**
    - Test simple text messages
    - Verify text length validation
    - Test preview_url feature
    - Test with special characters and emojis

11. **Verify send_image method**
    - Test with image URL
    - Test with media ID
    - Verify caption support
    - Test image validation

12. **Verify send_document method**
    - Test with document URL
    - Test with media ID
    - Verify filename and caption
    - Test different file types

13. **Verify send_interactive method**
    - Test button messages (1-3 buttons)
    - Test list messages (sections and rows)
    - Verify button/list validation
    - Test header and footer support

14. **Verify phone validation**
    - Test valid Sri Lankan numbers
    - Test invalid formats
    - Verify error messages
    - Test landline rejection
    - Test all mobile prefixes

15. **Verify phone formatting**
    - Test all input format variations
    - Verify output is always 94XXXXXXXXX
    - Test display formatting
    - Test batch formatting

16. **Verify message logging**
    - Test log creation on send
    - Verify all fields populated correctly
    - Test status updates
    - Test error logging
    - Verify metadata storage
    - Test privacy measures (phone masking)

17. **Perform integration testing**
    - Test complete flow: validate → format → send → log
    - Verify rate limiting during sends
    - Test retry logic with simulated errors
    - Test multiple message types in sequence

18. **Test with real API (staging)**
    - Send test messages to real phone numbers
    - Verify messages received
    - Check status updates via webhooks
    - Verify WhatsApp displays correctly

19. **Create verification checklist document**
    - Document all test cases
    - List pass/fail criteria
    - Include test data examples
    - Document known issues or limitations

20. **Perform load testing (optional)**
    - Test sending multiple messages concurrently
    - Verify rate limiting under load
    - Test error handling under stress
    - Monitor performance and resource usage

### Verification Test Structure

```
tests/
└── notifications/
    └── whatsapp/
        ├── __init__.py
        ├── test_client_initialization.py
        ├── test_authentication.py
        ├── test_request_handler.py
        ├── test_error_handling.py
        ├── test_rate_limiter.py
        ├── test_retry_logic.py
        ├── test_send_methods.py
        ├── test_phone_utils.py
        ├── test_message_logging.py
        └── test_integration.py
```

### Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| Unit Tests | Individual component tests | Verify each function works |
| Integration Tests | Multiple components together | Verify components work together |
| API Tests | Real API calls (staging) | Verify actual WhatsApp integration |
| Error Tests | Simulated error scenarios | Verify error handling |
| Load Tests | High volume sends | Verify performance and limits |

### Key Test Cases

| Component | Test Case | Expected Result |
|-----------|-----------|-----------------|
| Client Init | Create with valid config | Client initialized successfully |
| Client Init | Create with missing token | Raises configuration error |
| Auth | Generate headers | Returns dict with Authorization header |
| Auth | Bearer token format | "Bearer {token}" format |
| Request | POST to messages endpoint | Successful response |
| Request | GET with query params | Params included in URL |
| Error | Rate limit error (130) | WhatsAppRateLimitError raised |
| Error | Auth error (190) | WhatsAppAuthenticationError raised |
| Rate Limit | Check before send | Returns True if available |
| Rate Limit | Exceed limit | Returns False with wait time |
| Retry | Transient error | Retries with backoff |
| Retry | Permanent error | No retry, raises immediately |
| send_message | Valid phone and data | Returns message_id |
| send_template | Template with params | Message sent successfully |
| send_text | Text message | Message sent successfully |
| send_image | Image with URL | Message sent successfully |
| send_document | Document with URL | Message sent successfully |
| send_interactive | Button message | Message sent successfully |
| Phone Validation | Valid mobile | Returns (True, None) |
| Phone Validation | Landline | Returns (False, error) |
| Phone Formatting | +94771234567 | Returns 94771234567 |
| Phone Formatting | 0771234567 | Returns 94771234567 |
| Logging | Successful send | Log created with message_id |
| Logging | Failed send | Log created with error |

### Mock Data for Testing

```
Valid Test Phone Numbers:
- +94771234567 (Dialog)
- +94712345678 (Mobitel)
- +94781234567 (Hutch)

Invalid Test Phone Numbers:
- 0112345678 (Colombo landline)
- +1234567890 (Wrong country)
- 1234567 (Too short)

Test WhatsApp Config:
{
    "phone_number_id": "test_phone_123",
    "access_token": "test_token_" + "a" * 100,
    "business_account_id": "test_business_123"
}

Test Template:
{
    "name": "order_confirmation_test",
    "language": "en",
    "parameters": ["Test User", "TEST-1234", "1000"]
}
```

### API Mocking for Unit Tests

```
Mock successful send_message response:
{
    "messaging_product": "whatsapp",
    "contacts": [{"wa_id": "94771234567"}],
    "messages": [{"id": "wamid.test123", "message_status": "sent"}]
}

Mock rate limit error:
{
    "error": {
        "message": "Rate limit exceeded",
        "code": 130,
        "type": "OAuthException"
    }
}

Mock auth error:
{
    "error": {
        "message": "Invalid access token",
        "code": 190,
        "type": "OAuthException"
    }
}
```

### Integration Test Flow

```
Test: Complete message flow
1. Create WhatsAppClient
2. Validate phone number: +94771234567
3. Format phone: 94771234567
4. Check rate limit: Should allow
5. Send text message: "Test message"
6. Verify message_id returned
7. Check message log created
8. Verify log has correct status
9. Update status via mock webhook
10. Verify status updated to "delivered"
```

### Load Test Scenarios

| Scenario | Messages | Duration | Purpose |
|----------|----------|----------|---------|
| Burst | 100 | 10 seconds | Test rate limiter |
| Sustained | 1000 | 1 hour | Test stability |
| Mixed types | 500 | 30 minutes | Test all message types |
| Error handling | 100 (50% fail) | 10 minutes | Test error resilience |

### Performance Benchmarks

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Message send time | <2 seconds | TBD | ⏳ |
| Retry overhead | <5 seconds total | TBD | ⏳ |
| Rate limit check | <100ms | TBD | ⏳ |
| Log write | <50ms | TBD | ⏳ |
| Phone validation | <10ms | TBD | ⏳ |

### Verification Checklist

```
[ ] Client Initialization
    [ ] Successful init with valid config
    [ ] Error on missing credentials
    [ ] Context manager works
    [ ] Health check works

[ ] Authentication
    [ ] Headers generated correctly
    [ ] Bearer token format correct
    [ ] All required headers present

[ ] Request Handler
    [ ] URL construction correct
    [ ] All HTTP methods work
    [ ] Response parsing works

[ ] Error Handling
    [ ] All exception classes work
    [ ] Error code mapping correct
    [ ] Retryable detection works
    [ ] Error messages clear

[ ] Rate Limiting
    [ ] Rate limit check works
    [ ] Token consumption works
    [ ] Wait time calculation correct
    [ ] All tiers supported

[ ] Retry Logic
    [ ] Exponential backoff works
    [ ] Retries transient errors
    [ ] No retry on permanent errors
    [ ] Max retries respected

[ ] send_message
    [ ] Phone validation works
    [ ] Payload construction correct
    [ ] API call successful
    [ ] Response parsing works

[ ] send_template
    [ ] Template payload correct
    [ ] Parameters formatted
    [ ] All component types work

[ ] send_text
    [ ] Text messages sent
    [ ] Length validation works
    [ ] preview_url works

[ ] send_image
    [ ] URL and media ID work
    [ ] Caption supported
    [ ] Validation works

[ ] send_document
    [ ] URL and media ID work
    [ ] Filename and caption work
    [ ] File type validation works

[ ] send_interactive
    [ ] Button messages work
    [ ] List messages work
    [ ] Validation correct
    [ ] Headers/footers work

[ ] Phone Validation
    [ ] Valid numbers pass
    [ ] Invalid numbers fail
    [ ] All formats handled
    [ ] Error messages clear

[ ] Phone Formatting
    [ ] All formats converted
    [ ] Output always correct
    [ ] Display formatting works

[ ] Message Logging
    [ ] Logs created on send
    [ ] All fields populated
    [ ] Status updates work
    [ ] Privacy measures work

[ ] Integration
    [ ] Complete flow works
    [ ] All components integrate
    [ ] Error handling works end-to-end

[ ] Real API Testing (Staging)
    [ ] Messages sent successfully
    [ ] Messages received correctly
    [ ] WhatsApp display correct
    [ ] Status updates received

[ ] Documentation
    [ ] All methods documented
    [ ] Examples provided
    [ ] Errors documented
    [ ] Limitations noted
```

### Known Limitations Document

```
Limitations:
1. WhatsApp message rate limits depend on business tier
2. Template messages require pre-approval from Facebook
3. Media files must be publicly accessible (for URLs)
4. Interactive messages limited to 3 buttons or 100 list items
5. First message to user must be template (24-hour rule)
6. Some features require specific WhatsApp Business API access levels

Workarounds:
1. Implement queueing for rate limit management
2. Pre-create and approve templates
3. Use media upload API for private files
4. Use lists for more options (10 sections × 10 rows)
5. Send template first, then free-form messages
6. Contact Facebook for tier upgrades
```

### Expected Outcome
- All components tested individually
- Integration tests pass
- Real API tests successful (staging)
- Error handling verified
- Rate limiting works correctly
- Logging captures all details
- Phone utilities validated
- Documentation complete
- Client ready for production

### Verification Checklist
- [ ] All unit tests written and passing
- [ ] Integration tests cover complete flows
- [ ] Error scenarios tested and handled
- [ ] Rate limiting tested under load
- [ ] All message types tested
- [ ] Phone validation tested with all formats
- [ ] Phone formatting tested with all inputs
- [ ] Message logging tested for all scenarios
- [ ] Real API tests successful (staging environment)
- [ ] Load tests completed (optional)
- [ ] Performance benchmarks met
- [ ] Documentation reviewed and complete
- [ ] Known limitations documented
- [ ] Verification checklist completed
- [ ] Client approved for production deployment

---

## Summary

This document completed the WhatsApp API client implementation by adding media message sending, interactive messages, phone number utilities for Sri Lanka, comprehensive message logging, and thorough verification. The API client is now fully featured and production-ready.

### Completed Components

| Task | Component | Purpose |
|------|-----------|---------|
| 26 | send_image | Send image messages with captions |
| 27 | send_document | Send document files (PDF, Word, Excel) |
| 28 | send_interactive | Send button and list messages |
| 29 | Phone Validation | Validate Sri Lankan phone numbers |
| 30 | Phone Formatting | Format numbers for WhatsApp API |
| 31 | Message Logging | Track all messages with analytics |
| 32 | Verification | Comprehensive testing and validation |

### Group B Complete

Group B (API Client & Auth) is now complete with:
- ✓ WhatsAppClient class with full configuration
- ✓ Bearer token authentication
- ✓ Generic request handler with retry and rate limiting
- ✓ Comprehensive error handling
- ✓ All message types (text, template, image, document, interactive)
- ✓ Sri Lankan phone number validation and formatting
- ✓ Message logging and analytics
- ✓ Full verification and testing

### Next Steps

**Continue to:** [Group-C: Template Messages](../Group-C_Template-Messages/) for template management, creation, approval workflows, and parameter handling.
