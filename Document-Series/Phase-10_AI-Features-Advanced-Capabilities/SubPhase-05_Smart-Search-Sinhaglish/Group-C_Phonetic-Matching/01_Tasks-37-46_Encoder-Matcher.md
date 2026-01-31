# Tasks 37-46: Phonetic Encoder and Matcher

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** C - Phonetic Matching  
> **Document:** 01 of 02  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-47-52_Patterns-Index.md](02_Tasks-47-52_Patterns-Index.md)

---

## Document Overview

This document covers the creation of the phonetic encoding and matching system for Sinhaglish search. It establishes the SinhalaSoundex algorithm with consonant mapping, vowel handling, and double letter processing. The PhoneticMatcher component implements similarity-based matching using phonetic keys with configurable thresholds, and combines fuzzy matching with phonetic encoding for robust search capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create PhoneticEncoder | High | 45 min |
| 38 | Create SinhalaSoundex | High | 60 min |
| 39 | Create encode Method | Medium | 40 min |
| 40 | Create Consonant Mapping | Medium | 50 min |
| 41 | Create Vowel Handling | Medium | 40 min |
| 42 | Create Double Letters | Low | 25 min |
| 43 | Create PhoneticMatcher | Medium | 45 min |
| 44 | Create find_similar Method | Medium | 40 min |
| 45 | Create Similarity Threshold | Low | 30 min |
| 46 | Create Fuzzy Phonetic | Medium | 50 min |

---

## Task 37: Create PhoneticEncoder

### Overview
Create the base PhoneticEncoder class that serves as the abstract foundation for all phonetic encoding implementations. This class defines the interface for converting romanized Sinhala text into phonetic keys that represent how words sound, enabling sound-based matching regardless of spelling variations.

### Dependencies
- Task 36 (TransliterationIndex from Group B)
- Python 3.10+ environment
- Backend apps/search/sinhaglish structure

### Instructions

1. **Create phonetic module structure**
   - Navigate to `backend/apps/search/sinhaglish/` directory
   - Create new directory named `phonetic`
   - Create `__init__.py` file in the phonetic directory

2. **Create encoder base file**
   - Create `encoder.py` file in the phonetic directory
   - Import necessary typing modules (ABC, abstractmethod)
   - Set up logging for debugging phonetic operations

3. **Define PhoneticEncoder abstract base class**
   - Create class that inherits from ABC (Abstract Base Class)
   - Define class-level documentation explaining purpose
   - Document that this is the foundation for all phonetic encoders

4. **Define abstract encode method**
   - Use `@abstractmethod` decorator
   - Method signature: `encode(self, text: str) -> str`
   - Document that implementations must convert text to phonetic key
   - Document return value: typically 4-character phonetic code

5. **Add validation method**
   - Create method `_validate_input(self, text: str) -> str`
   - Strip whitespace and convert to lowercase
   - Raise ValueError if text is empty or None
   - Return cleaned text

6. **Add utility methods**
   - Create method `_is_valid_romanized(self, text: str) -> bool`
   - Check if text contains only valid romanized characters
   - Valid characters: a-z, A-Z, and common digraphs (th, dh, ng, etc.)

7. **Implement logging support**
   - Add class-level logger instance
   - Log encoding operations for debugging
   - Include original text and resulting phonetic key in logs

### PhoneticEncoder Class Structure

```
PhoneticEncoder (ABC)
├── Abstract Methods
│   └── encode(text) -> phonetic_key
├── Validation Methods
│   ├── _validate_input(text) -> cleaned_text
│   └── _is_valid_romanized(text) -> bool
└── Utility Methods
    ├── _normalize_text(text) -> normalized
    └── _log_encoding(text, key) -> None
```

### Class Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| Interface Definition | Define abstract encode method |
| Input Validation | Clean and validate romanized text |
| Error Handling | Raise appropriate exceptions |
| Logging | Track encoding operations |
| Foundation | Base for SinhalaSoundex and other encoders |

### Design Pattern

```
┌─────────────────────────────────┐
│     PhoneticEncoder (ABC)       │
│  ┌──────────────────────────┐  │
│  │  + encode(text): str     │  │
│  │  # _validate_input()     │  │
│  │  # _is_valid_romanized() │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
              △
              │ Inherits
              │
┌─────────────────────────────────┐
│      SinhalaSoundex             │
│  (Task 38 - Implementation)     │
└─────────────────────────────────┘
```

### Expected Outcome
- Abstract base class for phonetic encoding
- Clean interface for implementing various phonetic algorithms
- Input validation and error handling foundation
- Logging infrastructure for debugging
- Ready for SinhalaSoundex implementation

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/phonetic/` directory created
- [ ] `encoder.py` file with PhoneticEncoder class created
- [ ] Abstract encode method defined with proper signature
- [ ] Input validation methods implemented
- [ ] Logging configured properly
- [ ] Class documentation complete
- [ ] Type hints added for all methods

---

## Task 38: Create SinhalaSoundex

### Overview
Create the SinhalaSoundex class that implements a Sinhala-specific variant of the Soundex phonetic algorithm. This algorithm adapts the classic American Soundex to handle unique characteristics of Sinhala romanization, including digraphs (th, dh, ng), retroflex consonants, and vowel length distinctions.

### Dependencies
- Task 37: Create PhoneticEncoder

### Instructions

1. **Create soundex implementation file**
   - Create `soundex.py` file in the phonetic directory
   - Import PhoneticEncoder base class from encoder.py
   - Import necessary typing and data structures

2. **Define SinhalaSoundex class**
   - Create class that inherits from PhoneticEncoder
   - Override abstract encode method
   - Add class-level constants for algorithm configuration

3. **Define consonant groups for Soundex codes**
   - Create class constant CONSONANT_GROUPS as dictionary
   - Map consonant sounds to numeric codes (1-6)
   - Follow Sinhala phonetic classifications

4. **Define Sinhala-specific digraphs**
   - Create class constant DIGRAPHS for two-letter combinations
   - Include: th, dh, ch, ng, sh (Sinhala-specific sounds)
   - Map each digraph to its phonetic code

5. **Implement algorithm foundation**
   - Document the Soundex algorithm steps in class docstring
   - Reference traditional Soundex while noting Sinhala adaptations
   - Explain 4-character output format: [Letter][Digit][Digit][Digit]

6. **Add preprocessing method**
   - Create method `_preprocess(self, text: str) -> str`
   - Replace digraphs with single-character placeholders
   - Handle Sinhala-specific letter combinations
   - Prepare text for main encoding algorithm

7. **Plan for consonant processing**
   - Document consonant mapping approach
   - Prepare for removal of vowels (except first letter)
   - Plan for handling duplicate consecutive consonants

### SinhalaSoundex Algorithm Overview

```
Input: Romanized Sinhala word (e.g., "kiri")
    │
    ▼
Step 1: Preprocess digraphs
    │   (th→T, dh→D, ng→G, etc.)
    ▼
Step 2: Keep first letter
    │   (Preserve original first character)
    ▼
Step 3: Map consonants to codes
    │   (B,F,P,V→1; C,G,J,K,Q,S,X,Z→2; etc.)
    ▼
Step 4: Remove vowels
    │   (Keep only mapped consonants)
    ▼
Step 5: Remove duplicate codes
    │   (111→1, 2223→23)
    ▼
Step 6: Pad or truncate to 4 chars
    │   (Add 0s if too short, trim if too long)
    ▼
Output: 4-character phonetic key (e.g., "K600")
```

### Traditional Soundex vs SinhalaSoundex

| Feature | Traditional Soundex | SinhalaSoundex | Reason |
|---------|---------------------|----------------|--------|
| Digraphs | Not handled | Preprocessed | Sinhala has th, dh, ng |
| First Letter | Always kept | Always kept | Same principle |
| Vowels | Removed | Removed (with aa, ee, oo handling) | Sinhala vowel length matters |
| Length | 4 characters | 4 characters | Standard format |
| Codes | 1-6 for consonants | 1-6 adapted for Sinhala | Phonetic grouping |

### Consonant Code Groups (To Implement in Task 40)

| Code | Phonetic Group | English Letters | Sinhala Sounds |
|------|----------------|-----------------|----------------|
| 1 | Labial | B, F, P, V | ප, ෆ, බ, භ |
| 2 | Dental/Sibilant | C, G, J, K, Q, S, X, Z | ක, ඛ, ග, ච, ජ, ස, ශ |
| 3 | Liquid/Dental | D, T | ත, ථ, ද, ධ |
| 4 | Lateral | L | ල |
| 5 | Nasal | M, N | ම, න, ඤ, ණ, ඬ |
| 6 | Rhotic | R | ර |

### Sinhala Digraph Handling

| Digraph | Sinhala Letter | Sound | Phonetic Code | Placeholder |
|---------|----------------|-------|---------------|-------------|
| th | ත | Soft t | 3 | T |
| dh | ද | Soft d | 3 | D |
| ch | ච | Ch | 2 | C |
| ng | ං | Ng | 5 | G |
| sh | ශ | Sh | 2 | S |

### Class Structure

```
SinhalaSoundex(PhoneticEncoder)
├── Constants
│   ├── CONSONANT_GROUPS: Dict[str, int]
│   ├── DIGRAPHS: Dict[str, str]
│   └── VOWELS: Set[str]
├── Public Methods
│   └── encode(text) -> phonetic_key
├── Private Methods
│   ├── _preprocess(text) -> preprocessed
│   ├── _map_consonants(text) -> mapped
│   ├── _remove_duplicates(codes) -> deduplicated
│   └── _pad_or_truncate(codes) -> final_key
└── Inherited
    └── _validate_input(text) -> cleaned
```

### Expected Outcome
- SinhalaSoundex class extending PhoneticEncoder
- Consonant group mappings defined
- Digraph preprocessing configured
- Algorithm structure documented
- Foundation ready for encode method implementation

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/phonetic/soundex.py` file created
- [ ] SinhalaSoundex class inherits from PhoneticEncoder
- [ ] CONSONANT_GROUPS constant defined
- [ ] DIGRAPHS constant defined for Sinhala sounds
- [ ] VOWELS set defined (a, e, i, o, u, aa, ee, oo)
- [ ] Preprocessing method skeleton created
- [ ] Algorithm steps documented in docstring
- [ ] Class is ready for encode method implementation

---

## Task 39: Create encode Method

### Overview
Implement the core encode method in SinhalaSoundex that transforms romanized Sinhala text into a 4-character phonetic key. This method orchestrates the complete Soundex algorithm, coordinating preprocessing, consonant mapping, vowel removal, duplicate handling, and final key formatting.

### Dependencies
- Task 38: Create SinhalaSoundex

### Instructions

1. **Implement encode method signature**
   - Override encode method from PhoneticEncoder
   - Accept text parameter (str)
   - Return phonetic key (str) - always 4 characters

2. **Add input validation**
   - Call parent class _validate_input method
   - Handle empty strings (return "0000" or raise exception)
   - Convert text to uppercase for processing

3. **Implement Step 1: Preprocess digraphs**
   - Call _preprocess method to handle digraphs
   - Replace "th" with placeholder before other processing
   - Replace "dh", "ch", "ng", "sh" with placeholders
   - Ensure longer digraphs processed before shorter ones

4. **Implement Step 2: Preserve first letter**
   - Extract first character of preprocessed text
   - Store as the initial letter of phonetic key
   - This letter is not converted to code

5. **Implement Step 3: Map remaining consonants**
   - Process characters from position 1 onwards
   - Call _map_consonants method (Task 40)
   - Skip vowels during this step
   - Convert consonants to their numeric codes

6. **Implement Step 4: Remove duplicate codes**
   - Call _remove_duplicates method
   - Remove consecutive identical codes (e.g., "111" → "1")
   - Keep the first occurrence of each consecutive group

7. **Implement Step 5: Format final key**
   - Combine first letter with mapped codes
   - Call _pad_or_truncate method
   - Pad with zeros if less than 4 characters
   - Truncate to 4 characters if longer

8. **Add error handling and logging**
   - Wrap encoding in try-except block
   - Log encoding operations for debugging
   - Log format: "Encoded '{text}' → '{phonetic_key}'"
   - Return default value "0000" on unrecoverable errors

### Encoding Flow Diagram

```
┌─────────────────────────────────────────┐
│  Input: "thambili"                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Step 1: Preprocess Digraphs            │
│  "thambili" → "Tambili"                 │
│  (th → T placeholder)                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Step 2: Preserve First Letter          │
│  First = "T"                            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Step 3: Map Consonants (Skip Vowels)   │
│  "ambili" → m=5, b=1, l=4               │
│  Codes: "514"                           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Step 4: Remove Duplicates              │
│  "514" → "514" (no duplicates)          │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Step 5: Format to 4 Characters         │
│  "T" + "514" = "T514"                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Output: "T514"                         │
└─────────────────────────────────────────┘
```

### Encoding Examples

| Input | Step 1 (Preprocess) | Step 2 (First) | Step 3 (Map) | Step 4 (Dedup) | Step 5 (Final) |
|-------|---------------------|----------------|--------------|----------------|----------------|
| kiri | kiri | k | r=6 | 6 | K600 |
| kaama | kaama | k | m=5 | 5 | K500 |
| thel | Tel | T | l=4 | 4 | T400 |
| dhodol | Dodol | D | d=3, l=4 | 34 | D340 |
| thakkali | Takali | T | k=2, l=4 | 24 | T240 |

### Method Implementation Structure

```python
def encode(self, text: str) -> str:
    """
    Encode romanized Sinhala text to phonetic key.
    
    Steps:
    1. Validate and preprocess input
    2. Preserve first letter
    3. Map consonants to codes
    4. Remove duplicate codes
    5. Format to 4-character key
    
    Args:
        text: Romanized Sinhala word
        
    Returns:
        4-character phonetic key (e.g., "K600")
    """
    # Implementation follows steps 1-5
```

### Error Handling Strategy

| Error Type | Handling | Return Value |
|------------|----------|--------------|
| Empty string | Log warning | "0000" |
| None value | Raise ValueError | N/A |
| Invalid characters | Log warning, filter | Encoded cleaned text |
| Processing exception | Log error | "0000" |

### Expected Outcome
- Fully functional encode method
- Proper orchestration of all encoding steps
- Consistent 4-character phonetic key output
- Robust error handling and logging
- Examples: "kiri" → "K600", "thel" → "T400"

### Verification Checklist
- [ ] encode method implemented and overrides parent
- [ ] Input validation with _validate_input called
- [ ] Digraph preprocessing step implemented
- [ ] First letter preservation implemented
- [ ] Consonant mapping step implemented
- [ ] Duplicate removal step implemented
- [ ] Padding/truncation to 4 characters implemented
- [ ] Error handling and logging added
- [ ] Returns consistent 4-character strings
- [ ] Test with example words produces expected keys

---

## Task 40: Create Consonant Mapping

### Overview
Implement the consonant mapping system that converts romanized Sinhala consonants to phonetic codes (1-6) based on their phonetic characteristics. This mapping groups similar-sounding consonants together, enabling phonetic matching even when different letters are used to represent similar sounds.

### Dependencies
- Task 39: Create encode Method

### Instructions

1. **Define consonant group constants**
   - Update CONSONANT_GROUPS class constant in SinhalaSoundex
   - Create comprehensive mapping of all consonants to codes
   - Group consonants by phonetic similarity

2. **Implement Code 1: Labial consonants**
   - Map labial sounds: B, F, P, V → 1
   - Sinhala letters: ප (pa), බ (ba), භ (bha), ෆ (fa)
   - These consonants use lips in pronunciation

3. **Implement Code 2: Dental and Sibilant consonants**
   - Map dental/sibilant sounds: C, G, J, K, Q, S, X, Z → 2
   - Sinhala letters: ක (ka), ග (ga), ච (cha), ජ (ja), ස (sa), ශ (sha)
   - Includes both hard consonants and hissing sounds

4. **Implement Code 3: Liquid and Dental stops**
   - Map liquid/dental sounds: D, T → 3
   - Sinhala letters: ත (tha), ද (da), ට (ta), ඩ (da)
   - Includes regular and retroflex variants

5. **Implement Code 4: Lateral consonants**
   - Map lateral sound: L → 4
   - Sinhala letter: ල (la)
   - Unique lateral liquid consonant

6. **Implement Code 5: Nasal consonants**
   - Map nasal sounds: M, N → 5
   - Sinhala letters: ම (ma), න (na), ඤ (nya), ණ (na), ඬ (nda)
   - All nasal consonants grouped together

7. **Implement Code 6: Rhotic consonants**
   - Map rhotic sound: R → 6
   - Sinhala letter: ර (ra)
   - Distinct rhotic consonant

8. **Handle digraph mappings**
   - Map preprocessed digraph placeholders
   - T (from "th") → 3
   - D (from "dh") → 3
   - C (from "ch") → 2
   - G (from "ng") → 5
   - S (from "sh") → 2

9. **Implement _map_consonants method**
   - Create method signature: `_map_consonants(self, text: str, skip_first: bool = True) -> str`
   - Iterate through text characters
   - Look up each consonant in CONSONANT_GROUPS
   - Skip vowels and the first character if skip_first is True
   - Return string of numeric codes

10. **Add unmapped character handling**
    - Handle consonants not in mapping (rare)
    - Log warning for unmapped characters
    - Skip unmapped characters (treat as vowels)

### Consonant Code Mapping Table

| Code | Group Name | Letters | Sinhala Examples | Phonetic Feature |
|------|------------|---------|------------------|------------------|
| 1 | Labial | B, F, P, V | ප බ භ ෆ | Lips used |
| 2 | Dental/Sibilant | C, G, J, K, Q, S, X, Z | ක ග ච ජ ස ශ | Teeth/hissing |
| 3 | Liquid/Dental | D, T | ත ද ට ඩ | Tongue/teeth |
| 4 | Lateral | L | ල | Lateral flow |
| 5 | Nasal | M, N | ම න ඤ ණ ඬ | Nasal passage |
| 6 | Rhotic | R | ර | Rolled/tapped |

### Digraph to Code Mapping

| Original | Preprocessed | Phonetic Code | Sinhala | Example Word |
|----------|--------------|---------------|---------|--------------|
| th | T | 3 | ත | thel → T400 |
| dh | D | 3 | ද | dhodol → D340 |
| ch | C | 2 | ච | choon → C500 |
| ng | G | 5 | ං | inguru → I526 |
| sh | S | 2 | ශ | shani → S500 |

### Mapping Algorithm

```
Input: "KIRI" (after preprocessing)
Skip first: True

Process: K I R I
   │     │ │ │
   │     │ │ └─ Vowel (skip)
   │     │ └─── R → 6
   │     └───── Vowel (skip)
   └─────────── K (skip - first letter)

Result: "6"
Padded: "K600"
```

### Consonant Mapping Examples

| Word | Preprocessed | Consonants Only | Mapped Codes | Final Key |
|------|--------------|-----------------|--------------|-----------|
| kiri | KIRI | KR | 6 | K600 |
| badu | BADU | BD | 13 | B130 |
| roti | ROTI | RT | 3 | R300 |
| malu | MALU | ML | 54 | M540 |
| thel | TEL | TL | 4 | T400 |
| dhodol | DODOL | DDL | 334 | D340 (after dedup) |

### _map_consonants Method Structure

```python
def _map_consonants(self, text: str, skip_first: bool = True) -> str:
    """
    Map consonants to phonetic codes.
    
    Args:
        text: Preprocessed uppercase text
        skip_first: Whether to skip first character
        
    Returns:
        String of numeric codes (e.g., "514")
    """
    # Implementation maps each consonant to code
```

### Expected Outcome
- Complete consonant to code mapping system
- All Sinhala consonants properly grouped
- Digraph placeholders mapped correctly
- _map_consonants method functional
- Phonetically similar consonants share codes

### Verification Checklist
- [ ] CONSONANT_GROUPS constant fully populated
- [ ] All codes 1-6 have assigned consonants
- [ ] Labial consonants (B, F, P, V) → 1
- [ ] Dental/sibilant consonants → 2
- [ ] Liquid/dental consonants (D, T) → 3
- [ ] Lateral consonant (L) → 4
- [ ] Nasal consonants (M, N) → 5
- [ ] Rhotic consonant (R) → 6
- [ ] Digraph placeholders mapped
- [ ] _map_consonants method implemented
- [ ] Method handles skip_first parameter correctly
- [ ] Vowels properly skipped during mapping

---

## Task 41: Create Vowel Handling

### Overview
Implement vowel handling logic that removes vowels from the phonetic encoding while preserving special characteristics of Sinhala vowels, including long vowels (aa, ee, oo) and the first letter rule. This step is crucial for creating consistent phonetic keys that focus on consonant sounds.

### Dependencies
- Task 40: Create Consonant Mapping

### Instructions

1. **Define vowel set constant**
   - Create VOWELS class constant in SinhalaSoundex
   - Include single vowels: a, e, i, o, u
   - Include long vowels: aa, ee, ii, oo, uu
   - Store as set for efficient lookup

2. **Implement long vowel preprocessing**
   - Add method `_handle_long_vowels(self, text: str) -> str`
   - Replace long vowels with single-character placeholders
   - Treat "aa", "ee", "oo" as single units
   - Examples: "kaama" → "kAma", "theel" → "thEl"

3. **Update preprocessing pipeline**
   - Integrate long vowel handling into _preprocess method
   - Apply long vowel handling before digraph processing
   - Ensure order: long vowels → digraphs → uppercase

4. **Implement vowel removal in mapping**
   - Update _map_consonants to skip vowel characters
   - Check each character against VOWELS set
   - Skip character if it's a vowel
   - Process only consonants to codes

5. **Preserve first letter regardless**
   - Ensure first letter always preserved (even if vowel)
   - First letter rule applies before vowel removal
   - Examples: "ala" → "A400", "amba" → "A510"

6. **Handle vowel-only words**
   - Detect words with only vowels (rare case)
   - Return first letter + "000"
   - Examples: "aa" → "A000", "ee" → "E000"

7. **Document vowel treatment**
   - Add docstring explaining Sinhala vowel patterns
   - Document short vs long vowel distinction
   - Explain why vowels are removed (focus on consonant sounds)

### Sinhala Vowel System

| Type | Letters | Sinhala | Length | Example |
|------|---------|---------|--------|---------|
| Short | a, e, i, o, u | අ එ ඉ ඔ උ | Short | kala, peni |
| Long | aa, ee, ii, oo, uu | ආ ඊ ඊ ඕ ඌ | Long | kaama, theel |

### Vowel Removal Algorithm

```
Input: "KAAMA" (after preprocessing)
       K A A M A

Step 1: Identify first letter
        K (preserve)

Step 2: Process remaining characters
        A A M A
        │ │ │ │
        │ │ │ └─ Vowel (remove)
        │ │ └─── M → 5
        │ └───── Vowel (remove)
        └─────── Vowel (remove)

Step 3: Combine
        K + 5 = K500 (after padding)
```

### Long Vowel Preprocessing Examples

| Original | Long Vowel Processing | After Digraph Processing | Final |
|----------|----------------------|-------------------------|-------|
| kaama | kAma | kAma | K500 |
| theel | thEl | TEl | T400 |
| baala | bAla | bAla | B400 |
| paani | pAni | pAni | P500 |
| mool | mOl | mOl | M400 |

### Vowel Handling in Different Positions

| Position | Example | Handling | Result |
|----------|---------|----------|--------|
| First | amba | Preserve "A" | A510 |
| Middle | kiri | Remove both "i"s | K600 |
| End | malu | Remove "u" | M400 |
| Consecutive | kaama | Treat "aa" as single | K500 |

### Special Cases

| Case | Example | Processing | Phonetic Key |
|------|---------|------------|--------------|
| Vowel-only | aa | Keep first, pad | A000 |
| All short vowels | aei | Keep first, pad | A000 |
| Mixed long/short | kaaema | K + m → Km | K500 |
| Ending vowel | kiri | Remove final i | K600 |

### _handle_long_vowels Method Structure

```python
def _handle_long_vowels(self, text: str) -> str:
    """
    Replace long vowels with single placeholders.
    
    Long vowels in Sinhala romanization:
    - aa (ආ) → A
    - ee (ඊ) → E
    - ii (ඊ) → I
    - oo (ඕ) → O
    - uu (ඌ) → U
    
    Args:
        text: Lowercase romanized text
        
    Returns:
        Text with long vowels as single characters
    """
    # Implementation replaces long vowels
```

### Updated Preprocessing Pipeline

```
Input: "kaama"
    │
    ▼
Step 1: Handle Long Vowels
    "kaama" → "kAma"
    │
    ▼
Step 2: Handle Digraphs
    "kAma" → "kAma" (no digraphs)
    │
    ▼
Step 3: Uppercase
    "kAma" → "KAMA"
    │
    ▼
Step 4: Preserve First Letter
    First = "K"
    │
    ▼
Step 5: Map Consonants (Skip Vowels)
    "AMA" → M=5
    │
    ▼
Output: "K500"
```

### Expected Outcome
- Long vowels preprocessed correctly
- Vowels removed during consonant mapping
- First letter preserved regardless of type
- Vowel-only words handled properly
- Consistent phonetic keys focusing on consonants

### Verification Checklist
- [ ] VOWELS constant defined with all vowels
- [ ] Long vowels (aa, ee, oo) included
- [ ] _handle_long_vowels method implemented
- [ ] Long vowel preprocessing integrated into pipeline
- [ ] Vowel removal integrated into _map_consonants
- [ ] First letter preserved even if vowel
- [ ] Vowel-only words return [Letter]000 format
- [ ] Test words with mixed vowels encode correctly
- [ ] "kaama" → "K500", "theel" → "T400"

---

## Task 42: Create Double Letters

### Overview
Implement double letter handling to remove consecutive duplicate consonants from phonetic codes. This step ensures that repeated consonants (common in Sinhala romanization) produce single phonetic codes, improving matching accuracy and following standard Soundex principles.

### Dependencies
- Task 41: Create Vowel Handling

### Instructions

1. **Implement _remove_duplicates method**
   - Create method signature: `_remove_duplicates(self, codes: str) -> str`
   - Process string of phonetic codes
   - Remove consecutive duplicate digits
   - Preserve first occurrence of each duplicate group

2. **Identify double letter patterns**
   - Document common double letters in Sinhala: tt, dd, kk, ll, mm, nn
   - Sinhala letters: ට්ට (tta), ඩ්ඩ (dda), ක්ක (kka), etc.
   - After mapping, these become duplicate codes: 33, 44, 55

3. **Implement deduplication algorithm**
   - Iterate through phonetic codes string
   - Compare each digit with previous digit
   - Skip digit if it matches previous
   - Keep digit if different from previous

4. **Handle multiple consecutive duplicates**
   - Pattern "111" → "1"
   - Pattern "2223" → "23"
   - Pattern "4444" → "4"
   - Keep only first occurrence regardless of count

5. **Add edge case handling**
   - Empty string → return empty string
   - Single character → return unchanged
   - No duplicates → return unchanged

6. **Integrate into encode pipeline**
   - Call _remove_duplicates after consonant mapping
   - Apply before padding/truncation step
   - Ensure it processes only the codes, not first letter

7. **Add logging for debugging**
   - Log before and after deduplication
   - Format: "Dedup: '111' → '1'"
   - Help track double letter handling

### Double Letter Patterns in Sinhala

| Romanized | Sinhala | Phonetic Codes (Before Dedup) | After Dedup |
|-----------|---------|-------------------------------|-------------|
| thakkali | ත්ක්කලි | kk → 22 | 2 |
| oddala | ඔඩ්ඩල | dd → 33 | 3 |
| koppara | කොප්පර | pp → 11 | 1 |
| hammam | හම්මාම් | mm → 55 | 5 |
| kollaya | කොල්ලය | ll → 44 | 4 |
| pinnala | පින්නල | nn → 55 | 5 |

### Deduplication Algorithm

```
Input: "22456667"
         ││││││││
         ││││││└└─ 7 ≠ 6 → keep 7
         │││││└─── 6 = 6 → skip
         ││││└──── 6 ≠ 5 → keep 6
         │││└───── 5 ≠ 4 → keep 5
         ││└────── 4 ≠ 2 → keep 4
         │└─────── 2 = 2 → skip
         └──────── 2 (first) → keep 2

Output: "245667"
        (Actually "24567" after one pass)
```

### Deduplication Examples

| Before Dedup | After Dedup | Example Word |
|--------------|-------------|--------------|
| 111 | 1 | bappa (B111 → B100) |
| 2223 | 23 | thakkali (T224 → T240) |
| 4444 | 4 | kallaya (K444 → K400) |
| 5566 | 56 | manniya (M556 → M560) |
| 123 | 123 | No change (no duplicates) |

### Step-by-Step Example: "thakkali"

```
Word: "thakkali"
    │
    ▼
Preprocess: "Takali"
    │
    ▼
First Letter: "T"
    │
    ▼
Map Consonants: "akali" → k=2, k=2, l=4
    Codes: "224"
    │
    ▼
Remove Duplicates: "224" → "24"
    │
    ▼
Format: "T" + "24" + "0" = "T240"
```

### _remove_duplicates Method Structure

```python
def _remove_duplicates(self, codes: str) -> str:
    """
    Remove consecutive duplicate phonetic codes.
    
    Soundex rule: consecutive identical codes are reduced
    to a single occurrence.
    
    Examples:
        "111" → "1"
        "2223" → "23"
        "4567" → "4567" (no change)
    
    Args:
        codes: String of phonetic codes (e.g., "2223")
        
    Returns:
        Deduplicated codes (e.g., "23")
    """
    # Implementation removes consecutive duplicates
```

### Integration in Encoding Pipeline

```
encode() method flow:

1. Preprocess (digraphs + long vowels)
2. Preserve first letter
3. Map consonants → codes string
4. ┌──────────────────────────┐
   │ Remove Duplicates (Task 42) │  ← New step
   └──────────────────────────┘
5. Pad or truncate to 4 chars
6. Return phonetic key
```

### Expected Outcome
- Consecutive duplicate codes removed
- First occurrence of duplicates preserved
- Double consonants (tt, dd, kk, ll, mm, nn) handled correctly
- Integration into encoding pipeline complete
- Examples: "thakkali" → "T240", "kolla" → "K400"

### Verification Checklist
- [ ] _remove_duplicates method implemented
- [ ] Method handles empty strings
- [ ] Method handles single characters
- [ ] Method handles no duplicates (returns unchanged)
- [ ] Consecutive duplicates removed (111 → 1)
- [ ] Multiple duplicate groups handled (2223 → 23)
- [ ] Integration into encode method complete
- [ ] Deduplication occurs after consonant mapping
- [ ] Deduplication occurs before padding
- [ ] Logging added for debugging
- [ ] Test with double letter words produces correct keys

---

## Task 43: Create PhoneticMatcher

### Overview
Create the PhoneticMatcher class that uses phonetic keys to find similar-sounding Sinhala words in the database. This matcher leverages the SinhalaSoundex encoding to perform sound-based searches, enabling users to find words even when they spell them differently.

### Dependencies
- Task 42: Create Double Letters
- SinhalaWord model (from Group B)
- Django ORM query capabilities

### Instructions

1. **Create matcher implementation file**
   - Create `matcher.py` file in the phonetic directory
   - Import SinhalaSoundex from soundex.py
   - Import SinhalaWord model
   - Import Django query utilities (Q objects, QuerySet)

2. **Define PhoneticMatcher class**
   - Create class with initialization method
   - Accept SinhalaSoundex encoder instance in __init__
   - Store encoder as instance variable
   - Add logging configuration

3. **Implement phonetic key generation**
   - Add method `_get_phonetic_key(self, text: str) -> str`
   - Use encoder to generate phonetic key from input
   - Handle encoding errors gracefully
   - Log key generation for debugging

4. **Design find_similar method structure**
   - Method signature: `find_similar(self, query: str, limit: int = 10) -> QuerySet[SinhalaWord]`
   - Accept search query (romanized text)
   - Accept limit parameter for result count
   - Return Django QuerySet of SinhalaWord objects

5. **Plan phonetic key matching**
   - Generate phonetic key for query
   - Query SinhalaWord model where phonetic_key matches
   - Use Django ORM filter with phonetic_key field
   - Limit results to specified count

6. **Add result ordering**
   - Order results by frequency (most common first)
   - Secondary sort by word length (shorter first)
   - Ensure consistent result ordering

7. **Implement empty result handling**
   - Return empty QuerySet if no matches found
   - Log when phonetic search returns no results
   - Prepare for fuzzy fallback (Task 46)

8. **Add query validation**
   - Validate query is not empty or None
   - Clean whitespace from query
   - Convert to lowercase before encoding
   - Raise ValueError for invalid queries

### PhoneticMatcher Class Structure

```
PhoneticMatcher
├── Attributes
│   ├── encoder: SinhalaSoundex
│   └── logger: Logger
├── Public Methods
│   ├── find_similar(query, limit) → QuerySet
│   └── get_matches_by_key(phonetic_key, limit) → QuerySet
└── Private Methods
    ├── _get_phonetic_key(text) → str
    ├── _validate_query(query) → str
    └── _log_match(query, key, count) → None
```

### Phonetic Matching Flow

```
User Query: "kiri"
      │
      ▼
┌──────────────────────────┐
│  Validate Query          │
│  "kiri" → "kiri"         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Generate Phonetic Key   │
│  "kiri" → "K600"         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Query Database          │
│  WHERE phonetic_key =    │
│  "K600"                  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Return Matches          │
│  - kiri (milk)           │
│  - keri (cart)           │
│  - keeri (small)         │
└──────────────────────────┘
```

### find_similar Method Logic

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Validate query | Ensure valid input |
| 2 | Encode to phonetic key | Convert to K600 |
| 3 | Query phonetic_key field | Find matches |
| 4 | Order by frequency | Most common first |
| 5 | Limit results | Return top N |
| 6 | Log match count | Track performance |

### Database Query Strategy

```python
# Pseudocode for phonetic matching
phonetic_key = encoder.encode(query)

matches = SinhalaWord.objects.filter(
    phonetic_key=phonetic_key
).order_by(
    '-frequency',  # Most common first
    'romanized'    # Alphabetical for same frequency
)[:limit]
```

### Matching Examples

| Query | Phonetic Key | Matching Words | Romanizations |
|-------|--------------|----------------|---------------|
| kiri | K600 | කිරි, කෙරි | kiri, keri, keeri |
| thel | T400 | තෙල්, තෙල | thel, tel, tael |
| badu | B130 | බඩු | badu, baddu |
| maalu | M400 | මාලු, මාල | maalu, malu, maala |

### PhoneticMatcher Initialization

```python
# Pseudocode for initialization
encoder = SinhalaSoundex()
matcher = PhoneticMatcher(encoder)

# Usage
results = matcher.find_similar("kiri", limit=10)
```

### Expected Outcome
- PhoneticMatcher class for sound-based search
- Integration with SinhalaSoundex encoder
- find_similar method for querying database
- Result ordering by frequency
- Validation and error handling
- Logging for debugging

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/phonetic/matcher.py` file created
- [ ] PhoneticMatcher class defined
- [ ] __init__ accepts SinhalaSoundex encoder
- [ ] _get_phonetic_key method implemented
- [ ] _validate_query method implemented
- [ ] find_similar method signature defined
- [ ] Method returns QuerySet[SinhalaWord]
- [ ] Result ordering by frequency configured
- [ ] Limit parameter functional
- [ ] Empty result handling implemented
- [ ] Logging configured for match operations

---

## Task 44: Create find_similar Method

### Overview
Implement the find_similar method in PhoneticMatcher that performs phonetic-based searches in the database. This method converts the user's query to a phonetic key and retrieves all Sinhala words with matching phonetic keys, ordered by relevance.

### Dependencies
- Task 43: Create PhoneticMatcher

### Instructions

1. **Implement method signature**
   - Define find_similar method in PhoneticMatcher class
   - Parameters: query (str), limit (int, default=10)
   - Return type: QuerySet[SinhalaWord]
   - Add comprehensive docstring

2. **Validate input query**
   - Call _validate_query method
   - Strip whitespace and convert to lowercase
   - Check for empty or None values
   - Raise ValueError if invalid

3. **Generate phonetic key**
   - Call encoder.encode(query) to get phonetic key
   - Wrap in try-except for encoding errors
   - Log the generated phonetic key
   - Handle encoding failures gracefully

4. **Query database with phonetic key**
   - Use Django ORM filter on phonetic_key field
   - Filter: SinhalaWord.objects.filter(phonetic_key=key)
   - Ensure index is used for performance

5. **Apply result ordering**
   - Primary sort: frequency (descending) - most common first
   - Secondary sort: romanized (ascending) - alphabetical
   - Use .order_by('-frequency', 'romanized')

6. **Apply result limit**
   - Use Django [:limit] slice notation
   - Efficient database query with LIMIT clause
   - Default to 10 results if not specified

7. **Add result annotations**
   - Consider annotating with phonetic_key for transparency
   - Optionally include similarity score (for future use)
   - Keep query efficient

8. **Implement logging**
   - Log query and generated phonetic key
   - Log number of matches found
   - Format: "Phonetic search: 'kiri' → 'K600' → 3 matches"
   - Log at INFO level

9. **Handle no matches**
   - Return empty QuerySet if no matches
   - Log when no matches found
   - Prepare message for potential fallback to fuzzy search

10. **Add performance optimization**
    - Ensure database index on phonetic_key field
    - Use .only() or .defer() if appropriate
    - Consider query result caching

### find_similar Method Flow

```
┌─────────────────────────────────┐
│  Input: query="kiri", limit=10  │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Validate Query                 │
│  - Strip whitespace             │
│  - Lowercase                    │
│  - Check not empty              │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Encode to Phonetic Key         │
│  encoder.encode("kiri")         │
│  Result: "K600"                 │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Database Query                 │
│  SinhalaWord.objects            │
│    .filter(phonetic_key="K600") │
│    .order_by('-frequency',      │
│              'romanized')       │
│    [:10]                        │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Return QuerySet                │
│  [kiri, keri, keeri, ...]       │
└─────────────────────────────────┘
```

### Method Implementation Structure

```python
def find_similar(self, query: str, limit: int = 10) -> QuerySet[SinhalaWord]:
    """
    Find Sinhala words with similar pronunciation.
    
    Uses phonetic encoding to match words that sound alike,
    regardless of spelling variations.
    
    Args:
        query: Romanized Sinhala query (e.g., "kiri")
        limit: Maximum number of results (default: 10)
        
    Returns:
        QuerySet of SinhalaWord objects ordered by frequency
        
    Raises:
        ValueError: If query is empty or invalid
        
    Examples:
        >>> matcher.find_similar("kiri", limit=5)
        <QuerySet [<SinhalaWord: kiri>, <SinhalaWord: keri>, ...]>
    """
    # Implementation follows steps 1-10
```

### Query Optimization Strategy

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| Index | phonetic_key field indexed | Fast lookups |
| Limit | [:limit] slice | Fetch only needed rows |
| Order | Database-level ORDER BY | Efficient sorting |
| Select fields | .only('romanized', 'sinhala', 'frequency') | Reduce data transfer |

### Result Ordering Examples

| Word | Romanized | Frequency | Phonetic Key | Order |
|------|-----------|-----------|--------------|-------|
| කිරි | kiri | 5000 | K600 | 1st (highest frequency) |
| කෙරි | keri | 2000 | K600 | 2nd |
| කීරි | keeri | 500 | K600 | 3rd |

### Error Handling

| Error Type | Handling | Response |
|------------|----------|----------|
| Empty query | Raise ValueError | "Query cannot be empty" |
| Encoding error | Log and return empty | Empty QuerySet |
| Database error | Log and raise | Re-raise exception |
| No matches | Return empty QuerySet | Log "0 matches" |

### Logging Examples

```
INFO: Phonetic search: query='kiri' key='K600' matches=3
INFO: Phonetic search: query='thel' key='T400' matches=5
INFO: Phonetic search: query='xyz' key='X200' matches=0
WARNING: Phonetic search failed for query='': Query cannot be empty
```

### Integration with Database Index

```
SinhalaWord Model:
├── romanized (CharField, indexed)
├── sinhala (CharField)
├── phonetic_key (CharField(4), indexed)  ← Used by find_similar
├── fuzzy_key (CharField)
└── frequency (IntegerField)

Index on phonetic_key ensures:
- Fast lookups (O(log n))
- Efficient filtering
- Quick result retrieval
```

### Expected Outcome
- Fully functional find_similar method
- Phonetic key-based database querying
- Results ordered by frequency and relevance
- Efficient query execution with indexing
- Comprehensive error handling and logging
- Returns up to limit matching words

### Verification Checklist
- [ ] find_similar method fully implemented
- [ ] Method signature matches specification
- [ ] Input validation with _validate_query
- [ ] Phonetic key generation with encoder
- [ ] Database query with phonetic_key filter
- [ ] Result ordering by frequency (descending)
- [ ] Result limiting with [:limit] slice
- [ ] Logging implemented for queries
- [ ] Empty result handling
- [ ] Error handling for edge cases
- [ ] Returns QuerySet[SinhalaWord]
- [ ] Performance optimized with index usage

---

## Task 45: Create Similarity Threshold

### Overview
Implement similarity threshold levels for phonetic matching that categorize matches as exact, close, or fuzzy based on phonetic key similarity. This tiered approach enables ranking search results by phonetic similarity when exact matches are unavailable.

### Dependencies
- Task 44: Create find_similar Method

### Instructions

1. **Define threshold constants**
   - Create class-level constants in PhoneticMatcher
   - EXACT_MATCH: Full phonetic key match (all 4 characters)
   - CLOSE_MATCH: First 3 characters match
   - FUZZY_MATCH: First 2 characters match
   - Document threshold meanings

2. **Create similarity scoring method**
   - Add method `_calculate_similarity(self, key1: str, key2: str) -> float`
   - Compare two phonetic keys character by character
   - Return similarity score: 0.0 (no match) to 1.0 (exact match)
   - Formula: matching_chars / total_chars

3. **Implement threshold classification**
   - Add method `_classify_match(self, similarity: float) -> str`
   - Return "exact" if similarity == 1.0
   - Return "close" if similarity >= 0.75
   - Return "fuzzy" if similarity >= 0.5
   - Return "no_match" if similarity < 0.5

4. **Create find_by_threshold method**
   - Method signature: `find_by_threshold(self, query: str, threshold: str = "exact", limit: int = 10) -> QuerySet`
   - Accept threshold parameter: "exact", "close", or "fuzzy"
   - Return matches meeting or exceeding threshold
   - Use different query strategies per threshold

5. **Implement exact threshold matching**
   - Use existing find_similar (all 4 chars match)
   - Filter: phonetic_key = query_key
   - Fastest query, most precise

6. **Implement close threshold matching**
   - Match first 3 characters of phonetic key
   - Filter: phonetic_key.startswith(query_key[:3])
   - Use LIKE query: phonetic_key LIKE 'K60%'
   - More results, slightly less precise

7. **Implement fuzzy threshold matching**
   - Match first 2 characters of phonetic key
   - Filter: phonetic_key.startswith(query_key[:2])
   - Use LIKE query: phonetic_key LIKE 'K6%'
   - Most results, least precise

8. **Add match scoring**
   - Annotate results with similarity score
   - Calculate distance between query key and result key
   - Order by similarity score (descending) then frequency

9. **Update find_similar with threshold support**
   - Add optional threshold parameter
   - Default to "exact" for backward compatibility
   - Call find_by_threshold internally when threshold specified

### Threshold Levels Explained

| Threshold | Characters Matched | Precision | Use Case | Example |
|-----------|-------------------|-----------|----------|---------|
| Exact | 4/4 | Highest | Default search | K600 matches only K600 |
| Close | 3/4 | High | Slight variation | K600 matches K600-K699 |
| Fuzzy | 2/4 | Medium | Broad search | K600 matches K600-K999 |

### Similarity Calculation Examples

| Key 1 | Key 2 | Matching Chars | Similarity Score | Classification |
|-------|-------|----------------|------------------|----------------|
| K600 | K600 | 4/4 | 1.00 | Exact |
| K600 | K610 | 3/4 | 0.75 | Close |
| K600 | K640 | 3/4 | 0.75 | Close |
| K600 | K700 | 2/4 | 0.50 | Fuzzy |
| K600 | M600 | 1/4 | 0.25 | No Match |

### Threshold Matching Flow

```
Query: "kiri" → Phonetic Key: "K600"

┌────────────────────────────────────┐
│  Threshold: EXACT                  │
│  Match: K600 only                  │
│  Results: kiri, keri               │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Threshold: CLOSE                  │
│  Match: K60* (K600-K609)           │
│  Results: kiri, keri, kuru         │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Threshold: FUZZY                  │
│  Match: K6** (K600-K699)           │
│  Results: kiri, keri, kuru, kora   │
└────────────────────────────────────┘
```

### Database Query Strategies by Threshold

| Threshold | Django Query | SQL Equivalent | Performance |
|-----------|--------------|----------------|-------------|
| Exact | `filter(phonetic_key=key)` | `WHERE phonetic_key = 'K600'` | Fastest |
| Close | `filter(phonetic_key__startswith=key[:3])` | `WHERE phonetic_key LIKE 'K60%'` | Fast |
| Fuzzy | `filter(phonetic_key__startswith=key[:2])` | `WHERE phonetic_key LIKE 'K6%'` | Moderate |

### find_by_threshold Method Structure

```python
def find_by_threshold(
    self, 
    query: str, 
    threshold: str = "exact", 
    limit: int = 10
) -> QuerySet[SinhalaWord]:
    """
    Find words by phonetic similarity threshold.
    
    Args:
        query: Romanized query
        threshold: "exact", "close", or "fuzzy"
        limit: Maximum results
        
    Returns:
        QuerySet ordered by similarity and frequency
    """
    # Implementation based on threshold level
```

### Similarity Scoring and Ordering

```
Results for query="kiri" with threshold="close":

Word      | Phonetic Key | Similarity | Frequency | Rank
----------|--------------|------------|-----------|-----
kiri      | K600         | 1.00       | 5000      | 1
keri      | K600         | 1.00       | 2000      | 2
kuru      | K600         | 1.00       | 1500      | 3
kirila    | K640         | 0.75       | 800       | 4
kariya    | K600         | 1.00       | 500       | 5
```

### Threshold Use Cases

| Scenario | Threshold | Reason |
|----------|-----------|--------|
| User types exactly | Exact | Highest precision needed |
| User unsure of spelling | Close | Allow minor variations |
| Exploratory search | Fuzzy | Discover related words |
| No exact results | Fuzzy | Fallback strategy |

### Expected Outcome
- Three-level threshold system implemented
- Similarity calculation between phonetic keys
- find_by_threshold method for threshold-based search
- Match classification (exact/close/fuzzy)
- Enhanced result ordering by similarity
- Flexible search with configurable precision

### Verification Checklist
- [ ] Threshold constants defined (EXACT, CLOSE, FUZZY)
- [ ] _calculate_similarity method implemented
- [ ] _classify_match method implemented
- [ ] find_by_threshold method implemented
- [ ] Exact threshold queries phonetic_key exactly
- [ ] Close threshold uses first 3 characters
- [ ] Fuzzy threshold uses first 2 characters
- [ ] Results ordered by similarity then frequency
- [ ] Method accepts threshold parameter
- [ ] Documentation explains threshold levels
- [ ] Test queries with different thresholds work correctly

---

## Task 46: Create Fuzzy Phonetic

### Overview
Implement the fuzzy phonetic search that combines Levenshtein distance (fuzzy string matching) with phonetic key matching to provide the most robust search experience. This hybrid approach falls back to fuzzy matching when phonetic matching returns insufficient results, and vice versa.

### Dependencies
- Task 45: Create Similarity Threshold
- Task 35: Create Fuzzy Search (from Group B)

### Instructions

1. **Create fuzzy phonetic method**
   - Add method `fuzzy_phonetic_search(self, query: str, limit: int = 10) -> List[Dict]`
   - Combine fuzzy and phonetic search strategies
   - Return unified result list with metadata

2. **Implement hybrid search strategy**
   - Start with phonetic search (find_similar)
   - If results < limit, supplement with fuzzy search
   - If phonetic finds no results, fallback to fuzzy entirely
   - Merge results and remove duplicates

3. **Add result scoring system**
   - Calculate phonetic_score: based on phonetic key match
   - Calculate fuzzy_score: based on Levenshtein distance
   - Calculate combined_score: weighted average of both
   - Weight formula: combined = (phonetic * 0.6) + (fuzzy * 0.4)

4. **Implement result deduplication**
   - Create method `_deduplicate_results(self, results: List[Dict]) -> List[Dict]`
   - Track seen word IDs
   - Keep result with higher combined score if duplicate
   - Maintain result order

5. **Add result enrichment**
   - Include match_type in results: "phonetic", "fuzzy", or "hybrid"
   - Include phonetic_key in results for transparency
   - Include individual scores (phonetic_score, fuzzy_score)
   - Include combined_score for overall relevance

6. **Implement sorting strategy**
   - Primary sort: combined_score (descending)
   - Secondary sort: frequency (descending)
   - Tertiary sort: Levenshtein distance (ascending)
   - Ensure consistent ordering

7. **Create fallback logic**
   - If phonetic_results.count() == 0, use fuzzy only
   - If phonetic_results.count() >= limit, use phonetic only
   - If 0 < phonetic_results.count() < limit, use hybrid
   - Log which strategy was used

8. **Add configurable weighting**
   - Create class constants for score weights
   - PHONETIC_WEIGHT: 0.6 (default)
   - FUZZY_WEIGHT: 0.4 (default)
   - Allow adjustment based on use case

9. **Integrate with FuzzySearch**
   - Import FuzzySearch from Group B
   - Create FuzzySearch instance
   - Call fuzzy_levenshtein_search method
   - Combine with phonetic results

10. **Add comprehensive logging**
    - Log search strategy used
    - Log result counts from each method
    - Log combined result count after deduplication
    - Format: "Fuzzy-Phonetic: phonetic=3, fuzzy=5, combined=7"

### Fuzzy Phonetic Search Flow

```
┌────────────────────────────────────┐
│  Input: query="kiri", limit=10     │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Step 1: Phonetic Search           │
│  find_similar("kiri", limit=10)    │
│  Results: 3 matches                │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Check: results < limit?           │
│  3 < 10? YES                       │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Step 2: Fuzzy Search              │
│  fuzzy_search("kiri", limit=7)     │
│  Results: 5 matches                │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Step 3: Merge & Deduplicate       │
│  Total: 8 unique matches           │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Step 4: Calculate Combined Score  │
│  phonetic_score * 0.6 +            │
│  fuzzy_score * 0.4                 │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Step 5: Sort by Combined Score    │
│  Return top 10                     │
└────────────────────────────────────┘
```

### Search Strategy Decision Tree

```
Query: "kiri"
    │
    ▼
Phonetic Search
    │
    ├─ 0 results ─────────→ Use FUZZY only
    │
    ├─ 1-9 results ───────→ Use HYBRID
    │                       (phonetic + fuzzy)
    │
    └─ 10+ results ───────→ Use PHONETIC only
```

### Result Structure

```python
{
    'word_id': 123,
    'romanized': 'kiri',
    'sinhala': 'කිරි',
    'meaning': 'milk',
    'phonetic_key': 'K600',
    'match_type': 'hybrid',  # or 'phonetic', 'fuzzy'
    'phonetic_score': 1.0,
    'fuzzy_score': 0.9,
    'combined_score': 0.96,  # (1.0 * 0.6) + (0.9 * 0.4)
    'frequency': 5000
}
```

### Score Calculation Examples

| Word | Phonetic Match | Phonetic Score | Fuzzy Score | Combined Score | Rank |
|------|----------------|----------------|-------------|----------------|------|
| kiri | Exact | 1.0 | 1.0 | 1.00 | 1 |
| keri | Exact | 1.0 | 0.75 | 0.90 | 2 |
| kiree | Close | 0.75 | 0.8 | 0.77 | 3 |
| kuru | Close | 0.75 | 0.5 | 0.65 | 4 |
| giri | None | 0.0 | 0.75 | 0.30 | 5 |

### Weight Configuration

| Scenario | Phonetic Weight | Fuzzy Weight | Use Case |
|----------|----------------|--------------|----------|
| Standard | 0.6 | 0.4 | Balanced approach |
| Phonetic Priority | 0.8 | 0.2 | Trust pronunciation more |
| Fuzzy Priority | 0.3 | 0.7 | Trust spelling more |
| Equal | 0.5 | 0.5 | No preference |

### Deduplication Logic

```
Phonetic Results:
- kiri (ID: 1, phonetic_score: 1.0)
- keri (ID: 2, phonetic_score: 1.0)

Fuzzy Results:
- kiri (ID: 1, fuzzy_score: 1.0)  ← Duplicate
- kiriya (ID: 3, fuzzy_score: 0.8)
- kuru (ID: 4, fuzzy_score: 0.7)

After Deduplication:
- kiri (ID: 1, combined: 1.0)     ← Kept best score
- keri (ID: 2, combined: 0.90)
- kiriya (ID: 3, combined: 0.32)
- kuru (ID: 4, combined: 0.28)
```

### fuzzy_phonetic_search Method Structure

```python
def fuzzy_phonetic_search(
    self,
    query: str,
    limit: int = 10,
    phonetic_weight: float = 0.6,
    fuzzy_weight: float = 0.4
) -> List[Dict]:
    """
    Combined fuzzy and phonetic search.
    
    Uses phonetic matching as primary strategy,
    supplements with fuzzy matching when needed.
    
    Args:
        query: Romanized search query
        limit: Maximum results
        phonetic_weight: Weight for phonetic score (0-1)
        fuzzy_weight: Weight for fuzzy score (0-1)
        
    Returns:
        List of dicts with word data and scores
    """
    # Implementation combines both strategies
```

### Expected Outcome
- Hybrid fuzzy-phonetic search method
- Combined scoring system with configurable weights
- Result deduplication and merging
- Intelligent fallback strategies
- Comprehensive result metadata
- Optimal search experience for users

### Verification Checklist
- [ ] fuzzy_phonetic_search method implemented
- [ ] Phonetic search called first
- [ ] Fuzzy search called when needed
- [ ] Result count thresholds working
- [ ] Combined scoring system implemented
- [ ] Score weights configurable (0.6 phonetic, 0.4 fuzzy)
- [ ] Deduplication removes duplicates
- [ ] Results include all metadata fields
- [ ] Sorting by combined_score working
- [ ] Fallback logic tested (0 results, partial, full)
- [ ] Integration with FuzzySearch from Group B
- [ ] Logging tracks strategy and result counts

---

## Summary

This document established the complete phonetic encoding and matching system for Sinhaglish search, including the SinhalaSoundex algorithm with consonant mapping, vowel handling, and double letter processing. The PhoneticMatcher provides similarity-based searching with configurable thresholds, and the fuzzy-phonetic hybrid approach delivers robust search results by combining phonetic and fuzzy matching strategies.

### Completed Tasks
1. ✓ Created PhoneticEncoder abstract base class
2. ✓ Created SinhalaSoundex with Sinhala-specific algorithm
3. ✓ Implemented encode method for 4-character phonetic keys
4. ✓ Created consonant mapping system (codes 1-6)
5. ✓ Implemented vowel handling with long vowel support
6. ✓ Created double letter deduplication
7. ✓ Created PhoneticMatcher for database queries
8. ✓ Implemented find_similar method with frequency ordering
9. ✓ Created similarity threshold system (exact/close/fuzzy)
10. ✓ Implemented fuzzy phonetic hybrid search

### Next Steps
Proceed to [02_Tasks-47-52_Patterns-Index.md](02_Tasks-47-52_Patterns-Index.md) to create transliteration pattern handling and phonetic indexing for complete phonetic search functionality.
