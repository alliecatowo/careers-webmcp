"use client";

import { motion } from "framer-motion";
import { ROLES, ROLE_COLORS } from "./data";
import { SectionTag, SectionHeading, TaskList, StackPills, CalloutBox } from "./Primitives";

export default function RolesSection() {
  return (
    <section className="py-[72px] border-t border-[#172035]">
      <SectionTag label="Section 01" />
      <SectionHeading>
        THE 4 <span style={{ color: ROLE_COLORS.ai }}>ROLES</span><br />DEFINED
      </SectionHeading>
      <p className="text-[#4a6080] text-[0.9rem] mb-8 max-w-[640px]" style={{ fontFamily: "'Syne', sans-serif" }}>
        Each role owns a specific domain. Nobody steps on each other. Outputs are contracts — one
        person's output is the next person's input.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {ROLES.map((role, i) => {
          const c = ROLE_COLORS[role.key];
          return (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="relative overflow-hidden p-7 border border-[#1e2d47] hover:-translate-y-1 transition-transform"
              style={{
                background: "#080d18",
                borderLeft: `3px solid ${c}`,
              }}
            >
              {/* Ghost number */}
              <div
                className="absolute right-6 bottom-4 leading-none pointer-events-none select-none"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "5rem",
                  opacity: 0.04,
                  color: "#dce8ff",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-[2.5rem] leading-none">{role.icon}</div>
                  <div
                    className="tracking-[1px] mt-1"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: c }}
                  >
                    {role.name}
                  </div>
                  <div
                    className="text-[#4a6080] tracking-[2px] text-[0.68rem] uppercase mt-0.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {role.sub}
                  </div>
                </div>
                <span
                  className="text-[0.62rem] uppercase tracking-[2px] px-2.5 py-[3px] border"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: c,
                    borderColor: `${c}4d`,
                    background: `${c}0d`,
                  }}
                >
                  {role.badge}
                </span>
              </div>

              <p className="text-[#4a6080] text-[0.9rem] mb-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                {role.desc}
              </p>

              <CalloutBox role={role.key} title="Primary Output">
                {role.primaryOutput}
              </CalloutBox>

              <h3
                className="uppercase tracking-[2px] mb-3"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: c }}
              >
                Owns These Systems
              </h3>
              <TaskList items={role.tasks} />

              <h3
                className="uppercase tracking-[2px] mt-4 mb-2"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: c }}
              >
                {role.stackLabel}
              </h3>
              <StackPills items={role.stack} role={role.key} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
