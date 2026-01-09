# HolyGrail5

[![npm version](https://img.shields.io/npm/v/holygrail5.svg)](https://www.npmjs.com/package/holygrail5)
[![npm downloads](https://img.shields.io/npm/dm/holygrail5.svg)](https://www.npmjs.com/package/holygrail5)

Generador de CSS + guía HTML pensado para design systems ligeros: declaras tu `config.json`, HolyGrail5 crea variables compartidas, helpers responsive, tipografías y documentación navegable en `dist/` sin depender de SASS ni toolchains complejos.

---

## Índice
1. [Instalación](#1-instalación)
2. [Flujo rápido](#2-flujo-rápido)
3. [Scripts disponibles](#3-scripts-disponibles)
4. [¿Qué se genera?](#4-qué-se-genera)
5. [Estructura del proyecto](#5-estructura-del-proyecto)
6. [Configurar `config.json`](#6-configurar-configjson)
7. [CLI y argumentos](#7-cli-y-argumentos)
8. [Guía HTML interactiva](#8-guía-html-interactiva)
9. [Gestión de variables históricas](#9-gestión-de-variables-históricas)
10. [Tema Dutti y demos](#10-tema-dutti-y-demos)
11. [Arquitectura del sistema](#11-arquitectura-del-sistema)
12. [Tests y calidad](#12-tests-y-calidad)
13. [Documentos complementarios](#13-documentos-complementarios)
14. [Recursos y soporte](#14-recursos-y-soporte)
15. [Licencia](#15-licencia)

---

## 1. Instalación

```bash
# Instalación global
npm install -g holygrail5

# Instalación local (recomendada)
npm install holygrail5 --save-dev
```
> Requiere Node.js >= 12 (probado hasta v20).

---

## 2. Flujo rápido

```bash
# 1) Genera CSS + guía
npx holygrail5

# 2) Sirve dist/ en local
npm run serve
# http://localhost:3000/index.html

# 3) Trabaja en caliente
npm run watch   # regenera al guardar config.json
npm run dev     # watch + servidor

# 4) Genera CSS y tema Dutti
npm run build   # genera CSS, HTML, assets y temas automáticamente
```

---

## 3. Scripts disponibles

| Script | Descripción |
| ------ | ----------- |
| `npm run build` | Genera CSS, HTML, assets y transforma temas automáticamente usando `BuildOrchestrator`. |
| `npm run watch` | Observa `config.json`, CSS y temas, regenerando automáticamente al detectar cambios. |
| `npm run serve` | Abre el navegador y sirve `dist/` en el puerto 3000. |
| `npm run dev` | Alias práctico: `watch` + `serve` (desarrollo en caliente). |
| `npm run test` | Ejecuta todos los tests (20 tests unitarios). |
| `npm run vars:report` | Informe completo de variables CSS. |
| `npm run vars:remove-unused` | Limpia variables históricas no usadas. |

---

## 4. ¿Qué se genera?

- **`dist/output.css`** → Reset, variables compartidas, helpers de spacing, helpers de layout, grid opcional, aspect ratios y tipografías mobile/desktop.
- **`dist/index.html`** → Guía interactiva con navegación sticky, buscador y diffs visuales.
- **`dist/guide-styles.css`** → Estilos de la guía de documentación.
- **`dist/assets/`** → Imágenes y recursos estáticos.
- **`dist/themes/dutti.css`** + **`dist/themes/dutti-demo.html`** → Cuando `theme.enabled` es `true`.

---

## 5. Estructura del proyecto

```
holygrail5/
├── config.json                    # Configuración principal
├── generate-css.js                # Entry point del build
├── package.json                   # Dependencias y scripts
│
├── src/
│   ├── assets/                    # Assets estáticos (imágenes)
│   │   ├── intro.jpg
│   │   ├── introm.jpg
│   │   └── margenes.webp
│   │
│   ├── build/                     # Sistema de build modular
│   │   ├── asset-manager.js       # Gestión de assets
│   │   ├── build-orchestrator.js  # Orquestador principal
│   │   └── theme-transformer.js   # Transformación de temas
│   │
│   ├── generators/                # Generadores de CSS
│   │   ├── grid-generator.js
│   │   ├── helpers-generator.js
│   │   ├── reset-generator.js
│   │   ├── spacing-generator.js
│   │   ├── typo-generator.js
│   │   ├── utils.js
│   │   └── variables-generator.js
│   │
│   ├── docs-generator/            # Generación de documentación
│   │   ├── guide-styles.css
│   │   ├── html-generator.js
│   │   ├── variables-cli.js
│   │   └── variables-tracker.js
│   │
│   ├── config-loader.js           # Carga y validación de config
│   ├── css-generator.js           # Generador CSS principal
│   ├── dev-server.js              # Servidor de desarrollo
│   └── watch-config.js            # Sistema de watch
│
├── themes/
│   └── dutti/                     # Tema de ejemplo
│       ├── _variables.css
│       ├── _buttons.css
│       ├── _inputs.css
│       ├── demo.html
│       └── theme.css
│
├── tests/                         # Tests unitarios
│   ├── asset-manager.test.js
│   ├── build-orchestrator.test.js
│   ├── theme-transformer.test.js
│   ├── config-loader.test.js
│   ├── css-generator.test.js
│   ├── helpers.test.js
│   ├── html-generator.test.js
│   └── run-all.js
│
├── docs/                          # Documentación complementaria
│   ├── ANALISIS-ARQUITECTURA.md
│   ├── CHANGELOG-MEJORAS.md
│   ├── GUIA-USO-OTRO-PROYECTO.md
│   └── SUPERPROMPT.md
│
└── dist/                          # Archivos generados (gitignored)
    ├── output.css
    ├── index.html
    ├── guide-styles.css
    ├── assets/                    # Assets copiados
    └── themes/                    # Temas generados
```

---

## 6. Configurar `config.json`

### 6.1 Ejemplo mínimo

```jsonc
{
  "prefix": "hg",
  "baseFontSize": 16,
  "breakpoints": { "mobile": "1px", "desktop": "992px" },
  "fontFamilyMap": {
    "primary": "arial, sans-serif",
    "secondary": "\"ms-serif\", serif"
  },
  "colors": { "white": "#fff", "black": "#000" },
  "spacingMap": { "0": "0", "16": "16px", "100-percent": "100%" },
  "spacingImportant": ["0"],
  "helpers": {
    "display": { "property": "display", "class": "d", "responsive": true, "values": ["flex", "block", "none"] }
  },
  "grid": { "enabled": true, "gutter": "8px", "breakpoints": { "md": { "minWidth": "992px", "columns": 12 } } },
  "aspectRatios": [
    { "class": "aspect-16-9", "width": 16, "height": 9, "description": "Ratio 16:9 (widescreen)" },
    { "class": "aspect-1-1", "width": 1, "height": 1, "description": "Ratio 1:1 (cuadrado)" }
  ],
  "typo": {
    "h2": {
      "fontFamily": "arial, sans-serif",
      "fontWeight": "900",
      "mobile": { "fontSize": "18px", "lineHeight": "1.2" },
      "desktop": { "fontSize": "24px", "lineHeight": "1.2" }
    }
  }
}
```

### 6.2 Propiedades globales

| Campo | Tipo | Descripción |
| ----- | ---- | ----------- |
| `prefix` | string | Prefijo usado en todas las variables (`--hg-color-*`). |
| `baseFontSize` | number | Conversión automática px → rem (default `16`). |
| `breakpoints.mobile` / `.desktop` | string | Valores usados en media queries (`992px`, etc.). |
| `fontFamilyMap` | object | Alias legibles para las fuentes declaradas en tipografías. |
| `colors` | object | Paleta exportada como `--hg-color-*`. |
| `spacingMap` | object | Escala lógica de spacing (px o %). |
| `spacingImportant` | string[] | Keys de spacing con `!important`. |
| `helpers` | object | Helpers de layout. Permite arrays simples o mapas clave → valor. |
| `grid` | object | Define breakpoints, columnas y gutter por tamaño. |
| `aspectRatios` | array | **Opcional**: Define ratios de aspecto como `.hg-aspect-16-9` con fallback automático. |
| `typo` | object | Clases de tipografía (obligatorio al menos un breakpoint). |
| `theme` | object | `{ name, enabled }` para combinar temas desde `themes/<name>`. |
| `assets` | object | **Opcional**: `{ css: [...], images: [...] }` para configurar qué archivos copiar a `dist/`. |

### 6.3 Configuración de Assets (Opcional)

Puedes configurar qué archivos CSS e imágenes se copian a `dist/` agregando una sección `assets` en tu `config.json`:

```json
{
  "assets": {
    "css": [
      {
        "source": "src/docs-generator/guide-styles.css",
        "dest": "dist/guide-styles.css"
      }
    ],
    "images": [
      {
        "source": "src/assets/intro.jpg",
        "dest": "dist/assets/intro.jpg"
      },
      {
        "source": "src/assets/margenes.webp",
        "dest": "dist/assets/margen.webp"
      }
    ]
  }
}
```

**Ventajas:**
- ✅ Configuración sin modificar código
- ✅ Fácil agregar nuevos assets
- ✅ Flexible para diferentes proyectos

Si no se especifica `assets`, el sistema usa una configuración por defecto.

### 6.4 Helpers y grid

- `src/generators/helpers-generator.js` crea clases del tipo `.hg-d-flex`, `.md\:hg-justify-center`, `.hg-gap-16`, etc.
- Puedes mezclar helpers basados en `values` y helpers que reutilizan `spacingMap` con `useSpacing: true` (gap, row-gap, column-gap...).
- El grid (`grid.enabled=true`) genera utilidades `.row`, `.col-md-6`, offsets, contenedores fluidos y variantes por breakpoint.

### 6.5 Ratios de Aspecto

- `src/generators/ratio-generator.js` crea clases de aspect ratio como `.hg-aspect-16-9`, `.hg-aspect-1-1`, etc.
- Usa la propiedad CSS `aspect-ratio` nativa con fallback automático para navegadores antiguos (padding-top).
- Cada ratio se define con `class`, `width`, `height` y `description`.
- Útil para mantener proporciones consistentes en imágenes, videos y contenedores.
- Incluye ratios comunes (1:1, 4:3, 16:9) y especializados (separadores 3:1, 7:1, 12:1, 24:1).

### 6.6 Tipografías

- El generador (`src/generators/typo-generator.js`) deduplica valores y crea variables compartidas (`--hg-typo-font-size-24`).
- Cada clase admite propiedades base (`fontFamily`, `fontWeight`, `letterSpacing`, `textTransform`) y propiedades por breakpoint (`fontSize`, `lineHeight`).
- Los valores px se convierten automáticamente a rem respetando `baseFontSize`.

---

## 7. CLI y argumentos

`generate-css.js` puede ejecutarse como binario (`holygrail5`) o mediante `node generate-css.js`.

Argumentos soportados:
```bash
npx holygrail5 \
  --config=./config.personal.json \
  --output=./dist/custom.css \
  --html=./dist/guia.html
```
- Todos los parámetros son opcionales. Si omites alguno, se usan las rutas por defecto (`config.json` y `dist/*`).
- El script ajusta automáticamente el `href="output.css"` del HTML si CSS y HTML viven en carpetas distintas.

---

## 8. Guía HTML interactiva

El módulo `src/docs-generator/html-generator.js` produce `dist/index.html` con:
- ✅ Resumen visual de colores, tipografías y spacing
- ✅ Detección de cambios: los valores modificados respecto a `.data/.previous-values.json` se resaltan
- ✅ Buscador instantáneo y navegación lateral fija
- ✅ Información de metadata (versión del paquete y último commit disponible)
- ✅ Diseño responsive con smooth scroll (Lenis)

---

## 9. Gestión de variables históricas

El binario `src/docs-generator/variables-cli.js` + el módulo `variables-tracker` guardan un historial en `.data/.historical-variables.json` para que ninguna variable desaparezca sin que lo decidas.

Comandos útiles:
```bash
npm run vars:report          # Estadísticas y listado completo
npm run vars:remove-unused   # Limpia todas las variables no utilizadas
node src/docs-generator/variables-cli.js list --css=./dist/output.css
node src/docs-generator/variables-cli.js remove -- --hg-typo-font-size-18
```
> Después de borrar variables históricas conviene volver a ejecutar `npm run build` para regenerar el CSS sin referencias huérfanas.

---

## 10. Tema Dutti y demos

- El directorio `themes/dutti/` contiene CSS modular (_variables, _buttons, etc.) y un `demo.html` de referencia.
- El `ThemeTransformer` combina el tema en `dist/themes/dutti.css`, transforma el HTML agregando sidebar, header y scripts de Lenis automáticamente.
- Para crear tu propio tema copia la carpeta `themes/dutti`, ajusta los ficheros y actualiza `config.json → theme.name`.

### Flujo de desarrollo de temas

1. `npm run watch` detecta cambios en `themes/dutti/` automáticamente
2. Los cambios en `demo.html` o archivos CSS se procesan al guardar
3. El resultado se genera en `dist/themes/dutti-demo.html`
4. El servidor de desarrollo (`npm run serve`) sirve los cambios en tiempo real

---

## 11. Arquitectura del sistema

HolyGrail5 usa una arquitectura modular y centralizada construida en diciembre 2024:

### Módulos principales

#### **`BuildOrchestrator`** (`src/build/build-orchestrator.js`)
- Coordina todo el proceso de build de forma centralizada
- Genera CSS, HTML, copia assets y transforma temas
- Soporta modo watch con cache busting automático
- ~175 líneas, 100% testeado

#### **`AssetManager`** (`src/build/asset-manager.js`)
- Gestiona la copia de CSS e imágenes a `dist/`
- Configuración centralizada desde `config.json` o fallback
- API simple: `copyCSS()`, `copyImages()`, `copyAssets()`
- Soporte para agregar assets dinámicamente
- ~153 líneas, 10 tests

#### **`ThemeTransformer`** (`src/build/theme-transformer.js`)
- Transforma HTML de temas agregando sidebar, header y scripts
- Inyecta Lenis para scroll suave y navegación
- Manejo dinámico de múltiples temas
- ~234 líneas, 5 tests

### Ventajas de la arquitectura

- ✅ **Sin duplicación de código** (~150 líneas eliminadas)
- ✅ **Consistencia** entre build y watch
- ✅ **Testeable** (20 tests unitarios, 100% pasando)
- ✅ **Mantenible** (responsabilidades claramente separadas)
- ✅ **Extensible** (fácil agregar nuevas funcionalidades)

### Diagrama de flujo

```
generate-css.js
     ↓
BuildOrchestrator
     ├── config-loader.js → Carga config.json
     ├── css-generator.js → Genera CSS
     ├── html-generator.js → Genera HTML
     ├── AssetManager → Copia assets
     └── ThemeTransformer → Transforma temas
```

---

## 12. Tests y calidad

### Suite de tests completa

```bash
npm test  # Ejecuta todos los tests
```

**Tests disponibles:**
- ✅ `config-loader.test.js` - Validación de configuración
- ✅ `css-generator.test.js` - Generación de CSS
- ✅ `helpers.test.js` - Utilidades compartidas
- ✅ `html-generator.test.js` - Generación de HTML
- ✅ `asset-manager.test.js` - Gestión de assets (10 tests)
- ✅ `theme-transformer.test.js` - Transformación de temas (5 tests)
- ✅ `build-orchestrator.test.js` - Orquestador de build (5 tests)

**Resultados:**
```
📊 Resumen Total de Tests de Build:
   ✅ Pasados: 20
   ❌ Fallidos: 0
   📈 Total: 20
```

Los tests:
- Imprimen resultados en consola sin necesidad de frameworks pesados
- Funciones puras fáciles de testear en aislamiento
- Cobertura completa del sistema de build
- Se ejecutan en menos de 1 segundo

---

## 13. Documentos complementarios

| Archivo | Contenido |
| ------- | --------- |
| `docs/SUPERPROMPT.md` | Prompt detallado para asistentes/IA que necesiten generar HTML usando HolyGrail5. |
| `docs/GUIA-USO-OTRO-PROYECTO.md` | Pasos para integrar HolyGrail5 en proyectos existentes. |
| `docs/ANALISIS-ARQUITECTURA.md` | Análisis completo de la arquitectura y problemas resueltos. |
| `docs/CHANGELOG-MEJORAS.md` | Registro detallado de la refactorización de diciembre 2024. |

### Publicación de la guía

Puedes publicar `dist/index.html` como documentación estática en:
- GitHub Pages
- Netlify (configurado en `netlify.toml`)
- Vercel
- Cualquier hosting estático

```bash
npm run build
# Publica el contenido de dist/ en tu hosting
```

---

## 14. Recursos y soporte

- **Repositorio**: [github.com/holygrailcss/holygrail5](https://github.com/holygrailcss/holygrail5)
- **npm**: [holygrail5](https://www.npmjs.com/package/holygrail5)
- **Issues y PRs**: Bienvenidos. Sigue el flujo clásico: fork → rama → PR
- **Documentación**: Ver `docs/` para guías detalladas

### Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: agregar AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 15. Licencia

MIT © HolyGrail CSS

Usa, adapta y comparte libremente mientras conserves la atribución.

---

## Changelog

### v1.0.12 - Diciembre 2024

**🎉 Refactorización arquitectural completa**

- ✅ Nueva arquitectura modular con `BuildOrchestrator`, `AssetManager` y `ThemeTransformer`
- ✅ Eliminadas ~150 líneas de código duplicado
- ✅ Assets organizados en `src/assets/` y `dist/assets/`
- ✅ Configuración de assets desde `config.json`
- ✅ 20 tests unitarios agregados (100% pasando)
- ✅ Sistema de watch mejorado
- ✅ Documentación actualizada

Ver `docs/CHANGELOG-MEJORAS.md` para detalles completos.
