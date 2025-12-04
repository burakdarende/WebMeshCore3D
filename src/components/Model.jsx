// ═══════════════════════════════════════════════════════════════════════════════
// MODEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
// GLTF Model loader with advanced material processing

import React, { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { analyzeMaterials } from "../utils/splineFeatures.js";

export function Model({
  modelPath = "/models/bdr_room_1.glb",
  qualitySettings,
}) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const analysisDoneRef = React.useRef(false);

  useEffect(() => {
    if (gltf?.scene && !analysisDoneRef.current) {
      analysisDoneRef.current = true;
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
                    `✨ Enhanced "${mat.name
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

      // Delayed material analysis for Spline features
      setTimeout(() => {
        if (gltf.scene && gltf.scene.children.length > 0) {
          const materialAnalysis = analyzeMaterials(gltf.scene);
          console.log("🎨 SPLINE-STYLE Material Analysis:", materialAnalysis);

          if (materialAnalysis.emissive.length > 0) {
            console.log(
              `✨ Found ${materialAnalysis.emissive.length} emissive materials - Bloom optimized!`
            );
          }
        }
      }, 1000);
    }
  }, [gltf, qualitySettings]);

  return <primitive object={gltf.scene} />;
}
