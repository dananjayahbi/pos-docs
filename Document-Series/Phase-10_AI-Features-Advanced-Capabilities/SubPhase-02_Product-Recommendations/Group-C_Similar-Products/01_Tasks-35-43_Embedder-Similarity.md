# Tasks 35-43: Product Embedder and Similarity Calculation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** C - Similar Products  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-44-52_Service-Cache-Verify.md](02_Tasks-44-52_Service-Cache-Verify.md)

---

## Document Overview

This document covers the implementation of product embedding generation and similarity calculation systems for content-based product recommendations. It establishes the foundation for finding similar products based on semantic understanding of product information using machine learning embeddings and cosine similarity algorithms.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create ProductEmbedder | High | 60 min |
| 36 | Create text_representation | Medium | 30 min |
| 37 | Create generate_embedding | Medium | 35 min |
| 38 | Create ProductEmbedding Model | Medium | 40 min |
| 39 | Create embedding Field | Medium | 25 min |
| 40 | Create batch_embed | Medium | 45 min |
| 41 | Create SimilarityCalculator | Medium | 40 min |
| 42 | Create cosine_similarity | Low | 20 min |
| 43 | Create find_similar | Medium | 45 min |

---

## Task 35: Create ProductEmbedder

### Overview
Create the ProductEmbedder class that serves as the core component for generating semantic embeddings from product information. This class uses the SentenceTransformer library with the all-MiniLM-L6-v2 model to convert textual product descriptions into high-dimensional vectors that capture semantic meaning.

### Dependencies
- Task 34: Create ProductRecommendation Model (from Group-B)
- SentenceTransformer library must be installed
- CUDA/GPU support is optional but recommended for performance

### Instructions

1. **Create the embedder module file**
   - Navigate to `backend/apps/ai/recommendations/algorithms/` directory
   - Create new file named `embedder.py`
   - This module will house embedding generation logic

2. **Import required dependencies**
   - Import SentenceTransformer from sentence-transformers library
   - Import typing utilities (Optional, List, Dict)
   - Import Django Product model
   - Import numpy for numerical operations
   - Import logging for error tracking

3. **Define ProductEmbedder class**
   - Create class with initialization method
   - Store model name as class constant ('sentence-transformers/all-MiniLM-L6-v2')
   - Set embedding dimension as class constant (384)

4. **Implement model initialization**
   - Load SentenceTransformer model in __init__ method
   - Handle model loading errors gracefully
   - Detect and use GPU if available (CUDA)
   - Log model loading status and device information

5. **Add model lazy loading**
   - Implement singleton pattern for model instance
   - Ensure model loads only once per process
   - Cache model instance for reuse
   - Consider memory management for large deployments

6. **Implement device detection**
   - Check for CUDA availability
   - Fall back to CPU if GPU not available
   - Log device selection for debugging
   - Allow manual device override via configuration

7. **Add error handling**
   - Handle model loading failures
   - Handle out-of-memory errors
   - Implement retry logic for transient failures
   - Log all errors with appropriate context

8. **Add configuration support**
   - Support model name configuration from settings
   - Support batch size configuration
   - Support device selection override
   - Support custom model paths for air-gapped environments

### Model Specifications

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Model Name | all-MiniLM-L6-v2 | Sentence embeddings |
| Model Source | sentence-transformers | Hugging Face library |
| Embedding Dimension | 384 | Output vector size |
| Max Sequence Length | 256 tokens | Input text limit |
| Model Size | ~80 MB | Disk and memory footprint |

### all-MiniLM-L6-v2 Characteristics

| Aspect | Details |
|--------|---------|
| Architecture | MiniLM (distilled BERT) |
| Training | Semantic textual similarity |
| Performance | 68.70 on STS benchmark |
| Speed | Fast inference (CPU friendly) |
| Use Case | Semantic search, clustering |

### Device Selection Logic

```
┌─────────────────────────────────────┐
│   Initialize ProductEmbedder        │
└────────────┬────────────────────────┘
             │
             ├─> Check CUDA Available?
             │   ├─> Yes → Use GPU (cuda:0)
             │   └─> No  → Use CPU
             │
             ├─> Check Config Override?
             │   └─> Use Specified Device
             │
             └─> Load Model on Device
```

### Class Structure

| Component | Type | Purpose |
|-----------|------|---------|
| MODEL_NAME | Class constant | Model identifier |
| EMBEDDING_DIM | Class constant | Vector dimension |
| _model | Instance variable | Loaded model |
| _device | Instance variable | Computation device |
| __init__() | Method | Initialize embedder |
| _load_model() | Private method | Load transformer model |
| _get_device() | Private method | Detect/select device |

### Memory Considerations

| Scenario | Memory Usage | Recommendation |
|----------|--------------|----------------|
| Model Only | ~80 MB | Always loaded |
| Single Embedding | +10 MB | Minimal overhead |
| Batch Processing | +50-200 MB | Use batch_size=100 |
| GPU Processing | +500 MB VRAM | Use if available |

### Performance Expectations

| Device | Throughput | Latency (single) |
|--------|------------|------------------|
| CPU (4 cores) | ~50 products/sec | ~20ms |
| CPU (8 cores) | ~100 products/sec | ~10ms |
| GPU (T4) | ~500 products/sec | ~2ms |
| GPU (V100) | ~1000 products/sec | ~1ms |

### Error Handling Scenarios

| Error Type | Handling Strategy |
|------------|-------------------|
| Model Not Found | Download automatically or fail gracefully |
| Out of Memory | Reduce batch size, fall back to CPU |
| CUDA Error | Fall back to CPU, log warning |
| Invalid Model | Raise initialization error |

### Expected Outcome
- Functional ProductEmbedder class ready to generate embeddings
- Proper model initialization with device selection
- Error handling for production reliability
- Configurable and extensible design

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/algorithms/embedder.py` created
- [ ] ProductEmbedder class defined
- [ ] SentenceTransformer model loads correctly
- [ ] Device detection implemented (CPU/GPU)
- [ ] Error handling for model loading
- [ ] Logging configured properly
- [ ] Class constants defined (MODEL_NAME, EMBEDDING_DIM)
- [ ] Singleton pattern implemented

---

## Task 36: Create text_representation

### Overview
Create the text_representation method within the ProductEmbedder class that constructs a comprehensive textual representation of a product by combining multiple attributes. This method intelligently merges product name, description, category, brand, and tags into a single string optimized for embedding generation.

### Dependencies
- Task 35: Create ProductEmbedder

### Instructions

1. **Add text_representation method**
   - Define method in ProductEmbedder class
   - Accept Product model instance as parameter
   - Return single string representation

2. **Extract product attributes**
   - Access product.name (required)
   - Access product.description (optional)
   - Access product.category.name via foreign key
   - Access product.brand.name via foreign key
   - Access product tags via many-to-many relation

3. **Handle missing attributes gracefully**
   - Use empty strings for None values
   - Skip None attributes instead of including "None"
   - Provide default text if all fields are empty

4. **Combine attributes with structure**
   - Use clear separators between fields
   - Maintain consistent ordering
   - Consider semantic importance (name first)
   - Use format: "Name. Description. Category: X. Brand: Y. Tags: A, B, C"

5. **Process tags collection**
   - Extract tag names from queryset
   - Join multiple tags with commas
   - Handle empty tag collections
   - Limit tag count if necessary (e.g., top 10)

6. **Normalize text formatting**
   - Strip extra whitespace
   - Collapse multiple spaces to single space
   - Remove leading/trailing whitespace
   - Ensure consistent capitalization

7. **Implement text truncation**
   - Limit total length to model's max sequence length (256 tokens)
   - Estimate ~4 characters per token
   - Truncate to ~1000 characters max
   - Preserve most important information (name, description)

8. **Add special handling for edge cases**
   - Handle products with minimal information
   - Handle products with excessive information
   - Handle special characters properly
   - Handle multilingual content (if applicable)

### Text Representation Format

| Field | Priority | Format | Example |
|-------|----------|--------|---------|
| Name | Critical | Plain text | "Samsung Galaxy S21" |
| Description | High | Sentence | "Latest flagship smartphone with..." |
| Category | Medium | "Category: X" | "Category: Smartphones" |
| Brand | Medium | "Brand: X" | "Brand: Samsung" |
| Tags | Low | "Tags: A, B, C" | "Tags: 5G, Android, OLED" |

### Combination Strategy

```
┌─────────────────────────────────────┐
│         Product Object              │
└────────────┬────────────────────────┘
             │
             ├─> Extract name (required)
             ├─> Extract description (optional)
             ├─> Extract category.name (optional)
             ├─> Extract brand.name (optional)
             ├─> Extract tags (optional)
             │
             ├─> Filter None/empty values
             ├─> Format each component
             ├─> Join with structured separators
             │
             └─> Return combined string
```

### Text Processing Pipeline

| Step | Operation | Example |
|------|-----------|---------|
| 1. Extract | Get all fields | name="Product", desc="Description" |
| 2. Filter | Remove None | Skip missing category |
| 3. Format | Add labels | "Category: Electronics" |
| 4. Join | Combine | "Product. Description. Category: Electronics" |
| 5. Normalize | Clean whitespace | Remove extra spaces |
| 6. Truncate | Limit length | Keep first 1000 chars |

### Example Representations

| Scenario | Output |
|----------|--------|
| Full Product | "Samsung Galaxy S21. 5G flagship smartphone with 6.2-inch display. Category: Smartphones. Brand: Samsung. Tags: 5G, Android, OLED, Flagship" |
| Minimal Product | "Generic USB Cable. Category: Accessories" |
| No Description | "Wireless Mouse. Category: Computer Accessories. Brand: Logitech. Tags: Wireless, Ergonomic" |

### Attribute Priority Handling

| Priority Level | Attributes | Action if Missing |
|----------------|------------|-------------------|
| Critical | name | Use "Unnamed Product" |
| High | description | Skip section |
| Medium | category, brand | Skip section |
| Low | tags | Skip section |

### Text Length Management

```
Target Length: 256 tokens (~1000 characters)

Priority-Based Truncation:
1. Preserve name (always included)
2. Preserve description (first 500 chars)
3. Include category and brand
4. Include tags if space permits
5. Truncate description further if needed
```

### Edge Case Handling

| Edge Case | Handling Strategy |
|-----------|-------------------|
| All fields empty | Return product SKU or "Product {id}" |
| Very long description | Truncate to 500 characters |
| HTML in description | Strip HTML tags |
| Special characters | Keep Unicode, escape if needed |
| Line breaks | Replace with spaces |

### Performance Considerations

| Aspect | Impact | Optimization |
|--------|--------|--------------|
| Database Queries | N+1 queries | Use select_related, prefetch_related |
| String Concatenation | Memory allocation | Use join() instead of + |
| Tag Processing | QuerySet evaluation | Limit tag count |
| Text Cleaning | CPU cycles | Cache if processing multiple times |

### Expected Outcome
- Method that generates rich, semantic text from products
- Proper handling of optional fields
- Consistent formatting for better embeddings
- Efficient processing with minimal queries

### Verification Checklist
- [ ] text_representation method added to ProductEmbedder
- [ ] Method accepts Product instance
- [ ] Extracts name, description, category, brand, tags
- [ ] Handles None/missing attributes gracefully
- [ ] Formats text with clear structure
- [ ] Normalizes whitespace and formatting
- [ ] Implements length truncation
- [ ] Returns single combined string
- [ ] Optimizes database queries

---

## Task 37: Create generate_embedding

### Overview
Create the generate_embedding method within the ProductEmbedder class that takes a product's text representation and converts it into a 384-dimensional numerical vector using the SentenceTransformer model. This method is the core interface for generating individual product embeddings.

### Dependencies
- Task 36: Create text_representation

### Instructions

1. **Add generate_embedding method**
   - Define public method in ProductEmbedder class
   - Accept Product model instance as parameter
   - Return numpy array of shape (384,)

2. **Generate text representation**
   - Call text_representation method internally
   - Pass the product instance
   - Store resulting text string

3. **Validate input text**
   - Check if text is not empty
   - Check if text length is reasonable
   - Log warning if text is too short or too long
   - Return None or default vector for invalid inputs

4. **Generate embedding vector**
   - Call model.encode() method
   - Pass text representation string
   - Set convert_to_numpy=True
   - Set show_progress_bar=False for single items

5. **Handle model inference**
   - Ensure model is on correct device
   - Handle CUDA out-of-memory errors
   - Implement automatic retry on CPU if GPU fails
   - Log inference errors appropriately

6. **Normalize embedding vector**
   - Convert to float32 for consistency
   - Optionally normalize to unit length (L2 norm)
   - Ensure vector has correct shape (384,)
   - Handle NaN or infinite values

7. **Implement caching (optional)**
   - Consider caching embeddings for unchanged products
   - Cache key based on product text representation
   - Set reasonable cache TTL
   - Clear cache on product updates

8. **Add performance optimization**
   - Use model's built-in batching for efficiency
   - Set appropriate precision (FP32 vs FP16)
   - Monitor inference time
   - Log slow embedding generation

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| product | Product | Yes | - | Product instance to embed |
| normalize | bool | No | True | L2 normalize vector |
| return_type | str | No | 'numpy' | Return format (numpy/list) |

### Embedding Generation Flow

```
┌─────────────────────────────────────┐
│      generate_embedding(product)    │
└────────────┬────────────────────────┘
             │
             ├─> Generate text representation
             │   └─> Call text_representation(product)
             │
             ├─> Validate text (not empty)
             │   ├─> Valid → Continue
             │   └─> Invalid → Return None/default
             │
             ├─> Encode with model
             │   └─> model.encode(text)
             │
             ├─> Post-process vector
             │   ├─> Convert to float32
             │   ├─> Normalize (optional)
             │   └─> Validate shape (384,)
             │
             └─> Return numpy array
```

### SentenceTransformer encode() Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| sentences | str or List[str] | Input text(s) |
| batch_size | 32 (default) | Batch processing size |
| show_progress_bar | False | Disable for single items |
| convert_to_numpy | True | Return numpy arrays |
| normalize_embeddings | False | L2 normalization |
| device | Auto-detected | CPU or GPU |

### Vector Normalization

| Method | Formula | Use Case |
|--------|---------|----------|
| None | Raw output | When scaling matters |
| L2 Norm | v / \|\|v\|\|₂ | Cosine similarity (recommended) |
| Min-Max | (v - min) / (max - min) | Specific range needs |

### L2 Normalization Formula

```
Normalized Vector:
v_normalized = v / ||v||₂

Where:
||v||₂ = sqrt(v₁² + v₂² + ... + v₃₈₄²)

Benefit:
- Cosine similarity becomes dot product
- Faster similarity computation
- Values range from -1 to 1
```

### Error Handling

| Error Type | Handling Strategy |
|------------|-------------------|
| Empty Text | Return None or zero vector |
| Model Error | Retry once, then fail gracefully |
| GPU OOM | Fall back to CPU, reduce batch size |
| Invalid Shape | Raise ValueError with context |
| NaN Values | Log warning, return zero vector |

### Vector Validation

| Check | Expected | Action if Failed |
|-------|----------|------------------|
| Type | numpy.ndarray | Convert or raise error |
| Shape | (384,) | Reshape or raise error |
| Dtype | float32 | Convert type |
| NaN/Inf | None present | Replace with zeros |
| Range | -1 to 1 (if normalized) | Clip values |

### Performance Benchmarks

| Scenario | Time | Notes |
|----------|------|-------|
| Single Product (CPU) | 10-20ms | 4-core CPU |
| Single Product (GPU) | 1-3ms | T4 GPU |
| Text Generation | 1-2ms | Database query overhead |
| Normalization | <1ms | Negligible |

### Caching Strategy (Optional)

```
Cache Key Format:
f"product_embedding:{product.id}:{hash(text_representation)}"

Cache Benefits:
- Avoid re-computing unchanged products
- Reduce inference load
- Improve response time

Cache Invalidation:
- Product update
- Description/attribute change
- Manual cache clear
```

### Return Value Options

| Format | Type | Use Case |
|--------|------|----------|
| numpy array | np.ndarray | Default, efficient |
| Python list | List[float] | JSON serialization |
| Tensor | torch.Tensor | Deep learning pipelines |
| Bytes | bytes | Storage optimization |

### Expected Outcome
- Functional method to generate single product embeddings
- Proper integration with text_representation method
- Robust error handling for production use
- Optimized performance for real-time inference

### Verification Checklist
- [ ] generate_embedding method added to ProductEmbedder
- [ ] Method accepts Product instance
- [ ] Calls text_representation internally
- [ ] Uses model.encode() for embedding generation
- [ ] Returns numpy array of shape (384,)
- [ ] Implements vector normalization
- [ ] Handles errors gracefully
- [ ] Validates output vector
- [ ] Logs inference time and errors

---

## Task 38: Create ProductEmbedding Model

### Overview
Create the ProductEmbedding Django model that stores pre-computed product embeddings in the database. This model maintains a one-to-one relationship with the Product model and stores the 384-dimensional embedding vector along with metadata for caching and versioning.

### Dependencies
- Task 37: Create generate_embedding
- Product model must exist in catalog app
- PostgreSQL database with array support

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/ai/recommendations/models/` directory
   - Create new file named `product_embedding.py`
   - Import necessary Django model components

2. **Define ProductEmbedding model class**
   - Create class inheriting from models.Model
   - Add proper docstring explaining purpose
   - Configure model Meta options

3. **Add product relationship field**
   - Create OneToOneField to Product model
   - Set on_delete=CASCADE (delete embedding with product)
   - Set related_name='embedding'
   - Add db_index=True for query performance

4. **Add embedding vector field**
   - Will be implemented in Task 39
   - Placeholder for ArrayField storing floats
   - Size constraint: exactly 384 dimensions

5. **Add metadata fields**
   - created_at: DateTimeField with auto_now_add
   - updated_at: DateTimeField with auto_now
   - embedding_version: CharField for model version tracking
   - text_hash: CharField for change detection

6. **Add model version tracking**
   - Store model name used for embedding (e.g., "all-MiniLM-L6-v2")
   - Enable future model upgrades
   - Track when embeddings need regeneration

7. **Add text hash field**
   - Store hash of text_representation
   - Enable detection of product changes
   - Trigger re-embedding when text changes
   - Use MD5 or SHA256 for hashing

8. **Configure model Meta**
   - Set db_table name
   - Add ordering (by updated_at descending)
   - Add indexes for performance
   - Add verbose names for admin

9. **Implement __str__ method**
   - Return meaningful string representation
   - Include product name and embedding status
   - Format: "Embedding for {product.name}"

10. **Add custom methods (optional)**
    - needs_update() method to check staleness
    - regenerate() method to trigger re-embedding
    - get_similar() method wrapper

### Model Field Specifications

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| product | OneToOneField | CASCADE, indexed | Link to Product |
| embedding | ArrayField | 384 floats | Vector storage (Task 39) |
| embedding_version | CharField | max_length=50 | Model version |
| text_hash | CharField | max_length=64, indexed | Change detection |
| created_at | DateTimeField | auto_now_add | Creation timestamp |
| updated_at | DateTimeField | auto_now | Update timestamp |

### OneToOne Relationship Diagram

```
┌──────────────────────┐         ┌──────────────────────┐
│   Product Model      │         │  ProductEmbedding    │
│  (catalog.Product)   │         │      Model           │
├──────────────────────┤         ├──────────────────────┤
│ id (PK)              │←────────│ product (OneToOne)   │
│ name                 │         │ embedding [384]      │
│ description          │         │ embedding_version    │
│ category             │         │ text_hash            │
│ brand                │         │ created_at           │
│ ...                  │         │ updated_at           │
└──────────────────────┘         └──────────────────────┘

Access Pattern:
product.embedding → ProductEmbedding instance
embedding.product → Product instance
```

### Model Meta Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| db_table | 'ai_product_embeddings' | Explicit table name |
| ordering | ['-updated_at'] | Recent first |
| verbose_name | 'Product Embedding' | Admin display |
| verbose_name_plural | 'Product Embeddings' | Admin display |
| indexes | [product, text_hash, updated_at] | Query optimization |

### Index Strategy

```
Primary Indexes:
1. product_id (automatic from OneToOne)
2. text_hash (for change detection queries)
3. updated_at (for staleness queries)

Composite Indexes (consider adding):
1. (embedding_version, updated_at)
2. (text_hash, updated_at)
```

### Text Hash Strategy

| Aspect | Implementation |
|--------|----------------|
| Algorithm | MD5 (fast) or SHA256 (secure) |
| Input | Product text_representation |
| Purpose | Detect when product text changes |
| Update Trigger | Compare hash, regenerate if different |

### Text Hash Calculation

```
Flow:
1. Generate text_representation(product)
2. Compute hash: hashlib.md5(text.encode()).hexdigest()
3. Compare with stored text_hash
4. If different → needs_update() returns True
5. Trigger regenerate() if stale
```

### Model Version Tracking

| Use Case | Implementation |
|----------|----------------|
| Store Model Name | embedding_version = "all-MiniLM-L6-v2" |
| Detect Outdated | Compare with current model |
| Bulk Regeneration | Filter by old versions |
| A/B Testing | Compare different models |

### Custom Methods

| Method | Purpose | Return Type |
|--------|---------|-------------|
| needs_update() | Check if embedding is stale | bool |
| regenerate() | Trigger re-embedding | None |
| get_similar(top_k) | Find similar products | QuerySet |
| to_numpy() | Convert embedding to numpy | np.ndarray |

### needs_update() Logic

```
def needs_update(self) -> bool:
    Checks:
    1. Text hash changed?
       → Recompute text hash and compare
    
    2. Model version outdated?
       → Compare with current model version
    
    3. Embedding too old?
       → Check updated_at against threshold
    
    Return: True if any condition met
```

### Database Storage

| Aspect | Details |
|--------|---------|
| Table Size | ~1.5 KB per row (384 floats × 4 bytes) |
| 10K Products | ~15 MB |
| 100K Products | ~150 MB |
| 1M Products | ~1.5 GB |
| Index Overhead | +20-30% |

### Access Patterns

| Pattern | Example | Performance |
|---------|---------|-------------|
| Get Embedding | product.embedding.embedding | O(1) lookup |
| Check Staleness | product.embedding.needs_update() | O(1) check |
| Find Stale | ProductEmbedding.objects.filter(updated_at__lt=...) | Index scan |
| Bulk Access | prefetch_related('embedding') | Optimized N+1 |

### Expected Outcome
- Django model ready to store product embeddings
- One-to-one relationship with Product model
- Metadata for caching and versioning
- Foundation for similarity search

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/models/product_embedding.py` created
- [ ] ProductEmbedding model class defined
- [ ] OneToOneField to Product configured
- [ ] Metadata fields added (created_at, updated_at)
- [ ] embedding_version field added
- [ ] text_hash field added
- [ ] Model Meta configured properly
- [ ] __str__ method implemented
- [ ] Model registered in __init__.py
- [ ] Ready for embedding field (Task 39)

---

## Task 39: Create embedding Field

### Overview
Add the embedding field to the ProductEmbedding model using PostgreSQL's ArrayField to store the 384-dimensional float vector. This field is the core storage mechanism for the numerical representation of products, optimized for efficient retrieval and similarity calculations.

### Dependencies
- Task 38: Create ProductEmbedding Model
- PostgreSQL database (required for ArrayField)
- django.contrib.postgres installed

### Instructions

1. **Import ArrayField**
   - Import ArrayField from django.contrib.postgres.fields
   - Import FloatField from django.db.models
   - Ensure PostgreSQL backend is configured

2. **Add embedding field to model**
   - Add field to ProductEmbedding model
   - Use ArrayField with FloatField as base_field
   - Set size parameter to 384 (fixed dimension)

3. **Configure field constraints**
   - Set size=384 to enforce dimension
   - Make field required (null=False, blank=False)
   - Add help_text for documentation
   - Add validation for field

4. **Add field validators**
   - Create custom validator for array length
   - Validate all values are finite (no NaN/Inf)
   - Validate value range if normalized (-1 to 1)
   - Add validator to field's validators list

5. **Configure database representation**
   - PostgreSQL stores as real[] or float[] array
   - Set appropriate column type
   - Consider compression for storage optimization
   - Ensure proper indexing strategy

6. **Add field-level methods**
   - to_numpy() method to convert to numpy array
   - from_numpy() class method to create from numpy
   - validate_embedding() to check integrity

7. **Implement serialization support**
   - Support JSON serialization for APIs
   - Support numpy serialization for ML pipelines
   - Support binary serialization for performance

8. **Add field migration**
   - Generate migration file
   - Review migration for PostgreSQL-specific SQL
   - Test migration on development database
   - Prepare rollback strategy

### Field Definition Structure

| Component | Specification |
|-----------|---------------|
| Field Type | ArrayField(FloatField()) |
| Size | 384 (fixed) |
| Null | False |
| Blank | False |
| Default | None (must be provided) |
| Help Text | "384-dimensional embedding vector" |

### ArrayField Configuration

```
Field Definition:
embedding = ArrayField(
    FloatField(),
    size=384,
    null=False,
    blank=False,
    help_text="384-dimensional embedding vector from all-MiniLM-L6-v2"
)

Key Parameters:
- base_field: FloatField() (stores individual floats)
- size: 384 (enforces array length)
- null=False (required field)
- blank=False (required in forms)
```

### PostgreSQL Storage

| Aspect | Details |
|--------|---------|
| Column Type | real[] (4 bytes per float) |
| Storage Size | 384 × 4 = 1,536 bytes per row |
| With Metadata | ~1,600 bytes total |
| Indexing | Not directly indexable (use pgvector) |
| Compression | PostgreSQL TOAST for large values |

### Field Validators

| Validator | Check | Error Message |
|-----------|-------|---------------|
| ArrayLengthValidator | len(value) == 384 | "Embedding must have exactly 384 dimensions" |
| FiniteValueValidator | all(math.isfinite(v)) | "Embedding contains NaN or infinite values" |
| RangeValidator | -1 <= v <= 1 (if normalized) | "Embedding values out of expected range" |

### Custom Validator Implementation

```
Validator Pattern:
1. Define validator function
2. Accept value parameter
3. Perform validation checks
4. Raise ValidationError if invalid
5. Add to field's validators list

Example Check:
def validate_embedding_length(value):
    if len(value) != 384:
        raise ValidationError(
            f"Embedding must have 384 dimensions, got {len(value)}"
        )
```

### Embedding Storage Format

| Format | Storage | Use Case |
|--------|---------|----------|
| PostgreSQL Array | Native | Database storage |
| Numpy Array | Binary | ML processing |
| Python List | JSON | API responses |
| Base64 Binary | String | Compact transmission |

### Conversion Methods

| Method | Purpose | Return Type |
|--------|---------|-------------|
| to_numpy() | Convert to numpy | np.ndarray |
| to_list() | Convert to Python list | List[float] |
| from_numpy(arr) | Create from numpy | List[float] |
| from_list(lst) | Create from list | List[float] |

### Database Query Patterns

| Pattern | Example | Notes |
|---------|---------|-------|
| Retrieve | embedding.embedding | Returns Python list |
| Update | embedding.embedding = [0.1, ...] | Validates length |
| Bulk Retrieve | .values_list('embedding', flat=True) | Memory efficient |
| Filter | .filter(embedding__isnull=False) | Check existence |

### Migration Considerations

```
Migration Operations:
1. AddField operation
2. Specify PostgreSQL array type
3. Set size constraint
4. Add field validation

Migration File Structure:
migrations.AddField(
    model_name='productembedding',
    name='embedding',
    field=ArrayField(
        FloatField(),
        size=384,
        ...
    ),
)
```

### PostgreSQL Array Operations

| Operation | SQL | Django ORM |
|-----------|-----|------------|
| Array Length | array_length(embedding, 1) | N/A (in Python) |
| Array Element | embedding[1] | embedding[0] (Python) |
| Array Slice | embedding[1:10] | embedding[:10] (Python) |
| Contains | embedding @> ARRAY[0.5] | N/A (use Python) |

### Performance Considerations

| Aspect | Impact | Optimization |
|--------|--------|--------------|
| Retrieval | Fast | Single column read |
| Update | Moderate | Full array replacement |
| Indexing | Limited | Use pgvector extension |
| Memory | 1.5 KB per row | Acceptable for millions |
| Serialization | Overhead | Cache if accessed frequently |

### Alternative: pgvector Extension

| Feature | ArrayField | pgvector |
|---------|------------|----------|
| Storage | Native array | Custom type |
| Indexing | Not available | IVFFlat, HNSW |
| Similarity | Python/NumPy | Native operators |
| Performance | Good | Excellent for search |
| Setup | Built-in | Requires extension |

### pgvector Considerations

```
Advantages:
- Native vector indexing (IVFFlat, HNSW)
- Native similarity operators (<->, <#>, <=>)
- Optimized for similarity search
- 10-100x faster for large datasets

Disadvantages:
- Requires PostgreSQL extension
- More complex setup
- Migration from ArrayField needed

Recommendation:
- Start with ArrayField (simpler)
- Migrate to pgvector if performance needed
```

### Expected Outcome
- Embedding field added to ProductEmbedding model
- Proper storage of 384-dimensional vectors
- Field validation for data integrity
- Ready for similarity calculations

### Verification Checklist
- [ ] ArrayField imported from django.contrib.postgres.fields
- [ ] embedding field added to ProductEmbedding model
- [ ] Size constraint set to 384
- [ ] Field validators implemented
- [ ] null=False and blank=False configured
- [ ] Help text added
- [ ] Migration generated and tested
- [ ] Field accessible in model instances
- [ ] Conversion methods implemented

---

## Task 40: Create batch_embed

### Overview
Create the batch_embed method in the ProductEmbedder class to efficiently generate embeddings for multiple products simultaneously. This method leverages batch processing capabilities of the SentenceTransformer model to dramatically improve throughput for initial embedding generation and periodic re-embedding tasks.

### Dependencies
- Task 39: Create embedding Field
- Database transaction support
- Sufficient memory for batch processing

### Instructions

1. **Add batch_embed method**
   - Define method in ProductEmbedder class
   - Accept queryset of products or list of product IDs
   - Accept batch_size parameter (default: 100)
   - Return count of successfully embedded products

2. **Implement batch processing loop**
   - Iterate through products in batches
   - Use Django's queryset.iterator() for memory efficiency
   - Process batch_size products at a time
   - Track progress and errors

3. **Generate text representations in batch**
   - Create list of text representations
   - Call text_representation for each product in batch
   - Store texts in order matching products
   - Handle products with empty/invalid text

4. **Generate embeddings in batch**
   - Call model.encode() with list of texts
   - Set batch_size parameter appropriately
   - Set show_progress_bar=True for user feedback
   - Handle batch processing errors

5. **Calculate text hashes**
   - Compute hash for each text representation
   - Use hashlib.md5() or hashlib.sha256()
   - Store hashes for later change detection
   - Batch hash calculation for efficiency

6. **Create or update ProductEmbedding records**
   - Use bulk_create or bulk_update for efficiency
   - Create ProductEmbedding instances with embeddings
   - Set embedding_version to current model name
   - Set text_hash for each product

7. **Implement database transaction**
   - Wrap batch operations in transaction.atomic()
   - Rollback on errors to maintain consistency
   - Commit successfully processed batches
   - Log transaction outcomes

8. **Add progress tracking**
   - Log batch number and progress percentage
   - Display progress bar for long operations
   - Log time per batch for performance monitoring
   - Provide ETA for completion

9. **Implement error handling**
   - Handle individual product errors gracefully
   - Continue processing on non-critical errors
   - Collect failed product IDs for retry
   - Log errors with full context

10. **Add performance optimizations**
    - Use select_related and prefetch_related
    - Minimize database queries
    - Optimize memory usage for large batches
    - Consider multiprocessing for CPU-bound tasks

### Method Signature

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| products | QuerySet or List[int] | - | Products to embed |
| batch_size | int | 100 | Batch processing size |
| update_existing | bool | True | Re-embed existing |
| show_progress | bool | True | Display progress bar |

### Batch Processing Flow

```
┌─────────────────────────────────────┐
│  batch_embed(products, batch_size)  │
└────────────┬────────────────────────┘
             │
             ├─> Optimize QuerySet
             │   ├─> select_related('category', 'brand')
             │   └─> prefetch_related('tags')
             │
             ├─> Iterate in Batches
             │   └─> for batch in chunks(products, batch_size):
             │
             ├─> For Each Batch:
             │   ├─> Generate text representations
             │   ├─> Encode batch with model
             │   ├─> Calculate text hashes
             │   ├─> Create ProductEmbedding records
             │   └─> Save in transaction
             │
             ├─> Track Progress
             │   ├─> Log batch completion
             │   ├─> Update progress bar
             │   └─> Calculate ETA
             │
             └─> Return Summary
                 ├─> Total processed
                 ├─> Total successful
                 └─> Total failed
```

### Batch Size Optimization

| Batch Size | CPU Performance | GPU Performance | Memory Usage |
|------------|----------------|-----------------|--------------|
| 10 | Slow | Slow | Low (10 MB) |
| 50 | Moderate | Good | Moderate (50 MB) |
| 100 | Good | Excellent | Moderate (100 MB) |
| 250 | Good | Excellent | High (250 MB) |
| 500 | Good | Excellent | Very High (500 MB) |

### Recommended Batch Sizes

| Scenario | Batch Size | Rationale |
|----------|------------|-----------|
| CPU-only | 50-100 | Balance speed and memory |
| GPU (4GB) | 100-200 | Maximize GPU utilization |
| GPU (8GB+) | 200-500 | Full GPU capacity |
| Limited Memory | 25-50 | Prevent OOM errors |
| High Latency | 10-20 | Quick feedback |

### QuerySet Optimization

```
Optimization Pattern:
products = Product.objects.filter(
    active=True
).select_related(
    'category',
    'brand'
).prefetch_related(
    'tags'
).only(
    'id', 'name', 'description',
    'category__name', 'brand__name'
)

Benefits:
- Reduces N+1 queries
- Minimizes data transfer
- Faster text generation
- Lower memory usage
```

### Bulk Database Operations

| Operation | Method | Performance |
|-----------|--------|-------------|
| Create New | bulk_create() | 10-100x faster |
| Update Existing | bulk_update() | 10-50x faster |
| Mixed | Separate create/update | Best approach |
| Check Existence | exists() filter | Minimal overhead |

### bulk_create vs bulk_update

```
Strategy:
1. Fetch existing embeddings
   existing_ids = ProductEmbedding.objects.filter(
       product_id__in=batch_ids
   ).values_list('product_id', flat=True)

2. Separate into create/update lists
   to_create = [p for p in batch if p.id not in existing_ids]
   to_update = [p for p in batch if p.id in existing_ids]

3. Bulk operations
   ProductEmbedding.objects.bulk_create(create_list)
   ProductEmbedding.objects.bulk_update(update_list, fields=[...])
```

### Transaction Management

```
Transaction Pattern:
with transaction.atomic():
    try:
        # Process batch
        embeddings = generate_embeddings(batch)
        
        # Save to database
        ProductEmbedding.objects.bulk_create(embeddings)
        
        # Commit on success
        return len(embeddings)
    
    except Exception as e:
        # Automatic rollback
        log.error(f"Batch failed: {e}")
        return 0
```

### Progress Tracking Implementation

| Component | Implementation |
|-----------|----------------|
| Progress Bar | tqdm library |
| Logging | Python logging module |
| Metrics | Count, time, ETA |
| Display | Console or task queue |

### Progress Bar Example

```
Using tqdm:
from tqdm import tqdm

total_products = products.count()
processed = 0

for batch in tqdm(batches, desc="Embedding products"):
    count = process_batch(batch)
    processed += count

Output:
Embedding products: 45%|████▌     | 450/1000 [00:45<00:55, 10.0it/s]
```

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Model Error | Retry batch once, then skip |
| Database Error | Rollback, log, continue |
| Individual Product | Log, continue with batch |
| Out of Memory | Reduce batch size, retry |
| Timeout | Log, continue next batch |

### Performance Benchmarks

| Dataset | Batch Size | Device | Time | Throughput |
|---------|------------|--------|------|------------|
| 1K products | 100 | CPU | 2 min | 8.3 prod/sec |
| 1K products | 100 | GPU | 20 sec | 50 prod/sec |
| 10K products | 100 | CPU | 20 min | 8.3 prod/sec |
| 10K products | 100 | GPU | 3.5 min | 47 prod/sec |
| 100K products | 250 | GPU | 35 min | 47 prod/sec |

### Memory Usage Calculation

```
Memory per Product:
- Text representation: ~1 KB
- Embedding (float32): 384 × 4 = 1.5 KB
- Overhead: ~0.5 KB

Total per Product: ~3 KB

Batch Memory:
- Batch of 100: ~300 KB
- Batch of 500: ~1.5 MB
- Model: ~80 MB
- Overhead: ~20 MB

Total (batch=100): ~400 MB
Total (batch=500): ~600 MB
```

### Return Value Structure

```
Return Dictionary:
{
    'total': 1000,
    'successful': 985,
    'failed': 15,
    'skipped': 0,
    'time_elapsed': 120.5,
    'throughput': 8.2,
    'failed_ids': [123, 456, ...]
}
```

### Use Cases

| Use Case | When | Batch Size |
|----------|------|------------|
| Initial Embedding | First deployment | 100-250 |
| Daily Update | Nightly batch job | 100 |
| Product Import | After bulk import | 250 |
| Model Upgrade | Version change | 100-250 |
| Fixes | Reprocess failed | 50 |

### Expected Outcome
- Efficient batch processing of product embeddings
- Significant performance improvement over single processing
- Robust error handling for production use
- Progress tracking for long-running operations

### Verification Checklist
- [ ] batch_embed method added to ProductEmbedder
- [ ] Method accepts products queryset and batch_size
- [ ] Batch iteration implemented with chunks
- [ ] Text representations generated in batch
- [ ] Model.encode() called with batch
- [ ] Text hashes calculated
- [ ] bulk_create/bulk_update used for database
- [ ] Transaction management implemented
- [ ] Progress tracking added
- [ ] Error handling for batch failures
- [ ] Returns summary with counts
- [ ] QuerySet optimizations applied

---

## Task 41: Create SimilarityCalculator

### Overview
Create the SimilarityCalculator class that provides efficient methods for calculating similarity between product embeddings. This class serves as the foundation for finding similar products using various distance metrics, with cosine similarity as the primary method.

### Dependencies
- Task 40: Create batch_embed
- NumPy library for numerical operations
- Understanding of vector similarity metrics

### Instructions

1. **Create similarity module file**
   - Navigate to `backend/apps/ai/recommendations/algorithms/` directory
   - Create new file named `similarity.py`
   - This module houses all similarity calculation logic

2. **Import required dependencies**
   - Import numpy for vector operations
   - Import typing utilities (List, Tuple, Optional)
   - Import ProductEmbedding model
   - Import logging for debugging

3. **Define SimilarityCalculator class**
   - Create class with initialization method
   - Configure similarity metric (cosine, euclidean, dot)
   - Set default parameters

4. **Implement constructor**
   - Accept optional metric parameter
   - Validate metric is supported
   - Initialize any required state
   - Set up logging

5. **Add supported metrics configuration**
   - Define class constant for supported metrics
   - SUPPORTED_METRICS = ['cosine', 'euclidean', 'dot_product']
   - Set default metric to 'cosine'
   - Allow metric configuration via settings

6. **Create metric validation**
   - Validate metric parameter in __init__
   - Raise ValueError for unsupported metrics
   - Provide helpful error messages
   - Log metric selection

7. **Prepare for similarity methods**
   - Structure for cosine_similarity (Task 42)
   - Structure for euclidean_distance (optional)
   - Structure for dot_product_similarity (optional)
   - Structure for find_similar (Task 43)

8. **Add utility methods**
   - normalize_vector() for L2 normalization
   - validate_vector() for dimension checking
   - batch_similarity() for multiple comparisons
   - get_metric_info() for metric descriptions

### Class Structure

| Component | Type | Purpose |
|-----------|------|---------|
| SUPPORTED_METRICS | Class constant | List of available metrics |
| DEFAULT_METRIC | Class constant | Default similarity metric |
| metric | Instance variable | Currently selected metric |
| __init__() | Method | Initialize calculator |
| cosine_similarity() | Method | Compute cosine similarity (Task 42) |
| find_similar() | Method | Find similar products (Task 43) |
| normalize_vector() | Utility | L2 normalization |
| validate_vector() | Utility | Dimension validation |

### Similarity Metrics Overview

| Metric | Range | Formula | Use Case |
|--------|-------|---------|----------|
| Cosine | 0 to 1 | cos(θ) = A·B / (\|\|A\|\| \|\|B\|\|) | Semantic similarity (recommended) |
| Euclidean | 0 to ∞ | d = √(Σ(a_i - b_i)²) | Geometric distance |
| Dot Product | -∞ to ∞ | A·B = Σ(a_i × b_i) | Magnitude-aware |

### Cosine Similarity Characteristics

```
Properties:
- Range: 0 (orthogonal) to 1 (identical)
- Ignores vector magnitude
- Focuses on direction/angle
- Best for semantic similarity
- Fast to compute

Geometric Interpretation:
cos(θ) where θ is angle between vectors

Perfect Match: 1.0 (same direction)
No Similarity: 0.0 (perpendicular)
Opposite: -1.0 (opposite direction, rarely with embeddings)
```

### Calculator Initialization Flow

```
┌─────────────────────────────────────┐
│  SimilarityCalculator(metric='cos') │
└────────────┬────────────────────────┘
             │
             ├─> Validate metric
             │   ├─> Is 'cosine' in SUPPORTED_METRICS?
             │   ├─> Yes → Continue
             │   └─> No  → Raise ValueError
             │
             ├─> Set instance variables
             │   └─> self.metric = metric
             │
             ├─> Initialize utilities
             │   └─> Setup logging
             │
             └─> Ready for calculations
```

### Class Constants

```python
Configuration:
SUPPORTED_METRICS = [
    'cosine',         # Primary metric
    'euclidean',      # Alternative metric
    'dot_product',    # Alternative metric
]

DEFAULT_METRIC = 'cosine'

EMBEDDING_DIM = 384  # Expected dimension
```

### Method Signatures

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| __init__ | metric: str | None | Initialize calculator |
| cosine_similarity | vec1, vec2 | float | Compute cosine similarity |
| find_similar | embedding, top_k | List[Tuple] | Find similar products |
| normalize_vector | vector | np.ndarray | L2 normalize |
| validate_vector | vector | bool | Check dimensions |

### Utility Methods

| Method | Purpose | Implementation |
|--------|---------|----------------|
| normalize_vector() | L2 normalization | v / \|\|v\|\|₂ |
| validate_vector() | Check shape and values | Shape (384,), no NaN |
| batch_similarity() | Compare one to many | Vectorized operations |
| get_metric_info() | Metric documentation | Return description |

### Vector Validation

```
Validation Checks:
1. Type: numpy array or list
2. Shape: (384,) or length 384
3. Dtype: numeric (float32/float64)
4. Values: all finite (no NaN/Inf)
5. Non-zero: not all zeros

Error Handling:
- Convert list to numpy array
- Reshape if needed
- Replace NaN with zeros (with warning)
- Raise error for incompatible dimensions
```

### Normalization Utility

```
L2 Normalization:
def normalize_vector(vector: np.ndarray) -> np.ndarray:
    """Normalize vector to unit length."""
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector  # or raise error
    return vector / norm

Benefits:
- Cosine similarity becomes dot product
- Faster computation
- Consistent scale
```

### Batch Similarity

```
Compute similarity between one vector and many:
def batch_similarity(
    query_vector: np.ndarray,
    candidate_vectors: np.ndarray,  # Shape: (N, 384)
    metric: str = 'cosine'
) -> np.ndarray:  # Shape: (N,)
    
    For cosine (normalized):
    scores = np.dot(candidate_vectors, query_vector)
    
    Return: Array of similarity scores
```

### Performance Considerations

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Single Comparison | O(n) | n=384 |
| Batch Comparison | O(m×n) | m=products, n=384 |
| Normalization | O(n) | One-time cost |
| Validation | O(1) | Minimal overhead |

### Metric Selection Guide

| Scenario | Recommended Metric | Rationale |
|----------|-------------------|-----------|
| Semantic Search | Cosine | Direction matters, not magnitude |
| Exact Matching | Euclidean | Sensitive to all differences |
| Ranking | Dot Product | Considers magnitude |
| General Use | Cosine | Most robust |

### Error Handling

| Error Type | Detection | Handling |
|------------|-----------|----------|
| Invalid Metric | Not in SUPPORTED_METRICS | Raise ValueError |
| Wrong Dimensions | Shape != (384,) | Raise ValueError |
| NaN Values | np.isnan() | Raise or replace |
| Zero Vector | norm == 0 | Raise or return 0 |

### Expected Outcome
- Functional SimilarityCalculator class
- Support for multiple similarity metrics
- Utility methods for vector operations
- Foundation for similarity search

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/algorithms/similarity.py` created
- [ ] SimilarityCalculator class defined
- [ ] SUPPORTED_METRICS constant defined
- [ ] Constructor accepts and validates metric
- [ ] normalize_vector() utility method
- [ ] validate_vector() utility method
- [ ] Class ready for cosine_similarity (Task 42)
- [ ] Class ready for find_similar (Task 43)
- [ ] Proper error handling for invalid inputs
- [ ] Logging configured

---

## Task 42: Create cosine_similarity

### Overview
Implement the cosine_similarity method in the SimilarityCalculator class to compute the similarity between two product embedding vectors. This method calculates the cosine of the angle between vectors, providing a score from 0 (completely different) to 1 (identical) that represents semantic similarity.

### Dependencies
- Task 41: Create SimilarityCalculator

### Instructions

1. **Add cosine_similarity method**
   - Define method in SimilarityCalculator class
   - Accept two vector parameters (vec1, vec2)
   - Return float between 0 and 1
   - Make method static or instance method

2. **Accept multiple input types**
   - Accept numpy arrays
   - Accept Python lists
   - Accept ProductEmbedding model instances
   - Convert to numpy arrays internally

3. **Validate input vectors**
   - Call validate_vector() for both inputs
   - Check dimensions match (both 384)
   - Check for NaN or infinite values
   - Raise ValueError for invalid inputs

4. **Implement cosine similarity formula**
   - Calculate dot product: np.dot(vec1, vec2)
   - Calculate norms: np.linalg.norm(vec1) and np.linalg.norm(vec2)
   - Divide: dot_product / (norm1 * norm2)
   - Return result as float

5. **Handle edge cases**
   - Zero vectors (norm = 0): return 0.0 or raise error
   - Identical vectors: should return 1.0
   - Orthogonal vectors: should return 0.0
   - Numerical precision: clamp result to [0, 1]

6. **Optimize for normalized vectors**
   - If vectors already normalized (norm = 1), skip norm calculation
   - Cosine similarity becomes simple dot product
   - Add parameter: assume_normalized=False
   - Significant speed improvement

7. **Add numerical stability**
   - Clamp result to [0, 1] range
   - Handle floating-point precision errors
   - Use np.clip() for clamping
   - Consider using cosine_similarity from sklearn (optional)

8. **Implement batch mode (optional)**
   - Accept arrays of vectors
   - Compute pairwise similarities
   - Return similarity matrix
   - Use vectorized operations

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| vec1 | np.ndarray or list | Yes | - | First embedding vector |
| vec2 | np.ndarray or list | Yes | - | Second embedding vector |
| assume_normalized | bool | No | False | Skip normalization |
| return_angle | bool | No | False | Return angle in degrees |

### Cosine Similarity Formula

```
Mathematical Formula:
cos(θ) = (A · B) / (||A|| × ||B||)

Where:
- A · B = dot product = Σ(a_i × b_i)
- ||A|| = L2 norm = √(Σ(a_i²))
- ||B|| = L2 norm = √(Σ(b_i²))

Result Range:
- 1.0: Vectors point in same direction (identical)
- 0.0: Vectors are orthogonal (unrelated)
- -1.0: Vectors point in opposite directions (rare for embeddings)
```

### Implementation Approaches

| Approach | Code | Performance |
|----------|------|-------------|
| Manual | dot / (norm1 * norm2) | Good |
| NumPy | np.dot / np.linalg.norm | Good |
| Normalized | np.dot (if norm=1) | Excellent |
| Sklearn | cosine_similarity() | Good, more features |

### Manual Implementation

```
Basic Implementation:
def cosine_similarity(vec1, vec2):
    # Convert to numpy
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    
    # Calculate dot product
    dot_product = np.dot(vec1, vec2)
    
    # Calculate norms
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    # Handle zero vectors
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    # Calculate cosine
    similarity = dot_product / (norm1 * norm2)
    
    # Clamp to [0, 1]
    return np.clip(similarity, 0.0, 1.0)
```

### Optimized for Normalized Vectors

```
Fast Implementation (normalized vectors):
def cosine_similarity(vec1, vec2, assume_normalized=False):
    if assume_normalized:
        # Direct dot product (much faster)
        similarity = np.dot(vec1, vec2)
    else:
        # Full calculation
        similarity = np.dot(vec1, vec2) / (
            np.linalg.norm(vec1) * np.linalg.norm(vec2)
        )
    
    return np.clip(similarity, 0.0, 1.0)

Speed Improvement:
- Full calculation: 10-20 µs
- Normalized only: 2-5 µs
- 3-4x faster for normalized vectors
```

### Edge Cases

| Case | Vectors | Expected | Handling |
|------|---------|----------|----------|
| Identical | [1,0,0], [1,0,0] | 1.0 | Return 1.0 |
| Orthogonal | [1,0,0], [0,1,0] | 0.0 | Return 0.0 |
| Zero Vector | [0,0,0], [1,0,0] | 0.0 | Return 0.0 or error |
| Opposite | [1,0,0], [-1,0,0] | -1.0 | Clamp to 0.0 |
| Scaled | [1,2,3], [2,4,6] | 1.0 | Return 1.0 (same direction) |

### Numerical Precision

```
Precision Issues:
- Floating-point rounding
- Result slightly > 1.0 or < 0.0
- Example: 1.0000000001 or -0.0000000001

Solution:
similarity = np.clip(similarity, 0.0, 1.0)

Ensures:
- Result always in [0, 1]
- No unexpected values
- Safe for downstream operations
```

### Input Type Handling

| Input Type | Handling |
|------------|----------|
| np.ndarray | Use directly |
| List[float] | Convert with np.array() |
| ProductEmbedding | Extract .embedding field |
| torch.Tensor | Convert with .numpy() |
| Other | Raise TypeError |

### Validation Checks

```
Validation Sequence:
1. Convert to numpy arrays
2. Check shape == (384,)
3. Check dtype is numeric
4. Check no NaN values: np.isnan().any()
5. Check no Inf values: np.isinf().any()
6. Optionally check not all zeros

Fail Fast:
- Raise ValueError immediately
- Provide clear error message
- Log invalid input for debugging
```

### Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Single Comparison | 10-20 µs | Full calculation |
| Single (normalized) | 2-5 µs | Dot product only |
| Batch (1000 vectors) | 2-5 ms | Vectorized |
| Validation | 5-10 µs | Per vector |

### Return Value Interpretation

| Score | Interpretation | Product Similarity |
|-------|----------------|-------------------|
| 0.95-1.0 | Nearly identical | Very similar products |
| 0.8-0.95 | Very similar | Same category/type |
| 0.6-0.8 | Similar | Related products |
| 0.4-0.6 | Somewhat similar | Loose connection |
| 0.0-0.4 | Different | Unrelated |

### Comparison with Euclidean Distance

```
Cosine vs Euclidean:

Cosine Similarity:
- Measures angle (direction)
- Ignores magnitude
- Range: [0, 1]
- Best for semantic similarity

Euclidean Distance:
- Measures absolute distance
- Considers magnitude
- Range: [0, ∞]
- Best for exact matching

Conversion:
distance = 1 - cosine_similarity
(Approximation, not exact equivalent)
```

### Integration with Database

```
Usage Pattern:
1. Retrieve embeddings from database
   emb1 = product1.embedding.embedding
   emb2 = product2.embedding.embedding

2. Calculate similarity
   calculator = SimilarityCalculator()
   score = calculator.cosine_similarity(emb1, emb2)

3. Use score for ranking/filtering
   if score > 0.7:
       # Products are similar
```

### Optional: Batch Similarity Matrix

```
Compute all pairwise similarities:
def cosine_similarity_matrix(vectors: np.ndarray) -> np.ndarray:
    """
    vectors: shape (N, 384)
    returns: shape (N, N) similarity matrix
    """
    # Normalize vectors
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    normalized = vectors / norms
    
    # Compute pairwise dot products
    similarity_matrix = np.dot(normalized, normalized.T)
    
    return np.clip(similarity_matrix, 0.0, 1.0)
```

### Expected Outcome
- Functional cosine_similarity method
- Accurate similarity computation (0 to 1)
- Proper handling of edge cases
- Optimized for performance

### Verification Checklist
- [ ] cosine_similarity method added to SimilarityCalculator
- [ ] Accepts two vectors as parameters
- [ ] Returns float between 0 and 1
- [ ] Validates input vectors
- [ ] Implements cosine formula correctly
- [ ] Handles zero vectors gracefully
- [ ] Clamps result to [0, 1] range
- [ ] Optimizes for normalized vectors
- [ ] Tests with identical vectors (returns 1.0)
- [ ] Tests with orthogonal vectors (returns 0.0)

---

## Task 43: Create find_similar

### Overview
Implement the find_similar method in the SimilarityCalculator class to identify the most similar products to a given product based on embedding similarity. This method performs similarity search across all products, ranks them by similarity score, and returns the top-k most similar items.

### Dependencies
- Task 42: Create cosine_similarity
- Optimized database queries for large datasets

### Instructions

1. **Add find_similar method**
   - Define method in SimilarityCalculator class
   - Accept query embedding as parameter
   - Accept top_k parameter (default: 20)
   - Return list of tuples: [(product_id, similarity_score)]

2. **Accept multiple input types**
   - Accept Product model instance
   - Accept ProductEmbedding instance
   - Accept raw numpy array
   - Accept product_id and fetch embedding
   - Convert all to numpy array internally

3. **Validate query embedding**
   - Use validate_vector() method
   - Ensure embedding dimension is 384
   - Check for NaN or infinite values
   - Normalize if needed

4. **Fetch candidate embeddings**
   - Query ProductEmbedding.objects.all()
   - Exclude query product itself
   - Use values_list to get (product_id, embedding) tuples
   - Optimize with iterator() for large datasets

5. **Implement similarity calculation**
   - Iterate through candidate embeddings
   - Call cosine_similarity for each candidate
   - Store (product_id, score) tuples
   - Consider batch calculation for performance

6. **Rank results by similarity**
   - Sort results by similarity score (descending)
   - Take top_k results
   - Ensure scores are in [0, 1] range
   - Filter out low-similarity results (optional threshold)

7. **Add filtering options**
   - min_similarity threshold (e.g., 0.5)
   - same_category filter (boolean)
   - active_only filter (boolean)
   - exclude_ids list for excluding products

8. **Implement performance optimizations**
   - Use numpy vectorized operations for batch similarity
   - Implement early stopping if possible
   - Consider caching for repeated queries
   - Use database filtering to reduce candidates

9. **Add Approximate Nearest Neighbors (optional)**
   - For datasets > 10K products, consider ANN
   - Implement FAISS or Annoy indexing
   - Trade accuracy for speed
   - Fall back to brute-force for small datasets

10. **Return formatted results**
    - Return list of (product_id, score) tuples
    - Sort by score descending
    - Limit to top_k results
    - Optionally include Product objects

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| embedding | np.ndarray or Product | Yes | - | Query embedding/product |
| top_k | int | No | 20 | Number of results |
| min_similarity | float | No | 0.0 | Minimum similarity threshold |
| same_category | bool | No | False | Restrict to same category |
| exclude_ids | List[int] | No | [] | Product IDs to exclude |

### Similarity Search Flow

```
┌─────────────────────────────────────┐
│   find_similar(embedding, top_k)    │
└────────────┬────────────────────────┘
             │
             ├─> Validate Input
             │   ├─> Extract embedding vector
             │   ├─> Validate dimensions
             │   └─> Normalize if needed
             │
             ├─> Fetch Candidate Embeddings
             │   ├─> Query ProductEmbedding.objects
             │   ├─> Apply filters (category, active)
             │   ├─> Exclude query product
             │   └─> Get (product_id, embedding) pairs
             │
             ├─> Calculate Similarities
             │   ├─> For each candidate:
             │   │   └─> cosine_similarity(query, candidate)
             │   └─> Store (product_id, score)
             │
             ├─> Rank and Filter
             │   ├─> Sort by score descending
             │   ├─> Filter by min_similarity
             │   └─> Take top_k results
             │
             └─> Return Results
                 └─> List[(product_id, score)]
```

### Brute-Force Implementation

```
Basic Algorithm:
1. Fetch all candidate embeddings
   candidates = ProductEmbedding.objects.values_list(
       'product_id', 'embedding'
   )

2. Calculate similarities
   similarities = []
   for prod_id, candidate_emb in candidates:
       score = cosine_similarity(query_emb, candidate_emb)
       similarities.append((prod_id, score))

3. Sort and return top-k
   similarities.sort(key=lambda x: x[1], reverse=True)
   return similarities[:top_k]

Complexity: O(N) where N = number of products
```

### Vectorized Implementation (Optimized)

```
Fast Algorithm (NumPy):
1. Fetch all embeddings as matrix
   product_ids = []
   embeddings = []
   for prod_id, emb in candidates:
       product_ids.append(prod_id)
       embeddings.append(emb)
   
   embedding_matrix = np.array(embeddings)  # Shape: (N, 384)

2. Batch calculate similarities
   if normalized:
       scores = np.dot(embedding_matrix, query_embedding)
   else:
       scores = cosine_similarity_batch(query_embedding, embedding_matrix)

3. Argsort and take top-k
   top_indices = np.argsort(scores)[::-1][:top_k]
   results = [(product_ids[i], scores[i]) for i in top_indices]

Complexity: O(N) but much faster due to vectorization
Speedup: 10-100x faster than loop
```

### Performance Comparison

| Method | Dataset Size | Time | Throughput |
|--------|--------------|------|------------|
| Brute-Force (loop) | 1K | 50ms | 20 products/sec |
| Brute-Force (loop) | 10K | 500ms | 20 products/sec |
| Vectorized (NumPy) | 1K | 5ms | 200 products/sec |
| Vectorized (NumPy) | 10K | 50ms | 200 products/sec |
| ANN (FAISS) | 100K | 10ms | 100 products/sec |

### Database Query Optimization

```
Optimized QuerySet:
# Base query
candidates = ProductEmbedding.objects.exclude(
    product_id=query_product_id
)

# Filter by category (if requested)
if same_category:
    candidates = candidates.filter(
        product__category_id=query_category_id
    )

# Filter active products only
if active_only:
    candidates = candidates.filter(
        product__active=True
    )

# Exclude specific products
if exclude_ids:
    candidates = candidates.exclude(
        product_id__in=exclude_ids
    )

# Fetch only needed fields
candidates = candidates.values_list(
    'product_id', 'embedding'
)

# Use iterator for memory efficiency (large datasets)
candidates = candidates.iterator(chunk_size=1000)
```

### Filtering Options

| Filter | Parameter | Effect |
|--------|-----------|--------|
| Similarity Threshold | min_similarity=0.5 | Only return score ≥ 0.5 |
| Same Category | same_category=True | Same category only |
| Active Only | active_only=True | Published products only |
| Exclude IDs | exclude_ids=[1,2,3] | Skip specific products |
| In Stock | in_stock=True | Available products only |

### Result Ranking

```
Ranking Strategy:
1. Primary: Similarity Score (descending)
2. Secondary: Popularity (if scores tied)
3. Tertiary: Date added (if still tied)

Implementation:
results.sort(
    key=lambda x: (
        -x[1],  # Similarity (descending)
        -x[2],  # Popularity (descending)
        -x[3]   # Date (descending)
    )
)
```

### Return Value Format

| Format | Structure | Use Case |
|--------|-----------|----------|
| ID + Score | [(id, score)] | Lightweight |
| ID + Score + Product | [(id, score, product)] | Rich data |
| QuerySet | Product.objects.filter(...) | Django integration |
| DataFrame | pd.DataFrame | Analysis |

### Example Return Value

```python
Results Format:
[
    (1234, 0.95),  # Product ID, Similarity Score
    (5678, 0.89),
    (9012, 0.85),
    (3456, 0.82),
    ...
]

Interpretation:
- Product 1234: 95% similar
- Product 5678: 89% similar
- Product 9012: 85% similar
- Product 3456: 82% similar
```

### Approximate Nearest Neighbors (ANN)

| Library | Pros | Cons |
|---------|------|------|
| FAISS | Fast, battle-tested | Complex setup |
| Annoy | Simple, Spotify-backed | Less accurate |
| HNSW | Excellent accuracy | Memory intensive |
| ScaNN | Google-backed | Limited platform |

### FAISS Integration (Optional)

```
Setup FAISS Index:
1. Install: pip install faiss-cpu (or faiss-gpu)

2. Build index:
   import faiss
   
   # Prepare embeddings
   embeddings = np.array([...])  # Shape: (N, 384)
   
   # Create index
   index = faiss.IndexFlatIP(384)  # Inner product
   
   # Add vectors
   index.add(embeddings)

3. Search:
   distances, indices = index.search(query, top_k)
   
   # Convert to product IDs
   results = [(product_ids[i], distances[0][i]) 
              for i in indices[0]]

Speed: 10-100x faster for large datasets (>10K)
```

### When to Use ANN

| Dataset Size | Recommendation |
|--------------|----------------|
| < 1K products | Brute-force (fast enough) |
| 1K - 10K | Vectorized brute-force |
| 10K - 100K | Consider ANN (FAISS) |
| > 100K | Definitely use ANN |
| > 1M | Use distributed ANN |

### Memory Considerations

```
Memory Usage:
- Single embedding: 384 × 4 bytes = 1.5 KB
- 1K embeddings: 1.5 MB
- 10K embeddings: 15 MB
- 100K embeddings: 150 MB
- 1M embeddings: 1.5 GB

Loading Strategy:
- < 10K: Load all into memory
- 10K - 100K: Use iterator, batch process
- > 100K: Use ANN index
```

### Caching Strategy

```
Cache Similar Products:
- Cache key: f"similar:{product_id}:{top_k}"
- Cache TTL: 1-24 hours
- Invalidate: On product update

Benefits:
- Instant response for cached queries
- Reduce computation load
- Better user experience

Considerations:
- Memory usage for cache
- Cache invalidation complexity
- Stale recommendations risk
```

### Expected Outcome
- Functional similarity search method
- Ranked list of similar products
- Configurable filtering and thresholds
- Optimized performance for production

### Verification Checklist
- [ ] find_similar method added to SimilarityCalculator
- [ ] Accepts embedding/product and top_k
- [ ] Validates input embedding
- [ ] Fetches candidate embeddings from database
- [ ] Calculates similarities using cosine_similarity
- [ ] Ranks results by score (descending)
- [ ] Returns list of (product_id, score) tuples
- [ ] Implements filtering options
- [ ] Optimizes with vectorized operations
- [ ] Handles large datasets efficiently
- [ ] Excludes query product from results
- [ ] Tests with various top_k values

---

## Summary

This document established the core embedding and similarity calculation infrastructure for product recommendations. The ProductEmbedder class generates semantic embeddings using the all-MiniLM-L6-v2 model, storing them in the ProductEmbedding model. The SimilarityCalculator class provides efficient cosine similarity computation and similarity search capabilities.

### Completed Tasks
1. ✓ Created ProductEmbedder with model initialization and device selection
2. ✓ Created text_representation for combining product attributes
3. ✓ Created generate_embedding for single product embedding
4. ✓ Created ProductEmbedding model for storing embeddings
5. ✓ Created embedding field with PostgreSQL ArrayField
6. ✓ Created batch_embed for efficient bulk processing
7. ✓ Created SimilarityCalculator for similarity operations
8. ✓ Created cosine_similarity for pairwise comparison
9. ✓ Created find_similar for similarity search

### Next Steps
Proceed to [02_Tasks-44-52_Service-Cache-Verify.md](02_Tasks-44-52_Service-Cache-Verify.md) to create the recommendation service layer, implement caching strategies, create management commands for embedding generation, and add verification/testing utilities.

---

**Document Complete**  
Total Lines: ~879
