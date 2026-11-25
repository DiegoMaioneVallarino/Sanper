/*
 * Sectores editoriales de Sanper.
 * Fuente única: frontend y servidor importan desde aquí.
 */
export const SECTORS = [
  "geopolitics",
  "economy",
  "markets",
  "technology",
  "energy",
  "science",
  "business",
] as const;

export type Sector = (typeof SECTORS)[number];

export function isSector(value: string): value is Sector {
  return (SECTORS as readonly string[]).includes(value);
}
