// Cloudflare Pages Functions middleware. Auto-routes the
// Chinese-default static pages to their English siblings when the
// user's browser indicates non-Chinese language preference.
//
// Why: privacy / terms / changelog / support are stored as separate
// language files (privacy.html for zh, privacy_en.html for en). The
// "canonical" URL paths /privacy, /terms, /changelog, /support serve
// the Chinese version. Without this middleware, an English-speaking
// user / reviewer / crawler who lands on those default URLs sees the
// Chinese page regardless of preference.
//
// In-page JS detection (the index.html pattern) was an alternative
// but rejected here because:
//   * Legal docs are long; embedding both languages doubles payload.
//   * JS detection causes a flash of Chinese content before redirect.
//   * Non-browser fetches (curl, RSS readers, AI crawlers) don't run
//     JS and would always see Chinese.
//
// Behavior matrix:
//   Accept-Language begins with zh   → serve Chinese (default static)
//   Anything else (en, ja, fr, ...)  → 302 → /<page>_en
//   Chinese crawlers (Baidu / Sogou) → typically zh-CN, get Chinese ✓
//   English crawlers (Googlebot/AI)  → typically en-US, get English ✓
//   Apple App Review (en-US default) → English ✓
//
// Caching: response carries Vary: Accept-Language so CF edge caches
// the redirect/response per language preference. max-age=300 keeps
// the rule iterable without 24h stale propagation.
//
// SEO: each *_en.html and zh.html already declares hreflang link
// alternates pointing at its sibling, so search engines correctly
// index both URLs as language variants of the same canonical content.
// The 302 from /privacy → /privacy_en does not collapse the two URLs
// into one; both stay independently indexable.

// Paths that have a `<path>_en` sibling. Update this list when adding
// a new bilingual document.
const BILINGUAL_PATHS = new Set([
  '/privacy',
  '/terms',
  '/changelog',
  '/support',
]);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (BILINGUAL_PATHS.has(path)) {
    const accept = context.request.headers.get('Accept-Language') || '';
    // Look at the FIRST entry (highest q-value by convention, even
    // when q is omitted). Common shapes:
    //   "zh-CN,zh;q=0.9,en;q=0.8"  → zh wins (zh-CN first)
    //   "en-US,en;q=0.9"            → en wins
    //   "en-US,zh-CN;q=0.5"         → en wins (en-US first)
    //   "ja-JP,en;q=0.9"            → ja first → not zh → English page
    // Only zh* (zh, zh-CN, zh-Hans, zh-TW, zh-HK) keeps the Chinese
    // default. Everything else → English.
    const firstLang = (accept.split(',')[0] || '').trim().toLowerCase();
    const prefersZh = firstLang.startsWith('zh');
    if (!prefersZh) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${url.origin}${path}_en${url.search}`,
          'Vary': 'Accept-Language',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }
  }

  return context.next();
}
