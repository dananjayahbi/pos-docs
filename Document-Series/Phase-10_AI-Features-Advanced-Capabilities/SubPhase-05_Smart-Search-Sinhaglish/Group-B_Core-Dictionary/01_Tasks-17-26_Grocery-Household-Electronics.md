# Tasks 17-26: Grocery, Household, and Electronics Dictionary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** B - Core Dictionary  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-36_Phrases-Service-Admin.md](02_Tasks-27-36_Phrases-Service-Admin.md)

---

## Document Overview

This document covers the creation of the core dictionary categories for grocery items, household products, clothing, and electronics. It establishes comprehensive word mappings between Romanized Sinhala (Sinhaglish), Sinhala script, and English for common retail items. These dictionary entries form the foundation for the smart search system, enabling users to search for products using natural Sinhala language patterns.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Grocery Words Category | High | 45 min |
| 18 | Create Milk/Dairy Words | Medium | 30 min |
| 19 | Create Rice/Grain Words | Medium | 30 min |
| 20 | Create Meat/Fish Words | Medium | 30 min |
| 21 | Create Vegetable Words | Medium | 35 min |
| 22 | Create Fruit Words | Medium | 30 min |
| 23 | Create Spice Words | Medium | 30 min |
| 24 | Create Household Words | Medium | 30 min |
| 25 | Create Clothing Words | Medium | 30 min |
| 26 | Create Electronics Words | Low | 25 min |

---

## Task 17: Create Grocery Words Category

### Overview
Create the main Grocery Words category structure in the dictionary system. This task establishes the foundational category for all grocery-related items including dairy products, rice/grains, meat/fish, vegetables, fruits, and spices. The category serves as the parent classification for all food-related items in the retail system.

### Dependencies
- Task 16: Create DictionaryCategory Model (from Group A)
- PostgreSQL database configured
- Django models migrated

### Instructions

1. **Navigate to dictionary data directory**
   - Go to `backend/apps/search/sinhaglish/dictionary/data/` directory
   - Create new file named `grocery.py`
   - This will contain all grocery-related dictionary entries

2. **Define category structure**
   - Create GROCERY_CATEGORY constant with category metadata
   - Set category name to "Grocery" in English
   - Set Sinhala name: "ආහාර" (aahara)
   - Set category code to "GROCERY"

3. **Create category description**
   - Write description for the category purpose
   - Include scope: food items, ingredients, consumables
   - Document usage: retail search, inventory categorization

4. **Initialize subcategory list**
   - Create GROCERY_SUBCATEGORIES list
   - Plan for 6 main subcategories: Dairy, Rice, Meat, Vegetables, Fruits, Spices
   - Each subcategory will be populated in subsequent tasks

5. **Define base data structure**
   - Create GROCERY_WORDS dictionary to hold all entries
   - Structure: Romanized as key, metadata as value
   - Include fields: sinhala_script, english, category, variants

6. **Set up category relationships**
   - Link to parent SinhalaWord model
   - Associate with DictionaryCategory
   - Prepare for subcategory assignments

7. **Create category initialization function**
   - Define function to create/update category in database
   - Handle category creation on first run
   - Support idempotent operations

### Category Structure

```
GROCERY (ආහාර)
├── Dairy (කිරි නිෂ්පාදන)
├── Rice/Grains (සහල්/ධාන්‍ය)
├── Meat/Fish (මස්/මාළු)
├── Vegetables (එළවළු)
├── Fruits (පලතුරු)
└── Spices (කුළුබඩු)
```

### Category Metadata

| Field | Value | Description |
|-------|-------|-------------|
| Name (EN) | Grocery | English category name |
| Name (SI) | ආහාර | Sinhala category name |
| Code | GROCERY | Unique identifier |
| Parent | None | Top-level category |
| Active | True | Enabled for search |

### Data Structure Format

| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| romanized | string | "kiri" | Search key |
| sinhala_script | string | "කිරි" | Display text |
| english | string | "milk" | Translation |
| category | string | "GROCERY_DAIRY" | Classification |
| variants | list | ["kiri", "keeri"] | Search variations |

### Category Organization

```
grocery.py
├── GROCERY_CATEGORY (metadata)
├── GROCERY_SUBCATEGORIES (list)
├── DAIRY_WORDS (dict)
├── RICE_WORDS (dict)
├── MEAT_WORDS (dict)
├── VEGETABLE_WORDS (dict)
├── FRUIT_WORDS (dict)
├── SPICE_WORDS (dict)
└── GROCERY_WORDS (combined dict)
```

### Expected Outcome
- Grocery category structure established in codebase
- Category metadata defined with English and Sinhala names
- Subcategory framework ready for population
- Data structures prepared for word entries
- Foundation for 400+ grocery word entries

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/dictionary/data/grocery.py` file created
- [ ] GROCERY_CATEGORY constant defined
- [ ] Category has English and Sinhala names
- [ ] Category code set to "GROCERY"
- [ ] Subcategory list initialized
- [ ] Data structure template created
- [ ] Category initialization function defined

---

## Task 18: Create Milk/Dairy Words

### Overview
Create comprehensive dictionary entries for milk and dairy products. This task populates the Dairy subcategory with Romanized Sinhala, Sinhala script, and English translations for common dairy items found in Sri Lankan retail contexts.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define dairy subcategory**
   - In `grocery.py`, create DAIRY_WORDS dictionary
   - Set subcategory identifier: "GROCERY_DAIRY"
   - Include metadata for dairy classification

2. **Add milk entries**
   - Primary entry: "kiri" → "කිරි" → "milk"
   - Add common variants: ["kiri", "keeri"]
   - Include context: fresh milk, powdered milk

3. **Add butter entries**
   - Entry: "meekiri" → "මීකිරි" → "butter"
   - Variants: ["meekiri", "mi kiri", "butter"]
   - Note: Both Sinhala and English terms commonly used

4. **Add curd/yogurt entries**
   - Entry: "palathuru" → "පළතුරු" → "curd"
   - Alternative: "dahi" → "දහි" → "yogurt"
   - Variants for both traditional curd and modern yogurt

5. **Add cheese entries**
   - Entry: "cheese" → "චීස්" → "cheese"
   - Note: English word commonly used in Sri Lanka
   - Variants: ["cheese", "chees"]

6. **Add ice cream entries**
   - Entry: "ice cream" → "අයිස් ක්‍රීම්" → "ice cream"
   - Alternative: "ais krim" → "අයිස් ක්‍රීම්" → "ice cream"
   - Variants: ["ice cream", "ais krim", "iscream"]

7. **Add additional dairy products**
   - Milk powder: "kiri piti" → "කිරි පිටි"
   - Condensed milk: "condensed milk" → "කන්ඩෙන්ස්ඩ් මිල්ක්"
   - Cream: "cream" → "ක්‍රීම්"

8. **Set up variant mappings**
   - Include phonetic variations for each word
   - Add common misspellings
   - Consider regional pronunciation differences

### Core Dairy Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| kiri | කිරි | Milk | kiri, keeri |
| meekiri | මීකිරි | Butter | meekiri, mi kiri, butter |
| palathuru | පළතුරු | Curd | palathuru, palaturu |
| cheese | චීස් | Cheese | cheese, chees |
| dahi | දහි | Yogurt | dahi, dhahi |
| kiri piti | කිරි පිටි | Milk powder | kiri piti, keeri piti |

### Dairy Category Structure

```
DAIRY (කිරි නිෂ්පාදන)
├── Milk Products
│   ├── Fresh Milk (kiri)
│   ├── Milk Powder (kiri piti)
│   └── Condensed Milk
├── Cultured Products
│   ├── Curd (palathuru)
│   └── Yogurt (dahi)
├── Butter/Spreads
│   ├── Butter (meekiri)
│   └── Cream
└── Other
    ├── Cheese
    └── Ice Cream
```

### Word Entry Format

```
"kiri": {
    "sinhala_script": "කිරි",
    "english": "milk",
    "category": "GROCERY_DAIRY",
    "subcategory": "MILK_PRODUCTS",
    "variants": ["kiri", "keeri"],
    "search_weight": 10,
    "common_usage": True
}
```

### Phonetic Variations Guide

| Word | Common Variations | Reason |
|------|------------------|---------|
| kiri | kiri, keeri | Vowel pronunciation |
| meekiri | meekiri, mi kiri, miikiri | Spacing, length |
| palathuru | palathuru, palaturu, pala thuru | Simplified spelling |
| dahi | dahi, dhahi | H aspiration |

### Expected Outcome
- Complete dairy product dictionary entries
- 20-30 dairy-related words with Romanized, Sinhala, and English
- Multiple variants per word for flexible search
- Proper categorization under GROCERY_DAIRY
- Ready for integration with search system

### Verification Checklist
- [ ] DAIRY_WORDS dictionary created in grocery.py
- [ ] All core dairy items included (milk, butter, curd, cheese, yogurt)
- [ ] Each entry has romanized, sinhala_script, and english fields
- [ ] Variants list defined for each word
- [ ] Subcategory identifier set correctly
- [ ] Common and uncommon dairy items covered
- [ ] Regional variations considered

---

## Task 19: Create Rice/Grain Words

### Overview
Create dictionary entries for rice and grain products. Sri Lankan cuisine heavily features rice and grains, making this a critical category for retail search. Include both raw and cooked forms, different rice varieties, and grain products.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define rice/grain subcategory**
   - In `grocery.py`, create RICE_WORDS dictionary
   - Set subcategory identifier: "GROCERY_RICE"
   - Include metadata for grain classification

2. **Add raw rice entries**
   - Primary: "sahal" → "සහල්" → "rice (raw)"
   - Alternative: "hal" → "හාල්" → "rice"
   - Variants: ["sahal", "sahal", "haal", "hal"]

3. **Add cooked rice entries**
   - Primary: "bath" → "බත්" → "rice (cooked)"
   - Note: Very common word in daily usage
   - Variants: ["bath", "bat"]

4. **Add fried rice entries**
   - Entry: "thel bath" → "තෙල් බත්" → "fried rice"
   - Alternative: "fried rice" (English commonly used)
   - Variants: ["thel bath", "tel bath", "fried rice"]

5. **Add rice varieties**
   - Red rice: "ratu sahal" → "රතු සහල්"
   - White rice: "sudu sahal" → "සුදු සහල්"
   - Basmati: "basmati" → "බාස්මති"
   - Samba: "samba" → "සම්බා"

6. **Add grain products**
   - Finger millet: "kurakkan" → "කුරක්කන්"
   - Wheat: "godamba" → "ගෝධම්බ"
   - Flour: "piti" → "පිටි"
   - Bread: "pan" → "පාන්"

7. **Add traditional rice dishes**
   - Rice and curry: "bath kari" → "බත් කරී"
   - Milk rice: "kiri bath" → "කිරි බත්"
   - String hoppers: "indiappa" → "ඉඳිආප්ප"

8. **Include cooking stages**
   - Uncooked, cooked, fried variations
   - Different preparation methods
   - Product forms (grain, flour, finished)

### Core Rice/Grain Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| sahal | සහල් | Rice (raw) | sahal, sahala, haal, hal |
| bath | බත් | Rice (cooked) | bath, bat |
| thel bath | තෙල් බත් | Fried rice | thel bath, tel bath |
| kurakkan | කුරක්කන් | Finger millet | kurakkan, kurakan |
| godamba | ගෝධම්බ | Wheat | godamba, godumba |
| piti | පිටි | Flour | piti, peeti |

### Rice Category Structure

```
RICE/GRAINS (සහල්/ධාන්‍ය)
├── Rice Forms
│   ├── Raw (sahal)
│   ├── Cooked (bath)
│   └── Fried (thel bath)
├── Rice Varieties
│   ├── Red Rice (ratu sahal)
│   ├── White Rice (sudu sahal)
│   ├── Basmati
│   └── Samba
├── Other Grains
│   ├── Finger Millet (kurakkan)
│   ├── Wheat (godamba)
│   └── Corn
└── Grain Products
    ├── Flour (piti)
    ├── Bread (pan)
    └── Noodles
```

### Word Entry Format

```
"sahal": {
    "sinhala_script": "සහල්",
    "english": "rice",
    "category": "GROCERY_RICE",
    "subcategory": "RICE_RAW",
    "variants": ["sahal", "sahala", "haal", "hal"],
    "search_weight": 10,
    "common_usage": True,
    "notes": "Raw/uncooked rice"
}
```

### Rice Variety Mapping

| Variety | Sinhala | Search Terms | Usage |
|---------|---------|--------------|-------|
| Red Rice | රතු සහල් | ratu sahal, red rice | Health food |
| White Rice | සුදු සහල් | sudu sahal, white rice | Common staple |
| Basmati | බාස්මති | basmati, baas mathi | Premium rice |
| Samba | සම්බා | samba, sambar | Medium grain |

### Expected Outcome
- Complete rice and grain dictionary entries
- 30-40 entries covering rice varieties and grain products
- Multiple forms (raw, cooked, processed)
- Traditional and modern preparation methods
- Ready for retail product search

### Verification Checklist
- [ ] RICE_WORDS dictionary created in grocery.py
- [ ] Core rice entries (sahal, bath, thel bath)
- [ ] Rice varieties included
- [ ] Grain products (kurakkan, godamba, piti)
- [ ] Variants for pronunciation differences
- [ ] Cooking stage variations
- [ ] Traditional dish names included

---

## Task 20: Create Meat/Fish Words

### Overview
Create dictionary entries for meat and fish products. Sri Lankan cuisine features various meat and seafood items, and these entries enable customers to search for proteins in their natural language.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define meat/fish subcategory**
   - In `grocery.py`, create MEAT_WORDS dictionary
   - Set subcategory identifier: "GROCERY_MEAT"
   - Include both meat and fish in same category

2. **Add fish entries**
   - Primary: "malu" → "මළු" → "fish"
   - Alternative: "malu" → "මාළු" → "fish"
   - Variants: ["malu", "maaluu", "mallu"]

3. **Add general meat entry**
   - Primary: "mas" → "මස්" → "meat"
   - Very common generic term
   - Variants: ["mas", "masa"]

4. **Add chicken entries**
   - Entry: "kukul mas" → "කුකුල් මස්" → "chicken"
   - Alternative: "chicken" (English widely used)
   - Variants: ["kukul mas", "kukul", "chicken"]

5. **Add pork entries**
   - Entry: "uru mas" → "උරු මස්" → "pork"
   - Alternative: "pork" (English used)
   - Variants: ["uru mas", "uru", "pork"]

6. **Add beef entries**
   - Entry: "gonas" → "ගොනස්" → "beef"
   - Alternative: "beef" (English used)
   - Variants: ["gonas", "gonasa", "beef"]

7. **Add mutton/goat entries**
   - Entry: "badata mas" → "බඩ ඇතා මස්" → "mutton"
   - Alternative: "mutton", "goat"
   - Variants: ["badata mas", "mutton"]

8. **Add seafood entries**
   - Prawns: "isso" → "ඉස්සෝ" → "prawns"
   - Crab: "kakuluwa" → "කැකුළුවා" → "crab"
   - Squid: "dhallo" → "ධල්ලෝ" → "squid"

9. **Add fish varieties**
   - Tuna: "kelawalla" → "කෙලවල්ලා"
   - Sardines: "halmassa" → "හල්මැස්සෝ"
   - Mackerel: "kumbalawa" → "කුම්බලාවා"

### Core Meat/Fish Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| malu | මළු | Fish | malu, maaluu, mallu |
| mas | මස් | Meat | mas, masa |
| kukul mas | කුකුල් මස් | Chicken | kukul mas, kukul, chicken |
| uru mas | උරු මස් | Pork | uru mas, uru, pork |
| gonas | ගොනස් | Beef | gonas, gonasa, beef |
| badata mas | බඩ ඇතා මස් | Mutton | badata mas, mutton |

### Meat/Fish Category Structure

```
MEAT/FISH (මස්/මාළු)
├── General
│   ├── Meat (mas)
│   └── Fish (malu)
├── Poultry
│   └── Chicken (kukul mas)
├── Red Meat
│   ├── Beef (gonas)
│   ├── Pork (uru mas)
│   └── Mutton (badata mas)
├── Seafood
│   ├── Prawns (isso)
│   ├── Crab (kakuluwa)
│   └── Squid (dhallo)
└── Fish Varieties
    ├── Tuna (kelawalla)
    ├── Sardines (halmassa)
    └── Mackerel (kumbalawa)
```

### Word Entry Format

```
"malu": {
    "sinhala_script": "මළු",
    "english": "fish",
    "category": "GROCERY_MEAT",
    "subcategory": "SEAFOOD",
    "variants": ["malu", "maaluu", "mallu"],
    "search_weight": 10,
    "common_usage": True
}
```

### Seafood Varieties

| Type | Romanized | Sinhala | English |
|------|-----------|---------|---------|
| Prawns | isso | ඉස්සෝ | prawns |
| Crab | kakuluwa | කැකුළුවා | crab |
| Squid | dhallo | ධල්ලෝ | squid |
| Tuna | kelawalla | කෙලවල්ලා | tuna |
| Sardines | halmassa | හල්මැස්සෝ | sardines |

### Expected Outcome
- Complete meat and fish dictionary
- 25-35 entries for proteins
- Both Sinhala and English terms
- Variety-specific entries
- Generic and specific terms

### Verification Checklist
- [ ] MEAT_WORDS dictionary created
- [ ] Generic terms (mas, malu)
- [ ] Specific meats (chicken, pork, beef, mutton)
- [ ] Seafood entries (prawns, crab, squid)
- [ ] Fish varieties included
- [ ] English alternatives for common terms
- [ ] Variants cover pronunciation differences

---

## Task 21: Create Vegetable Words

### Overview
Create comprehensive dictionary entries for vegetables. This is one of the largest categories as Sri Lankan cuisine uses a wide variety of vegetables, many with unique Sinhala names.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define vegetable subcategory**
   - In `grocery.py`, create VEGETABLE_WORDS dictionary
   - Set subcategory identifier: "GROCERY_VEGETABLE"
   - Plan for 40-50 vegetable entries

2. **Add generic vegetable term**
   - Entry: "elawalu" → "එළවළු" → "vegetables"
   - Variants: ["elawalu", "elavalu"]

3. **Add common vegetables**
   - Potato: "ala" → "අල"
   - Onion: "loonu" → "ලූනු"
   - Carrot: "carrots" → "කැරට්"
   - Tomato: "thakkali" → "තක්කාලි"

4. **Add leafy greens**
   - Spinach: "nivithi" → "නිවිති"
   - Kale: "kale" → "කේල්"
   - Lettuce: "lettuce" → "ලෙටිස්"

5. **Add gourds and squash**
   - Bitter gourd: "karawila" → "කරවිල"
   - Pumpkin: "watakka" → "වටක්කා"
   - Snake gourd: "pathola" → "පතෝල"
   - Ridge gourd: "wetakolu" → "වෙටකොළු"

6. **Add legumes and pods**
   - Okra: "bandakka" → "බණ්ඩක්කා"
   - Green beans: "bonchi" → "බෝංචි"
   - Long beans: "mee bonchi" → "මී බෝංචි"

7. **Add root vegetables**
   - Sweet potato: "bathala" → "බතල"
   - Beetroot: "rathu ala" → "රතු අල"
   - Radish: "rabu" → "රාබු"

8. **Add common curry vegetables**
   - Eggplant: "wambatu" → "වම්බටු"
   - Capsicum: "maalu miris" → "මාළු මිරිස්"
   - Leeks: "leeks" → "ලීක්ස්"

9. **Add specialty vegetables**
   - Drumstick: "murunga" → "මුරුංගා"
   - Jackfruit: "kos" → "කොස්"
   - Breadfruit: "del" → "දෙල්"

### Core Vegetable Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| elawalu | එළවළු | Vegetables | elawalu, elavalu |
| karawila | කරවිල | Bitter gourd | karawila, karawilla |
| bandakka | බණ්ඩක්කා | Okra | bandakka, bandakaa |
| ala | අල | Potato | ala, aalaa |
| loonu | ලූනු | Onion | loonu, lunu |
| thakkali | තක්කාලි | Tomato | thakkali, thakkali |

### Vegetable Category Structure

```
VEGETABLES (එළවළු)
├── Common Vegetables
│   ├── Potato (ala)
│   ├── Onion (loonu)
│   ├── Carrot (carrots)
│   └── Tomato (thakkali)
├── Gourds
│   ├── Bitter Gourd (karawila)
│   ├── Pumpkin (watakka)
│   ├── Snake Gourd (pathola)
│   └── Ridge Gourd (wetakolu)
├── Leafy Greens
│   ├── Spinach (nivithi)
│   └── Kale
├── Legumes/Pods
│   ├── Okra (bandakka)
│   ├── Green Beans (bonchi)
│   └── Long Beans (mee bonchi)
└── Specialty
    ├── Drumstick (murunga)
    ├── Jackfruit (kos)
    └── Breadfruit (del)
```

### Word Entry Format

```
"karawila": {
    "sinhala_script": "කරවිල",
    "english": "bitter gourd",
    "category": "GROCERY_VEGETABLE",
    "subcategory": "GOURDS",
    "variants": ["karawila", "karawilla", "karavila"],
    "search_weight": 8,
    "common_usage": True
}
```

### Gourd Varieties

| Romanized | Sinhala | English | Type |
|-----------|---------|---------|------|
| karawila | කරවිල | Bitter gourd | Gourd |
| watakka | වටක්කා | Pumpkin | Squash |
| pathola | පතෝල | Snake gourd | Gourd |
| wetakolu | වෙටකොළු | Ridge gourd | Gourd |
| labu | ලාබු | Bottle gourd | Gourd |

### Expected Outcome
- Comprehensive vegetable dictionary
- 40-50 vegetable entries
- Common and specialty vegetables
- Proper categorization by type
- Multiple variants per vegetable

### Verification Checklist
- [ ] VEGETABLE_WORDS dictionary created
- [ ] Generic term (elawalu) included
- [ ] Common vegetables (potato, onion, carrot, tomato)
- [ ] Gourds category (karawila, watakka, pathola)
- [ ] Leafy greens included
- [ ] Legumes and pods (bandakka, bonchi)
- [ ] Root vegetables included
- [ ] Specialty vegetables (murunga, kos)

---

## Task 22: Create Fruit Words

### Overview
Create dictionary entries for fruits commonly sold in Sri Lankan retail. Include both local tropical fruits and imported varieties, with proper Romanized Sinhala, Sinhala script, and English mappings.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define fruit subcategory**
   - In `grocery.py`, create FRUIT_WORDS dictionary
   - Set subcategory identifier: "GROCERY_FRUIT"
   - Plan for 30-40 fruit entries

2. **Add generic fruit term**
   - Entry: "palam" → "පලම්" → "fruit"
   - Alternative: "palathuru" → "පලතුරු" → "fruits"
   - Variants: ["palam", "palama", "palathuru"]

3. **Add tropical fruits**
   - Banana: "kesel" → "කෙසෙල්" → "banana"
   - Mango: "amba" → "අඹ" → "mango"
   - Pineapple: "ananas" → "අන්නාසි" → "pineapple"
   - Papaya: "papol" → "පැපොල්" → "papaya"

4. **Add citrus fruits**
   - Orange: "dodam" → "දොඩම්" → "orange"
   - Lime: "dehi" → "දෙහි" → "lime"
   - Lemon: "lemon" → "ලෙමන්" → "lemon"

5. **Add local fruits**
   - Jackfruit: "kos" → "කොස්" → "jackfruit"
   - Wood apple: "divul" → "දිවුල්" → "wood apple"
   - Rambutan: "rambutan" → "රම්බුටන්" → "rambutan"
   - Mangosteen: "mangus" → "මැංගුස්" → "mangosteen"

6. **Add common imported fruits**
   - Apple: "apple" → "ඇපල්" → "apple"
   - Grapes: "midhi" → "මිදි" → "grapes"
   - Watermelon: "komadu" → "කොමඩු" → "watermelon"
   - Melon: "melo" → "මෙලෝ" → "melon"

7. **Add berry varieties**
   - Strawberry: "strawberry" → "ස්ට්‍රෝබෙරි" → "strawberry"
   - Blueberry: "blueberry" → "බ්ලුබෙරි" → "blueberry"

8. **Add seasonal fruits**
   - Avocado: "alligator pear" → "අලිගැට" → "avocado"
   - Passion fruit: "passion fruit" → "පැෂන් ෆෘට්" → "passion fruit"
   - Dragon fruit: "dragon fruit" → "ඩ්‍රැගන් ෆෘට්" → "dragon fruit"

### Core Fruit Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| palam | පලම් | Fruit | palam, palama, palathuru |
| kesel | කෙසෙල් | Banana | kesel, kesela |
| amba | අඹ | Mango | amba, anba |
| ananas | අන්නාසි | Pineapple | ananas, annasi |
| papol | පැපොල් | Papaya | papol, papola |
| dodam | දොඩම් | Orange | dodam, dodama |

### Fruit Category Structure

```
FRUITS (පලතුරු)
├── Tropical
│   ├── Banana (kesel)
│   ├── Mango (amba)
│   ├── Pineapple (ananas)
│   └── Papaya (papol)
├── Citrus
│   ├── Orange (dodam)
│   ├── Lime (dehi)
│   └── Lemon
├── Local Specialty
│   ├── Jackfruit (kos)
│   ├── Wood Apple (divul)
│   ├── Rambutan
│   └── Mangosteen
├── Imported
│   ├── Apple
│   ├── Grapes (midhi)
│   └── Watermelon (komadu)
└── Berries
    ├── Strawberry
    └── Blueberry
```

### Word Entry Format

```
"kesel": {
    "sinhala_script": "කෙසෙල්",
    "english": "banana",
    "category": "GROCERY_FRUIT",
    "subcategory": "TROPICAL",
    "variants": ["kesel", "kesela", "kesol"],
    "search_weight": 10,
    "common_usage": True
}
```

### Tropical Fruit Mapping

| Fruit | Romanized | Sinhala | Variants |
|-------|-----------|---------|----------|
| Banana | kesel | කෙසෙල් | kesel, kesela |
| Mango | amba | අඹ | amba, anba |
| Pineapple | ananas | අන්නාසි | ananas, annasi |
| Papaya | papol | පැපොල් | papol, papola |
| Coconut | pol | පොල් | pol, pola |

### Expected Outcome
- Complete fruit dictionary
- 30-40 fruit entries
- Tropical and imported varieties
- Both Sinhala and English terms
- Seasonal and year-round fruits

### Verification Checklist
- [ ] FRUIT_WORDS dictionary created
- [ ] Generic term (palam) included
- [ ] Tropical fruits (banana, mango, pineapple, papaya)
- [ ] Citrus fruits (orange, lime, lemon)
- [ ] Local specialty fruits (kos, divul, rambutan)
- [ ] Imported fruits (apple, grapes, watermelon)
- [ ] Berry varieties included
- [ ] Variants cover pronunciation differences

---

## Task 23: Create Spice Words

### Overview
Create dictionary entries for spices and seasonings. Sri Lankan cuisine is renowned for its spices, making this a critical category. Include traditional spices with their Romanized Sinhala, Sinhala script, and English names.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define spice subcategory**
   - In `grocery.py`, create SPICE_WORDS dictionary
   - Set subcategory identifier: "GROCERY_SPICE"
   - Plan for 25-30 spice entries

2. **Add cinnamon entries**
   - Entry: "kurundu" → "කුරුඳු" → "cinnamon"
   - Note: Sri Lanka famous for cinnamon
   - Variants: ["kurundu", "kurudu"]

3. **Add pepper entries**
   - Black pepper: "gammiris" → "ගම්මිරිස්" → "pepper"
   - Variants: ["gammiris", "gammiris"]

4. **Add clove entries**
   - Entry: "karabu nati" → "කරාබු නැටි" → "cloves"
   - Alternative: "cloves" (English used)
   - Variants: ["karabu nati", "cloves"]

5. **Add cardamom entries**
   - Entry: "enasal" → "එනසාල්" → "cardamom"
   - Variants: ["enasal", "enasala"]

6. **Add nutmeg entries**
   - Entry: "sadikka" → "සාදික්කා" → "nutmeg"
   - Variants: ["sadikka", "saadikka"]

7. **Add curry leaves**
   - Entry: "karapincha" → "කරපිංචා" → "curry leaves"
   - Very common in Sri Lankan cooking
   - Variants: ["karapincha", "karapinchaa"]

8. **Add chili entries**
   - Entry: "miris" → "මිරිස්" → "chili"
   - Red chili: "ratu miris" → "රතු මිරිස්"
   - Variants: ["miris", "mirisa"]

9. **Add turmeric entries**
   - Entry: "kaha" → "කහ" → "turmeric"
   - Variants: ["kaha", "kahaa"]

10. **Add other common spices**
    - Cumin: "suduru" → "සුදුරු" → "cumin"
    - Coriander: "kottamalli" → "කොත්තමල්ලි" → "coriander"
    - Fenugreek: "uluhal" → "උළුහාල්" → "fenugreek"
    - Mustard: "aba" → "අබ" → "mustard"

### Core Spice Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| kurundu | කුරුඳු | Cinnamon | kurundu, kurudu |
| gammiris | ගම්මිරිස් | Pepper | gammiris, gam miris |
| karabu nati | කරාබු නැටි | Cloves | karabu nati, cloves |
| enasal | එනසාල් | Cardamom | enasal, enasala |
| sadikka | සාදික්කා | Nutmeg | sadikka, saadikka |
| karapincha | කරපිංචා | Curry leaves | karapincha, karapinchaa |

### Spice Category Structure

```
SPICES (කුළුබඩු)
├── Essential Spices
│   ├── Cinnamon (kurundu)
│   ├── Pepper (gammiris)
│   ├── Cloves (karabu nati)
│   ├── Cardamom (enasal)
│   └── Nutmeg (sadikka)
├── Curry Spices
│   ├── Curry Leaves (karapincha)
│   ├── Cumin (suduru)
│   ├── Coriander (kottamalli)
│   └── Fenugreek (uluhal)
├── Chili/Pepper
│   ├── Chili (miris)
│   ├── Red Chili (ratu miris)
│   └── Green Chili (alu miris)
└── Other
    ├── Turmeric (kaha)
    ├── Mustard (aba)
    └── Ginger (inguru)
```

### Word Entry Format

```
"kurundu": {
    "sinhala_script": "කුරුඳු",
    "english": "cinnamon",
    "category": "GROCERY_SPICE",
    "subcategory": "ESSENTIAL_SPICES",
    "variants": ["kurundu", "kurudu"],
    "search_weight": 9,
    "common_usage": True,
    "notes": "Ceylon cinnamon"
}
```

### Spice Importance Rating

| Spice | Usage Frequency | Search Weight | Category |
|-------|----------------|---------------|----------|
| Curry Leaves | Very High | 10 | Essential |
| Chili | Very High | 10 | Essential |
| Cinnamon | High | 9 | Essential |
| Pepper | High | 9 | Essential |
| Turmeric | High | 8 | Essential |
| Cumin | Medium | 7 | Curry |

### Expected Outcome
- Complete spice dictionary
- 25-30 spice entries
- Traditional and modern names
- Proper categorization
- High-frequency spices prioritized

### Verification Checklist
- [ ] SPICE_WORDS dictionary created
- [ ] Essential spices (cinnamon, pepper, cloves, cardamom, nutmeg)
- [ ] Curry spices (curry leaves, cumin, coriander, fenugreek)
- [ ] Chili varieties (miris, ratu miris, alu miris)
- [ ] Turmeric and other common spices
- [ ] Variants for pronunciation differences
- [ ] Search weights assigned appropriately

---

## Task 24: Create Household Words

### Overview
Create dictionary entries for common household items beyond groceries. These items are frequently purchased at retail stores and supermarkets, including cleaning supplies, personal care items, and basic household necessities.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Create household category file**
   - In `backend/apps/search/sinhaglish/dictionary/data/`, create `household.py`
   - Define HOUSEHOLD_CATEGORY constant
   - Set category identifier: "HOUSEHOLD"

2. **Add water entries**
   - Entry: "watura" → "වතුර" → "water"
   - Alternative: "water" (English commonly used)
   - Variants: ["watura", "watara", "water"]

3. **Add cleaning supplies**
   - Soap: "sabun" → "සබන්" → "soap"
   - Detergent: "detergent" → "ඩිටර්ජන්ට්" → "detergent"
   - Washing powder: "dho piti" → "ධෝ පිටි" → "washing powder"

4. **Add fuel/energy items**
   - Gas: "gas" → "ගෑස්" → "gas"
   - Oil: "tel" → "තෙල්" → "oil"
   - Kerosene: "kerosin" → "කෙරොසින්" → "kerosene"

5. **Add paper products**
   - Toilet paper: "toilet paper" → "ටොයිලට් පේපර්" → "toilet paper"
   - Tissue: "tissue" → "ටිෂූ" → "tissue"
   - Paper towel: "paper towel" → "පේපර් ටවල්" → "paper towel"

6. **Add personal care items**
   - Toothpaste: "dath pita" → "දත් පිට" → "toothpaste"
   - Shampoo: "shampoo" → "ෂැම්පූ" → "shampoo"
   - Bath soap: "nahana sabun" → "නහන සබන්" → "bath soap"

7. **Add kitchen items**
   - Dishwashing liquid: "bath dhuwanna" → "බත් ධුවන්න" → "dishwashing liquid"
   - Matches: "gini kutu" → "ගිනි කූටු" → "matches"
   - Candles: "vati" → "වැටි" → "candles"

8. **Add other household necessities**
   - Bulb: "bulb" → "බල්බ්" → "bulb"
   - Battery: "battery" → "බැටරිය" → "battery"
   - Mosquito coil: "masagoya" → "මසගෝයා" → "mosquito coil"

### Core Household Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| watura | වතුර | Water | watura, watara, water |
| sabun | සබන් | Soap | sabun, saabun |
| gas | ගෑස් | Gas | gas, gaas |
| tel | තෙල් | Oil | tel, tela |
| tissue | ටිෂූ | Tissue | tissue |
| shampoo | ෂැම්පූ | Shampoo | shampoo |

### Household Category Structure

```
HOUSEHOLD (ගෘහ භාණ්ඩ)
├── Cleaning Supplies
│   ├── Soap (sabun)
│   ├── Detergent
│   ├── Washing Powder (dho piti)
│   └── Dishwashing Liquid
├── Fuel/Energy
│   ├── Gas (gas)
│   ├── Oil (tel)
│   └── Kerosene
├── Paper Products
│   ├── Toilet Paper
│   ├── Tissue
│   └── Paper Towel
├── Personal Care
│   ├── Toothpaste (dath pita)
│   ├── Shampoo
│   └── Bath Soap
└── Utilities
    ├── Bulb
    ├── Battery
    └── Mosquito Coil
```

### Word Entry Format

```
"watura": {
    "sinhala_script": "වතුර",
    "english": "water",
    "category": "HOUSEHOLD",
    "subcategory": "BASIC_NECESSITIES",
    "variants": ["watura", "watara", "water"],
    "search_weight": 10,
    "common_usage": True
}
```

### Expected Outcome
- Household items dictionary in separate file
- 20-25 common household items
- Cleaning, personal care, and utility items
- Both Sinhala and English terms
- Ready for retail search integration

### Verification Checklist
- [ ] household.py file created
- [ ] HOUSEHOLD_CATEGORY defined
- [ ] Basic necessities (water, soap, gas, oil)
- [ ] Cleaning supplies included
- [ ] Personal care items included
- [ ] Paper products included
- [ ] Kitchen and utility items included
- [ ] Variants for common terms

---

## Task 25: Create Clothing Words

### Overview
Create dictionary entries for common clothing items. Include traditional Sri Lankan clothing and modern apparel commonly searched in retail contexts.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define clothing category**
   - In `household.py` or create `clothing.py`
   - Define CLOTHING_CATEGORY constant
   - Set category identifier: "CLOTHING"

2. **Add traditional clothing**
   - Sarong: "sarama" → "සරම" → "sarong"
   - Jacket: "hettaya" → "හෙට්ටය" → "jacket"
   - Shirt: "kamisaya" → "කමිසය" → "shirt"
   - Trouser: "pattalama" → "පට්ටලම" → "trouser"

3. **Add common garments**
   - Dress: "dress" → "ඩ්‍රෙස්" → "dress"
   - Skirt: "skirt" → "ස්කර්ට්" → "skirt"
   - Blouse: "blouse" → "බ්ලවුස්" → "blouse"

4. **Add undergarments**
   - Underwear: "avattam" → "අවට්ටම්" → "underwear"
   - Bra: "bra" → "බ්‍රා" → "bra"

5. **Add footwear**
   - Shoes: "sapattu" → "සපත්තු" → "shoes"
   - Slippers: "sepal" → "සෙපල්" → "slippers"
   - Sandals: "sandals" → "සැන්ඩල්" → "sandals"

6. **Add accessories**
   - Belt: "belt" → "බෙල්ට්" → "belt"
   - Hat: "topiya" → "ටෝපිය" → "hat"
   - Scarf: "scarf" → "ස්කාෆ්" → "scarf"

7. **Add children's clothing**
   - Baby clothes: "baba kandam" → "බබා කඳම්" → "baby clothes"
   - School uniform: "school uniform" → "පාසල් ඇඳුම" → "school uniform"

### Core Clothing Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| sarama | සරම | Sarong | sarama, saramma |
| hettaya | හෙට්ටය | Jacket | hettaya, hetaya |
| kamisaya | කමිසය | Shirt | kamisaya, kamise |
| pattalama | පට්ටලම | Trouser | pattalama, patala |
| sapattu | සපත්තු | Shoes | sapattu, sapathu |
| sepal | සෙපල් | Slippers | sepal, sepala |

### Clothing Category Structure

```
CLOTHING (ඇඳුම්)
├── Traditional
│   ├── Sarong (sarama)
│   ├── Jacket (hettaya)
│   └── Osariya
├── Modern Wear
│   ├── Shirt (kamisaya)
│   ├── Trouser (pattalama)
│   ├── Dress
│   └── Skirt
├── Footwear
│   ├── Shoes (sapattu)
│   ├── Slippers (sepal)
│   └── Sandals
├── Undergarments
│   ├── Underwear (avattam)
│   └── Bra
└── Accessories
    ├── Belt
    ├── Hat (topiya)
    └── Scarf
```

### Expected Outcome
- Complete clothing dictionary
- 20-25 clothing items
- Traditional and modern apparel
- Footwear and accessories
- Children's clothing included

### Verification Checklist
- [ ] CLOTHING_CATEGORY created
- [ ] Traditional clothing (sarama, hettaya, kamisaya, pattalama)
- [ ] Modern wear included
- [ ] Footwear (shoes, slippers, sandals)
- [ ] Undergarments included
- [ ] Accessories included
- [ ] Variants for pronunciation differences

---

## Task 26: Create Electronics Words

### Overview
Create dictionary entries for common electronics and appliances. These items are increasingly searched in retail contexts, especially with the growth of electronic stores and supermarkets selling appliances.

### Dependencies
- Task 17: Create Grocery Words Category

### Instructions

1. **Define electronics category**
   - In `household.py` or create separate file
   - Define ELECTRONICS_CATEGORY constant
   - Set category identifier: "ELECTRONICS"

2. **Add mobile phone entries**
   - Entry: "phone" → "දුරකථනය" → "phone"
   - Alternative: "mobile" → "ජංගම" → "mobile"
   - Variants: ["phone", "mobile", "fon"]

3. **Add television entries**
   - Entry: "TV" → "රූපවාහිනිය" → "television"
   - Alternative: "television" (English widely used)
   - Variants: ["TV", "television", "teevee"]

4. **Add computer entries**
   - Entry: "computer" → "පරිගණකය" → "computer"
   - Variants: ["computer", "komputer"]

5. **Add refrigerator entries**
   - Entry: "fridge" → "ශීතකරණය" → "refrigerator"
   - Alternative: "refrigerator"
   - Variants: ["fridge", "refrigerator", "frij"]

6. **Add washing machine**
   - Entry: "washing machine" → "රෙදි සෝදන යන්ත්‍රය" → "washing machine"
   - Variants: ["washing machine", "washer"]

7. **Add fan entries**
   - Entry: "fan" → "විදුලි පංකාව" → "fan"
   - Variants: ["fan", "fana"]

8. **Add other common electronics**
   - Rice cooker: "bath yantraya" → "බත් යන්ත්‍රය" → "rice cooker"
   - Iron: "iron" → "යකඩ" → "iron"
   - Kettle: "kettle" → "කෙට්ල්" → "kettle"
   - Blender: "blender" → "බ්ලෙන්ඩර්" → "blender"

### Core Electronics Words

| Romanized | Sinhala | English | Variants |
|-----------|---------|---------|----------|
| phone | දුරකථනය | Phone | phone, fon, mobile |
| TV | රූපවාහිනිය | Television | TV, television, teevee |
| computer | පරිගණකය | Computer | computer, komputer |
| fridge | ශීතකරණය | Refrigerator | fridge, refrigerator, frij |
| fan | විදුලි පංකාව | Fan | fan, fana |
| iron | යකඩ | Iron | iron, ayana |

### Electronics Category Structure

```
ELECTRONICS (විදුලි භාණ්ඩ)
├── Communication
│   ├── Phone
│   ├── Mobile
│   └── Computer
├── Entertainment
│   ├── TV
│   ├── Radio
│   └── Speaker
├── Kitchen Appliances
│   ├── Refrigerator (fridge)
│   ├── Rice Cooker (bath yantraya)
│   ├── Kettle
│   └── Blender
├── Home Appliances
│   ├── Washing Machine
│   ├── Fan
│   └── Iron
└── Other
    ├── Camera
    └── Charger
```

### Word Entry Format

```
"phone": {
    "sinhala_script": "දුරකථනය",
    "english": "phone",
    "category": "ELECTRONICS",
    "subcategory": "COMMUNICATION",
    "variants": ["phone", "fon", "mobile"],
    "search_weight": 9,
    "common_usage": True
}
```

### Expected Outcome
- Electronics dictionary entries
- 15-20 common electronics items
- Communication, entertainment, and appliances
- Modern terms with Sinhala equivalents
- Ready for retail search

### Verification Checklist
- [ ] ELECTRONICS_CATEGORY created
- [ ] Communication devices (phone, computer)
- [ ] Entertainment (TV, radio)
- [ ] Kitchen appliances (fridge, rice cooker, kettle, blender)
- [ ] Home appliances (washing machine, fan, iron)
- [ ] English terms with Sinhala equivalents
- [ ] Variants for common pronunciations

---

## Summary

This document established the core dictionary categories for grocery items (dairy, rice, meat, vegetables, fruits, spices), household products, clothing, and electronics. These dictionary entries provide the foundation for the Sinhaglish smart search system, enabling natural language product searches in Sri Lankan retail contexts.

### Completed Tasks
1. ✓ Created Grocery Words category structure with 6 subcategories
2. ✓ Created Milk/Dairy words with 20-30 entries
3. ✓ Created Rice/Grain words with 30-40 entries
4. ✓ Created Meat/Fish words with 25-35 entries
5. ✓ Created Vegetable words with 40-50 entries
6. ✓ Created Fruit words with 30-40 entries
7. ✓ Created Spice words with 25-30 entries
8. ✓ Created Household words with 20-25 entries
9. ✓ Created Clothing words with 20-25 entries
10. ✓ Created Electronics words with 15-20 entries

### Next Steps
Proceed to [02_Tasks-27-36_Phrases-Service-Admin.md](02_Tasks-27-36_Phrases-Service-Admin.md) to create common phrases, color/size/quantity words, implement the DictionaryService with lookup and variant methods, create caching layer, build admin interface, and verify the complete dictionary system.
