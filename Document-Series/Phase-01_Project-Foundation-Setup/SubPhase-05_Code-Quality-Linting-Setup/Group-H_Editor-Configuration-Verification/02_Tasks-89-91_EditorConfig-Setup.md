# Tasks 89-91: EditorConfig Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** H - Editor Configuration & Verification  
> **Document:** 02 of 03  
> **Tasks Covered:** 89, 90, 91

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-83-88_VSCode-Setup.md](01_Tasks-83-88_VSCode-Setup.md)
- **→ Next Document:** [03_Tasks-92-94_Final-Verification.md](03_Tasks-92-94_Final-Verification.md)

---

## Document Overview

This document covers EditorConfig setup for universal editor support.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 89 | Create .editorconfig | Medium |
| 90 | Configure Indent Style | Simple |
| 91 | Configure End of Line | Simple |

---

## Task 89: Create .editorconfig

### Overview
Create EditorConfig file for universal editor settings.

### Dependencies
- Task 01: Monorepo structure exists

### Instructions

1. **Create .editorconfig**
   - At repository root

2. **Add root directive**
   - Mark as root config

3. **Add base settings**
   - Charset, final newline

### File Location

```
/                            # Repository root
├── .editorconfig            # EditorConfig file
├── .vscode/
├── backend/
├── frontend/
└── ...
```

### Initial .editorconfig

```ini
# ==================================================
# LankaCommerce Cloud - EditorConfig
# ==================================================
# https://editorconfig.org
# ==================================================

# Top-most EditorConfig file
root = true

# Default for all files
[*]
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true
```

### Why EditorConfig

| Feature | Benefit |
|---------|---------|
| Universal | Works with any editor |
| Portable | No editor dependency |
| Simple | INI file format |
| Override | Per-directory settings |

### Supported Editors

| Editor | Support |
|--------|---------|
| VS Code | Via extension |
| JetBrains | Built-in |
| Sublime Text | Via package |
| Vim | Via plugin |
| Atom | Via package |

### Root Directive

```ini
root = true
```
This tells editors to stop searching parent directories.

### Expected Outcome
- .editorconfig created
- Base settings defined

### Verification Checklist
- [ ] File at repository root
- [ ] root = true set
- [ ] charset = utf-8
- [ ] insert_final_newline = true

---

## Task 90: Configure Indent Style

### Overview
Configure indentation settings for different file types.

### Dependencies
- Task 89: .editorconfig exists

### Instructions

1. **Set default indent**
   - Spaces, 2 spaces

2. **Python indent**
   - 4 spaces (PEP 8)

3. **Makefile indent**
   - Tabs required

### .editorconfig Additions

```ini
# Default for all files
[*]
indent_style = space
indent_size = 2

# Python files - 4 spaces (PEP 8)
[*.py]
indent_size = 4

# Makefiles require tabs
[Makefile]
indent_style = tab

[*.mk]
indent_style = tab
```

### Indent Settings by Language

| File Type | Style | Size |
|-----------|-------|------|
| Default | space | 2 |
| Python (.py) | space | 4 |
| Makefile | tab | - |
| JavaScript (.js, .jsx) | space | 2 |
| TypeScript (.ts, .tsx) | space | 2 |
| JSON | space | 2 |
| YAML | space | 2 |
| Markdown | space | 2 |

### Why Different Sizes

| Language | Size | Reason |
|----------|------|--------|
| Python | 4 | PEP 8 standard |
| JavaScript | 2 | Industry convention |
| YAML | 2 | Readability |
| Makefile | tab | Required by Make |

### Full File Type Configuration

```ini
# Frontend files - 2 spaces
[*.{js,jsx,ts,tsx}]
indent_size = 2

# Configuration files
[*.{json,yml,yaml}]
indent_size = 2

# Documentation
[*.md]
indent_size = 2
trim_trailing_whitespace = false

# Shell scripts
[*.sh]
indent_size = 4

# Docker files
[Dockerfile*]
indent_size = 4
```

### Expected Outcome
- Indent style configured
- All file types covered

### Verification Checklist
- [ ] Default indent set
- [ ] Python 4 spaces
- [ ] Makefile tabs
- [ ] Frontend 2 spaces

---

## Task 91: Configure End of Line

### Overview
Configure line ending settings for cross-platform compatibility.

### Dependencies
- Task 89: .editorconfig exists

### Instructions

1. **Set default EOL**
   - LF (Unix style)

2. **Windows batch files**
   - CRLF required

3. **Max line length**
   - 88 for Python, 120 for others

### .editorconfig Additions

```ini
# Default for all files
[*]
end_of_line = lf

# Windows batch files need CRLF
[*.bat]
end_of_line = crlf

[*.cmd]
end_of_line = crlf

# PowerShell
[*.ps1]
end_of_line = crlf

# Max line length
[*]
max_line_length = 120

[*.py]
max_line_length = 88
```

### Line Endings

| Type | Name | Bytes | OS |
|------|------|-------|-----|
| LF | Unix | 0x0A | Linux, macOS, Git |
| CRLF | Windows | 0x0D 0x0A | Windows |
| CR | Classic Mac | 0x0D | Legacy |

### Why LF Default

| Reason | Benefit |
|--------|---------|
| Git default | Clean diffs |
| Linux servers | No conversion |
| Most tools | Better support |

### Git Configuration

Also configure in .gitattributes:
```
* text=auto eol=lf
*.bat text eol=crlf
*.cmd text eol=crlf
```

### Expected Outcome
- Line endings configured
- Cross-platform support

### Verification Checklist
- [ ] Default LF set
- [ ] Windows files CRLF
- [ ] max_line_length set

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 89 | Create .editorconfig | EditorConfig file |
| 90 | Configure Indent Style | Indentation settings |
| 91 | Configure End of Line | Line ending settings |

### Complete .editorconfig

```ini
# ==================================================
# LankaCommerce Cloud - EditorConfig
# ==================================================
# https://editorconfig.org
# ==================================================

# Top-most EditorConfig file
root = true

# Default for all files
[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
max_line_length = 120

# Python files - 4 spaces, 88 char lines (PEP 8 / Black)
[*.py]
indent_size = 4
max_line_length = 88

# Frontend files - 2 spaces
[*.{js,jsx,ts,tsx}]
indent_size = 2

# Configuration files
[*.{json,yml,yaml,toml}]
indent_size = 2

# Documentation - preserve trailing spaces for line breaks
[*.md]
indent_size = 2
trim_trailing_whitespace = false

# Shell scripts
[*.sh]
indent_size = 4

# Makefiles require tabs
[Makefile]
indent_style = tab

[*.mk]
indent_style = tab

# Docker files
[Dockerfile*]
indent_size = 4

# Windows files need CRLF
[*.{bat,cmd}]
end_of_line = crlf

[*.ps1]
end_of_line = crlf
```

### File Types Summary

| Pattern | Indent | EOL | Max Line |
|---------|--------|-----|----------|
| * (default) | 2 spaces | LF | 120 |
| *.py | 4 spaces | LF | 88 |
| *.{js,jsx,ts,tsx} | 2 spaces | LF | 120 |
| *.md | 2 spaces | LF | - |
| Makefile | tabs | LF | - |
| *.{bat,cmd} | 2 spaces | CRLF | - |

### Next Steps
Proceed to [03_Tasks-92-94_Final-Verification.md](03_Tasks-92-94_Final-Verification.md) for final verification.

---

## Notes for AI Agents

1. **Location:** .editorconfig at repository root
2. **root = true:** Always include
3. **Python:** 4 spaces, 88 max line
4. **Frontend:** 2 spaces
5. **Makefile:** Must use tabs
6. **Windows:** CRLF for batch files
7. **Markdown:** Keep trailing whitespace for breaks
