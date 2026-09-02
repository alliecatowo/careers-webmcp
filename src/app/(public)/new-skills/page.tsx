import ConnectionSection from "@/components/new-skills/ConnectionSection";
import HeroSection from "@/components/new-skills/HeroSection";
import MetricsSection from "@/components/new-skills/MetricsSection";
import RolesSection from "@/components/new-skills/RolesSection";
import SprintFooter from "@/components/new-skills/SprintFooter";
import SprintNavbar from "@/components/new-skills/SprintNavbar";
import SprintPlanSection from "@/components/new-skills/SprintPlanSection";
import StandupSection from "@/components/new-skills/StandupSection";
import StepGuideSection from "@/components/new-skills/StepGuideSection";

export default function SprintPage() {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "#04070f", color: "#dce8ff" }}
    >
      {/* Dot grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(108,143,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient blobs */}
      <div className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 500, height: 500, top: -100, left: -100, background: "rgba(0,255,204,0.04)", filter: "blur(120px)" }}
      />
      <div className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 600, height: 400, top: "40%", right: -150, background: "rgba(108,143,255,0.05)", filter: "blur(120px)" }}
      />
      <div className="fixed rounded-full pointer-events-none z-0"
        style={{ width: 400, height: 400, bottom: "10%", left: "20%", background: "rgba(199,125,255,0.04)", filter: "blur(120px)" }}
      />

      {/* Nav */}
      {/* <SprintNavbar /> */}

      {/* Content */}
      <div className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-8">
        <HeroSection />
        <RolesSection />
        <ConnectionSection />
        <StepGuideSection />
        <SprintPlanSection />
        <StandupSection />
        <MetricsSection />
        {/* <SprintFooter /> */}
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        strong { color: #dce8ff !important; }
        code { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }
      `}</style>
    </div>
  );
}
