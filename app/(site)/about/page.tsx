"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

const timeline = [
  { year: "2010 — היום", role: "אסטרטגית מיתוג מילולי עצמאית", note: "שיום, סלוגנים, טון דיבור, קופי" },
  { year: "2008 — 2010", role: "עורכת משנה, עיר ואם", note: "קבוצת הארץ" },
  { year: "2004 — 2008", role: "עיתונאית ועורכת", note: "ידיעות אחרונות, פנאי פלוס" },
  { year: "2002 — 2004", role: "קופירייטרית", note: "פיר ולוין תקשורת" },
];

const clients = ["שפירא בירה", "Urban Wise", "הפסגה", "SNUG", "MYJOOL", "קפטן אינווסט", "הצורת", "פילהרמונית ישראל", "Déesse", "הנני"];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "5rem" }}>
      {/* Intro */}
      <section style={{ padding: "5rem 2rem" }}>
        <div className="page-wrapper">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: "var(--font-caption)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "1.5rem",
                }}
              >
                אודות
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: "2rem" }}
              >
                אילונה<br />אברמסון
              </motion.h1>

              {/* Image placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  height: "460px",
                  background: "var(--parchment)",
                  border: "1px dashed var(--rule)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ash)",
                  fontFamily: "var(--font-caption)",
                  fontSize: "0.875rem",
                }}
              >
                [תמונה — להוספה]
              </motion.div>
            </div>

            <div style={{ paddingTop: "4rem" }}>
              <ScrollReveal>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.9, marginBottom: "1.75rem" }}>
                  התחלתי בעיתונאות — ולמדתי שם משהו שאף בית ספר למיתוג לא מלמד: איך לכתוב כך שאנשים ימשיכו לקרוא.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "var(--ash)", marginBottom: "1.75rem" }}>
                  כיום אני עוסקת במיתוג מילולי — תחום שעוסק בכל מה שמותג אומר ואיך הוא אומר את זה. שמות, סלוגנים, מדריכי שפה, ותוכן שנעשה עבודה אמיתית.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: "var(--ash)", marginBottom: "2.5rem" }}>
                  אני עובדת עם מותגים שמבינים שהמילים הן לא קישוט — הן האסטרטגיה.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.16}>
                <a
                  href="mailto:ilona@example.com"
                  style={{
                    display: "inline-block",
                    padding: "0.85rem 2rem",
                    background: "var(--ink)",
                    color: "var(--warm-white)",
                    fontFamily: "var(--font-caption)",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.target as HTMLElement).style.background = "var(--gold)"}
                  onMouseLeave={e => (e.target as HTMLElement).style.background = "var(--ink)"}
                >
                  בואו נדבר
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "5rem 2rem", background: "var(--parchment)" }}>
        <div className="page-wrapper">
          <ScrollReveal style={{ marginBottom: "3rem" }}>
            <p style={{
              fontFamily: "var(--font-caption)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1rem",
            }}>
              ניסיון
            </p>
            <h2>הדרך עד כאן</h2>
          </ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {timeline.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.07}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: "2rem",
                  padding: "2rem 0",
                  borderTop: "1px solid var(--rule)",
                  alignItems: "start",
                }}>
                  <p style={{
                    fontFamily: "var(--font-caption)",
                    fontSize: "0.8rem",
                    color: "var(--gold)",
                    letterSpacing: "0.05em",
                    paddingTop: "2px",
                  }}>
                    {item.year}
                  </p>
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: "0.25rem" }}>{item.role}</p>
                    <p style={{ color: "var(--ash)", fontSize: "0.9rem" }}>{item.note}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section style={{ padding: "5rem 2rem" }}>
        <div className="page-wrapper">
          <ScrollReveal style={{ marginBottom: "3rem" }}>
            <p style={{
              fontFamily: "var(--font-caption)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1rem",
            }}>
              לקוחות
            </p>
            <h2>עבדתי עם</h2>
          </ScrollReveal>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            {clients.map((c, i) => (
              <ScrollReveal key={c} delay={i * 0.04}>
                <span style={{
                  display: "inline-block",
                  padding: "0.6rem 1.25rem",
                  border: "1px solid var(--rule)",
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  color: "var(--ash)",
                }}>
                  {c}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ padding: "5rem 2rem", background: "var(--ink)", color: "var(--warm-white)" }}>
        <div className="page-wrapper" style={{ maxWidth: 720 }}>
          <ScrollReveal>
            <div className="gold-rule" />
            <h2 style={{ color: "var(--warm-white)", marginBottom: "1.5rem" }}>
              אסטרטגיה לפני קופי — תמיד.
            </h2>
            <p style={{ color: "rgba(250,249,246,0.7)", fontSize: "1.05rem", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              אני לא כותבת מילה לפני שאני מבינה את המותג, הקהל, והמתחרים. זה לוקח יותר זמן. זה גם הסיבה שהעבודה שאני מוסרת עובדת.
            </p>
            <p style={{ color: "rgba(250,249,246,0.5)", fontSize: "0.95rem", lineHeight: 1.8 }}>
              הרקע העיתונאי שלי לימד אותי לשאול שאלות שאנשי שיווק לא שואלים — ולהגיע לתשובות שאנשי קריאייטיב לא מחפשים. זה המקום שבו אני חיה.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
