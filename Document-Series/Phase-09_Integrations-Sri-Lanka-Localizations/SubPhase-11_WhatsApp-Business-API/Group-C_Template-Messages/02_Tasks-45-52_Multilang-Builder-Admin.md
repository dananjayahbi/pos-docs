# Tasks 45-52: Multilingual Templates, Builder, and Admin

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** C - Template Messages  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-44_Model-Templates.md](01_Tasks-33-44_Model-Templates.md)
- **→ Next Document:** [../../Group-D_Notification-Service/01_Tasks-53-62_Service-Methods.md](../../Group-D_Notification-Service/01_Tasks-53-62_Service-Methods.md)

---

## Document Overview

This document covers the completion of the template message system with multilingual support for Sri Lankan languages (Sinhala and Tamil), implementation of the template builder for constructing WhatsApp API payloads, parameter substitution logic, template validation, and Django admin interface for template management. These components enable the system to send localized notifications in customers' preferred languages and provide tools for managing and testing templates.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create COD Reminder Template | Medium | 30 min |
| 46 | Create Sinhala Templates | High | 90 min |
| 47 | Create Tamil Templates | High | 90 min |
| 48 | Create Template Builder | Medium | 60 min |
| 49 | Create Param Substitution | Medium | 45 min |
| 50 | Create Template Validator | Medium | 45 min |
| 51 | Create Template Admin Interface | Medium | 45 min |
| 52 | Verify Templates | Low | 30 min |

---

## Task 45: Create COD Reminder Template

### Overview

Create the COD (Cash on Delivery) Reminder template sent a few hours before delivery to remind customers to prepare cash payment. This template is critical for COD orders as it reduces delivery failures due to customers not having cash ready. It includes the exact amount to prepare, confirms the delivery time, provides the delivery agent's contact, and may include denominations guidance to ensure smooth payment collection.

### Dependencies

- Task 44: Delivered template created
- All English templates complete
- MessageTemplate model fully functional

### Instructions

1. **Define template identification**
   - Set template_name to "cod_reminder"
   - Set language to "en" (English version)
   - Set template_type to "COD_REMINDER"
   - Set category to "TRANSACTIONAL"

2. **Define header parameters**
   - Set header_params to ["order_number", "amount"]
   - Shows order reference and payment amount upfront
   - Critical information in header for quick reference

3. **Define body parameters**
   - Set body_params array with 5 parameters:
     - "customer_name" - Customer's first name
     - "order_number" - Order reference
     - "cod_amount" - Exact cash amount needed
     - "delivery_time" - Expected delivery time window
     - "delivery_instructions" - Special payment instructions

4. **Write reminder content**
   - Politely remind about cash requirement
   - State exact amount clearly
   - Mention delivery time
   - Suggest bill denominations if helpful
   - Provide agent contact option

5. **Design header**
   - Format: "Order #{order_number} - ₨{amount} Cash Needed"
   - Clear amount specification
   - Professional reminder tone

6. **Structure body with payment focus**
   - Friendly reminder about COD
   - Exact amount prominently displayed
   - Delivery time window mentioned
   - Denominations suggestion (optional)
   - Agent will call before delivery note

7. **Add helpful payment guidance**
   - Mention exact change preferred but not required
   - Note that agent can provide change
   - Suggest having bills ready (not just coins)
   - Reassure about payment process

8. **Configure sending timing**
   - Document when reminder should be sent
   - Typically 2-4 hours before delivery
   - Not too early (customer may forget)
   - Not too late (no time to arrange cash)

### COD Reminder Template Structure

```
┌─────────────────────────────────────────────────────┐
│          COD Reminder Template                       │
└─────────────────────────────────────────────────────┘

Template Name: cod_reminder
Language: en
Type: COD_REMINDER
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Order #{order_number} - ₨{amount} Cash Needed 💵   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Hi {customer_name}! 👋                              │
│                                                      │
│ Quick reminder: Your order #{order_number} is       │
│ arriving soon as Cash on Delivery.                  │
│                                                      │
│ Payment Details:                                     │
│ • Amount needed: ₨{cod_amount}                      │
│ • Delivery time: {delivery_time}                    │
│                                                      │
│ {delivery_instructions}                             │
│                                                      │
│ Our delivery agent will call you shortly before     │
│ arrival. Exact change is appreciated but not        │
│ required - the agent can provide change.            │
│                                                      │
│ Thank you! 🙏                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ Questions? Reply to this message                    │
└─────────────────────────────────────────────────────┘
```

### COD Payment Context in Sri Lanka

```
┌────────────────────────────────────────────────────┐
│        Sri Lankan COD Landscape                     │
└────────────────────────────────────────────────────┘

COD Popularity:
├─> 60-70% of online orders
├─> Preferred by customers without cards
├─> Trust issue with online payments
└─> Common in tier 2/3 cities

Cash Denominations:
├─> Notes: ₨20, ₨50, ₨100, ₨500, ₨1000, ₨5000
├─> Preferred: ₨100, ₨500, ₨1000
└─> Avoid: Large ₨5000 notes (change issues)

Common COD Amounts:
├─> ₨500 - ₨2,000 (small orders)
├─> ₨2,000 - ₨5,000 (medium orders)
└─> ₨5,000 - ₨15,000 (large orders)

Payment Challenges:
├─> Customer doesn't have cash ready
├─> Agent doesn't have change
├─> Customer not home when agent arrives
└─> Amount dispute
```

### Reminder Timing Strategy

```
┌────────────────────────────────────────────────────┐
│        COD Reminder Scheduling                      │
└────────────────────────────────────────────────────┘

Timeline:
┌──────────────────────────────────────────────────┐
│                                                  │
│  8:00 AM: Agent starts route                    │
│           (Out for Delivery notification)       │
│                                                  │
│  8:30 AM: ► COD Reminder sent                   │
│           (2-3 hours before delivery)           │
│                                                  │
│  10:30 AM: Agent calls customer                 │
│            (30 min before arrival)              │
│                                                  │
│  11:00 AM: Delivery attempt                     │
│            (Customer has cash ready)            │
│                                                  │
└──────────────────────────────────────────────────┘

Optimal Timing:
├─> 2-4 hours before delivery window
├─> After "Out for Delivery" notification
├─> Early enough for customer to arrange cash
└─> Not too early (customer might forget)

Different Scenarios:
┌────────────────────────────────────────────────┐
│ Morning Delivery (9 AM - 1 PM)                 │
│ └─> Send reminder: 7:00 AM - 8:00 AM          │
│                                                │
│ Afternoon Delivery (1 PM - 5 PM)              │
│ └─> Send reminder: 11:00 AM - 12:00 PM        │
│                                                │
│ Evening Delivery (5 PM - 8 PM)                │
│ └─> Send reminder: 3:00 PM - 4:00 PM          │
└────────────────────────────────────────────────┘
```

### Parameter Specifications

| Parameter | Format | Example | Notes |
|-----------|--------|---------|-------|
| customer_name | First name | Kasun, Nimal | Friendly personalization |
| order_number | #XXXXX | #12345 | With # prefix |
| cod_amount | ₨X,XXX.XX | ₨5,250.00 | Exact amount, formatted |
| delivery_time | Time window | 10:00 AM - 12:00 PM | 2-3 hour window |
| delivery_instructions | Custom text | "Please have ₨100 and ₨500 notes if possible" | Optional guidance |

### Delivery Instructions Examples

```
┌────────────────────────────────────────────────────┐
│        Common Delivery Instructions                 │
└────────────────────────────────────────────────────┘

Standard:
└─> "Please have cash ready for quick payment."

Exact Amount:
└─> "Exact amount (₨5,250) preferred if possible."

Small Bills:
└─> "Please have ₨100 or ₨500 notes if available."

Large Amount:
└─> "Large amount - please ensure sufficient cash."

No Large Notes:
└─> "Agent may have limited change for ₨5000 notes."

Special Case:
└─> "Part payment also accepted if short on cash."
```

### COD Success Factors

```
┌────────────────────────────────────────────────────┐
│        Improving COD Success Rate                   │
└────────────────────────────────────────────────────┘

Reminder Effectiveness:
├─> With reminder: 92% success rate
├─> Without reminder: 78% success rate
└─> Improvement: +14% successful deliveries

Customer Benefits:
├─> Time to arrange cash
├─> Clear amount specification
├─> Reduces awkwardness at door
└─> Professional experience

Business Benefits:
├─> Fewer failed deliveries
├─> Lower return-to-warehouse costs
├─> Faster delivery completion
└─> Better customer satisfaction

Agent Benefits:
├─> Customer prepared
├─> Faster handoff
├─> Less change needed
└─> More deliveries per day
```

### Example Message

```
┌────────────────────────────────────────────────────┐
│  Customer Receives (Example)                       │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 8:30 AM (2.5 hours before delivery)

Order #12345 - ₨5,250 Cash Needed 💵

Hi Kasun! 👋

Quick reminder: Your order #12345 is arriving soon 
as Cash on Delivery.

Payment Details:
• Amount needed: ₨5,250.00
• Delivery time: 10:00 AM - 12:00 PM

Please have ₨100 or ₨500 notes if possible.

Our delivery agent will call you shortly before 
arrival. Exact change is appreciated but not 
required - the agent can provide change.

Thank you! 🙏

─────────────────────────────────────────────
LankaCommerce Cloud
Questions? Reply to this message
```

### Expected Outcome

- COD Reminder template created in English
- Template sent 2-4 hours before delivery
- Exact cash amount specified clearly
- Delivery time window included
- Payment instructions provided
- Reduces failed COD deliveries

### Verification Checklist

- [ ] Template name set to "cod_reminder"
- [ ] Language set to "en"
- [ ] template_type set to "COD_REMINDER"
- [ ] header_params contains ["order_number", "amount"]
- [ ] body_params contains all 5 parameters
- [ ] Exact cash amount prominently displayed
- [ ] Delivery time window specified
- [ ] Denominations guidance included
- [ ] Agent will call mentioned
- [ ] Change availability reassurance provided
- [ ] Tone is polite reminder (not demanding)
- [ ] Scheduling guidance documented

---

## Task 46: Create Sinhala Templates

### Overview

Create Sinhala (සිංහල) language versions of all seven order lifecycle templates created in Tasks 39-45. Sinhala is spoken by approximately 75% of Sri Lanka's population and is essential for reaching the majority of customers. The translations must be culturally appropriate, use proper Sinhala script (Unicode), maintain professional tone, and preserve parameter placeholders correctly. This task significantly improves customer experience for Sinhala-speaking users.

### Dependencies

- Task 45: COD Reminder template (all English templates complete)
- Sinhala translation capabilities available
- Unicode support for Sinhala script configured

### Instructions

1. **Prepare for Sinhala translation**
   - Ensure database supports Sinhala Unicode characters
   - Verify frontend can display Sinhala properly
   - Test WhatsApp Business API supports Sinhala
   - Confirm all systems handle UTF-8

2. **Create translation strategy**
   - Hire professional Sinhala translator
   - Avoid machine translation for business content
   - Ensure cultural appropriateness
   - Maintain consistent terminology across templates

3. **Translate all seven templates**
   - Order Confirmation → ඇණවුම තහවුරු කිරීම
   - Payment Success → ගෙවීම සාර්ථකයි
   - Payment Failed → ගෙවීම අසාර්ථකයි
   - Shipped → ඇණවුම යවන ලදී
   - Out for Delivery → බෙදා හැරීමට පිටත්ව යයි
   - Delivered → බෙදා හැරීම සම්පූර්ණයි
   - COD Reminder → මුදල් ගෙවීමේ සිහිකැඳවුම

4. **Maintain parameter consistency**
   - Keep parameter names in English in code
   - Translate surrounding text to Sinhala
   - Preserve parameter order and structure
   - Ensure placeholders remain functional

5. **Apply Sinhala formatting conventions**
   - Use proper Sinhala punctuation
   - Apply appropriate spacing rules
   - Use Sinhala numerals where culturally expected
   - Or use Western numerals (more common for amounts)

6. **Adapt cultural elements**
   - Use appropriate greetings (ආයුබෝවන්, ස්තූතියි)
   - Adjust formality level for Sri Lankan context
   - Use familiar terms for business concepts
   - Maintain respectful tone

7. **Set language codes**
   - Set language field to "si" for all Sinhala templates
   - Keep template_name identical to English versions
   - Set same template_type values
   - Ensure proper language linking

8. **Test Sinhala rendering**
   - Verify Sinhala displays correctly on mobile
   - Check font rendering in WhatsApp
   - Test parameter substitution with Sinhala
   - Ensure no character encoding issues

9. **Create for each template type**
   - Create order_confirmation (si)
   - Create payment_success (si)
   - Create payment_failed (si)
   - Create order_shipped (si)
   - Create out_for_delivery (si)
   - Create order_delivered (si)
   - Create cod_reminder (si)

10. **Document Sinhala-specific considerations**
    - Note any translation challenges
    - Document terminology choices
    - Explain cultural adaptations
    - Provide pronunciation guide if needed

### Sinhala Language Context

```
┌────────────────────────────────────────────────────┐
│        Sinhala in Sri Lankan Context                │
└────────────────────────────────────────────────────┘

Language Facts:
├─> Speakers: ~17 million (75% of Sri Lanka)
├─> Script: Sinhala (සිංහල අක්ෂර)
├─> Official: Official language of Sri Lanka
└─> Unicode: U+0D80 to U+0DFF

Business Usage:
├─> Primary: Government, education, media
├─> Common: Local businesses, informal settings
├─> Growing: E-commerce, mobile apps
└─> Preferred: Older demographic, rural areas

Digital Presence:
├─> Unicode support: Widespread
├─> Mobile keyboards: Native Sinhala keyboards
├─> Font rendering: Good support on modern devices
└─> WhatsApp: Full Sinhala support

Challenges:
├─> Professional translation needed
├─> Technical terms may need adaptation
├─> Some concepts lack direct equivalents
└─> Formality levels matter
```

### Sinhala Template Examples

```
┌─────────────────────────────────────────────────────┐
│          Order Confirmation (Sinhala)                │
└─────────────────────────────────────────────────────┘

Template Name: order_confirmation
Language: si (Sinhala)

HEADER:
┌──────────────────────────────────────────────────┐
│ ඇණවුම #{order_number} තහවුරු කරන ලදී ✓        │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ ස්තූතියි {customer_name}! 🎉                   │
│                                                  │
│ ඔබගේ ඇණවුම #{order_number} සාර්ථකව             │
│ තහවුරු කර ඇත.                                   │
│                                                  │
│ ඇණවුම් විස්තර:                                  │
│ • මුළු එකතුව: ₨{total_amount}                  │
│ • භාණ්ඩ: {item_count}                           │
│ • ගෙවීම: {payment_method}                      │
│                                                  │
│ ඔබේ ඇණවුම නිරීක්ෂණය කරන්න:                    │
│ {tracking_url}                                   │
│                                                  │
│ ඇණවුම යවන විට අපි දැනුම් දෙන්නෙමු!            │
└──────────────────────────────────────────────────┘

FOOTER:
┌──────────────────────────────────────────────────┐
│ ලංකා කොමර්ස් ක්ලවුඩ්                           │
│ උදව්වක් අවශ්‍යද? පණිවිඩයට පිළිතුරු දෙන්න       │
└──────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│          Payment Success (Sinhala)                   │
└─────────────────────────────────────────────────────┘

Template Name: payment_success
Language: si

HEADER:
┌──────────────────────────────────────────────────┐
│ ගෙවීම ₨{amount} ලැබුණා ✓                      │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ ස්තූතියි {customer_name}! 💳                   │
│                                                  │
│ අපි ඔබගේ ගෙවීම සාර්ථකව ලබාගෙන ඇත.            │
│                                                  │
│ ගෙවීම් විස්තර:                                 │
│ • මුදල: ₨{payment_amount}                       │
│ • ක්‍රමය: {payment_method}                      │
│ • ගනුදෙනු අංකය: {transaction_id}               │
│ • ඇණවුම: #{order_number}                       │
│                                                  │
│ ඔබගේ ඇණවුම දැන් සකස් කරමින් ඉදිරියේදී          │
│ යවනු ලැබේ. නිරීක්ෂණ විස්තර සමඟ අපි           │
│ දැනුම් දෙන්නෙමු!                                │
└──────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│          COD Reminder (Sinhala)                      │
└─────────────────────────────────────────────────────┘

Template Name: cod_reminder
Language: si

HEADER:
┌──────────────────────────────────────────────────┐
│ ඇණවුම #{order_number} - ₨{amount} මුදල්        │
│ අවශ්‍යයි 💵                                      │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ හායි {customer_name}! 👋                        │
│                                                  │
│ කෙටි සිහිකැඳවුමක්: ඔබේ ඇණවුම #{order_number}   │
│ මුදල් ගෙවීමෙන් පසු භාර දීමක් ලෙස ඉක්මනින්       │
│ පැමිණේ.                                          │
│                                                  │
│ ගෙවීම් විස්තර:                                 │
│ • අවශ්‍ය මුදල: ₨{cod_amount}                    │
│ • භාර දීමේ වේලාව: {delivery_time}              │
│                                                  │
│ {delivery_instructions}                          │
│                                                  │
│ අපගේ බෙදාහැරීමේ නියෝජිතයා පැමිණීමට මඳ         │
│ වේලාවකට පෙර ඔබට කතා කරන්නෙමු. නිශ්චිත මුදල    │
│ අගය කළත් අවශ්‍ය නැත - නියෝජිතයාට වෙනස්කම්      │
│ ලබා දිය හැක.                                    │
│                                                  │
│ ස්තූතියි! 🙏                                    │
└──────────────────────────────────────────────────┘
```

### Translation Quality Guidelines

```
┌────────────────────────────────────────────────────┐
│        Sinhala Translation Best Practices           │
└────────────────────────────────────────────────────┘

Professional Translation:
├─> Use native Sinhala speaker
├─> Business experience preferred
├─> Understand e-commerce terminology
└─> Familiar with formal Sinhala writing

Cultural Adaptation:
├─> Formal vs. informal pronouns
│   └─> Use respectful forms (ඔබ not තෝ)
├─> Greetings appropriate to context
│   └─> ස්තූතියි (thank you), සුබ දවසක් (good day)
├─> Numbers and currency
│   └─> Use Western numerals for amounts (₨5,250)
└─> Professional yet friendly tone

Technical Terms:
├─> Order → ඇණවුම
├─> Payment → ගෙවීම
├─> Delivery → බෙදාහැරීම
├─> Tracking → නිරීක්ෂණය
├─> Customer → පාරිභෝගික / ගනුදෙනුකරු
└─> Product → භාණ්ඩය

Avoid:
├─> Direct machine translation
├─> Overly formal archaic terms
├─> Singlish mixing (keep pure Sinhala)
└─> Ambiguous translations
```

### Parameter Handling in Sinhala

```
┌────────────────────────────────────────────────────┐
│        Parameters in Sinhala Context                │
└────────────────────────────────────────────────────┘

English Text:
"Thank you {customer_name}! Your order #{order_number}"

Sinhala Translation:
"ස්තූතියි {customer_name}! ඔබගේ ඇණවුම #{order_number}"

Key Points:
├─> Parameter names stay in English ({customer_name})
├─> Surrounding text translated to Sinhala
├─> Parameter order may change due to grammar
├─> Spacing around parameters maintained
└─> Special characters (# prefix) preserved

Examples:
┌──────────────────────────────────────────────────┐
│ English: Order #{order_number} Confirmed          │
│ Sinhala: ඇණවුම #{order_number} තහවුරු කරන ලදී   │
│                                                  │
│ English: Total: ₨{total_amount}                  │
│ Sinhala: මුළු එකතුව: ₨{total_amount}            │
│                                                  │
│ English: Payment via {payment_method}            │
│ Sinhala: ගෙවීම {payment_method} හරහා           │
└──────────────────────────────────────────────────┘
```

### Expected Outcome

- Seven complete Sinhala template versions created
- All templates use "si" language code
- Professional translation quality
- Cultural appropriateness maintained
- Parameters function correctly
- Proper Sinhala Unicode encoding
- Ready for Meta approval

### Verification Checklist

- [ ] All 7 templates translated to Sinhala
- [ ] Language field set to "si" for all
- [ ] template_name matches English versions
- [ ] template_type values consistent
- [ ] Professional translator used (not machine)
- [ ] Cultural tone appropriate
- [ ] Parameters preserved correctly
- [ ] Sinhala script renders properly
- [ ] Unicode encoding correct (UTF-8)
- [ ] No character corruption
- [ ] Tested on mobile devices
- [ ] WhatsApp renders Sinhala correctly
- [ ] Terminology consistent across templates

---

## Task 47: Create Tamil Templates

### Overview

Create Tamil (தமிழ்) language versions of all seven order lifecycle templates. Tamil is spoken by approximately 15% of Sri Lanka's population, primarily in the Northern and Eastern provinces and among plantation communities. Providing Tamil templates ensures inclusive service for Tamil-speaking customers and demonstrates cultural sensitivity. The translations must use proper Tamil script (Unicode), maintain professional tone, preserve cultural appropriateness, and ensure parameter functionality.

### Dependencies

- Task 46: Sinhala templates created (translation patterns established)
- Tamil translation capabilities available
- Unicode Tamil support configured

### Instructions

1. **Prepare for Tamil translation**
   - Verify database supports Tamil Unicode characters
   - Test frontend Tamil rendering
   - Confirm WhatsApp Business API Tamil support
   - Ensure all systems handle UTF-8 properly

2. **Establish Tamil translation approach**
   - Hire professional Tamil translator
   - Use native Tamil speaker familiar with Sri Lankan Tamil
   - Note: Sri Lankan Tamil differs slightly from Indian Tamil
   - Ensure business and e-commerce terminology expertise

3. **Translate all seven templates**
   - Order Confirmation → ஆர்டர் உறுதிப்படுத்தல்
   - Payment Success → கட்டணம் வெற்றிகரமானது
   - Payment Failed → கட்டணம் தோல்வியுற்றது
   - Shipped → ஆர்டர் அனுப்பப்பட்டது
   - Out for Delivery → டெலிவரிக்கு வெளியே
   - Delivered → டெலிவரி முடிந்தது
   - COD Reminder → பணம் செலுத்தும் நினைவூட்டல்

4. **Maintain parameter structure**
   - Keep parameter names in English
   - Translate contextual text to Tamil
   - Preserve parameter placement and order
   - Ensure functional placeholders

5. **Apply Tamil formatting rules**
   - Use Tamil punctuation conventions
   - Apply proper spacing for Tamil script
   - Use Western numerals for amounts (common practice)
   - Maintain readability on mobile screens

6. **Adapt for Sri Lankan Tamil context**
   - Use Sri Lankan Tamil vocabulary and style
   - Different from Indian Tamil in some terms
   - Apply appropriate formality level
   - Use respectful address forms

7. **Set proper language identification**
   - Set language field to "ta" for all Tamil templates
   - Keep template_name identical to English/Sinhala
   - Maintain same template_type classifications
   - Ensure multi-language linking works

8. **Test Tamil rendering**
   - Verify Tamil displays correctly on Android
   - Test on iOS devices (Tamil rendering)
   - Check WhatsApp Tamil font rendering
   - Test parameter substitution with Tamil

9. **Create each template version**
   - Create order_confirmation (ta)
   - Create payment_success (ta)
   - Create payment_failed (ta)
   - Create order_shipped (ta)
   - Create out_for_delivery (ta)
   - Create order_delivered (ta)
   - Create cod_reminder (ta)

10. **Document Tamil-specific notes**
    - Note Sri Lankan vs. Indian Tamil differences
    - Document terminology decisions
    - Explain any cultural adaptations
    - Provide reference for future translations

### Tamil Language Context

```
┌────────────────────────────────────────────────────┐
│        Tamil in Sri Lankan Context                  │
└────────────────────────────────────────────────────┘

Language Facts:
├─> Speakers: ~3.5 million (15% of Sri Lanka)
├─> Script: Tamil (தமிழ் எழுத்துக்கள்)
├─> Official: Official language in Northern/Eastern
└─> Unicode: U+0B80 to U+0BFF

Geographic Distribution:
├─> Northern Province: Primary language
├─> Eastern Province: Significant population
├─> Colombo: Tamil-speaking communities
└─> Plantation areas: Estate Tamil speakers

Business Usage:
├─> Primary: Northern/Eastern businesses
├─> Growing: Online commerce targeting Tamil speakers
├─> Essential: Government services in Tamil areas
└─> Important: Inclusive national services

Sri Lankan Tamil vs. Indian Tamil:
├─> Vocabulary: Some different terms
├─> Formality: Different politeness levels
├─> Loanwords: More Sinhala/English borrowings
└─> Pronunciation: Slight differences

Digital Support:
├─> Unicode: Widespread support
├─> Mobile: Native Tamil keyboards available
├─> Fonts: Good rendering on modern devices
└─> WhatsApp: Full Tamil support
```

### Tamil Template Examples

```
┌─────────────────────────────────────────────────────┐
│          Order Confirmation (Tamil)                  │
└─────────────────────────────────────────────────────┘

Template Name: order_confirmation
Language: ta (Tamil)

HEADER:
┌──────────────────────────────────────────────────┐
│ ஆர்டர் #{order_number} உறுதிப்படுத்தப்பட்டது ✓   │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ நன்றி {customer_name}! 🎉                        │
│                                                  │
│ உங்கள் ஆர்டர் #{order_number} வெற்றிகரமாக       │
│ உறுதிப்படுத்தப்பட்டுள்ளது.                       │
│                                                  │
│ ஆர்டர் விவரங்கள்:                                │
│ • மொத்தம்: ₨{total_amount}                      │
│ • பொருட்கள்: {item_count}                       │
│ • கட்டணம்: {payment_method}                     │
│                                                  │
│ உங்கள் ஆர்டரை கண்காணிக்க:                       │
│ {tracking_url}                                   │
│                                                  │
│ ஆர்டர் அனுப்பும் போது உங்களுக்கு தெரிவிப்போம்!  │
└──────────────────────────────────────────────────┘

FOOTER:
┌──────────────────────────────────────────────────┐
│ லங்கா காமர்ஸ் கிளவுட்                           │
│ உதவி தேவையா? இந்த செய்திக்கு பதிலளிக்கவும்    │
└──────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│          Payment Success (Tamil)                     │
└─────────────────────────────────────────────────────┘

Template Name: payment_success
Language: ta

HEADER:
┌──────────────────────────────────────────────────┐
│ கட்டணம் ₨{amount} பெறப்பட்டது ✓                │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ நன்றி {customer_name}! 💳                        │
│                                                  │
│ உங்கள் கட்டணத்தை நாங்கள் வெற்றிகரமாக          │
│ பெற்றுள்ளோம்.                                    │
│                                                  │
│ கட்டண விவரங்கள்:                                 │
│ • தொகை: ₨{payment_amount}                       │
│ • முறை: {payment_method}                        │
│ • பரிவர்த்தனை ID: {transaction_id}             │
│ • ஆர்டர்: #{order_number}                       │
│                                                  │
│ உங்கள் ஆர்டர் இப்போது செயல்படுத்தப்பட்டு        │
│ விரைவில் அனுப்பப்படும். டிராக்கிங் விவரங்களுடன் │
│ உங்களுக்குத் தெரிவிப்போம்!                      │
└──────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│          Shipped (Tamil)                             │
└─────────────────────────────────────────────────────┘

Template Name: order_shipped
Language: ta

HEADER:
┌──────────────────────────────────────────────────┐
│ ஆர்டர் #{order_number} அனுப்பப்பட்டது 📦        │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ நல்ல செய்தி {customer_name}! 🚚                 │
│                                                  │
│ உங்கள் ஆர்டர் #{order_number} அனுப்பப்பட்டு     │
│ உங்களுக்கு வருகிறது!                            │
│                                                  │
│ ஷிப்பிங் விவரங்கள்:                             │
│ • கூரியர்: {courier_name}                       │
│ • டிராக்கிங் #: {tracking_number}              │
│ • மதிப்பிடப்பட்ட டெலிவரி: {estimated_delivery}│
│                                                  │
│ உங்கள் பார்சலை கண்காணிக்க:                     │
│ {tracking_url}                                   │
│                                                  │
│ ஆர்டர் டெலிவரிக்கு வெளியாகும் போது உங்களுக்கு  │
│ தெரிவிப்போம்!                                    │
└──────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────┐
│          COD Reminder (Tamil)                        │
└─────────────────────────────────────────────────────┘

Template Name: cod_reminder
Language: ta

HEADER:
┌──────────────────────────────────────────────────┐
│ ஆர்டர் #{order_number} - ₨{amount} பணம்         │
│ தேவை 💵                                          │
└──────────────────────────────────────────────────┘

BODY:
┌──────────────────────────────────────────────────┐
│ ஹாய் {customer_name}! 👋                         │
│                                                  │
│ விரைவு நினைவூட்டல்: உங்கள் ஆர்டர்              │
│ #{order_number} பணம் செலுத்தி டெலிவரியாக       │
│ விரைவில் வருகிறது.                              │
│                                                  │
│ கட்டண விவரங்கள்:                                 │
│ • தேவையான தொகை: ₨{cod_amount}                  │
│ • டெலிவரி நேரம்: {delivery_time}               │
│                                                  │
│ {delivery_instructions}                          │
│                                                  │
│ எங்கள் டெலிவரி முகவர் வருவதற்கு சிறிது          │
│ நேரத்திற்கு முன்பு உங்களை அழைப்பார். சரியான    │
│ தொகை பாராட்டப்பட்டாலும் அவசியமில்லை - முகவர்   │
│ மாற்றம் கொடுக்க முடியும்.                       │
│                                                  │
│ நன்றி! 🙏                                        │
└──────────────────────────────────────────────────┘
```

### Tamil Translation Guidelines

```
┌────────────────────────────────────────────────────┐
│        Tamil Translation Best Practices             │
└────────────────────────────────────────────────────┘

Professional Approach:
├─> Use Sri Lankan Tamil speaker
├─> Familiar with local business Tamil
├─> E-commerce terminology knowledge
└─> Formal written Tamil skills

Sri Lankan Tamil Characteristics:
├─> Vocabulary: Mix of pure Tamil and borrowings
├─> Formality: Moderate formal level for business
├─> Respect: Use polite forms (நீங்கள் not நீ)
└─> Modern: Contemporary business language

Key Terms (Sri Lankan Tamil):
├─> Order → ஆர்டர் (borrowed from English)
├─> Payment → கட்டணம்
├─> Delivery → டெலிவரி (borrowed)
├─> Customer → வாடிக்கையாளர்
├─> Track → கண்காணி
└─> Thank you → நன்றி

Numbers and Currency:
├─> Use Western numerals (₨5,250)
├─> Currency symbol before amount (like English)
├─> Comma separation for thousands
└─> Decimal point for paisa (cents)

Avoid:
├─> Overly formal/literary Tamil
├─> Indian Tamil terms unfamiliar in Sri Lanka
├─> Pure Tamil alternatives to common English terms
└─> Mixing Tamil and English words in same sentence
```

### Parameter Integration in Tamil

```
┌────────────────────────────────────────────────────┐
│        Tamil Grammar and Parameters                 │
└────────────────────────────────────────────────────┘

Word Order:
├─> Tamil: Subject-Object-Verb (SOV)
├─> English: Subject-Verb-Object (SVO)
└─> Parameter positions may shift in translation

Example Transformations:
┌──────────────────────────────────────────────────┐
│ English: "Thank you {name}! Your order {number}" │
│ Tamil: "நன்றி {name}! உங்கள் ஆர்டர் {number}"    │
│                                                  │
│ English: "Total: ₨{amount}"                      │
│ Tamil: "மொத்தம்: ₨{amount}"                     │
│                                                  │
│ English: "Delivered at {time}"                   │
│ Tamil: "{time} அன்று டெலிவரி செய்யப்பட்டது"    │
└──────────────────────────────────────────────────┘

Suffix Handling:
├─> Tamil uses suffixes for case marking
├─> Parameters stay unchanged
├─> Suffixes attach to surrounding words
└─> Example: ஆர்டர் + உம் = ஆர்டரும் (order also)
```

### Expected Outcome

- Seven complete Tamil template versions created
- All templates use "ta" language code
- Sri Lankan Tamil dialect and terminology
- Professional translation quality
- Cultural appropriateness for Tamil speakers
- Parameters function correctly in Tamil context
- Proper Tamil Unicode encoding
- Ready for Meta approval

### Verification Checklist

- [ ] All 7 templates translated to Tamil
- [ ] Language field set to "ta" for all
- [ ] template_name consistent with English/Sinhala
- [ ] template_type values aligned
- [ ] Sri Lankan Tamil speaker consulted
- [ ] Appropriate formality level used
- [ ] Parameters preserved and functional
- [ ] Tamil script renders correctly
- [ ] Unicode encoding correct (UTF-8)
- [ ] No character display issues
- [ ] Tested on Android and iOS
- [ ] WhatsApp Tamil rendering verified
- [ ] Terminology consistent across templates
- [ ] Cultural sensitivity maintained

---

## Task 48: Create Template Builder

### Overview

Create the TemplateBuilder service class that constructs WhatsApp Business API message payloads from template definitions and parameter values. This service retrieves the appropriate template based on type and language, validates that all required parameters are provided, constructs the API-compliant JSON payload with header and body components, formats parameters according to WhatsApp specifications, and returns the complete message structure ready for API submission. The builder abstracts the complexity of WhatsApp's template message format from the rest of the application.

### Dependencies

- Tasks 46-47: All multi-language templates must exist
- MessageTemplate model complete with all fields
- Understanding of WhatsApp Business API template format

### Instructions

1. **Create TemplateBuilder class**
   - Create new file template_builder.py in services directory
   - Define TemplateBuilder class
   - Add initialization method
   - Set up logging for debugging

2. **Implement template retrieval method**
   - Create get_template method
   - Accept template_type and language parameters
   - Query MessageTemplate model
   - Filter by type, language, and is_approved=True
   - Return most recent template if multiple exist
   - Handle template not found errors

3. **Add language fallback logic**
   - If requested language template not found
   - Fallback to English ("en") version
   - Log the fallback for monitoring
   - Ensure graceful degradation

4. **Create parameter validation method**
   - Accept template and parameter dictionary
   - Extract required params from template
   - Check all header_params present in provided params
   - Check all body_params present in provided params
   - Raise descriptive error if params missing
   - Return validated parameters

5. **Implement header component builder**
   - Create build_header_component method
   - Accept template and parameters
   - If template has header_params
   - Format header parameters for API
   - Return header component structure
   - Return None if no header

6. **Implement body component builder**
   - Create build_body_component method
   - Accept template and parameters
   - Format body parameters for API
   - Maintain parameter order from template
   - Return body component structure
   - Always include body component

7. **Create complete message builder**
   - Implement build_message method
   - Accept template_type, language, and parameters
   - Retrieve appropriate template
   - Validate parameters
   - Build header component
   - Build body component
   - Assemble complete WhatsApp API payload
   - Return formatted message structure

8. **Add API payload formatting**
   - Format according to WhatsApp API specification
   - Include template name and language
   - Structure components array correctly
   - Format parameters with type and value
   - Ensure JSON serializable output

9. **Implement error handling**
   - Handle template not found scenarios
   - Handle missing parameters
   - Handle invalid parameter values
   - Provide clear error messages
   - Log errors for debugging

10. **Add logging and monitoring**
    - Log template selection
    - Log parameter validation
    - Log message construction
    - Track template usage statistics
    - Monitor fallback occurrences

### Template Builder Architecture

```
┌────────────────────────────────────────────────────┐
│        Template Builder Flow                        │
└────────────────────────────────────────────────────┘

Input:
├─> template_type: "ORDER_CONFIRMATION"
├─> language: "si"
└─> parameters: {
    "order_number": "12345",
    "customer_name": "Kasun",
    ...
}

┌──────────────────────────────────────────────────┐
│                                                  │
│  1. Retrieve Template                           │
│     └─> Query by type and language              │
│     └─> Fallback to English if needed           │
│                                                  │
│  2. Validate Parameters                         │
│     └─> Check all required params present       │
│     └─> Validate parameter formats              │
│                                                  │
│  3. Build Header Component                      │
│     └─> Extract header params from template     │
│     └─> Format for WhatsApp API                 │
│                                                  │
│  4. Build Body Component                        │
│     └─> Extract body params from template       │
│     └─> Maintain parameter order                │
│                                                  │
│  5. Assemble Message                            │
│     └─> Combine components                      │
│     └─> Add template metadata                   │
│                                                  │
└──────────────────────────────────────────────────┘

Output:
{
  "template": {
    "name": "order_confirmation",
    "language": {"code": "si"},
    "components": [
      {
        "type": "header",
        "parameters": [...]
      },
      {
        "type": "body",
        "parameters": [...]
      }
    ]
  }
}
```

### WhatsApp API Payload Format

```
┌────────────────────────────────────────────────────┐
│        WhatsApp Business API Template Format        │
└────────────────────────────────────────────────────┘

Complete Payload Structure:
{
  "messaging_product": "whatsapp",
  "to": "+94771234567",
  "type": "template",
  "template": {
    "name": "order_confirmation",
    "language": {
      "code": "en"
    },
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "text",
            "text": "12345"
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "Kasun"
          },
          {
            "type": "text",
            "text": "12345"
          },
          {
            "type": "text",
            "text": "5,250.00"
          },
          {
            "type": "text",
            "text": "3"
          },
          {
            "type": "text",
            "text": "Card"
          },
          {
            "type": "text",
            "text": "https://lcc.lk/track/12345"
          }
        ]
      }
    ]
  }
}
```

### Parameter Type Mapping

| Parameter Content | WhatsApp Type | Format |
|-------------------|---------------|--------|
| Text/String | "text" | Plain text value |
| Currency Amount | "text" | Formatted string with symbol |
| URL | "text" | Full URL string |
| Number | "text" | Converted to string |
| Date/Time | "text" | Formatted string |
| Phone Number | "text" | E.164 format |

### Template Builder Methods

```
┌────────────────────────────────────────────────────┐
│        TemplateBuilder Class Structure              │
└────────────────────────────────────────────────────┘

class TemplateBuilder:
    │
    ├─> get_template(template_type, language)
    │   └─> Returns: MessageTemplate object
    │
    ├─> validate_parameters(template, params)
    │   └─> Returns: Validated params dict
    │
    ├─> build_header_component(template, params)
    │   └─> Returns: Header component dict or None
    │
    ├─> build_body_component(template, params)
    │   └─> Returns: Body component dict
    │
    ├─> build_message(template_type, language, params)
    │   └─> Returns: Complete API payload dict
    │
    ├─> format_parameter(value)
    │   └─> Returns: Formatted parameter dict
    │
    └─> handle_language_fallback(template_type)
        └─> Returns: English template
```

### Error Handling Scenarios

```
┌────────────────────────────────────────────────────┐
│        Template Builder Error Handling              │
└────────────────────────────────────────────────────┘

Template Not Found:
├─> Error: No approved template for type+language
├─> Action: Try English fallback
├─> Log: Warning with details
└─> Raise: TemplateNotFoundError if fallback fails

Missing Parameters:
├─> Error: Required param not in provided params
├─> Action: List missing parameters
├─> Log: Error with template and missing params
└─> Raise: ValidationError with details

Invalid Parameter Value:
├─> Error: Parameter value wrong type/format
├─> Action: Attempt type conversion
├─> Log: Warning with conversion details
└─> Raise: ValueError if conversion fails

Database Error:
├─> Error: Cannot query templates
├─> Action: Retry once
├─> Log: Critical error with stack trace
└─> Raise: DatabaseError
```

### Usage Example Flow

```
┌────────────────────────────────────────────────────┐
│        Using Template Builder in Code               │
└────────────────────────────────────────────────────┘

Scenario: Send order confirmation in Sinhala

Step 1: Prepare parameters
─────────────────────────────
params = {
    "order_number": "12345",
    "customer_name": "Kasun",
    "total_amount": "5,250.00",
    "item_count": "3",
    "payment_method": "Card",
    "tracking_url": "https://lcc.lk/track/12345"
}

Step 2: Build message
─────────────────────────────
builder = TemplateBuilder()
message_payload = builder.build_message(
    template_type="ORDER_CONFIRMATION",
    language="si",
    parameters=params
)

Step 3: Send via WhatsApp API
─────────────────────────────
whatsapp_client.send_template_message(
    phone_number="+94771234567",
    payload=message_payload
)
```

### Expected Outcome

- TemplateBuilder class created in services
- Retrieves appropriate templates by type and language
- Validates all required parameters present
- Builds WhatsApp API-compliant message payloads
- Handles language fallback gracefully
- Provides clear error messages
- Logging for monitoring and debugging

### Verification Checklist

- [ ] TemplateBuilder class defined
- [ ] get_template method retrieves correct template
- [ ] Language fallback to English implemented
- [ ] validate_parameters checks all required params
- [ ] build_header_component formats header correctly
- [ ] build_body_component formats body correctly
- [ ] build_message assembles complete payload
- [ ] Output matches WhatsApp API specification
- [ ] Error handling for missing templates
- [ ] Error handling for missing parameters
- [ ] Logging implemented for key actions
- [ ] Unit tests created for builder methods

---

## Task 49: Create Param Substitution

### Overview

Create the parameter substitution service that replaces placeholder tokens in template strings with actual values. While WhatsApp handles parameter substitution on their end when sending template messages via API, this service is useful for preview generation, template testing, email notifications with same content, SMS fallback messages, and administrative template verification. It takes a template and parameter dictionary, finds all placeholders in the text, replaces them with corresponding values, and returns the final rendered message.

### Dependencies

- Task 48: Template Builder must be created
- MessageTemplate model with template_content field
- Understanding of parameter placeholder formats

### Instructions

1. **Create ParamSubstitution class**
   - Create param_substitution.py in services
   - Define ParamSubstitution class
   - Add initialization and configuration
   - Set up placeholder pattern matching

2. **Define placeholder format**
   - Use {parameter_name} format for placeholders
   - Support both header and body placeholders
   - Case-sensitive parameter names
   - No nested placeholders

3. **Implement parameter extraction**
   - Create extract_placeholders method
   - Parse template text for {param} patterns
   - Use regex to find all placeholders
   - Return list of unique parameter names
   - Handle malformed placeholders gracefully

4. **Create substitution logic**
   - Implement substitute method
   - Accept template text and parameter dictionary
   - Find each placeholder in text
   - Replace with corresponding value from params
   - Handle missing parameters appropriately
   - Return fully substituted text

5. **Add format handling**
   - Support different parameter types
   - Format currency values properly
   - Format dates/times consistently
   - Handle URLs without modification
   - Convert numbers to strings appropriately

6. **Implement missing parameter handling**
   - Define strategy for missing parameters
   - Option 1: Leave placeholder unchanged {param}
   - Option 2: Replace with empty string
   - Option 3: Replace with default value [MISSING]
   - Make behavior configurable

7. **Add validation method**
   - Create validate_substitution method
   - Check if all placeholders were replaced
   - Identify any remaining placeholders
   - Return validation status and issues
   - Useful for testing

8. **Create preview generation**
   - Implement generate_preview method
   - Accept template object and parameters
   - Substitute both header and body
   - Return formatted preview text
   - Used for admin interface

9. **Add HTML/text formatting options**
   - Support plain text output
   - Support HTML output (for email)
   - Support markdown output (for web)
   - Preserve line breaks and formatting
   - Escape special characters as needed

10. **Implement error handling**
    - Handle malformed templates
    - Handle invalid parameter values
    - Handle Unicode/encoding issues
    - Provide detailed error messages
    - Log substitution errors

### Parameter Substitution Flow

```
┌────────────────────────────────────────────────────┐
│        Parameter Substitution Process               │
└────────────────────────────────────────────────────┘

Input:
├─> Template Text:
│   "Thank you {customer_name}! Your order 
│    #{order_number} totaling ₨{total_amount} 
│    has been confirmed."
│
└─> Parameters:
    {
      "customer_name": "Kasun",
      "order_number": "12345",
      "total_amount": "5,250.00"
    }

Process:
┌──────────────────────────────────────────────────┐
│ 1. Extract placeholders from template           │
│    → Found: {customer_name}, {order_number},    │
│              {total_amount}                      │
│                                                  │
│ 2. Validate all parameters present              │
│    → Check each placeholder has matching param  │
│                                                  │
│ 3. Replace each placeholder                     │
│    → {customer_name} → "Kasun"                  │
│    → {order_number} → "12345"                   │
│    → {total_amount} → "5,250.00"                │
│                                                  │
│ 4. Return substituted text                      │
└──────────────────────────────────────────────────┘

Output:
"Thank you Kasun! Your order #12345 totaling 
₨5,250.00 has been confirmed."
```

### Placeholder Pattern Matching

```
┌────────────────────────────────────────────────────┐
│        Regex Pattern for Placeholders               │
└────────────────────────────────────────────────────┘

Pattern: \{([a-z][a-z0-9_]*)\}

Explanation:
├─> \{        - Opening brace (literal)
├─> (...)     - Capture group
├─> [a-z]     - Start with lowercase letter
├─> [a-z0-9_]* - Followed by letters, numbers, underscore
└─> \}        - Closing brace (literal)

Matches:
✓ {customer_name}
✓ {order_number}
✓ {total_amount}
✓ {tracking_url}

Does NOT match:
✗ {CustomerName}     (uppercase)
✗ {123order}         (starts with number)
✗ {order-number}     (hyphen not allowed)
✗ {{nested}}         (nested braces)
✗ {order number}     (space not allowed)
```

### Substitution Examples

```
┌────────────────────────────────────────────────────┐
│        Substitution Examples                        │
└────────────────────────────────────────────────────┘

Example 1: Simple Text
─────────────────────────────────────────────────────
Template: "Hello {name}!"
Params: {"name": "Kasun"}
Result: "Hello Kasun!"

Example 2: Multiple Parameters
─────────────────────────────────────────────────────
Template: "Order {order_id} total: ₨{amount}"
Params: {"order_id": "12345", "amount": "5,250.00"}
Result: "Order 12345 total: ₨5,250.00"

Example 3: Missing Parameter
─────────────────────────────────────────────────────
Template: "Hello {name}, your order {order_id}"
Params: {"name": "Kasun"}
Result (keep placeholder): "Hello Kasun, your order {order_id}"
Result (use default): "Hello Kasun, your order [MISSING]"
Result (empty): "Hello Kasun, your order "

Example 4: Repeated Parameters
─────────────────────────────────────────────────────
Template: "Order {id}: Track at /orders/{id}"
Params: {"id": "12345"}
Result: "Order 12345: Track at /orders/12345"

Example 5: URLs
─────────────────────────────────────────────────────
Template: "Track: {url}"
Params: {"url": "https://lcc.lk/track/12345"}
Result: "Track: https://lcc.lk/track/12345"
```

### Type Formatting

```
┌────────────────────────────────────────────────────┐
│        Parameter Type Formatting                    │
└────────────────────────────────────────────────────┘

String Values:
├─> Input: "Kasun Perera"
└─> Output: "Kasun Perera" (unchanged)

Numeric Values:
├─> Input: 5250.00
├─> Format: Add commas, 2 decimals
└─> Output: "5,250.00"

Currency Values:
├─> Input: 5250.00
├─> Format: Currency symbol + formatted number
└─> Output: "₨5,250.00"

Date Values:
├─> Input: datetime(2026, 2, 5, 11, 30)
├─> Format: "MMM DD, YYYY at HH:MM AM/PM"
└─> Output: "Feb 5, 2026 at 11:30 AM"

Phone Numbers:
├─> Input: "+94771234567"
├─> Format: +94 77 XXX XXXX
└─> Output: "+94 77 123 4567"

Boolean Values:
├─> Input: True / False
└─> Output: "Yes" / "No"
```

### Use Cases

```
┌────────────────────────────────────────────────────┐
│        Parameter Substitution Use Cases             │
└────────────────────────────────────────────────────┘

1. Template Preview (Admin Interface)
   └─> Show what customer will receive
   └─> Before sending, verify content
   └─> Test with sample data

2. Email Notifications
   └─> Same content as WhatsApp
   └─> Substitute for email body
   └─> Maintain consistency

3. SMS Fallback
   └─> When WhatsApp fails
   └─> Send as plain SMS
   └─> Same message content

4. Template Testing
   └─> Verify all parameters work
   └─> Check for missing params
   └─> Validate output

5. Customer Service Preview
   └─> Show agents what was sent
   └─> Display in CRM/dashboard
   └─> Historical message view

6. Logging/Archival
   └─> Store final message sent
   └─> Audit trail
   └─> Compliance records
```

### ParamSubstitution Class Structure

```
┌────────────────────────────────────────────────────┐
│        ParamSubstitution Methods                    │
└────────────────────────────────────────────────────┘

class ParamSubstitution:
    │
    ├─> extract_placeholders(template_text)
    │   └─> Returns: List of parameter names
    │
    ├─> substitute(template_text, parameters)
    │   └─> Returns: Substituted text string
    │
    ├─> format_parameter(value, param_type)
    │   └─> Returns: Formatted value string
    │
    ├─> validate_substitution(text)
    │   └─> Returns: (is_valid, remaining_placeholders)
    │
    ├─> generate_preview(template, parameters)
    │   └─> Returns: Full message preview
    │
    └─> handle_missing_parameter(param_name, strategy)
        └─> Returns: Replacement value
```

### Expected Outcome

- ParamSubstitution service created
- Extracts placeholders from template text
- Substitutes parameters with actual values
- Handles various parameter types with formatting
- Manages missing parameters gracefully
- Provides preview generation capability
- Useful for testing and non-WhatsApp channels

### Verification Checklist

- [ ] ParamSubstitution class created
- [ ] Placeholder extraction works correctly
- [ ] Regex pattern matches valid placeholders
- [ ] Substitution replaces all parameters
- [ ] Type formatting implemented (currency, dates)
- [ ] Missing parameter handling configured
- [ ] Validation method identifies remaining placeholders
- [ ] Preview generation works for full templates
- [ ] Error handling for malformed templates
- [ ] Unit tests cover various scenarios
- [ ] Works with multilingual templates
- [ ] Unicode handling correct

---

## Task 50: Create Template Validator

### Overview

Create the TemplateValidator service that validates template definitions before submission to Meta for approval and before use in production. This validator checks template structure integrity, verifies parameter consistency between header_params/body_params and actual template content, ensures compliance with WhatsApp Business API requirements, validates multilingual completeness, and provides detailed validation reports. The validator prevents common mistakes that would cause template rejection by Meta.

### Dependencies

- Task 49: Param Substitution created (for placeholder extraction)
- Task 48: Template Builder created
- Understanding of WhatsApp template requirements

### Instructions

1. **Create TemplateValidator class**
   - Create template_validator.py in services
   - Define TemplateValidator class
   - Initialize with WhatsApp requirements
   - Set up validation rule registry

2. **Implement template name validation**
   - Create validate_template_name method
   - Check naming convention (lowercase, underscores)
   - Verify length limits (max 512 characters per WhatsApp)
   - Ensure no reserved words used
   - Check uniqueness per language

3. **Add parameter definition validation**
   - Create validate_parameter_definitions method
   - Verify header_params is valid list
   - Verify body_params is valid list
   - Check parameter name format
   - Ensure no duplicate parameter names
   - Validate parameter count limits

4. **Implement template content validation**
   - Create validate_template_content method
   - Check content not empty
   - Verify reasonable length (body max 1024 chars)
   - Ensure proper placeholder format
   - Check for invalid characters
   - Validate Unicode support

5. **Add parameter consistency check**
   - Create validate_parameter_consistency method
   - Extract placeholders from template content
   - Compare with declared header_params
   - Compare with declared body_params
   - Ensure all placeholders have declarations
   - Ensure all declarations have placeholders
   - Report mismatches

6. **Implement WhatsApp requirement validation**
   - Create validate_whatsapp_requirements method
   - Check template follows WhatsApp policies
   - Verify no prohibited content
   - Ensure transactional template guidelines
   - Validate button formats (if applicable)
   - Check character limits

7. **Add multilingual completeness check**
   - Create validate_multilingual_set method
   - For given template_name, check all languages
   - Verify English, Sinhala, Tamil versions exist
   - Ensure parameter consistency across languages
   - Check all versions use same parameter names
   - Validate all versions have same parameter count

8. **Create comprehensive validation method**
   - Implement validate_template method
   - Run all validation checks
   - Collect all validation issues
   - Categorize issues (errors vs warnings)
   - Generate detailed validation report
   - Return validation result object

9. **Add batch validation**
   - Create validate_multiple_templates method
   - Validate all templates in system
   - Validate template sets by type
   - Generate summary report
   - Identify templates needing attention

10. **Implement validation reporting**
    - Create ValidationResult class
    - Include is_valid boolean
    - List of errors (must fix)
    - List of warnings (should fix)
    - Success messages
    - Detailed explanations
    - Suggestions for fixes

### WhatsApp Template Requirements

```
┌────────────────────────────────────────────────────┐
│        WhatsApp Business API Template Rules         │
└────────────────────────────────────────────────────┘

Template Name:
├─> Lowercase letters, numbers, underscores only
├─> No spaces or special characters
├─> Max length: 512 characters
├─> Must be unique per namespace
└─> Example: order_confirmation_en

Template Content:
├─> Header: Optional, max 60 characters
├─> Body: Required, max 1024 characters
├─> Footer: Optional, max 60 characters
├─> Buttons: Optional, max 3 buttons
└─> Variables: Max 10 per component

Parameter Format:
├─> Format: {{1}}, {{2}}, {{3}}, etc.
├─> Sequential numbering required
├─> No gaps in sequence
├─> Start from 1, not 0
└─> Match parameter count exactly

Content Policies:
├─> No spam or promotional content (in transactional)
├─> No misleading information
├─> No prohibited categories (adult, gambling, etc.)
├─> Clear value proposition
└─> Professional language

Language Codes:
├─> ISO 639-1 two-letter codes
├─> English: en, en_US, en_GB
├─> Sinhala: si
├─> Tamil: ta
└─> Must specify language for each template
```

### Validation Rules

```
┌────────────────────────────────────────────────────┐
│        Template Validation Rules                    │
└────────────────────────────────────────────────────┘

CRITICAL (Must Pass):
┌──────────────────────────────────────────────────┐
│ 1. Template name follows convention              │
│ 2. At least body content exists                  │
│ 3. All placeholders have parameter declarations  │
│ 4. All parameters used in content                │
│ 5. Character limits not exceeded                 │
│ 6. No prohibited content                         │
│ 7. Valid language code                           │
│ 8. Template type specified                       │
└──────────────────────────────────────────────────┘

WARNINGS (Should Fix):
┌──────────────────────────────────────────────────┐
│ 1. Missing translations (not all 3 languages)    │
│ 2. Very long body text (>800 chars)             │
│ 3. Many parameters (>7 in body)                  │
│ 4. Inconsistent parameter names across languages│
│ 5. No header (lower engagement)                  │
│ 6. Generic template name                         │
└──────────────────────────────────────────────────┘
```

### Parameter Consistency Validation

```
┌────────────────────────────────────────────────────┐
│        Parameter Consistency Checks                 │
└────────────────────────────────────────────────────┘

Example Template (English):
─────────────────────────────────────────────────────
template_name: "order_confirmation"
language: "en"
header_params: ["order_number"]
body_params: ["customer_name", "order_number", 
              "total_amount", "tracking_url"]

Template Content:
"Order #{order_number} Confirmed

Thank you {customer_name}! Your order #{order_number} 
totaling ₨{total_amount} is confirmed. Track: 
{tracking_url}"

Validation:
┌──────────────────────────────────────────────────┐
│ ✓ Header: {order_number} declared and used      │
│ ✓ Body: All 4 params declared and used          │
│ ✓ No undeclared placeholders                    │
│ ✓ No unused parameter declarations              │
│ ✓ Parameter names valid format                  │
└──────────────────────────────────────────────────┘

Cross-Language Validation (Same template in Sinhala):
─────────────────────────────────────────────────────
template_name: "order_confirmation"  ✓ Same name
language: "si"  ✓ Different language
header_params: ["order_number"]  ✓ Same params
body_params: ["customer_name", "order_number", 
              "total_amount", "tracking_url"]  ✓ Same params

✓ Parameter consistency maintained across languages
```

### Validation Result Structure

```
┌────────────────────────────────────────────────────┐
│        ValidationResult Object                      │
└────────────────────────────────────────────────────┘

ValidationResult:
{
  "is_valid": true/false,
  "template_name": "order_confirmation",
  "language": "en",
  "errors": [
    {
      "field": "body_params",
      "message": "Parameter 'tracking_url' declared but 
                  not used in template",
      "severity": "error"
    }
  ],
  "warnings": [
    {
      "field": "body_content",
      "message": "Body text is 950 characters, consider 
                  shortening for better readability",
      "severity": "warning"
    }
  ],
  "suggestions": [
    "Add Tamil translation for complete multilingual support",
    "Consider adding a header for better open rates"
  ],
  "validation_time": "2026-01-31T10:30:00Z",
  "checked_rules": 15,
  "passed_rules": 13
}
```

### Validation Process Flow

```
┌────────────────────────────────────────────────────┐
│        Template Validation Workflow                 │
└────────────────────────────────────────────────────┘

1. Template Created by Admin
   └─> New MessageTemplate instance

2. Run Validator Before Save
   └─> validator.validate_template(template)

3. Validation Checks:
   ┌────────────────────────────────────────────────┐
   │ ✓ Name format                                  │
   │ ✓ Parameter definitions                        │
   │ ✓ Content structure                            │
   │ ✓ Parameter consistency                        │
   │ ✓ WhatsApp requirements                        │
   │ ✓ Character limits                             │
   │ ✓ Language completeness                        │
   └────────────────────────────────────────────────┘

4. Results:
   ├─> PASS: Allow save, ready for Meta submission
   ├─> WARNINGS: Allow save, show warnings to admin
   └─> ERRORS: Block save, show errors to fix

5. Before Meta Submission:
   └─> Run comprehensive validation
   └─> Check all language versions
   └─> Generate submission report

6. Periodic Validation:
   └─> Daily check of all templates
   └─> Identify templates needing updates
   └─> Alert admin of issues
```

### Expected Outcome

- TemplateValidator service created
- Validates template structure and content
- Checks parameter consistency
- Ensures WhatsApp API compliance
- Validates multilingual completeness
- Provides detailed validation reports
- Prevents template submission errors

### Verification Checklist

- [ ] TemplateValidator class created
- [ ] Template name validation implemented
- [ ] Parameter definition validation works
- [ ] Content structure validation complete
- [ ] Parameter consistency check functioning
- [ ] WhatsApp requirements verified
- [ ] Multilingual set validation added
- [ ] Comprehensive validate_template method works
- [ ] ValidationResult class defined
- [ ] Validation reports detailed and actionable
- [ ] Batch validation supported
- [ ] Integration with admin save process
- [ ] Unit tests cover validation rules

---

## Task 51: Create Template Admin Interface

### Overview

Create Django admin interface for managing MessageTemplate model. This interface allows administrators to create, view, edit, and manage WhatsApp message templates through Django's admin panel. The admin should provide intuitive forms, display parameter information clearly, show approval status, allow template testing with sample data, validate templates before saving, and provide bulk actions for template management. This is the primary interface for template CRUD operations.

### Dependencies

- Task 50: Template Validator created (for inline validation)
- Task 49: Param Substitution created (for preview)
- MessageTemplate model complete
- Django admin framework configured

### Instructions

1. **Register MessageTemplate in admin**
   - Open or create admin.py in notifications app
   - Import MessageTemplate model
   - Import necessary admin classes and decorators
   - Create MessageTemplateAdmin class
   - Register model with custom admin class

2. **Configure list display**
   - Set list_display fields for template list view
   - Show template_name, language, template_type
   - Display is_approved status with icon/color
   - Show approval_date if approved
   - Include created_at and updated_at timestamps
   - Add get_language_display for readable language

3. **Add list filters**
   - Create list_filter for sidebar filtering
   - Filter by template_type
   - Filter by language
   - Filter by is_approved status
   - Filter by created_at date hierarchy
   - Filter by template_category

4. **Implement search functionality**
   - Add search_fields for text search
   - Search by template_name
   - Search by template_content
   - Search by meta_template_id
   - Enable quick template lookup

5. **Customize form layout**
   - Override form using fieldsets
   - Group related fields logically:
     - Basic Info: name, type, language, category
     - Parameters: header_params, body_params
     - Content: template_content, components
     - Approval: is_approved, approval_date, meta_template_id
     - Timestamps: created_at, updated_at
   - Use appropriate widgets for JSON fields

6. **Add readonly fields**
   - Make created_at readonly
   - Make updated_at readonly
   - Show approval_date as readonly after approval
   - Display parameter count (custom readonly field)
   - Show template preview (custom readonly field)

7. **Implement custom admin actions**
   - Create "Validate Templates" bulk action
   - Create "Generate Preview" action
   - Create "Mark as Approved" action (careful!)
   - Create "Duplicate Template" action
   - Create "Export Templates" action

8. **Add inline validation**
   - Override save_model method
   - Run TemplateValidator before save
   - Display validation errors to admin
   - Prevent save if critical errors
   - Show warnings but allow save

9. **Create template preview**
   - Add custom admin view for preview
   - Accept sample parameter values
   - Use ParamSubstitution to generate preview
   - Display rendered template content
   - Show how message will appear

10. **Add helpful admin features**
    - Include inline help text for fields
    - Add links to WhatsApp documentation
    - Show parameter requirements
    - Display character counts
    - Provide template examples
    - Add change history (Django's built-in)

11. **Implement permission controls**
    - Restrict template approval to superusers
    - Allow staff to create/edit templates
    - Prevent deletion of approved templates
    - Log all template changes
    - Audit trail for compliance

12. **Add custom template list view enhancements**
    - Color-code approval status (green/yellow/red)
    - Show warning icons for validation issues
    - Display parameter count badges
    - Add quick actions in list view
    - Show language flags/icons

### Django Admin Configuration

```
┌────────────────────────────────────────────────────┐
│        MessageTemplateAdmin Structure               │
└────────────────────────────────────────────────────┘

@admin.register(MessageTemplate)
class MessageTemplateAdmin(admin.ModelAdmin):
    │
    ├─> List View Configuration
    │   ├─> list_display
    │   ├─> list_filter
    │   ├─> search_fields
    │   ├─> list_per_page
    │   └─> ordering
    │
    ├─> Form Configuration
    │   ├─> fieldsets
    │   ├─> readonly_fields
    │   ├─> autocomplete_fields
    │   └─> formfield_overrides
    │
    ├─> Actions
    │   ├─> validate_templates
    │   ├─> generate_preview
    │   ├─> duplicate_template
    │   └─> export_templates
    │
    ├─> Custom Methods
    │   ├─> save_model (validation)
    │   ├─> get_readonly_fields
    │   ├─> has_delete_permission
    │   └─> get_queryset
    │
    └─> Display Methods
        ├─> approval_status_display
        ├─> parameter_count_display
        ├─> preview_link
        └─> language_flag_display
```

### Admin List View Layout

```
┌────────────────────────────────────────────────────┐
│        Template List View                           │
└────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Filter:  Type ▼   Language ▼   Status ▼   Date ▼              │
│ Search:  [___________________________________] 🔍              │
├─────────────────────────────────────────────────────────────────┤
│ ☐ Template Name     │ Lang │ Type     │ Status      │ Updated │
├─────────────────────────────────────────────────────────────────┤
│ ☐ order_confirmation│ EN   │ ORDER    │ ✅ Approved│ Jan 30  │
│ ☐ order_confirmation│ SI   │ ORDER    │ ✅ Approved│ Jan 30  │
│ ☐ order_confirmation│ TA   │ ORDER    │ ⏳ Pending │ Jan 30  │
│ ☐ payment_success   │ EN   │ PAYMENT  │ ✅ Approved│ Jan 29  │
│ ☐ payment_failed    │ EN   │ PAYMENT  │ ⚠️ Issues  │ Jan 28  │
│ ☐ order_shipped     │ EN   │ SHIPPING │ ✅ Approved│ Jan 27  │
└─────────────────────────────────────────────────────────────────┘

Actions: [Validate Templates  ▼] [Go]   Bulk Actions Available

Legend:
✅ Approved and active
⏳ Pending Meta approval
⚠️ Validation issues
❌ Rejected or inactive
```

### Admin Form Layout

```
┌────────────────────────────────────────────────────┐
│        Template Edit Form                           │
└────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Basic Information                                │
├─────────────────────────────────────────────────┤
│ Template Name: [order_confirmation____________] │
│ Language:      [English (en)  ▼]                │
│ Template Type: [Order Confirmation ▼]           │
│ Category:      [Transactional ▼]                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Parameters                                       │
├─────────────────────────────────────────────────┤
│ Header Params: [["order_number"]____________]   │
│ Body Params:   [["customer_name",            ]  │
│                 "order_number",              ]  │
│                 "total_amount",              ]  │
│                 "tracking_url"]______________]  │
│                                                  │
│ 📊 Total Parameters: 5  (1 header, 4 body)     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Template Content                                 │
├─────────────────────────────────────────────────┤
│ [Order #{order_number} Confirmed               ] │
│ [                                              ] │
│ [Thank you {customer_name}! Your order        ] │
│ [#{order_number} totaling ₨{total_amount}    ] │
│ [has been confirmed. Track: {tracking_url}    ] │
│ [                                              ] │
│                                                  │
│ 📝 Character count: 156 / 1024                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Approval Status                                  │
├─────────────────────────────────────────────────┤
│ Approved:         ☑ Yes                         │
│ Approval Date:    Jan 30, 2026 10:45 AM        │
│ Meta Template ID: MSG_12345ABC                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Preview                                          │
├─────────────────────────────────────────────────┤
│ [Generate Preview with Sample Data]  [Preview]  │
│                                                  │
│ Sample Output:                                   │
│ ┌───────────────────────────────────────────┐  │
│ │ Order #12345 Confirmed                    │  │
│ │                                           │  │
│ │ Thank you Kasun! Your order #12345        │  │
│ │ totaling ₨5,250.00 has been confirmed.   │  │
│ │ Track: https://lcc.lk/track/12345        │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

[Save and continue editing] [Save] [Delete]
```

### Validation Integration

```
┌────────────────────────────────────────────────────┐
│        Admin Save with Validation                   │
└────────────────────────────────────────────────────┘

Admin clicks "Save"
    │
    ▼
Override save_model()
    │
    ├─> Run TemplateValidator
    │   └─> validator.validate_template(obj)
    │
    ├─> Check ValidationResult
    │   │
    │   ├─> Has Errors?
    │   │   ├─> YES: Block save
    │   │   │   └─> Show error messages
    │   │   │   └─> Highlight problem fields
    │   │   │
    │   │   └─> NO: Continue
    │   │
    │   └─> Has Warnings?
    │       ├─> YES: Show warning messages
    │       │   └─> Allow save with warnings
    │       │
    │       └─> NO: Clean save
    │
    ▼
Save to Database
    │
    ▼
Show Success Message
└─> "Template saved successfully"
    "⚠️ 2 warnings - review suggested changes"
```

### Custom Admin Actions

```
┌────────────────────────────────────────────────────┐
│        Bulk Actions                                 │
└────────────────────────────────────────────────────┘

1. Validate Templates
   └─> Run validator on selected templates
   └─> Show validation report
   └─> Highlight issues

2. Generate Multilingual Set
   └─> Copy template to other languages
   └─> Create si and ta versions
   └─> Placeholder for translation

3. Test with Sample Data
   └─> Provide sample parameters
   └─> Generate preview
   └─> Show rendered output

4. Export Templates
   └─> Export as JSON
   └─> Include all fields
   └─> Useful for backup/migration

5. Duplicate Template
   └─> Create copy of template
   └─> Change name/language
   └─> Quick template creation
```

### Expected Outcome

- MessageTemplate registered in Django admin
- Intuitive list view with filters and search
- Comprehensive edit form with validation
- Template preview functionality
- Bulk actions for management
- Inline validation prevents errors
- Permission controls protect approved templates
- User-friendly interface for non-technical admins

### Verification Checklist

- [ ] MessageTemplate registered in admin
- [ ] list_display shows key fields
- [ ] list_filter includes type, language, status
- [ ] search_fields enable text search
- [ ] Fieldsets organize form logically
- [ ] Readonly fields configured appropriately
- [ ] Validation runs on save
- [ ] Validation errors displayed clearly
- [ ] Template preview works
- [ ] Bulk actions implemented
- [ ] Permission controls functional
- [ ] Help text and documentation included
- [ ] Character counts displayed
- [ ] Approval status color-coded
- [ ] Change history available

---

## Task 52: Verify Templates

### Overview

Perform comprehensive verification of the entire template system to ensure all components work correctly together. This includes testing template retrieval by type and language, verifying parameter substitution functionality, testing the template builder API payload generation, validating all templates pass validation rules, confirming multilingual support works properly, testing templates in WhatsApp Business API sandbox, and ensuring admin interface is fully functional. This final verification ensures the template system is production-ready.

### Dependencies

- Task 51: Template Admin Interface created
- All previous template tasks (33-51) complete
- All templates created (English, Sinhala, Tamil)
- Template services implemented (Builder, Substitution, Validator)

### Instructions

1. **Verify template database records**
   - Check all 21 templates exist (7 types × 3 languages)
   - Confirm English templates approved
   - Verify Sinhala templates exist
   - Verify Tamil templates exist
   - Check unique constraints working
   - Validate no duplicate templates

2. **Test template retrieval**
   - Query templates by template_type
   - Query templates by language
   - Test combined type + language queries
   - Verify language fallback to English
   - Check sorting and ordering
   - Test filtering by approval status

3. **Verify parameter consistency**
   - For each template type, check all 3 languages
   - Ensure parameter names match across languages
   - Verify parameter count matches
   - Check header_params consistency
   - Check body_params consistency
   - Validate parameter order maintained

4. **Test TemplateBuilder service**
   - Test build_message for each template type
   - Try with English language
   - Try with Sinhala language
   - Try with Tamil language
   - Verify API payload format correct
   - Check all parameters included
   - Validate component structure

5. **Test ParamSubstitution service**
   - Generate previews for all templates
   - Test with sample order data
   - Verify parameter replacement works
   - Check multilingual substitution
   - Test missing parameter handling
   - Validate output formatting

6. **Run TemplateValidator**
   - Validate all 21 templates
   - Check for any validation errors
   - Review warnings
   - Ensure all pass critical rules
   - Verify multilingual set completeness
   - Generate validation report

7. **Test admin interface**
   - Access template list view
   - Test filters (type, language, status)
   - Test search functionality
   - Edit existing template
   - Create new test template
   - Test bulk actions
   - Generate preview from admin
   - Test validation on save

8. **Verify WhatsApp API compatibility**
   - Format sample message payloads
   - Validate against WhatsApp API schema
   - Test in WhatsApp Business API sandbox (if available)
   - Send test message for each template type
   - Verify parameters substitute correctly
   - Check multilingual message rendering

9. **Test end-to-end flow**
   - Simulate order confirmation scenario
   - Select appropriate template (type + language)
   - Build message with real order data
   - Validate message structure
   - Confirm ready for sending
   - Repeat for other template types

10. **Create verification report**
    - Document all tests performed
    - List any issues found
    - Record test results (pass/fail)
    - Include screenshots if helpful
    - Provide recommendations
    - Mark system as production-ready or list blockers

### Verification Checklist Matrix

```
┌────────────────────────────────────────────────────┐
│        Template System Verification Matrix          │
└────────────────────────────────────────────────────┘

TEMPLATE DATABASE
┌──────────────────────────────────────────────────┐
│ ☐ All 7 English templates exist                 │
│ ☐ All 7 Sinhala templates exist                 │
│ ☐ All 7 Tamil templates exist                   │
│ ☐ Total: 21 templates in database               │
│ ☐ Unique constraints enforced                   │
│ ☐ No duplicate templates                        │
└──────────────────────────────────────────────────┘

PARAMETER CONSISTENCY
┌──────────────────────────────────────────────────┐
│ ☐ order_confirmation: en/si/ta match            │
│ ☐ payment_success: en/si/ta match               │
│ ☐ payment_failed: en/si/ta match                │
│ ☐ order_shipped: en/si/ta match                 │
│ ☐ out_for_delivery: en/si/ta match              │
│ ☐ order_delivered: en/si/ta match               │
│ ☐ cod_reminder: en/si/ta match                  │
└──────────────────────────────────────────────────┘

TEMPLATE BUILDER
┌──────────────────────────────────────────────────┐
│ ☐ Retrieves correct template by type            │
│ ☐ Language selection works                      │
│ ☐ Language fallback to English works            │
│ ☐ Parameter validation works                    │
│ ☐ Header component builds correctly             │
│ ☐ Body component builds correctly               │
│ ☐ API payload format valid                      │
│ ☐ JSON serializable output                      │
└──────────────────────────────────────────────────┘

PARAMETER SUBSTITUTION
┌──────────────────────────────────────────────────┐
│ ☐ Placeholder extraction works                  │
│ ☐ Parameter substitution replaces correctly     │
│ ☐ Works with English templates                  │
│ ☐ Works with Sinhala templates                  │
│ ☐ Works with Tamil templates                    │
│ ☐ Missing parameter handling works              │
│ ☐ Preview generation functional                 │
└──────────────────────────────────────────────────┘

TEMPLATE VALIDATOR
┌──────────────────────────────────────────────────┐
│ ☐ All templates pass validation                 │
│ ☐ Name validation works                         │
│ ☐ Parameter validation works                    │
│ ☐ Content validation works                      │
│ ☐ Consistency check works                       │
│ ☐ WhatsApp requirement check works              │
│ ☐ Multilingual set validation works             │
│ ☐ Validation reports accurate                   │
└──────────────────────────────────────────────────┘

ADMIN INTERFACE
┌──────────────────────────────────────────────────┐
│ ☐ Template list displays correctly              │
│ ☐ Filters work (type, language, status)         │
│ ☐ Search finds templates                        │
│ ☐ Edit form loads properly                      │
│ ☐ Create new template works                     │
│ ☐ Validation on save works                      │
│ ☐ Preview generation works                      │
│ ☐ Bulk actions functional                       │
│ ☐ Permission controls work                      │
└──────────────────────────────────────────────────┘

END-TO-END TESTING
┌──────────────────────────────────────────────────┐
│ ☐ Order confirmation flow works                 │
│ ☐ Payment success flow works                    │
│ ☐ Payment failed flow works                     │
│ ☐ Shipped notification flow works               │
│ ☐ Out for delivery flow works                   │
│ ☐ Delivered notification flow works             │
│ ☐ COD reminder flow works                       │
└──────────────────────────────────────────────────┘
```

### Test Scenarios

```
┌────────────────────────────────────────────────────┐
│        End-to-End Test Scenarios                    │
└────────────────────────────────────────────────────┘

Scenario 1: English Order Confirmation
─────────────────────────────────────────────────────
1. Customer places order (English interface)
2. System determines customer language: "en"
3. TemplateBuilder.build_message(
     type="ORDER_CONFIRMATION",
     language="en",
     params={order data}
   )
4. Payload generated correctly
5. Message ready to send via WhatsApp API
✓ Expected: English template used

Scenario 2: Sinhala COD Reminder
─────────────────────────────────────────────────────
1. Customer has COD order (preferred language: si)
2. 2 hours before delivery
3. TemplateBuilder.build_message(
     type="COD_REMINDER",
     language="si",
     params={order data, amount}
   )
4. Sinhala template retrieved
5. Parameters substituted in Sinhala context
6. Message ready to send
✓ Expected: Sinhala template with correct params

Scenario 3: Tamil with Missing Translation
─────────────────────────────────────────────────────
1. Customer prefers Tamil (ta)
2. New template type only has English
3. TemplateBuilder.build_message(
     type="NEW_TEMPLATE",
     language="ta",
     params={data}
   )
4. Tamil template not found
5. System falls back to English
6. Warning logged for missing translation
✓ Expected: English template used, warning logged

Scenario 4: Template Preview in Admin
─────────────────────────────────────────────────────
1. Admin opens template edit page
2. Clicks "Generate Preview"
3. Enters sample parameter values
4. ParamSubstitution generates preview
5. Rendered message displayed
6. Admin verifies message content
✓ Expected: Accurate preview shown
```

### Verification Report Template

```
┌────────────────────────────────────────────────────┐
│        Template System Verification Report          │
└────────────────────────────────────────────────────┘

Project: LankaCommerce Cloud
Component: WhatsApp Template Message System
Date: [Verification Date]
Verified By: [Admin Name]

EXECUTIVE SUMMARY
─────────────────────────────────────────────────────
Total Templates: 21 (7 types × 3 languages)
Templates Validated: 21 / 21
Validation Pass Rate: 100%
Critical Issues: 0
Warnings: [count]
System Status: ✅ PRODUCTION READY

COMPONENT STATUS
─────────────────────────────────────────────────────
✅ MessageTemplate Model         [PASS]
✅ Template Database             [PASS]
✅ TemplateBuilder Service       [PASS]
✅ ParamSubstitution Service     [PASS]
✅ TemplateValidator Service     [PASS]
✅ Django Admin Interface        [PASS]
✅ WhatsApp API Compatibility    [PASS]

LANGUAGE COVERAGE
─────────────────────────────────────────────────────
English (en):   7/7 templates ✅
Sinhala (si):   7/7 templates ✅
Tamil (ta):     7/7 templates ✅

TEMPLATE TYPES VERIFIED
─────────────────────────────────────────────────────
✅ ORDER_CONFIRMATION   (3 languages)
✅ PAYMENT_SUCCESS      (3 languages)
✅ PAYMENT_FAILED       (3 languages)
✅ SHIPPED              (3 languages)
✅ OUT_FOR_DELIVERY     (3 languages)
✅ DELIVERED            (3 languages)
✅ COD_REMINDER         (3 languages)

TESTING RESULTS
─────────────────────────────────────────────────────
Template Retrieval:       [PASS]
Parameter Validation:     [PASS]
Multilingual Support:     [PASS]
API Payload Generation:   [PASS]
Preview Generation:       [PASS]
Admin Interface:          [PASS]
End-to-End Flows:         [PASS]

KNOWN ISSUES
─────────────────────────────────────────────────────
[List any issues found or write "None"]

RECOMMENDATIONS
─────────────────────────────────────────────────────
1. Submit English templates to Meta for approval
2. Submit Sinhala templates after English approved
3. Submit Tamil templates after English approved
4. Monitor template performance in production
5. Collect feedback for template improvements

APPROVAL
─────────────────────────────────────────────────────
☐ System ready for Meta approval submission
☐ System ready for production deployment
☐ Additional work needed (see issues)

Verified by: ________________  Date: ___________
Approved by: ________________  Date: ___________
```

### Expected Outcome

- All 21 templates verified and functional
- Template retrieval works correctly
- Parameter substitution tested
- Template builder generates valid payloads
- Validator passes all templates
- Admin interface fully operational
- System ready for Meta approval submission
- Comprehensive verification report completed

### Verification Checklist

- [ ] All 21 templates exist in database
- [ ] Parameter consistency verified across languages
- [ ] Template retrieval tested (type, language)
- [ ] Language fallback tested and works
- [ ] TemplateBuilder generates correct payloads
- [ ] ParamSubstitution works with all languages
- [ ] TemplateValidator passes all templates
- [ ] Admin list view functional
- [ ] Admin edit form functional
- [ ] Admin preview works
- [ ] Bulk actions tested
- [ ] End-to-end flows tested for all types
- [ ] WhatsApp API payload format validated
- [ ] Test messages sent successfully (if sandbox available)
- [ ] Verification report created
- [ ] System marked production-ready or issues documented

---

## Summary

This document completed the template message system with the seventh and final template (COD Reminder), translations for all templates into Sinhala and Tamil for comprehensive multilingual support, the TemplateBuilder service for constructing WhatsApp API payloads, parameter substitution capabilities for preview and testing, comprehensive template validation to prevent errors, Django admin interface for template management, and thorough system verification to ensure production readiness.

The template system now supports three languages (English, Sinhala, Tamil), covers the complete order lifecycle from confirmation to delivery, integrates with WhatsApp Business API standards, provides tools for template management and testing, and is ready for submission to Meta for approval. Once approved, the system can send automated, localized notifications to customers throughout their order journey.
