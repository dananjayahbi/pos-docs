# Tasks 01-08: Dependencies and Settings

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 01 - AI Infrastructure Setup  
> **Group:** A - ML Dependencies & Config  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Django-AI-App.md](02_Tasks-09-16_Django-AI-App.md)
- **← Previous Phase:** [../../../Phase-09_Integrations-Sri-Lanka-Localizations/](../../../Phase-09_Integrations-Sri-Lanka-Localizations/)

---

## Document Overview

This document covers the foundational setup of machine learning dependencies and configuration settings for the AI infrastructure. It establishes the core ML libraries, creates requirements specifications, and configures essential Django settings for AI functionality. This foundation enables all subsequent AI features including recommendation engines, demand forecasting, and intelligent search capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create ML Requirements | Low | 15 min |
| 02 | Install scikit-learn | Low | 10 min |
| 03 | Install PyTorch | Medium | 20 min |
| 04 | Install Sentence Transformers | Medium | 15 min |
| 05 | Install numpy/pandas | Low | 10 min |
| 06 | Create ML Settings | Medium | 25 min |
| 07 | Create ML_MODEL_PATH | Low | 10 min |
| 08 | Create FEATURE_STORE_BACKEND | Medium | 15 min |

---

## ML Infrastructure Architecture

### Dependencies Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                ML Dependencies Stack                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐    ┌─────────────────────┐  │
│  │    Core ML       │    │   Deep Learning     │  │
│  │                  │    │                     │  │
│  │  • scikit-learn  │    │  • PyTorch          │  │
│  │  • numpy         │    │  • torchvision      │  │
│  │  • pandas        │    │  • torchaudio       │  │
│  │  • scipy         │    │                     │  │
│  └──────────────────┘    └─────────────────────┘  │
│                                                     │
│  ┌──────────────────┐    ┌─────────────────────┐  │
│  │  Text Processing │    │   Feature Store     │  │
│  │                  │    │                     │  │
│  │  • transformers  │    │  • feast           │  │
│  │  • sentence-     │    │  • redis           │  │
│  │    transformers  │    │  • postgresql      │  │
│  │  • tokenizers    │    │                     │  │
│  └──────────────────┘    └─────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Settings Configuration Structure

| Component | Purpose | Configuration |
|-----------|---------|---------------|
| **ML_MODEL_PATH** | Model storage location | File system path for trained models |
| **FEATURE_STORE_BACKEND** | Feature data storage | Database backend for ML features |
| **MODEL_REGISTRY_BACKEND** | Model versioning | MLflow integration settings |
| **AI_CACHE_TIMEOUT** | Performance optimization | Cache duration for AI computations |
| **ML_LOGGING_LEVEL** | Debug and monitoring | Logging configuration for ML ops |

---

## Task 01: Create ML Requirements

### Overview
Create a comprehensive requirements file specifically for machine learning dependencies, separate from the main Django requirements to enable modular AI feature deployment.

### Dependencies
- Main project requirements.txt (Phase 01, SubPhase 02)
- Python virtual environment setup

### Instructions

#### 1. Create ML Requirements File Structure
- Navigate to the project root directory
- Create new file named `requirements-ml.txt`
- Structure the file with clear sections for different ML categories
- Add version pinning for stability in production environments

#### 2. Define Core ML Libraries
- Specify scikit-learn version for traditional ML algorithms
- Include numpy and pandas for data manipulation
- Add scipy for scientific computing functions
- Pin versions to ensure consistent behavior across environments

#### 3. Add Deep Learning Dependencies
- Include PyTorch with CPU/CUDA options
- Add torchvision for computer vision tasks
- Include torchaudio for potential audio processing
- Specify compatible versions that work together

#### 4. Configure Text Processing Libraries
- Add sentence-transformers for text embeddings
- Include transformers library for NLP models
- Add tokenizers for text preprocessing
- Ensure compatibility with PyTorch versions

#### 5. Feature Store Dependencies
- Include feast for feature store functionality
- Add redis for feature caching
- Include psycopg2 for PostgreSQL integration
- Add necessary database drivers

### Purpose Table

| Library Category | Primary Use Case | Business Value |
|------------------|------------------|----------------|
| **Traditional ML** | Product recommendations, demand forecasting | Proven algorithms with fast training |
| **Deep Learning** | Complex pattern recognition, text analysis | Advanced AI capabilities |
| **Text Processing** | Search, chatbot, content analysis | Multi-language support including Sinhala |
| **Feature Store** | Centralized feature management | Consistent ML pipeline operations |

### Expected Outcome
- Complete `requirements-ml.txt` file with pinned versions
- Clear documentation of ML dependencies
- Modular installation capability for AI features
- Version compatibility ensured across all libraries

### Verification Checklist
- [ ] requirements-ml.txt file created in project root
- [ ] All ML libraries specified with version numbers
- [ ] File includes clear section comments
- [ ] Dependencies organized by functionality
- [ ] Version compatibility verified between libraries

---

## Task 02: Install scikit-learn

### Overview
Install scikit-learn library for traditional machine learning algorithms including classification, regression, clustering, and preprocessing capabilities essential for ERP analytics.

### Dependencies
- Python virtual environment active
- pip package manager available
- requirements-ml.txt created (Task 01)

### Instructions

#### 1. Prepare Installation Environment
- Activate the project virtual environment
- Update pip to latest version for compatibility
- Ensure sufficient disk space for ML libraries
- Check Python version compatibility (3.8+ recommended)

#### 2. Install scikit-learn Package
- Use pip to install scikit-learn with specific version
- Monitor installation progress for any conflicts
- Verify successful installation with import test
- Check installed version matches requirements specification

#### 3. Verify Core Functionality
- Test basic scikit-learn imports
- Verify key modules are accessible
- Check for any missing dependencies
- Confirm no import errors in Django environment

#### 4. Configure for Django Integration
- Test scikit-learn imports within Django settings
- Verify compatibility with existing Django packages
- Check memory usage implications
- Ensure thread safety for web application use

### Algorithm Categories Available

| Category | Algorithms | ERP Use Cases |
|----------|------------|---------------|
| **Classification** | SVM, Random Forest, Logistic Regression | Customer segmentation, fraud detection |
| **Regression** | Linear, Ridge, Lasso | Sales forecasting, price optimization |
| **Clustering** | K-Means, DBSCAN | Product grouping, customer analysis |
| **Preprocessing** | Scaling, Encoding | Data preparation, feature engineering |

### Expected Outcome
- scikit-learn successfully installed and verified
- All core modules accessible for import
- No conflicts with existing Django packages
- Ready for ML algorithm implementation

### Verification Checklist
- [ ] scikit-learn installed without errors
- [ ] Version matches requirements specification
- [ ] Basic import test successful
- [ ] Core algorithms accessible
- [ ] No conflicts with Django environment

---

## Task 03: Install PyTorch

### Overview
Install PyTorch deep learning framework for advanced AI capabilities including neural networks, text processing, and computer vision features in the ERP system.

### Dependencies
- scikit-learn installed (Task 02)
- CUDA drivers (optional, for GPU acceleration)
- Sufficient system memory (4GB+ recommended)

### Instructions

#### 1. Determine Installation Configuration
- Check system specifications for CPU/GPU capabilities
- Decide on CUDA version compatibility if GPU available
- Select appropriate PyTorch installation command
- Verify system memory requirements

#### 2. Install PyTorch Package
- Use official PyTorch installation command
- Choose CPU-only or CUDA-enabled version
- Monitor installation progress and disk usage
- Install torchvision and torchaudio if needed

#### 3. Verify Installation
- Test basic PyTorch tensor operations
- Verify CUDA availability if GPU installed
- Check PyTorch version and capabilities
- Test integration with existing Python environment

#### 4. Configure for Production
- Set appropriate memory limits for web deployment
- Configure thread settings for Django compatibility
- Test model loading and inference capabilities
- Verify serialization/deserialization functionality

### PyTorch Components

| Component | Purpose | ERP Integration |
|-----------|---------|-----------------|
| **torch** | Core tensor operations | Feature processing, model inference |
| **torchvision** | Computer vision | Product image analysis |
| **torchaudio** | Audio processing | Voice commands (future) |
| **torch.nn** | Neural networks | Deep learning models |

### Expected Outcome
- PyTorch installed with appropriate configuration
- GPU support enabled if hardware available
- Basic tensor operations working correctly
- Ready for deep learning model development

### Verification Checklist
- [ ] PyTorch installed successfully
- [ ] Version compatibility confirmed
- [ ] Basic tensor operations working
- [ ] CUDA support verified (if applicable)
- [ ] No memory or performance issues

---

## Task 04: Install Sentence Transformers

### Overview
Install sentence-transformers library for generating semantic embeddings of text content, enabling intelligent search, content similarity, and multilingual processing capabilities.

### Dependencies
- PyTorch installed (Task 03)
- transformers library compatibility
- Internet connection for model downloads
- Additional storage for pre-trained models

### Instructions

#### 1. Install Core Package
- Install sentence-transformers using pip
- Verify transformers library compatibility
- Check for additional dependencies installation
- Monitor download of default models

#### 2. Download Essential Models
- Download multilingual sentence transformer model
- Install English language model for primary features
- Consider Sinhala-compatible models for localization
- Configure model caching directory

#### 3. Test Model Loading
- Test loading of pre-trained models
- Verify embedding generation functionality
- Check model inference performance
- Test batch processing capabilities

#### 4. Configure for Production
- Set model cache directory in Django settings
- Configure memory limits for model inference
- Test concurrent model access
- Optimize model loading for web deployment

### Model Capabilities

| Model Type | Languages | Use Case |
|------------|-----------|----------|
| **Multilingual** | 100+ languages | International product search |
| **English** | English only | Primary content processing |
| **Domain-Specific** | Various | Specialized embeddings |
| **Lightweight** | Various | Mobile/edge deployment |

### Expected Outcome
- Sentence transformers installed and configured
- Essential models downloaded and cached
- Embedding generation working correctly
- Ready for semantic search implementation

### Verification Checklist
- [ ] sentence-transformers installed successfully
- [ ] Default models downloaded
- [ ] Embedding generation working
- [ ] Model caching configured
- [ ] Performance acceptable for production

---

## Task 05: Install numpy/pandas

### Overview
Install numpy and pandas libraries for efficient data manipulation, numerical computing, and data analysis operations essential for ML feature processing and ERP analytics.

### Dependencies
- Python environment with sufficient memory
- Compatible versions with scikit-learn and PyTorch
- C compiler for optimized installations

### Instructions

#### 1. Install NumPy Package
- Install numpy with optimized BLAS libraries
- Verify version compatibility with other ML packages
- Test basic array operations and performance
- Check for optimized linear algebra routines

#### 2. Install Pandas Package
- Install pandas for data manipulation
- Verify numpy dependency satisfaction
- Test DataFrame operations and performance
- Check memory usage for large datasets

#### 3. Verify Integration
- Test numpy-pandas integration
- Verify compatibility with scikit-learn
- Check performance with PyTorch tensors
- Test data type conversions

#### 4. Configure for Django
- Test imports within Django environment
- Verify memory usage in web context
- Configure for concurrent data processing
- Set appropriate data processing limits

### Data Processing Capabilities

| Library | Core Functions | ERP Applications |
|---------|----------------|------------------|
| **NumPy** | Array operations, linear algebra | Numerical computations, feature vectors |
| **Pandas** | DataFrames, data analysis | Sales reports, inventory analysis |
| **Integration** | Seamless data flow | ML pipeline data preparation |

### Expected Outcome
- NumPy and pandas installed with optimal performance
- Data manipulation capabilities available
- Integration with ML libraries verified
- Ready for data processing operations

### Verification Checklist
- [ ] numpy installed with BLAS optimization
- [ ] pandas installed and working
- [ ] Basic operations performance acceptable
- [ ] Integration with ML libraries confirmed
- [ ] Django compatibility verified

---

## Task 06: Create ML Settings

### Overview
Create comprehensive Django settings configuration for ML functionality, including model paths, feature store backends, caching settings, and AI-specific parameters.

### Dependencies
- All ML libraries installed (Tasks 02-05)
- Django settings structure established
- Environment configuration system

### Instructions

#### 1. Create ML Settings Section
- Add dedicated ML section to Django settings
- Define base ML configuration parameters
- Set up environment-specific overrides
- Configure development vs production settings

#### 2. Configure Model Settings
- Define model storage paths and directories
- Set model version management parameters
- Configure model loading and caching settings
- Define model inference timeout limits

#### 3. Set Up Feature Store Configuration
- Configure feature store backend connections
- Define feature caching parameters
- Set up feature computation settings
- Configure feature version management

#### 4. Add AI Performance Settings
- Configure memory limits for AI operations
- Set concurrent request limits
- Define caching strategies for AI results
- Configure background task settings

### Settings Architecture

```
ML_SETTINGS = {
    'MODEL_STORAGE': {
        'BASE_PATH': '/models/',
        'CACHE_SIZE': '2GB',
        'VERSIONS': 5
    },
    'FEATURE_STORE': {
        'BACKEND': 'feast',
        'CACHE_TTL': 3600,
        'BATCH_SIZE': 1000
    },
    'INFERENCE': {
        'TIMEOUT': 30,
        'MAX_CONCURRENT': 10,
        'MEMORY_LIMIT': '1GB'
    }
}
```

### Expected Outcome
- Comprehensive ML settings configuration
- Environment-specific parameter overrides
- Performance and resource limits defined
- Ready for AI feature implementation

### Verification Checklist
- [ ] ML settings section created
- [ ] All required parameters defined
- [ ] Environment overrides working
- [ ] Settings accessible in Django
- [ ] No configuration conflicts

---

## Task 07: Create ML_MODEL_PATH

### Overview
Configure ML_MODEL_PATH setting to define the storage location for trained machine learning models, enabling proper model versioning and deployment management.

### Dependencies
- ML settings structure created (Task 06)
- File system permissions configured
- Storage backend accessible

### Instructions

#### 1. Define Model Path Structure
- Create hierarchical model storage directory structure
- Define paths for different model types
- Set up version control directories
- Configure backup and archive paths

#### 2. Configure Path Settings
- Add ML_MODEL_PATH to Django settings
- Define environment-specific path overrides
- Set up relative vs absolute path handling
- Configure path validation and creation

#### 3. Set Up Directory Management
- Create model storage directories
- Set appropriate file permissions
- Configure directory cleanup policies
- Set up model archival procedures

#### 4. Test Path Configuration
- Verify model path accessibility
- Test model saving and loading
- Check directory creation automation
- Validate path resolution in all environments

### Model Path Structure

```
ML_MODEL_PATH/
├── recommendations/
│   ├── v1.0/
│   ├── v1.1/
│   └── latest/
├── forecasting/
│   ├── demand/
│   ├── sales/
│   └── inventory/
├── search/
│   ├── embeddings/
│   └── ranking/
└── archived/
    └── [date-based folders]
```

### Expected Outcome
- ML_MODEL_PATH properly configured
- Model storage directories created
- Path validation working correctly
- Ready for model deployment

### Verification Checklist
- [ ] ML_MODEL_PATH setting configured
- [ ] Directory structure created
- [ ] Permissions set correctly
- [ ] Path validation working
- [ ] Model save/load operations successful

---

## Task 08: Create FEATURE_STORE_BACKEND

### Overview
Configure FEATURE_STORE_BACKEND setting to establish the backend system for storing and managing ML features, enabling consistent feature engineering across AI applications.

### Dependencies
- ML settings framework (Task 06)
- Database connections established
- Redis/cache backend configured
- Feature store libraries installed (Task 01)

### Instructions

#### 1. Configure Feature Store Backend
- Define FEATURE_STORE_BACKEND in Django settings
- Configure connection parameters for chosen backend
- Set up authentication and access credentials
- Define feature storage schema and structure

#### 2. Set Up Feature Categories
- Configure different feature types and storage
- Define feature versioning and lifecycle management
- Set up feature freshness and expiration policies
- Configure feature access patterns and caching

#### 3. Configure Performance Settings
- Define feature computation and caching strategies
- Set up batch vs real-time feature serving
- Configure feature pipeline execution settings
- Define resource limits for feature operations

#### 4. Test Feature Store Integration
- Verify feature store connectivity
- Test feature registration and retrieval
- Check feature versioning functionality
- Validate performance under load

### Feature Store Architecture

| Component | Configuration | Purpose |
|-----------|---------------|---------|
| **Backend Type** | PostgreSQL + Redis | Primary storage + caching |
| **Feature Types** | Batch, Streaming, Real-time | Different computation patterns |
| **Versioning** | Timestamp-based | Feature evolution tracking |
| **Caching** | Redis with TTL | Performance optimization |

### Feature Categories

```
FEATURE_CATEGORIES = {
    'customer': {
        'storage': 'postgresql',
        'cache_ttl': 3600,
        'update_frequency': 'daily'
    },
    'product': {
        'storage': 'postgresql', 
        'cache_ttl': 1800,
        'update_frequency': 'hourly'
    },
    'transaction': {
        'storage': 'redis',
        'cache_ttl': 300,
        'update_frequency': 'real-time'
    }
}
```

### Expected Outcome
- FEATURE_STORE_BACKEND configured and operational
- Feature categories and storage defined
- Performance optimization settings applied
- Ready for ML feature management

### Verification Checklist
- [ ] FEATURE_STORE_BACKEND setting configured
- [ ] Backend connectivity verified
- [ ] Feature registration working
- [ ] Caching and performance optimized
- [ ] All feature categories accessible

---

## Summary

This document establishes the foundational ML infrastructure for the AI features by configuring dependencies and essential settings. The next document will cover Django AI app creation and ML utilities implementation, building upon this infrastructure foundation.

### Key Deliverables Completed
- ML requirements specification with pinned versions
- Core ML libraries (scikit-learn, PyTorch, sentence-transformers, numpy/pandas) installed
- Comprehensive ML settings configuration
- Model path and feature store backend configuration
- Production-ready AI infrastructure foundation

### Next Steps
- Proceed to [02_Tasks-09-16_Django-AI-App.md](02_Tasks-09-16_Django-AI-App.md) for Django AI app creation
- Begin implementing ML utilities and helper functions
- Set up model training and serving infrastructure