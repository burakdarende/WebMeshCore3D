// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC MODAL - Spotify and streaming platform artist profiles
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";

export function MusicModal() {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("all");

  const musicPlatforms = [
    {
      name: "Spotify",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.301 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
      url: "https://open.spotify.com/artist/burakdarende",
      color: "#1DB954",
      followers: "2.8K",
      monthlyListeners: "12.5K",
      description: "Electronic & Ambient",
    },
    {
      name: "Apple Music",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.14C17.734 0 17.35 0 16.98 0H7.02C6.65 0 6.266 0 5.864.024 5.338.029 4.817.071 4.3.164 3.627.285 2.997.517 2.423.891 1.305 1.624.56 2.624.243 3.934.068 4.654.003 5.386.003 6.124v11.752c0 .738.065 1.47.24 2.19.317 1.31 1.062 2.31 2.18 3.043.574.374 1.204.606 1.877.727.517.093 1.038.135 1.564.14.402.024.786.024 1.156.024h9.96c.37 0 .754 0 1.156-.024.526-.005 1.047-.047 1.564-.14.673-.121 1.303-.353 1.877-.727 1.118-.733 1.863-1.733 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zM8.25 20.25c-1.24 0-2.25-1.01-2.25-2.25V6c0-1.24 1.01-2.25 2.25-2.25h7.5c1.24 0 2.25 1.01 2.25 2.25v12c0 1.24-1.01 2.25-2.25 2.25h-7.5z" />
        </svg>
      ),
      url: "https://music.apple.com/artist/burakdarende",
      color: "#FA243C",
      followers: "1.2K",
      monthlyListeners: "8.3K",
      description: "Instrumental & Soundtracks",
    },
    {
      name: "SoundCloud",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.098-.098l.262-2.105-.262-2.154c-.008-.054-.048-.1-.098-.1zm1.49.876c-.05 0-.093.041-.1.094l-.287 1.279.287 1.234c.007.057.05.098.1.098.051 0 .09-.041.099-.098l.321-1.234-.321-1.279c-.009-.053-.048-.094-.099-.094zm1.49-1.738c-.058 0-.104.048-.104.102l-.278 2.897.278 2.312c0 .058.046.104.104.104.057 0 .103-.046.103-.104l.313-2.312-.313-2.897c0-.054-.046-.102-.103-.102zm1.489-1.644c-.062 0-.112.053-.112.112l-.266 4.441.266 2.179c0 .062.05.112.112.112s.111-.05.111-.112l.297-2.179-.297-4.441c0-.059-.049-.112-.111-.112zm1.489-1.613c-.067 0-.12.058-.12.12l-.259 6.054.259 2.147c0 .067.053.12.12.12s.118-.053.118-.12l.289-2.147-.289-6.054c0-.062-.051-.12-.118-.12zm1.489-1.369c-.071 0-.128.062-.128.128l-.249 7.423.249 2.118c0 .071.057.128.128.128.07 0 .126-.057.126-.128l.28-2.118-.28-7.423c0-.066-.056-.128-.126-.128zm1.489-.551c-.075 0-.135.065-.135.135l-.243 7.974.243 2.086c0 .075.06.135.135.135.074 0 .133-.06.133-.135l.272-2.086-.272-7.974c0-.07-.059-.135-.133-.135zm1.489-.415c-.079 0-.142.068-.142.142l-.235 8.389.235 2.053c0 .079.063.142.142.142.078 0 .14-.063.14-.142l.264-2.053-.264-8.389c0-.074-.062-.142-.14-.142zm1.489-.218c-.083 0-.149.071-.149.149l-.229 8.607.229 2.02c0 .083.066.149.149.149.082 0 .147-.066.147-.149l.257-2.02-.257-8.607c0-.078-.065-.149-.147-.149zm3.48.307c-.375 0-.741.143-1.021.4-.161.148-.296.322-.397.515-.019.036-.029.075-.029.114v11.12c0 .047.016.09.043.124.027.034.065.054.105.058.005 0 .01.001.015.001h8.789c.375 0 .735-.15.995-.417.26-.267.406-.628.406-1.003V9.77c0-1.125-.896-2.037-2.002-2.037-.188 0-.374.026-.551.077-.179-.187-.385-.344-.608-.464-.508-.274-1.088-.372-1.675-.284-.226.034-.444.094-.649.178-.407-.188-.854-.29-1.31-.299-.003 0-.006 0-.009 0z" />
        </svg>
      ),
      url: "https://soundcloud.com/burakdarende",
      color: "#FF5500",
      followers: "892",
      monthlyListeners: "5.1K",
      description: "Experimental & Demos",
    },
    {
      name: "YouTube Music",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      url: "https://music.youtube.com/channel/UCburakdarende",
      color: "#FF0000",
      followers: "3.4K",
      monthlyListeners: "18.7K",
      description: "Full Albums & Videos",
    },
  ];

  const genres = [
    { id: "all", label: "All Genres", icon: "🎵" },
    { id: "electronic", label: "Electronic", icon: "🎛️" },
    { id: "ambient", label: "Ambient", icon: "🌌" },
    { id: "soundtrack", label: "Soundtrack", icon: "🎬" },
    { id: "experimental", label: "Experimental", icon: "🔬" },
  ];

  const releases = [
    {
      id: "digital-dreams",
      title: "Digital Dreams",
      genre: "electronic",
      type: "Album",
      year: "2024",
      duration: "42:18",
      tracks: 12,
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      streams: "125K",
      platforms: ["Spotify", "Apple Music", "YouTube Music"],
    },
    {
      id: "neon-nights",
      title: "Neon Nights",
      genre: "electronic",
      type: "EP",
      year: "2024",
      duration: "18:45",
      tracks: 5,
      cover:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      streams: "78K",
      platforms: ["Spotify", "SoundCloud", "YouTube Music"],
    },
    {
      id: "cosmic-voyage",
      title: "Cosmic Voyage",
      genre: "ambient",
      type: "Single",
      year: "2023",
      duration: "6:32",
      tracks: 1,
      cover:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop",
      streams: "234K",
      platforms: ["Spotify", "Apple Music", "SoundCloud", "YouTube Music"],
    },
    {
      id: "game-score-collection",
      title: "Game Score Collection",
      genre: "soundtrack",
      type: "Compilation",
      year: "2023",
      duration: "1:15:23",
      tracks: 18,
      cover:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
      streams: "89K",
      platforms: ["Spotify", "Apple Music", "YouTube Music"],
    },
    {
      id: "glitch-experiments",
      title: "Glitch Experiments",
      genre: "experimental",
      type: "EP",
      year: "2023",
      duration: "22:17",
      tracks: 6,
      cover:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
      streams: "45K",
      platforms: ["SoundCloud", "YouTube Music"],
    },
  ];

  const filteredReleases =
    selectedGenre === "all"
      ? releases
      : releases.filter((release) => release.genre === selectedGenre);

  const handlePlatformClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleReleaseClick = (release) => {
    // Find the first available platform and redirect
    const availablePlatform = musicPlatforms.find((platform) =>
      release.platforms.includes(platform.name)
    );
    if (availablePlatform) {
      window.open(availablePlatform.url, "_blank", "noopener,noreferrer");
    }
  };

  const getPlatformIcon = (platformName) => {
    const platform = musicPlatforms.find((p) => p.name === platformName);
    return platform ? platform.icon : null;
  };

  const getPlatformColor = (platformName) => {
    const platform = musicPlatforms.find((p) => p.name === platformName);
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
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎵</div>
        <h2
          style={{
            margin: "0 0 8px",
            color: "#f8fafc",
            fontSize: "1.8rem",
            fontWeight: "600",
          }}
        >
          Music & Audio
        </h2>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "1rem" }}>
          Artist profiles and music releases across streaming platforms
        </p>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        {/* Platform Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {musicPlatforms.map((platform) => (
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
                        .join(", ")}, 0.2)`
                    : "rgba(30, 41, 59, 0.8)",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${
                  hoveredPlatform === platform.name
                    ? platform.color
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
                        .join(", ")}, 0.3)`
                    : "0 2px 8px rgba(0, 0, 0, 0.3)",
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

              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                    Followers
                  </span>
                  <span style={{ color: "#f1f5f9", fontWeight: "600" }}>
                    {platform.followers}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                    Monthly
                  </span>
                  <span style={{ color: "#f1f5f9", fontWeight: "600" }}>
                    {platform.monthlyListeners}
                  </span>
                </div>
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  padding: "8px 12px",
                  background: "rgba(71, 85, 105, 0.3)",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                {platform.description}
              </div>
            </div>
          ))}
        </div>

        {/* Genre Filter */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background:
                  selectedGenre === genre.id
                    ? "rgba(168, 85, 247, 0.2)"
                    : "rgba(71, 85, 105, 0.3)",
                borderRadius: "8px",
                border:
                  selectedGenre === genre.id
                    ? "2px solid rgba(168, 85, 247, 0.5)"
                    : "2px solid rgba(71, 85, 105, 0.3)",
                color: selectedGenre === genre.id ? "#c084fc" : "#cbd5e1",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
              onMouseOver={(e) => {
                if (selectedGenre !== genre.id) {
                  e.target.style.background = "rgba(71, 85, 105, 0.4)";
                  e.target.style.borderColor = "rgba(71, 85, 105, 0.5)";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGenre !== genre.id) {
                  e.target.style.background = "rgba(71, 85, 105, 0.3)";
                  e.target.style.borderColor = "rgba(71, 85, 105, 0.3)";
                }
              }}
            >
              <span>{genre.icon}</span>
              <span>{genre.label}</span>
            </button>
          ))}
        </div>

        {/* Releases Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {filteredReleases.map((release) => (
            <div
              key={release.id}
              onClick={() => handleReleaseClick(release)}
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid rgba(71, 85, 105, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(168, 85, 247, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(71, 85, 105, 0.3)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.3)";
              }}
            >
              <div style={{ display: "flex", gap: "16px", padding: "20px" }}>
                {/* Album Cover */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    backgroundImage: `url(${release.cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    flexShrink: 0,
                  }}
                />

                {/* Release Info */}
                <div style={{ flex: 1 }}>
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
                      }}
                    >
                      {release.title}
                    </h3>
                    <span
                      style={{
                        background: "rgba(168, 85, 247, 0.2)",
                        color: "#c084fc",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {release.type}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "12px",
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                    }}
                  >
                    <span>📅 {release.year}</span>
                    <span>⏱️ {release.duration}</span>
                    <span>🎵 {release.tracks} tracks</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "0.8rem",
                      }}
                    >
                      🎧 {release.streams} streams
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {release.platforms.map((platformName) => (
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Artist Bio */}
        <div
          style={{
            padding: "24px",
            background: "rgba(71, 85, 105, 0.3)",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            textAlign: "center",
          }}
        >
          <h4
            style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: "1.2rem" }}
          >
            🎼 About the Artist
          </h4>
          <p
            style={{
              margin: "0 0 20px",
              color: "#94a3b8",
              fontSize: "1rem",
              lineHeight: "1.6",
            }}
          >
            Electronic music producer and sound designer crafting immersive
            audio experiences. From ambient soundscapes to driving electronic
            beats, each release explores new sonic territories.
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
                  color: "#c084fc",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                50+
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Tracks Released
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#c084fc",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                15K+
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Monthly Listeners
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#c084fc",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                500K+
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Total Streams
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicModal;
