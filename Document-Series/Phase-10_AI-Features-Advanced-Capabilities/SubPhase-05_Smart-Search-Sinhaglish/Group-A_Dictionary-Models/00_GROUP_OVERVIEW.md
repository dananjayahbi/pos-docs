# Group A: Dictionary Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create Sinhala dictionary and transliteration models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Smart-Search-Backend](../../SubPhase-04_Smart-Search-Backend/)
- **→ Next Group:** [Group-B_Core-Dictionary](../Group-B_Core-Dictionary/)

---

## Group Overview

This group creates dictionary models. Creates SinhalaWord model with sinhala_text for Unicode, romanized for English spelling, english_meaning for translation, phonetic_key for phonetic hash, category and frequency fields. Creates Transliteration model with word FK, variant for alternative spellings, and is_common field. Creates ProductTranslation model with product FK and sinhala_name field. Generates migrations. Verifies models.

### Key Outcomes

- SinhalaWord model
- sinhala_text field
- romanized field
- english_meaning field
- phonetic_key field
- category field
- frequency field
- Transliteration model
- word FK
- variant field
- is_common field
- ProductTranslation model
- product FK
- sinhala_name field
- Dictionary migrations
- Models verified

### Technology Context

- **Unicode:** Sinhala script
- **Romanization:** English spelling
- **Phonetic:** Soundex variant
- **Variants:** Multiple spellings

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-11_SinhalaWord-Transliteration.md` | Create SinhalaWord and Transliteration | 01-11 |
| 02 | `02_Tasks-12-16_ProductTranslation-Migration.md` | Create ProductTranslation and migration | 12-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create SinhalaWord Model | Medium | SubPhase-04 |
| 02 | Create sinhala_text Field | Low | Task 01 |
| 03 | Create romanized Field | Low | Task 01 |
| 04 | Create english_meaning Field | Low | Task 01 |
| 05 | Create phonetic_key Field | Low | Task 01 |
| 06 | Create category Field | Low | Task 01 |
| 07 | Create frequency Field | Low | Task 01 |
| 08 | Create Transliteration Model | Medium | Task 01 |
| 09 | Create word FK | Low | Task 08 |
| 10 | Create variant Field | Low | Task 08 |
| 11 | Create is_common Field | Low | Task 08 |
| 12 | Create ProductTranslation Model | Medium | Task 01 |
| 13 | Create product FK | Low | Task 12 |
| 14 | Create sinhala_name Field | Low | Task 12 |
| 15 | Create Dictionary Migrations | Low | Task 14 |
| 16 | Verify Models | Low | Task 15 |

---

## Execution Order

```
Task 01: SinhalaWord Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-02      T-03      T-04      T-05     T-06     T-07    T-08
(Text)  (Roman)(English)(Phone) (Cat)  (Freq) (Trans)
    │        │        │        │        │        │        │
    │        │        │        │        │        │   ┌────┼────┬────┐
    │        │        │        │        │        │   ▼    ▼    ▼    ▼
    │        │        │        │        │        │ T-09  T-10  T-11  T-12
    │        │        │        │        │        │(Word)(Var)(Common)(Prod)
    │        │        │        │        │        │   │    │    │       │
    │        │        │        │        │        │   │    │    │   ┌───┼───┐
    │        │        │        │        │        │   │    │    │   ▼   ▼   ▼
    │        │        │        │        │        │   │    │    │ T-13 T-14
    │        │        │        │        │        │   │    │    │(Prod)(Name)
    │        │        │        │        │        │   │    │    │   │    │
    └────────┴────────┴────────┴────────┴────────┴───┴────┴────┴───┴────┘
                                                          │
                                                          ▼
                                               Task 15: Migrations
                                                          │
                                                          ▼
                                               Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            ├── __init__.py
            └── models/
                ├── sinhala_word.py
                ├── transliteration.py
                └── product_translation.py
```

---

## Notes for AI Agents

### SinhalaWord Model (Task 01)
| Class | SinhalaWord |
|-------|-------------|
| Purpose | Sinhala dictionary entry |

### sinhala_text Field (Task 02)
| Field | Type |
|-------|------|
| Name | sinhala_text |
| Type | CharField(100) |
| Use | Sinhala Unicode text |

### Sinhala Text Examples
| Sinhala | Meaning |
|---------|---------|
| කිරි | Milk |
| බත් | Rice |
| මළු | Fish |

### romanized Field (Task 03)
| Field | Type |
|-------|------|
| Name | romanized |
| Type | CharField(100) |
| Use | English spelling |
| Index | True |

### Romanized Examples
| Romanized | Sinhala |
|-----------|---------|
| kiri | කිරි |
| bath | බත් |
| malu | මළු |

### english_meaning Field (Task 04)
| Field | Type |
|-------|------|
| Name | english_meaning |
| Type | CharField(200) |
| Use | English translation |

### phonetic_key Field (Task 05)
| Field | Type |
|-------|------|
| Name | phonetic_key |
| Type | CharField(20) |
| Use | Phonetic hash |
| Index | True |

### category Field (Task 06)
| Field | Type |
|-------|------|
| Name | category |
| Type | CharField(50) |
| Choices | grocery, household, clothing, electronics |

### Category Choices
| Category | Description |
|----------|-------------|
| GROCERY | Food and drinks |
| HOUSEHOLD | Home items |
| CLOTHING | Apparel |
| ELECTRONICS | Tech items |
| COLORS | Color words |
| SIZES | Size words |

### frequency Field (Task 07)
| Field | Type |
|-------|------|
| Name | frequency |
| Type | IntegerField |
| Default | 0 |
| Use | Usage count |

### Transliteration Model (Task 08)
| Class | Transliteration |
|-------|-----------------|
| Purpose | Alternative spellings |

### word FK (Task 09)
| Field | Type |
|-------|------|
| Name | word |
| FK | SinhalaWord |
| On delete | CASCADE |

### variant Field (Task 10)
| Field | Type |
|-------|------|
| Name | variant |
| Type | CharField(100) |
| Index | True |

### Variant Examples
| Word | Variants |
|------|----------|
| kiri | keeri, kere, kiree |
| bath | bhath, baath |

### is_common Field (Task 11)
| Field | Type |
|-------|------|
| Name | is_common |
| Type | BooleanField |
| Default | False |

### ProductTranslation Model (Task 12)
| Class | ProductTranslation |
|-------|-------------------|
| Purpose | Product Sinhala names |

### product FK (Task 13)
| Field | Type |
|-------|------|
| Name | product |
| FK | Product |
| OneToOne | True |

### sinhala_name Field (Task 14)
| Field | Type |
|-------|------|
| Name | sinhala_name |
| Type | CharField(200) |
| Use | Product Sinhala name |
