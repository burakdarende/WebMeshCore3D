// ═══════════════════════════════════════════════════════════════════════════════
// QUALITY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { DEVELOPER_CONFIG, VISUAL_CONFIG } from "../../config/app-config";

export function useQualitySystem() {
  const [qualityPreset, setQualityPreset] = useState(
    VISUAL_CONFIG.qualityPreset
  );
  const [qualitySettings, setQualitySettings] = useState(
    VISUAL_CONFIG.qualityPresets[qualityPreset]
  );

  const handleQualityChange = useCallback((preset, settings) => {
    setQualityPreset(preset);
    setQualitySettings(settings);
    console.log(`Quality preset changed to: ${preset}`, settings);
  }, []);

  return {
    qualityPreset,
    qualitySettings,
    handleQualityChange,
    presets: VISUAL_CONFIG.qualityPresets,
  };
}
