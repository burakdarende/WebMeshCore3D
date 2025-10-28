// ═══════════════════════════════════════════════════════════════════════════════
// WebMeshCore3D v1.0 by Burak Darende - https://burakdarende.com
//
// DEVELOPER & DEBUG CONFIGURATION
// CENTRAL CONFIGURATION FILE
// All system settings are consolidated in this file.
// Developers can configure the entire system by editing this file.
// ═══════════════════════════════════════════════════════════════════════════════
import * as THREE from "three";

export const DEVELOPER_CONFIG = {
  // 🐛 Master switch for all debug features
  // Controls ALL debug UI panels: Camera, Bloom, Lighting, Collider debug interfaces
  ENABLE_DEBUG_MODE: true, // Set to false for production deployment to hide ALL debug UI
  // 📝 Console logging for materials and setup
  // ⚠️ IMPORTANT: Set to false for production to hide ALL console logs!
  // Controls: material analysis, camera switching, setup logs, WebGL errors
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 DEBUG UI LAYOUT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const DEBUG_UI_CONFIG = {
  // 📏 Panel dimensions
  panelWidth: 320, // Standard width for all panels
  panelGap: 120, // Gap between panels
  bottomMargin: 20, // Distance from bottom of screen
  leftMargin: 20, // Distance from left edge

  // 🎯 Calculate panel positions dynamically
  getPanelPosition: (panelIndex) => {
    const baseLeft = DEBUG_UI_CONFIG.leftMargin;
    const panelSpacing = DEBUG_UI_CONFIG.panelWidth + DEBUG_UI_CONFIG.panelGap;
    return baseLeft + panelIndex * panelSpacing;
  },

  // 📊 Panel registry (for future expansion)
  panels: {
    CAMERA_DEBUG: { index: 0, color: "#00ff00", icon: "📷" },
    BLOOM_DEBUG: { index: 1, color: "#ff9500", icon: "🌟" },
    LIGHTING_DEBUG: { index: 2, color: "#ffff00", icon: "💡" },
    QUALITY_DEBUG: { index: 3, color: "#00ffff", icon: "⚙️" },
    COLLIDER_DEBUG: { index: 4, color: "#ff00ff", icon: "🎯" },
    // 🚀 Future panels can be added here:
    PERFORMANCE_DEBUG: { index: 5, color: "#ff0080", icon: "⚡" },
    MATERIAL_DEBUG: { index: 6, color: "#00ffff", icon: "🎨" },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📷 CAMERA CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const CAMERA_CONFIG = {
  // 📷 Camera position and field of view
  position: [5, 3.76, 4.86], // [x, y, z] - Change this to your desired camera position

  // 🎯 Focus target (where the camera looks at)
  target: [0.46, 0.77, -0.27], // [x, y, z] - Change this to your desired focus point

  // 📐 Camera projection type
  perspective: true, // true = Perspective camera, false = Orthographic camera

  // 🔍 FOV Settings for both camera types
  fov: {
    perspective: {
      default: 50, // Default FOV for perspective
      min: 10, // Minimum FOV (telephoto)
      max: 120, // Maximum FOV (wide angle)
    },
    orthographic: {
      default: 1.7, // Default zoom for orthographic
      min: 0.1, // Minimum zoom (zoomed out)
      max: 3.0, // Maximum zoom (zoomed in)
    },
  },

  // 📏 Orthographic camera settings (only used when perspective = false)
  orthographic: {
    left: -5,
    right: 5,
    top: 5,
    bottom: -5,
    zoom: 0.8, // Lower zoom for wider view
    frustumSize: 5, // Smaller frustum for better proportion
  },

  // 🎮 OrbitControls settings
  minDistance: 2,
  maxDistance: 12,
  maxPolarAngle: Math.PI / 1.8, // Prevent camera from going below ground
  minPolarAngle: 0, // Allow full rotation
  enableDamping: true,
  dampingFactor: 0.05,

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🚀 ADVANCED CAMERA FEATURES
  // ═══════════════════════════════════════════════════════════════════════════════

  // 🔄 Auto Rotate Settings
  autoRotate: {
    enabled: false, // Enable auto rotate by default
    speed: {
      default: 2.0, // Default rotation speed
      min: 0.1, // Minimum speed
      max: 5.0, // Maximum speed
      step: 0.1, // Speed adjustment step
    },
    direction: {
      default: "right", // Default direction: "left" or "right"
      options: ["left", "right"], // Available directions
    },
  },

  // 🔒 Camera Lock Settings
  cameraLock: {
    enabled: false, // Enable camera lock by default
    disableControls: true, // Disable OrbitControls when locked
    showIndicator: true, // Show lock indicator in UI
  },

  // 🎯 Mouse Tracking Settings
  mouseTracking: {
    enabled: false, // Enable mouse tracking by default
    intensity: {
      default: 1.0, // Default intensity
      min: 0.1, // Minimum intensity
      max: 2.0, // Maximum intensity
      step: 0.1, // Intensity adjustment step
    },
    speed: {
      base: 0.1, // Base rotation speed multiplier
      multiplier: 1.0, // Additional speed multiplier
    },
    sensitivity: {
      threshold: 0.001, // Minimum mouse movement to trigger rotation
      damping: 0.95, // Movement damping for smoothness
    },
    // 🎮 Position shifting with keyboard
    positionShift: {
      enabled: true, // Enable position shifting with 3 and 4 keys
      step: 0.5, // Distance to shift camera position
      keys: {
        left: "3", // Key to shift camera left
        right: "4", // Key to shift camera right
      },
    },
    // 🚫 Disable OrbitControls when mouse tracking is active
    disableOrbitControls: true, // Disable zoom, pan, rotate when mouse tracking is on
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🌟 VISUAL & RENDERING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const VISUAL_CONFIG = {
  // 🏆 Quality Presets (change this for different performance levels)
  qualityPreset: "high", // "low", "medium", "high", "ultra"

  // 🎨 Render Quality Settings (auto-configured based on preset)
  qualityPresets: {
    low: {
      antialias: false,
      multisampling: 0,
      shadowMapSize: 512,
      shadowType: THREE.BasicShadowMap,
      anisotropy: 1,
      enableSMAA: false,
      enableFXAA: false, // Basic FXAA for low-end devices
      enablePMNDRS: false, // Advanced PMNDRS postprocessing
      pixelRatio: 1,
    },
    medium: {
      antialias: true,
      multisampling: 2,
      shadowMapSize: 1024,
      shadowType: THREE.PCFShadowMap,
      anisotropy: 2,
      enableSMAA: false,
      enableFXAA: true, // FXAA for better performance
      enablePMNDRS: false,
      pixelRatio: 1.5, // Static for SSR
    },
    high: {
      antialias: true,
      multisampling: 4,
      shadowMapSize: 1024,
      shadowType: THREE.PCFSoftShadowMap,
      anisotropy: 4,
      enableSMAA: true,
      enableFXAA: false,
      enablePMNDRS: true, // Advanced PMNDRS postprocessing
      pixelRatio: 2, // Static value for SSR compatibility
    },
    ultra: {
      antialias: true,
      multisampling: 8,
      shadowMapSize: 2048,
      shadowType: THREE.PCFSoftShadowMap,
      anisotropy: 8,
      enableSMAA: true,
      enableFXAA: false,
      enablePMNDRS: true,
      pixelRatio: 2, // Static value for SSR compatibility
    },
  },

  get quality() {
    return this.qualityPresets[this.qualityPreset];
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🌟 BLOOM SYSTEM CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════

  bloom: {
    // 🎛️ Interactive Controls (visible in debug UI when enabled)
    threshold: 0.1, // How bright pixels need to be to glow (0.0 - 1.0)
    strength: 0.1, // Intensity of the glow effect (0.0 - 3.0)
    radius: 0.22, // Spread of the glow (0.0 - 1.0)
    exposure: 1.0, // Bloom exposure level

    // ⚙️ Technical Settings
    mipmapBlur: false, // Use mipmap blur for better performance
    luminanceThreshold: 0.1, // Luminance threshold for selective bloom
    luminanceSmoothing: 0.025, // Smoothing factor for luminance threshold
    intensity: 1.0, // Overall bloom intensity multiplier
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎨 Backward Compatibility - Old structure for existing components
  // ═══════════════════════════════════════════════════════════════════════════════
  background: "#1a1a2e",
  environment: "city",
  ambientLight: {
    color: "#ffffff",
    intensity: 0.6,
  },
  keyLight: {
    position: [10, 10, 5],
    color: "#ffffff",
    intensity: 1.2,
  },
  fillLight: {
    position: [-5, 5, -5],
    color: "#87CEEB",
    intensity: 1.0,
  },
  rimLight: {
    position: [0, 5, -10],
    color: "#FFA500",
    intensity: 1.0,
  },
  get quality() {
    return this.qualityPresets[this.qualityPreset];
  },

  // 🎨 Material Settings
  materials: {
    // 📱 Default material properties
    default: {
      roughness: 0.7,
      metalness: 0.1,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
    },

    // 🔮 Environment mapping
    environment: {
      enabled: true,
      intensity: 1.0, // Environment map intensity
    },
  },

  // 🎬 Animation Settings
  animation: {
    // ⏱️ Global animation settings
    timeScale: 1.0, // Animation speed multiplier
    autoStart: true, // Start animations automatically

    // 🎭 Transition settings
    transitions: {
      duration: 0.3, // Default transition duration (seconds)
      easing: "easeInOut", // Default easing function
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 CONTROLS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTROLS_CONFIG = {
  // ⌨️ Keyboard Controls
  keyboard: {
    // 📷 Camera movement
    cameraMove: {
      forward: "KeyW",
      backward: "KeyS",
      left: "KeyA",
      right: "KeyD",
      up: "KeyE",
      down: "KeyQ",
      speed: 0.1, // Movement speed multiplier
    },

    // 🎯 Target movement (with Shift)
    targetMove: {
      modifier: "ShiftLeft", // Hold Shift for target movement
      speed: 0.05, // Target movement speed
    },

    // 🔍 FOV/Zoom controls
    fov: {
      increase: "Digit2", // Zoom out / increase FOV
      decrease: "Digit1", // Zoom in / decrease FOV
      speed: 2, // FOV change speed
    },

    // 🎬 Mode switching
    modes: {
      cameraType: "KeyC", // Switch between perspective/orthographic
      focusMode: "KeyG", // Enter focus manipulation mode
      cancel: "Escape", // Cancel current operation
    },

    // 🧭 Axis constraints (in focus mode)
    axes: {
      x: "KeyX", // Constrain to X axis
      y: "KeyY", // Constrain to Y axis
      z: "KeyZ", // Constrain to Z axis
    },
  },

  // 🖱️ Mouse Controls
  mouse: {
    // 🎪 Orbit controls
    orbit: {
      enableRotate: true,
      enableZoom: true,
      enablePan: true,
      autoRotate: false,
      autoRotateSpeed: 2.0,
      rotateSpeed: 1.0,
      zoomSpeed: 1.0,
      panSpeed: 1.0,
    },

    // 🎯 Focus manipulation
    focus: {
      sensitivity: 0.01, // Mouse sensitivity for focus dragging
      snapThreshold: 0.1, // Snap to grid threshold
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎪 PERFORMANCE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const PERFORMANCE_CONFIG = {
  // 🏃‍♂️ Frame Rate Settings
  fps: {
    target: 60, // Target FPS
    adaptive: true, // Automatically adjust quality based on performance
    showStats: false, // Show FPS stats in debug mode
  },

  // 🔄 Level of Detail (LOD)
  lod: {
    enabled: true, // Enable automatic LOD switching
    distances: [0, 10, 20, 50], // LOD switch distances
    hysteresis: 1.5, // Prevent LOD flickering
  },

  // 🗑️ Memory Management
  memory: {
    // 🧹 Automatic cleanup
    autoCleanup: true,
    cleanupInterval: 30000, // Cleanup interval in milliseconds

    // 🏪 Object pooling
    pooling: {
      enabled: true,
      maxPoolSize: 100, // Maximum objects in pool
    },
  },

  // 📱 Device-specific optimizations
  device: {
    // 📲 Mobile optimizations
    mobile: {
      reduceQuality: true, // Automatically reduce quality on mobile
      disableBloom: false, // Disable bloom on mobile
      shadowMapSize: 512, // Smaller shadow maps on mobile
    },

    // 💻 Desktop optimizations
    desktop: {
      enableAdvancedEffects: true, // Enable advanced effects on desktop
      maxShadowCascades: 4, // Maximum shadow cascades
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎵 AUDIO CONFIGURATION (Future Implementation)
// ═══════════════════════════════════════════════════════════════════════════════

export const AUDIO_CONFIG = {
  // 🔊 Master Audio Settings
  master: {
    enabled: false, // Enable audio system
    volume: 1.0, // Master volume (0.0 - 1.0)
    muted: false, // Master mute toggle
  },

  // 🎼 Music Settings
  music: {
    enabled: false,
    volume: 0.7,
    autoPlay: false,
    loop: true,
  },

  // 🔔 Sound Effects
  sfx: {
    enabled: false,
    volume: 0.8,
    // Individual sound categories
    ui: { volume: 0.6 }, // UI sounds
    interaction: { volume: 0.8 }, // Interaction sounds
    ambient: { volume: 0.4 }, // Ambient sounds
  },

  // 🎧 3D Audio
  spatial: {
    enabled: false,
    distanceModel: "inverse", // Audio distance model
    maxDistance: 50, // Maximum hearing distance
    rolloffFactor: 1, // Audio rolloff factor
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📁 FILE PATHS & ASSETS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const PATHS_CONFIG = {
  // 🗂️ Asset directories
  assets: {
    models: "/models/", // 3D model files
    textures: "/textures/", // Texture files
    sounds: "/sounds/", // Audio files
    data: "/data/", // JSON data files
  },

  // 📊 Data files
  data: {
    colliders: "/src/data/collider.json", // Collider configuration
    materials: "/src/data/materials.json", // Material definitions
    lighting: "/src/data/lighting.json", // Lighting presets
  },

  // 🏗️ Components
  components: {
    ui: "/src/components/ui/", // UI components
    systems: "/src/components/systems/", // System components
    effects: "/src/components/effects/", // Effect components
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏷️ VERSION & BUILD INFORMATION
// ═══════════════════════════════════════════════════════════════════════════════

export const BUILD_CONFIG = {
  version: "1.0.0",
  buildDate: new Date().toISOString(),
  environment: process.env.NODE_ENV || "development",
  features: {
    debug: process.env.NODE_ENV === "development",
    analytics: false, // Enable analytics in production
    errorReporting: false, // Enable error reporting
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 EXPORT SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════
/*
Available Configurations:

🐛 DEVELOPER_CONFIG    - Debug modes, console logs, UI toggles
🎨 DEBUG_UI_CONFIG     - Debug panel layout and styling  
📷 CAMERA_CONFIG       - Camera position, FOV, controls
🌟 VISUAL_CONFIG       - Rendering quality, bloom, lighting
🎮 CONTROLS_CONFIG     - Keyboard/mouse input mapping
🏃‍♂️ PERFORMANCE_CONFIG - FPS, LOD, memory management
🎵 AUDIO_CONFIG        - Sound system (future)
📁 PATHS_CONFIG        - File paths and asset locations
🏷️ BUILD_CONFIG        - Version and build information

Usage in components:
import { DEVELOPER_CONFIG, CAMERA_CONFIG } from "@/config/app-config";
*/
