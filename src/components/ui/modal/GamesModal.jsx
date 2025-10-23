// ═══════════════════════════════════════════════════════════════════════════════
// GAMES MODAL - Game portfolio and itch.io showcase
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";

export function GamesModal() {
  const [hoveredGame, setHoveredGame] = useState(null);

  const games = [
    {
      id: "neural-nexus",
      title: "Neural Nexus",
      description:
        "A cyberpunk puzzle game exploring AI consciousness and digital reality.",
      platform: "itch.io",
      status: "Released",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
      url: "https://burakdarende.itch.io/neural-nexus",
      tags: ["Puzzle", "Cyberpunk", "Indie"],
      color: "#00d4ff",
    },
    {
      id: "mesh-worlds",
      title: "Mesh Worlds",
      description: "3D exploration game built with WebMeshCore3D framework.",
      platform: "Web",
      status: "In Development",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1614732414444-096ad5f37269?w=400&h=200&fit=crop",
      url: "#",
      tags: ["3D", "Exploration", "Web"],
      color: "#8b5cf6",
    },
    {
      id: "pixel-symphony",
      title: "Pixel Symphony",
      description: "Musical rhythm game with procedurally generated levels.",
      platform: "itch.io",
      status: "Released",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      url: "https://burakdarende.itch.io/pixel-symphony",
      tags: ["Music", "Rhythm", "Pixel Art"],
      color: "#f59e0b",
    },
    {
      id: "code-runner",
      title: "Code Runner",
      description:
        "Educational programming game for learning JavaScript fundamentals.",
      platform: "GitHub Pages",
      status: "Released",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=200&fit=crop",
      url: "https://burakdarende.github.io/code-runner",
      tags: ["Educational", "Programming", "Web"],
      color: "#10b981",
    },
  ];

  const platforms = [
    {
      name: "itch.io",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.13 1.338C2.08 1.96 1.307 3.263 1.307 4.82v.85c0 1.85 1.75 3.35 3.9 3.35.35 0 .65-.05.95-.15.25.1.55.15.9.15 1.7 0 3.1-1.25 3.4-2.9.3 1.65 1.7 2.9 3.4 2.9.35 0 .65-.05.9-.15.3.1.6.15.95.15 2.15 0 3.9-1.5 3.9-3.35v-.85c0-1.557-.773-2.86-1.82-3.482C18.13.338 16.78 0 15.1 0H8.9c-1.68 0-3.03.338-3.77 1.338zM2.83 7.15v2.4c0 1.15.9 2.1 2 2.1s2-.95 2-2.1V7.15a5.25 5.25 0 01-4 0zm6.5 0v2.4c0 1.15.9 2.1 2 2.1s2-.95 2-2.1V7.15c-.65.3-1.35.5-2 .5s-1.35-.2-2-.5zm6.5 0a5.25 5.25 0 01-4 0v2.4c0 1.15.9 2.1 2 2.1s2-.95 2-2.1V7.15z" />
        </svg>
      ),
      url: "https://burakdarende.itch.io",
      color: "#fa5c5c",
    },
    {
      name: "GitHub",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      url: "https://github.com/burakdarende",
      color: "#333",
    },
  ];

  const handleGameClick = (game) => {
    if (game.url === "#") {
      alert(`${game.title} is still in development! Stay tuned for updates.`);
      return;
    }
    window.open(game.url, "_blank", "noopener,noreferrer");
  };

  const getPlatformIcon = (platformName) => {
    const platform = platforms.find(
      (p) => p.name.toLowerCase() === platformName.toLowerCase()
    );
    return platform ? platform.icon : "🎮";
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
        minHeight: "500px",
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
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎮</div>
        <h2
          style={{
            margin: "0 0 8px",
            color: "#f8fafc",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Game Portfolio
        </h2>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "1rem" }}>
          Interactive experiences and game development projects
        </p>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        {/* Platform Links */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                background: `rgba(${
                  platform.color === "#333" ? "51, 51, 51" : "250, 92, 92"
                }, 0.1)`,
                borderRadius: "12px",
                textDecoration: "none",
                color: platform.color === "#333" ? "#94a3b8" : platform.color,
                border: `2px solid rgba(${
                  platform.color === "#333" ? "148, 163, 184" : "250, 92, 92"
                }, 0.3)`,
                transition: "all 0.2s ease",
                fontWeight: "500",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `rgba(${
                  platform.color === "#333" ? "148, 163, 184" : "250, 92, 92"
                }, 0.2)`;
                e.currentTarget.style.borderColor = `rgba(${
                  platform.color === "#333" ? "148, 163, 184" : "250, 92, 92"
                }, 0.5)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = `rgba(${
                  platform.color === "#333" ? "51, 51, 51" : "250, 92, 92"
                }, 0.1)`;
                e.currentTarget.style.borderColor = `rgba(${
                  platform.color === "#333" ? "148, 163, 184" : "250, 92, 92"
                }, 0.3)`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {platform.icon}
              <span>Visit my {platform.name}</span>
            </a>
          ))}
        </div>

        {/* Games Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: game.url !== "#" ? "pointer" : "default",
                transition: "all 0.3s ease",
                border: `2px solid ${
                  hoveredGame === game.id
                    ? game.color
                    : "rgba(71, 85, 105, 0.3)"
                }`,
                transform:
                  hoveredGame === game.id
                    ? "translateY(-4px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredGame === game.id
                    ? `0 8px 32px rgba(${game.color
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => parseInt(x, 16))
                        .join(", ")}, 0.3)`
                    : "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Game Image */}
              <div
                style={{
                  height: "150px",
                  backgroundImage: `url(${game.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background:
                      game.status === "Released"
                        ? "rgba(16, 185, 129, 0.9)"
                        : "rgba(245, 158, 11, 0.9)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {game.status}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {getPlatformIcon(game.platform)}
                  {game.platform}
                </div>
              </div>

              {/* Game Info */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: game.color,
                      fontSize: "1.2rem",
                      fontWeight: "600",
                    }}
                  >
                    {game.title}
                  </h3>
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    {game.year}
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
                  {game.description}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: `rgba(${game.color
                          .replace("#", "")
                          .match(/.{2}/g)
                          .map((x) => parseInt(x, 16))
                          .join(", ")}, 0.2)`,
                        color: game.color,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: `1px solid rgba(${game.color
                          .replace("#", "")
                          .match(/.{2}/g)
                          .map((x) => parseInt(x, 16))
                          .join(", ")}, 0.3)`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Play/View Button */}
                <div style={{ marginTop: "16px" }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${game.color} 0%, ${game.color}CC 100%)`,
                      color: "white",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {game.status === "Released"
                      ? game.url !== "#"
                        ? "🎮 Play Game"
                        : "🚧 Coming Soon"
                      : "🔨 In Development"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            background: "rgba(71, 85, 105, 0.3)",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            textAlign: "center",
          }}
        >
          <h4
            style={{ margin: "0 0 12px", color: "#f1f5f9", fontSize: "1.1rem" }}
          >
            🚀 More Games Coming Soon!
          </h4>
          <p
            style={{
              margin: "0 0 16px",
              color: "#94a3b8",
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
          >
            I'm constantly working on new interactive experiences. Follow my
            profiles to stay updated on latest releases and development
            progress.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              🎯 Currently developing 3 new games
            </span>
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              📅 Next release: Q1 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesModal;
