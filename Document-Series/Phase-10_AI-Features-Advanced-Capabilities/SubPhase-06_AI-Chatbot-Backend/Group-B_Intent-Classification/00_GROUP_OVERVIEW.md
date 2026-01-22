# Group B: Intent Classification

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement intent classification for user messages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Chatbot-Models](../Group-A_Chatbot-Models/)
- **→ Next Group:** [Group-C_Entity-Extraction](../Group-C_Entity-Extraction/)

---

## Group Overview

This group implements intent classification. Creates IntentClassifier with classify method returning intent name and get_confidence returning score. Creates intent definitions for ORDER_STATUS, PRODUCT_INFO, RETURNS, SHIPPING, STORE_INFO, GREETING, FAREWELL, and ESCALATE. Creates Training Phrases seed data. Creates Text Preprocessor for cleaning. Creates Embedding Classifier using sentence embeddings. Creates Rule-based Classifier using keywords. Creates Hybrid Classifier combining both. Creates Intent Admin. Verifies classification.

### Key Outcomes

- IntentClassifier
- classify method
- get_confidence method
- ORDER_STATUS Intent
- PRODUCT_INFO Intent
- RETURNS Intent
- SHIPPING Intent
- STORE_INFO Intent
- GREETING Intent
- FAREWELL Intent
- ESCALATE Intent
- Training Phrases
- Text Preprocessor
- Embedding Classifier
- Rule-based Classifier
- Hybrid Classifier
- Intent Admin
- Classification verified

### Technology Context

- **Embedding:** Sentence transformers
- **Hybrid:** Embedding + rules
- **Confidence:** 0.0 to 1.0
- **Fallback:** Rule-based

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-27_Classifier-Intents.md` | Create classifier and intents | 17-27 |
| 02 | `02_Tasks-28-34_Training-Hybrid.md` | Create training, hybrid, admin | 28-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create IntentClassifier | High | Task 16 |
| 18 | Create classify Method | Medium | Task 17 |
| 19 | Create get_confidence | Low | Task 18 |
| 20 | Create ORDER_STATUS Intent | Low | Task 19 |
| 21 | Create PRODUCT_INFO Intent | Low | Task 19 |
| 22 | Create RETURNS Intent | Low | Task 19 |
| 23 | Create SHIPPING Intent | Low | Task 19 |
| 24 | Create STORE_INFO Intent | Low | Task 19 |
| 25 | Create GREETING Intent | Low | Task 19 |
| 26 | Create FAREWELL Intent | Low | Task 19 |
| 27 | Create ESCALATE Intent | Low | Task 19 |
| 28 | Create Training Phrases | Medium | Task 27 |
| 29 | Create Text Preprocessor | Low | Task 28 |
| 30 | Create Embedding Classifier | High | Task 29 |
| 31 | Create Rule-based Classifier | Medium | Task 30 |
| 32 | Create Hybrid Classifier | Medium | Task 31 |
| 33 | Create Intent Admin | Medium | Task 12 |
| 34 | Verify Classification | Low | Task 33 |

---

## Execution Order

```
Task 17: IntentClassifier
    │
    ▼
Task 18: classify
    │
    ▼
Task 19: get_confidence
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-20     T-21     T-22     T-23     T-24     T-25     T-26     T-27
(Order)(Product)(Return)(Ship) (Store)(Greet)(Bye) (Escalate)
    │        │        │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┴────────┴────────┘
                                    │
                                    ▼
                         Task 28: Training Phrases
                                    │
                                    ▼
                         Task 29: Text Preprocessor
                                    │
                                    ▼
                         Task 30: Embedding Classifier
                                    │
                                    ▼
                         Task 31: Rule-based Classifier
                                    │
                                    ▼
                         Task 32: Hybrid Classifier
                                    │
                                    ▼
                         Task 33: Intent Admin
                                    │
                                    ▼
                         Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── chatbot/
        └── classification/
            ├── __init__.py
            ├── classifier.py
            ├── embedding.py
            ├── rule_based.py
            ├── hybrid.py
            └── preprocessor.py
```

---

## Notes for AI Agents

### IntentClassifier (Task 17)
| Class | IntentClassifier(ABC) |
|-------|----------------------|
| Purpose | Abstract classifier |

### classify Method (Task 18)
| Method | classify(text) |
|--------|----------------|
| Return | (intent_name, confidence) |

### get_confidence (Task 19)
| Method | get_confidence(text, intent) |
|--------|------------------------------|
| Return | Float 0.0 - 1.0 |

### ORDER_STATUS Intent (Task 20)
| Intent | ORDER_STATUS |
|--------|--------------|
| Purpose | Order tracking |

### ORDER_STATUS Phrases
| Phrase |
|--------|
| Where is my order |
| Track my order |
| Order status |
| Order #12345 |
| When will my order arrive |

### PRODUCT_INFO Intent (Task 21)
| Intent | PRODUCT_INFO |
|--------|--------------|
| Purpose | Product questions |

### PRODUCT_INFO Phrases
| Phrase |
|--------|
| Tell me about this product |
| Is this available |
| Product details |
| How much is this |
| What are the features |

### RETURNS Intent (Task 22)
| Intent | RETURNS |
|--------|---------|
| Purpose | Return/refund |

### RETURNS Phrases
| Phrase |
|--------|
| Return policy |
| Want to return |
| Refund request |
| Exchange item |
| Return my order |

### SHIPPING Intent (Task 23)
| Intent | SHIPPING |
|--------|----------|
| Purpose | Delivery questions |

### SHIPPING Phrases
| Phrase |
|--------|
| Delivery time |
| Shipping cost |
| Free delivery |
| How long for delivery |
| Shipping options |

### STORE_INFO Intent (Task 24)
| Intent | STORE_INFO |
|--------|------------|
| Purpose | Store information |

### STORE_INFO Phrases
| Phrase |
|--------|
| Store hours |
| Contact number |
| Store location |
| Working hours |
| Email address |

### GREETING Intent (Task 25)
| Intent | GREETING |
|--------|----------|
| Purpose | Hello messages |

### GREETING Phrases
| Phrase |
|--------|
| Hi |
| Hello |
| Good morning |
| Hey there |
| Good afternoon |

### FAREWELL Intent (Task 26)
| Intent | FAREWELL |
|--------|----------|
| Purpose | Goodbye messages |

### FAREWELL Phrases
| Phrase |
|--------|
| Bye |
| Thanks |
| Goodbye |
| Thank you |
| See you later |

### ESCALATE Intent (Task 27)
| Intent | ESCALATE |
|--------|----------|
| Purpose | Human handoff |

### ESCALATE Phrases
| Phrase |
|--------|
| Talk to human |
| Speak to agent |
| Real person please |
| Customer service |
| Connect me to support |

### Text Preprocessor (Task 29)
| Class | TextPreprocessor |
|-------|------------------|
| Purpose | Clean input text |

### Preprocessing Steps
| Step | Action |
|------|--------|
| 1 | Lowercase |
| 2 | Remove punctuation |
| 3 | Remove extra spaces |
| 4 | Expand contractions |

### Embedding Classifier (Task 30)
| Class | EmbeddingClassifier |
|-------|---------------------|
| Model | sentence-transformers |
| Purpose | Semantic similarity |

### Rule-based Classifier (Task 31)
| Class | RuleBasedClassifier |
|-------|---------------------|
| Purpose | Keyword matching |
| Use | Fallback when low confidence |

### Hybrid Classifier (Task 32)
| Class | HybridClassifier |
|-------|------------------|
| Combine | Embedding + Rule-based |
| Strategy | Embedding first, rule fallback |

### Hybrid Strategy
| Condition | Action |
|-----------|--------|
| Embedding > 0.8 | Use embedding result |
| Embedding 0.5-0.8 | Combine scores |
| Embedding < 0.5 | Use rule-based |

### Intent Admin (Task 33)
| Feature | Admin interface |
|---------|-----------------|
| List | All intents |
| Edit | Training phrases |
| Add | New intents |
