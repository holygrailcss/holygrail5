#!/usr/bin/env node

// Orquestador principal - Genera CSS y HTML desde JSON

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./src/config');
const { generateCSS } = require('./src/parser');
const { generateHTML } = require('./src/guide');

// Función para escribir archivos
function writeFile(filePath, content, description) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${description} generado exitosamente en ${filePath}`);
  } catch (error) {
    console.error(`❌ Error al escribir ${description} en ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Ejecución principal
if (require.main === module) {
  try {
    // Parsear argumentos de línea de comandos
    const args = process.argv.slice(2);
    const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1] || path.join(__dirname, 'config.json');
    const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || path.join(__dirname, 'output.css');
    const htmlPath = args.find(arg => arg.startsWith('--html='))?.split('=')[1] || path.join(__dirname, 'index.html');
    
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
    
    if (outputDir !== htmlDir) {
      // Calcular ruta relativa del HTML al CSS
      const relativePath = path.relative(htmlDir, outputDir);
      const cssFileName = path.basename(outputPath);
      const cssRelativePath = path.join(relativePath, cssFileName).replace(/\\/g, '/');
      htmlContent = htmlContent.replace(/href="output\.css"/, `href="${cssRelativePath}"`);
    }
    
    writeFile(htmlPath, htmlContent, 'HTML');
    
    console.log('\n🎉 Generación completada exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Exportar funciones
module.exports = { generateCSS, generateHTML };
