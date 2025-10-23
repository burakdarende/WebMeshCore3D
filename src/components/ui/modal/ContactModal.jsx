// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT MODAL - Enhanced contact form and information
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";

export function ContactModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }, 1500);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  const contactMethods = [
    {
      id: "email",
      label: "Email",
      value: "hello@burakdarende.com",
      icon: "📧",
      color: "#059669",
      href: "mailto:hello@burakdarende.com",
    },
    {
      id: "github",
      label: "GitHub",
      value: "@burakdarende",
      icon: "🐙",
      color: "#374151",
      href: "https://github.com/burakdarende",
    },
    {
      id: "website",
      label: "Website",
      value: "burakdarende.com",
      icon: "🌐",
      color: "#3b82f6",
      href: "https://burakdarende.com",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "Burak Darende",
      icon: "💼",
      color: "#0e76a8",
      href: "https://www.linkedin.com/in/burakdarende/",
    },
  ];

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>✅</div>
        <h2 style={{ margin: "0 0 16px", color: "#059669" }}>Message Sent!</h2>
        <p style={{ margin: 0, color: "#6b7280", lineHeight: "1.6" }}>
          Thank you for reaching out! I'll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
        <h2 style={{ margin: "0 0 8px", color: "#1f2937" }}>Get in Touch</h2>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Have questions about WebMeshCore3D? Let's connect!
        </p>
      </div>

      {/* Contact Methods */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {contactMethods.map((method) => (
          <a
            key={method.id}
            href={method.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px",
              background: `${method.color}08`,
              borderRadius: "8px",
              textDecoration: "none",
              color: method.color,
              border: `2px solid ${method.color}20`,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = `${method.color}15`;
              e.currentTarget.style.borderColor = `${method.color}40`;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = `${method.color}08`;
              e.currentTarget.style.borderColor = `${method.color}20`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "20px" }}>{method.icon}</span>
            <div>
              <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                {method.label}
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                {method.value}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.02)",
          borderRadius: "12px",
          padding: "24px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 20px", color: "#1f2937" }}>Send a Message</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Name & Email Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    transition: "border-color 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    transition: "border-color 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
                  }}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
                }}
                placeholder="What's this about?"
              />
            </div>

            {/* Message */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s ease",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
                }}
                placeholder="Tell me about your project, questions, or how I can help..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={{
                padding: "14px 24px",
                background:
                  isFormValid && !isSubmitting
                    ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                    : "#d1d5db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor:
                  isFormValid && !isSubmitting ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                if (isFormValid && !isSubmitting) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(59, 130, 246, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite" }}>
                    ⏳
                  </span>
                  Sending...
                </>
              ) : (
                <>
                  <span>📤</span>
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Response Time Notice */}
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
          💡 <strong>Quick Response:</strong> I typically respond within 24
          hours on business days.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ContactModal;
