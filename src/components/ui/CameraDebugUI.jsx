// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";

// External UI Components (Completely Fixed, Outside Canvas)
export function CameraDebugUI({ DEVELOPER_CONFIG, DEBUG_UI_CONFIG }) {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);
  const { position, isVisible } = useDebugUIPosition("cameraDebug");

  // Poll camera data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.cameraDebugData) {
        setWindowData(window.cameraDebugData);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  if (
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !windowData ||
    !isVisible ||
    !position
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        ...(position.bottom !== undefined
          ? { bottom: `${position.bottom}px` }
          : { top: `${position.top}px` }),
        left: `${position.left}px`,
        width: `${position.width}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        border: `2px solid ${DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        pointerEvents: "auto",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
          color: `${DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.color}`,
          fontWeight: "bold",
        }}
      >
        {DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.icon} Camera Debug
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Position:</strong>
      </div>
      <div
        style={{
          marginLeft: "10px",
          marginBottom: "5px",
          color: "#ff4444",
        }}
      >
        X: {windowData.position?.x?.toFixed(2) || "0.00"} | Y:{" "}
        {windowData.position?.y?.toFixed(2) || "0.00"} | Z:{" "}
        {windowData.position?.z?.toFixed(2) || "0.00"}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>FOV:</strong> {windowData.fov?.toFixed(0) || "N/A"}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Camera Type (Press C to toggle):</strong>{" "}
        <span style={{ color: "#ff0000" }}>
          {windowData.type === "PerspectiveCamera"
            ? "Perspective"
            : "Orthographic"}
        </span>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Focus Target:</strong>
      </div>
      <div
        style={{
          marginLeft: "10px",
          marginBottom: "5px",
          color: "#ff4444",
        }}
      >
        X: {windowData.target?.[0]?.toFixed(2) || "0.00"} | Y:{" "}
        {windowData.target?.[1]?.toFixed(2) || "0.00"} | Z:{" "}
        {windowData.target?.[2]?.toFixed(2) || "0.00"}
      </div>

      <div style={{ fontSize: "11px", color: "#888" }}>
        🎮 WASD - EQ: CAMERA Position | Shift+WASD - EQ: TARGET Position
      </div>
      <div style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>
        🎯 G: grab mode | X/Y/Z: axis lock | C: camera type | ESC: cancel
      </div>
      <div style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>
        🔍 1/2: FOV control (zoom in/out)
      </div>
    </div>
  );
}

export default CameraDebugUI;
