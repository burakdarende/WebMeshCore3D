// ═══════════════════════════════════════════════════════════════════════════════
// COLLIDER SYSTEM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// Interactive 3D colliders with hover effects, animations, and link actions

export const COLLIDER_CONFIG = {
  // 🎯 Default collider settings
  defaults: {
    position: [0, 1, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    link: "",
    animation: null,
    hoverEffect: "scale", // "scale", "glow", "bounce", "none"
    visible: true,
    wireframe: true,
  },

  // 🎨 Visual settings
  visual: {
    wireframe: {
      color: "#00ff00",
      opacity: 0.6,
      linewidth: 2,
    },
    selected: {
      color: "#ffff00",
      opacity: 0.8,
      linewidth: 3,
    },
    hover: {
      color: "#ff0000",
      opacity: 0.9,
      scaleMultiplier: 1.1,
    },
  },

  // 🎮 Interaction settings
  interaction: {
    enableHover: true,
    enableClick: true,
    enableDrag: true,
    dragSensitivity: 0.01,
    scaleSensitivity: 0.1,
  },
};

// 📦 Default colliders data (can be overridden)
export const DEFAULT_COLLIDERS = [
  {
    id: "collider_2",
    position: [-0.78, 1.44, -1.12],
    scale: [1, 2, 1],
    rotation: [0, 0, 0],
    link: "cdasdasd",
    animation: "animation_1",
    hoverEffect: "glow",
    visible: true,
  },
];

// 🎭 Available animations (will be populated from GLTF)
export const AVAILABLE_ANIMATIONS = [
  { id: "idle", name: "Idle", duration: 2.0 },
  { id: "wave", name: "Wave", duration: 1.5 },
  { id: "bounce", name: "Bounce", duration: 1.0 },
  { id: "rotate", name: "Rotate", duration: 3.0 },
  // More animations will be auto-detected from GLTF files
];

// 🔧 Collider helper functions
export const ColliderUtils = {
  // Generate unique ID for new colliders
  generateId: () =>
    `collider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

  // Create new collider with defaults
  createNewCollider: (position = [0, 1, 0]) => ({
    id: ColliderUtils.generateId(),
    position: [...position],
    scale: [...COLLIDER_CONFIG.defaults.scale],
    rotation: [...COLLIDER_CONFIG.defaults.rotation],
    link: "",
    animation: null,
    hoverEffect: COLLIDER_CONFIG.defaults.hoverEffect,
    visible: true,
  }),

  // Generate JSON export for collider data
  exportToJSON: (colliders) => {
    return JSON.stringify(colliders, null, 2);
  },

  // Import colliders from JSON
  importFromJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error("❌ Invalid JSON format:", error);
      return [];
    }
  },

  // Validate collider data
  validateCollider: (collider) => {
    const required = ["id", "position", "scale", "rotation"];
    return required.every((field) => collider.hasOwnProperty(field));
  },
};
