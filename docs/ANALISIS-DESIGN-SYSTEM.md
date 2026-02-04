# Análisis de HolyGrail5 como Design System

## Enfoque del análisis

Este documento revisa **vulnerabilidades** (riesgos, incoherencias y huecos que afectan a la consistencia, mantenibilidad y adopción del sistema) y **mejoras** recomendadas desde la perspectiva de un design system tipo Tailwind/Bootstrap.

---

## 1. Vulnerabilidades

### 1.1 Dos sistemas de breakpoints no unificados

**Qué ocurre:**  
Existen dos fuentes de verdad para breakpoints:

- **`config.breakpoints`**: `mobile` y `desktop` (p. ej. `"1px"` y `"992px"`). Lo usan tipografía, helpers de spacing y layout (`md:...`).
- **`config.grid.breakpoints`**: `xs`, `sm`, `md`, `lg`, `xl` con `minWidth` y `columns`. Lo usa solo el grid.

**Riesgos:**

- Si se cambia `breakpoints.desktop` a 768px pero `grid.breakpoints.md` sigue en 992px, “mobile/desktop” y “md” significan cosas distintas. Los equipos y la documentación pueden interpretar “desktop” y “md” como lo mismo y cometer errores.
- No hay validación que obligue a que, por ejemplo, `breakpoints.desktop` coincida con algún `grid.breakpoints.*.minWidth`.

**Recomendación:** Unificar criterio (p. ej. que el grid use los mismos breakpoints que el resto, o que `breakpoints.desktop` se derive de `grid.breakpoints`) y documentarlo; o al menos validar en `config-loader` que no haya contradicciones obvias.

---

### 1.2 Bug en la guía: grid breakpoints mostrados como `[object Object]`

**Qué ocurre:**  
En la sección Grid de la guía generada (`html-generator.js`), en el texto “Columnas para pantallas desde…”, se usa:

- `configData.grid.breakpoints.xs`
- `configData.grid.breakpoints.sm`
- etc.

Cada uno es un **objeto** `{ minWidth, columns }`, no un string. Al insertarlos en el HTML se muestra `[object Object]` en lugar del min-width.

**Dónde:**  
En la lista “¿Cómo funciona el Grid?” (`.col-xs-*`, `.col-sm-*`, …) y en los párrafos “En **md** (≥…)” y “En **lg** (≥…)”.

**Recomendación:** Usar siempre `configData.grid.breakpoints[name].minWidth` (o un helper que extraiga `minWidth` cuando el valor sea objeto) al generar ese texto.

---

### 1.3 Validación de configuración incompleta

**Qué ocurre:**  
`config-loader.js` solo valida:

- Presencia de `typo` y `breakpoints` (mobile/desktop).
- Estructura de cada clase de `typo` y que tengan al menos un breakpoint.

**No se valida:**

- `colors`: estructura, formato de valores (hex, rgb, etc.), duplicados o claves conflictivas.
- `spacingMap`: que los valores sean cantidades + unidad (px/rem/%) válidas.
- `grid`: que `grid.breakpoints` tenga la forma esperada (`minWidth`, `columns`) y que `mobile < desktop` en `breakpoints`.
- `prefix`, `baseFontSize`, `fontFamilyMap`, `helpers`, `aspectRatios`, etc.

**Riesgos:**  
Errores en `config.json` (typos, tipos incorrectos) solo aparecen en tiempo de generación o en runtime, con mensajes poco guiados. Es fácil introducir configuraciones inválidas o inconsistentes.

**Recomendación:** Añadir validación (o un schema JSON) para las secciones críticas (breakpoints, grid, colors, spacing) y mensajes de error que indiquen clave y archivo.

---

### 1.4 Accesibilidad y tokens fuera del core

**Qué ocurre:**

- El core (generadores de CSS y variables) **no** genera utilidades de focus visible, `prefers-reduced-motion` ni variables de contraste/accesibilidad.
- Estados de focus, ARIA y buenas prácticas se dejan a los **temas** (p. ej. Dutti) y a la documentación (`SUPERPROMPT.md`, “usar `aria-label` cuando necesario”).
- No hay comprobación de contraste (WCAG) sobre los pares de colores definidos en `config.json`.

**Riesgos:**

- Cada tema puede implementar focus/reduced-motion de forma distinta o no implementarlos.
- Es posible definir paletas con ratios de contraste insuficientes sin que el sistema lo señale.

**Recomendación:**  
Incluir en el core al menos: variables o utilidades base para focus visible y, si es posible, un modo “reduced motion”. Opcionalmente, un paso de build o script que compruebe contraste entre colores usados en texto/fondo y que avise (o falle) si no se cumple un nivel WCAG dado.

---

### 1.5 Colores en un único mapa, sin modo claro/oscuro ni opacidad en tokens

**Qué ocurre:**  
`config.colors` es un mapa plano nombre → valor (p. ej. hex). No hay:

- Separación formal entre “tema claro” y “tema oscuro”.
- Tokens de opacidad (p. ej. `primary / 0.8`) definidos en config ni generados como variables.
- Capas de tokens (primitivos → semánticos → uso en componentes) explícitas en el generador.

**Riesgos:**

- Para soportar dark mode hay que duplicar o redefinir colores fuera del schema actual.
- Las variaciones por opacidad se resuelven en cada tema o en CSS manual, sin consistencia ni documentación única.

**Recomendación:**  
Definir en config (o en una extensión del config) al menos:  
- Un conjunto de tokens “primarios” y “semánticos” y, si se quiere dark mode, un bloque `colorsDark` o `themes.light/dark`.  
- Opcionalmente, escalas de opacidad (ej. `primary-90`, `primary-50`) generadas desde un valor base, para no duplicar hex en config.

---

### 1.6 Posible incoherencia mobile/desktop

**Qué ocurre:**  
No se comprueba que `breakpoints.mobile < breakpoints.desktop` (en valor numérico). Si alguien pone `mobile: "992px"` y `desktop: "1px"`, la lógica “base = mobile, md: = desktop” deja de tener sentido.

**Recomendación:**  
En `config-loader`, validar que los valores numéricos de `breakpoints.mobile` y `breakpoints.desktop` cumplan `mobile < desktop` y lanzar un error claro si no se cumple.

---

### 1.7 Nomenclatura y convenciones no escritas

**Qué ocurre:**  
La distinción entre “colores primarios” y “colores semánticos” en la guía depende de listas hardcodeadas en `html-generator.js` (`primaryColorKeys` o `config.colorsPrimaryKeys`). Las convenciones de naming (qué va en `spacingMap`, qué en `typo`, cómo nombrar colores) no están descritas en un único sitio como “contrato” del design system.

**Riesgos:**  
Quien amplíe el config o cree nuevos temas puede introducir nombres que no sigan la convención y romper suposiciones de la guía o de temas.

**Recomendación:**  
Documentar en `README` o en `docs/` una “Guía de tokens y convenciones”: estructura de `config.json`, significado de primarios vs semánticos, reglas de naming y cómo extender colores/spacing/typo sin romper la guía ni los temas.

---

## 2. Mejoras recomendadas

### 2.1 Unificar o alinear breakpoints

- Opción A: Hacer que el grid use solo `config.breakpoints` (p. ej. un único breakpoint “desktop” para columnas) si no se necesita granularidad xs/sm/md/lg/xl.
- Opción B: Mantener `grid.breakpoints` pero definir en config que “desktop” = `grid.breakpoints.md.minWidth` (o uno elegido) y que los helpers `md:` usen ese valor, de forma que una sola fuente defina “desktop”.
- Opción C: Documentar de forma muy visible que existen dos sistemas, cuándo usar cada uno y cómo deben mantenerse alineados.

---

### 2.2 Schema y validación de config

- Introducir un schema JSON (o validación en código) para `config.json` que cubra: `breakpoints`, `grid`, `colors`, `spacingMap`, `typo`, `prefix`, `baseFontSize`.
- Validar tipos, formatos (hex, px, rem) y reglas de negocio (mobile < desktop, claves requeridas).
- Usar esa validación en `config-loader` y, si aplica, en un script de CI.

---

### 2.3 Tokens de accesibilidad en el core

- Añadir variables o utilidades mínimas para:
  - Focus visible (outline/box-shadow) basado en variables del design system.
  - Respeto a `prefers-reduced-motion` en animaciones/transiciones que genere el framework.
- Dejar documentado cómo los temas deben ampliar estos comportamientos (focus por componente, etc.).

---

### 2.4 Estructura de tokens en dos o tres capas

- **Capa 1 – Primitivos:** colores crudos (ej. `grey-500`), espaciados base (4, 8, 16…), tamaños de fuente.
- **Capa 2 – Semánticos:** `primary`, `error`, `spacing-card`, `font-heading`, etc., referenciando primitivos.
- **Capa 3 – Uso en componentes:** documentado en temas (Dutti) y en la guía (“botón primario usa `--hg-color-primary`”).

El generador actual ya avanza en este sentido (variables de color y spacing). Dar nombres explícitos a esas capas en la documentación ayuda a escalar y a que nuevos temas se entiendan mejor.

---

### 2.5 Documentación de decisiones y uso

- **Decisiones:** Por qué dos breakpoints (mobile/desktop), por qué el grid tiene cinco, cómo se elige “primary” en colores. Un “ADRs” o sección “Decisiones de diseño” en `docs/` reduce sorpresas.
- **Uso:** En la guía o en `SUPERPROMPT.md`, resumir “cuándo usar variables CSS vs clases de utilidad”, “cuándo usar el grid vs flex/helpers”, y “cómo mantener accesibilidad (focus, contraste, ARIA)” aunque la implementación concreta esté en temas.

---

### 2.6 Comprobación de contraste (opcional)

- Script o integración que, dado un subconjunto de pares (texto/fondo) definidos en config o en la guía, calcule ratio de contraste y avise o falle si no se cumple WCAG AA (o el nivel que se defina).
- No hace falta que el generador cambie colores; basta con que el build pueda verificar y dar feedback.

---

### 2.7 Versionado y evolución de tokens

- Si los nombres o la forma de las variables cambian, los temas y los productos que consumen `output.css` pueden romperse.
- Recomendación: documentar una política de versionado (p. ej. semver para el paquete) y qué se considera breaking (cambiar nombres de variables, eliminar clases, cambiar estructura de `config.json`). Mantener variables históricas (ya tenéis `.historical-variables.json`) y documentar cómo deprecar nombres viejos de forma controlada.

---

## 3. Resumen

| Área                | Vulnerabilidad principal                          | Mejora prioritaria                                  |
|---------------------|----------------------------------------------------|-----------------------------------------------------|
| Breakpoints         | Dos sistemas sin unificar ni validar               | Unificar criterio o documentar y validar coherencia |
| Guía                | Grid breakpoints como `[object Object]`            | Usar `.minWidth` en textos de la guía               |
| Config              | Validación solo en typo y breakpoints              | Schema/validación para colors, grid, spacing        |
| Accesibilidad       | Focus/reduced-motion fuera del core                | Variables/utilidades base de a11y en el core        |
| Colores             | Un solo mapa, sin dark ni opacidad en tokens       | Modelo claro/oscuro y/o escalas de opacidad         |
| Convenciones        | Naming y capas de tokens implícitos                | Documentar convenciones y capas de tokens           |
| Contraste           | Sin comprobación                                   | Script opcional de verificación WCAG                |

Implementando en primer lugar la **corrección del bug de la guía** (1.2) y la **validación de coherencia de breakpoints** (1.1 + 1.6), el design system gana en claridad y robustez con poco esfuerzo. Las mejoras de schema (2.2), tokens de accesibilidad (2.3) y documentación de convenciones (2.5) son los siguientes pasos más rentables.
