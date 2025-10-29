// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";

export function BloomDebugUI({
  DEVELOPER_CONFIG,
  DEBUG_UI_CONFIG,
  VISUAL_CONFIG,
}) {
  // Start with default values (PMNDRS-compatible)
  const [bloomData, setBloomData] = useState(() => ({
    bloomParams: {
      luminanceThreshold: VISUAL_CONFIG.bloom.luminanceThreshold,
      luminanceSmoothing: VISUAL_CONFIG.bloom.luminanceSmoothing,
      intensity: VISUAL_CONFIG.bloom.intensity,
    },
    setBloomParams: null,
  }));

  const [isMinimized, setIsMinimized] = useState(false);
  const { position, isVisible } = useDebugUIPosition("bloomDebug");

  // Poll bloom data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.bloomDebugData) {
        setBloomData(window.bloomDebugData);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  // Debug info
  useEffect(() => {
    console.log("BloomDebugUI (Modern) - State:", {
      ENABLE_DEBUG_MODE: DEVELOPER_CONFIG.ENABLE_DEBUG_MODE,
      bloomData: !!bloomData,
      isVisible,
      position,
      windowBloomDebugData: !!window.bloomDebugData,
    });
  }, [DEVELOPER_CONFIG.ENABLE_DEBUG_MODE, bloomData, isVisible, position]);

  if (
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !bloomData ||
    !isVisible ||
    !position
  ) {
    return null;
  }

  const { bloomParams, setBloomParams } = bloomData;

  // Shared updater: updates both the slider (local UI) and the global bloom state
  const handleParamChange = (paramName, value) => {
    const newValue = parseFloat(value);

    // 1. Update global state (main state in BloomSystem). This changes the effect.
    if (setBloomParams) {
      setBloomParams((prev) => ({
        ...prev,
        [paramName]: newValue,
      }));
    }

    // 2. Update local state immediately to keep the slider responsive
    setBloomData((prevData) => ({
      ...prevData,
      bloomParams: {
        ...prevData.bloomParams,
        [paramName]: newValue,
      },
    }));
  };
  // end shared updater

  return (
    <div
      style={{
        position: "fixed",
        ...(position.bottom !== undefined
          ? { bottom: `${position.bottom}px` }
          : { top: `${position.top}px` }),
        left:
          typeof position.left === "string"
            ? position.left
            : `${position.left}px`,
        width: `${position.width}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        border: `2px solid ${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.icon} BLOOM DEBUG (PMNDRS)
        </span>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: "none",
            border: "none",
            color: `${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 6px",
            borderRadius: "3px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,0,0.1)")
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          {isMinimized ? "+" : "−"}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Luminance Threshold:{" "}
              {bloomParams.luminanceThreshold?.toFixed(3) || "0.100"}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={bloomParams.luminanceThreshold || 0.1}
              onChange={(e) =>
                handleParamChange("luminanceThreshold", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Luminance Smoothing:{" "}
              {bloomParams.luminanceSmoothing?.toFixed(3) || "0.100"}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={bloomParams.luminanceSmoothing || 0.1}
              onChange={(e) =>
                handleParamChange("luminanceSmoothing", e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Intensity: {bloomParams.intensity?.toFixed(3) || "0.100"}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={bloomParams.intensity || 0.0}
              onChange={(e) => handleParamChange("intensity", e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
            🎯 Bloom works based on luminance (brightness).
          </div>
        </>
      )}
    </div>
  );
}

export default BloomDebugUI;
