# LCC — Integrations & AI Features

## Payment Gateways (Phase 09)
| Gateway | Type | Notes |
|---------|------|-------|
| PayHere | Card/Internet Banking (Sri Lanka) | Most popular local gateway |
| WebXPay | Card/Internet Banking (Sri Lanka) | Alternative |
| KOKO | BNPL — Buy Now Pay Later | Split 3× payments |
| MintPay | BNPL | Alternative BNPL |
| LOLC iPay | Bank transfer | LOLC bank integration |
| Payzy | Digital wallet | |
| Bank Transfer Upload | Manual | Customer uploads slip; admin verifies |
| Cash on Delivery | Manual | +₨100 handling fee; zone-restricted |

## Payment UI Components
- Payment Method Cards (radio selection, with logos)
- KOKO/MintPay BNPL Widget: "Pay in 3 installments — 0% interest"
- Bank Transfer: Upload slip drag-and-drop; "Awaiting verification" status
- COD: Shows restrictions if not available in zone

## Courier Integrations (Phase 09)
| Courier | API Integration |
|---------|----------------|
| Koombiyo | Full API: waybill, tracking, pickup, COD reconciliation |
| Domex | Full API: waybill, tracking, webhooks |
| PromptX | Full API: waybill, tracking |
| Royal Express | API |
| TranceExpress | API |

## Waybill/Shipping UI
- Waybill number display on order detail
- [Generate Waybill] button → auto-creates with courier API
- [Download PDF] waybill label button
- Tracking timeline on order tracking page
- Courier comparison widget (Enterprise): rates/ETA for all couriers

## WhatsApp Business API (Phase 09)
- Configuration: phone_number_id, access_token, opt-in settings
- Template messages: order confirmation, shipping notification, payment reminder
- Notification triggers: webstore order placed, order shipped, payment received
- Customer portal opt-in toggle

## SMS Gateway (Phase 09)
- Providers: Dialog, Notify.lk, TextIt
- OTP system for: checkout, login, sensitive actions
- Notifications: order confirmations, delivery updates
- Fallback chain: primary → secondary provider

## AI Features (Phase 10)

### Product Recommendations
- Frequently Bought Together (Apriori/association rules)
- Similar Products (content-based, embeddings)
- Personalized For You (collaborative filtering — logged-in users)
- Trending Now (time-decay popularity)
- → UI: 4 widget types on PDP and cart page

### Demand Forecasting (ERP)
- Festival-aware: Avurudu (April), Vesak (May), Christmas, Black Friday
- 30-day forecast bar chart per product
- Alert: "Expected demand X units. Reorder Y by [date]."
- Action: [Create Purchase Order] from widget

### Smart Search
- Engine: Meilisearch
- Sinhala-glish fuzzy: `saree`/`sari`/`sariya` → same
- Typo tolerance: `nikey` → Nike
- Autocomplete dropdown with result counts
- "Did you mean?" suggestions

### AI Chatbot (Webstore)
- Floating icon (alongside WhatsApp widget)
- GPT-4 + RAG: product catalog + order DB + FAQ
- Handles: order tracking, product search, availability, returns, escalation to human

### Business Intelligence (Future)
- Business Health Score (0–100)
- Pre-approved credit line display
- Cash flow prediction

### Offline Sync (Advanced — Phase 09/10)
- Service Worker + IndexedDB
- POS offline queue
- Conflict resolution: first-to-sync wins OR admin review flag
- Sync status indicator in POS header

## Settings → Integrations Hub
```
INTEGRATIONS

[💳 Payment Gateways]
  [PayHere] [Enabled ●] [Configure] [Test]
  [WebXPay] [Disabled ○] [Configure] [Test]
  [KOKO BNPL] [Enabled ●] [Configure] [Test]
  [Bank Transfer] [Enabled ●] [Configure] [Verify Rules]
  [Cash on Delivery] [Enabled ●] [Configure] [Zone Rules]

[🚚 Couriers]
  [Koombiyo] [Enabled ●] [Configure] [Test API]
  [Domex] [Disabled ○] [Configure]
  [PromptX] [Disabled ○] [Configure]

[💬 Communications]
  [WhatsApp Business API] [Enabled ●] [Configure] [Test Send]
  [SMS Gateway] [Dialog ●] [Configure] [Fallback Setup]

[🤖 AI Features] (Enterprise)
  [Recommendations] [Enabled ●] [Settings]
  [Smart Search] [Enabled ●] [Settings]
  [Demand Forecasting] [Enabled ●] [Settings]
  [AI Chatbot] [Disabled ○] [Configure]
```
