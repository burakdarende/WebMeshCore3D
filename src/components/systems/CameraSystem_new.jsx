// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// Dynamic Camera Controller with OrbitControls and Manual Camera

import React, { useState, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

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
    if (!DEVELOPER_CONFIG.ENABLE_FOCUS_CONTROL) return;

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
  }, [grabMode, DEVELOPER_CONFIG.ENABLE_FOCUS_CONTROL]);

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

export const CAMERA_CONFIG = {
  // 📷 Camera position and field of view
  position: [4.98, 3.76, 4.86], // [x, y, z] - Change this to your desired camera position
  fov: 50, // Field of view - typically 30-75

  // 🎯 Focus target (where the camera looks at)
  target: [0.46, 0.77, -0.27], // [x, y, z] - Change this to your desired focus point

  // 📐 Camera projection type
  perspective: true, // true = Perspective camera, false = Orthographic camera

  // 📏 Orthographic camera settings (only used when perspective = false)
  orthographic: {
    left: -8,
    right: 8,
    top: 8,
    bottom: -8,
    zoom: 1.5, // Zoom for better view
    frustumSize: 8, // Frustum size for calculations
  },

  // 🎮 OrbitControls settings
  minDistance: 2,
  maxDistance: 12,
  maxPolarAngle: Math.PI / 1.8, // Prevent camera from going below ground
  minPolarAngle: 0, // Allow full rotation
  enableDamping: true,
  dampingFactor: 0.05,
};

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
  const { camera } = useThree();
  const orbitControlsRef = useRef();
  const [isFocusMode, setIsFocusMode] = useState(false); // Track focus manipulation mode

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
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [camera, target, onTargetChange, DEVELOPER_CONFIG]);

  // Update OrbitControls target when target changes
  useEffect(() => {
    if (orbitControlsRef.current && target) {
      orbitControlsRef.current.target.set(target[0], target[1], target[2]);
      orbitControlsRef.current.update();
    }
  }, [target]);

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
        enableZoom={!isFocusMode}
        enablePan={!isFocusMode}
        enableRotate={!isFocusMode}
        maxDistance={CAMERA_CONFIG.maxDistance}
        minDistance={CAMERA_CONFIG.minDistance}
        maxPolarAngle={CAMERA_CONFIG.maxPolarAngle}
        minPolarAngle={CAMERA_CONFIG.minPolarAngle}
        target={target}
      />

      {/* Focus Point Marker - only show in debug mode with focus control enabled */}
      {DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE &&
        DEVELOPER_CONFIG?.ENABLE_FOCUS_CONTROL && (
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

// Camera Type Switcher Hook - SIMPLE VERSION
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
          if (DEVELOPER_CONFIG.ENABLE_CONSOLE_LOGS) {
            console.log(`📷 Camera switched to: ${newType}`);
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
  }, [DEVELOPER_CONFIG, onCameraTypeChange]);

  return [cameraType, setCameraType];
}

export function CameraSystem({
  DEVELOPER_CONFIG,
  target,
  onTargetChange,
  cameraType,
}) {
  return (
    <CameraControls
      isDebugMode={DEVELOPER_CONFIG?.ENABLE_DEBUG_MODE}
      target={target}
      onTargetChange={onTargetChange}
      DEVELOPER_CONFIG={DEVELOPER_CONFIG}
      cameraType={cameraType}
    />
  );
}
