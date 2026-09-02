"use client";

export default function SprintNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 h-[54px]
      bg-[rgba(4,7,15,0.9)] backdrop-blur-2xl border-b border-[#1e2d47]">
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-2 rounded-full bg-[#00ffcc]"
          style={{ animation: "blink 1.5s infinite" }}
        />
        <span
          className="text-[#dce8ff] tracking-[3px]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem" }}
        >
          IMPERIALPEDIA
        </span>
      </div>
      <div
        className="text-[#4a6080] tracking-[2px] text-[0.65rem] hidden sm:block"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        7-DAY TEAM SPRINT · LIVE DOC
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </nav>
  );
}
