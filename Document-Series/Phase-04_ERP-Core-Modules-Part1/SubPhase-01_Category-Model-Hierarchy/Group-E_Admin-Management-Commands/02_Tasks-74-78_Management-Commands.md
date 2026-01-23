# Tasks 74-78: Management Commands

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** E - Admin & Management Commands  
> **Document:** 02 of 02  
> **Tasks Covered:** 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-73_Admin-Configuration.md](01_Tasks-65-73_Admin-Configuration.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers creating Django management commands for seeding demo data, rebuilding tree structure, and importing/exporting categories.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 74 | Create Management Commands | Low |
| 75 | Create seed_categories Command | Medium |
| 76 | Create rebuild_tree Command | Medium |
| 77 | Create export_categories Command | Medium |
| 78 | Create import_categories Command | High |

---

## Task 74: Create Management Commands

### Overview
Create the management/commands directory structure for custom commands.

### Dependencies
- Task 73: Enable Drag-Drop Reordering

### Instructions

1. **Create management directory**
   - Path: backend/apps/categories/management/
   - Django looks for this structure

2. **Create __init__.py in management**
   - Makes it a Python package

3. **Create commands subdirectory**
   - Path: backend/apps/categories/management/commands/

4. **Create __init__.py in commands**
   - Makes it a Python package

5. **Verify structure**
   - Django can now find custom commands

### Expected Structure
```
backend/apps/categories/
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       ├── seed_categories.py       # Task 75
│       ├── rebuild_tree.py          # Task 76
│       ├── export_categories.py     # Task 77
│       └── import_categories.py     # Task 78
```

### Verification Steps
- Check directory structure created
- Verify __init__.py files exist
- Test Django finds commands directory

---

## Task 75: Create seed_categories Command

### Overview
Create management command to seed database with demo category data for Sri Lankan businesses.

### Dependencies
- Task 74: Create Management Commands

### Instructions

1. **Create seed_categories.py file**
   - Import BaseCommand from django.core.management.base
   - Import Category model

2. **Define Command class**
   - Inherit from BaseCommand
   - Add help text

3. **Implement handle method**
   - Create root categories
   - Create child categories
   - Create nested categories

4. **Add Sri Lankan business categories**
   - Electronics (Mobile, Laptops, etc.)
   - Food & Grocery (Rice, Spices, etc.)
   - Clothing (Traditional, Modern)
   - Hardware (Construction, Tools)
   - Ayurveda & Traditional Medicine

5. **Handle existing data**
   - Check if categories already exist
   - Skip or update existing
   - Add --clear flag to delete existing

6. **Add output messages**
   - Show progress during seeding
   - Report created categories count
   - Show any errors

### Sri Lankan Category Examples
```
Electronics
├── Mobile Phones
│   ├── Smartphones
│   └── Feature Phones
├── Laptops & Computers
└── Home Appliances

Food & Grocery
├── Rice & Grains
│   ├── Samba Rice
│   ├── Basmati Rice
│   └── Red Rice
├── Spices
│   ├── Cinnamon (Ceylon)
│   ├── Pepper
│   └── Cardamom
└── Local Products

Clothing
├── Traditional Wear
│   ├── Sarees
│   └── National Dress
└── Modern Fashion
```

### Command Usage
```
python manage.py seed_categories
python manage.py seed_categories --clear  # Delete existing first
python manage.py seed_categories --tenant=abc123
```

### Expected Outcome
- Demo categories created
- Multi-level hierarchy
- Sri Lankan context included
- Useful for testing and demos

---

## Task 76: Create rebuild_tree Command

### Overview
Create command to rebuild MPTT tree structure if it becomes corrupted.

### Dependencies
- Task 75: Create seed_categories Command

### Instructions

1. **Create rebuild_tree.py file**
   - Import BaseCommand
   - Import Category model

2. **Define Command class**
   - Add help text explaining purpose

3. **Implement handle method**
   - Use Category.objects.rebuild()
   - This is provided by MPPT

4. **Add verification**
   - Check tree structure before
   - Rebuild tree
   - Verify tree structure after

5. **Add output messages**
   - Report rebuild started
   - Show categories processed
   - Confirm completion

### When to Use rebuild_tree
| Scenario | When Needed |
|----------|-------------|
| **Manual Database Changes** | After direct SQL updates |
| **Data Import** | After bulk imports |
| **Corruption** | If tree structure broken |
| **Migration Issues** | After problematic migrations |

### Command Implementation Concept
```
Command does:
1. Call Category.objects.rebuild()
2. MPTT recalculates lft, rght, tree_id, level
3. Fixes any inconsistencies
4. Validates tree structure
```

### Command Usage
```
python manage.py rebuild_tree
python manage.py rebuild_tree --tenant=abc123
```

### Expected Outcome
- Tree structure recalculated
- MPTT fields corrected
- Tree validated
- Output confirms success

---

## Task 77: Create export_categories Command

### Overview
Create command to export categories to JSON file for backup or transfer.

### Dependencies
- Task 76: Create rebuild_tree Command

### Instructions

1. **Create export_categories.py file**
   - Import BaseCommand
   - Import Category model
   - Import json module

2. **Define Command class**
   - Add help text
   - Add command arguments (output file)

3. **Implement handle method**
   - Query all categories
   - Serialize to JSON format
   - Include all fields
   - Maintain parent relationships

4. **Add export format**
   - JSON with category data
   - Preserve tree structure
   - Include UUIDs for reference

5. **Add options**
   - --output: Specify output file
   - --active-only: Export only active
   - --root: Export subtree from specific root

6. **Handle file writing**
   - Create output directory if needed
   - Write JSON file
   - Handle write errors

### Export JSON Format
```
[
  {
    "id": "uuid-1",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "description": "...",
    "is_active": true,
    "display_order": 10,
    "children": [
      {
        "id": "uuid-2",
        "name": "Mobile Phones",
        "slug": "mobile-phones",
        "parent": "uuid-1",
        ...
      }
    ]
  }
]
```

### Command Usage
```
python manage.py export_categories
python manage.py export_categories --output=categories.json
python manage.py export_categories --active-only
python manage.py export_categories --tenant=abc123
```

### Expected Outcome
- JSON file created
- All categories exported
- Tree structure preserved
- Ready for import or backup

---

## Task 78: Create import_categories Command

### Overview
Create command to import categories from JSON file.

### Dependencies
- Task 77: Create export_categories Command

### Instructions

1. **Create import_categories.py file**
   - Import BaseCommand
   - Import Category model
   - Import json module

2. **Define Command class**
   - Add help text
   - Add command arguments (input file)

3. **Implement handle method**
   - Read JSON file
   - Parse category data
   - Create categories in correct order
   - Handle parent relationships

4. **Handle parent references**
   - Create root categories first
   - Then create children
   - Maintain UUID relationships
   - Or rebuild based on parent names

5. **Add import strategies**
   - --clear: Delete existing first
   - --update: Update existing, create new
   - --skip-existing: Only create new

6. **Add validation**
   - Validate JSON format
   - Check required fields
   - Verify parent existence
   - Handle errors gracefully

7. **Add output messages**
   - Show import progress
   - Report created/updated counts
   - Show any errors

### Import Process Flow
```
1. Read and parse JSON file
2. Validate file format
3. Create root categories (parent=null)
4. Create level 1 children
5. Create level 2 children
6. Continue until all imported
7. Rebuild tree structure
8. Verify import success
```

### Parent Resolution Strategies
| Strategy | Description |
|----------|-------------|
| **UUID Matching** | Match by UUID (if same system) |
| **Name Matching** | Match by name (cross-system) |
| **Path Matching** | Match by full path |
| **Create New** | Always create new |

### Command Usage
```
python manage.py import_categories categories.json
python manage.py import_categories categories.json --clear
python manage.py import_categories categories.json --update
python manage.py import_categories categories.json --tenant=abc123
```

### Expected Outcome
- Categories imported successfully
- Tree structure maintained
- Parent relationships preserved
- No duplicate categories

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 74 | Create Management Commands | Commands directory structure |
| 75 | Create seed_categories Command | Demo data seeding |
| 76 | Create rebuild_tree Command | Tree structure repair |
| 77 | Create export_categories Command | JSON export functionality |
| 78 | Create import_categories Command | JSON import functionality |

### Management Commands Created
```
Commands:
├── seed_categories      # Create demo data
├── rebuild_tree         # Fix tree structure
├── export_categories    # Backup to JSON
└── import_categories    # Restore from JSON
```

### Command Usage Summary
```
# Seed demo data
python manage.py seed_categories

# Fix tree structure
python manage.py rebuild_tree

# Export to file
python manage.py export_categories --output=backup.json

# Import from file
python manage.py import_categories backup.json
```

### Group E Complete
All 14 tasks in Group E documented:
- Admin interface with MPTT display
- Drag-drop reordering enabled
- Four management commands created
- Demo data, backup, and maintenance tools

### Dependencies Satisfied for Group F
- Complete admin interface
- Management commands ready
- Ready for testing and documentation

### Next Steps
Proceed to [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/) to create comprehensive tests and documentation.

---

## Notes for AI Agents

1. **Directory Structure:** Must follow Django conventions
2. **BaseCommand:** All commands inherit from this
3. **handle Method:** Entry point for command logic
4. **seed_categories:** Include Sri Lankan business context
5. **rebuild_tree:** Uses MPTT's rebuild() method
6. **Export/Import:** Preserve tree structure and relationships
7. **Parent Resolution:** Handle parent references carefully
8. **Error Handling:** Graceful error handling in all commands
9. **Tenant Context:** Support multi-tenant operations
10. **Next Group:** Final group with tests and documentation
