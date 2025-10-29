# Contributing to WebMeshCore3D

# Thanks for wanting to contribute to WebMeshCore3D — contributions, bug reports and documentation fixes are very welcome. This file summarizes the repo-specific workflows, rules and expectations so reviews are fast and changes are safe.

If you are here to help with features or fixes, please read the short checklist below before opening a PR.

## Quick start / development setup

```powershell
git clone https://github.com/burakdarende/bdr_room.git
cd bdr_room
npm install --legacy-peer-deps
# Start dev server
npm run dev
# Open http://localhost:3000
```

Notes:

- The project uses client-only DOM operations in several debug systems (PerformanceMonitor / LightingDebugUI). Keep DOM access inside `useEffect` to avoid SSR errors.
- Many debug panels are gated by `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE` in `src/config/app-config.js`. By default this is `true` in development; make sure not to enable it on production deploys.

## Reporting bugs & requesting features

- Search existing issues first.
- For bugs include: browser, OS, steps to reproduce, expected vs actual, console errors and screenshots when relevant.
- For feature requests include a short use case, suggested API shape and any UX mockups or examples.

## Contributing changes (PR workflow)

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make small, focused commits. Use conventional commit prefixes (feat:, fix:, docs:, refactor:, perf:).
3. Run the dev server and test in both dev and production builds when applicable.
4. Push your branch and open a Pull Request describing:
   - What changed and why
   - How to test locally
   - Any migration steps or breaking changes

### PR checklist (what reviewers will check)

- [ ] Project builds (`npm run build` / `next build`) without errors
- [ ] No console warnings or runtime errors in common flows
- [ ] No debug-only flags accidentally enabled for production
- [ ] New UI changes are accompanied by screenshots or short recordings
- [ ] Tests added/updated if the change introduces logic that can be unit-tested

## Project conventions & gotchas

- Debug UI panels (files under `src/components/ui/`) are mounted by `UILayoutManager.jsx` and are only visible when `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE` is set. To avoid accidental production leakage, prefer environment-controlled flags (e.g. `NEXT_PUBLIC_ENABLE_DEBUG_UI`).
- Postprocessing and quality settings: don't force a Canvas remount for runtime quality changes; update the composer or pass new props and rebuild composer when needed.
- DOM access: always guard `document`/`window` usage with `typeof window !== 'undefined'` and call inside `useEffect`.
- When exposing debug helpers via `window.*` (eg. `window.lightingDebugData`), document the shape and clean them on unmount.

## Lighting JSON presets (how to add / use)

We added a runtime lighting JSON workflow so contributors can export/import lighting presets similar to colliders:

- Example preset file: `src/data/lights.json` (sample included). For runtime fetching place presets in `public/data/lights.json` and fetch `/data/lights.json` from `LightingSystem`.
- Workflow:
  1. Open Lighting Debug UI → click "Show JSON" → Copy JSON
  2. Paste into `src/data/lights.json` or `public/data/lights.json` and commit the change
  3. (Optional) Implement an automatic loader in `LightingSystem` to fetch presets from `public/` on startup — ask if you want a helper PR for this.

JSON shape is the `advancedLights` object used by `LightingSystem` (ambient, directional, spots[], points[]). Use the editor in the Debug UI to validate and apply JSON at runtime.

## Debug & performance notes

- PerformanceMonitor uses `gl-bench` to collect FPS and basic metrics. Ensure `gl-bench` is imported from the distribution build (`gl-bench/dist/gl-bench`) so the constructor is available.
- If you see unusually large JS heap sizes, use Chrome DevTools heap snapshots to find retained objects. Common causes: large parsed GLTF intermediate buffers, retained DOM nodes, or per-frame allocations that are not pooled.

## Coding standards

- Prefer small, well-tested commits. Keep PRs focused to speed review.
- Use descriptive variable names and add comments for complex math/3D logic.
- Avoid global side-effects; prefer passing props or using small, documented window debug APIs.

## Tests

There are no automated tests included yet. If you add logic that can be unit tested (utils, parsers), please include Jest tests and update CI.

## Communication

- For quick questions open a short Discussion or create a draft PR and tag maintainers.
- Use the issue templates when reporting large bugs with reproduction steps.

## Code of conduct

- Be respectful and constructive. Follow GitHub community guidelines.

---

Thanks — your contributions make this project better. If you'd like, I can also add a small dev script to export current lighting presets into `src/data/lights.json` automatically or move sample presets into `public/data/` and wire a fetch-on-start in `LightingSystem`.
