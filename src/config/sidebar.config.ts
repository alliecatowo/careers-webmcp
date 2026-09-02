import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  GitPullRequest,
  School,
  FolderKanban,
  Wallet,
  Banknote,
  CalendarCheck,
  Award,
  BookUser,
  Building2,
  GraduationCap,
  Sparkles,
  Workflow,
  PieChart,
  ShieldCheck,
  TestTube2,
  FileCheck,
  FileStack,
  BarChart2,
  Trophy
} from "lucide-react";
import { UserRole } from "@/types/contracts";

export type SidebarItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
};

export const ADMIN_SIDEBAR_CONFIG: SidebarItem[] = [
  // Main
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER", "FINANCE", "INTERVIEWER"],
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: PieChart,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/reports",
    label: "Generate Reports",
    icon: BarChart2,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: Briefcase,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/applications",
    label: "Applications",
    icon: FileText,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/documents",
    label: "Documents",
    icon: FileStack,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/candidates",
    label: "Candidates",
    icon: Users,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/interviews",
    label: "Interviews",
    icon: CalendarCheck,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER", "INTERVIEWER"],
  },
  {
    href: "/offers",
    label: "Offers",
    icon: Award,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER", "FINANCE"],
  },
  {
    href: "/project-governance",
    label: "Project Governance",
    icon: FolderKanban,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },
   {
    href: "/banking",
    label: "Banking",
    icon: Banknote,
    allowedRoles: ["SUPER_ADMIN", "FINANCE"],
  },
  {
    href: "/withdrawals",
    label: "Withdrawals",
    icon: Wallet,
    allowedRoles: ["SUPER_ADMIN", "FINANCE"],
  },
  
  // Campus Section
  {
    href: "/campus",
    label: "Campus Dashboard",
    icon: School,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/students",
    label: "Campus Students",
    icon: Users,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/colleges",
    label: "Campus Colleges",
    icon: Building2,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/student-dashboard",
    label: "Student Applications",
    icon: FileText,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/placements",
    label: "Campus Placements",
    icon: GraduationCap,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/workflow",
    label: "Campus Workflow",
    icon: Workflow,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/ai-matching",
    label: "AI Matching",
    icon: Sparkles,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/tier-dashboard",
    label: "Tier Dashboard",
    icon: Trophy,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER"],
  },
  {
    href: "/campus/reports",
    label: "Campus Reports",
    icon: PieChart,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

   // Admin Section
  {
    href: "/users",
    label: "Users",
    icon: BookUser,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },
  // {
  //   href: "/team",
  //   label: "Public Team",
  //   icon: Building2,
  //   allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  // },
  {
    href: "/roles",
    label: "Roles & Permissions",
    icon: ShieldCheck,
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    href: "/audit-logs",
    label: "Audit Logs",
    icon: FileCheck,
    allowedRoles: ["SUPER_ADMIN"],
  },
   {
    href: "/dev-tools",
    label: "Dev Tools",
    icon: TestTube2,
    allowedRoles: ["SUPER_ADMIN"],
  },
  // User Settings
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    allowedRoles: ["ADMIN", "SUPER_ADMIN", "RECRUITER", "FINANCE", "INTERVIEWER"],
  },
];
