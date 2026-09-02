"use client";

import { motion } from "framer-motion";
import { HANDOFFS, ROLE_COLORS } from "./data";
import { SectionTag, SectionHeading, Badge } from "./Primitives";

export default function ConnectionSection() {
  return (
    <section className="py-[72px] border-t border-[#172035]">
      <SectionTag label="Section 02" />
      <SectionHeading>
        HOW THEY<br />
        <span style={{ color: ROLE_COLORS.ai }}>CONNECT</span> &amp; TALK
      </SectionHeading>
      <p className="text-[#4a6080] text-[0.9rem] mb-8 max-w-[640px]" style={{ fontFamily: "'Syne', sans-serif" }}>
        Every role produces an output. That output becomes another role's input. These are the official
        handoff points — the moments where one person's work unlocks the next person's work.
      </p>

      {/* Dependency diagram */}
      <div
        className="border border-[#1e2d47] p-8 mb-8 overflow-x-auto"
        style={{ background: "#080d18", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.77rem" }}
      >
        <div
          className="text-center text-[#4a6080] tracking-[3px] mb-6"
          style={{ fontSize: "0.7rem" }}
        >
          — DEPENDENCY MAP —
        </div>
        <pre className="text-[0.76rem] leading-[1.8] overflow-x-auto whitespace-pre text-[#4a6080]">
{`  `}<NodeTag role="seo">SEO STRATEGIST</NodeTag>{`
        │
        │  delivers: keyword_list.json + article_template.txt
        │  (Day 1 → Day 2 unlock)
        ▼
  `}<NodeTag role="ai">AI AUTOMATION EXPERT</NodeTag>{`  ◄─────────────────────────┐
        │                                                  │
        │  delivers: pipeline.py running on cron           │
        │  → saves articles to PostgreSQL                 │
        │  → saves embeddings to pgvector                 │
        ▼                                                  │
  `}<NodeTag role="be">BACKEND DEVELOPER</NodeTag>{`                              │
        │                                                  │
        │  delivers: FastAPI server at api.imperialpedia.com
        │  GET /articles, GET /articles/:slug, GET /trending
        │                                                  │
        │  also provides: DB schema to AI Expert (Day 1) ─┘
        ▼
  `}<NodeTag role="fe">FRONTEND DEVELOPER</NodeTag>{`
        │
        │  delivers: imperialpedia.com live on Vercel
        │  consumes: Backend API endpoints
        │  produces: sitemap.xml → submits to GSC
        ▼
  `}<NodeTag role="seo">SEO STRATEGIST</NodeTag>{`  (receives sitemap, monitors GSC, validates schema)
        │
        ▼
    GOOGLE SEARCH  →  Rankings  →  Traffic  →  Revenue`}
        </pre>
      </div>

      {/* Handoff contracts */}
      <h3
        className="uppercase tracking-[2px] mb-4"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#dce8ff" }}
      >
        Official Handoff Contracts
      </h3>

      <div className="flex flex-col gap-3">
        {HANDOFFS.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex flex-wrap items-center gap-3 border border-[#1e2d47] px-6 py-4"
            style={{ background: "#0e1524", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}
          >
            <Badge role={h.from}>{h.fromLabel}</Badge>
            <span className="text-[#4a6080] text-base">→</span>
            <Badge role={h.to}>{h.toLabel}</Badge>
            <span className="text-[#dce8ff] flex-1 text-[0.75rem] min-w-[200px]">{h.what}</span>
            <span className="text-[#4a6080] text-[0.65rem] whitespace-nowrap">{h.when}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function NodeTag({ role, children }: { role: "ai"|"be"|"fe"|"seo"|"pm"; children: React.ReactNode }) {
  const c = ROLE_COLORS[role];
  return (
    <span
      className="inline-block px-3 py-[4px] text-[0.72rem]"
      style={{ background: `${c}14`, color: c, border: `1px solid ${c}4d` }}
    >
      {children}
    </span>
  );
}
