"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/projects", label: "פרויקטים" },
  { href: "/about", label: "אודות" },
  { href: "mailto:abramsonilona@gmail.com", label: "בואו נדבר", external: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        padding: "1.1rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.3s, border-color 0.3s",
        background: scrolled ? "rgba(252,247,244,0.96)" : "var(--bg)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      {/* Nav links — left side in RTL (flex row, natural order puts these on the left) */}
      <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {navLinks.map(link => (
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "var(--muted)",
                transition: "color 0.2s",
                letterSpacing: "0",
              }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--purple)")}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--muted)")}
            >
              {link.label}
            </a>
          ) : (
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
          )
        ))}
      </nav>

      {/* Logo — right side in RTL */}
      <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
        <img src="/logo.png.png" alt="Ilona Abramson" style={{ height: 18, width: "auto", display: "block", objectFit: "contain" }} />
      </Link>
    </motion.header>
  );
}
