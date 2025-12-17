#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copiar demo.html del tema dutti y añadir sidebar
const sourceFile = path.join(__dirname, 'themes', 'dutti', 'demo.html');
const targetFile = path.join(__dirname, 'dist', 'themes', 'dutti-demo.html');

// Estilos del sidebar + Lenis (solo para dutti-demo.html en dist)
const sidebarStyles = `
    

    /* Lenis Smooth Scroll - Solo para demo Dutti */
    html.lenis {
      height: auto;
    }

    .lenis.lenis-smooth {
      scroll-behavior: auto;
    }

    .lenis.lenis-smooth[data-lenis-prevent] {
      overscroll-behavior: contain;
    }

    .lenis.lenis-stopped {
      overflow: hidden;
    }
`;

// HTML del header y sidebar
const headerAndSidebarHTML = `
  <div class="guide-header">
    <a class="btn-link" href="../index.html" class="guide-menu-item"><h1 class="guide-logo" style="">HolyGrail 5</h1> </a>
    <button class="guide-header-button" onclick="toggleSidebar()">☰</button>
  </div>
  
  <div class="guide-sidebar-overlay" onclick="toggleSidebar()"></div>
  
  <aside class="guide-sidebar">
    <div class="guide-sidebar-header">
      <h2>HolyGrail5</h2>
      <p class="guide-sidebar-subtitle">Demo Tema Dutti</p>
    </div>

    <nav class="guide-sidebar-nav">
      <a href="../index.html" class="guide-menu-item">← </a>
      
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
      
      <p class="guide-sidebar-title">Componentes</p>
      
      <a href="#buttons" class="guide-menu-item">Botones</a>
      <a href="#inputs" class="guide-menu-item">Inputs</a>
      <a href="#checkboxes" class="guide-menu-item">Checkboxes</a>
      <a href="#radios" class="guide-menu-item">Radios</a>
      <a href="#switches" class="guide-menu-item">Switches</a>
      <a href="#forms" class="guide-menu-item">Formularios</a>
    </nav>
  </aside>
  
  <script>
    function toggleSidebar() {
      const sidebar = document.querySelector('.guide-sidebar');
      const overlay = document.querySelector('.guide-sidebar-overlay');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    }
    
    function closeSidebar() {
      const sidebar = document.querySelector('.guide-sidebar');
      const overlay = document.querySelector('.guide-sidebar-overlay');
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
    
    // Hacer funciones globales
    window.toggleSidebar = toggleSidebar;
    window.closeSidebar = closeSidebar;
  </script>
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
    
    // Agregar link a guide-header.css
    const guideHeaderCSS = '<link rel="stylesheet" href="../guide-header.css">';
    content = content.replace(/<link rel="stylesheet" href="dutti\.css">/g, `<link rel="stylesheet" href="dutti.css">\n    ${guideHeaderCSS}`);
    
    // Añadir estilos del sidebar antes del </style>
    content = content.replace('</style>', sidebarStyles + '\n  </style>');

    // Añadir script de Lenis en el <head> (solo para demo Dutti)
    const lenisHeadScript = `
  <!-- Lenis Smooth Scroll - Solo para demo Tema Dutti -->
  <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>`;
    content = content.replace('</head>', `${lenisHeadScript}\n</head>`);

    // Añadir inicialización de Lenis antes de </body> (solo para demo Dutti)
    const lenisInitScript = `
  <script>
    // Inicializar Lenis Smooth Scroll - Solo para demo Tema Dutti
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Hacer Lenis global para que esté disponible en otros scripts
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Manejar clic en menú para scroll suave (después de que Lenis esté inicializado)
    // Usar setTimeout para asegurar que el DOM esté completamente cargado
    setTimeout(function() {
      const menuItems = document.querySelectorAll('.guide-menu-item[href^="#"]');
      
      menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          const href = item.getAttribute('href');
          
          // Solo procesar enlaces internos (que empiezan con #)
          if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1); // Remover el #
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
              const offset = 80; // Offset para compensar header
              
              // Usar Lenis para scroll suave
              lenis.scrollTo(targetSection, { offset: -offset });
              
              // Cerrar sidebar después de hacer clic
              if (typeof closeSidebar === 'function') {
                closeSidebar();
              }
            }
          }
        });
      });
    }, 100);
  </script>`;
    content = content.replace('</body>', `${lenisInitScript}\n</body>`);
    
    // Añadir header y sidebar después del <body> usando regex para coincidir con cualquier espacio
    content = content.replace(/(<body[^>]*>)/i, '$1\n' + headerAndSidebarHTML);
    
    // Eliminar el título h1 del contenido si existe (ya está en el header)
    content = content.replace(/<h1 class="demo-title">Sistema de Theming Dutti<\/h1>\s*/g, '');
    
    // Envolver el contenido de demo-container con guide-container
    content = content.replace(
      /<div class="demo-container">([\s\S]*?)<\/div>\s*(?=<\/body>)/,
      '<div class="demo-container"><div class="guide-container">$1</div></div>'
    );
    
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

