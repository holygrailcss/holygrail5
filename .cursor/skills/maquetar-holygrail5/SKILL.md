---
name: maquetar-holygrail5
description: Guía a la IA para maquetar y extender el design system HolyGrail5 sin prompts detallados. Usar cuando se trabaje en HolyGrail5, temas Dutti, config.json, variables --hg-*, componentes CSS del tema (botones, inputs, checkboxes, radios, forms) o cuando el usuario pida maquetar con HolyGrail5.
---

# Maquetar con HolyGrail5

Instrucciones para que la IA maquete y mantenga HolyGrail5 y el tema Dutti de forma autónoma, usando variables del sistema y componentes existentes.

## Cuándo aplicar esta skill

- El usuario pide maquetar, añadir componentes o modificar estilos en el proyecto.
- Se editan `config.json`, `themes/dutti/*.css`, o se habla de variables `--hg-*`.
- Se pide crear o cambiar botones, inputs, checkboxes, radios, forms, labels.

## Reglas del proyecto (obligatorias)

- **Idioma**: commits, respuestas y comentarios explicativos en **español**.
- **Commits**: formato convencional en español. Incluir afectación.
  - Ejemplo: `feat: agregar variante label-m a botones (afecta a: themes/dutti/_buttons.css, demo)`
  - Tipos: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `perf:`

## Flujo de trabajo

1. **Configuración global** → `config.json` (colores, spacing, tipografía, fontFamilyMap, grid).
2. **Build** → `npm run build` genera `dist/output.css`, `dist/index.html` y temas.
3. **Tema Dutti** → `themes/dutti/`: módulos CSS que usan variables `--hg-*`; opcionalmente `_variables.css` para redefinir tokens del tema.

Orden recomendado al cambiar algo: editar `config.json` o archivos en `themes/dutti/` → ejecutar `npm run build` si cambias config o quieres ver dist actualizado.

## Variables: siempre usar --hg-*

En los CSS del tema **no** uses valores fijos (px, hex, nombres de fuente). Usa variables generadas por HolyGrail5:

| Categoría | Ejemplos |
|-----------|----------|
| Colores | `var(--hg-color-primary)`, `--hg-color-white`, `--hg-color-error` |
| Espaciado | `var(--hg-spacing-8)`, `var(--hg-spacing-16)` |
| Tipografía familia | `var(--hg-typo-font-family-primary)`, `var(--hg-typo-font-family-primary-bold)` |
| Tipografía peso | `var(--hg-typo-font-weight-400)`, `var(--hg-typo-font-weight-700)` |
| Tipografía tamaño | `var(--hg-typo-font-size-13)`, `var(--hg-typo-font-size-14)` |
| Line-height | `var(--hg-typo-line-height-1-5)` |
| Letter-spacing | `var(--hg-typo-letter-spacing-0-02)` |

Añadir colores o espaciados nuevos: definirlos en `config.json` bajo `colors` o `spacingMap` y volver a generar con `npm run build`. Las variables se nombran automáticamente (ej. `"dark-grey": "#737373"` → `--hg-color-dark-grey`).

## Estructura del tema Dutti

- **`themes/dutti/theme.css`** – Punto de entrada; importa `_variables.css` y los módulos de componentes. Si algún `@import` está comentado, descomentarlo para activar ese componente.
- **`themes/dutti/_variables.css`** – Redefinición de tokens del tema (botones, inputs, labels, checkboxes, radios, switches, bordes, transiciones) usando `--hg-*`.
- **Componentes** (cada uno en su archivo): `_buttons.css`, `_inputs.css`, `_labels.css`, `_checkboxes.css`, `_radios.css`, `_switches.css`, `_forms.css`.

Al añadir una variante o componente nuevo: crear o editar el módulo correspondiente en `themes/dutti/`, usar solo variables `--hg-*` (y las de `_variables.css` si existen para ese componente), y actualizar `themes/dutti/demo.html` y `themes/dutti/README.md` para que la documentación y el demo reflejen el cambio.

## Componentes disponibles (clases)

- **Botones**: `.btn` + `.btn-primary` | `.btn-secondary` | `.btn-tertiary` | `.btn-label-m` | `.btn-link` | `.btn-badge` (pill); tamaños `.btn-sm`, `.btn-md`, `.btn-lg`; `.btn-full` para ancho completo. Badge en contexto claro: `.has-light .btn-badge`.
- **Inputs**: `.input`, `.select`, `.textarea`; estados `.input-error`, `.input-success`, `.input-warning`; labels `.label`; ayuda `.helper-text`, `.helper-text-error`, etc.
- **Checkboxes / Radios / Switches**: ver `themes/dutti/README.md` y los archivos `_checkboxes.css`, `_radios.css`, `_switches.css` para clases y estructura HTML.
- **Forms**: form groups y form rows según `_forms.css`.

Para detalles de clases, atributos y ejemplos HTML, consultar [reference.md](reference.md) y `themes/dutti/README.md`.

## Añadir fuentes (font-family)

Las familias se definen en `config.json` → `fontFamilyMap`. Cada clave se expone como `--hg-typo-font-family-{clave}` (ej. `primary` → `--hg-typo-font-family-primary`, `primary-bold` → `--hg-typo-font-family-primary-bold`). Añadir o cambiar una fuente: editar `fontFamilyMap` y ejecutar `npm run build`.

## Build y salidas

- `npm run build` – Genera `dist/output.css`, `dist/index.html`, `dist/themes/dutti.css`, `dist/themes/dutti-demo.html` y assets.
- `npm run watch` – Observa `config.json` y regenera al guardar.
- `npm run serve` – Sirve `dist/` (ej. puerto 3000).
- `npm run dev` – watch + serve.

La guía interactiva de variables y tipografías está en `dist/index.html`; el demo del tema Dutti en `dist/themes/dutti-demo.html`.

## Checklist al maquetar

- [ ] Usar solo variables `--hg-*` (y variables del tema en `_variables.css`) en los CSS del tema.
- [ ] Si añades color o espaciado nuevo, añadirlo en `config.json` y hacer build.
- [ ] Si añades componente o variante, actualizar demo y README del tema.
- [ ] Commits en español con tipo y afectación.

## Referencia adicional

- Listado de variables y clases de componentes: [reference.md](reference.md).
- Estructura CSS y orden de declaraciones: `docs/ESTRUCTURA-CSS.md`.
- Documentación del tema: `themes/dutti/README.md`.
