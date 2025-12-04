// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN SYSTEM (ROBUST VERSION)
// ═══════════════════════════════════════════════════════════════════════════════
// Uses @react-three/drei's useVideoTexture for reliable playback and caching.

import React, { Suspense, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

// Configuration
const SCREEN_CONFIG = [
    { id: "TV_Screen", file: "/TV_Screen.mp4", intensity: 1.5 },
    { id: "TV_Screen_2", file: "/TV_Screen_2.mp4", intensity: 1.5, rotation: Math.PI / -2 },
    { id: "cerceve_1", file: "/cerceve_1.mp4", intensity: 1.2, rotation: Math.PI / -1 },
    { id: "cerceve_2", file: "/cerceve_2.mp4", intensity: 1.2, rotation: Math.PI / -1 },
    { id: "cerceve_3", file: "/cerceve_3.mp4", intensity: 1.2, rotation: Math.PI / -1 },
    { id: "Mon_1", file: "/Mon_1.mp4", intensity: 2.0 },
    { id: "Mon_2", file: "/Mon_2.mp4", intensity: 2.0 },
    { id: "Mon_3", file: "/Mon_3.mp4", intensity: 2.0 },
];

// ─── 1. FALLBACK COMPONENT (Black Screen while loading) ──────────────────────
function FallbackMaterial({ meshName }) {
    const { scene } = useThree();

    useEffect(() => {
        const mesh = scene.getObjectByName(meshName);
        if (mesh) {
            mesh.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        }
    }, [scene, meshName]);

    return null;
}

// ─── 2. VIDEO MATERIAL COMPONENT (The actual video) ──────────────────────────
function VideoMaterial({ config }) {
    const { scene } = useThree();
    const mesh = scene.getObjectByName(config.id);

    // Load texture with Suspense support
    const texture = useVideoTexture(config.file, {
        muted: true,
        loop: true,
        start: true,
        playsInline: true,
        crossOrigin: "Anonymous",
    });

    useEffect(() => {
        if (!mesh) return;

        // Configure Texture
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        if (config.rotation) {
            texture.center.set(0.5, 0.5);
            texture.rotation = config.rotation;
        }

        // Aspect Ratio Correction (World Scale based)
        mesh.geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        mesh.geometry.boundingBox.getSize(size);

        const worldScale = new THREE.Vector3();
        mesh.getWorldScale(worldScale);

        // Calculate visual dimensions
        const scaledWidth = size.x * worldScale.x;
        const scaledHeight = size.y * worldScale.y;
        const scaledDepth = size.z * worldScale.z;

        // Determine width/height based on rotation
        // For rotated screens (like TV_Screen_2), dimensions might be swapped in local space
        // But we use the largest two dimensions to determine the plane size
        const dims = [scaledWidth, scaledHeight, scaledDepth].sort((a, b) => b - a);
        const width = dims[0];
        const height = dims[1];

        if (height > 0.01) {
            const meshAspect = width / height;
            const videoAspect = 16 / 9;

            // Reset repeat/offset first
            texture.repeat.set(1, 1);
            texture.offset.set(0, 0);

            // Manual Override
            if (config.scaleX || config.scaleY) {
                texture.repeat.set(config.scaleX || 1, config.scaleY || 1);
            }
            // Automatic Cover Logic
            else if (Math.abs(meshAspect - videoAspect) > 0.1) {
                const ratio = meshAspect / videoAspect;
                if (ratio > 1) {
                    // Mesh is wider than video -> Crop top/bottom
                    texture.repeat.set(1, 1 / ratio);
                    texture.offset.set(0, (1 - texture.repeat.y) / 2);
                } else {
                    // Mesh is taller than video -> Crop sides
                    texture.repeat.set(ratio, 1);
                    texture.offset.set((1 - texture.repeat.x) / 2, 0);
                }
            }
        }

        // Create Material
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            toneMapped: false,
            color: new THREE.Color(config.intensity, config.intensity, config.intensity),
        });

        const originalMaterial = mesh.material;
        mesh.material = material;

        return () => {
            mesh.material = originalMaterial;
            material.dispose();
            // Texture is managed by drei, usually cached, but we can let it be
        };
    }, [mesh, texture, config]);

    return null;
}

// ─── 3. MAIN SYSTEM COMPONENT ────────────────────────────────────────────────
export function ScreenSystem() {
    // Global interaction listener for browser autoplay policies
    useEffect(() => {
        const unlockAudio = () => {
            const videos = document.querySelectorAll("video");
            videos.forEach(v => {
                if (v.paused) v.play().catch(() => { });
            });
        };

        window.addEventListener("pointerdown", unlockAudio);
        window.addEventListener("keydown", unlockAudio);

        return () => {
            window.removeEventListener("pointerdown", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
        };
    }, []);

    return (
        <>
            {SCREEN_CONFIG.map((config) => (
                <Suspense key={config.id} fallback={<FallbackMaterial meshName={config.id} />}>
                    <VideoMaterial config={config} />
                </Suspense>
            ))}
        </>
    );
}