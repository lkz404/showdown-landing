# Provenance of the page's rasters

`panel-one.png` and `popup.png` are real captures of the Showdown Helper extension, not drawings.

- **Generator:** `node tools/capture.mjs` renders the extension's own built panel (`dist/content.js`, `panel.css`) and toolbar popup (`dist/popup.html`) in headless Chrome at 2x, from `tools/harness.html`.
- **Extension build:** the `main` branch of https://github.com/lkz404/showdown-helper as of 2026-11-21 (panel with team boxes, type icons and usage, toolbar popup with Pokepaste import).
- **Move usage:** Pikalytics `gen9vgc2026regf`, fetched 2026-11-21 with the extension's own `src/pikalytics.js` (Urshifu-Rapid-Strike: Surging Strikes 99.999, Close Combat 98.9, Aqua Jet 87.684, U-turn 45.468, Detect 37.2).
- **Damage:** computed by the extension's `src/calc.js` (@smogon/calc 0.12.0) against a level 50 Flutter Mane (131 HP, 50/70/150/110/170) with an assumed max-Attack Urshifu.
- **Sprites:** loaded from play.pokemonshowdown.com when the capture is rendered. Pokémon and its art belong to their owners.
- **The matchup is an example.** The team and the battle state in `tools/harness.html` are fixed demo data.
