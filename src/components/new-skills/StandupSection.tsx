"use client";

import { STANDUP_CODE, COMM_RULES, ROLE_COLORS } from "./data";
import { SectionTag, SectionHeading, Badge } from "./Primitives";

export default function StandupSection() {
  return (
    <section className="py-[72px] border-t border-[#172035]">
      <SectionTag label="Section 05" />
      <SectionHeading>
        DAILY<br />
        <span style={{ color: ROLE_COLORS.pm }}>STANDUP</span> FORMAT
      </SectionHeading>
      <p className="text-[#4a6080] text-[0.9rem] mb-6 max-w-[640px]" style={{ fontFamily: "'Syne', sans-serif" }}>
        Every day at 9AM, all 4 roles do a 15-minute standup. Use this format. Keep it sharp. No war
        stories.
      </p>

      {/* Code block */}
      <div className="border border-[#1e2d47] mb-8 overflow-x-auto" style={{ background: "#020408" }}>
        <div
          className="px-6 py-3 border-b border-[#172035] text-[#4a6080] uppercase tracking-[2px]"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
        >
          Daily Standup Template — 15 Minutes Max
        </div>
        <pre
          className="px-6 py-5 text-[0.76rem] leading-[1.8] overflow-x-auto whitespace-pre"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#4a6080" }}
        >
          {STANDUP_CODE.split('\n').map((line, i) => {
            if (line.includes('STANDUP FORMAT') || line.includes('(shared doc')) {
              return <span key={i} style={{ color: "#00ffcc" }}>{line}{'\n'}</span>;
            }
            if (line.match(/^\s*(1\.|2\.|3\.)/)) {
              return <span key={i} style={{ color: "#ffcc66" }}>{line}{'\n'}</span>;
            }
            if (line.includes('✅')) {
              return <span key={i} style={{ color: "#7ec8a4" }}>{line}{'\n'}</span>;
            }
            if (line.includes('❌')) {
              return <span key={i} style={{ color: "#ff6b6b" }}>{line}{'\n'}</span>;
            }
            return <span key={i}>{line}{'\n'}</span>;
          })}
        </pre>
      </div>

      {/* Comm rules table */}
      <h3
        className="uppercase tracking-[2px] mb-4 mt-8"
        style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#dce8ff" }}
      >
        Communication Rules
      </h3>

      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}
        >
          <thead>
            <tr style={{ background: "#0e1524", borderBottom: "1px solid #1e2d47" }}>
              {["Channel", "Used For", "Response SLA"].map((h) => (
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
            {COMM_RULES.map((row) => (
              <tr key={row.channel} className="border-b border-[#172035] hover:bg-[rgba(14,21,36,0.7)] transition-colors">
                <td className="px-4 py-3 text-[#dce8ff]">{row.channel}</td>
                <td className="px-4 py-3 text-[#4a6080]">{row.use}</td>
                <td className="px-4 py-3">
                  <Badge role={row.slaRole}>{row.sla}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
