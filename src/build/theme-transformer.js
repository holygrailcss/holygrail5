// Transformador de temas
// Transforma el HTML del tema agregando sidebar, header y scripts de Lenis

const fs = require('fs');
const path = require('path');

// Estilos del sidebar + Lenis (solo para dutti-demo.html en dist)
const SIDEBAR_STYLES = `
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
const HEADER_AND_SIDEBAR_HTML = `
  <div class="guide-header">
    <a class="btn-link" href="../index.html" class="guide-menu-item"><h1 class="guide-logo" style="">HolyGrail 5</h1> </a>
    <button class="guide-header-button" onclick="toggleSidebar()">☰</button>
  </div>
  
  <div class="guide-sidebar-overlay" onclick="toggleSidebar()"></div>
  
  <aside class="guide-sidebar">
    <div class="guide-sidebar-header">
      <div>HolyGrail5</div>
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

// Script de Lenis para el head
const LENIS_HEAD_SCRIPT = `
  <!-- Lenis Smooth Scroll - Solo para demo Tema Dutti -->
  <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>`;

// Script de inicialización de Lenis
const LENIS_INIT_SCRIPT = `
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

class ThemeTransformer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || path.join(__dirname, '..', '..');
  }

  /**
   * Transforma el HTML del tema agregando sidebar, header y scripts
   * @param {string} sourcePath - Ruta al archivo HTML fuente
   * @param {string} destPath - Ruta donde guardar el HTML transformado
   * @param {string} themeName - Nombre del tema (para personalización)
   * @param {boolean} silent - Si true, no muestra mensajes
   * @returns {boolean} - true si se transformó exitosamente
   */
  transform(sourcePath, destPath, themeName = 'dutti', silent = false) {
    const fullSourcePath = path.isAbsolute(sourcePath)
      ? sourcePath
      : path.join(this.projectRoot, sourcePath);
    
    const fullDestPath = path.isAbsolute(destPath)
      ? destPath
      : path.join(this.projectRoot, destPath);

    if (!fs.existsSync(fullSourcePath)) {
      if (!silent) {
        console.warn(`⚠️  No se encontró ${fullSourcePath}`);
      }
      return false;
    }

    try {
      // Leer el contenido
      let content = fs.readFileSync(fullSourcePath, 'utf8');
      
      // Ajustar rutas CSS
      content = content.replace(/href="\.\.\/\.\.\/dist\/output\.css"/g, 'href="../output.css"');
      content = content.replace(/href="\.\.\/output\.css"/g, 'href="../output.css"');
      content = content.replace(/href="theme\.css"/g, `href="${themeName}.css"`);
      content = content.replace(new RegExp(`href="${themeName}\\.css"`, 'g'), `href="${themeName}.css"`);
      
      // Agregar link a guide-styles.css
      const guideStylesCSS = '<link rel="stylesheet" href="../guide-styles.css">';
      content = content.replace(
        new RegExp(`<link rel="stylesheet" href="${themeName}\\.css">`, 'g'),
        `<link rel="stylesheet" href="${themeName}.css">\n    ${guideStylesCSS}`
      );
      
      // Añadir estilos del sidebar antes del </style>
      content = content.replace('</style>', SIDEBAR_STYLES + '\n  </style>');

      // Añadir script de Lenis en el <head>
      content = content.replace('</head>', `${LENIS_HEAD_SCRIPT}\n</head>`);

      // Añadir inicialización de Lenis antes de </body>
      content = content.replace('</body>', `${LENIS_INIT_SCRIPT}\n</body>`);
      
      // Añadir header y sidebar después del <body>
      content = content.replace(/(<body[^>]*>)/i, '$1\n' + HEADER_AND_SIDEBAR_HTML);
      
      // Eliminar el título h1 del contenido si existe (ya está en el header)
      content = content.replace(/<h1 class="demo-title">Sistema de Theming Dutti<\/h1>\s*/g, '');
      
      // Envolver el contenido de demo-container con guide-container
      content = content.replace(
        /<div class="demo-container">([\s\S]*?)<\/div>\s*(?=<\/body>)/,
        '<div class="demo-container"><div class="guide-container">$1</div></div>'
      );
      
      // Asegurar que el directorio destino existe
      const destDir = path.dirname(fullDestPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Escribir archivo transformado
      fs.writeFileSync(fullDestPath, content, 'utf8');
      
      if (!silent) {
        console.log(`✅ Demo HTML transformado: ${path.relative(this.projectRoot, fullDestPath)}`);
      }
      
      return true;
    } catch (error) {
      if (!silent) {
        console.error('❌ Error al transformar demo HTML:', error.message);
      }
      return false;
    }
  }
}

module.exports = { ThemeTransformer };


