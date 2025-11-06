// Utilidades compartidas
// Funciones auxiliares utilizadas por el parseador y el generador de guía

// Convierte nombres de propiedades de JavaScript (camelCase) a formato CSS (kebab-case)
// Por ejemplo, "fontSize" se convierte en "font-size" para usarlo en CSS
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Convierte valores en píxeles a unidades rem para hacer el CSS responsive

function pxToRem(value, baseFontSize = 16) {
  if (typeof value === 'string' && value.endsWith('px')) {
    const pxValue = parseFloat(value);
    const remValue = pxValue / baseFontSize;
    return `${parseFloat(remValue.toFixed(4))}rem`;
  }
  return value;
}

// Convierte valores rem de vuelta a píxeles para mostrarlos en la guía HTML
// Esto ayuda a los desarrolladores a entender mejor los valores, ya que
// muchos están más familiarizados con píxeles que con rem
function remToPx(remValue, baseFontSize = 16) {
  const remMatch = remValue.toString().match(/^([\d.]+)rem$/);
  return remMatch ? `${parseFloat(remMatch[1]) * baseFontSize}px` : '-';
}

// Busca el nombre de una fuente en el mapa de fuentes configurado
// Si la fuente está en el mapa (como "primary" o "secondary"), devuelve ese nombre
// Si no está, genera un nombre automático desde el valor de la fuente
// Esto se usa para crear variables CSS compartidas con nombres consistentes
function getFontFamilyName(fontFamilyValue, fontFamilyMap) {
  // Primero busca en el mapa de fuentes si existe
  if (fontFamilyMap) {
    for (const [name, value] of Object.entries(fontFamilyMap)) {
      if (value === fontFamilyValue) return name;
    }
  }
  // Si no está en el mapa, genera un nombre automático limpiando el valor
  // Elimina comillas, espacios y toma solo el primer nombre de la lista de fuentes
  return fontFamilyValue.replace(/["']/g, '').replace(/\s+/g, '-').toLowerCase().split(',')[0].trim();
}

module.exports = {
  toKebabCase,
  pxToRem,
  remToPx,
  getFontFamilyName
};

