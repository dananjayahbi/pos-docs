# Tasks 31-40: Environment and Navigation Configuration

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** C - Store Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-46_Business-SEO-Verify.md](02_Tasks-41-46_Business-SEO-Verify.md)

---

## Document Overview

This document covers the creation of store environment variables, configuration files, and navigation structures. It establishes the foundational configuration for the LankaCommerce storefront, including environment setup, store metadata, currency settings (LKR), locale settings (en-LK), feature flags, routing configuration, navigation menu, footer links, and social media integration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create Store Environment Variables | Low | 20 min |
| 32 | Create Store Config File | Medium | 30 min |
| 33 | Define Store Metadata | Low | 15 min |
| 34 | Configure Currency Settings | Low | 15 min |
| 35 | Configure Locale Settings | Low | 20 min |
| 36 | Create Store Feature Flags | Medium | 25 min |
| 37 | Create Store Routes Config | Low | 20 min |
| 38 | Create Store Navigation Config | Low | 25 min |
| 39 | Create Store Footer Config | Low | 20 min |
| 40 | Create Social Links Config | Low | 15 min |

---

## Task 31: Create Store Environment Variables

### Overview
Create environment variables for the storefront application using Next.js `.env.local` file. These variables will store sensitive configuration data, API endpoints, public store information, and environment-specific settings. Environment variables prefixed with `NEXT_PUBLIC_` will be accessible in client-side code.

### Dependencies
- Task 14: Verify Directory Structure (from Group-A)
- Frontend project is initialized and running

### Instructions

1. **Navigate to frontend root directory**
   - Go to the root of the frontend project
   - This is where Next.js configuration files are located
   - Ensure you're in the correct workspace location

2. **Create .env.local file**
   - Create new file named `.env.local`
   - This file is ignored by git (per .gitignore)
   - Used for local development only

3. **Define public store variables**
   - Add `NEXT_PUBLIC_STORE_NAME` for the store brand name
   - Add `NEXT_PUBLIC_STORE_URL` for the production URL
   - Add `NEXT_PUBLIC_STORE_DOMAIN` for domain name
   - Add `NEXT_PUBLIC_CURRENCY` set to "LKR"
   - Add `NEXT_PUBLIC_LOCALE` set to "en-LK"

4. **Define API endpoints**
   - Add `NEXT_PUBLIC_API_URL` for backend API base URL
   - Add `NEXT_PUBLIC_API_VERSION` (e.g., "v1")
   - Add `NEXT_PUBLIC_GRAPHQL_URL` if using GraphQL
   - Include full URLs with protocol (https://)

5. **Define feature toggles**
   - Add `NEXT_PUBLIC_ENABLE_ANALYTICS` boolean
   - Add `NEXT_PUBLIC_ENABLE_PWA` boolean
   - Add `NEXT_PUBLIC_MAINTENANCE_MODE` boolean
   - These control optional features

6. **Define third-party service keys**
   - Add `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
   - Add `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
   - Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Add placeholders for development if keys not available

7. **Define server-side only variables**
   - Add `DATABASE_URL` (without NEXT_PUBLIC_ prefix)
   - Add `SECRET_KEY` for encryption
   - Add `STRIPE_SECRET_KEY`
   - These won't be exposed to browser

8. **Add development settings**
   - Add `NODE_ENV` set to "development"
   - Add `NEXT_PUBLIC_DEBUG_MODE` set to "true"
   - Add `NEXT_PUBLIC_MOCK_API` for testing without backend

### Environment Variable Categories

| Category | Prefix | Browser Access | Examples |
|----------|--------|----------------|----------|
| Public Store | NEXT_PUBLIC_ | Yes | STORE_NAME, CURRENCY |
| API Endpoints | NEXT_PUBLIC_ | Yes | API_URL, GRAPHQL_URL |
| Third-Party Keys | NEXT_PUBLIC_ | Yes | GA_ID, STRIPE_PUBLIC |
| Server Secrets | None | No | DATABASE_URL, SECRET_KEY |
| Feature Flags | NEXT_PUBLIC_ | Yes | ENABLE_PWA |

### Sri Lanka-Specific Variables

| Variable Name | Value | Description |
|---------------|-------|-------------|
| NEXT_PUBLIC_CURRENCY | LKR | Sri Lankan Rupees |
| NEXT_PUBLIC_LOCALE | en-LK | English (Sri Lanka) |
| NEXT_PUBLIC_TIMEZONE | Asia/Colombo | Colombo timezone |
| NEXT_PUBLIC_PHONE_PREFIX | +94 | Country calling code |
| NEXT_PUBLIC_VAT_RATE | 18 | VAT percentage |

### Variable Naming Convention

```
Structure: [SCOPE]_[CATEGORY]_[NAME]

Examples:
NEXT_PUBLIC_STORE_NAME          → Public store variable
NEXT_PUBLIC_API_URL             → Public API variable
DATABASE_URL                    → Private server variable
NEXT_PUBLIC_ENABLE_ANALYTICS    → Public feature flag
```

### Environment File Structure

```
# ================================
# Store Information
# ================================
NEXT_PUBLIC_STORE_NAME=...
NEXT_PUBLIC_STORE_URL=...
NEXT_PUBLIC_CURRENCY=LKR
NEXT_PUBLIC_LOCALE=en-LK

# ================================
# API Configuration
# ================================
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_API_VERSION=v1

# ================================
# Feature Flags
# ================================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=false

# ================================
# Third-Party Services
# ================================
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# ================================
# Server-Only Variables
# ================================
DATABASE_URL=...
SECRET_KEY=...
```

### Security Best Practices

| Practice | Description |
|----------|-------------|
| Never commit secrets | Add .env.local to .gitignore |
| Use NEXT_PUBLIC_ wisely | Only for truly public data |
| Rotate keys regularly | Change API keys periodically |
| Document required vars | Maintain .env.example file |
| Validate on startup | Check required vars exist |

### Expected Outcome
- `.env.local` file created with all necessary variables
- Public variables prefixed with `NEXT_PUBLIC_`
- Server secrets kept private (no NEXT_PUBLIC_ prefix)
- Sri Lanka-specific settings configured
- Proper organization with comments

### Verification Checklist
- [ ] `.env.local` file created in frontend root
- [ ] Store name and URL variables defined
- [ ] Currency set to LKR
- [ ] Locale set to en-LK
- [ ] API URLs configured
- [ ] Feature flags added
- [ ] Third-party keys added (with placeholders)
- [ ] Server-only secrets added without NEXT_PUBLIC_
- [ ] File organized with comment sections
- [ ] .env.example file created (optional but recommended)

---

## Task 32: Create Store Config File

### Overview
Create the main store configuration file that imports environment variables and exports typed configuration objects. This centralized config file serves as the single source of truth for all store settings, making them easily accessible throughout the application with full TypeScript support.

### Dependencies
- Task 31: Create Store Environment Variables

### Instructions

1. **Create lib/store directory structure**
   - Navigate to `frontend/lib/` directory
   - Create new folder named `store`
   - This will contain all store-specific configuration files

2. **Create config.ts file**
   - Inside `lib/store/`, create `config.ts`
   - This is the main store configuration file
   - Will export typed configuration objects

3. **Import environment variables**
   - Import all `NEXT_PUBLIC_` variables from process.env
   - Create constants for each imported variable
   - Handle undefined cases with fallback values

4. **Define TypeScript interfaces**
   - Create interface for `StoreConfig`
   - Create interfaces for nested config sections
   - Include all configuration properties with proper types

5. **Create store info object**
   - Define `storeInfo` object with name, url, domain
   - Include contact information fields
   - Add business registration details

6. **Create API config object**
   - Define `apiConfig` with base URL and version
   - Include timeout and retry settings
   - Add headers configuration

7. **Create environment config object**
   - Define `environmentConfig` with mode and debug settings
   - Include feature toggle references
   - Add maintenance mode flag

8. **Export main config object**
   - Combine all config sections into main export
   - Name it `storeConfig`
   - Ensure full TypeScript type safety

9. **Add validation logic**
   - Create function to validate required variables
   - Log warnings for missing optional variables
   - Throw errors for missing required variables

10. **Create config getter functions**
    - Create helper functions like `getApiUrl()`
    - Create `getStoreUrl()` for absolute URLs
    - Add utility functions for common config access

### Configuration File Structure

```
lib/store/
├── config.ts              # Main config (this task)
├── routes.ts              # Routes config (Task 37)
├── navigation.ts          # Navigation config (Task 38)
├── shipping.ts            # Shipping config (Task 42)
├── payment.ts             # Payment config (Task 43)
├── seo.ts                 # SEO config (Task 44)
├── images.ts              # Image config (Task 45)
└── index.ts               # Re-export all configs
```

### Store Config Interface Structure

| Section | Properties | Description |
|---------|------------|-------------|
| storeInfo | name, url, domain, tagline | Basic store information |
| apiConfig | baseUrl, version, timeout | API connection settings |
| currencyConfig | code, symbol, decimals | Currency formatting |
| localeConfig | locale, language, timezone | Localization settings |
| featuresConfig | wishlist, reviews, compare | Feature toggles |

### Configuration Sections

```
storeConfig
├── storeInfo
│   ├── name: string
│   ├── url: string
│   ├── domain: string
│   ├── tagline: string
│   └── email: string
├── apiConfig
│   ├── baseUrl: string
│   ├── version: string
│   ├── timeout: number
│   └── retries: number
├── currencyConfig (detailed in Task 34)
├── localeConfig (detailed in Task 35)
└── featuresConfig (detailed in Task 36)
```

### Environment Variable Mapping

| Environment Variable | Config Property | Type |
|---------------------|-----------------|------|
| NEXT_PUBLIC_STORE_NAME | storeInfo.name | string |
| NEXT_PUBLIC_STORE_URL | storeInfo.url | string |
| NEXT_PUBLIC_API_URL | apiConfig.baseUrl | string |
| NEXT_PUBLIC_CURRENCY | currencyConfig.code | string |
| NEXT_PUBLIC_LOCALE | localeConfig.locale | string |

### Type Safety Example

```
TypeScript Interface
└── interface StoreConfig {
      storeInfo: {
        name: string;
        url: string;
        domain: string;
      };
      apiConfig: {
        baseUrl: string;
        version: string;
        timeout: number;
      };
      // ... more sections
    }

Usage
└── import { storeConfig } from '@/lib/store/config';
    
    const storeName = storeConfig.storeInfo.name;  // Type-safe
    const apiUrl = storeConfig.apiConfig.baseUrl;  // Autocomplete
```

### Validation Strategy

| Validation Type | When | Action |
|----------------|------|--------|
| Required Check | On import | Throw error if missing |
| Type Check | On import | Validate correct type |
| Format Check | On import | Validate URL format, etc. |
| Range Check | On use | Validate numeric ranges |

### Helper Functions

| Function | Purpose | Return Type |
|----------|---------|-------------|
| getApiUrl(path) | Construct full API URL | string |
| getStoreUrl(path) | Construct full store URL | string |
| isFeatureEnabled(feature) | Check feature flag | boolean |
| getCurrency() | Get currency config | CurrencyConfig |

### Expected Outcome
- Main store config file with TypeScript interfaces
- Environment variables imported and typed
- Configuration organized in logical sections
- Validation for required variables
- Helper functions for common operations
- Full type safety throughout application

### Verification Checklist
- [ ] `lib/store/` directory created
- [ ] `config.ts` file created
- [ ] TypeScript interfaces defined
- [ ] Environment variables imported
- [ ] Store info section configured
- [ ] API config section configured
- [ ] Config object exported with proper typing
- [ ] Validation logic implemented
- [ ] Helper functions created
- [ ] No TypeScript errors

---

## Task 33: Define Store Metadata

### Overview
Define comprehensive store metadata that describes the business, including store name, tagline, description, business information, and branding details. This metadata will be used throughout the application for SEO, display purposes, and business identification.

### Dependencies
- Task 32: Create Store Config File

### Instructions

1. **Add metadata section to config**
   - Open `lib/store/config.ts`
   - Create new `metadata` section in config object
   - Define TypeScript interface for metadata

2. **Define store name and tagline**
   - Add full store name (e.g., "LankaCommerce Store")
   - Add short tagline (max 60 characters)
   - Create variations: short name, full name, display name

3. **Define store description**
   - Write short description (160 characters max)
   - Write long description (500 characters max)
   - Focus on Sri Lankan market and products
   - Include keywords naturally

4. **Add business information**
   - Business registration number
   - Business type (Pvt Ltd, LLC, etc.)
   - Year established
   - Company address (Sri Lankan format)

5. **Define branding details**
   - Primary brand color (hex code)
   - Secondary brand colors
   - Brand font names
   - Logo file paths

6. **Add contact information**
   - Primary email address
   - Support email address
   - Phone numbers (format: +94 XX XXX XXXX)
   - WhatsApp number for Sri Lanka

7. **Define business hours**
   - Operating hours per day
   - Timezone (Asia/Colombo)
   - Holiday schedule
   - Support availability

8. **Add social proof elements**
   - Customer count (if available)
   - Product count
   - Years in business
   - Awards or certifications

### Store Metadata Structure

| Category | Properties | Purpose |
|----------|-----------|---------|
| Basic Info | name, tagline, description | Primary identification |
| Business | registration, type, established | Legal information |
| Branding | colors, fonts, logos | Visual identity |
| Contact | email, phone, address | Customer communication |
| Hours | schedule, timezone | Availability information |

### Metadata Properties

```
metadata
├── name
│   ├── full: "LankaCommerce Store"
│   ├── short: "LankaCommerce"
│   └── display: "LCC Store"
├── tagline: "Your One-Stop Shop in Sri Lanka"
├── description
│   ├── short: "Quality products at best prices..."
│   └── long: "Detailed description..."
├── business
│   ├── registration: "PV XXXXX"
│   ├── type: "Private Limited"
│   ├── established: 2020
│   └── vat: "VAT Reg No: XXXXXXXXX"
├── contact
│   ├── email: "info@store.lcc.lk"
│   ├── support: "support@store.lcc.lk"
│   ├── phone: "+94 11 234 5678"
│   └── whatsapp: "+94 77 XXX XXXX"
└── address
    ├── street: "123 Main Street"
    ├── city: "Colombo"
    ├── district: "Colombo"
    ├── province: "Western"
    └── postalCode: "00100"
```

### Sri Lankan Business Details

| Field | Format | Example |
|-------|--------|---------|
| Registration | PV XXXXX | PV 12345 |
| Phone | +94 XX XXX XXXX | +94 11 234 5678 |
| Mobile | +94 7X XXX XXXX | +94 77 123 4567 |
| Postal Code | 5 digits | 00100, 10230 |
| District | Name | Colombo, Gampaha |
| Province | Name | Western, Southern |

### Tagline Guidelines

| Characteristic | Guideline |
|----------------|-----------|
| Length | Maximum 60 characters |
| Focus | Value proposition |
| Language | English (Sri Lankan English) |
| Tone | Professional yet friendly |
| Keywords | Include searchable terms |

### Description Guidelines

| Type | Length | Purpose | Keywords |
|------|--------|---------|----------|
| Short | 150-160 chars | Meta description | 2-3 keywords |
| Long | 300-500 chars | About page | 5-7 keywords |
| Featured | 50-75 chars | Social sharing | 1-2 keywords |

### Branding Configuration

| Element | Specification | Usage |
|---------|--------------|--------|
| Primary Color | Hex code | Main brand color |
| Secondary Color | Hex code | Accents, buttons |
| Background Color | Hex code | Page backgrounds |
| Text Color | Hex code | Body text |
| Logo Path | File path | Brand logo location |

### Contact Information Structure

```
contact
├── email
│   ├── info: "info@store.lcc.lk"
│   ├── support: "support@store.lcc.lk"
│   ├── sales: "sales@store.lcc.lk"
│   └── admin: "admin@store.lcc.lk"
├── phone
│   ├── main: "+94 11 234 5678"
│   ├── support: "+94 11 234 5679"
│   └── whatsapp: "+94 77 XXX XXXX"
└── address (see above)
```

### Expected Outcome
- Complete metadata section in store config
- Store name, tagline, and descriptions defined
- Business information with Sri Lankan details
- Contact information in proper format
- Branding colors and assets referenced
- All metadata properly typed with TypeScript

### Verification Checklist
- [ ] Metadata section added to config.ts
- [ ] Store name (full, short, display) defined
- [ ] Tagline under 60 characters
- [ ] Short description under 160 characters
- [ ] Long description 300-500 characters
- [ ] Business registration number added
- [ ] Phone numbers in +94 format
- [ ] Address in Sri Lankan format
- [ ] Contact emails defined
- [ ] Branding colors specified
- [ ] All fields properly typed

---

## Task 34: Configure Currency Settings

### Overview
Configure comprehensive currency settings for Sri Lankan Rupees (LKR), including currency code, symbol (₨), decimal places, formatting rules, and display preferences. These settings ensure consistent currency display throughout the storefront with proper localization.

### Dependencies
- Task 32: Create Store Config File

### Instructions

1. **Create currency configuration section**
   - Add `currencyConfig` to main store config
   - Define TypeScript interface for currency settings
   - Export as part of main config object

2. **Define basic currency properties**
   - Set `code` to "LKR"
   - Set `symbol` to "₨"
   - Set `name` to "Sri Lankan Rupee"
   - Set `namePlural` to "Sri Lankan Rupees"

3. **Configure decimal settings**
   - Set `decimalPlaces` to 2
   - Set `decimalSeparator` to "."
   - Define rounding rules (round, floor, ceil)
   - Set default rounding to nearest cent

4. **Configure thousand separator**
   - Set `thousandSeparator` to ","
   - For LKR, optionally use Indian numbering system
   - Set `useIndianNumbering` flag (X,XX,XXX vs X,XXX,XXX)

5. **Define symbol position**
   - Set `symbolPosition` to "before" or "after"
   - For LKR, typically "before" (₨ 1,000.00)
   - Set `spaceBetweenSymbolAndAmount` boolean

6. **Configure formatting patterns**
   - Positive amount format: "₨ 1,234.56"
   - Negative amount format: "-₨ 1,234.56" or "(₨ 1,234.56)"
   - Zero display: "₨ 0.00" or "Free"
   - Large numbers: "₨ 1.2M", "₨ 5.3K" (optional)

7. **Define exchange rate settings**
   - Base currency (if supporting multiple)
   - Exchange rate API endpoint
   - Update frequency
   - Fallback exchange rates

8. **Create formatting helper function**
   - Function to format number as currency
   - Handle positive, negative, zero cases
   - Support compact format for large amounts
   - Include TypeScript types

### Currency Configuration Structure

```
currencyConfig
├── code: "LKR"
├── symbol: "₨"
├── name: "Sri Lankan Rupee"
├── namePlural: "Sri Lankan Rupees"
├── formatting
│   ├── decimalPlaces: 2
│   ├── decimalSeparator: "."
│   ├── thousandSeparator: ","
│   ├── symbolPosition: "before"
│   ├── spaceAfterSymbol: true
│   └── useIndianNumbering: false
├── display
│   ├── positiveFormat: "₨ {amount}"
│   ├── negativeFormat: "-₨ {amount}"
│   ├── zeroDisplay: "₨ 0.00"
│   └── compactFormat: true
└── exchange
    ├── baseCurrency: "LKR"
    ├── supportedCurrencies: ["USD", "EUR"]
    └── updateFrequency: "daily"
```

### Sri Lankan Rupee Specifications

| Property | Value | Description |
|----------|-------|-------------|
| ISO Code | LKR | International currency code |
| Symbol | ₨ | Unicode: U+20A8 |
| Subunit | Cents | 100 cents = 1 rupee |
| Decimals | 2 | Standard decimal places |
| Position | Before | ₨ before amount |

### Number Formatting Comparison

| Standard | Indian Numbering | Amount |
|----------|------------------|--------|
| 1,000 | 1,000 | One thousand |
| 10,000 | 10,000 | Ten thousand |
| 100,000 | 1,00,000 | One lakh |
| 1,000,000 | 10,00,000 | Ten lakhs |
| 10,000,000 | 1,00,00,000 | One crore |

### Currency Display Examples

| Scenario | Display | Notes |
|----------|---------|-------|
| Standard Price | ₨ 1,234.56 | With decimals |
| Whole Number | ₨ 1,000.00 | Show decimals |
| Small Amount | ₨ 0.50 | Show cents |
| Large Amount | ₨ 125,000.00 | With separators |
| Negative | -₨ 50.00 | Discount/refund |
| Zero/Free | Free | Special case |
| Compact | ₨ 1.2M | For large numbers |

### Formatting Rules

| Rule | Implementation |
|------|---------------|
| Always show decimals | Even for whole numbers (₨ 100.00) |
| Use thousand separator | Every 3 digits or Indian system |
| Space after symbol | ₨ [space] 100.00 |
| Negative format | Minus sign before symbol |
| Zero handling | Show as "Free" or "₨ 0.00" based on context |

### Format Helper Function Interface

```
Function: formatCurrency

Parameters:
├── amount: number (required)
├── options?: {
│   ├── showSymbol?: boolean
│   ├── compact?: boolean
│   ├── decimals?: number
│   └── zeroDisplay?: string
│   }

Returns: string (formatted currency)

Examples:
├── formatCurrency(1234.56) → "₨ 1,234.56"
├── formatCurrency(0) → "Free"
├── formatCurrency(1500000, { compact: true }) → "₨ 1.5M"
└── formatCurrency(-50) → "-₨ 50.00"
```

### Locale-Specific Considerations

| Aspect | Sri Lankan Context |
|--------|-------------------|
| Decimal Separator | Period (.) - international standard |
| Thousand Separator | Comma (,) - can use Indian system |
| Number System | Optional Indian lakhs/crores |
| Symbol Position | Before amount with space |
| Subunit Usage | Cents used but increasingly rare |

### Expected Outcome
- Complete currency configuration for LKR
- Proper symbol (₨) and formatting rules
- Helper function for currency formatting
- Support for various display scenarios
- Consistent formatting across application
- TypeScript types for type safety

### Verification Checklist
- [ ] Currency config section added to config.ts
- [ ] Currency code set to "LKR"
- [ ] Symbol set to "₨" (proper Unicode character)
- [ ] Decimal places set to 2
- [ ] Thousand separator configured
- [ ] Symbol position set to "before"
- [ ] Formatting rules defined for all scenarios
- [ ] Format helper function created
- [ ] TypeScript interfaces defined
- [ ] Test currency displays correctly in browser

---

## Task 35: Configure Locale Settings

### Overview
Configure comprehensive locale settings for Sri Lanka (en-LK), including language, timezone, date formats, time formats, number formats, phone number format, and other region-specific settings. These configurations ensure the storefront displays all information according to Sri Lankan conventions.

### Dependencies
- Task 32: Create Store Config File

### Instructions

1. **Create locale configuration section**
   - Add `localeConfig` to main store config
   - Define TypeScript interface for locale settings
   - Export as part of main config object

2. **Define basic locale properties**
   - Set `locale` to "en-LK"
   - Set `language` to "English"
   - Set `languageCode` to "en"
   - Set `countryCode` to "LK"
   - Set `direction` to "ltr" (left-to-right)

3. **Configure timezone settings**
   - Set `timezone` to "Asia/Colombo"
   - Set `timezoneOffset` to "+05:30"
   - Define daylight saving time rules (none for Sri Lanka)

4. **Define date format preferences**
   - Set `dateFormat` to "DD/MM/YYYY" (Sri Lankan standard)
   - Set `dateFormatShort` to "DD/MM/YY"
   - Set `dateFormatLong` to "DD MMMM YYYY"
   - Set `dateFormatFull` to "dddd, DD MMMM YYYY"

5. **Define time format preferences**
   - Set `timeFormat` to "HH:mm" (24-hour) or "hh:mm A" (12-hour)
   - Set `timeFormatShort` to "HH:mm"
   - Set `timeFormatLong` to "HH:mm:ss"
   - Set `dateTimeFormat` combining date and time

6. **Configure number formatting**
   - Set `numberFormat` locale to "en-LK"
   - Use period for decimal separator
   - Use comma for thousand separator
   - Optional: Support Indian numbering system

7. **Define phone number format**
   - Set `phonePrefix` to "+94"
   - Define phone number pattern: "0XX XXX XXXX"
   - Define mobile pattern: "07X XXX XXXX"
   - Define landline pattern: "0XX XXX XXXX"

8. **Add regional preferences**
   - First day of week: Monday or Sunday
   - Weekend days: Saturday and Sunday
   - Work week: Monday to Friday
   - Public holidays list (Sri Lankan calendar)

9. **Define measurement units**
   - Distance: Kilometers (km)
   - Weight: Kilograms (kg)
   - Temperature: Celsius (°C)
   - Area: Square meters (m²)

10. **Add address format**
    - Street address lines
    - City/Town
    - District (administrative division)
    - Province
    - Postal code (5 digits)

### Locale Configuration Structure

```
localeConfig
├── locale: "en-LK"
├── language: "English"
├── country: "Sri Lanka"
├── countryCode: "LK"
├── direction: "ltr"
├── timezone
│   ├── name: "Asia/Colombo"
│   ├── offset: "+05:30"
│   └── abbreviation: "IST"
├── dateFormats
│   ├── short: "DD/MM/YY"
│   ├── medium: "DD/MM/YYYY"
│   ├── long: "DD MMMM YYYY"
│   └── full: "dddd, DD MMMM YYYY"
├── timeFormats
│   ├── short: "HH:mm"
│   ├── medium: "HH:mm:ss"
│   └── full: "HH:mm:ss Z"
├── phone
│   ├── prefix: "+94"
│   ├── mobilePattern: "07X XXX XXXX"
│   └── landlinePattern: "0XX XXX XXXX"
├── address
│   ├── format: ["street", "city", "district", "province", "postalCode"]
│   └── postalCodePattern: "\d{5}"
└── units
    ├── distance: "km"
    ├── weight: "kg"
    └── temperature: "celsius"
```

### Sri Lankan Locale Specifications

| Property | Value | Description |
|----------|-------|-------------|
| Locale Code | en-LK | English (Sri Lanka) |
| Timezone | Asia/Colombo | UTC+05:30 |
| Date Format | DD/MM/YYYY | Day/Month/Year |
| Time Format | 12-hour or 24-hour | User preference |
| Phone Prefix | +94 | Country calling code |

### Date Format Examples

| Format Type | Pattern | Example | Usage |
|-------------|---------|---------|-------|
| Short | DD/MM/YY | 26/01/26 | Compact dates |
| Medium | DD/MM/YYYY | 26/01/2026 | Standard dates |
| Long | DD MMMM YYYY | 26 January 2026 | Formal dates |
| Full | dddd, DD MMMM YYYY | Sunday, 26 January 2026 | Very formal |
| ISO | YYYY-MM-DD | 2026-01-26 | API/Database |

### Time Format Examples

| Format | Pattern | Example | Context |
|--------|---------|---------|---------|
| 12-hour | hh:mm A | 02:30 PM | User display |
| 24-hour | HH:mm | 14:30 | System/Military |
| Short | HH:mm | 14:30 | Compact |
| Long | HH:mm:ss | 14:30:45 | With seconds |
| Full | HH:mm:ss Z | 14:30:45 +05:30 | With timezone |

### Phone Number Formats

| Type | Pattern | Example | Validation |
|------|---------|---------|------------|
| Mobile | 07X XXX XXXX | 077 123 4567 | Starts with 07 |
| Landline Colombo | 011 XXX XXXX | 011 234 5678 | Colombo code 011 |
| Landline Other | 0XX XXX XXXX | 031 222 3333 | Other area codes |
| International | +94 XX XXX XXXX | +94 77 123 4567 | With country code |
| Short Format | 0XXXXXXXXX | 0771234567 | No spaces |

### Address Format Structure

```
Sri Lankan Address Format:

Line 1: House/Building Number and Street
Line 2: Town/City
Line 3: District (optional)
Line 4: Province (optional)
Postal Code: 5 digits

Example:
123, Main Street
Colombo 03
Colombo District
Western Province
00300
```

### Address Components

| Component | Required | Format | Example |
|-----------|----------|--------|---------|
| Street | Yes | Free text | 123 Main Street |
| City/Town | Yes | Free text | Colombo |
| District | Optional | Predefined list | Colombo |
| Province | Optional | Predefined list | Western |
| Postal Code | Yes | 5 digits | 00300 |

### Week Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| First Day | Monday (1) | Start of week |
| Weekend | Sat-Sun (6-0) | Weekend days |
| Work Days | Mon-Fri | Business days |
| Week Numbering | ISO 8601 | Week number system |

### Measurement Units

| Quantity | Unit | Symbol | Usage |
|----------|------|--------|-------|
| Distance | Kilometer | km | Shipping distance |
| Weight | Kilogram | kg | Product weight |
| Temperature | Celsius | °C | Storage conditions |
| Volume | Liter | L | Liquid products |
| Area | Square Meter | m² | Property/Space |

### Helper Functions to Create

| Function | Purpose | Return Type |
|----------|---------|-------------|
| formatDate(date) | Format date per locale | string |
| formatTime(time) | Format time per locale | string |
| formatDateTime(dt) | Format date and time | string |
| formatPhoneNumber(phone) | Format phone with spaces | string |
| validatePhoneNumber(phone) | Check phone validity | boolean |
| formatAddress(address) | Format address object | string |

### Expected Outcome
- Complete locale configuration for Sri Lanka
- Date format set to DD/MM/YYYY
- Timezone set to Asia/Colombo (+05:30)
- Phone number format with +94 prefix
- Address format following Sri Lankan conventions
- Helper functions for formatting
- Full TypeScript support

### Verification Checklist
- [ ] Locale config section added to config.ts
- [ ] Locale set to "en-LK"
- [ ] Timezone set to "Asia/Colombo"
- [ ] Date format set to DD/MM/YYYY
- [ ] Time format configured (12 or 24-hour)
- [ ] Phone prefix set to "+94"
- [ ] Phone number patterns defined
- [ ] Address format structure created
- [ ] Measurement units configured
- [ ] Week configuration set (first day, weekend)
- [ ] Helper functions created
- [ ] TypeScript interfaces defined

---

## Task 36: Create Store Feature Flags

### Overview
Create a comprehensive feature flag system to toggle optional store features on/off without code changes. Feature flags enable gradual feature rollouts, A/B testing, and the ability to quickly enable or disable features in production. This system provides centralized control over store capabilities.

### Dependencies
- Task 32: Create Store Config File

### Instructions

1. **Create feature flags configuration section**
   - Add `featuresConfig` to main store config
   - Define TypeScript interface for feature flags
   - Group related features together

2. **Define customer-facing features**
   - Wishlist functionality (add products to wishlist)
   - Product comparison (compare multiple products)
   - Product reviews (customer reviews and ratings)
   - Product questions (Q&A on product pages)
   - Recently viewed products tracking

3. **Define checkout features**
   - Guest checkout (no account required)
   - Express checkout (one-click purchase)
   - Save payment methods
   - Save shipping addresses
   - Apply coupon codes

4. **Define account features**
   - User registration (allow new accounts)
   - Social login (OAuth providers)
   - Newsletter subscription
   - Email notifications
   - SMS notifications

5. **Define shopping features**
   - Advanced search
   - Search autocomplete
   - Product filters and sorting
   - Infinite scroll vs pagination
   - Quick view modal

6. **Define social features**
   - Social sharing buttons
   - Social media integration
   - Customer galleries
   - Product share rewards

7. **Define advanced features**
   - Progressive Web App (PWA)
   - Live chat support
   - Virtual assistant/chatbot
   - Analytics tracking
   - Maintenance mode

8. **Define payment features**
   - Multiple payment methods
   - Installment payments
   - Cash on delivery (COD)
   - Digital wallets
   - Bank transfers

9. **Define shipping features**
   - Multiple shipping methods
   - Real-time shipping rates
   - Store pickup option
   - International shipping
   - Shipping insurance

10. **Add feature dependencies**
    - Define which features depend on others
    - Create validation logic
    - Warn about conflicting features

### Feature Flags Structure

```
featuresConfig
├── customer
│   ├── wishlist: true
│   ├── compare: true
│   ├── reviews: true
│   ├── questions: true
│   └── recentlyViewed: true
├── checkout
│   ├── guestCheckout: true
│   ├── expressCheckout: false
│   ├── savedPayments: true
│   ├── savedAddresses: true
│   └── coupons: true
├── account
│   ├── registration: true
│   ├── socialLogin: true
│   ├── newsletter: true
│   ├── emailNotifications: true
│   └── smsNotifications: true
├── shopping
│   ├── advancedSearch: true
│   ├── autocomplete: true
│   ├── filters: true
│   ├── infiniteScroll: false
│   └── quickView: true
├── social
│   ├── sharing: true
│   ├── socialIntegration: true
│   ├── customerGalleries: false
│   └── shareRewards: false
├── advanced
│   ├── pwa: false
│   ├── liveChat: true
│   ├── chatbot: false
│   ├── analytics: true
│   └── maintenanceMode: false
├── payment
│   ├── multipleMethod: true
│   ├── installments: false
│   ├── cashOnDelivery: true
│   ├── digitalWallets: true
│   └── bankTransfer: true
└── shipping
    ├── multipleMethods: true
    ├── realTimeRates: false
    ├── storePickup: true
    ├── international: false
    └── insurance: false
```

### Feature Categories

| Category | Feature Count | Priority | Description |
|----------|---------------|----------|-------------|
| Customer | 5 | High | Customer experience features |
| Checkout | 5 | High | Checkout process features |
| Account | 5 | Medium | User account features |
| Shopping | 5 | High | Shopping experience features |
| Social | 4 | Low | Social interaction features |
| Advanced | 5 | Medium | Advanced capabilities |
| Payment | 5 | High | Payment options |
| Shipping | 5 | High | Shipping options |

### Essential Features (Must Have)

| Feature | Flag | Default | Reason |
|---------|------|---------|--------|
| Product Reviews | reviews | true | Builds trust |
| Guest Checkout | guestCheckout | true | Reduces friction |
| Email Notifications | emailNotifications | true | Order updates |
| Advanced Search | advancedSearch | true | Product discovery |
| Multiple Payments | multipleMethod | true | Customer preference |
| Cash on Delivery | cashOnDelivery | true | Popular in Sri Lanka |

### Optional Features (Nice to Have)

| Feature | Flag | Default | Reason |
|---------|------|---------|--------|
| Wishlist | wishlist | true | Shopping convenience |
| Product Comparison | compare | true | Decision making |
| Quick View | quickView | true | Better UX |
| Social Login | socialLogin | true | Convenience |
| Live Chat | liveChat | true | Customer support |
| Store Pickup | storePickup | true | Local option |

### Advanced Features (Future)

| Feature | Flag | Default | Reason |
|---------|------|---------|--------|
| Express Checkout | expressCheckout | false | Requires setup |
| Installments | installments | false | Requires integration |
| PWA | pwa | false | Complex implementation |
| Chatbot | chatbot | false | AI integration needed |
| Real-time Rates | realTimeRates | false | API integration |
| International Ship | international | false | Complex logistics |

### Feature Dependencies

```
Feature Dependencies:

wishlist → account.registration (must have accounts)
compare → shopping.advancedSearch (search needed)
expressCheckout → savedPayments + savedAddresses
socialIntegration → social.sharing
installments → payment.multipleMethod
realTimeRates → shipping.multipleMethods
```

### Feature Flag Helper Functions

| Function | Purpose | Return Type |
|----------|---------|-------------|
| isFeatureEnabled(feature) | Check if feature is on | boolean |
| getFeatureConfig(category) | Get category features | object |
| validateFeatures() | Check dependencies | boolean |
| toggleFeature(feature, value) | Runtime toggle (admin) | void |

### Feature Flag Usage Examples

```
Usage in Components:

// Check if wishlist is enabled
if (isFeatureEnabled('customer.wishlist')) {
  // Show wishlist button
}

// Check if guest checkout allowed
if (isFeatureEnabled('checkout.guestCheckout')) {
  // Show guest checkout option
}

// Get all shopping features
const shoppingFeatures = getFeatureConfig('shopping');
if (shoppingFeatures.quickView) {
  // Enable quick view modal
}
```

### Environment-Based Overrides

| Environment | Override Method | Priority |
|-------------|----------------|----------|
| Development | .env.local | Highest |
| Staging | Admin panel | High |
| Production | Admin panel | High |
| Default | config.ts | Lowest |

### Expected Outcome
- Comprehensive feature flag system
- Features organized by category
- Boolean flags for each feature
- Helper functions for feature checks
- Dependencies documented
- TypeScript types for type safety
- Easy to toggle features without deployment

### Verification Checklist
- [ ] Features config section added to config.ts
- [ ] All customer features defined
- [ ] All checkout features defined
- [ ] All account features defined
- [ ] All shopping features defined
- [ ] All social features defined
- [ ] All advanced features defined
- [ ] All payment features defined
- [ ] All shipping features defined
- [ ] Helper function `isFeatureEnabled` created
- [ ] Feature dependencies documented
- [ ] TypeScript interfaces defined
- [ ] Default values set appropriately

---

## Task 37: Create Store Routes Config

### Overview
Create a centralized routes configuration file that defines all store page paths, URLs, and routing patterns. This configuration serves as a single source of truth for navigation, ensuring consistent URL structure throughout the application and making route changes easy to manage.

### Dependencies
- Task 32: Create Store Config File

### Instructions

1. **Create routes.ts file**
   - Create new file `lib/store/routes.ts`
   - Define TypeScript interfaces for routes
   - Export routes configuration object

2. **Define home route**
   - Home page path: "/"
   - Include page title and meta information
   - Set as default landing page

3. **Define product routes**
   - Products listing: "/products"
   - Product detail: "/products/[slug]"
   - Products by category: "/categories/[slug]"
   - Products by brand: "/brands/[slug]"
   - Sale products: "/sale"
   - New arrivals: "/new-arrivals"

4. **Define shopping cart routes**
   - Cart page: "/cart"
   - Wishlist page: "/wishlist"
   - Compare page: "/compare"

5. **Define checkout routes**
   - Checkout start: "/checkout"
   - Checkout shipping: "/checkout/shipping"
   - Checkout payment: "/checkout/payment"
   - Checkout confirmation: "/checkout/confirmation"
   - Order success: "/order/success"
   - Order failed: "/order/failed"

6. **Define account routes**
   - Account dashboard: "/account"
   - Order history: "/account/orders"
   - Order detail: "/account/orders/[id]"
   - Profile: "/account/profile"
   - Addresses: "/account/addresses"
   - Wishlist: "/account/wishlist"
   - Payment methods: "/account/payment-methods"

7. **Define authentication routes**
   - Login: "/login"
   - Register: "/register"
   - Forgot password: "/forgot-password"
   - Reset password: "/reset-password/[token]"
   - Verify email: "/verify-email/[token]"

8. **Define content pages routes**
   - About us: "/about"
   - Contact us: "/contact"
   - FAQ: "/faq"
   - Blog: "/blog"
   - Blog post: "/blog/[slug]"

9. **Define legal pages routes**
   - Terms of service: "/terms"
   - Privacy policy: "/privacy"
   - Return policy: "/returns"
   - Shipping policy: "/shipping-policy"
   - Cookie policy: "/cookies"

10. **Define search and utility routes**
    - Search: "/search"
    - Search with query: "/search?q=[query]"
    - Track order: "/track-order"
    - Store locator: "/stores"
    - Sitemap: "/sitemap.xml"

11. **Create route helper functions**
    - Function to get route by name
    - Function to build dynamic routes
    - Function to generate breadcrumbs
    - Function to validate routes

### Routes Configuration Structure

```
routes
├── home: "/"
├── products
│   ├── list: "/products"
│   ├── detail: "/products/[slug]"
│   ├── category: "/categories/[slug]"
│   ├── brand: "/brands/[slug]"
│   ├── sale: "/sale"
│   └── newArrivals: "/new-arrivals"
├── cart
│   ├── view: "/cart"
│   ├── wishlist: "/wishlist"
│   └── compare: "/compare"
├── checkout
│   ├── start: "/checkout"
│   ├── shipping: "/checkout/shipping"
│   ├── payment: "/checkout/payment"
│   ├── confirmation: "/checkout/confirmation"
│   └── success: "/order/success"
├── account
│   ├── dashboard: "/account"
│   ├── orders: "/account/orders"
│   ├── orderDetail: "/account/orders/[id]"
│   ├── profile: "/account/profile"
│   └── addresses: "/account/addresses"
├── auth
│   ├── login: "/login"
│   ├── register: "/register"
│   ├── forgotPassword: "/forgot-password"
│   └── resetPassword: "/reset-password/[token]"
├── content
│   ├── about: "/about"
│   ├── contact: "/contact"
│   ├── faq: "/faq"
│   └── blog: "/blog"
└── legal
    ├── terms: "/terms"
    ├── privacy: "/privacy"
    ├── returns: "/returns"
    └── shipping: "/shipping-policy"
```

### Route Categories

| Category | Routes | Auth Required | Description |
|----------|--------|---------------|-------------|
| Public | Home, Products, Content | No | Accessible to all |
| Shopping | Cart, Checkout | No (guest allowed) | Shopping flow |
| Account | Orders, Profile, Addresses | Yes | User account |
| Auth | Login, Register | No | Authentication |
| Legal | Terms, Privacy | No | Legal pages |

### Product Routes Details

| Route | Pattern | Example URL | Description |
|-------|---------|-------------|-------------|
| All Products | /products | /products | Product listing |
| Product Detail | /products/[slug] | /products/laptop-15inch | Single product |
| Category | /categories/[slug] | /categories/electronics | Category listing |
| Subcategory | /categories/[slug]/[sub] | /categories/electronics/laptops | Subcategory |
| Brand | /brands/[slug] | /brands/apple | Brand listing |
| Sale | /sale | /sale | Discounted products |
| New Arrivals | /new-arrivals | /new-arrivals | Latest products |

### Checkout Flow Routes

```
Checkout Flow:

Step 1: Cart Review
└── /cart

Step 2: Checkout Start (Guest or Login)
└── /checkout

Step 3: Shipping Information
└── /checkout/shipping

Step 4: Payment Information
└── /checkout/payment

Step 5: Order Review
└── /checkout/confirmation

Step 6A: Success
└── /order/success?orderId=XXX

Step 6B: Failed
└── /order/failed?reason=XXX
```

### Account Section Routes

| Route | Path | Description | Auth |
|-------|------|-------------|------|
| Dashboard | /account | Account overview | Required |
| Orders | /account/orders | Order history | Required |
| Order Detail | /account/orders/[id] | Single order | Required |
| Profile | /account/profile | User profile | Required |
| Addresses | /account/addresses | Saved addresses | Required |
| Wishlist | /account/wishlist | Saved products | Required |
| Payment Methods | /account/payment-methods | Saved payments | Required |
| Notifications | /account/notifications | User notifications | Required |

### Route Helper Functions

| Function | Purpose | Parameters | Return |
|----------|---------|------------|--------|
| getRoute(name) | Get route path by name | name: string | string |
| buildProductRoute(slug) | Build product URL | slug: string | string |
| buildCategoryRoute(slug) | Build category URL | slug: string | string |
| buildOrderRoute(id) | Build order detail URL | id: string | string |
| getBreadcrumbs(path) | Generate breadcrumbs | path: string | array |

### Dynamic Route Building

```
Helper Function Examples:

// Get static route
getRoute('products.list') → "/products"

// Build dynamic route
buildProductRoute('laptop-15inch') → "/products/laptop-15inch"

// Build category route with subcategory
buildCategoryRoute('electronics', 'laptops') → "/categories/electronics/laptops"

// Build order detail route
buildOrderRoute('ORD-123456') → "/account/orders/ORD-123456"

// Generate breadcrumbs
getBreadcrumbs('/products/laptop-15inch')
→ [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptop 15inch', href: '/products/laptop-15inch' }
  ]
```

### Route Metadata

| Route | Page Title | Meta Description |
|-------|-----------|------------------|
| / | Home | Welcome to LankaCommerce |
| /products | Products | Browse our products |
| /cart | Shopping Cart | Your cart items |
| /checkout | Checkout | Complete your order |
| /account | My Account | Manage your account |

### URL Query Parameters

| Page | Parameter | Example | Purpose |
|------|-----------|---------|---------|
| Products | category | ?category=electronics | Filter by category |
| Products | sort | ?sort=price-asc | Sort products |
| Products | page | ?page=2 | Pagination |
| Search | q | ?q=laptop | Search query |
| Search | filter | ?filter=brand:apple | Apply filter |

### Expected Outcome
- Centralized routes configuration file
- All store routes defined with clear naming
- Route helper functions for dynamic URLs
- Breadcrumb generation support
- TypeScript types for route names
- Easy to update and maintain

### Verification Checklist
- [ ] `lib/store/routes.ts` file created
- [ ] Home route defined
- [ ] All product routes defined
- [ ] Cart and wishlist routes defined
- [ ] Checkout flow routes defined
- [ ] Account section routes defined
- [ ] Authentication routes defined
- [ ] Content and legal page routes defined
- [ ] Helper functions created
- [ ] TypeScript interfaces defined
- [ ] Dynamic route builders implemented
- [ ] Breadcrumb generator created

---

## Task 38: Create Store Navigation Config

### Overview
Create comprehensive navigation menu configuration defining the main menu structure, mega menus for categories, mobile navigation, and navigation behavior. This configuration drives the header navigation component and ensures consistent navigation throughout the store.

### Dependencies
- Task 37: Create Store Routes Config

### Instructions

1. **Create navigation.ts file**
   - Create new file `lib/store/navigation.ts`
   - Import routes from routes config
   - Define TypeScript interfaces for navigation items

2. **Define main navigation menu**
   - Home menu item
   - Products menu item (with dropdown)
   - Categories menu item (with mega menu)
   - Sale menu item
   - Contact menu item

3. **Create category mega menu structure**
   - Group categories hierarchically
   - Include subcategories
   - Add featured products section
   - Add promotional banners

4. **Define mobile navigation**
   - Simplified menu structure
   - Collapsible sections
   - Category drill-down
   - Account quick links

5. **Create utility navigation**
   - Search icon/link
   - Cart icon with badge
   - Wishlist icon with badge
   - Account dropdown
   - Language selector (if multi-language)

6. **Define account menu**
   - My Orders
   - My Profile
   - My Addresses
   - My Wishlist
   - Logout

7. **Create category navigation**
   - Main categories list
   - Include icon or image for each
   - Link to category pages
   - Show product counts (optional)

8. **Add navigation metadata**
   - Menu item labels
   - Icons for menu items
   - Badge configurations
   - Highlight/featured flags

9. **Define mega menu layout**
   - Column configuration
   - Category grouping
   - Image placement
   - Featured product slots

10. **Create navigation helper functions**
    - Function to get menu by location
    - Function to check if route is active
    - Function to build menu tree
    - Function to filter by permissions

### Navigation Configuration Structure

```
navigationConfig
├── mainMenu
│   ├── home
│   │   ├── label: "Home"
│   │   ├── href: "/"
│   │   └── icon: "home"
│   ├── products
│   │   ├── label: "Products"
│   │   ├── href: "/products"
│   │   ├── megaMenu: true
│   │   └── children: [...]
│   ├── categories
│   │   ├── label: "Categories"
│   │   ├── href: "/categories"
│   │   ├── megaMenu: true
│   │   └── children: [...]
│   ├── sale
│   │   ├── label: "Sale"
│   │   ├── href: "/sale"
│   │   ├── badge: "Hot"
│   │   └── highlight: true
│   └── contact
│       ├── label: "Contact"
│       └── href: "/contact"
├── utilityMenu
│   ├── search
│   ├── cart
│   ├── wishlist
│   └── account
├── accountMenu
│   ├── orders
│   ├── profile
│   ├── addresses
│   └── logout
├── categoryMenu
│   └── [list of categories]
└── mobileMenu
    └── [simplified structure]
```

### Main Navigation Items

| Item | Label | URL | Mega Menu | Badge | Description |
|------|-------|-----|-----------|-------|-------------|
| Home | Home | / | No | - | Homepage |
| Products | Products | /products | Yes | - | All products |
| Categories | Categories | /categories | Yes | - | Category browser |
| Sale | Sale | /sale | No | HOT | Sale items |
| New | New Arrivals | /new-arrivals | No | NEW | Latest products |
| Contact | Contact | /contact | No | - | Contact page |

### Mega Menu Structure (Categories)

```
Categories Mega Menu:

┌─────────────────────────────────────────────────────────┐
│  Column 1          Column 2          Column 3          │
│  ─────────         ─────────         ─────────         │
│  Electronics       Fashion           Home & Living     │
│  • Laptops         • Men's Wear      • Furniture       │
│  • Mobile          • Women's Wear    • Kitchen         │
│  • Cameras         • Kids' Wear      • Decor           │
│  • Accessories     • Footwear        • Bedding         │
│                                                         │
│  Column 4: Featured                                    │
│  ┌─────────────┐                                       │
│  │   Banner    │                                       │
│  │   Image     │                                       │
│  └─────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

### Category Menu Configuration

| Category | Icon | Subcategories | Product Count | Featured |
|----------|------|---------------|---------------|----------|
| Electronics | 💻 | 5 | 250+ | Yes |
| Fashion | 👕 | 4 | 500+ | Yes |
| Home & Living | 🏠 | 4 | 300+ | No |
| Sports | ⚽ | 3 | 150+ | No |
| Books | 📚 | 2 | 400+ | No |

### Mega Menu Layout Configuration

| Column | Width | Content Type | Items |
|--------|-------|--------------|-------|
| Column 1 | 25% | Categories | 4-6 items |
| Column 2 | 25% | Categories | 4-6 items |
| Column 3 | 25% | Categories | 4-6 items |
| Column 4 | 25% | Featured | 1 banner |

### Utility Navigation Items

| Item | Icon | Badge | Behavior | Description |
|------|------|-------|----------|-------------|
| Search | 🔍 | - | Open search modal | Search products |
| Cart | 🛒 | Item count | Open cart drawer | Shopping cart |
| Wishlist | ❤️ | Item count | Navigate to wishlist | Saved items |
| Account | 👤 | - | Open dropdown | User menu |

### Account Dropdown Menu

| Item | Label | URL | Icon | Auth Required |
|------|-------|-----|------|---------------|
| 1 | My Orders | /account/orders | 📦 | Yes |
| 2 | My Profile | /account/profile | 👤 | Yes |
| 3 | My Addresses | /account/addresses | 📍 | Yes |
| 4 | My Wishlist | /account/wishlist | ❤️ | Yes |
| 5 | Settings | /account/settings | ⚙️ | Yes |
| 6 | Logout | /logout | 🚪 | Yes |

### Mobile Navigation Structure

```
Mobile Menu:

├── Home
├── Products (Expandable)
│   ├── All Products
│   ├── New Arrivals
│   └── Sale
├── Categories (Expandable)
│   ├── Electronics (Expandable)
│   │   ├── Laptops
│   │   ├── Mobile
│   │   └── ...
│   ├── Fashion (Expandable)
│   └── ...
├── My Account (Expandable)
│   ├── Orders
│   ├── Profile
│   └── Logout
├── Contact
└── Language (if applicable)
```

### Mobile Navigation Behavior

| Aspect | Behavior |
|--------|----------|
| Trigger | Hamburger menu icon |
| Animation | Slide in from left |
| Overlay | Semi-transparent backdrop |
| Close | Backdrop click or close icon |
| Scroll | Menu scrollable |
| Nested | Drill-down pattern |

### Navigation Menu Item Interface

```
MenuItem Interface:

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: {
    text: string;
    variant: 'primary' | 'success' | 'warning';
  };
  children?: MenuItem[];
  megaMenu?: MegaMenuConfig;
  highlight?: boolean;
  external?: boolean;
  requiresAuth?: boolean;
}
```

### Badge Configuration

| Badge | Text | Color | Used On |
|-------|------|-------|---------|
| Hot | HOT | Red | Sale menu |
| New | NEW | Green | New arrivals |
| Sale | SALE | Orange | Discount items |
| Count | 5 | Blue | Cart, wishlist |

### Navigation Helper Functions

| Function | Purpose | Parameters | Return |
|----------|---------|------------|--------|
| getMainMenu() | Get main navigation | - | MenuItem[] |
| getUtilityMenu() | Get utility nav | - | MenuItem[] |
| getAccountMenu() | Get account dropdown | - | MenuItem[] |
| getCategoryMenu() | Get categories | - | MenuItem[] |
| getMobileMenu() | Get mobile nav | - | MenuItem[] |
| isActiveRoute(path) | Check if active | path: string | boolean |

### Navigation State Management

| State | Type | Description |
|-------|------|-------------|
| mobileMenuOpen | boolean | Mobile menu visibility |
| activeMenuItem | string | Currently active item |
| megaMenuOpen | string \| null | Open mega menu ID |
| cartItemCount | number | Items in cart |
| wishlistItemCount | number | Items in wishlist |

### Expected Outcome
- Complete navigation configuration file
- Main menu with mega menu support
- Category navigation structure
- Mobile navigation optimized for small screens
- Utility navigation (search, cart, account)
- Helper functions for navigation management
- Full TypeScript support

### Verification Checklist
- [ ] `lib/store/navigation.ts` file created
- [ ] Main menu items defined
- [ ] Mega menu structure created for categories
- [ ] Utility navigation items defined
- [ ] Account dropdown menu defined
- [ ] Mobile navigation structure created
- [ ] Navigation item interfaces defined
- [ ] Badge configuration added
- [ ] Helper functions implemented
- [ ] TypeScript interfaces for all menu types
- [ ] Routes imported from routes config

---

## Task 39: Create Store Footer Config

### Overview
Create comprehensive footer configuration defining footer sections, links, contact information, and footer layout. The footer provides important links, business information, and trust signals. This configuration drives the footer component across all store pages.

### Dependencies
- Task 37: Create Store Routes Config

### Instructions

1. **Create footer config section**
   - Add footer configuration to `lib/store/navigation.ts`
   - Or create separate `lib/store/footer.ts` file
   - Define TypeScript interfaces for footer structure

2. **Define footer layout structure**
   - Determine number of columns (typically 3-4)
   - Define column widths and responsive behavior
   - Plan bottom bar for copyright and trust badges

3. **Create "Shop" section**
   - All Products link
   - Categories link
   - New Arrivals link
   - Sale link
   - Gift Cards link (if applicable)

4. **Create "Customer Service" section**
   - Contact Us link
   - FAQ link
   - Shipping Information link
   - Returns & Refunds link
   - Track Order link
   - Size Guide link

5. **Create "My Account" section**
   - Login link
   - Register link
   - My Orders link
   - Wishlist link
   - Account Settings link

6. **Create "About Us" section**
   - About Us link
   - Our Story link
   - Careers link (if applicable)
   - Blog link
   - Press link (if applicable)

7. **Create "Legal" section**
   - Terms of Service link
   - Privacy Policy link
   - Cookie Policy link
   - Return Policy link
   - Shipping Policy link

8. **Add contact information block**
   - Business address (Sri Lankan format)
   - Phone numbers (landline and mobile)
   - Email addresses
   - Business hours

9. **Add newsletter subscription**
   - Newsletter signup form placeholder
   - Privacy notice
   - Subscribe button text

10. **Create bottom bar content**
    - Copyright text with dynamic year
    - Payment methods icons
    - Trust badges
    - Social media links (reference Task 40)

### Footer Configuration Structure

```
footerConfig
├── sections
│   ├── shop
│   │   ├── title: "Shop"
│   │   └── links: [...]
│   ├── service
│   │   ├── title: "Customer Service"
│   │   └── links: [...]
│   ├── account
│   │   ├── title: "My Account"
│   │   └── links: [...]
│   └── about
│       ├── title: "About Us"
│       └── links: [...]
├── contact
│   ├── address: {...}
│   ├── phone: [...]
│   ├── email: [...]
│   └── hours: {...}
├── newsletter
│   ├── title: "Subscribe to Newsletter"
│   ├── description: "..."
│   └── privacyText: "..."
├── bottomBar
│   ├── copyright: "..."
│   ├── paymentMethods: [...]
│   ├── trustBadges: [...]
│   └── socialLinks: [...]
└── layout
    ├── columns: 4
    ├── mobileCollapsible: true
    └── showContactBlock: true
```

### Footer Sections

| Section | Title | Link Count | Priority |
|---------|-------|------------|----------|
| Shop | Shop | 5-6 | High |
| Customer Service | Customer Service | 6-7 | High |
| My Account | My Account | 4-5 | Medium |
| About Us | About Us | 3-4 | Medium |
| Legal | Legal | 4-5 | Low |

### Shop Section Links

| Link Text | URL | Description |
|-----------|-----|-------------|
| All Products | /products | Product listing |
| Categories | /categories | Browse by category |
| New Arrivals | /new-arrivals | Latest products |
| Sale | /sale | Discounted items |
| Gift Cards | /gift-cards | Purchase gift cards |
| Track Order | /track-order | Order tracking |

### Customer Service Section Links

| Link Text | URL | Description |
|-----------|-----|-------------|
| Contact Us | /contact | Contact form |
| FAQ | /faq | Common questions |
| Shipping Info | /shipping-policy | Shipping details |
| Returns & Refunds | /returns | Return policy |
| Size Guide | /size-guide | Product sizing |
| Payment Methods | /payment-methods | Accepted payments |
| Track Order | /track-order | Order status |

### My Account Section Links

| Link Text | URL | Auth Required | Description |
|-----------|-----|---------------|-------------|
| Login | /login | No | Sign in |
| Register | /register | No | Create account |
| My Orders | /account/orders | Yes | Order history |
| Wishlist | /account/wishlist | Yes | Saved items |
| My Profile | /account/profile | Yes | Account settings |

### About Us Section Links

| Link Text | URL | Description |
|-----------|-----|-------------|
| About Us | /about | Company info |
| Our Story | /about#story | Brand story |
| Blog | /blog | Articles & news |
| Careers | /careers | Job openings |
| Contact | /contact | Get in touch |

### Legal Section Links

| Link Text | URL | Required | Description |
|-----------|-----|----------|-------------|
| Terms of Service | /terms | Yes | Usage terms |
| Privacy Policy | /privacy | Yes | Privacy info |
| Cookie Policy | /cookies | Yes | Cookie usage |
| Return Policy | /returns | Yes | Return terms |
| Shipping Policy | /shipping-policy | Yes | Shipping terms |

### Contact Information Block

```
Contact Information:

📍 Address:
   123 Main Street
   Colombo 03
   Western Province
   Sri Lanka 00300

📞 Phone:
   +94 11 234 5678 (Landline)
   +94 77 123 4567 (Mobile)

📧 Email:
   info@store.lcc.lk
   support@store.lcc.lk

🕐 Business Hours:
   Mon-Fri: 9:00 AM - 6:00 PM
   Saturday: 10:00 AM - 4:00 PM
   Sunday: Closed
   
   Timezone: Asia/Colombo (GMT+5:30)
```

### Contact Information Structure

| Field | Type | Example | Format |
|-------|------|---------|--------|
| Street | string | 123 Main Street | Free text |
| City | string | Colombo 03 | City with postal district |
| Province | string | Western Province | Province name |
| Postal Code | string | 00300 | 5 digits |
| Landline | string | +94 11 234 5678 | +94 XX XXX XXXX |
| Mobile | string | +94 77 123 4567 | +94 7X XXX XXXX |
| Email | string | info@store.lcc.lk | Valid email |

### Newsletter Subscription Block

| Element | Content | Purpose |
|---------|---------|---------|
| Title | "Stay Updated" | Section heading |
| Description | "Get exclusive offers..." | Value proposition |
| Input Placeholder | "Your email address" | Form field |
| Button Text | "Subscribe" | Submit button |
| Privacy Text | "We respect your privacy" | Trust message |

### Bottom Bar Components

```
Bottom Bar Layout:

┌─────────────────────────────────────────────────────────┐
│  © 2026 LankaCommerce | All rights reserved             │
│                                                          │
│  [Visa] [Mastercard] [PayHere] [COD]                   │
│                                                          │
│  [FB] [Instagram] [Twitter] [WhatsApp]                  │
└─────────────────────────────────────────────────────────┘
```

### Payment Methods Display

| Method | Icon | Display | Enabled |
|--------|------|---------|---------|
| Visa | visa-icon | Yes | Yes |
| Mastercard | mc-icon | Yes | Yes |
| PayHere | payhere-icon | Yes | Yes |
| Bank Transfer | bank-icon | Yes | Yes |
| Cash on Delivery | cod-icon | Yes | Yes |

### Trust Badges

| Badge | Type | Display | Purpose |
|-------|------|---------|---------|
| Secure Checkout | Icon + Text | Yes | Security assurance |
| Free Shipping | Icon + Text | Yes | Shipping benefit |
| Easy Returns | Icon + Text | Yes | Return policy |
| 24/7 Support | Icon + Text | Yes | Support availability |

### Footer Layout Responsive Design

| Screen Size | Columns | Behavior |
|-------------|---------|----------|
| Mobile | 1 | Stacked, collapsible |
| Tablet | 2 | 2x2 grid |
| Desktop | 4 | Side by side |
| Large | 4 + Contact | Extended layout |

### Footer Section Interface

```
FooterSection Interface:

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
  collapsible?: boolean;
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  requiresAuth?: boolean;
}
```

### Expected Outcome
- Complete footer configuration file
- Footer organized in logical sections
- Contact information properly formatted
- Newsletter subscription block defined
- Bottom bar with copyright and trust signals
- Full TypeScript support
- Responsive layout configuration

### Verification Checklist
- [ ] Footer config created in navigation.ts or footer.ts
- [ ] Shop section links defined
- [ ] Customer Service section links defined
- [ ] My Account section links defined
- [ ] About Us section links defined
- [ ] Legal section links defined
- [ ] Contact information block added
- [ ] Address in Sri Lankan format
- [ ] Phone numbers with +94 prefix
- [ ] Newsletter subscription block defined
- [ ] Bottom bar copyright text with dynamic year
- [ ] Payment methods list added
- [ ] Trust badges configured
- [ ] TypeScript interfaces defined
- [ ] Responsive layout configuration

---

## Task 40: Create Social Links Config

### Overview
Create social media links configuration for all social platforms where the store has a presence. These links will be used in the footer, header, product sharing buttons, and other components throughout the store. Configuration includes platform details, profile URLs, and display preferences.

### Dependencies
- Task 39: Create Store Footer Config

### Instructions

1. **Create social links config section**
   - Add to footer config or create dedicated section
   - Define TypeScript interface for social links
   - Import in main config file

2. **Define Facebook profile**
   - Platform name: "Facebook"
   - Profile URL: facebook.com/lankacommerce
   - Icon identifier
   - Display priority: High
   - Show in footer: Yes

3. **Define Instagram profile**
   - Platform name: "Instagram"
   - Profile URL: instagram.com/lankacommerce
   - Icon identifier
   - Display priority: High
   - Show in footer: Yes

4. **Define Twitter/X profile**
   - Platform name: "Twitter" or "X"
   - Profile URL: twitter.com/lankacommerce
   - Icon identifier
   - Display priority: Medium
   - Show in footer: Yes

5. **Define WhatsApp business**
   - Platform name: "WhatsApp"
   - Number: +94 77 XXX XXXX
   - Link format: wa.me/94XXXXXXXXX
   - Display priority: High (popular in Sri Lanka)
   - Show in footer: Yes

6. **Define YouTube channel (optional)**
   - Platform name: "YouTube"
   - Channel URL: youtube.com/@lankacommerce
   - Icon identifier
   - Display priority: Medium
   - Show in footer: Optional

7. **Define LinkedIn profile (optional)**
   - Platform name: "LinkedIn"
   - Profile URL: linkedin.com/company/lankacommerce
   - Icon identifier
   - Display priority: Low
   - Show in footer: Optional

8. **Define TikTok profile (optional)**
   - Platform name: "TikTok"
   - Profile URL: tiktok.com/@lankacommerce
   - Icon identifier
   - Display priority: Medium
   - Show in footer: Optional

9. **Add social sharing options**
   - Platforms available for product sharing
   - Sharing URLs with dynamic parameters
   - Tracking parameters for analytics

10. **Create social link helper functions**
    - Function to get all active social links
    - Function to get footer social links
    - Function to generate share URLs
    - Function to get platform icon

### Social Links Configuration Structure

```
socialLinksConfig
├── facebook
│   ├── name: "Facebook"
│   ├── url: "https://facebook.com/lankacommerce"
│   ├── icon: "facebook"
│   ├── color: "#1877F2"
│   ├── priority: 1
│   ├── showInFooter: true
│   └── showInShare: true
├── instagram
│   ├── name: "Instagram"
│   ├── url: "https://instagram.com/lankacommerce"
│   ├── icon: "instagram"
│   ├── color: "#E4405F"
│   ├── priority: 2
│   ├── showInFooter: true
│   └── showInShare: true
├── twitter
│   ├── name: "Twitter"
│   ├── url: "https://twitter.com/lankacommerce"
│   ├── icon: "twitter"
│   ├── color: "#1DA1F2"
│   ├── priority: 3
│   ├── showInFooter: true
│   └── showInShare: true
├── whatsapp
│   ├── name: "WhatsApp"
│   ├── url: "https://wa.me/94XXXXXXXXX"
│   ├── icon: "whatsapp"
│   ├── color: "#25D366"
│   ├── priority: 1
│   ├── showInFooter: true
│   └── showInShare: true
├── youtube
│   ├── name: "YouTube"
│   ├── url: "https://youtube.com/@lankacommerce"
│   ├── icon: "youtube"
│   ├── color: "#FF0000"
│   ├── priority: 4
│   └── showInFooter: true
└── sharing
    ├── enabled: true
    ├── platforms: ["facebook", "twitter", "whatsapp", "instagram"]
    └── trackClicks: true
```

### Social Media Platforms

| Platform | Priority | Popular in SL | Footer | Share | Icon |
|----------|----------|---------------|--------|-------|------|
| Facebook | High | Yes | Yes | Yes | facebook |
| Instagram | High | Yes | Yes | Yes | instagram |
| WhatsApp | High | Yes | Yes | Yes | whatsapp |
| Twitter/X | Medium | Moderate | Yes | Yes | twitter |
| YouTube | Medium | Yes | Yes | No | youtube |
| LinkedIn | Low | Moderate | Optional | No | linkedin |
| TikTok | Medium | Growing | Optional | Yes | tiktok |

### Platform Details

| Platform | Full URL Example | Handle Format | Verification |
|----------|-----------------|---------------|--------------|
| Facebook | facebook.com/lankacommerce | @lankacommerce | Check availability |
| Instagram | instagram.com/lankacommerce | @lankacommerce | Check availability |
| Twitter | twitter.com/lankacommerce | @lankacommerce | Check availability |
| WhatsApp | wa.me/94771234567 | +94 77 123 4567 | Business account |
| YouTube | youtube.com/@lankacommerce | @lankacommerce | Channel needed |
| LinkedIn | linkedin.com/company/lankacommerce | /company/ | Company page |
| TikTok | tiktok.com/@lankacommerce | @lankacommerce | Check availability |

### WhatsApp Link Format

```
WhatsApp Business Link:

Format: https://wa.me/<country_code><number>

Sri Lanka Example:
├── Phone Number: 077 123 4567
├── International: +94 77 123 4567
├── WhatsApp Format: 94771234567
└── Full URL: https://wa.me/94771234567

With Pre-filled Message:
└── https://wa.me/94771234567?text=Hello%20LankaCommerce
```

### Social Sharing URLs

| Platform | Share URL Pattern | Parameters |
|----------|------------------|------------|
| Facebook | facebook.com/sharer/sharer.php | ?u={url} |
| Twitter | twitter.com/intent/tweet | ?url={url}&text={text} |
| WhatsApp | wa.me/ | ?text={text}%20{url} |
| LinkedIn | linkedin.com/sharing/share-offsite | ?url={url} |
| Pinterest | pinterest.com/pin/create/button | ?url={url}&media={img} |

### Social Link Interface

```
SocialLink Interface:

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  priority: number;
  showInFooter: boolean;
  showInShare?: boolean;
  ariaLabel?: string;
}
```

### Display Locations

| Location | Platforms | Layout | Behavior |
|----------|-----------|--------|----------|
| Footer | All active | Horizontal row | Open in new tab |
| Product Page | Share enabled | Share buttons | Share modal |
| Contact Page | All active | Vertical list | Contact links |
| Header | None/Selected | Icon only | Mobile only |
| Mobile Menu | All active | List with labels | Side menu |

### Social Media Display Order

```
Footer Display Order (Left to Right):

Priority 1 (Essential):
├── Facebook
├── WhatsApp
└── Instagram

Priority 2 (Important):
├── Twitter
└── YouTube

Priority 3 (Optional):
├── TikTok
└── LinkedIn
```

### Brand Colors Reference

| Platform | Primary Color | Hex Code | Usage |
|----------|---------------|----------|-------|
| Facebook | Blue | #1877F2 | Icon background |
| Instagram | Gradient | #E4405F | Icon background |
| Twitter | Blue | #1DA1F2 | Icon background |
| WhatsApp | Green | #25D366 | Icon background |
| YouTube | Red | #FF0000 | Icon background |
| LinkedIn | Blue | #0A66C2 | Icon background |
| TikTok | Black/Pink | #000000/#FE2C55 | Icon background |

### Helper Functions

| Function | Purpose | Parameters | Return |
|----------|---------|------------|--------|
| getActiveSocialLinks() | Get enabled links | - | SocialLink[] |
| getFooterSocialLinks() | Get footer links | - | SocialLink[] |
| getShareLinks() | Get sharing links | - | SocialLink[] |
| generateShareUrl(platform, url, text) | Create share URL | platform, url, text | string |
| getSocialIcon(platform) | Get icon component | platform | IconComponent |

### Share URL Generation Example

```
Generate Share URLs:

// Facebook Share
generateShareUrl('facebook', productUrl)
→ "https://facebook.com/sharer/sharer.php?u=https://store.lcc.lk/products/laptop"

// Twitter Share
generateShareUrl('twitter', productUrl, 'Check out this laptop!')
→ "https://twitter.com/intent/tweet?url=...&text=Check%20out..."

// WhatsApp Share
generateShareUrl('whatsapp', productUrl, 'Check this product')
→ "https://wa.me/?text=Check%20this%20product%20https://..."
```

### Accessibility Considerations

| Aspect | Implementation |
|--------|----------------|
| aria-label | Descriptive labels (e.g., "Visit us on Facebook") |
| title | Tooltip text for each link |
| rel | Use "noopener noreferrer" for external links |
| target | Open in new tab (_blank) |
| Icon + Text | Show text on hover or mobile |

### Expected Outcome
- Complete social media links configuration
- All active platforms properly configured
- WhatsApp business number in correct format
- Share URLs configured for product sharing
- Helper functions for link generation
- Full TypeScript support
- Consistent display across all locations

### Verification Checklist
- [ ] Social links config section created
- [ ] Facebook profile URL added
- [ ] Instagram profile URL added
- [ ] Twitter profile URL added
- [ ] WhatsApp business number added in correct format
- [ ] YouTube channel URL added (if applicable)
- [ ] LinkedIn profile URL added (optional)
- [ ] TikTok profile URL added (optional)
- [ ] Display priorities set
- [ ] Platform colors configured
- [ ] Share URLs configured
- [ ] Helper functions created
- [ ] TypeScript interfaces defined
- [ ] All URLs tested and verified
- [ ] Icons references correct

---

## Summary

This document established comprehensive store configuration covering environment setup, metadata, localization, feature management, and navigation structure. The configuration provides a solid foundation for the LankaCommerce storefront with proper Sri Lankan localization.

### Completed Tasks
1. ✓ Created store environment variables with NEXT_PUBLIC_ prefix
2. ✓ Created main store config file with TypeScript interfaces
3. ✓ Defined store metadata (name, tagline, business info)
4. ✓ Configured currency settings for LKR (₨) with formatting rules
5. ✓ Configured locale settings for en-LK with Asia/Colombo timezone
6. ✓ Created comprehensive feature flags system
7. ✓ Created store routes configuration with all pages
8. ✓ Created navigation menu config with mega menus
9. ✓ Created footer configuration with all sections
10. ✓ Created social media links configuration

### Key Configurations Established

| Configuration | File Location | Purpose |
|--------------|---------------|---------|
| Environment | .env.local | Environment variables |
| Main Config | lib/store/config.ts | Central configuration |
| Routes | lib/store/routes.ts | URL structure |
| Navigation | lib/store/navigation.ts | Menu structure |
| Footer | lib/store/navigation.ts or footer.ts | Footer content |

### Sri Lankan Localizations Applied

| Aspect | Configuration |
|--------|--------------|
| Currency | LKR (₨) with proper formatting |
| Locale | en-LK (English Sri Lanka) |
| Timezone | Asia/Colombo (UTC+5:30) |
| Phone Format | +94 XX XXX XXXX |
| Date Format | DD/MM/YYYY |
| Address Format | Sri Lankan postal system |

### Next Steps
Proceed to [02_Tasks-41-46_Business-SEO-Verify.md](02_Tasks-41-46_Business-SEO-Verify.md) to create business configuration (contact info, shipping, payment methods), SEO defaults, image optimization config, and verification procedures.

---

**Document Status:** Complete  
**Last Updated:** January 26, 2026  
**Total Tasks:** 10 (Tasks 31-40)  
**Estimated Total Time:** 3.5 hours
