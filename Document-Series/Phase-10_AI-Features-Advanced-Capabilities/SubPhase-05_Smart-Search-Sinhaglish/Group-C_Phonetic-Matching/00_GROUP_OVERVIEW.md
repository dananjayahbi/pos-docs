# Group C: Phonetic Matching

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** C of F  
> **Tasks Covered:** 37-52  
> **Group Goal:** Implement phonetic encoding and matching for Sinhala

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Core-Dictionary](../Group-B_Core-Dictionary/)
- **→ Next Group:** [Group-D_Search-Integration](../Group-D_Search-Integration/)

---

## Group Overview

This group implements phonetic matching. Creates PhoneticEncoder with SinhalaSoundex algorithm using encode method, Consonant Mapping, Vowel Handling, and Double Letters handling. Creates PhoneticMatcher with find_similar method and Similarity Threshold. Creates Fuzzy Phonetic combination. Creates TransliterationPatterns with th pattern and aa pattern. Creates Pattern Matcher. Creates Index Phonetics for indexing. Verifies phonetic matching.

### Key Outcomes

- PhoneticEncoder
- SinhalaSoundex
- encode method
- Consonant Mapping
- Vowel Handling
- Double Letters
- PhoneticMatcher
- find_similar method
- Similarity Threshold
- Fuzzy Phonetic
- TransliterationPatterns
- th Pattern
- aa Pattern
- Pattern Matcher
- Index Phonetics
- Phonetic verified

### Technology Context

- **Soundex:** Sinhala variant
- **Phonetic:** Sound-based matching
- **Patterns:** Common spellings
- **Fuzzy:** Combined approach

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-37-46_Encoder-Matcher.md` | Create encoder and matcher | 37-46 |
| 02 | `02_Tasks-47-52_Patterns-Index.md` | Create patterns and index | 47-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 37 | Create PhoneticEncoder | High | Task 36 |
| 38 | Create SinhalaSoundex | High | Task 37 |
| 39 | Create encode Method | Medium | Task 38 |
| 40 | Create Consonant Mapping | Medium | Task 39 |
| 41 | Create Vowel Handling | Medium | Task 40 |
| 42 | Create Double Letters | Low | Task 41 |
| 43 | Create PhoneticMatcher | Medium | Task 42 |
| 44 | Create find_similar Method | Medium | Task 43 |
| 45 | Create Similarity Threshold | Low | Task 44 |
| 46 | Create Fuzzy Phonetic | Medium | Task 45 |
| 47 | Create TransliterationPatterns | Medium | Task 36 |
| 48 | Create th Pattern | Low | Task 47 |
| 49 | Create aa Pattern | Low | Task 47 |
| 50 | Create Pattern Matcher | Medium | Task 49 |
| 51 | Create Index Phonetics | Medium | Task 50 |
| 52 | Verify Phonetic | Low | Task 51 |

---

## Execution Order

```
Task 37: PhoneticEncoder
    │
    ▼
Task 38: SinhalaSoundex
    │
    ▼
Task 39: encode
    │
    ▼
Task 40: Consonant Mapping
    │
    ▼
Task 41: Vowel Handling
    │
    ▼
Task 42: Double Letters
    │
    ▼
Task 43: PhoneticMatcher
    │
    ▼
Task 44: find_similar
    │
    ▼
Task 45: Similarity Threshold
    │
    ├─────────────────────────┐
    ▼                         ▼
Task 46: Fuzzy         Task 47: Patterns
    │                         │
    │                    ┌────┴────┐
    │                    ▼         ▼
    │                 T-48       T-49
    │               (th)       (aa)
    │                    │         │
    │                    └────┬────┘
    │                         │
    │                         ▼
    │                  Task 50: Pattern Matcher
    │                         │
    └─────────────────────────┘
                   │
                   ▼
            Task 51: Index Phonetics
                   │
                   ▼
            Task 52: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            └── phonetic/
                ├── __init__.py
                ├── encoder.py
                ├── soundex.py
                ├── matcher.py
                └── patterns.py
```

---

## Notes for AI Agents

### PhoneticEncoder (Task 37)
| Class | PhoneticEncoder |
|-------|-----------------|
| Purpose | Encode to phonetic key |

### SinhalaSoundex (Task 38)
| Class | SinhalaSoundex(PhoneticEncoder) |
|-------|--------------------------------|
| Purpose | Sinhala-specific Soundex |
| Based on | American Soundex |

### Soundex Algorithm
| Step | Action |
|------|--------|
| 1 | Keep first letter |
| 2 | Map consonants to digits |
| 3 | Remove vowels |
| 4 | Remove duplicates |
| 5 | Pad to 4 chars |

### encode Method (Task 39)
| Method | encode(romanized) |
|--------|-------------------|
| Return | 4-char phonetic key |
| Example | "kiri" → "K600" |

### Consonant Mapping (Task 40)
| Group | Letters | Code |
|-------|---------|------|
| Labial | B, F, P, V | 1 |
| Dental | C, G, J, K, Q, S, X, Z | 2 |
| Liquid | D, T | 3 |
| Nasal | L | 4 |
| Other | M, N | 5 |
| Rhotic | R | 6 |

### Sinhala-Specific Consonants
| Pattern | Sound | Code |
|---------|-------|------|
| th | ත | 3 |
| dh | ද | 3 |
| ch | ච | 2 |
| ng | ං | 5 |
| sh | ශ | 2 |

### Vowel Handling (Task 41)
| Vowels | Action |
|--------|--------|
| a, e, i, o, u | Remove (except first) |
| aa, ee, oo | Treat as single |

### Double Letters (Task 42)
| Pattern | Action |
|---------|--------|
| tt, dd, kk | Single consonant |
| ll, mm, nn | Single consonant |

### PhoneticMatcher (Task 43)
| Class | PhoneticMatcher |
|-------|-----------------|
| Purpose | Find similar-sounding words |

### find_similar Method (Task 44)
| Method | find_similar(phonetic_key, limit=10) |
|--------|-------------------------------------|
| Return | List of SinhalaWord |
| Match | Same phonetic key |

### Similarity Threshold (Task 45)
| Threshold | Value |
|-----------|-------|
| Exact | Key matches exactly |
| Close | First 3 chars match |
| Fuzzy | First 2 chars match |

### Fuzzy Phonetic (Task 46)
| Method | fuzzy_phonetic_search(query) |
|--------|------------------------------|
| Combine | Levenshtein + Phonetic |
| Use | When exact fails |

### TransliterationPatterns (Task 47)
| Class | TransliterationPatterns |
|-------|-------------------------|
| Purpose | Common spelling patterns |

### th Pattern (Task 48)
| Pattern | th |
|---------|-----|
| Sinhala | ත (soft t) |
| Examples | thel, thambili, thakkali |

### aa Pattern (Task 49)
| Pattern | aa |
|---------|-----|
| Sinhala | ආ (long a) |
| Examples | kaama, maama, baala |

### Common Patterns
| Pattern | Sinhala | Sound |
|---------|---------|-------|
| th | ත | Soft t |
| dh | ද | Soft d |
| aa | ආ | Long a |
| ee | ඊ | Long e |
| oo | ඕ | Long o |
| ch | ච | Ch |
| ng | ං | Ng |

### Pattern Matcher (Task 50)
| Method | apply_patterns(query) |
|--------|----------------------|
| Action | Normalize to standard |
| Return | Standardized query |

### Index Phonetics (Task 51)
| Action | Index phonetic_key |
|--------|-------------------|
| On | Word creation |
| Update | On word change |
