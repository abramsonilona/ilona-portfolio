"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ═══════════════════════════════════════════════════════════════════
type Status = "idle" | "playing" | "paused" | "ended";
const TOTAL = 60;

const C = {
  dark:    "#002607",
  lime:    "#e0ff5c",
  lilac:   "#e8d4ff",
  purple:  "#a173ea",
  cream:   "#fcf7f4",
  panel:   "rgba(255,255,255,0.08)",
  border:  "rgba(255,255,255,0.13)",
  muted:   "rgba(252,247,244,0.50)",
  liHigh:  "rgba(224,255,92,0.14)",
  liBorder:"rgba(224,255,92,0.65)",
  purpHigh:"rgba(161,115,234,0.15)",
};

const HE = "'SimplerPro','Arial Hebrew',sans-serif";
const EN = "'HelveticaNeue',Helvetica,Arial,sans-serif";

// ═══════════════════════════════════════════════════════════════════
// ANIMATION MATH
// ═══════════════════════════════════════════════════════════════════
function clamp(x: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, x)); }
function prog(t: number, s: number, e: number) { return clamp((t - s) / (e - s)); }
function eo(x: number) { return 1 - Math.pow(1 - x, 3); }

function animStyle(t: number, inAt: number, outAt: number, inDur = 0.5, outDur = 0.4): React.CSSProperties {
  if (t < inAt) return { opacity: 0, transform: "translateY(14px)" };
  if (t < inAt + inDur) {
    const p = eo(prog(t, inAt, inAt + inDur));
    return { opacity: p, transform: `translateY(${(1 - p) * 14}px)` };
  }
  if (outAt > 0 && t >= outAt) {
    if (t >= outAt + outDur) return { opacity: 0, transform: "translateY(-10px)" };
    const p = eo(prog(t, outAt, outAt + outDur));
    return { opacity: 1 - p, transform: `translateY(${-p * 10}px)` };
  }
  return { opacity: 1, transform: "translateY(0)" };
}

function typeText(text: string, t: number, at: number, cps = 16): string {
  if (t < at) return "";
  return text.slice(0, Math.min(text.length, Math.round((t - at) * cps)));
}

function blink(t: number, from: number, hz = 1.4): boolean {
  if (t < from) return false;
  return Math.floor((t - from) / (1 / hz)) % 2 === 0;
}

// ═══════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════════

function LineGfx({ w = "100%", op = 0.18, color = C.cream }: { w?: string; op?: number; color?: string }) {
  return (
    <div style={{ height: 3, borderRadius: 2, background: color, opacity: op, width: w, flexShrink: 0 }} />
  );
}

function BrowserChrome({ children, w, style }: { children?: React.ReactNode; w?: number | string; style?: React.CSSProperties }) {
  return (
    <div style={{ width: w, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", background: "rgba(0,0,0,0.15)", borderBottom: `1px solid ${C.border}`, direction: "ltr" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.border }} />)}
      </div>
      <div style={{ padding: "10px 12px" }}>{children}</div>
    </div>
  );
}

function Panel({ children, style, highlighted }: { children?: React.ReactNode; style?: React.CSSProperties; highlighted?: boolean }) {
  return (
    <div style={{
      background: highlighted ? C.liHigh : C.panel,
      border: `1px solid ${highlighted ? C.liBorder : C.border}`,
      borderRadius: 10, padding: "14px 16px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Tag({ label, color = C.lime }: { label: string; color?: string }) {
  return (
    <span style={{
      fontFamily: HE, fontSize: "clamp(8px,0.75vw,10px)", color: C.dark,
      background: color, borderRadius: 4, padding: "2px 7px", fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE HEADING (positioned by parent, animated by this)
// ═══════════════════════════════════════════════════════════════════
function Heading({ text, t, inAt, outAt }: { text: string; t: number; inAt: number; outAt: number }) {
  const s = animStyle(t, inAt, outAt, 0.6, 0.4);
  return (
    <div style={{ opacity: s.opacity, transform: s.transform, textAlign: "center", width: "100%", padding: "0 8%" }}>
      <h2 style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(16px,2.2vw,30px)", lineHeight: 1.3, margin: 0 }}>
        {text}
      </h2>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 0  (0–6 s)  — 3 screens, text types in then stops
// ═══════════════════════════════════════════════════════════════════
function Scene0({ t }: { t: number }) {
  const oAt = 5.6;
  const genericText = "איכות ללא פשרות";
  const typedA = typeText(genericText, t, 1.8, 7);
  const typedB = typeText(genericText, t, 2.2, 7);
  const typedC = typeText(genericText, t, 2.6, 7);
  const typingDone = t > 1.8 + genericText.length / 7 + 0.6;
  const showCursor = !typingDone ? t > 1.8 : blink(t, 1.8 + genericText.length / 7, 1.3);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "5%", padding: "9% 6% 4%", pointerEvents: t < 0 || t > oAt ? "none" : "auto" }}>
      <Heading text="מה המותג שלכם הולך להגיד?" t={t} inAt={0} outAt={oAt} />

      <div style={{ display: "flex", gap: "3%", justifyContent: "center", width: "100%", maxWidth: 760, ...animStyle(t, 0.4, oAt) }}>
        {[
          { label: "אתר", delay: 0.5, typed: typedA },
          { label: "אפליקציה", delay: 0.9, typed: typedB },
          { label: "פוסט", delay: 1.3, typed: typedC },
        ].map(({ label, delay, typed }) => (
          <div key={label} style={{ flex: 1, ...animStyle(t, delay, oAt) }}>
            <BrowserChrome>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontFamily: HE, fontSize: "clamp(8px,0.75vw,9px)", color: C.muted }}>{label}</span>
                <LineGfx w="80%" op={0.14} />
                <div style={{ display: "flex", alignItems: "center", gap: 3, minHeight: 16 }}>
                  <span style={{ color: C.muted, fontFamily: HE, fontSize: "clamp(9px,0.85vw,12px)" }}>
                    {typed}
                  </span>
                  {showCursor && t > 1.5 + delay * 0.3 && (
                    <span style={{ width: 1.5, height: "0.9em", background: C.cream, opacity: 0.6, display: "inline-block", verticalAlign: "middle" }} />
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
                  <LineGfx op={0.1} />
                  <LineGfx w="65%" op={0.08} />
                </div>
              </div>
            </BrowserChrome>
          </div>
        ))}
      </div>

      <div style={{ ...animStyle(t, 4.2, oAt), textAlign: "center" }}>
        <span style={{ fontFamily: HE, fontSize: "clamp(10px,0.9vw,13px)", color: C.muted }}>
          הכתיבה נעצרת.
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 1  (6–11 s)  — 3 research cards
// ═══════════════════════════════════════════════════════════════════
function Scene1({ t }: { t: number }) {
  const iAt = 6, oAt = 10.6;
  const cards = [
    { title: "החברה שלכם", items: ["ערכים ומשימה", "יתרונות ייחודיים", "מה מניע אתכם"], delay: 6.5 },
    { title: "האנשים שלכם", items: ["מי הקהל הרלוונטי", "מה חשוב להם", "שפה שמדברת אליהם"], delay: 7.0 },
    { title: "המתחרים שלכם", items: ["מה כולם אומרים", "הפערים בשוק", "איפה יש מקום"], delay: 7.5 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "5%", padding: "9% 6% 4%", pointerEvents: t < iAt || t > oAt ? "none" : "auto" }}>
      <Heading text="קודם, נבין מה יש לו לומר." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ display: "flex", gap: "3%", justifyContent: "center", width: "100%", maxWidth: 760 }}>
        {cards.map(({ title, items, delay }) => (
          <div key={title} style={{ flex: 1, ...animStyle(t, delay, oAt) }}>
            <Panel>
              <div style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(11px,1vw,14px)", marginBottom: 12 }}>
                {title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, ...animStyle(t, delay + 0.3 + i * 0.3, oAt) }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.lime, flexShrink: 0 }} />
                    <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.85vw,11px)", color: C.muted }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        ))}
      </div>

      <div style={{ ...animStyle(t, 9.5, oAt), textAlign: "center" }}>
        <Tag label="ריסרץ'" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 2  (11–20 s)  — strategy document
// ═══════════════════════════════════════════════════════════════════
function Scene2({ t }: { t: number }) {
  const iAt = 11, oAt = 19.6;
  const rows = [
    { label: "בידול", text: "מה שרק אתם יכולים לומר", highlight: false, at: 12.5 },
    { label: "מיצוב", text: "המקום שלכם בנוף התחרותי", highlight: true,  at: 13.5 },
    { label: "נרטיב", text: "הסיפור שמחבר הכל", highlight: false, at: 14.5 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "5%", padding: "9% 6% 4%", pointerEvents: t < iAt || t > oAt ? "none" : "auto" }}>
      <Heading text="מוצאים את הבידול. מגדירים את המקום שלכם." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ width: "100%", maxWidth: 540, ...animStyle(t, iAt + 0.4, oAt) }}>
        <Panel>
          <div style={{ fontFamily: HE, fontWeight: 700, color: C.muted, fontSize: "clamp(9px,0.75vw,10px)", letterSpacing: "0.08em", marginBottom: 14 }}>
            אסטרטגיית מותג
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rows.map(({ label, text, highlight, at }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                borderRadius: 7, padding: "10px 12px",
                background: (highlight && t > 16) ? C.liHigh : "transparent",
                border: `1px solid ${(highlight && t > 16) ? C.liBorder : "transparent"}`,
                transition: "none",
                ...animStyle(t, at, oAt),
              }}>
                <span style={{
                  fontFamily: HE, fontWeight: 700, fontSize: "clamp(10px,0.95vw,13px)",
                  color: (highlight && t > 16) ? C.lime : C.cream,
                  minWidth: "clamp(36px,3.5vw,50px)",
                }}>
                  {label}
                </span>
                <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.85vw,12px)", color: C.muted }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ ...animStyle(t, 17, oAt), textAlign: "center" }}>
        <span style={{ fontFamily: HE, fontSize: "clamp(10px,0.9vw,13px)", color: C.muted }}>
          המיצוב הוא עמוד השדרה של כל השפה.
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 3  (20–27 s)  — naming options
// ═══════════════════════════════════════════════════════════════════
function Scene3({ t }: { t: number }) {
  const iAt = 20, oAt = 26.6;
  const options = [
    { num: "01", delay: 20.6 },
    { num: "02", delay: 21.2 },
    { num: "03", delay: 21.8, selected: true },
  ];
  const anySelected = t > 23;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "4%", padding: "9% 6% 4%", pointerEvents: t < iAt || t > oAt ? "none" : "auto" }}>
      <Heading text="נותנים לזה שם." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ display: "flex", gap: "2%", justifyContent: "center", width: "100%", maxWidth: 540 }}>
        {options.map(({ num, delay, selected }) => (
          <div key={num} style={{ flex: 1, ...animStyle(t, delay, oAt) }}>
            <Panel highlighted={selected && anySelected}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.75vw,10px)", color: C.muted, letterSpacing: "0.1em" }}>
                  כיוון {num}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%", alignItems: "center" }}>
                  <LineGfx w="70%" op={selected && anySelected ? 0.5 : 0.2} color={selected && anySelected ? C.lime : C.cream} />
                  <LineGfx w="50%" op={0.12} />
                </div>
                {selected && anySelected && (
                  <div style={{ ...animStyle(t, 23, oAt) }}>
                    <Tag label="נבחר" />
                  </div>
                )}
              </div>
            </Panel>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", maxWidth: 360, ...animStyle(t, 24.2, oAt) }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", padding: "12px 16px", border: `1px solid ${C.liBorder}`, borderRadius: 10, background: C.liHigh }}>
          <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted }}>שם המותג</span>
          <div style={{ height: 4, borderRadius: 2, background: C.lime, opacity: 0.7, width: "55%" }} />
          <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted, marginTop: 6 }}>טאגליין</span>
          <div style={{ height: 3, borderRadius: 2, background: C.cream, opacity: 0.2, width: "75%" }} />
        </div>
      </div>

      <div style={{ ...animStyle(t, 25.5, oAt), textAlign: "center" }}>
        <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted }}>
          ניימינג וטאגליין, לפי הצורך
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 4  (27–37 s)  — language doc + tone comparison
// ═══════════════════════════════════════════════════════════════════
function Scene4({ t }: { t: number }) {
  const iAt = 27, oAt = 36.6;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "4%", padding: "9% 6% 4%", pointerEvents: t < iAt || t > oAt ? "none" : "auto" }}>
      <Heading text="בונים אישיות. מוצאים את המילים." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ display: "flex", gap: "3%", justifyContent: "center", width: "100%", maxWidth: 760, alignItems: "flex-start" }}>
        {/* Language doc */}
        <div style={{ flex: "0 0 38%", ...animStyle(t, iAt + 0.5, oAt) }}>
          <Panel>
            <div style={{ fontFamily: HE, fontWeight: 700, color: C.muted, fontSize: "clamp(9px,0.75vw,10px)", letterSpacing: "0.08em", marginBottom: 14 }}>
              מדריך שפה
            </div>
            {[
              { label: "אישיות", at: 28.2 },
              { label: "טון דיבור", at: 29.0 },
              { label: "מה כן / מה לא", at: 29.8 },
              { label: "מסרים מרכזיים", at: 30.6 },
            ].map(({ label, at }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9, ...animStyle(t, at, oAt) }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.purple, flexShrink: 0 }} />
                <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.85vw,12px)", color: C.cream }}>{label}</span>
              </div>
            ))}
          </Panel>
        </div>

        {/* Tone comparison */}
        <div style={{ flex: "0 0 54%", display: "flex", flexDirection: "column", gap: 8, ...animStyle(t, 31.5, oAt) }}>
          <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted, textAlign: "center" }}>
            דוגמה לטון ישיר ונגיש
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Before */}
            <div style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.panel }}>
              <div style={{ fontFamily: HE, fontSize: "clamp(8px,0.75vw,10px)", color: C.muted, marginBottom: 5, letterSpacing: "0.06em" }}>לפני</div>
              <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.85vw,12px)", color: "rgba(252,247,244,0.45)" }}>
                אנו עומדים לרשותכם בכל שאלה.
              </span>
            </div>
            {/* Arrow */}
            <div style={{ textAlign: "center", color: C.lime, fontSize: "clamp(12px,1vw,15px)" }}>↓</div>
            {/* After */}
            <div style={{ padding: "10px 14px", border: `1px solid ${C.liBorder}`, borderRadius: 8, background: C.liHigh }}>
              <div style={{ fontFamily: HE, fontSize: "clamp(8px,0.75vw,10px)", color: C.lime, marginBottom: 5, letterSpacing: "0.06em" }}>אחרי</div>
              <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.85vw,12px)", color: C.cream }}>
                משהו לא ברור? דברו איתנו.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 5  (37–46 s)  — copy flows to screens
// ═══════════════════════════════════════════════════════════════════
function Scene5({ t }: { t: number }) {
  const iAt = 37, oAt = 45.6;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "4%", padding: "9% 6% 4%", pointerEvents: t < iAt || t > oAt ? "none" : "auto" }}>
      <Heading text="עכשיו, כותבים." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ display: "flex", gap: "3%", justifyContent: "center", width: "100%", maxWidth: 760, alignItems: "flex-start" }}>
        {/* Doc anchor */}
        <div style={{ flex: "0 0 24%", ...animStyle(t, iAt + 0.5, oAt) }}>
          <Panel style={{ padding: "10px 12px" }}>
            <div style={{ fontFamily: HE, fontSize: "clamp(9px,0.75vw,10px)", color: C.muted, marginBottom: 8 }}>מדריך שפה</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <LineGfx op={0.2} />
              <LineGfx w="80%" op={0.14} />
              <LineGfx w="60%" op={0.1} />
            </div>
          </Panel>
        </div>

        {/* Arrow */}
        <div style={{ flex: "0 0 6%", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 24, ...animStyle(t, iAt + 0.8, oAt) }}>
          <span style={{ color: C.lime, fontSize: "clamp(14px,1.2vw,18px)" }}>→</span>
        </div>

        {/* Two screens */}
        <div style={{ flex: 1, display: "flex", gap: "3%" }}>
          {/* Website */}
          <div style={{ flex: 1, ...animStyle(t, iAt + 1.0, oAt) }}>
            <BrowserChrome>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ height: 4, borderRadius: 2, background: C.lime, opacity: 0.7, width: "60%" }} />
                <div style={{ ...animStyle(t, 39, oAt), display: "flex", flexDirection: "column", gap: 3 }}>
                  <LineGfx op={0.2} />
                  <LineGfx w="85%" op={0.15} />
                  <LineGfx w="70%" op={0.12} />
                </div>
                <div style={{ ...animStyle(t, 40.5, oAt), marginTop: 4 }}>
                  <div style={{ display: "inline-block", padding: "4px 10px", background: C.liHigh, border: `1px solid ${C.liBorder}`, borderRadius: 4 }}>
                    <LineGfx w="40px" op={0.6} color={C.lime} />
                  </div>
                </div>
              </div>
            </BrowserChrome>
            <div style={{ textAlign: "center", marginTop: 6 }}>
              <span style={{ fontFamily: HE, fontSize: "clamp(8px,0.75vw,10px)", color: C.muted }}>אתר</span>
            </div>
          </div>

          {/* App */}
          <div style={{ flex: 1, ...animStyle(t, iAt + 1.5, oAt) }}>
            <BrowserChrome style={{ borderRadius: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ ...animStyle(t, 42.5, oAt), display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ height: 4, borderRadius: 2, background: C.purple, opacity: 0.6, width: "50%" }} />
                  <LineGfx op={0.18} />
                  <LineGfx w="75%" op={0.13} />
                </div>
              </div>
            </BrowserChrome>
            <div style={{ textAlign: "center", marginTop: 6 }}>
              <span style={{ fontFamily: HE, fontSize: "clamp(8px,0.75vw,10px)", color: C.muted }}>אפליקציה</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...animStyle(t, 44, oAt), textAlign: "center" }}>
        <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted }}>
          קופי לאתר, לאפליקציה, לקמפיין — בהתאם להיקף הפרויקט
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 6  (46–55 s)  — brand.md + AI window
// ═══════════════════════════════════════════════════════════════════
function Scene6({ t }: { t: number }) {
  const iAt = 46, oAt = 54.6;
  const aiTyped = typeText("כתבו פוסט לפי הנחיות המותג המצורפות.", t, 51.5, 10);
  const aiDone = t > 51.5 + "כתבו פוסט לפי הנחיות המותג המצורפות.".length / 10;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "4%", padding: "9% 6% 4%", pointerEvents: t < iAt || t > oAt ? "none" : "auto" }}>
      <Heading text="וגם ה־AI שלכם לומד להכיר את המותג." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ display: "flex", gap: "4%", justifyContent: "center", width: "100%", maxWidth: 720, alignItems: "flex-start" }}>
        {/* brand.md file */}
        <div style={{ flex: "0 0 40%", ...animStyle(t, iAt + 0.5, oAt) }}>
          <Panel style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 28, background: "rgba(224,255,92,0.2)", border: `1px solid ${C.liBorder}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: EN, fontSize: 8, color: C.lime, fontWeight: 700 }}>md</span>
              </div>
              <span style={{ fontFamily: EN, fontSize: "clamp(9px,0.85vw,12px)", color: C.lime, direction: "ltr" }}>brand.md</span>
            </div>
            {[
              { label: "מיצוב המותג", at: 47.0 },
              { label: "נרטיב", at: 47.5 },
              { label: "מסרים מרכזיים", at: 48.0 },
              { label: "עקרונות שפה", at: 48.5 },
              { label: "מה כן / מה לא", at: 49.0 },
            ].map(({ label, at }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, ...animStyle(t, at, oAt) }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.lime, opacity: 0.6, flexShrink: 0 }} />
                <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted }}>{label}</span>
              </div>
            ))}
          </Panel>
        </div>

        {/* AI window */}
        <div style={{ flex: 1, ...animStyle(t, 50.0, oAt) }}>
          <BrowserChrome>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Attached file chip */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", background: C.liHigh, border: `1px solid ${C.liBorder}`, borderRadius: 6, alignSelf: "flex-start", direction: "ltr" }}>
                <span style={{ fontFamily: EN, fontSize: "clamp(8px,0.75vw,10px)", color: C.lime }}>📎 brand.md</span>
              </div>
              {/* Chat bubble */}
              <div style={{ padding: "9px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.panel, ...animStyle(t, 51.0, oAt) }}>
                <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.85vw,12px)", color: C.cream }}>
                  {aiTyped}
                </span>
                {!aiDone && t > 51.5 && (
                  <span style={{ width: 1.5, height: "0.9em", background: C.cream, opacity: 0.6, display: "inline-block", verticalAlign: "middle", marginRight: 2 }} />
                )}
              </div>
              {/* AI response lines */}
              {t > 53 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, ...animStyle(t, 53, oAt) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.purpHigh, border: `1px solid ${C.purple}`, flexShrink: 0 }} />
                    <span style={{ fontFamily: HE, fontSize: "clamp(8px,0.75vw,10px)", color: C.muted }}>AI</span>
                  </div>
                  <LineGfx op={0.2} />
                  <LineGfx w="80%" op={0.15} />
                </div>
              )}
            </div>
          </BrowserChrome>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted }}>
              ה־AI כותב — עם ה-DNA של המותג שלכם
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCENE 7  (55–60 s)  — final overview
// ═══════════════════════════════════════════════════════════════════
function Scene7({ t }: { t: number }) {
  const iAt = 55, oAt = 0; // no fade out — holds till end
  const outputs = [
    { label: "אסטרטגיה", icon: "◈", color: C.lilac, at: 55.6 },
    { label: "שם + שפה", icon: "◉", color: C.lime,  at: 56.0 },
    { label: "קופי", icon: "✦", color: C.cream,  at: 56.4 },
    { label: "brand.md", icon: "◍", color: C.lime,  at: 56.8 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4%", padding: "9% 6% 6%", pointerEvents: t < iAt ? "none" : "auto" }}>
      <Heading text="מותג מגובש. שפה משלכם. כלים לעבוד איתם." t={t} inAt={iAt} outAt={oAt} />

      <div style={{ display: "flex", gap: "2%", justifyContent: "center", width: "100%", maxWidth: 640, ...animStyle(t, iAt + 0.4, 0) }}>
        {outputs.map(({ label, icon, color, at }) => (
          <div key={label} style={{ flex: 1, ...animStyle(t, at, 0) }}>
            <Panel style={{ padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: "clamp(16px,1.6vw,22px)", color, marginBottom: 8 }}>{icon}</div>
              <span style={{ fontFamily: HE, fontSize: "clamp(9px,0.8vw,11px)", color: C.muted }}>{label}</span>
            </Panel>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, ...animStyle(t, 57.5, 0) }}>
        <span style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(14px,1.5vw,20px)" }}>
          אילונה אברמסון
        </span>
        <span style={{ fontFamily: HE, fontWeight: 400, color: C.muted, fontSize: "clamp(10px,0.95vw,13px)" }}>
          אסטרטגיית מותג ושפה
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REDUCED MOTION FALLBACK
// ═══════════════════════════════════════════════════════════════════
function ReducedMotionFallback() {
  const steps = [
    { n: "01", title: "ריסרץ'", desc: "החברה, האנשים, המתחרים — מבינים את המקום שלכם בנוף." },
    { n: "02", title: "אסטרטגיה",  desc: "בידול, מיצוב, נרטיב — עמוד השדרה של כל השפה." },
    { n: "03", title: "שיום וטאגליין", desc: "שמות ומסרים שעובדים — לפי הצורך." },
    { n: "04", title: "מדריך שפה", desc: "אישיות, טון דיבור, מה כן ומה לא — הכל בכתב." },
    { n: "05", title: "קופי", desc: "אתר, אפליקציה, קמפיין — בהתאם להיקף הפרויקט." },
    { n: "06", title: "brand.md",  desc: "קובץ מובנה שה-AI שלכם לומד ממנו לכתוב כמו המותג." },
  ];

  return (
    <div style={{ padding: "48px 24px", maxWidth: 640, margin: "0 auto", direction: "rtl" }}>
      <h2 style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(20px,2.4vw,32px)", marginBottom: 40, textAlign: "center" }}>
        תהליך העבודה
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map(({ n, title, desc }) => (
          <div key={n} style={{ display: "flex", gap: 20, padding: "16px 20px", border: `1px solid ${C.border}`, borderRadius: 12 }}>
            <span style={{ fontFamily: EN, fontSize: 11, color: C.muted, minWidth: 24, paddingTop: 2, direction: "ltr" }}>{n}</span>
            <div>
              <div style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(13px,1.2vw,16px)", marginBottom: 6 }}>{title}</div>
              <div style={{ fontFamily: HE, fontSize: "clamp(11px,1vw,13px)", color: C.muted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════
function ProgressBar({ t, total }: { t: number; total: number }) {
  const pct = (t / total) * 100;
  return (
    <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 1, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: C.lime, borderRadius: 1, transition: "none" }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════════════════
function Controls({ status, onPlay, onPause, onRestart }: {
  status: Status;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}) {
  const btnBase: React.CSSProperties = {
    fontFamily: HE, fontSize: "clamp(11px,0.95vw,13px)",
    border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "8px 18px", cursor: "pointer",
    transition: "opacity 0.15s", background: "transparent", color: C.cream,
  };

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
      {status === "ended" ? (
        <button style={{ ...btnBase, background: C.lime, color: C.dark, border: "none" }} onClick={onRestart}>
          ▶ הפעל מחדש
        </button>
      ) : status === "playing" ? (
        <>
          <button style={btnBase} onClick={onPause}>⏸ עצור</button>
          <button style={{ ...btnBase, opacity: 0.5, fontSize: "clamp(10px,0.85vw,11px)" }} onClick={onRestart}>↺</button>
        </>
      ) : (
        <>
          <button style={{ ...btnBase, background: C.lime, color: C.dark, border: "none" }} onClick={onPlay}>
            {status === "idle" ? "▶ הפעל" : "▶ המשך"}
          </button>
          {status === "paused" && (
            <button style={{ ...btnBase, opacity: 0.6 }} onClick={onRestart}>↺ מחדש</button>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function DemoClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [t, setT] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accRef = useRef(0); // accumulated seconds before pause

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const tick = useCallback((now: number) => {
    if (startTimeRef.current === null) return;
    const elapsed = accRef.current + (now - startTimeRef.current) / 1000;
    const clamped = Math.min(elapsed, TOTAL);
    setT(clamped);
    if (clamped < TOTAL) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setStatus("ended");
    }
  }, []);

  const play = useCallback(() => {
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    setStatus("playing");
  }, [tick]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    accRef.current = t;
    startTimeRef.current = null;
    setStatus("paused");
  }, [t]);

  const restart = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    accRef.current = 0;
    startTimeRef.current = null;
    setT(0);
    setStatus("idle");
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  if (reducedMotion) {
    return (
      <div style={{ background: C.dark, minHeight: "100vh", paddingTop: 60 }}>
        <ReducedMotionFallback />
      </div>
    );
  }

  const timeLabel = `${Math.floor(t)}s / ${TOTAL}s`;

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "clamp(53px,6vw,72px)", paddingBottom: 40, direction: "rtl" }}>
      {/* Page title */}
      <div style={{ width: "100%", maxWidth: 900, padding: "24px 24px 16px", textAlign: "center" }}>
        <h1 style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(14px,1.4vw,18px)", margin: 0, opacity: 0.6, letterSpacing: "0.02em" }}>
          תהליך העבודה
        </h1>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", maxWidth: 900, padding: "0 16px" }}>
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: C.dark, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Scene0 t={t} />
            <Scene1 t={t} />
            <Scene2 t={t} />
            <Scene3 t={t} />
            <Scene4 t={t} />
            <Scene5 t={t} />
            <Scene6 t={t} />
            <Scene7 t={t} />

            {/* Idle overlay */}
            {status === "idle" && t === 0 && (
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 16,
                background: "rgba(0,38,7,0.75)", backdropFilter: "blur(2px)",
              }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: HE, fontWeight: 700, color: C.cream, fontSize: "clamp(16px,2vw,26px)", margin: "0 0 8px" }}>
                    תהליך אסטרטגיית מותג ושפה
                  </p>
                  <p style={{ fontFamily: HE, color: C.muted, fontSize: "clamp(11px,1vw,14px)", margin: 0 }}>
                    סרטון הדגמה — כ־60 שניות
                  </p>
                </div>
                <button
                  onClick={play}
                  style={{
                    fontFamily: HE, fontWeight: 700, fontSize: "clamp(12px,1.1vw,15px)",
                    background: C.lime, color: C.dark, border: "none",
                    borderRadius: 10, padding: "11px 28px", cursor: "pointer",
                  }}
                >
                  ▶ הפעל
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div style={{ width: "100%", maxWidth: 900, padding: "14px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <ProgressBar t={t} total={TOTAL} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: EN, fontSize: "clamp(9px,0.75vw,11px)", color: "rgba(252,247,244,0.3)", direction: "ltr" }}>
            {timeLabel}
          </span>
          <Controls status={status} onPlay={play} onPause={pause} onRestart={restart} />
          <div style={{ width: 60 }} />
        </div>
      </div>
    </div>
  );
}
