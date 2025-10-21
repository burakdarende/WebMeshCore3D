// ═══════════════════════════════════════════════════════════════════════════════
// COLLIDER DATA LOADER
// ═══════════════════════════════════════════════════════════════════════════════
// Loads collider configuration from JSON file

import { useState, useEffect } from "react";

export const useColliderData = () => {
  const [colliders, setColliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadColliders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/collider.json");

        if (!response.ok) {
          throw new Error(`Failed to load colliders: ${response.status}`);
        }

        const collidersData = await response.json();
        setColliders(Array.isArray(collidersData) ? collidersData : []);
        setError(null);
      } catch (err) {
        console.error("Error loading collider data:", err);
        setError(err.message);
        // Fallback to empty array
        setColliders([]);
      } finally {
        setLoading(false);
      }
    };

    loadColliders();
  }, []);

  return { colliders, loading, error, setColliders };
};
