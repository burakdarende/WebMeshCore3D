import Scene from "../components/Scene_simple";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Scene />

      {/* Copyright Footer */}
      <footer
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          textAlign: "center",
          padding: "8px 16px",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "8px",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#4ade80",
            fontWeight: "400",
            lineHeight: "1.4",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace",
          }}
        >
          Developed by{" "}
          <strong style={{ color: "#22c55e" }}>Burak Darende</strong> •{" "}
          <a
            href="https://github.com/burakdarende/WebMeshCore3D"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4ade80",
              textDecoration: "none",
              fontWeight: "500",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#22c55e")}
            onMouseOut={(e) => (e.target.style.color = "#4ade80")}
          >
            Download on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
