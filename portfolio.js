(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  // Preserve incoming links from the previous homepage grouping.
  const legacyDisciplines = { '#content-design': 'content-design.html', '#form-design': 'form-design.html', '#ai-content-design': 'ai-content-design.html', '#conversational-design': 'conversational-design.html' };
  if (document.body.classList.contains('home-page') && legacyDisciplines[location.hash]) location.replace(legacyDisciplines[location.hash]);
  const theme = $('.theme-toggle');
  function setTheme(value) {
    document.documentElement.dataset.theme = value;
    if (theme) { theme.setAttribute('aria-label', `Switch to ${value === 'dark' ? 'light' : 'dark'} theme`); theme.innerHTML = `<span aria-hidden="true">${value === 'dark' ? '☼' : '◐'}</span>`; }
    try { localStorage.setItem('chika-theme', value); } catch (_) {}
  }
  if (theme) { theme.hidden = false; setTheme(document.documentElement.dataset.theme || 'light'); theme.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')); }
  const menu = $('.menu-toggle'), nav = $('#main-nav'), mobile = matchMedia('(max-width: 800px)');
  let menuOpen = false;
  function updateMenu() { if (!menu || !nav) return; menu.hidden = !mobile.matches; nav.hidden = mobile.matches && !menuOpen; menu.setAttribute('aria-expanded', String(menuOpen)); }
  if (menu) { menu.addEventListener('click', () => { menuOpen = !menuOpen; updateMenu(); }); $$('a', nav).forEach(a => a.addEventListener('click', () => { menuOpen = false; updateMenu(); })); mobile.addEventListener('change', updateMenu); updateMenu(); document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { menuOpen = false; updateMenu(); menu.focus(); } }); }

  const cards = $$('.project-card'), search = $('#project-search');
  if (cards.length && search && $('.project-controls')) {
    $('.project-controls').hidden = false;
    const updateProjects = () => {
      const term = search.value.toLocaleLowerCase().trim(); let visible = 0;
      cards.forEach(card => { const matches = card.dataset.search.toLocaleLowerCase().includes(term); card.hidden = !matches; if (matches) visible++; });
      $$('.category-section').forEach(section => { section.hidden = !$$('.project-card', section).some(card => !card.hidden); });
      $('.no-projects').hidden = visible !== 0;
      $('#filter-status').textContent = `${visible} ${visible === 1 ? 'project' : 'projects'} shown${term ? ` for “${search.value.trim()}”` : ''}.`;
    };
    search.addEventListener('input', updateProjects);
    $('#reset-projects').addEventListener('click', () => { search.value = ''; updateProjects(); search.focus(); });
    $$('.category-tile').forEach(link => link.addEventListener('click', () => { if (search.value) { search.value = ''; updateProjects(); } }));
    updateProjects();
  }

  const examples = {
    clarify: { user: 'Show me the feedback for waste.', good: 'Do you mean one waste page, or feedback across the whole waste section?', weak: 'Here is all the waste feedback.', insight: 'Clarify the scope before retrieving evidence. One focused question prevents a confident answer to the wrong request.' },
    confirm: { user: 'Mark all of those submissions as resolved.', good: 'You’re asking to change the status of 12 submissions to resolved. Review the selected submissions before confirming the update.', weak: 'Done! I’ve resolved those for you.', insight: 'Make the proposed action and its scope visible before changing a service record. A request is not evidence that an update has succeeded.' },
    evidence: { user: 'Did the new page fix the problem?', good: 'The available feedback describes the problem, but it doesn’t include a before-and-after comparison. I can show the comments; I can’t yet claim an improvement.', weak: 'Yes, the new page is performing much better.', insight: 'Separate observation from inference. When the evidence cannot establish a result, say what is missing and what can still be checked.' }
  };
  let scenario = 'clarify', designed = true;
  function renderDemo(announce = false) {
    const data = examples[scenario], preview = $('.scenario-preview'); if (!preview) return;
    $('#demo-user').textContent = data.user; $('#demo-answer').textContent = designed ? data.good : data.weak;
    $('#demo-insight').textContent = data.insight; $('.demo-mode').textContent = designed ? 'Designed response' : 'Weaker response';
    $('.response-toggle').setAttribute('aria-pressed', String(designed)); $('.response-toggle').innerHTML = `${designed ? 'Compare with a weaker response' : 'Show the designed response'} <span aria-hidden="true">↔</span>`;
    $('#demo-response').classList.toggle('is-weak', !designed);
    $$('.scenario-button').forEach(b => { const active = b.dataset.scenario === scenario; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    if (announce) { preview.classList.remove('changed'); requestAnimationFrame(() => preview.classList.add('changed')); }
  }
  $$('.scenario-button').forEach(b => b.addEventListener('click', () => { scenario = b.dataset.scenario; designed = true; renderDemo(true); }));
  $('.response-toggle')?.addEventListener('click', () => { designed = !designed; renderDemo(true); });
  $('.demo-reset')?.addEventListener('click', () => { scenario = 'clarify'; designed = true; renderDemo(true); });

  const article = $('.case-page article');
  if (article) {
    const headings = $$('h2', article), used = new Set();
    const toc = document.createElement('aside'); toc.className = 'case-toc'; toc.setAttribute('aria-label', 'In this case study');
    const intro = document.createElement('p'); intro.textContent = 'IN THIS CASE STUDY'; toc.append(intro);
    const list = document.createElement('ol');
    headings.forEach((h, i) => { let slug = h.textContent.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `section-${i}`; if (used.has(slug)) slug += `-${i}`; used.add(slug); if (!h.id) h.id = slug; const li = document.createElement('li'), a = document.createElement('a'); a.href = `#${h.id}`; a.textContent = h.textContent; li.append(a); list.append(li); });
    toc.append(list); article.before(toc);
    const minutes = Math.max(1, Math.ceil(article.textContent.trim().split(/\s+/).length / 220));
    const readTime = document.createElement('p'); readTime.className = 'reading-time'; readTime.textContent = `${minutes} MIN READ · CASE STUDY`;
    $('.case-hero')?.append(readTime);
    if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) $$('a', toc).forEach(a => { const active = a.hash === `#${entry.target.id}`; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }, { rootMargin: '-110px 0px -65% 0px' }); headings.forEach(h => observer.observe(h)); }
  }
  const dialog = $('.image-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    $$('.case-page article figure img, .case-cover img').forEach(img => {
      if (img.closest('a,button')) return;
      const button = document.createElement('button'); button.className = 'image-enlarge'; button.type = 'button'; button.setAttribute('aria-label', `Enlarge image: ${img.alt || 'project artefact'}`); img.before(button); button.append(img);
      button.addEventListener('click', () => { $('img', dialog).src = img.currentSrc || img.src; $('img', dialog).alt = img.alt; $('p', dialog).textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt; dialog.showModal(); });
    });
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) dialog.close(); } });
  }

  const copy = $('.copy-email');
  if (copy) { copy.hidden = false; let reset; copy.addEventListener('click', async () => { clearTimeout(reset); try { await navigator.clipboard.writeText('chikasco@gmail.com'); copy.textContent = 'Copied ✓'; $('#copy-status').textContent = 'Email address copied.'; } catch (_) { copy.textContent = 'chikasco@gmail.com'; $('#copy-status').textContent = 'Copy unavailable. Email address: chikasco@gmail.com'; } reset = setTimeout(() => { copy.textContent = 'Copy email'; }, 3000); }); }
  const top = $('.back-top'), progress = $('.reading-progress'); let ticking = false;
  function updateScroll() { const max = document.documentElement.scrollHeight - innerHeight; if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; if (top) top.hidden = scrollY < 700; ticking = false; }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll); top?.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); $('.brand')?.focus({ preventScroll: true }); }); updateScroll();

  const bins = $('#collection-bins');
  if (bins) { const calculate = () => { const count = Number(bins.value), valid = Number.isInteger(count) && count >= 1 && count <= 10; if (valid) bins.removeAttribute('aria-invalid'); else bins.setAttribute('aria-invalid', 'true'); $('#bin-summary').textContent = valid ? `${count} ${count === 1 ? 'bin' : 'bins'} for collection · £${count * 60} · collections until March 2027.` : 'Enter a whole number from 1 to 10 to try this example.'; }; bins.addEventListener('input', calculate); calculate(); }
  const preferenceForm = $('#preference-example');
  if (preferenceForm) { preferenceForm.addEventListener('submit', e => { e.preventDefault(); const first = $('#first-preference'), second = $('#second-preference'), error = $('#preference-error'), result = $('#preference-result'); if (first.value === second.value) { second.setAttribute('aria-invalid', 'true'); error.hidden = false; error.textContent = 'Choose a different second preference. You’ve already chosen this setting as your first preference.'; result.hidden = true; second.focus(); } else { second.removeAttribute('aria-invalid'); error.hidden = true; result.hidden = false; result.textContent = 'Two different preferences selected. The order is clear and there are no duplicates. This is a demonstration; nothing has been submitted.'; } }); $$('select',preferenceForm).forEach(select => select.addEventListener('change', () => { $('#second-preference').removeAttribute('aria-invalid'); $('#preference-error').hidden = true; $('#preference-result').hidden = true; })); }
})();
