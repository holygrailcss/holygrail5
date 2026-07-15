---
name: maquetar-dev
description: Superskill completa de maquetación HolyGrail5 para desarrolladores (Claude). Instalación npm, fuentes, convenciones (mobile-first, prefijos), variables --hg-*, spacing, helpers, colores hg-c/hg-bg, grid, tipografías, aspect ratios, tema Dutti (botones, forms, inputs, checkbox, radio, switch), layouts, patrones HTML, accesibilidad y ampliación del config. Usar SIEMPRE al maquetar, integrar HG5, crear componentes/layouts HTML o consumir el paquete publicado.
---

# Maquetar con HolyGrail5 — Superskill completa para devs

Guía **única y exhaustiva** para maquetar con HolyGrail5 (HG5). **Si una clase no está en `config.json` o en `dist/output.css`, no existe.**

> Idioma: español en respuestas y commits (`.cursorrules`).

---

## 1. Antes de escribir HTML

1. Lee **`config.json`** (o el config del consumidor).
2. Confirma en **`dist/output.css`** qué se generó realmente.
3. Modo de trabajo:
   - **Consumir** HG5 → imports npm + clases.
   - **Mantener** el repo → `config.json` / `themes/` + `npm run build`.

---

## 2. Instalación y consumo

### npm

```bash
npm install holygrail5
```

### Importar CSS

**Vite / Webpack / React:**
```js
import 'holygrail5/dist/output';
import 'holygrail5/dist/dutti';              // tema opcional, después del base
import 'holygrail5/dist/guide-styles.css';   // @font-face (recomendado)
```

**Next.js (layout):**
```tsx
import 'holygrail5/dist/output.css';
import 'holygrail5/dist/themes/dutti.css';
import 'holygrail5/dist/guide-styles.css';
```

**HTML / CDN:**
```html
<link rel="stylesheet" href="node_modules/holygrail5/dist/output.css">
<link rel="stylesheet" href="node_modules/holygrail5/dist/themes/dutti.css">
<link rel="stylesheet" href="node_modules/holygrail5/dist/guide-styles.css">
```

**unpkg:**
```html
<link rel="stylesheet" href="https://unpkg.com/holygrail5/dist/output.css">
<link rel="stylesheet" href="https://unpkg.com/holygrail5/dist/themes/dutti.css">
<link rel="stylesheet" href="https://unpkg.com/holygrail5/dist/guide-styles.css">
```

### Fuentes web (importante)

`output.css` **no incluye** `@font-face`. Las fuentes Suisse/mono están en **`guide-styles.css`** + **`dist/assets/fonts/`**.

Sin `guide-styles.css` verás fallbacks: `Arial`, `ui-monospace`, etc.

Familias en `fontFamilyMap`:
- `primary-thin`, `primary-light`, `primary-regular`, `primary-bold` (SemiBold 600)
- `secondary` (medium)
- `mono-regular`, `mono-bold` (fallback: `ui-monospace, monospace`)

### CSS personalizado

```bash
cp node_modules/holygrail5/config.json ./hg5-config.json
# editar hg5-config.json
npx holygrail5 --config=./hg5-config.json --output=./src/styles/hg5.css
```

### Desarrollo local (repo HG5)

```bash
npm run build    # genera dist/
npm run watch    # observa config + themes
npm run serve    # sirve dist/ en :3000
npm run publish:pkg  # test + publish (prepack ejecuta build)
```

---

## 3. Mapa de prefijos (memorizar)

| Sistema | Prefijo | Ejemplo |
|---------|---------|---------|
| Helpers layout | `hg-` | `.hg-d-flex`, `.hg-gap-16` |
| Color texto | `hg-c-` | `.hg-c-primary`, `.hg-c-error` |
| Color fondo | `hg-bg-` | `.hg-bg-white`, `.hg-bg-bg-cream` |
| Spacing | **ninguno** | `.p-16`, `.m-24`, `.mt-8` |
| Spacing lógico (RTL) | `hg-` | `.hg-px-16`, `.hg-mx-auto` |
| Tipografía | **ninguno** (salvo claves `hg-body-*`) | `.h2`, `.title-l`, `.label-mono` |
| Grid | **ninguno** | `.row`, `.col-md-6` |
| Aspect ratio | `hg-` | `.hg-aspect-16-9`, `.hg-aspect-image` |
| Tema Dutti | **ninguno** | `.btn`, `.input`, `.checkbox` |
| Accesibilidad | `hg-` | `.hg-sr-only` |

---

## 4. Reglas que no se negocian

1. **Mobile-first**: base = mobile; desktop con `md:` (992px por defecto).
2. **Nunca hardcodear** px, hex ni fuentes → `var(--hg-*)`.
3. Si un token no está en config, **no hay clase**.
4. Spacing sin `hg-`; helpers con `hg-`.
5. Grid = **flex** (`.row` + `.col-*`), no CSS Grid nativo.
6. Imágenes en ratio → `.hg-aspect-image`.
7. Componente con nombre → primera clase del root en **kebab-case** (`product-card`) + helpers HG5.
8. **RTL-safe**: preferir `.hg-px-*`, `.hg-py-*`, `.hg-mx-*`, `.hg-my-*`.
9. Cross-browser: fallbacks como en ratios (`aspect-ratio` + `padding-top`).
10. Tipografía: cada familia `suisse-*` es un cut único; `fontWeight` en config = peso real del face.

### Responsive

```html
<div class="p-8 md:p-32 hg-d-none md:hg-d-flex hg-gap-8 md:hg-gap-24">...</div>
```

En JSX: `className="md:hg-d-flex"`.

---

## 5. Variables CSS (`--hg-*`)

| Sección config | Genera |
|----------------|--------|
| `colors` | `--hg-color-{key}` |
| `spacingMap` | `--hg-spacing-{key}` (px → rem, base 16px) |
| `fontFamilyMap` | `--hg-typo-font-family-{key}` |
| `typo` | `--hg-typo-font-size-*`, `font-weight-*`, `line-height-*`, `letter-spacing-*`, `text-transform-*` |

### Colores (config actual)

`white`, `black`, `dark-grey`, `middle-grey`, `light-grey`, `grey-ultra`, `orange`, `mustard`, `primary`, `error`, `info`, `success`, `warning`, `feel`, `feel-dark`, `silver`, `gold`, `platinum`, `bg-light`, `bg-cream`, opacidades `black-3/15/30/60/97`, `white-3/15/30/60/97`.

```html
<div style="color: var(--hg-color-dark-grey); background: var(--hg-color-bg-cream)">...</div>
```

### Helpers de color (sin inline)

```html
<p class="hg-c-primary">Texto primary</p>
<p class="hg-c-error">Error</p>
<div class="hg-bg-bg-light p-16">Fondo claro</div>
<div class="hg-bg-black-97 hg-c-white p-16">Overlay oscuro</div>
```

Clases: `.hg-c-{colorKey}` y `.hg-bg-{colorKey}` para cada key de `config.colors`.

---

## 6. Spacing

Keys numéricos: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `36`, `40`, `48`, `56`, `64`, `72`, `80`, `88`, `96`, `104`, `112`, `120`, `128`, `136`, `144`, `152`, `160`.

Porcentajes: `20-percent`, `25-percent`, `33-percent`, `40-percent`, `50-percent`, `60-percent`, `66-percent`, `75-percent`, `100-percent`.

### Padding

| Clase | CSS |
|-------|-----|
| `.p-{key}` | padding 4 lados |
| `.pt-{key}` | padding-top |
| `.pb-{key}` | padding-bottom |
| `.pl-{key}` | padding-inline-start |
| `.pr-{key}` | padding-inline-end |
| `.hg-px-{key}` | padding-inline (RTL) |
| `.hg-py-{key}` | padding-block (RTL) |

### Margin

| Clase | CSS |
|-------|-----|
| `.m-{key}` | margin 4 lados |
| `.mt-{key}`, `.mb-{key}`, `.ml-{key}`, `.mr-{key}` | lados |
| `.hg-mx-{key}`, `.hg-my-{key}` | inline/block |
| `.hg-mx-auto` | centrado horizontal |
| `.hg-ml-auto`, `.hg-mr-auto` | alinear |

### Variantes

```html
<div class="p-8 md:p-32 mb-0 md:mb-24">...</div>
<div class="p-0!">Padding 0 !important</div>  <!-- solo keys en spacingImportant -->
```

---

## 7. Helpers de layout (prefijo `hg-`)

### Display

```html
<div class="hg-d-flex">Flex</div>
<div class="hg-d-block">Block</div>
<div class="hg-d-none">Oculto</div>
<div class="hg-d-inline-block">Inline block</div>
<div class="hg-d-inline-flex">Inline flex</div>
<div class="hg-d-contents">Contents</div>
<div class="hg-d-none md:hg-d-block">Solo desktop</div>
```

### Flexbox

```html
<div class="hg-flex-row">Horizontal</div>
<div class="hg-flex-column">Vertical</div>
<div class="hg-flex-wrap">Wrap</div>
<div class="hg-flex-nowrap">No wrap</div>
<div class="hg-grow-1">Crece</div>
<div class="hg-shrink-0">No encoge</div>
<div class="hg-flex-1">flex: 1 1 0%</div>
<div class="hg-flex-auto">flex: 1 1 auto</div>
<div class="hg-flex-none">flex: none</div>
<div class="hg-basis-auto">Basis auto</div>
<div class="hg-basis-full">Basis 100%</div>
<div class="hg-order-1">Orden</div>
<div class="hg-order-first">Primero</div>
<div class="hg-order-last">Último</div>
```

### Alineación

```html
<div class="hg-d-flex hg-justify-start|center|end|between|around|evenly|stretch">...</div>
<div class="hg-d-flex hg-items-start|center|end|baseline|stretch">...</div>
<div class="hg-d-flex hg-flex-wrap hg-content-center">...</div>
```

### Gap (usa spacingMap)

```html
<div class="hg-d-flex hg-gap-8">...</div>
<div class="hg-d-flex hg-gap-x-16 hg-gap-y-8">...</div>
<div class="hg-d-flex hg-gap-8 md:hg-gap-24">...</div>
```

### Dimensiones

```html
<div class="hg-w-100-percent">100%</div>
<div class="hg-w-50-percent">50%</div>
<div class="hg-w-auto">Auto</div>
<div class="hg-w-fit-content">Fit content</div>
<div class="hg-w-100vw">100vw</div>
<div class="hg-h-100-percent">100%</div>
<div class="hg-h-100vh">100vh</div>
<div class="hg-h-100dvh">100dvh</div>
<div class="hg-min-h-100vh">Min 100vh</div>
<div class="hg-min-h-100dvh">Min 100dvh</div>
```

### Posición

```html
<div class="hg-position-relative">Relative</div>
<div class="hg-position-absolute">Absolute</div>
<div class="hg-position-fixed">Fixed</div>
<div class="hg-position-sticky">Sticky</div>
<div class="hg-z-10">z-index 10</div>
```

### Texto, overflow, interacción

```html
<div class="hg-text-left|center|right|justify">...</div>
<div class="hg-text-underline|none">...</div>
<div class="hg-overflow-hidden|auto|scroll">...</div>
<div class="hg-overflow-x-auto">...</div>
<div class="hg-visibility-hidden">...</div>
<div class="hg-opacity-0|50|100">...</div>
<div class="hg-cursor-pointer|not-allowed|grab">...</div>
<div class="hg-pointer-events-none">...</div>
<img class="hg-object-cover|contain" src="..." alt="">
```

### Accesibilidad

```html
<span class="hg-sr-only">Texto solo para lectores de pantalla</span>
```

---

## 8. Grid

Activado con `grid.enabled: true`. Flex wrap + columnas.

| bp | min-width | columnas |
|----|-----------|----------|
| xs | 1px | 12 |
| sm | 768px | 12 |
| md | 992px | 12 |
| lg | 1280px | 12 |
| xl | 1440px | 24 |

Gutter: 8px. Container margin: 16px.

```html
<div class="row">
  <div class="col-xs-12 col-md-6">Mitad desktop</div>
  <div class="col-xs-12 col-md-6">Mitad desktop</div>
</div>

<div class="row">
  <aside class="col-xs-12 col-lg-3">Sidebar</aside>
  <main class="col-xs-12 col-lg-9">Contenido</main>
</div>

<!-- XL: 24 columnas -->
<div class="row">
  <div class="col-xl-8">8/24</div>
  <div class="col-xl-16">16/24</div>
</div>

<!-- Sin gutter -->
<div class="row bleed">...</div>
```

Las columnas deben sumar 12 (o 24 en xl) por fila.

---

## 9. Tipografía

Clases = **claves exactas** de `config.typo`. **No llevan prefijo `hg-`**, excepto las claves que en config empiezan por `hg-body-*`.

Mobile-first; override desktop @ 992px.

### Catálogo completo (config actual)

| Clase | Familia | Mobile | Desktop | Notas |
|-------|---------|--------|---------|-------|
| `.title-thin` | suisse-thin | 24px/lh1 | 24px/lh1 | Display; solo tamaños grandes |
| `.title-xxl` | suisse-regular | 24px/lh1 | 24px/lh1 | Display |
| `.h2` | suisse-semibold | 18px/lh1.2 | 24px/lh1.2 | Heading principal |
| `.title-l-b` | suisse-regular | 12px/lh1.4 | 13px/lh1.4 | |
| `.title-l` | suisse-light | 12px/lh1.4 | 13px/lh1.4 | uppercase, ls 0.16em |
| `.title-m` | suisse-light | 12px/lh1.4 | 13px/lh1.4 | ls 0.16em |
| `.title-s-b` | suisse-regular | 10px/lh1.4 | 10px/lh1.4 | ls 0.16em |
| `.title-s` | suisse-light | 10px/lh1.4 | 10px/lh1.4 | uppercase |
| `.text-l` | suisse-light | 13px/lh1.5 | 13px/lh1.5 | ls 0.04em |
| `.text-m` | suisse-light | 12px/lh1.5 | 12px/lh1.5 | ls 0.04em |
| `.p-tag` | suisse-light | 9px/lh1 | 10px/lh1 | ls 0.16em |
| `.hg-body-l` | suisse-light | 12px/lh1.5 | 13px/lh1.5 | |
| `.hg-body-l-b` | suisse-regular | 12px/lh1.5 | 13px/lh1.5 | |
| `.hg-body-m` | suisse-light | 12px/lh1.5 | 12px/lh1.5 | |
| `.hg-body-m-b` | suisse-regular | 12px/lh1.5 | 12px/lh1.5 | |
| `.label-m` | suisse-light | 12px/lh1 | 12px/lh1 | uppercase |
| `.label-m-b` | suisse-regular | 12px/lh1 | 12px/lh1 | uppercase |
| `.label-s` | suisse-light | 10px/lh1 | 10px/lh1 | uppercase, ls 0.06em |
| `.label-s-b` | suisse-regular | 10px/lh1 | 10px/lh1 | uppercase |
| `.label-mono` | mono-regular | 10px/lh1.2 | 10px/lh1.2 | uppercase mono |
| `.label-mono-b` | mono-bold | 10px/lh1.2 | 10px/lh1.2 | uppercase mono bold |

```html
<h1 class="h2">Título página</h1>
<h2 class="title-l-b">Subtítulo</h2>
<p class="text-m">Párrafo</p>
<span class="label-mono">REF-12345</span>
<span class="label-mono-b">NUEVO</span>
```

**Error común:** usar `.hg-h2` o `.hg-title-l` — **incorrecto**. Usar `.h2`, `.title-l`.

Variables tipográficas: `--hg-typo-font-family-primary-regular`, `--hg-typo-font-family-mono-regular`, `--hg-typo-font-size-12`, etc.

---

## 10. Aspect ratios

```html
<div class="hg-aspect hg-aspect-16-9">
  <img class="hg-aspect-image" src="hero.jpg" alt="">
</div>

<div class="hg-aspect hg-aspect-1-1">
  <img class="hg-aspect-image" src="avatar.jpg" alt="">
</div>

<div class="hg-aspect hg-aspect-4-3">
  <div class="hg-aspect-content">
    <h3 class="title-l-b">Texto sobre ratio</h3>
  </div>
</div>
```

| Clase | Ratio | Uso |
|-------|-------|-----|
| `.hg-aspect` | 2:3 | Default vertical |
| `.hg-aspect-1-1` | 1:1 | Cuadrado |
| `.hg-aspect-4-3` | 4:3 | Foto tradicional |
| `.hg-aspect-16-9` | 16:9 | Video/banner |
| `.hg-aspect-2-1` | 2:1 | Banner ancho |
| `.hg-aspect-2-3` | 2:3 | Vertical |
| `.hg-aspect-3-4` | 3:4 | Vertical |
| `.hg-aspect-3-1` | 3:1 | Separador XL |
| `.hg-aspect-7-1` | 7:1 | Separador LG |
| `.hg-aspect-12-1` | 12:1 | Separador MD |
| `.hg-aspect-24-1` | 24:1 | Separador SM |
| `.hg-aspect-9-20` | 9:20 | Vertical móvil |
| `.hg-aspect-16-4` | 16:4 | Banner |

- `.hg-aspect-image` → img/video: cover, 100% ancho/alto.
- `.hg-aspect-content` → contenido absoluto inset 0.

---

## 11. Tema Dutti — componentes UI

Importar **`holygrail5/dist/dutti`** después del base. Componentes en `themes/_base/`; tokens en `themes/dutti/_variables.css`.

### Botones

Variantes: `.btn-primary`, `.btn-secondary`, `.btn-tertiary`, `.btn-label-m`, `.btn-outline`, `.btn-ghost`, `.btn-feel`, `.btn-link`, `.btn-badge`.

Tamaños: `.btn-sm`, `.btn-md` (default), `.btn-lg`. Utilidades: `.btn-full`, `disabled`.

Badge en fondo oscuro: contenedor `.has-light` → `.btn-badge` texto blanco.

```html
<button class="btn btn-primary btn-md">Enviar</button>
<button class="btn btn-secondary btn-sm">Cancelar</button>
<button class="btn btn-outline btn-lg">Outline</button>
<button class="btn btn-link">Enlace</button>
<button class="btn btn-badge">Badge</button>
<button class="btn btn-primary btn-full" disabled>Deshabilitado</button>

<div class="has-light hg-bg-black p-16">
  <button class="btn btn-badge">Badge claro</button>
</div>
```

### Inputs, select, textarea

```html
<label class="label" for="nombre">Nombre</label>
<input type="text" id="nombre" class="input" placeholder="Tu nombre">

<input class="input input-error" value="Inválido">
<span class="helper-text helper-text-error">Campo con error</span>

<input class="input input-success">
<input class="input input-warning">

<select id="pais" class="select">
  <option value="">Selecciona</option>
  <option value="es">España</option>
</select>

<textarea class="textarea" placeholder="Mensaje..."></textarea>
```

Estados select/textarea: `.select-error`, `.textarea-success`, etc.

### Labels

```html
<label class="label" for="email">Email</label>
<label class="label label-required" for="email">Email *</label>

<label class="label label-inline">
  <input type="checkbox">
  <span>Inline</span>
</label>
```

### Checkbox

```html
<label class="checkbox">
  <input type="checkbox">
  <span class="checkbox-indicator"></span>
  <span class="checkbox-label">Acepto términos</span>
</label>
```

Input **antes** del indicador. Variantes avanzadas: `.checkbox-item`, `.checkbox-item-2`, `.checkbox-card` (ver `themes/_base/_checkboxes.css`).

### Radio

```html
<label class="radio">
  <input type="radio" name="opcion" value="1">
  <span class="radio-indicator"></span>
  <span class="radio-label">Opción A</span>
</label>
<label class="radio">
  <input type="radio" name="opcion" value="2">
  <span class="radio-indicator"></span>
  <span class="radio-label">Opción B</span>
</label>
```

Mismo `name` en el grupo.

### Switch

```html
<label class="switch">
  <input type="checkbox">
  <span class="switch-indicator"></span>
  <span class="switch-label">Notificaciones</span>
</label>
```

### Forms

```html
<form class="hg-d-flex hg-flex-column hg-gap-24">
  <div class="form-group">
    <label class="label label-required" for="nombre">Nombre</label>
    <input type="text" id="nombre" class="input" required>
    <span class="helper-text">Obligatorio</span>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label class="label" for="nombre2">Nombre</label>
      <input type="text" id="nombre2" class="input">
    </div>
    <div class="form-group">
      <label class="label" for="apellidos">Apellidos</label>
      <input type="text" id="apellidos" class="input">
    </div>
  </div>

  <label class="checkbox">
    <input type="checkbox" required>
    <span class="checkbox-indicator"></span>
    <span class="checkbox-label">Acepto condiciones</span>
  </label>

  <div class="hg-d-flex hg-gap-16">
    <button type="submit" class="btn btn-primary btn-md">Enviar</button>
    <button type="button" class="btn btn-secondary btn-md">Cancelar</button>
  </div>
</form>
```

Helper text: `.helper-text`, `.helper-text-error`, `.helper-text-success`, `.helper-text-warning`.

### Variables del tema (componentVars)

Botones: `--btn-primary-bg`, `--btn-padding-x-md`, etc.
Inputs: `--input-border`, `--input-border-focus`, `--input-padding-x`.
Mapeadas en `themes/dutti/_variables.css` → `var(--hg-*)`.

---

## 12. Patrones de layout

### Product card

```html
<article class="product-card row hg-gap-16 p-16">
  <div class="col-xs-12 col-md-5">
    <div class="hg-aspect hg-aspect-2-3">
      <img class="hg-aspect-image" src="product.jpg" alt="Producto">
    </div>
  </div>
  <div class="col-xs-12 col-md-7 hg-d-flex hg-flex-column hg-gap-8 hg-justify-center">
    <span class="label-mono">Nuevo</span>
    <h2 class="title-l-b">Nombre producto</h2>
    <p class="text-m hg-c-dark-grey">Descripción breve.</p>
    <span class="h2 hg-c-primary">49,90 €</span>
    <button class="btn btn-primary btn-md">Ver detalle</button>
  </div>
</article>
```

### Hero

```html
<section class="hg-d-flex hg-items-center hg-justify-center hg-min-h-100dvh hg-text-center p-24">
  <div>
    <h1 class="h2 mb-16">Bienvenido</h1>
    <p class="text-l hg-c-dark-grey">Subtítulo descriptivo</p>
  </div>
</section>
```

### Grid de cards

```html
<div class="row">
  <div class="col-xs-12 col-sm-6 col-lg-4 mb-24">
    <div class="hg-aspect hg-aspect-16-9">
      <img class="hg-aspect-image" src="img1.jpg" alt="">
    </div>
    <div class="pt-8">
      <h3 class="title-l-b">Título</h3>
      <p class="text-m">Descripción.</p>
    </div>
  </div>
  <!-- repetir -->
</div>
```

### Navbar sticky

```html
<header class="hg-position-sticky hg-z-50 hg-d-flex hg-justify-between hg-items-center p-16 hg-bg-white"
        style="top: 0; border-bottom: 1px solid var(--hg-color-middle-grey);">
  <span class="title-l-b">Logo</span>
  <nav class="hg-d-flex hg-gap-24">
    <a class="text-m hg-c-primary" href="#">Inicio</a>
    <a class="text-m" href="#">Productos</a>
  </nav>
</header>
```

### Sidebar layout

```html
<div class="row">
  <aside class="col-xs-12 col-md-3 hg-d-none md:hg-d-block p-16"
         style="border-right: 1px solid var(--hg-color-middle-grey);">
    <nav class="hg-d-flex hg-flex-column hg-gap-8">
      <a class="text-m" href="#">Sección 1</a>
      <a class="text-m" href="#">Sección 2</a>
    </nav>
  </aside>
  <main class="col-xs-12 col-md-9 p-16 md:p-32">
    <h1 class="h2">Contenido</h1>
    <p class="text-m">Texto principal.</p>
  </main>
</div>
```

### Footer multicolumna

```html
<footer class="pt-48 pb-24 hg-bg-grey-ultra hg-c-white">
  <div class="row hg-px-16 md:hg-px-32 hg-gap-24">
    <div class="col-xs-12 col-md-4">
      <h4 class="title-l-b hg-c-white">Empresa</h4>
      <p class="text-m hg-c-middle-grey">Descripción.</p>
    </div>
    <div class="col-xs-6 col-md-4">
      <h4 class="title-l-b hg-c-white">Enlaces</h4>
    </div>
    <div class="col-xs-6 col-md-4">
      <h4 class="title-l-b hg-c-white">Legal</h4>
    </div>
  </div>
</footer>
```

### Formulario responsive

```html
<div class="hg-d-flex hg-flex-column md:hg-flex-row hg-gap-16">
  <input type="text" class="input hg-grow-1">
  <button class="btn btn-primary btn-md">Buscar</button>
</div>
```

---

## 13. Convención de componentes (React/HTML)

```jsx
function ProductCard() {
  return (
    <article className="product-card row hg-gap-16 p-16">
      ...
    </article>
  );
}
```

Primera clase = nombre del componente en kebab-case. Luego helpers HG5.

---

## 14. Ampliar el sistema

| Necesidad | Acción |
|-----------|--------|
| Color / spacing / typo | `config.json` → `npm run build` |
| Helper nuevo | `config.helpers` |
| Ratio nuevo | `config.aspectRatios` |
| Fuente nueva | `fontFamilyMap` + assets + `@font-face` en guide-styles |
| Componente tema | `themes/_base/` o override en `themes/dutti/` |
| Tema nuevo | `themes/{nombre}/` + `config.themes[]` |

Personalización solo Dutti: `themes/dutti/_variables.css` (overrides `--hg-*`).

Commits: español, convencional, con afectación.
Ej: `feat: añadir label-mono (afecta a: config.json, dist/output.css)`.

---

## 15. Errores frecuentes

| Error | Corrección |
|-------|------------|
| `.hg-h2`, `.hg-title-l` | `.h2`, `.title-l` |
| `.p-14` sin key | `.p-12`/`.p-16` o ampliar spacingMap |
| `#000` inline | `.hg-c-primary` o `var(--hg-color-primary)` |
| Solo `output.css` | Añadir `guide-styles.css` |
| Clase inventada | Buscar en `dist/output.css` |
| Grid no suma 12/24 | Revisar `.col-*` |
| Checkbox sin estructura | input → indicator → label |

---

## 16. Checklist de entrega

- [ ] `config.json` / `dist/output.css` consultados
- [ ] Tipografías existentes (no inventar prefijo `hg-` en typo)
- [ ] Mobile-first + `md:` desktop
- [ ] Tokens solo `var(--hg-*)` o clases `.hg-c-*` / `.hg-bg-*`
- [ ] Fuentes cargadas si aplica
- [ ] Grid suma columnas correctas
- [ ] Ratios con `.hg-aspect-image`
- [ ] Forms: label + for + id
- [ ] Sin overflow horizontal en mobile
- [ ] Componente root con nombre kebab-case

---

## 17. Recursos del repo

| Recurso | Ruta |
|---------|------|
| Config fuente de verdad | `config.json` |
| CSS generado | `dist/output.css` |
| Fuentes @font-face | `dist/guide-styles.css` |
| Guía interactiva | `dist/index.html` |
| Demo tema Dutti | `dist/themes/dutti-demo.html` |
| Componentes compartidos | `themes/_base/` |
| Tokens tema Dutti | `themes/dutti/_variables.css` |
| Mantenimiento framework | `.claude/skills/holygrail5/SKILL.md` |
