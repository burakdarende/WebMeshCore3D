// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITOR (GL-BENCH)
// ═══════════════════════════════════════════════════════════════════════════════
// Entegre GL-Bench performans monitörü

import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
// Import the packaged build that exposes the GLBench class directly
import GLBench from "gl-bench/dist/gl-bench";

import { DEVELOPER_CONFIG } from "../../config/app-config";

export function PerformanceMonitor() {
  // Debug mod kapalıysa bu component hiçbir şey yapmaz
  if (!DEVELOPER_CONFIG.ENABLE_DEBUG_MODE) {
    return null;
  }

  const { gl } = useThree();
  const benchRef = useRef(null);

  // GLBench'i bir kez başlat
  useEffect(() => {
    if (gl && !benchRef.current) {
      console.log("🚀 Initializing GL-Bench Performance Monitor...");

      // ✅ Bench'i oluştur
      const bench = new GLBench(gl);

      // ✅ Referansa ata
      benchRef.current = bench;

      // ✅ DOM stilleri
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
    }

    return () => {
      if (benchRef.current && benchRef.current.dom) {
        console.log("♻️ Disposing GL-Bench Performance Monitor...");
        if (document.body.contains(benchRef.current.dom)) {
          document.body.removeChild(benchRef.current.dom);
        }
        benchRef.current = undefined;
      }
    };
  }, [gl]);

  // --- HATA DÜZELTME: 's' harfi kaldırıldı ---
  // Render döngüsünün en başına kanca at
  useFrame(() => {
    if (benchRef.current) {
      benchRef.current.begin();
    }
  }, -Infinity); // En düşük öncelik (en önce çalışır)

  // Render döngüsünün en sonuna kanca at
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
  }, Infinity); // En yüksek öncelik (en son çalışır)

  return null; // Bu component React DOM'u render etmez
}
