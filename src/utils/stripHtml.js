/**
 * Strips HTML tags from a string, returning plain text.
 */
export function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}
