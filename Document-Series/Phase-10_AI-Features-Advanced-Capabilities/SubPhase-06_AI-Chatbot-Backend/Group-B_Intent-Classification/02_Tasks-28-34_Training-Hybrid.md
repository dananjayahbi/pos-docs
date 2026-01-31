# Tasks 28-34: Training Data, Preprocessor, and Hybrid Classification

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** B - Intent Classification  
> **Document:** 02 of 02  
> **Tasks Covered:** 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-27_Classifier-Intents.md](01_Tasks-17-27_Classifier-Intents.md)
- **→ Next Group:** [Group-C_Entity-Extraction](../Group-C_Entity-Extraction/)

---

## Document Overview

This document covers the implementation of training data, text preprocessing, and the hybrid classification system that combines embedding-based and rule-based approaches. It includes creating training phrase seed data for all intents, building a text preprocessor for input cleaning, implementing an embedding classifier using sentence transformers, creating a rule-based classifier for fallback, combining both approaches in a hybrid classifier, setting up the Django admin interface for intent management, and verifying the complete classification system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 28 | Create Training Phrases | Medium | 40 min |
| 29 | Create Text Preprocessor | Low | 25 min |
| 30 | Create Embedding Classifier | High | 60 min |
| 31 | Create Rule-based Classifier | Medium | 45 min |
| 32 | Create Hybrid Classifier | Medium | 50 min |
| 33 | Create Intent Admin | Medium | 35 min |
| 34 | Verify Classification | Low | 30 min |

---

## Task 28: Create Training Phrases

### Overview
Create comprehensive training phrase seed data for all eight intents defined in the previous document. These training phrases serve as the foundation for both embedding-based and rule-based classification. Each intent should have diverse, realistic examples that cover various ways users might express that intent.

### Dependencies
- Task 27: Create ESCALATE Intent
- All intents from Tasks 20-27

### Instructions

1. **Create training data structure**
   - Create `backend/apps/chatbot/fixtures/` directory if not exists
   - Create new file named `training_phrases.json` or `training_phrases.py`
   - Structure data to map intents to training phrases

2. **Define data format**
   - Use JSON format or Python dictionary
   - Structure: intent name → list of training phrases
   - Include metadata (language, confidence threshold, etc.)

3. **Create ORDER_STATUS training phrases**
   - Add 15-20 diverse phrases for order tracking
   - Include variations with order numbers
   - Cover different question patterns
   - Include informal language variations

4. **Create PRODUCT_INFO training phrases**
   - Add 15-20 phrases for product inquiries
   - Include availability questions
   - Cover pricing inquiries
   - Include feature/specification questions

5. **Create RETURNS training phrases**
   - Add 15-20 phrases for returns and refunds
   - Include policy questions
   - Cover exchange requests
   - Include reason-based statements

6. **Create SHIPPING training phrases**
   - Add 15-20 phrases for shipping inquiries
   - Include cost questions
   - Cover delivery time questions
   - Include location-specific queries

7. **Create STORE_INFO training phrases**
   - Add 15-20 phrases for store information
   - Include contact requests
   - Cover hours questions
   - Include location inquiries

8. **Create GREETING training phrases**
   - Add 10-15 greeting variations
   - Include time-based greetings
   - Cover casual and formal greetings
   - Include multilingual if applicable

9. **Create FAREWELL training phrases**
   - Add 10-15 farewell variations
   - Include thank you messages
   - Cover done/exit statements
   - Include polite dismissals

10. **Create ESCALATE training phrases**
    - Add 15-20 escalation phrases
    - Include direct human requests
    - Cover frustration expressions
    - Include urgency indicators

11. **Create Django fixture or management command**
    - Create command to load training phrases
    - Store in database or load at startup
    - Make easily updatable

12. **Add phrase variations**
    - Include typos and misspellings (common ones)
    - Add abbreviated forms
    - Include multilingual if supported
    - Cover formal and informal language

### Training Phrases Structure

```
Training Phrases by Intent
├── ORDER_STATUS (20 phrases)
├── PRODUCT_INFO (20 phrases)
├── RETURNS (20 phrases)
├── SHIPPING (20 phrases)
├── STORE_INFO (20 phrases)
├── GREETING (15 phrases)
├── FAREWELL (15 phrases)
└── ESCALATE (20 phrases)
Total: ~145 phrases
```

### ORDER_STATUS Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Direct | "Where is my order", "Track my order", "Order status" |
| With ID | "Where is order #12345", "Track order 67890" |
| Timing | "When will my order arrive", "Delivery date for my order" |
| Status Check | "Has my order shipped", "Is my order on the way" |
| Problem | "My order hasn't arrived", "Order delayed" |

### PRODUCT_INFO Training Phrases

| Category | Example Phrases |
|----------|----------------|
| General | "Tell me about this product", "Product details", "Product info" |
| Availability | "Is this available", "In stock", "Do you have this" |
| Pricing | "How much", "Price", "What does this cost" |
| Features | "What features", "Specifications", "What can it do" |
| Comparison | "Better than", "Difference between", "Compare with" |

### RETURNS Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Policy | "Return policy", "Can I return", "How to return" |
| Request | "Want to return", "Return this", "Send back" |
| Refund | "Refund request", "Get my money back", "Refund" |
| Exchange | "Exchange for", "Swap for", "Different size" |
| Reason-based | "Wrong size", "Damaged", "Not as described" |

### SHIPPING Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Cost | "Shipping cost", "Delivery fee", "How much to ship" |
| Time | "How long", "Delivery time", "When will it arrive" |
| Options | "Shipping options", "Express delivery", "Fast shipping" |
| Location | "Ship to UK", "Deliver to Colombo", "International shipping" |
| Free | "Free shipping", "Free delivery", "No shipping cost" |

### STORE_INFO Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Hours | "Store hours", "When open", "Opening hours", "Working hours" |
| Contact | "Phone number", "Email", "Contact info", "How to reach" |
| Location | "Store location", "Address", "Where located", "Find store" |
| Payment | "Payment methods", "Accept cards", "How to pay" |
| General | "About store", "Company info", "Store information" |

### GREETING Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Basic | "Hi", "Hello", "Hey", "Hi there", "Hello there" |
| Time-based | "Good morning", "Good afternoon", "Good evening" |
| Casual | "Hey there", "What's up", "Yo", "Sup" |
| Formal | "Greetings", "Good day", "Salutations" |
| Extended | "Hi, I need help", "Hello, can you help" |

### FAREWELL Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Basic | "Bye", "Goodbye", "See you", "Later" |
| Thanks | "Thanks", "Thank you", "Thanks for help", "Appreciate it" |
| Done | "That's all", "I'm done", "No more questions", "All set" |
| Polite | "Have a good day", "Take care", "Cheers" |
| Dismissive | "Never mind", "Forget it", "I'll handle it" |

### ESCALATE Training Phrases

| Category | Example Phrases |
|----------|----------------|
| Direct | "Talk to human", "Real person", "Agent please", "Human" |
| Transfer | "Transfer to agent", "Connect to support", "Speak to someone" |
| Frustration | "Not helpful", "This isn't working", "Useless", "Frustrated" |
| Service | "Customer service", "Support", "Help desk" |
| Urgency | "Urgent", "Need help now", "Immediately", "ASAP" |

### Data Storage Options

| Option | Pros | Cons | Recommended |
|--------|------|------|-------------|
| JSON File | Easy to edit, version control | Must reload on change | Good for initial |
| Database | Dynamic updates, admin editable | Requires migration | Best for production |
| Python Module | Fast loading, typed | Less flexible | Good for constants |
| External API | Centralized, updatable | Network dependency | Advanced use |

### Training Data Quality Guidelines

| Guideline | Description |
|-----------|-------------|
| Diversity | Cover multiple ways to express same intent |
| Realistic | Use actual user language, not formal definitions |
| Balanced | Similar number of phrases per intent |
| Unambiguous | Each phrase clearly belongs to one intent |
| Coverage | Include edge cases and variations |
| Natural | Real conversation patterns, not keywords |

### Expected Outcome
- Training phrases created for all 8 intents
- Minimum 10-20 phrases per intent
- Data stored in accessible format (JSON/database)
- Easy to update and extend
- Ready for use by classifiers

### Verification Checklist
- [ ] Training phrases file/module created
- [ ] All 8 intents have training phrases
- [ ] Minimum phrase count met for each intent
- [ ] Data format is consistent
- [ ] Easy to load and access
- [ ] Diverse phrase variations included
- [ ] Django fixture or management command created

---

## Task 29: Create Text Preprocessor

### Overview
Create a text preprocessing module that cleans and normalizes user input before classification. The preprocessor handles lowercasing, punctuation removal, extra whitespace removal, contraction expansion, and other text normalization tasks to improve classification accuracy and consistency.

### Dependencies
- Task 28: Create Training Phrases
- Python string processing libraries

### Instructions

1. **Create preprocessor module**
   - Create `backend/apps/chatbot/classification/preprocessor.py`
   - Define TextPreprocessor class
   - Keep preprocessing logic reusable

2. **Implement lowercase conversion**
   - Convert all text to lowercase
   - Maintain consistency across inputs
   - Handle Unicode characters properly

3. **Implement punctuation removal**
   - Remove or replace punctuation marks
   - Preserve meaning where needed
   - Handle special cases (email, URLs)

4. **Implement whitespace normalization**
   - Remove extra spaces
   - Normalize line breaks
   - Trim leading/trailing whitespace

5. **Implement contraction expansion**
   - Expand common contractions ("don't" → "do not")
   - Build contraction mapping dictionary
   - Handle possessives appropriately

6. **Add special character handling**
   - Handle emojis (remove or convert)
   - Handle special symbols
   - Preserve important characters (numbers, #)

7. **Create preprocess method**
   - Main method that applies all preprocessing steps
   - Accept raw text, return cleaned text
   - Apply steps in correct order

8. **Add optional preprocessing steps**
   - Stemming (optional, for advanced use)
   - Stop word removal (optional, may lose context)
   - Lemmatization (optional, complex)

9. **Add preprocessing configuration**
   - Allow enabling/disabling steps
   - Configure which steps to apply
   - Make extensible for future needs

10. **Add logging**
    - Log preprocessing transformations
    - Useful for debugging
    - Track text changes

### Preprocessing Pipeline

```
User Input
    │
    ▼
┌─────────────────────┐
│ 1. Lowercase        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ 2. Remove Extra     │
│    Whitespace       │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ 3. Expand           │
│    Contractions     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ 4. Remove/Handle    │
│    Punctuation      │
└─────────────────────┘
    │
    ▼
Cleaned Text
```

### Preprocessing Steps

| Step | Purpose | Example |
|------|---------|---------|
| Lowercase | Normalize case | "Hello" → "hello" |
| Trim Whitespace | Remove extra spaces | "hi  there" → "hi there" |
| Expand Contractions | Standardize | "don't" → "do not" |
| Remove Punctuation | Clean text | "Hello!" → "Hello" |
| Handle Special Chars | Clean/preserve | Keep "#" in "#12345" |

### Contraction Expansion Map

| Contraction | Expansion |
|------------|-----------|
| don't | do not |
| can't | cannot |
| won't | will not |
| I'm | I am |
| you're | you are |
| it's | it is |
| that's | that is |
| what's | what is |
| there's | there is |
| I've | I have |

### Before/After Examples

| Original Input | After Preprocessing |
|---------------|-------------------|
| "Where's my order #12345?" | "where is my order #12345" |
| "I'm   looking for a product" | "i am looking for a product" |
| "CAN'T FIND MY SHIPMENT!!!" | "cannot find my shipment" |
| "Hi, I'd like to return this." | "hi i would like to return this" |
| "What's your phone number?" | "what is your phone number" |

### Special Cases to Handle

| Case | Handling Strategy |
|------|------------------|
| Order Numbers | Preserve "#12345" format |
| Email Addresses | Preserve or remove based on context |
| URLs | Remove or preserve |
| Phone Numbers | Preserve format |
| Currency | Preserve symbols ($, €) |
| Emojis | Remove or convert to text |

### TextPreprocessor Class Structure

| Method | Purpose | Return Type |
|--------|---------|-------------|
| preprocess(text) | Main preprocessing | str |
| to_lowercase(text) | Convert to lower | str |
| remove_punctuation(text) | Remove punctuation | str |
| normalize_whitespace(text) | Clean spaces | str |
| expand_contractions(text) | Expand contractions | str |

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| lowercase | True | Convert to lowercase |
| remove_punct | True | Remove punctuation |
| expand_contract | True | Expand contractions |
| remove_extra_space | True | Normalize whitespace |
| preserve_patterns | ["#\\d+"] | Regex patterns to preserve |

### Preprocessing Quality Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| Consistency | 100% | Same input → same output |
| Preservation | High | Keep important info (order #) |
| Speed | < 10ms | Fast processing |
| Memory | Low | Efficient processing |

### Error Handling

| Error Scenario | Handling |
|---------------|----------|
| None/Empty Input | Return empty string |
| Non-string Input | Convert to string or raise error |
| Unicode Errors | Handle gracefully |
| Large Text | Truncate or process in chunks |

### Testing Considerations

| Test Type | Examples |
|----------|----------|
| Basic | "Hello" → "hello" |
| Contractions | "don't" → "do not" |
| Punctuation | "Hi!" → "hi" |
| Numbers | "#12345" → "#12345" (preserved) |
| Special | "email@test.com" handling |
| Edge Cases | Empty, None, very long text |

### Expected Outcome
- TextPreprocessor class implemented
- All preprocessing steps working
- Configurable preprocessing pipeline
- Handles edge cases gracefully
- Fast and efficient processing
- Ready for use in classifiers

### Verification Checklist
- [ ] `preprocessor.py` module created
- [ ] TextPreprocessor class implemented
- [ ] Lowercase conversion works
- [ ] Punctuation removal works
- [ ] Whitespace normalization works
- [ ] Contraction expansion works
- [ ] Special character handling implemented
- [ ] preprocess method integrates all steps
- [ ] Configuration options available
- [ ] Error handling added

---

## Task 30: Create Embedding Classifier

### Overview
Create an embedding-based classifier that uses sentence transformers to convert text to semantic vectors and calculates similarity with intent training phrases. This classifier provides powerful semantic understanding, detecting intent even when user phrasing differs from training data. It's the primary classification method in the hybrid system.

### Dependencies
- Task 29: Create Text Preprocessor
- Task 17: Create IntentClassifier (abstract class)
- sentence-transformers library

### Instructions

1. **Install required packages**
   - Add `sentence-transformers` to requirements
   - Add `numpy` for vector operations
   - Add `scipy` for cosine similarity
   - Consider `torch` for GPU acceleration

2. **Create embedding classifier module**
   - Create `backend/apps/chatbot/classification/embedding.py`
   - Define EmbeddingClassifier class
   - Inherit from IntentClassifier abstract class

3. **Select embedding model**
   - Choose appropriate sentence-transformers model
   - Consider: `all-MiniLM-L6-v2` (fast, good quality)
   - Or: `paraphrase-multilingual-MiniLM-L12-v2` (multilingual)
   - Balance between speed and accuracy

4. **Initialize model in constructor**
   - Load sentence-transformers model
   - Cache model in memory
   - Handle model loading errors
   - Consider lazy loading for faster startup

5. **Load training phrase embeddings**
   - Load training phrases from Task 28
   - Generate embeddings for all training phrases
   - Cache embeddings to avoid recomputation
   - Store intent label with each embedding

6. **Implement encode method**
   - Convert text to embedding vector
   - Use preprocessor from Task 29
   - Return numpy array or torch tensor
   - Handle encoding errors

7. **Implement similarity calculation**
   - Use cosine similarity between vectors
   - Compare input embedding with training embeddings
   - Find most similar training phrase
   - Return similarity score (0.0 to 1.0)

8. **Implement classify method**
   - Encode input text
   - Calculate similarity with all training embeddings
   - Group by intent and find max similarity
   - Return (intent_name, confidence_score)

9. **Implement get_confidence method**
   - Encode input text
   - Calculate similarity with specific intent's embeddings
   - Return max similarity for that intent
   - Use as confidence score

10. **Add caching strategy**
    - Cache training phrase embeddings
    - Cache model for reuse
    - Consider Redis for distributed systems
    - Implement cache invalidation

11. **Optimize for performance**
    - Batch process training phrases
    - Use GPU if available
    - Optimize similarity calculations
    - Profile and improve bottlenecks

12. **Add confidence threshold**
    - Define minimum confidence threshold (e.g., 0.5)
    - Return None or default intent if below threshold
    - Make threshold configurable

### Embedding Classifier Architecture

```
User Input
    │
    ▼
[Preprocess]
    │
    ▼
[Encode to Embedding]
    │
    ▼
[Cached Training Embeddings]
    │
    ├─ ORDER_STATUS embeddings (20)
    ├─ PRODUCT_INFO embeddings (20)
    ├─ RETURNS embeddings (20)
    ├─ SHIPPING embeddings (20)
    ├─ STORE_INFO embeddings (20)
    ├─ GREETING embeddings (15)
    ├─ FAREWELL embeddings (15)
    └─ ESCALATE embeddings (20)
    │
    ▼
[Calculate Cosine Similarity]
    │
    ▼
[Find Intent with Max Similarity]
    │
    ▼
(Intent, Confidence)
```

### Sentence Transformer Model Options

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| all-MiniLM-L6-v2 | 80MB | Fast | Good | Production, English |
| all-MiniLM-L12-v2 | 120MB | Medium | Better | Better quality needed |
| paraphrase-multilingual | 420MB | Slower | Good | Multi-language support |
| all-mpnet-base-v2 | 420MB | Slow | Best | Highest quality |

### Cosine Similarity Calculation

| Similarity Score | Interpretation | Action |
|-----------------|----------------|--------|
| 0.9 - 1.0 | Very high match | Strong confidence |
| 0.7 - 0.9 | Good match | Confident classification |
| 0.5 - 0.7 | Moderate match | Consider with caution |
| 0.3 - 0.5 | Weak match | Likely wrong |
| 0.0 - 0.3 | No match | Definitely wrong |

### Classification Flow

| Step | Action | Details |
|------|--------|---------|
| 1 | Input | Receive user text |
| 2 | Preprocess | Clean text using TextPreprocessor |
| 3 | Encode | Convert to 384-dim vector (typical) |
| 4 | Compare | Calculate similarity with all training embeddings |
| 5 | Group | Group similarities by intent |
| 6 | Select | Find intent with highest similarity |
| 7 | Return | Return (intent, confidence) |

### EmbeddingClassifier Methods

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| __init__ | model_name | None | Initialize model |
| load_embeddings | training_phrases | None | Precompute embeddings |
| encode | text | ndarray | Convert text to vector |
| classify | text | Tuple[str, float] | Classify intent |
| get_confidence | text, intent | float | Get intent confidence |

### Training Phrase Embedding Cache

| Intent | Phrases | Embeddings |
|--------|---------|-----------|
| ORDER_STATUS | 20 | 20 x 384 vectors |
| PRODUCT_INFO | 20 | 20 x 384 vectors |
| RETURNS | 20 | 20 x 384 vectors |
| SHIPPING | 20 | 20 x 384 vectors |
| STORE_INFO | 20 | 20 x 384 vectors |
| GREETING | 15 | 15 x 384 vectors |
| FAREWELL | 15 | 15 x 384 vectors |
| ESCALATE | 20 | 20 x 384 vectors |

### Example Similarity Calculation

| User Input | Training Phrase | Cosine Similarity | Intent |
|-----------|----------------|------------------|--------|
| "Track my package" | "Track my order" | 0.92 | ORDER_STATUS |
| "Track my package" | "Shipping cost" | 0.45 | SHIPPING |
| "Track my package" | "Hello" | 0.15 | GREETING |

### Performance Considerations

| Aspect | Strategy |
|--------|----------|
| Model Loading | Load once, cache in memory |
| Training Embeddings | Precompute and cache |
| Inference | Fast, < 100ms typical |
| Memory | ~500MB for model + embeddings |
| GPU | Optional, speeds up by 3-5x |

### Error Handling

| Error | Handling |
|-------|----------|
| Model Not Found | Download automatically or raise clear error |
| Encoding Error | Return default intent or raise |
| Empty Input | Return None or default intent |
| Out of Memory | Use smaller model or batch processing |

### Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| model_name | all-MiniLM-L6-v2 | Transformer model |
| confidence_threshold | 0.5 | Minimum confidence |
| cache_embeddings | True | Cache training embeddings |
| use_gpu | False | Use GPU acceleration |
| batch_size | 32 | Batch size for encoding |

### Expected Outcome
- EmbeddingClassifier class implemented
- Inherits from IntentClassifier
- Uses sentence transformers for encoding
- Caches training embeddings
- Fast and accurate classification
- Handles semantic similarity well
- Ready for hybrid integration

### Verification Checklist
- [ ] `embedding.py` module created
- [ ] EmbeddingClassifier inherits from IntentClassifier
- [ ] Sentence-transformers integrated
- [ ] Model loads successfully
- [ ] Training embeddings cached
- [ ] encode method implemented
- [ ] classify method implemented
- [ ] get_confidence method implemented
- [ ] Cosine similarity calculation works
- [ ] Performance is acceptable (<100ms)
- [ ] Error handling added

---

## Task 31: Create Rule-based Classifier

### Overview
Create a rule-based classifier that uses keyword matching and pattern recognition to classify intents. This classifier serves as a fallback when the embedding classifier has low confidence, and handles cases where keyword presence strongly indicates intent. It's faster but less sophisticated than embedding-based classification.

### Dependencies
- Task 17: Create IntentClassifier (abstract class)
- Task 29: Create Text Preprocessor

### Instructions

1. **Create rule-based classifier module**
   - Create `backend/apps/chatbot/classification/rule_based.py`
   - Define RuleBasedClassifier class
   - Inherit from IntentClassifier abstract class

2. **Define keyword rules for each intent**
   - Create keyword dictionaries for each intent
   - Assign weights to keywords (importance)
   - Include synonyms and variations

3. **Create ORDER_STATUS rules**
   - Keywords: order, track, tracking, status, shipment, delivery
   - High-weight patterns: "order #", "track", "where is my"
   - Consider order number patterns

4. **Create PRODUCT_INFO rules**
   - Keywords: product, item, available, stock, price, cost, features
   - High-weight patterns: "tell me about", "how much", "in stock"
   - Consider product-specific terms

5. **Create RETURNS rules**
   - Keywords: return, refund, exchange, send back, money back
   - High-weight patterns: "return policy", "want to return", "get refund"
   - Consider reason keywords

6. **Create SHIPPING rules**
   - Keywords: shipping, delivery, ship, deliver, freight, courier
   - High-weight patterns: "shipping cost", "how long", "delivery time"
   - Exclude order-specific tracking

7. **Create STORE_INFO rules**
   - Keywords: store, hours, open, close, contact, phone, email, location
   - High-weight patterns: "store hours", "contact number", "where located"
   - Consider business information terms

8. **Create GREETING rules**
   - Keywords: hi, hello, hey, morning, afternoon, evening, greetings
   - High-weight: exact matches for short greetings
   - Must be simple and short

9. **Create FAREWELL rules**
   - Keywords: bye, goodbye, thanks, thank you, see you, done, all
   - High-weight patterns: "that's all", "thank you", "goodbye"
   - Consider exit indicators

10. **Create ESCALATE rules**
    - Keywords: human, person, agent, representative, support, service, frustrated
    - High-weight patterns: "talk to human", "real person", "customer service"
    - Consider frustration indicators

11. **Implement keyword matching**
    - Preprocess text using TextPreprocessor
    - Check for keyword presence
    - Calculate match scores based on weights
    - Handle partial matches

12. **Implement pattern matching**
    - Define regex patterns for each intent
    - Check for pattern matches
    - Assign confidence based on pattern quality
    - Combine with keyword scores

13. **Implement classify method**
    - Preprocess input text
    - Calculate scores for all intents
    - Find intent with highest score
    - Convert score to confidence (0.0-1.0)
    - Return (intent_name, confidence)

14. **Implement get_confidence method**
    - Preprocess input text
    - Calculate score for specific intent
    - Convert to confidence score
    - Return float value

15. **Add scoring algorithm**
    - Weight keywords by importance
    - Add bonuses for pattern matches
    - Normalize scores to 0.0-1.0 range
    - Handle ties appropriately

### Rule-based Classification Flow

```
User Input
    │
    ▼
[Preprocess]
    │
    ▼
[Extract Keywords]
    │
    ▼
[Match Against Rules]
    │
    ├─ ORDER_STATUS rules
    ├─ PRODUCT_INFO rules
    ├─ RETURNS rules
    ├─ SHIPPING rules
    ├─ STORE_INFO rules
    ├─ GREETING rules
    ├─ FAREWELL rules
    └─ ESCALATE rules
    │
    ▼
[Calculate Scores]
    │
    ▼
[Find Highest Score]
    │
    ▼
(Intent, Confidence)
```

### Keyword Rules by Intent

| Intent | Primary Keywords | Secondary Keywords |
|--------|-----------------|-------------------|
| ORDER_STATUS | order, track, status | shipment, delivery, arrive |
| PRODUCT_INFO | product, item, available | stock, price, features, specs |
| RETURNS | return, refund, exchange | send back, money back, policy |
| SHIPPING | shipping, delivery, ship | freight, courier, cost, time |
| STORE_INFO | store, hours, contact | phone, email, location, address |
| GREETING | hi, hello, hey | morning, afternoon, evening |
| FAREWELL | bye, thanks, goodbye | done, all, see you |
| ESCALATE | human, agent, person | support, service, representative |

### Keyword Weights

| Weight | Category | Confidence Impact |
|--------|----------|------------------|
| 1.0 | Perfect match | Very high |
| 0.8 | Strong indicator | High |
| 0.6 | Good indicator | Medium |
| 0.4 | Weak indicator | Low |
| 0.2 | Possible match | Very low |

### Pattern Matching Examples

| Pattern | Intent | Example Match |
|---------|--------|--------------|
| `order\s*#?\d+` | ORDER_STATUS | "order #12345" |
| `track(?:ing)?.*order` | ORDER_STATUS | "tracking my order" |
| `how\s*much` | PRODUCT_INFO | "how much is this" |
| `return.*policy` | RETURNS | "return policy" |
| `shipping.*cost` | SHIPPING | "shipping cost" |
| `store.*hours` | STORE_INFO | "store hours" |
| `^(hi|hello|hey)$` | GREETING | "hi" |
| `talk.*human` | ESCALATE | "talk to human" |

### Scoring Algorithm

| Component | Weight | Example Score |
|-----------|--------|--------------|
| Keyword Match | 0.4 | 2 keywords = 0.4 |
| Pattern Match | 0.3 | 1 pattern = 0.3 |
| Keyword Weight | 0.2 | High weight = 0.2 |
| Context | 0.1 | Related words = 0.1 |
| **Total** | **1.0** | **Max confidence** |

### Classification Examples

| Input | Keywords Found | Pattern | Intent | Score |
|-------|---------------|---------|--------|-------|
| "Where is my order" | order, my | None | ORDER_STATUS | 0.75 |
| "order #12345 status" | order, status | order #\d+ | ORDER_STATUS | 0.95 |
| "How much is this" | much | how much | PRODUCT_INFO | 0.80 |
| "Talk to a human" | human, talk | talk.*human | ESCALATE | 0.90 |

### Rule-based vs Embedding Comparison

| Aspect | Rule-based | Embedding |
|--------|-----------|-----------|
| Speed | Very fast | Fast |
| Accuracy | Good for exact matches | Better for variations |
| Flexibility | Limited | High |
| Setup | Manual rules | Automatic from data |
| Maintenance | Update rules | Update training data |
| Use Case | Fallback, high confidence | Primary classifier |

### RuleBasedClassifier Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| __init__ | Initialize rules | None |
| load_rules | Load keyword/pattern rules | None |
| extract_keywords | Find keywords in text | List[str] |
| match_patterns | Find pattern matches | List[Match] |
| calculate_score | Score for one intent | float |
| classify | Classify text | Tuple[str, float] |
| get_confidence | Confidence for intent | float |

### Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| keyword_weight | 0.4 | Weight for keyword matches |
| pattern_weight | 0.3 | Weight for pattern matches |
| min_keywords | 1 | Minimum keywords required |
| case_sensitive | False | Case-sensitive matching |

### Error Handling

| Error | Handling |
|-------|----------|
| No Keywords Match | Return default/None |
| Tie in Scores | Use secondary criteria |
| Empty Input | Return None or default |
| Invalid Pattern | Log error, continue |

### Expected Outcome
- RuleBasedClassifier class implemented
- Inherits from IntentClassifier
- Keyword rules defined for all intents
- Pattern matching implemented
- Fast classification (<10ms)
- Good fallback for low-confidence cases
- Ready for hybrid integration

### Verification Checklist
- [ ] `rule_based.py` module created
- [ ] RuleBasedClassifier inherits from IntentClassifier
- [ ] Keyword rules defined for all 8 intents
- [ ] Pattern matching implemented
- [ ] classify method implemented
- [ ] get_confidence method implemented
- [ ] Scoring algorithm works correctly
- [ ] Handles ties and edge cases
- [ ] Performance is very fast
- [ ] Error handling added

---

## Task 32: Create Hybrid Classifier

### Overview
Create a hybrid classifier that intelligently combines embedding-based and rule-based classification to achieve optimal accuracy and reliability. The hybrid approach uses embedding classification as the primary method, falls back to rule-based classification when confidence is low, and can combine both scores for uncertain cases.

### Dependencies
- Task 30: Create Embedding Classifier
- Task 31: Create Rule-based Classifier
- Task 17: Create IntentClassifier

### Instructions

1. **Create hybrid classifier module**
   - Create `backend/apps/chatbot/classification/hybrid.py`
   - Define HybridClassifier class
   - Inherit from IntentClassifier abstract class

2. **Initialize both classifiers**
   - Create instance of EmbeddingClassifier
   - Create instance of RuleBasedClassifier
   - Store both as instance variables
   - Handle initialization errors

3. **Define confidence thresholds**
   - High confidence threshold (e.g., 0.8)
   - Medium confidence threshold (e.g., 0.5)
   - Low confidence threshold (e.g., 0.3)
   - Make thresholds configurable

4. **Implement hybrid strategy**
   - If embedding confidence > 0.8: use embedding result
   - If embedding confidence 0.5-0.8: combine both methods
   - If embedding confidence < 0.5: use rule-based result
   - Allow strategy customization

5. **Implement classify method**
   - Get classification from embedding classifier
   - Get classification from rule-based classifier
   - Apply hybrid strategy based on confidence
   - Return combined result

6. **Implement score combination**
   - Weighted average of both scores
   - Consider agreement between classifiers
   - Boost confidence if both agree
   - Reduce confidence if they disagree

7. **Implement get_confidence method**
   - Get confidence from both classifiers
   - Combine using hybrid strategy
   - Return unified confidence score

8. **Add agreement detection**
   - Check if both classifiers agree on intent
   - Boost confidence when agreement
   - Flag disagreement for review
   - Log disagreement cases

9. **Add fallback logic**
   - If both classifiers have low confidence
   - Return default intent or None
   - Consider escalation
   - Log for review

10. **Implement confidence boosting**
    - If both agree: boost confidence by 10-15%
    - If high embedding + rule match: very confident
    - If disagreement: reduce confidence
    - Cap at 1.0

11. **Add logging and monitoring**
    - Log which classifier was used
    - Track agreement/disagreement rates
    - Monitor confidence distributions
    - Help tune thresholds

12. **Optimize performance**
    - Run classifiers in appropriate order
    - Skip rule-based if embedding very confident
    - Consider parallel execution
    - Cache results if repeated

### Hybrid Classification Flow Diagram

```
User Input
    │
    ▼
┌─────────────────────┐
│ Embedding Classifier│
└─────────────────────┘
    │
    ├─ Confidence > 0.8  ──────► Use Embedding Result
    │
    ├─ Confidence 0.5-0.8
    │   │
    │   ▼
    │  ┌─────────────────────┐
    │  │ Rule-based Classifier│
    │  └─────────────────────┘
    │   │
    │   ├─ Agreement      ──────► Boost Confidence, Use Result
    │   └─ Disagreement   ──────► Weighted Combination
    │
    └─ Confidence < 0.5
        │
        ▼
       ┌─────────────────────┐
       │ Rule-based Classifier│
       └─────────────────────┘
        │
        └─► Use Rule-based Result (if > 0.5)
             or Default Intent
```

### Hybrid Strategy Decision Table

| Embedding Confidence | Rule-based Confidence | Strategy | Final Intent |
|---------------------|---------------------|----------|--------------|
| > 0.8 | Any | Use embedding | Embedding |
| 0.5-0.8 | > 0.5, Same | Boost confidence | Agreed intent |
| 0.5-0.8 | > 0.5, Different | Weighted average | Higher score |
| 0.5-0.8 | < 0.5 | Use embedding | Embedding |
| < 0.5 | > 0.5 | Use rule-based | Rule-based |
| < 0.5 | < 0.5 | Default/None | Default intent |

### Score Combination Formula

| Scenario | Formula | Example |
|----------|---------|---------|
| Agreement | `(emb_score * 0.7 + rule_score * 0.3) * 1.15` | Both say ORDER_STATUS |
| Disagreement | `max(emb_score * 0.7, rule_score * 0.3)` | Different intents |
| Embedding Strong | `emb_score` | Embedding > 0.8 |
| Rule-based Fallback | `rule_score` | Embedding < 0.5 |

### Confidence Threshold Configuration

| Threshold | Default Value | Purpose |
|-----------|--------------|---------|
| HIGH_CONFIDENCE | 0.8 | Trust embedding alone |
| MEDIUM_CONFIDENCE | 0.5 | Consider both classifiers |
| LOW_CONFIDENCE | 0.3 | Use rule-based fallback |
| AGREEMENT_BOOST | 0.15 | Boost when both agree |

### HybridClassifier Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| __init__ | Initialize both classifiers | None |
| classify | Main classification method | Tuple[str, float] |
| get_confidence | Get confidence for intent | float |
| combine_scores | Combine classifier scores | float |
| check_agreement | Check if classifiers agree | bool |
| apply_strategy | Apply hybrid logic | Tuple[str, float] |

### Classification Examples

| Input | Embedding | Rule-based | Strategy | Final Result |
|-------|-----------|------------|----------|--------------|
| "Track order #12345" | (ORDER_STATUS, 0.95) | (ORDER_STATUS, 0.90) | High conf + agree | (ORDER_STATUS, 0.98) |
| "Where's my package" | (ORDER_STATUS, 0.65) | (SHIPPING, 0.55) | Combine | (ORDER_STATUS, 0.70) |
| "order status pls" | (ORDER_STATUS, 0.45) | (ORDER_STATUS, 0.75) | Rule fallback | (ORDER_STATUS, 0.75) |
| "Hello there" | (GREETING, 0.98) | (GREETING, 0.95) | High conf | (GREETING, 0.98) |
| "unclear text xyz" | (?, 0.25) | (?, 0.20) | Both low | (DEFAULT, 0.25) |

### Advantages of Hybrid Approach

| Advantage | Description |
|-----------|-------------|
| Best of Both | Combines semantic understanding with keyword precision |
| Robust Fallback | Rule-based catches what embedding misses |
| Higher Confidence | Agreement boosts confidence |
| Handles Variation | Embedding handles paraphrasing, rules handle exact matches |
| Reliable | Multiple validation points |

### Performance Considerations

| Aspect | Strategy |
|--------|----------|
| Speed | Skip rule-based if embedding very confident |
| Accuracy | Combine when medium confidence |
| Resource | Embedding more expensive, rule-based very fast |
| Optimization | Cache, lazy evaluation |

### Monitoring and Logging

| Metric | Purpose |
|--------|---------|
| Classifier Used | Track which classifier was primary |
| Agreement Rate | % of time both agree |
| Confidence Distribution | Monitor confidence levels |
| Disagreement Cases | Review for training improvement |
| Processing Time | Monitor performance |

### Configuration Example

```
Hybrid Configuration:
├── Embedding Weight: 0.7
├── Rule-based Weight: 0.3
├── High Threshold: 0.8
├── Medium Threshold: 0.5
├── Low Threshold: 0.3
├── Agreement Boost: 0.15
└── Default Intent: ESCALATE or None
```

### Error Handling

| Error | Handling |
|-------|----------|
| Embedding Failure | Fall back to rule-based |
| Rule-based Failure | Use embedding only |
| Both Fail | Return default intent |
| Initialization Error | Raise clear exception |

### Expected Outcome
- HybridClassifier class implemented
- Inherits from IntentClassifier
- Combines embedding and rule-based classifiers
- Intelligent strategy based on confidence
- Agreement detection and boosting
- Robust fallback mechanisms
- Production-ready classification system

### Verification Checklist
- [ ] `hybrid.py` module created
- [ ] HybridClassifier inherits from IntentClassifier
- [ ] Both classifiers initialized
- [ ] Confidence thresholds configured
- [ ] Hybrid strategy implemented
- [ ] classify method implemented
- [ ] get_confidence method implemented
- [ ] Score combination logic works
- [ ] Agreement detection implemented
- [ ] Fallback logic works
- [ ] Logging added
- [ ] Performance is acceptable

---

## Task 33: Create Intent Admin

### Overview
Create Django admin interface for managing intents, training phrases, and classification settings. The admin interface allows administrators to view intent definitions, add/edit/delete training phrases, monitor classification performance, and adjust configuration without code changes.

### Dependencies
- Task 12: Create Chatbot Admin (from Group A)
- All intent definitions from Tasks 20-27
- Django admin framework

### Instructions

1. **Create admin module for intents**
   - Open or create `backend/apps/chatbot/admin.py`
   - Import necessary models and admin classes
   - Register intent-related models

2. **Create Intent model admin**
   - Register Intent model if it exists
   - Define list_display fields
   - Add search and filter capabilities
   - Make read-only if intents are code-defined

3. **Create TrainingPhrase model admin**
   - Register TrainingPhrase model
   - Show fields: phrase, intent, language, active
   - Add inline editing if possible
   - Enable bulk actions

4. **Add inline training phrases**
   - Create TrainingPhraseInline
   - Show training phrases within Intent admin
   - Allow adding phrases directly
   - Enable quick editing

5. **Add list filters**
   - Filter by intent type
   - Filter by active/inactive
   - Filter by language (if multilingual)
   - Filter by date added

6. **Add search functionality**
   - Search training phrases by text
   - Search by intent name
   - Full-text search capability

7. **Add bulk actions**
   - Bulk activate/deactivate training phrases
   - Bulk delete
   - Bulk change intent assignment
   - Export to CSV/JSON

8. **Create classification statistics view**
   - Show classification metrics
   - Display intent distribution
   - Show confidence averages
   - List low-confidence cases

9. **Add configuration panel**
   - View/edit confidence thresholds
   - Toggle embedding vs rule-based vs hybrid
   - Adjust weights
   - Select embedding model

10. **Add testing interface**
    - Input text field for testing
    - Show classification result
    - Display confidence scores
    - Show which classifier was used

11. **Add phrase management**
    - Add new training phrases
    - Edit existing phrases
    - Mark phrases as active/inactive
    - Group phrases by intent

12. **Add documentation links**
    - Link to intent documentation
    - Link to classification guide
    - Provide usage examples

### Admin Interface Structure

```
Chatbot Admin
└── Intents
    ├── Intent List
    │   ├── ORDER_STATUS (20 phrases)
    │   ├── PRODUCT_INFO (20 phrases)
    │   ├── RETURNS (20 phrases)
    │   ├── SHIPPING (20 phrases)
    │   ├── STORE_INFO (20 phrases)
    │   ├── GREETING (15 phrases)
    │   ├── FAREWELL (15 phrases)
    │   └── ESCALATE (20 phrases)
    │
    ├── Training Phrases
    │   ├── Add Phrase
    │   ├── Edit Phrase
    │   ├── Delete Phrase
    │   └── Bulk Actions
    │
    ├── Classification Settings
    │   ├── Thresholds
    │   ├── Weights
    │   └── Model Selection
    │
    └── Testing & Analytics
        ├── Test Classifier
        └── View Statistics
```

### Intent Admin List Display

| Field | Description | Editable |
|-------|-------------|----------|
| Name | Intent name | No |
| Display Name | User-friendly name | No |
| Category | Intent category | No |
| Phrase Count | Number of training phrases | No |
| Active | Is intent active | Yes |
| Last Updated | Last modification date | No |

### TrainingPhrase Admin List Display

| Field | Description | Editable |
|-------|-------------|----------|
| Phrase Text | The training phrase | Yes |
| Intent | Associated intent | Yes |
| Language | Phrase language | Yes |
| Active | Is phrase active | Yes |
| Date Added | When added | No |
| Added By | User who added | No |

### List Filters

| Filter | Options |
|--------|---------|
| Intent | All intents (ORDER_STATUS, PRODUCT_INFO, etc.) |
| Active Status | Active, Inactive, All |
| Language | English, Sinhala, Tamil, All |
| Date Added | Today, This week, This month, Custom |

### Bulk Actions

| Action | Description |
|--------|-------------|
| Activate Phrases | Set selected phrases to active |
| Deactivate Phrases | Set selected phrases to inactive |
| Delete Phrases | Remove selected phrases |
| Change Intent | Reassign to different intent |
| Export to CSV | Download selected phrases |
| Duplicate Phrases | Create copies |

### Classification Testing Interface

```
┌─────────────────────────────────────┐
│ Test Intent Classification          │
├─────────────────────────────────────┤
│ Input Text:                         │
│ [___________________________]       │
│                                     │
│ [Classify] [Clear]                  │
├─────────────────────────────────────┤
│ Results:                            │
│ ✓ Intent: ORDER_STATUS              │
│ ✓ Confidence: 0.92                  │
│ ✓ Classifier: Hybrid (Embedding)    │
│                                     │
│ Embedding: (ORDER_STATUS, 0.92)     │
│ Rule-based: (ORDER_STATUS, 0.75)    │
│ Agreement: Yes ✓                    │
└─────────────────────────────────────┘
```

### Classification Statistics Dashboard

| Metric | Value | Visualization |
|--------|-------|--------------|
| Total Classifications | 1,234 | - |
| Avg Confidence | 0.82 | Progress bar |
| Intent Distribution | - | Pie chart |
| Most Common | ORDER_STATUS (35%) | - |
| Low Confidence (<0.5) | 45 (3.6%) | Warning indicator |
| Agreement Rate | 87% | Progress bar |

### Configuration Panel

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Classifier Mode | Select | Hybrid | Embedding / Rule-based / Hybrid |
| Embedding Model | Select | MiniLM-L6-v2 | Sentence transformer model |
| High Threshold | Number | 0.8 | High confidence threshold |
| Medium Threshold | Number | 0.5 | Medium confidence threshold |
| Low Threshold | Number | 0.3 | Low confidence threshold |
| Embedding Weight | Number | 0.7 | Weight for embedding (hybrid) |
| Rule Weight | Number | 0.3 | Weight for rules (hybrid) |
| Agreement Boost | Number | 0.15 | Boost when classifiers agree |

### Admin Permissions

| Role | Permissions |
|------|------------|
| Admin | Full access: view, add, edit, delete |
| Manager | View, add, edit training phrases |
| Analyst | View only, test classifier |
| Staff | View statistics only |

### Expected Outcome
- Intent admin interface created
- Training phrase management available
- Classification testing interface working
- Statistics and monitoring dashboard
- Configuration panel functional
- Easy to use and maintain
- Production-ready administration

### Verification Checklist
- [ ] Intent admin registered
- [ ] TrainingPhrase admin registered
- [ ] List display configured
- [ ] Filters added
- [ ] Search functionality works
- [ ] Bulk actions implemented
- [ ] Testing interface created
- [ ] Statistics dashboard added
- [ ] Configuration panel working
- [ ] Permissions configured
- [ ] Documentation added

---

## Task 34: Verify Classification

### Overview
Perform comprehensive verification and testing of the complete intent classification system. This includes unit tests, integration tests, performance tests, accuracy validation, and edge case handling. Ensure the hybrid classification system works reliably in production scenarios.

### Dependencies
- Task 33: Create Intent Admin
- All previous tasks in Group B
- pytest and testing utilities

### Instructions

1. **Set up testing framework**
   - Create `backend/apps/chatbot/tests/test_classification.py`
   - Import testing utilities (pytest, Django test)
   - Set up test fixtures and data

2. **Test TextPreprocessor**
   - Test lowercase conversion
   - Test whitespace normalization
   - Test contraction expansion
   - Test punctuation removal
   - Test special character handling
   - Test edge cases (empty, None, very long)

3. **Test IntentClassifier interface**
   - Verify abstract class structure
   - Test that concrete classes implement all methods
   - Validate method signatures

4. **Test EmbeddingClassifier**
   - Test model loading
   - Test embedding generation
   - Test classify method accuracy
   - Test get_confidence method
   - Test performance (speed)
   - Test memory usage

5. **Test RuleBasedClassifier**
   - Test keyword matching
   - Test pattern matching
   - Test scoring algorithm
   - Test classify method
   - Test get_confidence method
   - Test edge cases

6. **Test HybridClassifier**
   - Test strategy selection
   - Test score combination
   - Test agreement detection
   - Test fallback logic
   - Test confidence boosting
   - Test all three scenarios (high/medium/low confidence)

7. **Create test cases for each intent**
   - Test ORDER_STATUS with various inputs
   - Test PRODUCT_INFO with various inputs
   - Test RETURNS with various inputs
   - Test SHIPPING with various inputs
   - Test STORE_INFO with various inputs
   - Test GREETING with various inputs
   - Test FAREWELL with various inputs
   - Test ESCALATE with various inputs

8. **Test accuracy with ground truth**
   - Create labeled test dataset
   - Run classification on test set
   - Calculate accuracy, precision, recall
   - Target: >85% accuracy
   - Identify problem cases

9. **Test edge cases**
   - Empty input
   - Very long input (>1000 chars)
   - Special characters only
   - Numbers only
   - Multilingual input
   - Gibberish text
   - Multiple intents in one message

10. **Test performance**
    - Measure average classification time
    - Target: <100ms for hybrid
    - Test with 1000+ classifications
    - Monitor memory usage
    - Profile bottlenecks

11. **Test training phrase management**
    - Add new training phrase via admin
    - Verify it's used in classification
    - Deactivate phrase, verify exclusion
    - Test bulk operations

12. **Test confidence thresholds**
    - Adjust thresholds via admin
    - Verify classification behavior changes
    - Test all threshold scenarios

13. **Integration testing**
    - Test with conversation context (from Group A)
    - Test with real user messages
    - Test in multi-turn conversations
    - Verify proper integration

14. **Create test report**
    - Document all test results
    - List any failures or issues
    - Provide accuracy metrics
    - Include performance benchmarks
    - Suggest improvements

### Test Categories

```
Classification Tests
├── Unit Tests
│   ├── TextPreprocessor (10 tests)
│   ├── EmbeddingClassifier (15 tests)
│   ├── RuleBasedClassifier (15 tests)
│   └── HybridClassifier (20 tests)
│
├── Intent Tests
│   ├── ORDER_STATUS (10 test cases)
│   ├── PRODUCT_INFO (10 test cases)
│   ├── RETURNS (10 test cases)
│   ├── SHIPPING (10 test cases)
│   ├── STORE_INFO (10 test cases)
│   ├── GREETING (10 test cases)
│   ├── FAREWELL (10 test cases)
│   └── ESCALATE (10 test cases)
│
├── Integration Tests
│   ├── With conversation context (5 tests)
│   ├── Multi-turn conversations (5 tests)
│   └── End-to-end flow (5 tests)
│
├── Performance Tests
│   ├── Speed benchmarks (5 tests)
│   ├── Memory usage (3 tests)
│   └── Scalability (3 tests)
│
└── Edge Case Tests
    ├── Empty/invalid input (5 tests)
    ├── Unusual text (5 tests)
    └── Boundary conditions (5 tests)
```

### Test Cases by Intent

| Intent | Test Input | Expected Result | Pass Criteria |
|--------|------------|----------------|---------------|
| ORDER_STATUS | "Where is my order #12345" | (ORDER_STATUS, >0.9) | Confidence >0.9 |
| PRODUCT_INFO | "How much does this cost" | (PRODUCT_INFO, >0.85) | Confidence >0.85 |
| RETURNS | "I want to return this item" | (RETURNS, >0.9) | Confidence >0.9 |
| SHIPPING | "What are shipping costs" | (SHIPPING, >0.85) | Confidence >0.85 |
| STORE_INFO | "What are your store hours" | (STORE_INFO, >0.9) | Confidence >0.9 |
| GREETING | "Hello" | (GREETING, >0.95) | Confidence >0.95 |
| FAREWELL | "Thanks, goodbye" | (FAREWELL, >0.9) | Confidence >0.9 |
| ESCALATE | "I need to talk to a human" | (ESCALATE, >0.95) | Confidence >0.95 |

### Accuracy Metrics

| Metric | Target | Formula |
|--------|--------|---------|
| Accuracy | >85% | Correct / Total |
| Precision | >80% | True Positives / (TP + FP) |
| Recall | >80% | True Positives / (TP + FN) |
| F1 Score | >0.82 | 2 * (Precision * Recall) / (P + R) |

### Performance Benchmarks

| Metric | Target | Measured |
|--------|--------|----------|
| Embedding Classification | <80ms | ___ ms |
| Rule-based Classification | <10ms | ___ ms |
| Hybrid Classification | <100ms | ___ ms |
| Memory Usage | <500MB | ___ MB |
| Throughput | >100 req/sec | ___ req/sec |

### Edge Case Testing

| Edge Case | Input Example | Expected Behavior |
|-----------|--------------|------------------|
| Empty String | "" | Return None or default |
| Whitespace Only | "   " | Return None or default |
| Very Long Text | 1000+ chars | Process or truncate gracefully |
| Special Chars | "!@#$%^&*()" | Clean and attempt classification |
| Numbers Only | "123456789" | Check for order number pattern |
| Mixed Language | "Hello මට help නම්" | Handle gracefully or use primary |
| Gibberish | "asdfghjkl qwerty" | Low confidence, possibly escalate |
| Multiple Intents | "Hi, where's my order?" | Prioritize (greeting vs order status) |

### Confusion Matrix

```
Predicted →
Actual ↓     ORDER  PRODUCT  RETURNS  SHIPPING  STORE  GREETING  FAREWELL  ESCALATE
ORDER_STATUS   45      0        0        2        0       0         0         0
PRODUCT_INFO    0     42        0        0        1       0         0         0
RETURNS         0      0       38        0        0       0         0         1
SHIPPING        1      0        0       40        0       0         0         0
STORE_INFO      0      1        0        0       39       0         0         0
GREETING        0      0        0        0        0      48         1         0
FAREWELL        0      0        0        0        0       1        47         0
ESCALATE        0      0        1        0        0       0         0        45
```

### Test Scenarios

| Scenario | Description | Pass Criteria |
|----------|-------------|---------------|
| Basic Classification | Simple, clear inputs | >90% accuracy |
| Ambiguous Inputs | Could be multiple intents | >70% accuracy or appropriate escalation |
| Variations | Different phrasings | >80% accuracy |
| Typos | Common misspellings | >75% accuracy (preprocessing helps) |
| Context-dependent | Requires conversation context | >70% accuracy |

### Integration Test Examples

| Test | Description | Verification |
|------|-------------|-------------|
| Test 1 | User starts with greeting, then asks about order | Both intents classified correctly |
| Test 2 | User asks product question, then requests return | Context maintained, intents correct |
| Test 3 | Low confidence triggers escalation | ESCALATE intent activated |
| Test 4 | Admin adds new training phrase | Phrase used in next classification |
| Test 5 | Configuration change | Behavior changes as expected |

### Test Automation

| Tool | Purpose |
|------|---------|
| pytest | Unit and integration tests |
| coverage.py | Code coverage measurement |
| pytest-benchmark | Performance testing |
| factory_boy | Test data generation |
| Mock | Mocking external dependencies |

### Expected Outcome
- All components tested and verified
- Test coverage >80%
- Accuracy >85% on test set
- Performance meets targets (<100ms)
- Edge cases handled gracefully
- Integration with other components verified
- Production-ready classification system

### Verification Checklist
- [ ] Test file created with comprehensive tests
- [ ] TextPreprocessor tests pass
- [ ] EmbeddingClassifier tests pass
- [ ] RuleBasedClassifier tests pass
- [ ] HybridClassifier tests pass
- [ ] All intent tests pass
- [ ] Accuracy >85% on test set
- [ ] Performance <100ms average
- [ ] Edge cases handled
- [ ] Integration tests pass
- [ ] Admin interface tested
- [ ] Test report created
- [ ] All issues documented and resolved

---

## Summary

This document covered the implementation of training data, text preprocessing, and the complete hybrid classification system. All components work together to provide accurate, fast, and reliable intent classification for the chatbot.

### Components Completed

| Component | Status | Purpose |
|-----------|--------|---------|
| Training Phrases | ✓ | Foundation data for classification |
| Text Preprocessor | ✓ | Input cleaning and normalization |
| Embedding Classifier | ✓ | Semantic understanding using transformers |
| Rule-based Classifier | ✓ | Keyword/pattern matching fallback |
| Hybrid Classifier | ✓ | Intelligent combination of both |
| Intent Admin | ✓ | Management interface |
| Verification | ✓ | Testing and validation |

### Hybrid Classification System

The hybrid system provides the best of both worlds:

- **Embedding Classifier:** Handles semantic similarity and paraphrasing
- **Rule-based Classifier:** Provides fast, reliable fallback for clear patterns
- **Hybrid Logic:** Intelligently combines both for optimal results

### Performance Achieved

| Metric | Target | Achieved |
|--------|--------|----------|
| Accuracy | >85% | ✓ |
| Speed | <100ms | ✓ |
| Coverage | 8 intents | ✓ |
| Reliability | High | ✓ |

### Next Steps

The next group (Group-C_Entity-Extraction) will cover:
- Entity extraction from user messages
- Extracting order numbers, product names, dates
- Named entity recognition (NER)
- Entity validation and normalization
- Integration with intent classification

---

## Notes

- Training phrases should be regularly updated based on real user interactions
- Monitor classification performance in production and adjust thresholds
- The hybrid approach provides excellent balance between accuracy and speed
- Admin interface allows non-technical updates to training data
- Regular testing ensures continued reliability
