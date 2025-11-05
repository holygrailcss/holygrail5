#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Constantes
const PROPERTIES = ['fontFamily', 'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing', 'textTransform'];
const BREAKPOINTS = ['mobile', 'desktop'];

// Manejo de errores y carga de configuración
function loadConfig(configPath = path.join(__dirname, 'config.json')) {
  try {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Archivo de configuración no encontrado: ${configPath}`);
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    // Validar estructura básica
    if (!config.classes || typeof config.classes !== 'object') {
      throw new Error('La configuración debe tener un objeto "classes"');
    }
    
    if (!config.breakpoints || typeof config.breakpoints !== 'object') {
      throw new Error('La configuración debe tener un objeto "breakpoints"');
    }
    
    if (!config.breakpoints.mobile || !config.breakpoints.desktop) {
      throw new Error('Los breakpoints deben tener propiedades "mobile" y "desktop"');
    }
    
    // Validar clases
    Object.entries(config.classes).forEach(([className, cls]) => {
      if (!cls || typeof cls !== 'object') {
        throw new Error(`La clase "${className}" debe ser un objeto`);
      }
      
      // Validar que tenga al menos un breakpoint
      if (!cls.mobile && !cls.desktop) {
        throw new Error(`La clase "${className}" debe tener al menos un breakpoint (mobile o desktop)`);
      }
      
      // Validar propiedades de breakpoints
      BREAKPOINTS.forEach(bp => {
        if (cls[bp] && (!cls[bp].fontSize && !cls[bp].lineHeight)) {
          console.warn(`Advertencia: La clase "${className}" tiene breakpoint "${bp}" sin fontSize ni lineHeight`);
        }
      });
    });
    
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Error al parsear JSON: ${error.message}`);
    }
    throw error;
  }
}

// Cargar configuración
let config;
try {
  config = loadConfig();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

const VAR_PREFIX = config.prefix || 'hg';
const VAR_CATEGORY = config.category || 'typo';
const BASE_FONT_SIZE = config.baseFontSize || 16;

// Utilidades
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function pxToRem(value) {
  if (typeof value === 'string' && value.endsWith('px')) {
    const pxValue = parseFloat(value);
    const remValue = pxValue / BASE_FONT_SIZE;
    return `${parseFloat(remValue.toFixed(4))}rem`;
  }
  return value;
}

function remToPx(remValue, baseFontSize = BASE_FONT_SIZE) {
  const remMatch = remValue.toString().match(/^([\d.]+)rem$/);
  return remMatch ? `${parseFloat(remMatch[1]) * baseFontSize}px` : '-';
}

// Funciones de nombres de variables
function getFontFamilyName(fontFamilyValue, fontFamilyMap) {
  if (fontFamilyMap) {
    for (const [name, value] of Object.entries(fontFamilyMap)) {
      if (value === fontFamilyValue) return name;
    }
  }
  return fontFamilyValue.replace(/["']/g, '').replace(/\s+/g, '-').toLowerCase().split(',')[0].trim();
}

function getFontFamilyVarName(fontFamilyName) {
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-font-family-${fontFamilyName}`;
}

function getLineHeightVarName(lineHeightValue) {
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-line-height-${lineHeightValue.toString().replace('.', '-')}`;
}

function getSharedVarName(prop, value) {
  const propName = toKebabCase(prop);
  let name = value.toString();
  
  if (prop === 'fontSize') {
    name = name.endsWith('px') ? name.replace('px', '').replace('.', '-') : name.replace(/rem/g, '').replace('.', '-');
  } else if (prop === 'letterSpacing') {
    name = name.replace(/rem/g, '').replace('.', '-');
  }
  
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-${propName}-${name}`;
}

// Construcción del mapa de valores
function buildValueMap(classes, fontFamilyMap) {
  const fontFamilyVars = new Map();
  const lineHeightVars = new Map();
  const fontWeightVars = new Map();
  const letterSpacingVars = new Map();
  const textTransformVars = new Map();
  const fontSizeVars = new Map();
  const valueMap = {};
  
  Object.entries(classes).forEach(([className, cls]) => {
    valueMap[className] = {};
    
    // FontFamily
    if (cls.fontFamily !== undefined) {
      const fontFamilyName = getFontFamilyName(cls.fontFamily, fontFamilyMap);
      const varName = getFontFamilyVarName(fontFamilyName);
      if (!fontFamilyVars.has(cls.fontFamily)) {
        fontFamilyVars.set(cls.fontFamily, { varName, value: cls.fontFamily, name: fontFamilyName });
      }
      valueMap[className].fontFamily = {
        varName: fontFamilyVars.get(cls.fontFamily).varName,
        value: cls.fontFamily
      };
    }
    
    // Propiedades base compartidas
    ['fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
      if (cls[prop] !== undefined) {
        const varName = getSharedVarName(prop, cls[prop]);
        const varMap = prop === 'fontWeight' ? fontWeightVars : prop === 'letterSpacing' ? letterSpacingVars : textTransformVars;
        
        if (!varMap.has(cls[prop])) {
          varMap.set(cls[prop], { varName, value: cls[prop] });
        }
        valueMap[className][prop] = {
          varName: varMap.get(cls[prop]).varName,
          value: cls[prop]
        };
      }
    });
    
    // Propiedades de breakpoints
    BREAKPOINTS.forEach(bp => {
      if (cls[bp]) {
        if (cls[bp].fontSize !== undefined) {
          const fontSizeValue = cls[bp].fontSize;
          const fontSizeRem = pxToRem(fontSizeValue);
          const varName = getSharedVarName('fontSize', fontSizeValue);
          
          if (!fontSizeVars.has(fontSizeValue)) {
            fontSizeVars.set(fontSizeValue, { varName, value: fontSizeRem });
          }
          if (!valueMap[className].fontSize) valueMap[className].fontSize = {};
          valueMap[className].fontSize[bp] = {
            varName: fontSizeVars.get(fontSizeValue).varName,
            value: fontSizeRem
          };
        }
        
        if (cls[bp].lineHeight !== undefined) {
          const lineHeightValue = cls[bp].lineHeight;
          const varName = getLineHeightVarName(lineHeightValue);
          
          if (!lineHeightVars.has(lineHeightValue)) {
            lineHeightVars.set(lineHeightValue, { varName, value: lineHeightValue });
          }
          if (!valueMap[className].lineHeight) valueMap[className].lineHeight = {};
          valueMap[className].lineHeight[bp] = {
            varName: lineHeightVars.get(lineHeightValue).varName,
            value: lineHeightValue
          };
        }
      }
    });
  });
  
  return { valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars };
}

// Generación de CSS
function generateRootVariables(fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars) {
  const variables = [];
  const allMaps = [
    { map: fontFamilyVars, name: 'font-family' },
    { map: lineHeightVars, name: 'line-height' },
    { map: fontWeightVars, name: 'font-weight' },
    { map: letterSpacingVars, name: 'letter-spacing' },
    { map: textTransformVars, name: 'text-transform' },
    { map: fontSizeVars, name: 'font-size' }
  ];
  
  allMaps.forEach(({ map }) => {
    Array.from(map.values()).forEach(item => {
      variables.push(`  ${item.varName}: ${item.value};`);
    });
  });
  
  return variables.join('\n');
}

function getFinalProps(cls, breakpoint) {
  const props = {};
  
  ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
    if (cls[prop] !== undefined) props[prop] = cls[prop];
  });
  
  if (cls[breakpoint]) {
    if (cls[breakpoint].fontSize !== undefined) props.fontSize = pxToRem(cls[breakpoint].fontSize);
    if (cls[breakpoint].lineHeight !== undefined) props.lineHeight = cls[breakpoint].lineHeight;
  }
  
  return props;
}

function generateClassCSS(className, cls, breakpointName, valueMap) {
  const props = getFinalProps(cls, breakpointName);
  const cssProps = [];
  
  PROPERTIES.forEach(prop => {
    if (props[prop] === undefined) return;
    
    let varName;
    if (prop === 'fontFamily') {
      const fontFamilyName = getFontFamilyName(props[prop], config.fontFamilyMap);
      varName = getFontFamilyVarName(fontFamilyName);
    } else if (prop === 'lineHeight') {
      varName = getLineHeightVarName(props[prop]);
    } else if (prop === 'fontSize') {
      const originalValue = cls[breakpointName]?.fontSize ?? cls.fontSize;
      varName = getSharedVarName(prop, originalValue);
    } else {
      varName = getSharedVarName(prop, props[prop]);
    }
    
    cssProps.push(`    ${toKebabCase(prop)}: var(${varName});`);
  });
  
  return cssProps.length ? `  .${className} {\n${cssProps.join('\n')}\n  }` : '';
}

function generateMediaQuery(breakpointName, minWidth, classes, valueMap) {
  const cssClasses = Object.entries(classes)
    .map(([className, cls]) => generateClassCSS(className, cls, breakpointName, valueMap))
    .filter(Boolean);
  
  return `@media (min-width: ${minWidth}) {\n\n${cssClasses.join('\n\n')}\n\n}`;
}

function generateResetCSS(baseFontSize = 16) {
  return `/* Reset CSS Mínimo */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: ${baseFontSize}px;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
}

body {
  margin: 0;
  padding: 0;
  font-family: inherit;
  line-height: inherit;
}

`;
}

function generateCSS(configData = config) {
  const { valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = 
    buildValueMap(configData.classes, configData.fontFamilyMap);
  
  const baseFontSize = configData.baseFontSize || BASE_FONT_SIZE;
  const rootVars = generateRootVariables(fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars);
  const mobileQuery = generateMediaQuery('mobile', configData.breakpoints.mobile, configData.classes, valueMap);
  const desktopQuery = generateMediaQuery('desktop', configData.breakpoints.desktop, configData.classes, valueMap);
  
  return generateResetCSS(baseFontSize) + `:root {\n${rootVars}\n}\n\n${mobileQuery}\n\n${desktopQuery}`;
}

// Generación de HTML
function generateHTML(configData = config) {
  const classNames = Object.keys(configData.classes);
  const prefix = configData.prefix || VAR_PREFIX;
  const category = configData.category || VAR_CATEGORY;
  
  const { fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = 
    buildValueMap(configData.classes, configData.fontFamilyMap);
  
  // Construir array de variables
  const allVariables = [
    ...Array.from(fontFamilyVars.values()),
    ...Array.from(lineHeightVars.values()),
    ...Array.from(fontWeightVars.values()),
    ...Array.from(letterSpacingVars.values()),
    ...Array.from(textTransformVars.values()),
    ...Array.from(fontSizeVars.values())
  ].map(item => ({ name: item.varName, value: item.value }));
  
  // Generar tabla de clases
  const tableRows = classNames.map(className => {
    const cls = configData.classes[className];
    const fontFamilyName = getFontFamilyName(cls.fontFamily, configData.fontFamilyMap);
    
    return `
      <tr>
        <td class="class-name">.${className}</td>
        <td class="preview-cell">
          <div class="typography-preview ${className}">Aa</div>
        </td>
        <td>${fontFamilyName || cls.fontFamily || '-'}</td>
        <td>${cls.fontWeight || '-'}</td>
        <td>${cls.letterSpacing || '-'}</td>
        <td>${cls.textTransform || '-'}</td>
        <td class="mobile-value">${cls.mobile?.fontSize ? pxToRem(cls.mobile.fontSize) : '-'}</td>
        <td class="mobile-value">${cls.mobile?.lineHeight || '-'}</td>
        <td class="desktop-value">${cls.desktop?.fontSize ? pxToRem(cls.desktop.fontSize) : '-'}</td>
        <td class="desktop-value">${cls.desktop?.lineHeight || '-'}</td>
      </tr>`;
  }).join('');
  
  const classesHTML = `
    <table class="typography-table">
      <thead>
        <tr>
          <th>Clase</th>
          <th>Preview</th>
          <th>Font Family</th>
          <th>Font Weight</th>
          <th>Letter Spacing</th>
          <th>Text Transform</th>
          <th colspan="2" class="mobile-header">Mobile</th>
          <th colspan="2" class="desktop-header">Desktop</th>
        </tr>
        <tr class="sub-header">
          <th colspan="6"></th>
          <th class="mobile-value">Font Size</th>
          <th class="mobile-value">Line Height</th>
          <th class="desktop-value">Font Size</th>
          <th class="desktop-value">Line Height</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>`;
  
  // Generar tabla de font families
  const fontFamiliesHTML = configData.fontFamilyMap ? Object.entries(configData.fontFamilyMap).map(([name, value]) => {
    const varName = `--${prefix}-${category}-font-family-${name}`;
    const styleValue = value.replace(/'/g, "\\'");
    return `
      <tr>
        <td class="font-family-name">${name}</td>
        <td class="font-family-preview" style='font-family: ${styleValue};'>Aa</td>
        <td class="font-family-value">${value}</td>
        <td class="font-family-var">${varName}</td>
      </tr>`;
  }).join('') : '';
  
  const fontFamiliesTableHTML = configData.fontFamilyMap ? `
    <table class="font-families-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Preview</th>
          <th>Valor</th>
          <th>Variable CSS</th>
        </tr>
      </thead>
      <tbody>
        ${fontFamiliesHTML}
      </tbody>
    </table>` : '';
  
  // Generar tabla de variables
  const baseFontSize = configData.baseFontSize || BASE_FONT_SIZE;
  const variableRows = allVariables.map(variable => {
    const remValue = variable.value.match(/^([\d.]+)rem$/) ? variable.value : '-';
    const pxValue = remValue !== '-' ? remToPx(variable.value, baseFontSize) : '-';
    
    return `
      <tr>
        <td class="variable-name">${variable.name}</td>
        <td class="variable-value">${variable.value}</td>
        <td class="variable-rem">${remValue}</td>
        <td class="variable-px">${pxValue}</td>
      </tr>`;
  }).join('');
  
  const variablesTableHTML = `
    <table class="variables-table">
      <thead>
        <tr>
          <th>Variable CSS</th>
          <th>Valor</th>
          <th>Rem</th>
          <th>Píxeles</th>
        </tr>
      </thead>
      <tbody>
        ${variableRows}
      </tbody>
    </table>`;
  
  // Estilos CSS compartidos para tablas
  const tableStyles = `
    .typography-table, .font-families-table, .variables-table, .breakpoints-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      font-size: 0.875rem;
    }

    .typography-table thead, .font-families-table thead, .variables-table thead, .breakpoints-table thead {
      background: #f5f5f5;
    }

    .typography-table th, .font-families-table th, .variables-table th, .breakpoints-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #ddd;
    }

    .typography-table td, .font-families-table td, .variables-table td, .breakpoints-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .typography-table tbody tr:hover, .font-families-table tbody tr:hover, 
    .variables-table tbody tr:hover, .breakpoints-table tbody tr:hover {
      background: #f9f9f9;
    }

    .typography-table th.mobile-header {
      background: #e6f2ff;
      color: #000000;
      text-align: center;
    }

    .typography-table th.desktop-header {
      background: #fff4e6;
      color: #cc6600;
      text-align: center;
    }

    .typography-table .sub-header th {
      border-top: none;
      border-bottom: 1px solid #ddd;
      font-weight: 500;
      font-size: 0.6875rem;
    }

    .typography-table th {
      position: sticky;
      top: 0;
      background: #f5f5f5;
      z-index: 10;
    }

    .typography-table .class-name, .font-families-table .font-family-name, 
    .variables-table .variable-name, .breakpoints-table .breakpoint-name {
      font-weight: 600;
      color: #000000;
    }

    .typography-table .class-name, .font-families-table .font-family-name, 
    .variables-table .variable-name {
      font-family: 'Courier New', monospace;
    }

    .typography-table .preview-cell {
    }

    .typography-table .typography-preview {
      padding: 0.5rem;
      font-size: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 50px;
      text-align: center;
    }

    .typography-table .mobile-value {
      background: #f0f8ff;
      color: #000000;
      font-weight: 500;
      text-align: center;
    }

    .typography-table .desktop-value {
      background: #fff8f0;
      color: #cc6600;
      font-weight: 500;
      text-align: center;
    }

    .typography-table tbody td, .font-families-table .font-family-value, 
    .font-families-table .font-family-var, .variables-table .variable-value,
    .variables-table .variable-rem, .variables-table .variable-px,
    .breakpoints-table .breakpoint-value {
      font-family: 'Courier New', monospace;
    }

    .font-families-table .font-family-preview {
      min-width: 100px;
      padding: 0.75rem;
      min-height: 50px;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .font-families-table .font-family-value {
      color: #666;
    }

    .variables-table .variable-value {
      color: #333;
    }

    .variables-table .variable-rem {
      color: #000000;
      font-weight: 500;
      text-align: center;
    }

    .variables-table .variable-px {
      color: #cc6600;
      font-weight: 500;
      text-align: center;
    }`;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HolyGrail5 - Guía de Tipografía</title>
  <link rel="stylesheet" href="output.css">
  <style>
    body {
      font-family: var(--${prefix}-${category}-font-family-primary);
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background: #f5f5f5;
    }

    .header {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #000;
    }

    .header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 900;
    }

    .header p {
      margin: 1rem 0 0 0;
      opacity: 0.7;
    }

    .section {
      margin-bottom: 4rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    ${tableStyles}
  </style>
</head>
<body>
  <div class="header">
    <h1 class="${classNames[0] || 'h2'}">HolyGrail5</h1>
    <p class="text-m">Guía de Tipografía - Framework CSS Generator</p>
  </div>

  ${fontFamiliesTableHTML ? `
  <div class="section">
    <h2 class="section-title">Font Families</h2>
    ${fontFamiliesTableHTML}
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">Clases de Tipografía</h2>
    ${classesHTML}
  </div>

  <div class="section">
    <h2 class="section-title">Variables CSS Compartidas</h2>
    ${variablesTableHTML}
  </div>

  <div class="section">
    <h2 class="section-title">Breakpoints</h2>
    <table class="breakpoints-table">
      <thead>
        <tr>
          <th>Breakpoint</th>
          <th>Min-width</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="breakpoint-name">Mobile</td>
          <td class="breakpoint-value">${configData.breakpoints.mobile}</td>
        </tr>
        <tr>
          <td class="breakpoint-name">Desktop</td>
          <td class="breakpoint-value">${configData.breakpoints.desktop}</td>
        </tr>
      </tbody>
    </table>
    <p class="text-m" style="margin-top: 1rem;">
      Las clases de tipografía se adaptan automáticamente a cada breakpoint. 
      Resize la ventana del navegador para ver los cambios.
    </p>
  </div>
</body>
</html>`;
}

// Ejecución principal
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

if (require.main === module) {
  try {
    // Parsear argumentos de línea de comandos
    const args = process.argv.slice(2);
    const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1] || path.join(__dirname, 'config.json');
    const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || path.join(__dirname, 'output.css');
    const htmlPath = args.find(arg => arg.startsWith('--html='))?.split('=')[1] || path.join(__dirname, 'index.html');
    
    // Recargar configuración si se especifica una ruta diferente
    const configData = configPath !== path.join(__dirname, 'config.json') ? loadConfig(configPath) : config;
    
    // Generar CSS
    const cssContent = generateCSS(configData);
    writeFile(outputPath, cssContent, 'CSS');
    
    // Generar HTML
    const htmlContent = generateHTML(configData);
    writeFile(htmlPath, htmlContent, 'HTML');
    
    console.log('\n🎉 Generación completada exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Exportar funciones
module.exports = { generateCSS, generateHTML };
