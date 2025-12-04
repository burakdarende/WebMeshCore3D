// ═══════════════════════════════════════════════════════════════════════════════
// ADAPTIVE QUALITY MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
// Monitors performance and automatically adjusts quality settings
// to maintain target FPS.

import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PERFORMANCE_CONFIG, VISUAL_CONFIG } from "../../config/app-config";

export function AdaptiveQualityManager({
    currentPreset,
    onQualityChange,
    enabled = true,
}) {
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const fpsHistory = useRef([]);
    const [isStabilizing, setIsStabilizing] = useState(true);

    // Quality levels ordered from highest to lowest
    const qualityLevels = ["ultra", "high", "medium", "low"];

    useEffect(() => {
        // Give the system some time to stabilize on load before checking FPS
        // Increased to 5 seconds to avoid false positives during initial model load
        const timer = setTimeout(() => {
            setIsStabilizing(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useFrame(() => {
        if (!enabled || isStabilizing) return;

        frameCount.current++;
        const time = performance.now();

        if (time >= lastTime.current + 1000) {
            const fps = Math.round(
                (frameCount.current * 1000) / (time - lastTime.current)
            );

            // Reset counter immediately
            frameCount.current = 0;
            lastTime.current = time;

            // Ignore 0 FPS (usually means tab is backgrounded or just starting)
            if (fps === 0) return;

            // Add to history
            fpsHistory.current.push(fps);
            if (fpsHistory.current.length > 5) fpsHistory.current.shift();

            // Calculate average FPS
            const avgFps =
                fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;

            // Check if we need to downgrade
            // Only downgrade if we are consistently below target (e.g. 30fps for smooth experience)
            // and not already at the lowest setting
            if (
                avgFps < 30 &&
                currentPreset !== "low" &&
                PERFORMANCE_CONFIG.fps.adaptive
            ) {
                const currentIndex = qualityLevels.indexOf(currentPreset);
                if (currentIndex < qualityLevels.length - 1) {
                    const nextPreset = qualityLevels[currentIndex + 1];
                    console.warn(
                        `⚠️ Low FPS detected (${avgFps.toFixed(1)}). Downgrading quality to: ${nextPreset}`
                    );

                    // Apply new preset
                    const newSettings = VISUAL_CONFIG.qualityPresets[nextPreset];
                    onQualityChange(nextPreset, newSettings);

                    // Reset stabilization to prevent rapid switching
                    setIsStabilizing(true);
                    fpsHistory.current = [];
                    setTimeout(() => setIsStabilizing(false), 2000);
                }
            }
        }
    });

    return null;
}
