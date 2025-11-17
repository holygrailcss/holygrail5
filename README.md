# HolyGrail5

[![npm version](https://img.shields.io/npm/v/holygrail5.svg)](https://www.npmjs.com/package/holygrail5)
[![npm downloads](https://img.shields.io/npm/dm/holygrail5.svg)](https://www.npmjs.com/package/holygrail5)

Framework CSS generator con Node.js que genera CSS optimizado con variables CSS compartidas desde un archivo JSON de configuración.

## 📦 Instalación

```bash
# Instalación global
npm install -g holygrail5

# Instalación local
npm install holygrail5
```

## 🚀 Inicio Rápido

```bash
# 1. Generar CSS y HTML
npx holygrail5

# 2. Ver la guía interactiva
npm run serve
# Abre http://localhost:3000/index.html
```

## ✨ Características Principales

- 🎨 **CSS optimizado** con variables CSS compartidas (mínimas y eficientes)
- 📱 **Soporte responsive** con breakpoints personalizables (mobile/desktop)
- 🔧 **Configuración simple** mediante JSON
- 📊 **Guía HTML interactiva** generada automáticamente con detección de cambios
- 🛠️ **Helpers de spacing** estilo Tailwind con propiedades lógicas (RTL)
- 🎨 **Sistema de colores** con variables CSS
- 📐 **Helpers de layout** (display, flexbox, alignment, gap)
- 👀 **Modo watch** para desarrollo con regeneración automática
- 🔍 **Gestión de variables CSS** con historial persistente

## ⚖️ ¿Por qué HolyGrail5?

| Aspecto                  | Solo Tailwind                                                                 | HolyGrail5 (Híbrido)                              |
|--------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------|
| Velocidad de desarrollo  | 🔥 Muy alta                                                                   | 🔥 Alta                                                            |
| Consistencia visual      | ⚠️ Difícil mantener si hay muchas utilidades                                 | ✅ Mantienes branding y coherencia                                  |
| Escalabilidad            | ⚠️ Costoso en proyectos grandes                                               | ✅ Fácil de mantener                                                |
| Curva de aprendizaje     | Media                                                                         | Baja si ya vienes de BEM/SCSS                                      |
| Control sobre design system   | ❌ Limitado                                                            | ✅ Total                                                           |
| Performance CSS final    | ✅ Muy buena                                                                   | ✅ Muy buena                                                       |

## 📖 Uso

### CLI

```bash
# Uso básico (genera en dist/)
npx holygrail5
# o
npm run build

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

### Scripts de Desarrollo

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

> **Nota:** El servidor sirve desde `dist/` como raíz, así que la URL será `http://localhost:3000/index.html` (sin mostrar "dist" en la URL).

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
    "24": "24px"
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
      "values": ["flex", "block", "none"]
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

### Propiedades Globales

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

### Propiedades de Clases

**Base (aplicadas a todos los breakpoints):**

- `fontFamily`: Familia de fuente
- `fontWeight`: Peso de fuente (100, 400, 700, 900)
- `letterSpacing`: Espaciado entre letras (ej: "0rem")
- `textTransform`: Transformación (none, uppercase, lowercase)

**Responsive (por breakpoint):**

- `mobile`: `{ fontSize: "18px", lineHeight: "1.2" }`
- `desktop`: `{ fontSize: "24px", lineHeight: "1.5" }`

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

## 📄 Archivos Generados

### `dist/output.css`

CSS generado con estructura organizada:

1. **Reset CSS Mínimo** - Normalización básica
2. **Variables CSS Compartidas** (`:root`) - Variables para:
   - Font families, font sizes, line heights
   - Font weights, letter spacing, text transform
   - Spacing values, colors
3. **Helpers de Spacing (Mobile)** - Padding y margin con propiedades lógicas
4. **Helpers de Spacing (Desktop)** - Versiones `md:` con media queries
5. **Layout Helpers** - Display, flexbox, alignment, gap
6. **Tipografías (Mobile)** - Clases responsive para mobile
7. **Tipografías (Desktop)** - Clases responsive para desktop

### `dist/index.html`

Guía HTML interactiva generada automáticamente con:

- 🎨 **Grid de colores** - Visualización de la paleta de colores con preview
- 🔤 **Font Families** - Tabla con preview de fuentes
- 📝 **Clases de Tipografía** - Tabla completa con preview y valores responsive
- 🔗 **Variables CSS Compartidas** - Todas las variables generadas
- 📏 **Helpers de Spacing** - Tabla con clases y variables
- 📐 **Helpers de Layout** - Tabla con clases base y responsive (`md:`)
- 📱 **Breakpoints** - Configuración de breakpoints
- 🔍 **Búsqueda en tiempo real** - Filtra y resalta contenido
- 🎯 **Detección de cambios** - Valores modificados se resaltan en verde
- 📌 **Header sticky** - Navegación siempre visible
- 📋 **Menú lateral** - Navegación rápida con scroll suave
- 📊 **Metadata** - Último commit y versión del package

## 🔍 Gestión de Variables CSS

El generador mantiene un historial de todas las variables CSS generadas en `.data/.historical-variables.json` para que nunca se eliminen automáticamente, incluso si se borran las clases que las usaban.

### Comandos Disponibles

```bash
# Listar variables no usadas
npm run vars:list

# Ver reporte completo de variables
npm run vars:report

# Eliminar una variable específica del historial
npm run vars:remove -- --hg-typo-font-size-18

# Eliminar todas las variables no usadas del historial
npm run vars:remove-all-unused

# Mostrar todas las variables históricas almacenadas
npm run vars:show-all
```

### Ejemplo de Uso

```bash
# 1. Generar CSS
npm run build

# 2. Ver qué variables no se están usando
npm run vars:list

# 3. Eliminar variables no usadas
npm run vars:remove-all-unused

# 4. Regenerar CSS sin las variables eliminadas
npm run build
```

### Opciones Avanzadas

```bash
# Especificar ruta personalizada del CSS
node src/cli-variables.js report --css=./dist/output.css

# Especificar ruta personalizada del historial
node src/cli-variables.js list --history=./.data/.custom-variables.json
```

## 🔧 Scripts NPM

| Comando | Descripción |
|--------|-------------|
| `npm run build` | Genera CSS y HTML en `dist/` |
| `npm run dev` | Watch + servidor HTTP en localhost:8080 |
| `npm test` | Ejecuta la suite de tests |
| `npm run vars:report` | Reporte completo de variables |
| `npm run vars:remove-unused` | Elimina todas las variables no usadas |

## 🔑 Características Técnicas

### Variables Compartidas

Las variables se generan basándose en **valores únicos**, no en clases:

- Múltiples clases con `fontWeight: "900"` → una sola variable `--hg-typo-font-weight-900`
- Optimiza el CSS eliminando duplicados
- Historial persistente en `.data/.historical-variables.json`

### Conversión px → rem

- `fontSize` en JSON: `"18px"` → CSS: `1.125rem` (usando `baseFontSize: 16`)
- Nombre de variable mantiene el valor original: `--hg-typo-font-size-18`
- Conversión automática para todos los valores en píxeles

### Nombres de Variables

Patrón: `--{prefix}-{category}-{propiedad}-{valor}`

Ejemplos:

- `--hg-typo-font-family-primary`
- `--hg-typo-font-size-18`
- `--hg-spacing-4`
- `--hg-color-white`

### Propiedades Lógicas (RTL)

Los helpers de spacing usan propiedades lógicas para soporte RTL automático:

- `pr-4` → `padding-inline-end` (no `padding-right`)
- `pl-4` → `padding-inline-start` (no `padding-left`)
- `mr-8` → `margin-inline-end` (no `margin-right`)
- `ml-8` → `margin-inline-start` (no `margin-left`)

## 🎨 Ejemplo de CSS Generado

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

## 🏗️ Estructura del Proyecto

```
holygrail5/
├── generate-css.js           # Orquestador principal
├── config.json               # Configuración del proyecto
├── package.json              # Dependencias y scripts
├── README.md                 # Este archivo
├── .data/                    # Archivos de estado (gitignored)
│   ├── .previous-values.json      # Valores previos para detección de cambios
│   └── .historical-variables.json # Historial de variables CSS
├── dist/                     # Archivos generados (gitignored)
│   ├── output.css           # CSS generado
│   ├── index.html           # Guía HTML interactiva
│   └── themes/              # Temas compilados
│       └── dutti.css        # Tema Dutti compilado
├── src/
│   ├── config-loader.js     # Carga y validación de configuración
│   ├── css-generator.js     # Orquestador de generadores CSS
│   ├── html-generator.js    # Generación de guía HTML interactiva
│   ├── helpers.js           # Utilidades compartidas (px→rem, etc.)
│   ├── variables-tracker.js # Gestión de variables CSS históricas
│   ├── variables-cli.js     # CLI para gestión de variables
│   ├── watch-config.js      # Modo watch para desarrollo
│   ├── dev-server.js        # Script de desarrollo (watch + servidor)
│   └── generators/          # Generadores especializados
│       ├── reset-generator.js      # Genera Reset CSS
│       ├── variables-generator.js  # Genera variables CSS
│       ├── typography-generator.js # Genera clases de tipografía
│       ├── spacing-generator.js    # Genera helpers de spacing
│       ├── layout-generator.js     # Genera helpers de layout
│       └── grid-generator.js       # Genera sistema de grid
├── themes/                   # Temas personalizables
│   └── dutti/               # Tema Dutti
│       ├── _variables.css   # Variables del tema
│       ├── _buttons.css     # Estilos de botones
│       ├── _inputs.css      # Estilos de inputs
│       └── ...              # Otros componentes
└── tests/
    ├── run-all.js              # Ejecutor de todos los tests
    ├── config-loader.test.js   # Tests de carga de configuración
    ├── css-generator.test.js   # Tests del generador CSS
    ├── html-generator.test.js  # Tests de la guía HTML
    └── helpers.test.js         # Tests de utilidades
```

## 🐛 Solución de Problemas

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

Ejecuta `npm run build` primero para actualizar el historial de variables.

## 🌐 GitHub Pages

Para desplegar en GitHub Pages, puedes:

1. Configurar GitHub Pages para usar la carpeta `dist/` como fuente
2. O crear un workflow de GitHub Actions que genere los archivos en `docs/` automáticamente

**Opción 1 - Usar dist/ directamente:**

- En Settings → Pages, selecciona la rama y carpeta `dist/`

**Opción 2 - Workflow automático:**

- Crea `.github/workflows/deploy.yml` que ejecute `npm run build` y copie archivos a `docs/`

## 📚 Recursos

- **Repositorio**: [GitHub](https://github.com/holygrailcss/holygrail5.git)
- **npm**: [holygrail5](https://www.npmjs.com/package/holygrail5)
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

## 🚀 ¿Por qué HolyGrail5? Evolución desde HolyGrail CSS (SASS)

### El Problema con SASS

HolyGrail CSS original se basaba en **SASS/SCSS**, lo que presentaba varios desafíos:

#### Limitaciones de SASS

1. **Dependencia de compilación**: Requiere herramientas de build (Gulp, Webpack, etc.) y procesos de compilación
2. **Curva de aprendizaje**: Necesitas conocer SASS/SCSS para personalizar
3. **Configuración compleja**: Variables SASS dispersas en múltiples archivos
4. **Sin documentación automática**: No genera guías visuales de las clases disponibles
5. **Mantenimiento manual**: Cambios en variables requieren editar código SASS directamente
6. **Sin historial**: No hay gestión automática de variables no usadas
7. **Menos portable**: Depende del ecosistema SASS y sus herramientas

### La Solución: HolyGrail5

HolyGrail5 nace de la necesidad de **simplificar, modernizar y potenciar** el framework original.

#### Ventajas Clave de HolyGrail5

##### 1. **Configuración Declarativa con JSON**

**Antes (SASS):**
```scss
// Variables dispersas en múltiples archivos
$font-size-mobile: 18px;
$font-size-desktop: 24px;
$spacing-16: 16px;
// ... más variables en diferentes archivos
```

**Ahora (JSON):**
```json
{
  "classes": {
    "h2": {
      "mobile": { "fontSize": "18px" },
      "desktop": { "fontSize": "24px" }
    }
  },
  "spacingMap": { "16": "16px" }
}
```

✅ **Ventaja**: Todo en un solo archivo, fácil de entender y modificar

##### 2. **Sin Dependencias de Build Complejas**

**Antes (SASS):**
- Requiere Gulp/Webpack/Grunt
- Configuración de compilación
- Dependencias de Node.js específicas
- Procesos de build complejos

**Ahora (HolyGrail5):**
```bash
npm run build
# ¡Listo! CSS generado
```

✅ **Ventaja**: Un solo comando, sin configuración de build

##### 3. **Guía Interactiva Automática**

**Antes (SASS):**
- Documentación manual
- Sin preview visual
- Difícil saber qué clases están disponibles

**Ahora (HolyGrail5):**
- Guía HTML generada automáticamente
- Preview visual de todas las clases
- Búsqueda en tiempo real
- Detección de cambios

✅ **Ventaja**: Documentación siempre actualizada y visual

##### 4. **Gestión Inteligente de Variables**

**Antes (SASS):**
- Variables se eliminan si no se usan
- Puede romper CSS personalizado
- Sin historial

**Ahora (HolyGrail5):**
- Historial persistente de variables
- Nunca se eliminan automáticamente
- Comandos para gestionar variables no usadas
- Protege tu CSS personalizado

✅ **Ventaja**: Seguridad y control total sobre las variables

##### 5. **Variables CSS Nativas (No SASS)**

**Antes (SASS):**
```scss
// Variables SASS (solo en compilación)
$primary-color: #000000;
.my-class {
  color: $primary-color; // Compilado a CSS estático
}
```

**Ahora (HolyGrail5):**
```css
/* Variables CSS nativas (runtime) */
:root {
  --hg-color-primary: #000000;
}
.my-class {
  color: var(--hg-color-primary); // Cambiable en runtime
}
```

✅ **Ventaja**: Variables CSS nativas, modificables en runtime, mejor rendimiento

##### 6. **Optimización Automática**

**Antes (SASS):**
- Duplicación de valores en múltiples lugares
- CSS más pesado
- Sin deduplicación automática

**Ahora (HolyGrail5):**
- Variables compartidas automáticamente
- Un valor único → una variable CSS
- CSS más pequeño y eficiente

✅ **Ventaja**: CSS optimizado automáticamente, menos código

##### 7. **Modo Watch Integrado**

**Antes (SASS):**
- Requiere configurar watch en Gulp/Webpack
- Configuración adicional necesaria

**Ahora (HolyGrail5):**
```bash
npm run dev
# Regenera automáticamente al cambiar config.json
```

✅ **Ventaja**: Watch listo para usar, sin configuración

##### 8. **Portabilidad y Simplicidad**

**Antes (SASS):**
- Múltiples archivos SASS
- Estructura compleja
- Dependencias de herramientas de build

**Ahora (HolyGrail5):**
- Un solo archivo JSON de configuración
- Estructura simple y clara
- Solo Node.js (sin SASS, Gulp, etc.)

✅ **Ventaja**: Más fácil de entender, mantener y compartir

##### 9. **Mejor para Equipos**

**Antes (SASS):**
- Solo desarrolladores que conocen SASS pueden modificar
- Cambios requieren conocimiento técnico

**Ahora (HolyGrail5):**
- Cualquiera puede editar JSON
- Cambios visibles inmediatamente
- Menos barrera de entrada

✅ **Ventaja**: Colaboración más fácil, menos dependencia de desarrolladores

##### 10. **Ecosistema Moderno**

**Antes (SASS):**
- Tecnología más antigua
- Menos integración con herramientas modernas
- Ecosistema SASS en declive

**Ahora (HolyGrail5):**
- Tecnología moderna (Node.js, JSON, CSS Variables)
- Mejor integración con herramientas actuales
- Alineado con estándares web modernos

✅ **Ventaja**: Framework preparado para el futuro

##### 11. **Separación de Componentes y Flexibilidad**

**Antes (HolyGrail CSS con Angular):**
- Framework acoplado a Angular
- Componentes incluidos (botones, cards, etc.) que aumentaban el peso
- CSS pesado con estilos de componentes que no siempre se usaban
- Difícil integrar otras librerías de componentes
- Dependencia de Angular y sus componentes

**Ahora (HolyGrail5):**
- **Solo CSS puro**: Sin dependencias de frameworks
- **Sin componentes incluidos**: Solo clases de utilidad y layout
- **CSS ligero**: Solo lo esencial (tipografía, spacing, layout, grid)
- **Integración flexible**: Puedes usar cualquier librería de componentes
- **Compatible con MDS de Inditex**: Diseñado para trabajar junto con sistemas de componentes externos

✅ **Ventaja**: Framework ligero, flexible y compatible con cualquier librería de componentes

##### 12. **Maquetación con IA**

**Antes (SASS + Angular):**
- Estructura compleja difícil de entender para IA
- Código SASS disperso
- Componentes acoplados
- Difícil generar código automáticamente

**Ahora (HolyGrail5):**
- **Configuración JSON clara**: Fácil de entender y generar por IA
- **Clases semánticas**: Nomenclatura clara y predecible
- **Superprompt disponible**: Guía completa para que IA genere código correcto
- **Estructura simple**: Patrones claros y repetibles

✅ **Ventaja**: Perfecto para maquetación asistida por IA, generación automática de código

### Separación de Responsabilidades

HolyGrail5 adopta una **filosofía de separación de responsabilidades**:

#### Lo que INCLUYE HolyGrail5:
- ✅ Sistema de tipografía
- ✅ Helpers de spacing (padding, margin)
- ✅ Helpers de layout (flexbox, grid)
- ✅ Sistema de grid responsive
- ✅ Variables CSS para colores
- ✅ Reset CSS mínimo

#### Lo que NO incluye (y por qué es mejor):
- ❌ Componentes UI (botones, cards, modales, etc.)
- ❌ Estilos de formularios
- ❌ Estilos de navegación
- ❌ Estilos específicos de Angular/React/Vue

**Razón**: Esto permite:
1. **Usar MDS de Inditex** u otras librerías de componentes sin conflictos
2. **CSS más ligero**: Solo lo esencial
3. **Flexibilidad total**: Eliges tus propios componentes
4. **Mejor mantenimiento**: Cada cosa en su lugar

### Integración con MDS de Inditex

HolyGrail5 está diseñado para trabajar **perfectamente** junto con MDS (Massimo Dutti System) de Inditex:

```html
<!-- Usa HolyGrail5 para layout y spacing -->
<div class="row">
  <div class="col-xs-12 col-md-6">
    <!-- Usa componentes MDS para UI -->
    <mds-button variant="primary">Botón MDS</mds-button>
  </div>
</div>
```

**Ventajas de esta combinación:**
- ✅ HolyGrail5 maneja el layout y estructura
- ✅ MDS proporciona los componentes UI
- ✅ Sin conflictos de estilos
- ✅ Mejor de ambos mundos

### Maquetación con IA

HolyGrail5 es **ideal para maquetación asistida por IA** gracias a:

1. **Superprompt disponible**: Guía completa (`SUPERPROMPT.md`) que permite a la IA entender el sistema
2. **Nomenclatura clara**: Clases predecibles y semánticas
3. **Patrones simples**: Estructura fácil de seguir
4. **Configuración JSON**: Fácil de generar y modificar automáticamente

**Ejemplo de uso con IA:**
```
Prompt: "Crea una página de restaurante con header, hero, menú de platos y footer usando HolyGrail5"

La IA puede:
- Consultar SUPERPROMPT.md para entender las clases
- Generar HTML con las clases correctas
- Usar el grid system apropiado
- Aplicar spacing y layout helpers correctamente
```

✅ **Ventaja**: Acelera el desarrollo con generación automática de código

### Comparación Directa

| Característica | HolyGrail CSS (SASS) | HolyGrail5 | ¿Por qué HolyGrail5 es mejor? |
|----------------|----------------------|------------|------------------------------|
| **Configuración** | Múltiples archivos SASS dispersos | Un solo archivo JSON (`config.json`) | ✅ **Simplicidad**: Todo en un lugar, fácil de entender y modificar |
| **Compilación** | Requiere Gulp/Webpack y configuración compleja | `npm run build` (comando simple) | ✅ **Sin complejidad**: No necesitas configurar build tools |
| **Variables** | Variables SASS (compiladas, estáticas) | Variables CSS nativas (runtime, dinámicas) | ✅ **Flexibilidad**: Puedes cambiar valores en runtime con JavaScript |
| **Documentación** | Manual, requiere mantenimiento | Automática (HTML interactivo generado) | ✅ **Siempre actualizada**: Se genera automáticamente desde la configuración |
| **Gestión de variables** | Manual, propenso a errores | Automática con historial y herramientas CLI | ✅ **Seguridad**: Herramientas para detectar y eliminar variables no usadas |
| **Curva de aprendizaje** | Media-Alta (requiere conocer SASS) | Baja (solo JSON, fácil de entender) | ✅ **Accesibilidad**: Cualquiera puede editar sin conocimientos técnicos avanzados |
| **Portabilidad** | Media (depende de SASS y build tools) | Alta (solo Node.js, sin dependencias complejas) | ✅ **Fácil de mover**: Menos dependencias, más portable |
| **Optimización** | Manual (debes optimizar tú mismo) | Automática (elimina código no usado) | ✅ **Rendimiento**: CSS más pequeño automáticamente |
| **Watch mode** | Requiere configuración en Gulp/Webpack | Integrado (`npm run watch`) | ✅ **Desarrollo rápido**: Watch mode listo para usar |
| **Accesibilidad** | Solo desarrolladores con conocimientos SASS | Cualquiera puede editar (diseñadores, PMs, etc.) | ✅ **Colaboración**: Más personas pueden contribuir |
| **Componentes** | Incluidos (botones, cards, modales, etc.) | Separados (solo utilidades) | ✅ **Ligereza**: No incluye código que no uses |
| **Peso CSS** | Pesado (cientos de clases de componentes) | Ligero (solo utilidades esenciales) | ✅ **Rendimiento**: CSS más pequeño = páginas más rápidas |
| **Integración** | Acoplado a Angular | Compatible con cualquier librería | ✅ **Flexibilidad**: Puedes usar MDS, Material, Bootstrap, etc. |
| **Maquetación IA** | Difícil (estructura compleja) | Optimizado (JSON claro, superprompt) | ✅ **Futuro**: Perfecto para generación automática de código |

### Casos de Uso Ideales para HolyGrail5

✅ **Perfecto para:**
- Proyectos que buscan simplicidad
- Equipos con diferentes niveles técnicos
- Proyectos que necesitan documentación automática
- Aplicaciones que requieren variables CSS en runtime
- Proyectos que quieren evitar dependencias de build complejas
- Design systems que necesitan mantenimiento fácil
- **Proyectos que usan MDS de Inditex u otras librerías de componentes**
- **Maquetación asistida por IA**
- **Proyectos que necesitan CSS ligero sin componentes incluidos**

### Migración desde HolyGrail CSS (SASS)

Si vienes de HolyGrail CSS (SASS), la migración es sencilla:

1. **Extrae tus variables SASS** → Conviértelas a `config.json`
2. **Mantén tus clases HTML** → Son compatibles
3. **Regenera el CSS** → `npm run build`
4. **Disfruta de las nuevas características** → Guía interactiva, watch mode, etc.

### Arquitectura Ligera y Flexible

#### El Problema del Framework Anterior

El framework original (HolyGrail CSS) incluía:
- **Componentes de Angular**: Botones, cards, modales, etc.
- **CSS pesado**: Estilos de componentes que no siempre se necesitaban
- **Acoplamiento**: Dependencia de Angular y sus componentes
- **Poco flexible**: Difícil usar otras librerías de componentes

**Ejemplos de clases incluidas en el framework antiguo (que aumentaban el peso):**
```css
/* Formularios acoplados a Angular */
.form-input-label-2
.form-input-label-2.has-ico-pre
.form-input-label-2.has-ico-post
.validation-error-messages

/* Botones y links específicos */
.btn
.link-line
.link-svg-pre
.link-svg-post

/* Componentes de navegación */
.header-account-back
.mn-mainmenu
.mn-mainbar
.tabs-mini

/* Componentes UI */
.tooltip-sm
.toast
.md-accordion
.md-toggle
.bottom-sheet
.tag-product
.list-state

/* Soporte RTL específico */
.is-rtl .form-input-label-2
.is-rtl .btn
.is-rtl .tooltip-sm
/* ... y cientos más */
```

**Problema**: Estas clases ocupaban espacio en el CSS final aunque no se usaran, y creaban conflictos al intentar usar otras librerías de componentes como MDS.

#### La Solución: Separación de Responsabilidades

HolyGrail5 adopta el principio de **"hacer una cosa y hacerla bien"**:

**HolyGrail5 se enfoca en:**
- Layout y estructura (grid, flexbox)
- Spacing y tipografía
- Variables CSS compartidas
- Helpers de utilidad

**NO incluye:**
- Componentes UI (botones, cards, etc.)
- Estilos de formularios
- Estilos específicos de frameworks

**Resultado:**
- ✅ CSS más ligero (solo lo esencial)
- ✅ Compatible con MDS de Inditex
- ✅ Compatible con cualquier librería de componentes
- ✅ Flexibilidad total para elegir tus componentes

### Integración con MDS de Inditex

HolyGrail5 está diseñado específicamente para trabajar junto con **MDS (Massimo Dutti System)** de Inditex:

```html
<!-- Layout con HolyGrail5 -->
<div class="row">
  <div class="col-xs-12 col-md-6 p-16">
    <!-- Componentes de MDS -->
    <mds-button variant="primary">Reservar Mesa</mds-button>
    <mds-card>
      <mds-card-header>Título</mds-card-header>
      <mds-card-content>Contenido</mds-card-content>
    </mds-card>
  </div>
</div>
```

**Ventajas:**
- ✅ Sin conflictos de estilos
- ✅ HolyGrail5 maneja layout, MDS maneja componentes
- ✅ Mejor de ambos mundos
- ✅ CSS optimizado y ligero

### Maquetación con IA

HolyGrail5 es **perfecto para maquetación asistida por IA**:

#### ¿Por qué funciona tan bien con IA?

1. **Superprompt disponible**: `SUPERPROMPT.md` contiene toda la información necesaria
2. **Nomenclatura clara**: Clases predecibles y semánticas
3. **Patrones simples**: Estructura fácil de seguir
4. **Configuración JSON**: Fácil de generar automáticamente
5. **Sin complejidad**: No hay componentes acoplados que confundan a la IA

#### Ejemplo de Uso con IA

```
Prompt para IA:
"Crea una página de restaurante con header sticky, hero section, 
grid de 6 platos destacados, sección sobre nosotros y footer, 
usando HolyGrail5 según SUPERPROMPT.md"

La IA puede:
✅ Generar HTML con las clases correctas
✅ Usar el grid system apropiado
✅ Aplicar spacing helpers correctamente
✅ Crear layouts responsive
✅ Integrar con componentes MDS si es necesario
```

**Resultado**: Desarrollo más rápido y código consistente generado automáticamente.

### Conclusión

HolyGrail5 representa la **evolución natural** del framework original, eliminando las complejidades de SASS, separando los componentes pesados de Angular, y aprovechando las capacidades modernas de CSS y JavaScript. 

**Es más simple, más ligero, más potente y más accesible**, manteniendo la filosofía de diseño que hizo grande a HolyGrail CSS, pero adaptado a las necesidades actuales:

- ✅ **Sin dependencias pesadas**: No incluye componentes Angular
- ✅ **CSS ligero**: Solo utilidades esenciales
- ✅ **Flexible**: Compatible con MDS de Inditex y cualquier librería
- ✅ **IA-friendly**: Optimizado para maquetación asistida por IA
- ✅ **Moderno**: Variables CSS nativas, JSON, Node.js

**En resumen**: HolyGrail5 es HolyGrail CSS **mejorado, simplificado, modernizado y optimizado** para el desarrollo web actual, con especial atención a la flexibilidad, ligereza y compatibilidad con sistemas de componentes externos.

---

**Hecho con ❤️ por HolyGrail CSS**
