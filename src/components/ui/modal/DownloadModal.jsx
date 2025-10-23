// ═══════════════════════════════════════════════════════════════════════════════
// DOWNLOAD MODAL - Scripts, addons, and digital assets download hub
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";

export function DownloadModal() {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const platforms = [
    {
      name: "GitHub",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      url: "https://github.com/burakdarende",
      color: "#333",
      description: "Open source tools & scripts",
      stats: "25+ repositories",
    },
    {
      name: "Gumroad",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm7.5 9.5c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm-15 7c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9-7c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
        </svg>
      ),
      url: "https://gumroad.com/burakdarende",
      color: "#FF90E8",
      description: "Premium assets & templates",
      stats: "10+ products",
    },
    {
      name: "AEScripts",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
        </svg>
      ),
      url: "https://aescripts.com/author/burakdarende",
      color: "#FF6B6B",
      description: "After Effects scripts & plugins",
      stats: "5+ scripts",
    },
    {
      name: "SuperHive",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      url: "https://superhive.com/burakdarende",
      color: "#4ECDC4",
      description: "3D assets & addons",
      stats: "8+ assets",
    },
  ];

  const categories = [
    { id: "all", label: "All Downloads", icon: "📦" },
    { id: "blender", label: "Blender", icon: "🔷" },
    { id: "aftereffects", label: "After Effects", icon: "🎬" },
    { id: "threejs", label: "Three.js", icon: "⚡" },
    { id: "web", label: "Web Tools", icon: "🌐" },
    { id: "templates", label: "Templates", icon: "📋" },
  ];

  const downloads = [
    {
      id: "mesh-optimizer",
      title: "Mesh Optimizer Pro",
      category: "blender",
      type: "Blender Addon",
      version: "2.1.0",
      price: "Free",
      downloads: "1.2K",
      rating: 4.8,
      platforms: ["GitHub", "Gumroad"],
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
      description:
        "Advanced mesh optimization tools for Blender with LOD generation and UV unwrapping.",
      features: [
        "Auto LOD",
        "UV Unwrap",
        "Batch Processing",
        "Material Baking",
      ],
    },
    {
      id: "ae-particle-system",
      title: "Particle System Ultimate",
      category: "aftereffects",
      type: "AE Script",
      version: "1.5.2",
      price: "$29",
      downloads: "892",
      rating: 4.9,
      platforms: ["AEScripts", "Gumroad"],
      image:
        "https://images.unsplash.com/photo-1586281380614-84c86916d8aa?w=300&h=200&fit=crop",
      description:
        "Professional particle system with physics simulation and GPU acceleration.",
      features: [
        "GPU Rendering",
        "Physics Sim",
        "Presets Library",
        "Real-time Preview",
      ],
    },
    {
      id: "threejs-environment",
      title: "Environment Pack Pro",
      category: "threejs",
      type: "Three.js Asset",
      version: "3.0.1",
      price: "$19",
      downloads: "654",
      rating: 4.7,
      platforms: ["GitHub", "SuperHive"],
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      description:
        "High-quality environment assets optimized for Three.js with PBR materials.",
      features: [
        "PBR Materials",
        "HDR Lighting",
        "Optimized Meshes",
        "Easy Integration",
      ],
    },
    {
      id: "web-animation-kit",
      title: "Web Animation Toolkit",
      category: "web",
      type: "JavaScript Library",
      version: "4.2.0",
      price: "Free",
      downloads: "2.3K",
      rating: 4.6,
      platforms: ["GitHub"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      description:
        "Lightweight animation library with GPU acceleration and timeline controls.",
      features: [
        "GPU Acceleration",
        "Timeline API",
        "CSS Integration",
        "TypeScript Support",
      ],
    },
    {
      id: "portfolio-template",
      title: "Creative Portfolio Template",
      category: "templates",
      type: "React Template",
      version: "2.0.0",
      price: "$45",
      downloads: "445",
      rating: 4.9,
      platforms: ["Gumroad", "GitHub"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      description:
        "Modern portfolio template with 3D elements and smooth animations.",
      features: [
        "Responsive Design",
        "3D Elements",
        "Dark Mode",
        "CMS Integration",
      ],
    },
    {
      id: "blender-materials",
      title: "PBR Material Library",
      category: "blender",
      type: "Blender Asset",
      version: "1.3.0",
      price: "$24",
      downloads: "756",
      rating: 4.8,
      platforms: ["SuperHive", "Gumroad"],
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      description:
        "Professional PBR material collection with 100+ textures and shaders.",
      features: [
        "100+ Materials",
        "4K Textures",
        "Procedural Shaders",
        "Easy Import",
      ],
    },
  ];

  const filteredDownloads =
    selectedCategory === "all"
      ? downloads
      : downloads.filter((download) => download.category === selectedCategory);

  const handlePlatformClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadClick = (download) => {
    // Find the first available platform and redirect
    const availablePlatform = platforms.find((platform) =>
      download.platforms.includes(platform.name)
    );
    if (availablePlatform) {
      window.open(availablePlatform.url, "_blank", "noopener,noreferrer");
    }
  };

  const getPlatformIcon = (platformName) => {
    const platform = platforms.find((p) => p.name === platformName);
    return platform ? platform.icon : null;
  };

  const getPlatformColor = (platformName) => {
    const platform = platforms.find((p) => p.name === platformName);
    return platform ? platform.color : "#64748b";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{ color: "#FFC107" }}>
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: "#FFC107" }}>
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: "#64748b" }}>
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div
      style={{
        padding: "0",
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(20px) saturate(150%)",
        WebkitBackdropFilter: "blur(20px) saturate(150%)",
        color: "#f8fafc",
        borderRadius: "12px",
        minHeight: "600px",
        border: "1px solid rgba(148, 163, 184, 0.15)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "32px",
          background: "rgba(148, 163, 184, 0.08)",
          padding: "32px 24px",
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
        <h2
          style={{
            margin: "0 0 8px",
            color: "#f8fafc",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Downloads & Assets
        </h2>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "1rem" }}>
          Scripts, addons, templates and digital assets across multiple
          platforms
        </p>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        {/* Platform Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {platforms.map((platform) => (
            <div
              key={platform.name}
              onClick={() => handlePlatformClick(platform.url)}
              onMouseEnter={() => setHoveredPlatform(platform.name)}
              onMouseLeave={() => setHoveredPlatform(null)}
              style={{
                background:
                  hoveredPlatform === platform.name
                    ? `rgba(${platform.color
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => parseInt(x, 16))
                        .join(", ")}, 0.15)`
                    : "rgba(30, 41, 59, 0.6)",
                backdropFilter:
                  hoveredPlatform === platform.name
                    ? "blur(16px)"
                    : "blur(12px)",
                WebkitBackdropFilter:
                  hoveredPlatform === platform.name
                    ? "blur(16px)"
                    : "blur(12px)",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `1px solid ${
                  hoveredPlatform === platform.name
                    ? `rgba(${platform.color
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => parseInt(x, 16))
                        .join(", ")}, 0.4)`
                    : "rgba(71, 85, 105, 0.3)"
                }`,
                transform:
                  hoveredPlatform === platform.name
                    ? "translateY(-2px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredPlatform === platform.name
                    ? `0 8px 24px rgba(${platform.color
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => parseInt(x, 16))
                        .join(", ")}, 0.2)`
                    : "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                  color: platform.color,
                }}
              >
                {platform.icon}
                <h3
                  style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}
                >
                  {platform.name}
                </h3>
              </div>

              <p
                style={{
                  margin: "0 0 12px",
                  color: "#cbd5e1",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                }}
              >
                {platform.description}
              </p>

              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  padding: "8px 12px",
                  background: "rgba(71, 85, 105, 0.3)",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                {platform.stats}
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background:
                  selectedCategory === category.id
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(71, 85, 105, 0.2)",
                backdropFilter:
                  selectedCategory === category.id ? "blur(12px)" : "blur(8px)",
                WebkitBackdropFilter:
                  selectedCategory === category.id ? "blur(12px)" : "blur(8px)",
                borderRadius: "8px",
                border:
                  selectedCategory === category.id
                    ? "1px solid rgba(34, 197, 94, 0.4)"
                    : "1px solid rgba(71, 85, 105, 0.3)",
                color: selectedCategory === category.id ? "#4ade80" : "#cbd5e1",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "0.9rem",
                fontWeight: "500",
                boxShadow:
                  selectedCategory === category.id
                    ? "0 4px 12px rgba(34, 197, 94, 0.1)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = "rgba(71, 85, 105, 0.3)";
                  e.target.style.borderColor = "rgba(71, 85, 105, 0.4)";
                  e.target.style.backdropFilter = "blur(10px)";
                  e.target.style.WebkitBackdropFilter = "blur(10px)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = "rgba(71, 85, 105, 0.2)";
                  e.target.style.borderColor = "rgba(71, 85, 105, 0.3)";
                  e.target.style.backdropFilter = "blur(8px)";
                  e.target.style.WebkitBackdropFilter = "blur(8px)";
                }
              }}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Downloads Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {filteredDownloads.map((download) => (
            <div
              key={download.id}
              onClick={() => handleDownloadClick(download)}
              style={{
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid rgba(71, 85, 105, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(34, 197, 94, 0.4)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(34, 197, 94, 0.15)";
                e.currentTarget.style.backdropFilter = "blur(16px)";
                e.currentTarget.style.WebkitBackdropFilter = "blur(16px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(71, 85, 105, 0.3)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.backdropFilter = "blur(12px)";
                e.currentTarget.style.WebkitBackdropFilter = "blur(12px)";
              }}
            >
              {/* Preview Image */}
              <div
                style={{
                  height: "160px",
                  backgroundImage: `url(${download.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background:
                      download.price === "Free"
                        ? "rgba(34, 197, 94, 0.9)"
                        : "rgba(59, 130, 246, 0.9)",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  {download.price}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  v{download.version}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#f1f5f9",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    {download.title}
                  </h3>
                  <span
                    style={{
                      background: "rgba(71, 85, 105, 0.5)",
                      color: "#e2e8f0",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      marginLeft: "8px",
                    }}
                  >
                    {download.type}
                  </span>
                </div>

                <p
                  style={{
                    margin: "0 0 16px",
                    color: "#cbd5e1",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  {download.description}
                </p>

                {/* Features */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  {download.features.map((feature) => (
                    <span
                      key={feature}
                      style={{
                        background: "rgba(34, 197, 94, 0.2)",
                        color: "#4ade80",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "500",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "0.8rem",
                      color: "#94a3b8",
                    }}
                  >
                    <span>📥 {download.downloads}</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {renderStars(download.rating)}
                      <span>({download.rating})</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {download.platforms.map((platformName) => (
                      <div
                        key={platformName}
                        style={{
                          width: "20px",
                          height: "20px",
                          color: getPlatformColor(platformName),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={platformName}
                      >
                        {getPlatformIcon(platformName)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <div
                  style={{
                    background: "rgba(34, 197, 94, 0.2)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#4ade80",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
                  }}
                >
                  {download.price === "Free"
                    ? "📥 Download Free"
                    : `💳 Buy for ${download.price}`}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div
          style={{
            padding: "24px",
            background: "rgba(71, 85, 105, 0.2)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4
            style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: "1.2rem" }}
          >
            📊 Developer Stats
          </h4>
          <p
            style={{
              margin: "0 0 20px",
              color: "#94a3b8",
              fontSize: "1rem",
              lineHeight: "1.6",
            }}
          >
            Creating tools and assets to help developers build amazing
            experiences. All products are actively maintained and regularly
            updated.
          </p>
          <div
            style={{
              display: "flex",
              gap: "24px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#4ade80",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                25+
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Open Source
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#4ade80",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                15+
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Premium Assets
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#4ade80",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                5K+
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Total Downloads
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#4ade80",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                4.8★
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Avg Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadModal;
