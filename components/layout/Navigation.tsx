"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const navLinks = [
  { href: "/projects", label: "פרויקטים" },
  { href: "/about", label: "אודות" },
];

const INK   = "#0a1a0d";
const CREAM = "#fcf7f4";
const NEON  = "#e0ff5c";

function CtaPill({ style }: { style?: React.CSSProperties }) {
  return (
    <a
      href="#contact"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: NEON,
        color: INK,
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: "0.875rem",
        padding: "9px 20px",
        borderRadius: 30,
        textDecoration: "none",
        transition: "filter 0.15s ease",
        ...style,
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = "brightness(0.96)")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = "none")}
    >
      <span aria-hidden="true" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>+</span>
      יש לי פרויקט
    </a>
  );
}

export default function Navigation() {
  const pathname  = usePathname();
  const isMobile  = useIsMobile();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 100,
          padding: isMobile ? "0.9rem 1.25rem" : "1.1rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.3s, border-color 0.3s",
          background: scrolled || menuOpen ? "rgba(252,247,244,0.97)" : "var(--bg)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {/* Left side: nav links (desktop) or hamburger (mobile) */}
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="תפריט"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{
              display: "block", width: 22, height: 1,
              background: INK,
              transition: "transform 0.25s, opacity 0.25s",
              transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block", width: 22, height: 1,
              background: INK,
              transition: "opacity 0.25s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 22, height: 1,
              background: INK,
              transition: "transform 0.25s, opacity 0.25s",
              transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }} />
          </button>
        ) : (
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: pathname === link.href ? "var(--purple)" : "var(--muted)",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
            <CtaPill />
          </nav>
        )}

        {/* Logo — right side in RTL */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo.png.png" alt="Ilona Abramson" style={{ height: 18, width: "auto", display: "block", objectFit: "contain" }} />
        </Link>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 53,
              right: 0,
              left: 0,
              zIndex: 99,
              background: CREAM,
              borderBottom: "1px solid var(--rule)",
              display: "flex",
              flexDirection: "column",
              padding: "1rem 1.25rem 1.5rem",
              gap: "1.25rem",
              direction: "rtl",
            }}
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: pathname === link.href ? "var(--purple)" : INK,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
            <CtaPill style={{ alignSelf: "flex-start" }} />
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
