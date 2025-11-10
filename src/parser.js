// Parseador JSON a CSS
// Convierte la configuración JSON en CSS con variables compartidas y clases responsive

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

// Construye un mapa de todas las variables CSS compartidas y sus valores
// Recorre todas las clases y agrupa valores únicos para crear variables compartidas
// Esto evita duplicar variables cuando varias clases usan el mismo valor
function buildValueMap(classes, fontFamilyMap, prefix, category) {
  const fontFamilyVars = new Map();
  const lineHeightVars = new Map();
  const fontWeightVars = new Map();
  const letterSpacingVars = new Map();
  const textTransformVars = new Map();
  const fontSizeVars = new Map();
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
    // Si la key termina en !, la limpiamos para la variable CSS
    const cleanKey = key.endsWith('!') ? key.slice(0, -1) : key;
    const remValue = pxToRem(value, baseFontSize);
    const varName = `--${prefix}-spacing-${cleanKey}`;
    variables.push({ varName, value: remValue, key: cleanKey });
  });
  
  return variables;
}

// Genera todas las variables CSS en el bloque :root
// Recorre todos los mapas de variables y las convierte en declaraciones CSS
function generateRootVariables(fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars, spacingVars = []) {
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

// Genera helpers de spacing (padding y margin) basados en spacingMap
// Crea clases como hg-p-4, hg-pr-4, hg-pl-4, hg-pb-4, hg-pt-4 para padding
// y hg-m-4, hg-mr-4, hg-ml-4, hg-mb-4, hg-mt-4 para margin
// También genera versiones con prefijo md: para el breakpoint desktop
// Usa las variables CSS definidas en :root
function generateSpacingHelpers(spacingMap, prefix, desktopBreakpoint, baseFontSize = 16) {
  if (!spacingMap || typeof spacingMap !== 'object') {
    return '';
  }
  
  const helpers = [];
  const desktopHelpers = [];
  const desktopBreakpointRem = pxToRem(desktopBreakpoint, baseFontSize);
  
      // Generar helpers para cada valor en spacingMap
      Object.entries(spacingMap).forEach(([key, value]) => {
        // Detectar si la key termina en ! para aplicar !important
        const hasImportant = key.endsWith('!');
        const cleanKey = hasImportant ? key.slice(0, -1) : key;
        const varName = `--${prefix}-spacing-${cleanKey}`;
        const important = hasImportant ? ' !important' : '';
        const escapedExclamation = hasImportant ? '\\!' : '';
        
        // Padding helpers base (mobile) usando variables CSS con propiedades lógicas para RTL
        helpers.push(`  .${prefix}-p-${cleanKey}${escapedExclamation} { padding: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-pr-${cleanKey}${escapedExclamation} { padding-inline-end: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-pl-${cleanKey}${escapedExclamation} { padding-inline-start: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-pb-${cleanKey}${escapedExclamation} { padding-bottom: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-pt-${cleanKey}${escapedExclamation} { padding-top: var(${varName})${important}; }`);
        
        // Margin helpers base (mobile) usando variables CSS con propiedades lógicas para RTL
        helpers.push(`  .${prefix}-m-${cleanKey}${escapedExclamation} { margin: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-mr-${cleanKey}${escapedExclamation} { margin-inline-end: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-ml-${cleanKey}${escapedExclamation} { margin-inline-start: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-mb-${cleanKey}${escapedExclamation} { margin-bottom: var(${varName})${important}; }`);
        helpers.push(`  .${prefix}-mt-${cleanKey}${escapedExclamation} { margin-top: var(${varName})${important}; }`);
        
        // Padding helpers con prefijo md: (desktop) usando variables CSS con propiedades lógicas para RTL
        desktopHelpers.push(`    .md\\:${prefix}-p-${cleanKey}${escapedExclamation} { padding: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-pr-${cleanKey}${escapedExclamation} { padding-inline-end: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-pl-${cleanKey}${escapedExclamation} { padding-inline-start: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-pb-${cleanKey}${escapedExclamation} { padding-bottom: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-pt-${cleanKey}${escapedExclamation} { padding-top: var(${varName})${important}; }`);
        
        // Margin helpers con prefijo md: (desktop) usando variables CSS con propiedades lógicas para RTL
        desktopHelpers.push(`    .md\\:${prefix}-m-${cleanKey}${escapedExclamation} { margin: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-mr-${cleanKey}${escapedExclamation} { margin-inline-end: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-ml-${cleanKey}${escapedExclamation} { margin-inline-start: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-mb-${cleanKey}${escapedExclamation} { margin-bottom: var(${varName})${important}; }`);
        desktopHelpers.push(`    .md\\:${prefix}-mt-${cleanKey}${escapedExclamation} { margin-top: var(${varName})${important}; }`);
      });
  
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
  
  // Genera cada bloque del CSS
  const resetCSS = generateResetCSS(baseFontSize);
  const rootVars = generateRootVariables(fontFamilyVars, lineHeightVars, fontWeightVars, letterSpacingVars, textTransformVars, fontSizeVars, spacingVars);
  const spacingHelpers = generateSpacingHelpers(configData.spacingMap, prefix, configData.breakpoints.desktop, baseFontSize);
  const mobileTypography = generateTypographyBlock('mobile', configData.breakpoints.mobile, configData.classes, valueMap, prefix, category, baseFontSize, configData.fontFamilyMap);
  const desktopTypography = generateTypographyBlock('desktop', configData.breakpoints.desktop, configData.classes, valueMap, prefix, category, baseFontSize, configData.fontFamilyMap);
  
  // Combina todos los bloques en el orden correcto
  return `${resetCSS}/* Variables CSS Compartidas */
:root {
${rootVars}
}

${spacingHelpers}${mobileTypography}

${desktopTypography}`;
}

module.exports = {
  generateCSS,
  buildValueMap,
  generateResetCSS,
  generateSpacingVariables
};

