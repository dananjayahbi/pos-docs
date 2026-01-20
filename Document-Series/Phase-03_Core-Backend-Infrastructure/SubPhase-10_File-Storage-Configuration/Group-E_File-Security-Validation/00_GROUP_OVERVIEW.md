# Group E: File Security & Validation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** E of F  
> **Tasks Covered:** 61-74  
> **Group Goal:** Implement file validation, security scanning, and cleanup utilities

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Image-Processing-Pipeline/](../Group-D_Image-Processing-Pipeline/)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Group Overview

This group implements file security and validation to prevent malicious uploads and enforce size limits. It includes extension validation, MIME type checking, size limits, and a cleanup utility for orphaned files.

### Key Outcomes
- FileValidator class created
- Extension, size, MIME type validation ready
- Malware scanning hooks in place
- Allowed extensions configured per type
- Size limits defined per file type
- Cleanup utility for orphaned files
- cleanmedia management command ready

### Technology Context
- **Module:** apps/core/storage/validators.py
- **Image Extensions:** jpg, jpeg, png, gif, webp
- **Document Extensions:** pdf, doc, docx, xls, xlsx
- **Max Image Size:** 5 MB
- **Max Document Size:** 25 MB

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-61-66_FileValidator-Class.md | 61-66 | Create validators.py, FileValidator class, validate_extension, validate_size, validate_mime_type, scan_for_malware |
| 02 | 02_Tasks-67-72_Extension-Size-Config.md | 67-72 | Allowed extensions config, IMAGE_EXTENSIONS, DOCUMENT_EXTENSIONS, max size config, MAX_IMAGE_SIZE, MAX_DOCUMENT_SIZE |
| 03 | 03_Tasks-73-74_Cleanup-Command.md | 73-74 | Create file cleanup utility, cleanmedia management command |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 61 | Create validators.py File | Task 60 | Simple |
| 62 | Create FileValidator Class | Task 61 | Medium |
| 63 | Add validate_extension Method | Task 62 | Simple |
| 64 | Add validate_size Method | Task 63 | Simple |
| 65 | Add validate_mime_type Method | Task 64 | Medium |
| 66 | Add scan_for_malware Method | Task 65 | Complex |
| 67 | Create Allowed Extensions Config | Task 66 | Simple |
| 68 | Define IMAGE_EXTENSIONS | Task 67 | Simple |
| 69 | Define DOCUMENT_EXTENSIONS | Task 68 | Simple |
| 70 | Create Max Size Config | Task 69 | Simple |
| 71 | Define MAX_IMAGE_SIZE | Task 70 | Simple |
| 72 | Define MAX_DOCUMENT_SIZE | Task 71 | Simple |
| 73 | Create File Cleanup Utility | Task 72 | Medium |
| 74 | Create Management Command | Task 73 | Medium |

---

## Execution Order

```
01_Tasks-61-66_FileValidator-Class.md
        │
        ▼
02_Tasks-67-72_Extension-Size-Config.md
        │
        ▼
03_Tasks-73-74_Cleanup-Command.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── storage/
│   ├── __init__.py           # Updated exports
│   ├── validators.py         # FileValidator class
│   └── constants.py          # Extensions and size constants
├── management/
│   └── commands/
│       └── cleanmedia.py     # Orphan file cleanup command
```

---

## Notes for AI Agents

1. **MIME Check:** Use python-magic for accurate MIME detection
2. **Extension:** Check both extension and actual file content
3. **Size Limit:** Check before processing to save resources
4. **Malware:** Integrate ClamAV or VirusTotal API
5. **Cleanup:** Run periodically via Celery Beat
6. **Dry Run:** Support --dry-run flag for cleanmedia
7. **Git Commit:** Commit after completing this group
