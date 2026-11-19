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
// Editor's Note Light Italic: the cover title and the opening heading
const NAMING_SERIF = "'NamingEditorNote', Georgia, serif";
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Spacing ───────────────────────────────────────────────────────
const SIDE = "clamp(20px, 5.625vw, 108px)";
const CONTENT_W = 1180; // content column; gutters sit outside it
const galleryGap = (m: boolean) => (m ? 8 : 14);
const caseSpace = (m: boolean) => (m ? "48px" : "clamp(64px, 6vw, 112px)");
const sectionHeading = (m: boolean, en = false): React.CSSProperties => ({
  margin: 0,
  fontFamily: en ? EN : HE,
  fontWeight: en ? 300 : 400,
  fontSize: m ? (en ? 34 : 30) : "clamp(32px, 3vw, 52px)",
  lineHeight: 1.05,
  letterSpacing: en ? "-0.03em" : "-0.02em",
  color: C.ink,
  textAlign: "right",
});

function Wrap({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: `calc(${CONTENT_W}px + 2 * ${SIDE})`, margin: "0 auto", paddingInline: SIDE, boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
}

// ─── Media cells: equal-height rows, no cropping ───────────────────
// Each cell grows in proportion to its aspect ratio (w/h), so every
// cell in a row ends up the same height and keeps its native ratio.
type Media =
  | { kind: "img"; src: string; alt: string; w: number; h: number }
  | { kind: "video"; src: string; poster: string; label: string; w: number; h: number };

function Cell({ item, fixedWidth }: { item: Media; fixedWidth?: string }) {
  const ratio = item.w / item.h;
  const sizing: React.CSSProperties = fixedWidth ? { width: fixedWidth, flex: "none" } : { flex: `${ratio} 1 0` };
  if (item.kind === "img") {
    // The image sets its own height from its width: never cropped, full length kept.
    return (
      <div style={{ minWidth: 0, alignSelf: "flex-start", background: C.media, ...sizing }}>
        <img
          src={item.src}
          alt={item.alt}
          width={item.w}
          height={item.h}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    );
  }
  return (
    <div style={{
      position: "relative",
      minWidth: 0,
      alignSelf: "flex-start",
      overflow: "hidden",
      background: C.media,
      aspectRatio: `${item.w} / ${item.h}`,
      ...sizing,
    }}>
      <PosterVideo src={item.src} poster={item.poster} label={item.label} />
    </div>
  );
}

function MediaRow({ items, isMobile }: { items: Media[]; isMobile: boolean }) {
  // A single item always spans the full width (flex-grow < 1 would leave a gap)
  if (items.length === 1) return <Cell item={items[0]} fixedWidth="100%" />;
  return <div style={{ display: "flex", gap: galleryGap(isMobile) }}>{items.map((it, i) => <Cell key={i} item={it} />)}</div>;
}

// Desktop and mobile get their own row plans, so rows stay a sensible
// height on both (RTL: the first item in a row sits on the right).
function Gallery({ isMobile, desktop, mobile, children }: {
  isMobile: boolean;
  desktop: Media[][];
  mobile: Media[][];
  children?: React.ReactNode; // optional lead row (e.g. before/after)
}) {
  return (
    <div style={{
      marginTop: isMobile ? 40 : "clamp(48px, 4.4vw, 80px)",
      display: "flex",
      flexDirection: "column",
      gap: galleryGap(isMobile),
    }}>
      {children}
      {(isMobile ? mobile : desktop).map((row, i) => <MediaRow key={i} items={row} isMobile={isMobile} />)}
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
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", display: "block" }}
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
            width: 56, height: 56, borderRadius: "50%",
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

// ─── Text helpers ──────────────────────────────────────────────────
// Split a text into blocks, each new block starting at one of the phrases.
function splitAt(text: string, phrases: string[]): string[] {
  const cuts = phrases
    .map(ph => text.indexOf(ph))
    .filter(i => i > 0)
    .sort((a, b) => a - b);
  const out: string[] = [];
  let from = 0;
  for (const c of cuts) { out.push(text.slice(from, c).trim()); from = c; }
  out.push(text.slice(from).trim());
  return out.filter(Boolean);
}

// Set the given phrases in bold (case-insensitive match, original casing kept).
function withEmphasis(text: string, phrases: string[]): React.ReactNode {
  if (!phrases.length) return text;
  const esc = phrases.map(ph => ph.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${esc.join("|")})`, "i"));
  return parts.map((part, i) =>
    phrases.some(ph => ph.toLowerCase() === part.toLowerCase())
      ? <b key={i} style={{ fontWeight: 700, color: C.ink }}>{part}</b>
      : part
  );
}

// ─── Shared case layout ────────────────────────────────────────────
interface CaseProps {
  id: string;
  number: string;
  title: string;
  lang: string;
  descriptor: string;
  descriptorLang: "he" | "en";
  category: string;
  heading: string;
  paragraphs: string[];
  credits?: { label: string; name: string; lang?: "he" | "en" }[];
  mobileBreaks: string[]; // mobile: start a new line at each of these phrases
  emphasis?: string[];    // phrases set in bold (taglines)
  lead: Media; // mobile only: one image right under the brand name
  columns: 2 | 3; // desktop text columns, by text length
  isMobile: boolean;
  children: React.ReactNode; // gallery
}

function CaseSection({ id, number, title, lang, descriptor, descriptorLang, category, heading, paragraphs, credits, mobileBreaks, emphasis = [], lead, columns, isMobile, children }: CaseProps) {
  const p: React.CSSProperties = {
    fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 15 : 15.5, lineHeight: 1.75,
    color: C.body, margin: "0 0 1em",
  };
  return (
    <article aria-labelledby={id} style={{ paddingTop: isMobile ? 36 : "clamp(40px, 3.6vw, 64px)", textAlign: "right" }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <p style={{ fontFamily: EN, fontWeight: 300, fontSize: 14, lineHeight: 1, letterSpacing: "0.04em", color: C.muted, margin: "0 0 8px" }}>
          <span dir="ltr">{number}</span>
        </p>
        <h3 id={id} lang={lang} style={{
          fontFamily: EN, fontWeight: 300,
          fontSize: isMobile ? 40 : "clamp(40px, 3.4vw, 60px)",
          lineHeight: 1.02, letterSpacing: "-0.02em", color: C.ink, margin: 0,
        }}>
          {title}
        </h3>
        {/* Brand descriptor: same size/spacing in all cases */}
        <p
          lang={descriptorLang}
          dir={descriptorLang === "en" ? "ltr" : "rtl"}
          style={{
            fontFamily: descriptorLang === "en" ? EN : HE,
            fontWeight: descriptorLang === "en" ? 300 : 400,
            fontSize: 16, lineHeight: 1.4, color: C.ink, margin: "8px 0 0", textAlign: "right",
          }}
        >
          {descriptor}
        </p>
        <p style={{ fontFamily: HE, fontWeight: 400, fontSize: 14, lineHeight: 1.4, color: C.muted, margin: "4px 0 0" }}>
          {category}
        </p>
      </motion.div>

      {isMobile && (
        <div style={{ marginTop: 24 }}>
          <Cell item={lead} fixedWidth="100%" />
        </div>
      )}

      <div style={{ marginTop: isMobile ? 28 : "clamp(28px, 2.4vw, 40px)" }}>
        <h4 style={{ fontFamily: HE, fontWeight: 700, fontSize: isMobile ? 17 : 18, lineHeight: 1.4, color: C.ink, margin: "0 0 16px" }}>
          {heading}
        </h4>
        {/* Desktop: text flows across 2 or 3 columns; mobile: one column */}
        {isMobile ? (
          // Mobile: the story in a few blocks, breaking only where chosen
          splitAt(paragraphs.join(" "), mobileBreaks).map((t, i) => (
            <p key={i} style={{ ...p, margin: i === 0 ? 0 : "0.75em 0 0" }}>{withEmphasis(t, emphasis)}</p>
          ))
        ) : (
          <div style={{ columnCount: columns, columnGap: "clamp(32px, 3.4vw, 56px)", columnFill: "balance" }}>
            {paragraphs.map((t, i) => <p key={i} style={{ ...p, breakInside: "avoid-column" }}>{withEmphasis(t, emphasis)}</p>)}
          </div>
        )}
        {credits && credits.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px", marginTop: isMobile ? 24 : 20 }}>
            {credits.map(c => (
              <p key={c.label} style={{ ...p, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                <b style={{ display: "block", color: C.ink, fontWeight: 700 }}>{c.label}</b>
                <span lang={c.lang ?? "he"}>{c.name}</span>
              </p>
            ))}
          </div>
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
    body: "מתחילים בשאלון אפיון ולאחריו נפגשים לשיחת עומק, בה אני לומדת להכיר את המותג, את קהל היעד והרגשות שנרצה לעורר אצלו. יחד בוחרים שלושה ערכים מרכזיים שיכולים להוביל את השם החדש.",
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
    body: [
      "חמשת השמות הטובים ביותר עולים לגמר, כשמאחורי כל אחד עומד רציונל אסטרטגי המבוסס על אחד מערכי המותג. בשלב זה מתבצעת גם בדיקה ראשונית של זמינות השמות בקטגוריה.",
      "מכאן אתם לוקחים כמה ימים לחשוב וחוזרים אליי עם הבחירה שלכם.",
    ],
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
  "תהליכי ניימינג הם הדובדבן שבטופ. אחרי כל השיחות, המחקר וההחלטות על מה המותג הזה רוצה להיות, מגיע הרגע שבו צריך לתת לו שם. מילה אחת או שתיים, שאנשים יראו על האריזה, יחפשו בגוגל ויגידו בקול כשהם יספרו עליו למישהו אחר.",
];

const ABOUT_CLOSING = "שם הוא הכותרת של סיפור המותג שלכם. תוודאו שהיא מחזיקה אותו כמו שצריך.";

// ─── Fixed top bar: logo mark (symbol only) pinned to the top-left corner ─────────────
// (the site navigation is hidden on /naming; same height as the nav)
function TopBar({ isMobile }: { isMobile: boolean }) {
  return (
    <header style={{
      position: "fixed", top: 0, right: 0, left: 0, zIndex: 100,
      height: isMobile ? 47 : 53, boxSizing: "border-box",
      padding: isMobile ? "0 1.25rem" : "0 2.5rem",
      display: "flex", alignItems: "center", justifyContent: "flex-end", // RTL: end = left
      // Mobile: lilac bar (matches the cover); desktop keeps the cream bar
      background: isMobile ? C.lilac : "rgba(252,247,244,0.97)",
      borderBottom: isMobile ? "1px solid rgba(10,26,13,0.08)" : "1px solid var(--rule)",
    }}>
      <img src="/naming/logo-mark.png" alt="Ilona Abramson" width={498} height={128}
        style={{ height: isMobile ? 18 : 20, width: "auto", display: "block", objectFit: "contain" }} />
    </header>
  );
}

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
          padding: isMobile ? "48px 28px 44px" : `clamp(56px, 5vw, 88px) ${SIDE}`,
        }}
      >
        {/* Name + tagline as one unit (the symbol lives in the top bar); keep the file's ratio */}
        <img
          src="/naming/logo-wordmark.png"
          alt="Ilona Abramson, Brand & Verbal Strategist"
          width={2363}
          height={419}
          style={{
            display: "block",
            width: isMobile ? "min(340px, 100%)" : "clamp(320px, 36vw, 560px)",
            height: "auto",
            aspectRatio: "2363 / 419",
          }}
        />
        <h1 id="naming-title" lang="en" dir="ltr" style={{
          margin: isMobile ? "24px 0 0" : "clamp(24px, 2vw, 36px) 0 0",
          fontFamily: NAMING_SERIF, fontStyle: "italic", fontWeight: 300,
          fontSize: isMobile ? 28 : "clamp(28px, 2.4vw, 40px)",
          lineHeight: 1, letterSpacing: "-0.005em", whiteSpace: "nowrap",
          color: C.forest,
        }}>
          Let’s talk about Naming
        </h1>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 1b — Opening
// ═══════════════════════════════════════════════════════════════════
const OPENING_PARAGRAPHS = [
  "כשאתם שומעים שם של מותג, הוא צריך לגרום לכם לדמיין משהו. לפעמים זו תמונה שעולה בראש, לפעמים זו תחושה, ולפעמים זו אסוציאציה שמפתיעה גם אתכם.",
  "מאחורי כל שם שאני יוצרת עומדת החלטה אסטרטגית. מה מתוך הסיפור והערכים של המותג אנחנו רוצים שיגיע לצד השני, ואיזו תחושה אנחנו רוצים להשאיר? כל זה צריך להיכנס למילה (או שתיים) שקל לזכור, קל לבטא, נוח לעבוד איתה טיפוגרפית, ואם אפשר גם כזו שלא שמענו אלף פעם קודם.",
  "נשמע מסובך? זה בדיוק מסוג האתגרים שאני אוהבת לפצח.",
];

function OpeningSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap>
      <section aria-labelledby="naming-opening" style={{
        textAlign: "center",
        padding: isMobile ? "56px 0 0" : "clamp(72px, 6.4vw, 120px) 0 0",
      }}>
        <h2 id="naming-opening" lang="en" dir="ltr" style={{
          margin: 0, textAlign: "center",
          fontFamily: NAMING_SERIF, fontStyle: "italic", fontWeight: 300,
          fontSize: isMobile ? "min(26px, calc((100vw - 48px) / 17.6))" : "clamp(30px, 2.8vw, 48px)",
          lineHeight: 1.2, letterSpacing: "-0.005em", color: C.ink,
        }}>
          {/* Two fixed lines; on mobile the size scales so line 2 fits the screen */}
          <span style={{ display: "block", whiteSpace: "nowrap" }}>Before I look for a name,</span>
          <span style={{ display: "block", whiteSpace: "nowrap" }}>I look for what makes the brand worth naming.</span>
        </h2>
        <div style={{ maxWidth: 720, margin: "0 auto", marginTop: isMobile ? 24 : "clamp(24px, 2.2vw, 36px)", textAlign: "center" }}>
          {OPENING_PARAGRAPHS.map((t, i) => (
            <p key={i} style={{
              margin: i === 0 ? 0 : "1em 0 0",
              fontFamily: HE, fontWeight: i === OPENING_PARAGRAPHS.length - 1 ? 700 : 400,
              fontSize: isMobile ? 16 : 17, lineHeight: 1.75,
              color: i === OPENING_PARAGRAPHS.length - 1 ? C.ink : C.body,
            }}>
              {t}
            </p>
          ))}
        </div>
      </section>
    </Wrap>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION 2 — Process
// ═══════════════════════════════════════════════════════════════════
function ProcessSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap style={{ paddingTop: isMobile ? 56 : "clamp(72px, 6.4vw, 120px)" }}>
      <section aria-labelledby="naming-process">
        <h2 id="naming-process" style={sectionHeading(isMobile)}>תהליך הניימינג</h2>
        <ol style={{ listStyle: "none", margin: isMobile ? "28px 0 0" : "clamp(28px, 2.6vw, 44px) 0 0", padding: 0, borderBottom: `1px solid ${C.rule}` }}>
          {PROCESS_STEPS.map(({ num, title, body }) => (
            <li key={num} style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "64px minmax(0, 260px) minmax(0, 620px)",
              columnGap: "clamp(24px, 3vw, 48px)",
              rowGap: 6,
              alignItems: "baseline",
              padding: isMobile ? "18px 0" : "22px 0",
              borderTop: `1px solid ${C.rule}`,
              textAlign: "right",
            }}>
              <span style={{ fontFamily: EN, fontWeight: 300, fontSize: 14, lineHeight: 1, letterSpacing: "0.04em", color: C.muted }}>{num}</span>
              <h3 style={{ margin: 0, fontFamily: HE, fontWeight: 700, fontSize: isMobile ? 17 : 18, lineHeight: 1.3, color: C.ink }}>{title}</h3>
              <div>
                {(Array.isArray(body) ? body : [body]).map((line, j) => (
                  <p key={j} style={{ margin: j === 0 ? 0 : "0.6em 0 0", fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 15 : 15.5, lineHeight: 1.7, color: C.body }}>{line}</p>
                ))}
              </div>
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
  m2: { kind: "img", src: "/naming/web/myjool-2.jpg", alt: "MYJOOL 2", w: 2048, h: 1536 },
  m3: { kind: "img", src: "/naming/web/myjool-3.jpg", alt: "MYJOOL 3", w: 1536, h: 2048 },
  m4: { kind: "img", src: "/naming/web/myjool-4.jpg", alt: "MYJOOL 4", w: 1536, h: 2048 },
  m5: { kind: "img", src: MY + "WhatsApp Image 2023-02-24 at 09.27.57 (1).jpeg", alt: "MYJOOL 5", w: 1080, h: 1080 },
  m6: { kind: "img", src: MY + "WhatsApp Image 2023-02-24 at 09.27.57 (3).jpeg", alt: "MYJOOL 6", w: 1080, h: 1080 },
  m7: { kind: "img", src: MY + "WhatsApp Image 2023-02-24 at 09.27.57 (4).jpeg", alt: "MYJOOL 7", w: 1080, h: 1080 },
  v1: { kind: "video", src: MY + "myjool-daily-charger.mp4", poster: MY + "myjool-daily-charger-poster.jpg", label: "סרטון MYJOOL", w: 360, h: 640 },
} satisfies Record<string, Media>;

function MyjoolGallery({ isMobile }: { isMobile: boolean }) {
  const m = myjool;
  return (
    <Gallery
      isMobile={isMobile}
      desktop={[[m.v1, m.m2, m.m3, m.m4], [m.m1, m.m5, m.m6, m.m7]]}
      mobile={[[m.v1], [m.m2], [m.m3], [m.m4], [m.m5], [m.m6], [m.m7]]} // m1 leads under the name
    />
  );
}

const DE = "/naming/deesse/";
const deesse = {
  i1: { kind: "img", src: "/naming/web/deesse-01.jpg", alt: "Déesse necklace", w: 1222, h: 1317 },
  v2: { kind: "video", src: DE + "Deesse-02.mp4", poster: DE + "Deesse-02-poster.jpg", label: "סרטון Déesse", w: 576, h: 1024 },
  i3: { kind: "img", src: "/naming/web/deesse-03.jpg", alt: "Déesse ring with ribbon", w: 2000, h: 1239 },
  v4: { kind: "video", src: DE + "Deesse-04.mp4", poster: DE + "Deesse-04-poster.jpg", label: "סרטון Déesse", w: 480, h: 848 },
  i5: { kind: "img", src: "/naming/web/deesse-05.jpg", alt: "Déesse ring on pattern", w: 1222, h: 1317 },
} satisfies Record<string, Media>;

function DeesseGallery({ isMobile }: { isMobile: boolean }) {
  const d = deesse;
  return (
    <Gallery
      isMobile={isMobile}
      desktop={[[d.v2, d.i1, d.v4], [d.i3, d.i5]]}
      mobile={[[d.v2], [d.i3], [d.i5], [d.v4]]} // i1 leads under the name
    />
  );
}

const reverie = {
  before: { kind: "img", src: "/naming/web/reverie-before.jpg", alt: "לפני: ריקולטה", w: 7594, h: 5063 },
  r1: { kind: "img", src: "/naming/web/reverie-01.jpg", alt: "Rêverie 1", w: 1222, h: 1523 },
  r2: { kind: "img", src: "/naming/web/reverie-02.jpg", alt: "אחרי: Rêverie", w: 1222, h: 1523 },
  r3: { kind: "img", src: "/naming/web/reverie-03.jpg", alt: "Rêverie 3", w: 1222, h: 1523 },
  r4: { kind: "img", src: "/naming/web/reverie-04.jpg", alt: "Rêverie 4", w: 1222, h: 1523 },
  r5: { kind: "img", src: "/naming/web/reverie-05.jpg", alt: "Rêverie 5", w: 1222, h: 1523 },
  r6: { kind: "img", src: "/naming/web/reverie-06.jpg", alt: "Rêverie 6", w: 1222, h: 1523 },
} satisfies Record<string, Media>;

function ReverieGallery({ isMobile }: { isMobile: boolean }) {
  const gap = galleryGap(isMobile);
  const r = reverie;
  return (
    <Gallery
      isMobile={isMobile}
      desktop={[[r.r1, r.r3, r.r4, r.r5, r.r6]]}
      mobile={[[r.r3], [r.r4], [r.r5], [r.r6]]} // r1 leads under the name
    >
      {/* Before (old box) next to the new packaging trio:
          לפני right / אחרי left on desktop; לפני above אחרי on mobile */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap }}>
        <LabeledCell label="לפני" item={r.before} isMobile={isMobile} />
        <LabeledCell label="אחרי" item={r.r2} isMobile={isMobile} />
      </div>
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
        <div style={{ marginTop: isMobile ? 80 : "clamp(96px, 8.4vw, 160px)" }}>
          <h2 id="naming-cases" lang="en" style={{
            ...sectionHeading(isMobile, true),
            paddingBottom: isMobile ? 16 : "clamp(16px, 1.4vw, 24px)",
            borderBottom: `2px solid ${C.ink}`,
          }}>
            Case Studies
          </h2>
        </div>

        <CaseSection
          id="case-myjool" number="#1" title="MYJOOL" lang="en"
          descriptor="מותג תמרים בינלאומי" descriptorLang="he"
          category="ניימינג | טאגליין"
          heading="מהמזווה של סבתא למדפי Waitrose בלונדון"
          lead={myjool.m1}
          mobileBreaks={["הם רצו", "האתגר", "משחק מילים"]}
          emphasis={["Brings out your best"]}
          paragraphs={MYJOOL_PARAGRAPHS}
          credits={[
            { label: "מיתוג וקריאייטיב", name: "סטודיו ברוך נאה" },
            { label: "איור", name: "אלונה מילגרם" },
          ]}
          columns={3}
          isMobile={isMobile}
        >
          <MyjoolGallery isMobile={isMobile} />
        </CaseSection>

        <CaseRule isMobile={isMobile} />

        <CaseSection
          id="case-deesse" number="#2" title="Déesse" lang="fr"
          descriptor="Fine Jewelry" descriptorLang="en"
          category="ניימינג | טאגליין"
          heading="השם שברא את עצמו"
          lead={deesse.i1}
          mobileBreaks={["כשהיא פנתה אליי", "נשי, עוצמתי", "למרות שאני"]}
          emphasis={["Timeless Fine Jewelry"]}
          paragraphs={DEESSE_PARAGRAPHS}
          columns={3}
          credits={[{ label: "מיתוג ועיצוב", name: "Hadar Mizrahi", lang: "en" }]}
          isMobile={isMobile}
        >
          <DeesseGallery isMobile={isMobile} />
        </CaseSection>

        <CaseRule isMobile={isMobile} />

        <CaseSection
          id="case-reverie" number="#3" title="Rêverie" lang="fr"
          descriptor="Chocolatier" descriptorLang="en"
          category="ניימינג | טאגליין"
          heading="לגרום לכם לחלום על השוקולד הזה"
          lead={reverie.r1}
          mobileBreaks={["את המקצוע"]}
          paragraphs={REVERIE_PARAGRAPHS}
          columns={2}
          credits={[{ label: "מיתוג ועיצוב", name: "Hadar Mizrahi", lang: "en" }]}
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
        marginTop: isMobile ? 80 : "clamp(96px, 8.4vw, 160px)",
        paddingTop: isMobile ? 36 : "clamp(40px, 3.6vw, 64px)",
        borderTop: `1px solid ${C.caseRule}`,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 7fr) minmax(0, 4fr)",
        gap: isMobile ? 32 : "clamp(40px, 5vw, 96px)",
        alignItems: "center",
      }}>
        <div style={{ maxWidth: 640, textAlign: "right" }}>
          <h2 id="naming-about" style={sectionHeading(isMobile)}>נעים מאוד</h2>
          <p style={{ fontFamily: HE, fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: C.muted, margin: "10px 0 28px" }}>
            אילונה אברמסון, אסטרטגית מותג וזהות מילולית
          </p>
          {ABOUT_PARAGRAPHS.map((t, i) => (
            <p key={i} style={{ fontFamily: HE, fontWeight: 400, fontSize: isMobile ? 15 : 15.5, lineHeight: 1.75, color: C.body, margin: "0 0 1em" }}>{t}</p>
          ))}
          <p style={{ fontFamily: HE, fontWeight: 700, fontSize: isMobile ? 17 : 18, lineHeight: 1.5, color: C.ink, margin: "24px 0 0" }}>
            {ABOUT_CLOSING}
          </p>
        </div>
        <figure style={{
          margin: 0, justifySelf: "start", width: "100%", maxWidth: isMobile ? 360 : 400,
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
// SECTION 5 — Closing invitation
// ═══════════════════════════════════════════════════════════════════

function ThankYouSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Wrap>
      <section aria-labelledby="naming-thanks" style={{
        textAlign: "center",
        padding: isMobile ? "80px 0 64px" : "clamp(96px, 8vw, 152px) 0 clamp(72px, 6vw, 112px)",
      }}>
        <h2 id="naming-thanks" style={{
          margin: 0, fontFamily: HE, fontWeight: 400,
          fontSize: isMobile ? 18 : "clamp(19px, 1.5vw, 24px)",
          lineHeight: 1.5, letterSpacing: "-0.005em", color: C.ink, textWrap: "balance",
        }}>
          <span style={{ display: "block" }}>עובדים על מותג חדש או ריברנדינג?</span>
          <span style={{ display: "block" }}>אני מזמינה אתכם לתהליך ניימינג מקצועי ומסקרן</span>
        </h2>
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
      <style>{`@font-face{font-family:"NamingEditorNote";src:url("/fonts/Editor_sNote-LightItalic.otf") format("opentype");font-weight:300;font-style:italic;font-display:swap}`}</style>
      <TopBar isMobile={isMobile} />
      <HeroSection isMobile={isMobile} />
      <OpeningSection isMobile={isMobile} />
      <ProcessSection isMobile={isMobile} />
      <CaseStudies isMobile={isMobile} />
      <AboutSection isMobile={isMobile} />
      <ThankYouSection isMobile={isMobile} />
      <ProjectFooter contactLinks />
    </div>
  );
}
