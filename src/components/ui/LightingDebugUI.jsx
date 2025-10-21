// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";

// 🚀 FUTURE PANEL TEMPLATE - Ready for easy expansion
// Copy this template and modify for new debug panels
export function LightingDebugUI({ DEVELOPER_CONFIG, DEBUG_UI_CONFIG }) {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);

  // Poll lighting data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.lightingDebugData) {
        setWindowData(window.lightingDebugData);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (
    !DEVELOPER_CONFIG.ENABLE_LIGHTING_DEBUG_UI ||
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !windowData
  ) {
    return null;
  }

  const updateLighting = (updates) => {
    if (windowData.setLightingState) {
      windowData.setLightingState((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: `${DEBUG_UI_CONFIG.bottomMargin}px`,
        left: `${DEBUG_UI_CONFIG.getPanelPosition(
          DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.index
        )}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: `${DEBUG_UI_CONFIG.panelWidth}px`,
        border: `2px solid ${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        {DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.icon} LIGHTING DEBUG
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Ambient: {windowData.ambientIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={windowData.ambientIntensity}
          onChange={(e) =>
            updateLighting({ ambientIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Key Light: {windowData.keyLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={windowData.keyLightIntensity}
          onChange={(e) =>
            updateLighting({ keyLightIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Fill Light: {windowData.fillLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={windowData.fillLightIntensity}
          onChange={(e) =>
            updateLighting({ fillLightIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Rim Light: {windowData.rimLightIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="4"
          step="0.1"
          value={windowData.rimLightIntensity}
          onChange={(e) =>
            updateLighting({ rimLightIntensity: parseFloat(e.target.value) })
          }
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
        💡 Real-time lighting control | ⚡ Performance optimized
      </div>
    </div>
  );
}

export default LightingDebugUI;
