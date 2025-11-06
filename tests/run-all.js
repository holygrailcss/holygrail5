#!/usr/bin/env node

// Ejecutar todos los tests

console.log('🚀 Ejecutando todos los tests...\n');
console.log('='.repeat(50) + '\n');

require('./utils.test');
require('./config.test');
require('./parser.test');
require('./guide.test');

console.log('='.repeat(50));
console.log('✅ Todos los tests completados!\n');

