# Tasks 11-16: ForecastModel and Migration

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** A - Forecasting Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-10_Dependencies-Forecast-Model.md](01_Tasks-01-10_Dependencies-Forecast-Model.md)

---

## Document Overview

This document covers the creation of the ForecastModel for storing trained model metadata and generating database migrations. It establishes the model tracking infrastructure with fields for algorithm selection, performance metrics storage, and training timestamps, then generates and applies migrations for both models.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 11 | Create ForecastModel Model | Medium | 30 min |
| 12 | Create algorithm Field | Low | 15 min |
| 13 | Create metrics Field | Low | 20 min |
| 14 | Create trained_at Field | Low | 10 min |
| 15 | Create Forecast Migrations | Low | 15 min |
| 16 | Verify Models | Low | 20 min |

---

## Task 11: Create ForecastModel Model

### Overview
Create the ForecastModel Django model to store metadata about trained forecasting models. This model tracks which machine learning models have been trained for each product, storing algorithm information, performance metrics, and training timestamps. It has a OneToOne relationship with Product, ensuring one trained model per product.

### Dependencies
- Task 04: Create Forecast Model (from previous document)

### Instructions

1. **Create forecast_model.py file**
   - Navigate to `backend/apps/ai/forecasting/models/` directory
   - Create new file named `forecast_model.py`
   - Separate from forecast.py for organization

2. **Import required dependencies**
   - Import Django models and fields
   - Import Product model from inventory
   - Import JSONField for metrics storage
   - Import timezone utilities

3. **Define ForecastModel class**
   - Create class inheriting from models.Model
   - Use descriptive name: `ForecastModel`
   - Add comprehensive docstring

4. **Plan model structure**
   - Product relationship (OneToOneField)
   - Algorithm selection (CharField with choices)
   - Metrics storage (JSONField)
   - Training timestamp (DateTimeField)
   - Metadata fields (created, updated)

5. **Add Meta class**
   - Set verbose names (singular and plural)
   - Define ordering (trained_at descending)
   - Add database table name if needed
   - Configure indexes

6. **Implement __str__ method**
   - Return descriptive representation
   - Include product and algorithm
   - Format: "{algorithm} model for {product}"

7. **Add model methods**
   - get_metric(name) - retrieve specific metric
   - is_recent() - check if model is recently trained
   - needs_retraining() - determine if retraining needed
   - get_accuracy() - get primary accuracy metric

8. **Add model properties**
   - age - days since training
   - is_stale - whether model needs retraining
   - primary_metric - main performance indicator
   - version_string - formatted version identifier

9. **Configure model relationships**
   - OneToOne to Product (one model per product)
   - No direct relationship to Forecast (indirect via Product)
   - Consider CASCADE vs PROTECT delete behavior

10. **Document thoroughly**
    - Field descriptions and purposes
    - Relationship explanations
    - Metric format documentation
    - Query pattern examples

### ForecastModel Structure

```
ForecastModel
├── id (AutoField, PK)
├── product (OneToOneField) → Product
├── algorithm (CharField, choices)
├── metrics (JSONField)
├── trained_at (DateTimeField)
├── created_at (DateTimeField, Auto)
├── updated_at (DateTimeField, Auto)
└── Meta
    ├── verbose_name: "Forecast Model"
    ├── verbose_name_plural: "Forecast Models"
    └── ordering: ['-trained_at']
```

### Model Relationships

| Relationship | Type | Target | On Delete | Constraint |
|--------------|------|--------|-----------|------------|
| product | OneToOneField | Product | CASCADE | One model per product |

### OneToOne vs ForeignKey

| Aspect | OneToOneField | ForeignKey |
|--------|---------------|------------|
| Cardinality | 1:1 | Many:1 |
| Reverse Access | product.forecastmodel | product.forecastmodels.all() |
| Use Case | ✓ One trained model per product | Multiple models per product |
| Uniqueness | Enforced | Not enforced |
| Choice | ✓ Selected | Alternative |

### Field Planning

| Field Name | Django Type | Required | Purpose |
|------------|-------------|----------|---------|
| product | OneToOneField | Yes | Product being modeled |
| algorithm | CharField | Yes | Algorithm type (prophet/arima) |
| metrics | JSONField | Yes | Performance metrics |
| trained_at | DateTimeField | Yes | Training timestamp |

### Model Methods to Implement

| Method | Returns | Purpose |
|--------|---------|---------|
| `__str__()` | str | String representation |
| `get_metric(name)` | float | Get specific metric value |
| `is_recent(days=30)` | bool | Check if trained recently |
| `needs_retraining(days=90)` | bool | Check if retraining needed |
| `get_accuracy()` | float | Get primary accuracy metric |

### Model Properties

| Property | Type | Calculation |
|----------|------|-------------|
| age | int | (now - trained_at).days |
| is_stale | bool | age > 90 days |
| primary_metric | float | metrics.get('MAPE', 0) |
| version_string | str | f"{algorithm}_{trained_at:%Y-%m-%d}" |

### Algorithm Choices (to add in Task 12)

```
Algorithm Options:
├── prophet - Facebook Prophet
│   ├── Best for: Seasonal patterns
│   └── Use: General forecasting
├── arima - Auto-ARIMA
│   ├── Best for: Stable trends
│   └── Use: Non-seasonal data
└── Future: ensemble, lstm, etc.
```

### Metrics Structure (to add in Task 13)

```
Metrics JSON Format:
{
    "MAE": 12.5,        // Mean Absolute Error
    "RMSE": 18.3,       // Root Mean Square Error
    "MAPE": 8.2,        // Mean Absolute Percentage Error
    "R2": 0.85,         // R-squared (optional)
    "samples": 365      // Training data points
}
```

### Retraining Strategy

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Model age | > 90 days | Flag for retraining |
| Performance | MAPE > 20% | Immediate retrain |
| Data updates | New sales data | Consider retrain |
| Manual | Admin request | Force retrain |

### Query Patterns

```
Common Queries:
├── Get model for product
│   └── product.forecastmodel
├── Check if model exists
│   └── hasattr(product, 'forecastmodel')
├── Filter by algorithm
│   └── ForecastModel.objects.filter(algorithm='prophet')
├── Find stale models
│   └── ForecastModel.objects.filter(trained_at__lt=cutoff)
└── Get recent models
    └── ForecastModel.objects.filter(trained_at__gte=recent)
```

### Expected Outcome
- ForecastModel class defined with core structure
- OneToOne relationship to Product configured
- Model methods and properties planned
- Ready for field implementations
- Comprehensive documentation added

### Verification Checklist
- [ ] File `backend/apps/ai/forecasting/models/forecast_model.py` created
- [ ] ForecastModel class defined
- [ ] OneToOneField to Product planned
- [ ] Model docstring comprehensive
- [ ] Meta class defined
- [ ] `__str__` method implemented
- [ ] Model methods stubbed or planned
- [ ] Properties documented
- [ ] Placeholder for fields (added in Tasks 12-14)
- [ ] File follows Django conventions

---

## Task 12: Create algorithm Field

### Overview
Implement the algorithm field in the ForecastModel model. This CharField with choices stores the type of forecasting algorithm used (Prophet or ARIMA). It enables filtering models by algorithm type and supports algorithm comparison and selection strategies.

### Dependencies
- Task 11: Create ForecastModel Model

### Instructions

1. **Define algorithm choices**
   - Create choices tuple or class
   - Include 'prophet' and 'arima' options
   - Use uppercase for choice values convention
   - Add display labels

2. **Add algorithm field**
   - Create CharField named `algorithm`
   - Set max_length=20 (sufficient for algorithm names)
   - Add choices parameter
   - Set as required field

3. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add `db_index=True` for filtering
   - Include `help_text` documentation
   - Set default if applicable

4. **Define choice format**
   - Use tuple: (value, display_label)
   - Example: ('prophet', 'Facebook Prophet')
   - Keep values lowercase for database
   - Use descriptive labels for admin

5. **Add field validation**
   - Choices enforce valid values automatically
   - Consider adding custom validators
   - Document allowed algorithms

6. **Document algorithm characteristics**
   - When to use Prophet vs ARIMA
   - Algorithm strengths and weaknesses
   - Selection criteria

7. **Plan future extensibility**
   - Design for additional algorithms
   - Consider ensemble methods
   - Plan for algorithm deprecation

### Algorithm Choices Definition

| Value | Display Label | Description |
|-------|---------------|-------------|
| `'prophet'` | 'Facebook Prophet' | Time series with seasonality |
| `'arima'` | 'Auto-ARIMA' | Classical statistical approach |

### CharField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | CharField | String with choices |
| max_length | 20 | Accommodate algorithm names |
| choices | ALGORITHM_CHOICES | Restrict to valid algorithms |
| null | False | Required field |
| blank | False | Required in forms |
| db_index | True | Query optimization |
| help_text | 'Forecasting algorithm' | Documentation |

### Choices Implementation Pattern

```
Django Choices Pattern:

Option 1: Tuple
ALGORITHM_CHOICES = [
    ('prophet', 'Facebook Prophet'),
    ('arima', 'Auto-ARIMA'),
]

Option 2: TextChoices (Django 3.0+)
class Algorithm(models.TextChoices):
    PROPHET = 'prophet', 'Facebook Prophet'
    ARIMA = 'arima', 'Auto-ARIMA'
```

### Algorithm Selection Guide

| Algorithm | Best For | Strengths | Limitations |
|-----------|----------|-----------|-------------|
| Prophet | Seasonal patterns | Handles holidays, missing data | Requires sufficient history |
| ARIMA | Stable trends | Statistical rigor | Less robust to outliers |

### Algorithm Characteristics Comparison

```
Prophet:
├── Type: Additive model
├── Seasonality: Automatic detection
├── Trend: Flexible (linear/logistic)
├── Holidays: Built-in support
├── Training Time: Fast (~seconds)
└── Best Use: Business time series

ARIMA:
├── Type: Autoregressive
├── Seasonality: Manual SARIMA
├── Trend: Differencing
├── Holidays: Manual features
├── Training Time: Moderate (~minutes)
└── Best Use: Stationary data
```

### Selection Criteria

| Criterion | Prophet | ARIMA | Decision Logic |
|-----------|---------|-------|----------------|
| Seasonality | Strong | Weak | Prophet if strong seasonality |
| Data History | < 1 year ok | Need 2+ years | Prophet for new products |
| Missing Data | Handles well | Requires imputation | Prophet if gaps exist |
| Performance | Fast | Slower | Prophet for real-time |
| Interpretability | Moderate | High | ARIMA for analysis |

### Query Patterns

```
Algorithm-Based Queries:
├── Count by algorithm
│   └── ForecastModel.objects.values('algorithm').annotate(count=Count('id'))
├── Filter Prophet models
│   └── ForecastModel.objects.filter(algorithm='prophet')
├── Compare algorithms
│   └── Group metrics by algorithm
└── Algorithm performance
    └── Average MAPE by algorithm
```

### Future Algorithm Extensions

| Future Algorithm | Use Case | Prerequisites |
|------------------|----------|---------------|
| ensemble | Combine multiple models | Both prophet and arima trained |
| lstm | Neural network approach | TensorFlow/PyTorch installed |
| xgboost | Gradient boosting | Feature engineering |
| seasonal_naive | Simple baseline | Minimal (for comparison) |

### Expected Outcome
- algorithm field added to ForecastModel
- CharField with choices restricts valid values
- Database index enables efficient filtering
- Algorithm selection documented
- Ready for algorithm tracking

### Verification Checklist
- [ ] algorithm field added to ForecastModel
- [ ] CharField with max_length=20
- [ ] choices parameter defined with prophet and arima
- [ ] Field is required (null=False, blank=False)
- [ ] db_index=True for performance
- [ ] help_text describes algorithm purpose
- [ ] Choices use tuple format: (value, label)
- [ ] No syntax errors in model
- [ ] Algorithm characteristics documented

---

## Task 13: Create metrics Field

### Overview
Implement the metrics field in the ForecastModel model. This JSONField stores performance metrics for the trained model, including MAE (Mean Absolute Error), RMSE (Root Mean Square Error), and MAPE (Mean Absolute Percentage Error). It provides a flexible structure for storing various model evaluation metrics.

### Dependencies
- Task 11: Create ForecastModel Model

### Instructions

1. **Add metrics field**
   - Create JSONField named `metrics`
   - Position after algorithm field
   - Use JSON for flexible metric storage

2. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add `default=dict` for empty initialization
   - Include `help_text` documentation
   - Consider validators for structure

3. **Define metrics structure**
   - Document expected JSON format
   - List required metric keys
   - Define value types (floats)
   - Plan for optional metrics

4. **Document standard metrics**
   - MAE: Mean Absolute Error
   - RMSE: Root Mean Square Error
   - MAPE: Mean Absolute Percentage Error
   - Optional: R², training samples, etc.

5. **Add metric descriptions**
   - Explain each metric's meaning
   - Document interpretation (lower is better)
   - Provide acceptable ranges
   - Note metric units

6. **Plan metric validation**
   - Consider custom validator
   - Ensure required keys present
   - Validate value types
   - Check reasonable ranges

7. **Document metric usage**
   - How metrics are calculated
   - When metrics are updated
   - Metric comparison across models
   - Performance thresholds

### JSONField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | JSONField | Flexible JSON storage |
| null | False | Required field |
| blank | False | Required in forms |
| default | dict | Empty dict initialization |
| help_text | 'Model performance metrics' | Documentation |

### Metrics Structure Format

```
Standard Metrics JSON:
{
    "MAE": 12.5,
    "RMSE": 18.3,
    "MAPE": 8.2,
    "R2": 0.85,
    "samples": 365,
    "training_date": "2026-01-15"
}

Required Keys:
├── MAE (float)
├── RMSE (float)
└── MAPE (float)

Optional Keys:
├── R2 (float)
├── samples (int)
├── training_date (string)
└── Custom metrics
```

### Standard Metrics Definitions

| Metric | Full Name | Formula Concept | Unit | Interpretation |
|--------|-----------|-----------------|------|----------------|
| MAE | Mean Absolute Error | Avg absolute difference | Units | Lower is better |
| RMSE | Root Mean Square Error | Sqrt of avg squared error | Units | Lower is better |
| MAPE | Mean Absolute % Error | Avg % difference | Percentage | Lower is better |
| R² | Coefficient of Determination | Variance explained | 0-1 | Higher is better |

### Metric Interpretation Guide

```
MAE (Mean Absolute Error):
├── Calculation: Average of |predicted - actual|
├── Unit: Same as demand (quantity)
├── Interpretation:
│   ├── < 5 units: Excellent
│   ├── 5-15 units: Good
│   ├── 15-30 units: Fair
│   └── > 30 units: Poor
└── Use: Easy to understand, same scale as data

RMSE (Root Mean Square Error):
├── Calculation: sqrt(average of (predicted - actual)²)
├── Unit: Same as demand (quantity)
├── Interpretation:
│   ├── RMSE > MAE: Large errors present
│   ├── RMSE ≈ MAE: Consistent errors
│   └── Penalizes large errors more
└── Use: More sensitive to outliers

MAPE (Mean Absolute Percentage Error):
├── Calculation: Average of |predicted - actual| / actual * 100
├── Unit: Percentage (%)
├── Interpretation:
│   ├── < 10%: Excellent
│   ├── 10-20%: Good
│   ├── 20-30%: Fair
│   └── > 30%: Poor
└── Use: Scale-independent, easy comparison
```

### Performance Thresholds

| Metric | Excellent | Good | Fair | Poor |
|--------|-----------|------|------|------|
| MAPE | < 10% | 10-20% | 20-30% | > 30% |
| R² | > 0.9 | 0.7-0.9 | 0.5-0.7 | < 0.5 |

### Metric Calculation Timing

```
Metric Lifecycle:
├── Training Phase
│   ├── Split data (train/validation)
│   ├── Fit model on training set
│   ├── Predict on validation set
│   └── Calculate metrics
├── Storage
│   └── Store in ForecastModel.metrics
└── Monitoring
    ├── Track metrics over time
    ├── Compare model versions
    └── Trigger retraining if degraded
```

### Accessing Metrics

```
Metric Access Patterns:
├── Get all metrics
│   └── model.metrics
├── Get specific metric
│   └── model.metrics.get('MAPE', 0)
├── Get metric via method
│   └── model.get_metric('MAE')
└── Check metric exists
    └── 'RMSE' in model.metrics
```

### Validation Strategy

| Validation Type | Check | Implementation |
|-----------------|-------|----------------|
| Structure | Required keys present | Custom validator |
| Types | Values are numeric | Type checking |
| Ranges | Values are reasonable | Range validation |
| Completeness | All metrics provided | Required keys check |

### Example Metrics by Scenario

| Scenario | MAE | RMSE | MAPE | R² | Assessment |
|----------|-----|------|------|----|------------|
| Excellent model | 3.2 | 4.8 | 5.1% | 0.94 | Production-ready |
| Good model | 8.5 | 12.3 | 12.5% | 0.82 | Acceptable |
| Fair model | 18.7 | 25.4 | 24.3% | 0.68 | Needs improvement |
| Poor model | 42.1 | 58.9 | 38.7% | 0.43 | Requires retraining |

### Expected Outcome
- metrics field added to ForecastModel
- JSONField stores flexible metric structure
- Standard metrics (MAE, RMSE, MAPE) defined
- Metric interpretation documented
- Ready for performance tracking

### Verification Checklist
- [ ] metrics field added to model
- [ ] JSONField type used
- [ ] default=dict configured
- [ ] Field is required (null=False, blank=False)
- [ ] help_text describes metrics purpose
- [ ] Standard metrics documented (MAE, RMSE, MAPE)
- [ ] Metric interpretations explained
- [ ] JSON structure format specified
- [ ] No syntax errors in model

---

## Task 14: Create trained_at Field

### Overview
Implement the trained_at field in the ForecastModel model. This DateTimeField stores the timestamp when the model was trained. It's essential for tracking model age, determining when retraining is needed, and generating version identifiers.

### Dependencies
- Task 11: Create ForecastModel Model

### Instructions

1. **Add trained_at field**
   - Create DateTimeField named `trained_at`
   - Position after metrics field
   - Use timezone-aware datetime

2. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add `db_index=True` for time-based queries
   - Consider `auto_now_add=False` (manual setting)
   - Include `help_text` documentation

3. **Configure timezone handling**
   - Use timezone-aware datetime
   - Set USE_TZ=True in Django settings
   - Store in UTC, display in local timezone
   - Document timezone behavior

4. **Add field documentation**
   - Explain when timestamp is set
   - Document timezone storage (UTC)
   - Note use in version generation
   - Describe retraining logic

5. **Plan timestamp setting**
   - Set when model training completes
   - Update on retraining
   - Use timezone.now() for current time
   - Consider manual vs automatic

6. **Configure indexing**
   - Enable for date range queries
   - Support age calculations
   - Optimize stale model detection

7. **Document business logic**
   - Model age calculation
   - Retraining schedule (e.g., 90 days)
   - Version string generation
   - Model freshness checks

### DateTimeField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | DateTimeField | Timestamp storage |
| null | False | Required field |
| blank | False | Required in forms |
| db_index | True | Query optimization |
| auto_now_add | False | Manual control |
| help_text | 'Model training timestamp' | Documentation |

### DateTimeField vs DateField

| Aspect | DateTimeField | DateField |
|--------|---------------|-----------|
| Precision | Date + Time | Date only |
| Timezone | Aware/Naive | N/A |
| Use Case | ✓ Training timestamp | Event date |
| Storage | TIMESTAMP | DATE |
| Query | More precise | Day-level |

### Timezone Handling

```
Timezone Strategy:
├── Storage: UTC (database)
├── Application: Timezone-aware datetime
├── Display: Local timezone conversion
└── Settings: USE_TZ = True

Example:
├── Training: 2026-01-15 10:30:00 UTC
├── Display (Sri Lanka): 2026-01-15 16:00:00 +0530
└── Calculation: timezone.now() - trained_at
```

### Timestamp Setting Pattern

```
Training Workflow:
├── 1. Train model
├── 2. Calculate metrics
├── 3. Create ForecastModel instance
│   └── trained_at = timezone.now()
├── 4. Save to database
└── 5. Generate version string from trained_at
```

### Model Age Calculation

| Age Range | Status | Action |
|-----------|--------|--------|
| 0-30 days | Fresh | No action needed |
| 31-60 days | Aging | Monitor performance |
| 61-90 days | Old | Plan retraining |
| 90+ days | Stale | Retrain required |

### Query Patterns

```
Time-Based Queries:
├── Recent models (last 30 days)
│   └── ForecastModel.objects.filter(trained_at__gte=cutoff)
├── Stale models (> 90 days)
│   └── ForecastModel.objects.filter(trained_at__lt=stale_date)
├── Models needing retraining
│   └── Filter by trained_at and performance
├── Training history
│   └── Order by trained_at descending
└── Average model age
    └── Aggregate trained_at differences
```

### Version String Generation

```
Version String from Timestamp:
├── Format: {algorithm}_{date}
├── Example: "prophet_2026-01-15"
├── Extraction: trained_at.strftime('%Y-%m-%d')
└── Usage: Forecast.model_version

Implementation:
@property
def version_string(self):
    date_str = self.trained_at.strftime('%Y-%m-%d')
    return f"{self.algorithm}_{date_str}"
```

### Retraining Logic

| Trigger | Condition | Implementation |
|---------|-----------|----------------|
| Time-based | trained_at > 90 days ago | Scheduled check |
| Performance | MAPE degradation | Monitor metrics |
| Manual | Admin request | API endpoint |
| Data update | New sales data available | Event-driven |

### Index Benefits

| Query Type | Benefit | Example |
|------------|---------|---------|
| Date range | Fast filtering | trained_at__range=[start, end] |
| Ordering | Efficient sort | order_by('-trained_at') |
| Age calculation | Quick comparison | trained_at__lt=threshold |
| Analytics | Aggregate queries | Avg age, count by period |

### Expected Outcome
- trained_at field added to ForecastModel
- DateTimeField with timezone awareness
- Database index for time-based queries
- Timestamp enables age tracking and retraining logic
- Version string generation supported

### Verification Checklist
- [ ] trained_at field added to model
- [ ] DateTimeField type used
- [ ] Field is required (null=False, blank=False)
- [ ] db_index=True for performance
- [ ] help_text documents training timestamp
- [ ] Timezone awareness configured (USE_TZ=True)
- [ ] Field positioned after metrics
- [ ] Retraining logic documented
- [ ] Version generation explained
- [ ] No syntax errors in model
- [ ] All ForecastModel fields now complete

---

## Task 15: Create Forecast Migrations

### Overview
Generate Django database migrations for both the Forecast and ForecastModel models. This task creates migration files that define the database schema changes, including tables, fields, indexes, and constraints. Running these migrations will create the necessary database tables in the PostgreSQL schema.

### Dependencies
- Task 14: Create trained_at Field (all fields complete)

### Instructions

1. **Update models __init__.py**
   - Navigate to `backend/apps/ai/forecasting/models/`
   - Open or create `__init__.py` file
   - Import both Forecast and ForecastModel
   - Export via __all__ list

2. **Verify model definitions**
   - Review Forecast model completeness
   - Review ForecastModel model completeness
   - Check all imports are correct
   - Ensure no syntax errors

3. **Check Django app registration**
   - Verify 'ai.forecasting' in INSTALLED_APPS
   - Ensure app config is correct
   - Check app label if custom

4. **Run makemigrations command**
   - Execute Django makemigrations
   - Target specific app: forecasting
   - Review migration file preview
   - Verify all fields captured

5. **Review generated migration**
   - Open migration file in migrations directory
   - Verify Forecast table creation
   - Verify ForecastModel table creation
   - Check field definitions

6. **Verify migration operations**
   - Check CreateModel operations
   - Verify field types correct
   - Confirm indexes created
   - Validate constraints added

7. **Verify foreign key relationships**
   - Forecast → Product (ForeignKey)
   - ForecastModel → Product (OneToOneField)
   - Check on_delete behavior
   - Verify related_name

8. **Check unique constraints**
   - Forecast: unique_together (product, forecast_date)
   - ForecastModel: OneToOne ensures uniqueness
   - Verify constraint names

9. **Review indexes**
   - Forecast: product, forecast_date, model_version
   - ForecastModel: product (OneToOne), algorithm, trained_at
   - Check index names

10. **Document migration**
    - Note migration number/name
    - Document what it creates
    - Record any special considerations
    - Prepare for next task (running migration)

### Migration Generation Process

```
Migration Creation Steps:
├── 1. Verify models complete
│   ├── Forecast: 7 fields defined
│   └── ForecastModel: 4 fields defined
├── 2. Export models in __init__.py
├── 3. Run: python manage.py makemigrations forecasting
├── 4. Review generated file
└── 5. Prepare for applying migration
```

### models/__init__.py Structure

```
Expected __init__.py Content:
from .forecast import Forecast
from .forecast_model import ForecastModel

__all__ = ['Forecast', 'ForecastModel']
```

### Generated Migration Structure

```
Migration File: XXXX_initial.py
├── dependencies: []
├── operations:
    ├── CreateModel: Forecast
    │   ├── id (AutoField)
    │   ├── product (ForeignKey → Product)
    │   ├── forecast_date (DateField, indexed)
    │   ├── predicted_demand (FloatField)
    │   ├── confidence_low (FloatField)
    │   ├── confidence_high (FloatField)
    │   ├── model_version (CharField, indexed)
    │   ├── created_at (DateTimeField)
    │   ├── updated_at (DateTimeField)
    │   └── unique_together: (product, forecast_date)
    ├── CreateModel: ForecastModel
    │   ├── id (AutoField)
    │   ├── product (OneToOneField → Product)
    │   ├── algorithm (CharField, choices, indexed)
    │   ├── metrics (JSONField)
    │   ├── trained_at (DateTimeField, indexed)
    │   ├── created_at (DateTimeField)
    │   └── updated_at (DateTimeField)
    └── Indexes created automatically for marked fields
```

### Database Tables Created

| Model | Table Name | Primary Key | Foreign Keys |
|-------|------------|-------------|--------------|
| Forecast | forecasting_forecast | id | product_id → Product |
| ForecastModel | forecasting_forecastmodel | id | product_id → Product |

### Field Mappings to Database

| Model Field | Database Column | Type | Constraints |
|-------------|-----------------|------|-------------|
| Forecast.product | product_id | INTEGER | FK, NOT NULL, INDEXED |
| Forecast.forecast_date | forecast_date | DATE | NOT NULL, INDEXED |
| Forecast.predicted_demand | predicted_demand | DOUBLE PRECISION | NOT NULL |
| Forecast.confidence_low | confidence_low | DOUBLE PRECISION | NOT NULL |
| Forecast.confidence_high | confidence_high | DOUBLE PRECISION | NOT NULL |
| Forecast.model_version | model_version | VARCHAR(50) | NOT NULL, INDEXED |
| ForecastModel.product | product_id | INTEGER | FK, UNIQUE, NOT NULL |
| ForecastModel.algorithm | algorithm | VARCHAR(20) | NOT NULL, INDEXED |
| ForecastModel.metrics | metrics | JSONB | NOT NULL |
| ForecastModel.trained_at | trained_at | TIMESTAMP | NOT NULL, INDEXED |

### Constraints Created

| Constraint Type | Model | Definition | Purpose |
|-----------------|-------|------------|---------|
| Unique | Forecast | (product_id, forecast_date) | One forecast per product per date |
| Foreign Key | Forecast | product_id → Product.id | Referential integrity |
| Foreign Key | ForecastModel | product_id → Product.id | Referential integrity |
| Unique | ForecastModel | product_id (OneToOne) | One model per product |

### Indexes Created

```
Forecast Indexes:
├── forecasting_forecast_pkey (PRIMARY KEY on id)
├── forecasting_forecast_product_id_idx (on product_id)
├── forecasting_forecast_forecast_date_idx (on forecast_date)
├── forecasting_forecast_model_version_idx (on model_version)
└── forecasting_forecast_product_date_uniq (unique on product_id, forecast_date)

ForecastModel Indexes:
├── forecasting_forecastmodel_pkey (PRIMARY KEY on id)
├── forecasting_forecastmodel_product_id_key (unique on product_id)
├── forecasting_forecastmodel_algorithm_idx (on algorithm)
└── forecasting_forecastmodel_trained_at_idx (on trained_at)
```

### Verification Commands

| Command | Purpose |
|---------|---------|
| `python manage.py makemigrations forecasting` | Generate migrations |
| `python manage.py showmigrations forecasting` | List migrations |
| `python manage.py sqlmigrate forecasting 0001` | Preview SQL |

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No changes detected | Models not imported | Update __init__.py |
| Import errors | Missing dependencies | Check imports |
| Circular imports | Import structure | Use string references |
| Missing app | Not in INSTALLED_APPS | Add to settings |

### Expected Outcome
- Migration file generated successfully
- Both models included in migration
- All fields, indexes, and constraints defined
- Migration ready to be applied
- No errors in migration generation

### Verification Checklist
- [ ] Models exported in `__init__.py`
- [ ] `makemigrations` command executed successfully
- [ ] Migration file created in migrations directory
- [ ] Migration includes Forecast model creation
- [ ] Migration includes ForecastModel model creation
- [ ] All fields present in migration
- [ ] Foreign key relationships correct
- [ ] Unique constraints included
- [ ] Indexes defined for indexed fields
- [ ] No migration errors or warnings
- [ ] Migration number/name documented

---

## Task 16: Verify Models

### Overview
Apply the generated migrations to the database and comprehensively verify that both models are correctly created and functional. This task validates the database schema, tests model operations, checks constraints, and ensures the forecasting models are production-ready.

### Dependencies
- Task 15: Create Forecast Migrations

### Instructions

1. **Apply migrations**
   - Run Django migrate command
   - Target forecasting app or run all
   - Monitor migration output
   - Verify successful completion

2. **Check migration status**
   - Run showmigrations command
   - Confirm forecasting migration applied
   - Verify checkmark appears
   - Note migration number

3. **Verify database tables**
   - Access PostgreSQL database
   - List tables in schema
   - Confirm forecasting_forecast exists
   - Confirm forecasting_forecastmodel exists

4. **Verify table structure**
   - Describe Forecast table
   - Check all columns present
   - Verify data types correct
   - Check constraints and indexes

5. **Test model imports**
   - Open Django shell
   - Import Forecast model
   - Import ForecastModel model
   - Verify no import errors

6. **Test model creation**
   - Create test Forecast instance
   - Create test ForecastModel instance
   - Save to database
   - Verify no errors

7. **Test relationships**
   - Create Forecast with product FK
   - Create ForecastModel with product OneToOne
   - Access reverse relationships
   - Verify CASCADE behavior

8. **Test unique constraints**
   - Attempt duplicate Forecast (same product + date)
   - Verify IntegrityError raised
   - Attempt duplicate ForecastModel (same product)
   - Verify constraint enforcement

9. **Test field validation**
   - Test required fields (blank/null)
   - Test non-negative validators
   - Test choice field (algorithm)
   - Test JSONField (metrics)

10. **Test model methods**
    - Test __str__ methods
    - Test custom methods (if implemented)
    - Test properties (if implemented)
    - Verify expected behavior

11. **Test queries**
    - Filter forecasts by product
    - Filter forecasts by date range
    - Filter models by algorithm
    - Order by various fields

12. **Verify indexes**
    - Check query execution plans
    - Confirm indexes used
    - Test query performance
    - Validate optimization

13. **Document verification**
    - Record verification results
    - Note any issues found
    - Document workarounds if needed
    - Confirm production-ready status

### Migration Application Process

```
Apply Migration Steps:
├── 1. Run: python manage.py migrate forecasting
├── 2. Observe output: "Running migration..."
├── 3. Confirm: "Applied forecasting.0001_initial"
└── 4. Verify: python manage.py showmigrations forecasting
    └── [X] 0001_initial
```

### Database Verification Commands

| Task | PostgreSQL Command | Purpose |
|------|-------------------|---------|
| List tables | `\dt` | Show all tables |
| Describe Forecast | `\d forecasting_forecast` | Show table structure |
| Describe ForecastModel | `\d forecasting_forecastmodel` | Show table structure |
| List indexes | `\di forecasting_*` | Show indexes |
| Show constraints | `\d+ forecasting_forecast` | Detailed table info |

### Django Shell Tests

```
Model Creation Test:
from ai.forecasting.models import Forecast, ForecastModel
from inventory.models import Product
from django.utils import timezone
from datetime import date

# Get test product
product = Product.objects.first()

# Test Forecast creation
forecast = Forecast.objects.create(
    product=product,
    forecast_date=date(2026, 2, 15),
    predicted_demand=100.5,
    confidence_low=85.0,
    confidence_high=115.0,
    model_version='prophet_2026-01-15'
)
print(forecast)  # Should print string representation

# Test ForecastModel creation
model = ForecastModel.objects.create(
    product=product,
    algorithm='prophet',
    metrics={'MAE': 10.5, 'RMSE': 15.2, 'MAPE': 8.5},
    trained_at=timezone.now()
)
print(model)  # Should print string representation
```

### Relationship Tests

```
Foreign Key Test (Forecast):
├── Create forecast with product
├── Access: product.forecasts.all()
├── Filter: product.forecasts.filter(forecast_date__gte=today)
└── Delete product → cascades to forecasts

OneToOne Test (ForecastModel):
├── Create model with product
├── Access: product.forecastmodel
├── Check existence: hasattr(product, 'forecastmodel')
└── One product → one model only
```

### Constraint Verification

| Constraint | Test | Expected Result |
|------------|------|-----------------|
| Unique (Forecast) | Create duplicate (same product+date) | IntegrityError |
| Unique (ForecastModel) | Create duplicate (same product) | IntegrityError |
| Foreign Key | Create with invalid product_id | IntegrityError |
| Not Null | Create without required field | IntegrityError |
| Positive (demand) | Create with negative value | ValidationError |

### Query Performance Tests

```
Index Utilization Tests:
├── Forecast by product
│   └── Forecast.objects.filter(product=product)
│   └── Should use product_id index
├── Forecast by date range
│   └── Forecast.objects.filter(forecast_date__range=[start, end])
│   └── Should use forecast_date index
├── ForecastModel by algorithm
│   └── ForecastModel.objects.filter(algorithm='prophet')
│   └── Should use algorithm index
└── Check with EXPLAIN ANALYZE
```

### Validation Test Cases

| Test Case | Input | Expected Outcome |
|-----------|-------|------------------|
| Required fields | Missing forecast_date | ValidationError |
| Non-negative | predicted_demand = -10 | ValidationError |
| Choice field | algorithm = 'invalid' | ValidationError |
| JSON field | metrics = "string" | ValidationError |
| Date format | forecast_date = "invalid" | ValidationError |

### Complete Verification Checklist

```
Database Level:
├── [ ] Tables created (forecasting_forecast, forecasting_forecastmodel)
├── [ ] All columns present
├── [ ] Data types correct
├── [ ] Primary keys created
├── [ ] Foreign keys created
└── [ ] Indexes created

Model Level:
├── [ ] Imports successful
├── [ ] Instance creation works
├── [ ] __str__ methods return strings
├── [ ] Required fields enforced
└── [ ] Validators work correctly

Relationship Level:
├── [ ] Forecast.product (ForeignKey) works
├── [ ] ForecastModel.product (OneToOne) works
├── [ ] Reverse relations accessible
└── [ ] CASCADE delete behavior works

Constraint Level:
├── [ ] Unique constraint enforced (Forecast)
├── [ ] OneToOne constraint enforced (ForecastModel)
├── [ ] Not null constraints enforced
└── [ ] Custom validators work

Query Level:
├── [ ] Filter queries work
├── [ ] Indexes used in queries
├── [ ] Ordering works
└── [ ] Aggregations work
```

### Expected Outcome
- Migrations applied successfully to database
- Both database tables created with correct schema
- All fields, indexes, and constraints in place
- Model CRUD operations functional
- Relationships working correctly
- Constraints enforced properly
- Models production-ready

### Verification Checklist
- [ ] `migrate` command executed successfully
- [ ] Migration shows as applied in showmigrations
- [ ] Database tables exist and visible
- [ ] Table schemas match model definitions
- [ ] Model imports work in Django shell
- [ ] Can create Forecast instances
- [ ] Can create ForecastModel instances
- [ ] Foreign key relationship functional
- [ ] OneToOne relationship functional
- [ ] Unique constraints enforced
- [ ] Validators prevent invalid data
- [ ] `__str__` methods work correctly
- [ ] Filter queries execute successfully
- [ ] Indexes improve query performance
- [ ] Documentation updated with verification results
- [ ] Models ready for production use

---

## Summary

This document completed the forecasting models infrastructure by creating the ForecastModel for tracking trained model metadata and generating migrations for both models. The models are now production-ready with comprehensive fields, relationships, constraints, and performance optimizations.

### Completed Tasks
11. ✓ Created ForecastModel model structure
12. ✓ Added algorithm field with choices (prophet/arima)
13. ✓ Added metrics field for performance tracking (MAE, RMSE, MAPE)
14. ✓ Added trained_at field for model age tracking
15. ✓ Generated database migrations for both models
16. ✓ Applied migrations and verified models

### Key Achievements
- **Two models created**: Forecast (predictions) and ForecastModel (metadata)
- **Complete fields**: All 11 fields across both models implemented
- **Relationships**: ForeignKey and OneToOne to Product configured
- **Constraints**: Unique constraints ensure data integrity
- **Indexes**: Query optimization for common patterns
- **Validation**: Field validators prevent invalid data
- **Documentation**: Comprehensive inline and external docs

### Database Schema Summary

```
Forecast Table:
├── 7 fields (product FK, date, prediction, 2 confidence bounds, version)
├── Unique constraint: (product, forecast_date)
└── 3 indexes: product, forecast_date, model_version

ForecastModel Table:
├── 4 fields (product OneToOne, algorithm, metrics JSON, trained_at)
├── OneToOne constraint: product
└── 3 indexes: product (unique), algorithm, trained_at
```

### Next Steps
Proceed to **Group-B: Historical Data Processing** to implement data collection and preprocessing pipelines for training the forecasting models.
