// Script de desarrollo - Combina watch y servidor

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando modo desarrollo...\n');

// Iniciar watch en background
const watchProcess = spawn('node', [path.join(__dirname, 'watch.js')], {
  stdio: 'inherit',
  shell: true
});

// Esperar un momento para que watch genere los archivos inicialmente
setTimeout(() => {
  const port = process.env.PORT || '8080';
  console.log(`\n🌐 Iniciando servidor HTTP en http://localhost:${port}\n`);
  console.log('💡 Los archivos se regenerarán automáticamente cuando cambies config.json\n');
  console.log('💡 Recarga el navegador (Cmd+Shift+R o Ctrl+Shift+R) para ver los cambios\n');
  
  // Iniciar servidor HTTP
  // Suprimir warnings de deprecación de http-server
  // Servir desde dist/ como raíz, así la URL será /index.html sin mostrar "dist"
  const serverProcess = spawn('npx', ['http-server', 'dist', '-p', port, '-o', 'index.html'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_NO_WARNINGS: '1' }
  });
  
  // Manejar cierre
  process.on('SIGINT', () => {
    console.log('\n\n👋 Deteniendo servidor y watch...');
    watchProcess.kill();
    serverProcess.kill();
    process.exit(0);
  });
  
  watchProcess.on('exit', () => {
    serverProcess.kill();
    process.exit(0);
  });
  
  serverProcess.on('exit', () => {
    watchProcess.kill();
    process.exit(0);
  });
}, 2000);

