// Parseador JSON a CSS
// Convierte la configuración JSON en CSS con variables compartidas y clases responsive

const fs = require('fs');
const path = require('path');
const { toKebabCase, pxToRem, getFontFamilyName } = require('./utils');
const { BREAKPOINTS } = require('./config');

// Lista de propiedades de tipografía que se procesan
const PROPERTIES = ['fontFamily', 'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing', 'textTransform'];

// Genera el nombre de variable CSS para una fuente
// Usa el nombre de la fuente (como "primary" o "secondary") para crear la variable
function getFontFamilyVarName(fontFamilyName, prefix, category) {
  return `--${prefix}-${category}-font-family-${fontFamilyName}`;
}

// Genera el nombre de variable CSS para line-height
// Convierte el valor numérico a un formato válido para nombres de variables
function getLineHeightVarName(lineHeightValue, prefix, category) {
  return `--${prefix}-${category}-line-height-${lineHeightValue.toString().replace('.', '-')}`;
}

// Genera el nombre de variable CSS compartida para cualquier propiedad
// Convierte el nombre de la propiedad a kebab-case y el valor a un formato válido
// Para fontSize y letterSpacing, limpia las unidades (px, rem) y puntos
function getSharedVarName(prop, value, prefix, category) {
  const propName = toKebabCase(prop);
  let name = value.toString();
  
  if (prop === 'fontSize') {
    name = name.endsWith('px') ? name.replace('px', '').replace('.', '-') : name.replace(/rem/g, '').replace('.', '-');
  } else if (prop === 'letterSpacing') {
    name = name.replace(/rem/g, '').replace('.', '-');
  }
  
  return `--${prefix}-${category}-${propName}-${name}`;
}

// Carga las variables CSS históricas guardadas previamente
// Esto asegura que las variables nunca se eliminen aunque se borren las clases que las usaban
function loadHistoricalVariables(historicalVarsPath) {
  try {
    if (fs.existsSync(historicalVarsPath)) {
      const content = fs.readFileSync(historicalVarsPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // Si no existe o hay error, devuelve objeto vacío
  }
  return {
    fontFamilyVars: {},
    lineHeightVars: {},
    fontWeightVars: {},
    letterSpacingVars: {},
    textTransformVars: {},
    fontSizeVars: {}
  };
}

// Guarda las variables CSS actuales para mantenerlas en el futuro
// Esto asegura que las variables nunca se eliminen aunque se borren las clases
function saveHistoricalVariables(variables, historicalVarsPath) {
  try {
    const dir = path.dirname(historicalVarsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Convertir Maps a objetos para guardar en JSON
    const varsToSave = {
      fontFamilyVars: {},
      lineHeightVars: {},
      fontWeightVars: {},
      letterSpacingVars: {},
      textTransformVars: {},
      fontSizeVars: {}
    };
    
    // Convertir cada Map a objeto
    variables.fontFamilyVars.forEach((value, key) => {
      varsToSave.fontFamilyVars[key] = value;
    });
    variables.lineHeightVars.forEach((value, key) => {
      varsToSave.lineHeightVars[key] = value;
    });
    variables.fontWeightVars.forEach((value, key) => {
      varsToSave.fontWeightVars[key] = value;
    });
    variables.letterSpacingVars.forEach((value, key) => {
      varsToSave.letterSpacingVars[key] = value;
    });
    variables.textTransformVars.forEach((value, key) => {
      varsToSave.textTransformVars[key] = value;
    });
    variables.fontSizeVars.forEach((value, key) => {
      varsToSave.fontSizeVars[key] = value;
    });
    
    fs.writeFileSync(historicalVarsPath, JSON.stringify(varsToSave, null, 2), 'utf8');
  } catch (error) {
    console.warn('⚠️  No se pudo guardar las variables históricas:', error.message);
  }
}

// Construye un mapa de todas las variables CSS compartidas y sus valores
// Recorre todas las clases y agrupa valores únicos para crear variables compartidas
// Esto evita duplicar variables cuando varias clases usan el mismo valor
// También carga variables históricas para que nunca se eliminen
function buildValueMap(classes, fontFamilyMap, prefix, category, historicalVarsPath = null) {
  // Cargar variables históricas si existe el archivo
  const historicalVarsPathDefault = historicalVarsPath || path.join(__dirname, '..', '.historical-variables.json');
  const historicalVars = loadHistoricalVariables(historicalVarsPathDefault);
  
  // Inicializar Maps con variables históricas
  const fontFamilyVars = new Map(Object.entries(historicalVars.fontFamilyVars || {}));
  const lineHeightVars = new Map(Object.entries(historicalVars.lineHeightVars || {}));
  const fontWeightVars = new Map(Object.entries(historicalVars.fontWeightVars || {}));
  const letterSpacingVars = new Map(Object.entries(historicalVars.letterSpacingVars || {}));
  const textTransformVars = new Map(Object.entries(historicalVars.textTransformVars || {}));
  const fontSizeVars = new Map(Object.entries(historicalVars.fontSizeVars || {}));
  
  const valueMap = {};
  
  Object.entries(classes).forEach(([className, cls]) => {
    valueMap[className] = {};
    
    // Procesa la fuente de la clase
    // Si la fuente ya existe en el mapa, reutiliza la variable
    if (cls.fontFamily !== undefined) {
      const fontFamilyName = getFontFamilyName(cls.fontFamily, fontFamilyMap);
      const varName = getFontFamilyVarName(fontFamilyName, prefix, category);
      if (!fontFamilyVars.has(cls.fontFamily)) {
        fontFamilyVars.set(cls.fontFamily, { varName, value: cls.fontFamily, name: fontFamilyName });
      }
      valueMap[className].fontFamily = {
        varName: fontFamilyVars.get(cls.fontFamily).varName,
        value: cls.fontFamily
      };
    }
    
    // Procesa propiedades base que se comparten entre breakpoints
    // Estas propiedades no cambian entre mobile y desktop
    ['fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
      if (cls[prop] !== undefined) {
        const varName = getSharedVarName(prop, cls[prop], prefix, category);
        const varMap = prop === 'fontWeight' ? fontWeightVars : prop === 'letterSpacing' ? letterSpacingVars : textTransformVars;
        
        // Solo crea la variable si no existe ya
        if (!varMap.has(cls[prop])) {
          varMap.set(cls[prop], { varName, value: cls[prop] });
        }
        valueMap[className][prop] = {
          varName: varMap.get(cls[prop]).varName,
          value: cls[prop]
        };
      }
    });
    
    // Procesa propiedades que cambian según el breakpoint
    // fontSize y lineHeight pueden ser diferentes en mobile y desktop
    BREAKPOINTS.forEach(bp => {
      if (cls[bp]) {
        if (cls[bp].fontSize !== undefined) {
          const fontSizeValue = cls[bp].fontSize;
          const fontSizeRem = pxToRem(fontSizeValue);
          const varName = getSharedVarName('fontSize', fontSizeValue, prefix, category);
          
          // Solo crea la variable si no existe ya
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
          const varName = getLineHeightVarName(lineHeightValue, prefix, category);
          
          // Solo crea la variable si no existe ya
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
  
  // Guardar las variables actuales (incluyendo las históricas) para la próxima vez
  const allVariables = {
    fontFamilyVars,
    lineHeightVars,
    fontWeightVars,
    letterSpacingVars,
    textTransformVars,
    fontSizeVars
  };
  saveHistoricalVariables(allVariables, historicalVarsPathDefault);
  
  return { valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars };
}

// Genera variables CSS para spacing (padding y margin)
// Crea variables como --hg-spacing-4, --hg-spacing-8, etc.
function generateSpacingVariables(spacingMap, prefix, baseFontSize = 16) {
  if (!spacingMap || typeof spacingMap !== 'object') {
    return [];
  }
  
  const variables = [];
  
  Object.entries(spacingMap).forEach(([key, value]) => {
    // Si el valor termina en %, no lo convierte a rem
    const finalValue = value.endsWith('%') ? value : pxToRem(value, baseFontSize);
    const varName = `--${prefix}-spacing-${key}`;
    variables.push({ varName, value: finalValue, key });
  });
  
  return variables;
}

// Genera variables CSS para colores
// Crea variables como --hg-color-white, --hg-color-black, etc.
function generateColorVariables(colorsMap, prefix) {
  if (!colorsMap || typeof colorsMap !== 'object') {
    return [];
  }
  
  const variables = [];
  
  Object.entries(colorsMap).forEach(([key, value]) => {
    const varName = `--${prefix}-color-${key}`;
    variables.push({ varName, value, key });
  });
  
  return variables;
}

// Genera todas las variables CSS en el bloque :root
// Recorre todos los mapas de variables y las convierte en declaraciones CSS
function generateRootVariables(fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars, spacingVars = [], colorVars = []) {
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
  
  // Agregar variables de spacing
  spacingVars.forEach(item => {
    variables.push(`  ${item.varName}: ${item.value};`);
  });
  
  // Agregar variables de colores
  colorVars.forEach(item => {
    variables.push(`  ${item.varName}: ${item.value};`);
  });
  
  return variables.join('\n');
}

// Obtiene las propiedades finales de una clase para un breakpoint específico
// Combina las propiedades base (que no cambian) con las del breakpoint (que sí cambian)
function getFinalProps(cls, breakpoint, baseFontSize) {
  const props = {};
  
  // Propiedades base que se aplican a todos los breakpoints
  ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
    if (cls[prop] !== undefined) props[prop] = cls[prop];
  });
  
  // Propiedades específicas del breakpoint (fontSize y lineHeight)
  if (cls[breakpoint]) {
    if (cls[breakpoint].fontSize !== undefined) props.fontSize = pxToRem(cls[breakpoint].fontSize, baseFontSize);
    if (cls[breakpoint].lineHeight !== undefined) props.lineHeight = cls[breakpoint].lineHeight;
  }
  
  return props;
}

// Genera el CSS para una clase específica en un breakpoint
// Crea las propiedades CSS usando las variables compartidas
function generateClassCSS(className, cls, breakpointName, valueMap, prefix, category, baseFontSize, fontFamilyMap) {
  const props = getFinalProps(cls, breakpointName, baseFontSize);
  const cssProps = [];
  
  PROPERTIES.forEach(prop => {
    if (props[prop] === undefined) return;
    
    // Obtiene el nombre de la variable CSS según el tipo de propiedad
    let varName;
    if (prop === 'fontFamily') {
      const fontFamilyName = getFontFamilyName(props[prop], fontFamilyMap);
      varName = getFontFamilyVarName(fontFamilyName, prefix, category);
    } else if (prop === 'lineHeight') {
      varName = getLineHeightVarName(props[prop], prefix, category);
    } else if (prop === 'fontSize') {
      // Para fontSize, usa el valor original en px para generar el nombre de variable
      const originalValue = cls[breakpointName]?.fontSize ?? cls.fontSize;
      varName = getSharedVarName(prop, originalValue, prefix, category);
    } else {
      varName = getSharedVarName(prop, props[prop], prefix, category);
    }
    
    cssProps.push(`    ${toKebabCase(prop)}: var(${varName});`);
  });
  
  return cssProps.length ? `  .${className} {\n${cssProps.join('\n')}\n  }` : '';
}

// Genera una media query con todas las clases para un breakpoint
// Convierte el breakpoint a rem y genera el CSS de todas las clases
function generateMediaQuery(breakpointName, minWidth, classes, valueMap, prefix, category, baseFontSize, fontFamilyMap) {
  const minWidthRem = pxToRem(minWidth, baseFontSize);
  
  const cssClasses = Object.entries(classes)
    .map(([className, cls]) => generateClassCSS(className, cls, breakpointName, valueMap, prefix, category, baseFontSize, fontFamilyMap))
    .filter(Boolean);
  
  return `@media (min-width: ${minWidthRem}) {\n\n${cssClasses.join('\n\n')}\n\n}`;
}

// Genera un bloque de tipografías para un breakpoint específico con comentario descriptivo
// Incluye un comentario que indica qué breakpoint es y el min-width
function generateTypographyBlock(breakpointName, minWidth, classes, valueMap, prefix, category, baseFontSize, fontFamilyMap) {
  const minWidthRem = pxToRem(minWidth, baseFontSize);
  const breakpointLabel = breakpointName === 'mobile' ? 'Mobile' : 'Desktop';
  
  const cssClasses = Object.entries(classes)
    .map(([className, cls]) => generateClassCSS(className, cls, breakpointName, valueMap, prefix, category, baseFontSize, fontFamilyMap))
    .filter(Boolean);
  
  return `/* Tipografías - ${breakpointLabel} (min-width: ${minWidthRem}) */
@media (min-width: ${minWidthRem}) {

${cssClasses.join('\n\n')}

}`;
}

// Genera el reset CSS mínimo necesario para que todo funcione correctamente
// Establece el tamaño de fuente base del HTML para que los rem funcionen
function generateResetCSS(baseFontSize = 16) {
  return `/* Reset CSS Mínimo */
html {
  box-sizing: border-box;
  font-size: ${baseFontSize}px;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    interpolate-size: allow-keywords;
  }
}

*,
*:before,
*:after {
  box-sizing: inherit;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
}

* {
  margin: 0;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  line-height: calc(1em + 0.5rem);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

ol,
ul,
dl {
  list-style: none;
  padding-inline-start: unset;
}

img, picture, video, canvas, svg {
  display: inline-block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
`;
}

// Genera helpers de padding y margin basados en el spacingMap del config.json
// Crea clases como p-4, pr-4, pl-4, pb-4, pt-4 para padding
// y m-4, mr-4, ml-4, mb-4, mt-4 para margin
// También genera versiones con prefijo md: para el breakpoint desktop
// Usa las variables CSS definidas en :root
function generateSpacingHelpers(spacingMap, prefix, desktopBreakpoint, baseFontSize = 16, spacingImportant = []) {
  if (!spacingMap || typeof spacingMap !== 'object') {
    return '';
  }
  
  const helpers = [];
  const desktopHelpers = [];
  const desktopBreakpointRem = pxToRem(desktopBreakpoint, baseFontSize);
  
      // Generar helpers para cada valor en spacingMap
      Object.entries(spacingMap).forEach(([key, value]) => {
        const varName = `--${prefix}-spacing-${key}`;
        
        // Padding helpers base (mobile) usando variables CSS con propiedades lógicas para RTL
        helpers.push(`  .p-${key} { padding: var(${varName}); }`);
        helpers.push(`  .pr-${key} { padding-inline-end: var(${varName}); }`);
        helpers.push(`  .pl-${key} { padding-inline-start: var(${varName}); }`);
        helpers.push(`  .pb-${key} { padding-bottom: var(${varName}); }`);
        helpers.push(`  .pt-${key} { padding-top: var(${varName}); }`);
        
        // Margin helpers base (mobile) usando variables CSS con propiedades lógicas para RTL
        helpers.push(`  .m-${key} { margin: var(${varName}); }`);
        helpers.push(`  .mr-${key} { margin-inline-end: var(${varName}); }`);
        helpers.push(`  .ml-${key} { margin-inline-start: var(${varName}); }`);
        helpers.push(`  .mb-${key} { margin-bottom: var(${varName}); }`);
        helpers.push(`  .mt-${key} { margin-top: var(${varName}); }`);
        
        // Padding helpers con prefijo md: (desktop) usando variables CSS con propiedades lógicas para RTL
        desktopHelpers.push(`    .md\\:p-${key} { padding: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:pr-${key} { padding-inline-end: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:pl-${key} { padding-inline-start: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:pb-${key} { padding-bottom: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:pt-${key} { padding-top: var(${varName}); }`);
        
        // Margin helpers con prefijo md: (desktop) usando variables CSS con propiedades lógicas para RTL
        desktopHelpers.push(`    .md\\:m-${key} { margin: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:mr-${key} { margin-inline-end: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:ml-${key} { margin-inline-start: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:mb-${key} { margin-bottom: var(${varName}); }`);
        desktopHelpers.push(`    .md\\:mt-${key} { margin-top: var(${varName}); }`);
      });
      
      // Generar helpers con !important para los valores especificados en spacingImportant
      if (spacingImportant && Array.isArray(spacingImportant)) {
        spacingImportant.forEach(key => {
          if (spacingMap[key]) {
            const varName = `--${prefix}-spacing-${key}`;
            
            // Padding helpers con !important (mobile)
            helpers.push(`  .p-${key}\\! { padding: var(${varName}) !important; }`);
            helpers.push(`  .pr-${key}\\! { padding-inline-end: var(${varName}) !important; }`);
            helpers.push(`  .pl-${key}\\! { padding-inline-start: var(${varName}) !important; }`);
            helpers.push(`  .pb-${key}\\! { padding-bottom: var(${varName}) !important; }`);
            helpers.push(`  .pt-${key}\\! { padding-top: var(${varName}) !important; }`);
            
            // Margin helpers con !important (mobile)
            helpers.push(`  .m-${key}\\! { margin: var(${varName}) !important; }`);
            helpers.push(`  .mr-${key}\\! { margin-inline-end: var(${varName}) !important; }`);
            helpers.push(`  .ml-${key}\\! { margin-inline-start: var(${varName}) !important; }`);
            helpers.push(`  .mb-${key}\\! { margin-bottom: var(${varName}) !important; }`);
            helpers.push(`  .mt-${key}\\! { margin-top: var(${varName}) !important; }`);
            
            // Padding helpers con !important y prefijo md: (desktop)
            desktopHelpers.push(`    .md\\:p-${key}\\! { padding: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:pr-${key}\\! { padding-inline-end: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:pl-${key}\\! { padding-inline-start: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:pb-${key}\\! { padding-bottom: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:pt-${key}\\! { padding-top: var(${varName}) !important; }`);
            
            // Margin helpers con !important y prefijo md: (desktop)
            desktopHelpers.push(`    .md\\:m-${key}\\! { margin: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:mr-${key}\\! { margin-inline-end: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:ml-${key}\\! { margin-inline-start: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:mb-${key}\\! { margin-bottom: var(${varName}) !important; }`);
            desktopHelpers.push(`    .md\\:mt-${key}\\! { margin-top: var(${varName}) !important; }`);
          }
        });
      }
  
  if (helpers.length === 0) {
    return '';
  }
  
  // Generar bloque base (mobile) y bloque con media query (desktop)
  const baseHelpers = `/* Helpers de Spacing (Padding y Margin) - Mobile */
${helpers.join('\n')}

/* Helpers de Spacing (Padding y Margin) - Desktop (md:) */
@media (min-width: ${desktopBreakpointRem}) {
${desktopHelpers.join('\n')}
}

`;
  
  return baseHelpers;
}

function generateLayoutHelpers(helpers, spacingMap, prefix, desktopBreakpoint, baseFontSize = 16) {
  if (!helpers || typeof helpers !== 'object') {
    return '';
  }

  let css = '\n/* Layout Helpers */\n';

  Object.entries(helpers).forEach(([helperName, config]) => {
    const { property, class: className, responsive, values, useSpacing } = config;

    if (useSpacing && spacingMap) {
      Object.entries(spacingMap).forEach(([key, value]) => {
        const finalValue = value.endsWith('%') ? value : pxToRem(value, baseFontSize);
        css += `.${prefix}-${className}-${key} { ${property}: ${finalValue}; }\n`;
      });

      if (responsive) {
        css += `\n@media (min-width: ${desktopBreakpoint}) {\n`;
        Object.entries(spacingMap).forEach(([key, value]) => {
          const finalValue = value.endsWith('%') ? value : pxToRem(value, baseFontSize);
          css += `  .md\\:${prefix}-${className}-${key} { ${property}: ${finalValue}; }\n`;
        });
        css += '}\n';
      }
    } else if (values) {
      if (Array.isArray(values)) {
        values.forEach(value => {
          css += `.${prefix}-${className}-${value} { ${property}: ${value}; }\n`;
        });

        if (responsive) {
          css += `\n@media (min-width: ${desktopBreakpoint}) {\n`;
          values.forEach(value => {
            css += `  .md\\:${prefix}-${className}-${value} { ${property}: ${value}; }\n`;
          });
          css += '}\n';
        }
      } else if (typeof values === 'object') {
        Object.entries(values).forEach(([key, value]) => {
          css += `.${prefix}-${className}-${key} { ${property}: ${value}; }\n`;
        });

        if (responsive) {
          css += `\n@media (min-width: ${desktopBreakpoint}) {\n`;
          Object.entries(values).forEach(([key, value]) => {
            css += `  .md\\:${prefix}-${className}-${key} { ${property}: ${value}; }\n`;
          });
          css += '}\n';
        }
      }
    }

    css += '\n';
  });

  return css;
}

// Función principal que genera todo el CSS desde la configuración JSON
// Organiza el CSS en bloques separados: reset, variables, tipografías mobile y desktop
function generateCSS(configData) {
  const prefix = configData.prefix || 'hg';
  const category = configData.category || 'typo';
  const baseFontSize = configData.baseFontSize || 16;
  
  // Construye el mapa de variables compartidas
  const { valueMap, fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars } = 
    buildValueMap(configData.classes, configData.fontFamilyMap, prefix, category);
  
  // Genera variables de spacing
  const spacingVars = generateSpacingVariables(configData.spacingMap, prefix, baseFontSize);
  
  // Genera variables de colores
  const colorVars = generateColorVariables(configData.colors, prefix);
  
  // Genera cada bloque del CSS
  const resetCSS = generateResetCSS(baseFontSize);
  const rootVars = generateRootVariables(fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars, spacingVars, colorVars);
  const spacingHelpers = generateSpacingHelpers(configData.spacingMap, prefix, configData.breakpoints.desktop, baseFontSize, configData.spacingImportant);
  const layoutHelpers = configData.helpers ? generateLayoutHelpers(configData.helpers, configData.spacingMap, prefix, configData.breakpoints.desktop, baseFontSize) : '';
  const mobileTypography = generateTypographyBlock('mobile', configData.breakpoints.mobile, configData.classes, valueMap, prefix, category, baseFontSize, configData.fontFamilyMap);
  const desktopTypography = generateTypographyBlock('desktop', configData.breakpoints.desktop, configData.classes, valueMap, prefix, category, baseFontSize, configData.fontFamilyMap);
  
  // Combina todos los bloques en el orden correcto
  return `${resetCSS}/* Variables CSS Compartidas */
:root {
${rootVars}
}

${spacingHelpers}${layoutHelpers}${mobileTypography}

${desktopTypography}`;
}

module.exports = {
  generateCSS,
  buildValueMap,
  generateResetCSS,
  generateSpacingVariables,
  generateColorVariables
};

