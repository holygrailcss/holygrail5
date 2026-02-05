# Estructura CSS de HolyGrail5

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

### 5. Media Queries para Clases (Desktop)

Finalmente, los media queries para modificar las clases en **desktop**:

```css
@media (min-width: 62rem) {
  .hg-btn.hg-btn-primary {
    min-width: 200px;
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
.hg-component-variant {
  property: different-value;
}

/* 5. Estados y Pseudo-clases */
.hg-component:hover {
  property: hover-value;
}

.hg-component:focus {
  property: focus-value;
}

/* 6. Media Queries para Clases - Desktop */
@media (min-width: 62rem) {
  .hg-component {
    property: desktop-value;
  }

  .hg-component-variant {
    property: desktop-variant-value;
  }
}
```

## Reglas Importantes

### ✅ Hacer:
- **Mobile First**: Valores base para mobile, luego desktop
- **Variables CSS**: Siempre usar `var(--hg-*)`
- **Orden**: `:root` → media queries variables → clases → estados → media queries clases
- **Consistencia**: Mantener el mismo orden en todos los archivos

### ❌ NO Hacer:
- NO usar valores hardcodeados (ej: `padding: 8px`)
- NO mezclar variables y media queries de clases
- NO poner media queries dentro de las declaraciones de clase
- NO usar `!important` (excepto casos excepcionales)

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
.hg-btn-secondary {
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

1. **SIEMPRE** seguir el orden: variables mobile → variables desktop → clases → estados → media queries clases
2. **NUNCA** usar valores hardcodeados, usar variables CSS `var(--hg-*)`
3. **Mobile First**: valores base para mobile, sobrescribir en media queries
4. Agrupar todas las variables en `:root` al inicio
5. Agrupar todos los media queries de clases al final
6. Mantener consistencia con el resto del framework
