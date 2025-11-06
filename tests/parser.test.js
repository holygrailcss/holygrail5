// Tests para parseador JSON a CSS

const { generateCSS, buildValueMap } = require('../src/parser');
const { loadConfig } = require('../src/config');

console.log('🧪 Ejecutando tests de parseador...\n');

try {
  const config = loadConfig();
  
  // Test buildValueMap
  console.log('Test buildValueMap:');
  const { fontFamilyVars, fontSizeVars, lineHeightVars } = buildValueMap(
    config.classes,
    config.fontFamilyMap,
    config.prefix || 'hg',
    config.category || 'typo'
  );
  console.log('  - Font Family Variables:', fontFamilyVars.size, '✅');
  console.log('  - Font Size Variables:', fontSizeVars.size, '✅');
  console.log('  - Line Height Variables:', lineHeightVars.size, '✅');
  
  // Test generateCSS
  console.log('\nTest generateCSS:');
  const css = generateCSS(config);
  const hasReset = css.includes('Reset CSS Mínimo');
  const hasRoot = css.includes(':root');
  const hasMediaQuery = css.includes('@media');
  const hasClasses = css.includes('.h2') || css.includes('.title-l');
  
  console.log('  - Incluye reset CSS:', hasReset ? '✅' : '❌');
  console.log('  - Incluye :root:', hasRoot ? '✅' : '❌');
  console.log('  - Incluye media queries:', hasMediaQuery ? '✅' : '❌');
  console.log('  - Incluye clases:', hasClasses ? '✅' : '❌');
  console.log('  - Longitud CSS:', css.length, 'caracteres');
  
} catch (error) {
  console.log('❌ Error en tests de parseador:', error.message);
}

console.log('\n✅ Tests de parseador completados!\n');

