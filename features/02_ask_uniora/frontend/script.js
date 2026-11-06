/* ==========================================================================
   UNIORA — ASK UNIORA CHAT CONTROLLER
   File: features/02_ask_uniora/frontend/script.js
   Architecture: Pure client-side Rule-based NLP interface.
   Standards: Zero emojis, instant non-lingering response lifecycle,
              responsive drawer modal matching 01_scheme_recommendation.
   ========================================================================== */

import { supabase } from '../../../common/js/supabase.js';
import { getCurrentUser, onAuthStateChange } from '../../../common/js/auth.js';
import { initNavbarAuth, initActiveNavLink, initNavbarMenu } from '../../../common/js/navbar.js';
import { AskUnioraRuleEngine } from './rule_engine.js';

// ---------------------------------------------------------------------------
// 1. DOM ELEMENTS CACHE
// ---------------------------------------------------------------------------
const dom = {
  chatViewport: document.getElementById('chatViewport'),
  welcomeScreen: document.getElementById('welcomeScreen'),
  chatLog: document.getElementById('chatLog'),
  chatForm: document.getElementById('chatForm'),
  chatInput: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn'),
  catalogCountText: document.getElementById('catalogCountText'),
  engineStatusText: document.getElementById('engineStatusText'),
  refreshCatalogBtn: document.getElementById('refreshCatalogBtn'),
  clearChatBtn: document.getElementById('clearChatBtn'),
  quickPillsContainer: document.getElementById('quickPillsContainer'),

  // Modal (Drawer layout matching 01_scheme_recommendation)
  modalOverlay: document.getElementById('schemeModalOverlay'),
  modal: document.getElementById('schemeModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalCloseActionBtn: document.getElementById('modalCloseActionBtn'),
  modalOfficialLinkBtn: document.getElementById('modalOfficialLinkBtn'),
  modalTags: document.getElementById('modalTags'),
  modalTitle: document.getElementById('modalSchemeName'),
  modalMeta: document.getElementById('modalMeta'),
  modalBody: document.getElementById('modalBody'),
};

// ---------------------------------------------------------------------------
// 2. STATE & ENGINE INITIALIZATION
// ---------------------------------------------------------------------------
const engine = new AskUnioraRuleEngine();
let isGenerating = false;

async function initAskUniora() {
  // 1. Initialize navbar components
  try {
    initNavbarAuth();
    initActiveNavLink();
    initNavbarMenu();
  } catch (err) {
    console.warn('[AskUniora] Navbar initialization note:', err);
  }

  // 2. Setup event listeners
  setupEventListeners();

  // 3. Load schemes dataset into Rule-based model
  updateStatus('Loading Catalog…');
  try {
    const schemes = await engine.loadSchemesData();
    const count = schemes.length;
    dom.catalogCountText.textContent = `${count} Schemes Ready`;
    updateStatus('Rule Model Active');
  } catch (err) {
    console.error('[AskUniora] Schemes data load failed:', err);
    dom.catalogCountText.textContent = 'Catalog Error';
    updateStatus('Offline Catalog Active');
  }
}

function updateStatus(text) {
  if (dom.engineStatusText) {
    dom.engineStatusText.textContent = text;
  }
}

// ---------------------------------------------------------------------------
// 3. EVENT LISTENERS
// ---------------------------------------------------------------------------
function setupEventListeners() {
  // Chat form submit
  if (dom.chatForm) {
    dom.chatForm.addEventListener('submit', handleFormSubmit);
  }

  // Textarea auto-resize and Enter key handling
  if (dom.chatInput) {
    dom.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleFormSubmit();
      }
    });

    dom.chatInput.addEventListener('input', () => {
      dom.chatInput.style.height = 'auto';
      dom.chatInput.style.height = Math.min(dom.chatInput.scrollHeight, 120) + 'px';
    });
  }

  // Starter Cards on Welcome Screen
  if (dom.welcomeScreen) {
    dom.welcomeScreen.addEventListener('click', (e) => {
      const card = e.target.closest('.starter-card');
      if (card && card.dataset.query) {
        handleUserQuery(card.dataset.query);
      }
    });
  }

  // Quick suggestion pills row
  if (dom.quickPillsContainer) {
    dom.quickPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.quick-pill');
      if (pill && pill.dataset.query) {
        handleUserQuery(pill.dataset.query);
      }
    });
  }

  // Clear Chat Button
  if (dom.clearChatBtn) {
    dom.clearChatBtn.addEventListener('click', () => {
      dom.chatLog.innerHTML = '';
      if (dom.welcomeScreen) {
        dom.welcomeScreen.hidden = false;
      }
      engine.context.lastScheme = null;
      engine.context.lastSector = null;
      if (dom.chatInput) {
        dom.chatInput.value = '';
        dom.chatInput.style.height = 'auto';
        dom.chatInput.focus();
      }
    });
  }

  // Refresh Data Button
  if (dom.refreshCatalogBtn) {
    dom.refreshCatalogBtn.addEventListener('click', async () => {
      dom.catalogCountText.textContent = 'Syncing…';
      try {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          window.localStorage.removeItem('uniora_schemes_cache_v2');
        }
        const schemes = await engine.loadSchemesData();
        dom.catalogCountText.textContent = `${schemes.length} Schemes Ready`;
        addAssistantMessage({
          text: `**Scheme Catalog Synced Successfully.**\n\nFetched and indexed **${schemes.length} welfare schemes** from the official UNIORA Google Sheet. You can now query the updated catalog.`,
          followUps: engine.getDefaultFollowUps()
        });
      } catch (e) {
        dom.catalogCountText.textContent = 'Sync Failed';
      }
    });
  }

  // Modal Close buttons
  if (dom.modalCloseBtn) {
    dom.modalCloseBtn.addEventListener('click', closeModal);
  }
  if (dom.modalCloseActionBtn) {
    dom.modalCloseActionBtn.addEventListener('click', closeModal);
  }
  if (dom.modalOverlay) {
    dom.modalOverlay.addEventListener('click', (e) => {
      if (e.target === dom.modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dom.modalOverlay.hidden) {
      closeModal();
    }
  });

  // Delegated clicks inside chatLog (Card Actions & Follow-up Option Chips)
  if (dom.chatLog) {
    dom.chatLog.addEventListener('click', handleChatLogClick);
  }
}

// ---------------------------------------------------------------------------
// 4. CHAT FLOW & MESSAGE RENDERING (Zero lingering loading state)
// ---------------------------------------------------------------------------
function handleFormSubmit(e) {
  if (e) e.preventDefault();
  if (isGenerating) return;

  const text = dom.chatInput.value.trim();
  if (!text) return;

  dom.chatInput.value = '';
  dom.chatInput.style.height = 'auto';

  handleUserQuery(text);
}

function handleUserQuery(queryText) {
  if (!queryText || isGenerating) return;

  // 1. Hide welcome screen
  if (dom.welcomeScreen && !dom.welcomeScreen.hidden) {
    dom.welcomeScreen.hidden = true;
  }

  // 2. Render User Message immediately
  addUserMessage(queryText);

  // 3. Set generating lock and disable button briefly
  isGenerating = true;
  if (dom.sendBtn) dom.sendBtn.disabled = true;

  // 4. Instant execution without artificial loading delay
  // Using requestAnimationFrame allows browser to paint user message before computing
  requestAnimationFrame(() => {
    setTimeout(() => {
      try {
        const response = engine.processQuery(queryText);
        addAssistantMessage(response);
      } catch (err) {
        console.error('[AskUniora] Error in rule engine processing:', err);
        addAssistantMessage({
          text: "An error occurred while evaluating your question. Please try asking again or select one of the suggested topics.",
          followUps: engine.getDefaultFollowUps()
        });
      } finally {
        isGenerating = false;
        if (dom.sendBtn) dom.sendBtn.disabled = false;
        if (dom.chatInput) dom.chatInput.focus();
      }
    }, 40);
  });
}

function addUserMessage(text) {
  const timeStr = getCurrentTime();
  const row = document.createElement('div');
  row.className = 'msg-row msg-row--user';
  row.innerHTML = `
    <div class="msg-bubble-wrap">
      <div class="msg-bubble msg-bubble--user">${escapeHtml(text)}</div>
      <span class="msg-timestamp">${timeStr}</span>
    </div>
  `;
  dom.chatLog.appendChild(row);
  scrollToBottom();
}

function addAssistantMessage(response) {
  const timeStr = getCurrentTime();
  const row = document.createElement('div');
  row.className = 'msg-row msg-row--assistant';

  // Format assistant text with clean markdown parser
  const formattedHtml = parseMarkdownToHtml(response.text || '');

  // Build embedded scheme cards HTML if present
  let schemeCardsHtml = '';
  if (Array.isArray(response.schemes) && response.schemes.length > 0) {
    schemeCardsHtml = `
      <div class="scheme-cards-container">
        ${response.schemes.map(s => renderInlineSchemeCard(s)).join('')}
      </div>
    `;
  }

  // Build column exploration pills HTML (zero emojis)
  let followUpsHtml = '';
  if (Array.isArray(response.followUps) && response.followUps.length > 0) {
    followUpsHtml = `
      <div class="followup-chips-wrap">
        <span class="followup-chips-title">Explore Related Options:</span>
        <div class="followup-chips-list">
          ${response.followUps.map(f => `
            <button type="button" class="followup-chip" data-query="${escapeHtml(f.query)}">
              ${escapeHtml(f.label)}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  row.innerHTML = `
    <div class="msg-avatar msg-avatar--assistant" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
    <div class="msg-bubble-wrap">
      <div class="msg-bubble msg-bubble--assistant">
        ${formattedHtml}
        ${schemeCardsHtml}
        ${followUpsHtml}
      </div>
      <span class="msg-timestamp">${timeStr}</span>
    </div>
  `;

  dom.chatLog.appendChild(row);
  scrollToBottom();
}

function renderInlineSchemeCard(scheme) {
  const isTN = /tamil nadu|state/i.test(scheme.category_type || '') || /tamil nadu/i.test(scheme.eligibility_state || '');
  const badgeLabel = isTN ? 'Tamil Nadu State' : 'Central Government';

  return `
    <div class="scheme-card-inline" data-scheme-id="${escapeHtml(scheme.scheme_id)}">
      <div class="scheme-card-inline__top">
        <span class="scheme-card__category">${badgeLabel}</span>
        <span class="scheme-card__badge">${escapeHtml(scheme.sector_category || 'Welfare')}</span>
        <span class="scheme-card__badge scheme-card__badge--active">${escapeHtml(scheme.scheme_status || 'Active')}</span>
      </div>
      <h4 class="scheme-card-inline__title">${escapeHtml(scheme.scheme_name)}</h4>
      ${scheme.issuing_department ? `<p class="scheme-card-inline__dept">${escapeHtml(scheme.issuing_department)}</p>` : ''}
      ${scheme.benefits ? `
        <div class="scheme-card-inline__benefit">
          <span class="scheme-card-inline__benefit-label">Financial &amp; Welfare Benefit</span>
          <span class="scheme-card-inline__benefit-text">${escapeHtml(scheme.benefits.slice(0, 160))}${scheme.benefits.length > 160 ? '…' : ''}</span>
        </div>
      ` : ''}
      <div class="scheme-card-inline__actions">
        <button type="button" class="btn btn-primary btn-sm" data-action="view-details" data-scheme-id="${escapeHtml(scheme.scheme_id)}">
          View Full Details
        </button>
        <button type="button" class="btn btn-outline btn-sm" data-action="check-eligibility" data-scheme-name="${escapeHtml(scheme.scheme_name)}">
          Eligibility
        </button>
        <button type="button" class="btn btn-outline btn-sm" data-action="check-documents" data-scheme-name="${escapeHtml(scheme.scheme_name)}">
          Documents
        </button>
      </div>
    </div>
  `;
}

function scrollToBottom() {
  if (dom.chatViewport) {
    dom.chatViewport.scrollTop = dom.chatViewport.scrollHeight;
  }
}

function getCurrentTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// 5. CLICK HANDLERS (CARDS & FOLLOW-UP CHIPS)
// ---------------------------------------------------------------------------
function handleChatLogClick(e) {
  // 1. Follow-up Option Chip Click
  const chip = e.target.closest('.followup-chip');
  if (chip && chip.dataset.query) {
    handleUserQuery(chip.dataset.query);
    return;
  }

  // 2. Card action buttons
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  if (action === 'view-details') {
    const schemeId = btn.dataset.schemeId;
    const scheme = engine.schemes.find(s => s.scheme_id === schemeId);
    if (scheme) openSchemeModal(scheme);
  } else if (action === 'check-eligibility') {
    const sName = btn.dataset.schemeName;
    handleUserQuery(`What is the eligibility for ${sName}?`);
  } else if (action === 'check-documents') {
    const sName = btn.dataset.schemeName;
    handleUserQuery(`What documents are needed for ${sName}?`);
  }
}

// ---------------------------------------------------------------------------
// 6. SCHEME DETAIL MODAL (Matching 01_scheme_recommendation drawer layout)
// ---------------------------------------------------------------------------
function openSchemeModal(scheme) {
  if (!dom.modalOverlay) return;

  const isTN = /tamil nadu|state/i.test(scheme.category_type || '') || /tamil nadu/i.test(scheme.eligibility_state || '');
  const badgeLabel = isTN ? 'Tamil Nadu State' : 'Central Government';

  dom.modalTags.innerHTML = `
    <span class="modal__tag modal__tag--category">${badgeLabel}</span>
    <span class="modal__tag">${escapeHtml(scheme.sector_category || 'Welfare')}</span>
    <span class="modal__tag modal__tag--active">${escapeHtml(scheme.scheme_status || 'Active')}</span>
  `;

  dom.modalTitle.textContent = scheme.scheme_name;
  dom.modalMeta.textContent = scheme.issuing_department || 'Government Department';

  let ageStr = 'Not Specified';
  if (scheme.min_age && scheme.max_age) ageStr = `${scheme.min_age} to ${scheme.max_age} years`;
  else if (scheme.min_age) ageStr = `Min ${scheme.min_age} years`;
  else if (scheme.max_age) ageStr = `Max ${scheme.max_age} years`;

  const incomeStr = scheme.income_limit_annual ? `<= Rs. ${scheme.income_limit_annual.toLocaleString('en-IN')}` : 'No Income Ceiling';

  const docsText = scheme.required_documents || scheme.mandatory_documents || 'Aadhaar Card; Proof of Residence; Bank Passbook';
  const docsArray = docsText.split(/;\s*|\n|,\s*(?=[A-Z])/).filter(Boolean);

  dom.modalBody.innerHTML = `
    <!-- Quick facts strip -->
    <div class="modal__facts">
      <div class="modal__fact">
        <span class="modal__fact-label">Age Range</span>
        <span class="modal__fact-value">${escapeHtml(ageStr)}</span>
      </div>
      <div class="modal__fact">
        <span class="modal__fact-label">Income Limit</span>
        <span class="modal__fact-value">${escapeHtml(incomeStr)}</span>
      </div>
      <div class="modal__fact">
        <span class="modal__fact-label">Gender</span>
        <span class="modal__fact-value">${escapeHtml(scheme.gender || 'All')}</span>
      </div>
      <div class="modal__fact">
        <span class="modal__fact-label">Social Category</span>
        <span class="modal__fact-value">${escapeHtml(scheme.social_category || 'All')}</span>
      </div>
      <div class="modal__fact">
        <span class="modal__fact-label">Occupation</span>
        <span class="modal__fact-value">${escapeHtml(scheme.occupation_criteria || 'All')}</span>
      </div>
      <div class="modal__fact">
        <span class="modal__fact-label">Residency</span>
        <span class="modal__fact-value">${escapeHtml(scheme.residency_requirement || scheme.eligibility_state || 'Resident of India')}</span>
      </div>
    </div>

    <!-- Financial Benefit panel -->
    <div class="modal__benefit">
      <h3>Financial and Welfare Benefits</h3>
      <p>${escapeHtml(scheme.benefits || 'Financial or material assistance as specified by the government.')}</p>
    </div>

    <!-- Description Section -->
    <div class="modal__section">
      <h3>Overview and Scope</h3>
      <p>${escapeHtml(scheme.description || 'Government welfare initiative providing targeted social and financial support to eligible citizens.')}</p>
      ${scheme.other_conditions ? `<p style="margin-top:10px;font-size:13px;color:#475569;"><strong>Additional Conditions:</strong> ${escapeHtml(scheme.other_conditions)}</p>` : ''}
    </div>

    <!-- Documents Section -->
    <div class="modal__section">
      <h3>Required Documents</h3>
      <ul class="modal__docs-list">
        ${docsArray.map(doc => `
          <li class="modal__doc-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>${escapeHtml(doc.trim())}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Application Section -->
    <div class="modal__section">
      <h3>Application Procedure</h3>
      <p style="margin-bottom:6px;"><strong>Application Mode:</strong> ${escapeHtml(scheme.application_mode || 'Online')}</p>
      <p style="white-space:pre-line;">${escapeHtml((scheme.application_process || 'Apply through official department portal or nearest e-Sevai / CSC center with original certificates.').replace(/;\s*/g, '\n'))}</p>
    </div>
  `;

  const officialUrl = scheme.application_url || scheme.official_source_url || 'https://www.myscheme.gov.in';
  dom.modalOfficialLinkBtn.href = officialUrl;

  dom.modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (dom.modalOverlay) {
    dom.modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }
}

// ---------------------------------------------------------------------------
// 7. LIGHTWEIGHT MARKDOWN TO HTML PARSER
// ---------------------------------------------------------------------------
function parseMarkdownToHtml(markdown) {
  if (!markdown) return '';

  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')

    // Bold & Italics
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')

    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')

    // Markdown Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // List items
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

    // Paragraph wrapping
    .split(/\n{2,}/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<blockquote') || block.startsWith('<ul') || block.startsWith('<ol')) {
        return block;
      }
      if (block.includes('<li>')) {
        return `<ul>${block}</ul>`;
      }
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Initialize on DOM load
initAskUniora();
