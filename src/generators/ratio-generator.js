// Generador de Aspect Ratios
// Genera clases para ratios de aspecto

/**
 * Genera clases de aspect ratio
 * Crea clases como .aspect-1-1, .aspect-16-9, etc.
 */
function generateAspectRatios(ratios, prefix) {
  if (!ratios || !Array.isArray(ratios)) {
    return '';
  }

  let css = '\n/* Aspect Ratios */\n';
  
  // Clase para el contenido dentro del ratio
  css += `.rat-content {
  position: absolute;
  inset: 0;
}\n\n`;

  // Generar clases para cada ratio
  ratios.forEach(ratio => {
    const { class: className, width, height, description } = ratio;
    
    // Caso especial para aspect-full (sin ratio fijo)
    if (className === 'aspect-full') {
      css += `/* ${description} */\n`;
      css += `.${prefix}-${className} {
  aspect-ratio: auto;
  height: auto;
}\n\n`;
      return;
    }
    
    // Calcular el padding-top en porcentaje
    const paddingPercent = (height / width * 100).toFixed(4);
    
    css += `/* ${description} */\n`;
    css += `.${prefix}-${className} {
  aspect-ratio: ${width} / ${height};
  position: relative;
  width: 100%;
}\n\n`;
    
    // Añadir fallback para navegadores que no soporten aspect-ratio
    css += `@supports not (aspect-ratio: ${width} / ${height}) {
  .${prefix}-${className} {
    padding-top: ${paddingPercent}%;
  }
}\n\n`;
  });

  return css;
}

module.exports = { generateAspectRatios };
