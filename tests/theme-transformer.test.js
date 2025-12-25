// Tests para ThemeTransformer

const { ThemeTransformer } = require('../src/build/theme-transformer');
const path = require('path');
const fs = require('fs');

function testThemeTransformer() {
  console.log('\n🧪 Tests de ThemeTransformer\n');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Instanciar ThemeTransformer
  try {
    const transformer = new ThemeTransformer(path.join(__dirname, '..'));
    
    if (transformer && transformer.projectRoot) {
      console.log('✅ Test 1: Instanciar ThemeTransformer');
      passedTests++;
    } else {
      throw new Error('ThemeTransformer no instanciado correctamente');
    }
  } catch (error) {
    console.log('❌ Test 1: Error al instanciar ThemeTransformer:', error.message);
    failedTests++;
  }

  // Test 2: Método transform con archivo inexistente
  try {
    const transformer = new ThemeTransformer(path.join(__dirname, '..'));
    const result = transformer.transform(
      'archivo-inexistente.html',
      'destino.html',
      'test-theme',
      true
    );
    
    if (result === false) {
      console.log('✅ Test 2: transform retorna false con archivo inexistente');
      passedTests++;
    } else {
      throw new Error('transform debería retornar false');
    }
  } catch (error) {
    console.log('❌ Test 2: Error en transform con archivo inexistente:', error.message);
    failedTests++;
  }

  // Test 3: Verificar que transform agrega sidebar
  try {
    const projectRoot = path.join(__dirname, '..');
    const demoPath = path.join(projectRoot, 'themes', 'dutti', 'demo.html');
    
    if (fs.existsSync(demoPath)) {
      const transformer = new ThemeTransformer(projectRoot);
      
      // Crear directorio temporal para test
      const testOutputDir = path.join(projectRoot, 'dist', 'themes');
      if (!fs.existsSync(testOutputDir)) {
        fs.mkdirSync(testOutputDir, { recursive: true });
      }
      
      const testOutputPath = path.join(testOutputDir, 'test-demo.html');
      const result = transformer.transform(
        demoPath,
        testOutputPath,
        'dutti',
        true
      );
      
      if (result && fs.existsSync(testOutputPath)) {
        const content = fs.readFileSync(testOutputPath, 'utf8');
        
        if (content.includes('guide-sidebar') && 
            content.includes('guide-header') &&
            content.includes('toggleSidebar')) {
          console.log('✅ Test 3: transform agrega sidebar y header');
          passedTests++;
        } else {
          throw new Error('Sidebar o header no agregados correctamente');
        }
        
        // Limpiar archivo de test
        fs.unlinkSync(testOutputPath);
      } else {
        throw new Error('transform no creó el archivo de salida');
      }
    } else {
      console.log('⚠️  Test 3: Saltado (themes/dutti/demo.html no encontrado)');
    }
  } catch (error) {
    console.log('❌ Test 3: Error al verificar sidebar:', error.message);
    failedTests++;
  }

  // Test 4: Verificar que transform agrega Lenis
  try {
    const projectRoot = path.join(__dirname, '..');
    const demoPath = path.join(projectRoot, 'themes', 'dutti', 'demo.html');
    
    if (fs.existsSync(demoPath)) {
      const transformer = new ThemeTransformer(projectRoot);
      
      const testOutputDir = path.join(projectRoot, 'dist', 'themes');
      if (!fs.existsSync(testOutputDir)) {
        fs.mkdirSync(testOutputDir, { recursive: true });
      }
      
      const testOutputPath = path.join(testOutputDir, 'test-lenis-demo.html');
      const result = transformer.transform(
        demoPath,
        testOutputPath,
        'dutti',
        true
      );
      
      if (result && fs.existsSync(testOutputPath)) {
        const content = fs.readFileSync(testOutputPath, 'utf8');
        
        if (content.includes('lenis.min.js') && 
            content.includes('new Lenis') &&
            content.includes('lenis.raf')) {
          console.log('✅ Test 4: transform agrega scripts de Lenis');
          passedTests++;
        } else {
          throw new Error('Scripts de Lenis no agregados correctamente');
        }
        
        // Limpiar archivo de test
        fs.unlinkSync(testOutputPath);
      } else {
        throw new Error('transform no creó el archivo de salida');
      }
    } else {
      console.log('⚠️  Test 4: Saltado (themes/dutti/demo.html no encontrado)');
    }
  } catch (error) {
    console.log('❌ Test 4: Error al verificar Lenis:', error.message);
    failedTests++;
  }

  // Test 5: Verificar que transform ajusta rutas CSS
  try {
    const projectRoot = path.join(__dirname, '..');
    const demoPath = path.join(projectRoot, 'themes', 'dutti', 'demo.html');
    
    if (fs.existsSync(demoPath)) {
      const transformer = new ThemeTransformer(projectRoot);
      
      const testOutputDir = path.join(projectRoot, 'dist', 'themes');
      if (!fs.existsSync(testOutputDir)) {
        fs.mkdirSync(testOutputDir, { recursive: true });
      }
      
      const testOutputPath = path.join(testOutputDir, 'test-css-demo.html');
      const result = transformer.transform(
        demoPath,
        testOutputPath,
        'dutti',
        true
      );
      
      if (result && fs.existsSync(testOutputPath)) {
        const content = fs.readFileSync(testOutputPath, 'utf8');
        
        if (content.includes('href="dutti.css"') && 
            content.includes('href="../guide-styles.css"') &&
            content.includes('href="../output.css"')) {
          console.log('✅ Test 5: transform ajusta rutas CSS correctamente');
          passedTests++;
        } else {
          throw new Error('Rutas CSS no ajustadas correctamente');
        }
        
        // Limpiar archivo de test
        fs.unlinkSync(testOutputPath);
      } else {
        throw new Error('transform no creó el archivo de salida');
      }
    } else {
      console.log('⚠️  Test 5: Saltado (themes/dutti/demo.html no encontrado)');
    }
  } catch (error) {
    console.log('❌ Test 5: Error al verificar rutas CSS:', error.message);
    failedTests++;
  }

  // Resumen
  console.log(`\n📊 Resumen ThemeTransformer: ${passedTests} pasados, ${failedTests} fallidos\n`);
  
  return { passed: passedTests, failed: failedTests };
}

// Exportar para run-all.js
module.exports = { testThemeTransformer };

// Ejecutar si se llama directamente
if (require.main === module) {
  testThemeTransformer();
}

