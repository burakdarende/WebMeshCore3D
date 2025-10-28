// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// High-Quality Selective Bloom System with PostProcessing and Controls

import React, { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  BloomEffect,
  EffectPass,
  SMAAEffect,
  FXAAEffect,
  BlendFunction,
  Selection, // Selective bloom için eklendi
} from "postprocessing";

// Import centralized bloom configuration
import { VISUAL_CONFIG } from "../../config/app-config";

// Main BloomSystem component that combines PostProcessing and Controls
export function BloomSystem({
  DEVELOPER_CONFIG,
  VISUAL_CONFIG,
  qualitySettings,
}) {
  const { gl, scene, camera, size } = useThree();
  const [composer] = useState(
    () => new EffectComposer(gl, { multisampling: 0 })
  );
  // Bloom parametreleri için state eklendi
  const [bloomParams, setBloomParams] = useState(VISUAL_CONFIG.bloom);

  // Debug UI'ın bu state'i güncelleyebilmesi için setBloomParams'ı window'a ata
  useEffect(() => {
    if (DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) {
      window.bloomControls = {
        setParams: setBloomParams,
      };
    }
  }, [DEVELOPER_CONFIG.ENABLE_DEBUG_MODE]);

  useEffect(() => {
    composer.removeAllPasses();

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Sadece layer 1'deki nesneleri seçecek bir selection oluştur
    const selection = new Selection();
    selection.layers.set(1); // BLOOM_SCENE layer'ı

    const bloomEffect = new BloomEffect({
      ...bloomParams, // State'den gelen dinamik parametreleri kullan
      blendFunction: BlendFunction.ADD,
      selection: selection, // Selective bloom için selection'ı ekle
    });

    let antiAliasingEffect;
    if (qualitySettings.enableSMAA) {
      antiAliasingEffect = new SMAAEffect();
    } else if (qualitySettings.enableFXAA) {
      antiAliasingEffect = new FXAAEffect();
    }

    const effectPass = new EffectPass(
      camera,
      ...(antiAliasingEffect ? [antiAliasingEffect] : []),
      bloomEffect
    );
    composer.addPass(effectPass);

    return () => {
      composer.removeAllPasses();
    };
  }, [composer, scene, camera, size, bloomParams, qualitySettings]); // Bağımlılıklara bloomParams ve qualitySettings eklendi

  useFrame((state, delta) => {
    composer.render(delta);
  }, 1);

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
