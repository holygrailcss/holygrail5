/**
 * Components Page Generator
 *
 * Genera dist/componentes.html: una página que muestra todos los
 * componentes base (themes/_base/) con preview vivo + el nombre de
 * clase junto a cada variante.
 *
 * Se renderiza con el tema DUTTI como base genérica (tema neutro del
 * framework). Sobre él se pueden aplicar otros temas en el futuro si
 * añadimos un theme switcher. Por tanto la página enlaza:
 *   - dist/output.css          → tokens --hg-* del framework
 *   - dist/themes/dutti.css    → mapeo de variables + reglas de componente
 */

const fs = require('fs');
const path = require('path');
const { resolveActiveThemes } = require('../generators/utils');

/**
 * Nombre del tema que se usa como "base genérica" para renderizar la
 * página. Si en algún momento se quiere cambiar, basta con modificar
 * esta constante (o exponerla en config.json).
 */
const BASE_THEME = 'dutti';

/**
 * Lista canónica de componentes mostrados en la página.
 */
const COMPONENT_SECTIONS = [
  {
    id: 'buttons',
    title: 'Botones',
    description:
      'Variantes estándar del framework. Las clases viven en <code>themes/_base/_buttons.css</code>. Se renderizan con el tema Dutti (base genérico). Cada tema puede sobreescribirlas con su propia identidad visual.',
    examples: [
      {
        subtitle: 'Variantes',
        items: [
          { html: '<button class="btn btn-primary">Primary</button>', cls: '.btn .btn-primary' },
          { html: '<button class="btn btn-secondary">Secondary</button>', cls: '.btn .btn-secondary' },
          { html: '<button class="btn btn-tertiary">Tertiary</button>', cls: '.btn .btn-tertiary' },
          { html: '<button class="btn btn-outline">Outline</button>', cls: '.btn .btn-outline' },
          { html: '<button class="btn btn-ghost">Ghost</button>', cls: '.btn .btn-ghost' },
          { html: '<button class="btn btn-link">Link</button>', cls: '.btn .btn-link' },
          { html: '<button class="btn btn-primary" disabled>Disabled</button>', cls: '.btn[disabled]' }
        ]
      },
      {
        subtitle: 'Tamaños',
        items: [
          { html: '<button class="btn btn-primary btn-sm">Small</button>', cls: '.btn .btn-sm' },
          { html: '<button class="btn btn-primary btn-md">Medium</button>', cls: '.btn .btn-md' },
          { html: '<button class="btn btn-primary btn-lg">Large</button>', cls: '.btn .btn-lg' }
        ]
      }
    ]
  },
  {
    id: 'inputs',
    title: 'Inputs',
    description:
      'Campos de formulario base: texto, email, password, textarea y select. Clases en <code>themes/_base/_inputs.css</code>.',
    examples: [
      {
        subtitle: 'Tipos',
        items: [
          { html: '<input type="text" class="input" placeholder="Texto" />', cls: '.input' },
          { html: '<input type="email" class="input" placeholder="email@ejemplo.com" />', cls: '.input (type=email)' },
          { html: '<input type="password" class="input" placeholder="••••••" />', cls: '.input (type=password)' },
          { html: '<textarea class="input" placeholder="Comentario..." rows="3"></textarea>', cls: '.input (textarea)' },
          { html: '<select class="input"><option>Opción A</option><option>Opción B</option></select>', cls: '.input (select)' }
        ]
      },
      {
        subtitle: 'Estados',
        items: [
          { html: '<input type="text" class="input input-error" value="Error" />', cls: '.input .input-error' },
          { html: '<input type="text" class="input input-success" value="OK" />', cls: '.input .input-success' },
          { html: '<input type="text" class="input input-warning" value="Warning" />', cls: '.input .input-warning' },
          { html: '<input type="text" class="input" disabled value="Disabled" />', cls: '.input[disabled]' }
        ]
      }
    ]
  },
  {
    id: 'labels',
    title: 'Labels',
    description:
      'Etiquetas de formulario, incluyendo variante obligatoria. Clases en <code>themes/_base/_labels.css</code>.',
    examples: [
      {
        subtitle: 'Variantes',
        items: [
          { html: '<label class="label">Nombre</label>', cls: '.label' },
          { html: '<label class="label label-required">Email</label>', cls: '.label .label-required' }
        ]
      }
    ]
  },
  {
    id: 'checkboxes',
    title: 'Checkboxes',
    description:
      'Checkboxes con estilado propio. Clases en <code>themes/_base/_checkboxes.css</code>.',
    examples: [
      {
        subtitle: 'Estados',
        items: [
          { html: '<label class="checkbox"><input type="checkbox" /> <span>Acepto</span></label>', cls: '.checkbox' },
          { html: '<label class="checkbox"><input type="checkbox" checked /> <span>Marcado</span></label>', cls: '.checkbox (checked)' },
          { html: '<label class="checkbox"><input type="checkbox" disabled /> <span>Disabled</span></label>', cls: '.checkbox[disabled]' }
        ]
      }
    ]
  },
  {
    id: 'radios',
    title: 'Radios',
    description:
      'Radio buttons. Clases en <code>themes/_base/_radios.css</code>.',
    examples: [
      {
        subtitle: 'Grupo',
        items: [
          { html: '<label class="radio"><input type="radio" name="demo-radio" /> <span>Opción A</span></label>', cls: '.radio' },
          { html: '<label class="radio"><input type="radio" name="demo-radio" checked /> <span>Opción B</span></label>', cls: '.radio (checked)' },
          { html: '<label class="radio"><input type="radio" name="demo-radio" disabled /> <span>Disabled</span></label>', cls: '.radio[disabled]' }
        ]
      }
    ]
  },
  {
    id: 'switches',
    title: 'Switches',
    description:
      'Interruptores on/off. Clases en <code>themes/_base/_switches.css</code>.',
    examples: [
      {
        subtitle: 'Estados',
        items: [
          { html: '<label class="switch"><input type="checkbox" /> <span class="switch-slider"></span></label>', cls: '.switch' },
          { html: '<label class="switch"><input type="checkbox" checked /> <span class="switch-slider"></span></label>', cls: '.switch (checked)' },
          { html: '<label class="switch"><input type="checkbox" disabled /> <span class="switch-slider"></span></label>', cls: '.switch[disabled]' }
        ]
      }
    ]
  },
  {
    id: 'forms',
    title: 'Formularios',
    description:
      'Composición de campos con label + input + estado. Clases en <code>themes/_base/_forms.css</code>.',
    examples: [
      {
        subtitle: 'Grupo de formulario',
        items: [
          {
            html:
              '<div class="form-group"><label class="label label-required">Email</label><input type="email" class="input" placeholder="tu@email.com" /></div>',
            cls: '.form-group'
          },
          {
            html:
              '<div class="form-group"><label class="label">Mensaje</label><textarea class="input" rows="3" placeholder="Escribe aquí..."></textarea></div>',
            cls: '.form-group (con textarea)'
          }
        ]
      }
    ]
  },
  {
    id: 'containers',
    title: 'Containers',
    description:
      'Contenedores responsivos con <code>max-width</code> y padding adaptativo. Clases en <code>themes/_base/_containers.css</code>.',
    examples: [
      {
        subtitle: 'Variantes',
        items: [
          {
            html:
              '<div class="container" style="background:var(--hg-color-light-grey); padding:var(--hg-spacing-16);">.container</div>',
            cls: '.container'
          },
          {
            html:
              '<div class="container-sm" style="background:var(--hg-color-light-grey); padding:var(--hg-spacing-16);">.container-sm</div>',
            cls: '.container-sm'
          },
          {
            html:
              '<div class="container-lg" style="background:var(--hg-color-light-grey); padding:var(--hg-spacing-16);">.container-lg</div>',
            cls: '.container-lg'
          }
        ]
      }
    ]
  },
  {
    id: 'grid',
    title: 'Grid',
    description:
      'Sistema de grid base. Clases en <code>themes/_base/objects/_grid.css</code>.',
    examples: [
      {
        subtitle: 'Fila con columnas',
        items: [
          {
            html:
              '<div class="row"><div class="col-xs-12 col-md-6" style="background:var(--hg-color-light-grey); padding:var(--hg-spacing-16);">col-md-6</div><div class="col-xs-12 col-md-6" style="background:var(--hg-color-light-grey); padding:var(--hg-spacing-16);">col-md-6</div></div>',
            cls: '.row .col-xs-12 .col-md-6'
          }
        ]
      }
    ]
  }
];

// Escape HTML para mostrar el nombre de clase dentro de <code>.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderSection(section) {
  const blocks = section.examples
    .map((group) => {
      const items = group.items
        .map(
          (it) => `
          <div class="cmp-item">
            <div class="cmp-preview">${it.html}</div>
            <div class="cmp-code">${escapeHtml(it.cls)}</div>
          </div>`
        )
        .join('');
      return `
        <h3 class="cmp-subtitle">${group.subtitle}</h3>
        <div class="cmp-grid">${items}
        </div>`;
    })
    .join('');

  return `
    <section class="cmp-section" id="${section.id}">
      <h2 class="cmp-title">${section.title}</h2>
      <p class="cmp-desc">${section.description}</p>
      ${blocks}
    </section>`;
}

/**
 * Construye la nav superior. La página de Componentes es un destino
 * de primer nivel (al lado de Skills), así que se marca con `active`.
 */
function buildTopNav(activeThemes) {
  const themeLinks = (activeThemes || [])
    .map((t) => `      <a href="themes/${t.name}-demo.html">${t.label}</a>`)
    .join('\n');

  return `
  <div class="guide-header">
    <a href="index.html" class="guide-logo" style="text-decoration:none;">HolyGrail5</a>
    <nav class="guide-nav">
      <a href="index.html">Guía</a>
      <a href="componentes.html" class="active">Componentes</a>
${themeLinks}
      <a href="skills.html">Skills</a>
    </nav>
  </div>`;
}

/**
 * Genera el HTML completo de dist/componentes.html.
 *
 * @param {string} projectRoot
 * @param {Object} [configData] - Config ya cargado (para nav dinámica).
 * @returns {string|null}
 */
function generateComponentsPage(projectRoot, configData = null) {
  const baseDir = path.join(projectRoot, 'themes', '_base');
  if (!fs.existsSync(baseDir)) {
    console.warn('⚠️  No se encontró themes/_base/, omitiendo componentes.html');
    return null;
  }

  const activeThemes = configData ? resolveActiveThemes(configData) : [];
  const sectionsHtml = COMPONENT_SECTIONS.map(renderSection).join('\n');
  const tocLinks = COMPONENT_SECTIONS.map(
    (s) => `<a href="#${s.id}" class="cmp-toc-link">${s.title}</a>`
  ).join('\n          ');

  const topNav = buildTopNav(activeThemes);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HolyGrail5 — Componentes base</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Instrument+Sans:regular,100,500,600,700">
  <!-- Framework base -->
  <link rel="stylesheet" href="output.css">
  <!-- Tema base genérico: ${BASE_THEME} (variables + componentes) -->
  <link rel="stylesheet" href="themes/${BASE_THEME}.css">
  <style>
    /* ── PÁGINA COMPONENTES ── */
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 0;
      font-family: 'Instrument Sans', sans-serif !important;
      background: #fff; color: #111;
      -webkit-font-smoothing: antialiased;
    }

    .guide-header {
      position: sticky; top: 0; z-index: 50;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0,0,0,0.06);
      padding: 0 2rem; height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .guide-logo {
      font-size: 14px; font-weight: 300; text-transform: uppercase;
      line-height: 1; border: 1px solid #000;
      padding: 4px 8px; border-radius: 8px;
      text-decoration: none; color: #000;
    }
    .guide-nav { display: flex; gap: 1.5rem; align-items: center; }
    .guide-nav a { font-size: 13px; color: #666; text-decoration: none; transition: color 0.2s; }
    .guide-nav a:hover { color: #000; }
    .guide-nav a.active { color: #000; font-weight: 600; }

    .cmp-hero { padding: 6rem 2rem 3rem; max-width: 960px; margin: 0 auto; }
    .cmp-hero-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-bottom: 1rem; }
    .cmp-hero h1 { font-size: clamp(36px, 6vw, 64px); font-weight: 500; line-height: 1.1; color: #000; margin: 0 0 1.5rem; }
    .cmp-hero-desc { font-size: 16px; line-height: 1.6; color: #666; max-width: 720px; }

    .cmp-page-toc { max-width: 960px; margin: 0 auto; padding: 0 2rem 2rem; }
    .cmp-page-toc-inner {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 1.25rem 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    .cmp-toc-link {
      font-size: 12px; padding: 4px 12px; background: #f5f5f5;
      border-radius: 100px; color: #555; text-decoration: none;
      transition: background 0.2s;
    }
    .cmp-toc-link:hover { background: #eee; color: #111; }

    .cmp-sections { max-width: 960px; margin: 0 auto; padding: 0 2rem 4rem; }
    .cmp-section { padding: 3rem 0; border-top: 1px solid #f0f0f0; }
    .cmp-section:first-child { border-top: none; padding-top: 1rem; }
    .cmp-title { font-size: 24px; font-weight: 600; color: #111; margin: 0 0 0.5rem; }
    .cmp-desc { font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 1.5rem; max-width: 720px; }
    .cmp-desc code { background: #f3f3f3; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; }
    .cmp-subtitle { font-size: 13px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin: 1.5rem 0 0.75rem; }
    .cmp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }
    .cmp-item {
      display: flex; flex-direction: column; gap: 0.5rem;
      padding: 1.25rem; background: #fafafa;
      border: 1px solid #eee; border-radius: 8px;
    }
    .cmp-preview {
      min-height: 48px;
      display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;
    }
    .cmp-code {
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
      font-size: 11px; color: #666;
      padding-top: 0.5rem; border-top: 1px dashed #e5e5e5;
    }

    .cmp-footer { border-top: 1px solid #eee; padding: 2rem; text-align: center; }
    .cmp-footer p { font-size: 12px; color: #999; margin: 0; }
    .cmp-footer a { color: #666; text-decoration: none; }
    .cmp-footer a:hover { color: #000; }
  </style>
</head>
<body>
${topNav}

  <section class="cmp-hero">
    <p class="cmp-hero-label">Biblioteca</p>
    <h1>Componentes base</h1>
    <p class="cmp-hero-desc">
      Estos son los componentes compartidos que viven en
      <code>themes/_base/</code>. Se renderizan aquí con el tema
      <strong>${BASE_THEME[0].toUpperCase() + BASE_THEME.slice(1)}</strong>
      como base genérica del framework; cualquier otro tema puede
      aplicarse encima para redefinir la identidad visual sin tocar
      el HTML.
    </p>
  </section>

  <nav class="cmp-page-toc">
    <div class="cmp-page-toc-inner">
      ${tocLinks}
    </div>
  </nav>

  <div class="cmp-sections">
${sectionsHtml}
  </div>

  <footer class="cmp-footer">
    <p>
      HolyGrail 5 ·
      <a href="index.html">Guía</a> ·
      <a href="skills.html">Skills</a>
    </p>
  </footer>
</body>
</html>`;
}

// CLI
if (require.main === module) {
  const projectRoot = path.join(__dirname, '..', '..');
  const html = generateComponentsPage(projectRoot);
  if (html) {
    const outputPath = path.join(projectRoot, 'dist', 'componentes.html');
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log('✅ componentes.html generado en dist/');
  }
}

module.exports = { generateComponentsPage };
