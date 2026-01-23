# Tasks 43-48: QR Code, Layout & Renderer

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** C - Thermal Printer Integration  
> **Document:** 02 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_ESC-POS-Commands.md](01_Tasks-35-42_ESC-POS-Commands.md)
- **→ Next Document:** [03_Tasks-49-52_Network-USB-Queue.md](03_Tasks-49-52_Network-USB-Queue.md)

---

## Document Overview

This document covers QR code printing, layout formatting for different paper widths, separator lines, cash drawer control, and the thermal print renderer that brings everything together to create complete receipt prints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Implement QR code printing | Medium | 30 min |
| 44 | Create 80mm layout formatter | Medium | 30 min |
| 45 | Create 58mm layout formatter | Medium | 25 min |
| 46 | Implement separator lines | Low | 15 min |
| 47 | Create cash drawer command | Medium | 20 min |
| 48 | Create ThermalPrintRenderer | High | 35 min |

---

## Task 43: Implement QR Code Printing

### Overview
Implement QR code printing functionality using ESC/POS QR code commands. QR codes can encode receipt URLs, payment links, loyalty program data, and other scannable information.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add QR code printing methods to service**
   - Extend `ThermalPrinterService` class
   - Add QR code command methods
   - Support QR code configuration

2. **Implement QR code model selection**
   - Create `setQRModel(model: number)` method
   - Send `QR_MODEL` command `[0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, model, 0x00]`
   - Model 1: Original (deprecated)
   - Model 2: Enhanced (recommended)
   - Default: Model 2

3. **Implement QR code size setting**
   - Create `setQRSize(size: number)` method
   - Send `QR_SIZE` command `[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size]`
   - Valid range: 1-16 (module size multiplier)
   - Default: 3-5 (balance of size and density)

4. **Implement QR error correction level**
   - Create `setQRErrorCorrection(level: 'L' | 'M' | 'Q' | 'H')` method
   - Send `QR_ERROR_CORRECTION` command
   - L: 7% recovery (fast scan)
   - M: 15% recovery (standard)
   - Q: 25% recovery (good damage tolerance)
   - H: 30% recovery (maximum recovery)
   - Default: M or Q for receipts

5. **Implement QR data storage**
   - Create `storeQRData(data: string)` method
   - Send `QR_STORE` command with data
   - Data length can be up to 7089 characters (numeric)
   - Calculate proper length bytes (little-endian)

6. **Implement QR code printing**
   - Create `printQRCode()` method
   - Send `QR_PRINT` command `[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]`
   - Print previously stored QR data
   - QR code respects current alignment

7. **Create convenience QR printing method**
   - Create `printQR(data: string, config?)` method
   - Configure model, size, error correction
   - Store data and print in one call
   - Apply default configuration if not provided

8. **Implement QR code alignment control**
   - QR codes respect alignment (left, center, right)
   - Create `printCenteredQR(data: string)` method
   - Center-align recommended for readability
   - Restore previous alignment after printing

9. **Add QR data encoding**
   - Support UTF-8 encoded data
   - Handle special characters properly
   - Validate data length before printing
   - Provide clear error for oversized data

10. **Implement QR configuration interface**
    - Create `QRConfig` interface
    - Include model, size, error correction level
    - Include alignment preference
    - Apply configuration to printing

11. **Add QR size presets**
    - `setQRSmall()` - Small QR (size: 3)
    - `setQRNormal()` - Normal QR (size: 4-5)
    - `setQRLarge()` - Large QR (size: 6-8)
    - Adjust based on data density

12. **Create QR utility methods**
    - `validateQRData(data: string)` - Validate data
    - `estimateQRSize(data: string)` - Suggest optimal size
    - `getQRMaxCapacity(level)` - Get max data capacity

### QR Code Command Sequence

```
Full QR Printing Sequence:
┌────────────────────────────────────────┐
│  1. Set QR Model (Model 2)             │
│     [0x1D, 0x28, 0x6B, 0x04, 0x00,     │
│      0x31, 0x41, 0x32, 0x00]           │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  2. Set QR Size (size: 5)              │
│     [0x1D, 0x28, 0x6B, 0x03, 0x00,     │
│      0x31, 0x43, 0x05]                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  3. Set Error Correction (Level M)     │
│     [0x1D, 0x28, 0x6B, 0x03, 0x00,     │
│      0x31, 0x45, 0x31]                 │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  4. Store QR Data                      │
│     [0x1D, 0x28, 0x6B, pL, pH,         │
│      0x31, 0x50, 0x30, ...data]        │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  5. Print QR Code                      │
│     [0x1D, 0x28, 0x6B, 0x03, 0x00,     │
│      0x31, 0x51, 0x30]                 │
└────────────────────────────────────────┘
```

### QR Code Size Guidelines

```
QR Module Size (size parameter):
┌─────────────────────────────────────┐
│  Size 1-2:  Very small (20-40mm)    │  ← Dense data, close scan
│  Size 3-4:  Small (30-50mm)         │  ← Receipt number, URL
│  Size 5-6:  Normal (40-60mm)        │  ← Payment link, standard
│  Size 7-10: Large (50-80mm)         │  ← Distance scan, emphasis
│  Size 11+:  Very large (80mm+)      │  ← Maximum visibility
└─────────────────────────────────────┘

Physical Size on 80mm Paper:
  Module Size 3: ~24mm square
  Module Size 5: ~40mm square
  Module Size 8: ~64mm square
```

### QR Error Correction Levels

| Level | Recovery | Use Case | Data Capacity |
|-------|----------|----------|---------------|
| L | 7% | Clean environment, fast scan | Maximum |
| M | 15% | Standard receipts | High |
| Q | 25% | Damaged receipts, outdoor use | Medium |
| H | 30% | Logo overlay, harsh conditions | Lowest |

### QR Data Capacity

```
Maximum Data Capacity (Model 2):
┌──────────────┬──────────┬──────────┐
│  Data Type   │ Level L  │ Level M  │
├──────────────┼──────────┼──────────┤
│  Numeric     │  7,089   │  5,596   │
│  Alphanumeric│  4,296   │  3,391   │
│  Binary      │  2,953   │  2,331   │
│  Kanji       │  1,817   │  1,435   │
└──────────────┴──────────┴──────────┘

Typical Receipt Data:
  Receipt URL:  50-100 chars (well within limits)
  Payment Link: 100-200 chars (well within limits)
  Full Receipt: 1,000+ chars (consider size/error level)
```

### QR Code Visual Examples

```
Small QR (size: 3):
┌────────────────────────────────┐
│        ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄        │
│        █     █  █     █        │
│        █ ▀▀▀ █  █ ▀▀▀ █        │
│        █     █  █     █        │
│        ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀        │
│        (24mm square)            │
└────────────────────────────────┘

Normal QR (size: 5):
┌────────────────────────────────┐
│      ▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄      │
│      █       █  █       █      │
│      █  ▀▀▀  █  █  ▀▀▀  █      │
│      █  ▀▀▀  █  █  ▀▀▀  █      │
│      █       █  █       █      │
│      ▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀      │
│      (40mm square)              │
└────────────────────────────────┘

Large QR (size: 8):
┌────────────────────────────────┐
│   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄     │
│   █         █  █         █     │
│   █   ▀▀▀   █  █   ▀▀▀   █     │
│   █   ▀▀▀   █  █   ▀▀▀   █     │
│   █   ▀▀▀   █  █   ▀▀▀   █     │
│   █         █  █         █     │
│   ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀     │
│   (64mm square)                 │
└────────────────────────────────┘
```

### QR Code Use Cases

| Use Case | Data | Size | Error Level |
|----------|------|------|-------------|
| Receipt URL | `https://receipt.com/R123` | 5 | M |
| Payment Link | `upi://pay?pa=...` | 6 | Q |
| Loyalty Program | `LOYALTY:1234567890` | 4 | M |
| Full Receipt Data | JSON receipt data | 3 | M |
| Store Info | `STORE:ABC,LOC:001` | 5 | M |

### QR API Usage Examples

```
Basic QR Printing:
  printer.setQRModel(2)
  printer.setQRSize(5)
  printer.setQRErrorCorrection('M')
  printer.storeQRData('https://receipt.example.com/R12345')
  printer.printQRCode()

Convenience Method:
  printer.printQR('https://receipt.example.com/R12345', {
    size: 5,
    errorLevel: 'M',
    model: 2
  })

Centered QR:
  printer.printCenteredQR('https://payment.link/ABC123')

With Configuration:
  const config: QRConfig = {
    model: 2,
    size: 6,
    errorLevel: 'Q',
    align: 'center'
  }
  printer.printQR(data, config)

Size Presets:
  printer.setQRNormal()  // size: 5, error: M
  printer.printQR('DATA')
```

### Configuration Interface

```typescript
interface QRConfig {
  model: 1 | 2;                           // QR model
  size: number;                           // 1-16 module size
  errorLevel: 'L' | 'M' | 'Q' | 'H';     // Error correction
  align?: 'left' | 'center' | 'right';   // Alignment
}
```

### Data Store Command Structure

```
Store QR Data:
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────────┐
│ 0x1D │ 0x28 │ 0x6B │  pL  │  pH  │ 0x31 │ 0x50 │ 0x30 │ data...  │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────────┘
  GS    (      k      dataLen      1      P      0      QR data
                     (little-endian)

pL = (dataLen + 3) % 256
pH = (dataLen + 3) / 256
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── QR code methods
        ├── setQRModel(model)
        ├── setQRSize(size)
        ├── setQRErrorCorrection(level)
        ├── storeQRData(data)
        ├── printQRCode()
        ├── printQR(data, config)
        ├── printCenteredQR(data)
        ├── setQRSmall()
        ├── setQRNormal()
        ├── setQRLarge()
        ├── validateQRData(data)
        ├── estimateQRSize(data)
        └── getQRMaxCapacity(level)
```

### Verification Checklist
- [ ] QR code printing methods added
- [ ] QR model selection works
- [ ] QR size setting works
- [ ] Error correction level setting works
- [ ] QR data storage works
- [ ] QR code printing works
- [ ] Convenience method functional
- [ ] QR alignment control works
- [ ] Data encoding handles UTF-8
- [ ] Configuration interface defined
- [ ] Size presets functional
- [ ] Utility methods work
- [ ] Data validation prevents errors

---

## Task 44: Create 80mm Layout Formatter

### Overview
Create a layout formatter specifically for 80mm thermal paper (48 characters per line). This formatter handles text wrapping, column alignment, padding, and ensures all content fits the 48-character width constraint.

### Dependencies
- Task 35: Create thermal printer service

### Instructions

1. **Create 80mm layout formatter file**
   - Create file at `frontend/lib/printing/layout-80mm.ts`
   - Set character width constant: 48 characters
   - Set up TypeScript with proper exports

2. **Define layout formatter class**
   - Create `Layout80mm` class
   - Store character width (48)
   - Provide formatting utility methods
   - Handle text truncation and padding

3. **Implement text wrapping**
   - Create `wrapText(text: string, maxWidth?: number)` method
   - Default maxWidth to 48 characters
   - Break long text into multiple lines
   - Preserve word boundaries where possible
   - Handle special characters and spaces

4. **Implement text truncation**
   - Create `truncate(text: string, maxWidth?: number, suffix?)` method
   - Truncate text to fit within width
   - Add ellipsis (…) or custom suffix if truncated
   - Default suffix: "…" (1 character)

5. **Implement text padding**
   - Create `padLeft(text: string, width: number, char?)` method
   - Create `padRight(text: string, width: number, char?)` method
   - Create `padCenter(text: string, width: number, char?)` method
   - Default padding character: space (' ')
   - Support custom padding characters

6. **Implement two-column layout**
   - Create `twoColumn(left: string, right: string)` method
   - Left text aligns left, right text aligns right
   - Calculate spacing to fill 48 characters
   - Handle overflow gracefully (truncate)
   - Common for item name + price

7. **Implement three-column layout**
   - Create `threeColumn(left: string, center: string, right: string)` method
   - Specify column widths or auto-calculate
   - Common for item + quantity + price
   - Handle overflow per column

8. **Implement custom column layout**
   - Create `columns(columnData: ColumnSpec[])` method
   - Support variable number of columns
   - Each column has width and alignment
   - Auto-fill remaining space
   - Handle overflow per column

9. **Implement separator line generation**
   - Create `separator(char: string = '-', width?: number)` method
   - Generate full-width separator line
   - Support different characters: '-', '=', '─', '━'
   - Default width: 48 characters

10. **Implement number formatting helpers**
    - Create `formatAmount(amount: number)` method
    - Format numbers with thousand separators
    - Sri Lanka format: 10,000.00
    - Align decimals properly
    - Handle negative numbers

11. **Add text alignment helpers**
    - Create `alignLeft(text: string, width: number)` method
    - Create `alignCenter(text: string, width: number)` method
    - Create `alignRight(text: string, width: number)` method
    - Ensure exact width output

12. **Create layout validation**
    - Validate text fits within 48 characters
    - Warn if text will be truncated
    - Provide suggestions for width issues

### 80mm Paper Specifications

```
Paper Width: 80mm
Character Width: 48 characters
Font: Standard ESC/POS font
Character Pitch: ~1.67mm per character

Layout Constraints:
┌────────────────────────────────────────────────┐
│  48 characters maximum per line                │
│  Double-width text: 24 characters              │
│  Double-height text: 48 characters (no change) │
│  Double-both text: 24 characters               │
└────────────────────────────────────────────────┘
```

### Two-Column Layout Pattern

```
Standard Item + Price Layout:
┌────────────────────────────────────────────────┐
│  Item Name (30 chars)         Price (18 chars) │
├────────────────────────────────────────────────┤
│  Rice 5kg                              2,500.00│
│  Milk 1L x2                              850.00│
│  Sugar 1kg                               450.00│
└────────────────────────────────────────────────┘

Column Widths:
  Left Column: 30 characters (item name)
  Right Column: 18 characters (right-aligned price)
  Total: 48 characters
```

### Three-Column Layout Pattern

```
Item + Quantity + Price Layout:
┌────────────────────────────────────────────────┐
│  Item (24)          Qty (6)     Price (18)     │
├────────────────────────────────────────────────┤
│  Rice 5kg              2               2,500.00│
│  Milk 1L               4               3,400.00│
│  Sugar                 1                 450.00│
└────────────────────────────────────────────────┘

Column Widths:
  Item: 24 characters (left-aligned)
  Qty: 6 characters (right-aligned)
  Price: 18 characters (right-aligned)
  Total: 48 characters
```

### Variable Column Layout

```
Custom Layout Example:
┌────────────────────────────────────────────────┐
│  Code (8)   Description (22)  Qty (6)  $ (12)  │
├────────────────────────────────────────────────┤
│  ITM001     Rice Basmati 5kg     2      5,000  │
│  ITM002     Milk Full Cream      4      3,400  │
└────────────────────────────────────────────────┘

Column Widths: [8, 22, 6, 12] = 48 total
```

### Layout API Usage Examples

```
Text Wrapping:
  const lines = layout.wrapText(longText)
  // Returns array of 48-char lines

Text Truncation:
  const short = layout.truncate("Very long item name here", 30)
  // "Very long item name here…"

Two-Column:
  const line = layout.twoColumn("Rice 5kg", "2,500.00")
  // "Rice 5kg                              2,500.00"

Three-Column:
  const line = layout.threeColumn("Rice 5kg", "2", "2,500.00")
  // "Rice 5kg              2               2,500.00"

Custom Columns:
  const line = layout.columns([
    { text: "ITM001", width: 8, align: 'left' },
    { text: "Rice", width: 22, align: 'left' },
    { text: "2", width: 6, align: 'right' },
    { text: "5,000", width: 12, align: 'right' }
  ])

Separator:
  const line = layout.separator('-')
  // "------------------------------------------------"

Format Amount:
  const formatted = layout.formatAmount(10000)
  // "10,000.00"
```

### Column Specification Interface

```typescript
interface ColumnSpec {
  text: string;
  width: number;
  align: 'left' | 'center' | 'right';
  truncate?: boolean;       // Default: true
  padding?: string;         // Default: ' '
}
```

### Standard Receipt Layout Structure

```
┌────────────────────────────────────────────────┐
│                  STORE NAME                    │  ← Center, 48 chars
│           123 Main St, Colombo 01              │  ← Center, 48 chars
│              Tel: 011-234-5678                 │  ← Center, 48 chars
├────────────────────────────────────────────────┤  ← Separator
│  Date: 2024-01-15         Time: 14:30:25      │  ← Two-column
│  Receipt: REC20240115-00042                    │  ← Left, 48 chars
│  Cashier: John Doe        Terminal: POS-01    │  ← Two-column
├────────────────────────────────────────────────┤  ← Separator
│  ITEM                          QTY      AMOUNT │  ← Header
├────────────────────────────────────────────────┤  ← Separator
│  Rice 5kg                        2      2,500  │  ← Three-column
│  Milk 1L x2                      1        850  │  ← Three-column
│  Sugar 1kg                       1        450  │  ← Three-column
├────────────────────────────────────────────────┤  ← Separator
│  Subtotal:                             3,800.00│  ← Two-column
│  Tax (15%):                              570.00│  ← Two-column
│  Discount:                              -100.00│  ← Two-column
│  TOTAL:                      LKR      4,270.00│  ← Two-column, bold
├────────────────────────────────────────────────┤  ← Separator
│  CASH:                                 5,000.00│  ← Two-column
│  CHANGE:                                 730.00│  ← Two-column
├────────────────────────────────────────────────┤  ← Separator
│              Thank you for shopping!           │  ← Center
│         Please keep your receipt safe          │  ← Center
└────────────────────────────────────────────────┘
```

### Text Wrapping Algorithm

```
Wrap Text Logic:
1. Split text by spaces to get words
2. Build line by adding words
3. If adding next word exceeds width:
   - Finalize current line
   - Start new line with remaining word
4. Handle words longer than width:
   - Force break at width boundary
5. Continue until all text processed
```

### Expected Outcome
```
frontend/lib/printing/
└── layout-80mm.ts
    └── Layout80mm class
        ├── wrapText(text, maxWidth)
        ├── truncate(text, maxWidth, suffix)
        ├── padLeft(text, width, char)
        ├── padRight(text, width, char)
        ├── padCenter(text, width, char)
        ├── twoColumn(left, right)
        ├── threeColumn(left, center, right)
        ├── columns(columnData)
        ├── separator(char, width)
        ├── formatAmount(amount)
        ├── alignLeft(text, width)
        ├── alignCenter(text, width)
        └── alignRight(text, width)
```

### Verification Checklist
- [ ] Layout formatter file created
- [ ] Character width set to 48
- [ ] Text wrapping works correctly
- [ ] Text truncation works with ellipsis
- [ ] Text padding methods functional
- [ ] Two-column layout works
- [ ] Three-column layout works
- [ ] Custom column layout works
- [ ] Separator line generation works
- [ ] Number formatting works (Sri Lanka format)
- [ ] Alignment helpers functional
- [ ] Layout validation prevents errors
- [ ] All methods return exact 48-char lines

---

## Task 45: Create 58mm Layout Formatter

### Overview
Create a layout formatter specifically for 58mm thermal paper (32 characters per line). This is a more compact version of the 80mm formatter, designed for portable and compact printers.

### Dependencies
- Task 44: Create 80mm layout formatter (for reference)

### Instructions

1. **Create 58mm layout formatter file**
   - Create file at `frontend/lib/printing/layout-58mm.ts`
   - Set character width constant: 32 characters
   - Set up TypeScript with proper exports

2. **Define layout formatter class**
   - Create `Layout58mm` class
   - Store character width (32)
   - Provide formatting utility methods
   - Handle text truncation and padding for narrower width

3. **Implement text wrapping**
   - Create `wrapText(text: string, maxWidth?: number)` method
   - Default maxWidth to 32 characters
   - More aggressive wrapping than 80mm
   - Preserve word boundaries where possible

4. **Implement text truncation**
   - Create `truncate(text: string, maxWidth?: number, suffix?)` method
   - Truncate text to fit within 32 characters
   - Add ellipsis if truncated
   - Critical for 58mm due to limited width

5. **Implement text padding**
   - Create `padLeft(text: string, width: number, char?)` method
   - Create `padRight(text: string, width: number, char?)` method
   - Create `padCenter(text: string, width: number, char?)` method
   - Same interface as 80mm formatter

6. **Implement two-column layout**
   - Create `twoColumn(left: string, right: string)` method
   - Left text + right text = 32 characters
   - Typical split: 18 left + 14 right
   - Or: 20 left + 12 right for prices
   - Handle overflow with truncation

7. **Implement three-column layout**
   - Create `threeColumn(left: string, center: string, right: string)` method
   - More challenging on 58mm paper
   - Typical split: 14 left + 6 center + 12 right
   - May need to skip center column for some layouts

8. **Implement custom column layout**
   - Create `columns(columnData: ColumnSpec[])` method
   - Support variable columns
   - More important for 58mm to optimize space

9. **Implement separator line generation**
   - Create `separator(char: string = '-', width?: number)` method
   - Default width: 32 characters
   - Same characters as 80mm

10. **Implement number formatting helpers**
    - Create `formatAmount(amount: number, compact?: boolean)` method
    - Support compact format for narrow width
    - Compact: Use "10K" instead of "10,000.00" if needed
    - Standard: "10,000.00"

11. **Add text alignment helpers**
    - Create `alignLeft(text: string, width: number)` method
    - Create `alignCenter(text: string, width: number)` method
    - Create `alignRight(text: string, width: number)` method
    - Ensure exact width output (32 chars)

12. **Create compact layout helpers**
    - Create `compactItemLine(item: string, price: string)` method
    - Optimize for 58mm space constraints
    - May split item name across multiple lines
    - Keep price on same line as last item fragment

### 58mm Paper Specifications

```
Paper Width: 58mm
Character Width: 32 characters
Font: Standard ESC/POS font
Character Pitch: ~1.81mm per character

Layout Constraints:
┌────────────────────────────────┐
│  32 characters maximum         │
│  Double-width: 16 characters   │
│  Double-height: 32 characters  │
│  Double-both: 16 characters    │
└────────────────────────────────┘

Challenges:
- Limited space for item names
- Prices must be abbreviated or wrapped
- Multi-column layouts difficult
- More vertical receipts
```

### Two-Column Layout Pattern

```
Standard Item + Price (58mm):
┌────────────────────────────────┐
│  Item (18)         Price (14)  │
├────────────────────────────────┤
│  Rice 5kg             2,500.00 │
│  Milk 1L                850.00 │
│  Sugar 1kg              450.00 │
└────────────────────────────────┘

Column Widths:
  Left: 18 characters (item)
  Right: 14 characters (price, right-aligned)
  Total: 32 characters

Alternative Split (more space for items):
┌────────────────────────────────┐
│  Item (20)       Price (12)    │
├────────────────────────────────┤
│  Rice Basmati 5kg     2,500    │
│  Milk Full Cream        850    │
└────────────────────────────────┘
```

### Three-Column Layout Pattern

```
Item + Qty + Price (58mm):
┌────────────────────────────────┐
│  Item (14)  Q(4)   Price (14)  │
├────────────────────────────────┤
│  Rice 5kg      2       2,500   │
│  Milk 1L       4       3,400   │
│  Sugar         1         450   │
└────────────────────────────────┘

Column Widths:
  Item: 14 characters (left)
  Qty: 4 characters (right)
  Price: 14 characters (right)
  Total: 32 characters

Note: Item names heavily truncated
```

### Compact Item Line Pattern

```
Multi-Line Item (58mm):
┌────────────────────────────────┐
│  Rice Basmati Premium 5kg      │
│                        2,500.00│
├────────────────────────────────┤
│  Milk Full Cream 1L x2         │
│                          850.00│
└────────────────────────────────┘

Pattern:
  Line 1: Full item name (32 chars)
  Line 2: Right-aligned price
```

### Standard Receipt Layout (58mm)

```
┌────────────────────────────────┐
│         STORE NAME             │
│      123 Main Street           │
│     Tel: 011-234-5678          │
├────────────────────────────────┤
│  Date: 2024-01-15              │
│  Time: 14:30:25                │
│  Receipt: REC20240115-00042    │
│  Cashier: John Doe             │
│  Terminal: POS-01              │
├────────────────────────────────┤
│  ITEM              QTY   AMOUNT│
├────────────────────────────────┤
│  Rice 5kg            2   2,500 │
│  Milk 1L             1     850 │
│  Sugar               1     450 │
├────────────────────────────────┤
│  Subtotal:            3,800.00 │
│  Tax (15%):             570.00 │
│  Discount:             -100.00 │
│  TOTAL:      LKR    4,270.00   │
├────────────────────────────────┤
│  CASH:                5,000.00 │
│  CHANGE:                730.00 │
├────────────────────────────────┤
│     Thank you!                 │
│  Keep receipt safe             │
└────────────────────────────────┘
```

### Compact Number Format

```
Standard Format (takes more space):
  10,000.00
  1,234.56
  999,999.99

Compact Format (saves space):
  10K
  1.2K
  1M

Use Case:
  Standard: When space available
  Compact: When width constrained
  
Example on 58mm:
  Standard: "10,000.00" (9 chars)
  Compact:  "10K" (3 chars)
  Savings:  6 characters
```

### Layout API Usage Examples

```
Text Wrapping (more aggressive):
  const lines = layout.wrapText(longText)
  // Returns array of 32-char lines

Text Truncation (critical):
  const short = layout.truncate("Very long item name", 18)
  // "Very long item n…"

Two-Column:
  const line = layout.twoColumn("Rice 5kg", "2,500")
  // "Rice 5kg           2,500"

Compact Item:
  const lines = layout.compactItemLine(
    "Rice Basmati Premium 5kg",
    "2,500.00"
  )
  // ["Rice Basmati Premium 5kg",
  //  "                  2,500.00"]

Separator:
  const line = layout.separator('-')
  // "--------------------------------"

Format Amount (compact):
  const formatted = layout.formatAmount(10000, true)
  // "10K" instead of "10,000.00"
```

### Width Comparison

| Layout Element | 80mm (48 char) | 58mm (32 char) | Difference |
|----------------|----------------|----------------|------------|
| Full width | 48 | 32 | -16 chars |
| Item name | 30 | 18-20 | -10 to -12 |
| Price | 18 | 12-14 | -4 to -6 |
| Three-column item | 24 | 14 | -10 chars |

### Expected Outcome
```
frontend/lib/printing/
└── layout-58mm.ts
    └── Layout58mm class
        ├── wrapText(text, maxWidth)
        ├── truncate(text, maxWidth, suffix)
        ├── padLeft(text, width, char)
        ├── padRight(text, width, char)
        ├── padCenter(text, width, char)
        ├── twoColumn(left, right)
        ├── threeColumn(left, center, right)
        ├── columns(columnData)
        ├── separator(char, width)
        ├── formatAmount(amount, compact)
        ├── alignLeft(text, width)
        ├── alignCenter(text, width)
        ├── alignRight(text, width)
        └── compactItemLine(item, price)
```

### Verification Checklist
- [ ] Layout formatter file created
- [ ] Character width set to 32
- [ ] Text wrapping works for narrow width
- [ ] Text truncation handles 32-char limit
- [ ] Text padding methods functional
- [ ] Two-column layout works (18+14 or 20+12)
- [ ] Three-column layout works (14+4+14)
- [ ] Custom column layout works
- [ ] Separator line generation works
- [ ] Number formatting works (standard & compact)
- [ ] Alignment helpers functional
- [ ] Compact item line method works
- [ ] All methods return exact 32-char lines

---

## Task 46: Implement Separator Lines

### Overview
Implement separator line printing methods that create visual dividers between receipt sections. Support different line styles, partial widths, and decorative separators.

### Dependencies
- Task 35: Create thermal printer service
- Task 44: Create 80mm layout formatter
- Task 45: Create 58mm layout formatter

### Instructions

1. **Add separator methods to service**
   - Extend `ThermalPrinterService` class
   - Add separator printing methods
   - Use layout formatters for proper width

2. **Implement basic separator line**
   - Create `printSeparator(char: string = '-')` method
   - Print full-width line using specified character
   - Auto-detect paper width (80mm or 58mm)
   - Default character: dash '-'

3. **Implement styled separator lines**
   - Create `printLightSeparator()` method using '-' (dash)
   - Create `printHeavySeparator()` method using '=' (equals)
   - Create `printDoubleSeparator()` method using '═' (double line)
   - Create `printDottedSeparator()` method using '·' (middle dot)

4. **Implement partial separator lines**
   - Create `printPartialSeparator(width: number, align?)` method
   - Print separator of specified width
   - Support left, center, right alignment
   - Use for section dividers

5. **Implement decorative separators**
   - Create `printDecorativeSeparator(pattern: string)` method
   - Support patterns like '─┼─', '◆◆◆', '•••'
   - Repeat pattern to fill width
   - Trim to exact width

6. **Implement spaced separators**
   - Create `printSpacedSeparator(spacing: number)` method
   - Add blank lines before/after separator
   - Common: 1 blank line before and after
   - Improves readability

7. **Implement labeled separators**
   - Create `printLabeledSeparator(label: string)` method
   - Place label in center of separator line
   - Format: "──── Label ────"
   - Useful for section headers

8. **Add separator presets**
   - `printHeaderSeparator()` - Heavy separator after header
   - `printItemsSeparator()` - Light separator between items
   - `printTotalSeparator()` - Heavy separator before totals
   - `printFooterSeparator()` - Light separator before footer

9. **Implement wave separator**
   - Create `printWaveSeparator()` method
   - Use wave characters: '~', '≈', '∼'
   - For decorative receipts

10. **Add box drawing separators**
    - Create `printBoxSeparator(style: 'single' | 'double')` method
    - Use box-drawing characters
    - Single: '─', Double: '═'
    - For structured receipts

11. **Create separator configuration**
    - Allow global separator style setting
    - `setSeparatorStyle(style)` method
    - Apply to all subsequent separators
    - Override per separator if needed

12. **Implement multi-line separators**
    - Create `printMultiLineSeparator(lines: number)` method
    - Print multiple separator lines
    - For major section breaks

### Separator Character Options

```
Basic Characters:
  -  Dash (hyphen)         Light, common
  =  Equals                Heavy, emphasis
  _  Underscore            Subtle
  *  Asterisk              Decorative
  #  Hash                  Bold

Unicode Box Drawing:
  ─  Light horizontal      Clean, professional
  ━  Heavy horizontal      Strong separation
  ═  Double horizontal     Formal, structured
  ┄  Light triple dash     Subtle, spaced
  ┅  Heavy triple dash     Bold, spaced

Decorative Characters:
  ~  Tilde                 Wave, casual
  •  Bullet                Dotted, modern
  ·  Middle dot            Light dotted
  ◆  Diamond               Decorative
  ◇  White diamond         Light decorative
  ❖  Black diamond minus   Bold decorative
```

### Separator Visual Examples

```
Light Separator (dash):
------------------------------------------------

Heavy Separator (equals):
================================================

Double Separator (box drawing):
════════════════════════════════════════════════

Dotted Separator:
················································

Partial Separator (centered, 20 chars):
              ────────────

Labeled Separator:
────────── ITEMS ──────────

Decorative Pattern:
─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼

Wave Separator:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Spaced Separator (with blank lines):

------------------------------------------------

```

### Receipt Section Separators

```
┌────────────────────────────────────────────────┐
│                 ABC STORE                      │
│           123 Main St, Colombo 01              │
│              Tel: 011-234-5678                 │
├════════════════════════════════════════════════┤  ← Heavy (header)
│  Date: 2024-01-15         Time: 14:30:25      │
│  Receipt: REC20240115-00042                    │
│  Cashier: John             Terminal: POS-01   │
├────────────────────────────────────────────────┤  ← Light (info)
│  ITEM                          QTY      AMOUNT │
├────────────────────────────────────────────────┤  ← Light (header)
│  Rice 5kg                        2      2,500  │
│  Milk 1L                         1        850  │
│  Sugar 1kg                       1        450  │
├════════════════════════════════════════════════┤  ← Heavy (totals)
│  Subtotal:                             3,800.00│
│  Tax (15%):                              570.00│
│  Discount:                              -100.00│
│  TOTAL:                      LKR      4,270.00│
├════════════════════════════════════════════════┤  ← Heavy (payment)
│  CASH:                                 5,000.00│
│  CHANGE:                                 730.00│
├────────────────────────────────────────────────┤  ← Light (footer)
│              Thank you for shopping!           │
│         Please keep your receipt safe          │
└────────────────────────────────────────────────┘
```

### Separator Style Hierarchy

| Section | Style | Character | Purpose |
|---------|-------|-----------|---------|
| Header | Heavy | = or ═ | Emphasize branding |
| Info | Light | - or ─ | Organize metadata |
| Items Header | Light | - or ─ | Column headers |
| Between Items | None | (space) | Readability |
| Before Totals | Heavy | = or ═ | Major section break |
| Subtotals | Light | - or ─ | Group calculations |
| Total | Heavy | = or ═ | Emphasize total |
| Payment | Heavy | = or ═ | Financial summary |
| Footer | Light | - or ─ | Courtesy message |

### Labeled Separator Formatting

```
Algorithm:
  1. Calculate label length
  2. Calculate remaining width (totalWidth - labelLength)
  3. Split remaining width evenly (left and right)
  4. Left separator: repeat char (leftWidth times)
  5. Right separator: repeat char (rightWidth times)
  6. Combine: leftSep + label + rightSep

Example (48 chars, label "ITEMS"):
  Label length: 5
  Remaining: 48 - 5 = 43
  Left: 43 / 2 = 21
  Right: 43 / 2 = 22
  Result: "─────────────────────ITEMS──────────────────────"
```

### Separator API Usage Examples

```
Basic Separator:
  printer.printSeparator()
  // "------------------------------------------------"

Styled Separator:
  printer.printHeavySeparator()
  // "================================================"

Partial Separator:
  printer.printPartialSeparator(20, 'center')
  // "              ────────────              "

Labeled Separator:
  printer.printLabeledSeparator('ITEMS')
  // "────────────────────ITEMS────────────────────"

Decorative Separator:
  printer.printDecorativeSeparator('─┼─')
  // "─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─"

Spaced Separator:
  printer.printSpacedSeparator(1)
  // (blank line)
  // "------------------------------------------------"
  // (blank line)

Presets:
  printer.printHeaderSeparator()   // Heavy
  printer.printItemsSeparator()    // Light
  printer.printTotalSeparator()    // Heavy

Multi-Line:
  printer.printMultiLineSeparator(2)
  // "================================================"
  // "================================================"
```

### Configuration Interface

```typescript
interface SeparatorConfig {
  style: 'light' | 'heavy' | 'double' | 'dotted' | 'custom';
  character?: string;       // For custom style
  spacing?: number;         // Blank lines before/after
  width?: number;           // Partial width
  align?: 'left' | 'center' | 'right';
}
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Separator methods
        ├── printSeparator(char)
        ├── printLightSeparator()
        ├── printHeavySeparator()
        ├── printDoubleSeparator()
        ├── printDottedSeparator()
        ├── printPartialSeparator(width, align)
        ├── printDecorativeSeparator(pattern)
        ├── printSpacedSeparator(spacing)
        ├── printLabeledSeparator(label)
        ├── printHeaderSeparator()
        ├── printItemsSeparator()
        ├── printTotalSeparator()
        ├── printFooterSeparator()
        ├── printWaveSeparator()
        ├── printBoxSeparator(style)
        ├── setSeparatorStyle(style)
        └── printMultiLineSeparator(lines)
```

### Verification Checklist
- [ ] Separator methods added to service
- [ ] Basic separator works with custom character
- [ ] Styled separators (light, heavy, double, dotted) work
- [ ] Partial separators work with alignment
- [ ] Decorative separators repeat pattern correctly
- [ ] Spaced separators add blank lines
- [ ] Labeled separators center label correctly
- [ ] Separator presets work (header, items, total, footer)
- [ ] Wave separator works
- [ ] Box drawing separators work
- [ ] Separator style configuration works
- [ ] Multi-line separators work
- [ ] All separators respect paper width

---

## Task 47: Create Cash Drawer Command

### Overview
Implement cash drawer control commands to open cash drawers connected to thermal printers. Most POS thermal printers have a cash drawer port that can be triggered via ESC/POS commands.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add cash drawer methods to service**
   - Extend `ThermalPrinterService` class
   - Add drawer control methods
   - Support both pin 2 and pin 5 connections

2. **Implement drawer open command**
   - Create `openCashDrawer(pin?: 2 | 5)` method
   - Default pin: 2 (most common)
   - Send ESC/POS drawer kick command
   - Command: `[0x1B, 0x70, pin, t1, t2]`

3. **Define timing parameters**
   - `t1`: ON time (pulse duration)
   - `t2`: OFF time (pulse gap)
   - Standard values: `t1 = 25` (25ms), `t2 = 250` (250ms)
   - Create constants for standard timing

4. **Implement pin 2 drawer open**
   - Create `openDrawerPin2()` method
   - Most common connection
   - Command: `[0x1B, 0x70, 0x00, 0x19, 0xFA]`
   - Pin 0 = Pin 2 connector

5. **Implement pin 5 drawer open**
   - Create `openDrawerPin5()` method
   - Alternative connection
   - Command: `[0x1B, 0x70, 0x01, 0x19, 0xFA]`
   - Pin 1 = Pin 5 connector

6. **Implement custom timing**
   - Create `openDrawerWithTiming(pin, onTime, offTime)` method
   - Allow custom pulse timing
   - Valid range: 0-255 for both parameters
   - Validate timing values

7. **Add drawer configuration**
   - Create `DrawerConfig` interface
   - Include pin selection (2 or 5)
   - Include timing parameters
   - Store in printer configuration

8. **Implement drawer capability detection**
   - Add `hasDrawer` property to printer config
   - Check if printer supports drawer
   - Gracefully handle printers without drawer port
   - Skip drawer commands if not supported

9. **Create drawer test method**
   - Create `testDrawer()` method
   - Open and close drawer with standard timing
   - Verify drawer responds
   - For setup and troubleshooting

10. **Add drawer status check**
    - Create `checkDrawerStatus()` method
    - Query drawer open/closed status (if supported)
    - Some printers support status query
    - Return boolean or null if unsupported

11. **Implement drawer safety features**
    - Prevent rapid multiple opens (debounce)
    - Add minimum interval between opens (e.g., 500ms)
    - Log drawer open events
    - Optional drawer open confirmation

12. **Add transaction-based drawer opening**
    - Create `openDrawerOnTransaction(shouldOpen: boolean)` method
    - Configure auto-open on sale complete
    - Configure auto-open on cash payment only
    - Skip if payment is card/digital

### Cash Drawer Connection

```
Thermal Printer Cash Drawer Port:
┌─────────────────────────────────────┐
│  Thermal Printer                    │
│                                     │
│  ┌───────────────┐                 │
│  │ Drawer Port   │                 │
│  │ (RJ11/RJ12)   │                 │
│  └───────┬───────┘                 │
└──────────┼─────────────────────────┘
           │
           │ RJ11/RJ12 Cable
           │
┌──────────▼─────────────────────────┐
│  Cash Drawer                        │
│                                     │
│  ┌──────────────────────────┐      │
│  │  Solenoid/Motor Mechanism│      │
│  └──────────────────────────┘      │
│                                     │
│  ┌──────────────────────────┐      │
│  │  Lock Release             │      │
│  └──────────────────────────┘      │
└─────────────────────────────────────┘
```

### Drawer Kick Command

```
ESC/POS Drawer Kick:
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  0x1B    │  0x70    │   pin    │    t1    │    t2    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
   ESC       p         connector  ON time   OFF time

Pin Values:
  0x00 (0) = Pin 2 (drawer connector 1)
  0x01 (1) = Pin 5 (drawer connector 2)

Timing (in 2ms units):
  t1 = ON time (pulse duration)
  t2 = OFF time (pulse gap)
  
  Example: t1=25 (50ms), t2=250 (500ms)
  Standard: t1=0x19, t2=0xFA
```

### Timing Parameters

```
ON Time (t1):
  Range: 0-255 (0-510ms in 2ms units)
  Typical: 25 (50ms)
  Short: 10 (20ms) - Quick pulse
  Standard: 25 (50ms) - Reliable
  Long: 50 (100ms) - Stubborn drawers

OFF Time (t2):
  Range: 0-255 (0-510ms in 2ms units)
  Typical: 250 (500ms)
  Short: 100 (200ms) - Quick cycle
  Standard: 250 (500ms) - Reliable
  Long: 500 (1000ms) - Full cycle
```

### Pin Connection Types

| Pin | Connector | Common Use | Command |
|-----|-----------|------------|---------|
| Pin 2 | Connector 1 | Primary drawer | `[0x1B, 0x70, 0x00, 0x19, 0xFA]` |
| Pin 5 | Connector 2 | Secondary drawer | `[0x1B, 0x70, 0x01, 0x19, 0xFA]` |

### Drawer Opening Flow

```
┌────────────────────────────────────┐
│  Transaction Complete              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  Check Payment Type                │
│  (Cash? Card? Digital?)            │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  If Cash Payment:                  │
│  → Send Drawer Open Command        │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  Print Receipt                     │
│  (includes drawer command)         │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  Drawer Opens                      │
│  (Solenoid activates)              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  Cashier Retrieves/Adds Cash       │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  Cashier Closes Drawer             │
│  (Manual closure)                  │
└────────────────────────────────────┘
```

### Safety and Best Practices

```
Debounce Logic:
  Store last drawer open timestamp
  If (now - lastOpen) < 500ms:
    Ignore new open request
  Prevents multiple rapid opens

Auto-Open Rules:
  ✓ Open on cash sale complete
  ✓ Open on cash refund
  ✗ Do not open on card payment
  ✗ Do not open on digital payment
  ✗ Do not open on cancelled transaction

Manual Open:
  Allow manual drawer open (manager override)
  Log manual open events
  Require authentication/permission
```

### Drawer API Usage Examples

```
Basic Drawer Open:
  printer.openCashDrawer()
  // Opens drawer on pin 2 with standard timing

Specific Pin:
  printer.openCashDrawer(5)
  // Opens drawer on pin 5

Pin-Specific Methods:
  printer.openDrawerPin2()
  printer.openDrawerPin5()

Custom Timing:
  printer.openDrawerWithTiming(2, 30, 300)
  // Pin 2, 60ms on, 600ms off

Test Drawer:
  printer.testDrawer()
  // Open and verify drawer works

Check Status:
  const isOpen = printer.checkDrawerStatus()
  // true, false, or null (unsupported)

Transaction-Based:
  printer.openDrawerOnTransaction(true)
  // Auto-open on cash transactions
```

### Configuration Interface

```typescript
interface DrawerConfig {
  enabled: boolean;         // Has cash drawer
  pin: 2 | 5;              // Pin connection
  onTime: number;          // Pulse duration (0-255)
  offTime: number;         // Pulse gap (0-255)
  autoOpen: boolean;       // Auto-open on transaction
  cashOnly: boolean;       // Open only for cash payments
  debounceMs: number;      // Minimum time between opens
}
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Cash drawer methods
        ├── openCashDrawer(pin)
        ├── openDrawerPin2()
        ├── openDrawerPin5()
        ├── openDrawerWithTiming(pin, onTime, offTime)
        ├── testDrawer()
        ├── checkDrawerStatus()
        ├── openDrawerOnTransaction(shouldOpen)
        └── Drawer configuration
```

### Verification Checklist
- [ ] Cash drawer methods added to service
- [ ] Drawer open command works (pin 2)
- [ ] Drawer open command works (pin 5)
- [ ] Timing parameters defined correctly
- [ ] Pin 2 method works
- [ ] Pin 5 method works
- [ ] Custom timing method works
- [ ] Drawer configuration interface defined
- [ ] Drawer capability detection works
- [ ] Test drawer method functional
- [ ] Drawer status check works (if supported)
- [ ] Safety features prevent rapid opens
- [ ] Transaction-based opening works
- [ ] Auto-open respects payment type

---

## Task 48: Create ThermalPrintRenderer

### Overview
Create the comprehensive thermal print renderer that combines all previous components to render complete receipts. This renderer uses the printer service, layout formatters, and all formatting capabilities to produce professional thermal receipts.

### Dependencies
- Task 35: Create thermal printer service
- Tasks 36-42: ESC/POS commands and formatting
- Task 43: QR code printing
- Tasks 44-45: Layout formatters
- Tasks 46-47: Separators and cash drawer

### Instructions

1. **Create thermal print renderer file**
   - Create file at `frontend/lib/printing/renderer.ts`
   - Import printer service and layout formatters
   - Set up TypeScript with proper exports

2. **Define thermal print renderer class**
   - Create `ThermalPrintRenderer` class
   - Initialize with printer configuration
   - Manage printer service instance
   - Select appropriate layout formatter (80mm or 58mm)

3. **Implement receipt data interface**
   - Create `ReceiptData` interface
   - Include all receipt information (header, items, totals, footer)
   - Support optional fields
   - Type-safe receipt structure

4. **Implement header rendering**
   - Create `renderHeader(data: ReceiptHeaderData)` method
   - Print logo (if configured)
   - Print store name (centered, bold, large)
   - Print store address (centered)
   - Print contact information (centered)
   - Add separator after header

5. **Implement metadata rendering**
   - Create `renderMetadata(data: ReceiptMetadata)` method
   - Print date and time
   - Print receipt number
   - Print cashier and terminal info
   - Print customer information (if applicable)
   - Add separator after metadata

6. **Implement items header rendering**
   - Create `renderItemsHeader()` method
   - Print column headers (ITEM, QTY, AMOUNT)
   - Use appropriate layout for paper width
   - Add separator after header

7. **Implement item line rendering**
   - Create `renderItem(item: ReceiptItem)` method
   - Print item name, quantity, and price
   - Handle long item names (wrap or truncate)
   - Format prices with proper alignment
   - Support item modifiers/notes

8. **Implement totals section rendering**
   - Create `renderTotals(totals: ReceiptTotals)` method
   - Print subtotal
   - Print tax breakdown
   - Print discounts
   - Print delivery/service charges
   - Print total (bold, emphasized)
   - Add separators before and after

9. **Implement payment section rendering**
   - Create `renderPayment(payment: PaymentInfo)` method
   - Print payment method
   - Print amount paid
   - Print change (if cash)
   - Add separator after payment

10. **Implement footer rendering**
    - Create `renderFooter(footer: ReceiptFooter)` method
    - Print thank you message (centered)
    - Print return policy
    - Print promotional message
    - Print QR code (if enabled)
    - Print barcode (receipt number)

11. **Implement complete receipt rendering**
    - Create `renderReceipt(data: ReceiptData)` method
    - Call all section rendering methods in order
    - Initialize printer at start
    - Finalize printer at end
    - Return byte buffer for printing

12. **Add receipt customization options**
    - Create `ReceiptOptions` interface
    - Include logo enable/disable
    - Include QR code enable/disable
    - Include barcode enable/disable
    - Include separator styles
    - Include cash drawer auto-open

13. **Implement receipt templates**
    - Create `renderSaleReceipt(data)` method - Standard sale
    - Create `renderRefundReceipt(data)` method - Refund
    - Create `renderOrderReceipt(data)` method - Order confirmation
    - Create `renderPaymentReceipt(data)` method - Payment only

14. **Add receipt preview**
    - Create `previewReceipt(data)` method
    - Generate text preview (ASCII)
    - Useful for testing without printer
    - Show what will be printed

15. **Implement error handling**
    - Validate receipt data before rendering
    - Handle missing optional fields gracefully
    - Provide clear error messages
    - Log rendering errors

### Receipt Data Structure

```typescript
interface ReceiptData {
  header: ReceiptHeaderData;
  metadata: ReceiptMetadata;
  items: ReceiptItem[];
  totals: ReceiptTotals;
  payment: PaymentInfo;
  footer: ReceiptFooter;
  options?: ReceiptOptions;
}

interface ReceiptHeaderData {
  logo?: string;              // Base64 or logo name
  storeName: string;
  addressLine1?: string;
  addressLine2?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface ReceiptMetadata {
  date: string;
  time: string;
  receiptNumber: string;
  cashier: string;
  terminal: string;
  customer?: CustomerInfo;
}

interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  notes?: string;
}

interface ReceiptTotals {
  subtotal: number;
  tax: number;
  discount?: number;
  deliveryCharge?: number;
  serviceCharge?: number;
  total: number;
}

interface PaymentInfo {
  method: string;             // Cash, Card, UPI, etc.
  amountPaid: number;
  change?: number;
  cardLastFour?: string;
  approvalCode?: string;
}

interface ReceiptFooter {
  thankYouMessage?: string;
  returnPolicy?: string;
  promotionalMessage?: string;
  qrCodeData?: string;
  barcodeData?: string;
}

interface ReceiptOptions {
  paperWidth: '80mm' | '58mm';
  printLogo: boolean;
  printQRCode: boolean;
  printBarcode: boolean;
  separatorStyle: 'light' | 'heavy';
  openDrawer: boolean;
}
```

### Complete Receipt Rendering Flow

```
┌────────────────────────────────────┐
│  1. Initialize Printer             │
│     (Reset to defaults)            │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  2. Render Header                  │
│     - Logo (if enabled)            │
│     - Store name (centered, bold)  │
│     - Address (centered)           │
│     - Contact (centered)           │
│     - Heavy separator              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  3. Render Metadata                │
│     - Date & time                  │
│     - Receipt number               │
│     - Cashier & terminal           │
│     - Customer info                │
│     - Light separator              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  4. Render Items Header            │
│     - Column headers               │
│     - Light separator              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  5. Render Items                   │
│     - For each item:               │
│       * Item name, qty, price      │
│       * Notes (if any)             │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  6. Render Totals                  │
│     - Heavy separator              │
│     - Subtotal                     │
│     - Tax                          │
│     - Discounts                    │
│     - Total (bold)                 │
│     - Heavy separator              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  7. Render Payment                 │
│     - Payment method               │
│     - Amount paid                  │
│     - Change                       │
│     - Heavy separator              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  8. Render Footer                  │
│     - Thank you message            │
│     - Return policy                │
│     - QR code (if enabled)         │
│     - Barcode (if enabled)         │
│     - Light separator              │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  9. Open Cash Drawer               │
│     (if cash payment & enabled)    │
└────────────────────────────────────┘
              ↓
┌────────────────────────────────────┐
│  10. Finalize & Cut                │
│      - Feed paper                  │
│      - Cut receipt                 │
│      - Return byte buffer          │
└────────────────────────────────────┘
```

### Receipt Template Example (80mm)

```
┌────────────────────────────────────────────────┐
│                   [LOGO]                       │
│                                                │
│              ABC RETAIL STORE                  │
│         123 Main Street, Colombo 01            │
│            Tel: 011-234-5678                   │
│         Email: info@abcstore.lk                │
├════════════════════════════════════════════════┤
│  Date: 2024-01-15         Time: 14:30:25      │
│  Receipt: REC20240115-00042                    │
│  Cashier: John Doe        Terminal: POS-01    │
│  Customer: Jane Smith     Phone: 077-123-4567 │
├────────────────────────────────────────────────┤
│  ITEM                          QTY      AMOUNT │
├────────────────────────────────────────────────┤
│  Rice Basmati Premium 5kg        2      2,500  │
│  Milk Full Cream 1L x2           4      3,400  │
│  Sugar White 1kg                 1        450  │
│  Cooking Oil 1L                  1        850  │
│  Eggs Dozen                      2        600  │
├════════════════════════════════════════════════┤
│  Subtotal:                             7,800.00│
│  VAT (15%):                            1,170.00│
│  Discount (5%):                         -390.00│
│  Delivery:                               200.00│
│  ───────────────────────────────────────────── │
│  TOTAL:                      LKR      8,780.00│
├════════════════════════════════════════════════┤
│  Payment Method: CASH                          │
│  Amount Paid:                         10,000.00│
│  Change:                               1,220.00│
├════════════════════════════════════════════════┤
│              Thank you for shopping!           │
│         Please keep your receipt safe          │
│    Return within 7 days with this receipt     │
│                                                │
│              Scan for digital copy:            │
│                  [QR CODE]                     │
│                                                │
│              ║ ║║║ ║║ ║║║║ ║║║ ║              │
│                REC20240115-00042               │
├────────────────────────────────────────────────┤
│         Visit us: www.abcstore.lk              │
└────────────────────────────────────────────────┘
```

### Renderer API Usage Examples

```
Initialize Renderer:
  const config = {
    paperWidth: '80mm',
    printLogo: true,
    printQRCode: true,
    separatorStyle: 'heavy'
  }
  const renderer = new ThermalPrintRenderer(config)

Render Complete Receipt:
  const receiptData: ReceiptData = {
    header: { storeName: 'ABC Store', ... },
    metadata: { date: '2024-01-15', ... },
    items: [...],
    totals: { subtotal: 7800, ... },
    payment: { method: 'Cash', ... },
    footer: { thankYouMessage: '...', ... }
  }
  const buffer = renderer.renderReceipt(receiptData)

Render Specific Template:
  const buffer = renderer.renderSaleReceipt(saleData)
  const buffer = renderer.renderRefundReceipt(refundData)

Preview Receipt:
  const preview = renderer.previewReceipt(receiptData)
  console.log(preview)  // ASCII preview
```

### Expected Outcome
```
frontend/lib/printing/
└── renderer.ts
    ├── ThermalPrintRenderer class
    ├── ReceiptData interface
    ├── renderHeader(data)
    ├── renderMetadata(data)
    ├── renderItemsHeader()
    ├── renderItem(item)
    ├── renderTotals(totals)
    ├── renderPayment(payment)
    ├── renderFooter(footer)
    ├── renderReceipt(data)
    ├── renderSaleReceipt(data)
    ├── renderRefundReceipt(data)
    ├── renderOrderReceipt(data)
    └── previewReceipt(data)
```

### Verification Checklist
- [ ] Thermal print renderer file created
- [ ] Renderer class defined with configuration
- [ ] Receipt data interface comprehensive
- [ ] Header rendering works (logo, name, address)
- [ ] Metadata rendering works (date, receipt #, etc.)
- [ ] Items header rendering works
- [ ] Item line rendering works (with wrapping)
- [ ] Totals section rendering works
- [ ] Payment section rendering works
- [ ] Footer rendering works (QR, barcode, messages)
- [ ] Complete receipt rendering works
- [ ] Receipt options interface defined
- [ ] Receipt templates work (sale, refund, order)
- [ ] Preview method generates ASCII preview
- [ ] Error handling robust
- [ ] Receipt validates before rendering

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 43 | Implement QR code printing | QR code commands, size, error correction |
| 44 | Create 80mm layout formatter | 48-character layout formatting |
| 45 | Create 58mm layout formatter | 32-character layout formatting |
| 46 | Implement separator lines | Light, heavy, decorative separators |
| 47 | Create cash drawer command | Drawer open for pin 2/5 |
| 48 | Create ThermalPrintRenderer | Complete receipt rendering |

### Key Components Created
```
frontend/lib/printing/
├── escpos.ts
│   ├── QR code methods
│   ├── Separator methods
│   └── Cash drawer methods
├── layout-80mm.ts
│   └── Layout80mm formatter (48 chars)
├── layout-58mm.ts
│   └── Layout58mm formatter (32 chars)
└── renderer.ts
    └── ThermalPrintRenderer (complete receipt)
```

### Rendering Capabilities

| Capability | 80mm | 58mm | Notes |
|------------|------|------|-------|
| Header with Logo | ✓ | ✓ | Centered, scaled |
| Store Information | ✓ | ✓ | Multi-line address |
| Receipt Metadata | ✓ | ✓ | Date, number, cashier |
| Item Lines | ✓ | ✓ | 2 or 3 column layout |
| Totals Section | ✓ | ✓ | Subtotal, tax, total |
| Payment Details | ✓ | ✓ | Method, amount, change |
| QR Code | ✓ | ✓ | Configurable size |
| Barcode | ✓ | ✓ | CODE128, EAN13 |
| Separators | ✓ | ✓ | Light, heavy styles |
| Cash Drawer | ✓ | ✓ | Auto-open on cash |

### Next Steps
1. Proceed to [03_Tasks-49-52_Network-USB-Queue.md](03_Tasks-49-52_Network-USB-Queue.md) for network/USB printing and queue management
2. Implement printer connection handling
3. Add print job queue and retry logic

---

## Notes for AI Agents

1. **Execution Order:** Task 48 depends on all previous tasks being complete
2. **Layout Formatters:** 80mm and 58mm formatters have identical interfaces, different widths
3. **QR Code Data:** Ensure UTF-8 encoding for international characters
4. **Separator Styles:** Maintain visual hierarchy (heavy for major sections, light for minor)
5. **Cash Drawer:** Test timing parameters with actual hardware
6. **Receipt Templates:** Create reusable templates for common receipt types
7. **Preview Mode:** Implement ASCII preview for testing without hardware
8. **Error Handling:** Validate all receipt data before rendering
9. **Paper Width Detection:** Auto-detect or configure paper width
10. **Testing:** Test with actual thermal printers for verification
