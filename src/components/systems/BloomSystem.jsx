// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// High-Quality PMNDRS PostProcessing System (Bloom, AA, ToneMapping)

import React, { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Modern Post-Processing (PMNDRS) kütüphanesi
import {
  EffectComposer as PMEffectComposer,
  EffectPass,
  RenderPass as PMRenderPass,
  BloomEffect as PMBloomEffect,
  SMAAEffect,
  FXAAEffect,
  ToneMappingEffect,
  ToneMappingMode,
} from "postprocessing";

// Import centralized bloom configuration
import { VISUAL_CONFIG } from "../../config/app-config";

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

const getInitialBloomParams = () => {
  try {
    const saved = localStorage.getItem("webmesh-bloom-settings");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("Failed to load bloom settings from localStorage:", error);
  }

  return {
    luminanceThreshold: VISUAL_CONFIG.bloom.luminanceThreshold,
    luminanceSmoothing: VISUAL_CONFIG.bloom.luminanceSmoothing,
    intensity: VISUAL_CONFIG.bloom.intensity,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST PROCESSING EFFECT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function PostProcessingEffect({ qualitySettings, bloomParams }) {
  const { gl, scene, camera, size } = useThree();
  const [isEnabled, setIsEnabled] = useState(true);

  const composerRef = useRef();
  const bloomEffectRef = useRef();

  // Ana Post-Processing kurulumu
  useEffect(() => {
    if (!isEnabled || !gl || !scene || !camera || !qualitySettings) return;

    try {
      console.log(
        "🌟 Rebuilding Modern Post-Processing System (PMNDRS)...",
        qualitySettings
      );

      const composer = new PMEffectComposer(gl, {
        multisampling: 0,
        frameBufferType: THREE.HalfFloatType,
      });
      composerRef.current = composer;

      // --- YENİ: Composer'ı global scope'a ata ---
      // QualityRuntimeUpdater'ın erişebilmesi için.
      window.postProcessingComposer = composer;
      // --- BİTTİ ---

      composer.addPass(new PMRenderPass(scene, camera));
      const effects = [];

      const bloomEffect = new PMBloomEffect({
        luminanceThreshold: bloomParams.luminanceThreshold,
        luminanceSmoothing: bloomParams.luminanceSmoothing,
        intensity: bloomParams.intensity,
        mipmapBlur: VISUAL_CONFIG.bloom.mipmapBlur,
      });
      bloomEffectRef.current = bloomEffect;
      effects.push(bloomEffect);

      if (qualitySettings.enableSMAA) {
        effects.push(new SMAAEffect());
        console.log("✅ SMAA enabled.");
      } else if (qualitySettings.enableFXAA) {
        effects.push(new FXAAEffect());
        console.log("✅ FXAA enabled.");
      } else {
        console.log("⚪️ No Anti-Aliasing enabled.");
      }

      effects.push(
        new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC })
      );

      const effectPass = new EffectPass(camera, ...effects);
      composer.addPass(effectPass);

      console.log("✅ Modern Post-Processing System initialized successfully");

      const handleResize = () => {
        if (composerRef.current) {
          composerRef.current.setSize(size.width, size.height);
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (composerRef.current) {
          console.log("♻️ Disposing Post-Processing chain.");
          composerRef.current.dispose();
        }
        // --- YENİ: Global scope'u temizle ---
        window.postProcessingComposer = null;
        // --- BİTTİ ---
      };
    } catch (error) {
      console.error("❌ Modern Post-Processing System error:", error);
      setIsEnabled(false);
    }
  }, [gl, scene, camera, size, isEnabled, qualitySettings]);

  // SADECE bloomParams'ı dinamik olarak günceller
  useEffect(() => {
    if (bloomEffectRef.current) {
      bloomEffectRef.current.luminanceMaterial.threshold =
        bloomParams.luminanceThreshold;
      bloomEffectRef.current.luminanceMaterial.smoothing =
        bloomParams.luminanceSmoothing;
      bloomEffectRef.current.intensity = bloomParams.intensity;
    }
  }, [bloomParams]);

  useFrame((state, delta) => {
    if (composerRef.current) {
      composerRef.current.render(delta);
    }
  }, 1);

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM CONTROLS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function BloomControls({ isDebugMode, bloomParams, setBloomParams }) {
  if (!isDebugMode) {
    return null;
  }
  useEffect(() => {
    window.bloomDebugData = {
      bloomParams,
      setBloomParams,
    };
  }, [bloomParams, setBloomParams]);

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANA BLOOM SYSTEM COMPONENT'İ
// ═══════════════════════════════════════════════════════════════════════════════

export function BloomSystem({
  DEVELOPER_CONFIG,
  VISUAL_CONFIG,
  qualitySettings,
}) {
  const [bloomParams, setBloomParams] = useState(getInitialBloomParams);

  useEffect(() => {
    try {
      localStorage.setItem(
        "webmesh-bloom-settings",
        JSON.stringify(bloomParams)
      );
    } catch (error) {
      console.warn("Failed to save bloom settings to localStorage:", error);
    }
  }, [bloomParams]);

  return (
    <>
      <PostProcessingEffect
        qualitySettings={qualitySettings}
        bloomParams={bloomParams}
      />
      <BloomControls
        isDebugMode={DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE}
        bloomParams={bloomParams}
        setBloomParams={setBloomParams}
      />
    </>
  );
}

export default BloomSystem;
