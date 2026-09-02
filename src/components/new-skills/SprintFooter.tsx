export default function SprintFooter() {
  return (
    <footer className="border-t border-[#172035] py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4a6080" }}
      >
        <span className="tracking-[1px] text-center sm:text-left">
          IMPERIALPEDIA · 7-DAY TEAM SPRINT BLUEPRINT · CONFIDENTIAL
        </span>
        <span className="tracking-[1px]">Built with Claude · imperialpedia.com</span>
      </div>
    </footer>
  );
}
