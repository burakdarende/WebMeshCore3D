// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// Advanced Lighting Configuration with Multiple Light Types

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const LIGHTING_CONFIG = {
  // Ambient light settings
  ambient: {
    color: "#ffffff",
    intensity: 0.2,
    enabled: true,
  },

  // Directional light settings
  directional: {
    color: "#ffffff",
    intensity: 1.0,
    position: { x: 5, y: 5, z: 5 },
    target: { x: 0, y: 0, z: 0 },
    castShadow: true,
    shadowMapSize: 1024,
    shadowCamera: {
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: 0.1,
      far: 50,
    },
    enabled: true,
  },

  // Point light settings
  point: {
    color: "#ffffff",
    intensity: 1.0,
    position: { x: 0, y: 3, z: 0 },
    distance: 100,
    decay: 2,
    castShadow: false,
    enabled: false,
  },

  // Spot light settings
  spot: {
    color: "#ffffff",
    intensity: 1.0,
    position: { x: 0, y: 5, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    angle: Math.PI / 6,
    penumbra: 0.1,
    distance: 100,
    decay: 2,
    castShadow: false,
    enabled: false,
  },

  // Hemisphere light settings
  hemisphere: {
    skyColor: "#87CEEB",
    groundColor: "#8B4513",
    intensity: 0.3,
    enabled: false,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING SYSTEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function LightingSystem({ isDebugMode = false }) {
  // Lighting states
  const [lightingParams, setLightingParams] = useState({
    ambient: { ...LIGHTING_CONFIG.ambient },
    directional: { ...LIGHTING_CONFIG.directional },
    point: { ...LIGHTING_CONFIG.point },
    spot: { ...LIGHTING_CONFIG.spot },
    hemisphere: { ...LIGHTING_CONFIG.hemisphere },
  });

  // Light references for dynamic updates
  const ambientLightRef = useRef();
  const directionalLightRef = useRef();
  const pointLightRef = useRef();
  const spotLightRef = useRef();
  const hemisphereLightRef = useRef();

  // Update light properties when params change
  useEffect(() => {
    // Ambient Light
    if (ambientLightRef.current) {
      ambientLightRef.current.color.set(lightingParams.ambient.color);
      ambientLightRef.current.intensity = lightingParams.ambient.intensity;
      ambientLightRef.current.visible = lightingParams.ambient.enabled;
    }

    // Directional Light
    if (directionalLightRef.current) {
      const dirLight = directionalLightRef.current;
      dirLight.color.set(lightingParams.directional.color);
      dirLight.intensity = lightingParams.directional.intensity;
      dirLight.position.set(
        lightingParams.directional.position.x,
        lightingParams.directional.position.y,
        lightingParams.directional.position.z
      );
      dirLight.target.position.set(
        lightingParams.directional.target.x,
        lightingParams.directional.target.y,
        lightingParams.directional.target.z
      );
      dirLight.castShadow = lightingParams.directional.castShadow;
      dirLight.visible = lightingParams.directional.enabled;

      // Update shadow camera
      if (dirLight.shadow) {
        const shadowCam = lightingParams.directional.shadowCamera;
        dirLight.shadow.camera.left = shadowCam.left;
        dirLight.shadow.camera.right = shadowCam.right;
        dirLight.shadow.camera.top = shadowCam.top;
        dirLight.shadow.camera.bottom = shadowCam.bottom;
        dirLight.shadow.camera.near = shadowCam.near;
        dirLight.shadow.camera.far = shadowCam.far;
        dirLight.shadow.mapSize.setScalar(
          lightingParams.directional.shadowMapSize
        );
        dirLight.shadow.camera.updateProjectionMatrix();
      }
    }

    // Point Light
    if (pointLightRef.current) {
      const pointLight = pointLightRef.current;
      pointLight.color.set(lightingParams.point.color);
      pointLight.intensity = lightingParams.point.intensity;
      pointLight.position.set(
        lightingParams.point.position.x,
        lightingParams.point.position.y,
        lightingParams.point.position.z
      );
      pointLight.distance = lightingParams.point.distance;
      pointLight.decay = lightingParams.point.decay;
      pointLight.castShadow = lightingParams.point.castShadow;
      pointLight.visible = lightingParams.point.enabled;
    }

    // Spot Light
    if (spotLightRef.current) {
      const spotLight = spotLightRef.current;
      spotLight.color.set(lightingParams.spot.color);
      spotLight.intensity = lightingParams.spot.intensity;
      spotLight.position.set(
        lightingParams.spot.position.x,
        lightingParams.spot.position.y,
        lightingParams.spot.position.z
      );
      spotLight.target.position.set(
        lightingParams.spot.target.x,
        lightingParams.spot.target.y,
        lightingParams.spot.target.z
      );
      spotLight.angle = lightingParams.spot.angle;
      spotLight.penumbra = lightingParams.spot.penumbra;
      spotLight.distance = lightingParams.spot.distance;
      spotLight.decay = lightingParams.spot.decay;
      spotLight.castShadow = lightingParams.spot.castShadow;
      spotLight.visible = lightingParams.spot.enabled;
    }

    // Hemisphere Light
    if (hemisphereLightRef.current) {
      const hemiLight = hemisphereLightRef.current;
      hemiLight.color.set(lightingParams.hemisphere.skyColor);
      hemiLight.groundColor.set(lightingParams.hemisphere.groundColor);
      hemiLight.intensity = lightingParams.hemisphere.intensity;
      hemiLight.visible = lightingParams.hemisphere.enabled;
    }
  }, [lightingParams]);

  // Expose lighting controls for external access
  useEffect(() => {
    window.lightingControls = {
      params: lightingParams,
      setParams: setLightingParams,
      resetToDefault: () => {
        setLightingParams({
          ambient: { ...LIGHTING_CONFIG.ambient },
          directional: { ...LIGHTING_CONFIG.directional },
          point: { ...LIGHTING_CONFIG.point },
          spot: { ...LIGHTING_CONFIG.spot },
          hemisphere: { ...LIGHTING_CONFIG.hemisphere },
        });
      },
      getLights: () => ({
        ambient: ambientLightRef.current,
        directional: directionalLightRef.current,
        point: pointLightRef.current,
        spot: spotLightRef.current,
        hemisphere: hemisphereLightRef.current,
      }),
    };

    // Store lighting data for external UI access
    if (isDebugMode) {
      window.lightingDebugData = {
        lightingParams,
        setLightingParams,
      };
    }
  }, [lightingParams, isDebugMode]);

  return (
    <>
      {/* Ambient Light */}
      <ambientLight
        ref={ambientLightRef}
        color={lightingParams.ambient.color}
        intensity={lightingParams.ambient.intensity}
        visible={lightingParams.ambient.enabled}
      />

      {/* Directional Light */}
      <directionalLight
        ref={directionalLightRef}
        color={lightingParams.directional.color}
        intensity={lightingParams.directional.intensity}
        position={[
          lightingParams.directional.position.x,
          lightingParams.directional.position.y,
          lightingParams.directional.position.z,
        ]}
        castShadow={lightingParams.directional.castShadow}
        visible={lightingParams.directional.enabled}
        shadow-mapSize={[
          lightingParams.directional.shadowMapSize,
          lightingParams.directional.shadowMapSize,
        ]}
        shadow-camera-left={lightingParams.directional.shadowCamera.left}
        shadow-camera-right={lightingParams.directional.shadowCamera.right}
        shadow-camera-top={lightingParams.directional.shadowCamera.top}
        shadow-camera-bottom={lightingParams.directional.shadowCamera.bottom}
        shadow-camera-near={lightingParams.directional.shadowCamera.near}
        shadow-camera-far={lightingParams.directional.shadowCamera.far}
      />

      {/* Point Light */}
      <pointLight
        ref={pointLightRef}
        color={lightingParams.point.color}
        intensity={lightingParams.point.intensity}
        position={[
          lightingParams.point.position.x,
          lightingParams.point.position.y,
          lightingParams.point.position.z,
        ]}
        distance={lightingParams.point.distance}
        decay={lightingParams.point.decay}
        castShadow={lightingParams.point.castShadow}
        visible={lightingParams.point.enabled}
      />

      {/* Spot Light */}
      <spotLight
        ref={spotLightRef}
        color={lightingParams.spot.color}
        intensity={lightingParams.spot.intensity}
        position={[
          lightingParams.spot.position.x,
          lightingParams.spot.position.y,
          lightingParams.spot.position.z,
        ]}
        angle={lightingParams.spot.angle}
        penumbra={lightingParams.spot.penumbra}
        distance={lightingParams.spot.distance}
        decay={lightingParams.spot.decay}
        castShadow={lightingParams.spot.castShadow}
        visible={lightingParams.spot.enabled}
        target-position={[
          lightingParams.spot.target.x,
          lightingParams.spot.target.y,
          lightingParams.spot.target.z,
        ]}
      />

      {/* Hemisphere Light */}
      <hemisphereLight
        ref={hemisphereLightRef}
        color={lightingParams.hemisphere.skyColor}
        groundColor={lightingParams.hemisphere.groundColor}
        intensity={lightingParams.hemisphere.intensity}
        visible={lightingParams.hemisphere.enabled}
      />
    </>
  );
}
