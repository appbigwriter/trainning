/* Shared behavior; each course has its own browser-local namespace. */
(() => {
  'use strict';
  const course = document.body.dataset.course;
  const namespace = `fbr-training:${course}:v1`;
  const status = document.querySelector('.save-status');
  let state = {};
  let storageWarning = '';
  try {
    const parsed = JSON.parse(localStorage.getItem(namespace) || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) state = parsed;
    else throw new Error('Invalid saved state');
  } catch {
    storageWarning = 'Não foi possível ler os dados salvos. As respostas desta sessão podem ser exportadas pelo caderno.';
  }
  const notify = () => { if (status) status.textContent = storageWarning; };
  const save = () => {
    try { localStorage.setItem(namespace, JSON.stringify(state)); }
    catch { storageWarning = 'Armazenamento indisponível ou cheio. As respostas ficam apenas nesta página; exporte o caderno antes de sair.'; }
    notify();
  };
  function progress() {
    let count = 0;
    let first = null;
    for (let i = 1; i <= 12; i++) {
      const n = String(i).padStart(2, '0');
      const done = state[`done-${n}`] === true;
      if (done) count++;
      else if (first === null) first = i;
      const mark = document.querySelector(`[data-mark="${n}"]`);
      if (mark) { mark.textContent = done ? '✓' : '○'; mark.setAttribute('aria-label', done ? 'Concluída' : 'Não concluída'); }
    }
    const text = document.getElementById('progress-text');
    if (text) text.textContent = `${count} de 12 aulas concluídas`;
    const bar = document.getElementById('course-progress');
    if (bar) { bar.value = count; bar.textContent = `${count} de 12`; }
    const resume = document.getElementById('resume');
    if (resume) {
      resume.href = first ? `lessons/${String(first).padStart(4, '0')}.html` : 'reference/avaliacao.html';
      resume.textContent = first ? `Continuar na aula ${first} →` : 'Revisar avaliação final →';
    }
  }
  document.querySelectorAll('[data-save]').forEach(el => {
    const key = el.dataset.save;
    if (el.type === 'checkbox') el.checked = state[key] === true;
    else if (el.type === 'radio') el.checked = state[key] === el.value;
    else if (typeof state[key] === 'string') el.value = state[key];
    el.addEventListener(el.tagName === 'TEXTAREA' ? 'input' : 'change', () => {
      state[key] = el.type === 'checkbox' ? el.checked : el.value;
      save(); progress();
      const quiz = el.closest('[data-quiz]');
      if (quiz) quiz.querySelector('.feedback').textContent = '';
      const gradeStatus = document.getElementById('grade-status');
      if (gradeStatus) gradeStatus.textContent = '';
    });
  });
  function check(quiz) {
    const selected = quiz.querySelector('input:checked');
    const output = quiz.querySelector('.feedback');
    if (!selected) { output.textContent = 'Escolha uma resposta antes de conferir.'; return null; }
    const correct = selected.value === quiz.dataset.answer;
    output.textContent = `${correct ? 'Resposta correta.' : 'Revise sua escolha.'} ${quiz.dataset.feedback}`;
    return correct;
  }
  document.querySelectorAll('[data-check]').forEach(button => button.addEventListener('click', () => check(button.closest('[data-quiz]'))));
  document.getElementById('grade')?.addEventListener('click', () => {
    const results = Array.from(document.querySelectorAll('[data-quiz]'), check);
    const answered = results.filter(value => value !== null).length;
    document.getElementById('grade-status').textContent = `${answered} de ${results.length} respondidas; ${results.filter(Boolean).length} corretas. ${answered < results.length ? 'Complete as questões pendentes.' : 'Confira as justificativas e revise seu projeto.'}`;
  });
  document.getElementById('print')?.addEventListener('click', () => window.print());
  document.getElementById('export')?.addEventListener('click', () => {
    const payload = { course, edition: '2026-10-26', exportedAt: new Date().toISOString(), responses: state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `${course}-caderno.json`;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.getElementById('export-status').textContent = 'Exportação solicitada. Confira o arquivo nos downloads do navegador.';
  });
  window.addEventListener('storage', event => {
    if (event.key === namespace) {
      storageWarning = 'Os dados deste curso mudaram em outra aba. Recarregue antes de continuar editando.';
      notify();
    }
  });
  notify(); progress();
})();
