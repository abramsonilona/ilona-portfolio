"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", flexDirection: "column", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p style={{ fontFamily: "var(--font-caption)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.5rem" }}>
          שגיאה 404
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem" }}>הדף לא נמצא</h1>
        <p style={{ color: "var(--ash)", marginBottom: "2.5rem" }}>נראה שהקישור הוביל לאן שלא תכניתם.</p>
        <Link href="/" style={{
          display: "inline-block",
          padding: "0.85rem 2rem",
          background: "var(--ink)",
          color: "var(--warm-white)",
          fontFamily: "var(--font-caption)",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
        }}>
          חזרה לבית
        </Link>
      </motion.div>
    </div>
  );
}
