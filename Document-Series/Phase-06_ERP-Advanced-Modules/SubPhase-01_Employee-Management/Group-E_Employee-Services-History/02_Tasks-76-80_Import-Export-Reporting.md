# Tasks 76-80: Import, Export & Reporting

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** E - Employee Services & History  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-75_Employee-Service-Search.md](01_Tasks-67-75_Employee-Service-Search.md)

---

## Document Overview

This document covers employee data import, export, and reporting functionality. These features enable bulk operations, data migration, backup, and comprehensive workforce analytics for management decision-making.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create EmployeeImportService | High | 35 min |
| 77 | Create Import Validation | High | 30 min |
| 78 | Create EmployeeExportService | Medium | 25 min |
| 79 | Implement Export Filtering | Medium | 20 min |
| 80 | Create Employee Reporting | Medium | 25 min |

---

## Task 76: Create EmployeeImportService

### Overview
Create the EmployeeImportService class for importing employee data from CSV and Excel files. This service handles file parsing, data validation, bulk creation, and error reporting for efficient employee onboarding and data migration.

### Dependencies
- EmployeeService class exists
- openpyxl library installed
- pandas library installed
- Department, Designation models exist
- File upload configured

### Instructions

1. **Create import_service.py file**
   - Create file at `apps/employees/services/import_service.py`
   - This will contain the EmployeeImportService class

2. **Import required modules**
   - Import pandas for CSV/Excel handling
   - Import openpyxl for Excel operations
   - Import EmployeeService
   - Import validation utilities
   - Import logging and transaction support

3. **Define EmployeeImportService class**
   - Create class with comprehensive docstring
   - Document supported formats and requirements
   - List all import methods

4. **Add class initialization**
   - Accept tenant parameter
   - Accept user parameter (who is importing)
   - Initialize EmployeeService instance
   - Set up import configuration

5. **Define import_from_csv method**
   - Method signature: `import_from_csv(self, file_path: str, options: dict = None) -> dict`
   - Reads CSV file
   - Validates data
   - Creates employees
   - Returns import results

6. **Implement CSV parsing logic**
   - Use pandas to read CSV
   - Handle encoding issues (UTF-8, UTF-8-BOM)
   - Detect delimiter automatically
   - Parse headers
   - Convert to dictionary format

7. **Define import_from_excel method**
   - Method signature: `import_from_excel(self, file_path: str, sheet_name: str = None, options: dict = None) -> dict`
   - Reads Excel file (.xlsx, .xls)
   - Supports multiple sheets
   - Validates data
   - Creates employees

8. **Implement Excel parsing logic**
   - Use openpyxl for .xlsx files
   - Support xlrd for .xls files (legacy)
   - Auto-detect sheet if not specified
   - Parse headers from first row
   - Convert to dictionary format

9. **Define process_import_data method**
   - Method signature: `process_import_data(self, data: list, options: dict = None) -> dict`
   - Processes parsed data (from CSV or Excel)
   - Validates each row
   - Creates employees in bulk
   - Handles errors gracefully

10. **Implement batch processing logic**
    - Process in configurable batch sizes (default 100)
    - Use transaction per batch
    - Continue on error (collect errors)
    - Track success and failure counts

11. **Add field mapping support**
    - Define expected field names
    - Support field aliases (e.g., "First Name" = "first_name")
    - Map Excel columns to model fields
    - Handle missing optional fields

12. **Add progress tracking**
    - Define callback for progress updates
    - Report rows processed
    - Report success/failure counts
    - Useful for UI progress bars

13. **Create import template generator**
    - Define generate_template method
    - Creates blank CSV/Excel with headers
    - Includes sample data row
    - Includes field descriptions
    - Downloadable for users

14. **Add rollback on critical error**
    - If critical error (e.g., invalid file format)
    - Rollback all changes
    - Return error report
    - Don't create partial imports

15. **Update services/__init__.py**
    - Import EmployeeImportService
    - Add to __all__ list

### EmployeeImportService Class Structure

```
┌─────────────────────────────────────────────────┐
│       EmployeeImportService Class               │
├─────────────────────────────────────────────────┤
│ Public Methods:                                 │
│  • import_from_csv(file_path, options)          │
│  • import_from_excel(file_path, sheet, options) │
│  • process_import_data(data, options)           │
│  • generate_template(format)                    │
│  • validate_import_file(file_path)              │
│  • preview_import(file_path, rows)              │
│                                                 │
│ Private Helper Methods:                         │
│  • _parse_csv(file_path)                        │
│  • _parse_excel(file_path, sheet)               │
│  • _map_fields(row)                             │
│  • _validate_row(row, row_number)               │
│  • _create_employee_from_row(row)               │
│  • _handle_import_error(error, row_number)      │
└─────────────────────────────────────────────────┘
```

### Import Process Flow

```
┌────────────────────────────────────────────────┐
│         Employee Import Process                │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Upload File          │
        │  (CSV or Excel)       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate File Format │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Parse File           │
        │  Extract Data         │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Map Fields           │
        │  (aliases to fields)  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate Each Row    │
        │  (collect errors)     │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Process in Batches   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  For each batch:      │
        │  BEGIN TRANSACTION    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Create Employees     │
        │  (via EmployeeService)│
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  COMMIT or ROLLBACK   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Collect Results      │
        │  (success + errors)   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Generate Report      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Return Results       │
        └───────────────────────┘
```

### CSV Import Template

```csv
first_name,last_name,nic_number,email,phone,department,designation,hire_date,employment_type,date_of_birth,gender,address_line_1,city,province,emergency_contact_name,emergency_contact_phone
Kasun,Perera,912345678V,kasun.perera@example.lk,+94712345678,IT,Developer,2026-02-01,FULL_TIME,1991-08-15,M,123 Galle Road,Colombo,Western,Nimal Perera,+94771234567
Dilini,Fernando,856789012V,dilini.fernando@example.lk,+94761234567,HR,HR Officer,2026-02-01,FULL_TIME,1985-03-20,F,45 Kandy Road,Kandy,Central,Sunil Fernando,+94781234567
```

### Excel Import Template Structure

```
Sheet: Employee Import Template

Row 1 (Headers):
┌─────────────┬──────────┬────────────┬────────┬──────────┬────────────┬─────────────┬───────────┬─────────────────┐
│ First Name* │ Last Name*│ NIC Number*│ Email* │  Phone*  │ Department*│ Designation*│ Hire Date*│ Employment Type*│
├─────────────┼──────────┼────────────┼────────┼──────────┼────────────┼─────────────┼───────────┼─────────────────┤
│ Kasun       │ Perera   │ 912345678V │ kasun@ │ +9471... │ IT         │ Developer   │ 2026-02-01│ FULL_TIME       │
│ Dilini      │ Fernando │ 856789012V │ dilini@│ +9476... │ HR         │ HR Officer  │ 2026-02-01│ FULL_TIME       │
└─────────────┴──────────┴────────────┴────────┴──────────┴────────────┴─────────────┴───────────┴─────────────────┘

Row 4 (Instructions):
* Required fields are marked with asterisk
* NIC format: 9 digits + V/X (old) or 12 digits (new)
* Phone format: +94XXXXXXXXX
* Department: Enter exact department name
* Designation: Enter exact designation title
* Hire Date: Format YYYY-MM-DD
* Employment Type: FULL_TIME, PART_TIME, CONTRACT, INTERN
```

### Field Mapping Configuration

```python
FIELD_MAPPINGS = {
    # Standard mappings
    'first_name': ['first_name', 'First Name', 'firstname', 'given_name'],
    'last_name': ['last_name', 'Last Name', 'lastname', 'surname', 'family_name'],
    'nic_number': ['nic_number', 'NIC Number', 'nic', 'NIC', 'national_id'],
    'email': ['email', 'Email', 'email_address', 'Email Address'],
    'phone': ['phone', 'Phone', 'mobile', 'Mobile', 'phone_number', 'contact'],
    
    # Job-related
    'department': ['department', 'Department', 'dept', 'Dept'],
    'designation': ['designation', 'Designation', 'position', 'Position', 'title', 'Job Title'],
    'hire_date': ['hire_date', 'Hire Date', 'start_date', 'Start Date', 'joining_date'],
    'employment_type': ['employment_type', 'Employment Type', 'type', 'Type'],
    
    # Personal
    'date_of_birth': ['date_of_birth', 'Date of Birth', 'dob', 'DOB', 'birth_date'],
    'gender': ['gender', 'Gender', 'sex'],
    'marital_status': ['marital_status', 'Marital Status', 'marriage_status'],
    
    # Address
    'address_line_1': ['address_line_1', 'Address Line 1', 'address', 'Address', 'street'],
    'address_line_2': ['address_line_2', 'Address Line 2', 'address2'],
    'city': ['city', 'City', 'town', 'Town'],
    'province': ['province', 'Province', 'state', 'State'],
    'postal_code': ['postal_code', 'Postal Code', 'zip', 'ZIP', 'postcode'],
    
    # Emergency contact
    'emergency_contact_name': ['emergency_contact_name', 'Emergency Contact Name', 'emergency_contact'],
    'emergency_contact_phone': ['emergency_contact_phone', 'Emergency Phone', 'emergency_number'],
}
```

### Import Options Configuration

```python
{
    # Processing options
    "batch_size": 100,           # Process 100 records at a time
    "continue_on_error": True,   # Don't stop on individual errors
    "skip_duplicates": True,     # Skip if NIC/email exists
    "update_existing": False,    # Update instead of skip duplicates
    
    # Validation options
    "strict_validation": True,   # Strict field validation
    "validate_references": True, # Validate dept, designation exist
    
    # Data options
    "trim_whitespace": True,     # Remove leading/trailing spaces
    "normalize_phone": True,     # Normalize phone format
    "normalize_nic": True,       # Normalize NIC format
    
    # Progress callback
    "progress_callback": None,   # Function to call with progress
    
    # Default values
    "default_status": "ACTIVE",
    "default_employment_type": "FULL_TIME"
}
```

### Import Result Structure

```python
{
    "success": True,
    "summary": {
        "total_rows": 150,
        "processed": 150,
        "created": 142,
        "updated": 0,
        "skipped": 5,
        "failed": 3
    },
    "created_employees": [
        {
            "row": 2,
            "employee_id": "EMP-2026-0234",
            "name": "Kasun Perera",
            "email": "kasun.perera@example.lk"
        },
        # ... more
    ],
    "skipped_rows": [
        {
            "row": 15,
            "reason": "Duplicate NIC: 912345678V",
            "data": {...}
        },
        # ... more
    ],
    "errors": [
        {
            "row": 25,
            "field": "nic_number",
            "error": "Invalid NIC format",
            "value": "12345678",
            "data": {...}
        },
        {
            "row": 47,
            "field": "department",
            "error": "Department 'Marketing' not found",
            "value": "Marketing",
            "data": {...}
        },
        # ... more
    ],
    "processing_time": "12.5 seconds",
    "import_id": "IMP-2026-0001"
}
```

### Batch Processing Example

```python
# Pseudocode

def process_import_data(self, data, options=None):
    batch_size = options.get('batch_size', 100)
    results = {
        'created': [],
        'skipped': [],
        'errors': []
    }
    
    # Process in batches
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        
        try:
            with transaction.atomic():
                for row_num, row in enumerate(batch, start=i+1):
                    try:
                        # Validate row
                        validation_result = self._validate_row(row, row_num)
                        if not validation_result['valid']:
                            results['errors'].append({
                                'row': row_num,
                                'errors': validation_result['errors']
                            })
                            continue
                        
                        # Create employee
                        employee = self.employee_service.create_employee(
                            data=self._map_fields(row),
                            user=self.user
                        )
                        
                        results['created'].append({
                            'row': row_num,
                            'employee_id': employee.employee_id,
                            'name': employee.full_name
                        })
                        
                    except ValidationError as e:
                        results['errors'].append({
                            'row': row_num,
                            'error': str(e)
                        })
                        
                        if not options.get('continue_on_error'):
                            raise
                            
        except Exception as e:
            # Batch failed - transaction rolled back
            logger.error(f"Batch {i//batch_size + 1} failed: {e}")
    
    return results
```

### Error Handling Scenarios

| Error Type | Handling | User Message |
|------------|----------|--------------|
| Invalid file format | Stop import | "File format not supported" |
| Missing required fields | Skip row | "Row X: Missing required field 'email'" |
| Invalid NIC format | Skip row | "Row X: Invalid NIC format" |
| Duplicate NIC | Skip row | "Row X: Employee with NIC already exists" |
| Department not found | Skip row | "Row X: Department 'Sales' not found" |
| Invalid date format | Skip row | "Row X: Invalid date format for hire_date" |
| Invalid phone format | Skip row | "Row X: Invalid phone number format" |

### Expected Outcome
- Functional EmployeeImportService class
- CSV import support
- Excel import support
- Batch processing
- Error collection
- Import templates
- Progress tracking

### Verification Checklist
- [ ] import_service.py file created
- [ ] EmployeeImportService class defined
- [ ] import_from_csv method implemented
- [ ] import_from_excel method implemented
- [ ] process_import_data method
- [ ] Batch processing logic
- [ ] Field mapping support
- [ ] Progress callback support
- [ ] generate_template method
- [ ] Template generation logic
- [ ] Error collection
- [ ] Transaction management
- [ ] Class docstring complete
- [ ] EmployeeImportService imported in __init__.py

---

## Task 77: Create Import Validation

### Overview
Implement comprehensive validation for employee import data. This includes field-level validation, business rule validation, uniqueness checks, and reference validation to ensure data integrity before creating employee records.

### Dependencies
- Task 76: Create EmployeeImportService
- Validation utility functions
- Department, Designation models

### Instructions

1. **Open import_service.py file**
   - Navigate to `apps/employees/services/import_service.py`
   - Locate EmployeeImportService class

2. **Define validate_import_file method**
   - Method signature: `validate_import_file(self, file_path: str) -> dict`
   - Validates file before processing
   - Checks format, headers, and data types
   - Returns validation report

3. **Implement file validation logic**
   - Check file exists and readable
   - Validate file extension (.csv, .xlsx, .xls)
   - Check file size (max 10MB recommended)
   - Validate encoding (UTF-8)

4. **Add header validation**
   - Check required headers present
   - Validate header names (map aliases)
   - Warn about unknown headers
   - Suggest corrections for typos

5. **Define _validate_row method**
   - Method signature: `_validate_row(self, row: dict, row_number: int) -> dict`
   - Validates single data row
   - Returns validation result with errors
   - Used during import processing

6. **Implement required field validation**
   - Check all required fields present
   - Check values not empty
   - Check not None or whitespace only
   - Return specific missing fields

7. **Add field-specific validation**
   - Validate NIC format (old and new)
   - Validate email format
   - Validate phone format
   - Validate date formats
   - Validate choice fields

8. **Define _validate_nic_format method**
   - Validates Sri Lankan NIC format
   - Old: 9 digits + V/X
   - New: 12 digits
   - Returns boolean and error message

9. **Define _validate_email_format method**
   - Validates email format
   - Uses regex or Django validator
   - Check valid domain
   - Returns boolean and error message

10. **Define _validate_phone_format method**
    - Validates Sri Lankan phone format
    - Mobile: +94 7X XXXXXXX
    - Landline: +94 XX XXXXXXX
    - Accepts local format (07X...)
    - Normalizes to international format

11. **Add uniqueness validation**
    - Define _check_duplicate_nic method
    - Define _check_duplicate_email method
    - Check against existing employees
    - Check within import batch

12. **Add reference validation**
    - Define _validate_department method
    - Define _validate_designation method
    - Check if department exists (by name or ID)
    - Check if designation exists (by name or ID)
    - Cache lookups for performance

13. **Add business rule validation**
    - Validate hire_date not too far in future
    - Validate hire_date not too far in past
    - Validate age (calculated from DOB)
    - Validate probation period logic
    - Validate employment type combinations

14. **Define preview_import method**
    - Method signature: `preview_import(self, file_path: str, rows: int = 10) -> dict`
    - Previews first N rows
    - Shows validation results
    - Doesn't create employees
    - Useful for UI validation before import

15. **Implement preview logic**
    - Parse first N rows
    - Validate each row
    - Return data with validation status
    - Show expected field mappings

### Validation Flow

```
┌────────────────────────────────────────────────┐
│         Import Validation Process              │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate File        │
        │  (format, size)       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate Headers     │
        │  (required present)   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  For Each Row:        │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Required Fields      │
        │  Present & Not Empty  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Field Format         │
        │  Validation           │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Uniqueness Check     │
        │  (NIC, Email)         │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Reference Validation │
        │  (Dept, Designation)  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Business Rules       │
        │  Validation           │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Collect Errors       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Return Validation    │
        │  Report               │
        └───────────────────────┘
```

### Required Fields Validation

```python
REQUIRED_FIELDS = [
    'first_name',
    'last_name',
    'nic_number',
    'email',
    'phone',
    'department',
    'designation',
    'hire_date',
    'employment_type'
]

def _validate_required_fields(self, row, row_number):
    errors = []
    
    for field in REQUIRED_FIELDS:
        if field not in row or not row[field] or str(row[field]).strip() == '':
            errors.append({
                'field': field,
                'error': f'Required field missing or empty',
                'row': row_number
            })
    
    return errors
```

### NIC Format Validation

```python
def _validate_nic_format(self, nic_number):
    """
    Validate Sri Lankan NIC format.
    
    Old format: 9 digits + V/X
    Examples: 912345678V, 852341234X
    
    New format: 12 digits
    Examples: 199123456789, 200012345678
    """
    import re
    
    # Remove whitespace
    nic = str(nic_number).strip()
    
    # Old format pattern
    old_pattern = r'^\d{9}[VvXx]$'
    # New format pattern
    new_pattern = r'^\d{12}$'
    
    if re.match(old_pattern, nic):
        return True, None
    elif re.match(new_pattern, nic):
        return True, None
    else:
        return False, "Invalid NIC format. Expected: 9 digits + V/X or 12 digits"
```

### Email Validation

```python
def _validate_email_format(self, email):
    """Validate email format."""
    import re
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not email or not isinstance(email, str):
        return False, "Email is required"
    
    email = email.strip().lower()
    
    if not re.match(email_pattern, email):
        return False, "Invalid email format"
    
    # Additional checks
    if len(email) > 254:
        return False, "Email too long"
    
    local, domain = email.rsplit('@', 1)
    if len(local) > 64:
        return False, "Email local part too long"
    
    return True, None
```

### Phone Validation

```python
def _validate_phone_format(self, phone):
    """
    Validate and normalize Sri Lankan phone format.
    
    Accepted formats:
    - +94712345678 (international)
    - 0712345678 (local)
    - 94712345678 (without +)
    """
    import re
    
    if not phone:
        return False, "Phone number is required", None
    
    # Remove spaces, dashes, parentheses
    phone = re.sub(r'[\s\-\(\)]', '', str(phone))
    
    # Mobile patterns
    mobile_patterns = [
        r'^\+947[0-9]{8}$',      # +94712345678
        r'^07[0-9]{8}$',         # 0712345678
        r'^947[0-9]{8}$',        # 94712345678
    ]
    
    # Landline patterns
    landline_patterns = [
        r'^\+94[1-9][0-9]{8}$',  # +94112345678
        r'^0[1-9][0-9]{8}$',     # 0112345678
        r'^94[1-9][0-9]{8}$',    # 94112345678
    ]
    
    # Check mobile
    for pattern in mobile_patterns:
        if re.match(pattern, phone):
            # Normalize to +94 format
            if phone.startswith('0'):
                normalized = '+94' + phone[1:]
            elif phone.startswith('94'):
                normalized = '+' + phone
            else:
                normalized = phone
            return True, None, normalized
    
    # Check landline
    for pattern in landline_patterns:
        if re.match(pattern, phone):
            # Normalize
            if phone.startswith('0'):
                normalized = '+94' + phone[1:]
            elif phone.startswith('94'):
                normalized = '+' + phone
            else:
                normalized = phone
            return True, None, normalized
    
    return False, "Invalid Sri Lankan phone format", None
```

### Date Validation

```python
def _validate_date_format(self, date_value, field_name):
    """Validate date format and value."""
    from datetime import datetime, date, timedelta
    
    if not date_value:
        return False, f"{field_name} is required", None
    
    # Try parsing different formats
    date_formats = [
        '%Y-%m-%d',     # 2026-01-24
        '%d/%m/%Y',     # 24/01/2026
        '%d-%m-%Y',     # 24-01-2026
        '%Y/%m/%d',     # 2026/01/24
    ]
    
    parsed_date = None
    for fmt in date_formats:
        try:
            parsed_date = datetime.strptime(str(date_value).strip(), fmt).date()
            break
        except ValueError:
            continue
    
    if not parsed_date:
        return False, f"Invalid date format for {field_name}. Use YYYY-MM-DD", None
    
    # Business logic validation
    if field_name == 'hire_date':
        # Hire date shouldn't be more than 1 year in past
        if parsed_date < date.today() - timedelta(days=365):
            return False, "Hire date is too far in the past", None
        
        # Hire date shouldn't be more than 6 months in future
        if parsed_date > date.today() + timedelta(days=180):
            return False, "Hire date is too far in the future", None
    
    elif field_name == 'date_of_birth':
        # Age validation
        age = (date.today() - parsed_date).days // 365
        if age < 18:
            return False, "Employee must be at least 18 years old", None
        if age > 70:
            return False, "Employee age seems invalid", None
    
    return True, None, parsed_date
```

### Uniqueness Validation

```python
def _check_duplicate_nic(self, nic_number, import_batch=None):
    """
    Check if NIC already exists.
    
    Check in:
    1. Existing employees
    2. Current import batch
    """
    # Check existing employees
    exists = Employee.objects.filter(
        tenant=self.tenant,
        nic_number=nic_number
    ).exists()
    
    if exists:
        return False, f"Employee with NIC {nic_number} already exists"
    
    # Check within import batch
    if import_batch:
        duplicates = [row for row in import_batch if row.get('nic_number') == nic_number]
        if len(duplicates) > 1:
            return False, f"Duplicate NIC within import file"
    
    return True, None


def _check_duplicate_email(self, email, import_batch=None):
    """Check if email already exists."""
    email = email.strip().lower()
    
    # Check existing employees
    exists = Employee.objects.filter(
        contact_details__email__iexact=email
    ).exists()
    
    if exists:
        return False, f"Email {email} already in use"
    
    # Check within import batch
    if import_batch:
        duplicates = [row for row in import_batch 
                     if row.get('email', '').strip().lower() == email]
        if len(duplicates) > 1:
            return False, f"Duplicate email within import file"
    
    return True, None
```

### Reference Validation

```python
def _validate_department(self, department_name):
    """
    Validate department exists.
    Uses caching for performance.
    """
    cache_key = f"dept_cache_{self.tenant.id}"
    departments = cache.get(cache_key)
    
    if departments is None:
        # Build cache
        departments = {
            dept.name.lower(): dept 
            for dept in Department.objects.filter(tenant=self.tenant)
        }
        cache.set(cache_key, departments, timeout=3600)
    
    dept_key = department_name.strip().lower()
    
    if dept_key in departments:
        return True, None, departments[dept_key].id
    else:
        # Try fuzzy match
        similar = difflib.get_close_matches(
            dept_key, 
            departments.keys(), 
            n=1, 
            cutoff=0.8
        )
        
        if similar:
            return False, f"Department '{department_name}' not found. Did you mean '{similar[0]}'?", None
        else:
            return False, f"Department '{department_name}' not found", None


def _validate_designation(self, designation_name):
    """Validate designation exists."""
    # Similar caching logic as department
    cache_key = f"desig_cache_{self.tenant.id}"
    designations = cache.get(cache_key)
    
    if designations is None:
        designations = {
            desig.name.lower(): desig 
            for desig in Designation.objects.filter(tenant=self.tenant)
        }
        cache.set(cache_key, designations, timeout=3600)
    
    desig_key = designation_name.strip().lower()
    
    if desig_key in designations:
        return True, None, designations[desig_key].id
    else:
        return False, f"Designation '{designation_name}' not found", None
```

### Validation Report Structure

```python
{
    "valid": False,
    "file_validation": {
        "format": "valid",
        "size": "valid",
        "encoding": "valid",
        "headers": "valid"
    },
    "data_validation": {
        "total_rows": 150,
        "valid_rows": 142,
        "invalid_rows": 8,
        "errors": [
            {
                "row": 5,
                "errors": [
                    {
                        "field": "nic_number",
                        "error": "Invalid NIC format",
                        "value": "12345678"
                    }
                ]
            },
            {
                "row": 12,
                "errors": [
                    {
                        "field": "email",
                        "error": "Email already in use",
                        "value": "existing@example.lk"
                    },
                    {
                        "field": "department",
                        "error": "Department not found",
                        "value": "Marketing"
                    }
                ]
            },
            # ... more errors
        ]
    },
    "warnings": [
        {
            "row": 25,
            "warning": "Phone number normalized from 0712345678 to +94712345678"
        }
    ],
    "recommendations": [
        "Create 'Marketing' department before importing",
        "Check duplicate emails at rows: 12, 47, 89"
    ]
}
```

### Preview Import Example

```python
service = EmployeeImportService(tenant=tenant, user=user)
preview = service.preview_import('employees.csv', rows=5)

# Response:
{
    "preview": [
        {
            "row": 1,
            "data": {
                "first_name": "Kasun",
                "last_name": "Perera",
                "nic_number": "912345678V",
                "email": "kasun.perera@example.lk",
                # ... more fields
            },
            "validation": {
                "valid": True,
                "errors": []
            },
            "will_create": True
        },
        {
            "row": 2,
            "data": {
                "first_name": "Dilini",
                # ...
            },
            "validation": {
                "valid": False,
                "errors": [
                    {
                        "field": "department",
                        "error": "Department 'Sales' not found"
                    }
                ]
            },
            "will_create": False
        },
        # ... more previews
    ],
    "summary": {
        "total_previewed": 5,
        "valid": 4,
        "invalid": 1,
        "estimated_total": 150
    }
}
```

### Validation Error Priority

| Priority | Error Type | Action |
|----------|------------|--------|
| Critical | Invalid file format | Stop import immediately |
| Critical | Missing required fields | Stop import immediately |
| High | Invalid NIC format | Skip row, continue |
| High | Duplicate NIC/email | Skip row, continue |
| High | Department not found | Skip row, continue |
| Medium | Invalid phone format | Skip row or use default |
| Medium | Invalid date format | Skip row |
| Low | Optional field invalid | Use default, continue |

### Expected Outcome
- Comprehensive validation system
- Field-level validation
- Uniqueness checks
- Reference validation
- Business rule validation
- Preview functionality
- Clear error reporting

### Verification Checklist
- [ ] validate_import_file method implemented
- [ ] File validation logic
- [ ] Header validation
- [ ] _validate_row method
- [ ] Required field validation
- [ ] _validate_nic_format method
- [ ] _validate_email_format method
- [ ] _validate_phone_format method
- [ ] Date validation
- [ ] _check_duplicate_nic method
- [ ] _check_duplicate_email method
- [ ] _validate_department method
- [ ] _validate_designation method
- [ ] Reference caching
- [ ] Business rule validation
- [ ] preview_import method
- [ ] Validation report generation

---

## Task 78: Create EmployeeExportService

### Overview
Create the EmployeeExportService class for exporting employee data to CSV and Excel formats. This service provides flexible export functionality with filtering, field selection, and formatting options for reports and data backup.

### Dependencies
- EmployeeSearchService exists
- openpyxl library installed
- pandas library installed

### Instructions

1. **Create export_service.py file**
   - Create file at `apps/employees/services/export_service.py`
   - This will contain the EmployeeExportService class

2. **Import required modules**
   - Import pandas for CSV/Excel creation
   - Import openpyxl for Excel formatting
   - Import EmployeeSearchService
   - Import datetime utilities
   - Import logging

3. **Define EmployeeExportService class**
   - Create class with comprehensive docstring
   - Document export capabilities
   - List all export methods

4. **Add class initialization**
   - Accept tenant parameter
   - Accept user parameter (who is exporting)
   - Initialize SearchService instance
   - Set up export configuration

5. **Define export_to_csv method**
   - Method signature: `export_to_csv(self, filters: dict = None, fields: list = None, file_path: str = None) -> str`
   - Exports employees to CSV
   - Applies filters
   - Selects specific fields
   - Returns file path

6. **Implement CSV export logic**
   - Query employees using SearchService
   - Apply filters if provided
   - Select fields if specified (else all)
   - Format data for CSV
   - Write to CSV file
   - Return file path

7. **Define export_to_excel method**
   - Method signature: `export_to_excel(self, filters: dict = None, fields: list = None, file_path: str = None, include_formatting: bool = True) -> str`
   - Exports employees to Excel
   - Supports multiple sheets
   - Applies formatting

8. **Implement Excel export logic**
   - Query employees
   - Create workbook
   - Add employee data sheet
   - Optionally add summary sheet
   - Apply formatting if requested
   - Save workbook
   - Return file path

9. **Define export_with_related method**
   - Method signature: `export_with_related(self, employee_ids: list, format: str = 'excel') -> str`
   - Exports employees with all related data
   - Includes personal details, contact, job history
   - Uses multiple sheets in Excel

10. **Implement multi-sheet export**
    - Create "Employees" sheet
    - Create "Personal Details" sheet
    - Create "Contact Details" sheet
    - Create "Employment History" sheet
    - Link sheets with employee_id

11. **Add field selection support**
    - Define available field sets (basic, full, payroll, hr)
    - Allow custom field list
    - Map model fields to export columns
    - Handle related fields

12. **Add data formatting**
    - Format dates to readable format
    - Format phone numbers consistently
    - Format currency fields
    - Handle None/null values

13. **Define generate_report method**
    - Method signature: `generate_report(self, report_type: str, filters: dict = None, format: str = 'excel') -> str`
    - Generates predefined reports
    - Types: headcount, new_hires, turnover, etc.
    - Includes charts in Excel

14. **Update services/__init__.py**
    - Import EmployeeExportService
    - Add to __all__ list

### EmployeeExportService Class Structure

```
┌─────────────────────────────────────────────────┐
│       EmployeeExportService Class               │
├─────────────────────────────────────────────────┤
│ Public Methods:                                 │
│  • export_to_csv(filters, fields, file_path)    │
│  • export_to_excel(filters, fields, file_path)  │
│  • export_with_related(employee_ids, format)    │
│  • generate_report(report_type, filters)        │
│  • get_available_fields()                       │
│  • get_field_sets()                             │
│                                                 │
│ Private Helper Methods:                         │
│  • _query_employees(filters)                    │
│  • _select_fields(queryset, fields)             │
│  • _format_data(employees, fields)              │
│  • _create_excel_sheet(workbook, data, name)    │
│  • _apply_excel_formatting(worksheet)           │
│  • _generate_summary_sheet(workbook, data)      │
└─────────────────────────────────────────────────┘
```

### Export Process Flow

```
┌────────────────────────────────────────────────┐
│         Employee Export Process                │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Filters        │
        │  (dept, status, etc.) │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Query Employees      │
        │  (via SearchService)  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Select Fields        │
        │  (if specified)       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Format Data          │
        │  (dates, phones, etc.)│
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Export Format?       │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   ┌─────────┐           ┌─────────┐
   │   CSV   │           │  Excel  │
   └────┬────┘           └────┬────┘
        │                     │
        ▼                     ▼
   ┌─────────────┐     ┌───────────────┐
   │ Write CSV   │     │ Create        │
   │ File        │     │ Workbook      │
   └────┬────────┘     └───────┬───────┘
        │                      │
        │                      ▼
        │              ┌───────────────┐
        │              │ Apply         │
        │              │ Formatting    │
        │              └───────┬───────┘
        │                      │
        │                      ▼
        │              ┌───────────────┐
        │              │ Add Summary   │
        │              │ Sheet         │
        │              └───────┬───────┘
        │                      │
        ▼                      ▼
   ┌─────────────────────────────┐
   │  Return File Path           │
   └─────────────────────────────┘
```

### Field Sets Configuration

```python
FIELD_SETS = {
    'basic': [
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department__name',
        'designation__name',
        'status'
    ],
    
    'full': [
        'employee_id',
        'first_name',
        'last_name',
        'nic_number',
        'email',
        'phone',
        'department__name',
        'designation__name',
        'employment_type',
        'hire_date',
        'status',
        'personal_details__date_of_birth',
        'personal_details__gender',
        'contact_details__address_line_1',
        'contact_details__city',
        'contact_details__province'
    ],
    
    'payroll': [
        'employee_id',
        'first_name',
        'last_name',
        'nic_number',
        'bank_details__bank_name',
        'bank_details__account_number',
        'bank_details__branch',
        'salary_details__basic_salary',
        'salary_details__allowances',
        'tax_details__epf_number',
        'tax_details__paye_number'
    ],
    
    'hr': [
        'employee_id',
        'first_name',
        'last_name',
        'nic_number',
        'email',
        'phone',
        'hire_date',
        'department__name',
        'designation__name',
        'manager__first_name',
        'manager__last_name',
        'employment_type',
        'status',
        'probation_end_date'
    ]
}
```

### CSV Export Example

```python
service = EmployeeExportService(tenant=tenant, user=user)

# Basic export
file_path = service.export_to_csv()
# Exports: employees_2026-01-24_143022.csv

# Filtered export
file_path = service.export_to_csv(
    filters={'department_id': 5, 'status': 'ACTIVE'},
    fields='basic'
)

# Custom fields
file_path = service.export_to_csv(
    fields=['employee_id', 'first_name', 'last_name', 'email']
)
```

### CSV Output Format

```csv
Employee ID,First Name,Last Name,Email,Phone,Department,Designation,Status
EMP-2026-0001,Kasun,Perera,kasun.perera@example.lk,+94712345678,Technology,Senior Developer,ACTIVE
EMP-2026-0002,Dilini,Fernando,dilini.fernando@example.lk,+94761234567,Human Resources,HR Officer,ACTIVE
EMP-2026-0003,Nimal,Silva,nimal.silva@example.lk,+94771234567,Finance,Accountant,ACTIVE
```

### Excel Export Example

```python
# Basic Excel export
file_path = service.export_to_excel()
# Exports: employees_2026-01-24_143022.xlsx

# With formatting
file_path = service.export_to_excel(
    filters={'department_id': 5},
    fields='full',
    include_formatting=True
)

# Multi-sheet export with related data
file_path = service.export_with_related(
    employee_ids=[123, 124, 125],
    format='excel'
)
```

### Excel Workbook Structure

```
Workbook: employees_2026-01-24.xlsx

Sheet 1: "Employees" (Main Data)
┌──────────────┬────────────┬───────────┬─────────────────────────┬────────────┬────────────┐
│ Employee ID  │ First Name │ Last Name │         Email           │   Phone    │ Department │
├──────────────┼────────────┼───────────┼─────────────────────────┼────────────┼────────────┤
│ EMP-2026-0001│ Kasun      │ Perera    │ kasun.perera@example.lk │ +9471...   │ Technology │
│ EMP-2026-0002│ Dilini     │ Fernando  │ dilini.f@example.lk     │ +9476...   │ HR         │
└──────────────┴────────────┴───────────┴─────────────────────────┴────────────┴────────────┘

Sheet 2: "Summary"
┌─────────────────────┬───────┐
│      Metric         │ Value │
├─────────────────────┼───────┤
│ Total Employees     │  267  │
│ Active              │  242  │
│ On Leave            │   18  │
│ Inactive            │    7  │
│ Departments         │   12  │
│ Export Date         │ 2026-01-24 │
└─────────────────────┴───────┘

Sheet 3: "Department Breakdown"
┌──────────────────┬───────┬────────┬──────────┐
│   Department     │ Total │ Active │ On Leave │
├──────────────────┼───────┼────────┼──────────┤
│ Technology       │   47  │   42   │    3     │
│ Human Resources  │   15  │   14   │    1     │
│ Finance          │   22  │   20   │    2     │
└──────────────────┴───────┴────────┴──────────┘
```

### Excel Formatting

```python
def _apply_excel_formatting(self, worksheet):
    """Apply formatting to Excel worksheet."""
    from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
    
    # Header row formatting
    header_fill = PatternFill(
        start_color="4472C4",
        end_color="4472C4",
        fill_type="solid"
    )
    header_font = Font(
        name='Arial',
        size=11,
        bold=True,
        color="FFFFFF"
    )
    
    # Apply to header row
    for cell in worksheet[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(
            horizontal='center',
            vertical='center'
        )
    
    # Auto-adjust column widths
    for column in worksheet.columns:
        max_length = 0
        column_letter = column[0].column_letter
        
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        
        adjusted_width = min(max_length + 2, 50)
        worksheet.column_dimensions[column_letter].width = adjusted_width
    
    # Freeze header row
    worksheet.freeze_panes = 'A2'
    
    # Add borders
    thin_border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'),
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )
    
    for row in worksheet.iter_rows(
        min_row=1,
        max_row=worksheet.max_row,
        min_col=1,
        max_col=worksheet.max_column
    ):
        for cell in row:
            cell.border = thin_border
```

### Multi-Sheet Export with Related Data

```python
def export_with_related(self, employee_ids, format='excel'):
    """Export employees with all related data."""
    
    employees = Employee.objects.filter(
        id__in=employee_ids
    ).select_related(
        'personal_details',
        'contact_details',
        'bank_details',
        'department',
        'designation'
    ).prefetch_related(
        'employment_history',
        'documents'
    )
    
    if format == 'excel':
        workbook = openpyxl.Workbook()
        
        # Sheet 1: Basic Info
        self._create_employee_sheet(workbook, employees)
        
        # Sheet 2: Personal Details
        self._create_personal_details_sheet(workbook, employees)
        
        # Sheet 3: Contact Details
        self._create_contact_details_sheet(workbook, employees)
        
        # Sheet 4: Employment History
        self._create_history_sheet(workbook, employees)
        
        # Sheet 5: Documents
        self._create_documents_sheet(workbook, employees)
        
        # Remove default sheet
        if 'Sheet' in workbook.sheetnames:
            workbook.remove(workbook['Sheet'])
        
        file_path = f"employees_detailed_{datetime.now():%Y%m%d_%H%M%S}.xlsx"
        workbook.save(file_path)
        
        return file_path
```

### Data Formatting Functions

```python
def _format_date(self, date_value):
    """Format date for export."""
    if not date_value:
        return ''
    return date_value.strftime('%Y-%m-%d')


def _format_datetime(self, datetime_value):
    """Format datetime for export."""
    if not datetime_value:
        return ''
    return datetime_value.strftime('%Y-%m-%d %H:%M:%S')


def _format_phone(self, phone_value):
    """Format phone number for export."""
    if not phone_value:
        return ''
    # Already in +94XXXXXXXXX format
    return phone_value


def _format_currency(self, amount):
    """Format currency for export."""
    if amount is None:
        return ''
    return f"LKR {amount:,.2f}"


def _format_boolean(self, value):
    """Format boolean for export."""
    if value is None:
        return ''
    return 'Yes' if value else 'No'
```

### Available Fields

```python
def get_available_fields(self):
    """Return list of available export fields."""
    return {
        'basic_info': [
            'employee_id',
            'first_name',
            'last_name',
            'full_name',
            'nic_number',
            'status'
        ],
        'contact': [
            'email',
            'phone',
            'address_line_1',
            'address_line_2',
            'city',
            'province',
            'postal_code'
        ],
        'job': [
            'department',
            'designation',
            'employment_type',
            'hire_date',
            'manager',
            'work_location'
        ],
        'personal': [
            'date_of_birth',
            'age',
            'gender',
            'marital_status',
            'nationality',
            'religion'
        ],
        'financial': [
            'basic_salary',
            'bank_name',
            'account_number',
            'epf_number',
            'paye_number'
        ]
    }
```

### Expected Outcome
- Functional EmployeeExportService class
- CSV export functionality
- Excel export with formatting
- Multi-sheet export support
- Field selection options
- Data formatting
- Predefined field sets

### Verification Checklist
- [ ] export_service.py file created
- [ ] EmployeeExportService class defined
- [ ] export_to_csv method implemented
- [ ] CSV generation logic
- [ ] export_to_excel method implemented
- [ ] Excel workbook creation
- [ ] Excel formatting logic
- [ ] export_with_related method
- [ ] Multi-sheet export
- [ ] Field set definitions
- [ ] Data formatting functions
- [ ] get_available_fields method
- [ ] Class docstring complete
- [ ] EmployeeExportService imported in __init__.py

---

## Task 79: Implement Export Filtering

### Overview
Implement advanced filtering options for employee export. This includes filtering by multiple criteria, date ranges, custom queries, and saved filter profiles for recurring exports.

### Dependencies
- Task 78: Create EmployeeExportService
- EmployeeSearchService exists

### Instructions

1. **Open export_service.py file**
   - Navigate to `apps/employees/services/export_service.py`
   - Locate EmployeeExportService class

2. **Define apply_filters method**
   - Method signature: `apply_filters(self, base_queryset, filters: dict)`
   - Applies multiple filters to queryset
   - Returns filtered queryset
   - Supports complex filter combinations

3. **Implement department filter**
   - Support single department ID
   - Support multiple department IDs
   - Support department hierarchy (include subdepartments)
   - Map department name to ID if name provided

4. **Implement status filter**
   - Support single status
   - Support multiple statuses
   - Support status groups (e.g., "active_employees" = ACTIVE + ON_LEAVE)

5. **Implement date range filters**
   - Filter by hire_date range
   - Filter by resignation_date range
   - Filter by termination_date range
   - Support relative dates (e.g., "last_30_days")

6. **Implement employment type filter**
   - Filter by employment_type
   - Support multiple types
   - Support type groups

7. **Implement search filter**
   - Integrate with EmployeeSearchService
   - Support text search across name, email, employee_id
   - Combine with other filters

8. **Implement manager filter**
   - Filter by direct manager
   - Support team hierarchy (all reports under manager)

9. **Implement custom field filters**
   - Support filtering by any model field
   - Support comparison operators (equals, contains, greater than, etc.)
   - Support null/not null checks

10. **Define filter profiles**
    - Create predefined filter combinations
    - Profiles: active_employees, new_hires, on_probation, etc.
    - Users can save custom profiles

11. **Add export with saved profile**
    - Method signature: `export_with_profile(self, profile_name: str, format: str = 'excel')`
    - Load saved filter profile
    - Apply filters
    - Export data

12. **Implement filter validation**
    - Validate filter parameters
    - Check valid field names
    - Check valid values
    - Return helpful error messages

13. **Add filter combination logic**
    - Support AND logic (all filters must match)
    - Support OR logic (any filter can match)
    - Support complex combinations

### Filter Application Flow

```
┌────────────────────────────────────────────────┐
│        Apply Filters Process                   │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Start with Base      │
        │  Queryset             │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Department     │
        │  Filter               │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Status         │
        │  Filter               │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Date Range     │
        │  Filters              │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Employment     │
        │  Type Filter          │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Search Query   │
        │  (if provided)        │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Manager Filter │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Apply Custom Filters │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Return Filtered      │
        │  Queryset             │
        └───────────────────────┘
```

### Filter Examples

```python
service = EmployeeExportService(tenant=tenant, user=user)

# Single department
service.export_to_csv(
    filters={'department_id': 5}
)

# Multiple departments
service.export_to_csv(
    filters={'department_id': [5, 8, 12]}
)

# Department with subdepartments
service.export_to_csv(
    filters={
        'department_id': 5,
        'include_subdepartments': True
    }
)

# Status filter
service.export_to_csv(
    filters={'status': 'ACTIVE'}
)

# Multiple statuses
service.export_to_csv(
    filters={'status': ['ACTIVE', 'ON_LEAVE']}
)

# Date range filter
service.export_to_csv(
    filters={
        'hire_date_from': '2025-01-01',
        'hire_date_to': '2025-12-31'
    }
)

# Relative date
service.export_to_csv(
    filters={'hired_in_last': 30}  # days
)

# Employment type
service.export_to_csv(
    filters={'employment_type': ['FULL_TIME', 'PART_TIME']}
)

# Search + filters
service.export_to_csv(
    filters={
        'search': 'developer',
        'department_id': 5,
        'status': 'ACTIVE'
    }
)

# Manager's team
service.export_to_csv(
    filters={'manager_id': 123}
)

# Complex filters
service.export_to_csv(
    filters={
        'department_id': [5, 8],
        'status': 'ACTIVE',
        'employment_type': 'FULL_TIME',
        'hire_date_from': '2024-01-01',
        'has_user_account': True
    }
)
```

### Filter Structure

```python
{
    # Department filters
    "department_id": 5,                    # Single department
    "department_id": [5, 8, 12],          # Multiple departments
    "include_subdepartments": True,        # Include child departments
    "department_name": "Technology",       # By name
    
    # Status filters
    "status": "ACTIVE",                    # Single status
    "status": ["ACTIVE", "ON_LEAVE"],     # Multiple statuses
    "status_group": "active_employees",    # Predefined group
    
    # Date filters
    "hire_date_from": "2025-01-01",
    "hire_date_to": "2025-12-31",
    "hired_in_last": 30,                   # Last N days
    "hired_in_year": 2025,
    "resignation_date_from": "2025-01-01",
    "resignation_date_to": "2025-12-31",
    
    # Employment type
    "employment_type": "FULL_TIME",
    "employment_type": ["FULL_TIME", "PART_TIME"],
    
    # Search
    "search": "developer",                 # Text search
    
    # Manager
    "manager_id": 123,
    "include_reports": True,               # Include all subordinates
    
    # Custom filters
    "gender": "M",
    "marital_status": "MARRIED",
    "has_user_account": True,
    "on_probation": True,
    "age_min": 25,
    "age_max": 40,
    
    # Combination logic
    "logic": "AND"                         # or "OR"
}
```

### Predefined Filter Profiles

```python
FILTER_PROFILES = {
    'active_employees': {
        'status': ['ACTIVE', 'ON_LEAVE'],
        'description': 'All currently active employees'
    },
    
    'new_hires': {
        'hired_in_last': 90,
        'status': 'ACTIVE',
        'description': 'Employees hired in last 90 days'
    },
    
    'on_probation': {
        'on_probation': True,
        'status': 'ACTIVE',
        'description': 'Employees currently on probation'
    },
    
    'probation_ending_soon': {
        'on_probation': True,
        'probation_ends_in': 15,  # days
        'description': 'Probation ending in next 15 days'
    },
    
    'full_time_employees': {
        'employment_type': 'FULL_TIME',
        'status': ['ACTIVE', 'ON_LEAVE'],
        'description': 'All full-time employees'
    },
    
    'resigned_last_year': {
        'status': 'RESIGNED',
        'resignation_date_from': '2025-01-01',
        'resignation_date_to': '2025-12-31',
        'description': 'Resignations in 2025'
    },
    
    'without_user_account': {
        'status': 'ACTIVE',
        'has_user_account': False,
        'description': 'Active employees without system access'
    },
    
    'department_heads': {
        'is_manager': True,
        'status': 'ACTIVE',
        'description': 'All department heads and managers'
    }
}
```

### Using Filter Profiles

```python
# Export using profile
service.export_with_profile('new_hires', format='excel')

# Export with profile + additional filters
service.export_to_csv(
    filters={
        'profile': 'active_employees',
        'department_id': 5  # Override/add filter
    }
)
```

### Date Range Helper Functions

```python
def _parse_relative_date(self, relative_spec):
    """Parse relative date specifications."""
    from datetime import date, timedelta
    
    today = date.today()
    
    if 'hired_in_last' in relative_spec:
        days = relative_spec['hired_in_last']
        return {
            'hire_date__gte': today - timedelta(days=days)
        }
    
    if 'hired_in_year' in relative_spec:
        year = relative_spec['hired_in_year']
        return {
            'hire_date__year': year
        }
    
    if 'resigned_in_last' in relative_spec:
        days = relative_spec['resigned_in_last']
        return {
            'resignation_date__gte': today - timedelta(days=days),
            'status': 'RESIGNED'
        }
    
    return {}


def _get_date_range_filters(self, filters):
    """Extract and process date range filters."""
    date_filters = {}
    
    # Hire date range
    if 'hire_date_from' in filters:
        date_filters['hire_date__gte'] = filters['hire_date_from']
    
    if 'hire_date_to' in filters:
        date_filters['hire_date__lte'] = filters['hire_date_to']
    
    # Resignation date range
    if 'resignation_date_from' in filters:
        date_filters['resignation_date__gte'] = filters['resignation_date_from']
    
    if 'resignation_date_to' in filters:
        date_filters['resignation_date__lte'] = filters['resignation_date_to']
    
    return date_filters
```

### Filter Validation

```python
def _validate_filters(self, filters):
    """Validate filter parameters."""
    errors = []
    
    # Validate department_id
    if 'department_id' in filters:
        dept_id = filters['department_id']
        if isinstance(dept_id, list):
            for did in dept_id:
                if not Department.objects.filter(id=did, tenant=self.tenant).exists():
                    errors.append(f"Department ID {did} not found")
        else:
            if not Department.objects.filter(id=dept_id, tenant=self.tenant).exists():
                errors.append(f"Department ID {dept_id} not found")
    
    # Validate status
    if 'status' in filters:
        valid_statuses = [choice[0] for choice in EMPLOYMENT_STATUS_CHOICES]
        status = filters['status']
        
        if isinstance(status, list):
            for s in status:
                if s not in valid_statuses:
                    errors.append(f"Invalid status: {s}")
        else:
            if status not in valid_statuses:
                errors.append(f"Invalid status: {status}")
    
    # Validate dates
    if 'hire_date_from' in filters:
        try:
            datetime.strptime(filters['hire_date_from'], '%Y-%m-%d')
        except ValueError:
            errors.append("Invalid hire_date_from format. Use YYYY-MM-DD")
    
    # Return validation result
    if errors:
        return {'valid': False, 'errors': errors}
    else:
        return {'valid': True}
```

### Complex Filter Combinations

```python
def apply_filters(self, base_queryset, filters):
    """Apply all filters to queryset."""
    qs = base_queryset
    
    # Validate filters first
    validation = self._validate_filters(filters)
    if not validation['valid']:
        raise ValidationError(validation['errors'])
    
    # Department filter
    if 'department_id' in filters:
        dept_ids = filters['department_id']
        if not isinstance(dept_ids, list):
            dept_ids = [dept_ids]
        
        if filters.get('include_subdepartments'):
            # Include all subdepartments
            all_dept_ids = []
            for dept_id in dept_ids:
                all_dept_ids.extend(self._get_child_departments(dept_id))
            dept_ids = all_dept_ids
        
        qs = qs.filter(department_id__in=dept_ids)
    
    # Status filter
    if 'status' in filters:
        status = filters['status']
        if isinstance(status, list):
            qs = qs.filter(status__in=status)
        else:
            qs = qs.filter(status=status)
    
    # Date filters
    date_filters = self._get_date_range_filters(filters)
    qs = qs.filter(**date_filters)
    
    # Employment type
    if 'employment_type' in filters:
        emp_type = filters['employment_type']
        if isinstance(emp_type, list):
            qs = qs.filter(employment_type__in=emp_type)
        else:
            qs = qs.filter(employment_type=emp_type)
    
    # Search
    if 'search' in filters:
        search_service = EmployeeSearchService(tenant=self.tenant)
        search_results = search_service.search(query=filters['search'])
        employee_ids = [e['id'] for e in search_results['results']]
        qs = qs.filter(id__in=employee_ids)
    
    # Manager filter
    if 'manager_id' in filters:
        manager_id = filters['manager_id']
        if filters.get('include_reports'):
            # Get all subordinates recursively
            all_reports = self._get_all_reports(manager_id)
            qs = qs.filter(id__in=all_reports)
        else:
            qs = qs.filter(manager_id=manager_id)
    
    # Custom filters
    custom_filters = {
        k: v for k, v in filters.items()
        if k not in ['department_id', 'status', 'employment_type', 
                     'search', 'manager_id', 'include_subdepartments', 
                     'include_reports', 'logic']
    }
    qs = qs.filter(**custom_filters)
    
    return qs
```

### Expected Outcome
- Advanced filtering functionality
- Multiple filter support
- Date range filters
- Filter profiles
- Filter validation
- Complex filter combinations

### Verification Checklist
- [ ] apply_filters method implemented
- [ ] Department filter logic
- [ ] Subdepartment support
- [ ] Status filter logic
- [ ] Date range filter logic
- [ ] Relative date support
- [ ] Employment type filter
- [ ] Search integration
- [ ] Manager filter logic
- [ ] Custom field filters
- [ ] Filter profiles defined
- [ ] export_with_profile method
- [ ] Filter validation
- [ ] Complex combination support

---

## Task 80: Create Employee Reporting

### Overview
Implement comprehensive employee reporting functionality. This includes generating various HR reports such as headcount reports, turnover analysis, demographics, tenure reports, and custom report builders.

### Dependencies
- Task 79: Implement export filtering
- EmployeeSearchService exists
- Charting library configured (optional)

### Instructions

1. **Create report_service.py file**
   - Create file at `apps/employees/services/report_service.py`
   - This will contain reporting functionality

2. **Import required modules**
   - Import EmployeeSearchService
   - Import EmployeeExportService
   - Import statistics and aggregation functions
   - Import datetime utilities
   - Import plotting library (optional for charts)

3. **Define EmployeeReportService class**
   - Create class with comprehensive docstring
   - Document available reports
   - List all report methods

4. **Add class initialization**
   - Accept tenant parameter
   - Initialize search and export services
   - Set up report configuration

5. **Define generate_headcount_report method**
   - Method signature: `generate_headcount_report(self, as_of_date: date = None, breakdown_by: str = None) -> dict`
   - Returns employee count statistics
   - Breakdown by department, status, type, etc.
   - Includes historical comparison

6. **Implement headcount calculation**
   - Count active employees
   - Count by status
   - Count by employment type
   - Calculate percentages
   - Compare with previous period

7. **Define generate_turnover_report method**
   - Method signature: `generate_turnover_report(self, period: str = 'year', year: int = None) -> dict`
   - Calculates turnover rate
   - Separates voluntary and involuntary
   - Shows trends over time

8. **Implement turnover calculation**
   - Count resignations in period
   - Count terminations in period
   - Calculate turnover rate
   - Calculate retention rate
   - Show monthly breakdown

9. **Define generate_demographics_report method**
   - Method signature: `generate_demographics_report(self) -> dict`
   - Returns demographic statistics
   - Age distribution, gender ratio, etc.

10. **Implement demographics analysis**
    - Calculate age distribution
    - Gender distribution
    - Marital status distribution
    - Province/location distribution
    - Create visualizable data

11. **Define generate_tenure_report method**
    - Method signature: `generate_tenure_report(self, department_id: int = None) -> dict`
    - Returns tenure statistics
    - Average tenure, tenure distribution

12. **Implement tenure calculation**
    - Calculate average tenure
    - Tenure by department
    - Identify longest serving employees
    - Show tenure distribution ranges

13. **Define generate_new_hires_report method**
    - Method signature: `generate_new_hires_report(self, period_days: int = 90) -> dict`
    - Returns new hire statistics
    - Shows hiring trends

14. **Define generate_anniversary_report method**
    - Method signature: `generate_anniversary_report(self, upcoming_days: int = 30) -> dict`
    - Returns upcoming work anniversaries
    - Useful for recognition programs

15. **Define generate_custom_report method**
    - Method signature: `generate_custom_report(self, report_config: dict) -> dict`
    - Flexible report builder
    - User defines metrics and breakdowns

16. **Add report export functionality**
    - All reports exportable to Excel/PDF
    - Include charts and visualizations
    - Professional formatting

17. **Update services/__init__.py**
    - Import EmployeeReportService
    - Add to __all__ list

### EmployeeReportService Class Structure

```
┌─────────────────────────────────────────────────┐
│       EmployeeReportService Class               │
├─────────────────────────────────────────────────┤
│ Public Methods:                                 │
│  • generate_headcount_report(date, breakdown)   │
│  • generate_turnover_report(period, year)       │
│  • generate_demographics_report()               │
│  • generate_tenure_report(department)           │
│  • generate_new_hires_report(period)            │
│  • generate_anniversary_report(days)            │
│  • generate_probation_report()                  │
│  • generate_custom_report(config)               │
│  • export_report(report, format)                │
│                                                 │
│ Private Helper Methods:                         │
│  • _calculate_headcount()                       │
│  • _calculate_turnover_rate()                   │
│  • _get_age_distribution()                      │
│  • _calculate_average_tenure()                  │
│  • _generate_chart_data()                       │
└─────────────────────────────────────────────────┘
```

### Headcount Report

```python
service = EmployeeReportService(tenant=tenant)
report = service.generate_headcount_report(
    as_of_date=date.today(),
    breakdown_by='department'
)

# Response:
{
    "report_type": "headcount",
    "as_of_date": "2026-01-24",
    "summary": {
        "total_employees": 284,
        "active": 267,
        "on_leave": 15,
        "inactive": 2,
        "growth": {
            "vs_last_month": "+12",
            "vs_last_year": "+47",
            "percentage_change": "+19.8%"
        }
    },
    "by_status": {
        "ACTIVE": {"count": 267, "percentage": 94.0},
        "ON_LEAVE": {"count": 15, "percentage": 5.3},
        "INACTIVE": {"count": 2, "percentage": 0.7}
    },
    "by_employment_type": {
        "FULL_TIME": {"count": 240, "percentage": 84.5},
        "PART_TIME": {"count": 32, "percentage": 11.3},
        "CONTRACT": {"count": 10, "percentage": 3.5},
        "INTERN": {"count": 2, "percentage": 0.7}
    },
    "by_department": [
        {
            "department": "Technology",
            "count": 47,
            "percentage": 16.5,
            "growth": "+5"
        },
        {
            "department": "Sales",
            "count": 38,
            "percentage": 13.4,
            "growth": "+2"
        },
        # ... more departments
    ],
    "trend_data": [
        {"month": "2025-08", "count": 250},
        {"month": "2025-09", "count": 255},
        {"month": "2025-10", "count": 262},
        {"month": "2025-11", "count": 268},
        {"month": "2025-12", "count": 272},
        {"month": "2026-01", "count": 284}
    ]
}
```

### Turnover Report

```python
report = service.generate_turnover_report(
    period='year',
    year=2025
)

# Response:
{
    "report_type": "turnover",
    "period": "2025",
    "summary": {
        "beginning_headcount": 250,
        "ending_headcount": 284,
        "total_separations": 23,
        "voluntary": 17,
        "involuntary": 6,
        "turnover_rate": 8.7,  # percentage
        "retention_rate": 91.3
    },
    "by_reason": {
        "Better opportunity": 8,
        "Personal reasons": 4,
        "Relocation": 3,
        "Performance": 4,
        "Misconduct": 2
    },
    "by_month": [
        {
            "month": "2025-01",
            "resignations": 2,
            "terminations": 0,
            "total": 2
        },
        {
            "month": "2025-02",
            "resignations": 1,
            "terminations": 1,
            "total": 2
        },
        # ... more months
    ],
    "by_department": [
        {
            "department": "Sales",
            "separations": 8,
            "turnover_rate": 21.1
        },
        {
            "department": "Technology",
            "separations": 4,
            "turnover_rate": 8.5
        },
        # ... more departments
    ],
    "by_tenure": {
        "0-6 months": 7,   # New hires leaving
        "6-12 months": 5,
        "1-2 years": 6,
        "2+ years": 5
    }
}
```

### Demographics Report

```python
report = service.generate_demographics_report()

# Response:
{
    "report_type": "demographics",
    "total_employees": 284,
    "age_distribution": {
        "18-25": {"count": 23, "percentage": 8.1},
        "26-30": {"count": 67, "percentage": 23.6},
        "31-35": {"count": 82, "percentage": 28.9},
        "36-40": {"count": 56, "percentage": 19.7},
        "41-50": {"count": 42, "percentage": 14.8},
        "51+": {"count": 14, "percentage": 4.9}
    },
    "average_age": 34.2,
    "median_age": 33,
    "gender_distribution": {
        "Male": {"count": 168, "percentage": 59.2},
        "Female": {"count": 116, "percentage": 40.8}
    },
    "marital_status": {
        "Single": {"count": 142, "percentage": 50.0},
        "Married": {"count": 129, "percentage": 45.4},
        "Divorced": {"count": 11, "percentage": 3.9},
        "Widowed": {"count": 2, "percentage": 0.7}
    },
    "by_province": {
        "Western": {"count": 186, "percentage": 65.5},
        "Central": {"count": 42, "percentage": 14.8},
        "Southern": {"count": 28, "percentage": 9.9},
        # ... more provinces
    },
    "by_nationality": {
        "Sri Lankan": {"count": 277, "percentage": 97.5},
        "Indian": {"count": 5, "percentage": 1.8},
        "Other": {"count": 2, "percentage": 0.7}
    }
}
```

### Tenure Report

```python
report = service.generate_tenure_report()

# Response:
{
    "report_type": "tenure",
    "summary": {
        "average_tenure_years": 3.8,
        "average_tenure_days": 1387,
        "median_tenure_years": 2.9
    },
    "tenure_distribution": {
        "0-6 months": {"count": 34, "percentage": 12.0},
        "6-12 months": {"count": 28, "percentage": 9.9},
        "1-2 years": {"count": 52, "percentage": 18.3},
        "2-5 years": {"count": 98, "percentage": 34.5},
        "5-10 years": {"count": 52, "percentage": 18.3},
        "10+ years": {"count": 20, "percentage": 7.0}
    },
    "by_department": [
        {
            "department": "Finance",
            "average_tenure_years": 5.2,
            "count": 22
        },
        {
            "department": "Technology",
            "average_tenure_years": 2.8,
            "count": 47
        },
        # ... more departments
    ],
    "longest_serving": [
        {
            "employee_id": "EMP-2015-0012",
            "name": "Sunil Jayasinghe",
            "department": "Finance",
            "tenure_years": 10.5
        },
        # ... top 10
    ]
}
```

### New Hires Report

```python
report = service.generate_new_hires_report(period_days=90)

# Response:
{
    "report_type": "new_hires",
    "period_days": 90,
    "date_range": {
        "from": "2025-10-26",
        "to": "2026-01-24"
    },
    "summary": {
        "total_hires": 34,
        "by_department": {
            "Technology": 12,
            "Sales": 8,
            "Customer Service": 7,
            # ... more
        },
        "by_employment_type": {
            "FULL_TIME": 28,
            "PART_TIME": 4,
            "CONTRACT": 2
        }
    },
    "new_hires": [
        {
            "employee_id": "EMP-2026-0045",
            "name": "Kasun Perera",
            "department": "Technology",
            "designation": "Developer",
            "hire_date": "2026-01-15",
            "days_employed": 9,
            "on_probation": True
        },
        # ... more
    ],
    "hiring_trend": [
        {"week": "2025-W43", "hires": 3},
        {"week": "2025-W44", "hires": 5},
        # ... more weeks
    ]
}
```

### Anniversary Report

```python
report = service.generate_anniversary_report(upcoming_days=30)

# Response:
{
    "report_type": "work_anniversaries",
    "upcoming_days": 30,
    "date_range": {
        "from": "2026-01-24",
        "to": "2026-02-23"
    },
    "anniversaries": [
        {
            "employee_id": "EMP-2024-0012",
            "name": "Nimal Silva",
            "department": "HR",
            "hire_date": "2024-02-01",
            "anniversary_date": "2026-02-01",
            "years": 2,
            "days_until": 8
        },
        {
            "employee_id": "EMP-2021-0005",
            "name": "Kamala Fernando",
            "department": "Finance",
            "hire_date": "2021-02-15",
            "anniversary_date": "2026-02-15",
            "years": 5,
            "days_until": 22,
            "milestone": True  # 5-year milestone
        },
        # ... more
    ],
    "by_milestone": {
        "1_year": 5,
        "2_years": 3,
        "5_years": 2,
        "10_years": 1
    }
}
```

### Custom Report Example

```python
report = service.generate_custom_report({
    "metrics": ["count", "average_tenure", "average_age"],
    "breakdown_by": ["department", "employment_type"],
    "filters": {
        "status": "ACTIVE",
        "hire_date_from": "2024-01-01"
    }
})

# Generates custom report with specified metrics and breakdowns
```

### Report Export

```python
# Export headcount report to Excel
file_path = service.export_report(
    report=headcount_report,
    format='excel'
)

# Result: headcount_report_2026-01-24.xlsx with:
# - Summary sheet
# - Detailed data
# - Charts and visualizations
# - Professional formatting
```

### Expected Outcome
- Comprehensive reporting system
- Multiple predefined reports
- Statistical analysis
- Trend analysis
- Custom report builder
- Export functionality

### Verification Checklist
- [ ] report_service.py file created
- [ ] EmployeeReportService class defined
- [ ] generate_headcount_report method
- [ ] Headcount calculation logic
- [ ] generate_turnover_report method
- [ ] Turnover calculation logic
- [ ] generate_demographics_report method
- [ ] Demographics analysis
- [ ] generate_tenure_report method
- [ ] Tenure calculation
- [ ] generate_new_hires_report method
- [ ] generate_anniversary_report method
- [ ] generate_custom_report method
- [ ] Report export functionality
- [ ] Class docstring complete
- [ ] EmployeeReportService imported in __init__.py

---

## Summary

This document established employee import, export, and reporting infrastructure:

### Completed Infrastructure
- ✅ EmployeeImportService for CSV/Excel import
- ✅ Comprehensive import validation
- ✅ EmployeeExportService for data export
- ✅ Advanced export filtering
- ✅ EmployeeReportService for analytics

### Key Achievements
1. **Bulk Operations** - Efficient import/export
2. **Data Validation** - Comprehensive validation before import
3. **Flexible Export** - Multiple formats and field sets
4. **Advanced Filtering** - Complex filter combinations
5. **Comprehensive Reporting** - Multiple HR reports
6. **Data Quality** - Validation and error handling
7. **Business Intelligence** - Turnover, demographics, tenure analysis

### Import Features
- CSV and Excel support
- Batch processing
- Field mapping
- Validation and error reporting
- Template generation
- Progress tracking

### Export Features
- CSV and Excel export
- Multi-sheet exports
- Professional formatting
- Field selection
- Filter profiles
- Related data export

### Reporting Features
- Headcount reports
- Turnover analysis
- Demographics analysis
- Tenure reports
- New hires tracking
- Anniversary reports
- Custom report builder

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~1320
