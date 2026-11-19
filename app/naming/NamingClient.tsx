"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectFooter from "@/components/layout/ProjectFooter";
import { useIsMobile } from "@/hooks/useIsMobile";

// ─── Design tokens (matches project pages) ────────────────────────
const C = {
  ink:    "#0a1a0d",
  ink2:   "#4a544c",
  ink3:   "#87908a",
  cream:  "#fcf7f4",
  lilac:  "#e8d4ff",
  line:   "#e7e1d8",
  violet: "#a173ea",
  lime:   "#e0ff5c",
};

const HE = "var(--font-heading)";
const EN = "var(--font-body-en)";

// ─── Shared spacing helpers ────────────────────────────────────────
const hPad = (m: boolean) => m ? 20 : 108;
const CASE_GAP = (m: boolean) => m ? 80 : 128;
const SECTION_GAP = (m: boolean) => m ? 48 : 80;

// ─── Inline video with autoplay + play/pause overlay ──────────────
function GalleryVideo({ src, style }: { src: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div onClick={toggle} style={{ position: "relative", overflow: "hidden", cursor: "pointer", ...style }}>
      <video
        ref={ref}
        autoPlay muted loop playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {playing
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#111"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="#111" style={{ marginRight: -3 }}><polygon points="5,3 19,12 5,21"/></svg>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Shared case layout ────────────────────────────────────────────
interface CaseProps {
  number: string;
  title: string;
  titleEn?: boolean;
  category: string;
  heading: string;
  paragraphs: string[];
  credit?: string;
  creditLabel?: string;
  isMobile: boolean;
  children: React.ReactNode; // gallery
}

function CaseSection({ number, title, titleEn = false, category, heading, paragraphs, credit, creditLabel, isMobile, children }: CaseProps) {
  const pad = hPad(isMobile);
  return (
    <div>
      {/* Title block */}
      <section style={{ padding: isMobile ? `0 ${pad}px 0` : `0 ${pad}px` }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "right" }}
        >
          <p style={{ fontFamily: HE, fontWeight: 400, fontSize: 12, color: C.ink3, margin: "0 0 10px", letterSpacing: "0.08em" }}>
            {number}
          </p>
          <h2 style={{
            fontFamily: titleEn ? EN : HE,
            fontWeight: titleEn ? 300 : 700,
            fontSize: isMobile ? "clamp(32px,9vw,52px)" : "clamp(44px,5.5vw,72px)",
            lineHeight: 1.05,
            letterSpacing: titleEn ? "-0.02em" : "-0.015em",
            color: C.ink,
            margin: "0 0 10px",
          }}>
            {title}
          </h2>
          <p style={{ fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 12 : 14, color: C.ink3, margin: 0 }}>
            {category}
          </p>
        </motion.div>
      </section>

      {/* Text block */}
      <section style={{ padding: isMobile ? `32px ${pad}px ${SECTION_GAP(isMobile)}px` : `48px ${pad}px ${SECTION_GAP(isMobile)}px` }}>
        <div style={{ textAlign: "right", maxWidth: 1130 }}>
          <h3 style={{
            fontFamily: HE,
            fontWeight: 700,
            fontSize: isMobile ? 17 : "clamp(18px,1.4vw,22px)",
            lineHeight: 1.3,
            letterSpacing: "-0.015em",
            color: C.ink,
            margin: "0 0 20px",
          }}>
            {heading}
          </h3>
          {paragraphs.map((p, i) => (
            <p key={i} style={{
              fontFamily: HE,
              fontWeight: 400,
              fontSize: isMobile ? 15 : 16,
              lineHeight: 1.85,
              color: C.ink2,
              margin: "0 0 14px",
            }}>
              {p}
            </p>
          ))}
          {credit && (
            <div style={{ marginTop: 24, borderTop: `1px solid ${C.line}`, paddingTop: 20 }}>
              <p style={{ fontFamily: HE, fontWeight: 700, fontSize: 13, color: C.ink, margin: "0 0 5px" }}>
                {creditLabel ?? "מיתוג ועיצוב"}
              </p>
              <span style={{ fontFamily: EN, fontWeight: 300, fontSize: 14, color: C.ink3 }}>
                {credit}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {children}
    </div>
  );
}

// ─── Case divider ──────────────────────────────────────────────────
function CaseDivider({ isMobile }: { isMobile: boolean }) {
  const gap = CASE_GAP(isMobile);
  return <div style={{ height: gap }} />;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 1 — Hero
// ═══════════════════════════════════════════════════════════════════
function HeroSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section style={{
      background: C.lilac,
      marginTop: isMobile ? 47 : 53,
      minHeight: isMobile ? "100svh" : "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "60px 24px" : "80px 56px",
      textAlign: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 24 : 32 }}
      >
        {/* Logo */}
        <img
          src="/logo.png.png"
          alt="Ilona Abramson"
          style={{
            height: isMobile ? 28 : 40,
            width: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />

        {/* Tagline */}
        <p style={{
          fontFamily: HE,
          fontWeight: 400,
          fontSize: isMobile ? 15 : 18,
          color: C.ink2,
          margin: 0,
          letterSpacing: "0.01em",
        }}>
          אסטרטגיית מותג ושפה
        </p>

        {/* Divider */}
        <div style={{ width: 1, height: isMobile ? 40 : 56, background: C.ink, opacity: 0.2 }} />

        {/* NAMING */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <p style={{
            fontFamily: EN,
            fontWeight: 300,
            fontSize: isMobile ? "clamp(52px, 18vw, 80px)" : "clamp(80px, 10vw, 140px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: C.ink,
            margin: 0,
          }}>
            NAMING
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2 — Process
// ═══════════════════════════════════════════════════════════════════
const PROCESS_STEPS = [
  {
    num: "01",
    title: "מגדירים את ה-DNA של המותג",
    body: "מתחילים בשאלון אפיון ולאחריו שיחת עומק, שבהם לומדים להכיר את המותג, קהל היעד והרגשות שהוא מבקש לעורר. יחד בוחרים שלושה ערכים מרכזיים שיכולים להוביל את השם החדש.",
  },
  {
    num: "02",
    title: "חוקרים את השוק והקטגוריה",
    body: "בוחנים שמות של מותגים בקטגוריה, מזהים מגמות, טרנדים וכיוונים מובילים בשוק המקומי והבינלאומי.",
  },
  {
    num: "03",
    title: "קריאייטיב טיים",
    body: "מתרגמים את ערכי המותג לרעיונות, אסוציאציות ושמות אפשריים.",
  },
  {
    num: "04",
    title: "פרזנטציית השמות",
    body: "חמשת השמות הטובים ביותר עולים לגמר, כשמאחורי כל אחד עומד רציונל אסטרטגי המבוסס על אחד מערכי המותג. בשלב זה מתבצעת גם בדיקה ראשונית של זמינות השמות בקטגוריה.",
  },
  {
    num: "05",
    title: "בודקים היתכנות לדומיין",
    body: "בודקים אילו כתובות דומיין זמינות עבור השם הנבחר.",
  },
  {
    num: "06",
    title: "טאגליין",
    body: "מפתחים שלוש הצעות לשורת מיצוב שתבטא את ההבטחה השיווקית והמסר המרכזי של המותג.",
  },
  {
    num: "07",
    title: "יש לנו שם",
    body: "מסיימים את התהליך עם שם וטאגליין שמבטאים את הזהות, האישיות וההבטחה של המותג.",
  },
];

function ProcessSection({ isMobile }: { isMobile: boolean }) {
  const pad = hPad(isMobile);
  return (
    <section style={{
      padding: isMobile
        ? `${SECTION_GAP(isMobile)}px ${pad}px ${SECTION_GAP(isMobile)}px`
        : `${SECTION_GAP(isMobile)}px ${pad}px ${SECTION_GAP(isMobile)}px`,
      background: C.cream,
    }}>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: HE,
          fontWeight: 700,
          fontSize: isMobile ? 20 : "clamp(22px, 2.2vw, 30px)",
          color: C.ink,
          textAlign: "right",
          margin: "0 0 48px",
          letterSpacing: "-0.015em",
        }}
      >
        תהליך הניימינג
      </motion.h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: isMobile ? "32px 0" : "48px 64px",
        maxWidth: 1280,
      }}>
        {PROCESS_STEPS.map(({ num, title, body }, i) => (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "right", borderTop: `1px solid ${C.line}`, paddingTop: 20 }}
          >
            <p style={{ fontFamily: EN, fontWeight: 300, fontSize: 12, color: C.ink3, margin: "0 0 10px", direction: "ltr", textAlign: "right" }}>
              {num}
            </p>
            <h3 style={{
              fontFamily: HE,
              fontWeight: 700,
              fontSize: isMobile ? 16 : 17,
              color: C.ink,
              margin: "0 0 10px",
              lineHeight: 1.3,
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: HE,
              fontWeight: 400,
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.75,
              color: C.ink2,
              margin: 0,
            }}>
              {body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CASE #1 — MYJOOL
// ═══════════════════════════════════════════════════════════════════
const MYJOOL_IMAGES = [
  "/naming/Myjool/511197033_10163047046733485_4456798310964133825_n.jpg",
  "/naming/Myjool/512064747_10162661104254920_2510028380173325386_n.jpg",
  "/naming/Myjool/512587925_10162661104059920_4341441496912268612_n.jpg",
  "/naming/Myjool/513933162_10162661104264920_5119242861589211427_n.jpg",
  "/naming/Myjool/WhatsApp Image 2023-02-24 at 09.27.57 (1).jpeg",
  "/naming/Myjool/WhatsApp Image 2023-02-24 at 09.27.57 (3).jpeg",
  "/naming/Myjool/WhatsApp Image 2023-02-24 at 09.27.57 (4).jpeg",
];

const MYJOOL_PARAGRAPHS = [
  "בשיחה הראשונה שלי עם ״הדקלאים״, קואופרטיב תמרים ישראלי שעושה חיל בעולם, חשבתי לעצמי: למה תמרים צריכים ניימינג?!",
  "אבל ככל שהשיחה התקדמה, הבנתי שהשאיפה שלהם גדולה הרבה יותר מבחירת שם. הם רצו להיכנס לשוק האירופי עם מותג חדש של תמרי מג'הול מובחרים, ולשנות את האופן שבו אנשים תופסים את הפרי הזה.",
  "עם כל הכבוד לתמר, הוא לא בדיוק הפרי הכי טרנדי בסופר. בישראל הוא עדיין מזוהה לא מעט עם המזווה של סבתא, ובאירופה הוא בכלל לא היה חלק טבעי מתפריט החטיפים היומיומי.",
  "האתגר היה להפוך מוצר מסורתי למשהו צעיר, עכשווי ונחשק, כזה שיכול לתפוס מקום על המדף לצד חטיפי הבריאות המוכרים.",
  "הבנתי שכדי לגרום לקהל חדש להתאהב בתמרים, צריך קודם כול לשנות את הסיפור שלהם. במקום להציג את התמר כעוד פרי יבש, בחרנו להבליט את מה שיש בו: מתיקות טבעית, אנרגיה זמינה ויכולת להשתלב כמעט בכל רגע ביום.",
  "חיפשתי שם שיצליח לקחת את המג'הול המוכר לעולם חדש, עם אישיות צעירה, בינלאומית ובעיקר כזאת שקל להתחבר אליה.",
  "משחק מילים קטן שהפך לשינוי גדול בתפיסה. החיבור בין MY ל-Medjool הפך את התמר למשהו אישי, משהו שהוא חלק מהיום שלי, מההרגלים שלי ומהרגעים הקטנים שבהם אני צריכה קצת אנרגיה.",
  "ה-MY הפך גם לעיקרון שמוביל את השפה החזותית: דמויות מאוירות שמחבקות את התמר, מתאמנות איתו, נשענות עליו ופשוט משלבות אותו בטבעיות ביומיום שלהן.",
  "את הסיפור השלים הטאגליין Brings out your best, שמחבר בין האנרגיה הטבעית של התמר לבין התחושה שהוא מאפשר לנו להביא לידי ביטוי את הגרסה הטובה ביותר של עצמנו.",
  "וככה, מהפרי של סבתא נולד מותג צעיר וצבעוני, שהגיע גם למדפי Waitrose בלונדון.",
];

function MyjoolGallery({ isMobile }: { isMobile: boolean }) {
  const pad = hPad(isMobile);
  const gap = 12;
  const rows: string[][] = [];
  for (let i = 0; i < MYJOOL_IMAGES.length; i += 2) {
    rows.push(MYJOOL_IMAGES.slice(i, i + 2));
  }

  return (
    <section style={{ padding: isMobile ? `0 0 0` : `0 ${pad}px 0` }}>
      <div style={{ display: "flex", flexDirection: "column", gap }}>
        {isMobile ? (
          MYJOOL_IMAGES.map((src, i) => (
            <img key={i} src={src} alt={`MYJOOL ${i + 1}`} style={{ width: "100%", display: "block", height: "auto" }} />
          ))
        ) : (
          rows.map((row, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: row.length === 2 ? "1fr 1fr" : "1fr",
              gap,
            }}>
              {row.map((src, j) => (
                <img key={j} src={src} alt={`MYJOOL ${i * 2 + j + 1}`} style={{ width: "100%", display: "block", height: "auto" }} />
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CASE #2 — Déesse
// ═══════════════════════════════════════════════════════════════════
const DEESSE_PARAGRAPHS = [
  "מורן יהב גדלה לתוך עולם היהלומים. כנכדה לסב יהלומן, האהבה לתכשיטים מלווה אותה עוד מילדות, והיום היא מעצבת תכשיטי יוקרה מזהב, יהלומים ואבני חן, עם סגנון אישי שלא מנסה לרדוף אחרי טרנדים.",
  "כשהיא פנתה אליי, מותג התכשיטים שלה, Ne Pas Toucher, עמד בפני ריברנדינג. המטרה הייתה ליצור זהות חדשה שתשדר יוקרה בינלאומית, תפנה לנשים שמעריכות קלאסיקות שנשארות לנצח, ותוכל ללוות את המותג גם בהתרחבות שלו לקטגוריות נוספות, בהן בישום.",
  "נשי, עוצמתי וארטיזנלי. אלה שלושת המאפיינים שהובילו אותי בחיפוש אחר השם החדש.",
  "מהשיחות עם מורן למדתי כמה היא מחוברת לאסתטיקה ולתרבות הצרפתית, והתת מודע שלי כנראה כבר ידע לאן הוא רוצה לקחת אותי.",
  "היה לי ברור שהשם צריך לשדר נשיות, אלגנטיות ועוצמה, בו זמנית. לא משהו מתוק או עדין מדי, אלא שם עם נוכחות, כזה שנשמע כאילו הוא שייך לבית תכשיטים בינלאומי.",
  "למרות שאני לא דוברת צרפתית, התחלתי לחקור מילים וביטויים בשפה, לשחק עם צלילים ומשמעויות ולחפש את החיבור המדויק בין הסאונד לסיפור של המותג.",
  "ואז נתקלתי במילה שהרגישה כאילו היא חיכתה לי שם כל הזמן.",
  "בצרפתית, Déesse פירושו ״אלה״. שם שמצליח להחזיק בדיוק את הניגוד שחיפשתי: הוא נשי ורך, אבל גם מלא עוצמה ונוכחות. יש בו משהו אלגנטי וכמעט מלכותי, ואפילו האופן שבו האותיות שלו נראות יחד הרגיש לי נכון.",
  "אחרי שהשם התיישב במקומו, נולד גם הטאגליין: Timeless Fine Jewelry. כי התכשיטים של מורן לא נועדו להיות הטרנד הבא. הם נועדו להישאר. תכשיטי זהב ויהלומים שילוו אותך שנים, ואולי אפילו יעברו לדור הבא.",
];

function DeesseGallery({ isMobile }: { isMobile: boolean }) {
  const pad = hPad(isMobile);
  const gap = 24;

  const img1 = "/naming/deesse/Deesse-01.png";
  const vid2 = "/naming/deesse/Deesse-02.mp4";
  const img3 = "/naming/deesse/Deesse-03.png";
  const vid4 = "/naming/deesse/Deesse-04.mp4";
  const img5 = "/naming/deesse/Deesse-05.png";

  return (
    <section style={{ padding: isMobile ? `0 0 0` : `0 ${pad}px 0` }}>
      <div style={{ display: "flex", flexDirection: "column", gap }}>

        {/* Row 1: img1 (62%) + vid2 (38%) — RTL: first child = right */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            <img src={img1} alt="Déesse necklace" style={{ width: "100%", display: "block", height: "auto" }} />
            <GalleryVideo src={vid2} />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "62fr 38fr", gap, alignItems: "stretch" }}>
            <img src={img1} alt="Déesse necklace" style={{ width: "100%", display: "block", height: "auto" }} />
            <GalleryVideo src={vid2} />
          </div>
        )}

        {/* Row 2: full-width */}
        <img src={img3} alt="Déesse ring with ribbon" style={{ width: "100%", display: "block", height: "auto" }} />

        {/* Row 3: vid4 (38%) + img5 (62%) — RTL: first child = right */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            <img src={img5} alt="Déesse ring on pattern" style={{ width: "100%", display: "block", height: "auto" }} />
            <GalleryVideo src={vid4} />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "38fr 62fr", gap, alignItems: "stretch" }}>
            <GalleryVideo src={vid4} />
            <img src={img5} alt="Déesse ring on pattern" style={{ width: "100%", display: "block", height: "auto" }} />
          </div>
        )}

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CASE #3 — Rêverie
// ═══════════════════════════════════════════════════════════════════
const REVERIE_PARAGRAPHS = [
  "ריקי דדיה היא לא עוד שוקולטיירית. הפרלינים שלה נראים כמו יצירות אמנות קטנות, עם צבעוניות נועזת, צורות וטקסטורות מיוחדות, והכול בעבודת יד מחומרי גלם מובחרים.",
  "אבל בזמן שהשוקולד שלה כבר שידר פרימיום בינלאומי, השם שליווה את המותג, ״ריקולטה״, כבר לא הרגיש לה נכון. ריקי רצתה שם חדש, כזה שיצליח לבטא את היצירתיות, האיכות והאישיות שלה, וגם יוכל לגדול יחד עם המותג.",
  "בשיחות עם ריקי גיליתי עד כמה תרבות השוקולד האירופית נוכחת בעשייה שלה. את המקצוע היא למדה בצרפת ובבלגיה, וההשפעות האלה מורגשות בכל פרלין שהיא יוצרת.",
  "היה לי ברור שהשם צריך לשדר משהו מהעולם הזה. להיות אלגנטי, בינלאומי, עם ניחוח צרפתי. אבל לא רציתי להסתפק בשם שפשוט נשמע יוקרתי.",
  "כי בסופו של דבר, מה אנחנו באמת מחפשים כשאנחנו מתפנקים בשוקולד טוב? את הרגע הקטן הזה שבו הכול נעצר, ואפשר להתנתק לכמה שניות מהיומיום ולהתמסר להנאה.",
  "בצרפתית, Rêverie פירושו חלום בהקיץ. וככה נולד שם שמחבר בין ההשראה האירופית של ריקי לבין החוויה שהיא יוצרת. כזה שלא מתאר את השוקולד עצמו, אלא את התחושה שהוא משאיר אחריו.",
  "כי לפעמים כל מה שצריך כדי לברוח קצת מהמציאות זה פרלין אחד טוב.",
];

function ReverieGallery({ isMobile }: { isMobile: boolean }) {
  const pad = hPad(isMobile);
  const gap = 12;
  const afterImages = [
    "/naming/reverie/Reverie-01.jpg",
    "/naming/reverie/Reverie-02.jpg",
    "/naming/reverie/Reverie-03.jpg",
    "/naming/reverie/Reverie-04.jpg",
    "/naming/reverie/Reverie-05.jpg",
    "/naming/reverie/Reverie-06.jpg",
  ];

  return (
    <section style={{ padding: isMobile ? `0 0 0` : `0 ${pad}px 0` }}>
      <div style={{ display: "flex", flexDirection: "column", gap }}>

        {/* Before / After pair */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {/* לפני — top on mobile */}
            <div style={{ position: "relative" }}>
              <img
                src="/naming/reverie/before picture.jpg"
                alt="לפני — ריקולטה"
                style={{ width: "100%", display: "block", height: "auto" }}
              />
              <div style={{
                position: "absolute", bottom: 10, right: 12,
                fontFamily: HE, fontWeight: 700, fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                background: "rgba(0,0,0,0.35)", padding: "3px 9px", borderRadius: 4,
              }}>
                לפני
              </div>
            </div>
            {/* אחרי — below on mobile */}
            <div style={{ position: "relative" }}>
              <img
                src="/naming/reverie/Reverie-01.jpg"
                alt="אחרי — Rêverie"
                style={{ width: "100%", display: "block", height: "auto" }}
              />
              <div style={{
                position: "absolute", bottom: 10, right: 12,
                fontFamily: HE, fontWeight: 700, fontSize: 12,
                color: "rgba(255,255,255,0.9)",
                background: "rgba(0,0,0,0.35)", padding: "3px 9px", borderRadius: 4,
              }}>
                אחרי
              </div>
            </div>
          </div>
        ) : (
          /* Desktop: לפני right, אחרי left (RTL) */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
            <div style={{ position: "relative" }}>
              <img
                src="/naming/reverie/before picture.jpg"
                alt="לפני — ריקולטה"
                style={{ width: "100%", display: "block", height: "auto" }}
              />
              <div style={{
                position: "absolute", bottom: 14, right: 16,
                fontFamily: HE, fontWeight: 700, fontSize: 13,
                color: "rgba(255,255,255,0.9)",
                background: "rgba(0,0,0,0.35)", padding: "4px 12px", borderRadius: 4,
              }}>
                לפני
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <img
                src="/naming/reverie/Reverie-01.jpg"
                alt="אחרי — Rêverie"
                style={{ width: "100%", display: "block", height: "auto" }}
              />
              <div style={{
                position: "absolute", bottom: 14, right: 16,
                fontFamily: HE, fontWeight: 700, fontSize: 13,
                color: "rgba(255,255,255,0.9)",
                background: "rgba(0,0,0,0.35)", padding: "4px 12px", borderRadius: 4,
              }}>
                אחרי
              </div>
            </div>
          </div>
        )}

        {/* Additional Reverie images — 2-column grid */}
        {isMobile ? (
          afterImages.slice(1).map((src, i) => (
            <img key={i} src={src} alt={`Rêverie ${i + 2}`} style={{ width: "100%", display: "block", height: "auto" }} />
          ))
        ) : (
          [afterImages.slice(1, 3), afterImages.slice(3, 5), afterImages.slice(5)].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: row.length === 2 ? "1fr 1fr" : "1fr", gap }}>
              {row.map((src, j) => (
                <img key={j} src={src} alt={`Rêverie ${i * 2 + j + 2}`} style={{ width: "100%", display: "block", height: "auto" }} />
              ))}
            </div>
          ))
        )}

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ═══════════════════════════════════════════════════════════════════
const ABOUT_PARAGRAPHS = [
  "את הדרך המקצועית שלי התחלתי בעיתונות. שם למדתי לקרוא ערימה של חומר ולזהות את הפרט הקטן ששווה להתעכב עליו, לשאול עוד שאלה ולפעמים לגלות שהתשובה משנה את כל הסיפור. גם היום, לפני שאני חושבת איך לנסח משהו, אני רוצה להבין מה באמת יש פה להגיד.",
  "מאז 2017 אני מלווה מותגים בתהליכי מחקר, בידול, מיצוב ובניית זהות מילולית. אני אוהבת להכיר את האנשים שמאחורי המותג, להבין למה הם בחרו לעשות דברים בדרך שלהם ולגלות מה מכל זה יגרום למישהו לבחור דווקא בהם.",
  "תהליכי ניימינג הם הדובדבן שבטופ — אחרי כל השיחות, המחקר וההחלטות על מה המותג הזה רוצה להיות, מגיע הרגע שבו צריך לתת לו שם. מילה אחת או שתיים, שאנשים יראו על האריזה, יחפשו בגוגל ויגידו בקול כשהם יספרו עליו למישהו אחר.",
];

const ABOUT_CLOSING = "שם הוא המילה הראשונה בסיפור של המותג. תוודאו שהיא מספרת אותו כמו שצריך.";

function AboutSection({ isMobile }: { isMobile: boolean }) {
  const pad = hPad(isMobile);
  return (
    <section style={{ padding: isMobile ? `${CASE_GAP(isMobile)}px ${pad}px 0` : `${CASE_GAP(isMobile)}px ${pad}px 0` }}>
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: isMobile ? 48 : 72 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Layout: text right, photo area left (desktop) or stacked (mobile) */}
          <div style={{
            display: isMobile ? "flex" : "grid",
            flexDirection: isMobile ? "column" : undefined,
            gridTemplateColumns: isMobile ? undefined : "1fr 400px",
            gap: isMobile ? 32 : 64,
            alignItems: "flex-start",
          }}>
            {/* Text */}
            <div style={{ textAlign: "right" }}>
              <h2 style={{
                fontFamily: HE,
                fontWeight: 700,
                fontSize: isMobile ? 20 : "clamp(22px, 2vw, 28px)",
                color: C.ink,
                margin: "0 0 8px",
                letterSpacing: "-0.015em",
              }}>
                נעים מאוד
              </h2>
              <p style={{ fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 13 : 14, color: C.ink3, margin: "0 0 32px" }}>
                אילונה אברמסון, אסטרטגית מותג וזהות מילולית
              </p>

              {ABOUT_PARAGRAPHS.map((para, i) => (
                <p key={i} style={{
                  fontFamily: HE,
                  fontWeight: 400,
                  fontSize: isMobile ? 15 : 16,
                  lineHeight: 1.85,
                  color: C.ink2,
                  margin: "0 0 14px",
                }}>
                  {para}
                </p>
              ))}

              <p style={{
                fontFamily: HE,
                fontWeight: 700,
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.65,
                color: C.ink,
                margin: "24px 0 0",
              }}>
                {ABOUT_CLOSING}
              </p>
            </div>

            {/* Photo placeholder — replace src when photo is ready */}
            <div style={{
              width: "100%",
              aspectRatio: "3/4",
              background: C.lilac,
              borderRadius: 4,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <img src="/naming/about-photo.jpg" alt="אילונה אברמסון" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// THANK YOU SECTION
// ═══════════════════════════════════════════════════════════════════
function ThankYouSection({ isMobile }: { isMobile: boolean }) {
  const pad = hPad(isMobile);
  const contacts = [
    {
      label: "LinkedIn",
      display: "LinkedIn",
      href: "https://www.linkedin.com/in/ilona-sammy-abramson/",
    },
    {
      label: "טלפון",
      display: "053-277-7569",
      href: "tel:+972532777569",
    },
    {
      label: "מייל",
      display: "abramsonilona@gmail.com",
      href: "mailto:abramsonilona@gmail.com",
    },
  ];

  return (
    <section style={{
      padding: isMobile
        ? `${CASE_GAP(isMobile)}px ${pad}px ${isMobile ? 64 : 96}px`
        : `${CASE_GAP(isMobile)}px ${pad}px 96px`,
      textAlign: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 style={{
          fontFamily: EN,
          fontWeight: 300,
          fontSize: isMobile ? "clamp(40px, 14vw, 70px)" : "clamp(60px, 8vw, 110px)",
          letterSpacing: "-0.02em",
          color: C.ink,
          margin: "0 0 48px",
          lineHeight: 1,
        }}>
          THANK YOU
        </h2>

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 20 : 48,
          justifyContent: "center",
          alignItems: "center",
        }}>
          {contacts.map(({ label, display, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                fontFamily: href.startsWith("http") || href.startsWith("mailto") ? EN : HE,
                fontWeight: 300,
                fontSize: isMobile ? 15 : 16,
                color: C.ink,
                textDecoration: "none",
                borderBottom: `1px solid ${C.line}`,
                paddingBottom: 3,
                letterSpacing: href.startsWith("tel") ? "0.03em" : "0",
                direction: href.startsWith("tel") ? "ltr" : "inherit",
                display: "inline-block",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = C.violet;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = C.violet;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = C.ink;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = C.line;
              }}
            >
              {display}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
export default function NamingClient() {
  const isMobile = useIsMobile();
  const pad = hPad(isMobile);
  const caseGap = CASE_GAP(isMobile);

  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl" }}>

      {/* 1. Hero */}
      <HeroSection isMobile={isMobile} />

      {/* 2. Process */}
      <ProcessSection isMobile={isMobile} />

      {/* Case separator */}
      <div style={{ height: caseGap }} />

      {/* 3. MYJOOL */}
      <div style={{ maxWidth: 1280 + pad * 2, margin: "0 auto" }}>
        <CaseSection
          number="#1"
          title="MYJOOL"
          titleEn
          category="ניימינג | טאגליין"
          heading="מהמזווה של סבתא למדפי Waitrose בלונדון"
          paragraphs={MYJOOL_PARAGRAPHS}
          isMobile={isMobile}
        >
          <MyjoolGallery isMobile={isMobile} />
        </CaseSection>
      </div>

      <CaseDivider isMobile={isMobile} />

      {/* 4. Déesse */}
      <div style={{ maxWidth: 1280 + pad * 2, margin: "0 auto" }}>
        <CaseSection
          number="#2"
          title="Déesse"
          titleEn
          category="ניימינג | טאגליין"
          heading="השם שברא את עצמו"
          paragraphs={DEESSE_PARAGRAPHS}
          credit="Hadar Mizrahi"
          isMobile={isMobile}
        >
          <DeesseGallery isMobile={isMobile} />
        </CaseSection>
      </div>

      <CaseDivider isMobile={isMobile} />

      {/* 5. Rêverie */}
      <div style={{ maxWidth: 1280 + pad * 2, margin: "0 auto" }}>
        <CaseSection
          number="#3"
          title="Rêverie"
          titleEn
          category="ניימינג | טאגליין"
          heading="לגרום לכם לחלום על השוקולד הזה"
          paragraphs={REVERIE_PARAGRAPHS}
          credit="Hadar Mizrahi"
          isMobile={isMobile}
        >
          <ReverieGallery isMobile={isMobile} />
        </CaseSection>
      </div>

      {/* 6. About */}
      <div style={{ maxWidth: 1280 + pad * 2, margin: "0 auto" }}>
        <AboutSection isMobile={isMobile} />
      </div>

      {/* 7. Thank you */}
      <ThankYouSection isMobile={isMobile} />

      {/* Footer */}
      <ProjectFooter />
    </div>
  );
}
