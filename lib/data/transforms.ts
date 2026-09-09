/**
 * Date helpers and column normalisation utilities
 */

/**
 * Convert a value to a Date object
 */
export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

/**
 * Normalise quantity value (handle negatives for returns)
 */
export function normaliseQty(value: unknown): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Normalise discount percentage (stored as decimal)
 */
export function normaliseDiscount(value: unknown): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Normalise monetary value
 */
export function normaliseValue(value: unknown): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Normalise string value
 */
export function normaliseString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Normalise optional string value (can be null)
 */
export function normaliseOptionalString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return String(value).trim();
}
