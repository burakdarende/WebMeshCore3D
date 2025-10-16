import React, { Suspense, useEffect } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useProgress,
  Environment,
  ContactShadows,
  SoftShadows,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";

// Extend R3F with post-processing classes
extend({ EffectComposer, RenderPass, UnrealBloomPass, OutputPass });

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % yükleniyor</Html>;
}

// Don McCurdy's bloom post-processing setup
function BloomEffect() {
  const { gl, scene, camera } = useThree();
  const composer = React.useRef();

  React.useEffect(() => {
    if (!gl || !scene || !camera) return;

    // Create effect composer
    const effectComposer = new EffectComposer(gl);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    // Add bloom pass with reduced intensity
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.2, // strength: 0.2 (reduced from 0.5 for subtler effect)
      0.1, // radius: smaller radius for tighter glow
      1 // threshold: 20 nits (higher threshold = less bloom)
    );
    effectComposer.addPass(bloomPass);

    // Add output pass for tone mapping
    const outputPass = new OutputPass();
    effectComposer.addPass(outputPass);

    composer.current = effectComposer;

    // Handle resize
    const handleResize = () => {
      effectComposer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gl, scene, camera]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
}

function Model() {
  const gltf = useLoader(GLTFLoader, "/models/bdr_room_1.glb");

  useEffect(() => {
    if (gltf?.scene) {
      console.log("🎨 SPLINE-STYLE: Model loaded, analyzing materials...");
      console.log("═══════════════════════════════════════════════════");

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

      // Second pass: Analyze and enhance materials
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

            // Don McCurdy's emission and bloom approach
            if (mat.emissive && mat.emissive.getHex() !== 0x000000) {
              emissiveMaterials++;

              // Use Don McCurdy's recommended intensity range: 1-256 nits
              const baseIntensity = original?.emissiveIntensity || 1;

              // Standard emissive materials: subtle intensity for bloom
              mat.emissiveIntensity = Math.max(baseIntensity * 4, 8); // 8-60 nits range

              // Special enhancement for single-letter materials (likely UI elements)
              if (mat.name && mat.name.length <= 2) {
                // Moderate intensity for balanced bloom effect
                mat.emissiveIntensity = 40; // 40 nits - above bloom threshold but not overwhelming

                enhancedMaterials++;
                console.log(
                  `🌟 MODERATE EMISSIVE: "${mat.name}" -> ${mat.emissiveIntensity} nits`
                );
              } else {
                // Low intensity for very subtle bloom
                mat.emissiveIntensity = Math.min(mat.emissiveIntensity, 25); // Cap at 25 nits
              }
              console.log(
                `✨ Enhanced "${
                  mat.name
                }" -> Final Intensity: ${mat.emissiveIntensity.toFixed(1)}`
              );
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
              console.log(
                `💡 Adding emission to light-named material: "${mat.name}"`
              );
              mat.emissive = mat.emissive || new THREE.Color();
              mat.emissive.setRGB(1, 0.9, 0.7); // Warm white
              mat.emissiveIntensity = 3;
              enhancedMaterials++;
            }

            mat.needsUpdate = true;
          });
        }
      });

      console.log(`\n📊 MATERIAL ANALYSIS COMPLETE:`);
      console.log(`   Total Materials: ${totalMaterials}`);
      console.log(`   Emissive Materials: ${emissiveMaterials}`);
      console.log(`   Enhanced Materials: ${enhancedMaterials}`);
      console.log("═══════════════════════════════════════════════════");
    }
  }, [gltf]);

  return <primitive object={gltf.scene} />;
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 75 }}
      shadows // Enable shadows
      gl={{
        antialias: true,
        toneMapping: THREE.AgXToneMapping, // Don McCurdy's recommended AgX tone mapping
        toneMappingExposure: 0.5, // Don McCurdy's recommended 0.5 exposure
        outputColorSpace: THREE.SRGBColorSpace,
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap,
        },
      }}
    >
      {/* Don McCurdy approach: Proper scene lighting independent of emissives */}
      <color attach="background" args={["#1a1a2e"]} />
      <Environment preset="city" />
      <SoftShadows />

      {/* Balanced ambient lighting for the scene */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Key Light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={3}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Fill Light */}
      <directionalLight position={[-5, 5, -5]} intensity={1} color="#87CEEB" />

      {/* Rim Light */}
      <pointLight
        position={[0, 5, -10]}
        intensity={2}
        color="#FFA500"
        distance={20}
        castShadow
      />

      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>

      {/* Contact Shadows for realism */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.3}
        scale={30}
        blur={1}
        far={5}
        resolution={256}
        color="#000000"
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={15}
        maxPolarAngle={Math.PI / 1.5}
      />

      {/* Don McCurdy's bloom post-processing */}
      <BloomEffect />
    </Canvas>
  );
}
