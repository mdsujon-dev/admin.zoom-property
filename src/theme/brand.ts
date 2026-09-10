/**
 * The brand palette, for the places Tailwind cannot reach.
 *
 * Most of the panel should use the utility classes — `bg-primary`,
 * `text-primary-600`, `border-secondary-200`. They come from the same numbers
 * as this file (`tailwind.config.js`), so a component styled with classes and
 * a chart styled from here cannot drift apart.
 *
 * This exists for the three places that take a colour as a *value* rather than
 * a class: the antd theme token, Recharts series, and the ID-card templates
 * that render to canvas. Typing a hex into any of those is how a panel ends up
 * with four slightly different greens.
 *
 * Straight from the Basic Brand Guideline:
 *   #4B802D  primary, deep    - anything carrying white text (4.75:1)
 *   #67AE3E  primary, mid     - fills and rules; fails AA for text (2.73:1)
 *   #99FF99  primary, light   - highlights on dark grounds only
 *   #495045  secondary        - body text and dark surfaces (8.34:1)
 */

/** The green ramp. `600`–`950` are the steps that may carry white text. */
export const primary = {
  50: "#f6faf3",
  100: "#ebf4e6",
  200: "#d7eacd",
  300: "#bbdba8",
  400: "#95c678",
  500: "#67ae3e",
  600: "#589535",
  700: "#4f8730",
  800: "#4b802d",
  900: "#3e6925",
  950: "#32541e",
} as const;

/** The charcoal ramp, from the guideline's secondary. */
export const secondary = {
  50: "#f6f6f6",
  100: "#e9eae9",
  200: "#d2d3d0",
  300: "#b3b6b1",
  400: "#8e928c",
  500: "#6d736a",
  600: "#5f655b",
  700: "#4d5449",
  800: "#495045",
  900: "#333830",
} as const;

export const brand = {
  /** Buttons, active states, the one green that carries white text. */
  primary: primary[800],
  /** Fills, rules, hover washes. Never a label. */
  primaryMid: primary[500],
  /** Highlights on dark grounds. */
  primaryLight: "#99ff99",
  /** Body text and dark surfaces. */
  secondary: secondary[800],
  /**
   * Not a brand colour. An error has to read as an error, and a green one does
   * not — so this stays red whatever the palette does.
   */
  danger: "#c00918",
  white: "#ffffff",
} as const;

/**
 * Chart series, in the order a chart should reach for them.
 *
 * One hue at descending lightness rather than a rainbow: a breakdown chart is
 * showing quantities of the same thing, and five unrelated hues make it look
 * like five unrelated categories. The two darkest lead, so a two-series chart
 * gets the strongest contrast.
 */
export const CHART_SERIES = [
  primary[800],
  primary[500],
  secondary[800],
  primary[300],
  secondary[500],
  primary[950],
  secondary[300],
] as const;

export default brand;
