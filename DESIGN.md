---
name: Showdown Helper
description: A printed team list sheet on a sand desk, with everything the tool knows filled in cobalt ink.
colors:
  desk-sand: "#ece2cc"
  band-sand: "#e4d7b8"
  band-soft-sand: "#f3ecdb"
  sheet-white: "#ffffff"
  print-navy: "#17203a"
  print-navy-secondary: "#4a5470"
  cobalt-ink: "#0047ab"
  cobalt-ink-deep: "#00348a"
  cobalt-pen-light: "#8db1ff"
typography:
  display:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(38px, 4.9vw, 72px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 54px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(22px, 2vw, 28px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 72"
  entry-mono:
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sheet: "0px"
  field: "2px"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  field-pad: "14px"
  row-pad: "clamp(26px, 3.4vw, 44px)"
  section-pad: "clamp(40px, 6vw, 80px)"
components:
  button-primary:
    backgroundColor: "{colors.cobalt-ink}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.field}"
    height: "54px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-ink-deep}"
  button-small:
    backgroundColor: "{colors.cobalt-ink}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.field}"
    height: "42px"
    padding: "0 16px"
  button-paper:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.field}"
    height: "54px"
  field-entry:
    backgroundColor: "{colors.band-soft-sand}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.sheet}"
    padding: "14px 16px"
  field-band:
    backgroundColor: "{colors.band-sand}"
    textColor: "{colors.print-navy}"
    padding: "14px 56px"
  chip:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.field}"
    padding: "3px 9px"
  close-field:
    backgroundColor: "{colors.cobalt-ink}"
    textColor: "{colors.sheet-white}"
---

# Design System: Showdown Helper

## Overview

**Creative North Star: "The Team List Sheet"**

The page is the team list sheet a VGC player hands the judge: a white printed form lying on a sand desk, ruled in navy, with everything the tool knows written in cobalt ink. Printed text is near-black navy; anything "filled in" (the product's answers, the facts, the install entries, the one action) is cobalt. The distinction is the whole grammar: navy is the form, cobalt is the pen.

Density is calm and ruled rather than carded. Sections are separated by heavy 2px navy rules, rows by 1px rules, and each section invents the form its question needs (a ruled figure row, a tick-box checklist, a printed-prompt and inked-answer grid). There are no gradients, glows, glass, soft shadows or rounded cards. Corners are square or 2px. Depth comes from tonal sand bands and rules only.

PRODUCT.md commits the palette to white, sand and cobalt, and commits to reduced-motion support and AA contrast; both are honored in the build.

**Key Characteristics:**
- White sheet (max 1240px) on a sand desk, bounded by 1px navy side rules.
- Navy for print, cobalt for ink; one committed cobalt field per page (the closing block).
- One grotesque, Archivo variable, used in two widths: normal and condensed-caps labels.
- Pen marks (rings, ticks) are drawn SVG strokes in a light cobalt over dark captures or cobalt over white, never a script face.
- Motion is written-in: text revealed left to right, rules drawn across, nothing loops.

## Colors

A three-family palette: sand desk, white paper, and navy-plus-cobalt ink, with no neutrals beyond them.

### Primary
- **Cobalt Ink** (frontmatter `cobalt-ink`): everything filled in. Buttons, entry text, answers in the Questions grid, the closing field background, focus outline, selection, link underline on hover.
- **Cobalt Ink Deep** (`cobalt-ink-deep`): button hover only.
- **Cobalt Pen Light** (`cobalt-pen-light`): the same pen where it writes over a dark panel capture; pen rings and marks drawn on screenshots.

### Neutral
- **Desk Sand** (`desk-sand`): the page margin behind the sheet; also the theme color.
- **Band Sand** (`band-sand`): shaded form fields: figure panels, question prompts, attachment frame, footer.
- **Band Soft Sand** (`band-soft-sand`): quiet fills: terminal/address entries, inline code, paper-button hover.
- **Sheet White** (`sheet-white`): the sheet, header strip, tick boxes.
- **Print Navy** (`print-navy`): all printed text and every rule.
- **Print Navy Secondary** (`print-navy-secondary`): field labels and fine print; 7:1 on white.

### Named Rules
**The Print and Ink Rule.** Navy is what the form says; cobalt is what was written into it. Never set body copy in cobalt, and never set a printed label in cobalt.

**The One Field Rule.** Cobalt fills a whole block only once per page, at the close. Elsewhere cobalt appears as text, a button, a hairline or a pen stroke.

## Typography

**Display Font:** Archivo (variable weight 100 to 900, width 62% to 125%; fallback Segoe UI, system-ui, sans-serif)
**Body Font:** Archivo, same family
**Label/Mono Font:** Archivo at 72% width for labels; the system mono stack (ui-monospace, Cascadia Mono, Consolas) for filled-in terminal and address entries

**Character:** A heavy, tightly tracked grotesque for printed headings against plain regular body, with a condensed-caps face reserved for form field labels. Mono appears only inside entry fields where the user types or copies a command.

### Hierarchy
- **Display** (800, clamp 38px to 72px, 0.98, -0.035em): the h1 and nothing else; balanced wrap.
- **Headline** (800, clamp 32px to 54px, 1.02, -0.03em): section h2; the closing h2 scales up to clamp 40px to 96px at the same leading.
- **Title** (700, clamp 22px to 28px, 1.15, -0.02em): h3 in guide rows and install steps.
- **Body** (400, 17px, 1.55, max 62ch): running copy; lede steps to clamp 18px to 21px; section intros 19px; guide and step copy 18px.
- **Label** (600, 13px, 0.12em, uppercase, 72% width): field labels that name an entry (Works on, Browser, Price, Repository, Terminal, Address bar). They sit with the entry they name.

### Named Rules
**The Field Label Rule.** A condensed-caps label exists only to name a filled-in entry beside or beneath it, as on a form. It never sits above a heading as a lead-in.

## Layout

A single white sheet, 1240px max, centered; under 1240px it gains a clamped 12 to 40px desk margin, and under 760px it goes full bleed with no side rules. Horizontal gutter is one token, clamp(20px, 4vw, 56px), used by every row and band. A 64px sticky header strip carries name, nav (hidden under 760px) and a small button over a 2px bottom rule.

Rhythm is ruled rows. Sections open with a 2px rule, then a block head on a 5fr / 7fr grid (heading left, intro right), then rows divided by 1px rules. Guide rows split 5fr text / 7fr sand figure panel; install rows use a 76px tick column, 5fr copy and 7fr entry; Questions is a two-column grid of prompt band over cobalt answer. The hero is 6fr copy / 5fr figure. Everything collapses to a single column at 860px (hero at 900px, Questions at 860px); entries strip tightens under 640px and 420px.

## Elevation & Depth

Flat, with no shadows anywhere. Depth is tonal: white sheet over sand desk, sand bands for fields over white, a near-black capture window (#14161e, 1px navy border) for real product screenshots. Navy rules at 1px and 2px do the structural work a shadow would.

### Named Rules
**The No Lift Rule.** Nothing floats. A hover changes color, underline or arrow position; it never raises a surface.

## Shapes

Square by default (0px), with 2px on buttons, chips, code, capture frames and screenshots. Borders are 1px navy for fields and 2px navy for section and header rules. Tick boxes are 52px squares with a 2px navy border. No pills, no circles except hand-drawn ring strokes, which are SVG paths with round caps.

## Components

### Buttons
- **Shape:** square-cornered (2px radius), 2px border matching the fill.
- **Primary:** cobalt fill, white 600 17px text, 54px tall, 0 24px padding, arrow icon (inline SVG, 2px stroke) at the end. Small variant is 42px tall, 15px text, in the header strip.
- **Hover / Focus:** fill and border deepen to Cobalt Ink Deep; the arrow shifts 4px right; active presses down 1px. Focus is a 3px cobalt outline with 3px offset (white on the cobalt close).
- **Paper:** white fill with cobalt text for use on the cobalt close; hover goes to Band Soft Sand.
- **Text link:** 600 weight with a 1.5px navy underline that thickens to 3px cobalt on hover.

### Navigation
Header strip: bold 19px product name left, 16px 500-weight links, cobalt underline that draws left to right on hover and focus. Nav links hide under 760px; the small button remains.

### Fields / Entries
Filled-in answers. The entry box is Band Soft Sand with a 1px navy border and cobalt mono text, labelled with a condensed-caps field label; the Questions grid is a Band Sand prompt over a cobalt 500-weight answer. The hero strip of three entries (Works on, Browser, Price) is cobalt text under condensed labels, divided by 1px rules.

### Chip
White fill, 1px cobalt border, cobalt 13px 600 text, 2px radius.

### Pen Marks (signature)
Rings and ticks are SVG strokes (7px light cobalt rings over dark captures; 4px cobalt ticks in white tick boxes) with round caps and joins, drawn on by dash offset on scroll-in. Never a handwriting typeface.

### Captured Panel Figures
Real extension screenshots sit in a Band Sand attachment frame (20px padding, 1px navy border) or a near-black capture window with 2px radius.

### Motion
Entrances are `rise` (14px up, fade, 0.7s, expo-out cubic-bezier(0.16, 1, 0.3, 1), stagger 70ms), `write` (clip-path reveal left to right, 0.9s, applied to cobalt entries), `draw-rule` (section rule scales in from the left, 1s) and `pen` strokes (0.9s, after 500ms). Nothing loops. Reduced motion shows final state with no transitions.

## Do's and Don'ts

### Do:
- **Do** set printed text and every rule in Print Navy (#17203a) and set only filled-in content in Cobalt Ink (#0047ab).
- **Do** open each section with a 2px navy rule and divide rows with 1px rules.
- **Do** give each section the form its question needs (figure row, checklist, prompt/answer grid) rather than repeating a card.
- **Do** keep radius at 0px or 2px.
- **Do** use Print Navy Secondary (#4a5470) for fine print so it stays at 7:1 on white.
- **Do** build new entrances from rise, write, draw-rule or pen, with the expo-out curve, and honor reduced motion.

### Don't:
- **Don't** use gradients, glows, glass, soft shadows, or rounded cards; the form is flat and ruled.
- **Don't** use a handwriting font or emoji for pen marks; marks are drawn SVG strokes.
- **Don't** fill more than one block with cobalt per page.
- **Don't** put condensed-caps labels above headings as a lead-in; they name entries only.
- **Don't** set body paragraphs in cobalt.
