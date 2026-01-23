# Tasks 60-66: Communication Model and Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** D - Performance & Communication  
> **Document:** 02 of 02  
> **Tasks Covered:** 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-59_Performance-Model-Service.md](01_Tasks-51-59_Performance-Model-Service.md)

---

## Document Overview

This document creates the VendorCommunication model to log vendor interactions and provides timeline functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 60 | Create VendorCommunication Model | Medium | 25 min |
| 61 | Define CommunicationType Choices | Low | 15 min |
| 62 | Add Communication Fields | Medium | 20 min |
| 63 | Add Communication Follow-up | Medium | 20 min |
| 64 | Run Communication Migrations | Low | 15 min |
| 65 | Implement Log Communication | Medium | 25 min |
| 66 | Implement Communication Timeline | Medium | 25 min |

---

## Task 60: Create VendorCommunication Model

### Overview
Create model to log all vendor communications for audit trail.

### Dependencies
- Task 59: Implement Overall Rating Calculator

### Instructions

1. **Create vendor_communication.py file**
   - At `apps/vendors/models/vendor_communication.py`

2. **Define VendorCommunication model**
   - UUIDField primary key
   - ForeignKey to Vendor (CASCADE, related_name='communications')

3. **Configure Meta**
   - Ordering: ['-contact_date']

### Expected Outcome
- Communication logging model

### Verification Checklist
- [ ] Model created with vendor FK

---

## Task 61: Define CommunicationType Choices

### Overview
Define communication type choices.

### Dependencies
- Task 60: Create VendorCommunication Model

### Instructions

1. **Add to constants.py**
   - COMMUNICATION_TYPE_EMAIL: 'EMAIL'
   - COMMUNICATION_TYPE_PHONE: 'PHONE'
   - COMMUNICATION_TYPE_MEETING: 'MEETING'
   - COMMUNICATION_TYPE_SITE_VISIT: 'SITE_VISIT'
   - COMMUNICATION_TYPE_OTHER: 'OTHER'

2. **Create COMMUNICATION_TYPE_CHOICES tuple**

### Communication Types

| Type | Value | Purpose |
|------|-------|---------|
| EMAIL | 'EMAIL' | Email correspondence |
| PHONE | 'PHONE' | Phone call |
| MEETING | 'MEETING' | Meeting (in-person/virtual) |
| SITE_VISIT | 'SITE_VISIT' | Vendor site visit |
| OTHER | 'OTHER' | Other communication |

### Expected Outcome
- Communication type classification

### Verification Checklist
- [ ] All types defined
- [ ] Choices tuple created

---

## Task 62: Add Communication Fields

### Overview
Add fields for communication details.

### Dependencies
- Task 61: Define CommunicationType Choices

### Instructions

1. **Add communication_type**
   - CharField with COMMUNICATION_TYPE_CHOICES

2. **Add subject**
   - CharField(255)
   - Communication subject/topic

3. **Add content**
   - TextField
   - Detailed content

4. **Add contacted_by**
   - ForeignKey to User
   - Who made contact

5. **Add contact_date**
   - DateTimeField
   - When communication occurred

6. **Add related_po**
   - ForeignKey to PurchaseOrder (optional)
   - Link to related PO

### Communication Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| communication_type | CharField | Type of communication |
| subject | CharField(255) | Subject/topic |
| content | TextField | Details |
| contacted_by | FK User | Who contacted |
| contact_date | DateTimeField | When |
| related_po | FK PO | Related PO |

### Expected Outcome
- Complete communication logging

### Verification Checklist
- [ ] All fields added
- [ ] User and PO relationships

---

## Task 63: Add Communication Follow-up

### Overview
Add follow-up tracking fields.

### Dependencies
- Task 62: Add Communication Fields

### Instructions

1. **Add follow_up_date**
   - DateField
   - Optional
   - When follow-up needed

2. **Add follow_up_notes**
   - TextField
   - Optional
   - Follow-up action items

3. **Add is_follow_up_complete**
   - BooleanField
   - Default: False
   - Track completion

4. **Add timestamps**
   - created_at, updated_at

### Follow-up Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| follow_up_date | DateField | Follow-up due date |
| follow_up_notes | TextField | Action items |
| is_follow_up_complete | BooleanField | Completed |

### Expected Outcome
- Follow-up tracking
- Task management

### Verification Checklist
- [ ] Follow-up fields added
- [ ] Completion tracking

---

## Task 64: Run Communication Migrations

### Overview
Generate and apply communication model migrations.

### Dependencies
- Task 63: Add Communication Follow-up

### Instructions

1. **Generate and apply migration**
2. **Test communication logging**

### Verification Checklist
- [ ] Migration applied
- [ ] Table created

---

## Task 65: Implement Log Communication

### Overview
Implement service method to log vendor communications.

### Dependencies
- Task 64: Run Communication Migrations

### Instructions

1. **Add to VendorService or create CommunicationService**

2. **Implement log_communication method**
   - Parameters: vendor_id, type, subject, content, contacted_by, contact_date
   - Optional: related_po, follow_up_date
   - Create VendorCommunication record
   - Return created communication

3. **Add validation**
   - Vendor must exist
   - Type must be valid
   - contacted_by must be User

### Expected Outcome
- Communication logging functionality

### Verification Checklist
- [ ] Method implemented
- [ ] Validation added

---

## Task 66: Implement Communication Timeline

### Overview
Implement method to retrieve communication timeline for vendor.

### Dependencies
- Task 65: Implement Log Communication

### Instructions

1. **Implement get_communication_timeline method**
   - Parameter: vendor_id
   - Optional: date_from, date_to, type filter
   - Query communications
   - Order by contact_date descending
   - Include related data (user, PO)
   - Return chronological timeline

2. **Add filtering**
   - Filter by type
   - Filter by date range
   - Filter by user
   - Filter by follow-up status

3. **Format response**
   - Return list of communications
   - Include all relevant details
   - Group by date (optional)

### Timeline Response Example
```python
{
    "vendor": {...},
    "communications": [
        {
            "id": "uuid",
            "date": "2026-01-20T14:30:00",
            "type": "PHONE",
            "subject": "Order status inquiry",
            "content": "Called about PO-2026-00050...",
            "contacted_by": "John Staff",
            "related_po": "PO-2026-00050",
            "follow_up_needed": true,
            "follow_up_date": "2026-01-25"
        },
        // More communications...
    ],
    "total": 25
}
```

### Expected Outcome
- Communication timeline retrieval
- Filtering capabilities
- Chronological history

### Verification Checklist
- [ ] Method implemented
- [ ] Filtering added
- [ ] Timeline formatted correctly

---

## Notes for AI Agents

### Communication Best Practices
- Log all significant vendor interactions
- Include context and outcomes
- Set follow-up dates for pending items
- Link to related POs when applicable
- Mark follow-ups complete when done

### Communication Search
Index subject and content fields for full-text search capability.

### Timeline Usage
- Vendor detail page
- Audit trail
- Relationship management
- Dispute resolution
- Performance analysis
