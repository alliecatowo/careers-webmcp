
import React from "react";
import { Separator } from "@/components/ui/separator";

interface JobSectionProps {
    title: string;
    children: React.ReactNode;
}

export function JobSection({ title, children }: JobSectionProps) {
    return (
        <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">{title}</h2>
            {children}
        </section>
    );
}
