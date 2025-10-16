import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useProgress,
  Environment,
  ContactShadows,
  BakeShadows,
  SoftShadows,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { UnrealBloomPass } from "three-stdlib";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import {
  bloomSettings,
  lightingPresets,
  analyzeMaterials,
} from "../utils/splineFeatures.js";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

// Custom Bloom Effect Component - Spline Style (Simplified and Safe)
function BloomEffect({ children }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    if (!composer.current) return;

    try {
      composer.current.setSize(size.width, size.height);

      // Delayed material analysis to avoid race conditions
      setTimeout(() => {
        if (scene && scene.children.length > 0) {
          const materialAnalysis = analyzeMaterials(scene);
          console.log("🎨 SPLINE-STYLE Material Analysis:", materialAnalysis);

          if (materialAnalysis.emissive.length > 0) {
            console.log(
              `✨ Found ${materialAnalysis.emissive.length} emissive materials - Bloom optimized!`
            );
          }
        }
      }, 1000);
    } catch (error) {
      console.warn("Bloom effect initialization failed:", error);
    }
  }, [scene, size]);

  useFrame(() => {
    if (composer.current) {
      try {
        composer.current.render();
      } catch (error) {
        console.warn("Bloom render failed:", error);
      }
    }
  }, 1);

  return (
    <>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        <unrealBloomPass
          attachArray="passes"
          args={[
            new THREE.Vector2(size.width, size.height),
            1.2, // Bloom strength - safer default
            0.4, // Bloom radius
            0.1, // Bloom threshold - lower for more glow
          ]}
        />
      </effectComposer>
      {children}
    </>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % yükleniyor</Html>;
}

function Model() {
  const gltf = useLoader(GLTFLoader, "/models/bdr_room_1.glb");

  useEffect(() => {
    if (gltf?.scene) {
      console.log("🔍 Model loaded, analyzing ALL material properties...");
      console.log("═══════════════════════════════════════════════════════");

      // Store original material values to avoid repeated modifications
      const originalMaterials = new Map();

      // First pass: Store all original values
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if (!mat || originalMaterials.has(mat.uuid)) return;

            // Store original values
            originalMaterials.set(mat.uuid, {
              color: mat.color ? mat.color.clone() : null,
              emissive: mat.emissive ? mat.emissive.clone() : null,
              emissiveIntensity: mat.emissiveIntensity,
              metalness: mat.metalness,
              roughness: mat.roughness,
              name: mat.name,
            });
          });
        }
      });

      // Second pass: Analyze and carefully modify materials
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat, index) => {
            if (!mat) return;

            const original = originalMaterials.get(mat.uuid);

            console.log(
              `\n📋 MATERIAL ${index + 1}: "${mat.name || "unnamed"}"`,
              {
                type: mat.type,
                // Base colors - DON'T MODIFY THESE
                baseColor: mat.color
                  ? {
                      hex: `#${mat.color
                        .getHex()
                        .toString(16)
                        .padStart(6, "0")}`,
                      rgb: `rgb(${(mat.color.r * 255).toFixed(0)}, ${(
                        mat.color.g * 255
                      ).toFixed(0)}, ${(mat.color.b * 255).toFixed(0)})`,
                    }
                  : "❌ No color",
                // Emissive properties - THESE WE CAN MODIFY
                emissive: mat.emissive
                  ? {
                      hex: `#${mat.emissive
                        .getHex()
                        .toString(16)
                        .padStart(6, "0")}`,
                      rgb: `rgb(${(mat.emissive.r * 255).toFixed(0)}, ${(
                        mat.emissive.g * 255
                      ).toFixed(0)}, ${(mat.emissive.b * 255).toFixed(0)})`,
                      intensity: mat.emissiveIntensity || 0,
                      brightness: (
                        mat.emissive.r +
                        mat.emissive.g +
                        mat.emissive.b
                      ).toFixed(3),
                    }
                  : "❌ No emission",
                // Physical properties
                metalness: mat.metalness?.toFixed(2) || "N/A",
                roughness: mat.roughness?.toFixed(2) || "N/A",
                // Texture maps
                maps: {
                  colorMap: mat.map ? "✅" : "❌",
                  emissiveMap: mat.emissiveMap ? "✅" : "❌",
                  normalMap: mat.normalMap ? "✅" : "❌",
                  roughnessMap: mat.roughnessMap ? "✅" : "❌",
                  metalnessMap: mat.metalnessMap ? "✅" : "❌",
                },
              }
            );

            // Only process Standard and Physical materials
            if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
              // CRITICAL: Restore original base colors if we modified them
              if (original && original.color && mat.color) {
                mat.color.copy(original.color);
                console.log(`🎨 Restored original color for: "${mat.name}"`);
              }

              // Handle emissive materials - preserve original emissive colors
              if (mat.emissive && mat.emissive.getHex() !== 0x000000) {
                // Restore original emissive color if we changed it
                if (original && original.emissive) {
                  mat.emissive.copy(original.emissive);
                }

                const brightness =
                  mat.emissive.r + mat.emissive.g + mat.emissive.b;

                console.log(`🔆 EMISSIVE DETECTED: "${mat.name}"`, {
                  originalIntensity: original?.emissiveIntensity || "unknown",
                  originalBrightness: brightness.toFixed(3),
                  willBoost: brightness > 0,
                });

                // Only boost intensity and very slightly enhance color if too dark
                if (brightness > 0) {
                  const baseIntensity = original?.emissiveIntensity || 1;
                  // Adjusted for new lighting system - higher values needed
                  mat.emissiveIntensity = Math.max(baseIntensity * 5, 2.0);

                  // If emissive is extremely dark (almost black), give it a tiny boost
                  if (brightness < 0.1) {
                    mat.emissive.multiplyScalar(2);
                    console.log(`💡 Boosted very dark emissive: "${mat.name}"`);
                  }

                  console.log(
                    `✨ Enhanced "${
                      mat.name
                    }" -> Intensity: ${mat.emissiveIntensity.toFixed(1)}`
                  );
                }
              }

              // Check for materials that should be emissive by name
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
                console.log(
                  `💡 Adding emission to light material: "${mat.name}"`
                );
                mat.emissive = mat.emissive || new THREE.Color();
                mat.emissive.setRGB(1, 0.9, 0.7); // Warm white
                mat.emissiveIntensity = 3;
              }

              // Spline-style Emissive Enhancement
              if (
                mat.name &&
                mat.name.length <= 2 &&
                mat.emissive &&
                mat.emissive.getHex() !== 0x000000
              ) {
                console.log(
                  `🎨 SPLINE-STYLE: Enhancing emission on "${mat.name}"`
                );

                // Make emissive MUCH brighter for bloom effect (adjusted for new lighting)
                mat.emissiveIntensity = 12;

                // Slightly boost emissive color for better bloom
                const currentEmissive = mat.emissive.clone();
                mat.emissive.copy(currentEmissive.multiplyScalar(1.5));

                // Add slight metallic look for Spline-like appearance
                if (mat.metalness !== undefined) {
                  mat.metalness = Math.min(mat.metalness + 0.2, 1.0);
                }

                console.log(
                  `🌟 Enhanced for bloom: "${mat.name}" - Intensity: ${mat.emissiveIntensity}`
                );
              }

              mat.needsUpdate = true;
            }
          });
        }
      });

      console.log(
        `\n🎯 Analysis complete. Total materials processed: ${originalMaterials.size}`
      );
      console.log("═══════════════════════════════════════════════════════");
    }
  }, [gltf]);

  return <primitive object={gltf.scene} />;
}

export default function Scene() {
  return (
    <Canvas
      camera={{
        position: [0, 1.5, 4],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
      shadows // Enable shadows like Spline
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
        useLegacyLights: false, // Modern lighting system (replaces physicallyCorrectLights)
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap, // Soft shadows like Spline
        },
      }}
    >
      {/* Spline-style Environment & Lighting */}
      <color attach="background" args={["#1a1a2e"]} />

      {/* HDRI Environment for realistic reflections - Spline feature */}
      <Environment preset="city" />

      {/* Soft Shadows */}
      <SoftShadows />

      {/* Spline-style Lighting Setup - Updated for new Three.js lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />

      {/* Key Light - Main illumination (adjusted for new lighting system) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={3.14} // π for modern lighting system
        color="#ffffff"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* Fill Light - Soften shadows (adjusted) */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={1.57} // π/2 for modern lighting
        color="#87CEEB"
      />

      {/* Rim Light - Edge lighting (adjusted) */}
      <pointLight
        position={[0, 5, -10]}
        intensity={6.28} // 2π for point lights in new system
        color="#FFA500"
        distance={20}
        decay={2} // Physical light decay
        castShadow
      />

      {/* Bloom Effect - The magic glow */}
      <BloomEffect>
        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>

        {/* Contact Shadows for realism */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={50}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
      </BloomEffect>

      {/* Spline-style Camera Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={0}
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        rotateSpeed={0.5}
        zoomSpeed={1}
        panSpeed={0.8}
      />

      {/* Performance optimization */}
      <BakeShadows />
    </Canvas>
  );
}
