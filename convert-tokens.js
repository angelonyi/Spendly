/**
 * Design Tokens to CSS Variables Converter
 * 
 * Source of Truth: design-tokens.tokens.json
 * 
 * COLOR SYSTEM ARCHITECTURE:
 * 1. Primitive Colors (--color-primitive-*):
 *    - Base color ramps (0 - 100), key colors, and neutral scales.
 *    - Internal foundation layer.
 *    - MUST NOT be used directly in UI components.
 * 
 * 2. Color Roles (--color-*):
 *    - Semantic tokens mapped to primitives via var(--color-primitive-*).
 *    - Standard color system practice (primary, on-primary, surface, error, etc.).
 *    - ALWAYS consume these tokens directly in UI components.
 * 
 * 3. Typography & Effects:
 *    - Typography scale variables & utility classes (DM Sans).
 *    - Elevation / box-shadow tokens.
 */

const fs = require('fs');
const path = require('path');

// Default file locations
const DEFAULT_INPUT = path.join(__dirname, 'design-tokens.tokens.json');
const DEFAULT_OUTPUT = path.join(__dirname, 'tokens.css');

/**
 * Normalizes an arbitrary string into kebab-case
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Clean primitive ramp variable name:
 * e.g. palette: "primary", stepKey: "primary40" -> "--color-primitive-primary-40"
 * e.g. palette: "neutral variant", stepKey: "neutralvariant90" -> "--color-primitive-neutral-variant-90"
 */
function toPrimitiveRampVar(palette, stepKey) {
  const normPalette = palette.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  let step = stepKey.toLowerCase();
  if (step.startsWith(normPalette)) {
    step = step.slice(normPalette.length);
  }
  const cleanPalette = palette.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  return `--color-primitive-${cleanPalette}-${step}`;
}

/**
 * Formats hex colors: converts 8-digit #rrggbbaa (alpha ff) to standard 6-digit #rrggbb
 */
function formatHex(hex) {
  if (!hex || typeof hex !== 'string') return hex;
  const clean = hex.trim();
  if (clean.length === 9 && clean.startsWith('#')) {
    const alpha = clean.slice(7, 9).toLowerCase();
    if (alpha === 'ff') {
      return clean.slice(0, 7);
    }
  }
  return clean;
}

/**
 * Extracts RGB channel values ("r, g, b") from hex for rgba() composition
 */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.replace('#', '').trim();
  if (clean.length < 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return `${r}, ${g}, ${b}`;
}

/**
 * Resolves dot-separated reference paths in the JSON token tree
 */
function resolveTokenRef(root, refPath) {
  const parts = refPath.split('.');
  let current = root;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return null;
    current = current[part];
  }
  return current;
}

/**
 * Maps a reference path to its corresponding CSS primitive variable name
 */
function refToPrimitiveVar(refPath) {
  const parts = refPath.split('.');
  // Check if reference points to a color palette ramp:
  // e.g. primitives.color palettes.primary.primary40
  if (parts[0] === 'primitives' && parts[1] === 'color palettes' && parts[2] && parts[3]) {
    return toPrimitiveRampVar(parts[2], parts[3]);
  }

  // Generic fallback path conversion
  const sanitized = parts.map(toKebabCase);
  if (sanitized[0] === 'primitives') sanitized.shift();
  if (sanitized[0] === 'color-palettes') sanitized.shift();
  return `--color-primitive-${sanitized.join('-')}`;
}

/**
 * Main conversion function
 */
function convertTokensToCss(tokenJson) {
  const lines = [];

  lines.push('/**');
  lines.push(' * DESIGN SYSTEM TOKENS - CSS VARIABLES');
  lines.push(' * Generated from: design-tokens.tokens.json');
  lines.push(' * ');
  lines.push(' * COLOR ARCHITECTURE RULES:');
  lines.push(' * 1. PRIMITIVES (--color-primitive-*):');
  lines.push(' *    Base palette ramps and foundation colors.');
  lines.push(' *    DO NOT use directly in UI components.');
  lines.push(' * ');
  lines.push(' * 2. COLOR ROLES (--color-*):');
  lines.push(' *    Semantic design tokens mapped to primitives.');
  lines.push(' *    ALWAYS use these directly in UI components.');
  lines.push(' * ');
  lines.push(' * 3. OPACITY CHANNELS (--color-*-rgb):');
  lines.push(' *    Allows dynamic opacities: rgba(var(--color-primary-rgb), 0.12)');
  lines.push(' */');
  lines.push('');
  lines.push(':root {');

  // =========================================================================
  // 1. PRIMITIVE COLORS (Base System Layer - Internal Foundation)
  // =========================================================================
  lines.push('  /* ==========================================================================');
  lines.push('     1. PRIMITIVE COLORS (Base System Ramps - Internal Only, DO NOT use in UI)');
  lines.push('     ========================================================================== */');

  if (tokenJson.primitives) {
    // 1.1 Key Colors
    if (tokenJson.primitives['key colors']) {
      lines.push('  /* Key Colors */');
      for (const [key, token] of Object.entries(tokenJson.primitives['key colors'])) {
        const varName = `--color-primitive-key-${toKebabCase(key.replace('key color', ''))}`;
        const hex = formatHex(token.value);
        const rgb = hexToRgb(token.value);
        lines.push(`  ${varName}: ${hex};`);
        if (rgb) {
          lines.push(`  ${varName}-rgb: ${rgb};`);
        }
      }
      lines.push('');
    }

    // 1.2 Color Palettes (Ramps 0 - 100)
    if (tokenJson.primitives['color palettes']) {
      for (const [paletteName, ramp] of Object.entries(tokenJson.primitives['color palettes'])) {
        lines.push(`  /* Palette: ${paletteName} */`);
        for (const [stepKey, token] of Object.entries(ramp)) {
          const varName = toPrimitiveRampVar(paletteName, stepKey);
          const hex = formatHex(token.value);
          const rgb = hexToRgb(token.value);
          lines.push(`  ${varName}: ${hex};`);
          if (rgb) {
            lines.push(`  ${varName}-rgb: ${rgb};`);
          }
        }
        lines.push('');
      }
    }

    // 1.3 Extended Neutrals (if present directly in primitives)
    const extendedNeutrals = Object.entries(tokenJson.primitives).filter(([k]) =>
      k.toLowerCase().startsWith('neutralextended')
    );
    if (extendedNeutrals.length > 0) {
      lines.push('  /* Extended Neutral Palette */');
      for (const [extKey, token] of extendedNeutrals) {
        const step = extKey.toLowerCase().replace('neutralextended', '').trim();
        const varName = `--color-primitive-neutral-extended-${step}`;
        const hex = formatHex(token.value);
        const rgb = hexToRgb(token.value);
        lines.push(`  ${varName}: ${hex};`);
        if (rgb) {
          lines.push(`  ${varName}-rgb: ${rgb};`);
        }
      }
      lines.push('');
    }
  }

  // =========================================================================
  // 2. COLOR ROLES (Semantic Layer - UI Level)
  // =========================================================================
  lines.push('  /* ==========================================================================');
  lines.push('     2. COLOR ROLES (Semantic Tokens - ALWAYS USE THESE IN UI COMPONENTS)');
  lines.push('     ========================================================================== */');

  if (tokenJson['color roles']) {
    for (const [roleName, token] of Object.entries(tokenJson['color roles'])) {
      const varName = `--color-${toKebabCase(roleName)}`;
      const val = token.value;

      if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
        // Semantic token referencing a primitive token
        const refPath = val.slice(1, -1);
        const primitiveVar = refToPrimitiveVar(refPath);
        lines.push(`  ${varName}: var(${primitiveVar});`);
        lines.push(`  ${varName}-rgb: var(${primitiveVar}-rgb);`);
      } else {
        // Direct literal color token
        const hex = formatHex(val);
        const rgb = hexToRgb(val);
        lines.push(`  ${varName}: ${hex};`);
        if (rgb) {
          lines.push(`  ${varName}-rgb: ${rgb};`);
        }
      }
    }
    lines.push('');
  }

  // =========================================================================
  // 3. ELEVATION & SHADOW EFFECTS
  // =========================================================================
  if (tokenJson.effect) {
    lines.push('  /* ==========================================================================');
    lines.push('     3. ELEVATION & SHADOW EFFECTS');
    lines.push('     ========================================================================== */');
    for (const [effectName, token] of Object.entries(tokenJson.effect)) {
      if (token.type === 'custom-shadow' && token.value) {
        const shadow = token.value;
        const varName = `--effect-shadow-${toKebabCase(effectName.replace('shadow', ''))}`;
        const hex = formatHex(shadow.color);
        lines.push(`  ${varName}: ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.radius}px ${shadow.spread}px ${hex};`);
      }
    }
    lines.push('');
  }

  // =========================================================================
  // 4. TYPOGRAPHY SCALES
  // =========================================================================
  const typographyUtilityClasses = [];

  if (tokenJson.typography) {
    lines.push('  /* ==========================================================================');
    lines.push('     4. TYPOGRAPHY TOKENS');
    lines.push('     ========================================================================== */');
    
    // Default font family
    const sampleType = Object.values(tokenJson.typography)[0];
    const defaultFamily = sampleType && sampleType.fontFamily
      ? `'${sampleType.fontFamily.value}', system-ui, -apple-system, sans-serif`
      : 'system-ui, sans-serif';
    lines.push(`  --font-family-base: ${defaultFamily};`);
    lines.push('');

    for (const [styleName, tokenGroup] of Object.entries(tokenJson.typography)) {
      const slug = toKebabCase(styleName);
      lines.push(`  /* Typography: ${styleName} */`);

      const fontSize = tokenGroup.fontSize ? `${tokenGroup.fontSize.value}px` : null;
      const lineHeight = tokenGroup.lineHeight ? `${tokenGroup.lineHeight.value}px` : null;
      const fontWeight = tokenGroup.fontWeight ? tokenGroup.fontWeight.value : null;
      const letterSpacing = tokenGroup.letterSpacing ? `${tokenGroup.letterSpacing.value}px` : null;

      if (fontSize) lines.push(`  --type-${slug}-font-size: ${fontSize};`);
      if (lineHeight) lines.push(`  --type-${slug}-line-height: ${lineHeight};`);
      if (fontWeight) lines.push(`  --type-${slug}-font-weight: ${fontWeight};`);
      if (letterSpacing) lines.push(`  --type-${slug}-letter-spacing: ${letterSpacing};`);

      typographyUtilityClasses.push({
        className: `.type-${slug}`,
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing
      });
      lines.push('');
    }
  }

  lines.push('}');
  lines.push('');

  // =========================================================================
  // 5. TYPOGRAPHY UTILITY CLASSES
  // =========================================================================
  if (typographyUtilityClasses.length > 0) {
    lines.push('/* ==========================================================================');
    lines.push('   5. TYPOGRAPHY UTILITY CLASSES');
    lines.push('   ========================================================================== */');
    for (const item of typographyUtilityClasses) {
      lines.push(`${item.className} {`);
      lines.push('  font-family: var(--font-family-base);');
      if (item.fontSize) lines.push(`  font-size: ${item.fontSize};`);
      if (item.lineHeight) lines.push(`  line-height: ${item.lineHeight};`);
      if (item.fontWeight) lines.push(`  font-weight: ${item.fontWeight};`);
      if (item.letterSpacing) lines.push(`  letter-spacing: ${item.letterSpacing};`);
      lines.push('}');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * CLI Execution Handler
 */
function run() {
  const args = process.argv.slice(2);
  const inputFile = args[0] || DEFAULT_INPUT;
  const outputFile = args[1] || DEFAULT_OUTPUT;

  console.log('--------------------------------------------------');
  console.log('Design Tokens Converter: Single Source of Truth');
  console.log('--------------------------------------------------');
  console.log(`Input JSON  : ${inputFile}`);
  console.log(`Output CSS  : ${outputFile}`);

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputFile, 'utf8');
  let tokenJson;
  try {
    tokenJson = JSON.parse(raw);
  } catch (err) {
    console.error(`Error parsing JSON in ${inputFile}:`, err.message);
    process.exit(1);
  }

  const css = convertTokensToCss(tokenJson);
  fs.writeFileSync(outputFile, css, 'utf8');

  console.log('Conversion successful!');
  console.log(`CSS variables written to: ${outputFile}`);
  console.log('--------------------------------------------------');
}

if (require.main === module) {
  run();
}

module.exports = {
  convertTokensToCss,
  toKebabCase,
  toPrimitiveRampVar,
  formatHex,
  hexToRgb,
  resolveTokenRef,
  refToPrimitiveVar
};
