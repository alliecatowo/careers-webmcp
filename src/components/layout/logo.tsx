
import { Bot } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2 font-bold text-xl text-foreground">
      <div className="bg-foreground text-background p-2 rounded-lg">
        <Bot className="h-6 w-6" />
      </div>
      <span className={cn("font-headline tracking-tight", collapsed && "md:hidden")}>Baalvion</span>
    </div>
  );
}
