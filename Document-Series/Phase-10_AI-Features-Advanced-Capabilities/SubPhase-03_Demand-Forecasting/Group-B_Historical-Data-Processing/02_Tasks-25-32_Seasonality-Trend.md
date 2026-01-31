# Tasks 25-32: Seasonality Detection and Trend Analysis

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** B - Historical Data Processing  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_Extractor-Cleaner.md](01_Tasks-17-24_Extractor-Cleaner.md)
- **→ Next Group:** [Group-C_Festival-Calendar](../Group-C_Festival-Calendar/)

---

## Document Overview

This document covers the creation of seasonality detection and trend analysis infrastructure for demand forecasting. It establishes the SeasonalityDetector class for identifying periodic patterns at weekly, monthly, and yearly levels, and the TrendAnalyzer class for extracting long-term trends and determining trend direction essential for accurate forecasting models.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Create SeasonalityDetector | High | 60 min |
| 26 | Create detect_weekly | Medium | 45 min |
| 27 | Create detect_monthly | Medium | 45 min |
| 28 | Create detect_yearly | Medium | 50 min |
| 29 | Create TrendAnalyzer | Medium | 45 min |
| 30 | Create calculate_trend | Medium | 40 min |
| 31 | Create trend_direction | Low | 25 min |
| 32 | Verify Data Processing | Low | 30 min |

---

## Task 25: Create SeasonalityDetector

### Overview
Create the SeasonalityDetector class that provides comprehensive seasonality detection and analysis for sales time series data. This class implements multiple algorithms including STL decomposition, Fast Fourier Transform (FFT), and autocorrelation analysis to identify periodic patterns at various time scales (weekly, monthly, yearly), enabling forecasting models to account for recurring seasonal effects.

### Dependencies
- Task 24: Create smooth_data

### Instructions

1. **Create seasonality module file**
   - Create `seasonality.py` in `forecasting/data/` directory
   - Import required dependencies (pandas, numpy, scipy, statsmodels)
   - Import statistical and signal processing libraries
   - Add comprehensive module docstring

2. **Define SeasonalityDetector class**
   - Create main class with initialization
   - Accept configuration parameters for detection
   - Store seasonality components
   - Document detection algorithms used

3. **Initialize detection parameters**
   - Set default detection thresholds
   - Configure FFT parameters
   - Set autocorrelation lags
   - Define minimum data requirements

4. **Implement STL decomposition setup**
   - Import statsmodels seasonal_decompose
   - Configure decomposition parameters
   - Set period for different seasonalities
   - Handle detrending and normalization

5. **Create FFT analysis infrastructure**
   - Implement Fast Fourier Transform
   - Calculate power spectral density
   - Identify dominant frequencies
   - Convert frequencies to periods

6. **Implement autocorrelation analysis**
   - Calculate autocorrelation function (ACF)
   - Identify significant lags
   - Detect periodic patterns
   - Set significance thresholds

7. **Add data validation methods**
   - Verify sufficient data length for each seasonality
   - Check for missing values
   - Validate data frequency consistency
   - Ensure stationarity if required

8. **Create pattern strength metrics**
   - Calculate seasonality strength score (0-1)
   - Measure pattern consistency
   - Compute coefficient of variation
   - Assess predictability

9. **Implement visualization data generation**
   - Prepare seasonal component plots
   - Generate frequency spectrum data
   - Create autocorrelation plot data
   - Format for frontend visualization

10. **Add comprehensive reporting**
    - Generate seasonality detection report
    - Include all detected patterns
    - Provide confidence scores
    - Add recommendations for forecasting

### SeasonalityDetector Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__(config)` | Initialize with detection parameters |
| `validate_data(df, min_periods)` | Verify data sufficiency |
| `decompose(df, period)` | STL decomposition |
| `_fft_analysis(data)` | FFT-based frequency detection |
| `_acf_analysis(data, lags)` | Autocorrelation analysis |
| `calculate_strength(seasonal_component)` | Seasonality strength metric |
| `generate_report()` | Comprehensive detection report |

### Detection Methods Comparison

| Method | Strength | Limitation | Best For |
|--------|----------|------------|----------|
| STL Decomposition | Robust, interpretable | Requires regular data | General use |
| FFT | Detects multiple periods | Sensitive to noise | Clear patterns |
| Autocorrelation | Simple, visual | Less precise | Initial exploration |
| X-13 ARIMA | Industry standard | Complex setup | Official statistics |

### Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| min_periods_weekly | int | 14 | Min days for weekly detection |
| min_periods_monthly | int | 60 | Min days for monthly detection |
| min_periods_yearly | int | 365 | Min days for yearly detection |
| significance_level | float | 0.05 | Statistical significance |
| strength_threshold | float | 0.3 | Min strength to consider seasonal |
| fft_threshold | float | 0.1 | FFT peak detection threshold |

### Data Requirements

| Seasonality | Min Period | Recommended | Reason |
|-------------|-----------|-------------|---------|
| Weekly | 14 days | 90 days | 2+ cycles for pattern |
| Monthly | 60 days | 365 days | 2+ cycles needed |
| Yearly | 365 days | 730 days | 2+ years for reliability |

### STL Decomposition Overview

```
STL (Seasonal and Trend decomposition using Loess)

Original Time Series = Trend + Seasonal + Residual

Components:
├── Trend: Long-term movement
├── Seasonal: Repeating patterns
└── Residual: Random noise

Parameters:
├── period: Seasonality period (7 for weekly, 30 for monthly)
├── seasonal: Window for seasonal smoother
├── trend: Window for trend smoother
└── robust: Outlier handling
```

### STL Decomposition Example

```
Daily Sales Data (30 days):

Original:
[12, 15, 10, 18, 14, 20, 8, 13, 16, 11, 19, 15, 21, 9, ...]

After STL (period=7):

Trend:
[14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, ...]
└── Slowly increasing baseline

Seasonal (Weekly Pattern):
[-2, +1, -4, +4, 0, +6, -5, -2, +1, -4, +4, 0, +6, -5, ...]
└── Repeats every 7 days

Residual (Random):
[-0.2, -0.3, +0.4, -0.5, -0.6, -0.7, +0.2, ...]
└── Unexplained variation
```

### FFT Analysis Process

```
Fast Fourier Transform Analysis:

Step 1: Prepare Data
├── Remove trend
├── Normalize
└── Apply window function

Step 2: Compute FFT
├── Transform to frequency domain
└── Calculate power spectrum

Step 3: Identify Peaks
├── Find dominant frequencies
├── Filter by threshold
└── Convert to periods

Example Output:
Frequency  Period   Power    Interpretation
0.143      7 days   0.82     Strong weekly pattern
0.033      30 days  0.45     Moderate monthly pattern
0.0027     365 days 0.38     Yearly seasonality
```

### Autocorrelation Analysis

```
Autocorrelation Function (ACF):

Measures correlation between time series and its lagged values

ACF Plot:
Lag  ACF Value  Significant?
0    1.000      -
1    0.523      Yes
2    0.312      Yes
3    0.089      No
...
7    0.745      Yes  ← Strong weekly pattern
14   0.698      Yes  ← Confirms weekly
21   0.712      Yes  ← Weekly continues
...
30   0.423      Yes  ← Monthly pattern
```

| Lag | Period | Threshold | Interpretation |
|-----|--------|-----------|----------------|
| 7 | Weekly | ACF > 0.4 | Daily to weekly |
| 30 | Monthly | ACF > 0.3 | Daily to monthly |
| 365 | Yearly | ACF > 0.2 | Daily to yearly |

### Seasonality Strength Calculation

```
Seasonality Strength Formula:

Strength = 1 - (Var(Residual) / Var(Detrended Data))

Where:
├── Var(Residual): Variance of random component
└── Var(Detrended): Variance after removing trend

Example:
Original Data Variance: 100
Trend Removed Variance: 85
After Removing Seasonal: 20

Strength = 1 - (20 / 85) = 1 - 0.235 = 0.765 (76.5%)
```

| Strength Score | Interpretation | Action |
|----------------|----------------|--------|
| 0.0 - 0.3 | Weak/None | Don't use seasonal model |
| 0.3 - 0.6 | Moderate | Include seasonality |
| 0.6 - 0.8 | Strong | Seasonality important |
| 0.8 - 1.0 | Very Strong | Dominates pattern |

### Multi-Period Seasonality

```
Hierarchical Seasonality Structure:

Daily Sales
├── Weekly Seasonality (Period=7)
│   ├── Monday: Low (-15%)
│   ├── Tuesday: Low (-10%)
│   ├── Wednesday: Average (0%)
│   ├── Thursday: Average (+5%)
│   ├── Friday: High (+20%)
│   ├── Saturday: Very High (+35%)
│   └── Sunday: Low (-20%)
│
├── Monthly Seasonality (Period=30)
│   ├── Early Month: High (+15%)
│   ├── Mid Month: Average (0%)
│   └── End Month: Low (-10%)
│
└── Yearly Seasonality (Period=365)
    ├── Q1: Low (-5%)
    ├── Q2 (April): Peak (+25%, Sinhala NY)
    ├── Q3: Average (0%)
    └── Q4 (December): High (+20%, Christmas)
```

### Seasonality Detection Report Structure

```
{
    "detection_date": "2026-01-31T10:30:00",
    "data_range": {
        "start": "2024-01-01",
        "end": "2026-01-31",
        "total_days": 761
    },
    "seasonalities_detected": {
        "weekly": {
            "detected": true,
            "period": 7,
            "strength": 0.68,
            "confidence": 0.92,
            "method": "stl+fft",
            "pattern_description": "Strong weekend peaks"
        },
        "monthly": {
            "detected": true,
            "period": 30,
            "strength": 0.42,
            "confidence": 0.78,
            "method": "stl",
            "pattern_description": "Early month increase"
        },
        "yearly": {
            "detected": true,
            "period": 365,
            "strength": 0.55,
            "confidence": 0.85,
            "method": "stl+acf",
            "pattern_description": "April & December peaks"
        }
    },
    "dominant_patterns": [
        {
            "type": "weekly",
            "strength": 0.68,
            "explanation": "Strong Saturday sales (+35% above average)"
        },
        {
            "type": "yearly",
            "strength": 0.55,
            "explanation": "Festival-driven spikes in April & December"
        }
    ],
    "recommendations": [
        "Include weekly seasonality in forecast model",
        "Account for yearly patterns with festival calendar",
        "Monthly patterns moderate, may include for long-term forecasts"
    ]
}
```

### Validation Checks

| Check | Requirement | Fallback |
|-------|-------------|----------|
| Data Length | >= min_periods | Skip detection |
| Missing Data | < 20% missing | Impute first |
| Frequency | Consistent intervals | Resample data |
| Variance | σ > 0 | No seasonality possible |

### Expected Outcome
- Functional SeasonalityDetector class with multiple algorithms
- STL decomposition for robust pattern extraction
- FFT analysis for frequency-domain detection
- Autocorrelation for lag-based pattern identification
- Seasonality strength metrics with interpretation
- Multi-level seasonality support (weekly, monthly, yearly)
- Comprehensive detection report with recommendations
- Data validation ensuring reliable detection

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/data/seasonality.py` created
- [ ] SeasonalityDetector class defined with configuration
- [ ] STL decomposition implemented with statsmodels
- [ ] FFT analysis calculates power spectrum
- [ ] Autocorrelation analysis identifies lags
- [ ] Seasonality strength calculation working
- [ ] Data validation checks implemented
- [ ] Multi-period detection supported
- [ ] Detection report generation functional
- [ ] Unit tests cover various seasonality patterns

---

## Task 26: Create detect_weekly

### Overview
Implement the detect_weekly method in SeasonalityDetector to identify and quantify weekly patterns in sales data. This method analyzes day-of-week effects, calculates weekly seasonality factors for each day (Monday-Sunday), and provides statistical confidence measures for the detected patterns, enabling forecasting models to accurately predict daily variations within the week.

### Dependencies
- Task 25: Create SeasonalityDetector

### Instructions

1. **Define method signature**
   - Create method in SeasonalityDetector class
   - Parameters: df (DataFrame), confidence_level
   - Return type: Dictionary with weekly pattern
   - Add comprehensive docstring

2. **Validate data sufficiency**
   - Check minimum 14 days of data (2 weeks)
   - Recommend 90+ days for reliability
   - Verify data frequency is daily
   - Handle insufficient data gracefully

3. **Extract day-of-week information**
   - Add day_of_week column (0=Monday, 6=Sunday)
   - Add day_name column (Monday, Tuesday, etc.)
   - Ensure proper timezone handling
   - Sort by date chronologically

4. **Calculate daily averages**
   - Group by day_of_week
   - Calculate mean sales for each day
   - Calculate median (robust to outliers)
   - Count observations per day

5. **Compute seasonality factors**
   - Calculate weekly average (baseline)
   - Compute factor for each day: day_mean / weekly_mean
   - Express as percentage deviation
   - Normalize factors

6. **Perform statistical testing**
   - Run ANOVA test for day-of-week effect
   - Calculate p-value for significance
   - Perform pairwise comparisons (Tukey HSD)
   - Assess practical significance

7. **Calculate pattern strength**
   - Use coefficient of variation of daily means
   - Compare to baseline variability
   - Calculate R² for day-of-week model
   - Generate strength score (0-1)

8. **Identify peak and low days**
   - Find day with highest average sales
   - Find day with lowest average sales
   - Calculate difference magnitude
   - Provide business interpretation

9. **Add confidence intervals**
   - Calculate 95% confidence intervals per day
   - Use bootstrapping if necessary
   - Provide margin of error
   - Flag low-confidence days

10. **Generate weekly pattern report**
    - Create structured output with all metrics
    - Include visual-ready data
    - Add recommendations
    - Format for forecasting integration

### Method Signature

```
def detect_weekly(
    self,
    df: pd.DataFrame,
    confidence_level: float = 0.95,
    min_observations: int = 2
) -> Dict[str, Any]
```

### Weekly Pattern Analysis Flow

```
Input: Daily Sales Data

Step 1: Data Preparation
├── Add day_of_week column
├── Add day_name column
└── Validate sufficient data

Step 2: Calculate Statistics
├── Group by day_of_week
├── Mean per day
├── Median per day
└── Count per day

Step 3: Compute Factors
├── Weekly average = 120 units
├── Monday avg = 100 units → Factor = 0.833 (-16.7%)
├── Tuesday avg = 105 units → Factor = 0.875 (-12.5%)
├── ...
└── Saturday avg = 165 units → Factor = 1.375 (+37.5%)

Step 4: Statistical Testing
├── ANOVA test → p < 0.001 (significant)
├── Strength score → 0.68 (strong)
└── Confidence → High

Step 5: Generate Report
└── Return structured pattern dictionary
```

### Day-of-Week Extraction

```
DataFrame with dates:

date        quantity  → Add columns →  day_of_week  day_name
2026-01-01  15                         3            Thursday
2026-01-02  18                         4            Friday
2026-01-03  25                         5            Saturday
2026-01-04  12                         6            Sunday
2026-01-05  10                         0            Monday

Day Numbering:
0 = Monday
1 = Tuesday
2 = Wednesday
3 = Thursday
4 = Friday
5 = Saturday
6 = Sunday
```

### Weekly Seasonality Factors

```
Example Weekly Pattern Analysis:

Day        Observations  Mean   Median  Weekly Avg  Factor   % Change
Monday     12            100    98      120         0.833    -16.7%
Tuesday    12            105    103     120         0.875    -12.5%
Wednesday  12            115    112     120         0.958    -4.2%
Thursday   12            122    120     120         1.017    +1.7%
Friday     12            140    138     120         1.167    +16.7%
Saturday   12            165    162     120         1.375    +37.5%
Sunday     12            93     90      120         0.775    -22.5%

Total Weekly Mean: 120 units
Peak Day: Saturday (165, +37.5%)
Low Day: Sunday (93, -22.5%)
Range: 72 units
```

### Seasonality Factor Calculation

```
Formula:
Factor_day = Mean_day / Mean_week

Example for Saturday:
├── Saturday Mean: 165 units
├── Weekly Mean: 120 units
└── Factor: 165 / 120 = 1.375

Interpretation:
├── Factor > 1.0: Above average
├── Factor = 1.0: Average
└── Factor < 1.0: Below average

Percentage Deviation:
(1.375 - 1.0) × 100 = +37.5% above average
```

### Statistical Significance Testing

```
ANOVA (Analysis of Variance) Test:

Null Hypothesis: All days have same mean sales
Alternative: At least one day differs

Test Statistic:
F = (Between-Group Variance) / (Within-Group Variance)

Example Result:
├── F-statistic: 15.42
├── p-value: 0.0001
├── Significance: Yes (p < 0.05)
└── Conclusion: Day-of-week effect exists
```

| p-value | Interpretation | Action |
|---------|----------------|--------|
| < 0.01 | Highly significant | Strong weekly pattern |
| 0.01-0.05 | Significant | Include in model |
| 0.05-0.10 | Marginally significant | Consider including |
| > 0.10 | Not significant | Weak pattern, may skip |

### Pattern Strength Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| Coefficient of Variation | σ_days / μ_week | Higher = stronger pattern |
| Range | (max - min) / μ_week | Relative difference |
| R² | Explained variance | Model fit quality |

```
Strength Score Calculation:

Components:
├── CV of daily means: 0.25
├── Normalized range: 0.60
└── ANOVA R²: 0.58

Strength = 0.4×CV + 0.3×Range + 0.3×R²
         = 0.4×0.25 + 0.3×0.60 + 0.3×0.58
         = 0.1 + 0.18 + 0.174
         = 0.454 (Moderate strength)
```

### Confidence Intervals

```
95% Confidence Intervals per Day:

Day       Mean   CI Lower  CI Upper  Margin
Monday    100    95        105       ±5
Tuesday   105    101       109       ±4
Wednesday 115    110       120       ±5
Thursday  122    117       127       ±5
Friday    140    134       146       ±6
Saturday  165    158       172       ±7
Sunday    93     88        98        ±5

Interpretation:
- Saturday: 95% confident true mean is between 158-172
- Wider intervals indicate more variability
```

### Weekly Pattern Visualization Data

```
Data structure for frontend charts:

{
    "bar_chart": [
        {"day": "Monday", "value": 100, "factor": 0.833},
        {"day": "Tuesday", "value": 105, "factor": 0.875},
        ...
    ],
    "line_chart": {
        "x": [0, 1, 2, 3, 4, 5, 6],
        "y": [100, 105, 115, 122, 140, 165, 93],
        "day_names": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "heatmap": {
        "weeks": 12,
        "data": [[100, 105, ...], [98, 107, ...], ...]
    }
}
```

### Return Dictionary Structure

```
{
    "detected": true,
    "method": "anova_decomposition",
    "data_quality": {
        "total_days": 90,
        "weeks_observed": 12.86,
        "min_obs_per_day": 12,
        "max_obs_per_day": 13,
        "completeness": 98.5
    },
    "pattern": {
        "Monday": {
            "mean": 100,
            "median": 98,
            "factor": 0.833,
            "percentage": -16.7,
            "ci_lower": 95,
            "ci_upper": 105,
            "observations": 12
        },
        // ... other days
    },
    "statistics": {
        "weekly_mean": 120,
        "weekly_median": 118,
        "peak_day": "Saturday",
        "peak_value": 165,
        "low_day": "Sunday",
        "low_value": 93,
        "range": 72,
        "range_percentage": 60.0
    },
    "significance": {
        "anova_f": 15.42,
        "anova_p": 0.0001,
        "is_significant": true,
        "confidence_level": 0.95
    },
    "strength": {
        "score": 0.68,
        "level": "strong",
        "cv": 0.25,
        "r_squared": 0.58
    },
    "interpretation": {
        "pattern_type": "weekend_peak",
        "description": "Strong weekend effect with Saturday peak (+37.5%) and Sunday drop (-22.5%)",
        "recommendation": "Include weekly seasonality in forecast model"
    }
}
```

### Business Interpretation Patterns

| Pattern Type | Characteristics | Common In |
|--------------|-----------------|-----------|
| Weekend Peak | Sat/Sun high | Retail, restaurants |
| Weekday Peak | Mon-Fri high | B2B, offices |
| Midweek Peak | Wed-Thu high | Services |
| Monday Drop | Monday low | Post-weekend effect |
| Flat | No clear pattern | Essential goods |

### Expected Outcome
- Functional detect_weekly method with comprehensive analysis
- Day-of-week statistics with means and medians
- Seasonality factors showing percentage deviations
- Statistical significance testing with ANOVA
- Pattern strength quantification
- Confidence intervals for each day
- Visual-ready data for charts
- Structured output for forecasting integration

### Verification Checklist
- [ ] Method defined with proper signature
- [ ] Data sufficiency validation (min 14 days)
- [ ] Day-of-week extraction with proper numbering
- [ ] Daily averages calculated correctly
- [ ] Seasonality factors computed as ratios
- [ ] ANOVA test performed for significance
- [ ] Strength score calculated from multiple metrics
- [ ] Peak and low days identified
- [ ] Confidence intervals calculated
- [ ] Structured dictionary returned
- [ ] Unit tests cover various weekly patterns

---

## Task 27: Create detect_monthly

### Overview
Implement the detect_monthly method in SeasonalityDetector to identify and quantify monthly patterns in sales data. This method analyzes intra-month variations, calculates seasonality factors for different parts of the month (beginning, middle, end), and detects patterns related to pay periods and month-end behaviors, providing insights for medium-term forecasting.

### Dependencies
- Task 25: Create SeasonalityDetector

### Instructions

1. **Define method signature**
   - Create method in SeasonalityDetector class
   - Parameters: df (DataFrame), periods (int)
   - Return type: Dictionary with monthly pattern
   - Allow configurable period divisions

2. **Validate data requirements**
   - Check minimum 60 days of data (2 months)
   - Recommend 365+ days for reliability
   - Verify date continuity
   - Handle edge cases

3. **Extract month metadata**
   - Add month number (1-12)
   - Add month name
   - Add year for multi-year data
   - Calculate day_of_month (1-31)

4. **Divide month into periods**
   - Default: 3 periods (early, mid, late)
   - Early: Days 1-10
   - Mid: Days 11-20
   - Late: Days 21-end
   - Support custom divisions

5. **Calculate period statistics**
   - Group by month period
   - Calculate mean sales per period
   - Calculate median per period
   - Count observations per period

6. **Compute monthly seasonality factors**
   - Calculate overall monthly average
   - Compute factor per period
   - Express as percentage deviation
   - Normalize across periods

7. **Analyze pay period effects**
   - Identify pay day patterns (1st, 15th)
   - Detect pre/post pay day effects
   - Calculate pay period boost factor
   - Statistical significance testing

8. **Detect month-end patterns**
   - Analyze last 5 days of month
   - Compare to month average
   - Identify clearance patterns
   - Month-end surge or dip

9. **Calculate pattern consistency**
   - Measure pattern repeatability across months
   - Calculate standard deviation of factors
   - Assess month-to-month stability
   - Generate consistency score

10. **Generate monthly pattern report**
    - Structure output with all metrics
    - Include period-level details
    - Add interpretation and recommendations
    - Format for forecasting use

### Method Signature

```
def detect_monthly(
    self,
    df: pd.DataFrame,
    periods: int = 3,
    pay_days: Optional[List[int]] = [1, 15]
) -> Dict[str, Any]
```

### Monthly Period Division

```
Standard 3-Period Division:

Month View (30/31 days):
├── Early Period: Days 1-10
│   ├── Pay day effect (1st)
│   └── Beginning of month spending
│
├── Mid Period: Days 11-20
│   ├── Pay day effect (15th)
│   └── Mid-month activity
│
└── Late Period: Days 21-31
    ├── Pre-month-end behavior
    └── Budget depletion effect

Alternative 4-Period Division:
├── Week 1: Days 1-7
├── Week 2: Days 8-14
├── Week 3: Days 15-21
└── Week 4+: Days 22-31
```

### Period Assignment

```
Add period column to DataFrame:

date        quantity  day_of_month  period
2026-01-01  120       1             early
2026-01-05  130       5             early
2026-01-12  115       12            mid
2026-01-18  125       18            mid
2026-01-25  95        25            late
2026-01-31  88        31            late
```

### Monthly Pattern Calculation

```
Example Monthly Analysis (3 periods, 6 months data):

Period  Observations  Mean   Median  Monthly Avg  Factor  % Change
Early   60            125    122     110          1.136   +13.6%
Mid     60            118    115     110          1.073   +7.3%
Late    66            92     90      110          0.836   -16.4%

Interpretation:
├── Early month: +13.6% above average (pay day boost)
├── Mid month: +7.3% above average (secondary pay day)
└── Late month: -16.4% below average (budget exhaustion)

Pattern Type: Pay-Period Driven
Strength: Strong (0.72)
```

### Seasonality Factor Calculation

```
Factor_period = Mean_period / Mean_month

Example for Early Period:
├── Early Mean: 125 units/day
├── Monthly Mean: 110 units/day
└── Factor: 125 / 110 = 1.136

Usage in Forecasting:
Forecast for day 5 of month = Base_forecast × 1.136
```

### Pay Period Analysis

```
Pay Day Effect Detection:

Pay Days: 1st and 15th of month

Analysis Window:
├── Pre-pay: 2 days before
├── Pay day: Day itself
├── Post-pay: 2 days after

Example Results:
Day Relative to Pay Day  Mean Sales  Factor
-2 (pre)                 105         0.95
-1 (pre)                 110         1.00
0 (pay day)              145         1.32
+1 (post)                140         1.27
+2 (post)                125         1.14

Pay Day Boost:
├── Peak: +32% on pay day
├── Post-pay: +14-27% for 2 days
└── Duration: 3-day effect
```

| Pay Pattern | Characteristics | Industry Examples |
|-------------|-----------------|-------------------|
| Strong Spike | +30%+ on pay day | Retail, grocery |
| Moderate Boost | +10-20% pay period | Restaurants |
| Gradual | Spread over week | Online shopping |
| None | Flat pattern | Essential services |

### Month-End Pattern Analysis

```
Month-End Effect (Last 5 Days):

date        day_of_month  quantity  month_end
2026-01-27  27            88        True
2026-01-28  28            85        True
2026-01-29  29            80        True
2026-01-30  30            78        True
2026-01-31  31            75        True

Month-End Statistics:
├── Last 5 days mean: 81 units
├── Monthly mean: 110 units
├── Factor: 0.736
└── Pattern: -26.4% below average

Interpretation: Budget depletion effect
```

### Pattern Consistency Measurement

```
Consistency Across Months:

Month    Early  Mid    Late   Pattern
Jan-25   1.12   1.05   0.85   Standard
Feb-25   1.15   1.08   0.82   Standard
Mar-25   1.10   1.04   0.88   Standard
Apr-25   1.45   1.12   0.68   Strong early (NY)
May-25   1.14   1.06   0.84   Standard
Jun-25   1.13   1.07   0.85   Standard

Consistency Metrics:
├── Early Period: σ = 0.12, CV = 10.5%
├── Mid Period: σ = 0.03, CV = 2.8%
├── Late Period: σ = 0.07, CV = 8.2%
└── Overall Consistency: High (0.88)
```

| Consistency Score | Interpretation | Reliability |
|-------------------|----------------|-------------|
| 0.8 - 1.0 | Very Consistent | High |
| 0.6 - 0.8 | Consistent | Medium-High |
| 0.4 - 0.6 | Moderate | Medium |
| < 0.4 | Inconsistent | Low |

### Statistical Testing

```
Kruskal-Wallis H-test (Non-parametric ANOVA):

Tests whether period medians differ significantly

Null Hypothesis: All periods have same median
Alternative: At least one period differs

Example Result:
├── H-statistic: 42.5
├── p-value: 0.0001
├── Significance: Yes (p < 0.05)
└── Conclusion: Monthly periods differ significantly
```

### Return Dictionary Structure

```
{
    "detected": true,
    "method": "period_analysis",
    "data_quality": {
        "total_days": 365,
        "months_observed": 12,
        "completeness": 97.5
    },
    "period_pattern": {
        "early": {
            "days": "1-10",
            "mean": 125,
            "median": 122,
            "factor": 1.136,
            "percentage": 13.6,
            "observations": 120,
            "consistency": 0.88
        },
        "mid": {
            "days": "11-20",
            "mean": 118,
            "median": 115,
            "factor": 1.073,
            "percentage": 7.3,
            "observations": 120,
            "consistency": 0.92
        },
        "late": {
            "days": "21-31",
            "mean": 92,
            "median": 90,
            "factor": 0.836,
            "percentage": -16.4,
            "observations": 132,
            "consistency": 0.85
        }
    },
    "pay_period_analysis": {
        "pay_days": [1, 15],
        "pay_day_boost": {
            "day_1": {
                "factor": 1.32,
                "duration_days": 3,
                "total_boost": "+24%"
            },
            "day_15": {
                "factor": 1.18,
                "duration_days": 2,
                "total_boost": "+12%"
            }
        },
        "effect_detected": true,
        "strength": 0.65
    },
    "month_end_analysis": {
        "last_5_days_factor": 0.736,
        "percentage_change": -26.4,
        "pattern_type": "decline",
        "consistent": true
    },
    "statistics": {
        "monthly_mean": 110,
        "monthly_median": 108,
        "peak_period": "early",
        "low_period": "late",
        "range": 33,
        "range_percentage": 30.0
    },
    "significance": {
        "kruskal_h": 42.5,
        "p_value": 0.0001,
        "is_significant": true
    },
    "strength": {
        "score": 0.72,
        "level": "strong",
        "consistency": 0.88
    },
    "interpretation": {
        "pattern_type": "pay_period_driven",
        "description": "Strong early-month boost due to pay day on 1st, gradual decline through month with secondary boost on 15th",
        "recommendation": "Include monthly period factors in forecast, especially for pay period dates"
    }
}
```

### Pattern Type Classification

| Pattern Type | Characteristics | Recommendation |
|--------------|-----------------|----------------|
| Pay-Period Driven | Early/mid boost, late decline | Use pay day factors |
| Flat | Minimal variation | Skip monthly adjustment |
| Month-End Surge | Late month spike | Capture clearance sales |
| Gradual Decline | Linear decrease | Use linear factor |

### Expected Outcome
- Functional detect_monthly method with period analysis
- Month divided into configurable periods (default 3)
- Period-level seasonality factors calculated
- Pay period effect detection and quantification
- Month-end pattern analysis
- Consistency metrics across months
- Statistical significance testing
- Structured output for forecasting integration

### Verification Checklist
- [ ] Method defined with proper signature
- [ ] Data sufficiency validation (min 60 days)
- [ ] Month period assignment working correctly
- [ ] Period statistics calculated (mean, median, factor)
- [ ] Pay period analysis detects boost patterns
- [ ] Month-end analysis identifies trends
- [ ] Consistency measured across months
- [ ] Statistical testing implemented
- [ ] Pattern type classification working
- [ ] Structured dictionary returned with all metrics
- [ ] Unit tests cover various monthly patterns

---

## Task 28: Create detect_yearly

### Overview
Implement the detect_yearly method in SeasonalityDetector to identify and quantify annual seasonal patterns in sales data. This method analyzes year-over-year cycles, identifies festival periods, detects holiday effects, and calculates monthly seasonality factors across the year, providing essential inputs for long-term forecasting and capacity planning.

### Dependencies
- Task 25: Create SeasonalityDetector

### Instructions

1. **Define method signature**
   - Create method in SeasonalityDetector class
   - Parameters: df (DataFrame), festival_calendar
   - Return type: Dictionary with yearly pattern
   - Support multiple years of data

2. **Validate data requirements**
   - Check minimum 365 days (1 year)
   - Recommend 730+ days (2 years) for reliability
   - Verify year boundaries coverage
   - Handle partial years appropriately

3. **Extract yearly metadata**
   - Add year column
   - Add month_of_year (1-12)
   - Add quarter (Q1-Q4)
   - Add week_of_year (1-53)

4. **Calculate monthly patterns**
   - Group by month across all years
   - Calculate mean sales per month
   - Calculate median per month
   - Track observations per month

5. **Compute yearly seasonality factors**
   - Calculate annual average
   - Compute factor per month: month_mean / year_mean
   - Express as percentage deviation
   - Normalize factors

6. **Integrate festival calendar**
   - Map Sri Lankan festivals to months
   - Identify festival impact periods
   - Calculate pre/during/post festival patterns
   - Quantify festival boost factors

7. **Detect holiday clusters**
   - Identify major holiday periods
   - Sinhala New Year (April)
   - Vesak (May)
   - Christmas season (December)
   - Calculate cluster effects

8. **Analyze year-over-year growth**
   - Compare same months across years
   - Calculate YoY growth rates
   - Identify trend vs seasonality
   - Separate structural growth from cycles

9. **Calculate pattern strength**
   - Measure seasonality strength using STL
   - Calculate coefficient of variation
   - Assess predictability
   - Generate confidence scores

10. **Generate yearly report**
    - Structure comprehensive output
    - Include month-level details
    - Add festival impacts
    - Provide forecasting recommendations

### Method Signature

```
def detect_yearly(
    self,
    df: pd.DataFrame,
    festival_calendar: Optional[Dict] = None,
    detrend: bool = True
) -> Dict[str, Any]
```

### Yearly Pattern Analysis Flow

```
Input: 2+ years of daily sales data

Step 1: Data Preparation
├── Extract year, month, quarter
├── Load festival calendar
└── Validate coverage

Step 2: Monthly Aggregation
├── Group by month (Jan, Feb, ...)
├── Calculate statistics across years
└── Account for partial months

Step 3: Seasonality Calculation
├── Annual mean = 3650 units/month
├── January mean = 3200 units → Factor = 0.877 (-12.3%)
├── April mean = 4800 units → Factor = 1.315 (+31.5%)
└── December mean = 4400 units → Factor = 1.205 (+20.5%)

Step 4: Festival Analysis
├── Map festivals to impact periods
├── Calculate boost factors
└── Separate festival vs base seasonality

Step 5: Generate Report
└── Return comprehensive yearly pattern
```

### Monthly Seasonality Factors

```
Example Yearly Pattern (2 years data):

Month      Mean   Median  Annual Avg  Factor  %Change  Reason
January    3200   3150    3650        0.877   -12.3%   Post-holiday lull
February   3100   3050    3650        0.849   -15.1%   Low season
March      3400   3380    3650        0.932   -6.8%    Regular
April      4800   4750    3650        1.315   +31.5%   Sinhala New Year
May        4200   4150    3650        1.151   +15.1%   Vesak
June       3500   3480    3650        0.959   -4.1%    Regular
July       3450   3420    3650        0.945   -5.5%    Regular
August     3400   3380    3650        0.932   -6.8%    Regular
September  3550   3520    3650        0.973   -2.7%    Regular
October    3650   3620    3650        1.000   0.0%     Baseline
November   3800   3780    3650        1.041   +4.1%    Pre-holiday prep
December   4400   4350    3650        1.205   +20.5%   Christmas season

Peak Month: April (4800, +31.5%)
Low Month: February (3100, -15.1%)
Range: 1700 units (46.5% of mean)
```

### Sri Lankan Festival Calendar Integration

```
Festival Calendar Structure:

{
    "sinhala_new_year": {
        "month": 4,
        "typical_date": 14,
        "duration_days": 7,
        "impact_period": {
            "pre": 7,      # Days before
            "during": 7,   # Festival duration
            "post": 3      # Days after
        },
        "boost_factor": 1.45
    },
    "vesak": {
        "month": 5,
        "movable": true,
        "duration_days": 3,
        "impact_period": {
            "pre": 5,
            "during": 3,
            "post": 2
        },
        "boost_factor": 1.25
    },
    "christmas": {
        "month": 12,
        "typical_date": 25,
        "duration_days": 7,
        "impact_period": {
            "pre": 14,
            "during": 7,
            "post": 3
        },
        "boost_factor": 1.35
    }
    // ... other festivals
}
```

### Festival Impact Analysis

```
April (Sinhala New Year) Detailed Analysis:

Pre-Festival Period (April 7-13):
├── Average Sales: 5200 units/day
├── Factor: 1.42
└── Pattern: Shopping surge

Festival Period (April 14-20):
├── Average Sales: 4500 units/day
├── Factor: 1.23
└── Pattern: Celebration days

Post-Festival Period (April 21-23):
├── Average Sales: 4000 units/day
├── Factor: 1.10
└── Pattern: Return to normal

Overall April Factor: 1.315
├── Base seasonality: 1.05
├── Festival boost: +0.265
└── Total: 1.315
```

### Year-over-Year Comparison

```
Monthly YoY Analysis:

Month    2024   2025   2026   Avg     YoY Growth  Pattern
January  3000   3200   3400   3200    +6.7%       Growing
February 2900   3100   3300   3100    +6.9%       Growing
March    3200   3400   3600   3400    +6.3%       Growing
April    4500   4800   5100   4800    +6.7%       Festival + growth
May      3950   4200   4450   4200    +6.3%       Festival + growth
...

Observations:
├── Consistent growth: ~6.5% YoY across all months
├── Seasonality preserved across years
└── Festival patterns stable
```

### Detrending for Pure Seasonality

```
Separate Trend from Seasonality:

Original April values: [4500, 4800, 5100]
├── Trend component: [4500, 4797, 5110] (6.7% growth)
└── Seasonal component: [1.00, 1.00, 1.00] (no change)

After Detrending:
├── April 2024: 4500 / 4500 = 1.00
├── April 2025: 4800 / 4797 = 1.00
├── April 2026: 5100 / 5110 = 1.00
└── Pure Seasonal Factor: 1.315 (vs annual mean after detrending)

Why Detrend:
- Isolates repeating seasonal pattern
- Removes growth/decline trend
- More accurate for forecasting
```

### Quarterly Aggregation

```
Quarterly Seasonality (Alternative to Monthly):

Quarter  Months    Mean    Factor  % Change  Characteristics
Q1       Jan-Mar   3233    0.886   -11.4%    Post-holiday, low
Q2       Apr-Jun   4167    1.142   +14.2%    Festival season (Apr, May)
Q3       Jul-Sep   3467    0.950   -5.0%     Regular, stable
Q4       Oct-Dec   3950    1.082   +8.2%     Pre-holiday, Christmas

Use Case: Long-range forecasts, capacity planning
```

### Seasonality Strength (STL)

```
STL Decomposition for Yearly Seasonality:

Data = Trend + Seasonal + Residual

Seasonal Strength:
S = 1 - (Var(Residual) / Var(Detrended))

Example:
├── Variance of detrended data: 850,000
├── Variance of residual: 250,000
└── Strength: 1 - (250,000 / 850,000) = 0.706 (70.6%)

Interpretation: Strong yearly seasonality
```

| Strength | Category | Impact on Forecasting |
|----------|----------|----------------------|
| 0.7 - 1.0 | Very Strong | Essential to include |
| 0.5 - 0.7 | Strong | Important to include |
| 0.3 - 0.5 | Moderate | Consider including |
| 0.0 - 0.3 | Weak | May skip |

### Return Dictionary Structure

```
{
    "detected": true,
    "method": "stl_decomposition",
    "data_quality": {
        "total_days": 730,
        "years_observed": 2.0,
        "completeness": 98.5,
        "year_boundaries": ["2024", "2025"]
    },
    "monthly_pattern": {
        "January": {
            "mean": 3200,
            "median": 3150,
            "factor": 0.877,
            "percentage": -12.3,
            "observations": 62,
            "yoy_growth": 6.7
        },
        // ... all 12 months
    },
    "quarterly_pattern": {
        "Q1": {"mean": 3233, "factor": 0.886, "percentage": -11.4},
        "Q2": {"mean": 4167, "factor": 1.142, "percentage": 14.2},
        "Q3": {"mean": 3467, "factor": 0.950, "percentage": -5.0},
        "Q4": {"mean": 3950, "factor": 1.082, "percentage": 8.2}
    },
    "festival_analysis": {
        "sinhala_new_year": {
            "month": "April",
            "base_factor": 1.05,
            "festival_boost": 0.265,
            "total_factor": 1.315,
            "pre_festival_surge": 1.42,
            "impact_duration_days": 17
        },
        "vesak": {
            "month": "May",
            "base_factor": 1.00,
            "festival_boost": 0.151,
            "total_factor": 1.151,
            "pre_festival_surge": 1.18,
            "impact_duration_days": 10
        },
        "christmas": {
            "month": "December",
            "base_factor": 1.05,
            "festival_boost": 0.155,
            "total_factor": 1.205,
            "pre_festival_surge": 1.28,
            "impact_duration_days": 24
        }
    },
    "statistics": {
        "annual_mean": 3650,
        "annual_median": 3580,
        "peak_month": "April",
        "peak_value": 4800,
        "low_month": "February",
        "low_value": 3100,
        "range": 1700,
        "range_percentage": 46.5
    },
    "strength": {
        "score": 0.706,
        "level": "strong",
        "stl_variance_explained": 70.6
    },
    "trend_analysis": {
        "detrended": true,
        "avg_yoy_growth": 6.5,
        "growth_consistent": true,
        "seasonality_stable": true
    },
    "interpretation": {
        "pattern_type": "festival_driven",
        "description": "Strong yearly seasonality with festival peaks in April (Sinhala New Year +31.5%), May (Vesak +15.1%), and December (Christmas +20.5%)",
        "recommendation": "Include yearly seasonality factors in long-term forecasts, especially for festival months"
    }
}
```

### Expected Outcome
- Functional detect_yearly method with comprehensive analysis
- Monthly seasonality factors across the year
- Festival calendar integration for Sri Lankan holidays
- Festival impact quantification (pre/during/post)
- Year-over-year growth separation from seasonality
- Quarterly aggregation option
- STL-based strength calculation
- Detrending option for pure seasonality
- Structured output ready for forecasting models

### Verification Checklist
- [ ] Method defined with proper signature
- [ ] Data sufficiency validation (min 365 days)
- [ ] Monthly aggregation across years
- [ ] Seasonality factors calculated correctly
- [ ] Festival calendar integration working
- [ ] Festival boost factors quantified
- [ ] YoY growth analysis implemented
- [ ] Detrending option functional
- [ ] STL strength calculation working
- [ ] Quarterly aggregation available
- [ ] Structured dictionary returned
- [ ] Unit tests cover various yearly patterns

---

## Task 29: Create TrendAnalyzer

### Overview
Create the TrendAnalyzer class that provides comprehensive trend detection and analysis for sales time series data. This class implements multiple trend extraction algorithms including linear regression, moving averages, and exponential smoothing to identify long-term directional movements, separate trends from seasonal patterns, and provide trend strength metrics essential for forecasting accuracy.

### Dependencies
- Task 28: Create detect_yearly

### Instructions

1. **Create trend module file**
   - Create `trend.py` in `forecasting/data/` directory
   - Import required dependencies (pandas, numpy, scipy, statsmodels)
   - Import statistical libraries
   - Add comprehensive module docstring

2. **Define TrendAnalyzer class**
   - Create main class with initialization
   - Accept configuration parameters
   - Store trend components
   - Document trend methods

3. **Initialize trend configuration**
   - Set default trend detection method
   - Configure smoothing parameters
   - Set significance thresholds
   - Define minimum data requirements

4. **Implement data preprocessing**
   - Remove seasonality if present
   - Handle missing values
   - Normalize if needed
   - Validate data quality

5. **Create linear regression trend**
   - Implement ordinary least squares (OLS)
   - Calculate trend line equation (y = mx + b)
   - Compute R² for fit quality
   - Calculate p-value for significance

6. **Implement moving average trend**
   - Calculate long-term moving average
   - Use appropriate window (30+ days)
   - Handle edge effects
   - Provide smoothed trend line

7. **Add exponential smoothing trend**
   - Implement single exponential smoothing
   - Calculate optimal smoothing parameter
   - Extract trend component
   - Handle initialization

8. **Implement STL trend extraction**
   - Use STL decomposition
   - Extract trend component
   - Separate from seasonality
   - Validate trend quality

9. **Calculate trend strength metrics**
   - Compute trend coefficient
   - Calculate trend significance
   - Measure trend consistency
   - Generate strength score

10. **Generate trend analysis report**
    - Structure comprehensive output
    - Include all trend metrics
    - Provide visualization data
    - Add forecasting recommendations

### TrendAnalyzer Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__(config)` | Initialize with configuration |
| `preprocess_data(df)` | Remove seasonality, handle missing |
| `linear_trend(data)` | OLS regression trend |
| `moving_average_trend(data, window)` | MA trend |
| `exponential_trend(data, alpha)` | Exponential smoothing |
| `stl_trend(data, period)` | STL decomposition trend |
| `calculate_strength(trend)` | Trend strength metric |
| `generate_report()` | Comprehensive report |

### Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| method | str | 'linear' | Trend detection method |
| deseasonalize | bool | True | Remove seasonality first |
| min_data_points | int | 30 | Minimum data for trend |
| ma_window | int | 30 | Moving average window |
| alpha | float | 0.1 | Exponential smoothing factor |
| significance_level | float | 0.05 | Statistical significance |

### Trend Detection Methods

| Method | Algorithm | Pros | Cons | Best For |
|--------|-----------|------|------|----------|
| Linear | OLS regression | Simple, interpretable | Assumes linearity | Stable trends |
| Moving Average | Rolling mean | Smooth, robust | Lagging | Noisy data |
| Exponential | Weighted average | Adaptive | Parameter sensitive | Recent trends |
| STL | Decomposition | Separates components | Requires seasonality | Complex patterns |
| Polynomial | Higher-order fit | Flexible | Overfitting risk | Curved trends |

### Linear Regression Trend

```
Linear Trend Calculation:

Data points: [(1, 100), (2, 105), (3, 108), ..., (365, 250)]

Linear Regression: y = mx + b

Step 1: Calculate slope (m) and intercept (b)
Using least squares method:
m = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)
b = ȳ - m × x̄

Example Result:
├── Slope (m): 0.411 units/day
├── Intercept (b): 98.5 units
├── Equation: y = 0.411x + 98.5
└── Interpretation: +0.411 units per day increase

Annual Growth: 0.411 × 365 = 150 units/year
Percentage Growth: (150 / 175) × 100 = 85.7% per year
```

### Trend Equation Components

| Component | Symbol | Meaning | Example |
|-----------|--------|---------|---------|
| Slope | m | Rate of change per period | 0.411 units/day |
| Intercept | b | Starting value | 98.5 units |
| R² | R² | Goodness of fit (0-1) | 0.78 (78%) |
| p-value | p | Statistical significance | 0.001 |

### Trend Visualization

```
Linear Trend Plot:

Sales
│
250 ┤                                    ●
    │                                  ●
    │                                ●
200 ┤                              ●
    │                            ●
    │                          ●  ← Actual data
150 ┤                        ●
    │                      ●
    │                    ●
100 ┤●─────────────────────────────────  ← Trend line (y = 0.411x + 98.5)
    │
    └────────────────────────────────────────────> Time (days)
    0        100       200       300       365
```

### Moving Average Trend

```
Long-term Moving Average:

Original Data (simplified):
Day: [1,   2,   3,   4, ..., 30,  31,  32]
Val: [100, 102, 98,  105, ..., 120, 122, 118]

30-day Moving Average Trend:
Day  MA30   Interpretation
30   109.5  First complete window
31   110.2  Trend increasing
32   110.8  Continued growth
...

Characteristics:
├── Smooths short-term fluctuations
├── Lags behind actual data
├── Window size = trend time scale
└── Larger window = smoother trend
```

| Window Size | Use Case | Lag |
|-------------|----------|-----|
| 7 days | Short-term trend | Minimal |
| 30 days | Medium-term trend | Moderate |
| 90 days | Long-term trend | Significant |
| 365 days | Yearly trend | Substantial |

### Exponential Smoothing Trend

```
Simple Exponential Smoothing:

Formula: S_t = α × Y_t + (1-α) × S_{t-1}

Where:
├── S_t: Smoothed value at time t
├── Y_t: Actual value at time t
├── α: Smoothing factor (0-1)
└── S_{t-1}: Previous smoothed value

Example (α = 0.3):
Day  Actual  Calculation              Smoothed
1    100     S_1 = 100                100.0
2    105     0.3×105 + 0.7×100       101.5
3    98      0.3×98 + 0.7×101.5      100.4
4    108     0.3×108 + 0.7×100.4     102.7

Smoothing Factor Selection:
├── α = 0.1: Heavy smoothing, slow response
├── α = 0.3: Moderate smoothing
└── α = 0.5: Light smoothing, fast response
```

### STL Trend Component

```
STL Decomposition for Trend Extraction:

Original Data = Trend + Seasonal + Residual

Extract Trend Component:

Day  Original  Seasonal  Residual  Trend
1    100       -5        2         103
2    105       -3        1         107
3    98        -8        -1        107
4    108       +4        -1        105
5    104       +2        3         99
...

Trend Characteristics:
├── Smoothly varying
├── Captures long-term movement
├── Independent of seasonality
└── Used for forecasting baseline
```

### Trend Strength Calculation

```
Trend Strength Formula:

Strength = R² of linear regression on trend component

Alternative: Variance-based

Strength = Var(Trend) / Var(Deseasonalized Data)

Example:
├── Variance of deseasonalized data: 1200
├── Variance of trend: 950
└── Strength: 950 / 1200 = 0.792 (79.2%)
```

| Strength Score | Category | Interpretation |
|----------------|----------|----------------|
| 0.8 - 1.0 | Very Strong | Clear directional trend |
| 0.6 - 0.8 | Strong | Noticeable trend |
| 0.4 - 0.6 | Moderate | Mixed with noise |
| 0.2 - 0.4 | Weak | Uncertain trend |
| 0.0 - 0.2 | Very Weak | No clear trend |

### Statistical Significance Testing

```
Hypothesis Test for Trend Slope:

H0: Slope = 0 (no trend)
H1: Slope ≠ 0 (trend exists)

Test Statistic:
t = slope / standard_error

Example:
├── Slope: 0.411
├── Standard Error: 0.052
├── t-statistic: 0.411 / 0.052 = 7.90
├── p-value: < 0.0001
└── Conclusion: Significant trend (reject H0)
```

| p-value | Interpretation | Confidence |
|---------|----------------|------------|
| < 0.001 | Highly significant | Very High |
| 0.001 - 0.01 | Significant | High |
| 0.01 - 0.05 | Marginally significant | Medium |
| > 0.05 | Not significant | Low |

### Trend Analysis Report Structure

```
{
    "method": "linear",
    "data_quality": {
        "total_points": 365,
        "deseasonalized": true,
        "outliers_removed": 5
    },
    "linear_trend": {
        "slope": 0.411,
        "intercept": 98.5,
        "equation": "y = 0.411x + 98.5",
        "r_squared": 0.78,
        "p_value": 0.0001,
        "significance": "highly_significant"
    },
    "trend_metrics": {
        "daily_change": 0.411,
        "monthly_change": 12.33,
        "annual_change": 150.0,
        "percentage_growth": 85.7,
        "strength_score": 0.79
    },
    "confidence_intervals": {
        "slope_ci_95": [0.308, 0.514],
        "forecast_ci_95": [240, 260]
    },
    "alternative_trends": {
        "moving_average_30": {
            "final_value": 245,
            "trend": "increasing"
        },
        "exponential_smooth": {
            "final_value": 248,
            "alpha": 0.3,
            "trend": "increasing"
        }
    },
    "interpretation": {
        "trend_type": "linear_growth",
        "direction": "up",
        "strength": "strong",
        "description": "Strong upward trend with 0.411 units/day increase, statistically significant (p<0.001)",
        "recommendation": "Include trend component in forecast model"
    }
}
```

### Expected Outcome
- Functional TrendAnalyzer class with multiple methods
- Linear regression trend with statistical significance
- Moving average trend for smoothing
- Exponential smoothing for adaptive trends
- STL decomposition for complex patterns
- Trend strength quantification
- Statistical testing for significance
- Comprehensive trend report with metrics
- Visualization-ready data

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/data/trend.py` created
- [ ] TrendAnalyzer class defined with configuration
- [ ] Data preprocessing removes seasonality
- [ ] Linear regression implemented with R² and p-value
- [ ] Moving average trend calculated
- [ ] Exponential smoothing implemented
- [ ] STL trend extraction working
- [ ] Trend strength calculation functional
- [ ] Statistical significance testing included
- [ ] Trend report generation working
- [ ] Unit tests cover various trend patterns

---

## Task 30: Create calculate_trend

### Overview
Implement the calculate_trend method in TrendAnalyzer to extract and quantify trend components from sales time series data. This method applies the configured trend detection algorithm, calculates trend coefficients and statistics, separates trend from seasonality and noise, and provides comprehensive metrics for trend characterization essential for accurate forecasting.

### Dependencies
- Task 29: Create TrendAnalyzer

### Instructions

1. **Define method signature**
   - Create method in TrendAnalyzer class
   - Parameters: df (DataFrame), method (str)
   - Return type: Dictionary with trend details
   - Support multiple trend extraction methods

2. **Validate input data**
   - Check minimum data points (30+)
   - Verify date continuity
   - Handle missing values
   - Ensure numeric data types

3. **Preprocess data for trend analysis**
   - Remove seasonality if configured
   - Apply detrending if needed for method
   - Normalize data if required
   - Handle outliers

4. **Implement linear trend calculation**
   - Apply OLS linear regression
   - Calculate slope (trend coefficient)
   - Calculate intercept
   - Compute fitted values

5. **Calculate statistical metrics**
   - Compute R² (goodness of fit)
   - Calculate p-value for slope
   - Compute standard errors
   - Calculate confidence intervals

6. **Extract trend values**
   - Generate trend values for all time points
   - Calculate residuals (actual - trend)
   - Compute trend contribution to variance
   - Format trend series

7. **Calculate trend rates**
   - Daily trend rate
   - Weekly trend rate
   - Monthly trend rate
   - Annual trend rate (percentage)

8. **Add projection capabilities**
   - Project trend forward N periods
   - Calculate projection confidence intervals
   - Handle trend extrapolation
   - Provide projection data

9. **Assess trend quality**
   - Calculate trend strength score
   - Measure consistency
   - Assess stability
   - Generate quality metrics

10. **Generate trend output**
    - Structure comprehensive result
    - Include all metrics and statistics
    - Provide visualization data
    - Add interpretation

### Method Signature

```
def calculate_trend(
    self,
    df: pd.DataFrame,
    method: str = 'linear',
    deseasonalize: bool = True,
    periods_ahead: int = 30
) -> Dict[str, Any]
```

### Trend Calculation Workflow

```
Input: Daily sales DataFrame

Step 1: Preprocess
├── Remove seasonality (if deseasonalize=True)
├── Handle missing values
└── Create time index (1, 2, 3, ..., n)

Step 2: Calculate Linear Trend
├── X: Time index [1, 2, ..., 365]
├── Y: Sales values (deseasonalized)
├── Regression: Y = mX + b
├── Result: m=0.411, b=98.5, R²=0.78

Step 3: Generate Trend Values
├── Day 1: 0.411×1 + 98.5 = 98.9
├── Day 2: 0.411×2 + 98.5 = 99.3
├── ...
└── Day 365: 0.411×365 + 98.5 = 248.5

Step 4: Calculate Metrics
├── Daily rate: 0.411 units/day
├── Annual rate: 150 units/year
├── % Growth: 85.7%
└── Strength: 0.79

Step 5: Project Future
├── Day 366: 248.9
├── Day 395: 261.2
└── With confidence intervals

Step 6: Return Results
```

### Linear Regression Implementation

```
Ordinary Least Squares (OLS) Calculation:

Given: Time points X = [1, 2, ..., n]
       Sales values Y = [y1, y2, ..., yn]

Calculate:
X_mean = Σ(X) / n
Y_mean = Σ(Y) / n

Slope (m):
m = Σ((X - X_mean) × (Y - Y_mean)) / Σ((X - X_mean)²)

Intercept (b):
b = Y_mean - m × X_mean

Example with 5 points:
X: [1, 2, 3, 4, 5]
Y: [100, 105, 108, 115, 120]

X_mean = 3, Y_mean = 109.6

m = ((1-3)×(100-109.6) + ... + (5-3)×(120-109.6)) / ((1-3)² + ... + (5-3)²)
  = 52 / 10
  = 5.2 units/day

b = 109.6 - 5.2×3 = 94.0

Trend Equation: Y = 5.2X + 94.0
```

### Fitted Values and Residuals

```
Calculate fitted values and residuals:

Day  Actual  Fitted (Trend)  Residual
1    100     99.2            +0.8
2    105     104.4           +0.6
3    108     109.6           -1.6
4    115     114.8           +0.2
5    120     120.0           0.0

Sum of Residuals: ≈ 0 (property of OLS)
Mean Absolute Residual: 0.64 units
```

### Statistical Metrics

```
R² (Coefficient of Determination):

R² = 1 - (SS_residual / SS_total)

Where:
SS_residual = Σ(residual²) = Σ((actual - fitted)²)
SS_total = Σ((actual - mean)²)

Example:
├── SS_residual: 264
├── SS_total: 1200
└── R²: 1 - (264/1200) = 0.78 (78%)

Interpretation: Trend explains 78% of variance
```

| R² Value | Fit Quality | Interpretation |
|----------|-------------|----------------|
| 0.9 - 1.0 | Excellent | Very strong linear trend |
| 0.7 - 0.9 | Good | Strong trend |
| 0.5 - 0.7 | Moderate | Noticeable trend |
| 0.3 - 0.5 | Fair | Weak trend |
| 0.0 - 0.3 | Poor | No clear linear trend |

### P-value Calculation

```
Test if slope is significantly different from zero:

Standard Error of Slope:
SE_slope = √(SS_residual / (n-2)) / √(Σ((X - X_mean)²))

T-statistic:
t = slope / SE_slope

P-value:
From t-distribution with (n-2) degrees of freedom

Example:
├── Slope: 0.411
├── SE: 0.052
├── t-statistic: 7.90
├── df: 363
├── p-value: < 0.0001
└── Conclusion: Highly significant trend
```

### Trend Rate Calculations

```
Convert slope to different time scales:

Given: Daily slope = 0.411 units/day

Weekly Rate:
0.411 × 7 = 2.877 units/week

Monthly Rate:
0.411 × 30 = 12.33 units/month (approximate)

Annual Rate:
0.411 × 365 = 150 units/year

Percentage Annual Growth:
(Annual Rate / Mean) × 100
(150 / 175) × 100 = 85.7% per year

Relative Daily Growth:
(Daily Rate / Mean) × 100
(0.411 / 175) × 100 = 0.235% per day
```

### Confidence Intervals

```
95% Confidence Interval for Slope:

CI = slope ± (t_critical × SE_slope)

Where t_critical from t-distribution (df=n-2, α=0.025)

Example:
├── Slope: 0.411
├── SE: 0.052
├── t_critical (df=363): 1.96
├── Margin: 1.96 × 0.052 = 0.102
├── CI: [0.309, 0.513]
└── Interpretation: 95% confident true slope is between 0.309 and 0.513
```

### Trend Projection

```
Project trend into future:

Current: Day 365, Value = 248.5
Project 30 days ahead:

Day  Trend Value  95% CI Lower  95% CI Upper
366  248.9        238.9         258.9
370  250.5        240.3         260.7
380  254.6        244.0         265.2
395  260.7        249.5         271.9

Projection Formula:
Y_future = slope × X_future + intercept

Confidence Interval Width increases with distance:
CI_width ∝ √(1/n + (X_future - X_mean)² / Σ((X - X_mean)²))
```

### Deseasonalization Effect

```
Compare with and without deseasonalization:

Original Data Trend:
├── Slope: 0.350 units/day
├── R²: 0.52
└── Issue: Seasonality inflates variance

Deseasonalized Data Trend:
├── Slope: 0.411 units/day
├── R²: 0.78
└── Cleaner: True underlying trend

Process:
Original → Remove Seasonal Component → Deseasonalized
Then calculate trend on deseasonalized data
```

### Return Dictionary Structure

```
{
    "method": "linear",
    "preprocessing": {
        "deseasonalized": true,
        "outliers_removed": 3,
        "missing_filled": 5
    },
    "trend_equation": {
        "slope": 0.411,
        "intercept": 98.5,
        "formula": "y = 0.411x + 98.5"
    },
    "statistics": {
        "r_squared": 0.78,
        "adjusted_r_squared": 0.779,
        "p_value": 0.0001,
        "standard_error": 0.052,
        "significance": "highly_significant"
    },
    "confidence_intervals": {
        "slope_95": [0.309, 0.513],
        "intercept_95": [92.3, 104.7]
    },
    "trend_rates": {
        "daily": 0.411,
        "weekly": 2.877,
        "monthly": 12.33,
        "annual": 150.0,
        "percentage_annual": 85.7,
        "percentage_daily": 0.235
    },
    "trend_values": {
        "start": 98.9,
        "end": 248.5,
        "mean": 173.7,
        "range": 149.6
    },
    "residuals": {
        "mean": 0.0,
        "std": 16.2,
        "mae": 12.4,
        "max_positive": 45.2,
        "max_negative": -38.7
    },
    "projection": {
        "periods_ahead": 30,
        "start_day": 366,
        "end_day": 395,
        "values": [248.9, 249.3, ..., 260.7],
        "ci_lower": [238.9, 239.1, ..., 249.5],
        "ci_upper": [258.9, 259.5, ..., 271.9]
    },
    "quality": {
        "strength_score": 0.79,
        "consistency": 0.85,
        "stability": 0.92
    },
    "interpretation": {
        "direction": "increasing",
        "strength": "strong",
        "description": "Strong upward trend of 0.411 units/day (150 units/year, 85.7% annual growth)",
        "reliability": "high"
    }
}
```

### Expected Outcome
- Functional calculate_trend method with comprehensive analysis
- Linear regression trend with slope and intercept
- Statistical metrics including R² and p-value
- Trend rates at multiple time scales
- Confidence intervals for slope and projections
- Future trend projection with uncertainty bounds
- Residual analysis for model assessment
- Quality metrics for trend reliability
- Structured output ready for forecasting

### Verification Checklist
- [ ] Method defined with proper signature
- [ ] Input validation for sufficient data
- [ ] Deseasonalization option working
- [ ] Linear regression calculation correct
- [ ] R² and p-value computed
- [ ] Confidence intervals calculated
- [ ] Trend rates for daily/weekly/monthly/annual
- [ ] Future projection with CI implemented
- [ ] Residual analysis included
- [ ] Quality metrics calculated
- [ ] Structured dictionary returned
- [ ] Unit tests cover various trend patterns

---

## Task 31: Create trend_direction

### Overview
Implement the trend_direction method in TrendAnalyzer to classify the trend direction and strength into interpretable categories (up, down, stable). This method analyzes the trend coefficient from calculate_trend, applies significance thresholds, considers statistical confidence, and provides clear categorical output optimized for business decision-making and forecasting model selection.

### Dependencies
- Task 30: Create calculate_trend

### Instructions

1. **Define method signature**
   - Create method in TrendAnalyzer class
   - Parameters: trend_coefficient, p_value, threshold
   - Return type: Dictionary with direction classification
   - Add comprehensive docstring

2. **Validate input parameters**
   - Check trend_coefficient is numeric
   - Validate p_value is between 0 and 1
   - Ensure threshold is positive
   - Handle None/missing values

3. **Define classification thresholds**
   - Stable threshold: ±0.05 (default)
   - Configurable for different use cases
   - Consider data scale
   - Document threshold rationale

4. **Apply statistical significance check**
   - Check if p-value < significance level (0.05)
   - Only classify if trend is significant
   - Mark insignificant trends as "stable"
   - Provide significance flag

5. **Classify trend direction**
   - Up: coefficient > threshold and significant
   - Down: coefficient < -threshold and significant
   - Stable: |coefficient| ≤ threshold or not significant
   - Return categorical label

6. **Calculate strength level**
   - Weak: Just above threshold
   - Moderate: 2-5× threshold
   - Strong: >5× threshold
   - Very strong: >10× threshold

7. **Add confidence assessment**
   - Based on p-value: Very high < 0.001, High < 0.01, etc.
   - Based on R²: Higher R² = higher confidence
   - Combined confidence score
   - Return confidence category

8. **Provide actionable interpretation**
   - Business-friendly description
   - Numerical context (units/day, % growth)
   - Comparison to baseline
   - Forecasting implications

9. **Generate visual indicators**
   - Arrow symbols (↑↓→)
   - Color codes (green/red/gray)
   - Emoji representations
   - Dashboard-ready format

10. **Create classification report**
    - Structure comprehensive output
    - Include all classification details
    - Add confidence and strength
    - Provide recommendations

### Method Signature

```
def trend_direction(
    self,
    trend_coefficient: float,
    p_value: float = 1.0,
    threshold: float = 0.05,
    r_squared: Optional[float] = None
) -> Dict[str, Any]
```

### Classification Thresholds

```
Trend Direction Classification:

Given: trend_coefficient (daily slope)

Decision Tree:
├── Is trend significant? (p < 0.05)
│   ├── No → "stable"
│   └── Yes → Continue
│
├── Is |coefficient| > threshold?
│   ├── No → "stable"
│   └── Yes → Continue
│
└── coefficient > 0?
    ├── Yes → "up"
    └── No → "down"

Default Threshold: 0.05 units/day
Rationale: 0.05 × 365 = 18.25 units/year (minimal meaningful change)
```

| Threshold Type | Value | Use Case |
|----------------|-------|----------|
| Very Sensitive | 0.01 | Detect slight changes |
| Standard | 0.05 | General use |
| Conservative | 0.10 | Only strong trends |
| Product-Specific | Variable | Based on product volatility |

### Statistical Significance Check

```
Significance Evaluation:

p_value = 0.0001
significance_level = 0.05

Check: p_value < significance_level
0.0001 < 0.05 → True (Significant)

Classification:
├── Significant (p < 0.05) → Classify as up/down/stable
└── Not Significant (p ≥ 0.05) → Force to "stable"

Example Cases:
Case 1: coef = 0.40, p = 0.0001 → "up" (significant and large)
Case 2: coef = 0.40, p = 0.15 → "stable" (large but not significant)
Case 3: coef = 0.02, p = 0.0001 → "stable" (significant but small)
```

### Direction Classification Logic

```
Classification Examples:

Case 1: Upward Trend
├── Coefficient: 0.411
├── Threshold: 0.05
├── p-value: 0.0001
├── Check: 0.411 > 0.05 AND p < 0.05
└── Result: "up"

Case 2: Downward Trend
├── Coefficient: -0.325
├── Threshold: 0.05
├── p-value: 0.002
├── Check: -0.325 < -0.05 AND p < 0.05
└── Result: "down"

Case 3: Stable (Below Threshold)
├── Coefficient: 0.03
├── Threshold: 0.05
├── p-value: 0.001
├── Check: 0.03 < 0.05 (within stable range)
└── Result: "stable"

Case 4: Stable (Not Significant)
├── Coefficient: 0.20
├── Threshold: 0.05
├── p-value: 0.12
├── Check: p > 0.05 (not significant)
└── Result: "stable"
```

### Strength Level Classification

```
Strength Categorization:

Given: coefficient = 0.411, threshold = 0.05

Strength = coefficient / threshold = 0.411 / 0.05 = 8.22

Classification:
├── Weak: 1.0 - 2.0 × threshold
├── Moderate: 2.0 - 5.0 × threshold
├── Strong: 5.0 - 10.0 × threshold
└── Very Strong: > 10.0 × threshold

Result: Strong (8.22× threshold)
```

| Strength Ratio | Category | Description |
|----------------|----------|-------------|
| 1.0 - 2.0 | Weak | Barely above threshold |
| 2.0 - 5.0 | Moderate | Clear but not dramatic |
| 5.0 - 10.0 | Strong | Pronounced trend |
| > 10.0 | Very Strong | Dominant trend |

### Confidence Assessment

```
Confidence Calculation:

Component 1: Statistical Significance
p-value = 0.0001
├── < 0.001: Very High
├── 0.001-0.01: High
├── 0.01-0.05: Medium
└── > 0.05: Low

Component 2: Model Fit (R²)
R² = 0.78
├── > 0.8: Excellent
├── 0.6-0.8: Good
├── 0.4-0.6: Fair
└── < 0.4: Poor

Combined Confidence:
├── p-value contribution: 40%
├── R² contribution: 60%
└── Score: 0.4 × 1.0 + 0.6 × 0.975 = 0.985 (Very High)
```

### Visual Indicators

```
Direction Symbols:

Direction  Symbol  Emoji  Color   CSS Class
up         ↑       📈     Green   trend-up
down       ↓       📉     Red     trend-down
stable     →       ➡️      Gray    trend-stable

Strength Indicators:
Weak:       ↑       (single)
Moderate:   ↑↑      (double)
Strong:     ↑↑↑     (triple)
Very Strong: ⬆️      (bold arrow)

Usage:
Console: "Trend: ↑↑↑ Strong Upward"
Dashboard: <span class="trend-up strong">↑↑↑</span>
Email: "📈 Strong growth detected"
```

### Business Interpretation

```
Interpretation Templates:

Up (Strong):
"Strong upward trend detected. Sales increasing by {coef} units per day 
({annual_rate} units/year, {percentage}% annual growth). Recommend 
increasing inventory and staffing for continued growth."

Down (Moderate):
"Moderate downward trend observed. Sales decreasing by {coef} units per day 
({annual_rate} units/year, {percentage}% decline). Review pricing, competition, 
and marketing strategy. Consider promotional activities."

Stable (High Confidence):
"No significant trend detected. Sales remain stable around {mean} units per day. 
Maintain current operations and monitor for changes."

Stable (Low Confidence):
"Trend unclear due to high variability. More data needed for reliable 
trend assessment. Continue monitoring."
```

### Return Dictionary Structure

```
{
    "direction": "up",
    "strength": "strong",
    "strength_ratio": 8.22,
    "confidence": {
        "level": "very_high",
        "score": 0.985,
        "p_value": 0.0001,
        "r_squared": 0.78
    },
    "classification": {
        "coefficient": 0.411,
        "threshold": 0.05,
        "is_significant": true,
        "significance_level": 0.05
    },
    "visual": {
        "symbol": "↑",
        "emoji": "📈",
        "color": "green",
        "css_class": "trend-up strong",
        "arrow_count": 3
    },
    "interpretation": {
        "short": "Strong upward trend",
        "long": "Strong upward trend detected. Sales increasing by 0.411 units per day (150 units/year, 85.7% annual growth).",
        "recommendation": "Recommend increasing inventory and staffing for continued growth."
    },
    "metrics": {
        "daily_change": 0.411,
        "annual_change": 150.0,
        "percentage_annual": 85.7,
        "time_to_double": 1.17  # years
    },
    "forecasting_implications": {
        "model_type": "trend_based",
        "include_trend": true,
        "trend_weight": "high",
        "extrapolation_safe": true
    }
}
```

### Classification Decision Matrix

| Coefficient | P-value | Threshold | Direction | Strength |
|-------------|---------|-----------|-----------|----------|
| 0.45 | 0.0001 | 0.05 | up | strong |
| 0.08 | 0.002 | 0.05 | up | weak |
| 0.03 | 0.001 | 0.05 | stable | - |
| -0.30 | 0.005 | 0.05 | down | strong |
| 0.20 | 0.15 | 0.05 | stable | - |

### Expected Outcome
- Functional trend_direction method with clear classification
- Three-category output (up, down, stable)
- Threshold-based decision logic
- Statistical significance consideration
- Strength level categorization (weak to very strong)
- Confidence assessment combining p-value and R²
- Business-friendly interpretation text
- Visual indicators for dashboards
- Actionable recommendations
- Structured output ready for UI integration

### Verification Checklist
- [ ] Method defined with proper signature
- [ ] Input validation for coefficient and p-value
- [ ] Statistical significance check implemented
- [ ] Threshold comparison logic correct
- [ ] Direction classification (up/down/stable) working
- [ ] Strength level calculation functional
- [ ] Confidence assessment combines p-value and R²
- [ ] Visual indicators generated (symbols, colors)
- [ ] Business interpretation text created
- [ ] Forecasting implications provided
- [ ] Structured dictionary returned
- [ ] Unit tests cover all classification scenarios

---

## Task 32: Verify Data Processing

### Overview
Implement comprehensive verification and testing for the entire historical data processing pipeline created in Tasks 17-31. This task validates the integration of SalesDataExtractor, DataCleaner, SeasonalityDetector, and TrendAnalyzer classes, ensures data flows correctly through the pipeline, tests edge cases, and confirms the system is production-ready for demand forecasting.

### Dependencies
- Task 31: Create trend_direction

### Instructions

1. **Create verification test suite**
   - Create test file in `forecasting/tests/` directory
   - Import all data processing classes
   - Set up test fixtures and sample data
   - Organize tests by component

2. **Test SalesDataExtractor integration**
   - Verify daily/weekly/monthly extraction
   - Test tenant isolation
   - Validate date range handling
   - Check caching functionality

3. **Test DataCleaner pipeline**
   - Verify missing value handling
   - Test outlier removal/capping
   - Validate data smoothing
   - Check quality assessment

4. **Test SeasonalityDetector accuracy**
   - Verify weekly pattern detection
   - Test monthly pattern extraction
   - Validate yearly seasonality
   - Check strength calculations

5. **Test TrendAnalyzer functionality**
   - Verify trend calculation accuracy
   - Test direction classification
   - Validate statistical metrics
   - Check projection capabilities

6. **Test end-to-end pipeline**
   - Extract data → Clean → Detect patterns → Analyze trend
   - Verify data transformations preserve integrity
   - Test with various data sizes
   - Validate output compatibility

7. **Test edge cases**
   - Insufficient data scenarios
   - All-zero sales periods
   - Extreme outliers
   - Missing date ranges
   - Single-value datasets

8. **Performance testing**
   - Test with large datasets (10,000+ days)
   - Measure execution time
   - Verify memory usage
   - Check caching efficiency

9. **Validate output formats**
   - Verify all return dictionaries match specifications
   - Test JSON serializability
   - Validate data types
   - Check for required fields

10. **Create verification report**
    - Document test results
    - List passed/failed tests
    - Identify any issues
    - Provide recommendations

### Verification Test Structure

```
tests/
└── forecasting/
    └── data/
        ├── __init__.py
        ├── test_extractor.py
        ├── test_cleaner.py
        ├── test_seasonality.py
        ├── test_trend.py
        └── test_integration.py
```

### SalesDataExtractor Tests

```
Test Cases for Extractor:

1. test_extractor_initialization
   - Verify class instantiates without errors
   - Check default parameters set correctly

2. test_daily_sales_basic
   - Extract 90 days of data
   - Verify DataFrame structure
   - Check date continuity

3. test_daily_sales_with_gaps
   - Data with missing dates
   - Verify gap filling with zeros
   - Check date range complete

4. test_weekly_sales_aggregation
   - Extract weekly data
   - Verify ISO week format
   - Check aggregation accuracy

5. test_monthly_sales_aggregation
   - Extract monthly data
   - Verify month boundaries
   - Check year transitions

6. test_tenant_isolation
   - Create data for multiple tenants
   - Verify data doesn't leak between tenants
   - Check filters work correctly

7. test_caching_functionality
   - First call (cache miss)
   - Second call (cache hit)
   - Verify cache key generation
   - Check cache expiration

8. test_insufficient_data
   - Request data with < 14 days
   - Verify appropriate warning/error
   - Check graceful handling
```

### DataCleaner Tests

```
Test Cases for Cleaner:

1. test_cleaner_initialization
   - Verify configuration accepted
   - Check default parameters

2. test_handle_missing_interpolate
   - Data with 1-2 day gaps
   - Verify linear interpolation
   - Check values reasonable

3. test_handle_missing_ffill
   - Data with 3-7 day gaps
   - Verify forward fill
   - Check no data loss

4. test_remove_outliers_iqr
   - Data with clear outliers
   - Verify IQR detection
   - Check cap/remove actions

5. test_remove_outliers_zscore
   - Data with extreme values
   - Verify Z-score method
   - Check threshold application

6. test_smooth_data_sma
   - Noisy data
   - Verify moving average
   - Check smoothing effect

7. test_smooth_data_ema
   - Volatile data
   - Verify exponential smoothing
   - Check recent value emphasis

8. test_quality_assessment
   - Data with known issues
   - Verify quality score calculation
   - Check report accuracy
```

### SeasonalityDetector Tests

```
Test Cases for Seasonality:

1. test_seasonality_initialization
   - Verify class setup
   - Check method availability

2. test_weekly_pattern_detection
   - Synthetic data with weekly cycle
   - Verify day-of-week factors
   - Check significance testing

3. test_monthly_pattern_detection
   - Data with monthly periodicity
   - Verify period factors
   - Check pay period detection

4. test_yearly_pattern_detection
   - Multi-year data with annual cycle
   - Verify monthly seasonality
   - Check festival integration

5. test_no_seasonality
   - Random data without patterns
   - Verify correct "not detected"
   - Check strength score low

6. test_multiple_seasonalities
   - Data with weekly + yearly patterns
   - Verify both detected
   - Check independent extraction

7. test_insufficient_data_weekly
   - < 14 days of data
   - Verify appropriate handling
   - Check error message

8. test_insufficient_data_yearly
   - < 365 days of data
   - Verify warning/skip
   - Check graceful degradation
```

### TrendAnalyzer Tests

```
Test Cases for Trend:

1. test_trend_initialization
   - Verify class setup
   - Check configuration

2. test_linear_upward_trend
   - Synthetic linear growth data
   - Verify slope calculation
   - Check R² and p-value

3. test_linear_downward_trend
   - Synthetic decline data
   - Verify negative slope
   - Check significance

4. test_no_trend_stable
   - Flat data around mean
   - Verify slope ≈ 0
   - Check "stable" classification

5. test_trend_direction_up
   - trend_coefficient = 0.411
   - Verify "up" classification
   - Check strength level

6. test_trend_direction_down
   - trend_coefficient = -0.325
   - Verify "down" classification
   - Check confidence

7. test_trend_direction_stable
   - trend_coefficient = 0.03
   - Verify "stable" classification
   - Check threshold logic

8. test_trend_projection
   - Calculate trend
   - Project 30 days ahead
   - Verify projection values
   - Check confidence intervals
```

### Integration Tests

```
End-to-End Pipeline Tests:

1. test_full_pipeline_happy_path
   - Extract daily sales (1 year)
   - Clean data (handle missing, outliers)
   - Detect weekly seasonality
   - Analyze trend
   - Verify all components work together

2. test_pipeline_with_poor_data
   - Data with 30% missing
   - 10% outliers
   - Verify cleaning improves quality
   - Check final output valid

3. test_pipeline_minimal_data
   - 30 days of data
   - Should skip yearly seasonality
   - Detect weekly if possible
   - Calculate trend

4. test_pipeline_output_compatibility
   - Run full pipeline
   - Verify outputs can be JSON serialized
   - Check all required fields present
   - Validate data types

5. test_pipeline_with_real_data
   - Use actual sales data from test database
   - Run full analysis
   - Verify realistic patterns detected
   - Check no errors or crashes
```

### Edge Case Tests

```
Edge Case Scenarios:

1. test_all_zero_sales
   - All values = 0
   - Verify no division by zero
   - Check appropriate handling

2. test_all_identical_values
   - All values = 100
   - Verify no trend detected
   - Check no seasonality found

3. test_single_data_point
   - Only 1 day of data
   - Verify graceful failure
   - Check error messages

4. test_extreme_outlier
   - Value 1000× normal
   - Verify detection and handling
   - Check doesn't break pipeline

5. test_negative_sales
   - Some negative values (returns)
   - Verify handling
   - Check calculations adjust

6. test_date_discontinuity
   - Large gap (30+ days missing)
   - Verify detection
   - Check imputation or skip

7. test_future_dates
   - Dates in the future
   - Verify rejection or adjustment
   - Check validation
```

### Performance Tests

```
Performance Benchmarks:

1. test_performance_daily_extraction
   - Extract 2 years (730 days)
   - Measure execution time
   - Target: < 500ms

2. test_performance_cleaning
   - Clean 1000 data points
   - Measure time
   - Target: < 200ms

3. test_performance_seasonality
   - Detect patterns in 2 years data
   - Measure time
   - Target: < 1000ms (STL is slow)

4. test_performance_trend
   - Calculate trend on 1000 points
   - Measure time
   - Target: < 100ms

5. test_memory_usage
   - Process large dataset (10K points)
   - Monitor memory
   - Check for leaks

6. test_caching_speedup
   - First call (no cache)
   - Second call (cached)
   - Verify speedup > 10×
```

### Validation Tests

```
Output Format Validation:

1. test_extractor_output_format
   - Check DataFrame columns
   - Verify data types
   - Check index type

2. test_cleaner_output_format
   - Check metadata columns added
   - Verify report structure
   - Check all fields present

3. test_seasonality_output_format
   - Check dictionary structure
   - Verify all pattern types
   - Check nested fields

4. test_trend_output_format
   - Check all metrics present
   - Verify projection structure
   - Check confidence intervals

5. test_json_serializability
   - Convert all outputs to JSON
   - Verify no serialization errors
   - Check datetime handling
```

### Verification Report Template

```
Data Processing Pipeline Verification Report
============================================

Execution Date: 2026-01-31
Test Suite Version: 1.0

Component Test Results:
-----------------------
SalesDataExtractor:  25/25 passed ✓
DataCleaner:        28/28 passed ✓
SeasonalityDetector: 22/22 passed ✓
TrendAnalyzer:      24/24 passed ✓
Integration Tests:   12/12 passed ✓
Edge Cases:         15/15 passed ✓
Performance:        6/6 passed ✓

Total: 132/132 tests passed (100%)

Performance Metrics:
-------------------
Daily Extraction (730 days):     342ms ✓
Data Cleaning (1000 points):     156ms ✓
Seasonality Detection (2 years): 892ms ✓
Trend Calculation (1000 points): 78ms ✓

Memory Usage:
------------
Peak Memory: 142 MB ✓
No leaks detected ✓

Issues Found: None

Recommendations:
----------------
1. All components working correctly
2. Pipeline ready for production use
3. Consider adding more festival dates to calendar
4. Monitor cache hit rates in production

Signed off by: AI Testing System
```

### Sample Test Implementation

```
Example: test_full_pipeline_happy_path

Purpose: Verify entire pipeline works end-to-end

Steps:
1. Create synthetic data (365 days)
   - Linear upward trend (+0.5/day)
   - Weekly seasonality (Sat peak)
   - Some noise and outliers

2. Initialize components
   - SalesDataExtractor
   - DataCleaner
   - SeasonalityDetector
   - TrendAnalyzer

3. Run pipeline
   - Extract daily sales
   - Clean data (impute, remove outliers, smooth)
   - Detect weekly seasonality
   - Calculate trend
   - Classify trend direction

4. Verify outputs
   - Extraction: 365 rows, correct columns
   - Cleaning: Quality score > 0.8
   - Seasonality: Weekly detected, strength > 0.6
   - Trend: "up", slope ≈ 0.5, significant

5. Check integration
   - All outputs compatible
   - No data loss between steps
   - Final output complete

Expected Result: All assertions pass, pipeline executes without errors
```

### Expected Outcome
- Comprehensive test suite covering all components
- Integration tests validating end-to-end pipeline
- Edge case tests ensuring robustness
- Performance tests confirming efficiency
- Output format validation for consistency
- Verification report documenting results
- Production-ready data processing pipeline
- Confidence in system reliability

### Verification Checklist
- [ ] Test suite created in appropriate directory
- [ ] SalesDataExtractor tests (8+ test cases) passing
- [ ] DataCleaner tests (8+ test cases) passing
- [ ] SeasonalityDetector tests (8+ test cases) passing
- [ ] TrendAnalyzer tests (8+ test cases) passing
- [ ] Integration tests (5+ test cases) passing
- [ ] Edge case tests (7+ test cases) passing
- [ ] Performance tests (6+ test cases) passing
- [ ] Output format validation tests passing
- [ ] All 100+ tests passing
- [ ] Verification report generated
- [ ] No critical issues identified
- [ ] System approved for production use

---

## Summary

This document established the seasonality detection and trend analysis infrastructure for demand forecasting. Created the SeasonalityDetector class with methods for identifying weekly, monthly, and yearly patterns using STL decomposition, FFT, and autocorrelation. Created the TrendAnalyzer class with methods for calculating trends, classifying trend direction, and projecting future values. Completed comprehensive verification testing of the entire data processing pipeline.

### Completed Tasks
1. ✓ Created SeasonalityDetector class with STL, FFT, and ACF methods
2. ✓ Implemented detect_weekly with day-of-week factors and ANOVA testing
3. ✓ Implemented detect_monthly with period analysis and pay day detection
4. ✓ Implemented detect_yearly with festival calendar integration
5. ✓ Created TrendAnalyzer class with multiple trend extraction methods
6. ✓ Implemented calculate_trend with linear regression and projections
7. ✓ Implemented trend_direction with categorical classification
8. ✓ Verified entire data processing pipeline with comprehensive tests

### Next Steps
Proceed to [Group-C_Festival-Calendar](../Group-C_Festival-Calendar/) to create the festival calendar system for Sri Lankan holidays and special events, integrating with the seasonality detection for improved forecasting accuracy.
