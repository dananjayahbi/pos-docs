# Tasks 49-56: ABC Forecaster and Prophet Implementation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** D - Prediction Algorithms  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Festival-Calendar](../Group-C_Festival-Calendar/)
- **→ Next Document:** [02_Tasks-57-66_ARIMA-Selector-Task.md](02_Tasks-57-66_ARIMA-Selector-Task.md)

---

## Document Overview

This document covers the creation of the abstract base forecaster class and Facebook Prophet implementation for demand forecasting. The ForecastTrainer abstract base class defines the interface for all forecasting algorithms with abstract train and predict methods. The ProphetForecaster implementation leverages Facebook's Prophet library with custom configuration for Sri Lankan holidays and seasonality patterns, enabling accurate time series forecasting with business calendar awareness.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create ForecastTrainer ABC | Medium | 45 min |
| 50 | Create train Abstract | Low | 20 min |
| 51 | Create predict Abstract | Low | 20 min |
| 52 | Create ProphetForecaster | High | 60 min |
| 53 | Create add_holidays Method | Medium | 40 min |
| 54 | Create add_seasonality Method | Medium | 40 min |
| 55 | Create Prophet train Method | High | 60 min |
| 56 | Create Prophet predict Method | Medium | 45 min |

---

## Task 49: Create ForecastTrainer ABC

### Overview
Create the ForecastTrainer abstract base class that defines the interface for all forecasting algorithms in the demand forecasting system. This abstract class establishes a consistent API pattern using the Template Method design pattern, ensuring all forecasting implementations provide standardized train and predict methods. The base class enables polymorphic usage of different forecasting algorithms while maintaining type safety and consistent behavior.

### Dependencies
- Task 48: Verify Festival Calendar (Group-C complete)
- Group-C: Festival Calendar implementation complete

### Instructions

1. **Create algorithms directory structure**
   - Navigate to `backend/apps/ai/forecasting/` directory
   - Create new directory named `algorithms`
   - This houses all forecasting algorithm implementations

2. **Create algorithms package initialization**
   - Create `__init__.py` file in `algorithms/` directory
   - Export forecaster classes for external import
   - Document module purpose in docstring

3. **Create base forecaster module**
   - Create file `base.py` in `algorithms/` directory
   - This contains the ForecastTrainer ABC

4. **Import required dependencies**
   - Import ABC and abstractmethod from abc module
   - Import pandas for DataFrame handling
   - Import typing for type hints (Optional, Dict, Any)
   - Import datetime for date handling

5. **Define ForecastTrainer abstract class**
   - Create class ForecastTrainer inheriting from ABC
   - Add comprehensive class docstring explaining purpose
   - Document that all forecasters must inherit from this class

6. **Add class-level attributes**
   - Define `name` class attribute for algorithm identification
   - Define `requires_holidays` boolean flag
   - Define `supports_seasonality` boolean flag
   - Set defaults in base class, override in implementations

7. **Add initialization method**
   - Create `__init__` method accepting configuration dictionary
   - Store configuration for algorithm-specific parameters
   - Initialize common attributes (model reference, training data, etc.)

8. **Document abstract method contracts**
   - Add detailed docstrings for abstract methods (Tasks 50-51)
   - Specify input/output types and expected behavior
   - Document exceptions that implementations may raise

### ForecastTrainer Class Structure

```
┌─────────────────────────────────────────┐
│      ForecastTrainer (ABC)              │
├─────────────────────────────────────────┤
│  + name: str                            │
│  + requires_holidays: bool              │
│  + supports_seasonality: bool           │
│  + config: Dict[str, Any]               │
│  + model: Optional[Any]                 │
│  + training_data: Optional[DataFrame]   │
├─────────────────────────────────────────┤
│  + __init__(config: Dict)               │
│  + train(df: DataFrame) → Any           │  ← Abstract (Task 50)
│  + predict(periods: int) → DataFrame    │  ← Abstract (Task 51)
│  + validate_data(df: DataFrame) → bool  │
│  + get_metrics() → Dict                 │
└─────────────────────────────────────────┘
          ▲                    ▲
          │                    │
    ┌─────┴─────┐        ┌─────┴─────┐
    │  Prophet  │        │   ARIMA   │
    └───────────┘        └───────────┘
```

### Base Class Attributes

| Attribute | Type | Purpose | Default |
|-----------|------|---------|---------|
| name | str | Algorithm identifier | "base" |
| requires_holidays | bool | Holiday support flag | False |
| supports_seasonality | bool | Seasonality support | False |
| config | Dict[str, Any] | Algorithm configuration | {} |
| model | Optional[Any] | Trained model reference | None |
| training_data | Optional[DataFrame] | Training dataset | None |

### Configuration Dictionary Structure

| Key | Type | Description | Required |
|-----|------|-------------|----------|
| product_id | int | Product to forecast | Yes |
| tenant_id | int | Tenant context | Yes |
| lookback_days | int | Historical data window | No (default: 90) |
| confidence_level | float | Prediction interval | No (default: 0.95) |
| algorithm_params | Dict | Algorithm-specific params | No |

### Data Validation Requirements

| Validation | Check | Error Handling |
|------------|-------|----------------|
| DataFrame columns | Must have 'ds' and 'y' | Raise ValueError |
| Missing values | Check for NaN/None | Raise ValueError |
| Date ordering | Ascending chronological | Raise ValueError |
| Minimum rows | At least 14 days of data | Raise ValueError |
| Data types | Correct column dtypes | Attempt coercion |

### Helper Methods to Implement

| Method | Purpose | Return Type |
|--------|---------|-------------|
| validate_data | Check data integrity | bool |
| prepare_dataframe | Format for algorithm | DataFrame |
| get_metrics | Return model metrics | Dict[str, float] |
| save_model | Persist trained model | str (path) |
| load_model | Load persisted model | None |

### Abstract Base Class Pattern Benefits

```
Consistency
├── All forecasters have same interface
├── train() and predict() guaranteed
└── Type checking at compile time

Extensibility
├── Easy to add new algorithms
├── No changes to calling code
└── Polymorphic usage

Testing
├── Mock implementations easy
├── Consistent test structure
└── Interface compliance checks
```

### Expected Outcome
- ForecastTrainer ABC created in algorithms/base.py
- Class attributes defined for algorithm identification
- Initialization method with configuration handling
- Abstract methods declared (implemented in Tasks 50-51)
- Helper methods defined for common operations
- Comprehensive docstrings and type hints
- Foundation for Prophet and ARIMA implementations

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/algorithms/` directory created
- [ ] `algorithms/__init__.py` file created
- [ ] `algorithms/base.py` file created
- [ ] ForecastTrainer class inherits from ABC
- [ ] Class attributes defined (name, requires_holidays, supports_seasonality)
- [ ] `__init__` method accepts configuration dictionary
- [ ] Abstract methods declared (train, predict)
- [ ] Helper methods defined (validate_data, get_metrics)
- [ ] Type hints used throughout
- [ ] Comprehensive docstrings provided
- [ ] Module exports configured in `__init__.py`

---

## Task 50: Create train Abstract Method

### Overview
Define the abstract train method in the ForecastTrainer base class. This method establishes the contract that all forecasting implementations must follow for model training. The method signature and documentation specify the input format (historical data as DataFrame), expected behavior (fit model to data), and return value (trained model reference or None). This ensures consistency across all forecasting algorithms.

### Dependencies
- Task 49: Create ForecastTrainer ABC

### Instructions

1. **Open base.py file**
   - Navigate to `backend/apps/ai/forecasting/algorithms/base.py`
   - Locate ForecastTrainer class definition

2. **Define train abstract method**
   - Add method decorated with `@abstractmethod`
   - Name method `train`
   - Method is instance method (includes self parameter)

3. **Specify method signature**
   - Accept `df` parameter of type pandas DataFrame
   - Accept optional `**kwargs` for algorithm-specific parameters
   - Return type is Any (different algorithms return different model types)

4. **Write comprehensive method docstring**
   - Describe purpose: train forecasting model on historical data
   - Document df parameter: time series data with 'ds' and 'y' columns
   - Document kwargs parameter: algorithm-specific configuration
   - Document return value: trained model object or model reference
   - Specify exceptions: ValueError for invalid data

5. **Document required DataFrame format**
   - Column 'ds': datetime64 type, date column
   - Column 'y': float64 type, target variable (demand quantity)
   - Index: not used, should be default integer index
   - Additional columns: ignored by base contract, used by implementations

6. **Add implementation notes**
   - Implementations should store trained model in self.model
   - Implementations should store training data in self.training_data
   - Implementations should validate data before training
   - Implementations should handle missing values appropriately

7. **Define training data expectations**
   - Minimum 14 days of historical data required
   - Daily frequency preferred (weekly accepted)
   - No gaps longer than 7 days
   - Recent data weighted higher than old data

### Method Signature

```python
@abstractmethod
def train(self, df: pd.DataFrame, **kwargs) -> Any:
    """
    Train the forecasting model on historical data.
    
    Args:
        df: Historical time series data with columns:
            - ds: datetime64, date column
            - y: float64, target variable (demand quantity)
        **kwargs: Algorithm-specific training parameters
        
    Returns:
        Trained model object or model reference
        
    Raises:
        ValueError: If data validation fails
        
    Implementation Requirements:
        - Validate input data format and quality
        - Store trained model in self.model
        - Store training data in self.training_data
        - Return model reference for chaining
    """
    pass
```

### DataFrame Structure

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| ds | datetime64 | Date/timestamp | Yes |
| y | float64 | Target variable (demand) | Yes |
| floor | float64 | Minimum forecast value | No |
| cap | float64 | Maximum forecast value | No |
| holidays | str | Holiday name | No |
| regressors | float64 | External variables | No |

### Training Data Quality Requirements

| Requirement | Threshold | Handling |
|-------------|-----------|----------|
| Minimum observations | 14 days | Raise ValueError |
| Maximum missing days | 20% | Interpolate or raise |
| Consecutive gaps | 7 days max | Raise ValueError |
| Outlier detection | 3 std dev | Flag but allow |
| Seasonality minimum | 2 cycles | Warn if insufficient |

### Implementation Guidelines for Subclasses

```
Prophet Implementation
├── Convert to Prophet format
├── Add holiday dataframe
├── Configure seasonality
├── Call model.fit(df)
└── Return self.model

ARIMA Implementation
├── Convert to stationary series
├── Select optimal parameters
├── Fit ARIMA model
├── Store fitted model
└── Return self.model

Custom Implementation
├── Validate data format
├── Apply preprocessing
├── Train algorithm
├── Store results
└── Return model reference
```

### Training Process Flow

```
Input DataFrame
       │
       ▼
┌──────────────┐
│ Validate     │
│ Data Format  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Check Data   │
│ Quality      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Preprocess   │
│ & Transform  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Train Model  │
│ Algorithm    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Store Model  │
│ in self      │
└──────┬───────┘
       │
       ▼
Return Model Reference
```

### Error Handling Strategy

| Error Type | Detection | Response |
|------------|-----------|----------|
| Missing columns | Check df.columns | Raise ValueError |
| Wrong data types | Check df.dtypes | Attempt conversion |
| Insufficient data | Check len(df) | Raise ValueError |
| Invalid dates | Check date range | Raise ValueError |
| NaN values | Check df.isnull() | Interpolate or raise |
| Duplicate dates | Check duplicates | Raise ValueError |

### Expected Outcome
- Abstract train method defined with @abstractmethod decorator
- Complete method signature with type hints
- Comprehensive docstring with parameter descriptions
- Return type specified as Any for flexibility
- Implementation guidelines documented
- Data format and quality requirements specified

### Verification Checklist
- [ ] train method added to ForecastTrainer class
- [ ] @abstractmethod decorator applied
- [ ] Method signature includes df: DataFrame parameter
- [ ] **kwargs accepted for flexibility
- [ ] Return type annotation is Any
- [ ] Docstring includes purpose description
- [ ] Docstring documents all parameters
- [ ] Docstring specifies return value
- [ ] Docstring lists possible exceptions
- [ ] Implementation requirements documented
- [ ] DataFrame format specified in docstring

---

## Task 51: Create predict Abstract Method

### Overview
Define the abstract predict method in the ForecastTrainer base class. This method establishes the contract for generating forecasts from trained models. The method specifies that implementations must accept a prediction horizon (number of periods) and return a DataFrame with forecasted values, confidence intervals, and timestamps. This standardizes the prediction interface across all forecasting algorithms.

### Dependencies
- Task 50: Create train Abstract Method

### Instructions

1. **Open base.py file**
   - Locate ForecastTrainer class in `algorithms/base.py`
   - Position after train abstract method

2. **Define predict abstract method**
   - Add method decorated with `@abstractmethod`
   - Name method `predict`
   - Method is instance method (includes self parameter)

3. **Specify method signature**
   - Accept `periods` parameter of type int (forecast horizon)
   - Accept optional `include_history` parameter (bool, default False)
   - Accept optional `**kwargs` for algorithm-specific options
   - Return type is pandas DataFrame

4. **Write comprehensive method docstring**
   - Describe purpose: generate forecasts for future periods
   - Document periods parameter: number of time steps to forecast
   - Document include_history: whether to include fitted values
   - Document kwargs: algorithm-specific prediction options
   - Document return format: DataFrame with specific columns
   - Specify exceptions: RuntimeError if model not trained

5. **Define required output DataFrame format**
   - Column 'ds': datetime64, forecast dates
   - Column 'yhat': float64, point forecast
   - Column 'yhat_lower': float64, lower confidence bound
   - Column 'yhat_upper': float64, upper confidence bound
   - Additional algorithm-specific columns allowed

6. **Document prediction requirements**
   - Model must be trained before calling predict
   - Periods must be positive integer
   - Confidence intervals default to 95%
   - Future dates extend from last training date

7. **Add implementation guidelines**
   - Check if self.model exists, raise error if not
   - Generate future date range from last training date
   - Calculate point forecasts and confidence intervals
   - Return DataFrame with standardized column names

### Method Signature

```python
@abstractmethod
def predict(
    self, 
    periods: int, 
    include_history: bool = False,
    **kwargs
) -> pd.DataFrame:
    """
    Generate forecasts for future periods.
    
    Args:
        periods: Number of time steps to forecast (must be > 0)
        include_history: Include fitted values for training period
        **kwargs: Algorithm-specific prediction options
        
    Returns:
        DataFrame with columns:
            - ds: datetime64, forecast dates
            - yhat: float64, point forecast
            - yhat_lower: float64, lower confidence bound (default 2.5%)
            - yhat_upper: float64, upper confidence bound (default 97.5%)
            
    Raises:
        RuntimeError: If model has not been trained
        ValueError: If periods <= 0
        
    Implementation Requirements:
        - Check if self.model exists
        - Generate future date range
        - Calculate predictions and confidence intervals
        - Return DataFrame with standardized columns
    """
    pass
```

### Output DataFrame Structure

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| ds | datetime64 | Forecast date | Yes |
| yhat | float64 | Point forecast | Yes |
| yhat_lower | float64 | Lower confidence bound | Yes |
| yhat_upper | float64 | Upper confidence bound | Yes |
| trend | float64 | Trend component | No (Prophet) |
| seasonal | float64 | Seasonal component | No (Prophet) |
| holidays | float64 | Holiday effect | No (Prophet) |

### Prediction Process Flow

```
Check Model Trained
       │
       ▼
Validate periods > 0
       │
       ▼
┌──────────────────┐
│ Get Last Date    │
│ from Training    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate Future  │
│ Date Range       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Call Model       │
│ Predict Method   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Extract Results  │
│ & Format         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate CI     │
│ if not provided  │
└────────┬─────────┘
         │
         ▼
Return DataFrame
```

### Confidence Interval Calculation

| Method | Description | Use Case |
|--------|-------------|----------|
| Quantile-based | Use model prediction intervals | Prophet |
| Standard error | Mean ± (z * SE) | ARIMA |
| Bootstrap | Resample residuals | Custom models |
| Analytical | Closed-form solution | Simple models |

### Prediction Horizon Guidelines

| Horizon | Periods | Use Case | Reliability |
|---------|---------|----------|-------------|
| Short-term | 1-7 days | Immediate planning | High |
| Medium-term | 8-30 days | Monthly planning | Medium |
| Long-term | 31-90 days | Quarterly planning | Lower |
| Very long-term | 90+ days | Strategic planning | Lowest |

### Include History Behavior

```
include_history = False
└── Return only future predictions

include_history = True
├── Training period: fitted values
├── Future period: forecasted values
└── Useful for visualization
```

### Error Handling

| Error Condition | Check | Response |
|----------------|-------|----------|
| Model not trained | self.model is None | Raise RuntimeError |
| Invalid periods | periods <= 0 | Raise ValueError |
| Too many periods | periods > 365 | Warn, allow |
| Model expired | training_date too old | Warn, allow |

### Implementation Examples by Algorithm

```
Prophet Implementation
├── Create future dataframe
├── Add holiday info to future dates
├── Call model.predict(future)
├── Extract yhat, yhat_lower, yhat_upper
└── Return formatted DataFrame

ARIMA Implementation
├── Get forecast from fitted model
├── Specify steps = periods
├── Extract forecast values
├── Calculate confidence intervals
└── Create output DataFrame

Custom Implementation
├── Generate date range
├── Apply model prediction
├── Calculate uncertainty
├── Format as DataFrame
└── Return results
```

### Expected Outcome
- Abstract predict method defined with @abstractmethod decorator
- Complete method signature with type hints
- periods parameter for forecast horizon
- include_history parameter for fitted values
- Comprehensive docstring with all parameters
- Output DataFrame format clearly specified
- Implementation requirements documented
- Error handling guidelines provided

### Verification Checklist
- [ ] predict method added to ForecastTrainer class
- [ ] @abstractmethod decorator applied
- [ ] Method signature includes periods: int parameter
- [ ] include_history: bool parameter with default False
- [ ] **kwargs accepted for flexibility
- [ ] Return type annotation is DataFrame
- [ ] Docstring includes purpose description
- [ ] Docstring documents all parameters
- [ ] Docstring specifies output DataFrame columns
- [ ] Docstring lists possible exceptions
- [ ] Implementation requirements documented
- [ ] Confidence interval calculation documented

---

## Task 52: Create ProphetForecaster

### Overview
Create the ProphetForecaster class that implements the ForecastTrainer interface using Facebook's Prophet time series forecasting library. Prophet is designed for business time series with strong seasonal effects and multiple seasonality patterns. This implementation provides Sri Lankan business calendar support, automatic holiday detection, and configurable seasonality components suitable for retail demand forecasting.

### Dependencies
- Task 51: Create predict Abstract Method (ABC complete)

### Instructions

1. **Install Prophet library**
   - Add `prophet` to backend requirements
   - Install using pip: `pip install prophet`
   - Note: Prophet requires pystan, may need compiler

2. **Create ProphetForecaster module**
   - Create file `prophet.py` in `algorithms/` directory
   - This contains the Prophet implementation

3. **Import required dependencies**
   - Import Prophet from prophet library
   - Import pandas for DataFrame operations
   - Import numpy for numerical operations
   - Import ForecastTrainer from base module
   - Import FestivalCalendar from calendar service (Group-C)
   - Import logging for error tracking

4. **Define ProphetForecaster class**
   - Create class inheriting from ForecastTrainer
   - Override class attributes for Prophet specifics
   - Add comprehensive class docstring

5. **Set class-level attributes**
   - Set name = "prophet"
   - Set requires_holidays = True
   - Set supports_seasonality = True

6. **Implement initialization method**
   - Call super().__init__(config) for base initialization
   - Initialize self.model to None initially
   - Store festival_calendar instance for holiday retrieval
   - Extract Prophet-specific config parameters
   - Set default Prophet parameters if not provided

7. **Define default Prophet parameters**
   - growth: 'linear' (default) or 'logistic'
   - changepoint_prior_scale: 0.05 (flexibility of trend)
   - seasonality_prior_scale: 10.0 (seasonality strength)
   - holidays_prior_scale: 10.0 (holiday effect strength)
   - seasonality_mode: 'multiplicative' for demand (or 'additive')
   - interval_width: 0.95 (95% confidence intervals)
   - daily_seasonality: False (too granular for demand)
   - weekly_seasonality: True (day of week patterns)
   - yearly_seasonality: True (annual cycles)

8. **Store configuration attributes**
   - Store each Prophet parameter as instance attribute
   - Allow overrides through config dictionary
   - Validate parameter values and ranges

9. **Prepare for train and predict methods**
   - Methods implemented in Tasks 55-56
   - Helper methods added in Tasks 53-54

### ProphetForecaster Class Structure

```
┌──────────────────────────────────────────┐
│      ProphetForecaster                   │
│      (ForecastTrainer)                   │
├──────────────────────────────────────────┤
│  + name = "prophet"                      │
│  + requires_holidays = True              │
│  + supports_seasonality = True           │
│                                          │
│  + festival_calendar: FestivalCalendar   │
│  + growth: str                           │
│  + changepoint_prior_scale: float        │
│  + seasonality_prior_scale: float        │
│  + holidays_prior_scale: float           │
│  + seasonality_mode: str                 │
│  + interval_width: float                 │
├──────────────────────────────────────────┤
│  + __init__(config: Dict)                │
│  + add_holidays(model) → None            │  ← Task 53
│  + add_seasonality(model) → None         │  ← Task 54
│  + train(df) → Prophet                   │  ← Task 55
│  + predict(periods) → DataFrame          │  ← Task 56
└──────────────────────────────────────────┘
           │
           │ Uses
           ▼
┌──────────────────────┐
│   Facebook Prophet   │
│   (External Lib)     │
└──────────────────────┘
```

### Prophet Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| growth | str | 'linear' | Trend type: 'linear' or 'logistic' |
| changepoint_prior_scale | float | 0.05 | Trend flexibility (0.001-0.5) |
| seasonality_prior_scale | float | 10.0 | Seasonality strength (0.01-10) |
| holidays_prior_scale | float | 10.0 | Holiday effect strength |
| seasonality_mode | str | 'multiplicative' | 'additive' or 'multiplicative' |
| interval_width | float | 0.95 | Confidence interval width |
| daily_seasonality | bool | False | Enable daily pattern |
| weekly_seasonality | bool | True | Enable weekly pattern |
| yearly_seasonality | bool | True | Enable annual pattern |

### Seasonality Mode Decision

| Data Characteristic | Recommended Mode | Reason |
|---------------------|------------------|--------|
| Constant amplitude | Additive | Seasonal effect is fixed |
| Growing amplitude | Multiplicative | Seasonal effect scales with trend |
| Retail demand | Multiplicative | Seasonality grows with sales volume |
| Temperature data | Additive | Seasonal variation is constant |

### Prophet Growth Models

```
Linear Growth
└── Trend is straight line
    └── Good for: stable products

Logistic Growth
├── Trend has carrying capacity
├── Requires 'cap' column in data
└── Good for: market saturation
```

### Configuration Dictionary Example

```python
config = {
    'product_id': 123,
    'tenant_id': 1,
    'algorithm_params': {
        'growth': 'linear',
        'changepoint_prior_scale': 0.05,
        'seasonality_mode': 'multiplicative',
        'interval_width': 0.95,
        'custom_seasonalities': [
            {
                'name': 'monthly',
                'period': 30.5,
                'fourier_order': 5
            }
        ]
    }
}
```

### FestivalCalendar Integration

```
ProphetForecaster.__init__
       │
       ▼
Store FestivalCalendar instance
       │
       ▼
add_holidays method (Task 53)
       │
       ▼
Query festivals from calendar
       │
       ▼
Convert to Prophet holiday format
       │
       ▼
Add to Prophet model
```

### Prophet Advantages for Demand Forecasting

| Feature | Benefit |
|---------|---------|
| Holiday effects | Sri Lankan festivals handled |
| Multiple seasonality | Weekly, monthly, yearly patterns |
| Missing data | Handles gaps automatically |
| Outliers | Robust to anomalies |
| Interpretability | Components easily explained |
| Confidence intervals | Built-in uncertainty quantification |

### Initialization Flow Diagram

```
config received
       │
       ▼
┌─────────────────┐
│ Call super()    │
│ __init__        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract Prophet │
│ parameters      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Set defaults    │
│ if not provided │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate param  │
│ ranges          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Initialize      │
│ FestivalCalendar│
└────────┬────────┘
         │
         ▼
Ready for training
```

### Expected Outcome
- ProphetForecaster class created in algorithms/prophet.py
- Class inherits from ForecastTrainer
- Class attributes set (name, requires_holidays, supports_seasonality)
- Initialization method implemented with config handling
- Default Prophet parameters defined
- FestivalCalendar integration prepared
- Configuration validation implemented
- Ready for helper methods (Tasks 53-54) and main methods (Tasks 55-56)

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/algorithms/prophet.py` file created
- [ ] ProphetForecaster class inherits from ForecastTrainer
- [ ] Class attributes set correctly (name="prophet")
- [ ] requires_holidays = True
- [ ] supports_seasonality = True
- [ ] `__init__` method implemented
- [ ] Config dictionary parameter accepted
- [ ] super().__init__(config) called
- [ ] Default Prophet parameters defined
- [ ] FestivalCalendar instance stored
- [ ] Prophet library imported successfully
- [ ] Type hints used throughout
- [ ] Comprehensive docstring provided

---

## Task 53: Create add_holidays Method

### Overview
Implement the add_holidays method in ProphetForecaster to integrate Sri Lankan festival data into the Prophet model. This method queries the FestivalCalendar service for relevant festivals, converts them to Prophet's holiday format, and adds them to the model before training. Proper holiday configuration enables Prophet to model demand spikes during festivals like Sinhala New Year, Vesak, and Christmas.

### Dependencies
- Task 52: Create ProphetForecaster

### Instructions

1. **Open prophet.py file**
   - Navigate to ProphetForecaster class
   - Add method after __init__ method

2. **Define add_holidays method**
   - Method name: `add_holidays`
   - Accept `model` parameter (Prophet model instance)
   - Return type is None (modifies model in place)
   - Instance method (includes self parameter)

3. **Write method docstring**
   - Describe purpose: add Sri Lankan holidays to Prophet
   - Document model parameter: Prophet model to configure
   - Explain holiday effects on forecasting
   - Note modification is in-place

4. **Query festivals from calendar**
   - Use self.festival_calendar to get festivals
   - Query date range covering training + forecast period
   - Get all recurring and one-time festivals
   - Include festivals from previous year for pattern learning

5. **Determine holiday date range**
   - Start date: training start date minus 1 year
   - End date: training end date plus forecast horizon
   - Buffer ensures all relevant festivals included
   - Consider recurring vs one-time festivals

6. **Convert Festival model to Prophet format**
   - Prophet expects DataFrame with specific columns
   - Extract festival name, date, impact_factor
   - Calculate lower_window and upper_window
   - Handle recurring vs fixed dates

7. **Create holidays DataFrame**
   - Column 'holiday': festival name (str)
   - Column 'ds': festival date (datetime64)
   - Column 'lower_window': days before (int, default 0)
   - Column 'upper_window': days after (int, based on duration)
   - Optional 'prior_scale': holiday strength (from impact_factor)

8. **Map impact_factor to prior_scale**
   - Low impact (1.0-1.2): prior_scale = 5.0
   - Medium impact (1.2-1.5): prior_scale = 10.0
   - High impact (1.5-2.0): prior_scale = 15.0
   - Very high impact (2.0+): prior_scale = 20.0

9. **Handle multi-day festivals**
   - Use Festival.duration field
   - Set upper_window to duration - 1 days
   - Example: Sinhala New Year (2 days) → upper_window = 1
   - Prophet will model effect across full duration

10. **Add holidays to model**
    - Call model.add_country_holidays() for Sri Lanka if available
    - Add custom holidays DataFrame using model.holidays attribute
    - Combine built-in and custom holidays

11. **Handle missing festival data**
    - If FestivalCalendar returns empty, log warning
    - Continue without holidays (degraded performance)
    - Consider creating default festival set

12. **Add logging**
    - Log number of festivals added
    - Log date range covered
    - Log any warnings or errors

### Holiday DataFrame Format

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| holiday | str | Festival name | "Sinhala New Year" |
| ds | datetime64 | Festival date | 2026-04-14 |
| lower_window | int | Days before peak | 0 |
| upper_window | int | Days after peak | 1 |
| prior_scale | float | Effect strength | 15.0 |

### Festival to Holiday Conversion

```
Festival Model
├── id: 1
├── name: "Sinhala New Year"
├── date: 2026-04-14
├── duration: 2
├── impact_factor: 1.8
└── is_recurring: True

       ↓ Convert ↓

Prophet Holiday
├── holiday: "Sinhala New Year"
├── ds: 2026-04-14
├── lower_window: 0
├── upper_window: 1
└── prior_scale: 15.0
```

### Impact Factor Mapping

| Impact Factor | Description | Prior Scale | Example Festival |
|--------------|-------------|-------------|------------------|
| 1.0 - 1.2 | Low impact | 5.0 | World Environment Day |
| 1.2 - 1.5 | Medium impact | 10.0 | Poson Poya |
| 1.5 - 2.0 | High impact | 15.0 | Sinhala New Year |
| 2.0+ | Very high impact | 20.0 | Vesak (if applicable) |

### Holiday Window Calculation

```
Single-Day Festival (duration = 1)
├── lower_window = 0
├── upper_window = 0
└── Effect on date only

Multi-Day Festival (duration = 3)
├── lower_window = 0
├── upper_window = 2
└── Effect spans 3 days

Pre-Festival Period (shopping spike)
├── lower_window = -3
├── upper_window = 0
└── Captures preparation period
```

### Date Range Determination Flow

```
Training Data Dates
       │
       ▼
Get min_date, max_date
       │
       ▼
holiday_start = min_date - 365 days
holiday_end = max_date + forecast_horizon
       │
       ▼
Query FestivalCalendar.get_festivals(
    start=holiday_start,
    end=holiday_end
)
       │
       ▼
Festival list returned
```

### Handling Recurring Festivals

```
Recurring Festival (is_recurring=True)
├── Generate dates for multiple years
├── 2024, 2025, 2026, 2027...
└── Add all instances to holiday DataFrame

Fixed Festival (is_recurring=False)
├── Use exact date from Festival.date
└── Add single instance
```

### Method Implementation Pattern

```python
def add_holidays(self, model: Prophet) -> None:
    """Add Sri Lankan holidays to Prophet model."""
    
    # 1. Determine date range
    start_date = training_start - timedelta(days=365)
    end_date = training_end + timedelta(days=forecast_horizon)
    
    # 2. Query festivals
    festivals = self.festival_calendar.get_festivals(start_date, end_date)
    
    # 3. Convert to Prophet format
    holidays_df = pd.DataFrame([
        {
            'holiday': f.name,
            'ds': f.date,
            'lower_window': 0,
            'upper_window': f.duration - 1,
            'prior_scale': self._map_impact_to_scale(f.impact_factor)
        }
        for f in festivals
    ])
    
    # 4. Add to model
    model.holidays = holidays_df
```

### Integration with Prophet Training

```
ProphetForecaster.train()
       │
       ▼
Create Prophet model
       │
       ▼
Call add_holidays(model)  ← This task
       │
       ▼
Call add_seasonality(model)  ← Task 54
       │
       ▼
model.fit(df)
```

### Expected Outcome
- add_holidays method implemented in ProphetForecaster
- Queries FestivalCalendar for Sri Lankan festivals
- Converts Festival models to Prophet holiday format
- Properly calculates holiday windows from duration
- Maps impact_factor to prior_scale
- Adds holidays to Prophet model before training
- Handles missing festival data gracefully
- Includes comprehensive logging

### Verification Checklist
- [ ] add_holidays method defined in ProphetForecaster
- [ ] Method accepts Prophet model parameter
- [ ] Return type is None
- [ ] FestivalCalendar queried for festivals
- [ ] Date range calculated (training ± buffer)
- [ ] DataFrame created with required columns (holiday, ds, lower_window, upper_window)
- [ ] impact_factor mapped to prior_scale
- [ ] duration field used for upper_window
- [ ] Holidays added to model.holidays attribute
- [ ] Empty festival list handled gracefully
- [ ] Logging statements added
- [ ] Docstring explains purpose and parameters

---

## Task 54: Create add_seasonality Method

### Overview
Implement the add_seasonality method in ProphetForecaster to configure custom seasonality patterns for demand forecasting. While Prophet includes default weekly and yearly seasonality, this method adds domain-specific patterns like monthly cycles (payday effects), quarterly patterns (financial cycles), and custom Fourier orders optimized for retail demand. Proper seasonality configuration improves forecast accuracy for periodic demand patterns.

### Dependencies
- Task 53: Create add_holidays Method

### Instructions

1. **Open prophet.py file**
   - Locate ProphetForecaster class
   - Add method after add_holidays method

2. **Define add_seasonality method**
   - Method name: `add_seasonality`
   - Accept `model` parameter (Prophet model instance)
   - Return type is None (modifies model in place)

3. **Write method docstring**
   - Describe purpose: add custom seasonality to Prophet
   - Document model parameter
   - Explain seasonality types and Fourier orders
   - Note modification is in-place

4. **Configure monthly seasonality**
   - Name: 'monthly'
   - Period: 30.5 days (average month length)
   - Fourier order: 5 (captures monthly patterns)
   - Mode: inherit from model (multiplicative/additive)
   - Use case: payday effects, month-end patterns

5. **Configure quarterly seasonality**
   - Name: 'quarterly'
   - Period: 91.25 days (average quarter length)
   - Fourier order: 5
   - Mode: inherit from model
   - Use case: financial quarter patterns

6. **Adjust default weekly seasonality**
   - Prophet includes weekly by default
   - Override Fourier order if needed (default is 3)
   - Increase to 5 for more detailed day-of-week patterns
   - Critical for retail: weekends vs weekdays

7. **Adjust default yearly seasonality**
   - Prophet includes yearly by default
   - Override Fourier order if needed (default is 10)
   - Increase to 20 for detailed annual patterns
   - Captures seasonal retail cycles (back-to-school, holiday shopping)

8. **Add seasonality to model**
   - Use model.add_seasonality() method
   - Specify name, period, fourier_order
   - Specify mode if different from model default
   - Only add if not already present (check model.seasonalities)

9. **Handle custom seasonalities from config**
   - Check config['algorithm_params']['custom_seasonalities']
   - Allow user-defined seasonality patterns
   - Validate period and fourier_order values
   - Add each custom seasonality to model

10. **Validate Fourier order ranges**
    - Minimum: 1 (very simple pattern)
    - Maximum: 20 (very complex pattern)
    - Higher order = more flexibility but more parameters
    - Balance fit quality and overfitting risk

11. **Add conditional seasonality (optional)**
    - Prophet supports conditional seasonality (is_active column)
    - Can enable different patterns for different periods
    - Example: different weekly patterns during festival months
    - Implement if config specifies conditions

12. **Add logging**
    - Log each seasonality added
    - Log Fourier orders used
    - Log any custom seasonalities

### Seasonality Configuration Table

| Seasonality | Period (days) | Fourier Order | Purpose |
|-------------|---------------|---------------|---------|
| Weekly | 7 | 3-5 | Day-of-week patterns |
| Monthly | 30.5 | 5 | Payday, month-end effects |
| Quarterly | 91.25 | 5 | Financial quarter cycles |
| Yearly | 365.25 | 10-20 | Annual seasonal patterns |

### Fourier Order Impact

```
Low Order (1-3)
├── Simple, smooth pattern
├── Few parameters
├── May underfit
└── Use for: weak seasonality

Medium Order (5-10)
├── Balanced pattern
├── Moderate parameters
├── Good for most cases
└── Use for: typical retail

High Order (15-20)
├── Complex, flexible pattern
├── Many parameters
├── May overfit
└── Use for: strong, complex seasonality
```

### Monthly Seasonality Pattern

```
Days 1-5: Early month
└── Often lower demand

Days 10-15: Mid-month
└── Payday spike (many Sri Lankan companies)

Days 25-30: End of month
└── Another payday spike
└── Bill payments reduce spending

Pattern captured by Fourier series:
f(t) = Σ[aₙ·cos(2πnt/P) + bₙ·sin(2πnt/P)]
where P = 30.5, n = 1 to fourier_order
```

### Seasonality Addition Flow

```
ProphetForecaster.add_seasonality()
       │
       ▼
┌────────────────────┐
│ Add Monthly        │
│ (30.5 days, F=5)   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Add Quarterly      │
│ (91.25 days, F=5)  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Override Weekly    │
│ (7 days, F=5)      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Override Yearly    │
│ (365.25 days, F=20)│
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Add Custom from    │
│ Config (if any)    │
└─────────┬──────────┘
          │
          ▼
Seasonality configured
```

### Custom Seasonality Configuration

```python
# In config dictionary
'algorithm_params': {
    'custom_seasonalities': [
        {
            'name': 'biweekly',
            'period': 14,
            'fourier_order': 3,
            'mode': 'additive'
        },
        {
            'name': 'semester',
            'period': 182.5,
            'fourier_order': 10,
            'mode': 'multiplicative'
        }
    ]
}
```

### Seasonality Mode Decision

| Data Pattern | Mode | Reason |
|--------------|------|--------|
| Constant amplitude | Additive | Seasonal effect fixed |
| Growing amplitude | Multiplicative | Scales with trend |
| Retail demand | Multiplicative | Seasonality grows with volume |

### Method Implementation Pattern

```python
def add_seasonality(self, model: Prophet) -> None:
    """Add custom seasonality patterns to Prophet model."""
    
    # Monthly seasonality (payday effects)
    model.add_seasonality(
        name='monthly',
        period=30.5,
        fourier_order=5,
        mode=self.seasonality_mode
    )
    
    # Quarterly seasonality
    model.add_seasonality(
        name='quarterly',
        period=91.25,
        fourier_order=5,
        mode=self.seasonality_mode
    )
    
    # Override weekly for more detail
    if 'weekly' in model.seasonalities:
        model.seasonalities['weekly']['fourier_order'] = 5
        
    # Override yearly for more detail
    if 'yearly' in model.seasonalities:
        model.seasonalities['yearly']['fourier_order'] = 20
```

### Conditional Seasonality Example

```python
# Different weekly patterns during festival months
df['is_festival_month'] = df['ds'].dt.month.isin([4, 12])

model.add_seasonality(
    name='weekly_festival',
    period=7,
    fourier_order=5,
    condition_name='is_festival_month'
)

model.add_seasonality(
    name='weekly_normal',
    period=7,
    fourier_order=3,
    condition_name='is_not_festival_month'
)
```

### Retail-Specific Seasonality Patterns

| Pattern | Period | Description |
|---------|--------|-------------|
| Weekly | 7 days | Weekend shopping spikes |
| Bi-weekly | 14 days | Payroll cycles |
| Monthly | 30.5 days | Monthly payday |
| Quarterly | 91.25 days | Financial quarter effects |
| Yearly | 365.25 days | Holiday seasons, weather |

### Expected Outcome
- add_seasonality method implemented in ProphetForecaster
- Monthly seasonality added (30.5 day period)
- Quarterly seasonality added (91.25 day period)
- Default weekly and yearly seasonality adjusted
- Custom seasonalities from config supported
- Fourier orders validated and optimized
- Seasonality mode configured correctly
- Comprehensive logging included

### Verification Checklist
- [ ] add_seasonality method defined in ProphetForecaster
- [ ] Method accepts Prophet model parameter
- [ ] Return type is None
- [ ] Monthly seasonality added (period=30.5, fourier_order=5)
- [ ] Quarterly seasonality added (period=91.25, fourier_order=5)
- [ ] Weekly seasonality Fourier order adjusted
- [ ] Yearly seasonality Fourier order adjusted
- [ ] Custom seasonalities from config handled
- [ ] Fourier order range validation implemented
- [ ] Seasonality mode properly set
- [ ] Logging statements added
- [ ] Docstring explains purpose and parameters

---

## Task 55: Create Prophet train Method

### Overview
Implement the train method in ProphetForecaster to train the Facebook Prophet model on historical demand data. This method orchestrates the complete training pipeline: data validation, Prophet model initialization with configured parameters, holiday and seasonality addition, model fitting, and result storage. The trained model captures trend, seasonality, and holiday effects for accurate demand forecasting.

### Dependencies
- Task 54: Create add_seasonality Method (all helper methods complete)

### Instructions

1. **Open prophet.py file**
   - Locate ProphetForecaster class
   - Add train method (overrides abstract method from Task 50)

2. **Define train method signature**
   - Override abstract train method from ForecastTrainer
   - Accept `df` parameter (pandas DataFrame)
   - Accept `**kwargs` for additional options
   - Return type is Prophet model

3. **Write comprehensive method docstring**
   - Describe training process
   - Document df parameter requirements
   - Document return value
   - List possible exceptions

4. **Validate input DataFrame**
   - Call self.validate_data(df) from base class
   - Check for required columns: 'ds' and 'y'
   - Verify minimum data requirements (14+ days)
   - Check for missing values and handle appropriately
   - Ensure dates are sorted chronologically

5. **Prepare DataFrame for Prophet**
   - Prophet requires exact column names: 'ds' and 'y'
   - Convert 'ds' to datetime64 if not already
   - Ensure 'y' is float64 (demand quantity)
   - Remove any rows with NaN in 'ds' or 'y'
   - Reset index to default integer index

6. **Handle logistic growth setup**
   - If self.growth == 'logistic', add 'cap' column
   - Calculate cap as max(y) * 1.2 (20% headroom)
   - Optionally add 'floor' column (minimum forecast value)
   - floor typically set to 0 for demand (can't be negative)

7. **Initialize Prophet model**
   - Create Prophet instance with configuration parameters
   - Pass growth, changepoint_prior_scale, seasonality_prior_scale
   - Pass holidays_prior_scale, seasonality_mode, interval_width
   - Pass daily_seasonality, weekly_seasonality, yearly_seasonality

8. **Add holidays to model**
   - Call self.add_holidays(model) from Task 53
   - Holidays will be integrated before fitting

9. **Add seasonality to model**
   - Call self.add_seasonality(model) from Task 54
   - Custom seasonality patterns configured

10. **Fit model to data**
    - Call model.fit(df)
    - Prophet performs optimization (may take 10-60 seconds)
    - Catch and log any fitting errors

11. **Store trained model**
    - Assign fitted model to self.model
    - Store training data to self.training_data for reference
    - Store training date range for validation

12. **Extract and log training metrics**
    - Calculate in-sample MAE (mean absolute error)
    - Calculate in-sample MAPE (mean absolute percentage error)
    - Log training completion and metrics

13. **Handle training errors**
    - Catch Prophet-specific errors (convergence issues)
    - Catch data quality errors (insufficient variation)
    - Log detailed error messages
    - Re-raise as RuntimeError with context

14. **Return trained model**
    - Return self.model for method chaining
    - Model is also stored in instance for predict method

### Training Process Flow

```
Input DataFrame
       │
       ▼
┌─────────────────┐
│ Validate Data   │
│ (columns, rows) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prepare for     │
│ Prophet format  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add cap/floor   │
│ (if logistic)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Initialize      │
│ Prophet model   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add Holidays    │
│ (Task 53)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add Seasonality │
│ (Task 54)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ model.fit(df)   │
│ (Optimize)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store model     │
│ & metadata      │
└────────┬────────┘
         │
         ▼
Return Prophet model
```

### Data Validation Checks

| Check | Requirement | Error Response |
|-------|-------------|----------------|
| Columns | 'ds' and 'y' present | Raise ValueError |
| Row count | ≥ 14 days | Raise ValueError |
| Missing values | < 20% in 'y' | Interpolate or raise |
| Date ordering | Chronological | Sort or raise |
| Data types | ds=datetime, y=float | Convert or raise |
| Duplicates | No duplicate dates | Aggregate or raise |

### Prophet Initialization Parameters

```python
model = Prophet(
    growth=self.growth,
    changepoint_prior_scale=self.changepoint_prior_scale,
    seasonality_prior_scale=self.seasonality_prior_scale,
    holidays_prior_scale=self.holidays_prior_scale,
    seasonality_mode=self.seasonality_mode,
    interval_width=self.interval_width,
    daily_seasonality=False,
    weekly_seasonality=True,
    yearly_seasonality=True,
    # mcmc_samples=0 for faster fitting (default)
)
```

### Logistic Growth Configuration

```
Linear Growth (default)
└── No additional columns needed

Logistic Growth
├── Requires 'cap' column
├── cap = max(y) * 1.2
├── Optional 'floor' column
└── floor = 0 (demand can't be negative)

Example DataFrame with cap:
       ds          y     cap
0   2025-01-01    50     100
1   2025-01-02    55     100
2   2025-01-03    48     100
```

### Training Metrics Calculation

```python
# After fitting
predictions = model.predict(df)
actual = df['y']
predicted = predictions['yhat']

mae = np.mean(np.abs(actual - predicted))
mape = np.mean(np.abs((actual - predicted) / actual)) * 100

logger.info(f"Training complete: MAE={mae:.2f}, MAPE={mape:.2f}%")
```

### Error Handling

| Error Type | Cause | Handling |
|------------|-------|----------|
| ValueError | Invalid data format | Log and re-raise |
| RuntimeError | Fitting failure | Log with context, re-raise |
| ConvergenceWarning | Optimization issues | Log warning, continue |
| KeyError | Missing columns | Log and raise ValueError |

### Method Implementation Pattern

```python
def train(self, df: pd.DataFrame, **kwargs) -> Prophet:
    """Train Prophet model on historical demand data."""
    
    # 1. Validate data
    self.validate_data(df)
    
    # 2. Prepare dataframe
    df = df[['ds', 'y']].copy()
    df['ds'] = pd.to_datetime(df['ds'])
    df['y'] = df['y'].astype(float)
    df = df.dropna().sort_values('ds').reset_index(drop=True)
    
    # 3. Add cap for logistic growth
    if self.growth == 'logistic':
        df['cap'] = df['y'].max() * 1.2
        df['floor'] = 0
    
    # 4. Initialize Prophet
    model = Prophet(
        growth=self.growth,
        changepoint_prior_scale=self.changepoint_prior_scale,
        # ... other parameters
    )
    
    # 5. Add holidays and seasonality
    self.add_holidays(model)
    self.add_seasonality(model)
    
    # 6. Fit model
    model.fit(df)
    
    # 7. Store and return
    self.model = model
    self.training_data = df
    return self.model
```

### Training Time Expectations

| Data Size | Training Time | Notes |
|-----------|---------------|-------|
| 30 days | 5-10 seconds | Fast |
| 90 days | 10-20 seconds | Typical |
| 180 days | 15-30 seconds | Good |
| 365 days | 20-60 seconds | Comprehensive |
| 730+ days | 30-90 seconds | May be slow |

### Expected Outcome
- train method implemented in ProphetForecaster
- Validates input DataFrame format and quality
- Prepares data in Prophet format ('ds' and 'y')
- Initializes Prophet with configuration parameters
- Adds holidays via add_holidays method
- Adds seasonality via add_seasonality method
- Fits model to historical data
- Stores trained model in self.model
- Calculates and logs training metrics
- Returns trained Prophet model
- Handles errors gracefully with logging

### Verification Checklist
- [ ] train method defined in ProphetForecaster
- [ ] Method overrides abstract train from ForecastTrainer
- [ ] Accepts df: DataFrame parameter
- [ ] Return type is Prophet
- [ ] Data validation performed
- [ ] DataFrame prepared in Prophet format
- [ ] Logistic growth cap/floor added if needed
- [ ] Prophet model initialized with config parameters
- [ ] add_holidays method called
- [ ] add_seasonality method called
- [ ] model.fit(df) executed
- [ ] Trained model stored in self.model
- [ ] Training data stored in self.training_data
- [ ] Training metrics calculated and logged
- [ ] Error handling implemented
- [ ] Docstring complete with parameters and return value

---

## Task 56: Create Prophet predict Method

### Overview
Implement the predict method in ProphetForecaster to generate forecasts using the trained Prophet model. This method creates a future date range, applies the trained model to generate predictions with confidence intervals, and formats the output in the standardized DataFrame format. The method returns point forecasts (yhat), lower confidence bounds (yhat_lower), and upper confidence bounds (yhat_upper) for the specified forecast horizon.

### Dependencies
- Task 55: Create Prophet train Method (Prophet fully functional)

### Instructions

1. **Open prophet.py file**
   - Locate ProphetForecaster class
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
   - Optionally warn if periods > 90 (long-term forecast)

6. **Create future dataframe**
   - Use model.make_future_dataframe() method
   - Specify periods parameter
   - Specify freq='D' for daily frequency
   - include_history determines if past dates included

7. **Handle logistic growth**
   - If self.growth == 'logistic', add 'cap' and 'floor' to future
   - Use same cap value as training (or from config)
   - Set floor to 0 for demand forecasts

8. **Generate predictions**
   - Call model.predict(future) to get forecast DataFrame
   - Prophet returns comprehensive DataFrame with many columns
   - Extract relevant columns: ds, yhat, yhat_lower, yhat_upper

9. **Filter to future periods only**
   - If include_history is False (default)
   - Filter predictions to dates > max(training_data['ds'])
   - Keep only the forecast period

10. **Format output DataFrame**
    - Ensure column names match base class specification
    - ds: datetime64 (date column)
    - yhat: float64 (point forecast)
    - yhat_lower: float64 (lower confidence bound)
    - yhat_upper: float64 (upper confidence bound)
    - Optionally include Prophet components (trend, seasonal)

11. **Apply business logic constraints**
    - Ensure yhat >= 0 (demand can't be negative)
    - Apply floor constraint if specified
    - Apply cap constraint if specified
    - Adjust confidence intervals accordingly

12. **Add metadata to DataFrame (optional)**
    - Add 'forecast_date' column (when forecast was made)
    - Add 'algorithm' column ('prophet')
    - Add 'product_id' from config
    - Useful for tracking and comparison

13. **Handle edge cases**
    - Empty training data → RuntimeError
    - periods = 0 → return empty DataFrame or raise
    - Model convergence issues → log warning
    - Extreme values in forecast → log warning

14. **Return formatted DataFrame**
    - Return standardized output format
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
│ Create future dates  │
│ make_future_dataframe│
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Add cap/floor        │
│ (if logistic growth) │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ model.predict(future)│
│ (Generate forecast)  │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Extract columns      │
│ (ds, yhat, CI)       │
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Filter future only   │
│ (if not include_hist)│
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│ Apply constraints    │
│ (floor, cap, >=0)    │
└───────────┬──────────┘
            │
            ▼
Return DataFrame
```

### Prophet Prediction Output Columns

| Column | Description | Required in Output |
|--------|-------------|-------------------|
| ds | Forecast date | Yes |
| yhat | Point forecast | Yes |
| yhat_lower | Lower bound (2.5%) | Yes |
| yhat_upper | Upper bound (97.5%) | Yes |
| trend | Trend component | Optional |
| trend_lower | Trend lower bound | Optional |
| trend_upper | Trend upper bound | Optional |
| seasonal | Combined seasonal effect | Optional |
| seasonal_lower | Seasonal lower bound | Optional |
| seasonal_upper | Seasonal upper bound | Optional |
| weekly | Weekly seasonality | Optional |
| yearly | Yearly seasonality | Optional |
| holidays | Holiday effect | Optional |

### Output DataFrame Format

```
       ds          yhat   yhat_lower   yhat_upper
0   2026-02-01    52.3      48.1        56.5
1   2026-02-02    54.7      50.2        59.2
2   2026-02-03    51.2      46.8        55.6
3   2026-02-04    53.8      49.3        58.3
...
```

### Include History Behavior

```
include_history = False (default)
└── Return only future periods
    └── Dates > last training date

include_history = True
├── Training period: fitted values
├── Future period: forecasted values
└── Full time series from training start to forecast end

Use Cases:
- False: For production forecasts
- True: For visualization and validation
```

### Future Dataframe Creation

```python
# Without history (default)
future = model.make_future_dataframe(
    periods=30,
    freq='D',
    include_history=False
)

# With history
future = model.make_future_dataframe(
    periods=30,
    freq='D',
    include_history=True
)
```

### Constraint Application

```python
# Ensure non-negative demand
forecast['yhat'] = forecast['yhat'].clip(lower=0)
forecast['yhat_lower'] = forecast['yhat_lower'].clip(lower=0)
forecast['yhat_upper'] = forecast['yhat_upper'].clip(lower=0)

# Apply cap if logistic growth
if self.growth == 'logistic':
    forecast['yhat'] = forecast['yhat'].clip(upper=self.cap)
    forecast['yhat_upper'] = forecast['yhat_upper'].clip(upper=self.cap)
```

### Method Implementation Pattern

```python
def predict(
    self, 
    periods: int, 
    include_history: bool = False,
    **kwargs
) -> pd.DataFrame:
    """Generate demand forecasts for future periods."""
    
    # 1. Validate model is trained
    if self.model is None:
        raise RuntimeError("Model must be trained before prediction")
    
    # 2. Validate periods
    if periods <= 0:
        raise ValueError("periods must be positive integer")
    
    # 3. Create future dataframe
    future = self.model.make_future_dataframe(
        periods=periods,
        freq='D',
        include_history=include_history
    )
    
    # 4. Add cap/floor for logistic
    if self.growth == 'logistic':
        future['cap'] = self.training_data['cap'].iloc[0]
        future['floor'] = 0
    
    # 5. Generate predictions
    forecast = self.model.predict(future)
    
    # 6. Filter to future only
    if not include_history:
        last_date = self.training_data['ds'].max()
        forecast = forecast[forecast['ds'] > last_date]
    
    # 7. Extract and format
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].copy()
    
    # 8. Apply constraints
    result['yhat'] = result['yhat'].clip(lower=0)
    result['yhat_lower'] = result['yhat_lower'].clip(lower=0)
    result['yhat_upper'] = result['yhat_upper'].clip(lower=0)
    
    # 9. Return
    return result.reset_index(drop=True)
```

### Confidence Interval Interpretation

```
95% Confidence Interval
├── yhat_lower (2.5th percentile)
├── yhat (50th percentile, median)
└── yhat_upper (97.5th percentile)

Interpretation:
- 95% probability true value falls within interval
- Wider intervals = more uncertainty
- Intervals widen further into future
```

### Forecast Horizon Recommendations

| Periods | Use Case | Reliability |
|---------|----------|-------------|
| 1-7 | Daily operations | Very High |
| 8-14 | Weekly planning | High |
| 15-30 | Monthly planning | Medium-High |
| 31-60 | Bi-monthly planning | Medium |
| 61-90 | Quarterly planning | Medium-Low |
| 90+ | Strategic planning | Low |

### Expected Outcome
- predict method implemented in ProphetForecaster
- Validates model is trained before prediction
- Validates periods parameter
- Creates future dataframe with appropriate date range
- Generates predictions using model.predict()
- Extracts required columns (ds, yhat, yhat_lower, yhat_upper)
- Filters to future periods if include_history=False
- Applies business logic constraints (non-negative demand)
- Returns standardized DataFrame format
- Handles edge cases and errors gracefully

### Verification Checklist
- [ ] predict method defined in ProphetForecaster
- [ ] Method overrides abstract predict from ForecastTrainer
- [ ] Accepts periods: int parameter
- [ ] Accepts include_history: bool parameter
- [ ] Return type is DataFrame
- [ ] Model trained validation performed
- [ ] periods > 0 validation performed
- [ ] Future dataframe created with make_future_dataframe
- [ ] Logistic growth cap/floor added if needed
- [ ] model.predict() called to generate forecast
- [ ] Output filtered to future periods (if not include_history)
- [ ] Required columns extracted (ds, yhat, yhat_lower, yhat_upper)
- [ ] Non-negative constraint applied
- [ ] DataFrame formatted and returned
- [ ] Error handling implemented
- [ ] Docstring complete with parameters and return value

---

## Summary

This document established the abstract forecaster base class and complete Facebook Prophet implementation for demand forecasting. The ForecastTrainer ABC defines a consistent interface for all forecasting algorithms, while ProphetForecaster leverages Prophet's capabilities with custom configuration for Sri Lankan holidays and seasonality patterns, enabling accurate retail demand predictions.

### Completed Tasks
1. ✓ Created ForecastTrainer ABC with class structure
2. ✓ Defined train abstract method contract
3. ✓ Defined predict abstract method contract
4. ✓ Created ProphetForecaster class with configuration
5. ✓ Implemented add_holidays method for Sri Lankan festivals
6. ✓ Implemented add_seasonality method for custom patterns
7. ✓ Implemented Prophet train method with full pipeline
8. ✓ Implemented Prophet predict method with forecasts

### Key Achievements
- **Abstract Base Class Pattern**: Consistent interface for all forecasters
- **Prophet Integration**: Full Facebook Prophet library integration
- **Holiday Support**: Sri Lankan festival calendar integration
- **Seasonality Configuration**: Monthly, quarterly, weekly, yearly patterns
- **Complete Training Pipeline**: Data validation, fitting, metrics
- **Forecast Generation**: Standardized prediction output with confidence intervals

### Next Steps
Proceed to [02_Tasks-57-66_ARIMA-Selector-Task.md](02_Tasks-57-66_ARIMA-Selector-Task.md) to implement ARIMA forecaster with auto-parameter selection, model selector for algorithm comparison, and Celery task for automated weekly training.

