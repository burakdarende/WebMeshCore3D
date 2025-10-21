// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// High-Quality Selective Bloom System with PostProcessing and Controls

import React, { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

// Import centralized bloom configuration
import { VISUAL_CONFIG } from "../../config/app-config";

// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// Configuration now imported from centralized app-config.js

// ═══════════════════════════════════════════════════════════════════════════════
// POST PROCESSING EFFECT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function PostProcessingEffect() {
  const { gl, scene, camera, size } = useThree();
  const [isEnabled, setIsEnabled] = useState(true);

  // Persistent bloom parameters - don't reset when dependencies change
  const [bloomParams, setBloomParams] = useState(() => ({
    threshold: VISUAL_CONFIG.bloom.threshold,
    strength: VISUAL_CONFIG.bloom.strength,
    radius: VISUAL_CONFIG.bloom.radius,
    exposure: VISUAL_CONFIG.bloom.exposure,
  }));

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
      if (VISUAL_CONFIG.quality.enableSMAA) {
        const smaaPass = new SMAAPass(
          size.width * gl.getPixelRatio(),
          size.height * gl.getPixelRatio()
        );
        finalComposer.current.addPass(smaaPass);
      }

      if (VISUAL_CONFIG.quality.enableFXAA) {
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
  useEffect(() => {
    if (bloomPassRef.current && gl) {
      bloomPassRef.current.threshold = bloomParams.threshold;
      bloomPassRef.current.strength = bloomParams.strength;
      bloomPassRef.current.radius = bloomParams.radius;
      gl.toneMappingExposure = Math.pow(bloomParams.exposure, 4.0);
    }
  }, [bloomParams, gl]);

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
    setParams: setBloomParams,
    params: bloomParams,
    isEnabled,
    setEnabled: setIsEnabled,
  };

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM CONTROLS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function BloomControls({ isDebugMode }) {
  // Early return if developer bloom controls are disabled
  if (!isDebugMode) {
    return null;
  }

  const [bloomParams, setBloomParams] = useState({
    threshold: VISUAL_CONFIG.bloom.threshold,
    strength: VISUAL_CONFIG.bloom.strength,
    radius: VISUAL_CONFIG.bloom.radius,
    exposure: VISUAL_CONFIG.bloom.exposure || 1.0,
  });

  // Update global bloom controls when params change
  useEffect(() => {
    if (window.bloomControls) {
      window.bloomControls.setParams(bloomParams);
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

// Main BloomSystem component that combines PostProcessing and Controls
export function BloomSystem({ DEVELOPER_CONFIG, VISUAL_CONFIG }) {
  return (
    <>
      <PostProcessingEffect />
      <BloomControls isDebugMode={DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE} />
    </>
  );
}

export default BloomSystem;
