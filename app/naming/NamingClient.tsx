"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ProjectFooter from "@/components/layout/ProjectFooter";
import { useIsMobile } from "@/hooks/useIsMobile";

// ─── Design tokens (Naming v2) ─────────────────────────────────────
const C = {
  ink:    "#0a1a0d",
  forest: "#002607",
  body:   "#3d463f",
  muted:  "#5f675f", // ≥4.5:1 on cream
  cream:  "#fcf7f4",
  lilac:  "#e8d4ff",
  rule:   "#ddd6cd", // step rules
  caseRule: "#cfc7bd", // between cases
  media:  "#efe8e1",
  violet: "#a173ea",
};

const HE = "var(--font-heading)";
const EN = "var(--font-body-en)";
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Spacing ───────────────────────────────────────────────────────
const SIDE = "clamp(20px, 5.625vw, 108px)";
const MAX_W = 1920;
const galleryGap = (m: boolean) => (m ? 10 : 16);
const caseSpace = (m: boolean) => (m ? "56px" : "clamp(72px, 7.5vw, 144px)");
const sectionHeading = (m: boolean, en = false): React.CSSProperties => ({
  margin: 0,
  fontFamily: en ? EN : HE,
  fontWeight: en ? 300 : 400,
  fontSize: m ? (en ? 40 : 36) : "clamp(36px, 3.9vw, 72px)",
  lineHeight: 1.05,
  letterSpacing: en ? "-0.03em" : "-0.02em",
  color: C.ink,
  textAlign: "right",
});

function Wrap({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ maxWidth: MAX_W, margin: "0 auto", paddingInline: SIDE, boxSizing: "border-box", ...style }}>{children}</div>;
}

// ─── Media cells: equal-height rows, no cropping ───────────────────
// Each cell grows in proportion to its aspect ratio (w/h), so every
// cell in a row ends up the same height and keeps its native ratio.
type Media =
  | { kind: "img"; src: string; alt: string; w: number; h: number }
  | { kind: "video"; src: string; poster: string; label: string; w: number; h: number };

function Cell({ item, fixedWidth }: { item: Media; fixedWidth?: string }) {
  const ratio = item.w / item.h;
  return (
    <div style={{
      position: "relative",
      minWidth: 0,
      overflow: "hidden",
      background: C.media,
      aspectRatio: `${item.w} / ${item.h}`,
      ...(fixedWidth ? { width: fixedWidth, flex: "none" } : { flex: `${ratio} 1 0` }),
    }}>
      {item.kind === "img" ? (
        <img
          src={item.src}
          alt={item.alt}
          width={item.w}
          height={item.h}
          loading="lazy"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <PosterVideo src={item.src} poster={item.poster} label={item.label} />
      )}
    </div>
  );
}

function MediaRow({ items, isMobile, twoUpOnMobile = false }: { items: Media[]; isMobile: boolean; twoUpOnMobile?: boolean }) {
  const gap = galleryGap(isMobile);
  if (isMobile && !twoUpOnMobile) {
    return <>{items.map((it, i) => <Cell key={i} item={it} fixedWidth="100%" />)}</>;
  }
  if (isMobile && twoUpOnMobile) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap }}>
        {items.map((it, i) => <Cell key={i} item={it} fixedWidth={`calc(50% - ${gap / 2}px)`} />)}
      </div>
    );
  }
  return <div style={{ display: "flex", gap }}>{items.map((it, i) => <Cell key={i} item={it} />)}</div>;
}

function Gallery({ isMobile, children }: { isMobile: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: isMobile ? 56 : "clamp(56px, 5.6vw, 104px)",
      display: "flex",
      flexDirection: "column",
      gap: galleryGap(isMobile),
    }}>
      {children}
    </div>
  );
}

// ─── Video: poster + centred play button, plays with sound on click ─
function PosterVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        aria-label={label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={`נגן ${label}`}
          style={{
            position: "absolute", inset: 0, margin: "auto",
            width: 64, height: 64, borderRadius: "50%",
            border: "1.5px solid #fff", background: "rgba(10,26,13,0.28)", color: "#fff",
            display: "grid", placeItems: "center", cursor: "pointer", padding: 0,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: -3 }}>
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </button>
      )}
    </>
  );
}

// ─── Before / after figure (label above, same row height) ───────────
function LabeledCell({ label, item, isMobile }: { label: string; item: Media; isMobile: boolean }) {
  return (
    <figure style={{
      margin: 0, minWidth: 0, display: "flex", flexDirection: "column", gap: 12,
      ...(isMobile ? { width: "100%" } : { flex: `${item.w / item.h} 1 0` }),
    }}>
      <figcaption style={{ fontFamily: HE, fontWeight: 700, fontSize: 15, lineHeight: 1, color: C.ink, textAlign: "right" }}>{label}</figcaption>
      <Cell item={item} fixedWidth="100%" />
    </figure>
  );
}

// ─── Shared case layout ────────────────────────────────────────────
interface CaseProps {
  id: string;
  number: string;
  title: string;
  lang: string;
  category: string;
  heading: string;
  paragraphs: string[];
  credit?: string;
  isMobile: boolean;
  children: React.ReactNode; // gallery
}

function CaseSection({ id, number, title, lang, category, heading, paragraphs, credit, isMobile, children }: CaseProps) {
  const p: React.CSSProperties = {
    fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 16 : 17, lineHeight: 1.75,
    color: C.body, margin: "0 0 1.05em",
  };
  return (
    <article aria-labelledby={id} style={{ paddingTop: isMobile ? 40 : "clamp(48px, 4.2vw, 80px)", textAlign: "right" }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <p style={{ fontFamily: EN, fontWeight: 300, fontSize: 16, lineHeight: 1, letterSpacing: "0.04em", color: C.muted, margin: "0 0 10px" }}>
          <span dir="ltr">{number}</span>
        </p>
        <h3 id={id} lang={lang} style={{
          fontFamily: EN, fontWeight: 300,
          fontSize: isMobile ? 34 : "clamp(34px, 3.2vw, 60px)",
          lineHeight: 1.02, letterSpacing: "-0.025em", color: C.ink, margin: 0,
        }}>
          {title}
        </h3>
        <p style={{ fontFamily: HE, fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: C.muted, margin: "12px 0 0" }}>
          {category}
        </p>
      </motion.div>

      <div style={{ maxWidth: 680, marginTop: isMobile ? 36 : "clamp(36px, 3vw, 52px)" }}>
        <h4 style={{ fontFamily: HE, fontWeight: 700, fontSize: 19, lineHeight: 1.4, color: C.ink, margin: "0 0 18px" }}>
          {heading}
        </h4>
        {paragraphs.map((t, i) => <p key={i} style={p}>{t}</p>)}
        {credit && (
          <p style={{ ...p, fontSize: 15, lineHeight: 1.6, margin: "32px 0 0" }}>
            <b style={{ display: "block", color: C.ink, fontWeight: 700 }}>מיתוג ועיצוב</b>
            <span lang="en">{credit}</span>
          </p>
        )}
      </div>

      {children}
    </article>
  );
}

function CaseRule({ isMobile }: { isMobile: boolean }) {
  return <hr style={{ margin: `${caseSpace(isMobile)} 0 0`, border: 0, borderTop: `1px solid ${C.caseRule}` }} />;
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT (unchanged copy)
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

const REVERIE_PARAGRAPHS = [
  "ריקי דדיה היא לא עוד שוקולטיירית. הפרלינים שלה נראים כמו יצירות אמנות קטנות, עם צבעוניות נועזת, צורות וטקסטורות מיוחדות, והכול בעבודת יד מחומרי גלם מובחרים.",
  "אבל בזמן שהשוקולד שלה כבר שידר פרימיום בינלאומי, השם שליווה את המותג, ״ריקולטה״, כבר לא הרגיש לה נכון. ריקי רצתה שם חדש, כזה שיצליח לבטא את היצירתיות, האיכות והאישיות שלה, וגם יוכל לגדול יחד עם המותג.",
  "בשיחות עם ריקי גיליתי עד כמה תרבות השוקולד האירופית נוכחת בעשייה שלה. את המקצוע היא למדה בצרפת ובבלגיה, וההשפעות האלה מורגשות בכל פרלין שהיא יוצרת.",
  "היה לי ברור שהשם צריך לשדר משהו מהעולם הזה. להיות אלגנטי, בינלאומי, עם ניחוח צרפתי. אבל לא רציתי להסתפק בשם שפשוט נשמע יוקרתי.",
  "כי בסופו של דבר, מה אנחנו באמת מחפשים כשאנחנו מתפנקים בשוקולד טוב? את הרגע הקטן הזה שבו הכול נעצר, ואפשר להתנתק לכמה שניות מהיומיום ולהתמסר להנאה.",
  "בצרפתית, Rêverie פירושו חלום בהקיץ. וככה נולד שם שמחבר בין ההשראה האירופית של ריקי לבין החוויה שהיא יוצרת. כזה שלא מתאר את השוקולד עצמו, אלא את התחושה שהוא משאיר אחריו.",
  "כי לפעמים כל מה שצריך כדי לברוח קצת מהמציאות זה פרלין אחד טוב.",
];

const ABOUT_PARAGRAPHS = [
  "את הדרך המקצועית שלי התחלתי בעיתונות. שם למדתי לקרוא ערימה של חומר ולזהות את הפרט הקטן ששווה להתעכב עליו, לשאול עוד שאלה ולפעמים לגלות שהתשובה משנה את כל הסיפור. גם היום, לפני שאני חושבת איך לנסח משהו, אני רוצה להבין מה באמת יש פה להגיד.",
  "מאז 2017 אני מלווה מותגים בתהליכי מחקר, בידול, מיצוב ובניית זהות מילולית. אני אוהבת להכיר את האנשים שמאחורי המותג, להבין למה הם בחרו לעשות דברים בדרך שלהם ולגלות מה מכל זה יגרום למישהו לבחור דווקא בהם.",
  "תהליכי ניימינג הם הדובדבן שבטופ — אחרי כל השיחות, המחקר וההחלטות על מה המותג הזה רוצה להיות, מגיע הרגע שבו צריך לתת לו שם. מילה אחת או שתיים, שאנשים יראו על האריזה, יחפשו בגוגל ויגידו בקול כשהם יספרו עליו למישהו אחר.",
];

const ABOUT_CLOSING = "שם הוא המילה הראשונה בסיפור של המותג. תוודאו שהיא מספרת אותו כמו שצריך.";

// ═══════════════════════════════════════════════════════════════════
// SECTION 1 — Lilac cover
// ═══════════════════════════════════════════════════════════════════
function HeroSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section aria-labelledby="naming-title" style={{ background: C.lilac, marginTop: isMobile ? 47 : 53 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          padding: isMobile ? "56px 40px 52px" : `clamp(64px, 6.5vw, 112px) ${SIDE}`,
        }}
      >
        {/* Logo + tagline as one unit — keep the file's ratio */}
        <img
          src="/naming/logo-tagline.svg"
          alt="Ilona Abramson — Brand & Verbal Strategist"
          width={566}
          height={317}
          style={{
            display: "block",
            width: isMobile ? "min(290px, 100%)" : "clamp(280px, 28vw, 500px)",
            height: "auto",
            aspectRatio: "565.95 / 317.13",
          }}
        />
        <h1 id="naming-title" lang="en" dir="ltr" style={{
          margin: isMobile ? "32px 0 0" : "clamp(36px, 3vw, 52px) 0 0",
          fontFamily: EN, fontWeight: 300,
          fontSize: isMobile ? 16 : "clamp(18px, 1.35vw, 24px)",
          lineHeight: 1, letterSpacing: "0.34em", marginRight: "-0.34em",
          color: C.forest,
        }}>
          NAMING
        </h1>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2 — Process
// ═══════════════════════════════════════════════════════════════════
function ProcessSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap style={{ paddingTop: isMobile ? 56 : "clamp(72px, 6.5vw, 120px)" }}>
      <section aria-labelledby="naming-process">
        <h2 id="naming-process" style={sectionHeading(isMobile)}>תהליך הניימינג</h2>
        <ol style={{ listStyle: "none", margin: isMobile ? "36px 0 0" : "clamp(36px, 3.4vw, 56px) 0 0", padding: 0, borderBottom: `1px solid ${C.rule}` }}>
          {PROCESS_STEPS.map(({ num, title, body }) => (
            <li key={num} style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "88px minmax(0, 300px) minmax(0, 620px)",
              columnGap: "clamp(24px, 3vw, 56px)",
              rowGap: 8,
              alignItems: "baseline",
              padding: isMobile ? "22px 0" : "28px 0",
              borderTop: `1px solid ${C.rule}`,
              textAlign: "right",
            }}>
              <span style={{ fontFamily: EN, fontWeight: 300, fontSize: 16, lineHeight: 1, letterSpacing: "0.04em", color: C.muted }}>{num}</span>
              <h3 style={{ margin: 0, fontFamily: HE, fontWeight: 700, fontSize: isMobile ? 19 : 20, lineHeight: 1.3, color: C.ink }}>{title}</h3>
              <p style={{ margin: 0, fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 16 : 17, lineHeight: 1.7, color: C.body }}>{body}</p>
            </li>
          ))}
        </ol>
      </section>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GALLERIES
// ═══════════════════════════════════════════════════════════════════
const MY = "/naming/Myjool/";
const myjool = {
  m1: { kind: "img", src: MY + "511197033_10163047046733485_4456798310964133825_n.jpg", alt: "MYJOOL 1", w: 1080, h: 1080 },
  m2: { kind: "img", src: MY + "512064747_10162661104254920_2510028380173325386_n.jpg", alt: "MYJOOL 2", w: 2048, h: 1536 },
  m3: { kind: "img", src: MY + "512587925_10162661104059920_4341441496912268612_n.jpg", alt: "MYJOOL 3", w: 1536, h: 2048 },
  m4: { kind: "img", src: MY + "513933162_10162661104264920_5119242861589211427_n.jpg", alt: "MYJOOL 4", w: 1536, h: 2048 },
  m5: { kind: "img", src: MY + "WhatsApp Image 2023-02-24 at 09.27.57 (1).jpeg", alt: "MYJOOL 5", w: 1080, h: 1080 },
  m6: { kind: "img", src: MY + "WhatsApp Image 2023-02-24 at 09.27.57 (3).jpeg", alt: "MYJOOL 6", w: 1080, h: 1080 },
  m7: { kind: "img", src: MY + "WhatsApp Image 2023-02-24 at 09.27.57 (4).jpeg", alt: "MYJOOL 7", w: 1080, h: 1080 },
} satisfies Record<string, Media>;

function MyjoolGallery({ isMobile }: { isMobile: boolean }) {
  return (
    <Gallery isMobile={isMobile}>
      <MediaRow isMobile={isMobile} items={[myjool.m2, myjool.m3, myjool.m4]} />
      <MediaRow isMobile={isMobile} twoUpOnMobile items={[myjool.m1, myjool.m5, myjool.m6, myjool.m7]} />
    </Gallery>
  );
}

const DE = "/naming/deesse/";
const deesse = {
  i1: { kind: "img", src: DE + "Deesse-01.png", alt: "Déesse necklace", w: 1222, h: 1317 },
  v2: { kind: "video", src: DE + "Deesse-02.mp4", poster: DE + "Deesse-02-poster.jpg", label: "סרטון Déesse", w: 576, h: 1024 },
  i3: { kind: "img", src: DE + "Deesse-03.png", alt: "Déesse ring with ribbon", w: 2000, h: 1239 },
  v4: { kind: "video", src: DE + "Deesse-04.mp4", poster: DE + "Deesse-04-poster.jpg", label: "סרטון Déesse", w: 480, h: 848 },
  i5: { kind: "img", src: DE + "Deesse-05.png", alt: "Déesse ring on pattern", w: 1222, h: 1317 },
} satisfies Record<string, Media>;

function DeesseGallery({ isMobile }: { isMobile: boolean }) {
  // RTL: first item sits on the right
  return (
    <Gallery isMobile={isMobile}>
      <MediaRow isMobile={isMobile} items={[deesse.v2, deesse.i1]} />
      <MediaRow isMobile={isMobile} items={[deesse.i3]} />
      <MediaRow isMobile={isMobile} items={[deesse.i5, deesse.v4]} />
    </Gallery>
  );
}

const RE = "/naming/reverie/";
const reverie = {
  before: { kind: "img", src: RE + "before picture.jpg", alt: "לפני — ריקולטה", w: 7594, h: 5063 },
  r1: { kind: "img", src: RE + "Reverie-01.jpg", alt: "אחרי — Rêverie", w: 1222, h: 1523 },
  r2: { kind: "img", src: RE + "Reverie-02.jpg", alt: "Rêverie 2", w: 1222, h: 1523 },
  r3: { kind: "img", src: RE + "Reverie-03.jpg", alt: "Rêverie 3", w: 1222, h: 1523 },
  r4: { kind: "img", src: RE + "Reverie-04.jpg", alt: "Rêverie 4", w: 1222, h: 1523 },
  r5: { kind: "img", src: RE + "Reverie-05.jpg", alt: "Rêverie 5", w: 1222, h: 1523 },
  r6: { kind: "img", src: RE + "Reverie-06.jpg", alt: "Rêverie 6", w: 1222, h: 1523 },
} satisfies Record<string, Media>;

function ReverieGallery({ isMobile }: { isMobile: boolean }) {
  const gap = galleryGap(isMobile);
  return (
    <Gallery isMobile={isMobile}>
      {/* לפני right / אחרי left on desktop; לפני above אחרי on mobile */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap }}>
        <LabeledCell label="לפני" item={reverie.before} isMobile={isMobile} />
        <LabeledCell label="אחרי" item={reverie.r1} isMobile={isMobile} />
      </div>
      <MediaRow isMobile={isMobile} items={[reverie.r2, reverie.r3]} />
      <MediaRow isMobile={isMobile} items={[reverie.r4, reverie.r5, reverie.r6]} />
    </Gallery>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 3 — Case Studies
// ═══════════════════════════════════════════════════════════════════
function CaseStudies({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap>
      <section aria-labelledby="naming-cases">
        <div style={{ marginTop: isMobile ? 96 : "clamp(120px, 11vw, 208px)" }}>
          <h2 id="naming-cases" lang="en" style={{
            ...sectionHeading(isMobile, true),
            paddingBottom: isMobile ? 20 : "clamp(20px, 1.8vw, 32px)",
            borderBottom: `2px solid ${C.ink}`,
          }}>
            Case Studies
          </h2>
        </div>

        <CaseSection
          id="case-myjool" number="#1" title="MYJOOL" lang="en"
          category="ניימינג | טאגליין"
          heading="מהמזווה של סבתא למדפי Waitrose בלונדון"
          paragraphs={MYJOOL_PARAGRAPHS}
          isMobile={isMobile}
        >
          <MyjoolGallery isMobile={isMobile} />
        </CaseSection>

        <CaseRule isMobile={isMobile} />

        <CaseSection
          id="case-deesse" number="#2" title="Déesse" lang="fr"
          category="ניימינג | טאגליין"
          heading="השם שברא את עצמו"
          paragraphs={DEESSE_PARAGRAPHS}
          credit="Hadar Mizrahi"
          isMobile={isMobile}
        >
          <DeesseGallery isMobile={isMobile} />
        </CaseSection>

        <CaseRule isMobile={isMobile} />

        <CaseSection
          id="case-reverie" number="#3" title="Rêverie" lang="fr"
          category="ניימינג | טאגליין"
          heading="לגרום לכם לחלום על השוקולד הזה"
          paragraphs={REVERIE_PARAGRAPHS}
          credit="Hadar Mizrahi"
          isMobile={isMobile}
        >
          <ReverieGallery isMobile={isMobile} />
        </CaseSection>
      </section>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 4 — About
// ═══════════════════════════════════════════════════════════════════
function AboutSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap>
      <section aria-labelledby="naming-about" style={{
        marginTop: isMobile ? 96 : "clamp(120px, 11vw, 208px)",
        paddingTop: isMobile ? 40 : "clamp(48px, 4.2vw, 80px)",
        borderTop: `1px solid ${C.caseRule}`,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 7fr) minmax(0, 5fr)",
        gap: isMobile ? 36 : "clamp(40px, 6vw, 120px)",
        alignItems: "center",
      }}>
        <div style={{ maxWidth: 640, textAlign: "right" }}>
          <h2 id="naming-about" style={sectionHeading(isMobile)}>נעים מאוד</h2>
          <p style={{ fontFamily: HE, fontWeight: 400, fontSize: 17, lineHeight: 1.5, color: C.muted, margin: "14px 0 36px" }}>
            אילונה אברמסון, אסטרטגית מותג וזהות מילולית
          </p>
          {ABOUT_PARAGRAPHS.map((t, i) => (
            <p key={i} style={{ fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 16 : 17, lineHeight: 1.75, color: C.body, margin: "0 0 1.05em" }}>{t}</p>
          ))}
          <p style={{ fontFamily: HE, fontWeight: 700, fontSize: 20, lineHeight: 1.5, color: C.ink, margin: "32px 0 0" }}>
            {ABOUT_CLOSING}
          </p>
        </div>
        <figure style={{
          margin: 0, justifySelf: "start", width: "100%", maxWidth: isMobile ? "none" : 520,
          aspectRatio: "848 / 1131", position: "relative", background: C.media,
        }}>
          <img src="/naming/about-photo.jpg" alt="אילונה אברמסון" width={848} height={1131} loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </figure>
      </section>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 5 — Thank you
// ═══════════════════════════════════════════════════════════════════
const CONTACTS = [
  { display: "LinkedIn", href: "https://www.linkedin.com/in/ilona-sammy-abramson/" },
  { display: "053-277-7569", href: "tel:+972532777569" },
  { display: "abramsonilona@gmail.com", href: "mailto:abramsonilona@gmail.com" },
];

function ThankYouSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap>
      <section aria-labelledby="naming-thanks" style={{
        textAlign: "center",
        padding: isMobile ? "96px 0 72px" : "clamp(120px, 10vw, 192px) 0 clamp(80px, 7vw, 128px)",
      }}>
        <h2 id="naming-thanks" lang="en" style={{
          margin: 0, fontFamily: EN, fontWeight: 300,
          fontSize: isMobile ? 44 : "clamp(44px, 5.4vw, 104px)",
          lineHeight: 1, letterSpacing: "-0.03em", color: C.ink,
        }}>
          THANK YOU
        </h2>
        <ul dir="ltr" style={{
          listStyle: "none", padding: 0, margin: isMobile ? "32px 0 0" : "clamp(32px, 3vw, 48px) 0 0",
          display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap",
          justifyContent: "center", alignItems: "center", gap: isMobile ? 14 : "12px 48px",
          fontFamily: EN, fontWeight: 300, fontSize: 18, lineHeight: 1.4,
        }}>
          {CONTACTS.map(({ display, href }) => {
            const ext = href.startsWith("http");
            return (
              <li key={href}>
                <a
                  href={href}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  className="naming-link"
                  style={{ color: C.ink, textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 4 }}
                >
                  {display}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
export default function NamingClient() {
  const isMobile = useIsMobile(761);

  return (
    <div style={{ background: C.cream, color: C.ink, direction: "rtl", overflowX: "clip" }}>
      <style>{`.naming-link:hover{color:${C.violet} !important;text-decoration-thickness:2px !important}`}</style>
      <HeroSection isMobile={isMobile} />
      <ProcessSection isMobile={isMobile} />
      <CaseStudies isMobile={isMobile} />
      <AboutSection isMobile={isMobile} />
      <ThankYouSection isMobile={isMobile} />
      <ProjectFooter />
    </div>
  );
}
