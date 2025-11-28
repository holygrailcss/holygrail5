// Modo watch - Detecta cambios en config.json y regenera automáticamente
// Optimizado con fs.watch, debouncing y verificación de hash

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadConfig } = require('./config-loader');
const { generateCSS } = require('./css-generator');
const { generateHTML } = require('./docs-generator/html-generator');
const { writeFile } = require('./generators/utils');

// Constantes
const DEBOUNCE_DELAY = 300; // ms - tiempo de espera antes de regenerar
const WATCH_POLL_INTERVAL = 1000; // ms - intervalo de polling como fallback

// Función para calcular hash del archivo (más confiable que timestamp)
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

// Función para generar CSS y HTML
function generateFiles(configPath, outputPath, htmlPath, silent = false) {
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
    
    if (!silent) {
      console.log(`\n🎉 Generación completada exitosamente! (${new Date().toLocaleTimeString('es-ES')})\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Función principal de watch optimizada
function watch(configPath = path.join(__dirname, '..', 'config.json'), outputPath = path.join(__dirname, '..', 'dist', 'output.css'), htmlPath = path.join(__dirname, '..', 'dist', 'index.html'), silent = false) {
  if (!silent) {
    console.log('👀 Modo watch activado - Monitoreando cambios en config.json...\n');
    console.log('📝 Presiona Ctrl+C para salir\n');
    console.log('💡 Tip: Abre otro terminal y ejecuta "npm run serve" para levantar el servidor\n');
  }
  
  // Verificar que el archivo existe
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Error: No se encontró el archivo ${configPath}`);
    process.exit(1);
  }
  
  // Generar archivos inicialmente
  generateFiles(configPath, outputPath, htmlPath, silent);
  
  // Estado del watch
  let lastHash = getFileHash(configPath);
  let debounceTimer = null;
  let watcher = null;
  let isRegenerating = false;
  
  // Función para regenerar archivos con debouncing
  function handleFileChange() {
    // Limpiar timer anterior si existe
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Esperar un momento antes de regenerar (debouncing)
    debounceTimer = setTimeout(() => {
      const currentHash = getFileHash(configPath);
      
      // Solo regenerar si el hash realmente cambió
      if (currentHash && currentHash !== lastHash && !isRegenerating) {
        isRegenerating = true;
        lastHash = currentHash;
        if (!silent) {
          console.log('🔄 Detectado cambio en config.json, regenerando...\n');
        }
        generateFiles(configPath, outputPath, htmlPath, silent);
        if (!silent) {
          console.log('✨ Archivos actualizados - Recarga el navegador para ver los cambios\n');
        }
        isRegenerating = false;
      }
    }, DEBOUNCE_DELAY);
  }
  
  // Intentar usar fs.watch (más eficiente, event-driven)
  try {
    watcher = fs.watch(configPath, { persistent: true }, (eventType, filename) => {
      // fs.watch puede emitir múltiples eventos, ignorar si no hay filename
      if (filename && (eventType === 'change' || eventType === 'rename')) {
        handleFileChange();
      }
    });
    
    // Manejar errores del watcher
    watcher.on('error', (error) => {
      console.warn('⚠️  Error en fs.watch, usando fallback a fs.watchFile:', error.message);
      // Fallback a watchFile
      startWatchFileFallback();
    });
    
  } catch (error) {
    // Si fs.watch falla, usar watchFile como fallback
    console.warn('⚠️  fs.watch no disponible, usando fs.watchFile como fallback');
    startWatchFileFallback();
  }
  
  // Función fallback usando fs.watchFile (menos eficiente pero más compatible)
  function startWatchFileFallback() {
    // Limpiar watcher anterior si existe
    if (watcher) {
      watcher.close();
    }
    
    fs.watchFile(configPath, { interval: WATCH_POLL_INTERVAL }, (curr, prev) => {
      // Solo procesar si el archivo realmente cambió
      if (curr.mtime.getTime() !== prev.mtime.getTime()) {
        handleFileChange();
      }
    });
  }
  
  // Manejar cierre del proceso (solo si no es modo silencioso)
  if (!silent) {
    function cleanup() {
      console.log('\n\n👋 Modo watch detenido');
      
      // Limpiar timers
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Cerrar watchers
      if (watcher) {
        watcher.close();
      }
      
      // Limpiar watchFile si está activo
      try {
        fs.unwatchFile(configPath);
      } catch (error) {
        // Ignorar errores al limpiar
      }
      
      process.exit(0);
    }
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1] || path.join(__dirname, '..', 'config.json');
  const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || path.join(__dirname, '..', 'dist', 'output.css');
  const htmlPath = args.find(arg => arg.startsWith('--html='))?.split('=')[1] || path.join(__dirname, '..', 'dist', 'index.html');
  
  watch(configPath, outputPath, htmlPath);
}

module.exports = { watch, generateFiles };

