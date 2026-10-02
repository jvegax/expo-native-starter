/** Thin Intl wrappers so date/number options are declared once. Pass the active language from i18n. */

// Creating an Intl formatter is far slower than using one, and list rows format on every render.
// Formatters are immutable, so one per (language, options) is cached for the app's lifetime.
const dateFormatters = new Map<string, Intl.DateTimeFormat>();
const numberFormatters = new Map<string, Intl.NumberFormat>();

function getFormatter<F>(cache: Map<string, F>, language: string, options: object | undefined, create: () => F): F {
  const key = `${language}|${JSON.stringify(options ?? null)}`;
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = create();
    cache.set(key, formatter);
  }
  return formatter;
}

export function formatDate(
  value: string | number | Date,
  language: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const formatter = getFormatter(dateFormatters, language, options, () => new Intl.DateTimeFormat(language, options));
  return formatter.format(new Date(value));
}

export function formatNumber(value: number, language: string, options?: Intl.NumberFormatOptions): string {
  const formatter = getFormatter(numberFormatters, language, options, () => new Intl.NumberFormat(language, options));
  return formatter.format(value);
}
