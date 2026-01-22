# Group C: Similar Products

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement content-based similar products using embeddings

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Frequently-Bought-Together](../Group-B_Frequently-Bought-Together/)
- **→ Next Group:** [Group-D_Personalized-Recommendations](../Group-D_Personalized-Recommendations/)

---

## Group Overview

This group implements similar products. Creates ProductEmbedder with text_representation to combine product attributes and generate_embedding using sentence transformers. Creates ProductEmbedding model with embedding vector field. Creates batch_embed for bulk processing. Creates SimilarityCalculator with cosine_similarity and find_similar methods. Creates SimilarProductsService with get_similar, category_filter, and price_filter methods. Creates EmbeddingTask as Celery task. Creates similarity cache and new product embedding. Creates admin interface. Verifies similar products.

### Key Outcomes

- ProductEmbedder
- text_representation method
- generate_embedding method
- ProductEmbedding model
- embedding field
- batch_embed method
- SimilarityCalculator
- cosine_similarity method
- find_similar method
- SimilarProductsService
- get_similar method
- category_filter method
- price_filter method
- EmbeddingTask
- Similarity cache
- New product embedding
- Similar admin
- Similar products verified

### Technology Context

- **Embeddings:** Sentence Transformers
- **Model:** all-MiniLM-L6-v2
- **Similarity:** Cosine distance
- **Storage:** Vector in DB

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-43_Embedder-Similarity.md` | Create embedder and similarity | 35-43 |
| 02 | `02_Tasks-44-52_Service-Cache-Verify.md` | Create service, cache, verify | 44-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create ProductEmbedder | High | Task 34 |
| 36 | Create text_representation | Medium | Task 35 |
| 37 | Create generate_embedding | Medium | Task 36 |
| 38 | Create ProductEmbedding Model | Medium | Task 37 |
| 39 | Create embedding Field | Medium | Task 38 |
| 40 | Create batch_embed | Medium | Task 39 |
| 41 | Create SimilarityCalculator | Medium | Task 40 |
| 42 | Create cosine_similarity | Low | Task 41 |
| 43 | Create find_similar | Medium | Task 42 |
| 44 | Create SimilarProductsService | High | Task 43 |
| 45 | Create get_similar Method | Medium | Task 44 |
| 46 | Create category_filter | Low | Task 45 |
| 47 | Create price_filter | Low | Task 45 |
| 48 | Create EmbeddingTask | Medium | Task 47 |
| 49 | Create Similarity Cache | Medium | Task 48 |
| 50 | Create New Product Embedding | Medium | Task 48 |
| 51 | Create Similar Admin | Medium | Task 44 |
| 52 | Verify Similar Products | Low | Task 51 |

---

## Execution Order

```
Task 35: ProductEmbedder
    │
    ▼
Task 36: text_representation
    │
    ▼
Task 37: generate_embedding
    │
    ▼
Task 38: ProductEmbedding Model
    │
    ▼
Task 39: embedding Field
    │
    ▼
Task 40: batch_embed
    │
    ▼
Task 41: SimilarityCalculator
    │
    ├────────┐
    ▼        ▼
T-42      T-43
(Cosine)(Similar)
    │        │
    └────────┘
         │
         ▼
Task 44: SimilarProductsService
         │
    ┌────┼────┬─────────────────────┐
    ▼    ▼    ▼                     ▼
T-45    T-46  T-47                T-51
(Get)  (Cat)(Price)             (Admin)
    │    │    │                     │
    └────┴────┘                     │
         │                          │
    ┌────┴────┬────────┐            │
    ▼         ▼        ▼            │
T-48       T-49      T-50           │
(Task)   (Cache) (NewEmbed)         │
    │         │        │            │
    └─────────┴────────┴────────────┘
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
        └── recommendations/
            ├── models/
            │   └── product_embedding.py
            ├── algorithms/
            │   ├── embedder.py
            │   └── similarity.py
            ├── services/
            │   └── similar_service.py
            └── tasks/
                └── embedding_tasks.py
```

---

## Notes for AI Agents

### ProductEmbedder (Task 35)
| Class | ProductEmbedder |
|-------|-----------------|
| Purpose | Generate product embeddings |
| Model | all-MiniLM-L6-v2 |

### text_representation (Task 36)
| Method | text_representation(product) |
|--------|------------------------------|
| Return | Combined text string |
| Fields | name + description + category + brand |

### Text Representation Format
| Component | Source |
|-----------|--------|
| Name | product.name |
| Description | product.description |
| Category | product.category.name |
| Brand | product.brand |
| Tags | product.tags |

### generate_embedding (Task 37)
| Method | generate_embedding(text) |
|--------|--------------------------|
| Return | 384-dimensional vector |
| Model | SentenceTransformer |

### ProductEmbedding Model (Task 38)
| Class | ProductEmbedding |
|-------|------------------|
| Purpose | Store embeddings |
| OneToOne | Product |

### embedding Field (Task 39)
| Field | Type |
|-------|------|
| Name | embedding |
| Type | ArrayField(FloatField) |
| Size | 384 |

### batch_embed (Task 40)
| Method | batch_embed(products, batch_size=100) |
|--------|---------------------------------------|
| Action | Embed multiple products |
| Use | Initial/full embedding |

### SimilarityCalculator (Task 41)
| Class | SimilarityCalculator |
|-------|----------------------|
| Purpose | Calculate similarity |

### cosine_similarity (Task 42)
| Method | cosine_similarity(vec1, vec2) |
|--------|-------------------------------|
| Return | Similarity score 0-1 |
| Formula | dot(A, B) / (norm(A) * norm(B)) |

### find_similar (Task 43)
| Method | find_similar(embedding, top_k=20) |
|--------|-----------------------------------|
| Return | List of (product_id, score) |
| Algorithm | Brute-force or ANN |

### SimilarProductsService (Task 44)
| Class | SimilarProductsService |
|-------|------------------------|
| Purpose | Similar products |

### get_similar Method (Task 45)
| Method | get_similar(product_id, limit=10) |
|--------|-----------------------------------|
| Return | Similar products |
| Cache | Check Redis first |

### category_filter (Task 46)
| Filter | Same category only |
|--------|-------------------|
| Option | same_category=True |

### price_filter (Task 47)
| Filter | Within price range |
|--------|-------------------|
| Option | price_range=0.2 (±20%) |

### EmbeddingTask (Task 48)
| Task | embed_products_task |
|------|---------------------|
| Type | Celery task |
| Queue | training |

### Similarity Cache (Task 49)
| Key | similar:{tenant}:{product_id} |
|-----|------------------------------|
| TTL | 24 hours |

### New Product Embedding (Task 50)
| Trigger | Product created/updated |
|---------|------------------------|
| Action | Generate embedding |
| Signal | post_save Product |
