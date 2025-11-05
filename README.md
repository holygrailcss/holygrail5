# HolyGrail5

Framework CSS generator con Node.js que genera CSS optimizado con variables CSS desde un archivo JSON de configuración.

## ✨ Características

- 🎨 **Genera CSS optimizado** con variables CSS compartidas (mínimas y eficientes)
- 📱 **Soporte responsive** para breakpoints personalizables (mobile/desktop)
- 🔧 **Configuración simple** mediante JSON
- 📊 **Guía HTML interactiva** generada automáticamente con tablas visuales de todas las clases
- 🎯 **Variables compartidas** basadas en valores únicos, optimizando el CSS generado
- 🔄 **Conversión automática** de px a rem con configuración de `baseFontSize`
- ✅ **Validación robusta** de configuración con mensajes de error claros
- 🛠️ **CLI flexible** con argumentos opcionales para personalizar rutas
- 📐 **Reset CSS mínimo** incluido para asegurar consistencia

## 📋 Requisitos

- **Node.js** >= 12.0.0
- **npm** o **yarn** para instalación

## 📦 Instalación

### Instalación global

```bash
npm install -g holygrail5
```

### Instalación local

```bash
npm install holygrail5
```

## 🚀 Uso

### Como script de línea de comandos

```bash
# Uso básico (usa config.json por defecto)
npx holygrail5

# O después de instalar globalmente
holygrail5

# O con npm scripts
npm run generate
```

### Argumentos opcionales

El generador acepta argumentos opcionales para personalizar las rutas:

```bash
# Especificar archivo de configuración personalizado
npx holygrail5 --config=./mi-config.json

# Especificar ruta de salida para CSS
npx holygrail5 --output=./dist/styles.css

# Especificar ruta de salida para HTML
npx holygrail5 --html=./docs/index.html

# Combinar múltiples argumentos
npx holygrail5 --config=./config.json --output=./css/output.css --html=./docs/index.html
```

### Como módulo Node.js

```javascript
const { generateCSS, generateHTML } = require('holygrail5');
const fs = require('fs');

// Generar CSS
const css = generateCSS();
fs.writeFileSync('output.css', css, 'utf8');

// Generar HTML
const html = generateHTML();
fs.writeFileSync('index.html', html, 'utf8');

// También puedes pasar un objeto de configuración personalizado
const customConfig = {
  prefix: 'my',
  category: 'typography',
  baseFontSize: 16,
  fontFamilyMap: {
    primary: 'Arial, sans-serif'
  },
  breakpoints: {
    mobile: '1px',
    desktop: '768px'
  },
  classes: {
    // ... tus clases
  }
};

const css = generateCSS(customConfig);
const html = generateHTML(customConfig);
```

### Servidor de desarrollo

```bash
npm run start
# o
npm run dev
```

Esto generará el CSS y HTML, y luego abrirá automáticamente un servidor HTTP en `http://localhost:3000` mostrando la guía HTML interactiva.

## ⚙️ Configuración

El proyecto usa un archivo `config.json` para definir las clases CSS y sus propiedades. El archivo debe estar en el directorio raíz del proyecto o puedes especificar una ruta personalizada con `--config=`.

### Estructura completa del JSON

```json
{
  "prefix": "hg",
  "category": "typo",
  "baseFontSize": 16,
  "fontFamilyMap": {
    "primary": "arial, sans-serif",
    "secondary": "\"ms-serif\", serif"
  },
  "breakpoints": {
    "mobile": "1px",
    "desktop": "992px"
  },
  "classes": {
    "h2": {
      "fontFamily": "arial, sans-serif",
      "fontWeight": "900",
      "letterSpacing": "0rem",
      "textTransform": "none",
      "mobile": {
        "fontSize": "18px",
        "lineHeight": "1.2"
      },
      "desktop": {
        "fontSize": "24px",
        "lineHeight": "1.2"
      }
    },
    "title-l-b": {
      "fontFamily": "arial, sans-serif",
      "fontWeight": "700",
      "letterSpacing": "0rem",
      "textTransform": "uppercase",
      "mobile": {
        "fontSize": "14px",
        "lineHeight": "1.4"
      },
      "desktop": {
        "fontSize": "14px",
        "lineHeight": "1.4"
      }
    }
  }
}
```

### Propiedades globales

| Propiedad | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `prefix` | string | No | `"hg"` | Prefijo para las variables CSS (ej: `--hg-typo-...`) |
| `category` | string | No | `"typo"` | Categoría para las variables CSS (ej: `--hg-typo-...`) |
| `baseFontSize` | number | No | `16` | Tamaño base en píxeles para conversión px a rem |
| `fontFamilyMap` | object | No | - | Mapeo de nombres descriptivos a valores CSS de fuentes |
| `breakpoints` | object | **Sí** | - | Objeto con breakpoints para mobile y desktop |
| `classes` | object | **Sí** | - | Objeto con las clases CSS a generar |

### Estructura de clases

Cada clase en el objeto `classes` puede tener:

#### Propiedades base (aplicadas a todos los breakpoints)

- **`fontFamily`**: Familia de fuente. Si está definido `fontFamilyMap`, puedes usar el nombre del mapa (ej: `"primary"`) o el valor CSS completo.
- **`fontWeight`**: Peso de la fuente. Valores comunes: `"100"`, `"300"`, `"400"`, `"700"`, `"900"`.
- **`letterSpacing`**: Espaciado entre letras. Formato: `"0rem"`, `"0.05rem"`, etc.
- **`textTransform`**: Transformación del texto. Valores: `"none"`, `"uppercase"`, `"lowercase"`, `"capitalize"`.

#### Propiedades responsive (por breakpoint)

Cada clase debe tener al menos un objeto `mobile` o `desktop`:

- **`mobile`**: Propiedades específicas para mobile
  - `fontSize`: Tamaño de fuente en píxeles (ej: `"18px"`) - se convierte automáticamente a rem
  - `lineHeight`: Altura de línea (ej: `"1.2"`, `"1.5"`)
  
- **`desktop`**: Propiedades específicas para desktop
  - `fontSize`: Tamaño de fuente en píxeles (ej: `"24px"`) - se convierte automáticamente a rem
  - `lineHeight`: Altura de línea (ej: `"1.2"`, `"1.5"`)

### Ejemplo de clase completa

```json
{
  "h2": {
    "fontFamily": "arial, sans-serif",
    "fontWeight": "900",
    "letterSpacing": "0rem",
    "textTransform": "none",
    "mobile": {
      "fontSize": "18px",
      "lineHeight": "1.2"
    },
    "desktop": {
      "fontSize": "24px",
      "lineHeight": "1.2"
    }
  }
}
```

## 📄 Salida

El generador crea dos archivos:

### 1. `output.css`

Archivo CSS completo con:

- **Reset CSS mínimo** al inicio (box-sizing, html, body)
- **Variables CSS compartidas** en `:root` (basadas en valores únicos para optimización)
- **Media queries** para cada breakpoint definido
- **Clases CSS** que usan las variables compartidas

### 2. `index.html`

Guía HTML interactiva y visual con:

- **Tabla de Font Families**: Muestra todas las fuentes definidas con preview, valor y variable CSS
- **Tabla de Clases de Tipografía**: Tabla completa con todas las clases y sus propiedades:
  - Preview visual con "Aa"
  - Propiedades base (font-family, font-weight, letter-spacing, text-transform)
  - Propiedades mobile (font-size, line-height)
  - Propiedades desktop (font-size, line-height)
- **Tabla de Variables CSS Compartidas**: Muestra todas las variables con:
  - Nombre de la variable
  - Valor original
  - Valor en rem (si aplica)
  - Equivalente en píxeles (si aplica)
- **Tabla de Breakpoints**: Información de los breakpoints configurados

## 📋 Ejemplo de CSS generado

```css
/* Reset CSS Mínimo */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
}

body {
  margin: 0;
  padding: 0;
  font-family: inherit;
  line-height: inherit;
}

:root {
  --hg-typo-font-family-primary: arial, sans-serif;
  --hg-typo-font-family-secondary: "ms-serif", serif;
  --hg-typo-font-weight-900: 900;
  --hg-typo-font-weight-700: 700;
  --hg-typo-font-weight-400: 400;
  --hg-typo-font-weight-100: 100;
  --hg-typo-font-size-18: 1.125rem;
  --hg-typo-font-size-24: 1.5rem;
  --hg-typo-line-height-1-2: 1.2;
  --hg-typo-line-height-1-4: 1.4;
  --hg-typo-letter-spacing-0: 0rem;
  --hg-typo-text-transform-none: none;
  --hg-typo-text-transform-uppercase: uppercase;
}

@media (min-width: 1px) {
  .h2 {
    font-family: var(--hg-typo-font-family-primary);
    font-weight: var(--hg-typo-font-weight-900);
    font-size: var(--hg-typo-font-size-18);
    line-height: var(--hg-typo-line-height-1-2);
    letter-spacing: var(--hg-typo-letter-spacing-0);
    text-transform: var(--hg-typo-text-transform-none);
  }
}

@media (min-width: 992px) {
  .h2 {
    font-family: var(--hg-typo-font-family-primary);
    font-weight: var(--hg-typo-font-weight-900);
    font-size: var(--hg-typo-font-size-24);
    line-height: var(--hg-typo-line-height-1-2);
    letter-spacing: var(--hg-typo-letter-spacing-0);
    text-transform: var(--hg-typo-text-transform-none);
  }
}
```

## 🎯 Características técnicas

### Variables CSS compartidas

Las variables se generan basándose en **valores únicos**, no en nombres de clases. Esto significa que:

- Si dos clases usan el mismo `fontWeight: "900"`, se crea una sola variable `--hg-typo-font-weight-900`
- Si múltiples clases usan `fontSize: "18px"`, se crea una sola variable `--hg-typo-font-size-18`
- Esto optimiza el CSS generado eliminando duplicados

### Conversión px a rem

- Los valores de `fontSize` en el JSON deben estar en píxeles (ej: `"18px"`)
- Se convierten automáticamente a rem usando `baseFontSize` (default: 16px)
- El nombre de la variable mantiene el valor original en píxeles (ej: `--hg-typo-font-size-18` = `1.125rem`)
- Esto permite fácil referencia y mantenimiento

### Validación

El generador valida:

- ✅ Existencia del archivo de configuración
- ✅ Sintaxis JSON válida
- ✅ Estructura básica (classes, breakpoints)
- ✅ Breakpoints requeridos (mobile, desktop)
- ✅ Cada clase tiene al menos un breakpoint
- ✅ Advertencias para clases sin propiedades en breakpoints

### Manejo de errores

- Mensajes de error claros y descriptivos
- Validación antes de generar archivos
- Creación automática de directorios si no existen
- Manejo graceful de errores de escritura

## 🔧 Scripts NPM

| Script | Descripción |
|--------|-------------|
| `npm run generate` | Genera CSS y HTML desde `config.json` |
| `npm run start` | Genera CSS/HTML y abre servidor HTTP en `http://localhost:3000` |
| `npm run dev` | Alias de `start` |
| `npm run prepublishOnly` | Se ejecuta automáticamente antes de publicar (genera CSS/HTML) |

## 📝 Notas importantes

### Formato de valores

- **`fontSize`**: Debe estar en píxeles (ej: `"18px"`). Se convierte automáticamente a rem.
- **`lineHeight`**: Se usa directamente sin unidades (ej: `"1.2"`, `"1.5"`).
- **`letterSpacing`**: Debe incluir unidades (ej: `"0rem"`, `"0.05rem"`).
- **`fontWeight`**: Se usa directamente (ej: `"100"`, `"400"`, `"700"`, `"900"`).

### Nombres de variables CSS

Las variables siguen el patrón:
```
--{prefix}-{category}-{propiedad}-{valor}
```

Ejemplos:
- `--hg-typo-font-family-primary`
- `--hg-typo-font-size-18`
- `--hg-typo-line-height-1-2`
- `--hg-typo-font-weight-900`

### fontFamilyMap

El `fontFamilyMap` permite usar nombres descriptivos en lugar de valores CSS completos:

```json
{
  "fontFamilyMap": {
    "primary": "arial, sans-serif",
    "secondary": "\"ms-serif\", serif"
  },
  "classes": {
    "h2": {
      "fontFamily": "primary"  // Se resuelve a "arial, sans-serif"
    }
  }
}
```

## 🐛 Solución de problemas

### Error: "Archivo de configuración no encontrado"

**Solución**: Asegúrate de que `config.json` existe en el directorio del proyecto, o especifica la ruta con:
```bash
npx holygrail5 --config=./ruta/config.json
```

### Error: "La configuración debe tener un objeto 'classes'"

**Solución**: Verifica que tu `config.json` tenga la propiedad `classes` con al menos una clase definida:
```json
{
  "classes": {
    "mi-clase": { ... }
  }
}
```

### Error: "La clase debe tener al menos un breakpoint"

**Solución**: Cada clase debe tener al menos una propiedad `mobile` o `desktop`:
```json
{
  "mi-clase": {
    "mobile": {
      "fontSize": "16px",
      "lineHeight": "1.5"
    }
  }
}
```

### Error: "Error al parsear JSON"

**Solución**: Verifica que tu `config.json` tenga sintaxis JSON válida. Puedes validarlo con un validador JSON online.

### Advertencia: "La clase tiene breakpoint sin fontSize ni lineHeight"

**Solución**: Es solo una advertencia. El breakpoint existe pero no tiene propiedades. Puedes ignorarla o agregar propiedades al breakpoint.

## 🌐 GitHub Pages

Puedes desplegar automáticamente la guía HTML a GitHub Pages usando el workflow incluido.

### Configuración automática

1. **Habilita GitHub Pages** en tu repositorio:
   - Ve a Settings → Pages
   - Source: selecciona "GitHub Actions"

2. **El workflow se ejecutará automáticamente** cuando hagas push a `main` o `master`

3. **Genera manualmente** si prefieres:
   ```bash
   node generator.js --output=./docs/output.css --html=./docs/index.html
   ```
   Luego configura GitHub Pages para usar la carpeta `docs/`

### Usar carpeta docs localmente

Si quieres generar los archivos en la carpeta `docs/` para GitHub Pages:

```bash
# Crear carpeta docs si no existe
mkdir -p docs

# Generar archivos en docs/
node generator.js --output=./docs/output.css --html=./docs/index.html
```

El workflow de GitHub Actions (`.github/workflows/deploy.yml`) hará esto automáticamente en cada push.

## 📚 Recursos adicionales

- **Repositorio**: [GitHub](https://github.com/holygrailcss/holygrail5.git)
- **Licencia**: MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Abre un issue para discutir cambios grandes
2. Fork el repositorio
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

---

**Hecho con ❤️ por HolyGrail CSS**
