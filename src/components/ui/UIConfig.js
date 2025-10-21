// ═══════════════════════════════════════════════════════════════════════════════
// UI CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// Configuration and utilities for debug UI components

export const UI_CONFIG = {
  // UI Panel Settings
  panel: {
    width: 300,
    maxHeight: "80vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    fontSize: "14px",
    fontFamily: "monospace",
    borderRadius: "8px",
    padding: "16px",
    zIndex: 1000,
  },

  // Position settings for different UI panels
  positions: {
    topLeft: { top: "20px", left: "20px" },
    topRight: { top: "20px", right: "20px" },
    bottomLeft: { bottom: "20px", left: "20px" },
    bottomRight: { bottom: "20px", right: "20px" },
  },

  // UI Element styles
  elements: {
    slider: {
      width: "100%",
      height: "20px",
      margin: "8px 0",
      accentColor: "#007acc",
    },
    button: {
      backgroundColor: "#007acc",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      margin: "4px 2px",
    },
    input: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      width: "60px",
    },
    label: {
      display: "block",
      marginBottom: "4px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    section: {
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    },
    checkbox: {
      marginRight: "8px",
      accentColor: "#007acc",
    },
  },

  // Animation settings
  animations: {
    fadeIn: {
      animation: "fadeIn 0.3s ease-in-out",
    },
    slideIn: {
      animation: "slideIn 0.3s ease-in-out",
    },
  },
};

// Common UI utility functions
export const UIUtils = {
  // Format number for display
  formatNumber: (value, decimals = 2) => {
    return parseFloat(value).toFixed(decimals);
  },

  // Create slider element
  createSlider: (min, max, step, value, onChange, label) => ({
    type: "slider",
    min,
    max,
    step,
    value,
    onChange,
    label,
  }),

  // Create button element
  createButton: (text, onClick, variant = "primary") => ({
    type: "button",
    text,
    onClick,
    variant,
  }),

  // Create input element
  createInput: (value, onChange, type = "number", label) => ({
    type: "input",
    value,
    onChange,
    inputType: type,
    label,
  }),

  // Create checkbox element
  createCheckbox: (checked, onChange, label) => ({
    type: "checkbox",
    checked,
    onChange,
    label,
  }),

  // Create section divider
  createSection: (title) => ({
    type: "section",
    title,
  }),
};

// CSS styles to be injected for animations
export const UI_STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateX(-20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }

  .debug-ui-panel {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-family: monospace;
    font-size: 14px;
    border-radius: 8px;
    padding: 16px;
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .debug-ui-panel::-webkit-scrollbar {
    width: 6px;
  }

  .debug-ui-panel::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .debug-ui-panel::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .debug-ui-panel::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .debug-ui-section {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .debug-ui-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .debug-ui-section h3 {
    margin: 0 0 12px 0;
    color: #007acc;
    font-size: 16px;
  }

  .debug-ui-control {
    margin-bottom: 12px;
  }

  .debug-ui-control:last-child {
    margin-bottom: 0;
  }

  .debug-ui-label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
  }

  .debug-ui-slider {
    width: 100%;
    height: 20px;
    margin: 8px 0;
    accent-color: #007acc;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  .debug-ui-button {
    background-color: #007acc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin: 4px 2px;
    transition: background-color 0.2s;
  }

  .debug-ui-button:hover {
    background-color: #005a9e;
  }

  .debug-ui-button.secondary {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .debug-ui-button.secondary:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .debug-ui-input {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    width: 60px;
    font-family: monospace;
  }

  .debug-ui-input:focus {
    outline: none;
    border-color: #007acc;
    background-color: rgba(255, 255, 255, 0.15);
  }

  .debug-ui-checkbox {
    margin-right: 8px;
    accent-color: #007acc;
    transform: scale(1.2);
  }

  .debug-ui-inline {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .debug-ui-value {
    font-family: monospace;
    color: #00ff88;
    font-size: 11px;
    margin-left: 8px;
  }
`;
