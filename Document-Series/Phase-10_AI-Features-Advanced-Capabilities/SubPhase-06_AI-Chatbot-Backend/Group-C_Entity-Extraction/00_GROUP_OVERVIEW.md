# Group C: Entity Extraction

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement entity extraction from user messages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Intent-Classification](../Group-B_Intent-Classification/)
- **→ Next Group:** [Group-D_Action-Handlers](../Group-D_Action-Handlers/)

---

## Group Overview

This group implements entity extraction. Creates EntityExtractor with extract method returning entity dictionary. Creates entity types ORDER_ID, PRODUCT_NAME, QUANTITY, DATE, PHONE, and EMAIL. Creates Regex Extractor with patterns for Order ID and Sri Lanka Phone. Creates SpaCy Extractor using NER. Creates Entity Cache. Creates Context Entities from conversation history. Creates Entity Validation. Verifies extraction.

### Key Outcomes

- EntityExtractor
- extract method
- ORDER_ID Entity
- PRODUCT_NAME Entity
- QUANTITY Entity
- DATE Entity
- PHONE Entity
- EMAIL Entity
- Regex Extractor
- Order ID Pattern
- Phone Pattern
- SpaCy Extractor
- Entity Cache
- Context Entities
- Entity Validation
- Extraction verified

### Technology Context

- **Regex:** Pattern matching
- **SpaCy:** NER model
- **Context:** Conversation history
- **Validation:** Business rules

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-45_Extractor-Patterns.md` | Create extractor and patterns | 35-45 |
| 02 | `02_Tasks-46-50_SpaCy-Context-Verify.md` | Create SpaCy, context, verify | 46-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create EntityExtractor | High | Task 34 |
| 36 | Create extract Method | Medium | Task 35 |
| 37 | Create ORDER_ID Entity | Low | Task 36 |
| 38 | Create PRODUCT_NAME Entity | Low | Task 36 |
| 39 | Create QUANTITY Entity | Low | Task 36 |
| 40 | Create DATE Entity | Low | Task 36 |
| 41 | Create PHONE Entity | Low | Task 36 |
| 42 | Create EMAIL Entity | Low | Task 36 |
| 43 | Create Regex Extractor | Medium | Task 42 |
| 44 | Create Order ID Pattern | Low | Task 43 |
| 45 | Create Phone Pattern | Low | Task 43 |
| 46 | Create SpaCy Extractor | High | Task 45 |
| 47 | Create Entity Cache | Medium | Task 46 |
| 48 | Create Context Entities | Medium | Task 47 |
| 49 | Create Entity Validation | Medium | Task 48 |
| 50 | Verify Extraction | Low | Task 49 |

---

## Execution Order

```
Task 35: EntityExtractor
    │
    ▼
Task 36: extract
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-37     T-38     T-39     T-40     T-41     T-42
(Order)(Product)(Qty)  (Date) (Phone)(Email)
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                          │
                          ▼
                   Task 43: Regex Extractor
                          │
                     ┌────┴────┐
                     ▼         ▼
                  T-44       T-45
                (Order)    (Phone)
                     │         │
                     └────┬────┘
                          │
                          ▼
                   Task 46: SpaCy Extractor
                          │
                          ▼
                   Task 47: Entity Cache
                          │
                          ▼
                   Task 48: Context Entities
                          │
                          ▼
                   Task 49: Entity Validation
                          │
                          ▼
                   Task 50: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── chatbot/
        └── extraction/
            ├── __init__.py
            ├── extractor.py
            ├── regex.py
            ├── spacy_ner.py
            ├── context.py
            └── validators.py
```

---

## Notes for AI Agents

### EntityExtractor (Task 35)
| Class | EntityExtractor |
|-------|-----------------|
| Purpose | Extract entities from text |

### extract Method (Task 36)
| Method | extract(text, context=None) |
|--------|----------------------------|
| Return | Dict of entities |

### Extract Response
| Field | Type |
|-------|------|
| entities | Dict[str, List] |
| confidence | Dict[str, float] |

### ORDER_ID Entity (Task 37)
| Entity | ORDER_ID |
|--------|----------|
| Format | #12345, ORD-12345 |
| Pattern | Regex |

### PRODUCT_NAME Entity (Task 38)
| Entity | PRODUCT_NAME |
|--------|--------------|
| Source | Product catalog |
| Match | Fuzzy match |

### QUANTITY Entity (Task 39)
| Entity | QUANTITY |
|--------|----------|
| Format | Numbers |
| Parse | "5", "five" |

### DATE Entity (Task 40)
| Entity | DATE |
|--------|------|
| Format | Various |
| Parse | dateutil |

### Date Examples
| Input | Parsed |
|-------|--------|
| tomorrow | +1 day |
| next week | +7 days |
| 25th March | March 25 |

### PHONE Entity (Task 41)
| Entity | PHONE |
|--------|-------|
| Format | Sri Lanka |
| Pattern | +94, 0xx |

### EMAIL Entity (Task 42)
| Entity | EMAIL |
|--------|-------|
| Pattern | RFC 5322 |
| Validate | Format only |

### Regex Extractor (Task 43)
| Class | RegexExtractor |
|-------|----------------|
| Purpose | Pattern matching |

### Order ID Pattern (Task 44)
| Pattern | Order ID |
|---------|----------|
| Regex | #?\d{5,8} |
| Alt | ORD-\d{5,8} |

### Order ID Examples
| Input | Match |
|-------|-------|
| #12345 | 12345 |
| order 67890 | 67890 |
| ORD-123456 | 123456 |

### Phone Pattern (Task 45)
| Pattern | Sri Lanka Phone |
|---------|-----------------|
| Mobile | \+94[0-9]{9} |
| Local | 0[0-9]{9} |

### Phone Examples
| Input | Normalized |
|-------|------------|
| +94771234567 | +94771234567 |
| 0771234567 | +94771234567 |
| 077 123 4567 | +94771234567 |

### SpaCy Extractor (Task 46)
| Class | SpaCyExtractor |
|-------|----------------|
| Model | en_core_web_sm |
| Purpose | NER extraction |

### SpaCy Entities
| SpaCy Entity | Maps To |
|--------------|---------|
| DATE | DATE |
| TIME | TIME |
| MONEY | PRICE |
| CARDINAL | QUANTITY |
| PERSON | CUSTOMER_NAME |

### Entity Cache (Task 47)
| Purpose | Cache extracted entities |
|---------|-------------------------|
| Key | conversation:{id}:entities |
| TTL | 1 hour |

### Context Entities (Task 48)
| Purpose | Entities from history |
|---------|----------------------|
| Source | Previous messages |
| Priority | Most recent |

### Context Resolution
| Situation | Action |
|-----------|--------|
| "my order" | Look up ORDER_ID from context |
| "that product" | Look up PRODUCT from context |
| "this address" | Look up ADDRESS from context |

### Entity Validation (Task 49)
| Purpose | Validate extracted entities |
|---------|----------------------------|

### Validation Rules
| Entity | Validation |
|--------|------------|
| ORDER_ID | Exists in database |
| PRODUCT_NAME | Exists in catalog |
| PHONE | Valid format |
| EMAIL | Valid format |
