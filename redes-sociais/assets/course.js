const prefix = 'fbr-redes-sociais-v1:';
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
    if (el.closest('#metrics')) calculate();
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
  const form = document.getElementById('metrics');
  if (!form) return;
  const inputs = [...form.querySelectorAll('input')];
  const output = document.getElementById('metric-result');
  if (inputs.some(el => el.value.trim() === '' || !el.validity.valid || !Number.isFinite(Number(el.value)) || Number(el.value) < 0)) {
    output.textContent = 'Preencha valores não negativos. Contagens e minutos devem ser inteiros; horas podem ter uma casa decimal.';
    return;
  }
  const value = key => Number(document.getElementById('metric-' + key).value);
  const number = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const perPost = value('posts') > 0 ? number(value('hours') / value('posts')) + ' h' : 'indefinidas (nenhuma peça)';
  const rate = value('views') > 0 ? number(value('contacts') / value('views') * 100) + '%' : 'indefinida (zero visualizações)';
  const gain = value('end') - value('start');
  const time = value('before') - value('after');
  output.replaceChildren();
  for (const [label, result] of [
    ['Horas por peça: ', perPost],
    ['Conversas por visualização: ', rate],
    ['Ganho líquido de seguidores: ', number(gain)],
    ['Saldo de tempo por tarefa: ', number(time) + ' min' + (time < 0 ? ' (mais trabalho)' : time > 0 ? ' (tempo poupado)' : ' (sem economia)')]
  ]) {
    const line = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = result;
    line.append(label, strong);
    output.append(line);
  }
}
document.getElementById('export')?.addEventListener('click', () => {
  const data = { curso: 'Como crescer suas redes sociais', versao: 1, exportado: new Date().toISOString(), respostas: {} };
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
  link.download = 'meu-plano-redes-sociais.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
updateProgress();
calculate();
