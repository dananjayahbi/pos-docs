# Tasks 17-27: IntentClassifier and Intent Definitions

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** B - Intent Classification  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-A_Chatbot-Models](../Group-A_Chatbot-Models/)
- **→ Next Document:** [02_Tasks-28-34_Training-Hybrid.md](02_Tasks-28-34_Training-Hybrid.md)

---

## Document Overview

This document covers the creation of the IntentClassifier abstract base class and all intent definitions for the chatbot system. It establishes the foundational structure for intent classification, including the classifier interface with classify and get_confidence methods, and defines eight core intents: ORDER_STATUS, PRODUCT_INFO, RETURNS, SHIPPING, STORE_INFO, GREETING, FAREWELL, and ESCALATE.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create IntentClassifier | High | 45 min |
| 18 | Create classify Method | Medium | 30 min |
| 19 | Create get_confidence Method | Low | 20 min |
| 20 | Create ORDER_STATUS Intent | Low | 15 min |
| 21 | Create PRODUCT_INFO Intent | Low | 15 min |
| 22 | Create RETURNS Intent | Low | 15 min |
| 23 | Create SHIPPING Intent | Low | 15 min |
| 24 | Create STORE_INFO Intent | Low | 15 min |
| 25 | Create GREETING Intent | Low | 15 min |
| 26 | Create FAREWELL Intent | Low | 15 min |
| 27 | Create ESCALATE Intent | Low | 15 min |

---

## Task 17: Create IntentClassifier

### Overview
Create the abstract base class IntentClassifier that defines the interface for all intent classification implementations. This class establishes the contract that all concrete classifiers (embedding, rule-based, hybrid) must follow, ensuring consistent behavior across different classification strategies.

### Dependencies
- Task 16: Create Conversation Context (Group A)
- Python ABC (Abstract Base Classes) module
- Django models and utilities

### Instructions

1. **Create classifier module**
   - Navigate to `backend/apps/chatbot/classification/` directory
   - Create new file named `classifier.py`
   - This will contain the abstract classifier interface

2. **Import required dependencies**
   - Import ABC and abstractmethod from abc module
   - Import typing for type hints (Tuple, Optional)
   - Import Django utilities if needed

3. **Define IntentClassifier abstract class**
   - Create IntentClassifier class inheriting from ABC
   - Mark as abstract to prevent direct instantiation
   - This class defines the interface for classifiers

4. **Add class documentation**
   - Add comprehensive docstring explaining purpose
   - Document the classification contract
   - Explain expected behavior of subclasses

5. **Define abstract methods**
   - Declare classify method (to be implemented in Task 18)
   - Declare get_confidence method (to be implemented in Task 19)
   - Mark both methods with @abstractmethod decorator

6. **Add type hints**
   - Use proper type hints for all method signatures
   - Ensure return types are clearly specified
   - Add Optional and Tuple where appropriate

### Classifier Interface Contract

| Method | Purpose | Return Type |
|--------|---------|-------------|
| classify | Determine intent and confidence | Tuple[str, float] |
| get_confidence | Calculate confidence for specific intent | float |

### Abstract Class Purpose

| Feature | Benefit |
|---------|---------|
| Interface Contract | All classifiers follow same API |
| Type Safety | Clear method signatures |
| Polymorphism | Swap implementations easily |
| Extensibility | Add new classifiers without breaking code |

### Classification Architecture

```
IntentClassifier (Abstract)
        │
        ├─────────────────┬─────────────────┐
        │                 │                 │
EmbeddingClassifier  RuleBasedClassifier  HybridClassifier
   (Task 30)            (Task 31)          (Task 32)
```

### Expected Outcome
- Abstract base class IntentClassifier created
- Clear interface for classification methods
- Foundation for concrete implementations
- Type-safe method signatures

### Verification Checklist
- [ ] `backend/apps/chatbot/classification/classifier.py` created
- [ ] IntentClassifier class inherits from ABC
- [ ] Abstract methods declared with @abstractmethod
- [ ] Type hints added for all signatures
- [ ] Class docstring added

---

## Task 18: Create classify Method

### Overview
Define the classify abstract method in IntentClassifier. This method takes user text as input and returns a tuple containing the identified intent name and the confidence score. All concrete classifier implementations must provide their own version of this method.

### Dependencies
- Task 17: Create IntentClassifier

### Instructions

1. **Locate IntentClassifier class**
   - Open `backend/apps/chatbot/classification/classifier.py`
   - Find the IntentClassifier abstract class

2. **Define classify method signature**
   - Add method named `classify`
   - Accept `text` parameter of type string
   - Mark with @abstractmethod decorator

3. **Specify return type**
   - Return type is Tuple[str, float]
   - First element: intent name (string)
   - Second element: confidence score (float 0.0-1.0)

4. **Add method documentation**
   - Write comprehensive docstring
   - Explain input parameter (text to classify)
   - Explain return values (intent and confidence)
   - Provide examples of expected behavior

5. **Add parameter documentation**
   - Document text parameter: user input message
   - Document return: (intent_name, confidence_score)
   - Note confidence range: 0.0 (no match) to 1.0 (perfect match)

6. **Define method behavior contract**
   - Method must analyze input text
   - Must determine most likely intent
   - Must calculate confidence score
   - Must handle empty or invalid input gracefully

### Method Signature

| Parameter | Type | Description |
|-----------|------|-------------|
| text | str | User message to classify |
| **Return** | Tuple[str, float] | (intent_name, confidence) |

### Return Value Components

| Component | Type | Range | Description |
|-----------|------|-------|-------------|
| intent_name | str | N/A | Name of identified intent (e.g., "ORDER_STATUS") |
| confidence | float | 0.0-1.0 | Confidence score of classification |

### Confidence Score Interpretation

| Range | Interpretation | Action |
|-------|----------------|--------|
| 0.9-1.0 | Very confident | Use result directly |
| 0.7-0.9 | Confident | Use result, log for review |
| 0.5-0.7 | Uncertain | Consider fallback strategy |
| 0.0-0.5 | Not confident | Use default/escalate |

### Classification Behavior Examples

| Input Text | Expected Intent | Typical Confidence |
|------------|----------------|-------------------|
| "Where is my order?" | ORDER_STATUS | 0.95 |
| "Tell me about this product" | PRODUCT_INFO | 0.90 |
| "I want to return this" | RETURNS | 0.92 |
| "Hello" | GREETING | 0.98 |
| "Customer service please" | ESCALATE | 0.85 |

### Expected Outcome
- Abstract classify method defined
- Clear input/output contract established
- Documentation explains expected behavior
- Foundation for concrete implementations

### Verification Checklist
- [ ] classify method added to IntentClassifier
- [ ] Method marked with @abstractmethod
- [ ] Return type is Tuple[str, float]
- [ ] Comprehensive docstring added
- [ ] Parameter and return documented

---

## Task 19: Create get_confidence Method

### Overview
Define the get_confidence abstract method in IntentClassifier. This method calculates the confidence score for a specific intent given a user message. Unlike classify which returns the best match, this method evaluates how well the text matches a particular intent, useful for threshold-based decisions and multi-intent scenarios.

### Dependencies
- Task 18: Create classify Method

### Instructions

1. **Locate IntentClassifier class**
   - Open `backend/apps/chatbot/classification/classifier.py`
   - Find the IntentClassifier abstract class

2. **Define get_confidence method signature**
   - Add method named `get_confidence`
   - Accept `text` parameter (user message)
   - Accept `intent` parameter (intent to evaluate)
   - Mark with @abstractmethod decorator

3. **Specify return type**
   - Return type is float
   - Range: 0.0 (no match) to 1.0 (perfect match)
   - Represents match strength for specific intent

4. **Add method documentation**
   - Write comprehensive docstring
   - Explain both input parameters
   - Explain confidence calculation
   - Provide usage examples

5. **Document use cases**
   - Threshold-based filtering
   - Multi-intent detection
   - Confidence comparison across intents
   - Fallback strategy decisions

6. **Define behavior expectations**
   - Must return value between 0.0 and 1.0
   - Higher score means better match
   - Should handle unknown intents gracefully
   - Should return 0.0 for clear mismatches

### Method Signature

| Parameter | Type | Description |
|-----------|------|-------------|
| text | str | User message to evaluate |
| intent | str | Intent name to check against |
| **Return** | float | Confidence score (0.0-1.0) |

### Use Cases

| Use Case | Description | Example |
|----------|-------------|---------|
| Threshold Filter | Only proceed if confidence > threshold | `if get_confidence(text, "ORDER_STATUS") > 0.8` |
| Multi-Intent | Detect multiple intents in one message | Check all intents, return those > 0.6 |
| Comparison | Compare which of two intents fits better | Compare ORDER_STATUS vs SHIPPING |
| Validation | Verify classify result | Cross-check top intent confidence |

### Confidence Calculation Considerations

| Factor | Impact on Score |
|--------|----------------|
| Keyword Match | Presence of intent-specific keywords |
| Semantic Similarity | Meaning alignment with training phrases |
| Context Relevance | Relevance to intent domain |
| Phrase Structure | Grammar and phrasing patterns |

### Example Evaluations

| Text | Intent | Expected Confidence | Reasoning |
|------|--------|-------------------|-----------|
| "Where is my order #12345?" | ORDER_STATUS | 0.95 | Direct match with order reference |
| "Where is my order #12345?" | SHIPPING | 0.40 | Related but not primary intent |
| "Where is my order #12345?" | GREETING | 0.05 | No relevance |
| "Track my delivery" | ORDER_STATUS | 0.85 | Similar to order tracking |
| "Track my delivery" | SHIPPING | 0.75 | Also related to delivery |

### Method vs classify Difference

| Aspect | classify Method | get_confidence Method |
|--------|----------------|----------------------|
| Purpose | Find best intent | Evaluate specific intent |
| Input | Text only | Text + intent name |
| Output | (intent, confidence) | confidence only |
| Use Case | Primary classification | Validation, filtering |

### Expected Outcome
- Abstract get_confidence method defined
- Clear evaluation contract established
- Documentation explains use cases
- Foundation for confidence-based logic

### Verification Checklist
- [ ] get_confidence method added to IntentClassifier
- [ ] Method marked with @abstractmethod
- [ ] Two parameters: text and intent
- [ ] Return type is float (0.0-1.0)
- [ ] Comprehensive docstring added
- [ ] Use cases documented

---

## Task 20: Create ORDER_STATUS Intent

### Overview
Define the ORDER_STATUS intent for handling order tracking and status inquiries. This intent is triggered when customers want to check the status of their orders, track shipments, or get updates on order delivery. It's one of the most common intents in e-commerce chatbots.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Create intent definition module**
   - Create or locate `backend/apps/chatbot/intents.py` file
   - This file will contain all intent definitions
   - Use Django choices or constants pattern

2. **Define ORDER_STATUS intent constant**
   - Create constant named `ORDER_STATUS`
   - Use string value "ORDER_STATUS"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "ORDER_STATUS"
   - Define display name: "Order Status & Tracking"
   - Define description: "Questions about order status, tracking, and delivery updates"
   - Define category: "Orders"

4. **Document intent scope**
   - Include order tracking queries
   - Include status check requests
   - Include delivery time inquiries
   - Include order number lookups

5. **Define expected entities**
   - Order number (extracted in Group C)
   - Tracking number (optional)
   - Customer reference (optional)

6. **List keyword indicators**
   - Document common keywords that trigger this intent
   - Include variations and synonyms
   - Consider misspellings and abbreviations

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | ORDER_STATUS |
| **Display Name** | Order Status & Tracking |
| **Category** | Orders |
| **Priority** | High |
| **Requires Auth** | Yes (user-specific orders) |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Where is my order | 0.95+ |
| Track my order | 0.95+ |
| Order status | 0.95+ |
| Where is order #12345 | 0.98+ |
| When will my order arrive | 0.90+ |
| Has my order shipped | 0.92+ |
| Check order delivery | 0.90+ |
| Track shipment | 0.88+ |
| Order tracking number | 0.92+ |
| My order status please | 0.95+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Primary | order, status, track, tracking |
| Secondary | shipment, delivery, shipped, arrive |
| Identifiers | order #, order number, tracking # |
| Actions | check, where, when, find |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| order_number | string | Yes | "#12345", "12345" |
| tracking_number | string | No | "TRACK123456" |
| date_reference | date | No | "ordered yesterday" |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Direct Status | "order status", "check my order" |
| Location | "where is my order", "where's my package" |
| Timing | "when will it arrive", "delivery date" |
| With Identifier | "order #12345 status", "track order 67890" |
| Shipped Check | "has it shipped", "did my order ship" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| Order Found | Show current status, tracking link, estimated delivery |
| Multiple Orders | Ask user to specify which order |
| No Order Found | Ask for order number, suggest checking email |
| Not Logged In | Prompt to log in or enter order details |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| SHIPPING | Often confused | Check for tracking/delivery vs shipping cost/options |
| RETURNS | Sometimes related | If status is "delivered", may lead to return inquiry |
| PRODUCT_INFO | Different focus | Product questions vs order questions |

### Expected Outcome
- ORDER_STATUS intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Entity expectations defined

### Verification Checklist
- [ ] ORDER_STATUS constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Orders)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Expected entities documented

---

## Task 21: Create PRODUCT_INFO Intent

### Overview
Define the PRODUCT_INFO intent for handling product information requests, availability checks, pricing inquiries, and feature questions. This intent is triggered when customers want to learn more about products, check specifications, compare options, or verify availability.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add PRODUCT_INFO intent alongside ORDER_STATUS
   - Maintain consistent structure

2. **Define PRODUCT_INFO intent constant**
   - Create constant named `PRODUCT_INFO`
   - Use string value "PRODUCT_INFO"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "PRODUCT_INFO"
   - Define display name: "Product Information"
   - Define description: "Questions about product details, availability, pricing, and features"
   - Define category: "Products"

4. **Document intent scope**
   - Include product detail inquiries
   - Include availability checks
   - Include pricing questions
   - Include feature/specification requests
   - Include comparison questions

5. **Define expected entities**
   - Product name or SKU (extracted in Group C)
   - Product category (optional)
   - Price range (optional)
   - Specific attribute (optional)

6. **List keyword indicators**
   - Document product-related keywords
   - Include question patterns
   - Consider variations and synonyms

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | PRODUCT_INFO |
| **Display Name** | Product Information |
| **Category** | Products |
| **Priority** | High |
| **Requires Auth** | No (public information) |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Tell me about this product | 0.95+ |
| Is this available | 0.90+ |
| Product details | 0.95+ |
| How much is this | 0.92+ |
| What are the features | 0.93+ |
| Do you have [product name] | 0.90+ |
| Product specifications | 0.95+ |
| Tell me more | 0.85+ |
| What's the price | 0.92+ |
| Is this in stock | 0.90+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Primary | product, item, details, information |
| Availability | available, stock, in stock, out of stock |
| Pricing | price, cost, how much, expensive, cheap |
| Features | features, specifications, specs, details |
| Questions | what, which, does it, can it, is it |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| product_name | string | Yes/No | "iPhone 13", "laptop" |
| product_sku | string | No | "SKU12345" |
| attribute | string | No | "color", "size", "weight" |
| price_range | range | No | "under $500" |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| General Info | "tell me about this", "product info" |
| Availability | "is this available", "in stock", "can I buy" |
| Pricing | "how much", "what's the price", "cost" |
| Features | "what features", "specifications", "does it have" |
| Comparison | "better than", "difference between", "compare" |
| Specific Attribute | "what colors", "what sizes", "weight" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| Product Identified | Show details, price, availability, features |
| Multiple Products | Ask user to specify which product |
| Not Available | Show alternatives, suggest similar products |
| Price Inquiry | Show current price, promotions, discounts |
| Feature Request | List key features, specifications |
| Comparison | Show side-by-side comparison |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| ORDER_STATUS | Different focus | Product info vs order status |
| STORE_INFO | May overlap | Product-specific vs general store info |
| RETURNS | May follow | Product details may lead to return inquiry |

### Common Product Questions

| Question Category | Examples |
|------------------|----------|
| Basic Info | "What is this", "Tell me about" |
| Technical Specs | "Processor speed", "Battery life", "Dimensions" |
| Compatibility | "Works with", "Compatible with" |
| Usage | "How to use", "What's it for" |
| Quality | "Is it good", "Reviews", "Rating" |
| Warranty | "Warranty period", "Guarantee" |

### Expected Outcome
- PRODUCT_INFO intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Entity expectations defined
- Response strategies outlined

### Verification Checklist
- [ ] PRODUCT_INFO constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Products)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Expected entities documented
- [ ] Response strategies defined

---

## Task 22: Create RETURNS Intent

### Overview
Define the RETURNS intent for handling return requests, refund inquiries, and exchange questions. This intent is triggered when customers want to return products, request refunds, initiate exchanges, or inquire about return policies. It's a critical intent for customer satisfaction and retention.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add RETURNS intent to intent definitions
   - Maintain consistent structure

2. **Define RETURNS intent constant**
   - Create constant named `RETURNS`
   - Use string value "RETURNS"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "RETURNS"
   - Define display name: "Returns & Refunds"
   - Define description: "Requests for returns, refunds, exchanges, and return policy information"
   - Define category: "Customer Service"

4. **Document intent scope**
   - Include return initiation requests
   - Include refund inquiries
   - Include exchange requests
   - Include return policy questions
   - Include return status checks

5. **Define expected entities**
   - Order number (for return request)
   - Product name/SKU (for specific item)
   - Reason for return (optional)
   - Return timeframe (optional)

6. **List keyword indicators**
   - Document return-related keywords
   - Include refund and exchange terms
   - Consider policy inquiry patterns

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | RETURNS |
| **Display Name** | Returns & Refunds |
| **Category** | Customer Service |
| **Priority** | High |
| **Requires Auth** | Yes (user orders required) |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Return policy | 0.95+ |
| Want to return | 0.95+ |
| Refund request | 0.95+ |
| Exchange item | 0.93+ |
| Return my order | 0.95+ |
| How do I return | 0.92+ |
| Can I return this | 0.93+ |
| Get my money back | 0.90+ |
| Return and refund | 0.95+ |
| Exchange for different size | 0.90+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Primary | return, refund, exchange |
| Actions | return, send back, get back, swap |
| Outcome | money back, refund, reimbursement |
| Policy | policy, how to return, can I return |
| Status | return status, refund status |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| order_number | string | Yes | "#12345" |
| product_name | string | No | "Blue T-shirt" |
| return_reason | string | No | "wrong size", "damaged" |
| action_type | enum | No | "return", "exchange", "refund" |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Policy Inquiry | "return policy", "can I return", "return window" |
| Return Request | "want to return", "return this order", "send it back" |
| Refund Request | "get refund", "money back", "refund request" |
| Exchange Request | "exchange for", "swap for", "different size" |
| Return Status | "return status", "refund status", "when will I get refund" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| Policy Inquiry | Show return policy, timeframe, conditions |
| Return Initiation | Guide through return process, provide RMA |
| Order Too Old | Inform about policy, offer alternatives |
| Non-returnable Item | Explain policy, suggest alternatives |
| Exchange Request | Guide to exchange process, check availability |
| Return Status | Show current return/refund status |

### Return Categories

| Category | Description | Common Reasons |
|----------|-------------|----------------|
| Standard Return | Within return window, standard items | Changed mind, not as expected |
| Defective Return | Damaged or defective product | Broken, doesn't work, damaged |
| Exchange | Swap for different variant | Wrong size, wrong color |
| Refund Only | Money back without replacement | Dissatisfied, duplicate order |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| ORDER_STATUS | Often related | May check order before return |
| PRODUCT_INFO | May precede | Questions before return decision |
| ESCALATE | May escalate | Complex return situations |
| SHIPPING | May confuse | Return shipping vs original shipping |

### Policy-Related Questions

| Question Type | Examples |
|--------------|----------|
| Timeframe | "How long do I have", "Return window" |
| Conditions | "What can I return", "Return requirements" |
| Cost | "Free returns", "Who pays shipping" |
| Process | "How to return", "Return steps" |
| Refund Time | "When will I get money back", "Refund processing" |

### Expected Outcome
- RETURNS intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Entity expectations defined
- Response strategies outlined
- Policy-related handling defined

### Verification Checklist
- [ ] RETURNS constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Customer Service)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Expected entities documented
- [ ] Return categories identified
- [ ] Response strategies defined

---

## Task 23: Create SHIPPING Intent

### Overview
Define the SHIPPING intent for handling shipping-related inquiries including delivery times, shipping costs, shipping options, and general shipping policy questions. This intent differs from ORDER_STATUS by focusing on shipping methods and policies rather than specific order tracking.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add SHIPPING intent to intent definitions
   - Maintain consistent structure

2. **Define SHIPPING intent constant**
   - Create constant named `SHIPPING`
   - Use string value "SHIPPING"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "SHIPPING"
   - Define display name: "Shipping Information"
   - Define description: "Questions about shipping options, costs, delivery times, and shipping policies"
   - Define category: "Logistics"

4. **Document intent scope**
   - Include shipping cost inquiries
   - Include delivery time questions
   - Include shipping option queries
   - Include shipping policy questions
   - Include international shipping inquiries

5. **Define expected entities**
   - Location/address (for shipping calculation)
   - Shipping method (express, standard, etc.)
   - Country/region (for international)
   - Product reference (optional)

6. **List keyword indicators**
   - Document shipping-related keywords
   - Include delivery and freight terms
   - Consider policy inquiry patterns

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | SHIPPING |
| **Display Name** | Shipping Information |
| **Category** | Logistics |
| **Priority** | Medium |
| **Requires Auth** | No (general information) |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Delivery time | 0.90+ |
| Shipping cost | 0.95+ |
| Free delivery | 0.92+ |
| How long for delivery | 0.90+ |
| Shipping options | 0.95+ |
| Do you ship to [location] | 0.93+ |
| Express shipping | 0.95+ |
| Delivery fees | 0.92+ |
| International shipping | 0.95+ |
| Standard delivery | 0.93+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Primary | shipping, delivery, ship, deliver |
| Cost | cost, fee, price, charge, free |
| Time | how long, when, time, days, fast |
| Methods | express, standard, overnight, rush |
| Location | international, to [country], address |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| location | string | No | "New York", "UK", "Colombo" |
| shipping_method | enum | No | "express", "standard" |
| country | string | No | "Sri Lanka", "USA" |
| timeframe | duration | No | "2 days", "next week" |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Cost Inquiry | "shipping cost", "how much to ship", "delivery fee" |
| Time Inquiry | "how long", "delivery time", "when will it arrive" |
| Method Inquiry | "shipping options", "express delivery", "fastest shipping" |
| Location | "ship to UK", "international delivery", "do you deliver to" |
| Free Shipping | "free delivery", "free shipping threshold", "no shipping cost" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| General Cost | Show standard shipping rates, free shipping threshold |
| Specific Location | Calculate shipping to location, show options |
| Delivery Time | Show estimated delivery times by method |
| International | Show international options, customs info |
| Free Shipping | Show threshold, current cart status |
| Method Comparison | Compare standard vs express options |

### Shipping Categories

| Category | Description | Typical Timeframe |
|----------|-------------|------------------|
| Standard | Regular shipping | 5-7 business days |
| Express | Fast delivery | 2-3 business days |
| Overnight | Next day delivery | 1 business day |
| International | Cross-border | 7-14 business days |
| Free | No-cost shipping | Usually standard time |

### Intent Differentiation

| SHIPPING vs ORDER_STATUS |
|--------------------------|
| **SHIPPING:** "How much does shipping cost?" |
| **ORDER_STATUS:** "Where is my order?" |
| **SHIPPING:** "How long does delivery take?" |
| **ORDER_STATUS:** "When will order #12345 arrive?" |
| **SHIPPING:** "Do you ship to UK?" |
| **ORDER_STATUS:** "Track my shipment" |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| ORDER_STATUS | Often confused | Distinguish between general shipping info vs specific order tracking |
| PRODUCT_INFO | May follow | Product questions may lead to shipping inquiry |
| STORE_INFO | May overlap | Store policies include shipping policies |

### Shipping Policy Questions

| Question Type | Examples |
|--------------|----------|
| Coverage | "Where do you ship", "Do you ship internationally" |
| Cost Structure | "Flat rate", "Free shipping minimum", "Shipping calculator" |
| Timeframe | "Delivery time", "Processing time", "Business days" |
| Methods | "Shipping carriers", "Delivery options", "Express available" |
| Restrictions | "What can't be shipped", "Prohibited items" |

### Expected Outcome
- SHIPPING intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Entity expectations defined
- Differentiation from ORDER_STATUS clarified
- Response strategies outlined

### Verification Checklist
- [ ] SHIPPING constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Logistics)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Expected entities documented
- [ ] Differentiation from ORDER_STATUS documented
- [ ] Shipping categories defined

---

## Task 24: Create STORE_INFO Intent

### Overview
Define the STORE_INFO intent for handling general store information requests including contact details, business hours, location information, payment methods, and general policies. This intent serves as a catch-all for general business information that doesn't fit other specific intents.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add STORE_INFO intent to intent definitions
   - Maintain consistent structure

2. **Define STORE_INFO intent constant**
   - Create constant named `STORE_INFO`
   - Use string value "STORE_INFO"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "STORE_INFO"
   - Define display name: "Store Information"
   - Define description: "Questions about store details, contact info, hours, location, and general policies"
   - Define category: "General"

4. **Document intent scope**
   - Include contact information requests
   - Include business hours inquiries
   - Include location/address questions
   - Include payment method queries
   - Include general policy questions

5. **Define expected entities**
   - Information type (hours, contact, location)
   - Store location (for multi-store businesses)
   - Contact method preference (phone, email)

6. **List keyword indicators**
   - Document store-related keywords
   - Include contact and location terms
   - Consider policy inquiry patterns

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | STORE_INFO |
| **Display Name** | Store Information |
| **Category** | General |
| **Priority** | Low |
| **Requires Auth** | No (public information) |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Store hours | 0.95+ |
| Contact number | 0.95+ |
| Store location | 0.95+ |
| Working hours | 0.95+ |
| Email address | 0.95+ |
| Phone number | 0.95+ |
| When are you open | 0.92+ |
| Where are you located | 0.93+ |
| How to contact | 0.90+ |
| Payment methods | 0.90+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Primary | store, shop, business, company |
| Hours | hours, open, close, working hours |
| Contact | contact, phone, email, call, reach |
| Location | location, address, where, find |
| Payment | payment, accept, pay, methods |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| info_type | enum | Yes | "hours", "contact", "location" |
| contact_method | enum | No | "phone", "email" |
| store_location | string | No | "Colombo store" |
| day_of_week | string | No | "Monday", "weekend" |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Hours | "store hours", "when open", "open today", "closing time" |
| Contact | "phone number", "email", "contact info", "how to reach" |
| Location | "store location", "address", "where are you", "find store" |
| Payment | "payment methods", "accept credit cards", "cash only" |
| General | "about store", "store information", "business details" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| Hours Inquiry | Show business hours, special hours, holidays |
| Contact Request | Provide phone, email, contact form link |
| Location | Provide address, map link, directions |
| Payment | List accepted payment methods |
| Multiple Stores | Ask which location, show all stores |
| After Hours | Show hours, offer to help with other info |

### Store Information Categories

| Category | Information Type | Examples |
|----------|-----------------|----------|
| Contact | Phone, email, social media | +94 XX XXX XXXX, info@lcc.lk |
| Hours | Open/close times, holidays | Mon-Fri 9AM-6PM, Closed Sundays |
| Location | Address, directions, map | 123 Main St, Colombo 7 |
| Payment | Accepted methods | Visa, MasterCard, Cash, Mobile Pay |
| Policies | General store policies | Privacy, terms, guarantees |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| SHIPPING | May overlap | Store policies include shipping |
| RETURNS | May overlap | Store policies include returns |
| PRODUCT_INFO | Different focus | General store vs specific product |
| ESCALATE | May escalate to | Complex inquiries need human help |

### Common Information Requests

| Request Type | Examples | Response Content |
|-------------|----------|------------------|
| Operating Hours | "When open?", "Hours today?" | Daily schedule, exceptions |
| Contact Methods | "How to reach?", "Phone?" | Phone, email, chat, social |
| Physical Location | "Where located?", "Address?" | Street address, map link |
| Online Presence | "Website?", "Social media?" | URLs, handles |
| Payment Options | "What cards?", "Cash?" | Payment methods list |
| Company Info | "About company", "History" | Brief company overview |

### Multi-Store Handling

| Scenario | Approach |
|----------|----------|
| Single Store | Provide single store information |
| Multiple Stores | Ask which location or show all |
| Online Only | Clarify online business, no physical location |
| Hybrid | Show both online and physical options |

### Expected Outcome
- STORE_INFO intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Entity expectations defined
- Information categories outlined
- Response strategies defined

### Verification Checklist
- [ ] STORE_INFO constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (General)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Expected entities documented
- [ ] Information categories defined
- [ ] Multi-store handling documented

---

## Task 25: Create GREETING Intent

### Overview
Define the GREETING intent for handling greeting messages and conversation starters. This intent is triggered when users initiate conversation with common greetings like "Hi", "Hello", "Good morning", etc. It's typically the first intent in a conversation and sets the tone for user engagement.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add GREETING intent to intent definitions
   - Maintain consistent structure

2. **Define GREETING intent constant**
   - Create constant named `GREETING`
   - Use string value "GREETING"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "GREETING"
   - Define display name: "Greeting"
   - Define description: "Initial greetings and conversation starters"
   - Define category: "Conversation"

4. **Document intent scope**
   - Include basic greetings (hi, hello)
   - Include time-based greetings (good morning)
   - Include casual greetings (hey, hi there)
   - Include formal greetings

5. **Define expected entities**
   - Usually none required
   - May extract time of day for appropriate response
   - May extract user name if provided

6. **List keyword indicators**
   - Document greeting keywords
   - Include variations and informal versions
   - Consider multiple languages if applicable

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | GREETING |
| **Display Name** | Greeting |
| **Category** | Conversation |
| **Priority** | High (session start) |
| **Requires Auth** | No |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Hi | 0.98+ |
| Hello | 0.98+ |
| Good morning | 0.98+ |
| Hey there | 0.95+ |
| Good afternoon | 0.98+ |
| Good evening | 0.98+ |
| Greetings | 0.95+ |
| Hey | 0.95+ |
| Hi there | 0.97+ |
| Hello there | 0.97+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Basic | hi, hello, hey |
| Time-based | morning, afternoon, evening, night |
| Casual | hey there, hi there, yo, sup |
| Formal | greetings, good day |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| time_of_day | enum | No | "morning", "afternoon" |
| user_name | string | No | "John" (from "Hi, I'm John") |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Simple | "Hi", "Hello", "Hey" |
| Extended | "Hi there", "Hello there", "Hey there" |
| Time-based | "Good morning", "Good afternoon", "Good evening" |
| Casual | "Yo", "Sup", "What's up" |
| Formal | "Greetings", "Good day", "Salutations" |
| With Name | "Hi, I'm John", "Hello, my name is Sarah" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| First Message | Welcome message, introduce bot capabilities |
| Returning User | Personalized greeting, reference history |
| Time-appropriate | Match greeting time (morning/afternoon/evening) |
| With Name | Acknowledge name, personalize response |
| After Long Pause | Re-engagement greeting |

### Greeting Response Templates

| User Input | Bot Response Template |
|------------|----------------------|
| "Hi" | "Hello! I'm the LCC chatbot. How can I help you today?" |
| "Good morning" | "Good morning! Welcome to LankaCommerce Cloud. What can I do for you?" |
| "Hey there" | "Hey! Great to see you. What brings you here today?" |
| Returning user | "Welcome back, [Name]! How can I assist you?" |

### Intent Characteristics

| Characteristic | Description |
|----------------|-------------|
| Session Position | Usually first message |
| Conversation Type | Initiates conversation |
| Complexity | Very simple |
| Entity Extraction | Rarely needed |
| Follow-up | Usually leads to specific intent |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| FAREWELL | Opposite | Start vs end of conversation |
| All Others | Precedes | Greeting often followed by specific query |

### Time-Based Greeting Mapping

| Time of Day | Greeting | Response Prefix |
|------------|----------|----------------|
| 5 AM - 11:59 AM | Good morning | "Good morning!" |
| 12 PM - 4:59 PM | Good afternoon | "Good afternoon!" |
| 5 PM - 8:59 PM | Good evening | "Good evening!" |
| 9 PM - 4:59 AM | Late greeting | "Hello!" |

### Multilingual Considerations

| Language | Greeting Examples | Note |
|----------|------------------|------|
| English | Hi, Hello, Hey | Primary support |
| Sinhala | Ayubowan, හෙලෝ | If multilingual support |
| Tamil | வணக்கம் | If multilingual support |

### Expected Outcome
- GREETING intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Response templates outlined
- Time-based greeting logic defined

### Verification Checklist
- [ ] GREETING constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Conversation)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Response templates defined
- [ ] Time-based logic documented

---

## Task 26: Create FAREWELL Intent

### Overview
Define the FAREWELL intent for handling goodbye messages and conversation endings. This intent is triggered when users end the conversation with phrases like "Bye", "Thank you", "Goodbye", etc. It provides proper closure to the conversation and maintains positive user experience.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add FAREWELL intent to intent definitions
   - Maintain consistent structure

2. **Define FAREWELL intent constant**
   - Create constant named `FAREWELL`
   - Use string value "FAREWELL"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "FAREWELL"
   - Define display name: "Farewell"
   - Define description: "Goodbye messages and conversation endings"
   - Define category: "Conversation"

4. **Document intent scope**
   - Include goodbye messages
   - Include thank you messages
   - Include conversation exit phrases
   - Include dismissal phrases

5. **Define expected entities**
   - Usually none required
   - May capture feedback sentiment
   - May capture reason for leaving

6. **List keyword indicators**
   - Document farewell keywords
   - Include thank you variations
   - Consider polite dismissals

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | FAREWELL |
| **Display Name** | Farewell |
| **Category** | Conversation |
| **Priority** | Medium (session end) |
| **Requires Auth** | No |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Bye | 0.98+ |
| Thanks | 0.95+ |
| Goodbye | 0.98+ |
| Thank you | 0.95+ |
| See you later | 0.97+ |
| That's all | 0.90+ |
| No more questions | 0.90+ |
| I'm done | 0.92+ |
| Thanks for your help | 0.95+ |
| Have a good day | 0.95+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Goodbye | bye, goodbye, farewell |
| Gratitude | thanks, thank you, appreciate |
| Done | done, all, that's all, no more |
| Departure | leave, go, later, see you |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| sentiment | enum | No | "satisfied", "unsatisfied" |
| feedback | string | No | "helpful", "not useful" |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Simple | "Bye", "Thanks", "Goodbye" |
| Extended | "Thank you very much", "Thanks for your help" |
| Polite | "Have a good day", "Take care", "Cheers" |
| Done | "That's all", "I'm done", "No more questions" |
| Satisfied | "Thanks, that helped", "Perfect, goodbye" |
| Dismissive | "Never mind", "Forget it", "I'll handle it" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| Simple Goodbye | Friendly farewell, offer future help |
| With Thanks | Acknowledge thanks, express willingness |
| Satisfied Exit | Positive reinforcement, invitation to return |
| Unsatisfied Exit | Apologize, offer alternatives (human agent) |
| Abrupt Exit | Brief farewell, log for review |
| Feedback Included | Thank for feedback, appropriate closure |

### Farewell Response Templates

| User Input | Bot Response Template |
|------------|----------------------|
| "Bye" | "Goodbye! Feel free to return if you need more help." |
| "Thanks" | "You're welcome! Happy to help anytime." |
| "Thank you for your help" | "My pleasure! I'm here whenever you need assistance." |
| "That's all" | "Great! Have a wonderful day!" |
| "Never mind" | "No problem! I'm here if you change your mind." |

### Intent Characteristics

| Characteristic | Description |
|----------------|-------------|
| Session Position | Usually last message |
| Conversation Type | Terminates conversation |
| Complexity | Very simple |
| Entity Extraction | Rarely needed |
| Follow-up | Conversation ends or new session starts |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| GREETING | Opposite | Start vs end of conversation |
| ESCALATE | May follow | If escalating before leaving |
| All Others | Follows | Any intent can lead to farewell |

### Conversation Closure Actions

| Action | Description | When to Trigger |
|--------|-------------|----------------|
| End Session | Close conversation session | Clear farewell |
| Save Conversation | Store conversation history | All farewells |
| Request Feedback | Ask for rating/feedback | Positive farewells |
| Offer Alternatives | Suggest human agent | Negative farewells |
| Log Metrics | Record satisfaction, duration | All farewells |

### Sentiment Detection

| Sentiment | Indicators | Response Approach |
|-----------|-----------|------------------|
| Positive | "Thanks", "Helpful", "Great" | Encourage return, positive close |
| Neutral | "Bye", "That's all" | Standard farewell |
| Negative | "Useless", "Waste of time" | Apologize, offer human agent |
| Frustrated | "Forget it", "Never mind" | Empathy, suggest escalation |

### Session Management

| Aspect | Action |
|--------|--------|
| Mark Complete | Flag conversation as ended |
| Save Context | Store for future reference |
| Clear State | Reset temporary variables |
| Log Metrics | Duration, satisfaction, resolution |
| Cleanup | Remove temporary data |

### Expected Outcome
- FAREWELL intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Response templates outlined
- Sentiment handling defined
- Session closure logic outlined

### Verification Checklist
- [ ] FAREWELL constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Conversation)
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Response templates defined
- [ ] Sentiment detection documented
- [ ] Session closure logic outlined

---

## Task 27: Create ESCALATE Intent

### Overview
Define the ESCALATE intent for handling requests to speak with a human agent or transfer to customer service. This intent is triggered when users express frustration, request human assistance, or when the bot cannot adequately address their needs. It's a critical safety valve for maintaining customer satisfaction.

### Dependencies
- Task 19: Create get_confidence Method
- Chatbot models from Group A

### Instructions

1. **Add to intent definition module**
   - Open `backend/apps/chatbot/intents.py` file
   - Add ESCALATE intent to intent definitions
   - Maintain consistent structure

2. **Define ESCALATE intent constant**
   - Create constant named `ESCALATE`
   - Use string value "ESCALATE"
   - Add to intent choices or enum

3. **Add intent metadata**
   - Define intent name: "ESCALATE"
   - Define display name: "Human Escalation"
   - Define description: "Requests to speak with human agent or customer service"
   - Define category: "Support"

4. **Document intent scope**
   - Include direct human requests
   - Include frustration expressions
   - Include complexity indicators
   - Include agent transfer requests
   - Include complaint escalations

5. **Define expected entities**
   - Escalation reason (optional)
   - Urgency level (optional)
   - Department preference (optional)

6. **List keyword indicators**
   - Document escalation keywords
   - Include frustration expressions
   - Consider urgency indicators

### Intent Definition

| Property | Value |
|----------|-------|
| **Name** | ESCALATE |
| **Display Name** | Human Escalation |
| **Category** | Support |
| **Priority** | Critical |
| **Requires Auth** | Preferably Yes |

### Training Phrases

| Phrase | Confidence Expectation |
|--------|----------------------|
| Talk to human | 0.98+ |
| Speak to agent | 0.98+ |
| Real person please | 0.97+ |
| Customer service | 0.95+ |
| Connect me to support | 0.97+ |
| I need help from a person | 0.95+ |
| Transfer to agent | 0.98+ |
| Human please | 0.97+ |
| Not helpful | 0.85+ |
| This isn't working | 0.85+ |

### Keyword Indicators

| Category | Keywords |
|----------|----------|
| Direct Request | human, person, agent, representative |
| Transfer | transfer, connect, speak to, talk to |
| Department | support, service, customer service, help desk |
| Frustration | not helpful, useless, waste, frustrated |
| Urgency | urgent, immediately, now, ASAP |

### Expected Entities to Extract

| Entity | Type | Required | Example |
|--------|------|----------|---------|
| escalation_reason | string | No | "complex issue", "frustrated" |
| urgency | enum | No | "urgent", "normal" |
| department | string | No | "technical support", "sales" |
| problem_description | string | No | Brief description of issue |

### User Query Variations

| Variation Type | Examples |
|---------------|----------|
| Direct | "Talk to human", "Real person", "Agent please" |
| Frustrated | "You're not helping", "This is useless", "Not working" |
| Polite | "May I speak to someone", "Could I talk to an agent" |
| Urgent | "I need help now", "Urgent issue", "Immediately" |
| Specific | "Transfer to support", "Customer service", "Technical help" |
| Complaint | "I want to complain", "File complaint", "Manager please" |

### Response Strategy

| Scenario | Response Action |
|----------|----------------|
| Direct Request | Acknowledge, collect info, initiate transfer |
| Frustrated User | Empathize, apologize, fast-track escalation |
| After Hours | Show hours, offer callback, email support |
| High Priority | Immediate escalation, priority queue |
| Complex Issue | Acknowledge complexity, gather details |
| Unresolved | Summarize attempts, escalate with context |

### Escalation Types

| Type | Description | Handling Priority |
|------|-------------|------------------|
| Direct Request | User asks for human | Normal |
| Frustration | User expresses frustration | High |
| Unresolved | Bot can't solve issue | Normal |
| Complaint | User has complaint | High |
| Technical | Complex technical issue | Medium |
| Emergency | Urgent/critical issue | Critical |

### Escalation Workflow

| Step | Action | Details |
|------|--------|---------|
| 1. Detect | Identify escalation intent | Intent classification |
| 2. Acknowledge | Confirm escalation request | "Let me connect you..." |
| 3. Collect Info | Gather necessary details | Contact, issue, urgency |
| 4. Check Availability | Verify agent availability | Hours, queue status |
| 5. Initiate Transfer | Connect to agent/create ticket | Depending on system |
| 6. Provide Context | Send conversation history | Help agent understand issue |
| 7. Confirm | Verify successful transfer | Feedback to user |

### Intent Relationships

| Related Intent | Relationship | Handling |
|---------------|--------------|----------|
| FAREWELL | May precede | If frustrated, may leave |
| All Intents | Can follow | Any unresolved intent may escalate |
| RETURNS | Often related | Complex returns may need human |
| ORDER_STATUS | May trigger | If order issue is complex |

### Escalation Triggers

| Trigger Type | Examples | Auto-Escalate? |
|-------------|----------|----------------|
| Direct Request | "Talk to human" | Yes |
| Low Confidence | Multiple low-confidence responses | Consider |
| Loop Detection | Same question repeated | Yes |
| Negative Sentiment | Frustrated language | Consider |
| Complex Query | Multi-step problem | Consider |
| Time Threshold | Conversation exceeds X minutes | Consider |

### Agent Availability Handling

| Scenario | Response |
|----------|----------|
| Agent Available | "Connecting you now..." |
| Queue Wait | "Estimated wait time: X minutes" |
| After Hours | "We're closed. Available [hours]. Leave message?" |
| All Busy | "High volume. Wait or request callback?" |
| System Down | "Technical issue. Email [address] or call [phone]" |

### Information to Collect Before Escalation

| Information | Purpose | Required |
|------------|---------|----------|
| User Name | Personalization | Yes |
| Email/Phone | Contact for follow-up | Yes |
| Issue Description | Context for agent | Yes |
| Account Number | Account lookup | If applicable |
| Previous Attempts | Show what was tried | No |
| Urgency Level | Priority routing | No |

### Post-Escalation Actions

| Action | Description |
|--------|-------------|
| Save Conversation | Store full chat history |
| Create Ticket | Generate support ticket |
| Send Email | Confirmation email to user |
| Notify Agent | Alert available agent |
| Log Metrics | Track escalation reason, time |
| Update Dashboard | Reflect in admin dashboard |

### Expected Outcome
- ESCALATE intent defined in codebase
- Intent metadata documented
- Training phrases identified
- Keyword indicators listed
- Escalation workflow outlined
- Trigger conditions defined
- Response strategies documented

### Verification Checklist
- [ ] ESCALATE constant created in intents module
- [ ] Intent name and display name defined
- [ ] Category assigned (Support)
- [ ] Priority set to Critical
- [ ] Training phrases documented
- [ ] Keyword indicators listed
- [ ] Escalation workflow defined
- [ ] Trigger conditions documented
- [ ] Agent availability handling outlined
- [ ] Information collection defined

---

## Summary

This document covered the creation of the IntentClassifier abstract base class and all eight core intent definitions for the chatbot system. The IntentClassifier provides a consistent interface with classify and get_confidence methods that all concrete implementations must follow.

### Intents Created

| Intent | Purpose | Priority | Category |
|--------|---------|----------|----------|
| ORDER_STATUS | Order tracking and status | High | Orders |
| PRODUCT_INFO | Product information and availability | High | Products |
| RETURNS | Returns, refunds, exchanges | High | Customer Service |
| SHIPPING | Shipping options and policies | Medium | Logistics |
| STORE_INFO | Store details and contact info | Low | General |
| GREETING | Conversation starters | High | Conversation |
| FAREWELL | Conversation endings | Medium | Conversation |
| ESCALATE | Human agent requests | Critical | Support |

### Next Steps

The next document (02_Tasks-28-34_Training-Hybrid.md) will cover:
- Creating training phrase seed data
- Implementing text preprocessor
- Building embedding classifier
- Building rule-based classifier
- Creating hybrid classifier
- Setting up intent admin interface
- Verifying classification functionality

---

## Notes

- All intents should be defined in the intents module for easy reference
- Maintain consistent naming conventions across all intents
- Training phrases will be added in the next document (Task 28)
- The hybrid classifier (Task 32) will use both embedding and rule-based approaches
- Admin interface (Task 33) will allow managing intent definitions and training data
