// Generador de Grid System
// Genera el sistema de grid (row y columnas)

const { pxToRem } = require('../helpers');

/**
 * Genera el sistema de grid (row y columnas)
 * Incluye filas, columnas responsive, y utilidades de bleed
 */
function generateGridSystem(gridConfig, baseFontSize = 16) {
  if (!gridConfig || !gridConfig.enabled) {
    return '';
  }

  // Validar que existan los valores necesarios
  if (!gridConfig.gutter || !gridConfig.breakpoints || !gridConfig.columnsXs || !gridConfig.columnsXl) {
    throw new Error('La configuración del grid debe incluir: gutter, breakpoints, columnsXs y columnsXl');
  }

  const gutter = gridConfig.gutter;
  const gutterValue = gutter;
  const breakpoints = gridConfig.breakpoints;
  const columnsXs = gridConfig.columnsXs;
  const columnsXl = gridConfig.columnsXl;

  // Función helper para convertir breakpoints a rem de forma consistente
  const breakpointToRem = (value) => {
    if (typeof value === 'string' && value.includes('px')) {
      return pxToRem(value, baseFontSize);
    }
    return value;
  };

  let css = '\n/* Grid System */\n';

  // Genera .row
  css += `.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -${gutterValue};
  margin-right: -${gutterValue};
}\n\n`;

  // Genera .row para cada breakpoint
  Object.entries(breakpoints).forEach(([name, value]) => {
    if (name !== 'xs') {
      const remValue = breakpointToRem(value);
      css += `@media (min-width: ${remValue}) {
  .row {
    margin-left: -${gutterValue};
    margin-right: -${gutterValue};
  }
}\n\n`;
    }
  });

  // Función helper para formatear porcentajes
  const formatPercentage = (value) => {
    const percentage = (value * 100).toFixed(10);
    // Elimina ceros finales pero mantiene al menos un decimal si es necesario
    return percentage.replace(/\.?0+$/, '') || '0';
  };

  // Genera columnas para xs (12 columnas) - convertir a rem
  const xsBreakpoint = breakpointToRem(breakpoints.xs);
  css += `@media (min-width: ${xsBreakpoint}) {\n`;
  for (let i = 1; i <= columnsXs; i++) {
    const percentage = formatPercentage(i / columnsXs);
    css += `  .col-xs-${i} {
    flex: 0 0 ${percentage}%;
    max-width: ${percentage}%;
  }\n`;
  }
  css += '}\n\n';

  // Genera columnas para sm (12 columnas)
  if (breakpoints.sm) {
    const smBreakpoint = breakpointToRem(breakpoints.sm);
    css += `@media (min-width: ${smBreakpoint}) {\n`;
    for (let i = 1; i <= columnsXs; i++) {
      const percentage = formatPercentage(i / columnsXs);
      css += `  .col-sm-${i} {
    flex: 0 0 ${percentage}%;
    max-width: ${percentage}%;
  }\n`;
    }
    css += '}\n\n';
  }

  // Genera columnas para md (12 columnas)
  if (breakpoints.md) {
    const mdBreakpoint = breakpointToRem(breakpoints.md);
    css += `@media (min-width: ${mdBreakpoint}) {\n`;
    for (let i = 1; i <= columnsXs; i++) {
      const percentage = formatPercentage(i / columnsXs);
      css += `  .col-md-${i} {
    flex: 0 0 ${percentage}%;
    max-width: ${percentage}%;
  }\n`;
    }
    css += '}\n\n';
  }

  // Genera columnas para lg (12 columnas)
  if (breakpoints.lg) {
    const lgBreakpoint = breakpointToRem(breakpoints.lg);
    css += `@media (min-width: ${lgBreakpoint}) {\n`;
    for (let i = 1; i <= columnsXs; i++) {
      const percentage = formatPercentage(i / columnsXs);
      css += `  .col-lg-${i} {
    flex: 0 0 ${percentage}%;
    max-width: ${percentage}%;
  }\n`;
    }
    css += '}\n\n';
  }

  // Genera columnas para xl (24 columnas)
  if (breakpoints.xl) {
    const xlBreakpoint = breakpointToRem(breakpoints.xl);
    css += `@media (min-width: ${xlBreakpoint}) {\n`;
    for (let i = 1; i <= columnsXl; i++) {
      const percentage = formatPercentage(i / columnsXl);
      css += `  .col-xl-${i} {
    flex: 0 0 ${percentage}%;
    max-width: ${percentage}%;
  }\n`;
    }
    css += '}\n\n';
  }

  // Genera estilos para todas las columnas
  css += `[class*=col-] {
  box-sizing: border-box;
  min-height: 1px;
  padding-left: ${gutterValue};
  padding-right: ${gutterValue};
  position: relative;
}\n\n`;

  // Estilos para bleed
  css += `.bleed {
  margin-left: -${gutterValue};
  margin-right: -${gutterValue};
  width: auto;
}\n\n`;

  css += `.bleed.row {
  margin-left: -${gutterValue};
  margin-right: -${gutterValue};
}\n\n`;

  css += `.bleed-0 {
  padding: 0 0px 0 0px;
  overflow: hidden;
}\n\n`;

  css += `.bleed-0 .container-fluid {
  margin-left: -0px;
  margin-right: -0px;
  padding: 0 0px 0 0px;
}\n\n`;

  css += `.bleed-0 > .row {
  margin-left: 0;
  margin-right: 0;
  box-sizing: border-box;
  display: flex;
  flex: 0 1 auto;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-flow: row wrap;
  flex-wrap: wrap;
}\n\n`;

  css += `.bleed-0 > [class*=col-],
.bleed-0 > .col {
  padding: 0px;
  box-sizing: border-box;
}\n\n`;

  return css;
}

module.exports = {
  generateGridSystem
};

