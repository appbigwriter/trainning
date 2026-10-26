const prefix = 'fbr-google-flow-v1:';
function get(key) {
  try { return localStorage.getItem(prefix + key); } catch { return null; }
}
function put(key, value) {
  try { localStorage.setItem(prefix + key, value); return true; } catch { return false; }
}
function storageWarning() {
  document.querySelectorAll('.save-note').forEach(el => {
    el.textContent = 'Armazenamento indisponível. Mantenha esta página aberta e exporte suas respostas antes de fechar.';
  });
}
document.querySelectorAll('[data-save]').forEach(el => {
  const value = get(el.dataset.save);
  if (value !== null) {
    if (el.type === 'checkbox') el.checked = value === 'true';
    else el.value = value;
  }
  el.addEventListener('input', () => {
    if (!put(el.dataset.save, el.type === 'checkbox' ? String(el.checked) : el.value)) storageWarning();
    updateProgress();
    if (el.closest('#planner')) calculate();
  });
});
function updateProgress() {
  let done = 0;
  for (let i = 1; i <= 18; i++) {
    const complete = get('lesson-' + i + '-done') === 'true';
    if (complete) done++;
    document.querySelectorAll('[data-progress="' + i + '"]').forEach(el => {
      el.textContent = complete ? '✓' : '→';
      el.setAttribute('aria-label', complete ? 'Aula marcada como estudada' : 'Aula ainda não marcada');
    });
  }
  const progress = document.getElementById('overall-progress');
  if (progress) progress.textContent = done + ' de 18 aulas marcadas';
  const checks = [...document.querySelectorAll('[data-launch]')];
  const status = document.getElementById('launch-status');
  if (status) {
    const checked = checks.filter(el => el.checked).length;
    status.textContent = checked + ' de ' + checks.length + ' pontos conferidos. ' +
      (checked === checks.length ? 'Revise suas evidências antes de publicar.' : 'Confira os pontos pendentes.');
  }
}
function showChoice(quiz, choice) {
  quiz.querySelectorAll('[data-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.choice === choice));
  });
  quiz.querySelector('.feedback').textContent =
    (choice === quiz.dataset.correct ? 'Correto. ' : 'Reveja. ') + quiz.dataset.feedback;
}
document.querySelectorAll('.quiz').forEach(quiz => {
  const saved = get(quiz.dataset.key);
  if (['0', '1', '2'].includes(saved)) showChoice(quiz, saved);
  quiz.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => {
      showChoice(quiz, button.dataset.choice);
      if (!put(quiz.dataset.key, button.dataset.choice)) storageWarning();
      // A nota anterior deixa de valer quando uma resposta é alterada.
      const status = document.getElementById('grade-status');
      if (status) status.textContent = 'Resposta atualizada. Confira a avaliação novamente.';
    });
  });
});
document.getElementById('grade')?.addEventListener('click', () => {
  const quizzes = [...document.querySelectorAll('.quiz')];
  const answered = quizzes.filter(q => q.querySelector('[aria-pressed="true"]'));
  const correct = answered.filter(q => q.querySelector('[aria-pressed="true"]').dataset.choice === q.dataset.correct);
  document.getElementById('grade-status').textContent = correct.length + ' de ' + quizzes.length +
    ' respostas corretas; ' + answered.length + ' respondidas. ' +
    (correct.length === quizzes.length ? 'Confira agora as evidências do projeto.' : 'Revise o feedback e tente novamente.');
});
function calculate() {
  const form = document.getElementById('planner');
  if (!form) return;
  const inputs = [...form.querySelectorAll('input, select')];
  const output = document.getElementById('plan-result');
  if (inputs.some(el => el.value.trim() === '' || !el.validity.valid || !Number.isFinite(Number(el.value))) ||
      !['60', '180', '300'].includes(document.getElementById('target').value)) {
    output.textContent = 'Preencha segundos úteis maiores que zero, tentativas e resultados inteiros a partir de 1, e créditos não negativos.';
    return;
  }
  const value = key => Number(document.getElementById(key).value);
  const number = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const plans = Math.ceil(value('target') / value('useful'));
  const outputs = plans * value('attempts') * value('outputs');
  const credits = outputs * value('credits');
  if (![plans, outputs, credits].every(Number.isFinite) || outputs > Number.MAX_SAFE_INTEGER) {
    output.textContent = 'Os valores excedem o intervalo de cálculo. Use números menores.';
    return;
  }
  output.replaceChildren();
  for (const [label, result] of [
    ['Planos estimados: ', number(plans)],
    ['Resultados gerados estimados: ', number(outputs)],
    ['Créditos estimados: ', number(credits)],
    ['Duração final planejada: ', number(value('target')) + ' segundos']
  ]) {
    const line = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = result;
    line.append(label, strong);
    output.append(line);
  }
}
document.getElementById('export')?.addEventListener('click', () => {
  const data = { curso: 'Como usar o Google Flow para produzir videos longos ( 1, 3 e 5 minutos)', versao: 1, exportado: new Date().toISOString(), respostas: {} };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) data.respostas[key.slice(prefix.length)] = localStorage.getItem(key);
    }
  } catch { storageWarning(); }
  // Inclui valores atuais da página, mesmo se o armazenamento falhar.
  document.querySelectorAll('[data-save]').forEach(el => {
    data.respostas[el.dataset.save] = el.type === 'checkbox' ? String(el.checked) : el.value;
  });
  document.querySelectorAll('.quiz').forEach(quiz => {
    const selected = quiz.querySelector('[aria-pressed="true"]');
    if (selected) data.respostas[quiz.dataset.key] = selected.dataset.choice;
  });
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'meu-projeto-google-flow.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
updateProgress();
calculate();
