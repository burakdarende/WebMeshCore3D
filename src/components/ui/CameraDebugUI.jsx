// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";

// External UI Components (Completely Fixed, Outside Canvas)
export function CameraDebugUI({ DEVELOPER_CONFIG, DEBUG_UI_CONFIG }) {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(2.0);
  const [autoRotateDirection, setAutoRotateDirection] = useState("right");
  const [cameraLocked, setCameraLocked] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { position, isVisible } = useDebugUIPosition("cameraDebug");

  // Poll camera data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.cameraDebugData) {
        setWindowData(window.cameraDebugData);
      }

      // Sync auto rotate state from camera system
      if (window.cameraControls && window.cameraControls.getAutoRotateState) {
        const state = window.cameraControls.getAutoRotateState();
        setAutoRotate(state.enabled);
        setAutoRotateSpeed(state.speed);
        setAutoRotateDirection(state.direction);
      }

      // Sync camera lock state from camera system
      if (window.cameraControls && window.cameraControls.getCameraLockState) {
        const lockState = window.cameraControls.getCameraLockState();
        setCameraLocked(lockState);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  // Handle auto rotate toggle
  const handleAutoRotateChange = (e) => {
    const enabled = e.target.checked;

    // If trying to enable auto rotate while camera is locked, prevent it
    if (enabled && cameraLocked) {
      console.log("📷 Cannot enable auto rotate while camera is locked");
      return;
    }

    setAutoRotate(enabled);

    // Send auto rotate setting to camera system
    if (window.cameraControls) {
      window.cameraControls.setAutoRotate(
        enabled,
        autoRotateSpeed,
        autoRotateDirection
      );
    }

    console.log(`📷 Auto rotate ${enabled ? "enabled" : "disabled"}`);
  };

  // Handle auto rotate speed change
  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setAutoRotateSpeed(speed);

    if (window.cameraControls && autoRotate) {
      window.cameraControls.setAutoRotate(
        autoRotate,
        speed,
        autoRotateDirection
      );
    }
  };

  // Handle auto rotate direction change
  const handleDirectionChange = (direction) => {
    setAutoRotateDirection(direction);

    if (window.cameraControls && autoRotate) {
      window.cameraControls.setAutoRotate(
        autoRotate,
        autoRotateSpeed,
        direction
      );
    }
  };

  // Handle camera lock toggle
  const handleCameraLockChange = (e) => {
    const locked = e.target.checked;
    setCameraLocked(locked);

    // If camera lock is enabled, disable auto rotate
    if (locked && autoRotate) {
      setAutoRotate(false);
      if (window.cameraControls) {
        window.cameraControls.setAutoRotate(
          false,
          autoRotateSpeed,
          autoRotateDirection
        );
      }
    }

    if (window.cameraControls) {
      window.cameraControls.setCameraLock(locked);
    }

    console.log(`📷 Camera ${locked ? "locked" : "unlocked"}`);
  };

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.icon} Camera Debug</span>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: "none",
            border: "none",
            color: `${DEBUG_UI_CONFIG.panels.CAMERA_DEBUG.color}`,
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 6px",
            borderRadius: "3px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          {isMinimized ? "+" : "−"}
        </button>
      </div>

      {!isMinimized && (
        <>
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

          {/* Auto Rotate Control */}
          <div
            style={{
              marginBottom: "10px",
              paddingTop: "5px",
              borderTop: "1px solid #333",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: cameraLocked ? "not-allowed" : "pointer",
                opacity: cameraLocked ? 0.5 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={handleAutoRotateChange}
                disabled={cameraLocked}
                style={{ marginRight: "8px" }}
              />
              <span style={{ color: autoRotate ? "#4ade80" : "#ffffff" }}>
                🔄 Auto Rotate{" "}
                {cameraLocked ? "(Disabled - Camera Locked)" : ""}
              </span>
            </label>

            {/* Auto Rotate Settings */}
            {autoRotate && !cameraLocked && (
              <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                {/* Speed Control */}
                <div style={{ marginBottom: "8px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "#ccc",
                      marginBottom: "3px",
                    }}
                  >
                    Speed: {autoRotateSpeed.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={autoRotateSpeed}
                    onChange={handleSpeedChange}
                    style={{
                      width: "100%",
                      height: "4px",
                      background: "#333",
                      outline: "none",
                      borderRadius: "2px",
                    }}
                  />
                </div>

                {/* Direction Control */}
                <div style={{ marginBottom: "5px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "#ccc",
                      marginBottom: "3px",
                    }}
                  >
                    Direction:
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      <input
                        type="radio"
                        name="autoRotateDirection"
                        value="left"
                        checked={autoRotateDirection === "left"}
                        onChange={() => handleDirectionChange("left")}
                        style={{ marginRight: "5px" }}
                      />
                      ← Left
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      <input
                        type="radio"
                        name="autoRotateDirection"
                        value="right"
                        checked={autoRotateDirection === "right"}
                        onChange={() => handleDirectionChange("right")}
                        style={{ marginRight: "5px" }}
                      />
                      Right →
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Camera Lock Control */}
          <div
            style={{
              marginBottom: "10px",
              paddingTop: "5px",
              borderTop: "1px solid #333",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={cameraLocked}
                onChange={handleCameraLockChange}
                style={{ marginRight: "8px" }}
              />
              <span style={{ color: cameraLocked ? "#f87171" : "#ffffff" }}>
                🔒 Camera Lock
              </span>
            </label>
            {cameraLocked && (
              <div
                style={{
                  marginTop: "5px",
                  marginLeft: "20px",
                  fontSize: "10px",
                  color: "#f87171",
                }}
              >
                Camera controls disabled
              </div>
            )}
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
        </>
      )}
    </div>
  );
}

export default CameraDebugUI;
