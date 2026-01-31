# Tasks 57-66: ARIMA, Model Selector, and Training Task

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** D - Prediction Algorithms  
> **Document:** 02 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-56_ABC-Prophet.md](01_Tasks-49-56_ABC-Prophet.md)
- **→ Next Group:** [Group-E_Reorder-Suggestions](../Group-E_Reorder-Suggestions/)

---

## Document Overview

This document covers the implementation of ARIMA forecasting with automatic parameter selection, model selection logic to choose the best algorithm, and Celery tasks for automated weekly training. The ARIMAForecaster provides a fast, traditional time series approach complementing Prophet, while the ModelSelector uses cross-validation to compare algorithms and select the optimal one. The ForecastTrainingTask automates model retraining on a weekly schedule, ensuring forecasts remain accurate as new sales data becomes available.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create ARIMAForecaster | High | 60 min |
| 58 | Create auto_arima Method | High | 60 min |
| 59 | Create ARIMA train Method | Medium | 45 min |
| 60 | Create ARIMA predict Method | Medium | 40 min |
| 61 | Create ModelSelector | High | 50 min |
| 62 | Create cross_validate Method | High | 60 min |
| 63 | Create compare_models Method | Medium | 45 min |
| 64 | Create ForecastTrainingTask | Medium | 45 min |
| 65 | Create Forecast Schedule | Low | 25 min |
| 66 | Verify Forecasting | Low | 30 min |

---

## Task 57: Create ARIMAForecaster

### Overview
Create the ARIMAForecaster class that implements the ForecastTrainer interface using ARIMA (AutoRegressive Integrated Moving Average) time series modeling. ARIMA is a classical statistical method effective for univariate time series with trend and autocorrelation. This implementation uses the pmdarima library's auto_arima function for automatic parameter selection, providing a faster alternative to Prophet that works well for products without strong holiday effects.

### Dependencies
- Task 56: Create Prophet predict Method (ProphetForecaster complete)

### Instructions

1. **Install pmdarima library**
   - Add `pmdarima` to backend requirements
   - Install using pip: `pip install pmdarima`
   - pmdarima includes auto_arima functionality

2. **Create ARIMAForecaster module**
   - Create file `arima.py` in `algorithms/` directory
   - This contains the ARIMA implementation

3. **Import required dependencies**
   - Import pmdarima.arima.auto_arima
   - Import pandas for DataFrame operations
   - Import numpy for numerical operations
   - Import ForecastTrainer from base module
   - Import logging for error tracking
   - Import warnings to suppress ARIMA warnings

4. **Define ARIMAForecaster class**
   - Create class inheriting from ForecastTrainer
   - Override class attributes for ARIMA specifics
   - Add comprehensive class docstring

5. **Set class-level attributes**
   - Set name = "arima"
   - Set requires_holidays = False (ARIMA doesn't use holidays)
   - Set supports_seasonality = True (seasonal ARIMA)

6. **Implement initialization method**
   - Call super().__init__(config) for base initialization
   - Initialize self.model to None initially
   - Extract ARIMA-specific config parameters
   - Set default ARIMA parameters if not provided

7. **Define default ARIMA parameters**
   - start_p: 0 (starting AR order)
   - start_q: 0 (starting MA order)
   - max_p: 5 (maximum AR order to test)
   - max_q: 5 (maximum MA order to test)
   - max_d: 2 (maximum differencing order)
   - start_P: 0 (starting seasonal AR order)
   - max_P: 2 (maximum seasonal AR order)
   - max_Q: 2 (maximum seasonal MA order)
   - max_D: 1 (maximum seasonal differencing)
   - m: 7 (seasonal period, 7 for weekly)
   - seasonal: True (enable seasonal ARIMA)
   - stepwise: True (use stepwise search for speed)
   - suppress_warnings: True (clean output)
   - error_action: 'ignore' (handle problematic models)

8. **Store configuration attributes**
   - Store each ARIMA parameter as instance attribute
   - Allow overrides through config dictionary
   - Validate parameter values and ranges

9. **Configure seasonal period (m)**
   - m=7 for weekly seasonality (default for retail)
   - m=12 for monthly seasonality
   - m=4 for quarterly seasonality
   - Allow configuration via config dictionary

10. **Prepare for auto_arima method**
    - Method implemented in Task 58
    - Will find optimal (p, d, q, P, D, Q, m) parameters

11. **Add notes on ARIMA vs Prophet**
    - ARIMA: faster, simpler, no external regressors
    - Prophet: slower, handles holidays, more flexible
    - ARIMA best for: stable products, frequent training
    - Prophet best for: seasonal products, holidays matter

### ARIMAForecaster Class Structure

```
┌──────────────────────────────────────────┐
│      ARIMAForecaster                     │
│      (ForecastTrainer)                   │
├──────────────────────────────────────────┤
│  + name = "arima"                        │
│  + requires_holidays = False             │
│  + supports_seasonality = True           │
│                                          │
│  + start_p, start_q: int                 │
│  + max_p, max_q, max_d: int              │
│  + start_P, max_P, max_Q, max_D: int     │
│  + m: int (seasonal period)              │
│  + seasonal: bool                        │
│  + stepwise: bool                        │
│  + suppress_warnings: bool               │
├──────────────────────────────────────────┤
│  + __init__(config: Dict)                │
│  + auto_arima(df) → Tuple                │  ← Task 58
│  + train(df) → ARIMAResults              │  ← Task 59
│  + predict(periods) → DataFrame          │  ← Task 60
└──────────────────────────────────────────┘
           │
           │ Uses
           ▼
┌──────────────────────┐
│   pmdarima           │
│   (auto_arima)       │
└──────────────────────┘
```

### ARIMA Model Components

| Component | Symbol | Description |
|-----------|--------|-------------|
| AutoRegressive | AR(p) | Regression on past values |
| Integrated | I(d) | Differencing for stationarity |
| Moving Average | MA(q) | Regression on past errors |
| Seasonal AR | SAR(P) | Seasonal autoregression |
| Seasonal I | SI(D) | Seasonal differencing |
| Seasonal MA | SMA(Q) | Seasonal moving average |

### ARIMA Notation

```
ARIMA(p, d, q)(P, D, Q)m

p: AR order (0-5)
d: Differencing order (0-2)
q: MA order (0-5)

P: Seasonal AR order (0-2)
D: Seasonal differencing (0-1)
Q: Seasonal MA order (0-2)
m: Seasonal period (7 for weekly)

Example: ARIMA(1, 1, 1)(1, 1, 1)7
├── AR(1): yt depends on yt-1
├── I(1): First difference
├── MA(1): Error term from t-1
├── Seasonal AR(1): yt depends on yt-7
├── Seasonal I(1): Seasonal difference
├── Seasonal MA(1): Seasonal error
└── Period: 7 days (weekly)
```

### Default ARIMA Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| start_p | 0 | 0-5 | Starting AR order |
| start_q | 0 | 0-5 | Starting MA order |
| max_p | 5 | 1-10 | Maximum AR order |
| max_q | 5 | 1-10 | Maximum MA order |
| max_d | 2 | 0-2 | Maximum differencing |
| start_P | 0 | 0-2 | Starting seasonal AR |
| max_P | 2 | 0-3 | Maximum seasonal AR |
| max_Q | 2 | 0-3 | Maximum seasonal MA |
| max_D | 1 | 0-1 | Maximum seasonal diff |
| m | 7 | 2-365 | Seasonal period |

### Seasonal Period Configuration

| Period (m) | Use Case | Cycle Length |
|-----------|----------|--------------|
| 7 | Weekly patterns | 1 week |
| 12 | Monthly patterns | 1 year (monthly data) |
| 4 | Quarterly patterns | 1 year (quarterly) |
| 24 | Hourly patterns | 1 day (hourly data) |
| 52 | Weekly data | 1 year (weekly frequency) |

### Configuration Dictionary Example

```python
config = {
    'product_id': 123,
    'tenant_id': 1,
    'algorithm_params': {
        'start_p': 0,
        'max_p': 5,
        'start_q': 0,
        'max_q': 5,
        'max_d': 2,
        'seasonal': True,
        'm': 7,  # Weekly seasonality
        'stepwise': True,
        'suppress_warnings': True,
        'error_action': 'ignore'
    }
}
```

### ARIMA vs Prophet Comparison

| Feature | ARIMA | Prophet |
|---------|-------|---------|
| Training Speed | Fast (seconds) | Slower (10-60s) |
| Holiday Support | No | Yes |
| Seasonality | Single seasonal period | Multiple periods |
| External Regressors | Limited | Yes (easy) |
| Interpretability | Statistical | Components-based |
| Missing Data | Requires handling | Handles automatically |
| Overfitting Risk | Higher (many params) | Lower (regularized) |
| Best For | Simple patterns | Complex patterns |

### When to Use ARIMA

```
Use ARIMA When:
├── Product has stable demand pattern
├── No strong holiday effects
├── Fast training required
├── Frequent retraining (daily)
└── Simple, interpretable model needed

Use Prophet When:
├── Strong seasonal patterns
├── Holiday effects significant
├── External regressors needed
├── Missing data common
└── Detailed decomposition desired
```

### Stationarity Requirement

```
ARIMA requires stationary series
├── Constant mean over time
├── Constant variance
└── No trend or seasonality

Achieved through:
├── Differencing (I component)
│   ├── d=1: Remove trend
│   └── D=1: Remove seasonality
└── Transformations (log, sqrt)
```

### Auto-ARIMA Search Process

```
1. Test for stationarity
   ├── ADF test (Augmented Dickey-Fuller)
   └── KPSS test
   
2. Determine d and D
   ├── d: Non-seasonal differencing
   └── D: Seasonal differencing
   
3. Search parameter space
   ├── Stepwise: intelligent search
   └── Grid: exhaustive search
   
4. Select best model
   ├── Minimize AIC (Akaike Information Criterion)
   └── Or BIC (Bayesian IC)
   
5. Return optimal parameters
```

### Expected Outcome
- ARIMAForecaster class created in algorithms/arima.py
- Class inherits from ForecastTrainer
- Class attributes set (name="arima", requires_holidays=False)
- Initialization method implemented with config handling
- Default ARIMA parameters defined for auto_arima
- Seasonal period configurable (default m=7 for weekly)
- Parameter validation implemented
- pmdarima library integrated
- Ready for auto_arima method (Task 58) and train/predict (Tasks 59-60)

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/algorithms/arima.py` file created
- [ ] ARIMAForecaster class inherits from ForecastTrainer
- [ ] Class attributes set correctly (name="arima")
- [ ] requires_holidays = False
- [ ] supports_seasonality = True
- [ ] `__init__` method implemented
- [ ] Config dictionary parameter accepted
- [ ] super().__init__(config) called
- [ ] Default ARIMA parameters defined
- [ ] Seasonal period (m) configurable
- [ ] pmdarima imported successfully
- [ ] Parameter ranges validated
- [ ] Type hints used throughout
- [ ] Comprehensive docstring provided

---

## Task 58: Create auto_arima Method

### Overview
Implement the auto_arima method in ARIMAForecaster to automatically select optimal ARIMA parameters (p, d, q, P, D, Q, m) using statistical tests and model comparison. This method leverages pmdarima's auto_arima function which performs intelligent search over the parameter space, using AIC (Akaike Information Criterion) to identify the best-fitting model. Automatic parameter selection eliminates manual tuning and ensures optimal ARIMA configuration for each product.

### Dependencies
- Task 57: Create ARIMAForecaster

### Instructions

1. **Open arima.py file**
   - Navigate to ARIMAForecaster class
   - Add method after __init__ method

2. **Define auto_arima method**
   - Method name: `auto_arima`
   - Accept `df` parameter (pandas DataFrame with 'y' column)
   - Return type is Tuple[int, int, int, int, int, int, int]
   - Returns (p, d, q, P, D, Q, m) optimal parameters

3. **Write method docstring**
   - Describe purpose: find optimal ARIMA parameters
   - Document df parameter: time series data
   - Document return value: (p, d, q, P, D, Q, m) tuple
   - Explain AIC-based selection
   - Note computational complexity

4. **Extract time series from DataFrame**
   - Get 'y' column as numpy array or pandas Series
   - Ensure no missing values (interpolate if needed)
   - Check minimum length (recommend 2*m observations)

5. **Configure auto_arima search**
   - Use pmdarima.arima.auto_arima function
   - Pass time series data (y)
   - Pass configuration parameters from __init__

6. **Set auto_arima parameters**
   - start_p, start_q: starting AR and MA orders
   - max_p, max_q: maximum orders to test
   - d: if None, automatically determined via unit root tests
   - start_P, max_P, max_Q: seasonal parameters
   - D: if None, automatically determined
   - m: seasonal period (from self.m)
   - seasonal: True/False (from self.seasonal)
   - stepwise: True for faster search (recommended)
   - suppress_warnings: True to avoid console spam
   - error_action: 'ignore' to skip problematic models
   - trace: False (set True for debugging)
   - information_criterion: 'aic' (or 'bic', 'hqic')

7. **Execute auto_arima search**
   - Call pmdarima.arima.auto_arima with parameters
   - Catch any convergence errors
   - Log search progress and duration

8. **Extract optimal parameters**
   - Get model.order attribute: (p, d, q)
   - Get model.seasonal_order attribute: (P, D, Q, m)
   - Combine into single tuple

9. **Validate selected parameters**
   - Ensure parameters are within expected ranges
   - Log selected parameters for tracking
   - Warn if parameters hit max values (may need higher limits)

10. **Handle search failures**
    - If auto_arima fails (no model found)
    - Fall back to default parameters: (1, 1, 1, 1, 1, 1, m)
    - Log warning about fallback
    - Still attempt to fit model

11. **Return parameter tuple**
    - Return (p, d, q, P, D, Q, m)
    - These parameters used in train method (Task 59)

12. **Add performance optimization**
    - For large datasets, use stepwise=True
    - For small datasets, consider full grid search
    - Balance accuracy vs computation time

### Auto-ARIMA Process Flow

```
Input Time Series
       │
       ▼
┌─────────────────────┐
│ Check stationarity  │
│ (ADF, KPSS tests)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Determine d and D   │
│ (differencing)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Search p, q, P, Q   │
│ (stepwise or grid)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Fit each candidate  │
│ Calculate AIC       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Select best model   │
│ (minimum AIC)       │
└──────────┬──────────┘
           │
           ▼
Return (p, d, q, P, D, Q, m)
```

### Stationarity Tests

| Test | Purpose | Null Hypothesis |
|------|---------|-----------------|
| ADF (Augmented Dickey-Fuller) | Test for unit root | Series has unit root (non-stationary) |
| KPSS | Test for stationarity | Series is stationary |
| PP (Phillips-Perron) | Alternative unit root | Series has unit root |

### Information Criteria

| Criterion | Formula | Trade-off |
|-----------|---------|-----------|
| AIC | -2log(L) + 2k | Balances fit and complexity |
| BIC | -2log(L) + k*log(n) | Penalizes complexity more |
| AICc | AIC + correction | Better for small samples |
| HQIC | -2log(L) + 2k*log(log(n)) | Between AIC and BIC |

Lower value = better model

### Stepwise vs Grid Search

```
Stepwise Search (stepwise=True)
├── Start with simple model
├── Test nearby parameter combinations
├── Move towards better AIC
├── Fast (tests ~10-20 models)
└── May miss global optimum

Grid Search (stepwise=False)
├── Test all parameter combinations
├── Exhaustive search
├── Slow (tests 100+ models)
└── Finds global optimum
```

### Parameter Search Space

```
Non-Seasonal Parameters
├── p ∈ [start_p, max_p]  (e.g., 0 to 5)
├── d ∈ [0, max_d]        (e.g., 0 to 2)
└── q ∈ [start_q, max_q]  (e.g., 0 to 5)

Seasonal Parameters (if seasonal=True)
├── P ∈ [start_P, max_P]  (e.g., 0 to 2)
├── D ∈ [0, max_D]        (e.g., 0 to 1)
└── Q ∈ [start_Q, max_Q]  (e.g., 0 to 2)

Total models tested (grid):
(max_p+1) × (max_d+1) × (max_q+1) × (max_P+1) × (max_D+1) × (max_Q+1)
= 6 × 3 × 6 × 3 × 2 × 3 = 1944 models (too many!)

Stepwise reduces to ~15-30 models
```

### Method Implementation Pattern

```python
def auto_arima(self, df: pd.DataFrame) -> Tuple[int, int, int, int, int, int, int]:
    """Automatically select optimal ARIMA parameters using AIC."""
    
    # 1. Extract time series
    y = df['y'].values
    
    # 2. Configure auto_arima
    model = pm.auto_arima(
        y,
        start_p=self.start_p,
        start_q=self.start_q,
        max_p=self.max_p,
        max_q=self.max_q,
        max_d=self.max_d,
        start_P=self.start_P,
        max_P=self.max_P,
        max_Q=self.max_Q,
        max_D=self.max_D,
        m=self.m,
        seasonal=self.seasonal,
        stepwise=self.stepwise,
        suppress_warnings=self.suppress_warnings,
        error_action=self.error_action,
        information_criterion='aic',
        trace=False
    )
    
    # 3. Extract parameters
    p, d, q = model.order
    P, D, Q, m = model.seasonal_order
    
    # 4. Log and return
    logger.info(f"Auto-ARIMA selected: ({p},{d},{q})({P},{D},{Q}){m}")
    return (p, d, q, P, D, Q, m)
```

### Common Parameter Patterns

| Pattern | ARIMA Order | Description |
|---------|-------------|-------------|
| Random Walk | (0, 1, 0) | Simple trend |
| AR(1) | (1, 0, 0) | Autoregressive |
| MA(1) | (0, 0, 1) | Moving average |
| ARMA(1,1) | (1, 0, 1) | Combined |
| SARIMA | (1, 1, 1)(1, 1, 1)7 | Full seasonal |
| Typical retail | (1, 1, 2)(1, 1, 1)7 | Common for demand |

### Handling Search Failures

```python
try:
    model = pm.auto_arima(...)
    p, d, q = model.order
    P, D, Q, m = model.seasonal_order
except Exception as e:
    logger.warning(f"auto_arima failed: {e}, using defaults")
    p, d, q = 1, 1, 1
    P, D, Q, m = 1, 1, 1, self.m
    
return (p, d, q, P, D, Q, m)
```

### Performance Considerations

| Dataset Size | Recommended Settings | Search Time |
|--------------|---------------------|-------------|
| < 50 points | stepwise=True, simple ranges | 1-5 seconds |
| 50-200 points | stepwise=True, standard ranges | 5-15 seconds |
| 200-500 points | stepwise=True, wider ranges | 15-30 seconds |
| > 500 points | stepwise=True or restrict ranges | 30-60 seconds |

### Debugging Auto-ARIMA

```python
# Enable trace for debugging
model = pm.auto_arima(
    y,
    ...,
    trace=True,  # Print each model tested
    error_action='warn'  # Show warnings
)

# Output shows:
# Fit ARIMA(0,1,0)x(0,1,1,7); AIC=235.4, BIC=241.2, Time=0.05s
# Fit ARIMA(1,1,0)x(1,1,0,7); AIC=232.1, BIC=239.8, Time=0.08s
# ...
# Best model: ARIMA(1,1,1)x(1,1,1,7)
```

### Expected Outcome
- auto_arima method implemented in ARIMAForecaster
- Uses pmdarima.arima.auto_arima for parameter selection
- Performs intelligent search over parameter space
- Uses AIC to select best model
- Returns (p, d, q, P, D, Q, m) parameter tuple
- Handles search failures with fallback defaults
- Includes performance optimizations (stepwise search)
- Comprehensive logging of selected parameters

### Verification Checklist
- [ ] auto_arima method defined in ARIMAForecaster
- [ ] Method accepts df: DataFrame parameter
- [ ] Return type is Tuple[int, int, int, int, int, int, int]
- [ ] Time series extracted from df['y']
- [ ] pmdarima.arima.auto_arima called
- [ ] All configuration parameters passed
- [ ] stepwise=True for performance
- [ ] information_criterion='aic'
- [ ] Model order extracted (p, d, q)
- [ ] Seasonal order extracted (P, D, Q, m)
- [ ] Parameters validated and logged
- [ ] Error handling for search failures
- [ ] Fallback defaults defined
- [ ] Docstring complete with parameters and return

---

## Task 59: Create ARIMA train Method

### Overview
Implement the train method in ARIMAForecaster to train an ARIMA model on historical demand data using automatically selected parameters. This method calls auto_arima to find optimal parameters, then fits a SARIMA model using statsmodels. The trained model captures autoregressive patterns, trend through differencing, and seasonal cycles, providing accurate forecasts for products with stable demand patterns.

### Dependencies
- Task 58: Create auto_arima Method

### Instructions

1. **Open arima.py file**
   - Locate ARIMAForecaster class
   - Add train method (overrides abstract method from Task 50)

2. **Define train method signature**
   - Override abstract train method from ForecastTrainer
   - Accept `df` parameter (pandas DataFrame)
   - Accept `**kwargs` for additional options
   - Return type is ARIMAResults (from statsmodels)

3. **Write comprehensive method docstring**
   - Describe training process
   - Document df parameter requirements
   - Document return value (fitted ARIMA model)
   - List possible exceptions

4. **Validate input DataFrame**
   - Call self.validate_data(df) from base class
   - Check for required column: 'y'
   - Verify minimum data requirements (>= 2*m observations)
   - Check for missing values
   - Ensure sufficient variation (not all constant)

5. **Prepare time series data**
   - Extract 'y' column as pandas Series
   - Handle missing values (interpolate or raise)
   - Ensure chronological order (sort by index if needed)
   - Convert to appropriate numeric type (float64)

6. **Call auto_arima for parameter selection**
   - Execute self.auto_arima(df) from Task 58
   - Receive optimal (p, d, q, P, D, Q, m) parameters
   - Log selected parameters

7. **Fit ARIMA model**
   - Use statsmodels.tsa.statespace.sarimax.SARIMAX
   - Create model with order=(p, d, q) and seasonal_order=(P, D, Q, m)
   - Call model.fit() to estimate parameters
   - Specify method='lbfgs' for optimization
   - Set disp=False to suppress iteration output

8. **Handle fitting errors**
   - Catch convergence errors (may occur with difficult data)
   - Catch parameter errors (invalid parameter combinations)
   - Try alternative optimization methods if first fails
   - Log detailed error information

9. **Store trained model**
   - Assign fitted model to self.model
   - Store training data to self.training_data
   - Store training date range for validation
   - Store fitted parameters for reference

10. **Extract and log training metrics**
    - Get AIC and BIC from fitted model
    - Calculate in-sample residuals
    - Calculate standard error of residuals
    - Log completion with metrics

11. **Return trained model**
    - Return self.model (ARIMAResults object)
    - Model is also stored in instance for predict method

### Training Process Flow

```
Input DataFrame
       │
       ▼
┌─────────────────┐
│ Validate Data   │
│ (length, NaN)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract Series  │
│ (y values)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ auto_arima      │
│ (find params)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create SARIMAX  │
│ model           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fit model       │
│ (optimize)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store model     │
│ & metadata      │
└────────┬────────┘
         │
         ▼
Return ARIMAResults
```

### Data Validation Requirements

| Requirement | Threshold | Handling |
|-------------|-----------|----------|
| Minimum observations | 2 * m (14 for weekly) | Raise ValueError |
| Maximum missing | 10% | Interpolate or raise |
| Constant values | Check std dev > 0 | Raise ValueError |
| Data type | float64 | Convert |

### SARIMAX Model Creation

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Create model
model = SARIMAX(
    y_series,
    order=(p, d, q),
    seasonal_order=(P, D, Q, m),
    enforce_stationarity=False,
    enforce_invertibility=False
)

# Fit model
fitted_model = model.fit(
    method='lbfgs',
    disp=False,
    maxiter=100
)
```

### SARIMAX Parameters Explanation

| Parameter | Purpose | Typical Value |
|-----------|---------|---------------|
| order | (p, d, q) non-seasonal | From auto_arima |
| seasonal_order | (P, D, Q, m) seasonal | From auto_arima |
| enforce_stationarity | Force AR parameters stationary | False (more flexible) |
| enforce_invertibility | Force MA parameters invertible | False (more flexible) |
| method | Optimization algorithm | 'lbfgs' (fast) |
| maxiter | Maximum iterations | 100-200 |
| disp | Display iterations | False (clean) |

### Optimization Methods

| Method | Speed | Robustness | Use Case |
|--------|-------|------------|----------|
| lbfgs | Fast | Good | Default choice |
| nm (Nelder-Mead) | Slow | High | Convergence issues |
| powell | Medium | Medium | Alternative |
| bfgs | Fast | Good | Large datasets |

### Method Implementation Pattern

```python
def train(self, df: pd.DataFrame, **kwargs) -> ARIMAResults:
    """Train ARIMA model on historical demand data."""
    
    # 1. Validate data
    self.validate_data(df)
    
    # 2. Extract series
    y = df['y'].astype(float)
    
    # 3. Get optimal parameters
    p, d, q, P, D, Q, m = self.auto_arima(df)
    
    # 4. Create SARIMAX model
    from statsmodels.tsa.statespace.sarimax import SARIMAX
    
    model = SARIMAX(
        y,
        order=(p, d, q),
        seasonal_order=(P, D, Q, m),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    # 5. Fit model
    try:
        fitted = model.fit(method='lbfgs', disp=False, maxiter=100)
    except Exception as e:
        logger.warning(f"lbfgs failed, trying nm: {e}")
        fitted = model.fit(method='nm', disp=False, maxiter=200)
    
    # 6. Store and return
    self.model = fitted
    self.training_data = df
    logger.info(f"ARIMA trained: AIC={fitted.aic:.2f}")
    
    return self.model
```

### Training Metrics

| Metric | Description | Good Value |
|--------|-------------|------------|
| AIC | Akaike Information Criterion | Lower is better |
| BIC | Bayesian Information Criterion | Lower is better |
| Log Likelihood | Model fit quality | Higher is better |
| Residual Std Error | Prediction error | Lower is better |

### Error Handling Strategies

```python
# Primary attempt with lbfgs
try:
    fitted = model.fit(method='lbfgs', disp=False, maxiter=100)
except np.linalg.LinAlgError:
    # Singular matrix, try different method
    fitted = model.fit(method='nm', disp=False)
except ValueError as e:
    # Parameter issues, try simpler model
    logger.warning(f"ARIMA fit failed: {e}, trying simpler model")
    p, d, q = 1, 1, 1  # Fallback
    model = SARIMAX(y, order=(p, d, q), seasonal_order=(0, 0, 0, 0))
    fitted = model.fit(method='lbfgs', disp=False)
```

### Common Training Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Convergence failure | Model doesn't converge | Try different optimizer (nm) |
| Singular matrix | Linear algebra error | Reduce parameter complexity |
| Too few observations | ValueError | Collect more data or reduce m |
| Constant series | Zero variance | Check data quality |
| Extreme values | Overflow errors | Apply log transformation |

### Training Time Expectations

| Data Size | Parameter Complexity | Training Time |
|-----------|---------------------|---------------|
| 30 days | Simple (p+q+P+Q < 4) | 1-3 seconds |
| 90 days | Medium (p+q+P+Q = 4-6) | 3-8 seconds |
| 180 days | Medium | 8-15 seconds |
| 365 days | Complex (p+q+P+Q > 6) | 15-30 seconds |

### Model Storage

```python
# Store complete context
self.model = fitted_model
self.training_data = df.copy()
self.params = {
    'order': (p, d, q),
    'seasonal_order': (P, D, Q, m),
    'aic': fitted_model.aic,
    'bic': fitted_model.bic,
    'train_date': datetime.now()
}
```

### Expected Outcome
- train method implemented in ARIMAForecaster
- Validates input DataFrame
- Calls auto_arima for parameter selection
- Creates SARIMAX model with optimal parameters
- Fits model using maximum likelihood estimation
- Stores trained model in self.model
- Extracts and logs training metrics (AIC, BIC)
- Handles fitting errors with fallback strategies
- Returns ARIMAResults object

### Verification Checklist
- [ ] train method defined in ARIMAForecaster
- [ ] Method overrides abstract train from ForecastTrainer
- [ ] Accepts df: DataFrame parameter
- [ ] Return type is ARIMAResults (or Any)
- [ ] Data validation performed
- [ ] auto_arima method called
- [ ] SARIMAX model created with parameters
- [ ] model.fit() executed successfully
- [ ] Optimization method specified (lbfgs)
- [ ] Trained model stored in self.model
- [ ] Training data stored in self.training_data
- [ ] AIC and BIC logged
- [ ] Error handling for convergence failures
- [ ] Alternative optimization methods attempted
- [ ] Docstring complete

---

## Task 60: Create ARIMA predict Method

### Overview
Implement the predict method in ARIMAForecaster to generate forecasts using the trained ARIMA model. This method produces point forecasts and confidence intervals for the specified horizon using the fitted SARIMA model's forecast capabilities. The output follows the standardized DataFrame format with date, point forecast, and confidence bounds, enabling consistent integration with the forecasting pipeline.

### Dependencies
- Task 59: Create ARIMA train Method

### Instructions

1. **Open arima.py file**
   - Locate ARIMAForecaster class
   - Add predict method after train method

2. **Define predict method signature**
   - Override abstract predict method from ForecastTrainer
   - Accept `periods` parameter (int, forecast horizon)
   - Accept `include_history` parameter (bool, default False)
   - Accept `**kwargs` for additional options
   - Return type is pandas DataFrame

3. **Write comprehensive method docstring**
   - Describe prediction process
   - Document periods parameter
   - Document include_history parameter
   - Document return DataFrame format
   - List possible exceptions

4. **Validate model is trained**
   - Check if self.model is not None
   - Raise RuntimeError if model hasn't been trained
   - Provide helpful error message

5. **Validate periods parameter**
   - Check periods > 0
   - Raise ValueError if invalid
   - Warn if periods > 90 (long-term forecast less reliable)

6. **Generate forecasts**
   - Call self.model.forecast(steps=periods)
   - Returns forecast values as array or Series
   - Call self.model.get_forecast(steps=periods) for full results

7. **Extract forecast components**
   - Point forecast: forecast.predicted_mean
   - Confidence interval: forecast.conf_int(alpha=0.05)
   - alpha=0.05 gives 95% confidence interval
   - Extract lower and upper bounds

8. **Create date range for forecast**
   - Get last date from training data
   - Generate future dates: last_date + 1 day to last_date + periods days
   - Use pandas date_range with daily frequency
   - Ensure dates align with forecast values

9. **Format output DataFrame**
   - Column 'ds': forecast dates (datetime64)
   - Column 'yhat': point forecast (float64)
   - Column 'yhat_lower': lower confidence bound (float64)
   - Column 'yhat_upper': upper confidence bound (float64)

10. **Apply business logic constraints**
    - Ensure yhat >= 0 (demand can't be negative)
    - Apply floor constraint if specified in config
    - Adjust confidence intervals if point forecast clipped

11. **Handle include_history option**
    - If include_history=True, include fitted values
    - Get fitted values from self.model.fittedvalues
    - Combine with forecast into single DataFrame
    - Useful for visualization and validation

12. **Add metadata (optional)**
    - Add 'forecast_date' column (when forecast made)
    - Add 'algorithm' column ('arima')
    - Add model parameters for traceability

13. **Handle edge cases**
    - Empty training data → RuntimeError
    - periods = 0 → return empty DataFrame
    - Model convergence issues → log warning

14. **Return formatted DataFrame**
    - Standardized output format
    - Sorted by date ascending
    - Reset index to default integer index

### Prediction Process Flow

```
Check model trained
       │
       ▼
Validate periods > 0
       │
       ▼
┌──────────────────────┐
│ Get forecast from    │
│ model.get_forecast() │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Extract predicted    │
│ mean and conf_int    │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Generate future      │
│ date range           │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Create DataFrame     │
│ (ds, yhat, CI)       │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Apply constraints    │
│ (yhat >= 0)          │
└───────────┬──────────┘
            │
            ▼
Return DataFrame
```

### SARIMAX Forecast Methods

| Method | Returns | Use Case |
|--------|---------|----------|
| forecast(steps) | Array of predictions | Simple point forecasts |
| get_forecast(steps) | ForecastResults object | Full results with CI |
| predict(start, end) | Predictions for date range | Flexible range |
| simulate(nsimulations) | Simulated paths | Uncertainty analysis |

### Confidence Interval Extraction

```python
# Get forecast with confidence intervals
forecast_result = self.model.get_forecast(steps=periods)

# Extract components
yhat = forecast_result.predicted_mean
conf_int = forecast_result.conf_int(alpha=0.05)  # 95% CI

yhat_lower = conf_int.iloc[:, 0]  # Lower bound
yhat_upper = conf_int.iloc[:, 1]  # Upper bound
```

### Alpha Values for Confidence Intervals

| Alpha | Confidence Level | Use Case |
|-------|------------------|----------|
| 0.05 | 95% | Standard (default) |
| 0.10 | 90% | Wider acceptance |
| 0.01 | 99% | High confidence needed |
| 0.20 | 80% | Narrower intervals |

### Date Range Generation

```python
# Get last training date
last_date = self.training_data.index[-1]
# or if 'ds' column exists:
last_date = self.training_data['ds'].max()

# Generate future dates
forecast_dates = pd.date_range(
    start=last_date + pd.Timedelta(days=1),
    periods=periods,
    freq='D'
)
```

### Output DataFrame Structure

```
       ds          yhat   yhat_lower   yhat_upper
0   2026-02-01    52.3      46.8        57.8
1   2026-02-02    54.1      48.2        60.0
2   2026-02-03    50.9      44.7        57.1
3   2026-02-04    53.2      46.8        59.6
...
```

### Method Implementation Pattern

```python
def predict(
    self, 
    periods: int, 
    include_history: bool = False,
    **kwargs
) -> pd.DataFrame:
    """Generate ARIMA forecasts for future periods."""
    
    # 1. Validate model trained
    if self.model is None:
        raise RuntimeError("Model must be trained before prediction")
    
    # 2. Validate periods
    if periods <= 0:
        raise ValueError("periods must be positive integer")
    
    # 3. Get forecast
    forecast_result = self.model.get_forecast(steps=periods)
    yhat = forecast_result.predicted_mean
    conf_int = forecast_result.conf_int(alpha=0.05)
    
    # 4. Generate dates
    last_date = self.training_data['ds'].max()
    forecast_dates = pd.date_range(
        start=last_date + pd.Timedelta(days=1),
        periods=periods,
        freq='D'
    )
    
    # 5. Create DataFrame
    result = pd.DataFrame({
        'ds': forecast_dates,
        'yhat': yhat.values,
        'yhat_lower': conf_int.iloc[:, 0].values,
        'yhat_upper': conf_int.iloc[:, 1].values
    })
    
    # 6. Apply constraints
    result['yhat'] = result['yhat'].clip(lower=0)
    result['yhat_lower'] = result['yhat_lower'].clip(lower=0)
    result['yhat_upper'] = result['yhat_upper'].clip(lower=0)
    
    # 7. Handle include_history
    if include_history:
        # Add fitted values (implementation omitted for brevity)
        pass
    
    return result
```

### Include History Implementation

```python
if include_history:
    # Get fitted values
    fitted = self.model.fittedvalues
    
    # Create history DataFrame
    history = pd.DataFrame({
        'ds': self.training_data['ds'],
        'yhat': fitted.values,
        'yhat_lower': fitted.values,  # No CI for fitted
        'yhat_upper': fitted.values
    })
    
    # Combine history and forecast
    result = pd.concat([history, result], ignore_index=True)
```

### Constraint Application Logic

```python
# Ensure non-negative (demand can't be negative)
result['yhat'] = result['yhat'].clip(lower=0)
result['yhat_lower'] = result['yhat_lower'].clip(lower=0)
result['yhat_upper'] = result['yhat_upper'].clip(lower=0)

# If clipped, adjust intervals to maintain symmetry (optional)
clipped_mask = result['yhat'] == 0
if clipped_mask.any():
    # When yhat clipped to 0, set lower to 0
    result.loc[clipped_mask, 'yhat_lower'] = 0
    # Optionally adjust upper to maintain interval width
```

### Forecast Reliability by Horizon

| Periods | Horizon | Reliability | Confidence Interval Width |
|---------|---------|-------------|--------------------------|
| 1-7 | Short-term | High | Narrow |
| 8-14 | Medium-term | Good | Medium |
| 15-30 | Long-term | Medium | Wide |
| 31-60 | Very long-term | Lower | Very wide |
| 60+ | Extended | Low | Extremely wide |

### Error Handling

```python
try:
    forecast_result = self.model.get_forecast(steps=periods)
except Exception as e:
    logger.error(f"ARIMA forecast failed: {e}")
    # Return DataFrame with NaN or last observed value
    result = pd.DataFrame({
        'ds': forecast_dates,
        'yhat': np.nan,
        'yhat_lower': np.nan,
        'yhat_upper': np.nan
    })
    return result
```

### Expected Outcome
- predict method implemented in ARIMAForecaster
- Validates model is trained before prediction
- Validates periods parameter
- Generates forecasts using model.get_forecast()
- Extracts point forecasts and 95% confidence intervals
- Creates future date range aligned with forecasts
- Formats output as standardized DataFrame
- Applies non-negative constraint to demand forecasts
- Handles include_history option for visualization
- Returns DataFrame with ds, yhat, yhat_lower, yhat_upper columns

### Verification Checklist
- [ ] predict method defined in ARIMAForecaster
- [ ] Method overrides abstract predict from ForecastTrainer
- [ ] Accepts periods: int parameter
- [ ] Accepts include_history: bool parameter
- [ ] Return type is DataFrame
- [ ] Model trained validation performed
- [ ] periods > 0 validation performed
- [ ] model.get_forecast(steps=periods) called
- [ ] Confidence intervals extracted (alpha=0.05)
- [ ] Future date range generated
- [ ] Output DataFrame created with required columns
- [ ] Non-negative constraint applied
- [ ] include_history option implemented
- [ ] Error handling for prediction failures
- [ ] Docstring complete

---

## Task 61: Create ModelSelector

### Overview
Create the ModelSelector class to compare different forecasting algorithms and select the best performer for each product. This service uses time series cross-validation to evaluate Prophet and ARIMA models on historical data, calculating performance metrics (MAE, RMSE, MAPE), and recommending the optimal algorithm. Model selection ensures each product uses the most accurate forecasting method, improving overall demand prediction quality.

### Dependencies
- Task 60: Create ARIMA predict Method (both Prophet and ARIMA complete)

### Instructions

1. **Create selector module**
   - Create file `selector.py` in `algorithms/` directory
   - This contains model selection logic

2. **Import required dependencies**
   - Import ProphetForecaster and ARIMAForecaster
   - Import pandas and numpy
   - Import sklearn.metrics (mean_absolute_error, etc.)
   - Import logging for tracking

3. **Define ModelSelector class**
   - Regular class (not inheriting from ForecastTrainer)
   - Manages comparison of multiple forecasters
   - Add comprehensive class docstring

4. **Implement initialization method**
   - Accept list of forecaster classes to compare
   - Default: [ProphetForecaster, ARIMAForecaster]
   - Accept configuration for each forecaster
   - Store forecaster instances

5. **Add class attributes**
   - forecasters: List of forecaster instances
   - metrics: Dictionary to store evaluation results
   - best_model: Selected model after comparison

6. **Define evaluation metrics**
   - MAE: Mean Absolute Error (average error magnitude)
   - RMSE: Root Mean Squared Error (penalizes large errors)
   - MAPE: Mean Absolute Percentage Error (relative error)
   - Use MAPE as primary metric (industry standard)

7. **Add cross_validate method (Task 62)**
   - Perform time series cross-validation
   - Split data into train/test folds
   - Calculate metrics for each fold

8. **Add compare_models method (Task 63)**
   - Train each forecaster
   - Evaluate using cross-validation
   - Compare metrics and select winner

9. **Add helper methods**
   - calculate_metrics: Compute MAE, RMSE, MAPE
   - format_results: Pretty-print comparison table
   - get_recommendation: Return best model name

### ModelSelector Class Structure

```
┌──────────────────────────────────────────┐
│         ModelSelector                    │
├──────────────────────────────────────────┤
│  + forecasters: List[ForecastTrainer]    │
│  + metrics: Dict[str, Dict[str, float]]  │
│  + best_model: str                       │
│  + config: Dict                          │
├──────────────────────────────────────────┤
│  + __init__(forecasters, config)         │
│  + cross_validate(model, df) → Dict      │  ← Task 62
│  + compare_models(df) → str              │  ← Task 63
│  + calculate_metrics(y_true, y_pred)     │
│  + format_results() → str                │
│  + get_recommendation() → str            │
└──────────────────────────────────────────┘
           │
           │ Uses
           ▼
┌────────────────────┬────────────────────┐
│  ProphetForecaster │  ARIMAForecaster  │
└────────────────────┴────────────────────┘
```

### Evaluation Metrics Formulas

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| MAE | Σ\|y - ŷ\| / n | Average error (same units as data) |
| RMSE | √(Σ(y - ŷ)² / n) | Root mean squared error (penalizes large errors) |
| MAPE | Σ(\|y - ŷ\| / y) / n × 100 | Percentage error (scale-independent) |

### MAPE Interpretation

| MAPE Range | Interpretation | Forecast Quality |
|------------|----------------|------------------|
| < 10% | Excellent | Highly accurate |
| 10-20% | Good | Acceptable for most uses |
| 20-50% | Fair | Reasonable for planning |
| > 50% | Poor | Needs improvement |

### Model Comparison Process

```
Input Data
    │
    ▼
┌──────────────────┐
│ For each model   │
│ (Prophet, ARIMA) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Cross-validate   │
│ (Task 62)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate avg    │
│ metrics          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Store results    │
│ in metrics dict  │
└────────┬─────────┘
         │
         ▼
Compare all models
Select best (lowest MAPE)
         │
         ▼
Return model name
```

### Metrics Dictionary Structure

```python
{
    'prophet': {
        'mae': 5.2,
        'rmse': 7.1,
        'mape': 12.3,
        'cv_splits': 5,
        'avg_train_time': 15.2
    },
    'arima': {
        'mae': 6.1,
        'rmse': 8.3,
        'mape': 14.7,
        'cv_splits': 5,
        'avg_train_time': 3.4
    }
}
```

### Helper Method: calculate_metrics

```python
def calculate_metrics(
    self, 
    y_true: np.ndarray, 
    y_pred: np.ndarray
) -> Dict[str, float]:
    """Calculate forecast evaluation metrics."""
    
    from sklearn.metrics import mean_absolute_error, mean_squared_error
    
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    # MAPE with zero handling
    mask = y_true != 0
    mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    
    return {
        'mae': mae,
        'rmse': rmse,
        'mape': mape
    }
```

### Handling Zero Values in MAPE

```python
# Problem: Division by zero when y_true = 0
# Solution 1: Exclude zero values
mask = y_true != 0
mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100

# Solution 2: Use symmetric MAPE (sMAPE)
smape = np.mean(2 * np.abs(y_true - y_pred) / (np.abs(y_true) + np.abs(y_pred))) * 100

# Solution 3: Add small epsilon
epsilon = 1e-10
mape = np.mean(np.abs((y_true - y_pred) / (y_true + epsilon))) * 100
```

### Model Selection Decision Tree

```
Start with both models
        │
        ▼
Run cross-validation
        │
        ▼
┌───────────────────┐
│ Compare MAPE      │
└────────┬──────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Prophet    ARIMA
better     better
    │         │
    │    ┌────┴────┐
    │    │         │
    │    ▼         ▼
    │  Time    Time
    │  matter? matter?
    │    │         │
    │   Yes       No
    │    │         │
    │    ▼         ▼
    │  Prophet   ARIMA
    │  (accuracy)  (speed)
    │    │         │
    └────┴─────────┘
         │
         ▼
Selected Model
```

### Expected Outcome
- ModelSelector class created in algorithms/selector.py
- Class accepts list of forecaster instances
- Stores configuration for each forecaster
- Defines evaluation metrics (MAE, RMSE, MAPE)
- Provides structure for cross-validation (Task 62)
- Provides structure for model comparison (Task 63)
- Helper methods for metric calculation
- Foundation for selecting optimal forecasting algorithm

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/algorithms/selector.py` file created
- [ ] ModelSelector class defined
- [ ] `__init__` method accepts forecaster list
- [ ] Class attributes defined (forecasters, metrics, best_model)
- [ ] ProphetForecaster and ARIMAForecaster imported
- [ ] sklearn.metrics imported for evaluation
- [ ] calculate_metrics helper method defined
- [ ] MAE, RMSE, MAPE calculation implemented
- [ ] Zero handling in MAPE calculation
- [ ] Comprehensive docstring provided
- [ ] Type hints used throughout

---

## Task 62: Create cross_validate Method

### Overview
Implement the cross_validate method in ModelSelector to perform time series cross-validation on a forecasting model. Unlike standard k-fold cross-validation, time series CV maintains chronological order and uses expanding windows to respect temporal dependencies. This method trains the model on progressively larger training sets, evaluates on subsequent test periods, and calculates average performance metrics across multiple splits, providing robust model evaluation.

### Dependencies
- Task 61: Create ModelSelector

### Instructions

1. **Open selector.py file**
   - Locate ModelSelector class
   - Add method after __init__ method

2. **Define cross_validate method**
   - Method name: `cross_validate`
   - Accept `model` parameter (ForecastTrainer instance)
   - Accept `df` parameter (historical data DataFrame)
   - Accept `n_splits` parameter (int, default 5)
   - Accept `test_size` parameter (int, default 7 days)
   - Return type is Dict[str, float] (average metrics)

3. **Write comprehensive method docstring**
   - Describe time series CV process
   - Document parameters
   - Explain expanding window approach
   - Document return value (averaged metrics)

4. **Validate input parameters**
   - Check df has sufficient data for n_splits
   - Minimum data = initial_train_size + (n_splits * test_size)
   - Raise ValueError if insufficient data

5. **Implement time series split logic**
   - Use expanding window approach (not sliding)
   - Each split increases training data
   - Test set always follows training data chronologically
   - No data leakage from future to past

6. **Calculate split boundaries**
   - Determine initial training size (e.g., 70% of data or minimum 30 days)
   - For each split:
     - Training: start to split_point
     - Testing: split_point to split_point + test_size
     - Advance split_point by test_size

7. **Perform CV loop**
   - For each split (1 to n_splits):
     - Extract train and test data
     - Train model on train data
     - Generate predictions for test period
     - Calculate metrics (MAE, RMSE, MAPE)
     - Store metrics for averaging

8. **Handle training failures**
   - Some splits may fail to train
   - Log warning and skip split
   - Continue with remaining splits
   - Ensure at least 3 successful splits

9. **Calculate average metrics**
   - Average MAE across all splits
   - Average RMSE across all splits
   - Average MAPE across all splits
   - Calculate standard deviation for uncertainty

10. **Track additional statistics**
    - Average training time per split
    - Number of successful splits
    - Min/max MAPE across splits

11. **Return results dictionary**
    - Keys: 'mae', 'rmse', 'mape', 'mae_std', 'mape_std'
    - Include 'n_splits' (actual number used)
    - Include 'train_time' (average)

### Time Series Cross-Validation Diagram

```
Expanding Window Cross-Validation

Split 1:
[Training---------][Test--]

Split 2:
[Training--------------][Test--]

Split 3:
[Training-------------------][Test--]

Split 4:
[Training------------------------][Test--]

Split 5:
[Training-----------------------------][Test--]

Each split:
- Training data expands (includes all previous data)
- Test data always follows training chronologically
- Test size is constant (e.g., 7 days)
```

### Contrast with Standard K-Fold

```
Standard K-Fold (WRONG for time series)
[Test--][Train--------][Test--][Train--------][Test--]
  ↑ Future data used to predict past (data leakage!)

Time Series CV (CORRECT)
[Train---][Test--]
[Train--------][Test--]
[Train-------------][Test--]
  ↑ Always training on past, testing on future
```

### Split Size Calculation

```python
# Total data length
n_obs = len(df)

# Minimum initial training size
min_train = 30  # At least 30 days

# Calculate initial training size
initial_train = max(min_train, n_obs - (n_splits * test_size))

# Validate sufficient data
required_data = initial_train + (n_splits * test_size)
if n_obs < required_data:
    raise ValueError(f"Insufficient data: need {required_data}, have {n_obs}")
```

### CV Loop Implementation

```python
def cross_validate(
    self,
    model: ForecastTrainer,
    df: pd.DataFrame,
    n_splits: int = 5,
    test_size: int = 7
) -> Dict[str, float]:
    """Perform time series cross-validation."""
    
    metrics_list = []
    n_obs = len(df)
    
    # Calculate initial training size
    initial_train = max(30, n_obs - (n_splits * test_size))
    
    # Validate sufficient data
    if n_obs < initial_train + (n_splits * test_size):
        raise ValueError("Insufficient data for cross-validation")
    
    # Perform CV splits
    for i in range(n_splits):
        # Define split boundaries
        train_end = initial_train + (i * test_size)
        test_end = train_end + test_size
        
        # Extract train and test data
        train_data = df.iloc[:train_end].copy()
        test_data = df.iloc[train_end:test_end].copy()
        
        try:
            # Train model
            model.train(train_data)
            
            # Generate predictions
            predictions = model.predict(periods=test_size)
            
            # Calculate metrics
            y_true = test_data['y'].values
            y_pred = predictions['yhat'].values
            
            metrics = self.calculate_metrics(y_true, y_pred)
            metrics_list.append(metrics)
            
        except Exception as e:
            logger.warning(f"CV split {i+1} failed: {e}")
            continue
    
    # Calculate average metrics
    if len(metrics_list) < 3:
        raise ValueError("Too few successful CV splits")
    
    avg_metrics = {
        'mae': np.mean([m['mae'] for m in metrics_list]),
        'rmse': np.mean([m['rmse'] for m in metrics_list]),
        'mape': np.mean([m['mape'] for m in metrics_list]),
        'mae_std': np.std([m['mae'] for m in metrics_list]),
        'mape_std': np.std([m['mape'] for m in metrics_list]),
        'n_splits': len(metrics_list)
    }
    
    return avg_metrics
```

### Parameter Recommendations

| Dataset Size | n_splits | test_size | initial_train |
|--------------|----------|-----------|---------------|
| 60 days | 3 | 7 days | 39 days |
| 90 days | 5 | 7 days | 55 days |
| 180 days | 5 | 14 days | 110 days |
| 365 days | 8 | 14 days | 253 days |

### Trade-offs in Split Configuration

| Parameter | Larger Value | Smaller Value |
|-----------|--------------|---------------|
| n_splits | More robust metrics | Faster execution |
| test_size | Tests longer horizon | More splits possible |
| initial_train | More stable training | More test splits |

### Handling Failed Splits

```python
successful_splits = 0
required_success = max(3, n_splits // 2)

for i in range(n_splits):
    try:
        # ... training and evaluation
        successful_splits += 1
    except Exception as e:
        logger.warning(f"Split {i+1} failed: {e}")
        if i == n_splits - 1 and successful_splits < required_success:
            raise ValueError(f"Only {successful_splits} successful splits")
        continue
```

### Metrics Aggregation

```python
# Calculate mean and standard deviation
avg_mape = np.mean([m['mape'] for m in metrics_list])
std_mape = np.std([m['mape'] for m in metrics_list])

# Calculate min and max
min_mape = np.min([m['mape'] for m in metrics_list])
max_mape = np.max([m['mape'] for m in metrics_list])

# Return comprehensive results
return {
    'mae': np.mean([m['mae'] for m in metrics_list]),
    'rmse': np.mean([m['rmse'] for m in metrics_list]),
    'mape': avg_mape,
    'mape_std': std_mape,
    'mape_min': min_mape,
    'mape_max': max_mape,
    'n_splits': len(metrics_list)
}
```

### Expected Outcome
- cross_validate method implemented in ModelSelector
- Performs time series cross-validation with expanding windows
- Respects chronological order (no data leakage)
- Trains model on progressively larger training sets
- Evaluates on subsequent test periods
- Calculates metrics for each split
- Returns averaged metrics across all splits
- Includes standard deviation for uncertainty
- Handles training failures gracefully

### Verification Checklist
- [ ] cross_validate method defined in ModelSelector
- [ ] Accepts model: ForecastTrainer parameter
- [ ] Accepts df: DataFrame parameter
- [ ] Accepts n_splits: int parameter (default 5)
- [ ] Accepts test_size: int parameter (default 7)
- [ ] Return type is Dict[str, float]
- [ ] Data sufficiency validation performed
- [ ] Initial training size calculated
- [ ] Expanding window logic implemented
- [ ] No data leakage (future → past)
- [ ] Model trained on each split
- [ ] Predictions generated for test period
- [ ] Metrics calculated using calculate_metrics
- [ ] Average metrics computed across splits
- [ ] Standard deviation calculated
- [ ] Failed splits handled gracefully
- [ ] Docstring complete

---

## Task 63: Create compare_models Method

### Overview
Implement the compare_models method in ModelSelector to train and evaluate multiple forecasting algorithms, then select the best performer based on cross-validation metrics. This method orchestrates the comparison process: iterating through forecasters (Prophet, ARIMA), performing cross-validation for each, comparing average MAPE scores, and returning the name of the optimal algorithm. This automated selection ensures each product uses the most accurate forecasting method.

### Dependencies
- Task 62: Create cross_validate Method

### Instructions

1. **Open selector.py file**
   - Locate ModelSelector class
   - Add method after cross_validate method

2. **Define compare_models method**
   - Method name: `compare_models`
   - Accept `df` parameter (historical data DataFrame)
   - Accept `**kwargs` for CV configuration (n_splits, test_size)
   - Return type is str (best model name)

3. **Write comprehensive method docstring**
   - Describe comparison process
   - Document df parameter requirements
   - Document kwargs (CV configuration)
   - Document return value (model name)
   - Explain selection criteria (lowest MAPE)

4. **Validate input data**
   - Check df has required columns ('ds', 'y')
   - Verify sufficient data for cross-validation
   - Minimum: 60 days recommended

5. **Initialize results storage**
   - Create empty dictionary for metrics
   - Track results for each forecaster
   - Prepare for comparison

6. **Iterate through forecasters**
   - For each forecaster in self.forecasters:
     - Create fresh instance with configuration
     - Perform cross-validation
     - Store results in metrics dictionary
     - Log progress

7. **Perform cross-validation for each model**
   - Call self.cross_validate(forecaster, df, **kwargs)
   - Receive average metrics (MAE, RMSE, MAPE)
   - Store in self.metrics[model_name] = metrics

8. **Handle evaluation failures**
   - If forecaster fails cross-validation, log error
   - Continue with remaining forecasters
   - Ensure at least one forecaster succeeds

9. **Compare metrics**
   - Primary metric: MAPE (lowest wins)
   - Secondary metric: MAE (tiebreaker)
   - Tertiary metric: RMSE (second tiebreaker)

10. **Select best model**
    - Find forecaster with lowest average MAPE
    - Handle ties using secondary metrics
    - Store winner in self.best_model

11. **Log comparison results**
    - Log all models and their MAPE scores
    - Log selected model and reason
    - Create formatted comparison table

12. **Return best model name**
    - Return name as string ('prophet' or 'arima')
    - Model name matches forecaster.name attribute

13. **Add helper for result formatting**
    - Create format_results method
    - Pretty-print comparison table
    - Include all metrics for transparency

### Model Comparison Flow

```
Input DataFrame
       │
       ▼
┌──────────────────┐
│ For each model:  │
│ - Prophet        │
│ - ARIMA          │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Prophet    ARIMA
CV(5)      CV(5)
    │         │
    │         │
    ▼         ▼
MAE: 5.2   MAE: 6.1
MAPE: 12.3 MAPE: 14.7
    │         │
    └────┬────┘
         │
         ▼
Compare MAPE scores
    12.3 < 14.7
         │
         ▼
Select Prophet
(lowest MAPE)
         │
         ▼
Return "prophet"
```

### Method Implementation Pattern

```python
def compare_models(
    self,
    df: pd.DataFrame,
    **kwargs
) -> str:
    """Compare forecasting models and select best performer."""
    
    # 1. Validate input
    if len(df) < 60:
        raise ValueError("Need at least 60 days of data")
    
    # 2. Initialize results storage
    self.metrics = {}
    
    # 3. Evaluate each forecaster
    for forecaster in self.forecasters:
        try:
            logger.info(f"Evaluating {forecaster.name}...")
            
            # Perform cross-validation
            metrics = self.cross_validate(forecaster, df, **kwargs)
            
            # Store results
            self.metrics[forecaster.name] = metrics
            
            logger.info(
                f"{forecaster.name} - "
                f"MAPE: {metrics['mape']:.2f}%, "
                f"MAE: {metrics['mae']:.2f}"
            )
            
        except Exception as e:
            logger.error(f"{forecaster.name} evaluation failed: {e}")
            continue
    
    # 4. Ensure at least one model succeeded
    if not self.metrics:
        raise RuntimeError("All models failed evaluation")
    
    # 5. Select best model (lowest MAPE)
    best_name = min(
        self.metrics.keys(),
        key=lambda k: self.metrics[k]['mape']
    )
    
    # 6. Store and log result
    self.best_model = best_name
    logger.info(
        f"Best model: {best_name} "
        f"(MAPE: {self.metrics[best_name]['mape']:.2f}%)"
    )
    
    # 7. Return best model name
    return best_name
```

### Selection Criteria

| Priority | Metric | Comparison | Reason |
|----------|--------|------------|--------|
| 1 | MAPE | Lowest wins | Scale-independent |
| 2 | MAE | Lowest wins (tiebreaker) | Absolute error |
| 3 | RMSE | Lowest wins (2nd tiebreaker) | Penalizes outliers |
| 4 | Training Time | Faster wins (3rd tiebreaker) | Efficiency |

### Handling Ties

```python
# If MAPE scores very close (< 1% difference)
mape_diff = abs(metrics_a['mape'] - metrics_b['mape'])

if mape_diff < 1.0:
    # Use MAE as tiebreaker
    if metrics_a['mae'] < metrics_b['mae']:
        winner = 'model_a'
    elif metrics_b['mae'] < metrics_a['mae']:
        winner = 'model_b'
    else:
        # If still tied, prefer faster model
        winner = 'arima'  # ARIMA is typically faster
```

### Results Formatting Method

```python
def format_results(self) -> str:
    """Format comparison results as table."""
    
    lines = ["\n=== Model Comparison Results ===\n"]
    lines.append(f"{'Model':<10} {'MAPE':<8} {'MAE':<8} {'RMSE':<8} {'Splits':<8}")
    lines.append("-" * 50)
    
    for name, metrics in self.metrics.items():
        is_best = "✓" if name == self.best_model else " "
        lines.append(
            f"{is_best} {name:<10} "
            f"{metrics['mape']:>6.2f}% "
            f"{metrics['mae']:>6.2f} "
            f"{metrics['rmse']:>6.2f} "
            f"{metrics['n_splits']:>8}"
        )
    
    lines.append("\n" + "=" * 50)
    lines.append(f"Selected: {self.best_model}\n")
    
    return "\n".join(lines)
```

### Example Output

```
=== Model Comparison Results ===

Model      MAPE     MAE      RMSE     Splits  
--------------------------------------------------
✓ prophet   12.30%   5.20     7.10        5
  arima     14.70%   6.10     8.30        5

==================================================
Selected: prophet
```

### Decision Logic for Edge Cases

| Scenario | Decision | Rationale |
|----------|----------|-----------|
| Both models fail CV | Raise error | Cannot proceed |
| One model fails CV | Use working model | Better than nothing |
| MAPE difference < 1% | Compare MAE | More detailed comparison |
| All metrics equal | Choose ARIMA | Faster training |
| Insufficient data | Raise error | Cannot validate |

### Integration with Forecasting Pipeline

```
New Product
       │
       ▼
Collect 60+ days data
       │
       ▼
ModelSelector.compare_models()
       │
       ▼
Best model selected
       │
       ▼
Store model preference
       │
       ▼
Use for production forecasts
       │
       ▼
Re-evaluate quarterly
```

### Performance Considerations

| Factor | Impact | Optimization |
|--------|--------|--------------|
| Number of models | Linear increase | Parallelize comparisons |
| CV splits | Linear increase | Reduce splits for speed |
| Data size | Super-linear | Sample large datasets |
| Model complexity | Varies by model | Use stepwise ARIMA |

### Expected Outcome
- compare_models method implemented in ModelSelector
- Validates input data sufficiency
- Iterates through all forecasters
- Performs cross-validation for each
- Stores metrics for all models
- Compares MAPE scores to select winner
- Handles evaluation failures gracefully
- Returns name of best-performing model
- Logs comparison results for transparency

### Verification Checklist
- [ ] compare_models method defined in ModelSelector
- [ ] Accepts df: DataFrame parameter
- [ ] Accepts **kwargs for CV configuration
- [ ] Return type is str
- [ ] Input data validation performed
- [ ] Metrics dictionary initialized
- [ ] Iteration through forecasters implemented
- [ ] cross_validate called for each forecaster
- [ ] Results stored in self.metrics
- [ ] Best model selected (lowest MAPE)
- [ ] self.best_model attribute set
- [ ] Evaluation failures handled
- [ ] Comparison results logged
- [ ] format_results method implemented (optional)
- [ ] Docstring complete

---

## Task 64: Create ForecastTrainingTask

### Overview
Create the ForecastTrainingTask Celery task to automate weekly retraining of demand forecasts for all active products. This background task queries products, loads historical sales data, performs model selection if needed, trains forecasts, and stores predictions in the database. Automated retraining ensures forecasts remain accurate as new sales data becomes available, maintaining high prediction quality without manual intervention.

### Dependencies
- Task 63: Create compare_models Method (all algorithms and selector complete)

### Instructions

1. **Create tasks directory structure**
   - Navigate to `backend/apps/ai/forecasting/` directory
   - Create directory named `tasks` if not exists
   - Create `__init__.py` in tasks directory

2. **Create training_tasks module**
   - Create file `training_tasks.py` in `tasks/` directory
   - This contains Celery task definitions

3. **Import required dependencies**
   - Import celery app (from project celery config)
   - Import ProphetForecaster, ARIMAForecaster, ModelSelector
   - Import Product model (from inventory app)
   - Import SalesTransaction model (for historical data)
   - Import DemandForecast model (to store predictions)
   - Import pandas and datetime
   - Import logging

4. **Define train_forecasts_task**
   - Decorate with @celery_app.task
   - Task name: 'forecasting.train_forecasts'
   - Set queue: 'training' (separate from default queue)
   - Set soft_time_limit: 600 seconds (10 minutes per product)
   - Set max_retries: 3

5. **Write task docstring**
   - Describe purpose: automated forecast training
   - Document parameters (if any)
   - Explain execution flow
   - Note scheduling (weekly on Sundays)

6. **Query active products**
   - Get all products with is_active=True
   - Filter for products with sales history
   - Optionally prioritize high-volume products

7. **Iterate through products**
   - For each product:
     - Load historical sales data (90 days)
     - Check if sufficient data (>= 30 days)
     - Perform model selection or use existing preference
     - Train selected model
     - Generate 30-day forecast
     - Store predictions in database
     - Log progress

8. **Load historical sales data**
   - Query SalesTransaction for product
   - Aggregate by date (sum quantities)
   - Create DataFrame with 'ds' and 'y' columns
   - Fill missing dates with zero demand

9. **Perform model selection**
   - Check if product has model preference stored
   - If no preference or periodic re-evaluation:
     - Create ModelSelector
     - Run compare_models
     - Store selected model in product metadata
   - If preference exists, use that model

10. **Train selected model**
    - Instantiate forecaster (Prophet or ARIMA)
    - Call train method with historical data
    - Handle training failures gracefully

11. **Generate forecasts**
    - Call predict method for 30-day horizon
    - Extract predictions with confidence intervals

12. **Store predictions in database**
    - Delete existing forecasts for product (future dates)
    - Create DemandForecast records for each prediction
    - Store date, predicted_demand, lower_bound, upper_bound
    - Store algorithm name and training metadata

13. **Handle errors per product**
    - Catch exceptions for individual products
    - Log error details
    - Continue with next product
    - Don't fail entire task for one product

14. **Add task-level error handling**
    - Retry on infrastructure failures (DB connection)
    - Don't retry on data quality issues
    - Log summary statistics at end

15. **Log task completion**
    - Log number of products processed
    - Log number of successes and failures
    - Log total execution time

### Task Structure

```python
from celery import shared_task
from datetime import datetime, timedelta
import pandas as pd
import logging

logger = logging.getLogger(__name__)

@shared_task(
    name='forecasting.train_forecasts',
    queue='training',
    soft_time_limit=600,
    max_retries=3
)
def train_forecasts_task():
    """
    Train demand forecasts for all active products.
    
    Runs weekly to retrain models with latest sales data.
    Performs model selection, training, and stores predictions.
    """
    
    # Implementation in next sections...
```

### Task Execution Flow

```
Task Triggered (Weekly)
       │
       ▼
┌─────────────────────┐
│ Query active        │
│ products            │
└──────────┬──────────┘
           │
           ▼
For each product:
       │
       ▼
┌─────────────────────┐
│ Load 90 days        │
│ sales history       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Model selection     │
│ (if needed)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Train forecaster    │
│ (Prophet/ARIMA)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Generate 30-day     │
│ forecast            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Store predictions   │
│ in DB               │
└──────────┬──────────┘
           │
           ▼
Next product or complete
```

### Historical Data Loading

```python
def load_sales_history(product_id: int, days: int = 90) -> pd.DataFrame:
    """Load historical sales data for product."""
    
    from apps.inventory.models import SalesTransaction
    
    # Calculate date range
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Query sales transactions
    sales = SalesTransaction.objects.filter(
        product_id=product_id,
        date__gte=start_date,
        date__lte=end_date
    ).values('date').annotate(
        quantity=Sum('quantity')
    ).order_by('date')
    
    # Create DataFrame
    df = pd.DataFrame(list(sales))
    
    if df.empty:
        return pd.DataFrame(columns=['ds', 'y'])
    
    # Rename columns for forecaster
    df = df.rename(columns={'date': 'ds', 'quantity': 'y'})
    
    # Fill missing dates with zero
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    df_complete = pd.DataFrame({'ds': date_range})
    df_complete = df_complete.merge(df, on='ds', how='left')
    df_complete['y'] = df_complete['y'].fillna(0)
    
    return df_complete
```

### Model Selection Logic

```python
# Check if product has model preference
if product.metadata and 'forecast_algorithm' in product.metadata:
    # Use existing preference (unless re-evaluation due)
    last_eval = product.metadata.get('last_model_eval')
    days_since_eval = (datetime.now().date() - last_eval).days if last_eval else 999
    
    if days_since_eval < 90:
        # Use existing model
        algorithm = product.metadata['forecast_algorithm']
    else:
        # Re-evaluate quarterly
        selector = ModelSelector()
        algorithm = selector.compare_models(df)
        
        # Update metadata
        product.metadata['forecast_algorithm'] = algorithm
        product.metadata['last_model_eval'] = datetime.now().date()
        product.save()
else:
    # First time, perform selection
    selector = ModelSelector()
    algorithm = selector.compare_models(df)
    
    # Store preference
    if not product.metadata:
        product.metadata = {}
    product.metadata['forecast_algorithm'] = algorithm
    product.metadata['last_model_eval'] = datetime.now().date()
    product.save()
```

### Forecast Storage

```python
def store_forecasts(product_id: int, forecasts: pd.DataFrame, algorithm: str):
    """Store forecast predictions in database."""
    
    from apps.ai.models import DemandForecast
    
    # Delete existing future forecasts for this product
    DemandForecast.objects.filter(
        product_id=product_id,
        forecast_date__gte=datetime.now().date()
    ).delete()
    
    # Create new forecast records
    forecast_records = []
    for _, row in forecasts.iterrows():
        forecast_records.append(
            DemandForecast(
                product_id=product_id,
                forecast_date=row['ds'],
                predicted_demand=row['yhat'],
                lower_bound=row['yhat_lower'],
                upper_bound=row['yhat_upper'],
                algorithm=algorithm,
                training_date=datetime.now(),
                confidence_level=0.95
            )
        )
    
    # Bulk create for efficiency
    DemandForecast.objects.bulk_create(forecast_records)
```

### Task Implementation Pattern

```python
@shared_task(name='forecasting.train_forecasts', queue='training')
def train_forecasts_task():
    """Train forecasts for all active products."""
    
    from apps.inventory.models import Product
    
    logger.info("Starting forecast training task")
    
    # Query products
    products = Product.objects.filter(is_active=True, has_sales_history=True)
    
    success_count = 0
    failure_count = 0
    
    for product in products:
        try:
            # Load data
            df = load_sales_history(product.id, days=90)
            
            if len(df) < 30:
                logger.warning(f"Product {product.id}: insufficient data")
                continue
            
            # Model selection
            if should_select_model(product):
                selector = ModelSelector()
                algorithm = selector.compare_models(df)
                update_model_preference(product, algorithm)
            else:
                algorithm = product.metadata.get('forecast_algorithm', 'prophet')
            
            # Train
            if algorithm == 'prophet':
                forecaster = ProphetForecaster({})
            else:
                forecaster = ARIMAForecaster({})
            
            forecaster.train(df)
            
            # Predict
            predictions = forecaster.predict(periods=30)
            
            # Store
            store_forecasts(product.id, predictions, algorithm)
            
            success_count += 1
            logger.info(f"Product {product.id}: forecast trained ({algorithm})")
            
        except Exception as e:
            failure_count += 1
            logger.error(f"Product {product.id} failed: {e}")
            continue
    
    logger.info(
        f"Forecast training complete: "
        f"{success_count} success, {failure_count} failures"
    )
```

### Error Handling Strategy

| Error Type | Retry? | Action |
|------------|--------|--------|
| Database connection | Yes | Retry entire task |
| Product data error | No | Skip product, continue |
| Training failure | No | Log error, skip product |
| Insufficient data | No | Log warning, skip product |
| Prediction error | No | Log error, skip product |

### Expected Outcome
- ForecastTrainingTask Celery task created
- Queries all active products with sales history
- Loads historical sales data (90 days)
- Performs model selection or uses preference
- Trains forecaster (Prophet or ARIMA)
- Generates 30-day forecasts
- Stores predictions in DemandForecast table
- Handles per-product errors gracefully
- Logs summary statistics
- Ready for weekly scheduling (Task 65)

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/tasks/` directory created
- [ ] `tasks/__init__.py` file created
- [ ] `training_tasks.py` file created
- [ ] train_forecasts_task function defined
- [ ] @shared_task decorator applied
- [ ] Task name set to 'forecasting.train_forecasts'
- [ ] Queue set to 'training'
- [ ] Soft time limit set (600 seconds)
- [ ] Product query implemented
- [ ] Historical data loading implemented
- [ ] Model selection logic implemented
- [ ] Forecaster training implemented
- [ ] Prediction generation implemented
- [ ] Database storage implemented
- [ ] Per-product error handling implemented
- [ ] Task-level error handling implemented
- [ ] Logging statements added
- [ ] Docstring complete

---

## Task 65: Create Forecast Schedule

### Overview
Configure the Celery Beat schedule to automatically execute the ForecastTrainingTask every Sunday at 4:00 AM. This scheduled task ensures forecasts are regularly retrained with the latest sales data, maintaining prediction accuracy without manual intervention. The Sunday 4:00 AM timing minimizes impact on business operations while ensuring fresh forecasts are available for the week ahead.

### Dependencies
- Task 64: Create ForecastTrainingTask

### Instructions

1. **Locate Celery Beat configuration**
   - Navigate to project Celery configuration file
   - Typically: `backend/config/celery.py` or `backend/celery_app.py`
   - Find CELERY_BEAT_SCHEDULE setting

2. **Add forecast training schedule**
   - Add entry to CELERY_BEAT_SCHEDULE dictionary
   - Schedule key: 'train-demand-forecasts-weekly'
   - Configure for Sunday 4:00 AM

3. **Configure crontab schedule**
   - Use crontab schedule (not interval)
   - Sunday = day_of_week=0
   - Time: hour=4, minute=0
   - Timezone: 'Asia/Colombo' (Sri Lanka)

4. **Specify task to execute**
   - Task: 'forecasting.train_forecasts'
   - No args needed (task queries all products)
   - No kwargs needed

5. **Add schedule options**
   - Set enabled=True (can disable for maintenance)
   - Add description for documentation

6. **Test schedule configuration**
   - Validate crontab syntax
   - Check next execution time
   - Verify timezone handling

7. **Add monitoring and logging**
   - Configure Celery result backend
   - Enable task history for monitoring
   - Set up alerts for failures

8. **Document schedule**
   - Add comment explaining schedule
   - Document rationale for timing choice
   - Note dependencies (database, models)

### Celery Beat Schedule Configuration

```python
from celery.schedules import crontab

# In celery.py or celery_app.py
app.conf.beat_schedule = {
    # ... other scheduled tasks ...
    
    'train-demand-forecasts-weekly': {
        'task': 'forecasting.train_forecasts',
        'schedule': crontab(
            hour=4,
            minute=0,
            day_of_week=0,  # Sunday
        ),
        'options': {
            'queue': 'training',
            'expires': 3600,  # Expire if not run within 1 hour
        },
        'description': 'Train demand forecasts for all products weekly',
    },
}

# Set timezone for schedule
app.conf.timezone = 'Asia/Colombo'
```

### Crontab Schedule Syntax

| Field | Value | Description |
|-------|-------|-------------|
| minute | 0 | At minute 0 (top of hour) |
| hour | 4 | At 4:00 AM |
| day_of_week | 0 | Sunday (0=Sunday, 6=Saturday) |
| day_of_month | * | Every day of month (default) |
| month_of_year | * | Every month (default) |

### Alternative Schedule Examples

```python
# Every Sunday at 4:00 AM (current requirement)
crontab(hour=4, minute=0, day_of_week=0)

# Every day at 3:00 AM (daily retraining)
crontab(hour=3, minute=0)

# Every Monday and Thursday at 2:30 AM (twice weekly)
crontab(hour=2, minute=30, day_of_week='1,4')

# First day of every month at 5:00 AM (monthly)
crontab(hour=5, minute=0, day_of_month=1)
```

### Why Sunday 4:00 AM?

| Consideration | Rationale |
|---------------|-----------|
| Day: Sunday | Lowest business activity |
| Time: 4:00 AM | Minimal system load |
| Weekly frequency | Balance freshness and cost |
| Before business hours | Fresh forecasts for Monday |
| After sales cutoff | Include Saturday sales data |

### Complete Configuration Example

```python
# backend/config/celery.py

from celery import Celery
from celery.schedules import crontab
from django.conf import settings

app = Celery('lankacommerce')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Beat schedule configuration
app.conf.beat_schedule = {
    'train-demand-forecasts-weekly': {
        'task': 'forecasting.train_forecasts',
        'schedule': crontab(
            hour=4,
            minute=0,
            day_of_week=0,  # Sunday
        ),
        'options': {
            'queue': 'training',
            'expires': 3600,
            'time_limit': 7200,  # 2 hours max
        },
        'description': (
            'Weekly training of demand forecasts for all products. '
            'Runs Sunday 4:00 AM to ensure fresh forecasts for the week.'
        ),
    },
}

# Timezone for beat schedule
app.conf.timezone = 'Asia/Colombo'

# Result backend for monitoring
app.conf.result_backend = 'redis://localhost:6379/1'
app.conf.result_expires = 86400  # 24 hours

# Task routing
app.conf.task_routes = {
    'forecasting.train_forecasts': {'queue': 'training'},
}

app.autodiscover_tasks()
```

### Running Celery Beat

```bash
# Start Celery Beat scheduler (separate process)
celery -A config.celery beat --loglevel=info

# Start Celery worker for training queue
celery -A config.celery worker -Q training --loglevel=info

# Combined (for development only)
celery -A config.celery worker -B -Q training --loglevel=info
```

### Monitoring Scheduled Tasks

```python
# View registered schedules
from celery import current_app
schedules = current_app.conf.beat_schedule
for name, config in schedules.items():
    print(f"{name}: {config['schedule']}")

# Check next execution time
from celery.schedules import crontab
schedule = crontab(hour=4, minute=0, day_of_week=0)
next_run = schedule.remaining_estimate(
    current_app.now()
)
print(f"Next run in: {next_run}")
```

### Testing the Schedule

```python
# Test task execution manually
from apps.ai.forecasting.tasks.training_tasks import train_forecasts_task

# Run synchronously for testing
result = train_forecasts_task()

# Or apply async (actual Celery execution)
task = train_forecasts_task.apply_async()
print(f"Task ID: {task.id}")
print(f"Status: {task.status}")
```

### Schedule Verification Checklist

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Task registered | `celery -A config inspect registered` | Task in list |
| Schedule active | `celery -A config inspect scheduled` | Appears when due |
| Next execution | Calculate from crontab | Sunday 4:00 AM |
| Timezone correct | Check app.conf.timezone | 'Asia/Colombo' |

### Production Deployment Considerations

```python
# Production settings (settings/production.py)

# Use separate Redis for Celery results
CELERY_RESULT_BACKEND = 'redis://redis-celery:6379/0'

# Increase visibility timeout for long tasks
CELERY_TASK_RESULT_EXPIRES = 172800  # 48 hours

# Monitor with Flower
# pip install flower
# celery -A config flower --port=5555

# Systemd service for Beat (example)
# /etc/systemd/system/celery-beat.service
"""
[Unit]
Description=Celery Beat Service
After=network.target redis.target

[Service]
Type=simple
User=celery
WorkingDirectory=/app
ExecStart=/venv/bin/celery -A config.celery beat --loglevel=info
Restart=always

[Install]
WantedBy=multi-user.target
"""
```

### Expected Outcome
- Celery Beat schedule configured for weekly forecast training
- Task executes every Sunday at 4:00 AM Sri Lanka time
- Schedule uses crontab for precise timing
- Configuration includes task options (queue, expiry)
- Timezone properly set to 'Asia/Colombo'
- Schedule is documented and tested
- Monitoring and logging configured

### Verification Checklist
- [ ] Celery configuration file located
- [ ] CELERY_BEAT_SCHEDULE dictionary updated
- [ ] Schedule entry added: 'train-demand-forecasts-weekly'
- [ ] Crontab schedule configured (hour=4, minute=0, day_of_week=0)
- [ ] Task name specified: 'forecasting.train_forecasts'
- [ ] Queue specified: 'training'
- [ ] Timezone set to 'Asia/Colombo'
- [ ] Task expiry configured
- [ ] Description added for documentation
- [ ] Schedule tested manually
- [ ] Next execution time verified
- [ ] Celery Beat service configured for production

---

## Task 66: Verify Forecasting

### Overview
Perform comprehensive verification of the complete demand forecasting system, testing all components from data input through model training to forecast generation and storage. This verification ensures the ForecastTrainer ABC, ProphetForecaster, ARIMAForecaster, ModelSelector, and ForecastTrainingTask work correctly together, producing accurate forecasts that are properly stored and accessible for reorder suggestions and business planning.

### Dependencies
- Task 65: Create Forecast Schedule (entire Group-D complete)

### Instructions

1. **Prepare test data**
   - Create test product with 90 days of sales history
   - Generate realistic sales patterns (trend, seasonality)
   - Include Sri Lankan festivals in data
   - Add some noise and outliers

2. **Test ForecastTrainer ABC**
   - Verify abstract methods cannot be instantiated directly
   - Confirm ProphetForecaster and ARIMAForecaster inherit correctly
   - Check class attributes (name, requires_holidays, supports_seasonality)

3. **Test ProphetForecaster**
   - Create instance with test configuration
   - Load test data and call train method
   - Verify model trains successfully
   - Verify holidays are added (check model.holidays)
   - Verify seasonality is configured
   - Call predict method for 30 days
   - Verify output format (ds, yhat, yhat_lower, yhat_upper)
   - Check predictions are reasonable (positive, follow pattern)

4. **Test ARIMAForecaster**
   - Create instance with test configuration
   - Train on same test data
   - Verify auto_arima selects reasonable parameters
   - Verify model trains successfully
   - Generate predictions for 30 days
   - Verify output format matches specification
   - Compare predictions with Prophet

5. **Test ModelSelector**
   - Create ModelSelector instance
   - Provide both forecasters
   - Run compare_models on test data
   - Verify cross-validation executes
   - Check metrics are calculated (MAE, RMSE, MAPE)
   - Verify model selection (best model identified)
   - Review comparison results

6. **Test ForecastTrainingTask**
   - Create test product in database
   - Add sales transactions (90 days)
   - Trigger task manually (not scheduled)
   - Verify task completes successfully
   - Check DemandForecast records created
   - Verify 30 days of forecasts stored
   - Check forecast values are reasonable

7. **Test Celery Beat schedule**
   - Verify schedule is registered
   - Check next execution time
   - Confirm Sunday 4:00 AM timing
   - Validate timezone (Asia/Colombo)

8. **Test edge cases**
   - Insufficient data (< 30 days) → should skip or fail gracefully
   - Constant demand (no variation) → should handle
   - Missing data (gaps) → should interpolate or handle
   - Extreme values → should not crash

9. **Test end-to-end flow**
   - Create multiple test products
   - Populate sales history
   - Run training task
   - Verify forecasts for all products
   - Check model preferences stored
   - Verify different products may use different algorithms

10. **Validate forecast quality**
    - Calculate in-sample metrics
    - Holdout test set evaluation
    - Check MAPE is reasonable (< 30% for good products)
    - Verify confidence intervals contain actuals
    - Compare against naive baseline (yesterday's value)

11. **Test festival impact**
    - Create scenario with Sinhala New Year
    - Verify Prophet forecasts spike during festival
    - Check holiday effect is applied
    - Compare with ARIMA (no holiday effect)

12. **Document verification results**
    - Create test report with pass/fail for each component
    - Include example forecasts (visualization if possible)
    - Document any issues or limitations found
    - Note performance metrics (training time, accuracy)

### Verification Test Structure

```python
# test_forecasting.py

import pytest
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from apps.ai.forecasting.algorithms.base import ForecastTrainer
from apps.ai.forecasting.algorithms.prophet import ProphetForecaster
from apps.ai.forecasting.algorithms.arima import ARIMAForecaster
from apps.ai.forecasting.algorithms.selector import ModelSelector

class TestForecastTrainer:
    """Test abstract base class."""
    
    def test_cannot_instantiate_abc(self):
        """ForecastTrainer is abstract."""
        with pytest.raises(TypeError):
            ForecastTrainer({})
    
    def test_prophet_inherits_correctly(self):
        """ProphetForecaster inherits from ForecastTrainer."""
        assert issubclass(ProphetForecaster, ForecastTrainer)
        assert ProphetForecaster.name == 'prophet'
    
    def test_arima_inherits_correctly(self):
        """ARIMAForecaster inherits from ForecastTrainer."""
        assert issubclass(ARIMAForecaster, ForecastTrainer)
        assert ARIMAForecaster.name == 'arima'
```

### Test Data Generation

```python
def generate_test_data(days=90):
    """Generate realistic sales data with trend and seasonality."""
    
    dates = pd.date_range(
        end=datetime.now(),
        periods=days,
        freq='D'
    )
    
    # Base demand with trend
    base = 50 + np.linspace(0, 20, days)
    
    # Weekly seasonality (weekend boost)
    weekly = 10 * np.sin(2 * np.pi * np.arange(days) / 7)
    
    # Monthly seasonality (payday spikes)
    monthly = 5 * np.sin(2 * np.pi * np.arange(days) / 30.5)
    
    # Add noise
    noise = np.random.normal(0, 5, days)
    
    # Combine
    demand = base + weekly + monthly + noise
    demand = np.maximum(demand, 0)  # No negative demand
    
    return pd.DataFrame({
        'ds': dates,
        'y': demand
    })
```

### ProphetForecaster Tests

```python
class TestProphetForecaster:
    """Test Prophet implementation."""
    
    def test_train_and_predict(self):
        """Train Prophet and generate forecast."""
        
        # Generate data
        df = generate_test_data(days=90)
        
        # Create forecaster
        forecaster = ProphetForecaster({})
        
        # Train
        model = forecaster.train(df)
        assert model is not None
        assert forecaster.model is not None
        
        # Predict
        forecast = forecaster.predict(periods=30)
        
        # Validate output
        assert len(forecast) == 30
        assert 'ds' in forecast.columns
        assert 'yhat' in forecast.columns
        assert 'yhat_lower' in forecast.columns
        assert 'yhat_upper' in forecast.columns
        
        # Check values are reasonable
        assert (forecast['yhat'] >= 0).all()
        assert (forecast['yhat_lower'] <= forecast['yhat']).all()
        assert (forecast['yhat'] <= forecast['yhat_upper']).all()
```

### ARIMAForecaster Tests

```python
class TestARIMAForecaster:
    """Test ARIMA implementation."""
    
    def test_auto_arima_parameter_selection(self):
        """auto_arima selects reasonable parameters."""
        
        df = generate_test_data(days=90)
        forecaster = ARIMAForecaster({})
        
        p, d, q, P, D, Q, m = forecaster.auto_arima(df)
        
        # Check parameters in expected ranges
        assert 0 <= p <= 5
        assert 0 <= d <= 2
        assert 0 <= q <= 5
        assert 0 <= P <= 2
        assert 0 <= D <= 1
        assert 0 <= Q <= 2
        assert m == 7  # Weekly
    
    def test_train_and_predict(self):
        """Train ARIMA and generate forecast."""
        
        df = generate_test_data(days=90)
        forecaster = ARIMAForecaster({})
        
        model = forecaster.train(df)
        assert model is not None
        
        forecast = forecaster.predict(periods=30)
        assert len(forecast) == 30
        assert (forecast['yhat'] >= 0).all()
```

### ModelSelector Tests

```python
class TestModelSelector:
    """Test model selection."""
    
    def test_compare_models(self):
        """Compare Prophet and ARIMA."""
        
        df = generate_test_data(days=90)
        
        forecasters = [
            ProphetForecaster({}),
            ARIMAForecaster({})
        ]
        
        selector = ModelSelector(forecasters, {})
        best_model = selector.compare_models(df, n_splits=3)
        
        # Verify selection made
        assert best_model in ['prophet', 'arima']
        
        # Verify metrics calculated
        assert 'prophet' in selector.metrics
        assert 'arima' in selector.metrics
        assert 'mape' in selector.metrics['prophet']
        assert 'mae' in selector.metrics['arima']
```

### Verification Checklist Template

```markdown
## Forecasting System Verification Report

### Test Results

| Component | Test | Status | Notes |
|-----------|------|--------|-------|
| ForecastTrainer ABC | Inheritance | ✓ Pass | Both forecasters inherit correctly |
| ForecastTrainer ABC | Abstract methods | ✓ Pass | Cannot instantiate directly |
| ProphetForecaster | Training | ✓ Pass | Trains in 15.3s |
| ProphetForecaster | Prediction | ✓ Pass | 30-day forecast generated |
| ProphetForecaster | Holidays | ✓ Pass | 5 festivals added |
| ProphetForecaster | Seasonality | ✓ Pass | Monthly, weekly, yearly |
| ARIMAForecaster | auto_arima | ✓ Pass | Selected (1,1,1)(1,1,1)7 |
| ARIMAForecaster | Training | ✓ Pass | Trains in 4.2s |
| ARIMAForecaster | Prediction | ✓ Pass | 30-day forecast generated |
| ModelSelector | Cross-validation | ✓ Pass | 5 splits completed |
| ModelSelector | Comparison | ✓ Pass | Prophet selected (MAPE: 12.3%) |
| ForecastTrainingTask | Execution | ✓ Pass | 10 products processed |
| ForecastTrainingTask | Storage | ✓ Pass | 300 forecasts stored |
| Celery Schedule | Registration | ✓ Pass | Sunday 4:00 AM |

### Performance Metrics

| Metric | Prophet | ARIMA | Best |
|--------|---------|-------|------|
| MAPE | 12.3% | 14.7% | Prophet |
| MAE | 5.2 | 6.1 | Prophet |
| RMSE | 7.1 | 8.3 | Prophet |
| Training Time | 15.3s | 4.2s | ARIMA |

### Issues Found
- None

### Recommendations
- Prophet preferred for products with festival impact
- ARIMA faster for daily retraining scenarios
- Model selection working as expected
```

### Expected Outcome
- All forecasting components verified and working
- ForecastTrainer ABC enforces interface contract
- ProphetForecaster trains and predicts accurately with holidays
- ARIMAForecaster uses auto-parameter selection effectively
- ModelSelector compares algorithms and selects best
- ForecastTrainingTask processes products and stores forecasts
- Celery schedule configured and registered
- Edge cases handled gracefully
- Forecast quality meets requirements (MAPE < 30%)
- System ready for production use

### Verification Checklist
- [ ] Test data generated (90 days with patterns)
- [ ] ForecastTrainer ABC tested (cannot instantiate)
- [ ] ProphetForecaster training tested
- [ ] ProphetForecaster prediction tested
- [ ] ProphetForecaster holidays verified
- [ ] ProphetForecaster seasonality verified
- [ ] ARIMAForecaster auto_arima tested
- [ ] ARIMAForecaster training tested
- [ ] ARIMAForecaster prediction tested
- [ ] ModelSelector cross-validation tested
- [ ] ModelSelector comparison tested
- [ ] ForecastTrainingTask execution tested
- [ ] Forecast storage in database verified
- [ ] Celery schedule registered and checked
- [ ] Edge cases tested (insufficient data, etc.)
- [ ] End-to-end flow verified
- [ ] Forecast quality validated (MAPE reasonable)
- [ ] Festival impact verified
- [ ] Verification report documented
- [ ] All tests pass

---

## Summary

This document completed the demand forecasting prediction algorithms implementation with ARIMA forecaster, model selection logic, and automated training tasks. The ARIMAForecaster provides a fast, statistical alternative to Prophet using automatic parameter selection. The ModelSelector compares algorithms using time series cross-validation to choose the best performer. The ForecastTrainingTask automates weekly retraining, ensuring forecasts remain accurate with fresh data.

### Completed Tasks
1. ✓ Created ARIMAForecaster class with pmdarima integration
2. ✓ Implemented auto_arima method for parameter selection
3. ✓ Implemented ARIMA train method with SARIMAX
4. ✓ Implemented ARIMA predict method with confidence intervals
5. ✓ Created ModelSelector for algorithm comparison
6. ✓ Implemented cross_validate method with expanding windows
7. ✓ Implemented compare_models method for selection
8. ✓ Created ForecastTrainingTask for automated training
9. ✓ Configured Celery Beat schedule (Sunday 4:00 AM)
10. ✓ Verified complete forecasting system

### Key Achievements
- **ARIMA Implementation**: Fast, classical time series forecasting with auto-parameter selection
- **Model Selection**: Cross-validation based comparison to choose optimal algorithm per product
- **Automated Training**: Weekly Celery task ensures forecasts stay fresh
- **Production Ready**: Complete system tested and verified, ready for deployment

### Architecture Summary

```
Demand Forecasting System Architecture

┌─────────────────────────────────────────────┐
│         ForecastTrainer (ABC)               │
│   + train(df) → model                       │
│   + predict(periods) → DataFrame            │
└─────────┬───────────────────────┬───────────┘
          │                       │
     ┌────┴────┐            ┌────┴────┐
     │ Prophet │            │  ARIMA  │
     │ Forecaster          │ Forecaster│
     └────┬────┘            └────┬────┘
          │                       │
          └───────┬───────────────┘
                  │
           ┌──────┴──────┐
           │ ModelSelector│
           │ (CV + Compare)
           └──────┬──────┘
                  │
        ┌─────────┴─────────┐
        │ ForecastTrainingTask│
        │ (Celery - Weekly)  │
        └─────────┬─────────┘
                  │
           ┌──────┴──────┐
           │ DemandForecast│
           │ (Database)   │
           └──────────────┘
```

### Next Steps
Proceed to [Group-E_Reorder-Suggestions](../Group-E_Reorder-Suggestions/) to implement automated purchase order suggestions based on forecasts, inventory levels, and supplier lead times.
