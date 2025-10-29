// ═══════════════════════════════════════════════════════════════════════════════
// ADVANCED LIGHTING SYSTEM - Unified Approach
// Features: Interactive light helpers (debug), clean lights (production)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DEFAULT_LIGHTS } from "./LightingConfig";

export function LightingSystem({
  isDebugMode = false,
  helpersVisible = true,
  DEVELOPER_CONFIG,
}) {
  const { scene, camera, gl } = useThree();

  // Light refs for direct control - now supporting multiple lights
  const ambientLightRef = useRef(); // Single ambient light
  const directionalLightRef = useRef(); // Single directional light
  const spotLightsRef = useRef([]); // Array of spot lights
  const pointLightsRef = useRef([]); // Array of point lights

  // Helper refs for visibility control - now supporting multiple helpers
  const directionalHelperRef = useRef();
  const spotHelpersRef = useRef([]); // Array of spot light helpers
  const pointHelpersRef = useRef([]); // Array of point light helpers

  // Advanced lighting state - now supporting multiple lights with localStorage
  const getInitialLightingState = () => {
    try {
      const saved = localStorage.getItem("webmesh-lighting-settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn(
        "Failed to load lighting settings from localStorage:",
        error
      );
    }

    // Default state: use DEFAULT_LIGHTS from LightingConfig
    return DEFAULT_LIGHTS;
  };

  const [advancedLights, setAdvancedLights] = useState(getInitialLightingState);

  // Light management functions
  const addSpotLight = useCallback(() => {
    const newId = `spot${advancedLights.spots.length + 1}`;
    setAdvancedLights((prev) => ({
      ...prev,
      spots: [
        ...prev.spots,
        {
          id: newId,
          intensity: 1.2,
          color: "#ffddaa",
          position: {
            x: Math.random() * 4 - 2,
            y: 3,
            z: Math.random() * 4 - 2,
          },
          target: { x: 0, y: 0, z: 0 },
          linkToCenter: true,
          angle: Math.PI / 6,
          penumbra: 0.2,
          distance: 10,
          decay: 1,
          castShadow: false,
          visible: true,
        },
      ],
    }));
  }, [advancedLights.spots.length]);

  const addPointLight = useCallback(() => {
    const newId = `point${advancedLights.points.length + 1}`;
    setAdvancedLights((prev) => ({
      ...prev,
      points: [
        ...prev.points,
        {
          id: newId,
          intensity: 0.6,
          color: "#aaffdd",
          position: {
            x: Math.random() * 4 - 2,
            y: 2,
            z: Math.random() * 4 - 2,
          },
          distance: 8,
          decay: 2,
          castShadow: false,
          visible: true,
        },
      ],
    }));
  }, [advancedLights.points.length]);

  const removeSpotLight = useCallback((lightId) => {
    setAdvancedLights((prev) => ({
      ...prev,
      spots: prev.spots.filter((light) => light.id !== lightId),
    }));
  }, []);

  const removePointLight = useCallback((lightId) => {
    setAdvancedLights((prev) => ({
      ...prev,
      points: prev.points.filter((light) => light.id !== lightId),
    }));
  }, []);

  // Interaction state
  const [selectedLight, setSelectedLight] = useState(null);
  const mainGroupRef = useRef();

  // Mouse interaction
  const pointer = useRef(new THREE.Vector2());
  const raycasterHelper = useRef(new THREE.Raycaster());

  // Save lighting settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "webmesh-lighting-settings",
        JSON.stringify(advancedLights)
      );
    } catch (error) {
      console.warn("Failed to save lighting settings to localStorage:", error);
    }
  }, [advancedLights]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // UNIFIED LIGHTING SETUP - Works for both debug and production
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!scene) return;

    console.log(
      `🌟 Setting up ${
        isDebugMode ? "interactive" : "production"
      } lighting system...`
    );

    // Create main group for organization
    if (!mainGroupRef.current) {
      mainGroupRef.current = new THREE.Group();
      mainGroupRef.current.name = "LightingGroup";
      scene.add(mainGroupRef.current);
    }

    const mainGroup = mainGroupRef.current;

    // ═══════════════════════════════════════════════════════════════════════════════
    // AMBIENT LIGHT SETUP
    // ═══════════════════════════════════════════════════════════════════════════════

    if (ambientLightRef.current) {
      mainGroup.remove(ambientLightRef.current);
    }

    const ambientLight = new THREE.AmbientLight(
      advancedLights.ambient.color,
      advancedLights.ambient.intensity
    );
    ambientLight.visible = advancedLights.ambient.visible;
    ambientLightRef.current = ambientLight;
    mainGroup.add(ambientLight);

    // ═══════════════════════════════════════════════════════════════════════════════
    // DIRECTIONAL LIGHT SETUP + HELPER
    // ═══════════════════════════════════════════════════════════════════════════════

    if (directionalLightRef.current) {
      mainGroup.remove(directionalLightRef.current);
    }
    if (directionalHelperRef.current) {
      mainGroup.remove(directionalHelperRef.current);
    }

    const directionalLight = new THREE.DirectionalLight(
      advancedLights.directional.color,
      advancedLights.directional.intensity
    );
    directionalLight.position.set(
      advancedLights.directional.position.x,
      advancedLights.directional.position.y,
      advancedLights.directional.position.z
    );

    // Set target for directional light
    if (advancedLights.directional.linkToCenter) {
      directionalLight.target.position.set(0, 0, 0); // Always look at center
    } else {
      directionalLight.target.position.set(
        advancedLights.directional.target.x,
        advancedLights.directional.target.y,
        advancedLights.directional.target.z
      );
    }

    directionalLight.castShadow = advancedLights.directional.castShadow;
    directionalLight.visible = advancedLights.directional.visible;
    directionalLight.userData = { id: "directional", type: "DirectionalLight" };

    const directionalHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      2
    );
    directionalHelper.userData = { lightId: "directional", isHelper: true };
    directionalHelper.visible =
      advancedLights.directional.visible && isDebugMode && helpersVisible;

    directionalLightRef.current = directionalLight;
    directionalHelperRef.current = directionalHelper;

    // Add helper only in debug mode
    if (isDebugMode) {
      mainGroup.add(
        directionalLight,
        directionalLight.target,
        directionalHelper
      );
    } else {
      mainGroup.add(directionalLight, directionalLight.target);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // MULTIPLE SPOT LIGHTS SETUP + HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════

    // Clean up existing spot lights
    spotLightsRef.current.forEach((light) => {
      if (light) mainGroup.remove(light);
    });
    spotHelpersRef.current.forEach((helper) => {
      if (helper) mainGroup.remove(helper);
    });
    spotLightsRef.current = [];
    spotHelpersRef.current = [];

    // Create spot lights
    advancedLights.spots.forEach((spotConfig, index) => {
      const spotLight = new THREE.SpotLight(
        spotConfig.color,
        spotConfig.intensity,
        spotConfig.distance,
        spotConfig.angle,
        spotConfig.penumbra,
        spotConfig.decay
      );

      spotLight.position.set(
        spotConfig.position.x,
        spotConfig.position.y,
        spotConfig.position.z
      );

      // Set target for spot light
      if (spotConfig.linkToCenter) {
        spotLight.target.position.set(0, 0, 0); // Always look at center
      } else {
        spotLight.target.position.set(
          spotConfig.target.x,
          spotConfig.target.y,
          spotConfig.target.z
        );
      }

      spotLight.castShadow = spotConfig.castShadow;
      spotLight.visible = spotConfig.visible;
      spotLight.userData = { id: spotConfig.id, type: "SpotLight", index };

      // Create helper
      const spotHelper = new THREE.SpotLightHelper(spotLight);
      spotHelper.userData = { lightId: spotConfig.id, isHelper: true, index };
      spotHelper.visible = spotConfig.visible && isDebugMode && helpersVisible;

      // Store references
      spotLightsRef.current[index] = spotLight;
      spotHelpersRef.current[index] = spotHelper;

      // Add to scene
      if (isDebugMode) {
        mainGroup.add(spotLight, spotLight.target, spotHelper);
      } else {
        mainGroup.add(spotLight, spotLight.target);
      }
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // MULTIPLE POINT LIGHTS SETUP + HELPERS
    // ═══════════════════════════════════════════════════════════════════════════════

    // Clean up existing point lights
    pointLightsRef.current.forEach((light) => {
      if (light) mainGroup.remove(light);
    });
    pointHelpersRef.current.forEach((helper) => {
      if (helper) mainGroup.remove(helper);
    });
    pointLightsRef.current = [];
    pointHelpersRef.current = [];

    // Create point lights
    advancedLights.points.forEach((pointConfig, index) => {
      const pointLight = new THREE.PointLight(
        pointConfig.color,
        pointConfig.intensity,
        pointConfig.distance,
        pointConfig.decay
      );

      pointLight.position.set(
        pointConfig.position.x,
        pointConfig.position.y,
        pointConfig.position.z
      );

      pointLight.castShadow = pointConfig.castShadow;
      pointLight.visible = pointConfig.visible;
      pointLight.userData = { id: pointConfig.id, type: "PointLight", index };

      // Create helper
      const pointHelper = new THREE.PointLightHelper(pointLight, 0.5);
      pointHelper.userData = { lightId: pointConfig.id, isHelper: true, index };
      pointHelper.visible =
        pointConfig.visible && isDebugMode && helpersVisible;

      // Store references
      pointLightsRef.current[index] = pointLight;
      pointHelpersRef.current[index] = pointHelper;

      // Add to scene
      if (isDebugMode) {
        mainGroup.add(pointLight, pointHelper);
      } else {
        mainGroup.add(pointLight);
      }
    });

    console.log(
      `✅ ${
        isDebugMode ? "Interactive" : "Production"
      } lighting system setup complete!`
    );

    // Cleanup function
    return () => {
      if (mainGroupRef.current) {
        scene.remove(mainGroupRef.current);
        mainGroupRef.current = null;
      }
    };
  }, [scene, advancedLights, isDebugMode]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // MOUSE INTERACTION SYSTEM - Raycaster Selection
  // ═══════════════════════════════════════════════════════════════════════════════

  const onMouseMove = useCallback(
    (event) => {
      if (!isDebugMode || !scene || !camera) return;

      // Calculate pointer position in normalized device coordinates
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterHelper.current.setFromCamera(pointer.current, camera);
      const intersects = raycasterHelper.current.intersectObjects(
        scene.children,
        true
      );

      // Reset all helpers to default color
      // Directional helper
      if (
        directionalHelperRef.current &&
        directionalHelperRef.current.material
      ) {
        if (directionalHelperRef.current.material.color) {
          directionalHelperRef.current.material.color.setHex(0xffffff);
        }
      }

      // Spot light helpers
      spotHelpersRef.current.forEach((helperRef) => {
        if (helperRef && helperRef.material) {
          if (helperRef.material.color) {
            helperRef.material.color.setHex(0xffffff);
          }
        }
      });

      // Point light helpers
      pointHelpersRef.current.forEach((helperRef) => {
        if (helperRef && helperRef.material) {
          if (helperRef.material.color) {
            helperRef.material.color.setHex(0xffffff);
          }
        }
      });

      // Highlight intersected light helpers
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData && object.userData.isHelper) {
          // Change helper color to indicate hover
          if (object.material && object.material.color) {
            object.material.color.setHex(0xff0000);
          }
          break;
        }
      }
    },
    [isDebugMode, scene, camera]
  );

  const onMouseClick = useCallback(
    (event) => {
      if (!isDebugMode || !scene || !camera) return;

      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterHelper.current.setFromCamera(pointer.current, camera);
      const intersects = raycasterHelper.current.intersectObjects(
        scene.children,
        true
      );

      // Check for light helper selection
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData && object.userData.isHelper) {
          const lightId = object.userData.lightId;
          console.log(`🎯 Selected light: ${lightId}`);
          setSelectedLight(lightId);
          event.stopPropagation();
          break;
        }
      }
    },
    [isDebugMode, scene, camera]
  );

  // Add mouse event listeners
  useEffect(() => {
    if (!isDebugMode || typeof window === "undefined") return;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onMouseClick);
    };
  }, [onMouseMove, onMouseClick, isDebugMode]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS - ESC to deselect only
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!isDebugMode || typeof window === "undefined") return;

    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case "escape":
          setSelectedLight(null);
          console.log(`🎮 Light deselected`);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDebugMode]);

  // Update helpers each frame to sync with lights
  useFrame(() => {
    if (!isDebugMode) return;

    // Update helpers to sync with light positions
    if (directionalHelperRef.current && directionalLightRef.current) {
      directionalHelperRef.current.update();
    }

    // Update spot light helpers
    spotHelpersRef.current.forEach((helper) => {
      if (helper) helper.update();
    });

    // Point light helpers update automatically
  });

  // Export debug data for LightingDebugUI integration
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.lightingDebugData = {
        // Advanced lighting system
        selectedLight: selectedLight,
        setSelectedLight: setSelectedLight,
        advancedLights: advancedLights,
        setAdvancedLights: setAdvancedLights,

        // Light management functions
        addSpotLight: addSpotLight,
        addPointLight: addPointLight,
        removeSpotLight: removeSpotLight,
        removePointLight: removePointLight,

        lights: {
          ambient: ambientLightRef.current,
          directional: directionalLightRef.current,
          spots: spotLightsRef.current,
          points: pointLightsRef.current,
        },
        helpers: isDebugMode
          ? {
              directional: directionalHelperRef.current,
              spots: spotHelpersRef.current,
              points: pointHelpersRef.current,
            }
          : null,
      };
    }
  }, [
    selectedLight,
    advancedLights,
    isDebugMode,
    addSpotLight,
    addPointLight,
    removeSpotLight,
    removePointLight,
  ]);

  // Update helper visibility when helpersVisible changes
  useEffect(() => {
    // Update directional helper visibility
    if (directionalHelperRef.current) {
      directionalHelperRef.current.visible =
        advancedLights.directional.visible && isDebugMode && helpersVisible;
    }

    // Update spot light helpers visibility
    spotHelpersRef.current.forEach((spotHelper, index) => {
      if (spotHelper && advancedLights.spots[index]) {
        spotHelper.visible =
          advancedLights.spots[index].visible && isDebugMode && helpersVisible;
      }
    });

    // Update point light helpers visibility
    pointHelpersRef.current.forEach((pointHelper, index) => {
      if (pointHelper && advancedLights.points[index]) {
        pointHelper.visible =
          advancedLights.points[index].visible && isDebugMode && helpersVisible;
      }
    });
  }, [helpersVisible, isDebugMode, advancedLights]);

  // Always return null - lights are added via useEffect to scene
  return null;
}
