#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copiar demo.html del tema dutti y ajustar rutas
const sourceFile = path.join(__dirname, 'themes', 'dutti', 'demo.html');
const targetFile = path.join(__dirname, 'dist', 'themes', 'dutti-demo.html');

if (fs.existsSync(sourceFile)) {
  try {
    // Leer el contenido
    let content = fs.readFileSync(sourceFile, 'utf8');
    
    // Ajustar rutas CSS para que funcionen desde dist/themes/dutti-demo.html
    // La estructura será: dist/themes/dutti-demo.html necesita llegar a dist/output.css
    
    // Ajustar ruta de output.css
    content = content.replace(/href="\.\.\/\.\.\/dist\/output\.css"/g, 'href="../output.css"');
    content = content.replace(/href="\.\.\/output\.css"/g, 'href="../output.css"');
    
    // Ajustar ruta del tema CSS
    content = content.replace(/href="theme\.css"/g, 'href="dutti.css"');
    content = content.replace(/href="dutti\.css"/g, 'href="dutti.css"');
    
    // Escribir con rutas corregidas
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✅ Demo HTML copiado y rutas ajustadas: dist/themes/dutti-demo.html');
  } catch (error) {
    console.error('❌ Error al copiar demo HTML:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠️  No se encontró themes/dutti/demo.html');
}

