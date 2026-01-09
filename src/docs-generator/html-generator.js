// Generador de guía HTML desde JSON
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { pxToRem, remToPx, getFontFamilyName } = require('../generators/utils');
const { buildValueMap } = require('../css-generator');
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
  // Si no hay valores previos, no marca nada como cambiado (primera ejecución o build limpio)
  // Solo se marcarán cambios cuando haya valores previos para comparar
  if (!previousValues) {
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
  // Compara colors
  if (currentValues.colors) {
    const currentColors = currentValues.colors;
    const previousColors = previousValues.colors || {};
    // Compara cada color en el mapa
    Object.keys(currentColors).forEach(colorKey => {
      const currentVal = currentColors[colorKey];
      const previousVal = previousColors[colorKey];
      if (currentVal !== previousVal) {
        changes.add(`colors.${colorKey}`);
      }
    });
    // Detecta colores eliminados
    Object.keys(previousColors).forEach(colorKey => {
      if (!currentColors[colorKey]) {
        changes.add(`colors.${colorKey}`);
      }
    });
  }
  // Compara cada clase
  const currentClasses = currentValues.typo || currentValues;
  const previousClasses = previousValues.typo || previousValues;
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
// Obtiene el autor del último commit de git
function getLastCommitAuthor() {
  try {
    const authorName = execSync('git log -1 --pretty=format:"%an"', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return authorName || null;
  } catch (error) {
    // Si no es un repo git o hay error, devolver null
    return null;
  }
}
// Obtiene la versión del package.json
function getPackageVersion() {
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return packageData.version || null;
    }
  } catch (error) {
    // Si hay error, devolver null
  }
  return null;
}
function generateHTML(configData, previousValuesPath = null) {
  const classNames = Object.keys(configData.typo);
  const prefix = configData.prefix || 'hg';
  const category = configData.category || 'typo';
  const baseFontSize = configData.baseFontSize || 16;
  // Obtener autor del último commit
  const lastCommitAuthor = getLastCommitAuthor();
  // Obtener versión del package.json
  const packageVersion = getPackageVersion();
  // Construir variables CSS primero para poder guardarlas
  const { fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = 
    buildValueMap(configData.typo, configData.fontFamilyMap, prefix, category);
  // Generar variables de spacing
  const { generateSpacingVariables } = require('../css-generator');
  const spacingVars = generateSpacingVariables(configData.spacingMap, prefix, baseFontSize);
  // Generar variables de colores
  const { generateColorVariables } = require('../css-generator');
  const colorVars = generateColorVariables(configData.colors, prefix);
  // Construir array de variables (incluyendo spacing y colores)
  const allVariables = [
    ...Array.from(fontFamilyVars.values()),
    ...Array.from(lineHeightVars.values()),
    ...Array.from(fontWeightVars.values()),
    ...Array.from(letterSpacingVars.values()),
    ...Array.from(textTransformVars.values()),
    ...Array.from(fontSizeVars.values()),
    ...spacingVars,
    ...colorVars
  ].map(item => ({ name: item.varName, value: item.value }));
  // Preparar valores actuales para comparación
  const currentValues = {
    breakpoints: {
      mobile: configData.breakpoints.mobile,
      desktop: configData.breakpoints.desktop
    },
    fontFamilyMap: configData.fontFamilyMap || {},
    spacingMap: configData.spacingMap || {},
    colors: configData.colors || {},
    typo: {},
    variables: {}
  };
  // Guardar variables CSS en currentValues
  allVariables.forEach(variable => {
    currentValues.variables[variable.name] = variable.value;
  });
  classNames.forEach(className => {
    const cls = configData.typo[className];
    currentValues.typo[className] = {
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
  const previousValuesPathDefault = previousValuesPath || path.join(__dirname, '..', '.data', '.previous-values.json');
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
    const cls = configData.typo[className];
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
        <td class="guide-table-name">.${className}</td>
        <td class="guide-preview-cell">
          <div class="guide-typography-preview ${className}">Aa</div>
        </td>
        <td class="guide-table-value ${fontFamilyChanged ? 'guide-changed' : ''}">${fontFamilyName || cls.fontFamily || '-'}</td>
        <td class="guide-table-value ${fontWeightChanged ? 'guide-changed' : ''}">${cls.fontWeight || '-'}</td>
        <td class="guide-table-value ${letterSpacingChanged ? 'guide-changed' : ''}">${cls.letterSpacing || '-'}</td>
        <td class="guide-table-value ${textTransformChanged ? 'guide-changed' : ''}">${cls.textTransform || '-'}</td>
        <td class="guide-mobile-value ${mobileFontSizeChanged ? 'guide-changed' : ''}">${cls.mobile?.fontSize ? pxToRem(cls.mobile.fontSize, baseFontSize) : '-'}</td>
        <td class="guide-mobile-value ${mobileLineHeightChanged ? 'guide-changed' : ''}">${cls.mobile?.lineHeight || '-'}</td>
        <td class="guide-desktop-value ${desktopFontSizeChanged ? 'guide-changed' : ''}">${cls.desktop?.fontSize ? pxToRem(cls.desktop.fontSize, baseFontSize) : '-'}</td>
        <td class="guide-desktop-value ${desktopLineHeightChanged ? 'guide-changed' : ''}">${cls.desktop?.lineHeight || '-'}</td>
      </tr>`;
  }).join('');
  const classesHTML = `
    <div class="guide-table-wrapper">
      <table class="guide-table">
        <thead>
          <tr>
            <th>Clase</th>
            <th>Preview</th>
            <th>Font Family</th>
            <th>Font Weight</th>
            <th>Letter Spacing</th>
            <th>Text Transform</th>
            <th colspan="2" class="guide-mobile-header">Mobile</th>
            <th colspan="2" class="guide-desktop-header">Desktop</th>
          </tr>
          <tr class="guide-sub-header">
            <th colspan="6"></th>
            <th class="guide-mobile-value">Font Size</th>
            <th class="guide-mobile-value">Line Height</th>
            <th class="guide-desktop-value">Font Size</th>
            <th class="guide-desktop-value">Line Height</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>`;
  // Generar tabla de font families
  const fontFamiliesHTML = configData.fontFamilyMap ? Object.entries(configData.fontFamilyMap).map(([name, value]) => {
    const varName = `--${prefix}-${category}-font-family-${name}`;
    const styleValue = value.replace(/'/g, "\\'");
    const isChanged = changedValues.has(`fontFamilyMap.${name}`);
    return `
      <tr>
        <td class="guide-table-name">${name}</td>
        <td class="guide-font-family-preview" style='font-family: ${styleValue};'>Aa</td>
        <td class="guide-table-value ${isChanged ? 'guide-changed' : ''}">${value}</td>
        <td class="guide-table-value">${varName}</td>
      </tr>`;
  }).join('') : '';
  const fontFamiliesTableHTML = configData.fontFamilyMap ? `
    <div class="guide-table-wrapper">
      <table class="guide-table">
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
      </table>
    </div>` : '';
      // Generar tabla de variables
      const variableRows = allVariables.map(variable => {
        const remValue = variable.value.match(/^([\d.]+)rem$/) ? variable.value : '-';
        const pxValue = remValue !== '-' ? remToPx(variable.value, baseFontSize) : '-';
        const isVariableChanged = changedValues.has(`variable.${variable.name}`);
        return `
          <tr>
            <td class="guide-table-name guide-copyable ${isVariableChanged ? 'guide-changed' : ''}" data-copy-value="${variable.name}" title="Click para copiar ${variable.name}">${variable.name}</td>
            <td class="guide-table-value guide-copyable ${isVariableChanged ? 'guide-changed' : ''}" data-copy-value="${variable.value}" title="Click para copiar ${variable.value}">${variable.value}</td>
            <td class="guide-value-center-blue guide-copyable ${isVariableChanged ? 'guide-changed' : ''}" data-copy-value="${remValue}" title="Click para copiar ${remValue}">${remValue}</td>
            <td class="guide-value-center-orange guide-copyable ${isVariableChanged ? 'guide-changed' : ''}" data-copy-value="${pxValue}" title="Click para copiar ${pxValue}">${pxValue}</td>
          </tr>`;
      }).join('');
  const variablesTableHTML = `
    <div class="guide-table-wrapper">
      <table class="guide-table">
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
      </table>
    </div>`;
  // Generar tabla de spacing helpers
  const spacingHelpersHTML = configData.spacingMap ? Object.entries(configData.spacingMap).map(([key, value]) => {
    const hasImportant = configData.spacingImportant && configData.spacingImportant.includes(key);
    const importantLabel = hasImportant ? '<br><strong>Con !important:</strong><br>.*-' + key + '!' : '';
    const varName = `--${prefix}-spacing-${key}`;
    // Si el valor termina en %, no lo convierte a rem
    const remValue = value.endsWith('%') ? value : pxToRem(value, baseFontSize);
    const pxValue = value;
    const isChanged = changedValues.has(`spacingMap.${key}`);
        return `
      <tr>
        <td class="guide-table-name">.*-${key}${importantLabel}</td>
        <td class="guide-table-value ${isChanged ? 'guide-changed' : ''}">${varName}</td>
        <td class="guide-value-center-blue ${isChanged ? 'guide-changed' : ''}">${remValue}</td>
        <td class="guide-value-center-orange ${isChanged ? 'guide-changed' : ''}">${pxValue}</td>
      </tr>`;
  }).join('') : '';
  const spacingHelpersTableHTML = configData.spacingMap ? `
    <div class="guide-table-wrapper">
      <table class="guide-table">
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
      </table>
    </div>` : '';
  // Estilos dinámicos basados en config
  const allStyles = `
    body {
      font-family: var(--${prefix}-${category}-font-family-primary);
    }`;
  // Generar tabla de layout helpers
  const layoutHelpersHTML = configData.helpers ? Object.entries(configData.helpers).flatMap(([helperName, config]) => {
    const { property, class: className, responsive, values, useSpacing, description, explanation } = config;
    const helperDescription = description || explanation || '';
    const prefix = configData.prefix || 'hg';
    const baseFontSize = configData.baseFontSize || 16;
    const rows = [];
    if (useSpacing && configData.spacingMap) {
      Object.entries(configData.spacingMap).forEach(([key, value]) => {
        const baseClass = `.${prefix}-${className}-${key}`;
        const responsiveClass = responsive ? `.md:${prefix}-${className}-${key}` : '';
        const remValue = value.endsWith('%') ? value : pxToRem(value, baseFontSize);
        rows.push(`
      <tr>
        <td class="guide-layout-class-name guide-copyable" data-copy-value="${baseClass}" title="Click para copiar ${baseClass}">${baseClass}</td>
        <td class="guide-layout-class-name ${responsiveClass ? 'guide-copyable' : ''}" ${responsiveClass ? `data-copy-value="${responsiveClass}" title="Click para copiar ${responsiveClass}"` : ''}>${responsiveClass || '-'}</td>
        <td class="guide-layout-property">${property}: ${remValue}</td>
        <td class="guide-layout-property">${helperDescription || '-'}</td>
      </tr>`);
      });
    } else if (values) {
      if (Array.isArray(values)) {
        values.forEach(value => {
          const baseClass = `.${prefix}-${className}-${value}`;
          const responsiveClass = responsive ? `.md:${prefix}-${className}-${value}` : '';
          rows.push(`
      <tr>
        <td class="guide-layout-class-name guide-copyable" data-copy-value="${baseClass}" title="Click para copiar ${baseClass}">${baseClass}</td>
        <td class="guide-layout-class-name ${responsiveClass ? 'guide-copyable' : ''}" ${responsiveClass ? `data-copy-value="${responsiveClass}" title="Click para copiar ${responsiveClass}"` : ''}>${responsiveClass || '-'}</td>
        <td class="guide-layout-property">${property}: ${value}</td>
        <td class="guide-layout-property">${helperDescription || '-'}</td>
      </tr>`);
        });
      } else {
        Object.entries(values).forEach(([key, value]) => {
          const baseClass = `.${prefix}-${className}-${key}`;
          const responsiveClass = responsive ? `.md:${prefix}-${className}-${key}` : '';
          rows.push(`
      <tr>
        <td class="guide-layout-class-name guide-copyable" data-copy-value="${baseClass}" title="Click para copiar ${baseClass}">${baseClass}</td>
        <td class="guide-layout-class-name ${responsiveClass ? 'guide-copyable' : ''}" ${responsiveClass ? `data-copy-value="${responsiveClass}" title="Click para copiar ${responsiveClass}"` : ''}>${responsiveClass || '-'}</td>
        <td class="guide-layout-property">${property}: ${value}</td>
        <td class="guide-layout-property">${helperDescription || '-'}</td>
      </tr>`);
        });
      }
    }
    return rows;
  }).join('') : '';
  const layoutHelpersTableHTML = configData.helpers ? `
    <div class="guide-table-wrapper">
      <table class="guide-table">
        <thead>
          <tr>
            <th>Clases Helper</th>
            <th>Clases Helper (md:)</th>
            <th>Propiedad CSS</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          ${layoutHelpersHTML}
        </tbody>
      </table>
    </div>` : '';
      const colorsGridHTML = configData.colors ? `
        <div class="guide-colors-grid">
          ${Object.entries(configData.colors).map(([key, value]) => {
            const varName = `--${prefix}-color-${key}`;
            const isChanged = changedValues.has(`colors.${key}`);
            const normalizedValue = value.trim().toLowerCase();
            const isLight = normalizedValue === '#ffffff' || normalizedValue === '#f0f0f0' || normalizedValue === '#f4f2ed' || normalizedValue === '#e3e3e3';
            // Asegurar que el valor del color sea opaco (sin alfa)
            const opaqueValue = normalizedValue.length === 7 ? normalizedValue : (normalizedValue.length === 9 ? normalizedValue.substring(0, 7) : normalizedValue);
            return `
          <div class="guide-color-card" data-copy-value="${varName}" title="Click para copiar ${varName}">
            <div class="guide-color-preview" style="--color-value: ${opaqueValue};">
              ${isLight ? `<div class="guide-color-pattern"></div>` : ''}
            </div>
            <div class="guide-color-card-content">
              <div class="guide-color-name">${key}</div>
              <div class="guide-color-var-name" data-copy-value="${varName}" title="Click para copiar ${varName}">${varName}</div>
              <div class="guide-color-value ${isChanged ? 'guide-changed' : ''}" data-copy-value="${value}" title="Click para copiar ${value}">${value}</div>
            </div>
          </div>`;
          }).join('')}
        </div>` : '';
      // Construir menú lateral
      const menuItems = [];
      if (colorsGridHTML) {
        menuItems.push({ id: 'colors', label: 'Colores' });
      }
      if (fontFamiliesTableHTML) {
        menuItems.push({ id: 'font-families', label: 'Font Families' });
      }
      menuItems.push(
        { id: 'tipografia', label: 'Tipografía' },
        { id: 'variables', label: 'Variables CSS' }
      );
      if (spacingHelpersTableHTML) {
        menuItems.push({ id: 'spacing', label: 'Spacing' });
      }
      if (layoutHelpersTableHTML) {
        menuItems.push({ id: 'layout', label: 'Helpers de Layout' });
      }
      if (configData.grid && configData.grid.enabled) {
        menuItems.push({ id: 'grid', label: 'Grid System' });
      }
      if (configData.aspectRatios) {
        menuItems.push({ id: 'ratios', label: 'Ratios de Aspecto' });
      }
      menuItems.push({ id: 'breakpoints', label: 'Breakpoints' });
      const menuHTML = menuItems.map(item => `
        <a href="#${item.id}" class="guide-menu-item" data-section="${item.id}">${item.label}</a>
      `).join('');
      // Añadir enlace al demo del tema si está habilitado
      const themeDemoLink = (configData.theme && configData.theme.enabled && configData.theme.name) 
        ? `
      <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ddd;">
        <a href="themes/${configData.theme.name}-demo.html" class="guide-menu-item" style="color: #000000; font-weight: 600;"> Tema ${configData.theme.name.charAt(0).toUpperCase() + configData.theme.name.slice(1)}</a>
      `
        : '';
      return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>HolyGrail5 - Guía de Tipografía</title>
  <!-- Google Fonts - Solo para la guía -->
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Instrument+Sans:regular,500,600,700" media="all">
  <!-- Lenis Smooth Scroll - Solo para la guía -->
  <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js"></script>
  <link rel="stylesheet" href="output.css?v=${Date.now()}">
  <link rel="stylesheet" href="guide-styles.css?v=${Date.now()}">
  <style>
    ${allStyles}
    /* Lenis Smooth Scroll Styles - Solo para la guía */
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
    /* Google Fonts - Solo para la guía (sobrescribe la fuente del body) */
    body {
      font-family: 'Instrument Sans', sans-serif !important;
    }
  </style>
</head>
<body>
  <div class="guide-sidebar-overlay" onclick="toggleSidebar()"></div>
  <aside class="guide-sidebar">
    <nav class="guide-sidebar-nav">
      ${menuHTML}
      ${themeDemoLink}
    </nav>
    <div class="guide-sidebar-footer">
      <div class="guide-sidebar-badges">
        <a href="https://www.npmjs.com/package/holygrail5" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/npm/v/holygrail5.svg" alt="npm version" />
        </a>
      </div>
               <p class="text-m guide-sidebar-meta">
          last update: ${new Date().toLocaleString('es-ES')}
        </p>
      ${packageVersion ? `
        <p class="text-m guide-sidebar-meta-small">
          Version: ${packageVersion}
        </p>
      ` : ''}
      ${lastCommitAuthor ? `
        <p class="text-s guide-sidebar-meta-small">
          Last user: ${lastCommitAuthor}
        </p>
      ` : ''}
    </div>
  </aside>
      <div class="guide-header">
    <div class="guide-logo">
    Holygrail 5
    </div>
    <div style="display: flex; align-items: center; gap: 1rem;">
       <div id="search-results" class="guide-search-results"></div>
      <div class="guide-search-container">
        <input 
          type="text" 
          id="search-input" 
          class="guide-search-input"
          placeholder="Buscar clases, variables, helpers..." 
          autocomplete="off"
        />
        <svg 
          class="guide-search-icon"
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <button 
          id="clear-search" 
          class="guide-clear-search-btn"
          title="Limpiar búsqueda"
        >×</button>
      </div>
      <button class="guide-header-button" onclick="toggleSidebar()">☰</button>
    </div>
    </div>
  <main class="guide-main-content">
<div class="guide-container">
    <div class="guide-section guide-section--highlighted" id="inicio">
      <div class="guide-section-title">
    <div>
<div class="guide-logo">
 <a href="themes/dutti-demo.html">Dutti theme</a>
    </div>
    </div>
        <p class="text-m guide-section-description">
       Holygrail Design System redujo el tiempo de diseño en un 73% y permitió una renovación del producto 3.75 veces más rápida.
        </p>
      </div>
      <div class="guide-section-content">

      </div>
    </div>
<div class="case-study-img-holygrail h-100vh" id="dutti-theme">

    </div>
    ${colorsGridHTML ? `
    <div class="guide-section guide-section--highlighted" id="colors">
          <h2 >Colores</h2>
      <div class="guide-section-title">
      <div> </div>
        <p class="text-m guide-section-description">
        Paleta de colores disponibles con sus variables CSS.
        </p>
      </div>
      <div class="guide-section-content">
        ${colorsGridHTML}
      </div>
    </div>
    ` : ''}
    ${fontFamiliesTableHTML ? `
    <div class="guide-section" id="font-families">
          <h2 >Typography</h2>
      <div class="guide-section-title">
      <div> </div>
        <p class="text-m guide-section-description">
        Font families disponibles para la tipografía.
        </p>
      </div>
      <div class="guide-section-content">
 
        <div class="guide-typeface-specimen">
          <div class="guide-typeface-left">
            <div class="guide-typeface-large-aa" style="font-family: var(--${prefix}-${category}-font-family-primary);">Aa</div>
            <div class="guide-typeface-info">
              <div class="guide-typeface-info-item">
                <div class="guide-typeface-label">FAMILY</div>
                <div class="guide-typeface-value">Suisse</div>
              </div>
              <div class="guide-typeface-info-item">
                <div class="guide-typeface-label">WEIGHT</div>
                <div class="guide-typeface-value">Regular, Medium, Semibold</div>
              </div>
            </div>
          </div>
          <div class="guide-typeface-right" style="font-family: var(--${prefix}-${category}-font-family-primary);">
            <div class="guide-typeface-chars">${'a b c d e f g h i j k l m'.split(' ').map(char => `<div class="guide-typeface-char">${char}</div>`).join('')}</div>
            <div class="guide-typeface-chars">${'n o p q r s t u v w x y z'.split(' ').map(char => `<div class="guide-typeface-char">${char}</div>`).join('')}</div>
            <div class="guide-typeface-chars">${'A B C D E F G H I J K L M'.split(' ').map(char => `<div class="guide-typeface-char">${char}</div>`).join('')}</div>
            <div class="guide-typeface-chars">${'N O P Q R S T U V W X Y Z'.split(' ').map(char => `<div class="guide-typeface-char">${char}</div>`).join('')}</div>
            <div class="guide-typeface-chars">${'0 1 2 3 4 5 6 7 8 9 ! " #'.split(' ').map(char => `<div class="guide-typeface-char">${char}</div>`).join('')}</div>
            <div class="guide-typeface-chars">${'$ % & \' ( ) * + . - , / ='.split(' ').map(char => `<div class="guide-typeface-char">${char}</div>`).join('')}</div>
          </div>
        </div>
        ${fontFamiliesTableHTML}
      </div>
    </div>
    ` : ''}
    <div class="guide-section" id="tipografia">
          <h2 >Hierarchy</h2>
      <div class="guide-section-title">
      <div> </div>
        <p class="text-m guide-section-description">
        Clases de tipografía disponibles.
        </p>
      </div>
      <div class="guide-section-content">
        ${classesHTML}
      </div>
    </div>
    <div class="guide-section" id="variables">
          <h2 >Variables</h2>
      <div class="guide-section-title">
      <div> </div>
        <p class="text-m guide-section-description">
        Variables CSS compartidas.
        </p>
      </div>
      <div class="guide-section-content">
        ${variablesTableHTML}
      </div>
    </div>
    ${spacingHelpersTableHTML ? `
    <div class="guide-section" id="spacing">
          <h2 >Spacing</h2>
      <div class="guide-section-title">
      <div>     <img src="src/margen.webp" alt="Spacing Diagram" class="guide-spacing-diagram-img"></div>
            <p class="text-m guide-section-description">
        Clases helper para padding y margin basadas en el spacingMap.
        Usa las variables CSS definidas en :root.
            </p>
      </div>
      <div class="guide-section-content">
        <div class="guide-info-box guide-info-box-warning hg-d-flex">
            <div class="demo-section-2">
            <div>
             <div class=""> <strong>¿Cómo se generan los helpers de espaciado?</strong></div>
            <ul class="guide-info-box-list">
              <li class="text-m guide-info-box-list-item">
                <strong>Primera letra:</strong> tipo de spacing → <code class="guide-info-box-code">p</code> (padding) o <code class="guide-info-box-code">m</code> (margin)
              </li>
              <li class="text-m guide-info-box-list-item">
                <strong>Segunda letra:</strong> dirección → <code class="guide-info-box-code">t</code> (top), <code class="guide-info-box-code">r</code> (right/end), <code class="guide-info-box-code">b</code> (bottom), <code class="guide-info-box-code">l</code> (left/start)
              </li>
              <li class="text-m guide-info-box-list-item">
                <strong>Guión + valor:</strong> el valor del spacing → <code class="guide-info-box-code">-4</code>, <code class="guide-info-box-code">-16</code>, <code class="guide-info-box-code">-50-percent</code>
              </li>
             </ul>
             </div>
                      <p class="text-m guide-info-box-text">
              <strong>Ejemplos:</strong> <code class="guide-info-box-code">.p-16</code> (padding all), <code class="guide-info-box-code">.pt-8</code> (padding-top), <code class="guide-info-box-code">.mr-4</code> (margin-right), <code class="guide-info-box-code">.mb-0</code> (margin-bottom)
                        </p>
<div>


          </div>
      
            </div>
        </div>
        ${spacingHelpersTableHTML}
        <div class="guide-section-title">
          <div> </div>
          <div class="demo-section-2">
            <div>
  <strong class="mb-16">¿Cómo se funcionan los helpers de espaciado?</strong>

              <p class="text-m guide-info-box-text">
                Los helpers con prefijo <code class="guide-info-box-code-info">md:</code> funcionan como en Tailwind CSS y solo se aplican en el breakpoint desktop (≥${configData.breakpoints.desktop}).
              </p>
              <p class="text-m guide-info-box-text-small">
                <strong>Nota:</strong> Puedes combinar clases base y con prefijo <code class="guide-info-box-code-info">md:</code> para crear diseños responsive. Por ejemplo: <code class="guide-info-box-code-info">.p-4 .md:p-8</code> aplica 4px en mobile y 8px en desktop. Las clases con <code class="guide-info-box-code-info">!</code> aplican !important y tienen prioridad sobre otras reglas CSS.
              </p>
            </div>
            <div>
              <strong>Ejemplos de uso:</strong>
              <ul class="guide-info-box-list">
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.p-4</code> - Aplica padding de 4px en todos los tamaños de pantalla
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.md:p-4</code> - Aplica padding de 4px solo en desktop (≥${configData.breakpoints.desktop})
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.md:pr-8</code> - Aplica padding-right de 8px solo en desktop
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.md:mt-16</code> - Aplica margin-top de 16px solo en desktop
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.p-0!</code> - Aplica padding de 0 con !important (útil para sobrescribir otros estilos)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    ` : ''}
    ${layoutHelpersTableHTML ? `
    <div class="guide-section" id="layout">
          <h2 >Layout</h2>
      <div class="guide-section-title">
      <div> </div>
        <p class="text-m guide-section-description">
        Clases helper para display, flexbox, alignment y gap. 
        Todos los helpers marcados como responsive tienen variantes con prefijo .md: para desktop (≥${configData.breakpoints.desktop}).
        </p>
      </div>
      <div class="guide-section-content">
        ${layoutHelpersTableHTML}
        <div class="guide-section-title">
          <div> </div>
          <div class="demo-section-2">
            <div>
              <strong>Ejemplos de uso:</strong>
              <ul class="guide-info-box-list">
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.d-flex</code> - Display flex
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.flex-column</code> - Flex direction column
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.justify-center</code> - Justify content center
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.items-center</code> - Align items center
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.gap-16</code> - Gap de 16px (1rem)
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.md:flex-row</code> - Flex direction row solo en desktop
                </li>
              </ul>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ` : ''}
    ${configData.grid && configData.grid.enabled ? `
    <div class="guide-section" id="grid">
          <h2>Grid </h2>

   <div class="guide-section-title">
      <p class="text-m guide-section-description">
          Sistema de grid responsive estilo Bootstrap con 12 columnas (xs, sm, md, lg) y 24 columnas (xl).
        </p>
        </div>

      <div class="guide-section-title">
      <div> </div>
  
        <div class="demo-section-2">
        <div>

  <p>El grid system utiliza flexbox y un sistema de 12 columnas para breakpoints xs, sm, md, lg, y 24 columnas para xl.</p>
              <p class="text-m guide-info-box-text">
        
          </p>
         
          </div>
          <div> <strong>¿Cómo funciona el Grid?</strong> 
          <br>
           <ul class="guide-info-box-list">
            <li class="text-m guide-info-box-list-item">
              <strong>.row</strong> - Contenedor flex con márgenes negativos para compensar el gutter
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.col-xs-*</strong> - Columnas para pantallas desde ${configData.grid.breakpoints.xs} (12 columnas)
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.col-sm-*</strong> - Columnas para pantallas desde ${configData.grid.breakpoints.sm} (12 columnas)
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.col-md-*</strong> - Columnas para pantallas desde ${configData.grid.breakpoints.md} (12 columnas)
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.col-lg-*</strong> - Columnas para pantallas desde ${configData.grid.breakpoints.lg} (12 columnas)
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.col-xl-*</strong> - Columnas para pantallas desde ${configData.grid.breakpoints.xl} (24 columnas)
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.bleed</strong> - Permite que las columnas vayan a sangre (full bleed), eliminando los márgenes laterales del gutter
            </li>
            <li class="text-m guide-info-box-list-item">
              <strong>.bleed-0</strong> - Elimina completamente el padding y márgenes, útil para contenido que debe ocupar todo el ancho sin espacios
            </li>

            <li class="text-m guide-info-box-list-item">
              <strong>Gutter:</strong> ${configData.grid.gutter} (padding horizontal en cada columna)
            </li>
          </ul>

          
          </div>
        
        </div>
      </div>
      <div >
        <div class="guide-table-wrapper">
          <table class="guide-table">
            <thead>
              <tr>
                <th>Breakpoint</th>
                <th>Min-width</th>
                <th>Min-width (rem)</th>
                <th>Columnas</th>
                <th>Clases</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(configData.grid.breakpoints).map(([name, config]) => {
                const minWidth = config.minWidth || config;
                const columns = config.columns || 12;
                const remValue = minWidth.endsWith('px') ? pxToRem(minWidth, baseFontSize) : '-';
                return `<tr>
                <td class="guide-table-name">${name}</td>
                <td class="guide-table-value">${minWidth}</td>
                <td class="guide-table-value">${remValue}</td>
                <td class="guide-table-value">${columns}</td>
                <td class="guide-table-value">.col-${name}-1 a .col-${name}-${columns}</td>
              </tr>`;
              }).join('\n              ')}
            </tbody>
          </table>
        </div>


        
        <div class="guide-section-title">
          <div> </div>
          <div class="demo-section-2">
            <div>
              <p class="guide-info-box-text mb-64">
                <strong>Columnas normales:</strong>
              </p>
              <pre class="guide-code-example"><code>&lt;div class="row"&gt;
  &lt;div class="col-xs-12 col-md-6 col-lg-4"&gt;
    Columna 1
  &lt;/div&gt;
  &lt;div class="col-xs-12 col-md-6 col-lg-4"&gt;
    Columna 2
  &lt;/div&gt;
  &lt;div class="col-xs-12 col-md-12 col-lg-4"&gt;
    Columna 3
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
              <p class="text-m guide-info-box-text">
                Este ejemplo muestra 3 columnas que:
              </p>
              <ul class="guide-info-box-list">
                <li class="text-m guide-info-box-list-item">
                  En <strong>xs</strong>: Ocupan 12 columnas cada una (100% de ancho, apiladas)
                </li>
                <li class="text-m guide-info-box-list-item">
                  En <strong>md</strong> (≥${configData.grid.breakpoints.md}): Las dos primeras ocupan 6 columnas (50% cada una), la tercera 12 (100%)
                </li>
                <li class="text-m guide-info-box-list-item">
                  En <strong>lg</strong> (≥${configData.grid.breakpoints.lg}): Cada una ocupa 4 columnas (33.33% cada una, 3 columnas por fila)
                </li>
              </ul>
            </div>
            <div>
              <strong>Columnas a sangre (Bleed)</strong>
              <br>
              <p class="text-m guide-info-box-text">
                Cuando necesitas que las columnas vayan a sangre (full bleed), eliminando los márgenes laterales del gutter, usa la clase <code class="guide-info-box-code-info">.bleed</code>:
              </p>
              <pre class="guide-code-example"><code>&lt;div class="row"&gt;
  &lt;div class="col-xs-12 bleed"&gt;
    Contenido que va a sangre (sin márgenes laterales)
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
              <p class="text-m guide-info-box-text">
                Para eliminar completamente el padding y márgenes, usa <code class="guide-info-box-code-info">.bleed-0</code>:
              </p>
              <pre class="guide-code-example"><code>&lt;div class="bleed-0"&gt;
  &lt;div class="row"&gt;
    &lt;div class="col-xs-12"&gt;
      Contenido sin padding ni márgenes
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
              <p class="text-m guide-info-box-text-small">
                <strong>Nota:</strong> <code class="guide-info-box-code-info">.bleed</code> aplica márgenes negativos iguales al gutter (${configData.grid.gutter}) para que el contenido llegue hasta los bordes. <code class="guide-info-box-code-info">.bleed-0</code> elimina todo el padding y márgenes, útil para imágenes o contenido que debe ocupar todo el ancho disponible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    ` : ''}
    ${configData.aspectRatios ? `
    <div class="guide-section" id="ratios">
          <h2>Ratios de Aspecto</h2>
      <div class="guide-section-title">
      <div> </div>
        <p class="text-m guide-section-description">
          Clases para controlar el ratio de aspecto de los elementos. Útil para imágenes, videos y contenedores.
        </p>
      </div>
      <div class="guide-section-content">
        <div class="guide-table-wrapper">
          <table class="guide-table">
            <thead>
              <tr>
                <th>Clase</th>
                <th>Ratio</th>
                <th>Descripción</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              ${configData.aspectRatios.map(ratio => {
                const { class: className, width, height, description } = ratio;
                const ratioValue = className === 'aspect-full' ? 'auto' : `${width}:${height}`;
                return `<tr>
                <td class="guide-table-name">.${prefix}-${className}</td>
                <td class="guide-table-value">${ratioValue}</td>
                <td class="guide-table-description">${description}</td>
                <td class="guide-preview-cell">
                  <div class="${prefix}-${className}" style="background: var(--${prefix}-color-primary); max-width: 100px; ${className === 'aspect-full' ? 'height: 50px;' : ''}"></div>
                </td>
              </tr>`;
              }).join('\n              ')}
            </tbody>
          </table>
        </div>
        
        <div class="guide-section-title">
          <div> </div>
          <div class="demo-section-2">
            <div>
              <p class="guide-info-box-text mb-64">
                <strong>Ejemplo de uso básico:</strong>
              </p>
              <pre class="guide-code-example"><code>&lt;div class="${prefix}-aspect-16-9"&gt;
  &lt;div class="rat-content"&gt;
    &lt;img src="imagen.jpg" alt="Imagen" /&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
              <p class="text-m guide-info-box-text">
                La clase <code>.rat-content</code> posiciona el contenido absolutamente dentro del ratio. 
                Este ejemplo mantiene el ratio 16:9 independientemente del tamaño del contenedor.
              </p>
            </div>
            <div>
              <strong>Ratios comunes:</strong>
              <br>
              <ul class="guide-info-box-list">
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.${prefix}-aspect-1-1</code> - Cuadrado perfecto (1:1)
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.${prefix}-aspect-16-9</code> - Widescreen estándar (16:9)
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.${prefix}-aspect-4-3</code> - Formato tradicional (4:3)
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.${prefix}-aspect-9-20</code> - Vertical móvil (9:20)
                </li>
                <li class="text-m guide-info-box-list-item">
                  <code class="guide-info-box-code-info">.${prefix}-aspect-full</code> - Sin ratio fijo, altura automática
                </li>
              </ul>
              <p class="text-m guide-info-box-text-small mt-64">
                <strong>Nota:</strong> Los ratios usan la propiedad <code>aspect-ratio</code> nativa de CSS con fallback para navegadores antiguos. 
                Usa la clase <code>.rat-content</code> para posicionar el contenido dentro del ratio con <code>position: absolute; inset: 0;</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    ` : ''}
    <div class="guide-section" id="breakpoints">
          <h2 >Breakpoints</h2>
      <div class="guide-section-title">
      <div> </div>
            <p class="text-m guide-section-description">
          Las clases de tipografía se adaptan automáticamente a cada breakpoint. 
          Resize la ventana del navegador para ver los cambios.
        </p>
      </div>
      <div class="guide-section-content">
        <div class="guide-table-wrapper">
          <table class="guide-table">
            <thead>
              <tr>
                <th>Breakpoint</th>
                <th>Min-width</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="guide-table-name">Mobile</td>
                <td class="guide-table-value ${changedValues.has('breakpoints.mobile') ? 'guide-changed' : ''}">
                  ${configData.breakpoints.mobile} 
                  ${configData.breakpoints.mobile.endsWith('px') ? `(${pxToRem(configData.breakpoints.mobile, baseFontSize)})` : ''}
                </td>
              </tr>
              <tr>
                <td class="guide-table-name">Desktop</td>
                <td class="guide-table-value ${changedValues.has('breakpoints.desktop') ? 'guide-changed' : ''}">
                  ${configData.breakpoints.desktop} 
                  ${configData.breakpoints.desktop.endsWith('px') ? `(${pxToRem(configData.breakpoints.desktop, baseFontSize)})` : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </div>
  </main>
  <script>
    // Scroll suave y resaltado de sección activa
    const menuItems = document.querySelectorAll('.guide-menu-item');
    const sections = document.querySelectorAll('.guide-section');
    // Funciones para abrir/cerrar sidebar
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
    // Manejar clic en menú
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('data-section');
        // Si no tiene data-section, es un enlace externo, permitir navegación normal
        if (!targetId) {
          return;
        }
        e.preventDefault();
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const offset = 80; // Offset para compensar header
          const targetPosition = targetSection.offsetTop - offset;
          // Usar Lenis si está disponible, sino usar scroll nativo
          if (window.lenis) {
            window.lenis.scrollTo(targetSection, { offset: -offset });
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
          // Cerrar sidebar después de hacer clic
          closeSidebar();
        }
      });
    });
    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');
    let searchTimeout;
    // Función para resaltar texto
    function highlightText(text, searchTerm) {
      if (!searchTerm) return text;
      const escapedTerm = searchTerm.replace(/[.*+?^$()|[\]\\]/g, '\\\\$&');
      const escapedTerm2 = escapedTerm.replace(/{/g, '\\\\{').replace(/}/g, '\\\\}');
      const regex = new RegExp('(' + escapedTerm2 + ')', 'gi');
      return text.replace(regex, '<mark class="guide-search-highlight">$1</mark>');
    }
    // Función para buscar en tablas y grids
    function searchInTables(searchTerm) {
      if (!searchTerm || searchTerm.trim() === '') {
        // Mostrar todo
        document.querySelectorAll('.guide-section, .guide-table tbody tr, .spacing-helpers-table tbody tr, [style*="grid-template-columns"] > div').forEach(el => {
          el.style.display = '';
        });
        document.querySelectorAll('mark').forEach(mark => {
          const parent = mark.parentNode;
          parent.replaceChild(document.createTextNode(mark.textContent), mark);
          parent.normalize();
        });
        searchResults.style.display = 'none';
        clearSearchBtn.style.display = 'none';
        return;
      }
      const term = searchTerm.toLowerCase().trim();
      let matchCount = 0;
      const matchedSections = new Set();
      // Buscar en todas las tablas
      document.querySelectorAll('.guide-table tbody tr, .spacing-helpers-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        const cells = row.querySelectorAll('td');
        if (text.includes(term)) {
          row.style.display = '';
          matchCount++;
          // Resaltar texto en las celdas
          cells.forEach(cell => {
            const originalText = cell.textContent;
            cell.innerHTML = highlightText(originalText, term);
          });
          // Encontrar la sección padre
          let section = row.closest('.guide-section');
          if (section) {
            matchedSections.add(section.id);
          }
        } else {
          row.style.display = 'none';
        }
      });
      // Buscar en grid de colores
      document.querySelectorAll('[style*="grid-template-columns"] > div').forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = '';
          matchCount++;
          // Resaltar texto en la tarjeta
          const textElements = card.querySelectorAll('div');
          textElements.forEach(el => {
            if (el.textContent && !el.style.background) {
              const originalText = el.textContent;
              el.innerHTML = highlightText(originalText, term);
            }
          });
          // Encontrar la sección padre
          let section = card.closest('.guide-section');
          if (section) {
            matchedSections.add(section.id);
          }
        } else {
          card.style.display = 'none';
        }
      });
      // Mostrar/ocultar secciones según si tienen resultados
      document.querySelectorAll('.guide-section').forEach(section => {
        const hasVisibleRows = section.querySelector('tbody tr[style=""]') || 
                              section.querySelector('tbody tr:not([style*="display: none"])') ||
                              section.querySelector('[style*="grid-template-columns"] > div[style=""]') ||
                              section.querySelector('[style*="grid-template-columns"] > div:not([style*="display: none"])');
        if (matchedSections.has(section.id) || hasVisibleRows) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });
      // Mostrar contador de resultados
      if (matchCount > 0) {
        searchResults.textContent = 'Se encontraron ' + matchCount + ' resultado' + (matchCount !== 1 ? 's' : '');
        searchResults.style.display = 'block';
      } else {
        searchResults.textContent = 'No se encontraron resultados';
        searchResults.style.display = 'block';
      }
      clearSearchBtn.style.display = 'block';
    }
    // Event listeners para búsqueda
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchInTables(e.target.value);
      }, 200);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchInTables('');
      }
    });
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInTables('');
      searchInput.focus();
    });
    // El estilo de focus ya está en CSS (.search-input:focus)
    // Resaltar sección activa al hacer scroll
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 200;
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
      const sidebar = document.querySelector('.guide-sidebar');
      const menuToggle = document.querySelector('.guide-menu-toggle');
      if (window.innerWidth <= 768 && 
          sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
    // Funcionalidad para copiar al portapapeles
    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(() => true);
      } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return Promise.resolve(true);
        } catch (err) {
          document.body.removeChild(textArea);
          return Promise.resolve(false);
        }
      }
    }
    function showCopyFeedback(element) {
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = '#d4edda';
      element.style.transition = 'background-color 0.3s';
      setTimeout(() => {
        element.style.backgroundColor = originalBg || '';
        setTimeout(() => {
          element.style.transition = '';
        }, 300);
      }, 500);
    }
    // Funcionalidad para copiar al portapapeles - se ejecuta cuando el DOM está listo
    function setupCopyToClipboard() {
      // Manejar clics en colores
      document.querySelectorAll('.guide-color-card, .guide-color-var-name, .guide-color-value').forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          const copyValue = element.getAttribute('data-copy-value');
          if (copyValue) {
            copyToClipboard(copyValue).then(success => {
              if (success) {
                showCopyFeedback(element);
                // Si es la tarjeta completa, buscar el elemento más visible para el feedback
                if (element.classList.contains('guide-color-card')) {
                  const varNameEl = element.querySelector('.guide-color-var-name');
                  if (varNameEl) showCopyFeedback(varNameEl);
                }
              }
            });
          }
        });
      });
      // Manejar clics en variables
      document.querySelectorAll('.guide-copyable').forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          const copyValue = element.getAttribute('data-copy-value');
          if (copyValue && copyValue !== '-') {
            copyToClipboard(copyValue).then(success => {
              if (success) {
                showCopyFeedback(element);
              }
            });
          }
        });
      });
    }
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupCopyToClipboard);
    } else {
      setupCopyToClipboard();
    }
  </script>
  <script>
    // Inicializar Lenis Smooth Scroll - Solo para la guía
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
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    // Integrar con el scroll del navegador
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Puedes agregar callbacks aquí si es necesario
    });
    // Hacer lenis disponible globalmente para el scroll del menú
    window.lenis = lenis;
  </script>
</body>
</html>`;
}
module.exports = {
  generateHTML
};
