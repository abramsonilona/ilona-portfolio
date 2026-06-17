"use client";

import Link from "next/link";

const INK    = "#0a1a0d";
const CREAM  = "#fcf7f4";
const VIOLET = "#a173ea";
const LINE   = "rgba(255,255,255,0.12)";

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: INK,
        color: CREAM,
        direction: "rtl",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 56px" }}>

        {/* Top: heading + contact form */}
        <div style={{
          padding: "120px 0 72px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1.2fr",
          gap: 80,
          alignItems: "end",
          borderBottom: `1px solid ${LINE}`,
        }}>
          {/* Heading */}
          <h2 style={{
            fontFamily: "var(--font-body-en)",
            fontWeight: 300,
            fontSize: "clamp(54px, 6.4vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.028em",
            margin: 0,
            maxWidth: "12ch",
            color: CREAM,
            direction: "ltr",
          }}>
            Let&apos;s talk{" "}
            <em style={{
              fontFamily: "var(--font-display-en)",
              fontStyle: "italic",
              fontWeight: 300,
              color: VIOLET,
            }}>
              about you.
            </em>
          </h2>

          {/* Form */}
          <form
            onSubmit={e => e.preventDefault()}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {[
              { label: "שם",         type: "text",  placeholder: "שם מלא" },
              { label: "מייל",       type: "email", placeholder: "you@studio.com" },
              { label: "טלפון",      type: "tel",   placeholder: "050-000-0000" },
              { label: "על מה נדבר?", type: "text",  placeholder: "ניימינג · אסטרטגיה · קופי…" },
            ].map(field => (
              <div key={field.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "rgba(252,247,244,0.55)",
                  letterSpacing: "0.02em",
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1px solid ${LINE}`,
                    color: CREAM,
                    fontFamily: "var(--font-heading)",
                    fontSize: 16,
                    fontWeight: 400,
                    padding: "14px 16px",
                    outline: "none",
                    direction: "rtl",
                    borderRadius: 0,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = VIOLET)}
                  onBlur={e => (e.target.style.borderColor = LINE)}
                />
              </div>
            ))}

            <button
              type="submit"
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "18px 28px",
                background: "var(--lime)",
                color: INK,
                border: 0,
                borderRadius: 999,
                fontFamily: "var(--font-heading)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.02em",
                cursor: "pointer",
                alignSelf: "flex-start",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              שלחו הודעה <span style={{ fontSize: 16 }}>←</span>
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: "28px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <span style={{
            fontFamily: "var(--font-body-en)",
            fontSize: 12,
            fontWeight: 300,
            color: "rgba(252,247,244,0.4)",
            letterSpacing: "0.04em",
          }}>
            © Ilona Abramson · {new Date().getFullYear()}
          </span>

          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {[
              { label: "LinkedIn",  href: "https://linkedin.com", external: true },
              { label: "Instagram", href: "https://instagram.com", external: true },
              { label: "hello@ilona.co.il", href: "mailto:abramsonilona@gmail.com", external: false },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                style={{
                  fontFamily: "var(--font-body-en)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "rgba(252,247,244,0.55)",
                  letterSpacing: "0.03em",
                  transition: "color 0.2s",
                  textDecoration: "none",
                  direction: "ltr",
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = VIOLET)}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(252,247,244,0.55)")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
