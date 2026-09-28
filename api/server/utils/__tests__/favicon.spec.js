const { injectFavicon, injectTitle, injectManifestIcons, injectManifestName, injectManifestColors } = require('../favicon');

describe('injectManifestIcons', () => {
  const baseManifest = JSON.stringify({
    name: 'Chat',
    icons: [{ src: 'assets/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  });

  it('returns the manifest unchanged when no URL is configured', () => {
    expect(injectManifestIcons(baseManifest, '')).toBe(baseManifest);
    expect(injectManifestIcons(baseManifest, undefined)).toBe(baseManifest);
  });

  it('replaces bundled icons with the configured URL at every install size', () => {
    const result = JSON.parse(injectManifestIcons(baseManifest, 'https://example.com/ico.png'));
    expect(result.icons).toHaveLength(4);
    expect(result.icons.every((i) => i.src === 'https://example.com/ico.png')).toBe(true);
    expect(result.icons.map((i) => i.sizes)).toEqual([
      'any',
      '192x192',
      '512x512',
      '512x512',
    ]);
    expect(result.icons.filter((i) => i.purpose === 'maskable')).toHaveLength(1);
  });
});

describe('injectManifestName', () => {
  const baseManifest = JSON.stringify({ name: 'Chat', short_name: 'Chat', icons: [] });

  it('returns the manifest unchanged when no title is configured', () => {
    expect(injectManifestName(baseManifest, '')).toBe(baseManifest);
  });

  it('rewrites the display name to the configured app title', () => {
    const result = JSON.parse(injectManifestName(baseManifest, 'MimikkAi Chat'));
    expect(result.name).toBe('MimikkAi Chat');
    expect(result.short_name).toBe('MimikkAi Chat');
  });
});

describe('injectManifestColors', () => {
  const baseManifest = JSON.stringify({
    name: 'Chat',
    theme_color: '#009688',
    background_color: '#000000',
    icons: [],
  });

  it('returns the manifest unchanged when no colors are configured', () => {
    expect(injectManifestColors(baseManifest, '', '')).toBe(baseManifest);
    expect(injectManifestColors(baseManifest, undefined, undefined)).toBe(baseManifest);
  });

  it('overrides theme_color only', () => {
    const result = JSON.parse(injectManifestColors(baseManifest, '#14b8a6', ''));
    expect(result.theme_color).toBe('#14b8a6');
    expect(result.background_color).toBe('#000000');
  });

  it('overrides both colors', () => {
    const result = JSON.parse(injectManifestColors(baseManifest, '#14b8a6', '#ffffff'));
    expect(result.theme_color).toBe('#14b8a6');
    expect(result.background_color).toBe('#ffffff');
  });
});

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
    expect(result).toContain('<link rel="icon" href="https://example.com/favicon.ico" />');
    expect(result).not.toContain('assets/favicon-32x32.png');
    expect(result).not.toContain('assets/favicon-16x16.png');
    expect(result).not.toContain('apple-touch-icon');
    expect(result.match(/rel="icon"/g)).toHaveLength(1);
  });

  it('emits no type attribute so browsers sniff the image', () => {
    // Firefox trusts a mismatched type over the served Content-Type and
    // refuses to decode a PNG declared as x-icon.
    const result = injectFavicon(sampleHTML, 'https://example.com/brand.png');
    expect(result).not.toMatch(/<link rel="icon"[^>]*type=/);
  });

  it('keeps non-favicon head content intact', () => {
    const result = injectFavicon(sampleHTML, 'https://example.com/favicon.ico');
    expect(result).toContain('<title>LibreChat</title>');
  });
});

describe('injectTitle', () => {
  it('returns the HTML unchanged when no title is configured', () => {
    const html = '<html><head><title>LibreChat</title></head></html>';
    expect(injectTitle(html, '')).toBe(html);
    expect(injectTitle(html, undefined)).toBe(html);
  });

  it('replaces the bundled title with the configured app title', () => {
    expect(injectTitle('<title>LibreChat</title>', 'MimikkAi Chat')).toBe(
      '<title>MimikkAi Chat</title>',
    );
  });

  it('escapes angle brackets in the configured title', () => {
    expect(injectTitle('<title>LibreChat</title>', '<script>alert(1)</script>')).toBe(
      '<title>&lt;script&gt;alert(1)&lt;/script&gt;</title>',
    );
  });
});