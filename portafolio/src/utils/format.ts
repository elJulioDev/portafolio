/**
 * Always `en-US`, never the runtime locale: a client component would pick up
 * the visitor's locale while a server component picks up the host's, so the
 * same figure could render as `1,234` in one place and `1.234` in another on
 * the same page.
 *
 * Module-level because constructing an `Intl` formatter is the expensive part,
 * not formatting with it.
 */
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
})

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value)
}

export function formatCompactNumber(value: number): string {
  return COMPACT_NUMBER_FORMATTER.format(value)
}