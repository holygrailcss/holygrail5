// Modo watch - Detecta cambios en config.json y regenera automáticamente
// Optimizado con fs.watch, debouncing y verificación de hash
// Refactorizado para usar BuildOrchestrator

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { BuildOrchestrator } = require('./build/build-orchestrator');
const { AssetManager } = require('./build/asset-manager');
const { ThemeTransformer } = require('./build/theme-transformer');
const { loadConfig } = require('./config-loader');

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

// Función para generar CSS y HTML usando BuildOrchestrator
function generateFiles(configPath, outputPath, htmlPath, silent = false) {
  try {
    const projectRoot = path.dirname(path.dirname(configPath));
    const orchestrator = new BuildOrchestrator({
      projectRoot,
      configPath,
      outputPath,
      htmlPath,
      silent,
      watchMode: true // Activar modo watch para agregar timestamp
    });
    
    orchestrator.build();
    
    if (!silent) {
      console.log(`\n🎉 Generación completada exitosamente! (${new Date().toLocaleTimeString('es-ES')})\n`);
    }
  } catch (error) {
    if (!silent) {
      console.error('❌ Error:', error.message);
    }
  }
}

// Función para copiar archivos CSS e imágenes usando AssetManager
function copyCSSFiles(silent = false) {
  const projectRoot = path.join(__dirname, '..');
  const assetManager = new AssetManager(projectRoot);
  assetManager.copyCSS(silent);
}

function copyImageFiles(silent = false) {
  const projectRoot = path.join(__dirname, '..');
  const assetManager = new AssetManager(projectRoot);
  assetManager.copyImages(silent);
}

// Función principal de watch optimizada
function watch(configPath = path.join(__dirname, '..', 'config.json'), outputPath = path.join(__dirname, '..', 'dist', 'output.css'), htmlPath = path.join(__dirname, '..', 'dist', 'index.html'), silent = false) {
  if (!silent) {
    console.log('👀 Modo watch activado - Monitoreando cambios en config.json y CSS...\n');
    console.log('📝 Presiona Ctrl+C para salir\n');
    console.log('💡 Tip: Abre otro terminal y ejecuta "npm run serve" para levantar el servidor\n');
  }
  
  // Verificar que el archivo existe
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Error: No se encontró el archivo ${configPath}`);
    process.exit(1);
  }
  
  const projectRoot = path.dirname(path.dirname(configPath));
  
  // Generar archivos inicialmente
  generateFiles(configPath, outputPath, htmlPath, silent);
  
  // Archivos CSS a observar
  const cssFilesToWatch = [
    path.join(__dirname, 'docs-generator', 'guide-styles.css')
  ];
  
  // Archivos de tema a observar
  const themeFilesToWatch = [
    path.join(projectRoot, 'themes', 'dutti', 'demo.html')
  ];
  
  // Estado del watch
  let lastHash = getFileHash(configPath);
  const cssHashes = new Map();
  cssFilesToWatch.forEach(cssFile => {
    if (fs.existsSync(cssFile)) {
      cssHashes.set(cssFile, getFileHash(cssFile));
    }
  });
  
  const themeHashes = new Map();
  themeFilesToWatch.forEach(themeFile => {
    if (fs.existsSync(themeFile)) {
      themeHashes.set(themeFile, getFileHash(themeFile));
    }
  });
  
  let debounceTimer = null;
  let watcher = null;
  const cssWatchers = new Map();
  const themeWatchers = new Map();
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
  
  // Función para manejar cambios en archivos CSS
  function handleCSSChange(cssFile) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
      const currentHash = getFileHash(cssFile);
      const lastCSSHash = cssHashes.get(cssFile);
      
      if (currentHash && currentHash !== lastCSSHash && !isRegenerating) {
        isRegenerating = true;
        cssHashes.set(cssFile, currentHash);
        if (!silent) {
          console.log(`🔄 Detectado cambio en ${path.basename(cssFile)}, copiando a dist/...\n`);
        }
        copyCSSFiles(silent);
        copyImageFiles(silent);
        if (!silent) {
          console.log('✨ CSS actualizado - Recarga el navegador para ver los cambios\n');
        }
        isRegenerating = false;
      }
    }, DEBOUNCE_DELAY);
  }
  
  // Función para manejar cambios en archivos de tema
  function handleThemeChange(themeFile) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
      const currentHash = getFileHash(themeFile);
      const lastThemeHash = themeHashes.get(themeFile);
      
      if (currentHash && currentHash !== lastThemeHash && !isRegenerating) {
        isRegenerating = true;
        themeHashes.set(themeFile, currentHash);
        if (!silent) {
          console.log(`🔄 Detectado cambio en ${path.basename(themeFile)}, regenerando demo...\n`);
        }
        
        // Usar ThemeTransformer en lugar de ejecutar script externo
        try {
          const configData = loadConfig(configPath);
          if (configData.theme && configData.theme.enabled && configData.theme.name) {
            const themeName = configData.theme.name;
            const outputDir = path.dirname(outputPath);
            const targetFile = path.join(outputDir, 'themes', `${themeName}-demo.html`);
            
            const themeTransformer = new ThemeTransformer(projectRoot);
            themeTransformer.transform(themeFile, targetFile, themeName, silent);
            
            if (!silent) {
              console.log('✨ Demo actualizado - Recarga el navegador para ver los cambios\n');
            }
          }
        } catch (error) {
          if (!silent) {
            console.error('❌ Error al regenerar demo:', error.message);
          }
        }
        
        isRegenerating = false;
      }
    }, DEBOUNCE_DELAY);
  }
  
  // Función para iniciar watch de un archivo
  function startFileWatch(filePath, onChange) {
    try {
      const fileWatcher = fs.watch(filePath, { persistent: true }, (eventType, filename) => {
        if (filename && (eventType === 'change' || eventType === 'rename')) {
          onChange();
        }
      });
      
      fileWatcher.on('error', (error) => {
        if (!silent) {
          console.warn(`⚠️  Error en fs.watch para ${path.basename(filePath)}, usando fallback:`, error.message);
        }
        startWatchFileFallback(filePath, onChange);
      });
      
      return fileWatcher;
    } catch (error) {
      if (!silent) {
        console.warn(`⚠️  fs.watch no disponible para ${path.basename(filePath)}, usando fallback`);
      }
      startWatchFileFallback(filePath, onChange);
      return null;
    }
  }
  
  // Observar cambios en config.json
  try {
    watcher = startFileWatch(configPath, handleFileChange);
  } catch (error) {
    if (!silent) {
      console.warn('⚠️  Error al iniciar watch de config.json:', error.message);
    }
  }
  
  // Observar cambios en archivos CSS
  cssFilesToWatch.forEach(cssFile => {
    if (fs.existsSync(cssFile)) {
      const cssWatcher = startFileWatch(cssFile, () => handleCSSChange(cssFile));
      if (cssWatcher) {
        cssWatchers.set(cssFile, cssWatcher);
      }
    }
  });
  
  // Observar cambios en archivos de tema
  themeFilesToWatch.forEach(themeFile => {
    if (fs.existsSync(themeFile)) {
      const themeWatcher = startFileWatch(themeFile, () => handleThemeChange(themeFile));
      if (themeWatcher) {
        themeWatchers.set(themeFile, themeWatcher);
      }
    }
  });
  
  // Función fallback usando fs.watchFile (menos eficiente pero más compatible)
  function startWatchFileFallback(filePath, onChange) {
    fs.watchFile(filePath, { interval: WATCH_POLL_INTERVAL }, (curr, prev) => {
      // Solo procesar si el archivo realmente cambió
      if (curr.mtime.getTime() !== prev.mtime.getTime()) {
        onChange();
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
      
      // Cerrar watchers de CSS
      cssWatchers.forEach((cssWatcher, cssFile) => {
        if (cssWatcher) {
          cssWatcher.close();
        }
        try {
          fs.unwatchFile(cssFile);
        } catch (error) {
          // Ignorar errores al limpiar
        }
      });
      
      // Cerrar watchers de tema
      themeWatchers.forEach((themeWatcher, themeFile) => {
        if (themeWatcher) {
          themeWatcher.close();
        }
        try {
          fs.unwatchFile(themeFile);
        } catch (error) {
          // Ignorar errores al limpiar
        }
      });
      
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

module.exports = { watch, generateFiles, copyCSSFiles, copyImageFiles };
