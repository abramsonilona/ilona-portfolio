"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 *  Ilona Abramson — Intro curtain
 * ------------------------------------------------------------------ *
 *  A pearl-glow cream curtain with the line "Anyone can sound perfect.
 *  Few sound real." A neon scribble draws under "real", the line holds,
 *  then the whole curtain slides up to reveal the page beneath.
 *
 *  • Shows ONCE per session (sessionStorage).
 *  • Honors prefers-reduced-motion (no draw, short hold).
 *  • Skip button for control.
 *
 *  Usage: render <Intro/> once at the top of your page/layout, ABOVE
 *  the hero. It's position:fixed so it overlays everything on load.
 *
 *  TODO: connect --font-display to your real font (SimplerPro).
 * ------------------------------------------------------------------ */

const COLORS = {
  cream: "#fcf7f4",
  darkGreen: "#002607",
  neon: "#e0ff5c",
};

export default function Intro() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false); // whether to render the curtain at all
  const [inView, setInView] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [up, setUp] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setMounted(true);
    // Show once per session
    const seen = sessionStorage.getItem("introSeen");
    if (seen) return; // never render the curtain
    sessionStorage.setItem("introSeen", "1");
    setShow(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (fn: () => void, ms: number) =>
      timers.current.push(window.setTimeout(fn, ms));

    if (reduce) {
      setInView(true);
      setDrawn(true);
      t(() => setUp(true), 900);
    } else {
      t(() => setInView(true), 350);
      t(() => setDrawn(true), 1500);
      t(() => setUp(true), 3700);
    }
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const lift = () => {
    timers.current.forEach(clearTimeout);
    setUp(true);
  };

  if (!mounted || !show) return null;

  return (
    <>
      <div
        className={`intro-curtain${up ? " up" : ""}`}
        aria-hidden="true"
        onTransitionEnd={() => up && setShow(false)}
      >
        <div className={`intro-text${inView ? " in" : ""}${drawn ? " drawn" : ""}`} dir="ltr">
          Anyone can sound perfect.
          <br />
          Few sound{" "}
          <span className="intro-scribble">
            real
            <svg viewBox="0 0 120 18" fill="none" aria-hidden="true">
              <path
                d="M4 11 C 28 3, 46 15, 64 8 S 98 4, 116 11"
                stroke={COLORS.neon}
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          .
        </div>
      </div>

      {!up && (
        <button className="intro-skip" onClick={lift} aria-label="דלג על האינטרו">
          דלג ←
        </button>
      )}

      <style>{`
        .intro-curtain{
          position:fixed;inset:0;z-index:200;background:${COLORS.cream};
          display:flex;align-items:center;justify-content:center;padding:24px;
          transition:transform 1.15s cubic-bezier(.76,0,.24,1);
          --font-display:"SimplerPro","Heebo",system-ui,sans-serif;
          --font-serif:"EditorNote","Cormorant Garamond",serif;
        }
        .intro-curtain::before{
          content:"";position:absolute;inset:0;pointer-events:none;
          background:
            radial-gradient(100% 80% at 50% 40%, rgba(255,255,255,.9), rgba(255,255,255,0) 60%),
            radial-gradient(80% 60% at 68% 76%, rgba(232,212,255,.16), rgba(232,212,255,0) 65%);
        }
        .intro-curtain.up{transform:translateY(-100%);}

        .intro-text{
          position:relative;direction:ltr;font-family:var(--font-display);font-weight:700;
          font-size:clamp(28px,6.5vw,64px);line-height:1.1;letter-spacing:-1.8px;
          color:${COLORS.darkGreen};text-align:center;max-width:18ch;width:100%;
          overflow-wrap:break-word;word-break:break-word;
          opacity:0;transform:translateY(12px);
          transition:opacity 1s ease,transform 1s ease;
        }
        .intro-text.in{opacity:1;transform:none;}
        .intro-scribble{position:relative;display:inline-block;}
        .intro-scribble svg{
          position:absolute;left:-4px;right:-4px;bottom:-.12em;
          width:calc(100% + 8px);height:.24em;opacity:0;transition:opacity .1s ease;
        }
        .intro-scribble svg path{
          stroke-dasharray:240;stroke-dashoffset:240;
          transition:stroke-dashoffset .8s ease;
        }
        .intro-text.drawn .intro-scribble svg{opacity:1;}
        .intro-text.drawn .intro-scribble svg path{stroke-dashoffset:0;}

        .intro-skip{
          position:fixed;bottom:24px;left:24px;z-index:201;
          font-family:var(--font-display);font-size:13px;letter-spacing:.3px;
          color:rgba(0,38,7,.45);background:none;border:none;cursor:pointer;
        }
        .intro-skip:hover{color:${COLORS.darkGreen};}

        @media (prefers-reduced-motion:reduce){
          .intro-curtain,.intro-text,.intro-scribble svg path{transition:none;}
        }
      `}</style>
    </>
  );
}
