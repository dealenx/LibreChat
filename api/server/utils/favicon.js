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
  // (with their leading whitespace) into a single configured link. No `type`
  // attribute: Firefox trusts it over the served Content-Type and refuses to
  // decode a PNG declared as x-icon, so let the browser sniff the image.
  return indexHTML.replace(
    /(?:\s*<link rel="(?:icon|apple-touch-icon)"[^>]*>)+/g,
    `\n    <link rel="icon" href="${faviconUrl}" />`,
  );
}

/**
 * White-label title injection.
 *
 * Replaces the bundled <title> in the served index.html with the configured
 * APP_TITLE so the first paint never flashes "LibreChat" before the client
 * hydrates and reads /api/config.
 */
function injectTitle(indexHTML, appTitle) {
  if (!appTitle) {
    return indexHTML;
  }
  return indexHTML.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${String(appTitle).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>`,
  );
}

module.exports = { injectFavicon, injectTitle };
