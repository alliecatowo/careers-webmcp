"use client";

import { motion } from "framer-motion";
import { KPI_ITEMS, ROLE_COLORS } from "./data";

const PILLS = [
  { key: "ai",  label: "AI Automation Expert" },
  { key: "be",  label: "Backend Developer" },
  { key: "fe",  label: "Frontend Developer" },
  { key: "seo", label: "SEO Strategist" },
  { key: "pm",  label: "Project Lead" },
] as const;

export default function HeroSection() {
  return (
    <div className="pt-[110px] pb-[70px]">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 border px-3.5 py-[5px] mb-8"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#00ffcc",
          borderColor: "rgba(0,255,204,0.2)",
        }}
      >
        <span>●</span> Team Sprint Blueprint · 4 Roles · 7 Days · 1 Platform
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="leading-[0.92] tracking-[1px] mb-7"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3rem, 9vw, 6.5rem)",
          color: "#dce8ff",
        }}
      >
        WHO BUILDS<br />
        <span style={{ color: ROLE_COLORS.ai }}>WHAT.</span>{" "}
        <span style={{ color: ROLE_COLORS.be }}>WHEN.</span><br />
        <span style={{ color: ROLE_COLORS.seo }}>HOW</span> THEY<br />
        <span style={{ color: ROLE_COLORS.pm }}>CONNECT.</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[1rem] text-[#4a6080] max-w-[640px] leading-[1.8] mb-10"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        A precise, role-separated sprint plan for the ImperialPedia AI Financial Intelligence Platform.
        Every person knows exactly what to build, when to hand it off, and how their work plugs into
        everyone else's. Zero confusion. Full velocity.
      </motion.p>

      {/* Role pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        {PILLS.map((p) => {
          const c = ROLE_COLORS[p.key];
          return (
            <div
              key={p.key}
              className="flex items-center gap-2 border px-4 py-[6px]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: c,
                borderColor: `${c}59`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
              {p.label}
            </div>
          );
        })}
      </motion.div>

      {/* KPI row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[1px] border border-[#1e2d47]"
        style={{ background: "#1e2d47" }}
      >
        {KPI_ITEMS.map((k) => (
          <div
            key={k.label}
            className="text-center py-5 px-4"
            style={{ background: "#080d18" }}
          >
            <div
              className="leading-none tracking-[1px]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2rem",
                color: ROLE_COLORS[k.color],
              }}
            >
              {k.n}
            </div>
            <div
              className="text-[#4a6080] mt-1"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {k.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
