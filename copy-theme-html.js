#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copiar demo.html del tema dutti y añadir sidebar
const sourceFile = path.join(__dirname, 'themes', 'dutti', 'demo.html');
const targetFile = path.join(__dirname, 'dist', 'themes', 'dutti-demo.html');

// Estilos del sidebar
const sidebarStyles = `
    /* Sidebar Styles */
    .guide-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 250px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e0e0e0;
      padding: 2rem 0;
      padding-bottom: 120px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 2px 0 8px rgba(0,0,0,0.05);
    }
    
    .guide-sidebar-header {
      padding: 0 1.5rem 2rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 1rem;
    }
    
    .guide-sidebar-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #000;
    }
    
    .guide-sidebar-nav {
      padding: 0 1rem;
    }
    
    .guide-menu-item {
      display: block;
      padding: 0.75rem 1rem;
      margin-bottom: 0.25rem;
      color: #666;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .guide-menu-item:hover {
      background: #f0f0f0;
      color: #000;
    }
    
    .guide-menu-toggle {
      display: none;
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 101;
      background: white;
      border: 1px solid #e0e0e0;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.25rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .demo-container {
      margin-left: 250px;
      transition: margin-left 0.3s ease;
    }
    
    @media (max-width: 768px) {
      .guide-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .guide-sidebar.open {
        transform: translateX(0);
      }
      
      .demo-container {
        margin-left: 0;
      }
      
      .guide-menu-toggle {
        display: block;
      }
    }
`;

// HTML del sidebar
const sidebarHTML = `
  <button class="guide-menu-toggle" onclick="document.querySelector('.guide-sidebar').classList.toggle('open')">☰</button>
  
  <aside class="guide-sidebar">
    <div class="guide-sidebar-header">
      <h2>HolyGrail5</h2>
      <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">Demo Tema Dutti</p>
    </div>

    <nav class="guide-sidebar-nav">
      <a href="../index.html" class="guide-menu-item">← Volver al Index</a>
      
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
      
      <p style="padding: 0.5rem 1rem; font-size: 0.75rem; color: #999; text-transform: uppercase; font-weight: 600;">Componentes</p>
      
      <a href="#buttons" class="guide-menu-item">Botones</a>
      <a href="#inputs" class="guide-menu-item">Inputs</a>
      <a href="#checkboxes" class="guide-menu-item">Checkboxes</a>
      <a href="#radios" class="guide-menu-item">Radios</a>
      <a href="#switches" class="guide-menu-item">Switches</a>
      <a href="#forms" class="guide-menu-item">Formularios</a>
    </nav>
  </aside>
`;

if (fs.existsSync(sourceFile)) {
  try {
    // Leer el contenido
    let content = fs.readFileSync(sourceFile, 'utf8');
    
    // Ajustar rutas CSS
    content = content.replace(/href="\.\.\/\.\.\/dist\/output\.css"/g, 'href="../output.css"');
    content = content.replace(/href="\.\.\/output\.css"/g, 'href="../output.css"');
    content = content.replace(/href="theme\.css"/g, 'href="dutti.css"');
    content = content.replace(/href="dutti\.css"/g, 'href="dutti.css"');
    
    // Añadir estilos del sidebar antes del </style>
    content = content.replace('</style>', sidebarStyles + '\n  </style>');
    
    // Añadir sidebar después del <body> usando regex para coincidir con cualquier espacio
    content = content.replace(/(<body[^>]*>)/i, '$1\n' + sidebarHTML);
    
    // Escribir con rutas corregidas y sidebar
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✅ Demo HTML copiado con sidebar: dist/themes/dutti-demo.html');
  } catch (error) {
    console.error('❌ Error al copiar demo HTML:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠️  No se encontró themes/dutti/demo.html');
}

