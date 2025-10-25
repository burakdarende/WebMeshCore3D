// ═══════════════════════════════════════════════════════════════════════════════
// QUALITY DEBUG UI
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { useDebugUIPosition } from "./UILayoutManager";

export function QualityDebugUI({ DEVELOPER_CONFIG, DEBUG_UI_CONFIG }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const { position, isVisible } = useDebugUIPosition("qualityDebug");

  if (
    !DEVELOPER_CONFIG.ENABLE_DEBUG_MODE ||
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
        border: `2px solid ${DEBUG_UI_CONFIG.panels.QUALITY_DEBUG.color}`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        pointerEvents: "auto",
        transition: "bottom 0.3s ease-in-out, top 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          color: `${DEBUG_UI_CONFIG.panels.QUALITY_DEBUG.color}`,
          fontWeight: "bold",
          marginBottom: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{DEBUG_UI_CONFIG.panels.QUALITY_DEBUG.icon} QUALITY DEBUG</span>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: "none",
            border: "none",
            color: `${DEBUG_UI_CONFIG.panels.QUALITY_DEBUG.color}`,
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
        <div>
          <p>Quality settings will be here.</p>
        </div>
      )}
    </div>
  );
}
