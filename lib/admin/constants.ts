/** Operators (full admin). */
export const ADMIN_ACCESS_LEVEL = 3;

export const VALID_ACCESS_LEVELS = [1, 2, 3] as const;
export type ValidAccessLevel = (typeof VALID_ACCESS_LEVELS)[number];

export function isValidAccessLevel(n: number): n is ValidAccessLevel {
  return (VALID_ACCESS_LEVELS as readonly number[]).includes(n);
}
