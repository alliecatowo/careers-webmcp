'use client';
import { cn } from "@/lib/utils";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useUI } from "@/context/UIContext";
import { GlobalLoadingBar } from "./GlobalLoadingBar";
import { Breadcrumbs } from "./Breadcrumbs";
import { SkipToContent } from "../system/SkipToContent";
import { motion } from 'framer-motion';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed } = useUI();

  return (
    <div className="flex h-screen bg-muted/40">
      <SkipToContent />
      <AdminSidebar />
      <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <GlobalLoadingBar />
        <AdminTopbar />
        <motion.main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Breadcrumbs />
          </div>
          {children}
        </motion.main>
      </div>
    </div>
  );
}
