// ═══════════════════════════════════════════════════════════════════════════════
// WebMeshCore3D v1.0 by Burak Darende - https://burakdarende.com
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

// PMNDRS postprocessing for advanced anti-aliasing (BloomSystem'e taşındı)
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
  CameraTypeSwitcher,
  createInitialCamera,
  useCameraTypeSwitcher,
} from "./systems/CameraSystem";
import { LightingSystem } from "./systems/LightingSystem";

// --- YENİ İMPORT ---
import { PerformanceMonitor } from "./systems/PerformanceMonitor";
// --- BİTTİ ---

// Collider System Components
import { ColliderSystem } from "./systems/ColliderSystem";
import { UIStyleInjector } from "./ui/UIStyleInjector";
import { UILayoutManager } from "./ui/UILayoutManager";
import {
  DEFAULT_COLLIDERS,
  AVAILABLE_ANIMATIONS,
} from "./systems/ColliderConfig";
import { useColliderData } from "../hooks/useColliderData";

// UI Components (renamed from External)
import { CameraDebugUI } from "./ui/CameraDebugUI";
import { BloomDebugUI } from "./ui/BloomDebugUI";
import { LightingDebugUI } from "./ui/LightingDebugUI";
import { ColliderDebugUI } from "./ui/ColliderDebugUI";
import { QualityDebugUI } from "./ui/QualityDebugUI";

// Modal System
import { ModalProvider } from "./ui/modal/ModalSystem";

// Import centralized configuration
import {
  DEVELOPER_CONFIG,
  DEBUG_UI_CONFIG,
  VISUAL_CONFIG,
  PERFORMANCE_CONFIG,
  CAMERA_CONFIG,
} from "../config/app-config";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 SCENE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Quality Runtime Updater - Applies quality settings to renderer at runtime
function QualityRuntimeUpdater({ qualitySettings }) {
  const { gl, scene, size } = useThree(); // size'ı buradan alıyoruz

  useEffect(() => {
    if (!gl || !scene || !qualitySettings) return;

    console.log(
      "🎨 Applying NEW quality settings to renderer:",
      qualitySettings
    );

    // --- 1. Pixel Ratio (DPR) Güncellemesi ---
    if (gl.getPixelRatio() !== qualitySettings.pixelRatio) {
      gl.setPixelRatio(qualitySettings.pixelRatio);
      console.log(`✅ Set Pixel Ratio to: ${qualitySettings.pixelRatio}`);

      // Post-Processing Composer'ı yeniden boyutlandır (Zoom sorununu düzeltir)
      if (window.postProcessingComposer) {
        window.postProcessingComposer.setSize(size.width, size.height);
        console.log(`✅ Resized EffectComposer for new Pixel Ratio.`);
      }
    }

    // --- 2. Gölge Ayarları ---
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = qualitySettings.shadowType;

    // --- 3. Gölge Çözünürlüğü (shadowMapSize) Güncellemesi ---
    let updatedLights = 0;
    scene.traverse((node) => {
      if (node.isLight && node.castShadow) {
        if (
          node.shadow.mapSize.width !== qualitySettings.shadowMapSize ||
          node.shadow.mapSize.height !== qualitySettings.shadowMapSize
        ) {
          node.shadow.mapSize.width = qualitySettings.shadowMapSize;
          node.shadow.mapSize.height = qualitySettings.shadowMapSize;
          if (node.shadow.map) {
            node.shadow.map.dispose();
            node.shadow.map = null;
          }
          updatedLights++;
        }
      }
    });
    if (updatedLights > 0) {
      console.log(
        `✅ Updated shadowMapSize for ${updatedLights} lights to: ${qualitySettings.shadowMapSize}`
      );
    }

    // --- 4. Anisotropi Güncellemesi ---
    let textureCount = 0;
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          if (mat && qualitySettings.anisotropy > 0) {
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
                if (mat[prop].anisotropy !== qualitySettings.anisotropy) {
                  mat[prop].anisotropy = qualitySettings.anisotropy;
                  mat[prop].needsUpdate = true;
                  textureCount++;
                }
              }
            });
          }
        });
      }
    });

    if (textureCount > 0) {
      console.log(
        `✅ Updated anisotropy for ${textureCount} textures to: ${qualitySettings.anisotropy}`
      );
    }

    console.log(`✅ Quality settings applied.`);
  }, [qualitySettings, gl, scene, size]);

  return null;
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % yükleniyor</Html>;
}

function Model({
  target,
  onTargetChange,
  onAnimationsDetected,
  qualitySettings,
}) {
  const gltf = useLoader(GLTFLoader, "/models/bdr_room_1.glb");
  const { actions, mixer } = useAnimations(gltf.animations, gltf.scene);
  const [materialsProcessed, setMaterialsProcessed] = useState(false);

  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      if (onAnimationsDetected) {
        const realAnimations = gltf.animations.map((anim, index) => ({
          id: anim.name,
          name: `Animation ${index + 1} (${anim.name})`,
          duration: anim.duration.toFixed(1),
          realName: anim.name,
        }));
        window.animationMapping = {};
        gltf.animations.forEach((anim) => {
          window.animationMapping[anim.name] = anim.name;
        });
        onAnimationsDetected(realAnimations);
      }
    }
  }, [gltf.animations, actions, onAnimationsDetected]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      window.modelAnimations = {
        actions,
        mixer,
        play: (animationName) => {
          const realAnimationName =
            window.animationMapping?.[animationName] || animationName;
          Object.values(actions).forEach((action) => action.stop());
          if (actions[realAnimationName]) {
            const action = actions[realAnimationName];
            action.reset();
            action.setLoop(2201, 1); // THREE.LoopOnce
            action.clampWhenFinished = true;
            action.fadeIn(0.2).play();
          } else {
            console.error(`❌ Animation '${realAnimationName}' not found.`);
          }
        },
        stop: () => {
          Object.values(actions).forEach((action) => action.stop());
        },
      };
    }
  }, [actions, mixer]);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  useEffect(() => {
    if (gltf?.scene && !materialsProcessed) {
      setMaterialsProcessed(true);

      const originalMaterials = new Map();
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
            }
          });
        }
      });

      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            const original = originalMaterials.get(mat.uuid);

            if (original && original.color && mat.color)
              mat.color.copy(original.color);
            if (original && original.emissive && mat.emissive)
              mat.emissive.copy(original.emissive);

            if (mat.emissive && mat.emissive.getHex() !== 0x000000) {
              const baseIntensity = original?.emissiveIntensity || 1;
              mat.emissiveIntensity = Math.max(baseIntensity * 4, 8);
              if (mat.name && mat.name.length <= 2) {
                mat.emissiveIntensity = 40;
              } else {
                mat.emissiveIntensity = Math.min(mat.emissiveIntensity, 25);
              }
            }

            const nameIndicatesLight =
              mat.name &&
              (mat.name.toLowerCase().includes("light") ||
                mat.name.toLowerCase().includes("lamp"));
            if (
              nameIndicatesLight &&
              (!mat.emissive || mat.emissive.getHex() === 0x000000)
            ) {
              mat.emissive = mat.emissive || new THREE.Color();
              mat.emissive.setRGB(1, 0.9, 0.7);
              mat.emissiveIntensity = 3;
            }

            const anisotropy = qualitySettings?.anisotropy || 1;
            if (anisotropy > 1) {
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
                  mat[prop].anisotropy = anisotropy;
                  mat[prop].needsUpdate = true;
                }
              });
            }
            mat.needsUpdate = true;
          });
        }
      });
    }
  }, [gltf, materialsProcessed, qualitySettings]);

  return <>{gltf?.scene ? <primitive object={gltf.scene} /> : null}</>;
}

export default function Scene() {
  const [sharedTarget, setSharedTarget] = useState(CAMERA_CONFIG.target);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [qualityPreset, setQualityPreset] = useState(
    VISUAL_CONFIG.qualityPreset
  );
  const [qualitySettings, setQualitySettings] = useState(
    VISUAL_CONFIG.qualityPresets[qualityPreset]
  );
  const [debugPanelsVisible, setDebugPanelsVisible] = useState(
    DEVELOPER_CONFIG.ENABLE_DEBUG_MODE
  );
  const [debugHelpersVisible, setDebugHelpersVisible] = useState(
    DEVELOPER_CONFIG.ENABLE_DEBUG_MODE
  );
  const [cameraType, setCameraType] = useCameraTypeSwitcher(DEVELOPER_CONFIG);
  const { colliders: jsonColliders, loading: collidersLoading } =
    useColliderData();
  const [colliders, setColliders] = useState([]);
  const [selectedCollider, setSelectedCollider] = useState(null);
  const [availableAnimations, setAvailableAnimations] =
    useState(AVAILABLE_ANIMATIONS);

  const handleQualityChange = useCallback((preset, settings) => {
    setQualityPreset(preset);
    setQualitySettings(settings);
  }, []);

  useEffect(() => {
    if (!collidersLoading && jsonColliders.length > 0) {
      setColliders(jsonColliders);
    } else if (!collidersLoading && jsonColliders.length === 0) {
      setColliders(DEFAULT_COLLIDERS);
    }
  }, [jsonColliders, collidersLoading]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    if (
      !canvas.getContext("webgl") &&
      !canvas.getContext("experimental-webgl")
    ) {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    if (!DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) return;
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "h") {
        setDebugPanelsVisible((prev) => !prev);
        setDebugHelpersVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <ModalProvider>
      <Canvas
        camera={createInitialCamera(cameraType)}
        shadows
        dpr={qualitySettings.pixelRatio}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        frameloop="always"
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          shadowMap: {
            enabled: true,
            type: qualitySettings.shadowType,
            autoUpdate: true,
          },
        }}
        style={{ background: VISUAL_CONFIG.background }}
      >
        {/* Scene Background & Environment */}
        <color attach="background" args={[VISUAL_CONFIG.background]} />
        <Environment preset={VISUAL_CONFIG.environment} background={false} />
        <SoftShadows />
        {/* Unified Advanced Lighting System */}
        <LightingSystem
          isDebugMode={DEVELOPER_CONFIG.ENABLE_DEBUG_MODE}
          helpersVisible={debugHelpersVisible}
        />

        <Suspense fallback={<Loader />}>
          <Model
            target={sharedTarget}
            onTargetChange={setSharedTarget}
            onAnimationsDetected={setAvailableAnimations}
            qualitySettings={qualitySettings}
          />
        </Suspense>
        {/* Camera System includes OrbitControls and Debug Features */}
        <CameraSystem
          DEVELOPER_CONFIG={DEVELOPER_CONFIG}
          target={sharedTarget}
          onTargetChange={setSharedTarget}
          cameraType={cameraType}
        />
        {/* Dynamic Camera Type Switcher - Preserves state during camera changes */}
        <CameraTypeSwitcher
          DEVELOPER_CONFIG={DEVELOPER_CONFIG}
          cameraType={cameraType}
        />
        {/* Bloom System with PostProcessing and Controls */}
        <BloomSystem
          DEVELOPER_CONFIG={DEVELOPER_CONFIG}
          VISUAL_CONFIG={VISUAL_CONFIG}
          qualitySettings={qualitySettings}
        />
        {/* Quality System - Runtime quality adjustments */}
        <QualityRuntimeUpdater qualitySettings={qualitySettings} />

        {/* 🎯 DEVELOPER ONLY: Interactive Collider System */}
        {DEVELOPER_CONFIG.ENABLE_DEBUG_MODE && (
          <ColliderSystem
            colliders={colliders}
            onCollidersUpdate={setColliders}
            selectedCollider={selectedCollider}
            onSelectCollider={setSelectedCollider}
            enableDev={DEVELOPER_CONFIG.ENABLE_DEBUG_MODE}
            debugPanelsVisible={debugPanelsVisible}
            helpersVisible={debugHelpersVisible}
          />
        )}

        {/* 🚀 PERFORMANCE MONITOR (GL-BENCH) */}
        <PerformanceMonitor />
      </Canvas>

      {/* Fixed UI Components (Completely Outside Canvas) */}
      <UIStyleInjector />
      <UILayoutManager DEVELOPER_CONFIG={DEVELOPER_CONFIG}>
        {DEVELOPER_CONFIG.ENABLE_DEBUG_MODE && debugPanelsVisible && (
          <>
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
            <ColliderDebugUI
              colliders={colliders}
              onCollidersUpdate={setColliders}
              selectedCollider={selectedCollider}
              onSelectCollider={setSelectedCollider}
              availableAnimations={availableAnimations}
            />
            <QualityDebugUI
              DEVELOPER_CONFIG={DEVELOPER_CONFIG}
              DEBUG_UI_CONFIG={DEBUG_UI_CONFIG}
              qualityPreset={qualityPreset}
              qualitySettings={qualitySettings}
              onQualityChange={handleQualityChange}
            />
          </>
        )}
      </UILayoutManager>
      {/* 🚀 Future panels ready for implementation:
      <PerformanceDebugUI />
      <MaterialDebugUI />
      */}
    </ModalProvider>
  );
}
