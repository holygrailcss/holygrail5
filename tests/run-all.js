#!/usr/bin/env node

// Ejecutar todos los tests

console.log('🚀 Ejecutando todos los tests...\n');
console.log('='.repeat(50) + '\n');

require('./helpers.test');
require('./config-loader.test');
require('./css-generator.test');
require('./html-generator.test');

console.log('='.repeat(50));
console.log('✅ Todos los tests completados!\n');

