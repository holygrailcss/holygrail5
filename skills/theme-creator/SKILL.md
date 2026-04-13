# HolyGrail 5 — Theme Creator

Crea temas personalizados para HolyGrail 5 basados en la estructura del tema Dutti.

## Contexto

HolyGrail 5 soporta temas modulares en la carpeta `themes/`. Cada tema extiende las variables base del design system con variables propias para componentes (botones, inputs, formularios, etc.). El `ThemeTransformer` combina los CSS parciales y genera una demo interactiva.

## Instrucciones

Cuando el usuario pida crear un tema:

1. **Lee el tema Dutti** como referencia: `themes/dutti/` contiene la estructura ITCSS correcta.

2. **Crea la carpeta del tema** en `themes/{nombre}/` con esta estructura:
   ```
   themes/{nombre}/
   ├── theme.css          # Archivo principal con @import de módulos
   ├── _variables.css     # Variables del tema (extienden --hg-*)
   ├── _buttons.css       # Componente botones
   ├── _inputs.css        # Componente inputs
   ├── _checkboxes.css    # Componente checkboxes
   ├── _radios.css        # Componente radios
   ├── _switches.css      # Componente switches
   ├── _forms.css         # Formularios
   ├── _labels.css        # Labels
   └── demo.html          # Demo interactiva
   ```

3. **En `_variables.css`**, define variables del tema usando las de HG5 como base:
   ```css
   :root {
     /* Botones */
     --btn-primary-bg: var(--hg-color-primary);
     --btn-primary-color: var(--hg-color-white);
     --btn-primary-border: var(--hg-color-primary);
     
     /* Inputs */
     --input-border-color: var(--hg-color-middle-grey);
     --input-focus-border: var(--hg-color-primary);
     
     /* Spacing */
     --btn-padding-y: var(--hg-spacing-8);
     --btn-padding-x: var(--hg-spacing-16);
   }
   ```

4. **En `theme.css`**, importa los módulos en orden ITCSS:
   ```css
   /* Settings */
   @import '_variables.css';
   /* Components */
   @import '_buttons.css';
   @import '_inputs.css';
   /* etc. */
   ```

5. **En `demo.html`**, crea una demo con secciones para cada componente. Usa IDs para la navegación (`id="buttons"`, `id="inputs"`, etc.).

6. **Activa el tema** en `config.json`:
   ```json
   { "theme": { "name": "{nombre}", "enabled": true } }
   ```

## Validación

- Ejecuta `npm run build` y verifica que se genera `dist/themes/{nombre}.css` y `dist/themes/{nombre}-demo.html`
- Comprueba que la demo muestra todos los componentes correctamente
- Verifica que las variables del tema referencian variables HG5 existentes
