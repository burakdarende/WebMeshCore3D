// ═══════════════════════════════════════════════════════════════════════════════
// UI STYLE INJECTOR
// ═══════════════════════════════════════════════════════════════════════════════
// Injects CSS styles for debug UI components

import { useEffect } from "react";
import { UI_STYLES } from "./UIConfig";

export function UIStyleInjector() {
  useEffect(() => {
    // Check if styles are already injected
    if (document.getElementById("debug-ui-styles")) {
      return;
    }

    // Create and inject styles
    const styleElement = document.createElement("style");
    styleElement.id = "debug-ui-styles";
    styleElement.textContent = UI_STYLES;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      const existingStyles = document.getElementById("debug-ui-styles");
      if (existingStyles) {
        existingStyles.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
