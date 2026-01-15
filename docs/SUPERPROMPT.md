# HolyGrail 5 - Framework CSS

Framework CSS utility-first similar a Tailwind/Bootstrap. Mobile-first, responsive automático, sistema de grid 12/24 columnas.

## Setup

```html
<link rel="stylesheet" href="dist/output.css">
```

## Reglas
- NO usar estilos inline
- Usar clases reutilizables
- Mobile-first (base + `md:` para ≥992px)

---

## 1. Tipografía

| Clase | Uso |
|-------|-----|
| `.h2` | Título principal (responsive) |
| `.title-l-b` | Título grande bold |
| `.title-l` | Título grande |
| `.title-m` | Título mediano |
| `.title-s` | Título pequeño |
| `.text-l` | Texto grande |
| `.text-m` | Texto mediano |
| `.suisse-1`, `.suisse-2`, `.suisse-body` | Font secundaria |

**Características**: Responsive auto, font-weight incluido, line-height optimizado, letter-spacing, text-transform.

```html
<h1 class="h2 mb-16">Título</h1>
<p class="text-m">Párrafo</p>
```

---

## 2. Spacing

**Valores disponibles**: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `36`, `40`, `64`, `72`, `80`, `88`, `96`, `104`, `112`, `120`, `128`, `136`, `144`, `152`, `160`, `20-percent`, `25-percent`, `33-percent`, `40-percent`, `50-percent`, `60-percent`, `66-percent`, `75-percent`, `100-percent`

### ¿Cómo se generan los helpers de espaciado?

**Primera letra**: Tipo de spacing → `p` (padding) o `m` (margin).

**Clases Legacy (sin prefijo)**: Se generan automáticamente para cada valor del spacingMap:
- **Padding**: `p-{valor}` `pt-{valor}` `pr-{valor}` `pb-{valor}` `pl-{valor}`
- **Margin**: `m-{valor}` `mt-{valor}` `mr-{valor}` `mb-{valor}` `ml-{valor}` `mx-auto`

**Clases Modernas (con prefijo `hg-`)**: A estas clases legacy se añaden versiones inline con prefijo `hg-`:
- **Padding**: `.hg-px-{valor}` (padding-inline/horizontal) `.hg-py-{valor}` (padding-block/vertical)
- **Margin**: `.hg-mx-{valor}` (margin-inline/horizontal) `.hg-my-{valor}` (margin-block/vertical)

```html
<!-- Legacy -->
<div class="p-16 mb-24">Contenido</div>
<div class="pt-8 pb-16 pl-4 pr-4">Padding mixto</div>

<!-- Modernas (RTL-aware) -->
<div class="hg-px-16 hg-py-8">Padding horizontal y vertical</div>
<div class="hg-mx-auto" style="max-width: 800px;">Centrado horizontal</div>
<div class="hg-px-24 hg-my-16">Padding horizontal + margin vertical</div>

<!-- Responsive -->
<div class="p-8 md:p-24">Legacy responsive</div>
<div class="hg-px-8 md:hg-px-24 hg-py-8 md:hg-py-16">Moderna responsive</div>
```

---

## 3. Layout - Display & Flexbox

### Display
`.hg-d-block` | `.hg-d-flex` | `.hg-d-none` | `.hg-d-inline-block` | `.hg-d-contents` | `.hg-d-inline` | `.hg-d-inline-flex`

### Flex Direction
`.hg-flex-row` | `.hg-flex-column`

### Justify (horizontal)
`.hg-justify-start` | `.hg-justify-center` | `.hg-justify-end` | `.hg-justify-between` | `.hg-justify-around` | `.hg-justify-evenly` | `.hg-justify-stretch`

### Align Items (vertical)
`.hg-items-start` | `.hg-items-center` | `.hg-items-end` | `.hg-items-stretch` | `.hg-items-baseline`

### Wrap
`.hg-flex-wrap` | `.hg-flex-nowrap`

### Gap
`.hg-gap-{valor}` | `.hg-gap-x-{valor}` | `.hg-gap-y-{valor}`
Valores: mismos que spacing

### Grow/Shrink
`.hg-grow-0` `.hg-grow-1` `.hg-grow-2` `.hg-grow-3` `.hg-grow-auto`
`.hg-shrink-0` `.hg-shrink-1` `.hg-shrink-2` `.hg-shrink-3` `.hg-shrink-auto`

### Order
`.hg-order-first` `.hg-order-last` `.hg-order-0` `.hg-order-1` `.hg-order-2` `.hg-order-3` 
`.hg-order-1-neg` `.hg-order-2-neg` `.hg-order-3-neg`

### Align Content
`.hg-content-stretch` | `.hg-content-start` | `.hg-content-end` | `.hg-content-center` | `.hg-content-between` | `.hg-content-around` | `.hg-content-evenly`

### Justify Items
`.hg-justify-items-stretch` | `.hg-justify-items-start` | `.hg-justify-items-end` | `.hg-justify-items-center` | `.hg-justify-items-between` | `.hg-justify-items-around` | `.hg-justify-items-evenly`

```html
<div class="hg-d-flex hg-flex-column md:hg-flex-row hg-justify-between hg-items-center hg-gap-16">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 4. Grid System

### Breakpoints

| BP | Min | Cols | Clases |
|----|-----|------|--------|
| xs | 1px | 12 | `.col-xs-{1-12}` |
| sm | 768px | 12 | `.col-sm-{1-12}` |
| md | 992px | 12 | `.col-md-{1-12}` |
| lg | 1280px | 12 | `.col-lg-{1-12}` |
| xl | 1440px | 24 | `.col-xl-{1-24}` |

### Uso
```html
<div class="row">
  <div class="col-xs-12 col-md-6 col-lg-4">Columna 1</div>
  <div class="col-xs-12 col-md-6 col-lg-4">Columna 2</div>
</div>
```

### Especiales
- `.bleed` - Sin márgenes laterales (full bleed)
- `.bleed-0` - Sin padding ni márgenes

---

## 5. Ratios de Aspecto

### Estructura
```html
<div class="hg-aspect-16-9">
  <div class="hg-aspect-content">
    <img class="hg-aspect-image" src="img.jpg" alt="..." />
  </div>
</div>
```

### Clases Disponibles

| Clase | Ratio | Uso |
|-------|-------|-----|
| `.hg-aspect` | 2:3 | Default vertical |
| `.hg-aspect-1-1` | 1:1 | Cuadrado |
| `.hg-aspect-4-3` | 4:3 | Tradicional |
| `.hg-aspect-16-9` | 16:9 | Video |
| `.hg-aspect-2-1` | 2:1 | Banner |
| `.hg-aspect-2-3` | 2:3 | Retrato |
| `.hg-aspect-3-4` | 3:4 | Vertical |
| `.hg-aspect-3-1` | 3:1 | Separador XL |
| `.hg-aspect-7-1` | 7:1 | Separador LG |
| `.hg-aspect-12-1` | 12:1 | Separador MD |
| `.hg-aspect-24-1` | 24:1 | Separador SM |
| `.hg-aspect-9-20` | 9:20 | Stories |
| `.hg-aspect-16-4` | 16:4 | Banner ancho |

**Clases internas**:
- `.hg-aspect-content` - Contenedor (position: absolute, inset: 0)
- `.hg-aspect-image` - Img/video (object-fit: cover, display: block)

**Features**: aspect-ratio nativo, fallback padding-top, overflow: hidden auto.

---

## 6. Colores (Variables CSS)

### Básicos
`--hg-color-white` `--hg-color-black` `--hg-color-primary`

### Estado
`--hg-color-error` `--hg-color-success` `--hg-color-warning` `--hg-color-info`

### Grises
`--hg-color-dark-grey` `--hg-color-middle-grey` `--hg-color-light-grey` `--hg-color-sk-grey`

### Especiales
`--hg-color-feel` `--hg-color-feel-dark` `--hg-color-special`

### Fondos
`--hg-color-bg-light` `--hg-color-bg-cream` `--hg-color-c-bg-light`

### Tipografía (Variables)
`--hg-typo-font-family-primary` `--hg-typo-font-family-secondary`
`--hg-typo-font-size-{valor}` `--hg-typo-line-height-{valor}` `--hg-typo-font-weight-{valor}`

### Spacing (Variables)
`--hg-spacing-{valor}`

### Uso
```html
<div style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">...</div>
```

```css
.mi-clase {
  background-color: var(--hg-color-primary);
  color: var(--hg-color-white);
}
```

---

## 7. Responsive

**Mobile-First**: Base = mobile, `md:` = desktop (≥992px)

```html
<!-- Padding responsive -->
<div class="p-8 md:p-24">...</div>

<!-- Layout responsive -->
<div class="hg-d-flex hg-flex-column md:hg-flex-row">...</div>

<!-- Visibilidad -->
<div class="hg-d-none md:hg-d-block">Solo desktop</div>
<div class="hg-d-block md:hg-d-none">Solo mobile</div>
```

---

## 8. Patrones Comunes

### Header
```html
<header class="p-16 md:p-24" style="background-color: var(--hg-color-primary);">
  <div class="hg-d-flex hg-flex-column md:hg-flex-row hg-justify-between hg-items-center">
    <h1 class="h2">Logo</h1>
    <nav class="hg-d-flex hg-gap-16 mt-16 md:mt-0">
      <a href="#" class="text-m">Link 1</a>
      <a href="#" class="text-m">Link 2</a>
    </nav>
  </div>
</header>
```

### Card
```html
<div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
  <h3 class="title-l-b mb-8">Título</h3>
  <p class="text-m mb-16">Descripción</p>
  <button class="p-8" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">CTA</button>
</div>
```

### Grid de Cards
```html
<div class="row">
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16">Card 1</div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16">Card 2</div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16">Card 3</div>
  </div>
</div>
```

### Hero
```html
<section class="p-24 md:p-64" style="background-color: var(--hg-color-bg-light);">
  <div class="hg-d-flex hg-flex-column hg-items-center hg-justify-center" style="text-align: center;">
    <h1 class="h2 mb-16">Título</h1>
    <p class="text-l mb-24">Subtítulo</p>
    <button class="p-16" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">CTA</button>
  </div>
</section>
```

### Galería con Ratios
```html
<div class="row">
  <div class="col-xs-12 col-md-4">
    <div class="hg-aspect-1-1">
      <div class="hg-aspect-content">
        <img class="hg-aspect-image" src="img1.jpg" alt="..." />
      </div>
    </div>
  </div>
  <div class="col-xs-12 col-md-4">
    <div class="hg-aspect-1-1">
      <div class="hg-aspect-content">
        <img class="hg-aspect-image" src="img2.jpg" alt="..." />
      </div>
    </div>
  </div>
</div>
```

### Video Responsive
```html
<div class="hg-aspect-16-9">
  <div class="hg-aspect-content">
    <iframe class="hg-aspect-image" src="https://youtube.com/embed/ID" frameborder="0" allowfullscreen></iframe>
  </div>
</div>
```

### Formulario
```html
<form class="p-24" style="max-width: 500px;">
  <div class="mb-16">
    <label class="title-s mb-8" style="display: block;">Campo</label>
    <input type="text" class="p-8" style="width: 100%; border: 1px solid var(--hg-color-light-grey);">
  </div>
  <button type="submit" class="p-12" style="background-color: var(--hg-color-primary); color: var(--hg-color-white); width: 100%;">Enviar</button>
</form>
```

---

## 9. Referencia Rápida

### Tipografía
`.h2` `.title-l-b` `.title-l` `.title-m` `.title-s` `.text-l` `.text-m` `.suisse-1` `.suisse-2` `.suisse-body`

### Spacing
**Legacy**: `{p|m}{t|r|b|l|}-{valor}` `mx-auto`
**Modernas**: `.hg-px-{valor}` `.hg-py-{valor}` `.hg-mx-{valor}` `.hg-my-{valor}` `.hg-mx-auto`
**Valores**: `0|4|8|12|16|20|24|32|36|40|64|72|80|88|96|104|112|120|128|136|144|152|160|20-percent|25-percent|33-percent|40-percent|50-percent|60-percent|66-percent|75-percent|100-percent`
**Responsive**: `md:{spacing}`

### Display
`.hg-d-block` `.hg-d-flex` `.hg-d-none` `.hg-d-inline-block` `.hg-d-contents` `.hg-d-inline` `.hg-d-inline-flex`
`md:hg-d-*` para responsive

### Flexbox
- **Direction**: `.hg-flex-row` `.hg-flex-column`
- **Wrap**: `.hg-flex-wrap` `.hg-flex-nowrap`
- **Justify**: `.hg-justify-{start|center|end|between|around|evenly|stretch}`
- **Align Items**: `.hg-items-{start|center|end|stretch|baseline}`
- **Align Content**: `.hg-content-{stretch|start|end|center|between|around|evenly}`
- **Justify Items**: `.hg-justify-items-{stretch|start|end|center|between|around|evenly}`
- **Gap**: `.hg-gap-{valor}` `.hg-gap-x-{valor}` `.hg-gap-y-{valor}`
- **Grow**: `.hg-grow-{0|1|2|3|auto}`
- **Shrink**: `.hg-shrink-{0|1|2|3|auto}`
- **Order**: `.hg-order-{first|last|0|1|2|3|1-neg|2-neg|3-neg}`

### Grid
`.row` `.col-xs-{1-12}` `.col-sm-{1-12}` `.col-md-{1-12}` `.col-lg-{1-12}` `.col-xl-{1-24}` `.bleed` `.bleed-0`

### Ratios
`.hg-aspect` `.hg-aspect-1-1` `.hg-aspect-4-3` `.hg-aspect-16-9` `.hg-aspect-2-1` `.hg-aspect-2-3` `.hg-aspect-3-4` `.hg-aspect-3-1` `.hg-aspect-7-1` `.hg-aspect-12-1` `.hg-aspect-24-1` `.hg-aspect-9-20` `.hg-aspect-16-4`
`.hg-aspect-content` `.hg-aspect-image`

### Colores
`var(--hg-color-white)` `var(--hg-color-black)` `var(--hg-color-primary)` `var(--hg-color-error)` `var(--hg-color-success)` `var(--hg-color-warning)` `var(--hg-color-info)` `var(--hg-color-dark-grey)` `var(--hg-color-middle-grey)` `var(--hg-color-light-grey)` `var(--hg-color-sk-grey)` `var(--hg-color-feel)` `var(--hg-color-feel-dark)` `var(--hg-color-special)` `var(--hg-color-bg-light)` `var(--hg-color-bg-cream)` `var(--hg-color-c-bg-light)`

---

## Mejores Prácticas

1. **Usar clases, NO inline styles**: `class="p-16"` en vez de `style="padding: 16px;"`
2. **Preferir clases modernas con prefijo** `hg-` para mejor compatibilidad RTL: `.hg-px-16` `.hg-py-8`
3. **Responsive mobile-first**: `class="p-8 md:p-24"` o `class="hg-px-8 md:hg-px-24"`
4. **Combinar helpers**: `class="hg-d-flex hg-justify-center hg-items-center hg-gap-16 hg-px-24"`
5. **Variables para colores**: `var(--hg-color-primary)` en vez de `#000000`
6. **HTML semántico**: `<header>` `<nav>` `<main>` `<footer>` `<article>` `<aside>`
7. **Accesibilidad**: `alt=""` en imágenes, `aria-label=""` cuando necesario

---

**HolyGrail 5 - Listo para maquetar** 🎨
