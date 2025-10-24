// ═══════════════════════════════════════════════════════════════════════════════
// COLLIDER DEBUG UI (Original Style)
// ═══════════════════════════════════════════════════════════════════════════════
// Original external UI panel - exactly as it was before

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";
import {
  COLLIDER_CONFIG,
  ColliderUtils,
  AVAILABLE_ANIMATIONS,
} from "../systems/ColliderConfig";
import { useModalActions } from "./modal/ModalSystem";
import { AboutModal } from "./modal/ModalContents";
import { DownloadModal } from "./modal/DownloadModal";
import { MusicModal } from "./modal/MusicModal";
import { ContactModal } from "./modal/ContactModal";
import { GamesModal } from "./modal/GamesModal";
import { PortfolioModal } from "./modal/PortfolioModal";

export function ColliderDebugUI({
  colliders,
  onCollidersUpdate,
  selectedCollider,
  onSelectCollider,
  availableAnimations = AVAILABLE_ANIMATIONS,
}) {
  const [jsonCode, setJsonCode] = useState("");
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { position, isVisible } = useDebugUIPosition("colliderDebug");
  const modalActions = useModalActions();

  // Update JSON when colliders change
  useEffect(() => {
    setJsonCode(ColliderUtils.exportToJSON(colliders));
  }, [colliders]);

  const addNewCollider = () => {
    const newCollider = ColliderUtils.createNewCollider();
    const updatedColliders = [...colliders, newCollider];
    onCollidersUpdate(updatedColliders);
    onSelectCollider(newCollider.id);
  };

  const deleteSelectedCollider = () => {
    if (!selectedCollider) return;
    const updatedColliders = colliders.filter((c) => c.id !== selectedCollider);
    onCollidersUpdate(updatedColliders);
    onSelectCollider(null);
  };

  const updateSelectedCollider = (updates) => {
    if (!selectedCollider) return;
    const updatedColliders = colliders.map((collider) =>
      collider.id === selectedCollider ? { ...collider, ...updates } : collider
    );
    onCollidersUpdate(updatedColliders);
  };

  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonCode);
      alert("✅ JSON copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = jsonCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("✅ JSON copied to clipboard!");
    }
  };

  const selectedColliderData = colliders.find((c) => c.id === selectedCollider);

  const testModalSystem = () => {
    modalActions.showCustom(<AboutModal />, {
      title: "🎯 Modal System Test",
      size: "medium",
      glassMorphism: true,
    });
  };

  const assignModalToCollider = (modalType) => {
    if (!selectedCollider) {
      alert("Please select a collider first!");
      return;
    }

    const modalLink = `modal:${modalType}`;
    updateSelectedCollider({ link: modalLink });

    // Show a preview of the assigned modal
    let modalContent, title;
    switch (modalType) {
      case "download":
        modalContent = <DownloadModal />;
        title = "📥 Downloads & Assets";
        break;
      case "music":
        modalContent = <MusicModal />;
        title = "🎵 Music & Audio";
        break;
      case "contact":
        modalContent = <ContactModal />;
        title = "💬 Contact Form";
        break;
      case "games":
        modalContent = <GamesModal />;
        title = "🎮 Games Portfolio";
        break;
      case "portfolio":
        modalContent = <PortfolioModal />;
        title = "🎨 Creative Portfolio";
        break;
      default:
        modalContent = <AboutModal />;
        title = "📖 About";
    }

    modalActions.showCustom(modalContent, {
      title: `${title} - Assigned to ${selectedCollider}`,
      size: "large",
      glassMorphism: true,
    });
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // Only show in development
  } else {
    return null;
  }

  if (!isVisible || !position) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        border: "2px solid #ff00ff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        pointerEvents: "auto",
        maxHeight: "600px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          color: "#ff00ff",
          fontWeight: "bold",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🎯 COLLIDER DEBUG</span>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: "none",
            border: "none",
            color: "#ff00ff",
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 6px",
            borderRadius: "3px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(255,0,255,0.1)")
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          {isMinimized ? "+" : "−"}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Collider Management */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ marginBottom: "10px" }}>
              <button
                onClick={addNewCollider}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                  fontSize: "11px",
                }}
              >
                ➕ Add Collider
              </button>
              <button
                onClick={deleteSelectedCollider}
                disabled={!selectedCollider}
                style={{
                  background: selectedCollider ? "#dc3545" : "#666",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: selectedCollider ? "pointer" : "not-allowed",
                  fontSize: "11px",
                  marginRight: "10px",
                }}
              >
                🗑️ Delete
              </button>
              <button
                onClick={testModalSystem}
                style={{
                  background: "#6f42c1",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                🚀 Test Modal
              </button>
            </div>

            <div style={{ fontSize: "10px", color: "#888" }}>
              Total: {colliders.length} | Selected: {selectedCollider || "None"}
            </div>
          </div>

          {/* Selected Collider Properties */}
          {selectedColliderData && (
            <div
              style={{
                marginBottom: "15px",
                padding: "10px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  color: "#ffff00",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                📦 {selectedColliderData.id}
              </div>

              {/* Position Controls */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "10px",
                  }}
                >
                  Position: [
                  {selectedColliderData.position
                    .map((v) => v.toFixed(2))
                    .join(", ")}
                  ]
                </label>
                {["X", "Y", "Z"].map((axis, index) => (
                  <div
                    key={axis}
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "#ccc",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      {axis}:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        step="0.001"
                        value={selectedColliderData.position[index]}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || value === "-") return; // Allow empty and negative sign
                          const newValue = parseFloat(value);
                          if (!isNaN(newValue)) {
                            const newPosition = [
                              ...selectedColliderData.position,
                            ];
                            newPosition[index] = newValue;
                            updateSelectedCollider({ position: newPosition });
                          }
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation(); // Prevent global shortcuts
                          if (e.key === "Enter") {
                            e.target.blur();
                          }
                        }}
                        onKeyUp={(e) => {
                          e.stopPropagation(); // Prevent global shortcuts
                        }}
                        style={{
                          width: "70px",
                          padding: "2px 4px",
                          background: "#333",
                          color: "white",
                          border: "1px solid #666",
                          borderRadius: "3px",
                          fontSize: "10px",
                        }}
                      />
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.01"
                        value={selectedColliderData.position[index]}
                        onChange={(e) => {
                          const newPosition = [
                            ...selectedColliderData.position,
                          ];
                          newPosition[index] = parseFloat(e.target.value);
                          updateSelectedCollider({ position: newPosition });
                        }}
                        style={{
                          flex: "1",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Scale Controls */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "10px",
                  }}
                >
                  Scale: [
                  {selectedColliderData.size
                    ? selectedColliderData.size
                        .map((v) => v.toFixed(2))
                        .join(", ")
                    : "0, 0, 0"}
                  ]
                </label>
                {["X", "Y", "Z"].map((axis, index) => (
                  <div
                    key={axis}
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "#ccc",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      {axis}:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={
                          selectedColliderData.size
                            ? selectedColliderData.size[index]
                            : 1
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") return; // Allow empty
                          const newValue = parseFloat(value);
                          if (!isNaN(newValue) && newValue > 0) {
                            const newSize = [
                              ...(selectedColliderData.size || [1, 1, 1]),
                            ];
                            newSize[index] = Math.max(0.001, newValue);
                            updateSelectedCollider({ size: newSize });
                          }
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation(); // Prevent global shortcuts
                          if (e.key === "Enter") {
                            e.target.blur();
                          }
                        }}
                        onKeyUp={(e) => {
                          e.stopPropagation(); // Prevent global shortcuts
                        }}
                        style={{
                          width: "70px",
                          padding: "2px 4px",
                          background: "#333",
                          color: "white",
                          border: "1px solid #666",
                          borderRadius: "3px",
                          fontSize: "10px",
                        }}
                      />
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.01"
                        value={
                          selectedColliderData.size
                            ? selectedColliderData.size[index]
                            : 1
                        }
                        onChange={(e) => {
                          const newSize = [
                            ...(selectedColliderData.size || [1, 1, 1]),
                          ];
                          newSize[index] = parseFloat(e.target.value);
                          updateSelectedCollider({ size: newSize });
                        }}
                        style={{
                          flex: "1",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Link Input */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "10px",
                  }}
                >
                  Link URL:
                </label>
                <input
                  type="text"
                  value={selectedColliderData.link || ""}
                  onChange={(e) =>
                    updateSelectedCollider({ link: e.target.value })
                  }
                  onKeyDown={(e) => {
                    // Prevent keyboard shortcuts while typing
                    e.stopPropagation();
                  }}
                  onKeyUp={(e) => {
                    // Prevent keyboard shortcuts while typing
                    e.stopPropagation();
                  }}
                  onFocus={(e) => {
                    // Disable global keyboard shortcuts when focused
                    e.target.dataset.keyboardDisabled = "true";
                  }}
                  onBlur={(e) => {
                    // Re-enable global keyboard shortcuts when unfocused
                    delete e.target.dataset.keyboardDisabled;
                  }}
                  placeholder="https://example.com or modal:type"
                  style={{
                    width: "100%",
                    padding: "4px",
                    background: "#333",
                    color: "white",
                    border: "1px solid #666",
                    borderRadius: "3px",
                    fontSize: "10px",
                  }}
                />

                {/* Quick Modal Assignment Buttons */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "5px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={() => assignModalToCollider("download")}
                    style={{
                      padding: "6px 8px",
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "9px",
                    }}
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => assignModalToCollider("music")}
                    style={{
                      padding: "6px 8px",
                      background: "#8b5cf6",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "9px",
                    }}
                  >
                    🎵 Music
                  </button>
                  <button
                    onClick={() => assignModalToCollider("contact")}
                    style={{
                      padding: "6px 8px",
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "9px",
                    }}
                  >
                    💬 Contact
                  </button>
                  <button
                    onClick={() => assignModalToCollider("games")}
                    style={{
                      padding: "6px 8px",
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "9px",
                    }}
                  >
                    🎮 Games
                  </button>
                  <button
                    onClick={() => assignModalToCollider("portfolio")}
                    style={{
                      padding: "6px 8px",
                      background: "#ec4899",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "9px",
                    }}
                  >
                    🎨 Portfolio
                  </button>
                  <button
                    onClick={() => updateSelectedCollider({ link: "" })}
                    style={{
                      padding: "6px 8px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "9px",
                    }}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>

              {/* Animation Selection */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "10px",
                  }}
                >
                  Animation:
                </label>
                <select
                  value={selectedColliderData.animation || ""}
                  onChange={(e) =>
                    updateSelectedCollider({
                      animation: e.target.value || null,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "4px",
                    background: "#333",
                    color: "white",
                    border: "1px solid #666",
                    borderRadius: "3px",
                    fontSize: "10px",
                  }}
                >
                  <option value="">No Animation</option>
                  {availableAnimations.map((anim) => (
                    <option key={anim.id} value={anim.id}>
                      {anim.name} ({anim.duration}s)
                    </option>
                  ))}
                </select>
                {/* Test Animation Button */}
                {selectedColliderData.animation && (
                  <button
                    onClick={() => {
                      const animName = selectedColliderData.animation;
                      console.log(
                        `🎯 ColliderDebugUI - Selected animation: '${animName}'`
                      );
                      console.log(
                        `🔗 Animation mapping:`,
                        window.animationMapping
                      );

                      if (!animName) {
                        alert("Please select an animation first!");
                        return;
                      }

                      if (window.modelAnimations) {
                        console.log(`🎬 Testing animation: ${animName}`);
                        window.modelAnimations.play(animName);
                      } else {
                        console.warn(
                          "⚠️ Animation system not ready - Model may still be loading"
                        );
                        alert(
                          "Animation system not ready. Make sure the 3D model is fully loaded."
                        );
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "5px",
                      background: "#17a2b8",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    🎬 Test Animation
                  </button>
                )}
              </div>
            </div>
          )}

          {/* JSON Code Editor */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ marginBottom: "10px" }}>
              <button
                onClick={() => setShowJsonEditor(!showJsonEditor)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "10px",
                  marginRight: "10px",
                }}
              >
                {showJsonEditor ? "📄 Hide JSON" : "🔧 Show JSON"}
              </button>
              {showJsonEditor && (
                <>
                  <button
                    onClick={copyJsonToClipboard}
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    📋 Copy Code
                  </button>
                </>
              )}
            </div>

            {showJsonEditor && (
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#ffc107",
                    marginBottom: "8px",
                    padding: "8px",
                    background: "rgba(255, 193, 7, 0.1)",
                    borderRadius: "4px",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                  }}
                >
                  📝 To edit colliders, copy this JSON and paste it into: <br />
                  <code style={{ color: "#00ff88" }}>public/collider.json</code>
                </div>
                <textarea
                  value={jsonCode}
                  readOnly
                  style={{
                    width: "100%",
                    height: "200px",
                    padding: "8px",
                    background: "#1a1a1a",
                    color: "#00ff00",
                    border: "1px solid #333",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    resize: "vertical",
                  }}
                  placeholder="JSON collider data..."
                />
              </div>
            )}
          </div>

          <div style={{ fontSize: "9px", color: "#888" }}>
            🎮 G: move | S: scale | X/Y/Z: axis lock | ESC: cancel
          </div>
        </>
      )}
    </div>
  );
}

export default ColliderDebugUI;
