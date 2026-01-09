// Orquestador centralizado de build
// Coordina la generación de CSS, HTML, copia de assets y transformación de temas

const path = require('path');
const { loadConfig } = require('../config-loader');
const { generateCSS } = require('../css-generator');
const { generateHTML } = require('../docs-generator/html-generator');
const { writeFile, combineThemeCSS } = require('../generators/utils');
const { AssetManager } = require('./asset-manager');
const { ThemeTransformer } = require('./theme-transformer');

class BuildOrchestrator {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || path.join(__dirname, '..', '..');
    this.configPath = options.configPath || path.join(this.projectRoot, 'config.json');
    this.outputPath = options.outputPath || path.join(this.projectRoot, 'dist', 'output.css');
    this.htmlPath = options.htmlPath || path.join(this.projectRoot, 'dist', 'index.html');
    this.silent = options.silent || false;
    this.watchMode = options.watchMode || false; // Indica si estamos en modo watch
    
    // Cargar config para obtener assets si están definidos
    let assetsConfig = null;
    try {
      const configData = loadConfig(this.configPath);
      if (configData.assets) {
        assetsConfig = configData.assets;
      }
    } catch (error) {
      // Si no se puede cargar config, usar configuración por defecto
    }
    
    this.assetManager = new AssetManager(this.projectRoot, assetsConfig);
    this.themeTransformer = new ThemeTransformer(this.projectRoot);
  }

  /**
   * Ajusta las rutas del CSS en el HTML según la ubicación relativa
   * @param {string} htmlContent - Contenido HTML
   * @param {boolean} addTimestamp - Si true, agrega timestamp para cache busting (modo watch)
   * @returns {string} - HTML con rutas ajustadas
   */
  adjustHTMLPaths(htmlContent, addTimestamp = false) {
    const outputDir = path.dirname(this.outputPath);
    const htmlDir = path.dirname(this.htmlPath);
    
    const timestamp = addTimestamp ? `?v=${Date.now()}` : '';
    
    // Si el HTML y CSS están en carpetas diferentes, ajustar la ruta del CSS
    if (outputDir !== htmlDir) {
      // Calcular ruta relativa del HTML al CSS
      const relativePath = path.relative(htmlDir, outputDir);
      const cssFileName = path.basename(this.outputPath);
      const cssRelativePath = path.join(relativePath, cssFileName).replace(/\\/g, '/');
      // Reemplazar href con o sin query string
      htmlContent = htmlContent.replace(/href="output\.css[^"]*"/, `href="${cssRelativePath}${timestamp}"`);
    } else {
      // Si están en la misma carpeta, usar solo el nombre del archivo
      htmlContent = htmlContent.replace(/href="output\.css[^"]*"/, `href="output.css${timestamp}"`);
    }
    
    return htmlContent;
  }

  /**
   * Genera el CSS combinado del tema
   * @param {Object} themeConfig - Configuración del tema
   * @returns {boolean} - true si se generó exitosamente
   */
  buildThemeCSS(themeConfig) {
    if (!themeConfig || !themeConfig.enabled || !themeConfig.name) {
      return false;
    }

    const themeName = themeConfig.name;
    const themeSourceDir = path.join(this.projectRoot, 'themes', themeName);
    const outputDir = path.dirname(this.outputPath);
    const themeOutputDir = path.join(outputDir, 'themes');
    const themeOutputPath = path.join(themeOutputDir, `${themeName}.css`);
    
    if (!require('fs').existsSync(themeSourceDir)) {
      if (!this.silent) {
        console.warn(`⚠️  El tema '${themeName}' no existe en ${themeSourceDir}`);
      }
      return false;
    }
    
    try {
      // Asegurar que el directorio de temas existe
      if (!require('fs').existsSync(themeOutputDir)) {
        require('fs').mkdirSync(themeOutputDir, { recursive: true });
      }
      
      // Generar CSS combinado del tema
      const combinedCSS = combineThemeCSS(themeSourceDir);
      writeFile(themeOutputPath, combinedCSS, `Tema '${themeName}' combinado`);
      
      return true;
    } catch (error) {
      if (!this.silent) {
        console.warn(`⚠️  No se pudo generar el tema '${themeName}':`, error.message);
      }
      return false;
    }
  }

  /**
   * Transforma el HTML del tema agregando sidebar y scripts
   * @param {Object} themeConfig - Configuración del tema
   * @returns {boolean} - true si se transformó exitosamente
   */
  buildThemeHTML(themeConfig) {
    if (!themeConfig || !themeConfig.enabled || !themeConfig.name) {
      return false;
    }

    const themeName = themeConfig.name;
    const sourceFile = path.join(this.projectRoot, 'themes', themeName, 'demo.html');
    const outputDir = path.dirname(this.outputPath);
    const targetFile = path.join(outputDir, 'themes', `${themeName}-demo.html`);
    
    return this.themeTransformer.transform(
      sourceFile,
      targetFile,
      themeName,
      this.silent
    );
  }

  /**
   * Ejecuta el proceso completo de build
   * @returns {Object} - Resultado del build con estadísticas
   */
  build() {
    const result = {
      success: false,
      css: false,
      html: false,
      assets: { css: 0, images: 0 },
      theme: { css: false, html: false }
    };

    try {
      // 1. Cargar configuración
      const configData = loadConfig(this.configPath);
      
      // 2. Generar CSS
      const cssContent = generateCSS(configData);
      writeFile(this.outputPath, cssContent, 'CSS');
      result.css = true;
      
      // 3. Generar HTML
      let htmlContent = generateHTML(configData);
      // En modo watch, agregar timestamp para cache busting
      htmlContent = this.adjustHTMLPaths(htmlContent, this.watchMode);
      writeFile(this.htmlPath, htmlContent, 'HTML');
      result.html = true;
      
      // 4. Copiar assets (CSS e imágenes)
      const assetsResult = this.assetManager.copyAssets('all', this.silent);
      result.assets = assetsResult;
      
      // 5. Generar tema si está habilitado
      if (configData.theme) {
        result.theme.css = this.buildThemeCSS(configData.theme);
        result.theme.html = this.buildThemeHTML(configData.theme);
      }
      
      result.success = true;
      
      if (!this.silent) {
        console.log('\n🎉 Generación completada exitosamente!');
      }
      
      return result;
    } catch (error) {
      if (!this.silent) {
        console.error('❌ Error:', error.message);
      }
      throw error;
    }
  }
}

module.exports = { BuildOrchestrator };

