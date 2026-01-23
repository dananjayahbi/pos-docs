# Tasks 55-56: Validation Formatting

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** D - Error Response Formatting  
> **Document:** 02 of 03  
> **Tasks Covered:** 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-47-54_ErrorResponse-Class.md](01_Tasks-47-54_ErrorResponse-Class.md)
- **→ Next Document:** [03_Tasks-57-60_Conversion-Methods.md](03_Tasks-57-60_Conversion-Methods.md)

---

## Document Overview

This document covers formatting validation errors and nested error flattening.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Format Validation Errors | Medium |
| 56 | Format Nested Errors | Medium |

---

## Implementation

Add to `response.py`:

```python
def format_validation_errors(errors: Any, parent_key: str = '') -> Dict[str, list]:
    """
    Format validation errors with field-level details.
    
    Converts nested errors to flat structure with dot notation.
    
    Args:
        errors: Validation errors (dict, list, or str)
        parent_key: Parent key for nested fields
        
    Returns:
        Flattened errors dict
        
    Example:
        Input: {'address': {'city': ['Required']}}
        Output: {'address.city': ['Required']}
    """
    flattened = {}
    
    if isinstance(errors, dict):
        for key, value in errors.items():
            new_key = f"{parent_key}.{key}" if parent_key else key
            
            if isinstance(value, (dict, list)):
                nested = format_validation_errors(value, new_key)
                flattened.update(nested)
            else:
                flattened[new_key] = [str(value)] if not isinstance(value, list) else [str(v) for v in value]
    
    elif isinstance(errors, list):
        flattened[parent_key] = [str(e) for e in errors]
    
    else:
        flattened[parent_key] = [str(errors)]
    
    return flattened


# Update ErrorResponse class
class ErrorResponse:
    # ... existing code ...
    
    @classmethod
    def from_validation_error(
        cls,
        errors: Any,
        status_code: int = 400,
        request_id: Optional[str] = None,
        path: Optional[str] = None,
    ) -> 'ErrorResponse':
        """
        Create ErrorResponse from validation errors.
        
        Args:
            errors: Validation errors
            status_code: HTTP status code
            request_id: Request tracking ID
            path: Request path
            
        Returns:
            ErrorResponse instance
        """
        formatted_errors = format_validation_errors(errors)
        
        return cls(
            error_code='VALIDATION_ERROR',
            message='Validation failed',
            status_code=status_code,
            details=formatted_errors,
            request_id=request_id,
            path=path
        )
```

---

## Examples

```python
# Simple validation error
errors = {'email': ['Invalid format'], 'age': ['Must be positive']}
response = ErrorResponse.from_validation_error(errors)

# Nested validation error
errors = {
    'address': {
        'city': ['Required'],
        'postal_code': ['Invalid format']
    }
}
response = ErrorResponse.from_validation_error(errors)
# Details: {'address.city': ['Required'], 'address.postal_code': ['Invalid format']}
```

---

## Notes for AI Agents

- **Flattening:** Nested errors → dot notation
- **Field Mapping:** Clear field-to-error mapping
- **List Handling:** Properly handle error lists
- **Factory Method:** from_validation_error for convenience
