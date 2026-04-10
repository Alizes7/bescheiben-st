'use strict';

// ── VIEW TABS ─────────────────────────────────────────

/**
 * Highlights the correct header tab button.
 * (The layout is always visible — tabs are cosmetic navigation hints.)
 * @param {'carousel'|'story'|'ideas'} view
 */
function setView(view) {
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
}

// ── SLIDE LIST: event delegation ──────────────────────

document.getElementById('slideList').addEventListener('click', function (e) {
  var item = e.target.closest('[data-slide-idx]');
  if (!item) return;

  var idx = parseInt(item.dataset.slideIdx, 10);

  if (e.target.closest('[data-action="move-up"]')) {
    e.stopPropagation();
    moveSlide(idx, -1);
  } else if (e.target.closest('[data-action="move-down"]')) {
    e.stopPropagation();
    moveSlide(idx, 1);
  } else if (e.target.closest('[data-action="delete"]')) {
    e.stopPropagation();
    deleteSlide(idx);
  } else {
    selectSlide(idx);
  }
});

// keyboard support for slide items
document.getElementById('slideList').addEventListener('keydown', function (e) {
  var item = e.target.closest('[data-slide-idx]');
  if (!item) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectSlide(parseInt(item.dataset.slideIdx, 10));
  }
});

// ── EDITOR FIELDS: event delegation ──────────────────

var editorEl = document.getElementById('editorFields');

editorEl.addEventListener('input', function (e) {
  var key = e.target.dataset.fieldKey;
  if (key) updateField(key, e.target.value);
});

editorEl.addEventListener('change', function (e) {
  var key = e.target.dataset.fieldKey;
  if (key && e.target.type === 'checkbox') {
    updateField(key, e.target.checked);
  }
});

editorEl.addEventListener('click', function (e) {
  var typeOpt = e.target.closest('[data-type-opt]');
  if (typeOpt) changeType(typeOpt.dataset.typeOpt);
});

editorEl.addEventListener('keydown', function (e) {
  var typeOpt = e.target.closest('[data-type-opt]');
  if (typeOpt && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    changeType(typeOpt.dataset.typeOpt);
  }
});

// ── HEADER TABS ───────────────────────────────────────

document.querySelectorAll('[data-view]').forEach(function (btn) {
  btn.addEventListener('click', function () { setView(btn.dataset.view); });
});

// ── SLIDE NAVIGATION ──────────────────────────────────

document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', nextSlide);

document.addEventListener('keydown', function (e) {
  var tag = document.activeElement && document.activeElement.tagName;
  if (tag === 'TEXTAREA' || tag === 'INPUT') return;
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft')  prevSlide();
});

// ── ADD SLIDE ─────────────────────────────────────────

document.getElementById('addSlideBtn').addEventListener('click', addSlide);

// ── DOWNLOAD ─────────────────────────────────────────

document.getElementById('dlBtn').addEventListener('click', downloadCurrent);
document.getElementById('dlAllBtn').addEventListener('click', downloadAll);

// ── AGENT TABS ────────────────────────────────────────

document.querySelectorAll('[data-agent-tab]').forEach(function (btn) {
  btn.addEventListener('click', function () { switchAgent(btn.dataset.agentTab); });
});

// ── QUICK CHIPS ───────────────────────────────────────

document.querySelectorAll('[data-quick-agent]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    quickPrompt(btn.dataset.quickAgent, parseInt(btn.dataset.promptIdx, 10));
  });
});

// ── AGENT SEND BUTTONS ────────────────────────────────

document.getElementById('storySendBtn').addEventListener('click', function () { sendAgent('story'); });
document.getElementById('ideasSendBtn').addEventListener('click', function () { sendAgent('ideas'); });

// ── INIT ─────────────────────────────────────────────

renderSlideList();
renderSlidePreview();
renderEditor();
