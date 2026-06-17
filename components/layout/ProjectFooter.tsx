"use client";

import { Project } from "@/lib/projects";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  project?: Project;
}

const C = {
  ink:   "#0a1a0d",
  ink3:  "#87908a",
  cream: "#e8d4ff",
  line:  "#e7e1d8",
  lime:  "#e0ff5c",
};

/* ── Instagram icon ─────────────────────────────────────────────────── */
function IconInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 216.67 216.67" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M53.03,216.67h110.61c29.24,0,53.03-23.79,53.03-53.03V53.03c0-29.24-23.79-53.03-53.03-53.03H53.03C23.79,0,0,23.79,0,53.03v110.61c0,29.24,23.79,53.03,53.03,53.03ZM8.44,53.03c0-24.59,20-44.59,44.59-44.59h110.61c24.59,0,44.59,20,44.59,44.59v110.61c0,24.59-20,44.59-44.59,44.59H53.03c-24.59,0-44.59-20-44.59-44.59V53.03Z" fill={C.ink}/>
      <path d="M108.33,162.58c29.91,0,54.25-24.34,54.25-54.25s-24.34-54.25-54.25-54.25-54.25,24.34-54.25,54.25,24.34,54.25,54.25,54.25ZM108.33,62.53c25.26,0,45.81,20.55,45.81,45.81s-20.55,45.81-45.81,45.81-45.81-20.55-45.81-45.81,20.55-45.81,45.81-45.81Z" fill={C.ink}/>
      <circle cx="172.59" cy="44.07" r="10.41" fill={C.ink}/>
    </svg>
  );
}

/* ── WhatsApp icon ──────────────────────────────────────────────────── */
function IconWhatsapp() {
  return (
    <svg width="20" height="20" viewBox="0 0 226.21 227.96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.34,227.96l54.4-14.58c16.06,8.4,34.13,12.83,52.36,12.83,62.37,0,113.1-50.74,113.1-113.1S175.47,0,113.1,0,0,50.74,0,113.1c0,23.05,6.89,45.17,19.94,64.09l-13.6,50.76ZM8.44,113.1C8.44,55.39,55.39,8.44,113.1,8.44s104.66,46.95,104.66,104.66-46.95,104.66-104.66,104.66c-17.41,0-34.64-4.36-49.84-12.6l-1.48-.8-43.51,11.66,10.85-40.47-1.16-1.62c-12.77-17.84-19.52-38.87-19.52-60.82Z" fill={C.ink}/>
      <path d="M142.29,129.54c-1.97,2.95-7.72,9.65-9.45,11.63-1.75,1.95-3.49,2.1-6.47.75-3-1.5-12.65-4.66-24.06-14.87-8.89-7.96-14.86-17.72-16.62-20.72-2.93-5.07,3.2-5.79,8.79-16.36,1-2.1.49-3.75-.25-5.25-.75-1.5-6.73-16.22-9.23-22.09-2.4-5.85-4.88-5.11-6.73-5.11-5.77-.5-9.98-.42-13.7,3.44-16.16,17.76-12.08,36.08,1.74,55.57,27.17,35.56,41.65,42.11,68.12,51.2,7.15,2.27,13.67,1.95,18.82,1.21,5.75-.91,17.69-7.22,20.18-14.28,2.55-7.06,2.55-12.92,1.8-14.27-.74-1.35-30.12-15.14-32.96-10.87Z" fill={C.ink}/>
    </svg>
  );
}

/* ── LinkedIn icon ──────────────────────────────────────────────────── */
function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="3" stroke={C.ink} strokeWidth="1.5" fill="none"/>
      <path d="M7 10v7M7 7v.5" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4M11 10v7" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProjectFooter({ project }: Props) {
  const designerCredit = project?.designerCredit;
  const isMobile = useIsMobile();

  return (
    <footer style={{
      background: C.cream,
      borderTop: `1px solid ${C.line}`,
      direction: "rtl",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Scribble decorations — hidden on mobile */}
      {!isMobile && (
        <>
          <div style={{ position: "absolute", left: -80, bottom: -30, width: 520, opacity: 0.95, pointerEvents: "none", transform: "scaleX(-1)" }}>
            <img src="/projects/reverie/Green-Scrible-Footer.svg" alt="" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ position: "absolute", right: -80, bottom: -30, width: 520, opacity: 0.95, pointerEvents: "none" }}>
            <img src="/projects/reverie/Green-Scrible-Footer.svg" alt="" style={{ width: "100%", display: "block" }} />
          </div>
        </>
      )}

      {/* Content */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: isMobile ? "48px 24px 40px" : "40px 56px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr",
        alignItems: "center",
        gap: isMobile ? 32 : 32,
        position: "relative",
        zIndex: 1,
        textAlign: isMobile ? "center" : undefined,
      }}>

        {/* Social icons + email */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMobile ? "center" : "flex-start",
          gap: isMobile ? 16 : 12,
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              style={{ opacity: 1, transition: "opacity 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
              <IconInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ opacity: 1, transition: "opacity 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
              <IconLinkedIn />
            </a>
            <a href="https://wa.me/972500000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              style={{ opacity: 1, transition: "opacity 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
              <IconWhatsapp />
            </a>
          </div>
          <a href="mailto:abramsonilona@gmail.com"
            style={{
              fontFamily: "var(--font-body-en)", fontWeight: 300, fontSize: 11,
              color: C.ink3, letterSpacing: "0.03em", textDecoration: "none",
              transition: "color 0.2s", direction: "ltr",
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = C.ink)}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = C.ink3)}>
            abramsonilona@gmail.com
          </a>
        </div>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="/logo.png.png"
            alt="Ilona Abramson"
            style={{
              height: 18,
              width: "auto",
              maxWidth: isMobile ? 160 : "none",
              display: "block",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Copyright + designer credit */}
        <div style={{ textAlign: isMobile ? "center" : "left", direction: "ltr" }}>
          <p style={{
            fontFamily: "var(--font-body-en)", fontWeight: 300, fontSize: 11,
            color: C.ink3, letterSpacing: "0.03em",
            margin: isMobile ? "0 0 4px" : "0 0 6px",
          }}>
            © All rights reserved to Ilona Abramson
          </p>
          {designerCredit && (
            <p style={{
              fontFamily: "var(--font-body-en)", fontWeight: 300, fontSize: 11,
              color: C.ink3, letterSpacing: "0.03em", margin: 0,
            }}>
              Design by{" "}
              <a href="#"
                style={{ color: C.ink3, textDecoration: "underline", textUnderlineOffset: 2, transition: "color 0.2s" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = C.ink)}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = C.ink3)}>
                {designerCredit}
              </a>
            </p>
          )}
        </div>

      </div>
    </footer>
  );
}
