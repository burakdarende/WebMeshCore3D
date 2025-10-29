// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING SYSTEM CONFIGURATION
// Mirrors the collider config approach: defaults, sample data, and helper utils
// ═══════════════════════════════════════════════════════════════════════════════

export const LIGHTING_CONFIG = {
  defaults: {
    ambient: {
      intensity: 0.5,
      color: "#ffffff",
      visible: true,
    },
    directional: {
      intensity: 0.8,
      color: "#ffffff",
      position: { x: 2, y: 4, z: 2 },
      target: { x: 0, y: 0, z: 0 },
      linkToCenter: true,
      castShadow: true,
      visible: true,
    },
    spots: [],
    points: [],
  },
};

export const DEFAULT_LIGHTS = {
  ambient: {
    intensity: 0.5,
    color: "#ffffff",
    visible: true,
  },
  directional: {
    intensity: 0.8,
    color: "#ffffff",
    position: { x: 2, y: 4, z: 2 },
    target: { x: 0, y: 0, z: 0 },
    linkToCenter: true,
    castShadow: true,
    visible: true,
  },
  spots: [
    {
      id: "spot1",
      intensity: 1.2,
      color: "#ffddaa",
      position: { x: -2, y: 3, z: 2 },
      target: { x: 0, y: 0, z: 0 },
      linkToCenter: true,
      angle: Math.PI / 6,
      penumbra: 0.2,
      distance: 10,
      decay: 1,
      castShadow: false,
      visible: true,
    },
  ],
  points: [
    {
      id: "point1",
      intensity: 0.6,
      color: "#aaffdd",
      position: { x: 2, y: 2, z: -2 },
      distance: 8,
      decay: 2,
      castShadow: false,
      visible: true,
    },
  ],
};

// Helper utils similar to ColliderUtils
export const LightingUtils = {
  generateId: (prefix = "light") =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

  createNewSpot: (position = { x: 0, y: 3, z: 0 }) => ({
    id: LightingUtils.generateId("spot"),
    intensity: 1.0,
    color: "#ffffff",
    position: { ...position },
    target: { x: 0, y: 0, z: 0 },
    linkToCenter: true,
    angle: Math.PI / 6,
    penumbra: 0.2,
    distance: 10,
    decay: 1,
    castShadow: false,
    visible: true,
  }),

  createNewPoint: (position = { x: 0, y: 2, z: 0 }) => ({
    id: LightingUtils.generateId("point"),
    intensity: 0.6,
    color: "#ffffff",
    position: { ...position },
    distance: 8,
    decay: 2,
    castShadow: false,
    visible: true,
  }),

  exportToJSON: (lights) => JSON.stringify(lights, null, 2),

  importFromJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (e) {
      console.error("Invalid lighting JSON:", e);
      return null;
    }
  },

  validateLightConfig: (cfg) => {
    // Basic structural validation
    if (!cfg) return false;
    const hasAmbient = cfg.hasOwnProperty("ambient");
    const hasDirectional = cfg.hasOwnProperty("directional");
    return hasAmbient && hasDirectional;
  },
};
