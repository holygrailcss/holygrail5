#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// Propiedades CSS a procesar
const PROPERTIES = ['fontFamily', 'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing', 'textTransform'];
const BREAKPOINTS = ['mobile', 'desktop'];

// Configuración del formato de nombres de variables
const VAR_PREFIX = config.prefix || 'mds';
const VAR_CATEGORY = config.category || 'typo';
const BASE_FONT_SIZE = config.baseFontSize || 16; // Base para conversión px a rem

// Función para convertir camelCase a kebab-case
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Función para convertir px a rem
function pxToRem(value) {
  if (typeof value === 'string' && value.endsWith('px')) {
    const pxValue = parseFloat(value);
    const remValue = pxValue / BASE_FONT_SIZE;
    // Redondear a 4 decimales para evitar valores muy largos
    return `${parseFloat(remValue.toFixed(4))}rem`;
  }
  return value; // Retornar el valor original si no es px
}

// Mapear valores de font-family a nombres (primary, secondary, etc.)
function getFontFamilyName(fontFamilyValue, fontFamilyMap) {
  // Buscar en el mapeo si existe
  if (fontFamilyMap) {
    for (const [name, value] of Object.entries(fontFamilyMap)) {
      if (value === fontFamilyValue) return name;
    }
  }
  
  // Si no hay mapeo, generar un nombre basado en el valor
  // Quitar comillas y espacios, y usar como nombre
  const cleanValue = fontFamilyValue.replace(/["']/g, '').replace(/\s+/g, '-').toLowerCase();
  return cleanValue.split(',')[0].trim();
}

// Función para generar nombre de variable CSS para font-family (compartida)
function getFontFamilyVarName(fontFamilyName) {
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-font-family-${fontFamilyName}`;
}

// Función para generar nombre de variable CSS para line-height (compartida)
function getLineHeightVarName(lineHeightValue) {
  // Convertir el valor a un nombre válido (ej: 1.2 -> 1-2, 1.4 -> 1-4)
  const name = lineHeightValue.toString().replace('.', '-');
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-line-height-${name}`;
}

// Función para generar nombre de variable CSS compartida basada en valor
function getSharedVarName(prop, value) {
  const propName = toKebabCase(prop);
  
  // Convertir el valor a un nombre válido
  let name = value.toString();
  
  // Limpiar el valor según el tipo
  if (prop === 'fontSize') {
    // fontSize: si tiene px, usar el valor en px para el nombre, si no remover 'rem' y convertir puntos a guiones
    if (name.endsWith('px')) {
      name = name.replace('px', '').replace('.', '-');
    } else {
      name = name.replace(/rem/g, '').replace('.', '-');
    }
  } else if (prop === 'fontWeight') {
    // fontWeight: usar el valor directamente
    name = value.toString();
  } else if (prop === 'letterSpacing') {
    // letterSpacing: remover 'rem' y convertir puntos a guiones
    name = name.replace(/rem/g, '').replace('.', '-');
  } else if (prop === 'textTransform') {
    // textTransform: usar el valor directamente
    name = value.toString();
  }
  
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-${propName}-${name}`;
}

// Extraer valores únicos y crear mapeo de variables
function buildValueMap(classes, fontFamilyMap) {
  const valueMap = {};
  const fontFamilyVars = new Map(); // Mapa de valores de font-family a nombres de variables
  const lineHeightVars = new Map(); // Mapa de valores de line-height a nombres de variables
  const fontWeightVars = new Map(); // Mapa de valores de font-weight a nombres de variables
  const letterSpacingVars = new Map(); // Mapa de valores de letter-spacing a nombres de variables
  const textTransformVars = new Map(); // Mapa de valores de text-transform a nombres de variables
  const fontSizeVars = new Map(); // Mapa de valores de font-size a nombres de variables
  
  // Crear mapeo de variables compartidas
  Object.entries(classes).forEach(([className, cls]) => {
    valueMap[className] = {};
    
    // FontFamily es compartido
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
    
    // Propiedades base compartidas (fontWeight, letterSpacing, textTransform)
    if (cls.fontWeight !== undefined) {
      const varName = getSharedVarName('fontWeight', cls.fontWeight);
      if (!fontWeightVars.has(cls.fontWeight)) {
        fontWeightVars.set(cls.fontWeight, { varName, value: cls.fontWeight });
      }
      valueMap[className].fontWeight = {
        varName: fontWeightVars.get(cls.fontWeight).varName,
        value: cls.fontWeight
      };
    }
    
    if (cls.letterSpacing !== undefined) {
      const varName = getSharedVarName('letterSpacing', cls.letterSpacing);
      if (!letterSpacingVars.has(cls.letterSpacing)) {
        letterSpacingVars.set(cls.letterSpacing, { varName, value: cls.letterSpacing });
      }
      valueMap[className].letterSpacing = {
        varName: letterSpacingVars.get(cls.letterSpacing).varName,
        value: cls.letterSpacing
      };
    }
    
    if (cls.textTransform !== undefined) {
      const varName = getSharedVarName('textTransform', cls.textTransform);
      if (!textTransformVars.has(cls.textTransform)) {
        textTransformVars.set(cls.textTransform, { varName, value: cls.textTransform });
      }
      valueMap[className].textTransform = {
        varName: textTransformVars.get(cls.textTransform).varName,
        value: cls.textTransform
      };
    }
    
    // Propiedades de breakpoints (fontSize, lineHeight) - todas compartidas
    BREAKPOINTS.forEach(bp => {
      if (cls[bp]) {
        // fontSize es compartido - convertir px a rem si es necesario
        if (cls[bp].fontSize !== undefined) {
          const fontSizeValue = cls[bp].fontSize;
          const fontSizeRem = pxToRem(fontSizeValue);
          const varName = getSharedVarName('fontSize', fontSizeValue); // Usar valor original para el nombre
          if (!fontSizeVars.has(fontSizeValue)) {
            fontSizeVars.set(fontSizeValue, { varName, value: fontSizeRem }); // Guardar valor convertido
          }
          if (!valueMap[className].fontSize) valueMap[className].fontSize = {};
          valueMap[className].fontSize[bp] = {
            varName: fontSizeVars.get(fontSizeValue).varName,
            value: fontSizeRem // Usar valor convertido
          };
        }
        
        // lineHeight es compartido
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

// Generar variables CSS compartidas
function generateRootVariables(valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars) {
  const variables = [];
  
  // Generar todas las variables compartidas
  const allSharedVars = [
    { map: fontFamilyVars, name: 'font-family' },
    { map: lineHeightVars, name: 'line-height' },
    { map: fontWeightVars, name: 'font-weight' },
    { map: letterSpacingVars, name: 'letter-spacing' },
    { map: textTransformVars, name: 'text-transform' },
    { map: fontSizeVars, name: 'font-size' }
  ];
  
  allSharedVars.forEach(({ map }) => {
    const uniqueValues = Array.from(map.values());
    uniqueValues.forEach(item => {
      variables.push(`  ${item.varName}: ${item.value};`);
    });
  });
  
  return variables.join('\n');
}

// Obtener propiedades finales para un breakpoint
function getFinalProps(cls, breakpoint) {
  const props = {};
  
  // Propiedades base
  ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
    if (cls[prop] !== undefined) props[prop] = cls[prop];
  });
  
  // Propiedades del breakpoint - convertir fontSize de px a rem
  if (cls[breakpoint]) {
    if (cls[breakpoint].fontSize !== undefined) {
      props.fontSize = pxToRem(cls[breakpoint].fontSize);
    }
    if (cls[breakpoint].lineHeight !== undefined) {
      props.lineHeight = cls[breakpoint].lineHeight;
    }
  }
  
  return props;
}

// Generar CSS para una clase
function generateClassCSS(className, cls, breakpoint, valueMap) {
  const props = getFinalProps(cls, breakpoint);
  const cssProps = [];
  
  PROPERTIES.forEach(prop => {
    if (props[prop] !== undefined) {
      let varName;
      
      if (prop === 'fontFamily') {
        // FontFamily usa variables compartidas
        const fontFamilyName = getFontFamilyName(props[prop], config.fontFamilyMap);
        varName = getFontFamilyVarName(fontFamilyName);
      } else if (prop === 'lineHeight') {
        // lineHeight usa variables compartidas
        varName = getLineHeightVarName(props[prop]);
      } else if (prop === 'fontSize') {
        // fontSize: usar valor original en px para generar el nombre de la variable
        const originalValue = cls[breakpoint] && cls[breakpoint].fontSize !== undefined 
          ? cls[breakpoint].fontSize 
          : cls.fontSize;
        varName = getSharedVarName(prop, originalValue);
      } else {
        // Otras propiedades usan variables compartidas
        varName = getSharedVarName(prop, props[prop]);
      }
      
      const cssPropName = toKebabCase(prop);
      cssProps.push(`    ${cssPropName}: var(${varName});`);
    }
  });
  
  return cssProps.length ? `  .${className} {\n${cssProps.join('\n')}\n  }` : '';
}

// Generar media query
function generateMediaQuery(breakpointName, minWidth, classes, valueMap) {
  const cssClasses = Object.entries(classes)
    .map(([className, cls]) => generateClassCSS(className, cls, breakpointName, valueMap))
    .filter(Boolean);
  
  return `@media (min-width: ${minWidth}) {\n\n${cssClasses.join('\n\n')}\n\n}`;
}

// Generar reset CSS mínimo
function generateResetCSS() {
  return `/* Reset CSS Mínimo */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 100%;
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

// Generar CSS completo
function generateCSS(configData = config) {
  const { valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = buildValueMap(configData.classes, configData.fontFamilyMap);
  const rootVars = generateRootVariables(valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars);
  
  const mobileQuery = generateMediaQuery('mobile', configData.breakpoints.mobile, configData.classes, valueMap);
  const desktopQuery = generateMediaQuery('desktop', configData.breakpoints.desktop, configData.classes, valueMap);
  
  const resetCSS = generateResetCSS();
  
  return resetCSS + `:root {\n${rootVars}\n}\n\n${mobileQuery}\n\n${desktopQuery}`;
}

// Generar HTML dinámicamente
function generateHTML(configData = config) {
  const classNames = Object.keys(configData.classes);
  const VAR_PREFIX = configData.prefix || 'mds';
  const VAR_CATEGORY = configData.category || 'typo';
  
  // Obtener todas las variables CSS del :root
  const { fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = buildValueMap(configData.classes, configData.fontFamilyMap);
  
  const allVariables = [];
  
  // Agregar variables de font-family
  Array.from(fontFamilyVars.values()).forEach(item => {
    allVariables.push({ name: item.varName, value: item.value });
  });
  
  // Agregar variables de line-height
  Array.from(lineHeightVars.values()).forEach(item => {
    allVariables.push({ name: item.varName, value: item.value });
  });
  
  // Agregar variables de font-weight
  Array.from(fontWeightVars.values()).forEach(item => {
    allVariables.push({ name: item.varName, value: item.value });
  });
  
  // Agregar variables de letter-spacing
  Array.from(letterSpacingVars.values()).forEach(item => {
    allVariables.push({ name: item.varName, value: item.value });
  });
  
  // Agregar variables de text-transform
  Array.from(textTransformVars.values()).forEach(item => {
    allVariables.push({ name: item.varName, value: item.value });
  });
  
  // Agregar variables de font-size
  Array.from(fontSizeVars.values()).forEach(item => {
    allVariables.push({ name: item.varName, value: item.value });
  });
  
  // Función para obtener el nombre de font-family
  function getFontFamilyDisplayName(cls, fontFamilyMap) {
    if (!cls.fontFamily) return '';
    if (fontFamilyMap) {
      for (const [name, value] of Object.entries(fontFamilyMap)) {
        if (value === cls.fontFamily) return name;
      }
    }
    return cls.fontFamily;
  }
  
  // Generar HTML de tabla con clases y sus características
  const tableRows = classNames.map(className => {
    const cls = configData.classes[className];
    const fontFamilyName = getFontFamilyDisplayName(cls, configData.fontFamilyMap);
    
    // Obtener valores
    const fontFamily = fontFamilyName || cls.fontFamily || '-';
    const fontWeight = cls.fontWeight || '-';
    const letterSpacing = cls.letterSpacing || '-';
    const textTransform = cls.textTransform || '-';
    const fontSizeMobile = cls.mobile?.fontSize ? pxToRem(cls.mobile.fontSize) : '-';
    const lineHeightMobile = cls.mobile?.lineHeight || '-';
    const fontSizeDesktop = cls.desktop?.fontSize ? pxToRem(cls.desktop.fontSize) : '-';
    const lineHeightDesktop = cls.desktop?.lineHeight || '-';
    
    return `
      <tr>
        <td class="class-name">.${className}</td>
        <td class="preview-cell">
          <div class="typography-preview ${className}">Aa</div>
        </td>
        <td>${fontFamily}</td>
        <td>${fontWeight}</td>
        <td>${letterSpacing}</td>
        <td>${textTransform}</td>
        <td class="mobile-value">${fontSizeMobile}</td>
        <td class="mobile-value">${lineHeightMobile}</td>
        <td class="desktop-value">${fontSizeDesktop}</td>
        <td class="desktop-value">${lineHeightDesktop}</td>
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
  
  // Generar HTML de font families
  const fontFamiliesHTML = configData.fontFamilyMap ? Object.entries(configData.fontFamilyMap).map(([name, value]) => {
    const varName = `--${VAR_PREFIX}-${VAR_CATEGORY}-font-family-${name}`;
    // Para el atributo style, usar comillas simples alrededor del valor completo
    // El valor del JSON puede contener comillas dobles, así que usamos comillas simples en el atributo
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
  
  // Función para convertir rem a px
  function remToPx(remValue, baseFontSize = 16) {
    const remMatch = remValue.toString().match(/^([\d.]+)rem$/);
    if (remMatch) {
      const remNum = parseFloat(remMatch[1]);
      return `${remNum * baseFontSize}px`;
    }
    return '-';
  }
  
  // Generar HTML de variables en tabla
  const baseFontSize = configData.baseFontSize || 16;
  const variableRows = allVariables.map(variable => {
    const value = variable.value;
    const remValue = value.match(/^([\d.]+)rem$/) ? value : '-';
    const pxValue = remValue !== '-' ? remToPx(value, baseFontSize) : '-';
    const hasRem = remValue !== '-';
    
    return `
      <tr>
        <td class="variable-name">${variable.name}</td>
        <td class="variable-value">${value}</td>
        <td class="variable-rem">${hasRem ? remValue : '-'}</td>
        <td class="variable-px">${hasRem ? pxValue : '-'}</td>
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
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HolyGrail5 - Guía de Tipografía</title>
  <link rel="stylesheet" href="output.css">
  <style>
    body {
      font-family: var(--${VAR_PREFIX}-${VAR_CATEGORY}-font-family-primary);
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

    .typography-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      font-size: 0.875rem;
    
    }

    .typography-table thead {
      background: #f5f5f5;
    }

    .typography-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #ddd;
      position: sticky;
      top: 0;
      background: #f5f5f5;
      z-index: 10;
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

    .typography-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .typography-table tbody tr:hover {
      background: #f9f9f9;
    }

    .typography-table .class-name {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #000000;
      white-space: nowrap;
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

    .typography-table tbody td {
      font-family: 'Courier New', monospace;
    }

    .font-families-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      font-size: 0.875rem;
     
    }

    .font-families-table thead {
      background: #f5f5f5;
    }

    .font-families-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #ddd;
    }

    .font-families-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .font-families-table tbody tr:hover {
      background: #f9f9f9;
    }

    .font-families-table .font-family-name {
      font-weight: 600;
      color: #000000;
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
      font-family: 'Courier New', monospace;
      color: #666;
    }

    .font-families-table .font-family-var {
      font-family: 'Courier New', monospace;
      color: #000000;
      font-weight: 500;
    }

    .variables-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      font-size: 0.875rem;
     
    }

    .variables-table thead {
      background: #f5f5f5;
    }

    .variables-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #ddd;
    }

    .variables-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .variables-table tbody tr:hover {
      background: #f9f9f9;
    }

    .variables-table .variable-name {
      font-family: 'Courier New', monospace;
      color: #000000;
      font-weight: 600;
    }

    .variables-table .variable-value {
      font-family: 'Courier New', monospace;
      color: #333;
    }

    .variables-table .variable-rem {
      font-family: 'Courier New', monospace;
      color: #000000;
      font-weight: 500;
      text-align: center;
    }

    .variables-table .variable-px {
      font-family: 'Courier New', monospace;
      color: #cc6600;
      font-weight: 500;
      text-align: center;
    }

    .breakpoints-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      font-size: 0.875rem;
    }

    .breakpoints-table thead {
      background: #f5f5f5;
    }

    .breakpoints-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #ddd;
    }

    .breakpoints-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .breakpoints-table tbody tr:hover {
      background: #f9f9f9;
    }

    .breakpoints-table .breakpoint-name {
      font-weight: 600;
      color: #000000;
    }

    .breakpoints-table .breakpoint-value {
      font-family: 'Courier New', monospace;
      color: #333;
    }
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

// Si se ejecuta directamente, generar CSS y HTML
if (require.main === module) {
  const outputPath = process.argv[2] || path.join(__dirname, 'output.css');
  fs.writeFileSync(outputPath, generateCSS(), 'utf8');
  console.log(`CSS generado exitosamente en ${outputPath}`);
  
  const htmlPath = path.join(__dirname, 'index.html');
  fs.writeFileSync(htmlPath, generateHTML(), 'utf8');
  console.log(`HTML generado exitosamente en ${htmlPath}`);
}

// Exportar función para uso como módulo
module.exports = { generateCSS, generateHTML };
