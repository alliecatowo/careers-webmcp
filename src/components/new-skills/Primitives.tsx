import { RoleKey, ROLE_COLORS } from "./data";

// ─── Badge ───
export function Badge({ role, children }: { role: RoleKey; children: React.ReactNode }) {
  const c = ROLE_COLORS[role];
  return (
    <span
      className="inline-block text-[0.6rem] uppercase tracking-[1px] px-2 py-[2px]"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: c,
        border: `1px solid ${c}33`,
        background: `${c}12`,
      }}
    >
      {children}
    </span>
  );
}

// ─── Callout Box ───
export function CalloutBox({
  role,
  title,
  children,
}: {
  role: RoleKey;
  title?: string;
  children: React.ReactNode;
}) {
  const c = ROLE_COLORS[role];
  return (
    <div
      className="px-6 py-[1.1rem] my-6 border-l-2 text-[0.88rem]"
      style={{ borderColor: c, background: `${c}0a`, color: c }}
    >
      {title && (
        <div
          className="text-[0.62rem] uppercase tracking-[2px] mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {title}
        </div>
      )}
      <p style={{ color: c, margin: 0 }}>{children}</p>
    </div>
  );
}

// ─── Task List ───
export function TaskList({ items }: { items: { role: RoleKey; text: string }[] }) {
  return (
    <ul className="list-none m-0 mt-4">
      {items.map((item, i) => (
        <li
          key={i}
          className="relative pl-5 py-[0.45rem] text-[0.85rem] text-[#4a6080] border-b border-[rgba(23,32,53,0.7)] last:border-0"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span
            className="absolute left-0 top-[0.5rem] text-[0.7rem]"
            style={{ color: ROLE_COLORS[item.role] }}
          >
            ▸
          </span>
          <span dangerouslySetInnerHTML={{ __html: item.text.replace(/<strong>/g, '<strong style="color:#dce8ff">') }} />
        </li>
      ))}
    </ul>
  );
}

// ─── Stack Pills ───
export function StackPills({ items, role }: { items: string[]; role: RoleKey }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {items.map((item) => (
        <Badge key={item} role={role}>
          {item}
        </Badge>
      ))}
    </div>
  );
}

// ─── Section Tag ───
export function SectionTag({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-2 text-[#4a6080] text-[0.62rem] uppercase tracking-[3px] mb-2"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <span style={{ color: "#00ffcc" }}>//</span>
      {label}
    </div>
  );
}

// ─── Section Heading ───
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[#dce8ff] leading-[0.95] tracking-[1px] mb-2"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
      }}
    >
      {children}
    </h2>
  );
}

// ─── Lane Title ───
export function LaneTitle({ role, label }: { role: RoleKey; label: string }) {
  const c = ROLE_COLORS[role];
  return (
    <div
      className="flex items-center gap-2 text-[0.63rem] uppercase tracking-[2px] mb-3 pb-2 border-b border-[#172035]"
      style={{ fontFamily: "'JetBrains Mono', monospace", color: c }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: c }} />
      {label}
    </div>
  );
}
