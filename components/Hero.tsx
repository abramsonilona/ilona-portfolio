"use client";

import { useId } from "react";

/* ------------------------------------------------------------------ *
 *  Ilona Abramson — Hero (clean, centered, Webnoise/Selah vibe)
 * ------------------------------------------------------------------ *
 *  Huge English headline "Brand is character." with a neon scribble
 *  under "character", a small quiet Hebrew subline, lots of air, and a
 *  pearl glow over the cream. Navigation lives in the site-wide header,
 *  not here — the hero itself stays uncluttered.
 *
 *  TODO before shipping (marked inline):
 *   1. Swap --font-display / --font-serif for your real fonts.
 *   2. (Optional) replace the inline <Scribble/> with your asset.
 * ------------------------------------------------------------------ */

const COLORS = {
  cream: "#fcf7f4",
  darkGreen: "#002607",
  neon: "#e0ff5c",
  subline: "#3f5040",
};

export default function Hero() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <section dir="rtl" className={`hero-${uid}`} aria-label="כותרת ראשית">
      <div className="hero-content">
        <h1 className="hero-kicker" dir="ltr">
          Brand is{" "}
          <span className="hero-accent">
            character
            <Scribble />
          </span>
          .
        </h1>
        <p className="hero-sub">
          רוצים שיאמינו לכם? <b>תתחילו מהסיפור, לא מהלוגו.</b>
        </p>
      </div>

      <style>{`
        .hero-${uid}{
          position:relative;min-height:100svh;overflow:hidden;background:${COLORS.cream};
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;padding:120px clamp(16px,5vw,72px) 90px;
          width:100%;max-width:100vw;box-sizing:border-box;
          --font-display:"SimplerPro","Heebo",system-ui,sans-serif;
          --font-serif:"EditorNote","Cormorant Garamond",serif;
        }
        /* pearl glow over the cream (no extra color) */
        .hero-${uid}::before{
          content:"";position:absolute;inset:0;z-index:0;pointer-events:none;
          background:
            radial-gradient(100% 80% at 50% 32%, rgba(255,255,255,.85), rgba(255,255,255,0) 58%),
            radial-gradient(80% 60% at 80% 84%, rgba(232,212,255,.18), rgba(232,212,255,0) 62%);
        }

        .hero-${uid} .hero-content{position:relative;z-index:2;width:100%;max-width:900px;}

        .hero-${uid} .hero-kicker{
          direction:ltr;font-family:var(--font-display);font-weight:700;
          font-size:clamp(34px,9vw,124px);line-height:1.0;letter-spacing:-3px;
          color:${COLORS.darkGreen};margin-bottom:26px;
          overflow-wrap:break-word;word-break:break-word;max-width:100%;
        }
        .hero-${uid} .hero-accent{position:relative;display:inline-block;}
        .hero-${uid} .hero-accent svg{
          position:absolute;left:-6px;right:-6px;bottom:-.1em;
          width:calc(100% + 12px);height:.22em;pointer-events:none;
        }

        .hero-${uid} .hero-sub{
          font-family:var(--font-display);font-weight:400;
          font-size:clamp(17px,2.4vw,23px);line-height:1.5;color:${COLORS.subline};
        }
        .hero-${uid} .hero-sub b{font-weight:700;color:${COLORS.darkGreen};}

        @media (max-width:640px){
          .hero-${uid} .hero-kicker{letter-spacing:-1px;}
        }
      `}</style>
    </section>
  );
}

/* Placeholder neon scribble under "character" — replace with your asset. */
function Scribble() {
  return (
    <svg viewBox="0 0 260 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M5 11 C 60 3, 95 16, 135 8 S 220 4, 255 11"
        stroke="#e0ff5c"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
