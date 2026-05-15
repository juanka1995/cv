import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');

const targets = [
  { html: 'cv.en.html', pdf: 'Juan_Carlos_Ruiz_Garcia_CV_EN.pdf' },
  { html: 'cv.es.html', pdf: 'Juan_Carlos_Ruiz_Garcia_CV_ES.pdf' },
];

fs.mkdirSync(distDir, { recursive: true });

const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  for (const { html, pdf } of targets) {
    const input = path.join(srcDir, html);
    const output = path.join(distDir, pdf);
    const page = await context.newPage();
    await page.goto(`file://${input}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await page.close();
    console.log(`Wrote dist/${pdf}`);
  }
} finally {
  await browser.close();
}
