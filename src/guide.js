// Generador de guía HTML desde JSON

const fs = require('fs');
const path = require('path');
const { pxToRem, remToPx, getFontFamilyName } = require('./utils');
const { buildValueMap } = require('./parser');

// Lee los valores anteriores guardados en un archivo JSON
function loadPreviousValues(previousValuesPath) {
  try {
    if (fs.existsSync(previousValuesPath)) {
      const content = fs.readFileSync(previousValuesPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // Si no existe o hay error, devuelve null
  }
  return null;
}

// Guarda los valores actuales para la próxima comparación
function saveCurrentValues(currentValues, previousValuesPath) {
  try {
    const dir = path.dirname(previousValuesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(previousValuesPath, JSON.stringify(currentValues, null, 2), 'utf8');
  } catch (error) {
    console.warn('⚠️  No se pudo guardar los valores anteriores:', error.message);
  }
}

// Compara valores actuales con anteriores y devuelve un mapa de cambios
function getChangedValues(currentValues, previousValues) {
  const changes = new Set();
  
  // Si no hay valores previos, marca todo como nuevo (primera ejecución)
  if (!previousValues) {
    // Marca todas las variables como nuevas
    if (currentValues.variables) {
      Object.keys(currentValues.variables).forEach(varName => {
        changes.add(`variable.${varName}`);
      });
    }
    // Marca todos los breakpoints como nuevos
    if (currentValues.breakpoints) {
      changes.add('breakpoints.mobile');
      changes.add('breakpoints.desktop');
    }
    // Marca todas las fuentes como nuevas
    if (currentValues.fontFamilyMap) {
      Object.keys(currentValues.fontFamilyMap).forEach(fontName => {
        changes.add(`fontFamilyMap.${fontName}`);
      });
    }
    // Marca todas las clases como nuevas
    if (currentValues.classes) {
      Object.keys(currentValues.classes).forEach(className => {
        const cls = currentValues.classes[className];
        ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
          if (cls[prop] !== undefined) {
            changes.add(`${className}.${prop}`);
          }
        });
        ['mobile', 'desktop'].forEach(bp => {
          if (cls[bp]) {
            if (cls[bp].fontSize) changes.add(`${className}.${bp}.fontSize`);
            if (cls[bp].lineHeight) changes.add(`${className}.${bp}.lineHeight`);
          }
        });
      });
    }
    return changes;
  }
  
  // Compara breakpoints
  if (currentValues.breakpoints) {
    if (!previousValues.breakpoints) {
      changes.add('breakpoints.mobile');
      changes.add('breakpoints.desktop');
    } else {
      if (currentValues.breakpoints.mobile !== previousValues.breakpoints.mobile) {
        changes.add('breakpoints.mobile');
      }
      if (currentValues.breakpoints.desktop !== previousValues.breakpoints.desktop) {
        changes.add('breakpoints.desktop');
      }
    }
  }
  
  // Compara fontFamilyMap
  if (currentValues.fontFamilyMap) {
    const currentFontMap = currentValues.fontFamilyMap;
    const previousFontMap = previousValues.fontFamilyMap || {};
    
    // Compara cada fuente en el mapa
    Object.keys(currentFontMap).forEach(fontName => {
      const currentVal = currentFontMap[fontName];
      const previousVal = previousFontMap[fontName];
      
      if (currentVal !== previousVal) {
        changes.add(`fontFamilyMap.${fontName}`);
      }
    });
    
    // Detecta fuentes eliminadas
    Object.keys(previousFontMap).forEach(fontName => {
      if (!currentFontMap[fontName]) {
        changes.add(`fontFamilyMap.${fontName}`);
      }
    });
  }
  
  // Compara spacingMap
  if (currentValues.spacingMap) {
    const currentSpacingMap = currentValues.spacingMap;
    const previousSpacingMap = previousValues.spacingMap || {};
    
    // Compara cada valor de spacing en el mapa
    Object.keys(currentSpacingMap).forEach(spacingKey => {
      const currentVal = currentSpacingMap[spacingKey];
      const previousVal = previousSpacingMap[spacingKey];
      
      if (currentVal !== previousVal) {
        changes.add(`spacingMap.${spacingKey}`);
      }
    });
    
    // Detecta valores de spacing eliminados
    Object.keys(previousSpacingMap).forEach(spacingKey => {
      if (!currentSpacingMap[spacingKey]) {
        changes.add(`spacingMap.${spacingKey}`);
      }
    });
  }
  
  // Compara cada clase
  const currentClasses = currentValues.classes || currentValues;
  const previousClasses = previousValues.classes || previousValues;
  
  Object.keys(currentClasses).forEach(className => {
    const current = currentClasses[className];
    const previous = previousClasses[className];
    
    if (!previous) {
      // Nueva clase, marca todo como cambiado
      Object.keys(current).forEach(prop => {
        if (prop !== 'mobile' && prop !== 'desktop') {
          changes.add(`${className}.${prop}`);
        }
      });
      return;
    }
    
    // Compara propiedades base
    ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
      const currentVal = current[prop];
      const previousVal = previous[prop];
      if (currentVal !== previousVal) {
        changes.add(`${className}.${prop}`);
      }
    });
    
    // Compara propiedades de breakpoints
    ['mobile', 'desktop'].forEach(bp => {
      if (current[bp]) {
        if (!previous[bp]) {
          // Nuevo breakpoint
          if (current[bp].fontSize) changes.add(`${className}.${bp}.fontSize`);
          if (current[bp].lineHeight) changes.add(`${className}.${bp}.lineHeight`);
        } else {
          // Compara fontSize y lineHeight
          if (current[bp].fontSize !== previous[bp]?.fontSize) {
            changes.add(`${className}.${bp}.fontSize`);
          }
          if (current[bp].lineHeight !== previous[bp]?.lineHeight) {
            changes.add(`${className}.${bp}.lineHeight`);
          }
        }
      }
    });
  });
  
  // Compara variables CSS compartidas
  if (currentValues.variables) {
    const currentVars = currentValues.variables;
    const previousVars = previousValues.variables || {};
    
    // Detecta nuevas variables o variables con valores cambiados
    Object.keys(currentVars).forEach(varName => {
      const currentVal = currentVars[varName];
      const previousVal = previousVars[varName];
      
      // Si no existía antes o el valor cambió, marca como cambiado
      if (previousVal === undefined || currentVal !== previousVal) {
        changes.add(`variable.${varName}`);
      }
    });
  }
  
  return changes;
}

function generateHTML(configData, previousValuesPath = null) {
  const classNames = Object.keys(configData.classes);
  const prefix = configData.prefix || 'hg';
  const category = configData.category || 'typo';
  const baseFontSize = configData.baseFontSize || 16;
  
  // Construir variables CSS primero para poder guardarlas
  const { fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = 
    buildValueMap(configData.classes, configData.fontFamilyMap, prefix, category);
  
  // Generar variables de spacing
  const { generateSpacingVariables } = require('./parser');
  const spacingVars = generateSpacingVariables(configData.spacingMap, prefix, baseFontSize);
  
  // Construir array de variables (incluyendo spacing)
  const allVariables = [
    ...Array.from(fontFamilyVars.values()),
    ...Array.from(lineHeightVars.values()),
    ...Array.from(fontWeightVars.values()),
    ...Array.from(letterSpacingVars.values()),
    ...Array.from(textTransformVars.values()),
    ...Array.from(fontSizeVars.values()),
    ...spacingVars
  ].map(item => ({ name: item.varName, value: item.value }));
  
  // Preparar valores actuales para comparación
  const currentValues = {
    breakpoints: {
      mobile: configData.breakpoints.mobile,
      desktop: configData.breakpoints.desktop
    },
    fontFamilyMap: configData.fontFamilyMap || {},
    spacingMap: configData.spacingMap || {},
    classes: {},
    variables: {}
  };
  
  // Guardar variables CSS en currentValues
  allVariables.forEach(variable => {
    currentValues.variables[variable.name] = variable.value;
  });
  
  classNames.forEach(className => {
    const cls = configData.classes[className];
    currentValues.classes[className] = {
      fontFamily: cls.fontFamily,
      fontWeight: cls.fontWeight,
      letterSpacing: cls.letterSpacing,
      textTransform: cls.textTransform,
      mobile: {
        fontSize: cls.mobile?.fontSize,
        lineHeight: cls.mobile?.lineHeight
      },
      desktop: {
        fontSize: cls.desktop?.fontSize,
        lineHeight: cls.desktop?.lineHeight
      }
    };
  });
  
  // Cargar valores anteriores y detectar cambios
  const previousValuesPathDefault = previousValuesPath || path.join(__dirname, '..', '.previous-values.json');
  const previousValues = loadPreviousValues(previousValuesPathDefault);
  const changedValues = getChangedValues(currentValues, previousValues);
  
  // Guardar valores actuales para la próxima vez
  saveCurrentValues(currentValues, previousValuesPathDefault);
  
  // Función auxiliar para verificar si un valor cambió
  function isChanged(className, prop, breakpoint = null) {
    const key = breakpoint ? `${className}.${breakpoint}.${prop}` : `${className}.${prop}`;
    return changedValues.has(key);
  }
  
  // Generar tabla de clases
  const tableRows = classNames.map(className => {
    const cls = configData.classes[className];
    const fontFamilyName = getFontFamilyName(cls.fontFamily, configData.fontFamilyMap);
    
    const fontFamilyChanged = isChanged(className, 'fontFamily');
    const fontWeightChanged = isChanged(className, 'fontWeight');
    const letterSpacingChanged = isChanged(className, 'letterSpacing');
    const textTransformChanged = isChanged(className, 'textTransform');
    const mobileFontSizeChanged = isChanged(className, 'fontSize', 'mobile');
    const mobileLineHeightChanged = isChanged(className, 'lineHeight', 'mobile');
    const desktopFontSizeChanged = isChanged(className, 'fontSize', 'desktop');
    const desktopLineHeightChanged = isChanged(className, 'lineHeight', 'desktop');
    
    return `
      <tr>
        <td class="class-name">.${className}</td>
        <td class="preview-cell">
          <div class="typography-preview ${className}">Aa</div>
        </td>
        <td class="${fontFamilyChanged ? 'changed' : ''}">${fontFamilyName || cls.fontFamily || '-'}</td>
        <td class="${fontWeightChanged ? 'changed' : ''}">${cls.fontWeight || '-'}</td>
        <td class="${letterSpacingChanged ? 'changed' : ''}">${cls.letterSpacing || '-'}</td>
        <td class="${textTransformChanged ? 'changed' : ''}">${cls.textTransform || '-'}</td>
        <td class="mobile-value ${mobileFontSizeChanged ? 'changed' : ''}">${cls.mobile?.fontSize ? pxToRem(cls.mobile.fontSize, baseFontSize) : '-'}</td>
        <td class="mobile-value ${mobileLineHeightChanged ? 'changed' : ''}">${cls.mobile?.lineHeight || '-'}</td>
        <td class="desktop-value ${desktopFontSizeChanged ? 'changed' : ''}">${cls.desktop?.fontSize ? pxToRem(cls.desktop.fontSize, baseFontSize) : '-'}</td>
        <td class="desktop-value ${desktopLineHeightChanged ? 'changed' : ''}">${cls.desktop?.lineHeight || '-'}</td>
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
    const isChanged = changedValues.has(`fontFamilyMap.${name}`);
    return `
      <tr>
        <td class="font-family-name">${name}</td>
        <td class="font-family-preview" style='font-family: ${styleValue};'>Aa</td>
        <td class="font-family-value ${isChanged ? 'changed' : ''}">${value}</td>
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
      const variableRows = allVariables.map(variable => {
        const remValue = variable.value.match(/^([\d.]+)rem$/) ? variable.value : '-';
        const pxValue = remValue !== '-' ? remToPx(variable.value, baseFontSize) : '-';
        const isVariableChanged = changedValues.has(`variable.${variable.name}`);
        
        return `
          <tr>
            <td class="variable-name ${isVariableChanged ? 'changed' : ''}">${variable.name}</td>
            <td class="variable-value ${isVariableChanged ? 'changed' : ''}">${variable.value}</td>
            <td class="variable-rem ${isVariableChanged ? 'changed' : ''}">${remValue}</td>
            <td class="variable-px ${isVariableChanged ? 'changed' : ''}">${pxValue}</td>
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
  
  // Generar tabla de spacing helpers
  const spacingHelpersHTML = configData.spacingMap ? Object.entries(configData.spacingMap).map(([key, value]) => {
    // Detectar si tiene ! para !important
    const hasImportant = key.endsWith('!');
    const cleanKey = hasImportant ? key.slice(0, -1) : key;
    const exclamation = hasImportant ? '!' : '';
    const importantLabel = hasImportant ? ' <strong>(con !important)</strong>' : '';
    
    const varName = `--${prefix}-spacing-${cleanKey}`;
    const remValue = pxToRem(value, baseFontSize);
    const pxValue = value;
    const isChanged = changedValues.has(`spacingMap.${key}`);
    
        return `
      <tr>
        <td class="spacing-class">.${prefix}-p-${cleanKey}${exclamation}, .${prefix}-pr-${cleanKey}${exclamation} (end), .${prefix}-pl-${cleanKey}${exclamation} (start), .${prefix}-pb-${cleanKey}${exclamation}, .${prefix}-pt-${cleanKey}${exclamation}<br>.${prefix}-m-${cleanKey}${exclamation}, .${prefix}-mr-${cleanKey}${exclamation} (end), .${prefix}-ml-${cleanKey}${exclamation} (start), .${prefix}-mb-${cleanKey}${exclamation}, .${prefix}-mt-${cleanKey}${exclamation}${importantLabel}</td>
        <td class="spacing-var ${isChanged ? 'changed' : ''}">${varName}</td>
        <td class="spacing-value ${isChanged ? 'changed' : ''}">${remValue}</td>
        <td class="spacing-px ${isChanged ? 'changed' : ''}">${pxValue}</td>
      </tr>`;
  }).join('') : '';
  
  const spacingHelpersTableHTML = configData.spacingMap ? `
    <table class="spacing-helpers-table">
      <thead>
        <tr>
          <th>Clases Helper</th>
          <th>Variable CSS</th>
          <th>Valor (rem)</th>
          <th>Valor (px)</th>
        </tr>
      </thead>
      <tbody>
        ${spacingHelpersHTML}
      </tbody>
    </table>` : '';
  
  // Estilos CSS compartidos para tablas
  const tableStyles = `
    .typography-table, .font-families-table, .variables-table, .breakpoints-table, .spacing-helpers-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      font-size: 0.875rem;
    }



    .typography-table th, .font-families-table th, .variables-table th, .breakpoints-table th, .spacing-helpers-table th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;

      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #ddd;
    }

    .typography-table td, .font-families-table td, .variables-table td, .breakpoints-table td, .spacing-helpers-table td {
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .typography-table tbody tr:hover, .font-families-table tbody tr:hover, 
    .variables-table tbody tr:hover, .breakpoints-table tbody tr:hover, .spacing-helpers-table tbody tr:hover {
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

    .typography-table td.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
      font-weight: 600;
    }

    .typography-table td.mobile-value.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
    }

    .typography-table td.desktop-value.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
    }

    .typography-table tbody td, .font-families-table .font-family-value, 
    .font-families-table .font-family-var, .variables-table .variable-value,
    .variables-table .variable-rem, .variables-table .variable-px,
    .breakpoints-table .breakpoint-value {
      font-family: 'Courier New', monospace;
    }

    .breakpoints-table .breakpoint-value.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
      font-weight: 600;
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

    .font-families-table .font-family-value.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
      font-weight: 600;
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
    }

    .variables-table .variable-name.changed,
    .variables-table .variable-value.changed,
    .variables-table .variable-rem.changed,
    .variables-table .variable-px.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
      font-weight: 600;
    }

    .spacing-helpers-table .spacing-class {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #000000;
    }

    .spacing-helpers-table .spacing-var {
      font-family: 'Courier New', monospace;
      color: #333;
    }

    .spacing-helpers-table .spacing-value {
      font-family: 'Courier New', monospace;
      color: #000000;
      font-weight: 500;
      text-align: center;
    }

    .spacing-helpers-table .spacing-px {
      font-family: 'Courier New', monospace;
      color: #cc6600;
      font-weight: 500;
      text-align: center;
    }

    .spacing-helpers-table .spacing-var.changed,
    .spacing-helpers-table .spacing-value.changed,
    .spacing-helpers-table .spacing-px.changed {
      background: #d4edda !important;
      border-left: 3px solid #28a745;
      font-weight: 600;
    }`;
  
      // Construir menú lateral
      const menuItems = [];
      if (fontFamiliesTableHTML) {
        menuItems.push({ id: 'font-families', label: 'Font Families' });
      }
      menuItems.push(
        { id: 'tipografia', label: 'Tipografía' },
        { id: 'variables', label: 'Variables CSS' }
      );
      if (spacingHelpersTableHTML) {
        menuItems.push({ id: 'spacing', label: 'Helpers de Spacing' });
      }
      menuItems.push({ id: 'breakpoints', label: 'Breakpoints' });
      
      const menuHTML = menuItems.map(item => `
        <a href="#${item.id}" class="menu-item" data-section="${item.id}">${item.label}</a>
      `).join('');
      
      return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>HolyGrail5 - Guía de Tipografía</title>
  <link rel="stylesheet" href="output.css?v=${Date.now()}">
  <style>
    * {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: var(--${prefix}-${category}-font-family-primary);
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      display: flex;
    }
    
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 250px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e0e0e0;
      padding: 2rem 0;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 2px 0 8px rgba(0,0,0,0.05);
    }
    
    .sidebar-header {
      padding: 0 1.5rem 2rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 1rem;
    }
    
    .sidebar-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #000;
    }
    
    .sidebar-nav {
      padding: 0 1rem;
    }
    
    .menu-item {
      display: block;
      padding: 0.75rem 1rem;
      margin-bottom: 0.25rem;
      color: #666;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .menu-item:hover {
      background: #f0f0f0;
      color: #000;
    }
    
    .menu-item.active {
      color: black;
    }
    
    .main-content {
      margin-left: 250px;
      flex: 1;
      padding: 2rem;
      max-width: calc(100% - 250px);
    }
    
    .menu-toggle {
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
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
        max-width: 100%;
        padding: 1rem;
      }
      
      .menu-toggle {
        display: block;
      }
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
  <button class="menu-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>
  
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>HolyGrail5</h2>
    </div>
    <nav class="sidebar-nav">
      ${menuHTML}
    </nav>
  </aside>
  
  <main class="main-content">
    <div class="header">
      <h1 class="${classNames[0] || 'h2'}">HolyGrail5</h1>
      <p class="text-m">Guía de Tipografía - Framework CSS Generator</p>
      <p class="text-m" style="font-size: 0.75rem; opacity: 0.6; margin-top: 0.5rem;">
        Última actualización: ${new Date().toLocaleString('es-ES')}
      </p>
    </div>

    ${fontFamiliesTableHTML ? `
    <div class="section" id="font-families">
      <h2 class="section-title">Font Families</h2>
      ${fontFamiliesTableHTML}
    </div>
    ` : ''}

    <div class="section" id="tipografia">
      <h2 class="section-title">Clases de Tipografía</h2>
      ${classesHTML}
    </div>

    <div class="section" id="variables">
      <h2 class="section-title">Variables CSS Compartidas</h2>
      ${variablesTableHTML}
    </div>

    ${spacingHelpersTableHTML ? `
    <div class="section" id="spacing">
      <h2 class="section-title">Helpers de Spacing</h2>
      ${spacingHelpersTableHTML}
      <p class="text-m" style="margin-top: 1rem;">
        Clases helper para padding y margin basadas en el spacingMap. 
        Usa las variables CSS definidas en :root.
      </p>
      
      <div class="info-box" style="margin-top: 2rem; padding: 1.5rem; background: #f0f8ff; border-left: 4px solid #0170e9; border-radius: 4px;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 700; color: #0170e9;">Helpers con prefijo md: (Desktop)</h3>
        <p class="text-m" style="margin: 0 0 0.75rem 0; line-height: 1.6;">
          Los helpers con prefijo <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">md:</code> funcionan como en Tailwind CSS y solo se aplican en el breakpoint desktop (≥${configData.breakpoints.desktop}).
        </p>
        <p class="text-m" style="margin: 0 0 0.75rem 0; line-height: 1.6;">
          <strong>Ejemplos de uso:</strong>
        </p>
        <ul style="margin: 0 0 0.75rem 0; padding-left: 1.5rem; line-height: 1.8;">
          <li class="text-m" style="margin-bottom: 0.5rem;">
            <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">.${prefix}-p-4</code> - Aplica padding de 4px en todos los tamaños de pantalla
          </li>
          <li class="text-m" style="margin-bottom: 0.5rem;">
            <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">.md:${prefix}-p-4</code> - Aplica padding de 4px solo en desktop (≥${configData.breakpoints.desktop})
          </li>
          <li class="text-m" style="margin-bottom: 0.5rem;">
            <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">.md:${prefix}-pr-8</code> - Aplica padding-right de 8px solo en desktop
          </li>
          <li class="text-m" style="margin-bottom: 0.5rem;">
            <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">.md:${prefix}-mt-16</code> - Aplica margin-top de 16px solo en desktop
          </li>
          <li class="text-m" style="margin-bottom: 0.5rem;">
            <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">.${prefix}-p-0!</code> - Aplica padding de 0 con !important (útil para sobrescribir otros estilos)
          </li>
        </ul>
        <p class="text-m" style="margin: 0; line-height: 1.6; font-size: 0.875rem; opacity: 0.8;">
          <strong>Nota:</strong> Puedes combinar clases base y con prefijo <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">md:</code> para crear diseños responsive. Por ejemplo: <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">.${prefix}-p-4 .md:${prefix}-p-8</code> aplica 4px en mobile y 8px en desktop. Las clases con <code style="background: #e6f2ff; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.875rem;">!</code> aplican !important y tienen prioridad sobre otras reglas CSS.
        </p>
      </div>
    </div>
    ` : ''}

    <div class="section" id="breakpoints">
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
            <td class="breakpoint-value ${changedValues.has('breakpoints.mobile') ? 'changed' : ''}">
              ${configData.breakpoints.mobile} 
              ${configData.breakpoints.mobile.endsWith('px') ? `(${pxToRem(configData.breakpoints.mobile, baseFontSize)})` : ''}
            </td>
          </tr>
          <tr>
            <td class="breakpoint-name">Desktop</td>
            <td class="breakpoint-value ${changedValues.has('breakpoints.desktop') ? 'changed' : ''}">
              ${configData.breakpoints.desktop} 
              ${configData.breakpoints.desktop.endsWith('px') ? `(${pxToRem(configData.breakpoints.desktop, baseFontSize)})` : ''}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-m" style="margin-top: 1rem;">
        Las clases de tipografía se adaptan automáticamente a cada breakpoint. 
        Resize la ventana del navegador para ver los cambios.
      </p>
    </div>
  </main>
  
  <script>
    // Scroll suave y resaltado de sección activa
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    
    // Manejar clic en menú
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const offset = 80; // Offset para compensar header
          const targetPosition = targetSection.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Cerrar menú en mobile
          if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('open');
          }
        }
      });
    });
    
    // Resaltar sección activa al hacer scroll
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 150;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
              item.classList.add('active');
            }
          });
        }
      });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('load', updateActiveSection);
    
    // Cerrar menú al hacer clic fuera en mobile
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (window.innerWidth <= 768 && 
          sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  </script>
</body>
</html>`;
}

module.exports = {
  generateHTML
};

