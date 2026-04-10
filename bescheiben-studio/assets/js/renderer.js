'use strict';

// ── SLIDE LIST ────────────────────────────────────────

function renderSlideList() {
  const list = document.getElementById('slideList');
  list.innerHTML = '';

  slides.forEach(function (s, i) {
    const li = document.createElement('li');
    li.className = 'slide-item' + (i === currentSlide ? ' active' : '');
    li.setAttribute('data-slide-idx', i);
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + getSlideLabel(s));
    li.setAttribute('aria-pressed', String(i === currentSlide));

    li.innerHTML =
      '<div class="slide-item-header">' +
        '<div>' +
          '<div class="slide-num">SLIDE ' + String(i + 1).padStart(2, '0') + '</div>' +
          '<div class="slide-label">' + escHtml(getSlideLabel(s)) + '</div>' +
        '</div>' +
        '<div class="slide-actions">' +
          '<button class="icon-btn" type="button" data-action="move-up"   aria-label="Mover slide para cima">' +
            '↑' +
          '</button>' +
          '<button class="icon-btn" type="button" data-action="move-down" aria-label="Mover slide para baixo">' +
            '↓' +
          '</button>' +
          '<button class="icon-btn del" type="button" data-action="delete" aria-label="Remover slide">' +
            '×' +
          '</button>' +
        '</div>' +
      '</div>';

    list.appendChild(li);
  });

  document.getElementById('navIndicator').textContent =
    (currentSlide + 1) + ' / ' + slides.length;
}

/**
 * Returns a short display label for a slide.
 * @param {object} s
 * @returns {string}
 */
function getSlideLabel(s) {
  switch (s.type) {
    case 'cover':   return (s.headline   || 'Cover').slice(0, 30);
    case 'content': return (s.step || '') + ': ' + (s.headline || '').slice(0, 20);
    case 'quote':   return ((s.quote || 'Quote').slice(0, 28) + '…');
    case 'cta':     return s.headline || 'CTA';
    default:        return 'Slide';
  }
}

// ── SLIDE PREVIEW ─────────────────────────────────────

function renderSlidePreview() {
  const el = document.getElementById('slide-preview');
  el.innerHTML = buildSlideHtml(slides[currentSlide]);
}

// ── EDITOR ────────────────────────────────────────────

function renderEditor() {
  const s = slides[currentSlide];
  const container = document.getElementById('editorFields');

  const ICONS = { cover: '🖼️', content: '📄', quote: '💬', cta: '🎯' };
  const LABELS = { cover: 'Cover', content: 'Conteúdo', quote: 'Quote', cta: 'CTA' };

  const typeOpts = ['cover', 'content', 'quote', 'cta'].map(function (t) {
    return (
      '<div class="type-opt' + (s.type === t ? ' selected' : '') + '" ' +
        'data-type-opt="' + t + '" ' +
        'role="radio" ' +
        'aria-checked="' + (s.type === t) + '" ' +
        'tabindex="' + (s.type === t ? '0' : '-1') + '">' +
        '<span class="type-icon" aria-hidden="true">' + ICONS[t] + '</span>' +
        LABELS[t] +
      '</div>'
    );
  }).join('');

  let html =
    '<div class="editor-section">' +
      '<div class="field-label" id="type-label">Tipo de Slide</div>' +
      '<div class="type-grid" role="radiogroup" aria-labelledby="type-label">' +
        typeOpts +
      '</div>' +
    '</div>';

  if (s.type === 'cover') {
    html += fieldHtml('Tag (acima do título)', 'tag', s.tag, 'text');
    html += fieldHtml('Título principal', 'headline', s.headline, 'textarea');
    html += fieldHtml('Destaque no título', 'headlineHighlight', s.headlineHighlight, 'text', 'Palavra(s) em verde');
    html += fieldHtml('Subtítulo', 'sub', s.sub, 'textarea');
    html += toggleHtml('Mostrar CTA', 'showCta', s.showCta);
    if (s.showCta) {
      html += fieldHtml('Texto do CTA', 'cta', s.cta, 'text');
    }
    html += fieldHtml('Nome da marca', 'brand', s.brand, 'text');
  } else if (s.type === 'content') {
    html += fieldHtml('Badge do passo', 'step', s.step, 'text');
    html += fieldHtml('Título', 'headline', s.headline, 'textarea');
    html += fieldHtml('Destaque no título', 'headlineHighlight', s.headlineHighlight, 'text', 'Palavra(s) em roxo');
    html += fieldHtml('Corpo do texto', 'body', s.body, 'textarea');
    html += fieldHtml('Nome da marca', 'brand', s.brand, 'text');
  } else if (s.type === 'quote') {
    html += fieldHtml('Citação', 'quote', s.quote, 'textarea');
    html += fieldHtml('Destaque na citação', 'quoteHighlight', s.quoteHighlight, 'text', 'Palavra(s) em verde');
    html += fieldHtml('Autor', 'author', s.author, 'text');
  } else if (s.type === 'cta') {
    html += fieldHtml('Eyebrow (texto pequeno)', 'eyebrow', s.eyebrow, 'text');
    html += fieldHtml('Título', 'headline', s.headline, 'textarea');
    html += fieldHtml('Destaque no título', 'headlineHighlight', s.headlineHighlight, 'text');
    html += fieldHtml('Texto de apoio', 'body', s.body, 'textarea');
    html += fieldHtml('Texto do botão', 'cta', s.cta, 'text');
  }

  container.innerHTML = html;
}

/**
 * Generates HTML for a labeled text input or textarea field.
 * Uses data-field-key instead of inline event handlers.
 * @private
 */
function fieldHtml(label, key, val, type, hint) {
  var safeVal  = escHtml(val || '');
  var safeKey  = escHtml(key);
  var hintHtml = hint
    ? '<span class="badge">' + escHtml(hint) + '</span>'
    : '';

  var inputHtml = type === 'textarea'
    ? '<textarea data-field-key="' + safeKey + '">' + safeVal + '</textarea>'
    : '<input type="text" value="' + safeVal + '" data-field-key="' + safeKey + '" />';

  return (
    '<div class="editor-section">' +
      '<div class="field-label">' + escHtml(label) + hintHtml + '</div>' +
      inputHtml +
    '</div>'
  );
}

/**
 * Generates HTML for a toggle (checkbox) field.
 * Uses data-field-key instead of inline event handlers.
 * @private
 */
function toggleHtml(label, key, val) {
  var safeKey = escHtml(key);
  var checked = val ? ' checked' : '';

  return (
    '<div class="editor-section">' +
      '<div class="toggle-row">' +
        '<span class="toggle-label">' + escHtml(label) + '</span>' +
        '<label class="toggle">' +
          '<input type="checkbox" data-field-key="' + safeKey + '"' + checked + ' />' +
          '<span class="toggle-slider"></span>' +
        '</label>' +
      '</div>' +
    '</div>'
  );
}

// ── FIELD MUTATIONS ───────────────────────────────────

/**
 * Updates a field on the current slide and re-renders preview + list.
 * @param {string} key
 * @param {*} val
 */
function updateField(key, val) {
  slides[currentSlide][key] = val;
  renderSlidePreview();
  renderSlideList();
}

/**
 * Changes the type of the current slide and re-renders everything.
 * @param {string} type
 */
function changeType(type) {
  slides[currentSlide].type = type;
  renderEditor();
  renderSlidePreview();
  renderSlideList();
}
