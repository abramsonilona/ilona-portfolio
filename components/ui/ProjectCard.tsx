"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.slug}`} style={{ display: "block", textDecoration: "none" }}>
        <div
          style={{ transition: "transform 0.3s ease" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-4px)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
        >
          {/* Cover block */}
          <div
            style={{
              height: "260px",
              background: project.color ?? "var(--lilac)",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              padding: "1.5rem",
            }}
          >
            {/* Category */}
            <span style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              fontFamily: "var(--font-body-en)",
              fontSize: "0.7rem",
              fontWeight: 300,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--green)",
              background: "rgba(255,255,255,0.55)",
              padding: "0.25rem 0.65rem",
            }}>
              {project.category}
            </span>

            {/* Year */}
            <span style={{
              position: "absolute",
              bottom: "1.25rem",
              left: "1.25rem",
              fontFamily: "var(--font-body-en)",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "rgba(0,38,7,0.5)",
            }}>
              {project.year}
            </span>

            {/* Arrow (RTL: points left = forward) */}
            <div style={{
              position: "absolute",
              bottom: "1.25rem",
              right: "1.25rem",
              width: 34,
              height: 34,
              border: "1px solid var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green)",
              fontSize: "1rem",
            }}>
              ←
            </div>
          </div>

          {/* Text */}
          <div style={{
            padding: "1.25rem 0 1.5rem",
            borderBottom: "1px solid var(--rule)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--green)",
              marginBottom: "0.35rem",
            }}>
              {project.title}
            </h3>
            <p style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-body-en)",
              fontWeight: 300,
              lineHeight: 1.55,
            }}>
              {project.subtitle}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
