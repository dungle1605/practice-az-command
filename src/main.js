/**
 * Main Application Logic for AZ-Command Master
 * Microsoft AI-200 & Azure DevOps Practical Interactive Learning Platform
 */

import { LEVELS, CHALLENGES, QUIZ_QUESTIONS } from './data/challenges.js';
import { CHEATSHEET_SECTIONS } from './data/cheatsheet.js';
import { validateCommand } from './utils/commandValidator.js';
import { sounds } from './utils/audio.js';

class AzMasterApp {
  constructor() {
    this.storageKey = 'az_command_master_state_v2';
    this.state = this.loadState();
    this.currentHintLevel = 0;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentLevel: parsed.currentLevel || 1,
          currentChallengeId: parsed.currentChallengeId || CHALLENGES[0].id,
          completedChallenges: new Set(parsed.completedChallenges || []),
          xp: parsed.xp || 0,
          streak: parsed.streak || 0,
          quizAnswers: parsed.quizAnswers || {},
          soundEnabled: parsed.soundEnabled ?? true
        };
      }
    } catch {
      // Fallback
    }

    return {
      currentLevel: 1,
      currentChallengeId: CHALLENGES[0].id,
      completedChallenges: new Set(),
      xp: 0,
      streak: 0,
      quizAnswers: {},
      soundEnabled: true
    };
  }

  saveState() {
    try {
      const serialized = {
        currentLevel: this.state.currentLevel,
        currentChallengeId: this.state.currentChallengeId,
        completedChallenges: Array.from(this.state.completedChallenges),
        xp: this.state.xp,
        streak: this.state.streak,
        quizAnswers: this.state.quizAnswers,
        soundEnabled: this.state.soundEnabled
      };
      localStorage.setItem(this.storageKey, JSON.stringify(serialized));
    } catch {
      // Ignore quota errors
    }
  }

  initElements() {
    // Navigation Tabs
    this.navTabs = document.querySelectorAll('.nav-tab');
    this.tabViews = document.querySelectorAll('.tab-view');

    // Header stats
    this.headerXp = document.getElementById('header-xp');
    this.headerStreak = document.getElementById('header-streak');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnReset = document.getElementById('btn-reset-progress');

    // Practice View Elements
    this.levelSelectorContainer = document.getElementById('level-selector-container');
    this.currentLevelBadge = document.getElementById('current-level-badge');
    this.currentLevelTitle = document.getElementById('current-level-title');
    this.currentLevelTagline = document.getElementById('current-level-tagline');
    this.questionPills = document.getElementById('question-pills');

    this.challengeDiff = document.getElementById('challenge-diff');
    this.challengeCat = document.getElementById('challenge-cat');
    this.challengeIndexText = document.getElementById('challenge-index-text');
    this.challengeTitle = document.getElementById('challenge-title');
    this.challengeMission = document.getElementById('challenge-mission');
    this.grammarFormula = document.getElementById('grammar-formula');
    this.grammarBreakdown = document.getElementById('grammar-breakdown');
    this.tokensList = document.getElementById('tokens-list');
    this.paramsExplanationContent = document.getElementById('params-explanation-content');
    this.examNotesContent = document.getElementById('exam-notes-content');

    this.btnShowHint = document.getElementById('btn-show-hint');
    this.hintCounter = document.getElementById('hint-counter');
    this.btnRevealSolution = document.getElementById('btn-reveal-solution');

    // Terminal Elements
    this.terminalHistory = document.getElementById('terminal-history');
    this.terminalInput = document.getElementById('terminal-input');
    this.btnRunCommand = document.getElementById('btn-run-command');
    this.btnClearTerm = document.getElementById('btn-clear-term');
    this.btnCopyInput = document.getElementById('btn-copy-input');
    this.autocompleteDropdown = document.getElementById('autocomplete-dropdown');

    this.btnPrevChallenge = document.getElementById('btn-prev-challenge');
    this.btnNextChallenge = document.getElementById('btn-next-challenge');
    this.navStatusText = document.getElementById('nav-status-text');

    // Quiz View Elements
    this.quizScoreDisplay = document.getElementById('quiz-score-display');
    this.quizQuestionsList = document.getElementById('quiz-questions-list');

    // Cheatsheet View Elements
    this.cheatsheetSearchInput = document.getElementById('cheatsheet-search-input');
    this.cheatsheetSectionsWrapper = document.getElementById('cheatsheet-sections-wrapper');

    // Stats View Elements
    this.statsRankAvatar = document.getElementById('stats-rank-avatar');
    this.statsRankName = document.getElementById('stats-rank-name');
    this.statsRankDesc = document.getElementById('stats-rank-desc');
    this.statsOverallPercent = document.getElementById('stats-overall-percent');
    this.statsLevelGrid = document.getElementById('stats-level-grid');
    this.statsBadgesGrid = document.getElementById('stats-badges-grid');

    // Toast Container
    this.toastContainer = document.getElementById('toast-container');
  }

  bindEvents() {
    // Tab switching
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Sound toggle
    this.btnSoundToggle.addEventListener('click', () => {
      this.state.soundEnabled = sounds.toggle();
      this.soundIcon.textContent = this.state.soundEnabled ? '🔊' : '🔇';
      this.showToast(this.state.soundEnabled ? 'Đã bật âm thanh' : 'Đã tắt âm thanh', 'info');
      this.saveState();
    });

    // Reset progress
    this.btnReset.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến trình học và điểm XP về 0?')) {
        this.state.completedChallenges = new Set();
        this.state.xp = 0;
        this.state.streak = 0;
        this.state.quizAnswers = {};
        this.state.currentLevel = 1;
        this.state.currentChallengeId = CHALLENGES[0].id;
        this.saveState();
        this.render();
        this.showToast('Đã đặt lại tiến trình học!', 'info');
      }
    });

    // Terminal Run
    this.btnRunCommand.addEventListener('click', () => this.handleRunCommand());

    // Terminal Keydown (Enter to run, Tab to autocomplete, Ctrl+L to clear, Escape to dismiss dropdown)
    this.dashDeletedFromDoubleDash = null;
    this.recentDoubleDash = null;
    this._isComposing = false; // Track IME composition state
    this._sanitizeTimer = null; // Debounce timer for post-composition cleanup

    // Track IME composition lifecycle to prevent interference with Vietnamese/CJK input
    this.terminalInput.addEventListener('compositionstart', () => {
      this._isComposing = true;
    });
    this.terminalInput.addEventListener('compositionend', () => {
      this._isComposing = false;
      // Run deferred text transformations after composition completes
      this._scheduleSanitize();
    });

    this.terminalInput.addEventListener('keydown', (e) => {
      // Skip all special key handling during IME composition
      if (e.isComposing || this._isComposing) {
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.hideAutocompleteDropdown();
        this.handleRunCommand();
        return;
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabAutocomplete();
        return;
      } else if (e.key === 'Escape') {
        this.hideAutocompleteDropdown();
        return;
      } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        this.clearTerminal();
        return;
      } else if (e.key === 'Backspace') {
        const val = this.terminalInput.value;
        const cursor = this.terminalInput.selectionStart;
        if (cursor >= 2 && val.slice(cursor - 2, cursor) === '--') {
          this.dashDeletedFromDoubleDash = { time: Date.now(), pos: cursor };
        }
      }
      sounds.playKeypress();
    });

    // Auto-resize and intelligent IME / double-dash anti-ghosting on input
    this.terminalInput.addEventListener('input', (e) => this.handleTerminalInput(e));

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.autocompleteDropdown && 
          !this.terminalInput.contains(e.target) && 
          !this.autocompleteDropdown.contains(e.target)) {
        this.hideAutocompleteDropdown();
      }
    });

    // Clear and Copy buttons
    this.btnClearTerm.addEventListener('click', () => this.clearTerminal());
    this.btnCopyInput.addEventListener('click', () => {
      const text = this.terminalInput.value.trim();
      if (!text) {
        this.showToast('Terminal đang trống!', 'error');
        return;
      }
      navigator.clipboard.writeText(text);
      this.showToast('Đã sao chép lệnh vào clipboard!', 'success');
    });

    // Hint and Solution
    this.btnShowHint.addEventListener('click', () => this.handleShowHint());
    this.btnRevealSolution.addEventListener('click', () => this.handleRevealSolution());

    // Navigation buttons
    this.btnPrevChallenge.addEventListener('click', () => this.navigateChallenge(-1));
    this.btnNextChallenge.addEventListener('click', () => this.navigateChallenge(1));

    // Cheatsheet live search
    this.cheatsheetSearchInput.addEventListener('input', (e) => {
      this.filterCheatsheet(e.target.value.toLowerCase().trim());
    });
  }

  getCurrentChallenge() {
    return CHALLENGES.find(c => c.id === this.state.currentChallengeId) || CHALLENGES[0];
  }

  switchTab(tabName) {
    this.navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    this.tabViews.forEach(view => {
      view.classList.toggle('active', view.id === `view-${tabName}`);
    });

    if (tabName === 'quiz') {
      this.renderQuiz();
    } else if (tabName === 'cheatsheet') {
      this.renderCheatsheet();
    } else if (tabName === 'stats') {
      this.renderStats();
    }
  }

  render() {
    this.renderHeaderStats();
    this.renderLevelSelector();
    this.renderPracticeWorkstation();
    this.renderQuiz();
    this.renderCheatsheet();
    this.renderStats();
  }

  renderHeaderStats() {
    this.headerXp.textContent = `${this.state.xp} XP`;
    this.headerStreak.textContent = `${this.state.streak} streak`;
    this.soundIcon.textContent = this.state.soundEnabled ? '🔊' : '🔇';
  }

  renderLevelSelector() {
    this.levelSelectorContainer.innerHTML = '';

    LEVELS.forEach(lvl => {
      const levelChallenges = CHALLENGES.filter(c => c.level === lvl.id);
      const completedCount = levelChallenges.filter(c => this.state.completedChallenges.has(c.id)).length;
      const percent = Math.round((completedCount / levelChallenges.length) * 100);

      const card = document.createElement('div');
      card.className = `level-card ${this.state.currentLevel === lvl.id ? 'active' : ''}`;
      card.style.setProperty('--card-color', lvl.color);

      card.innerHTML = `
        <div class="level-icon-wrapper" style="color: ${lvl.color}">${lvl.icon}</div>
        <div class="level-card-info">
          <div class="level-card-title">${lvl.name}</div>
          <div class="level-card-meta">
            <span>${completedCount}/${levelChallenges.length} bài</span>
            <span>${percent}%</span>
          </div>
          <div class="level-mini-progress">
            <div class="level-mini-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.state.currentLevel = lvl.id;
        const firstChallengeInLevel = CHALLENGES.find(c => c.level === lvl.id);
        if (firstChallengeInLevel) {
          this.state.currentChallengeId = firstChallengeInLevel.id;
        }
        this.currentHintLevel = 0;
        this.saveState();
        this.render();
      });

      this.levelSelectorContainer.appendChild(card);
    });
  }

  renderPracticeWorkstation() {
    const curLevel = LEVELS.find(l => l.id === this.state.currentLevel) || LEVELS[0];
    const challenge = this.getCurrentChallenge();
    const levelChallenges = CHALLENGES.filter(c => c.level === curLevel.id);
    const currentIndex = levelChallenges.findIndex(c => c.id === challenge.id);

    // Meta Banner
    this.currentLevelBadge.textContent = `LEVEL ${curLevel.id} • ${curLevel.badge}`;
    this.currentLevelBadge.style.color = curLevel.color;
    this.currentLevelTitle.textContent = curLevel.name;
    this.currentLevelTagline.textContent = curLevel.tagline;

    // Question Pills
    this.questionPills.innerHTML = '';
    levelChallenges.forEach((c, idx) => {
      const pill = document.createElement('button');
      const isCompleted = this.state.completedChallenges.has(c.id);
      const isActive = c.id === challenge.id;

      pill.className = `q-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      pill.textContent = idx + 1;
      pill.title = `${c.title} (${isCompleted ? 'Đã hoàn thành' : 'Chưa xong'})`;

      pill.addEventListener('click', () => {
        this.state.currentChallengeId = c.id;
        this.currentHintLevel = 0;
        this.saveState();
        this.render();
      });

      this.questionPills.appendChild(pill);
    });

    // Briefing Pane
    this.challengeDiff.textContent = challenge.difficulty;
    this.challengeCat.textContent = challenge.category;
    this.challengeIndexText.textContent = `Bài ${currentIndex + 1} / ${levelChallenges.length}`;
    this.challengeTitle.textContent = challenge.title;
    this.challengeMission.textContent = challenge.mission;

    // Mental Model
    this.grammarFormula.textContent = challenge.mentalModel.rule;
    this.grammarBreakdown.innerHTML = challenge.mentalModel.breakdown.map(b => `
      <div class="breakdown-row">
        <span class="breakdown-part">${b.part}</span>
        <span class="breakdown-role">${b.role}:</span>
        <span class="breakdown-desc">${b.desc}</span>
      </div>
    `).join('');

    // Tokens
    this.tokensList.innerHTML = '';
    challenge.tokens.forEach(token => {
      const chip = document.createElement('span');
      chip.className = 'token-chip';
      chip.textContent = token;
      chip.title = 'Nhấp để chèn vào vị trí con trỏ terminal';
      chip.addEventListener('click', () => {
        this.insertTokenIntoInput(token);
      });
      this.tokensList.appendChild(chip);
    });

    // Parameters Explanation Table
    this.paramsExplanationContent.innerHTML = `
      <table class="params-table">
        ${challenge.parametersExplanation.map(p => `
          <tr>
            <td class="param-name-cell">${p.param}</td>
            <td>${p.meaning}</td>
          </tr>
        `).join('')}
      </table>
    `;

    // Exam Notes
    this.examNotesContent.innerHTML = `<p>${challenge.examNotes}</p>`;

    // Hint Counter
    this.hintCounter.textContent = `(${this.currentHintLevel}/${challenge.hints.length})`;

    // Nav Footer Status
    this.navStatusText.textContent = `Câu ${currentIndex + 1} / ${levelChallenges.length} trong ${curLevel.name}`;
    this.btnPrevChallenge.disabled = currentIndex === 0;
    this.btnNextChallenge.disabled = currentIndex === levelChallenges.length - 1;

    // Clear input placeholder with hint of current challenge
    this.terminalInput.value = '';
    this.autoResizeInput();
    this.terminalInput.focus();
  }

  autoResizeInput() {
    this.terminalInput.style.height = 'auto';
    this.terminalInput.style.height = Math.max(26, this.terminalInput.scrollHeight) + 'px';
  }

  // Schedule a debounced sanitize pass (for post-composition or delayed cleanup)
  _scheduleSanitize() {
    if (this._sanitizeTimer) clearTimeout(this._sanitizeTimer);
    this._sanitizeTimer = setTimeout(() => {
      this._sanitizeTimer = null;
      this._runTextTransformations();
    }, 50);
  }

  // Core text transformations extracted so they can be called
  // both from handleTerminalInput (when NOT composing) and after compositionend
  _runTextTransformations() {
    const input = this.terminalInput;
    let val = input.value;
    let cursorPos = input.selectionStart;
    const now = Date.now();
    let changed = false;

    // 1. Collapse multiple consecutive whitespace/spaces (e.g. "az login  -u" -> "az login -u")
    if (/[\s\u00a0]{2,}/.test(val)) {
      const oldLen = val.length;
      val = val.replace(/[\s\u00a0]{2,}/g, ' ');
      cursorPos = Math.max(0, cursorPos - (oldLen - val.length));
      changed = true;
    }

    // 2. Anti-Ghosting / UniKey Double Dash Recovery
    // Check if right at the cursor we have a single-dash flag start: (start-of-string or whitespace) followed by -[a-zA-Z]
    const checkPos = cursorPos - 2;
    if (checkPos >= 0 && val.slice(checkPos, cursorPos).match(/^-[a-zA-Z]$/)) {
      // Must be at the start of a word: char before checkPos must be whitespace or checkPos === 0
      const isWordStart = checkPos === 0 || /[\s\u00a0]/.test(val[checkPos - 1]);
      
      if (isWordStart) {
        // Did we have a double dash right at this exact word boundary within 800ms?
        const hadDoubleDashHere = (this.recentDoubleDash && 
                                   Math.abs(this.recentDoubleDash.pos - (checkPos + 1)) <= 1 && 
                                   (now - this.recentDoubleDash.time < 800)) ||
                                  (this.dashDeletedFromDoubleDash && 
                                   Math.abs(this.dashDeletedFromDoubleDash.pos - (checkPos + 2)) <= 1 && 
                                   (now - this.dashDeletedFromDoubleDash.time < 800));

        if (hadDoubleDashHere) {
          val = val.slice(0, checkPos) + '-' + val.slice(checkPos);
          cursorPos += 1;
          changed = true;
          this.dashDeletedFromDoubleDash = null;
          this.recentDoubleDash = null;
        }
      }
    }

    // Record when text before cursor ends with '--' preceded by whitespace or at start of input
    if (cursorPos >= 2 && val.slice(cursorPos - 2, cursorPos) === '--') {
      const beforeDash = cursorPos - 2;
      if (beforeDash === 0 || /[\s\u00a0]/.test(val[beforeDash - 1])) {
        this.recentDoubleDash = { time: now, pos: cursorPos };
      }
    }

    // 3. Auto-convert single-dash multi-letter flags:
    // Any flag argument that starts with a single dash followed by 2+ letters (e.g. " -use" -> " --use")
    // In Azure CLI, multi-letter flags ALWAYS have '--'.
    const flagRegex = /(^|[\s\u00a0])-([a-zA-Z]{2,}[a-zA-Z0-9\-]*)/g;
    let cursorShift = 0;
    const convertedVal = val.replace(flagRegex, (fullMatch, prefix, flagName, offset) => {
      const flagStart = offset + prefix.length;
      if (cursorPos > flagStart) {
        cursorShift += 1;
      }
      changed = true;
      return prefix + '--' + flagName;
    });
    if (convertedVal !== val) {
      val = convertedVal;
      cursorPos += cursorShift;
    }

    // 4. Sanitize accidental Vietnamese Telex accents in flags (e.g. --úse -> --use, --đevice -> --device)
    if (val.includes('--')) {
      const sanitized = val.replace(/--([a-zA-Z0-9\u00C0-\u1EF9\-]+)/g, (fullMatch, flagBody) => {
        const cleanBody = flagBody
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        return '--' + cleanBody;
      });
      if (sanitized !== val) {
        val = sanitized;
        changed = true;
      }
    }

    // Only write back if something actually changed (avoids unnecessary cursor jumps)
    if (changed) {
      input.value = val;
      input.selectionStart = input.selectionEnd = cursorPos;
    }

    // 5. Update interactive autocomplete dropdown
    this.updateAutocompleteDropdown();

    // 6. Adjust input height
    this.autoResizeInput();
  }

  handleTerminalInput(e) {
    // CRITICAL: Do NOT modify input.value during IME composition!
    // Vietnamese IME (UniKey/EVKey) and CJK IMEs maintain internal state.
    // Changing input.value mid-composition breaks the IME and causes character loss.
    if (e.isComposing || this._isComposing) {
      // Only auto-resize (safe — doesn't modify value) and update dropdown
      this.autoResizeInput();
      return;
    }

    this._runTextTransformations();
  }

  insertTokenIntoInput(token) {
    const input = this.terminalInput;
    let current = input.value;

    // Check if user has an incomplete partial token or trailing dashes (e.g. "-u", "--u", "--", "-")
    const trailingWordMatch = current.match(/(-{1,2}[a-zA-Z0-9_\-]*)$/);
    if (trailingWordMatch) {
      const trailing = trailingWordMatch[1];
      const normalizedTrailing = trailing.startsWith('--') ? trailing : ('-' + trailing);
      if (token.toLowerCase().startsWith(trailing.toLowerCase()) || 
          token.toLowerCase().startsWith(normalizedTrailing.toLowerCase()) ||
          trailing === '-' || trailing === '--') {
        // Smart replace: substitute partial prefix with full token!
        current = current.slice(0, -trailing.length) + token + ' ';
        input.value = current;
        this.autoResizeInput();
        input.focus();
        sounds.playKeypress();
        this.hideAutocompleteDropdown();
        return;
      }
    }

    if (!current) {
      input.value = token + ' ';
    } else if (current.endsWith(' ') || current.endsWith('`') || current.endsWith('\n')) {
      input.value += token + ' ';
    } else {
      input.value += ' ' + token + ' ';
    }
    this.autoResizeInput();
    input.focus();
    sounds.playKeypress();
    this.hideAutocompleteDropdown();
  }

  handleTabAutocomplete() {
    const challenge = this.getCurrentChallenge();
    const val = this.terminalInput.value;
    const tokens = challenge.tokens;

    // Find last typed word
    const match = val.match(/([a-zA-Z0-9_\-:$."/]+)$/);
    if (!match) return;

    const prefix = match[1].toLowerCase();
    
    // 1. Direct prefix match (e.g. "--u" -> "--use-device-code")
    let candidate = tokens.find(t => t.toLowerCase().startsWith(prefix) && t.toLowerCase() !== prefix);

    // 2. Fallback for Vietnamese IME eating a dash: e.g. user typed "-u" but token is "--use-device-code"
    if (!candidate && prefix.startsWith('-') && !prefix.startsWith('--')) {
      const doubleDashPrefix = '-' + prefix;
      candidate = tokens.find(t => t.toLowerCase().startsWith(doubleDashPrefix));
    }

    if (candidate) {
      this.completeWithToken(candidate, match[1]);
      this.showToast(`Đã tự động hoàn thành: ${candidate}`, 'info');
    }
  }

  updateAutocompleteDropdown() {
    if (!this.autocompleteDropdown) return;
    const val = this.terminalInput.value;
    const challenge = this.getCurrentChallenge();
    if (!challenge || !challenge.tokens) {
      this.hideAutocompleteDropdown();
      return;
    }

    const cursorPos = this.terminalInput.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const match = textBeforeCursor.match(/([a-zA-Z0-9_\-:$."/]+)$/);

    if (!match || match[1].length < 1) {
      this.hideAutocompleteDropdown();
      return;
    }

    const currentWord = match[1].toLowerCase();
    const matchingTokens = challenge.tokens.filter(token => {
      const tLower = token.toLowerCase();
      if (tLower === currentWord) return false;
      if (tLower.startsWith(currentWord)) return true;
      // Fallback for single-dash typed when double-dash token exists
      if (currentWord.startsWith('-') && !currentWord.startsWith('--') && tLower.startsWith('-' + currentWord)) {
        return true;
      }
      return false;
    });

    if (matchingTokens.length === 0) {
      this.hideAutocompleteDropdown();
      return;
    }

    this.renderAutocompleteDropdown(matchingTokens, match[1]);
  }

  renderAutocompleteDropdown(tokens, currentWord) {
    if (!this.autocompleteDropdown) return;
    this.autocompleteDropdown.innerHTML = '';
    tokens.forEach((token, index) => {
      const item = document.createElement('div');
      item.className = 'ac-item' + (index === 0 ? ' selected' : '');
      item.innerHTML = `
        <span class="ac-token"><code>${token}</code></span>
        <span class="ac-hint">${index === 0 ? '<kbd>Tab ↹</kbd> hoặc Click' : 'Click'}</span>
      `;
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.completeWithToken(token, currentWord);
      });
      this.autocompleteDropdown.appendChild(item);
    });
    this.autocompleteDropdown.classList.remove('hidden');
  }

  hideAutocompleteDropdown() {
    if (this.autocompleteDropdown) {
      this.autocompleteDropdown.classList.add('hidden');
      this.autocompleteDropdown.innerHTML = '';
    }
  }

  completeWithToken(token, currentWord) {
    const val = this.terminalInput.value;
    const cursorPos = this.terminalInput.selectionStart;
    const beforeWord = val.slice(0, cursorPos - currentWord.length);
    const afterWord = val.slice(cursorPos);
    
    this.terminalInput.value = beforeWord + token + ' ' + afterWord;
    const newCursor = beforeWord.length + token.length + 1;
    this.terminalInput.selectionStart = this.terminalInput.selectionEnd = newCursor;
    this.autoResizeInput();
    this.hideAutocompleteDropdown();
    sounds.playKeypress();
    this.terminalInput.focus();
  }

  handleShowHint() {
    const challenge = this.getCurrentChallenge();
    if (this.currentHintLevel < challenge.hints.length) {
      this.currentHintLevel++;
      const hintText = challenge.hints[this.currentHintLevel - 1];
      this.appendTerminalOutput(`💡 [Gợi ý ${this.currentHintLevel}/${challenge.hints.length}]: ${hintText}`, 'info');
      this.hintCounter.textContent = `(${this.currentHintLevel}/${challenge.hints.length})`;
      sounds.playKeypress();
    } else {
      this.showToast('Bạn đã xem hết các gợi ý cho câu này!', 'info');
    }
  }

  handleRevealSolution() {
    const challenge = this.getCurrentChallenge();
    this.terminalInput.value = challenge.expectedCommand;
    this.autoResizeInput();
    this.showToast('Đã nạp câu lệnh mẫu chuẩn vào Terminal!', 'info');
    this.terminalInput.focus();
    sounds.playKeypress();
  }

  handleRunCommand() {
    const input = this.terminalInput.value.trim();
    if (!input) {
      this.showToast('Vui lòng nhập lệnh trước khi bấm Thực thi!', 'error');
      return;
    }

    const challenge = this.getCurrentChallenge();

    // Echo command into terminal history
    this.appendTerminalCommandLine(input);

    // Validate
    const result = validateCommand(input, challenge);

    if (result.isValid) {
      sounds.playSuccess();
      const wasAlreadyCompleted = this.state.completedChallenges.has(challenge.id);
      this.state.completedChallenges.add(challenge.id);

      if (!wasAlreadyCompleted) {
        const earnedXp = challenge.level * 25 + 25; // 50 to 125 XP
        this.state.xp += earnedXp;
        this.state.streak += 1;
        this.showToast(`🎉 Chính xác! +${earnedXp} XP`, 'success');
      } else {
        this.showToast('Chính xác! Lệnh hoàn toàn chuẩn cú pháp.', 'success');
      }

      // Print simulated output
      this.appendTerminalOutput(challenge.simulatedOutput, 'success');

      this.saveState();
      this.renderHeaderStats();
      this.renderLevelSelector();

      // Update question pills
      const levelChallenges = CHALLENGES.filter(c => c.level === this.state.currentLevel);
      const curIndex = levelChallenges.findIndex(c => c.id === challenge.id);

      if (curIndex < levelChallenges.length - 1) {
        // Suggest next question
        setTimeout(() => {
          this.appendTerminalOutput(`👉 Tiếp theo: Bạn có thể nhấn 'Câu tiếp theo →' hoặc bấm phím để tiếp tục bài ${curIndex + 2}.`, 'info');
        }, 600);
      } else {
        this.appendTerminalOutput(`🏆 CHÚC MỪNG: Bạn đã hoàn thành toàn bộ bài tập trong Level ${this.state.currentLevel}!`, 'success');
      }

    } else {
      sounds.playError();
      this.appendTerminalOutput(`❌ LỖI: ${result.message}`, 'error');
      this.showToast(result.message, 'error');
    }

    this.terminalInput.value = '';
    this.autoResizeInput();
    this.terminalInput.focus();
  }

  appendTerminalCommandLine(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line user-cmd-line';
    line.innerHTML = `<span class="prompt-sym">PS H:\\azure-lab&gt;</span> <span>${this.escapeHtml(cmd)}</span>`;
    this.terminalHistory.appendChild(line);
    this.scrollTerminalToBottom();
  }

  appendTerminalOutput(output, type = 'info') {
    const line = document.createElement('div');
    line.className = `term-line output-${type}`;
    line.textContent = output;
    this.terminalHistory.appendChild(line);
    this.scrollTerminalToBottom();
  }

  clearTerminal() {
    this.terminalHistory.innerHTML = `
      <div class="term-line info-line">
        <strong style="color: var(--neon-cyan);">[🛡️ SAFE SANDBOX SIMULATOR]</strong> Màn hình terminal đã được làm sạch.<br>
        100% Giả lập an toàn • Không gửi lệnh đến Azure và không thực thi trên máy tính.
      </div>
    `;
    this.terminalInput.value = '';
    this.autoResizeInput();
    this.terminalInput.focus();
    sounds.playKeypress();
    this.showToast('Đã xóa màn hình terminal', 'info');
  }

  scrollTerminalToBottom() {
    const screen = document.getElementById('terminal-screen');
    if (screen) {
      screen.scrollTop = screen.scrollHeight;
    }
  }

  navigateChallenge(delta) {
    const levelChallenges = CHALLENGES.filter(c => c.level === this.state.currentLevel);
    const currentIndex = levelChallenges.findIndex(c => c.id === this.state.currentChallengeId);
    const nextIndex = currentIndex + delta;

    if (nextIndex >= 0 && nextIndex < levelChallenges.length) {
      this.state.currentChallengeId = levelChallenges[nextIndex].id;
      this.currentHintLevel = 0;
      this.saveState();
      this.render();
      sounds.playKeypress();
    }
  }

  // ==========================================================================
  // QUIZ ENGINE
  // ==========================================================================
  renderQuiz() {
    let correctCount = 0;
    this.quizQuestionsList.innerHTML = '';

    QUIZ_QUESTIONS.forEach((q, qIndex) => {
      const selectedIndex = this.state.quizAnswers[q.id];
      const isAnswered = selectedIndex !== undefined;
      const isCorrect = isAnswered && selectedIndex === q.correctIndex;

      if (isCorrect) correctCount++;

      const card = document.createElement('div');
      card.className = 'quiz-card';

      card.innerHTML = `
        <div class="quiz-question-title">${qIndex + 1}. ${q.question}</div>
        <div class="quiz-options" id="quiz-opts-${q.id}">
          ${q.options.map((opt, optIndex) => {
            let stateClass = '';
            if (isAnswered) {
              if (optIndex === q.correctIndex) {
                stateClass = 'correct';
              } else if (optIndex === selectedIndex) {
                stateClass = 'wrong';
              }
            }

            const letter = String.fromCharCode(65 + optIndex);
            return `
              <button class="quiz-opt-btn ${stateClass}" data-qid="${q.id}" data-optindex="${optIndex}" ${isAnswered ? 'disabled' : ''}>
                <span class="quiz-opt-indicator">${letter}</span>
                <span>${opt}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="quiz-explanation-box" id="quiz-exp-${q.id}" style="display: ${isAnswered ? 'block' : 'none'};">
          <strong>💡 Giải thích chi tiết:</strong> ${q.explanation}
        </div>
      `;

      // Bind option clicks
      if (!isAnswered) {
        const buttons = card.querySelectorAll('.quiz-opt-btn');
        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            const qId = btn.getAttribute('data-qid');
            const optIdx = parseInt(btn.getAttribute('data-optindex'), 10);
            this.handleQuizAnswer(qId, optIdx);
          });
        });
      }

      this.quizQuestionsList.appendChild(card);
    });

    this.quizScoreDisplay.textContent = `${correctCount} / ${QUIZ_QUESTIONS.length}`;
  }

  handleQuizAnswer(questionId, selectedIndex) {
    const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    this.state.quizAnswers[questionId] = selectedIndex;
    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) {
      sounds.playSuccess();
      this.state.xp += 30;
      this.showToast('Chính xác! +30 XP', 'success');
    } else {
      sounds.playError();
      this.showToast('Chưa chính xác! Hãy đọc giải thích bên dưới.', 'error');
    }

    this.saveState();
    this.renderHeaderStats();
    this.renderQuiz();
  }

  // ==========================================================================
  // CHEATSHEET ENGINE
  // ==========================================================================
  renderCheatsheet(filterKeyword = '') {
    this.cheatsheetSectionsWrapper.innerHTML = '';

    CHEATSHEET_SECTIONS.forEach(sec => {
      // Filter items
      const filteredItems = sec.items.filter(item => {
        if (!filterKeyword) return true;
        const text = `${sec.title} ${item.title} ${item.desc || ''} ${item.code || ''} ${item.syntax || ''}`.toLowerCase();
        return text.includes(filterKeyword);
      });

      if (filteredItems.length === 0) return;

      const secCard = document.createElement('div');
      secCard.className = 'cheat-section-card';

      secCard.innerHTML = `
        <div class="cheat-section-header">
          <span class="badge badge-diff">${sec.badge}</span>
          <h3>${sec.title}</h3>
          <p class="cheat-section-summary">${sec.summary}</p>
        </div>
        <div class="cheat-items-list">
          ${filteredItems.map(item => `
            <div class="cheat-item-card">
              <div class="cheat-item-title">${item.title}</div>
              ${item.desc ? `<div class="cheat-item-desc">${item.desc}</div>` : ''}
              ${item.syntax ? `
                <div class="code-block-wrapper">
                  <code>${this.escapeHtml(item.syntax)}</code>
                </div>
              ` : ''}
              ${item.table ? `
                <table class="params-table" style="margin-top: 0.5rem;">
                  ${item.table.map(row => `
                    <tr>
                      <td class="param-name-cell">${row.verb}</td>
                      <td>${row.meaning} <span style="color: var(--text-dim);">(${row.example})</span></td>
                    </tr>
                  `).join('')}
                </table>
              ` : ''}
              ${item.bullets ? `
                <ul style="margin-left: 1.25rem; font-size: 0.88rem; color: #cbd5e1; line-height: 1.7;">
                  ${item.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
              ` : ''}
              ${item.code ? `
                <div class="code-block-wrapper">
                  <button class="btn-copy-snippet" data-code="${this.escapeHtml(item.code)}">Copy</button>
                  <code>${this.escapeHtml(item.code)}</code>
                </div>
              ` : ''}
              ${item.note ? `<div style="font-size: 0.82rem; color: var(--amber); margin-top: 0.35rem;">⚠️ ${item.note}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;

      // Bind copy buttons
      const copyBtns = secCard.querySelectorAll('.btn-copy-snippet');
      copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.getAttribute('data-code');
          navigator.clipboard.writeText(code);
          sounds.playKeypress();
          this.showToast('Đã copy câu lệnh vào clipboard!', 'success');
        });
      });

      this.cheatsheetSectionsWrapper.appendChild(secCard);
    });

    if (this.cheatsheetSectionsWrapper.children.length === 0) {
      this.cheatsheetSectionsWrapper.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-dim);">
          Không tìm thấy lệnh hoặc ghi chú nào khớp với từ khóa "${this.escapeHtml(filterKeyword)}".
        </div>
      `;
    }
  }

  filterCheatsheet(keyword) {
    this.renderCheatsheet(keyword);
  }

  // ==========================================================================
  // STATS & ACHIEVEMENTS ENGINE
  // ==========================================================================
  renderStats() {
    const totalChallenges = CHALLENGES.length;
    const completedCount = this.state.completedChallenges.size;
    const percent = Math.round((completedCount / totalChallenges) * 100);

    this.statsOverallPercent.textContent = `${percent}%`;

    // Rank logic
    let rankName = 'Azure Apprentice';
    let rankAvatar = '🌱';
    let rankDesc = 'Bạn đang ở giai đoạn khởi động với các câu lệnh Azure CLI cơ bản.';

    if (percent >= 100) {
      rankName = 'AI-200 Azure Master';
      rankAvatar = '👑';
      rankDesc = 'Xuất sắc! Bạn đã làm chủ 100% kho lệnh thực chiến và sẵn sàng cho bài thi AI-200.';
    } else if (percent >= 80) {
      rankName = 'Container Apps Specialist';
      rankAvatar = '⚡';
      rankDesc = 'Bạn đã làm chủ quản lý Revisions, chẩn đoán KQL và khắc phục sự cố Azure Container Apps!';
    } else if (percent >= 60) {
      rankName = 'Security & RBAC Architect';
      rankAvatar = '🛡️';
      rankDesc = 'Bạn đã làm chủ việc cấu hình Managed Identity, bảo mật ACR và App Service!';
    } else if (percent >= 40) {
      rankName = 'Container Operations Pro';
      rankAvatar = '🐳';
      rankDesc = 'Bạn đã thành thạo build Docker trên Cloud và triển khai Web App Container!';
    } else if (percent >= 20) {
      rankName = 'Azure Specialist';
      rankAvatar = '🚀';
      rankDesc = 'Nắm vững cấu hình biến môi trường và quản lý Resource Groups.';
    }

    this.statsRankName.textContent = rankName;
    this.statsRankAvatar.textContent = rankAvatar;
    this.statsRankDesc.textContent = rankDesc;

    // Level breakdown
    this.statsLevelGrid.innerHTML = LEVELS.map(lvl => {
      const levelChallenges = CHALLENGES.filter(c => c.level === lvl.id);
      const lvlCompleted = levelChallenges.filter(c => this.state.completedChallenges.has(c.id)).length;
      const lvlPercent = Math.round((lvlCompleted / levelChallenges.length) * 100);

      return `
        <div class="stat-level-card">
          <div class="stat-level-header">
            <span>${lvl.icon} ${lvl.name}</span>
            <span style="color: ${lvl.color}; font-weight: 800;">${lvlCompleted}/${levelChallenges.length} (${lvlPercent}%)</span>
          </div>
          <div class="level-mini-progress">
            <div class="level-mini-fill" style="width: ${lvlPercent}%; background: ${lvl.color}"></div>
          </div>
        </div>
      `;
    }).join('');

    // Badges Showcase
    const badges = [
      { id: 'b1', name: 'Cloud Rookie', icon: '🌱', desc: 'Hoàn thành Level 1: Môi trường & Defaults', unlocked: this.isLevelCompleted(1) },
      { id: 'b2', name: 'Registry Operator', icon: '🐳', desc: 'Hoàn thành Level 2: Azure Container Registry', unlocked: this.isLevelCompleted(2) },
      { id: 'b3', name: 'App Specialist', icon: '🚀', desc: 'Hoàn thành Level 3: Linux App Service & Web App', unlocked: this.isLevelCompleted(3) },
      { id: 'b4', name: 'Security Engineer', icon: '🛡️', desc: 'Hoàn thành Level 4: RBAC AcrPull & App Settings', unlocked: this.isLevelCompleted(4) },
      { id: 'b5', name: 'Sidecar Architect', icon: '🧩', desc: 'Hoàn thành Level 5: Multi-container Pod & Sidecars', unlocked: this.isLevelCompleted(5) },
      { id: 'b6', name: 'ACA Specialist', icon: '⚡', desc: 'Hoàn thành Level 6: Azure Container Apps & Chẩn đoán KQL', unlocked: this.isLevelCompleted(6) }
    ];

    this.statsBadgesGrid.innerHTML = badges.map(b => `
      <div class="badge-card ${b.unlocked ? 'unlocked' : ''}">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `).join('');
  }

  isLevelCompleted(levelId) {
    const levelChallenges = CHALLENGES.filter(c => c.level === levelId);
    return levelChallenges.every(c => this.state.completedChallenges.has(c.id));
  }

  // ==========================================================================
  // TOAST NOTIFICATION UTILITY
  // ==========================================================================
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${this.escapeHtml(message)}</span>`;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.azMasterApp = new AzMasterApp();
});
