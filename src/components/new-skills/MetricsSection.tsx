"use client";

import { SUCCESS_METRICS, ROLE_COLORS } from "./data";
import { SectionTag, SectionHeading, Badge } from "./Primitives";

export default function MetricsSection() {
  return (
    <section className="py-[72px] border-t border-[#172035]">
      <SectionTag label="Section 06" />
      <SectionHeading>
        SUCCESS<br />
        <span style={{ color: ROLE_COLORS.seo }}>METRICS</span> PER ROLE
      </SectionHeading>
      <p className="text-[#4a6080] text-[0.9rem] mb-8 max-w-[640px]" style={{ fontFamily: "'Syne', sans-serif" }}>
        Every role is measured by specific, observable numbers. No ambiguity about what "done" means.
      </p>

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}
        >
          <thead>
            <tr style={{ background: "#0e1524", borderBottom: "1px solid #1e2d47" }}>
              {["Role", "Day 3 Check", "Day 5 Check", "Day 7 Done Criteria"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[#4a6080] uppercase tracking-[2px]"
                  style={{ fontSize: "0.62rem" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SUCCESS_METRICS.map((row) => {
              const c = ROLE_COLORS[row.role];
              return (
                <tr key={row.role} className="border-b border-[#172035] hover:bg-[rgba(14,21,36,0.7)] transition-colors">
                  <td className="px-4 py-3" style={{ color: c }}>
                    {row.icon} {row.name}
                  </td>
                  <td className="px-4 py-3 text-[#dce8ff] text-[0.72rem] leading-[1.5]">{row.day3}</td>
                  <td className="px-4 py-3 text-[#dce8ff] text-[0.72rem] leading-[1.5]">{row.day5}</td>
                  <td className="px-4 py-3">
                    <Badge role={row.role}>{row.done}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
