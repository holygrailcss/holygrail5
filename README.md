# HolyGrail5

Framework CSS generator con Node.js que genera CSS optimizado con variables CSS compartidas desde un archivo JSON de configuración.

## ⚖️ En resumen

| Aspecto                  | Solo Tailwind                                                                 | Híbrido                              |
|--------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------|
| Velocidad de desarrollo  | 🔥 Muy alta                                                                   | 🔥 Alta                                                            |
| Consistencia visual      | ⚠️ Difícil mantener si hay muchas utilidades                                 | ✅ Mantienes branding y coherencia                                  |
| Escalabilidad            | ⚠️ Costoso en proyectos grandes                                               | ✅ Fácil de mantener                                                |
| Curva de aprendizaje     | Media                                                                         | Baja si ya vienes de BEM/SCSS                                      |
| Control sobre design system   | ❌ Limitado                                                            | ✅ Total                                                           |
| Performance CSS final    | ✅ Muy buena                                                                   | ✅ Muy buena                                                       |



## ✨ Características

- 🎨 **CSS optimizado** con variables CSS compartidas (mínimas y eficientes)
- 📱 **Soporte responsive** con breakpoints personalizables (mobile/desktop)
- 🔧 **Configuración simple** mediante JSON
- 📊 **Guía HTML interactiva** generada automáticamente con detección de cambios
- 🎯 **Variables compartidas** basadas en valores únicos
- 🔄 **Conversión automática** de px a rem
- 🛠️ **Helpers de spacing** (padding y margin) estilo Tailwind con propiedades lógicas (RTL)
- 🎨 **Sistema de colores** con variables CSS
- 📐 **Helpers de layout** (display, flexbox, alignment, gap)
- 👀 **Modo watch** para desarrollo con regeneración automática
- ✅ **Validación robusta** de configuración
- 🧪 **Suite de tests** incluida
- 🔍 **Gestión de variables CSS** con historial persistente

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
# Uso básico (genera en dist/)
npx holygrail5
# o
npm run generate

# Con argumentos personalizados
npx holygrail5 --config=./config.json --output=./dist/output.css --html=./dist/index.html
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

# Desarrollo completo (watch + servidor HTTP en localhost:3000)
npm run dev

# Solo servidor HTTP (sirve desde dist/ como raíz)
npm run serve

# Generar y abrir servidor
npm run start
```

**Nota:** El servidor sirve desde `dist/` como raíz, así que la URL será `http://localhost:3000/index.html` (sin mostrar "dist" en la URL).

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
    "desktop": "992px"
  },
  "spacingMap": {
    "0": "0",
    "4": "4px",
    "8": "8px",
    "16": "16px",
    "24": "24px",
    "32": "32px"
  },
  "spacingImportant": ["0"],
  "colors": {
    "white": "#ffffff",
    "black": "#000000",
    "primary": "#000000",
    "error": "#b40016"
  },
  "helpers": {
    "display": {
      "property": "display",
      "class": "d",
      "responsive": true,
      "description": "Tipo de caja de renderizado",
      "values": ["contents", "inline", "inline-block", "block", "flex", "inline-flex", "none"]
    },
    "flex-direction": {
      "property": "flex-direction",
      "class": "flex",
      "responsive": true,
      "description": "Dirección del eje principal",
      "values": {
        "row": "row",
        "column": "column"
      }
    }
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
| `prefix` | string | `"hg"` | Prefijo para variables CSS (ej: `--hg-typo-...`) |
| `category` | string | `"typo"` | Categoría para variables CSS |
| `baseFontSize` | number | `16` | Tamaño base para conversión px→rem |
| `fontFamilyMap` | object | - | Mapeo de nombres a fuentes CSS |
| `breakpoints` | object | **Requerido** | Breakpoints mobile/desktop |
| `spacingMap` | object | - | Valores de spacing para helpers (px o %) |
| `spacingImportant` | array | - | Valores de spacing que usan `!important` |
| `colors` | object | - | Paleta de colores (nombre → hex) |
| `helpers` | object | - | Helpers de layout (display, flexbox, etc.) |
| `classes` | object | **Requerido** | Clases CSS de tipografía a generar |

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

### `dist/output.css`

CSS generado con estructura organizada:

1. **Reset CSS Mínimo** - Normalización básica
2. **Variables CSS Compartidas** (`:root`) - Variables para:

   - Font families
   - Font sizes
   - Line heights
   - Font weights
   - Letter spacing
   - Text transform
   - Spacing values
   - Colors
3. **Helpers de Spacing (Mobile)** - Padding y margin con propiedades lógicas
4. **Helpers de Spacing (Desktop)** - Versiones `md:` con media queries
5. **Layout Helpers** - Display, flexbox, alignment, gap
6. **Tipografías (Mobile)** - Clases responsive para mobile
7. **Tipografías (Desktop)** - Clases responsive para desktop
   - Font families
   - Font sizes
   - Line heights
   - Font weights
   - Letter spacing
   - Text transform
   - Spacing values
   - Colors
3. **Helpers de Spacing (Mobile)** - Padding y margin con propiedades lógicas
4. **Helpers de Spacing (Desktop)** - Versiones `md:` con media queries
5. **Layout Helpers** - Display, flexbox, alignment, gap
6. **Tipografías (Mobile)** - Clases responsive para mobile
7. **Tipografías (Desktop)** - Clases responsive para desktop

### `dist/index.html`

Guía HTML interactiva generada en la carpeta `dist/` con:

- 🎨 **Sección de Colores** - Grid visual con preview de colores
- 🔤 **Font Families** - Tabla con preview de fuentes
- 📝 **Clases de Tipografía** - Tabla completa con preview y valores responsive
- 🔗 **Variables CSS Compartidas** - Todas las variables generadas
- 📏 **Helpers de Spacing** - Tabla con clases y variables
- 📐 **Helpers de Layout** - Tabla con clases base y responsive (`md:`)
- 📱 **Breakpoints** - Configuración de breakpoints
- 🔍 **Búsqueda en tiempo real** - Filtra y resalta contenido
- 🎯 **Detección de cambios** - Valores modificados se resaltan en verde
- 📌 **Header sticky** - Navegación siempre visible
- 📋 **Menú lateral** - Navegación rápida entre secciones
- 📊 **Metadata** - Último commit y versión del package

## 🎯 Helpers de Spacing

Genera clases estilo Tailwind para padding y margin con **propiedades lógicas** para soporte RTL automático:

```css
/* Mobile - Propiedades lógicas */
.p-4 { padding: var(--hg-spacing-4); }
.pr-4 { padding-inline-end: var(--hg-spacing-4); }
.pl-4 { padding-inline-start: var(--hg-spacing-4); }
.m-8 { margin: var(--hg-spacing-8); }
.mr-8 { margin-inline-end: var(--hg-spacing-8); }
.ml-8 { margin-inline-start: var(--hg-spacing-8); }

/* Desktop (md:) - Con media query */
@media (min-width: 62rem) {
  .md\:p-4 { padding: var(--hg-spacing-4); }
  .md\:pr-8 { padding-inline-end: var(--hg-spacing-8); }
}
```

> **Nota:** Las propiedades `pr`/`pl` y `mr`/`ml` usan `padding-inline-end/start` y `margin-inline-end/start` para soporte RTL automático.

## 🎨 Sistema de Colores

Define colores en `config.json` y se generan como variables CSS:

```json
{
  "colors": {
    "white": "#ffffff",
    "black": "#000000",
    "primary": "#000000",
    "error": "#b40016",
    "success": "#76ae4a"
  }
}
```

**CSS generado:**

```css
:root {
  --hg-color-white: #ffffff;
  --hg-color-black: #000000;
  --hg-color-primary: #000000;
  --hg-color-error: #b40016;
  --hg-color-success: #76ae4a;
}
```

**Uso:**

```css
.my-element {
  background-color: var(--hg-color-primary);
  color: var(--hg-color-white);
}
```

## 📐 Helpers de Layout

Genera helpers para display, flexbox, alignment y gap:

```json
{
  "helpers": {
    "display": {
      "property": "display",
      "class": "d",
      "responsive": true,
      "description": "Tipo de caja de renderizado",
      "values": ["flex", "block", "none"]
    },
    "flex-direction": {
      "property": "flex-direction",
      "class": "flex",
      "responsive": true,
      "description": "Dirección del eje principal",
      "values": {
        "row": "row",
        "column": "column"
      }
    }
  }
}
```

**CSS generado:**

```css
.hg-d-flex { display: flex; }
.hg-d-block { display: block; }
.hg-flex-row { flex-direction: row; }
.hg-flex-column { flex-direction: column; }

@media (min-width: 992px) {
  .md\:hg-d-flex { display: flex; }
  .md\:hg-flex-row { flex-direction: row; }
}
```

## 🔍 Gestión de Variables CSS

El generador mantiene un historial de todas las variables CSS generadas en `.data/.historical-variables.json` para que nunca se eliminen automáticamente, incluso si se borran las clases que las usaban.

### Comandos disponibles

```bash
# Listar variables no usadas
npm run vars:list
# o
node src/cli-variables.js list

# Ver reporte completo de variables
npm run vars:report
# o
node src/cli-variables.js report

# Eliminar una variable específica del historial
npm run vars:remove -- --hg-typo-font-size-18
# o
node src/cli-variables.js remove --hg-typo-font-size-18

# Eliminar todas las variables no usadas del historial
npm run vars:remove-all-unused
# o
node src/cli-variables.js remove-all-unused

# Mostrar todas las variables históricas almacenadas
npm run vars:show-all
# o
node src/cli-variables.js show-all
```

### Ejemplo de uso

```bash
# 1. Generar CSS
npm run generate

# 2. Ver qué variables no se están usando
npm run vars:list

# 3. Eliminar variables no usadas
npm run vars:remove-all-unused

# 4. Regenerar CSS sin las variables eliminadas
npm run generate
```

### Opciones avanzadas

```bash
# Especificar ruta personalizada del CSS
node src/cli-variables.js report --css=./dist/output.css

# Especificar ruta personalizada del historial
node src/cli-variables.js list --history=./.data/.custom-variables.json
```

## 🔧 Scripts NPM

| Script | Descripción |
|--------|-------------|
| `npm run generate` | Genera CSS y HTML en `dist/` |
| `npm run watch` | Modo watch (regenera al cambiar config.json) |
| `npm run dev` | Watch + servidor HTTP en localhost:3000 |
| `npm run serve` | Solo servidor HTTP (sirve desde dist/) |
| `npm run start` | Genera y abre servidor HTTP |
| `npm run test` | Ejecuta la suite de tests |
| `npm run vars:list` | Lista variables CSS no usadas |
| `npm run vars:report` | Reporte completo de variables |
| `npm run vars:remove` | Elimina una variable del historial |
| `npm run vars:remove-all-unused` | Elimina todas las variables no usadas |
| `npm run vars:show-all` | Muestra todas las variables históricas |

## 🏗️ Estructura del proyecto

```
holygrail5/
├── generator.js              # Orquestador principal
├── config.json               # Configuración del proyecto
├── package.json              # Dependencias y scripts
├── README.md                 # Este archivo
├── .data/                    # Archivos de estado (gitignored)
│   ├── .previous-values.json      # Valores previos para detección de cambios
│   └── .historical-variables.json # Historial de variables CSS
├── dist/                     # Archivos generados (gitignored)
│   ├── output.css           # CSS generado
│   └── index.html           # Guía HTML interactiva
├── docs/                     # Para GitHub Pages (gitignored)
│   ├── output.css
│   └── index.html
├── src/
│   ├── config.js            # Carga y validación de configuración
│   ├── parser.js            # Generación de CSS desde JSON
│   ├── guide.js             # Generación de guía HTML interactiva
│   ├── utils.js             # Utilidades compartidas (px→rem, etc.)
│   ├── variables-manager.js # Gestión de variables CSS históricas
│   ├── cli-variables.js     # CLI para gestión de variables
│   ├── watch.js             # Modo watch para desarrollo
│   └── dev.js               # Script de desarrollo (watch + servidor)
└── tests/
    ├── run-all.js           # Ejecutor de todos los tests
    ├── config.test.js       # Tests de configuración
    ├── parser.test.js       # Tests del parseador
    ├── guide.test.js        # Tests de la guía HTML
    └── utils.test.js        # Tests de utilidades
```

## 🎨 Ejemplo de CSS generado

```css
/* Reset CSS Mínimo */
html {
  box-sizing: border-box;
  font-size: 16px;
}

/* Variables CSS Compartidas */
:root {
  --hg-typo-font-family-primary: arial, sans-serif;
  --hg-typo-font-size-18: 1.125rem;
  --hg-typo-font-size-24: 1.5rem;
  --hg-typo-line-height-1-2: 1.2;
  --hg-spacing-4: 0.25rem;
  --hg-spacing-8: 0.5rem;
  --hg-color-white: #ffffff;
  --hg-color-primary: #000000;
}

/* Helpers de Spacing - Mobile */
.p-4 { padding: var(--hg-spacing-4); }
.pr-4 { padding-inline-end: var(--hg-spacing-4); }
.pl-4 { padding-inline-start: var(--hg-spacing-4); }
.m-8 { margin: var(--hg-spacing-8); }

/* Helpers de Spacing - Desktop (md:) */
@media (min-width: 62rem) {
  .md\:p-4 { padding: var(--hg-spacing-4); }
  .md\:pr-8 { padding-inline-end: var(--hg-spacing-8); }
}

/* Layout Helpers */
.hg-d-flex { display: flex; }
.hg-flex-row { flex-direction: row; }
.hg-justify-center { justify-content: center; }
.hg-items-center { align-items: center; }
.hg-gap-16 { gap: 1rem; }

@media (min-width: 992px) {
  .md\:hg-d-flex { display: flex; }
  .md\:hg-flex-row { flex-direction: row; }
}

/* Tipografías - Mobile */
@media (min-width: 0rem) {
  .h2 {
    font-family: var(--hg-typo-font-family-primary);
    font-size: var(--hg-typo-font-size-18);
    line-height: var(--hg-typo-line-height-1-2);
  }
}

/* Tipografías - Desktop */
@media (min-width: 62rem) {
  .h2 {
    font-size: var(--hg-typo-font-size-24);
  }
}
```

## 🔑 Características técnicas

#### Variables compartidas

Las variables se generan basándose en **valores únicos**, no en clases:

- Múltiples clases con `fontWeight: "900"` → una sola variable `--hg-typo-font-weight-900`
- Optimiza el CSS eliminando duplicados
- Historial persistente en `.data/.historical-variables.json`

#### Conversión px → rem

- `fontSize` en JSON: `"18px"` → CSS: `1.125rem` (usando `baseFontSize: 16`)
- Nombre de variable mantiene el valor original: `--hg-typo-font-size-18`
- Conversión automática para todos los valores en píxeles

#### Nombres de variables

Patrón: `--{prefix}-{category}-{propiedad}-{valor}`

Ejemplos:

- `--hg-typo-font-family-primary`
- `--hg-typo-font-size-18`
- `--hg-spacing-4`
- `--hg-color-white`

#### Propiedades lógicas (RTL)

Los helpers de spacing usan propiedades lógicas para soporte RTL automático:

- `pr-4` → `padding-inline-end` (no `padding-right`)
- `pl-4` → `padding-inline-start` (no `padding-left`)
- `mr-8` → `margin-inline-end` (no `margin-right`)
- `ml-8` → `margin-inline-start` (no `margin-left`)

## 📊 Guía HTML Interactiva

La guía HTML generada en `dist/index.html` incluye:

#### Características

- 🎨 **Grid de colores** - Visualización de la paleta de colores con preview
- 🔤 **Font Families** - Tabla con preview de fuentes
- 📝 **Tipografía** - Tabla completa con preview y valores mobile/desktop
- 🔗 **Variables CSS** - Todas las variables generadas con valores
- 📏 **Helpers de Spacing** - Clases y variables de padding/margin
- 📐 **Helpers de Layout** - Display, flexbox, alignment, gap
- 📱 **Breakpoints** - Configuración de breakpoints

#### Funcionalidades interactivas

- 🔍 **Búsqueda en tiempo real** - Filtra y resalta contenido en todas las tablas
- 🎯 **Detección de cambios** - Valores modificados se resaltan en verde
- 📌 **Header sticky** - Navegación y búsqueda siempre visibles
- 📋 **Menú lateral** - Navegación rápida con scroll suave
- 📊 **Metadata** - Último commit de Git y versión del package
- 🔄 **Cache busting** - Timestamp en CSS para forzar recarga

## 🐛 Solución de problemas

**Error: "Archivo de configuración no encontrado"**

```bash
npx holygrail5 --config=./ruta/config.json
```

**Error: "La configuración debe tener un objeto 'classes'"**

Verifica que `config.json` tenga la propiedad `classes` con al menos una clase.

**Error: "La clase debe tener al menos un breakpoint"**

Cada clase debe tener al menos `mobile` o `desktop`.

**El servidor no muestra los cambios**

- Recarga con `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows/Linux)
- Verifica que el modo watch esté activo si usas `npm run dev`

**Variables no se detectan como no usadas**

Ejecuta `npm run generate` primero para actualizar el historial de variables.

## 🌐 GitHub Pages

Despliegue automático con GitHub Actions:

1. Habilita GitHub Pages en Settings → Pages (Source: GitHub Actions)
2. El workflow (`.github/workflows/deploy.yml`) se ejecuta automáticamente en cada push
3. Los archivos se generan en `docs/` y se despliegan automáticamente

> **Nota:** El workflow genera archivos en `docs/` para GitHub Pages, mientras que el desarrollo local usa `dist/`.

## 📚 Recursos

- **Repositorio**: [GitHub](https://github.com/holygrailcss/holygrail5.git)
- **Licencia**: MIT
- **Node.js**: Requiere >=12.0.0

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.2
- ✅ Sistema de colores con variables CSS
- ✅ Helpers de layout (display, flexbox, alignment, gap)
- ✅ Propiedades lógicas para soporte RTL
- ✅ Guía HTML mejorada con grid de colores
- ✅ Búsqueda interactiva en la guía
- ✅ Header sticky y menú lateral
- ✅ Reorganización del proyecto (`.data/` para archivos de estado)
- ✅ Archivos generados en `dist/`

---

**Hecho con ❤️ por HolyGrail CSS**
