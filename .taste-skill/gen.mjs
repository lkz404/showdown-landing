// Generates ../index.html. Damage numbers come from the extension's own calc.js, so the page
// shows exactly what the extension shows. Run: node .taste-skill/gen.mjs
import { estimateDamage } from 'file:///C:/Users/golde/showdown-moves-helper/src/calc.js';
import { writeFileSync } from 'node:fs';

const REPO = 'https://github.com/lkz404/showdown-helper';
const MAIN = 'Get the code on GitHub';
const ARROW = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>';

const TYPE = { Normal:'#a8a77a',Fire:'#ee8130',Water:'#6390f0',Electric:'#f7d02c',Grass:'#7ac74c',Ice:'#96d9d6',Fighting:'#c22e28',Poison:'#a33ea1',Ground:'#e2bf65',Flying:'#a98ff3',Psychic:'#f95587',Bug:'#a6b91a',Rock:'#b6a136',Ghost:'#735797',Dragon:'#6f35fc',Dark:'#705746',Steel:'#b7b7ce',Fairy:'#d685ad','???':'#68a090' };
// pill text colour: dark ink on the light type colours so every name reads (4.5:1)
const LIGHT = new Set(['Normal','Electric','Ground','Ice','Steel','Bug','Grass','Flying','Fairy','Fire','Water','Psychic','Rock']);

const snap = { gen: 9, gameType: 'doubles', weather: '', terrain: '' };
const mane = { species: 'Flutter Mane', level: 50, stats: { hp: 131, atk: 50, def: 70, spa: 150, spd: 110, spe: 170 }, curHP: 131, item: '', ability: 'Protosynthesis' };
const INC = { species: 'Incineroar', sprite: 'incineroar', level: 50, ability: 'Intimidate', moves: ['Fake Out', 'Flare Blitz', 'Knock Off', 'Parting Shot', 'U-turn'] };
const URS = { species: 'Urshifu-Rapid-Strike', short: 'Urshifu', sprite: 'urshifu-rapidstrike', level: 50, ability: 'Unseen Fist', moves: ['Surging Strikes', 'Close Combat', 'Aqua Jet', 'U-turn', 'Detect'] };

const dmg = (e, m) => estimateDamage(snap, e, m, mane);
const sprite = (id, cls = '', size = 48) => `<img class="${cls}" src="assets/sprites/${id}.png" alt="" width="${size}" height="${size}" loading="lazy" decoding="async">`;

function moveRow(e, m, { big = false } = {}) {
  const d = dmg(e, m);
  const c = TYPE[d.type] || TYPE['???'];
  const ink = LIGHT.has(d.type) ? '#14161e' : '#fff';
  return `<div class="sw-move${big ? ' sw-move--big' : ''}"><span class="sw-mname" style="background:${c};color:${ink}">${d.name}</span><span class="sw-dmg${d.canKO ? ' sw-ko' : ''}">${d.text}</span></div>`;
}
const enemyBlock = (e, opts) => `<div class="sw-enemy"><div class="sw-ehead">${sprite(e.sprite, 'sw-esprite', 48)}<b>${e.species}</b></div><div class="sw-moves">${e.moves.map((m) => moveRow(e, m, opts)).join('')}</div></div>`;
const targetBlock = (big = false) => `<div class="sw-target${big ? ' sw-target--big' : ''}"><span class="sw-tlabel">Damage vs</span>${sprite('fluttermane', 'sw-tsprite', big ? 96 : 40)}<span class="sw-select">Flutter Mane<i aria-hidden="true"></i></span></div>`;

// ---- the hero window: Showdown on the left, the extension's panel on the right ----
const heroWindow = `
        <div class="ly-piece ly-piece--main sw-win ui" aria-hidden="true">
          <div class="sw-bar"><span class="sw-dots"><i></i><i></i><i></i></span><span>Pokémon Showdown · Battle</span></div>
          <div class="sw-body">
            <div class="sw-game">
              <div class="sw-field">
                ${sprite('incineroar', 'sw-f sw-f--a', 72)}${sprite('urshifu-rapidstrike', 'sw-f sw-f--b', 72)}${sprite('fluttermane', 'sw-f sw-f--c', 80)}
              </div>
              <div class="sw-log">
                <p><b>Turn 3</b></p>
                <p>The opposing Incineroar used <b>Fake Out</b>!</p>
                <p>It doesn’t affect Flutter Mane…</p>
                <p>Flutter Mane used <b>Icy Wind</b>!</p>
                <p>The opposing Urshifu’s Speed fell!</p>
                <p>Flutter Mane is protected by <b>Protosynthesis</b>.</p>
                <p><b>Turn 4</b></p>
              </div>
            </div>
            <div class="sw-panel">
              ${targetBlock()}
              ${enemyBlock(INC)}
              ${enemyBlock(URS)}
            </div>
          </div>
        </div>
        <div class="ly-piece ly-piece--note sw-card" aria-hidden="true" data-ly-steps="700">
          <div class="sw-card__row"><h5>Flare Blitz on Flutter Mane</h5><span class="sw-chip" data-step data-step-at="4">Can KO</span></div>
          <div class="sw-note" data-step><i>!</i><span>Hits for <b>${dmg(INC, 'Flare Blitz').text}</b> of its HP</span></div>
          <div class="sw-note" data-step><i>!</i><span>The highest roll is <b>enough to KO</b></span></div>
          <div class="sw-note" data-step><i>✓</i><span>The number turns <b class="sw-red">red</b></span></div>
        </div>`;

// ---- the guide's three chapters (pinned-chapters) ----
const stage = (inner, cls = '') => `<div class="sw-stage ${cls}">${inner}</div>`;
const darkCard = (inner, cls = '') => `<div class="sw-dark ${cls}">${inner}</div>`;
const chapters = [
  {
    h: 'Pick your Pokémon',
    p: 'Choose which Pokémon on your team to calculate against. It starts on your active one and keeps your choice as you switch.',
    alt: 'The panel’s picker set to Flutter Mane',
    visual: stage(darkCard(targetBlock(true), 'sw-dark--picker')),
  },
  {
    h: 'Read each opponent Pokémon’s moves',
    p: 'Each opponent Pokémon shows its five most used moves, most used first. The colour of a move’s box is its type.',
    alt: 'Urshifu’s five most used moves, each in a box coloured by type',
    visual: stage(darkCard(`<div class="sw-enemy"><div class="sw-ehead">${sprite(URS.sprite, 'sw-esprite', 48)}<b>${URS.species}</b></div><div class="sw-moves">${URS.moves.map((m) => `<div class="sw-move sw-move--names"><span class="sw-mname" style="background:${TYPE[dmg(URS, m).type]};color:${LIGHT.has(dmg(URS, m).type) ? '#14161e' : '#fff'}">${dmg(URS, m).name}</span></div>`).join('')}</div></div>`, 'sw-dark--names')),
  },
  {
    h: 'Check which moves KO your Pokémon',
    p: 'The big number is the damage as a share of your Pokémon’s HP. It turns red when the strongest roll could knock it out.',
    alt: 'Surging Strikes at 133 to 158 percent in red, Aqua Jet at 46 to 55 percent in white',
    visual: stage(darkCard(`<div class="sw-moves sw-moves--two">${moveRow(URS, 'Surging Strikes', { big: true })}${moveRow(URS, 'Aqua Jet', { big: true })}</div>`, 'sw-dark--two')),
  },
];

// ---- install cards ----
const ic = (name, w, h, extra = '') => `<span class="ic-tile ic-tile--40"><img class="ic ic-40 ${extra}" src="assets/icons/${name}.svg" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></span>`;
const installCards = [
  {
    n: '1', h: 'Get the extension code',
    p: 'Clone or download the repository from GitHub.',
    alt: 'A GitHub repository card with a Download ZIP option',
    panel: `<div class="sw-card sw-card--static ui"><div class="sw-card__row sw-card__row--icon">${ic('github', 40, 39, 'ic-ink')}<h5>showdown-helper</h5></div><div class="sw-note"><i>✓</i><span><b>Clone</b> with Git</span></div><div class="sw-note"><i>✓</i><span><b>Download ZIP</b> and unzip it</span></div></div>`,
  },
  {
    n: '2', h: 'Build the extension',
    p: 'Run two commands in the folder. You need Node.js installed.',
    alt: 'A terminal running npm install and node build.mjs',
    panel: `<div class="sw-card sw-card--term ui"><div class="sw-card__row sw-card__row--icon">${ic('nodejs', 35, 40)}<h5>Terminal</h5></div><pre class="sw-pre"><span>$ npm install</span>\n<span>$ node build.mjs</span>\n<span class="sw-ok">Done</span></pre></div>`,
  },
  {
    n: '3', h: 'Load the extension in Chrome',
    p: 'Open chrome://extensions, turn on Developer mode, choose Load unpacked and pick the folder.',
    alt: 'Chrome’s extensions page with Developer mode on and a Load unpacked button',
    panel: `<div class="sw-card sw-card--static ui"><div class="sw-card__row sw-card__row--icon">${ic('chrome', 40, 40)}<h5>Extensions</h5></div><div class="sw-note"><i>✓</i><span><b>Developer mode</b> on</span></div><span class="sw-btn">Load unpacked</span></div>`,
  },
];

// ---- FAQ (every answer from what the code does) ----
const faq = [
  ['Which opponent Pokémon does it show?', 'The opponent’s active Pokémon, one card each. In doubles that is two cards.'],
  ['Does the panel cover the Showdown battle?', 'No. Showdown shrinks to the left three quarters, so the battle and the turn log stay in view.'],
  ['Where does the Pikalytics data come from?', 'It matches the format you are playing. With no data for it, the panel uses VGC Regulation F.'],
  ['How does the extension work out damage?', 'With the engine behind the Showdown damage calculator, using your Pokémon’s real stats.'],
  ['Does the extension know an opponent’s item?', 'No. It assumes none until Showdown reveals one, so read each number as a worst case.'],
];

let css = String.raw`
  /* ---- the Showdown window and the extension panel, drawn as live HTML (page CSS, inside a visual) ---- */
  .sw-win { background: #e9eef3; color: #16181a; border-radius: 12px; overflow: hidden; font: 400 13px/1.4 var(--font-text); text-align: left;
            box-shadow: 0 0 0 1px rgb(0 0 0 / .08), 0 28px 64px -28px rgb(0 0 0 / .55); }
  .sw-bar { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 14px; background: #f6f8fa; border-bottom: 1px solid rgb(0 0 0 / .08); font-size: 13px; color: #5d6268; }
  .sw-dots { display: flex; gap: 6px; } .sw-dots i { width: 10px; height: 10px; border-radius: 50%; background: #d3d8dd; }
  .sw-body { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .sw-game { padding: 12px; display: grid; align-content: start; gap: 12px; }
  .sw-field { position: relative; height: 230px; border-radius: 8px; background: #cfe3f1; overflow: hidden; }
  .sw-f { position: absolute; object-fit: contain; }
  .sw-f--a { right: 6px; top: 8px; } .sw-f--b { right: 74px; top: 40px; } .sw-f--c { left: 18px; bottom: 6px; }
  .sw-log { display: grid; gap: 4px; font-size: 13px; line-height: 1.45; color: #3d4247; }
  .sw-log p { margin: 0; } .sw-log b { font-weight: 500; color: #16181a; }
  .sw-panel { min-width: 0; background: #14161e; color: #e8e8f0; padding: 14px 12px 14px 14px; padding-right: var(--ly-cut-room); display: grid; align-content: start; gap: 10px; }
  .sw-target { display: grid; grid-template-columns: auto 1fr; grid-template-areas: "s l" "s b"; align-items: center; column-gap: 10px; }
  .sw-tlabel { grid-area: l; font-size: 13px; opacity: .7; align-self: end; }
  .sw-tsprite { grid-area: s; width: 40px; height: 40px; object-fit: contain; }
  .sw-select { grid-area: b; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 10px; font-size: 14px; font-weight: 500; background: #2a2d3a; border: 1px solid #555; border-radius: 6px; align-self: start; }
  .sw-select i { width: 7px; height: 7px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg) translateY(-2px); opacity: .7; }
  .sw-target--big { grid-template-columns: 1fr; grid-template-areas: "l" "s" "b"; justify-items: center; row-gap: 10px; text-align: center; }
  .sw-target--big .sw-tlabel { align-self: auto; font-size: 13px; }
  .sw-target--big .sw-tsprite { width: 96px; height: 96px; }
  .sw-target--big .sw-select { width: 100%; justify-content: center; font-size: 18px; padding: 10px 14px; }
  .sw-ehead { display: flex; align-items: center; gap: 8px; }
  .sw-ehead b { font-size: 15px; font-weight: 500; }
  .sw-esprite { width: 48px; height: 48px; object-fit: contain; }
  .sw-moves { display: grid; gap: 4px; }
  .sw-move { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 8px; height: 36px; padding: 0 8px; border: 1px solid rgb(255 255 255 / .1); border-radius: 6px; background: rgb(255 255 255 / .05); }
  .sw-mname { padding: 3px 10px; border-radius: 999px; font-size: 13px; font-weight: 700; line-height: 1.25; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sw-dmg { text-align: center; font-size: 19px; font-weight: 800; line-height: 1; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .sw-ko { color: #ff5252; text-shadow: 0 0 8px rgb(255 82 82 / .5); }
  /* the small result card over the hero window's lower-left corner */
  .hero__art > .ly-piece--note { left: var(--s-6); bottom: var(--s-6); width: 300px; z-index: 2; }
  .sw-card { background: #fff; color: #16181a; border-radius: 12px; padding: 14px 16px; font: 400 14px/1.4 var(--font-text); text-align: left; box-shadow: 0 0 0 1px rgb(0 0 0 / .07), 0 18px 44px -20px rgb(0 0 0 / .5); }
  .sw-card h5 { margin: 0; font: 600 14px/1.3 var(--font-text); color: inherit; }
  .sw-card__row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .sw-card__row--icon { justify-content: flex-start; gap: 12px; margin-bottom: 4px; }
  .sw-chip { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 99px; font-size: 13px; font-weight: 500; background: #fbe6e3; color: #a3271b; white-space: nowrap; }
  .sw-chip::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .sw-note { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 13px; color: #3d4247; border-top: 1px solid rgb(0 0 0 / .06); }
  .sw-note i { width: 18px; height: 18px; border-radius: 50%; flex: none; display: grid; place-items: center; background: #e7f4ec; color: #17673f; font-style: normal; font-size: 13px; font-weight: 700; }
  .sw-note:first-of-type i, .sw-card[data-ly-steps] .sw-note:nth-of-type(-n+2) i { background: #fdf0dc; color: #8a5300; }
  .sw-note b { font-weight: 500; color: #16181a; }
  .sw-red { color: #d62b2b; }
  .hero__proof { margin: var(--s-5) 0 0; font-size: var(--t-small); color: var(--muted); }
  .ly-piece--main .sw-panel { padding-right: var(--ly-cut-room); }
  .sw-body { min-height: 590px; }
  @media (max-width: 1023px) { .hero__art > .ly-piece--note { left: var(--s-4); bottom: var(--s-4); width: 270px; } }
  @media (max-width: 639px) {
    .sw-body { grid-template-columns: minmax(0, 1fr); }
    .sw-game { display: none; }
    .sw-panel > .sw-target, .sw-panel > .sw-enemy:nth-of-type(3) { display: none; }
    .sw-panel .sw-move:nth-of-type(n+4) { display: none; }
  }
  /* ---- install cards ---- */
  .open-cards .panel { --p-h: 248px; background:
      radial-gradient(80% 70% at 20% 0%, color-mix(in oklab, var(--ground-surface) 80%, white), transparent 70%), var(--ground-bg); }
  .open-cards .stage > .at-rise { --ax: 20px; --ay: 28px; --fit-max: 300px; }
  .open-cards > .card { grid-column: 1 / -1; }
  @media (min-width: 1024px) { .open-cards > .card { grid-column: auto / span 4; } }
  @media (min-width: 640px) and (max-width: 1023px) {
    .open-cards > .card { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); grid-auto-rows: min-content; column-gap: var(--s-6); align-content: start; }
    .open-cards > .card > :not(.panel) { grid-column: 1; }
    .open-cards > .card > .panel { grid-column: 2; grid-row: 1 / span 4; --p-h: 208px; margin: calc(var(--c-gap) - var(--c-pad)) calc(var(--c-gap) - var(--c-pad)) calc(var(--c-gap) - var(--c-pad)) 0; border-radius: calc(var(--c-r) - var(--c-gap)); }
  }
  @media (max-width: 639px) { .open-cards .panel { --p-h: 300px; } .stage > .at-rise { --ay-sm: 24px; } .open-cards > .card > .panel { margin-top: var(--s-5); } }
  .sw-card--term { background: #14161e; color: #e8e8f0; box-shadow: 0 0 0 1px rgb(255 255 255 / .08), 0 18px 44px -20px rgb(0 0 0 / .6); }
  .sw-pre { margin: 6px 0 0; font: 400 13px/1.7 var(--font-mono); color: #cfd3da; white-space: pre; }
  .sw-ok { color: #8fa68e; }
  .sw-btn { display: inline-flex; align-items: center; height: 30px; margin-top: 4px; padding: 0 12px; border-radius: 7px; background: #16181a; color: #fff; font-size: 13px; font-weight: 500; }
  /* "Showdown Helper" is 7.9em wide: hand-set so it spans the wrap and never runs past it */
  .closing .close__word { white-space: nowrap; font-size: clamp(32px, 10.2vw, 148px); line-height: 1.06; padding-top: .04em; }
  .footer__note { margin: var(--s-5) 0 0; }
  /* the kit's affordance reads "Credits"; this line holds the trademark note, so it reads "Details" */
  .footer__legal .credits > summary::after { content: "Details"; }
  .footer__legal .credits[open] > summary::after { content: "Hide"; }
  /* the guide at rest on a phone holds its two screens; install and the questions take two phone screens */
  @media (max-width: 639px) { main > #guide[data-moment]:not(.is-live) { min-height: 200lvh; } }
  /* the pause disc over the lit ground: a dark ring, so focus shows 3:1 (the kit's sage ring is the ground's own colour) */
  .hero__art .loop-pause:focus-visible, .hero__art .ui-pause:focus-visible { outline: 2px solid #1c1c1c; outline-offset: 2px; }
  /* smaller hero art: fewer log lines, so the frame's cut falls in empty margin and never through a line of text */
  @media (max-width: 1279px) { .sw-log p:nth-of-type(n+5) { display: none; } .sw-field { height: 190px; } }
  /* tablet: the guide's pictures are 16:9 so its three rows fit one screen; the questions' intro and panel sit side by side */
  @media (min-width: 640px) and (max-width: 1023px) {
    [data-moment="pinned-chapters"]:not(.is-live) .mo-pc__visual > img { aspect-ratio: 16 / 9; }
    .open-cards > .card > .panel { --p-h: 196px; }
    #questions .span-5 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: var(--s-5); align-items: start; }
    .closing .close__word { white-space: normal; font-size: clamp(56px, 17vw, 150px); line-height: 1; }
    #questions .faq__panel { margin-top: 0; }
  }
  /* phone: bigger guide pictures and panels so each section fills its screens and the gaps between them even out; a tighter footer */
  @media (max-width: 639px) {
    main > #guide[data-moment]:not(.is-live) .mo-pc__visual > img { aspect-ratio: 100 / 96; max-height: none; }
    .faq__panel { --p-h: 520px !important; }
    .faq__panel .stage > .at-rise { --ay-sm: 140px; }
    .faq > .faq__item { padding: var(--s-5) 0; }
    footer.closing > .wrap { row-gap: var(--s-5); }
    .closing__links { gap: var(--s-4); }
  }
  .faq__panel { --p-h: 200px; margin-top: var(--s-6); background: radial-gradient(80% 70% at 20% 0%, color-mix(in oklab, var(--ground-surface) 80%, white), transparent 70%), var(--ground-bg); }
  .faq__panel .stage > .at-rise { --ax: 20px; --ay: 24px; --fit-max: 300px; }
`;

// the three chapter visuals are rendered to PNGs from these cards (drawn once, shown as real UI captures)
const captureCss = `
  html, body { margin: 0; background: #cdd5c4; }
  .sw-stage { width: 800px; height: 600px; display: grid; place-items: center; box-sizing: border-box; padding: 40px;
              background: radial-gradient(70% 60% at 18% 12%, #e9eee4, transparent 70%), radial-gradient(60% 50% at 90% 100%, #b8c3ac, transparent 70%), #cdd5c4; }
  .sw-dark { width: 420px; background: #14161e; color: #e8e8f0; border-radius: 14px; padding: 20px; font: 400 15px/1.4 var(--font-text); box-shadow: 0 0 0 1px rgb(255 255 255 / .06), 0 28px 60px -24px rgb(0 0 0 / .7); }
  .sw-dark--picker { width: 340px; }
  .sw-move { height: 44px; }
  .sw-mname { font-size: 15px; }
  .sw-dmg { font-size: 24px; }
  .sw-ehead b { font-size: 17px; }
  .sw-esprite { width: 56px; height: 56px; }
  .sw-move--names { grid-template-columns: minmax(0, 1fr); }
  .sw-move--names .sw-mname { padding: 5px 14px; font-size: 16px; }
  .sw-move--big { height: 84px; }
  .sw-move--big .sw-mname { font-size: 18px; padding: 6px 14px; }
  .sw-move--big .sw-dmg { font-size: 40px; }
  .sw-dark--two { width: 460px; } .sw-dark--two .sw-moves { gap: 12px; }
  .sw-target--big .sw-tsprite { width: 110px; height: 110px; }
  .sw-target--big .sw-select { font-size: 20px; padding: 12px 16px; }
`;

const nav = `
<header class="nav nav--centre">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Skip to content</a>
    <a class="nav__logo" href="#top"><span class="mark" data-mark="dots" aria-hidden="true"></span>Showdown Helper</a>
    <nav class="nav__links" aria-label="Main">
      <div class="nav__item"><a class="nav__link" href="#guide">Guide</a></div>
      <div class="nav__item"><a class="nav__link" href="#install">Install</a></div>
      <div class="nav__item"><a class="nav__link" href="#questions">Questions</a></div>
    </nav>
    <div class="nav__actions">
      <a class="btn btn--primary" href="${REPO}">${MAIN}</a>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Menu"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
  </div>
</header>`;

const html = `<!doctype html>
<html lang="en" data-type="software" data-radius="soft" data-ground="sage" data-buttons="tonal" data-motion>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Showdown Helper: top opponent moves for new VGC players</title>
<meta name="description" content="A Chrome extension that lists the five most used moves of your opponent’s Pokémon on Pokémon Showdown, with the damage each one does to yours.">
<meta property="og:type" content="website">
<meta property="og:title" content="Showdown Helper: top opponent moves for new VGC players">
<meta property="og:description" content="The five most used moves of every opponent Pokémon on Pokémon Showdown, and how hard each one hits yours.">
<meta property="og:image" content="share.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#1c1c1c">
<!-- <link rel="canonical" href="https://[the page's domain]/"> -->
<meta name="site-kind" content="software">
<meta name="page-type" content="software">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400..700&family=Funnel+Sans:wght@400..600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/system.css">
<link rel="stylesheet" href="assets/ui/cards.css">
<link rel="stylesheet" href="assets/motion/motion.css">
<link rel="stylesheet" href="assets/backgrounds/backgrounds.css">
<link rel="stylesheet" href="assets/layout/layout.css">
<link rel="stylesheet" href="assets/icons/icon.css">
<style>
:root {
  --p-bg: #1c1c1c; --p-surface: #262626; --p-ink: #f1f1ef; --p-muted: #9a9b96;
  --p-accent: #8fa68e; --p-accent-ink: #1c1c1c; --p-action: #8fa68e; --p-action-ink: #1c1c1c;
  --p-inv-bg: #c8c5ba; --p-inv-surface: #bab8ae; --p-inv-ink: #1c1c1c; --p-inv-muted: #454442;
  --p-inv-accent: #1c1c1c; --p-inv-accent-ink: #c8c5ba; --p-inv-action: #1c1c1c; --p-inv-action-ink: #c8c5ba;
  --font-display: "Funnel Display", system-ui, sans-serif;
  --font-text: "Funnel Sans", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 400;
  --display-tracking: -0.03em;
  --display-tracking-xl: -0.04em;
  --ly-scale: 0.98;
}
</style>
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
<script src="assets/backgrounds/backgrounds.js"></script>
<script>document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)</script>
<link rel="modulepreload" href="assets/moments/moments.js">
<link rel="modulepreload" href="assets/moments/lib.js">
<link rel="modulepreload" href="assets/moments/pinned-chapters/moment.js">
<style>${css}</style>
</head>
<body>
<!-- type: software (site-kind software)
     deal: hero collage, nav nav-centre (nav-mega dealt, re-dealt: a three-section page has no feature pages to map), footer footer-columns, close close-word,
           rhythm surface-pairs, buttons tonal, mark dots, palette charcoal-room-sage + funnel, grounds none, effect: the hero's lit ground (CSS, no WebGL)
     moments: pinned-chapters in #guide -->
${nav}

<main id="top">
  <section class="hero hero--collage" data-enter aria-labelledby="hero-h">
    <div class="wrap"><div class="hero-text grid hero__grid">
      <div class="hero__text span-5">
        <h1 id="hero-h">Chrome extension for new VGC players on Showdown</h1>
        <p class="hero__lead">A Chrome extension that lists the five moves each opponent Pokémon uses most, from Pikalytics, and shows how much damage every one does to your Pokémon.</p>
        <div class="btn-row"><a class="btn btn--primary" href="${REPO}">${MAIN}${ARROW}</a></div>
        <p class="hero__proof">Works on Pokémon Showdown in Chrome.</p>
      </div>
      <div class="hero__art span-6 start-7" role="img" aria-label="Pokémon Showdown on the left and the Showdown Helper panel on the right: Incineroar’s and Urshifu’s five most used moves, each with its damage to Flutter Mane">${heroWindow}
      </div>
    </div></div>
  </section>

  <section class="section" id="guide" style="--h: 2" data-moment="pinned-chapters" aria-labelledby="guide-h">
    <div class="wrap mo-pc__grid">
      <div class="mo-pc__text">
        <h2 id="guide-h">Guide to the Showdown Helper panel</h2>
        <ol class="mo-pc__steps">
${chapters.map((c, i) => `          <li class="mo-pc__step">
            <h3>${c.h}</h3>
            <p>${c.p}</p>
            <figure class="mo-pc__visual"><img src="assets/shots/chapter-${i + 1}.png" srcset="assets/shots/chapter-${i + 1}-800.png 800w, assets/shots/chapter-${i + 1}.png 1600w" sizes="(min-width: 1024px) 628px, (min-width: 640px) 50vw, 100vw" alt="${c.alt}" width="1600" height="1200" loading="lazy" decoding="async" data-source="client" data-subject="the Showdown Helper panel"></figure>
          </li>`).join('\n')}
        </ol>
      </div>
      <div class="mo-pc__visuals frame"></div>
    </div>
  </section>

  <section class="section ground-surface" id="install" style="--hm: 2" aria-labelledby="install-h">
    <div class="wrap">
      <div class="section-head">
        <h2 id="install-h">Install it in 3 steps. <span class="muted">It isn’t in the Chrome Web Store.</span></h2>
      </div>
      <div class="grid open-cards">
${installCards.map((c) => `        <article class="card card--row">
          <h3>${c.h}</h3>
          <p>${c.p}</p>
          <div class="panel panel--inset" role="img" aria-label="${c.alt}">
            <div class="stage"><div class="at-rise fit" aria-hidden="true">${c.panel}</div></div>
          </div>
        </article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section" id="questions" style="--hm: 2" aria-labelledby="questions-h">
    <div class="wrap">
      <div class="grid grid--top">
        <div class="span-5">
          <div class="section-head">
            <h2 id="questions-h">Questions</h2>
            <p>What it shows, and what it can’t know.</p>
          </div>
          <div class="panel panel--inset faq__panel" role="img" aria-label="What the damage numbers assume: maximum offence for the opponent, no item until revealed, your Pokémon’s real stats">
            <div class="stage"><div class="at-rise fit" aria-hidden="true"><div class="sw-card sw-card--static ui"><div class="sw-card__row"><h5>Each number assumes</h5></div><div class="sw-note"><i>!</i><span>Opponent offence <b>at maximum</b></span></div><div class="sw-note"><i>!</i><span>Opponent item <b>none until shown</b></span></div><div class="sw-note"><i>✓</i><span>Your Pokémon’s <b>real stats</b></span></div></div></div></div>
          </div>
        </div>
        <div class="span-6 start-7 faq">
${faq.map(([q, a]) => `          <div class="faq__item"><h3>${q}</h3><p>${a}</p></div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="footer closing" id="contact" aria-labelledby="close-h">
  <div class="wrap">
    <div class="closing__cta close--word">
      <div class="section-head--split">
        <div><h2 id="close-h">${MAIN}</h2></div>
        <a class="btn btn--primary" href="${REPO}">${MAIN}${ARROW}</a>
      </div>
      <p class="close__word" aria-hidden="true">Showdown Helper</p>
    </div>
    <div class="closing__links">
      <div class="grid">
        <div class="span-6 stack-5">
          <a class="nav__logo" href="#top"><span class="mark" data-mark="dots" aria-hidden="true"></span>Showdown Helper</a>
          <p class="footer__lede">Opponent moves for Pokémon Showdown.</p>
        </div>
        <div class="span-6 start-7 footer__col"><h3>Page</h3><ul><li><a href="#guide">Guide</a></li><li><a href="#install">Install</a></li><li><a href="#questions">Questions</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Showdown Helper</span>
        <details class="credits"><summary>Trademarks and affiliation</summary><p>Pokémon names and sprites, and the GitHub, Chrome and Node.js logos, are trademarks of their owners. Showdown Helper is not affiliated with Nintendo, Game Freak, Pokémon Showdown or Pikalytics.</p></details>
      </div>
    </div>
  </div>
</footer>

<nav class="actionbar" aria-label="Quick actions">
  <a class="btn btn--primary" href="${REPO}">${MAIN}</a>
</nav>

<script type="module" src="assets/system.js"></script>
<script type="module" src="assets/motion/motion.js"></script>
<script type="module" src="assets/layout/layout.js"></script>
</body>
</html>
`;

writeFileSync(new URL('../index.html', import.meta.url), html);

import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
mkdirSync(root + 'assets/shots', { recursive: true });
const baseCss = css.split('/* ---- install cards ---- */')[0];
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => existsSync(p));
if (process.argv.includes('--shots') && CHROME) {
  chapters.forEach((c, i) => {
    const page = root + '.taste-skill/chapter-' + (i + 1) + '.html';
    writeFileSync(page, '<!doctype html><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400..600&display=swap" rel="stylesheet"><style>:root{--font-text:"Funnel Sans",system-ui,sans-serif;--ly-cut-room:0px}' + baseCss + captureCss + '</style>' + c.visual.replaceAll('src="assets/', 'src="../assets/'));
    for (const [dpr, name] of [[2, ''], [1, '-800']]) execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=' + dpr, '--window-size=800,600', '--virtual-time-budget=8000', '--user-data-dir=' + root + '.taste-skill/chrome-gen', '--screenshot=' + root + 'assets/shots/chapter-' + (i + 1) + name + '.png', 'file:///' + page], { stdio: 'ignore' });
  });
  console.log('rendered chapter images');
}
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#1c1c1c"/><g fill="#f1f1ef" transform="translate(4 4) scale(.667)"><circle cx="6.5" cy="6.5" r="4.5"/><circle cx="17.5" cy="6.5" r="4.5"/><circle cx="6.5" cy="17.5" r="4.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/></g></svg>`;
writeFileSync(new URL('../favicon.svg', import.meta.url), fav);
console.log('wrote index.html', html.length, 'bytes');
