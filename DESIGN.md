---
name: RAYZE
description: Rise with RAYZE.
colors:
  accent: "#e8241a"
  background: "#0a0a0a"
  surface: "#141414"
  text: "#fff"
  muted: "#9a9a9a"
  border: "#262626"
typography:
  display:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(72px, 10.6vw, 174px)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(40px, 5.1vw, 80px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(25px, 2.6vw, 42px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.13em"
rounded:
  sharp: "0"
spacing:
  gutter: "clamp(22px, 5vw, 88px)"
  section: "110px"
  section-mobile: "70px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.background}"
    rounded: "{rounded.sharp}"
    padding: "17px 22px"
  button-primary-hover:
    backgroundColor: "{colors.text}"
    textColor: "black"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sharp}"
    padding: "14px 16px"
  button-filter-selected:
    backgroundColor: "{colors.text}"
    textColor: "black"
    rounded: "{rounded.sharp}"
    padding: "10px 18px"
  service-action:
    rounded: "{rounded.sharp}"
    width: "56px"
    height: "56px"
  work-empty:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sharp}"
    padding: "60px"
---

# Design System: RAYZE

## Overview

**Creative North Star: "Rise with RAYZE."**

RAYZE is direct, expansive and editorial. Heavy typography, black negative space and the supplied angular red mark carry the identity. Fine dividers and varied section proportions give information a deliberate rhythm; the public site invites enquiries while private admin screens prioritize operating tasks.

The implementation expresses the owner's established brand commitments. It uses real supplied identity assets and truthful empty states while published project media and reviews are unavailable. This document records implemented visual behavior, not verification of production data, submissions or deployment.

**Key Characteristics:**

- Oversized uppercase headings and dash-prefixed overlines.
- One red accent, neutral surfaces and sharp corners.
- Asymmetric desktop composition that stacks on small screens.
- Underlined links, square arrow actions and a full-bleed red conversion section.
- Progressive motion with reduced-motion and pause support.

## Colors

The palette uses a single vivid red against dark neutral surfaces. Frontmatter preserves the canonical CSS token values.

### Primary

- **RAYZE Red:** brand mark, large headline emphasis, primary actions and conversion sections. Original portfolio photography may retain its genuine colors.

### Neutral

- **Deep Black:** page background and small text on red panels.
- **Raised Black:** service sections, form fields and empty states.
- **White:** primary text, selected filters and primary-button hover surfaces.
- **Secondary Gray:** descriptions, labels and readable field boundaries.
- **Divider Gray:** fine structural separators; not the default input outline.

**The One Accent Rule.** Use RAYZE Red as the only UI accent; do not invent additional accent colors or tonal palettes.

**The Readable Red Rule.** Use dark text for small text on red surfaces. White remains the main text color on dark surfaces. Process indices use Secondary Gray; large red typography and arrow artwork retain their emphasis.

## Typography

**Display Font:** Inter is the explicit temporary heading fallback, with Arial and sans-serif fallbacks. The required final heading family is licensed Delight Black (900), ExtraBold (800) and Bold (700). Delight files and license have not been supplied; do not label Inter as Delight or treat the font decision as complete for public launch.

**Body Font:** Inter, loaded through `next/font/local` from the implementation's local variable WOFF2. Body weight is regular; actions and labels use heavier weights from the same family.

**Character:** uppercase headings are dense, heavy and tightly spaced; sentence-case body copy stays open and readable. Overlines retain the owner's dash prefix.

### Hierarchy

- **Display:** hero-specific frontmatter scale; generic page H1 uses `clamp(56px, 7.8vw, 126px)`. Mobile hero uses `clamp(65px, 15.8vw, 110px)` and line height `0.94`.
- **Headline:** H2 uses the frontmatter scale; contextual process and CTA headings have their own fluid sizes.
- **Title:** H3 uses the frontmatter scale; compact list and admin titles reduce to task-appropriate sizes.
- **Body:** default frontmatter scale, with paragraph measure capped at `68ch`; descriptions use muted text and contextual sizes.
- **Label:** frontmatter scale, uppercase with dash-prefixed section overlines. Form labels remain sentence case (`13px`).

**The Honest Font Rule.** Keep the temporary Inter headings explicit until licensed Delight weights are available, and preserve the intended 900/800/700 hierarchy.

## Layout

The shared wrapper uses the fluid gutter in frontmatter and a maximum width (`1800px`). Sections use the recorded desktop and mobile spacing. Fine dividers organize the page without repeated boxed card grids.

Desktop introductions use a narrow label column beside a larger text column. Published work uses staggered unequal columns (`1.2fr 1fr`) and sized images (`4:3`). Services use horizontal numbered rows; process uses a heading column beside sequential steps. The red CTA spans the viewport. Admin uses a compact side navigation and a working content column.

At `1000px` and below, gaps and admin columns tighten. At `700px` and below, public navigation becomes an expandable menu, major content grids stack, work loses its stagger, form pairs become one column and admin navigation becomes a horizontal scroll row. The mobile hero mark sits in normal flow at the right (`85px` wide), preserving clear heading separation. Large screens (`1600px` and above) increase hero spacing.

## Elevation & Depth

The system is flat: no box-shadow vocabulary is implemented. Depth comes from the difference between page and raised surfaces, fine borders, large type, and framed real media. Do not add glow, glass effects or floating cards to create hierarchy.

## Shapes

UI corners are sharp. Buttons, fields, filters and containers use the zero-radius token. One-pixel outlines and straight dividers define interactive and structural boundaries. The supplied angular R mark keeps its original aspect ratio and color; it is not rebuilt as a CSS or SVG substitute.

## Components

### Buttons

Confident square actions use dark text on red with frontmatter padding and a minimum height (`58px`). Hover changes to a white surface with black text. Global keyboard focus uses a white outline (`2px`, offset `5px`); focus inside the red CTA uses Deep Black. Disabled buttons reduce opacity and indicate waiting.

### Text links and service actions

Text links use an understated bottom border, medium weight, a minimum interaction height (`44px`) and an arrow. Hover brightens the text and turns the border red; hover and keyboard focus move the arrow (`5px`). Square service actions switch to red with dark artwork on hover and focus. Their mobile size is `42px` by `44px`.

### Filters

Project filters are rectangular outlined buttons in a wrapping row. Selection uses a white background and black text and is exposed through `aria-pressed`. Filters are derived from the published projects passed to the component.

### Cards / Containers

Published projects are media-led articles without raised card chrome. Images have fixed proportions and clip restrained parallax within the article. Empty work uses a raised surface, an oversized inline arrow and a direct enquiry link; it does not simulate a project. General empty states use the same flat surface treatment.

### Inputs / Fields

Inputs use the raised surface and Secondary Gray border, frontmatter padding, white content and muted placeholders. Focus uses the shared visible outline and the caret uses red. Textareas resize vertically. Form messages remain readable text; labels stay associated with controls. File inputs and checkbox controls retain browser interaction semantics.

### Navigation

The supplied transparent red mark appears beside separate `RAYZE.` text; the image has decorative alternative text to avoid repeating the name. Desktop links use small body type (`13px`), generous gaps and red underline for the current page. The mobile menu is square and full-width, exposes expanded state and returns focus to its trigger on Escape. Public navigation and admin navigation remain separate.

### Motion and conversion

The hero has a short transform entrance. Section reveals and desktop service progression use scoped GSAP ScrollTrigger; desktop project images have restrained parallax. Essential content remains visible before animation initializes. The service marquee runs slowly (`38s`, linear) and the supplied mark drifts (`12s`, ease-in-out); both have a visible shared pause control and pause offscreen or when the page is hidden. Reduced motion disables animation, transitions, smooth scrolling and scrub effects, wraps the marquee into static text and hides duplicate content. Cleanup reverts GSAP and removes observers and listeners.

The closing conversion section uses the sole red accent, dark text and a large linked headline with an arrow. All enquiries route to the contact page, with selected service context where relevant.

## Do's and Don'ts

### Do:

- Do preserve the exact brand tokens, supplied mark and sharp corners.
- Do retain uppercase heading hierarchy and dash-prefixed overlines.
- Do use dark small text on red and visible keyboard focus on every interactive control.
- Do keep published media genuine and unavailable content truthful.
- Do preserve reduced-motion, pause, offscreen and hidden-page behavior.
- Do keep temporary Inter headings explicit pending licensed Delight.

### Don't:

- Don't add UI accent colors, pill controls, glow, glassmorphism or decorative blobs.
- Don't fabricate clients, testimonials, case studies, portraits or performance statistics.
- Don't replace the supplied mark, distort it, recolor it with filters or duplicate the wordmark.
- Don't hide essential content until JavaScript runs or trap scrolling.
- Don't treat visual review as proof that production integrations or deployment are verified.
