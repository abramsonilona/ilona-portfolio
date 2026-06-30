"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Footer from "@/components/layout/Footer";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";

/* ─── colour tokens matching globals.css ───────────────────────────── */
const C = {
  ink:      "#0a1a0d",
  ink2:     "#4a544c",
  ink3:     "#87908a",
  cream:    "#fcf7f4",
  cream2:   "#f5efe8",
  line:     "#e7e1d8",
  line2:    "#d9d3c8",
  acid:     "#e0ff5c",
  lav:      "#e8d4ff",
  lav2:     "#f3e7ff",
  violet:   "#a173ea",
  forest:   "#002607",
  white:    "#ffffff",
} as const;

/* ─── visual background map ─────────────────────────────────────────── */
type Visual = "v-lav" | "v-lav-2" | "v-violet" | "v-forest" | "v-ink" | "v-acid" | "v-cream" | "v-cream-2" | "v-white";
const visualBg: Record<Visual, { bg: string; color: string; border?: string }> = {
  "v-lav":    { bg: C.lav,    color: C.ink },
  "v-lav-2":  { bg: C.lav2,   color: C.ink },
  "v-violet": { bg: C.violet, color: C.cream },
  "v-forest": { bg: C.forest, color: C.cream },
  "v-ink":    { bg: C.ink,    color: C.cream },
  "v-acid":   { bg: C.acid,   color: C.ink },
  "v-cream":  { bg: C.cream,  color: C.ink },
  "v-cream-2":{ bg: C.cream2, color: C.ink },
  "v-white":  { bg: C.white,  color: C.ink, border: `1px solid ${C.line}` },
};

/* ─── CTA pill button ────────────────────────────────────────────────── */
function CtaButton({ href, children, acid }: { href: string; children: React.ReactNode; acid?: boolean }) {
  const bg = acid ? C.acid : C.ink;
  const fg = acid ? C.ink : C.cream;
  const hoverBg = acid ? C.ink : C.violet;
  const hoverFg = acid ? C.cream : C.cream;

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "18px 28px",
        background: bg,
        color: fg,
        borderRadius: 999,
        border: 0,
        fontFamily: "var(--font-heading)",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.02em",
        cursor: "pointer",
        whiteSpace: "nowrap",
        textDecoration: "none",
        transition: "background 200ms, color 200ms",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = hoverBg;
        el.style.color = hoverFg;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = bg;
        el.style.color = fg;
      }}
    >
      {children}
      <span style={{ fontSize: 16 }}>←</span>
    </a>
  );
}

/* ─── Bento tile ─────────────────────────────────────────────────────── */
type LogoStyle = "he" | "en" | "script" | "bauhaus";
interface Tile {
  id: string;
  href: string;
  visual: Visual;
  logoStyle: LogoStyle;
  logo: React.ReactNode;
  h3: React.ReactNode;
  tag: string;
  size?: "lg" | "md";
}

function BentoTile({ tile }: { tile: Tile }) {
  const v = visualBg[tile.visual];

  const logoFont: Record<LogoStyle, React.CSSProperties> = {
    he:      { fontFamily: "var(--font-heading)", fontWeight: 700, letterSpacing: "-0.015em" },
    en:      { fontFamily: "var(--font-body-en)", fontWeight: 700, letterSpacing: "-0.005em", direction: "ltr" as const },
    script:  { fontFamily: "var(--font-display-en)", fontStyle: "italic", fontWeight: 300, letterSpacing: 0, direction: "ltr" as const },
    bauhaus: { fontFamily: "var(--font-body-en)", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" as const, fontSize: 22, direction: "ltr" as const },
  };

  const isLg = tile.size === "lg";
  const isMd = tile.size === "md";

  return (
    <motion.a
      href={tile.href}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: isLg || isMd ? "span 2" : undefined,
        gridRow: isLg ? "span 2" : undefined,
        display: "grid",
        gridTemplateRows: "1fr auto",
        background: C.white,
        textDecoration: "none",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
      }}
      whileHover={{ y: -3 }}
    >
      {/* Visual block */}
      <div style={{
        background: v.bg,
        color: v.color,
        border: v.border,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isLg ? 48 : 24,
        minHeight: isLg ? undefined : 160,
        transition: "filter 280ms",
      }}>
        <div style={{
          ...logoFont[tile.logoStyle],
          fontSize: isLg ? "clamp(48px,5vw,80px)" : 30,
          lineHeight: 1,
          textAlign: "center",
          maxWidth: "90%",
        }}>
          {tile.logo}
        </div>
      </div>

      {/* Caption */}
      <div style={{
        padding: isLg ? "32px 32px 36px" : "22px 22px 28px",
        background: C.white,
        borderTop: `1px solid ${C.line}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
      }}>
        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: isLg ? "clamp(22px,1.8vw,26px)" : 17,
          lineHeight: 1.22,
          letterSpacing: "-0.015em",
          margin: 0,
          color: C.ink,
        }}>
          {tile.h3}
        </h3>
        <div style={{
          fontFamily: "var(--font-body-en)",
          fontSize: 12,
          color: C.ink3,
          letterSpacing: "0.04em",
          fontWeight: 300,
        }}>
          {tile.tag}
        </div>
        <span style={{
          position: "absolute",
          bottom: isLg ? 32 : 22,
          left: isLg ? 32 : 22,
          fontSize: 18,
          color: C.ink3,
        }}>←</span>
      </div>
    </motion.a>
  );
}

/* ─── accent helper ─────────────────────────────────────────────────── */
const Acc = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: C.violet, fontWeight: 400 }}>{children}</span>
);

/* ─── bento data ─────────────────────────────────────────────────────── */
const tiles: Tile[] = [
  {
    id: "shapira", href: "/projects/shapira-beer", size: "lg",
    visual: "v-lav", logoStyle: "he", logo: "שפירא",
    h3: <>מותר לכתוב, אסור לשתות — <Acc>איך פגשתי את שפירא.</Acc></>,
    tag: "אפיון אתר + קופי · 2024",
  },
  {
    id: "captain", href: "/projects/urban-wise",
    visual: "v-forest", logoStyle: "en", logo: <>Captain<br />Invest</>,
    h3: <>המיתוג שיגרום לכם להפסיק <Acc>לפחד מנדל״ן.</Acc></>,
    tag: "אסטרטגיה + שפה + קופי",
  },
  {
    id: "myjool", href: "/projects/myjool",
    visual: "v-violet", logoStyle: "bauhaus", logo: "MyJool",
    h3: <>מהמזווה של סבתא <Acc>ל-Waitrose בלונדון.</Acc></>,
    tag: "ניימינג + טאגליין",
  },
  {
    id: "sunkiss", href: "/projects/snug",
    visual: "v-ink", logoStyle: "en",
    logo: <>Sun<em style={{ fontFamily: "var(--font-display-en)", fontStyle: "italic", fontWeight: 300, color: C.acid }}>kiss</em></>,
    h3: <>בר סושי שלא מנסה <Acc>להתחנף ליפן.</Acc></>,
    tag: "שפה + קופי",
  },
  {
    id: "urban", href: "/projects/urban-wise",
    visual: "v-acid", logoStyle: "en",
    logo: <>Urban <em style={{ fontFamily: "var(--font-display-en)", fontStyle: "italic", fontWeight: 300 }}>Wise.</em></>,
    h3: <>משירות הנדסי <Acc>למותג עם אפיל.</Acc></>,
    tag: "ניימינג + טאגליין + קופי",
  },
  {
    id: "totzeret", href: "/projects/hapsgah", size: "md",
    visual: "v-cream-2", logoStyle: "he", logo: "תוצרת",
    h3: <>המותג שבא לאתגר את <Acc>ענקיות המזון.</Acc></>,
    tag: "סיפור מותג + טאגליין + קופי לאריזות",
  },
  {
    id: "philharmonic", href: "/projects/hapsgah", size: "md",
    visual: "v-lav-2", logoStyle: "script", logo: "Philharmonic",
    h3: <>לפרוט על מיתרי הלב <Acc>של התורמים.</Acc></>,
    tag: "קופי + סלוגן · קרן הפילהרמונית הישראלית",
  },
  {
    id: "barbara", href: "/projects/snug",
    visual: "v-white", logoStyle: "script", logo: <>Barbara<br />Berzin</>,
    h3: <>איך לגרום לברברה ברזין <Acc>לדבר לכולם?</Acc></>,
    tag: "קופי לדפי נחיתה",
  },
  {
    id: "kfir", href: "/projects/shapira-beer",
    visual: "v-cream-2", logoStyle: "he", logo: "כפיר",
    h3: <>מעסק B2B לעסק שמדבר <Acc>בשפה של הלקוח.</Acc></>,
    tag: "שפה + קופי לאתר",
  },
  {
    id: "deesse", href: "/projects/myjool",
    visual: "v-lav-2", logoStyle: "script", logo: "Déesse",
    h3: <>השם <Acc>שברא את עצמו.</Acc></>,
    tag: "ניימינג + טאגליין",
  },
  {
    id: "hineni", href: "/projects/hapsgah",
    visual: "v-forest", logoStyle: "script", logo: "Hineni.",
    h3: <>לגעת בקדושה <Acc>מבלי למכור אותה.</Acc></>,
    tag: "קופי לאתר מכירה · EN+HE",
  },
  {
    id: "reverie", href: "/projects/snug", size: "md",
    visual: "v-lav", logoStyle: "script", logo: "Rêverie",
    h3: <>לגרום לכם לחלום <Acc>על השוקולד הזה.</Acc></>,
    tag: "ניימינג + טאגליין · Rêverie · שוקולד",
  },
  {
    id: "lapland", href: "/projects/hapsgah",
    visual: "v-violet", logoStyle: "he", logo: <>חשיפה<br />לצפון</>,
    h3: <>חוויה של שכרון חושים <Acc>שמתחילה באתר.</Acc></>,
    tag: "שפה + אפיון + קופי לאתר",
  },
  {
    id: "grano", href: "/projects/shapira-beer",
    visual: "v-acid", logoStyle: "en", logo: "Grano",
    h3: <>שם שמרגיש <Acc>כאילו היה תמיד שם.</Acc></>,
    tag: "ניימינג + טאגליין · 2025",
  },
];

const services = [
  { n: "01", title: "אסטרטגיית מותג",  body: "המשפט שאם תורידו ממנו מילה, המותג ייפול." },
  { n: "02", title: "קופירייטינג",      body: "און ליין ואוף ליין. מילה במקום הנכון, גם בדפוס." },
  { n: "03", title: "תוכן שיווקי",      body: "טקסט שעובד גם כשלא רואים את הלוגו." },
  { n: "04", title: "ניימינג",           body: "שם שמגדיר את המותג מהיסוד." },
  { n: "05", title: "סיפור מותג",       body: "הסיפור שנשאר אחרי שסוגרים את הטאב." },
  { n: "06", title: "אפיון שפה",        body: "הכתב יד שלכם, מתורגם לטקסט עקבי." },
  { n: "07", title: "טאגליין וסלוגן",  body: "משפט אחד שעובד גם על שלט וגם בלינקדאין." },
  { n: "08", title: "מיקרו קופי",       body: "השורה הקטנה שהופכת קליק להמרה." },
];

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl" }}>

      {/* ══ INTRO + HERO ═════════════════════════════════════════════ */}
      <Intro />
      <Hero />

      {/* ══ A WORD ════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream, padding: "128px 0", borderTop: `1px solid ${C.line}` }}>
        <ScrollReveal>
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 56px" }}>

            {/* h2 */}
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(40px,5vw,72px)",
              lineHeight: 1,
              letterSpacing: "-0.025em",
              margin: "0 0 48px",
              display: "flex",
              alignItems: "baseline",
              gap: 14,
            }}>
              <em style={{
                fontFamily: "var(--font-display-en)",
                fontStyle: "italic",
                fontWeight: 300,
                color: C.violet,
                letterSpacing: "-0.005em",
              }}>
                A word
              </em>
              ממני
            </h2>

            {/* body paragraphs */}
            {[
              <>התרגלנו לקצב אחר. בריפים קצרים. קמפיינים מהירים. שורות תחתונות.{" "}<em style={{ fontFamily: "inherit", color: C.violet, fontStyle: "normal" }}>תוצאות.</em></>,
              <>אני מגיעה מעולם אחר. עשור פלוס בעיתונות ובדיגיטל לימד אותי שלכל אחד יש סיפור, רק שלפעמים צריך לחפור עמוק כדי להגיע{" "}<em style={{ fontFamily: "inherit", color: C.violet, fontStyle: "normal" }}>לג׳וס האמיתי.</em></>,
              <>אז אני מציעה שתעצרו רגע.</>,
              <>כדי לרוץ לטווח ארוך, צריך להבין מי אתם, מה הסופר פאוור שאתם מביאים לשולחן, ומה ייקח אתכם רחוק יותר מאלה שרצים במסלולים מקבילים.</>,
            ].map((para, i) => (
              <p key={i} style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: "clamp(20px,2vw,27px)",
                lineHeight: 1.5,
                letterSpacing: "-0.012em",
                margin: "0 0 22px",
                color: C.ink,
              }}>
                {para}
              </p>
            ))}

            {/* thesis — bordered */}
            <p style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(20px,2vw,27px)",
              lineHeight: 1.5,
              letterSpacing: "-0.012em",
              borderTop: `1px solid ${C.line2}`,
              borderBottom: `1px solid ${C.line2}`,
              padding: "28px 0",
              margin: "32px 0 48px",
              color: C.ink,
            }}>
              מותג בלי זהות הוא פשוט מוצר. ארגון בלי סיפור הוא רק עוד מקום.
            </p>

            {/* signature */}
            <div style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 400,
              color: C.violet,
              fontSize: 18,
              margin: "-16px 0 32px",
            }}>
              — אילונה
            </div>

            {/* cta-row */}
            <div style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "flex-end",
            }}>
              <p style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(22px,2.4vw,32px)",
                lineHeight: 1.22,
                letterSpacing: "-0.018em",
                margin: 0,
                maxWidth: "24ch",
              }}>
                רוצים לבנות מותג{" "}
                <em style={{ fontStyle: "normal", color: C.violet, fontWeight: 400 }}>שאי אפשר להעתיק?</em>
              </p>
              <CtaButton href="mailto:abramsonilona@gmail.com" acid>שלחו לי הודעה</CtaButton>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══ PORTFOLIO BENTO ═══════════════════════════════════════════ */}
      <section id="work" style={{ padding: "128px 0 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 56px" }}>

          {/* work-head */}
          <ScrollReveal>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              paddingBottom: 32,
              marginBottom: 24,
              borderBottom: `1px solid ${C.line}`,
            }}>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(40px,4.6vw,64px)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
                margin: 0,
              }}>
                <em style={{
                  fontFamily: "var(--font-display-en)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: C.violet,
                  marginLeft: 14,
                }}>
                  selected.
                </em>
                {" "}פרויקטים
              </h2>
              <div style={{
                fontFamily: "var(--font-body-en)",
                fontSize: 13,
                color: C.ink3,
                fontWeight: 300,
                letterSpacing: "0.03em",
              }}>
                2019 — 2025 · 14 brands
              </div>
            </div>
          </ScrollReveal>

          {/* bento grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: 290,
            gridAutoFlow: "dense",
            gap: 14,
          }}>
            {tiles.map(tile => (
              <BentoTile key={tile.id} tile={tile} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════ */}
      <section style={{ padding: "0 0 128px" }}>
        <ScrollReveal>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 56px" }}>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(36px,4vw,56px)",
              letterSpacing: "-0.022em",
              margin: "0 0 36px",
            }}>
              <em style={{
                fontFamily: "var(--font-display-en)",
                fontStyle: "italic",
                fontWeight: 300,
                color: C.violet,
                marginLeft: 12,
              }}>
                what
              </em>
              {" "}אני עושה
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: `1px solid ${C.ink}`,
            }}>
              {services.map((s, i) => (
                <div key={s.n} style={{
                  padding: 28,
                  borderBottom: `1px solid ${C.line}`,
                  borderRight: (i + 1) % 4 !== 0 ? `1px solid ${C.line}` : undefined,
                }}>
                  <div style={{ fontFamily: "var(--font-body-en)", fontSize: 11, color: C.ink3, letterSpacing: "0.1em", fontWeight: 300 }}>{s.n}</div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.015em" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: C.ink2, margin: "8px 0 0", lineHeight: 1.5 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══ ABOUT TEASER ══════════════════════════════════════════════ */}
      <section id="about" style={{
        padding: "128px 0",
        background: C.cream,
        borderTop: `1px solid ${C.line}`,
      }}>
        <ScrollReveal>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: 72,
            alignItems: "start",
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 56px",
          }}>
            {/* Portrait placeholder */}
            <div style={{
              aspectRatio: "4 / 5",
              background: C.lav,
              display: "flex",
              alignItems: "flex-end",
              padding: 18,
              fontSize: 11,
              color: C.ink3,
              letterSpacing: "0.08em",
              fontFamily: "var(--font-body-en)",
              fontWeight: 300,
            }}>
              פורטרט · להחלפה בתמונה אמיתית
            </div>

            {/* Body */}
            <div>
              <div style={{
                fontFamily: "var(--font-display-en)",
                fontStyle: "italic",
                fontWeight: 300,
                color: C.violet,
                fontSize: 17,
                marginBottom: 18,
              }}>
                about
              </div>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(40px,4.8vw,72px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                margin: "0 0 28px",
                color: C.ink,
              }}>
                אודות.
              </h2>
              <p style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: C.ink2,
                margin: 0,
                maxWidth: "54ch",
                fontStyle: "italic",
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
              }}>
                [ פסקה קצרה תיכנס כאן — אילונה תכתוב בעצמה. ]
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
