# Screenshots

Real device captures used on the landing page. Two pages consume
these; both swap the file based on the active UI language via
`data-i18n-src` in `index.html`.

| File | Used in | Spec |
|---|---|---|
| `hero-devices_cn.png` | Hero section | 1600×1000 px, Mac app window |
| `hero-devices_en.png` | Hero section (English) | same |
| `live-photo-demo_cn.png` | "Live Photo cross-platform" feature | 800×600 px (or 4:3) |
| `live-photo-demo_en.png` | same (English) | same |

To update a screenshot: drop a new PNG with the same filename, commit,
push — Cloudflare Pages redeploys automatically. The language toggle
on airtokapp.com picks the matching variant.

## Notes

- All files have `loading="lazy"` in the HTML so page TTFB isn't hurt.
- Compressed PNG is fine; animated WebP or MP4 could replace the Live
  Photo still if we want motion later — swap the `<img>` for a
  `<video autoplay muted loop playsinline>` if doing that.
