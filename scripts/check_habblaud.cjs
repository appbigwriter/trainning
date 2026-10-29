/* Run against the built site: NODE_PATH must resolve an installed Playwright. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const base = process.env.TRAINING_URL || 'http://127.0.0.1:18767';
  const browser = await chromium.launch({ headless: true,
    executablePath: process.env.TRAINING_BROWSER || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    async function visit(route) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, route);
      assert.ok(await page.title(), route);
    }
    await visit('/');
    await page.locator('a[href="habblaud/"]').click();
    assert.match(page.url(), /\/habblaud\/$/);
    assert.equal(await page.locator('.lesson-row').count(), 18);
    assert.equal(await page.locator('.module').count(), 6);
    assert.equal(await page.locator('#progress-text').textContent(), '0 de 18 aulas concluídas');
    assert.equal(await page.locator('#course-progress').getAttribute('max'), '18');
    const notes = 'Laboratório: tarefa de leitura conferida; sem dados reais.';
    for (let i = 1; i <= 18; i++) {
      await visit(`/habblaud/lessons/${String(i).padStart(4, '0')}.html`);
      await page.locator('#notes').fill(`${notes} Aula ${i}.`);
      const quiz = page.locator('[data-quiz]');
      await quiz.locator('[data-check]').click();
      assert.match(await quiz.locator('.feedback').textContent(), /Escolha uma resposta/);
      const answer = await quiz.getAttribute('data-answer');
      await quiz.locator(`input[value="${(Number(answer) + 1) % 3}"]`).check();
      await quiz.locator('[data-check]').click();
      assert.match(await quiz.locator('.feedback').textContent(), /Revise sua escolha/);
      await quiz.locator(`input[value="${answer}"]`).check();
      await quiz.locator('[data-check]').click();
      assert.match(await quiz.locator('.feedback').textContent(), /Resposta correta/);
      await page.locator('.completion input').check();
      await page.reload();
      assert.equal(await page.locator('#notes').inputValue(), `${notes} Aula ${i}.`);
      assert.equal(await page.locator('.completion input').isChecked(), true);
    }
    await visit('/habblaud/');
    assert.equal(await page.locator('#progress-text').textContent(), '18 de 18 aulas concluídas');
    assert.equal(await page.locator('#resume').getAttribute('href'), 'reference/avaliacao.html');
    await visit('/habblaud/lessons/0018.html');
    await page.locator('.completion input').uncheck();
    await visit('/habblaud/');
    assert.equal(await page.locator('#progress-text').textContent(), '17 de 18 aulas concluídas');
    assert.equal(await page.locator('#resume').getAttribute('href'), 'lessons/0018.html');
    await page.locator('#resume').click();
    await page.locator('.completion input').check();
    await visit('/habblaud/reference/avaliacao.html');
    assert.equal(await page.locator('[data-quiz]').count(), 6);
    await page.locator('#grade').click();
    assert.match(await page.locator('#grade-status').textContent(), /0 de 6 respondidas; 0 corretas/);
    for (const quiz of await page.locator('[data-quiz]').all()) {
      const answer = await quiz.getAttribute('data-answer');
      await quiz.locator(`input[value="${answer}"]`).check();
    }
    await page.locator('#grade').click();
    assert.match(await page.locator('#grade-status').textContent(), /6 de 6 respondidas; 6 corretas/);
    await page.locator('[data-quiz]').first().locator('input:not(:checked)').first().check();
    assert.equal(await page.locator('#grade-status').textContent(), '');
    await page.locator('#grade').click();
    assert.match(await page.locator('#grade-status').textContent(), /6 de 6 respondidas; 5 corretas/);
    await visit('/habblaud/reference/checklist.html');
    assert.equal(await page.locator('[data-save]').count(), 10);
    await page.locator('[data-save="check-0"]').check();
    await visit('/habblaud/reference/caderno.html');
    assert.equal(await page.locator('#note-17').inputValue(), `${notes} Aula 18.`);
    await page.locator('#final').fill('Manual final do laboratório.');
    const downloaded = page.waitForEvent('download');
    await page.locator('#export').click();
    const download = await downloaded;
    assert.equal(download.suggestedFilename(), 'habblaud-caderno.json');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    assert.equal(exported.course, 'habblaud');
    assert.equal(exported.edition, '2026-10-28');
    assert.equal(exported.responses['lesson-18-notes'], `${notes} Aula 18.`);
    assert.equal(exported.responses['final-project'], 'Manual final do laboratório.');
    assert.equal(exported.responses['check-0'], true);
    assert.equal(exported.responses['done-18'], true);
    // The shared runtime must retain the previous courses' 12-lesson behavior.
    for (const slug of ['dim', 'authority-engine', 'audience-builder', 'agency-flux', 'social-engine']) {
      await visit(`/${slug}/`);
      assert.equal(await page.locator('#progress-text').textContent(), '0 de 12 aulas concluídas');
      await visit(`/${slug}/lessons/0001.html`);
      await page.locator('.completion input').check();
      await visit(`/${slug}/`);
      assert.equal(await page.locator('#progress-text').textContent(), '1 de 12 aulas concluídas');
    }
    await visit('/habblaud/');
    assert.equal(await page.locator('#progress-text').textContent(), '18 de 18 aulas concluídas');
    const root = path.resolve(__dirname, '../habblaud');
    const files = (await fs.readdir(root, { recursive: true })).filter(file => file.endsWith('.html'));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const file of files) {
        const route = '/habblaud/' + file.replaceAll(path.sep, '/');
        await visit(route);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow ${width}: ${route}`);
      }
      if (process.env.TRAINING_SCREENSHOTS) {
        await fs.mkdir(process.env.TRAINING_SCREENSHOTS, { recursive: true });
        await visit('/habblaud/');
        await page.screenshot({ path: path.join(process.env.TRAINING_SCREENSHOTS, `habblaud-${width}.png`), fullPage: true });
        await visit('/habblaud/lessons/0004.html');
        await page.screenshot({ path: path.join(process.env.TRAINING_SCREENSHOTS, `installation-${width}.png`), fullPage: true });
      }
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: ${files.length} Habblaud pages at desktop/mobile widths; 18 lessons; quizzes; persistence; progress/resume; 6-question assessment; JSON export; isolation and regression across 5 existing courses; no JS or HTTP errors.`);
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
