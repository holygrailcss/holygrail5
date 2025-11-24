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
5. [Configurar `config.json`](#5-configurar-configjson)
6. [CLI y argumentos](#6-cli-y-argumentos)
7. [Guía HTML interactiva](#7-guía-html-interactiva)
8. [Gestión de variables históricas](#8-gestión-de-variables-históricas)
9. [Tema Dutti y demos](#9-tema-dutti-y-demos)
10. [Flujo de desarrollo](#10-flujo-de-desarrollo)
11. [Tests y calidad](#11-tests-y-calidad)
12. [Documentos complementarios](#12-documentos-complementarios)
13. [Recursos y soporte](#13-recursos-y-soporte)
14. [Licencia](#14-licencia)

---

## 1. Instalación
```bash
# Instalación global
npm install -g holygrail5

# Instalación local (recomendada)
npm install holygrail5 --save-dev
```
> Requiere Node.js >= 12 (probado hasta v20).

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

# 4) Empaqueta tema Dutti y demo
npm run build   # corre generate-css.js + copy-theme-html.js
```

## 3. Scripts disponibles
| Script | Descripción |
| ------ | ----------- |
| `npm run build` | Ejecuta `generate-css.js` y copia la demo del tema. |
| `npm run watch` | Observa `config.json` y regenera CSS/HTML. |
| `npm run serve` | Abre el navegador y sirve `dist/` en el puerto 3000. |
| `npm run dev` | Alias práctico: `watch` + `serve`. |
| `npm run test` | Corre los tests de `tests/run-all.js`. |
| `npm run vars:report` | Informe completo de variables CSS. |
| `npm run vars:remove-unused` | Limpia variables históricas no usadas. |

## 4. ¿Qué se genera?
- `dist/output.css` → Reset, variables compartidas, helpers de spacing, helpers de layout, grid opcional y tipografías mobile/desktop.
- `dist/index.html` → Guía interactiva con navegación sticky, buscador y diffs visuales.
- `dist/themes/dutti.css` + `dist/themes/dutti-demo.html` cuando `theme.enabled` es `true` (ver [Tema Dutti](#9-tema-dutti-y-demos)).

## 5. Configurar `config.json`
### 5.1 Ejemplo mínimo
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

### 5.2 Propiedades globales
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
| `typo` | object | Clases de tipografía (obligatorio al menos un breakpoint). |
| `theme` | object | `{ name, enabled }` para combinar temas desde `themes/<name>`. |

### 5.3 Helpers y grid
- `src/generators/helpers-generator.js` crea clases del tipo `.hg-d-flex`, `.md\:hg-justify-center`, `.hg-gap-16`, etc.
- Puedes mezclar helpers basados en `values` y helpers que reutilizan `spacingMap` con `useSpacing: true` (gap, row-gap, column-gap...).
- El grid (`grid.enabled=true`) genera utilidades `.row`, `.col-md-6`, offsets, contenedores fluidos y variantes por breakpoint.

### 5.4 Tipografías
- El generador (`src/generators/typo-generator.js`) deduplica valores y crea variables compartidas (`--hg-typo-font-size-24`).
- Cada clase admite propiedades base (`fontFamily`, `fontWeight`, `letterSpacing`, `textTransform`) y propiedades por breakpoint (`fontSize`, `lineHeight`).
- Los valores px se convierten automáticamente a rem respetando `baseFontSize`.

## 6. CLI y argumentos
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

## 7. Guía HTML interactiva
El módulo `src/docs-generator/html-generator.js` produce `dist/index.html` con:
- Resumen visual de colores, tipografías y spacing.
- Detección de cambios: los valores modificados respecto a `.data/.previous-values.json` se resaltan.
- Buscador instantáneo y navegación lateral fija.
- Información de metadata (versión del paquete y último commit disponible).

## 8. Gestión de variables históricas
El binario `src/docs-generator/variables-cli.js` + el módulo `variables-tracker` guardan un historial en `.data/.historical-variables.json` para que ninguna variable desaparezca sin que lo decidas.

Comandos útiles:
```bash
npm run vars:report          # Estadísticas y listado completo
npm run vars:remove-unused   # Limpia todas las variables no utilizadas
node src/docs-generator/variables-cli.js list --css=./dist/output.css
node src/docs-generator/variables-cli.js remove -- --hg-typo-font-size-18
```
> Después de borrar variables históricas conviene volver a ejecutar `npm run build` para regenerar el CSS sin referencias huérfanas.

## 9. Tema Dutti y demos
- El directorio `themes/dutti/` contiene CSS modular (_variables, _buttons, etc.) y un `demo.html` de referencia.
- `copy-theme-html.js` combina el tema en `dist/themes/dutti.css`, arregla las rutas del demo y añade una sidebar con accesos rápidos.
- Para crear tu propio tema copia la carpeta `themes/dutti`, ajusta los ficheros y actualiza `config.json → theme.name`.

## 10. Flujo de desarrollo
1. `npm run watch` genera `dist/output.css` e `index.html` cada vez que cambias `config.json`.
2. En paralelo, `npm run serve` levanta un servidor estático sobre `dist/` (puedes usar `npm run dev` para lanzar ambos).
3. Si trabajas con un tema, modifica los `.css` del tema y vuelve a ejecutar `npm run build` para regenerar el bundle y la demo.
4. Para trabajar con otros repos o guías, aprovecha los documentos de `docs/` (ver siguiente sección).

## 11. Tests y calidad
- `tests/run-all.js` ejecuta los tests unitarios (`config-loader`, `css-generator`, helpers, html generator...).
- Los tests imprimen resultados en consola para facilitar su lectura sin necesidad de frameworks pesados.
- Puedes integrar ESLint u otras herramientas externas, pero el repo provee funciones puras fáciles de testear en aislamiento.

## 12. Documentos complementarios
| Archivo | Contenido |
| ------- | --------- |
| `docs/SUPERPROMPT.md` | Prompt detallado para asistentes/IA que necesiten generar HTML usando HolyGrail5. |
| `docs/COMPARACION.md` | Comparativa HolyGrail5 vs alternativas (Tailwind, frameworks legacy, etc.). |
| `docs/GUIA-USO-OTRO-PROYECTO.md` | Pasos para integrar HolyGrail5 en proyectos existentes. |
| `docs/` + `dist/index.html` | Puedes publicar la guía como doc estática (GitHub Pages, Netlify, etc.). |

## 13. Recursos y soporte
- Repositorio: [github.com/holygrailcss/holygrail5](https://github.com/holygrailcss/holygrail5)
- npm: [holygrail5](https://www.npmjs.com/package/holygrail5)
- Issues y PRs son bienvenidos. Sigue el flujo clásico: fork → rama → PR.
- Si solo necesitas copiar la guía, ejecuta `npm run build` y publica `dist/` en el hosting de tu preferencia.

## 14. Licencia
MIT © HolyGrail CSS. Usa, adapta y comparte libremente mientras conserves la atribución.
