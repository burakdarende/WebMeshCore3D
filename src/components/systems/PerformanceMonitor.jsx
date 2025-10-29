// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITOR (GL-BENCH)
// ═══════════════════════════════════════════════════════════════════════════════
// Integrated GL-Bench performance monitor

import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
// Import the packaged build that exposes the GLBench class directly
import GLBench from "gl-bench/dist/gl-bench";

import { DEVELOPER_CONFIG } from "../../config/app-config";

export function PerformanceMonitor() {
  // If debug mode is disabled, this component does nothing
  if (!DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) {
    return null;
  }

  const { gl, scene } = useThree();
  const benchRef = useRef(null);

  // Initialize GLBench once
  const breakdownRef = useRef(null);
  useEffect(() => {
    if (gl && !benchRef.current) {
      console.log("🚀 Initializing GL-Bench Performance Monitor...");

      // ✅ Create the bench instance
      const bench = new GLBench(gl);

      // ✅ Assign to ref
      benchRef.current = bench;

      // ✅ DOM styling
      if (bench.dom) {
        bench.dom.style.position = "fixed";
        bench.dom.style.top = "10px";
        bench.dom.style.left = "50%";
        bench.dom.style.transform = "translateX(-50%)";
        bench.dom.style.zIndex = "9999";
        bench.dom.style.background = "rgba(0,0,0,0.7)";
        bench.dom.style.backdropFilter = "blur(5px)";
        bench.dom.style.border = "1px solid rgba(255,255,255,0.2)";
      }
      // Create a small memory/renderer breakdown overlay under the bench
      const breakdown = document.createElement("div");
      breakdown.id = "perf-breakdown";
      breakdown.style.position = "fixed";
      breakdown.style.top = "70px"; // below the bench
      breakdown.style.left = "50%";
      breakdown.style.transform = "translateX(-50%)";
      breakdown.style.zIndex = "9999";
      breakdown.style.padding = "6px 10px";
      breakdown.style.background = "rgba(0,0,0,0.6)";
      breakdown.style.color = "#fff";
      breakdown.style.fontFamily = "Arial, sans-serif";
      breakdown.style.fontSize = "12px";
      breakdown.style.borderRadius = "6px";
      breakdown.style.pointerEvents = "none";
      breakdown.innerText = "perf: initializing...";
      document.body.appendChild(breakdown);
      breakdownRef.current = breakdown;
    }

    return () => {
      if (benchRef.current && benchRef.current.dom) {
        console.log("♻️ Disposing GL-Bench Performance Monitor...");
        if (document.body.contains(benchRef.current.dom)) {
          document.body.removeChild(benchRef.current.dom);
        }
        benchRef.current = undefined;
      }
      if (
        breakdownRef.current &&
        document.body.contains(breakdownRef.current)
      ) {
        document.body.removeChild(breakdownRef.current);
        breakdownRef.current = null;
      }
    };
  }, [gl]);

  // Hook at the start of the render loop
  useFrame(() => {
    if (benchRef.current) {
      benchRef.current.begin();
    }
  }, -Infinity); // lowest priority (runs first)

  // Hook at the end of the render loop
  useFrame(() => {
    if (benchRef.current) {
      try {
        benchRef.current.end();
        // GL-Bench requires nextFrame to be called with a timestamp to update stats
        if (typeof benchRef.current.nextFrame === "function") {
          benchRef.current.nextFrame(performance.now());
        }
      } catch (e) {
        console.warn("GL-Bench end/nextFrame error:", e);
      }
    }
  }, Infinity); // highest priority (runs last)

  // Hook to update breakdown overlay periodically
  usePerfBreakdownUpdater(breakdownRef, scene, gl);

  return null; // This component does not render React DOM
}

// Helper: approximate scene memory usage (textures + geometry) in bytes
function estimateSceneMemory(scene) {
  let texCount = 0,
    texBytes = 0,
    geomCount = 0,
    geomBytes = 0;

  if (!scene)
    return { texCount: 0, texMB: 0, geomCount: 0, geomMB: 0, totalMB: 0 };

  scene.traverse((obj) => {
    if (!obj.isMesh) return;
    const mat = obj.material;
    if (mat) {
      const textures = [];
      for (const k in mat) {
        const v = mat[k];
        if (v && v.isTexture) textures.push(v);
      }
      textures.forEach((tex) => {
        texCount++;
        const w = (tex.image && tex.image.width) || 0;
        const h = (tex.image && tex.image.height) || 0;
        const levels = tex.generateMipmaps ? 1.33 : 1; // crude estimate
        texBytes += w * h * 4 * levels;
      });
    }
    if (obj.geometry) {
      geomCount++;
      const g = obj.geometry;
      const pos = g.attributes && g.attributes.position;
      if (pos) geomBytes += pos.count * (pos.itemSize || 3) * 4;
      if (g.index) geomBytes += g.index.count * 4;
    }
  });

  const toMB = (b) => +(b / 1024 / 1024).toFixed(2);
  return {
    texCount,
    texMB: toMB(texBytes),
    geomCount,
    geomMB: toMB(geomBytes),
    totalMB: toMB(texBytes + geomBytes),
  };
}

// Update breakdown overlay periodically
function usePerfBreakdownUpdater(breakdownRef, scene, gl) {
  useEffect(() => {
    if (!breakdownRef?.current || !scene || !gl) return;
    let mounted = true;
    const el = breakdownRef.current;
    const update = () => {
      try {
        const est = estimateSceneMemory(scene);
        const rendererInfo =
          gl && gl.info && gl.info.memory ? gl.info.memory : null;
        const perfMem =
          typeof performance !== "undefined" && performance.memory
            ? performance.memory.usedJSHeapSize / 1024 / 1024
            : null;
        el.innerText =
          `tex:${est.texCount} ${est.texMB}MB geom:${est.geomCount} ${est.geomMB}MB total:${est.totalMB}MB` +
          (rendererInfo
            ? ` | texRT:${rendererInfo.textures} geoms:${rendererInfo.geometries}`
            : "") +
          (perfMem ? ` | jsHeap:${perfMem.toFixed(1)}MB` : "");
      } catch (e) {
        // ignore
      }
    };
    update();
    const id = setInterval(() => {
      if (!mounted) return;
      update();
    }, 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [breakdownRef, scene, gl]);
}
