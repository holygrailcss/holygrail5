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

// Función para convertir camelCase a kebab-case
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Función para generar nombre de variable CSS específica por clase
function getVarName(className, prop) {
  const propName = toKebabCase(prop);
  return `--${VAR_PREFIX}-${VAR_CATEGORY}-${className}-${propName}`;
}

// Extraer valores únicos y crear mapeo de variables
function buildValueMap(classes) {
  const valueMap = {};
  
  // Crear mapeo de variables específicas por clase
  Object.entries(classes).forEach(([className, cls]) => {
    valueMap[className] = {};
    
    // Propiedades base (fontFamily, fontWeight, letterSpacing, textTransform)
    ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
      if (cls[prop] !== undefined) {
        valueMap[className][prop] = {
          varName: getVarName(className, prop),
          value: cls[prop]
        };
      }
    });
    
    // Propiedades de breakpoints (fontSize, lineHeight)
    BREAKPOINTS.forEach(bp => {
      if (cls[bp]) {
        ['fontSize', 'lineHeight'].forEach(prop => {
          if (cls[bp][prop] !== undefined) {
            // Para fontSize y lineHeight, necesitamos valores por breakpoint
            if (!valueMap[className][prop]) valueMap[className][prop] = {};
            valueMap[className][prop][bp] = {
              varName: getVarName(className, prop),
              value: cls[bp][prop]
            };
          }
        });
      }
    });
  });
  
  return valueMap;
}

// Generar variables CSS compartidas
function generateRootVariables(valueMap) {
  const variables = [];
  
  Object.entries(valueMap).forEach(([className, props]) => {
    // Propiedades base (fontFamily, fontWeight, letterSpacing, textTransform)
    ['fontFamily', 'fontWeight', 'letterSpacing', 'textTransform'].forEach(prop => {
      if (props[prop]) {
        variables.push(`  ${props[prop].varName}: ${props[prop].value};`);
      }
    });
    
    // Propiedades de breakpoints - usar valores de mobile como base
    ['fontSize', 'lineHeight'].forEach(prop => {
      if (props[prop] && props[prop].mobile) {
        variables.push(`  ${props[prop].mobile.varName}: ${props[prop].mobile.value};`);
      }
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
  
  // Propiedades del breakpoint
  if (cls[breakpoint]) {
    ['fontSize', 'lineHeight'].forEach(prop => {
      if (cls[breakpoint][prop] !== undefined) {
        props[prop] = cls[breakpoint][prop];
      }
    });
  }
  
  return props;
}

// Generar CSS para una clase
function generateClassCSS(className, cls, breakpoint, valueMap) {
  const props = getFinalProps(cls, breakpoint);
  const cssProps = [];
  
  PROPERTIES.forEach(prop => {
    if (props[prop] !== undefined) {
      const varName = getVarName(className, prop);
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
  
  // Variables que cambian en este breakpoint
  const changedVars = [];
  Object.entries(classes).forEach(([className, cls]) => {
    if (cls[breakpointName]) {
      ['fontSize', 'lineHeight'].forEach(prop => {
        if (cls[breakpointName][prop] !== undefined) {
          const varName = getVarName(className, prop);
          const value = cls[breakpointName][prop];
          changedVars.push(`  ${varName}: ${value};`);
        }
      });
    }
  });
  
  let rootVarsSection = '';
  if (breakpointName !== 'mobile' && changedVars.length > 0) {
    // Verificar si hay cambios respecto a mobile
    const hasChanges = Object.entries(classes).some(([className, cls]) => {
      if (!cls.mobile || !cls[breakpointName]) return false;
      return ['fontSize', 'lineHeight'].some(prop => {
        const mobileValue = cls.mobile[prop];
        const breakpointValue = cls[breakpointName][prop];
        return mobileValue !== undefined && breakpointValue !== undefined && mobileValue !== breakpointValue;
      });
    });
    
    if (hasChanges) {
      const uniqueVars = Array.from(new Set(changedVars));
      rootVarsSection = `  :root {\n${uniqueVars.join('\n')}\n  }\n\n`;
    }
  }
  
  return `@media (min-width: ${minWidth}) {\n\n${rootVarsSection}${cssClasses.join('\n\n')}\n\n}`;
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
