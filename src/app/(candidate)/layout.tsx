
"use client";

import { Logo } from "@/components/layout/logo";
import { UserNav } from "@/components/layout/user-nav";
import { ProtectedRoute } from "@/modules/auth/guards/ProtectedRoute";
import { ScrollRestoration } from "@/components/system/ScrollRestoration";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ScrollRestoration />
      <div className="min-h-screen flex flex-col bg-muted/40">
          <header className="p-4 border-b bg-background sticky top-0 z-10">
              <div className="container mx-auto flex justify-between items-center">
                  <Logo />
                  <UserNav />
              </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
          </main>
          <footer className="p-8 bg-background border-t">
              <div className="container mx-auto text-center text-xs text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} Baalvion Global Hiring Infrastructure. All rights reserved.</p>
              </div>
          </footer>
      </div>
    </ProtectedRoute>
  );
}
