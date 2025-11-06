# HolyGrail5

Framework CSS generator con Node.js que genera CSS optimizado con variables CSS compartidas desde un archivo JSON de configuración.

## ✨ Características

- 🎨 **CSS optimizado** con variables CSS compartidas (mínimas y eficientes)
- 📱 **Soporte responsive** con breakpoints personalizables (mobile/desktop)
- 🔧 **Configuración simple** mediante JSON
- 📊 **Guía HTML interactiva** generada automáticamente con detección de cambios
- 🎯 **Variables compartidas** basadas en valores únicos
- 🔄 **Conversión automática** de px a rem
- 🛠️ **Helpers de spacing** (padding y margin) estilo Tailwind
- 👀 **Modo watch** para desarrollo con regeneración automática
- ✅ **Validación robusta** de configuración
- 🧪 **Suite de tests** incluida

## 📦 Instalación

```bash
# Instalación global
npm install -g holygrail5

# Instalación local
npm install holygrail5
```

## 🚀 Uso

### CLI

```bash
# Uso básico
npx holygrail5
# o
npm run generate

# Con argumentos personalizados
npx holygrail5 --config=./config.json --output=./css/output.css --html=./docs/index.html
```

### Módulo Node.js

```javascript
const { generateCSS, generateHTML } = require('holygrail5');
const config = require('./config.json');

const css = generateCSS(config);
const html = generateHTML(config);
```

### Desarrollo

```bash
# Modo watch (regenera automáticamente al cambiar config.json)
npm run watch

# Desarrollo completo (watch + servidor HTTP)
npm run dev

# Solo servidor HTTP
npm run serve
```

## ⚙️ Configuración

### Estructura del `config.json`

```json
{
  "prefix": "hg",
  "category": "typo",
  "baseFontSize": 16,
  "fontFamilyMap": {
    "primary": "arial, sans-serif",
    "secondary": "\"ms-serif\", serif"
  },
  "breakpoints": {
    "mobile": "0px",
    "desktop": "1024px"
  },
  "spacingMap": {
    "4": "4px",
    "8": "8px",
    "16": "16px",
    "24": "24px"
  },
  "classes": {
    "h2": {
      "fontFamily": "arial, sans-serif",
      "fontWeight": "900",
      "letterSpacing": "0rem",
      "textTransform": "none",
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

### Propiedades globales

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `prefix` | string | `"hg"` | Prefijo para variables CSS |
| `category` | string | `"typo"` | Categoría para variables CSS |
| `baseFontSize` | number | `16` | Tamaño base para conversión px→rem |
| `fontFamilyMap` | object | - | Mapeo de nombres a fuentes CSS |
| `breakpoints` | object | **Requerido** | Breakpoints mobile/desktop |
| `spacingMap` | object | - | Valores de spacing para helpers |
| `classes` | object | **Requerido** | Clases CSS a generar |

### Propiedades de clases

**Base (aplicadas a todos los breakpoints):**
- `fontFamily`: Familia de fuente
- `fontWeight`: Peso de fuente (100, 400, 700, 900)
- `letterSpacing`: Espaciado entre letras (ej: "0rem")
- `textTransform`: Transformación (none, uppercase, lowercase)

**Responsive (por breakpoint):**
- `mobile`: `{ fontSize: "18px", lineHeight: "1.2" }`
- `desktop`: `{ fontSize: "24px", lineHeight: "1.5" }`

## 📄 Salida

### `output.css`

CSS generado con:
- Reset CSS mínimo
- Variables CSS compartidas en `:root`
- Helpers de spacing (`.p-4`, `.m-8`, `.md:p-4`, etc.)
- Media queries para tipografías (mobile/desktop)

### `index.html`

Guía HTML interactiva con:
- Tabla de Font Families
- Tabla de Clases de Tipografía (con preview)
- Tabla de Variables CSS Compartidas
- Tabla de Helpers de Spacing
- Tabla de Breakpoints
- **Detección de cambios** (valores modificados se resaltan en verde)

## 🎯 Helpers de Spacing

Genera clases estilo Tailwind para padding y margin:

```css
/* Mobile */
.p-4 { padding: var(--hg-spacing-4); }
.pr-4 { padding-right: var(--hg-spacing-4); }
.m-8 { margin: var(--hg-spacing-8); }
.mt-16 { margin-top: var(--hg-spacing-16); }

/* Desktop (md:) */
@media (min-width: 64rem) {
  .md\:p-4 { padding: var(--hg-spacing-4); }
  .md\:pr-8 { padding-right: var(--hg-spacing-8); }
}
```

## 🔧 Scripts NPM

| Script | Descripción |
|--------|-------------|
| `npm run generate` | Genera CSS y HTML |
| `npm run watch` | Modo watch (regenera al cambiar config.json) |
| `npm run dev` | Watch + servidor HTTP en localhost:3000 |
| `npm run serve` | Solo servidor HTTP |
| `npm run test` | Ejecuta la suite de tests |
| `npm run start` | Genera y abre servidor HTTP |

## 🏗️ Estructura del proyecto

```
holygrail5/
├── generator.js          # Orquestador principal
├── config.json          # Configuración
├── output.css          # CSS generado
├── index.html          # Guía HTML generada
├── src/
│   ├── config.js       # Carga y validación de config
│   ├── parser.js       # Generación de CSS
│   ├── guide.js        # Generación de HTML
│   ├── utils.js        # Utilidades (px→rem, etc.)
│   ├── watch.js        # Modo watch
│   └── dev.js          # Script de desarrollo
└── tests/
    ├── run-all.js      # Ejecutor de tests
    └── *.test.js       # Tests unitarios
```

## 🎨 Ejemplo de CSS generado

```css
/* Variables CSS Compartidas */
:root {
  --hg-typo-font-family-primary: arial, sans-serif;
  --hg-typo-font-size-18: 1.125rem;
  --hg-typo-font-size-24: 1.5rem;
  --hg-typo-line-height-1-2: 1.2;
  --hg-spacing-4: 0.25rem;
  --hg-spacing-8: 0.5rem;
}

/* Helpers de Spacing */
.p-4 { padding: var(--hg-spacing-4); }
.m-8 { margin: var(--hg-spacing-8); }

@media (min-width: 64rem) {
  .md\:p-4 { padding: var(--hg-spacing-4); }
}

/* Tipografías */
@media (min-width: 0rem) {
  .h2 {
    font-family: var(--hg-typo-font-family-primary);
    font-size: var(--hg-typo-font-size-18);
    line-height: var(--hg-typo-line-height-1-2);
  }
}

@media (min-width: 64rem) {
  .h2 {
    font-size: var(--hg-typo-font-size-24);
  }
}
```

## 🔑 Características técnicas

### Variables compartidas

Las variables se generan basándose en **valores únicos**, no en clases:
- Múltiples clases con `fontWeight: "900"` → una sola variable `--hg-typo-font-weight-900`
- Optimiza el CSS eliminando duplicados

### Conversión px → rem

- `fontSize` en JSON: `"18px"` → CSS: `1.125rem` (usando `baseFontSize: 16`)
- Nombre de variable mantiene el valor original: `--hg-typo-font-size-18`

### Nombres de variables

Patrón: `--{prefix}-{category}-{propiedad}-{valor}`

Ejemplos:
- `--hg-typo-font-family-primary`
- `--hg-typo-font-size-18`
- `--hg-spacing-4`

## 🐛 Solución de problemas

**Error: "Archivo de configuración no encontrado"**
```bash
npx holygrail5 --config=./ruta/config.json
```

**Error: "La configuración debe tener un objeto 'classes'"**
Verifica que `config.json` tenga la propiedad `classes` con al menos una clase.

**Error: "La clase debe tener al menos un breakpoint"**
Cada clase debe tener al menos `mobile` o `desktop`.

## 🌐 GitHub Pages

Despliegue automático con GitHub Actions:

1. Habilita GitHub Pages en Settings → Pages (Source: GitHub Actions)
2. El workflow (`.github/workflows/deploy.yml`) se ejecuta automáticamente en cada push
3. Los archivos se generan en `docs/` y se despliegan automáticamente

## 📚 Recursos

- **Repositorio**: [GitHub](https://github.com/holygrailcss/holygrail5.git)
- **Licencia**: MIT

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Hecho con ❤️ por HolyGrail CSS**
