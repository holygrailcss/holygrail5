// Script de desarrollo - Combina watch y servidor HTTP optimizado

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { watch } = require('./watch-config');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '..', 'dist');

// MIME types para diferentes archivos
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Función para obtener MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Servidor HTTP simple y rápido
function createServer() {
  return http.createServer((req, res) => {
    // Decodificar URL
    let filePath = decodeURIComponent(req.url);
    
    // Si es la raíz, servir index.html
    if (filePath === '/' || filePath === '') {
      filePath = '/index.html';
    }
    
    // Eliminar query string
    filePath = filePath.split('?')[0];
    
    // Construir ruta completa
    const fullPath = path.join(DIST_DIR, filePath);
    
    // Verificar que el archivo esté dentro de dist/
    if (!fullPath.startsWith(DIST_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }
    
    // Leer archivo
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
        }
        return;
      }
      
      // Headers de cache para desarrollo (no cache)
      const headers = {
        'Content-Type': getMimeType(fullPath),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      res.writeHead(200, headers);
      res.end(data);
    });
  });
}

// Función principal
function startDevServer() {
  console.log('🚀 Iniciando modo desarrollo...\n');
  
  // Configurar rutas
  const configPath = path.join(__dirname, '..', 'config.json');
  const outputPath = path.join(__dirname, '..', 'dist', 'output.css');
  const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
  
  // Verificar que dist/ existe
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }
  
  // Iniciar watch en background (no bloquea, modo silencioso)
  watch(configPath, outputPath, htmlPath, true);
  
  // Crear y iniciar servidor HTTP
  const server = createServer();
  
  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n🌐 Servidor HTTP iniciado en ${url}`);
    console.log(`📄 Abre en tu navegador: ${url}/index.html\n`);
    console.log('💡 Los archivos se regenerarán automáticamente cuando cambies config.json');
    console.log('💡 Recarga el navegador (Cmd+Shift+R o Ctrl+Shift+R) para ver los cambios\n');
    
    // Abrir navegador automáticamente (solo en macOS/Linux)
    if (process.platform === 'darwin') {
      spawn('open', [url]);
    } else if (process.platform === 'linux') {
      spawn('xdg-open', [url]);
    } else if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', url]);
    }
  });
  
  // Manejar errores del servidor
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: El puerto ${PORT} ya está en uso`);
      console.error(`💡 Usa otro puerto: PORT=3001 npm run dev\n`);
    } else {
      console.error(`\n❌ Error del servidor:`, err.message);
    }
    process.exit(1);
  });
  
  // Manejar cierre del proceso
  function cleanup() {
    console.log('\n\n👋 Deteniendo servidor...');
    server.close(() => {
      process.exit(0);
    });
  }
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

// Ejecutar si es el módulo principal
if (require.main === module) {
  startDevServer();
}

module.exports = { startDevServer, createServer };
