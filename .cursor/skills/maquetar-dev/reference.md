# Referencia extendida — Maquetar Dev (HolyGrail5)

## Mapa de prefijos

| Sistema | Prefijo en clase | Ejemplo |
|---------|------------------|---------|
| Helpers | `hg-` | `.hg-d-flex` |
| Spacing | ninguno | `.p-16`, `.mt-24` |
| Spacing lógico | `hg-` | `.hg-px-16`, `.hg-mx-auto` |
| Tipografía | ninguno (salvo claves con `hg-` en config) | `.h2`, `.hg-body-m` |
| Grid | ninguno | `.row`, `.col-md-6` |
| Aspect ratio | `hg-` | `.hg-aspect-16-9` |
| Tema Dutti | ninguno | `.btn`, `.input` |

## SpacingMap completo (keys numéricos)

`0`, `4`, `8`, `12`, `16`, `20`, `24`, `32`, `36`, `40`, `48`, `56`, `64`, `72`, `80`, `88`, `96`, `104`, `112`, `120`, `128`, `136`, `144`, `152`, `160`

Porcentajes: `20-percent`, `25-percent`, `33-percent`, `40-percent`, `50-percent`, `60-percent`, `66-percent`, `75-percent`, `100-percent`

## Helpers por categoría

### Display
`hg-d-contents`, `hg-d-inline`, `hg-d-inline-block`, `hg-d-block`, `hg-d-flex`, `hg-d-inline-flex`, `hg-d-none`

### Flex
- Dirección: `hg-flex-row`, `hg-flex-column`
- Wrap: `hg-flex-wrap`, `hg-flex-nowrap`, `hg-flex-wrap-reverse`
- Grow/shrink: `hg-grow-0|1|2|3|auto`, `hg-shrink-0|1|2|3|auto`
- Shorthand: `hg-flex-1`, `hg-flex-auto`, `hg-flex-initial`, `hg-flex-none`
- Basis: `hg-basis-auto`, `hg-basis-full`, `hg-basis-0`
- Order: `hg-order-0` … `hg-order-3`, `hg-order-first`, `hg-order-last`, negativos

### Alineación
- `hg-justify-start|center|end|between|around|evenly|stretch`
- `hg-items-start|center|end|baseline|stretch`
- `hg-content-*` (align-content)
- `hg-justify-items-*`

### Gap
`hg-gap-{spacingKey}`, `hg-gap-x-{key}`, `hg-gap-y-{key}`

### Dimensiones
- Width: `hg-w-auto`, `hg-w-100-percent`, `hg-w-50-percent`, `hg-w-100vw`, `hg-w-fit-content`, …
- Height: `hg-h-auto`, `hg-h-100-percent`, `hg-h-100vh`, `hg-h-100dvh`, …
- Min-height: `hg-min-h-0`, `hg-min-h-100-percent`, `hg-min-h-100dvh`, …

### Posición / capas
`hg-position-static|relative|absolute|fixed|sticky`
`hg-z-0|10|20|30|40|50|auto`

### Overflow / visibilidad
`hg-overflow-auto|hidden|visible|scroll`
`hg-overflow-x-*`, `hg-overflow-y-*`
`hg-visibility-hidden`
`hg-opacity-0|25|50|70|75|100`

### Texto / interacción
`hg-text-left|center|right|justify`
`hg-text-underline|none`
`hg-cursor-pointer|grab|not-allowed|…`
`hg-pointer-events-none|auto`
`hg-object-cover|contain|fill|none|scale-down`

### Color helpers (si están en config)
`hg-color-{colorKey}`, `hg-bg-{colorKey}` — revisar `config.helpers` activos.

## Tipografías — detalle por clase

| Clase | Familia | Notas |
|-------|---------|-------|
| title-thin | suisse-thin | 24px, lh 1 |
| title-xxl | suisse-regular | 24px, lh 1 |
| h2 | suisse-semibold | 18→24px |
| title-l-b | suisse-regular | 12→13px |
| title-l | suisse-light | uppercase, ls 0.16em |
| title-m | suisse-light | 12→13px |
| title-s-b | suisse-regular | 10px |
| title-s | suisse-light | uppercase |
| text-l, text-m | suisse-light | cuerpo |
| p-tag | suisse-light | 9→10px |
| hg-body-* | light/regular | body variants |
| label-m, label-m-b | light/regular | uppercase 12px |
| label-s, label-s-b | light/regular | uppercase 10px |
| label-mono | mono-regular | 10px/120%, uppercase |
| label-mono-b | mono-bold | 10px/120%, uppercase |

## Patrones de layout

### Hero centrado
```html
<section class="hg-d-flex hg-items-center hg-justify-center hg-min-h-100dvh hg-px-16">
  <div class="hg-text-center">
    <h1 class="h2 mb-16">Título</h1>
    <p class="text-l">Subtítulo</p>
  </div>
</section>
```

### Cards 3 columnas
```html
<div class="row">
  <div class="col-xs-12 col-sm-6 col-lg-4 mb-24">...</div>
  <div class="col-xs-12 col-sm-6 col-lg-4 mb-24">...</div>
  <div class="col-xs-12 col-sm-6 col-lg-4 mb-24">...</div>
</div>
```

### Sidebar oculto en mobile
```html
<div class="row">
  <aside class="col-md-3 hg-d-none md:hg-d-block">Nav</aside>
  <main class="col-xs-12 col-md-9">...</main>
</div>
```

### Formulario completo
```html
<form class="hg-d-flex hg-flex-column hg-gap-24 p-16">
  <div class="form-group">
    <label class="label label-required" for="nombre">Nombre</label>
    <input id="nombre" class="input" type="text" required>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label class="checkbox">
        <input type="checkbox" required>
        <span class="checkbox-indicator"></span>
        <span class="checkbox-label">Acepto condiciones</span>
      </label>
    </div>
  </div>
  <div class="hg-d-flex hg-gap-16">
    <button type="submit" class="btn btn-primary btn-md">Enviar</button>
    <button type="button" class="btn btn-secondary btn-md">Cancelar</button>
  </div>
</form>
```

## Integración por stack

### Vite / React
```tsx
import 'holygrail5/dist/output';
import 'holygrail5/dist/dutti';
// Fuentes (opcional pero recomendado):
import 'holygrail5/dist/guide-styles.css';
```

### Next.js App Router
En `app/layout.tsx`:
```tsx
import 'holygrail5/dist/output.css';
import 'holygrail5/dist/themes/dutti.css';
import 'holygrail5/dist/guide-styles.css';
```

### Personalizar tokens
```bash
cp node_modules/holygrail5/config.json ./hg5-config.json
npx holygrail5 --config=./hg5-config.json --output=./src/styles/hg5.css
```

## Archivos clave del repo

| Archivo | Rol |
|---------|-----|
| `config.json` | Fuente de verdad de clases y variables |
| `dist/output.css` | CSS generado para consumo |
| `dist/guide-styles.css` | @font-face + estilos guía |
| `themes/_base/` | Componentes compartidos Dutti/Limited |
| `themes/dutti/_variables.css` | Overrides de tokens del tema |
| `themes/dutti/theme.css` | Entry del tema |

## Validación antes de entregar HTML

1. Todas las clases existen en config o en CSS del tema.
2. Spacing keys válidos.
3. Layout responsive probado mentalmente en xs y md.
4. Sin valores hardcodeados evitables.
5. Imágenes en ratios llevan `.hg-aspect-image`.
6. Formularios accesibles: `label` + `for` + `id`.
