---
name: holygrail5
description: Skill maestra para trabajar con el framework HolyGrail5 (este repositorio). Cubre cómo USARLO en otro proyecto (clases CSS, prefijo `hg-`, sistema mobile-first, grid `.row`/`.col-{bp}-{n}`, helpers, spacing sin prefijo, aspect ratios, tipografía, temas) y cómo MANTENERLO (arquitectura `BuildOrchestrator` + `AssetManager` + `ThemeTransformer`, generadores en `src/generators/`, flujo de build, watch, tests, gestión de variables históricas, publicación a npm). Usa esta skill SIEMPRE que el usuario mencione HolyGrail5, HG5, "el framework", `config.json` de este repo, `dist/output.css`, clases que empiecen por `.hg-`, `.row`/`.col-md-*`, `.p-16`/`.m-24`, el tema dutti, los scripts `npm run build/watch/serve/dev`, los generadores de spacing/typo/grid/ratios/helpers, o cualquier ajuste sobre este repositorio. Prefiérela frente a respuestas genéricas de CSS porque las clases y la configuración son específicas de este proyecto.
---

# HolyGrail5 — Skill maestra (uso + mantenimiento)

HolyGrail5 es un **generador de CSS dirigido por configuración**. Lees `config.json`, ejecutas `npx holygrail5` y obtienes en `dist/`:

- `output.css` — variables, reset, helpers responsive, spacing, grid, aspect ratios, tipografías.
- `index.html` — guía interactiva navegable de todo lo generado.
- `themes/<nombre>.css` y `themes/<nombre>-demo.html` cuando hay un tema activo.

Es Node puro (sin SASS, sin toolchain), pensado para que cualquier proyecto consuma `dist/output.css` y maquete con clases utilitarias coherentes.

> Idioma: este proyecto pide **español** en commits, comentarios explicativos y respuestas (ver `.cursorrules`). Mantén ese idioma salvo que el usuario diga otra cosa.

---

## Antes de hacer NADA

1. **Lee `config.json`** (o el config que apunte el usuario). Todas las clases disponibles, el prefijo, los breakpoints y los tokens se derivan de ahí. Si una clase no aparece en el config, no existe.
2. **Mira `dist/output.css`** si dudas si algo se está generando — es la fuente de verdad de lo que va a llegar al navegador.
3. **Identifica el modo de la tarea**: ¿el usuario quiere *consumir* HG5 (maquetar / usar clases) o *modificar el framework* (añadir un generador, ajustar un tema, publicar versión)?
   - **Maquetar / HTML / layouts / integrar npm** → lee **`.claude/skills/maquetar-dev/SKILL.md`** (superskill para devs).
   - **Mantener el framework** → continúa con esta skill (Parte B).

---

## Convenciones del sistema (memorizar)

- **Mobile-first**. Las clases base aplican a mobile. El prefijo `md\:` activa la versión desktop a partir de `breakpoints.desktop` (por defecto `992px`).
- **Prefijo `hg-` para helpers, sin prefijo para spacing**. `.hg-d-flex`, `.hg-justify-center`, `.hg-gap-16` ↔ `.p-16`, `.m-24`, `.pt-8`. Es deliberado: el spacing es de uso constante y se quiere brevedad.
- **Variables CSS, nunca valores hardcodeados**: `var(--hg-color-primary)`, `var(--hg-spacing-16)`, `var(--hg-typo-font-size-24)`. Si no existe la variable, primero amplía el config.
- **RTL-safe**: usa `.hg-px-*`, `.hg-py-*`, `.hg-mx-*`, `.hg-my-*` (van a `padding-inline`/`block`), no `pl-/pr-` cuando puedas evitarlo.
- **Grid es flex, no CSS Grid**. `.row` (flex wrap con márgenes negativos) + `.col-{bp}-{n}` con breakpoints `xs`(1px) / `sm`(768) / `md`(992) / `lg`(1280) / `xl`(1440, normalmente 24 columnas).
- **Aspect ratios** usan `aspect-ratio` nativo con fallback `padding-top` para navegadores viejos. Pon `.hg-aspect-image` en el `<img>`/`<video>` interno.
- **Cross-browser SIEMPRE**. Todo lo que se genere o maquete debe funcionar en todos los navegadores (Chrome, Firefox, Safari, Edge, y móviles iOS/Android). Usa propiedades y herramientas con soporte universal; si una propiedad moderna no lo tiene, acompáñala de fallback o trátala como mejora progresiva. Patrones que el repo ya sigue y debes mantener: `aspect-ratio` + fallback `padding-top`, `100dvh` junto a `100vh`, `ui-monospace, monospace` como cadena de fallbacks, `padding-inline/block` (baseline en todos los actuales). Ante la duda, comprueba el soporte en caniuse antes de introducir una propiedad nueva.

---

## Parte A — USAR HolyGrail5 en otro proyecto

### Instalación y consumo

```bash
npm install holygrail5 --save-dev
```

Importa el CSS según tu stack:

```html
<!-- HTML directo -->
<link rel="stylesheet" href="node_modules/holygrail5/dist/output.css">
```
```js
// Vite / Webpack / Next.js / React
import 'holygrail5/dist/output';
import 'holygrail5/dist/dutti'; // opcional, después del base
```
```html
<!-- Playground / CodePen -->
<link rel="stylesheet" href="https://unpkg.com/holygrail5/dist/output.css">
```

### Personalizar el CSS para tu proyecto

```bash
cp node_modules/holygrail5/config.json ./hg5-config.json
# edita hg5-config.json con tus tokens
npx holygrail5 --config=./hg5-config.json --output=./dist/output.css
```

`generate-css.js` acepta `--config=`, `--output=`, `--html=`. Si CSS y HTML viven en carpetas distintas, ajusta automáticamente el `href="output.css"`. Los **assets acompañan al output**: `guide-styles.css`, fuentes, imágenes y `assets/js/lenis.min.js` se copian al directorio del `--output` (AssetManager reescribe el prefijo `dist/` de los `dest` hacia ese directorio), de modo que la guía y las demos generadas en el proyecto consumidor funcionan sin rutas rotas.

### Cheat sheet de clases

**Spacing** (sin prefijo, usa `spacingMap`):
- `.p-{k}`, `.pt-{k}`, `.pb-{k}`, `.pl-{k}`, `.pr-{k}`, `.hg-px-{k}`, `.hg-py-{k}`
- `.m-{k}`, `.mt-{k}`, `.mb-{k}`, `.ml-{k}`, `.mr-{k}`, `.hg-mx-{k}`, `.hg-my-{k}`
- Auto: `.hg-mx-auto` (centra horizontal), `.hg-ml-auto`, `.hg-mr-auto`
- Variantes responsive con `md\:` (`.md\:p-32`); `!important` con sufijo `!` para los keys de `spacingImportant` (`.p-0!`)

**Display / flex / posicionamiento** (con `hg-`):
- `.hg-d-flex|block|inline-block|inline-flex|none|contents`
- `.hg-flex-row|column|wrap|nowrap`, `.hg-grow-1`, `.hg-shrink-0`, `.hg-flex-1|auto|none`, `.hg-basis-auto|full`, `.hg-order-{n|first|last}`
- `.hg-justify-{start|center|end|between|around|evenly}` y `.hg-items-{start|center|end|baseline|stretch}`
- `.hg-gap-{k}`, `.hg-gap-x-{k}`, `.hg-gap-y-{k}` (usan `spacingMap`)
- `.hg-position-{relative|absolute|fixed|sticky}`, `.hg-z-{n}`
- `.hg-w-{100-percent|50-percent|auto|fit-content|100vw}`, `.hg-h-{100-percent|100vh|100dvh|auto}`, `.hg-min-h-{100vh|100dvh}`
- `.hg-overflow-{hidden|auto|x-auto|y-hidden}`, `.hg-visibility-hidden`, `.hg-opacity-{0|50|100}`, `.hg-cursor-{pointer|grab|not-allowed}`, `.hg-pointer-events-none`, `.hg-object-{cover|contain}`
- `.hg-text-{left|center|right|justify}`
- `.hg-sr-only` (accesibilidad: visible solo para lectores de pantalla)

**Color y fondo** (un helper por token de `config.colors`, 30 tokens):
- `.hg-c-{token}` → `color` (`.hg-c-primary`, `.hg-c-error`, `.hg-c-dark-grey`…)
- `.hg-bg-{token}` → `background-color` (`.hg-bg-white`, `.hg-bg-bg-cream`…)
- Los tokens válidos son las claves de `config.colors`; si añades un color nuevo, recuerda añadirlo también a `config.helpers.color.values` y `background.values` (lista duplicada a mano — mantenlas sincronizadas).

**Grid**:
```html
<div class="row">
  <aside class="col-xs-12 col-md-3">…</aside>
  <main  class="col-xs-12 col-md-9">…</main>
</div>
<div class="row bleed">  <!-- elimina gutter --> </div>
```

**Aspect ratios**:
```html
<div class="hg-aspect hg-aspect-16-9">
  <img class="hg-aspect-image" src="hero.jpg" alt="">
</div>
<div class="hg-aspect hg-aspect-1-1">
  <div class="hg-aspect-content"><h3 class="hg-title-l-b">Texto</h3></div>
</div>
```
Catálogo: `1-1`, `4-3`, `16-9`, `2-1`, `2-3`, `3-4`, `3-1`, `7-1`, `12-1`, `24-1`, `9-20`, `16-4`. La clase `.hg-aspect` sin sufijo es 2:3.

**Tipografía**: depende de `config.typo`. Cada clave genera `.hg-{nombre}` mobile-first con override en `@media (min-width: 992px)`. Ejemplos típicos en este repo: `.hg-h2`, `.hg-title-l-b`, `.hg-title-l`, `.hg-title-m`, `.hg-text-m`, `.hg-suisse-1`, `.hg-semantic`, `.hg-p-tag`, `.title-thin` (display en Suisse Thin — úsala solo en tamaños grandes; en pequeño el trazo hairline desaparece). **Antes de inventar una clase tipográfica, comprueba en el config qué hay**.

**Convención de pesos**: los `fontWeight` del `typo` declaran el **peso real del cut** que resuelve su familia (thin=100, light=300, regular=400, medium=500, semibold=600, mono-bold=700). Cada familia (`suisse-*`) tiene UN solo face, así que la selección real es por nombre — pero los números nunca deben mentir. `fontFamilyMap` tiene 7 claves: `primary-thin/light/regular/bold`, `secondary`, `mono-regular/bold` (`primary-bold` = SemiBold 600, no un Bold real; los mono caen a `ui-monospace, monospace`, jamás a una sans).

### Reglas que no se discuten al maquetar

1. Mobile-first siempre. Desktop con `md\:`.
2. Nunca hardcodees colores, spacing ni tamaños — usa `var(--hg-*)`.
3. Si un valor no está en el config, **no existe la clase**: o usas otro valor del map o amplías el config.
4. Spacing sin prefijo (`.p-16`), helpers con prefijo (`.hg-d-flex`). No los confundas.
5. `.hg-aspect-image` para imágenes/vídeos dentro de un ratio.
6. Cuando el componente tenga nombre propio (p. ej. `ProductCard`), la primera clase del root coincide en kebab-case (`product-card`) y luego se acumulan los helpers HG5.
7. Cross-browser siempre: nada de propiedades/APIs que solo funcionen en un navegador. Si usas algo moderno, fallback primero (mismo patrón que `aspect-ratio`/`padding-top` o `100vh`/`100dvh`) y comprueba caniuse ante la duda.

### Skills hermanas para tareas concretas

**Maquetación de devs (superskill completa):** `.claude/skills/maquetar-dev/SKILL.md` — usar SIEMPRE al maquetar HTML/layouts/componentes.

Las hay específicas en `skills/`:

- `skills/developer-guide/SKILL.md` — referencia exhaustiva de **todas** las clases con ejemplos (~628 líneas). Ábrelo cuando necesites el detalle completo.
- `skills/component-generator/SKILL.md` — generar marcado HTML de componentes con clases válidas.
- `skills/layout-builder/SKILL.md` — combinar grid + helpers + ratios para layouts de página.
- `skills/config-builder/SKILL.md` — crear/modificar `config.json` con la estructura correcta.
- `skills/theme-creator/SKILL.md` — montar un tema nuevo siguiendo la estructura de `themes/dutti/`.
- `skills/migration-helper/SKILL.md` — equivalencias Bootstrap/Tailwind → HG5.

Esta skill es el índice y el contexto común; delega a las anteriores cuando la tarea cae claramente en su ámbito.

---

## Parte B — MANTENER el framework

### Scripts (`package.json`)

| Script | Qué hace |
| --- | --- |
| `npm run build` | `node generate-css.js` — invoca `BuildOrchestrator.build()` (CSS + HTML + assets + tema). |
| `npm run watch` | `node src/watch-config.js` — observa `config.json`, CSS y `themes/`, regenera al guardar. |
| `npm run serve` / `npm run dev` | `node src/dev-server.js` — sirve `dist/` en `127.0.0.1:3000` (solo loopback). (`dev` actualmente es alias de `serve`.) |
| `npm run start` | `build` + `serve`. |
| `npm test` | `node tests/run-all.js` — corre los 30 tests. |
| `npm run vars:report` | Informe de variables CSS (usadas / no usadas / históricas). |
| `npm run vars:remove-unused` | Limpia variables históricas no referenciadas. |

### Arquitectura de build

```
generate-css.js  (CLI / entry point)
   └── BuildOrchestrator (src/build/build-orchestrator.js)
        ├── config-loader.js          → carga + valida config.json
        ├── css-generator.js          → orquesta generators/
        │     ├── reset-generator.js
        │     ├── variables-generator.js
        │     ├── spacing-generator.js
        │     ├── helpers-generator.js
        │     ├── grid-generator.js
        │     ├── ratio-generator.js
        │     ├── typo-generator.js
        │     └── utils.js
        ├── docs-generator/html-generator.js  → dist/index.html
        ├── AssetManager (build/asset-manager.js)         → copia guide-styles/fuentes/imgs/lenis al directorio del output (`outputDir`; con --output custom aterrizan junto al CSS del consumidor)
        ├── ThemeTransformer (build/theme-transformer.js) → combina theme.css + reescribe demo.html con sidebar/Lenis (LOCAL: dist/assets/js/lenis.min.js, sin CDN)
        └── skills-generator.js → dist/skills.html (si existe carpeta skills/)
```

Principios que conviene preservar al tocar el build:

- **Generators son funciones puras**: reciben `config`, devuelven string CSS. Eso los hace testeables sin DOM ni FS.
- **El orquestador es el único que escribe a disco**, vía `utils.writeFile`. Si añades un nuevo generador, devuélvele el string al orquestador en vez de escribir tú mismo.
- **`watch` y `build` comparten orquestador**. No dupliques pipelines: si añades un paso, ponlo en `BuildOrchestrator.build()` y aparecerá en ambos.
- **Variables tipográficas se deduplican** (`typo-generator`): no hardcodees `font-size: 14px` en una clase, registra el valor para que se materialice como `--hg-typo-font-size-14`.
- **Compatibilidad cross-browser en el CSS generado**. Los generadores producen CSS que consumen proyectos reales en todos los navegadores: no introduzcas en un generador (ni en `themes/`) propiedades sin soporte universal salvo como mejora progresiva con fallback en la línea anterior (patrón existente: `ratio-generator` emite `padding-top` + `aspect-ratio`; los helpers de altura emiten `100vh` + `100dvh`). Verifica soporte (caniuse) antes de añadir una propiedad nueva a un generador.
- **Sin CDNs externos en las páginas generadas**. Lenis está vendorizado en `src/assets/js/lenis.min.js` (→ `dist/assets/js/`). No reintroduzcas `<script src="https://cdn...">` en generadores ni demos: rompe offline y reabre riesgo de cadena de suministro sin SRI.
- **Paridad config ↔ fallback**: si añades un asset a `config.assets`, añádelo también a `DEFAULT_ASSETS` en `asset-manager.js` (el fallback cuando un config no define `assets`). Ya se ha desincronizado dos veces (thin, lenis).
- **Temas cubren el set tipográfico completo**: todo tema que redefina familias debe declarar las **7 claves** del `fontFamilyMap` (`primary-thin/light/regular/bold`, `secondary`, `mono-*`). Si falta una, esa clase cae a la fuente base y rompe la coherencia del tema (p. ej. un thin sans dentro de un tema serif). Los overrides de mono jamás caen a una sans.
- **Escapa SIEMPRE los valores del config al volcarlos en HTML**. La guía (`dist/index.html`) y las demos se publican como documentación estática; un valor del `config.json`/`theme.json` sin escapar puede inyectar HTML/JS (la build admite `--config=` de configs no confiables). Usa `escapeHtml` de `src/generators/utils.js` (escapa `& < > " '`, válido también para atributos `title=`/`style=`/`data-*`) en CUALQUIER nuevo sink de `html-generator.js`, `sections/*`, `theme-vars-table-generator.js`, etc. Hay un test de regresión (`tests/escaping.test.js`) que lo verifica. Para inyectar bloques en `ThemeTransformer`, usa replacer de función (`replace(re, () => bloque)`) y no string, para que un `$` en el contenido no se interprete como patrón.

### Cómo añadir cosas

- **Nuevo helper** → declaración en `config.helpers` (`property`, `class`, `responsive`, `values` o `useSpacing: true`). Si necesita lógica nueva (p. ej. mapeo a varias propiedades), tócalo en `src/generators/helpers-generator.js` y añade test en `tests/helpers.test.js`.
- **Nuevo aspect ratio** → añade entry a `config.aspectRatios` (`class`, `width`, `height`, `description`). El generador hace el resto.
- **Nuevo color/spacing/tipografía** → solo `config.json`. No hace falta tocar generators.
- **Nuevo tema** → carpeta `themes/<nombre>/` con `theme.css` que importe parciales `_*.css` y un `demo.html`. Activa con `"theme": { "name": "<nombre>", "enabled": true }`. El `ThemeTransformer` inyecta sidebar, header y Lenis al transformar `demo.html` → `dist/themes/<nombre>-demo.html`. Opcionalmente añade `themes/<nombre>/theme.json` (ver sección siguiente) para que la demo muestre cabecera con meta + tablas de variables del tema. (Ver también `skills/theme-creator/SKILL.md`.)
- **Nuevo asset** → entrada en `config.assets.css` o `config.assets.images`. Si no defines `assets`, `AssetManager` usa fallback por defecto.

### `themes/<nombre>/theme.json` (opcional, manifiesto del tema)

Cada tema puede llevar un `theme.json` **opcional** que sirve como manifiesto y alimenta las tablas que se ven en `dist/themes/<nombre>-demo.html`. El CSS real sigue viviendo en `_variables.css` y los `_*.css` del tema — **el JSON no genera CSS**, solo documenta y se vuelca como tabla en la demo. Esto permite tener varios temas (`themes/dutti/`, `themes/otro/`…) con demos homogéneas sin duplicar HTML.

Estructura:

```json
{
  "meta":            { "name", "displayName", "description", "version", "author" },
  "tokenOverrides":  { "color": { … }, "spacing": { … } },
  "componentVars":   { "btn": { "primary-bg": "var(--hg-color-primary)", … }, "input": { … }, … },
  "design":          { "border-radius": "0", "transition": "all 0.2s ease", … }
}
```

Reglas:

- Las claves de `componentVars.<comp>` se renderizan como `--<comp>-<key>` (p. ej. `--btn-primary-bg`).
- Las claves de `design` se renderizan como `--<key>` sin prefijo de componente.
- Los valores que parezcan color (`#…`, `rgb(`, `hsl(`) obtienen automáticamente una muestra.
- Si no hay `theme.json`, la demo se genera igual pero sin cabecera meta ni tablas de variables — no rompe nada.

Flujo en build (`build-orchestrator.js` → `theme-config-loader.js` → `theme-transformer.js`):

1. `loadThemeConfig(projectRoot, themeName)` lee el JSON si existe (fallback `null`).
2. `ThemeTransformer.transform(..., config, themeData)` sustituye `<!-- HG_THEME_BLOCK -->` por la salida de `generateThemeBlockHTML(themeData)` (generador en `src/build/theme-vars-table-generator.js`).
3. El sidebar añade la entrada "Variables del tema" que apunta a `#theme-vars`.

Al tocar variables en `_variables.css`, **acuérdate de reflejarlas en `theme.json`** si quieres que aparezcan en la demo. Si el tema no necesita documentar sus tokens, borra el JSON y la demo funciona sin la cabecera.

### Variables históricas

`src/docs-generator/variables-tracker.js` mantiene `.data/.historical-variables.json` para que ninguna variable desaparezca por accidente al cambiar el config. Flujo recomendado tras tocar mucho el config:

```bash
node src/docs-generator/variables-cli.js list --css=./dist/output.css
node src/docs-generator/variables-cli.js remove -- --hg-typo-font-size-18
npm run vars:report
npm run vars:remove-unused
npm run build   # regenera limpio
```

La guía HTML (`dist/index.html`) además resalta los valores que cambiaron respecto a `.data/.previous-values.json`, útil para auditar diffs visuales del design system.

### Tests

- 30 tests en `tests/`, sin frameworks pesados — son funciones puras que imprimen `✅`/`❌`. Lánzalos con `npm test`. Tardan <1 s.
- Cobertura clave: `config-loader`, `css-generator`, `helpers`, `html-generator`, `ratio-generator`, `asset-manager` (15, incl. reescritura `outputDir` del flujo consumidor), `theme-transformer` (5), `build-orchestrator` (5), `escaping` (3, anti-inyección en la guía).
- Si tocas un generador, añade o actualiza el test correspondiente. Mantén los tests deterministas (usa `config` mínimos en memoria, no lecturas de disco salvo lo imprescindible).
- Si añades un test con conteo propio (estilo `testX()` que devuelve `{passed, failed}`), recuérdalo enganchar en `tests/run-all.js` para que sume al total.

### Publicación / despliegue

- Es un paquete npm (`name: holygrail5`, `version` en `package.json`). El `bin` `holygrail5` apunta a `generate-css.js`. El script `prepack` ejecuta el build automáticamente antes de empaquetar; `npm run publish:pkg` = test + publish.
- `files` es un **whitelist preciso** (~3 MB, 107 ficheros): JS de `src/`, fuentes/imágenes usadas, `themes/**` y los artefactos concretos de `dist/`. ⚠️ npm NO permite que `.npmignore` excluya rutas cubiertas por `files` — si hay que excluir algo, se ajusta el whitelist, no el ignore. Verifica el contenido con `npm pack --dry-run` antes de publicar (nada de backups, `.data/`, ni imágenes sin comprimir).
- Commits: convención en español (ver `.cursorrules`). Tipos `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `perf:`. Indica siempre `(afecta a: ruta/componente)`. Ejemplo: `feat: añadir helper hg-grid (afecta a: src/generators/helpers-generator.js, tests/helpers.test.js)`.
- `dist/index.html` puede publicarse como documentación estática (Netlify configurado en `netlify.toml`, GitHub Pages, Vercel, etc.).

### Privacidad

`.cursorrules` pide no mencionar marcas/empresas sensibles del cliente del tema. Refiérete a él como **"tema dutti"** y nada más en respuestas, comentarios o commits.

---

## Heurística rápida para responder al usuario

| El usuario dice… | Qué haces |
| --- | --- |
| "Maqueta esto / haz un componente / un layout" | Lee `config.json`, aplica clases HG5, delega a `component-generator` o `layout-builder` si la skill cuadra. Nada de CSS inline salvo `style="color: var(--hg-color-…)"` cuando no hay clase específica. |
| "Añade un color / spacing / tipografía" | Modifica `config.json` y ejecuta `npm run build`. Recuerda actualizar `vars:report` si retiras valores. |
| "Cambia algo del tema dutti" | Edita `themes/dutti/_*.css` o `demo.html` y `npm run watch` recarga. La salida vive en `dist/themes/dutti.css` y `dist/themes/dutti-demo.html`. |
| "No se genera tal clase" | Confirma que el token existe en el `config.json` correcto, regenera con `npx holygrail5`, y mira `dist/output.css` para ver qué salió. Revisa el generador correspondiente en `src/generators/`. |
| "Migrar de Bootstrap/Tailwind" | Delega a `skills/migration-helper/SKILL.md`. |
| "Publicar nueva versión" | Bump `version` en `package.json`, `npm test`, `npm run build`, commit en español, `npm publish`. |
| "Documentación / guía" | La guía interactiva está en `dist/index.html` tras un build. Para integraciones externas, `docs/GUIA-USO-OTRO-PROYECTO.md`. |

Si tienes que tomar una decisión de diseño y dudas, **prefiere lo coherente con el resto del repo** (mobile-first, variables CSS, generadores puros, tests acompañando cada cambio) sobre lo "nuevo y elegante".
