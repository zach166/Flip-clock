# Flip Clock

A full-screen, real-time flip clock built with plain HTML, CSS, and JavaScript — no
frameworks or build step required. Each digit sits on its own card and flips over
with a two-stage 3D animation (top flap falls away, bottom flap falls into place)
whenever it changes, in the style of a classic split-flap display.

## Files

- `index.html` — page structure
- `style.css` — layout, card styling, and the flip animation
- `script.js` — clock logic and animation sequencing

## Running it locally

No build tools needed. Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying with GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to the repo's **Settings → Pages**.
3. Under **Build and deployment**, set the source branch (e.g. `main`) and folder (`/root`).
4. Save — GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

## Customizing

- **Colors**: edit the CSS variables at the top of `style.css` (`--bg-1`, `--card-bg`,
  `--digit-color`, `--accent`, etc).
- **Size**: the clock scales automatically with the viewport via `--digit-size` in
  `style.css` (a `clamp()` value) — no JS changes needed.
- **Flip speed**: change `--flip-duration` in `style.css`.
- **12/24-hour format**: set to 12-hour by default. To switch to 24-hour, change
  `const use24Hour = false;` to `true` in `script.js`.

## Browser support

Uses standard CSS 3D transforms (`rotateX`, `perspective`) and `requestAnimationFrame`,
supported in all modern evergreen browsers (Chrome, Firefox, Safari, Edge).
