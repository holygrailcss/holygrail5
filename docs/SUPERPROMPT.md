# Superprompt de Maquetación con HolyGrail CSS

Guía completa de referencia rápida para maquetar páginas web usando las clases y variables CSS de HolyGrail5.

## 📋 Índice Rápido

1. [Clases de Tipografía](#clases-de-tipografía)
2. [Helpers de Spacing](#helpers-de-spacing)
3. [Helpers de Layout](#helpers-de-layout)
4. [Sistema de Grid](#sistema-de-grid)
5. [Colores y Variables CSS](#colores-y-variables-css)
6. [Diseño Responsive](#diseño-responsive)
7. [Patrones y Ejemplos](#patrones-y-ejemplos)
8. [Mejores Prácticas](#mejores-prácticas)

---

No usar nunca estilos inline, crearemos clases y intentaremos reutilizarlas en la medida de lo posible. 


## Clases de Tipografía

### Uso Básico

```html
<h1 class="h2">Título Principal</h1>
<h2 class="title-l-b">Título Grande Negrita</h2>
<h3 class="title-l">Título Grande</h3>
<h4 class="title-m">Título Mediano</h4>
<h5 class="title-s">Título Pequeño</h5>
<p class="text-l">Texto Grande</p>
<p class="text-m">Texto Mediano</p>
<p class="suisse-1">Texto con Fuente Secundaria</p>
```

### Clases Disponibles

| Clase | Uso | Responsive |
|-------|-----|------------|
| `.h2` | Título principal grande | ✅ Automático |
| `.title-l-b` | Título grande negrita | ✅ Automático |
| `.title-l` | Título grande normal | ✅ Automático |
| `.title-m` | Título mediano | ✅ Automático |
| `.title-s` | Título pequeño | ✅ Automático |
| `.text-l` | Texto grande | ✅ Automático |
| `.text-m` | Texto mediano | ✅ Automático |
| `.suisse-1`, `.suisse-2`, `.suisse-body` | Fuentes secundarias | ✅ Automático |

### Características

- ✅ **Responsive automático**: Tamaños diferentes en mobile y desktop
- ✅ **Font weight incluido**: 100, 400, 700, 900 según la clase
- ✅ **Line height optimizado**: Diferente en mobile y desktop
- ✅ **Letter spacing**: Configurado automáticamente
- ✅ **Text transform**: Uppercase, lowercase, none según la clase

---

## Helpers de Spacing

### Nomenclatura

**Patrón:** `{tipo}{dirección}-{valor}`

- **Tipo:** `p` (padding) o `m` (margin)
- **Dirección:** 
  - Sin letra = todos los lados
  - `t` = top
  - `r` = right/end (RTL compatible)
  - `b` = bottom
  - `l` = left/start (RTL compatible)
- **Valor:** Número del spacingMap (ej: `4`, `8`, `16`, `50-percent`)

### Padding

```html
<!-- Todos los lados -->
<div class="p-16">Padding 16px en todos los lados</div>

<!-- Lados específicos -->
<div class="pt-8">Padding superior 8px</div>
<div class="pr-4">Padding derecho 4px (RTL compatible)</div>
<div class="pb-24">Padding inferior 24px</div>
<div class="pl-12">Padding izquierdo 12px (RTL compatible)</div>

<!-- Combinar múltiples -->
<div class="pt-16 pb-8 pr-4 pl-4">
  Padding: 16px arriba, 8px abajo, 4px laterales
</div>
```

### Margin

```html
<!-- Todos los lados -->
<div class="m-16">Margin 16px en todos los lados</div>

<!-- Lados específicos -->
<div class="mt-8">Margin superior 8px</div>
<div class="mr-4">Margin derecho 4px (RTL compatible)</div>
<div class="mb-24">Margin inferior 24px</div>
<div class="ml-12">Margin izquierdo 12px (RTL compatible)</div>

<!-- Centrar horizontalmente -->
<div class="m-0 mx-auto">Centrado con margin automático</div>
```

### Todos los Valores Disponibles

**Valores en píxeles:**
- `0` - Sin spacing
- `4`, `8`, `12`, `16`, `20`, `24` - Valores pequeños/medianos
- `32`, `36`, `40` - Valores medianos
- `64`, `72`, `80`, `88`, `96` - Valores grandes
- `104`, `112`, `120`, `128`, `136`, `144`, `152`, `160` - Valores extra grandes

**Valores en porcentajes:**
- `20-percent` - 20%
- `25-percent` - 25%
- `33-percent` - 33.333333%
- `40-percent` - 40%
- `50-percent` - 50%
- `60-percent` - 60%
- `66-percent` - 66.666667%
- `75-percent` - 75%
- `100-percent` - 100%

**Ejemplos:**
```html
<div class="p-0">Sin padding</div>
<div class="p-4">Padding 4px</div>
<div class="p-8">Padding 8px</div>
<div class="p-12">Padding 12px</div>
<div class="p-16">Padding 16px</div>
<div class="p-20">Padding 20px</div>
<div class="p-24">Padding 24px</div>
<div class="p-32">Padding 32px</div>
<div class="p-36">Padding 36px</div>
<div class="p-40">Padding 40px</div>
<div class="p-64">Padding 64px</div>
<div class="p-72">Padding 72px</div>
<div class="p-80">Padding 80px</div>
<div class="p-88">Padding 88px</div>
<div class="p-96">Padding 96px</div>
<div class="p-104">Padding 104px</div>
<div class="p-112">Padding 112px</div>
<div class="p-120">Padding 120px</div>
<div class="p-128">Padding 128px</div>
<div class="p-136">Padding 136px</div>
<div class="p-144">Padding 144px</div>
<div class="p-152">Padding 152px</div>
<div class="p-160">Padding 160px</div>
<div class="p-20-percent">Padding 20%</div>
<div class="p-25-percent">Padding 25%</div>
<div class="p-33-percent">Padding 33.333333%</div>
<div class="p-40-percent">Padding 40%</div>
<div class="p-50-percent">Padding 50%</div>
<div class="p-60-percent">Padding 60%</div>
<div class="p-66-percent">Padding 66.666667%</div>
<div class="p-75-percent">Padding 75%</div>
<div class="p-100-percent">Padding 100%</div>
```

### Versiones Responsive

```html
<!-- Padding pequeño en mobile, grande en desktop -->
<div class="p-8 md:p-24">Contenido</div>

<!-- Sin padding en mobile, con padding en desktop -->
<div class="p-0 md:p-16">Contenido</div>
```

---

## Helpers de Layout

### Display

```html
<div class="hg-d-block">Display block</div>
<div class="hg-d-flex">Display flex</div>
<div class="hg-d-none">Ocultar elemento</div>
<div class="hg-d-inline-block">Display inline-block</div>
<div class="hg-d-contents">Display contents</div>
<div class="hg-d-inline">Display inline</div>
<div class="hg-d-inline-flex">Display inline-flex</div>
```

### Flexbox - Dirección

```html
<!-- Fila (horizontal) -->
<div class="hg-d-flex hg-flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Columna (vertical) -->
<div class="hg-d-flex hg-flex-column">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Flexbox - Alineación Horizontal (justify-content)

```html
<div class="hg-d-flex hg-justify-start">Inicio</div>
<div class="hg-d-flex hg-justify-center">Centro</div>
<div class="hg-d-flex hg-justify-end">Final</div>
<div class="hg-d-flex hg-justify-between">Espacio entre</div>
<div class="hg-d-flex hg-justify-around">Espacio alrededor</div>
<div class="hg-d-flex hg-justify-evenly">Espacio uniforme</div>
<div class="hg-d-flex hg-justify-stretch">Estirar</div>
```

### Flexbox - Alineación Vertical (align-items)

```html
<div class="hg-d-flex hg-items-start">Arriba</div>
<div class="hg-d-flex hg-items-center">Centro vertical</div>
<div class="hg-d-flex hg-items-end">Abajo</div>
<div class="hg-d-flex hg-items-stretch">Estirar</div>
<div class="hg-d-flex hg-items-baseline">Baseline</div>
```

### Flexbox - Wrap

```html
<div class="hg-d-flex hg-flex-nowrap">Sin wrap</div>
<div class="hg-d-flex hg-flex-wrap">Con wrap</div>
```

### Flexbox - Gap

Los helpers de gap usan los valores del spacingMap. Valores disponibles: `0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `36`, `40`, `64`, `72`, `80`, `88`, `96`, `104`, `112`, `120`, `128`, `136`, `144`, `152`, `160`, y porcentajes: `20-percent`, `25-percent`, `33-percent`, `40-percent`, `50-percent`, `60-percent`, `66-percent`, `75-percent`, `100-percent`.

```html
<!-- Gap en todas las direcciones -->
<div class="hg-d-flex hg-gap-0">Sin gap</div>
<div class="hg-d-flex hg-gap-4">Gap 4px</div>
<div class="hg-d-flex hg-gap-8">Gap 8px</div>
<div class="hg-d-flex hg-gap-12">Gap 12px</div>
<div class="hg-d-flex hg-gap-16">Gap 16px</div>
<div class="hg-d-flex hg-gap-20">Gap 20px</div>
<div class="hg-d-flex hg-gap-24">Gap 24px</div>
<div class="hg-d-flex hg-gap-32">Gap 32px</div>
<div class="hg-d-flex hg-gap-40">Gap 40px</div>
<div class="hg-d-flex hg-gap-64">Gap 64px</div>
<div class="hg-d-flex hg-gap-80">Gap 80px</div>
<div class="hg-d-flex hg-gap-96">Gap 96px</div>
<div class="hg-d-flex hg-gap-50-percent">Gap 50%</div>

<!-- Gap horizontal (column-gap) -->
<div class="hg-d-flex hg-gap-x-8">Gap horizontal 8px</div>
<div class="hg-d-flex hg-gap-x-16">Gap horizontal 16px</div>
<div class="hg-d-flex hg-gap-x-24">Gap horizontal 24px</div>

<!-- Gap vertical (row-gap) -->
<div class="hg-d-flex hg-flex-column hg-gap-y-12">Gap vertical 12px</div>
<div class="hg-d-flex hg-flex-column hg-gap-y-16">Gap vertical 16px</div>
<div class="hg-d-flex hg-flex-column hg-gap-y-24">Gap vertical 24px</div>
```

### Flexbox - Grow y Shrink

```html
<!-- Item que crece -->
<div class="hg-d-flex">
  <div class="hg-grow-0">No crece</div>
  <div class="hg-grow-1">Crece 1x</div>
  <div class="hg-grow-2">Crece 2x</div>
  <div class="hg-grow-3">Crece 3x</div>
  <div class="hg-grow-auto">Crece automático</div>
</div>

<!-- Item que se encoge -->
<div class="hg-d-flex">
  <div class="hg-shrink-0">No se encoge</div>
  <div class="hg-shrink-1">Se encoge 1x</div>
  <div class="hg-shrink-2">Se encoge 2x</div>
  <div class="hg-shrink-3">Se encoge 3x</div>
  <div class="hg-shrink-auto">Se encoge automático</div>
</div>
```

### Flexbox - Alineación de Contenido (align-content)

```html
<div class="hg-d-flex hg-flex-wrap hg-content-stretch">Estirar líneas</div>
<div class="hg-d-flex hg-flex-wrap hg-content-start">Inicio de líneas</div>
<div class="hg-d-flex hg-flex-wrap hg-content-end">Final de líneas</div>
<div class="hg-d-flex hg-flex-wrap hg-content-center">Centro de líneas</div>
<div class="hg-d-flex hg-flex-wrap hg-content-between">Espacio entre líneas</div>
<div class="hg-d-flex hg-flex-wrap hg-content-around">Espacio alrededor de líneas</div>
<div class="hg-d-flex hg-flex-wrap hg-content-evenly">Espacio uniforme entre líneas</div>
```

### Flexbox - Justify Items (Grid)

```html
<div class="hg-justify-items-stretch">Estirar items</div>
<div class="hg-justify-items-start">Inicio items</div>
<div class="hg-justify-items-end">Final items</div>
<div class="hg-justify-items-center">Centro items</div>
<div class="hg-justify-items-between">Espacio entre items</div>
<div class="hg-justify-items-around">Espacio alrededor items</div>
<div class="hg-justify-items-evenly">Espacio uniforme items</div>
```

### Flexbox - Order

```html
<div class="hg-d-flex">
  <div class="hg-order-2">Aparece segundo</div>
  <div class="hg-order-1">Aparece primero</div>
  <div class="hg-order-3">Aparece tercero</div>
</div>

<!-- Orden especial -->
<div class="hg-order-first">Al inicio</div>
<div class="hg-order-last">Al final</div>
<div class="hg-order-3-neg">Orden -3</div>
<div class="hg-order-2-neg">Orden -2</div>
<div class="hg-order-1-neg">Orden -1</div>
```

### Versiones Responsive

```html
<!-- Flex en desktop, block en mobile -->
<div class="hg-d-block md:hg-d-flex">Contenido</div>

<!-- Columna en mobile, fila en desktop -->
<div class="hg-d-flex hg-flex-column md:hg-flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Centrado solo en desktop -->
<div class="hg-d-flex md:hg-justify-center">Contenido</div>
```

---

## Sistema de Grid

### Estructura Básica

```html
<div class="row">
  <div class="col-xs-12 col-md-6 col-lg-4">
    Columna 1
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    Columna 2
  </div>
  <div class="col-xs-12 col-md-12 col-lg-4">
    Columna 3
  </div>
</div>
```

### Breakpoints y Columnas

| Breakpoint | Ancho Mínimo | Columnas | Clase |
|------------|--------------|----------|-------|
| xs | 1px | 12 | `.col-xs-{1-12}` |
| sm | 768px | 12 | `.col-sm-{1-12}` |
| md | 992px | 12 | `.col-md-{1-12}` |
| lg | 1280px | 12 | `.col-lg-{1-12}` |
| xl | 1440px | 24 | `.col-xl-{1-24}` |

### Ejemplos de Grid

```html
<!-- Grid responsive básico -->
<div class="row">
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16">Card 1</div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16">Card 2</div>
  </div>
  <div class="col-xs-12 col-md-12 col-lg-4">
    <div class="p-16">Card 3</div>
  </div>
</div>

<!-- Grid de 24 columnas (XL) -->
<div class="row">
  <div class="col-xs-12 col-xl-8">
    <div class="p-16">Ocupa 8 de 24 columnas</div>
  </div>
  <div class="col-xs-12 col-xl-16">
    <div class="p-16">Ocupa 16 de 24 columnas</div>
  </div>
</div>
```

### Clases Especiales

#### Bleed (Sangrado)

```html
<!-- Elimina márgenes laterales del gutter -->
<div class="row bleed">
  <div class="col-xs-12">
    <div class="p-16">Sin márgenes laterales</div>
  </div>
</div>
```

#### Bleed-0 (Sin Padding)

```html
<!-- Elimina completamente padding y márgenes -->
<div class="bleed-0">
  <div class="row">
    <div class="col-xs-12">
      <div>Sin padding ni márgenes</div>
    </div>
  </div>
</div>
```

### Combinando Grid con Helpers

```html
<div class="row">
  <div class="col-xs-12 col-md-6">
    <div class="p-16 hg-d-flex hg-flex-column hg-justify-center">
      <h2 class="h2 mb-8">Título</h2>
      <p class="text-m">Descripción</p>
    </div>
  </div>
  <div class="col-xs-12 col-md-6">
    <div class="p-16" style="background-color: var(--hg-color-bg-light);">
      <img src="imagen.jpg" alt="Imagen" style="width: 100%;">
    </div>
  </div>
</div>
```

---

## Colores y Variables CSS

### Todos los Colores Disponibles

```css
/* Colores básicos */
var(--hg-color-white)        /* #ffffff */
var(--hg-color-black)        /* #000000 */
var(--hg-color-primary)      /* #000000 */

/* Colores de estado */
var(--hg-color-error)        /* #b40016 */
var(--hg-color-success)      /* #76ae4a */
var(--hg-color-warning)      /* #ffc700 */
var(--hg-color-info)         /* #1a32a4 */

/* Colores de grises */
var(--hg-color-dark-grey)    /* #737373 */
var(--hg-color-middle-grey)  /* #a9a9a9 */
var(--hg-color-light-grey)   /* #f0f0f0 */
var(--hg-color-sk-grey)      /* #e3e3e3 */

/* Colores especiales */
var(--hg-color-feel)         /* #fb9962 */
var(--hg-color-feel-dark)    /* #c94c07 */
var(--hg-color-special)      /* #b99d6b */

/* Colores de fondo */
var(--hg-color-bg-light)     /* #F0F0F0 */
var(--hg-color-bg-cream)      /* #f4f2ed */
var(--hg-color-c-bg-light)    /* #000000 */
```

**Uso en HTML:**
```html
<div style="background-color: var(--hg-color-white);">Fondo blanco</div>
<div style="background-color: var(--hg-color-black);">Fondo negro</div>
<div style="background-color: var(--hg-color-primary);">Fondo primario</div>
<div style="background-color: var(--hg-color-error);">Fondo error</div>
<div style="background-color: var(--hg-color-success);">Fondo éxito</div>
<div style="background-color: var(--hg-color-warning);">Fondo advertencia</div>
<div style="background-color: var(--hg-color-info);">Fondo información</div>
<div style="background-color: var(--hg-color-dark-grey);">Fondo gris oscuro</div>
<div style="background-color: var(--hg-color-middle-grey);">Fondo gris medio</div>
<div style="background-color: var(--hg-color-light-grey);">Fondo gris claro</div>
<div style="background-color: var(--hg-color-sk-grey);">Fondo gris sk</div>
<div style="background-color: var(--hg-color-feel);">Fondo feel</div>
<div style="background-color: var(--hg-color-feel-dark);">Fondo feel oscuro</div>
<div style="background-color: var(--hg-color-special);">Fondo especial</div>
<div style="background-color: var(--hg-color-bg-light);">Fondo claro</div>
<div style="background-color: var(--hg-color-bg-cream);">Fondo crema</div>
<div style="background-color: var(--hg-color-c-bg-light);">Fondo c-bg-light</div>
```

### Uso en CSS

```css
.mi-clase {
  background-color: var(--hg-color-primary);
  color: var(--hg-color-white);
  border: 1px solid var(--hg-color-light-grey);
}

/* Con opacidad */
.mi-clase {
  background-color: var(--hg-color-primary);
  opacity: 0.8;
}

/* Con gradientes */
.mi-clase {
  background: linear-gradient(
    to right,
    var(--hg-color-primary),
    var(--hg-color-success)
  );
}
```

### Uso en HTML

```html
<div style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">
  Contenido con colores
</div>
```

### Variables de Tipografía

```css
/* Font Families */
var(--hg-typo-font-family-primary)
var(--hg-typo-font-family-secondary)

/* Font Sizes */
var(--hg-typo-font-size-18)
var(--hg-typo-font-size-24)

/* Line Heights */
var(--hg-typo-line-height-1-2)
var(--hg-typo-line-height-1-5)

/* Font Weights */
var(--hg-typo-font-weight-100)
var(--hg-typo-font-weight-400)
var(--hg-typo-font-weight-700)
var(--hg-typo-font-weight-900)
```

### Variables de Spacing

```css
var(--hg-spacing-0)
var(--hg-spacing-4)
var(--hg-spacing-8)
var(--hg-spacing-16)
var(--hg-spacing-24)
var(--hg-spacing-50-percent)
```

### Sobrescribir Variables

```css
/* Cambiar variable solo en un contexto */
.mi-seccion {
  --hg-color-primary: #ff0000;
}

.mi-seccion .boton {
  background-color: var(--hg-color-primary); /* Usa #ff0000 */
}
```

---

## Diseño Responsive

### Estrategia Mobile-First

Las clases base se aplican en mobile, y las versiones `md:` se aplican en desktop (≥992px):

```html
<!-- Tamaño pequeño en mobile, grande en desktop -->
<h1 class="h2">Título (18px mobile, 24px desktop)</h1>

<!-- Padding pequeño en mobile, grande en desktop -->
<div class="p-8 md:p-24">Contenido</div>

<!-- Columna en mobile, fila en desktop -->
<div class="hg-d-flex hg-flex-column md:hg-flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Ocultar/Mostrar Elementos

```html
<!-- Ocultar en mobile, mostrar en desktop -->
<div class="hg-d-none md:hg-d-block">
  Solo visible en desktop
</div>

<!-- Mostrar en mobile, ocultar en desktop -->
<div class="hg-d-block md:hg-d-none">
  Solo visible en mobile
</div>
```

### Breakpoints Múltiples

```html
<!-- Diferentes valores para cada breakpoint -->
<div class="p-8 md:p-16 lg:p-24">
  Padding progresivo
</div>

<!-- Grid responsive -->
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
    Columna responsive
  </div>
</div>
```

### Imágenes Responsive

```html
<div class="col-xs-12 col-md-6">
  <img src="imagen.jpg" alt="Imagen" style="width: 100%; height: auto;">
</div>
```

---

## Patrones y Ejemplos

### Header con Navegación

```html
<header class="p-16 md:p-24" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">
  <div class="hg-d-flex hg-flex-column md:hg-flex-row hg-justify-between hg-items-center">
    <h1 class="h2">Mi Sitio Web</h1>
    <nav class="hg-d-flex hg-gap-16 mt-16 md:mt-0">
      <a href="#" class="text-m" style="color: var(--hg-color-white);">Inicio</a>
      <a href="#" class="text-m" style="color: var(--hg-color-white);">Productos</a>
      <a href="#" class="text-m" style="color: var(--hg-color-white);">Contacto</a>
    </nav>
  </div>
</header>
```

### Card Simple

```html
<div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
  <h3 class="title-l-b mb-8">Título de la Card</h3>
  <p class="text-m mb-16">Descripción de la card con texto normal.</p>
  <button class="p-8" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">
    Botón
  </button>
</div>
```

### Grid de Cards

```html
<div class="row">
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
      <h3 class="title-l-b mb-8">Card 1</h3>
      <p class="text-m">Contenido</p>
    </div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
      <h3 class="title-l-b mb-8">Card 2</h3>
      <p class="text-m">Contenido</p>
    </div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
      <h3 class="title-l-b mb-8">Card 3</h3>
      <p class="text-m">Contenido</p>
    </div>
  </div>
</div>
```

### Hero Section

```html
<section class="p-24 md:p-64" style="background-color: var(--hg-color-bg-light);">
  <div class="hg-d-flex hg-flex-column hg-items-center hg-justify-center" style="text-align: center;">
    <h1 class="h2 mb-16">Bienvenido a Mi Sitio</h1>
    <p class="text-l mb-24" style="max-width: 600px;">
      Descripción del sitio web con texto grande y legible.
    </p>
    <div class="hg-d-flex hg-gap-16 hg-flex-column md:hg-flex-row">
      <button class="p-16" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">
        Call to Action
      </button>
      <button class="p-16" style="background-color: transparent; border: 1px solid var(--hg-color-primary);">
        Más Información
      </button>
    </div>
  </div>
</section>
```

### Formulario

```html
<form class="p-24" style="max-width: 500px; margin: 0 auto;">
  <div class="mb-16">
    <label class="title-s mb-8" style="display: block;">Nombre</label>
    <input type="text" class="p-8" style="width: 100%; border: 1px solid var(--hg-color-light-grey);">
  </div>
  
  <div class="mb-16">
    <label class="title-s mb-8" style="display: block;">Email</label>
    <input type="email" class="p-8" style="width: 100%; border: 1px solid var(--hg-color-light-grey);">
  </div>
  
  <button type="submit" class="p-12" style="background-color: var(--hg-color-primary); color: var(--hg-color-white); width: 100%;">
    Enviar
  </button>
</form>
```

### Layout Completo (Header, Sidebar, Footer)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Layout Completo</title>
  <link rel="stylesheet" href="dist/output.css">
</head>
<body>
  <!-- Header -->
  <header class="p-16 md:p-24" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">
    <div class="row">
      <div class="col-xs-12">
        <div class="hg-d-flex hg-flex-column md:hg-flex-row hg-justify-between hg-items-center">
          <h1 class="h2">Mi Sitio Web</h1>
          <nav class="hg-d-flex hg-gap-16 mt-16 md:mt-0">
            <a href="#" class="text-m" style="color: var(--hg-color-white);">Inicio</a>
            <a href="#" class="text-m" style="color: var(--hg-color-white);">Productos</a>
            <a href="#" class="text-m" style="color: var(--hg-color-white);">Contacto</a>
          </nav>
        </div>
      </div>
    </div>
  </header>

  <!-- Contenido principal -->
  <main>
    <div class="row">
      <!-- Sidebar -->
      <aside class="col-xs-12 col-md-3">
        <div class="p-16 md:p-24" style="background-color: var(--hg-color-bg-light); min-height: calc(100vh - 200px);">
          <h2 class="title-l-b mb-16">Categorías</h2>
          <nav class="hg-d-flex hg-flex-column hg-gap-8">
            <a href="#" class="text-m">Categoría 1</a>
            <a href="#" class="text-m">Categoría 2</a>
            <a href="#" class="text-m">Categoría 3</a>
          </nav>
        </div>
      </aside>
      
      <!-- Contenido -->
      <article class="col-xs-12 col-md-9">
        <div class="p-16 md:p-24">
          <h2 class="h2 mb-16">Título del Artículo</h2>
          <p class="text-m mb-16">
            Contenido principal del artículo con texto largo que describe el tema principal.
          </p>
          
          <!-- Grid de cards -->
          <div class="row">
            <div class="col-xs-12 col-md-6 col-lg-4">
              <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
                <h3 class="title-l-b mb-8">Card 1</h3>
                <p class="text-m">Descripción de la card.</p>
              </div>
            </div>
            <div class="col-xs-12 col-md-6 col-lg-4">
              <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
                <h3 class="title-l-b mb-8">Card 2</h3>
                <p class="text-m">Descripción de la card.</p>
              </div>
            </div>
            <div class="col-xs-12 col-md-6 col-lg-4">
              <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
                <h3 class="title-l-b mb-8">Card 3</h3>
                <p class="text-m">Descripción de la card.</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </main>

  <!-- Footer -->
  <footer class="p-16 md:p-24" style="background-color: var(--hg-color-primary); color: var(--hg-color-white);">
    <div class="row">
      <div class="col-xs-12">
        <div class="hg-d-flex hg-flex-column md:hg-flex-row hg-justify-between hg-items-center">
          <p class="text-m">© 2024 Mi Sitio Web</p>
          <div class="hg-d-flex hg-gap-16 mt-16 md:mt-0">
            <a href="#" class="text-m" style="color: var(--hg-color-white);">Términos</a>
            <a href="#" class="text-m" style="color: var(--hg-color-white);">Privacidad</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>
```

### Modal/Dialog

```html
<!-- Overlay -->
<div class="hg-d-flex hg-items-center hg-justify-center" style="
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
">
  <!-- Modal -->
  <div class="p-24" style="
    background-color: var(--hg-color-white);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  ">
    <h2 class="h2 mb-16">Título del Modal</h2>
    <p class="text-m mb-24">Contenido del modal aquí.</p>
    <div class="hg-d-flex hg-gap-16 hg-justify-end">
      <button class="p-8" style="
        background-color: transparent;
        border: 1px solid var(--hg-color-light-grey);
      ">Cancelar</button>
      <button class="p-8" style="
        background-color: var(--hg-color-primary);
        color: var(--hg-color-white);
      ">Aceptar</button>
    </div>
  </div>
</div>
```

### Tabla de Datos

```html
<div class="row">
  <div class="col-xs-12">
    <div class="p-16" style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: var(--hg-color-bg-light);">
            <th class="p-8 text-m" style="text-align: left; border-bottom: 2px solid var(--hg-color-primary);">Nombre</th>
            <th class="p-8 text-m" style="text-align: left; border-bottom: 2px solid var(--hg-color-primary);">Email</th>
            <th class="p-8 text-m" style="text-align: left; border-bottom: 2px solid var(--hg-color-primary);">Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-8 text-m" style="border-bottom: 1px solid var(--hg-color-light-grey);">Juan Pérez</td>
            <td class="p-8 text-m" style="border-bottom: 1px solid var(--hg-color-light-grey);">juan@example.com</td>
            <td class="p-8 text-m" style="border-bottom: 1px solid var(--hg-color-light-grey);">Admin</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

### Dashboard con Grid

```html
<div class="row">
  <!-- Sidebar -->
  <aside class="col-xs-12 col-md-3">
    <div class="p-16" style="background-color: var(--hg-color-bg-light); min-height: 100vh;">
      <h2 class="title-l-b mb-16">Menú</h2>
      <nav class="hg-d-flex hg-flex-column hg-gap-8">
        <a href="#" class="text-m">Dashboard</a>
        <a href="#" class="text-m">Usuarios</a>
        <a href="#" class="text-m">Configuración</a>
      </nav>
    </div>
  </aside>
  
  <!-- Contenido principal -->
  <main class="col-xs-12 col-md-9">
    <div class="p-16 md:p-24">
      <h1 class="h2 mb-16">Dashboard</h1>
      
      <!-- Cards de estadísticas -->
      <div class="row">
        <div class="col-xs-12 col-md-4">
          <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
            <h3 class="title-s mb-8">Usuarios</h3>
            <p class="h2">1,234</p>
          </div>
        </div>
        <div class="col-xs-12 col-md-4">
          <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
            <h3 class="title-s mb-8">Ventas</h3>
            <p class="h2">$5,678</p>
          </div>
        </div>
        <div class="col-xs-12 col-md-4">
          <div class="p-16" style="background-color: var(--hg-color-white); border: 1px solid var(--hg-color-light-grey);">
            <h3 class="title-s mb-8">Pedidos</h3>
            <p class="h2">89</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

### Galería de Imágenes

```html
<div class="row">
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-8">
      <img src="imagen1.jpg" alt="Imagen 1" style="width: 100%; height: auto;">
      <p class="text-m mt-8">Descripción 1</p>
    </div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-8">
      <img src="imagen2.jpg" alt="Imagen 2" style="width: 100%; height: auto;">
      <p class="text-m mt-8">Descripción 2</p>
    </div>
  </div>
  <div class="col-xs-12 col-md-6 col-lg-4">
    <div class="p-8">
      <img src="imagen3.jpg" alt="Imagen 3" style="width: 100%; height: auto;">
      <p class="text-m mt-8">Descripción 3</p>
    </div>
  </div>
</div>
```

---

## Mejores Prácticas

### 1. Usa las Clases de Tipografía

✅ **Bien:**
```html
<h1 class="h2">Título</h1>
<p class="text-m">Párrafo</p>
```

❌ **Evita:**
```html
<h1 style="font-size: 24px; font-weight: 900;">Título</h1>
```

### 2. Combina Helpers de Spacing

✅ **Bien:**
```html
<div class="p-16 mb-24">
  Contenido con padding y margin
</div>
```

❌ **Evita:**
```html
<div style="padding: 16px; margin-bottom: 24px;">
  Contenido
</div>
```

### 3. Usa Flexbox para Layouts

✅ **Bien:**
```html
<div class="hg-d-flex hg-justify-between hg-items-center">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

❌ **Evita:**
```html
<div style="display: flex; justify-content: space-between; align-items: center;">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 4. Aprovecha las Versiones Responsive

✅ **Bien:**
```html
<div class="p-8 md:p-24">
  Padding responsive
</div>
```

❌ **Evita:**
```html
<div class="p-8" style="padding: 24px;">
  <!-- No funciona bien en mobile -->
</div>
```

### 5. Usa Variables CSS para Colores

✅ **Bien:**
```css
.mi-clase {
  background-color: var(--hg-color-primary);
  color: var(--hg-color-white);
}
```

❌ **Evita:**
```css
.mi-clase {
  background-color: #000000;
  color: #ffffff;
}
```

### 6. Combina Múltiples Clases

✅ **Bien:**
```html
<div class="hg-d-flex hg-flex-row hg-justify-center hg-items-center hg-gap-16 p-24">
  Contenido
</div>
```

### 7. Usa HTML Semántico

✅ **Bien:**
```html
<header class="p-16">
  <nav class="hg-d-flex hg-gap-16">...</nav>
</header>
```

❌ **Evita:**
```html
<div class="p-16">
  <div class="hg-d-flex hg-gap-16">...</div>
</div>
```

### 8. Organiza tus Clases

Agrupa clases relacionadas para mejor legibilidad:

✅ **Bien:**
```html
<div class="hg-d-flex hg-flex-row hg-justify-center hg-items-center hg-gap-16 p-24">
```

❌ **Evita:**
```html
<div class="hg-d-flex p-24 hg-flex-row hg-gap-16 hg-justify-center hg-items-center">
```

### 9. Usa el Grid Correctamente

✅ **Bien:**
```html
<div class="row">
  <div class="col-xs-12 col-md-6">...</div>
</div>
```

❌ **Evita:**
```html
<div class="col-xs-12">...</div> <!-- Sin .row -->
```

### 10. Accesibilidad

- Usa HTML semántico (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Incluye textos alternativos en imágenes: `<img alt="Descripción">`
- Asegura contraste adecuado entre texto y fondo
- Usa atributos ARIA cuando sea necesario: `aria-label="Cerrar modal"`

---

## Referencia Rápida de Clases

### Tipografía
- `.h2` - Título principal
- `.title-l-b` - Título grande negrita
- `.title-l` - Título grande
- `.title-m` - Título mediano
- `.title-s` - Título pequeño
- `.text-l` - Texto grande
- `.text-m` - Texto mediano

### Spacing
- `.p-{valor}` - Padding todos los lados
- `.pt-{valor}`, `.pr-{valor}`, `.pb-{valor}`, `.pl-{valor}` - Padding por lado
- `.m-{valor}` - Margin todos los lados
- `.mt-{valor}`, `.mr-{valor}`, `.mb-{valor}`, `.ml-{valor}` - Margin por lado
- `.md:p-{valor}` - Versiones responsive

### Layout - Display
- `.hg-d-contents` - Display contents
- `.hg-d-inline` - Display inline
- `.hg-d-inline-block` - Display inline-block
- `.hg-d-block` - Display block
- `.hg-d-flex` - Display flex
- `.hg-d-inline-flex` - Display inline-flex
- `.hg-d-none` - Ocultar elemento

### Layout - Flexbox Dirección
- `.hg-flex-row` - Fila (horizontal)
- `.hg-flex-column` - Columna (vertical)

### Layout - Flexbox Wrap
- `.hg-flex-nowrap` - Sin wrap
- `.hg-flex-wrap` - Con wrap

### Layout - Justify Content (Alineación Horizontal)
- `.hg-justify-stretch` - Estirar
- `.hg-justify-start` - Inicio
- `.hg-justify-end` - Final
- `.hg-justify-center` - Centro
- `.hg-justify-between` - Espacio entre
- `.hg-justify-around` - Espacio alrededor
- `.hg-justify-evenly` - Espacio uniforme

### Layout - Align Items (Alineación Vertical)
- `.hg-items-stretch` - Estirar
- `.hg-items-start` - Arriba
- `.hg-items-end` - Abajo
- `.hg-items-center` - Centro vertical
- `.hg-items-baseline` - Baseline

### Layout - Align Content (Alineación de Líneas)
- `.hg-content-stretch` - Estirar líneas
- `.hg-content-start` - Inicio de líneas
- `.hg-content-end` - Final de líneas
- `.hg-content-center` - Centro de líneas
- `.hg-content-between` - Espacio entre líneas
- `.hg-content-around` - Espacio alrededor de líneas
- `.hg-content-evenly` - Espacio uniforme entre líneas

### Layout - Justify Items (Grid)
- `.hg-justify-items-stretch` - Estirar items
- `.hg-justify-items-start` - Inicio items
- `.hg-justify-items-end` - Final items
- `.hg-justify-items-center` - Centro items
- `.hg-justify-items-between` - Espacio entre items
- `.hg-justify-items-around` - Espacio alrededor items
- `.hg-justify-items-evenly` - Espacio uniforme items

### Layout - Grow
- `.hg-grow-0` - No crece
- `.hg-grow-1` - Crece 1x
- `.hg-grow-2` - Crece 2x
- `.hg-grow-3` - Crece 3x
- `.hg-grow-auto` - Crece automático

### Layout - Shrink
- `.hg-shrink-0` - No se encoge
- `.hg-shrink-1` - Se encoge 1x
- `.hg-shrink-2` - Se encoge 2x
- `.hg-shrink-3` - Se encoge 3x
- `.hg-shrink-auto` - Se encoge automático

### Layout - Order
- `.hg-order-first` - Al inicio (-9999)
- `.hg-order-1-neg` - Orden -1
- `.hg-order-2-neg` - Orden -2
- `.hg-order-3-neg` - Orden -3
- `.hg-order-0` - Orden 0
- `.hg-order-1` - Orden 1
- `.hg-order-2` - Orden 2
- `.hg-order-3` - Orden 3
- `.hg-order-last` - Al final (9999)

### Layout - Gap
- `.hg-gap-{valor}` - Gap en todas las direcciones (usa valores del spacingMap)
- `.hg-gap-x-{valor}` - Gap horizontal (column-gap)
- `.hg-gap-y-{valor}` - Gap vertical (row-gap)

### Layout - Responsive
- `.md:hg-*` - Versiones responsive para desktop (≥992px)

### Grid
- `.row` - Contenedor de fila
- `.col-xs-{1-12}` - Columnas extra small (12 columnas)
- `.col-sm-{1-12}` - Columnas small (12 columnas)
- `.col-md-{1-12}` - Columnas medium (12 columnas)
- `.col-lg-{1-12}` - Columnas large (12 columnas)
- `.col-xl-{1-24}` - Columnas extra large (24 columnas)
- `.bleed` - Sangrado (sin márgenes laterales)
- `.bleed-0` - Sin padding ni márgenes

### Colores (Variables CSS)
- `var(--hg-color-white)` - #ffffff
- `var(--hg-color-black)` - #000000
- `var(--hg-color-primary)` - #000000
- `var(--hg-color-error)` - #b40016
- `var(--hg-color-success)` - #76ae4a
- `var(--hg-color-warning)` - #ffc700
- `var(--hg-color-info)` - #1a32a4
- `var(--hg-color-dark-grey)` - #737373
- `var(--hg-color-middle-grey)` - #a9a9a9
- `var(--hg-color-light-grey)` - #f0f0f0
- `var(--hg-color-sk-grey)` - #e3e3e3
- `var(--hg-color-feel)` - #fb9962
- `var(--hg-color-feel-dark)` - #c94c07
- `var(--hg-color-special)` - #b99d6b
- `var(--hg-color-bg-light)` - #F0F0F0
- `var(--hg-color-bg-cream)` - #f4f2ed
- `var(--hg-color-c-bg-light)` - #000000

---

**¡Listo para maquetar con HolyGrail CSS! 🎨**
