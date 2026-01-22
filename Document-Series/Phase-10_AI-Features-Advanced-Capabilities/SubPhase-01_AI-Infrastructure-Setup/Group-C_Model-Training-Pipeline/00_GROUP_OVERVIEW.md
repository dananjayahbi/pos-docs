# Group C: Model Training Pipeline

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 01 - AI Infrastructure Setup  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Create model training pipeline with job tracking and async execution

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Feature-Store](../Group-B_Feature-Store/)
- **→ Next Group:** [Group-D_Model-Serving](../Group-D_Model-Serving/)

---

## Group Overview

This group implements model training. Creates MLModel model with model_name identifier, model_type for algorithm, version for versioning, status for training/ready/archived, metrics for performance JSON, and artifact_path for storage location. Creates TrainingJob model with job_id, started_at, and completed_at fields. Creates ModelTrainer abstract base class with train and evaluate abstract methods. Creates TrainingPipeline orchestrator with data_preparation. Creates ModelTrainingTask as Celery task. Verifies training pipeline.

### Key Outcomes

- MLModel model
- model_name field
- model_type field
- version field
- status field
- metrics field
- artifact_path field
- TrainingJob model
- job_id field
- started_at field
- completed_at field
- ModelTrainer ABC
- train abstract method
- evaluate abstract method
- TrainingPipeline
- data_preparation
- ModelTrainingTask
- Training pipeline verified

### Technology Context

- **Training:** Async via Celery
- **Storage:** S3/file system
- **Versioning:** Auto-increment
- **Metrics:** JSON storage

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-45_MLModel-TrainingJob.md` | Create models | 35-45 |
| 02 | `02_Tasks-46-52_Trainer-Pipeline-Task.md` | Create trainer and pipeline | 46-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create MLModel Model | Medium | Task 34 |
| 36 | Create model_name Field | Low | Task 35 |
| 37 | Create model_type Field | Low | Task 35 |
| 38 | Create version Field | Low | Task 35 |
| 39 | Create status Field | Low | Task 35 |
| 40 | Create metrics Field | Low | Task 35 |
| 41 | Create artifact_path Field | Low | Task 35 |
| 42 | Create TrainingJob Model | Medium | Task 35 |
| 43 | Create job_id Field | Low | Task 42 |
| 44 | Create started_at Field | Low | Task 42 |
| 45 | Create completed_at Field | Low | Task 42 |
| 46 | Create ModelTrainer ABC | High | Task 45 |
| 47 | Create train Abstract | Low | Task 46 |
| 48 | Create evaluate Abstract | Low | Task 46 |
| 49 | Create TrainingPipeline | High | Task 48 |
| 50 | Create data_preparation | Medium | Task 49 |
| 51 | Create ModelTrainingTask | Medium | Task 50 |
| 52 | Verify Training Pipeline | Low | Task 51 |

---

## Execution Order

```
Task 35: MLModel Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-36      T-37      T-38      T-39     T-40     T-41    T-42
(Name)   (Type)   (Ver)   (Status)(Metric)(Path)(TJob)
    │        │        │        │        │        │        │
    │        │        │        │        │        │   ┌────┼────┬────────┐
    │        │        │        │        │        │   ▼    ▼    ▼        ▼
    │        │        │        │        │        │ T-43  T-44  T-45
    │        │        │        │        │        │(JobID)(Start)(End)
    │        │        │        │        │        │   │    │    │
    └────────┴────────┴────────┴────────┴────────┴───┴────┴────┘
                                                          │
                                                          ▼
                                               Task 46: ModelTrainer ABC
                                                          │
                                                     ┌────┴────┐
                                                     ▼         ▼
                                                  T-47       T-48
                                                (Train)   (Evaluate)
                                                     │         │
                                                     └────┬────┘
                                                          │
                                                          ▼
                                               Task 49: TrainingPipeline
                                                          │
                                                          ▼
                                               Task 50: data_preparation
                                                          │
                                                          ▼
                                               Task 51: ModelTrainingTask
                                                          │
                                                          ▼
                                               Task 52: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        ├── models/
        │   ├── ml_model.py
        │   └── training_job.py
        └── training/
            ├── __init__.py
            ├── base.py
            ├── pipeline.py
            └── tasks.py
```

---

## Notes for AI Agents

### MLModel Model (Task 35)
| Class | MLModel |
|-------|---------|
| Purpose | Store model metadata |
| Unique | model_name + version |

### model_name Field (Task 36)
| Field | Type |
|-------|------|
| Name | model_name |
| Type | CharField(max_length=100) |
| Example | product_recommender |

### model_type Field (Task 37)
| Type | Description |
|------|-------------|
| COLLABORATIVE | Collaborative filtering |
| CONTENT_BASED | Content-based filtering |
| HYBRID | Hybrid approach |
| CLASSIFIER | Classification model |
| REGRESSOR | Regression model |

### version Field (Task 38)
| Field | Type |
|-------|------|
| Name | version |
| Type | IntegerField |
| Auto | Increment on train |

### status Field (Task 39)
| Status | Description |
|--------|-------------|
| TRAINING | Currently training |
| READY | Ready for serving |
| ARCHIVED | Old version |
| FAILED | Training failed |

### metrics Field (Task 40)
| Field | Type |
|-------|------|
| Name | metrics |
| Type | JSONField |
| Example | {"accuracy": 0.95, "f1": 0.92} |

### artifact_path Field (Task 41)
| Field | Type |
|-------|------|
| Name | artifact_path |
| Type | CharField(max_length=500) |
| Example | s3://models/product_rec/v1.pkl |

### TrainingJob Model (Task 42)
| Class | TrainingJob |
|-------|-------------|
| Purpose | Track training jobs |
| FK | MLModel |

### job_id Field (Task 43)
| Field | Type |
|-------|------|
| Name | job_id |
| Type | UUIDField |
| Use | Unique job identifier |

### started_at Field (Task 44)
| Field | Type |
|-------|------|
| Name | started_at |
| Type | DateTimeField |
| Auto | On create |

### completed_at Field (Task 45)
| Field | Type |
|-------|------|
| Name | completed_at |
| Type | DateTimeField |
| Null | True |

### ModelTrainer ABC (Task 46)
| Class | ModelTrainer |
|-------|--------------|
| Type | Abstract Base Class |
| Methods | train, evaluate |

### train Abstract (Task 47)
| Method | train(X, y) |
|--------|-------------|
| Return | Trained model |
| Abstract | Yes |

### evaluate Abstract (Task 48)
| Method | evaluate(model, X_test, y_test) |
|--------|--------------------------------|
| Return | Dict of metrics |
| Abstract | Yes |

### TrainingPipeline (Task 49)
| Class | TrainingPipeline |
|-------|------------------|
| Purpose | Orchestrate training |

### data_preparation (Task 50)
| Method | prepare_data(dataset) |
|--------|----------------------|
| Return | X_train, X_test, y_train, y_test |
| Actions | Clean, split, transform |

### ModelTrainingTask (Task 51)
| Task | train_model_task |
|------|-----------------|
| Type | Celery task |
| Queue | training |
| Priority | Low |
