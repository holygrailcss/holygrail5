# Guía: Usar HolyGrail5 en Otro Proyecto

## Instalación

```bash
npm install holygrail5 --save-dev
```

## Uso Básico

### 1. Crear `config.json`

Crea un archivo `config.json` en tu proyecto. Puedes copiar el del repositorio y personalizarlo:

```json
{
  "prefix": "hg",
  "colors": {
    "primary": "#000000",
    "secondary": "#737373"
  },
  "spacingMap": {
    "0": "0",
    "8": "8px",
    "16": "16px",
    "24": "24px"
  }
}
```

### 2. Generar CSS

**Opción A: Comando directo**
```bash
npx holygrail5 --config=./config.json --output=./css/holygrail.css
```

**Opción B: Añadir script en `package.json`** (recomendado)

Añade esto a tu `package.json`:

```json
{
  "scripts": {
    "css:generate": "holygrail5 --config=./config.json --output=./css/holygrail.css"
  }
}
```

Luego ejecuta:
```bash
npm run css:generate
```

### 3. Usar en HTML

```html
<link rel="stylesheet" href="./css/holygrail.css">
```

## Scripts NPM Recomendados

Añade estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "css:generate": "holygrail5 --config=./config.json --output=./css/holygrail.css",
    "css:watch": "node node_modules/holygrail5/src/watch.js --config=./config.json --output=./css/holygrail.css"
  }
}
```

**Uso:**
- `npm run css:generate` - Genera CSS una vez
- `npm run css:watch` - Regenera automáticamente al cambiar `config.json` (presiona Ctrl+C para detener)

## Personalización

Edita `config.json` para cambiar:
- **Colores**: `colors`
- **Spacing**: `spacingMap`
- **Breakpoints**: `breakpoints`
- **Tipografía**: `classes`
- **Helpers**: `helpers`

Regenera el CSS después de cada cambio.

---

**Más información**: Ver `README.md` y `SUPERPROMPT.md`
