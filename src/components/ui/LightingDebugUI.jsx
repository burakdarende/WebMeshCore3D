// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";

// 🚀 FUTURE PANEL TEMPLATE - Ready for easy expansion
// Copy this template and modify for new debug panels
export function LightingDebugUI({ DEVELOPER_CONFIG, DEBUG_UI_CONFIG }) {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { position, isVisible } = useDebugUIPosition("lightingDebug");

  // Poll lighting data from window object
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.lightingDebugData) {
        setWindowData(window.lightingDebugData);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Debug info
  useEffect(() => {
    console.log("LightingDebugUI - State:", {
      ENABLE_DEBUG_MODE: DEVELOPER_CONFIG.ENABLE_DEBUG_MODE,
      windowData: !!windowData,
      isVisible,
      position,
      lightingDebugData: !!window.lightingDebugData,
    });
  }, [DEVELOPER_CONFIG.ENABLE_DEBUG_MODE, windowData, isVisible, position]);

  if (
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
    !windowData ||
    !isVisible ||
    !position
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
        ...(position.bottom !== undefined
          ? { bottom: `${position.bottom}px` }
          : { top: `${position.top}px` }),
        ...(position.right !== undefined
          ? { right: `${position.right}px` }
          : { left: `${position.left}px` }),
        width: `${position.width}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        border: `2px solid ${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.icon} LIGHTING DEBUG</span>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: "none",
            border: "none",
            color: `${DEBUG_UI_CONFIG.panels.LIGHTING_DEBUG.color}`,
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 6px",
            borderRadius: "3px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(0,255,255,0.1)")
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
                updateLighting({
                  keyLightIntensity: parseFloat(e.target.value),
                })
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
                updateLighting({
                  fillLightIntensity: parseFloat(e.target.value),
                })
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
                updateLighting({
                  rimLightIntensity: parseFloat(e.target.value),
                })
              }
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
            💡 Real-time lighting control | ⚡ Performance optimized
          </div>
        </>
      )}
    </div>
  );
}

export default LightingDebugUI;
