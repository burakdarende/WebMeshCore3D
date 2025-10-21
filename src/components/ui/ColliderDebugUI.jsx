// ═══════════════════════════════════════════════════════════════════════════════
// COLLIDER DEBUG UI (Original Style)
// ═══════════════════════════════════════════════════════════════════════════════
// Original external UI panel - exactly as it was before

import React, { useState, useEffect } from "react";
import {
  COLLIDER_CONFIG,
  ColliderUtils,
  AVAILABLE_ANIMATIONS,
} from "../systems/ColliderConfig";

export function ColliderDebugUI({
  colliders,
  onCollidersUpdate,
  selectedCollider,
  onSelectCollider,
  availableAnimations = AVAILABLE_ANIMATIONS,
}) {
  const [jsonCode, setJsonCode] = useState("");
  const [showJsonEditor, setShowJsonEditor] = useState(false);

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

  const applyJsonCode = () => {
    try {
      const importedColliders = ColliderUtils.importFromJSON(jsonCode);
      const validColliders = importedColliders.filter(
        ColliderUtils.validateCollider
      );

      if (validColliders.length > 0) {
        onCollidersUpdate(validColliders);
        onSelectCollider(null);
        alert(`✅ Successfully imported ${validColliders.length} colliders`);
      } else {
        alert("❌ No valid colliders found in JSON");
      }
    } catch (error) {
      alert(`❌ Invalid JSON: ${error.message}`);
    }
  };

  const selectedColliderData = colliders.find((c) => c.id === selectedCollider);

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // Only show in development
  } else {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: `${20 + 3 * (320 + 50)}px`, // After other panels
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: "320px",
        maxWidth: "400px",
        border: "2px solid #ff00ff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
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
        }}
      >
        🎯 COLLIDER DEBUG
      </div>

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
            }}
          >
            🗑️ Delete
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
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
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
                        const newPosition = [...selectedColliderData.position];
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
                      const newPosition = [...selectedColliderData.position];
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
              {selectedColliderData.scale.map((v) => v.toFixed(2)).join(", ")}]
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
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={selectedColliderData.scale[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") return; // Allow empty
                      const newValue = parseFloat(value);
                      if (!isNaN(newValue) && newValue > 0) {
                        const newScale = [...selectedColliderData.scale];
                        newScale[index] = Math.max(0.001, newValue);
                        updateSelectedCollider({ scale: newScale });
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
                    value={selectedColliderData.scale[index]}
                    onChange={(e) => {
                      const newScale = [...selectedColliderData.scale];
                      newScale[index] = parseFloat(e.target.value);
                      updateSelectedCollider({ scale: newScale });
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
              onChange={(e) => updateSelectedCollider({ link: e.target.value })}
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
              placeholder="https://example.com"
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
                updateSelectedCollider({ animation: e.target.value || null })
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
                  if (window.modelAnimations) {
                    window.modelAnimations.play(selectedColliderData.animation);
                  } else {
                    console.warn("⚠️ Animation system not ready");
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
                onClick={applyJsonCode}
                style={{
                  background: "#ffc107",
                  color: "black",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "10px",
                  marginRight: "10px",
                }}
              >
                ✅ Apply JSON
              </button>
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
          <textarea
            value={jsonCode}
            onChange={(e) => setJsonCode(e.target.value)}
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
        )}
      </div>

      <div style={{ fontSize: "9px", color: "#888" }}>
        🎮 G: move | S: scale | X/Y/Z: axis lock | ESC: cancel
      </div>
    </div>
  );
}

export default ColliderDebugUI;
