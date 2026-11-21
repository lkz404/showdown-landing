# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Hand-authored static HTML/CSS/JS (`index.html`, `site.css`, `site.js`). `tools/capture.mjs` renders the real extension UI into `assets/shots/` with headless Chrome. Hosted from the repo https://github.com/lkz404/showdown-landing; no deploy target decided.

## Users
The page's audience is introductory VGC (Pokémon doubles) players on Pokémon Showdown. The extension itself serves newer and experienced players, newer players first. They are mid-battle or about to be, and want to know what the opponent's Pokémon can do and how hard it hits.

## Product Purpose
Showdown Helper is a Chrome extension for play.pokemonshowdown.com. For each of the opponent's active Pokémon it shows the 5 most used moves from Pikalytics, each with its type and an estimated damage range against one of the player's own Pokémon. The landing page exists to get a new player to the code on GitHub and through a 3-step unpacked install.

## Positioning
Pikalytics usage data and Smogon-calc damage in one live panel beside the battle, with no tab switching. It shows only the opponent's active Pokémon, deliberately less than a full calculator.

## Operating Context
The extension docks to the right quarter of the Showdown page so the battle and turn log stay visible. It is not on the Chrome Web Store: players load it unpacked in Chrome-based browsers. Main action everywhere: "Get the code on GitHub" → https://github.com/lkz404/showdown-helper.

## Capabilities and Constraints
- Damage is an estimate with the opponent at max Attack or Special Attack. The opponent's real spread, item and Tera type are unknown and must not be implied.
- The target is one of your 4 chosen Pokémon (boxes in the panel). A move whose max roll can KO shows its percentage in red.
- The toolbar popup imports a team from a Pokepaste link so damage uses real stats (built; not yet committed when this was written).
- Chrome-based only; not affiliated with Nintendo, Game Freak, Pokémon Showdown or Pikalytics (one footer line says so).

## Brand Commitments
Name: "Showdown Helper". Palette for the page, pinned by the user: white, sand and cobalt.

## Evidence on Hand
Real sprites from play.pokemonshowdown.com, real damage numbers from `src/calc.js`, real panel screenshots rendered from the extension's own code. No testimonials, user counts or ratings exist; none may be invented. No contact details, no forms.

## Product Principles
1. Never cover the battle: the panel sits beside it.
2. No invented data: every number comes from Pikalytics, the battle, or @smogon/calc.
3. Say what the estimate assumes.
4. Plain words for newcomers: explain KO and usage in line.

## Accessibility & Inclusion
Reduced-motion respected. Text contrast at least WCAG AA.
