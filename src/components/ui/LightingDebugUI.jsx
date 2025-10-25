// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTING DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";

// Advanced Light Controls Component - Updated for multiple lights
function AdvancedLightControls({
  lightType,
  lightData,
  onUpdate,
  lightId,
  canDelete,
  onDelete,
}) {
  const controlStyle = {
    marginBottom: "8px",
    fontSize: "10px",
  };

  const sliderStyle = {
    width: "100%",
    height: "4px",
    margin: "2px 0",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "2px",
    color: "#ccc",
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "8px",
        borderRadius: "4px",
        marginBottom: "10px",
      }}
    >
      {/* Light Header with Delete Button */}
      {lightId && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            borderBottom: "1px solid #333",
            paddingBottom: "5px",
          }}
        >
          <span
            style={{ color: "#00ff88", fontSize: "9px", fontWeight: "bold" }}
          >
            {lightId.toUpperCase()}
          </span>
          {canDelete && (
            <button
              onClick={() => onDelete && onDelete(lightId)}
              style={{
                background: "rgba(255, 0, 0, 0.3)",
                border: "1px solid #ff0000",
                color: "#ff0000",
                fontSize: "8px",
                padding: "1px 4px",
                borderRadius: "2px",
                cursor: "pointer",
              }}
              title={`Delete ${lightId}`}
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Visibility Toggle */}
      <div style={controlStyle}>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={lightData.visible}
            onChange={(e) => onUpdate({ visible: e.target.checked })}
            style={{ marginRight: "5px" }}
          />
          Visible
        </label>
      </div>

      {/* Intensity - Slider + TextBox */}
      <div style={controlStyle}>
        <label style={labelStyle}>Intensity</label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={lightData.intensity || 0}
            onChange={(e) =>
              onUpdate({ intensity: parseFloat(e.target.value) })
            }
            style={{ ...sliderStyle, flex: 1 }}
          />
          <input
            type="number"
            min="0"
            step="0.1"
            value={lightData.intensity?.toFixed(2) || "0.00"}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 0) {
                onUpdate({ intensity: value });
              }
            }}
            style={{
              width: "60px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid #555",
              color: "#fff",
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "9px",
              textAlign: "center",
            }}
          />
        </div>
      </div>

      {/* Color */}
      <div style={controlStyle}>
        <label style={labelStyle}>Color</label>
        <input
          type="color"
          value={lightData.color || "#ffffff"}
          onChange={(e) => onUpdate({ color: e.target.value })}
          style={{
            width: "100%",
            height: "20px",
            border: "none",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Position controls for non-ambient lights */}
      {lightType !== "ambient" && lightData.position && (
        <>
          {/* Link to Center Toggle for directional and spot lights */}
          {(lightType === "directional" || lightType === "spot") && (
            <div style={controlStyle}>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  checked={lightData.linkToCenter !== false} // Default to true if undefined
                  onChange={(e) => onUpdate({ linkToCenter: e.target.checked })}
                  style={{ marginRight: "5px" }}
                />
                🎯 Link to Center
              </label>
            </div>
          )}

          <div style={controlStyle}>
            <label style={labelStyle}>Position X</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={lightData.position.x || 0}
                onChange={(e) =>
                  onUpdate({
                    position: {
                      ...lightData.position,
                      x: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                step="0.1"
                value={lightData.position.x?.toFixed(1) || "0.0"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    onUpdate({
                      position: {
                        ...lightData.position,
                        x: value,
                      },
                    });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Position Y</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="-5"
                max="10"
                step="0.1"
                value={lightData.position.y || 0}
                onChange={(e) =>
                  onUpdate({
                    position: {
                      ...lightData.position,
                      y: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                step="0.1"
                value={lightData.position.y?.toFixed(1) || "0.0"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    onUpdate({
                      position: {
                        ...lightData.position,
                        y: value,
                      },
                    });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Position Z</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={lightData.position.z || 0}
                onChange={(e) =>
                  onUpdate({
                    position: {
                      ...lightData.position,
                      z: parseFloat(e.target.value),
                    },
                  })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                step="0.1"
                value={lightData.position.z?.toFixed(1) || "0.0"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value)) {
                    onUpdate({
                      position: {
                        ...lightData.position,
                        z: value,
                      },
                    });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          {/* Target controls for directional and spot lights when not linked to center */}
          {(lightType === "directional" || lightType === "spot") &&
            lightData.linkToCenter === false &&
            lightData.target && (
              <>
                <div
                  style={{
                    background: "rgba(255, 165, 0, 0.1)",
                    padding: "6px",
                    borderRadius: "3px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#ffa500",
                      marginBottom: "6px",
                    }}
                  >
                    🎯 TARGET CONTROLS
                  </div>

                  <div style={controlStyle}>
                    <label style={labelStyle}>Target X</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={lightData.target.x || 0}
                        onChange={(e) =>
                          onUpdate({
                            target: {
                              ...lightData.target,
                              x: parseFloat(e.target.value),
                            },
                          })
                        }
                        style={{ ...sliderStyle, flex: 1 }}
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={lightData.target.x?.toFixed(1) || "0.0"}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            onUpdate({
                              target: {
                                ...lightData.target,
                                x: value,
                              },
                            });
                          }
                        }}
                        style={{
                          width: "60px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid #555",
                          color: "#fff",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontSize: "9px",
                          textAlign: "center",
                        }}
                      />
                    </div>
                  </div>

                  <div style={controlStyle}>
                    <label style={labelStyle}>Target Y</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step="0.1"
                        value={lightData.target.y || 0}
                        onChange={(e) =>
                          onUpdate({
                            target: {
                              ...lightData.target,
                              y: parseFloat(e.target.value),
                            },
                          })
                        }
                        style={{ ...sliderStyle, flex: 1 }}
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={lightData.target.y?.toFixed(1) || "0.0"}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            onUpdate({
                              target: {
                                ...lightData.target,
                                y: value,
                              },
                            });
                          }
                        }}
                        style={{
                          width: "60px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid #555",
                          color: "#fff",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontSize: "9px",
                          textAlign: "center",
                        }}
                      />
                    </div>
                  </div>

                  <div style={controlStyle}>
                    <label style={labelStyle}>Target Z</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        value={lightData.target.z || 0}
                        onChange={(e) =>
                          onUpdate({
                            target: {
                              ...lightData.target,
                              z: parseFloat(e.target.value),
                            },
                          })
                        }
                        style={{ ...sliderStyle, flex: 1 }}
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={lightData.target.z?.toFixed(1) || "0.0"}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            onUpdate({
                              target: {
                                ...lightData.target,
                                z: value,
                              },
                            });
                          }
                        }}
                        style={{
                          width: "60px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid #555",
                          color: "#fff",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontSize: "9px",
                          textAlign: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
        </>
      )}

      {/* Spot Light specific controls */}
      {lightType === "spot" && (
        <>
          <div style={controlStyle}>
            <label style={labelStyle}>Angle (degrees)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="5"
                max="90"
                step="1"
                value={((lightData.angle || 0) * 180) / Math.PI}
                onChange={(e) =>
                  onUpdate({
                    angle: (parseFloat(e.target.value) * Math.PI) / 180,
                  })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                min="5"
                max="90"
                step="1"
                value={Math.round(((lightData.angle || 0) * 180) / Math.PI)}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 5 && value <= 90) {
                    onUpdate({
                      angle: (value * Math.PI) / 180,
                    });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Penumbra</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={lightData.penumbra || 0}
                onChange={(e) =>
                  onUpdate({ penumbra: parseFloat(e.target.value) })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={lightData.penumbra?.toFixed(2) || "0.00"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 1) {
                    onUpdate({ penumbra: value });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Point/Spot Light distance and decay */}
      {(lightType === "point" || lightType === "spot") && (
        <>
          <div style={controlStyle}>
            <label style={labelStyle}>Distance</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={lightData.distance || 0}
                onChange={(e) =>
                  onUpdate({ distance: parseFloat(e.target.value) })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                min="0"
                step="0.5"
                value={lightData.distance?.toFixed(1) || "0.0"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    onUpdate({ distance: value });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Decay</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={lightData.decay || 0}
                onChange={(e) =>
                  onUpdate({ decay: parseFloat(e.target.value) })
                }
                style={{ ...sliderStyle, flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="3"
                step="0.1"
                value={lightData.decay?.toFixed(1) || "0.0"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 3) {
                    onUpdate({ decay: value });
                  }
                }}
                style={{
                  width: "60px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid #555",
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  textAlign: "center",
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Shadow toggle for non-ambient lights */}
      {lightType !== "ambient" && (
        <div style={controlStyle}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={lightData.castShadow || false}
              onChange={(e) => onUpdate({ castShadow: e.target.checked })}
              style={{ marginRight: "5px" }}
            />
            Cast Shadow
          </label>
        </div>
      )}
    </div>
  );
}

// 🚀 FUTURE PANEL TEMPLATE - Ready for easy expansion
// Copy this template and modify for new debug panels
export function LightingDebugUI({ DEVELOPER_CONFIG, DEBUG_UI_CONFIG }) {
  // Don't use local state - use window data directly
  const [windowData, setWindowData] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { position, isVisible } = useDebugUIPosition("lightingDebug");

  const handleToggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    if (window.setIsLightingMinimized) {
      window.setIsLightingMinimized(newMinimizedState);
    }
  };

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
          onClick={handleToggleMinimize}
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
        <div
          style={{
            maxHeight: "70vh", // Maksimum yükseklik ekranın %70'i
            overflowY: "auto", // Dikey scroll
            overflowX: "hidden", // Yatay scroll gizli
            paddingRight: "8px", // Scrollbar için alan
            marginRight: "-8px", // Genel genişliği korumak için

            // Custom scrollbar styles (webkit browsers)
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: "rgba(0, 255, 136, 0.6) rgba(255, 255, 255, 0.1)", // Firefox
          }}
          className="lighting-debug-scroll"
        >
          {/* Advanced Lighting Controls */}
          {windowData.advancedLights && (
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  color: "#00ff88",
                  margin: "0 0 10px 0",
                  fontSize: "11px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  ADVANCED LIGHTING{" "}
                  {windowData.selectedLight &&
                    `(Selected: ${windowData.selectedLight})`}
                </span>

                {/* Light Management Buttons */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() =>
                      windowData.addSpotLight && windowData.addSpotLight()
                    }
                    style={{
                      background: "rgba(255, 221, 170, 0.2)",
                      border: "1px solid #ffddaa",
                      color: "#ffddaa",
                      fontSize: "8px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title="Add Spot Light"
                  >
                    +SPOT
                  </button>
                  <button
                    onClick={() =>
                      windowData.addPointLight && windowData.addPointLight()
                    }
                    style={{
                      background: "rgba(170, 255, 221, 0.2)",
                      border: "1px solid #aaffdd",
                      color: "#aaffdd",
                      fontSize: "8px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title="Add Point Light"
                  >
                    +POINT
                  </button>
                  <button
                    onClick={() => {
                      if (
                        windowData.setAdvancedLights &&
                        confirm("Reset all lighting settings to default?")
                      ) {
                        localStorage.removeItem("webmesh-lighting-settings");
                        window.location.reload(); // Reload to apply default settings
                      }
                    }}
                    style={{
                      background: "rgba(255, 0, 0, 0.2)",
                      border: "1px solid #ff0000",
                      color: "#ff0000",
                      fontSize: "8px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    title="Reset All Lighting Settings"
                  >
                    RESET
                  </button>
                </div>
              </h4>

              {/* Selected Light Indicator */}
              {windowData.selectedLight && (
                <div
                  style={{
                    background: "rgba(255, 165, 0, 0.2)",
                    padding: "8px",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    border: "1px solid #ffa500",
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#ffa500" }}>
                    🎯 Selected: {windowData.selectedLight.toUpperCase()}
                  </div>
                  <div
                    style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}
                  >
                    Use sliders to position | ESC to deselect
                  </div>
                </div>
              )}

              {/* Ambient Light Controls */}
              {windowData.advancedLights.ambient && (
                <div style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      borderBottom: "1px solid #333",
                      paddingBottom: "5px",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    AMBIENT LIGHT
                  </div>
                  <AdvancedLightControls
                    lightType="ambient"
                    lightData={windowData.advancedLights.ambient}
                    lightId="ambient"
                    canDelete={false}
                    onUpdate={(updates) => {
                      if (windowData.setAdvancedLights) {
                        windowData.setAdvancedLights((prev) => ({
                          ...prev,
                          ambient: { ...prev.ambient, ...updates },
                        }));
                      }
                    }}
                  />
                </div>
              )}

              {/* Directional Light Controls */}
              {windowData.advancedLights.directional && (
                <div style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      borderBottom: "1px solid #333",
                      paddingBottom: "5px",
                      marginBottom: "8px",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    DIRECTIONAL LIGHT
                  </div>
                  <AdvancedLightControls
                    lightType="directional"
                    lightData={windowData.advancedLights.directional}
                    lightId="directional"
                    canDelete={false}
                    onUpdate={(updates) => {
                      if (windowData.setAdvancedLights) {
                        windowData.setAdvancedLights((prev) => ({
                          ...prev,
                          directional: { ...prev.directional, ...updates },
                        }));
                      }
                    }}
                  />
                </div>
              )}

              {/* Multiple Spot Lights */}
              {windowData.advancedLights.spots &&
                windowData.advancedLights.spots.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        borderBottom: "1px solid #333",
                        paddingBottom: "5px",
                        marginBottom: "8px",
                        color: "#ffddaa",
                        fontSize: "9px",
                        fontWeight: "bold",
                      }}
                    >
                      SPOT LIGHTS ({windowData.advancedLights.spots.length})
                    </div>
                    {windowData.advancedLights.spots.map((spotLight, index) => (
                      <AdvancedLightControls
                        key={spotLight.id}
                        lightType="spot"
                        lightData={spotLight}
                        lightId={spotLight.id}
                        canDelete={windowData.advancedLights.spots.length > 1}
                        onDelete={(lightId) => {
                          if (windowData.removeSpotLight) {
                            windowData.removeSpotLight(lightId);
                          }
                        }}
                        onUpdate={(updates) => {
                          if (windowData.setAdvancedLights) {
                            windowData.setAdvancedLights((prev) => ({
                              ...prev,
                              spots: prev.spots.map((light) =>
                                light.id === spotLight.id
                                  ? { ...light, ...updates }
                                  : light
                              ),
                            }));
                          }
                        }}
                      />
                    ))}
                  </div>
                )}

              {/* Multiple Point Lights */}
              {windowData.advancedLights.points &&
                windowData.advancedLights.points.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        borderBottom: "1px solid #333",
                        paddingBottom: "5px",
                        marginBottom: "8px",
                        color: "#aaffdd",
                        fontSize: "9px",
                        fontWeight: "bold",
                      }}
                    >
                      POINT LIGHTS ({windowData.advancedLights.points.length})
                    </div>
                    {windowData.advancedLights.points.map(
                      (pointLight, index) => (
                        <AdvancedLightControls
                          key={pointLight.id}
                          lightType="point"
                          lightData={pointLight}
                          lightId={pointLight.id}
                          canDelete={
                            windowData.advancedLights.points.length > 1
                          }
                          onDelete={(lightId) => {
                            if (windowData.removePointLight) {
                              windowData.removePointLight(lightId);
                            }
                          }}
                          onUpdate={(updates) => {
                            if (windowData.setAdvancedLights) {
                              windowData.setAdvancedLights((prev) => ({
                                ...prev,
                                points: prev.points.map((light) =>
                                  light.id === pointLight.id
                                    ? { ...light, ...updates }
                                    : light
                                ),
                              }));
                            }
                          }}
                        />
                      )
                    )}
                  </div>
                )}
            </div>
          )}

          <div style={{ fontSize: "10px", color: "#888", marginTop: "10px" }}>
            💡 Click helpers to select | Use sliders to position | H toggle
            panels
          </div>
        </div>
      )}
    </div>
  );
}

export default LightingDebugUI;
