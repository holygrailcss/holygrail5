#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// Propiedades CSS a procesar
const PROPERTIES = ['fontFamily', 'fontWeight', 'fontSize', 'lineHeight'];
const BREAKPOINTS = ['mobile', 'desktop'];

// Función para generar nombre de variable CSS
function getVarName(prop, value) {
  if (prop === 'fontFamily') {
    return value.includes('sans-serif') ? '--font-family-sans' : '--font-family-serif';
  }
  if (prop === 'fontWeight') return `--font-weight-${value}`;
  if (prop === 'fontSize') return `--font-size-${value.replace('px', '')}`;
  if (prop === 'lineHeight') return `--line-height-${value.replace('.', '-')}`;
}

// Extraer valores únicos y crear mapeo de variables
function buildValueMap(classes) {
  const uniqueValues = { fontFamily: new Set(), fontWeight: new Set(), fontSize: new Set(), lineHeight: new Set() };
  const valueMap = { fontFamily: new Map(), fontWeight: new Map(), fontSize: new Map(), lineHeight: new Map() };
  
  // Recopilar valores únicos de todas las clases y breakpoints
  Object.values(classes).forEach(cls => {
    // Propiedades base (fontFamily, fontWeight)
    ['fontFamily', 'fontWeight'].forEach(prop => {
      if (cls[prop]) uniqueValues[prop].add(cls[prop]);
    });
    
    // Propiedades de breakpoints (fontSize, lineHeight)
    BREAKPOINTS.forEach(bp => {
      if (cls[bp]) {
        ['fontSize', 'lineHeight'].forEach(prop => {
          if (cls[bp][prop]) uniqueValues[prop].add(cls[bp][prop]);
        });
      }
    });
  });
  
  // Crear mapeo de valores a variables
  PROPERTIES.forEach(prop => {
    uniqueValues[prop].forEach(value => {
      valueMap[prop].set(value, getVarName(prop, value));
    });
  });
  
  return valueMap;
}

// Generar variables CSS compartidas
function generateRootVariables(valueMap) {
  return PROPERTIES.map(prop => 
    Array.from(valueMap[prop].entries())
      .map(([value, varName]) => `  ${varName}: ${value};`)
      .join('\n')
  ).filter(Boolean).join('\n');
}

// Obtener propiedades finales para un breakpoint
function getFinalProps(cls, breakpoint) {
  const props = {};
  
  // Propiedades base (fontFamily, fontWeight)
  if (cls.fontFamily) props.fontFamily = cls.fontFamily;
  if (cls.fontWeight) props.fontWeight = cls.fontWeight;
  
  // Propiedades del breakpoint (fontSize, lineHeight)
  if (cls[breakpoint]) {
    if (cls[breakpoint].fontSize) props.fontSize = cls[breakpoint].fontSize;
    if (cls[breakpoint].lineHeight) props.lineHeight = cls[breakpoint].lineHeight;
  }
  
  return props;
}

// Generar CSS para una clase
function generateClassCSS(className, cls, breakpoint, valueMap) {
  const props = getFinalProps(cls, breakpoint);
  const cssProps = PROPERTIES
    .filter(prop => props[prop] && valueMap[prop].has(props[prop]))
    .map(prop => `    ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: var(${valueMap[prop].get(props[prop])});`);
  
  return cssProps.length ? `  .${className} {\n${cssProps.join('\n')}\n  }` : '';
}

// Generar media query
function generateMediaQuery(breakpointName, minWidth, classes, valueMap) {
  const cssClasses = Object.entries(classes)
    .map(([className, cls]) => generateClassCSS(className, cls, breakpointName, valueMap))
    .filter(Boolean);
  
  return `@media (min-width: ${minWidth}) {\n\n${cssClasses.join('\n\n')}\n\n}`;
}

// Generar CSS completo
function generateCSS(configData = config) {
  const valueMap = buildValueMap(configData.classes);
  const rootVars = generateRootVariables(valueMap);
  
  const mobileQuery = generateMediaQuery('mobile', configData.breakpoints.mobile, configData.classes, valueMap);
  const desktopQuery = generateMediaQuery('desktop', configData.breakpoints.desktop, configData.classes, valueMap);
  
  return `:root {\n${rootVars}\n}\n\n${mobileQuery}\n\n${desktopQuery}`;
}

// Si se ejecuta directamente, generar CSS
if (require.main === module) {
  const outputPath = process.argv[2] || path.join(__dirname, 'output.css');
  fs.writeFileSync(outputPath, generateCSS(), 'utf8');
  console.log(`CSS generado exitosamente en ${outputPath}`);
}

// Exportar función para uso como módulo
module.exports = { generateCSS };
