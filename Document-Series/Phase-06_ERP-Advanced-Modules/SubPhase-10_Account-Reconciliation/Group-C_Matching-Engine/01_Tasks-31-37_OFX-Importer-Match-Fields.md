# Tasks 31-37: OFX Importer and Match Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** C - Matching Engine  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Statement-Import/](../Group-B_Statement-Import/)
- **→ Next Document:** [02_Tasks-38-42_MatchingRule-Model.md](02_Tasks-38-42_MatchingRule-Model.md)

---

## Document Overview

This document covers the foundation of the matching engine, including OFX import capability, statement parser factory pattern, configurable CSV column mapping, and match status tracking fields on statement lines. These elements establish the infrastructure for automated transaction matching between bank statements and book entries.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create OFX Importer Service | Medium | 45 min |
| 32 | Create Statement Parser Factory | Low | 20 min |
| 33 | Add Column Mapping Config | Medium | 30 min |
| 34 | Define MatchStatus Enum | Low | 15 min |
| 35 | Add Line Match Status | Low | 10 min |
| 36 | Add Line Matched Entry FK | Low | 15 min |
| 37 | Run Match Fields Migrations | Low | 10 min |

---

## Task 31: Create OFX Importer Service

### Overview
Create an OFX (Open Financial Exchange) importer service to parse standardized bank statement files. OFX is a widely-adopted format used by banks for electronic statement delivery, particularly in international banking systems. This service extends the base importer to handle the OFX file format and transform it into StatementImport and StatementLine objects.

### Dependencies
- Task 30: CSV importer and base importer infrastructure exists
- ofxparse library available for OFX parsing
- StatementImport and StatementLine models exist
- Base importer interface defined

### Instructions

1. **Install OFX parsing library**
   - Add `ofxparse` to project requirements
   - Library provides OFX file format parsing
   - Install version: ofxparse>=0.21

2. **Create OFX importer file**
   - Create `apps/accounting/services/importers/ofx_importer.py`
   - Import necessary modules
   - Import ofxparse library

3. **Import required dependencies**
   - Import base importer class
   - Import StatementImport model
   - Import StatementLine model
   - Import datetime utilities
   - Import decimal utilities
   - Import logging

4. **Define OFXImporter class**
   - Inherit from BaseStatementImporter
   - Add class docstring explaining OFX format
   - Document OFX file structure expectations

5. **Implement get_format_name method**
   - Return 'OFX'
   - Used for format identification
   - Displayed in UI and logs

6. **Implement can_parse method**
   - Accept file content parameter
   - Check for OFX file markers
   - Look for `<OFX>` tag or OFXHEADER signature
   - Return True if OFX format detected
   - Return False otherwise

7. **Implement parse method**
   - Accept file content and statement import ID
   - Parse OFX using ofxparse library
   - Extract account information
   - Extract statement transactions
   - Transform to internal format
   - Create StatementLine records
   - Handle parsing errors gracefully
   - Return success status

8. **Add _extract_account_info method**
   - Parse OFX account details
   - Extract bank ID
   - Extract account ID
   - Extract account type
   - Extract currency
   - Map to statement import fields

9. **Add _parse_transaction method**
   - Convert OFX transaction to StatementLine
   - Map transaction ID to reference_number
   - Map date (DTPOSTED) to transaction_date
   - Map amount to amount field
   - Map MEMO/NAME to description
   - Map FITID to unique_import_id
   - Handle transaction types (DEBIT/CREDIT)

10. **Add _determine_transaction_type method**
    - Analyze OFX TRNTYPE field
    - Map to statement line types
    - DEBIT → withdrawal
    - CREDIT → deposit
    - PAYMENT → payment
    - CASH → cash_withdrawal
    - TRANSFER → transfer
    - Return standardized type

### OFX File Structure

#### SGML Format (Older OFX)
```
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <DTSERVER>20260125120000</DTSERVER>
    </SONRS>
  </SIGNONMSGSRSV1>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>1</TRNUID>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <STMTRS>
        <CURDEF>LKR</CURDEF>
        <BANKACCTFROM>
          <BANKID>123456</BANKID>
          <ACCTID>9876543210</ACCTID>
          <ACCTTYPE>CHECKING</ACCTTYPE>
        </BANKACCTFROM>
        <BANKTRANLIST>
          <DTSTART>20260101120000</DTSTART>
          <DTEND>20260125120000</DTEND>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20260115120000</DTPOSTED>
            <TRNAMT>-15000.00</TRNAMT>
            <FITID>202601151200001</FITID>
            <NAME>Supplier ABC Payment</NAME>
            <MEMO>Invoice INV-001</MEMO>
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>CREDIT</TRNTYPE>
            <DTPOSTED>20260118120000</DTPOSTED>
            <TRNAMT>25000.00</TRNAMT>
            <FITID>202601181200002</FITID>
            <NAME>Customer XYZ</NAME>
            <MEMO>Payment for Order ORD-123</MEMO>
          </STMTTRN>
        </BANKTRANLIST>
        <LEDGERBAL>
          <BALAMT>150000.00</BALAMT>
          <DTASOF>20260125120000</DTASOF>
        </LEDGERBAL>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
```

#### XML Format (Newer OFX)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <DTSERVER>20260125120000</DTSERVER>
    </SONRS>
  </SIGNONMSGSRSV1>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <STMTRS>
        <CURDEF>LKR</CURDEF>
        <BANKACCTFROM>
          <BANKID>123456</BANKID>
          <ACCTID>9876543210</ACCTID>
          <ACCTTYPE>CHECKING</ACCTTYPE>
        </BANKACCTFROM>
        <BANKTRANLIST>
          <DTSTART>20260101</DTSTART>
          <DTEND>20260125</DTEND>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20260115</DTPOSTED>
            <TRNAMT>-15000.00</TRNAMT>
            <FITID>202601151200001</FITID>
            <NAME>Supplier ABC Payment</NAME>
          </STMTTRN>
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
```

### OFX Field Mapping

| OFX Field | StatementLine Field | Description |
|-----------|---------------------|-------------|
| FITID | unique_import_id | Financial Institution Transaction ID |
| DTPOSTED | transaction_date | Transaction posting date |
| TRNAMT | amount | Transaction amount (negative for debits) |
| NAME | description | Payee or transaction name |
| MEMO | description (append) | Additional description |
| CHECKNUM | reference_number | Check number if applicable |
| REFNUM | reference_number | Reference number |
| TRNTYPE | transaction_type | Transaction type mapping |

### OFX Transaction Type Mapping

| OFX TRNTYPE | Statement Type | Description |
|-------------|---------------|-------------|
| CREDIT | deposit | Money received |
| DEBIT | withdrawal | Money paid out |
| INT | interest | Interest earned |
| DIV | dividend | Dividend received |
| FEE | fee | Bank fee charged |
| SRVCHG | fee | Service charge |
| DEP | deposit | Deposit |
| ATM | cash_withdrawal | ATM transaction |
| POS | payment | Point of sale |
| XFER | transfer | Transfer between accounts |
| CHECK | check | Check payment |
| PAYMENT | payment | Electronic payment |
| CASH | cash_withdrawal | Cash withdrawal |
| DIRECTDEP | deposit | Direct deposit |
| DIRECTDEBIT | withdrawal | Direct debit |
| REPEATPMT | payment | Recurring payment |
| OTHER | other | Other transaction type |

### Error Handling

| Error Type | Handling Strategy | User Message |
|------------|------------------|--------------|
| Invalid OFX structure | Log error, return False | "Invalid OFX file format" |
| Missing account info | Log warning, use defaults | "Account information not found" |
| Missing transactions | Log warning, continue | "No transactions found in OFX" |
| Parse exception | Log exception, return False | "Error parsing OFX file" |
| Duplicate FITID | Skip transaction, log warning | "Duplicate transaction ID" |
| Invalid date format | Use current date, log warning | "Invalid date format in OFX" |
| Invalid amount | Skip transaction, log error | "Invalid amount format" |

### Sri Lanka Banking Context

#### Common Sri Lanka Banks Supporting OFX
- Commercial Bank of Ceylon
- Hatton National Bank (HNB)
- Sampath Bank
- Nations Trust Bank (NTB)
- DFCC Bank

#### Sri Lanka OFX Considerations
- Currency: Most use LKR (Sri Lankan Rupee)
- Date Format: Typically YYYYMMDD or YYYYMMDDHHMMSS
- Amount Format: Decimals to 2 places (e.g., 15000.00)
- Character Encoding: UTF-8 for Sinhala/Tamil names
- Time Zone: UTC+5:30 (Sri Lanka Standard Time)

### Expected Outcome
- OFX file parsing capability
- Automatic format detection
- Transaction extraction and mapping
- Support for both SGML and XML OFX formats
- Error-resilient parsing
- Sri Lanka bank compatibility

### Verification Checklist
- [ ] OFXImporter class created
- [ ] Inherits from BaseStatementImporter
- [ ] get_format_name returns 'OFX'
- [ ] can_parse detects OFX format
- [ ] parse method extracts account info
- [ ] parse method creates statement lines
- [ ] Transaction type mapping implemented
- [ ] Error handling implemented
- [ ] ofxparse library integrated
- [ ] Handles both SGML and XML formats

---

## Task 32: Create Statement Parser Factory

### Overview
Create a factory pattern implementation that automatically selects the appropriate statement parser (CSV or OFX) based on file content analysis. The factory provides a clean abstraction layer for format detection and parser instantiation, allowing easy addition of new formats in the future.

### Dependencies
- Task 30: CSV importer exists
- Task 31: OFX importer exists
- Base importer interface defined

### Instructions

1. **Create factory file**
   - Create `apps/accounting/services/importers/factory.py`
   - Import all available importers
   - Import base importer class

2. **Import required modules**
   - Import CSVImporter
   - Import OFXImporter
   - Import BaseStatementImporter
   - Import typing hints
   - Import logging

3. **Define StatementParserFactory class**
   - Static class or module-level functions
   - Add class docstring explaining factory pattern
   - Document format detection logic

4. **Add REGISTERED_PARSERS list**
   - List of all available parser classes
   - Order matters: check in sequence
   - Add CSVImporter
   - Add OFXImporter
   - Extensible for future formats

5. **Implement get_parser method**
   - Accept file content parameter
   - Accept optional format hint parameter
   - Iterate through registered parsers
   - Call can_parse on each parser
   - Return first matching parser instance
   - Raise exception if no parser matches

6. **Implement get_parser_by_name method**
   - Accept format name parameter ('CSV', 'OFX')
   - Find parser by format name
   - Return parser instance
   - Raise exception if not found

7. **Implement get_available_formats method**
   - Return list of supported format names
   - Query all registered parsers
   - Return format names list
   - Used for UI display

8. **Add _try_parse method**
   - Safe parser detection wrapper
   - Catch exceptions during can_parse
   - Return False on exception
   - Log parser errors

### Factory Pattern Structure

```
┌─────────────────────────────────────────────────┐
│         StatementParserFactory                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  REGISTERED_PARSERS                       │ │
│  │  - CSVImporter                            │ │
│  │  - OFXImporter                            │ │
│  │  - [Future: MT940Importer]                │ │
│  │  - [Future: QIFImporter]                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Methods:                                       │
│  - get_parser(file_content) → Parser          │
│  - get_parser_by_name(name) → Parser          │
│  - get_available_formats() → List[str]        │
└─────────────────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
    ┌───────────────┐       ┌───────────────┐
    │  CSVImporter  │       │  OFXImporter  │
    │               │       │               │
    │ can_parse()   │       │ can_parse()   │
    │ parse()       │       │ parse()       │
    └───────────────┘       └───────────────┘
```

### Format Detection Flow

```
User uploads statement file
        │
        ▼
┌──────────────────────────┐
│ Factory.get_parser()     │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ Read file content        │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ Try CSVImporter          │
│ .can_parse()             │
└──────────────────────────┘
        │
    ┌───┴──────────┐
    │ Yes          │ No
    ▼              ▼
Return CSV   Try OFXImporter
Importer     .can_parse()
                   │
              ┌────┴──────────┐
              │ Yes           │ No
              ▼               ▼
          Return OFX     Raise Exception
          Importer       "Unsupported format"
```

### Factory Usage Example

#### Automatic Format Detection
```
File Upload → Factory detects format → Parser selected → Import processed
```

#### Manual Format Selection
```
User selects format → Factory retrieves parser → Import processed
```

### Format Detection Priority

| Priority | Format | Detection Method |
|----------|--------|-----------------|
| 1 | OFX | Check for OFX markers first (more specific) |
| 2 | CSV | Check for CSV structure (more common) |
| 3 | Future formats | Add to end of list |

### Error Scenarios

| Scenario | Factory Behavior | User Message |
|----------|-----------------|--------------|
| No matching format | Raise ValueError | "Unsupported file format" |
| Multiple formats match | Return first match | Process with first parser |
| Parser initialization fails | Log error, continue | Try next parser |
| Empty file | Raise ValueError | "Empty file uploaded" |
| Corrupted file | No parser matches | "Invalid file format" |

### Future Format Extensibility

#### Adding New Format
1. Create new importer class (e.g., MT940Importer)
2. Implement BaseStatementImporter interface
3. Add to REGISTERED_PARSERS list
4. No changes to factory logic needed

#### Planned Future Formats
- MT940 (SWIFT standard)
- BAI2 (Cash Management Balance Reporting)
- QIF (Quicken Interchange Format)
- CAMT.053 (ISO 20022 XML)

### Expected Outcome
- Automatic format detection
- Clean parser selection abstraction
- Extensible architecture
- Support for format hints
- List of available formats
- Error handling for unsupported formats

### Verification Checklist
- [ ] StatementParserFactory class created
- [ ] REGISTERED_PARSERS list defined
- [ ] get_parser method implemented
- [ ] get_parser_by_name method implemented
- [ ] get_available_formats method implemented
- [ ] CSV parser registered
- [ ] OFX parser registered
- [ ] Format detection works automatically
- [ ] Error handling for unsupported formats
- [ ] Logging for factory operations

---

## Task 33: Add Column Mapping Config

### Overview
Add a configurable column mapping system to the StatementImport model that allows users to map CSV columns to standard statement line fields. This flexibility accommodates various bank CSV formats without code changes, as different banks use different column names and orders. The mapping configuration is stored as JSON and applied during import processing.

### Dependencies
- Task 30: StatementImport model exists
- Task 32: Parser factory exists
- Django JSONField available

### Instructions

1. **Open StatementImport model file**
   - Navigate to `apps/accounting/models/statement_import.py`
   - Locate StatementImport model class

2. **Import JSONField**
   - Import Django JSONField
   - Ensure compatibility with database backend
   - PostgreSQL recommended for JSON support

3. **Add column_mapping field**
   - JSONField type
   - Default to empty dict
   - Blank and null allowed
   - Stores CSV column name mappings

4. **Add field docstring**
   - Explain column mapping purpose
   - Provide example mapping structure
   - Note format flexibility

5. **Define DEFAULT_COLUMN_MAPPING constant**
   - Module-level constant
   - Dictionary of standard mappings
   - Used as fallback if not specified
   - Include common column names

6. **Add get_column_mapping method**
   - Return column_mapping if set
   - Otherwise return DEFAULT_COLUMN_MAPPING
   - Merge custom with defaults
   - Handle missing fields gracefully

7. **Add validate_column_mapping method**
   - Check required fields present
   - Validate field names
   - Return validation errors list
   - Used before import processing

8. **Update CSV importer**
   - Use column_mapping from StatementImport
   - Apply mapping during parsing
   - Look up column names dynamically
   - Handle case variations

### Column Mapping Structure

```json
{
  "date": "Transaction Date",
  "description": "Description",
  "amount": "Amount",
  "reference": "Reference Number",
  "balance": "Running Balance",
  "debit": "Debit",
  "credit": "Credit"
}
```

### Mapping Field Definitions

| Mapping Key | Purpose | Required | Examples |
|------------|---------|----------|----------|
| date | Transaction date column | Yes | "Date", "Transaction Date", "Posted Date" |
| description | Transaction description | Yes | "Description", "Narration", "Details" |
| amount | Single amount column | No* | "Amount", "Value" |
| debit | Debit amount column | No* | "Debit", "Withdrawal", "Dr" |
| credit | Credit amount column | No* | "Credit", "Deposit", "Cr" |
| reference | Reference/check number | No | "Reference", "Cheque No", "Ref" |
| balance | Running balance | No | "Balance", "Running Balance" |

*Either `amount` OR both `debit`/`credit` required

### Default Column Mappings

#### Standard Mapping (Single Amount Column)
```json
{
  "date": "Date",
  "description": "Description",
  "amount": "Amount",
  "reference": "Reference",
  "balance": "Balance"
}
```

#### Debit/Credit Mapping (Separate Columns)
```json
{
  "date": "Date",
  "description": "Description",
  "debit": "Debit",
  "credit": "Credit",
  "reference": "Reference",
  "balance": "Balance"
}
```

### Bank-Specific Mapping Examples

#### Commercial Bank of Ceylon
```json
{
  "date": "Transaction Date",
  "description": "Narration",
  "debit": "Withdrawal",
  "credit": "Deposit",
  "reference": "Cheque No",
  "balance": "Running Balance"
}
```

#### Hatton National Bank
```json
{
  "date": "Value Date",
  "description": "Description",
  "amount": "Amount",
  "reference": "Reference No",
  "balance": "Balance"
}
```

#### Sampath Bank
```json
{
  "date": "Posted Date",
  "description": "Transaction Details",
  "debit": "Dr Amount",
  "credit": "Cr Amount",
  "reference": "Document No",
  "balance": "Book Balance"
}
```

#### Nations Trust Bank
```json
{
  "date": "Txn Date",
  "description": "Particulars",
  "debit": "Debit (LKR)",
  "credit": "Credit (LKR)",
  "reference": "Ref No",
  "balance": "Balance (LKR)"
}
```

### Column Mapping Validation

#### Required Field Checks
```
Validation Rules:
1. Must have "date" mapping
2. Must have "description" mapping
3. Must have EITHER:
   a. "amount" mapping, OR
   b. Both "debit" AND "credit" mappings
4. All mapped columns must exist in CSV
5. No duplicate target fields
```

#### Validation Error Examples

| Error Type | Example | Resolution |
|-----------|---------|------------|
| Missing required field | No "date" mapping | Add date column mapping |
| Missing amount fields | No amount/debit/credit | Add amount or debit+credit |
| Invalid column name | Mapped column not in CSV | Update column name |
| Duplicate mapping | Two columns map to "date" | Remove duplicate |
| Empty mapping | column_mapping is null/empty | Use default mapping |

### Column Mapping UI Workflow

```
1. User uploads CSV file
        │
        ▼
2. System reads first row (headers)
        │
        ▼
3. Display column mapping interface
   ┌──────────────────────────────┐
   │ CSV Column    → System Field │
   ├──────────────────────────────┤
   │ Date          → date         │
   │ Description   → description  │
   │ Debit         → debit        │
   │ Credit        → credit       │
   │ Cheque No     → reference    │
   │ Balance       → balance      │
   └──────────────────────────────┘
        │
        ▼
4. User confirms or adjusts mappings
        │
        ▼
5. Save mapping to StatementImport
        │
        ▼
6. Process import with mapping
```

### Mapping Intelligence Features

#### Auto-Detection
- Match common column name patterns
- Case-insensitive matching
- Fuzzy matching for variations
- Smart defaults based on position

#### Pattern Matching Examples
```
Date patterns: "date", "txn date", "transaction date", "value date", "posted"
Description patterns: "description", "narration", "details", "particulars"
Amount patterns: "amount", "value", "transaction amount"
Debit patterns: "debit", "dr", "withdrawal", "out"
Credit patterns: "credit", "cr", "deposit", "in"
Reference patterns: "reference", "ref", "cheque no", "check no", "doc no"
Balance patterns: "balance", "running balance", "book balance"
```

### Sri Lanka Banking Considerations

#### Common Column Name Variations
- **Date:** "Transaction Date", "Value Date", "Posted Date", "Txn Date"
- **Description:** "Narration", "Particulars", "Transaction Details", "Details"
- **Debit:** "Withdrawal", "Dr Amount", "Debit (LKR)", "Out"
- **Credit:** "Deposit", "Cr Amount", "Credit (LKR)", "In"
- **Reference:** "Cheque No", "Reference No", "Ref No", "Document No"
- **Balance:** "Running Balance", "Book Balance", "Balance (LKR)"

#### Currency Notation
- Some banks include "(LKR)" in column names
- Remove currency notation during mapping
- Validate amounts are numeric

### Expected Outcome
- Flexible CSV column mapping
- Configurable per import
- Default mappings for common formats
- Column validation before processing
- Support for diverse bank formats
- Auto-detection of column mappings

### Verification Checklist
- [ ] column_mapping field added to model
- [ ] JSONField type used
- [ ] DEFAULT_COLUMN_MAPPING defined
- [ ] get_column_mapping method implemented
- [ ] validate_column_mapping method implemented
- [ ] CSV importer uses column mapping
- [ ] Required fields validated
- [ ] Support for single amount column
- [ ] Support for debit/credit columns
- [ ] Bank-specific examples documented

---

## Task 34: Define MatchStatus Enum

### Overview
Define a MatchStatus enumeration to represent the matching state of statement lines. This enum provides a clear, type-safe way to track whether a bank transaction has been matched to a book entry, is partially matched, remains unmatched, or has been explicitly excluded from reconciliation.

### Dependencies
- Task 33: Statement import infrastructure exists
- Django-based enum implementation
- Python enum module

### Instructions

1. **Open enums file**
   - Navigate to `apps/accounting/models/enums.py`
   - Or create file if it doesn't exist

2. **Import required modules**
   - Import Django models.TextChoices
   - Import gettext_lazy for translations
   - Import typing hints

3. **Define MatchStatus enum class**
   - Inherit from models.TextChoices
   - Add class docstring explaining purpose
   - Document each status value

4. **Add UNMATCHED status**
   - Value: 'unmatched'
   - Label: "Unmatched"
   - Default status for new lines
   - Not yet matched to any book entry

5. **Add MATCHED status**
   - Value: 'matched'
   - Label: "Matched"
   - Successfully matched to journal entry
   - One-to-one match found

6. **Add PARTIAL status**
   - Value: 'partial'
   - Label: "Partial"
   - Partially matched (split transaction)
   - Multiple entries match part of amount

7. **Add EXCLUDED status**
   - Value: 'excluded'
   - Label: "Excluded"
   - Explicitly excluded by user
   - Not included in reconciliation
   - Used for internal transfers, corrections

8. **Add helper class methods**
   - get_default() returns UNMATCHED
   - get_reconcilable() returns [MATCHED, PARTIAL]
   - get_actionable() returns [UNMATCHED, PARTIAL]

9. **Add color coding constants**
   - Define UI color associations
   - UNMATCHED: Yellow/warning
   - MATCHED: Green/success
   - PARTIAL: Blue/info
   - EXCLUDED: Gray/muted

10. **Update models/__init__.py**
    - Import MatchStatus
    - Add to __all__ list

### Match Status Values

| Status | Value | Database | Description | Use Case |
|--------|-------|----------|-------------|----------|
| UNMATCHED | 'unmatched' | unmatched | Not matched yet | New imports, pending review |
| MATCHED | 'matched' | matched | Successfully matched | Fully reconciled transactions |
| PARTIAL | 'partial' | partial | Partially matched | Split transactions, complex matches |
| EXCLUDED | 'excluded' | excluded | Excluded from matching | Internal transfers, corrections |

### Match Status State Diagram

```
┌─────────────┐
│  UNMATCHED  │ ← Initial state
└─────────────┘
       │
       │ Auto-match found
       │ OR manual match
       │
   ┌───┴────────────────┐
   │                    │
   ▼                    ▼
┌────────┐         ┌─────────┐
│MATCHED │         │ PARTIAL │
└────────┘         └─────────┘
   │                    │
   │ Unmatch            │ Complete match
   │                    │
   └────────┬───────────┘
            │
            ▼
      ┌─────────────┐
      │  UNMATCHED  │
      └─────────────┘
            │
            │ User excludes
            ▼
      ┌──────────┐
      │ EXCLUDED │
      └──────────┘
```

### Status Transition Rules

| From Status | To Status | Trigger | Business Rule |
|------------|-----------|---------|---------------|
| UNMATCHED | MATCHED | Auto/manual match found | Complete one-to-one match |
| UNMATCHED | PARTIAL | Partial match found | Multiple entries, split transaction |
| UNMATCHED | EXCLUDED | User action | Mark as internal/error |
| MATCHED | UNMATCHED | Unmatch action | Remove match, needs review |
| PARTIAL | MATCHED | Complete partial matches | All parts matched |
| PARTIAL | UNMATCHED | Unmatch action | Remove all partial matches |
| EXCLUDED | UNMATCHED | User action | Include back in matching |
| MATCHED | EXCLUDED | User action (rare) | Matched but exclude from reconciliation |

### Match Status UI Indicators

#### Status Badge Colors
```
┌─────────────────────────────────────────────┐
│ Statement Lines List                        │
├─────────────────────────────────────────────┤
│ 2026-01-15  Supplier ABC   -15000  🟡 UNMATCHED │
│ 2026-01-16  Customer XYZ   +25000  🟢 MATCHED   │
│ 2026-01-17  Bank Fee       -500    🔵 PARTIAL   │
│ 2026-01-18  Internal Transfer -10000 ⚪ EXCLUDED │
└─────────────────────────────────────────────┘
```

#### Color Coding
- 🟡 UNMATCHED: #FFC107 (Amber) - Needs attention
- 🟢 MATCHED: #4CAF50 (Green) - Complete
- 🔵 PARTIAL: #2196F3 (Blue) - In progress
- ⚪ EXCLUDED: #9E9E9E (Gray) - Not applicable

### Filtering and Reporting

#### Common Filters
```
Show all unmatched lines:
  WHERE match_status = 'unmatched'

Show reconcilable lines:
  WHERE match_status IN ('matched', 'partial')

Show lines needing action:
  WHERE match_status IN ('unmatched', 'partial')

Show excluded lines:
  WHERE match_status = 'excluded'

Show all except excluded:
  WHERE match_status != 'excluded'
```

#### Reconciliation Metrics
```
Reconciliation Dashboard:
─────────────────────────────
Total Lines:        150
Matched:            120 (80%)
Partial:            15  (10%)
Unmatched:          10  (7%)
Excluded:           5   (3%)
─────────────────────────────
Reconcilable:       135 (90%)
Needs Review:       25  (17%)
```

### Business Logic Examples

#### Complete Match Scenario
```
Statement Line: +10,000 LKR (2026-01-15)
Book Entry: +10,000 LKR (2026-01-15)
Result: Status → MATCHED
```

#### Partial Match Scenario
```
Statement Line: +15,000 LKR (2026-01-15)
Book Entries:
  - Invoice A: +10,000 LKR (2026-01-15)
  - Invoice B: +5,000 LKR (2026-01-15)
Result: Status → PARTIAL
```

#### Excluded Scenario
```
Statement Line: -10,000 LKR "Transfer to Savings"
User Action: Mark as internal transfer
Result: Status → EXCLUDED
Reason: Not a business transaction
```

### Sri Lanka Banking Context

#### Common Exclusion Reasons
- Internal transfers between company accounts
- Bank corrections or reversals
- Duplicate transactions (bank error)
- Test transactions
- Currency conversion entries

#### Partial Match Use Cases
- Customer pays multiple invoices in one transaction
- Supplier payment splits across multiple bills
- Payment with partial discount applied
- Foreign currency transactions with fees

### Expected Outcome
- Clear match status enumeration
- Type-safe status values
- UI-friendly labels
- State transition support
- Filtering capabilities
- Reporting foundation

### Verification Checklist
- [ ] MatchStatus class created
- [ ] Inherits from models.TextChoices
- [ ] UNMATCHED status defined
- [ ] MATCHED status defined
- [ ] PARTIAL status defined
- [ ] EXCLUDED status defined
- [ ] Helper methods added
- [ ] Color coding documented
- [ ] Translation support included
- [ ] Enum imported in models/__init__.py

---

## Task 35: Add Line Match Status

### Overview
Add the match_status field to the StatementLine model to track the matching state of each imported bank transaction. This field uses the MatchStatus enum and provides the foundation for filtering, reporting, and workflow management in the reconciliation process.

### Dependencies
- Task 34: MatchStatus enum defined
- StatementLine model exists
- Django model field updates

### Instructions

1. **Open StatementLine model file**
   - Navigate to `apps/accounting/models/statement_line.py`
   - Locate StatementLine model class

2. **Import MatchStatus enum**
   - Add import from enums module
   - Ensure enum is available

3. **Add match_status field**
   - CharField field type
   - Max length: 20 characters
   - Choices: MatchStatus.choices
   - Default: MatchStatus.UNMATCHED
   - Not null (required field)
   - Add db_index=True for query performance

4. **Add field docstring**
   - Explain field purpose
   - Reference MatchStatus enum
   - Document default behavior
   - Note indexing for performance

5. **Add match_status_changed_at field**
   - DateTimeField type
   - Auto-updated when status changes
   - Null allowed initially
   - Tracks last status change time

6. **Add match_status_changed_by field**
   - ForeignKey to User model
   - Null allowed (auto-matches have no user)
   - Records who changed status
   - On delete: SET_NULL

7. **Override save method**
   - Detect match_status changes
   - Update match_status_changed_at
   - Update match_status_changed_by
   - Call parent save

8. **Add is_matched property**
   - Return True if status is MATCHED
   - Convenience method for templates
   - Boolean result

9. **Add is_reconcilable property**
   - Return True if MATCHED or PARTIAL
   - Indicates line counts in reconciliation
   - Boolean result

10. **Add is_actionable property**
    - Return True if UNMATCHED or PARTIAL
    - Indicates line needs attention
    - Boolean result

11. **Add get_status_display_color method**
    - Return CSS color class for status
    - Maps status to UI colors
    - Used in templates

12. **Update model Meta class**
    - Add index on match_status field
    - Add index on (statement_import, match_status)
    - Optimize common queries

### Field Specifications

| Field Name | Type | Constraints | Purpose |
|------------|------|-------------|---------|
| match_status | CharField | max_length=20, choices, indexed | Current match status |
| match_status_changed_at | DateTimeField | null=True | Last status change timestamp |
| match_status_changed_by | ForeignKey(User) | null=True, SET_NULL | User who changed status |

### Database Schema

```sql
ALTER TABLE accounting_statementline
ADD COLUMN match_status VARCHAR(20) NOT NULL DEFAULT 'unmatched',
ADD COLUMN match_status_changed_at TIMESTAMP NULL,
ADD COLUMN match_status_changed_by_id INTEGER NULL,
ADD CONSTRAINT fk_match_status_user
    FOREIGN KEY (match_status_changed_by_id)
    REFERENCES auth_user(id) ON DELETE SET NULL;

CREATE INDEX idx_statementline_match_status
    ON accounting_statementline(match_status);

CREATE INDEX idx_statementline_import_status
    ON accounting_statementline(statement_import_id, match_status);
```

### Query Performance Optimization

#### Indexed Queries (Fast)
```sql
-- Get all unmatched lines
SELECT * FROM accounting_statementline
WHERE match_status = 'unmatched';

-- Get lines for specific import by status
SELECT * FROM accounting_statementline
WHERE statement_import_id = 123
  AND match_status = 'unmatched';
```

#### Common Query Patterns
```python
# Get unmatched lines
StatementLine.objects.filter(match_status=MatchStatus.UNMATCHED)

# Get matched lines
StatementLine.objects.filter(match_status=MatchStatus.MATCHED)

# Get lines needing action
StatementLine.objects.filter(
    match_status__in=[MatchStatus.UNMATCHED, MatchStatus.PARTIAL]
)

# Get reconcilable lines
StatementLine.objects.exclude(match_status=MatchStatus.EXCLUDED)
```

### Status Change Tracking

#### Audit Trail Example
```
Line: #12345 - Customer XYZ Payment +25,000
─────────────────────────────────────────────────
Status History:
1. 2026-01-15 10:00 - UNMATCHED (System - Import)
2. 2026-01-15 14:30 - MATCHED (User: john@example.com)
3. 2026-01-16 09:15 - UNMATCHED (User: jane@example.com - Incorrect match)
4. 2026-01-16 11:45 - MATCHED (System - Auto-match)
```

#### Status Change Log Data
```python
{
    'line_id': 12345,
    'previous_status': 'unmatched',
    'new_status': 'matched',
    'changed_at': '2026-01-15T14:30:00Z',
    'changed_by': 'john@example.com',
    'method': 'manual'
}
```

### Reconciliation Dashboard Queries

#### Status Summary Query
```python
from django.db.models import Count

status_summary = StatementLine.objects.filter(
    statement_import__bank_account=account
).values('match_status').annotate(
    count=Count('id')
).order_by('match_status')

# Result:
# [
#   {'match_status': 'matched', 'count': 120},
#   {'match_status': 'unmatched', 'count': 10},
#   {'match_status': 'partial', 'count': 15},
#   {'match_status': 'excluded', 'count': 5}
# ]
```

#### Completion Percentage
```python
total = StatementLine.objects.filter(statement_import=import_obj).count()
matched = StatementLine.objects.filter(
    statement_import=import_obj,
    match_status=MatchStatus.MATCHED
).count()

completion = (matched / total * 100) if total > 0 else 0
# "80% reconciled"
```

### Property Methods Usage

#### Template Usage Examples
```django
{% for line in statement_lines %}
<tr class="{{ line.get_status_display_color }}">
    <td>{{ line.transaction_date }}</td>
    <td>{{ line.description }}</td>
    <td>{{ line.amount }}</td>
    <td>
        {% if line.is_matched %}
            <span class="badge badge-success">Matched</span>
        {% elif line.is_actionable %}
            <span class="badge badge-warning">Needs Action</span>
        {% else %}
            <span class="badge badge-secondary">{{ line.get_match_status_display }}</span>
        {% endif %}
    </td>
</tr>
{% endfor %}
```

#### API Response Example
```json
{
    "id": 12345,
    "transaction_date": "2026-01-15",
    "description": "Customer XYZ Payment",
    "amount": "25000.00",
    "match_status": "matched",
    "is_matched": true,
    "is_reconcilable": true,
    "is_actionable": false,
    "match_status_changed_at": "2026-01-15T14:30:00Z",
    "match_status_changed_by": {
        "id": 42,
        "email": "john@example.com",
        "name": "John Doe"
    }
}
```

### Expected Outcome
- Match status tracking on every line
- Audit trail for status changes
- Query performance optimization
- Convenient property methods
- Dashboard-ready data structure

### Verification Checklist
- [ ] match_status field added
- [ ] Uses MatchStatus enum choices
- [ ] Default is UNMATCHED
- [ ] Field is indexed
- [ ] match_status_changed_at field added
- [ ] match_status_changed_by field added
- [ ] save method overridden
- [ ] is_matched property implemented
- [ ] is_reconcilable property implemented
- [ ] is_actionable property implemented
- [ ] get_status_display_color method added
- [ ] Indexes created in Meta

---

## Task 36: Add Line Matched Entry FK

### Overview
Add a foreign key relationship from StatementLine to JournalEntry to record which book entry a bank transaction has been matched to. This creates the bidirectional link needed for reconciliation, allowing navigation from bank transactions to accounting entries and vice versa. The relationship supports both single matches and partial matches through a nullable foreign key.

### Dependencies
- Task 35: Match status field exists
- JournalEntry model exists
- StatementLine model exists

### Instructions

1. **Open StatementLine model file**
   - Navigate to `apps/accounting/models/statement_line.py`
   - Locate StatementLine model class

2. **Import JournalEntry model**
   - Add import from accounting models
   - Ensure model is available

3. **Add matched_journal_entry field**
   - ForeignKey to JournalEntry model
   - Null allowed (not all lines matched)
   - Blank allowed (optional)
   - On delete: SET_NULL (preserve history)
   - Related name: 'matched_statement_lines'
   - Add db_index=True

4. **Add field docstring**
   - Explain field purpose
   - Note null for unmatched lines
   - Document relationship semantics
   - Note partial match handling

5. **Add matched_by field**
   - ForeignKey to User model
   - Null allowed (auto-matches)
   - Records who created match
   - On delete: SET_NULL
   - Related name: 'statement_matches_created'

6. **Add matched_at field**
   - DateTimeField type
   - Auto-updated on match
   - Null allowed initially
   - Tracks match creation time

7. **Add match_confidence field**
   - DecimalField type
   - Range: 0.00 to 1.00
   - Null allowed (manual matches)
   - Indicates auto-match confidence
   - Default: None

8. **Add match_method field**
   - CharField with choices
   - Values: 'manual', 'exact', 'fuzzy', 'reference'
   - Records how match was created
   - Default: 'manual'

9. **Add match_notes field**
   - TextField type
   - Null and blank allowed
   - Optional notes about match
   - User-entered or system-generated

10. **Add match method**
    - Accept journal_entry parameter
    - Accept user parameter (optional)
    - Accept method parameter
    - Set matched_journal_entry
    - Update match_status to MATCHED
    - Set matched_at timestamp
    - Set matched_by user
    - Record match_method
    - Save changes

11. **Add unmatch method**
    - Clear matched_journal_entry
    - Set match_status to UNMATCHED
    - Clear matched_at
    - Clear matched_by
    - Clear match_confidence
    - Add audit log entry
    - Save changes

12. **Add can_match validation method**
    - Check if line is matchable
    - Verify not already matched
    - Verify not excluded
    - Return boolean and reason

13. **Update model Meta class**
    - Add index on matched_journal_entry
    - Add index on (statement_import, matched_journal_entry)
    - Add index on matched_at

### Field Specifications

| Field Name | Type | Constraints | Purpose |
|------------|------|-------------|---------|
| matched_journal_entry | ForeignKey(JournalEntry) | null=True, SET_NULL | Link to matched book entry |
| matched_by | ForeignKey(User) | null=True, SET_NULL | User who created match |
| matched_at | DateTimeField | null=True | Match creation timestamp |
| match_confidence | DecimalField | max_digits=5, decimal_places=2, null=True | Auto-match confidence score |
| match_method | CharField | max_length=20, choices | How match was created |
| match_notes | TextField | null=True, blank=True | Additional match information |

### Match Method Choices

| Value | Display Name | Description |
|-------|-------------|-------------|
| manual | Manual Match | User selected match |
| exact | Exact Match | Auto-matched exact amount/date |
| fuzzy | Fuzzy Match | Auto-matched with tolerance |
| reference | Reference Match | Matched by reference number |
| batch | Batch Auto-Match | Batch processing match |

### Relationship Diagram

```
┌───────────────────────┐         ┌──────────────────────┐
│   StatementLine       │         │   JournalEntry       │
├───────────────────────┤         ├──────────────────────┤
│ id                    │         │ id                   │
│ statement_import      │         │ date                 │
│ transaction_date      │         │ reference            │
│ description           │         │ total_debit          │
│ amount                │         │ total_credit         │
│ match_status          │         │ is_reconciled        │
│ matched_journal_entry │────────▶│                      │
│ matched_by            │         │                      │
│ matched_at            │         │                      │
│ match_confidence      │         │                      │
│ match_method          │         │                      │
└───────────────────────┘         └──────────────────────┘
```

### Reverse Relationship Access

```python
# From StatementLine to JournalEntry
statement_line = StatementLine.objects.get(id=123)
journal_entry = statement_line.matched_journal_entry

# From JournalEntry to StatementLines
journal_entry = JournalEntry.objects.get(id=456)
matched_lines = journal_entry.matched_statement_lines.all()

# Typical use: One journal entry matched to one statement line
# Special case: One journal entry matched to multiple lines (split deposit)
```

### Match Method Usage

#### Manual Match
```python
# User selects journal entry for statement line
statement_line.match(
    journal_entry=selected_entry,
    user=request.user,
    method='manual',
    notes='Verified invoice number matches'
)
```

#### Auto Exact Match
```python
# System finds exact match
statement_line.match(
    journal_entry=matched_entry,
    method='exact',
    confidence=1.00
)
```

#### Auto Fuzzy Match
```python
# System finds match within tolerance
statement_line.match(
    journal_entry=matched_entry,
    method='fuzzy',
    confidence=0.95,
    notes='Amount within tolerance: 0.50 difference'
)
```

#### Reference Match
```python
# Matched by check/reference number
statement_line.match(
    journal_entry=matched_entry,
    method='reference',
    confidence=1.00,
    notes='Check number: CHQ001234'
)
```

### Unmatch Workflow

```
User clicks "Unmatch" on matched line
        │
        ▼
┌──────────────────────────┐
│ Confirm unmatch dialog   │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│ statement_line.unmatch() │
└──────────────────────────┘
        │
        ├─→ Clear matched_journal_entry
        ├─→ Set status to UNMATCHED
        ├─→ Clear matched_at
        ├─→ Clear matched_by
        ├─→ Log audit entry
        │
        ▼
┌──────────────────────────┐
│ Line ready for rematch   │
└──────────────────────────┘
```

### Match Confidence Interpretation

| Confidence Range | Interpretation | Action |
|-----------------|---------------|---------|
| 1.00 | Perfect match | Auto-match |
| 0.95 - 0.99 | Very high confidence | Auto-match |
| 0.80 - 0.94 | High confidence | Suggest for review |
| 0.60 - 0.79 | Medium confidence | Flag for manual review |
| 0.00 - 0.59 | Low confidence | Do not auto-match |
| null | Manual match | No confidence score |

### Database Queries

#### Get All Matched Lines
```sql
SELECT sl.*, je.reference, je.date
FROM accounting_statementline sl
INNER JOIN accounting_journalentry je
    ON sl.matched_journal_entry_id = je.id
WHERE sl.match_status = 'matched';
```

#### Get Unmatched Lines with Potential Matches
```sql
SELECT sl.id, sl.amount, sl.description,
       je.id as potential_match_id,
       je.reference,
       ABS(sl.amount - je.total_debit) as amount_diff
FROM accounting_statementline sl
LEFT JOIN accounting_journalentry je
    ON ABS(sl.amount - je.total_debit) < 10.00
    AND ABS(DATE_PART('day', sl.transaction_date - je.date)) <= 3
WHERE sl.match_status = 'unmatched'
  AND je.is_reconciled = false
ORDER BY amount_diff;
```

#### Match History Report
```python
matches = StatementLine.objects.filter(
    match_status=MatchStatus.MATCHED,
    matched_at__gte=start_date,
    matched_at__lte=end_date
).select_related(
    'matched_journal_entry',
    'matched_by'
).values(
    'matched_at',
    'match_method',
    'match_confidence',
    'matched_by__email'
)
```

### Sri Lanka Banking Context

#### Common Match Scenarios

**Exact Match - Invoice Payment**
```
Statement: 2026-01-15, "Customer ABC", +50,000 LKR
Book Entry: 2026-01-15, Invoice #INV-001, +50,000 LKR
Match: Exact (confidence: 1.00)
```

**Fuzzy Match - Bank Fee Difference**
```
Statement: 2026-01-15, "Supplier XYZ", -49,950 LKR
Book Entry: 2026-01-15, Bill #BILL-456, -50,000 LKR
Difference: -50 LKR (bank charges)
Match: Fuzzy (confidence: 0.98)
```

**Reference Match - Check Payment**
```
Statement: 2026-01-16, "Check 001234", -25,000 LKR
Book Entry: 2026-01-14, Check #001234, -25,000 LKR
Match: Reference (confidence: 1.00)
Note: Date differs by 2 days (clearing time)
```

**No Match - Internal Transfer**
```
Statement: 2026-01-17, "Transfer to Savings", -100,000 LKR
Book Entry: None (internal transfer)
Action: Mark as EXCLUDED
```

### Expected Outcome
- Foreign key link to journal entries
- Match metadata (who, when, how)
- Match confidence tracking
- Match/unmatch methods
- Reverse relationship navigation
- Audit trail support

### Verification Checklist
- [ ] matched_journal_entry field added
- [ ] ForeignKey to JournalEntry
- [ ] Null and blank allowed
- [ ] Related name set
- [ ] matched_by field added
- [ ] matched_at field added
- [ ] match_confidence field added
- [ ] match_method field added
- [ ] match_notes field added
- [ ] match() method implemented
- [ ] unmatch() method implemented
- [ ] can_match() validation method added
- [ ] Indexes added to Meta

---

## Task 37: Run Match Fields Migrations

### Overview
Create and execute Django migrations to add the match-related fields to the StatementLine model in the database. This task generates migration files for the MatchStatus enum, match_status field, matched_journal_entry foreign key, and all related match tracking fields, then applies them to the database schema.

### Dependencies
- Task 34: MatchStatus enum defined
- Task 35: Match status field added to model
- Task 36: Matched entry FK added to model
- Django migrations framework configured
- Database connection available

### Instructions

1. **Review model changes**
   - Open StatementLine model file
   - Verify all new fields present
   - Check field definitions
   - Confirm imports correct

2. **Check for pending migrations**
   - Run `python manage.py showmigrations accounting`
   - Identify any unapplied migrations
   - Note migration dependencies

3. **Generate migrations**
   - Run `python manage.py makemigrations accounting`
   - Review generated migration file
   - Check field definitions
   - Verify dependencies
   - Note migration number (e.g., 0013)

4. **Review migration file**
   - Open generated migration file
   - Verify all fields included
   - Check field types and constraints
   - Verify indexes created
   - Check foreign key relationships

5. **Add migration documentation**
   - Add docstring to migration class
   - Document purpose of changes
   - Note any data migrations needed
   - Reference related tasks

6. **Test migration (dry run)**
   - Run `python manage.py sqlmigrate accounting 0013`
   - Review generated SQL
   - Verify table alterations
   - Check index creation

7. **Apply migration (development)**
   - Run `python manage.py migrate accounting`
   - Monitor for errors
   - Verify successful completion
   - Check migration status

8. **Verify database schema**
   - Connect to database
   - Check StatementLine table structure
   - Verify fields exist
   - Check indexes created
   - Verify foreign keys

9. **Test data integrity**
   - Existing records have default values
   - Foreign keys nullable
   - No data loss
   - Indexes functional

10. **Update migration documentation**
    - Document migration in changelog
    - Note database schema version
    - Record any manual steps
    - Update deployment guide

### Generated Migration Structure

```python
# apps/accounting/migrations/0013_match_fields.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    """
    Add match status and matched journal entry fields to StatementLine.
    
    This migration adds:
    - match_status field with MatchStatus enum choices
    - match_status_changed_at and match_status_changed_by fields
    - matched_journal_entry foreign key
    - matched_by, matched_at fields
    - match_confidence, match_method, match_notes fields
    - Indexes for query performance
    
    Related tasks: 34, 35, 36
    """
    
    dependencies = [
        ('accounting', '0012_previous_migration'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    operations = [
        # Add match_status field
        migrations.AddField(
            model_name='statementline',
            name='match_status',
            field=models.CharField(
                choices=[
                    ('unmatched', 'Unmatched'),
                    ('matched', 'Matched'),
                    ('partial', 'Partial'),
                    ('excluded', 'Excluded')
                ],
                default='unmatched',
                max_length=20
            ),
        ),
        
        # Add match_status_changed_at field
        migrations.AddField(
            model_name='statementline',
            name='match_status_changed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        
        # Add match_status_changed_by field
        migrations.AddField(
            model_name='statementline',
            name='match_status_changed_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='status_changes',
                to='auth.user'
            ),
        ),
        
        # Add matched_journal_entry field
        migrations.AddField(
            model_name='statementline',
            name='matched_journal_entry',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='matched_statement_lines',
                to='accounting.journalentry'
            ),
        ),
        
        # Add matched_by field
        migrations.AddField(
            model_name='statementline',
            name='matched_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='statement_matches_created',
                to='auth.user'
            ),
        ),
        
        # Add matched_at field
        migrations.AddField(
            model_name='statementline',
            name='matched_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        
        # Add match_confidence field
        migrations.AddField(
            model_name='statementline',
            name='match_confidence',
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=5,
                null=True
            ),
        ),
        
        # Add match_method field
        migrations.AddField(
            model_name='statementline',
            name='match_method',
            field=models.CharField(
                blank=True,
                choices=[
                    ('manual', 'Manual Match'),
                    ('exact', 'Exact Match'),
                    ('fuzzy', 'Fuzzy Match'),
                    ('reference', 'Reference Match'),
                    ('batch', 'Batch Auto-Match')
                ],
                max_length=20,
                null=True
            ),
        ),
        
        # Add match_notes field
        migrations.AddField(
            model_name='statementline',
            name='match_notes',
            field=models.TextField(blank=True, null=True),
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='statementline',
            index=models.Index(
                fields=['match_status'],
                name='accounting_match_status_idx'
            ),
        ),
        
        migrations.AddIndex(
            model_name='statementline',
            index=models.Index(
                fields=['statement_import', 'match_status'],
                name='accounting_import_status_idx'
            ),
        ),
        
        migrations.AddIndex(
            model_name='statementline',
            index=models.Index(
                fields=['matched_journal_entry'],
                name='accounting_matched_entry_idx'
            ),
        ),
        
        migrations.AddIndex(
            model_name='statementline',
            index=models.Index(
                fields=['matched_at'],
                name='accounting_matched_at_idx'
            ),
        ),
    ]
```

### Generated SQL (PostgreSQL)

```sql
-- Add match_status field
ALTER TABLE accounting_statementline
ADD COLUMN match_status VARCHAR(20) NOT NULL DEFAULT 'unmatched';

-- Add match_status_changed_at field
ALTER TABLE accounting_statementline
ADD COLUMN match_status_changed_at TIMESTAMP NULL;

-- Add match_status_changed_by field
ALTER TABLE accounting_statementline
ADD COLUMN match_status_changed_by_id INTEGER NULL;

ALTER TABLE accounting_statementline
ADD CONSTRAINT accounting_statementline_match_status_changed_by_id_fkey
    FOREIGN KEY (match_status_changed_by_id)
    REFERENCES auth_user(id)
    ON DELETE SET NULL;

-- Add matched_journal_entry field
ALTER TABLE accounting_statementline
ADD COLUMN matched_journal_entry_id INTEGER NULL;

ALTER TABLE accounting_statementline
ADD CONSTRAINT accounting_statementline_matched_journal_entry_id_fkey
    FOREIGN KEY (matched_journal_entry_id)
    REFERENCES accounting_journalentry(id)
    ON DELETE SET NULL;

-- Add matched_by field
ALTER TABLE accounting_statementline
ADD COLUMN matched_by_id INTEGER NULL;

ALTER TABLE accounting_statementline
ADD CONSTRAINT accounting_statementline_matched_by_id_fkey
    FOREIGN KEY (matched_by_id)
    REFERENCES auth_user(id)
    ON DELETE SET NULL;

-- Add matched_at field
ALTER TABLE accounting_statementline
ADD COLUMN matched_at TIMESTAMP NULL;

-- Add match_confidence field
ALTER TABLE accounting_statementline
ADD COLUMN match_confidence NUMERIC(5, 2) NULL;

-- Add match_method field
ALTER TABLE accounting_statementline
ADD COLUMN match_method VARCHAR(20) NULL;

-- Add match_notes field
ALTER TABLE accounting_statementline
ADD COLUMN match_notes TEXT NULL;

-- Create indexes
CREATE INDEX accounting_match_status_idx
    ON accounting_statementline(match_status);

CREATE INDEX accounting_import_status_idx
    ON accounting_statementline(statement_import_id, match_status);

CREATE INDEX accounting_matched_entry_idx
    ON accounting_statementline(matched_journal_entry_id);

CREATE INDEX accounting_matched_at_idx
    ON accounting_statementline(matched_at);
```

### Migration Verification Queries

#### Check Fields Exist
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'accounting_statementline'
  AND column_name IN (
    'match_status',
    'match_status_changed_at',
    'match_status_changed_by_id',
    'matched_journal_entry_id',
    'matched_by_id',
    'matched_at',
    'match_confidence',
    'match_method',
    'match_notes'
  )
ORDER BY column_name;
```

#### Check Indexes Created
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'accounting_statementline'
  AND indexname LIKE '%match%'
ORDER BY indexname;
```

#### Check Foreign Keys
```sql
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'accounting_statementline'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name IN (
    'match_status_changed_by_id',
    'matched_journal_entry_id',
    'matched_by_id'
  );
```

### Rollback Plan

#### Reverse Migration
```bash
# Roll back one migration
python manage.py migrate accounting 0012

# This will:
# - Drop all match-related fields
# - Drop all match-related indexes
# - Drop all foreign key constraints
```

#### Manual Rollback (if needed)
```sql
-- Drop indexes
DROP INDEX IF EXISTS accounting_match_status_idx;
DROP INDEX IF EXISTS accounting_import_status_idx;
DROP INDEX IF EXISTS accounting_matched_entry_idx;
DROP INDEX IF EXISTS accounting_matched_at_idx;

-- Drop foreign key constraints
ALTER TABLE accounting_statementline
DROP CONSTRAINT IF EXISTS accounting_statementline_match_status_changed_by_id_fkey;

ALTER TABLE accounting_statementline
DROP CONSTRAINT IF EXISTS accounting_statementline_matched_journal_entry_id_fkey;

ALTER TABLE accounting_statementline
DROP CONSTRAINT IF EXISTS accounting_statementline_matched_by_id_fkey;

-- Drop columns
ALTER TABLE accounting_statementline
DROP COLUMN IF EXISTS match_status,
DROP COLUMN IF EXISTS match_status_changed_at,
DROP COLUMN IF EXISTS match_status_changed_by_id,
DROP COLUMN IF EXISTS matched_journal_entry_id,
DROP COLUMN IF EXISTS matched_by_id,
DROP COLUMN IF EXISTS matched_at,
DROP COLUMN IF EXISTS match_confidence,
DROP COLUMN IF EXISTS match_method,
DROP COLUMN IF EXISTS match_notes;
```

### Post-Migration Validation

#### Test Data Integrity
```python
from apps.accounting.models import StatementLine, MatchStatus

# Check default values applied
unmatched_count = StatementLine.objects.filter(
    match_status=MatchStatus.UNMATCHED
).count()

total_count = StatementLine.objects.count()

print(f"All {total_count} lines have default status: {unmatched_count == total_count}")

# Verify nullable fields
lines_with_null_match = StatementLine.objects.filter(
    matched_journal_entry__isnull=True
).count()

print(f"Lines without matches: {lines_with_null_match}")
```

#### Test Match Functionality
```python
# Test matching a line
line = StatementLine.objects.first()
entry = JournalEntry.objects.first()

line.match(
    journal_entry=entry,
    method='manual',
    notes='Test match after migration'
)

line.refresh_from_db()

assert line.match_status == MatchStatus.MATCHED
assert line.matched_journal_entry == entry
assert line.matched_at is not None

print("Match functionality working correctly")
```

### Deployment Checklist

- [ ] Backup database before migration
- [ ] Test migration on development database
- [ ] Review generated SQL
- [ ] Test rollback procedure
- [ ] Verify all fields created
- [ ] Verify indexes created
- [ ] Verify foreign keys created
- [ ] Test data integrity
- [ ] Test match/unmatch functionality
- [ ] Update deployment documentation
- [ ] Notify team of schema changes

### Expected Outcome
- Database schema updated
- All match fields present
- Indexes created for performance
- Foreign keys established
- Existing data preserved
- Default values applied
- Migration reversible

### Verification Checklist
- [ ] makemigrations executed successfully
- [ ] Migration file generated (0013_match_fields.py)
- [ ] Migration file reviewed
- [ ] SQL generated and reviewed
- [ ] migrate executed successfully
- [ ] Database schema verified
- [ ] Fields exist in database
- [ ] Indexes created
- [ ] Foreign keys created
- [ ] Existing data intact
- [ ] Default values applied
- [ ] Migration documented

---

## Summary

This document established the foundation of the matching engine for account reconciliation:

### Completed Infrastructure
- ✅ OFX importer service for standard bank format
- ✅ Statement parser factory for format detection
- ✅ Configurable CSV column mapping system
- ✅ MatchStatus enum (UNMATCHED, MATCHED, PARTIAL, EXCLUDED)
- ✅ Match status tracking on statement lines
- ✅ Matched journal entry foreign key relationship
- ✅ Match metadata (confidence, method, notes)
- ✅ Database migrations for all match fields

### Key Achievements
1. **Format Flexibility** - Support for OFX and configurable CSV formats
2. **Status Tracking** - Clear match state for every transaction
3. **Relationship Mapping** - Link between bank and book entries
4. **Match Metadata** - Track who, when, how matches were created
5. **Query Performance** - Optimized indexes for reconciliation queries
6. **Sri Lanka Support** - Accommodates local bank formats and practices

### Data Model Summary

```
StatementLine Model (Enhanced):
├── Import Information
│   ├── statement_import (FK)
│   ├── transaction_date
│   ├── description
│   └── amount
├── Match Status (NEW)
│   ├── match_status (enum)
│   ├── match_status_changed_at
│   └── match_status_changed_by (FK User)
└── Match Relationship (NEW)
    ├── matched_journal_entry (FK JournalEntry)
    ├── matched_by (FK User)
    ├── matched_at
    ├── match_confidence
    ├── match_method
    └── match_notes
```

### Integration Points

#### Import Flow
```
File Upload → Parser Factory → Format Detection → OFX/CSV Parser → StatementLine Creation
                                                                            ↓
                                                                    match_status = UNMATCHED
```

#### Match Flow
```
Unmatched Line → Matching Engine → Find Match → Create Relationship → Update Status
                                                         ↓
                                            matched_journal_entry set
                                            match_status = MATCHED
```

### Next Steps
Proceed to [02_Tasks-38-42_MatchingRule-Model.md](02_Tasks-38-42_MatchingRule-Model.md) to implement the MatchingRule model with configurable matching criteria, including priority ordering, amount tolerance, date range, and description pattern matching capabilities.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~980
