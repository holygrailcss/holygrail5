// Modo watch - Detecta cambios en config.json y regenera automáticamente

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./config');
const { generateCSS } = require('./parser');
const { generateHTML } = require('./guide');
const { writeFile } = require('./utils');

// Función para generar CSS y HTML
function generateFiles(configPath, outputPath, htmlPath) {
  try {
    const configData = loadConfig(configPath);
    
    // Generar CSS
    const cssContent = generateCSS(configData);
    writeFile(outputPath, cssContent, 'CSS');
    
    // Generar HTML (ajustar ruta del CSS en el HTML si está en carpeta diferente)
    let htmlContent = generateHTML(configData);
    
    // Si el HTML y CSS están en carpetas diferentes, ajustar la ruta del CSS
    const outputDir = path.dirname(outputPath);
    const htmlDir = path.dirname(htmlPath);
    
    // Si el HTML y CSS están en carpetas diferentes, ajustar la ruta del CSS
    // Si están en la misma carpeta (dist/), usar ruta relativa simple
    if (outputDir !== htmlDir) {
      const relativePath = path.relative(htmlDir, outputDir);
      const cssFileName = path.basename(outputPath);
      const cssRelativePath = path.join(relativePath, cssFileName).replace(/\\/g, '/');
      htmlContent = htmlContent.replace(/href="output\.css[^"]*"/, `href="${cssRelativePath}?v=${Date.now()}"`);
    } else {
      // Si están en la misma carpeta, usar solo el nombre del archivo con timestamp
      htmlContent = htmlContent.replace(/href="output\.css[^"]*"/, `href="output.css?v=${Date.now()}"`);
    }
    
    writeFile(htmlPath, htmlContent, 'HTML');
    
    console.log(`\n🎉 Generación completada exitosamente! (${new Date().toLocaleTimeString('es-ES')})\n`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Función principal de watch
function watch(configPath = path.join(__dirname, '..', 'config.json'), outputPath = path.join(__dirname, '..', 'dist', 'output.css'), htmlPath = path.join(__dirname, '..', 'dist', 'index.html')) {
  console.log('👀 Modo watch activado - Monitoreando cambios en config.json...\n');
  console.log('📝 Presiona Ctrl+C para salir\n');
  console.log('💡 Tip: Abre otro terminal y ejecuta "npm run serve" para levantar el servidor\n');
  
  // Generar archivos inicialmente
  generateFiles(configPath, outputPath, htmlPath);
  
  // Monitorear cambios en config.json
  let lastModified = fs.statSync(configPath).mtime.getTime();
  
  fs.watchFile(configPath, { interval: 500 }, (curr, prev) => {
    const currentModified = curr.mtime.getTime();
    
    // Solo regenerar si el archivo realmente cambió
    if (currentModified !== lastModified) {
      lastModified = currentModified;
      console.log('🔄 Detectado cambio en config.json, regenerando...\n');
      generateFiles(configPath, outputPath, htmlPath);
      console.log('✨ Archivos actualizados - Recarga el navegador para ver los cambios\n');
    }
  });
  
  // Manejar cierre del proceso
  process.on('SIGINT', () => {
    console.log('\n\n👋 Modo watch detenido');
    fs.unwatchFile(configPath);
    process.exit(0);
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1] || path.join(__dirname, '..', 'config.json');
  const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || path.join(__dirname, '..', 'dist', 'output.css');
  const htmlPath = args.find(arg => arg.startsWith('--html='))?.split('=')[1] || path.join(__dirname, '..', 'dist', 'index.html');
  
  watch(configPath, outputPath, htmlPath);
}

module.exports = { watch, generateFiles };

