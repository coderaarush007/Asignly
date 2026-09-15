---
name: Focus Desk
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-metric-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-eyebrow:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.005em
  label-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes a distilled, calm, and hyper-structured digital workspace engineered specifically for university students managing demanding academic loads. Drawing deeply from the disciplined restraint of Swiss graphic design and the refined utilitarianism of tools like Linear, Notion, and Things, the system strips away cognitive clutter to prioritize deep work, assignment clarity, and spatial tranquility.

The brand persona is quiet, methodical, and empowering. Rather than inducing panic around deadlines, the UI acts as a digital sanctuary—an orderly studio desk cleared of distractions. Micro-interactions are deliberate and crisp, signaling state changes through subtle opacity shifts and border illumination rather than ostentatious motion. Whitespace is treated as an active architectural element, framing task lists, schedules, and metrics into scannable, tension-free reading planes.

## Colors

The palette operates under strict hierarchical discipline. The foundational canvas relies on `#F8FAFC`, paired with pure `#FFFFFF` elevated card surfaces and hair-line border definitions to create clear spatial separation without jarring contrast. Pure dark accents (`#0F172A`) ground key focal points, sidebars, and critical action states.

### Palette Architecture
- **Primary Interactive**: `#4F46E5` serves as the primary action and focus indicator, paired with a deeper hover state `#3525CD` and an ultra-subtle tint `#EEF2FF` for active selection backgrounds and hover fills.
- **Typography & Structure**: `#0F172A` delivers crisp, ink-like contrast for titles and inputs; `#64748B` handles metadata, secondary labels, and descriptive copy; `#94A3B8` provides muted presence for inactive counters and placeholder cues.
- **State Semantics**: Overdue and critical alerts utilize `#EF4444`, impending deadlines rely on `#F59E0B`, completed states shine in `#10B981`, and dynamic notices leverage `#3B82F6`.
- **Subject Taxonomies**: Curated chromatic identifiers allow rapid visual tagging without visual noise: Physics (`#6366F1`), Mathematics (`#06B6D4`), Chemistry (`#10B981`), Programming (`#8B5CF6`), BEEE (`#F59E0B`), and English (`#EC4899`). Each subject badge pairs its core hex with a 10% opacity wash background and a matching solid text label.

## Typography

The type system relies on Plus Jakarta Sans throughout, leveraging its clean geometric proportions, high x-height, and open counters to maintain legibility under high information density. 

Hierarchy is established through tight tracking on bold, compact titles and deliberate vertical rhythm. Metric displays utilize a condensed negative tracking (`-0.03em`) to anchor dashboard progress widgets without sprawling horizontally. Eyebrow headers are strictly uppercase with widened letter-spacing (`0.06em`) to establish crisp section boundaries for assignments, timetable blocks, and syllabi overviews.

## Layout & Spacing

The dashboard operates on an adaptive 12-column grid system paired with strict 4px/8px modular spacing increments. On desktop viewports (1280px+), the interface adopts a fixed collapsible toolrail (240px) accompanied by a dynamic content canvas flanked optionally by an contextual study drawer (360px). 

Layout modules utilize structured horizontal and vertical bounding lines. Responsive behavior is split across three primary tiers:
- **Desktop (1024px and above)**: Full 12-column layout with 24px gutters and 32px canvas padding. Multi-pane task list and deadline matrices align side-by-side.
- **Tablet (768px – 1023px)**: 8-column layout with 20px gutters and 24px canvas margins. Secondary metadata collapses into drawer layers or bottom sheets.
- **Mobile (below 768px)**: 4-column layout with 16px gutters and 16px lateral canvas margins. Study streams reflow into single vertical stacks with horizontal edge-to-edge category pills.

## Elevation & Depth

Visual hierarchy rejects heavy, muddy dropshadows in favor of a layered paper model refined through hairline borders and ambient, diffuse light. Surfaces are rendered flat against the `#F8FAFC` canvas using distinct surface-container treatments.

- **Level 0 (Canvas Base)**: `#F8FAFC`, no shadow, zero elevation.
- **Level 1 (Card & Module Surfaces)**: Pure `#FFFFFF` surface enclosed by a 1px solid border (`rgba(15, 23, 42, 0.06)`), augmented by a micro-ambient shadow: `0px 1px 2px rgba(15, 23, 42, 0.04), 0px 4px 8px -2px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hovered Cards & Segmented Popovers)**: `#FFFFFF` surface, 1px border (`rgba(79, 70, 229, 0.2)` on active hover), elevated by `0px 4px 12px -2px rgba(15, 23, 42, 0.06), 0px 2px 4px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals, Overlays & Command Bars)**: `#FFFFFF` surface, 1px border (`rgba(15, 23, 42, 0.08)`), cast over an ultra-light backdrop blur (`backdrop-filter: blur(8px); background: rgba(15, 23, 42, 0.25)`), sustained by a deep ambient cast: `0px 12px 32px -4px rgba(15, 23, 42, 0.12), 0px 4px 8px -2px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system applies a disciplined geometric hierarchy across radii to create a modern, human SaaS tactile feeling:
- **Interactive Micro-Surfaces**: Primary buttons, ghost triggers, text inputs, search fields, and dropdown targets share a unified corner radius of `10px` to `12px` (`rounded-lg`), ensuring form fields and control buttons align with harmonious boundary silhouettes.
- **Structural Modules**: Task cards, analytics containers, schedule panels, and dialog sheets use `14px` to `16px` (`rounded-xl`), creating a soft envelope around structured lists and data tables.
- **Pills & Status Indicators**: Subject tags, priority markers, count chips, and avatars employ `9999px` full-capsule rounding, immediately differentiating functional meta-indicators from clickable structural cards.

## Components

### Buttons
- **Primary**: Solid `#4F46E5` fill with `#FFFFFF` text, `11px` corner radius, horizontal padding of `16px`, vertical height of `40px` (`36px` compact). Resting state carries no shadow; hover transitions background to `#3525CD` with a 150ms ease curve.
- **Secondary / Subtle**: `#FFFFFF` background with a 1px border in `rgba(15, 23, 42, 0.08)`, text in `#0F172A`. Hover transitions background to `#F8FAFC` and border color to `rgba(15, 23, 42, 0.16)`.
- **Ghost / Action Icon**: Transparent background, text/icon in `#64748B`. Hover state applies `#EEF2FF` fill with `#4F46E5` icon tint.

### Badges & Subject Chips
- Rendered in a strict capsule (`rounded-full`) form, `24px` height, `8px` horizontal padding.
- Built using a dual-color token method: 10% opacity background wash of the subject token with 100% solid foreground typography (`label-badge` style). For example, Mathematics uses `rgba(6, 182, 212, 0.1)` surface with `#06B6D4` text.
- Overdue chips apply a gentle pulse dot (`6px` diameter solid red `#EF4444`) alongside a pastel `#FEF2F2` background.

### Input Fields & Search Bars
- Resting state: `#FFFFFF` fill, 1px outline in `rgba(15, 23, 42, 0.1)`, `10px` border radius, text in `body-md` (`#0F172A`), placeholder text in `#94A3B8`.
- Focus state: Border transitions to `#4F46E5`, supplemented by a 3px soft focus ring in `rgba(79, 70, 229, 0.15)`. No ambient shadow.
- Leading shortcuts (e.g., `⌘K`) use monospaced neutral styling inside a `#F1F5F9` capsule.

### Cards & Assignment Rows
- **Card Containers**: Pure `#FFFFFF` background, 1px hairline border (`rgba(15, 23, 42, 0.06)`), `16px` border radius, internal padding of `20px`.
- **Assignment List Item**: Flat minimalist rows. Separated by `1px` borders in `#F1F5F9`. Hovering shifts row background to `#F8FAFC` with an indented left border accent (`3px` solid `#4F46E5` for active selection).

### Checkboxes & Completion Triggers
- Unchecked: `18px` circular or soft-square (`6px` radius) ring with `1.5px` border in `#CBD5E1`. Background is transparent.
- Checked: `#10B981` solid fill with an inset `#FFFFFF` checkmark, triggering a single, subtle spring pop micro-interaction.

### Academic Specifics
- **Progress Gauge**: Minimal track bar (`6px` height, `#E2E8F0` fill) with an inner indicator in `#4F46E5` or `#10B981` (at 100%).
- **Pomodoro / Focus Desk Timer**: Dark-surface widget `#0F172A` with `#FFFFFF` tabular metrics (`display-metric`), flanked by low-contrast secondary buttons in `rgba(255, 255, 255, 0.12)`.