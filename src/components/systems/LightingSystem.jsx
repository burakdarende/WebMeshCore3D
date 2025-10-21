// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING SYSTEM - SIMPLIFIED
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from "react";
import { VISUAL_CONFIG } from "../../config/app-config";

export function LightingSystem({
  lightingState,
  setLightingState,
  isDebugMode = false,
}) {
  const ambientLightRef = useRef();
  const directionalLightRef = useRef();

  // Update lights when lightingState changes
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = lightingState.ambientIntensity;
    }

    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = lightingState.keyLightIntensity;
    }
  }, [lightingState]);

  // Export debug data
  useEffect(() => {
    if (isDebugMode) {
      window.lightingDebugData = {
        ambientIntensity: lightingState.ambientIntensity,
        keyLightIntensity: lightingState.keyLightIntensity,
        fillLightIntensity: lightingState.fillLightIntensity,
        rimLightIntensity: lightingState.rimLightIntensity,
        setLightingState: setLightingState,
      };
    }
  }, [lightingState, setLightingState, isDebugMode]);

  return (
    <>
      {/* Ambient Light */}
      <ambientLight
        ref={ambientLightRef}
        color={VISUAL_CONFIG.ambientLight.color}
        intensity={lightingState.ambientIntensity}
      />

      {/* Key Light (Directional) */}
      <directionalLight
        ref={directionalLightRef}
        color={VISUAL_CONFIG.keyLight.color}
        intensity={lightingState.keyLightIntensity}
        position={VISUAL_CONFIG.keyLight.position}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />

      {/* Fill Light (Directional) */}
      <directionalLight
        color={VISUAL_CONFIG.fillLight.color}
        intensity={lightingState.fillLightIntensity * 0.6}
        position={VISUAL_CONFIG.fillLight.position}
        castShadow={false}
      />

      {/* Rim Light (Point) */}
      <pointLight
        color={VISUAL_CONFIG.rimLight.color}
        intensity={lightingState.rimLightIntensity * 0.5}
        position={VISUAL_CONFIG.rimLight.position}
        distance={10}
        decay={2}
        castShadow={false}
      />
    </>
  );
}
