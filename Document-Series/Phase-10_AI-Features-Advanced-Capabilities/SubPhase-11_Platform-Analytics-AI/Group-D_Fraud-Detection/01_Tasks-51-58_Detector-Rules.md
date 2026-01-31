# Tasks 51-58: Detector Rules

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 11 - Platform Analytics AI  
> **Group:** D - Fraud Detection  
> **Document:** 01 of 02  
> **Tasks Covered:** 51-58 (8 tasks)

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Anomaly-Detection/](../Group-C_Anomaly-Detection/)
- **→ Next Document:** [02_Tasks-59-66_Features-API.md](02_Tasks-59-66_Features-API.md)

---

## Document Overview

This document covers the core fraud detection engine implementation - FraudDetector class, rule-based detection systems, and machine learning fraud model. The system uses a hybrid approach combining rule-based checks with ML predictions to provide comprehensive fraud detection capabilities.

### Tasks Summary Table

| Task | Title | Priority | Component | Description |
|------|-------|----------|-----------|-------------|
| 51 | FraudDetector Class | Medium | FraudDetector | Main detection engine class |
| 52 | Fraud Rules | Medium | RuleEngine | Rule-based detection framework |
| 53 | Velocity Check | Medium | VelocityRule | Transaction rate limits |
| 54 | Amount Check | Low | AmountRule | Unusual amount detection |
| 55 | Pattern Check | Medium | PatternRule | Suspicious pattern detection |
| 56 | IP Check | Medium | IPRule | IP reputation checking |
| 57 | Device Check | Medium | DeviceRule | Device fingerprint analysis |
| 58 | ML Fraud Model | High | MLModel | Machine learning fraud detection |

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Django | Backend framework |
| ML Library | scikit-learn | Random Forest model |
| Fingerprinting | FingerprintJS | Device identification |
| IP Geolocation | MaxMind GeoIP | Location verification |
| Database | PostgreSQL | Data storage |
| Cache | Redis | Rule result caching |

---

## Architecture Overview

### Fraud Detection Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FRAUD DETECTION ENGINE                        │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                            ┌─────▼─────┐
                            │Transaction│
                            │   Input   │
                            └─────┬─────┘
                                  │
                            ┌─────▼─────┐
                            │ Fraud     │
                            │ Detector  │
                            └─┬───────┬─┘
                              │       │
                   ┌──────────▼─┐   ┌─▼──────────┐
                   │ Rule-Based │   │ ML-Based   │
                   │  Checks    │   │ Prediction │
                   └──────┬─────┘   └─┬──────────┘
                          │           │
        ┌─────────────────┼───────────┼─────────────────┐
        │                 │           │                 │
   ┌────▼───┐ ┌────▼───┐ ┌▼───┐ ┌───▼┐ ┌────▼───┐ ┌───▼─┐
   │Velocity│ │ Amount │ │Pat │ │ IP │ │ Device │ │ ML  │
   │ Check  │ │ Check  │ │Chk │ │Chk │ │ Check  │ │Model│
   └────┬───┘ └────┬───┘ └┬───┘ └┬───┘ └────┬───┘ └───┬─┘
        │          │      │      │          │         │
        └──────────┼──────┼──────┼──────────┼─────────┘
                   │      │      │          │
                 ┌─▼──────▼──────▼──────────▼─┐
                 │      Risk Scorer          │
                 └─┬────────────────────────┬─┘
                   │                        │
              ┌────▼────┐              ┌────▼────┐
              │ Risk    │              │ Action  │
              │ Score   │              │Decision │
              │ 0-100   │              │         │
              └─────────┘              └─────────┘
```

### Component Hierarchy

```
FraudDetector (Main Engine)
├── RuleEngine
│   ├── VelocityRule (Task 53)
│   ├── AmountRule (Task 54)
│   ├── PatternRule (Task 55)
│   ├── IPRule (Task 56)
│   └── DeviceRule (Task 57)
├── MLFraudModel (Task 58)
│   ├── FeatureExtractor
│   ├── RandomForestClassifier
│   └── PredictionScorer
└── RiskScorer
    ├── RuleResultCombiner
    └── MLResultCombiner
```

### Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Transaction │────▶│   Rules     │────▶│  Risk       │
│    Data     │     │  Engine     │     │ Combiner    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Feature    │     │  Rule       │     │   Final     │
│ Extraction  │     │ Results     │     │ Risk Score  │
│             │     │             │     │             │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ ML Model    │────▶│ ML Score    │
│ Prediction  │     │   0-100     │
└─────────────┘     └─────────────┘
```

---

## Expected Deliverables

### File Structure

```
backend/
└── apps/
    └── platform_analytics/
        ├── models/
        │   ├── __init__.py
        │   └── fraud_models.py           # ML model storage
        └── analytics/
            ├── __init__.py
            ├── fraud_detector.py          # Task 51
            ├── rules/
            │   ├── __init__.py
            │   ├── base_rule.py          # Task 52
            │   ├── velocity_rule.py      # Task 53
            │   ├── amount_rule.py        # Task 54
            │   ├── pattern_rule.py       # Task 55
            │   ├── ip_rule.py            # Task 56
            │   └── device_rule.py        # Task 57
            └── ml/
                ├── __init__.py
                ├── fraud_model.py         # Task 58
                └── feature_extractor.py
```

---

## Task 51: Create FraudDetector Class

> **Priority:** Medium | **Component:** FraudDetector | **Access:** System Internal

### Objective

Create the main fraud detection engine class that orchestrates rule-based checks and machine learning predictions to provide comprehensive fraud detection capabilities.

### Class Architecture

| Component | Responsibility | Dependencies |
|-----------|----------------|--------------|
| FraudDetector | Main orchestration | RuleEngine, MLModel |
| RuleEngine | Execute rule checks | Individual rules |
| MLModel | ML-based detection | Feature extractor |
| RiskScorer | Combine scores | Rule and ML results |

### Detection Process Flow

```
detect(transaction) → RiskResult
1. Extract features from transaction
2. Run all fraud rules in parallel
3. Execute ML model prediction
4. Combine rule and ML scores
5. Return risk assessment with details
```

### Implementation Instructions

1. **Create FraudDetector Class**
   - Create fraud_detector.py in analytics module
   - Implement singleton pattern for model loading
   - Add detect() method as main entry point
   - Include caching for repeated transactions

2. **Design RiskResult Structure**
   - Include overall risk score (0-100)
   - List triggered rules with scores
   - ML prediction confidence
   - Recommended action (allow/review/block)
   - Detailed breakdown for admin review

3. **Implement Configuration System**
   - Support rule threshold customization
   - ML model weight adjustment
   - Rule enable/disable flags
   - Per-tenant configuration overrides

4. **Add Performance Monitoring**
   - Track detection latency
   - Monitor rule execution time
   - Log ML model performance
   - Alert on detection failures

### Class Interface

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| detect | transaction_data | RiskResult | Main detection method |
| configure | config_dict | None | Update configuration |
| get_stats | None | StatsDict | Performance statistics |
| reload_model | None | bool | Reload ML model |

### Acceptance Criteria

- [ ] FraudDetector class processes transactions correctly
- [ ] RiskResult contains all required fields
- [ ] Configuration system allows rule customization
- [ ] Performance monitoring tracks key metrics
- [ ] Error handling prevents detection failures

---

## Task 52: Create Fraud Rules

> **Priority:** Medium | **Component:** RuleEngine | **Type:** Framework

### Objective

Create a flexible rule-based fraud detection framework that supports multiple rule types with consistent interfaces and configurable thresholds.

### Rule Framework Design

| Component | Purpose | Interface |
|-----------|---------|-----------|
| BaseRule | Abstract rule interface | execute(transaction) |
| RuleEngine | Rule orchestration | run_rules(transaction) |
| RuleConfig | Configuration management | get_threshold(rule_name) |
| RuleResult | Standardized result | score, reason, confidence |

### Rule Types Hierarchy

```
BaseRule (Abstract)
├── VelocityRule (Task 53)
├── AmountRule (Task 54)
├── PatternRule (Task 55)
├── IPRule (Task 56)
└── DeviceRule (Task 57)
```

### Implementation Instructions

1. **Create BaseRule Abstract Class**
   - Define execute() abstract method
   - Include rule metadata (name, description)
   - Add configuration property access
   - Implement result standardization

2. **Build RuleEngine Orchestrator**
   - Manage rule registry and execution
   - Support parallel rule execution
   - Handle rule exceptions gracefully
   - Aggregate rule results with weights

3. **Design Rule Configuration**
   - JSON-based rule configuration
   - Per-tenant rule customization
   - Runtime threshold updates
   - Rule enable/disable controls

4. **Implement Result Aggregation**
   - Weight-based score combination
   - Confidence level calculation
   - Triggered rule tracking
   - Detailed explanation generation

### Rule Configuration Schema

| Field | Type | Description |
|-------|------|-------------|
| name | string | Rule identifier |
| enabled | boolean | Enable/disable flag |
| weight | float | Rule importance (0-1) |
| threshold | float | Trigger threshold |
| config | object | Rule-specific settings |

### Acceptance Criteria

- [ ] BaseRule provides consistent interface
- [ ] RuleEngine executes all rules correctly
- [ ] Configuration system supports customization
- [ ] Result aggregation weights rules properly
- [ ] Error handling isolates rule failures

---

## Task 53: Create Velocity Check

> **Priority:** Medium | **Component:** VelocityRule | **Type:** Time-Based Rule

### Objective

Implement velocity-based fraud detection that monitors transaction frequency patterns to identify suspicious rapid-fire transaction attempts.

### Velocity Thresholds

| Time Window | Limit | Action | Risk Level |
|-------------|-------|--------|------------|
| 1 minute | 3 transactions | Review | Medium |
| 5 minutes | 8 transactions | Review | Medium |
| 1 hour | 20 transactions | Block | High |
| 1 day | 100 transactions | Block | High |

### Velocity Types

| Type | Description | Threshold |
|------|-------------|-----------|
| User Velocity | Same user ID | Standard |
| Card Velocity | Same payment method | Standard |
| IP Velocity | Same IP address | 2x standard |
| Device Velocity | Same device fingerprint | 1.5x standard |

### Implementation Instructions

1. **Create VelocityRule Class**
   - Extend BaseRule abstract class
   - Implement time-window tracking
   - Support multiple velocity types
   - Use Redis for transaction counting

2. **Design Time Window Logic**
   - Sliding window implementation
   - Efficient Redis key structure
   - Automatic expiration handling
   - Multi-window threshold checking

3. **Implement Velocity Tracking**
   - Track by user, card, IP, device
   - Increment counters atomically
   - Handle Redis connection failures
   - Support velocity reset commands

4. **Add Adaptive Thresholds**
   - Adjust limits based on user behavior
   - Consider account age and history
   - Apply business type multipliers
   - Support manual threshold overrides

### Redis Key Schema

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| vel:user:{id}:{window} | Window size | User velocity |
| vel:card:{hash}:{window} | Window size | Card velocity |
| vel:ip:{ip}:{window} | Window size | IP velocity |
| vel:device:{fp}:{window} | Window size | Device velocity |

### Acceptance Criteria

- [ ] Velocity tracking works across time windows
- [ ] Multiple velocity types are monitored
- [ ] Redis operations are atomic and efficient
- [ ] Adaptive thresholds adjust correctly
- [ ] Failed Redis operations don't block detection

---

## Task 54: Create Amount Check

> **Priority:** Low | **Component:** AmountRule | **Type:** Statistical Rule

### Objective

Implement amount-based fraud detection that identifies unusual transaction amounts based on user history and statistical analysis.

### Amount Anomaly Types

| Anomaly | Detection Method | Threshold | Risk |
|---------|------------------|-----------|------|
| Unusually Large | Z-score > 3.0 | User average | High |
| Round Numbers | Pattern matching | >80% rounds | Medium |
| Exact Limits | Near card/account limits | >95% limit | High |
| Micro Amounts | Below $1.00 | Testing pattern | Low |

### Statistical Analysis

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| User Average | 30-day rolling mean | Baseline amount |
| Standard Deviation | 30-day rolling std | Variability measure |
| Z-Score | (amount - mean) / std | Anomaly detection |
| Percentile Rank | Amount vs. history | Relative position |

### Implementation Instructions

1. **Create AmountRule Class**
   - Extend BaseRule for consistency
   - Implement statistical calculations
   - Cache user statistics in Redis
   - Support multiple amount checks

2. **Build Statistics Engine**
   - Calculate rolling statistics
   - Handle new users gracefully
   - Update statistics incrementally
   - Support manual statistic reset

3. **Implement Pattern Detection**
   - Round number pattern matching
   - Limit testing detection
   - Micro-transaction identification
   - Suspicious amount sequences

4. **Add Contextual Analysis**
   - Consider transaction category
   - Account for seasonal patterns
   - Apply merchant-type adjustments
   - Support currency differences

### Amount Flags Configuration

| Flag | Condition | Score Weight |
|------|-----------|--------------|
| LARGE_AMOUNT | Z-score > 3.0 | 0.8 |
| ROUND_PATTERN | >5 round numbers | 0.4 |
| LIMIT_TESTING | Near max limit | 0.9 |
| MICRO_AMOUNT | <$1.00 | 0.2 |

### Acceptance Criteria

- [ ] Statistical calculations are accurate
- [ ] Pattern detection identifies anomalies
- [ ] User statistics are cached efficiently
- [ ] New users are handled properly
- [ ] Amount flags generate appropriate scores

---

## Task 55: Create Pattern Check

> **Priority:** Medium | **Component:** PatternRule | **Type:** Behavioral Rule

### Objective

Implement pattern-based fraud detection that identifies suspicious behavioral patterns in transaction sequences and user activity.

### Pattern Types

| Pattern | Description | Detection Window | Risk Level |
|---------|-------------|------------------|------------|
| Rapid Sequence | Same amount repeatedly | 1 hour | High |
| Sequential | Incrementing amounts | 2 hours | Medium |
| Product Focus | Single product type | 1 day | Medium |
| Time Clustering | Specific time patterns | 1 week | Low |

### Pattern Detection Logic

```
Pattern Analysis Flow:
1. Collect recent transaction history
2. Analyze amount sequences
3. Check product/category patterns
4. Evaluate timing patterns
5. Calculate pattern risk score
```

### Implementation Instructions

1. **Create PatternRule Class**
   - Extend BaseRule framework
   - Implement pattern detection algorithms
   - Support multiple pattern types
   - Use sliding window analysis

2. **Build Sequence Analyzer**
   - Track transaction sequences
   - Identify repetitive patterns
   - Detect mathematical progressions
   - Flag unusual clustering

3. **Implement Category Analysis**
   - Monitor product category focus
   - Detect unusual purchasing behavior
   - Track merchant type patterns
   - Flag single-category binges

4. **Add Temporal Pattern Detection**
   - Analyze transaction timing
   - Detect unusual time clustering
   - Monitor day/night patterns
   - Flag off-hours activity

### Pattern Detection Algorithms

| Algorithm | Purpose | Threshold |
|-----------|---------|-----------|
| Sequence Matching | Repeated amounts | 3+ identical |
| Progression Detection | Incremental amounts | 5+ sequential |
| Category Clustering | Product focus | 90%+ same type |
| Time Clustering | Temporal patterns | 80%+ same period |

### Acceptance Criteria

- [ ] Pattern detection algorithms work correctly
- [ ] Multiple pattern types are analyzed
- [ ] Sliding window analysis is efficient
- [ ] Pattern scores reflect risk levels
- [ ] False positives are minimized

---

## Task 56: Create IP Check

> **Priority:** Medium | **Component:** IPRule | **Type:** Geolocation Rule

### Objective

Implement IP-based fraud detection that analyzes IP reputation, geolocation, and usage patterns to identify suspicious network activity.

### IP Risk Categories

| Category | Description | Data Source | Risk Level |
|----------|-------------|-------------|------------|
| VPN/Proxy | Anonymous networks | IP database | Medium |
| Tor Exit | Tor network endpoints | Tor lists | High |
| Blacklisted | Known fraud IPs | Threat feeds | High |
| Geographic | Unusual locations | GeoIP | Low-Medium |

### Geolocation Analysis

| Check | Threshold | Action |
|-------|-----------|--------|
| Country Change | Different country | Flag |
| Distance Jump | >500 miles | Review |
| Impossible Travel | Speed >1000mph | Block |
| High-Risk Country | Fraud-prone regions | Review |

### Implementation Instructions

1. **Create IPRule Class**
   - Extend BaseRule for consistency
   - Integrate MaxMind GeoIP database
   - Implement reputation checking
   - Cache IP analysis results

2. **Build IP Reputation Engine**
   - Check VPN/Proxy databases
   - Monitor Tor exit nodes
   - Validate against blacklists
   - Score IP reputation

3. **Implement Geolocation Logic**
   - Track user location history
   - Calculate travel distances
   - Detect impossible travel
   - Flag country changes

4. **Add IP Intelligence**
   - Identify hosting providers
   - Detect residential vs. commercial
   - Monitor IP age and history
   - Track IP sharing patterns

### IP Database Integration

| Database | Purpose | Update Frequency |
|----------|---------|------------------|
| MaxMind GeoIP2 | Geolocation | Monthly |
| VPN/Proxy Lists | Anonymous detection | Weekly |
| Threat Intel Feeds | Fraud IP lists | Daily |
| Tor Node Lists | Tor detection | Real-time |

### Acceptance Criteria

- [ ] IP reputation checking works accurately
- [ ] Geolocation analysis detects anomalies
- [ ] Travel logic calculates correctly
- [ ] Database integration updates properly
- [ ] Caching improves performance

---

## Task 57: Create Device Check

> **Priority:** Medium | **Component:** DeviceRule | **Type:** Fingerprinting Rule

### Objective

Implement device-based fraud detection using device fingerprinting to identify suspicious device patterns and behavior.

### Device Fingerprinting Elements

| Element | Description | Weight | Stability |
|---------|-------------|--------|-----------|
| User Agent | Browser/OS info | 0.3 | Medium |
| Screen Resolution | Display size | 0.2 | High |
| Timezone | Local timezone | 0.1 | High |
| Language | Browser language | 0.1 | High |
| Canvas Fingerprint | Canvas rendering | 0.3 | Very High |

### Device Risk Factors

| Factor | Description | Risk Level |
|--------|-------------|------------|
| New Device | First-time device | Low |
| Multiple Devices | >10 devices per user | Medium |
| Emulator | Virtual device | High |
| Fingerprint Spoofing | Inconsistent data | High |

### Implementation Instructions

1. **Create DeviceRule Class**
   - Extend BaseRule framework
   - Integrate FingerprintJS
   - Implement device tracking
   - Store device fingerprints

2. **Build Device Database**
   - Store unique device fingerprints
   - Track device first-seen dates
   - Monitor device-user associations
   - Detect device sharing patterns

3. **Implement Anomaly Detection**
   - Identify new devices
   - Count devices per user
   - Detect emulator signatures
   - Flag fingerprint inconsistencies

4. **Add Device Intelligence**
   - Classify device types
   - Track device reputation
   - Monitor device behavior
   - Detect automation tools

### Device Fingerprint Storage

| Field | Type | Description |
|-------|------|-------------|
| fingerprint_hash | string | Unique device ID |
| user_id | string | Associated user |
| first_seen | datetime | First appearance |
| last_seen | datetime | Latest activity |
| trust_score | float | Device reputation |
| metadata | json | Device details |

### Acceptance Criteria

- [ ] Device fingerprinting works consistently
- [ ] Device database tracks accurately
- [ ] Anomaly detection identifies risks
- [ ] Performance remains acceptable
- [ ] Privacy requirements are met

---

## Task 58: Create ML Fraud Model

> **Priority:** High | **Component:** MLFraudModel | **Type:** Machine Learning

### Objective

Implement a machine learning fraud detection model using Random Forest algorithm to provide intelligent fraud predictions based on transaction features.

### Model Architecture

| Component | Technology | Purpose |
|-----------|------------|---------|
| Algorithm | Random Forest | Classification |
| Features | 15+ attributes | Input data |
| Training | Historical data | Model learning |
| Prediction | Real-time | Fraud probability |

### Feature Categories

| Category | Features | Count |
|----------|----------|-------|
| Transaction | Amount, category, time | 4 |
| User | History, behavior | 3 |
| Device | Fingerprint, reputation | 2 |
| Network | IP, location | 3 |
| Velocity | Rate metrics | 3 |

### Implementation Instructions

1. **Create MLFraudModel Class**
   - Use scikit-learn RandomForestClassifier
   - Implement feature preprocessing
   - Add prediction probability output
   - Support model serialization

2. **Build Feature Pipeline**
   - Extract features from transactions
   - Handle missing values
   - Scale numerical features
   - Encode categorical variables

3. **Implement Model Training**
   - Load historical transaction data
   - Split into train/validation sets
   - Train Random Forest model
   - Evaluate model performance

4. **Add Prediction Engine**
   - Real-time feature extraction
   - Model prediction scoring
   - Probability calibration
   - Result interpretation

### Model Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| n_estimators | 100 | Number of trees |
| max_depth | 10 | Tree depth limit |
| min_samples_split | 20 | Split threshold |
| class_weight | balanced | Handle imbalanced data |

### Acceptance Criteria

- [ ] ML model trains successfully
- [ ] Feature extraction works correctly
- [ ] Predictions return probabilities
- [ ] Model performance meets requirements
- [ ] Real-time scoring is fast enough