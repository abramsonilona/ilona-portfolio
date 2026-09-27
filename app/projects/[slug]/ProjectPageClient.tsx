"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/projects";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectFooter from "@/components/layout/ProjectFooter";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props { project: Project; }

const C = {
  ink:   "#0a1a0d",
  ink2:  "#4a544c",
  ink3:  "#87908a",
  cream: "#fcf7f4",
  line:  "#e7e1d8",
  violet:"#a173ea",
};

/* ── Reverie-specific layout ─────────────────────────────────────── */
function ReverieLayout({ project }: { project: Project }) {
  const isMobile = useIsMobile();
  const images = project.images ?? [];
  const rows: [string, string][] = [];
  for (let i = 0; i + 1 < images.length; i += 2) {
    rows.push([images[i], images[i + 1]]);
  }

  const pad = isMobile ? "0 20px" : "0 56px";

  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl" }}>

      {/* Hero video — full width, natural height; mobile uses separate file */}
      <div style={{ lineHeight: 0, background: "#1a0a00" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", display: "block" }}
        >
          {/* Mobile video (≤767px) */}
          <source src="/projects/reverie/Mobile-Banner-Reverie.mp4" media="(max-width: 767px)" type="video/mp4" />
          {/* Desktop video */}
          <source src={project.videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Title block */}
      <section style={{ padding: isMobile ? "40px 20px 0" : "72px 56px 0", maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "right" }}
        >
          <h1 style={{
            fontFamily: "var(--font-body-en)",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: isMobile ? "clamp(40px, 11vw, 60px)" : "clamp(52px, 7vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: 0,
          }}>
            {project.title}
          </h1>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontSize: isMobile ? 13 : 15,
            color: C.violet,
            marginTop: 8,
            marginBottom: 0,
          }}>
            {project.category}
          </p>
        </motion.div>
      </section>

      {/* Body text */}
      <section style={{ padding: isMobile ? "32px 20px 48px" : "48px 56px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <ScrollReveal>
          <div style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: isMobile ? 32 : 48,
            maxWidth: 680,
            marginRight: 0,
            marginLeft: "auto",
            textAlign: "right",
          }}>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: isMobile ? 18 : "clamp(20px, 2.2vw, 26px)",
              lineHeight: 1.3,
              letterSpacing: "-0.018em",
              color: C.ink,
              margin: "0 0 16px",
            }}>
              לגרום לכם לחלום על השוקולד הזה
            </h2>

            {project.description.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: isMobile ? 15 : 17,
                lineHeight: 1.8,
                color: C.ink2,
                margin: "0 0 16px",
              }}>
                {para}
              </p>
            ))}

            <div style={{ marginBottom: isMobile ? 20 : 32 }} />

            {project.solution.split("\n\n").map((para, i) =>
              i === 0 ? (
                <h2 key={i} style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: isMobile ? 18 : "clamp(20px, 2.2vw, 26px)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.018em",
                  color: C.ink,
                  margin: "0 0 16px",
                }}>
                  {para}
                </h2>
              ) : (
                <p key={i} style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 400,
                  fontSize: isMobile ? 15 : 17,
                  lineHeight: 1.8,
                  color: C.ink2,
                  margin: "0 0 16px",
                }}>
                  {para}
                </p>
              )
            )}

            <div style={{ marginBottom: 28 }} />

            {project.designerCredit && (
              <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
                <p style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 400,
                  fontSize: 13,
                  color: C.ink3,
                  margin: "0 0 6px",
                }}>
                  {project.designerCreditLabel ?? "מיתוג ועיצוב"}
                </p>
                <a
                  href="#"
                  style={{
                    fontFamily: "var(--font-body-en)",
                    fontWeight: 300,
                    fontSize: 15,
                    color: C.ink,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    letterSpacing: "0.02em",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = C.violet)}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = C.ink)}
                >
                  {project.designerCredit}
                </a>
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Image grid — 1 col on mobile, 2 cols on desktop */}
      <section style={{ padding: isMobile ? `0 0 64px` : `0 56px 96px`, maxWidth: isMobile ? "100%" : 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 6 : 12 }}>
          {isMobile ? (
            /* Single column — full bleed on mobile */
            images.map((src, i) => (
              <ScrollReveal key={i}>
                <img
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  style={{ width: "100%", display: "block", height: "auto" }}
                />
              </ScrollReveal>
            ))
          ) : (
            /* 2-column pairs on desktop */
            rows.map(([left, right], i) => (
              <ScrollReveal key={i}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <img src={left}  alt={`${project.title} ${i * 2 + 1}`} style={{ width: "100%", display: "block", height: "auto" }} />
                  <img src={right} alt={`${project.title} ${i * 2 + 2}`} style={{ width: "100%", display: "block", height: "auto" }} />
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </section>

      <ProjectFooter project={project} />
    </div>
  );
}

/* ── Gallery video item for Déesse (needs hooks → must be top-level) ── */
function DeesseGalleryVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div onClick={toggle} style={{ position: "relative", overflow: "hidden", cursor: "pointer", height: "100%" }}>
      <video
        ref={ref}
        autoPlay muted loop playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Mute icon — top-left corner */}
      <div style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      </div>

      {/* Play / pause button — center */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#111"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#111" style={{ marginRight: -3 }}><polygon points="5,3 19,12 5,21"/></svg>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Déesse layout ───────────────────────────────────────────────── */
function DeesseLayout({ project }: { project: Project }) {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLVideoElement>(null);
  const [heroPlaying, setHeroPlaying] = useState(true);

  const hPad = isMobile ? 20 : 108;
  const gap  = 24;

  // Hardcoded media paths — layout is non-uniform (can't use generic array loop)
  const img1 = "/projects/deesse/Deesse-01.png"; // necklace    — row1 RIGHT wide (62%)
  const vid2 = "/projects/deesse/Deesse-02.mp4"; // hands craft — row1 LEFT  narrow (38%)
  const img3 = "/projects/deesse/Deesse-03.png"; // ribbon ring — row2 full width
  const vid4 = "/projects/deesse/Deesse-04.mp4"; // boxes       — row3 RIGHT narrow (38%)
  const img5 = "/projects/deesse/Deesse-05.png"; // pattern ring — row3 LEFT wide (62%)

  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl" }}>

      {/* ── Hero strip — below fixed nav, 70vh desktop / 50vh mobile ── */}
      <div
        style={{
          position: "relative",
          marginTop: isMobile ? 47 : 53,
          height: isMobile ? "max(120px, 8.5vw)" : "8.5vw",
          overflow: "hidden",
          background: "#111",
          cursor: "pointer",
        }}
        onClick={() => {
          const v = heroRef.current;
          if (!v) return;
          if (v.paused) { v.play(); setHeroPlaying(true); }
          else { v.pause(); setHeroPlaying(false); }
        }}
      >
        <video
          ref={heroRef}
          autoPlay muted loop playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        >
          <source src={project.mobileVideoUrl} media="(max-width: 767px)" type="video/mp4" />
          <source src={project.videoUrl} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {heroPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#111"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#111" style={{ marginRight: -3 }}><polygon points="5,3 19,12 5,21"/></svg>
            )}
          </div>
        </div>
      </div>

      {/* ── Title block ── */}
      <section style={{ padding: isMobile ? `56px ${hPad}px` : `100px ${hPad}px` }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "right" }}
        >
          <h1 style={{
            fontFamily: "var(--font-body-en)",
            fontWeight: 300,
            fontSize: isMobile ? "clamp(40px,11vw,60px)" : 72,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: "0 0 12px",
          }}>
            {project.title}
          </h1>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontSize: isMobile ? 13 : 15,
            color: C.ink3,
            margin: 0,
          }}>
            {project.category}
          </p>
        </motion.div>
      </section>

      {/* ── Text block ── */}
      <section style={{ padding: isMobile ? `0 ${hPad}px 64px` : `0 ${hPad}px 80px` }}>
        <div style={{ textAlign: "right", maxWidth: 1130 }}>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: isMobile ? 18 : "clamp(18px,1.4vw,22px)",
            lineHeight: 1.3,
            letterSpacing: "-0.015em",
            color: C.ink,
            margin: "0 0 20px",
          }}>
            השם שברא את עצמו
          </h2>

          {project.description.split("\n\n").map((para, i) => (
            <p key={`d${i}`} style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontSize: isMobile ? 15 : 16,
              lineHeight: 1.85,
              color: C.ink2,
              margin: "0 0 14px",
            }}>{para}</p>
          ))}

          {/* solution — skip first chunk (heading already hardcoded above) */}
          {project.solution.split("\n\n").slice(1).map((para, i) => (
            <p key={`s${i}`} style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              fontSize: isMobile ? 15 : 16,
              lineHeight: 1.85,
              color: C.ink2,
              margin: "0 0 14px",
            }}>{para}</p>
          ))}

          <div style={{ marginTop: 28 }}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: C.ink, margin: "0 0 6px" }}>
              מיתוג ועיצוב
            </p>
            <a
              href="#"
              style={{ fontFamily: "var(--font-body-en)", fontWeight: 300, fontSize: 15, color: C.ink, textDecoration: "underline", textUnderlineOffset: 3, letterSpacing: "0.02em", transition: "color 0.2s" }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = C.violet)}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = C.ink)}
            >
              Hadar Mizrahi
            </a>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section style={{ padding: isMobile ? `0 0 64px` : `0 ${hPad}px 96px` }}>
        <div style={{ display: "flex", flexDirection: "column", gap }}>

          {/* Row 1: RIGHT=img1 (wide 62%) | LEFT=vid2 (narrow 38%)
              RTL grid: first DOM child → right column */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap }}>
              <img src={img1} alt="Déesse necklace" style={{ width: "100%", display: "block", height: "auto" }} />
              <DeesseGalleryVideo src={vid2} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "62fr 38fr", gap, alignItems: "stretch" }}>
              <img src={img1} alt="Déesse necklace" style={{ width: "100%", display: "block", height: "auto" }} />
              <DeesseGalleryVideo src={vid2} />
            </div>
          )}

          {/* Row 2: full-width image */}
          <img src={img3} alt="Déesse ring with ribbon" style={{ width: "100%", display: "block", height: "auto" }} />

          {/* Row 3: RIGHT=vid4 (narrow 38%) | LEFT=img5 (wide 62%)
              RTL grid: first DOM child → right column */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap }}>
              <img src={img5} alt="Déesse ring on pattern" style={{ width: "100%", display: "block", height: "auto" }} />
              <DeesseGalleryVideo src={vid4} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "38fr 62fr", gap, alignItems: "stretch" }}>
              <DeesseGalleryVideo src={vid4} />
              <img src={img5} alt="Déesse ring on pattern" style={{ width: "100%", display: "block", height: "auto" }} />
            </div>
          )}

        </div>
      </section>

      <ProjectFooter project={project} />
    </div>
  );
}

/* ── Generic fallback layout (all other projects) ───────────────── */
function GenericLayout({ project }: { project: Project }) {
  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl" }}>

      {/* Colour hero */}
      <div style={{ height: "45vh", background: project.color }} />

      {/* Title */}
      <section style={{ padding: "72px 56px 0", maxWidth: 1280, margin: "0 auto", textAlign: "right" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(40px, 6vw, 80px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            margin: "0 0 10px",
          }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: C.violet, margin: 0 }}>
            {project.category} · {project.year}
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section style={{ padding: "56px 56px 96px", maxWidth: 1280, margin: "0 auto" }}>
        <ScrollReveal>
          <div style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 48,
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 80,
          }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: C.ink2, marginBottom: 40 }}>
                {project.description}
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, marginBottom: 14, letterSpacing: "-0.015em" }}>האתגר</h2>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: C.ink2, marginBottom: 40 }}>{project.challenge}</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, marginBottom: 14, letterSpacing: "-0.015em" }}>הפתרון</h2>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: C.ink2 }}>{project.solution}</p>
            </div>
            <div style={{ padding: 28, background: C.line, alignSelf: "start", position: "sticky", top: 88 }}>
              <p style={{ fontFamily: "var(--font-body-en)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ink3, marginBottom: 16, fontWeight: 300 }}>תפוקות</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {project.deliverables.map((d, i) => (
                  <li key={i} style={{ fontSize: 15, color: C.ink, display: "flex", gap: 10 }}>
                    <span style={{ color: C.violet }}>—</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div style={{ borderTop: `1px solid ${C.line}`, padding: "28px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <Link href="/#work" style={{ fontFamily: "var(--font-body-en)", fontWeight: 300, fontSize: 14, color: C.ink3, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          → חזרה לפרויקטים
        </Link>
      </div>

      <ProjectFooter project={project} />
    </div>
  );
}

/* ── Router ──────────────────────────────────────────────────────── */
export default function ProjectPageClient({ project }: Props) {
  if (project.slug === "reverie") return <ReverieLayout project={project} />;
  if (project.slug === "deesse")  return <DeesseLayout  project={project} />;
  return <GenericLayout project={project} />;
}
