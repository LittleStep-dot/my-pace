# Final artwork integration

Uses the nine production PNG files from `My-Pace-Codex-Handoff-v2/production-art` under `public/art/`. Character alpha mattes and the Profile background lettering were corrected in place; no reference sheet is used at runtime. The logo is the handoff-approved `public/logo-final.svg`.

## Preserved behavior

The current product UI exposes Daily Goals and Special Quest. All six localStorage keys, legacy weekly/monthly records, completion history, distance calculation, rewards and theme persistence remain backward-compatible.

Journey counts unique active dates from the current Monday–Sunday week using Daily Goal history or Special Quest history. Profile and Today display the same `totalMeters` value as Journey. No separate weekly counter is stored.

## Validation

- `npm install`: passed, audit reported zero vulnerabilities.
- `npm run build`: passed, including PWA generation and public artwork URLs under `/my-pace/`.
- Local Windows sandbox blocks child processes. For local verification only, the optional Vite `net use` network-drive discovery was skipped in node_modules; no application/build configuration workaround is committed. GitHub Actions performs the normal clean build.
- All application JS/JSX parses successfully. Exact comparison confirms App business logic is unchanged.
- Daily completion remains +20m, the third Daily completion keeps the +10m bonus, and Special Quest remains +50m. Legacy weekly/monthly rewards remain included in historical distance.
- No browser console errors observed during the walkthrough.

## Visual limits and existing behavior

Character alpha edges are cleaned and the production canvases are doubled for mobile rendering. `char-sleep.png` contains no fixed Z; the app renders one reduced-motion-aware HTML/CSS Z animation. Profile banner lettering is HTML so it cannot be cropped with the background.

Face Score is removed. The existing distance-driven level calculation remains unchanged. Existing unimplemented notification/report/data-management actions remain outside this artwork and UI correction.
