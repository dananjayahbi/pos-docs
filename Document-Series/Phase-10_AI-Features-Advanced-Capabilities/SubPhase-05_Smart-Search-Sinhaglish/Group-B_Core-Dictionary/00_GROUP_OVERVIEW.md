# Group B: Core Dictionary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** B of F  
> **Tasks Covered:** 17-36  
> **Group Goal:** Build core Sinhala dictionary with common words

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Dictionary-Models](../Group-A_Dictionary-Models/)
- **→ Next Group:** [Group-C_Phonetic-Matching](../Group-C_Phonetic-Matching/)

---

## Group Overview

This group builds the dictionary. Creates Grocery Words category with Milk/Dairy (kiri, curd), Rice/Grain (sahal, bath), Meat/Fish (malu, mas), Vegetable, Fruit, and Spice words. Creates Household Words, Clothing Words, Electronics Words, Common Phrases, Color Words, Size Words, and Quantity Words. Creates DictionaryService with lookup and get_variants methods. Creates Dictionary Cache and Dictionary Admin. Verifies dictionary.

### Key Outcomes

- Grocery Words
- Milk/Dairy Words
- Rice/Grain Words
- Meat/Fish Words
- Vegetable Words
- Fruit Words
- Spice Words
- Household Words
- Clothing Words
- Electronics Words
- Common Phrases
- Color Words
- Size Words
- Quantity Words
- DictionaryService
- lookup method
- get_variants method
- Dictionary Cache
- Dictionary Admin
- Dictionary verified

### Technology Context

- **Dictionary:** PostgreSQL
- **Cache:** Redis
- **Categories:** 6+ categories
- **Words:** 400+ entries

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Grocery-Household-Electronics.md` | Create grocery, household, electronics | 17-26 |
| 02 | `02_Tasks-27-36_Phrases-Service-Admin.md` | Create phrases, service, admin | 27-36 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Grocery Words | High | Task 16 |
| 18 | Create Milk/Dairy Words | Medium | Task 17 |
| 19 | Create Rice/Grain Words | Medium | Task 17 |
| 20 | Create Meat/Fish Words | Medium | Task 17 |
| 21 | Create Vegetable Words | Medium | Task 17 |
| 22 | Create Fruit Words | Medium | Task 17 |
| 23 | Create Spice Words | Medium | Task 17 |
| 24 | Create Household Words | Medium | Task 17 |
| 25 | Create Clothing Words | Medium | Task 17 |
| 26 | Create Electronics Words | Low | Task 17 |
| 27 | Create Common Phrases | Medium | Task 17 |
| 28 | Create Color Words | Low | Task 17 |
| 29 | Create Size Words | Low | Task 17 |
| 30 | Create Quantity Words | Low | Task 17 |
| 31 | Create DictionaryService | High | Task 30 |
| 32 | Create lookup Method | Medium | Task 31 |
| 33 | Create get_variants Method | Medium | Task 32 |
| 34 | Create Dictionary Cache | Medium | Task 33 |
| 35 | Create Dictionary Admin | Medium | Task 31 |
| 36 | Verify Dictionary | Low | Task 35 |

---

## Execution Order

```
Task 17: Grocery Words
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-18     T-19     T-20     T-21     T-22     T-23     T-24     T-25     T-26     T-27
(Dairy)(Rice)  (Meat)  (Veg)  (Fruit)(Spice)(House)(Cloth)(Elec) (Phrase)
    │        │        │        │        │        │        │        │        │        │
    │        │        │        │        │        │        │        │        │   ┌────┼────┬────┐
    │        │        │        │        │        │        │        │        │   ▼    ▼    ▼    ▼
    │        │        │        │        │        │        │        │        │ T-28  T-29  T-30
    │        │        │        │        │        │        │        │        │(Color)(Size)(Qty)
    │        │        │        │        │        │        │        │        │   │    │    │
    └────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴───┴────┴────┘
                                                          │
                                                          ▼
                                               Task 31: DictionaryService
                                                          │
                                                     ┌────┴────┐
                                                     ▼         ▼
                                                  T-32       T-35
                                                (lookup)   (Admin)
                                                     │         │
                                                     ▼         │
                                                  T-33        │
                                                (variants)    │
                                                     │         │
                                                     ▼         │
                                                  T-34        │
                                                (Cache)       │
                                                     │         │
                                                     └────┬────┘
                                                          │
                                                          ▼
                                                   Task 36: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            └── dictionary/
                ├── __init__.py
                ├── data/
                │   ├── grocery.py
                │   ├── household.py
                │   ├── clothing.py
                │   └── common.py
                └── service.py
```

---

## Notes for AI Agents

### Milk/Dairy Words (Task 18)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| kiri | කිරි | Milk |
| meekiri | මීකිරි | Butter |
| palathuru | පළතුරු | Curd |
| cheese | චීස් | Cheese |

### Rice/Grain Words (Task 19)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| sahal | සහල් | Rice (raw) |
| bath | බත් | Rice (cooked) |
| thel bath | තෙල් බත් | Fried rice |
| kurakkan | කුරක්කන් | Finger millet |

### Meat/Fish Words (Task 20)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| malu | මළු | Fish |
| mas | මස් | Meat |
| kukul mas | කුකුල් මස් | Chicken |
| uru mas | උරු මස් | Pork |

### Vegetable Words (Task 21)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| elawalu | එළවළු | Vegetables |
| karawila | කරවිල | Bitter gourd |
| bandakka | බණ්ඩක්කා | Okra |
| ala | අල | Potato |

### Fruit Words (Task 22)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| palam | පලම් | Fruit |
| kesel | කෙසෙල් | Banana |
| amba | අඹ | Mango |
| ananas | අන්නාසි | Pineapple |

### Spice Words (Task 23)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| kurundu | කුරුඳු | Cinnamon |
| gammiris | ගම්මිරිස් | Pepper |
| karunapan | කරුණාපාන් | Cloves |
| sadikka | සාදික්කා | Nutmeg |

### Household Words (Task 24)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| watura | වතුර | Water |
| sabun | සබන් | Soap |
| gas | ගෑස් | Gas |
| tel | තෙල් | Oil |

### Clothing Words (Task 25)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| sarama | සරම | Sarong |
| hettaya | හෙට්ටය | Jacket |
| kamisaya | කමිසය | Shirt |
| pattalama | පට්ටලම | Trouser |

### Electronics Words (Task 26)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| phone | දුරකථනය | Phone |
| TV | රූපවාහිනිය | Television |
| computer | පරිගණකය | Computer |
| fridge | ශීතකරණය | Refrigerator |

### Common Phrases (Task 27)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| gana kiyada | ගණ කීයද | How much? |
| me denna | මේ දෙන්න | Give this |
| waediya | වැඩිය | More |
| tikak | ටිකක් | Little |

### Color Words (Task 28)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| kaha | කහ | Yellow |
| nil | නිල් | Blue |
| rathu | රතු | Red |
| sudu | සුදු | White |
| kalu | කළු | Black |

### Size Words (Task 29)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| loku | ලොකු | Big |
| podi | පොඩි | Small |
| maha | මහ | Large |
| adu | අඩු | Less |

### Quantity Words (Task 30)
| Romanized | Sinhala | English |
|-----------|---------|---------|
| eka | එක | One |
| deka | දෙක | Two |
| thuna | තුන | Three |
| kilo | කිලෝ | Kilogram |

### DictionaryService (Task 31)
| Class | DictionaryService |
|-------|-------------------|
| Purpose | Dictionary lookup |

### lookup Method (Task 32)
| Method | lookup(romanized) |
|--------|-------------------|
| Return | SinhalaWord or None |
| Search | romanized + variants |

### get_variants Method (Task 33)
| Method | get_variants(word) |
|--------|-------------------|
| Return | List of all spellings |

### Dictionary Cache (Task 34)
| Key | sinhaglish:lookup:{romanized} |
|-----|-------------------------------|
| TTL | 24 hours |
| Type | Redis hash |
