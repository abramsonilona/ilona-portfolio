"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/projects";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectFooter from "@/components/layout/ProjectFooter";

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
  const images = project.images ?? [];
  // Pair into rows of 2
  const rows: [string, string][] = [];
  for (let i = 0; i + 1 < images.length; i += 2) {
    rows.push([images[i], images[i + 1]]);
  }

  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl" }}>

      {/* Hero video — full width, natural height */}
      <div style={{ lineHeight: 0, background: "#1a0a00" }}>
        <video
          src={project.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* Title block */}
      <section style={{ padding: "72px 56px 0", maxWidth: 1280, margin: "0 auto" }}>
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
            fontSize: "clamp(52px, 7vw, 96px)",
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
            fontSize: 15,
            color: C.violet,
            marginTop: 10,
            marginBottom: 0,
          }}>
            {project.category}
          </p>
        </motion.div>
      </section>

      {/* Body text */}
      <section style={{ padding: "48px 56px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <ScrollReveal>
          <div style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 48,
            maxWidth: 680,
            marginRight: 0,
            marginLeft: "auto",
            textAlign: "right",
          }}>
            {/* Heading 1 */}
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(20px, 2.2vw, 26px)",
              lineHeight: 1.3,
              letterSpacing: "-0.018em",
              color: C.ink,
              margin: "0 0 18px",
            }}>
              לגרום לכם לחלום על השוקולד הזה
            </h2>

            {/* Paragraph 1 — multi-paragraph, split on \n\n */}
            {project.description.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: 17,
                lineHeight: 1.8,
                color: C.ink2,
                margin: "0 0 20px",
              }}>
                {para}
              </p>
            ))}

            <div style={{ marginBottom: 32 }} />

            {/* Paragraph 2 — first chunk is the section title, rest are body */}
            {project.solution.split("\n\n").map((para, i) =>
              i === 0 ? (
                <h2 key={i} style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.018em",
                  color: C.ink,
                  margin: "0 0 18px",
                }}>
                  {para}
                </h2>
              ) : (
                <p key={i} style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 400,
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: C.ink2,
                  margin: "0 0 20px",
                }}>
                  {para}
                </p>
              )
            )}

            <div style={{ marginBottom: 28 }} />

            {/* Designer credit */}
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

      {/* Image grid — natural proportions, 2 columns */}
      <section style={{ padding: "0 56px 96px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map(([left, right], i) => (
            <ScrollReveal key={i}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <img
                  src={left}
                  alt={`${project.title} ${i * 2 + 1}`}
                  style={{ width: "100%", display: "block", height: "auto" }}
                />
                <img
                  src={right}
                  alt={`${project.title} ${i * 2 + 2}`}
                  style={{ width: "100%", display: "block", height: "auto" }}
                />
              </div>
            </ScrollReveal>
          ))}
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
  return <GenericLayout project={project} />;
}
