# Tasks 01-10: Dependencies and Forecast Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** A - Forecasting Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-11-16_ForecastModel-Migration.md](02_Tasks-11-16_ForecastModel-Migration.md)

---

## Document Overview

This document covers the installation of time series forecasting dependencies and the creation of the Forecast model. It establishes the foundational forecasting infrastructure by installing Prophet, statsmodels, and pmdarima libraries, then creating a comprehensive Forecast model with fields for storing predictions, confidence intervals, and model versioning.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install Prophet | Low | 20 min |
| 02 | Install statsmodels | Low | 15 min |
| 03 | Install pmdarima | Low | 15 min |
| 04 | Create Forecast Model | Medium | 30 min |
| 05 | Create product FK | Low | 15 min |
| 06 | Create forecast_date Field | Low | 10 min |
| 07 | Create predicted_demand Field | Low | 10 min |
| 08 | Create confidence_low Field | Low | 10 min |
| 09 | Create confidence_high Field | Low | 10 min |
| 10 | Create model_version Field | Low | 15 min |

---

## Task 01: Install Prophet

### Overview
Install Facebook's Prophet library for time series forecasting. Prophet is designed for forecasting data with strong seasonal effects and handles missing data and outliers well. It's particularly effective for business time series with daily observations and seasonal patterns.

### Dependencies
- SubPhase-02 (Product Recommendations) must be complete
- Backend Python environment configured
- PostgreSQL database operational

### Instructions

1. **Review Prophet requirements**
   - Verify Python version is 3.12+
   - Check system dependencies (required for installation)
   - Ensure sufficient disk space for dependencies

2. **Add Prophet to requirements**
   - Navigate to backend requirements file
   - Locate AI/ML dependencies section
   - Add prophet package with version specification

3. **Specify Prophet version**
   - Use version >=1.1.0 for latest features
   - Include version constraint in format: `prophet>=1.1.0,<2.0.0`
   - Document version choice in comments

4. **Install Prophet package**
   - Run pip install command in virtual environment
   - Monitor installation progress (may take several minutes)
   - Verify successful installation

5. **Handle installation dependencies**
   - Prophet requires numpy, pandas, matplotlib, pystan
   - These dependencies install automatically
   - Verify no version conflicts with existing packages

6. **Test Prophet installation**
   - Open Python shell in backend environment
   - Import prophet module
   - Verify no import errors

7. **Document Prophet configuration**
   - Add notes about Prophet use case
   - Document any installation issues encountered
   - Record version information for future reference

### Prophet Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| prophet | >=1.1.0 | Time series forecasting |
| numpy | Auto | Numerical computations |
| pandas | Auto | Data manipulation |
| pystan | Auto | Bayesian inference engine |

### Prophet Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| Seasonal Decomposition | Handles yearly, weekly, daily patterns | Accurate seasonal forecasts |
| Holiday Effects | Accounts for special dates | Improved accuracy |
| Missing Data | Handles gaps in data | Robust predictions |
| Uncertainty Intervals | Provides confidence ranges | Risk assessment |
| Fast Fitting | Optimized for speed | Production-ready |

### Installation Methods

| Method | Command | Use Case |
|--------|---------|----------|
| Direct | `pip install prophet>=1.1.0` | Development |
| Requirements | Add to requirements.txt | Production |
| Poetry | `poetry add prophet` | Poetry projects |
| Conda | `conda install -c conda-forge prophet` | Conda environments |

### Common Installation Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Compilation errors | Missing C++ compiler | Install build tools |
| PyStan installation fails | Version incompatibility | Update pip and setuptools |
| Memory errors | Insufficient RAM | Increase available memory |
| Long installation time | Compiling from source | Be patient, normal behavior |

### Verification Steps

```
Test Prophet Import
├── Activate virtual environment
├── Open Python interpreter
├── Execute: from prophet import Prophet
├── Execute: model = Prophet()
└── Verify: No errors raised
```

### Expected Outcome
- Prophet library installed successfully
- All dependencies resolved without conflicts
- Import statement works in Python environment
- Ready for time series forecasting implementation

### Verification Checklist
- [ ] Prophet added to requirements file with version constraint
- [ ] Package installed via pip or package manager
- [ ] All dependencies installed automatically
- [ ] No version conflicts with existing packages
- [ ] Import statement works: `from prophet import Prophet`
- [ ] Prophet version verified: >=1.1.0
- [ ] Installation documented in project notes

---

## Task 02: Install statsmodels

### Overview
Install statsmodels library for statistical modeling and econometrics. This library provides essential tools for statistical analysis, hypothesis testing, and traditional time series models like ARIMA. It complements Prophet by offering classical statistical approaches to forecasting.

### Dependencies
- Task 01: Install Prophet

### Instructions

1. **Review statsmodels purpose**
   - Statistical modeling and testing
   - Classical time series analysis (ARIMA, SARIMAX)
   - Econometric analysis tools
   - Complement to machine learning approaches

2. **Add statsmodels to requirements**
   - Navigate to backend requirements file
   - Add statsmodels in AI/ML dependencies section
   - Place after Prophet for logical ordering

3. **Specify statsmodels version**
   - Use version >=0.14.0 for latest features
   - Include version constraint: `statsmodels>=0.14.0,<1.0.0`
   - Document version rationale

4. **Install statsmodels package**
   - Run pip install command
   - Installation typically faster than Prophet
   - Monitor for any warnings or errors

5. **Verify dependency installation**
   - statsmodels depends on scipy, patsy
   - Check that dependencies are compatible
   - Resolve any version conflicts if they arise

6. **Test statsmodels installation**
   - Import statsmodels module
   - Import specific submodules (tsa.api)
   - Verify ARIMA model class available

7. **Document statsmodels usage**
   - Note intended use cases (ARIMA models)
   - Record configuration options
   - Document any installation notes

### statsmodels Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| statsmodels | >=0.14.0 | Statistical modeling |
| scipy | Auto | Scientific computations |
| patsy | Auto | Formula specification |

### statsmodels Capabilities

| Module | Functionality | Use Case |
|--------|---------------|----------|
| tsa | Time series analysis | ARIMA, SARIMAX |
| regression | Linear models | Trend analysis |
| stats | Statistical tests | Hypothesis testing |
| graphics | Visualization | Diagnostic plots |

### Key Time Series Models

| Model | Description | When to Use |
|-------|-------------|-------------|
| ARIMA | AutoRegressive Integrated Moving Average | Non-seasonal univariate data |
| SARIMAX | Seasonal ARIMA with exogenous variables | Seasonal data with external factors |
| VAR | Vector AutoRegression | Multiple time series |
| ETS | Exponential Smoothing | Trend and seasonal patterns |

### Installation Comparison

| Aspect | statsmodels | Prophet |
|--------|-------------|---------|
| Installation Time | Fast (< 2 min) | Slow (5-10 min) |
| Dependencies | Minimal | Heavy (PyStan) |
| Size | ~10 MB | ~100 MB |
| Compilation | None | Required |

### Testing Import Structure

```
Basic Import Test
├── from statsmodels import api as sm
├── from statsmodels.tsa.api import ARIMA
├── from statsmodels.tsa.statespace.sarimax import SARIMAX
└── Verify all imports successful
```

### Expected Outcome
- statsmodels library installed successfully
- All dependencies resolved
- Time series analysis modules accessible
- Ready for ARIMA model implementation

### Verification Checklist
- [ ] statsmodels added to requirements file
- [ ] Package installed via pip
- [ ] Dependencies installed without conflicts
- [ ] Basic import works: `import statsmodels.api as sm`
- [ ] TSA module imports: `from statsmodels.tsa.api import ARIMA`
- [ ] Version verified: >=0.14.0
- [ ] Installation documented

---

## Task 03: Install pmdarima

### Overview
Install pmdarima (Pyramid ARIMA) library for automated ARIMA model selection. This library provides auto_arima functionality that automatically determines optimal ARIMA parameters through grid search and information criteria. It simplifies the ARIMA modeling process significantly.

### Dependencies
- Task 02: Install statsmodels

### Instructions

1. **Understand pmdarima purpose**
   - Automates ARIMA parameter selection
   - Grid search over (p, d, q) parameters
   - Seasonal parameter optimization
   - Uses AIC/BIC for model selection

2. **Add pmdarima to requirements**
   - Add to AI/ML dependencies section
   - Place after statsmodels (depends on it)
   - Group with other forecasting libraries

3. **Specify pmdarima version**
   - Use version >=2.0.0 for latest features
   - Include constraint: `pmdarima>=2.0.0,<3.0.0`
   - Document version choice

4. **Install pmdarima package**
   - Run pip install command
   - Installation relatively quick
   - Verify successful completion

5. **Check Cython compilation**
   - pmdarima includes Cython components
   - Verify compilation succeeds
   - Note any compilation warnings

6. **Test pmdarima installation**
   - Import pmdarima module
   - Import auto_arima function
   - Create simple test model if desired

7. **Document auto_arima usage**
   - Note auto-tuning capabilities
   - Document parameter search ranges
   - Record intended use cases

### pmdarima Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| pmdarima | >=2.0.0 | Auto-ARIMA modeling |
| statsmodels | Required | ARIMA implementation |
| scikit-learn | Auto | Cross-validation utilities |
| Cython | Auto | Performance optimization |

### pmdarima Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| auto_arima | Automatic parameter selection | No manual tuning |
| Seasonal Support | SARIMA parameter optimization | Handles seasonality |
| Stepwise Search | Efficient parameter exploration | Fast convergence |
| Information Criteria | AIC, BIC, AICc | Statistical model selection |
| Cross-Validation | Out-of-sample validation | Robust models |

### auto_arima Parameters

| Parameter | Options | Description |
|-----------|---------|-------------|
| start_p, start_q | Integer | Starting ARIMA orders |
| max_p, max_q | Integer | Maximum ARIMA orders |
| seasonal | Boolean | Enable seasonal modeling |
| m | Integer | Seasonal period (12 for monthly) |
| stepwise | Boolean | Use stepwise search |
| information_criterion | 'aic', 'bic', 'aicc' | Selection criterion |

### Comparison with Manual ARIMA

| Aspect | Manual ARIMA | auto_arima |
|--------|--------------|------------|
| Parameter Selection | Manual ACF/PACF analysis | Automated grid search |
| Time Required | Hours | Minutes |
| Expertise Needed | High | Low |
| Optimization | Trial and error | Systematic |
| Reproducibility | Subjective | Consistent |

### Testing auto_arima

```
Test Auto-ARIMA Import
├── from pmdarima import auto_arima
├── from pmdarima.arima import ARIMA
├── Verify imports successful
└── Optional: Run on sample data
```

### Expected Outcome
- pmdarima library installed successfully
- auto_arima function available for use
- Cython components compiled properly
- Ready for automated ARIMA modeling

### Verification Checklist
- [ ] pmdarima added to requirements file
- [ ] Package installed via pip
- [ ] No compilation errors during installation
- [ ] Import works: `from pmdarima import auto_arima`
- [ ] ARIMA class accessible
- [ ] Version verified: >=2.0.0
- [ ] Installation documented

---

## Task 04: Create Forecast Model

### Overview
Create the Forecast Django model to store demand predictions for products. This model represents individual forecast entries with predicted demand values, confidence intervals, and model version tracking. Each forecast record links to a product and specific date, enabling historical tracking and accuracy analysis.

### Dependencies
- Task 03: Install pmdarima

### Instructions

1. **Locate forecasting models directory**
   - Navigate to `backend/apps/ai/forecasting/models/`
   - Create directory structure if not exists
   - Plan for multiple model files

2. **Create forecast.py file**
   - Create new file in models directory
   - Import Django model base classes
   - Import necessary field types

3. **Import required dependencies**
   - Import Django models and fields
   - Import Product model from inventory app
   - Import timezone utilities
   - Import any custom base model classes

4. **Define Forecast model class**
   - Create class inheriting from models.Model
   - Use descriptive class name: `Forecast`
   - Add comprehensive docstring

5. **Plan model structure**
   - Product relationship (ForeignKey)
   - Date for forecast (DateField)
   - Predicted value (FloatField)
   - Confidence bounds (FloatFields)
   - Model version tracking (CharField)
   - Metadata fields (created, updated)

6. **Add Meta class**
   - Set verbose names
   - Define unique constraint (product + forecast_date)
   - Set default ordering (forecast_date descending)
   - Add indexes for query optimization

7. **Implement __str__ method**
   - Return descriptive string representation
   - Include product name and forecast date
   - Format: "Forecast for {product} on {date}"

8. **Add model methods**
   - confidence_range() - calculate range width
   - is_within_confidence() - check if actual in range
   - accuracy() - calculate prediction accuracy
   - get_previous_forecast() - retrieve prior forecast

9. **Add model properties**
   - confidence_width - difference between bounds
   - is_recent - whether forecast is for near future
   - days_ahead - days from today to forecast_date

10. **Document model thoroughly**
    - Add field descriptions in comments
    - Document business logic
    - Explain unique constraints
    - Note query optimization strategies

### Forecast Model Structure

```
Forecast Model
├── id (AutoField, PK)
├── product (ForeignKey) → Product
├── forecast_date (DateField, Indexed)
├── predicted_demand (FloatField)
├── confidence_low (FloatField)
├── confidence_high (FloatField)
├── model_version (CharField)
├── created_at (DateTimeField, Auto)
├── updated_at (DateTimeField, Auto)
└── Meta
    ├── unique_together: (product, forecast_date)
    ├── ordering: ['-forecast_date']
    └── indexes: [product, forecast_date]
```

### Model Relationships

| Relationship | Type | Target | On Delete |
|--------------|------|--------|-----------|
| product | ForeignKey | Product | CASCADE |

### Field Planning Table

| Field Name | Django Field Type | Required | Indexed | Description |
|------------|-------------------|----------|---------|-------------|
| product | ForeignKey | Yes | Yes | Product being forecasted |
| forecast_date | DateField | Yes | Yes | Date of prediction |
| predicted_demand | FloatField | Yes | No | Predicted quantity |
| confidence_low | FloatField | Yes | No | Lower confidence bound (95%) |
| confidence_high | FloatField | Yes | No | Upper confidence bound (95%) |
| model_version | CharField | Yes | No | Model version identifier |

### Unique Constraints

| Constraint Name | Fields | Reason |
|-----------------|--------|--------|
| unique_product_date | product, forecast_date | One forecast per product per date |

### Model Methods to Implement

| Method | Returns | Purpose |
|--------|---------|---------|
| `__str__()` | str | String representation |
| `confidence_range()` | float | Width of confidence interval |
| `is_within_confidence(actual)` | bool | Check if actual value in range |
| `accuracy(actual)` | float | Calculate prediction accuracy |
| `get_previous_forecast()` | Forecast | Get prior forecast for same product |

### Model Properties

| Property | Type | Calculation |
|----------|------|-------------|
| confidence_width | float | confidence_high - confidence_low |
| is_recent | bool | forecast_date <= today + 7 days |
| days_ahead | int | (forecast_date - today).days |

### Indexing Strategy

| Index Type | Fields | Reason |
|------------|--------|--------|
| Single | product | Filter by product |
| Single | forecast_date | Date range queries |
| Composite | product, forecast_date | Unique lookup |

### Query Optimization Considerations

```
Common Query Patterns
├── Get forecasts for product in date range
│   └── Index: (product, forecast_date)
├── Get recent forecasts across products
│   └── Index: (forecast_date)
├── Get all forecasts for product
│   └── Index: (product)
└── Check existing forecast
    └── Unique constraint enforced
```

### Expected Outcome
- Forecast model class defined with all core fields
- Proper relationships to Product model
- Unique constraint on product and date
- Comprehensive docstrings and comments
- Ready for field implementations in subsequent tasks

### Verification Checklist
- [ ] File `backend/apps/ai/forecasting/models/forecast.py` created
- [ ] Forecast class defined inheriting models.Model
- [ ] Imports included for Django models and Product
- [ ] Model docstring added
- [ ] Meta class defined with constraints and ordering
- [ ] `__str__` method implemented
- [ ] Placeholder for fields (added in Tasks 05-10)
- [ ] Model methods stubbed or planned
- [ ] Comments document business logic
- [ ] File follows Django model conventions

---

## Task 05: Create product FK

### Overview
Implement the product foreign key field in the Forecast model. This field establishes the relationship between forecasts and products, enabling each forecast to be associated with a specific inventory item. The CASCADE delete behavior ensures data consistency when products are removed.

### Dependencies
- Task 04: Create Forecast Model

### Instructions

1. **Open forecast.py model file**
   - Navigate to forecast model file
   - Locate model class definition
   - Prepare to add first field

2. **Add product field definition**
   - Create ForeignKey field named `product`
   - Reference Product model from inventory app
   - Use string reference or direct import

3. **Configure ForeignKey parameters**
   - Set `on_delete=models.CASCADE`
   - Add `related_name='forecasts'`
   - Include `db_index=True` for query optimization
   - Add `help_text` for documentation

4. **Add field validation**
   - Consider adding validators if needed
   - Ensure null=False, blank=False (required field)
   - Document validation rules

5. **Configure related name**
   - Use plural form: `related_name='forecasts'`
   - Enables Product.forecasts.all() queries
   - Follow Django conventions

6. **Add field docstring**
   - Document field purpose
   - Explain CASCADE behavior
   - Note query patterns

7. **Test model syntax**
   - Verify no syntax errors
   - Check imports are correct
   - Ensure model loads without errors

### ForeignKey Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| to | `'inventory.Product'` | Target model |
| on_delete | `models.CASCADE` | Delete forecasts with product |
| related_name | `'forecasts'` | Reverse relationship name |
| db_index | `True` | Query optimization |
| null | `False` | Required field |
| blank | `False` | Required in forms |

### Delete Behavior Options

| on_delete Value | Behavior | Use Case |
|-----------------|----------|----------|
| CASCADE | Delete forecasts when product deleted | Chosen - maintain data integrity |
| PROTECT | Prevent product deletion | Alternative - preserve history |
| SET_NULL | Set to null | Not applicable - required field |
| DO_NOTHING | No action | Not recommended |

### Related Name Usage

```
Query Patterns
├── Get forecasts for product
│   └── product.forecasts.all()
├── Filter forecasts by date range
│   └── product.forecasts.filter(forecast_date__gte=today)
├── Count product forecasts
│   └── product.forecasts.count()
└── Check if forecasts exist
    └── product.forecasts.exists()
```

### Field Definition Example Format

```
Field Structure:
    product = models.ForeignKey(
        'inventory.Product',           # Target model
        on_delete=models.CASCADE,      # Delete behavior
        related_name='forecasts',      # Reverse relation
        db_index=True,                 # Index for queries
        help_text='Product being forecasted'
    )
```

### Database Implications

| Aspect | Impact |
|--------|--------|
| Column Name | `product_id` (auto-added _id suffix) |
| Column Type | Integer (matches Product PK) |
| Index | Yes (db_index=True) |
| Constraint | Foreign key constraint |
| NULL | NOT NULL |

### Expected Outcome
- Product foreign key field added to Forecast model
- CASCADE delete behavior configured
- Related name enables reverse queries
- Database index created for performance
- Field fully documented

### Verification Checklist
- [ ] product field added to Forecast model
- [ ] ForeignKey references Product model correctly
- [ ] on_delete=CASCADE configured
- [ ] related_name='forecasts' set
- [ ] db_index=True for performance
- [ ] help_text provided for documentation
- [ ] Field is required (null=False, blank=False)
- [ ] No syntax errors in model file
- [ ] Imports include Product model or use string reference

---

## Task 06: Create forecast_date Field

### Overview
Implement the forecast_date field in the Forecast model. This DateField stores the date for which the demand prediction is made. It's a critical component of the unique constraint (product + forecast_date) and enables date-based queries and filtering.

### Dependencies
- Task 04: Create Forecast Model

### Instructions

1. **Add forecast_date field**
   - Create DateField named `forecast_date`
   - Position after product field
   - Use appropriate field type for dates only

2. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add `db_index=True` for date queries
   - Include `help_text` documentation

3. **Add field validation**
   - Consider future date validator
   - Prevent past date forecasts if needed
   - Document validation logic

4. **Configure database indexing**
   - Enable indexing for date range queries
   - Consider composite index with product
   - Plan for query performance

5. **Add field documentation**
   - Document date format expectations
   - Explain business logic (future dates)
   - Note query patterns

6. **Consider timezone implications**
   - Dates are timezone-agnostic (DateField)
   - Document timezone handling
   - Note UTC storage if applicable

### DateField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | DateField | Date only (no time) |
| null | False | Required field |
| blank | False | Required in forms |
| db_index | True | Query optimization |
| help_text | 'Date for prediction' | Documentation |

### DateField vs DateTimeField

| Aspect | DateField | DateTimeField |
|--------|-----------|---------------|
| Stores | Date only | Date and time |
| Precision | Day | Second/microsecond |
| Timezone | N/A | Aware/naive |
| Use Case | Forecast date | Timestamp |
| Storage | DATE | TIMESTAMP |

### Indexing Strategy

| Index Type | Purpose | Query Pattern |
|------------|---------|---------------|
| Single | Date range queries | `forecast_date__gte=start` |
| Composite | Unique constraint | `product + forecast_date` |

### Common Query Patterns

```
Date-Based Queries
├── Forecasts for specific date
│   └── Forecast.objects.filter(forecast_date=date)
├── Date range queries
│   └── Forecast.objects.filter(forecast_date__range=[start, end])
├── Future forecasts only
│   └── Forecast.objects.filter(forecast_date__gt=today)
└── Forecasts within 7 days
    └── Forecast.objects.filter(forecast_date__lte=today + timedelta(7))
```

### Validation Considerations

| Validation | Implementation | Reason |
|------------|----------------|--------|
| Future dates | Custom validator | Forecasts are for future |
| Not too far | Max date validator | Limit forecast horizon |
| Not past | Min date validator | No historical forecasts |

### Date Format

| Context | Format | Example |
|---------|--------|---------|
| Database | ISO 8601 | 2026-02-15 |
| Python | date object | date(2026, 2, 15) |
| API | ISO string | "2026-02-15" |
| Display | Localized | "Feb 15, 2026" |

### Expected Outcome
- forecast_date field added to Forecast model
- DateField type for date-only storage
- Database index created for query performance
- Field required and validated
- Comprehensive documentation added

### Verification Checklist
- [ ] forecast_date field added to model
- [ ] DateField type used (not DateTimeField)
- [ ] Field is required (null=False, blank=False)
- [ ] db_index=True for performance
- [ ] help_text provides clear description
- [ ] Validation considered and documented
- [ ] No syntax errors in model
- [ ] Field positioned logically after product

---

## Task 07: Create predicted_demand Field

### Overview
Implement the predicted_demand field in the Forecast model. This FloatField stores the forecasted quantity demand for the product on the specified date. It represents the model's point estimate before confidence intervals are considered.

### Dependencies
- Task 04: Create Forecast Model

### Instructions

1. **Add predicted_demand field**
   - Create FloatField named `predicted_demand`
   - Position after forecast_date field
   - Use float for decimal precision

2. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add validators for positive values
   - Include `help_text` documentation

3. **Add value validation**
   - Ensure non-negative values (demand >= 0)
   - Use MinValueValidator(0)
   - Consider MaxValueValidator if needed

4. **Configure decimal handling**
   - FloatField allows decimal quantities
   - Sufficient precision for fractional units
   - Document precision limitations

5. **Add business logic documentation**
   - Document units (quantity, not currency)
   - Explain relationship to confidence bounds
   - Note rounding considerations

6. **Consider edge cases**
   - Zero demand predictions valid
   - Large numbers (rare but possible)
   - Negative values invalid (validator)

### FloatField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | FloatField | Decimal precision |
| null | False | Required field |
| blank | False | Required in forms |
| validators | [MinValueValidator(0)] | Non-negative |
| help_text | 'Predicted quantity demand' | Documentation |

### FloatField vs DecimalField

| Aspect | FloatField | DecimalField |
|--------|------------|--------------|
| Precision | Approximate | Exact |
| Storage | 8 bytes | Variable |
| Performance | Faster | Slower |
| Use Case | Scientific | Financial |
| Rounding | May vary | Precise |
| Choice | ✓ (forecasts) | (for currency) |

### Validation Rules

| Rule | Implementation | Reason |
|------|----------------|--------|
| Non-negative | MinValueValidator(0) | Demand cannot be negative |
| Reasonable max | Optional MaxValueValidator | Prevent data entry errors |
| Required | null=False | Must have prediction |

### Value Range Examples

| Scenario | Predicted Demand | Notes |
|----------|------------------|-------|
| Low demand | 5.3 | Fractional units acceptable |
| Medium demand | 125.7 | Typical range |
| High demand | 2,450.2 | Large quantities |
| No demand | 0.0 | Valid (predicted stockout) |
| Negative | -10.0 | Invalid (prevented by validator) |

### Relationship to Confidence Bounds

```
Demand Value Relationship
    confidence_low
         ↓
    ════════════════════
         predicted_demand (point estimate)
    ════════════════════
         ↑
    confidence_high

Constraint: confidence_low <= predicted_demand <= confidence_high
```

### Expected Outcome
- predicted_demand field added to Forecast model
- FloatField type for decimal precision
- Non-negative validation enforced
- Field required with clear documentation
- Ready to store demand predictions

### Verification Checklist
- [ ] predicted_demand field added to model
- [ ] FloatField type used
- [ ] Field is required (null=False, blank=False)
- [ ] MinValueValidator(0) added for non-negative
- [ ] help_text describes field purpose
- [ ] Field positioned after forecast_date
- [ ] No syntax errors in model
- [ ] Validation rules documented

---

## Task 08: Create confidence_low Field

### Overview
Implement the confidence_low field in the Forecast model. This FloatField stores the lower bound of the 95% confidence interval for demand predictions. It represents the pessimistic scenario where demand might be lower than the point estimate.

### Dependencies
- Task 04: Create Forecast Model

### Instructions

1. **Add confidence_low field**
   - Create FloatField named `confidence_low`
   - Position after predicted_demand field
   - Use float for consistency with predicted_demand

2. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add validators for non-negative values
   - Include `help_text` documentation

3. **Add value validation**
   - Ensure non-negative (MinValueValidator(0))
   - Consider relationship validation to predicted_demand
   - Document validation logic

4. **Document confidence interval**
   - Explain 95% confidence level
   - Note this is lower bound
   - Describe interpretation

5. **Add relationship constraints**
   - Document: confidence_low <= predicted_demand
   - Consider adding model-level validation
   - Plan for constraint checking

6. **Consider business implications**
   - Lower bound for inventory planning
   - Risk assessment for understocking
   - Safety stock calculations

### FloatField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | FloatField | Decimal precision |
| null | False | Required field |
| blank | False | Required in forms |
| validators | [MinValueValidator(0)] | Non-negative |
| help_text | 'Lower 95% confidence bound' | Documentation |

### Confidence Interval Concept

| Concept | Description | Value |
|---------|-------------|-------|
| Confidence Level | Statistical certainty | 95% |
| Interpretation | Lower bound of likely range | confidence_low |
| Use Case | Pessimistic scenario planning | Minimum stock |

### Confidence Bounds Relationship

```
Confidence Interval Structure:
├── confidence_low (Lower Bound)
│   ├── 2.5th percentile of distribution
│   └── Pessimistic estimate
├── predicted_demand (Point Estimate)
│   ├── 50th percentile (median)
│   └── Most likely value
└── confidence_high (Upper Bound)
    ├── 97.5th percentile
    └── Optimistic estimate

Validation: low <= predicted <= high
```

### Value Examples

| Predicted | Confidence Low | Confidence High | Width |
|-----------|----------------|-----------------|-------|
| 100 | 85 | 115 | 30 |
| 50 | 38 | 62 | 24 |
| 200 | 170 | 230 | 60 |
| 10 | 5 | 15 | 10 |

### Business Use Cases

| Use Case | Logic | Benefit |
|----------|-------|---------|
| Safety Stock | confidence_high - predicted_demand | Avoid stockouts |
| Minimum Order | confidence_low | Worst-case planning |
| Risk Assessment | confidence_high - confidence_low | Uncertainty measure |
| Inventory Range | [confidence_low, confidence_high] | Stocking guidance |

### Model Validation

| Validation Type | Check | Implementation |
|-----------------|-------|----------------|
| Field-level | value >= 0 | MinValueValidator |
| Model-level | confidence_low <= predicted_demand | clean() method |
| Database-level | Non-null | NOT NULL constraint |

### Expected Outcome
- confidence_low field added to Forecast model
- FloatField type with non-negative validation
- Field required and documented
- Relationship to predicted_demand noted
- Ready for confidence interval storage

### Verification Checklist
- [ ] confidence_low field added to model
- [ ] FloatField type used
- [ ] Field is required (null=False, blank=False)
- [ ] MinValueValidator(0) added
- [ ] help_text explains 95% lower bound
- [ ] Field positioned after predicted_demand
- [ ] Relationship to predicted_demand documented
- [ ] No syntax errors in model

---

## Task 09: Create confidence_high Field

### Overview
Implement the confidence_high field in the Forecast model. This FloatField stores the upper bound of the 95% confidence interval for demand predictions. It represents the optimistic scenario where demand might be higher than the point estimate.

### Dependencies
- Task 04: Create Forecast Model

### Instructions

1. **Add confidence_high field**
   - Create FloatField named `confidence_high`
   - Position after confidence_low field
   - Use float for consistency

2. **Configure field parameters**
   - Set `null=False, blank=False` (required)
   - Add validators for non-negative values
   - Include `help_text` documentation

3. **Add value validation**
   - Ensure non-negative (MinValueValidator(0))
   - Document relationship to other fields
   - Plan model-level validation

4. **Document confidence interval**
   - Explain 95% confidence level
   - Note this is upper bound
   - Describe use cases

5. **Add relationship constraints**
   - Document: predicted_demand <= confidence_high
   - Document: confidence_low <= confidence_high
   - Consider model clean() validation

6. **Document business applications**
   - Upper bound for capacity planning
   - Risk assessment for overstocking
   - Maximum inventory guidance

### FloatField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | FloatField | Decimal precision |
| null | False | Required field |
| blank | False | Required in forms |
| validators | [MinValueValidator(0)] | Non-negative |
| help_text | 'Upper 95% confidence bound' | Documentation |

### Confidence Interval Complete Structure

```
Complete Confidence Interval:
┌─────────────────────────────────┐
│  Confidence Interval (95%)      │
├─────────────────────────────────┤
│                                 │
│  confidence_low (2.5%)          │
│      │                          │
│      │ ←── 95% probability ──→  │
│      │                          │
│  predicted_demand (50%)         │
│      │                          │
│      │ ←── 95% probability ──→  │
│      │                          │
│  confidence_high (97.5%)        │
│                                 │
└─────────────────────────────────┘
```

### Three-Field Relationship

| Field | Statistical Meaning | Percentile | Use Case |
|-------|---------------------|------------|----------|
| confidence_low | Lower bound | 2.5th | Minimum planning |
| predicted_demand | Point estimate | 50th (median) | Expected value |
| confidence_high | Upper bound | 97.5th | Maximum planning |

### Validation Constraints

```
Validation Rules:
├── Field-level
│   └── confidence_high >= 0 (MinValueValidator)
├── Model-level (to implement in clean())
│   ├── confidence_low <= predicted_demand
│   ├── predicted_demand <= confidence_high
│   └── confidence_low <= confidence_high
└── Database-level
    └── NOT NULL constraint
```

### Business Applications

| Application | Formula | Purpose |
|-------------|---------|---------|
| Maximum Stock | confidence_high | Optimistic scenario |
| Buffer Stock | confidence_high - predicted_demand | Safety buffer |
| Uncertainty | confidence_high - confidence_low | Risk measure |
| Order Range | [confidence_low, confidence_high] | Min-max ordering |

### Interval Width Analysis

| Width | Interpretation | Action |
|-------|----------------|--------|
| Narrow (< 20% of predicted) | High certainty | Trust prediction |
| Medium (20-50%) | Moderate uncertainty | Plan flexibly |
| Wide (> 50%) | High uncertainty | Conservative planning |

### Example Scenarios

| Scenario | Low | Predicted | High | Width | Notes |
|----------|-----|-----------|------|-------|-------|
| Stable demand | 95 | 100 | 105 | 10 | High confidence |
| Volatile demand | 60 | 100 | 140 | 80 | Low confidence |
| New product | 20 | 50 | 90 | 70 | Uncertain |
| Seasonal peak | 180 | 200 | 230 | 50 | Expected range |

### Expected Outcome
- confidence_high field added to Forecast model
- FloatField type with validation
- Field required and documented
- Complete confidence interval defined
- Ready for upper bound storage

### Verification Checklist
- [ ] confidence_high field added to model
- [ ] FloatField type used
- [ ] Field is required (null=False, blank=False)
- [ ] MinValueValidator(0) added
- [ ] help_text explains 95% upper bound
- [ ] Field positioned after confidence_low
- [ ] Three-field relationship documented
- [ ] No syntax errors in model

---

## Task 10: Create model_version Field

### Overview
Implement the model_version field in the Forecast model. This CharField stores a version identifier for the forecasting model that generated the prediction. It enables tracking which model version produced each forecast, supporting model comparison, A/B testing, and audit trails.

### Dependencies
- Task 04: Create Forecast Model

### Instructions

1. **Add model_version field**
   - Create CharField named `model_version`
   - Position after confidence_high field
   - Use string for version identifier

2. **Configure field parameters**
   - Set max_length=50 (sufficient for version strings)
   - Set `null=False, blank=False` (required)
   - Add `db_index=True` for grouping queries
   - Include `help_text` documentation

3. **Define version format**
   - Document version string format
   - Examples: "v1.0", "prophet_2026-01", "arima_auto"
   - Consider semantic versioning

4. **Add field documentation**
   - Explain purpose of version tracking
   - Document version naming conventions
   - Note use cases for filtering

5. **Plan version management**
   - How versions are assigned
   - Version increment strategy
   - Relationship to ForecastModel

6. **Consider indexing strategy**
   - Enable filtering by model version
   - Support model comparison queries
   - Optimize for analytics

### CharField Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Type | CharField | String storage |
| max_length | 50 | Accommodate version strings |
| null | False | Required field |
| blank | False | Required in forms |
| db_index | True | Query optimization |
| help_text | 'Model version identifier' | Documentation |

### Version String Formats

| Format | Example | Use Case |
|--------|---------|----------|
| Semantic | "v1.2.3" | Standard versioning |
| Date-based | "2026-01-15" | Date of training |
| Algorithm | "prophet_v1" | Algorithm + version |
| Hybrid | "prophet_2026-01_v2" | Combined information |

### Version Tracking Use Cases

```
Model Version Applications:
├── Model Comparison
│   └── Compare accuracy across versions
├── A/B Testing
│   └── Test new models against baseline
├── Audit Trail
│   └── Track which model made predictions
├── Rollback Support
│   └── Revert to previous model version
└── Analytics
    └── Aggregate performance by version
```

### Query Patterns

| Query Purpose | Example Filter |
|---------------|----------------|
| Forecasts by version | `model_version='v1.2.3'` |
| Recent model | `model_version='prophet_2026-01'` |
| Algorithm type | `model_version__startswith='prophet'` |
| Version comparison | `model_version__in=['v1', 'v2']` |

### Version Management Strategy

| Aspect | Strategy | Implementation |
|--------|----------|----------------|
| Assignment | Auto from ForecastModel | Fetch at prediction time |
| Format | Algorithm + date | "prophet_2026-01-15" |
| Increment | On retraining | New version on model update |
| Storage | CharField | Simple string field |

### Relationship to ForecastModel

```
Version Relationship:
ForecastModel (trained model metadata)
    ├── algorithm: "prophet"
    ├── trained_at: 2026-01-15
    └── generates version: "prophet_2026-01-15"
         ↓
Forecast (individual predictions)
    └── model_version: "prophet_2026-01-15"

Enables: Tracking which trained model produced forecasts
```

### Index Benefits

| Benefit | Query Type | Performance Gain |
|---------|------------|------------------|
| Version filtering | WHERE model_version = 'v1' | Significant |
| Version grouping | GROUP BY model_version | Moderate |
| Version counting | COUNT by version | Significant |
| Analytics | Aggregate by version | High |

### Expected Outcome
- model_version field added to Forecast model
- CharField type with appropriate length
- Database index for query performance
- Version tracking enabled
- Ready for model version identification

### Verification Checklist
- [ ] model_version field added to model
- [ ] CharField type with max_length=50
- [ ] Field is required (null=False, blank=False)
- [ ] db_index=True for performance
- [ ] help_text documents version tracking
- [ ] Field positioned after confidence_high
- [ ] Version format documented
- [ ] No syntax errors in model
- [ ] All forecast fields now complete

---

## Summary

This document established the forecasting infrastructure by installing three critical time series libraries (Prophet, statsmodels, pmdarima) and creating the Forecast model with six essential fields for storing demand predictions, confidence intervals, and model versioning.

### Completed Tasks
1. ✓ Installed Prophet for time series forecasting
2. ✓ Installed statsmodels for statistical modeling
3. ✓ Installed pmdarima for automated ARIMA
4. ✓ Created Forecast model structure
5. ✓ Added product foreign key relationship
6. ✓ Added forecast_date field for prediction date
7. ✓ Added predicted_demand field for point estimate
8. ✓ Added confidence_low field for lower bound
9. ✓ Added confidence_high field for upper bound
10. ✓ Added model_version field for version tracking

### Next Steps
Proceed to [02_Tasks-11-16_ForecastModel-Migration.md](02_Tasks-11-16_ForecastModel-Migration.md) to create the ForecastModel for storing trained model metadata and generate database migrations.
