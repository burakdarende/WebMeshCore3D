// ═══════════════════════════════════════════════════════════════════════════════
// UI LAYOUT MANAGER - RESPONSIVE DEBUG UI POSITIONING
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from "react";

export const UILayoutManager = ({ children, DEVELOPER_CONFIG }) => {
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [isLightingMinimized, setIsLightingMinimized] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // H key toggle handler
  const handleKeyPress = useCallback((event) => {
    if (event.key.toLowerCase() === "h") {
      setIsUIVisible((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Calculate responsive positions
  const getUIPositions = () => {
    const margin = 20;
    const panelWidth = 300;
    const lightingPanelHeight = isLightingMinimized ? 50 : 280; // Approximate height for calculation
    const spacing = 20;

    // Left column positioning
    const leftColumn = margin;

    return {
      // Help info - top right (always visible)
      helpInfo: {
        top: margin,
        right: margin,
        width: 200,
        height: 60,
      },

      // Left column - stack vertically
      colliderDebug: {
        top: margin,
        left: leftColumn,
        width: panelWidth,
      },

      bloomDebug: {
        bottom: margin,
        left: `calc(50% - ${panelWidth / 2}px)`, // Ekranın ortasında
        width: panelWidth,
      },

      // Camera debug - fixed at bottom left
      cameraDebug: {
        bottom: margin,
        left: margin,
        width: panelWidth,
      },

      // Lighting debug - fixed at bottom right
      lightingDebug: {
        bottom: margin,
        right: margin,
        width: panelWidth,
      },

      // Quality debug - above lighting debug
      qualityDebug: {
        bottom: margin + lightingPanelHeight + spacing,
        right: margin,
        width: panelWidth,
      },
    };
  };

  const positions = getUIPositions();

  // Store positions globally for debug UI components to access
  useEffect(() => {
    window.debugUIPositions = positions;
    window.isDebugUIVisible = isUIVisible;
    window.setIsLightingMinimized = setIsLightingMinimized;
  }, [positions, isUIVisible]);

  return (
    <>
      {/* Help Info Panel - Only visible when debug mode is enabled */}
      {DEVELOPER_CONFIG && DEVELOPER_CONFIG.ENABLE_DEBUG_MODE && (
        <div
          style={{
            position: "fixed",
            top: positions.helpInfo.top,
            right: positions.helpInfo.right,
            width: positions.helpInfo.width,
            height: positions.helpInfo.height,
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Reduced opacity
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontFamily: "monospace",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#00ff88",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            🎮 DEBUG CONTROLS
          </div>
          <div style={{ color: "#ffffff" }}>
            Press{" "}
            <span style={{ color: "#ffff00", fontWeight: "bold" }}>H</span> to
            toggle UI & Wireframe
          </div>
        </div>
      )}

      {/* Children with UI visibility context */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isUIVisible });
        }
        return child;
      })}
    </>
  );
};

// Hook for debug UI components to get their position
export const useDebugUIPosition = (panelType) => {
  const [position, setPosition] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updatePosition = () => {
      if (window.debugUIPositions) {
        setPosition(window.debugUIPositions[panelType]);
      }
      if (typeof window.isDebugUIVisible !== "undefined") {
        setIsVisible(window.isDebugUIVisible);
      }
    };

    updatePosition();

    // Update on window resize
    window.addEventListener("resize", updatePosition);

    // Check for position updates periodically
    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener("resize", updatePosition);
      clearInterval(interval);
    };
  }, [panelType]);

  return { position, isVisible };
};
