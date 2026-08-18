/**
 * White-label favicon injection.
 *
 * Replaces every bundled favicon / apple-touch-icon <link> in the served
 * index.html with a single configured URL. Used by both SPA-serving entry
 * points (index.js and experimental.js) so the behavior stays in one place.
 *
 * @param {string} indexHTML - the raw index.html content
 * @param {string} faviconUrl - the configured APP_FAVICON_URL
 * @returns {string} indexHTML with favicon links replaced
 */
function injectFavicon(indexHTML, faviconUrl) {
  if (!faviconUrl) {
    return indexHTML;
  }
  // Collapse the whole run of consecutive favicon / apple-touch-icon links
  // (with their leading whitespace) into a single configured link.
  return indexHTML.replace(
    /(?:\s*<link rel="(?:icon|apple-touch-icon)"[^>]*>)+/g,
    `\n    <link rel="icon" type="image/x-icon" href="${faviconUrl}" />`,
  );
}

module.exports = { injectFavicon };
