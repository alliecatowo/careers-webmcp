"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_SIDEBAR_CONFIG } from "@/config/sidebar.config";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/context/UIContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserRole } from "@/types/contracts";

export default function AdminSidebar() {
  const { user, isLoading: loading, role } = useAuth();
  const pathname = usePathname();
  const { isSidebarCollapsed } = useUI();

  const hasPermission = (allowedRoles?: UserRole[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) return true; // No restriction
    if (!role) return false;
    return allowedRoles.includes(role);
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b h-16 flex items-center">
        <Logo collapsed={isSidebarCollapsed} />
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <TooltipProvider delayDuration={0}>
        {loading ? (
          <div className="space-y-2 px-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !user ? (
            <div className="p-2 text-sm text-muted-foreground">Log in to see navigation.</div>
        ) : (
          <ul>
            {ADMIN_SIDEBAR_CONFIG.map((item) => {
              if (!hasPermission(item.allowedRoles)) {
                return null;
              }
              const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') && pathname.endsWith(item.href);
              return (
                <li key={item.label}>
                   <Tooltip>
                    <TooltipTrigger asChild>
                       <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isSidebarCollapsed && "justify-center",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={cn("truncate", isSidebarCollapsed && "md:hidden")}>{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    {isSidebarCollapsed && (
                       <TooltipContent side="right">
                          {item.label}
                       </TooltipContent>
                    )}
                   </Tooltip>
                </li>
              );
            })}
          </ul>
        )}
        </TooltipProvider>
      </nav>
    </>
  );

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r bg-background fixed h-screen overflow-y-auto z-20 transition-all duration-300 ease-in-out",
      isSidebarCollapsed ? "w-20" : "w-64"
    )}>
      {sidebarContent}
    </aside>
  );
}
