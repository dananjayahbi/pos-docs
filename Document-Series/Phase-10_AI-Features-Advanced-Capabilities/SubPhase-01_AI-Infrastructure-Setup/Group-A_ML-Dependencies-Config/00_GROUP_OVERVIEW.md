# Group A: ML Dependencies & Config

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 01 - AI Infrastructure Setup  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up ML dependencies and Django AI app configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Phase:** [Phase-09_Integrations-Sri-Lanka-Localizations](../../../Phase-09_Integrations-Sri-Lanka-Localizations/)
- **→ Next Group:** [Group-B_Feature-Store](../Group-B_Feature-Store/)

---

## Group Overview

This group sets up ML infrastructure. Creates ML requirements file with dependencies. Installs scikit-learn for ML algorithms, PyTorch for deep learning, sentence-transformers for text embeddings, and numpy/pandas for data processing. Creates ML settings with ML_MODEL_PATH, FEATURE_STORE_BACKEND, and MODEL_REGISTRY_BACKEND. Creates Django AI app with apps.py and __init__.py. Creates ML constants, custom exceptions, and utility functions. Verifies ML setup with import tests.

### Key Outcomes

- ML requirements file
- scikit-learn installed
- PyTorch installed
- Sentence Transformers installed
- numpy/pandas installed
- ML settings
- ML_MODEL_PATH setting
- FEATURE_STORE_BACKEND setting
- MODEL_REGISTRY_BACKEND setting
- AI app created
- apps.py
- __init__.py
- ML constants
- ML exceptions
- ML utilities
- ML setup verified

### Technology Context

- **ML:** scikit-learn
- **DL:** PyTorch
- **Embeddings:** Sentence Transformers
- **Data:** numpy, pandas

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Dependencies-Settings.md` | Create dependencies and settings | 01-08 |
| 02 | `02_Tasks-09-16_App-Constants-Utilities.md` | Create app structure and utilities | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create ML Requirements | Low | Phase-09 |
| 02 | Install scikit-learn | Low | Task 01 |
| 03 | Install PyTorch | Low | Task 01 |
| 04 | Install Sentence Transformers | Low | Task 03 |
| 05 | Install numpy/pandas | Low | Task 01 |
| 06 | Create ML Settings | Medium | Task 05 |
| 07 | Create ML_MODEL_PATH | Low | Task 06 |
| 08 | Create FEATURE_STORE_BACKEND | Low | Task 06 |
| 09 | Create MODEL_REGISTRY_BACKEND | Low | Task 06 |
| 10 | Create AI App | Medium | Task 06 |
| 11 | Create apps.py | Low | Task 10 |
| 12 | Create __init__.py | Low | Task 10 |
| 13 | Create ML Constants | Low | Task 10 |
| 14 | Create ML Exceptions | Low | Task 10 |
| 15 | Create ML Utilities | Medium | Task 14 |
| 16 | Verify ML Setup | Low | Task 15 |

---

## Execution Order

```
Task 01: ML Requirements
    │
    ├─────────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼
T-02       T-03       T-05
(sklearn)(PyTorch) (np/pd)
    │         │         │
    │         ▼         │
    │      T-04        │
    │   (Sentence)     │
    │         │         │
    └─────────┴─────────┘
              │
              ▼
       Task 06: ML Settings
              │
         ┌────┼────┬────────┐
         ▼    ▼    ▼        ▼
       T-07  T-08  T-09    T-10
      (Path)(Feat)(Reg)   (App)
         │    │    │        │
         │    │    │   ┌────┼────┬────────┬────────┐
         │    │    │   ▼    ▼    ▼        ▼        ▼
         │    │    │ T-11  T-12  T-13    T-14
         │    │    │(apps)(init)(Const) (Exc)
         │    │    │   │    │    │        │
         │    │    │   │    │    │        ▼
         │    │    │   │    │    │     T-15
         │    │    │   │    │    │    (Utils)
         │    │    │   │    │    │        │
         └────┴────┴───┴────┴────┴────────┘
                              │
                              ▼
                       Task 16: Verify
```

---

## Expected Deliverables

```
backend/
├── requirements/
│   └── ml.txt
├── config/
│   └── settings/
│       └── ml.py
└── apps/
    └── ai/
        ├── __init__.py
        ├── apps.py
        ├── constants.py
        ├── exceptions.py
        └── utils.py
```

---

## Notes for AI Agents

### ML Requirements (Task 01)
| File | requirements/ml.txt |
|------|---------------------|
| Purpose | ML-specific dependencies |

### scikit-learn (Task 02)
| Package | scikit-learn |
|---------|--------------|
| Version | >=1.3.0 |
| Use | ML algorithms |

### PyTorch (Task 03)
| Package | torch |
|---------|-------|
| Version | >=2.0.0 |
| Use | Deep learning |

### Sentence Transformers (Task 04)
| Package | sentence-transformers |
|---------|----------------------|
| Version | >=2.2.0 |
| Use | Text embeddings |

### numpy/pandas (Task 05)
| Package | Version |
|---------|---------|
| numpy | >=1.24.0 |
| pandas | >=2.0.0 |

### ML Settings (Task 06)
| File | config/settings/ml.py |
|------|----------------------|
| Purpose | ML-specific settings |

### ML_MODEL_PATH (Task 07)
| Setting | ML_MODEL_PATH |
|---------|---------------|
| Default | /var/ml/models |
| Use | Model storage |

### FEATURE_STORE_BACKEND (Task 08)
| Setting | FEATURE_STORE_BACKEND |
|---------|----------------------|
| Options | redis, postgres |
| Default | redis |

### MODEL_REGISTRY_BACKEND (Task 09)
| Setting | MODEL_REGISTRY_BACKEND |
|---------|------------------------|
| Options | file, s3 |
| Default | file |

### AI App (Task 10)
| App | apps.ai |
|-----|---------|
| Location | backend/apps/ai/ |

### apps.py (Task 11)
| Class | AIConfig |
|-------|----------|
| Name | AI |
| Label | ai |

### __init__.py (Task 12)
| File | __init__.py |
|------|-------------|
| Content | default_app_config |

### ML Constants (Task 13)
| Constant | Description |
|----------|-------------|
| MODEL_STATUS_TRAINING | Model training |
| MODEL_STATUS_READY | Ready for serving |
| MODEL_STATUS_ARCHIVED | Archived |

### ML Exceptions (Task 14)
| Exception | Use |
|-----------|-----|
| ModelNotFoundError | Model not in registry |
| FeatureNotFoundError | Feature not defined |
| TrainingError | Training failed |
| InferenceError | Prediction failed |

### ML Utilities (Task 15)
| Function | Purpose |
|----------|---------|
| normalize_features | Normalize feature values |
| encode_categorical | Encode categories |
| split_train_test | Train/test split |
