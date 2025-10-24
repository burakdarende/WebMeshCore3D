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
  // Start with default values, update from window data when available
  const [bloomData, setBloomData] = useState(() => ({
    bloomParams: {
      threshold: VISUAL_CONFIG.bloom.threshold,
      strength: VISUAL_CONFIG.bloom.strength,
      radius: VISUAL_CONFIG.bloom.radius,
      exposure: VISUAL_CONFIG.bloom.exposure,
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
    console.log("BloomDebugUI - State:", {
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
        <span>{DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.icon} BLOOM DEBUG</span>
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
              Threshold: {bloomParams.threshold?.toFixed(3) || "0.100"}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001" // Much more precise (0.1% steps)
              value={bloomParams.threshold || 0.1}
              onChange={(e) =>
                setBloomParams &&
                setBloomParams((prev) => ({
                  ...prev,
                  threshold: parseFloat(e.target.value),
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Strength: {bloomParams.strength?.toFixed(3) || "0.000"}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.01" // More precise (1% steps instead of 10%)
              value={bloomParams.strength || 0.0}
              onChange={(e) =>
                setBloomParams &&
                setBloomParams((prev) => ({
                  ...prev,
                  strength: parseFloat(e.target.value),
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Radius: {bloomParams.radius?.toFixed(3) || "0.220"}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001" // Much more precise (0.1% steps)
              value={bloomParams.radius || 0.22}
              onChange={(e) =>
                setBloomParams &&
                setBloomParams((prev) => ({
                  ...prev,
                  radius: parseFloat(e.target.value),
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Exposure: {bloomParams.exposure?.toFixed(3) || "1.000"}
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.01" // More precise (1% steps instead of 10%)
              value={bloomParams.exposure || 1.0}
              onChange={(e) =>
                setBloomParams &&
                setBloomParams((prev) => ({
                  ...prev,
                  exposure: parseFloat(e.target.value),
                }))
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
            🎯 Emissive materials auto-bloom | 🌟 25% random objects for testing
          </div>
        </>
      )}
    </div>
  );
}

export default BloomDebugUI;
