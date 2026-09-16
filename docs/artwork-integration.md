# Final artwork integration

Uses the nine original PNG files from `My-Pace-Codex-Handoff-v2/production-art` under `public/art/`. Their bytes are unchanged. The logo is the handoff-approved `public/logo-final.svg`. Reference sheets are not runtime assets.

## Preserved behavior

`App.jsx` only changes its presentation stylesheet import and shell class. Onboarding, goal library, profile schema, all six localStorage keys, legacy goal-ID handling, date/period keys, completion handlers, distance calculation, rewards and theme persistence remain unchanged from main at `5872444`.

Today renders existing weekly/monthly state through existing callbacks. Profile restores the historical GoalManager from `8d21b55`, using the same goal IDs and profile fields, including support for the singular legacy weeklyGoalId. Journey displays completion for each day of the current Monday–Sunday calendar week instead of using lifetime active days modulo eight.

## Validation

- `npm install`: passed, audit reported zero vulnerabilities.
- `npm run build`: passed, including PWA generation and public artwork URLs under `/my-pace/`.
- Local Windows sandbox blocks child processes. For local verification only, the optional Vite `net use` network-drive discovery was skipped in node_modules; no application/build configuration workaround is committed. GitHub Actions performs the normal clean build.
- All application JS/JSX parses successfully. Exact comparison confirms App business logic is unchanged.
- Browser checked at 390px and 430px: onboarding; three tabs; goal manager selection/save; daily, weekly, monthly and Special toggles; refresh persistence; light/dark/auto theme selection; reactive mascot; Journey and Profile artwork.
- Verified 3 daily goals = 70m including the 10m bonus, Special = 50m, weekly = 100m and monthly = 500m; aggregate = 720m. Five daily goals select the reward mascot.
- No browser console errors observed during the walkthrough.

## Visual limits and existing behavior

The supplied production candidates have small dimensions, white/translucent rectangular edges and some cropped character details, most noticeable on journey/sleep poses. They are retained unchanged rather than redesigned. Landscape text and crop also differ from the layout mockup. UI icons remain the existing emoji approach because separate production icon assets were not supplied.

Face Score and level formulas, onboarding defaults, and existing unimplemented notification/report/data-management actions are intentionally unchanged. This artwork pass does not invent business behavior for those controls.
