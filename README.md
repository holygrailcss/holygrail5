# HolyGrail5

Framework CSS generator con Node.js que genera CSS optimizado con variables CSS desde un archivo JSON de configuración.

## Características

- ✨ Genera CSS optimizado con variables CSS compartidas
- 📱 Soporte para breakpoints responsive (mobile/desktop)
- 🎨 Configuración simple mediante JSON
- ⚡ Variables CSS mínimas y eficientes
- 🔧 Fácil de personalizar y extender

## Instalación

```bash
npm install holygrail5
```

## Uso

### Como script de línea de comandos

```bash
npx holygrail5
```

O después de instalar:

```bash
npm run generate
```

### Como módulo Node.js

```javascript
const fs = require('fs');
const path = require('path');
const generator = require('holygrail5');

// El generador lee config.json y genera output.css
```

## Configuración

El proyecto usa un archivo `config.json` para definir las clases CSS y sus propiedades:

```json
{
  "breakpoints": {
    "mobile": "1px",
    "desktop": "992px"
  },
  "classes": {
    "h2": {
      "fontFamily": "arial, sans-serif",
      "fontWeight": "900",
      "mobile": {
        "fontSize": "18px",
        "lineHeight": "1.2"
      },
      "desktop": {
        "fontSize": "24px",
        "lineHeight": "1.2"
      }
    }
  }
}
```

### Estructura del JSON

- **breakpoints**: Define los breakpoints para mobile y desktop
- **classes**: Objeto con las clases CSS a generar
  - Propiedades base: `fontFamily`, `fontWeight` (aplicadas a todos los breakpoints)
  - Propiedades responsive: `mobile` y `desktop` con `fontSize` y `lineHeight`

## Salida

El generador crea un archivo `output.css` con:

- Variables CSS compartidas en `:root`
- Media queries para cada breakpoint
- Clases CSS que usan las variables

## Ejemplo de CSS generado

```css
:root {
  --font-family-sans: arial, sans-serif;
  --font-family-serif: "ms-serif", serif;
  --font-weight-900: 900;
  --font-size-18: 18px;
  --font-size-24: 24px;
  /* ... */
}

@media (min-width: 1px) {
  .h2 {
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-900);
    font-size: var(--font-size-18);
    line-height: var(--line-height-1-2);
  }
}

@media (min-width: 992px) {
  .h2 {
    font-family: var(--font-family-sans);
    font-weight: var(--font-weight-900);
    font-size: var(--font-size-24);
    line-height: var(--line-height-1-2);
  }
}
```

## Características técnicas

- Genera variables CSS compartidas (mínimas)
- Optimiza el CSS eliminando duplicados
- Soporte para propiedades tipográficas: font-family, font-weight, font-size, line-height
- Breakpoints personalizables

## Licencia

MIT

