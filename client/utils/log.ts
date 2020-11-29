/**
 * @fileoverview This is an unscientific client-side logger, but
 * it is centralized in order to avoid excessive tslint:disable calls.
 * The "any" is intentional here as it just wraps default console.log.
 */
// tslint:disable-next-line: no-console
export const log = (...args: any[]) => console.log(...args);
