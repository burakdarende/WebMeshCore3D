// Spline-like Features & Utilities
import * as THREE from "three";

// Spline-style Material Presets
export const materialPresets = {
  glass: {
    metalness: 0,
    roughness: 0,
    transmission: 1,
    transparent: true,
    opacity: 0.8,
    ior: 1.5,
  },

  metal: {
    metalness: 1,
    roughness: 0.1,
    color: new THREE.Color("#888888"),
  },

  plastic: {
    metalness: 0,
    roughness: 0.4,
    color: new THREE.Color("#ffffff"),
  },

  emissive: {
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 5,
    metalness: 0.2,
    roughness: 0.1,
  },

  holographic: {
    metalness: 0.8,
    roughness: 0.1,
    emissive: new THREE.Color("#00ffff"),
    emissiveIntensity: 2,
    transparent: true,
    opacity: 0.9,
  },
};

// Spline-style Animation Helpers
export const animationHelpers = {
  // Rotate object continuously
  rotateObject: (object, speed = 0.01) => {
    if (object) {
      object.rotation.y += speed;
    }
  },

  // Float animation
  floatObject: (object, time, amplitude = 0.1, frequency = 1) => {
    if (object) {
      object.position.y += Math.sin(time * frequency) * amplitude * 0.016;
    }
  },

  // Pulsate scale
  pulsateObject: (object, time, amplitude = 0.1, frequency = 2) => {
    if (object) {
      const scale = 1 + Math.sin(time * frequency) * amplitude;
      object.scale.setScalar(scale);
    }
  },

  // Glow intensity animation
  animateEmission: (
    material,
    time,
    baseIntensity = 2,
    amplitude = 1,
    frequency = 1
  ) => {
    if (material && material.emissive) {
      material.emissiveIntensity =
        baseIntensity + Math.sin(time * frequency) * amplitude;
    }
  },
};

// Spline-style Post-processing Settings
export const bloomSettings = {
  threshold: 0.2, // What brightness triggers bloom
  strength: 1.5, // Bloom intensity
  radius: 0.4, // Bloom spread
  exposure: 1.2, // Overall exposure
};

// Spline-style Lighting Presets
export const lightingPresets = {
  studio: {
    ambient: { intensity: 0.4, color: "#ffffff" },
    key: { position: [10, 10, 5], intensity: 2, color: "#ffffff" },
    fill: { position: [-5, 5, -5], intensity: 0.8, color: "#87CEEB" },
    rim: { position: [0, 5, -10], intensity: 1.5, color: "#FFA500" },
  },

  outdoor: {
    ambient: { intensity: 0.6, color: "#87CEEB" },
    key: { position: [20, 20, 10], intensity: 3, color: "#ffffff" },
    fill: { position: [-10, 10, -5], intensity: 1, color: "#FFE4B5" },
  },

  dramatic: {
    ambient: { intensity: 0.1, color: "#1a1a2e" },
    key: { position: [5, 10, 0], intensity: 4, color: "#ffffff" },
    rim: { position: [-5, 2, -10], intensity: 2, color: "#FF6B6B" },
  },

  neon: {
    ambient: { intensity: 0.2, color: "#0f0f23" },
    neon1: { position: [5, 5, 5], intensity: 3, color: "#00ffff" },
    neon2: { position: [-5, 5, 5], intensity: 3, color: "#ff00ff" },
    neon3: { position: [0, 5, -5], intensity: 3, color: "#ffff00" },
  },
};

// Enhanced Material Scanner - Detects and categorizes materials
export const analyzeMaterials = (scene) => {
  const materials = {
    emissive: [],
    transparent: [],
    metallic: [],
    standard: [],
    total: 0,
  };

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      mats.forEach((mat) => {
        materials.total++;

        if (mat.emissive && mat.emissive.getHex() !== 0x000000) {
          materials.emissive.push({
            object: child,
            material: mat,
            name: mat.name,
          });
        }

        if (mat.transparent || mat.opacity < 1) {
          materials.transparent.push({
            object: child,
            material: mat,
            name: mat.name,
          });
        }

        if (mat.metalness > 0.5) {
          materials.metallic.push({
            object: child,
            material: mat,
            name: mat.name,
          });
        } else {
          materials.standard.push({
            object: child,
            material: mat,
            name: mat.name,
          });
        }
      });
    }
  });

  return materials;
};

export default {
  materialPresets,
  animationHelpers,
  bloomSettings,
  lightingPresets,
  analyzeMaterials,
};
