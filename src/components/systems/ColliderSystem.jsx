// ═══════════════════════════════════════════════════════════════════════════════
// 3D COLLIDER SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// Interactive 3D colliders with visual feedback, hover effects, and manipulation

import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COLLIDER_CONFIG } from "./ColliderConfig";

// Individual Collider Component with manipulation handles
function Collider({
  colliderData,
  isSelected,
  onSelect,
  onUpdate,
  onHover,
  onUnhover,
  onLinkClick,
  enableDev = true,
}) {
  const meshRef = useRef();
  const handlesRef = useRef([]);
  const { camera, gl } = useThree();

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'translate', 'scale'
  const [constraintAxis, setConstraintAxis] = useState(null); // 'x', 'y', 'z'
  const [dragStart, setDragStart] = useState(null);

  // Listen for G key + axis keys for transform mode
  useEffect(() => {
    if (!enableDev || !isSelected) return;

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (key === "g" && !isDragging) {
        // Enter translate mode
        setDragMode("translate");
        setConstraintAxis(null);
        event.preventDefault();
      } else if (key === "s" && !isDragging) {
        // Enter scale mode
        setDragMode("scale");
        setConstraintAxis(null);
        event.preventDefault();
      } else if (dragMode && ["x", "y", "z"].includes(key)) {
        // Set axis constraint
        setConstraintAxis(key);
        event.preventDefault();
      } else if (key === "escape") {
        // Cancel transform
        setDragMode(null);
        setConstraintAxis(null);
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableDev, isSelected, isDragging, dragMode]);

  // Handle mouse events for manipulation
  const handlePointerDown = (event) => {
    if (!enableDev || !dragMode) return;

    event.stopPropagation();
    setIsDragging(true);
    setDragStart({
      pointer: [event.clientX, event.clientY],
      position: [...colliderData.position],
      size: [...(colliderData.size || [1, 1, 1])],
    });
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !dragStart || !dragMode) return;

    event.stopPropagation();

    const deltaX =
      (event.clientX - dragStart.pointer[0]) *
      COLLIDER_CONFIG.interaction.dragSensitivity;
    const deltaY =
      -(event.clientY - dragStart.pointer[1]) *
      COLLIDER_CONFIG.interaction.dragSensitivity;

    if (dragMode === "translate") {
      let newPosition = [...dragStart.position];

      if (constraintAxis) {
        // Constrained movement
        switch (constraintAxis) {
          case "x":
            newPosition[0] = dragStart.position[0] + deltaX;
            break;
          case "y":
            newPosition[1] = dragStart.position[1] + deltaY;
            break;
          case "z":
            newPosition[2] = dragStart.position[2] + deltaX; // Use deltaX for Z
            break;
        }
      } else {
        // Free movement (screen space)
        newPosition[0] = dragStart.position[0] + deltaX;
        newPosition[1] = dragStart.position[1] + deltaY;
      }

      onUpdate(colliderData.id, { position: newPosition });
    } else if (dragMode === "scale") {
      let newSize = [...(dragStart.size || [1, 1, 1])];
      const scaleDelta = deltaX * COLLIDER_CONFIG.interaction.scaleSensitivity;

      if (constraintAxis) {
        // Constrained scaling
        const axisIndex =
          constraintAxis === "x" ? 0 : constraintAxis === "y" ? 1 : 2;
        newSize[axisIndex] = Math.max(
          0.1,
          (dragStart.size ? dragStart.size[axisIndex] : 1) + scaleDelta
        );
      } else {
        // Uniform scaling
        const uniformScale = Math.max(
          0.1,
          Math.max(...(dragStart.size || [1, 1, 1])) + scaleDelta
        );
        newSize = [uniformScale, uniformScale, uniformScale];
      }

      onUpdate(colliderData.id, { size: newSize });
    }
  };

  const handlePointerUp = (event) => {
    if (!isDragging) return;

    event.stopPropagation();
    setIsDragging(false);
    setDragStart(null);
    setDragMode(null);
    setConstraintAxis(null);

    if (event.target.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }
  };

  // Handle collider selection and link actions
  const handleClick = (event) => {
    event.stopPropagation();

    if (enableDev) {
      // Dev mode: handle selection AND animation
      onSelect(colliderData.id);

      // Also trigger animation in dev mode
      if (colliderData.animation && window.modelAnimations) {
        console.log(
          `🎬 [DEV] Collider ${colliderData.id} triggering animation: ${colliderData.animation}`
        );
        window.modelAnimations.play(colliderData.animation);
      }
    } else {
      // Production mode: handle link and animation
      if (colliderData.link) {
        onLinkClick(colliderData.link);
      }

      // Trigger animation if specified
      if (colliderData.animation && window.modelAnimations) {
        console.log(
          `🎬 [PROD] Collider ${colliderData.id} triggering animation: ${colliderData.animation}`
        );
        window.modelAnimations.play(colliderData.animation);
      }
    }
  };

  // Handle hover events
  const handlePointerEnter = (event) => {
    event.stopPropagation();
    setIsHovered(true);
    onHover && onHover(colliderData.id);

    // Trigger hover animation if specified (both dev and prod mode)
    if (colliderData.animation && window.modelAnimations) {
      console.log(`🎬 Hover triggering animation: ${colliderData.animation}`);
      window.modelAnimations.play(colliderData.animation);
    }
  };

  const handlePointerLeave = (event) => {
    event.stopPropagation();
    setIsHovered(false);
    onUnhover && onUnhover(colliderData.id);

    // Stop animation on hover out if specified (both dev and prod mode)
    if (colliderData.animation && window.modelAnimations) {
      console.log(`🛑 Hover out stopping animations`);
      window.modelAnimations.stop();
    }
  };

  // Get visual state based on interaction
  const getVisualState = () => {
    if (isSelected) {
      return {
        color: COLLIDER_CONFIG.visual.selected.color,
        opacity: COLLIDER_CONFIG.visual.selected.opacity,
        linewidth: COLLIDER_CONFIG.visual.selected.linewidth,
      };
    } else if (isHovered) {
      return {
        color: COLLIDER_CONFIG.visual.hover.color,
        opacity: COLLIDER_CONFIG.visual.hover.opacity,
        linewidth: COLLIDER_CONFIG.visual.wireframe.linewidth,
      };
    } else {
      return {
        color: COLLIDER_CONFIG.visual.wireframe.color,
        opacity: COLLIDER_CONFIG.visual.wireframe.opacity,
        linewidth: COLLIDER_CONFIG.visual.wireframe.linewidth,
      };
    }
  };

  // Apply hover effects to scale (simplified - only slight scale on hover)
  const getEffectiveScale = () => {
    if (isHovered && !enableDev) {
      const multiplier = 1.05; // Slight 5% scale increase on hover
      return (colliderData.size || [1, 1, 1]).map((s) => s * multiplier);
    }
    return colliderData.size || [1, 1, 1];
  };

  const visualState = getVisualState();
  const effectiveScale = getEffectiveScale();

  return (
    <group
      position={colliderData.position}
      scale={effectiveScale}
      rotation={colliderData.rotation}
      visible={colliderData.visible}
    >
      {/* Main collider wireframe */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        renderOrder={999}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color={visualState.color}
          transparent
          opacity={visualState.opacity}
          wireframe={true}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
          alphaTest={0.1}
        />
      </mesh>

      {/* Axis constraint indicator */}
      {enableDev && isDragging && constraintAxis && (
        <AxisConstraintIndicator axis={constraintAxis} />
      )}
    </group>
  );
}

// Axis constraint visual indicator
function AxisConstraintIndicator({ axis }) {
  const getAxisLine = () => {
    const length = 10;
    switch (axis) {
      case "x":
        return {
          points: [
            [-length, 0, 0],
            [length, 0, 0],
          ],
          color: "#ff0000",
        };
      case "y":
        return {
          points: [
            [0, -length, 0],
            [0, length, 0],
          ],
          color: "#00ff00",
        };
      case "z":
        return {
          points: [
            [0, 0, -length],
            [0, 0, length],
          ],
          color: "#0000ff",
        };
      default:
        return { points: [], color: "#ffffff" };
    }
  };

  const { points, color } = getAxisLine();

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

// Main Collider System Manager
export function ColliderSystem({
  colliders,
  onCollidersUpdate,
  selectedCollider,
  onSelectCollider,
  enableDev = true,
}) {
  const [hoveredCollider, setHoveredCollider] = useState(null);

  const handleColliderUpdate = (colliderId, updates) => {
    const updatedColliders = colliders.map((collider) =>
      collider.id === colliderId ? { ...collider, ...updates } : collider
    );
    onCollidersUpdate(updatedColliders);
  };

  const handleColliderHover = (colliderId) => {
    setHoveredCollider(colliderId);
  };

  const handleColliderUnhover = () => {
    setHoveredCollider(null);
  };

  const handleLinkClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <>
      {colliders.map((collider) => (
        <Collider
          key={collider.id}
          colliderData={collider}
          isSelected={selectedCollider === collider.id}
          onSelect={onSelectCollider}
          onUpdate={handleColliderUpdate}
          onHover={handleColliderHover}
          onUnhover={handleColliderUnhover}
          onLinkClick={handleLinkClick}
          enableDev={enableDev}
        />
      ))}
    </>
  );
}

export default Collider;
