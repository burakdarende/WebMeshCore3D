// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// Dynamic Camera Controller with OrbitControls and Manual Camera

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Import centralized configuration
import { CAMERA_CONFIG } from "../../config/app-config";

// ═══════════════════════════════════════════════════════════════════════════════
// FOCUS TARGET SYSTEM COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Axis Line Helper - Shows constraint axis during transform
function AxisLine({ axis, position, visible }) {
  if (!visible) return null;

  const getLineProps = () => {
    const length = 20; // Very long line
    switch (axis) {
      case "x":
        return {
          points: [
            [-length, position[1], position[2]],
            [length, position[1], position[2]],
          ],
          color: "#ff0000", // Red for X
        };
      case "y":
        return {
          points: [
            [position[0], -length, position[2]],
            [position[0], length, position[2]],
          ],
          color: "#00ff00", // Green for Y
        };
      case "z":
        return {
          points: [
            [position[0], position[1], -length],
            [position[0], position[1], length],
          ],
          color: "#0000ff", // Blue for Z
        };
      default:
        return { points: [], color: "#ffffff" };
    }
  };

  const { points, color } = getLineProps();

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={3} />
    </line>
  );
}

// Focus Point Marker - 3D red dot with Blender-style transform system (G + X/Y/Z)
function FocusPointMarker({
  target,
  onTargetChange,
  DEVELOPER_CONFIG,
  onGrabModeChange,
}) {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [grabMode, setGrabMode] = useState(false);
  const [constraintAxis, setConstraintAxis] = useState(null); // 'x', 'y', 'z', or null
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [dragStartTarget, setDragStartTarget] = useState(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(target[0], target[1], target[2]);
    }
  }, [target]);

  // Global keyboard handler for G/X/Y/Z keys (only active in debug mode)
  useEffect(() => {
    if (!DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) return;

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "g") {
        event.preventDefault();
        if (grabMode) {
          // Exit grab mode
          setGrabMode(false);
          setConstraintAxis(null);
          setIsDragging(false);
        } else {
          // Enter grab mode
          setGrabMode(true);
          setConstraintAxis(null);
        }
      } else if (grabMode && ["x", "y", "z"].includes(key)) {
        event.preventDefault();
        setConstraintAxis(key);
      } else if (key === "escape") {
        // Cancel grab mode
        setGrabMode(false);
        setConstraintAxis(null);
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grabMode, DEVELOPER_CONFIG.ENABLE_DEBUG_MODE]);

  // Notify parent about grab mode changes
  useEffect(() => {
    if (onGrabModeChange) {
      onGrabModeChange(grabMode || isDragging);
    }
  }, [grabMode, isDragging, onGrabModeChange]);

  const handlePointerDown = (event) => {
    if (!grabMode) return;

    event.stopPropagation();
    setIsDragging(true);
    setDragStartPosition([event.clientX, event.clientY]);
    setDragStartTarget([...target]);
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !grabMode || !dragStartPosition) return;

    event.stopPropagation();

    const deltaX = (event.clientX - dragStartPosition[0]) * 0.01;
    const deltaY = -(event.clientY - dragStartPosition[1]) * 0.01; // Invert Y

    let newTarget = [...dragStartTarget];

    if (constraintAxis) {
      // Constrained movement
      switch (constraintAxis) {
        case "x":
          newTarget[0] = dragStartTarget[0] + deltaX;
          break;
        case "y":
          newTarget[1] = dragStartTarget[1] + deltaY;
          break;
        case "z":
          newTarget[2] = dragStartTarget[2] + deltaX; // Use deltaX for Z movement
          break;
      }
    } else {
      // Free movement (screen space)
      newTarget[0] = dragStartTarget[0] + deltaX;
      newTarget[1] = dragStartTarget[1] + deltaY;
    }

    if (onTargetChange) {
      onTargetChange(newTarget);
    }
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setIsDragging(false);
    setDragStartPosition(null);
    setDragStartTarget(null);
    if (event.target.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }
  };

  // Visual state based on grab mode and constraint
  const getVisualState = () => {
    if (isDragging) {
      return { size: 0.08, color: "#ffff00", opacity: 1.0 }; // Yellow when dragging
    } else if (grabMode) {
      if (constraintAxis) {
        const colors = { x: "#ff6666", y: "#66ff66", z: "#6666ff" };
        return { size: 0.07, color: colors[constraintAxis], opacity: 0.9 };
      }
      return { size: 0.06, color: "#ff8800", opacity: 0.9 }; // Orange in grab mode
    } else {
      return { size: 0.05, color: "#ff0000", opacity: 0.8 }; // Normal red
    }
  };

  const visualState = getVisualState();

  return (
    <>
      <mesh
        ref={meshRef}
        renderOrder={999}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <sphereGeometry args={[visualState.size, 16, 16]} />
        <meshBasicMaterial
          color={visualState.color}
          transparent={true}
          opacity={visualState.opacity}
          depthTest={false}
        />
      </mesh>

      {/* Show axis line when in constrained mode */}
      <AxisLine
        axis={constraintAxis}
        position={target}
        visible={grabMode && constraintAxis && !isDragging}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA CONTROLS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function CameraControls({
  isDebugMode,
  target,
  onTargetChange,
  DEVELOPER_CONFIG,
  cameraType,
}) {
  const { camera, gl, scene } = useThree();
  const orbitControlsRef = useRef();
  const [isFocusMode, setIsFocusMode] = useState(false); // Track focus manipulation mode
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(false); // Auto rotate state
  const [cameraLocked, setCameraLocked] = useState(false); // Camera lock state

  // FOV/Zoom state for both camera types
  const [fovValue, setFovValue] = useState(() => {
    return cameraType === "perspective"
      ? CAMERA_CONFIG.fov.perspective.default
      : CAMERA_CONFIG.fov.orthographic.default;
  });

  // Keyboard controls for camera and target fine-tuning
  useEffect(() => {
    if (!DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE) return;

    const handleKeyPress = (event) => {
      const step = 0.1;

      // Check for modifier keys
      const isShiftPressed = event.shiftKey;

      switch (event.key.toLowerCase()) {
        // Camera position controls (default)
        case "w":
          if (isShiftPressed && onTargetChange && target) {
            onTargetChange([target[0], target[1], target[2] - step]);
          } else {
            camera.position.z -= step;
          }
          break;
        case "s":
          if (isShiftPressed && onTargetChange && target) {
            onTargetChange([target[0], target[1], target[2] + step]);
          } else {
            camera.position.z += step;
          }
          break;
        case "a":
          if (isShiftPressed && onTargetChange && target) {
            onTargetChange([target[0] - step, target[1], target[2]]);
          } else {
            camera.position.x -= step;
          }
          break;
        case "d":
          if (isShiftPressed && onTargetChange && target) {
            onTargetChange([target[0] + step, target[1], target[2]]);
          } else {
            camera.position.x += step;
          }
          break;
        case "q":
          if (isShiftPressed && onTargetChange && target) {
            onTargetChange([target[0], target[1] + step, target[2]]);
          } else {
            camera.position.y += step;
          }
          break;
        case "e":
          if (isShiftPressed && onTargetChange && target) {
            onTargetChange([target[0], target[1] - step, target[2]]);
          } else {
            camera.position.y -= step;
          }
          break;

        // FOV/Zoom controls
        case "1":
          // Decrease FOV (zoom in)
          if (cameraType === "perspective") {
            const newFov = Math.max(
              CAMERA_CONFIG.fov.perspective.min,
              fovValue - 5
            );
            setFovValue(newFov);
            camera.fov = newFov;
            camera.updateProjectionMatrix();
          } else {
            const newZoom = Math.min(
              CAMERA_CONFIG.fov.orthographic.max,
              fovValue + 0.1
            );
            setFovValue(newZoom);
            camera.zoom = newZoom;
            camera.updateProjectionMatrix();
          }
          break;

        case "2":
          // Increase FOV (zoom out)
          if (cameraType === "perspective") {
            const newFov = Math.min(
              CAMERA_CONFIG.fov.perspective.max,
              fovValue + 5
            );
            setFovValue(newFov);
            camera.fov = newFov;
            camera.updateProjectionMatrix();
          } else {
            const newZoom = Math.max(
              CAMERA_CONFIG.fov.orthographic.min,
              fovValue - 0.1
            );
            setFovValue(newZoom);
            camera.zoom = newZoom;
            camera.updateProjectionMatrix();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [camera, target, onTargetChange, DEVELOPER_CONFIG, cameraType, fovValue]);

  // Update FOV when camera type changes
  useEffect(() => {
    const newFovValue =
      cameraType === "perspective"
        ? CAMERA_CONFIG.fov.perspective.default
        : CAMERA_CONFIG.fov.orthographic.default;
    setFovValue(newFovValue);
  }, [cameraType]);

  // Update camera when FOV changes
  useEffect(() => {
    if (camera) {
      if (cameraType === "perspective") {
        camera.fov = fovValue;
      } else {
        // For orthographic camera, use fovValue as zoom directly
        camera.zoom = fovValue;
      }
      camera.updateProjectionMatrix();

      // Update window debug data
      if (window.cameraDebugData) {
        window.cameraDebugData.fov = fovValue;
      }
    }
  }, [camera, fovValue, cameraType]);

  // Update OrbitControls target when target changes
  useEffect(() => {
    if (orbitControlsRef.current && target) {
      orbitControlsRef.current.target.set(target[0], target[1], target[2]);
      orbitControlsRef.current.update();
    }
  }, [target]);

  // Setup global camera controls
  useEffect(() => {
    // Store current state
    let currentAutoRotateState = {
      enabled: autoRotateEnabled,
      speed: 2.0,
      direction: "right",
    };

    let currentCameraLocked = cameraLocked;

    window.cameraControls = {
      setAutoRotate: (enabled, speed = 2.0, direction = "right") => {
        setAutoRotateEnabled(enabled);

        // Update stored state
        currentAutoRotateState = { enabled, speed, direction };

        // Update OrbitControls with new settings
        if (orbitControlsRef.current) {
          orbitControlsRef.current.autoRotate = enabled;
          // Set speed based on direction (negative for left)
          orbitControlsRef.current.autoRotateSpeed =
            direction === "left" ? -speed : speed;
        }

        console.log(
          `📷 Auto rotate ${
            enabled ? "enabled" : "disabled"
          } - Speed: ${speed} - Direction: ${direction}`
        );
      },
      getAutoRotateState: () => {
        return { ...currentAutoRotateState };
      },
      setCameraLock: (locked) => {
        setCameraLocked(locked);
        currentCameraLocked = locked;

        // Update OrbitControls
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = !locked;
        }

        console.log(`📷 Camera ${locked ? "locked" : "unlocked"}`);
      },
      getCameraLockState: () => {
        return currentCameraLocked;
      },
    };

    return () => {
      // Cleanup
      if (window.cameraControls) {
        delete window.cameraControls;
      }
    };
  }, []);

  // Update camera debug data in real-time
  useFrame(() => {
    if (isDebugMode) {
      window.cameraDebugData = {
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        target: target || [0, 0, 0],
        fov: camera.fov,
        type:
          cameraType === "perspective"
            ? "PerspectiveCamera"
            : "OrthographicCamera",
      };
    }
  });

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enableDamping={CAMERA_CONFIG.enableDamping}
        dampingFactor={CAMERA_CONFIG.dampingFactor}
        enableZoom={!isFocusMode && !cameraLocked}
        enablePan={!isFocusMode && !cameraLocked}
        enableRotate={!isFocusMode && !cameraLocked}
        autoRotate={autoRotateEnabled}
        autoRotateSpeed={2.0}
        maxDistance={CAMERA_CONFIG.maxDistance}
        minDistance={CAMERA_CONFIG.minDistance}
        maxPolarAngle={CAMERA_CONFIG.maxPolarAngle}
        minPolarAngle={CAMERA_CONFIG.minPolarAngle}
        target={target}
      />

      {/* Focus Point Marker - only show in debug mode with focus control enabled */}
      {DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE &&
        DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE && (
          <FocusPointMarker
            target={target}
            onTargetChange={onTargetChange}
            DEVELOPER_CONFIG={DEVELOPER_CONFIG}
            onGrabModeChange={setIsFocusMode}
          />
        )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA SYSTEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

// Create initial camera configuration based on type
export const createInitialCamera = (cameraType = "perspective") => {
  if (cameraType === "perspective") {
    return {
      position: CAMERA_CONFIG.position,
      fov: CAMERA_CONFIG.fov,
    };
  } else {
    // Orthographic camera setup - use config values
    const aspect =
      typeof window !== "undefined"
        ? window.innerWidth / window.innerHeight
        : 1;

    // Use fixed frustum from config for consistency
    const orthoConfig = CAMERA_CONFIG.orthographic;

    return {
      position: CAMERA_CONFIG.position, // Use same position as perspective
      left: orthoConfig.left * aspect,
      right: orthoConfig.right * aspect,
      top: orthoConfig.top,
      bottom: orthoConfig.bottom,
      near: 0.1,
      far: 1000,
      zoom: orthoConfig.zoom,
    };
  }
};

// Camera Type Switcher Component - Handles runtime camera switching
export function CameraTypeSwitcher({ DEVELOPER_CONFIG, cameraType }) {
  const { camera, set } = useThree();

  // Runtime camera switching when cameraType changes
  useEffect(() => {
    if (!camera) return;

    const currentPosition = camera.position.clone();
    const currentRotation = camera.rotation.clone();

    let newCamera;

    if (cameraType === "perspective") {
      // Switch to Perspective Camera
      newCamera = new THREE.PerspectiveCamera(
        CAMERA_CONFIG.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      if (DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE) {
        console.log("📐 Switched to PERSPECTIVE camera");
      }
    } else {
      // Switch to Orthographic Camera
      const aspect = window.innerWidth / window.innerHeight;
      const orthoConfig = CAMERA_CONFIG.orthographic;

      newCamera = new THREE.OrthographicCamera(
        orthoConfig.left * aspect,
        orthoConfig.right * aspect,
        orthoConfig.top,
        orthoConfig.bottom,
        0.1,
        1000
      );
      newCamera.zoom = orthoConfig.zoom;
      if (DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE) {
        console.log("� Switched to ORTHOGRAPHIC camera");
        console.log("📐 Orthographic settings:", {
          left: orthoConfig.left * aspect,
          right: orthoConfig.right * aspect,
          top: orthoConfig.top,
          bottom: orthoConfig.bottom,
          zoom: orthoConfig.zoom,
        });
      }
    }

    // Preserve position and rotation
    newCamera.position.copy(currentPosition);
    newCamera.rotation.copy(currentRotation);
    newCamera.updateProjectionMatrix();

    // Update Three.js camera
    set({ camera: newCamera });
  }, [cameraType, set, DEVELOPER_CONFIG]); // REMOVED camera from deps to prevent infinite loop

  return null; // This component doesn't render anything
}

// Camera Type Switcher Hook
export function useCameraTypeSwitcher(DEVELOPER_CONFIG, onCameraTypeChange) {
  const [cameraType, setCameraType] = useState(
    CAMERA_CONFIG.perspective ? "perspective" : "orthographic"
  );

  // C key handler for camera type switching
  useEffect(() => {
    if (!DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE) return;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        setCameraType((prev) => {
          const newType =
            prev === "perspective" ? "orthographic" : "perspective";
          if (DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) {
            console.log(`📷 Camera switched to: ${newType}`);
            console.log(`📐 Current camera type: ${prev} → ${newType}`);
          }
          if (onCameraTypeChange) {
            onCameraTypeChange(newType);
          }
          return newType;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cameraType, DEVELOPER_CONFIG]);

  return [cameraType, setCameraType];
}

export function CameraSystem({
  DEVELOPER_CONFIG,
  target,
  onTargetChange,
  cameraType,
  onCameraTypeChange,
}) {
  return (
    <>
      <CameraControls
        isDebugMode={DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE}
        target={target}
        onTargetChange={onTargetChange}
        DEVELOPER_CONFIG={DEVELOPER_CONFIG}
        cameraType={cameraType}
      />

      {/* Runtime camera type switcher - FIXED for orthographic support */}
      <CameraTypeSwitcher
        DEVELOPER_CONFIG={DEVELOPER_CONFIG}
        cameraType={cameraType}
      />
    </>
  );
}
