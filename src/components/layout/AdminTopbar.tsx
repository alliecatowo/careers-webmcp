'use client';

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./logo";
import { ADMIN_SIDEBAR_CONFIG } from "@/config/sidebar.config";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/context/UIContext";
import { NotificationBell } from "@/features/notifications";
import { RoleSwitcher } from "../shared/RoleSwitcher";
import { UserRole } from "@/types/contracts";

const MobileSidebarContent = () => {
    const { user, isLoading: loading, role } = useAuth();
    const pathname = usePathname();

    const hasPermission = (allowedRoles?: UserRole[]): boolean => {
      if (!allowedRoles || allowedRoles.length === 0) return true; // No restriction
      if (!role) return false;
      return allowedRoles.includes(role);
    }

    return (
        <>
            <div className="p-4 border-b h-16 flex items-center">
                <Logo />
            </div>
            <nav className="flex-1 px-4 py-2">
                {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                ) : !user ? (
                    <div className="p-2 text-sm text-muted-foreground">Please log in.</div>
                ) : (
                <ul className="space-y-1">
                    {ADMIN_SIDEBAR_CONFIG.map((item) => {
                    if (!hasPermission(item.allowedRoles)) {
                        return null;
                    }
                    const isActive = item.href === '/analytics' ? pathname === item.href : (pathname.startsWith(item.href) && pathname.endsWith(item.href));
                    return (
                        <li key={item.label}>
                        <Link
                            href={item.href}
                            className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                        </li>
                    );
                    })}
                </ul>
                )}
            </nav>
        </>
    )
}


export default function AdminTopbar() {
  const { isSidebarCollapsed, toggleSidebar } = useUI();
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-10">
       <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={toggleSidebar}>
              {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 flex flex-col">
                        <MobileSidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
       </div>

        <div className="hidden md:block">
            <RoleSwitcher />
        </div>
        
        <div className="w-full flex-1" />

        <div className="flex items-center gap-2">
            <NotificationBell />
            <UserNav />
        </div>
    </header>
  );
}
