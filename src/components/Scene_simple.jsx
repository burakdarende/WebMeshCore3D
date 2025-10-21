// ═══════════════════════════════════════════════════════════════════════════════
// 3D SCENE SYSTEM v1.0 by Burak Darende - https://burakdarende.com
// ═══════════════════════════════════════════════════════════════════════════════
//
// 🚀 PRODUCTION DEPLOYMENT CHECKLIST:
// 1. Set ENABLE_DEBUG_MODE = false     (hides all debug UI)
// 2. Set ENABLE_CONSOLE_LOGS = false   (hides all console output)
// 3. Set ENABLE_FOCUS_CONTROL = false  (disables G+X/Y/Z controls)
// 4. Set ENABLE_CAMERA_DEBUG_UI = false (hides debug overlay)
//
// This will give you a clean production build with zero debug output!
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useProgress,
  Environment,
  ContactShadows,
  SoftShadows,
  useAnimations,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

// PMNDRS postprocessing for advanced anti-aliasing
import {
  EffectComposer as PMEffectComposer,
  EffectPass,
  RenderPass as PMRenderPass,
  FXAAEffect,
  SMAAEffect,
  BloomEffect as PMBloomEffect,
  ToneMappingEffect,
  ToneMappingMode,
  BlendFunction,
} from "postprocessing";

// System Components
import { BloomSystem } from "./systems/BloomSystem";
import {
  CameraSystem,
  CAMERA_CONFIG,
  createInitialCamera,
  useCameraTypeSwitcher,
} from "./systems/CameraSystem";
import { LightingSystem } from "./systems/LightingSystem";

// Collider System Components
import { ColliderSystem } from "./systems/ColliderSystem";
import { UIStyleInjector } from "./ui/UIStyleInjector";
import {
  DEFAULT_COLLIDERS,
  AVAILABLE_ANIMATIONS,
} from "./systems/ColliderConfig";

// UI Components (renamed from External)
import { CameraDebugUI } from "./ui/CameraDebugUI";
import { BloomDebugUI } from "./ui/BloomDebugUI";
import { LightingDebugUI } from "./ui/LightingDebugUI";
import { ColliderDebugUI } from "./ui/ColliderDebugUI";

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 DEVELOPER SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
// These settings control the development/debug features.
// Set ENABLE_DEBUG_MODE to false before deployment to hide all debug UI.

const DEVELOPER_CONFIG = {
  // 🐛 Master switch for all debug features
  ENABLE_DEBUG_MODE: true, // Set to false for production deployment

  // 🎯 Focus point manipulation (G key + X/Y/Z axis locking)
  ENABLE_FOCUS_CONTROL: true, // Blender-style transform system

  // 📊 Real-time camera debug UI
  ENABLE_CAMERA_DEBUG_UI: true, // Shows position, target, copy-paste values

  // 🌟 Bloom effect debug controls
  ENABLE_BLOOM_DEBUG_UI: true, // Interactive bloom controls for development

  // Lighting debug controls
  ENABLE_LIGHTING_DEBUG_UI: true, // Interactive lighting controls

  // Collider system debug controls
  ENABLE_COLLIDER_DEBUG_UI: true, // Interactive 3D colliders with management UI
  ENABLE_COLLIDER_SYSTEM: true, // Enable collider interaction system

  // �📝 Console logging for materials and setup
  // ⚠️ IMPORTANT: Set to false for production to hide ALL console logs!
  // Controls: material analysis, camera switching, setup logs, WebGL errors
  ENABLE_CONSOLE_LOGS: true, // Set to true for development debugging
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 DEBUG UI LAYOUT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// Centralized UI panel positioning for consistent layout

const DEBUG_UI_CONFIG = {
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
    COLLIDER_DEBUG: { index: 3, color: "#ff00ff", icon: "🎯" },
    // 🚀 Future panels can be added here:
    PERFORMANCE_DEBUG: { index: 4, color: "#ff0080", icon: "⚡" },
    MATERIAL_DEBUG: { index: 5, color: "#00ffff", icon: "🎨" },
  },
};

// Extend R3F with post-processing classes
extend({
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  OutputPass,
  SMAAPass,
  ShaderPass,
  // PMNDRS postprocessing
  PMEffectComposer,
  PMRenderPass,
  EffectPass,
  FXAAEffect,
  SMAAEffect,
  PMBloomEffect,
  ToneMappingEffect,
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 CAMERA & SCENE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// Camera configuration is now in CameraSystem.jsx

// 🌟 BLOOM & LIGHTING CONFIGURATION
const VISUAL_CONFIG = {
  // �️ Quality Presets (change this for different performance levels)
  qualityPreset: "high", // "low", "medium", "high", "ultra"

  // �🎨 Render Quality Settings (auto-configured based on preset)
  quality: (() => {
    const presets = {
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
        enableSMAA: true, // Re-enable SMAA for testing
        enableFXAA: false,
        enablePMNDRS: false, // Temporarily disable for debugging
        pixelRatio: 2, // Static for SSR
      },
      ultra: {
        antialias: true,
        multisampling: 8,
        shadowMapSize: 2048,
        shadowType: THREE.PCFSoftShadowMap,
        anisotropy: 8,
        enableSMAA: false, // Use PMNDRS instead
        enableFXAA: false,
        enablePMNDRS: true, // Best quality with PMNDRS
        pixelRatio: 2, // Static for SSR
      },
    };
    return presets.high; // Static return to avoid SSR issues
  })(),

  // 💫 Bloom settings for selective bloom system
  bloom: {
    strength: 1.5, // Strong bloom for dramatic effect
    radius: 0.4, // Medium radius for good coverage
    threshold: 0.1, // Low threshold for more bloom areas
    exposure: 1.0, // Tone mapping exposure
  },

  // 🔧 Anti-aliasing controls for high quality edges
  enableSMAA: true, // Enable SMAA for crisp edges
  enableFXAA: false, // Disable FXAA (SMAA is better)

  // 🌍 Environment and background
  background: "#1a1a2e", // Scene background color
  environment: "city", // HDRI environment preset

  // 💡 Lighting setup
  ambientLight: {
    intensity: 0.3,
    color: "#ffffff",
  },
  keyLight: {
    position: [10, 10, 5],
    intensity: 3,
    color: "#ffffff",
  },
  fillLight: {
    position: [-5, 5, -5],
    intensity: 1,
    color: "#87CEEB",
  },
  rimLight: {
    position: [0, 5, -10],
    intensity: 2,
    color: "#FFA500",
  },
};

// 🚀 DEPLOYMENT INSTRUCTIONS:
// ═══════════════════════════════════════════════════════════════════════════════
// When you're ready to deploy your project:
//
// 1. Find your perfect camera setup using the debug tools:
//    - G key + X/Y/Z axis for focus point positioning
//    - C key to switch between Perspective/Orthographic camera
//    - WASD keys for camera movement, Shift+WASD for target movement
// 2. Copy the values from the debug UI and paste them into CAMERA_CONFIG above
// 3. Set your preferred camera type: CAMERA_CONFIG.perspective = true/false
// 4. Tune bloom settings using the bloom debug controls (bottom-left corner)
// 5. Set DEVELOPER_CONFIG.ENABLE_DEBUG_MODE = false to hide all debug features
// 6. Optionally set other DEVELOPER_CONFIG flags to false for production
//
// This will give you a clean production build with your perfect setup!
// ═══════════════════════════════════════════════════════════════════════════════

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % yükleniyor</Html>;
}

function Model({ target, onTargetChange, onAnimationsDetected }) {
  // Simple model loading without error handling for now
  const gltf = useLoader(GLTFLoader, "/models/bdr_room_1.glb");

  // Animation system
  const { actions, mixer } = useAnimations(gltf.animations, gltf.scene);

  const [materialsProcessed, setMaterialsProcessed] = useState(false);

  // Expose animation controls globally for collider system
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      window.modelAnimations = {
        actions,
        mixer,
        play: (animationName) => {
          console.log(`🎬 Playing animation: ${animationName}`);
          // Stop all other animations
          Object.values(actions).forEach((action) => action.stop());
          // Play the requested animation
          if (actions[animationName]) {
            actions[animationName].reset().fadeIn(0.5).play();
          }
        },
        stop: () => {
          console.log(`🛑 Stopping all animations`);
          Object.values(actions).forEach((action) => action.stop());
        },
      };
    }
  }, [actions, mixer]);

  useEffect(() => {
    console.log("🔍 Model component mounted, gltf:", gltf);

    if (gltf?.scene && !materialsProcessed) {
      console.log("✅ GLTF scene loaded successfully:", gltf.scene);
      setMaterialsProcessed(true);

      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log("🎨 SPLINE-STYLE: Model loaded, analyzing materials...");
        console.log("═══════════════════════════════════════════════════");
      }

      // Check for cameras in the GLTF file
      if (
        gltf.cameras &&
        gltf.cameras.length > 0 &&
        DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS
      ) {
        console.log("📷 CAMERAS FOUND:", gltf.cameras.length);
        gltf.cameras.forEach((camera, index) => {
          console.log(`Camera ${index}:`, {
            name: camera.name,
            type: camera.type,
            position: camera.position,
            fov: camera.fov || "N/A",
            near: camera.near,
            far: camera.far,
          });
        });
      } else if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log("📷 No cameras found in GLTF file");
      }

      // Check for animations in the GLTF file
      if (gltf.animations && gltf.animations.length > 0) {
        console.log("🎬 ANIMATIONS FOUND:", gltf.animations.length);
        const animationNames = gltf.animations.map((anim, index) => ({
          id: `animation_${index}`,
          name: anim.name || `Animation ${index + 1}`,
          duration: anim.duration || 0,
        }));

        console.log("Available animations:", animationNames);

        // Notify parent component about available animations
        if (onAnimationsDetected) {
          onAnimationsDetected(animationNames);
        }
      } else if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log("🎬 No animations found in GLTF file");
      }

      // Material analysis counters
      let totalMaterials = 0;
      let emissiveMaterials = 0;
      let enhancedMaterials = 0;

      // Store original values to avoid repeated modifications
      const originalMaterials = new Map();

      // First pass: Store original values
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if (!originalMaterials.has(mat.uuid)) {
              originalMaterials.set(mat.uuid, {
                emissive: mat.emissive ? mat.emissive.clone() : null,
                emissiveIntensity: mat.emissiveIntensity,
                color: mat.color ? mat.color.clone() : null,
                name: mat.name,
              });
              totalMaterials++;
            }
          });
        }
      });

      // Second pass: Analyze and enhance materials + Add to bloom layer
      const BLOOM_SCENE = 1; // Bloom layer constant
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat, index) => {
            const original = originalMaterials.get(mat.uuid);

            // Restore original colors to prevent repeated modifications
            if (original && original.color && mat.color) {
              mat.color.copy(original.color);
            }
            if (original && original.emissive && mat.emissive) {
              mat.emissive.copy(original.emissive);
            }

            // Detailed material logging
            if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
              console.log(`\n🔍 Material: "${mat.name || "unnamed"}"`, {
                type: mat.type,
                hasEmission: mat.emissive
                  ? mat.emissive.getHex() !== 0x000000
                  : false,
                emissiveHex: mat.emissive
                  ? `#${mat.emissive.getHex().toString(16).padStart(6, "0")}`
                  : "none",
                intensity: mat.emissiveIntensity || 0,
                metalness: mat.metalness?.toFixed(2) || "N/A",
                roughness: mat.roughness?.toFixed(2) || "N/A",
              });
            }

            // Don McCurdy's emission and bloom approach + Selective bloom layer
            if (mat.emissive && mat.emissive.getHex() !== 0x000000) {
              emissiveMaterials++;

              // Add emissive objects to bloom layer for selective bloom
              child.layers.enable(BLOOM_SCENE);

              if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
                console.log(
                  `✨ Added "${
                    child.name || mat.name || "unnamed"
                  }" to bloom layer`
                );
              }

              // Use Don McCurdy's recommended intensity range: 1-256 nits
              const baseIntensity = original?.emissiveIntensity || 1;

              // Standard emissive materials: subtle intensity for bloom
              mat.emissiveIntensity = Math.max(baseIntensity * 4, 8); // 8-60 nits range

              // Special enhancement for single-letter materials (likely UI elements)
              if (mat.name && mat.name.length <= 2) {
                // Moderate intensity for balanced bloom effect
                mat.emissiveIntensity = 40; // 40 nits - above bloom threshold but not overwhelming

                enhancedMaterials++;
                if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
                  console.log(
                    `🌟 MODERATE EMISSIVE: "${mat.name}" -> ${mat.emissiveIntensity} nits`
                  );
                }
              } else {
                // Low intensity for very subtle bloom
                mat.emissiveIntensity = Math.min(mat.emissiveIntensity, 25); // Cap at 25 nits
              }
              if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
                console.log(
                  `✨ Enhanced "${
                    mat.name
                  }" -> Final Intensity: ${mat.emissiveIntensity.toFixed(1)}`
                );
              }
            }

            // Check for potential light materials by name
            const nameIndicatesLight =
              mat.name &&
              (mat.name.toLowerCase().includes("light") ||
                mat.name.toLowerCase().includes("lamp") ||
                mat.name.toLowerCase().includes("bulb") ||
                mat.name.toLowerCase().includes("led") ||
                mat.name.toLowerCase().includes("emission") ||
                mat.name.toLowerCase().includes("glow"));

            if (
              nameIndicatesLight &&
              (!mat.emissive || mat.emissive.getHex() === 0x000000)
            ) {
              if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
                console.log(
                  `💡 Adding emission to light-named material: "${mat.name}"`
                );
              }
              mat.emissive = mat.emissive || new THREE.Color();
              mat.emissive.setRGB(1, 0.9, 0.7); // Warm white
              mat.emissiveIntensity = 3;
              enhancedMaterials++;
            }

            // 🎨 Apply texture quality settings
            if (VISUAL_CONFIG.quality.anisotropy > 1) {
              // Apply anisotropy to common texture maps for crisp details
              const textureProps = [
                "map",
                "normalMap",
                "roughnessMap",
                "metalnessMap",
                "aoMap",
                "emissiveMap",
              ];
              textureProps.forEach((prop) => {
                if (mat[prop] && mat[prop].isTexture) {
                  mat[prop].anisotropy = VISUAL_CONFIG.quality.anisotropy;
                  mat[prop].needsUpdate = true;
                }
              });
            }

            mat.needsUpdate = true;
          });
        }
      });

      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log(`\n📊 MATERIAL ANALYSIS COMPLETE:`);
        console.log(`   Total Materials: ${totalMaterials}`);
        console.log(`   Emissive Materials: ${emissiveMaterials}`);
        console.log(`   Enhanced Materials: ${enhancedMaterials}`);
        console.log("═══════════════════════════════════════════════════");
      }

      // Add additional objects to bloom layer for selective bloom testing
      let bloomObjectsAdded = 0;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Add random objects to bloom layer for demo (25% chance)
          if (Math.random() < 0.25 && !child.layers.isEnabled(BLOOM_SCENE)) {
            child.layers.enable(BLOOM_SCENE);
            bloomObjectsAdded++;

            if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
              console.log(
                `🌟 Added random object "${
                  child.name || "unnamed"
                }" to bloom layer`
              );
            }
          }
        }
      });

      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log(
          `✨ Total objects in bloom layer: ${
            emissiveMaterials + bloomObjectsAdded
          }`
        );
      }
    }
  }, [gltf, materialsProcessed]);

  console.log("🎬 Rendering Model component, gltf.scene:", gltf?.scene);

  return (
    <>
      {gltf?.scene ? (
        <primitive object={gltf.scene} />
      ) : (
        <Html center>
          <div
            style={{
              background: "rgba(255, 165, 0, 0.9)",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              fontFamily: "monospace",
            }}
          >
            ⚠️ GLTF scene not ready
          </div>
        </Html>
      )}
    </>
  );
}

export default function Scene() {
  // Shared target state for both OrbitControls and FocusPointMarker
  const [sharedTarget, setSharedTarget] = useState(CAMERA_CONFIG.target);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Use camera type switcher from CameraSystem
  const [cameraType, setCameraType] = useCameraTypeSwitcher(
    DEVELOPER_CONFIG,
    (newType) => {
      // Handle camera type change
      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log(`📷 Camera type changed to: ${newType}`);
      }
    }
  );

  // Consolidated state management - all states in one place
  const [lightingState, setLightingState] = useState({
    ambientIntensity: VISUAL_CONFIG.ambientLight.intensity,
    keyLightIntensity: VISUAL_CONFIG.keyLight.intensity,
    fillLightIntensity: VISUAL_CONFIG.fillLight.intensity,
    rimLightIntensity: VISUAL_CONFIG.rimLight.intensity,
  });

  // Camera debug state
  const [cameraData, setCameraData] = useState({
    position: { x: 0, y: 0, z: 0 },
    target: [0, 0, 0],
    fov: 50,
    type: "PerspectiveCamera",
  });

  // Collider system state
  const [colliders, setColliders] = useState(DEFAULT_COLLIDERS);
  const [selectedCollider, setSelectedCollider] = useState(null);
  const [availableAnimations, setAvailableAnimations] =
    useState(AVAILABLE_ANIMATIONS);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setHasWebGL(false);
      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.error("WebGL not supported");
      }
    }
  }, []);

  // Fallback UI for WebGL issues
  if (!hasWebGL) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a2e",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>WebGL Not Supported</h2>
          <p>Your browser doesn't support WebGL or it's disabled.</p>
          <p>Please enable WebGL or use a modern browser.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Canvas
        key={cameraType} // Force re-render when camera type changes
        camera={createInitialCamera(cameraType)}
        shadows // Enable shadows with optimization
        dpr={[1, 2]} // Responsive device pixel ratio for SSR safety
        performance={{ min: 0.5, max: 1, debounce: 200 }} // Smart performance management
        frameloop="always" // Keep rendering but optimize internally
        gl={{
          // Anti-aliasing settings
          antialias: VISUAL_CONFIG.quality.antialias,
          alpha: false,
          powerPreference: "high-performance",

          // Tone mapping for realistic colors
          toneMapping: THREE.AgXToneMapping,
          toneMappingExposure: 0.5,
          outputColorSpace: THREE.SRGBColorSpace,

          // Memory and performance
          preserveDrawingBuffer: false,

          // Enhanced shadow settings
          shadowMap: {
            enabled: true,
            type: VISUAL_CONFIG.quality.shadowType,
            autoUpdate: true,
          },
        }}
        style={{ background: VISUAL_CONFIG.background }}
        fallback={
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: VISUAL_CONFIG.background,
              color: "white",
            }}
          >
            <div>Loading 3D Scene...</div>
          </div>
        }
      >
        {/* Scene Background & Environment */}
        <color attach="background" args={[VISUAL_CONFIG.background]} />
        <Environment preset={VISUAL_CONFIG.environment} background={false} />
        <SoftShadows />
        {/* Optimized Lighting System - Dynamic controls */}
        <ambientLight
          intensity={lightingState.ambientIntensity}
          color={VISUAL_CONFIG.ambientLight.color}
        />
        {/* Key Light with configurable shadow quality */}
        <directionalLight
          position={VISUAL_CONFIG.keyLight.position}
          intensity={lightingState.keyLightIntensity}
          color={VISUAL_CONFIG.keyLight.color}
          castShadow
          shadow-mapSize={[
            VISUAL_CONFIG.quality.shadowMapSize,
            VISUAL_CONFIG.quality.shadowMapSize,
          ]}
          shadow-camera-near={0.1}
          shadow-camera-far={20}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-bias={-0.0001}
        />
        {/* Fill Light - no shadows for performance */}
        <directionalLight
          position={VISUAL_CONFIG.fillLight.position}
          intensity={lightingState.fillLightIntensity * 0.6}
          color={VISUAL_CONFIG.fillLight.color}
          castShadow={false}
        />
        {/* Rim Light - reduced and no shadows */}
        <pointLight
          position={VISUAL_CONFIG.rimLight.position}
          intensity={lightingState.rimLightIntensity * 0.5}
          color={VISUAL_CONFIG.rimLight.color}
          distance={10}
          decay={2}
          castShadow={false}
        />{" "}
        <Suspense fallback={<Loader />}>
          <Model
            target={sharedTarget}
            onTargetChange={setSharedTarget}
            onAnimationsDetected={setAvailableAnimations}
          />
        </Suspense>
        {/* Camera System handles switching automatically */}
        {/* Optimized Contact Shadows for subtle realism */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.2}
          scale={20}
          blur={2}
          far={3}
          resolution={128} // Reduced for performance
          color="#000000"
        />
        {/* Camera System includes OrbitControls and Debug Features */}
        <CameraSystem
          DEVELOPER_CONFIG={DEVELOPER_CONFIG}
          target={sharedTarget}
          onTargetChange={setSharedTarget}
          cameraType={cameraType}
        />
        {/* Bloom System with PostProcessing and Controls */}
        <BloomSystem
          DEVELOPER_CONFIG={DEVELOPER_CONFIG}
          VISUAL_CONFIG={VISUAL_CONFIG}
        />
        {/* 🎯 DEVELOPER ONLY: Interactive Collider System */}
        {DEVELOPER_CONFIG.ENABLE_COLLIDER_SYSTEM && (
          <ColliderSystem
            colliders={colliders}
            onCollidersUpdate={setColliders}
            selectedCollider={selectedCollider}
            onSelectCollider={setSelectedCollider}
            enableDev={DEVELOPER_CONFIG.ENABLE_DEBUG_MODE}
          />
        )}
      </Canvas>

      {/* Fixed UI Components (Completely Outside Canvas) */}
      <UIStyleInjector />
      <CameraDebugUI
        DEVELOPER_CONFIG={DEVELOPER_CONFIG}
        DEBUG_UI_CONFIG={DEBUG_UI_CONFIG}
      />
      <BloomDebugUI
        DEVELOPER_CONFIG={DEVELOPER_CONFIG}
        DEBUG_UI_CONFIG={DEBUG_UI_CONFIG}
        VISUAL_CONFIG={VISUAL_CONFIG}
      />
      <LightingDebugUI
        DEVELOPER_CONFIG={DEVELOPER_CONFIG}
        DEBUG_UI_CONFIG={DEBUG_UI_CONFIG}
      />
      {DEVELOPER_CONFIG.ENABLE_COLLIDER_DEBUG_UI && (
        <ColliderDebugUI
          colliders={colliders}
          onCollidersUpdate={setColliders}
          selectedCollider={selectedCollider}
          onSelectCollider={setSelectedCollider}
          availableAnimations={availableAnimations}
        />
      )}
      {/* 🚀 Future panels ready for implementation:
      <PerformanceDebugUI />
      <MaterialDebugUI />
      */}
    </>
  );
}
