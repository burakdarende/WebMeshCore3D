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

import React, { Suspense, useEffect, useState, useRef } from "react";
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

// Collider System Components
import { ColliderSystem } from "./ColliderSystem";
import { ExternalColliderDebugUI } from "./ColliderDebugUI";
import { DEFAULT_COLLIDERS, AVAILABLE_ANIMATIONS } from "./ColliderConfig";

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
// Configure your perfect camera setup here. Use the debug system below to find
// your ideal values, then paste them here for permanent use.

const CAMERA_CONFIG = {
  // 📷 Camera position and field of view
  position: [4.98, 3.76, 4.86], // [x, y, z] - Change this to your desired camera position
  fov: 50, // Field of view - typically 30-75

  // 🎯 Focus target (where the camera looks at)
  target: [0.46, 0.77, -0.27], // [x, y, z] - Change this to your desired focus point

  // 📐 Camera projection type
  perspective: true, // true = Perspective camera, false = Orthographic camera

  // 📏 Orthographic camera settings (only used when perspective = false)
  orthographic: {
    left: -10,
    right: 10,
    top: 10,
    bottom: -10,
    zoom: 2.0, // Increased zoom for closer view
  },

  // 🎮 OrbitControls settings
  minDistance: 2,
  maxDistance: 12,
  maxPolarAngle: Math.PI / 1.8, // Prevent camera from going below ground
  enableDamping: true,
  dampingFactor: 0.05,
};

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

// Axis Line Helper - Shows constraint axis during transform
function AxisLine({ axis, position, visible }) {
  if (!visible) return null;

  const getLineProps = () => {
    const length = 20; // Very long line
    switch (axis) {
      case "x":
        return {
          points: [
            [-length, position[1], position[2]],
            [length, position[1], position[2]],
          ],
          color: "#ff0000", // Red for X
        };
      case "y":
        return {
          points: [
            [position[0], -length, position[2]],
            [position[0], length, position[2]],
          ],
          color: "#00ff00", // Green for Y
        };
      case "z":
        return {
          points: [
            [position[0], position[1], -length],
            [position[0], position[1], length],
          ],
          color: "#0000ff", // Blue for Z
        };
      default:
        return { points: [], color: "#ffffff" };
    }
  };

  const { points, color } = getLineProps();

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={3} />
    </line>
  );
}

// Focus Point Marker - 3D red dot with Blender-style transform system (G + X/Y/Z)
function FocusPointMarker({ target, onTargetChange }) {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [grabMode, setGrabMode] = useState(false);
  const [constraintAxis, setConstraintAxis] = useState(null); // 'x', 'y', 'z', or null
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [dragStartTarget, setDragStartTarget] = useState(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(target[0], target[1], target[2]);
    }
  }, [target]);

  // Global keyboard handler for G/X/Y/Z keys (only active in debug mode)
  useEffect(() => {
    if (!DEVELOPER_CONFIG.ENABLE_FOCUS_CONTROL) return;

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "g") {
        event.preventDefault();
        if (grabMode) {
          // Exit grab mode
          setGrabMode(false);
          setConstraintAxis(null);
          setIsDragging(false);
        } else {
          // Enter grab mode
          setGrabMode(true);
          setConstraintAxis(null);
        }
      } else if (grabMode && ["x", "y", "z"].includes(key)) {
        event.preventDefault();
        setConstraintAxis(key);
      } else if (key === "escape") {
        // Cancel grab mode
        setGrabMode(false);
        setConstraintAxis(null);
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grabMode]);

  const handlePointerDown = (event) => {
    if (!grabMode) return;

    event.stopPropagation();
    setIsDragging(true);
    setDragStartPosition([event.clientX, event.clientY]);
    setDragStartTarget([...target]);
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !grabMode || !dragStartPosition) return;

    event.stopPropagation();

    const deltaX = (event.clientX - dragStartPosition[0]) * 0.01;
    const deltaY = -(event.clientY - dragStartPosition[1]) * 0.01; // Invert Y

    let newTarget = [...dragStartTarget];

    if (constraintAxis) {
      // Constrained movement
      switch (constraintAxis) {
        case "x":
          newTarget[0] = dragStartTarget[0] + deltaX;
          break;
        case "y":
          newTarget[1] = dragStartTarget[1] + deltaY;
          break;
        case "z":
          newTarget[2] = dragStartTarget[2] + deltaX; // Use deltaX for Z movement
          break;
      }
    } else {
      // Free movement (screen space)
      newTarget[0] = dragStartTarget[0] + deltaX;
      newTarget[1] = dragStartTarget[1] + deltaY;
    }

    if (onTargetChange) {
      onTargetChange(newTarget);
    }
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setIsDragging(false);
    setDragStartPosition(null);
    setDragStartTarget(null);
    if (event.target.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }
  };

  // Visual state based on grab mode and constraint
  const getVisualState = () => {
    if (isDragging) {
      return { size: 0.08, color: "#ffff00", opacity: 1.0 }; // Yellow when dragging
    } else if (grabMode) {
      if (constraintAxis) {
        const colors = { x: "#ff6666", y: "#66ff66", z: "#6666ff" };
        return { size: 0.07, color: colors[constraintAxis], opacity: 0.9 };
      }
      return { size: 0.06, color: "#ff8800", opacity: 0.9 }; // Orange in grab mode
    } else {
      return { size: 0.05, color: "#ff0000", opacity: 0.8 }; // Normal red
    }
  };

  const visualState = getVisualState();

  return (
    <>
      <mesh
        ref={meshRef}
        renderOrder={999}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <sphereGeometry args={[visualState.size, 16, 16]} />
        <meshBasicMaterial
          color={visualState.color}
          transparent={true}
          opacity={visualState.opacity}
          depthTest={false}
        />
      </mesh>

      {/* Show axis line when in constrained mode */}
      <AxisLine
        axis={constraintAxis}
        position={target}
        visible={grabMode && constraintAxis && !isDragging}
      />
    </>
  );
}

// Controlled OrbitControls that can be disabled during grab mode
function ControlledOrbitControls({ target }) {
  const [isGrabMode, setIsGrabMode] = useState(false);

  // Track G key state globally for grab mode (only active in debug mode)
  useEffect(() => {
    if (!DEVELOPER_CONFIG.ENABLE_FOCUS_CONTROL) return;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "g") {
        setIsGrabMode((prev) => !prev); // Toggle grab mode
      } else if (event.key === "Escape") {
        setIsGrabMode(false); // Cancel grab mode
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <OrbitControls
      enabled={DEVELOPER_CONFIG.ENABLE_FOCUS_CONTROL ? !isGrabMode : true} // Disable when in grab mode if debug enabled
      enableDamping={CAMERA_CONFIG.enableDamping}
      dampingFactor={CAMERA_CONFIG.dampingFactor}
      minDistance={CAMERA_CONFIG.minDistance}
      maxDistance={CAMERA_CONFIG.maxDistance}
      maxPolarAngle={CAMERA_CONFIG.maxPolarAngle}
      target={target} // Use dynamic target directly
    />
  );
}

// Camera Type Switcher - Handles perspective/orthographic switching with C key
function CameraSwitcher() {
  const { camera, set } = useThree();
  const [isPerspective, setIsPerspective] = useState(CAMERA_CONFIG.perspective);

  // C key handler for camera type switching (only active in debug mode)
  useEffect(() => {
    if (!DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) return;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        setIsPerspective((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Switch camera type when isPerspective changes
  useEffect(() => {
    const currentPosition = camera.position.clone();
    const currentRotation = camera.rotation.clone();

    let newCamera;

    if (isPerspective) {
      // Switch to Perspective Camera
      newCamera = new THREE.PerspectiveCamera(
        CAMERA_CONFIG.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log("📐 Switched to PERSPECTIVE camera");
      }
    } else {
      // Switch to Orthographic Camera
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 15; // Reduced for better proportion with higher zoom
      newCamera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2,
        (frustumSize * aspect) / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
      );
      newCamera.zoom = CAMERA_CONFIG.orthographic.zoom; // Use direct zoom value
      if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
        console.log("📐 Switched to ORTHOGRAPHIC camera");
      }
    }

    // Preserve position and rotation
    newCamera.position.copy(currentPosition);
    newCamera.rotation.copy(currentRotation);
    newCamera.updateProjectionMatrix();

    // Update Three.js camera
    set({ camera: newCamera });
  }, [isPerspective, set]);

  return null; // This component doesn't render anything
}

// Real-time camera position debugger with focus control
function CameraDebugger({ target: externalTarget, onTargetChange }) {
  const { camera } = useThree();
  const [position, setPosition] = React.useState({ x: 0, y: 0, z: 0 });
  // Use external target if provided, otherwise use internal state
  const [internalTarget, setInternalTarget] = React.useState([0, 0.5, 0]);
  const target = externalTarget || internalTarget;
  const setTarget = onTargetChange || setInternalTarget;

  // Keyboard controls for camera and target fine-tuning
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      const step = 0.1;

      // Check for modifier keys
      const isShiftPressed = event.shiftKey;

      switch (event.key.toLowerCase()) {
        // Camera position controls (default)
        case "w":
          if (isShiftPressed) {
            setTarget((prev) => [prev[0], prev[1], prev[2] - step]);
          } else {
            camera.position.z -= step;
          }
          break;
        case "s":
          if (isShiftPressed) {
            setTarget((prev) => [prev[0], prev[1], prev[2] + step]);
          } else {
            camera.position.z += step;
          }
          break;
        case "a":
          if (isShiftPressed) {
            setTarget((prev) => [prev[0] - step, prev[1], prev[2]]);
          } else {
            camera.position.x -= step;
          }
          break;
        case "d":
          if (isShiftPressed) {
            setTarget((prev) => [prev[0] + step, prev[1], prev[2]]);
          } else {
            camera.position.x += step;
          }
          break;
        case "q":
          if (isShiftPressed) {
            setTarget((prev) => [prev[0], prev[1] + step, prev[2]]);
          } else {
            camera.position.y += step;
          }
          break;
        case "e":
          if (isShiftPressed) {
            setTarget((prev) => [prev[0], prev[1] - step, prev[2]]);
          } else {
            camera.position.y -= step;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [camera, target]);

  useFrame(() => {
    // Update position state for UI
    setPosition({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    });
  });

  // Store camera data in window for external UI access
  React.useEffect(() => {
    window.cameraDebugData = {
      position,
      target,
      fov: camera.fov,
      type: camera.type,
    };
  }, [position, target, camera]);

  return (
    <>
      <FocusPointMarker target={target} onTargetChange={setTarget} />
    </>
  );
}

// High-Quality Selective Bloom System - Based on Three.js Official Examples
function PostProcessingEffect({ bloomParams }) {
  const { gl, scene, camera, size } = useThree();
  const [isEnabled, setIsEnabled] = useState(true);

  const bloomComposer = useRef();
  const finalComposer = useRef();
  const bloomLayer = useRef();
  const materials = useRef({});
  const darkMaterial = useRef();
  const bloomPassRef = useRef();

  // Bloom scene layer for selective bloom
  const BLOOM_SCENE = 1;
  useEffect(() => {
    if (!isEnabled || !gl || !scene || !camera) return;

    try {
      console.log("🌟 Initializing Selective Bloom System...");

      // Initialize bloom layer and dark material for selective rendering
      bloomLayer.current = new THREE.Layers();
      bloomLayer.current.set(BLOOM_SCENE);
      darkMaterial.current = new THREE.MeshBasicMaterial({ color: 0x000000 });

      // Enhanced renderer setup for maximum quality
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = Math.pow(bloomParams.exposure, 4.0);
      gl.outputColorSpace = THREE.SRGBColorSpace;

      // High-quality render targets
      const renderTarget = new THREE.WebGLRenderTarget(
        size.width,
        size.height,
        {
          type: THREE.HalfFloatType,
          samples: 4, // MSAA anti-aliasing
          generateMipmaps: false,
        }
      );

      const bloomRenderTarget = new THREE.WebGLRenderTarget(
        size.width,
        size.height,
        {
          type: THREE.HalfFloatType,
          generateMipmaps: false,
        }
      );

      // Base scene render pass
      const renderPass = new RenderPass(scene, camera);

      // === BLOOM COMPOSER SETUP ===
      bloomComposer.current = new EffectComposer(gl, bloomRenderTarget);
      bloomComposer.current.renderToScreen = false;
      bloomComposer.current.addPass(renderPass);

      // High-quality UnrealBloomPass with optimal settings
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(size.width, size.height),
        bloomParams.strength, // Dynamic strength
        bloomParams.radius, // Dynamic radius
        bloomParams.threshold // Dynamic threshold
      );
      bloomPassRef.current = bloomPass; // Store reference for dynamic updates
      bloomComposer.current.addPass(bloomPass);

      // === SHADER PASS FOR MIXING ===
      const mixPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: {
              value: bloomComposer.current.renderTarget2.texture,
            },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            varying vec2 vUv;
            void main() {
              vec4 base = texture2D(baseTexture, vUv);
              vec4 bloom = texture2D(bloomTexture, vUv);
              // Additive blending for bloom effect
              gl_FragColor = base + vec4(1.0) * bloom;
            }
          `,
        }),
        "baseTexture"
      );
      mixPass.needsSwap = true;

      // === FINAL COMPOSER SETUP ===
      finalComposer.current = new EffectComposer(gl, renderTarget);
      finalComposer.current.addPass(renderPass);
      finalComposer.current.addPass(mixPass);

      // Add high-quality anti-aliasing
      if (VISUAL_CONFIG.enableSMAA) {
        const smaaPass = new SMAAPass(
          size.width * gl.getPixelRatio(),
          size.height * gl.getPixelRatio()
        );
        finalComposer.current.addPass(smaaPass);
      }

      if (VISUAL_CONFIG.enableFXAA) {
        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.material.uniforms["resolution"].value.x =
          1 / (size.width * gl.getPixelRatio());
        fxaaPass.material.uniforms["resolution"].value.y =
          1 / (size.height * gl.getPixelRatio());
        finalComposer.current.addPass(fxaaPass);
      }

      // Final output pass
      const outputPass = new OutputPass();
      finalComposer.current.addPass(outputPass);

      console.log("✅ Selective Bloom System initialized successfully");

      // Resize handler
      const handleResize = () => {
        if (bloomComposer.current && finalComposer.current) {
          bloomComposer.current.setSize(size.width, size.height);
          finalComposer.current.setSize(size.width, size.height);
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (bloomComposer.current) bloomComposer.current.dispose();
        if (finalComposer.current) finalComposer.current.dispose();
      };
    } catch (error) {
      console.error("❌ Selective Bloom System error:", error);
      setIsEnabled(false);
    }
  }, [gl, scene, camera, size, isEnabled, bloomParams]);

  // Dynamic bloom parameter updates
  // Store previous bloom params to avoid unnecessary updates
  const prevBloomParams = useRef(null);
  
  // Remove the useEffect for bloom updates, we'll do it in useFrame
  // useEffect(() => {
  //   if (bloomPassRef.current && gl && bloomParams) {
  //     bloomPassRef.current.threshold = bloomParams.threshold;
  //     bloomPassRef.current.strength = bloomParams.strength;
  //     bloomPassRef.current.radius = bloomParams.radius;
  //     gl.toneMappingExposure = Math.pow(bloomParams.exposure, 4.0);
  //   }
  // }, [bloomParams, gl]);

  // === SELECTIVE BLOOM FUNCTIONS ===
  const darkenNonBloomed = (obj) => {
    if (
      obj.isMesh &&
      bloomLayer.current &&
      bloomLayer.current.test(obj.layers) === false
    ) {
      materials.current[obj.uuid] = obj.material;
      obj.material = darkMaterial.current;
    }
  };

  const restoreMaterial = (obj) => {
    if (materials.current[obj.uuid]) {
      obj.material = materials.current[obj.uuid];
      delete materials.current[obj.uuid];
    }
  };

  // === RENDER LOOP ===
  useFrame(() => {
    if (!isEnabled || !bloomComposer.current || !finalComposer.current) return;

    // Update bloom parameters if changed (smooth, per-frame updates)
    if (bloomPassRef.current && gl && bloomParams) {
      const current = bloomParams;
      const prev = prevBloomParams.current;
      
      if (!prev || 
          prev.threshold !== current.threshold ||
          prev.strength !== current.strength ||
          prev.radius !== current.radius ||
          prev.exposure !== current.exposure) {
        
        bloomPassRef.current.threshold = current.threshold;
        bloomPassRef.current.strength = current.strength;
        bloomPassRef.current.radius = current.radius;
        gl.toneMappingExposure = Math.pow(current.exposure, 4.0);
        
        prevBloomParams.current = { ...current };
      }
    }

    try {
      // Step 1: Darken all non-bloom objects
      scene.traverse(darkenNonBloomed);

      // Step 2: Render bloom objects only
      bloomComposer.current.render();

      // Step 3: Restore original materials
      scene.traverse(restoreMaterial);

      // Step 4: Render final composite (base + bloom)
      finalComposer.current.render();
    } catch (error) {
      console.error("❌ Selective bloom render error:", error);
      setIsEnabled(false);
    }
  }, 1);

  // Expose bloom controls for external access
  window.bloomControls = {
    setParams: () => {}, // Will be overridden by BloomControls component
    params: bloomParams,
    isEnabled,
    setEnabled: setIsEnabled,
  };

  return null;
}

// Interactive Bloom Controls Component - Developer Mode Only (Fixed Position)
function BloomControls({ bloomParams, setBloomParams }) {
  // Early return if developer bloom controls are disabled
  if (
    !DEVELOPER_CONFIG.ENABLE_BLOOM_DEBUG_UI ||
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE
  ) {
    return null;
  }

  // Use props instead of local state
  // const [bloomParams, setBloomParams] = useState({
  //   threshold: VISUAL_CONFIG.bloom.threshold,
  //   strength: VISUAL_CONFIG.bloom.strength,
  //   radius: VISUAL_CONFIG.bloom.radius,
  //   exposure: VISUAL_CONFIG.bloom.exposure,
  // });

  // Update global bloom controls when params change
  useEffect(() => {
    if (window.bloomControls) {
      window.bloomControls.setParams = (newParams) => setBloomParams(newParams);
      window.bloomControls.params = bloomParams;
    }
  }, [bloomParams]);

  // Store bloom data in window for external UI access
  useEffect(() => {
    window.bloomDebugData = {
      bloomParams,
      setBloomParams,
    };
  }, [bloomParams]);

  return null; // Don't render UI here, will be handled externally
}

// External UI Components (Completely Fixed, Outside Canvas)
function ExternalCameraDebugUI() {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);

  // Poll camera data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.cameraDebugData) {
        setWindowData(window.cameraDebugData);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  if (
    !DEVELOPER_CONFIG.ENABLE_CAMERA_DEBUG_UI ||
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !windowData
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: `${DEBUG_UI_CONFIG.bottomMargin}px`,
        left: `${DEBUG_UI_CONFIG.getPanelPosition(
          DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.index
        )}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: `${DEBUG_UI_CONFIG.panelWidth}px`,
        border: `2px solid ${DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
          color: `${DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.color}`,
          fontWeight: "bold",
        }}
      >
        {DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.icon} Camera Debug
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Position:</strong>
      </div>
      <div
        style={{
          marginLeft: "10px",
          marginBottom: "5px",
          color: "#ff4444",
        }}
      >
        X: {windowData.position.x.toFixed(2)} | Y:{" "}
        {windowData.position.y.toFixed(2)} | Z:{" "}
        {windowData.position.z.toFixed(2)}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>FOV:</strong> {windowData.fov?.toFixed(0) || "N/A"}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Camera Type (Press C to toggle):</strong>{" "}
        <span style={{ color: "#ff0000" }}>
          {windowData.type === "PerspectiveCamera"
            ? "Perspective"
            : "Orthographic"}
        </span>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Focus Target:</strong>
      </div>
      <div
        style={{
          marginLeft: "10px",
          marginBottom: "5px",
          color: "#ff4444",
        }}
      >
        X: {windowData.target[0]?.toFixed(2)} | Y:{" "}
        {windowData.target[1]?.toFixed(2)} | Z:{" "}
        {windowData.target[2]?.toFixed(2)}
      </div>

      <div style={{ fontSize: "11px", color: "#888" }}>
        🎮 WASD - EQ: CAMERA Position | Shift+WASD - EQ: TARGET Position
      </div>
      <div style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>
        🎯 G: grab mode | X/Y/Z: axis lock | C: camera type | ESC: cancel
      </div>
    </div>
  );
}

function ExternalBloomDebugUI() {
  // Direct access to window data without polling
  const [windowData, setWindowData] = useState(null);

  // Update when window data changes
  useEffect(() => {
    if (window.bloomDebugData) {
      setWindowData(window.bloomDebugData);
    }
    
    // Listen for bloom updates
    const checkForUpdates = () => {
      if (window.bloomDebugData) {
        setWindowData(prev => {
          const current = window.bloomDebugData;
          // Only update if actually different
          if (!prev || JSON.stringify(prev.bloomParams) !== JSON.stringify(current.bloomParams)) {
            return current;
          }
          return prev;
        });
      }
    };

    const interval = setInterval(checkForUpdates, 50); // Faster but smarter checking
    return () => clearInterval(interval);
  }, []);

  if (
    !DEVELOPER_CONFIG.ENABLE_BLOOM_DEBUG_UI ||
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !windowData
  ) {
    return null;
  }

  const { bloomParams, setBloomParams } = windowData;

  return (
    <div
      style={{
        position: "fixed",
        bottom: `${DEBUG_UI_CONFIG.bottomMargin}px`,
        left: `${DEBUG_UI_CONFIG.getPanelPosition(
          DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.index
        )}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: `${DEBUG_UI_CONFIG.panelWidth}px`,
        border: `2px solid ${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        {DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.icon} BLOOM DEBUG
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Threshold: {bloomParams.threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bloomParams.threshold}
          onChange={(e) =>
            setBloomParams &&
            setBloomParams((prev) => ({
              ...prev,
              threshold: parseFloat(e.target.value),
            }))
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Strength: {bloomParams.strength.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={bloomParams.strength}
          onChange={(e) =>
            setBloomParams &&
            setBloomParams((prev) => ({
              ...prev,
              strength: parseFloat(e.target.value),
            }))
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Radius: {bloomParams.radius.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bloomParams.radius}
          onChange={(e) =>
            setBloomParams &&
            setBloomParams((prev) => ({
              ...prev,
              radius: parseFloat(e.target.value),
            }))
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Exposure: {bloomParams.exposure.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={bloomParams.exposure}
          onChange={(e) =>
            setBloomParams &&
            setBloomParams((prev) => ({
              ...prev,
              exposure: parseFloat(e.target.value),
            }))
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
        🎯 Emissive materials auto-bloom | 🌟 25% random objects for testing
      </div>
    </div>
  );
}

// 🚀 FUTURE PANEL TEMPLATE - Ready for easy expansion
// Copy this template and modify for new debug panels
function ExternalLightingDebugUI() {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);

  // Poll lighting data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.lightingDebugData) {
        setWindowData(window.lightingDebugData);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (
    !DEVELOPER_CONFIG.ENABLE_LIGHTING_DEBUG_UI ||
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !windowData
  ) {
    return null;
  }

  const updateLighting = (updates) => {
    if (windowData.setLightingState) {
      windowData.setLightingState((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: `${DEBUG_UI_CONFIG.bottomMargin}px`,
        left: `${DEBUG_UI_CONFIG.getPanelPosition(
          DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.index
        )}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: `${DEBUG_UI_CONFIG.panelWidth}px`,
        border: `2px solid ${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        {DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.icon} LIGHTING DEBUG
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Ambient: {windowData.ambientIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={windowData.ambientIntensity}
          onChange={(e) =>
            updateLighting({ ambientIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Key Light: {windowData.keyLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={windowData.keyLightIntensity}
          onChange={(e) =>
            updateLighting({ keyLightIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Fill Light: {windowData.fillLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={windowData.fillLightIntensity}
          onChange={(e) =>
            updateLighting({ fillLightIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Rim Light: {windowData.rimLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="4"
          step="0.1"
          value={windowData.rimLightIntensity}
          onChange={(e) =>
            updateLighting({ rimLightIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
        💡 Real-time lighting control | ⚡ Performance optimized
      </div>
    </div>
  );
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
      {/* 🔧 DEVELOPER ONLY: Camera Debug System */}
      {DEVELOPER_CONFIG.ENABLE_CAMERA_DEBUG_UI && (
        <CameraDebugger target={target} onTargetChange={onTargetChange} />
      )}
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

  // Consolidated state management - all states in one place
  const [lightingState, setLightingState] = useState({
    ambientIntensity: VISUAL_CONFIG.ambientLight.intensity,
    keyLightIntensity: VISUAL_CONFIG.keyLight.intensity,
    fillLightIntensity: VISUAL_CONFIG.fillLight.intensity,
    rimLightIntensity: VISUAL_CONFIG.rimLight.intensity,
  });

  const [bloomParams, setBloomParams] = useState({
    threshold: VISUAL_CONFIG.bloom.threshold,
    strength: VISUAL_CONFIG.bloom.strength,
    radius: VISUAL_CONFIG.bloom.radius,
    exposure: VISUAL_CONFIG.bloom.exposure,
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

  // Create initial camera based on config
  const createInitialCamera = () => {
    if (CAMERA_CONFIG.perspective) {
      return {
        position: CAMERA_CONFIG.position,
        fov: CAMERA_CONFIG.fov,
      };
    } else {
      // Orthographic camera setup
      const aspect =
        typeof window !== "undefined"
          ? window.innerWidth / window.innerHeight
          : 1;
      const frustumSize = 10;
      return {
        position: CAMERA_CONFIG.position,
        left: (frustumSize * aspect) / -2,
        right: (frustumSize * aspect) / 2,
        top: frustumSize / 2,
        bottom: frustumSize / -2,
        near: 0.1,
        far: 1000,
        zoom: CAMERA_CONFIG.orthographic.zoom,
      };
    }
  };

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
        camera={createInitialCamera()}
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
        {/* 🔧 DEVELOPER ONLY: Camera Type Switcher */}
        {DEVELOPER_CONFIG.ENABLE_DEBUG_MODE && <CameraSwitcher />}
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
        <ControlledOrbitControls target={sharedTarget} />
        {/* High-Quality Selective Bloom System */}
        <PostProcessingEffect bloomParams={bloomParams} />
        {/* 🌟 DEVELOPER ONLY: Interactive Bloom Controls (Fixed Position) */}
        <BloomControls
          bloomParams={bloomParams}
          setBloomParams={setBloomParams}
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

      {/* External Fixed UI Components (Completely Outside Canvas) */}
      <ExternalCameraDebugUI />
      <ExternalBloomDebugUI />
      <ExternalLightingDebugUI />
      {DEVELOPER_CONFIG.ENABLE_COLLIDER_DEBUG_UI && (
        <ExternalColliderDebugUI
          colliders={colliders}
          onCollidersUpdate={setColliders}
          selectedCollider={selectedCollider}
          onSelectCollider={setSelectedCollider}
          availableAnimations={availableAnimations}
        />
      )}
      {/* 🚀 Future panels ready for implementation:
      <ExternalPerformanceDebugUI />
      <ExternalMaterialDebugUI />
      */}
    </>
  );
}
