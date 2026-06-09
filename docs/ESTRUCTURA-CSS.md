# Estructura CSS de HolyGrail5

## Nomenclatura de Selectores: BEM con Namespace `.hg-`

Todos los selectores siguen la metodología **BEM** (Block, Element, Modifier) con el prefijo obligatorio `.hg-` como namespace del framework, lo que evita colisiones con CSS de terceros y deja claro el origen de cada clase.

### Estructura general

```
.hg-[bloque]
.hg-[bloque]__[elemento]
.hg-[bloque]--[modificador]
.hg-[bloque]__[elemento]--[modificador]
```

### Reglas

- **Namespace obligatorio:** todo selector de componente empieza con `.hg-`. Sin excepción.
- **Bloque:** nombre del componente en kebab-case (`hg-btn`, `hg-tablist`, `hg-accordion`).
- **Elemento** (`__`): parte interna del componente, separada por doble guión bajo (`hg-tablist__item`, `hg-accordion__panel`).
- **Modificador** (`--`): variante visual o funcional del bloque o elemento, separado por doble guión (`hg-btn--primary`, `hg-tablist__item--large`).
- Los estados dinámicos **no** usan modificadores BEM; se modelan con clases `.is-*` (ver apartado correspondiente).

### Ejemplos

```css
/* Bloque */
.hg-btn { }

/* Elemento */
.hg-tablist__item { }

/* Modificador de bloque */
.hg-btn--primary { }

/* Modificador de elemento */
.hg-tablist__item--large { }

/* Estado programático (no es BEM, es .is-*) */
.hg-tablist__item.is-active { }
```

### Variables CSS

Las custom properties siguen el mismo patrón pero precedidas de `--`:

```
--hg-[bloque]-[propiedad]
--hg-[bloque]-[elemento]-[propiedad]
```

```css
--hg-btn-bg: …;
--hg-tablist-item-color-active: …;
```

---

## Orden de Declaraciones en Archivos CSS

Los archivos CSS de HolyGrail5 siguen una estructura específica para mantener consistencia y facilitar el mantenimiento:

### 1. Variables CSS en `:root` (Mobile First)

Primero se declaran las variables CSS en el selector `:root` con valores para **mobile** (valores base):

```css
:root {
    --hg-btn-padding-block: var(--hg-spacing-2);
    --hg-btn-padding-inline: var(--hg-spacing-8);
    --hg-btn-border-radius: 3px;
    --hg-btn-font-family: var(--hg-typo-font-family-primary);
    --hg-btn-font-weight: var(--hg-typo-font-weight-100);
    --hg-btn-font-size: var(--hg-typo-font-size-12);
    --hg-btn-line-height: var(--hg-typo-line-height-1-5);
}
```

**Reglas:**
- Usar siempre variables CSS (`--hg-*`)
- Referencias a otras variables del sistema (`var(--hg-spacing-*)`)
- Valores mobile por defecto

### 2. Media Queries para Variables (Desktop)

Luego se sobrescriben las variables para **breakpoints mayores** (desktop):

```css
@media (min-width: 62rem) {
  :root {
    --hg-btn-padding-inline: var(--hg-spacing-16);
    --hg-btn-border-radius: 5px;
    --hg-btn-font-size: var(--hg-typo-font-size-14);
  }
}
```

**Nota:** Solo se incluyen las variables que cambian en desktop.

### 3. Clases Base

Definir las clases base usando las variables CSS:

```css
.hg-btn {
  border-radius: var(--hg-btn-border-radius);
  font-family: var(--hg-btn-font-family);
  font-size: var(--hg-btn-font-size);
  font-weight: var(--hg-btn-font-weight);
  line-height: var(--hg-btn-line-height);
  padding-block: var(--hg-btn-padding-block);
  padding-inline: var(--hg-btn-padding-inline);
  /* Más propiedades... */
}
```

**Reglas:**
- Usar SIEMPRE las variables CSS definidas en `:root`
- NO usar valores hardcodeados
- Ordenar propiedades lógicamente (layout → espaciado → tipografía → colores)

### 4. Estados y Pseudo-clases

Después de la clase base, definir estados (`:hover`, `:focus`, `:active`, etc.):

```css
.hg-btn:hover {
  background-color: var(--hg-btn-bg-hover);
}

.hg-btn:focus {
  outline: var(--hg-btn-focus-ring);
}

.hg-btn:active {
  background-color: var(--hg-btn-bg-active);
}
```

### 5. Clases de Estado Programáticas (`.is-*`)

Los estados que son gestionados por lógica (JavaScript, atributos dinámicos, interacción del usuario) se declaran con el prefijo `.is-`. Estas clases se añaden o eliminan sobre el elemento en tiempo de ejecución:

```css
.hg-tablist__item.is-active {
  color: var(--hg-tablist-item-color-active);
  border-bottom: var(--hg-tablist-item-border-active);
}

.hg-dropdown.is-open .hg-dropdown__panel {
  display: block;
}

.hg-input.is-invalid {
  border-color: var(--hg-color-error);
}

.hg-accordion__panel.is-expanded {
  grid-template-rows: 1fr;
}
```

**Reglas:**
- Usar **siempre** `.is-*` para estados controlados programáticamente (nunca inventar nombres propios por componente)
- Las clases `.is-*` se aplican **sobre** el elemento afectado, nunca como clase solitaria
- Ejemplos canónicos: `.is-active`, `.is-open`, `.is-expanded`, `.is-disabled`, `.is-loading`, `.is-invalid`, `.is-selected`, `.is-hidden`
- NO duplicar lo que ya expresan las pseudo-clases CSS nativas (`:hover`, `:focus`, `:disabled`); usar `.is-*` solo cuando el estado no tiene pseudo-clase equivalente o cuando el estado viene de JS

### 6. Media Queries para Clases (Desktop)

Finalmente, los media queries para modificar las clases en **desktop**:

```css
@media (min-width: 62rem) {
  .hg-btn--primary {
    min-width: var(--hg-spacing-160);
  }
}
```

## Estructura Completa (Template)

```css
/* 1. Variables CSS - Mobile First */
:root {
  --hg-component-property: value;
  --hg-component-property-2: value;
}

/* 2. Variables CSS - Desktop */
@media (min-width: 62rem) {
  :root {
    --hg-component-property: new-value;
    --hg-component-property-2: new-value-2;
  }
}

/* 3. Clases Base */
.hg-component {
  property: var(--hg-component-property);
  property-2: var(--hg-component-property-2);
}

/* 4. Variantes de la Clase */
.hg-component--variant {
  property: different-value;
}

/* 5. Estados y Pseudo-clases */
.hg-component:hover {
  property: hover-value;
}

.hg-component:focus {
  property: focus-value;
}

/* 6. Clases de Estado Programáticas (.is-*) */
.hg-component.is-active {
  property: active-value;
}

.hg-component.is-disabled {
  property: disabled-value;
}

/* 7. Media Queries para Clases - Desktop */
@media (min-width: 62rem) {
  .hg-component {
    property: desktop-value;
  }

  .hg-component--variant {
    property: desktop-variant-value;
  }
}
```

## Reglas Importantes

### ✅ Hacer:
- **Mobile First**: Valores base para mobile, luego desktop
- **Variables CSS**: Siempre usar `var(--hg-*)`
- **Orden**: `:root` → media queries variables → clases → pseudo-clases → `.is-*` → media queries clases
- **Consistencia**: Mantener el mismo orden en todos los archivos
- **Estados programáticos**: Usar `.is-*` para cualquier estado controlado por JS o lógica dinámica (`.is-active`, `.is-open`, `.is-expanded`, `.is-invalid`, etc.)

### ❌ NO Hacer:
- NO usar valores hardcodeados (ej: `padding: 8px`)
- NO mezclar variables y media queries de clases
- NO poner media queries dentro de las declaraciones de clase
- NO usar `!important` (excepto casos excepcionales)
- NO inventar nombres arbitrarios de estado por componente (ej: `.hg-tab--selected`, `.hg-menu--abierto`); usar siempre el prefijo `.is-*`
- NO usar `.is-*` como clase solitaria sin combinarse con la clase del componente

## Breakpoints de HolyGrail5

```css
/* Mobile: < 48rem (768px) - valores base */

/* Tablet: >= 48rem (768px) */
@media (min-width: 48rem) { }

/* Desktop: >= 62rem (992px) */
@media (min-width: 62rem) { }

/* Large Desktop: >= 80rem (1280px) */
@media (min-width: 80rem) { }

/* Extra Large: >= 90rem (1440px) */
@media (min-width: 90rem) { }
```

## Ejemplo Completo Real

```css
/* 1. Variables - Mobile */
:root {
    --hg-btn-bg: var(--hg-color-primary);
    --hg-btn-border-radius: 3px;
    --hg-btn-border: solid 1px var(--hg-color-primary);
    --hg-btn-color: var(--hg-color-white);
    --hg-btn-font-family: var(--hg-typo-font-family-primary);
    --hg-btn-font-size: var(--hg-typo-font-size-12);
    --hg-btn-font-weight: var(--hg-typo-font-weight-100);
    --hg-btn-line-height: var(--hg-typo-line-height-1-5);
    --hg-btn-min-height: var(--hg-spacing-32);
    --hg-btn-padding-block: var(--hg-spacing-2);
    --hg-btn-padding-inline: var(--hg-spacing-16);
    --hg-btn-transition: all 0.2s ease;
    --hg-btn-focus-ring: 2px solid var(--hg-color-focus);
    --hg-btn-focus-offset: 2px;

    --hg-btn-bg-hover: var(--hg-color-primary-dark);
    --hg-btn-bg-active: var(--hg-color-primary-dark);

    --hg-btn-bg-secondary: var(--hg-color-secondary);
}

/* 2. Variables - Desktop */
@media (min-width: 62rem) {
  :root {
    --hg-btn-border-radius: 5px;
    --hg-btn-font-size: var(--hg-typo-font-size-14);
    --hg-btn-padding-inline: var(--hg-spacing-16);
  }
}

/* 3. Clase Base */
.hg-btn {
  align-items: center;
  background-color: var(--hg-btn-bg);
  border-radius: var(--hg-btn-border-radius);
  border: var(--hg-btn-border);
  color: var(--hg-btn-color);
  cursor: pointer;
  display: inline-flex;
  font-size: var(--hg-btn-font-size);
  font-weight: var(--hg-btn-font-weight);
  justify-content: center;
  line-height: var(--hg-btn-line-height);
  min-height: var(--hg-btn-min-height);
  padding-block: var(--hg-btn-padding-block);
  padding-inline: var(--hg-btn-padding-inline);
  transition: var(--hg-btn-transition);
}

/* 4. Variantes */
.hg-btn--secondary {
  background-color: var(--hg-btn-bg-secondary);
}

/* 5. Estados */
.hg-btn:hover {
  background-color: var(--hg-btn-bg-hover);
}

.hg-btn:focus {
  outline: var(--hg-btn-focus-ring);
  outline-offset: var(--hg-btn-focus-offset);
}

.hg-btn:active {
  background-color: var(--hg-btn-bg-active);
}

.hg-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* 6. Media Queries - Desktop */
@media (min-width: 62rem) {
  .hg-btn {
    min-width: 180px;
  }
}
```

---

## Para Agentes de IA

**Cuando generes o modifiques CSS en HolyGrail5:**

1. **SIEMPRE** seguir el orden: variables mobile → variables desktop → clases → pseudo-clases → `.is-*` → media queries clases
2. **NUNCA** usar valores hardcodeados, usar variables CSS `var(--hg-*)`
3. **Mobile First**: valores base para mobile, sobrescribir en media queries
4. Agrupar todas las variables en `:root` al inicio
5. Agrupar todos los media queries de clases al final
6. Mantener consistencia con el resto del framework
7. **Estados programáticos**: cualquier estado controlado por JS o atributo dinámico se modela con `.is-*` aplicado sobre la clase del componente (ej: `.hg-tablist__item.is-active`, `.hg-dropdown.is-open`)
8. **Nomenclatura BEM**: bloques con `.hg-[bloque]`, elementos con `__`, modificadores con `--` (ej: `.hg-btn--primary`, `.hg-tablist__item--large`). Nunca usar guión simple para modificadores
