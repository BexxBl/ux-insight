/**
 * CSS custom property names for all UX Insight design tokens.
 * Use these constants instead of raw strings when referencing tokens in TypeScript
 * (e.g. for dynamic inline styles or programmatic theme switching).
 *
 * Actual values live in styles.scss — this file only names the tokens.
 */

export const ColorTokens = {
  // Backgrounds
  bg: '--color-bg',
  surface: '--color-surface',
  surfaceRaised: '--color-surface-raised',
  surfaceSubtle: '--color-surface-subtle',

  // Text
  text: '--color-text',
  textMuted: '--color-text-muted',
  textSubtle: '--color-text-subtle',
  textInverse: '--color-text-inverse',

  // Borders
  border: '--color-border',
  borderSubtle: '--color-border-subtle',

  // Brand / Interactive
  primary: '--color-primary',
  primaryHover: '--color-primary-hover',
  primarySubtle: '--color-primary-subtle',
  accent: '--color-accent',

  // Feedback
  success: '--color-success',
  successSubtle: '--color-success-subtle',
  warning: '--color-warning',
  warningSubtle: '--color-warning-subtle',
  danger: '--color-danger',
  dangerSubtle: '--color-danger-subtle',
  info: '--color-info',
  infoSubtle: '--color-info-subtle',
} as const;

export const SeverityTokens = {
  critical: '--color-severity-critical',
  criticalSubtle: '--color-severity-critical-subtle',
  high: '--color-severity-high',
  highSubtle: '--color-severity-high-subtle',
  medium: '--color-severity-medium',
  mediumSubtle: '--color-severity-medium-subtle',
  low: '--color-severity-low',
  lowSubtle: '--color-severity-low-subtle',
} as const;

export const SpaceTokens = {
  1: '--space-1',
  2: '--space-2',
  3: '--space-3',
  4: '--space-4',
  5: '--space-5',
  6: '--space-6',
  8: '--space-8',
  10: '--space-10',
  12: '--space-12',
  16: '--space-16',
} as const;

export const RadiusTokens = {
  sm: '--radius-sm',
  md: '--radius-md',
  lg: '--radius-lg',
  xl: '--radius-xl',
  full: '--radius-full',
} as const;

export const ShadowTokens = {
  sm: '--shadow-sm',
  md: '--shadow-md',
  lg: '--shadow-lg',
} as const;

export const TypographyTokens = {
  fontSans: '--font-sans',
  fontMono: '--font-mono',
  textXs: '--text-xs',
  textSm: '--text-sm',
  textBase: '--text-base',
  textLg: '--text-lg',
  textXl: '--text-xl',
  text2xl: '--text-2xl',
  text3xl: '--text-3xl',
  fontRegular: '--font-regular',
  fontMedium: '--font-medium',
  fontSemibold: '--font-semibold',
  fontBold: '--font-bold',
  leadingTight: '--leading-tight',
  leadingNormal: '--leading-normal',
  leadingRelaxed: '--leading-relaxed',
} as const;

export const TransitionTokens = {
  fast: '--transition-fast',
  normal: '--transition-normal',
} as const;

/** Severity levels used in UX audit reports, matching the JSON schema values. */
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

/** Returns the foreground token name for a given severity level. */
export function severityColorToken(level: SeverityLevel): string {
  return SeverityTokens[level];
}

/** Returns the subtle background token name for a given severity level. */
export function severitySubtleToken(level: SeverityLevel): string {
  return SeverityTokens[`${level}Subtle`];
}
