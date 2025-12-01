#!/usr/bin/env node

// Orquestador principal - Genera CSS y HTML desde JSON

const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./src/config-loader');
const { generateCSS } = require('./src/css-generator');
const { generateHTML } = require('./src/docs-generator/html-generator');
const { writeFile, combineThemeCSS } = require('./src/generators/utils');

// Ejecución principal
if (require.main === module) {
  try {
    // Parsear argumentos de línea de comandos
    const args = process.argv.slice(2);
    const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1] || path.join(__dirname, 'config.json');
    const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || path.join(__dirname, 'dist', 'output.css');
    const htmlPath = args.find(arg => arg.startsWith('--html='))?.split('=')[1] || path.join(__dirname, 'dist', 'index.html');
    
    // Cargar configuración
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
      // Calcular ruta relativa del HTML al CSS
      const relativePath = path.relative(htmlDir, outputDir);
      const cssFileName = path.basename(outputPath);
      const cssRelativePath = path.join(relativePath, cssFileName).replace(/\\/g, '/');
      // Reemplazar href con o sin query string
      htmlContent = htmlContent.replace(/href="output\.css[^"]*"/, `href="${cssRelativePath}"`);
    } else {
      // Si están en la misma carpeta, usar solo el nombre del archivo
      htmlContent = htmlContent.replace(/href="output\.css[^"]*"/, `href="output.css"`);
    }
    
    writeFile(htmlPath, htmlContent, 'HTML');
    
    // Generar tema combinado en dist si está habilitado
    if (configData.theme && configData.theme.enabled && configData.theme.name) {
      const themeName = configData.theme.name;
      const themeSourceDir = path.join(__dirname, 'themes', themeName);
      const outputDir = path.dirname(outputPath);
      const themeOutputDir = path.join(outputDir, 'themes');
      const themeOutputPath = path.join(themeOutputDir, `${themeName}.css`);
      
      if (fs.existsSync(themeSourceDir)) {
        try {
          // Asegurar que el directorio de temas existe
          if (!fs.existsSync(themeOutputDir)) {
            fs.mkdirSync(themeOutputDir, { recursive: true });
          }
          
          // Generar CSS combinado del tema
          const combinedCSS = combineThemeCSS(themeSourceDir);
          writeFile(themeOutputPath, combinedCSS, `Tema '${themeName}' combinado`);
          
          // Nota: La copia de demo.html con sidebar se hace en copy-theme-html.js
        } catch (error) {
          console.warn(`⚠️  No se pudo generar el tema '${themeName}':`, error.message);
        }
      } else {
        console.warn(`⚠️  El tema '${themeName}' no existe en ${themeSourceDir}`);
      }
    }
    
    console.log('\n🎉 Generación completada exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Exportar funciones
// Nota: generateHTML se exporta desde src/docs-generator/html-generator.js
module.exports = { generateCSS };
