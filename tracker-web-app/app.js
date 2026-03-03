// ============================================
// STORAGE MANAGEMENT
// ============================================

class StorageManager {
    constructor(dataModel) {
        this.storageKey = 'lcc_doc_tracker_progress';
        this.dataModel = dataModel;
        this.initializeStorage();
    }

    initializeStorage() {
        const existing = localStorage.getItem(this.storageKey);
        if (!existing) {
            const defaultData = {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                phases: {},
                files: {},
                fileMeta: {},
                uiState: {
                    phases: {},
                    subphases: {},
                    groups: {}
                },
                meta: {
                    lastCompletedFileKey: null,
                    lastCompletedGroupId: null,
                    lastCompletedPhaseId: null,
                    lastCompletedSubphaseId: null
                },
                stats: {
                    totalCompleted: 0,
                    totalItems: this.getTotalTaskFiles()
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
        }
    }

    getTotalGroups() {
        return this.dataModel.phases.reduce(
            (sum, phase) => sum + phase.subphases.reduce((subSum, sub) => subSum + sub.groups.length, 0),
            0
        );
    }

    getProgress() {
        const data = localStorage.getItem(this.storageKey);
        const parsed = data ? JSON.parse(data) : null;
        if (!parsed) return null;

        // Backward compatibility migrations
        if (!parsed.files) parsed.files = {};
        if (!parsed.fileMeta) parsed.fileMeta = {};
        if (!parsed.uiState) parsed.uiState = { phases: {}, subphases: {}, groups: {} };
        if (!parsed.uiState.phases) parsed.uiState.phases = {};
        if (!parsed.uiState.subphases) parsed.uiState.subphases = {};
        if (!parsed.uiState.groups) parsed.uiState.groups = {};
        if (!parsed.meta) {
            parsed.meta = {
                lastCompletedFileKey: null,
                lastCompletedGroupId: null,
                lastCompletedPhaseId: null,
                lastCompletedSubphaseId: null
            };
        }
        if (!parsed.stats) parsed.stats = { totalCompleted: 0, totalItems: this.getTotalTaskFiles() };

        // Backfill metadata for legacy checked files (for Focus Current fallback)
        const now = Date.now();
        let offset = 0;
        Object.entries(parsed.files).forEach(([fileKey, checked]) => {
            if (!checked) return;
            if (!parsed.fileMeta[fileKey]) {
                const [phaseId, subphaseId] = fileKey.split('::');
                parsed.fileMeta[fileKey] = {
                    completedAt: now + offset,
                    groupId: null,
                    phaseId: phaseId || null,
                    subphaseId: subphaseId || null
                };
                offset += 1;
            }
        });

        parsed.stats.totalCompleted = this.getCompletedFilesCount(parsed);
        parsed.stats.totalItems = this.getTotalTaskFiles();
        return parsed;
    }

    getTotalTaskFiles() {
        const total = this.dataModel.phases.reduce(
            (phaseTotal, phase) => phaseTotal + phase.subphases.reduce(
                (subTotal, subphase) => subTotal + subphase.groups.reduce(
                    (groupTotal, group) => groupTotal + (group.files?.length || 0),
                    0
                ),
                0
            ),
            0
        );

        return total > 0 ? total : this.getTotalGroups();
    }

    getCompletedFilesCount(progress = null) {
        const source = progress || this.getProgress();
        return Object.values(source.files || {}).filter(Boolean).length;
    }

    markFileCompletion(fileKey, isComplete, context = null) {
        const progress = this.getProgress();
        progress.files[fileKey] = Boolean(isComplete);

        if (isComplete && context) {
            progress.fileMeta[fileKey] = {
                completedAt: Date.now(),
                groupId: context.groupId || null,
                phaseId: context.phaseId || null,
                subphaseId: context.subphaseId || null
            };
        }

        if (!isComplete) {
            delete progress.fileMeta[fileKey];
        }

        progress.updatedAt = new Date().toISOString();
        progress.stats.totalCompleted = this.getCompletedFilesCount(progress);
        progress.stats.totalItems = this.getTotalTaskFiles();
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    isFileCompleted(fileKey) {
        const progress = this.getProgress();
        return Boolean(progress.files[fileKey]);
    }

    setUIState(section, key, value) {
        const progress = this.getProgress();
        if (!progress.uiState[section]) {
            progress.uiState[section] = {};
        }
        progress.uiState[section][key] = Boolean(value);
        progress.updatedAt = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    getUIState(section, key, defaultValue = false) {
        const progress = this.getProgress();
        if (!progress.uiState[section] || typeof progress.uiState[section][key] === 'undefined') {
            return defaultValue;
        }
        return Boolean(progress.uiState[section][key]);
    }

    getLastCompletedContext() {
        const progress = this.getProgress();
        const fallback = {
            lastCompletedFileKey: null,
            lastCompletedGroupId: null,
            lastCompletedPhaseId: null,
            lastCompletedSubphaseId: null
        };

        let latestKey = null;
        let latestMeta = null;
        let latestTs = -1;

        Object.entries(progress.fileMeta || {}).forEach(([fileKey, meta]) => {
            if (!progress.files[fileKey]) return;
            const ts = Number(meta?.completedAt || 0);
            if (ts > latestTs) {
                latestTs = ts;
                latestKey = fileKey;
                latestMeta = meta;
            }
        });

        if (!latestKey || !latestMeta) {
            return fallback;
        }

        return {
            lastCompletedFileKey: latestKey,
            lastCompletedGroupId: latestMeta.groupId || null,
            lastCompletedPhaseId: latestMeta.phaseId || null,
            lastCompletedSubphaseId: latestMeta.subphaseId || null
        };
    }

    markGroupComplete(phaseId, subphaseId, groupName) {
        const progress = this.getProgress();
        
        if (!progress.phases[phaseId]) {
            progress.phases[phaseId] = {};
        }
        if (!progress.phases[phaseId][subphaseId]) {
            progress.phases[phaseId][subphaseId] = [];
        }

        if (!progress.phases[phaseId][subphaseId].includes(groupName)) {
            progress.phases[phaseId][subphaseId].push(groupName);
        }

        progress.updatedAt = new Date().toISOString();
        progress.stats.totalCompleted = this.calculateTotalCompleted(progress);
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    markGroupIncomplete(phaseId, subphaseId, groupName) {
        const progress = this.getProgress();
        
        if (progress.phases[phaseId] && progress.phases[phaseId][subphaseId]) {
            progress.phases[phaseId][subphaseId] = 
                progress.phases[phaseId][subphaseId].filter(g => g !== groupName);
        }

        progress.updatedAt = new Date().toISOString();
        progress.stats.totalCompleted = this.calculateTotalCompleted(progress);
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    isGroupComplete(phaseId, subphaseId, groupName) {
        const progress = this.getProgress();
        return progress.phases[phaseId] && 
               progress.phases[phaseId][subphaseId] && 
               progress.phases[phaseId][subphaseId].includes(groupName);
    }

    calculateTotalCompleted(progress) {
        let count = 0;
        Object.values(progress.phases).forEach(phase => {
            Object.values(phase).forEach(subphase => {
                if (Array.isArray(subphase)) {
                    count += subphase.length;
                }
            });
        });
        return count;
    }

    getPhaseProgress(phaseId) {
        const progress = this.getProgress();
        const phaseData = this.dataModel.phases.find(p => p.id === phaseId);
        if (!phaseData) return 0;

        let totalGroups = 0;
        let completedGroups = 0;

        phaseData.subphases.forEach(sub => {
            totalGroups += sub.groups.length;
            if (progress.phases[phaseId] && progress.phases[phaseId][sub.id]) {
                completedGroups += progress.phases[phaseId][sub.id].length;
            }
        });

        return totalGroups === 0 ? 0 : Math.round((completedGroups / totalGroups) * 100);
    }

    getSubphaseProgress(phaseId, subphaseId) {
        const progress = this.getProgress();
        const phaseData = this.dataModel.phases.find(p => p.id === phaseId);
        if (!phaseData) return 0;

        const subphaseData = phaseData.subphases.find(s => s.id === subphaseId);
        if (!subphaseData) return 0;

        const totalGroups = subphaseData.groups.length;
        const completedGroups = (progress.phases[phaseId] && 
                                progress.phases[phaseId][subphaseId]) ? 
                                progress.phases[phaseId][subphaseId].length : 0;

        return totalGroups === 0 ? 0 : Math.round((completedGroups / totalGroups) * 100);
    }

    getOverallProgress() {
        const progress = this.getProgress();
        const total = this.getTotalTaskFiles();
        const completed = this.getCompletedFilesCount(progress);
        return total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2));
    }

    resetAllProgress() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    exportData() {
        const progress = this.getProgress();
        return JSON.stringify(progress, null, 2);
    }
}

// ============================================
// UI MANAGEMENT
// ============================================

class UIManager {
    constructor() {
        this.dataModel = this.normalizeDocumentationData();
        this.storage = new StorageManager(this.dataModel);
        this.groupFilesMap = this.createGroupFilesMap();
        this.promptConfig = {
            template: 'Think harder and do these and run flow.py again (python /e/My_GitHub_Repos/flow/flow.py):\n\n01. Good. Now, read the\n\n"Document-Series\\{{the-phase-folder-name}}\\{{sub-phase-folder-name}}\\{{group-folder-name}}\\{{task-file-name}}.md"\ndocument and implement its tasks for now. All the information and instructions will be there. After that, run flow.py again for my review.\n\nImportant: Update your to-do list for the listed tasks\nImportant: You must follow the currently implemented folder structure.\nImportant: You must use Subagents whenever necessary to manage the context window.\nImportant: Add the running flow.py task, especially to the tasks list\n\nVery Important: Do these and run flow.py again and wait for my review (python /e/My_GitHub_Repos/flow/flow.py).'
        };
        this.init();
        this.loadPromptConfig();
    }

    normalizeDocumentationData() {
        const source = DOCUMENTATION_DATA || { phases: [] };
        const phases = (source.phases || []).map((phase, phaseIndex) => {
            const phaseId = phase.id || `phase-${String(phase.order || phaseIndex + 1).padStart(2, '0')}`;
            const subphases = (phase.subphases || []).map((subphase, subIndex) => {
                const subphaseId = subphase.id || `${phaseId}-sub-${String(subphase.order || subIndex + 1).padStart(2, '0')}`;
                const groups = (subphase.groups || []).map((group) => {
                    if (typeof group === 'string') {
                        return { name: group, files: [] };
                    }
                    return {
                        name: group.name,
                        files: Array.isArray(group.files) ? group.files : []
                    };
                });

                return {
                    id: subphaseId,
                    name: subphase.name || subphaseId,
                    order: subphase.order || subIndex + 1,
                    groups
                };
            });

            return {
                id: phaseId,
                name: phase.name || phaseId,
                title: phase.title || phase.name || phaseId,
                description: phase.description || '',
                order: phase.order || phaseIndex + 1,
                subphases
            };
        });

        return { phases };
    }

    createGroupFilesMap() {
        const map = new Map();
        this.dataModel.phases.forEach((phase) => {
            phase.subphases.forEach((subphase) => {
                subphase.groups.forEach((group) => {
                    map.set(`${phase.id}::${subphase.id}::${group.name}`, group.files || []);
                });
            });
        });
        return map;
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.updateStats();
    }

    async loadPromptConfig() {
        try {
            const response = await fetch('prompt.json', { cache: 'no-store' });
            if (!response.ok) return;
            const config = await response.json();
            if (config && config.template) {
                this.promptConfig = config;
            }
        } catch (error) {
            // Ignore and use default template.
        }
    }

    escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    buildTaskPrompt(file) {
        const rawPath = (file.path || file.name || '').replaceAll('/', '\\');
        const pathWithoutExt = rawPath.replace(/\.md$/i, '');
        const segments = pathWithoutExt.split('\\').filter(Boolean);

        const phase = segments[0] || '';
        const subphase = segments[1] || '';
        const group = segments[2] || '';
        const task = segments[3] || '';

        const template = this.promptConfig.template || '';
        return template
            .replaceAll('{{the-phase-folder-name}}', phase)
            .replaceAll('{{sub-phase-folder-name}}', subphase)
            .replaceAll('{{group-folder-name}}', group)
            .replaceAll('{{task-file-name}}', task);
    }

    render() {
        const container = document.getElementById('phasesContainer');
        container.innerHTML = '';

        this.dataModel.phases.forEach(phase => {
            const phaseElement = this.createPhaseElement(phase);
            container.appendChild(phaseElement);
        });
    }

    createPhaseElement(phase) {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'phase';
        phaseDiv.id = phase.id;
        const phaseOpen = this.storage.getUIState('phases', phase.id, false);
        if (phaseOpen) {
            phaseDiv.classList.add('open');
        }

        const progress = this.storage.getPhaseProgress(phase.id);
        if (progress === 100) {
            phaseDiv.classList.add('completed');
        }
        const totalGroups = phase.subphases.reduce((sum, sub) => sum + sub.groups.length, 0);
        const completedGroups = this.storage.getProgress().phases[phase.id] ? 
            Object.values(this.storage.getProgress().phases[phase.id])
                .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0;

        phaseDiv.innerHTML = `
            <div class="phase-header">
                <div class="phase-header-left">
                    <div class="phase-icon">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <div class="phase-title">
                        <h2>${phase.name}</h2>
                        <p style="font-size: 0.875rem; color: var(--neutral-600); margin-top: 0.25rem;">${phase.title}</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--spacing-lg);">
                    <div class="phase-stats">
                        <div class="phase-stat">
                            <i class="fas fa-tasks"></i>
                            <span>${completedGroups}/${totalGroups} Groups</span>
                        </div>
                        <div class="phase-stat">
                            <i class="fas fa-layer-group"></i>
                            <span>${phase.subphases.length} Subphases</span>
                        </div>
                    </div>
                    <div class="phase-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${progress}%</span>
                    </div>
                </div>
                <div class="phase-toggle">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="phase-content">
                <div class="subphases">
                    ${phase.subphases.map(sub => this.createSubphaseElement(phase.id, sub)).join('')}
                </div>
            </div>
        `;

        phaseDiv.querySelector('.phase-header').addEventListener('click', () => {
            phaseDiv.classList.toggle('open');
            this.storage.setUIState('phases', phase.id, phaseDiv.classList.contains('open'));
        });

        return phaseDiv;
    }

    createSubphaseElement(phaseId, subphase) {
        const subphaseOpen = this.storage.getUIState('subphases', `${phaseId}::${subphase.id}`, false);
        const progress = this.storage.getSubphaseProgress(phaseId, subphase.id);
        const totalGroups = subphase.groups.length;
        const storageData = this.storage.getProgress();
        const completedGroups = (storageData.phases[phaseId] && storageData.phases[phaseId][subphase.id]) ?
            storageData.phases[phaseId][subphase.id].length : 0;

        return `
            <div class="subphase ${subphaseOpen ? 'open' : ''} ${progress === 100 ? 'completed' : ''}" data-phase-id="${phaseId}" data-subphase-id="${subphase.id}">
                <div class="subphase-header">
                    <div class="subphase-title">
                        <i class="fas fa-sitemap"></i>
                        <h3>${subphase.name}</h3>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <span style="font-size: 0.8rem; color: var(--neutral-500);">
                            <i class="fas fa-check-circle"></i> ${completedGroups}/${totalGroups}
                        </span>
                        <div class="subphase-toggle">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                <div class="subphase-content">
                    <div class="groups-list">
                        ${subphase.groups.map((group, idx) => {
                            const groupName = group.name;
                            return this.createGroupElement(phaseId, subphase.id, groupName, idx);
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createGroupElement(phaseId, subphaseId, groupName, index) {
        const isCompleted = this.storage.isGroupComplete(phaseId, subphaseId, groupName);
        const groupId = `${phaseId}-${subphaseId}-${index}`;
        const isGroupExpanded = this.storage.getUIState('groups', groupId, false);

        return `
            <div class="group ${isCompleted ? 'completed' : ''}" data-group-id="${groupId}" data-group-name="${groupName}">
                <div class="group-checkbox">
                    <input type="checkbox" id="${groupId}" ${isCompleted ? 'checked' : ''}>
                </div>
                <label class="group-name" for="${groupId}">
                    ${groupName}
                </label>
                <div class="group-expand ${isGroupExpanded ? 'expanded' : ''}" data-group-id="${groupId}">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            <div class="group-files" data-group-id="${groupId}" style="display: ${isGroupExpanded ? 'block' : 'none'};">
                <div class="files-loading">
                    <i class="fas fa-spinner fa-spin"></i> Loading files...
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Subphase toggle
        document.querySelectorAll('.subphase-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.subphase-toggle') || 
                    e.target.closest('.subphase-title')) {
                    const subphase = header.closest('.subphase');
                    subphase.classList.toggle('open');
                    const phaseId = subphase.getAttribute('data-phase-id');
                    const subphaseId = subphase.getAttribute('data-subphase-id');
                    this.storage.setUIState('subphases', `${phaseId}::${subphaseId}`, subphase.classList.contains('open'));
                }
            });
        });

        // Group expand button
        document.addEventListener('click', (e) => {
            const expandBtn = e.target.closest('.group-expand');
            if (expandBtn) {
                const groupId = expandBtn.getAttribute('data-group-id');
                const filesDiv = document.querySelector(`.group-files[data-group-id="${groupId}"]`);
                
                if (filesDiv) {
                    filesDiv.style.display = filesDiv.style.display === 'none' ? 'block' : 'none';
                    expandBtn.classList.toggle('expanded');
                    const isOpen = filesDiv.style.display === 'block';
                    this.storage.setUIState('groups', groupId, isOpen);
                    
                    // Load files if not already loaded
                    if (filesDiv.classList.contains('not-loaded')) {
                        this.loadGroupFiles(groupId, filesDiv);
                    }
                }
            }
        });

        // Clicking group row should also expand/collapse files
        document.addEventListener('click', (e) => {
            if (e.target.closest('.group-checkbox') || e.target.closest('.file-checkbox')) {
                return;
            }
            if (e.target.closest('.group-expand')) {
                return;
            }

            const groupRow = e.target.closest('.group');
            if (!groupRow) return;

            const groupId = groupRow.getAttribute('data-group-id');
            const expandBtn = groupRow.querySelector('.group-expand');
            const filesDiv = document.querySelector(`.group-files[data-group-id="${groupId}"]`);
            if (!filesDiv || !expandBtn) return;

            filesDiv.style.display = filesDiv.style.display === 'none' ? 'block' : 'none';
            expandBtn.classList.toggle('expanded');
            const isOpen = filesDiv.style.display === 'block';
            this.storage.setUIState('groups', groupId, isOpen);

            if (filesDiv.classList.contains('not-loaded')) {
                this.loadGroupFiles(groupId, filesDiv);
            }
        });

        // Group checkboxes - but prevent manual checking, only file completion
        document.querySelectorAll('.group-checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                // Prevent manual checking - only allow via file completion
                if (e.isTrusted) {
                    // This is a user-initiated event, prevent it
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    return;
                }

                const group = checkbox.closest('.group');
                const subphase = checkbox.closest('.subphase');
                const phaseId = subphase.getAttribute('data-phase-id');
                const subphaseId = subphase.getAttribute('data-subphase-id');
                const groupName = group.getAttribute('data-group-name');

                if (checkbox.checked) {
                    this.storage.markGroupComplete(phaseId, subphaseId, groupName);
                    group.classList.add('completed');
                } else {
                    this.storage.markGroupIncomplete(phaseId, subphaseId, groupName);
                    group.classList.remove('completed');
                }

                this.updateStats();
                this.updatePhaseProgress(phaseId);
            });
        });

        // Mark group files as not-loaded initially
        document.querySelectorAll('.group-files').forEach(filesDiv => {
            filesDiv.classList.add('not-loaded');
        });

        // Load files for groups restored in expanded state
        document.querySelectorAll('.group-files').forEach(filesDiv => {
            if (filesDiv.style.display !== 'none' && filesDiv.classList.contains('not-loaded')) {
                const groupId = filesDiv.getAttribute('data-group-id');
                this.loadGroupFiles(groupId, filesDiv);
            }
        });

        // Focus Current button
        document.getElementById('focusCurrentBtn').addEventListener('click', () => {
            this.focusCurrent();
        });

        // Header dropdown actions menu
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const actionsMenu = document.getElementById('actionsMenu');
        const headerMenu = document.getElementById('headerMenu');

        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = actionsMenu.hasAttribute('hidden');
            if (isHidden) {
                actionsMenu.removeAttribute('hidden');
                menuToggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                actionsMenu.setAttribute('hidden', '');
                menuToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', (e) => {
            if (!headerMenu.contains(e.target)) {
                actionsMenu.setAttribute('hidden', '');
                menuToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            actionsMenu.setAttribute('hidden', '');
            menuToggleBtn.setAttribute('aria-expanded', 'false');
            document.getElementById('resetModal').classList.add('show');
        });

        document.getElementById('confirmResetBtn').addEventListener('click', () => {
            this.storage.resetAllProgress();
            document.getElementById('resetModal').classList.remove('show');
            location.reload();
        });

        document.getElementById('cancelResetBtn').addEventListener('click', () => {
            document.getElementById('resetModal').classList.remove('show');
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('resetModal').classList.remove('show');
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            actionsMenu.setAttribute('hidden', '');
            menuToggleBtn.setAttribute('aria-expanded', 'false');
            const data = this.storage.exportData();
            document.getElementById('exportTextarea').value = data;
            document.getElementById('exportModal').classList.add('show');
        });

        document.getElementById('copyExportBtn').addEventListener('click', () => {
            const textarea = document.getElementById('exportTextarea');
            textarea.select();
            document.execCommand('copy');
            const btn = document.getElementById('copyExportBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });

        document.getElementById('closeExportModal').addEventListener('click', () => {
            document.getElementById('exportModal').classList.remove('show');
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.id === 'resetModal') {
                document.getElementById('resetModal').classList.remove('show');
            }
            if (e.target.id === 'exportModal') {
                document.getElementById('exportModal').classList.remove('show');
            }
        });
    }

    updateStats() {
        const overall = this.storage.getOverallProgress();
        document.getElementById('overallProgress').textContent = overall.toFixed(2) + '%';
    }

    loadGroupFiles(groupId, filesDiv) {
        // Find the group data from the inventory
        const groupElement = document.querySelector(`.group[data-group-id="${groupId}"]`);
        if (!groupElement) return;

        const groupName = groupElement.getAttribute('data-group-name');
        const subphaseElement = groupElement.closest('.subphase');
        const phaseId = subphaseElement?.getAttribute('data-phase-id');
        const subphaseId = subphaseElement?.getAttribute('data-subphase-id');
        
        console.log('🔍 Loading files for group:', groupName);
        
        // Get files from DOCUMENTATION_DATA (the actual inventory)
        const files = this.findFilesForGroup(phaseId, subphaseId, groupName);
        
        if (files && files.length > 0) {
            console.log('✅ Found', files.length, 'files for group:', groupName);
            this.renderGroupFiles(filesDiv, files, groupId, phaseId, subphaseId, groupName);
            filesDiv.classList.remove('not-loaded');
        } else {
            // Fallback: show no files message
            console.warn('⚠️ No files found for group:', groupName);
            filesDiv.innerHTML = `
                <div class="files-list">
                    <div class="file-item placeholder">
                        <i class="fas fa-info-circle"></i>
                        <span>No task files found for: ${groupName}</span>
                    </div>
                </div>
            `;
            filesDiv.classList.remove('not-loaded');
        }
    }

    findFilesForGroup(phaseId, subphaseId, groupName) {
        const exactKey = `${phaseId}::${subphaseId}::${groupName}`;
        if (this.groupFilesMap.has(exactKey)) {
            return this.groupFilesMap.get(exactKey);
        }

        // Fallback: search by group name only (for legacy progress entries)
        for (const [key, files] of this.groupFilesMap.entries()) {
            if (key.endsWith(`::${groupName}`)) {
                return files;
            }
        }

        console.warn('⚠️ No group found for:', groupName, 'in', phaseId, subphaseId);
        return [];
    }

    getFileKey(phaseId, subphaseId, groupName, file, index) {
        const fileIdentifier = file.path || file.name || `file-${index}`;
        return `${phaseId}::${subphaseId}::${groupName}::${fileIdentifier}`;
    }

    setGroupCompletion(groupElementId, phaseId, subphaseId, groupName, isComplete) {
        const groupEl = document.querySelector(`.group[data-group-id="${groupElementId}"]`);
        if (!groupEl) return;

        const groupCheckbox = groupEl.querySelector('input[type="checkbox"]');
        if (groupCheckbox) {
            groupCheckbox.checked = isComplete;
        }

        if (isComplete) {
            groupEl.classList.add('completed');
            this.storage.markGroupComplete(phaseId, subphaseId, groupName);
        } else {
            groupEl.classList.remove('completed');
            this.storage.markGroupIncomplete(phaseId, subphaseId, groupName);
        }

        this.updateStats();
        this.updatePhaseProgress(phaseId);
    }

    renderGroupFiles(filesDiv, files, groupId, phaseId, subphaseId, groupName) {
        const filesHTML = files.map((file, idx) => `
            <div class="file-item" data-file-id="${groupId}-${idx}">
                <div class="file-checkbox">
                    <input type="checkbox" id="file-${groupId}-${idx}" data-group-id="${groupId}" data-group-name="${groupName}" data-file-key="${this.getFileKey(phaseId, subphaseId, groupName, file, idx)}">
                </div>
                <div class="file-icon">
                    <i class="fas fa-file-lines"></i>
                </div>
                <div class="file-meta">
                    <label class="file-name" for="file-${groupId}-${idx}">
                        ${this.escapeHtml(file.display_name || file.name)}
                    </label>
                    <details class="file-prompt-block">
                        <summary class="file-prompt-summary">
                            <span><i class="fas fa-terminal"></i> Prompt</span>
                            <button type="button" class="copy-prompt-btn" data-prompt="${encodeURIComponent(this.buildTaskPrompt(file))}">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </summary>
                        <pre class="file-prompt-text">${this.escapeHtml(this.buildTaskPrompt(file))}</pre>
                    </details>
                </div>
            </div>
        `).join('');

        filesDiv.innerHTML = `
            <div class="files-list">
                ${filesHTML}
            </div>
        `;

        // Attach checkboxes listeners
        filesDiv.querySelectorAll('.file-checkbox input').forEach(checkbox => {
            const fileKey = checkbox.getAttribute('data-file-key');
            const isCompleted = this.storage.isFileCompleted(fileKey);
            checkbox.checked = isCompleted;
            if (isCompleted) {
                checkbox.closest('.file-item').classList.add('completed');
            }

            checkbox.addEventListener('change', (e) => {
                const fileItem = checkbox.closest('.file-item');
                const groupElementId = checkbox.getAttribute('data-group-id');
                const groupElementName = checkbox.getAttribute('data-group-name');
                const fileKey = checkbox.getAttribute('data-file-key');
                
                if (checkbox.checked) {
                    fileItem.classList.add('completed');
                } else {
                    fileItem.classList.remove('completed');
                }

                this.storage.markFileCompletion(fileKey, checkbox.checked, {
                    groupId: groupElementId,
                    phaseId,
                    subphaseId
                });

                // Check if all files in group are completed
                const allCheckboxes = filesDiv.querySelectorAll('.file-checkbox input');
                const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
                
                this.setGroupCompletion(
                    groupElementId,
                    phaseId,
                    subphaseId,
                    groupElementName,
                    allChecked && allCheckboxes.length > 0
                );
            });
        });

        // Copy prompt buttons
        filesDiv.querySelectorAll('.copy-prompt-btn').forEach(copyBtn => {
            copyBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const promptText = decodeURIComponent(copyBtn.getAttribute('data-prompt') || '');

                try {
                    await navigator.clipboard.writeText(promptText);
                    const original = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                    setTimeout(() => {
                        copyBtn.innerHTML = original;
                    }, 1200);
                } catch (error) {
                    const textArea = document.createElement('textarea');
                    textArea.value = promptText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
            });
        });

        // Initial group sync when files are first rendered
        const allCheckboxes = filesDiv.querySelectorAll('.file-checkbox input');
        const allChecked = allCheckboxes.length > 0 && Array.from(allCheckboxes).every(cb => cb.checked);
        this.setGroupCompletion(groupId, phaseId, subphaseId, groupName, allChecked);
    }

    focusCurrent() {
        const lastContext = this.storage.getLastCompletedContext();
        const fileKey = lastContext.lastCompletedFileKey;

        if (!fileKey) {
            return;
        }

        let groupId = lastContext.lastCompletedGroupId;
        const phaseId = lastContext.lastCompletedPhaseId;
        const subphaseId = lastContext.lastCompletedSubphaseId;
        const keyParts = (fileKey || '').split('::');
        const groupNameFromKey = keyParts.length >= 4 ? keyParts[2] : null;

        if (!groupId && phaseId && subphaseId && groupNameFromKey) {
            const fallbackGroup = document.querySelector(
                `.subphase[data-phase-id="${phaseId}"][data-subphase-id="${subphaseId}"] .group[data-group-name="${groupNameFromKey}"]`
            );
            if (fallbackGroup) {
                groupId = fallbackGroup.getAttribute('data-group-id');
            }
        }

        // Collapse everything first, then focus only target branch
        document.querySelectorAll('.phase').forEach((phaseEl) => {
            phaseEl.classList.remove('open');
            this.storage.setUIState('phases', phaseEl.id, false);
        });
        document.querySelectorAll('.subphase').forEach((subEl) => {
            subEl.classList.remove('open');
            const pId = subEl.getAttribute('data-phase-id');
            const sId = subEl.getAttribute('data-subphase-id');
            this.storage.setUIState('subphases', `${pId}::${sId}`, false);
        });
        document.querySelectorAll('.group-files').forEach((filesDiv) => {
            filesDiv.style.display = 'none';
            this.storage.setUIState('groups', filesDiv.getAttribute('data-group-id'), false);
        });
        document.querySelectorAll('.group-expand').forEach((expandEl) => {
            expandEl.classList.remove('expanded');
        });

        if (phaseId) {
            const phaseEl = document.getElementById(phaseId);
            if (phaseEl) {
                phaseEl.classList.add('open');
                this.storage.setUIState('phases', phaseId, true);
            }
        }

        if (phaseId && subphaseId) {
            const subphaseEl = document.querySelector(`.subphase[data-phase-id="${phaseId}"][data-subphase-id="${subphaseId}"]`);
            if (subphaseEl) {
                subphaseEl.classList.add('open');
                this.storage.setUIState('subphases', `${phaseId}::${subphaseId}`, true);
            }
        }

        if (groupId) {
            const filesDiv = document.querySelector(`.group-files[data-group-id="${groupId}"]`);
            const expandBtn = document.querySelector(`.group-expand[data-group-id="${groupId}"]`);
            if (filesDiv) {
                filesDiv.style.display = 'block';
                this.storage.setUIState('groups', groupId, true);
                if (expandBtn) {
                    expandBtn.classList.add('expanded');
                }
                if (filesDiv.classList.contains('not-loaded')) {
                    this.loadGroupFiles(groupId, filesDiv);
                }
            }
        }

        setTimeout(() => {
            const targetCheckbox = document.querySelector(`.file-checkbox input[data-file-key="${fileKey}"]`);
            if (targetCheckbox) {
                const fileItem = targetCheckbox.closest('.file-item');
                fileItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (fileItem) {
                    fileItem.classList.add('focus-highlight');
                    setTimeout(() => fileItem.classList.remove('focus-highlight'), 1800);
                }
            }
        }, 120);
    }

    updatePhaseProgress(phaseId) {
        const phaseElement = document.getElementById(phaseId);
        if (phaseElement) {
            const phase = this.dataModel.phases.find(p => p.id === phaseId);
            const progress = this.storage.getPhaseProgress(phaseId);
            const totalGroups = phase.subphases.reduce((sum, sub) => sum + sub.groups.length, 0);
            const storageData = this.storage.getProgress();
            const completedGroups = storageData.phases[phaseId] ? 
                Object.values(storageData.phases[phaseId])
                    .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0) : 0;

            phaseElement.querySelector('.progress-fill').style.width = progress + '%';
            phaseElement.querySelector('.progress-text').textContent = progress + '%';
            phaseElement.querySelector('.phase-stat span').textContent = `${completedGroups}/${totalGroups} Groups`;
            phaseElement.classList.toggle('completed', progress === 100);

            // Update subphase progress
            phaseElement.querySelectorAll('.subphase').forEach(subElement => {
                const subphaseId = subElement.getAttribute('data-subphase-id');
                const subphase = phase.subphases.find(s => s.id === subphaseId);
                const subProgress = this.storage.getSubphaseProgress(phaseId, subphaseId);
                const subCompleted = (storageData.phases[phaseId] && storageData.phases[phaseId][subphaseId]) ?
                    storageData.phases[phaseId][subphaseId].length : 0;
                const subTotal = subphase.groups.length;
                subElement.classList.toggle('completed', subProgress === 100);

                const statSpan = subElement.querySelector('[data-group-id]')?.parentElement?.nextElementSibling?.querySelector('.phase-stat span');
                if (statSpan) {
                    subElement.querySelector('.subphase-header span').textContent = 
                        `<i class="fas fa-check-circle"></i> ${subCompleted}/${subTotal}`;
                }
            });
        }
        this.updateStats();
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new UIManager();
});
