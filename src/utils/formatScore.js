/**
 * Converts a decimal score (0–1) to a display string.
 * e.g. 0.85 → "85%"
 */
export function formatScore(score) {
  if (score == null) return "N/A";
  return `${Math.round(score * 100)}%`;
}

/**
 * Returns a Tailwind text-color class based on score value.
 */
export function scoreColor(score) {
  if (score >= 0.8) return "text-green-600";
  if (score >= 0.5) return "text-yellow-600";
  return "text-red-600";
}
