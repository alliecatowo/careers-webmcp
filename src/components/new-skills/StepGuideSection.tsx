"use client";

import { motion } from "framer-motion";
import { AI_STEPS, BE_STEPS, FE_STEPS, SEO_STEPS, ROLE_COLORS, StepItem } from "./data";
import { SectionTag, SectionHeading, CalloutBox } from "./Primitives";

function StepGuide({ steps }: { steps: StepItem[] }) {
  return (
    <div className="border-t border-[#172035]">
      {steps.map((step, i) => {
        const c = ROLE_COLORS[step.role];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
            className="flex gap-5 py-5 border-b border-[#172035] items-start"
          >
            {/* Step number */}
            <div
              className="flex-shrink-0 w-10 text-right leading-none opacity-25"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.2rem",
                color: c,
                opacity: 0.25,
              }}
            >
              {step.num}
            </div>
            {/* Content */}
            <div className="flex-1">
              <div
                className="text-[0.62rem] uppercase tracking-[2px] mb-1"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: c }}
              >
                {step.dayTag}
              </div>
              <div
                className="font-bold text-[1rem] mb-2 text-[#dce8ff]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {step.title}
              </div>
              <div
                className="text-[0.85rem] text-[#4a6080] leading-[1.7]"
                style={{ fontFamily: "'Syne', sans-serif" }}
                dangerouslySetInnerHTML={{ __html: step.desc.replace(/`([^`]+)`/g, `<code style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:${c};background:${c}14;padding:1px 4px">$1</code>`) }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const ROLE_GUIDES = [
  { key: "ai" as const, icon: "🤖", label: "AI Automation Expert — Step-by-Step Guide", steps: AI_STEPS },
  { key: "be" as const, icon: "⚙️", label: "Backend Developer — Step-by-Step Guide",    steps: BE_STEPS },
  { key: "fe" as const, icon: "🖥️", label: "Frontend Developer — Step-by-Step Guide",   steps: FE_STEPS },
  { key: "seo" as const, icon: "📈", label: "SEO Strategist — Step-by-Step Guide",       steps: SEO_STEPS },
];

export default function StepGuideSection() {
  return (
    <section className="py-[72px] border-t border-[#172035]">
      <SectionTag label="Section 03" />
      <SectionHeading>
        STEP-BY-STEP<br />
        <span style={{ color: ROLE_COLORS.be }}>GUIDE</span> FOR EACH ROLE
      </SectionHeading>
      <p className="text-[#4a6080] text-[0.9rem] mb-10 max-w-[640px]" style={{ fontFamily: "'Syne', sans-serif" }}>
        Below is a clear, numbered guide for each role — what to do, in what order, why it matters.
        Read your role top-to-bottom. Follow this exactly.
      </p>

      <div className="flex flex-col gap-12">
        {ROLE_GUIDES.map((guide) => (
          <div key={guide.key} className="mt-10 first:mt-0">
            <CalloutBox role={guide.key} title={`${guide.icon} ${guide.label}`}>
              {""}
            </CalloutBox>
            <StepGuide steps={guide.steps} />
          </div>
        ))}
      </div>
    </section>
  );
}
