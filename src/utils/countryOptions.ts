import { countries } from "countries-list";

/**
 * Every country, for the pickers that ask for one.
 *
 * Built once at module load rather than per render — it is 250 entries and it
 * never changes while the app is open.
 *
 * The value stored is the country's English name, not its ISO code: this goes
 * onto a printed registration form, where "Bangladesh" is the answer and "BD"
 * is a lookup somebody would then have to do by hand.
 */
export const COUNTRY_OPTIONS = Object.values(countries)
  .map((c) => ({ value: c.name, label: c.name }))
  .sort((a, b) => a.label.localeCompare(b.label));

/** Case-insensitive contains, so "bangl" finds Bangladesh. */
export const filterCountry = (input: string, option?: { label?: string }) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
