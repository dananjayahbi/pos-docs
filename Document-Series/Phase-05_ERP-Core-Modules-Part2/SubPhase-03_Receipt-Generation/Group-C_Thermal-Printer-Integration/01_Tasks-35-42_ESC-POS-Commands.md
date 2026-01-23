# Tasks 35-42: ESC/POS Commands & Formatting

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** C - Thermal Printer Integration  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-48_QR-Layout-Renderer.md](02_Tasks-43-48_QR-Layout-Renderer.md)
- **← Previous Group:** [../Group-B_Receipt-Data-Generation/](../Group-B_Receipt-Data-Generation/)

---

## Document Overview

This document covers the creation of thermal printer services, ESC/POS command constants, and core text formatting capabilities for printing receipts on thermal printers. These tasks establish the foundation for all thermal printing operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create thermal printer service | Medium | 30 min |
| 36 | Define ESC/POS command constants | Medium | 25 min |
| 37 | Implement text formatting | Medium | 30 min |
| 38 | Implement alignment commands | Medium | 20 min |
| 39 | Implement line spacing | Low | 15 min |
| 40 | Implement paper cutting | Low | 15 min |
| 41 | Implement logo printing | High | 35 min |
| 42 | Implement barcode printing | Medium | 30 min |

---

## Task 35: Create Thermal Printer Service

### Overview
Create the base thermal printer service that handles ESC/POS command generation, byte buffer management, and provides the foundation for all thermal printing operations.

### Dependencies
- Frontend project structure is initialized
- TypeScript configuration is set up
- Printing directory structure exists

### Instructions

1. **Create thermal printer service file**
   - Create file at `frontend/lib/printing/escpos.ts`
   - Set up TypeScript with proper type definitions

2. **Define core printer service class**
   - Create `ThermalPrinterService` class
   - Initialize with printer configuration (width, model)
   - Maintain internal byte buffer for commands

3. **Implement buffer management**
   - Create private buffer property (Uint8Array)
   - Implement `appendBytes()` method for adding bytes
   - Implement `appendText()` method for adding text
   - Implement `getBuffer()` method to retrieve final bytes
   - Implement `clear()` method to reset buffer

4. **Add printer initialization**
   - Create `initialize()` method
   - Append printer initialization command
   - Reset printer to default state

5. **Add command helper methods**
   - `sendCommand(bytes: number[])` - Append raw ESC/POS bytes
   - `sendText(text: string, encoding?)` - Append text with encoding
   - `newLine(count?)` - Add line feed characters
   - `feed(lines?)` - Feed paper by specified lines

6. **Implement encoding support**
   - Support UTF-8 encoding (default)
   - Support ISO-8859-1 for ASCII
   - Handle character encoding conversion
   - Handle unsupported character fallbacks

7. **Add printer state management**
   - Track current text alignment
   - Track current text formatting (bold, underline)
   - Track current line spacing
   - Provide state reset capability

8. **Create printer configuration interface**
   - Define `PrinterConfig` type
   - Include paper width (80mm or 58mm)
   - Include character width (48 or 32 chars)
   - Include printer model/vendor
   - Include connection type (network/USB)

9. **Add error handling**
   - Validate commands before appending
   - Handle buffer overflow scenarios
   - Provide clear error messages
   - Log errors for debugging

10. **Implement buffer finalization**
    - Create `finalize()` method
    - Ensure printer is reset to defaults
    - Add final paper feed
    - Return complete byte buffer

### Service Architecture

```
┌─────────────────────────────────────────────────┐
│        ThermalPrinterService                    │
├─────────────────────────────────────────────────┤
│  - buffer: Uint8Array                           │
│  - config: PrinterConfig                        │
│  - state: PrinterState                          │
├─────────────────────────────────────────────────┤
│  + initialize()                                 │
│  + sendCommand(bytes)                           │
│  + sendText(text, encoding)                     │
│  + newLine(count)                               │
│  + feed(lines)                                  │
│  + getBuffer()                                  │
│  + clear()                                      │
│  + finalize()                                   │
└─────────────────────────────────────────────────┘
```

### Configuration Types

| Property | Type | Purpose |
|----------|------|---------|
| `paperWidth` | `'80mm' \| '58mm'` | Physical paper width |
| `charWidth` | `48 \| 32` | Characters per line |
| `printerModel` | `string` | Vendor/model identifier |
| `connectionType` | `'network' \| 'usb'` | Connection method |
| `encoding` | `string` | Default text encoding |

### Buffer Management Pattern

```
┌────────────────────────────────────────┐
│  Initialize                            │
│  ↓                                     │
│  Append Commands/Text                  │
│  ↓                                     │
│  Append More Commands                  │
│  ↓                                     │
│  Finalize                              │
│  ↓                                     │
│  Get Buffer → Send to Printer          │
└────────────────────────────────────────┘
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts               # Thermal printer service
```

### Verification Checklist
- [ ] `ThermalPrinterService` class is created
- [ ] Buffer management methods are implemented
- [ ] Command helper methods are functional
- [ ] Text encoding support is implemented
- [ ] Printer state tracking is functional
- [ ] Configuration interface is defined
- [ ] Error handling is in place
- [ ] Finalization method completes buffer

---

## Task 36: Define ESC/POS Command Constants

### Overview
Define comprehensive ESC/POS command constants used throughout the thermal printing system. These constants represent the byte sequences for printer control commands.

### Dependencies
- Task 35: Create thermal printer service

### Instructions

1. **Create command constants file structure**
   - In `frontend/lib/printing/escpos.ts` or separate constants file
   - Organize constants by functional category
   - Use TypeScript `const` or `enum` for type safety

2. **Define printer initialization commands**
   - `ESC_INIT`: Initialize printer `[0x1B, 0x40]`
   - Resets printer to default state
   - Clears buffer and formatting

3. **Define text alignment commands**
   - `ALIGN_LEFT`: Left alignment `[0x1B, 0x61, 0x00]`
   - `ALIGN_CENTER`: Center alignment `[0x1B, 0x61, 0x01]`
   - `ALIGN_RIGHT`: Right alignment `[0x1B, 0x61, 0x02]`

4. **Define text emphasis commands**
   - `BOLD_ON`: Enable bold `[0x1B, 0x45, 0x01]`
   - `BOLD_OFF`: Disable bold `[0x1B, 0x45, 0x00]`
   - `UNDERLINE_ON`: Enable underline `[0x1B, 0x2D, 0x01]`
   - `UNDERLINE_2DOT_ON`: 2-dot underline `[0x1B, 0x2D, 0x02]`
   - `UNDERLINE_OFF`: Disable underline `[0x1B, 0x2D, 0x00]`

5. **Define text size commands**
   - `FONT_NORMAL`: Normal size `[0x1B, 0x21, 0x00]`
   - `FONT_DOUBLE_HEIGHT`: 2x height `[0x1B, 0x21, 0x10]`
   - `FONT_DOUBLE_WIDTH`: 2x width `[0x1B, 0x21, 0x20]`
   - `FONT_DOUBLE_BOTH`: 2x height & width `[0x1B, 0x21, 0x30]`

6. **Define line spacing commands**
   - `LINE_SPACING_DEFAULT`: Default spacing `[0x1B, 0x32]`
   - `LINE_SPACING_SET`: Set spacing `[0x1B, 0x33]` (+ value byte)
   - Typical values: 30-60 (units of 0.125mm)

7. **Define paper cutting commands**
   - `CUT_FULL`: Full paper cut `[0x1D, 0x56, 0x00]`
   - `CUT_PARTIAL`: Partial cut `[0x1D, 0x56, 0x01]`
   - `CUT_FEED_FULL`: Feed and full cut `[0x1D, 0x56, 0x41, n]`
   - `CUT_FEED_PARTIAL`: Feed and partial cut `[0x1D, 0x56, 0x42, n]`

8. **Define paper feed commands**
   - `FEED_LINE`: Line feed `[0x0A]`
   - `FEED_REVERSE`: Reverse feed `[0x1B, 0x65]` (+ lines)
   - `FEED_UNITS`: Feed by units `[0x1B, 0x4A]` (+ units)

9. **Define graphics commands**
   - `GRAPHICS_PRINT`: Print raster graphics `[0x1D, 0x76, 0x30]`
   - `GRAPHICS_DATA`: Graphics data header
   - Logo printing command base

10. **Define barcode commands**
    - `BARCODE_HEIGHT`: Set height `[0x1D, 0x68]` (+ height)
    - `BARCODE_WIDTH`: Set width `[0x1D, 0x77]` (+ width 2-6)
    - `BARCODE_PRINT`: Print barcode `[0x1D, 0x6B]` (+ type + data)
    - `BARCODE_TEXT_BELOW`: HRI text position `[0x1D, 0x48, 0x02]`

11. **Define QR code commands**
    - `QR_MODEL`: Set QR model `[0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, n]`
    - `QR_SIZE`: Set QR size `[0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, n]`
    - `QR_ERROR_CORRECTION`: Set error correction level
    - `QR_STORE`: Store QR data in symbol storage
    - `QR_PRINT`: Print stored QR code

12. **Define cash drawer commands**
    - `DRAWER_OPEN_PIN2`: Open drawer pin 2 `[0x1B, 0x70, 0x00, t1, t2]`
    - `DRAWER_OPEN_PIN5`: Open drawer pin 5 `[0x1B, 0x70, 0x01, t1, t2]`
    - Standard timing: `t1=25, t2=250` (25ms on, 250ms off)

13. **Define character set commands**
    - `CHARSET_USA`: USA character set `[0x1B, 0x52, 0x00]`
    - `CHARSET_INTL`: International charset
    - `CODEPAGE_CP437`: Code page 437
    - `CODEPAGE_CP850`: Code page 850

14. **Create command helper maps**
    - Map alignment names to byte commands
    - Map text modes to byte commands
    - Map barcode types to type codes
    - Map QR error levels to codes

### Command Categories

```
ESC/POS Commands
│
├── Printer Control
│   ├── Initialize
│   └── Reset
│
├── Text Formatting
│   ├── Alignment (Left, Center, Right)
│   ├── Emphasis (Bold, Underline)
│   └── Size (Normal, Double-Height, Double-Width)
│
├── Paper Control
│   ├── Line Spacing
│   ├── Paper Feed
│   └── Paper Cutting
│
├── Graphics
│   ├── Raster Graphics (Logo)
│   ├── Barcode Printing
│   └── QR Code Printing
│
└── Peripherals
    └── Cash Drawer
```

### ESC/POS Byte Sequence Diagram

```
Initialization Sequence:
┌──────────┬──────────┐
│  0x1B    │  0x40    │  ESC @ (Initialize)
└──────────┴──────────┘

Alignment Sequence:
┌──────────┬──────────┬──────────┐
│  0x1B    │  0x61    │   0x01   │  ESC a 1 (Center)
└──────────┴──────────┴──────────┘

Bold Sequence:
┌──────────┬──────────┬──────────┐
│  0x1B    │  0x45    │   0x01   │  ESC E 1 (Bold On)
└──────────┴──────────┴──────────┘

Cut Sequence:
┌──────────┬──────────┬──────────┐
│  0x1D    │  0x56    │   0x00   │  GS V 0 (Full Cut)
└──────────┴──────────┴──────────┘
```

### Barcode Type Codes

| Type | Code | Format |
|------|------|--------|
| UPC-A | 0 | 11-12 digits |
| UPC-E | 1 | 6-8 digits |
| EAN13 | 2 | 12-13 digits |
| EAN8 | 3 | 7-8 digits |
| CODE39 | 4 | Variable |
| ITF | 5 | Even digits |
| CODABAR | 6 | Variable |
| CODE93 | 7 | Variable |
| CODE128 | 8 | Variable |

### QR Code Error Correction Levels

| Level | Code | Recovery | Use Case |
|-------|------|----------|----------|
| L | 0x30 | 7% | Fast scan, clean environment |
| M | 0x31 | 15% | Standard receipts |
| Q | 0x32 | 25% | Partial damage tolerance |
| H | 0x33 | 30% | Logo overlay, damage resistant |

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Command constants defined
        ├── Printer control
        ├── Text formatting
        ├── Paper control
        ├── Graphics commands
        └── Peripheral commands
```

### Verification Checklist
- [ ] Initialization commands are defined
- [ ] Alignment commands are defined
- [ ] Text emphasis commands are defined
- [ ] Text size commands are defined
- [ ] Line spacing commands are defined
- [ ] Paper cutting commands are defined
- [ ] Graphics commands are defined
- [ ] Barcode commands are defined
- [ ] QR code commands are defined
- [ ] Cash drawer commands are defined
- [ ] Character set commands are defined
- [ ] Command helper maps are created

---

## Task 37: Implement Text Formatting

### Overview
Implement text formatting methods that apply bold, underline, and size modifications to printed text. These methods use the ESC/POS commands defined in Task 36.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add text formatting methods to service**
   - Extend `ThermalPrinterService` class
   - Add formatting control methods
   - Track current formatting state

2. **Implement bold text control**
   - Create `setBold(enabled: boolean)` method
   - Send `BOLD_ON` command when enabled is true
   - Send `BOLD_OFF` command when enabled is false
   - Update internal state tracking

3. **Implement underline control**
   - Create `setUnderline(mode: 0 | 1 | 2)` method
   - Mode 0: No underline (UNDERLINE_OFF)
   - Mode 1: Single dot underline (UNDERLINE_ON)
   - Mode 2: Double dot underline (UNDERLINE_2DOT_ON)
   - Update internal state tracking

4. **Implement text size control**
   - Create `setTextSize(width: 1 | 2, height: 1 | 2)` method
   - Calculate appropriate ESC/POS command
   - Support combinations: normal, double-width, double-height, double-both
   - Update internal state tracking

5. **Implement convenience methods**
   - `printBold(text: string)` - Print text with bold
   - `printUnderline(text: string)` - Print text with underline
   - `printLarge(text: string)` - Print text double-size
   - Automatically reset formatting after printing

6. **Add inline formatting support**
   - Create `printFormatted(text: string)` method
   - Support markdown-like syntax: `**bold**`, `__underline__`
   - Parse and apply formatting inline
   - Reset to normal after formatted section

7. **Implement formatting reset**
   - Create `resetFormatting()` method
   - Disable bold (BOLD_OFF)
   - Disable underline (UNDERLINE_OFF)
   - Set normal text size (FONT_NORMAL)
   - Reset internal state tracking

8. **Add formatting state tracking**
   - Track bold enabled/disabled state
   - Track underline mode (0, 1, 2)
   - Track text width multiplier (1, 2)
   - Track text height multiplier (1, 2)

9. **Implement formatting combinations**
   - Allow bold + underline together
   - Allow bold + large text together
   - Allow underline + large text together
   - Handle cumulative formatting commands

10. **Add formatting validation**
    - Validate text size parameters (1 or 2 only)
    - Validate underline mode (0, 1, or 2 only)
    - Provide clear error messages for invalid values

### Text Formatting Flow

```
┌────────────────────────────────────────────┐
│  Default State: Normal Text                │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  setBold(true)                             │
│  → Send [0x1B, 0x45, 0x01]                 │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  sendText("Bold Text")                     │
│  → Prints in bold                          │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  setBold(false)                            │
│  → Send [0x1B, 0x45, 0x00]                 │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│  Return to Normal Text                     │
└────────────────────────────────────────────┘
```

### Formatting Combinations Matrix

| Combination | Commands |
|-------------|----------|
| Normal | `[0x1B, 0x21, 0x00]` |
| Bold Only | `[0x1B, 0x45, 0x01]` |
| Underline Only | `[0x1B, 0x2D, 0x01]` |
| Bold + Underline | `[0x1B, 0x45, 0x01]` + `[0x1B, 0x2D, 0x01]` |
| Double Width | `[0x1B, 0x21, 0x20]` |
| Double Height | `[0x1B, 0x21, 0x10]` |
| Double Both | `[0x1B, 0x21, 0x30]` |
| Bold + Large | `[0x1B, 0x45, 0x01]` + `[0x1B, 0x21, 0x30]` |

### Formatting API Usage Examples

```
Basic Bold:
  printer.setBold(true)
  printer.sendText("Bold Text")
  printer.setBold(false)

Convenience Method:
  printer.printBold("Bold Text")

Inline Formatting:
  printer.printFormatted("**Bold** and __underline__")

Combination:
  printer.setBold(true)
  printer.setTextSize(2, 2)
  printer.sendText("LARGE BOLD")
  printer.resetFormatting()
```

### State Tracking Structure

```typescript
interface FormattingState {
  bold: boolean;
  underline: 0 | 1 | 2;
  widthMultiplier: 1 | 2;
  heightMultiplier: 1 | 2;
}
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Text formatting methods
        ├── setBold(enabled)
        ├── setUnderline(mode)
        ├── setTextSize(width, height)
        ├── printBold(text)
        ├── printUnderline(text)
        ├── printLarge(text)
        ├── printFormatted(text)
        └── resetFormatting()
```

### Verification Checklist
- [ ] Bold control methods are implemented
- [ ] Underline control methods are implemented
- [ ] Text size control methods are implemented
- [ ] Convenience methods are functional
- [ ] Inline formatting parser works
- [ ] Formatting reset method works
- [ ] State tracking is accurate
- [ ] Formatting combinations work correctly
- [ ] Validation prevents invalid values

---

## Task 38: Implement Alignment Commands

### Overview
Implement text alignment methods for left, center, and right alignment of printed text. Alignment affects all subsequent text until changed or reset.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add alignment methods to service**
   - Extend `ThermalPrinterService` class
   - Add alignment control methods
   - Track current alignment state

2. **Implement left alignment**
   - Create `alignLeft()` method
   - Send `ALIGN_LEFT` command `[0x1B, 0x61, 0x00]`
   - Update internal alignment state to 'left'
   - Default alignment for receipts

3. **Implement center alignment**
   - Create `alignCenter()` method
   - Send `ALIGN_CENTER` command `[0x1B, 0x61, 0x01]`
   - Update internal alignment state to 'center'
   - Common for headers and totals

4. **Implement right alignment**
   - Create `alignRight()` method
   - Send `ALIGN_RIGHT` command `[0x1B, 0x61, 0x02]`
   - Update internal alignment state to 'right'
   - Common for amounts and prices

5. **Create convenience print methods**
   - `printLeft(text: string)` - Print left-aligned text
   - `printCenter(text: string)` - Print centered text
   - `printRight(text: string)` - Print right-aligned text
   - Automatically restore previous alignment after printing

6. **Implement alignment with formatting**
   - `printCenterBold(text: string)` - Centered bold text
   - `printRightBold(text: string)` - Right-aligned bold text
   - Combine alignment and text formatting

7. **Add multi-column printing support**
   - Create `printColumns(columns: ColumnData[])` method
   - Support left/right column pairs
   - Support three-column layouts
   - Calculate spacing based on paper width

8. **Implement alignment state tracking**
   - Track current alignment ('left', 'center', 'right')
   - Provide `getCurrentAlignment()` method
   - Store previous alignment for restoration

9. **Add alignment reset**
   - Include in `resetFormatting()` method
   - Default to left alignment
   - Ensure alignment is reset after operations

10. **Create alignment validation**
    - Validate alignment values
    - Provide clear error messages
    - Handle invalid alignment gracefully

### Alignment Command Diagram

```
Left Alignment (Default):
┌────────────────────────────────────────────┐
│  Text starts from left margin              │
│  All lines align to left                   │
│  ◀─ Text                                   │
└────────────────────────────────────────────┘
Command: [0x1B, 0x61, 0x00]

Center Alignment:
┌────────────────────────────────────────────┐
│              Centered Text                 │
│         All lines centered                 │
│              ◀─ Text ─▶                    │
└────────────────────────────────────────────┘
Command: [0x1B, 0x61, 0x01]

Right Alignment:
┌────────────────────────────────────────────┐
│                         Right-aligned Text │
│                    All lines align to right│
│                                    Text ─▶ │
└────────────────────────────────────────────┘
Command: [0x1B, 0x61, 0x02]
```

### Multi-Column Layout Pattern

```
Two-Column Layout (Item + Price):
┌────────────────────────────────────────────┐
│  Item Name                        10,000.00│
│  Another Item                      5,500.00│
└────────────────────────────────────────────┘

Three-Column Layout (Item + Qty + Price):
┌────────────────────────────────────────────┐
│  Item Name              2         10,000.00│
│  Another Item           1          5,500.00│
└────────────────────────────────────────────┘
```

### Column Data Structure

```typescript
interface ColumnData {
  text: string;
  width: number;        // Character width
  align: 'left' | 'center' | 'right';
  padding?: number;     // Extra padding
}
```

### Alignment API Usage Examples

```
Basic Alignment:
  printer.alignCenter()
  printer.sendText("STORE NAME")
  printer.alignLeft()

Convenience Method:
  printer.printCenter("STORE NAME")

Multi-Column:
  printer.printColumns([
    { text: "Item", width: 30, align: 'left' },
    { text: "10,000.00", width: 18, align: 'right' }
  ])

Alignment with Formatting:
  printer.printCenterBold("RECEIPT")
```

### Two-Column Implementation Logic

```
For 48-character width (80mm):
┌──────────────────┬──────────────────┐
│   Left Column    │   Right Column   │
│   (30 chars)     │   (18 chars)     │
└──────────────────┴──────────────────┘

Calculation:
  leftText = leftText.padEnd(30, ' ')
  rightText = rightText.padStart(18, ' ')
  fullLine = leftText + rightText
```

### Receipt Alignment Patterns

| Section | Alignment | Purpose |
|---------|-----------|---------|
| Store Name | Center | Branding |
| Address | Center | Contact info |
| Separator Lines | Left | Visual break |
| Item Names | Left | Readability |
| Item Prices | Right | Number alignment |
| Subtotal Label | Left | Clarity |
| Subtotal Amount | Right | Number alignment |
| Total Label | Left, Bold | Emphasis |
| Total Amount | Right, Bold | Emphasis |
| Payment Method | Left | Information |
| Thank You | Center | Courtesy |

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Alignment methods
        ├── alignLeft()
        ├── alignCenter()
        ├── alignRight()
        ├── printLeft(text)
        ├── printCenter(text)
        ├── printRight(text)
        ├── printColumns(columns)
        ├── printCenterBold(text)
        ├── printRightBold(text)
        └── getCurrentAlignment()
```

### Verification Checklist
- [ ] Left alignment method works
- [ ] Center alignment method works
- [ ] Right alignment method works
- [ ] Convenience print methods functional
- [ ] Alignment with formatting works
- [ ] Multi-column printing works
- [ ] Alignment state tracking accurate
- [ ] Alignment reset works
- [ ] Validation prevents invalid values
- [ ] Previous alignment restoration works

---

## Task 39: Implement Line Spacing

### Overview
Implement line spacing control methods to adjust the vertical spacing between printed lines. Different line spacing can improve readability and receipt aesthetics.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add line spacing methods to service**
   - Extend `ThermalPrinterService` class
   - Add spacing control methods
   - Track current line spacing state

2. **Implement default line spacing**
   - Create `setDefaultLineSpacing()` method
   - Send `LINE_SPACING_DEFAULT` command `[0x1B, 0x32]`
   - Reset to printer's default spacing
   - Typically 30 units (3.75mm)

3. **Implement custom line spacing**
   - Create `setLineSpacing(spacing: number)` method
   - Send `LINE_SPACING_SET` command `[0x1B, 0x33, spacing]`
   - Spacing parameter in units of 0.125mm or 1/203 inch
   - Valid range: 0-255 (typically use 20-60)

4. **Add preset spacing methods**
   - `setCompactSpacing()` - Tight spacing (20 units)
   - `setNormalSpacing()` - Standard spacing (30 units)
   - `setRelaxedSpacing()` - Loose spacing (40 units)
   - `setWideSpacing()` - Extra spacing (50 units)

5. **Implement line spacing state tracking**
   - Track current spacing value
   - Store whether default or custom spacing
   - Provide `getCurrentLineSpacing()` method

6. **Add spacing for specific sections**
   - `setHeaderSpacing()` - Spacing for header section
   - `setItemSpacing()` - Spacing for item lines
   - `setFooterSpacing()` - Spacing for footer section
   - Allow different spacing per receipt section

7. **Implement spacing reset**
   - Include in service finalization
   - Reset to default spacing at end
   - Ensure next print starts with correct spacing

8. **Create spacing calculation helpers**
   - Convert millimeters to ESC/POS units
   - Convert inches to ESC/POS units
   - Provide `spacingFromMM(mm: number)` method
   - Provide `spacingFromInch(inch: number)` method

9. **Add validation for spacing values**
   - Ensure spacing is within valid range (0-255)
   - Provide clear error messages for invalid values
   - Use defaults for out-of-range values with warning

10. **Document spacing recommendations**
    - Compact (20): Dense receipts, save paper
    - Normal (30): Standard readability
    - Relaxed (40): Improved legibility
    - Wide (50): Emphasis and separation

### Line Spacing Units

```
ESC/POS Line Spacing:
┌────────────────────────────────────┐
│  Unit: 1/203 inch or 0.125mm       │
│  Range: 0-255 units                │
│  Common: 20-60 units               │
└────────────────────────────────────┘

Conversion:
  1mm = 8 units (approx)
  1/8 inch = 1 unit
  Default = 30 units ≈ 3.75mm ≈ 0.148 inch
```

### Line Spacing Visual

```
Compact Spacing (20 units):
Line 1 text here
Line 2 text here
Line 3 text here

Normal Spacing (30 units):
Line 1 text here

Line 2 text here

Line 3 text here

Relaxed Spacing (40 units):
Line 1 text here


Line 2 text here


Line 3 text here
```

### Spacing Presets

| Preset | Units | MM | Use Case |
|--------|-------|-----|----------|
| Compact | 20 | 2.5 | Dense receipts, save paper |
| Normal | 30 | 3.75 | Standard receipts |
| Relaxed | 40 | 5.0 | Improved readability |
| Wide | 50 | 6.25 | Section separation |

### Line Spacing Commands

```
Default Spacing:
┌──────────┬──────────┐
│  0x1B    │  0x32    │  ESC 2 (Default)
└──────────┴──────────┘

Custom Spacing:
┌──────────┬──────────┬──────────┐
│  0x1B    │  0x33    │    n     │  ESC 3 n (Custom)
└──────────┴──────────┴──────────┘
```

### Receipt Section Spacing Pattern

```
┌────────────────────────────────────────┐
│        Store Name                      │  ← Normal
│        Address Line                    │  ← Compact
│                                        │
├────────────────────────────────────────┤  ← Wide
│  Date: 2024-01-15    Time: 14:30      │  ← Normal
│                                        │
├────────────────────────────────────────┤  ← Wide
│  Item Name                  10,000.00  │  ← Compact
│  Another Item                5,500.00  │  ← Compact
│                                        │
├────────────────────────────────────────┤  ← Wide
│  TOTAL:           LKR   15,500.00      │  ← Normal
│                                        │
└────────────────────────────────────────┘
```

### Spacing API Usage Examples

```
Set Default:
  printer.setDefaultLineSpacing()

Set Custom:
  printer.setLineSpacing(25)  // 25 units

Use Preset:
  printer.setCompactSpacing()  // For item lines
  printer.setNormalSpacing()   // For header

Convert from MM:
  const spacing = printer.spacingFromMM(4.5)  // ~36 units
  printer.setLineSpacing(spacing)

Section-Specific:
  printer.setHeaderSpacing()   // Relaxed
  printer.setItemSpacing()     // Compact
  printer.setFooterSpacing()   // Normal
```

### State Tracking Structure

```typescript
interface LineSpacingState {
  current: number;          // Current spacing value
  isDefault: boolean;       // Using default spacing?
  preset?: string;          // Preset name if applicable
}
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Line spacing methods
        ├── setDefaultLineSpacing()
        ├── setLineSpacing(spacing)
        ├── setCompactSpacing()
        ├── setNormalSpacing()
        ├── setRelaxedSpacing()
        ├── setWideSpacing()
        ├── spacingFromMM(mm)
        ├── spacingFromInch(inch)
        └── getCurrentLineSpacing()
```

### Verification Checklist
- [ ] Default line spacing method works
- [ ] Custom line spacing method works
- [ ] Preset spacing methods functional
- [ ] State tracking is accurate
- [ ] Section-specific spacing works
- [ ] Spacing reset is included
- [ ] Conversion helpers work correctly
- [ ] Validation prevents invalid values
- [ ] Spacing documentation is clear

---

## Task 40: Implement Paper Cutting

### Overview
Implement paper cutting commands to cut the receipt paper after printing. Support both full and partial cuts, with optional paper feed before cutting.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add paper cutting methods to service**
   - Extend `ThermalPrinterService` class
   - Add cutting command methods
   - Handle printers with/without cutter

2. **Implement full paper cut**
   - Create `cutFull()` method
   - Send `CUT_FULL` command `[0x1D, 0x56, 0x00]`
   - Completely separates receipt from roll
   - Most common cutting method

3. **Implement partial paper cut**
   - Create `cutPartial()` method
   - Send `CUT_PARTIAL` command `[0x1D, 0x56, 0x01]`
   - Leaves small connection point
   - Prevents paper jams in some printers

4. **Implement cut with feed**
   - Create `cutWithFeed(lines: number, partial?: boolean)` method
   - Feed specified lines before cutting
   - Choose full or partial cut
   - Command: `[0x1D, 0x56, type, lines]`

5. **Add automatic pre-cut feed**
   - Create `cutReceipt(feedLines: number = 4)` method
   - Automatically feed paper before cut
   - Ensures clean separation
   - Default 4 lines for tear-off clearance

6. **Implement cut capability detection**
   - Add `hasCutter` property to printer config
   - Check if printer supports cutting
   - Gracefully handle printers without cutter
   - Warn or skip cut command if unsupported

7. **Add manual tear indication**
   - Create `addTearLine()` method
   - Print perforation indication for manual tear
   - Use when printer has no cutter
   - Print: "✂ - - - - - - - - - - - - - - ✂"

8. **Implement cut mode configuration**
   - Add `cutMode` to printer config ('full', 'partial', 'none')
   - Use configured mode by default
   - Allow override in method calls

9. **Add safety features**
   - Ensure minimum feed before cut (prevent cutting too close)
   - Add delay option after cut (prevent immediate next print)
   - Validate cut commands for printer model

10. **Include cut in finalization**
    - Automatically cut in `finalize()` method
    - Use configured cut mode
    - Optional: disable auto-cut via config

### Paper Cutting Diagram

```
Full Cut:
┌─────────────────────────────────┐
│      Printed Receipt            │
│      Content Here               │
│                                 │
│      Thank You!                 │
└─────────────────────────────────┘
         ↓ Feed 4 lines
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│                                 │
└═════════════════════════════════┘ ← Full Cut (100% separation)
─────────────────────────────────── Paper Roll

Partial Cut:
┌─────────────────────────────────┐
│      Printed Receipt            │
│      Content Here               │
│                                 │
│      Thank You!                 │
└─────────────────────────────────┘
         ↓ Feed 4 lines
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│                                 │
└═══╧════════════════════════╧════┘ ← Partial Cut (small bridges remain)
─────────────────────────────────── Paper Roll
```

### Cutting Commands

```
Full Cut (No Feed):
┌──────────┬──────────┬──────────┐
│  0x1D    │  0x56    │  0x00    │  GS V 0
└──────────┴──────────┴──────────┘

Partial Cut (No Feed):
┌──────────┬──────────┬──────────┐
│  0x1D    │  0x56    │  0x01    │  GS V 1
└──────────┴──────────┴──────────┘

Full Cut with Feed:
┌──────────┬──────────┬──────────┬──────────┐
│  0x1D    │  0x56    │  0x41    │    n     │  GS V 65 n
└──────────┴──────────┴──────────┴──────────┘

Partial Cut with Feed:
┌──────────┬──────────┬──────────┬──────────┐
│  0x1D    │  0x56    │  0x42    │    n     │  GS V 66 n
└──────────┴──────────┴──────────┴──────────┘
```

### Cut Mode Configuration

```typescript
interface PrinterConfig {
  // ... other config
  hasCutter: boolean;
  cutMode: 'full' | 'partial' | 'none';
  feedBeforeCut: number;  // Lines to feed
  autoCut: boolean;       // Auto-cut in finalize
}
```

### Cutting Best Practices

| Practice | Reason |
|----------|--------|
| Feed 3-5 lines before cut | Provides clean tear point |
| Use partial cut for continuous printing | Reduces paper jams |
| Use full cut for final receipt | Complete separation |
| Check cutter support | Avoid errors on non-cutter printers |
| Add delay after cut | Prevent overlapping prints |

### Manual Tear Line Format

```
For printers without cutter:
┌────────────────────────────────────────┐
│      Thank You!                        │
│                                        │
│      Please come again!                │
│                                        │
│  ✂ - - - - - - - - - - - - - - - - ✂  │  ← Tear line
│                                        │
│ (Optional blank space)                 │
│                                        │
└────────────────────────────────────────┘
```

### Cutting API Usage Examples

```
Basic Full Cut:
  printer.cutFull()

Basic Partial Cut:
  printer.cutPartial()

Cut with Feed:
  printer.cutWithFeed(5, false)  // Feed 5 lines, full cut

Convenient Cut:
  printer.cutReceipt()  // Auto-feed 4 lines + full cut

Manual Tear:
  printer.addTearLine()  // For non-cutter printers

With Configuration:
  const config = {
    hasCutter: true,
    cutMode: 'partial',
    feedBeforeCut: 4,
    autoCut: true
  }
```

### Printer Model Cutter Support

| Vendor | Models | Cutter Type |
|--------|--------|-------------|
| EPSON TM-T20 | TM-T20II, TM-T20III | Full/Partial |
| EPSON TM-T82 | TM-T82II, TM-T82III | Full/Partial |
| BIXOLON | SRP-350, SRP-380 | Full only |
| Star Micronics | TSP143III | Full/Partial |
| Zebra | ZD220 | None (manual tear) |

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Paper cutting methods
        ├── cutFull()
        ├── cutPartial()
        ├── cutWithFeed(lines, partial)
        ├── cutReceipt(feedLines)
        ├── addTearLine()
        └── Cut capability detection
```

### Verification Checklist
- [ ] Full cut method works
- [ ] Partial cut method works
- [ ] Cut with feed works
- [ ] Convenient cut method functional
- [ ] Cut capability detection works
- [ ] Manual tear line prints correctly
- [ ] Cut mode configuration respected
- [ ] Safety features prevent errors
- [ ] Auto-cut in finalize works
- [ ] Non-cutter printers handled gracefully

---

## Task 41: Implement Logo Printing

### Overview
Implement logo printing functionality using ESC/POS raster graphics commands. Convert bitmap images to ESC/POS format and print them on receipts, typically at the header.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add logo printing methods to service**
   - Extend `ThermalPrinterService` class
   - Add graphics command methods
   - Support image data input

2. **Create image data interface**
   - Define `ImageData` type
   - Include width (pixels)
   - Include height (pixels)
   - Include bitmap data (black/white pixels)

3. **Implement bitmap conversion**
   - Create `convertImageToBitmap(imageData)` method
   - Convert image to 1-bit monochrome
   - Apply dithering for grayscale images
   - Resize to fit paper width if needed

4. **Implement raster graphics command**
   - Create `printRasterGraphics(bitmap)` method
   - Use GS v 0 command: `[0x1D, 0x76, 0x30, mode, width, height, data...]`
   - Mode: 0 (normal), 1 (double-width), 2 (double-height), 3 (double-both)
   - Calculate proper width/height bytes

5. **Add logo storage support**
   - Create `storeLogo(name: string, imageData)` method
   - Store pre-converted logo in memory
   - Allow quick printing without re-conversion
   - Support multiple logos (header, footer, etc.)

6. **Implement logo printing method**
   - Create `printLogo(name: string, align?: string)` method
   - Retrieve stored logo by name
   - Apply alignment (center typically)
   - Print logo with proper spacing

7. **Add image size validation**
   - Check maximum width (576 dots for 80mm, 384 for 58mm)
   - Check maximum height (reasonable limit, e.g., 200 dots)
   - Validate bitmap data integrity
   - Provide clear error messages for invalid images

8. **Implement logo scaling**
   - Create `scaleLogo(bitmap, scale)` method
   - Support scale factors (0.5x, 1x, 2x)
   - Maintain aspect ratio
   - Use nearest-neighbor or bilinear scaling

9. **Add logo positioning options**
   - Support left, center, right alignment
   - Add margin/padding options
   - Feed lines before/after logo
   - Create `printLogoWithMargins()` method

10. **Create logo utility methods**
    - `clearStoredLogos()` - Clear all stored logos
    - `hasLogo(name)` - Check if logo exists
    - `getLogoSize(name)` - Get logo dimensions
    - `removeLog(name)` - Remove specific logo

11. **Implement Base64 image loading**
    - Create `loadLogoFromBase64(base64: string)` method
    - Decode Base64 to image data
    - Support PNG, JPEG formats
    - Convert to monochrome bitmap

12. **Add error handling for logo printing**
    - Handle missing logos gracefully
    - Handle image conversion errors
    - Handle printer graphics errors
    - Provide fallback (text logo if image fails)

### Logo Printing Flow

```
┌────────────────────────────────────────┐
│  Load Image (PNG/JPEG/Base64)         │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Convert to Monochrome Bitmap          │
│  - Resize if needed                    │
│  - Apply dithering                     │
│  - Create 1-bit pixel array            │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Convert to ESC/POS Raster Format      │
│  - Calculate width/height bytes        │
│  - Pack pixels into bytes              │
│  - Add graphics command header         │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Send to Printer Buffer                │
│  - Apply alignment                     │
│  - Add spacing before/after            │
└────────────────────────────────────────┘
```

### Raster Graphics Command Structure

```
GS v 0 Command:
┌──────┬──────┬──────┬──────┬───────┬───────┬───────────┐
│ 0x1D │ 0x76 │ 0x30 │ mode │ widthL│heightL│ data...   │
└──────┴──────┴──────┴──────┴───────┴───────┴───────────┘
        GS     v      0              width   height
                                     (2 bytes)(2 bytes)

Mode Values:
  0 = Normal (1x)
  1 = Double-width (2x width)
  2 = Double-height (2x height)
  3 = Quadruple (2x both)

Width/Height:
  Little-endian 2-byte values
  Width in bytes = (pixels + 7) / 8
  Example: 100 pixels = 13 bytes
```

### Bitmap Data Structure

```typescript
interface Bitmap {
  width: number;      // Width in pixels
  height: number;     // Height in pixels
  data: Uint8Array;   // 1-bit packed pixels
}

// Pixel packing (MSB first):
// Byte 0: [P7 P6 P5 P4 P3 P2 P1 P0]
// 1 = Black, 0 = White
```

### Logo Size Limits

| Paper Width | Max Pixels | Max Bytes | Typical Logo |
|-------------|------------|-----------|--------------|
| 80mm | 576 | 72 | 200x200 px |
| 58mm | 384 | 48 | 150x150 px |

### Logo Dithering Pattern

```
Original Grayscale:
█████▓▓▓▓▒▒▒▒░░░░

Dithered Output:
██ ██▓ ▓▓ ▓▒ ▒▒ ▒░ ░░ ░
```

### Logo Alignment Example

```
Left-Aligned Logo:
┌────────────────────────────────────┐
│ ▄▄▄▄                               │
│ █  █  STORE                        │
│ ▀▀▀▀                               │
└────────────────────────────────────┘

Center-Aligned Logo:
┌────────────────────────────────────┐
│            ▄▄▄▄                    │
│            █  █  STORE             │
│            ▀▀▀▀                    │
└────────────────────────────────────┘

With Margins:
┌────────────────────────────────────┐
│                                    │
│            ▄▄▄▄                    │
│            █  █  STORE             │
│            ▀▀▀▀                    │
│                                    │
└────────────────────────────────────┘
```

### Logo API Usage Examples

```
Load and Store Logo:
  const logoData = await loadImage('logo.png')
  printer.storeLogo('header', logoData)

Print Stored Logo:
  printer.alignCenter()
  printer.printLogo('header')
  printer.alignLeft()

Print with Margins:
  printer.printLogoWithMargins('header', {
    before: 2,  // 2 blank lines before
    after: 1    // 1 blank line after
  })

Load from Base64:
  const base64 = 'data:image/png;base64,iVBORw0KG...'
  const logo = printer.loadLogoFromBase64(base64)
  printer.printRasterGraphics(logo)

Scale Logo:
  const scaled = printer.scaleLogo(logo, 0.5)  // 50% size
  printer.printRasterGraphics(scaled)
```

### Logo Storage Structure

```typescript
interface LogoStore {
  [name: string]: {
    bitmap: Bitmap;
    originalWidth: number;
    originalHeight: number;
    createdAt: Date;
  }
}
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Logo printing methods
        ├── convertImageToBitmap(imageData)
        ├── printRasterGraphics(bitmap)
        ├── storeLogo(name, imageData)
        ├── printLogo(name, align)
        ├── scaleLogo(bitmap, scale)
        ├── printLogoWithMargins(name, margins)
        ├── loadLogoFromBase64(base64)
        ├── clearStoredLogos()
        ├── hasLogo(name)
        └── removeLogo(name)
```

### Verification Checklist
- [ ] Logo printing methods added
- [ ] Image data interface defined
- [ ] Bitmap conversion works
- [ ] Raster graphics command sends correctly
- [ ] Logo storage functions
- [ ] Logo printing method works
- [ ] Image size validation present
- [ ] Logo scaling works
- [ ] Logo positioning options work
- [ ] Utility methods functional
- [ ] Base64 loading works
- [ ] Error handling robust

---

## Task 42: Implement Barcode Printing

### Overview
Implement barcode printing functionality using ESC/POS barcode commands. Support common barcode types including Code128, EAN13, and Code39 for printing receipt numbers, product codes, and other scannable data.

### Dependencies
- Task 35: Create thermal printer service
- Task 36: Define ESC/POS command constants

### Instructions

1. **Add barcode printing methods to service**
   - Extend `ThermalPrinterService` class
   - Add barcode command methods
   - Support multiple barcode types

2. **Define barcode type constants**
   - Create `BarcodeType` enum
   - Include common types: UPC-A, UPC-E, EAN13, EAN8, CODE39, ITF, CODABAR, CODE93, CODE128
   - Map types to ESC/POS type codes

3. **Implement barcode height setting**
   - Create `setBarcodeHeight(height: number)` method
   - Send `BARCODE_HEIGHT` command `[0x1D, 0x68, height]`
   - Valid range: 1-255 dots
   - Default: 50-100 dots (typical)

4. **Implement barcode width setting**
   - Create `setBarcodeWidth(width: number)` method
   - Send `BARCODE_WIDTH` command `[0x1D, 0x77, width]`
   - Valid range: 2-6 (module width multiplier)
   - Default: 3 (balance of size and scan ability)

5. **Implement HRI text position**
   - Create `setBarcodeTextPosition(position)` method
   - Positions: 'none', 'above', 'below', 'both'
   - Send `BARCODE_TEXT_POSITION` command `[0x1D, 0x48, position]`
   - Default: 'below' (most common)

6. **Implement barcode printing**
   - Create `printBarcode(type: BarcodeType, data: string)` method
   - Validate data format for barcode type
   - Send `BARCODE_PRINT` command `[0x1D, 0x6B, type, length, ...data]`
   - Apply current height, width, text settings

7. **Add barcode type-specific methods**
   - `printCode128(data: string)` - Print Code128 barcode
   - `printEAN13(data: string)` - Print EAN13 barcode
   - `printCode39(data: string)` - Print Code39 barcode
   - Validate data format per type

8. **Implement data validation**
   - Validate barcode data length for type
   - Validate allowed characters for type
   - Check checksum for EAN/UPC types
   - Provide clear error messages for invalid data

9. **Add barcode alignment control**
   - Barcodes respect current alignment setting
   - Center-align recommended for readability
   - Create `printCenteredBarcode(type, data)` convenience method

10. **Implement barcode configuration**
    - Create `BarcodeConfig` interface
    - Include height, width, text position
    - Apply configuration to barcode printing
    - Allow per-barcode or global configuration

11. **Add barcode size presets**
    - `setBarcodeSmall()` - Small barcode (height: 40, width: 2)
    - `setBarcodeNormal()` - Normal barcode (height: 50, width: 3)
    - `setBarcodeLarge()` - Large barcode (height: 80, width: 4)

12. **Create barcode utility methods**
    - `calculateEAN13Checksum(data)` - Calculate EAN13 check digit
    - `validateBarcodeData(type, data)` - Validate data
    - `formatBarcodeData(type, data)` - Auto-format data

### Barcode Command Structure

```
Set Barcode Height:
┌──────────┬──────────┬──────────┐
│  0x1D    │  0x68    │    n     │  GS h n (height in dots)
└──────────┴──────────┴──────────┘

Set Barcode Width:
┌──────────┬──────────┬──────────┐
│  0x1D    │  0x77    │    n     │  GS w n (width 2-6)
└──────────┴──────────┴──────────┘

Set HRI Text Position:
┌──────────┬──────────┬──────────┐
│  0x1D    │  0x48    │    n     │  GS H n (0=none, 1=above, 2=below, 3=both)
└──────────┴──────────┴──────────┘

Print Barcode:
┌──────────┬──────────┬──────────┬──────────┬──────────────┐
│  0x1D    │  0x6B    │   type   │  length  │  data bytes  │
└──────────┴──────────┴──────────┴──────────┴──────────────┘
    GS       k         barcode    data len   data
                      type code
```

### Barcode Type Specifications

| Type | Code | Data Length | Characters | Checksum |
|------|------|-------------|------------|----------|
| UPC-A | 0 | 11-12 | Digits | Required |
| UPC-E | 1 | 6-8 | Digits | Required |
| EAN13 | 2 | 12-13 | Digits | Required |
| EAN8 | 3 | 7-8 | Digits | Required |
| CODE39 | 4 | Variable | A-Z, 0-9, symbols | Optional |
| ITF | 5 | Even length | Digits | Optional |
| CODABAR | 6 | Variable | 0-9, -$:/.+ | Optional |
| CODE93 | 7 | Variable | ASCII | Optional |
| CODE128 | 8 | Variable | ASCII | Automatic |

### Barcode Size Guidelines

```
Height (dots):
┌─────────────────────────────┐
│  Small:   40 dots (5mm)     │  ← Quick scan
│  Normal:  50 dots (6mm)     │  ← Standard
│  Medium:  65 dots (8mm)     │  ← Reliable
│  Large:   80 dots (10mm)    │  ← Distance scan
│  X-Large: 100 dots (12mm)   │  ← High visibility
└─────────────────────────────┘

Width (module multiplier):
┌─────────────────────────────┐
│  2: Compact (0.25mm)        │  ← Dense, harder scan
│  3: Standard (0.375mm)      │  ← Balance (recommended)
│  4: Medium (0.5mm)          │  ← Good scan reliability
│  5: Large (0.625mm)         │  ← High reliability
│  6: X-Large (0.75mm)        │  ← Maximum scan distance
└─────────────────────────────┘
```

### Barcode Visual Examples

```
Small Barcode (height: 40, width: 2):
┌────────────────────────────────┐
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂      │
│ ║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│        REC20240115-00042       │
└────────────────────────────────┘

Normal Barcode (height: 50, width: 3):
┌────────────────────────────────┐
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂     │
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂     │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│        REC20240115-00042       │
└────────────────────────────────┘

Large Barcode (height: 80, width: 4):
┌────────────────────────────────┐
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂   │
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂   │
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂   │
│ ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂   │
│ ║║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║     │
│ ║║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║     │
│        REC20240115-00042       │
└────────────────────────────────┘
```

### HRI Text Position Examples

```
None (position: 0):
┌────────────────────────────────┐
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
└────────────────────────────────┘

Below (position: 2) [Most Common]:
┌────────────────────────────────┐
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│        REC20240115-00042       │
└────────────────────────────────┘

Above (position: 1):
┌────────────────────────────────┐
│        REC20240115-00042       │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
└────────────────────────────────┘

Both (position: 3):
┌────────────────────────────────┐
│        REC20240115-00042       │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│ ║║ ║║║ ║║ ║║║║ ║║║ ║ ║║║      │
│        REC20240115-00042       │
└────────────────────────────────┘
```

### Barcode API Usage Examples

```
Basic Barcode Printing:
  printer.setBarcodeHeight(50)
  printer.setBarcodeWidth(3)
  printer.setBarcodeTextPosition('below')
  printer.printBarcode(BarcodeType.CODE128, 'REC20240115-00042')

Type-Specific Methods:
  printer.printCode128('ORDER-12345')
  printer.printEAN13('1234567890123')
  printer.printCode39('ITEM-ABC-001')

Centered Barcode:
  printer.printCenteredBarcode(BarcodeType.CODE128, 'REC-12345')

With Configuration:
  const config: BarcodeConfig = {
    height: 65,
    width: 3,
    textPosition: 'below'
  }
  printer.printBarcode(BarcodeType.CODE128, data, config)

Size Presets:
  printer.setBarcodeNormal()  // height: 50, width: 3
  printer.printCode128('DATA')
```

### Data Validation Rules

| Type | Validation |
|------|------------|
| CODE128 | Any ASCII, length > 0 |
| EAN13 | Exactly 13 digits, valid checksum |
| CODE39 | A-Z, 0-9, -.$/:+%, length > 0 |
| UPC-A | 11-12 digits, valid checksum |

### Configuration Interface

```typescript
interface BarcodeConfig {
  height: number;           // 1-255 dots
  width: number;            // 2-6 module width
  textPosition: 'none' | 'above' | 'below' | 'both';
  align?: 'left' | 'center' | 'right';
}
```

### Expected Outcome
```
frontend/lib/printing/
└── escpos.ts
    └── Barcode printing methods
        ├── setBarcodeHeight(height)
        ├── setBarcodeWidth(width)
        ├── setBarcodeTextPosition(position)
        ├── printBarcode(type, data, config?)
        ├── printCode128(data)
        ├── printEAN13(data)
        ├── printCode39(data)
        ├── printCenteredBarcode(type, data)
        ├── setBarcodeSmall()
        ├── setBarcodeNormal()
        ├── setBarcodeLarge()
        ├── calculateEAN13Checksum(data)
        ├── validateBarcodeData(type, data)
        └── formatBarcodeData(type, data)
```

### Verification Checklist
- [ ] Barcode printing methods added
- [ ] Barcode type constants defined
- [ ] Height setting method works
- [ ] Width setting method works
- [ ] HRI text position setting works
- [ ] General barcode printing works
- [ ] Type-specific methods functional
- [ ] Data validation implemented
- [ ] Barcode alignment works
- [ ] Configuration interface defined
- [ ] Size presets functional
- [ ] Utility methods work
- [ ] Error handling robust

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create thermal printer service | `ThermalPrinterService` class with buffer management |
| 36 | Define ESC/POS command constants | Complete command constant definitions |
| 37 | Implement text formatting | Bold, underline, size control methods |
| 38 | Implement alignment commands | Left, center, right alignment, multi-column |
| 39 | Implement line spacing | Default, custom, preset spacing methods |
| 40 | Implement paper cutting | Full/partial cut, cut with feed methods |
| 41 | Implement logo printing | Raster graphics, logo storage, Base64 loading |
| 42 | Implement barcode printing | Barcode types, height/width, HRI text |

### Key Components Created
```
frontend/lib/printing/
└── escpos.ts
    ├── ThermalPrinterService class
    ├── ESC/POS command constants
    ├── Text formatting methods
    ├── Alignment control methods
    ├── Line spacing methods
    ├── Paper cutting methods
    ├── Logo printing methods
    └── Barcode printing methods
```

### ESC/POS Commands Implemented

| Category | Commands |
|----------|----------|
| Printer Control | Initialize, Reset |
| Text Formatting | Bold, Underline, Size (Normal, Double-Width, Double-Height) |
| Alignment | Left, Center, Right |
| Line Spacing | Default, Custom spacing |
| Paper Control | Full cut, Partial cut, Feed |
| Graphics | Raster graphics for logos |
| Barcodes | CODE128, EAN13, CODE39, height, width, HRI text |

### Next Steps
1. Proceed to [02_Tasks-43-48_QR-Layout-Renderer.md](02_Tasks-43-48_QR-Layout-Renderer.md) for QR codes and layout formatting
2. Implement layout formatters for 80mm and 58mm paper widths
3. Create the complete thermal print renderer

---

## Notes for AI Agents

1. **Execution Order:** Tasks 35-36 must be completed first; Tasks 37-42 can proceed in parallel afterward
2. **No Code Implementation:** These are instructions only; actual implementation is the developer's responsibility
3. **ESC/POS Standards:** Follow ESC/POS command specification for maximum printer compatibility
4. **Testing Requirements:** Test with actual thermal printers (EPSON TM series recommended)
5. **Buffer Management:** Ensure proper byte buffer handling to prevent memory issues
6. **Error Handling:** Robust error handling is critical for hardware communication
7. **Encoding Support:** UTF-8 support required for international characters and Sri Lankan languages
8. **Logo Optimization:** Optimize logo images for thermal printing (monochrome, appropriate size)
9. **Barcode Validation:** Validate barcode data to prevent print errors
10. **Printer Compatibility:** Test with multiple printer brands for compatibility
