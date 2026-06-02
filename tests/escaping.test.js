// Tests de escaping / anti-inyección en la guía generada.
//
// La guía (dist/index.html) se publica como documentación estática, así
// que ningún valor del config debe poder inyectar HTML/JS al volcarse en
// ella. Estos tests envenenan el config con caracteres especiales y
// comprueban que la salida los escapa en vez de reflejarlos en crudo.

const assert = require('assert');
const { escapeHtml } = require('../src/generators/utils');
const { generateHTML } = require('../src/docs-generator/html-generator');
const { loadConfig } = require('../src/config-loader');

function testEscaping() {
  console.log('🧪 Ejecutando tests de escaping...\n');
  let passed = 0;
  let failed = 0;

  const check = (name, fn) => {
    try {
      fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
      failed++;
    }
  };

  // 1) escapeHtml cubre los cinco caracteres peligrosos (incluidas comillas
  //    porque muchos valores se interpolan dentro de atributos).
  check('escapeHtml escapa & < > " \'', () => {
    assert.strictEqual(
      escapeHtml(`<script>&"'`),
      '&lt;script&gt;&amp;&quot;&#39;'
    );
  });

  // 2) Un valor de color malicioso NO debe aparecer como etiqueta cruda en
  //    la guía; su forma escapada SÍ.
  const payload = '"><script>alert(1)</script>';
  const config = loadConfig();
  const poisoned = {
    ...config,
    colors: { ...(config.colors || {}), evil: payload },
    fontFamilyMap: { ...(config.fontFamilyMap || {}), evil: payload }
  };
  const html = generateHTML(poisoned);

  check('el payload de color no se refleja como <script> crudo', () => {
    assert.ok(
      !html.includes('<script>alert(1)</script>'),
      'la guía contiene un <script> inyectado desde el config'
    );
  });

  check('el payload aparece escapado en la guía', () => {
    assert.ok(
      html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'),
      'no se encontró la forma escapada del payload'
    );
  });

  console.log(`\n📊 Escaping: ✅ ${passed}  ❌ ${failed}\n`);
  return { passed, failed };
}

if (require.main === module) {
  const r = testEscaping();
  if (r.failed > 0) process.exit(1);
}

module.exports = { testEscaping };
