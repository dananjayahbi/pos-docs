# Group E: Learning System

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** E of F  
> **Tasks Covered:** 67-78  
> **Group Goal:** Implement learning from search behavior

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Search-Integration](../Group-D_Search-Integration/)
- **→ Next Group:** [Group-F_API-Testing](../Group-F_API-Testing/)

---

## Group Overview

This group implements learning. Creates SearchLearning service. Creates TransliterationLog model with query, expanded, and clicked_product FK fields. Creates PatternLearner with identify_patterns and suggest_words methods. Creates PendingWord model. Creates Admin Review UI for approving words. Creates Auto-Add Popular for frequent terms. Verifies learning system.

### Key Outcomes

- SearchLearning
- TransliterationLog model
- query field
- expanded field
- clicked_product FK
- PatternLearner
- identify_patterns method
- suggest_words method
- PendingWord model
- Admin Review UI
- Auto-Add Popular
- Learning verified

### Technology Context

- **Learning:** From click behavior
- **Patterns:** New transliterations
- **Pending:** Review queue
- **Auto-add:** Frequent terms

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-74_Log-Learner.md` | Create log and learner | 67-74 |
| 02 | `02_Tasks-75-78_Pending-Auto-Verify.md` | Create pending, auto-add, verify | 75-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create SearchLearning | Medium | Task 66 |
| 68 | Create TransliterationLog | Medium | Task 67 |
| 69 | Create query Field | Low | Task 68 |
| 70 | Create expanded Field | Low | Task 68 |
| 71 | Create clicked_product FK | Low | Task 68 |
| 72 | Create PatternLearner | High | Task 71 |
| 73 | Create identify_patterns | High | Task 72 |
| 74 | Create suggest_words | Medium | Task 73 |
| 75 | Create PendingWord Model | Medium | Task 74 |
| 76 | Create Admin Review UI | Medium | Task 75 |
| 77 | Create Auto-Add Popular | Medium | Task 76 |
| 78 | Verify Learning | Low | Task 77 |

---

## Execution Order

```
Task 67: SearchLearning
    │
    ▼
Task 68: TransliterationLog
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-69      T-70      T-71
(Query)(Expanded)(Clicked)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 72: PatternLearner
              │
              ▼
       Task 73: identify_patterns
              │
              ▼
       Task 74: suggest_words
              │
              ▼
       Task 75: PendingWord Model
              │
              ▼
       Task 76: Admin Review UI
              │
              ▼
       Task 77: Auto-Add Popular
              │
              ▼
       Task 78: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            ├── models/
            │   ├── transliteration_log.py
            │   └── pending_word.py
            └── services/
                └── learning.py
```

---

## Notes for AI Agents

### SearchLearning (Task 67)
| Class | SearchLearning |
|-------|----------------|
| Purpose | Learn from behavior |

### TransliterationLog (Task 68)
| Class | TransliterationLog |
|-------|-------------------|
| Purpose | Log translations |
| Retention | 90 days |

### query Field (Task 69)
| Field | Type |
|-------|------|
| Name | query |
| Type | CharField(255) |
| Index | True |

### expanded Field (Task 70)
| Field | Type |
|-------|------|
| Name | expanded |
| Type | TextField |
| Use | Expanded query |

### clicked_product FK (Task 71)
| Field | Type |
|-------|------|
| Name | clicked_product |
| FK | Product |
| Null | True |

### TransliterationLog Additional Fields
| Field | Type |
|-------|------|
| customer | FK Customer (null) |
| results_count | IntegerField |
| timestamp | DateTimeField |
| found_match | BooleanField |

### PatternLearner (Task 72)
| Class | PatternLearner |
|-------|----------------|
| Purpose | Learn new patterns |

### Learning Flow
| Step | Action |
|------|--------|
| 1 | Log search |
| 2 | Track clicks |
| 3 | Identify patterns |
| 4 | Suggest additions |

### identify_patterns (Task 73)
| Method | identify_patterns(days=30) |
|--------|---------------------------|
| Return | List of new patterns |
| Source | TransliterationLog |

### Pattern Identification
| Signal | Meaning |
|--------|---------|
| No expansion + click | Unknown word |
| Repeated query + same click | Consistent pattern |
| High frequency | Popular term |

### suggest_words (Task 74)
| Method | suggest_words(patterns) |
|--------|------------------------|
| Return | PendingWord candidates |
| Data | romanized, inferred english |

### Suggestion Algorithm
| Step | Action |
|------|--------|
| 1 | Group similar queries |
| 2 | Find clicked products |
| 3 | Infer English meaning |
| 4 | Create pending entry |

### PendingWord Model (Task 75)
| Class | PendingWord |
|-------|-------------|
| Purpose | Words pending approval |

### PendingWord Fields
| Field | Type |
|-------|------|
| romanized | CharField(100) |
| suggested_english | CharField(200) |
| frequency | IntegerField |
| source_queries | JSONField |
| status | PENDING, APPROVED, REJECTED |
| created_at | DateTimeField |

### Admin Review UI (Task 76)
| Feature | Admin interface |
|---------|-----------------|
| List | Pending words |
| Actions | Approve, Reject, Edit |
| Bulk | Bulk approve |

### Review Actions
| Action | Result |
|--------|--------|
| Approve | Add to dictionary |
| Reject | Mark rejected |
| Edit | Modify before approve |

### Auto-Add Popular (Task 77)
| Feature | Auto-add |
|---------|---------|
| Threshold | 50+ searches |
| Confidence | 80%+ click rate |
| Action | Auto-approve |

### Auto-Add Criteria
| Criterion | Threshold |
|-----------|-----------|
| Search count | >= 50 |
| Click rate | >= 80% |
| Same product | 3+ times |
| Distinct users | >= 10 |
