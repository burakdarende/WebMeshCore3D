// ═══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO MODAL - ArtStation and professional work showcase
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";

export function PortfolioModal() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const platforms = [
    {
      name: "ArtStation",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.24l1.92-3.33c.378-.65.482-1.102.482-1.162zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
        </svg>
      ),
      url: "https://www.artstation.com/burakdarende",
      color: "#13aff0",
      description: "3D Art & Visual Development",
    },
    {
      name: "Behance",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.125 1.074.32 1.49.576.394.257.77.65.77 1.111 0 .896-.574 1.68-1.727 2.035v.052c1.611.318 2.606 1.48 2.606 3.22 0 .912-.262 1.697-.787 2.354-.525.657-1.163 1.104-1.916 1.343-.75.24-1.574.359-2.47.359H0V4.503h6.938zM3.495 6.938v3.117h2.938c.58 0 1.09-.156 1.53-.469.442-.313.663-.814.663-1.503 0-.71-.224-1.242-.67-1.597-.448-.355-.954-.532-1.518-.532H3.495v-.016zm0 5.547v3.784h3.375c.676 0 1.278-.172 1.805-.516.528-.344.792-.965.792-1.864 0-.866-.264-1.464-.792-1.794-.528-.33-1.129-.494-1.805-.494H3.495v-.116zM15.603 10.56c.787 0 1.432.125 1.93.375.5.25.892.615 1.177 1.094.285.48.436 1.033.436 1.66v.75H15.97c.09.82.45 1.467 1.08 1.94.63.474 1.47.71 2.52.71.87 0 1.64-.18 2.31-.54.67-.36 1.05-.96 1.14-1.8h2.16c-.39 1.37-1.14 2.43-2.25 3.18-1.11.75-2.49 1.13-4.14 1.13-1.3 0-2.43-.23-3.39-.69-.96-.46-1.68-1.14-2.16-2.04-.48-.9-.72-1.98-.72-3.24 0-1.26.24-2.34.72-3.24.48-.9 1.2-1.58 2.16-2.04.96-.46 2.09-.69 3.39-.69zm2.7 3.12c-.15-.66-.45-1.17-.9-1.53-.45-.36-1.02-.54-1.71-.54-.63 0-1.17.18-1.62.54-.45.36-.75.87-.9 1.53h5.13z" />
        </svg>
      ),
      url: "https://www.behance.net/burakdarende",
      color: "#1769ff",
      description: "Design & Creative Projects",
    },
    {
      name: "Dribbble",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.568 5.302c1.4 1.5 2.252 3.5 2.357 5.698-2.508-.054-4.951-.302-7.313-.302-.054-.126-.108-.252-.162-.378 2.347-1.017 4.261-2.138 5.118-5.018zm-13.818 3.08c1.331-.83 3.221-1.528 5.227-1.838.324 1.052.54 2.138.702 3.234-2.469.378-4.856 1.053-6.88 1.989-.324-1.332-.378-2.694-.049-3.385zm7.568 1.35c0-.054.054-.108.054-.162 2.212-.054 4.424.054 6.583.27-.378 2.138-1.404 4.046-2.834 5.554-1.35-2.138-2.4-3.659-3.803-5.662zm-1.35 1.998c1.35 1.944 2.4 3.438 3.695 5.391-1.386.486-2.88.756-4.437.756-1.08 0-2.106-.162-3.08-.432.378-2.347 1.998-4.262 3.822-5.715zm-5.391 7.082c1.134.54 2.4.864 3.767.864 1.566 0 3.024-.324 4.275-.864-.432-.648-.864-1.296-1.35-1.89-1.728 1.35-3.695 1.89-5.692 1.89zm9.818-1.998c1.35-1.35 2.268-3.024 2.592-4.914.432.054.864.162 1.296.27-.27 1.782-1.08 3.402-2.268 4.644-.54 0-1.08 0-1.62 0z" />
        </svg>
      ),
      url: "https://dribbble.com/burakdarende",
      color: "#ea4c89",
      description: "UI/UX Design Shots",
    },
  ];

  const categories = [
    { id: "all", label: "All Work", icon: "🎨" },
    { id: "3d", label: "3D Art", icon: "🎭" },
    { id: "ui", label: "UI/UX", icon: "💻" },
    { id: "motion", label: "Motion Graphics", icon: "🎬" },
    { id: "branding", label: "Branding", icon: "✨" },
  ];

  const projects = [
    {
      id: "cyberpunk-city",
      title: "Cyberpunk Metropolis",
      category: "3d",
      description:
        "Futuristic city environment with advanced lighting and atmospheric effects.",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      platform: "ArtStation",
      views: "15.2K",
      likes: "892",
      year: "2024",
      software: ["Blender", "Substance Painter", "Photoshop"],
    },
    {
      id: "app-redesign",
      title: "Banking App Redesign",
      category: "ui",
      description: "Complete UX/UI overhaul for a modern banking application.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      platform: "Behance",
      views: "8.7K",
      likes: "456",
      year: "2024",
      software: ["Figma", "Principle", "After Effects"],
    },
    {
      id: "logo-animation",
      title: "Brand Logo Animation",
      category: "motion",
      description:
        "Dynamic logo reveal with particle effects and smooth transitions.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      platform: "Dribbble",
      views: "12.1K",
      likes: "678",
      year: "2023",
      software: ["After Effects", "Cinema 4D", "Illustrator"],
    },
    {
      id: "tech-startup-brand",
      title: "Tech Startup Branding",
      category: "branding",
      description:
        "Complete brand identity for an AI-focused technology startup.",
      image:
        "https://images.unsplash.com/photo-1558655146-364adaf734b8?w=400&h=300&fit=crop",
      platform: "Behance",
      views: "6.8K",
      likes: "324",
      year: "2023",
      software: ["Illustrator", "Photoshop", "InDesign"],
    },
    {
      id: "character-modeling",
      title: "Sci-Fi Character Design",
      category: "3d",
      description:
        "High-detail character model with advanced texturing and rigging.",
      image:
        "https://images.unsplash.com/photo-1614732414444-096ad5f37269?w=400&h=300&fit=crop",
      platform: "ArtStation",
      views: "22.5K",
      likes: "1.2K",
      year: "2023",
      software: ["ZBrush", "Maya", "Substance Painter"],
    },
    {
      id: "dashboard-ui",
      title: "Analytics Dashboard",
      category: "ui",
      description:
        "Clean and intuitive dashboard design for data visualization.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      platform: "Dribbble",
      views: "9.3K",
      likes: "567",
      year: "2024",
      software: ["Figma", "Sketch", "Principle"],
    },
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const handleProjectClick = (project) => {
    const platformUrl = platforms.find((p) => p.name === project.platform)?.url;
    if (platformUrl) {
      window.open(`${platformUrl}`, "_blank", "noopener,noreferrer");
    }
  };

  const getPlatformColor = (platformName) => {
    const platform = platforms.find((p) => p.name === platformName);
    return platform ? platform.color : "#64748b";
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
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎨</div>
        <h2
          style={{
            margin: "0 0 8px",
            color: "#f8fafc",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Creative Portfolio
        </h2>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "1rem" }}>
          Professional work across 3D art, design, and visual development
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
                gap: "12px",
                padding: "16px 24px",
                background: `rgba(${platform.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((x) => parseInt(x, 16))
                  .join(", ")}, 0.1)`,
                borderRadius: "12px",
                textDecoration: "none",
                color: platform.color,
                border: `2px solid rgba(${platform.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((x) => parseInt(x, 16))
                  .join(", ")}, 0.3)`,
                transition: "all 0.2s ease",
                fontWeight: "500",
                flexDirection: "column",
                textAlign: "center",
                minWidth: "140px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `rgba(${platform.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((x) => parseInt(x, 16))
                  .join(", ")}, 0.2)`;
                e.currentTarget.style.borderColor = `rgba(${platform.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((x) => parseInt(x, 16))
                  .join(", ")}, 0.5)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = `rgba(${platform.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((x) => parseInt(x, 16))
                  .join(", ")}, 0.1)`;
                e.currentTarget.style.borderColor = `rgba(${platform.color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((x) => parseInt(x, 16))
                  .join(", ")}, 0.3)`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {platform.icon}
              <div>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {platform.name}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  {platform.description}
                </div>
              </div>
            </a>
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
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(71, 85, 105, 0.3)",
                borderRadius: "8px",
                border:
                  selectedCategory === category.id
                    ? "2px solid rgba(59, 130, 246, 0.5)"
                    : "2px solid rgba(71, 85, 105, 0.3)",
                color: selectedCategory === category.id ? "#60a5fa" : "#cbd5e1",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = "rgba(71, 85, 105, 0.4)";
                  e.target.style.borderColor = "rgba(71, 85, 105, 0.5)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = "rgba(71, 85, 105, 0.3)";
                  e.target.style.borderColor = "rgba(71, 85, 105, 0.3)";
                }
              }}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${
                  hoveredProject === project.id
                    ? getPlatformColor(project.platform)
                    : "rgba(71, 85, 105, 0.3)"
                }`,
                transform:
                  hoveredProject === project.id
                    ? "translateY(-4px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredProject === project.id
                    ? `0 12px 32px rgba(${getPlatformColor(project.platform)
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => parseInt(x, 16))
                        .join(", ")}, 0.3)`
                    : "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Project Image */}
              <div
                style={{
                  height: "200px",
                  backgroundImage: `url(${project.image})`,
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
                    background: `${getPlatformColor(project.platform)}`,
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {project.platform}
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
                  {project.year}
                </div>
              </div>

              {/* Project Info */}
              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#f1f5f9",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    margin: "0 0 16px",
                    color: "#cbd5e1",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  {project.description}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "16px",
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                  }}
                >
                  <span>👁️ {project.views}</span>
                  <span>❤️ {project.likes}</span>
                </div>

                {/* Software Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  {project.software.map((software) => (
                    <span
                      key={software}
                      style={{
                        background: "rgba(71, 85, 105, 0.5)",
                        color: "#e2e8f0",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "500",
                      }}
                    >
                      {software}
                    </span>
                  ))}
                </div>

                {/* View Button */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${getPlatformColor(
                      project.platform
                    )} 0%, ${getPlatformColor(project.platform)}CC 100%)`,
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  🔗 View on {project.platform}
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
            🎯 Available for Freelance Projects
          </h4>
          <p
            style={{
              margin: "0 0 16px",
              color: "#94a3b8",
              fontSize: "0.9rem",
              lineHeight: "1.6",
            }}
          >
            I'm always excited to work on challenging creative projects. Let's
            collaborate and bring your ideas to life!
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
              ✨ 50+ completed projects
            </span>
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              🏆 Featured on multiple platforms
            </span>
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              🚀 5+ years experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioModal;
