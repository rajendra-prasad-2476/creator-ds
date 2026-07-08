# Creator DS — Changelog

> Generated from `src/ds-changelog.ts` — do not edit by hand. Run `npm run ds:changelog`.

Current version: **v1.2.0**

## v1.2.0 — 2026-07-08

### Added
- **StatusBadge** — New semantic status pill (configured / not-configured / error / pending) with a fixed colour + icon + label mapping. Use instead of hand-composing a Badge with an icon. _(ds-parity: StatusBadge)_

## v1.1.0 — 2026-07-08

### Added
- **Blanket** — New overlay/scrim backdrop component — use behind Sliders, Sheets and Dialogs instead of a custom rectangle. _(ds-parity: Blanket)_
- **Tokens** — New --cds-blanket-overlay token (primary-surface-bold-alpha10) for overlay scrims.

### Changed
- **LinkCategoryTemplate** — Added an activeNavId prop so landing pages (e.g. Operations) highlight the correct LeftNav item.

### Fixed
- **Dialog · Sheet · AlertDialog** — Overlay backdrops now use the Blanket scrim token and drop the backdrop blur to match the Figma spec.
