"use client";

import { motion } from "framer-motion";
import { SPRINT_DAYS, ROLE_COLORS } from "./data";
import { SectionTag, SectionHeading, LaneTitle, TaskList, Badge } from "./Primitives";

export default function SprintPlanSection() {
  const legendItems = [
    { key: "ai" as const, label: "AI Automation" },
    { key: "be" as const, label: "Backend Dev" },
    { key: "fe" as const, label: "Frontend Dev" },
    { key: "seo" as const, label: "SEO Strategist" },
    { key: "pm" as const, label: "All Roles / PM" },
  ];

  return (
    <section className="py-[72px] border-t border-[#172035]">
      <SectionTag label="Section 04" />
      <SectionHeading>
        THE 7-DAY<br />
        <span style={{ color: ROLE_COLORS.pm }}>SPRINT PLAN</span>
      </SectionHeading>
      <p className="text-[#4a6080] text-[0.9rem] mb-8 max-w-[640px]" style={{ fontFamily: "'Syne', sans-serif" }}>
        Every day, every role, every deliverable. Nothing is left ambiguous. If it's not here, it's
        not happening this week.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 mb-8">
        {legendItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#4a6080" }}>
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: ROLE_COLORS[item.key] }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Day blocks */}
      <div className="flex flex-col gap-5">
        {SPRINT_DAYS.map((day, i) => {
          const numColor = ROLE_COLORS[day.color];
          return (
            <motion.div
              key={day.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="border border-[#1e2d47] overflow-hidden"
              style={{ background: "#080d18" }}
            >
              {/* Day header */}
              <div className="flex flex-wrap items-center gap-6 px-6 py-4 border-b border-[#172035]" style={{ background: "#0e1524" }}>
                <div
                  className="leading-none flex-shrink-0"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", color: numColor }}
                >
                  {day.num}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div
                    className="uppercase tracking-[2px] font-bold text-[0.95rem] text-[#dce8ff]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {day.title}
                  </div>
                  <div
                    className="text-[#4a6080] mt-0.5 tracking-[1px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
                  >
                    {day.goal}
                  </div>
                </div>
                <Badge role={day.badgeRole}>{day.badge}</Badge>
              </div>

              {/* Day body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left lanes */}
                  <div className="flex flex-col gap-5">
                    {day.leftLanes.map((lane) => (
                      <div key={lane.role + lane.title}>
                        <LaneTitle role={lane.role} label={lane.title} />
                        <TaskList items={lane.tasks} />
                      </div>
                    ))}
                  </div>
                  {/* Right lanes */}
                  <div className="flex flex-col gap-5">
                    {day.rightLanes.map((lane) => (
                      <div key={lane.role + lane.title}>
                        <LaneTitle role={lane.role} label={lane.title} />
                        <TaskList items={lane.tasks} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success box */}
                {day.successBox && (
                  <div
                    className="mt-5 px-6 py-[1.1rem] border-l-2 text-[0.88rem]"
                    style={{
                      borderColor: ROLE_COLORS[day.successBox.role],
                      background: `${ROLE_COLORS[day.successBox.role]}0a`,
                      color: ROLE_COLORS[day.successBox.role],
                    }}
                  >
                    <div
                      className="text-[0.62rem] uppercase tracking-[2px] mb-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {day.successBox.title}
                    </div>
                    <p style={{ color: ROLE_COLORS[day.successBox.role], margin: 0, fontFamily: "'Syne', sans-serif" }}>
                      {day.successBox.text}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
