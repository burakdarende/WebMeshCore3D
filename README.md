# WebMeshCore3D — Advanced 3D Scene Framework

Professional 3D scene framework focused on performance, modularity and developer ergonomics.

> ⚠️ Security & production note: this project has been developed with AI assistance and active development; always audit and test before deploying to production.

## Quick summary

WebMeshCore3D is a modular React + Three.js starter/mini-framework for building production 3D scenes. It provides:

- A centralized configuration (`src/config/app-config.js`) for rendering, lighting, camera and debug flags
- Reusable systems (Camera, Lighting, Collider, Bloom/Postprocessing) that mount into the scene via `Scene_simple.jsx`
- A debug UI system (separate fixed DOM panels) that lets developers tune parameters live and export/import JSON presets
- Performance tooling (gl-bench based monitor + runtime resource estimates)

This README was updated to reflect recent changes (lighting JSON presets, performance monitor, debug UI gating, and postprocessing rework). See "Recent changes" below.

---

## How the system is organized (high level)

- `src/components/Scene_simple.jsx`: top-level orchestrator. Creates the `Canvas`, wires `DEVELOPER_CONFIG` and `DEBUG_UI_CONFIG`, and mounts systems and UI panels.
- Systems (in `src/components/systems/`):
  - `CameraSystem.jsx` — camera creation, orbit controls, auto-rotate, mouse-tracking and camera switching.
  - `LightingSystem.jsx` — creates ambient/directional/spot/point lights from runtime state and exposes a `window.lightingDebugData` API for the Lighting Debug UI.
  - `ColliderSystem.jsx` and `ColliderConfig.js` — collider data + utilities; provides import/export JSON helpers and runtime interaction handlers.
  - `BloomSystem.jsx` / PostProcessingEffect — builds the EffectComposer and conditionally attaches SMAA/FXAA passes depending on runtime `qualitySettings`.
- Debug UI (in `src/components/ui/`): fixed DOM panels controlled by `UILayoutManager.jsx`. Panels are gated by `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE` and the layout manager.

Runtime flow: config → Scene_simple → systems → scene objects

Important implementation details:

- Quality settings no longer force a full Canvas remount. `qualitySettings` are passed down to `BloomSystem` and postprocessing composer is rebuilt in a controlled way when settings change.
- FXAA/SMAA passes and uniforms are created or updated at runtime depending on quality presets.
- DOM manipulations for debug UI and perf overlay are performed client-side inside `useEffect` hooks to avoid SSR issues.

---

## Recent changes (what I updated/added)

- PerformanceMonitor: integrated `gl-bench` and added a small diagnostic overlay that estimates texture+geometry sizes and reads `renderer.info` and `performance.memory` when available.
- Lighting JSON workflow:
  - `src/components/systems/LightingConfig.js` added (defaults, utils, JSON import/export helpers).
  - `src/data/lights.json` sample added (use it as a source-of-truth or paste into `public/data/` for runtime fetching).
  - `LightingDebugUI.jsx` now has a "Show JSON" editor (copy/apply) so you can export current lighting state and apply JSON directly at runtime (uses `window.lightingDebugData.setAdvancedLights`).
- Collider UI and config:
  - `ColliderConfig.js` provides the collider defaults and `ColliderUtils` (export/import JSON, validation).
  - `ColliderDebugUI.jsx` supports copy/paste JSON like the lighting UI.
- Debug gating:
  - Debug panels are controlled via `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE` in `src/config/app-config.js`. Several panels now accept `DEVELOPER_CONFIG`/`DEBUG_UI_CONFIG` props and early-return `null` when the developer flag is off.
- Postprocessing & Quality:
  - Removed the Canvas key-based remount and in-page reloads used previously. Composer rebuilds on `qualitySettings` changes instead.
  - SMAA and FXAA passes are toggled/updated at runtime based on the active visual preset.

If you deployed to Vercel and a debug panel was missing: check `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE` (production builds typically set it to false). Collider/Lighting UIs intentionally gate on this flag.

---

## Installation & dev server

Clone and install dependencies:

```powershell
git clone https://github.com/burakdarende/WebMeshCore3D.git
cd WebMeshCore3D
npm install --legacy-peer-deps
```

Start the dev server:

```powershell
npm run dev
```

On production hosting (Vercel/Netlify) ensure you set `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE=false` in the deployed config (or via environment variable wiring) if you do not want debug panels in prod.

---

## Lighting JSON workflow (how to save/apply presets)

- Use the Lighting Debug UI: open the panel → "Show JSON" → Copy JSON to clipboard.
- Paste the JSON into a repository file to save as a preset. Two recommended locations:
  - `src/data/lights.json` — source file for repository presets (editable in repo). Good for development and version control.
  - `public/data/lights.json` — if you want the app to fetch a preset at runtime in production, put the file here and fetch `/data/lights.json` from `LightingSystem` (not yet automatic).
- To apply a JSON preset at runtime: paste it into the Lighting Debug UI editor and click "Apply JSON".

Notes: `LightingSystem` persists live settings to `localStorage` under the key `webmesh-lighting-settings`. Loading from JSON will overwrite that stored state until you reset cache.

---

## External libraries and references

This project relies on and integrates several community projects — please check their docs for deeper understanding and updates:

- Three.js — https://threejs.org
- React Three Fiber (R3F) — https://github.com/pmndrs/react-three-fiber
- Drei helpers — https://github.com/pmndrs/drei
- PMNDRS postprocessing (postprocessing effects) — https://github.com/pmndrs/postprocessing
- gl-bench — performance monitor (npm: `gl-bench`) — https://www.npmjs.com/package/gl-bench

These packages evolve quickly; check compatibility when upgrading.

---

## Troubleshooting

- Debug panels not visible in deployed site: ensure `DEVELOPER_CONFIG.ENABLE_DEBUG_MODE` is true (or set the specific panel flag if you add granular flags).
- GLBench shows 00 FPS or no DOM: confirm the `gl-bench` package is present and was imported as the distribution build; also verify `window`/`document` are available (client-only).
- Large JS heap reported (~800MB): use Chrome DevTools heap snapshots to find retained objects, and consider lowering `VISUAL_CONFIG.quality.pixelRatio` or disabling high-res textures.
- Lighting JSON fails to apply: open devtools console to see parse errors; the editor shows alerts for invalid JSON.

---

## Project structure (updated)

```
src/
├── components/
│   ├── systems/           # Camera, Bloom/PostProcessing, Lighting, Collider, PerformanceMonitor
│   ├── ui/                # Debug UI panels and layout manager
│   └── Scene_simple.jsx   # Main scene orchestrator
├── config/
│   └── app-config.js      # Centralized configuration (DEVELOPER_CONFIG, VISUAL_CONFIG...)
├── data/
│   └── lights.json        # Example lighting preset (edit & move to public/ for runtime)
├── public/
│   └── models/            # Static assets (GLB/GLTF) — used by useLoader
└── utils/
    └── helpers.js
```

---

## Contributing & notes for maintainers

- When changing systems that manipulate the DOM (debug UI, GLBench), ensure the code runs client-side inside `useEffect` to avoid SSR errors.
- Keep postprocessing construction deterministic and rebuild composer only when necessary (quality settings) — avoid forcing full Canvas remounts.
- If you expose new window debug APIs (e.g. `window.lightingDebugData`), document the contract (functions available) and keep cleanup on unmount.

If you'd like, I can also:

1. Move `src/data/lights.json` to `public/data/lights.json` and add a fetch-on-start in `LightingSystem` to seed the defaults.
2. Add a small CLI/dev script to export current lighting presets into `src/data/lights.json` automatically.

---

## License

MIT — see `LICENSE`.

---

If you'd like more detail on any part of the README (examples for lighting JSON format, exact debug API surface, or a developer quick-start), tell me which section and I'll expand it.

- ⭐ Starring the repository
- 🐛 Reporting issues and bugs
- 💡 Suggesting new features
- 📢 Sharing with your network
- 💰 [Sponsoring development](https://github.com/sponsors/burakdarende)

---

### 🏆 Why Choose WebMeshCore3D?

- **Zero Dependencies on Commercial Services** - Complete ownership
- **Enterprise-Grade Architecture** - Scales with your business
- **Professional Quality Output** - Industry-standard rendering
- **Developer-Centric Design** - Built by developers, for developers
- **Production-Tested** - Used in real-world applications
- **Comprehensive Documentation** - Everything you need to get started
- **Active Maintenance** - Regular updates and improvements
- **Advanced Camera System** - Professional-grade camera controls with auto-rotate, lock, and mouse tracking
- **Centralized Configuration** - Single config file controls entire system
- **Modern UI Components** - Glass morphism debug panels with minimize/maximize
- **Mutual Exclusion Logic** - Smart feature conflict prevention
- **Real-time Parameter Control** - Live adjustments without code changes

_Built with precision engineering for the modern web_
