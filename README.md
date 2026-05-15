# Juan Carlos Ruiz García — CV

Currículum en inglés y español. Las fuentes HTML viven en [src/](src/), los logos de empresas en [logos/](logos/), y los PDFs generados en [dist/](dist/).

## Descargar

- **English PDF**: [dist/Juan_Carlos_Ruiz_Garcia_CV_EN.pdf](dist/Juan_Carlos_Ruiz_Garcia_CV_EN.pdf)
- **PDF en español**: [dist/Juan_Carlos_Ruiz_Garcia_CV_ES.pdf](dist/Juan_Carlos_Ruiz_Garcia_CV_ES.pdf)
- HTML fuente: [src/cv.en.html](src/cv.en.html) · [src/cv.es.html](src/cv.es.html)

## Regenerar los PDFs

```bash
npm install        # una sola vez (instala Playwright y descarga Chromium)
npm run build      # genera dist/*.pdf desde src/*.html
```

Requisitos: Node.js 18+. En Linux/WSL, Chromium necesita libs del sistema:

```bash
sudo apt-get install -y libnss3 libnspr4 libatk-bridge2.0-0 libdrm2 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
  libgbm1 libpango-1.0-0 libcairo2 libasound2t64
```

## Estructura

```text
src/        Fuentes HTML + CSS compartido
  cv.en.html       Fuente en inglés
  cv.es.html       Fuente en español
  styles.css       CSS compartido por ambos idiomas (un solo archivo)
logos/      Imágenes referenciadas desde el HTML
  perfil.jpg            Foto de perfil
  jubilame.png          Logos de empresas/instituciones
  unie.png
  uam.png
  granada-dynamics.png
  github.png            Icono junto a enlaces de repos
dist/       PDFs generados (commiteados para descarga directa)
  Juan_Carlos_Ruiz_Garcia_CV_EN.pdf
  Juan_Carlos_Ruiz_Garcia_CV_ES.pdf
scripts/
  build-pdf.mjs   Render HTML → PDF (Playwright + Chromium headless)
```

## Mantener ambos idiomas sincronizados

Cualquier cambio **de contenido** (nuevo trabajo, publicación, skill, etc.) debe aplicarse a los dos HTML antes de regenerar los PDFs.

Cualquier cambio **de estilo** se hace una sola vez en `src/styles.css` y aplica automáticamente a ambos idiomas.
