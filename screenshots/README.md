# Screenshots

Drop product screenshots here. The HTML expects:

- `hero-devices.png` (1600×1000) — hero section main image. Show the device list with multiple devices visible.
- `live-photo-demo.gif` — Live Photo cross-platform demo. Pick a Live Photo on iPhone, send to Android, show that the gallery still plays it.
- `devices.png` (mobile aspect, ~750×1334) — device discovery screen
- `transfer.png` (mobile aspect) — transfer progress screen
- `history.png` (mobile aspect) — history screen

After dropping a file in, replace the corresponding `.screenshot-placeholder` div in `index.html` with:

```html
<img src="screenshots/hero-devices.png" alt="..." class="rounded-2xl shadow-2xl">
```

## Recording GIFs

- macOS: [Kap](https://getkap.co/) (free) or QuickTime Player → File → New Screen Recording, then convert with `ffmpeg -i in.mov -vf "fps=15,scale=720:-1" out.gif`
- Cross-platform: [LICEcap](https://www.cockos.com/licecap/) (free)
