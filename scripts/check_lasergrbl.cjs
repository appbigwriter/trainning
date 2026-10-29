/* Playwright integration check; uses an isolated browser context. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const base = process.env.TRAINING_URL || 'http://127.0.0.1:18767';
  const browser = await chromium.launch({ headless: true, executablePath: process.env.TRAINING_BROWSER || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) errors.push(response.url());
    });
    async function visit(route) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, route);
    }
    await visit('/');
    await page.locator('a[href="lasergrbl/"]').click();
    assert.equal(await page.locator('.lesson-row').count(), 30);
    assert.equal(await page.locator('.module').count(), 10);
    assert.equal(await page.locator('#course-progress').getAttribute('max'), '30');
    assert.equal(await page.locator('#programas tbody tr').count(), 8);
    const downloads = await page.locator('#arquivos a[download]').evaluateAll(nodes => nodes.map(node => node.href));
    assert.equal(downloads.length, 5);
    for (const url of downloads) {
      const response = await context.request.get(url);
      assert.equal(response.status(), 200, url);
      assert.ok((await response.body()).length > 100);
    }
    for (let number = 1; number <= 30; number++) {
      await visit(`/lasergrbl/lessons/${String(number).padStart(4, '0')}.html`);
      await page.locator('#notes').fill(`Evidência digital da aula ${number}; teste físico pendente.`);
      const quiz = page.locator('[data-quiz]');
      const answer = Number(await quiz.getAttribute('data-answer'));
      await quiz.locator('[data-check]').click();
      assert.match(await quiz.locator('.feedback').textContent(), /Escolha uma resposta/);
      await quiz.locator(`input[value="${(answer + 1) % 3}"]`).check();
      await quiz.locator('[data-check]').click();
      assert.match(await quiz.locator('.feedback').textContent(), /Revise sua escolha/);
      await quiz.locator(`input[value="${answer}"]`).check();
      await quiz.locator('[data-check]').click();
      assert.match(await quiz.locator('.feedback').textContent(), /Resposta correta/);
      await page.locator('.completion input').check();
    }
    await page.reload();
    assert.equal(await page.locator('.completion input').isChecked(), true);
    assert.match(await page.locator('#notes').inputValue(), /aula 30/);
    await visit('/lasergrbl/');
    assert.equal(await page.locator('#progress-text').textContent(), '30 de 30 aulas concluídas');
    assert.equal(await page.locator('#resume').getAttribute('href'), 'reference/avaliacao.html');
    await visit('/lasergrbl/reference/avaliacao.html');
    assert.equal(await page.locator('[data-quiz]').count(), 10);
    await page.locator('#grade').click();
    assert.match(await page.locator('#grade-status').textContent(), /0 de 10 respondidas; 0 corretas/);
    for (const quiz of await page.locator('[data-quiz]').all()) {
      const answer = await quiz.getAttribute('data-answer');
      await quiz.locator(`input[value="${answer}"]`).check();
    }
    await page.locator('#grade').click();
    assert.match(await page.locator('#grade-status').textContent(), /10 de 10 respondidas; 10 corretas/);
    await visit('/lasergrbl/reference/checklist.html');
    await page.locator('[data-save="check-0"]').check();
    await visit('/lasergrbl/reference/caderno.html');
    assert.match(await page.locator('#note-29').inputValue(), /aula 30/);
    await page.locator('#final').fill('Três projetos digitais; execução física pendente.');
    const pendingDownload = page.waitForEvent('download');
    await page.locator('#export').click();
    const download = await pendingDownload;
    assert.equal(download.suggestedFilename(), 'lasergrbl-caderno.json');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const data = JSON.parse(Buffer.concat(chunks));
    assert.equal(data.course, 'lasergrbl');
    assert.equal(data.edition, '2026-10-29');
    assert.equal(data.responses['done-30'], true);
    assert.equal(data.responses['check-0'], true);
    assert.match(data.responses['lesson-30-notes'], /aula 30/);
    for (const [slug, total] of [['habblaud', 18], ['dim', 12]]) {
      await visit(`/${slug}/`);
      assert.equal(await page.locator('#progress-text').textContent(), `0 de ${total} aulas concluídas`);
    }
    const root = path.resolve(__dirname, '../lasergrbl');
    const files = (await fs.readdir(root, { recursive: true })).filter(file => file.endsWith('.html'));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const file of files) {
        await visit('/lasergrbl/' + file.replaceAll(path.sep, '/'));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow ${width}: ${file}`);
      }
      if (process.env.TRAINING_SCREENSHOTS) {
        await fs.mkdir(process.env.TRAINING_SCREENSHOTS, { recursive: true });
        await visit('/lasergrbl/');
        await page.screenshot({ path: path.join(process.env.TRAINING_SCREENSHOTS, `lasergrbl-${width}.png`), fullPage: true });
        await visit('/lasergrbl/lessons/0013.html');
        await page.screenshot({ path: path.join(process.env.TRAINING_SCREENSHOTS, `lasergrbl-aula-${width}.png`), fullPage: true });
      }
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: ${files.length} pages at desktop/mobile widths; 30 lessons; 10-question assessment; notes/progress persistence; JSON export; 5 downloads; isolation from existing courses; no JS/HTTP errors.`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
