// Generador de Grid System
// Genera el sistema de grid (row y columnas)

const { pxToRem } = require('./utils');

/**
 * Genera el sistema de grid (row y columnas)
 * Incluye filas, columnas responsive, y utilidades de bleed
 */
function generateGridSystem(gridConfig, baseFontSize = 16) {
  if (!gridConfig || !gridConfig.enabled) {
    return '';
  }

  // Validar que existan los valores necesarios
  if (!gridConfig.gutter || !gridConfig.breakpoints) {
    throw new Error('La configuración del grid debe incluir: gutter y breakpoints');
  }

  const gutter = gridConfig.gutter;
  const gutterValue = gutter;
  const breakpoints = gridConfig.breakpoints;

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
  Object.entries(breakpoints).forEach(([name, config]) => {
    if (name !== 'xs') {
      const minWidth = config.minWidth || config;
      const remValue = breakpointToRem(minWidth);
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

  // Genera columnas para cada breakpoint
  Object.entries(breakpoints).forEach(([name, config]) => {
    const minWidth = config.minWidth || config;
    const columns = config.columns || 12; // Default a 12 columnas si no se especifica
    const breakpointValue = breakpointToRem(minWidth);
    
    css += `@media (min-width: ${breakpointValue}) {\n`;
    for (let i = 1; i <= columns; i++) {
      const percentage = formatPercentage(i / columns);
      css += `  .col-${name}-${i} {
    flex: 0 0 ${percentage}%;
    max-width: ${percentage}%;
  }\n`;
    }
    css += '}\n\n';
  });

  // Genera estilos para todas las columnas
  css += `[class*=" col-"], [class^="col-"] {
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

  css += `.bleed-0 > [class*=" col-"],
.bleed-0 > [class^="col-"],
.bleed-0 > .col {
  padding: 0px;
  box-sizing: border-box;
}\n\n`;


  // Contenedores y utilidades que venian de HolyGrail2, portados con los mismos
  // valores para poder retirarlos de alli, donde estaban duplicados.
  css += `
.colgap-8 {
  column-gap: 8px;
}
.container {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  padding-inline: 8px;
  position: relative;
  width: 100%;
}
.container-12 {
  max-width: 1080px;
  padding: 0 24px;
  position: relative;
  width: 100%;
}
.container-2 {
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
  padding-inline: 8px;
  position: relative;
  width: 90%;
}
.container-3 {
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
  padding-inline: 24px;
  position: relative;
  width: 100%;
}
.container-360 {
  max-width: 360px;
  width: 100%;
}
.container-4 {
  margin-left: auto;
  margin-right: auto;
  max-width: 360px;
  padding-inline: 16px;
  position: relative;
  width: 100%;
}
.container-6 {
  margin: 0 auto;
  max-width: 442px;
  padding: 0 8px;
  position: relative;
  width: 100%;
}
.container-7 {
  margin: 0 auto;
  max-width: 295px;
  padding: 0 16px;
  position: relative;
  width: 100%;
}
.container-8 {
  margin: 0 auto;
  max-width: 395px;
  padding: 0 8px;
  position: relative;
  width: 100%;
}
.container-9 {
  margin: 0 auto;
  max-width: 798px;
  padding: 0 24px;
  position: relative;
  width: 100%;
}
.container-total {
  margin-left: 0;
  margin-right: 0;
  max-width: 100%;
  position: relative;
  width: 100%;
}
.gap-8 {
  gap: 8px;
}
.grid-2-wide {
  grid-column: span 2;
}
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.grid-gap-16 {
  gap: 16px;
}

@media (min-width: 48rem) {
  .col-md {
    display: block;
    flex: 1 1 0;
    padding: 0 8px;
  }
  .container {
    max-width: 768px;
    padding-inline: 8px;
    width: 90%;
  }
  .container-12 {
    padding: 0 8px;
  }
  .container-3 {
    padding-inline: 8px;
  }
  .container-7 {
    max-width: 460px;
    padding-left: 8px;
    padding-right: 8px;
  }
  .container-9 {
    padding: 0 8px;
  }
  .grid-2-desktop {
    align-items: end;
    column-gap: 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 62rem) {
  .container {
    max-width: 992px;
    width: 80%;
  }
  .container-7 {
    max-width: 460px;
  }
  .container-total {
    max-width: 100%;
    width: 100%;
  }
}

@media (min-width: 80rem) {
  .container {
    max-width: 1280px;
    width: 80%;
  }
  .container-7 {
    max-width: 595px;
  }
}

@media (min-width: 90rem) {
  .container {
    max-width: 1440px;
    width: 100%;
  }
}
`;

  return css;
}

module.exports = {
  generateGridSystem
};

