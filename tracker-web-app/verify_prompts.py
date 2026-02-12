import json
from pathlib import Path
from typing import Dict, List, Tuple


def load_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def build_prompt(template: str, phase: str, subphase: str, group: str, task_file_name_without_ext: str) -> str:
    return (
        template
        .replace('{{the-phase-folder-name}}', phase)
        .replace('{{sub-phase-folder-name}}', subphase)
        .replace('{{group-folder-name}}', group)
        .replace('{{task-file-name}}', task_file_name_without_ext)
    )


def verify_all(workspace_root: Path) -> Tuple[int, int, int, List[Dict[str, str]]]:
    tracker_root = workspace_root / 'tracker-web-app'
    docs_root = workspace_root / 'Document-Series'

    prompt_config_path = tracker_root / 'prompt.json'
    inventory_path = tracker_root / 'data-inventory.json'

    prompt_config = load_json(prompt_config_path)
    inventory = load_json(inventory_path)

    template = prompt_config.get('template', '')
    if not template:
        raise ValueError('prompt.json does not contain a template field')

    total = 0
    missing_docs = 0
    prompt_mismatch = 0
    issues: List[Dict[str, str]] = []

    phases = inventory.get('phases', [])
    for phase in phases:
        phase_name = phase.get('name', '')
        for subphase in phase.get('subphases', []):
            subphase_name = subphase.get('name', '')
            for group in subphase.get('groups', []):
                group_name = group.get('name', '')
                for file_item in group.get('files', []):
                    total += 1
                    relative_path = file_item.get('path', '').replace('/', '\\')
                    file_name = file_item.get('name', '')
                    task_name_no_ext = file_name[:-3] if file_name.lower().endswith('.md') else file_name

                    expected_doc_path = docs_root / Path(relative_path.replace('\\', '/'))
                    prompt = build_prompt(template, phase_name, subphase_name, group_name, task_name_no_ext)

                    expected_prompt_fragment = f'Document-Series\\{phase_name}\\{subphase_name}\\{group_name}\\{task_name_no_ext}.md'
                    if expected_prompt_fragment not in prompt:
                        prompt_mismatch += 1
                        issues.append({
                            'type': 'PROMPT_MISMATCH',
                            'file': relative_path,
                            'detail': 'Generated prompt does not contain expected document path fragment.'
                        })

                    if not expected_doc_path.exists():
                        missing_docs += 1
                        issues.append({
                            'type': 'MISSING_DOCUMENT',
                            'file': relative_path,
                            'detail': f'Expected file not found at {expected_doc_path}'
                        })

    report = {
        'total_files_checked': total,
        'missing_documents': missing_docs,
        'prompt_mismatches': prompt_mismatch,
        'issues_sample': issues[:50]
    }

    report_path = tracker_root / 'prompt-verification-report.json'
    with report_path.open('w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    return total, missing_docs, prompt_mismatch, issues


def main():
    workspace_root = Path(__file__).resolve().parent.parent
    total, missing_docs, prompt_mismatch, issues = verify_all(workspace_root)

    print('Prompt Verification Summary')
    print('-------------------------')
    print(f'Total files checked : {total}')
    print(f'Missing documents   : {missing_docs}')
    print(f'Prompt mismatches   : {prompt_mismatch}')
    print(f'Total issues logged : {len(issues)}')
    print('Report              : tracker-web-app/prompt-verification-report.json')

    if missing_docs > 0 or prompt_mismatch > 0:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
