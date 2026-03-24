/** Saturate marketing assets (Supabase Storage, public bucket). */
const BASE =
  "https://xvzlmcojqvpcukisagrs.supabase.co/storage/v1/object/public/Saturate%20Assets";

export const SATURATE_ASSETS = {
  /** Thin multi-colour line for under headings / cards */
  hueLine: `${BASE}/COLORS%20HUE%20LINE.png`,
  /** Small cross / star mark */
  icon: `${BASE}/ICON%20PNG.png`,
  /** Wordmark for dark backgrounds (#000) */
  textIconOnDark: `${BASE}/TEXT%20ICON%20.png`,
  /** Wordmark for light backgrounds */
  textIconOnLight: `${BASE}/TEXT%20ICON%20DARK.png`,
} as const;
