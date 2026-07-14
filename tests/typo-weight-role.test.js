// Tests del peso tipográfico ligado al rol de familia (enfoque A).
//
// Cada clase tipográfica emite el font-weight a través de una variable
// emparejada con el rol de su familia (--hg-typo-font-weight-primary-light,
// ...-regular, ...-bold, ...). Así, un override de idioma que remapee la
// familia mueve también el peso, sin necesitar reglas !important.
// Las variables numéricas históricas (--hg-typo-font-weight-300, ...) se
// mantienen por retrocompatibilidad.

const assert = require('assert');
const os = require('os');
const path = require('path');
const { buildValueMap } = require('../src/generators/typo-generator');
const { generateRootVariables } = require('../src/generators/variables-generator');

function testTypoWeightRole() {
  console.log('🧪 Ejecutando tests de peso por rol...\n');
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

  const prefix = 'hg';
  const category = 'typo';
  const fontFamilyMap = {
    'primary-light': '"suisse-light", Arial, sans-serif',
    'primary-regular': '"suisse-regular", Arial, sans-serif',
    'primary-bold': '"suisse-semibold", Arial, sans-serif'
  };
  const typo = {
    'title-l': {
      fontFamily: '"suisse-light", Arial, sans-serif',
      fontWeight: '300',
      mobile: { fontSize: '12px', lineHeight: '1.4' },
      desktop: { fontSize: '13px', lineHeight: '1.4' }
    },
    'h2': {
      fontFamily: '"suisse-semibold", Arial, sans-serif',
      fontWeight: '600',
      mobile: { fontSize: '18px', lineHeight: '1.2' },
      desktop: { fontSize: '24px', lineHeight: '1.2' }
    }
  };
  // Usar un archivo histórico temporal para no ensuciar el real
  const historicalVarsPath = path.join(os.tmpdir(), `hg5-hist-${Date.now()}.json`);

  const result = buildValueMap(typo, fontFamilyMap, prefix, category, historicalVarsPath);

  check('buildValueMap devuelve fontWeightRoleVars', () => {
    assert.ok(result.fontWeightRoleVars instanceof Map, 'fontWeightRoleVars no es un Map');
  });

  check('el rol light mapea al peso 300', () => {
    const item = result.fontWeightRoleVars.get('primary-light');
    assert.ok(item, 'no existe el rol primary-light');
    assert.strictEqual(item.varName, '--hg-typo-font-weight-primary-light');
    assert.strictEqual(item.value, '300');
  });

  check('el rol bold mapea al peso 600', () => {
    const item = result.fontWeightRoleVars.get('primary-bold');
    assert.ok(item, 'no existe el rol primary-bold');
    assert.strictEqual(item.value, '600');
  });

  check('valueMap expone la variable de peso por rol de cada clase', () => {
    assert.strictEqual(
      result.valueMap['title-l'].fontWeightRole.varName,
      '--hg-typo-font-weight-primary-light'
    );
  });

  // Emisión en :root: variables por rol + numéricas conviven
  const root = generateRootVariables(
    result.fontFamilyVars,
    result.lineHeightVars,
    result.fontWeightVars,
    result.letterSpacingVars,
    result.textTransformVars,
    result.fontSizeVars,
    [],
    [],
    fontFamilyMap,
    prefix,
    category,
    result.fontWeightRoleVars
  );

  check(':root emite la variable de peso por rol', () => {
    assert.ok(
      root.includes('--hg-typo-font-weight-primary-light: 300;'),
      'no se emitió --hg-typo-font-weight-primary-light'
    );
  });

  check(':root mantiene la variable numérica (retrocompat)', () => {
    assert.ok(
      root.includes('--hg-typo-font-weight-300: 300;'),
      'no se emitió la variable numérica --hg-typo-font-weight-300'
    );
  });

  console.log(`\n📊 Peso por rol: ✅ ${passed}  ❌ ${failed}\n`);
  return { passed, failed };
}

module.exports = { testTypoWeightRole };

if (require.main === module) {
  const { failed } = testTypoWeightRole();
  if (failed > 0) process.exit(1);
}
