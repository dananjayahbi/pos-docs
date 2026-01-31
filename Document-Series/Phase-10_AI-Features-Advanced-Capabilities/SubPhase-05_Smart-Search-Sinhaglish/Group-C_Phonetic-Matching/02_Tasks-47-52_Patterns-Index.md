# Tasks 47-52: Transliteration Patterns and Phonetic Index

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** C - Phonetic Matching  
> **Document:** 02 of 02  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-37-46_Encoder-Matcher.md](01_Tasks-37-46_Encoder-Matcher.md)

---

## Document Overview

This document covers the creation of transliteration pattern handling and phonetic indexing for the Sinhaglish search system. It establishes common romanization patterns (th, aa, etc.), implements pattern normalization for consistent matching, and creates the phonetic indexing infrastructure that automatically generates and maintains phonetic keys for all Sinhala words in the database.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Create TransliterationPatterns | Medium | 45 min |
| 48 | Create th Pattern | Low | 25 min |
| 49 | Create aa Pattern | Low | 25 min |
| 50 | Create Pattern Matcher | Medium | 40 min |
| 51 | Create Index Phonetics | Medium | 50 min |
| 52 | Verify Phonetic | Low | 30 min |

---

## Task 47: Create TransliterationPatterns

### Overview
Create the TransliterationPatterns class that defines and manages common romanization variations for Sinhala letters. This class handles the fact that users may romanize the same Sinhala word differently (e.g., "th" vs "t" for ත, "aa" vs "a" for ආ), enabling the search system to normalize these variations for consistent matching.

### Dependencies
- Task 36: TransliterationIndex (from Group B)
- Python typing and dataclasses

### Instructions

1. **Create patterns implementation file**
   - Create `patterns.py` file in the phonetic directory
   - Import necessary typing modules (Dict, List, Set)
   - Import dataclasses for pattern definition
   - Set up logging configuration

2. **Define Pattern dataclass**
   - Create Pattern dataclass with fields:
     - romanized: str (romanization pattern, e.g., "th")
     - sinhala: str (corresponding Sinhala letter, e.g., "ත")
     - alternatives: List[str] (alternative romanizations)
     - description: str (explanation of pattern)
   - Add validation for required fields

3. **Create TransliterationPatterns class**
   - Define class to manage all patterns
   - Initialize with pattern registry (Dict[str, Pattern])
   - Add methods for pattern registration and lookup
   - Document class purpose and usage

4. **Define pattern categories**
   - Consonant digraphs: th, dh, ch, ng, sh
   - Long vowels: aa, ee, ii, oo, uu
   - Special consonants: retroflex variants
   - Mixed patterns: combined consonant-vowel sequences

5. **Implement pattern registration**
   - Add method `register_pattern(self, pattern: Pattern) -> None`
   - Store pattern in registry by romanized key
   - Check for duplicate patterns
   - Log pattern registration

6. **Implement pattern lookup**
   - Add method `get_pattern(self, romanized: str) -> Optional[Pattern]`
   - Return Pattern object if found
   - Return None if pattern not registered
   - Case-insensitive lookup

7. **Add pattern listing methods**
   - Method `get_all_patterns(self) -> List[Pattern]`
   - Method `get_patterns_by_category(self, category: str) -> List[Pattern]`
   - Method `get_alternatives(self, romanized: str) -> List[str]`
   - Enable pattern discovery and exploration

8. **Create default pattern set**
   - Define method `_initialize_default_patterns(self) -> None`
   - Register common Sinhala romanization patterns
   - Call during class initialization
   - Ensure comprehensive coverage

### TransliterationPatterns Class Structure

```
TransliterationPatterns
├── Attributes
│   ├── patterns: Dict[str, Pattern]
│   ├── categories: Dict[str, List[Pattern]]
│   └── logger: Logger
├── Public Methods
│   ├── register_pattern(pattern) → None
│   ├── get_pattern(romanized) → Optional[Pattern]
│   ├── get_all_patterns() → List[Pattern]
│   ├── get_alternatives(romanized) → List[str]
│   └── normalize(text) → str (Task 50)
└── Private Methods
    ├── _initialize_default_patterns() → None
    ├── _validate_pattern(pattern) → bool
    └── _log_registration(pattern) → None
```

### Pattern Dataclass Structure

```python
@dataclass
class Pattern:
    """
    Represents a romanization pattern.
    
    Attributes:
        romanized: Standard romanization (e.g., "th")
        sinhala: Sinhala character (e.g., "ත")
        alternatives: Other romanizations (e.g., ["t"])
        description: Explanation of pattern
    """
    romanized: str
    sinhala: str
    alternatives: List[str]
    description: str
```

### Pattern Categories

| Category | Description | Examples | Count |
|----------|-------------|----------|-------|
| Consonant Digraphs | Two-letter consonant sounds | th, dh, ch, ng, sh | 5+ |
| Long Vowels | Extended vowel sounds | aa, ee, oo | 5+ |
| Retroflex | Tongue-curled consonants | ta, da, na | 3+ |
| Special | Unique Sinhala sounds | nga, nya, nda | 3+ |

### Common Pattern Examples

| Romanized | Sinhala | Alternatives | Sound | Usage Example |
|-----------|---------|--------------|-------|---------------|
| th | ත | t | Soft t | thel, thambili |
| dh | ද | d | Soft d | dhodol, dhiya |
| aa | ආ | a | Long a | kaama, maama |
| ee | ඊ | e, i | Long e | theel, keeri |
| oo | ඕ | o | Long o | mool, kool |
| ch | ච | c | Ch sound | choon, achcharu |
| ng | ං | n | Ng sound | inguru, anga |
| sh | ශ | s | Sh sound | shani, aaash |

### Pattern Registry Structure

```
Pattern Registry (Dictionary):
{
    'th': Pattern(
        romanized='th',
        sinhala='ත',
        alternatives=['t'],
        description='Soft dental t'
    ),
    'aa': Pattern(
        romanized='aa',
        sinhala='ආ',
        alternatives=['a', 'aah'],
        description='Long vowel a'
    ),
    ...
}
```

### Pattern Initialization Flow

```
TransliterationPatterns()
    │
    ▼
__init__()
    │
    ├─ Initialize empty registry
    ├─ Initialize category mapping
    ├─ Setup logging
    │
    ▼
_initialize_default_patterns()
    │
    ├─ Register consonant digraphs (th, dh, ch, ng, sh)
    ├─ Register long vowels (aa, ee, ii, oo, uu)
    ├─ Register retroflex consonants
    ├─ Register special patterns
    │
    ▼
Ready for use
```

### Usage Example Flow

```
┌────────────────────────────────────┐
│  User Input: "tel" or "thel"       │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Pattern Lookup                    │
│  Check if "th" is registered       │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Get Alternatives                  │
│  "th" alternatives: ["t"]          │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Normalize Both                    │
│  "tel" and "thel" → same pattern   │
└────────────────────────────────────┘
```

### Expected Outcome
- TransliterationPatterns class for managing patterns
- Pattern dataclass for structured pattern data
- Pattern registry with lookup capabilities
- Default patterns initialized automatically
- Foundation for pattern matching and normalization
- Comprehensive pattern coverage for Sinhala romanization

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/phonetic/patterns.py` file created
- [ ] Pattern dataclass defined with all fields
- [ ] TransliterationPatterns class created
- [ ] Pattern registry (Dict) initialized
- [ ] register_pattern method implemented
- [ ] get_pattern method implemented
- [ ] get_all_patterns method implemented
- [ ] get_alternatives method implemented
- [ ] _initialize_default_patterns method created
- [ ] Class initialization calls default pattern setup
- [ ] Logging configured
- [ ] Ready for pattern registration in Task 48-49

---

## Task 48: Create th Pattern

### Overview
Register the "th" transliteration pattern that represents the Sinhala soft dental consonant ත (tha). This pattern is one of the most common romanization variations, where users may write "th" or simply "t" for the same Sinhala letter, requiring normalization for consistent matching.

### Dependencies
- Task 47: Create TransliterationPatterns

### Instructions

1. **Define th pattern data**
   - Romanized form: "th"
   - Sinhala character: "ත"
   - Alternatives: ["t"]
   - Description: "Soft dental t sound (ත)"

2. **Create pattern instance**
   - Use Pattern dataclass from Task 47
   - Instantiate with th pattern data
   - Validate all required fields present

3. **Register in default patterns**
   - Add to _initialize_default_patterns method
   - Call register_pattern with th Pattern instance
   - Ensure registration happens during initialization

4. **Document th pattern usage**
   - Add inline comments explaining usage
   - Document common words using th pattern
   - Examples: thel (oil), thambili (king coconut), thakkali (tomato)

5. **Add pattern validation**
   - Verify th is at least 2 characters
   - Ensure alternatives don't conflict
   - Validate Sinhala character is correct

6. **Create pattern test cases**
   - Test words: "thel", "tel"
   - Both should normalize to same pattern
   - Both should produce same phonetic key

7. **Add to documentation**
   - Document th → ත mapping
   - Explain pronunciation: soft "t" with tongue on teeth
   - Contrast with hard "t" (ට retroflex)

### th Pattern Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Romanized | th | Standard two-letter romanization |
| Sinhala | ත | Soft dental consonant |
| Alternatives | [t] | Common single-letter variant |
| Sound | Soft t | Like "t" in "theta" (Greek) |
| IPA | t̪ʰ | Dental aspirated t |

### Sinhala Letter Information

```
Letter: ත (tha)
├── Unicode: U+0DAD
├── Position: Dental
├── Aspiration: Aspirated
├── Type: Consonant
├── Romanization: th (standard), t (alternative)
└── Sound: Soft dental t
```

### Common Words with th Pattern

| Sinhala | Standard Romanization | Alternative | Meaning | Phonetic Key |
|---------|----------------------|-------------|---------|--------------|
| තෙල් | thel | tel | oil | T400 |
| තඹිලි | thambili | tambili | king coconut | T514 |
| තක්කාලි | thakkali | takkali | tomato | T240 |
| තව | thawa | tawa | more | T100 |
| තාත්තා | thaaththa | thaatta | father | T300 |

### Pattern Registration Code Flow

```
_initialize_default_patterns():
    │
    ├─ Create th Pattern instance
    │  Pattern(
    │      romanized='th',
    │      sinhala='ත',
    │      alternatives=['t'],
    │      description='Soft dental t sound (ත)'
    │  )
    │
    ├─ Register pattern
    │  self.register_pattern(th_pattern)
    │
    └─ Log registration
       "Registered pattern: th → ත"
```

### Normalization Example with th Pattern

```
Input 1: "thel"
    │
    ▼
Detect pattern: "th" found
    │
    ▼
Normalize: Keep as "thel" (standard form)
    │
    ▼
Phonetic: "T400"

Input 2: "tel"
    │
    ▼
Check alternatives: "t" is alternative to "th"
    │
    ▼
Normalize: Convert to "thel" (standard form)
    │
    ▼
Phonetic: "T400"

Result: Both produce "T400" ✓
```

### Pattern Matching Rules

| Input | Pattern Match | Action | Output |
|-------|---------------|--------|--------|
| thel | Exact (th) | Keep as is | thel |
| tel | Alternative (t→th) | Normalize to standard | thel |
| tthel | Invalid | Process as-is | tthel |
| thael | Contains th | Partial match | thael |

### Pronunciation Guide

```
ත (tha) - Soft dental t
├── Tongue: Touches upper teeth (dental)
├── Air: Slight aspiration
├── Sound: Like "th" in "Thailand"
├── NOT like: "th" in "the" (that's ð)
└── Compare: English "t" is retroflex (tongue further back)
```

### Expected Outcome
- th pattern registered in TransliterationPatterns
- Pattern maps th ↔ t bidirectionally
- Common th words identified and documented
- Normalization rules established
- Integration with phonetic encoding

### Verification Checklist
- [ ] th Pattern instance created with correct data
- [ ] Pattern registered in _initialize_default_patterns
- [ ] Romanized field = "th"
- [ ] Sinhala field = "ත"
- [ ] Alternatives list = ["t"]
- [ ] Description clear and accurate
- [ ] get_pattern("th") returns correct Pattern
- [ ] get_alternatives("th") returns ["t"]
- [ ] Common words documented (thel, thambili, thakkali)
- [ ] Pattern produces correct phonetic keys

---

## Task 49: Create aa Pattern

### Overview
Register the "aa" transliteration pattern that represents the Sinhala long vowel ආ (aa). This pattern handles variations where users may write "aa", "a", or "aah" for the same long vowel sound, ensuring consistent matching regardless of spelling preference.

### Dependencies
- Task 47: Create TransliterationPatterns

### Instructions

1. **Define aa pattern data**
   - Romanized form: "aa"
   - Sinhala character: "ආ"
   - Alternatives: ["a", "aah"]
   - Description: "Long vowel a sound (ආ)"

2. **Create pattern instance**
   - Use Pattern dataclass from Task 47
   - Instantiate with aa pattern data
   - Validate all required fields

3. **Register in default patterns**
   - Add to _initialize_default_patterns method
   - Register after consonant patterns
   - Group with other long vowel patterns

4. **Document aa pattern usage**
   - Explain long vs short vowel distinction
   - Common words: kaama (food), maama (uncle), baala (bucket)
   - Note pronunciation difference: "aa" is longer than "a"

5. **Handle pattern ordering**
   - Ensure aa is processed before single "a"
   - Longer patterns must be checked first
   - Prevents incorrect matching (aa → a + a)

6. **Add pattern priority**
   - Mark aa as high-priority pattern
   - Process during preprocessing (before phonetic encoding)
   - Maintain pattern processing order

7. **Create additional long vowel patterns**
   - ee pattern: ඊ (long e)
   - ii pattern: ඊ (alternative long i)
   - oo pattern: ඕ (long o)
   - uu pattern: ඌ (long u)
   - Register all together

### aa Pattern Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Romanized | aa | Standard long vowel notation |
| Sinhala | ආ | Independent long vowel letter |
| Alternatives | [a, aah] | Short form and explicit long form |
| Sound | Long a | Like "a" in "father" |
| Duration | 2x longer | Double length of short අ |

### Long Vowel System in Sinhala

```
Short Vowels vs Long Vowels:

අ (a) - short      ආ (aa) - long
එ (e) - short      ඊ (ee/ii) - long
ඉ (i) - short      ඊ (ee/ii) - long
ඔ (o) - short      ඕ (oo) - long
උ (u) - short      ඌ (uu) - long
```

### All Long Vowel Patterns

| Pattern | Sinhala | Alternatives | Sound | Example Words |
|---------|---------|--------------|-------|---------------|
| aa | ආ | a, aah | Long a | kaama, maama, baala |
| ee | ඊ | e, i | Long e | theel, peen, keeri |
| ii | ඊ | i | Long i | diiga, piita |
| oo | ඕ | o | Long o | mool, kool, oot |
| uu | ඌ | u, ooh | Long u | suuru, puutu |

### Common Words with aa Pattern

| Sinhala | Standard | Alternatives | Meaning | Phonetic Key |
|---------|----------|--------------|---------|--------------|
| කෑම | kaama | kama, kaamaa | food | K500 |
| මාමා | maama | mama | uncle | M500 |
| බාල්දිය | baala | bala, baaldiya | bucket | B400 |
| පාන | paana | pana | beverage | P500 |
| සාමාන්‍ය | saamaanya | samanya | ordinary | S550 |

### Pattern Priority and Processing Order

```
Text: "kaama"
    │
    ▼
Step 1: Check long vowels FIRST (high priority)
    Pattern match: "aa" found
    │
    ▼
Step 2: Replace with placeholder
    "kaama" → "kAma" (A = placeholder for long a)
    │
    ▼
Step 3: Process other patterns
    Check for digraphs, etc.
    │
    ▼
Step 4: Phonetic encoding
    "kAma" → "K500"
```

### Why Order Matters

```
Wrong Order (aa after a):
"kaama"
├─ Match "a" → "k[a]ama" (wrong!)
├─ Match "a" → "ka[a]ma" (wrong!)
└─ Miss the "aa" pattern

Correct Order (aa before a):
"kaama"
└─ Match "aa" → "k[aa]ma" (correct!)
```

### Pattern Registration for All Long Vowels

```python
# Pseudocode in _initialize_default_patterns()

# Register long vowels (process before short vowels)
self.register_pattern(Pattern(
    romanized='aa',
    sinhala='ආ',
    alternatives=['a', 'aah'],
    description='Long vowel a (ආ)'
))

self.register_pattern(Pattern(
    romanized='ee',
    sinhala='ඊ',
    alternatives=['e', 'i'],
    description='Long vowel e/i (ඊ)'
))

# Continue for ii, oo, uu...
```

### Normalization Examples

| Input | Pattern Detected | Normalized | Phonetic Key |
|-------|------------------|------------|--------------|
| kaama | aa | kaama | K500 |
| kama | a (short) | kama | K500 |
| kaamaa | aa + a | kaama | K500 |
| maama | aa | maama | M500 |
| mama | a (short) | mama | M500 |

### Long vs Short Vowel Impact

```
Short Vowel (අ):
"kala" (කල)
├─ Meaning: art, time
└─ Phonetic: K400

Long Vowel (ආ):
"kaala" (කාල)
├─ Meaning: time, era
└─ Phonetic: K400

Note: Same phonetic key despite different meanings
(Phonetic matching focuses on sound, not meaning)
```

### Expected Outcome
- aa pattern registered for long vowel ආ
- All long vowel patterns registered (ee, ii, oo, uu)
- Pattern processing order established
- Alternatives documented and functional
- Integration with preprocessing pipeline
- Consistent handling of long vowel variations

### Verification Checklist
- [ ] aa Pattern instance created correctly
- [ ] Pattern registered in _initialize_default_patterns
- [ ] Romanized field = "aa"
- [ ] Sinhala field = "ආ"
- [ ] Alternatives list = ["a", "aah"]
- [ ] Description accurate
- [ ] Additional long vowels registered (ee, ii, oo, uu)
- [ ] Pattern priority/order configured
- [ ] get_pattern("aa") returns correct Pattern
- [ ] get_alternatives("aa") returns ["a", "aah"]
- [ ] Common words tested (kaama, maama, baala)
- [ ] Long vowel preprocessing works correctly

---

## Task 50: Create Pattern Matcher

### Overview
Implement the pattern matching and normalization functionality that applies transliteration patterns to user queries, standardizing various romanization styles to a consistent form before phonetic encoding. This ensures that "thel" and "tel" are treated equivalently, improving search recall.

### Dependencies
- Task 47: Create TransliterationPatterns
- Task 48: Create th Pattern
- Task 49: Create aa Pattern

### Instructions

1. **Implement apply_patterns method**
   - Add to TransliterationPatterns class
   - Method signature: `apply_patterns(self, text: str) -> str`
   - Accept romanized text input
   - Return normalized text with patterns applied

2. **Implement pattern detection**
   - Scan text for registered patterns
   - Match longer patterns first (aa before a, th before t)
   - Use greedy matching to prevent partial matches
   - Track matched positions to avoid overlaps

3. **Create pattern replacement logic**
   - Replace matched patterns with standard forms
   - Alternatives are converted to primary romanization
   - Example: "tel" → "thel", "kama" → "kaama"
   - Maintain text structure (don't affect other characters)

4. **Implement pattern ordering**
   - Sort patterns by length (longest first)
   - Process digraphs (th, dh, ch) before single letters
   - Process long vowels (aa, ee) before short vowels
   - Create method `_get_ordered_patterns(self) -> List[Pattern]`

5. **Add normalization strategy**
   - Decision: normalize to standard OR keep original?
   - Recommended: normalize alternatives TO standard form
   - Example: "t" → "th", "a" → "aa" (when contextually appropriate)
   - Document strategy in comments

6. **Implement context-aware matching**
   - Consider surrounding characters
   - Don't match "a" in "aa" (already handled)
   - Don't match "t" in "th" (already handled)
   - Use regex or position tracking

7. **Add special case handling**
   - Handle word boundaries (start/end)
   - Handle combined patterns ("thaa", "dhoo")
   - Preserve non-Sinhala characters (numbers, punctuation)
   - Maintain capitalization (convert to lowercase first)

8. **Create reverse normalization**
   - Add method `expand_pattern(self, text: str) -> List[str]`
   - Generate all alternative romanizations
   - Example: "thel" → ["thel", "tel"]
   - Useful for comprehensive search

9. **Integrate with preprocessing pipeline**
   - Call apply_patterns in SinhalaSoundex._preprocess
   - Apply before digraph substitution
   - Apply before case conversion
   - Log normalization for debugging

10. **Add performance optimization**
    - Cache ordered pattern list
    - Use compiled regex for pattern matching
    - Minimize string operations
    - Profile and optimize hot paths

### Pattern Application Flow

```
Input: "tel kama mama"
    │
    ▼
Step 1: Prepare (lowercase, trim)
    "tel kama mama"
    │
    ▼
Step 2: Get ordered patterns (longest first)
    Patterns: [th, aa, dh, ee, oo, ...]
    │
    ▼
Step 3: Apply pattern normalization
    "tel" → check for "t" alternative → convert to "th" → "thel"
    "kama" → check for "a" alternative → ambiguous, keep as is
    "mama" → check for "a" alternative → ambiguous, keep as is
    │
    ▼
Step 4: Result
    "thel kama mama"
    │
    ▼
Step 5: Further processing (phonetic encoding)
    "thel" → "T400"
    "kama" → "K500"
    "mama" → "M500"
```

### Pattern Ordering Strategy

| Priority | Pattern Type | Examples | Reason |
|----------|--------------|----------|--------|
| 1 | Longest patterns | thaa, dhoo | Prevent partial matches |
| 2 | Digraphs | th, dh, ch, ng, sh | Multi-character consonants |
| 3 | Long vowels | aa, ee, oo | Multi-character vowels |
| 4 | Single consonants | k, g, b | Basic letters |
| 5 | Single vowels | a, e, i | Basic vowels |

### Context-Aware Matching Example

```
Text: "thaata"
       │││││
       │││└└─ "aa" pattern (long vowel)
       ││└─── "a" (skip - part of "aa")
       │└──── "th" pattern (digraph)
       └───── "t" (skip - part of "th")

Result: Keep "thaata" (both patterns already standard)

Text: "taata"
       ││││
       ││└└─ "aa" pattern (long vowel)
       │└─── "a" (skip - part of "aa")
       └──── "t" → should normalize to "th"?
              NO - context shows not dental t

Context checking required!
```

### Ambiguity Handling

| Input | Pattern Matches | Action | Reason |
|-------|-----------------|--------|--------|
| tel | t (th alt) | Normalize to "thel" | Clear alternative |
| kama | a (aa alt) | Keep as "kama" | Ambiguous: could be short vowel |
| thel | th (standard) | Keep as "thel" | Already standard |
| kaama | aa (standard) | Keep as "kaama" | Already standard |

### apply_patterns Method Structure

```python
def apply_patterns(self, text: str) -> str:
    """
    Apply transliteration patterns to normalize text.
    
    Converts alternative romanizations to standard forms
    for consistent phonetic encoding.
    
    Args:
        text: Romanized Sinhala text (e.g., "tel kama")
        
    Returns:
        Normalized text (e.g., "thel kaama")
        
    Examples:
        >>> patterns.apply_patterns("tel")
        "thel"
        >>> patterns.apply_patterns("kama")
        "kaama"  # If long vowel detected
    """
    # Implementation normalizes patterns
```

### Pattern Replacement Algorithm

```
1. Prepare text
   - Convert to lowercase
   - Trim whitespace

2. Get ordered patterns
   - Sort by length (descending)
   - Cache for performance

3. Iterate through patterns
   - For each pattern:
     - Check if romanized form exists in text
     - Check if alternatives exist in text
     - Replace alternatives with romanized form
   
4. Return normalized text
```

### Normalization Examples

| Original | Patterns Applied | Normalized | Phonetic Key |
|----------|------------------|------------|--------------|
| tel | t → th | thel | T400 |
| kama | a → aa (context) | kaama | K500 |
| tambili | t → th | thambili | T514 |
| keri | (no change) | keri | K600 |
| mool | oo (already standard) | mool | M400 |

### Reverse Normalization (expand_pattern)

```
Input: "thel"
    │
    ▼
Find patterns: "th"
    │
    ▼
Get alternatives: ["t"]
    │
    ▼
Generate variants:
├─ "thel" (original)
└─ "tel" (alternative)
    │
    ▼
Return: ["thel", "tel"]
```

### Integration with Phonetic Pipeline

```
SinhalaSoundex.encode("tel")
    │
    ▼
_preprocess("tel")
    │
    ├─ Apply patterns: "tel" → "thel"
    ├─ Handle digraphs: "thel" → "Tel"
    ├─ Handle long vowels: "Tel" → "Tel"
    ├─ Uppercase: "Tel" → "TEL"
    │
    ▼
_map_consonants("TEL")
    │
    ▼
Result: "T400"
```

### Expected Outcome
- Pattern matching and normalization functional
- apply_patterns method normalizes text
- Pattern ordering ensures correct matching
- Context-aware processing prevents errors
- Integration with phonetic encoding pipeline
- Improved search recall through normalization

### Verification Checklist
- [ ] apply_patterns method implemented
- [ ] Pattern ordering by length (longest first)
- [ ] Pattern detection working correctly
- [ ] Alternative to standard conversion functional
- [ ] Context-aware matching implemented
- [ ] Special cases handled (word boundaries, etc.)
- [ ] expand_pattern method for reverse normalization
- [ ] Integration with SinhalaSoundex._preprocess
- [ ] Logging for pattern application
- [ ] Performance optimizations applied
- [ ] Test cases: "tel" → "thel", "kama" → normalized
- [ ] Ambiguous cases handled appropriately

---

## Task 51: Create Index Phonetics

### Overview
Implement the phonetic indexing system that automatically generates and stores phonetic keys for all Sinhala words in the database. This indexing happens during word creation and updates, ensuring the phonetic_key field is always current and searchable.

### Dependencies
- Task 50: Create Pattern Matcher
- Task 38: SinhalaSoundex
- SinhalaWord model (from Group B)
- Django signals

### Instructions

1. **Add phonetic_key field to SinhalaWord model**
   - Navigate to SinhalaWord model definition
   - Add field: `phonetic_key = models.CharField(max_length=4, db_index=True)`
   - Set db_index=True for query performance
   - Allow blank=True for existing records

2. **Create database index**
   - Add database index on phonetic_key field
   - Use Django Meta class: `indexes = [models.Index(fields=['phonetic_key'])]`
   - Generate and run migration
   - Verify index created in database

3. **Implement signal handler for word creation**
   - Create file: `backend/apps/search/sinhaglish/signals.py`
   - Import Django signals (post_save, pre_save)
   - Import SinhalaWord model and SinhalaSoundex
   - Define signal receiver function

4. **Implement phonetic key generation on save**
   - Use pre_save signal to set phonetic_key before saving
   - Extract romanized field from SinhalaWord instance
   - Encode using SinhalaSoundex
   - Set phonetic_key field on instance
   - Signal should trigger automatically

5. **Handle phonetic key updates**
   - Regenerate phonetic_key when romanized field changes
   - Check if romanized has changed (compare with database)
   - Update phonetic_key only if necessary
   - Avoid unnecessary recomputation

6. **Create bulk indexing command**
   - Create Django management command: `index_phonetics`
   - Location: `backend/apps/search/management/commands/index_phonetics.py`
   - Command should update phonetic_key for all existing words
   - Display progress bar and statistics

7. **Implement batch processing**
   - Process words in batches (e.g., 1000 at a time)
   - Use bulk_update for efficiency
   - Log progress: "Indexed 1000/5000 words (20%)"
   - Handle errors gracefully (log and continue)

8. **Add index verification**
   - Create method to verify index integrity
   - Check that all words have phonetic_keys
   - Identify words with missing or invalid keys
   - Report statistics

9. **Implement reindexing logic**
   - Add flag to force reindex even if key exists
   - Useful after algorithm changes
   - Command option: `--force` or `--rebuild`
   - Log reindexing operations

10. **Add monitoring and logging**
    - Log all phonetic key generations
    - Track indexing performance
    - Log errors during encoding
    - Create index health check

### Phonetic Indexing Architecture

```
┌──────────────────────────────────────┐
│     SinhalaWord Model                │
│  ┌────────────────────────────────┐ │
│  │ id: int                        │ │
│  │ romanized: str                 │ │
│  │ sinhala: str                   │ │
│  │ phonetic_key: str (indexed)    │ │ ← New field
│  │ fuzzy_key: str                 │ │
│  │ frequency: int                 │ │
│  └────────────────────────────────┘ │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│      Signal Handler                  │
│  ┌────────────────────────────────┐ │
│  │ @receiver(pre_save)            │ │
│  │ def generate_phonetic_key()    │ │
│  │   - Get romanized field        │ │
│  │   - Encode with SinhalaSoundex │ │
│  │   - Set phonetic_key field     │ │
│  └────────────────────────────────┘ │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│     Database Table                   │
│  ┌────────────────────────────────┐ │
│  │ id | romanized | phonetic_key  │ │
│  │ 1  | kiri      | K600          │ │
│  │ 2  | thel      | T400          │ │
│  │ 3  | badu      | B130          │ │
│  │ ... (indexed for fast lookup) │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Signal Handler Implementation Flow

```
User creates/updates SinhalaWord
    │
    ▼
pre_save signal triggered
    │
    ▼
generate_phonetic_key(sender, instance, **kwargs)
    │
    ├─ Check if romanized field exists
    │
    ├─ Check if romanized has changed
    │  (compare with database value)
    │
    ├─ If changed or new:
    │  ├─ Initialize SinhalaSoundex
    │  ├─ Encode: phonetic_key = encoder.encode(instance.romanized)
    │  └─ Set: instance.phonetic_key = phonetic_key
    │
    ▼
Word saved to database with phonetic_key
```

### Bulk Indexing Command Flow

```
$ python manage.py index_phonetics

┌────────────────────────────────────┐
│  Load all SinhalaWord objects      │
│  Total: 10,000 words               │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Initialize SinhalaSoundex         │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Process in batches of 1000        │
│  ┌──────────────────────────────┐ │
│  │ Batch 1: Words 1-1000        │ │
│  │  - Encode each word          │ │
│  │  - Set phonetic_key          │ │
│  │  - Bulk update database      │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ Batch 2: Words 1001-2000     │ │
│  └──────────────────────────────┘ │
│  ... (continue for all batches)   │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Report Statistics                 │
│  - Total indexed: 10,000           │
│  - Successful: 9,987               │
│  - Failed: 13                      │
│  - Duration: 45 seconds            │
└────────────────────────────────────┘
```

### Database Migration

```sql
-- Migration generated by Django
ALTER TABLE search_sinhalaword 
ADD COLUMN phonetic_key VARCHAR(4);

-- Create index for performance
CREATE INDEX idx_phonetic_key 
ON search_sinhalaword (phonetic_key);
```

### Signal Handler Pseudocode

```python
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import SinhalaWord
from .phonetic.soundex import SinhalaSoundex

@receiver(pre_save, sender=SinhalaWord)
def generate_phonetic_key(sender, instance, **kwargs):
    """
    Automatically generate phonetic key for SinhalaWord.
    
    Triggers before save operation.
    """
    if instance.romanized:
        # Check if romanized changed (for updates)
        if instance.pk:  # Existing record
            try:
                old_instance = SinhalaWord.objects.get(pk=instance.pk)
                if old_instance.romanized == instance.romanized:
                    return  # No change, skip reindexing
            except SinhalaWord.DoesNotExist:
                pass
        
        # Generate phonetic key
        encoder = SinhalaSoundex()
        instance.phonetic_key = encoder.encode(instance.romanized)
        
        # Log operation
        logger.info(f"Indexed: {instance.romanized} → {instance.phonetic_key}")
```

### Management Command Structure

```python
# backend/apps/search/management/commands/index_phonetics.py

from django.core.management.base import BaseCommand
from search.models import SinhalaWord
from search.phonetic.soundex import SinhalaSoundex

class Command(BaseCommand):
    help = 'Generate phonetic keys for all Sinhala words'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Reindex all words even if phonetic_key exists'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=1000,
            help='Number of words to process per batch'
        )
    
    def handle(self, *args, **options):
        # Implementation: batch process and bulk update
        pass
```

### Index Health Check

| Metric | Check | Expected | Action if Failed |
|--------|-------|----------|------------------|
| Coverage | % words with phonetic_key | 100% | Run index command |
| Validity | All keys are 4 characters | 100% | Regenerate invalid |
| Consistency | Same romanized → same key | 100% | Reindex inconsistent |
| Index Usage | Query uses index | Yes | Verify index exists |

### Performance Considerations

| Aspect | Strategy | Benefit |
|--------|----------|---------|
| Bulk Updates | Use bulk_update() | 10-100x faster |
| Batch Processing | Process 1000 at a time | Memory efficient |
| Index Usage | db_index=True | Fast queries |
| Caching | Cache encoder instance | Reduce overhead |

### Expected Outcome
- phonetic_key field added to SinhalaWord model
- Database index created for fast queries
- Automatic phonetic key generation on word save
- Bulk indexing command for existing words
- Signal handlers for automatic indexing
- Index monitoring and verification tools

### Verification Checklist
- [ ] phonetic_key field added to SinhalaWord model
- [ ] Database migration created and applied
- [ ] Index created on phonetic_key field
- [ ] Signal handler for pre_save implemented
- [ ] Signal registered in apps.py or signals.py
- [ ] Automatic encoding on word creation works
- [ ] Automatic encoding on word update works
- [ ] Management command `index_phonetics` created
- [ ] Bulk indexing processes all words
- [ ] Batch processing implemented (1000 per batch)
- [ ] Progress logging functional
- [ ] Error handling for encoding failures
- [ ] --force flag for reindexing implemented
- [ ] Index health check method created

---

## Task 52: Verify Phonetic

### Overview
Create comprehensive verification and testing procedures to ensure the phonetic matching system works correctly. This includes unit tests, integration tests, performance tests, and manual verification of phonetic encoding accuracy for common Sinhala words.

### Dependencies
- Task 51: Create Index Phonetics
- All previous Group C tasks (37-51)
- Django testing framework

### Instructions

1. **Create phonetic test file**
   - Create `backend/apps/search/sinhaglish/tests/test_phonetic.py`
   - Import unittest/pytest and Django TestCase
   - Import all phonetic classes (SinhalaSoundex, PhoneticMatcher, etc.)
   - Set up test fixtures

2. **Write unit tests for PhoneticEncoder**
   - Test abstract base class cannot be instantiated
   - Test input validation methods
   - Test error handling for invalid inputs
   - Verify abstract encode method raises NotImplementedError

3. **Write unit tests for SinhalaSoundex**
   - Test consonant mapping for all groups (1-6)
   - Test vowel removal (keep first, remove others)
   - Test digraph preprocessing (th, dh, ch, ng, sh)
   - Test double letter handling
   - Test padding/truncation to 4 characters

4. **Create phonetic key test cases**
   - Test common words with expected keys
   - Example test data:
     - "kiri" → "K600"
     - "thel" → "T400"
     - "badu" → "B130"
     - "malu" → "M540"
     - "thakkali" → "T240"

5. **Write tests for PhoneticMatcher**
   - Test find_similar returns correct results
   - Test result ordering by frequency
   - Test limit parameter functionality
   - Test empty query handling
   - Test no matches scenario

6. **Write tests for TransliterationPatterns**
   - Test pattern registration
   - Test pattern lookup
   - Test alternative retrieval
   - Test apply_patterns normalization
   - Test pattern ordering (longest first)

7. **Create integration tests**
   - Test end-to-end search flow
   - Test query → phonetic key → database → results
   - Test with real SinhalaWord records
   - Test fuzzy-phonetic combination

8. **Write performance tests**
   - Benchmark encoding speed (1000 words)
   - Measure database query performance
   - Test bulk indexing performance
   - Profile memory usage

9. **Create manual test cases**
   - Document test scenarios for manual verification
   - Include edge cases and unusual inputs
   - Test with actual user queries
   - Verify against native speaker expectations

10. **Implement continuous verification**
    - Add assertions to signal handlers
    - Verify phonetic_key format (4 characters, alphanumeric)
    - Log verification failures
    - Create monitoring dashboard (optional)

11. **Create validation dataset**
    - Compile list of 100+ common Sinhala words
    - Document expected phonetic keys
    - Verify accuracy against dataset
    - Calculate success rate (target: >95%)

12. **Add regression tests**
    - Test that algorithm changes don't break existing keys
    - Store known good encodings
    - Compare new encodings against baseline
    - Alert on mismatches

### Test Structure

```
backend/apps/search/sinhaglish/tests/
├── __init__.py
├── test_phonetic.py
│   ├── TestPhoneticEncoder
│   ├── TestSinhalaSoundex
│   ├── TestPhoneticMatcher
│   ├── TestTransliterationPatterns
│   └── TestPhoneticIntegration
├── test_performance.py
├── fixtures/
│   └── test_words.json
└── data/
    └── validation_dataset.csv
```

### Unit Test Examples

```python
class TestSinhalaSoundex(TestCase):
    def setUp(self):
        self.encoder = SinhalaSoundex()
    
    def test_encode_kiri(self):
        """Test encoding of 'kiri' (milk)"""
        result = self.encoder.encode("kiri")
        self.assertEqual(result, "K600")
    
    def test_encode_thel(self):
        """Test encoding of 'thel' (oil) with digraph"""
        result = self.encoder.encode("thel")
        self.assertEqual(result, "T400")
    
    def test_consonant_mapping_labial(self):
        """Test labial consonants map to 1"""
        self.assertEqual(self.encoder._map_consonants("B"), "1")
        self.assertEqual(self.encoder._map_consonants("P"), "1")
        self.assertEqual(self.encoder._map_consonants("V"), "1")
    
    def test_vowel_removal(self):
        """Test vowels are removed except first letter"""
        result = self.encoder.encode("aba")
        self.assertEqual(result[0], "A")  # First letter preserved
        self.assertNotIn("a", result[1:])  # Other vowels removed
```

### Validation Dataset Structure

| Romanized | Sinhala | Expected Key | Actual Key | Match | Notes |
|-----------|---------|--------------|------------|-------|-------|
| kiri | කිරි | K600 | K600 | ✓ | Common word: milk |
| thel | තෙල් | T400 | T400 | ✓ | Digraph test |
| kaama | කෑම | K500 | K500 | ✓ | Long vowel test |
| thakkali | තක්කාලි | T240 | T240 | ✓ | Double letter test |
| dhodol | දොඩොල් | D340 | D340 | ✓ | Multiple digraphs |
| ... | ... | ... | ... | ... | ... |

### Integration Test Flow

```
Integration Test: Search for "kiri"

1. Setup:
   - Create test database
   - Insert test SinhalaWord records
   - Index phonetic keys

2. Execute:
   - Create PhoneticMatcher instance
   - Call find_similar("kiri", limit=10)

3. Verify:
   - Results returned (QuerySet not empty)
   - Results contain "kiri" word
   - Results ordered by frequency
   - All results have phonetic_key = "K600"
   - Result count ≤ limit

4. Teardown:
   - Clean up test data
```

### Performance Benchmarks

| Operation | Target | Acceptable | Action if Exceeded |
|-----------|--------|------------|-------------------|
| Encode single word | <1ms | <5ms | Optimize algorithm |
| Encode 1000 words | <100ms | <500ms | Add caching |
| Database query | <10ms | <50ms | Check index usage |
| Bulk index 10k words | <60s | <300s | Optimize batch size |

### Manual Verification Checklist

```
Manual Test Cases:

□ Test 1: Basic encoding
  - Input: "kiri"
  - Expected: "K600"
  - Actual: _____
  - Pass/Fail: ____

□ Test 2: Digraph handling
  - Input: "thel"
  - Expected: "T400"
  - Actual: _____
  - Pass/Fail: ____

□ Test 3: Long vowel
  - Input: "kaama"
  - Expected: "K500"
  - Actual: _____
  - Pass/Fail: ____

□ Test 4: Pattern normalization
  - Input: "tel" (alternative spelling)
  - Expected: Should match "thel" results
  - Actual: _____
  - Pass/Fail: ____

□ Test 5: Fuzzy-phonetic combination
  - Input: "keri" (typo for "kiri")
  - Expected: Returns "kiri" in results
  - Actual: _____
  - Pass/Fail: ____
```

### Continuous Verification Strategy

```
┌──────────────────────────────────────┐
│  Every Word Save                     │
│  ├─ Verify phonetic_key length = 4   │
│  ├─ Verify first char is letter      │
│  ├─ Verify remaining are digits      │
│  └─ Log if validation fails          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Nightly Health Check                │
│  ├─ Count words without phonetic_key │
│  ├─ Verify index integrity           │
│  ├─ Test sample queries              │
│  └─ Report anomalies                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Deployment Verification             │
│  ├─ Run full test suite              │
│  ├─ Verify validation dataset        │
│  ├─ Check performance benchmarks     │
│  └─ Approve/reject deployment        │
└──────────────────────────────────────┘
```

### Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Unit test coverage | >90% | □ |
| Validation dataset accuracy | >95% | □ |
| Integration tests pass | 100% | □ |
| Performance benchmarks met | 100% | □ |
| Manual tests pass | 100% | □ |
| Index coverage | 100% of words | □ |
| Query speed | <50ms average | □ |

### Expected Outcome
- Comprehensive test suite for phonetic system
- Unit tests for all components
- Integration tests for end-to-end flows
- Performance benchmarks established
- Validation dataset with >95% accuracy
- Manual verification procedures documented
- Continuous monitoring in place
- High confidence in system correctness

### Verification Checklist
- [ ] test_phonetic.py file created with all test classes
- [ ] Unit tests for PhoneticEncoder written
- [ ] Unit tests for SinhalaSoundex written (20+ test cases)
- [ ] Unit tests for PhoneticMatcher written
- [ ] Unit tests for TransliterationPatterns written
- [ ] Integration tests for complete search flow written
- [ ] Performance tests and benchmarks created
- [ ] Validation dataset compiled (100+ words)
- [ ] Dataset accuracy measured (target: >95%)
- [ ] Manual test cases documented
- [ ] Regression test suite created
- [ ] Continuous verification procedures implemented
- [ ] All tests pass successfully
- [ ] Performance benchmarks met

---

## Summary

This document completed the transliteration pattern handling and phonetic indexing infrastructure for the Sinhaglish search system. The TransliterationPatterns class manages romanization variations, enabling normalization of different spelling styles. The phonetic indexing system automatically maintains phonetic keys for all words, and comprehensive verification ensures system accuracy and performance.

### Completed Tasks
1. ✓ Created TransliterationPatterns class for pattern management
2. ✓ Registered th pattern for soft dental consonant ත
3. ✓ Registered aa pattern and all long vowels (ee, ii, oo, uu)
4. ✓ Implemented pattern matching and normalization
5. ✓ Created phonetic indexing with database field and signals
6. ✓ Implemented comprehensive verification and testing

### Integration Summary

The complete Group C phonetic matching system now provides:
- **Encoding:** SinhalaSoundex algorithm converts romanized text to 4-character phonetic keys
- **Matching:** PhoneticMatcher finds similar-sounding words using phonetic keys
- **Patterns:** TransliterationPatterns normalizes spelling variations
- **Indexing:** Automatic phonetic key generation and database indexing
- **Verification:** Comprehensive testing ensures accuracy and performance

### Next Steps
The phonetic matching system is now complete and ready for integration with the search interface in Group D (Search Integration). The system will be used to:
- Process user queries through pattern normalization
- Generate phonetic keys for search terms
- Query database using phonetic matching
- Combine with fuzzy matching for optimal results
- Present ranked results to users

Proceed to Group-D_Search-Integration for the next phase of development.
