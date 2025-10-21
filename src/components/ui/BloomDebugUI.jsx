// ═══════════════════════════════════════════════════════════════════════════════
// BLOOM DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";

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

  // Poll bloom data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.bloomDebugData) {
        setBloomData(window.bloomDebugData);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  if (
    !DEVELOPER_CONFIG.ENABLE_BLOOM_DEBUG_UI ||
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !bloomData
  ) {
    return null;
  }

  const { bloomParams, setBloomParams } = bloomData;

  return (
    <div
      style={{
        position: "fixed",
        bottom: `${DEBUG_UI_CONFIG.bottomMargin}px`,
        left: `${DEBUG_UI_CONFIG.getPanelPosition(
          DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.index
        )}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: `${DEBUG_UI_CONFIG.panelWidth}px`,
        border: `2px solid ${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        {DEBUG_UI_CONFIG.panels.BLOOM_DEBUG.icon} BLOOM DEBUG
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Threshold: {bloomParams.threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bloomParams.threshold}
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
          Strength: {bloomParams.strength.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={bloomParams.strength}
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
          Radius: {bloomParams.radius.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bloomParams.radius}
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
          Exposure: {bloomParams.exposure.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={bloomParams.exposure}
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
    </div>
  );
}

export default BloomDebugUI;
