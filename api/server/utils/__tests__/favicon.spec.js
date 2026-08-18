const { injectFavicon } = require('../favicon');

describe('injectFavicon', () => {
  const sampleHTML = `<!doctype html>
<html>
  <head>
    <title>LibreChat</title>
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="assets/apple-touch-icon-180x180.png" />
  </head>
  <body></body>
</html>`;

  it('returns input unchanged when faviconUrl is empty', () => {
    expect(injectFavicon(sampleHTML, '')).toBe(sampleHTML);
    expect(injectFavicon(sampleHTML, undefined)).toBe(sampleHTML);
  });

  it('replaces all favicon and apple-touch-icon links with the configured URL', () => {
    const result = injectFavicon(sampleHTML, 'https://example.com/favicon.ico');
    expect(result).toContain(
      '<link rel="icon" type="image/x-icon" href="https://example.com/favicon.ico" />',
    );
    expect(result).not.toContain('assets/favicon-32x32.png');
    expect(result).not.toContain('assets/favicon-16x16.png');
    expect(result).not.toContain('apple-touch-icon');
    expect(result.match(/rel="icon"/g)).toHaveLength(1);
  });

  it('keeps non-favicon head content intact', () => {
    const result = injectFavicon(sampleHTML, 'https://example.com/favicon.ico');
    expect(result).toContain('<title>LibreChat</title>');
  });
});
