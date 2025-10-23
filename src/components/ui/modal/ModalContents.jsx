// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE MODAL CONTENTS - Example modal content components
// ═══════════════════════════════════════════════════════════════════════════════

import React from "react";

// About Project Modal
export function AboutModal() {
  return (
    <div className="about-modal">
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px", color: "#1f2937" }}>WebMeshCore3D</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
          Professional 3D Scene Framework v1.0
        </p>
      </div>

      <div style={{ lineHeight: "1.6", color: "#374151" }}>
        <p>
          <strong>WebMeshCore3D</strong> is an enterprise-grade 3D scene
          framework designed for production environments. Built with a modular
          architecture optimized for scalable web applications.
        </p>

        <h3 style={{ margin: "24px 0 12px", color: "#1f2937" }}>
          Key Features:
        </h3>
        <ul style={{ paddingLeft: "20px", margin: "0 0 24px" }}>
          <li>🎯 Modular Collision System</li>
          <li>🎨 Enterprise Bloom & Post-Processing</li>
          <li>📷 Professional Camera System</li>
          <li>⚡ Performance-First Architecture</li>
          <li>🎛️ Centralized Configuration</li>
        </ul>

        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <strong>Developer:</strong> Burak Darende
            <br />
            <strong>Website:</strong> burakdarende.com
            <br />
            <strong>License:</strong> MIT License
          </p>
        </div>
      </div>
    </div>
  );
}

// Contact Modal
export function ContactModal() {
  return (
    <div className="contact-modal">
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
        <h2 style={{ margin: "0 0 8px", color: "#1f2937" }}>Get in Touch</h2>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Have questions or want to collaborate?
        </p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        <a
          href="mailto:hello@burakdarende.com"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            background: "rgba(16, 185, 129, 0.1)",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#047857",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(16, 185, 129, 0.15)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(16, 185, 129, 0.1)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <span style={{ fontSize: "20px" }}>✉️</span>
          <div>
            <div style={{ fontWeight: "500" }}>Email</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              hello@burakdarende.com
            </div>
          </div>
        </a>

        <a
          href="https://github.com/burakdarende"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            background: "rgba(107, 114, 128, 0.1)",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#374151",
            border: "1px solid rgba(107, 114, 128, 0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(107, 114, 128, 0.15)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(107, 114, 128, 0.1)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <span style={{ fontSize: "20px" }}>🐙</span>
          <div>
            <div style={{ fontWeight: "500" }}>GitHub</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              @burakdarende
            </div>
          </div>
        </a>

        <a
          href="https://burakdarende.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#1d4ed8",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(59, 130, 246, 0.15)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(59, 130, 246, 0.1)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <span style={{ fontSize: "20px" }}>🌐</span>
          <div>
            <div style={{ fontWeight: "500" }}>Website</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              burakdarende.com
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

// Gallery Modal
export function GalleryModal() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      alt: "3D Scene Example 1",
      caption: "Modern architectural visualization",
    },
    {
      src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      alt: "3D Scene Example 2",
      caption: "Interactive product showcase",
    },
    {
      src: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800",
      alt: "3D Scene Example 3",
      caption: "Real-time lighting effects",
    },
  ];

  return (
    <div className="gallery-modal">
      <p
        style={{
          textAlign: "center",
          marginBottom: "24px",
          color: "#6b7280",
          lineHeight: "1.6",
        }}
      >
        Explore examples of professional 3D scenes created with WebMeshCore3D
        framework.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: "rgba(0, 0, 0, 0.05)",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "12px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#374151",
                  textAlign: "center",
                }}
              >
                {image.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "rgba(16, 185, 129, 0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#047857", fontSize: "0.9rem" }}>
          🚀 Ready to create your own? Check the documentation to get started!
        </p>
      </div>
    </div>
  );
}

// Documentation Modal
export function DocumentationModal() {
  return (
    <div className="documentation-modal">
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "32px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          📚
        </div>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Quick reference guide for WebMeshCore3D development
        </p>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {/* Getting Started */}
        <div
          style={{
            padding: "20px",
            background: "rgba(59, 130, 246, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🚀 Getting Started
          </h3>
          <code
            style={{
              display: "block",
              background: "rgba(0, 0, 0, 0.05)",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              marginBottom: "8px",
              fontFamily: "monospace",
            }}
          >
            npm install --legacy-peer-deps
            <br />
            npm run dev
          </code>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
            Install dependencies and start the development server.
          </p>
        </div>

        {/* Configuration */}
        <div
          style={{
            padding: "20px",
            background: "rgba(16, 185, 129, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px",
              color: "#047857",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚙️ Configuration
          </h3>
          <p
            style={{ margin: "0 0 8px", fontSize: "0.9rem", color: "#374151" }}
          >
            All settings are centralized in{" "}
            <code
              style={{
                background: "rgba(0,0,0,0.1)",
                padding: "2px 4px",
                borderRadius: "3px",
              }}
            >
              src/config/app-config.js
            </code>
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              fontSize: "0.85rem",
              color: "#6b7280",
            }}
          >
            <li>Camera position and controls</li>
            <li>Visual quality and bloom settings</li>
            <li>Debug mode toggles</li>
            <li>Performance optimization</li>
          </ul>
        </div>

        {/* Development */}
        <div
          style={{
            padding: "20px",
            background: "rgba(245, 158, 11, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(245, 158, 11, 0.1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🛠️ Development Tools
          </h3>
          <div style={{ fontSize: "0.9rem", color: "#374151" }}>
            <p style={{ margin: "0 0 8px" }}>
              <strong>Debug Controls:</strong>
            </p>
            <ul
              style={{
                margin: "0 0 12px",
                paddingLeft: "20px",
                fontSize: "0.85rem",
              }}
            >
              <li>
                <kbd
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  H
                </kbd>{" "}
                - Toggle debug panels
              </li>
              <li>
                <kbd
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  G
                </kbd>{" "}
                - Grab/move mode
              </li>
              <li>
                <kbd
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  C
                </kbd>{" "}
                - Camera type switch
              </li>
              <li>
                <kbd
                  style={{
                    background: "rgba(0,0,0,0.1)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  WASD
                </kbd>{" "}
                - Camera navigation
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          padding: "16px",
          background: "rgba(107, 114, 128, 0.05)",
          borderRadius: "8px",
          border: "1px solid rgba(107, 114, 128, 0.1)",
        }}
      >
        <p style={{ margin: 0, color: "#374151", fontSize: "0.9rem" }}>
          💡 <strong>Tip:</strong> Use debug mode to find perfect camera angles,
          then copy values to production config.
        </p>
      </div>
    </div>
  );
}

export default {
  AboutModal,
  ContactModal,
  GalleryModal,
  DocumentationModal,
};
