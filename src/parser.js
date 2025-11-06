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
    const remValue = pxToRem(value, baseFontSize);
    const varName = `--${prefix}-spacing-${key}`;
    variables.push({ varName, value: remValue, key });
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

// Genera helpers de spacing (padding y margin) basados en spacingMap
// Crea clases como p-4, pr-4, pl-4, pb-4, pt-4 para padding
// y m-4, mr-4, ml-4, mb-4, mt-4 para margin
// Usa las variables CSS definidas en :root
function generateSpacingHelpers(spacingMap, prefix) {
  if (!spacingMap || typeof spacingMap !== 'object') {
    return '';
  }
  
  const helpers = [];
  
  // Generar helpers para cada valor en spacingMap
  Object.entries(spacingMap).forEach(([key, value]) => {
    const varName = `--${prefix}-spacing-${key}`;
    
    // Padding helpers usando variables CSS
    helpers.push(`  .p-${key} { padding: var(${varName}); }`);
    helpers.push(`  .pr-${key} { padding-right: var(${varName}); }`);
    helpers.push(`  .pl-${key} { padding-left: var(${varName}); }`);
    helpers.push(`  .pb-${key} { padding-bottom: var(${varName}); }`);
    helpers.push(`  .pt-${key} { padding-top: var(${varName}); }`);
    
    // Margin helpers usando variables CSS
    helpers.push(`  .m-${key} { margin: var(${varName}); }`);
    helpers.push(`  .mr-${key} { margin-right: var(${varName}); }`);
    helpers.push(`  .ml-${key} { margin-left: var(${varName}); }`);
    helpers.push(`  .mb-${key} { margin-bottom: var(${varName}); }`);
    helpers.push(`  .mt-${key} { margin-top: var(${varName}); }`);
  });
  
  if (helpers.length === 0) {
    return '';
  }
  
  return `/* Helpers de Spacing (Padding y Margin) */
${helpers.join('\n')}

`;
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
  const spacingHelpers = generateSpacingHelpers(configData.spacingMap, prefix);
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

